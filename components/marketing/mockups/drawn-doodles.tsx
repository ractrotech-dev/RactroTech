'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { CIRCLE_PATH, UNDERLINE_PATH } from '@/components/marketing/mockups/doodles';
import { cn } from '@/lib/utils';

/**
 * The hand-drawn accents from doodles.tsx, drawn on as if by a pen. Decoration only, so
 * these are the one place a stroke may wait for JavaScript: without it the words they
 * underline and circle are still there, just unmarked.
 *
 * `initial` is the same on server and client; reduced motion only zeroes the duration. The
 * server cannot know the visitor's setting, so branching `initial` on it breaks hydration.
 */

const base = 'pointer-events-none select-none';
const EASE = [0.65, 0, 0.35, 1] as const;

/** Draws itself under the hero accent once the headline words have landed. */
export function DrawnUnderline({ className, delay = 0.9 }: { className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 200 14" fill="none" preserveAspectRatio="none" className={cn(base, className)} aria-hidden>
      <motion.path
        d={UNDERLINE_PATH}
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={reduce ? { duration: 0 } : { duration: 0.75, ease: EASE, delay }}
      />
    </svg>
  );
}

/** Rings the closing call to action when it scrolls into view. */
export function DrawnCircle({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 220 84" fill="none" preserveAspectRatio="none" className={cn(base, className)} aria-hidden>
      <motion.path
        d={CIRCLE_PATH}
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={reduce ? { duration: 0 } : { duration: 1.1, ease: EASE, delay: 0.35 }}
      />
    </svg>
  );
}
