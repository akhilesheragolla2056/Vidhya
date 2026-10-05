export const LEARNING_PROGRESS_UPDATED_EVENT = 'vidhya:learning-progress-updated'

export function notifyLearningProgressUpdated(detail = {}) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(LEARNING_PROGRESS_UPDATED_EVENT, { detail }))
}
