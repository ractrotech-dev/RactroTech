/**
 * Optional public URL to your Google Business “Write a review” link.
 * Set `NEXT_PUBLIC_GOOGLE_REVIEW_URL` in `.env` — see Google Business Profile → Ask for reviews.
 */
export function getGoogleBusinessReviewUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL?.trim();
  if (!raw) return null;
  try {
    const u = new URL(raw);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
    return u.toString();
  } catch {
    return null;
  }
}
