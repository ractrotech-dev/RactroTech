import { formatCount } from '@/lib/admin/format';

interface MiniStatProps {
  icon?: React.ReactNode;
  /** A number is formatted (1,284); `null` shows "—". */
  value: number | string | null;
  label: string;
  /** Kept for older call sites; the tile no longer carries a colour of its own. */
  color?: string;
}

/** A compact count for a list page's summary row: label above, number below. */
export default function MiniStat({ icon, value, label }: MiniStatProps) {
  const shown = typeof value === 'string' ? value : formatCount(value);
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-mkt-line bg-mkt-surface px-4 py-3.5 text-mkt-ink">
      {icon ? (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-mkt-lavender text-mkt-violet [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-current">
          {icon}
        </span>
      ) : null}
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-mkt-muted">{label}</p>
        <p className="mt-0.5 font-display text-[22px] font-semibold leading-tight tracking-[-0.01em] tabular-nums">{shown}</p>
      </div>
    </div>
  );
}
