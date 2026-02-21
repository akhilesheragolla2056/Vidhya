import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Brain, Clock, Flame, PlayCircle, Trophy } from 'lucide-react'
import TimerBar from '../components/game/TimerBar'
import ComboMeter from '../components/game/ComboMeter'
import MissionCard from '../components/game/MissionCard'
import RewardModal from '../components/game/RewardModal'
import {
  fetchDailyMissions,
  fetchLeaderboard,
  fetchGameStats,
  startGameSession,
  submitGameSession,
  clearLatestResult,
} from '../store/slices/gameSlice'

const CONFIG = {
  easy: { max: 20, operators: ['+', '-'] },
  medium: { max: 50, operators: ['+', '-', '*'] },
  hard: { max: 120, operators: ['+', '-', '*'] },
}

const TOTAL_TIME = 60

const randomInt = max => Math.floor(Math.random() * (max + 1))

const generateQuestion = difficulty => {
  const cfg = CONFIG[difficulty] || CONFIG.medium
  const operator = cfg.operators[Math.floor(Math.random() * cfg.operators.length)]
  let a = randomInt(cfg.max)
  let b = randomInt(cfg.max)

  if (operator === '-' && b > a) [a, b] = [b, a]
  if (operator === '*') {
    a = randomInt(Math.floor(cfg.max / 3))
    b = randomInt(12)
  }

  const expression = `${a} ${operator} ${b}`
  const answer = operator === '+' ? a + b : operator === '-' ? a - b : a * b
  return { expression, answer }
}

