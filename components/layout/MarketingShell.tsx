'use client';

import dynamic from 'next/dynamic';

const RetroHeader = dynamic(
  () => import('@/components/retro-header').then((mod) => ({ default: mod.RetroHeader })),
  {
    ssr: false,
    loading: () => (
      <header className="retro-border border-b-4 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:py-6">
          <div className="h-8 w-48 rounded bg-yellow-200/80" aria-hidden />
        </div>
      </header>
    ),
  }
);

const RetroFooter = dynamic(
  () => import('@/components/retro-footer').then((mod) => ({ default: mod.RetroFooter })),
  { ssr: false }
);

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <RetroHeader />
      <main className="flex-1">{children}</main>
      <RetroFooter />
    </div>
  );
}
