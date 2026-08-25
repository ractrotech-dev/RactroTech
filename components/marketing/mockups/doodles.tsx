import { cn } from '@/lib/utils';

/**
 * Hand-drawn SVG accents scattered around the hero and section headings.
 * All decorative — `aria-hidden` and `pointer-events-none` on every export.
 */

type DoodleProps = { className?: string };

const base = 'pointer-events-none select-none';

export function CurvedArrow({ className }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 96 72"
      fill="none"
      className={cn(base, className)}
      aria-hidden
    >
      <path
        d="M4 6c22 4 42 16 54 34 4 6 7 13 8 21"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M52 58l14 7 3-15"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Squiggle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 24" fill="none" className={cn(base, className)} aria-hidden>
      <path
        d="M2 14c10-12 20 10 30 0s20-12 30 0 20 10 30 0 20-12 26-6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Sparkle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={cn(base, className)} aria-hidden>
      <path
        d="M16 2c1.6 7.2 6.8 12.4 14 14-7.2 1.6-12.4 6.8-14 14-1.6-7.2-6.8-12.4-14-14 7.2-1.6 12.4-6.8 14-14z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Rocket({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={cn(base, className)} aria-hidden>
      <path
        d="M32 4c9 7 14 17 14 29 0 5-1 9-3 13H21c-2-4-3-8-3-13C18 21 23 11 32 4z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="26" r="6" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M21 38l-8 8 10-2M43 38l8 8-10-2M28 50c1.5 4 2.5 7 4 10 1.5-3 2.5-6 4-10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Underline({ className }: DoodleProps) {
  return (
    // `preserveAspectRatio="none"` so the stroke spans the full width of the word it
    // underlines instead of shrinking to fit the (much shorter) height.
    <svg
      viewBox="0 0 200 14"
      fill="none"
      preserveAspectRatio="none"
      className={cn(base, className)}
      aria-hidden
    >
      <path
        d="M3 9c34-6 68-8 102-6 33 2 62 5 92 8"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Circle({ className }: DoodleProps) {
  return (
    // Stretches to encircle whatever phrase it wraps — see Underline for the same reason.
    <svg
      viewBox="0 0 220 84"
      fill="none"
      preserveAspectRatio="none"
      className={cn(base, className)}
      aria-hidden
    >
      <path
        d="M120 6C64 2 12 14 6 40c-6 27 52 40 108 38 50-2 100-16 100-40 0-19-32-30-72-32"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Soft lavender radial glow behind the hero mockup. */
export function HeroGlow({ className }: DoodleProps) {
  return (
    <div
      className={cn(base, 'absolute inset-0 -z-10', className)}
      aria-hidden
      style={{
        background:
          'radial-gradient(60% 55% at 50% 38%, rgba(91,61,245,0.16) 0%, rgba(91,61,245,0.06) 42%, rgba(255,255,255,0) 72%)',
      }}
    />
  );
}
