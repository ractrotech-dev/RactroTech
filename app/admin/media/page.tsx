import { desc } from 'drizzle-orm';
import { File, Filter, FolderOpen, Image as ImageIcon, Music, Search, Trash2, Upload, Video } from 'lucide-react';

import EmptyState from '@/components/admin/EmptyState';
import MiniStat from '@/components/admin/MiniStat';
import PageHeader from '@/components/admin/PageHeader';
import { AdminCard, Notice, buttonClass, field } from '@/components/admin/ui';
import { formatCount, formatDate, formatFileSize } from '@/lib/admin/format';
import { cn } from '@/lib/utils';
import { db } from '@/utils/db/db';
import { mediaAssetsTable, type SelectMediaAsset } from '@/utils/db/schema';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Media Library | Admin | RactroTech',
  description: 'Manage uploaded files and assets',
};

const getIconForType = (type: string | null) => {
  if (!type) return File;
  if (type.startsWith('image/')) return ImageIcon;
  if (type.startsWith('video/')) return Video;
  if (type.startsWith('audio/')) return Music;
  return File;
};


/** Bytes → "512 B", "50.0 KB", "1.2 MB". Unknown size → "—", never "0.0 KB". */

/** "PNG", "PDF"… from the file name's extension, else the MIME subtype. */
function fileKind(name: string, type: string | null): string {
  const ext = name.includes('.') ? name.split('.').pop() : '';
  if (ext && ext.length <= 5) return ext.toUpperCase();
  const subtype = type?.split('/')[1];
  return subtype ? subtype.split(/[+.;]/)[0].toUpperCase() : 'File';
}

export default async function AdminMediaPage() {
  let assets: SelectMediaAsset[] | null = null;
  try {
    assets = await db.select().from(mediaAssetsTable).orderBy(desc(mediaAssetsTable.created_at));
  } catch {
    /* table may not exist — shown as "couldn't load", not as an empty library */
  }

  // The query has no limit, so these cover the whole library.
  const imageCount = assets ? assets.filter((a) => a.type?.startsWith('image/')).length : null;
  const sized = assets ? assets.filter((a) => typeof a.size === 'number') : [];
  const totalBytes = assets && sized.length > 0 ? sized.reduce((sum, a) => sum + (a.size ?? 0), 0) : null;
  const someUnsized = assets !== null && sized.length < assets.length && sized.length > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Media library"
        subtitle={
          assets === null
            ? 'Files couldn’t be loaded.'
            : `${formatCount(assets.length)} ${assets.length === 1 ? 'file' : 'files'} uploaded.`
        }
        backHref="/admin"
        actions={
          <button type="button" className={buttonClass('primary')}>
            <Upload aria-hidden /> Upload file
          </button>
        }
      />

      {assets === null ? (
        <Notice tone="amber" title="The media library couldn’t be loaded">
          The database didn’t respond, so counts show as “—”. Reload the page to try again.
        </Notice>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Library totals">
        <MiniStat icon={<FolderOpen />} value={assets ? assets.length : null} label="Files" />
        <MiniStat icon={<ImageIcon />} value={imageCount} label="Images" />
        <MiniStat
          icon={<File />}
          value={formatFileSize(totalBytes)}
          label={someUnsized ? 'Total size (files with a known size)' : 'Total size'}
        />
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mkt-muted" aria-hidden />
          <input type="text" placeholder="Search files…" aria-label="Search files" className={cn(field.input, 'pl-9')} />
        </div>
        <button type="button" className={buttonClass('secondary')}>
          <Filter aria-hidden /> Filter
        </button>
      </div>

      {assets === null || assets.length === 0 ? (
        <AdminCard>
          <EmptyState
            icon={<FolderOpen />}
            title={assets === null ? 'Nothing to show' : 'Your library is empty'}
            description={
              assets === null
                ? 'Files appear here once the library can be loaded.'
                : 'Upload images, documents, and videos to use across your site.'
            }
          />
        </AdminCard>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {assets.map((asset) => {
            const Icon = getIconForType(asset.type);
            const isImage = asset.type?.startsWith('image/') ?? false;
            return (
              <li key={asset.id} className="group overflow-hidden rounded-2xl border border-mkt-line bg-mkt-surface text-mkt-ink">
                <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-mkt-ink/[0.03]">
                  {isImage ? (
                    // Asset URLs can be on any host; next/image would reject hosts missing from next.config.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={asset.url} alt={asset.name} loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <Icon className="h-8 w-8 text-mkt-muted" strokeWidth={1.5} aria-hidden />
                  )}

                  <div className="absolute inset-x-0 bottom-0 flex gap-2 bg-mkt-surface/90 p-2 opacity-0 backdrop-blur-sm transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
                    <button type="button" className={buttonClass('secondary', 'sm', 'flex-1')}>
                      View
                    </button>
                    <button type="button" className={buttonClass('danger', 'sm', 'w-8 px-0')} aria-label={`Delete ${asset.name}`}>
                      <Trash2 aria-hidden />
                    </button>
                  </div>
                </div>

                <div className="border-t border-mkt-line px-3 py-2.5">
                  <p className="truncate text-[14px] font-medium" title={asset.name}>
                    {asset.name}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[12px] tabular-nums text-mkt-muted">
                    <span>{formatFileSize(asset.size)}</span>
                    <span aria-hidden>·</span>
                    <span>{fileKind(asset.name, asset.type)}</span>
                    <span aria-hidden>·</span>
                    <time dateTime={new Date(asset.created_at).toISOString()}>{formatDate(asset.created_at)}</time>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
