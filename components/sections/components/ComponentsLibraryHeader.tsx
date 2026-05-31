import Link from 'next/link';
import { ChevronRight, Home, Plus } from 'lucide-react';

type ComponentsLibraryHeaderProps = {
  totalCount: number;
};

export function ComponentsLibraryHeader({ totalCount }: ComponentsLibraryHeaderProps) {
  return (
    <div className="flex flex-col gap-6 border-b-4 border-black bg-yellow-400 px-6 py-8 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0 flex-1 space-y-3">
        <nav className="flex items-center gap-1 text-sm text-black/60" aria-label="Breadcrumb">
          <Link href="/" className="flex items-center gap-1 hover:text-black">
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-black">Components</span>
        </nav>

        <div>
          <h1 className="retro-heading text-3xl font-bold md:text-4xl">
            {totalCount > 0
              ? `${totalCount}+ website UI & component examples`
              : 'Website UI & component examples'}
          </h1>
          <p className="mt-2 max-w-2xl text-base font-medium text-black/75">
            Browse production-ready Tailwind components. Preview live, copy the markup, and drop
            them into your next project.
          </p>
        </div>
      </div>

      <div className="retro-card w-full max-w-sm shrink-0 border-4 bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <p className="text-sm font-bold text-black">MAKE YOUR OWN COMPONENT</p>
        <p className="mt-1 text-sm text-black/65">
          Write Tailwind HTML, preview live on mobile and desktop, and publish to the library.
        </p>
        <Link
          href="/components/new"
          className="retro-button mt-4 inline-flex w-full items-center justify-center gap-2 border-2 border-black bg-black px-4 py-2.5 text-sm font-semibold text-yellow-400 hover:bg-black/90"
        >
          <Plus className="h-4 w-4" />
          Open builder
        </Link>
      </div>
    </div>
  );
}
