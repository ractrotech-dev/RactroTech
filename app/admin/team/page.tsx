import { db } from "@/utils/db/db";
import { usersTable } from "@/utils/db/schema";
import { notInArray, desc } from "drizzle-orm";
import { Code2, Crown, Mail, UserPlus, UsersRound, Wrench } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import MiniStat from "@/components/admin/MiniStat";
import EmptyState from "@/components/admin/EmptyState";
import { type AdminRole } from "@/utils/admin-roles";
import UserRoleSelector from "@/components/admin/UserRoleSelector";
import { getAdminUser } from "@/utils/admin";
import { AdminCard, Notice, buttonClass } from "@/components/admin/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Team | Admin | RactroTech", description: "Manage team members" };

type TeamMember = { id: string; name: string; email: string; role: AdminRole; plan: string };

export default async function AdminTeamPage() {
  const admin = await getAdminUser();
  // The DB role lives on `dbRole`; `role` on the auth user is Supabase's ("authenticated").
  const isSuperAdmin = admin?.dbRole === "super_admin";

  let team: TeamMember[] | null = null;
  let loadError: string | null = null;
  try {
    team = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        role: usersTable.role,
        plan: usersTable.plan,
      })
      .from(usersTable)
      .where(notInArray(usersTable.role, ["client", "user"]))
      .orderBy(desc(usersTable.role));
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Unknown error";
  }

  // The team is every non-client role, so these three groups add up to the total.
  const countRoles = (roles: AdminRole[]) => (team ? team.filter((t) => roles.includes(t.role)).length : null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team"
        subtitle="Roles and access for your internal team."
        backHref="/admin"
        actions={
          // Placeholder: there is no invite flow yet. The wrapper carries the tooltip because a
          // disabled button receives no pointer events.
          <span title="Invites aren’t available yet">
            <button type="button" disabled className={buttonClass("secondary")}>
              <UserPlus aria-hidden /> Invite member
            </button>
          </span>
        }
      />

      {loadError ? (
        <Notice tone="red" title="Team couldn’t be loaded">
          Counts show as “—” until the query succeeds. {loadError}
        </Notice>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Team counts">
        <MiniStat icon={<UsersRound />} value={team ? team.length : null} label="Team members" />
        <MiniStat icon={<Crown />} value={countRoles(["super_admin", "admin"])} label="Admins" />
        <MiniStat icon={<Wrench />} value={countRoles(["manager"])} label="Managers" />
        <MiniStat icon={<Code2 />} value={countRoles(["developer"])} label="Developers" />
      </section>

      {team === null ? (
        <AdminCard>
          <p className="px-5 py-10 text-center text-[14px] text-mkt-muted">Team couldn’t be loaded. Refresh to try again.</p>
        </AdminCard>
      ) : team.length === 0 ? (
        <AdminCard>
          <EmptyState icon={<UsersRound />} title="No team members yet" description="Give a user a team role from the Users page." />
        </AdminCard>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {team.map((member) => (
            <AdminCard key={member.id} as="article" className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mkt-lavender text-[15px] font-semibold text-mkt-violet">
                    {member.name?.charAt(0).toUpperCase() || "?"}
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate text-[15px] font-semibold leading-6 text-mkt-ink">{member.name}</h3>
                    <p className="flex min-w-0 items-center gap-1.5 text-[13px] text-mkt-muted">
                      <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      <span className="truncate">{member.email}</span>
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <UserRoleSelector userId={member.id} currentRole={member.role} isSuperAdmin={isSuperAdmin} />
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
