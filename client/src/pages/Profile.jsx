import { useSelector } from 'react-redux'
import { useEffect, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAccessibility } from '../hooks/useAccessibility'
import { User, Mail, Calendar, Zap, Flame, Trophy, Award, BookOpen, CheckCircle, Clock, Star, Target, FlaskConical, Users, Lock, Settings, Eye, Type, Focus, Copy, Link2 } from 'lucide-react'
import api, { parentLinksAPI } from '../services/api'
import { coursesData } from '../data/coursesData'
import { getAllProgress, PROGRESS_STORAGE_KEY } from '../utils/progressTracker'
import { LEARNING_PROGRESS_UPDATED_EVENT } from '../utils/learningProgressEvents'

function getLocalProfileCourses(savedProgress) {
  return coursesData.map(course => {
    const progress = savedProgress[course.id] || {}
    const completedIds = new Set(Array.isArray(progress.completedLessons) ? progress.completedLessons : [])
    course.playlist.forEach(lesson => {
      if (Number(progress.mcqScores?.[lesson.id]?.percentage) >= 60) completedIds.add(lesson.id)
    })
    const lessonsCompleted = Math.min(course.playlist.length, completedIds.size)
    return {
      id: course.id,
      title: course.title,
      lessonsCompleted,
      completed: course.playlist.length > 0 && lessonsCompleted >= course.playlist.length,
      activeSeconds: Math.max(0, Number(progress.activeSeconds) || 0),
      lastAccessed: progress.lastAccessed,
      started: Boolean(progress.startedAt || progress.lastAccessed || lessonsCompleted),
    }
  })
}

