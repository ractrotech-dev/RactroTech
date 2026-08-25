import type { NavArt } from '@/lib/marketing/nav';
import { cn } from '@/lib/utils';

/**
 * Decorative marks for the promoted entries in the header panel.
 *
 * Drawn entirely in the host panel's own two colours — `--tone-ink` at four alphas for the
 * strokes and fills, `--tone-fill` for knockouts — rather than in fixed hues. That is what
 * lets one mark sit on the mint Services panel and the pink Company panel without a
 * per-tone variant, and it is also why they survive the dark theme: both properties are
 * re-pointed by `.dark` in globals.css, so the art inverts with the panel it lives on.
 *
 * Geometric on purpose. A photographic or illustrated mark would need six colour-matched
 * versions and an asset request each; these are ~1KB of inline SVG that recolour for free.
 */

const INK = 'rgb(var(--tone-ink))';
const FILL = 'rgb(var(--tone-fill))';
const ink = (alpha: number) => `rgb(var(--tone-ink) / ${alpha})`;

function Stack() {
  return (
    <>
      <rect x="10" y="46" width="60" height="26" rx="8" fill={ink(0.18)} />
      <rect x="16" y="32" width="60" height="26" rx="8" fill={ink(0.38)} stroke={FILL} strokeWidth="2" />
      <rect x="22" y="18" width="60" height="26" rx="8" fill={INK} stroke={FILL} strokeWidth="2" />
      <circle cx="34" cy="31" r="4" fill={FILL} />
      <rect x="44" y="28" width="28" height="5" rx="2.5" fill={ink(0.35)} />
    </>
  );
}

function Orbit() {
  return (
    <>
      <ellipse cx="44" cy="44" rx="36" ry="15" fill="none" stroke={ink(0.3)} strokeWidth="3" transform="rotate(-24 44 44)" />
      <ellipse cx="44" cy="44" rx="36" ry="15" fill="none" stroke={ink(0.5)} strokeWidth="3" transform="rotate(28 44 44)" />
      <circle cx="44" cy="44" r="14" fill={INK} />
      <circle cx="44" cy="44" r="5" fill={FILL} />
      <circle cx="76" cy="30" r="6" fill={INK} stroke={FILL} strokeWidth="2.5" />
    </>
  );
}

function Window() {
  return (
    <>
      <rect x="8" y="16" width="72" height="56" rx="10" fill={ink(0.14)} />
      <rect x="8" y="16" width="72" height="56" rx="10" fill="none" stroke={ink(0.45)} strokeWidth="2.5" />
      <path d="M8 32h72" stroke={ink(0.45)} strokeWidth="2.5" />
      <circle cx="18" cy="24" r="2.5" fill={ink(0.55)} />
      <circle cx="27" cy="24" r="2.5" fill={ink(0.35)} />
      <rect x="18" y="41" width="30" height="6" rx="3" fill={INK} />
      <rect x="18" y="53" width="46" height="5" rx="2.5" fill={ink(0.3)} />
      <rect x="56" y="39" width="14" height="14" rx="4" fill={ink(0.45)} />
    </>
  );
}

function Pillar() {
  return (
    <>
      <rect x="14" y="16" width="60" height="9" rx="4.5" fill={INK} />
      <rect x="20" y="29" width="8" height="34" rx="4" fill={ink(0.5)} />
      <rect x="40" y="29" width="8" height="34" rx="4" fill={ink(0.7)} />
      <rect x="60" y="29" width="8" height="34" rx="4" fill={ink(0.5)} />
      <rect x="10" y="66" width="68" height="9" rx="4.5" fill={INK} />
      <circle cx="44" cy="12" r="5" fill={ink(0.35)} />
    </>
  );
}

function Bloom() {
  return (
    <>
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <ellipse
          key={angle}
          cx="44"
          cy="26"
          rx="11"
          ry="17"
          fill={ink(i % 2 === 0 ? 0.55 : 0.28)}
          transform={`rotate(${angle} 44 44)`}
        />
      ))}
      <circle cx="44" cy="44" r="9" fill={INK} />
      <circle cx="44" cy="44" r="3.5" fill={FILL} />
    </>
  );
}

function Flags() {
  return (
    <>
      <path d="M12 70h64" stroke={ink(0.3)} strokeWidth="3" strokeLinecap="round" />
      <path d="M28 70V22" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M28 24h26l-7 9 7 9H28z" fill={INK} />
      <path d="M60 70V36" stroke={ink(0.5)} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M60 38h16l-4.5 6 4.5 6H60z" fill={ink(0.5)} />
      <circle cx="28" cy="20" r="3.5" fill={ink(0.4)} />
    </>
  );
}

const MARKS: Record<NavArt, () => JSX.Element> = {
  stack: Stack,
  orbit: Orbit,
  window: Window,
  pillar: Pillar,
  bloom: Bloom,
  flags: Flags,
};

export function NavArtMark({ art, className }: { art: NavArt; className?: string }) {
  const Mark = MARKS[art];
  return (
    <svg
      viewBox="0 0 88 88"
      aria-hidden
      className={cn('h-[60px] w-[60px] shrink-0', className)}
    >
      <Mark />
    </svg>
  );
}
