import express from 'express'
import crypto from 'node:crypto'
import Classroom from '../models/Classroom.js'
import { ApiError } from '../middleware/errorHandler.js'
import { requireRole } from '../middleware/auth.js'

const router = express.Router()

const userIdOf = user => user?._id?.toString() || user?.id?.toString()
const SAMPLE_CLASSROOM_CODE = 'D3A025'

export const getClassroom = roomId => Classroom.findById(roomId)

export const addClassroomParticipant = (classroom, user) => {
  const userId = userIdOf(user)
  if (!userId) return false
  if (classroom.participants.some(participant => participant.userId === userId)) return false
  classroom.participants.push({
    userId,
    name: user.name || 'Learner',
    avatar: user.avatar || null,
    joinedAt: new Date(),
  })
  return true
}

async function makeUniqueCode() {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = crypto.randomBytes(3).toString('hex').toUpperCase()
    if (!(await Classroom.exists({ code }))) return code
  }
  throw new ApiError(503, 'Could not create a unique classroom code. Please try again.')
}

function requireParticipant(classroom, user) {
  const userId = userIdOf(user)
  return classroom.participants.some(participant => participant.userId === userId)
}

router.get('/', async (req, res, next) => {
  try {
    const userId = userIdOf(req.user)
    const classrooms = await Classroom.find({
      $or: [{ host: req.user._id }, { 'participants.userId': userId }],
    })
      .sort({ updatedAt: -1 })
      .limit(30)
      .select('code title courseId lessonId host status scheduledAt startedAt endedAt participants settings createdAt updatedAt')
    res.json({ success: true, data: classrooms })
  } catch (error) {
    next(error)
  }
})

router.post('/', requireRole('teacher', 'admin'), async (req, res, next) => {
  try {
    const { title, courseId, lessonId, scheduledAt } = req.body
    const settings = req.body.settings && typeof req.body.settings === 'object' && !Array.isArray(req.body.settings)
      ? req.body.settings
      : {}
    if (typeof title !== 'string' || !title.trim() || title.trim().length > 120) {
      throw new ApiError(400, 'A classroom name of up to 120 characters is required')
    }
    const parsedScheduledAt = scheduledAt ? new Date(scheduledAt) : null
    if (scheduledAt && (!Number.isFinite(parsedScheduledAt.getTime()) || parsedScheduledAt <= new Date())) {
      throw new ApiError(400, 'Choose a future date and time for this lesson')
    }

    const classroom = new Classroom({
      code: await makeUniqueCode(),
      title: title.trim(),
      courseId: typeof courseId === 'string' ? courseId : null,
      lessonId: typeof lessonId === 'string' ? lessonId : null,
      scheduledAt: parsedScheduledAt,
      host: req.user._id,
      settings: {
        allowChat: settings.allowChat !== false,
        allowHandRaise: settings.allowHandRaise !== false,
        allowScreenShare: settings.allowScreenShare === true,
        maxParticipants: Number.isInteger(settings.maxParticipants)
          ? Math.min(200, Math.max(2, settings.maxParticipants))
          : 100,
      },
    })
    addClassroomParticipant(classroom, req.user)
    await classroom.save()

    res.status(201).json({
      success: true,
      data: {
        roomId: classroom.id,
        roomCode: classroom.code,
        joinUrl: `/classroom/${classroom.id}`,
      },
    })
  } catch (error) {
    next(error)
  }
})

router.post('/join', async (req, res, next) => {
  try {
    const code = typeof req.body.code === 'string' ? req.body.code.trim().toUpperCase() : ''
    if (!/^[A-F0-9]{6}$/.test(code)) throw new ApiError(400, 'Enter a valid six-character classroom code')

    let classroom = await Classroom.findOne({ code })
    if (!classroom && code === SAMPLE_CLASSROOM_CODE) {
      classroom = new Classroom({
        code: SAMPLE_CLASSROOM_CODE,
        title: 'Sample Science Classroom',
        host: req.user._id,
        settings: { allowChat: true, allowHandRaise: true, maxParticipants: 200 },
      })
    }
    if (classroom?.status === 'ended' && code === SAMPLE_CLASSROOM_CODE) {
      classroom.host = req.user._id
      classroom.status = 'waiting'
      classroom.startedAt = null
      classroom.endedAt = null
      classroom.participants = []
      classroom.messages = []
      classroom.whiteboard = ''
    }
    if (!classroom) throw new ApiError(404, 'Classroom not found')
    if (classroom.status === 'ended') throw new ApiError(400, 'This session has ended')
    if (classroom.scheduledAt && classroom.scheduledAt > new Date()) {
      throw new ApiError(400, 'This lesson has not reached its scheduled start time yet.')
    }

    const alreadyJoined = requireParticipant(classroom, req.user)
    if (!alreadyJoined && classroom.participants.length >= classroom.settings.maxParticipants) {
      throw new ApiError(400, 'Classroom is full')
    }
    addClassroomParticipant(classroom, req.user)
    if (classroom.status === 'waiting') {
      classroom.status = 'active'
      classroom.startedAt = new Date()
    }
    await classroom.save()

    res.json({
      success: true,
      data: { roomId: classroom.id, title: classroom.title, host: classroom.host },
    })
  } catch (error) {
    next(error)
  }
})

