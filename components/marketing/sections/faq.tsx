import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Reveal } from '@/components/marketing/reveal';
import { HOMEPAGE_FAQS } from '@/lib/marketing/service-pages';

/**
 * Must stay on the page: app/page.tsx emits FAQPage JSON-LD from this same
 * HOMEPAGE_FAQS array, and Google requires the schema's Q&A to be visible content.
 */
export function Faq() {
  return (
    <section id="faq" className="py-20 lg:py-28">
      <div className="mkt-shell max-w-3xl">
        <Reveal className="text-center">
          <span className="mkt-eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-mkt-violet" />
            FAQ
          </span>
          <h2 className="mkt-display mt-6 text-[32px] leading-[1.1] sm:text-[44px]">
            Questions, answered
          </h2>
        </Reveal>

        {/* On its own surface rather than naked on the canvas: question rows are set in
            near-black ink, which does not clear contrast on the violet. Giving the list a
            card also matches how the rest of the page puts content on a surface. */}
        <Reveal className="mkt-card mt-10 px-6 py-2 sm:px-8" delay={0.1}>
          <Accordion type="single" collapsible className="w-full">
            {HOMEPAGE_FAQS.map((faq, i) => (
              <AccordionItem
                key={faq.question}
                value={`faq-${i}`}
                className="border-b border-mkt-line last:border-b-0"
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
  );
}
