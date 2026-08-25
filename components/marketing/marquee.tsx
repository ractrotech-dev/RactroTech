import { cn } from '@/lib/utils';

type MarqueeProps = {
  children: React.ReactNode;
  /** Seconds for one full loop. Longer = slower. */
  durationSeconds?: number;
  className?: string;
  /**
   * `center` suits single-line items like the logo strip. `stretch` makes every item
   * share the tallest one's height, which card-sized children need so their footers
   * line up instead of floating at each card's own centre.
   */
  align?: 'center' | 'stretch';
  /** Scroll right-to-left instead. Used to counter-scroll a second row against the first. */
  reverse?: boolean;
};

/**
 * CSS-driven infinite scroller. Renders `children` twice so the -50% keyframe
 * (`mkt-marquee` in tailwind.config.ts) loops seamlessly. Pauses on hover and is
 * disabled entirely under `prefers-reduced-motion` — both handled in globals.css,
 * which keeps this a server component.
 */
export function Marquee({
  children,
  durationSeconds = 42,
  className,
  align = 'center',
  reverse = false,
}: MarqueeProps) {
  const items = cn('flex shrink-0', align === 'stretch' ? 'items-stretch' : 'items-center');

  return (
    <div className={cn('mkt-marquee-mask w-full overflow-hidden', className)}>
      <div
        className={cn('mkt-marquee-track flex w-max', reverse && 'mkt-marquee-track-reverse')}
        style={{ '--mkt-marquee-duration': `${durationSeconds}s` } as React.CSSProperties}
      >
        <div className={items}>{children}</div>
        <div className={items} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
