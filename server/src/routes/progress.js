import express from 'express'
import { randomBytes } from 'node:crypto'
import mongoose from 'mongoose'
import MockTest from '../models/MockTest.js'
import TestAttempt from '../models/TestAttempt.js'
import UserProgress from '../models/UserProgress.js'
import VideoProgress from '../models/VideoProgress.js'
import Certificate from '../models/Certificate.js'
import Course from '../models/Course.js'
import User from '../models/User.js'
import LearningProgress from '../models/LearningProgress.js'
import { authMiddleware, requireRole } from '../middleware/auth.js'
import { ApiError } from '../middleware/errorHandler.js'

const router = express.Router()

const normalizeStringList = value => Array.isArray(value)
  ? [...new Set(value.filter(item => typeof item === 'string' && item.length <= 180))].slice(0, 500)
  : []

const normalizeScoreMap = value => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return Object.fromEntries(Object.entries(value).slice(0, 500).flatMap(([lessonId, result]) => {
    if (lessonId.length > 180 || !result || typeof result !== 'object') return []
    const totalQuestions = Math.min(200, Math.max(0, Math.floor(Number(result.totalQuestions) || 0)))
    const score = Math.min(totalQuestions, Math.max(0, Math.floor(Number(result.score) || 0)))
    return [[lessonId, {
      score,
      totalQuestions,
      percentage: totalQuestions ? Math.round((score / totalQuestions) * 100) : 0,
      attemptedAt: result.attemptedAt && Number.isFinite(new Date(result.attemptedAt).getTime())
        ? new Date(result.attemptedAt)
        : new Date(),
    }]]
  }))
}

const normalizeVideoProgress = value => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return Object.fromEntries(Object.entries(value).slice(0, 500).flatMap(([lessonId, item]) => {
    if (lessonId.length > 180 || !item || typeof item !== 'object') return []
    return [[lessonId, {
      watched: item.watched === true,
      percentage: Math.min(100, Math.max(0, Number(item.percentage) || 0)),
      watchedAt: item.watchedAt && Number.isFinite(new Date(item.watchedAt).getTime())
        ? new Date(item.watchedAt)
        : undefined,
    }]]
  }))
}

function certificateView(certificate) {
  const result = certificate.toObject ? certificate.toObject() : certificate
  if (!result.course && result.catalogCourseId) {
    result.course = { _id: result.catalogCourseId, title: result.catalogCourseTitle || 'Course' }
  }
  return result
}

function mergeWatchedRanges(ranges, start, end) {
  if (end <= start) return ranges
  const sorted = [...ranges, { start, end }].sort((left, right) => left.start - right.start)
  const merged = []
  for (const range of sorted) {
    const previous = merged.at(-1)
    if (!previous || range.start > previous.end) merged.push({ ...range })
    else previous.end = Math.max(previous.end, range.end)
  }
  return merged
}

const watchedRangeTotal = ranges => ranges.reduce((sum, range) => sum + range.end - range.start, 0)

// ==================== MOCK TESTS ====================

// @route   GET /api/tests
// @desc    List published tests without exposing answer keys
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const tests = await MockTest.find({ isPublished: true })
      .select('title description course duration totalPoints passingScore questions._id createdAt')
      .populate('course', 'title category')
      .sort({ createdAt: -1 })
      .limit(100)
      .lean()

    res.json({
      success: true,
      data: tests.map(test => ({ ...test, totalQuestions: test.questions?.length || 0, questions: undefined })),
    })
  } catch (error) {
    next(error)
  }
})

// @route   GET /api/tests/course/:courseId
// @desc    Get mock tests for a course
// @access  Public
router.get('/course/:courseId', async (req, res, next) => {
  try {
    const tests = await MockTest.find({
      course: req.params.courseId,
      isPublished: true,
    })
      .select('-questions.correctAnswer -questions.explanation')
      .lean()

    res.json({
      success: true,
      data: tests,
    })
  } catch (error) {
    next(error)
  }
})

router.get('/teacher/mine', authMiddleware, requireRole('teacher', 'admin'), async (req, res, next) => {
  try {
    const tests = await MockTest.find({ createdBy: req.user._id })
      .select('title description course duration totalPoints passingScore questions._id isPublished createdAt')
      .populate('course', 'title category')
      .sort({ createdAt: -1 })
      .limit(100)
      .lean()

    res.json({ success: true, data: tests.map(test => ({
      ...test,
      totalQuestions: test.questions?.length || 0,
      questions: undefined,
    })) })
  } catch (error) {
    next(error)
  }
})

