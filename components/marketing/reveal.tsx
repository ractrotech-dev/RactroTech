import { cn } from '@/lib/utils';

/**
 * Entrance animation for the marketing sections.
 *
 * Pure CSS by design — no IntersectionObserver, no state, no client JS. Earlier
 * framer-motion versions of this component hid content at opacity 0 and relied on a
 * viewport callback to bring it back, which blanked whole pages when that callback did
 * not fire (and shipped `opacity:0` into the SSR markup). This site had already been
 * burned by that once, in commit 0467cab.
 *
 * With a plain CSS animation there is nothing left to fail: if the stylesheet loads the
 * content fades up, and if it does not, the rule simply is not there and the content
 * renders normally. These are server components, so they add no JavaScript at all.
 *
 * The trade-off is that the animation plays on load rather than on scroll. Content far
 * down the page has finished animating by the time it is reached, which is invisible to
 * the visitor and worth it for never showing a blank page.
 */

type As = 'div' | 'section' | 'li' | 'article' | 'ul';

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Seconds to hold before this element fades up. */
  delay?: number;
  as?: As;
};

export function Reveal({ children, className, delay, as = 'div' }: RevealProps) {
  const Comp = as;
  return (
    <Comp
      className={cn('mkt-reveal', className)}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </Comp>
  );
}

type RevealGroupProps = {
  children: React.ReactNode;
  className?: string;
  as?: As;
};

/**
 * Staggers its direct children. The stagger is a `:nth-child` rule in globals.css, so
 * items need no index prop and the whole thing stays server-rendered.
 */
export function RevealGroup({ children, className, as = 'div' }: RevealGroupProps) {
  const Comp = as;
  return <Comp className={cn('mkt-reveal-group', className)}>{children}</Comp>;
}

type RevealItemProps = {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'article';
};

/** Must be a direct child of `RevealGroup` — the stagger selector targets `> *`. */
export function RevealItem({ children, className, as = 'div' }: RevealItemProps) {
  const Comp = as;
  return <Comp className={className}>{children}</Comp>;
}
