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
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-amber-100 text-amber-700',
    advanced: 'bg-red-100 text-red-700',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group h-full"
    >
      <Link to={`/courses/${_id}`} className="block h-full">
        <div className="card-course h-full flex flex-col">
          {/* Thumbnail */}
          <div className="relative aspect-video overflow-hidden bg-gray-100">
            <img
              src={thumbnail || `https://source.unsplash.com/800x450/?${category},learning`}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            
            {/* Bestseller badge */}
            {isFeatured && (
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-accent-orange text-white text-xs font-bold rounded">
                Bestseller
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1">
            {/* Title */}
            <h3 className="font-bold text-text-primary text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>

            {/* Description */}
            <p className="text-sm text-text-secondary line-clamp-2 mb-3 flex-1">
              {description}
            </p>

            {/* Instructor */}
            <p className="text-xs text-text-muted mb-2">
              {instructor?.name || 'Unknown Instructor'}
            </p>

            {/* Rating & Students */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-text-primary">
                  {rating?.toFixed(1) || '4.5'}
                </span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={`${
                        i < Math.round(rating || 4.5)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-xs text-text-muted">
                ({formatNumber(enrolledCount || 1234)})
              </span>
            </div>

            {/* Bottom Row - Price & Meta */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <Clock size={14} />
                <span>{duration}</span>
                <span>•</span>
                <span className={`badge badge-primary text-xs`}>
                  {difficulty}
                </span>
              </div>
              
              <div className="text-lg font-bold text-text-primary">
                {price === 0 ? 'Free' : `$${price}`}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
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
