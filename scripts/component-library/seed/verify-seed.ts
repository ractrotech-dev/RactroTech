import { createSeedClient } from './supabase-client';
import { verifyLibrarySchema } from './verify-schema';

async function main() {
  const supabase = createSeedClient();
  if (!supabase) {
    console.error('FAIL: Supabase client not configured');
    process.exit(1);
  }

  const schema = await verifyLibrarySchema(supabase);
  console.log('Schema:', schema.ok ? 'OK' : `FAIL — ${schema.message}`);
  if (!schema.ok) process.exit(1);

  const { count: catCount, error: catErr } = await supabase
    .from('category')
    .select('*', { count: 'exact', head: true });
  const { count: compCount, error: compErr } = await supabase
    .from('components')
    .select('*', { count: 'exact', head: true });

  if (catErr || compErr) {
    console.error('FAIL: count query error', catErr?.message ?? compErr?.message);
    process.exit(1);
  }

  console.log(`Categories: ${catCount} (expected 22)`);
  console.log(`Components: ${compCount} (expected 3000)`);

  const { count: noCategory } = await supabase
    .from('components')
    .select('*', { count: 'exact', head: true })
    .is('category_id', null);
  const { count: noSlug } = await supabase
    .from('components')
    .select('*', { count: 'exact', head: true })
    .is('slug', null);
  const { count: noHash } = await supabase
    .from('components')
    .select('*', { count: 'exact', head: true })
    .is('content_hash', null);

  console.log(`Missing category_id: ${noCategory}`);
  console.log(`Missing slug: ${noSlug}`);
  console.log(`Missing content_hash: ${noHash}`);

  const { data: sample, error: sampleErr } = await supabase
    .from('components')
    .select('id, title, slug, code, style_variant, industry_variant, preview_metadata')
    .limit(1)
    .single();

  if (sampleErr || !sample) {
    console.error('FAIL: could not fetch sample component', sampleErr?.message);
    process.exit(1);
  }

  const hasCode = (sample.code?.length ?? 0) > 50;
  const hasMeta = sample.preview_metadata != null;
  console.log(`Sample slug: ${sample.slug}`);
  console.log(`Sample has HTML: ${hasCode}`);
  console.log(`Sample has preview_metadata: ${hasMeta}`);

  const ok =
    catCount === 22 &&
    compCount === 3000 &&
    noCategory === 0 &&
    noSlug === 0 &&
    noHash === 0 &&
    hasCode &&
    hasMeta;

  if (ok) {
    console.log('\nPASS: Component library seed verified.');
  } else {
    console.log('\nFAIL: Seed verification did not pass all checks.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
