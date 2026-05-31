import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import postgres from 'postgres';
import {
  bucketKey,
  classifySimilarity,
  computeSimilarityScore,
  extractComponentSignature,
  type ComponentRecord,
  type ComponentSignature,
} from '../../../lib/component-library/similarity';
import { computeQualityScore } from '../../../lib/component-library/quality-score';
import { createSeedClient } from '../seed/supabase-client';

export type DedupReport = {
  totalComponents: number;
  uniqueComponents: number;
  duplicatesFound: number;
  nearDuplicatesFlagged: number;
  similarPairs: number;
  componentsToDelete: number;
  replacementsRequired: number;
  clustersFound: number;
  generatedAt: string;
  flaggedForManualReview: Array<{ id: string; title: string; score: number; comparedTo: string }>;
  sampleClusters: Array<{ keeperId: string; keeperTitle: string; duplicateIds: string[]; maxScore: number }>;
};

type DbComponentRow = {
  id: string;
  title: string;
  description: string;
  code: string;
  category_id: string | null;
  style_variant: string | null;
  industry_variant: string | null;
  preview_metadata: ComponentRecord['preview_metadata'];
  tags: string[] | null;
  difficulty: string | null;
  category: { name: string } | null;
};

class UnionFind {
  private parent = new Map<string, string>();

  find(x: string): string {
    if (!this.parent.has(x)) this.parent.set(x, x);
    if (this.parent.get(x) !== x) {
      this.parent.set(x, this.find(this.parent.get(x)!));
    }
    return this.parent.get(x)!;
  }

  union(a: string, b: string): void {
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA !== rootB) this.parent.set(rootB, rootA);
  }

  clusters(): Map<string, string[]> {
    const groups = new Map<string, string[]>();
    for (const id of this.parent.keys()) {
      const root = this.find(id);
      if (!groups.has(root)) groups.set(root, []);
      groups.get(root)!.push(id);
    }
    return groups;
  }
}

function parseArgs() {
  const dryRun = !process.argv.includes('--apply');
  return { dryRun };
}

async function fetchAllComponents(): Promise<ComponentRecord[]> {
  const supabase = createSeedClient();
  if (!supabase) throw new Error('Supabase client unavailable');

  const pageSize = 1000;
  const rows: DbComponentRow[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from('components')
      .select(
        'id, title, description, code, category_id, style_variant, industry_variant, preview_metadata, tags, difficulty, category:category_id(name)'
      )
      .order('created_at', { ascending: true })
      .range(from, from + pageSize - 1);

    if (error) throw new Error(error.message);
    if (!data?.length) break;
    rows.push(...(data as unknown as DbComponentRow[]));
    if (data.length < pageSize) break;
    from += pageSize;
  }

  return rows.map((row) => ({
    id: String(row.id),
    title: row.title,
    description: row.description,
    code: row.code,
    category_id: row.category_id ? String(row.category_id) : null,
    category_name: row.category?.name ?? row.preview_metadata?.category ?? null,
    style_variant: row.style_variant,
    industry_variant: row.industry_variant,
    preview_metadata: row.preview_metadata,
    tags: row.tags,
    difficulty: row.difficulty,
  }));
}

function buildDuplicateClusters(
  records: ComponentRecord[],
  signatures: Map<string, ComponentSignature>,
  htmlById: Map<string, string>
) {
  const uf = new UnionFind();
  const nearDuplicatePairs: DedupReport['flaggedForManualReview'] = [];
  let similarPairs = 0;
  const maxScoreById = new Map<string, number>();

  for (const record of records) {
    uf.find(record.id);
    maxScoreById.set(record.id, 0);
  }

  const buckets = new Map<string, ComponentRecord[]>();
  for (const record of records) {
    const sig = signatures.get(record.id)!;
    const key = bucketKey(sig);
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(record);
  }

  for (const bucket of buckets.values()) {
    for (let i = 0; i < bucket.length; i += 1) {
      for (let j = i + 1; j < bucket.length; j += 1) {
        const a = bucket[i];
        const b = bucket[j];
        const sigA = signatures.get(a.id)!;
        const sigB = signatures.get(b.id)!;
        const score = computeSimilarityScore(sigA, sigB, htmlById.get(a.id)!, htmlById.get(b.id)!);
        const className = classifySimilarity(score);

        maxScoreById.set(a.id, Math.max(maxScoreById.get(a.id) ?? 0, score));
        maxScoreById.set(b.id, Math.max(maxScoreById.get(b.id) ?? 0, score));

        if (className === 'duplicate') {
          uf.union(a.id, b.id);
        } else if (className === 'near-duplicate') {
          nearDuplicatePairs.push({
            id: a.id,
            title: a.title,
            score,
            comparedTo: b.id,
          });
        } else if (className === 'similar') {
          similarPairs += 1;
        }
      }
    }
  }

  const contentHashGroups = new Map<string, string[]>();
  for (const record of records) {
    const hash = signatures.get(record.id)!.contentHash;
    if (!contentHashGroups.has(hash)) contentHashGroups.set(hash, []);
    contentHashGroups.get(hash)!.push(record.id);
  }
  for (const ids of contentHashGroups.values()) {
    if (ids.length < 2) continue;
    for (let i = 1; i < ids.length; i += 1) uf.union(ids[0], ids[i]);
  }

  return { uf, nearDuplicatePairs, similarPairs, maxScoreById };
}

