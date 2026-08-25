'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { useMounted } from '@/hooks/use-mounted';
import { cn } from '@/lib/utils';

type MarketingThemeToggleProps = {
  variant?: 'desktop' | 'mobile' | 'inline';
  className?: string;
};

/**
 * Theme switch styled for the marketing header rather than the shadcn dashboard
 * chrome — see components/shared/theme-toggle.tsx for the dashboard equivalent.
 *
 * The theme is only known on the client, so the first paint renders a same-size
 * placeholder. Returning null instead would shift the header layout on hydration.
 */
export function MarketingThemeToggle({
  variant = 'desktop',
  className,
}: MarketingThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useMounted();
  const isDark = resolvedTheme === 'dark';

  /* Bare icon sized to sit inside the header's nav capsule, after its hairline divider.
     Carries no colour of its own — the header passes the tone's item classes in, so one
     variant serves both the white-on-violet and the ink-on-surface headers. */
  if (variant === 'inline') {
    return (
      <button
        type="button"
        disabled={!mounted}
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        aria-label={mounted && isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current',
          className
        )}
      >
        {mounted && isDark ? (
          <Sun className="h-4 w-4" aria-hidden />
        ) : (
          <Moon className="h-4 w-4" aria-hidden />
        )}
      </button>
    );
  }

  if (variant === 'mobile') {
    return (
      <button
        type="button"
        disabled={!mounted}
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className={cn(
          'flex w-full items-center justify-between border-b border-mkt-line py-3.5 text-[16px] font-medium text-mkt-ink',
          className
        )}
      >
        <span>{mounted && isDark ? 'Light mode' : 'Dark mode'}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-mkt-line">
          {mounted && isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={!mounted}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={
        mounted && isDark ? 'Switch to light mode' : 'Switch to dark mode'
      }
      className={cn(
        'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-mkt-line text-mkt-ink transition-colors hover:bg-mkt-lavender focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mkt-violet focus-visible:ring-offset-2',
        className
      )}
    >
      {/* aria-hidden: the button's own label already announces the action. */}
      {mounted && isDark ? (
        <Sun className="h-[18px] w-[18px]" aria-hidden />
      ) : (
        <Moon className="h-[18px] w-[18px]" aria-hidden />
      )}
    </button>
  );
}
