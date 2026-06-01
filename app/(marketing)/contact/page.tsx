import { MarketingPageHeader } from '@/components/marketing-page-header';
import { RetroContact } from '@/components/retro-contact';
import { RetroCTA } from '@/components/retro-cta';
import { constructMetadata, generateBreadcrumbSchema, siteConfig } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Contact Ractrotech',
  description:
    'Get in touch with Ractrotech for project enquiries, partnerships, and support. We respond within one business day.',
  canonicalUrl: `${siteConfig.url}/contact`,
});

export default function ContactPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Contact', item: '/contact' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <MarketingPageHeader
        title="Contact Us"
        description="Tell us what you are building. We will help you scope it, estimate it, and ship it."
      />
      <RetroContact />
      <RetroCTA />
    </>
  );
}
