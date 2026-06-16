import { MarketingPageHeader } from '@/components/marketing-page-header';
import { ServicesHub } from '@/components/marketing/services-hub';
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
      <MarketingPageHeader
        title="What We Build For You"
        description="Websites, apps, SaaS, stores, design, and more — tell us your goal and we will find the right way to get you there."
      />
      <ServicesHub />
    </>
  );
}
