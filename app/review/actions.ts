'use server';

import { headers } from 'next/headers';

import { checkReviewRateLimit } from '@/lib/reviews/rate-limit';
import { REVIEW_PROJECT_TYPE_SET } from '@/lib/reviews/constants';
import { sanitizeName, sanitizeReviewText } from '@/lib/reviews/sanitize';
import { uploadReviewImage } from '@/lib/reviews/upload-image';
import { db } from '@/utils/db/db';
import { reviewsTable } from '@/utils/db/schema';

export type SubmitReviewResult = { ok: true } | { ok: false; error: string };

export async function submitReview(formData: FormData): Promise<SubmitReviewResult> {
  const headerList = headers();
  const ip =
    headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headerList.get('x-real-ip') ||
    'unknown';

  if (!checkReviewRateLimit(`review:${ip}`, 5, 60 * 60 * 1000)) {
    return {
      ok: false,
      error: 'Too many submissions from this network. Please try again in about an hour.',
    };
  }

  const fullName = sanitizeName(String(formData.get('fullName') ?? ''));
  const companyName = sanitizeName(String(formData.get('companyName') ?? ''), 160);
  const projectType = String(formData.get('projectType') ?? '').trim();
  const rating = Number(formData.get('rating'));
  const reviewTextRaw = String(formData.get('reviewText') ?? '');
  const permission =
    formData.get('permission') === 'on' ||
    formData.get('permission') === 'true' ||
    formData.get('permission') === '1';

  if (fullName.length < 2) {
    return { ok: false, error: 'Please enter your full name.' };
  }
  if (!companyName) {
    return { ok: false, error: 'Please enter your company or brand name.' };
  }
  if (!REVIEW_PROJECT_TYPE_SET.has(projectType)) {
    return { ok: false, error: 'Please select a project type.' };
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { ok: false, error: 'Please select a rating from 1 to 5 stars.' };
  }

  const reviewText = sanitizeReviewText(reviewTextRaw);
  if (reviewText.length < 20) {
    return { ok: false, error: 'Please write at least 20 characters in your review.' };
  }
  if (!permission) {
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
      project_type: projectType,
      rating,
      review_text: reviewText,
      image_url: imageUrl,
      permission_granted: true,
      approved: false,
    });
  } catch {
    return {
      ok: false,
      error: 'We could not save your review right now. Please try again later.',
    };
  }

  return { ok: true };
}
