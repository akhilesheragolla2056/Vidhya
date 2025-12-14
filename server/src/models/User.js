import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false,
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'parent', 'admin'],
    default: 'student',
  },
  avatar: String,
  learningProfile: {
    preferredLanguage: { type: String, default: 'en' },
    learningStyle: { 
      type: String, 
      enum: ['visual', 'auditory', 'kinesthetic', 'reading'],
      default: 'visual',
    },
    pacePreference: {
      type: String,
      enum: ['slow', 'moderate', 'fast'],
      default: 'moderate',
    },
    accessibilityNeeds: [String],
    interests: [String],
  },
  progress: {
    totalXP: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streakDays: { type: Number, default: 0 },
    lastActiveDate: Date,
    badges: [String],
  },
  enrolledCourses: [{
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    enrolledAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 },
    completedLessons: [String],
  }],
  socialConnections: {
    google: String,
    github: String,
  },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Update streak
userSchema.methods.updateStreak = function() {
  const today = new Date().setHours(0, 0, 0, 0)
  const lastActive = this.progress.lastActiveDate 
    ? new Date(this.progress.lastActiveDate).setHours(0, 0, 0, 0)
    : null
  
  if (!lastActive) {
    this.progress.streakDays = 1
  } else if (today - lastActive === 86400000) { // 24 hours
    this.progress.streakDays += 1
  } else if (today - lastActive > 86400000) {
    this.progress.streakDays = 1
  }
  
  this.progress.lastActiveDate = new Date()
}

// Add XP and level up
userSchema.methods.addXP = function(amount) {
  this.progress.totalXP += amount
  const newLevel = Math.floor(this.progress.totalXP / 100) + 1
  if (newLevel > this.progress.level) {
    this.progress.level = newLevel
    return true // Level up occurred
  }
  return false
}

export default mongoose.model('User', userSchema)
