'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { fetchAllLibraryComponents, fetchLibraryCategories } from './fetch-library-data';
import { ComponentsCategorySidebar } from './ComponentsCategorySidebar';
import { ComponentsGrid } from './ComponentsGrid';
import { ComponentsLibraryHeader } from './ComponentsLibraryHeader';
import { ComponentsToolbar } from './ComponentsToolbar';
import {
  ALL_CATEGORY,
  ALL_INDUSTRIES,
  ALL_STYLES,
  UNCATEGORIZED,
  type Category,
  type CategoryFilter,
  type IndustryFilter,
  type LibraryComponent,
  type StyleFilter,
} from './types';

export function ComponentsLibraryPage() {
  const [components, setComponents] = useState<LibraryComponent[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>(ALL_CATEGORY);
  const [activeStyle, setActiveStyle] = useState<StyleFilter>(ALL_STYLES);
  const [activeIndustry, setActiveIndustry] = useState<IndustryFilter>(ALL_INDUSTRIES);
  const [search, setSearch] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const loadComponents = async () => {
      const supabase = createClient();
      const [componentsResult, categoriesResult] = await Promise.all([
        fetchAllLibraryComponents(supabase),
        fetchLibraryCategories(supabase),
      ]);

      if (!componentsResult.error) {
        setComponents(componentsResult.components);
      }

      if (!categoriesResult.error) {
        setCategories(categoriesResult.categories);
      }

      setIsLoading(false);
    };

    loadComponents();
  }, []);

  useEffect(() => {
    if (!mobileSidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileSidebarOpen]);

  const filteredComponents = useMemo(() => {
    let result = components;

    if (activeCategory === UNCATEGORIZED) {
      result = result.filter((c) => !c.category_id);
    } else if (activeCategory !== ALL_CATEGORY) {
      result = result.filter((c) => c.category_id === activeCategory);
    }

    if (activeStyle !== ALL_STYLES) {
      result = result.filter((c) => c.style_variant === activeStyle);
    }

    if (activeIndustry !== ALL_INDUSTRIES) {
      result = result.filter((c) => c.industry_variant === activeIndustry);
    }

    const query = search.trim().toLowerCase();
    if (query) {
      result = result.filter((c) => {
        const tagMatch = c.tags?.some((tag) => tag.toLowerCase().includes(query));
        return (
          c.title.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          tagMatch
        );
      });
    }

    return result;
  }, [components, activeCategory, activeStyle, activeIndustry, search]);

  return (
    <section className="relative w-full overflow-x-hidden border-b-4 border-black bg-yellow-100/60">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M0 0h2v2H0V0zm4 4h2v2H4V4zm4 4h2v2H8V8zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <ComponentsLibraryHeader totalCount={components.length} />

      <div className="relative mx-auto flex w-full min-w-0">
        <ComponentsCategorySidebar
          categories={categories}
          components={components}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          isLoading={isLoading}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        <div className="min-w-0 flex-1">
          <ComponentsToolbar
            search={search}
            onSearchChange={setSearch}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            activeStyle={activeStyle}
            onStyleChange={setActiveStyle}
            activeIndustry={activeIndustry}
            onIndustryChange={setActiveIndustry}
            categories={categories}
            onOpenSidebar={() => setMobileSidebarOpen(true)}
          />
          <ComponentsGrid
            components={filteredComponents}
            categories={categories}
            isLoading={isLoading}
          />
        </div>
      </div>
    </section>
  );
}
