'use client';

import { Database, RefreshCw } from 'lucide-react';

import { buttonClass } from '@/components/admin/ui';

/** Shown when a page's queries cannot reach Postgres. Says what to check, then offers a retry. */
export default function DatabaseError({ message }: { message?: string }) {
  return (
    <div className="mx-auto flex min-h-[420px] max-w-lg flex-col items-center justify-center px-4 py-16 text-center text-mkt-ink">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
        <Database className="h-6 w-6" strokeWidth={1.75} aria-hidden />
      </span>

      <h2 className="mt-5 font-display text-[22px] font-semibold tracking-[-0.01em]">Can’t reach the database</h2>
      <p className="mt-2 text-[14px] leading-6 text-mkt-muted">
        Check that <code className="rounded bg-mkt-ink/[0.06] px-1.5 py-0.5 text-[13px]">DATABASE_URL</code> is set in{' '}
        <code className="rounded bg-mkt-ink/[0.06] px-1.5 py-0.5 text-[13px]">.env.local</code> and that the database is running.
      </p>

      {message ? (
        <pre className="mt-5 w-full overflow-x-auto whitespace-pre-wrap rounded-xl border border-mkt-line bg-mkt-ink/[0.03] p-4 text-left text-[12px] leading-5 text-mkt-muted">
          {message}
        </pre>
      ) : null}

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={() => window.location.reload()} className={buttonClass('primary')}>
          <RefreshCw aria-hidden /> Try again
        </button>
        <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className={buttonClass('secondary')}>
          Open Supabase
        </a>
      </div>
    </div>
  );
}
