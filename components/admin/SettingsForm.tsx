'use client';

import { useState, useTransition } from 'react';
import { Info, Save } from 'lucide-react';

import { updateSiteSettings } from '@/app/admin/actions';
import { AdminCard, Badge, CardBody, CardHeader, buttonClass, field } from '@/components/admin/ui';
import { cn } from '@/lib/utils';

interface SettingsFormProps {
  settings: {
    site_name: string;
    site_description: string | null;
    maintenance_mode: boolean;
    contact_email: string | null;
    footer_text: string | null;
    social_links: string | null;
  };
}

export default function SettingsForm({ settings }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await updateSiteSettings(formData);
    });
  };

  const maintenance = formData.maintenance_mode;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <AdminCard>
            <CardHeader title="General" description="The site’s name and how it describes itself." />
            <CardBody className="space-y-4">
              <div>
                <label htmlFor="site_name" className={field.label}>
                  Site name
                </label>
                <input
                  id="site_name"
                  type="text"
                  value={formData.site_name}
                  onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                  className={field.input}
                />
              </div>
              <div>
                <label htmlFor="site_description" className={field.label}>
                  Site description
                </label>
                <textarea
                  id="site_description"
                  value={formData.site_description || ''}
                  onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
                  rows={3}
                  className={cn(field.textarea, 'resize-none')}
                />
              </div>
            </CardBody>
          </AdminCard>

          <AdminCard>
            <CardHeader
              title="Maintenance"
              description="Take the public site offline while you work."
              action={<Badge tone={maintenance ? 'amber' : 'neutral'}>{maintenance ? 'On' : 'Off'}</Badge>}
            />
            <CardBody>
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p id="maintenance-label" className="text-[14px] font-medium text-mkt-ink">
                    Maintenance mode
                  </p>
                  <p className="mt-0.5 text-[13px] leading-5 text-mkt-muted">
                    When on, the public site shows a “Coming soon” page.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={maintenance}
                  aria-labelledby="maintenance-label"
                  onClick={() => setFormData({ ...formData, maintenance_mode: !formData.maintenance_mode })}
                  className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mkt-violet focus-visible:ring-offset-2 focus-visible:ring-offset-mkt-surface',
                    maintenance ? 'bg-mkt-violet' : 'bg-mkt-ink/15'
                  )}
                >
                  <span
                    className={cn(
                      'inline-block h-5 w-5 rounded-full bg-mkt-surface shadow-sm transition-transform duration-150',
                      maintenance ? 'translate-x-[22px]' : 'translate-x-0.5'
                    )}
                  />
                </button>
              </div>
            </CardBody>
          </AdminCard>
        </div>

        <div className="space-y-6">
          <AdminCard>
            <CardHeader title="Contact" description="Shown publicly on the site." />
            <CardBody className="space-y-4">
              <div>
                <label htmlFor="contact_email" className={field.label}>
                  Support email
                </label>
                <input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email || ''}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  className={field.input}
                />
              </div>
              <div>
                <label htmlFor="footer_text" className={field.label}>
                  Footer text
                </label>
                <input
                  id="footer_text"
                  type="text"
                  value={formData.footer_text || ''}
                  onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
                  className={field.input}
                />
              </div>
            </CardBody>
          </AdminCard>

          <AdminCard>
            <CardHeader title="Social links" description="Where the site links out to." />
            <CardBody className="space-y-3">
              <p className="flex items-start gap-2 text-[13px] leading-5 text-mkt-muted">
                <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                Social links are currently managed in the site’s global constants, not here.
              </p>
              <button type="button" className={buttonClass('secondary', 'md', 'w-full')}>
                Configure integrations
              </button>
            </CardBody>
          </AdminCard>
        </div>
      </div>

      <div className="flex justify-end border-t border-mkt-line pt-5">
        <button type="submit" disabled={isPending} className={buttonClass('primary')}>
          <Save aria-hidden />
          {isPending ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}
