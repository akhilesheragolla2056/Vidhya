import PropTypes from 'prop-types'

export default function TimerBar({ remaining, total }) {
  const safeTotal = Math.max(1, total)
  const pct = Math.max(0, Math.min(100, Math.round((remaining / safeTotal) * 100)))
  const color = pct > 50 ? 'bg-emerald-500' : pct > 25 ? 'bg-amber-500' : 'bg-rose-500'

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5 text-xs text-text-secondary">
        <span>Time</span>
        <span className="font-semibold text-text-primary">{remaining}s</span>
      </div>
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

TimerBar.propTypes = {
  remaining: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
}
