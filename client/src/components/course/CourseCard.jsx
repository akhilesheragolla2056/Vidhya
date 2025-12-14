import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Users, Star, BookOpen } from 'lucide-react'
import { formatNumber } from '../../utils/helpers'

function CourseCard({ course, index = 0 }) {
  const {
    _id,
    title,
    description,
    thumbnail,
    instructor,
    category,
    difficulty,
    duration,
    lessons,
    rating,
    enrolledCount,
    price,
    isFeatured,
  } = course

  const difficultyColors = {
    beginner: 'bg-teal/20 text-teal',
    intermediate: 'bg-coral/20 text-coral',
    advanced: 'bg-primary/20 text-primary-light',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link to={`/courses/${_id}`}>
        <div className="bg-gray-800/50 border border-white/10 rounded-xl overflow-hidden hover:border-coral/30 transition-all duration-300">
          {/* Thumbnail */}
          <div className="relative aspect-video overflow-hidden">
            <img
              src={thumbnail || `https://source.unsplash.com/400x225/?${category}`}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Featured badge */}
            {isFeatured && (
              <div className="absolute top-3 left-3 px-2 py-1 bg-coral text-white text-xs font-semibold rounded-md">
                Featured
              </div>
            )}

            {/* Price badge */}
            <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-sm font-semibold rounded-full">
              {price === 0 ? 'Free' : `$${price}`}
            </div>

            {/* Difficulty badge */}
            <div className={`absolute bottom-3 left-3 px-2 py-1 text-xs font-medium rounded-full capitalize ${
              difficultyColors[difficulty] || difficultyColors.beginner
            }`}>
              {difficulty}
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Category */}
            <p className="text-xs text-coral font-medium uppercase tracking-wide mb-1">
              {category}
            </p>

            {/* Title */}
            <h3 className="font-semibold text-white text-lg mb-2 line-clamp-2 group-hover:text-coral transition-colors">
              {title}
            </h3>

            {/* Description */}
            <p className="text-gray-400 text-sm line-clamp-2 mb-3">
              {description}
            </p>

            {/* Instructor */}
            <div className="flex items-center gap-2 mb-3">
              <img
                src={instructor?.avatar || `https://ui-avatars.com/api/?name=${instructor?.name}`}
                alt={instructor?.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-gray-300">{instructor?.name || 'Unknown'}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {duration}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen size={14} />
                  {lessons} lessons
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-400" />
                  {rating?.toFixed(1) || '4.5'}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={14} />
                  {formatNumber(enrolledCount || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

CourseCard.propTypes = {
  course: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    thumbnail: PropTypes.string,
    instructor: PropTypes.shape({
      name: PropTypes.string,
      avatar: PropTypes.string,
    }),
    category: PropTypes.string,
    difficulty: PropTypes.string,
    duration: PropTypes.string,
    lessons: PropTypes.number,
    rating: PropTypes.number,
    enrolledCount: PropTypes.number,
    price: PropTypes.number,
    isFeatured: PropTypes.bool,
  }).isRequired,
  index: PropTypes.number,
}

export default CourseCard
