import express from 'express'
import { authMiddleware, optionalAuth } from '../middleware/auth.js'
import LabProgress from '../models/LabProgress.js'
import { ApiError } from '../middleware/errorHandler.js'

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

const findExperiment = (subject, id) =>
  experiments[subject.toLowerCase()]?.find(experiment => experiment.id === id)

const cleanState = value => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key, entry]) => /^[\w-]{1,40}$/.test(key) && (
        typeof entry === 'boolean' ||
        (typeof entry === 'number' && Number.isFinite(entry)) ||
        (typeof entry === 'string' && entry.length <= 500)
      ))
      .slice(0, 50)
  )
}

const boundedNumber = (inputs, key, min, max, fallback) => {
  const value = inputs[key] ?? fallback
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) {
    throw new ApiError(400, `${key} must be between ${min} and ${max}`)
  }
  return value
}

const calculateResult = (subject, id, rawInputs) => {
  const inputs = cleanState(rawInputs)
  if (!findExperiment(subject, id)) throw new ApiError(404, 'Experiment not found')

  if (subject === 'chemistry' && id === 'acid-base') {
    const baseMl = boundedNumber(inputs, 'baseMl', 0, 50, 0)
    const acidMmol = 2.5 - baseMl * 0.1
    const totalMl = 25 + baseMl
    const ph = acidMmol > 0
      ? -Math.log10((acidMmol / totalMl) * 1000)
      : acidMmol < 0
        ? 14 + Math.log10((-acidMmol / totalMl) * 1000)
        : 7
    return { inputs: { baseMl }, outputs: { pH: Number(Math.max(0, Math.min(14, ph)).toFixed(2)), neutralizationPointMl: 25 }, observation: `Adding ${baseMl} mL of base gives an estimated pH of ${Math.max(0, Math.min(14, ph)).toFixed(2)}. Equal 0.1 M solutions reach the neutralization point at 25 mL.`, score: 100 }
  }

  if (subject === 'chemistry' && id === 'electrolysis') {
    const voltage = boundedNumber(inputs, 'voltage', 0, 12, 6)
    const resistance = boundedNumber(inputs, 'resistance', 1, 100, 10)
    const current = voltage / resistance
    return { inputs: { voltage, resistance }, outputs: { currentAmps: Number(current.toFixed(3)), relativeGasRate: Number((current * 100).toFixed(1)) }, observation: `The circuit carries ${current.toFixed(2)} A. Raising voltage or lowering resistance increases the modeled gas-production rate.`, score: 100 }
  }

  if (subject === 'chemistry' && id === 'combustion') {
    const oxygenPercent = boundedNumber(inputs, 'oxygenPercent', 0, 100, 50)
    const complete = oxygenPercent >= 40
    return { inputs: { oxygenPercent }, outputs: { combustion: complete ? 'complete' : 'incomplete', carbonMonoxideRisk: complete ? 'low' : 'high' }, observation: `${oxygenPercent}% oxygen supports ${complete ? 'more complete combustion, producing mainly carbon dioxide and water' : 'incomplete combustion, with a greater carbon monoxide and soot risk'}.`, score: 100 }
  }

  if (subject === 'chemistry' && id === 'crystal') {
    const temperatureC = boundedNumber(inputs, 'temperatureC', 10, 90, 60)
    const concentration = boundedNumber(inputs, 'concentration', 1, 100, 70)
    const supersaturated = concentration > 100 - temperatureC * 0.55
    return { inputs: { temperatureC, concentration }, outputs: { supersaturated }, observation: supersaturated ? 'This solution is supersaturated at the selected temperature, so crystals can form as it cools.' : 'The solution is not yet supersaturated; increase concentration or lower the temperature to encourage crystal growth.', score: 100 }
  }

  if (subject === 'physics' && id === 'pendulum') {
    const lengthM = boundedNumber(inputs, 'lengthM', 0.2, 2, 1)
    const periodSeconds = 2 * Math.PI * Math.sqrt(lengthM / 9.81)
    return { inputs: { lengthM }, outputs: { periodSeconds: Number(periodSeconds.toFixed(3)), frequencyHz: Number((1 / periodSeconds).toFixed(3)) }, observation: `A ${lengthM.toFixed(2)} m pendulum has a modeled period of ${periodSeconds.toFixed(2)} seconds. A longer pendulum swings more slowly.`, score: 100 }
  }

  if (subject === 'physics' && id === 'optics') {
    const incidenceDeg = boundedNumber(inputs, 'incidenceDeg', 0, 80, 30)
    const refractiveIndex = boundedNumber(inputs, 'refractiveIndex', 1.1, 2.4, 1.5)
    const ratio = Math.sin((incidenceDeg * Math.PI) / 180) / refractiveIndex
    const refractionDeg = Math.asin(Math.min(1, ratio)) * (180 / Math.PI)
    return { inputs: { incidenceDeg, refractiveIndex }, outputs: { refractionDeg: Number(refractionDeg.toFixed(2)) }, observation: `Light enters the selected medium at ${incidenceDeg}°. Snell's law predicts a refracted angle of ${refractionDeg.toFixed(2)}°.`, score: 100 }
  }

  if (subject === 'biology' && id === 'photosynthesis') {
    const lightPercent = boundedNumber(inputs, 'lightPercent', 0, 100, 50)
    const ratePercent = (lightPercent / (lightPercent + 25)) * 100
    return { inputs: { lightPercent }, outputs: { relativeRatePercent: Number(ratePercent.toFixed(1)) }, observation: `At ${lightPercent}% light intensity, the modelled photosynthesis rate is ${ratePercent.toFixed(1)}% of its maximum; the increase slows near saturation.`, score: 100 }
  }

  if (subject === 'biology' && id === 'cell-division') {
    const stages = ['prophase', 'metaphase', 'anaphase', 'telophase']
    const stage = inputs.stage ?? 'prophase'
    if (!stages.includes(stage)) throw new ApiError(400, 'Choose a valid mitosis stage')
    return { inputs: { stage }, outputs: { stage }, observation: `${stage[0].toUpperCase()}${stage.slice(1)} selected. Step through the stages to follow chromosome movement during mitosis.`, score: 100 }
  }

  throw new ApiError(400, 'This experiment does not have a runnable simulation yet')
}