router.post('/', authMiddleware, requireRole('teacher', 'admin'), async (req, res, next) => {
  try {
    const { course, title, description = '', instructions = '', questions, duration = 30, passingScore = 70 } = req.body
    if (typeof course !== 'string' || !mongoose.isValidObjectId(course)) {
      throw new ApiError(400, 'Choose a course before creating the exam')
    }
    if (typeof title !== 'string' || !title.trim() || title.trim().length > 120) {
      throw new ApiError(400, 'Enter an exam title of up to 120 characters')
    }
    if (!Array.isArray(questions) || questions.length < 1 || questions.length > 50) {
      throw new ApiError(400, 'Add between 1 and 50 questions')
    }
    const safeDuration = Number(duration)
    const safePassingScore = Number(passingScore)
    if (!Number.isInteger(safeDuration) || safeDuration < 5 || safeDuration > 240) {
      throw new ApiError(400, 'Exam duration must be between 5 and 240 minutes')
    }
    if (!Number.isFinite(safePassingScore) || safePassingScore < 0 || safePassingScore > 100) {
      throw new ApiError(400, 'Passing score must be between 0 and 100')
    }
    const courseExists = await Course.exists({ _id: course })
    if (!courseExists) throw new ApiError(404, 'Course not found')

    const normalizedQuestions = questions.map((question, index) => {
      const prompt = typeof question?.question === 'string' ? question.question.trim() : ''
      const options = Array.isArray(question?.options)
        ? question.options.map(option => typeof option === 'string' ? option.trim() : '').filter(Boolean)
        : []
      const correctAnswer = Number(question?.correctAnswer)
      if (!prompt || prompt.length > 1000 || options.length < 2 || options.length > 8 || !Number.isInteger(correctAnswer) || correctAnswer < 0 || correctAnswer >= options.length) {
        throw new ApiError(400, `Question ${index + 1} needs text, 2 to 8 options, and a valid correct answer`)
      }
      return {
        question: prompt,
        type: 'single',
        options,
        correctAnswer,
        explanation: typeof question.explanation === 'string' ? question.explanation.trim().slice(0, 1000) : '',
        points: Math.min(10, Math.max(1, Number(question.points) || 1)),
        difficulty: ['easy', 'medium', 'hard'].includes(question.difficulty) ? question.difficulty : 'medium',
      }
    })
    const totalPoints = normalizedQuestions.reduce((total, question) => total + question.points, 0)
    const test = await MockTest.create({
      course,
      title: title.trim(),
      description: typeof description === 'string' ? description.trim().slice(0, 1000) : '',
      instructions: typeof instructions === 'string' ? instructions.trim().slice(0, 2000) : '',
      questions: normalizedQuestions,
      duration: safeDuration,
      totalPoints,
      passingScore: safePassingScore,
      createdBy: req.user._id,
      isPublished: true,
    })
    res.status(201).json({ success: true, data: test })
  } catch (error) {
    next(error)
  }
})

// @route   GET /api/tests/:testId
// @desc    Get full test with questions
// @access  Private
router.get('/:testId', authMiddleware, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.testId)) throw new ApiError(400, 'Invalid test ID')
    const test = await MockTest.findById(req.params.testId)

    if (!test) {
      throw new ApiError(404, 'Test not found')
    }
    if (!test.isPublished && req.user.role !== 'admin' && test.createdBy?.toString() !== req.user._id.toString()) {
      throw new ApiError(404, 'Test not found')
    }

    // For authenticated users, don't show correct answers before they submit
    const testData = test.toObject()
    testData.questions = testData.questions.map(q => ({
      _id: q._id,
      question: q.question,
      type: q.type,
      options: q.options,
      points: q.points,
      difficulty: q.difficulty,
    }))

    res.json({
      success: true,
      data: testData,
    })
  } catch (error) {
    next(error)
  }
})

