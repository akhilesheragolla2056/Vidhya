import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Suspense, lazy, useEffect, useState } from 'react'

// Layout Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import LoadingSpinner from './components/ui/LoadingSpinner'

// Routing
import { ProtectedRoute, PublicRoute } from './components/routing/RouteGuards'

// Store actions
import { fetchProfile } from './store/slices/userSlice'

// Hooks
import { useNetworkStatus } from './hooks/useNetworkStatus'
import { useAccessibility } from './hooks/useAccessibility'

// Lazy load pages for code splitting
const Landing = lazy(() => import('./pages/Landing'))
const LearningShowcase = lazy(() => import('./pages/LearningShowcase'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Classroom = lazy(() => import('./pages/Classroom'))
const Lab = lazy(() => import('./pages/Lab'))
const Profile = lazy(() => import('./pages/Profile'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const AuthCallback = lazy(() => import('./pages/AuthCallback'))
const Courses = lazy(() => import('./pages/Courses'))
const CoursesNew = lazy(() => import('./pages/CoursesNew'))
const CourseDetail = lazy(() => import('./pages/CourseDetail'))
const CourseDetailNew = lazy(() => import('./pages/CourseDetailNew'))
const MathHelper = lazy(() => import('./pages/MathHelper'))
const EssayHelper = lazy(() => import('./pages/EssayHelper'))
const CodeHelper = lazy(() => import('./pages/CodeHelper'))
const StudyChat = lazy(() => import('./pages/StudyChat'))
const MockTests = lazy(() => import('./pages/MockTests'))
const About = lazy(() => import('./pages/About'))
const TestTaker = lazy(() => import('./pages/TestTaker'))
const TestResults = lazy(() => import('./pages/TestResults'))
const ScienceLab = lazy(() => import('./pages/ScienceLab'))
const Certificates = lazy(() => import('./pages/Certificates'))

function App() {
  const { isOnline, connectionType } = useNetworkStatus()
  const { settings } = useAccessibility()
  const dispatch = useDispatch()
  const { currentUser, isAuthenticated, isLoading } = useSelector(state => state.user)
  const location = useLocation()
  const [isHydrating, setIsHydrating] = useState(true)

  // Hide footer on auth pages
  const hideFooter = ['/login', '/signup'].includes(location.pathname)

  // Apply accessibility settings to body
  useEffect(() => {
    document.body.classList.toggle('dyslexia-mode', settings.dyslexiaMode)
    document.body.classList.toggle('focus-mode', settings.focusMode)
    document.body.classList.toggle('high-contrast', settings.highContrast)
  }, [settings])

  // Hydrate user session from existing token
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && !currentUser && !isAuthenticated) {
      setIsHydrating(true)
      dispatch(fetchProfile()).finally(() => setIsHydrating(false))
    } else {
      setIsHydrating(false)
    }
  }, [currentUser, dispatch, isAuthenticated])

  const showGlobalSpinner = isHydrating || isLoading

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col">
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2.5 z-50 font-medium text-sm">
          You are offline. Some features may be limited.
        </div>
      )}

      {connectionType === 'slow' && isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-amber-600 text-white text-center py-2.5 z-50 font-medium text-sm">
          Low bandwidth detected. Loading lite version.
        </div>
      )}

      <Navbar />

      <main className="flex-1">
        <Suspense fallback={<LoadingSpinner />}>
          {showGlobalSpinner ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : null}
          <Routes>
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Landing />
                </PublicRoute>
              }
            />
            <Route path="/learning" element={<LearningShowcase />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/courses" element={<CoursesNew />} />
            <Route path="/courses-new" element={<CoursesNew />} />
            <Route
              path="/courses/:id"
              element={
                <ProtectedRoute>
                  <CourseDetail />
                </ProtectedRoute>
              }
            />
            <Route path="/course/:id" element={<CourseDetailNew />} />
            <Route path="/mock-tests" element={<MockTests />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/test/:testId"
              element={
                <ProtectedRoute>
                  <TestTaker />
                </ProtectedRoute>
              }
            />
            <Route
              path="/test-results/:testId"
              element={
                <ProtectedRoute>
                  <TestResults />
                </ProtectedRoute>
              }
            />
            <Route
              path="/science-lab"
              element={
                <ProtectedRoute>
                  <ScienceLab />
                </ProtectedRoute>
              }
            />
            <Route
              path="/certificates"
              element={
                <ProtectedRoute>
                  <Certificates />
                </ProtectedRoute>
              }
            />
            <Route path="/tools/math" element={<MathHelper />} />
            <Route path="/tools/essay" element={<EssayHelper />} />
            <Route path="/tools/code" element={<CodeHelper />} />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <StudyChat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/classroom/:id"
              element={
                <ProtectedRoute>
                  <Classroom />
                </ProtectedRoute>
              }
            />
            <Route path="/lab" element={<Navigate to="/lab/chemistry" replace />} />
            <Route
              path="/lab/:id"
              element={
                <ProtectedRoute>
                  <Lab />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      {!hideFooter && <Footer />}
    </div>
  )
}

export default App
