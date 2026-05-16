import type { Metadata } from 'next';

import { ReviewPageShell } from '@/components/review/ReviewPageShell';
import { constructMetadata } from '@/lib/seo';
import { getGoogleBusinessReviewUrl } from '@/lib/google-review';

export const metadata: Metadata = constructMetadata({
  title: 'Leave a review',
  description:
    'Share feedback on your RactroTech project. Your testimonial may be featured on our website after approval.',
  canonicalUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL ?? 'https://www.ractrotech.com'}/review`,
});

export default function ReviewPage() {
  const googleReviewUrl = getGoogleBusinessReviewUrl();
  return <ReviewPageShell googleReviewUrl={googleReviewUrl} />;
}
