'use client';

interface StatusBadgeProps {
  status: string;
  variant?: 'inquiry' | 'project' | 'client' | 'task' | 'priority';
}

const statusColors: Record<string, string> = {
  // Inquiry statuses
  new: 'border-blue-300 bg-blue-50 text-blue-700',
  in_progress: 'border-yellow-400 bg-yellow-50 text-yellow-700',
  responded: 'border-emerald-300 bg-emerald-50 text-emerald-700',
  converted: 'border-purple-300 bg-purple-50 text-purple-700',
  closed: 'border-black/20 bg-gray-100 text-black/40',
  
  // CMS Post statuses
  draft: 'border-yellow-400 bg-yellow-50 text-yellow-700',
  published: 'border-emerald-400 bg-emerald-50 text-emerald-700',
  archived: 'border-black/30 bg-gray-200 text-black/40',

  // Project statuses
  planning: 'border-blue-300 bg-blue-50 text-blue-700',
  review: 'border-orange-300 bg-orange-50 text-orange-700',
  deployed: 'border-emerald-400 bg-emerald-50 text-emerald-700',
  completed: 'border-emerald-500 bg-emerald-100 text-emerald-800',
  on_hold: 'border-yellow-400 bg-yellow-50 text-yellow-700',
  cancelled: 'border-red-300 bg-red-50 text-red-700',

  // Task statuses
  todo: 'border-gray-300 bg-gray-50 text-gray-700',
  done: 'border-emerald-400 bg-emerald-50 text-emerald-700',

  // Client statuses
  lead: 'border-blue-300 bg-blue-50 text-blue-700',
  onboarding: 'border-yellow-400 bg-yellow-50 text-yellow-700',
  active: 'border-emerald-400 bg-emerald-50 text-emerald-700',
  inactive: 'border-gray-300 bg-gray-50 text-gray-600',
  churned: 'border-red-300 bg-red-50 text-red-700',

  // Priority
  low: 'border-gray-300 bg-gray-50 text-gray-600',
  medium: 'border-yellow-400 bg-yellow-50 text-yellow-700',
  high: 'border-orange-400 bg-orange-50 text-orange-700',
  urgent: 'border-red-500 bg-red-100 text-red-700',
  critical: 'border-red-600 bg-red-200 text-red-800',
};

function formatLabel(status: string): string {
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const colorClasses = statusColors[status] || 'border-black/20 bg-gray-100 text-black/50';

  return (
    <span
      className={`inline-flex items-center border-2 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${colorClasses}`}
    >
      {formatLabel(status)}
    </span>
  );
}
