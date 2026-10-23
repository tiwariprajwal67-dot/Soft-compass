import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'
import { getDisplayName } from '../auth/profile.js'
import { isSupabaseConfigured } from '../lib/supabaseClient.js'
import { REQUIRE_SIGN_IN_FOR_DOWNLOAD } from './config.js'
import { buildSpec } from './buildSpec.js'
import { downloadReportCard } from './reportCard.js'
import { savePending } from './pendingReport.js'
import './report.css'

// Put this inside a results page's buttons row:
//   <DownloadReportButton kind="personality" results={results} />
//   <DownloadReportButton kind="riasec" results={results} />
export default function DownloadReportButton({ kind, results }) {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  // If accounts are not switched on at all, downloading is open to everyone (without a name).
  const mustSignIn = REQUIRE_SIGN_IN_FOR_DOWNLOAD && isSupabaseConfigured && !user

  async function handleClick() {
    if (busy || loading) return

    if (mustSignIn) {
      // Keep the scores for a short while, so they are still here after signing in.
      savePending(kind, results)
      navigate('/login', { state: { from: '/report' } })
      return
    }

    setError('')
    setBusy(true)
    try {
      await downloadReportCard(buildSpec({ kind, results, name: getDisplayName(user) }))
    } catch {
      setError('Sorry, the image could not be created. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  let label = 'Download report card'
  if (busy) label = 'Preparing image…'
  else if (mustSignIn && !loading) label = 'Sign in to download report card'

  return (
    <span className="report-btn">
      <button type="button" className="btn btn--ghost" onClick={handleClick} disabled={busy || loading}>
        {label}
      </button>
      {error && (
        <span className="report-error" role="alert">
          {error}
        </span>
      )}
    </span>
  )
}