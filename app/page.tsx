import { SiteHeader } from '@/components/marketing/site-header';
import { SiteFooter } from '@/components/marketing/site-footer';
import { Hero } from '@/components/marketing/sections/hero';
import { LogoMarquee } from '@/components/marketing/sections/logo-marquee';
import { QuoteStrip } from '@/components/marketing/sections/quote-strip';
import { ProcessShowcase } from '@/components/marketing/sections/process-showcase';
import { CapabilityBento } from '@/components/marketing/sections/capability-bento';
import { JourneyBand } from '@/components/marketing/sections/journey-band';
import { AudienceGrid } from '@/components/marketing/sections/audience-grid';
import { ResultsGrid } from '@/components/marketing/sections/results-grid';
import { TestimonialWall } from '@/components/marketing/sections/testimonial-wall';
import { Faq } from '@/components/marketing/sections/faq';
import { FinalCta } from '@/components/marketing/sections/final-cta';
import type { MarketingReview } from '@/components/marketing/review-types';
import { constructMetadata, generateFAQSchema, sitePath } from '@/lib/seo';
import { HOMEPAGE_FAQS } from '@/lib/marketing/service-pages';
import { getGoogleBusinessReviewUrl } from '@/lib/google-review';
import { getApprovedReviews } from '@/lib/reviews/queries';

export const metadata = constructMetadata({
  title: 'Custom Web, App & SaaS Development Company',
  description:
    'Ractrotech builds websites, web apps, SaaS, e-commerce, mobile apps, and UI/UX for founders and businesses. Tell us your idea — get a free estimate within 24 hours.',
  canonicalUrl: sitePath('/'),
});

/** Testimonials refetch after admin approval via `revalidatePath('/')`. */
export const revalidate = 120;

async function loadReviews(): Promise<MarketingReview[]> {
  try {
    const rows = await getApprovedReviews(9);
    return rows.map((r) => ({
      id: r.id,
      text: r.review_text,
      author: r.full_name,
      company: r.company_name,
      rating: r.rating,
      imageUrl: r.image_url,
    }));
  } catch {
    // Table may not exist until migrations are applied.
    return [];
  }
}

export default async function Home() {
  const faqSchema = generateFAQSchema(HOMEPAGE_FAQS);
  const reviews = await loadReviews();
  const googleReviewUrl = getGoogleBusinessReviewUrl();

  // Longest review reads best as the standalone pull quote.
  const featured =
    reviews.length > 0
      ? reviews.reduce((best, r) => (r.text.length > best.text.length ? r : best), reviews[0])
      : null;
  const wallReviews = featured ? reviews.filter((r) => r.id !== featured.id) : reviews;

  return (
    <div className="flex min-h-screen flex-col bg-white text-mkt-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <LogoMarquee />
        <QuoteStrip review={featured} />
        <ProcessShowcase />
        <CapabilityBento />
        <JourneyBand />
        <AudienceGrid />
        <ResultsGrid />
        <TestimonialWall reviews={wallReviews} googleReviewUrl={googleReviewUrl} />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}
