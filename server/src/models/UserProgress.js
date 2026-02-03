import mongoose from 'mongoose'

const videoProgressSchema = new mongoose.Schema({
  lessonId: {
    type: String, // Can be used to reference lesson within course
    required: true,
  },
  videoDuration: Number, // total seconds
  watchedDuration: Number, // seconds watched
  completionPercentage: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },
  completedAt: Date,
})

const userProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    enrolledCourses: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
          required: true,
        },
        enrolledAt: {
          type: Date,
          default: Date.now,
        },
        // Video tracking per course
        videoProgress: [videoProgressSchema],
        videosWatched: {
          type: Number,
          default: 0,
        },
        videosCompleted: {
          type: Number,
          default: 0,
        },
        totalVideoDuration: {
          type: Number, // in seconds
          default: 0,
        },
        totalWatchedDuration: {
          type: Number, // in seconds
          default: 0,
        },
        // Test tracking per course
        mockTestsAttempted: {
          type: Number,
          default: 0,
        },
        mockTestsPassed: {
          type: Number,
          default: 0,
        },
        bestTestScore: {
          type: Number,
          default: 0,
        },
        lastTestAttempt: Date,
        // Overall progress
        courseCompletionPercentage: {
          type: Number,
          default: 0, // Based on videos watched + test passed
        },
        isCompleted: {
          type: Boolean,
          default: false,
        },
        completedAt: Date,
        lastActivityDate: Date,
      },
    ],
    // Overall statistics
    totalLearningHours: {
      type: Number,
      default: 0, // calculated from all videos watched
    },
    totalCoursesEnrolled: {
      type: Number,
      default: 0,
    },
    totalCoursesCompleted: {
      type: Number,
      default: 0,
    },
    certificatesEarned: {
      type: Number,
      default: 0,
    },
    averageCompletionRate: {
      type: Number,
      default: 0,
    },
    streakDays: {
      type: Number,
      default: 0,
    },
    lastActiveDate: Date,
  },
  {
    timestamps: true,
  }
)

// Index for quick queries
userProgressSchema.index({ user: 1 })
userProgressSchema.index({ 'enrolledCourses.course': 1 })

export default mongoose.model('UserProgress', userProgressSchema)
