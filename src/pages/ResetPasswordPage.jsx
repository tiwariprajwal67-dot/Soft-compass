import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/login/AuthCard.jsx'
import PasswordField from '../components/login/PasswordField.jsx'
import { useAuth } from '../auth/useAuth.js'
import { setNewPassword, MIN_PASSWORD } from '../auth/authApi.js'

// People arrive here from the link in the "reset your password" email.
// Supabase turns that link into a temporary sign-in, so "signed in" here means "link accepted".
export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const { session, loading } = useAuth()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (busy) return
    if (password.length < MIN_PASSWORD) {
      return setError(`Choose a password of at least ${MIN_PASSWORD} characters.`)
    }
    setError('')
    setBusy(true)
    const result = await setNewPassword(password)
    setBusy(false)

    if (!result.ok) return setError(result.message)
    return navigate('/account', { replace: true })
  }

  if (loading) {
    return (
      <AuthCard title={<>One <em>moment</em>.</>}>
        <p className="lg-notice" role="status">Checking your link…</p>
      </AuthCard>
    )
  }

  if (!session) {
    return (
      <AuthCard
        title={<>This link has <em>expired</em>.</>}
        subtitle="Password links work once and only for a short time."
      >
        <Link className="lg-btn lg-btn--primary" to="/forgot-password">
          Send me a new link
        </Link>
      </AuthCard>
    )
  }

  return (
    <AuthCard title={<>Choose a new <em>password</em>.</>} subtitle="Then you are all set.">
      <form className="lg-form" onSubmit={handleSubmit} noValidate>
        <PasswordField
          id="rp-password"
          label="New password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          placeholder={`At least ${MIN_PASSWORD} characters`}
        />

        {error && <p className="lg-error" role="alert">{error}</p>}

        <button className="lg-btn lg-btn--primary" type="submit" disabled={busy}>
          {busy ? 'Saving…' : 'Save new password'}
        </button>
      </form>
    </AuthCard>
  )
}