import { getActivityLogs } from "@/app/admin/actions";
import { usersTable } from "@/utils/db/schema";
import { db } from "@/utils/db/db";
import { eq } from "drizzle-orm";
import { Shield, Search, Filter, History, User, Activity } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import EmptyState from "@/components/admin/EmptyState";

export const dynamic = "force-dynamic";
export const metadata = { title: "Audit Logs | Admin | RactroTech", description: "System audit trail" };

export default async function AdminAuditPage() {
  const logs = await getActivityLogs(200);
  
  // Fetch user names for the logs
  const userIds = Array.from(new Set(logs.map(l => l.user_id).filter(Boolean))) as string[];
  const users = userIds.length > 0 
    ? await db.select({ id: usersTable.id, name: usersTable.name }).from(usersTable)
    : [];
  
  const userMap = new Map(users.map(u => [u.id, u.name]));

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Audit Logs" 
        subtitle="Security and activity history" 
        backHref="/admin" 
      />

      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" size={16} />
          <input
            type="text"
            placeholder="Search logs..."
            className="w-full border-2 border-black bg-gray-50 py-2 pl-10 pr-4 text-[11px] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 border-2 border-black bg-white px-3 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all">
            <Filter size={14} /> All Entities
          </button>
        </div>
      </div>

      <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="border-b-4 border-black px-5 py-3 flex items-center gap-2">
          <History size={14} className="text-black/40" />
          <h2 className="text-xs font-black uppercase tracking-[0.2em]">Activity History</h2>
        </div>
        
        {logs.length === 0 ? (
          <EmptyState icon={Activity} title="No logs found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-black/10 bg-gray-50">
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-black/50">Timestamp</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-black/50">Admin</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-black/50">Action</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-black/50">Entity</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-black/50">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y border-black/5">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-yellow-50 transition-colors">
                    <td className="px-4 py-3 text-[10px] font-bold text-black/60">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-5 w-5 items-center justify-center border border-black bg-gray-100 text-[8px] font-black uppercase">
                          {userMap.get(log.user_id || '')?.charAt(0) || <User size={10} />}
                        </div>
                        <span className="text-[10px] font-bold">{userMap.get(log.user_id || '') || 'System'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-black uppercase tracking-tight">{log.action}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="border-2 border-black bg-white px-2 py-0.5 text-[8px] font-black uppercase tracking-wider">
                        {log.entity_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[9px] text-black/30">
                      {log.ip_address || '—'}
                    </td>
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
