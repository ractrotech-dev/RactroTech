import type { ClientCategory, ClientStage } from '@/utils/clients/constants';

export type ParsedClientRow = {
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  category: ClientCategory;
  region: string | null;
  state: string | null;
  country: string;
  status: ClientStage;
  notes: string | null;
};
