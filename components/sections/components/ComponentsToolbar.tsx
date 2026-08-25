'use client';

import Link from 'next/link';
import { ChevronDown, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { LIBRARY_INDUSTRIES, LIBRARY_STYLES } from '@/lib/component-library/constants';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  ALL_CATEGORY,
  ALL_INDUSTRIES,
  ALL_STYLES,
  UNCATEGORIZED,
  type Category,
  type CategoryFilter,
  type IndustryFilter,
  type StyleFilter,
} from './types';

type ComponentsToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  activeCategory: CategoryFilter;
  onCategoryChange: (value: CategoryFilter) => void;
  activeStyle: StyleFilter;
  onStyleChange: (value: StyleFilter) => void;
  activeIndustry: IndustryFilter;
  onIndustryChange: (value: IndustryFilter) => void;
  categories: Category[];
  onOpenSidebar: () => void;
};

/**
 * Native `<select>` in the marketing skin: the browser arrow is suppressed so the
 * control can carry the same pill shape as the buttons around it, and a lucide
 * chevron is layered back in.
 */
function FilterSelect({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={cn('relative', className)}>
      <select
        {...props}
        className="h-11 w-full cursor-pointer appearance-none rounded-full border border-mkt-line bg-mkt-surface pl-4 pr-9 text-[14px] font-medium text-mkt-ink outline-none transition-colors hover:border-mkt-ink/25 focus-visible:ring-2 focus-visible:ring-mkt-violet focus-visible:ring-offset-2"
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mkt-muted"
        aria-hidden
      />
    </div>
  );
}

export function ComponentsToolbar({
  search,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  activeStyle,
  onStyleChange,
  activeIndustry,
  onIndustryChange,
  categories,
  onOpenSidebar,
}: ComponentsToolbarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="mkt-btn-ghost h-11 shrink-0 px-5 py-0 text-[14px] md:hidden"
          aria-label="Open categories"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Categories
        </button>

        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mkt-muted"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Search components…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(
              'h-11 rounded-full border-mkt-line bg-mkt-surface pl-11 text-[14px] text-mkt-ink',
              'placeholder:text-mkt-muted focus-visible:ring-mkt-violet'
            )}
          />
        </div>

        <Link href="/components/new" className="mkt-btn-ghost h-11 shrink-0 px-5 py-0 text-[14px]">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Make your own</span>
          <span className="sm:hidden">Create</span>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterSelect
          value={activeCategory}
          onChange={(e) => onCategoryChange(e.target.value as CategoryFilter)}
          className="min-w-[150px] md:hidden"
          aria-label="Filter by category"
        >
          <option value={ALL_CATEGORY}>All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
          <option value={UNCATEGORIZED}>Uncategorized</option>
        </FilterSelect>

        <FilterSelect
          value={activeStyle}
          onChange={(e) => onStyleChange(e.target.value as StyleFilter)}
          className="min-w-[150px]"
          aria-label="Filter by style"
        >
          <option value={ALL_STYLES}>All styles</option>
          {LIBRARY_STYLES.map((style) => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          value={activeIndustry}
          onChange={(e) => onIndustryChange(e.target.value as IndustryFilter)}
          className="min-w-[150px]"
          aria-label="Filter by industry"
        >
          <option value={ALL_INDUSTRIES}>All industries</option>
          {LIBRARY_INDUSTRIES.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </FilterSelect>
      </div>
    </div>
  );
}
