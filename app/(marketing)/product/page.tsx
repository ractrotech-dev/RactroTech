import { MarketingPageHeader } from '@/components/marketing-page-header';
import { constructMetadata, sitePath } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Product',
  description: 'Ractrotech product — coming soon.',
  canonicalUrl: sitePath('/product'),
});

export default function ProductPage() {
  return (
    <MarketingPageHeader
      title="Product"
      description="Product will be added soon."
    />
  );
}
