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
  const savedProgress = allProgress[courseId] || {}
  return {
    courseId,
    completedLessons: Array.isArray(savedProgress.completedLessons) ? savedProgress.completedLessons : [],
    videoProgress: savedProgress.videoProgress || {},
    completedMCQs: Array.isArray(savedProgress.completedMCQs) ? savedProgress.completedMCQs : [],
    mcqScores: savedProgress.mcqScores || {},
    notesRead: Array.isArray(savedProgress.notesRead) ? savedProgress.notesRead : [],
    status: savedProgress.status || 'not-started',
    lastAccessed: savedProgress.lastAccessed || null,
    startedAt: savedProgress.startedAt || null,
    completedAt: savedProgress.completedAt || null,
    overallProgress: savedProgress.overallProgress || 0,
  }
}

const syncLessonCompletion = (courseProgress, lessonId) => {
  const quizComplete = Number(courseProgress.mcqScores[lessonId]?.percentage) >= 60
  const completedLessons = new Set(courseProgress.completedLessons)

  if (quizComplete) completedLessons.add(lessonId)
  else completedLessons.delete(lessonId)

  courseProgress.completedLessons = [...completedLessons]
}

/**
 * Mark a lesson video as watched
 */
export function markVideoWatched(courseId, lessonId, watchPercentage = 100) {
  const allProgress = getAllProgress()
  const courseProgress = getCourseProgress(courseId)

  // Update video progress
  const percentage = Math.max(0, Math.min(100, Number(watchPercentage) || 0))
  courseProgress.videoProgress[lessonId] = {
    watched: percentage >= 80,
    percentage,
    watchedAt: new Date().toISOString(),
  }

  syncLessonCompletion(courseProgress, lessonId)

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
  const safeScore = Math.max(0, Math.min(totalQuestions, Number(score) || 0))
  const percentage = totalQuestions > 0 ? Math.round((safeScore / totalQuestions) * 100) : 0
  courseProgress.mcqScores[lessonId] = {
    score: safeScore,
    totalQuestions,
    percentage,
    attemptedAt: new Date().toISOString(),
  }

  const completedMCQs = new Set(courseProgress.completedMCQs)
  if (percentage >= 60) completedMCQs.add(lessonId)
  else completedMCQs.delete(lessonId)
  courseProgress.completedMCQs = [...completedMCQs]
  syncLessonCompletion(courseProgress, lessonId)

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
export function calculateProgress(courseId, lessonIdsOrCount) {
  const courseProgress = getCourseProgress(courseId)
  const lessonIds = Array.isArray(lessonIdsOrCount) ? lessonIdsOrCount : null
  const totalLessons = lessonIds ? lessonIds.length : lessonIdsOrCount

  if (totalLessons === 0) return 0

  if (lessonIds) {
    courseProgress.completedLessons = lessonIds.filter(lessonId => {
      syncLessonCompletion(courseProgress, lessonId)
      return courseProgress.completedLessons.includes(lessonId)
    })
  }

  const completedCount = Math.min(courseProgress.completedLessons.length, totalLessons)
  const percentage = Math.round((completedCount / totalLessons) * 100)

  // Update stored progress
  courseProgress.overallProgress = percentage

  // Check if course is completed
  if (percentage === 100) {
    courseProgress.status = 'completed'
    if (!courseProgress.completedAt) courseProgress.completedAt = new Date().toISOString()
  } else if (percentage < 100) {
    courseProgress.status = courseProgress.startedAt ? 'in-progress' : 'not-started'
    courseProgress.completedAt = null
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
  return Number(courseProgress.mcqScores[lessonId]?.percentage) >= 60
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
