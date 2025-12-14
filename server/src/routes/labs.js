import express from 'express'
import { optionalAuth } from '../middleware/auth.js'

const router = express.Router()

// Virtual lab experiments data
const experiments = {
  chemistry: [
    {
      id: 'acid-base',
      name: 'Acid-Base Titration',
      description: 'Learn about acid-base reactions by performing a virtual titration.',
      difficulty: 'Beginner',
      duration: '20 min',
      icon: '🧪',
      objectives: [
        'Understand acid-base neutralization',
        'Learn to use a burette and indicator',
        'Calculate molarity from titration data',
      ],
      equipment: ['Burette', 'Beaker', 'pH indicator', 'Acid solution', 'Base solution'],
      safetyNotes: ['Virtual experiment - no real chemicals involved'],
    },
    {
      id: 'electrolysis',
      name: 'Water Electrolysis',
      description: 'Split water into hydrogen and oxygen using electricity.',
      difficulty: 'Intermediate',
      duration: '25 min',
      icon: '⚡',
      objectives: [
        'Understand electrolysis process',
        'Learn about cathode and anode reactions',
        'Collect and test gases produced',
      ],
      equipment: ['Electrolysis cell', 'DC power source', 'Electrodes', 'Test tubes'],
      safetyNotes: ['Virtual experiment - safe to perform'],
    },
    {
      id: 'combustion',
      name: 'Combustion Reactions',
      description: 'Explore different types of combustion reactions.',
      difficulty: 'Advanced',
      duration: '30 min',
      icon: '🔥',
      objectives: [
        'Differentiate complete and incomplete combustion',
        'Balance combustion equations',
        'Analyze combustion products',
      ],
      equipment: ['Bunsen burner', 'Test tubes', 'Various fuels', 'Lime water'],
      safetyNotes: ['Virtual fire - completely safe'],
    },
    {
      id: 'crystal',
      name: 'Crystal Growing',
      description: 'Grow beautiful crystals from supersaturated solutions.',
      difficulty: 'Beginner',
      duration: '15 min',
      icon: '💎',
      objectives: [
        'Understand supersaturation',
        'Learn about crystal structure',
        'Observe crystal growth patterns',
      ],
      equipment: ['Beaker', 'Salt/Sugar', 'String', 'Hot plate'],
      safetyNotes: ['Use virtual hot plate safely'],
    },
  ],
  physics: [
    {
      id: 'pendulum',
      name: 'Simple Pendulum',
      description: 'Study simple harmonic motion with a pendulum.',
      difficulty: 'Beginner',
      duration: '15 min',
      icon: '🎯',
      objectives: [
        'Understand period and frequency',
        'Explore factors affecting pendulum motion',
        'Verify pendulum equation',
      ],
      equipment: ['Pendulum bob', 'String', 'Stopwatch', 'Ruler'],
    },
    {
      id: 'optics',
      name: 'Light Refraction',
      description: 'Explore how light bends through different media.',
      difficulty: 'Intermediate',
      duration: '20 min',
      icon: '🔦',
      objectives: [
        'Understand Snell\'s law',
        'Calculate refractive index',
        'Observe total internal reflection',
      ],
      equipment: ['Light source', 'Prism', 'Protractor', 'Various media'],
    },
  ],
  biology: [
    {
      id: 'cell-division',
      name: 'Cell Division (Mitosis)',
      description: 'Observe and identify stages of mitosis.',
      difficulty: 'Intermediate',
      duration: '25 min',
      icon: '🔬',
      objectives: [
        'Identify phases of mitosis',
        'Understand chromosome behavior',
        'Compare animal and plant cell division',
      ],
      equipment: ['Virtual microscope', 'Prepared slides', 'Stains'],
    },
    {
      id: 'photosynthesis',
      name: 'Photosynthesis',
      description: 'Investigate factors affecting photosynthesis rate.',
      difficulty: 'Beginner',
      duration: '20 min',
      icon: '🌱',
      objectives: [
        'Understand light reactions',
        'Test for starch production',
        'Explore limiting factors',
      ],
      equipment: ['Aquatic plant', 'Light source', 'CO2 source', 'Timer'],
    },
  ],
}

// @route   GET /api/labs
// @desc    Get all available lab experiments
// @access  Public
router.get('/', optionalAuth, (req, res) => {
  const { subject, difficulty } = req.query
  
  let result = experiments

  if (subject && experiments[subject]) {
    result = { [subject]: experiments[subject] }
  }

  if (difficulty) {
    const filtered = {}
    Object.entries(result).forEach(([subj, exps]) => {
      filtered[subj] = exps.filter(e => e.difficulty.toLowerCase() === difficulty.toLowerCase())
    })
    result = filtered
  }

  res.json({
    success: true,
    data: result,
  })
})

// @route   GET /api/labs/:subject
// @desc    Get experiments for a subject
// @access  Public
router.get('/:subject', optionalAuth, (req, res) => {
  const subject = req.params.subject.toLowerCase()
  
  if (!experiments[subject]) {
    return res.status(404).json({
      success: false,
      message: 'Subject not found',
    })
  }

  res.json({
    success: true,
    data: experiments[subject],
  })
})

// @route   GET /api/labs/:subject/:id
// @desc    Get specific experiment details
// @access  Public
router.get('/:subject/:id', optionalAuth, (req, res) => {
  const { subject, id } = req.params
  
  if (!experiments[subject]) {
    return res.status(404).json({
      success: false,
      message: 'Subject not found',
    })
  }

  const experiment = experiments[subject].find(e => e.id === id)
  
  if (!experiment) {
    return res.status(404).json({
      success: false,
      message: 'Experiment not found',
    })
  }

  res.json({
    success: true,
    data: experiment,
  })
})

// @route   POST /api/labs/:subject/:id/progress
// @desc    Save experiment progress
// @access  Private
router.post('/:subject/:id/progress', async (req, res) => {
  const { subject, id } = req.params
  const { state, completedSteps } = req.body

  // In production, save to database
  // For now, just acknowledge
  res.json({
    success: true,
    message: 'Progress saved',
    data: {
      experimentId: id,
      subject,
      completedSteps,
      savedAt: new Date(),
    },
  })
})

// @route   POST /api/labs/:subject/:id/submit
// @desc    Submit experiment results
// @access  Private
router.post('/:subject/:id/submit', async (req, res) => {
  const { subject, id } = req.params
  const { results, observations, answers } = req.body

  // Calculate score based on answers
  let score = 0
  let feedback = []

  // Mock scoring logic
  if (results) {
    score = Math.floor(Math.random() * 30) + 70 // 70-100
    feedback = [
      'Great observations recorded!',
      'Consider exploring the relationship between variables more.',
      'Your conclusions are well-supported by the data.',
    ]
  }

  res.json({
    success: true,
    data: {
      experimentId: id,
      subject,
      score,
      feedback,
      xpEarned: Math.floor(score / 10) * 5,
      completedAt: new Date(),
    },
  })
})

export default router