// @route   POST /api/tests/:testId/submit
// @desc    Submit test answers
// @access  Private
router.post('/:testId/submit', authMiddleware, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.testId)) throw new ApiError(400, 'Invalid test ID')
    const answers = Array.isArray(req.body.answers) ? req.body.answers : []
    const userId = req.user._id
    const testId = req.params.testId

    const test = await MockTest.findById(testId)
    if (!test) {
      throw new ApiError(404, 'Test not found')
    }
    if (!test.isPublished && req.user.role !== 'admin' && test.createdBy?.toString() !== userId.toString()) {
      throw new ApiError(404, 'Test not found')
    }

    // Calculate score from the points assigned to each question.
    const totalPoints = test.questions.reduce((sum, question) => sum + (question.points || 0), 0)
    if (!totalPoints) throw new ApiError(400, 'This test has no scored questions')

    let score = 0
    const evaluatedAnswers = test.questions.map((question, idx) => {
      const userAnswer = answers[idx]
      const isCorrect =
        question.type === 'multiple' && Array.isArray(userAnswer) && Array.isArray(question.correctAnswer)
          ? userAnswer.length === question.correctAnswer.length &&
            [...userAnswer].sort().every((answer, index) => answer === [...question.correctAnswer].sort()[index])
          : question.type === 'text' && typeof userAnswer === 'string' && typeof question.correctAnswer === 'string'
            ? userAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()
            : JSON.stringify(userAnswer) === JSON.stringify(question.correctAnswer)

      if (isCorrect) {
        score += question.points
      }

      return {
        questionId: question._id,
        selectedAnswer: userAnswer,
        isCorrect,
        pointsScored: isCorrect ? question.points : 0,
      }
    })

    const percentage = Math.round((score / totalPoints) * 100)
    const isPassed = percentage >= test.passingScore
    const priorAttempts = await TestAttempt.countDocuments({ user: userId, mockTest: testId })
    const allowedAttempts = (test.retakesAllowed ?? 3) + 1
    if (priorAttempts >= allowedAttempts) throw new ApiError(400, 'You have used all attempts for this assessment')
    const parsedStartTime = new Date(req.body.startTime)
    const startTime = Number.isNaN(parsedStartTime.getTime()) ? new Date() : parsedStartTime

    // Create test attempt record
    const attempt = await TestAttempt.create({
      user: userId,
      mockTest: testId,
      course: test.course,
      answers: evaluatedAnswers,
      score,
      totalPoints,
      percentage,
      isPassed,
      attemptNumber: priorAttempts + 1,
      startTime,
      endTime: new Date(),
      timeSpent: Number.isFinite(Number(req.body.timeSpent))
        ? Math.min(test.duration * 60, Math.max(0, Math.round(Number(req.body.timeSpent))))
        : 0,
    })

    // Maintain the aggregate without relying on a positional update to a missing array entry.
    const userProgress = await UserProgress.findOneAndUpdate(
      { user: userId },
      { $setOnInsert: { user: userId } },
      { new: true, upsert: true }
    )
    let courseProgress = userProgress.enrolledCourses.find(
      enrollment => enrollment.course.toString() === test.course.toString()
    )
    if (!courseProgress) {
      userProgress.enrolledCourses.push({
        course: test.course,
        mockTestsAttempted: 1,
        mockTestsPassed: isPassed ? 1 : 0,
        bestTestScore: isPassed ? percentage : 0,
        lastTestAttempt: new Date(),
      })
    } else {
      courseProgress.mockTestsAttempted += 1
      if (isPassed) {
        courseProgress.mockTestsPassed += 1
        courseProgress.bestTestScore = Math.max(courseProgress.bestTestScore || 0, percentage)
      }
      courseProgress.lastTestAttempt = new Date()
    }
    await userProgress.save()

    res.json({
      success: true,
      data: {
        attempt,
        score,
        percentage,
        isPassed,
      },
    })
  } catch (error) {
    next(error)
  }
})

// @route   GET /api/tests/attempts/:courseId
// @desc    Get user's test attempts for a course
// @access  Private
router.get('/attempts/:courseId', authMiddleware, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.courseId)) throw new ApiError(400, 'Invalid course ID')
    const attempts = await TestAttempt.find({
      user: req.user._id,
      course: req.params.courseId,
    })
      .populate('mockTest', 'title duration totalPoints')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: attempts,
    })
  } catch (error) {
    next(error)
  }
})

// ==================== VIDEO PROGRESS ====================

