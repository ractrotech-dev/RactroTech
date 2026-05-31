import { db } from "@/utils/db/db";
import { usersTable } from "@/utils/db/schema";
import { notInArray, desc } from "drizzle-orm";
import { UsersRound, UserPlus, Shield, Mail, Phone, Calendar } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import MiniStat from "@/components/admin/MiniStat";
import { getRoleBadgeClasses, getRoleLabel, type AdminRole } from "@/utils/admin-roles";
import UserRoleSelector from "@/components/admin/UserRoleSelector";
import { getAdminUser } from "@/utils/admin";

export const dynamic = "force-dynamic";
export const metadata = { title: "Team | Admin | RactroTech", description: "Manage team members" };

export default async function AdminTeamPage() {
  const admin = await getAdminUser();
  const isSuperAdmin = admin?.role === 'super_admin';

  const team = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      role: usersTable.role,
      plan: usersTable.plan,
    })
    .from(usersTable)
    .where(notInArray(usersTable.role, ['client', 'user']))
    .orderBy(desc(usersTable.role));

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Team Management" 
        subtitle="Manage roles and access for your internal team" 
        backHref="/admin"
        actions={
          <button className="flex items-center gap-2 border-2 border-black bg-yellow-400 px-4 py-2 text-[10px] font-black tracking-widest transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <UserPlus size={14} /> Invite Member
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <MiniStat icon={<Shield size={16} />} value={team.length} label="Team Members" color="bg-blue-400" />
        <MiniStat icon={<Shield size={16} />} value={team.filter(t => t.role === 'admin' || t.role === 'super_admin').length} label="Admins" color="bg-yellow-400" />
        <MiniStat icon={<Shield size={16} />} value={team.filter(t => t.role === 'developer').length} label="Developers" color="bg-emerald-400" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {team.map((member) => (
          <div key={member.id} className="group border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center border-4 border-black bg-gray-100 text-lg font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:bg-yellow-400 transition-colors">
                {member.name?.charAt(0) || <Shield size={20} />}
              </div>
              <UserRoleSelector
                userId={member.id}
                currentRole={member.role as AdminRole}
                isSuperAdmin={isSuperAdmin}
              />
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm font-black tracking-wider">{member.name}</h3>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-bold text-black/40">
                  <Mail size={12} /> {member.email}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-black/40">
                  <Shield size={12} /> {getRoleLabel(member.role as AdminRole)}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button className="flex-1 border-2 border-black py-1.5 text-[9px] font-black tracking-widest hover:bg-black hover:text-white transition-all">
                Edit Profile
              </button>
              <button className="border-2 border-black p-1.5 hover:bg-red-500 hover:text-white transition-all">
                <Shield size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
