import Link from 'next/link';
import { ArrowUpRight, ChevronRight } from 'lucide-react';

import { NavArtMark } from '@/components/marketing/nav-art';
import type { NavColumn, NavEntry, NavFeature, NavLink } from '@/lib/marketing/nav';
import type { Tone } from '@/lib/marketing/tones';
import { cn } from '@/lib/utils';

/**
 * The contents of the header's hover panel.
 *
 * Split out from site-header.tsx on purpose: the header owns the *interaction* — hover
 * intent, the morph between panels, focus and Escape — and this file owns the *layout*.
 * Keeping them apart means the panel can be laid out and read without wading through
 * timers and measurement effects.
 *
 * Colour works exactly like components/marketing/tone-card.tsx: the panel publishes
 * `--tone-fill` and `--tone-ink` and everything inside styles itself from those at an
 * alpha, so one markup tree serves all six tones and still flips with the theme. Note that
 * `text-current/70` cannot stand in for `text-[rgb(var(--tone-ink)/0.7)]` here — Tailwind
 * has no alpha channel to modify on the `currentColor` keyword and emits nothing.
 */

/** Re-declared rather than imported from tone-card so the panel can be tuned on its own:
 *  a 20px hairline inside a dropdown needs more contrast than one inside a big card. */
const RULE = 'border-[rgb(var(--tone-ink)/0.16)]';
const MUTED = 'text-[rgb(var(--tone-ink)/0.68)]';

export const PANEL_TONE_VARS: Record<Tone, React.CSSProperties> = {
  mint: { '--tone-fill': 'var(--mkt-mint)', '--tone-ink': 'var(--mkt-on-mint)' },
  sky: { '--tone-fill': 'var(--mkt-sky)', '--tone-ink': 'var(--mkt-on-sky)' },
  butter: { '--tone-fill': 'var(--mkt-butter)', '--tone-ink': 'var(--mkt-on-butter)' },
  pink: { '--tone-fill': 'var(--mkt-pink)', '--tone-ink': 'var(--mkt-on-pink)' },
  lilac: { '--tone-fill': 'var(--mkt-lilac)', '--tone-ink': 'var(--mkt-on-lilac)' },
  peach: { '--tone-fill': 'var(--mkt-peach)', '--tone-ink': 'var(--mkt-on-peach)' },
} as Record<Tone, React.CSSProperties>;

function FeatureRow({
  item,
  onNavigate,
  className,
}: {
  item: NavFeature;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      /* -mx-3 px-3 so the hover wash extends past the text to the column's optical edge
         without the text itself shifting when it appears. */
      className={cn(
        'group/feature -mx-3 flex items-start gap-3 rounded-2xl px-3 py-3 transition-colors duration-200 hover:bg-[rgb(var(--tone-ink)/0.08)]',
        className
      )}
    >
      <span className="min-w-0 flex-1">
        <span className="mkt-display flex items-center gap-1 text-[19px] leading-tight">
          {item.label}
          <ArrowUpRight
            aria-hidden
            className="h-4 w-4 -translate-x-1 opacity-0 transition duration-200 group-hover/feature:translate-x-0 group-hover/feature:opacity-70"
          />
        </span>
        <span className={cn('mt-1.5 block text-[13px] leading-[1.55]', MUTED)}>{item.blurb}</span>
      </span>
      <NavArtMark
        art={item.art}
        className="-mt-1 transition-transform duration-300 ease-out group-hover/feature:-rotate-6 group-hover/feature:scale-105"
      />
    </Link>
  );
}

function LinkRow({ item, onNavigate }: { item: NavLink; onNavigate?: () => void }) {
  const Icon = item.icon;
  return (
    <li className={cn('border-t first:border-t-0', RULE)}>
      <Link
        href={item.href}
        onClick={onNavigate}
        className="group/row -mx-3 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors duration-200 hover:bg-[rgb(var(--tone-ink)/0.08)]"
      >
        <Icon aria-hidden className="h-4 w-4 shrink-0 opacity-65" />
        <span className="min-w-0 truncate">{item.label}</span>
        <ChevronRight
          aria-hidden
          className="ml-auto h-3.5 w-3.5 shrink-0 -translate-x-1 opacity-0 transition duration-200 group-hover/row:translate-x-0 group-hover/row:opacity-60"
        />
      </Link>
    </li>
  );
}

function Column({
  column,
  index,
  onNavigate,
}: {
  column: NavColumn;
  index: number;
  onNavigate?: () => void;
}) {
  /* Feature columns need room for a mark beside two lines of copy; link columns are a
     single line each. Fixed widths rather than fractions so the panel's own width is
     content-derived — that is what the size morph in site-header.tsx animates between.
     They also set the ceiling: the widest panel is three feature/link/feature columns at
     300 + 224 + 300 plus 6 × 24px of padding = 968px, which still clears the 1024px
     breakpoint where the panel first appears. Widen these and that stops being true. */
  const width = column.features?.length ? 'w-[300px]' : 'w-[224px]';

  return (
    <div className={cn('px-6', index > 0 && 'border-l', index > 0 && RULE)}>
      <div className={width}>
        {column.eyebrow ? (
          <p className={cn('mb-3 text-[11px] font-semibold uppercase tracking-[0.09em]', MUTED)}>
            {column.eyebrow}
          </p>
        ) : null}

        {column.features?.map((item, i) => (
          <FeatureRow
            key={item.href + item.label}
            item={item}
            onNavigate={onNavigate}
            className={cn(i > 0 && 'mt-2 border-t', i > 0 && RULE)}
          />
        ))}

        {column.links?.length ? (
          <ul className={cn(column.features?.length && 'mt-3 border-t pt-1', RULE)}>
            {column.links.map((item) => (
              <LinkRow key={item.href + item.label} item={item} onNavigate={onNavigate} />
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

export function NavPanelContent({
  entry,
  onNavigate,
}: {
  entry: Extract<NavEntry, { kind: 'panel' }>;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex py-7">
      {entry.columns.map((column, index) => (
        <Column key={column.eyebrow ?? index} column={column} index={index} onNavigate={onNavigate} />
      ))}
    </div>
  );
}
