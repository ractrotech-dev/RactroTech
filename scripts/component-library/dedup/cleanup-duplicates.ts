import { execSync } from 'child_process';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import postgres from 'postgres';
import type { DedupReport } from './scan-duplicates';

function parseArgs() {
  const dryRun = !process.argv.includes('--apply');
  const skipRescan = process.argv.includes('--skip-rescan');
  return { dryRun, skipRescan };
}

async function countDuplicates(sql: postgres.Sql): Promise<number> {
  const rows = await sql<{ count: string }[]>`
    SELECT count(*)::text AS count
    FROM components
    WHERE is_duplicate = true AND keep_component = false
  `;
  return Number(rows[0]?.count ?? 0);
}

async function countAll(sql: postgres.Sql): Promise<number> {
  const rows = await sql<{ count: string }[]>`
    SELECT count(*)::text AS count FROM components
  `;
  return Number(rows[0]?.count ?? 0);
}

async function main() {
  const { dryRun, skipRescan } = parseArgs();
  console.log(`Duplicate cleanup (${dryRun ? 'dry run' : 'apply'})...`);

  if (!skipRescan) {
    console.log('Refreshing duplicate flags (scan --apply)...');
    execSync('tsx --env-file=.env scripts/component-library/dedup/scan-duplicates.ts --apply', {
      cwd: process.cwd(),
      stdio: 'inherit',
    });
  }

  const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!connectionString?.trim()) {
    throw new Error('Missing DIRECT_URL for bulk duplicate cleanup.');
  }

  const sql = postgres(connectionString, { max: 1 });
  try {
    const beforeTotal = await countAll(sql);
    const toDelete = await countDuplicates(sql);
    console.log(`Found ${toDelete} duplicates to delete (${beforeTotal} total rows).`);

    if (toDelete === 0) {
      console.log('Nothing to delete. Run library:dedup:scan:apply first if flags are stale.');
      return;
    }

    const remaining = beforeTotal - toDelete;
    console.log(`After cleanup: ~${remaining} components will remain.`);

    if (dryRun) {
      console.log('Dry run — no rows deleted. Re-run with --apply to delete duplicates.');
      return;
    }

    const batchSize = 500;
    let deleted = 0;
    while (deleted < toDelete) {
      const result = await sql`
        DELETE FROM components
        WHERE id IN (
          SELECT id FROM components
          WHERE is_duplicate = true AND keep_component = false
          LIMIT ${batchSize}
        )
      `;
      const batchDeleted = result.count;
      if (batchDeleted === 0) break;
      deleted += batchDeleted;
      console.log(`Deleted ${deleted}/${toDelete}...`);
    }

    await sql`
      UPDATE components SET
        duplicate_score = 0,
        is_duplicate = false,
        keep_component = true,
        replacement_needed = false
    `;

    const afterTotal = await countAll(sql);
    console.log(`Cleanup complete: deleted ${deleted} duplicates, ${afterTotal} components remain.`);

    const reportPath = path.join(process.cwd(), 'scripts/component-library/catalog/dedup-report.json');
    let report: DedupReport & { cleanupPhase?: Record<string, unknown> } = {
      totalComponents: beforeTotal,
      uniqueComponents: afterTotal,
      duplicatesFound: deleted,
      nearDuplicatesFlagged: 0,
      similarPairs: 0,
      componentsToDelete: 0,
      replacementsRequired: 0,
      clustersFound: 0,
      generatedAt: new Date().toISOString(),
      flaggedForManualReview: [],
      sampleClusters: [],
    };

    try {
      report = JSON.parse(await readFile(reportPath, 'utf8'));
    } catch {
      /* use defaults */
    }

    report.totalComponents = afterTotal;
    report.uniqueComponents = afterTotal;
    report.duplicatesFound = 0;
    report.componentsToDelete = 0;
    report.replacementsRequired = 0;
    report.cleanupPhase = {
      deleted,
      beforeTotal,
      afterTotal,
      dryRun: false,
      completedAt: new Date().toISOString(),
    };

    const catalogDir = path.join(process.cwd(), 'scripts/component-library/catalog');
    await mkdir(catalogDir, { recursive: true });
    await writeFile(reportPath, JSON.stringify(report, null, 2));

    const logPath = path.join(catalogDir, 'cleanup-log.txt');
    await writeFile(
      logPath,
      `Cleanup ${new Date().toISOString()}: deleted ${deleted}, remaining ${afterTotal}\n`,
      { flag: 'a' }
    );
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
