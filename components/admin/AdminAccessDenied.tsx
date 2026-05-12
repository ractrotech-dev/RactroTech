import Link from 'next/link';

export default function AdminAccessDenied({ email }: { email: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-neutral-100 via-white to-amber-50/50 p-6">
      <div className="max-w-lg border-4 border-black bg-white p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40">Admin</p>
        <h1 className="mt-2 text-2xl font-black uppercase tracking-tight text-black">Access not granted</h1>
        <p className="mt-4 text-sm font-semibold leading-relaxed text-black/70">
          You are signed in as <span className="font-bold text-black">{email}</span>, but this account does not
          have an admin role in the database yet, so /admin cannot load.
        </p>
        <ul className="mt-6 list-inside list-disc space-y-2 text-xs font-bold text-black/60">
          <li>
            Add your email to <code className="font-mono text-[11px] text-black">ADMIN_BOOTSTRAP_EMAILS</code> in{' '}
            <code className="font-mono text-[11px] text-black">.env</code>, then sign out and sign in again (syncs
            role to <code className="font-mono">super_admin</code>).
          </li>
          <li>
            Or set <code className="font-mono text-[11px] text-black">role</code> on your row in{' '}
            <code className="font-mono text-[11px] text-black">users_table</code> to admin, manager, developer, or
            super_admin (Supabase SQL editor).
          </li>
          <li className="marker:text-amber-600">
            Local only: <code className="font-mono text-[11px] text-black">ADMIN_DEV_ACCESS_EMAILS</code> (comma
            list) while <code className="font-mono text-[11px] text-black">NODE_ENV=development</code>.
          </li>
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="border-4 border-black bg-yellow-400 px-5 py-2.5 text-[10px] font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5"
          >
            Back to site
          </Link>
          <Link
            href="/admin/login"
            className="border-4 border-black bg-white px-5 py-2.5 text-[10px] font-black uppercase tracking-wider text-black transition-transform hover:-translate-y-0.5"
          >
            Switch account
          </Link>
        </div>
      </div>
    </div>
  );
}
