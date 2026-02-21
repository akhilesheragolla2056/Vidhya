import PropTypes from 'prop-types'

export default function ComboMeter({ streak, comboMax }) {
  const active = streak >= 2
  const glow = active ? 'ring-2 ring-orange-300 bg-orange-50' : 'bg-gray-50'

  return (
    <div className={`rounded-xl p-3 border border-gray-200 ${glow} transition-all`}>
      <p className="text-xs text-text-secondary mb-1">Combo</p>
      <p className="text-xl font-bold text-text-primary">{active ? `x${streak}` : 'x1'}</p>
      <p className="text-xs text-text-muted mt-1">Best combo: x{comboMax}</p>
    </div>
  )
}

ComboMeter.propTypes = {
  streak: PropTypes.number.isRequired,
  comboMax: PropTypes.number.isRequired,
}
