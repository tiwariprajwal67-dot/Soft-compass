// Small helpers for the person's display name (stored by Supabase in the account's "metadata").
export const NAME_MAX = 60

// Tidies a name: removes hidden control characters, squeezes extra spaces, limits the length.
export function cleanName(value) {
  const visible = Array.from(String(value ?? '')).filter((ch) => {
    const code = ch.charCodeAt(0)
    return code >= 32 && code !== 127
  })
  return visible.join('').replace(/\s+/g, ' ').trim().slice(0, NAME_MAX)
}

export function getDisplayName(user) {
  return cleanName(user?.user_metadata?.full_name)
}