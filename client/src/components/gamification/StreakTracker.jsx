import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { Flame, Calendar } from 'lucide-react'

function StreakTracker({ currentStreak, longestStreak, weeklyActivity }) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  
  // Default weekly activity if not provided
  const activity = weeklyActivity || days.map(() => ({ active: false }))

  return (
    <div className="bg-gray-800/50 border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Flame className="text-coral" />
          Learning Streak
        </h3>
        <div className="text-sm text-gray-400">
          Best: {longestStreak} days
        </div>
      </div>

      {/* Current streak display */}
      <div className="flex items-center gap-4 mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="relative"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-coral to-orange-500 flex items-center justify-center shadow-lg shadow-coral/30">
            <span className="text-3xl font-bold text-white">{currentStreak}</span>
          </div>
          {currentStreak > 0 && (
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Flame className="w-6 h-6 text-yellow-400" />
            </motion.div>
          )}
        </motion.div>
        
        <div>
          <p className="text-2xl font-bold text-white">
            {currentStreak === 0 ? 'Start today!' : 
             currentStreak === 1 ? '1 day' : `${currentStreak} days`}
          </p>
          <p className="text-sm text-gray-400">
            {currentStreak >= 7 
              ? '🔥 You\'re on fire!' 
              : currentStreak > 0 
                ? 'Keep going!' 
                : 'Learn something today'}
          </p>
        </div>
      </div>

      {/* Weekly calendar */}
      <div className="bg-gray-900/50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3 text-gray-400 text-sm">
          <Calendar size={16} />
          <span>This Week</span>
        </div>
        
        <div className="flex justify-between">
          {days.map((day, index) => {
            const isActive = activity[index]?.active
            const isToday = new Date().getDay() === (index === 6 ? 0 : index + 1)
            
            return (
              <div key={index} className="flex flex-col items-center gap-2">
                <span className={`text-xs ${isToday ? 'text-coral font-semibold' : 'text-gray-500'}`}>
                  {day}
                </span>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isActive 
                      ? 'bg-gradient-to-br from-coral to-orange-500' 
                      : isToday 
                        ? 'border-2 border-coral border-dashed' 
                        : 'bg-gray-700'
                  }`}
                >
                  {isActive && <Flame size={14} className="text-white" />}
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Streak milestones */}
      <div className="mt-4 flex gap-2 flex-wrap">
        {[7, 30, 100, 365].map(milestone => {
          const achieved = currentStreak >= milestone
          return (
            <div
              key={milestone}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                achieved 
                  ? 'bg-coral/20 text-coral' 
                  : 'bg-gray-700 text-gray-500'
              }`}
            >
              {milestone}🔥 {achieved ? '✓' : `${milestone - currentStreak} to go`}
            </div>
          )
        })}
      </div>
    </div>
  )
}

StreakTracker.propTypes = {
  currentStreak: PropTypes.number.isRequired,
  longestStreak: PropTypes.number,
  weeklyActivity: PropTypes.arrayOf(PropTypes.shape({
    active: PropTypes.bool,
    date: PropTypes.string,
  })),
}

StreakTracker.defaultProps = {
  longestStreak: 0,
}

export default StreakTracker
