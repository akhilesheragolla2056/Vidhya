import express from 'express'
import { randomBytes } from 'node:crypto'
import Certificate from '../models/Certificate.js'
import User from '../models/User.js'
import UserProgress from '../models/UserProgress.js'
import VideoProgress from '../models/VideoProgress.js'
import { authMiddleware, requireRole } from '../middleware/auth.js'
import { ApiError } from '../middleware/errorHandler.js'

const router = express.Router()

router.use(authMiddleware)

router.get('/code', requireRole('student'), async (req, res, next) => {
  try {
    const student = req.user
    if (!student.parentLinkCode || !student.parentLinkCodeExpiresAt || student.parentLinkCodeExpiresAt <= new Date()) {
      let code
      for (let attempt = 0; attempt < 5; attempt += 1) {
        code = randomBytes(5).toString('hex').toUpperCase()
        if (!(await User.exists({ parentLinkCode: code }))) break
        code = null
      }
      if (!code) throw new ApiError(503, 'Could not generate a family link code. Please try again.')
      student.parentLinkCode = code
      student.parentLinkCodeExpiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      await student.save()
    }

    res.json({
      success: true,
      data: { code: student.parentLinkCode, expiresAt: student.parentLinkCodeExpiresAt },
    })
  } catch (error) {
    next(error)
  }
})

router.post('/connect', requireRole('parent'), async (req, res, next) => {
  try {
    const code = typeof req.body.code === 'string' ? req.body.code.trim().toUpperCase() : ''
    if (!/^[A-F0-9]{10}$/.test(code)) throw new ApiError(400, 'Enter the 10-character code shown in the student profile.')

    const student = await User.findOne({
      role: 'student',
      parentLinkCode: code,
      parentLinkCodeExpiresAt: { $gt: new Date() },
    })
    if (!student) throw new ApiError(404, 'That code is expired or unavailable. Ask the student to create a new one.')
    if (student._id.equals(req.user._id)) throw new ApiError(400, 'A parent account cannot link to itself.')

    const parent = req.user
    const childAlreadyLinked = parent.linkedChildren.some(id => id.equals(student._id))
    if (!childAlreadyLinked) parent.linkedChildren.push(student._id)
    const parentAlreadyLinked = student.linkedParents.some(id => id.equals(parent._id))
    if (!parentAlreadyLinked) student.linkedParents.push(parent._id)

    // A code can be used once. The student can generate another if a second guardian needs access.
    student.parentLinkCode = undefined
    student.parentLinkCodeExpiresAt = undefined
    await Promise.all([parent.save(), student.save()])

    res.json({ success: true, message: `${student.name} is now connected to your parent account.` })
  } catch (error) {
    next(error)
  }
})

router.get('/children', requireRole('parent'), async (req, res, next) => {
  try {
    const children = await User.find({ _id: { $in: req.user.linkedChildren || [] }, role: 'student' })
      .select('name avatar progress enrolledCourses createdAt')
      .populate('enrolledCourses.course', 'title category thumbnail')
      .lean()

    const data = await Promise.all(children.map(async child => {
      const [progressRecord, videoTotals, certificates] = await Promise.all([
        UserProgress.findOne({ user: child._id })
          .populate('enrolledCourses.course', 'title category thumbnail')
          .lean(),
        VideoProgress.aggregate([
          { $match: { user: child._id } },
          {
            $group: {
              _id: null,
              activeSeconds: { $sum: '$activeSeconds' },
              lessonsCompleted: { $sum: { $cond: ['$isCompleted', 1, 0] } },
            },
          },
        ]),
        Certificate.find({ user: child._id })
          .populate('course', 'title category')
          .sort({ issueDate: -1 })
          .lean(),
      ])

      const localLessonsCompleted = (child.enrolledCourses || []).reduce(
        (count, enrollment) => count + (enrollment.completedLessons?.length || 0),
        0
      )
      const courseRows = (child.enrolledCourses || []).map(enrollment => ({
        id: enrollment.course?._id || enrollment.course,
        title: enrollment.course?.title || 'Course',
        category: enrollment.course?.category || '',
        thumbnail: enrollment.course?.thumbnail || '',
        progress: Number(enrollment.progress) || 0,
        completedLessons: enrollment.completedLessons?.length || 0,
      }))
      const recordCourses = (progressRecord?.enrolledCourses || []).map(enrollment => ({
        id: enrollment.course?._id || enrollment.course,
        title: enrollment.course?.title || 'Course',
        category: enrollment.course?.category || '',
        thumbnail: enrollment.course?.thumbnail || '',
        progress: Number(enrollment.courseCompletionPercentage) || 0,
        completedLessons: Number(enrollment.videosCompleted) || 0,
      }))
      const coursesById = new Map()
      ;[...courseRows, ...recordCourses].forEach(course => {
        const id = String(course.id)
        const previous = coursesById.get(id)
        if (!previous || course.progress > previous.progress) coursesById.set(id, course)
      })

      return {
        id: child._id,
        name: child.name,
        avatar: child.avatar,
        courses: Array.from(coursesById.values()),
        certificates,
        badges: child.progress?.badges || [],
        progress: {
          coursesCompleted: Math.max(
            (progressRecord?.enrolledCourses || []).filter(course => course.isCompleted || course.courseCompletionPercentage >= 100).length,
            courseRows.filter(course => course.progress >= 100).length
          ),
          lessonsCompleted: Math.max(videoTotals[0]?.lessonsCompleted || 0, localLessonsCompleted),
          hoursLearned: Number(((videoTotals[0]?.activeSeconds || 0) / 3600).toFixed(1)),
          level: child.progress?.level || 1,
          totalXP: child.progress?.totalXP || 0,
          streakDays: child.progress?.streakDays || 0,
          badgesEarned: (child.progress?.badges || []).length,
          certificatesEarned: certificates.length,
        },
      }
    }))

    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
})

export default router
