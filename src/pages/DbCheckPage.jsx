import { useEffect, useState } from 'react'
import { supabase, supabaseUrl, keyKind } from '../lib/supabaseClient.js'
import './dbcheck.css'

const labels = { ok: 'OK', warn: 'Check', fail: 'Problem' }

// Error codes the database API sends back (verified against a real database):
//   42501  permission denied / blocked by a security rule
//   23514  a value broke a CHECK rule (the table's validation)
//   42P01 or PGRST205  the table does not exist (or is not exposed)
const tableMissing = (error) => error && ['42P01', 'PGRST205'].includes(error.code)

async function runChecks() {
  const results = []
  const add = (id, status, title, detail) => results.push({ id, status, title, detail })

  // 1. Settings present?
  if (!supabaseUrl || keyKind === 'missing') {
    add('config', 'fail', 'Settings not found',
      'Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.local (and to Vercel), then restart the dev server.')
    return results
  }
  add('config', 'ok', 'Settings found', 'The project URL and key are present.')

  // 2. Is it the right kind of key?
  if (keyKind === 'secret' || keyKind === 'legacy-service-role') {
    add('key', 'fail', 'A SECRET key is in the browser settings',
      'It has been ignored, but treat it as exposed: remove it from .env.local and Vercel, and rotate it in Supabase (Settings → API Keys). Use the publishable key instead.')
    return results
  }
  if (keyKind === 'publishable') {
    add('key', 'ok', 'Key type is correct', 'This is a publishable key, which is meant to be public.')
  } else if (keyKind === 'legacy-anon') {
    add('key', 'warn', 'This is an older "anon" key',
      'It works, but Supabase is retiring these. Switch to the publishable key (sb_publishable_…) when you can.')
  } else {
    add('key', 'warn', 'Key type not recognised',
      'Make sure you copied the publishable key from Supabase → Settings → API Keys, not any other value.')
  }

  // 3. Can we reach the project?
  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/health`, {
      headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
    })
    if (response.ok) {
      add('reach', 'ok', 'Project reachable', 'The website can talk to your Supabase project.')
    } else {
      add('reach', 'fail', 'Project answered with an error', `Status ${response.status}. Check the project URL and key.`)
      return results
    }
  } catch {
    add('reach', 'fail', 'Could not reach the project',
      'Check the project URL for typos, and that the project is not paused (free projects can pause when unused).')
    return results
  }

  // 4. Public visitors must NOT be able to read submissions.
  const read = await supabase.from('submissions').select('id').limit(1)
  let tableExists = true
  if (tableMissing(read.error)) {
    tableExists = false
    add('read', 'fail', 'The submissions table was not found',
      'Run the setup SQL (supabase-setup.sql) in Supabase → SQL Editor, then reload this page.')
  } else if (read.error && read.error.code === '42501') {
    add('read', 'ok', 'Public visitors cannot read submissions', 'The database refused the read, exactly as it should.')
  } else if (!read.error) {
    add('read', 'fail', 'Public visitors CAN query submissions',
      'Re-run the setup SQL. It removes the extra access. Do not collect any real data until this shows OK.')
  } else {
    add('read', 'warn', 'Unexpected answer when testing a read', `${read.error.code || ''} ${read.error.message}`.trim())
  }

  // 5. Public visitors must be able to ADD a submission.
  //    This sends a deliberately invalid row. The database rejects it on its validation
  //    rule AFTER the permission checks pass, so nothing is saved.
  if (tableExists) {
    const write = await supabase.from('submissions').insert({
      assessment: 'connection-test',
      answers: {},
      scores: {},
      consent_version: 'test',
    })
    if (write.error && write.error.code === '23514') {
      add('write', 'ok', 'Public visitors can submit', 'Permissions allow adding a submission. This test row was rejected on purpose, so nothing was saved.')
    } else if (write.error && write.error.code === '42501') {
      add('write', 'fail', 'Public visitors are blocked from submitting',
        'Re-run the setup SQL. Without this, nobody could save results.')
    } else if (!write.error) {
      add('write', 'warn', 'A test row may have been saved',
        'The check rule did not reject it. Open Table Editor → submissions and delete any row whose assessment is "connection-test", then re-run the setup SQL.')
    } else {
      add('write', 'warn', 'Unexpected answer when testing a submit', `${write.error.code || ''} ${write.error.message}`.trim())
    }
  }

  return results
}

export default function DbCheckPage() {
  const [results, setResults] = useState(null)

  useEffect(() => {
    let cancelled = false
    runChecks().then((list) => {
      if (!cancelled) setResults(list)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const hasProblem = results?.some((r) => r.status === 'fail')
  const allOk = results && results.every((r) => r.status === 'ok')

  return (
    <div className="assess">
      <section className="assess__card" aria-labelledby="dbc-title">
        <span className="eyebrow">Setup check</span>
        <h1 id="dbc-title">Database connection</h1>
        <p className="assess__lead">
          A temporary page that checks your Supabase setup and its security.
          It never shows or stores your keys. Delete it once you are done.
        </p>

        {!results && <p className="dbc__loading" role="status">Running checks…</p>}

        {results && (
          <>
            <ul className="dbc">
              {results.map((r) => (
                <li key={r.id} className="dbc__item" data-status={r.status}>
                  <span className="dbc__badge">{labels[r.status]}</span>
                  <div>
                    <p className="dbc__title">{r.title}</p>
                    <p className="dbc__detail">{r.detail}</p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="dbc__summary" role="status">
              {allOk && 'All checks passed. Your database is connected and locked down correctly.'}
              {!allOk && hasProblem && 'At least one problem needs fixing before collecting any real data.'}
              {!allOk && !hasProblem && 'Everything essential works, but please read the items marked Check.'}
            </p>
          </>
        )}
      </section>
    </div>
  )
}