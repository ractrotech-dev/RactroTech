'use client';

import { useEffect, useState, useTransition } from 'react';
import { X } from 'lucide-react';

import { createProject } from '@/app/admin/actions';
import { buttonClass, field } from '@/components/admin/ui';
import { ADMIN_CURRENCY } from '@/lib/admin/format';

interface CreateProjectFormProps {
  onClose: () => void;
}

export default function CreateProjectForm({ onClose }: CreateProjectFormProps) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [techStack, setTechStack] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Escape closes the dialog, like its close button.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError(null);

    startTransition(async () => {
      try {
        await createProject({
          name: name.trim(),
          description: description.trim() || undefined,
          budget: budget ? parseFloat(budget) : undefined,
          tech_stack: techStack.trim() || undefined,
        });
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not create the project.');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-mkt-contrast/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-project-title"
        className="w-full max-w-lg rounded-2xl border border-mkt-line bg-mkt-surface text-mkt-ink shadow-[0_24px_60px_-24px_rgba(11,11,16,0.45)]"
      >
        <div className="flex items-center justify-between gap-3 border-b border-mkt-line px-5 py-4">
          <h2 id="create-project-title" className="text-[15px] font-semibold leading-6">
            New project
          </h2>
          <button type="button" onClick={onClose} aria-label="Close" className={buttonClass('ghost', 'sm', 'w-8 px-0')}>
            <X aria-hidden />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div>
            <label htmlFor="project-name" className={field.label}>
              Project name
            </label>
            <input
              id="project-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              placeholder="e.g. Ractrotech website redesign"
              className={field.input}
            />
          </div>
          <div>
            <label htmlFor="project-description" className={field.label}>
              Description
            </label>
            <textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Brief project description"
              className={`${field.textarea} resize-none`}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="project-budget" className={field.label}>
                Budget ({ADMIN_CURRENCY})
              </label>
              <input
                id="project-budget"
                type="number"
                min={0}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="5000"
                className={`${field.input} tabular-nums`}
              />
            </div>
            <div>
              <label htmlFor="project-tech" className={field.label}>
                Tech stack
              </label>
              <input
                id="project-tech"
                type="text"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                placeholder="Next.js, React"
                className={field.input}
              />
              <p className={field.hint}>Separate with commas.</p>
            </div>
          </div>
          {error ? (
            <p role="alert" className={field.error}>
              {error}
            </p>
          ) : null}
          <div className="flex justify-end gap-2 border-t border-mkt-line pt-4">
            <button type="button" onClick={onClose} className={buttonClass('secondary')}>
              Cancel
            </button>
            <button type="submit" disabled={isPending || !name.trim()} className={buttonClass('primary')}>
              {isPending ? 'Creating…' : 'Create project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
