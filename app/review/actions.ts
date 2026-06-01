'use server';

import 'server-only';

import { getClientIp } from '@/lib/auth/client-ip';
import { logSecurityEvent } from '@/lib/security/logger';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { sanitizeName, sanitizeReviewText } from '@/lib/reviews/sanitize';
import { uploadReviewImage } from '@/lib/reviews/upload-image';
import { reviewSubmitSchema } from '@/lib/validation/schemas';
import { db } from '@/utils/db/db';
import { reviewsTable } from '@/utils/db/schema';

export type SubmitReviewResult = { ok: true } | { ok: false; error: string };

export async function submitReview(formData: FormData): Promise<SubmitReviewResult> {
  const ip = getClientIp();

  if (!checkRateLimit(`review:${ip}`, 5, 60 * 60 * 1000)) {
    logSecurityEvent({ type: 'rate_limit', ip, path: '/review', action: 'submitReview' });
    return {
      ok: false,
      error: 'Too many submissions from this network. Please try again in about an hour.',
    };
  }

  const permission =
    formData.get('permission') === 'on' ||
    formData.get('permission') === 'true' ||
    formData.get('permission') === '1';

  const raw = {
    fullName: String(formData.get('fullName') ?? ''),
    companyName: String(formData.get('companyName') ?? ''),
    projectType: String(formData.get('projectType') ?? '').trim(),
    rating: String(formData.get('rating') ?? ''),
    reviewText: String(formData.get('reviewText') ?? ''),
    permission,
  };

  const parsed = reviewSubmitSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid review data.' };
  }

  const fullName = sanitizeName(parsed.data.fullName);
  const companyName = sanitizeName(parsed.data.companyName, 160);
  const reviewText = sanitizeReviewText(parsed.data.reviewText);

  if (!parsed.data.permission) {
    return { ok: false, error: 'Please confirm we may feature your testimonial on our site.' };
  }

  let imageUrl: string | null = null;
  const image = formData.get('image');
  if (image instanceof File && image.size > 0) {
    const uploaded = await uploadReviewImage(image);
    if (!uploaded.ok) return uploaded;
    imageUrl = uploaded.url;
  }

  try {
    await db.insert(reviewsTable).values({
      full_name: fullName,
      company_name: companyName,
      project_type: parsed.data.projectType,
      rating: parsed.data.rating,
      review_text: reviewText,
      image_url: imageUrl,
      permission_granted: true,
      approved: false,
    });
  } catch (error) {
    logSecurityEvent({
      type: 'api_error',
      path: '/review',
      action: 'submitReview',
      message: error instanceof Error ? error.message : 'insert_failed',
      ip,
    });
    return {
      ok: false,
      error: 'We could not save your review right now. Please try again later.',
    };
  }

  return { ok: true };
}
