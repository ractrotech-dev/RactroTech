import { computeContentHash } from './hash';
import { slugify } from './style-tokens';

/**
 * @deprecated Use `saveComponentAction` from `@/lib/components/actions` (server-only, enforces ownership).
 * This module only exports payload builders for server actions.
 */

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

