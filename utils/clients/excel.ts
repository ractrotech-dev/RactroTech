import * as XLSX from 'xlsx';

import {
  CLIENT_CATEGORIES,
  CLIENT_STAGES,
  type ClientCategory,
  type ClientStage,
} from '@/utils/clients/constants';
import type { ParsedClientRow } from '@/utils/clients/import-types';

export type { ParsedClientRow };

/** Column headers for the import template (row 1). */
export const CLIENT_SHEET_HEADERS = [
  'name',
  'email',
  'phone',
  'company',
  'category',
  'region',
  'state',
  'country',
  'stage',
  'notes',
] as const;

const SAMPLE_ROW: Record<string, string> = {
  name: 'Riverside Café',
  email: 'owner@riversidecafe.co.uk',
  phone: '+44 7700 900123',
  company: 'Riverside Café Ltd',
  category: 'cafe',
  region: 'London',
  state: 'Greater London',
  country: 'United Kingdom',
  stage: 'lead',
  notes: 'Found on Instagram — no website yet',
};

const HEADER_ALIASES: Record<string, keyof typeof SAMPLE_ROW> = {
  name: 'name',
  'full name': 'name',
  'contact name': 'name',
  email: 'email',
  'e-mail': 'email',
  phone: 'phone',
  mobile: 'phone',
  tel: 'phone',
  company: 'company',
  business: 'company',
  'business name': 'company',
  category: 'category',
  type: 'category',
  region: 'region',
  state: 'state',
  county: 'state',
  'state / county': 'state',
  country: 'country',
  stage: 'stage',
  status: 'stage',
  notes: 'notes',
  note: 'notes',
};

export type ParseSheetResult =
  | { ok: true; rows: ParsedClientRow[] }
  | { ok: false; error: string };

