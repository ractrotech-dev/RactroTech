import { Star } from 'lucide-react';

import { Marquee } from '@/components/marketing/marquee';
import { Reveal, RevealGroup, RevealItem } from '@/components/marketing/reveal';
import type { MarketingReview } from '@/components/marketing/review-types';
import { QuoteCard, QuoteMark, ToneCard, TONE_MUTED } from '@/components/marketing/tone-card';
import { toneFor } from '@/lib/marketing/tones';
import { cn } from '@/lib/utils';

type Props = {
  /** Featured pull quote (usually the longest review). Rendered above the wall. */
  featured?: MarketingReview | null;
  reviews: MarketingReview[];
  googleReviewUrl: string | null;
};

/**
 * Below this many cards a marquee row is shorter than the viewport, so the loop shows a
 * visible gap and the same two cards cycle past. A static grid reads better until then.
 */
const MIN_FOR_MARQUEE = 5;

/**
 * Cards per marquee row, padded up to this by cycling the row's own reviews.
 *
 * A row scrolls by translating one full copy of its children off to the left. If that copy
 * is narrower than the viewport, the tail end of the loop leaves bare canvas on the right
 * for part of every cycle. Six cards at ~376px each covers past 2200px of viewport, which
 * clears every common desktop width. Padding is visual repetition only — the marquee is
 * already a repeating strip — so it adds no claim of extra reviews.
 */
const CARDS_PER_ROW = 6;

/** Cycles `items` up to `min` length. Returns the original when it is already long enough. */
function padRow<T>(items: T[], min: number): T[] {
  if (items.length === 0 || items.length >= min) return items;
  return Array.from({ length: min }, (_, i) => items[i % items.length]);
}

/** Star row on the section background rather than on a tone card. */
function PlainStars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            'h-4 w-4 fill-white text-white',
            i < Math.round(rating) ? 'opacity-100' : 'opacity-30'
          )}
        />
      ))}
    </span>
  );
}

/**
 * Aggregate rating strip. Every figure is derived from the approved reviews actually being
 * rendered below it — nothing here is a stated number, so it cannot drift out of date.
 */
function RatingStrip({ rated }: { rated: MarketingReview[] }) {
  const average = rated.reduce((sum, r) => sum + (r.rating ?? 0), 0) / rated.length;

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
      <div className="flex items-center gap-2.5">
        <PlainStars rating={average} />
        <span className="text-[15px] font-semibold text-white">{average.toFixed(1)}</span>
      </div>
      <span className="h-4 w-px bg-white/25" aria-hidden />
      <span className="text-[15px] text-white/70">
        {rated.length} {rated.length === 1 ? 'client review' : 'client reviews'}, all verified
      </span>
    </div>
  );
}

/** Fixed-width card for the scrolling rows — marquee children cannot be fluid. */
function WallCard({ review, index }: { review: MarketingReview; index: number }) {
  return (
    <QuoteCard
      tone={toneFor(index)}
      quote={review.text}
      author={review.author}
      meta={review.company}
      rating={review.rating}
      avatarUrl={review.imageUrl}
      className="mr-4 h-full w-[290px] sm:w-[360px]"
    />
  );
}

/**
 * Colourful review wall. Reviews are real and admin-approved — see lib/reviews/queries.ts.
 * The featured quote lives here too (merged from the old QuoteStrip) so social proof is one
 * section.
 *
 * Each card is painted in a different pastel with its text inked in a deep shade of a
 * related hue — see components/marketing/tone-card.tsx. Tones come from `toneFor(index)`
 * rather than the review row, so the colour walk stays even however many reviews are
 * approved, and a given card keeps its colour between renders.
 */
export function TestimonialWall({ featured, reviews, googleReviewUrl }: Props) {
  const hasReviews = Boolean(featured) || reviews.length > 0;
  const rated = [...(featured ? [featured] : []), ...reviews].filter((r) => r.rating);
  const useMarquee = reviews.length >= MIN_FOR_MARQUEE;

  // Alternating split, so the two rows carry a similar mix rather than one holding every
  // long quote. Indices are kept for tone assignment.
  const indexed = reviews.map((review, index) => ({ review, index }));
  const rowA = padRow(indexed.filter((_, i) => i % 2 === 0), CARDS_PER_ROW);
  const rowB = padRow(indexed.filter((_, i) => i % 2 === 1), CARDS_PER_ROW);

  return (
    <section className="overflow-hidden py-20 lg:py-28">
      <div className="mkt-shell">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="mkt-eyebrow-onDark">
            <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
            Client reviews
          </span>
          <h2 className="mkt-display mt-6 text-[32px] leading-[1.1] text-white sm:text-[44px]">
            {hasReviews ? 'Some love from our customers' : 'Be the first to review us'}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-white/70">
            {hasReviews
              ? 'Every review below was submitted by a client and approved before publishing.'
              : 'We are collecting reviews from clients we have worked with. Be among the first to share your experience.'}
          </p>
          {rated.length > 0 ? <RatingStrip rated={rated} /> : null}
        </Reveal>
      </div>

      {featured ? (
        <div className="mkt-shell">
          <Reveal>
            <ToneCard tone="butter" className="mx-auto mt-12 max-w-3xl p-8 text-center sm:p-10">
              <blockquote>
                <p className="mkt-display text-[22px] font-normal leading-[1.35] text-[rgb(var(--tone-ink))] sm:text-[28px]">
                  <QuoteMark className="translate-y-[5px]" />
                  {featured.text}
                </p>
                <footer className="mt-7">
                  <div className="text-[15px] font-semibold">{featured.author}</div>
                  {featured.company ? (
                    <div className={cn('mt-0.5 text-[14px]', TONE_MUTED)}>{featured.company}</div>
                  ) : null}
                </footer>
              </blockquote>
            </ToneCard>
          </Reveal>
        </div>
      ) : null}

      {reviews.length > 0 ? (
        useMarquee ? (
          // Full-bleed and counter-scrolling: the wall runs past the shell's edges so it
          // reads as a moving field of colour rather than a boxed-in carousel.
          <Reveal className="mt-10 flex flex-col gap-4">
            <Marquee align="stretch" durationSeconds={64}>
              {rowA.map(({ review, index }, i) => (
                <WallCard key={`${review.id}-${i}`} review={review} index={index} />
              ))}
            </Marquee>
            <Marquee align="stretch" durationSeconds={72} reverse>
              {rowB.map(({ review, index }, i) => (
                <WallCard key={`${review.id}-${i}`} review={review} index={index} />
              ))}
            </Marquee>
          </Reveal>
        ) : (
          <div className="mkt-shell">
            <RevealGroup as="ul" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review, index) => (
                <RevealItem key={review.id} as="li" className="h-full">
                  <QuoteCard
                    tone={toneFor(index)}
                    quote={review.text}
                    author={review.author}
                    meta={review.company}
                    rating={review.rating}
                    avatarUrl={review.imageUrl}
                    className="h-full"
                  />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        )
      ) : null}

      <div className="mkt-shell">
        <Reveal className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <a href="/review" className="mkt-btn bg-white px-6 py-3 text-mkt-ink hover:bg-white/90">
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
