import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

import { Reveal, RevealGroup, RevealItem } from '@/components/marketing/reveal';
import {
  ChatPanelMock,
  CheckoutPanelMock,
  CodePanelMock,
  DesignPanelMock,
  StatusPanelMock,
} from '@/components/marketing/mockups/panel-mocks';
import { CAPABILITIES, type Capability } from '@/lib/marketing/home-content';
import { cn } from '@/lib/utils';

function Panel({ panel }: { panel: Capability['panel'] }) {
  switch (panel) {
    case 'chat':
      return <ChatPanelMock />;
    case 'design':
      return <DesignPanelMock />;
    case 'status':
      return <StatusPanelMock />;
    case 'checkout':
      return <CheckoutPanelMock />;
    case 'code':
      return <CodePanelMock />;
    default:
      return null;
  }
}

function Card({ item }: { item: Capability }) {
  const violet = item.tone === 'violet';

  return (
    <RevealItem
      as="li"
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-3xl border p-6 transition-shadow duration-200 sm:p-7',
        item.size === 'feature' && 'sm:col-span-2',
        violet
          ? 'border-transparent bg-mkt-violet text-white shadow-[0_20px_50px_-24px_rgba(91,61,245,0.9)]'
          : 'border-mkt-line bg-white hover:shadow-[0_18px_44px_-26px_rgba(11,11,16,0.4)]'
      )}
    >
      <Link href={item.href} className="flex h-full flex-col focus-visible:outline-none">
        {/* Whole-card hit area; the visible focus ring lives on the parent. */}
        <span className="absolute inset-0 rounded-3xl ring-mkt-violet ring-offset-2 group-focus-within:ring-2" />

        <div className="relative flex items-start justify-between gap-4">
          <h3
            className={cn(
              'font-display text-[19px] font-semibold tracking-[-0.02em] sm:text-[21px]',
              violet ? 'text-white' : 'text-mkt-ink'
            )}
          >
            {item.name}
          </h3>
          <ArrowUpRight
            className={cn(
              'h-5 w-5 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5',
              violet ? 'text-white/70' : 'text-mkt-muted'
            )}
            aria-hidden
          />
        </div>

        <p
          className={cn(
            'relative mt-3 text-[15px] leading-relaxed',
            violet ? 'text-white/75' : 'text-mkt-muted'
          )}
        >
          {item.description}
        </p>

        {item.panel ? (
          <div className="relative mt-6 flex-1">
            <Panel panel={item.panel} />
          </div>
        ) : null}
      </Link>
    </RevealItem>
  );
}

export function CapabilityBento() {
  return (
    <section className="bg-mkt-lavender py-20 lg:py-28">
      <div className="mkt-shell">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="mkt-eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-mkt-violet" />
            What we build
          </span>
          <h2 className="mkt-display mt-6 text-[32px] leading-[1.1] sm:text-[44px]">
            One team for the whole product
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-mkt-muted">
            Design, engineering, payments and infrastructure under one roof — so what gets
            designed is what actually gets built.
          </p>
        </Reveal>

        {/* Dense flow lets the single-column tiles backfill the gap the two-column
            feature cards would otherwise leave mid-grid. */}
        <RevealGroup
          as="ul"
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:grid-flow-row-dense"
        >
          {CAPABILITIES.map((item) => (
            <Card key={item.href + item.name} item={item} />
          ))}

          <RevealItem
            as="li"
            className="flex flex-col justify-between rounded-3xl border border-dashed border-mkt-ink/15 bg-transparent p-6 sm:p-7"
          >
            <div>
              <h3 className="mkt-display text-[19px] sm:text-[21px]">Plus five more</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-mkt-muted">
                Mobile apps, e-commerce, AI integration, cloud &amp; DevOps, templates and
                consulting.
              </p>
            </div>
            <Link
              href="/services"
              className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-medium text-mkt-violet hover:underline"
            >
              View all services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
