import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/login/AuthCard.jsx'
import { useAuth } from '../auth/useAuth.js'
import { signOut, updateName } from '../auth/authApi.js'
import { getDisplayName, NAME_MAX } from '../auth/profile.js'
import { loadPending } from '../report/pendingReport.js'

// Shown only to signed-in people (see RequireAuth in App.jsx).
export default function AccountPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [busy, setBusy] = useState(false)
  const [name, setName] = useState(() => getDisplayName(user))
  const [savingName, setSavingName] = useState(false)
  const [nameStatus, setNameStatus] = useState({ kind: '', text: '' })
  const [hasPendingReport] = useState(() => Boolean(loadPending()))

  async function handleSignOut() {
    setBusy(true)
    navigate('/', { replace: true }) // leave first, so a signed-out account page never flashes
    await signOut()
  }

  async function handleSaveName(event) {
    event.preventDefault()
    if (savingName) return
    setSavingName(true)
    setNameStatus({ kind: '', text: '' })
    const result = await updateName(name)
    setSavingName(false)
    setNameStatus(result.ok ? { kind: 'ok', text: 'Saved.' } : { kind: 'error', text: result.message })
  }

  const since = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <AuthCard title={<>Your <em>account</em>.</>} subtitle="You are signed in.">
      <dl className="lg-facts">
        <div>
          <dt>Email</dt>
          <dd>{user?.email}</dd>
        </div>
        {since && (
          <div>
            <dt>Member since</dt>
            <dd>{since}</dd>
          </div>
        )}
        <div>
          <dt>Saved results</dt>
          <dd>Coming soon. Your results will appear here.</dd>
        </div>
      </dl>

      <form className="lg-form" onSubmit={handleSaveName} noValidate>
        <div className="lg-field">
          <label className="lg-label" htmlFor="ac-name">Your name</label>
          <div className="lg-control">
            <input
              id="ac-name"
              name="name"
              className="lg-input"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              maxLength={NAME_MAX}
              placeholder="Shown on your report card"
              aria-describedby="ac-name-hint"
            />
          </div>
          <p id="ac-name-hint" className="lg-hint">Printed on the report card you download. Leave it empty for a card without a name.</p>
        </div>
        {nameStatus.text && (
          <p className={nameStatus.kind === 'error' ? 'lg-error' : 'lg-notice lg-notice--ok'} role={nameStatus.kind === 'error' ? 'alert' : 'status'}>
            {nameStatus.text}
          </p>
        )}
        <button className="lg-btn lg-btn--ghost" type="submit" disabled={savingName}>
          {savingName ? 'Saving…' : 'Save name'}
        </button>
      </form>

      {hasPendingReport && (
        <Link className="lg-btn lg-btn--primary" to="/report">
          Back to my report card
        </Link>
      )}
      <Link className="lg-btn lg-btn--ghost" to="/reset-password">
        Change password
      </Link>
      <button className="lg-btn lg-btn--primary" type="button" onClick={handleSignOut} disabled={busy}>
        {busy ? 'Signing out…' : 'Sign out'}
      </button>
    </AuthCard>
  )
}