'use client';

import { useState, useTransition } from 'react';
import { addInquiryNote } from '@/app/admin/actions';
import { Send } from 'lucide-react';

interface NoteFormProps {
  inquiryId: string;
}

export default function InquiryNoteForm({ inquiryId }: NoteFormProps) {
  const [content, setContent] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    startTransition(async () => {
      await addInquiryNote(inquiryId, content.trim());
      setContent('');
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a note..."
        disabled={isPending}
        className="flex-1 border-2 border-black/20 bg-white px-3 py-2 text-xs font-bold placeholder:text-black/30 focus:border-black focus:outline-none disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isPending || !content.trim()}
        className="flex items-center gap-1.5 border-2 border-black bg-yellow-400 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all hover:-translate-y-0.5 disabled:opacity-50"
      >
        <Send size={12} />
        Send
      </button>
    </form>
  );
}
