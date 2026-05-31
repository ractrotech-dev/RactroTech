import { db } from "@/utils/db/db";
import { postsTable, usersTable } from "@/utils/db/schema";
import { desc, sql } from "drizzle-orm";
import { FileText, Plus, Edit, Trash2, Eye, Calendar, User } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import MiniStat from "@/components/admin/MiniStat";
import StatusBadge from "@/components/admin/StatusBadge";
import EmptyState from "@/components/admin/EmptyState";
import DatabaseError from "@/components/admin/DatabaseError";
import Link from "next/link";
import { deletePostForm } from "@/app/admin/actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Content | Admin | RactroTech", description: "Manage blog posts and portfolio" };

export default async function AdminContentPage() {
  let posts: any[] = [];
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
      .leftJoin(
        usersTable,
        sql`${postsTable.author_id} = (${usersTable.id})::text`,
      )
      .orderBy(desc(postsTable.created_at));
  } catch (e: unknown) {
    return <DatabaseError message={e instanceof Error ? e.message : "Could not load posts"} />;
  }

  const totalCount = posts.length;
  const publishedCount = posts.filter(p => p.status === 'published').length;
  const draftCount = posts.filter(p => p.status === 'draft').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Content Management"
        subtitle={`${totalCount} total posts`}
        backHref="/admin"
        actions={
          <Link href="/admin/content/new" className="flex items-center gap-2 border-2 border-black bg-yellow-400 px-4 py-2 text-[10px] font-black tracking-widest transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Plus size={14} /> New Post
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <MiniStat icon={<FileText size={16} />} value={totalCount} label="Total Posts" color="bg-blue-400" />
        <MiniStat icon={<Eye size={16} />} value={publishedCount} label="Published" color="bg-emerald-400" />
        <MiniStat icon={<Calendar size={16} />} value={draftCount} label="Drafts" color="bg-yellow-400" />
      </div>

      <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="border-b-4 border-black px-5 py-3">
          <h2 className="text-xs font-black tracking-[0.2em]">All Posts</h2>
        </div>
        {posts.length === 0 ? (
          <EmptyState icon={FileText} title="No posts yet" description="Start by creating your first blog post or case study." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-black/10 bg-gray-50">
                  <th className="px-4 py-3 text-[10px] font-black tracking-wider text-black/50">Post</th>
                  <th className="px-4 py-3 text-[10px] font-black tracking-wider text-black/50">Category</th>
                  <th className="px-4 py-3 text-[10px] font-black tracking-wider text-black/50">Author</th>
                  <th className="px-4 py-3 text-[10px] font-black tracking-wider text-black/50">Status</th>
                  <th className="px-4 py-3 text-[10px] font-black tracking-wider text-black/50">Date</th>
                  <th className="px-4 py-3 text-[10px] font-black tracking-wider text-black/50 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-black/5 hover:bg-yellow-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-xs font-bold truncate max-w-[200px]">{post.title}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-black tracking-wider text-black/40">{post.category || 'Uncategorized'}</span>
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center border border-black bg-gray-100 text-[8px] font-black">{post.author_name?.charAt(0) || <User size={10} />}</div>
                      <span className="text-[10px] font-bold">{post.author_name || 'Admin'}</span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={post.status} /></td>
                    <td className="px-4 py-3 text-[10px] font-bold text-black/30">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <Link href={`/admin/content/${post.id}`} className="border-2 border-black p-1 transition-colors hover:bg-black hover:text-white">
                          <Edit size={12} />
                        </Link>
                        <form action={deletePostForm}>
                          <input type="hidden" name="id" value={post.id} />
                          <button
                            type="submit"
                            className="border-2 border-black p-1 transition-colors hover:bg-red-500 hover:text-white"
                            aria-label="Delete post"
                          >
                            <Trash2 size={12} />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
