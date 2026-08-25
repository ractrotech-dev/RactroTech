import { cn } from '@/lib/utils';

/**
 * The page backdrop for every public-facing shell: marketing, blog and auth.
 *
 * Three things it deliberately owns:
 *
 * 1. **The surface colour.** The shells used to paint `bg-mkt-surface` themselves, which
 *    covered anything behind them. They are transparent now, so this layer carries the
 *    canvas instead — `body` alone would not do, because `--background` and the marketing
 *    canvas are different colours and the shells need the marketing one.
 *
 * 2. **`fixed`, not `absolute`.** The grid stays locked to the viewport while the page
 *    scrolls. An absolute grid would scroll with the content and read as a texture
 *    printed on the sections rather than a backdrop sitting behind them. Being viewport
 *    -fixed also means the ruling is continuous down the whole page instead of restarting
 *    at each section, so no seams appear where two transparent sections meet.
 *
 * 3. **The contrast contract.** `tone="canvas"` is the violet page: anything placed
 *    directly on it must be white or sit on its own surface. `tone="surface"` is the old
 *    neutral page, kept for reading- and form-heavy shells whose long-form prose is set in
 *    near-black ink.
 *
 * Mount it as the first child of a shell that is `relative isolate`. The `isolate` is
 * load-bearing: it pins this `-z-10` layer to that shell's stacking context, so it lands
 * above the shell's own background and below every descendant. Without it the layer
 * escapes to the root context, where in-flow section backgrounds paint over it.
 */
export function GlobalBackground({
  className,
  tone = 'canvas',
  vignette = false,
}: {
  className?: string;
  tone?: 'canvas' | 'surface';
  /**
   * Fade the ruling out toward the viewport edges. Off by default: the grid now runs
   * border to border, which is what makes the violet read as one continuous ruled plane
   * behind the whole page rather than as a spotlit panel with soft edges. Kept as an
   * opt-in because a page whose content stops well short of the viewport edge can still
   * want the falloff.
   */
  vignette?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none fixed inset-0 -z-10',
        tone === 'canvas' ? 'bg-mkt-canvas' : 'bg-mkt-surface',
        className
      )}
    >
      {tone === 'canvas' ? (
        <div className={cn('mkt-grid absolute inset-0', vignette && 'mkt-dot-mask')} />
      ) : null}
    </div>
  );
}
