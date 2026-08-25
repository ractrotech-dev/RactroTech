import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';

import { Reveal, RevealGroup, RevealItem } from '@/components/marketing/reveal';
import { PageHero } from '@/components/marketing/sections/page-hero';
import { FinalCta } from '@/components/marketing/sections/final-cta';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { ServicePageData } from '@/lib/marketing/service-pages';
import { getServiceBySlug } from '@/lib/marketing/service-pages';

/**
 * Body for the six service landing pages. Renders whatever SERVICE_PAGES holds, so the
 * copy stays in lib/marketing/service-pages.ts and the FAQ accordion keeps matching the
 * FAQPage JSON-LD emitted alongside it.
 */
export function ServiceDetail({ service }: { service: ServicePageData }) {
  const related = service.relatedSlugs
    .map((slug) => getServiceBySlug(slug))
    .filter((s): s is ServicePageData => Boolean(s));

  return (
    <>
      <PageHero
        eyebrow="Ractrotech services"
        title={service.h1}
        description={service.heroDescription}
        primaryCta={{ label: 'Get a free estimate', href: '/start-project' }}
        secondaryCta={{ label: 'Browse templates', href: '/templates' }}
      />

      <section className="bg-mkt-lavender py-20 lg:py-24 text-mkt-ink">
        <div className="mkt-shell">
          <RevealGroup className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
            {service.sections.map((section) => (
              <RevealItem
                key={section.title}
                className="rounded-3xl border border-mkt-line bg-mkt-surface p-6 sm:p-8 text-mkt-ink"
              >
                <h2 className="mkt-display text-[21px] sm:text-[24px]">{section.title}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-mkt-muted">{section.body}</p>
                {section.bullets ? (
                  <ul className="mt-5 space-y-2.5">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2.5 text-[15px] text-mkt-ink">
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-mkt-violet"
                          strokeWidth={2.5}
                          aria-hidden
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="mkt-shell max-w-3xl">
          <Reveal className="text-center">
            <span className="mkt-eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-mkt-violet" />
              FAQ
            </span>
            <h2 className="mkt-display mt-6 text-[30px] leading-[1.1] sm:text-[40px]">
              {service.name} questions
            </h2>
          </Reveal>

          <Reveal className="mt-10" delay={0.1}>
            <Accordion type="single" collapsible className="w-full">
              {service.faqs.map((faq, i) => (
                <AccordionItem
                  key={faq.question}
                  value={`faq-${i}`}
                  className="border-b border-mkt-line"
                >
                  <AccordionTrigger className="py-5 text-left text-[17px] font-medium text-mkt-ink hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-[15px] leading-relaxed text-mkt-muted">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="bg-mkt-cream py-20 lg:py-24 text-mkt-ink">
          <div className="mkt-shell">
            <Reveal className="text-center">
              <h2 className="mkt-display text-[28px] leading-[1.1] sm:text-[36px]">
                Related services
              </h2>
            </Reveal>

            <RevealGroup as="ul" className="mt-10 grid gap-4 md:grid-cols-3">
              {related.map((rel) => (
                <RevealItem key={rel.slug} as="li" className="h-full">
                  <Link
                    href={`/${rel.slug}`}
                    className="group flex h-full flex-col rounded-3xl border border-mkt-line bg-mkt-surface p-6 transition-shadow duration-200 hover:shadow-[0_18px_44px_-26px_rgba(11,11,16,0.4)] text-mkt-ink"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="mkt-display text-[19px]">{rel.name}</h3>
                      <ArrowUpRight
                        className="h-5 w-5 shrink-0 text-mkt-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </div>
                    <p className="mt-3 flex-1 text-[15px] leading-relaxed text-mkt-muted">
                      {rel.heroDescription}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-medium text-mkt-violet group-hover:underline">
                      Learn more
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      ) : null}

      <FinalCta />
    </>
  );
}
