import { FadeInView } from '@/components/fade-in-view';
import { HOMEPAGE_FAQS } from '@/lib/marketing/service-pages';

export function RetroFAQ() {
  return (
    <section id="faq" className="border-b-4 border-black bg-white py-16 md:py-20">
      <FadeInView>
        <div className="mx-auto max-w-3xl px-4 font-sans">
          <p className="mb-3 text-center text-sm font-black tracking-[0.3em] text-black/60">
            FAQ
          </p>
          <h2 className="retro-heading mb-8 text-center text-4xl md:text-5xl">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {HOMEPAGE_FAQS.map((faq) => (
              <details
                key={faq.question}
                className="retro-card border-4 border-black bg-yellow-50 p-6 open:bg-white open:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <summary className="cursor-pointer font-black">{faq.question}</summary>
                <p className="mt-4 font-semibold leading-relaxed text-black/80">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </FadeInView>
    </section>
  );
}
