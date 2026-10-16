import { db } from "@/utils/db/db";
import { clientsTable, type SelectClient } from "@/utils/db/schema";
import { desc } from "drizzle-orm";
import { UserCircle, Plus, Users, UserPlus, UserCheck } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import MiniStat from "@/components/admin/MiniStat";
import StatusBadge from "@/components/admin/StatusBadge";
import EmptyState from "@/components/admin/EmptyState";
import { AdminCard, CardHeader, DataTable, Notice, buttonClass, table } from "@/components/admin/ui";
import { formatDate } from "@/lib/admin/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "Clients | Admin | RactroTech", description: "Manage clients" };

export default async function AdminClientsPage() {
  // `null` means the query failed: every count shows "—" instead of a made-up 0.
  let clients: SelectClient[] | null = null;
  let loadError: string | null = null;
  try {
    // Unpaginated on purpose: the counts below are taken from this list, so they cover every client.
    clients = await db.select().from(clientsTable).orderBy(desc(clientsTable.created_at));
  } catch (error) {
    console.error("Clients Page DB Error:", error);
    loadError = error instanceof Error ? error.message : String(error);
  }

  const countWhere = (status: SelectClient["status"]) => (clients ? clients.filter((c) => c.status === status).length : null);
  const totalCount = clients ? clients.length : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        subtitle="Everyone in the CRM, newest first."
        backHref="/admin"
        actions={
          <button type="button" className={buttonClass("primary")}>
            <Plus aria-hidden /> Add client
          </button>
        }
      />

      {loadError ? (
        <Notice tone="amber" title="Clients couldn’t be loaded">
          Counts show “—” until the query succeeds. Error: {loadError}
        </Notice>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Client counts">
        <MiniStat icon={<Users />} value={totalCount} label="Total" />
        <MiniStat icon={<UserPlus />} value={countWhere("lead")} label="Leads" />
        <MiniStat icon={<UserCircle />} value={countWhere("onboarding")} label="Onboarding" />
        <MiniStat icon={<UserCheck />} value={countWhere("active")} label="Active" />
      </section>

      <AdminCard>
        <CardHeader title="All clients" description="Open one to see their projects and change their status." />
        {clients === null ? (
          <p className="px-5 py-10 text-center text-[14px] text-mkt-muted">The client list is unavailable right now.</p>
        ) : clients.length === 0 ? (
          <EmptyState icon={<UserCircle />} title="No clients yet" description="Add your first client to start managing relationships." />
        ) : (
          <DataTable>
            <thead>
              <tr className={table.headRow}>
                <th className={table.th}>Client</th>
                <th className={table.th}>Company</th>
                <th className={table.th}>Email</th>
                <th className={table.th}>Status</th>
                <th className={table.th}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className={table.row}>
                  <td className={table.td}>
                    <Link
                      href={`/admin/clients/${c.id}`}
                      className="group flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mkt-violet"
                    >
                      <span
                        aria-hidden
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mkt-lavender text-[13px] font-semibold text-mkt-violet"
                      >
                        {c.name.charAt(0).toUpperCase()}
                      </span>
                      <span className="font-medium text-mkt-ink transition-colors group-hover:text-mkt-violet">{c.name}</span>
                    </Link>
                  </td>
                  <td className={`${table.td} ${table.muted}`}>{c.company || "—"}</td>
                  <td className={`${table.td} ${table.muted}`}>{c.email}</td>
                  <td className={table.td}>
                    <StatusBadge status={c.status} />
                  </td>
                  <td className={`${table.td} whitespace-nowrap tabular-nums ${table.muted}`}>
                    <time dateTime={c.created_at.toISOString()}>{formatDate(c.created_at)}</time>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        )}
      </AdminCard>
    </div>
  );
}
