import express from 'express'
import MockTest from '../models/MockTest.js'
import TestAttempt from '../models/TestAttempt.js'
import UserProgress from '../models/UserProgress.js'
import VideoProgress from '../models/VideoProgress.js'
import Certificate from '../models/Certificate.js'
import Course from '../models/Course.js'
import { authMiddleware } from '../middleware/auth.js'
import { ApiError } from '../middleware/errorHandler.js'

const router = express.Router()

// ==================== MOCK TESTS ====================

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

// @route   GET /api/tests/:testId
// @desc    Get full test with questions
// @access  Private
router.get('/:testId', authMiddleware, async (req, res, next) => {
  try {
    const test = await MockTest.findById(req.params.testId)

    if (!test) {
      throw new ApiError('Test not found', 404)
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
    const { answers } = req.body
    const userId = req.user._id
    const testId = req.params.testId

    const test = await MockTest.findById(testId)
    if (!test) {
      throw new ApiError('Test not found', 404)
    }

    // Calculate score
    let score = 0
    const evaluatedAnswers = test.questions.map((question, idx) => {
      const userAnswer = answers[idx]
      const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(question.correctAnswer)

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

    const percentage = Math.round((score / test.totalPoints) * 100)
    const isPassed = percentage >= test.passingScore

    // Create test attempt record
    const attempt = await TestAttempt.create({
      user: userId,
      mockTest: testId,
      course: test.course,
      answers: evaluatedAnswers,
      score,
      totalPoints: test.totalPoints,
      percentage,
      isPassed,
      startTime: new Date(req.body.startTime),
      endTime: new Date(),
      timeSpent: req.body.timeSpent || 0,
    })

    // Update user progress
    await UserProgress.updateOne(
      { user: userId, 'enrolledCourses.course': test.course },
      {
        $inc: {
          'enrolledCourses.$.mockTestsAttempted': 1,
          'enrolledCourses.$.mockTestsPassed': isPassed ? 1 : 0,
        },
        $set: {
          'enrolledCourses.$.lastTestAttempt': new Date(),
          'enrolledCourses.$.bestTestScore': isPassed
            ? Math.max(
                percentage,
                (
                  await UserProgress.findOne({
                    user: userId,
                    'enrolledCourses.course': test.course,
                  })
                ).enrolledCourses[0]?.bestTestScore || 0
              )
            : undefined,
        },
      },
      { upsert: true }
    )

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
    const { course, lessonId, videoUrl, videoDuration, watchedDuration, isCompleted } = req.body
    const userId = req.user._id

    const videoProgress = await VideoProgress.findOneAndUpdate(
      {
        user: userId,
        course,
        lessonId,
      },
      {
        videoDuration,
        watchedDuration,
        completionPercentage: Math.round((watchedDuration / videoDuration) * 100),
        isCompleted,
        completedAt: isCompleted ? new Date() : undefined,
      },
      { upsert: true, new: true }
    )

    // Update user progress aggregate
    if (isCompleted) {
      const userProgress = await UserProgress.findOne({
        user: userId,
        'enrolledCourses.course': course,
      })

      if (userProgress) {
        const courseProgress = userProgress.enrolledCourses.find(
          e => e.course.toString() === course
        )

        if (courseProgress) {
          const totalVideos = courseProgress.videoProgress.length
          const completed = courseProgress.videoProgress.filter(v => v.isCompleted).length
          const completionPercentage = Math.round((completed / totalVideos) * 100)

          await UserProgress.updateOne(
            { user: userId, 'enrolledCourses.course': course },
            {
              $set: {
                'enrolledCourses.$.videosCompleted': completed,
                'enrolledCourses.$.courseCompletionPercentage': completionPercentage,
                'enrolledCourses.$.lastActivityDate': new Date(),
              },
            }
          )
        }
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
      throw new ApiError('Unauthorized', 403)
    }

    const progress = await UserProgress.findOne({
      user: req.params.userId,
    })
      .populate('enrolledCourses.course', 'title thumbnail category')
      .lean()

    res.json({
      success: true,
      data: progress,
    })
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
    const { courseId, testScore, videosCompletionPercentage } = req.body
    const userId = req.user._id

    // Verify course completion requirements
    if (videosCompletionPercentage < 80) {
      throw new ApiError('Videos must be 80% complete', 400)
    }

    if (testScore < 70) {
      throw new ApiError('Must score 70% or higher on test', 400)
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

    const course = await Course.findById(courseId)
    if (!course) {
      throw new ApiError('Course not found', 404)
    }

    // Calculate total learning hours
    const videoProgress = await VideoProgress.find({
      user: userId,
      course: courseId,
    })

    const totalSeconds = videoProgress.reduce((sum, v) => sum + (v.watchedDuration || 0), 0)
    const totalHours = Math.round(totalSeconds / 3600)

    const certificate = await Certificate.create({
      user: userId,
      course: courseId,
      completionDate: new Date(),
      videosCompletionPercentage,
      testScore,
      testPassingScore: 70,
      totalLearningHours: totalHours,
      verificationCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
    })

    // Increment user's certificate count
    await UserProgress.updateOne(
      { user: userId },
      {
        $inc: { certificatesEarned: 1 },
      }
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
      data: certificates,
    })
  } catch (error) {
    next(error)
  }
})

// @route   GET /api/certificates/:certificateId
// @desc    Get certificate details
// @access  Public
router.get('/:certificateId', async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.certificateId)
      .populate('user', 'name email')
      .populate('course', 'title category')

    if (!certificate) {
      throw new ApiError('Certificate not found', 404)
    }

    res.json({
      success: true,
      data: certificate,
    })
  } catch (error) {
    next(error)
  }
})

export default router
