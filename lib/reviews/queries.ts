import { desc, eq, ilike, or } from 'drizzle-orm';

import { db } from '@/utils/db/db';
import { reviewsTable, type SelectReview } from '@/utils/db/schema';

function escapeIlikePattern(raw: string): string {
  return raw.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_');
}

export async function getApprovedReviews(limit = 12): Promise<SelectReview[]> {
  return db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.approved, true))
    .orderBy(desc(reviewsTable.created_at))
    .limit(limit);
}

export async function getAllReviewsForAdmin(search?: string): Promise<SelectReview[]> {
  const q = search?.trim();
  if (!q) {
    return db.select().from(reviewsTable).orderBy(desc(reviewsTable.created_at));
  }
  const term = `%${escapeIlikePattern(q)}%`;
  return db
    .select()
    .from(reviewsTable)
    .where(
      or(
        ilike(reviewsTable.full_name, term),
        ilike(reviewsTable.company_name, term),
        ilike(reviewsTable.review_text, term),
        ilike(reviewsTable.project_type, term),
      ),
    )
    .orderBy(desc(reviewsTable.created_at));
}
