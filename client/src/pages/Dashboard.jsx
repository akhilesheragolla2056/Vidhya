import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import api, { coursesAPI } from '../services/api'
import { coursesData } from '../data/coursesData'
import { getAllProgress, PROGRESS_STORAGE_KEY } from '../utils/progressTracker'
import { LEARNING_PROGRESS_UPDATED_EVENT } from '../utils/learningProgressEvents'
import TeacherDashboard from './TeacherDashboard'
import ParentDashboard from './ParentDashboard'
import {
  BookOpen,
  FlaskConical,
  Bot,
  Puzzle,
  BarChart3,
  Trophy,
  Target,
  ArrowRight,
  Clock,
  Award,
  TrendingUp,
} from 'lucide-react'

const LIVE_REFRESH_INTERVAL = 20_000

function readLocalCourseProgress() {
  const savedProgress = getAllProgress()

  return coursesData.map(course => {
    const progress = savedProgress[course.id] || {}
    const mcqScores = progress.mcqScores || {}
    const lessonsCompleted = course.playlist.filter(
      lesson => Number(mcqScores[lesson.id]?.percentage) >= 60
    ).length
    const totalLessons = course.playlist.length
    const percentage = totalLessons ? Math.round((lessonsCompleted / totalLessons) * 100) : 0
    const activeSeconds = Math.max(0, Number(progress.activeSeconds) || 0)
    const started = Boolean(
      progress.startedAt || progress.lastAccessed || activeSeconds || lessonsCompleted
    )

    return {
      ...course,
      href: `/course/${course.id}`,
      progress: percentage,
      lessonsCompleted,
      totalLessons,
      activeSeconds,
      started,
      certificateEarned: totalLessons > 0 && lessonsCompleted === totalLessons,
    }
  })
}

