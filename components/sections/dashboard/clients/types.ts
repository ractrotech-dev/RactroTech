export type ClientRecord = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  category: string | null;
  state: string | null;
  region: string | null;
  country: string | null;
  notes: string | null;
  status: string;
  created_at: string;
};

export type ClientSubTab = 'list' | 'add' | 'plans';
