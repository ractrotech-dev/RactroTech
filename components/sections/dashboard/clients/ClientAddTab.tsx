'use client';

import { useEffect } from 'react';
import { useFormState } from 'react-dom';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createClientRecord } from '@/app/actions/clients';
import { clientActionInitialState } from '@/utils/clients/constants';
import { ClientFormFields } from './ClientFormFields';

type ClientAddTabProps = {
  onCreated?: () => void;
};

export function ClientAddTab({ onCreated }: ClientAddTabProps) {
  const [state, formAction] = useFormState(
    createClientRecord,
    clientActionInitialState,
  );

  useEffect(() => {
    if (state.success) {
      onCreated?.();
    }
  }, [state.success, onCreated]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Add client</CardTitle>
        <CardDescription>
          Create a new client and set their onboarding stage.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state.message && (
            <p
              className={`text-sm font-medium ${
                state.success ? 'text-emerald-600' : 'text-destructive'
              }`}
            >
              {state.message}
            </p>
          )}
          <ClientFormFields submitLabel="Add client" />
        </form>
      </CardContent>
    </Card>
  );
}
