import { notifyLearningProgressUpdated } from './learningProgressEvents'
import api from '../services/api'

/**
 * Progress Tracking Utility for Vidhya Learning Platform
 * Manages course progress in localStorage with real-time updates
 */

export const PROGRESS_STORAGE_KEY = 'vidhya_course_progress'

const progressSyncTimers = new Map()
const progressSyncMetadata = new Map()

function getTokenUserId() {
  try {
    const token = localStorage.getItem('token')
    if (!token) return null
    const encodedPayload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(encodedPayload.padEnd(Math.ceil(encodedPayload.length / 4) * 4, '=')))
    return payload.id || payload.userId || payload.sub || null
  } catch {
    return null
  }
}

export function getProgressStorageKey() {
  const userId = getTokenUserId()
  return userId ? `${PROGRESS_STORAGE_KEY}:${userId}` : PROGRESS_STORAGE_KEY
}

export function setCourseProgressMetadata(courseId, metadata = {}) {
  progressSyncMetadata.set(courseId, { ...progressSyncMetadata.get(courseId), ...metadata })
}

function readProgressFrom(key) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : {}
  } catch (error) {
    console.error('Error reading progress:', error)
    return {}
  }
}

function writeAllProgress(allProgress) {
  localStorage.setItem(getProgressStorageKey(), JSON.stringify(allProgress))
}

function scheduleProgressSync(courseId) {
  const ownerId = getTokenUserId()
  const metadata = progressSyncMetadata.get(courseId)
  if (!ownerId || !metadata) return
  const progress = getCourseProgress(courseId)
  const hasLearningActivity = Boolean(
    progress.startedAt || progress.lastAccessed || progress.activeSeconds ||
    progress.completedLessons.length || progress.notesRead.length ||
    Object.keys(progress.mcqScores).length || Object.keys(progress.videoProgress).length
  )
  if (!hasLearningActivity) return
  const timerKey = `${ownerId}:${courseId}`
  const existingTimer = progressSyncTimers.get(timerKey)
  if (existingTimer) window.clearTimeout(existingTimer)
  progressSyncTimers.set(timerKey, window.setTimeout(() => {
    progressSyncTimers.delete(timerKey)
    if (getTokenUserId() !== ownerId) return
    void syncCourseProgress(courseId).catch(() => {})
  }, 700))
}

export async function syncCourseProgress(courseId, metadata = {}) {
  const ownerId = getTokenUserId()
  if (!ownerId) return null
  const timerKey = `${ownerId}:${courseId}`
  const pendingTimer = progressSyncTimers.get(timerKey)
  if (pendingTimer) window.clearTimeout(pendingTimer)
  progressSyncTimers.delete(timerKey)
  if (Object.keys(metadata).length) setCourseProgressMetadata(courseId, metadata)
  const details = progressSyncMetadata.get(courseId) || {}
  const progress = getCourseProgress(courseId)
  const payload = {
    ...progress,
    courseId,
    courseTitle: details.courseTitle || '',
    category: details.category || '',
    totalLessons: details.totalLessons || details.lessonIds?.length || 0,
    lessonIds: details.lessonIds || [],
  }
  const response = await api.put(`/progress/learning/${encodeURIComponent(courseId)}`, payload)
  return response.data?.data || null
}

export function importProgressRecords(records = []) {
  const allProgress = getAllProgress()
  let changed = false
  for (const record of records) {
    if (!record?.courseId) continue
    const remote = {
      courseId: record.courseId,
      completedLessons: Array.isArray(record.completedLessons) ? record.completedLessons : [],
      videoProgress: record.videoProgress || {},
      completedMCQs: Array.isArray(record.completedMCQs) ? record.completedMCQs : [],
      mcqScores: record.mcqScores || {},
      notesRead: Array.isArray(record.notesRead) ? record.notesRead : [],
      status: record.status || 'not-started',
      lastAccessed: record.lastAccessed || null,
      startedAt: record.startedAt || null,
      completedAt: record.completedAt || null,
      overallProgress: Number(record.overallProgress) || 0,
      activeSeconds: Math.max(0, Number(record.activeSeconds) || 0),
    }
    const local = allProgress[record.courseId]
    const localTime = local?.lastAccessed ? new Date(local.lastAccessed).getTime() : 0
    const remoteTime = remote.lastAccessed ? new Date(remote.lastAccessed).getTime() : 0
    if (local && localTime >= remoteTime) {
      continue
    }
    allProgress[record.courseId] = remote
    changed = true
  }
  if (changed) {
    writeAllProgress(allProgress)
    notifyLearningProgressUpdated({ activity: 'progress-restored' })
  }
  return allProgress
}

/**
 * Get all course progress from localStorage
 */
export function getAllProgress() {
  const key = getProgressStorageKey()
  const scopedProgress = readProgressFrom(key)
  if (key === PROGRESS_STORAGE_KEY) return scopedProgress

  // Move progress saved before account-based sync onto the first signed-in
  // account, then remove the shared copy so another account cannot inherit it.
  const legacyProgress = readProgressFrom(PROGRESS_STORAGE_KEY)
  if (Object.keys(legacyProgress).length) {
    const migratedProgress = { ...legacyProgress, ...scopedProgress }
    localStorage.setItem(key, JSON.stringify(migratedProgress))
    localStorage.removeItem(PROGRESS_STORAGE_KEY)
    return migratedProgress
  }
  return scopedProgress
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
    activeSeconds: Math.max(0, Number(savedProgress.activeSeconds) || 0),
  }
}

function saveProgress(allProgress, courseId, courseProgress, activity) {
  allProgress[courseId] = courseProgress
  writeAllProgress(allProgress)
  scheduleProgressSync(courseId)
  if (activity !== 'learning-time') notifyLearningProgressUpdated({ courseId, activity })
  return courseProgress
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
  return saveProgress(allProgress, courseId, courseProgress, 'video-completed')
}

/** Record active video playback time without counting paused or hidden-tab time. */
export function recordLearningSeconds(courseId, lessonId, seconds) {
  const safeSeconds = Math.max(0, Math.min(15, Math.floor(Number(seconds) || 0)))
  if (!courseId || !lessonId || safeSeconds === 0) return getCourseProgress(courseId)

  const allProgress = getAllProgress()
  const courseProgress = getCourseProgress(courseId)
  courseProgress.activeSeconds += safeSeconds
  if (!courseProgress.startedAt) courseProgress.startedAt = new Date().toISOString()
  courseProgress.lastAccessed = new Date().toISOString()
  courseProgress.status = 'in-progress'

  return saveProgress(allProgress, courseId, courseProgress, 'learning-time')
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

  return saveProgress(allProgress, courseId, courseProgress, 'notes-read')
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

  return saveProgress(allProgress, courseId, courseProgress, 'quiz-submitted')
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
  writeAllProgress(allProgress)

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
  writeAllProgress(allProgress)
  notifyLearningProgressUpdated({ courseId, activity: 'progress-reset' })
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
