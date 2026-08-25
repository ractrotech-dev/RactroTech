import Link from 'next/link';
import { Puzzle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'My Components',
  description: 'Manage your RactroTech UI components.',
  noIndex: true,
});

export default function AccountComponentsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <div className="flex items-center gap-3">
        <Puzzle className="h-8 w-8" strokeWidth={2.5} />
        <h1 className="text-3xl font-black tracking-tight">My Components</h1>
      </div>
      <p className="mt-2 text-sm font-semibold text-black/70">
        Create and manage components in the library.
      </p>
      <div className="retro-border mt-8 flex flex-col gap-4 border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-black/80">Browse the public component library or add a new component.</p>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="retro-border border-2 border-black font-bold">
            <Link href="/components">Browse library</Link>
          </Button>
          <Button asChild className="retro-button border-2 border-black bg-black text-yellow-400">
            <Link href="/dashboard/components/new">New component</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
