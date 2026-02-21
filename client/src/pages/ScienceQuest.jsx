import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Atom, Beaker, PlayCircle, Sparkles, Trophy } from 'lucide-react'
import TimerBar from '../components/game/TimerBar'
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

const TOTAL_TIME = 90

const QUESTION_BANK = [
  {
    prompt: 'Which particle has a negative charge?',
    options: ['Proton', 'Electron', 'Neutron', 'Photon'],
    answer: 'Electron',
  },
  {
    prompt: 'What process do plants use to make food?',
    options: ['Respiration', 'Photosynthesis', 'Digestion', 'Fermentation'],
    answer: 'Photosynthesis',
  },
  {
    prompt: 'Which state of matter has a fixed volume but no fixed shape?',
    options: ['Solid', 'Liquid', 'Gas', 'Plasma'],
    answer: 'Liquid',
  },
  {
    prompt: 'What is the chemical symbol for sodium?',
    options: ['S', 'So', 'Na', 'N'],
    answer: 'Na',
  },
  {
    prompt: 'Which organ pumps blood through the human body?',
    options: ['Lungs', 'Liver', 'Heart', 'Kidney'],
    answer: 'Heart',
  },
  {
    prompt: 'What force keeps planets in orbit around the sun?',
    options: ['Magnetism', 'Gravity', 'Friction', 'Inertia'],
    answer: 'Gravity',
  },
  {
    prompt: 'Which gas is most abundant in Earth atmosphere?',
    options: ['Oxygen', 'Carbon Dioxide', 'Hydrogen', 'Nitrogen'],
    answer: 'Nitrogen',
  },
  {
    prompt: 'Water boils at what temperature at sea level?',
    options: ['80 C', '90 C', '100 C', '120 C'],
    answer: '100 C',
  },
  {
    prompt: 'What is the powerhouse of the cell?',
    options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Chloroplast'],
    answer: 'Mitochondria',
  },
  {
    prompt: 'Which simple machine is a seesaw?',
    options: ['Wheel and axle', 'Pulley', 'Lever', 'Wedge'],
    answer: 'Lever',
  },
]

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5)

