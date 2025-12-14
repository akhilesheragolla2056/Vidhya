import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchCourses = createAsyncThunk(
  'course/fetchCourses',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await api.get('/courses', { params: filters })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses')
    }
  }
)

export const fetchCourseById = createAsyncThunk(
  'course/fetchCourseById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/courses/${id}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch course')
    }
  }
)

export const enrollInCourse = createAsyncThunk(
  'course/enroll',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/courses/${courseId}/enroll`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to enroll')
    }
  }
)

const initialState = {
  courses: [],
  enrolledCourses: [],
  currentCourse: null,
  isLoading: false,
  error: null,
  filters: {
    category: '',
    level: '',
    language: '',
    search: '',
  },
  adaptiveRecommendations: [],
}

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
    updateLessonProgress: (state, action) => {
      const { courseId, lessonId, progress } = action.payload
      const course = state.enrolledCourses.find(c => c.id === courseId)
      if (course) {
        const lesson = course.lessons.find(l => l.id === lessonId)
        if (lesson) {
          lesson.progress = progress
        }
      }
    },
    setAdaptiveRecommendations: (state, action) => {
      state.adaptiveRecommendations = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.isLoading = false
        state.courses = action.payload
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.currentCourse = action.payload
      })
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        state.enrolledCourses.push(action.payload)
      })
  },
})

export const { setFilters, clearFilters, updateLessonProgress, setAdaptiveRecommendations } = courseSlice.actions
export default courseSlice.reducer
