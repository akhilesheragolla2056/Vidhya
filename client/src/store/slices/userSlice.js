import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// Async thunks
export const login = createAsyncThunk('user/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/login', credentials)
    localStorage.setItem('token', response.data.token)
    return response.data.user
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed')
  }
})

export const signup = createAsyncThunk('user/signup', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/signup', userData)
    localStorage.setItem('token', response.data.token)
    return response.data.user
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Signup failed')
  }
})

export const fetchProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      console.log('fetchProfile: calling GET /auth/profile')
      const response = await api.get('/auth/profile')
      console.log('fetchProfile response:', response)
      // Server response has structure: { success: true, ...userData }
      // We need to extract the user object (everything except success field)
      const { success, ...userData } = response.data
      console.log('Extracted user data:', userData)
      return userData
    } catch (error) {
      console.error('fetchProfile error:', error)
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile')
    }
  }
)

const initialState = {
  currentUser: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  learningProfile: {
    preferredLanguage: 'en',
    learningStyle: 'visual', // visual, auditory, kinesthetic, reading
    pacePreference: 'moderate',
    accessibilityNeeds: [],
  },
  progress: {
    totalXP: 0,
    level: 1,
    streakDays: 0,
    coursesCompleted: 0,
    badges: [],
  },
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: state => {
      localStorage.removeItem('token')
      state.currentUser = null
      state.isAuthenticated = false
      state.error = null
    },
    clearError: state => {
      state.error = null
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true
      state.isLoading = false
      state.error = null
      if (action?.payload) {
        state.currentUser = action.payload
      }
    },
    updateLearningProfile: (state, action) => {
      state.learningProfile = { ...state.learningProfile, ...action.payload }
    },
    addXP: (state, action) => {
      state.progress.totalXP += action.payload
      // Level up logic (100 XP per level)
      const newLevel = Math.floor(state.progress.totalXP / 100) + 1
      if (newLevel > state.progress.level) {
        state.progress.level = newLevel
      }
    },
    addBadge: (state, action) => {
      if (!state.progress.badges.includes(action.payload)) {
        state.progress.badges.push(action.payload)
      }
    },
  },
  extraReducers: builder => {
    builder
      // Login
      .addCase(login.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentUser = action.payload
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Signup
      .addCase(signup.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentUser = action.payload
        state.isAuthenticated = true
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch Profile
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentUser = action.payload
        state.isAuthenticated = true
      })
      .addCase(fetchProfile.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.currentUser = null
        state.isAuthenticated = false
        localStorage.removeItem('token')
      })
  },
})

export const { logout, clearError, loginSuccess, updateLearningProfile, addXP, addBadge } =
  userSlice.actions
export default userSlice.reducer
