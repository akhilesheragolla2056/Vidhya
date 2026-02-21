import PropTypes from 'prop-types'
import { Award, Sparkles, Trophy } from 'lucide-react'

export default function RewardModal({ isOpen, onClose, result }) {
  if (!isOpen || !result) return null

  const badges = result?.rewards?.badges || []
  const xpEarned = result?.rewards?.xpEarned || 0
  const bonusXP = result?.rewards?.bonusXP || 0

  return (
    <div className="fixed inset-0 z-[70] bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white border border-gray-200 shadow-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
            <Trophy className="text-primary" size={22} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Session Complete</h3>
            <p className="text-sm text-text-secondary">Great run. Keep the streak alive.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="rounded-xl border border-gray-200 p-3">
            <p className="text-xs text-text-secondary">XP Earned</p>
            <p className="text-lg font-bold text-text-primary flex items-center gap-1">
              <Sparkles size={16} className="text-primary" /> {xpEarned}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-3">
            <p className="text-xs text-text-secondary">Mission Bonus</p>
            <p className="text-lg font-bold text-text-primary">+{bonusXP}</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm font-semibold text-text-primary mb-2">Badges Unlocked</p>
          {badges.length ? (
            <div className="space-y-2">
              {badges.map(badge => (
                <div
                  key={badge}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm"
                >
                  <Award size={16} />
                  {badge}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-muted">No new badges this round. Try a higher combo.</p>
          )}
        </div>

        <button onClick={onClose} className="w-full btn-primary">
          Continue
        </button>
      </div>
    </div>
  )
}

RewardModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  result: PropTypes.shape({
    rewards: PropTypes.shape({
      xpEarned: PropTypes.number,
      bonusXP: PropTypes.number,
      badges: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
}

RewardModal.defaultProps = {
  result: null,
}
