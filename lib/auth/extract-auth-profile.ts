import type { User } from '@supabase/supabase-js'

export type ExtractedAuthProfile = {
  email: string
  fullName: string | null
  avatarUrl: string | null
  provider: string
}

function readString(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed || null
}

export function extractOAuthAvatar(user: User): string | null {
  const meta = user.user_metadata as Record<string, unknown> | undefined
  const fromMeta = readString(meta?.avatar_url) ?? readString(meta?.picture)
  if (fromMeta) return fromMeta

  const googleIdentity = user.identities?.find((i) => i.provider === 'google')
  if (googleIdentity?.identity_data) {
    const data = googleIdentity.identity_data as Record<string, unknown>
    return readString(data.avatar_url) ?? readString(data.picture)
  }

  return null
}

export function extractAuthProvider(user: User): string {
  const appProvider = user.app_metadata?.provider
  if (typeof appProvider === 'string' && appProvider) return appProvider

  const providers = user.app_metadata?.providers
  if (Array.isArray(providers) && providers.length > 0 && typeof providers[0] === 'string') {
    return providers[0]
  }

  const identityProvider = user.identities?.[0]?.provider
  if (identityProvider) return identityProvider

  return 'email'
}

export function extractFullName(user: User): string | null {
  const meta = user.user_metadata as Record<string, unknown> | undefined
  return readString(meta?.full_name) ?? readString(meta?.name)
}

export function extractAuthProfile(user: User): ExtractedAuthProfile | null {
  const email = user.email?.trim().toLowerCase()
  if (!email) return null

  return {
    email,
    fullName: extractFullName(user),
    avatarUrl: extractOAuthAvatar(user),
    provider: extractAuthProvider(user),
  }
}

export function defaultUsernameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? 'user'
  const sanitized = local.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 24)
  return sanitized || 'user'
}
