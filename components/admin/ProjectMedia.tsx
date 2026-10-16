'use client';

import { useState, useTransition } from 'react';
import { ExternalLink, File, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';

import { addMediaAsset, deleteMediaAsset } from '@/app/admin/actions';
import { AdminCard, CardHeader, buttonClass, field } from '@/components/admin/ui';
import { formatCount, formatDate, formatFileSize } from '@/lib/admin/format';
import { cn } from '@/lib/utils';

interface ProjectAsset {
  id: string;
  name: string;
  url: string;
  size: number | null;
  type: string | null;
  created_at: Date | string;
}

interface ProjectMediaProps {
  projectId: string;
  assets: ProjectAsset[];
  /** Set when the assets query failed, so the card says so instead of "No files". */
  error?: string | null;
}

/** Bytes → "820 B", "48.2 KB", "3.1 MB"; unknown → "—". */

const MIME_BY_EXTENSION: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  avif: 'image/avif',
  svg: 'image/svg+xml',
  pdf: 'application/pdf',
  mp4: 'video/mp4',
  webm: 'video/webm',
  mp3: 'audio/mpeg',
};

/** Best guess from the URL's extension; unknown stays unknown rather than "image/png". */
function guessMimeType(url: string): string | undefined {
  const path = url.split(/[?#]/)[0] ?? '';
  const ext = path.includes('.') ? path.slice(path.lastIndexOf('.') + 1).toLowerCase() : '';
  return MIME_BY_EXTENSION[ext];
}

export default function ProjectMedia({ projectId, assets, error }: ProjectMediaProps) {
  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);

  const handleUpload = () => {
    // Not a real upload yet: asks for a name and URL, then records them via the server action.
    const name = prompt('File name:');
    const url = prompt('File URL:');
    if (!name || !url) return;
    setActionError(null);

    startTransition(async () => {
      try {
        // No size is sent: we do not know it, and a made-up one would be shown as fact.
        await addMediaAsset({ name, url, project_id: projectId, type: guessMimeType(url) });
      } catch (err) {
        setActionError(err instanceof Error ? err.message : 'Could not add the file.');
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this file?')) return;
    setActionError(null);
    startTransition(async () => {
      try {
        await deleteMediaAsset(id);
      } catch (err) {
        setActionError(err instanceof Error ? err.message : 'Could not delete the file.');
      }
    });
  };

  const description = error ? 'Couldn’t load files' : assets.length === 1 ? '1 file' : `${formatCount(assets.length)} files`;

  return (
    <AdminCard>
      <CardHeader
        title="Files"
        description={description}
        action={
          <button type="button" onClick={handleUpload} disabled={isPending} className={buttonClass('secondary', 'sm')}>
            <Plus aria-hidden /> Add file
          </button>
        }
      />

      {actionError ? (
        <p role="alert" className={cn(field.error, 'mt-0 border-b border-mkt-line px-5 py-2.5')}>
          {actionError}
        </p>
      ) : null}

      {error ? (
        <p className="px-5 py-8 text-center text-[14px] text-mkt-muted">Files couldn’t be loaded. Refresh to try again.</p>
      ) : assets.length === 0 ? (
        <p className="px-5 py-8 text-center text-[14px] text-mkt-muted">No files for this project yet.</p>
      ) : (
        <ul className="divide-y divide-mkt-line">
          {assets.map((asset) => (
            <li key={asset.id} className="flex items-center gap-3 px-5 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-mkt-lavender text-mkt-violet">
                {asset.type?.startsWith('image/') ? (
                  <ImageIcon className="h-4 w-4" aria-hidden />
                ) : (
                  <File className="h-4 w-4" aria-hidden />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-medium text-mkt-ink">{asset.name}</p>
                <p className="mt-0.5 text-[12px] tabular-nums text-mkt-muted">
                  {formatFileSize(asset.size)} · {formatDate(asset.created_at)}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <a
                  href={asset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${asset.name}`}
                  title="Open"
                  className={buttonClass('ghost', 'sm', 'w-8 px-0')}
                >
                  <ExternalLink aria-hidden />
                </a>
                <button
                  type="button"
                  onClick={() => handleDelete(asset.id)}
                  disabled={isPending}
                  aria-label={`Delete ${asset.name}`}
                  title="Delete"
                  className={buttonClass('ghost', 'sm', 'w-8 px-0 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400')}
                >
                  <Trash2 aria-hidden />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AdminCard>
  );
}
