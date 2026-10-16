import 'server-only';

import { and, eq, ilike, isNotNull, or, type SQL } from 'drizzle-orm';

import { leadsTable } from '@/utils/db/schema';

export type LeadFilters = {
  q?: string;
  country?: string;
  category?: string;
  status?: string;
  hasEmail?: string; // "1" = only leads with an email
};

const escapeLike = (s: string) => s.replace(/[\\%_]/g, (c) => `\\${c}`);

/** WHERE condition on the leads table for a filter set; undefined matches everything. */
export function leadCondition(f: LeadFilters): SQL | undefined {
  const q = f.q ? `%${escapeLike(f.q)}%` : null;
  return and(
    q ? or(ilike(leadsTable.name, q), ilike(leadsTable.city, q), ilike(leadsTable.email, q)) : undefined,
    f.country ? eq(leadsTable.country, f.country) : undefined,
    f.category ? eq(leadsTable.category, f.category) : undefined,
    f.status ? eq(leadsTable.status, f.status) : undefined,
    f.hasEmail === '1' ? isNotNull(leadsTable.email) : undefined
  );
}

export function pickFilters(sp: Record<string, string | string[] | undefined>): LeadFilters {
  const s = (k: string) => (typeof sp[k] === 'string' && sp[k] ? (sp[k] as string) : undefined);
  return { q: s('q'), country: s('country'), category: s('category'), status: s('status'), hasEmail: s('hasEmail') };
}

/** The filters as a query string, without empty values. */
export function filterQuery(f: LeadFilters) {
  return new URLSearchParams(Object.entries(f).filter(([, v]) => v) as [string, string][]);
}
