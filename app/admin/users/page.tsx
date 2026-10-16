import { db } from "@/utils/db/db";
import { usersTable } from "@/utils/db/schema";
import { Crown, UserCheck, Users, Wrench } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import MiniStat from "@/components/admin/MiniStat";
import EmptyState from "@/components/admin/EmptyState";
import { type AdminRole } from "@/utils/admin-roles";
import { getAdminUser } from "@/utils/admin";
import UserRoleSelector from "@/components/admin/UserRoleSelector";
import { AdminCard, Badge, CardHeader, DataTable, Notice, table } from "@/components/admin/ui";
import { formatCount, formatLabel } from "@/lib/admin/format";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Users | Admin | RactroTech", description: "Manage users" };

type UserRow = { id: string; email: string; name: string; plan: string; role: AdminRole };

export default async function AdminUsersPage() {
  const admin = await getAdminUser();
  // The DB role lives on `dbRole`; `role` on the auth user is Supabase's ("authenticated").
  const isSuperAdmin = admin?.dbRole === "super_admin";

  let users: UserRow[] | null = null;
  let loadError: string | null = null;
  try {
    users = await db
      .select({ id: usersTable.id, email: usersTable.email, name: usersTable.name, plan: usersTable.plan, role: usersTable.role })
      .from(usersTable)
      .orderBy(usersTable.email);
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Unknown error";
  }

  // Four groups that cover every role, so they add up to the total. `null` when the query failed.
  const countRoles = (roles: AdminRole[]) => (users ? users.filter((u) => roles.includes(u.role)).length : null);
  const totalCount = users ? users.length : null;
  const adminCount = countRoles(["super_admin", "admin"]);
  const staffCount = countRoles(["manager", "developer"]);
  const regularCount = countRoles(["client", "user"]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        subtitle={totalCount === null ? undefined : `${formatCount(totalCount)} registered ${totalCount === 1 ? "user" : "users"}`}
        backHref="/admin"
      />

      {loadError ? (
        <Notice tone="red" title="Users couldn’t be loaded">
          Counts show as “—” until the query succeeds. {loadError}
        </Notice>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="User counts">
        <MiniStat icon={<Users />} value={totalCount} label="Total users" />
        <MiniStat icon={<Crown />} value={adminCount} label="Admins" />
        <MiniStat icon={<Wrench />} value={staffCount} label="Managers and developers" />
        <MiniStat icon={<UserCheck />} value={regularCount} label="Clients and users" />
      </section>

      <AdminCard>
        <CardHeader
          title="All users"
          description={isSuperAdmin ? "Change a user’s role from the Role column." : "Only super admins can change roles."}
        />
        {users === null ? (
          <p className="px-5 py-10 text-center text-[14px] text-mkt-muted">Users couldn’t be loaded. Refresh to try again.</p>
        ) : users.length === 0 ? (
          <EmptyState icon={<Users />} title="No users yet" />
        ) : (
          <DataTable>
            <thead>
              <tr className={table.headRow}>
                <th className={table.th}>Name</th>
                <th className={table.th}>Email</th>
                <th className={table.th}>Plan</th>
                <th className={table.th}>Role</th>
                <th className={table.th}>ID</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className={table.row}>
                  <td className={cn(table.td, "font-medium")}>{u.name}</td>
                  <td className={cn(table.td, table.muted)}>{u.email}</td>
                  <td className={table.td}>
                    <Badge>{!u.plan || u.plan === "none" ? "No plan" : formatLabel(u.plan)}</Badge>
                  </td>
                  <td className={table.td}>
                    <UserRoleSelector userId={u.id} currentRole={u.role} isSuperAdmin={isSuperAdmin} />
                  </td>
                  <td className={cn(table.td, "max-w-[180px] truncate font-mono text-[12px]", table.muted)} title={u.id}>
                    {u.id}
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
