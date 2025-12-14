export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

export const TOKEN_KEY = 'vidhya_auth_token'
export const REFRESH_TOKEN_KEY = 'vidhya_refresh_token'
export const TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000

export const USER_ROLES = {
  STUDENT: 'student',
  EDUCATOR: 'educator',
  PARENT: 'parent',
  ADMIN: 'admin',
}

export const COURSE_CATEGORIES = [
  { id: 'programming', name: 'Programming', iconName: 'Code' },
  { id: 'data-science', name: 'Data Science', iconName: 'ChartBar' },
  { id: 'mathematics', name: 'Mathematics', iconName: 'Calculator' },
  { id: 'science', name: 'Science', iconName: 'FlaskConical' },
  { id: 'languages', name: 'Languages', iconName: 'Globe' },
  { id: 'arts', name: 'Arts & Design', iconName: 'Palette' },
  { id: 'business', name: 'Business', iconName: 'Briefcase' },
  { id: 'music', name: 'Music', iconName: 'Music' },
]

export const DIFFICULTY_LEVELS = [
  { id: 'beginner', name: 'Beginner', color: 'accent-cyan' },
  { id: 'intermediate', name: 'Intermediate', color: 'accent-orange' },
  { id: 'advanced', name: 'Advanced', color: 'primary' },
]

export const CONTENT_TYPES = {
  VIDEO: 'video',
  TEXT: 'text',
  INTERACTIVE: 'interactive',
  QUIZ: 'quiz',
  ASSIGNMENT: 'assignment',
  LAB: 'lab',
}

export const XP_VALUES = {
  LESSON_COMPLETE: 10,
  QUIZ_PERFECT: 50,
  QUIZ_COMPLETE: 20,
  ASSIGNMENT_SUBMIT: 30,
  LAB_COMPLETE: 40,
  DAILY_STREAK: 15,
  COURSE_COMPLETE: 100,
  ACHIEVEMENT_UNLOCK: 25,
}

export const ACHIEVEMENTS = [
  { id: 'first-lesson', name: 'First Steps', description: 'Complete your first lesson', iconName: 'Target', xp: 25 },
  { id: 'streak-7', name: 'Week Warrior', description: '7 day learning streak', iconName: 'Flame', xp: 50 },
  { id: 'streak-30', name: 'Monthly Master', description: '30 day learning streak', iconName: 'Zap', xp: 200 },
  { id: 'perfect-quiz', name: 'Perfect Score', description: 'Get 100% on a quiz', iconName: 'Trophy', xp: 50 },
  { id: 'night-owl', name: 'Night Owl', description: 'Learn after midnight', iconName: 'Moon', xp: 15 },
  { id: 'early-bird', name: 'Early Bird', description: 'Learn before 6 AM', iconName: 'Sun', xp: 15 },
  { id: 'first-course', name: 'Course Complete', description: 'Finish your first course', iconName: 'Award', xp: 100 },
  { id: 'lab-scientist', name: 'Lab Scientist', description: 'Complete 10 virtual labs', iconName: 'FlaskConical', xp: 75 },
  { id: 'social-learner', name: 'Social Learner', description: 'Join 5 live classrooms', iconName: 'Users', xp: 50 },
  { id: 'ai-buddy', name: 'AI Buddy', description: 'Chat with AI tutor 50 times', iconName: 'Bot', xp: 30 },
]

export const LEARNING_STYLES = [
  { id: 'visual', name: 'Visual', description: 'Learn through images and diagrams', iconName: 'Eye' },
  { id: 'auditory', name: 'Auditory', description: 'Learn through listening', iconName: 'Headphones' },
  { id: 'kinesthetic', name: 'Kinesthetic', description: 'Learn by doing', iconName: 'Hand' },
  { id: 'reading', name: 'Reading/Writing', description: 'Learn through text', iconName: 'BookOpen' },
]

export const AI_TUTOR_MODES = {
  SOCRATIC: 'socratic',
  DIRECT: 'direct',
  GUIDED: 'guided',
}

export const ACCESSIBILITY_DEFAULTS = {
  dyslexiaFont: false,
  highContrast: false,
  reducedMotion: false,
  largeText: false,
  focusMode: false,
  screenReaderOptimized: false,
  fontSize: 100,
  lineSpacing: 1.5,
  letterSpacing: 0,
  colorTheme: 'auto',
}

export const KEYBOARD_SHORTCUTS = [
  { key: '/', action: 'Search', description: 'Open search' },
  { key: 'g d', action: 'Go Dashboard', description: 'Navigate to dashboard' },
  { key: 'g c', action: 'Go Courses', description: 'Navigate to courses' },
  { key: 'g l', action: 'Go Labs', description: 'Navigate to labs' },
  { key: 'a', action: 'Accessibility', description: 'Toggle accessibility panel' },
  { key: 'n', action: 'Notes', description: 'Open notes' },
  { key: 'h', action: 'Help', description: 'Show help' },
  { key: 'Escape', action: 'Close', description: 'Close modal/panel' },
]

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', region: 'US' },
  { code: 'es', name: 'Espanol', region: 'ES' },
  { code: 'fr', name: 'Francais', region: 'FR' },
  { code: 'de', name: 'Deutsch', region: 'DE' },
  { code: 'zh', name: 'Chinese', region: 'CN' },
  { code: 'ja', name: 'Japanese', region: 'JP' },
  { code: 'hi', name: 'Hindi', region: 'IN' },
  { code: 'ar', name: 'Arabic', region: 'SA' },
]

export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword'],
}

export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
}

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
}

export const STORAGE_KEYS = {
  THEME: 'vidhya_theme',
  LANGUAGE: 'vidhya_language',
  ACCESSIBILITY: 'vidhya_accessibility',
  OFFLINE_COURSES: 'vidhya_offline_courses',
  RECENT_SEARCHES: 'vidhya_recent_searches',
}
