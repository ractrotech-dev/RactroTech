'use server'

import { createClient } from '@/utils/supabase/server'
import { ensureAuthUserInDb } from '@/utils/auth-user-sync'
import { redirect } from 'next/navigation'
import { getClientIp } from '@/lib/auth/client-ip'
import { AUTH_ERRORS } from '@/lib/auth/constants'
import { checkLoginRateLimit } from '@/lib/security/rate-limit'
import { logSecurityEvent } from '@/lib/security/logger'
import { isEmailVerified } from '@/lib/auth/verification'

import { getSiteUrl } from '@/lib/seo';

const PUBLIC_URL = getSiteUrl();

export async function loginAdminUser(formData: FormData) {
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = formData.get('password') as string

  const ip = getClientIp()
  if (!checkLoginRateLimit(ip, email)) {
    logSecurityEvent({ type: 'rate_limit', ip, path: '/admin/login', action: 'login' })
    redirect(`/admin/login?error=${encodeURIComponent(AUTH_ERRORS.rateLimited)}`)
  }

  const supabase = createClient()

  const { data: signInData, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    logSecurityEvent({
      type: 'auth_attempt',
      success: false,
      ip,
      action: 'admin_login',
      email,
      reason: 'invalid_credentials',
    })
    redirect(`/admin/login?error=${encodeURIComponent(AUTH_ERRORS.invalidCredentials)}`)
  }

  logSecurityEvent({ type: 'auth_attempt', success: true, ip, action: 'admin_login', email })

  if (signInData?.user && !isEmailVerified(signInData.user)) {
    await supabase.auth.signOut()
    redirect(`/admin/login?error=${encodeURIComponent(AUTH_ERRORS.emailNotVerified)}`)
  }

  if (signInData?.user) {
    await ensureAuthUserInDb(signInData.user)
  }

  redirect('/admin')
}

export async function signInWithGoogleAdmin() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${PUBLIC_URL}/auth/callback?next=/admin`,
    },
  })

  if (error) {
    throw new Error(AUTH_ERRORS.genericFailure)
  }

  if (data.url) redirect(data.url)
}

export async function signInWithGithubAdmin() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${PUBLIC_URL}/auth/callback?next=/admin`,
    },
  })

  if (error) {
    throw new Error(AUTH_ERRORS.genericFailure)
  }

  if (data.url) redirect(data.url)
}

export async function signInWithFacebookAdmin() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: `${PUBLIC_URL}/auth/callback?next=/admin`,
    },
  })

  if (error) {
    throw new Error(AUTH_ERRORS.genericFailure)
  }

  if (data.url) redirect(data.url)
}
