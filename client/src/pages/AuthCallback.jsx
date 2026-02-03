import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { fetchProfile } from '../store/slices/userSlice'
import LoadingSpinner from '../components/ui/LoadingSpinner'

function AuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const token = searchParams.get('token')
    const error = searchParams.get('error')

    const handleAuth = async () => {
      console.log('AuthCallback: token=', token, 'error=', error)

      if (error) {
        console.error('OAuth error:', error)
        navigate('/login', {
          state: { error: `OAuth login failed: ${decodeURIComponent(error)}` },
          replace: true,
        })
        return
      }

      if (token) {
        localStorage.setItem('token', token)
        console.log('Token saved, fetching profile...')
        try {
          const result = await dispatch(fetchProfile()).unwrap()
          console.log('Profile fetch result:', result)
          console.log('Navigating to dashboard...')
          navigate('/dashboard', { replace: true })
        } catch (err) {
          console.error('Profile fetch error:', err)
          navigate('/login', {
            state: { error: err || 'Failed to fetch profile after login' },
            replace: true,
          })
        }
        return
      }

      console.error('No token or error in OAuth response')
      navigate('/login', {
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
