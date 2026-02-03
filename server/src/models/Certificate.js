import mongoose from 'mongoose'

const certificateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    certificateNumber: {
      type: String,
      unique: true,
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: Date,
    completionDate: {
      type: Date,
      required: true,
    },
    // Completion criteria met
    videosCompletionPercentage: {
      type: Number,
      required: true,
    },
    testScore: {
      type: Number,
      required: true,
    },
    testPassingScore: {
      type: Number,
      required: true,
    },
    totalLearningHours: {
      type: Number,
      required: true,
    },
    // Certificate metadata
    certificateTemplate: {
      type: String,
      enum: ['standard', 'gold', 'platinum'],
      default: 'standard',
    },
    downloadUrl: String,
    verificationCode: String, // For certificate verification
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

// Generate unique certificate number
certificateSchema.pre('save', async function (next) {
  if (!this.certificateNumber) {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    this.certificateNumber = `CERT-${timestamp}-${random}`
  }
  next()
})

// Index for quick queries
certificateSchema.index({ user: 1, course: 1 })
certificateSchema.index({ certificateNumber: 1 }, { unique: true })

export default mongoose.model('Certificate', certificateSchema)
