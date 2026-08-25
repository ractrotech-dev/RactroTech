import { RetroTestimonialsClient, type TestimonialItem } from '@/components/retro-testimonials-client';
import { getGoogleBusinessReviewUrl } from '@/lib/google-review';
import { getApprovedReviews } from '@/lib/reviews/queries';

export default async function RetroTestimonials() {
  let items: TestimonialItem[] = [];
  const googleReviewUrl = getGoogleBusinessReviewUrl();

  try {
    const rows = await getApprovedReviews(9);
    if (rows.length > 0) {
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

  if (items.length === 0) {
    return (
      <section className="border-b-4 border-black bg-yellow-400 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="retro-heading mb-4 text-4xl">Client Reviews</h2>
          <p className="mb-6 font-semibold text-black/80">
            We are collecting reviews from clients we have worked with. Be among the first to share
            your experience.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/review"
              className="retro-button border-black bg-black text-yellow-400 hover:bg-black/90"
            >
              Leave a Review
            </a>
            {googleReviewUrl ? (
              <a
                href={googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="retro-button"
              >
                Rate on Google
              </a>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <RetroTestimonialsClient
      items={items}
      fromDatabase={true}
      googleReviewUrl={googleReviewUrl}
    />
  );
}
