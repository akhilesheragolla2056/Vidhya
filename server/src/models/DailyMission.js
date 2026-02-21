import mongoose from 'mongoose'

const missionItemSchema = new mongoose.Schema(
  {
    missionId: { type: String, required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    target: { type: Number, required: true },
    progress: { type: Number, default: 0 },
    rewardXP: { type: Number, default: 0 },
    rewardBadge: { type: String, default: '' },
    completed: { type: Boolean, default: false },
    completedAt: Date,
  },
  { _id: false }
)

const dailyMissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    dateKey: {
      type: String,
      required: true,
      index: true,
    },
    missions: {
      type: [missionItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

dailyMissionSchema.index({ user: 1, dateKey: 1 }, { unique: true })

export default mongoose.model('DailyMission', dailyMissionSchema)
