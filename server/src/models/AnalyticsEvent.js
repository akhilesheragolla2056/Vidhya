import mongoose from 'mongoose'

const analyticsEventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    event: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
)

analyticsEventSchema.index({ user: 1, createdAt: -1 })

export default mongoose.model('AnalyticsEvent', analyticsEventSchema)
