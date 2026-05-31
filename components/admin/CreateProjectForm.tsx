'use client';

import { useState, useTransition } from 'react';
import { createProject } from '@/app/admin/actions';
import { X } from 'lucide-react';

interface CreateProjectFormProps {
  onClose: () => void;
}

export default function CreateProjectForm({ onClose }: CreateProjectFormProps) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [techStack, setTechStack] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    startTransition(async () => {
      await createProject({
        name: name.trim(),
        description: description.trim() || undefined,
        budget: budget ? parseFloat(budget) : undefined,
        tech_stack: techStack.trim() || undefined,
      });
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between border-b-4 border-black px-5 py-3">
          <h2 className="text-xs font-black tracking-[0.2em]">New Project</h2>
          <button onClick={onClose} className="text-black/40 hover:text-black transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div>
            <label className="mb-1.5 block text-[9px] font-black tracking-[0.2em] text-black/50">Project Name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Ractrotech Website Redesign"
              className="w-full border-2 border-black px-3 py-2.5 text-sm font-bold placeholder:text-black/25 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          </div>
          <div>
            <label className="mb-1.5 block text-[9px] font-black tracking-[0.2em] text-black/50">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Brief project description..."
              className="w-full border-2 border-black px-3 py-2.5 text-sm font-semibold placeholder:text-black/25 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-[9px] font-black tracking-[0.2em] text-black/50">Budget ($)</label>
              <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="5000"
                className="w-full border-2 border-black px-3 py-2.5 text-sm font-bold placeholder:text-black/25 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            </div>
            <div>
              <label className="mb-1.5 block text-[9px] font-black tracking-[0.2em] text-black/50">Tech Stack</label>
              <input type="text" value={techStack} onChange={(e) => setTechStack(e.target.value)} placeholder="Next.js, React"
                className="w-full border-2 border-black px-3 py-2.5 text-sm font-bold placeholder:text-black/25 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isPending || !name.trim()}
              className="flex-1 border-2 border-black bg-yellow-400 py-2.5 text-[10px] font-black tracking-widest transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50">
              {isPending ? 'Creating...' : 'Create Project'}
            </button>
            <button type="button" onClick={onClose}
              className="border-2 border-black px-6 py-2.5 text-[10px] font-black tracking-widest transition-all hover:bg-black hover:text-white">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
