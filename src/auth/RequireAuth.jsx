import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth.js'

// Wrap a page in this to send signed-out visitors to the sign-in page first.
// NOTE: this only tidies up the screen. Real protection of data always comes from
// the database rules, because anyone can tamper with what their own browser shows.
export default function RequireAuth({ children }) {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) return <p className="auth-loading" role="status">Loading…</p>
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}