export default function MathSprint() {
  const dispatch = useDispatch()
  const { activeSession, latestResult, dailyMissions, leaderboard, stats, isLoading } = useSelector(
    state => state.game
  )
  const [difficulty, setDifficulty] = useState('medium')
  const [phase, setPhase] = useState('idle')
  const [remaining, setRemaining] = useState(TOTAL_TIME)
  const [question, setQuestion] = useState(() => generateQuestion('medium'))
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [attempted, setAttempted] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [streak, setStreak] = useState(0)
  const [comboMax, setComboMax] = useState(0)
  const submittedRef = useRef(false)

  useEffect(() => {
    dispatch(fetchDailyMissions())
    dispatch(fetchGameStats())
    dispatch(fetchLeaderboard({ gameType: 'math_sprint', limit: 10 }))
  }, [dispatch])

  useEffect(() => {
    if (phase !== 'playing') return undefined
    const timer = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [phase])

  useEffect(() => {
    if (phase === 'playing' && remaining === 0) {
      handleFinish()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, phase])

  const missions = dailyMissions?.missions || []
  const mathStats = stats?.overall?.math_sprint || {}
  const topPlayers = leaderboard?.math_sprint || []

  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0

  const playerRankHint = useMemo(() => {
    if (!topPlayers.length) return 'No leaderboard data yet.'
    const topScore = topPlayers[0]?.bestScore || 0
    const diff = Math.max(0, topScore - score)
    return diff === 0 ? 'You matched the leaderboard top score.' : `${diff} points to reach top score.`
  }, [topPlayers, score])

  const handleStart = async () => {
    setPhase('loading')
    submittedRef.current = false
    setScore(0)
    setAttempted(0)
    setCorrect(0)
    setStreak(0)
    setComboMax(0)
    setInput('')
    setRemaining(TOTAL_TIME)
    setQuestion(generateQuestion(difficulty))
    await dispatch(startGameSession({ gameType: 'math_sprint', difficulty }))
    setPhase('playing')
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!input.trim() || phase !== 'playing') return

    const userAnswer = Number(input)
    const isCorrect = userAnswer === question.answer
    const nextAttempted = attempted + 1
    const nextCorrect = correct + (isCorrect ? 1 : 0)
    const nextStreak = isCorrect ? streak + 1 : 0
    const points = isCorrect ? 10 + nextStreak * 2 : 0

    setAttempted(nextAttempted)
    setCorrect(nextCorrect)
    setStreak(nextStreak)
    setComboMax(prev => Math.max(prev, nextStreak))
    setScore(prev => prev + points)
    setInput('')
    setQuestion(generateQuestion(difficulty))
  }

  const handleFinish = async () => {
    if (submittedRef.current || phase !== 'playing') return
    submittedRef.current = true
    setPhase('submitting')

    const sessionId = activeSession?._id
    if (sessionId) {
      await dispatch(
        submitGameSession({
          sessionId,
          payload: {
            score,
            questionsAttempted: attempted,
            correctAnswers: correct,
            streak,
            comboMax,
            timeSpent: TOTAL_TIME - remaining,
            metadata: { mode: 'classic' },
          },
        })
      )
    }

    await dispatch(fetchDailyMissions())
    await dispatch(fetchGameStats())
    await dispatch(fetchLeaderboard({ gameType: 'math_sprint', limit: 10 }))
    setPhase('finished')
  }

  return (
    <div className="min-h-screen bg-surface-bg">
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Math Sprint</h1>
            <p className="text-text-secondary">Fast arithmetic rounds with combo multipliers.</p>
          </div>
          <Link to="/games/science-quest" className="btn-secondary">
            Switch to Science Quest
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
            <div className="grid md:grid-cols-3 gap-3 mb-6">
              <div className="rounded-xl border border-gray-200 p-3">
                <p className="text-xs text-text-secondary">Score</p>
                <p className="text-2xl font-bold text-text-primary">{score}</p>
              </div>
              <div className="rounded-xl border border-gray-200 p-3">
                <p className="text-xs text-text-secondary">Accuracy</p>
                <p className="text-2xl font-bold text-text-primary">{accuracy}%</p>
              </div>
              <ComboMeter streak={streak} comboMax={comboMax} />
            </div>

            <TimerBar remaining={remaining} total={TOTAL_TIME} />

            <div className="mt-6 rounded-2xl bg-gradient-to-br from-primary/10 to-cyan-500/10 p-6 border border-primary/20">
              <p className="text-xs font-semibold text-primary uppercase tracking-wide">Current Problem</p>
              <p className="text-5xl md:text-6xl font-bold text-text-primary my-4">{question.expression}</p>

              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="number"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  disabled={phase !== 'playing'}
                  className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-lg outline-none focus:border-primary"
                  placeholder="Enter answer"
                />
                <button type="submit" disabled={phase !== 'playing'} className="btn-primary min-w-[140px]">
                  Submit
                </button>
              </form>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {phase === 'idle' || phase === 'finished' ? (
                <>
                  <select
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-2"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  <button onClick={handleStart} disabled={phase === 'loading'} className="btn-primary flex items-center gap-2">
                    <PlayCircle size={18} />
                    Start Sprint
                  </button>
                </>
              ) : (
                <button onClick={handleFinish} disabled={phase !== 'playing'} className="btn-secondary">
                  Finish Round
                </button>
              )}
            </div>
          </section>

          <aside className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Trophy size={18} className="text-primary" />
                <h3 className="font-semibold text-text-primary">Leaderboard</h3>
              </div>
              <div className="space-y-2">
                {topPlayers.slice(0, 5).map((entry, idx) => (
                  <div key={`${entry.userId}-${idx}`} className="flex items-center justify-between text-sm">
                    <span className="text-text-primary">
                      {idx + 1}. {entry.name}
                    </span>
                    <span className="font-semibold">{entry.bestScore}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-text-muted mt-3">{playerRankHint}</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Brain size={18} className="text-primary" />
                <h3 className="font-semibold text-text-primary">Your Stats</h3>
              </div>
              <p className="text-sm text-text-secondary">Best score: {mathStats.bestScore || 0}</p>
              <p className="text-sm text-text-secondary">Sessions: {mathStats.sessions || 0}</p>
              <p className="text-sm text-text-secondary">Avg accuracy: {mathStats.avgAccuracy || 0}%</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Flame size={18} className="text-primary" />
                <h3 className="font-semibold text-text-primary">Daily Missions</h3>
              </div>
              <div className="space-y-3">
                {missions.map(mission => (
                  <MissionCard key={mission.missionId} mission={mission} />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <RewardModal
        isOpen={phase === 'finished' && !!latestResult}
        result={latestResult}
        onClose={() => {
          dispatch(clearLatestResult())
          setPhase('idle')
        }}
      />

      {isLoading && phase === 'submitting' ? (
        <div className="fixed bottom-5 right-5 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm flex items-center gap-2 shadow">
          <Clock size={16} className="text-primary" />
          Saving game result...
        </div>
      ) : null}
    </div>
  )
}
