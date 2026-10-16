'use client';

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from 'framer-motion';

import { cn } from '@/lib/utils';

/**
 * Scroll-driven motion for the marketing pages, built on framer-motion.
 *
 * The rule every component here keeps, learned the hard way (see components/marketing/
 * reveal.tsx): content is never hidden in the server markup, and never hidden on the hope
 * that a viewport callback will fire later. An element only takes its "waiting" state after
 * it has mounted, JavaScript is clearly running, and it is measured to sit below the fold —
 * where hiding it for a moment is invisible. Anything already on screen at load, anything
 * under reduced motion, and anything in a browser without IntersectionObserver simply
 * renders as it is. Crawlers render with a viewport as tall as the page, so for them
 * nothing is ever below the fold and nothing is ever hidden.
 *
 * Above-the-fold entrances (the hero) stay on the pure-CSS `mkt-reveal` path for the same
 * reason: they would have to be hidden at first paint, which is exactly the failure mode.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

// useLayoutEffect so the "waiting" state lands before the browser paints the hydrated
// page; plain useEffect on the server, where layout effects warn and never run anyway.
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const TAGS = {
  div: motion.div,
  section: motion.section,
  ul: motion.ul,
  li: motion.li,
  article: motion.article,
  span: motion.span,
} as const;

type Tag = keyof typeof TAGS;

type EntranceState = 'hidden' | 'shown';

/** Below the fold at mount, motion allowed, and the browser can tell us when it arrives. */
function useEntrance() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [armed, setArmed] = useState(false);
  // A little inside the bottom edge, so the motion plays where the reader is looking.
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' });

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (el.getBoundingClientRect().top > window.innerHeight) setArmed(true);
  }, []);

  const state: EntranceState = armed && !reduce && !inView ? 'hidden' : 'shown';
  return { ref, state };
}

/* `hidden` jumps (duration 0): the element is off screen when it is armed, and a fade *out*
   would only waste the frames before the reader gets there. */
const riseSolo: Variants = {
  hidden: { opacity: 0, y: 18, transition: { duration: 0 } },
  shown: (delay: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE, delay } }),
};

/* No `delay` key here on purpose: a child's own transition delay would override the
   parent's staggerChildren offset and the whole group would land at once. */
const riseItem: Variants = {
  hidden: { opacity: 0, y: 18, transition: { duration: 0 } },
  shown: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds after the element arrives on screen. */
  delay?: number;
  as?: Tag;
};

/** One block that eases up when it scrolls into view. Drop-in for `Reveal` below the fold. */
export function ScrollReveal({ children, className, delay = 0, as = 'div' }: ScrollRevealProps) {
  const { ref, state } = useEntrance();
  const Comp = TAGS[as] as typeof motion.div;
  return (
    <Comp
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      initial={false}
      animate={state}
      variants={riseSolo}
      custom={delay}
      data-motion=""
    >
      {children}
    </Comp>
  );
}

type ScrollStaggerProps = {
  children: ReactNode;
  className?: string;
  as?: Tag;
  /** Seconds between children. */
  stagger?: number;
};

/** A group whose `ScrollStaggerItem` children arrive one after another. Drop-in for `RevealGroup`. */
export function ScrollStagger({ children, className, as = 'div', stagger = 0.08 }: ScrollStaggerProps) {
  const { ref, state } = useEntrance();
  const Comp = TAGS[as] as typeof motion.div;
  return (
    <Comp
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      initial={false}
      animate={state}
      variants={{ hidden: {}, shown: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </Comp>
  );
}

type ScrollStaggerItemProps = {
  children: ReactNode;
  className?: string;
  as?: Tag;
  /**
   * For cards that are links: a lift and a soft spotlight that follows the pointer. Leave it
   * off for cards that cannot be clicked — hover feedback on a dead surface reads as broken.
   */
  interactive?: boolean;
};

/** Must be a direct child of `ScrollStagger`; it takes its timing from the parent. */
export function ScrollStaggerItem({ children, className, as = 'div', interactive = false }: ScrollStaggerItemProps) {
  const Comp = TAGS[as] as typeof motion.div;
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const spotlight = useMotionTemplate`radial-gradient(320px circle at ${x}px ${y}px, rgb(var(--mkt-violet) / 0.1), transparent 70%)`;

  if (!interactive) {
    return (
      <Comp className={className} variants={riseItem} data-motion="">
        {children}
      </Comp>
    );
  }

  return (
    <Comp
      className={cn('group', className)}
      variants={riseItem}
      data-motion=""
      whileHover={{ y: -4, transition: { type: 'spring', stiffness: 320, damping: 26 } }}
      onPointerMove={(event: React.PointerEvent<HTMLElement>) => {
        const box = event.currentTarget.getBoundingClientRect();
        x.set(event.clientX - box.left);
        y.set(event.clientY - box.top);
      }}
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlight }}
      />
      {children}
    </Comp>
  );
}

/**
 * A rule that draws itself across a stepped sequence as the group arrives. Place it as the
 * first child of a `ScrollStagger` whose container is `relative`; position it with className.
 */
export function StaggerConnector({ className }: { className?: string }) {
  return (
    <motion.div
      aria-hidden
      className={cn('pointer-events-none absolute origin-left', className)}
      variants={{
        hidden: { scaleX: 0, transition: { duration: 0 } },
        shown: { scaleX: 1, transition: { duration: 1.1, ease: EASE, delay: 0.15 } },
      }}
    />
  );
}

/**
 * The hero's one scroll-linked moment: the product shot starts tipped back, settles as the
 * page loads, and lies flat by the time the reader has scrolled to it. The spring is what
 * turns the first measurement into a settle rather than a snap.
 *
 * Driven by a plain scroll listener rather than `useScroll({ target })`, which wants a
 * positioned scroll container (the document root here is static) and, with a measured
 * range, only picked up the first measurement after the reader's first scroll.
 */
export function HeroTilt({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const raw = useMotionValue(0);
  const progress = useSpring(raw, { stiffness: 90, damping: 24, restDelta: 0.001 });
  const rotateX = useTransform(progress, [0, 1], [10, 0]);
  const scale = useTransform(progress, [0, 1], [0.94, 1]);

  useIsoLayoutEffect(() => {
    // Reduced motion: no listeners. `.mkt-tilt` in globals.css holds the shot flat — a style
    // rule rather than a branch here, because the server cannot know the setting and the
    // markup has to match on both sides.
    if (reduce) return;

    // Scroll positions at which the shot starts flattening and lies flat.
    let from = 0;
    let to = 1;
    const update = () => raw.set(Math.min(1, Math.max(0, (window.scrollY - from) / (to - from))));
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      // From "top edge enters the viewport" to "top edge is 45% down the viewport".
      from = top - window.innerHeight;
      to = top - window.innerHeight * 0.45;
      update();
    };

    measure();
    // Web fonts can reflow the headline above the shot after first paint.
    void document.fonts?.ready.then(measure);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', measure);
    };
  }, [raw, reduce]);

  return (
    <div ref={ref} className={className} style={{ perspective: 1600 }}>
      <motion.div className="mkt-tilt" style={{ rotateX, scale, transformOrigin: '50% 0%' }}>
        {children}
      </motion.div>
    </div>
  );
}
