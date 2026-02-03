// Load environment variables FIRST before importing routes
import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { createServer } from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import rateLimit from 'express-rate-limit'

// Route imports
import authRoutes from './routes/auth.js'
import courseRoutes from './routes/courses.js'
import aiRoutes from './routes/ai.js'
import classroomRoutes from './routes/classrooms.js'
import labRoutes from './routes/labs.js'
import analyticsRoutes from './routes/analytics.js'
import progressRoutes from './routes/progress.js'

// Middleware imports
import { errorHandler } from './middleware/errorHandler.js'
import { authMiddleware } from './middleware/auth.js'

const app = express()
const httpServer = createServer(app)

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
})

// Middleware
app.use(helmet())
app.use(compression())
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use('/api', limiter)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/ai', authMiddleware, aiRoutes)
app.use('/api/classrooms', authMiddleware, classroomRoutes)
app.use('/api/labs', labRoutes)
app.use('/api/analytics', authMiddleware, analyticsRoutes)
app.use('/api/progress', authMiddleware, progressRoutes)
app.use('/api/tests', authMiddleware, progressRoutes)

// Socket.IO connection handling
io.on('connection', socket => {
  console.log('User connected:', socket.id)

  // Join room
  socket.on('join-room', ({ roomId, user }) => {
    socket.join(roomId)
    socket.to(roomId).emit('user-joined', { id: socket.id, ...user })

    // Send current participants
    const room = io.sockets.adapter.rooms.get(roomId)
    if (room) {
      io.to(roomId).emit('room-participants', Array.from(room))
    }
  })

  // Leave room
  socket.on('leave-room', ({ roomId }) => {
    socket.leave(roomId)
    socket.to(roomId).emit('user-left', socket.id)
  })

  // Chat message
  socket.on('send-message', ({ roomId, content, type, sender }) => {
    io.to(roomId).emit('chat-message', {
      id: Date.now(),
      content,
      type,
      sender,
      timestamp: new Date().toISOString(),
    })
  })

  // Hand raise
  socket.on('hand-raise', ({ roomId, userId, isRaised }) => {
    socket.to(roomId).emit('hand-raised', { userId, isRaised })
  })

  // Whiteboard
  socket.on('whiteboard-draw', ({ roomId, state }) => {
    socket.to(roomId).emit('whiteboard-update', state)
  })

  // Poll
  socket.on('start-poll', ({ roomId, poll }) => {
    io.to(roomId).emit('poll-started', poll)
  })

  socket.on('vote-poll', ({ roomId, optionId }) => {
    io.to(roomId).emit('poll-vote', { optionId, odterId: socket.id })
  })

  socket.on('end-poll', ({ roomId }) => {
    io.to(roomId).emit('poll-ended')
  })

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

// Error handling
app.use(errorHandler)

// Database connection and server start
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lumina'

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch(err => {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  })

export { io }
