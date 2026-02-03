import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Play,
  CheckCircle2,
  Lock,
  Clock,
  BookOpen,
  Users,
  Star,
  ArrowLeft,
  Trophy,
  Target,
  Sparkles,
  Download,
  ClipboardList,
} from 'lucide-react'
import coursesAPI, { lessonsAPI } from '../services/api'
import YouTubeTracker from '../components/video/YouTubeTracker'
import LoadingSpinner from '../components/ui/LoadingSpinner'

// Helper to convert YouTube URLs to embed URLs
function getEmbedUrl(lesson) {
  if (!lesson?.content?.videoUrl) return null
  const url = lesson.content.videoUrl

  if (url.includes('youtube.com/watch')) {
    const videoId = new URL(url).searchParams.get('v')
    return `https://www.youtube.com/embed/${videoId}`
  } else if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1].split('?')[0]
    return `https://www.youtube.com/embed/${videoId}`
  }

  return url
}

function useCourseData(courseId, isAuthenticated) {
  const courseQuery = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const res = await coursesAPI.getById(courseId)
      return res.data?.data
    },
    enabled: !!courseId,
  })

  const progressQuery = useQuery({
    queryKey: ['courseProgress', courseId],
    queryFn: async () => {
      const res = await coursesAPI.getProgress(courseId)
      return res.data?.data
    },
    enabled: isAuthenticated && !!courseId,
  })

  return { courseQuery, progressQuery }
}

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, currentUser } = useSelector(state => state.user)
  const queryClient = useQueryClient()

  const [selectedModule, setSelectedModule] = useState(0)
  const [selectedLesson, setSelectedLesson] = useState(0)

  const { courseQuery, progressQuery } = useCourseData(id, isAuthenticated)
  const testsQuery = useQuery({
    queryKey: ['courseTests', id],
    queryFn: async () => {
      const { default: api } = await import('../services/api')
      const res = await api.get(`/tests/course/${id}`)
      return res.data?.data || []
    },
    enabled: isAuthenticated && !!id,
  })

  const enrollMutation = useMutation({
    mutationFn: () => coursesAPI.enroll(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['course', id])
      queryClient.invalidateQueries(['courseProgress', id])
    },
  })

  const markCompleteMutation = useMutation({
    mutationFn: lessonId => lessonsAPI.complete(id, lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries(['courseProgress', id])
      queryClient.invalidateQueries(['course', id])
    },
  })

  const course = courseQuery.data
  const progress = progressQuery.data || course?.userProgress
  const isEnrolled = Boolean(progress)

  const currentModule = course?.modules?.[selectedModule]
  const currentLesson = currentModule?.lessons?.[selectedLesson]
  const embedUrl = getEmbedUrl(currentLesson)

  const totalLessons =
    course?.modules?.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0) || 0
  const completedCount = progress?.completedLessons?.length || 0
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  const handleEnroll = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    enrollMutation.mutate()
  }

  const handleMarkComplete = () => {
    if (currentLesson && isEnrolled) {
      markCompleteMutation.mutate(currentLesson.id)
    }
  }

  const isLessonCompleted = lessonId => {
    return progress?.completedLessons?.includes(lessonId)
  }

  if (courseQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (courseQuery.isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-text-secondary mb-4">Failed to load course</p>
          <Link to="/courses" className="btn-primary">
            Back to Courses
          </Link>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-text-secondary mb-4">No course data available.</p>
          <Link to="/courses" className="btn-primary">
            Back to Courses
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-light">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-6">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dark mb-4 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Courses
          </Link>

          <div className="flex flex-col lg:flex-row gap-6 justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                  {course.category}
                </span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                  {course.level}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
                {course.title}
              </h1>
              <p className="text-lg text-text-secondary mb-4">{course.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{course.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>{course.students?.toLocaleString() || 0} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen size={16} />
                  <span>{totalLessons} lessons</span>
                </div>
              </div>
            </div>

            {!isEnrolled && (
              <div className="flex items-center">
                <button
                  onClick={handleEnroll}
                  disabled={enrollMutation.isPending}
                  className="btn-primary px-8 py-3 whitespace-nowrap"
                >
                  {enrollMutation.isPending ? 'Enrolling...' : 'Enroll Now'}
                </button>
              </div>
            )}
          </div>

          {isEnrolled && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text-secondary">
                  Your Progress: {completedCount} / {totalLessons} lessons
                </span>
                <span className="text-sm font-semibold text-primary">{progressPercent}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-8">
        {!isEnrolled ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock size={36} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-3">
              Enroll to Access Course Content
            </h2>
            <p className="text-text-secondary mb-6 max-w-md mx-auto">
              Sign up for this course to access all lessons, track your progress, and earn
              certificates.
            </p>
            <button onClick={handleEnroll} className="btn-primary px-8 py-3">
              {isAuthenticated ? 'Enroll Now' : 'Sign In to Enroll'}
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Sidebar - Modules & Lessons */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-primary to-primary-dark text-white">
                  <h3 className="font-bold flex items-center gap-2">
                    <BookOpen size={18} />
                    Course Content
                  </h3>
                </div>

                <div className="max-h-[600px] overflow-y-auto">
                  {course.modules?.map((module, modIdx) => (
                    <div key={module.id} className="border-b border-gray-100 last:border-0">
                      <button
                        onClick={() => {
                          setSelectedModule(modIdx)
                          setSelectedLesson(0)
                        }}
                        className={`w-full text-left p-4 hover:bg-surface-light transition-colors ${
                          selectedModule === modIdx ? 'bg-primary/5' : ''
                        }`}
                      >
                        <p className="font-semibold text-text-primary">{module.title}</p>
                        <p className="text-xs text-text-secondary mt-1">
                          {module.lessons?.length || 0} lessons
                        </p>
                      </button>

                      {selectedModule === modIdx && (
                        <div className="bg-surface-light">
                          {module.lessons?.map((lesson, lessonIdx) => {
                            const isCompleted = isLessonCompleted(lesson.id)
                            const isActive = selectedLesson === lessonIdx

                            return (
                              <button
                                key={lesson.id}
                                onClick={() => setSelectedLesson(lessonIdx)}
                                className={`w-full text-left p-3 pl-8 flex items-center gap-3 hover:bg-white transition-colors ${
                                  isActive ? 'bg-white border-l-4 border-primary' : ''
                                }`}
                              >
                                <div className="flex-shrink-0">
                                  {isCompleted ? (
                                    <CheckCircle2 size={18} className="text-emerald-600" />
                                  ) : (
                                    <Play size={18} className="text-gray-400" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-text-primary truncate">
                                    {lesson.title}
                                  </p>
                                  <p className="text-xs text-text-secondary">{lesson.duration}</p>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Area - Video Player */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                {embedUrl ? (
                  <div>
                    {/* YouTube tracker replaces raw iframe for real-time LMS */}
                    {/* eslint-disable-next-line react/jsx-no-undef */}
                    <YouTubeTracker
                      videoUrl={currentLesson?.content?.videoUrl}
                      courseId={id}
                      lessonId={currentLesson?.id}
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent-cyan/10 flex items-center justify-center">
                    <div className="text-center">
                      <Play size={48} className="text-primary mx-auto mb-3" />
                      <p className="text-text-secondary">No video available for this lesson</p>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <h2 className="text-2xl font-bold text-text-primary mb-2">
                    {currentLesson?.title || 'Select a lesson'}
                  </h2>
                  <p className="text-text-secondary mb-4">
                    {currentLesson?.content?.description ||
                      'Choose a lesson from the sidebar to begin.'}
                  </p>

                  {currentLesson && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleMarkComplete}
                        disabled={
                          markCompleteMutation.isPending || isLessonCompleted(currentLesson.id)
                        }
                        className={`btn-primary flex items-center gap-2 ${
                          isLessonCompleted(currentLesson.id) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <CheckCircle2 size={18} />
                        {isLessonCompleted(currentLesson.id) ? 'Completed' : 'Mark as Complete'}
                      </button>

                      {currentLesson.content?.resources && (
                        <button className="btn-secondary flex items-center gap-2">
                          <Download size={18} />
                          Download Resources
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
                  <Trophy className="text-primary mx-auto mb-2" size={24} />
                  <p className="text-2xl font-bold text-text-primary">{progressPercent}%</p>
                  <p className="text-xs text-text-secondary">Complete</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
                  <Target className="text-emerald-600 mx-auto mb-2" size={24} />
                  <p className="text-2xl font-bold text-text-primary">{completedCount}</p>
                  <p className="text-xs text-text-secondary">Lessons Done</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
                  <Sparkles className="text-accent-cyan mx-auto mb-2" size={24} />
                  <p className="text-2xl font-bold text-text-primary">
                    {totalLessons - completedCount}
                  </p>
                  <p className="text-xs text-text-secondary">Remaining</p>
                </div>
              </div>

              {/* Mock Tests Section */}
              {testsQuery.data && testsQuery.data.length > 0 && (
                <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <ClipboardList className="text-primary" size={24} />
                    <h3 className="text-xl font-bold text-text-primary">
                      Assessment Tests ({testsQuery.data.length})
                    </h3>
                  </div>
                  <div className="grid gap-4">
                    {testsQuery.data.map(test => (
                      <div
                        key={test._id}
                        className="p-4 border border-gray-100 rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-text-primary mb-2">{test.title}</h4>
                            <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
                              <div className="flex items-center gap-1">
                                <Clock size={16} />
                                <span>{test.duration} minutes</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Trophy size={16} />
                                <span>{test.totalPoints} points</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Target size={16} />
                                <span>Pass: {test.passingScore}%</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => navigate(`/test/${test._id}`)}
                            className="btn-primary whitespace-nowrap"
                          >
                            Take Test
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
