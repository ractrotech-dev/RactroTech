import { ComponentPreviewCard } from './ComponentPreviewCard';
import type { Category, LibraryComponent } from './types';

type ComponentsGridProps = {
  components: LibraryComponent[];
  categories: Category[];
  isLoading: boolean;
};

export function ComponentsGrid({ components, categories, isLoading }: ComponentsGridProps) {
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  if (isLoading) {
    return (
      <div className="px-6 py-12 text-center text-sm font-medium text-black/60">
        Loading components...
      </div>
    );
  }

  if (components.length === 0) {
    return (
      <div className="retro-card mx-6 my-8 border-4 bg-white p-8 text-center">
        <p className="text-base font-bold text-black">No components found</p>
        <p className="mt-2 text-sm text-black/60">
          Try a different search or filter, or run{' '}
          <code className="rounded bg-yellow-100 px-1">npm run library:generate</code> to seed the
          library.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 px-6 py-8 sm:grid-cols-2 lg:grid-cols-3">
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
