import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

import { getSiteUrl } from '@/lib/seo';

const PUBLIC_URL = getSiteUrl();

/**
 * Exchanges a password-recovery code for a session server-side so the token
 * never transits through a client form. Supabase enforces OTP expiry (default 1h).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const origin = PUBLIC_URL.replace(/\/$/, '')

  if (!code) {
    return NextResponse.redirect(`${origin}/forgot-password?error=missing_code`)
  }

  const supabase = createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${origin}/forgot-password?error=expired_link`)
  }

  return NextResponse.redirect(`${origin}/forgot-password/reset`)
}
