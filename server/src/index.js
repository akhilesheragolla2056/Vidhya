// Load environment variables FIRST before importing routes
import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { createServer } from 'http'
import { randomUUID } from 'node:crypto'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import rateLimit from 'express-rate-limit'
import jwt from 'jsonwebtoken'
import User from './models/User.js'
import Classroom from './models/Classroom.js'

// Route imports
import authRoutes from './routes/auth.js'
import courseRoutes from './routes/courses.js'
import aiRoutes from './routes/ai.js'
import classroomRoutes, { getClassroom } from './routes/classrooms.js'
import labRoutes from './routes/labs.js'
import analyticsRoutes from './routes/analytics.js'
import progressRoutes from './routes/progress.js'
import gameRoutes from './routes/games.js'

// Middleware imports
import { errorHandler } from './middleware/errorHandler.js'
import { authMiddleware } from './middleware/auth.js'

const app = express()
const httpServer = createServer(app)
const whiteboardPersistTimers = new Map()

const resolveTrustProxy = () => {
  const raw = (process.env.TRUST_PROXY || '').trim().toLowerCase()
  if (!raw) return process.env.NODE_ENV === 'production' ? 1 : false
  if (raw === 'true') return 1
  if (raw === 'false') return false
  const hops = Number.parseInt(raw, 10)
  return Number.isFinite(hops) && hops >= 1 ? hops : 1
}

app.set('trust proxy', resolveTrustProxy())

const parseAllowedOrigins = () => {
  const configured = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean)

  const clientUrl = (process.env.CLIENT_URL || '').trim()
  if (clientUrl) configured.push(clientUrl)

  // Keep local dev URLs as fallback.
  if (configured.length === 0) {
    configured.push('http://localhost:5173', 'http://localhost:3000')
  }

  return Array.from(new Set(configured.map(origin => origin.replace(/\/$/, ''))))
}

const allowedOrigins = parseAllowedOrigins()
const isAllowedOrigin = origin => {
  if (!origin) return true

  const normalized = origin.replace(/\/$/, '')
  if (allowedOrigins.includes(normalized)) return true

  // Allow Vercel deployment domains to avoid preview/prod mismatch issues.
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(normalized)) return true

  return false
}

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) return callback(null, true)
      return callback(new Error(`Socket CORS blocked for origin: ${origin}`))
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token
    if (!token) return next(new Error('Authentication required'))

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    const user = await User.findById(decoded.id).select('name avatar')
    if (!user) return next(new Error('User not found'))

    socket.user = {
      id: user._id.toString(),
      name: user.name,
      avatar: user.avatar || null,
    }
    next()
  } catch {
    next(new Error('Invalid or expired session'))
  }
})

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    xForwardedForHeader: false,
  },
})

