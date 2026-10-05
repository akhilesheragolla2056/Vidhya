import mongoose from 'mongoose'
import { randomUUID } from 'node:crypto'

const participantSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String, default: null },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false }
)

const messageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    content: { type: String, required: true, maxlength: 2000 },
    type: { type: String, enum: ['text', 'code'], default: 'text' },
    sender: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      avatar: { type: String, default: null },
    },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
)

const classroomSchema = new mongoose.Schema(
  {
    _id: { type: String, default: randomUUID },
    code: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    courseId: { type: String, default: null },
    lessonId: { type: String, default: null },
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    participants: { type: [participantSchema], default: [] },
    settings: {
      allowChat: { type: Boolean, default: true },
      allowHandRaise: { type: Boolean, default: true },
      allowScreenShare: { type: Boolean, default: false },
      maxParticipants: { type: Number, default: 50, min: 2, max: 200 },
    },
    status: { type: String, enum: ['waiting', 'active', 'ended'], default: 'waiting' },
    startedAt: { type: Date, default: null },
    endedAt: { type: Date, default: null, expires: 86400 },
    whiteboard: { type: String, default: '' },
    messages: { type: [messageSchema], default: [] },
    polls: { type: [mongoose.Schema.Types.Mixed], default: [] },
    breakoutRooms: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

export default mongoose.model('Classroom', classroomSchema)