router.get('/:subject/:id/progress', authMiddleware, async (req, res, next) => {
  try {
    const subject = req.params.subject.toLowerCase()
    if (!findExperiment(subject, req.params.id)) throw new ApiError(404, 'Experiment not found')
    const progress = await LabProgress.findOne({ user: req.user._id, subject, experimentId: req.params.id }).lean()
    res.json({ success: true, data: progress })
  } catch (error) {
    next(error)
  }
})

router.post('/:subject/:id/progress', authMiddleware, async (req, res, next) => {
  try {
    const subject = req.params.subject.toLowerCase()
    if (!findExperiment(subject, req.params.id)) throw new ApiError(404, 'Experiment not found')
    const state = cleanState(req.body?.state)
    const completedSteps = Array.isArray(req.body?.completedSteps)
      ? [...new Set(req.body.completedSteps.filter(step => typeof step === 'string').map(step => step.slice(0, 80)))].slice(0, 50)
      : []
    const progress = await LabProgress.findOneAndUpdate(
      { user: req.user._id, subject, experimentId: req.params.id },
      {
        $set: {
          state,
          completedSteps,
          status: 'in-progress',
          results: null,
          score: null,
          completedAt: null,
          lastSavedAt: new Date(),
        },
      },
      { new: true, upsert: true, runValidators: true }
    )
    res.json({ success: true, message: 'Progress saved', data: progress })
  } catch (error) {
    next(error)
  }
})

router.post('/:subject/:id/submit', authMiddleware, async (req, res, next) => {
  try {
    const subject = req.params.subject.toLowerCase()
    const result = calculateResult(subject, req.params.id, req.body?.inputs)
    const completedAt = new Date()
    const progress = await LabProgress.findOneAndUpdate(
      { user: req.user._id, subject, experimentId: req.params.id },
      {
        $set: {
          status: 'completed',
          state: result.inputs,
          results: result,
          score: result.score,
          lastSavedAt: completedAt,
          completedAt,
        },
        $inc: { attempts: 1 },
      },
      { new: true, upsert: true, runValidators: true }
    )
    res.json({ success: true, data: { ...result, experimentId: req.params.id, subject, attempts: progress.attempts, completedAt } })
  } catch (error) {
    next(error)
  }
})

export default router
