import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { coursesAPI, analyticsAPI } from '../services/api'
import {
  BookOpen,
  FlaskConical,
  Bot,
  BarChart3,
  Trophy,
  Target,
  ArrowRight,
  Clock,
  Award,
  TrendingUp,
} from 'lucide-react'

function ProgressRing({ progress, size = 80, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        className="text-gray-100"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        className="text-primary transition-all duration-500"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
    </svg>
  )
}

function CourseCard({ course }) {
  return (
    <Link
      to={`/courses/${course.id || course._id}`}
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

function Dashboard() {
  const { currentUser } = useSelector(state => state.user)

  console.log('Dashboard mounted, currentUser:', currentUser)

  const {
    data: enrolledCourses = [],
    isLoading: coursesLoading,
    isError: coursesError,
  } = useQuery({
    queryKey: ['enrolledCourses'],
    queryFn: async () => {
      try {
        console.log('Fetching enrolled courses...')
        const res = await coursesAPI.getEnrolled()
        console.log('Enrolled courses response:', res)
        // Handle different response structures
        let courses = res.data || []
        // If courses is an object (not array), try to extract courses array
        if (courses && typeof courses === 'object' && !Array.isArray(courses)) {
          courses = courses.courses || courses.data || []
        }
        console.log('Extracted courses array:', courses)
        return Array.isArray(courses) ? courses : []
      } catch (error) {
        console.error('Failed to fetch enrolled courses:', error)
        return []
      }
    },
    enabled: !!currentUser,
    retry: 1,
  })

  const { data: insights = {}, isError: insightsError } = useQuery({
    queryKey: ['learningInsights'],
    queryFn: async () => {
      try {
        const res = await analyticsAPI.getLearningInsights()
        return res.data?.data || {}
      } catch (error) {
        console.error('Failed to fetch insights:', error)
        return {}
      }
    },
    enabled: !!currentUser,
    retry: 1,
  })

  const { data: progressSummary = {} } = useQuery({
    queryKey: ['learningProgress'],
    queryFn: async () => {
      try {
        const { default: api } = await import('../services/api')
        const res = await api.get(`/progress/user/${currentUser._id}`)
        return res.data || {}
      } catch (e) {
        return {}
      }
    },
    enabled: !!currentUser,
    retry: 1,
  })

  const displayCourses = Array.isArray(enrolledCourses) ? enrolledCourses : []

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
  const totalLearningHours = summary.totalLearningHours ?? 0
  const certificatesEarned = Array.isArray(progressSummary?.certificates)
    ? progressSummary.certificates.length
    : (summary.certificatesEarned ?? 0)
  const achievements = insights.achievements || []
  const recommendations = insights.recommendations || []
  const weeklyGoal = progressSummary?.data?.weeklyGoal

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
          <StatCard icon={Clock} value={`${totalLearningHours}h`} label="Learning Hours" />
          <StatCard icon={Award} value={certificatesEarned} label="Certificates" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <QuickAction icon={Bot} label="AI Tutor" to="/ai-tutor" color="primary" />
          <QuickAction icon={BarChart3} label="My Progress" to="/profile" color="orange" />
          <QuickAction icon={FlaskConical} label="Science Lab" to="/science-lab" color="cyan" />
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
              {recommendations.length === 0 ? (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                  <Target size={40} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-text-secondary text-sm">
                    Complete some lessons to get personalized recommendations
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-sm transition-all cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <Target size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-text-primary mb-1">{rec.title}</h3>
                        {rec.desc && (
                          <p className="text-sm text-text-secondary line-clamp-2">{rec.desc}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-semibold text-text-primary mb-4">Weekly Goal</h3>
              {weeklyGoal ? (
                <div className="flex items-center gap-4">
                  <ProgressRing progress={weeklyGoal.progress || 0} />
                  <div>
                    <p className="text-3xl font-bold text-text-primary">
                      {weeklyGoal.completed ?? 0}/{weeklyGoal.target ?? 0}
                    </p>
                    <p className="text-sm text-text-secondary">lessons completed</p>
                  </div>
                </div>
              ) : (
                <p className="text-text-secondary">Set a weekly goal to track your progress.</p>
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
                to="/ai-tutor"
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

export default Dashboard