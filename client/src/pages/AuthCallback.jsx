import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { fetchProfile, logout } from '../store/slices/userSlice'
import LoadingSpinner from '../components/ui/LoadingSpinner'

function AuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handledAuthRef = useRef(false)

  useEffect(() => {
    if (handledAuthRef.current) return
    handledAuthRef.current = true

    const token = searchParams.get('token')
    const error = searchParams.get('error')
    const oauthAccountRole = searchParams.get('actualRole')

    const handleAuth = async () => {
      if (error) {
        const expectedRole = sessionStorage.getItem('expectedAuthRole') || 'student'
        sessionStorage.removeItem('expectedAuthRole')
        navigate(`/login/${expectedRole}`, {
          state: {
            error: error === 'role_mismatch' && oauthAccountRole
              ? `This account is registered as a ${oauthAccountRole}. Choose ${oauthAccountRole} sign in.`
              : 'OAuth login failed. Please try again.',
          },
          replace: true,
        })
        return
      }

      if (token) {
        localStorage.setItem('token', token)
        try {
          const profile = await dispatch(fetchProfile()).unwrap()
          const expectedRole = sessionStorage.getItem('expectedAuthRole')
          sessionStorage.removeItem('expectedAuthRole')
          if (expectedRole && profile.role !== expectedRole && profile.role !== 'admin') {
            dispatch(logout())
            sessionStorage.removeItem('postAuthRedirect')
            navigate(`/login/${expectedRole}`, {
              state: { error: `This account is registered as a ${profile.role}. Choose ${profile.role} sign in.` },
              replace: true,
            })
            return
          }
          const returnPath = sessionStorage.getItem('postAuthRedirect')
          sessionStorage.removeItem('postAuthRedirect')
          navigate(returnPath || '/dashboard', { replace: true })
        } catch (err) {
          localStorage.removeItem('token')
          sessionStorage.removeItem('postAuthRedirect')
          sessionStorage.removeItem('expectedAuthRole')
          navigate('/login/student', {
            state: { error: err || 'Failed to fetch profile after login' },
            replace: true,
          })
        }
        return
      }

      navigate('/login/student', {
        state: { error: 'Invalid OAuth response' },
        replace: true,
      })
    }

    handleAuth()
  }, [searchParams, navigate, dispatch])

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-light">
      <LoadingSpinner />
    </div>
  )
}

export default AuthCallback
