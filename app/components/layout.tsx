import { MarketingShell } from '@/components/layout/MarketingShell';
import { constructMetadata, siteConfig } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Component Library',
  description:
    'Browse production-ready Tailwind UI components. Preview live, copy markup, and use them in your next project.',
  canonicalUrl: `${siteConfig.url}/components`,
});

export default function ComponentsLayout({ children }: { children: React.ReactNode }) {
  return <MarketingShell>{children}</MarketingShell>;
}
