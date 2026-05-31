import { db } from "@/utils/db/db";
import { clientsTable } from "@/utils/db/schema";
import { desc } from "drizzle-orm";
import { UserCircle, Plus, Users, UserPlus, UserCheck } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import MiniStat from "@/components/admin/MiniStat";
import StatusBadge from "@/components/admin/StatusBadge";
import EmptyState from "@/components/admin/EmptyState";

export const dynamic = "force-dynamic";
export const metadata = { title: "Clients | Admin | RactroTech", description: "Manage clients" };

export default async function AdminClientsPage() {
  let clients: any[] = [];
  try {
    clients = await db.select().from(clientsTable).orderBy(desc(clientsTable.created_at));
  } catch { /* table may not exist */ }

  const totalCount = clients.length;
  const activeCount = clients.filter((c) => c.status === 'active').length;
  const leadCount = clients.filter((c) => c.status === 'lead').length;
  const onboardingCount = clients.filter((c) => c.status === 'onboarding').length;

  return (
    <div className="space-y-6">
      <PageHeader title="Clients" subtitle={`${totalCount} total clients`} backHref="/admin"
        actions={
          <button className="flex items-center gap-2 border-2 border-black bg-yellow-400 px-4 py-2 text-[10px] font-black tracking-widest transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Plus size={14} /> Add Client
          </button>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MiniStat icon={<Users size={16} className="text-black" />} value={totalCount} label="Total" color="bg-blue-400" />
        <MiniStat icon={<UserPlus size={16} className="text-black" />} value={leadCount} label="Leads" color="bg-yellow-400" />
        <MiniStat icon={<UserCircle size={16} className="text-black" />} value={onboardingCount} label="Onboarding" color="bg-purple-400" />
        <MiniStat icon={<UserCheck size={16} className="text-black" />} value={activeCount} label="Active" color="bg-emerald-400" />
      </div>

      <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="border-b-4 border-black px-5 py-3">
          <h2 className="text-xs font-black tracking-[0.2em]">All Clients</h2>
        </div>
        {clients.length === 0 ? (
          <EmptyState icon={UserCircle} title="No clients yet" description="Add your first client to start managing relationships." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-black/10 bg-gray-50">
                  {['Client', 'Company', 'Email', 'Status', 'Joined'].map((h) => (
                    <th key={h} className="px-4 py-3 text-[10px] font-black tracking-wider text-black/50">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id} className="border-b border-black/5 hover:bg-yellow-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/clients/${c.id}`} className="flex items-center gap-3 group">
                        <div className="flex h-8 w-8 items-center justify-center border-2 border-black bg-yellow-400 text-[10px] font-black group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">{c.name.charAt(0).toUpperCase()}</div>
                        <span className="text-xs font-bold group-hover:text-yellow-600 transition-colors">{c.name}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-black/60">{c.company || '—'}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-black/60">{c.email}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3 text-[10px] font-bold text-black/40">{c.created_at ? new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
