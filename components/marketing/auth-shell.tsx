import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';

import { BrandLogo } from '@/components/marketing/brand-logo';
import { HeroGlow, Sparkle } from '@/components/marketing/mockups/doodles';
import { GlobalBackground } from '@/components/layout/global-background';

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  /** Short reassurance points shown under the heading. */
  points?: string[];
  children: React.ReactNode;
  /** Rendered under the card — links like "already have an account". */
  footer?: React.ReactNode;
};

/**
 * Shared frame for the standalone auth pages. Deliberately narrow and centred rather
 * than the old split hero: the form is the only thing on these pages that matters.
 */
export function AuthShell({
  eyebrow,
  title,
  description,
  points,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden text-mkt-ink">
      <GlobalBackground tone="surface" />
      <HeroGlow />
      <Sparkle className="absolute left-[8%] top-[16%] hidden h-5 w-5 text-mkt-violet/30 lg:block" />
      <Sparkle className="absolute right-[10%] top-[28%] hidden h-4 w-4 text-mkt-violet/25 lg:block" />

      <div className="mkt-shell relative flex flex-1 flex-col py-8 lg:py-12">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center" aria-label="Ractrotech home">
            <BrandLogo className="h-[26px] text-mkt-brand" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[14px] font-medium text-mkt-muted transition-colors hover:text-mkt-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">
            <div className="mkt-reveal text-center">
              <span className="mkt-eyebrow">
                <span className="h-1.5 w-1.5 rounded-full bg-mkt-violet" />
                {eyebrow}
              </span>
              <h1 className="mkt-display mt-6 text-[30px] leading-[1.1] sm:text-[36px]">{title}</h1>
              <p className="mx-auto mt-3 max-w-sm text-[16px] leading-relaxed text-mkt-muted">
                {description}
              </p>

              {points?.length ? (
                <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                  {points.map((point) => (
                    <li
                      key={point}
                      className="flex items-center gap-1.5 text-[14px] text-mkt-muted"
                    >
                      <Check className="h-3.5 w-3.5 text-mkt-violet" strokeWidth={2.5} aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div
              className="mkt-reveal mt-8 rounded-3xl border border-mkt-line bg-mkt-surface p-6 shadow-[0_18px_44px_-30px_rgba(11,11,16,0.4)] sm:p-8 text-mkt-ink"
              style={{ animationDelay: '0.1s' }}
            >
              {children}
            </div>

            {footer ? (
              <div
                className="mkt-reveal mt-6 text-center text-[15px] text-mkt-muted"
                style={{ animationDelay: '0.15s' }}
              >
                {footer}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Shared field styling so every auth form looks identical. */
export const authFieldClass =
  'w-full rounded-xl border border-mkt-line bg-mkt-surface px-4 py-3 text-[15px] text-mkt-ink placeholder:text-mkt-muted/60 transition-colors focus:border-mkt-violet focus:outline-none focus:ring-2 focus:ring-mkt-violet/20';

export const authLabelClass = 'mb-2 block text-[14px] font-medium text-mkt-ink';

/** Labelled rule used between the credential form and the OAuth buttons. */
export function AuthDivider({ label = 'Or continue with' }: { label?: string }) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center" aria-hidden>
        <span className="w-full border-t border-mkt-line" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-mkt-surface px-3 text-[13px] text-mkt-muted text-mkt-ink">{label}</span>
      </div>
    </div>
  );
}
