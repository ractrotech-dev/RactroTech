import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import {
  componentToDbPayload,
  generateUniqueReplacement,
} from '../../../lib/component-library/replacement-generator';
import type { ComponentRecord } from '../../../lib/component-library/similarity';
import { createSeedClient } from '../seed/supabase-client';
import type { DedupReport } from './scan-duplicates';

type DeleteRow = {
  id: string;
  title: string;
  category_id: string | null;
  category_name: string | null;
};

function parseArgs() {
  const dryRun = !process.argv.includes('--apply');
  const limitArg = process.argv.find((a) => a.startsWith('--limit='));
  const limit = limitArg ? Number(limitArg.split('=')[1]) : undefined;
  return { dryRun, limit };
}

async function fetchComponentsToReplace(limit?: number): Promise<DeleteRow[]> {
  const supabase = createSeedClient();
  if (!supabase) throw new Error('Supabase client unavailable');

  const rows: DeleteRow[] = [];
  const pageSize = limit ? Math.min(limit, 1000) : 1000;
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from('components')
      .select('id, title, category_id, category:category_id(name)')
      .eq('is_duplicate', true)
      .eq('keep_component', false)
      .eq('replacement_needed', true)
      .order('created_at', { ascending: true })
      .range(from, from + pageSize - 1);

    if (error) throw new Error(error.message);
    if (!data?.length) break;

    rows.push(
      ...data.map((row) => ({
        id: String(row.id),
        title: row.title,
        category_id: row.category_id ? String(row.category_id) : null,
        category_name: (row.category as { name: string } | null)?.name ?? 'Custom',
      }))
    );

    if (limit && rows.length >= limit) return rows.slice(0, limit);
    if (data.length < pageSize) break;
    from += pageSize;
  }

  return rows;
}

async function fetchExistingLibrary(): Promise<ComponentRecord[]> {
  const supabase = createSeedClient();
  if (!supabase) throw new Error('Supabase client unavailable');

  const records: ComponentRecord[] = [];
  let from = 0;
  const pageSize = 1000;

  while (true) {
    const { data, error } = await supabase
      .from('components')
      .select(
        'id, title, description, code, category_id, style_variant, industry_variant, preview_metadata, tags, difficulty, category:category_id(name)'
      )
      .eq('keep_component', true)
      .range(from, from + pageSize - 1);

    if (error) throw new Error(error.message);
    if (!data?.length) break;

    for (const row of data) {
      if ((row.tags ?? []).includes('replacement')) continue;
      records.push({
        id: String(row.id),
        title: row.title,
        description: row.description,
        code: row.code,
        category_id: row.category_id ? String(row.category_id) : null,
        category_name: (row.category as { name: string } | null)?.name ?? null,
        style_variant: row.style_variant,
        industry_variant: row.industry_variant,
        preview_metadata: row.preview_metadata as ComponentRecord['preview_metadata'],
        tags: row.tags,
        difficulty: row.difficulty,
      });
    }

    if (data.length < pageSize) break;
    from += pageSize;
  }

  return records;
}

async function main() {
  const { dryRun, limit } = parseArgs();
  console.log(`Replacement phase (${dryRun ? 'dry run' : 'apply'})...`);

  const toReplace = await fetchComponentsToReplace(limit);
  if (toReplace.length === 0) {
    console.log('No components marked for replacement. Run library:dedup:scan --apply first.');
    return;
  }

  console.log(`Found ${toReplace.length} components to replace.`);

  const baselineLibrary = await fetchExistingLibrary();
  let replaced = 0;
  let failed = 0;

  for (let i = 0; i < toReplace.length; i += 1) {
    const target = toReplace[i];
    const category = target.category_name ?? 'Custom';
    const seed = target.id.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);

    if (i === 0 || (i + 1) % 10 === 0) {
      console.log(`Processing ${i + 1}/${toReplace.length}: ${target.title}`);
    }

    const replacement = generateUniqueReplacement({
      category,
      existingRecords: baselineLibrary,
      seed,
      maxSimilarity: 70,
    });

    if (!replacement) {
      console.error(`Failed to generate unique replacement for ${target.id} (${target.title})`);
      failed += 1;
      continue;
    }

    if (dryRun) {
      console.log(`[dry-run] Would replace ${target.id} with ${replacement.slug}`);
      replaced += 1;
      continue;
    }

    const supabase = createSeedClient();
    if (!supabase) throw new Error('Supabase client unavailable');

    const payload = componentToDbPayload(replacement, target.category_id);

    const { error: deleteError } = await supabase.from('components').delete().eq('id', target.id);
    if (deleteError) {
      console.error(`Delete failed for ${target.id}:`, deleteError.message);
      failed += 1;
      continue;
    }

    const { data: inserted, error: insertError } = await supabase
      .from('components')
      .insert(payload)
      .select('id')
      .maybeSingle();

    if (insertError || !inserted) {
      console.error(`Insert failed after deleting ${target.id}:`, insertError?.message);
      failed += 1;
      continue;
    }

    replaced += 1;
    if ((i + 1) % 25 === 0) console.log(`Progress: ${i + 1}/${toReplace.length} (${replaced} ok, ${failed} failed)`);
  }

  const reportPath = path.join(process.cwd(), 'scripts/component-library/catalog/dedup-report.json');
  let report: DedupReport | null = null;
  try {
    report = JSON.parse(await readFile(reportPath, 'utf8')) as DedupReport;
  } catch {
    report = {
      totalComponents: 0,
      uniqueComponents: 0,
      duplicatesFound: 0,
      nearDuplicatesFlagged: 0,
      similarPairs: 0,
      componentsToDelete: 0,
      replacementsRequired: 0,
      clustersFound: 0,
      generatedAt: new Date().toISOString(),
      flaggedForManualReview: [],
      sampleClusters: [],
    };
  }

  const replacementReport = {
    ...report,
    replacementPhase: {
      attempted: toReplace.length,
      replaced,
      failed,
      dryRun,
      completedAt: new Date().toISOString(),
    },
  };

  await mkdir(path.join(process.cwd(), 'scripts/component-library/catalog'), { recursive: true });
  await writeFile(reportPath, JSON.stringify(replacementReport, null, 2));

  console.log(`Replacement complete: ${replaced} replaced, ${failed} failed.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
