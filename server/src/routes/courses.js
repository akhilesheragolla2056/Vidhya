import express from 'express'
import Course from '../models/Course.js'
import User from '../models/User.js'
import { ApiError } from '../middleware/errorHandler.js'
import { authMiddleware, optionalAuth } from '../middleware/auth.js'

const router = express.Router()

// @route   GET /api/courses
// @desc    Get all courses with filters
// @access  Public
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { 
      category, 
      level, 
      search, 
      isFree,
      page = 1, 
      limit = 12,
      sort = '-createdAt'
    } = req.query

    const query = { isPublished: true }

    if (category) query.category = category
    if (level) query.level = level
    if (isFree !== undefined) query['pricing.isFree'] = isFree === 'true'
    if (search) {
      query.$text = { $search: search }
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name avatar')
      .select('-modules.lessons.content')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))

    const total = await Course.countDocuments(query)

    res.json({
      success: true,
      data: courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    next(error)
  }
})

// @route   GET /api/courses/recommendations
// @desc    Get personalized course recommendations
// @access  Private
router.get('/recommendations', authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    const enrolledCourseIds = user.enrolledCourses.map(ec => ec.course)

    // Get recommendations based on user's interests and learning style
    const recommendations = await Course.find({
      _id: { $nin: enrolledCourseIds },
      isPublished: true,
      ...(user.learningProfile.interests?.length > 0 && {
        category: { $in: user.learningProfile.interests },
      }),
    })
      .populate('instructor', 'name avatar')
      .sort('-stats.rating -stats.enrollments')
      .limit(6)

    res.json({
      success: true,
      data: recommendations,
    })
  } catch (error) {
    next(error)
  }
})

// @route   GET /api/courses/enrolled
// @desc    Get all enrolled courses for current user
// @access  Private
router.get('/enrolled', authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'enrolledCourses.course',
        select: 'title description thumbnail category level duration modules',
        populate: { path: 'instructor', select: 'name avatar' }
      })

    const enrolledCourses = user.enrolledCourses.map(enrollment => {
      const course = enrollment.course
      if (!course) return null
      
      const totalLessons = course.modules?.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0) || 0
      
      return {
        id: course._id,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        category: course.category,
        level: course.level,
        instructor: course.instructor,
        progress: enrollment.progress || 0,
        lessonsCompleted: enrollment.completedLessons?.length || 0,
        totalLessons,
        enrolledAt: enrollment.enrolledAt,
        lastAccessed: enrollment.lastAccessed,
      }
    }).filter(Boolean)

    res.json({
      success: true,
      data: enrolledCourses,
    })
  } catch (error) {
    next(error)
  }
})

// @route   GET /api/courses/:id
// @desc    Get course by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar bio')

    if (!course) {
      throw new ApiError(404, 'Course not found')
    }

    // Check if user is enrolled
    let isEnrolled = false
    let userProgress = null
    
    if (req.user) {
      const user = await User.findById(req.user.id)
      const enrollment = user.enrolledCourses.find(
        ec => ec.course.toString() === course._id.toString()
      )
      if (enrollment) {
        isEnrolled = true
        userProgress = {
          progress: enrollment.progress,
          completedLessons: enrollment.completedLessons,
        }
      }
    }

    res.json({
      success: true,
      data: {
        ...course.toObject(),
        isEnrolled,
        userProgress,
      },
    })
  } catch (error) {
    next(error)
  }
})

// @route   POST /api/courses/:id/enroll
// @desc    Enroll in a course
// @access  Private
router.post('/:id/enroll', authMiddleware, async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
    
    if (!course) {
      throw new ApiError(404, 'Course not found')
    }

    const user = await User.findById(req.user.id)
    
    // Check if already enrolled
    const alreadyEnrolled = user.enrolledCourses.find(
      ec => ec.course.toString() === course._id.toString()
    )
    
    if (alreadyEnrolled) {
      throw new ApiError(400, 'Already enrolled in this course')
    }

    // Add enrollment
    user.enrolledCourses.push({
      course: course._id,
      enrolledAt: new Date(),
      progress: 0,
      completedLessons: [],
    })
    await user.save()

    // Update course stats
    course.stats.enrollments += 1
    await course.save()

    res.json({
      success: true,
      message: 'Successfully enrolled in course',
      data: {
        courseId: course._id,
        enrolledAt: new Date(),
      },
    })
  } catch (error) {
    next(error)
  }
})

// @route   GET /api/courses/:id/progress
// @desc    Get user's progress in a course
// @access  Private
router.get('/:id/progress', authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    const enrollment = user.enrolledCourses.find(
      ec => ec.course.toString() === req.params.id
    )

    if (!enrollment) {
      throw new ApiError(404, 'Not enrolled in this course')
    }

    res.json({
      success: true,
      data: {
        progress: enrollment.progress,
        completedLessons: enrollment.completedLessons,
        enrolledAt: enrollment.enrolledAt,
      },
    })
  } catch (error) {
    next(error)
  }
})

// @route   POST /api/courses/:courseId/lessons/:lessonId/complete
// @desc    Mark lesson as complete
// @access  Private
router.post('/:courseId/lessons/:lessonId/complete', authMiddleware, async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.params
    const user = await User.findById(req.user.id)
    const course = await Course.findById(courseId)

    if (!course) {
      throw new ApiError(404, 'Course not found')
    }

    const enrollmentIndex = user.enrolledCourses.findIndex(
      ec => ec.course.toString() === courseId
    )

    if (enrollmentIndex === -1) {
      throw new ApiError(404, 'Not enrolled in this course')
    }

    // Add lesson to completed if not already
    if (!user.enrolledCourses[enrollmentIndex].completedLessons.includes(lessonId)) {
      user.enrolledCourses[enrollmentIndex].completedLessons.push(lessonId)
      
      // Calculate new progress
      const totalLessons = course.lessonsCount
      const completedCount = user.enrolledCourses[enrollmentIndex].completedLessons.length
      user.enrolledCourses[enrollmentIndex].progress = Math.round((completedCount / totalLessons) * 100)

      // Add XP
      const leveledUp = user.addXP(10)
      user.updateStreak()
      
      await user.save()

      res.json({
        success: true,
        message: 'Lesson completed',
        data: {
          progress: user.enrolledCourses[enrollmentIndex].progress,
          xpEarned: 10,
          leveledUp,
          newLevel: leveledUp ? user.progress.level : null,
        },
      })
    } else {
      res.json({
        success: true,
        message: 'Lesson already completed',
      })
    }
  } catch (error) {
    next(error)
  }
})

export default router
