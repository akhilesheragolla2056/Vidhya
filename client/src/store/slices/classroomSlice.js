import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  socket: null,
  isConnected: false,
  currentRoom: null,
  roomEnded: false,
  participants: [],
  messages: [],
  isHandRaised: false,
  raisedHands: {},
  currentUserId: null,
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
      state.roomEnded = false
    },
    leaveRoom: (state) => {
      state.currentRoom = null
      state.roomEnded = false
      state.participants = []
      state.messages = []
      state.isHandRaised = false
      state.raisedHands = {}
      state.whiteboardState = ''
      state.pollActive = null
      state.currentUserId = null
    },
    setRoomEnded: (state, action) => {
      state.roomEnded = action.payload
    },
    setParticipants: (state, action) => {
      state.participants = action.payload
    },
    setMessages: (state, action) => {
      state.messages = action.payload
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
      if (!state.messages.some(message => message.id === action.payload.id)) {
        state.messages.push(action.payload)
      }
    },
    toggleHandRaise: (state) => {
      state.isHandRaised = !state.isHandRaised
    },
    setHandRaised: (state, action) => {
      const { userId, isRaised } = action.payload
      state.raisedHands[userId] = isRaised
      if (userId === state.currentUserId) state.isHandRaised = isRaised
    },
    setCurrentUserId: (state, action) => {
      state.currentUserId = action.payload
      state.isHandRaised = Boolean(state.raisedHands[action.payload])
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
  setRoomEnded,
  setParticipants,
  setMessages,
  addParticipant,
  removeParticipant,
  addMessage,
  toggleHandRaise,
  setHandRaised,
  setCurrentUserId,
  setBreakoutRooms,
  updateWhiteboard,
  setScreenShare,
  startPoll,
  endPoll,
  submitPollVote,
} = classroomSlice.actions

export default classroomSlice.reducer
