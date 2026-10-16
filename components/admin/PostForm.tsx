'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, Eye, Save, Send, Trash2, X } from 'lucide-react';

import { createPost, deletePost, updatePost } from '@/app/admin/actions';
import { AdminCard, CardBody, CardHeader, Notice, buttonClass, field } from '@/components/admin/ui';
import { cn } from '@/lib/utils';

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
  const canPublish = status !== 'published';

  return (
    <div className="space-y-6">
      {errorMessage ? (
        <Notice tone="red" title="That didn’t work">
          {errorMessage}
        </Notice>
      ) : null}

      <div className="flex flex-wrap items-center justify-end gap-3">
        <div className="flex flex-wrap justify-end gap-2">
          {liveUrl ? (
            <a href={liveUrl} target="_blank" rel="noopener noreferrer" className={buttonClass('ghost')}>
              <ExternalLink aria-hidden /> View live
            </a>
          ) : null}
          <button type="button" onClick={() => setPreviewOpen(true)} className={buttonClass('secondary')}>
            <Eye aria-hidden /> Preview
          </button>
          {post ? (
            <button type="button" onClick={handleDelete} disabled={isPending} className={buttonClass('danger')}>
              <Trash2 aria-hidden /> Delete
            </button>
          ) : null}
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className={buttonClass(canPublish ? 'secondary' : 'primary')}
          >
            <Save aria-hidden />
            {isPending ? 'Saving…' : 'Save post'}
          </button>
          {canPublish ? (
            <button type="button" onClick={handlePublish} disabled={isPending} className={buttonClass('primary')}>
              <Send aria-hidden /> Publish
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <AdminCard>
          <CardBody className="space-y-5">
            <div>
              <label htmlFor="post-title" className={field.label}>
                Title
              </label>
              <input
                id="post-title"
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="Post title"
                className={cn(field.input, 'h-11 text-[16px] font-medium')}
              />
            </div>
            <div>
              <label htmlFor="post-content" className={field.label}>
                Content
              </label>
              <textarea
                id="post-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your content here…"
                className={cn(field.textarea, 'min-h-[440px] resize-y')}
              />
            </div>
          </CardBody>
        </AdminCard>

        <AdminCard as="aside" className="h-fit">
          <CardHeader title="Post settings" description="How the post is filed and found." />
          <CardBody className="space-y-4">
            <div>
              <label htmlFor="post-status" className={field.label}>
                Status
              </label>
              <select
                id="post-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                className={field.input}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label htmlFor="post-slug" className={field.label}>
                Slug
              </label>
              <input
                id="post-slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className={field.input}
              />
              <p className={cn(field.hint, 'truncate')}>/blog/{slug.trim() || '…'}</p>
            </div>
            <div>
              <label htmlFor="post-category" className={field.label}>
                Category
              </label>
              <input
                id="post-category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Development"
                className={field.input}
              />
            </div>
            <div>
              <label htmlFor="post-tags" className={field.label}>
                Tags
              </label>
              <input
                id="post-tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="React, Next.js"
                className={field.input}
              />
              <p className={field.hint}>Separate tags with commas.</p>
            </div>
            <div>
              <label htmlFor="post-excerpt" className={field.label}>
                Excerpt
              </label>
              <textarea
                id="post-excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                placeholder="A one or two sentence summary"
                className={cn(field.textarea, 'resize-none')}
              />
            </div>
          </CardBody>
        </AdminCard>
      </div>

      {previewOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-mkt-contrast/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Post preview"
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-mkt-line bg-mkt-surface text-mkt-ink shadow-[0_24px_48px_-24px_rgb(11_11_16/0.35)]">
            <div className="sticky top-0 flex items-center justify-between border-b border-mkt-line bg-mkt-surface px-5 py-3">
              <p className="text-[13px] font-medium text-mkt-muted">Preview</p>
              <button type="button" onClick={() => setPreviewOpen(false)} className={buttonClass('ghost', 'sm')}>
                <X aria-hidden /> Close
              </button>
            </div>
            <article className="px-6 py-6 sm:px-8">
              <p className="text-[13px] font-medium text-mkt-violet">{category || 'Article'}</p>
              <h2 className="mt-2 font-display text-[26px] font-semibold leading-tight tracking-[-0.02em]">
                {title.trim() || 'Untitled'}
              </h2>
              {excerpt ? (
                <p className="mt-4 border-l-2 border-mkt-line pl-3 text-[15px] leading-7 text-mkt-muted">{excerpt}</p>
              ) : null}
              <div className="mt-6 whitespace-pre-wrap text-[15px] leading-7 text-mkt-ink/90">{content}</div>
            </article>
          </div>
        </div>
      ) : null}
    </div>
  );
}
