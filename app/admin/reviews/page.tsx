import { count, sql } from 'drizzle-orm';
import { CheckCircle2, Clock, MessageSquare, Search, Star } from 'lucide-react';

import { moderateReviewForm } from '@/app/admin/actions';
import DatabaseError from '@/components/admin/DatabaseError';
import EmptyState from '@/components/admin/EmptyState';
import MiniStat from '@/components/admin/MiniStat';
import PageHeader from '@/components/admin/PageHeader';
import { AdminCard, Badge, ButtonLink, CardBody, CardHeader, buttonClass, field } from '@/components/admin/ui';
import { formatCount, formatDateTime, formatPercent, formatRating } from '@/lib/admin/format';
import { REVIEW_PROJECT_TYPES } from '@/lib/reviews/constants';
import { getAllReviewsForAdmin } from '@/lib/reviews/queries';
import { cn } from '@/lib/utils';
import { db } from '@/utils/db/db';
import { reviewsTable, type SelectReview } from '@/utils/db/schema';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Reviews | Admin | RactroTech', description: 'Approve client testimonials' };

const projectLabel = (value: string) => REVIEW_PROJECT_TYPES.find((t) => t.value === value)?.label ?? value;


/** 4.6 — one decimal. Unknown (failed query, or no reviews to average) → "—". */

type ReviewStats = {
  total: number;
  approved: number;
  pending: number;
  /** Mean of every review's rating; null when there are none. */
  average: number | null;
  /** Reviews per star rating, 5 → 1. */
  byRating: { rating: number; count: number }[];
};

/** Over the whole table — not the search results — so the numbers don't move with the filter. */
async function loadReviewStats(): Promise<ReviewStats | null> {
  try {
    const [[totals], rows] = await Promise.all([
      db
        .select({
          total: count(),
          approved: sql<number>`count(*) filter (where ${reviewsTable.approved})::int`,
          average: sql<number | null>`avg(${reviewsTable.rating})::float8`,
        })
        .from(reviewsTable),
      db.select({ rating: reviewsTable.rating, count: count() }).from(reviewsTable).groupBy(reviewsTable.rating),
    ]);
    const total = Number(totals?.total ?? 0);
    const approved = Number(totals?.approved ?? 0);
    const avg = totals?.average;
    const byStar = new Map(rows.map((r) => [Number(r.rating), Number(r.count)]));
    return {
      total,
      approved,
      pending: total - approved,
      average: avg === null || avg === undefined ? null : Number(avg),
      byRating: [5, 4, 3, 2, 1].map((rating) => ({ rating, count: byStar.get(rating) ?? 0 })),
    };
  } catch {
    return null;
  }
}

