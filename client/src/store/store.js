import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import courseReducer from './slices/courseSlice'
import accessibilityReducer from './slices/accessibilitySlice'
import classroomReducer from './slices/classroomSlice'
import aiTutorReducer from './slices/aiTutorSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    course: courseReducer,
    accessibility: accessibilityReducer,
    classroom: classroomReducer,
    aiTutor: aiTutorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['classroom/setSocket'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.socket'],
        // Ignore these paths in the state
        ignoredPaths: ['classroom.socket'],
      },
    }),
})

export default store
