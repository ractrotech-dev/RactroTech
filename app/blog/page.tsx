import Link from 'next/link';

import { constructMetadata } from '@/lib/seo';
import { db } from '@/utils/db/db';
import { postsTable } from '@/utils/db/schema';
import DatabaseError from '@/components/admin/DatabaseError';
import { desc, eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export const metadata = constructMetadata({
  title: 'Journal',
  description: 'Articles and updates from RactroTech.',
  canonicalUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL ?? 'https://www.ractrotech.com'}/blog`,
});

export default async function BlogIndexPage() {
  try {
    const posts = await db
      .select({
        id: postsTable.id,
        title: postsTable.title,
        slug: postsTable.slug,
        excerpt: postsTable.excerpt,
        category: postsTable.category,
        published_at: postsTable.published_at,
        created_at: postsTable.created_at,
      })
      .from(postsTable)
      .where(eq(postsTable.status, 'published'))
      .orderBy(desc(postsTable.published_at), desc(postsTable.created_at));

    return (
      <main className="flex-1 pb-16">
        <div className="border-b-4 border-black bg-yellow-400">
          <div className="mx-auto max-w-3xl px-4 py-12">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-black/50">RactroTech</p>
            <h1 className="retro-heading mt-2 text-4xl md:text-5xl">Journal</h1>
            <p className="mt-3 text-sm font-bold text-black/60">Published posts from the team.</p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-12">
          {posts.length === 0 ? (
            <p className="retro-card border-4 border-black bg-card p-8 text-center text-sm font-bold text-journal-ink">
              No published posts yet. Check back soon.
            </p>
          ) : (
            <ul className="space-y-6">
              {posts.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group block border-4 border-black bg-card p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5"
                  >
                    <p className="text-[10px] font-black uppercase tracking-widest text-black/40">
                      {p.category || 'Update'}
                    </p>
                    <h2 className="mt-2 text-xl font-black uppercase tracking-tight group-hover:underline">{p.title}</h2>
                    {p.excerpt ? (
                      <p className="mt-2 line-clamp-2 text-sm font-semibold text-black/60">{p.excerpt}</p>
                    ) : null}
                    <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-black/35">
                      {p.published_at
                        ? new Date(p.published_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : null}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    );
  } catch (e: unknown) {
    return <DatabaseError message={e instanceof Error ? e.message : 'Could not load posts'} />;
  }
}
