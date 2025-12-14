import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Suspense, lazy, useEffect } from 'react'

// Layout Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import LoadingSpinner from './components/ui/LoadingSpinner'

// Hooks
import { useNetworkStatus } from './hooks/useNetworkStatus'
import { useAccessibility } from './hooks/useAccessibility'

// Lazy load pages for code splitting
const Landing = lazy(() => import('./pages/Landing'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Classroom = lazy(() => import('./pages/Classroom'))
const Lab = lazy(() => import('./pages/Lab'))
const Profile = lazy(() => import('./pages/Profile'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const Courses = lazy(() => import('./pages/Courses'))
const CourseDetail = lazy(() => import('./pages/CourseDetail'))
const MathHelper = lazy(() => import('./pages/MathHelper'))
const EssayHelper = lazy(() => import('./pages/EssayHelper'))
const CodeHelper = lazy(() => import('./pages/CodeHelper'))
const StudyChat = lazy(() => import('./pages/StudyChat'))

function App() {
  const { isOnline, connectionType } = useNetworkStatus()
  const { settings } = useAccessibility()
  const user = useSelector((state) => state.user.currentUser)
  const location = useLocation()
  
  // Hide footer on auth pages
  const hideFooter = ['/login', '/signup'].includes(location.pathname)

  // Apply accessibility settings to body
  useEffect(() => {
    document.body.classList.toggle('dyslexia-mode', settings.dyslexiaMode)
    document.body.classList.toggle('focus-mode', settings.focusMode)
    document.body.classList.toggle('high-contrast', settings.highContrast)
  }, [settings])

  return (
    <div className="min-h-screen bg-surface-light flex flex-col">
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-accent-orange text-white text-center py-2.5 z-50 font-medium">
          You are offline. Some features may be limited.
        </div>
      )}

      {connectionType === 'slow' && isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-primary text-white text-center py-2.5 z-50 font-medium">
          Low bandwidth detected. Loading lite version.
        </div>
      )}

      <Navbar />
      
      <main className="flex-1">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/tools/math" element={<MathHelper />} />
            <Route path="/tools/essay" element={<EssayHelper />} />
            <Route path="/tools/code" element={<CodeHelper />} />
            <Route path="/chat" element={<StudyChat />} />
            <Route path="/classroom/:id" element={<Classroom />} />
            <Route path="/lab" element={<Navigate to="/lab/chemistry" replace />} />
            <Route path="/lab/:id" element={<Lab />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Suspense>
      </main>

      {!hideFooter && <Footer />}
    </div>
  )
}

export default App
