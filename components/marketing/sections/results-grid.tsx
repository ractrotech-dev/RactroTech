import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { Reveal, RevealGroup, RevealItem } from '@/components/marketing/reveal';
import { PROJECT_TYPES, RESULTS, type ResultCard } from '@/lib/marketing/home-content';
import { cn } from '@/lib/utils';

const TONE: Record<ResultCard['tone'], string> = {
  mint: 'bg-mkt-mint',
  pink: 'bg-mkt-pink',
  butter: 'bg-mkt-butter',
  lilac: 'bg-mkt-lilac',
  sky: 'bg-mkt-sky',
};

/**
 * Deliberately states commitments, not customer metrics. Every figure traces back to
 * something already published on a service page — see the `source` field on each entry
 * in lib/marketing/home-content.ts. Do not add unverifiable numbers here.
 */
export function ResultsGrid() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mkt-shell">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="mkt-eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-mkt-violet" />
            What you can count on
          </span>
          <h2 className="mkt-display mt-6 text-[32px] leading-[1.1] sm:text-[44px]">
            Clear commitments, not vague promises
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-mkt-muted">
            Hiring a dev team is stressful. Here is exactly what we hold ourselves to on every
            project.
          </p>
        </Reveal>

        <RevealGroup as="ul" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RESULTS.map((card, i) => (
            <RevealItem
              key={card.label}
              as="li"
              className={cn(
                'rounded-3xl p-6 sm:p-7',
                TONE[card.tone],
                // First card spans wide on desktop so the grid reads as a masonry.
                i === 0 && 'lg:col-span-2'
              )}
            >
              <div className="mkt-display text-[40px] leading-none sm:text-[52px]">{card.stat}</div>
              <div className="mt-3 text-[15px] font-semibold text-mkt-ink">{card.label}</div>
              <p className="mt-2 max-w-md text-[15px] leading-relaxed text-mkt-ink/65">
                {card.body}
              </p>
            </RevealItem>
          ))}

          {PROJECT_TYPES.map((project) => (
            <RevealItem
              key={project.href}
              as="li"
              className="group flex flex-col rounded-3xl bg-mkt-ink p-6 text-white sm:p-7"
            >
              <Link href={project.href} className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-[19px] font-semibold tracking-[-0.02em] sm:text-[21px]">
                    {project.title}
                  </h3>
                  <ArrowUpRight
                    className="h-5 w-5 shrink-0 text-white/50 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </div>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-white/55">
                  {project.body}
                </p>
                <span className="mt-5 text-[14px] font-medium text-white/80 group-hover:underline">
                  See how we build it
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
