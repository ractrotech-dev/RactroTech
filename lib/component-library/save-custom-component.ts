import type { SupabaseClient } from '@supabase/supabase-js';
import { computeContentHash } from './hash';
import { slugify } from './style-tokens';

export type CustomComponentInput = {
  title: string;
  description: string;
  code: string;
  categoryId: string | null;
  categoryName?: string;
  styleVariant: string;
  industryVariant: string;
  difficulty: string;
  tags: string[];
  supportsDarkMode: boolean;
  componentId?: string | null;
};

export type SaveCustomComponentResult =
  | { ok: true; id: string }
  | { ok: false; message: string };

function buildUniqueSlug(title: string, styleVariant: string): string {
  const suffix = crypto.randomUUID().slice(0, 8);
  return slugify(`${title}-custom-${styleVariant}-${suffix}`);
}

export function buildCustomComponentPayload(input: CustomComponentInput, existingSlug?: string) {
  const slug = existingSlug ?? buildUniqueSlug(input.title, input.styleVariant);
  const tags = input.tags.includes('custom') ? input.tags : [...input.tags, 'custom'];

  return {
    title: input.title.trim(),
    description: input.description.trim(),
    code: input.code,
    category_id: input.categoryId,
    slug,
    tags,
    style_variant: input.styleVariant,
    industry_variant: input.industryVariant,
    difficulty: input.difficulty,
    supports_dark_mode: input.supportsDarkMode,
    responsive: true,
    content_hash: computeContentHash(`${slug}:${input.code}`),
    preview_metadata: {
      name: input.title.trim(),
      category: input.categoryName ?? 'Custom',
      tags,
      description: input.description.trim(),
      difficulty: input.difficulty,
      responsive: true,
      darkMode: input.supportsDarkMode,
    },
  };
}

export async function saveCustomComponent(
  supabase: SupabaseClient,
  input: CustomComponentInput
): Promise<SaveCustomComponentResult> {
  if (!input.title.trim() || !input.description.trim() || !input.code.trim()) {
    return { ok: false, message: 'Title, description, and code are required.' };
  }

  if (input.componentId) {
    const { data: existing, error: loadError } = await supabase
      .from('components')
      .select('slug')
      .eq('id', input.componentId)
      .maybeSingle();

    if (loadError || !existing) {
      return { ok: false, message: 'Could not load component for update.' };
    }

    const payload = buildCustomComponentPayload(
      input,
      existing.slug ?? buildUniqueSlug(input.title, input.styleVariant)
    );
    const { error } = await supabase.from('components').update(payload).eq('id', input.componentId);
    if (error) {
      return { ok: false, message: error.message || 'Failed to update component.' };
    }
    return { ok: true, id: input.componentId };
  }

  const payload = buildCustomComponentPayload(input);
  const { data, error } = await supabase
    .from('components')
    .insert(payload)
    .select('id')
    .maybeSingle();

  if (error) {
    return { ok: false, message: error.message || 'Failed to save component.' };
  }

  if (!data?.id) {
    return { ok: false, message: 'Component saved but no id was returned.' };
  }

  return { ok: true, id: String(data.id) };
}
