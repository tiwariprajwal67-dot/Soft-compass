// When a visitor who is not signed in presses "download", their results would normally be lost
// while they sign in. So we keep just the SCORES on this device for up to an hour, and delete them
// as soon as the report has been downloaded. (Their answers are never stored here.)
const KEY = 'soft-compass-pending-report'
const MAX_AGE_MS = 60 * 60 * 1000

function looksValid(kind, results) {
  const number = (v) => typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 100
  if (kind === 'personality') {
    return Array.isArray(results) && results.length > 0 &&
      results.every((r) => r && typeof r.key === 'string' && typeof r.label === 'string' && number(r.percent))
  }
  if (kind === 'riasec') {
    return Boolean(results) && typeof results.code === 'string' && /^[RIASEC]{3}$/.test(results.code) &&
      Array.isArray(results.scores) && results.scores.every((s) => s && typeof s.name === 'string' && number(s.percent)) &&
      Array.isArray(results.top) && results.top.every((t) => t && typeof t.name === 'string' && Array.isArray(t.careers))
  }
  return false
}

export function savePending(kind, results) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ kind, results, savedAt: Date.now() }))
  } catch {
    /* storage unavailable: the person will simply need to retake the test */
  }
}

export function loadPending() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data || Date.now() - data.savedAt > MAX_AGE_MS || !looksValid(data.kind, data.results)) {
      localStorage.removeItem(KEY)
      return null
    }
    return { kind: data.kind, results: data.results }
  } catch {
    return null
  }
}

export function clearPending() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* nothing to do */
  }
}