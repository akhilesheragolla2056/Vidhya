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

const sanitizeCallbackEnv = value => {
  if (!value || typeof value !== 'string') return ''
  const trimmed = value.trim()
  // Handle accidental "KEY=value" paste in env dashboards.
  const normalized = trimmed.replace(/^GOOGLE_CALLBACK_URL=/i, '')
  return normalized
}

const isLocalhostCallback = value => /^https?:\/\/localhost(?::\d+)?\//i.test(value || '')
const isLocalRequestHost = host => /^localhost(?::\d+)?$/i.test(host || '')

const getBaseUrl = req => {
  const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http'
  const host = req.headers['x-forwarded-host'] || req.get('host')
  return `${proto}://${host}`
}

const getGoogleRedirectUri = req => {
  const configured = sanitizeCallbackEnv(process.env.GOOGLE_CALLBACK_URL)
  const requestHost = req.headers['x-forwarded-host'] || req.get('host') || ''
  const shouldIgnoreLocalConfigured = isLocalhostCallback(configured) && !isLocalRequestHost(requestHost)
  if (configured && !shouldIgnoreLocalConfigured) return configured
  return `${getBaseUrl(req)}/api/auth/google/callback`
}

const initializeClients = () => {
  if (clientsInitialized) return
  clientsInitialized = true

  const CLIENT_URL = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '')
  const GOOGLE_REDIRECT_URI = sanitizeCallbackEnv(process.env.GOOGLE_CALLBACK_URL)
  const TWITTER_REDIRECT_URI =
    process.env.TWITTER_CALLBACK_URL || 'http://localhost:5000/api/auth/twitter/callback'

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    googleClient = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: GOOGLE_REDIRECT_URI || undefined,
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
const TWITTER_REDIRECT_URI =
  process.env.TWITTER_CALLBACK_URL || 'http://localhost:5000/api/auth/twitter/callback'

const twitterAuthStore = new Map()
const OAUTH_STATE_TTL_MS = 10 * 60 * 1000

const getClientOrigin = () => {
  try {
    return new URL(CLIENT_URL).origin
  } catch {
    return 'http://localhost:5173'
  }
}

const resolveOAuthRedirect = redirect => {
  const fallback = `${getClientOrigin()}/auth/callback`
  try {
    const target = new URL(typeof redirect === 'string' ? redirect : fallback)
    const configuredOrigins = [getClientOrigin(), ...(process.env.OAUTH_REDIRECT_ORIGINS || '').split(',')]
      .map(origin => {
        try {
          return new URL(origin.trim()).origin
        } catch {
          return null
        }
      })
      .filter(Boolean)
    const isConfiguredOrigin = configuredOrigins.includes(target.origin)
    const isVercelOrigin = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(target.origin)
    const isLocalDevelopmentOrigin = process.env.NODE_ENV !== 'production' &&
      ['localhost', '127.0.0.1'].includes(target.hostname)
    if ((!isConfiguredOrigin && !isVercelOrigin && !isLocalDevelopmentOrigin) || target.pathname !== '/auth/callback') {
      return fallback
    }
    return `${target.origin}/auth/callback`
  } catch {
    return fallback
  }
}

const validOAuthRole = role => ['student', 'teacher', 'parent'].includes(role) ? role : 'student'

const createStateParam = (redirect, role) => {
  const payload = Buffer.from(JSON.stringify({
    redirect: resolveOAuthRedirect(redirect),
    role: validOAuthRole(role),
    expiresAt: Date.now() + OAUTH_STATE_TTL_MS,
    nonce: crypto.randomBytes(16).toString('hex'),
  })).toString('base64url')
  const secret = process.env.OAUTH_STATE_SECRET || process.env.JWT_SECRET || 'your-secret-key'
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64url')
  return `${payload}.${signature}`
}

const buildRedirectTarget = stateParam => {
  try {
    if (typeof stateParam !== 'string') return null
    const [payload, signature] = stateParam.split('.')
    if (!payload || !signature) return null
    const secret = process.env.OAUTH_STATE_SECRET || process.env.JWT_SECRET || 'your-secret-key'
    const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest()
    const receivedSignature = Buffer.from(signature, 'base64url')
    if (
      expectedSignature.length !== receivedSignature.length ||
      !crypto.timingSafeEqual(expectedSignature, receivedSignature)
    ) return null

    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString())
    if (!Number.isFinite(parsed.expiresAt) || parsed.expiresAt < Date.now()) return null
    const redirect = resolveOAuthRedirect(parsed.redirect)
    if (redirect !== parsed.redirect) return null
    return { redirect, role: validOAuthRole(parsed.role) }
  } catch {
    return null
  }
}

