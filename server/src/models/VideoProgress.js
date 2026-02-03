import mongoose from 'mongoose'

const videoProgressSchema = new mongoose.Schema(
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
    lessonId: {
      type: String, // Module ID + Lesson ID combined
      required: true,
    },
    videoUrl: String,
    videoDuration: Number, // in seconds
    watchedDuration: Number, // in seconds
    completionPercentage: {
      type: Number,
      default: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: Date,
  },
  {
    timestamps: true,
  }
)

// Index for quick queries
videoProgressSchema.index({ user: 1, course: 1 })
videoProgressSchema.index({ user: 1, lessonId: 1 })

export default mongoose.model('VideoProgress', videoProgressSchema)
