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

export const dynamic = "force-dynamic";
export const metadata = { title: "Inquiries | Admin | RactroTech", description: "Manage project inquiries" };

export default async function AdminInquiriesPage() {
  try {
    const inquiries = await db.select().from(projectEnquiriesTable).orderBy(desc(projectEnquiriesTable.created_at));
    const totalCount = inquiries.length;

    // Count by status (graceful fallback if status column doesn't exist)
    let newCount = totalCount, inProgressCount = 0, respondedCount = 0, urgentCount = 0;
    try {
      newCount = inquiries.filter((i: any) => i.status === 'new').length;
      inProgressCount = inquiries.filter((i: any) => i.status === 'in_progress').length;
      respondedCount = inquiries.filter((i: any) => i.status === 'responded' || i.status === 'converted' || i.status === 'closed').length;
      urgentCount = inquiries.filter((i: any) => i.priority === 'urgent' || i.priority === 'high').length;
    } catch { /* columns may not exist */ }

    return (
      <div className="space-y-6">
        <PageHeader title="Inquiries" subtitle={`${totalCount} total inquiries`} backHref="/admin" />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MiniStat icon={<Inbox size={16} className="text-black" />} value={totalCount} label="Total" color="bg-blue-400" />
          <MiniStat icon={<Clock size={16} className="text-black" />} value={newCount} label="New" color="bg-yellow-400" />
          <MiniStat icon={<CheckCircle size={16} className="text-black" />} value={respondedCount} label="Resolved" color="bg-emerald-400" />
          <MiniStat icon={<AlertTriangle size={16} className="text-black" />} value={urgentCount} label="Urgent" color="bg-red-400" />
        </div>

        <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="border-b-4 border-black px-5 py-3">
            <h2 className="text-xs font-black uppercase tracking-[0.2em]">All Inquiries</h2>
          </div>
          <div className="overflow-x-auto">
            {inquiries.length === 0 ? (
              <EmptyState icon={Inbox} title="No inquiries yet" description="Inquiries from your website forms will appear here." />
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-black/10 bg-gray-50">
                    {['Name', 'Phone', 'Email', 'Type', 'Priority', 'Status', 'Date'].map((h) => (
                      <th key={h} className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-black/50">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inq: any) => (
                    <tr key={inq.id} className="border-b border-black/5 transition-colors hover:bg-yellow-50">
                      <td className="px-4 py-3">
                        <Link href={`/admin/inquiries/${inq.id}`} className="group">
                          <p className="text-xs font-bold group-hover:text-yellow-600 transition-colors">{inq.name}</p>
                          <p className="mt-0.5 max-w-[180px] truncate text-[10px] text-black/40">{inq.description}</p>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-black/60">{inq.phone}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-black/60">{inq.email || '—'}</td>
                      <td className="px-4 py-3">
                        <span className="border-2 border-black bg-yellow-400 px-2 py-0.5 text-[9px] font-black uppercase">{inq.project_type}</span>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={inq.priority || 'medium'} /></td>
                      <td className="px-4 py-3"><StatusBadge status={inq.status || 'new'} /></td>
                      <td className="whitespace-nowrap px-4 py-3 text-[10px] font-bold text-black/40">
                        {inq.created_at ? new Date(inq.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error: any) {
    console.error("Inquiries Page DB Error:", error);
    return <DatabaseError message={error.message} />;
  }
}