// @route   POST /api/progress/video
// @desc    Update video watch progress
// @access  Private
router.post('/video', authMiddleware, async (req, res, next) => {
  try {
    const { course: courseId, lessonId, videoUrl } = req.body
    const videoDuration = Number(req.body.videoDuration)
    const playheadSeconds = Number(req.body.playheadSeconds)
    const userId = req.user._id
    if (
      typeof courseId !== 'string' ||
      !mongoose.isValidObjectId(courseId) ||
      typeof lessonId !== 'string' ||
      !Number.isFinite(videoDuration) ||
      videoDuration <= 0 ||
      !Number.isFinite(playheadSeconds)
    ) {
      throw new ApiError(400, 'Valid course, lesson, and video progress are required')
    }

    const courseDocument = await Course.findById(courseId).select('modules')
    if (!courseDocument) throw new ApiError(404, 'Course not found')
    const lessons = courseDocument.modules.flatMap(module => module.lessons)
    const lesson = lessons.find(item => item._id.toString() === lessonId)
    if (!lesson || lesson.type !== 'video' || !lesson.content?.videoUrl) {
      throw new ApiError(400, 'Lesson does not contain a trackable video')
    }

    const now = new Date()
    const boundedPosition = Math.min(videoDuration, Math.max(0, playheadSeconds))
    const existingProgress = await VideoProgress.findOne({
      user: userId,
      course: courseId,
      lessonId,
    })
    const previousPosition = existingProgress?.lastPosition ?? existingProgress?.furthestPosition ?? 0
    const elapsedSinceUpdate = existingProgress
      ? Math.max(0, (now - (existingProgress.updatedAt || existingProgress.createdAt)) / 1000)
      : 0
    const forwardDelta = boundedPosition - previousPosition
    const plausiblePlayback = !existingProgress || (
      forwardDelta >= 0 && forwardDelta <= elapsedSinceUpdate * 2.5 + 2
    )
    const acceptedPlaybackSeconds = plausiblePlayback
      ? Math.min(Math.max(0, forwardDelta), Math.min(15, elapsedSinceUpdate * 2.5))
      : 0
    const activeSecondsAdded = existingProgress
      ? Math.min(acceptedPlaybackSeconds, elapsedSinceUpdate)
      : Math.min(boundedPosition, 5)
    const furthestPosition = Math.max(existingProgress?.furthestPosition || 0, boundedPosition)
    const priorRanges = existingProgress?.watchedRanges?.length
      ? existingProgress.watchedRanges.map(range => ({ start: range.start, end: range.end }))
      : existingProgress?.completionPercentage
        ? [{ start: 0, end: Math.min(videoDuration, videoDuration * existingProgress.completionPercentage / 100) }]
        : []
    const recordRange = acceptedPlaybackSeconds > 0 || !existingProgress
    const rangeStart = existingProgress
      ? boundedPosition - acceptedPlaybackSeconds
      : Math.max(0, boundedPosition - activeSecondsAdded)
    const watchedRanges = recordRange
      ? mergeWatchedRanges(priorRanges, rangeStart, boundedPosition)
      : priorRanges
    const watchedSeconds = Math.min(videoDuration, watchedRangeTotal(watchedRanges))
    const completionPercentage = Math.min(100, Math.round((watchedSeconds / videoDuration) * 100))
    const isCompleted = Boolean(existingProgress?.isCompleted || completionPercentage >= 80)

    const videoProgress = await VideoProgress.findOneAndUpdate(
      {
        user: userId,
        course: courseId,
        lessonId,
      },
      {
        videoUrl: videoUrl || lesson.content.videoUrl,
        videoDuration: Math.max(1, Math.round(videoDuration)),
        watchedDuration: furthestPosition,
        furthestPosition,
        lastPosition: boundedPosition,
        watchedSeconds,
        watchedRanges,
        activeSeconds: (existingProgress?.activeSeconds || 0) + activeSecondsAdded,
        completionPercentage,
        isCompleted,
        completedAt: isCompleted ? existingProgress?.completedAt || now : undefined,
      },
      { upsert: true, new: true }
    )

    // Update user progress aggregate
    if (isCompleted && !existingProgress?.isCompleted) {
      const courseVideos = lessons.filter(
        item => item.type === 'video' && item.content?.videoUrl
      )
      const videoLessonIds = courseVideos.map(item => item._id.toString())
      const completedVideos = await VideoProgress.find({
        user: userId,
        course: courseId,
        lessonId: { $in: videoLessonIds },
        isCompleted: true,
      }).select('lessonId activeSeconds')
      const courseCompletionPercentage = courseVideos.length
        ? Math.round((completedVideos.length / courseVideos.length) * 100)
        : 0
      const userProgress = await UserProgress.findOneAndUpdate(
        { user: userId },
        { $setOnInsert: { user: userId } },
        { new: true, upsert: true }
      )
      let courseProgress = userProgress.enrolledCourses.find(
        enrollment => enrollment.course.toString() === courseId
      )
      if (!courseProgress) {
        userProgress.enrolledCourses.push({
          course: courseId,
          videoProgress: completedVideos,
          videosWatched: completedVideos.length,
          videosCompleted: completedVideos.length,
          courseCompletionPercentage,
          lastActivityDate: now,
        })
      } else {
        courseProgress.videoProgress = completedVideos
        courseProgress.videosWatched = completedVideos.length
        courseProgress.videosCompleted = completedVideos.length
        courseProgress.courseCompletionPercentage = courseCompletionPercentage
        courseProgress.isCompleted = courseCompletionPercentage === 100
        courseProgress.completedAt = courseProgress.isCompleted
          ? courseProgress.completedAt || now
          : undefined
        courseProgress.lastActivityDate = now
      }

      const userVideoTotals = await VideoProgress.aggregate([
        { $match: { user: userId } },
        { $group: { _id: null, seconds: { $sum: '$activeSeconds' } } },
      ])
      userProgress.totalLearningHours = Number(
        ((userVideoTotals[0]?.seconds || 0) / 3600).toFixed(2)
      )
      userProgress.lastActiveDate = now
      await userProgress.save()

      const learner = await User.findById(userId)
      const enrollment = learner?.enrolledCourses.find(
        item => item.course.toString() === courseId
      )
      if (enrollment) {
        if (!enrollment.completedLessons.includes(lessonId)) enrollment.completedLessons.push(lessonId)
        enrollment.progress = lessons.length
          ? Math.round((enrollment.completedLessons.length / lessons.length) * 100)
          : 0
        await learner.save()
      }
    }

    res.json({
      success: true,
      data: videoProgress,
    })
  } catch (error) {
    next(error)
  }
})

