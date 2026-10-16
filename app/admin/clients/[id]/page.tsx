import { db } from "@/utils/db/db";
import {
  clientsTable,
  projectsTable,
  projectEnquiriesTable,
  type SelectClient,
  type SelectProject,
  type SelectProjectEnquiry,
} from "@/utils/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import ClientActions from "@/components/admin/ClientActions";
import DatabaseError from "@/components/admin/DatabaseError";
import { AdminCard, ButtonLink, CardBody, CardHeader, MetaItem, Notice, TextLink, buttonClass } from "@/components/admin/ui";
import { formatCount, formatDate } from "@/lib/admin/format";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  let client: SelectClient | undefined;
  try {
    [client] = await db.select().from(clientsTable).where(eq(clientsTable.id, params.id));
  } catch (error) {
    console.error("Client Detail DB Error:", error);
    return <DatabaseError message={error instanceof Error ? error.message : String(error)} />;
  }
  if (!client) notFound();

  // Linked projects. `null` means the query failed: the count shows "—", not a made-up 0.
  let projects: SelectProject[] | null = null;
  try {
    projects = await db.select().from(projectsTable).where(eq(projectsTable.client_id, params.id)).orderBy(desc(projectsTable.created_at));
  } catch (error) {
    console.error("Client projects query failed:", error);
  }

  // The inquiry this client came from, if any. A failed lookup still links to it by id.
  let inquiry: SelectProjectEnquiry | null = null;
  let inquiryFailed = false;
  if (client.inquiry_id) {
    try {
      const [row] = await db.select().from(projectEnquiriesTable).where(eq(projectEnquiriesTable.id, client.inquiry_id));
      inquiry = row ?? null;
    } catch (error) {
      console.error("Client inquiry query failed:", error);
      inquiryFailed = true;
    }
  }
  const inquiryId = inquiry?.id ?? (inquiryFailed ? client.inquiry_id : null);

  const projectsCount =
    projects === null ? "—" : `${formatCount(projects.length)} ${projects.length === 1 ? "project" : "projects"}`;

  return (
    <div className="space-y-6">
      <PageHeader
        title={client.name}
        subtitle={client.company || "Private client"}
        backHref="/admin/clients"
        backLabel="Clients"
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          <AdminCard>
            <CardHeader title="Contact details" />
            <CardBody className="grid gap-5 sm:grid-cols-2">
              <MetaItem label="Email">
                <span className="break-all">{client.email}</span>
              </MetaItem>
              <MetaItem label="Phone">
                <span className="break-all">{client.phone || "—"}</span>
              </MetaItem>
              <MetaItem label="Company">{client.company || "—"}</MetaItem>
              <MetaItem label="Client since">
                <time className="tabular-nums" dateTime={client.created_at.toISOString()}>
                  {formatDate(client.created_at)}
                </time>
              </MetaItem>
            </CardBody>
          </AdminCard>

          <AdminCard>
            <CardHeader
              title="Projects"
              description={<span className="tabular-nums">{projectsCount}</span>}
              action={<TextLink href="/admin/projects">Manage all</TextLink>}
            />
            {projects === null ? (
              <CardBody>
                <Notice tone="amber" title="Projects couldn’t be loaded">
                  This client’s projects will show here once the query succeeds.
                </Notice>
              </CardBody>
            ) : projects.length === 0 ? (
              <p className="px-5 py-10 text-center text-[14px] text-mkt-muted">No projects started yet.</p>
            ) : (
              <ul className="divide-y divide-mkt-line">
                {projects.map((project) => (
                  <li key={project.id} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="text-[14px] font-medium text-mkt-ink transition-colors hover:text-mkt-violet"
                      >
                        {project.name}
                      </Link>
                      {project.description ? (
                        <p className="mt-0.5 truncate text-[13px] text-mkt-muted">{project.description}</p>
                      ) : null}
                    </div>
                    <StatusBadge status={project.status} />
                    <Link
                      href={`/admin/projects/${project.id}`}
                      aria-label={`Open ${project.name}`}
                      className={buttonClass("ghost", "sm", "w-8 shrink-0 px-0")}
                    >
                      <ChevronRight aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </AdminCard>

          {client.notes ? (
            <AdminCard>
              <CardHeader title="Client notes" />
              <CardBody>
                <p className="whitespace-pre-line break-words text-[14px] leading-6 text-mkt-ink">{client.notes}</p>
              </CardBody>
            </AdminCard>
          ) : null}
        </div>

        <aside className="space-y-6">
          <AdminCard>
            <CardHeader title="Status" action={<StatusBadge status={client.status} />} />
            <CardBody>
              <ClientActions clientId={client.id} currentStatus={client.status} />
            </CardBody>
          </AdminCard>

          {inquiryId ? (
            <AdminCard>
              <CardHeader
                title="Original inquiry"
                description={inquiry ? `Received ${formatDate(inquiry.created_at)}` : undefined}
              />
              <CardBody className="space-y-4">
                {inquiry ? (
                  <p className="line-clamp-3 break-words text-[14px] leading-6 text-mkt-muted">{inquiry.description}</p>
                ) : (
                  <p className="text-[13px] text-mkt-muted">The inquiry couldn’t be loaded, but you can still open it.</p>
                )}
                <ButtonLink href={`/admin/inquiries/${inquiryId}`} variant="secondary" className="w-full">
                  View original
                </ButtonLink>
              </CardBody>
            </AdminCard>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
