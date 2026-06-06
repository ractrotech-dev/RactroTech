export type ClientActionState = {
  message: string;
  success: boolean;
};

export const clientActionInitialState: ClientActionState = {
  message: '',
  success: false,
};

export const CLIENT_STAGES = [
  { value: 'lead', label: 'Lead' },
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'churned', label: 'Churned' },
] as const;

export type ClientStage = (typeof CLIENT_STAGES)[number]['value'];

export const CLIENT_CATEGORIES = [
  { value: 'gym', label: 'Gym / Fitness' },
  { value: 'cafe', label: 'Café' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'bakery', label: 'Bakery' },
  { value: 'salon', label: 'Salon / Barber' },
  { value: 'bar_pub', label: 'Bar / Pub' },
  { value: 'retail', label: 'Retail shop' },
  { value: 'hotel', label: 'Hotel / B&B' },
  { value: 'professional', label: 'Professional services' },
  { value: 'smb', label: 'SMB (general)' },
  { value: 'other', label: 'Other' },
] as const;

export type ClientCategory = (typeof CLIENT_CATEGORIES)[number]['value'];

export function getCategoryLabel(value: string | null | undefined): string {
  if (!value) return '—';
  return CLIENT_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}
