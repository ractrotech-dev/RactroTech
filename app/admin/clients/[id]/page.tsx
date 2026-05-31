import { db } from "@/utils/db/db";
import { clientsTable, projectsTable, projectEnquiriesTable } from "@/utils/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Mail, Phone, Building2, Calendar, FolderKanban, MessageSquare, ExternalLink } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import ClientActions from "@/components/admin/ClientActions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const [client] = await db.select().from(clientsTable).where(eq(clientsTable.id, params.id));
  if (!client) notFound();

  // Fetch linked projects
  let projects: any[] = [];
  try {
    projects = await db.select().from(projectsTable).where(eq(projectsTable.client_id, params.id)).orderBy(desc(projectsTable.created_at));
  } catch {}

  // Fetch original inquiry
  let inquiry: any = null;
  if (client.inquiry_id) {
    try {
      const [i] = await db.select().from(projectEnquiriesTable).where(eq(projectEnquiriesTable.id, client.inquiry_id));
      inquiry = i;
    } catch {}
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={client.name}
        subtitle={client.company || 'Private Client'}
        backHref="/admin/clients"
        backLabel="← Clients"
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* Client Profile Card */}
          <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="mb-4 text-xs font-black tracking-[0.2em]">Contact Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center border-2 border-black bg-blue-400"><Mail size={14} /></div>
                <div>
                  <p className="text-[9px] font-black tracking-wider text-black/40">Email</p>
                  <p className="text-sm font-bold">{client.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center border-2 border-black bg-emerald-400"><Phone size={14} /></div>
                <div>
                  <p className="text-[9px] font-black tracking-wider text-black/40">Phone</p>
                  <p className="text-sm font-bold">{client.phone || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center border-2 border-black bg-yellow-400"><Building2 size={14} /></div>
                <div>
                  <p className="text-[9px] font-black tracking-wider text-black/40">Company</p>
                  <p className="text-sm font-bold">{client.company || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center border-2 border-black bg-purple-400"><Calendar size={14} /></div>
                <div>
                  <p className="text-[9px] font-black tracking-wider text-black/40">Client Since</p>
                  <p className="text-sm font-bold">{new Date(client.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between border-b-4 border-black px-5 py-3">
              <div className="flex items-center gap-2">
                <FolderKanban size={14} />
                <h2 className="text-xs font-black tracking-[0.2em]">Projects ({projects.length})</h2>
              </div>
              <Link href="/admin/projects" className="text-[10px] font-black underline decoration-2 underline-offset-2">Manage All</Link>
            </div>
            <div className="p-0">
              {projects.length === 0 ? (
                <div className="p-8 text-center text-xs font-bold text-black/25">No projects started yet.</div>
              ) : (
                <div className="divide-y-2 divide-black/5">
                  {projects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 hover:bg-yellow-50 transition-colors">
                      <div className="min-w-0 flex-1">
                        <Link href={`/admin/projects/${project.id}`} className="text-sm font-bold hover:text-yellow-600 transition-colors">{project.name}</Link>
                        <p className="mt-0.5 text-[10px] font-semibold text-black/40 truncate">{project.description}</p>
                      </div>
                      <div className="flex items-center gap-4 ml-4">
                        <StatusBadge status={project.status} />
                        <Link href={`/admin/projects/${project.id}`} className="border-2 border-black p-1 hover:bg-black hover:text-white transition-colors">
                          <ExternalLink size={12} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notes Section */}
          {client.notes && (
            <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="mb-3 text-xs font-black tracking-[0.2em]">Client Notes</h2>
              <p className="text-sm font-semibold leading-relaxed text-black/70 italic">&quot;{client.notes}&quot;</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="border-4 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="mb-4 text-xs font-black tracking-[0.2em]">Status Management</h3>
            <ClientActions clientId={client.id} currentStatus={client.status} />
          </div>

          {inquiry && (
            <div className="border-4 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare size={14} />
                <h3 className="text-xs font-black tracking-[0.2em]">Original Inquiry</h3>
              </div>
              <p className="text-[10px] font-bold text-black/40 mb-3 line-clamp-3">&quot;{inquiry.description}&quot;</p>
              <Link href={`/admin/inquiries/${inquiry.id}`} className="flex items-center justify-center w-full border-2 border-black py-2 text-[9px] font-black tracking-widest hover:bg-black hover:text-white transition-all">
                View Original
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
