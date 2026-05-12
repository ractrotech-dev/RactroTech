import {
  Users,
  Inbox,
  FolderKanban,
  DollarSign,
  UserCircle,
  Bell,
  Activity,
  ShieldCheck,
  Gauge,
  Sparkles,
} from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import DashboardCharts from './DashboardCharts';
import DashboardActivity from './DashboardActivity';
import DatabaseError from '@/components/admin/DatabaseError';
import { getAdminDashboardSnapshot } from '@/lib/admin/dashboard-snapshot';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const snapshot = await getAdminDashboardSnapshot();

  if (!snapshot.dbReachable && snapshot.dbErrorMessage) {
    return <DatabaseError message={snapshot.dbErrorMessage} />;
  }

  const { counts, recentUsers, activityItems, inquirySeries, partialErrors } = snapshot;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden border-4 border-black bg-black p-6 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-yellow-400/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-10 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.35em] text-yellow-400">
              <Sparkles size={14} className="shrink-0" />
              RactroTech Control
            </p>
            <h1 className="text-3xl font-black uppercase tracking-tight md:text-4xl">
              Operations dashboard
            </h1>
            <p className="text-sm font-semibold leading-relaxed text-white/70">
              Same brutalist energy as the public site — tuned for clarity, speed, and secure day‑to‑day
              admin work. Metrics below read from your connected database; Supabase handles auth sessions.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <span className="inline-flex items-center gap-2 border-2 border-yellow-400/50 bg-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-wider backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Database live
            </span>
            <span className="inline-flex items-center gap-2 border-2 border-white/20 bg-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-white/80 backdrop-blur-sm">
              <ShieldCheck size={14} />
              RBAC enforced
            </span>
            <span className="inline-flex items-center gap-2 border-2 border-white/20 bg-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-white/80 backdrop-blur-sm">
              <Gauge size={14} />
              Force dynamic
            </span>
          </div>
        </div>
      </section>

      {partialErrors.length > 0 ? (
        <div
          role="status"
          className="border-4 border-amber-500 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
        >
          <p className="font-black uppercase tracking-wider text-amber-900/80">Partial data load</p>
          <p className="mt-1 text-[11px] font-semibold leading-snug text-amber-950/90">
            Some widgets fell back to safe defaults. First issue: {partialErrors[0]}
          </p>
        </div>
      ) : null}

      {/* KPI strip */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard
          title="Directory users"
          value={counts.users}
          icon={<Users size={18} />}
          hint="Synced with Supabase Auth"
          href="/admin/users"
          accent="blue"
        />
        <StatCard
          title="Inquiries"
          value={counts.inquiries}
          icon={<Inbox size={18} />}
          hint={`${counts.newInquiries} marked new`}
          href="/admin/inquiries"
          accent="yellow"
        />
        <StatCard
          title="Clients"
          value={counts.clients}
          icon={<UserCircle size={18} />}
          hint="CRM pipeline"
          href="/admin/clients"
          accent="green"
        />
        <StatCard
          title="Projects"
          value={counts.projects}
          icon={<FolderKanban size={18} />}
          hint={`${counts.activeProjects} in active states`}
          href="/admin/projects"
          accent="red"
        />
        <StatCard
          title="Revenue"
          value="—"
          icon={<DollarSign size={18} />}
          hint="Stripe / billing wiring optional"
          accent="violet"
        />
        <StatCard
          title="Unread alerts"
          value={counts.unreadNotifications}
          icon={<Bell size={18} />}
          hint="In-app notifications"
          href="/admin/notifications"
          accent="blue"
        />
      </section>

      <DashboardCharts inquirySeries={inquirySeries} />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        <DashboardActivity items={activityItems} />

        <div className="space-y-4">
          <div className="border-4 border-black bg-white/90 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] backdrop-blur-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-black px-5 py-3">
              <h3 className="text-xs font-black uppercase tracking-[0.2em]">Latest accounts</h3>
              <Link
                href="/admin/users"
                className="text-[10px] font-black uppercase tracking-wider text-black/40 underline-offset-2 hover:text-black hover:underline"
              >
                Manage users
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-black/10 bg-neutral-50/90">
                    <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-black/45">
                      Name
                    </th>
                    <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-black/45">
                      Email
                    </th>
                    <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-black/45">
                      Plan
                    </th>
                    <th className="px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-black/45">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-xs font-bold text-black/35">
                        No rows returned yet.
                      </td>
                    </tr>
                  ) : (
                    recentUsers.map((u) => (
                      <tr
                        key={u.id}
                        className="border-b border-black/5 transition-colors hover:bg-yellow-50/80"
                      >
                        <td className="px-4 py-2.5 text-xs font-bold">{u.name}</td>
                        <td className="px-4 py-2.5 text-xs font-semibold text-black/60">{u.email}</td>
                        <td className="px-4 py-2.5">
                          <span className="border-2 border-black bg-yellow-400 px-2 py-0.5 text-[9px] font-black uppercase">
                            {u.plan}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`border-2 px-2 py-0.5 text-[9px] font-black uppercase ${
                              u.role === 'admin' || u.role === 'super_admin'
                                ? 'border-black bg-black text-white'
                                : 'border-black/30 bg-neutral-100 text-black/60'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-3 border-4 border-black bg-white/80 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] backdrop-blur-sm sm:grid-cols-2">
            <Link
              href="/admin/inquiries"
              className="group flex items-center gap-3 border-2 border-black/10 bg-white px-3 py-3 transition-all hover:-translate-y-0.5 hover:border-black hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              <Inbox size={18} className="text-black/70 group-hover:text-black" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-black/40">Pipeline</p>
                <p className="text-xs font-bold">Review inquiries</p>
              </div>
            </Link>
            <Link
              href="/admin/content"
              className="group flex items-center gap-3 border-2 border-black/10 bg-white px-3 py-3 transition-all hover:-translate-y-0.5 hover:border-black hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              <Activity size={18} className="text-black/70 group-hover:text-black" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-black/40">CMS</p>
                <p className="text-xs font-bold">Posts & SEO drafts</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
