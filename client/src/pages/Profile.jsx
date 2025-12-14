import { useSelector } from 'react-redux'
import { useState } from 'react'
import { useAccessibility } from '../hooks/useAccessibility'
import { User, Mail, Calendar, Zap, Flame, Trophy, Award, BookOpen, CheckCircle, Clock, Star, Target, FlaskConical, Users, Lock, Settings, Eye, Type, Focus } from 'lucide-react'

function Profile() {
  const { currentUser, progress } = useSelector((state) => state.user)
  const { settings, toggleDyslexia, toggleFocus, toggleContrast } = useAccessibility()
  const [activeTab, setActiveTab] = useState('overview')

  const user = currentUser || {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: null,
    role: 'student',
    joinedDate: 'January 2024',
  }

  const userProgress = progress || {
    totalXP: 2450,
    level: 12,
    streakDays: 15,
    coursesCompleted: 4,
    lessonsCompleted: 87,
    hoursLearned: 32,
    badges: ['first-lesson', 'streak-7', 'lab-explorer', 'quiz-master'],
  }

  const badges = [
    { id: 'first-lesson', icon: Target, name: 'First Steps', desc: 'Completed first lesson', color: 'text-primary' },
    { id: 'streak-7', icon: Flame, name: 'On Fire', desc: '7-day streak', color: 'text-accent-orange' },
    { id: 'streak-30', icon: Zap, name: 'Unstoppable', desc: '30-day streak', locked: true, color: 'text-accent-yellow' },
    { id: 'lab-explorer', icon: FlaskConical, name: 'Lab Explorer', desc: 'First VR experiment', color: 'text-accent-cyan' },
    { id: 'quiz-master', icon: Trophy, name: 'Quiz Master', desc: '100% on 5 quizzes', color: 'text-accent-yellow' },
    { id: 'helper', icon: Users, name: 'Helpful Hand', desc: 'Helped 10 students', locked: true, color: 'text-accent-pink' },
  ]

  const stats = [
    { label: 'Courses Completed', value: userProgress.coursesCompleted, icon: BookOpen, color: 'bg-primary/10 text-primary' },
    { label: 'Lessons Completed', value: userProgress.lessonsCompleted, icon: CheckCircle, color: 'bg-accent-cyan/10 text-accent-cyan' },
    { label: 'Hours Learned', value: userProgress.hoursLearned, icon: Clock, color: 'bg-accent-orange/10 text-accent-orange' },
    { label: 'Badges Earned', value: userProgress.badges.length, icon: Award, color: 'bg-accent-yellow/10 text-accent-yellow' },
  ]

  const activities = [
    { action: 'Completed lesson', item: 'Python Variables', time: '2 hours ago', icon: CheckCircle, color: 'text-accent-cyan' },
    { action: 'Started course', item: 'Machine Learning Basics', time: '1 day ago', icon: Target, color: 'text-primary' },
    { action: 'Earned badge', item: 'Quiz Master', time: '2 days ago', icon: Trophy, color: 'text-accent-yellow' },
    { action: 'Completed lab', item: 'Acid-Base Titration', time: '3 days ago', icon: FlaskConical, color: 'text-accent-pink' },
  ]

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
                Member since {user.joinedDate}
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
                      <span className="text-xs text-text-muted">{activity.time}</span>
                    </div>
                  )
                })}
              </div>
            </div>
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
