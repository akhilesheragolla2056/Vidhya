import express from 'express'
import mongoose from 'mongoose'
import GameSession from '../models/GameSession.js'
import DailyMission from '../models/DailyMission.js'
import User from '../models/User.js'
import { ApiError } from '../middleware/errorHandler.js'

const router = express.Router()

const BADGES = {
  mathMaster: 'Math Master',
  scienceExplorer: 'Science Explorer',
  comboKing: 'Combo King',
  perfectRun: 'Perfect Run',
  dailyGrinder: 'Daily Grinder',
}

const toDateKey = (date = new Date()) => date.toISOString().slice(0, 10)

const buildDailyMissions = dateKey => [
  {
    missionId: `${dateKey}-math`,
    type: 'math_sprint_score',
    title: 'Score 300+ in Math Sprint',
    target: 300,
    progress: 0,
    rewardXP: 80,
    rewardBadge: BADGES.mathMaster,
    completed: false,
  },
  {
    missionId: `${dateKey}-science`,
    type: 'science_quest_correct',
    title: 'Get 8 correct in Science Quest',
    target: 8,
    progress: 0,
    rewardXP: 80,
    rewardBadge: BADGES.scienceExplorer,
    completed: false,
  },
  {
    missionId: `${dateKey}-sessions`,
    type: 'sessions_completed',
    title: 'Complete 2 game sessions',
    target: 2,
    progress: 0,
    rewardXP: 60,
    rewardBadge: BADGES.dailyGrinder,
    completed: false,
  },
]

const grantRewards = async ({ userId, xp = 0, badges = [] }) => {
  const user = await User.findById(userId)
  if (!user) return null

  if (xp > 0) {
    user.addXP(xp)
  }

  const uniqueBadges = new Set(user.progress.badges || [])
  badges.forEach(badge => {
    if (badge) uniqueBadges.add(badge)
  })
  user.progress.badges = Array.from(uniqueBadges)
  user.updateStreak()
  await user.save()
  return user
}

const applyMissionProgress = async ({ userId, gameType, score, correctAnswers }) => {
  const dateKey = toDateKey()
  const missionDoc = await DailyMission.findOne({ user: userId, dateKey })
  if (!missionDoc) return { completedMissions: [] }

  const completedMissions = []
  const missionAdjustments = {
    math_sprint_score: gameType === 'math_sprint' ? score : null,
    science_quest_correct: gameType === 'science_quest' ? correctAnswers : null,
    sessions_completed: 1,
  }

  missionDoc.missions = missionDoc.missions.map(mission => {
    if (mission.completed) return mission

    const value = missionAdjustments[mission.type]
    if (value === null || value === undefined) return mission

    const nextProgress =
      mission.type === 'sessions_completed'
        ? Math.min(mission.target, mission.progress + value)
        : Math.max(mission.progress, Math.min(mission.target, value))

    const completed = nextProgress >= mission.target
    if (completed) {
      completedMissions.push(mission)
    }

    return {
      ...mission.toObject(),
      progress: nextProgress,
      completed,
      completedAt: completed ? new Date() : mission.completedAt,
    }
  })

  await missionDoc.save()
  return { completedMissions }
}

// @route   GET /api/games/daily-missions
// @desc    Get or initialize daily missions for current user
// @access  Private
router.get('/daily-missions', async (req, res, next) => {
  try {
    const userId = req.user._id
    const dateKey = toDateKey()

    let missions = await DailyMission.findOne({ user: userId, dateKey })
    if (!missions) {
      missions = await DailyMission.create({
        user: userId,
        dateKey,
        missions: buildDailyMissions(dateKey),
      })
    }

    res.json({
      success: true,
      data: missions,
    })
  } catch (error) {
    next(error)
  }
})

// @route   POST /api/games/daily-missions/:missionId/progress
// @desc    Update a mission progress manually
// @access  Private
router.post('/daily-missions/:missionId/progress', async (req, res, next) => {
  try {
    const { missionId } = req.params
    const amount = Math.max(1, Number(req.body.amount || 1))
    const dateKey = toDateKey()
    const userId = req.user._id

    const missionsDoc = await DailyMission.findOne({ user: userId, dateKey })
    if (!missionsDoc) {
      throw new ApiError(404, 'Daily missions not found')
    }

    const mission = missionsDoc.missions.find(item => item.missionId === missionId)
    if (!mission) {
      throw new ApiError(404, 'Mission not found')
    }
    if (mission.completed) {
      return res.json({ success: true, data: missionsDoc, message: 'Mission already completed' })
    }

    mission.progress = Math.min(mission.target, mission.progress + amount)
    if (mission.progress >= mission.target) {
      mission.completed = true
      mission.completedAt = new Date()
      await grantRewards({
        userId,
        xp: mission.rewardXP,
        badges: [mission.rewardBadge],
      })
    }

    await missionsDoc.save()
    res.json({ success: true, data: missionsDoc })
  } catch (error) {
    next(error)
  }
})

// @route   POST /api/games/sessions/start
// @desc    Start a new game session
// @access  Private
router.post('/sessions/start', async (req, res, next) => {
  try {
    const { gameType, difficulty = 'medium' } = req.body
    if (!['math_sprint', 'science_quest'].includes(gameType)) {
      throw new ApiError(400, 'Invalid game type')
    }

    const session = await GameSession.create({
      user: req.user._id,
      gameType,
      difficulty,
      status: 'in_progress',
      startedAt: new Date(),
    })

    res.status(201).json({
      success: true,
      data: session,
    })
  } catch (error) {
    next(error)
  }
})

