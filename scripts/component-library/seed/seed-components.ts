import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { generateLibraryComponents } from '../../../lib/component-library/generator';
import type { GeneratedComponent } from '../../../lib/component-library/templates';
import { createSeedClient } from './supabase-client';
import { verifyLibrarySchema } from './verify-schema';

type SeedOptions = {
  waveId?: number;
  target?: number;
  dryRun?: boolean;
  writeFiles?: boolean;
};

function parseArgs(): SeedOptions {
  const args = process.argv.slice(2);
  const opts: SeedOptions = { writeFiles: true };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--wave' && args[i + 1]) opts.waveId = Number(args[++i]);
    if (args[i] === '--target' && args[i + 1]) opts.target = Number(args[++i]);
    if (args[i] === '--dry-run') opts.dryRun = true;
    if (args[i] === '--no-files') opts.writeFiles = false;
  }
  return opts;
}

async function writeComponentFiles(components: GeneratedComponent[]) {
  const root = path.join(process.cwd(), 'scripts/component-library');
  await mkdir(path.join(root, 'manifests'), { recursive: true });
  await mkdir(path.join(root, 'generated'), { recursive: true });

  for (const component of components) {
    const categoryDir = component.category.replace(/\s+/g, '-').toLowerCase();
    const manifestDir = path.join(root, 'manifests', categoryDir);
    const generatedDir = path.join(root, 'generated', categoryDir);
    await mkdir(manifestDir, { recursive: true });
    await mkdir(generatedDir, { recursive: true });

    const preview = {
      name: component.name,
      category: component.category,
      tags: component.tags,
      description: component.description,
      difficulty: component.difficulty,
      responsive: component.responsive,
      darkMode: component.darkMode,
    };

    await writeFile(
      path.join(manifestDir, `${component.slug}.json`),
      JSON.stringify(preview, null, 2)
    );
    await writeFile(path.join(generatedDir, `${component.slug}.html`), component.code);
  }
}

async function seedToSupabase(components: GeneratedComponent[]) {
  const supabase = createSeedClient();
  if (!supabase) {
    console.warn('Supabase unavailable — skipped DB seed. Files written to scripts/component-library/.');
    return { inserted: 0, skipped: components.length };
  }

  const schema = await verifyLibrarySchema(supabase);
  if (!schema.ok) {
    console.error(schema.message);
    return { inserted: 0, skipped: components.length };
  }

  const { data: categories, error: categoryError } = await supabase
    .from('category')
    .select('id, name');

  if (categoryError) {
    console.error('Failed to load categories:', categoryError.message);
    console.error('Run `npm run library:seed:categories` first.');
    return { inserted: 0, skipped: components.length };
  }

  const categoryMap = new Map((categories ?? []).map((c) => [c.name, c.id]));
  if (categoryMap.size === 0) {
    console.error('No categories in database. Run `npm run library:seed:categories` first.');
    return { inserted: 0, skipped: components.length };
  }

  let inserted = 0;
  let skipped = 0;
  let failed = 0;
  const batchSize = 50;

  for (let i = 0; i < components.length; i += batchSize) {
    const batch = components.slice(i, i + batchSize).map((c) => ({
      title: c.name,
      description: c.description,
      code: c.code,
      slug: c.slug,
      tags: c.tags,
      style_variant: c.style_variant,
      industry_variant: c.industry_variant,
      difficulty: c.difficulty,
      supports_dark_mode: c.darkMode,
      responsive: c.responsive,
      category_id: categoryMap.get(c.category) ?? null,
      preview_metadata: {
        name: c.name,
        category: c.category,
        subtype: c.subtype,
        tags: c.tags,
        description: c.description,
        difficulty: c.difficulty,
        responsive: c.responsive,
        darkMode: c.darkMode,
      },
      content_hash: c.content_hash,
    }));

    const { data, error } = await supabase
      .from('components')
      .upsert(batch, { onConflict: 'slug', ignoreDuplicates: false })
      .select('id');

    if (error) {
      console.error(`Batch ${Math.floor(i / batchSize) + 1} failed:`, error.message);
      failed += batch.length;
    } else {
      inserted += data?.length ?? batch.length;
    }
  }

  skipped = components.length - inserted - failed;
  return { inserted, skipped, failed };
}

async function main() {
  const opts = parseArgs();
  console.log('Generating components...', opts);

  const { components, stats } = generateLibraryComponents({
    waveId: opts.waveId,
    target: opts.target,
  });

  console.log('Generation stats:', stats);
  console.log(`Generated ${components.length} unique components.`);

  if (opts.writeFiles && components.length > 0) {
    await writeComponentFiles(components);
    console.log('Wrote manifests and HTML to scripts/component-library/.');
  }

  if (!opts.dryRun && components.length > 0) {
    const result = await seedToSupabase(components);
    const failed = 'failed' in result ? result.failed : 0;
    console.log(
      `Supabase seed: ${result.inserted} inserted, ${result.skipped} skipped, ${failed ?? 0} failed.`
    );
    if (result.inserted === 0) {
      process.exit(1);
    }
  }

  await writeFile(
    path.join(process.cwd(), 'scripts/component-library/catalog/last-run.json'),
    JSON.stringify({ stats, count: components.length, at: new Date().toISOString() }, null, 2)
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
