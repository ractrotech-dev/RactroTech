import Link from 'next/link';

import { constructMetadata, sitePath } from '@/lib/seo';
import { db } from '@/utils/db/db';
import { postsTable } from '@/utils/db/schema';
import DatabaseError from '@/components/admin/DatabaseError';
import { desc, eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export const metadata = constructMetadata({
  title: 'Blog — Web Development & SaaS Insights',
  description: 'Articles on SaaS development, MVP builds, Next.js, and shipping digital products from Ractrotech.',
  canonicalUrl: sitePath('/blog'),
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
        <div className="border-b border-mkt-line bg-mkt-lavender text-mkt-ink">
          <div className="mkt-shell max-w-3xl py-14 lg:py-16">
            <span className="mkt-eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-mkt-violet" />
              Journal
            </span>
            <h1 className="mkt-display mt-5 text-[36px] leading-[1.1] sm:text-[44px]">Blog</h1>
            <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-mkt-muted">
              SaaS development, MVP guides, and Next.js insights from the Ractrotech team.
            </p>
          </div>
        </div>

        <div className="mkt-shell max-w-3xl py-14">
          {posts.length === 0 ? (
            <p className="rounded-3xl border border-mkt-line bg-mkt-surface p-10 text-center text-[15px] text-mkt-muted text-mkt-ink">
              No published posts yet. Check back soon.
            </p>
          ) : (
            <ul className="mkt-reveal-group space-y-4">
              {posts.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group block rounded-3xl border border-mkt-line bg-mkt-surface p-6 transition-shadow duration-200 hover:shadow-[0_18px_44px_-26px_rgba(11,11,16,0.4)] sm:p-7 text-mkt-ink"
                  >
                    <p className="text-[13px] font-medium text-mkt-violet">
                      {p.category || 'Update'}
                    </p>
                    <h2 className="mkt-display mt-2 text-[21px] group-hover:underline">{p.title}</h2>
                    {p.excerpt ? (
                      <p className="mt-2.5 line-clamp-2 text-[15px] leading-relaxed text-mkt-muted">{p.excerpt}</p>
                    ) : null}
                    <p className="mt-5 text-[13px] text-mkt-muted/70">
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
