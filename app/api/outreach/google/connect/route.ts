import { randomBytes } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';

import { authUrl } from '@/lib/outreach/gmail';
import { getAdminUser } from '@/utils/admin';

export const dynamic = 'force-dynamic';

// Starts "Connect Gmail" (Admin → Lead finder → Mail accounts): redirects to Google's consent screen.
export async function GET(request: NextRequest) {
  if (!(await getAdminUser())) return NextResponse.redirect(new URL('/admin/login', request.url));

  const state = randomBytes(16).toString('hex');
  const res = NextResponse.redirect(authUrl(state));
  res.cookies.set('google_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  });
  return res;
}
