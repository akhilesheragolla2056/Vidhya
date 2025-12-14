import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { coursesAPI, analyticsAPI } from '../services/api'
import { BookOpen, FlaskConical, Bot, BarChart3, Flame, Zap, Trophy, Target, ArrowRight, Star, Clock, Award, TrendingUp } from 'lucide-react'

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
      to={`/courses/${course.id}`}
      className="bg-white rounded-2xl border border-gray-100 hover:shadow-lg hover:border-primary/20 transition-all overflow-hidden group"
    >
      <div className="h-36 bg-gradient-to-br from-primary to-primary-dark relative">
        {course.thumbnail && (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        )}
        <div className="absolute bottom-3 right-3 bg-white/95 px-3 py-1.5 rounded-full text-xs font-semibold text-primary">
          {course.progress}% complete
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-text-primary mb-2 line-clamp-1 group-hover:text-primary transition-colors">{course.title}</h3>
        <div className="flex items-center gap-2 text-sm text-text-secondary mb-4">
          <BookOpen size={16} />
          <span>{course.lessonsCompleted} / {course.totalLessons} lessons</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent-cyan rounded-full transition-all duration-500"
            style={{ width: `${course.progress}%` }}
          />
        </div>
      </div>
    </Link>
  )
}

function QuickAction({ icon: Icon, label, to, color }) {
  const colorClasses = {
    primary: 'bg-primary hover:bg-primary-dark',
    cyan: 'bg-accent-cyan hover:bg-accent-cyan/80',
    pink: 'bg-accent-pink hover:bg-accent-pink/80',
    orange: 'bg-accent-orange hover:bg-accent-orange/80',
  }

  return (
    <Link
      to={to}
      className={`flex flex-col items-center p-5 rounded-2xl ${colorClasses[color]} transition-all group`}
    >
      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
        <Icon size={24} className="text-white" />
      </div>
      <span className="text-sm font-semibold text-white">{label}</span>
    </Link>
  )
}

