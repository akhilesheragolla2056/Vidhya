import mongoose from 'mongoose'

const experimentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Experiment title is required'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: String,
    thumbnail: String,
    category: {
      type: String,
      enum: ['Physics', 'Chemistry', 'Biology'],
      required: true,
    },
    gradeLevel: {
      type: [String],
      enum: ['6', '7', '8', '9', '10', '11', '12'],
    },
    // Experiment Structure
    objective: {
      type: String,
      required: true,
    },
    theory: {
      type: String,
      required: true,
    },
    apparatus: [
      {
        name: String,
        quantity: String,
      },
    ],
    procedure: [
      {
        step: Number,
        description: String,
        image: String, // URL to step image
      },
    ],
    observations: {
      type: String,
    },
    expectedResult: {
      type: String,
    },
    precautions: [String],
    // Interactive simulation
    simulation: {
      type: {
        type: String,
        enum: ['canvas', 'svg', 'webgl', 'threejs', 'interactive'],
      },
      config: mongoose.Schema.Types.Mixed, // Custom config for different simulation types
      instructions: String,
    },
    // Files and resources
    pdfUrl: String,
    videoUrl: String,
    resources: [
      {
        title: String,
        url: String,
        type: String,
      },
    ],
    // Metadata
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    estimatedTime: Number, // in minutes
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

// Create slug
experimentSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
  next()
})

// Index
experimentSchema.index({ category: 1, gradeLevel: 1 })
experimentSchema.index({ title: 'text', description: 'text' })

export default mongoose.model('Experiment', experimentSchema)
