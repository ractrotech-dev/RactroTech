import { db } from "@/utils/db/db";
import { projectEnquiriesTable, inquiryNotesTable, usersTable } from "@/utils/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Mail, Phone, Calendar, Tag, MessageSquare } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import InquiryActions from "@/components/admin/InquiryActions";
import InquiryNoteForm from "@/components/admin/InquiryNoteForm";

export const dynamic = "force-dynamic";

export default async function InquiryDetailPage({ params }: { params: { id: string } }) {
  const [inquiry] = await db.select().from(projectEnquiriesTable).where(eq(projectEnquiriesTable.id, params.id));
  if (!inquiry) notFound();

  // Get notes (may fail if table doesn't exist)
  let notes: any[] = [];
  try {
    notes = await db
      .select({
        id: inquiryNotesTable.id,
        content: inquiryNotesTable.content,
        created_at: inquiryNotesTable.created_at,
        author_name: usersTable.name,
      })
      .from(inquiryNotesTable)
      .leftJoin(
        usersTable,
        sql`${inquiryNotesTable.author_id} = (${usersTable.id})::text`,
      )
      .where(eq(inquiryNotesTable.inquiry_id, params.id))
      .orderBy(desc(inquiryNotesTable.created_at));
  } catch { /* table may not exist */ }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Inquiry from ${inquiry.name}`}
        subtitle={`Submitted ${inquiry.created_at ? new Date(inquiry.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}`}
        backHref="/admin/inquiries"
        backLabel="← Inquiries"
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main content */}
        <div className="space-y-6">
          {/* Contact info */}
          <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="mb-4 text-xs font-black uppercase tracking-[0.2em]">Contact Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center border-2 border-black bg-blue-400"><Mail size={14} /></div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-black/40">Email</p>
                  <p className="text-sm font-bold">{inquiry.email || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center border-2 border-black bg-emerald-400"><Phone size={14} /></div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-black/40">Phone</p>
                  <p className="text-sm font-bold">{inquiry.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center border-2 border-black bg-yellow-400"><Tag size={14} /></div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-black/40">Project Type</p>
                  <p className="text-sm font-bold">{inquiry.project_type}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center border-2 border-black bg-purple-400"><Calendar size={14} /></div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-black/40">Date</p>
                  <p className="text-sm font-bold">{inquiry.created_at ? new Date(inquiry.created_at).toLocaleDateString() : '—'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="mb-3 text-xs font-black uppercase tracking-[0.2em]">Project Description</h2>
            <p className="text-sm font-semibold leading-relaxed text-black/70">{inquiry.description}</p>
          </div>

          {/* Notes */}
          <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="border-b-4 border-black px-5 py-3 flex items-center gap-2">
              <MessageSquare size={14} />
              <h2 className="text-xs font-black uppercase tracking-[0.2em]">Internal Notes</h2>
              <span className="ml-auto text-[9px] font-bold text-black/30">{notes.length} notes</span>
            </div>
            <div className="p-5 space-y-4">
              <InquiryNoteForm inquiryId={params.id} />
              {notes.length === 0 ? (
                <p className="py-6 text-center text-xs font-bold text-black/25">No notes yet. Add one above.</p>
              ) : (
                <div className="space-y-3 pt-2">
                  {notes.map((note) => (
                    <div key={note.id} className="border-l-4 border-yellow-400 bg-yellow-50/50 px-4 py-3">
                      <p className="text-xs font-semibold text-black/70">{note.content}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-wider text-black/30">{note.author_name || 'Admin'}</span>
                        <span className="text-[9px] text-black/20">•</span>
                        <span className="text-[9px] font-bold text-black/25">
                          {note.created_at ? new Date(note.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: Actions */}
        <div className="space-y-4">
          <div className="border-4 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="mb-4 text-xs font-black uppercase tracking-[0.2em]">Quick Actions</h3>
            <InquiryActions
              inquiryId={params.id}
              currentStatus={(inquiry as any).status || 'new'}
              currentPriority={(inquiry as any).priority || 'medium'}
            />
          </div>

          <div className="border-4 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="mb-3 text-xs font-black uppercase tracking-[0.2em]">Current Status</h3>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={(inquiry as any).status || 'new'} />
              <StatusBadge status={(inquiry as any).priority || 'medium'} />
            </div>
            {(inquiry as any).budget && (
              <div className="mt-3 border-t-2 border-black/10 pt-3">
                <p className="text-[9px] font-black uppercase tracking-wider text-black/40">Budget</p>
                <p className="text-lg font-black">{(inquiry as any).budget}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
