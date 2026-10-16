import RecentActivity from '@/components/admin/RecentActivity';
import type { DashboardActivityItem } from '@/lib/admin/dashboard-snapshot';

/** Kept for older imports; the dashboard renders RecentActivity directly. */
export default function DashboardActivity({ items }: { items: DashboardActivityItem[] }) {
  return <RecentActivity items={items} />;
}
