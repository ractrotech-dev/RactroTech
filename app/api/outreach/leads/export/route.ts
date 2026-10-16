import { desc } from 'drizzle-orm';

import { leadCondition, pickFilters } from '@/lib/outreach/leads';
import { countryName } from '@/lib/outreach/taxonomy';
import { getAdminUser } from '@/utils/admin';
import { db } from '@/utils/db/db';
import { leadsTable } from '@/utils/db/schema';

export const dynamic = 'force-dynamic';

const COLUMNS = [
  'name',
  'category',
  'country',
  'city',
  'address',
  'phone',
  'email',
  'emails',
  'website',
  'rating',
  'reviews_count',
  'status',
  'maps_url',
] as const;

function csvCell(v: unknown) {
  const s = Array.isArray(v) ? v.join('; ') : v == null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// Leads as CSV, with the same filters as Admin → Lead finder → Leads.
export async function GET(request: Request) {
  if (!(await getAdminUser())) return Response.json({ error: 'unauthorized' }, { status: 401 });

  const sp = Object.fromEntries(new URL(request.url).searchParams);
  const rows = await db
    .select()
    .from(leadsTable)
    .where(leadCondition(pickFilters(sp)))
    .orderBy(desc(leadsTable.id));
  const lines = [
    COLUMNS.join(','),
    ...rows.map((r) => COLUMNS.map((c) => csvCell(c === 'country' ? countryName(r.country) : r[c])).join(',')),
  ];
  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
