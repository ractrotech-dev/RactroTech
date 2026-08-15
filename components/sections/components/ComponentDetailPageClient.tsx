'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, FileQuestion } from 'lucide-react';
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
      <div className="mkt-shell py-24 text-center text-[15px] text-mkt-muted">
        Loading component…
      </div>
    );
  }

  if (notFound || !component) {
    return (
      <div className="mkt-shell py-16 lg:py-24">
        <div className="mkt-card mx-auto flex max-w-lg flex-col items-center px-6 py-14 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-mkt-lavender text-mkt-violet">
            <FileQuestion className="h-5 w-5" aria-hidden />
          </span>
          <p className="mkt-display mt-5 text-[21px]">Component not found</p>
          <p className="mt-2 text-[15px] leading-relaxed text-mkt-muted">
            This component may have been removed, or the link is incorrect.
          </p>
          <Link href="/components" className="mkt-btn-primary mt-6">
            <ArrowLeft className="h-4 w-4" />
            Back to library
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mkt-shell py-10 lg:py-14">
      <Link
        href="/components"
        className="inline-flex items-center gap-2 text-[14px] font-medium text-mkt-muted transition-colors hover:text-mkt-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to library
      </Link>
      <div className="mt-6">
        <ComponentDetailView component={component} categoryName={categoryName} />
      </div>
    </div>
  );
}
