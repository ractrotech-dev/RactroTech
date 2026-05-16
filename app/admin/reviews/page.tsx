import { moderateReviewForm } from '@/app/admin/actions';
import PageHeader from '@/components/admin/PageHeader';
import EmptyState from '@/components/admin/EmptyState';
import DatabaseError from '@/components/admin/DatabaseError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { REVIEW_PROJECT_TYPES } from '@/lib/reviews/constants';
import { getAllReviewsForAdmin } from '@/lib/reviews/queries';
import { MessageSquare, Star } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Reviews | Admin | RactroTech', description: 'Approve client testimonials' };

const projectLabel = (value: string) =>
  REVIEW_PROJECT_TYPES.find((t) => t.value === value)?.label ?? value;

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  try {
    const reviews = await getAllReviewsForAdmin(searchParams.q);
    const pending = reviews.filter((r) => !r.approved);
    const approved = reviews.filter((r) => r.approved);

    return (
      <div className="space-y-8">
        <PageHeader title="Client reviews" subtitle="Approve testimonials for the public site" backHref="/admin" />

        <form method="get" className="flex max-w-md flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1">
            <label htmlFor="q" className="text-[10px] font-black uppercase tracking-widest text-black/40">
              Search
            </label>
            <Input
              id="q"
              name="q"
              defaultValue={searchParams.q ?? ''}
              placeholder="Name, company, review…"
              className="border-2 border-black bg-white text-sm font-semibold"
            />
          </div>
          <Button type="submit" variant="outline" className="border-2 border-black bg-yellow-400 font-black uppercase">
            Filter
          </Button>
        </form>

        <section className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-black/50">Pending ({pending.length})</h2>
          <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {pending.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="No pending reviews"
                description="New submissions from /review will appear here."
              />
            ) : (
              <ul className="divide-y-2 divide-black/10">
                {pending.map((r) => (
                  <li key={r.id} className="p-4 sm:p-5">
                    <ReviewRow review={r} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-black/50">Published ({approved.length})</h2>
          <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {approved.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="No published reviews yet"
                description="Approve submissions above to show them on the homepage."
              />
            ) : (
              <ul className="divide-y-2 divide-black/10">
                {approved.map((r) => (
                  <li key={r.id} className="p-4 sm:p-5">
                    <ReviewRow review={r} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    );
  } catch (e: unknown) {
    return <DatabaseError message={e instanceof Error ? e.message : 'Database error'} />;
  }
}

function Stars({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${n} of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < n ? 'fill-yellow-400 text-yellow-500' : 'fill-black/5 text-black/20'}`}
        />
      ))}
    </span>
  );
}

function ReviewRow({
  review,
}: {
  review: {
    id: string;
    full_name: string;
    company_name: string;
    project_type: string;
    rating: number;
    review_text: string;
    image_url: string | null;
    created_at: Date | null;
    approved: boolean;
  };
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-black uppercase">{review.full_name}</p>
          <span className="border-2 border-black bg-yellow-400 px-2 py-0.5 text-[9px] font-black uppercase">
            {projectLabel(review.project_type)}
          </span>
          <Stars n={review.rating} />
        </div>
        <p className="text-xs font-bold text-black/50">{review.company_name}</p>
        <p className="text-sm font-medium leading-relaxed text-black/80">{review.review_text}</p>
        <p className="text-[10px] font-bold text-black/30">
          {review.created_at
            ? new Date(review.created_at).toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
              })
            : '—'}
        </p>
        {review.image_url ? (
          <div className="pt-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={review.image_url}
              alt=""
              className="max-h-24 max-w-[200px] rounded border-2 border-black object-contain"
            />
          </div>
        ) : null}
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        {!review.approved ? (
          <form action={moderateReviewForm} className="inline">
            <input type="hidden" name="id" value={review.id} />
            <Button type="submit" name="cmd" value="approve" className="border-2 border-black bg-emerald-400 font-black uppercase">
              Approve
            </Button>
          </form>
        ) : null}
        <form action={moderateReviewForm} className="inline">
          <input type="hidden" name="id" value={review.id} />
          <Button
            type="submit"
            name="cmd"
            value="delete"
            variant="destructive"
            className="border-2 border-black font-black uppercase"
          >
            {review.approved ? 'Remove' : 'Reject'}
          </Button>
        </form>
      </div>
    </div>
  );
}
