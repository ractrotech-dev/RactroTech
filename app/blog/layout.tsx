import { SiteFooter } from '@/components/marketing/site-footer';
import { SiteHeader } from '@/components/marketing/site-header';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="journal-shell flex min-h-screen flex-col text-black">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
