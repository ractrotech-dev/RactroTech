import { RetroHeader } from '@/components/retro-header';
import { RetroHero } from '@/components/retro-hero';
import { RetroServices } from '@/components/retro-services';
import { RetroAbout } from '@/components/retro-about';
import { RetroWhyUs } from '@/components/retro-why-us';
import { RetroPortfolio } from '@/components/retro-portfolio';
import RetroTestimonials from '@/components/retro-testimonials';
import { RetroFAQ } from '@/components/retro-faq';
import { RetroCTA } from '@/components/retro-cta';
import { RetroFooter } from '@/components/retro-footer';
import { constructMetadata, generateFAQSchema, sitePath } from '@/lib/seo';
import { HOMEPAGE_FAQS } from '@/lib/marketing/service-pages';

export const metadata = constructMetadata({
  title: 'Custom Web, App & SaaS Development Company',
  description:
    'Ractrotech builds websites, web apps, SaaS, e-commerce, mobile apps, and UI/UX for founders and businesses. Tell us your idea — get a free estimate within 24 hours.',
  canonicalUrl: sitePath('/'),
});

/** Testimonials refetch after admin approval via `revalidatePath('/')`. */
export const revalidate = 120;

export default function Home() {
  const faqSchema = generateFAQSchema(HOMEPAGE_FAQS);

  return (
    <main className="min-h-screen bg-white text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <RetroHeader />
      <RetroHero />
      <RetroServices />
      <RetroAbout />
      <RetroWhyUs />
      <RetroPortfolio />
      <RetroTestimonials />
      <RetroFAQ />
      <RetroCTA />
      <RetroFooter />
    </main>
  );
}
