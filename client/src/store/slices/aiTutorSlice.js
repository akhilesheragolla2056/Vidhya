import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const sendMessage = createAsyncThunk(
  'aiTutor/sendMessage',
  async ({ message, context }, { rejectWithValue }) => {
    try {
      const response = await api.post('/ai/chat', { message, context })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get response')
    }
  }
)

export const getHint = createAsyncThunk(
  'aiTutor/getHint',
  async ({ problemId, currentProgress }, { rejectWithValue }) => {
    try {
      const response = await api.post('/ai/hint', { problemId, currentProgress })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get hint')
    }
  }
)

export const explainConcept = createAsyncThunk(
  'aiTutor/explainConcept',
  async ({ concept, learningStyle, language }, { rejectWithValue }) => {
    try {
      const response = await api.post('/ai/explain', { concept, learningStyle, language })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get explanation')
    }
  }
)

const initialState = {
  conversations: [],
  currentConversation: {
    id: null,
    messages: [],
    context: null,
  },
  isTyping: false,
  error: null,
  hints: [],
  explanations: [],
  mode: 'socratic', // socratic, direct, guided
  persona: 'mentor', // mentor, peer, expert
}

const aiTutorSlice = createSlice({
  name: 'aiTutor',
  initialState,
  reducers: {
    startNewConversation: (state, action) => {
      state.currentConversation = {
        id: Date.now(),
        messages: [],
        context: action.payload || null,
      }
    },
    addUserMessage: (state, action) => {
      state.currentConversation.messages.push({
        role: 'user',
        content: action.payload,
        timestamp: Date.now(),
      })
    },
    setMode: (state, action) => {
      state.mode = action.payload
    },
    setPersona: (state, action) => {
      state.persona = action.payload
    },
    clearConversation: (state) => {
      state.currentConversation = {
        id: null,
        messages: [],
        context: null,
      }
    },
    saveConversation: (state) => {
      if (state.currentConversation.id) {
        const existingIndex = state.conversations.findIndex(
          c => c.id === state.currentConversation.id
        )
        if (existingIndex >= 0) {
          state.conversations[existingIndex] = state.currentConversation
        } else {
          state.conversations.push(state.currentConversation)
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isTyping = true
        state.error = null
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isTyping = false
        state.currentConversation.messages.push({
          role: 'assistant',
          content: action.payload.message,
          timestamp: Date.now(),
          metadata: action.payload.metadata,
        })
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isTyping = false
        state.error = action.payload
      })
      .addCase(getHint.fulfilled, (state, action) => {
        state.hints.push({
          problemId: action.meta.arg.problemId,
          hint: action.payload.hint,
          level: action.payload.level,
        })
      })
      .addCase(explainConcept.fulfilled, (state, action) => {
        state.explanations.push({
          concept: action.meta.arg.concept,
          explanation: action.payload.explanation,
          examples: action.payload.examples,
          visualizations: action.payload.visualizations,
        })
      })
  },
})

export const {
  startNewConversation,
  addUserMessage,
  setMode,
  setPersona,
  clearConversation,
  saveConversation,
} = aiTutorSlice.actions

export default aiTutorSlice.reducer
