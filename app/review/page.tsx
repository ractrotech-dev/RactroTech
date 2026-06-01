import type { Metadata } from 'next';

import { ReviewPageShell } from '@/components/review/ReviewPageShell';
import { constructMetadata, sitePath } from '@/lib/seo';
import { getGoogleBusinessReviewUrl } from '@/lib/google-review';

export const metadata: Metadata = constructMetadata({
  title: 'Leave a review',
  description:
    'Share feedback on your RactroTech project. Your testimonial may be featured on our website after approval.',
  canonicalUrl: sitePath('/review'),
});

export default function ReviewPage() {
  const googleReviewUrl = getGoogleBusinessReviewUrl();
  return <ReviewPageShell googleReviewUrl={googleReviewUrl} />;
}
