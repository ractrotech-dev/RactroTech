import { Suspense } from 'react';
import { CreateComponentEditor } from '@/components/sections/components/CreateComponentEditor';
import { constructMetadata, siteConfig } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata = constructMetadata({
  title: 'MAKE YOUR OWN COMPONENT',
  description:
    'Build custom Tailwind HTML components with live preview. Save and share them in the RactroTech component library.',
  canonicalUrl: `${siteConfig.url}/components/new`,
});

export default function NewComponentPage() {
  return (
    <Suspense
      fallback={
        <div className="px-6 py-12 text-center text-sm font-medium text-black/60">
          Loading editor...
        </div>
      }
    >
      <CreateComponentEditor />
    </Suspense>
  );
}
