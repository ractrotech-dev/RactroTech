import { SiteFooter } from '@/components/marketing/site-footer';
import { SiteHeader } from '@/components/marketing/site-header';
import { GlobalBackground } from '@/components/layout/global-background';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate flex min-h-screen flex-col text-mkt-ink">
      <GlobalBackground tone="surface" />
      <SiteHeader tone="surface" />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
