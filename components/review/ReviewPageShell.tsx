import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';

import { ReviewForm } from '@/components/review/ReviewForm';
import { SiteFooter } from '@/components/marketing/site-footer';
import { SiteHeader } from '@/components/marketing/site-header';
import { HeroGlow, Sparkle } from '@/components/marketing/mockups/doodles';
import { GlobalBackground } from '@/components/layout/global-background';

type ReviewPageShellProps = {
  googleReviewUrl: string | null;
};

export function ReviewPageShell({ googleReviewUrl }: ReviewPageShellProps) {
  return (
    <div className="relative isolate flex min-h-screen flex-col text-mkt-ink">
      <GlobalBackground />
      <SiteHeader />

      <main className="relative flex-1 overflow-hidden py-12 lg:py-16">
        <HeroGlow />
        <Sparkle className="absolute left-[9%] top-[18%] hidden h-5 w-5 text-mkt-violet/30 lg:block" />
        <Sparkle className="absolute right-[11%] top-[30%] hidden h-4 w-4 text-mkt-violet/25 lg:block" />

        <div className="mkt-shell relative max-w-xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[14px] font-medium text-mkt-muted transition-colors hover:text-mkt-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>

          <div className="mkt-reveal mt-8 text-center">
            <span className="mkt-eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-mkt-violet" />
              Client review
            </span>
            <h1 className="mkt-display mt-6 text-[30px] leading-[1.1] sm:text-[38px]">
              How did we do?
            </h1>
            <p className="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-mkt-muted">
              Your feedback helps us improve. Submissions are reviewed before they appear on the
              site.
            </p>
          </div>

          <div
            className="mkt-reveal mt-8 rounded-3xl border border-mkt-line bg-mkt-surface p-6 sm:p-8"
            style={{ animationDelay: '0.1s' }}
          >
            <ReviewForm googleReviewUrl={googleReviewUrl} />
          </div>

          {googleReviewUrl ? (
            <div
              className="mkt-reveal mt-4 rounded-3xl border border-mkt-line bg-mkt-lavender p-6"
              style={{ animationDelay: '0.15s' }}
            >
              <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-mkt-muted">
                Google
              </p>
              <p className="mkt-display mt-2 text-[19px]">Prefer Google?</p>
              <p className="mt-2 text-[15px] leading-relaxed text-mkt-muted">
                Leave a public star rating on our Google Business profile. You can do this with or
                without the form above.
              </p>
              <a
                href={googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mkt-btn-ghost mt-5 w-full !bg-mkt-surface"
              >
                Open Google review page
                <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
              </a>
            </div>
          ) : null}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
