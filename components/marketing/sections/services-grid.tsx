import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

import { Reveal, RevealGroup, RevealItem } from '@/components/marketing/reveal';
import { SERVICE_PAGES } from '@/lib/marketing/service-pages';

/**
 * Services listing for /services. The six entries with dedicated landing pages come from
 * SERVICE_PAGES; the remaining offerings are listed as a secondary group so the page
 * covers everything without implying a landing page that does not exist.
 */

/** Offerings without their own page — kept in sync with the homepage bento's copy. */
const ADDITIONAL = [
  { name: 'Mobile apps', body: 'iOS, Android and cross-platform apps that feel fast and native.' },
  { name: 'E-commerce', body: 'Stores with smooth checkout, inventory and payments that just work.' },
  { name: 'AI integration', body: 'Chatbots, automation and AI features that save your team time.' },
  { name: 'Cloud & DevOps', body: 'Hosting, scaling and monitoring so your product stays online.' },
  { name: 'Templates & UI kits', body: 'Production-ready starters so you skip months of setup.' },
  { name: 'Consulting', body: 'Honest technical advice when you need a plan before you build.' },
];

export function ServicesGrid() {
  return (
    <>
      <section className="bg-mkt-lavender py-20 lg:py-24">
        <div className="mkt-shell">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="mkt-eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-mkt-violet" />
              Core services
            </span>
            <h2 className="mkt-display mt-6 text-[32px] leading-[1.1] sm:text-[42px]">
              What we build for clients
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-mkt-muted">
              From a simple business website to a full SaaS platform — design, development,
              launch and support. Tell us your goal and we will recommend the right approach,
              timeline and budget.
            </p>
          </Reveal>

          <RevealGroup as="ul" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICE_PAGES.map((service) => (
              <RevealItem key={service.slug} as="li" className="h-full">
                <Link
                  href={`/${service.slug}`}
                  className="group flex h-full flex-col rounded-3xl border border-mkt-line bg-white p-6 transition-shadow duration-200 hover:shadow-[0_18px_44px_-26px_rgba(11,11,16,0.4)] sm:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="mkt-display text-[19px] sm:text-[21px]">{service.name}</h3>
                    <ArrowUpRight
                      className="h-5 w-5 shrink-0 text-mkt-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </div>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-mkt-muted">
                    {service.heroDescription}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-medium text-mkt-violet group-hover:underline">
                    View service
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-24">
        <div className="mkt-shell">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="mkt-display text-[28px] leading-[1.1] sm:text-[36px]">
              Also under one roof
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-mkt-muted">
              Not every service needs its own page. Ask us about any of these and we will scope
              it the same way.
            </p>
          </Reveal>

          <RevealGroup as="ul" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ADDITIONAL.map((item) => (
              <RevealItem
                key={item.name}
                as="li"
                className="rounded-2xl border border-mkt-line bg-white p-5"
              >
                <h3 className="text-[16px] font-semibold text-mkt-ink">{item.name}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-mkt-muted">{item.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-12 text-center">
            <Link href="/start-project" className="mkt-btn-primary">
              Tell us what you need
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
