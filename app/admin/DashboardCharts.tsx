import { BarChart3 } from 'lucide-react';

import MiniChart from '@/components/admin/MiniChart';
import { EmptyState } from '@/components/admin/EmptyState';
import type { ChartPoint } from '@/lib/admin/dashboard-snapshot';

interface DashboardChartsProps {
  inquirySeries?: ChartPoint[];
}

/**
 * Inquiries per day, plus an honest note where site traffic would go. There used to be a
 * traffic chart here drawn from hard-coded zeros, which read as "nobody visits the site".
 */
export default function DashboardCharts({ inquirySeries }: DashboardChartsProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {inquirySeries && inquirySeries.length > 0 ? (
        <MiniChart data={inquirySeries} title="Inquiries" subtitle="New inquiries per day, last 7 days (UTC)" totalLabel="This week" />
      ) : (
        <section className="rounded-2xl border border-mkt-line bg-mkt-surface">
          <EmptyState icon={BarChart3} title="No inquiry data" description="Inquiry counts appear here once the inquiries table has rows." />
        </section>
      )}
      <section className="rounded-2xl border border-dashed border-mkt-line bg-mkt-surface">
        <EmptyState
          icon={BarChart3}
          title="Site traffic isn’t connected"
          description="Connect Plausible, GA4 or Vercel Analytics to see visitors here. Until then there is nothing to show."
        />
      </section>
    </div>
  );
}
