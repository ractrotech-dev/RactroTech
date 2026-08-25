import { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { SiteHeader } from '@/components/marketing/site-header';
import { SiteFooter } from '@/components/marketing/site-footer';
import { GlobalBackground } from '@/components/layout/global-background';

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

export function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <div className="relative isolate flex min-h-screen flex-col text-mkt-ink">
      <GlobalBackground tone="surface" />
      <SiteHeader tone="surface" />

      <main className="flex-1">
        <div className="mkt-shell max-w-3xl py-12 lg:py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[14px] font-medium text-mkt-muted transition-colors hover:text-mkt-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>

          <header className="mt-6 border-b border-mkt-line pb-6">
            <h1 className="mkt-display text-[32px] leading-[1.1] sm:text-[40px]">{title}</h1>
            <p className="mt-3 text-[14px] text-mkt-muted">Last updated: {lastUpdated}</p>
          </header>

          <div className="mt-8 space-y-8">{children}</div>

          <div className="mt-12 flex flex-col gap-2 rounded-2xl bg-mkt-lavender p-6 sm:flex-row sm:items-center sm:justify-between text-mkt-ink">
            <h2 className="text-[15px] font-semibold text-mkt-ink">RactroTech Technologies</h2>
            <p className="text-[14px] text-mkt-muted">
              For legal inquiries:{' '}
              <a
                href="mailto:legal@ractrotech.com"
                className="font-medium text-mkt-violet underline-offset-4 hover:underline"
              >
                legal@ractrotech.com
              </a>
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="mkt-display text-[19px]">{title}</h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-mkt-muted">{children}</div>
    </section>
  );
}

export function LegalParagraph({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`text-[15px] leading-relaxed ${className}`}>{children}</p>;
}

export function LegalList({ children }: { children: ReactNode }) {
  return (
    <ul className="ml-5 list-outside list-disc space-y-1.5 text-[15px] leading-relaxed text-mkt-muted">
      {children}
    </ul>
  );
}
