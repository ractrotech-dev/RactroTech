import { KpiCard } from '@/components/admin/ui';
import { formatCount } from '@/lib/admin/format';

interface StatCardProps {
  title: string;
  /** A number is formatted (1,284); `null` means the query failed and shows "—". */
  value: string | number | null;
  icon?: React.ReactNode;
  /** Short caption under the value (counts, status text) — not a fake percentage. */
  hint?: string;
  href?: string;
  /** Kept for older call sites; cards no longer carry a colour of their own. */
  accent?: 'yellow' | 'green' | 'blue' | 'red' | 'violet';
}

export default function StatCard({ title, value, icon, hint, href }: StatCardProps) {
  const shown = typeof value === 'string' ? value : formatCount(value);
  return <KpiCard label={title} value={shown} hint={hint} href={href} icon={icon} />;
}
