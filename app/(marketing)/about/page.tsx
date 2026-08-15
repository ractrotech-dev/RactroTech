import { PageHero } from '@/components/marketing/sections/page-hero';
import { AboutStory } from '@/components/marketing/sections/about-story';
import { FinalCta } from '@/components/marketing/sections/final-cta';
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
      <PageHero
        eyebrow="About"
        title="We turn ideas into"
        titleAccent="real products"
        description="Websites, apps, and SaaS that ship and perform — built by the people who design and code them."
        primaryCta={{ label: 'Tell us your idea', href: '/start-project' }}
        secondaryCta={{ label: 'See our services', href: '/services' }}
      />
      <AboutStory />
      <FinalCta />
    </>
  );
}
