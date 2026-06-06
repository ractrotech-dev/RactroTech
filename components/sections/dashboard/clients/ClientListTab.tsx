'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { useFormState } from 'react-dom';
import { Pencil, Trash2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { deleteClientRecord, updateClientRecord } from '@/app/actions/clients';
import { clientActionInitialState } from '@/utils/clients/constants';
import { getCategoryLabel } from '@/utils/clients/constants';
import { createClient } from '@/utils/supabase/client';
import { ClientExcelImport } from './ClientExcelImport';
import { ClientFormFields } from './ClientFormFields';
import type { ClientRecord } from './types';

function stageLabel(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
}

export function ClientListTab() {
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ClientRecord | null>(null);
  const [feedback, setFeedback] = useState<{
    message: string;
    success: boolean;
  } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [updateState, updateAction] = useFormState(
    updateClientRecord,
    clientActionInitialState,
  );

  const loadClients = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('clients')
      .select(
        'id, name, email, phone, company, category, state, region, country, notes, status, created_at',
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setClients(data as ClientRecord[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients, updateState.success]);

  useEffect(() => {
    if (updateState.message) {
      setFeedback({ message: updateState.message, success: updateState.success });
      if (updateState.success) {
        setEditing(null);
        loadClients();
      }
    }
  }, [updateState, loadClients]);

  const handleDelete = (client: ClientRecord) => {
    const confirmed = window.confirm(
      `Delete ${client.name}? This cannot be undone.`,
    );
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteClientRecord(client.id);
      setFeedback({ message: result.message, success: result.success });
      if (result.success) {
        setClients((prev) => prev.filter((c) => c.id !== client.id));
        if (editing?.id === client.id) setEditing(null);
      }
    });
  };

  return (
    <div className="space-y-4">
      {feedback && (
        <p
          className={`text-sm font-medium ${
            feedback.success ? 'text-emerald-600' : 'text-destructive'
          }`}
        >
          {feedback.message}
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Client list</CardTitle>
          <CardDescription>
            Prospects with location (region, state, country), category, and stage.
          </CardDescription>
        </CardHeader>
        <ClientExcelImport
          onImported={loadClients}
          onFeedback={(message, success) => setFeedback({ message, success })}
        />
        <CardContent className="p-0">
          {loading ? (
            <p className="px-6 py-8 text-sm text-muted-foreground">
              Loading clients…
            </p>
          ) : clients.length === 0 ? (
            <p className="px-6 py-8 text-sm text-muted-foreground">
              No clients yet. Download the sample Excel above, fill it in, and upload —
              or use the Add Client tab.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Region</th>
                    <th className="px-4 py-3 font-medium">State</th>
                    <th className="px-4 py-3 font-medium">Country</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Stage</th>
                    <th className="px-4 py-3 font-medium text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr
                      key={client.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-4 py-3 font-medium text-foreground">
                        {client.name}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {client.phone || '—'}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {client.email}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {client.region || '—'}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {client.state || '—'}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {client.country || '—'}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {getCategoryLabel(client.category)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          {stageLabel(client.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditing(client)}
                            aria-label={`Edit ${client.name}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={isPending}
                            onClick={() => handleDelete(client)}
                            aria-label={`Delete ${client.name}`}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-lg">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-base">Edit client</CardTitle>
                <CardDescription>Update details and stage.</CardDescription>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setEditing(null)}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form action={updateAction} className="space-y-4">
                <ClientFormFields
                  client={editing}
                  submitLabel="Save changes"
                  hiddenId
                />
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
