import Link from 'next/link';
import { SearchX } from 'lucide-react';

import { ComponentPreviewCard } from './ComponentPreviewCard';
import type { Category, LibraryComponent } from './types';

type ComponentsGridProps = {
  components: LibraryComponent[];
  categories: Category[];
  isLoading: boolean;
};

/** Placeholder matching the real card's shape so the grid does not reflow on load. */
function PreviewCardSkeleton() {
  return (
    <div className="mkt-card overflow-hidden">
      <div className="h-48 animate-pulse bg-mkt-lavender text-mkt-ink" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-24 animate-pulse rounded-full bg-mkt-lavender text-mkt-ink" />
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-mkt-lavender text-mkt-ink" />
        <div className="h-4 w-full animate-pulse rounded-full bg-mkt-lavender text-mkt-ink" />
      </div>
    </div>
  );
}

export function ComponentsGrid({ components, categories, isLoading }: ComponentsGridProps) {
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  if (isLoading) {
    return (
      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <PreviewCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (components.length === 0) {
    return (
      <div className="mkt-card mt-6 flex flex-col items-center px-6 py-14 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-mkt-lavender text-mkt-violet text-mkt-ink">
          <SearchX className="h-5 w-5" aria-hidden />
        </span>
        <p className="mkt-display mt-5 text-[19px]">No components found</p>
        <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-mkt-muted">
          Try a different search or filter — or build the first one yourself.
        </p>
        <Link href="/components/new" className="mkt-btn-primary mt-6">
          Open the builder
        </Link>
        <p className="mt-6 text-[13px] text-mkt-muted">
          Seeding a fresh install? Run{' '}
          <code className="rounded-md bg-mkt-lavender px-1.5 py-0.5 font-mono text-mkt-violet text-mkt-ink">
            npm run library:generate
          </code>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {components.map((component) => (
        <ComponentPreviewCard
          key={component.id}
          id={component.id}
          title={component.title}
          description={component.description}
          code={component.code}
          categoryName={
            component.category_id ? categoryMap.get(component.category_id) : undefined
          }
          styleVariant={component.style_variant}
          industryVariant={component.industry_variant}
          difficulty={component.difficulty}
        />
      ))}
    </div>
  );
}
