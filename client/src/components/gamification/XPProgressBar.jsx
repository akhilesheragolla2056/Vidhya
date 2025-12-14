import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { calculateLevel, calculateXPForLevel } from '../../utils/helpers'

function XPProgressBar({ 
  totalXP, 
  showLevel = true, 
  showXP = true, 
  animate = true,
  size = 'md' 
}) {
  const { level, currentXP, xpForNextLevel, progress } = calculateLevel(totalXP)

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  }

  return (
    <div className="w-full">
      {/* Level and XP display */}
      <div className="flex justify-between items-center mb-2">
        {showLevel && (
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-coral to-pink-500 text-white font-bold text-sm shadow-lg">
              {level}
            </div>
            <span className="text-white font-medium">Level {level}</span>
          </div>
        )}
        
        {showXP && (
          <div className="flex items-center gap-1 text-sm">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">{currentXP}</span>
            <span className="text-gray-500">/</span>
            <span className="text-gray-400">{xpForNextLevel} XP</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className={`relative w-full ${sizeClasses[size]} bg-gray-700 rounded-full overflow-hidden`}>
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-coral via-pink-500 to-purple-500 relative"
          initial={animate ? { width: 0 } : { width: `${progress}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
          />
        </motion.div>
      </div>

      {/* XP to next level */}
      <p className="text-xs text-gray-500 mt-1 text-right">
        {xpForNextLevel - currentXP} XP to Level {level + 1}
      </p>
    </div>
  )
}

XPProgressBar.propTypes = {
  totalXP: PropTypes.number.isRequired,
  showLevel: PropTypes.bool,
  showXP: PropTypes.bool,
  animate: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
}

export default XPProgressBar
