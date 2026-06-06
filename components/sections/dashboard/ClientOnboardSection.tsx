'use client';

import { useState } from 'react';

import { ClientAddTab } from './clients/ClientAddTab';
import { ClientListTab } from './clients/ClientListTab';
import { ClientPlansTab } from './clients/ClientPlansTab';
import type { ClientSubTab } from './clients/types';

const SUBTABS: { key: ClientSubTab; label: string }[] = [
  { key: 'list', label: 'Client List' },
  { key: 'add', label: 'Add Client' },
  { key: 'plans', label: 'Onboard Plans' },
];

export function ClientOnboardSection() {
  const [subTab, setSubTab] = useState<ClientSubTab>('list');
  const [listKey, setListKey] = useState(0);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Clients
        </p>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Client onboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage clients, categories, and call-to-onboard playbooks for every stage.
        </p>
      </header>

      <nav className="flex flex-wrap gap-2 border-b border-border pb-3">
        {SUBTABS.map((tab) => {
          const active = subTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSubTab(tab.key)}
              className={[
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              ].join(' ')}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {subTab === 'list' && <ClientListTab key={listKey} />}
      {subTab === 'add' && (
        <ClientAddTab
          onCreated={() => {
            setListKey((k) => k + 1);
            setSubTab('list');
          }}
        />
      )}
      {subTab === 'plans' && <ClientPlansTab />}
    </div>
  );
}
