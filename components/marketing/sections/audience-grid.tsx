import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Reveal, RevealGroup, RevealItem } from '@/components/marketing/reveal';
import { Squiggle } from '@/components/marketing/mockups/doodles';
import { AUDIENCES } from '@/lib/marketing/home-content';
import { cn } from '@/lib/utils';

const TONE: Record<'mint' | 'butter' | 'sky', string> = {
  mint: 'bg-mkt-mint',
  butter: 'bg-mkt-butter',
  sky: 'bg-mkt-sky',
};

/** Simple layered illustration per card — differs by tone so the three read as a set. */
function AudienceArt({ tone }: { tone: 'mint' | 'butter' | 'sky' }) {
  return (
    <div
      className={cn('relative flex h-32 items-end justify-center overflow-hidden rounded-2xl', TONE[tone])}
      aria-hidden
    >
      <Squiggle className="absolute left-4 top-4 h-4 w-20 text-mkt-ink/20" />
      {tone === 'mint' ? (
        <div className="mb-0 flex w-full max-w-[180px] flex-col gap-1.5 rounded-t-xl bg-mkt-surface p-3 shadow-sm text-mkt-ink">
          <div className="h-1.5 w-16 rounded-full bg-mkt-ink/20" />
          <div className="h-1.5 w-24 rounded-full bg-mkt-ink/10" />
          <div className="mt-1 h-6 w-full rounded-md bg-mkt-violet/85" />
        </div>
      ) : null}
      {tone === 'butter' ? (
        <div className="mb-0 flex w-full max-w-[190px] items-end gap-1.5 rounded-t-xl bg-mkt-surface p-3 shadow-sm text-mkt-ink">
          {[40, 62, 48, 80, 96].map((h, i) => (
            <div
              key={i}
              className={cn('flex-1 rounded-sm', i === 4 ? 'bg-mkt-violet' : 'bg-mkt-ink/15')}
              style={{ height: `${h * 0.4}px` }}
            />
          ))}
        </div>
      ) : null}
      {tone === 'sky' ? (
        <div className="mb-0 flex w-full max-w-[180px] flex-col gap-1.5 rounded-t-xl bg-mkt-surface p-3 shadow-sm text-mkt-ink">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={cn(
                  'h-4 w-4 shrink-0 rounded-full',
                  i === 0 ? 'bg-mkt-violet' : i === 1 ? 'bg-mkt-mint' : 'bg-mkt-butter'
                )}
              />
              <div className="h-1.5 flex-1 rounded-full bg-mkt-ink/10" />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function AudienceGrid() {
  return (
    <section className="bg-mkt-cream py-20 lg:py-28 text-mkt-ink">
      <div className="mkt-shell">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="mkt-eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-mkt-violet" />
            Who we work with
          </span>
          <h2 className="mkt-display mt-6 text-[32px] leading-[1.1] sm:text-[44px]">
            Built for the people doing the building
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-mkt-muted">
            Whether you have a napkin sketch or a roadmap and no bandwidth, we meet you where
            you are.
          </p>
        </Reveal>

        <RevealGroup as="ul" className="mt-12 grid gap-5 md:grid-cols-3">
          {AUDIENCES.map((item) => (
            <RevealItem
              key={item.title}
              as="li"
              className="flex flex-col rounded-3xl border border-mkt-line bg-mkt-surface p-5 text-mkt-ink"
            >
              <AudienceArt tone={item.tone} />
              <h3 className="mkt-display mt-6 text-[21px]">{item.title}</h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-mkt-muted">{item.body}</p>
              <Link
                href={item.cta.href}
                className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-medium text-mkt-violet hover:underline"
              >
                {item.cta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
