import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Login from '../components/login/Login.jsx'
import { useAuth } from '../auth/useAuth.js'
import { signIn } from '../auth/authApi.js'
import { isSupabaseConfigured } from '../lib/supabaseClient.js'

// While you are building without Supabase, the demo login keeps working so the page can
// still be tried. A production build (the live site) NEVER uses the demo login.
const DEMO_MODE = import.meta.env.DEV && !isSupabaseConfigured

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signedInAtStart } = useAuth()

  // Someone who opened the site already signed in has no need for this page.
  // (Checking `user` too matters: after signing out, they must be able to see the form again.)
  if (signedInAtStart && user) return <Navigate to="/account" replace />

  // Where to go after signing in: the page they were sent away from, or the home page.
  // (Only paths inside this site are accepted.)
  const requested = location.state?.from
  const destination =
    typeof requested === 'string' && requested.startsWith('/') && !requested.startsWith('//')
      ? requested
      : '/'

  return (
    <Login
      showDemo={DEMO_MODE}
      onSubmit={DEMO_MODE ? undefined : signIn}
      onSuccess={() => navigate(destination, { replace: true })}
      onForgot={() => navigate('/forgot-password')}
      onSignup={() => navigate('/signup')}
      onGuest={() => navigate({ pathname: '/', hash: '#assessments' })}
    />
  )
}