// @route   GET /api/progress/user/:userId
// @desc    Get user's overall progress
// @access  Private
router.get('/user/:userId', authMiddleware, async (req, res, next) => {
  try {
    if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
      throw new ApiError(403, 'Unauthorized')
    }
    if (!mongoose.isValidObjectId(req.params.userId)) {
      throw new ApiError(400, 'Invalid user ID')
    }

    const targetUserId = new mongoose.Types.ObjectId(req.params.userId)
    const [progress, user, videoTotals, certificatesEarned] = await Promise.all([
      UserProgress.findOne({ user: targetUserId })
        .populate('enrolledCourses.course', 'title thumbnail category')
        .lean(),
      User.findById(targetUserId).select('progress enrolledCourses'),
      VideoProgress.aggregate([
        { $match: { user: targetUserId } },
        {
          $group: {
            _id: null,
            activeSeconds: { $sum: '$activeSeconds' },
            lessonsCompleted: { $sum: { $cond: ['$isCompleted', 1, 0] } },
          },
        },
      ]),
      Certificate.countDocuments({ user: targetUserId }),
    ])

    const completedCourses = (progress?.enrolledCourses || []).filter(
      enrollment => enrollment.isCompleted || enrollment.courseCompletionPercentage >= 100
    ).length
    const summary = {
      totalCoursesEnrolled: user?.enrolledCourses.length || 0,
      coursesCompleted: completedCourses,
      lessonsCompleted: videoTotals[0]?.lessonsCompleted || 0,
      totalLearningHours: Number(((videoTotals[0]?.activeSeconds || 0) / 3600).toFixed(1)),
      currentStreak: user?.progress.streakDays || 0,
      totalXP: user?.progress.totalXP || 0,
      level: user?.progress.level || 1,
      certificatesEarned,
    }

    res.json({
      success: true,
      data: progress,
      summary,
    })
  } catch (error) {
    next(error)
  }
})

