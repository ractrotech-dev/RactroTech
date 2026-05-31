import { MarketingPageHeader } from '@/components/marketing-page-header';
import { RetroTemplates } from '@/components/retro-templates';
import { RetroCTA } from '@/components/retro-cta';
import { constructMetadata, generateBreadcrumbSchema, siteConfig } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'SaaS & Web Templates',
  description:
    'Browse RactroTech templates for SaaS apps, landing pages, dashboards, e-commerce, and reusable UI components.',
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
      <MarketingPageHeader
        title="Templates"
        description="Production-ready starters and UI kits to launch faster without sacrificing quality."
      />
      <RetroTemplates />
      <RetroCTA />
    </>
  );
}
