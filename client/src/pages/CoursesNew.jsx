import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Clock,
  Search,
  BookOpen,
  Users,
  Star,
  ArrowRight,
  Brain,
  Code,
  Dumbbell,
  Briefcase,
  Trophy,
  Filter,
  CheckCircle2,
  Play,
} from 'lucide-react'

import { coursesData, getAllCategories } from '../data/coursesData'
import { getCourseProgress, calculateProgress } from '../utils/progressTracker'

/**
 * Courses Page - Browse all available courses
 */
export default function CoursesNew() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [coursesWithProgress, setCoursesWithProgress] = useState([])

  // Category icons mapping
  const categoryIcons = {
    'Academic Education': Brain,
    'Sports & Fitness': Dumbbell,
    'Skill-based Courses': Code,
    'Competitive Exams': Trophy,
    All: BookOpen,
  }

  // Load courses with progress
  useEffect(() => {
    const enrichedCourses = coursesData.map(course => {
      const progress = getCourseProgress(course.id)
      const percentage = calculateProgress(course.id, course.totalLessons)

      return {
        ...course,
        progress: percentage,
        status: progress.status,
        completedLessons: progress.completedLessons.length,
      }
    })
    setCoursesWithProgress(enrichedCourses)
  }, [])

  // Filter courses
  const filteredCourses = coursesWithProgress.filter(course => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory
    const matchesDifficulty =
      selectedDifficulty === 'All' || course.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const categories = ['All', ...getAllCategories()]
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced']

  return (
    <div className="min-h-screen bg-surface-bg">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary via-primary-dark to-primary text-white py-12">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-3">A broad selection of courses</h1>
            <p className="text-lg text-white/90">
              Choose from over 10,000 online video courses with new additions published every month
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="container-custom">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for anything"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom">
          <div className="flex gap-6 overflow-x-auto py-4 scrollbar-hide">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap pb-2 border-b-2 font-bold text-sm transition-colors ${
                  selectedCategory === category
                    ? 'border-gray-900 text-text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Difficulty Filter & Results */}
      <div className="container-custom py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">
            {selectedCategory === 'All' ? 'All Courses' : selectedCategory}
          </h2>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-secondary">Level:</span>
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-sm text-text-secondary mb-6">{filteredCourses.length} results</p>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">No courses found</h3>
            <p className="text-text-secondary">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredCourses.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Course Card Component
 */
function CourseCard({ course, index }) {
  const Icon = categoryIcons[course.category] || BookOpen

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link
        to={`/course/${course.id}`}
        className="block bg-white rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all overflow-hidden h-full"
      >
        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-accent-cyan/10">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Progress Overlay */}
          {course.progress > 0 && (
            <div className="absolute top-3 right-3">
              <div className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full flex items-center gap-1.5">
                {course.progress === 100 ? (
                  <>
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-600">Completed</span>
                  </>
                ) : (
                  <>
                    <Play size={14} className="text-primary" />
                    <span className="text-xs font-bold text-primary">{course.progress}%</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full">
              <Icon size={14} className="text-primary" />
              <span className="text-xs font-semibold text-primary">{course.category}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Difficulty & Rating */}
          <div className="flex items-center justify-between mb-3">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                course.difficulty === 'Beginner'
                  ? 'bg-teal/20 text-teal'
                  : course.difficulty === 'Intermediate'
                    ? 'bg-coral/20 text-coral'
                    : 'bg-primary/20 text-primary'
              }`}
            >
              {course.difficulty}
            </span>

            <div className="flex items-center gap-1">
              <Star size={14} className="text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold text-text-primary">{course.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-text-secondary mb-4 line-clamp-2">{course.description}</p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-text-secondary mb-4">
            <div className="flex items-center gap-1">
              <BookOpen size={14} />
              <span>{course.totalLessons} lessons</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>{course.enrolledCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{course.duration}</span>
            </div>
          </div>

          {/* Progress Bar (if started) */}
          {course.progress > 0 && course.progress < 100 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-text-secondary">
                  {course.completedLessons} / {course.totalLessons} completed
                </span>
                <span className="text-xs font-semibold text-primary">{course.progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent-cyan rounded-full"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Instructor */}
          <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
            <img
              src={course.instructorAvatar}
              alt={course.instructor}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-text-secondary">Instructor</p>
              <p className="text-sm font-semibold text-text-primary truncate">
                {course.instructor}
              </p>
            </div>
            <ArrowRight
              size={18}
              className="text-primary group-hover:translate-x-1 transition-transform"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

const categoryIcons = {
  'Academic Education': Brain,
  'Sports & Fitness': Dumbbell,
  'Skill-based Courses': Code,
  'Competitive Exams': Trophy,
  All: BookOpen,
}
