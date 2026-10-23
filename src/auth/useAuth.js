import { useContext } from 'react'
import { AuthContext } from './AuthContext.js'

// Gives any component:
//   session          the current sign-in, or null
//   user             the signed-in person (email, id...), or null
//   loading          true for a moment at start-up while we check for a saved sign-in
//   signedInAtStart  true if the person was ALREADY signed in when the site opened
//                    (used to skip the sign-in page); null while we are still checking
export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>')
  return value
}