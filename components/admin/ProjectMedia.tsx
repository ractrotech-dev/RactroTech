'use client';

import { useState, useTransition } from 'react';
import { addMediaAsset, deleteMediaAsset } from '@/app/admin/actions';
import { Upload, File, Trash2, ExternalLink, Image as ImageIcon } from 'lucide-react';

interface ProjectMediaProps {
  projectId: string;
  assets: any[];
}

export default function ProjectMedia({ projectId, assets }: ProjectMediaProps) {
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    // This is a simulation for now, but wired to the server action
    const name = prompt('File Name:');
    const url = prompt('File URL:');
    if (!name || !url) return;

    startTransition(async () => {
      await addMediaAsset({
        name,
        url,
        project_id: projectId,
        type: 'image/png', // Default for simulation
        size: 1024 * 50, // 50KB
      });
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this file?')) return;
    startTransition(async () => {
      await deleteMediaAsset(id);
    });
  };

  return (
    <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center justify-between border-b-4 border-black px-5 py-3">
        <h3 className="text-xs font-black tracking-[0.2em]">Project Assets</h3>
        <button
          onClick={handleUpload}
          disabled={isPending}
          className="flex items-center gap-2 border-2 border-black bg-yellow-400 px-3 py-1 text-[9px] font-black tracking-widest transition-all hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          <Upload size={12} /> Upload
        </button>
      </div>

      <div className="divide-y-2 divide-black/5">
        {assets.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-[10px] font-bold text-black/30">No files uploaded for this project.</p>
          </div>
        ) : (
          assets.map((asset) => (
            <div key={asset.id} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-gray-50">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-black bg-gray-100">
                {asset.type?.startsWith('image/') ? <ImageIcon size={14} /> : <File size={14} />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-black tracking-wider">{asset.name}</p>
                <p className="text-[9px] font-bold text-black/40">{(asset.size / 1024).toFixed(1)} KB • {new Date(asset.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-1.5">
                <a
                  href={asset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-black p-1 hover:bg-black hover:text-white transition-colors"
                >
                  <ExternalLink size={12} />
                </a>
                <button
                  onClick={() => handleDelete(asset.id)}
                  disabled={isPending}
                  className="border-2 border-black p-1 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