function normalizeHeader(cell: unknown): string {
  return String(cell ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function normalizeCategory(raw: string): ClientCategory {
  const key = raw.trim().toLowerCase().replace(/\s+/g, '_');
  const byValue = CLIENT_CATEGORIES.find((c) => c.value === key);
  if (byValue) return byValue.value;
  const byLabel = CLIENT_CATEGORIES.find(
    (c) => c.label.toLowerCase() === raw.trim().toLowerCase(),
  );
  return byLabel?.value ?? 'other';
}

function normalizeStage(raw: string): ClientStage {
  const key = raw.trim().toLowerCase();
  const byValue = CLIENT_STAGES.find((s) => s.value === key);
  if (byValue) return byValue.value;
  const byLabel = CLIENT_STAGES.find(
    (s) => s.label.toLowerCase() === raw.trim().toLowerCase(),
  );
  return byLabel?.value ?? 'lead';
}

function cellString(row: Record<string, unknown>, key: string): string {
  const v = row[key];
  if (v == null || v === '') return '';
  return String(v).trim();
}

export function downloadClientTemplate(): void {
  const instructions = [
    {
      Field: 'name',
      Required: 'No',
      Example: 'Riverside Café',
      Hint: 'Optional — uses company or email if empty',
    },
    {
      Field: 'email',
      Required: 'Yes',
      Example: 'owner@cafe.co.uk',
      Hint: 'Required for every row',
    },
    {
      Field: 'phone',
      Required: 'No (optional)',
      Example: '+44 7700 900123',
      Hint: 'Leave blank if unknown',
    },
    {
      Field: 'company',
      Required: 'No',
      Example: 'Riverside Café Ltd',
      Hint: 'Venue / business name',
    },
    {
      Field: 'category',
      Required: 'No',
      Example: 'cafe',
      Hint: CLIENT_CATEGORIES.map((c) => c.value).join(', '),
    },
    {
      Field: 'region',
      Required: 'No',
      Example: 'London',
      Hint: 'UK region',
    },
    {
      Field: 'state',
      Required: 'No',
      Example: 'Greater London',
      Hint: 'County / state',
    },
    {
      Field: 'country',
      Required: 'No',
      Example: 'United Kingdom',
      Hint: 'Defaults to United Kingdom',
    },
    {
      Field: 'stage',
      Required: 'No',
      Example: 'lead',
      Hint: CLIENT_STAGES.map((s) => s.value).join(', '),
    },
    {
      Field: 'notes',
      Required: 'No',
      Example: 'Instagram — no website',
      Hint: 'Social links, last contact',
    },
  ];

  const dataSheet = XLSX.utils.aoa_to_sheet([
    [...CLIENT_SHEET_HEADERS],
    CLIENT_SHEET_HEADERS.map((h) => SAMPLE_ROW[h] ?? ''),
  ]);

  const helpSheet = XLSX.utils.json_to_sheet(instructions);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, dataSheet, 'Clients');
  XLSX.utils.book_append_sheet(workbook, helpSheet, 'Instructions');

  XLSX.writeFile(workbook, 'ractrotech-client-import-template.xlsx');
}

export function parseClientSpreadsheet(file: File): Promise<ParseSheetResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          resolve({ ok: false, error: 'Could not read file.' });
          return;
        }
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName =
          workbook.SheetNames.find((n) => n.toLowerCase() === 'clients') ??
          workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        if (!sheet) {
          resolve({ ok: false, error: 'No worksheet found in file.' });
          return;
        }

        const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
          defval: '',
        });

        if (json.length === 0) {
          resolve({ ok: false, error: 'Sheet is empty. Add rows under the header.' });
          return;
        }

        const firstKeys = Object.keys(json[0] ?? {});
        const columnMap: Record<string, string> = {};
        for (const key of firstKeys) {
          const mapped = HEADER_ALIASES[normalizeHeader(key)];
          if (mapped) columnMap[key] = mapped;
        }

        if (!Object.values(columnMap).includes('email')) {
          resolve({
            ok: false,
            error: 'Missing an "email" column. Download the sample template.',
          });
          return;
        }

        const rows: ParsedClientRow[] = [];
        const errors: string[] = [];

        json.forEach((rawRow, index) => {
          const row: Record<string, unknown> = {};
          for (const [origKey, field] of Object.entries(columnMap)) {
            row[field] = rawRow[origKey];
          }

          const name = cellString(row, 'name');
          const email = cellString(row, 'email').toLowerCase();
          const company = cellString(row, 'company');
          if (!email) {
            if (!name && !company && !cellString(row, 'phone')) return;
            errors.push(`Row ${index + 2}: email is required.`);
            return;
          }
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push(`Row ${index + 2}: invalid email "${email}".`);
            return;
          }

          const categoryRaw = cellString(row, 'category');
          const stageRaw = cellString(row, 'stage');
          const resolvedName =
            name || company || email.split('@')[0] || 'Client';

          rows.push({
            name: resolvedName,
            email,
            phone: cellString(row, 'phone') || null,
            company: company || null,
            category: categoryRaw ? normalizeCategory(categoryRaw) : 'other',
            region: cellString(row, 'region') || null,
            state: cellString(row, 'state') || null,
            country: cellString(row, 'country') || 'United Kingdom',
            status: stageRaw ? normalizeStage(stageRaw) : 'lead',
            notes: cellString(row, 'notes') || null,
          });
        });

        if (rows.length === 0) {
          resolve({
            ok: false,
            error:
              errors[0] ??
              'No valid rows found. Each row needs an email (phone is optional).',
          });
          return;
        }

        if (errors.length > 0 && rows.length === 0) {
          resolve({ ok: false, error: errors.slice(0, 3).join(' ') });
          return;
        }

        resolve({ ok: true, rows });
      } catch {
        resolve({
          ok: false,
          error: 'Invalid Excel file. Use .xlsx or .xls from the sample template.',
        });
      }
    };
    reader.onerror = () => resolve({ ok: false, error: 'Failed to read file.' });
    reader.readAsArrayBuffer(file);
  });
}
