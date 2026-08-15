import { Headphones, Trophy, Users, Zap } from 'lucide-react';

import { Reveal, RevealGroup, RevealItem } from '@/components/marketing/reveal';
import { PROCESS } from '@/lib/marketing/home-content';

/** Reasons carried over from components/retro-why-us.tsx. */
const REASONS = [
  {
    icon: Users,
    title: 'You talk to builders',
    body: 'No sales middlemen. You work directly with the developers designing and shipping your product.',
  },
  {
    icon: Trophy,
    title: 'Clear scope & pricing',
    body: 'We explain what you get, what it costs, and how long it takes — before we start.',
  },
  {
    icon: Zap,
    title: 'Design + dev together',
    body: 'UI/UX and engineering under one roof, so what gets designed is what actually gets built.',
  },
  {
    icon: Headphones,
    title: 'We reply fast',
    body: 'Questions answered within one business day. You are never left wondering what is happening.',
  },
];

export function AboutStory() {
  return (
    <>
      <section className="py-20 lg:py-24">
        <div className="mkt-shell">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <span className="mkt-eyebrow">
                <span className="h-1.5 w-1.5 rounded-full bg-mkt-violet" />
                Since 2026
              </span>
              <h2 className="mkt-display mt-6 text-[30px] leading-[1.1] sm:text-[40px]">
                A developer-led team that builds real products
              </h2>
              <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-mkt-muted">
                <p>
                  We build websites, web apps, SaaS platforms, stores, and internal tools — for
                  people who are tired of agencies that overpromise and underdeliver.
                </p>
                <p>
                  Whether you&apos;re a founder with a napkin sketch, a business upgrading your
                  online presence, or a team that needs extra engineering firepower — we meet you
                  where you are and help you ship something that works.
                </p>
                <p>
                  Straight talk. Fair timelines. Modern technology. And a product you&apos;re proud
                  to put in front of customers.
                </p>
              </div>
            </Reveal>

            <RevealGroup className="space-y-4">
              {PROCESS.steps.map((step, i) => (
                <RevealItem
                  key={step.title}
                  className="flex gap-5 rounded-3xl border border-mkt-line bg-mkt-surface p-6"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mkt-lavender text-[14px] font-semibold tabular-nums text-mkt-violet">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="mkt-display text-[19px]">{step.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-mkt-muted">{step.body}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      <section className="bg-mkt-cream py-20 lg:py-24">
        <div className="mkt-shell">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="mkt-eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-mkt-violet" />
              The difference
            </span>
            <h2 className="mkt-display mt-6 text-[32px] leading-[1.1] sm:text-[42px]">
              Why teams choose Ractrotech
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-mkt-muted">
              Hiring a dev team is stressful. Here is what our clients tell us they value most.
            </p>
          </Reveal>

          <RevealGroup as="ul" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {REASONS.map((reason) => {
              const Icon = reason.icon;
              return (
                <RevealItem
                  key={reason.title}
                  as="li"
                  className="rounded-3xl border border-mkt-line bg-mkt-surface p-6"
                >
                  <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-mkt-lavender text-mkt-violet">
                    <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                  </span>
                  <h3 className="mkt-display text-[18px]">{reason.title}</h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-mkt-muted">{reason.body}</p>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
