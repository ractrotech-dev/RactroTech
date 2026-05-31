'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { ComponentDetailView } from './ComponentDetailView';
import { LIBRARY_SELECT_FIELDS, type Category, type LibraryComponent } from './types';

type ComponentDetailPageClientProps = {
  id: string;
};

export function ComponentDetailPageClient({ id }: ComponentDetailPageClientProps) {
  const [component, setComponent] = useState<LibraryComponent | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const [componentResult, categoriesResult] = await Promise.all([
        supabase
          .from('components')
          .select(LIBRARY_SELECT_FIELDS)
          .eq('id', id)
          .maybeSingle(),
        supabase.from('category').select('id, name').order('name', { ascending: true }),
      ]);

      if (componentResult.error || !componentResult.data) {
        setNotFound(true);
      } else {
        const row = componentResult.data;
        setComponent({
          id: String(row.id),
          title: row.title,
          description: row.description,
          code: row.code,
          created_at: row.created_at,
          category_id: row.category_id ?? null,
          slug: row.slug ?? null,
          tags: row.tags ?? null,
          style_variant: row.style_variant ?? null,
          industry_variant: row.industry_variant ?? null,
          difficulty: row.difficulty ?? null,
          supports_dark_mode: row.supports_dark_mode ?? null,
          responsive: row.responsive ?? null,
          preview_metadata: row.preview_metadata ?? null,
          content_hash: row.content_hash ?? null,
        });
      }

      if (!categoriesResult.error && categoriesResult.data) {
        setCategories(
          categoriesResult.data.map((row) => ({
            id: String(row.id),
            name: row.name,
          }))
        );
      }

      setIsLoading(false);
    };

    load();
  }, [id]);

  const categoryName = useMemo(() => {
    if (!component?.category_id) return undefined;
    return categories.find((c) => c.id === component.category_id)?.name;
  }, [component, categories]);

  if (isLoading) {
    return (
      <div className="px-6 py-12 text-center text-sm font-medium text-black/60">
        Loading component...
      </div>
    );
  }

  if (notFound || !component) {
    return (
      <div className="retro-card mx-6 my-8 border-4 bg-white p-8 text-center">
        <p className="text-base font-bold text-black">Component not found</p>
        <p className="mt-2 text-sm text-black/60">
          This component may have been removed or the link is incorrect.
        </p>
        <Link
          href="/components"
          className="retro-button mt-6 inline-flex items-center gap-2 border-2 border-black bg-black px-4 py-2 text-sm font-semibold text-yellow-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to library
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <Link
        href="/components"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-black/60 hover:text-black hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to library
      </Link>
      <ComponentDetailView component={component} categoryName={categoryName} />
    </div>
  );
}
