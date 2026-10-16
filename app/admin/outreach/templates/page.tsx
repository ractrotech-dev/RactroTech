import { desc, sql } from 'drizzle-orm';
import { FileText } from 'lucide-react';

import { createTemplate, deleteTemplate } from '@/app/admin/outreach/actions';
import DatabaseError from '@/components/admin/DatabaseError';
import EmptyState from '@/components/admin/EmptyState';
import PageHeader from '@/components/admin/PageHeader';
import { ConfirmButton } from '@/components/admin/outreach/ConfirmButton';
import { FormAction, SubmitButton } from '@/components/admin/outreach/FormAction';
import { AdminCard, CardBody, CardHeader, buttonClass, field } from '@/components/admin/ui';
import { PLACEHOLDERS } from '@/lib/outreach/constants';
import { db } from '@/utils/db/db';
import { outreachTemplatesTable } from '@/utils/db/schema';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Email templates | Admin | RactroTech', description: 'Cold-email templates' };

const EXAMPLE = `Hi {{business_name}} team,

I came across your {{category}} business in {{city}} and had a quick idea to help you get more bookings from your website ({{website}}).

Would you be open to a 10-minute call this week?

Best,
Your Name`;

export default async function TemplatesPage() {
  try {
    const templates = await db
      .select({
        id: outreachTemplatesTable.id,
        name: outreachTemplatesTable.name,
        subject: outreachTemplatesTable.subject,
        body: outreachTemplatesTable.body,
        used: sql<boolean>`exists(select 1 from outreach_campaigns c where c.template_id = ${outreachTemplatesTable.id})`,
      })
      .from(outreachTemplatesTable)
      .orderBy(desc(outreachTemplatesTable.id));

    return (
      <div className="space-y-6">
        <PageHeader
          title="Email templates"
          subtitle="Plain-text emails with placeholders. An unsubscribe link and your postal address are added to every email."
          backHref="/admin/outreach"
          backLabel="Find leads"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <AdminCard className="self-start">
            <CardHeader title="New template" />
            <CardBody>
              <FormAction action={createTemplate} className="space-y-4">
                <div>
                  <label className={field.label} htmlFor="name">
                    Template name
                  </label>
                  <input id="name" name="name" className={field.input} placeholder="Intro – restaurants" required />
                </div>
                <div>
                  <label className={field.label} htmlFor="subject">
                    Subject
                  </label>
                  <input id="subject" name="subject" className={field.input} defaultValue="Quick idea for {{business_name}}" required />
                </div>
                <div>
                  <label className={field.label} htmlFor="body">
                    Body (plain text)
                  </label>
                  <textarea id="body" name="body" rows={12} className={`${field.textarea} font-mono text-[13px]`} defaultValue={EXAMPLE} required />
                  <p className={field.hint}>
                    Placeholders:{' '}
                    {PLACEHOLDERS.map((p) => (
                      <code key={p} className="mr-1 rounded bg-mkt-ink/[0.06] px-1">{`{{${p}}}`}</code>
                    ))}
                  </p>
                </div>
                <SubmitButton className={buttonClass('primary')} pendingLabel="Saving…">
                  Save template
                </SubmitButton>
              </FormAction>
            </CardBody>
          </AdminCard>

          <div className="space-y-3">
            <h2 className="text-[15px] font-semibold text-mkt-ink">Saved ({templates.length})</h2>
            {templates.length === 0 ? (
              <AdminCard>
                <EmptyState icon={<FileText />} title="No templates yet" description="Write one on the left; campaigns send from a template." />
              </AdminCard>
            ) : (
              templates.map((t) => (
                <AdminCard key={t.id} as="article">
                  <CardHeader
                    title={t.name}
                    description={t.subject}
                    action={
                      t.used ? (
                        <span className="text-[12px] text-mkt-muted">Used by a campaign</span>
                      ) : (
                        <form action={deleteTemplate.bind(null, t.id)}>
                          <ConfirmButton confirm={`Delete the template “${t.name}”?`} className="text-[12px] font-medium text-mkt-muted hover:text-red-600">
                            Delete
                          </ConfirmButton>
                        </form>
                      )
                    }
                  />
                  <CardBody>
                    <pre className="whitespace-pre-wrap font-sans text-[14px] leading-6 text-mkt-ink/80">{t.body}</pre>
                  </CardBody>
                </AdminCard>
              ))
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return <DatabaseError message={error instanceof Error ? error.message : String(error)} />;
  }
}
