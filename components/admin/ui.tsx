import Link from 'next/link';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * The admin's building blocks. Every admin page is assembled from these so the panel reads
 * as one calm, data-first tool rather than a page-by-page style.
 *
 * The rules they encode:
 * - Surfaces are the marketing tokens (--mkt-*), so light and dark mode come for free.
 * - Hairline borders and rounded corners; no hard drop shadows, no 4px black outlines.
 * - Labels are 13px, sentence case, muted. Nothing in the admin is smaller than 12px,
 *   except the 11px count bubbles on the bell and the sidebar.
 * - A number is the largest thing in its card, set in tabular figures so columns line up.
 * - Colour is information: violet is the one accent, the status tones mean a status.
 *
 * Server-safe on purpose (no hooks, no 'use client'): pages are Server Components, and a
 * client wrapper here would make every icon passed as a prop a serialisation error.
 * Pass icons as rendered elements (`icon={<Inbox />}`), not as components.
 */

// ─── Surfaces ────────────────────────────────────────────────────────────────

export function AdminCard({
  children,
  className,
  as: Comp = 'section',
}: {
  children: ReactNode;
  className?: string;
  as?: 'section' | 'div' | 'article' | 'aside';
}) {
  return (
    <Comp className={cn('rounded-2xl border border-mkt-line bg-mkt-surface text-mkt-ink', className)}>
      {children}
    </Comp>
  );
}

/** Title row of a card. `action` sits on the right: a link, a button, a count. */
export function CardHeader({
  title,
  description,
  action,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-wrap items-start justify-between gap-3 border-b border-mkt-line px-5 py-4', className)}>
      <div className="min-w-0">
        <h2 className="text-[15px] font-semibold leading-6 text-mkt-ink">{title}</h2>
        {description ? <p className="mt-0.5 text-[13px] leading-5 text-mkt-muted">{description}</p> : null}
      </div>
      {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
    </div>
  );
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('p-5', className)}>{children}</div>;
}

// ─── Numbers ─────────────────────────────────────────────────────────────────

/**
 * One headline number. `value` arrives already formatted (lib/admin/format.ts), so an
 * unknown value shows as "—" rather than a made-up zero.
 */
export function KpiCard({
  label,
  value,
  hint,
  href,
  icon,
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  href?: string;
  icon?: ReactNode;
  className?: string;
}) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] font-medium text-mkt-muted">{label}</p>
        {icon ? (
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-mkt-lavender text-mkt-violet [&_svg]:h-4 [&_svg]:w-4">
            {icon}
          </span>
        ) : null}
      </div>
      <p className="mt-3 font-display text-[30px] font-semibold leading-none tracking-[-0.02em] tabular-nums text-mkt-ink">
        {value}
      </p>
      {hint ? <p className="mt-2 text-[13px] leading-5 text-mkt-muted">{hint}</p> : null}
    </>
  );

  const shell = 'block rounded-2xl border border-mkt-line bg-mkt-surface p-5 text-mkt-ink';
  return href ? (
    <Link
      href={href}
      className={cn(
        shell,
        'transition-colors duration-150 hover:border-mkt-violet/40 hover:bg-mkt-lavender/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mkt-violet',
        className
      )}
    >
      {body}
    </Link>
  ) : (
    <div className={cn(shell, className)}>{body}</div>
  );
}

/** A labelled value inside a detail page's summary row. */
export function MetaItem({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn('min-w-0', className)}>
      <p className="text-[13px] font-medium text-mkt-muted">{label}</p>
      <div className="mt-1.5 text-[15px] font-medium text-mkt-ink">{children}</div>
    </div>
  );
}

// ─── Badges ──────────────────────────────────────────────────────────────────

export type BadgeTone = 'neutral' | 'violet' | 'green' | 'amber' | 'red' | 'blue';

const BADGE_TONE: Record<BadgeTone, string> = {
  neutral: 'bg-mkt-ink/[0.06] text-mkt-ink/70',
  violet: 'bg-mkt-violet/10 text-mkt-violet',
  green: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  amber: 'bg-amber-500/15 text-amber-800 dark:text-amber-300',
  red: 'bg-red-500/10 text-red-700 dark:text-red-300',
  blue: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
};

