'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import CreateProjectForm from '@/components/admin/CreateProjectForm';

export default function NewProjectButton() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="flex items-center gap-2 border-2 border-black bg-yellow-400 px-4 py-2 text-[10px] font-black tracking-widest transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        <Plus size={14} />
        New Project
      </button>
      {showForm && <CreateProjectForm onClose={() => setShowForm(false)} />}
    </>
  );
}
