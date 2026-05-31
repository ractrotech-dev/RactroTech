import type { SupabaseClient } from '@supabase/supabase-js';
import { LIBRARY_SELECT_FIELDS, type Category, type LibraryComponent } from './types';

const PAGE_SIZE = 1000;

function mapComponentRow(row: Record<string, unknown>): LibraryComponent {
  return {
    id: String(row.id),
    title: String(row.title),
    description: String(row.description),
    code: String(row.code),
    created_at: String(row.created_at),
    category_id: row.category_id != null ? String(row.category_id) : null,
    slug: row.slug != null ? String(row.slug) : null,
    tags: (row.tags as string[] | null) ?? null,
    style_variant: row.style_variant != null ? String(row.style_variant) : null,
    industry_variant: row.industry_variant != null ? String(row.industry_variant) : null,
    difficulty: row.difficulty != null ? String(row.difficulty) : null,
    supports_dark_mode: row.supports_dark_mode as boolean | null,
    responsive: row.responsive as boolean | null,
    preview_metadata: row.preview_metadata as LibraryComponent['preview_metadata'],
    content_hash: row.content_hash != null ? String(row.content_hash) : null,
  };
}

/** PostgREST returns at most 1000 rows per request — paginate until all rows are loaded. */
export async function fetchAllLibraryComponents(
  supabase: SupabaseClient
): Promise<{ components: LibraryComponent[]; error: string | null }> {
  const components: LibraryComponent[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from('components')
      .select(LIBRARY_SELECT_FIELDS)
      .order('title', { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      return { components: [], error: error.message };
    }

    if (!data?.length) break;

    components.push(...data.map((row) => mapComponentRow(row as Record<string, unknown>)));

    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return { components, error: null };
}

export async function fetchLibraryCategories(
  supabase: SupabaseClient
): Promise<{ categories: Category[]; error: string | null }> {
  const { data, error } = await supabase
    .from('category')
    .select('id, name, slug')
    .order('name', { ascending: true });

  if (error) {
    return { categories: [], error: error.message };
  }

  return {
    categories: (data ?? []).map((row) => ({
      id: String(row.id),
      name: row.name,
      slug: row.slug ?? null,
    })),
    error: null,
  };
}
