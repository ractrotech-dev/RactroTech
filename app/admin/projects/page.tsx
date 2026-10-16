import { db } from "@/utils/db/db";
import { projectsTable, type SelectProject } from "@/utils/db/schema";
import { desc } from "drizzle-orm";
import { CheckCircle, Clock, FolderKanban, Rocket } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import ProgressBar from "@/components/admin/ProgressBar";
import EmptyState from "@/components/admin/EmptyState";
import NewProjectButton from "@/components/admin/NewProjectButton";
import { AdminCard, CardHeader, DataTable, KpiCard, Notice, TextLink, table } from "@/components/admin/ui";
import { formatCount, formatCurrency, formatDate } from "@/lib/admin/format";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Projects | Admin | RactroTech",
  description: "Manage projects and track progress",
};

type ProjectStatus = SelectProject["status"];

/**
 * The views the tiles and the filter share, so a tile's number is exactly the row count of
 * its filter. Together with on hold / cancelled they cover every project status.
 */
const FILTERS: { key: string; label: string; statuses: ProjectStatus[] | null }[] = [
  { key: "all", label: "All", statuses: null },
  { key: "planning", label: "Planning", statuses: ["planning"] },
  { key: "in_progress", label: "In progress", statuses: ["in_progress", "review"] },
  { key: "completed", label: "Completed", statuses: ["completed", "deployed"] },
];

function rowsWhere(projects: SelectProject[], statuses: ProjectStatus[]) {
  return projects.filter((p) => statuses.includes(p.status));
}

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams?: { status?: string | string[] };
}) {
  let projects: SelectProject[] = [];
  let loadError: string | null = null;

  try {
    projects = await db.select().from(projectsTable).orderBy(desc(projectsTable.created_at));
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Unknown error";
  }

  // Counts come from the full, unlimited result. `null` (shown as "—") when the query failed.
  const known = loadError === null;
  const count = (statuses: ProjectStatus[]) => (known ? rowsWhere(projects, statuses).length : null);
  const totalCount = known ? projects.length : null;
  const planningCount = count(["planning"]);
  const inProgressCount = count(["in_progress", "review"]);
  const reviewCount = count(["review"]);
  const completedCount = count(["completed", "deployed"]);
  const deployedCount = count(["deployed"]);
  const otherCount = count(["on_hold", "cancelled"]);

  const requested = Array.isArray(searchParams?.status) ? searchParams?.status[0] : searchParams?.status;
  const activeFilter = FILTERS.find((f) => f.key === requested) ?? FILTERS[0];
  const visible = activeFilter.statuses ? rowsWhere(projects, activeFilter.statuses) : projects;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        subtitle="Client work with its progress, due date and budget."
        backHref="/admin"
        actions={<NewProjectButton />}
      />

      {loadError ? (
        <Notice tone="red" title="Projects couldn’t be loaded">
          Counts show as “—” until the query succeeds. {loadError}
        </Notice>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Project counts">
        <KpiCard
          label="Total"
          value={formatCount(totalCount)}
          hint={otherCount === null ? undefined : `${formatCount(otherCount)} on hold or cancelled`}
          icon={<FolderKanban />}
        />
        <KpiCard label="Planning" value={formatCount(planningCount)} hint={known ? "Not started" : undefined} icon={<Clock />} />
        <KpiCard
          label="In progress"
          value={formatCount(inProgressCount)}
          hint={reviewCount === null ? undefined : `Includes ${formatCount(reviewCount)} in review`}
          icon={<Rocket />}
        />
        <KpiCard
          label="Completed"
          value={formatCount(completedCount)}
          hint={deployedCount === null ? undefined : `Includes ${formatCount(deployedCount)} deployed`}
          icon={<CheckCircle />}
        />
      </section>

      <AdminCard>
        <CardHeader
          title={activeFilter.statuses ? `${activeFilter.label} projects` : "All projects"}
          description={
            !known
              ? "Unavailable"
              : activeFilter.statuses
                ? `${formatCount(visible.length)} of ${formatCount(totalCount)}`
                : `${formatCount(totalCount)} ${totalCount === 1 ? "project" : "projects"}`
          }
          action={
            <nav aria-label="Filter projects" className="inline-flex rounded-lg border border-mkt-line p-0.5">
              {FILTERS.map((filter) => {
                const isActive = filter.key === activeFilter.key;
                return (
                  <Link
                    key={filter.key}
                    href={filter.statuses ? `/admin/projects?status=${filter.key}` : "/admin/projects"}
                    scroll={false}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "rounded-md px-2.5 py-1 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mkt-violet",
                      isActive ? "bg-mkt-ink/[0.06] text-mkt-ink" : "text-mkt-muted hover:text-mkt-ink"
                    )}
                  >
                    {filter.label}
                  </Link>
                );
              })}
            </nav>
          }
        />

        {!known ? (
          <p className="px-5 py-10 text-center text-[14px] text-mkt-muted">Projects couldn’t be loaded. Refresh to try again.</p>
        ) : projects.length === 0 ? (
          <EmptyState
            icon={<FolderKanban />}
            title="No projects yet"
            description="Create your first project to start tracking progress and managing client work."
          />
        ) : visible.length === 0 ? (
          <EmptyState
            title={`No ${activeFilter.label.toLowerCase()} projects`}
            description="Nothing matches this view right now."
            action={<TextLink href="/admin/projects">Show all projects</TextLink>}
          />
        ) : (
          <DataTable>
            <thead>
              <tr className={table.headRow}>
                <th className={table.th}>Project</th>
                <th className={table.th}>Status</th>
                <th className={table.th}>Progress</th>
                <th className={table.th}>Due date</th>
                <th className={table.thNum}>Budget</th>
                <th className={table.th}>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((project) => (
                <tr key={project.id} className={table.row}>
                  <td className={table.td}>
                    <Link href={`/admin/projects/${project.id}`} className="font-medium text-mkt-ink hover:text-mkt-violet">
                      {project.name}
                    </Link>
                    {project.description ? (
                      <p className="mt-0.5 max-w-[280px] truncate text-[13px] text-mkt-muted">{project.description}</p>
                    ) : null}
                  </td>
                  <td className={table.td}>
                    <StatusBadge status={project.status} />
                  </td>
                  <td className={table.td}>
                    <div className="w-32">
                      <ProgressBar value={project.progress} showPercentage />
                    </div>
                  </td>
                  <td className={cn(table.td, "whitespace-nowrap tabular-nums", !project.due_date && table.muted)}>
                    {project.due_date ? formatDate(project.due_date) : "Not set"}
                  </td>
                  <td className={cn(table.tdNum, "whitespace-nowrap", project.budget === null && table.muted)}>
                    {formatCurrency(project.budget)}
                  </td>
                  <td className={cn(table.td, "text-right")}>
                    <TextLink href={`/admin/projects/${project.id}`}>View</TextLink>
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
