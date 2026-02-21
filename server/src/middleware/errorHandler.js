export const errorHandler = (err, req, res, next) => {
  const statusCode = typeof err.statusCode === 'number' ? err.statusCode : 500
  if (statusCode >= 500) {
    console.error('Error:', err)
  } else {
    console.warn(`${req.method} ${req.originalUrl} -> ${statusCode}: ${err.message}`)
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message)
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: messages,
    })
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
    })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
    })
  }

  // Custom API error
  if (err.statusCode) {
    return res.status(statusCode).json({
      success: false,
      message: err.message,
    })
  }

  // Default server error
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
  })
}

// Custom error class
export class ApiError extends Error {
  constructor(statusCode, message) {
    const normalizedStatusCode =
      typeof statusCode === 'number'
        ? statusCode
        : typeof message === 'number'
          ? message
          : 500
    const normalizedMessage =
      typeof statusCode === 'string'
        ? statusCode
        : typeof message === 'string'
          ? message
          : 'Internal server error'

    super(normalizedMessage)
    this.statusCode = normalizedStatusCode
    this.status = `${normalizedStatusCode}`.startsWith('4') ? 'fail' : 'error'
    Error.captureStackTrace(this, this.constructor)
  }
}
