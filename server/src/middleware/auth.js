import jwt from 'jsonwebtoken'
import { ApiError } from './errorHandler.js'
import User from '../models/User.js'

export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Access denied. No token provided.')
    }

    const token = authHeader.split(' ')[1]

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')

    // Get user from database
    const user = await User.findById(decoded.id).select('-password')
    
    if (!user) {
      throw new ApiError(401, 'User not found')
    }

    // Attach user to request
    req.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new ApiError(401, 'Invalid token'))
    } else if (error.name === 'TokenExpiredError') {
      next(new ApiError(401, 'Token expired'))
    } else {
      next(error)
    }
  }
}

// Optional auth - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
      const user = await User.findById(decoded.id).select('-password')
      req.user = user
    }
    
    next()
  } catch (error) {
    // Continue without user
    next()
  }
}

// Role-based access control
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'))
    }
    
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Access denied. Insufficient permissions.'))
    }
    
    next()
  }
}
