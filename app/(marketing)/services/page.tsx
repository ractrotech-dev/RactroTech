import { MarketingPageHeader } from '@/components/marketing-page-header';
import { RetroServices } from '@/components/retro-services';
import { RetroCTA } from '@/components/retro-cta';
import { constructMetadata, generateBreadcrumbSchema, siteConfig } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Web Development Services',
  description:
    'Custom web development, SaaS builds, mobile apps, AI integration, e-commerce, and cloud solutions from Ractrotech.',
  canonicalUrl: `${siteConfig.url}/services`,
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
        title="Our Services"
        description="End-to-end digital solutions — from strategy and design to development, launch, and support."
      />
      <RetroServices />
      <RetroCTA />
    </>
  );
}