export default async function AdminReviewsPage({ searchParams }: { searchParams: { q?: string } }) {
  try {
    const query = searchParams.q?.trim() ?? '';
    const [reviews, stats] = await Promise.all([getAllReviewsForAdmin(searchParams.q), loadReviewStats()]);
    const pending = reviews.filter((r) => !r.approved);
    const approved = reviews.filter((r) => r.approved);
    const matching = query ? `matching “${query}”` : null;

    return (
      <div className="space-y-6">
        <PageHeader title="Client reviews" subtitle="Approve testimonials before they appear on the public site." backHref="/admin" />

        <section className="grid gap-4 lg:grid-cols-2" aria-label="Review totals">
          <div className="grid gap-3 sm:grid-cols-2">
            <MiniStat icon={<Star />} value={formatRating(stats?.average ?? null)} label="Average rating, out of 5" />
            <MiniStat icon={<MessageSquare />} value={stats ? stats.total : null} label="All reviews" />
            <MiniStat icon={<Clock />} value={stats ? stats.pending : null} label="Waiting for approval" />
            <MiniStat icon={<CheckCircle2 />} value={stats ? stats.approved : null} label="Published" />
          </div>

          <AdminCard>
            <CardHeader title="Ratings" description="Every review, pending or published" />
            <CardBody className="space-y-2.5 py-4">
              {stats === null ? (
                <p className="py-4 text-center text-[14px] text-mkt-muted">Ratings couldn’t be loaded.</p>
              ) : (
                stats.byRating.map(({ rating, count: n }) => {
                  const share = stats.total > 0 ? (n / stats.total) * 100 : 0;
                  return (
                    <div key={rating} className="flex items-center gap-3 text-[13px]">
                      <span className="w-14 shrink-0 text-mkt-muted">
                        {rating} {rating === 1 ? 'star' : 'stars'}
                      </span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-mkt-ink/[0.08]" aria-hidden>
                        <div className="h-full rounded-full bg-mkt-violet" style={{ width: `${share}%` }} />
                      </div>
                      <span className="w-10 shrink-0 text-right font-medium tabular-nums">{formatCount(n)}</span>
                      <span className="w-10 shrink-0 text-right tabular-nums text-mkt-muted">
                        {stats.total > 0 ? formatPercent(share) : '—'}
                      </span>
                    </div>
                  );
                })
              )}
            </CardBody>
          </AdminCard>
        </section>

        <form method="get" className="flex max-w-xl flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="q" className={field.label}>
              Search reviews
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mkt-muted" aria-hidden />
              <input
                id="q"
                name="q"
                defaultValue={searchParams.q ?? ''}
                placeholder="Name, company, review…"
                className={cn(field.input, 'pl-9')}
              />
            </div>
          </div>
          <button type="submit" className={buttonClass('secondary', 'md', 'h-10')}>
            Search
          </button>
          {query ? (
            <ButtonLink href="/admin/reviews" variant="ghost" className="h-10">
              Clear
            </ButtonLink>
          ) : null}
        </form>

        <AdminCard>
          <CardHeader
            title="Waiting for approval"
            description={matching ? `${formatCount(pending.length)} ${matching}` : 'Newest first'}
            action={<Badge tone={pending.length > 0 ? 'amber' : 'neutral'}>{formatCount(pending.length)}</Badge>}
          />
          {pending.length === 0 ? (
            <EmptyState
              icon={<MessageSquare />}
              title={matching ? 'No pending reviews match' : 'No pending reviews'}
              description="New submissions from /review will appear here."
            />
          ) : (
            <ul className="divide-y divide-mkt-line">
              {pending.map((r) => (
                <li key={r.id} className="px-5 py-4">
                  <ReviewRow review={r} />
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        <AdminCard>
          <CardHeader
            title="Published"
            description={matching ? `${formatCount(approved.length)} ${matching}` : 'Shown on the homepage, newest first'}
            action={<Badge tone={approved.length > 0 ? 'green' : 'neutral'}>{formatCount(approved.length)}</Badge>}
          />
          {approved.length === 0 ? (
            <EmptyState
              icon={<MessageSquare />}
              title={matching ? 'No published reviews match' : 'No published reviews yet'}
              description="Approve submissions above to show them on the homepage."
            />
          ) : (
            <ul className="divide-y divide-mkt-line">
              {approved.map((r) => (
                <li key={r.id} className="px-5 py-4">
                  <ReviewRow review={r} />
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>
    );
  } catch (e: unknown) {
    return <DatabaseError message={e instanceof Error ? e.message : 'Database error'} />;
  }
}

function Stars({ n }: { n: number }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="flex gap-0.5" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={cn('h-4 w-4', i < n ? 'fill-mkt-violet text-mkt-violet' : 'fill-mkt-ink/[0.06] text-mkt-ink/20')}
          />
        ))}
      </span>
      <span className="text-[13px] tabular-nums text-mkt-muted">
        <span className="sr-only">Rated </span>
        {formatCount(n)}/5
      </span>
    </span>
  );
}

function ReviewRow({ review }: { review: SelectReview }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <p className="text-[14px] font-semibold text-mkt-ink">{review.full_name}</p>
          <p className="text-[13px] text-mkt-muted">{review.company_name}</p>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <Stars n={review.rating} />
          <Badge>{projectLabel(review.project_type)}</Badge>
          <time
            className="text-[12px] tabular-nums text-mkt-muted"
            dateTime={review.created_at ? new Date(review.created_at).toISOString() : undefined}
          >
            {formatDateTime(review.created_at)}
          </time>
        </div>
        <p className="mt-2.5 max-w-3xl text-[14px] leading-6 text-mkt-ink/90">{review.review_text}</p>
        {review.image_url ? (
          <div className="pt-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={review.image_url}
              alt=""
              className="max-h-24 max-w-[200px] rounded-lg border border-mkt-line object-contain"
            />
          </div>
        ) : null}
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        {!review.approved ? (
          <form action={moderateReviewForm} className="inline">
            <input type="hidden" name="id" value={review.id} />
            <button type="submit" name="cmd" value="approve" className={buttonClass('primary', 'sm')}>
              Approve
            </button>
          </form>
        ) : null}
        <form action={moderateReviewForm} className="inline">
          <input type="hidden" name="id" value={review.id} />
          <button type="submit" name="cmd" value="delete" className={buttonClass('danger', 'sm')}>
            {review.approved ? 'Remove' : 'Reject'}
          </button>
        </form>
      </div>
    </div>
  );
}
