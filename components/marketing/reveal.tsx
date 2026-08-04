'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

/**
 * Scroll reveal for the marketing landing sections.
 *
 * The hard rule here: the hidden state must never reach the server-rendered HTML.
 * framer-motion serialises `initial` into a style attribute, so `initial={{opacity:0}}`
 * ships a blank page to anyone whose JS is slow, blocked, or whose viewport callback
 * never fires. This site has already shipped that bug once — commit 0467cab, "Fix
 * invisible marketing text", which is why `fade-in-view.tsx` had its variants gutted.
 *
 * So: everything renders visible. After mount we arm the fade only on elements that are
 * still below the fold — content the visitor cannot see yet, and which therefore has a
 * scroll event coming. Anything already on screen is left exactly as rendered.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, amount: 0.2 } as const;

/**
 * Returns true once this element is confirmed below the fold and safe to animate in.
 * Stays false during SSR, during the first client render, for above-fold content, and
 * whenever reduced motion is requested.
 */
function useArmedBelowFold(enabled: boolean) {
  const nodeRef = useRef<HTMLElement | null>(null);
  const [armed, setArmed] = useState(false);

  // Callback ref so one hook serves div/section/ul/li without casting.
  const ref = (node: HTMLElement | null) => {
    nodeRef.current = node;
  };

  useEffect(() => {
    if (!enabled) return;
    const node = nodeRef.current;
    if (!node) return;
    if (node.getBoundingClientRect().top > window.innerHeight) setArmed(true);
  }, [enabled]);

  return { ref, armed };
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
  const { ref, armed } = useArmedBelowFold(!reduced);
  const [revealed, setRevealed] = useState(false);
  const Comp = motion[as];

  const hidden = armed && !revealed;

  return (
    <Comp
      ref={ref}
      className={className}
      // Never `initial` — that is what would serialise into the SSR markup.
      animate={hidden ? { opacity: 0, y } : { opacity: 1, y: 0 }}
      onViewportEnter={() => setRevealed(true)}
      viewport={VIEWPORT}
      // Hiding happens off-screen, so it should be instant; only the reveal eases in.
      transition={hidden ? { duration: 0 } : { duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}

const groupVariants: Variants = {
  hidden: { transition: { duration: 0 } },
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18, transition: { duration: 0 } },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

type RevealGroupProps = {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'ul' | 'section';
};

export function RevealGroup({ children, className, as = 'div' }: RevealGroupProps) {
  const reduced = useReducedMotion();
  const { ref, armed } = useArmedBelowFold(!reduced);
  const [revealed, setRevealed] = useState(false);
  const Comp = motion[as];

  return (
    <Comp
      ref={ref}
      className={className}
      variants={groupVariants}
      animate={armed && !revealed ? 'hidden' : 'show'}
      onViewportEnter={() => setRevealed(true)}
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
