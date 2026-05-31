'use client';

import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
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

const selectClass =
  'h-10 rounded-md border-2 border-black bg-white px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-black';

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
    <div className="flex flex-col gap-3 border-b-4 border-black bg-yellow-100/80 px-6 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="flex items-center gap-3 border-4 border-black bg-white px-3 py-2 md:hidden"
          aria-label="Open categories"
        >
          <span className="flex flex-col gap-1">
            <span className="block h-0.5 w-5 bg-black" />
            <span className="block h-0.5 w-5 bg-black" />
            <span className="block h-0.5 w-5 bg-black" />
          </span>
          <span className="text-sm font-semibold">Categories</span>
        </button>

        <Link
          href="/components/new"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md border-2 border-black bg-black px-4 text-sm font-semibold text-yellow-400 hover:bg-black/90"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Make your own</span>
          <span className="sm:hidden">Create</span>
        </Link>

        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
          <Input
            type="search"
            placeholder="Search components..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(
              'h-10 border-2 border-black bg-white pl-9 text-sm font-medium',
              'placeholder:text-black/40 focus-visible:ring-black'
            )}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={activeCategory}
          onChange={(e) => onCategoryChange(e.target.value as CategoryFilter)}
          className={cn(selectClass, 'md:hidden min-w-[140px]')}
          aria-label="Filter by category"
        >
          <option value={ALL_CATEGORY}>All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
          <option value={UNCATEGORIZED}>Uncategorized</option>
        </select>

        <select
          value={activeStyle}
          onChange={(e) => onStyleChange(e.target.value as StyleFilter)}
          className={selectClass}
          aria-label="Filter by style"
        >
          <option value={ALL_STYLES}>All styles</option>
          {LIBRARY_STYLES.map((style) => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>

        <select
          value={activeIndustry}
          onChange={(e) => onIndustryChange(e.target.value as IndustryFilter)}
          className={selectClass}
          aria-label="Filter by industry"
        >
          <option value={ALL_INDUSTRIES}>All industries</option>
          {LIBRARY_INDUSTRIES.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