async function main() {
  const { dryRun } = parseArgs();
  console.log(`Scanning component library for duplicates (${dryRun ? 'dry run' : 'apply'})...`);

  const records = await fetchAllComponents();
  console.log(`Loaded ${records.length} components.`);

  const signatures = new Map(records.map((r) => [r.id, extractComponentSignature(r)]));
  const htmlById = new Map(records.map((r) => [r.id, r.code]));
  const qualityById = new Map(records.map((r) => [r.id, computeQualityScore(r)]));

  const { uf, nearDuplicatePairs, similarPairs, maxScoreById } = buildDuplicateClusters(
    records,
    signatures,
    htmlById
  );

  const clusters = uf.clusters();
  const duplicateClusters = [...clusters.values()].filter((ids) => ids.length > 1);

  /** Keep one best-quality component per duplicate cluster for unique designs. */
  const toDelete = new Set<string>();
  const sampleClusters: DedupReport['sampleClusters'] = [];
  const flaggedSet = new Set<string>();

  for (const clusterIds of duplicateClusters) {
    const sorted = [...clusterIds].sort(
      (a, b) => (qualityById.get(b) ?? 0) - (qualityById.get(a) ?? 0)
    );
    const keeperIds = sorted.slice(0, 1);
    const duplicateIds = sorted.slice(1);

    for (const id of duplicateIds) toDelete.add(id);

    if (sampleClusters.length < 15) {
      const maxScore =
        duplicateIds.length > 0
          ? Math.max(
              ...duplicateIds.map((id) =>
                computeSimilarityScore(
                  signatures.get(keeperIds[0])!,
                  signatures.get(id)!,
                  htmlById.get(keeperIds[0])!,
                  htmlById.get(id)!
                )
              )
            )
          : 0;
      sampleClusters.push({
        keeperId: keeperIds[0],
        keeperTitle: records.find((r) => r.id === keeperIds[0])?.title ?? keeperIds[0],
        duplicateIds,
        maxScore,
      });
    }
  }

  const flaggedForManualReview: DedupReport['flaggedForManualReview'] = [];
  for (const pair of nearDuplicatePairs) {
    const key = [pair.id, pair.comparedTo].sort().join(':');
    if (flaggedSet.has(key)) continue;
    if (toDelete.has(pair.id) || toDelete.has(pair.comparedTo)) continue;
    flaggedSet.add(key);
    flaggedForManualReview.push(pair);
    if (flaggedForManualReview.length >= 100) break;
  }

  const updates = records.map((record) => {
    const isDup = toDelete.has(record.id);
    return {
      id: record.id,
      duplicate_score: maxScoreById.get(record.id) ?? 0,
      is_duplicate: isDup,
      keep_component: !isDup,
      replacement_needed: isDup,
    };
  });

  const uniqueCount = records.length - toDelete.size;

  const report: DedupReport = {
    totalComponents: records.length,
    uniqueComponents: uniqueCount,
    duplicatesFound: toDelete.size,
    nearDuplicatesFlagged: flaggedForManualReview.length,
    similarPairs,
    componentsToDelete: toDelete.size,
    replacementsRequired: toDelete.size,
    clustersFound: duplicateClusters.length,
    generatedAt: new Date().toISOString(),
    flaggedForManualReview,
    sampleClusters,
  };

  const reportDir = path.join(process.cwd(), 'scripts/component-library/catalog');
  await mkdir(reportDir, { recursive: true });
  const reportPath = path.join(reportDir, 'dedup-report.json');
  await writeFile(reportPath, JSON.stringify(report, null, 2));

  console.log('Duplicate detection report:');
  console.log(JSON.stringify(report, null, 2));
  console.log(`Report written to ${reportPath}`);

  if (!dryRun) {
    const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
    if (!connectionString?.trim()) {
      throw new Error('Missing DIRECT_URL for bulk duplicate flag updates.');
    }

    const sql = postgres(connectionString, { max: 1 });
    try {
      const batchSize = 250;
      for (let i = 0; i < updates.length; i += batchSize) {
        const batch = updates.slice(i, i + batchSize);
        const valueRows = batch
          .map(
            (row) =>
              `('${row.id}'::uuid, ${row.duplicate_score}, ${row.is_duplicate}, ${row.keep_component}, ${row.replacement_needed})`
          )
          .join(',');
        await sql.unsafe(`
          UPDATE components AS c SET
            duplicate_score = v.duplicate_score,
            is_duplicate = v.is_duplicate,
            keep_component = v.keep_component,
            replacement_needed = v.replacement_needed
          FROM (VALUES ${valueRows}) AS v(id, duplicate_score, is_duplicate, keep_component, replacement_needed)
          WHERE c.id = v.id
        `);
        console.log(`Updated ${Math.min(i + batchSize, updates.length)}/${updates.length}...`);
      }
      console.log(`Updated ${updates.length} component records with duplicate metadata.`);
    } finally {
      await sql.end();
    }
  } else {
    console.log('Dry run — no database updates. Re-run with --apply to persist flags.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
