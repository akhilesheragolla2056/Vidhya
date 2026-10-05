import express from 'express'
import AnalyticsEvent from '../models/AnalyticsEvent.js'
import Certificate from '../models/Certificate.js'
import Course from '../models/Course.js'
import TestAttempt from '../models/TestAttempt.js'
import User from '../models/User.js'
import UserProgress from '../models/UserProgress.js'
import VideoProgress from '../models/VideoProgress.js'
import { authMiddleware } from '../middleware/auth.js'
import { ApiError } from '../middleware/errorHandler.js'

const router = express.Router()
const dayKey = date => date.toISOString().slice(0, 10)

router.post('/event', authMiddleware, async (req, res, next) => {
  try {
    const { event, data = {} } = req.body
    if (typeof event !== 'string' || !event.trim() || event.trim().length > 100) {
      throw new ApiError(400, 'Event name is required and must be under 100 characters')
    }
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new ApiError(400, 'Event data must be an object')
    }
    if (JSON.stringify(data).length > 5000) {
      throw new ApiError(413, 'Event data is too large')
    }

    const record = await AnalyticsEvent.create({
      user: req.user._id,
      event: event.trim(),
      data,
    })

    res.status(201).json({ success: true, data: { id: record._id, createdAt: record.createdAt } })
  } catch (error) {
    next(error)
  }
})

router.get('/progress', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user._id
    const startOfToday = new Date()
    startOfToday.setUTCHours(0, 0, 0, 0)
    const rangeStart = new Date(startOfToday)
    rangeStart.setUTCDate(rangeStart.getUTCDate() - 6)

    const [user, storedProgress, certificates, videos, testAttempts] = await Promise.all([
      User.findById(userId).select('progress enrolledCourses'),
      UserProgress.findOne({ user: userId }).lean(),
      Certificate.countDocuments({ user: userId }),
      VideoProgress.find({ user: userId })
        .select('course lessonId activeSeconds isCompleted completedAt updatedAt')
        .populate('course', 'title')
        .lean(),
      TestAttempt.find({ user: userId })
        .select('course mockTest percentage isPassed createdAt')
        .populate('course', 'title')
        .populate('mockTest', 'title')
        .sort({ createdAt: -1 })
        .limit(20)
        .lean(),
    ])

    const activityByDay = new Map()
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(rangeStart)
      date.setUTCDate(date.getUTCDate() + index)
      const key = dayKey(date)
      const activity = { date: key, day: date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }), minutes: 0, lessons: 0 }
      activityByDay.set(key, activity)
      return activity
    })

    for (const video of videos) {
      const activityDate = video.completedAt || video.updatedAt
      if (!activityDate || activityDate < rangeStart) continue
      const activity = activityByDay.get(dayKey(new Date(activityDate)))
      if (!activity) continue
      activity.minutes += Math.round((video.activeSeconds || 0) / 60)
      if (video.isCompleted) activity.lessons += 1
    }

    const recentVideoActivity = videos
      .slice()
      .sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt))
      .slice(0, 10)
      .map(video => ({
        type: 'lesson',
        title: `${video.course?.title || 'Course lesson'} · ${video.lessonId}`,
        timestamp: video.updatedAt,
      }))
    const recentTestActivity = testAttempts.slice(0, 10).map(attempt => ({
      type: 'test',
      title: attempt.mockTest?.title || attempt.course?.title || 'Course test',
      score: attempt.percentage,
      timestamp: attempt.createdAt,
    }))
    const recentActivity = [...recentVideoActivity, ...recentTestActivity]
      .sort((left, right) => new Date(right.timestamp) - new Date(left.timestamp))
      .slice(0, 10)

    const totalLearningSeconds = videos.reduce((sum, video) => sum + (video.activeSeconds || 0), 0)
    const completedCourses = (storedProgress?.enrolledCourses || []).filter(
      course => course.isCompleted || course.courseCompletionPercentage >= 100
    ).length
    const summary = {
      totalCoursesEnrolled: user?.enrolledCourses.length || 0,
      coursesCompleted: completedCourses,
      lessonsCompleted: videos.filter(video => video.isCompleted).length,
      totalHoursLearned: Number((totalLearningSeconds / 3600).toFixed(1)),
      currentStreak: user?.progress.streakDays || 0,
      totalXP: user?.progress.totalXP || 0,
      level: user?.progress.level || 1,
      certificatesEarned: certificates,
    }

    res.json({
      success: true,
      data: {
        userId: userId.toString(),
        summary,
        weeklyActivity: days,
        skillProgress: [],
        recentActivity,
      },
    })
  } catch (error) {
    next(error)
  }
})

router.get('/insights', authMiddleware, async (req, res, next) => {
  try {
    const [user, storedProgress, attempts] = await Promise.all([
      User.findById(req.user._id).select('enrolledCourses learningProfile.interests'),
      UserProgress.findOne({ user: req.user._id }).lean(),
      TestAttempt.find({ user: req.user._id })
        .populate('course', 'title category')
        .sort({ createdAt: -1 })
        .limit(100)
        .lean(),
    ])

    const enrolledIds = (user?.enrolledCourses || []).map(enrollment => enrollment.course)
    const recommendations = await Course.find({
      _id: { $nin: enrolledIds },
      isPublished: true,
      ...(user?.learningProfile?.interests?.length && {
        category: { $in: user.learningProfile.interests },
      }),
    })
      .select('title description category level stats')
      .sort({ 'stats.rating': -1, 'stats.enrollments': -1 })
      .limit(3)
      .lean()

    const scoreByCourse = new Map()
    for (const attempt of attempts) {
      const courseId = attempt.course?._id?.toString()
      if (!courseId) continue
      const entry = scoreByCourse.get(courseId) || {
        title: attempt.course.title,
        total: 0,
        count: 0,
      }
      entry.total += attempt.percentage
      entry.count += 1
      scoreByCourse.set(courseId, entry)
    }
    const assessedCourses = Array.from(scoreByCourse.values()).map(course => ({
      title: course.title,
      averageScore: Math.round(course.total / course.count),
    }))

    const completedLessons = storedProgress?.enrolledCourses?.reduce(
      (sum, course) => sum + (course.videosCompleted || 0),
      0
    ) || 0
    const summary = completedLessons
      ? `You have completed ${completedLessons} video lessons. Keep going to build a longer-term learning history.`
      : 'Complete a lesson or course test to build personalized learning insights.'

    res.json({
      success: true,
      data: {
        userId: req.user._id.toString(),
        generatedAt: new Date(),
        summary,
        recommendations: recommendations.map(course => ({
          id: course._id,
          type: 'course',
          title: course.title,
          reason: `${course.category} course at ${course.level.toLowerCase()} level.`,
          priority: 'normal',
        })),
        strengths: assessedCourses.filter(course => course.averageScore >= 80),
        areasToImprove: assessedCourses.filter(course => course.averageScore < 70),
        nextMilestone: null,
      },
    })
  } catch (error) {
    next(error)
  }
})

router.get('/student/:id', authMiddleware, (req, res, next) => {
  next(new ApiError(403, 'Student reports require a configured teacher or parent relationship.'))
})

export default router
