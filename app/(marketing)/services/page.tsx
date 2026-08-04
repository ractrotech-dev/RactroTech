import { PageHero } from '@/components/marketing/sections/page-hero';
import { ServicesGrid } from '@/components/marketing/sections/services-grid';
import { FinalCta } from '@/components/marketing/sections/final-cta';
import { constructMetadata, generateBreadcrumbSchema, sitePath } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Web, App & SaaS Development Services',
  description:
    'Websites, web apps, SaaS, e-commerce, mobile apps, UI/UX, AI integration, and consulting. Explore Ractrotech services and get a free project estimate.',
  canonicalUrl: sitePath('/services'),
});

export default function ServicesPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Services', item: '/services' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageHero
        eyebrow="Services"
        title="What we build"
        titleAccent="for you"
        description="Websites, apps, SaaS, stores, design, and more — tell us your goal and we will find the right way to get you there."
        primaryCta={{ label: 'Tell us your idea', href: '/start-project' }}
        secondaryCta={{ label: 'See how we work', href: '/about' }}
      />
      <ServicesGrid />
      <FinalCta />
    </>
  );
}
