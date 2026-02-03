/**
 * Progress Tracking Utility for Vidhya Learning Platform
 * Manages course progress in localStorage with real-time updates
 */

const STORAGE_KEY = 'vidhya_course_progress'

/**
 * Get all course progress from localStorage
 */
export function getAllProgress() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch (error) {
    console.error('Error reading progress:', error)
    return {}
  }
}

/**
 * Get progress for a specific course
 */
export function getCourseProgress(courseId) {
  const allProgress = getAllProgress()
  return (
    allProgress[courseId] || {
      courseId,
      completedLessons: [],
      videoProgress: {},
      completedMCQs: [],
      mcqScores: {},
      notesRead: [],
      status: 'not-started', // not-started, in-progress, completed
      lastAccessed: null,
      startedAt: null,
      completedAt: null,
      overallProgress: 0,
    }
  )
}

/**
 * Mark a lesson video as watched
 */
export function markVideoWatched(courseId, lessonId, watchPercentage = 100) {
  const allProgress = getAllProgress()
  const courseProgress = getCourseProgress(courseId)

  // Update video progress
  courseProgress.videoProgress[lessonId] = {
    watched: true,
    percentage: watchPercentage,
    watchedAt: new Date().toISOString(),
  }

  // Add to completed lessons if fully watched
  if (watchPercentage >= 80 && !courseProgress.completedLessons.includes(lessonId)) {
    courseProgress.completedLessons.push(lessonId)
  }

  // Update status and timestamps
  if (!courseProgress.startedAt) {
    courseProgress.startedAt = new Date().toISOString()
  }
  courseProgress.lastAccessed = new Date().toISOString()
  courseProgress.status = 'in-progress'

  // Save updated progress
  allProgress[courseId] = courseProgress
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress))

  return courseProgress
}

/**
 * Mark notes as read for a lesson
 */
export function markNotesRead(courseId, lessonId) {
  const allProgress = getAllProgress()
  const courseProgress = getCourseProgress(courseId)

  if (!courseProgress.notesRead.includes(lessonId)) {
    courseProgress.notesRead.push(lessonId)
  }

  courseProgress.lastAccessed = new Date().toISOString()
  if (!courseProgress.startedAt) {
    courseProgress.startedAt = new Date().toISOString()
    courseProgress.status = 'in-progress'
  }

  allProgress[courseId] = courseProgress
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress))

  return courseProgress
}

/**
 * Save MCQ attempt results
 */
export function saveMCQResults(courseId, lessonId, score, totalQuestions) {
  const allProgress = getAllProgress()
  const courseProgress = getCourseProgress(courseId)

  // Save score
  courseProgress.mcqScores[lessonId] = {
    score,
    totalQuestions,
    percentage: Math.round((score / totalQuestions) * 100),
    attemptedAt: new Date().toISOString(),
  }

  // Mark as completed if passed (60% or above)
  const passed = score / totalQuestions >= 0.6
  if (passed && !courseProgress.completedMCQs.includes(lessonId)) {
    courseProgress.completedMCQs.push(lessonId)
  }

  // Add to completed lessons if passed
  if (passed && !courseProgress.completedLessons.includes(lessonId)) {
    courseProgress.completedLessons.push(lessonId)
  }

  courseProgress.lastAccessed = new Date().toISOString()
  if (!courseProgress.startedAt) {
    courseProgress.startedAt = new Date().toISOString()
  }
  courseProgress.status = 'in-progress'

  allProgress[courseId] = courseProgress
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress))

  return courseProgress
}

/**
 * Calculate overall progress for a course
 */
export function calculateProgress(courseId, totalLessons) {
  const courseProgress = getCourseProgress(courseId)

  if (totalLessons === 0) return 0

  const completedCount = courseProgress.completedLessons.length
  const percentage = Math.round((completedCount / totalLessons) * 100)

  // Update stored progress
  courseProgress.overallProgress = percentage

  // Check if course is completed
  if (percentage === 100 && courseProgress.status !== 'completed') {
    courseProgress.status = 'completed'
    courseProgress.completedAt = new Date().toISOString()
  }

  const allProgress = getAllProgress()
  allProgress[courseId] = courseProgress
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress))

  return percentage
}

/**
 * Check if a lesson is completed
 */
export function isLessonCompleted(courseId, lessonId) {
  const courseProgress = getCourseProgress(courseId)
  return courseProgress.completedLessons.includes(lessonId)
}

/**
 * Get video watch percentage for a lesson
 */
export function getVideoProgress(courseId, lessonId) {
  const courseProgress = getCourseProgress(courseId)
  return courseProgress.videoProgress[lessonId]?.percentage || 0
}

/**
 * Get MCQ score for a lesson
 */
export function getMCQScore(courseId, lessonId) {
  const courseProgress = getCourseProgress(courseId)
  return courseProgress.mcqScores[lessonId] || null
}

/**
 * Check if notes have been read
 */
export function areNotesRead(courseId, lessonId) {
  const courseProgress = getCourseProgress(courseId)
  return courseProgress.notesRead.includes(lessonId)
}

/**
 * Reset progress for a course
 */
export function resetCourseProgress(courseId) {
  const allProgress = getAllProgress()
  delete allProgress[courseId]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress))
}

/**
 * Get learning statistics
 */
export function getLearningStats() {
  const allProgress = getAllProgress()
  const courseIds = Object.keys(allProgress)

  return {
    totalCourses: courseIds.length,
    completedCourses: courseIds.filter(id => allProgress[id].status === 'completed').length,
    inProgressCourses: courseIds.filter(id => allProgress[id].status === 'in-progress').length,
    totalLessonsCompleted: courseIds.reduce(
      (sum, id) => sum + allProgress[id].completedLessons.length,
      0
    ),
  }
}

/**
 * Get recently accessed courses
 */
export function getRecentCourses(limit = 5) {
  const allProgress = getAllProgress()
  return Object.values(allProgress)
    .filter(p => p.lastAccessed)
    .sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed))
    .slice(0, limit)
    .map(p => p.courseId)
}
