'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

/**
 * Scroll reveal for the marketing landing sections.
 *
 * Deliberately separate from `components/fade-in-view.tsx`, whose variants are no-ops
 * that ~15 retro components still rely on. Children stay in the SSR HTML — only opacity
 * and transform animate — so crawlers still index the full content.
 *
 * The fade starts at opacity 0, so a viewport callback that never fires would leave a
 * whole section invisible. That has bitten this site before (commit 0467cab, "Fix
 * invisible marketing text"), hence `useAboveFoldFallback`: anything already on screen
 * at mount is force-shown shortly after, since it has no scroll event coming to rescue
 * it. Content below the fold is left alone so its reveal still plays on scroll.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, amount: 0.2 } as const;
const FALLBACK_MS = 900;

function useAboveFoldFallback(enabled: boolean) {
  const nodeRef = useRef<HTMLElement | null>(null);
  const [show, setShow] = useState(false);

  // Callback ref so the same hook works for div/section/ul/li without casting.
  const ref = (node: HTMLElement | null) => {
    nodeRef.current = node;
  };

  useEffect(() => {
    if (!enabled) return;
    const node = nodeRef.current;
    if (!node) return;

    const onScreen = node.getBoundingClientRect().top < window.innerHeight;
    if (!onScreen) return;

    const timer = setTimeout(() => setShow(true), FALLBACK_MS);
    return () => clearTimeout(timer);
  }, [enabled]);

  return { ref, show };
}

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: 'div' | 'section' | 'li' | 'article';
};

export function Reveal({ children, className, delay = 0, y = 18, as = 'div' }: RevealProps) {
  const reduced = useReducedMotion();
  const { ref, show } = useAboveFoldFallback(!reduced);
  const Comp = motion[as];

  return (
    <Comp
      ref={ref}
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      animate={show ? { opacity: 1, y: 0 } : undefined}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}

const groupVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

type RevealGroupProps = {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'ul' | 'section';
};

export function RevealGroup({ children, className, as = 'div' }: RevealGroupProps) {
  const reduced = useReducedMotion();
  const { ref, show } = useAboveFoldFallback(!reduced);
  const Comp = motion[as];

  return (
    <Comp
      ref={ref}
      className={className}
      variants={groupVariants}
      initial={reduced ? false : 'hidden'}
      animate={show ? 'show' : undefined}
      whileInView="show"
      viewport={VIEWPORT}
    >
      {children}
    </Comp>
  );
}

type RevealItemProps = {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'article';
};

/** Must be a direct descendant of `RevealGroup` to inherit the stagger. */
export function RevealItem({ children, className, as = 'div' }: RevealItemProps) {
  const Comp = motion[as];
  return (
    <Comp className={className} variants={itemVariants}>
      {children}
    </Comp>
  );
}
