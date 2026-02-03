import axios from 'axios'

// In development, use relative path to go through Vite proxy
// In production, use the full API URL
const API_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  : '/api'

export const API_BASE_URL = API_URL

export const buildOAuthUrl = (provider, redirectUri) => {
  const base = API_URL.replace(/\/$/, '')
  const target = redirectUri || `${window.location.origin}/auth/callback`
  const query = new URLSearchParams({ redirect: target }).toString()
  return `${base}/auth/${provider}?${query}`
}

export const startOAuth = (provider, redirectUri) => {
  window.location.href = buildOAuthUrl(provider, redirectUri)
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      window.location.href = '/login'
    }

    // Network error - app is offline
    if (!error.response) {
      console.log('Network error - working offline')
      // Could trigger offline mode here
    }

    return Promise.reject(error)
  }
)

export default api

// Specific API functions
export const authAPI = {
  login: credentials => api.post('/auth/login', credentials),
  signup: userData => api.post('/auth/signup', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: data => api.put('/auth/profile', data),
  refreshToken: () => api.post('/auth/refresh'),
}

export const coursesAPI = {
  getAll: params => api.get('/courses', { params }),
  getById: id => api.get(`/courses/${id}`),
  enroll: id => api.post(`/courses/${id}/enroll`),
  getEnrolled: () => api.get('/courses/enrolled'),
  getProgress: id => api.get(`/courses/${id}/progress`),
  updateProgress: (id, data) => api.put(`/courses/${id}/progress`, data),
  getRecommendations: () => api.get('/courses/recommendations'),
}

export const lessonsAPI = {
  getById: (courseId, lessonId) => api.get(`/courses/${courseId}/lessons/${lessonId}`),
  complete: (courseId, lessonId) => api.post(`/courses/${courseId}/lessons/${lessonId}/complete`),
  submitQuiz: (courseId, lessonId, answers) =>
    api.post(`/courses/${courseId}/lessons/${lessonId}/quiz`, { answers }),
}

export const aiAPI = {
  chat: ({ message, context, mode = 'socratic', history = [] }) =>
    api.post('/ai/chat', { message, context, mode, history }),
  getHint: ({ problemId, currentProgress, problemDescription, level = 1 }) =>
    api.post('/ai/hint', { problemId, currentProgress, problemDescription, level }),
  explain: (concept, style, language) =>
    api.post('/ai/explain', { concept, learningStyle: style, language }),
  generatePractice: (topic, difficulty, count = 3) =>
    api.post('/ai/practice', { topic, difficulty, count }),
  summarize: (content, length = 'medium') => api.post('/ai/summarize', { content, length }),
}

export const classroomAPI = {
  create: data => api.post('/classrooms', data),
  join: code => api.post('/classrooms/join', { code }),
  getSession: id => api.get(`/classrooms/${id}`),
  endSession: id => api.post(`/classrooms/${id}/end`),
}

export const labAPI = {
  getExperiments: subject => api.get(subject ? `/labs/${subject}` : '/labs'),
  getExperiment: (subject, id) => api.get(`/labs/${subject}/${id}`),
  saveProgress: (subject, id, payload) => api.post(`/labs/${subject}/${id}/progress`, payload),
  submitResults: (subject, id, payload) => api.post(`/labs/${subject}/${id}/submit`, payload),
}

export const analyticsAPI = {
  trackEvent: (event, data) => api.post('/analytics/event', { event, data }),
  getProgress: () => api.get('/analytics/progress'),
  getLearningInsights: () => api.get('/analytics/insights'),
  getStudentStats: id => api.get(`/analytics/student/${id}`),
}
