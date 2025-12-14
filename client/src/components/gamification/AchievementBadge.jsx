import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { Trophy, Zap, Target, Star, Flame, Award, BookOpen, Users } from 'lucide-react'

const iconMap = {
  trophy: Trophy,
  zap: Zap,
  target: Target,
  star: Star,
  flame: Flame,
  award: Award,
  book: BookOpen,
  users: Users,
}

const rarityColors = {
  common: 'from-gray-500 to-gray-600',
  uncommon: 'from-green-500 to-emerald-600',
  rare: 'from-blue-500 to-indigo-600',
  epic: 'from-purple-500 to-pink-600',
  legendary: 'from-yellow-400 to-orange-500',
}

function AchievementBadge({ 
  achievement, 
  unlocked = false, 
  progress = 0,
  showDetails = false,
  size = 'md' 
}) {
  const {
    id,
    name,
    description,
    icon = 'trophy',
    rarity = 'common',
    xp = 0,
    maxProgress = 1,
    unlockedAt,
  } = achievement

  const Icon = iconMap[icon] || Trophy
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  }

  const iconSizes = {
    sm: 20,
    md: 28,
    lg: 36,
  }

  const progressPercent = maxProgress > 1 ? (progress / maxProgress) * 100 : (unlocked ? 100 : 0)

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`flex flex-col items-center ${showDetails ? 'gap-3' : 'gap-2'}`}
    >
      {/* Badge icon */}
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full relative overflow-hidden ${
          unlocked 
            ? `bg-gradient-to-br ${rarityColors[rarity]} shadow-lg` 
            : 'bg-gray-700'
        }`}>
          {/* Shine effect for unlocked */}
          {unlocked && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
          )}
          
          {/* Icon */}
          <div className={`absolute inset-0 flex items-center justify-center ${
            unlocked ? 'text-white' : 'text-gray-500'
          }`}>
            <Icon size={iconSizes[size]} />
          </div>
        </div>

        {/* Progress ring for incomplete achievements */}
        {!unlocked && maxProgress > 1 && (
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-gray-600"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeDasharray={`${progressPercent * 2.83} 283`}
              strokeLinecap="round"
              className="text-coral"
            />
          </svg>
        )}

        {/* XP badge */}
        {unlocked && xp > 0 && (
          <div className="absolute -bottom-1 -right-1 bg-coral text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-lg">
            +{xp}
          </div>
        )}

        {/* Lock overlay */}
        {!unlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
            <div className="text-gray-400 text-xs">🔒</div>
          </div>
        )}
      </div>

      {/* Details */}
      {showDetails && (
        <div className="text-center max-w-[120px]">
          <h4 className={`font-semibold text-sm ${unlocked ? 'text-white' : 'text-gray-400'}`}>
            {name}
          </h4>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {description}
          </p>
          {maxProgress > 1 && !unlocked && (
            <p className="text-xs text-coral mt-1">
              {progress} / {maxProgress}
            </p>
          )}
          {unlockedAt && (
            <p className="text-xs text-gray-600 mt-1">
              {new Date(unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </motion.div>
  )
}

AchievementBadge.propTypes = {
  achievement: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    icon: PropTypes.string,
    rarity: PropTypes.oneOf(['common', 'uncommon', 'rare', 'epic', 'legendary']),
    xp: PropTypes.number,
    maxProgress: PropTypes.number,
    unlockedAt: PropTypes.string,
  }).isRequired,
  unlocked: PropTypes.bool,
  progress: PropTypes.number,
  showDetails: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
}

export default AchievementBadge
