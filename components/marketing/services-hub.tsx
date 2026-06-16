import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { FadeInView } from '@/components/fade-in-view';
import { RetroCTA } from '@/components/retro-cta';
import { SERVICE_PAGES } from '@/lib/marketing/service-pages';

export function ServicesHub() {
  return (
    <>
      <section className="border-b-4 border-black bg-white py-16">
        <FadeInView>
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="retro-heading mb-4 text-3xl">What We Build For Clients</h2>
            <p className="font-semibold leading-relaxed text-black/90">
              From a simple business website to a full SaaS platform — Ractrotech covers design,
              development, launch, and support. Tell us your goal and we will recommend the right
              approach, timeline, and budget.
            </p>
          </div>
        </FadeInView>
      </section>

      <section className="border-b-4 border-black bg-yellow-400 py-16">
        <FadeInView>
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="retro-heading mb-8 text-center text-3xl">Explore Our Services</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {SERVICE_PAGES.map((service) => (
                <Link
                  key={service.slug}
                  href={`/${service.slug}`}
                  className="retro-card group flex flex-col border-4 border-black bg-white p-6 transition-transform hover:-translate-y-1"
                >
                  <h3 className="retro-heading mb-3 text-2xl">{service.name}</h3>
                  <p className="mb-4 flex-1 font-semibold text-black/80">{service.heroDescription}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-black group-hover:underline">
                    View service <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </FadeInView>
      </section>

      <RetroCTA />
    </>
  );
}
