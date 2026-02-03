import express from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import User from '../models/User.js'
import { ApiError } from '../middleware/errorHandler.js'
import { authMiddleware } from '../middleware/auth.js'
import { OAuth2Client } from 'google-auth-library'
import { TwitterApi } from 'twitter-api-v2'

const router = express.Router()

// Generate JWT token
const generateToken = userId => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' })
}

// Lazy initialization - these will be created when first route is accessed
let googleClient = null
let twitterClient = null
let clientsInitialized = false

const initializeClients = () => {
  if (clientsInitialized) return
  clientsInitialized = true

  const CLIENT_URL = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '')
  const GOOGLE_REDIRECT_URI =
    process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback'
  const TWITTER_REDIRECT_URI =
    process.env.TWITTER_CALLBACK_URL || 'http://localhost:5000/api/auth/twitter/callback'

  console.log('=== Google OAuth Initialization ===')
  console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET')
  console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET')
  console.log('GOOGLE_CALLBACK_URL:', GOOGLE_REDIRECT_URI)
  console.log('=====================================')

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    googleClient = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: GOOGLE_REDIRECT_URI,
    })
  }

  if (process.env.TWITTER_CLIENT_ID && process.env.TWITTER_CLIENT_SECRET) {
    twitterClient = new TwitterApi({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    })
  }
}

const CLIENT_URL = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '')
const GOOGLE_REDIRECT_URI =
  process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback'
const TWITTER_REDIRECT_URI =
  process.env.TWITTER_CALLBACK_URL || 'http://localhost:5000/api/auth/twitter/callback'

const twitterAuthStore = new Map()

const createStateParam = redirect => Buffer.from(JSON.stringify({ redirect })).toString('base64url')

const buildRedirectTarget = stateParam => {
  try {
    if (!stateParam) return `${CLIENT_URL}/auth/callback`
    const parsed = JSON.parse(Buffer.from(stateParam, 'base64url').toString())
    return parsed.redirect || `${CLIENT_URL}/auth/callback`
  } catch (err) {
    return `${CLIENT_URL}/auth/callback`
  }
}

const generateRandomPassword = () => crypto.randomBytes(32).toString('hex')

const upsertOAuthUser = async ({ email, name, avatar, provider, providerId }) => {
  const socialKey = `socialConnections.${provider}`
  let user = await User.findOne({
    $or: [{ email }, { [socialKey]: providerId }],
  })

  if (!user) {
    user = await User.create({
      name: name || email.split('@')[0],
      email,
      password: generateRandomPassword(),
      avatar,
      socialConnections: {
        [provider]: providerId,
      },
      isVerified: true,
    })
  } else {
    user.socialConnections[provider] = providerId
    if (!user.avatar && avatar) {
      user.avatar = avatar
    }
    user.isVerified = true
    await user.save()
  }

  return user
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

// @route   GET /api/auth/google
// @desc    Start Google OAuth flow
// @access  Public
router.get('/google', async (req, res, next) => {
  try {
    initializeClients()

    if (!googleClient) {
      throw new ApiError(503, 'Google login not configured')
    }

    const redirectTarget = req.query.redirect || `${CLIENT_URL}/auth/callback`
    const state = createStateParam(redirectTarget)

    const authUrl = googleClient.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ],
      state,
    })

    return res.redirect(authUrl)
  } catch (error) {
    next(error)
  }
})

// @route   GET /api/auth/google/callback
// @desc    Handle Google OAuth callback
// @access  Public
router.get('/google/callback', async (req, res, next) => {
  const target = buildRedirectTarget(req.query.state)

  try {
    initializeClients()

    if (!googleClient) {
      throw new ApiError(503, 'Google login not configured')
    }

    const { code } = req.query
    if (!code) {
      throw new ApiError(400, 'Missing authorization code')
    }

    const { tokens } = await googleClient.getToken({ code, redirect_uri: GOOGLE_REDIRECT_URI })
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    const user = await upsertOAuthUser({
      email: payload.email,
      name: payload.name,
      avatar: payload.picture,
      provider: 'google',
      providerId: payload.sub,
    })

    const token = generateToken(user._id)
    return res.redirect(`${target}?token=${token}`)
  } catch (error) {
    console.error('Google OAuth error:', error)
    const message = typeof error?.message === 'string' ? error.message : 'Google login failed'
    return res.redirect(`${target}?error=${encodeURIComponent(message)}`)
  }
})

// @route   GET /api/auth/twitter
// @desc    Start Twitter OAuth flow
// @access  Public
router.get('/twitter', async (req, res, next) => {
  try {
    initializeClients()

    if (!twitterClient) {
      throw new ApiError(503, 'Twitter login not configured')
    }

    const redirectTarget = req.query.redirect || `${CLIENT_URL}/auth/callback`
    const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(
      TWITTER_REDIRECT_URI,
      { scope: ['tweet.read', 'users.read'] }
    )

    twitterAuthStore.set(state, {
      codeVerifier,
      redirect: redirectTarget,
      createdAt: Date.now(),
    })

    return res.redirect(url)
  } catch (error) {
    next(error)
  }
})

// @route   GET /api/auth/twitter/callback
// @desc    Handle Twitter OAuth callback
// @access  Public
router.get('/twitter/callback', async (req, res, next) => {
  const state = req.query.state
  const entry = state ? twitterAuthStore.get(state) : null
  const target = entry?.redirect || `${CLIENT_URL}/auth/callback`

  try {
    initializeClients()

    if (!twitterClient) {
      throw new ApiError(503, 'Twitter login not configured')
    }

    if (!entry) {
      throw new ApiError(400, 'Invalid or expired login session')
    }

    twitterAuthStore.delete(state)

    const { code, error } = req.query
    if (error) {
      throw new ApiError(400, `Twitter login failed: ${error}`)
    }
    if (!code) {
      throw new ApiError(400, 'Missing authorization code')
    }

    const { client: loggedClient } = await twitterClient.loginWithOAuth2({
      code,
      codeVerifier: entry.codeVerifier,
      redirectUri: TWITTER_REDIRECT_URI,
    })

    const { data: profile } = await loggedClient.v2.me({
      'user.fields': ['name', 'username', 'profile_image_url'],
    })

    const pseudoEmail = `${profile.id}@twitter.local`

    const user = await upsertOAuthUser({
      email: pseudoEmail,
      name: profile.name || profile.username,
      avatar: profile.profile_image_url,
      provider: 'twitter',
      providerId: profile.id,
    })

    const token = generateToken(user._id)
    return res.redirect(`${target}?token=${token}`)
  } catch (error) {
    console.error('Twitter OAuth error:', error)
    const message = typeof error?.message === 'string' ? error.message : 'Twitter login failed'
    return res.redirect(`${target}?error=${encodeURIComponent(message)}`)
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
    const user = await User.findById(req.user.id).populate(
      'enrolledCourses.course',
      'title thumbnail category level'
    )

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
        ...(learningProfile && {
          learningProfile: { ...req.user.learningProfile, ...learningProfile },
        }),
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
