import { redirect } from 'next/navigation';

import { unsubscribeByToken } from '@/lib/outreach/mailer';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Unsubscribe | RactroTech', robots: { index: false, follow: false } };

// Linked from the footer of every Lead finder email. Public; asks for a click so link
// scanners in mail filters don't unsubscribe people by opening the link.
export default function UnsubscribePage({ searchParams }: { searchParams: { t?: string; done?: string } }) {
  const token = typeof searchParams.t === 'string' ? searchParams.t : '';

  async function confirm() {
    'use server';
    await unsubscribeByToken(token);
    redirect('/unsubscribe?done=1');
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-mkt-lavender px-4">
      <div className="w-full max-w-md rounded-2xl border border-mkt-line bg-mkt-surface p-8 text-center text-mkt-ink">
        {searchParams.done ? (
          <p className="text-[15px]">You’ve been unsubscribed and won’t receive further emails from us.</p>
        ) : (
          <form action={confirm} className="space-y-5">
            <p className="text-[15px]">Unsubscribe from future emails?</p>
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-mkt-violet px-5 text-[14px] font-medium text-white hover:bg-mkt-violet-deep"
            >
              Unsubscribe
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
