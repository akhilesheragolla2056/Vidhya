import express from 'express'
import crypto from 'crypto'
import { ApiError } from '../middleware/errorHandler.js'

const router = express.Router()

// In-memory storage (replace with Redis/DB in production)
const classrooms = new Map()

// @route   POST /api/classrooms
// @desc    Create a new classroom session
// @access  Private
router.post('/', async (req, res, next) => {
  try {
    const { title, courseId, lessonId, settings = {} } = req.body

    // Generate unique room code
    const roomCode = crypto.randomBytes(3).toString('hex').toUpperCase()
    const roomId = crypto.randomUUID()

    const classroom = {
      id: roomId,
      code: roomCode,
      title,
      courseId,
      lessonId,
      host: req.user.id,
      participants: [],
      settings: {
        allowChat: true,
        allowHandRaise: true,
        allowScreenShare: false,
        maxParticipants: 50,
        ...settings,
      },
      status: 'waiting', // waiting, active, ended
      createdAt: new Date(),
      startedAt: null,
      endedAt: null,
      whiteboard: null,
      polls: [],
      breakoutRooms: [],
    }

    classrooms.set(roomId, classroom)

    res.status(201).json({
      success: true,
      data: {
        roomId,
        roomCode,
        joinUrl: `/classroom/${roomId}`,
      },
    })
  } catch (error) {
    next(error)
  }
})

// @route   POST /api/classrooms/join
// @desc    Join a classroom by code
// @access  Private
router.post('/join', async (req, res, next) => {
  try {
    const { code } = req.body

    // Find classroom by code
    let foundClassroom = null
    for (const [id, classroom] of classrooms) {
      if (classroom.code === code.toUpperCase()) {
        foundClassroom = { id, ...classroom }
        break
      }
    }

    if (!foundClassroom) {
      throw new ApiError(404, 'Classroom not found')
    }

    if (foundClassroom.status === 'ended') {
      throw new ApiError(400, 'This session has ended')
    }

    if (foundClassroom.participants.length >= foundClassroom.settings.maxParticipants) {
      throw new ApiError(400, 'Classroom is full')
    }

    res.json({
      success: true,
      data: {
        roomId: foundClassroom.id,
        title: foundClassroom.title,
        host: foundClassroom.host,
      },
    })
  } catch (error) {
    next(error)
  }
})

// @route   GET /api/classrooms/:id
// @desc    Get classroom details
// @access  Private
router.get('/:id', async (req, res, next) => {
  try {
    const classroom = classrooms.get(req.params.id)

    if (!classroom) {
      throw new ApiError(404, 'Classroom not found')
    }

    res.json({
      success: true,
      data: classroom,
    })
  } catch (error) {
    next(error)
  }
})

// @route   POST /api/classrooms/:id/start
// @desc    Start the classroom session
// @access  Private (host only)
router.post('/:id/start', async (req, res, next) => {
  try {
    const classroom = classrooms.get(req.params.id)

    if (!classroom) {
      throw new ApiError(404, 'Classroom not found')
    }

    if (classroom.host !== req.user.id) {
      throw new ApiError(403, 'Only the host can start the session')
    }

    classroom.status = 'active'
    classroom.startedAt = new Date()
    classrooms.set(req.params.id, classroom)

    res.json({
      success: true,
      message: 'Session started',
    })
  } catch (error) {
    next(error)
  }
})

// @route   POST /api/classrooms/:id/end
// @desc    End the classroom session
// @access  Private (host only)
router.post('/:id/end', async (req, res, next) => {
  try {
    const classroom = classrooms.get(req.params.id)

    if (!classroom) {
      throw new ApiError(404, 'Classroom not found')
    }

    if (classroom.host !== req.user.id) {
      throw new ApiError(403, 'Only the host can end the session')
    }

    classroom.status = 'ended'
    classroom.endedAt = new Date()
    classrooms.set(req.params.id, classroom)

    // Clean up after 24 hours
    setTimeout(() => {
      classrooms.delete(req.params.id)
    }, 24 * 60 * 60 * 1000)

    res.json({
      success: true,
      message: 'Session ended',
      data: {
        duration: classroom.endedAt - classroom.startedAt,
        participantCount: classroom.participants.length,
      },
    })
  } catch (error) {
    next(error)
  }
})

// @route   POST /api/classrooms/:id/poll
// @desc    Create a poll
// @access  Private (host only)
router.post('/:id/poll', async (req, res, next) => {
  try {
    const { question, options, duration = 60 } = req.body
    const classroom = classrooms.get(req.params.id)

    if (!classroom) {
      throw new ApiError(404, 'Classroom not found')
    }

    if (classroom.host !== req.user.id) {
      throw new ApiError(403, 'Only the host can create polls')
    }

    const poll = {
      id: crypto.randomUUID(),
      question,
      options,
      votes: {},
      createdAt: new Date(),
      duration,
      isActive: true,
    }

    classroom.polls.push(poll)
    classrooms.set(req.params.id, classroom)

    // Auto-end poll after duration
    setTimeout(() => {
      poll.isActive = false
      classrooms.set(req.params.id, classroom)
    }, duration * 1000)

    res.json({
      success: true,
      data: poll,
    })
  } catch (error) {
    next(error)
  }
})

// @route   POST /api/classrooms/:id/breakout
// @desc    Create breakout rooms
// @access  Private (host only)
router.post('/:id/breakout', async (req, res, next) => {
  try {
    const { roomCount, assignmentType = 'random' } = req.body
    const classroom = classrooms.get(req.params.id)

    if (!classroom) {
      throw new ApiError(404, 'Classroom not found')
    }

    if (classroom.host !== req.user.id) {
      throw new ApiError(403, 'Only the host can create breakout rooms')
    }

    const breakoutRooms = []
    const participants = [...classroom.participants]

    for (let i = 0; i < roomCount; i++) {
      breakoutRooms.push({
        id: crypto.randomUUID(),
        name: `Room ${i + 1}`,
        participants: [],
      })
    }

    // Random assignment
    if (assignmentType === 'random') {
      participants.sort(() => Math.random() - 0.5)
      participants.forEach((p, index) => {
        breakoutRooms[index % roomCount].participants.push(p)
      })
    }

    classroom.breakoutRooms = breakoutRooms
    classrooms.set(req.params.id, classroom)

    res.json({
      success: true,
      data: breakoutRooms,
    })
  } catch (error) {
    next(error)
  }
})

export default router
