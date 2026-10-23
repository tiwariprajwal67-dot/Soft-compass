import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { AuthContext } from './AuthContext.js'

// With no database connected there is nothing to wait for: everyone is signed out.
const NO_BACKEND = { session: null, loading: false, signedInAtStart: false }

export default function AuthProvider({ children }) {
  const [state, setState] = useState(() =>
    supabase ? { session: null, loading: true, signedInAtStart: null } : NO_BACKEND,
  )

  useEffect(() => {
    if (!supabase) return undefined
    let active = true

    // 1. Is there a saved sign-in (or a sign-in link in the address)?
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setState((previous) => ({
        session: data.session,
        loading: false,
        signedInAtStart: previous.signedInAtStart ?? Boolean(data.session),
      }))
    })

    // 2. Keep up with later changes: signing in, signing out, a refreshed sign-in.
    //    (Only update state in here. Calling other Supabase functions inside this
    //    callback can freeze the app.)
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setState((previous) => ({ ...previous, session }))
    })

    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(
    () => ({
      session: state.session,
      user: state.session?.user ?? null,
      loading: state.loading,
      signedInAtStart: state.signedInAtStart,
    }),
    [state],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}