export default function ScienceQuest() {
  const dispatch = useDispatch()
  const { activeSession, latestResult, dailyMissions, leaderboard, stats, isLoading } = useSelector(
    state => state.game
  )
  const [phase, setPhase] = useState('idle')
  const [remaining, setRemaining] = useState(TOTAL_TIME)
  const [questions, setQuestions] = useState(() => shuffle(QUESTION_BANK).slice(0, 10))
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [attempted, setAttempted] = useState(0)
  const [streak, setStreak] = useState(0)
  const [comboMax, setComboMax] = useState(0)
  const submittedRef = useRef(false)

  useEffect(() => {
    dispatch(fetchDailyMissions())
    dispatch(fetchGameStats())
    dispatch(fetchLeaderboard({ gameType: 'science_quest', limit: 10 }))
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

  const scienceStats = stats?.overall?.science_quest || {}
  const missions = dailyMissions?.missions || []
  const topPlayers = leaderboard?.science_quest || []
  const currentQuestion = questions[index]
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0

  const rankHint = useMemo(() => {
    if (!topPlayers.length) return 'No leaderboard data yet.'
    const top = topPlayers[0]?.bestScore || 0
    const diff = Math.max(0, top - score)
    return diff === 0 ? 'You matched first place.' : `${diff} points to take first place.`
  }, [topPlayers, score])

  const startGame = async () => {
    setPhase('loading')
    submittedRef.current = false
    setQuestions(shuffle(QUESTION_BANK).slice(0, 10))
    setIndex(0)
    setScore(0)
    setCorrect(0)
    setAttempted(0)
    setStreak(0)
    setComboMax(0)
    setRemaining(TOTAL_TIME)
    await dispatch(startGameSession({ gameType: 'science_quest', difficulty: 'medium' }))
    setPhase('playing')
  }

  const answerQuestion = option => {
    if (phase !== 'playing') return
    const isCorrect = option === currentQuestion.answer
    const nextAttempted = attempted + 1
    const nextCorrect = correct + (isCorrect ? 1 : 0)
    const nextStreak = isCorrect ? streak + 1 : 0
    const gained = isCorrect ? 20 + nextStreak * 3 : 0

    setAttempted(nextAttempted)
    setCorrect(nextCorrect)
    setStreak(nextStreak)
    setComboMax(prev => Math.max(prev, nextStreak))
    setScore(prev => prev + gained)

    if (index >= questions.length - 1) {
      handleFinish({
        nextAttempted,
        nextCorrect,
        nextStreak,
        nextComboMax: Math.max(comboMax, nextStreak),
      })
      return
    }

    setIndex(prev => prev + 1)
  }

  const handleFinish = async (forced = null) => {
    if (submittedRef.current || phase !== 'playing') return
    submittedRef.current = true
    setPhase('submitting')

    const safeAttempted = forced?.nextAttempted ?? attempted
    const safeCorrect = forced?.nextCorrect ?? correct
    const safeStreak = forced?.nextStreak ?? streak
    const safeCombo = forced?.nextComboMax ?? comboMax

    if (activeSession?._id) {
      await dispatch(
        submitGameSession({
          sessionId: activeSession._id,
          payload: {
            score,
            questionsAttempted: safeAttempted,
            correctAnswers: safeCorrect,
            streak: safeStreak,
            comboMax: safeCombo,
            timeSpent: TOTAL_TIME - remaining,
            metadata: {
              totalQuestions: questions.length,
              answered: safeAttempted,
            },
          },
        })
      )
    }

    await dispatch(fetchDailyMissions())
    await dispatch(fetchGameStats())
    await dispatch(fetchLeaderboard({ gameType: 'science_quest', limit: 10 }))
    setPhase('finished')
  }

  return (
    <div className="min-h-screen bg-surface-bg">
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Science Quest</h1>
            <p className="text-text-secondary">Rapid science challenges with streak rewards.</p>
          </div>
          <Link to="/games/math-sprint" className="btn-secondary">
            Switch to Math Sprint
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
              <div className="rounded-xl border border-gray-200 p-3">
                <p className="text-xs text-text-secondary">Question</p>
                <p className="text-2xl font-bold text-text-primary">
                  {Math.min(index + 1, questions.length)} / {questions.length}
                </p>
              </div>
            </div>

            <TimerBar remaining={remaining} total={TOTAL_TIME} />

            <div className="mt-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-primary/10 p-6 border border-cyan-200">
              {phase === 'idle' || phase === 'finished' ? (
                <div className="text-center py-12">
                  <Beaker size={42} className="text-primary mx-auto mb-3" />
                  <h2 className="text-2xl font-bold text-text-primary mb-2">Ready for your next experiment?</h2>
                  <p className="text-text-secondary mb-6">
                    Answer 10 science prompts before time runs out.
                  </p>
                  <button onClick={startGame} className="btn-primary inline-flex items-center gap-2">
                    <PlayCircle size={18} />
                    Start Quest
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">
                    Current Challenge
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-text-primary mb-6">{currentQuestion?.prompt}</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {currentQuestion?.options.map(option => (
                      <button
                        key={option}
                        onClick={() => answerQuestion(option)}
                        className="text-left px-4 py-3 rounded-xl border border-gray-300 hover:border-primary hover:bg-primary/5 transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
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
              <p className="text-xs text-text-muted mt-3">{rankHint}</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Atom size={18} className="text-primary" />
                <h3 className="font-semibold text-text-primary">Your Stats</h3>
              </div>
              <p className="text-sm text-text-secondary">Best score: {scienceStats.bestScore || 0}</p>
              <p className="text-sm text-text-secondary">Sessions: {scienceStats.sessions || 0}</p>
              <p className="text-sm text-text-secondary">Avg accuracy: {scienceStats.avgAccuracy || 0}%</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={18} className="text-primary" />
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
          Saving quest results...
        </div>
      ) : null}
    </div>
  )
}
