import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { gamesAPI } from '../../services/api'

export const fetchDailyMissions = createAsyncThunk(
  'game/fetchDailyMissions',
  async (_, { rejectWithValue }) => {
    try {
      const res = await gamesAPI.getDailyMissions()
      return res.data?.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load daily missions')
    }
  }
)

export const fetchGameStats = createAsyncThunk('game/fetchGameStats', async (_, { rejectWithValue }) => {
  try {
    const res = await gamesAPI.getStats()
    return res.data?.data || {}
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load game stats')
  }
})

export const fetchLeaderboard = createAsyncThunk(
  'game/fetchLeaderboard',
  async ({ gameType, limit = 10 }, { rejectWithValue }) => {
    try {
      const res = await gamesAPI.getLeaderboard(gameType, limit)
      return { gameType, entries: res.data?.data || [] }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load leaderboard')
    }
  }
)

export const startGameSession = createAsyncThunk(
  'game/startSession',
  async ({ gameType, difficulty }, { rejectWithValue }) => {
    try {
      const res = await gamesAPI.startSession({ gameType, difficulty })
      return res.data?.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to start game')
    }
  }
)

export const submitGameSession = createAsyncThunk(
  'game/submitSession',
  async ({ sessionId, payload }, { rejectWithValue }) => {
    try {
      const res = await gamesAPI.submitSession(sessionId, payload)
      return res.data?.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit game')
    }
  }
)

const initialState = {
  isLoading: false,
  error: null,
  activeSession: null,
  latestResult: null,
  dailyMissions: null,
  stats: {},
  leaderboard: {
    math_sprint: [],
    science_quest: [],
  },
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    clearGameError: state => {
      state.error = null
    },
    clearLatestResult: state => {
      state.latestResult = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDailyMissions.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDailyMissions.fulfilled, (state, action) => {
        state.isLoading = false
        state.dailyMissions = action.payload
      })
      .addCase(fetchDailyMissions.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(fetchGameStats.fulfilled, (state, action) => {
        state.stats = action.payload
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.leaderboard[action.payload.gameType] = action.payload.entries
      })
      .addCase(startGameSession.pending, state => {
        state.error = null
      })
      .addCase(startGameSession.fulfilled, (state, action) => {
        state.activeSession = action.payload
      })
      .addCase(startGameSession.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(submitGameSession.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(submitGameSession.fulfilled, (state, action) => {
        state.isLoading = false
        state.latestResult = action.payload
        state.activeSession = null
      })
      .addCase(submitGameSession.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearGameError, clearLatestResult } = gameSlice.actions
export default gameSlice.reducer
