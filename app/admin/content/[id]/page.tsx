import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

import PageHeader from '@/components/admin/PageHeader';
import PostForm from '@/components/admin/PostForm';
import { formatDate, formatDateTime } from '@/lib/admin/format';
import { db } from '@/utils/db/db';
import { postsTable } from '@/utils/db/schema';

export const dynamic = 'force-dynamic';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const [post] = await db.select().from(postsTable).where(eq(postsTable.id, params.id));

  if (!post) notFound();

  const facts = [
    `Created ${formatDate(post.created_at)}`,
    post.updated_at ? `Updated ${formatDateTime(post.updated_at)}` : null,
    post.published_at ? `Published ${formatDate(post.published_at)}` : null,
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <PageHeader title="Edit post" subtitle={facts.join(' · ')} backHref="/admin/content" backLabel="Content" />
      <PostForm post={post} />
    </div>
  );
}
