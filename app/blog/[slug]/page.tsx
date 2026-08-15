import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { constructMetadata, generateBlogPostingSchema, sitePath } from '@/lib/seo';
import { db } from '@/utils/db/db';
import { postsTable } from '@/utils/db/schema';
import DatabaseError from '@/components/admin/DatabaseError';
import { and, eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

type Props = { params: { slug: string } };

function readingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export async function generateMetadata({ params }: Props) {
  try {
    const [post] = await db
      .select({ title: postsTable.title, excerpt: postsTable.excerpt })
      .from(postsTable)
      .where(and(eq(postsTable.slug, params.slug), eq(postsTable.status, 'published')));

    if (!post) return constructMetadata({ title: 'Post not found', noIndex: true });

    return constructMetadata({
      title: post.title,
      description: post.excerpt || post.title,
      canonicalUrl: sitePath(`/blog/${params.slug}`),
    });
  } catch {
    return constructMetadata({ title: 'Journal', noIndex: true });
  }
}

export default async function BlogPostPage({ params }: Props) {
  try {
    const [post] = await db
      .select()
      .from(postsTable)
      .where(and(eq(postsTable.slug, params.slug), eq(postsTable.status, 'published')));

    if (!post) notFound();

    const blogSchema = generateBlogPostingSchema({
      title: post.title,
      excerpt: post.excerpt,
      slug: post.slug,
      published_at: post.published_at,
      cover_image: post.cover_image,
    });

    const tagList =
      post.tags
        ?.split(',')
        .map((t) => t.trim())
        .filter(Boolean) ?? [];
    const readMins = readingMinutes(post.content);
    const dateLabel = post.published_at
      ? new Date(post.published_at).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : null;

    return (
      <main className="flex-1 pb-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
        />
        <div className="border-b border-mkt-line bg-mkt-lavender">
          <div className="mkt-shell max-w-3xl py-12 lg:py-14">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] font-medium text-mkt-muted">
              <Link href="/blog" className="hover:underline">
                ← Journal
              </Link>
              <span aria-hidden className="hidden sm:inline">
                ·
              </span>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </div>
            <p className="mt-6 inline-block rounded-full bg-mkt-surface px-3 py-1 text-[13px] font-medium text-mkt-violet">
              {post.category || 'Article'}
            </p>
            <h1 className="mkt-display mt-4 text-[32px] leading-[1.12] sm:text-[42px]">{post.title}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-[14px] text-mkt-muted">
              {dateLabel && post.published_at ? (
                <time dateTime={new Date(post.published_at).toISOString()}>{dateLabel}</time>
              ) : null}
              {dateLabel ? <span aria-hidden>·</span> : null}
              <span>{readMins} min read</span>
            </div>
            {tagList.length > 0 ? (
              <ul className="mt-5 flex flex-wrap gap-2">
                {tagList.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-mkt-surface px-2.5 py-1 text-[13px] text-mkt-muted"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="mkt-shell max-w-3xl py-12 lg:py-14">
          {post.cover_image ? (
            <div className="relative mb-10 aspect-[2/1] w-full overflow-hidden rounded-3xl border border-mkt-line md:aspect-[21/9]">
              <Image
                src={post.cover_image}
                alt={`Cover image for ${post.title}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 896px"
                priority
                unoptimized
              />
            </div>
          ) : null}

          {post.excerpt ? (
            <p className="mb-10 border-l-2 border-mkt-violet py-1 pl-5 text-[18px] leading-relaxed text-mkt-ink">
              {post.excerpt}
            </p>
          ) : null}

          <article className="whitespace-pre-wrap text-[17px] leading-[1.75] text-mkt-ink/85">
            {post.content}
          </article>

          <footer className="mt-14 flex flex-col gap-4 border-t border-mkt-line pt-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[15px] text-mkt-muted">Thanks for reading — more on the journal.</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/blog"
                className="mkt-btn-primary"
              >
                All posts
              </Link>
              <Link
                href="/"
                className="mkt-btn-ghost"
              >
                RactroTech
              </Link>
            </div>
          </footer>
        </div>
      </main>
    );
  } catch (e: unknown) {
    return <DatabaseError message={e instanceof Error ? e.message : 'Could not load post'} />;
  }
}
