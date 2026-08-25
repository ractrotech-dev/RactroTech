'use client';

import { AlertTriangle, Database, RefreshCw } from 'lucide-react';

export default function DatabaseError({ message }: { message?: string }) {
  return (
    <div className="mkt-shell flex min-h-[420px] max-w-xl flex-col items-center justify-center py-16 text-center">
      <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
        <Database size={30} strokeWidth={1.75} aria-hidden />
      </span>

      <h2 className="mkt-display text-[26px] leading-[1.15] sm:text-[30px]">
        Database connection failed
      </h2>

      <div className="mt-6 w-full rounded-2xl border border-mkt-line bg-white p-5 text-left">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 shrink-0 text-red-600" size={18} aria-hidden />
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-mkt-muted">
              Error detail
            </p>
            <p className="mt-1.5 text-[15px] leading-relaxed text-mkt-muted">
              {message ||
                'The application could not establish a connection to the database. This usually happens if the DATABASE_URL is missing or the database server is offline.'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button onClick={() => window.location.reload()} className="mkt-btn-primary">
          <RefreshCw size={15} aria-hidden /> Retry connection
        </button>
        <a
          href="https://supabase.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="mkt-btn-ghost"
        >
          Open Supabase dashboard
        </a>
      </div>

      <p className="mt-8 text-[13px] text-mkt-muted/70">
        Check your .env file and ensure DATABASE_URL is set correctly.
      </p>
    </div>
  );
}
