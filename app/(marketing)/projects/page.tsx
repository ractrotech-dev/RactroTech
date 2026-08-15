import { PageHero } from '@/components/marketing/sections/page-hero';
import { ProjectsGrid } from '@/components/marketing/sections/projects-grid';
import { FinalCta } from '@/components/marketing/sections/final-cta';
import { constructMetadata, generateBreadcrumbSchema, siteConfig } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Project Showcase',
  description:
    'See the kinds of products Ractrotech builds — SaaS platforms, MVPs, marketing sites, e-commerce, and internal tools from idea to production.',
  canonicalUrl: `${siteConfig.url}/projects`,
});

export default function ProjectsPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Projects', item: '/projects' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageHero
        eyebrow="Projects"
        title="Work that ships,"
        titleAccent="not just decks"
        description="Browse the product types we design, build and launch — then tell us what you want to ship next."
        primaryCta={{ label: 'Start a project', href: '/start-project' }}
        secondaryCta={{ label: 'Explore services', href: '/services' }}
      />
      <ProjectsGrid />
      <FinalCta />
    </>
  );
}
