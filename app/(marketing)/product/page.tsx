import { PageHero } from '@/components/marketing/sections/page-hero';
import { FinalCta } from '@/components/marketing/sections/final-cta';
import { constructMetadata, sitePath } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Product',
  description: 'Ractrotech product — coming soon.',
  canonicalUrl: sitePath('/product'),
});

export default function ProductPage() {
  return (
    <>
      <PageHero
        eyebrow="Product"
        title="Something new is"
        titleAccent="on the way"
        description="We are building a product of our own. Until it lands, tell us what you need and we will build it with you."
        primaryCta={{ label: 'Tell us your idea', href: '/start-project' }}
        secondaryCta={{ label: 'See our services', href: '/services' }}
      />
      <FinalCta />
    </>
  );
}
