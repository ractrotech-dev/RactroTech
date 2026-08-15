import { SiteHeader } from '@/components/marketing/site-header';
import { SiteFooter } from '@/components/marketing/site-footer';
import { GlobalBackground } from '@/components/layout/global-background';

/**
 * Header and footer render server-side. They were previously loaded with
 * `dynamic(..., { ssr: false })`, which kept every nav and footer link out of the
 * SSR HTML and made the header pop in after hydration.
 */
export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate flex min-h-screen flex-col text-mkt-ink">
      <GlobalBackground />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
