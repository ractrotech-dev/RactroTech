import { Badge, type BadgeTone } from '@/components/admin/ui';
import { formatLabel } from '@/lib/admin/format';

interface StatusBadgeProps {
  status: string | null | undefined;
  /** Kept for older call sites; the tone is decided by the status itself. */
  variant?: 'inquiry' | 'project' | 'client' | 'task' | 'priority';
}

/**
 * Status → meaning, not status → arbitrary colour: blue is new / not started, amber is
 * moving or waiting, green is done or healthy, red is a problem, violet is a conversion.
 */
const TONE: Record<string, BadgeTone> = {
  new: 'blue',
  lead: 'blue',
  planning: 'blue',
  todo: 'neutral',
  in_progress: 'amber',
  review: 'amber',
  onboarding: 'amber',
  on_hold: 'amber',
  draft: 'amber',
  pending: 'amber',
  responded: 'green',
  published: 'green',
  approved: 'green',
  deployed: 'green',
  completed: 'green',
  done: 'green',
  active: 'green',
  converted: 'violet',
  closed: 'neutral',
  archived: 'neutral',
  inactive: 'neutral',
  low: 'neutral',
  medium: 'blue',
  high: 'amber',
  urgent: 'red',
  critical: 'red',
  cancelled: 'red',
  churned: 'red',
  rejected: 'red',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const key = (status ?? '').toLowerCase();
  return <Badge tone={TONE[key] ?? 'neutral'}>{formatLabel(status)}</Badge>;
}
