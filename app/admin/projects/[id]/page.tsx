import { db } from "@/utils/db/db";
import {
  projectsTable,
  projectTasksTable,
  projectMilestonesTable,
  clientsTable,
  mediaAssetsTable,
  type SelectClient,
  type SelectProject,
  type SelectProjectTask,
} from "@/utils/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { CheckCircle2, Circle, GitBranch, Globe } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import ProgressBar from "@/components/admin/ProgressBar";
import ProjectMedia from "@/components/admin/ProjectMedia";
import DatabaseError from "@/components/admin/DatabaseError";
import { AdminCard, Badge, CardBody, CardHeader, MetaItem, Notice, TextLink } from "@/components/admin/ui";
import { formatCount, formatCurrency, formatDate } from "@/lib/admin/format";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

function errorMessage(err: unknown) {
  return err instanceof Error ? err.message : "Unknown error";
}

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  let project: SelectProject | undefined;
  try {
    [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, params.id));
  } catch (err) {
    // A failed query is not a missing project: say the database is the problem, not a 404.
    return (
      <div className="space-y-6">
        <PageHeader title="Project" backHref="/admin/projects" backLabel="Projects" />
        <DatabaseError message={errorMessage(err)} />
      </div>
    );
  }
  if (!project) notFound();

  // Each section loads on its own; a failure becomes `null` (shown as "—" / "couldn't load"),
  // never an empty list that reads as "nothing here".
  const errors: string[] = [];
  async function attempt<T>(label: string, run: () => Promise<T>): Promise<T | null> {
    try {
      return await run();
    } catch (err) {
      errors.push(`${label}: ${errorMessage(err)}`);
      return null;
    }
  }

  const clientId = project.client_id;
  const [tasks, milestones, clientRows, assets] = await Promise.all([
    attempt("Tasks", () =>
      db.select().from(projectTasksTable).where(eq(projectTasksTable.project_id, params.id)).orderBy(desc(projectTasksTable.created_at))
    ),
    attempt("Milestones", () => db.select().from(projectMilestonesTable).where(eq(projectMilestonesTable.project_id, params.id))),
    clientId
      ? attempt("Client", () => db.select().from(clientsTable).where(eq(clientsTable.id, clientId)))
      : Promise.resolve([] as SelectClient[]),
    attempt("Files", () =>
      db.select().from(mediaAssetsTable).where(eq(mediaAssetsTable.project_id, params.id)).orderBy(desc(mediaAssetsTable.created_at))
    ),
  ]);

  const client = clientRows?.[0] ?? null;

  // Every task lands in exactly one column, so the column counts always add up to the total.
  // "Review" is still being worked on, so it sits with In progress (and says so on the card).
  const taskList = tasks ?? [];
  const columns: { key: string; title: string; tasks: SelectProjectTask[] }[] = [
    { key: "todo", title: "To do", tasks: taskList.filter((t) => t.status === "todo") },
    { key: "in_progress", title: "In progress", tasks: taskList.filter((t) => t.status !== "todo" && t.status !== "done") },
    { key: "done", title: "Done", tasks: taskList.filter((t) => t.status === "done") },
  ];
  const doneTaskCount = columns[2].tasks.length;

  const techStack = (project.tech_stack ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const milestonesDone = milestones?.filter((m) => m.completed).length ?? null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={project.name}
        subtitle={project.description || "No description"}
        backHref="/admin/projects"
        backLabel="Projects"
      />

      {errors.length > 0 ? (
        <Notice tone="amber" title="Some project details couldn’t be loaded">
          Those sections show “—” until the query succeeds. First error: {errors[0]}
        </Notice>
      ) : null}

      <AdminCard>
        <CardBody className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <MetaItem label="Status">
            <StatusBadge status={project.status} />
          </MetaItem>
          <MetaItem label="Progress">
            <ProgressBar value={project.progress} showPercentage />
          </MetaItem>
          <MetaItem label="Budget">
            <span className={cn("tabular-nums", project.budget === null && "text-mkt-muted")}>{formatCurrency(project.budget)}</span>
          </MetaItem>
          <MetaItem label="Due date">
            <span className={cn("tabular-nums", !project.due_date && "text-mkt-muted")}>
              {project.due_date ? formatDate(project.due_date) : "Not set"}
            </span>
          </MetaItem>
        </CardBody>
      </AdminCard>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          {techStack.length > 0 ? (
            <AdminCard>
              <CardHeader title="Tech stack" />
              <CardBody className="flex flex-wrap gap-2">
                {techStack.map((tech, i) => (
                  <Badge key={`${tech}-${i}`}>{tech}</Badge>
                ))}
              </CardBody>
            </AdminCard>
          ) : null}

          <AdminCard>
            <CardHeader
              title="Tasks"
              description={
                tasks === null
                  ? "—"
                  : `${formatCount(taskList.length)} ${taskList.length === 1 ? "task" : "tasks"} · ${formatCount(doneTaskCount)} done`
              }
            />
            {tasks === null ? (
              <p className="px-5 py-10 text-center text-[14px] text-mkt-muted">Tasks couldn’t be loaded. Refresh to try again.</p>
            ) : taskList.length === 0 ? (
              <p className="px-5 py-10 text-center text-[14px] text-mkt-muted">No tasks yet.</p>
            ) : (
              <div className="grid gap-3 p-4 md:grid-cols-3">
                {columns.map((column) => (
                  <section key={column.key} aria-label={column.title} className="min-w-0 rounded-xl bg-mkt-ink/[0.03] p-3">
                    <div className="mb-3 flex items-center justify-between gap-2 px-1">
                      <h3 className="text-[13px] font-medium text-mkt-ink">{column.title}</h3>
                      <span className="text-[13px] tabular-nums text-mkt-muted">{formatCount(column.tasks.length)}</span>
                    </div>
                    {column.tasks.length === 0 ? (
                      <p className="px-1 py-4 text-center text-[13px] text-mkt-muted">No tasks</p>
                    ) : (
                      <ul className="space-y-2">
                        {column.tasks.map((t) => {
                          const isDone = t.status === "done";
                          return (
                            <li key={t.id} className="rounded-lg border border-mkt-line bg-mkt-surface p-3">
                              <p className={cn("text-[14px] font-medium leading-5", isDone ? "text-mkt-muted" : "text-mkt-ink")}>{t.title}</p>
                              {!isDone ? (
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                  {t.status === "review" ? <StatusBadge status="review" /> : null}
                                  <StatusBadge status={t.priority} />
                                </div>
                              ) : null}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </section>
                ))}
              </div>
            )}
          </AdminCard>
        </div>

        <aside className="min-w-0 space-y-6">
          <AdminCard>
            <CardHeader title="Links" />
            <CardBody>
              <ul className="space-y-3 text-[14px]">
                <li className="flex items-center gap-2.5">
                  <Globe className="h-4 w-4 shrink-0 text-mkt-muted" aria-hidden />
                  {project.live_url ? (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-mkt-violet underline-offset-4 hover:underline"
                    >
                      Live site
                    </a>
                  ) : (
                    <span className="text-mkt-muted">No live URL</span>
                  )}
                </li>
                <li className="flex items-center gap-2.5">
                  <GitBranch className="h-4 w-4 shrink-0 text-mkt-muted" aria-hidden />
                  {project.repo_url ? (
                    <a
                      href={project.repo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-mkt-violet underline-offset-4 hover:underline"
                    >
                      Repository
                    </a>
                  ) : (
                    <span className="text-mkt-muted">No repo URL</span>
                  )}
                </li>
              </ul>
            </CardBody>
          </AdminCard>

          <AdminCard>
            <CardHeader title="Client" action={client ? <TextLink href={`/admin/clients/${client.id}`}>View</TextLink> : null} />
            <CardBody>
              {client ? (
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mkt-lavender text-[14px] font-semibold text-mkt-violet">
                    {client.name.charAt(0).toUpperCase() || "?"}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-medium text-mkt-ink">{client.name}</p>
                    <p className="truncate text-[13px] text-mkt-muted">{client.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-[14px] text-mkt-muted">
                  {clientRows === null ? "Client couldn’t be loaded." : clientId ? "Client record not found." : "No client assigned."}
                </p>
              )}
            </CardBody>
          </AdminCard>

          <ProjectMedia projectId={project.id} assets={assets ?? []} error={assets === null ? "Files couldn’t be loaded" : null} />

          <AdminCard>
            <CardHeader
              title="Milestones"
              description={
                milestones === null
                  ? "—"
                  : milestones.length === 0
                    ? undefined
                    : `${formatCount(milestonesDone)} of ${formatCount(milestones.length)} done`
              }
            />
            <CardBody>
              {milestones === null ? (
                <p className="text-[14px] text-mkt-muted">Milestones couldn’t be loaded.</p>
              ) : milestones.length === 0 ? (
                <p className="text-[14px] text-mkt-muted">No milestones.</p>
              ) : (
                <ul className="space-y-2.5">
                  {milestones.map((m) => (
                    <li key={m.id} className="flex items-start gap-2.5 text-[14px]">
                      {m.completed ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-mkt-violet" aria-label="Completed" />
                      ) : (
                        <Circle className="mt-0.5 h-4 w-4 shrink-0 text-mkt-muted" aria-label="Not completed" />
                      )}
                      <span className={m.completed ? "text-mkt-muted" : "text-mkt-ink"}>{m.title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </AdminCard>
        </aside>
      </div>
    </div>
  );
}
