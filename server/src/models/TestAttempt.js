import mongoose from 'mongoose'

const testAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mockTest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MockTest',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    answers: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        selectedAnswer: mongoose.Schema.Types.Mixed,
        isCorrect: Boolean,
        pointsScored: Number,
      },
    ],
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    totalPoints: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
      default: 0,
    },
    isPassed: {
      type: Boolean,
      required: true,
    },
    attemptNumber: {
      type: Number,
      default: 1,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    timeSpent: {
      type: Number, // in seconds
      required: true,
    },
    status: {
      type: String,
      enum: ['submitted', 'in-progress', 'abandoned'],
      default: 'submitted',
    },
  },
  {
    timestamps: true,
  }
)

// Index for quick queries
testAttemptSchema.index({ user: 1, mockTest: 1 })
testAttemptSchema.index({ user: 1, course: 1 })
testAttemptSchema.index({ isPassed: 1 })

export default mongoose.model('TestAttempt', testAttemptSchema)
