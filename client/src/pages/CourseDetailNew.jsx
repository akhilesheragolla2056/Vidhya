import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  BookOpen,
  Video,
  FileText,
  HelpCircle,
  Play,
  CheckCircle2,
  Clock,
  BarChart3,
  Award,
  Star,
  Users,
  ChevronRight,
} from 'lucide-react'

import VideoLesson from '../components/course/VideoLesson'
import TheoryNotes from '../components/course/TheoryNotes'
import MCQQuiz from '../components/course/MCQQuiz'
import LoadingSpinner from '../components/ui/LoadingSpinner'

import { getCourseById } from '../data/coursesData'
import {
  getCourseProgress,
  markVideoWatched,
  markNotesRead,
  saveMCQResults,
  calculateProgress,
  isLessonCompleted,
  areNotesRead,
  getMCQScore,
} from '../utils/progressTracker'

/**
 * Enhanced Course Detail Page
 * Complete learning experience with videos, notes, MCQs, and progress tracking
 */
export default function CourseDetailNew() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [course, setCourse] = useState(null)
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('video')
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load course data
  useEffect(() => {
    const courseData = getCourseById(id)
    if (courseData) {
      setCourse(courseData)
      const progressData = getCourseProgress(id)
      setProgress(progressData)
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [id])

  // Update progress percentage whenever progress changes
  useEffect(() => {
    if (course && progress) {
      calculateProgress(id, course.playlist.length)
    }
  }, [course, progress, id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-light">
        <LoadingSpinner />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-light">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Course Not Found</h2>
          <p className="text-text-secondary mb-6">The course you're looking for doesn't exist.</p>
          <Link to="/courses" className="btn-primary">
            Browse Courses
          </Link>
        </div>
      </div>
    )
  }

  const currentLesson = course.playlist[currentLessonIndex]
  const totalLessons = course.playlist.length
  const overallProgress = calculateProgress(id, totalLessons)
  const lessonCompleted = isLessonCompleted(id, currentLesson.id)
  const notesRead = areNotesRead(id, currentLesson.id)
  const mcqScore = getMCQScore(id, currentLesson.id)

  // Handlers
  const handleVideoComplete = (lessonId, percentage) => {
    const updatedProgress = markVideoWatched(id, lessonId, percentage)
    setProgress({ ...updatedProgress })
  }

  const handleNotesRead = lessonId => {
    const updatedProgress = markNotesRead(id, lessonId)
    setProgress({ ...updatedProgress })
  }

  const handleMCQComplete = (lessonId, score, total) => {
    const updatedProgress = saveMCQResults(id, lessonId, score, total)
    setProgress({ ...updatedProgress })
  }

  const handleNextLesson = () => {
    if (currentLessonIndex < totalLessons - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1)
      setActiveTab('video')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1)
      setActiveTab('video')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const tabs = [
    { id: 'video', label: 'Video Lesson', icon: Video },
    { id: 'notes', label: 'Theory Notes', icon: FileText },
    { id: 'quiz', label: 'MCQ Quiz', icon: HelpCircle },
  ]

  return (
    <div className="min-h-screen bg-surface-light">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/courses')}
              className="flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors"
            >
              <ArrowLeft size={18} />
              Back to Courses
            </button>

            {/* Progress Badge */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                <BarChart3 size={16} className="text-primary" />
                <span className="text-sm font-bold text-primary">{overallProgress}% Complete</span>
              </div>

              {overallProgress === 100 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full">
                  <Award size={16} className="text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-600">Completed!</span>
                </div>
              )}
            </div>
          </div>

          {/* Course Info */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                  {course.category}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    course.difficulty === 'Beginner'
                      ? 'bg-teal/20 text-teal'
                      : course.difficulty === 'Intermediate'
                        ? 'bg-coral/20 text-coral'
                        : 'bg-primary/20 text-primary'
                  }`}
                >
                  {course.difficulty}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                {course.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{course.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>{course.enrolledCount.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen size={14} />
                  <span>{totalLessons} lessons</span>
                </div>
              </div>
            </div>

            {/* Instructor */}
            <div className="flex items-center gap-3">
              <img
                src={course.instructorAvatar}
                alt={course.instructor}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="text-xs text-text-secondary">Instructor</p>
                <p className="font-semibold text-text-primary">{course.instructor}</p>
              </div>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-secondary">
                Course Progress: {progress?.completedLessons?.length || 0} / {totalLessons} lessons
              </span>
              <span className="text-xs font-semibold text-primary">{overallProgress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-primary to-accent-cyan rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Playlist Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-24">
              <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-4">
                <h3 className="font-bold flex items-center gap-2">
                  <BookOpen size={18} />
                  Course Playlist
                </h3>
                <p className="text-xs text-white/80 mt-1">
                  {currentLessonIndex + 1} of {totalLessons} lessons
                </p>
              </div>

              <div className="max-h-[600px] overflow-y-auto">
                {course.playlist.map((lesson, index) => {
                  const isActive = index === currentLessonIndex
                  const isComplete = isLessonCompleted(id, lesson.id)

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        setCurrentLessonIndex(index)
                        setActiveTab('video')
                      }}
                      className={`w-full text-left p-4 border-b border-gray-100 hover:bg-surface-light transition-colors ${
                        isActive ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {isComplete ? (
                            <CheckCircle2 size={20} className="text-emerald-600" />
                          ) : (
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              <span className="text-xs font-bold">{index + 1}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4
                            className={`font-semibold text-sm mb-1 ${
                              isActive ? 'text-primary' : 'text-text-primary'
                            }`}
                          >
                            {lesson.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-text-secondary">
                            <Clock size={12} />
                            <span>{lesson.duration}</span>
                          </div>
                        </div>

                        {isActive && <Play size={16} className="text-primary flex-shrink-0 mt-1" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Lesson Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-text-primary mb-2">
                    {currentLesson.title}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Clock size={14} />
                    <span>{currentLesson.duration}</span>
                    {lessonCompleted && (
                      <>
                        <span className="text-gray-300">•</span>
                        <CheckCircle2 size={14} className="text-emerald-600" />
                        <span className="text-emerald-600 font-semibold">Completed</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Lesson Status Badges */}
                <div className="flex gap-2">
                  {notesRead && (
                    <div className="px-3 py-1 bg-blue-50 rounded-full">
                      <span className="text-xs font-semibold text-blue-600">Notes Read</span>
                    </div>
                  )}
                  {mcqScore && (
                    <div
                      className={`px-3 py-1 rounded-full ${
                        mcqScore.percentage >= 60 ? 'bg-emerald-50' : 'bg-red-50'
                      }`}
                    >
                      <span
                        className={`text-xs font-semibold ${
                          mcqScore.percentage >= 60 ? 'text-emerald-600' : 'text-red-600'
                        }`}
                      >
                        Quiz: {mcqScore.percentage}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 border-b border-gray-200">
                {tabs.map(tab => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'border-primary text-primary'
                          : 'border-transparent text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              {activeTab === 'video' && (
                <VideoLesson
                  videoUrl={currentLesson.videoUrl}
                  lessonId={currentLesson.id}
                  courseId={id}
                  onComplete={handleVideoComplete}
                  onNext={handleNextLesson}
                  hasNext={currentLessonIndex < totalLessons - 1}
                />
              )}

              {activeTab === 'notes' && (
                <TheoryNotes
                  notes={currentLesson.notes}
                  lessonId={currentLesson.id}
                  courseId={id}
                  onMarkRead={handleNotesRead}
                  isRead={notesRead}
                />
              )}

              {activeTab === 'quiz' && (
                <MCQQuiz
                  mcqs={currentLesson.mcqs}
                  lessonId={currentLesson.id}
                  courseId={id}
                  onComplete={handleMCQComplete}
                  previousScore={mcqScore}
                />
              )}
            </motion.div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevLesson}
                disabled={currentLessonIndex === 0}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-text-primary rounded-xl font-semibold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={18} />
                Previous Lesson
              </button>

              <button
                onClick={handleNextLesson}
                disabled={currentLessonIndex === totalLessons - 1}
                className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Lesson
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
