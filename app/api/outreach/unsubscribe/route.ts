import { unsubscribeByToken } from '@/lib/outreach/mailer';

export const dynamic = 'force-dynamic';

// RFC 8058 one-click unsubscribe: mail clients POST here from the List-Unsubscribe header.
// Public on purpose; the token is the only credential.
export async function POST(request: Request) {
  const token = new URL(request.url).searchParams.get('t') ?? '';
  await unsubscribeByToken(token);
  return new Response('Unsubscribed', { status: 200 });
}
