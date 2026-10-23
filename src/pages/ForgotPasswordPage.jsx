import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthCard from '../components/login/AuthCard.jsx'
import { sendResetEmail, isValidEmail, NOT_READY } from '../auth/authApi.js'
import { isSupabaseConfigured } from '../lib/supabaseClient.js'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (busy) return
    const cleanEmail = email.trim()
    if (!isValidEmail(cleanEmail)) return setError('Enter the email you used to sign up.')

    setError('')
    setBusy(true)
    const result = await sendResetEmail(cleanEmail)
    setBusy(false)

    if (!result.ok) return setError(result.message)
    return setSent(true)
  }

  if (sent) {
    return (
      <AuthCard title={<>Check your <em>inbox</em>.</>} subtitle="Help is on the way.">
        <p className="lg-notice lg-notice--ok" role="status">
          If an account exists for that email, we have sent a link to choose a new password.
          It can take a minute. Please also look in your spam folder.
        </p>
        <Link className="lg-btn lg-btn--ghost" to="/login">
          Back to sign in
        </Link>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title={<>Forgot your <em>password</em>?</>}
      subtitle="Enter your email and we will send you a link to choose a new one."
    >
      {!isSupabaseConfigured && <p className="lg-notice" role="status">{NOT_READY}</p>}

      <form className="lg-form" onSubmit={handleSubmit} noValidate>
        <div className="lg-field">
          <label className="lg-label" htmlFor="fp-email">Email</label>
          <div className="lg-control">
            <input
              id="fp-email"
              name="email"
              className="lg-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {error && <p className="lg-error" role="alert">{error}</p>}

        <button className="lg-btn lg-btn--primary" type="submit" disabled={busy || !isSupabaseConfigured}>
          {busy ? 'Sending…' : 'Send the link'}
        </button>
      </form>

      <p className="lg-foot">
        Remembered it? <Link className="lg-link" to="/login">Sign in</Link>
      </p>
    </AuthCard>
  )
}