import { NextResponse, type NextRequest } from 'next/server';

import { logActivity } from '@/lib/admin/guard';
import { connectAccount } from '@/lib/outreach/gmail';
import { getAdminUser } from '@/utils/admin';

export const dynamic = 'force-dynamic';

// Google redirects here after "Connect Gmail". Must be listed as an authorised redirect URI.
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const back = (params: Record<string, string>) => {
    const res = NextResponse.redirect(new URL(`/admin/outreach/mail-accounts?${new URLSearchParams(params)}`, url));
    res.cookies.delete('google_oauth_state');
    return res;
  };

  const admin = await getAdminUser();
  if (!admin) return NextResponse.redirect(new URL('/admin/login', url));

  if (url.searchParams.get('error')) return back({ error: url.searchParams.get('error')! });
  const state = url.searchParams.get('state');
  if (!state || state !== request.cookies.get('google_oauth_state')?.value) {
    return back({ error: 'Sign-in expired or was tampered with. Try again.' });
  }
  try {
    const email = await connectAccount(url.searchParams.get('code') ?? '');
    await logActivity(admin.id, `Connected Gmail sender ${email}`, 'outreach_mail_account');
    return back({ connected: email });
  } catch (e) {
    return back({ error: e instanceof Error ? e.message : String(e) });
  }
}
