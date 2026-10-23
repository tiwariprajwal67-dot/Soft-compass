import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import AuthCard from '../components/login/AuthCard.jsx'
import PasswordField from '../components/login/PasswordField.jsx'
import { useAuth } from '../auth/useAuth.js'
import { NAME_MAX } from '../auth/profile.js'
import { signUp, isValidEmail, MIN_PASSWORD, NOT_READY } from '../auth/authApi.js'
import { isSupabaseConfigured } from '../lib/supabaseClient.js'

export default function SignupPage() {
  const navigate = useNavigate()
  const { user, signedInAtStart } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)

  if (signedInAtStart && user) return <Navigate to="/account" replace />

  async function handleSubmit(event) {
    event.preventDefault()
    if (busy) return

    const cleanEmail = email.trim()

    if (!isValidEmail(cleanEmail)) {
      return setError('Enter an email like name@example.com.')
    }

    if (password.length < MIN_PASSWORD) {
      return setError(`Choose a password of at least ${MIN_PASSWORD} characters.`)
    }

    if (!agreed) {
      return setError('Please tick the box to agree before creating an account.')
    }

    setError('')
    setBusy(true)

    const result = await signUp({ email: cleanEmail, password, name })

    setBusy(false)

    if (!result.ok) return setError(result.message)
    if (result.signedIn) return navigate('/', { replace: true })

    return setSent(true)
  }

  if (sent) {
    return (
      <AuthCard
        title={<>Check your <em>inbox</em>.</>}
        subtitle="One more step."
      >
        <p className="lg-notice lg-notice--ok" role="status">
          If this address can be used for a new account, we have sent a
          confirmation link to it. It can take a minute. Please also look in
          your spam folder.
        </p>

        <Link className="lg-btn lg-btn--ghost" to="/login">
          Back to sign in
        </Link>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title={<>Create your <em>account</em>.</>}
      subtitle="Save your results and pick up where you left off."
    >
      {!isSupabaseConfigured && (
        <p className="lg-notice" role="status">
          {NOT_READY}
        </p>
      )}

      <form className="lg-form" onSubmit={handleSubmit} noValidate>
        <div className="lg-field">
          <label className="lg-label" htmlFor="su-name">
            Your name (optional)
          </label>

          <div className="lg-control">
            <input
              id="su-name"
              name="name"
              className="lg-input"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              maxLength={NAME_MAX}
              placeholder="How it should appear on your report card"
              aria-describedby="su-name-hint"
            />
          </div>

          <p id="su-name-hint" className="lg-hint">
            Printed on the report card you can download. You can change it later.
          </p>
        </div>

        <div className="lg-field">
          <label className="lg-label" htmlFor="su-email">
            Email
          </label>

          <div className="lg-control">
            <input
              id="su-email"
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

        <PasswordField
          id="su-password"
          label="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          placeholder={`At least ${MIN_PASSWORD} characters`}
          hint="A few unrelated words make a strong password."
        />

        <label className="lg-agree">
          <input
            type="checkbox"
            name="agreement"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
            required
          />

          <span>
            I agree that Soft Compass stores my email address and name to run
            my account, as described in the{' '}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
            {' '}and I accept the{' '}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms and Conditions
            </a>
            .
          </span>
        </label>

        {error && (
          <p className="lg-error" role="alert">
            {error}
          </p>
        )}

        <button
          className="lg-btn lg-btn--primary"
          type="submit"
          disabled={busy || !isSupabaseConfigured}
        >
          {busy ? 'Creating…' : 'Create account'}
        </button>
      </form>

      <p className="lg-foot">
        Already have an account?{' '}
        <Link className="lg-link" to="/login">
          Sign in
        </Link>
      </p>
    </AuthCard>
  )
}