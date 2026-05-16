import { RetroTestimonialsClient, type TestimonialItem } from '@/components/retro-testimonials-client';
import { getGoogleBusinessReviewUrl } from '@/lib/google-review';
import { getApprovedReviews } from '@/lib/reviews/queries';

const FALLBACK: TestimonialItem[] = [
  {
    id: 'f1',
    text: 'RactroTech transformed our business with their innovative solutions. Highly recommended!',
    author: 'John Smith',
    company: 'Tech Startup Inc',
  },
  {
    id: 'f2',
    text: 'Professional team, excellent results. They delivered beyond our expectations.',
    author: 'Lisa Anderson',
    company: 'Digital Marketing Co',
  },
  {
    id: 'f3',
    text: 'The best investment we made for our company. Incredible work and support!',
    author: 'Robert Garcia',
    company: 'E-Commerce Solutions',
  },
];

export default async function RetroTestimonials() {
  let fromDatabase = false;
  let items: TestimonialItem[] = FALLBACK;
  const googleReviewUrl = getGoogleBusinessReviewUrl();

  try {
    const rows = await getApprovedReviews(9);
    if (rows.length > 0) {
      fromDatabase = true;
      items = rows.map((r) => ({
        id: r.id,
        text: r.review_text,
        author: r.full_name,
        company: r.company_name,
        rating: r.rating,
        imageUrl: r.image_url,
      }));
    }
  } catch {
    // Table may not exist until migrations are applied.
  }

  return <RetroTestimonialsClient items={items} fromDatabase={fromDatabase} googleReviewUrl={googleReviewUrl} />;
}