function relativeTime(value) {
  const timestamp = new Date(value).getTime()
  if (!Number.isFinite(timestamp)) return ''
  const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60_000))
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function Profile() {
  const currentUser = useSelector(state => state.user.currentUser)
  const { settings, toggleDyslexia, toggleFocus, toggleContrast } = useAccessibility()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('overview')
  const [localProgress, setLocalProgress] = useState(getAllProgress)
  const [copiedCode, setCopiedCode] = useState(false)
  const userId = currentUser?._id || currentUser?.id
  const user = currentUser || { name: 'Learner', email: '', avatar: null, role: 'student' }

  const { data: serverProgress = {} } = useQuery({
    queryKey: ['profile-learning-progress', userId],
    queryFn: async () => {
      const response = await api.get(`/progress/user/${userId}`)
      return response.data?.summary || {}
    },
    enabled: Boolean(userId && user.role === 'student'),
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
  })
  const { data: analytics = {} } = useQuery({
    queryKey: ['profile-learning-activity', userId],
    queryFn: async () => (await api.get('/analytics/progress')).data?.data || {},
    enabled: Boolean(userId && user.role === 'student'),
    refetchInterval: 20_000,
    refetchOnWindowFocus: true,
  })
  const { data: certificates = [] } = useQuery({
    queryKey: ['profile-certificates', userId],
    queryFn: async () => (await api.get('/progress/certificates/user')).data?.data || [],
    enabled: Boolean(userId && user.role === 'student'),
    refetchInterval: 20_000,
    refetchOnWindowFocus: true,
  })
  const { data: familyCode } = useQuery({
    queryKey: ['parent-link-code', userId],
    queryFn: async () => (await parentLinksAPI.getCode()).data?.data || null,
    enabled: Boolean(userId && user.role === 'student'),
    staleTime: 30_000,
  })

  useEffect(() => {
    const refresh = event => {
      setLocalProgress(getAllProgress())
      if (event?.detail?.activity !== 'learning-time') {
        void queryClient.invalidateQueries({ queryKey: ['profile-learning-progress', userId] })
        void queryClient.invalidateQueries({ queryKey: ['profile-learning-activity', userId] })
      }
    }
    const storageRefresh = event => {
      if (!event.key || event.key.startsWith(PROGRESS_STORAGE_KEY)) refresh()
    }
    window.addEventListener(LEARNING_PROGRESS_UPDATED_EVENT, refresh)
    window.addEventListener('storage', storageRefresh)
    return () => {
      window.removeEventListener(LEARNING_PROGRESS_UPDATED_EVENT, refresh)
      window.removeEventListener('storage', storageRefresh)
    }
  }, [queryClient, userId])

  const localCourses = useMemo(() => getLocalProfileCourses(localProgress), [localProgress])
  const localCompletedCourses = localCourses.filter(course => course.completed).length
  const localLessonsCompleted = localCourses.reduce((sum, course) => sum + course.lessonsCompleted, 0)
  const localLearningSeconds = localCourses.reduce((sum, course) => sum + course.activeSeconds, 0)
  const userProgress = {
    totalXP: Number(user.progress?.totalXP ?? serverProgress.totalXP ?? 0),
    level: Number(user.progress?.level ?? serverProgress.level ?? 1),
    streakDays: Number(user.progress?.streakDays ?? serverProgress.currentStreak ?? 0),
    coursesCompleted: Math.max(localCompletedCourses, Number(serverProgress.coursesCompleted) || 0),
    lessonsCompleted: Math.max(localLessonsCompleted, Number(serverProgress.lessonsCompleted) || 0),
    hoursLearned: Number(Math.max(localLearningSeconds / 3600, Number(serverProgress.totalLearningHours ?? serverProgress.totalHoursLearned) || 0).toFixed(1)),
    certificatesEarned: certificates.length || Number(serverProgress.certificatesEarned) || 0,
  }
  const existingBadges = Array.isArray(user.progress?.badges) ? user.progress.badges : []
  const badgeKeys = new Set(existingBadges.map(badge => String(typeof badge === 'string' ? badge : badge.id || badge.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')))
  const badges = [
    { id: 'first-lesson', icon: Target, name: 'First Steps', desc: 'Completed your first lesson', color: 'text-primary', earned: userProgress.lessonsCompleted >= 1 },
    { id: 'course-finisher', icon: BookOpen, name: 'Course Finisher', desc: 'Completed a full course', color: 'text-accent-cyan', earned: userProgress.coursesCompleted >= 1 },
    { id: 'streak-7', icon: Flame, name: 'On Fire', desc: 'Reached a 7-day learning streak', color: 'text-accent-orange', earned: userProgress.streakDays >= 7 },
    { id: 'streak-30', icon: Zap, name: 'Unstoppable', desc: 'Reached a 30-day learning streak', color: 'text-accent-yellow', earned: userProgress.streakDays >= 30 },
    { id: 'lab-explorer', icon: FlaskConical, name: 'Lab Explorer', desc: 'Completed a science lab activity', color: 'text-accent-cyan', earned: localCourses.some(course => course.completed && /science|biology|chemistry|physics/i.test(course.title)) },
    { id: 'quiz-master', icon: Trophy, name: 'Quiz Master', desc: 'Earned a perfect score on five quizzes', color: 'text-accent-yellow', earned: Object.values(localProgress).flatMap(progress => Object.values(progress.mcqScores || {})).filter(score => Number(score.percentage) === 100).length >= 5 },
    { id: 'helper', icon: Users, name: 'Helpful Hand', desc: 'Helped ten students', color: 'text-accent-pink' },
  ].map(badge => ({
    ...badge,
    earned: Boolean(badge.earned || badgeKeys.has(badge.id) || badgeKeys.has(badge.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))),
    locked: !(badge.earned || badgeKeys.has(badge.id) || badgeKeys.has(badge.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))),
  }))
  const badgeCount = Math.max(badges.filter(badge => badge.earned).length, existingBadges.length)

  const stats = [
    { label: 'Courses Completed', value: userProgress.coursesCompleted, icon: BookOpen, color: 'bg-primary/10 text-primary' },
    { label: 'Lessons Completed', value: userProgress.lessonsCompleted, icon: CheckCircle, color: 'bg-accent-cyan/10 text-accent-cyan' },
    { label: 'Hours Learned', value: userProgress.hoursLearned, icon: Clock, color: 'bg-accent-orange/10 text-accent-orange' },
    { label: 'Badges Earned', value: badgeCount, icon: Award, color: 'bg-accent-yellow/10 text-accent-yellow' },
  ]

  const localActivities = localCourses
    .filter(course => course.started && course.lastAccessed)
    .map(course => ({
      action: course.completed ? 'Completed course' : 'Learning activity',
      item: course.title,
      timestamp: course.lastAccessed,
      icon: course.completed ? CheckCircle : Target,
      color: course.completed ? 'text-accent-cyan' : 'text-primary',
    }))
  const serverActivities = (analytics.recentActivity || []).map(activity => ({
    action: activity.type === 'test' ? 'Completed exam' : 'Completed lesson',
    item: activity.title,
    timestamp: activity.timestamp,
    icon: activity.type === 'test' ? Trophy : CheckCircle,
    color: activity.type === 'test' ? 'text-accent-yellow' : 'text-accent-cyan',
  }))
  const activities = [...localActivities, ...serverActivities]
    .sort((left, right) => new Date(right.timestamp) - new Date(left.timestamp))
    .slice(0, 8)

  const tabs = ['overview', 'achievements', 'settings', 'accessibility']

  return (
    <div className="min-h-screen bg-surface-light">
      <div className="bg-gradient-to-br from-primary via-primary to-primary-dark text-white">
        <div className="container-custom py-10">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full rounded-2xl object-cover" />
              ) : (
                <User size={40} className="text-white/80" />
              )}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
              <p className="text-white/80 flex items-center justify-center sm:justify-start gap-2">
                <Mail size={14} />
                {user.email}
              </p>
              <p className="text-sm text-white/60 mt-1 flex items-center justify-center sm:justify-start gap-2">
                <Calendar size={14} />
                Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'recently'}
              </p>
            </div>
            <div className="sm:ml-auto flex gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Star size={16} className="text-accent-yellow" />
                  <span className="text-2xl font-bold">{userProgress.level}</span>
                </div>
                <div className="text-xs text-white/60">Level</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Zap size={16} className="text-accent-yellow" />
                  <span className="text-2xl font-bold">{userProgress.totalXP}</span>
                </div>
                <div className="text-xs text-white/60">XP</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Flame size={16} className="text-accent-orange" />
                  <span className="text-2xl font-bold">{userProgress.streakDays}</span>
                </div>
                <div className="text-xs text-white/60">Streak</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b sticky top-16 z-10">
        <div className="container-custom">
          <div className="flex gap-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 capitalize font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-muted hover:text-text-primary'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => {
                const Icon = stat.icon
                return (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                        <Icon size={24} />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
                        <div className="text-sm text-text-muted">{stat.label}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-text-primary">Level {userProgress.level}</h2>
                <span className="text-sm text-text-secondary">
                  {userProgress.totalXP % 100} / 100 XP to next level
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent-cyan rounded-full transition-all"
                  style={{ width: `${userProgress.totalXP % 100}%` }}
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="font-semibold text-text-primary mb-5">Recent Activity</h2>
              <div className="space-y-4">
                {activities.map((activity, i) => {
                  const Icon = activity.icon
                  return (
                    <div key={i} className="flex items-center gap-4 p-3 bg-surface-light rounded-xl hover:bg-primary/5 transition-colors">
                      <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm ${activity.color}`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="text-text-muted">{activity.action}:</span>{' '}
                          <span className="font-semibold text-text-primary">{activity.item}</span>
                        </p>
                      </div>
                      <span className="text-xs text-text-muted">{relativeTime(activity.timestamp)}</span>
                    </div>
                  )
                })}
                {activities.length === 0 && <p className="rounded-xl bg-surface-light p-4 text-sm text-text-muted">Your course activity will appear here as you watch lessons and complete knowledge checks.</p>}
              </div>
            </div>

            {user.role === 'student' && (
              <div className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 to-accent-cyan/5 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="flex items-center gap-2 font-semibold text-text-primary"><Link2 size={18} className="text-primary" /> Family connection</h2>
                    <p className="mt-1 max-w-xl text-sm leading-6 text-text-muted">Share this one-time code with your parent so they can view your learning progress, achievements, and certificates.</p>
                  </div>
                  {familyCode?.code && (
                    <div className="flex items-center gap-2">
                      <code className="rounded-lg border border-gray-200 bg-white px-4 py-2 font-mono text-lg font-bold tracking-[0.16em] text-primary">{familyCode.code}</code>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(familyCode.code)
                            setCopiedCode(true)
                            window.setTimeout(() => setCopiedCode(false), 1800)
                          } catch {
                            setCopiedCode(false)
                          }
                        }}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
                      ><Copy size={16} />{copiedCode ? 'Copied' : 'Copy'}</button>
                    </div>
                  )}
                </div>
                {familyCode?.expiresAt && <p className="mt-2 text-xs text-text-muted">Code expires {new Date(familyCode.expiresAt).toLocaleDateString()} and can be used once.</p>}
              </div>
            )}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div>
            <h2 className="text-xl font-bold text-text-primary mb-6">Badges & Achievements</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges.map((badge) => {
                const Icon = badge.locked ? Lock : badge.icon
                return (
                  <div 
                    key={badge.id}
                    className={`bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all ${badge.locked ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${badge.locked ? 'bg-gray-100' : 'bg-surface-light'}`}>
                        <Icon size={28} className={badge.locked ? 'text-text-muted' : badge.color} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-primary">{badge.name}</h3>
                        <p className="text-sm text-text-muted">{badge.desc}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="font-semibold text-text-primary mb-5 flex items-center gap-2">
                <Settings size={20} />
                Profile Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">Name</label>
                  <input type="text" defaultValue={user.name} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">Email</label>
                  <input type="email" defaultValue={user.email} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                </div>
                <button className="btn-primary mt-2">Save Changes</button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="font-semibold text-text-primary mb-5">Learning Preferences</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">Preferred Language</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>Hindi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">Learning Style</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer">
                    <option>Visual</option>
                    <option>Auditory</option>
                    <option>Reading/Writing</option>
                    <option>Kinesthetic</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'accessibility' && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="font-semibold text-text-primary mb-6 flex items-center gap-2">
                <Eye size={20} />
                Accessibility Settings
              </h2>
              <div className="space-y-1">
                <ToggleSetting
                  icon={Type}
                  label="Dyslexia-Friendly Mode"
                  description="Uses OpenDyslexic font and optimized spacing"
                  checked={settings.dyslexiaMode}
                  onChange={toggleDyslexia}
                />
                <ToggleSetting
                  icon={Focus}
                  label="Focus Mode"
                  description="Reduces distractions and highlights current content"
                  checked={settings.focusMode}
                  onChange={toggleFocus}
                />
                <ToggleSetting
                  icon={Eye}
                  label="High Contrast"
                  description="Increases contrast for better visibility"
                  checked={settings.highContrast}
                  onChange={toggleContrast}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ToggleSetting({ icon: Icon, label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-surface-light flex items-center justify-center">
          <Icon size={20} className="text-primary" />
        </div>
        <div>
          <p className="font-semibold text-text-primary">{label}</p>
          <p className="text-sm text-text-muted">{description}</p>
        </div>
      </div>
      <button
        onClick={onChange}
        className={`relative w-14 h-7 rounded-full transition-colors ${
          checked ? 'bg-primary' : 'bg-gray-200'
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-7' : ''
          }`}
        />
      </button>
    </div>
  )
}

export default Profile
