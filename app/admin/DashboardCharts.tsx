'use client';

import MiniChart from '@/components/admin/MiniChart';
import type { ChartPoint } from '@/lib/admin/dashboard-snapshot';

const fallbackInquiryWeek: ChartPoint[] = [
  { name: 'Mon', value: 0 },
  { name: 'Tue', value: 0 },
  { name: 'Wed', value: 0 },
  { name: 'Thu', value: 0 },
  { name: 'Fri', value: 0 },
  { name: 'Sat', value: 0 },
  { name: 'Sun', value: 0 },
];

function placeholderVisitors(labels: ChartPoint[]): ChartPoint[] {
  return labels.map((d) => ({ name: d.name, value: 0 }));
}

interface DashboardChartsProps {
  /** When omitted (e.g. analytics placeholder page), a neutral 7‑day scaffold is used. */
  inquirySeries?: ChartPoint[];
}

export default function DashboardCharts({ inquirySeries }: DashboardChartsProps) {
  const safeSeries =
    inquirySeries && inquirySeries.length > 0 ? inquirySeries : fallbackInquiryWeek;
  const visitors = placeholderVisitors(safeSeries);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <MiniChart
        data={safeSeries}
        title="Inquiries (last 7 days)"
        subtitle="Live from your Postgres / Supabase database"
        color="#facc15"
      />
      <MiniChart
        data={visitors}
        title="Site traffic"
        subtitle="Ready for Plausible, GA4, or Vercel Analytics — connect in Settings"
        color="#60a5fa"
      />
    </div>
  );
}
