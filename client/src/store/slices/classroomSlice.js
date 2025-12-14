import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  socket: null,
  isConnected: false,
  currentRoom: null,
  participants: [],
  messages: [],
  isHandRaised: false,
  breakoutRooms: [],
  whiteboardState: null,
  screenShareActive: false,
  pollActive: null,
}

const classroomSlice = createSlice({
  name: 'classroom',
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload
    },
    setConnected: (state, action) => {
      state.isConnected = action.payload
    },
    joinRoom: (state, action) => {
      state.currentRoom = action.payload
    },
    leaveRoom: (state) => {
      state.currentRoom = null
      state.participants = []
      state.messages = []
    },
    setParticipants: (state, action) => {
      state.participants = action.payload
    },
    addParticipant: (state, action) => {
      const exists = state.participants.find(p => p.id === action.payload.id)
      if (!exists) {
        state.participants.push(action.payload)
      }
    },
    removeParticipant: (state, action) => {
      state.participants = state.participants.filter(p => p.id !== action.payload)
    },
    addMessage: (state, action) => {
      state.messages.push({
        ...action.payload,
        timestamp: Date.now(),
      })
    },
    toggleHandRaise: (state) => {
      state.isHandRaised = !state.isHandRaised
    },
    setBreakoutRooms: (state, action) => {
      state.breakoutRooms = action.payload
    },
    updateWhiteboard: (state, action) => {
      state.whiteboardState = action.payload
    },
    setScreenShare: (state, action) => {
      state.screenShareActive = action.payload
    },
    startPoll: (state, action) => {
      state.pollActive = action.payload
    },
    endPoll: (state) => {
      state.pollActive = null
    },
    submitPollVote: (state, action) => {
      if (state.pollActive) {
        state.pollActive.votes = state.pollActive.votes || {}
        state.pollActive.votes[action.payload.optionId] = 
          (state.pollActive.votes[action.payload.optionId] || 0) + 1
      }
    },
  },
})

export const {
  setSocket,
  setConnected,
  joinRoom,
  leaveRoom,
  setParticipants,
  addParticipant,
  removeParticipant,
  addMessage,
  toggleHandRaise,
  setBreakoutRooms,
  updateWhiteboard,
  setScreenShare,
  startPoll,
  endPoll,
  submitPollVote,
} = classroomSlice.actions

export default classroomSlice.reducer
