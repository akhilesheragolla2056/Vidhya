import mongoose from 'mongoose'

const labProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true, lowercase: true, trim: true },
    experimentId: { type: String, required: true, trim: true },
    status: { type: String, enum: ['in-progress', 'completed'], default: 'in-progress' },
    state: { type: mongoose.Schema.Types.Mixed, default: {} },
    completedSteps: { type: [String], default: [] },
    results: { type: mongoose.Schema.Types.Mixed, default: null },
    score: { type: Number, min: 0, max: 100, default: null },
    attempts: { type: Number, min: 0, default: 0 },
    lastSavedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
)

labProgressSchema.index({ user: 1, subject: 1, experimentId: 1 }, { unique: true })

export default mongoose.model('LabProgress', labProgressSchema)
