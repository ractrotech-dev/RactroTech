import { db } from "@/utils/db/db";
import { postsTable } from "@/utils/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const [post] = await db
    .select()
    .from(postsTable)
    .where(eq(postsTable.id, params.id));

  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-wider md:text-3xl">Edit Post</h1>
        <p className="mt-1 text-xs font-bold tracking-wider text-black/40">Editing: {post.title}</p>
      </div>
      <PostForm post={post as any} />
    </div>
  );
}
