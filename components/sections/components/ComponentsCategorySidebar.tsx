'use client';

import { X } from 'lucide-react';

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
    <nav className="flex flex-col gap-1">
      {isLoading ? (
        <p className="px-3 py-2 text-[14px] text-mkt-muted">Loading categories…</p>
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
              aria-current={isActive ? 'true' : undefined}
              className={cn(
                'flex w-full items-center justify-between gap-2 rounded-full px-3.5 py-2.5 text-left text-[14px] font-medium transition-colors',
                isActive
                  ? 'bg-mkt-violet text-white'
                  : 'text-mkt-ink hover:bg-mkt-lavender hover:text-mkt-violet'
              )}
            >
              <span className="truncate">{item.label}</span>
              <span
                className={cn(
                  'shrink-0 text-[12px] tabular-nums',
                  isActive ? 'text-white/70' : 'text-mkt-muted'
                )}
              >
                {item.count}
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
          className="fixed inset-0 z-40 bg-mkt-ink/40 backdrop-blur-sm md:hidden"
          onClick={onMobileClose}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          'w-64 shrink-0 flex-col',
          // Off-canvas drawer below `md`, a sticky column from `md` up.
          mobileOpen
            ? 'fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] bg-mkt-surface p-4 shadow-2xl md:static md:z-auto md:w-64 md:max-w-none md:bg-transparent md:p-0 md:shadow-none'
            : 'hidden',
          'md:sticky md:top-24 md:flex'
        )}
      >
        <div className="mkt-card flex max-h-full min-h-0 flex-col overflow-hidden">
          <div className="flex items-start justify-between gap-3 border-b border-mkt-line px-5 py-4">
            <div>
              <h2 className="mkt-display text-[15px]">Categories</h2>
              <p className="mt-0.5 text-[13px] text-mkt-muted">Browse by type</p>
            </div>
            <button
              type="button"
              onClick={onMobileClose}
              className="-mr-1 rounded-full p-1 text-mkt-muted transition-colors hover:bg-mkt-lavender hover:text-mkt-ink md:hidden"
              aria-label="Close categories"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-2.5 md:max-h-[calc(100vh-14rem)]">
            {navContent}
          </div>
        </div>
      </aside>
    </>
  );
}
