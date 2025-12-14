import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { ApiError } from '../middleware/errorHandler.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  )
}

// @route   POST /api/auth/signup
// @desc    Register new user
// @access  Public
router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new ApiError(400, 'Email already registered')
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
    })

    // Generate token
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
})

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      throw new ApiError(400, 'Please provide email and password')
    }

    // Find user
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      throw new ApiError(401, 'Invalid credentials')
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      throw new ApiError(401, 'Invalid credentials')
    }

    // Update streak
    user.updateStreak()
    await user.save()

    // Generate token
    const token = generateToken(user._id)

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        progress: user.progress,
        learningProfile: user.learningProfile,
      },
    })
  } catch (error) {
    next(error)
  }
})

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('enrolledCourses.course', 'title thumbnail category level')
    
    res.json({
      success: true,
      ...user.toObject(),
    })
  } catch (error) {
    next(error)
  }
})

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authMiddleware, async (req, res, next) => {
  try {
    const { name, learningProfile, avatar } = req.body

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        ...(name && { name }),
        ...(avatar && { avatar }),
        ...(learningProfile && { learningProfile: { ...req.user.learningProfile, ...learningProfile } }),
      },
      { new: true, runValidators: true }
    )

    res.json({
      success: true,
      user,
    })
  } catch (error) {
    next(error)
  }
})

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  })
})

// @route   POST /api/auth/refresh
// @desc    Refresh token
// @access  Private
router.post('/refresh', authMiddleware, (req, res) => {
  const token = generateToken(req.user.id)
  res.json({
    success: true,
    token,
  })
})

export default router