function CourseCard({ course }) {
  return (
    <Link
      to={course.href || `/courses/${course.id || course._id}`}
      className="block bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-primary/30 transition-all overflow-hidden group"
    >
      <div className="h-32 bg-gradient-to-br from-primary/10 to-accent-cyan/10 relative">
        {course.thumbnail && (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        {course.progress > 0 && (
          <div className="absolute bottom-2 right-2 bg-white px-2.5 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
            {course.progress ?? 0}%
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-text-primary mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-text-secondary mb-3">
          <BookOpen size={14} />
          <span>
            {course.lessonsCompleted ?? 0} / {course.totalLessons ?? 0} lessons
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${course.progress ?? 0}%` }} />
        </div>
      </div>
    </Link>
  )
}

function QuickAction({ icon: Icon, label, to, color }) {
  const colorClasses = {
    primary: 'from-primary to-primary-dark',
    cyan: 'from-cyan-500 to-cyan-600',
    pink: 'from-pink-500 to-pink-600',
    orange: 'from-orange-500 to-orange-600',
  }

  return (
    <Link
      to={to}
      className={`flex flex-col items-center p-4 rounded-lg bg-gradient-to-br ${colorClasses[color]} text-white hover:shadow-lg transition-all group`}
    >
      <Icon size={24} className="mb-2 group-hover:scale-110 transition-transform" />
      <span className="text-xs font-semibold">{label}</span>
    </Link>
  )
}

function StatCard({ icon: Icon, value, label, trend }) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
          <Icon size={22} className="text-primary" />
        </div>
        {trend && (
          <span className="text-xs font-bold text-green-600 flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
            <TrendingUp size={14} />
            {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-text-primary mb-1">{value}</p>
      <p className="text-sm text-text-secondary font-medium">{label}</p>
    </div>
  )
}

function StudentDashboard() {
  const { currentUser } = useSelector(state => state.user)
  const currentUserId = currentUser?._id || currentUser?.id
  const queryClient = useQueryClient()

  const { data: localCourseProgress = [] } = useQuery({
    queryKey: ['dashboardLocalCourses', currentUserId],
    queryFn: readLocalCourseProgress,
    enabled: !!currentUserId,
    staleTime: 0,
    refetchInterval: 5000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  })

  const {
    data: enrolledCourses = [],
    isLoading: coursesLoading,
    isError: coursesError,
  } = useQuery({
    queryKey: ['enrolledCourses', currentUserId],
    queryFn: async () => {
      const res = await coursesAPI.getEnrolled()
      return Array.isArray(res.data?.data) ? res.data.data : []
    },
    enabled: !!currentUserId,
    retry: 1,
    staleTime: 0,
    refetchInterval: LIVE_REFRESH_INTERVAL,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })

  const { data: recommendations = [] } = useQuery({
    queryKey: ['courseRecommendations', currentUserId],
    queryFn: async () => {
      const response = await coursesAPI.getRecommendations()
      return Array.isArray(response.data?.data) ? response.data.data : []
    },
    enabled: !!currentUserId,
    retry: 1,
    staleTime: 0,
    refetchInterval: LIVE_REFRESH_INTERVAL,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })

  const { data: progressSummary = {} } = useQuery({
    queryKey: ['learningProgress', currentUserId],
    queryFn: async () => {
      try {
        const res = await api.get(`/progress/user/${currentUserId}`)
        return { data: res.data?.data || null, summary: res.data?.summary || {} }
      } catch {
        return { data: null, summary: {} }
      }
    },
    enabled: !!currentUserId,
    retry: 1,
    staleTime: 0,
    refetchInterval: LIVE_REFRESH_INTERVAL,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })

  const { data: serverCertificates = [] } = useQuery({
    queryKey: ['dashboardCertificates', currentUserId],
    queryFn: async () => {
      const response = await api.get('/progress/certificates/user')
      return Array.isArray(response.data?.data) ? response.data.data : []
    },
    enabled: !!currentUserId,
    retry: 1,
    staleTime: 0,
    refetchInterval: LIVE_REFRESH_INTERVAL,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })

  useEffect(() => {
    const refreshDashboard = event => {
      void queryClient.invalidateQueries({ queryKey: ['dashboardLocalCourses', currentUserId] })
      if (event?.detail?.activity === 'learning-time') return
      void queryClient.invalidateQueries({ queryKey: ['enrolledCourses', currentUserId] })
      void queryClient.invalidateQueries({ queryKey: ['courseRecommendations', currentUserId] })
      void queryClient.invalidateQueries({ queryKey: ['learningProgress', currentUserId] })
      void queryClient.invalidateQueries({ queryKey: ['dashboardCertificates', currentUserId] })
    }
    const refreshForOtherTab = event => {
      if (!event.key || event.key.startsWith(PROGRESS_STORAGE_KEY)) refreshDashboard()
    }

    window.addEventListener(LEARNING_PROGRESS_UPDATED_EVENT, refreshDashboard)
    window.addEventListener('storage', refreshForOtherTab)
    return () => {
      window.removeEventListener(LEARNING_PROGRESS_UPDATED_EVENT, refreshDashboard)
      window.removeEventListener('storage', refreshForOtherTab)
    }
  }, [currentUserId, queryClient])

  const serverCourses = Array.isArray(enrolledCourses)
    ? enrolledCourses.map(course => {
        const id = course.id || course._id
        return { ...course, id, href: `/courses/${id}` }
      })
    : []
  const serverCourseIds = new Set(serverCourses.map(course => String(course.id)))
  const localStartedCourses = localCourseProgress.filter(course => course.started)
  const displayCourses = [
    ...serverCourses,
    ...localStartedCourses.filter(course => !serverCourseIds.has(String(course.id))),
  ]

  const courseTotals = Array.isArray(displayCourses)
    ? displayCourses.reduce(
        (acc, course) => {
          acc.totalLessons += course.totalLessons || 0
          acc.completedLessons += course.lessonsCompleted || 0
          acc.totalProgress += course.progress || 0
          return acc
        },
        { totalLessons: 0, completedLessons: 0, totalProgress: 0 }
      )
    : { totalLessons: 0, completedLessons: 0, totalProgress: 0 }

  const avgCompletion = displayCourses.length
    ? Math.round(courseTotals.totalProgress / displayCourses.length)
    : 0

  const summary = progressSummary?.summary || {}
  const totalCoursesEnrolled = displayCourses.length
  const serverLearningHours = Number(summary.totalLearningHours ?? summary.totalHoursLearned ?? 0)
  const localLearningSeconds = localCourseProgress.reduce(
    (total, course) => total + course.activeSeconds,
    0
  )
  const totalLearningSeconds = serverLearningHours * 3600 + localLearningSeconds
  const learningTimeDisplay = totalLearningSeconds < 60
    ? `${Math.floor(totalLearningSeconds)}s`
    : totalLearningSeconds < 3600
      ? `${Math.floor(totalLearningSeconds / 60)}m`
      : `${(totalLearningSeconds / 3600).toFixed(1)}h`
  const serverCertificateIds = new Set(
    serverCertificates
      .map(certificate => certificate.course?._id || certificate.course)
      .filter(Boolean)
      .map(String)
  )
  const localCertificateCount = localCourseProgress.filter(
    course => course.certificateEarned && !serverCertificateIds.has(String(course.id))
  ).length
  const certificatesEarned = Math.max(
    serverCertificateIds.size,
    Number(summary.certificatesEarned) || 0
  ) + localCertificateCount

  const displayRecommendations = (() => {
    const enrolledIds = new Set(displayCourses.map(course => String(course.id || course._id)))
    localStartedCourses.forEach(course => enrolledIds.add(String(course.id)))

    const categoryCounts = new Map()
    displayCourses.forEach(course => {
      if (course.category) {
        categoryCounts.set(course.category, (categoryCounts.get(course.category) || 0) + 1)
      }
    })
    const interests = new Set(currentUser?.learningProfile?.interests || [])
    const localRecommendations = coursesData
      .filter(course => !enrolledIds.has(String(course.id)))
      .map(course => ({
        ...course,
        _id: course.id,
        href: `/course/${course.id}`,
        recommendationScore:
          (categoryCounts.get(course.category) || 0) * 10 +
          (interests.has(course.category) ? 5 : 0) +
          (Number(course.rating) || 0),
      }))
      .sort((left, right) => right.recommendationScore - left.recommendationScore)

    const serverRecommendations = (recommendations || []).map(course => {
      const id = course._id || course.id
      return { ...course, _id: id, href: `/courses/${id}` }
    })
    const seen = new Set()
    return [...serverRecommendations, ...localRecommendations]
      .filter(course => {
        const id = String(course._id || course.id)
        if (!id || enrolledIds.has(id) || seen.has(id)) return false
        seen.add(id)
        return true
      })
      .slice(0, 6)
  })()
  const achievements = (currentUser?.progress?.badges || []).map(badge => ({
    title: typeof badge === 'string' ? badge : badge.title,
    desc: typeof badge === 'string' ? 'Achievement earned' : badge.description || 'Achievement earned',
    icon: Trophy,
    color: 'text-amber-600',
  }))
  const currentStreak = summary.currentStreak || 0

  return (
    <div className="min-h-screen bg-surface-bg">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-1">My learning</h1>
          <p className="text-text-secondary">
            Welcome back{currentUser?.name ? `, ${currentUser.name}` : ''}
          </p>
        </div>
      </div>

      <div className="container-custom py-8 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={BookOpen} value={`${avgCompletion}%`} label="Avg. Completion" />
          <StatCard icon={FlaskConical} value={totalCoursesEnrolled} label="Courses Enrolled" />
          <StatCard icon={Clock} value={learningTimeDisplay} label="Learning Time" />
          <StatCard icon={Award} value={certificatesEarned} label="Certificates" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <QuickAction icon={Bot} label="AI Tutor" to="/chat" color="primary" />
          <QuickAction icon={Puzzle} label="Games Hub" to="/games" color="primary" />
          <QuickAction icon={BarChart3} label="My Progress" to="/profile" color="orange" />
          <QuickAction icon={FlaskConical} label="Science Lab" to="/science-lab" color="cyan" />
          <QuickAction icon={Puzzle} label="Math Sprint" to="/games/math-sprint" color="primary" />
          <QuickAction icon={Award} label="Certificates" to="/certificates" color="pink" />
          <QuickAction icon={Target} label="Mock Tests" to="/mock-tests" color="orange" />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Continue Learning Section */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-text-primary">Continue Learning</h2>
                <Link
                  to="/courses"
                  className="text-primary hover:text-primary-dark text-sm font-bold flex items-center gap-1 transition-colors"
                >
                  All courses
                  <ArrowRight size={16} />
                </Link>
              </div>
              {coursesLoading ? (
                <div className="text-center py-8">
                  <p className="text-text-secondary">Loading your courses...</p>
                </div>
              ) : displayCourses.length === 0 ? (
                <div className="text-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-lg">
                  <BookOpen size={48} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-text-primary font-semibold mb-1">
                    Start your learning journey
                  </p>
                  <p className="text-sm text-text-secondary mb-4">
                    Explore our courses and enroll to begin
                  </p>
                  <Link to="/courses" className="btn-primary inline-flex">
                    Browse Courses
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {displayCourses.slice(0, 4).map(course => (
                    <CourseCard key={course.id || course._id} course={course} />
                  ))}
                </div>
              )}
              {coursesError && (
                <p className="text-sm text-red-600 mt-3 bg-red-50 p-3 rounded">
                  Failed to load courses. Please try again.
                </p>
              )}
            </section>

            {/* Recommended Section */}
            <section className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-text-primary mb-4">Recommended For You</h2>
              {displayRecommendations.length === 0 ? (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                  <Target size={40} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-text-secondary text-sm">
                    You have explored all available courses. Check back as new courses are added.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {displayRecommendations.map(rec => (
                    <Link
                      key={rec._id || rec.id}
                      to={rec.href || `/courses/${rec._id || rec.id}`}
                      className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 transition-all hover:border-primary hover:shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <Target size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-text-primary mb-1">{rec.title}</h3>
                        <p className="text-sm text-text-secondary line-clamp-2">{rec.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-semibold text-text-primary mb-4">Current learning streak</h3>
              {currentStreak ? (
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-3xl font-bold text-text-primary">{currentStreak} days</p>
                    <p className="text-sm text-text-secondary">Keep learning to continue it.</p>
                  </div>
                </div>
              ) : (
                <p className="text-text-secondary">Complete a lesson today to start your streak.</p>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-semibold text-text-primary mb-4">Recent Achievements</h3>
              {achievements.length === 0 ? (
                <p className="text-text-secondary">
                  Earn achievements by completing lessons and tests.
                </p>
              ) : (
                <div className="space-y-3">
                  {achievements.map((badge, i) => {
                    const Icon = badge.icon || Trophy
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-3 bg-surface-light rounded-xl hover:bg-primary/5 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                          <Icon size={20} className={badge.color || 'text-primary'} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-text-primary">{badge.title}</p>
                          <p className="text-xs text-text-muted">{badge.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
              <Link
                to="/profile#achievements"
                className="flex items-center justify-center gap-1 text-primary text-sm font-semibold mt-4 hover:text-primary-dark transition-colors"
              >
                View all badges
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Bot size={20} />
                </div>
                <h3 className="font-semibold">Need Help?</h3>
              </div>
              <p className="text-sm text-white/80 mb-4">
                Ask our AI Tutor any question. It will guide you without giving away the answer!
              </p>
              <Link
                to="/chat"
                className="block w-full text-center bg-white text-primary font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Start Chat
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const currentUser = useSelector(state => state.user.currentUser)
  if (currentUser?.role === 'teacher') return <TeacherDashboard />
  if (currentUser?.role === 'parent') return <ParentDashboard />
  return <StudentDashboard />
}
