import Link from 'next/link';
import { ChevronRight, Home, Plus } from 'lucide-react';

import { Reveal } from '@/components/marketing/reveal';
import { HeroGlow, Sparkle, Underline } from '@/components/marketing/mockups/doodles';

type ComponentsLibraryHeaderProps = {
  totalCount: number;
};

/**
 * Interior hero for /components. Mirrors `PageHero` but is left-aligned and pairs the
 * title with the builder card, because this page carries a live count and a working
 * toolbar underneath rather than a pair of centred CTAs.
 */
export function ComponentsLibraryHeader({ totalCount }: ComponentsLibraryHeaderProps) {
  return (
    <section className="relative overflow-hidden pb-10 pt-12 sm:pt-16">
      <HeroGlow />
      <Sparkle className="absolute left-[8%] top-[38%] hidden h-5 w-5 text-mkt-violet/30 lg:block" />
      <Sparkle className="absolute right-[10%] top-[24%] hidden h-4 w-4 text-mkt-violet/20 lg:block" />

      <Reveal className="mkt-shell relative">
        <nav
          className="flex items-center gap-1.5 text-[13px] text-mkt-muted"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="flex items-center gap-1.5 transition-colors hover:text-mkt-ink">
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-mkt-muted/60" aria-hidden />
          <span className="font-medium text-mkt-ink">Components</span>
        </nav>

        <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="mkt-eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-mkt-violet" />
              Component library
            </span>

            <h1 className="mkt-display mt-6 text-[34px] leading-[1.08] sm:text-[46px]">
              {totalCount > 0 ? `${totalCount}+ website UI &` : 'Website UI &'}{' '}
              <span className="relative inline-block whitespace-nowrap">
                component examples
                <Underline className="absolute -bottom-1 left-0 h-3 w-full text-mkt-violet/60 sm:-bottom-2" />
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-mkt-muted">
              Browse production-ready Tailwind components. Preview live, copy the markup, and drop
              them into your next project.
            </p>
          </div>

          <div className="mkt-card w-full shrink-0 p-6 lg:max-w-sm">
            <p className="mkt-display text-[17px]">Make your own component</p>
            <p className="mt-2 text-[15px] leading-relaxed text-mkt-muted">
              Write Tailwind HTML, preview live on mobile and desktop, and publish it to the
              library.
            </p>
            <Link href="/components/new" className="mkt-btn-primary mt-5 w-full">
              <Plus className="h-4 w-4" />
              Open builder
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
