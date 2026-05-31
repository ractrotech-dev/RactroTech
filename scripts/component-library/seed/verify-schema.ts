import type { SupabaseClient } from '@supabase/supabase-js';

export type SchemaCheckResult =
  | { ok: true }
  | { ok: false; message: string };

/** Verify component library metadata columns exist in Supabase. */
export async function verifyLibrarySchema(supabase: SupabaseClient): Promise<SchemaCheckResult> {
  const { error: categoryError } = await supabase.from('category').select('slug').limit(1);
  if (categoryError?.message.includes('slug')) {
    return {
      ok: false,
      message:
        "Missing column `category.slug`. Run `npm run library:migrate` (or apply utils/db/migrations/0009_component_library.sql in the Supabase SQL editor), then retry.",
    };
  }

  const { error: componentsError } = await supabase
    .from('components')
    .select('slug, tags, content_hash, style_variant, preview_metadata, duplicate_score, is_duplicate, keep_component, replacement_needed')
    .limit(1);

  if (componentsError) {
    const msg = componentsError.message;
    if (
      msg.includes('content_hash') ||
      msg.includes('style_variant') ||
      msg.includes('preview_metadata') ||
      msg.includes('tags') ||
      msg.includes('duplicate_score') ||
      msg.includes('is_duplicate')
    ) {
      return {
        ok: false,
        message:
          "Missing component library metadata columns. Run `npm run library:migrate` (or apply utils/db/migrations/0009_component_library.sql in the Supabase SQL editor), then retry.",
      };
    }
    if (msg.includes('does not exist') || msg.includes('schema cache')) {
      return {
        ok: false,
        message:
          "The `components` table is missing or outdated. Run `npm run library:migrate` before seeding.",
      };
    }
  }

  return { ok: true };
}
