import { DotPattern } from '@/components/ui/dot-pattern';
import { cn } from '@/lib/utils';

/**
 * The page backdrop for every public-facing shell: marketing, blog and auth.
 *
 * Two things it deliberately owns:
 *
 * 1. **The surface colour.** The shells used to paint `bg-mkt-surface` themselves, which
 *    covered anything behind them. They are transparent now, so this layer carries
 *    `bg-mkt-surface` instead — `body` alone would not do, because `--background` and
 *    `--mkt-surface` are the same white in light mode but diverge in dark (slate #020617
 *    vs neutral #0D0D12). Painting it here keeps the marketing surface exactly as it was.
 *
 * 2. **`fixed`, not `absolute`.** The grid stays locked to the viewport while the page
 *    scrolls. An absolute grid would scroll with the content and read as a texture
 *    printed on the sections rather than a backdrop sitting behind them.
 *
 * Mount it as the first child of a shell that is `relative isolate`. The `isolate` is
 * load-bearing: it pins this `-z-10` layer to that shell's stacking context, so it lands
 * above the shell's own background and below every descendant. Without it the layer
 * escapes to the root context, where in-flow section backgrounds paint over it.
 */
export function GlobalBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none fixed inset-0 -z-10 bg-mkt-surface',
        className,
      )}
    >
      <DotPattern className="mkt-dot-mask" />
    </div>
  );
}