// Middleware
app.use(helmet())
app.use(compression())
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server or same-origin requests with no Origin header.
      if (isAllowedOrigin(origin)) {
        return callback(null, true)
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`))
    },
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
app.use('/api/progress', progressRoutes)
app.use('/api/tests', progressRoutes)
app.use('/api/games', authMiddleware, gameRoutes)

const roomParticipants = (roomId, excludedSocketId) => {
  const memberSocketIds = io.sockets.adapter.rooms.get(roomId)
  if (!memberSocketIds) return []

  const participants = new Map()
  for (const socketId of memberSocketIds) {
    if (socketId === excludedSocketId) continue
    const participantSocket = io.sockets.sockets.get(socketId)
    if (participantSocket?.user) {
      participants.set(participantSocket.user.id, participantSocket.user)
    }
  }
  return Array.from(participants.values())
}

// Socket.IO connection handling
io.on('connection', socket => {
  socket.on('join-room', async ({ roomId } = {}, acknowledge = () => {}) => {
    if (typeof roomId !== 'string' || roomId.length > 100) {
      acknowledge({ success: false, message: 'Invalid classroom' })
      return
    }

    const classroom = await getClassroom(roomId)
    const isParticipant = classroom?.participants.some(
      participant => participant.userId === socket.user.id
    )
    if (!classroom || classroom.status === 'ended' || !isParticipant) {
      acknowledge({ success: false, message: 'Join this classroom before connecting' })
      return
    }

    if (socket.data.classroomId && socket.data.classroomId !== roomId) {
      socket.leave(socket.data.classroomId)
      socket.to(socket.data.classroomId).emit('user-left', socket.user.id)
      io.to(socket.data.classroomId).emit('room-participants', roomParticipants(socket.data.classroomId))
    }

    socket.data.classroomId = roomId
    await socket.join(roomId)
    socket.to(roomId).emit('user-joined', socket.user)
    io.to(roomId).emit('room-participants', roomParticipants(roomId))
    socket.emit('whiteboard-update', classroom.whiteboard || '')
    socket.emit('chat-history', classroom.messages.slice(-100))
    acknowledge({ success: true })
  })

  socket.on('leave-room', ({ roomId } = {}) => {
    if (!roomId || roomId !== socket.data.classroomId) return
    socket.leave(roomId)
    socket.data.classroomId = null
    socket.to(roomId).emit('user-left', socket.user.id)
    io.to(roomId).emit('room-participants', roomParticipants(roomId))
  })

  socket.on('announce-classroom-ended', async ({ roomId } = {}, acknowledge = () => {}) => {
    if (roomId !== socket.data.classroomId) {
      acknowledge({ success: false })
      return
    }
    try {
      const classroom = await getClassroom(roomId)
      if (!classroom || classroom.status !== 'ended' || classroom.host.toString() !== socket.user.id) {
        acknowledge({ success: false })
        return
      }
      socket.to(roomId).emit('classroom-ended')
      acknowledge({ success: true })
    } catch {
      acknowledge({ success: false })
    }
  })

  socket.on('send-message', async ({ roomId, content, type = 'text' } = {}) => {
    if (roomId !== socket.data.classroomId || typeof content !== 'string') return
    const message = content.trim().slice(0, 2000)
    if (!message) return

    const chatMessage = {
      id: randomUUID(),
      content: message,
      type: type === 'code' ? 'code' : 'text',
      sender: socket.user,
      timestamp: new Date(),
    }
    try {
      const result = await Classroom.updateOne(
        { _id: roomId, status: { $ne: 'ended' }, 'settings.allowChat': { $ne: false } },
        { $push: { messages: { $each: [chatMessage], $slice: -100 } } }
      )
      if (result.matchedCount) io.to(roomId).emit('chat-message', chatMessage)
    } catch (error) {
      console.error('Classroom message could not be saved:', error.message)
    }
  })

  socket.on('hand-raise', ({ roomId, isRaised } = {}) => {
    if (roomId !== socket.data.classroomId || typeof isRaised !== 'boolean') return
    io.to(roomId).emit('hand-raised', { userId: socket.user.id, isRaised })
  })

  socket.on('whiteboard-draw', ({ roomId, state }) => {
    if (roomId !== socket.data.classroomId || typeof state !== 'string') return
    const content = state.slice(0, 10000)
    const previousTimer = whiteboardPersistTimers.get(roomId)
    if (previousTimer) clearTimeout(previousTimer)
    whiteboardPersistTimers.set(roomId, setTimeout(() => {
      whiteboardPersistTimers.delete(roomId)
      Classroom.updateOne({ _id: roomId, status: { $ne: 'ended' } }, { $set: { whiteboard: content } })
        .catch(error => console.error('Classroom notes could not be saved:', error.message))
    }, 250))
    socket.to(roomId).emit('whiteboard-update', content)
  })

  // Poll
  socket.on('start-poll', ({ roomId, poll }) => {
    if (roomId === socket.data.classroomId) io.to(roomId).emit('poll-started', poll)
  })

  socket.on('vote-poll', ({ roomId, optionId }) => {
    if (roomId === socket.data.classroomId) {
      io.to(roomId).emit('poll-vote', { optionId, voterId: socket.user.id })
    }
  })

  socket.on('end-poll', ({ roomId }) => {
    if (roomId === socket.data.classroomId) io.to(roomId).emit('poll-ended')
  })

  socket.on('disconnecting', () => {
    const roomId = socket.data.classroomId
    if (!roomId) return
    socket.to(roomId).emit('user-left', socket.user.id)
    io.to(roomId).emit('room-participants', roomParticipants(roomId, socket.id))
  })
})

// Error handling
app.use(errorHandler)

// Database connection and server start
const PORT = process.env.PORT || 5000
const rawMongoUri = process.env.MONGODB_URI
const MONGODB_URI = (rawMongoUri || 'mongodb://localhost:27017/lumina')
  .trim()
  .replace(/^=+/, '')
  .trim()

if (process.env.NODE_ENV === 'production') {
  const missingConfiguration = []
  if (!rawMongoUri) missingConfiguration.push('MONGODB_URI')
  if (!process.env.CLIENT_URL) missingConfiguration.push('CLIENT_URL')
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    missingConfiguration.push('JWT_SECRET (at least 32 characters)')
  }
  if (missingConfiguration.length) {
    throw new Error(`Production server configuration is incomplete: ${missingConfiguration.join(', ')}`)
  }
}

if (!rawMongoUri) {
  console.warn('MONGODB_URI is not set. Falling back to local MongoDB URI.')
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      console.log(`Allowed CORS origins: ${allowedOrigins.join(', ')}`)
    })
  })
  .catch(err => {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  })

export { io }
