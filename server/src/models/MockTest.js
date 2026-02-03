import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question text is required'],
  },
  type: {
    type: String,
    enum: ['single', 'multiple', 'text'],
    default: 'single',
  },
  options: [String], // For MCQ
  correctAnswer: mongoose.Schema.Types.Mixed, // String for single/text, Array for multiple
  explanation: String,
  points: { type: Number, default: 1 },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
})

const mockTestSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Test title is required'],
    },
    description: String,
    instructions: String,
    questions: [questionSchema],
    duration: {
      type: Number,
      required: true, // in minutes
    },
    totalPoints: {
      type: Number,
      required: true,
    },
    passingScore: {
      type: Number,
      required: true, // percentage
      default: 70,
    },
    retakesAllowed: {
      type: Number,
      default: 3,
    },
    showAnswersAfterSubmit: {
      type: Boolean,
      default: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

// Index for quick queries
mockTestSchema.index({ course: 1 })

export default mongoose.model('MockTest', mockTestSchema)
