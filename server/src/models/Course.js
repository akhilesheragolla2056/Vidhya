import mongoose from 'mongoose'

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: {
    type: String,
    enum: ['video', 'text', 'interactive', 'quiz', 'lab'],
    default: 'video',
  },
  content: {
    videoUrl: String,
    text: String,
    embedCode: String,
  },
  duration: Number, // in minutes
  order: Number,
  isPreview: { type: Boolean, default: false },
  resources: [{
    title: String,
    type: String,
    url: String,
  }],
  quiz: {
    questions: [{
      question: String,
      type: { type: String, enum: ['multiple', 'single', 'text'] },
      options: [String],
      correctAnswer: mongoose.Schema.Types.Mixed,
      explanation: String,
      points: { type: Number, default: 10 },
    }],
    passingScore: { type: Number, default: 70 },
  },
})

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  order: Number,
  lessons: [lessonSchema],
})

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
  },
  longDescription: String,
  thumbnail: String,
  icon: String,
  category: {
    type: String,
    required: true,
    enum: ['Programming', 'Web Dev', 'Data Science', 'AI/ML', 'Science', 'Math', 'Languages', 'Arts', 'Business'],
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  language: { type: String, default: 'en' },
  duration: String, // e.g., "8 hours"
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  modules: [moduleSchema],
  requirements: [String],
  whatYouWillLearn: [String],
  tags: [String],
  pricing: {
    isFree: { type: Boolean, default: true },
    price: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
  },
  stats: {
    enrollments: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
  },
  isPublished: { type: Boolean, default: false },
  publishedAt: Date,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})

// Virtual for total lessons count
courseSchema.virtual('lessonsCount').get(function() {
  return this.modules.reduce((total, module) => total + module.lessons.length, 0)
})

// Create slug from title
courseSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
  next()
})

// Indexes
courseSchema.index({ title: 'text', description: 'text', tags: 'text' })
courseSchema.index({ category: 1, level: 1 })
courseSchema.index({ 'pricing.isFree': 1 })

export default mongoose.model('Course', courseSchema)