// Account-owned progress for the bundled course catalogue. These course IDs
// are stable slugs rather than Mongo Course ObjectIds.
router.get('/learning', authMiddleware, async (req, res, next) => {
  try {
    const progress = await LearningProgress.find({ user: req.user._id })
      .sort({ lastAccessed: -1 })
      .lean()
    res.json({ success: true, data: progress })
  } catch (error) {
    next(error)
  }
})

router.get('/learning/:courseId', authMiddleware, async (req, res, next) => {
  try {
    const progress = await LearningProgress.findOne({
      user: req.user._id,
      courseId: req.params.courseId,
    }).lean()
    res.json({ success: true, data: progress })
  } catch (error) {
    next(error)
  }
})

router.put('/learning/:courseId', authMiddleware, async (req, res, next) => {
  try {
    const { courseId } = req.params
    if (!/^[a-zA-Z0-9_-]{1,160}$/.test(courseId)) {
      throw new ApiError(400, 'Invalid course ID')
    }
    const lessonIds = normalizeStringList(req.body.lessonIds)
    const totalLessons = Math.min(500, Math.max(0, Math.floor(Number(req.body.totalLessons) || lessonIds.length)))
    const mcqScores = normalizeScoreMap(req.body.mcqScores)
    const passedLessons = lessonIds.filter(lessonId => Number(mcqScores[lessonId]?.percentage) >= 60)
    const overallProgress = totalLessons
      ? Math.round((Math.min(passedLessons.length, totalLessons) / totalLessons) * 100)
      : 0
    const now = new Date()
    const requestedStatus = overallProgress === 100
      ? 'completed'
      : (req.body.startedAt || req.body.lastAccessed || passedLessons.length ? 'in-progress' : 'not-started')
    const toDate = value => value && Number.isFinite(new Date(value).getTime()) ? new Date(value) : undefined
    const update = {
      courseTitle: typeof req.body.courseTitle === 'string' ? req.body.courseTitle.trim().slice(0, 200) : '',
      category: typeof req.body.category === 'string' ? req.body.category.trim().slice(0, 100) : '',
      totalLessons,
      completedLessons: passedLessons,
      videoProgress: normalizeVideoProgress(req.body.videoProgress),
      completedMCQs: passedLessons,
      mcqScores,
      notesRead: normalizeStringList(req.body.notesRead),
      status: requestedStatus,
      lastAccessed: toDate(req.body.lastAccessed) || now,
      startedAt: toDate(req.body.startedAt) || (requestedStatus !== 'not-started' ? now : undefined),
      completedAt: overallProgress === 100 ? toDate(req.body.completedAt) || now : undefined,
      overallProgress,
      activeSeconds: Math.min(100_000_000, Math.max(0, Number(req.body.activeSeconds) || 0)),
    }

    const progress = await LearningProgress.findOneAndUpdate(
      { user: req.user._id, courseId },
      { $set: update, $setOnInsert: { user: req.user._id, courseId } },
      { upsert: true, new: true, runValidators: true }
    )

    let certificate = null
    if (requestedStatus === 'completed' && totalLessons > 0 && passedLessons.length >= totalLessons) {
      const testScore = Math.round(
        passedLessons.reduce((sum, lessonId) => sum + Number(mcqScores[lessonId].percentage), 0) / totalLessons
      )
      certificate = await Certificate.findOne({ user: req.user._id, catalogCourseId: courseId })
      if (!certificate) {
        try {
          certificate = await Certificate.create({
            user: req.user._id,
            catalogCourseId: courseId,
            catalogCourseTitle: update.courseTitle || courseId,
            completionDate: update.completedAt,
            videosCompletionPercentage: overallProgress,
            testScore,
            testPassingScore: 60,
            totalLearningHours: Number((update.activeSeconds / 3600).toFixed(2)),
            verificationCode: randomBytes(8).toString('hex').toUpperCase(),
          })
        } catch (error) {
          if (error.code !== 11000) throw error
          certificate = await Certificate.findOne({ user: req.user._id, catalogCourseId: courseId })
        }
      }
    }

    res.json({ success: true, data: progress, certificate: certificate ? certificateView(certificate) : null })
  } catch (error) {
    next(error)
  }
})

// ==================== CERTIFICATES ====================

