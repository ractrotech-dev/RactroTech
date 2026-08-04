import { Reveal } from '@/components/marketing/reveal';
import type { MarketingReview } from '@/components/marketing/review-types';

/**
 * Full-width pull quote. Renders nothing when there are no approved reviews yet —
 * the testimonial wall further down owns the "be the first to review" empty state.
 */
export function QuoteStrip({ review }: { review: MarketingReview | null }) {
  if (!review) return null;

  return (
    <section className="bg-white py-20 lg:py-24">
      <Reveal className="mkt-shell max-w-4xl text-center">
        <span className="font-display text-[64px] leading-none text-mkt-violet/25" aria-hidden>
          &ldquo;
        </span>
        <blockquote className="-mt-6">
          <p className="mkt-display text-[24px] leading-[1.35] sm:text-[32px]">{review.text}</p>
          <footer className="mt-7 flex items-center justify-center gap-3">
            {review.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={review.imageUrl}
                alt=""
                className="h-11 w-11 rounded-full object-cover ring-1 ring-mkt-line"
              />
            ) : (
              <span
                className="flex h-11 w-11 items-center justify-center rounded-full bg-mkt-lavender text-[15px] font-semibold text-mkt-violet"
                aria-hidden
              >
                {review.author.trim().charAt(0).toUpperCase()}
              </span>
            )}
            <div className="text-left">
              <div className="text-[15px] font-semibold text-mkt-ink">{review.author}</div>
              <div className="text-[14px] text-mkt-muted">{review.company}</div>
            </div>
          </footer>
        </blockquote>
      </Reveal>
    </section>
  );
}
