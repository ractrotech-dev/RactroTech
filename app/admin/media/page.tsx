import { db } from '@/utils/db/db';
import { mediaAssetsTable } from '@/utils/db/schema';
import { desc } from 'drizzle-orm';
import {
  FolderOpen,
  Upload,
  Trash2,
  File,
  Image as ImageIcon,
  Music,
  Video,
  Search,
  Filter,
} from 'lucide-react';
import NextImage from 'next/image';
import PageHeader from '@/components/admin/PageHeader';
import EmptyState from '@/components/admin/EmptyState';

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

export default async function AdminMediaPage() {
  let assets: any[] = [];
  try {
    assets = await db.select().from(mediaAssetsTable).orderBy(desc(mediaAssetsTable.created_at));
  } catch {
    /* table may not exist */
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Media Library"
        subtitle={`${assets.length} assets uploaded`}
        backHref="/admin"
        actions={
          <button className="flex items-center gap-2 border-2 border-black bg-yellow-400 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Upload size={14} /> Upload File
          </button>
        }
      />

      {/* Toolbar */}
      <div className="flex flex-col justify-between gap-4 border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:flex-row sm:items-center">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" size={16} />
          <input
            type="text"
            placeholder="Search assets..."
            className="w-full border-2 border-black bg-gray-50 py-2 pl-10 pr-4 text-[11px] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 border-2 border-black bg-white px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-gray-50">
            <Filter size={14} /> Filter
          </button>
        </div>
      </div>

      {assets.length === 0 ? (
        <div className="border-4 border-black bg-white p-20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <EmptyState
            icon={FolderOpen}
            title="Your library is empty"
            description="Upload images, documents, and videos to use across your site."
          />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {assets.map((asset) => {
            const Icon = getIconForType(asset.type);
            return (
              <div
                key={asset.id}
                className="group relative border-4 border-black bg-white p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="flex aspect-square flex-col items-center justify-center overflow-hidden border-2 border-black bg-gray-50">
                  {asset.type?.startsWith('image/') ? (
                    <NextImage
                      src={asset.url}
                      alt={asset.name}
                      width={200}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Icon size={32} className="text-black/20" />
                  )}
                </div>
                <div className="mt-2 min-w-0">
                  <p className="truncate text-[10px] font-black uppercase tracking-wider">
                    {asset.name}
                  </p>
                  <p className="text-[9px] font-bold text-black/40">
                    {(asset.size / 1024).toFixed(1)} KB • {asset.type?.split('/')[1].toUpperCase()}
                  </p>
                </div>

                {/* Overlay actions */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 p-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="flex-1 border-2 border-white bg-white py-1.5 text-[8px] font-black uppercase tracking-widest text-black transition-all hover:border-black hover:bg-yellow-400">
                    View
                  </button>
                  <button className="border-2 border-red-500 bg-red-500 p-1.5 text-white transition-all hover:bg-white hover:text-red-500">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