function StatCard({ icon: Icon, value, label, trend }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon size={20} className="text-primary" />
        </div>
        {trend && (
          <span className="text-xs font-medium text-green-600 flex items-center gap-1">
            <TrendingUp size={12} />
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
      <p className="text-sm text-text-secondary">{label}</p>
    </div>
  )
}

function Dashboard() {
  const { currentUser, progress } = useSelector((state) => state.user)

  const { data: enrolledCourses = [], isLoading: coursesLoading, isError: coursesError } = useQuery({
    queryKey: ['enrolledCourses'],
    queryFn: async () => {
      try {
        const res = await coursesAPI.getEnrolled()
        return res.data || []
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
        return res.data || {}
      } catch (error) {
        console.error('Failed to fetch insights:', error)
        return {}
      }
    },
    enabled: !!currentUser,
    retry: 1,
  })

  const mockCourses = [
    { id: 1, title: 'Introduction to Python', progress: 65, lessonsCompleted: 13, totalLessons: 20 },
    { id: 2, title: 'Web Development Fundamentals', progress: 40, lessonsCompleted: 8, totalLessons: 20 },
    { id: 3, title: 'Data Science Basics', progress: 20, lessonsCompleted: 4, totalLessons: 20 },
  ]

  const displayCourses = enrolledCourses.length > 0 ? enrolledCourses : mockCourses

  const achievements = [
    { icon: Trophy, title: 'First Steps', desc: 'Completed your first lesson', color: 'text-accent-yellow' },
    { icon: Flame, title: 'On Fire', desc: '5 day learning streak', color: 'text-accent-orange' },
    { icon: FlaskConical, title: 'Lab Explorer', desc: 'First VR experiment completed', color: 'text-accent-cyan' },
  ]

  return (
    <div className="min-h-screen bg-surface-light">
      <div className="bg-gradient-to-br from-primary via-primary to-primary-dark text-white py-10">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star size={20} className="text-accent-yellow" />
                <span className="text-sm font-medium text-white/80">Welcome back</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">
                {currentUser?.name || 'Learner'}
              </h1>
              <p className="text-white/70">
                Continue your learning journey. You're making great progress!
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Flame size={18} className="text-accent-orange" />
                  <span className="text-2xl font-bold">{progress?.streakDays || 5}</span>
                </div>
                <span className="text-white/70 text-sm">day streak</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={18} className="text-accent-yellow" />
                  <span className="text-2xl font-bold">{progress?.totalXP || 1250}</span>
                </div>
                <span className="text-white/70 text-sm">total XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <QuickAction icon={BookOpen} label="Browse Courses" to="/courses" color="primary" />
          <QuickAction icon={FlaskConical} label="Virtual Labs" to="/lab/chemistry" color="cyan" />
          <QuickAction icon={Bot} label="AI Tutor" to="/ai-tutor" color="pink" />
          <QuickAction icon={BarChart3} label="My Progress" to="/profile" color="orange" />
        </div>

        <div className="grid lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={BookOpen} value="12" label="Courses enrolled" trend="+2 this month" />
          <StatCard icon={Clock} value="48h" label="Total learning time" trend="+5h this week" />
          <StatCard icon={Award} value="8" label="Certificates earned" />
          <StatCard icon={Target} value="85%" label="Avg. completion rate" trend="+12%" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-text-primary">Continue Learning</h2>
                <Link to="/courses" className="text-primary hover:text-primary-dark text-sm font-semibold flex items-center gap-1 transition-colors">
                  View all
                  <ArrowRight size={16} />
                </Link>
              </div>
              
              {coursesLoading ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {[1, 2].map(i => (
                    <div key={i} className="bg-white rounded-2xl h-56 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {displayCourses.slice(0, 4).map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-primary mb-5">Recommended For You</h2>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:border-primary/20 transition-all">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent-orange to-accent-yellow rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target size={28} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-text-primary text-lg mb-1">Machine Learning Fundamentals</h3>
                    <p className="text-text-secondary mb-4">
                      Based on your progress in Python, you're ready for this course!
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium">
                        Beginner Friendly
                      </span>
                      <span className="text-xs text-text-muted flex items-center gap-1">
                        <Clock size={12} />
                        12 hours
                      </span>
                      <span className="text-xs text-text-muted flex items-center gap-1">
                        <BookOpen size={12} />
                        24 lessons
                      </span>
                    </div>
                  </div>
                  <Link 
                    to="/courses/ml-fundamentals"
                    className="btn-primary text-sm px-5 py-2.5 flex-shrink-0"
                  >
                    Start
                  </Link>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-semibold text-text-primary mb-5">Weekly Goal</h3>
              <div className="flex items-center gap-5">
                <ProgressRing progress={70} />
                <div>
                  <p className="text-3xl font-bold text-text-primary">7/10</p>
                  <p className="text-sm text-text-secondary">lessons completed</p>
                </div>
              </div>
              <div className="mt-5 p-4 bg-primary/5 rounded-xl">
                <p className="text-sm text-text-secondary">
                  <span className="font-semibold text-primary">3 more lessons</span> to reach your weekly goal!
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-semibold text-text-primary mb-5">Recent Achievements</h3>
              <div className="space-y-3">
                {achievements.map((badge, i) => {
                  const Icon = badge.icon
                  return (
                    <div key={i} className="flex items-center gap-4 p-3 bg-surface-light rounded-xl hover:bg-primary/5 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <Icon size={20} className={badge.color} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{badge.title}</p>
                        <p className="text-xs text-text-muted">{badge.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <Link 
                to="/profile#achievements"
                className="flex items-center justify-center gap-1 text-primary text-sm font-semibold mt-5 hover:text-primary-dark transition-colors"
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
              <p className="text-sm text-white/80 mb-5">
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
