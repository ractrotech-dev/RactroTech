'use client';

import { cn } from '@/lib/utils';
import {
  ALL_CATEGORY,
  UNCATEGORIZED,
  type Category,
  type CategoryFilter,
  type LibraryComponent,
} from './types';

type ComponentsCategorySidebarProps = {
  categories: Category[];
  components: LibraryComponent[];
  activeCategory: CategoryFilter;
  onSelectCategory: (categoryId: CategoryFilter) => void;
  isLoading: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
};

function getCategoryCount(components: LibraryComponent[], categoryId: CategoryFilter): number {
  if (categoryId === ALL_CATEGORY) return components.length;
  if (categoryId === UNCATEGORIZED) {
    return components.filter((c) => !c.category_id).length;
  }
  return components.filter((c) => c.category_id === categoryId).length;
}

export function ComponentsCategorySidebar({
  categories,
  components,
  activeCategory,
  onSelectCategory,
  isLoading,
  mobileOpen,
  onMobileClose,
}: ComponentsCategorySidebarProps) {
  const uncategorizedCount = getCategoryCount(components, UNCATEGORIZED);

  const items: { id: CategoryFilter; label: string; count: number }[] = [
    { id: ALL_CATEGORY, label: 'All components', count: components.length },
    ...categories.map((category) => ({
      id: category.id,
      label: category.name,
      count: getCategoryCount(components, category.id),
    })),
  ];

  if (uncategorizedCount > 0) {
    items.push({
      id: UNCATEGORIZED,
      label: 'Uncategorized',
      count: uncategorizedCount,
    });
  }

  const navContent = (
    <nav className="flex flex-col gap-0.5">
      {isLoading ? (
        <p className="px-3 py-2 text-sm text-black/60">Loading categories...</p>
      ) : (
        items.map((item) => {
          if (item.id !== ALL_CATEGORY && item.count === 0) return null;
          const isActive = activeCategory === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectCategory(item.id);
                onMobileClose();
              }}
              className={cn(
                'flex w-full items-center justify-between rounded border-2 px-3 py-2.5 text-left text-sm font-medium transition-colors',
                isActive
                  ? 'border-black bg-black text-yellow-400'
                  : 'border-transparent text-black hover:border-black/40 hover:bg-yellow-200/80'
              )}
            >
              <span className="truncate">{item.label}</span>
              <span
                className={cn(
                  'ml-2 shrink-0 text-xs tabular-nums',
                  isActive ? 'text-yellow-400/80' : 'text-black/50'
                )}
              >
                ({item.count})
              </span>
            </button>
          );
        })
      )}
    </nav>
  );

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={onMobileClose}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          'flex w-64 shrink-0 flex-col border-r-4 border-black bg-yellow-300',
          mobileOpen ? 'fixed inset-y-0 left-0 z-50 md:static md:z-auto' : 'hidden',
          'md:flex'
        )}
      >
        <div className="border-b-4 border-black px-4 py-4">
          <h2 className="text-base font-bold text-black">Categories</h2>
          <p className="mt-0.5 text-sm text-black/60">Browse by type</p>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-3">{navContent}</div>
      </aside>
    </>
  );
}
