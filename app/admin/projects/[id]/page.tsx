import { db } from "@/utils/db/db";
import { projectsTable, projectTasksTable, projectMilestonesTable, clientsTable, mediaAssetsTable } from "@/utils/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Calendar, DollarSign, Globe, GitBranch, Code2 } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import ProgressBar from "@/components/admin/ProgressBar";
import EmptyState from "@/components/admin/EmptyState";
import ProjectMedia from "@/components/admin/ProjectMedia";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  let project: any = null;
  try {
    const [p] = await db.select().from(projectsTable).where(eq(projectsTable.id, params.id));
    project = p;
  } catch { /* table may not exist */ }
  if (!project) notFound();

  // Fetch tasks
  let tasks: any[] = [];
  try { tasks = await db.select().from(projectTasksTable).where(eq(projectTasksTable.project_id, params.id)).orderBy(desc(projectTasksTable.created_at)); } catch {}

  // Fetch milestones
  let milestones: any[] = [];
  try { milestones = await db.select().from(projectMilestonesTable).where(eq(projectMilestonesTable.project_id, params.id)); } catch {}

  // Fetch client
  let client: any = null;
  if (project.client_id) {
    try { const [c] = await db.select().from(clientsTable).where(eq(clientsTable.id, project.client_id)); client = c; } catch {}
  }

  // Fetch media assets
  let assets: any[] = [];
  try {
    assets = await db
      .select()
      .from(mediaAssetsTable)
      .where(eq(mediaAssetsTable.project_id, params.id))
      .orderBy(desc(mediaAssetsTable.created_at));
  } catch {}

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  return (
    <div className="space-y-6">
      <PageHeader title={project.name} subtitle={project.description || 'No description'} backHref="/admin/projects" backLabel="← Projects" />

      {/* Project meta grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border-4 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-[9px] font-black tracking-[0.2em] text-black/40">Status</p>
          <div className="mt-2"><StatusBadge status={project.status} /></div>
        </div>
        <div className="border-4 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-[9px] font-black tracking-[0.2em] text-black/40">Progress</p>
          <div className="mt-2"><ProgressBar value={project.progress} showPercentage /></div>
        </div>
        <div className="border-4 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2">
            <DollarSign size={14} className="text-black/40" />
            <p className="text-[9px] font-black tracking-[0.2em] text-black/40">Budget</p>
          </div>
          <p className="mt-1 text-2xl font-black">{project.budget ? `$${Number(project.budget).toLocaleString()}` : '—'}</p>
        </div>
        <div className="border-4 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-black/40" />
            <p className="text-[9px] font-black tracking-[0.2em] text-black/40">Due Date</p>
          </div>
          <p className="mt-1 text-sm font-bold">{project.due_date ? new Date(project.due_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not set'}</p>
        </div>
      </div>

      {/* Details + Links */}
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          {/* Tech Stack */}
          {project.tech_stack && (
            <div className="border-4 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-3">
                <Code2 size={14} />
                <h3 className="text-xs font-black tracking-[0.2em]">Tech Stack</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.split(',').map((tech: string) => (
                  <span key={tech} className="border-2 border-black bg-yellow-400 px-2.5 py-1 text-[9px] font-black">{tech.trim()}</span>
                ))}
              </div>
            </div>
          )}

          {/* Task Board */}
          <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="border-b-4 border-black px-5 py-3">
              <h3 className="text-xs font-black tracking-[0.2em]">Tasks ({tasks.length})</h3>
            </div>
            {tasks.length === 0 ? (
              <div className="p-8 text-center text-xs font-bold text-black/25">No tasks yet</div>
            ) : (
              <div className="grid gap-0 sm:grid-cols-3">
                {/* To Do */}
                <div className="border-r border-black/10 p-4">
                  <p className="mb-3 text-[9px] font-black tracking-wider text-black/30">To Do ({todoTasks.length})</p>
                  <div className="space-y-2">
                    {todoTasks.map(t => (
                      <div key={t.id} className="border-2 border-black/20 bg-gray-50 p-3">
                        <p className="text-[11px] font-bold">{t.title}</p>
                        <StatusBadge status={t.priority} />
                      </div>
                    ))}
                  </div>
                </div>
                {/* In Progress */}
                <div className="border-r border-black/10 p-4">
                  <p className="mb-3 text-[9px] font-black tracking-wider text-yellow-600">In Progress ({inProgressTasks.length})</p>
                  <div className="space-y-2">
                    {inProgressTasks.map(t => (
                      <div key={t.id} className="border-2 border-yellow-400 bg-yellow-50 p-3">
                        <p className="text-[11px] font-bold">{t.title}</p>
                        <StatusBadge status={t.priority} />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Done */}
                <div className="p-4">
                  <p className="mb-3 text-[9px] font-black tracking-wider text-emerald-600">Done ({doneTasks.length})</p>
                  <div className="space-y-2">
                    {doneTasks.map(t => (
                      <div key={t.id} className="border-2 border-emerald-300 bg-emerald-50 p-3">
                        <p className="text-[11px] font-bold line-through text-black/50">{t.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Links */}
          <div className="border-4 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="mb-3 text-xs font-black tracking-[0.2em]">Links</h3>
            <div className="space-y-2">
              {project.live_url ? (
                <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline">
                  <Globe size={12} /> Live Site
                </a>
              ) : <p className="text-[10px] font-semibold text-black/25">No live URL</p>}
              {project.repo_url ? (
                <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline">
                  <GitBranch size={12} /> Repository
                </a>
              ) : <p className="text-[10px] font-semibold text-black/25">No repo URL</p>}
            </div>
          </div>

          {/* Client */}
          <div className="border-4 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="mb-3 text-xs font-black tracking-[0.2em]">Client</h3>
            {client ? (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center border-2 border-black bg-yellow-400 text-[10px] font-black">{client.name.charAt(0)}</div>
                <div>
                  <p className="text-xs font-bold">{client.name}</p>
                  <p className="text-[10px] text-black/40">{client.email}</p>
                </div>
              </div>
            ) : <p className="text-[10px] font-semibold text-black/25">No client assigned</p>}
          </div>

          {/* Assets */}
          <ProjectMedia projectId={project.id} assets={assets} />

          {/* Milestones */}
          <div className="border-4 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="mb-3 text-xs font-black tracking-[0.2em]">Milestones</h3>
            {milestones.length === 0 ? (
              <p className="text-[10px] font-semibold text-black/25">No milestones</p>
            ) : (
              <div className="space-y-2">
                {milestones.map(m => (
                  <div key={m.id} className="flex items-center gap-2">
                    <div className={`h-3 w-3 border-2 border-black ${m.completed ? 'bg-emerald-400' : 'bg-white'}`} />
                    <span className={`text-[11px] font-bold ${m.completed ? 'line-through text-black/40' : ''}`}>{m.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
