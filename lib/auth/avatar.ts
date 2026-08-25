/** Avatar display helpers — priority: OAuth URL → profile upload → initials */

export function initialsFromName(fullName: string, email: string): string {
  const name = fullName.trim()
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase()
    }
    if (parts[0]!.length >= 2) return parts[0]!.slice(0, 2).toUpperCase()
    return parts[0]!.slice(0, 1).toUpperCase()
  }
  const local = email.split('@')[0] ?? '?'
  return local.slice(0, 2).toUpperCase()
}

export function resolveAvatarUrl(
  oauthAvatar: string | null | undefined,
  profileAvatar: string | null | undefined,
): string | null {
  const oauth = oauthAvatar?.trim()
  if (oauth) {
    try {
      const u = new URL(oauth)
      if (u.protocol === 'https:' || u.protocol === 'http:') return oauth
    } catch {
      /* ignore */
    }
  }
  const uploaded = profileAvatar?.trim()
  if (uploaded) {
    try {
      const u = new URL(uploaded)
      if (u.protocol === 'https:' || u.protocol === 'http:') return uploaded
    } catch {
      /* ignore */
    }
  }
  return null
}
