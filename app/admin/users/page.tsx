import { db } from "@/utils/db/db";
import { usersTable } from "@/utils/db/schema";
import { Users, Shield, Crown, UserCheck } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import MiniStat from "@/components/admin/MiniStat";
import EmptyState from "@/components/admin/EmptyState";
import { getRoleBadgeClasses, getRoleLabel, type AdminRole } from "@/utils/admin-roles";
import { getAdminUser } from "@/utils/admin";
import UserRoleSelector from "@/components/admin/UserRoleSelector";

export const dynamic = "force-dynamic";
export const metadata = { title: "Users | Admin | RactroTech", description: "Manage users" };

export default async function AdminUsersPage() {
  const admin = await getAdminUser();
  const isSuperAdmin = admin?.role === 'super_admin';

  const users = await db.select({ id: usersTable.id, email: usersTable.email, name: usersTable.name, plan: usersTable.plan, role: usersTable.role }).from(usersTable).orderBy(usersTable.email);
  const totalCount = users.length;
  const adminCount = users.filter((u) => u.role === "admin" || u.role === "super_admin").length;
  const devCount = users.filter((u) => u.role === "developer" || u.role === "manager").length;

  return (
    <div className="space-y-6">
      <PageHeader title="Users" subtitle={`${totalCount} registered users`} backHref="/admin" />

      <div className="grid gap-3 sm:grid-cols-3">
        <MiniStat icon={<Users size={16} className="text-black" />} value={totalCount} label="Total Users" color="bg-blue-400" />
        <MiniStat icon={<Crown size={16} className="text-black" />} value={adminCount} label="Admins" color="bg-yellow-400" />
        <MiniStat icon={<UserCheck size={16} className="text-black" />} value={totalCount - adminCount - devCount} label="Regular" color="bg-emerald-400" />
      </div>

      <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="border-b-4 border-black px-5 py-3">
          <h2 className="text-xs font-black tracking-[0.2em]">All Users</h2>
        </div>
        {users.length === 0 ? (
          <EmptyState icon={Users} title="No users yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-black/10 bg-gray-50">
                  {['Name', 'Email', 'Plan', 'Role', 'ID'].map((h) => (
                    <th key={h} className="px-4 py-3 text-[10px] font-black tracking-wider text-black/50">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-black/5 transition-colors hover:bg-yellow-50">
                    <td className="px-4 py-3 text-xs font-bold">{u.name}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-black/60">{u.email}</td>
                    <td className="px-4 py-3"><span className="border-2 border-black bg-yellow-400 px-2 py-0.5 text-[9px] font-black">{u.plan}</span></td>
                    <td className="px-4 py-3">
                      <UserRoleSelector
                        userId={u.id}
                        currentRole={u.role as AdminRole}
                        isSuperAdmin={isSuperAdmin}
                      />
                    </td>
                    <td className="max-w-[160px] truncate px-4 py-3 font-mono text-[10px] text-black/30">{u.id}</td>
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
