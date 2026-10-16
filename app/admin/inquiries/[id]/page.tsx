import { db } from "@/utils/db/db";
import { projectEnquiriesTable, inquiryNotesTable, usersTable, type SelectProjectEnquiry } from "@/utils/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import InquiryActions from "@/components/admin/InquiryActions";
import InquiryNoteForm from "@/components/admin/InquiryNoteForm";
import DatabaseError from "@/components/admin/DatabaseError";
import { AdminCard, CardBody, CardHeader, MetaItem, Notice } from "@/components/admin/ui";
import { formatCount, formatDate, formatDateTime } from "@/lib/admin/format";

export const dynamic = "force-dynamic";

/** The start-project form stores a slug; show the name the visitor picked. Anything else shows as entered. */
const PROJECT_TYPE_LABEL: Record<string, string> = {
  fullstack: "Full stack project",
  chatbot: "AI & chatbot",
  cloud: "Cloud services (AWS/Azure)",
  saas: "SaaS platform",
  mobile: "Mobile development",
  ecommerce: "E-commerce store",
  automation: "Internal automation",
};

function loadNotes(inquiryId: string) {
  return db
    .select({
      id: inquiryNotesTable.id,
      content: inquiryNotesTable.content,
      created_at: inquiryNotesTable.created_at,
      author_name: usersTable.name,
    })
    .from(inquiryNotesTable)
    .leftJoin(usersTable, sql`${inquiryNotesTable.author_id} = (${usersTable.id})::text`)
    .where(eq(inquiryNotesTable.inquiry_id, inquiryId))
    .orderBy(desc(inquiryNotesTable.created_at));
}

type InquiryNote = Awaited<ReturnType<typeof loadNotes>>[number];

export default async function InquiryDetailPage({ params }: { params: { id: string } }) {
  let inquiry: SelectProjectEnquiry | undefined;
  try {
    [inquiry] = await db.select().from(projectEnquiriesTable).where(eq(projectEnquiriesTable.id, params.id));
  } catch (error) {
    console.error("Inquiry Detail DB Error:", error);
    return <DatabaseError message={error instanceof Error ? error.message : String(error)} />;
  }
  if (!inquiry) notFound();

  // `null` means the notes query failed: the count shows "—", not a made-up 0.
  let notes: InquiryNote[] | null = null;
  try {
    notes = await loadNotes(params.id);
  } catch (error) {
    console.error("Inquiry notes query failed:", error);
  }

  const notesCount = notes === null ? "—" : `${formatCount(notes.length)} ${notes.length === 1 ? "note" : "notes"}`;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Inquiry from ${inquiry.name}`}
        subtitle={`Submitted ${formatDate(inquiry.created_at)}`}
        backHref="/admin/inquiries"
        backLabel="Inquiries"
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          <AdminCard>
            <CardHeader title="Contact information" />
            <CardBody className="grid gap-5 sm:grid-cols-2">
              <MetaItem label="Email">
                <span className="break-all">{inquiry.email || "—"}</span>
              </MetaItem>
              <MetaItem label="Phone">
                <span className="break-all">{inquiry.phone}</span>
              </MetaItem>
              <MetaItem label="Project type">{PROJECT_TYPE_LABEL[inquiry.project_type] ?? inquiry.project_type}</MetaItem>
              <MetaItem label="Received">
                <time className="tabular-nums" dateTime={inquiry.created_at.toISOString()}>
                  {formatDateTime(inquiry.created_at)}
                </time>
              </MetaItem>
            </CardBody>
          </AdminCard>

          <AdminCard>
            <CardHeader title="Project description" />
            <CardBody>
              <p className="whitespace-pre-line break-words text-[14px] leading-6 text-mkt-ink">{inquiry.description}</p>
            </CardBody>
          </AdminCard>

          <AdminCard>
            <CardHeader
              title="Internal notes"
              description="Only admins can see these."
              action={<span className="text-[13px] font-medium tabular-nums text-mkt-muted">{notesCount}</span>}
            />
            <CardBody className="space-y-4">
              <InquiryNoteForm inquiryId={params.id} />
              {notes === null ? (
                <Notice tone="amber" title="Notes couldn’t be loaded">
                  Existing notes will show here once the query succeeds. You can still add a new one.
                </Notice>
              ) : notes.length === 0 ? (
                <p className="py-6 text-center text-[14px] text-mkt-muted">No notes yet. Add one above.</p>
              ) : (
                <ul className="divide-y divide-mkt-line border-t border-mkt-line">
                  {notes.map((note) => (
                    <li key={note.id} className="py-3.5">
                      <p className="whitespace-pre-line break-words text-[14px] leading-6 text-mkt-ink">{note.content}</p>
                      <p className="mt-1 text-[13px] text-mkt-muted">
                        {note.author_name || "Admin"}
                        <span aria-hidden className="mx-1.5">·</span>
                        <time className="tabular-nums" dateTime={note.created_at.toISOString()}>
                          {formatDateTime(note.created_at)}
                        </time>
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </AdminCard>
        </div>

        <aside className="space-y-6">
          <AdminCard>
            <CardHeader title="Current status" />
            <CardBody className="space-y-5">
              <MetaItem label="Status">
                <StatusBadge status={inquiry.status} />
              </MetaItem>
              <MetaItem label="Priority">
                <StatusBadge status={inquiry.priority} />
              </MetaItem>
              <MetaItem label="Budget">
                {/* Free text, so it shows exactly as the visitor typed it. */}
                <span className="break-words">{inquiry.budget || "—"}</span>
              </MetaItem>
            </CardBody>
          </AdminCard>

          <AdminCard>
            <CardHeader title="Update" description="Changes save right away." />
            <CardBody>
              <InquiryActions inquiryId={params.id} currentStatus={inquiry.status} currentPriority={inquiry.priority} />
            </CardBody>
          </AdminCard>
        </aside>
      </div>
    </div>
  );
}
