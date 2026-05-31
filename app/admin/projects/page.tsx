import { db } from "@/utils/db/db";
import { projectsTable, clientsTable, projectTasksTable } from "@/utils/db/schema";
import { sql, desc, eq } from "drizzle-orm";
import {
  FolderKanban,
  Clock,
  CheckCircle,
  Rocket,
} from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import MiniStat from "@/components/admin/MiniStat";
import StatusBadge from "@/components/admin/StatusBadge";
import ProgressBar from "@/components/admin/ProgressBar";
import EmptyState from "@/components/admin/EmptyState";
import NewProjectButton from "@/components/admin/NewProjectButton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Projects | Admin | RactroTech",
  description: "Manage projects and track progress",
};

export default async function AdminProjectsPage() {
  let projects: any[] = [];
  let totalCount = 0;
  let activeCount = 0;
  let completedCount = 0;
  let planningCount = 0;

  try {
    projects = await db
      .select()
      .from(projectsTable)
      .orderBy(desc(projectsTable.created_at));

    totalCount = projects.length;
    activeCount = projects.filter((p) => p.status === 'in_progress').length;
    completedCount = projects.filter((p) => p.status === 'completed' || p.status === 'deployed').length;
    planningCount = projects.filter((p) => p.status === 'planning').length;
  } catch {
    // Table doesn't exist yet — will show empty state
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        subtitle={`${totalCount} total projects`}
        backHref="/admin"
        actions={<NewProjectButton />}
      />

      {/* Stats row */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MiniStat
          icon={<FolderKanban size={16} className="text-black" />}
          value={totalCount}
          label="Total"
          color="bg-blue-400"
        />
        <MiniStat
          icon={<Rocket size={16} className="text-black" />}
          value={activeCount}
          label="In Progress"
          color="bg-yellow-400"
        />
        <MiniStat
          icon={<CheckCircle size={16} className="text-black" />}
          value={completedCount}
          label="Completed"
          color="bg-emerald-400"
        />
        <MiniStat
          icon={<Clock size={16} className="text-black" />}
          value={planningCount}
          label="Planning"
          color="bg-purple-400"
        />
      </div>

      {/* Projects table */}
      <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between border-b-4 border-black px-5 py-3">
          <h2 className="text-xs font-black tracking-[0.2em]">All Projects</h2>
          <div className="flex gap-2">
            {['all', 'planning', 'in_progress', 'completed'].map((filter) => (
              <button
                key={filter}
                className="border border-black/20 px-2 py-0.5 text-[8px] font-black tracking-wider text-black/40 transition-colors hover:border-black hover:bg-black hover:text-white"
              >
                {filter.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          {projects.length === 0 ? (
            <EmptyState
              icon={FolderKanban}
              title="No projects yet"
              description="Create your first project to start tracking progress and managing client work."
            />
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-black/10 bg-gray-50">
                  <th className="px-4 py-3 text-[10px] font-black tracking-wider text-black/50">
                    Project
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black tracking-wider text-black/50">
                    Status
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black tracking-wider text-black/50">
                    Progress
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black tracking-wider text-black/50">
                    Due Date
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black tracking-wider text-black/50">
                    Budget
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black tracking-wider text-black/50">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-black/5 transition-colors hover:bg-yellow-50"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-xs font-bold">{project.name}</p>
                        {project.description && (
                          <p className="mt-0.5 max-w-[250px] truncate text-[10px] font-semibold text-black/40">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={project.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-24">
                        <ProgressBar value={project.progress} showPercentage />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-[10px] font-bold text-black/40">
                      {project.due_date
                        ? new Date(project.due_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs font-bold text-black/60">
                      {project.budget ? `$${Number(project.budget).toLocaleString()}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/projects/${project.id}`} className="border border-black/20 px-2 py-0.5 text-[9px] font-black tracking-wider text-black/40 transition-colors hover:border-black hover:bg-black hover:text-white">
                        View
                      </Link>
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
}
