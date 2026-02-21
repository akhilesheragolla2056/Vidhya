import PropTypes from 'prop-types'

export default function MissionCard({ mission }) {
  const pct = Math.max(0, Math.min(100, Math.round((mission.progress / mission.target) * 100)))

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-sm font-semibold text-text-primary">{mission.title}</p>
      <p className="text-xs text-text-secondary mt-1">
        {mission.progress} / {mission.target}
      </p>
      <div className="h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
        <div
          className={`h-full ${mission.completed ? 'bg-emerald-500' : 'bg-primary'} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-text-muted mt-2">
        Reward: +{mission.rewardXP} XP{mission.rewardBadge ? `, ${mission.rewardBadge}` : ''}
      </p>
    </div>
  )
}

MissionCard.propTypes = {
  mission: PropTypes.shape({
    title: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
    target: PropTypes.number.isRequired,
    completed: PropTypes.bool.isRequired,
    rewardXP: PropTypes.number.isRequired,
    rewardBadge: PropTypes.string,
  }).isRequired,
}
