import { JetBrains_Mono } from 'next/font/google';

import { GlobalBackground } from '@/components/layout/global-background';
import { SiteFooter } from '@/components/marketing/site-footer';
import { SiteHeader } from '@/components/marketing/site-header';
import { DsaNav } from '@/components/dsa/DsaNav';
import { LangProvider } from '@/components/dsa/lang/LangProvider';

import './dsa.css';

/** Code, diagrams and practice boards. The rest of the site has no monospace face. */
const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dsa-mono',
});

/**
 * The Learn DSA course: the reading-heavy `surface` shell the blog uses, plus the course's
 * own section bar. Everything the course styles is scoped under `.dsa` in ./dsa.css, so
 * none of it reaches the rest of the site even after a client-side navigation away.
 */
export default function DsaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate flex min-h-screen flex-col text-mkt-ink">
      <GlobalBackground tone="surface" />
      <SiteHeader tone="surface" />
      <LangProvider>
        <div className={`dsa flex-1 ${mono.variable}`}>
          <DsaNav />
          {children}
        </div>
      </LangProvider>
      <SiteFooter />
    </div>
  );
}
