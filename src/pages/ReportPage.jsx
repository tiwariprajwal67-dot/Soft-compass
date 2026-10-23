import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import AuthCard from '../components/login/AuthCard.jsx'
import { useAuth } from '../auth/useAuth.js'
import { getDisplayName } from '../auth/profile.js'
import { loadPending, clearPending } from '../report/pendingReport.js'
import { buildSpec } from '../report/buildSpec.js'
import { renderReportCard, downloadReportCard } from '../report/reportCard.js'
import '../report/report.css'

// Where people land after signing in from a "Sign in to download report card" button.
// (Open to signed-in people only: see the route in App.jsx.)
export default function ReportPage() {
  const { user } = useAuth()
  const [pending] = useState(loadPending)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const holder = useRef(null)
  const name = getDisplayName(user)

  // Draw a preview of the card on the page.
  useEffect(() => {
    if (!pending) return undefined
    let cancelled = false
    renderReportCard(buildSpec({ ...pending, name }))
      .then((canvas) => {
        if (cancelled || !holder.current) return
        canvas.className = 'report-preview'
        canvas.setAttribute('role', 'img')
        canvas.setAttribute('aria-label', 'Preview of your report card')
        holder.current.replaceChildren(canvas)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [pending, name])

  async function handleDownload() {
    setError('')
    setBusy(true)
    try {
      await downloadReportCard(buildSpec({ ...pending, name }))
      clearPending() // the scores are no longer kept on this device
      setDone(true)
    } catch {
      setError('Sorry, the image could not be created. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  if (!pending) {
    return (
      <AuthCard
        title={<>Nothing to <em>show</em> yet.</>}
        subtitle="Finish one of the assessments, then choose Download report card."
      >
        <Link className="lg-btn lg-btn--primary" to="/personality">Personality Reflection</Link>
        <Link className="lg-btn lg-btn--ghost" to="/career-interests">Career Interest Explorer</Link>
      </AuthCard>
    )
  }

  return (
    <AuthCard title={<>Your report <em>card</em>.</>} subtitle="Here is a preview. Download it to keep it on your device.">
      <div ref={holder} aria-live="polite">
        <p className="lg-notice" role="status">Preparing your preview…</p>
      </div>

      {!name && (
        <p className="lg-hint">
          Your card has no name on it yet.{' '}
          <Link className="lg-link" to="/account">Add your name</Link>, then come back to this page.
        </p>
      )}

      {done && <p className="lg-notice lg-notice--ok" role="status">Downloaded. Check your downloads folder.</p>}
      {error && <p className="lg-error" role="alert">{error}</p>}

      <button className="lg-btn lg-btn--primary" type="button" onClick={handleDownload} disabled={busy}>
        {busy ? 'Preparing image…' : done ? 'Download again' : 'Download report card'}
      </button>
    </AuthCard>
  )
}