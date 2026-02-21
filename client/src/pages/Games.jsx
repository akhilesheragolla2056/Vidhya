import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Atom, Brain, Flame, Gamepad2, Sparkles, Trophy } from 'lucide-react'
import { fetchDailyMissions, fetchGameStats, fetchLeaderboard } from '../store/slices/gameSlice'
import MissionCard from '../components/game/MissionCard'

function GameCard({ title, description, icon: Icon, to, colorClass, bullets }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center mb-4`}>
        <Icon size={24} className="text-white" />
      </div>
      <h3 className="text-2xl font-bold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary mb-4">{description}</p>
      <div className="space-y-2 mb-5">
        {bullets.map(item => (
          <p key={item} className="text-sm text-text-secondary">
            • {item}
          </p>
        ))}
      </div>
      <Link to={to} className="btn-primary inline-flex">
        Play Now
      </Link>
    </div>
  )
}

export default function Games() {
  const dispatch = useDispatch()
  const { dailyMissions, stats, leaderboard } = useSelector(state => state.game)
  const user = useSelector(state => state.user.currentUser)

  useEffect(() => {
    dispatch(fetchDailyMissions())
    dispatch(fetchGameStats())
    dispatch(fetchLeaderboard({ gameType: 'math_sprint', limit: 5 }))
    dispatch(fetchLeaderboard({ gameType: 'science_quest', limit: 5 }))
  }, [dispatch])

  const missions = dailyMissions?.missions || []
  const mathStats = stats?.overall?.math_sprint || {}
  const scienceStats = stats?.overall?.science_quest || {}
  const topMath = leaderboard?.math_sprint?.[0]
  const topScience = leaderboard?.science_quest?.[0]

  return (
    <div className="min-h-screen bg-surface-bg">
      <div className="bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container-custom py-12 md:py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-sm mb-4">
              <Gamepad2 size={16} />
              Gamified Learning Arena
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Learn Faster Through Play</h1>
            <p className="text-white/85 text-lg">
              Build streaks, unlock badges, and climb leaderboards while practicing math and
              science in short focused game sessions.
            </p>
            <p className="text-white/80 mt-4">
              Welcome{user?.name ? `, ${user.name}` : ''}. Your XP and badges are synced with your
              profile.
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-8 space-y-8">
        <section className="grid lg:grid-cols-2 gap-6">
          <GameCard
            title="Math Sprint"
            description="A 60-second speed challenge with adaptive arithmetic and combo multipliers."
            to="/games/math-sprint"
            icon={Brain}
            colorClass="bg-gradient-to-br from-indigo-600 to-blue-500"
            bullets={[
              'Timed rounds with streak multipliers',
              'Score boosts for consistent accuracy',
              'Great for daily warm-up practice',
            ]}
          />
          <GameCard
            title="Science Quest"
            description="A rapid-fire science challenge that rewards consistent correct answers."
            to="/games/science-quest"
            icon={Atom}
            colorClass="bg-gradient-to-br from-cyan-600 to-teal-500"
            bullets={[
              'Concept checks across physics, chemistry, biology',
              'Quest scoring with accuracy tracking',
              'Daily missions for bonus XP',
            ]}
          />
        </section>

        <section className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Flame size={18} className="text-primary" />
              <h3 className="font-semibold text-text-primary">Daily Missions</h3>
            </div>
            <div className="space-y-3">
              {missions.length ? (
                missions.map(mission => <MissionCard key={mission.missionId} mission={mission} />)
              ) : (
                <p className="text-sm text-text-secondary">No missions loaded yet.</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-primary" />
              <h3 className="font-semibold text-text-primary">Your Progress</h3>
            </div>
            <p className="text-sm text-text-secondary">Math best score: {mathStats.bestScore || 0}</p>
            <p className="text-sm text-text-secondary">
              Science best score: {scienceStats.bestScore || 0}
            </p>
            <p className="text-sm text-text-secondary">Math sessions: {mathStats.sessions || 0}</p>
            <p className="text-sm text-text-secondary">
              Science sessions: {scienceStats.sessions || 0}
            </p>
            <div className="mt-4 flex gap-2">
              <Link to="/games/math-sprint" className="btn-secondary text-sm px-3 py-2">
                Math
              </Link>
              <Link to="/games/science-quest" className="btn-secondary text-sm px-3 py-2">
                Science
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Trophy size={18} className="text-primary" />
              <h3 className="font-semibold text-text-primary">Top Players</h3>
            </div>
            <p className="text-sm text-text-secondary">
              Math leader: {topMath?.name || 'N/A'} ({topMath?.bestScore || 0})
            </p>
            <p className="text-sm text-text-secondary mt-1">
              Science leader: {topScience?.name || 'N/A'} ({topScience?.bestScore || 0})
            </p>
            <p className="text-xs text-text-muted mt-4">
              Keep your streak active to climb the board faster.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
