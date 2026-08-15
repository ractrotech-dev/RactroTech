import { PageHero } from '@/components/marketing/sections/page-hero';
import { ContactChannels } from '@/components/marketing/sections/contact-channels';
import { FinalCta } from '@/components/marketing/sections/final-cta';
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
      <PageHero
        eyebrow="Contact"
        title="Tell us what"
        titleAccent="you're building"
        description="We will help you scope it, estimate it, and ship it. Every enquiry gets a reply within one business day."
        primaryCta={{ label: 'Start a project', href: '/start-project' }}
      />
      <ContactChannels />
      <FinalCta />
    </>
  );
}
