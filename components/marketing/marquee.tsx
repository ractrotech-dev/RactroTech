import { cn } from '@/lib/utils';

type MarqueeProps = {
  children: React.ReactNode;
  /** Seconds for one full loop. Longer = slower. */
  durationSeconds?: number;
  className?: string;
};

/**
 * CSS-driven infinite scroller. Renders `children` twice so the -50% keyframe
 * (`mkt-marquee` in tailwind.config.ts) loops seamlessly. Pauses on hover and is
 * disabled entirely under `prefers-reduced-motion` — both handled in globals.css,
 * which keeps this a server component.
 */
export function Marquee({ children, durationSeconds = 42, className }: MarqueeProps) {
  return (
    <div className={cn('mkt-marquee-mask w-full overflow-hidden', className)}>
      <div
        className="mkt-marquee-track flex w-max"
        style={{ '--mkt-marquee-duration': `${durationSeconds}s` } as React.CSSProperties}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
