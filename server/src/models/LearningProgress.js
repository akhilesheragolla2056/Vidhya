import mongoose from 'mongoose'

const learningProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseId: { type: String, required: true, trim: true, maxlength: 160 },
    courseTitle: { type: String, default: '', trim: true, maxlength: 200 },
    category: { type: String, default: '', trim: true, maxlength: 100 },
    totalLessons: { type: Number, default: 0, min: 0, max: 500 },
    completedLessons: { type: [String], default: [] },
    videoProgress: { type: mongoose.Schema.Types.Mixed, default: {} },
    completedMCQs: { type: [String], default: [] },
    mcqScores: { type: mongoose.Schema.Types.Mixed, default: {} },
    notesRead: { type: [String], default: [] },
    status: { type: String, enum: ['not-started', 'in-progress', 'completed'], default: 'not-started' },
    lastAccessed: Date,
    startedAt: Date,
    completedAt: Date,
    overallProgress: { type: Number, default: 0, min: 0, max: 100 },
    activeSeconds: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
)

learningProgressSchema.index({ user: 1, courseId: 1 }, { unique: true })

export default mongoose.model('LearningProgress', learningProgressSchema)
