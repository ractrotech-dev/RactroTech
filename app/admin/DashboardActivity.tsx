'use client';

import RecentActivity from '@/components/admin/RecentActivity';

interface ActivityItem {
  id: string;
  type: 'inquiry' | 'user' | 'project' | 'alert' | 'system';
  title: string;
  description: string;
  time: string;
}

export default function DashboardActivity({ items }: { items: ActivityItem[] }) {
  return <RecentActivity items={items} />;
}
