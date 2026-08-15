import { Star } from 'lucide-react';

import { Reveal, RevealGroup, RevealItem } from '@/components/marketing/reveal';
import type { MarketingReview } from '@/components/marketing/review-types';
import { cn } from '@/lib/utils';

type Props = {
  /** Featured pull quote (usually the longest review). Rendered above the grid. */
  featured?: MarketingReview | null;
  reviews: MarketingReview[];
  googleReviewUrl: string | null;
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="mb-4 flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            'h-3.5 w-3.5',
            i < rating ? 'fill-mkt-butter text-mkt-butter' : 'fill-white/10 text-white/20'
          )}
          aria-hidden
        />
      ))}
    </span>
  );
}

function AuthorRow({ review, size = 'md' }: { review: MarketingReview; size?: 'md' | 'lg' }) {
  const avatar = size === 'lg' ? 'h-11 w-11 text-[15px]' : 'h-10 w-10 text-[14px]';

  return (
    <div className="flex items-center gap-3">
      {review.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={review.imageUrl}
          alt=""
          className={cn(avatar, 'rounded-full object-cover ring-1 ring-white/15')}
        />
      ) : (
        <span
          className={cn(
            avatar,
            'flex items-center justify-center rounded-full bg-white/10 font-semibold text-white/80'
          )}
          aria-hidden
        >
          {review.author.trim().charAt(0).toUpperCase()}
        </span>
      )}
      <div className="min-w-0 text-left">
        <div className="truncate text-[15px] font-medium text-white">{review.author}</div>
        <div className="truncate text-[13px] text-white/45">{review.company}</div>
      </div>
    </div>
  );
}

/**
 * Dark testimonial wall. Reviews are real and admin-approved — see lib/reviews/queries.ts.
 * Featured quote lives here (merged from the old QuoteStrip) so social proof is one section.
 */
export function TestimonialWall({ featured, reviews, googleReviewUrl }: Props) {
  const hasReviews = Boolean(featured) || reviews.length > 0;

  return (
    <section className="bg-mkt-contrast py-20 text-white lg:py-28">
      <div className="mkt-shell">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[13px] font-medium text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-mkt-violet-soft" />
            Client reviews
          </span>
          <h2 className="mt-6 font-display text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[44px]">
            {hasReviews ? 'Some love from our customers' : 'Be the first to review us'}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-white/55">
            {hasReviews
              ? 'Every review below was submitted by a client and approved before publishing.'
              : 'We are collecting reviews from clients we have worked with. Be among the first to share your experience.'}
          </p>
        </Reveal>

        {featured ? (
          <Reveal className="mx-auto mt-12 max-w-3xl text-center">
            <span className="font-display text-[64px] leading-none text-white/15" aria-hidden>
              &ldquo;
            </span>
            <blockquote className="-mt-6">
              <p className="font-display text-[22px] font-semibold leading-[1.35] tracking-[-0.02em] text-white sm:text-[28px]">
                {featured.text}
              </p>
              <footer className="mt-7 flex justify-center">
                <AuthorRow review={featured} size="lg" />
              </footer>
            </blockquote>
          </Reveal>
        ) : null}

        {reviews.length > 0 ? (
          <RevealGroup
            as="ul"
            className={cn(
              'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 [&>li]:break-inside-avoid',
              featured ? 'mt-10' : 'mt-12'
            )}
          >
            {reviews.map((review) => (
              <RevealItem
                key={review.id}
                as="li"
                className="flex flex-col rounded-3xl border border-white/10 bg-mkt-contrast-soft p-6"
              >
                {review.rating ? <Stars rating={review.rating} /> : null}
                <p className="flex-1 text-[15px] leading-relaxed text-white/80">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="mt-6 border-t border-white/10 pt-5">
                  <AuthorRow review={review} />
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        ) : null}

        <Reveal className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <a href="/review" className="mkt-btn-onDark">
            Leave a review
          </a>
          {googleReviewUrl ? (
            <a
              href={googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mkt-btn-onDark"
            >
              Rate on Google
            </a>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