export function Badge({ tone = 'neutral', children, className }: { tone?: BadgeTone; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-[12px] font-medium leading-5',
        BADGE_TONE[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

// ─── Tables ──────────────────────────────────────────────────────────────────

/** Wrap a <table>; scrolls sideways on narrow screens instead of squashing columns. */
export function DataTable({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="overflow-x-auto">
      <table className={cn('w-full text-left text-[14px] text-mkt-ink', className)}>{children}</table>
    </div>
  );
}

/** Class names for table parts, for the cells a page writes itself. */
export const table = {
  headRow: 'border-b border-mkt-line',
  th: 'whitespace-nowrap px-5 py-3 text-[12px] font-medium text-mkt-muted',
  /** Right-aligned numeric column header. */
  thNum: 'whitespace-nowrap px-5 py-3 text-right text-[12px] font-medium text-mkt-muted',
  row: 'border-b border-mkt-line last:border-b-0 transition-colors hover:bg-mkt-ink/[0.025]',
  td: 'px-5 py-3.5 align-middle',
  /** Right-aligned number cell, tabular figures. */
  tdNum: 'px-5 py-3.5 text-right align-middle tabular-nums',
  muted: 'text-mkt-muted',
} as const;

// ─── Actions ─────────────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

const BUTTON_VARIANT: Record<ButtonVariant, string> = {
  primary: 'bg-mkt-violet text-white hover:bg-mkt-violet-deep',
  secondary: 'border border-mkt-line bg-mkt-surface text-mkt-ink hover:bg-mkt-ink/[0.04]',
  ghost: 'text-mkt-muted hover:bg-mkt-ink/[0.05] hover:text-mkt-ink',
  danger: 'border border-red-500/30 bg-mkt-surface text-red-600 hover:bg-red-500/10 dark:text-red-400',
};

/** For <button>, <Link> and <a> alike. */
export function buttonClass(variant: ButtonVariant = 'secondary', size: 'sm' | 'md' = 'md', className?: string) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mkt-violet focus-visible:ring-offset-2 focus-visible:ring-offset-mkt-surface disabled:pointer-events-none disabled:opacity-50 [&_svg]:h-4 [&_svg]:w-4',
    size === 'sm' ? 'h-8 px-3 text-[13px]' : 'h-9 px-4 text-[14px]',
    BUTTON_VARIANT[variant],
    className
  );
}

export function ButtonLink({
  href,
  children,
  variant = 'secondary',
  size = 'md',
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: 'sm' | 'md';
  className?: string;
}) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)}>
      {children}
    </Link>
  );
}

/** A quiet text link, e.g. "View all" in a card header. */
export function TextLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={cn('text-[13px] font-medium text-mkt-violet hover:underline underline-offset-4', className)}>
      {children}
    </Link>
  );
}

// ─── Forms ───────────────────────────────────────────────────────────────────

/** Class names for inputs, selects and textareas, so forms match without a component each. */
export const field = {
  label: 'mb-1.5 block text-[13px] font-medium text-mkt-ink',
  input:
    'h-10 w-full rounded-lg border border-mkt-line bg-mkt-surface px-3 text-[14px] text-mkt-ink placeholder:text-mkt-muted/70 transition-colors focus:border-mkt-violet focus:outline-none focus:ring-2 focus:ring-mkt-violet/20 disabled:opacity-60',
  textarea:
    'min-h-[96px] w-full rounded-lg border border-mkt-line bg-mkt-surface px-3 py-2.5 text-[14px] leading-6 text-mkt-ink placeholder:text-mkt-muted/70 transition-colors focus:border-mkt-violet focus:outline-none focus:ring-2 focus:ring-mkt-violet/20',
  hint: 'mt-1.5 text-[12px] text-mkt-muted',
  error: 'mt-1.5 text-[12px] text-red-600 dark:text-red-400',
} as const;

// ─── Feedback ────────────────────────────────────────────────────────────────

/** A one-line note above content: a partial load, a saved change, a warning. */
export function Notice({
  tone = 'neutral',
  title,
  children,
  className,
}: {
  tone?: 'neutral' | 'amber' | 'red' | 'green';
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  const tones = {
    neutral: 'border-mkt-line bg-mkt-ink/[0.03] text-mkt-ink',
    amber: 'border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200',
    red: 'border-red-500/30 bg-red-500/10 text-red-800 dark:text-red-200',
    green: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200',
  } as const;
  return (
    <div role="status" className={cn('rounded-xl border px-4 py-3 text-[13px] leading-5', tones[tone], className)}>
      {title ? <p className="font-semibold">{title}</p> : null}
      {children ? <div className={cn(title && 'mt-0.5', 'opacity-90')}>{children}</div> : null}
    </div>
  );
}
