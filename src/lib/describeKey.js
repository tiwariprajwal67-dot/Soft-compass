// Works out what kind of Supabase key a string is, WITHOUT sending it anywhere.
// Used to refuse a dangerous key (one that can bypass all security) in the browser.
//
//   'publishable'         sb_publishable_...   safe for the browser (the new kind)
//   'legacy-anon'         old JWT with role "anon", safe for the browser but being retired
//   'secret'              sb_secret_...        NEVER use in the browser
//   'legacy-service-role' old JWT with role "service_role"   NEVER use in the browser
//   'unknown' / 'missing'
export function describeKey(key) {
  if (!key) return 'missing'
  if (key.startsWith('sb_secret_')) return 'secret'
  if (key.startsWith('sb_publishable_')) return 'publishable'

  const parts = key.split('.')
  if (parts.length === 3) {
    try {
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
      if (payload.role === 'service_role') return 'legacy-service-role'
      if (payload.role === 'anon') return 'legacy-anon'
    } catch {
      /* not a readable token: fall through to "unknown" */
    }
  }
  return 'unknown'
}