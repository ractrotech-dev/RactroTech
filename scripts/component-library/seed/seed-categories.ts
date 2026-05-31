import { LIBRARY_CATEGORIES } from '../../../lib/component-library/constants';
import { slugify } from '../../../lib/component-library/style-tokens';
import { createSeedClient } from './supabase-client';
import { verifyLibrarySchema } from './verify-schema';

async function main() {
  const supabase = createSeedClient();
  if (!supabase) {
    console.error('Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
    process.exit(1);
  }

  const schema = await verifyLibrarySchema(supabase);
  if (!schema.ok) {
    console.error(schema.message);
    process.exit(1);
  }

  const categories = Object.keys(LIBRARY_CATEGORIES);
  let upserted = 0;

  for (const name of categories) {
    const slug = slugify(name);
    const { error } = await supabase.from('category').upsert({ name, slug }, { onConflict: 'name' });
    if (error) {
      console.error(`Failed to upsert category ${name}:`, error.message);
    } else {
      upserted++;
    }
  }

  console.log(`Seeded ${upserted}/${categories.length} categories.`);
  if (upserted === 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
