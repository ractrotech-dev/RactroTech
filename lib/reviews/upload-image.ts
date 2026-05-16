import { createServiceRoleClient } from '@/utils/supabase/service';

const BUCKET = 'review-uploads';
const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export async function uploadReviewImage(file: File): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  if (!ALLOWED.has(file.type)) {
    return { ok: false, error: 'Please upload a JPG, PNG, WebP, or GIF image.' };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: 'Image must be 2MB or smaller.' };
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return {
      ok: false,
      error: 'Image upload is not configured. Add SUPABASE_SERVICE_ROLE_KEY and create the review-uploads bucket (see utils/db/migrations/0008_review_uploads_bucket.sql).',
    };
  }

  const ext = file.name.split('.').pop()?.replace(/[^a-z0-9]/gi, '').slice(0, 8) || 'jpg';
  const path = `public/${crypto.randomUUID()}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    return { ok: false, error: 'Could not upload image. Try again or submit without a file.' };
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  if (!data.publicUrl) {
    return { ok: false, error: 'Upload succeeded but public URL is missing.' };
  }

  return { ok: true, url: data.publicUrl };
}
