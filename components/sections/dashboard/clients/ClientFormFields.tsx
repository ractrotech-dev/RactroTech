'use client';

import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CLIENT_CATEGORIES, CLIENT_STAGES } from '@/utils/clients/constants';
import { UK_COUNTRIES, UK_REGION_OPTIONS } from '@/utils/clients/uk-playbook';
import type { ClientRecord } from './types';

type ClientFormFieldsProps = {
  client?: ClientRecord | null;
  submitLabel: string;
  hiddenId?: boolean;
};

export function ClientFormFields({
  client,
  submitLabel,
  hiddenId = false,
}: ClientFormFieldsProps) {
  const { pending } = useFormStatus();

  return (
    <>
      {hiddenId && client?.id && (
        <input type="hidden" name="id" value={client.id} />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="client-name">Full name (optional)</Label>
          <Input
            id="client-name"
            name="name"
            defaultValue={client?.name ?? ''}
            placeholder="Business owner or venue name"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="client-email">Email (required)</Label>
          <Input
            id="client-email"
            name="email"
            type="email"
            required
            defaultValue={client?.email ?? ''}
            placeholder="contact@cafename.co.uk"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="client-phone">Phone (optional)</Label>
          <Input
            id="client-phone"
            name="phone"
            type="tel"
            defaultValue={client?.phone ?? ''}
            placeholder="+44 7xxx xxxxxx"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="client-company">Business name</Label>
          <Input
            id="client-company"
            name="company"
            defaultValue={client?.company ?? ''}
            placeholder="e.g. Riverside Café"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="client-category">Category</Label>
          <select
            id="client-category"
            name="category"
            defaultValue={client?.category ?? 'cafe'}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {CLIENT_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="client-status">Stage</Label>
          <select
            id="client-status"
            name="status"
            defaultValue={client?.status ?? 'lead'}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {CLIENT_STAGES.map((stage) => (
              <option key={stage.value} value={stage.value}>
                {stage.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="client-region">Region</Label>
          <select
            id="client-region"
            name="region"
            defaultValue={client?.region ?? ''}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Select UK region</option>
            {UK_REGION_OPTIONS.map((r) => (
              <option key={r.value} value={r.label}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="client-state">State / County</Label>
          <Input
            id="client-state"
            name="state"
            defaultValue={client?.state ?? ''}
            placeholder="e.g. Greater London, Kent"
          />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="client-country">Country</Label>
          <select
            id="client-country"
            name="country"
            defaultValue={client?.country ?? 'United Kingdom'}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {UK_COUNTRIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="client-notes">Notes</Label>
        <textarea
          id="client-notes"
          name="notes"
          rows={3}
          defaultValue={client?.notes ?? ''}
          placeholder="Social links (Facebook, Instagram), website status, last contact…"
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? 'Saving…' : submitLabel}
      </Button>
    </>
  );
}
