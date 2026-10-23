import { supabase, setRemember } from '../lib/supabaseClient.js'
import { cleanName } from './profile.js'

// ---------------------------------------------------------------
// Everything that talks to Supabase Auth lives here, so the pages stay simple.
// Every function answers { ok: true, ... } or { ok: false, message }, where the
// message is friendly and safe to show to the visitor.
// ---------------------------------------------------------------

export const MIN_PASSWORD = 8
// Bump this when the privacy notice changes, so we know which version people agreed to.
export const CONSENT_VERSION = 'privacy-v1'
export const NOT_READY = 'Accounts are not switched on for this site yet.'

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

// Turns Supabase's technical error codes into plain language.
export function explain(error) {
  switch (error?.code) {
    case 'invalid_credentials':
      return 'That email and password do not match.'
    case 'email_not_confirmed':
      return 'Please confirm your email first. Check your inbox for the link.'
    case 'weak_password':
      return `Please choose a stronger password: at least ${MIN_PASSWORD} characters and hard to guess.`
    case 'same_password':
      return 'Please choose a password different from your current one.'
    case 'over_request_rate_limit':
    case 'over_email_send_rate_limit':
    case 'over_sms_send_rate_limit':
      return 'Too many attempts. Please wait a few minutes and try again.'
    case 'signup_disabled':
    case 'email_provider_disabled':
      return 'New accounts are not being accepted right now.'
    case 'user_banned':
      return 'This account is not available.'
    default:
      break
  }
  if (error?.status === 429) return 'Too many attempts. Please wait a few minutes and try again.'
  if (error?.status === 0 || error?.name === 'AuthRetryableFetchError') {
    return 'Could not reach the server. Check your connection and try again.'
  }
  return 'Something went wrong. Please try again.'
}

export async function signIn({ email, password, remember }) {
  if (!supabase) return { ok: false, message: NOT_READY }
  setRemember(remember) // must happen BEFORE signing in, so the sign-in is stored in the right place
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { ok: false, message: explain(error) }
  return { ok: true, user: data.user }
}

export async function signUp({ email, password, name = '' }) {
  if (!supabase) return { ok: false, message: NOT_READY }
  const fullName = cleanName(name)
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/login`,
      data: {
        // a record of what the person agreed to (they can edit this themselves, so it is a note, not proof)
        consent_version: CONSENT_VERSION,
        consented_at: new Date().toISOString(),
        // the name printed on their downloadable report card (optional)
        ...(fullName ? { full_name: fullName } : {}),
      },
    },
  })
  if (error) return { ok: false, message: explain(error) }
  // A session means email confirmation is switched off: signed in straight away.
  // No session means a confirmation email was sent. When the address already has an
  // account, Supabase answers the same way ON PURPOSE, so strangers cannot probe
  // which emails are registered. We must not reveal the difference either.
  return { ok: true, signedIn: Boolean(data.session) }
}

export async function signOut() {
  if (!supabase) return
  await supabase.auth.signOut({ scope: 'local' }) // this browser only
}

export async function sendResetEmail(email) {
  if (!supabase) return { ok: false, message: NOT_READY }
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  // Only say "too many attempts". For everything else answer the same way, so nobody
  // can discover which emails have accounts.
  if (error && (error.status === 429 || /rate_limit/.test(error.code || ''))) {
    return { ok: false, message: explain(error) }
  }
  return { ok: true }
}

export async function setNewPassword(password) {
  if (!supabase) return { ok: false, message: NOT_READY }
  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { ok: false, message: explain(error) }
  return { ok: true }
}

export async function updateName(name) {
  if (!supabase) return { ok: false, message: NOT_READY }
  const { error } = await supabase.auth.updateUser({ data: { full_name: cleanName(name) } })
  if (error) return { ok: false, message: explain(error) }
  return { ok: true }
}