import { AlertCircle } from 'lucide-react';

import { getSiteSettings } from '@/app/admin/actions';
import EmptyState from '@/components/admin/EmptyState';
import PageHeader from '@/components/admin/PageHeader';
import SettingsForm from '@/components/admin/SettingsForm';
import { AdminCard } from '@/components/admin/ui';
import { formatDateTime } from '@/lib/admin/format';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Settings | Admin | RactroTech', description: 'Admin settings' };

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  const subtitle = settings?.updated_at
    ? `Site identity, contact details and maintenance mode. Last saved ${formatDateTime(settings.updated_at)}.`
    : 'Site identity, contact details and maintenance mode.';

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle={subtitle} backHref="/admin" />

      {settings ? (
        <SettingsForm settings={settings} />
      ) : (
        <AdminCard>
          <EmptyState
            icon={<AlertCircle />}
            title="Settings couldn’t be loaded"
            description="The database didn’t respond. Reload the page to try again."
          />
        </AdminCard>
      )}
    </div>
  );
}
