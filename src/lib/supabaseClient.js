import { createClient } from '@supabase/supabase-js'
import { describeKey } from './describeKey.js'

// These two values are PUBLIC by design: anyone can see them in the browser.
// The database's own security rules (Row Level Security) are what protect the data.
// They are filled in at build time from .env.local (on your computer) or from
// Vercel's Environment Variables (on the live site).
// Accept the bare project URL, and quietly strip a pasted "/rest/v1/" or trailing slash.
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  ?.replace(/\/rest\/v1\/?$/, '')
  .replace(/\/+$/, '')
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const keyKind = describeKey(supabaseKey)

// A secret key can bypass every security rule. If one ends up here by mistake,
// refuse to use it, so it is never sent from a visitor's browser.
const dangerous = keyKind === 'secret' || keyKind === 'legacy-service-role'
if (dangerous) {
  console.error(
    'Soft Compass: a SECRET Supabase key was found in the browser settings. It has been ignored. ' +
      'Remove it, and rotate that key in Supabase, because it may be exposed.',
  )
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey) && !dangerous

// ---------------------------------------------------------------
// "Keep me signed in"
//   ticked   -> the sign-in is remembered on this device (localStorage)
//   unticked -> it lasts only until this browser tab is closed (sessionStorage)
// Supabase asks this "storage" object where to keep the sign-in.
// Every call is wrapped so that a browser with storage switched off cannot crash the site.
// ---------------------------------------------------------------
const REMEMBER_KEY = 'soft-compass-remember'

function safely(action, fallback = null) {
  try {
    return action()
  } catch {
    return fallback
  }
}

export function setRemember(remember) {
  safely(() => localStorage.setItem(REMEMBER_KEY, remember ? 'yes' : 'no'))
}

export const authStorage = {
  getItem: (key) => safely(() => localStorage.getItem(key) ?? sessionStorage.getItem(key)),
  setItem: (key, value) =>
    safely(() => {
      const keep = localStorage.getItem(REMEMBER_KEY) !== 'no'
      const [target, other] = keep ? [localStorage, sessionStorage] : [sessionStorage, localStorage]
      target.setItem(key, value)
      other.removeItem(key)
    }),
  removeItem: (key) =>
    safely(() => {
      localStorage.removeItem(key)
      sessionStorage.removeItem(key)
    }),
}

// null when not configured, so the rest of the site keeps working without a database
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, { auth: { storage: authStorage } })
  : null