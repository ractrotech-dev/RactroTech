import { formatPercent } from '@/lib/admin/format';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number | null | undefined;
  max?: number;
  /** Tailwind background class for the fill. Defaults to the admin accent. */
  color?: string;
  label?: string;
  showPercentage?: boolean;
}

/** A thin bar with the percentage beside it. A missing value shows "—" and an empty track. */
export default function ProgressBar({ value, max = 100, color = 'bg-mkt-violet', label, showPercentage = true }: ProgressBarProps) {
  const known = typeof value === 'number' && Number.isFinite(value) && max > 0;
  const pct = known ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div className="w-full">
      {label || showPercentage ? (
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          {label ? <span className="text-[13px] text-mkt-muted">{label}</span> : <span />}
          {showPercentage ? (
            <span className="text-[13px] font-medium tabular-nums text-mkt-ink">{known ? formatPercent(pct) : '—'}</span>
          ) : null}
        </div>
      ) : null}
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-mkt-ink/[0.08]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={known ? Math.round(pct) : undefined}
      >
        <div className={cn('h-full rounded-full transition-[width] duration-500', color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