const generateRandomPassword = () => crypto.randomBytes(32).toString('hex')

const upsertOAuthUser = async ({ email, name, avatar, provider, providerId, defaultRole = 'student' }) => {
  const socialKey = `socialConnections.${provider}`
  let user = await User.findOne({
    $or: [{ email }, { [socialKey]: providerId }],
  })

  if (!user) {
    user = await User.create({
      name: name || email.split('@')[0],
      email,
      password: generateRandomPassword(),
      role: validOAuthRole(defaultRole),
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

    const googleRedirectUri = getGoogleRedirectUri(req)
    const redirectTarget = resolveOAuthRedirect(req.query.redirect)
    const state = createStateParam(redirectTarget, req.query.role)

    const authUrl = googleClient.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      redirect_uri: googleRedirectUri,
      scope: [
        'openid',
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
  const oauthState = buildRedirectTarget(req.query.state)
  const target = oauthState?.redirect
  if (!target) return res.redirect(`${getClientOrigin()}/auth/callback?error=invalid_oauth_session`)

  try {
    initializeClients()

    if (!googleClient) {
      throw new ApiError(503, 'Google login not configured')
    }

    const { code } = req.query
    if (!code) {
      throw new ApiError(400, 'Missing authorization code')
    }

    const googleRedirectUri = getGoogleRedirectUri(req)
    const { tokens } = await googleClient.getToken({ code, redirect_uri: googleRedirectUri })
    if (!tokens.id_token) {
      throw new ApiError(502, 'Google did not return an identity token')
    }
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    if (!payload?.sub || !payload.email || payload.email_verified === false) {
      throw new ApiError(401, 'Google account identity could not be verified')
    }
    const user = await upsertOAuthUser({
      email: payload.email,
      name: payload.name,
      avatar: payload.picture,
      provider: 'google',
      providerId: payload.sub,
      defaultRole: oauthState.role,
    })

    if (user.role !== oauthState.role && user.role !== 'admin') {
      return res.redirect(`${target}?error=role_mismatch&actualRole=${encodeURIComponent(user.role)}`)
    }

    const token = generateToken(user._id)
    return res.redirect(`${target}?token=${token}`)
  } catch (error) {
    return res.redirect(`${target}?error=google_login_failed`)
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

    const redirectTarget = resolveOAuthRedirect(req.query.redirect)
    for (const [storedState, entry] of twitterAuthStore) {
      if (Date.now() - entry.createdAt > OAUTH_STATE_TTL_MS) twitterAuthStore.delete(storedState)
    }
    const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(
      TWITTER_REDIRECT_URI,
      { scope: ['tweet.read', 'users.read'] }
    )

    twitterAuthStore.set(state, {
      codeVerifier,
      redirect: redirectTarget,
      role: validOAuthRole(req.query.role),
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
  const isStateValid = Boolean(entry && Date.now() - entry.createdAt <= OAUTH_STATE_TTL_MS)
  const target = isStateValid ? entry.redirect : `${getClientOrigin()}/auth/callback`

  try {
    initializeClients()

    if (!twitterClient) {
      throw new ApiError(503, 'Twitter login not configured')
    }

    if (!isStateValid) {
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
      defaultRole: entry.role,
    })

    if (user.role !== entry.role && user.role !== 'admin') {
      return res.redirect(`${target}?error=role_mismatch&actualRole=${encodeURIComponent(user.role)}`)
    }

    const token = generateToken(user._id)
    return res.redirect(`${target}?token=${token}`)
  } catch (error) {
    return res.redirect(`${target}?error=twitter_login_failed`)
  }
})

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res, next) => {
  try {
    const { email, password, role } = req.body

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

    const allowedRoles = ['student', 'teacher', 'parent']
    if (role && !allowedRoles.includes(role)) {
      throw new ApiError(400, 'Choose a valid account type')
    }
    if (role && user.role !== role && user.role !== 'admin') {
      throw new ApiError(403, `This account is registered as a ${user.role}. Choose ${user.role} sign in.`)
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
