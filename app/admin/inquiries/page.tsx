import { db } from "@/utils/db/db";
import { projectEnquiriesTable } from "@/utils/db/schema";
import { desc } from "drizzle-orm";
import { Inbox, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import MiniStat from "@/components/admin/MiniStat";
import StatusBadge from "@/components/admin/StatusBadge";
import EmptyState from "@/components/admin/EmptyState";
import DatabaseError from "@/components/admin/DatabaseError";
import { AdminCard, Badge, CardHeader, DataTable, table } from "@/components/admin/ui";
import { formatDate } from "@/lib/admin/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "Inquiries | Admin | RactroTech", description: "Manage project inquiries" };

/** The start-project form stores a slug; show the name the visitor picked. Anything else shows as entered. */
const PROJECT_TYPE_LABEL: Record<string, string> = {
  fullstack: "Full stack project",
  chatbot: "AI & chatbot",
  cloud: "Cloud services (AWS/Azure)",
  saas: "SaaS platform",
  mobile: "Mobile development",
  ecommerce: "E-commerce store",
  automation: "Internal automation",
};

const RESOLVED = new Set(["responded", "converted", "closed"]);
const HIGH_PRIORITY = new Set(["high", "urgent"]);

export default async function AdminInquiriesPage() {
  try {
    // Unpaginated on purpose: the counts below are taken from this list, so they cover every inquiry.
    const inquiries = await db.select().from(projectEnquiriesTable).orderBy(desc(projectEnquiriesTable.created_at));

    const totalCount = inquiries.length;
    const newCount = inquiries.filter((i) => i.status === "new").length;
    const resolvedCount = inquiries.filter((i) => RESOLVED.has(i.status)).length;
    const highPriorityCount = inquiries.filter((i) => HIGH_PRIORITY.has(i.priority)).length;

    return (
      <div className="space-y-6">
        <PageHeader
          title="Inquiries"
          subtitle="Project requests from the website, newest first."
          backHref="/admin"
        />

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Inquiry counts">
          <MiniStat icon={<Inbox />} value={totalCount} label="Total" />
          <MiniStat icon={<Clock />} value={newCount} label="New" />
          <MiniStat icon={<CheckCircle />} value={resolvedCount} label="Resolved" />
          <MiniStat icon={<AlertTriangle />} value={highPriorityCount} label="High or urgent" />
        </section>

        <AdminCard>
          <CardHeader title="All inquiries" description="Open one to reply, change its status or add a note." />
          {inquiries.length === 0 ? (
            <EmptyState icon={<Inbox />} title="No inquiries yet" description="Inquiries from your website forms will appear here." />
          ) : (
            <DataTable>
              <thead>
                <tr className={table.headRow}>
                  <th className={table.th}>Name</th>
                  <th className={table.th}>Phone</th>
                  <th className={table.th}>Email</th>
                  <th className={table.th}>Type</th>
                  <th className={table.th}>Priority</th>
                  <th className={table.th}>Status</th>
                  <th className={table.th}>Received</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq) => (
                  <tr key={inq.id} className={table.row}>
                    <td className={table.td}>
                      <Link
                        href={`/admin/inquiries/${inq.id}`}
                        className="group block max-w-[260px] rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mkt-violet"
                      >
                        <span className="block truncate font-medium text-mkt-ink transition-colors group-hover:text-mkt-violet">{inq.name}</span>
                        <span className="mt-0.5 block truncate text-[13px] text-mkt-muted">{inq.description}</span>
                      </Link>
                    </td>
                    <td className={`${table.td} whitespace-nowrap ${table.muted}`}>{inq.phone}</td>
                    <td className={`${table.td} ${table.muted}`}>{inq.email || "—"}</td>
                    <td className={table.td}>
                      <Badge>{PROJECT_TYPE_LABEL[inq.project_type] ?? inq.project_type}</Badge>
                    </td>
                    <td className={table.td}>
                      <StatusBadge status={inq.priority} />
                    </td>
                    <td className={table.td}>
                      <StatusBadge status={inq.status} />
                    </td>
                    <td className={`${table.td} whitespace-nowrap tabular-nums ${table.muted}`}>
                      <time dateTime={inq.created_at.toISOString()}>{formatDate(inq.created_at)}</time>
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          )}
        </AdminCard>
      </div>
    );
  } catch (error) {
    console.error("Inquiries Page DB Error:", error);
    return <DatabaseError message={error instanceof Error ? error.message : String(error)} />;
  }
}
