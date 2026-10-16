'use client';

import { useEffect, useRef, useState } from 'react';
import { LayoutGroup, motion, useInView, useReducedMotion } from 'framer-motion';

import { cn } from '@/lib/utils';

/** Faux delivery board for the dark process section. Decorative only. */

type Card = { title: string; meta: string };
type Column = { title: string; accent: string; cards: Card[] };

const COLUMNS: Column[] = [
  {
    title: 'Scoped',
    accent: 'bg-[#6b7280]',
    cards: [
      { title: 'Auth + roles', meta: 'Week 1' },
      { title: 'Billing model', meta: 'Week 1' },
    ],
  },
  {
    title: 'In design',
    accent: 'bg-[#f0a71c]',
    cards: [
      { title: 'Onboarding flow', meta: '3 screens' },
      { title: 'Admin dashboard', meta: 'In review' },
    ],
  },
  {
    title: 'In build',
    accent: 'bg-mkt-violet',
    cards: [
      { title: 'Stripe checkout', meta: 'PR #142' },
      { title: 'Team invites', meta: 'PR #147' },
      { title: 'Usage limits', meta: 'PR #151' },
    ],
  },
  {
    title: 'Shipped',
    accent: 'bg-[#2bb673]',
    cards: [{ title: 'Marketing site', meta: 'Live' }],
  },
];

/**
 * What the live board does once it scrolls into view: one card ships, and the next one
 * moves into build behind it — the section's "you see the board" promise, acted out.
 */
const STORY = [
  { at: 900, card: 'Usage limits', to: 'Shipped', meta: 'Live' },
  { at: 2000, card: 'Admin dashboard', to: 'In build', meta: 'PR #156' },
];

function move(columns: Column[], title: string, to: string, meta: string): Column[] {
  const card = columns.flatMap((c) => c.cards).find((c) => c.title === title);
  if (!card) return columns;
  return columns.map((col) => {
    const cards = col.cards.filter((c) => c.title !== title);
    return col.title === to ? { ...col, cards: [{ ...card, meta }, ...cards] } : { ...col, cards };
  });
}

/**
 * `live` plays STORY once when the board scrolls into view, with each card gliding between
 * columns on a shared layout animation. Off by default: the same mock appears in the looping
 * project marquee, where cloned copies must stay still (and must not share layout ids).
 */
export function KanbanMock({ className, live = false }: { className?: string; live?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [columns, setColumns] = useState(COLUMNS);
  const [moved, setMoved] = useState<string[]>([]);

  useEffect(() => {
    if (!live || reduce || !inView) return;
    const timers = STORY.map((step) =>
      window.setTimeout(() => {
        setColumns((current) => move(current, step.card, step.to, step.meta));
        setMoved((current) => [...current, step.card]);
      }, step.at)
    );
    return () => timers.forEach(window.clearTimeout);
  }, [live, reduce, inView]);

  const animateLayout = live && !reduce;

  return (
    <div ref={ref} className={cn('bg-mkt-contrast-soft p-3 sm:p-4', className)} aria-hidden>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-[13px] font-semibold text-white">Sprint 4 · Client SaaS</div>
          <div className="text-[10px] text-white/40">Weekly demo Thursday</div>
        </div>
        <div className="hidden gap-1 sm:flex">
          {['JD', 'AR', 'MK'].map((initials, i) => (
            <div
              key={initials}
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-semibold text-white ring-2 ring-mkt-ink-soft',
                i === 0 ? 'bg-mkt-violet' : i === 1 ? 'bg-[#2bb673]' : 'bg-[#f0a71c]'
              )}
            >
              {initials}
            </div>
          ))}
        </div>
      </div>

      <LayoutGroup>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
              <div className="mb-2 flex items-center gap-1.5 px-0.5">
                <span className={cn('h-1.5 w-1.5 rounded-full', col.accent)} />
                <span className="text-[10px] font-medium text-white/70">{col.title}</span>
                <span className="ml-auto text-[10px] tabular-nums text-white/30">{col.cards.length}</span>
              </div>
              <div className="space-y-1.5">
                {col.cards.map((card) => (
                  <motion.div
                    key={card.title}
                    layout={animateLayout ? 'position' : false}
                    layoutId={animateLayout ? `kanban-${card.title}` : undefined}
                    transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                    className={cn(
                      'rounded-lg border bg-white/[0.05] p-2 transition-colors duration-700',
                      moved.includes(card.title) && col.title === 'Shipped'
                        ? 'border-[#2bb673]/50'
                        : moved.includes(card.title)
                          ? 'border-mkt-violet/50'
                          : 'border-white/10'
                    )}
                  >
                    <div className="truncate text-[10px] font-medium text-white/90">{card.title}</div>
                    <div className="mt-1 text-[9px] text-white/40">{card.meta}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </LayoutGroup>
    </div>
  );
}
