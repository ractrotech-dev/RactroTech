import { desc, sql } from 'drizzle-orm';
import { Archive, Eye, FileText, PencilLine, Plus, Trash2 } from 'lucide-react';

import { deletePostForm } from '@/app/admin/actions';
import DatabaseError from '@/components/admin/DatabaseError';
import EmptyState from '@/components/admin/EmptyState';
import MiniStat from '@/components/admin/MiniStat';
import PageHeader from '@/components/admin/PageHeader';
import StatusBadge from '@/components/admin/StatusBadge';
import { AdminCard, ButtonLink, CardHeader, DataTable, buttonClass, table } from '@/components/admin/ui';
import { formatCount, formatDate } from '@/lib/admin/format';
import { db } from '@/utils/db/db';
import { postsTable, usersTable } from '@/utils/db/schema';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Content | Admin | RactroTech', description: 'Manage blog posts and portfolio' };

export default async function AdminContentPage() {
  let posts: {
    id: string;
    title: string;
    status: 'draft' | 'published' | 'archived';
    category: string | null;
    created_at: Date;
    author_name: string | null;
  }[];
  try {
    posts = await db
      .select({
        id: postsTable.id,
        title: postsTable.title,
        status: postsTable.status,
        category: postsTable.category,
        created_at: postsTable.created_at,
        author_name: usersTable.name,
      })
      .from(postsTable)
      .leftJoin(usersTable, sql`${postsTable.author_id} = (${usersTable.id})::text`)
      .orderBy(desc(postsTable.created_at));
  } catch (e: unknown) {
    return <DatabaseError message={e instanceof Error ? e.message : 'Could not load posts'} />;
  }

  // The query has no limit, so these cover every post.
  const totalCount = posts.length;
  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;
  const archivedCount = posts.filter((p) => p.status === 'archived').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Content"
        subtitle={`${formatCount(totalCount)} ${totalCount === 1 ? 'post' : 'posts'} — blog articles and case studies.`}
        backHref="/admin"
        actions={
          <ButtonLink href="/admin/content/new" variant="primary">
            <Plus aria-hidden /> New post
          </ButtonLink>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Post counts">
        <MiniStat icon={<FileText />} value={totalCount} label="All posts" />
        <MiniStat icon={<Eye />} value={publishedCount} label="Published" />
        <MiniStat icon={<PencilLine />} value={draftCount} label="Drafts" />
        <MiniStat icon={<Archive />} value={archivedCount} label="Archived" />
      </section>

      <AdminCard>
        <CardHeader title="All posts" description="Newest first" />
        {posts.length === 0 ? (
          <EmptyState
            icon={<FileText />}
            title="No posts yet"
            description="Start by creating your first blog post or case study."
            action={
              <ButtonLink href="/admin/content/new" variant="primary">
                <Plus aria-hidden /> New post
              </ButtonLink>
            }
          />
        ) : (
          <DataTable>
            <thead>
              <tr className={table.headRow}>
                <th className={table.th}>Post</th>
                <th className={table.th}>Category</th>
                <th className={table.th}>Author</th>
                <th className={table.th}>Status</th>
                <th className={table.th}>Created</th>
                <th className={`${table.th} text-right`}>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className={table.row}>
                  <td className={table.td}>
                    <p className="max-w-[320px] truncate font-medium" title={post.title}>
                      {post.title}
                    </p>
                  </td>
                  <td className={`${table.td} ${table.muted}`}>{post.category || 'Uncategorized'}</td>
                  <td className={table.td}>
                    {post.author_name ? (
                      <span className="flex items-center gap-2">
                        <span
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mkt-lavender text-[12px] font-semibold text-mkt-violet"
                          aria-hidden
                        >
                          {post.author_name.charAt(0).toUpperCase()}
                        </span>
                        <span className="whitespace-nowrap">{post.author_name}</span>
                      </span>
                    ) : (
                      <span className={table.muted}>—</span>
                    )}
                  </td>
                  <td className={table.td}>
                    <StatusBadge status={post.status} />
                  </td>
                  <td className={`${table.td} whitespace-nowrap tabular-nums ${table.muted}`}>
                    <time dateTime={new Date(post.created_at).toISOString()}>{formatDate(post.created_at)}</time>
                  </td>
                  <td className={table.td}>
                    <div className="flex justify-end gap-1">
                      <ButtonLink href={`/admin/content/${post.id}`} variant="secondary" size="sm">
                        <PencilLine aria-hidden /> Edit
                      </ButtonLink>
                      <form action={deletePostForm}>
                        <input type="hidden" name="id" value={post.id} />
                        <button
                          type="submit"
                          className={buttonClass('ghost', 'sm', 'w-8 px-0')}
                          aria-label={`Delete post “${post.title}”`}
                          title="Delete post"
                        >
                          <Trash2 aria-hidden />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        )}
      </AdminCard>
    </div>
  );
}