// @route   POST /api/games/sessions/:sessionId/submit
// @desc    Submit game session result
// @access  Private
router.post('/sessions/:sessionId/submit', async (req, res, next) => {
  try {
    const { sessionId } = req.params
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      throw new ApiError(400, 'Invalid session id')
    }

    const session = await GameSession.findOne({ _id: sessionId, user: req.user._id })
    if (!session) {
      throw new ApiError(404, 'Session not found')
    }

    if (session.status === 'completed') {
      return res.json({ success: true, data: session, message: 'Session already submitted' })
    }

    const score = Math.max(0, Number(req.body.score || 0))
    const questionsAttempted = Math.max(0, Number(req.body.questionsAttempted || 0))
    const correctAnswers = Math.max(0, Number(req.body.correctAnswers || 0))
    const streak = Math.max(0, Number(req.body.streak || 0))
    const comboMax = Math.max(0, Number(req.body.comboMax || 0))
    const timeSpent = Math.max(0, Number(req.body.timeSpent || 0))

    const accuracy = questionsAttempted
      ? Math.round((correctAnswers / questionsAttempted) * 100)
      : 0

    const xp = Math.min(350, Math.round(score * 0.6 + accuracy * 0.8 + streak * 2 + comboMax * 3))

    const earnedBadges = []
    if (comboMax >= 8) earnedBadges.push(BADGES.comboKing)
    if (questionsAttempted >= 8 && accuracy >= 95) earnedBadges.push(BADGES.perfectRun)
    if (session.gameType === 'math_sprint' && score >= 500) earnedBadges.push(BADGES.mathMaster)
    if (session.gameType === 'science_quest' && correctAnswers >= 10) {
      earnedBadges.push(BADGES.scienceExplorer)
    }

    session.status = 'completed'
    session.endedAt = new Date()
    session.score = score
    session.questionsAttempted = questionsAttempted
    session.correctAnswers = correctAnswers
    session.accuracy = accuracy
    session.streak = streak
    session.comboMax = comboMax
    session.timeSpent = timeSpent
    session.metadata = req.body.metadata || {}
    session.rewards = {
      xp,
      badges: earnedBadges,
    }

    await session.save()

    const missionUpdate = await applyMissionProgress({
      userId: req.user._id,
      gameType: session.gameType,
      score,
      correctAnswers,
    })

    const missionBadges = missionUpdate.completedMissions.map(m => m.rewardBadge).filter(Boolean)
    const missionXP = missionUpdate.completedMissions.reduce((sum, m) => sum + (m.rewardXP || 0), 0)

    const user = await grantRewards({
      userId: req.user._id,
      xp: xp + missionXP,
      badges: [...earnedBadges, ...missionBadges],
    })

    res.json({
      success: true,
      data: {
        session,
        rewards: {
          xpEarned: xp,
          bonusXP: missionXP,
          badges: [...earnedBadges, ...missionBadges],
        },
        userProgress: user?.progress || null,
      },
    })
  } catch (error) {
    next(error)
  }
})

// @route   GET /api/games/stats
// @desc    Get current user's game stats
// @access  Private
router.get('/stats', async (req, res, next) => {
  try {
    const userId = req.user._id
    const stats = await GameSession.aggregate([
      { $match: { user: userId, status: 'completed' } },
      {
        $group: {
          _id: '$gameType',
          sessions: { $sum: 1 },
          totalScore: { $sum: '$score' },
          bestScore: { $max: '$score' },
          avgAccuracy: { $avg: '$accuracy' },
          totalXP: { $sum: '$rewards.xp' },
        },
      },
    ])

    const flattened = stats.reduce((acc, item) => {
      acc[item._id] = {
        sessions: item.sessions,
        totalScore: item.totalScore,
        bestScore: item.bestScore,
        avgAccuracy: Math.round(item.avgAccuracy || 0),
        totalXP: item.totalXP,
      }
      return acc
    }, {})

    res.json({
      success: true,
      data: {
        overall: flattened,
        userProgress: req.user.progress || {},
      },
    })
  } catch (error) {
    next(error)
  }
})

// @route   GET /api/games/leaderboard
// @desc    Get leaderboard for a game
// @access  Private
router.get('/leaderboard', async (req, res, next) => {
  try {
    const gameType = req.query.gameType
    const limit = Math.min(50, Math.max(5, Number(req.query.limit || 10)))
    const match = { status: 'completed' }
    if (gameType && ['math_sprint', 'science_quest'].includes(gameType)) {
      match.gameType = gameType
    }

    const leaderboard = await GameSession.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$user',
          bestScore: { $max: '$score' },
          totalScore: { $sum: '$score' },
          avgAccuracy: { $avg: '$accuracy' },
          sessions: { $sum: 1 },
        },
      },
      { $sort: { bestScore: -1, totalScore: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$user._id',
          name: '$user.name',
          avatar: '$user.avatar',
          bestScore: 1,
          totalScore: 1,
          sessions: 1,
          avgAccuracy: { $round: ['$avgAccuracy', 0] },
        },
      },
    ])

    res.json({
      success: true,
      data: leaderboard,
    })
  } catch (error) {
    next(error)
  }
})

export default router
