/**
 * How the admin shows numbers, money and dates — one place, so every page reads the same
 * and a missing value is never dressed up as a real one.
 *
 * The rule: `null` / `undefined` / NaN mean "we do not know" and render as an em dash. Only a
 * real zero renders as 0. Queries that fail should hand these helpers `null`, not a fallback
 * number — a dashboard that says "0 inquiries" when the query broke is lying.
 */

const DASH = '—';

/** Budgets are stored as bare numbers; every screen has always shown them as US dollars. */
export const ADMIN_CURRENCY = 'USD';
const LOCALE = 'en-US';

const countFormat = new Intl.NumberFormat(LOCALE);
const compactFormat = new Intl.NumberFormat(LOCALE, { notation: 'compact', maximumFractionDigits: 1 });

function toNumber(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

/** 1,284 — or — when unknown. */
export function formatCount(value: number | string | null | undefined): string {
  const n = toNumber(value);
  return n === null ? DASH : countFormat.format(n);
}

/** 12.4K — for tight spaces like chart axes. */
export function formatCompact(value: number | string | null | undefined): string {
  const n = toNumber(value);
  return n === null ? DASH : compactFormat.format(n);
}

/** $12,500 — whole units unless the value has cents. */
export function formatCurrency(value: number | string | null | undefined): string {
  const n = toNumber(value);
  if (n === null) return DASH;
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: ADMIN_CURRENCY,
    maximumFractionDigits: Number.isInteger(n) ? 0 : 2,
  }).format(n);
}

const oneDecimal = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 1 });
const ratingFormat = new Intl.NumberFormat(LOCALE, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** 512 B, 14.2 KB, 3.1 MB, 1.2 GB — or — when the size is unknown. */
export function formatFileSize(bytes: number | string | null | undefined): string {
  const n = toNumber(bytes);
  if (n === null || n < 0) return DASH;
  if (n < 1024) return `${countFormat.format(n)} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = n / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${oneDecimal.format(value)} ${units[unit]}`;
}

/** An average star rating, always one decimal: "4.0", "4.7". */
export function formatRating(value: number | string | null | undefined): string {
  const n = toNumber(value);
  return n === null ? DASH : ratingFormat.format(n);
}

/** 0–100, clamped, as "68%". */
export function formatPercent(value: number | string | null | undefined): string {
  const n = toNumber(value);
  if (n === null) return DASH;
  return `${Math.round(Math.min(100, Math.max(0, n)))}%`;
}

type DateInput = Date | string | number | null | undefined;

function toDate(value: DateInput): Date | null {
  if (value === null || value === undefined || value === '') return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** "Oct 16, 2026". */
export function formatDate(value: DateInput): string {
  const d = toDate(value);
  return d ? d.toLocaleDateString(LOCALE, { month: 'short', day: 'numeric', year: 'numeric' }) : DASH;
}

/** "Oct 16, 2026, 2:05 PM". */
export function formatDateTime(value: DateInput): string {
  const d = toDate(value);
  return d
    ? d.toLocaleString(LOCALE, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
    : DASH;
}

/** "just now", "5m ago", "3h ago", "2d ago" — then the date, once relative stops being useful. */
export function formatRelative(value: DateInput, now: Date = new Date()): string {
  const d = toDate(value);
  if (!d) return DASH;
  const seconds = Math.round((now.getTime() - d.getTime()) / 1000);
  if (seconds < 0) return formatDate(d);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(d);
}

/** "in_progress" → "In progress". */
export function formatLabel(value: string | null | undefined): string {
  if (!value) return DASH;
  const words = value.replace(/[_-]+/g, ' ').trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}
