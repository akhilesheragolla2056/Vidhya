import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Clock,
  Search,
  BookOpen,
  ArrowRight,
  Brain,
  Code,
  Dumbbell,
  Leaf,
  Briefcase,
  Trophy,
  CheckCircle2,
  Play,
} from 'lucide-react'

import { coursesData } from '../data/coursesData'
import { getCourseProgress, calculateProgress } from '../utils/progressTracker'
import { coursesAPI } from '../services/api'

const arVrCourse = coursesData.find(course => course.id === 'arvr-science-foundations')

const loadLocalCourses = () => coursesData.map(course => {
  const progress = getCourseProgress(course.id)
  const percentage = calculateProgress(course.id, course.playlist.map(lesson => lesson.id))

  return {
    ...course,
    progress: percentage,
    status: progress.status,
    completedLessons: progress.completedLessons.length,
  }
})

/**
 * Courses Page - Browse all available courses
 */
export default function CoursesNew() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [coursesWithProgress] = useState(loadLocalCourses)
  const { data: publishedCourses = [], isError: liveCoursesError } = useQuery({
    queryKey: ['published-courses'],
    queryFn: async () => {
      const response = await coursesAPI.getAll({ limit: 100 })
      return Array.isArray(response.data?.data) ? response.data.data : []
    },
  })

  const liveCourses = publishedCourses.map(course => ({
    id: course._id,
    href: `/courses/${course._id}`,
    title: course.title,
    category: course.category,
    description: course.description,
    instructor: course.instructor?.name || 'Course team',
    instructorAvatar: course.instructor?.avatar,
    difficulty: course.level || 'Beginner',
    duration: course.duration || 'Self-paced',
    totalLessons:
      course.lessonsCount ||
      course.modules?.reduce((count, module) => count + (module.lessons?.length || 0), 0) ||
      0,
    thumbnail: course.thumbnail,
    progress: 0,
    completedLessons: 0,
    skills: course.whatYouWillLearn || [],
  }))
  const catalogCourses = [...coursesWithProgress, ...liveCourses]

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'All')
  }, [searchParams])

  // Filter courses
  const filteredCourses = catalogCourses.filter(course => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory
    const matchesDifficulty =
      selectedDifficulty === 'All' || course.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const categories = ['All', ...new Set(catalogCourses.map(course => course.category).filter(Boolean))]
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
              Browse {catalogCourses.length} courses with lesson notes, knowledge checks, and clear progress tracking.
            </p>
          </motion.div>
        </div>
      </div>

      {arVrCourse && (
        <section className="border-b border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-cyan-50" aria-labelledby="immersive-course-title">
          <div className="container-custom flex flex-col gap-5 py-7 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">Immersive science spotlight</p>
              <h2 id="immersive-course-title" className="mb-2 text-2xl font-bold text-slate-900">{arVrCourse.title}</h2>
              <p className="text-sm leading-6 text-slate-600">{arVrCourse.description} Includes video lessons, notes, and knowledge checks.</p>
            </div>
            <Link to={`/course/${arVrCourse.id}`} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-700 px-5 py-3 font-semibold text-white transition hover:bg-indigo-800">
              Open AR/VR course <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      )}

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
                onClick={() => {
                  setSelectedCategory(category)
                  setSearchParams(category === 'All' ? {} : { category })
                }}
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
        {liveCoursesError && (
          <p role="status" className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Live course listings are temporarily unavailable. You can still browse the course library below.
          </p>
        )}
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
        to={course.href || `/course/${course.id}`}
        className="block bg-white rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all overflow-hidden h-full"
      >
        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-accent-cyan/10">
          {course.thumbnail && (
            <img
              src={course.thumbnail}
              alt=""
              onError={event => {
                event.currentTarget.style.display = 'none'
              }}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}

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
          {/* Difficulty and learning format */}
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

            <span className="text-xs font-medium text-text-secondary">Self-paced</span>
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
            {course.instructorAvatar ? (
              <img
                src={course.instructorAvatar}
                alt=""
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary"
              >
                {course.instructor?.split(' ').map(part => part[0]).join('').slice(0, 2)}
              </div>
            )}
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
  'BSc Agriculture': Leaf,
  'Sports & Fitness': Dumbbell,
  'Skill-based Courses': Code,
  'Competitive Exams': Trophy,
  Programming: Code,
  'Web Dev': Code,
  'Data Science': Brain,
  'AI/ML': Brain,
  Science: Leaf,
  Business: Briefcase,
  'Health Studies': Leaf,
  'Life Science': Leaf,
  'AR & VR Learning': Brain,
  All: BookOpen,
}
