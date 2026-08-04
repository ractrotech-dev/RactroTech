import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Reveal } from '@/components/marketing/reveal';
import { BrowserFrame } from '@/components/marketing/mockups/browser-frame';
import { DashboardMock } from '@/components/marketing/mockups/dashboard-mock';
import { CurvedArrow, HeroGlow, Rocket, Sparkle, Underline } from '@/components/marketing/mockups/doodles';
import { HERO } from '@/lib/marketing/home-content';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pb-16 pt-14 sm:pb-20 sm:pt-20 lg:pb-28">
      <HeroGlow />

      {/* Doodle accents — hidden on small screens where there is no room. */}
      <CurvedArrow className="absolute left-[6%] top-[18%] hidden h-16 w-20 -scale-x-100 text-mkt-violet/35 xl:block" />
      <Rocket className="absolute right-[7%] top-[14%] hidden h-16 w-16 rotate-12 text-mkt-ink/20 xl:block" />
      <Sparkle className="absolute left-[12%] top-[46%] hidden h-5 w-5 text-mkt-violet/40 lg:block" />
      <Sparkle className="absolute right-[13%] top-[38%] hidden h-4 w-4 text-mkt-violet/30 lg:block" />

      <div className="mkt-shell relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="mkt-eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-mkt-violet" />
            {HERO.eyebrow}
          </span>

          <h1 className="mkt-display mt-6 text-[40px] leading-[1.05] sm:text-[56px] lg:text-[68px]">
            {HERO.headline}{' '}
            <span className="relative inline-block whitespace-nowrap">
              {HERO.headlineAccent}
              <Underline className="absolute -bottom-1 left-0 h-3 w-full text-mkt-violet/60 sm:-bottom-2 sm:h-4" />
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-mkt-muted sm:text-[18px]">
            {HERO.subhead}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={HERO.primaryCta.href} className="mkt-btn-primary w-full sm:w-auto">
              {HERO.primaryCta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href={HERO.secondaryCta.href} className="mkt-btn-ghost w-full sm:w-auto">
              {HERO.secondaryCta.label}
            </Link>
          </div>

          <p className="mt-5 text-[13px] text-mkt-muted">{HERO.note}</p>
        </Reveal>

        <Reveal className="relative mx-auto mt-14 max-w-5xl" delay={0.15} y={28}>
          <BrowserFrame>
            <DashboardMock className="min-h-[280px] sm:min-h-[340px]" />
          </BrowserFrame>

          {/* Floating stat chips. Sit in the gutter beside the frame — only xl+ has the
              room, and anything narrower would cover the mockup's own content. */}
          <div className="absolute -left-24 top-[24%] hidden rounded-xl border border-mkt-line bg-white px-3.5 py-2.5 shadow-[0_12px_30px_-12px_rgba(11,11,16,0.3)] xl:block">
            <div className="text-[11px] font-medium text-mkt-muted">Design + dev</div>
            <div className="text-[13px] font-semibold text-mkt-ink">One team</div>
          </div>
          <div className="absolute -right-24 bottom-[22%] hidden rounded-xl border border-mkt-line bg-white px-3.5 py-2.5 shadow-[0_12px_30px_-12px_rgba(11,11,16,0.3)] xl:block">
            <div className="text-[11px] font-medium text-mkt-muted">Typical MVP</div>
            <div className="text-[13px] font-semibold text-mkt-ink">4–8 weeks</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
