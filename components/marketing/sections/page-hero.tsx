import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Reveal } from '@/components/marketing/reveal';
import { HeroGlow, Sparkle, Underline } from '@/components/marketing/mockups/doodles';

type Cta = { label: string; href: string };

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  /** Trailing words of the title that get the hand-drawn underline. */
  titleAccent?: string;
  description: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
};

/**
 * Interior-page hero in the marketing system. The retro `MarketingPageHeader` is still
 * used by the pages whose bodies remain retro, so the two stay visually consistent.
 */
export function PageHero({
  eyebrow,
  title,
  titleAccent,
  description,
  primaryCta,
  secondaryCta,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden pb-14 pt-14 sm:pb-20 sm:pt-20">
      <HeroGlow />
      <Sparkle className="absolute left-[10%] top-[30%] hidden h-5 w-5 text-mkt-violet/35 lg:block" />
      <Sparkle className="absolute right-[12%] top-[42%] hidden h-4 w-4 text-mkt-violet/25 lg:block" />

      <Reveal className="mkt-shell relative max-w-3xl text-center">
        {eyebrow ? (
          <span className="mkt-eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-mkt-violet" />
            {eyebrow}
          </span>
        ) : null}

        <h1 className="mkt-display mt-6 text-[36px] leading-[1.06] sm:text-[52px]">
          {title}
          {titleAccent ? (
            <>
              {' '}
              <span className="relative inline-block whitespace-nowrap">
                {titleAccent}
                <Underline className="absolute -bottom-1 left-0 h-3 w-full text-mkt-violet/60 sm:-bottom-2" />
              </span>
            </>
          ) : null}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-mkt-muted sm:text-[18px]">
          {description}
        </p>

        {primaryCta || secondaryCta ? (
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {primaryCta ? (
              <Link href={primaryCta.href} className="mkt-btn-primary w-full sm:w-auto">
                {primaryCta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
            {secondaryCta ? (
              <Link href={secondaryCta.href} className="mkt-btn-ghost w-full sm:w-auto">
                {secondaryCta.label}
              </Link>
            ) : null}
          </div>
        ) : null}
      </Reveal>
    </section>
  );
}
