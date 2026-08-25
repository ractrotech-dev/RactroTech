import { Star } from 'lucide-react';

import type { Tone } from '@/lib/marketing/tones';
import { cn } from '@/lib/utils';

/**
 * Colourful data containers — the pastel cards the results mosaic and the review wall are
 * built from.
 *
 * What makes a wall of these read as one designed set rather than six random swatches is
 * that the text is never the neutral --mkt-ink. Each fill is paired with a deep shade of a
 * related hue (--mkt-on-* in globals.css), so a mint card is inked forest green and a pink
 * card is inked plum.
 *
 * Both halves of that pair are published onto the card as CSS custom properties rather
 * than as Tailwind colour classes. That is what lets every element *inside* a card style
 * itself tone-agnostically — `text-[rgb(var(--tone-ink)/0.72)]` for muted copy,
 * `border-[rgb(var(--tone-ink)/0.16)]` for a rule — instead of needing a six-way lookup at
 * every level. `text-current/72` cannot do this: Tailwind has no alpha channel to modify
 * on the `currentColor` keyword, so those classes silently emit nothing.
 *
 * The properties point at the tokens rather than copying their values, so the whole set
 * still flips with the theme when `.dark` re-points --mkt-on-mint and friends.
 */

const TONE_VARS: Record<Tone, React.CSSProperties> = {
  mint: { '--tone-fill': 'var(--mkt-mint)', '--tone-ink': 'var(--mkt-on-mint)' },
  sky: { '--tone-fill': 'var(--mkt-sky)', '--tone-ink': 'var(--mkt-on-sky)' },
  butter: { '--tone-fill': 'var(--mkt-butter)', '--tone-ink': 'var(--mkt-on-butter)' },
  pink: { '--tone-fill': 'var(--mkt-pink)', '--tone-ink': 'var(--mkt-on-pink)' },
  lilac: { '--tone-fill': 'var(--mkt-lilac)', '--tone-ink': 'var(--mkt-on-lilac)' },
  peach: { '--tone-fill': 'var(--mkt-peach)', '--tone-ink': 'var(--mkt-on-peach)' },
} as Record<Tone, React.CSSProperties>;

/** Muted copy on a tone card. Exported so sections can match without re-deriving it. */
export const TONE_MUTED = 'text-[rgb(var(--tone-ink)/0.72)]';
/** Hairline rule on a tone card — footers, dividers. */
export const TONE_RULE = 'border-[rgb(var(--tone-ink)/0.16)]';

type ToneCardProps = {
  tone: Tone;
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'article' | 'figure';
};

/**
 * Base container. Deliberately borderless: a solid pastel block reads as a colour field,
 * and a hairline around it turns the wall into a grid of boxes instead.
 */
export function ToneCard({ tone, children, className, as = 'div' }: ToneCardProps) {
  const Comp = as;
  return (
    <Comp
      style={TONE_VARS[tone]}
      className={cn(
        'rounded-3xl bg-[rgb(var(--tone-fill))] p-6 text-[rgb(var(--tone-ink))] sm:p-7',
        className
      )}
    >
      {children}
    </Comp>
  );
}

/**
 * The small filled square that opens a quote. Drawn rather than typed: the `“` glyph sits
 * on its own baseline and shifts with whichever font actually loads, which is impossible
 * to centre inside an 18px box reliably.
 */
export function QuoteMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'mr-2 inline-flex h-[18px] w-[18px] translate-y-[3px] items-center justify-center rounded-[5px] bg-[rgb(var(--tone-ink))]',
        className
      )}
      aria-hidden
    >
      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 fill-[rgb(var(--tone-fill))]">
        <path d="M4.6 1.2C2.6 2.3 1.4 4 1.4 6.1c0 1.6 1 2.7 2.4 2.7 1.3 0 2.2-.9 2.2-2.1 0-1.2-.8-2-1.9-2-.2 0-.4 0-.5.1.2-1 .9-1.9 2-2.6l-1-1zM10.2 1.2C8.2 2.3 7 4 7 6.1c0 1.6 1 2.7 2.4 2.7 1.3 0 2.2-.9 2.2-2.1 0-1.2-.8-2-1.9-2-.2 0-.4 0-.5.1.2-1 .9-1.9 2-2.6l-1-1z" />
      </svg>
    </span>
  );
}

/** Star row inked in the card's own tone rather than a generic amber. */
export function ToneStars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span
      className={cn('flex shrink-0 gap-0.5', className)}
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            'h-3.5 w-3.5 fill-[rgb(var(--tone-ink))] text-[rgb(var(--tone-ink))]',
            i < rating && 'opacity-100',
            i >= rating && 'opacity-25'
          )}
          aria-hidden
        />
      ))}
    </span>
  );
}

type StatCardProps = {
  tone: Tone;
  /** The headline figure. Kept short — it is set at display size and must not wrap twice. */
  stat: string;
  label: string;
  body?: string;
  /** Optional bottom-right mark: a logo, a badge, an icon. */
  footer?: React.ReactNode;
  className?: string;
  /** Override the figure's type size — a lead card in a mosaic sets its number larger. */
  statClassName?: string;
  as?: 'div' | 'li' | 'article';
};

/** Big-number container: the figure leads, the label explains it, the body qualifies it. */
export function StatCard({
  tone,
  stat,
  label,
  body,
  footer,
  className,
  statClassName,
  as,
}: StatCardProps) {
  return (
    <ToneCard tone={tone} as={as} className={cn('flex flex-col', className)}>
      <div
        className={cn(
          'mkt-display text-[40px] leading-[0.95] text-[rgb(var(--tone-ink))] sm:text-[52px]',
          statClassName
        )}
      >
        {stat}
      </div>
      <div className="mt-3 text-[15px] font-semibold">{label}</div>
      {body ? (
        <p className={cn('mt-2 max-w-md text-[15px] leading-relaxed', TONE_MUTED)}>{body}</p>
      ) : null}
      {footer ? <div className="mt-auto flex justify-end pt-6">{footer}</div> : null}
    </ToneCard>
  );
}

type QuoteCardProps = {
  tone: Tone;
  quote: string;
  author: string;
  /** Company, role — whatever qualifies the name. */
  meta?: string | null;
  rating?: number | null;
  avatarUrl?: string | null;
  className?: string;
  as?: 'div' | 'li' | 'article';
};

/** Quote container: mark, quote at display size, then attribution across the footer. */
export function QuoteCard({
  tone,
  quote,
  author,
  meta,
  rating,
  avatarUrl,
  className,
  as,
}: QuoteCardProps) {
  return (
    <ToneCard tone={tone} as={as} className={cn('flex flex-col', className)}>
      <blockquote className="flex flex-1 flex-col">
        <p className="mkt-display text-[18px] font-normal leading-[1.4] text-[rgb(var(--tone-ink))] sm:text-[20px]">
          <QuoteMark />
          {quote}
        </p>

        <footer className={cn('mt-auto flex items-end justify-between gap-4 border-t pt-5', TONE_RULE)}>
          <div className="flex min-w-0 items-center gap-2.5">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt=""
                className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-[rgb(var(--tone-ink)/0.15)]"
              />
            ) : null}
            <div className="min-w-0">
              <div className="truncate text-[14px] font-semibold">{author}</div>
              {meta ? (
                <div className={cn('truncate text-[13px]', TONE_MUTED)}>{meta}</div>
              ) : null}
            </div>
          </div>
          {rating ? <ToneStars rating={rating} className="mb-1" /> : null}
        </footer>
      </blockquote>
    </ToneCard>
  );
}