router.post('/:id/join', async (req, res, next) => {
  try {
    const classroom = await getClassroom(req.params.id)
    if (!classroom) throw new ApiError(404, 'Classroom not found')
    if (classroom.status === 'ended') throw new ApiError(400, 'This session has ended')
    if (classroom.scheduledAt && classroom.scheduledAt > new Date()) {
      throw new ApiError(400, 'This lesson has not reached its scheduled start time yet.')
    }

    const alreadyJoined = requireParticipant(classroom, req.user)
    if (!alreadyJoined && classroom.participants.length >= classroom.settings.maxParticipants) {
      throw new ApiError(400, 'Classroom is full')
    }
    addClassroomParticipant(classroom, req.user)
    if (classroom.status === 'waiting') {
      classroom.status = 'active'
      classroom.startedAt = new Date()
    }
    await classroom.save()
    res.json({ success: true, data: classroom })
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const classroom = await getClassroom(req.params.id)
    if (!classroom) throw new ApiError(404, 'Classroom not found')
    if (!requireParticipant(classroom, req.user)) throw new ApiError(403, 'Join this classroom to view it')
    res.json({ success: true, data: classroom })
  } catch (error) {
    next(error)
  }
})

router.post('/:id/start', async (req, res, next) => {
  try {
    const classroom = await getClassroom(req.params.id)
    if (!classroom) throw new ApiError(404, 'Classroom not found')
    if (classroom.host.toString() !== userIdOf(req.user)) throw new ApiError(403, 'Only the host can start the session')
    if (classroom.status === 'ended') throw new ApiError(400, 'This session has ended')
    if (classroom.scheduledAt && classroom.scheduledAt > new Date()) {
      throw new ApiError(400, 'This lesson has not reached its scheduled start time yet.')
    }
    classroom.status = 'active'
    classroom.startedAt ||= new Date()
    await classroom.save()
    res.json({ success: true, message: 'Session started' })
  } catch (error) {
    next(error)
  }
})

router.post('/:id/end', async (req, res, next) => {
  try {
    const classroom = await getClassroom(req.params.id)
    if (!classroom) throw new ApiError(404, 'Classroom not found')
    if (classroom.host.toString() !== userIdOf(req.user)) throw new ApiError(403, 'Only the host can end the session')
    if (classroom.status !== 'ended') {
      classroom.status = 'ended'
      classroom.endedAt = new Date()
      await classroom.save()
    }
    res.json({
      success: true,
      message: 'Session ended',
      data: {
        duration: classroom.endedAt - (classroom.startedAt || classroom.createdAt),
        participantCount: classroom.participants.length,
      },
    })
  } catch (error) {
    next(error)
  }
})

router.post('/:id/poll', async (req, res, next) => {
  try {
    const { question, options, duration = 60 } = req.body
    const classroom = await getClassroom(req.params.id)
    if (!classroom) throw new ApiError(404, 'Classroom not found')
    if (classroom.host.toString() !== userIdOf(req.user)) throw new ApiError(403, 'Only the host can create polls')
    if (typeof question !== 'string' || !question.trim() || question.length > 300) {
      throw new ApiError(400, 'A poll question is required')
    }
    if (!Array.isArray(options) || options.length < 2 || options.length > 8 || options.some(option => typeof option !== 'string' || !option.trim() || option.length > 160)) {
      throw new ApiError(400, 'Polls require 2 to 8 valid answer options')
    }

    const poll = {
      id: crypto.randomUUID(),
      question: question.trim(),
      options: options.map(option => option.trim()),
      votes: {},
      createdAt: new Date(),
      duration: Math.min(3600, Math.max(10, Number(duration) || 60)),
      isActive: true,
    }
    classroom.polls.push(poll)
    await classroom.save()
    res.status(201).json({ success: true, data: poll })
  } catch (error) {
    next(error)
  }
})

router.post('/:id/breakout', async (req, res, next) => {
  try {
    const { roomCount, assignmentType = 'random' } = req.body
    const classroom = await getClassroom(req.params.id)
    if (!classroom) throw new ApiError(404, 'Classroom not found')
    if (classroom.host.toString() !== userIdOf(req.user)) throw new ApiError(403, 'Only the host can create breakout rooms')
    if (!Number.isInteger(roomCount) || roomCount < 2 || roomCount > 10) {
      throw new ApiError(400, 'Choose between 2 and 10 breakout rooms')
    }
    if (!['random', 'balanced'].includes(assignmentType)) {
      throw new ApiError(400, 'Unsupported breakout assignment type')
    }

    const participants = [...classroom.participants]
    if (assignmentType === 'random') participants.sort(() => Math.random() - 0.5)
    const rooms = Array.from({ length: roomCount }, (_, index) => ({
      id: crypto.randomUUID(),
      name: `Room ${index + 1}`,
      participants: [],
    }))
    participants.forEach((participant, index) => rooms[index % roomCount].participants.push(participant))
    classroom.breakoutRooms = rooms
    await classroom.save()
    res.json({ success: true, data: rooms })
  } catch (error) {
    next(error)
  }
})

export default router