// @route   POST /api/certificates/generate
// @desc    Generate certificate for completed course
// @access  Private
router.post('/generate', authMiddleware, async (req, res, next) => {
  try {
    const { courseId } = req.body
    const userId = req.user._id
    if (typeof courseId !== 'string' || !mongoose.isValidObjectId(courseId)) {
      throw new ApiError(400, 'A valid course is required')
    }

    // Check if certificate already exists
    const existingCert = await Certificate.findOne({
      user: userId,
      course: courseId,
    })

    if (existingCert) {
      return res.json({
        success: true,
        data: existingCert,
        message: 'Certificate already issued',
      })
    }

    const [course, isEnrolled] = await Promise.all([
      Course.findById(courseId),
      User.exists({ _id: userId, 'enrolledCourses.course': courseId }),
    ])
    if (!course) {
      throw new ApiError(404, 'Course not found')
    }
    if (!isEnrolled) throw new ApiError(403, 'Enroll in this course before requesting its certificate')

    const [videoProgress, bestPassingAttempt] = await Promise.all([
      VideoProgress.find({ user: userId, course: courseId }),
      TestAttempt.findOne({ user: userId, course: courseId, isPassed: true }).sort({
        percentage: -1,
        createdAt: -1,
      }),
    ])

    const courseVideoIds = course.modules
      .flatMap(module => module.lessons)
      .filter(lesson => lesson.type === 'video' && lesson.content?.videoUrl)
      .map(lesson => lesson._id.toString())
    const completedLessonIds = new Set(
      videoProgress
        .filter(progress => progress.isCompleted && courseVideoIds.includes(progress.lessonId))
        .map(progress => progress.lessonId)
    )
    const videosCompletionPercentage = courseVideoIds.length
      ? Math.round((completedLessonIds.size / courseVideoIds.length) * 100)
      : 0
    const testScore = bestPassingAttempt?.percentage || 0

    if (videosCompletionPercentage < 80) {
      throw new ApiError(400, 'Complete at least 80% of the course lessons first')
    }
    if (testScore < 70) {
      throw new ApiError(400, 'Pass a course test with at least 70% before requesting a certificate')
    }

    // Calculate total learning hours
    const totalSeconds = videoProgress.reduce((sum, v) => sum + (v.activeSeconds || 0), 0)
    const totalHours = Math.round(totalSeconds / 3600)

    const certificate = await Certificate.create({
      user: userId,
      course: courseId,
      completionDate: new Date(),
      videosCompletionPercentage,
      testScore,
      testPassingScore: 70,
      totalLearningHours: totalHours,
      verificationCode: randomBytes(8).toString('hex').toUpperCase(),
    })

    // Increment user's certificate count
    await UserProgress.updateOne(
      { user: userId },
      {
        $setOnInsert: { user: userId },
        $inc: { certificatesEarned: 1 },
      },
      { upsert: true }
    )

    res.status(201).json({
      success: true,
      data: certificate,
    })
  } catch (error) {
    next(error)
  }
})

// @route   GET /api/certificates/user
// @desc    Get user's certificates
// @access  Private
router.get('/user', authMiddleware, async (req, res, next) => {
  try {
    const certificates = await Certificate.find({
      user: req.user._id,
    })
      .populate('course', 'title category thumbnail')
      .sort({ issueDate: -1 })

    res.json({
      success: true,
      data: certificates.map(certificateView),
    })
  } catch (error) {
    next(error)
  }
})

// @route   GET /api/progress/certificates/user
// @desc    Legacy certificate list URL
// @access  Private
router.get('/certificates/user', authMiddleware, async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ user: req.user._id })
      .populate('course', 'title category thumbnail')
      .sort({ issueDate: -1 })

    res.json({ success: true, data: certificates.map(certificateView) })
  } catch (error) {
    next(error)
  }
})

// @route   GET /api/certificates/:certificateId
// @desc    Get certificate details
// @access  Public
router.get('/:certificateId', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.certificateId)) throw new ApiError(400, 'Invalid certificate ID')
    const certificate = await Certificate.findById(req.params.certificateId)
      .populate('user', 'name')
      .populate('course', 'title category')

    if (!certificate) {
      throw new ApiError(404, 'Certificate not found')
    }

    res.json({
      success: true,
      data: certificateView(certificate),
    })
  } catch (error) {
    next(error)
  }
})

export default router
