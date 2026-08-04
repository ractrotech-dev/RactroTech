import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Reveal, RevealGroup, RevealItem } from '@/components/marketing/reveal';
import { BrowserFrame } from '@/components/marketing/mockups/browser-frame';
import { KanbanMock } from '@/components/marketing/mockups/kanban-mock';
import { PROCESS } from '@/lib/marketing/home-content';

export function ProcessShowcase() {
  return (
    <section className="relative overflow-hidden bg-mkt-ink py-20 text-white lg:py-28">
      {/* Soft violet bloom behind the board */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
        aria-hidden
        style={{
          background:
            'radial-gradient(50% 60% at 50% 0%, rgba(91,61,245,0.28) 0%, rgba(91,61,245,0.05) 55%, rgba(11,11,16,0) 80%)',
        }}
      />

      <div className="mkt-shell relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[13px] font-medium text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-mkt-violet-soft" />
            {PROCESS.eyebrow}
          </span>
          <h2 className="mt-6 font-display text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[44px]">
            {PROCESS.headline}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-white/55">
            {PROCESS.subhead}
          </p>
        </Reveal>

        <Reveal className="mx-auto mt-12 max-w-4xl" delay={0.1} y={26}>
          <BrowserFrame tone="dark" url="app.ractrotech.com/board">
            <KanbanMock />
          </BrowserFrame>
        </Reveal>

        <Reveal className="mt-10 flex flex-wrap justify-center gap-2.5" delay={0.15}>
          {PROCESS.pills.map((pill) => (
            <span
              key={pill}
              className="rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-[14px] text-white/70"
            >
              {pill}
            </span>
          ))}
        </Reveal>

        <RevealGroup className="mt-16 grid gap-8 sm:grid-cols-3">
          {PROCESS.steps.map((step, i) => (
            <RevealItem key={step.title}>
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[14px] font-semibold tabular-nums text-white/80">
                {i + 1}
              </div>
              <h3 className="font-display text-[19px] font-semibold tracking-[-0.02em]">
                {step.title}
              </h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-white/55">{step.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-14 text-center">
          <Link
            href="/start-project"
            className="mkt-btn-onDark"
          >
            Scope your project
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
