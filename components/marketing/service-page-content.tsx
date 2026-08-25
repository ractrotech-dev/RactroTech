import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { FadeInView } from '@/components/fade-in-view';
import { RetroCTA } from '@/components/retro-cta';
import type { ServicePageData } from '@/lib/marketing/service-pages';
import { getServiceBySlug } from '@/lib/marketing/service-pages';

type Props = {
  service: ServicePageData;
};

export function ServicePageContent({ service }: Props) {
  const related = service.relatedSlugs
    .map((slug) => getServiceBySlug(slug))
    .filter((s): s is ServicePageData => Boolean(s));

  return (
    <>
      <section className="border-b-4 border-black bg-yellow-400 py-16 md:py-20">
        <FadeInView>
          <div className="mx-auto max-w-7xl px-4">
            <p className="mb-3 text-center text-sm font-black tracking-[0.3em] text-black/60">
              RACTROTECH SERVICES
            </p>
            <h1 className="retro-heading mx-auto mb-4 max-w-4xl text-center text-3xl md:text-5xl">
              {service.h1}
            </h1>
            <p className="mx-auto max-w-2xl text-center text-lg font-semibold">
              {service.heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/start-project"
                className="retro-button border-black bg-black text-yellow-400 hover:bg-black/90"
              >
                Get a Free Estimate
              </Link>
              <Link href="/templates" className="retro-button">
                Browse Templates
              </Link>
            </div>
          </div>
        </FadeInView>
      </section>

      {service.sections.map((section) => (
        <section key={section.title} className="border-b-4 border-black bg-white py-16">
          <FadeInView>
            <div className="mx-auto max-w-3xl px-4">
              <h2 className="retro-heading mb-4 text-3xl">{section.title}</h2>
              <p className="mb-6 font-semibold leading-relaxed text-black/90">{section.body}</p>
              {section.bullets ? (
                <ul className="space-y-3">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-3 border-l-4 border-yellow-400 pl-4 font-semibold"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </FadeInView>
        </section>
      ))}

      <section className="border-b-4 border-black bg-yellow-400 py-16">
        <FadeInView>
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="retro-heading mb-8 text-center text-3xl">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {service.faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="retro-card border-4 border-black bg-white p-6 open:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  <summary className="cursor-pointer font-black">{faq.question}</summary>
                  <p className="mt-4 font-semibold leading-relaxed text-black/80">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </FadeInView>
      </section>

      {related.length > 0 ? (
        <section className="border-b-4 border-black bg-white py-16">
          <FadeInView>
            <div className="mx-auto max-w-7xl px-4">
              <h2 className="retro-heading mb-8 text-center text-3xl">Related Services</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {related.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/${rel.slug}`}
                    className="retro-card group flex flex-col p-6 transition-transform hover:-translate-y-1"
                  >
                    <h3 className="retro-heading mb-2 text-xl">{rel.name}</h3>
                    <p className="mb-4 flex-1 text-sm font-semibold text-black/70">
                      {rel.heroDescription}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-black group-hover:underline">
                      Learn more <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </FadeInView>
        </section>
      ) : null}

      <RetroCTA />
    </>
  );
}
