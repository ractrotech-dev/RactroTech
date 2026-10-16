'use client';

import { useId, useState, useTransition } from 'react';
import { Send } from 'lucide-react';

import { addInquiryNote } from '@/app/admin/actions';
import { buttonClass, field } from '@/components/admin/ui';
import { cn } from '@/lib/utils';

interface NoteFormProps {
  inquiryId: string;
}

export default function InquiryNoteForm({ inquiryId }: NoteFormProps) {
  const [content, setContent] = useState('');
  const [isPending, startTransition] = useTransition();
  const inputId = useId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    startTransition(async () => {
      await addInquiryNote(inquiryId, content.trim());
      setContent('');
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
      <label htmlFor={inputId} className="sr-only">
        Add a note
      </label>
      <input
        id={inputId}
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a note…"
        disabled={isPending}
        className={cn(field.input, 'min-w-0 flex-1')}
      />
      <button type="submit" disabled={isPending || !content.trim()} className={buttonClass('primary', 'md', 'h-10 shrink-0')}>
        <Send aria-hidden />
        {isPending ? 'Adding…' : 'Add note'}
      </button>
    </form>
  );
}
