import mongoose from 'mongoose'

const gameSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    gameType: {
      type: String,
      enum: ['math_sprint', 'science_quest'],
      required: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'abandoned'],
      default: 'in_progress',
    },
    score: {
      type: Number,
      default: 0,
    },
    accuracy: {
      type: Number,
      default: 0,
    },
    questionsAttempted: {
      type: Number,
      default: 0,
    },
    correctAnswers: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 0,
    },
    comboMax: {
      type: Number,
      default: 0,
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
    rewards: {
      xp: { type: Number, default: 0 },
      badges: { type: [String], default: [] },
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: Date,
  },
  {
    timestamps: true,
  }
)

gameSessionSchema.index({ user: 1, gameType: 1, createdAt: -1 })
gameSessionSchema.index({ gameType: 1, score: -1 })

export default mongoose.model('GameSession', gameSessionSchema)
