import { PageHero } from '@/components/marketing/sections/page-hero';
import { TemplatesGrid } from '@/components/marketing/sections/templates-grid';
import { FinalCta } from '@/components/marketing/sections/final-cta';
import { constructMetadata, generateBreadcrumbSchema, siteConfig } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'SaaS & Web Templates',
  description:
    'Browse Ractrotech templates for SaaS apps, landing pages, dashboards, e-commerce, and reusable UI components.',
  canonicalUrl: `${siteConfig.url}/templates`,
});

export default function TemplatesPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Templates', item: '/templates' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageHero
        eyebrow="Templates"
        title="Launch faster with"
        titleAccent="ready-made starters"
        description="Production-ready templates and UI kits that save you months of setup without sacrificing quality."
        primaryCta={{ label: 'Browse components', href: '/components' }}
        secondaryCta={{ label: 'Request a custom build', href: '/start-project' }}
      />
      <TemplatesGrid />
      <FinalCta />
    </>
  );
}
