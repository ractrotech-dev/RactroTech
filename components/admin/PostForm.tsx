'use client';

import { useState, useTransition } from 'react';
import { createPost, updatePost, deletePost } from '@/app/admin/actions';
import { useRouter } from 'next/navigation';
import { Save, Trash2, ArrowLeft, Eye, Send, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface PostFormProps {
  post?: {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string | null;
    category?: string | null;
    tags?: string | null;
    status: 'draft' | 'published' | 'archived';
  };
}

export default function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [content, setContent] = useState(post?.content || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [category, setCategory] = useState(post?.category || '');
  const [tags, setTags] = useState(post?.tags || '');
  const [status, setStatus] = useState(post?.status || 'draft');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const generateSlug = (t: string) =>
    t
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (!post) setSlug(generateSlug(e.target.value));
  };

  const persist = async (nextStatus?: typeof status) => {
    setErrorMessage(null);
    const effectiveStatus = nextStatus ?? status;
    try {
      if (post) {
        await updatePost(post.id, {
          title,
          slug,
          content,
          excerpt,
          category,
          tags,
          status: effectiveStatus,
        });
        setStatus(effectiveStatus);
      } else {
        const newPost = await createPost({ title, slug, content, excerpt, category, tags });
        if (effectiveStatus === 'published') {
          await updatePost(newPost.id, { status: 'published' });
        }
        router.push(`/admin/content/${newPost.id}`);
      }
      router.refresh();
    } catch (e: unknown) {
      setErrorMessage(e instanceof Error ? e.message : 'Something went wrong while saving.');
    }
  };

  const handleSave = () => {
    startTransition(() => persist());
  };

  const handlePublish = () => {
    startTransition(() => persist('published'));
  };

  const handleDelete = () => {
    if (!post || !confirm('Delete this post?')) return;
    startTransition(async () => {
      try {
        setErrorMessage(null);
        await deletePost(post.id);
        router.push('/admin/content');
        router.refresh();
      } catch (e: unknown) {
        setErrorMessage(e instanceof Error ? e.message : 'Could not delete post.');
      }
    });
  };

  const liveUrl = status === 'published' && slug.trim() ? `/blog/${slug.trim()}` : null;

  return (
    <div className="space-y-6">
      {errorMessage ? (
        <p className="border-2 border-red-500 bg-red-50 px-4 py-3 text-center text-xs font-bold text-red-700">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/content"
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/40 transition-colors hover:text-black"
        >
          <ArrowLeft size={14} /> Back to Content
        </Link>
        <div className="flex flex-wrap justify-end gap-2">
          {liveUrl ? (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border-2 border-black bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-yellow-50"
            >
              <ExternalLink size={14} />
              View live
            </a>
          ) : null}
          {post && (
            <button
              type="button"
              onClick={handleDelete}
              className="flex h-10 w-10 items-center justify-center border-2 border-black bg-red-100 text-red-600 transition-all hover:bg-red-600 hover:text-white"
            >
              <Trash2 size={18} />
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-2 border-2 border-black bg-yellow-400 px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
          >
            <Save size={16} />
            {isPending ? 'Saving...' : 'Save post'}
          </button>
          {status !== 'published' ? (
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPending}
              className="flex items-center gap-2 border-2 border-black bg-black px-6 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] disabled:opacity-50"
            >
              <Send size={16} />
              Publish
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Post Title"
              className="w-full border-b-4 border-black/5 pb-4 text-2xl font-black uppercase tracking-wider placeholder:text-black/10 focus:border-yellow-400 focus:outline-none"
            />
            <div className="mt-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your content here..."
                className="min-h-[400px] w-full resize-none text-sm font-semibold leading-relaxed placeholder:text-black/10 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border-4 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="mb-4 text-xs font-black uppercase tracking-[0.2em]">Post Settings</h3>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.2em] text-black/50">
                  Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full border-2 border-black px-3 py-2 text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.2em] text-black/50">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Development"
                  className="w-full border-2 border-black px-3 py-2 text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.2em] text-black/50">Tags</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="React, Next.js"
                  className="w-full border-2 border-black px-3 py-2 text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.2em] text-black/50">
                  Excerpt
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  placeholder="Brief summary..."
                  className="w-full resize-none border-2 border-black px-3 py-2 text-[11px] font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.2em] text-black/50">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as typeof status)}
                  className="w-full border-2 border-black bg-white px-3 py-2 text-[11px] font-black uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border-4 border-black bg-white p-5 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-[10px] font-bold text-black/30">Preview how the post will read on the site.</p>
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="mt-3 flex w-full items-center justify-center gap-2 border-2 border-black py-2 text-[9px] font-black uppercase tracking-widest transition-all hover:bg-black hover:text-white"
            >
              <Eye size={12} /> Preview post
            </button>
          </div>
        </div>
      </div>

      {previewOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Post preview"
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between border-b-4 border-black bg-yellow-400 px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-widest">Preview</p>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="border-2 border-black bg-white px-3 py-1 text-[10px] font-black uppercase hover:bg-black hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="p-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-black/40">{category || 'Article'}</p>
              <h2 className="mt-2 text-2xl font-black uppercase leading-tight">{title.trim() || 'Untitled'}</h2>
              {excerpt ? <p className="mt-4 border-l-4 border-black pl-3 text-sm font-semibold text-black/75">{excerpt}</p> : null}
              <div className="mt-6 whitespace-pre-wrap text-sm font-medium leading-relaxed text-black/90">{content}</div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
