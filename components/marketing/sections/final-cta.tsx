import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Reveal } from '@/components/marketing/reveal';
import { Circle } from '@/components/marketing/mockups/doodles';
import { FINAL_CTA } from '@/lib/marketing/home-content';

export function FinalCta() {
  return (
    <section id="contact" className="relative overflow-hidden bg-mkt-ink py-24 text-white lg:py-32">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(55% 70% at 50% 100%, rgba(91,61,245,0.3) 0%, rgba(91,61,245,0.06) 50%, rgba(11,11,16,0) 78%)',
        }}
      />

      <div className="mkt-shell relative text-center">
        <Reveal>
          <h2 className="font-display text-[42px] font-black uppercase leading-[0.95] tracking-[-0.02em] sm:text-[68px] lg:text-[86px]">
            {FINAL_CTA.headline}
            <br />
            <span className="relative inline-block">
              {FINAL_CTA.headlineAccent}
              <Circle
                className="absolute -inset-x-6 -inset-y-3 h-[calc(100%+1.5rem)] w-[calc(100%+3rem)] text-mkt-violet-soft/70"
                aria-hidden
              />
            </span>
          </h2>

          <p className="mx-auto mt-8 max-w-xl text-[17px] leading-relaxed text-white/55">
            {FINAL_CTA.body}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={FINAL_CTA.primaryCta.href}
              className="mkt-btn w-full bg-white px-7 py-3.5 text-mkt-ink hover:bg-white/90 sm:w-auto"
            >
              {FINAL_CTA.primaryCta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href={FINAL_CTA.secondaryCta.href} className="mkt-btn-onDark w-full sm:w-auto">
              {FINAL_CTA.secondaryCta.label}
            </Link>
          </div>

          <p className="mt-8 text-[13px] text-white/35">{FINAL_CTA.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
