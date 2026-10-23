import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth.js'
import { isSupabaseConfigured } from '../../lib/supabaseClient.js'

// Goes inside the header's <nav>. Shows "Sign in" to visitors and "Account" to signed-in people.
// On the live site it stays hidden until accounts are really switched on.
export default function AccountLink({ onNavigate }) {
  const { session, loading } = useAuth()

  if (!isSupabaseConfigured && !import.meta.env.DEV) return null
  if (loading) return null

  return session ? (
    <Link to="/account" onClick={onNavigate}>Account</Link>
  ) : (
    <Link to="/login" onClick={onNavigate}>Sign in</Link>
  )
}