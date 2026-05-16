import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { constructMetadata } from '@/lib/seo';
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
      canonicalUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL ?? 'https://www.ractrotech.com'}/blog/${params.slug}`,
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
        <div className="border-b-4 border-black bg-yellow-400">
          <div className="mx-auto max-w-3xl px-4 py-8 md:py-10">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-black uppercase tracking-widest text-black/55">
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
            <p className="mt-6 inline-block border-2 border-black bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-black/70 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
              {post.category || 'Article'}
            </p>
            <h1 className="retro-heading mt-4 text-3xl leading-[1.15] md:text-5xl md:leading-tight">{post.title}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wider text-black/50">
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
                    className="border-2 border-black bg-white/80 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-black/70"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-10 md:py-12">
          {post.cover_image ? (
            <div className="relative mb-10 aspect-[2/1] w-full overflow-hidden border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] md:aspect-[21/9]">
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
            <p className="mb-10 border-l-4 border-black bg-card/80 py-4 pl-5 pr-4 text-base font-bold leading-snug text-journal-ink shadow-[4px_4px_0_0_rgba(0,0,0,0.08)] md:text-lg">
              {post.excerpt}
            </p>
          ) : null}

          <article className="retro-card bg-card p-6 shadow-[6px_6px_0_0_rgba(0,0,0,1)] md:p-10 md:shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
            <div className="journal-prose whitespace-pre-wrap">{post.content}</div>
          </article>

          <footer className="mt-12 flex flex-col gap-4 border-t-4 border-black/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-journal-ink">
              Thanks for reading — more on the journal.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center border-4 border-black bg-yellow-400 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5"
              >
                All posts
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center border-4 border-black bg-card px-5 py-2.5 text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5"
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
