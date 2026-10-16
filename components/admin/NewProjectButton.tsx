'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import CreateProjectForm from '@/components/admin/CreateProjectForm';
import { buttonClass } from '@/components/admin/ui';

export default function NewProjectButton() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setShowForm(true)} className={buttonClass('primary')}>
        <Plus aria-hidden />
        New project
      </button>
      {showForm && <CreateProjectForm onClose={() => setShowForm(false)} />}
    </>
  );
}
