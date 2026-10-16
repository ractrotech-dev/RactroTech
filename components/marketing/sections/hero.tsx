import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { HeroTilt } from '@/components/marketing/motion';
import { Reveal } from '@/components/marketing/reveal';
import { BrowserFrame } from '@/components/marketing/mockups/browser-frame';
import { DashboardMock } from '@/components/marketing/mockups/dashboard-mock';
import { CurvedArrow, HeroGlow, Rocket, Sparkle } from '@/components/marketing/mockups/doodles';
import { DrawnUnderline } from '@/components/marketing/mockups/drawn-doodles';
import { HERO } from '@/lib/marketing/home-content';

/* The page's one orchestrated load sequence, in seconds: the headline lands word by word,
   then the underline draws, then the copy and actions follow, then the product shot. */
const WORD_START = 0.1;
const WORD_STEP = 0.06;
const headWords = HERO.headline.split(' ');
const accentWords = HERO.headlineAccent.split(' ');
const wordsDone = WORD_START + WORD_STEP * (headWords.length + accentWords.length);

/** Server-rendered and pure CSS (`.mkt-word`), so the headline never waits on JavaScript. */
function Word({ children, index }: { children: string; index: number }) {
  return (
    <span className="mkt-word" style={{ animationDelay: `${WORD_START + index * WORD_STEP}s` }}>
      {children}
    </span>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-14 sm:pb-20 sm:pt-20 lg:pb-28">
      <HeroGlow />

      {/* Doodle accents — hidden on small screens where there is no room. */}
      <CurvedArrow className="absolute left-[6%] top-[18%] hidden h-16 w-20 -scale-x-100 text-mkt-violet/35 xl:block" />
      <Rocket className="mkt-float mkt-float-late absolute right-[7%] top-[14%] hidden h-16 w-16 rotate-12 text-mkt-ink/20 xl:block" />
      <Sparkle className="mkt-twinkle absolute left-[12%] top-[46%] hidden h-5 w-5 text-mkt-violet/40 lg:block" />
      <Sparkle className="mkt-twinkle mkt-twinkle-late absolute right-[13%] top-[38%] hidden h-4 w-4 text-mkt-violet/30 lg:block" />

      <div className="mkt-shell relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="mkt-eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-mkt-violet" />
              {HERO.eyebrow}
            </span>
          </Reveal>

          <h1 className="mkt-display mt-6 text-[40px] leading-[1.05] sm:text-[56px] lg:text-[68px]">
            {headWords.map((word, i) => (
              <span key={`h-${i}`}>
                <Word index={i}>{word}</Word>{' '}
              </span>
            ))}
            <span className="relative inline-block whitespace-nowrap">
              {accentWords.map((word, i) => (
                <span key={`a-${i}`}>
                  <Word index={headWords.length + i}>{word}</Word>
                  {i < accentWords.length - 1 ? ' ' : null}
                </span>
              ))}
              <DrawnUnderline
                delay={wordsDone + 0.1}
                className="absolute -bottom-1 left-0 h-3 w-full text-mkt-violet/60 sm:-bottom-2 sm:h-4"
              />
            </span>
          </h1>

          <Reveal delay={wordsDone - 0.15}>
            <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-white/75 sm:text-[18px]">
              {HERO.subhead}
            </p>
          </Reveal>

          <Reveal delay={wordsDone - 0.05} className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={HERO.primaryCta.href} className="mkt-btn-primary w-full sm:w-auto">
              {HERO.primaryCta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href={HERO.secondaryCta.href} className="mkt-btn-ghost w-full sm:w-auto">
              {HERO.secondaryCta.label}
            </Link>
          </Reveal>

          <Reveal delay={wordsDone + 0.05}>
            <p className="mt-5 text-[13px] text-white/70">{HERO.note}</p>
          </Reveal>
        </div>

        <Reveal className="relative mx-auto mt-14 max-w-5xl" delay={wordsDone}>
          <HeroTilt>
            <BrowserFrame>
              <DashboardMock animated className="min-h-[280px] sm:min-h-[340px]" />
            </BrowserFrame>
          </HeroTilt>

          {/* Floating stat chips. Sit in the gutter beside the frame — only xl+ has the
              room, and anything narrower would cover the mockup's own content. */}
          <div className="mkt-float absolute -left-24 top-[24%] hidden rounded-xl border border-mkt-line bg-mkt-surface px-3.5 py-2.5 shadow-[0_12px_30px_-12px_rgba(11,11,16,0.3)] xl:block text-mkt-ink">
            <div className="text-[11px] font-medium text-mkt-muted">Design + dev</div>
            <div className="text-[13px] font-semibold text-mkt-ink">One team</div>
          </div>
          <div className="mkt-float mkt-float-late absolute -right-24 bottom-[22%] hidden rounded-xl border border-mkt-line bg-mkt-surface px-3.5 py-2.5 shadow-[0_12px_30px_-12px_rgba(11,11,16,0.3)] xl:block text-mkt-ink">
            <div className="text-[11px] font-medium text-mkt-muted">Typical MVP</div>
            <div className="text-[13px] font-semibold text-mkt-ink">4–8 weeks</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
