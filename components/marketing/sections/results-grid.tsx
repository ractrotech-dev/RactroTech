import { CalendarClock, MessagesSquare, LayoutGrid, ReceiptText, Handshake } from 'lucide-react';

import { Reveal, RevealGroup, RevealItem } from '@/components/marketing/reveal';
import { StatCard } from '@/components/marketing/tone-card';
import { RESULTS, type ResultCard } from '@/lib/marketing/home-content';
import { cn } from '@/lib/utils';

const ICON: Record<ResultCard['icon'], typeof CalendarClock> = {
  timeline: CalendarClock,
  reply: MessagesSquare,
  services: LayoutGrid,
  quote: ReceiptText,
  direct: Handshake,
};

/**
 * Corner mark, standing in for the customer logo a card like this usually carries. Inked in
 * the card's own tone via --tone-ink, which ToneCard publishes.
 */
function CornerMark({ icon }: { icon: ResultCard['icon'] }) {
  const Icon = ICON[icon];
  return (
    <span
      className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgb(var(--tone-ink)/0.12)]"
      aria-hidden
    >
      <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
    </span>
  );
}

/**
 * Deliberately states commitments, not customer metrics. Every figure traces back to
 * something already published on a service page — see the `source` field on each entry
 * in lib/marketing/home-content.ts. Do not add unverifiable numbers here.
 *
 * Laid out as a mosaic rather than an even grid: the lead card runs double-width and sets
 * its figure larger, so the block reads as a wall of colour instead of a row of equal boxes.
 */
export function ResultsGrid() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mkt-shell">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="mkt-eyebrow-onDark">
            <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
            What you can count on
          </span>
          <h2 className="mkt-display mt-6 text-[32px] leading-[1.1] text-white sm:text-[44px]">
            Clear commitments, not vague promises
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-white/70">
            Hiring a dev team is stressful. Here is exactly what we hold ourselves to on every
            project.
          </p>
        </Reveal>

        <RevealGroup
          as="ul"
          className="mt-12 grid auto-rows-auto gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {RESULTS.map((card, i) => (
            <RevealItem key={card.label} as="li" className={cn(i === 0 && 'lg:col-span-2')}>
              <StatCard
                tone={card.tone}
                stat={card.stat}
                label={card.label}
                body={card.body}
                footer={<CornerMark icon={card.icon} />}
                className={cn('h-full', i === 0 && 'sm:p-8')}
                // The wide lead card carries the largest figure in the block.
                statClassName={cn(i === 0 && 'lg:text-[64px]')}
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
