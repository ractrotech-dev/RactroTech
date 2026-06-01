import { MarketingPageHeader } from '@/components/marketing-page-header';
import { RetroAbout } from '@/components/retro-about';
import { RetroWhyUs } from '@/components/retro-why-us';
import { RetroCTA } from '@/components/retro-cta';
import { constructMetadata, generateBreadcrumbSchema, siteConfig } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'About Ractrotech',
  description:
    'Learn about Ractrotech — a developer-led team building websites, apps, and SaaS products with modern tech and a focus on shipping.',
  canonicalUrl: `${siteConfig.url}/about`,
});

export default function AboutPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'About', item: '/about' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <MarketingPageHeader
        title="About RactroTech"
        description="We turn ideas into real products — websites, apps, and SaaS that ship and perform."
      />
      <RetroAbout />
      <RetroWhyUs />
      <RetroCTA />
    </>
  );
}
