import {
  LIBRARY_CATEGORIES,
  LIBRARY_INDUSTRIES,
  LIBRARY_STYLES,
  type LibraryIndustry,
  type LibraryStyle,
} from './constants';
import { computeContentHash } from './hash';
import { slugify } from './style-tokens';
import {
  extractComponentSignature,
  maxSimilarityAgainstLibrary,
  type ComponentRecord,
  type ComponentSignature,
} from './similarity';
import { generateComponent, type GeneratedComponent } from './templates';
import { renderReplacementLayout } from './replacement-layouts';
import { validateComponentHtml } from './validate';

export type ReplacementOptions = {
  category: string;
  maxSimilarity?: number;
  existingRecords: ComponentRecord[];
  seed?: number;
};

function toRecord(component: GeneratedComponent, categoryId: string | null): ComponentRecord {
  return {
    id: `candidate-${component.slug}`,
    title: component.name,
    description: component.description,
    code: component.code,
    category_id: categoryId,
    category_name: component.category,
    style_variant: component.style_variant,
    industry_variant: component.industry_variant,
    preview_metadata: {
      name: component.name,
      category: component.category,
      subtype: component.subtype,
      tags: component.tags,
      description: component.description,
      difficulty: component.difficulty,
      responsive: component.responsive,
      darkMode: component.darkMode,
    },
    tags: component.tags,
    difficulty: component.difficulty,
  };
}

function buildReplacementSlug(category: string, subtype: string, style: string, layoutSeed: number): string {
  const suffix = crypto.randomUUID().slice(0, 8);
  return slugify(`${category}-${subtype}-${style}-replacement-v${layoutSeed}-${suffix}`);
}

/** Generate a replacement component with max similarity <= threshold (default 60). */
export function generateUniqueReplacement(options: ReplacementOptions): GeneratedComponent | null {
  const maxSimilarity = options.maxSimilarity ?? 70;
  const subtypes = LIBRARY_CATEGORIES[options.category] ?? ['default'];
  const existingSignatures: ComponentSignature[] = options.existingRecords.map(extractComponentSignature);

  const start = options.seed ?? 0;
  const attempts: Array<[string, LibraryStyle, LibraryIndustry, number]> = [];

  for (let layoutSeed = 0; layoutSeed < 12; layoutSeed += 1) {
    for (const subtype of subtypes) {
      for (const style of LIBRARY_STYLES) {
        for (const industry of LIBRARY_INDUSTRIES) {
          attempts.push([subtype, style as LibraryStyle, industry as LibraryIndustry, layoutSeed]);
        }
      }
    }
  }

  const categoryLibrary = existingSignatures.filter((s) => s.category === options.category);
  const comparePool = (() => {
    const pool = categoryLibrary.length > 0 ? categoryLibrary : existingSignatures;
    const shuffled = [...pool].sort(
      (a, b) =>
        (a.id.charCodeAt(0) + (options.seed ?? 0)) % 97 -
        (b.id.charCodeAt(0) + (options.seed ?? 0)) % 97
    );
    return shuffled.slice(0, Math.min(120, shuffled.length));
  })();
  const compareHtml = new Map(
    options.existingRecords
      .filter((r) =>
        comparePool.some((s) => s.id === r.id)
      )
      .map((r) => [r.id, r.code])
  );

  const maxAttempts = Math.min(attempts.length, 360);

  for (let layoutOnly = 0; layoutOnly < 16; layoutOnly += 1) {
    const style = LIBRARY_STYLES[(start + layoutOnly) % LIBRARY_STYLES.length] as LibraryStyle;
    const industry = LIBRARY_INDUSTRIES[(start + layoutOnly) % LIBRARY_INDUSTRIES.length] as LibraryIndustry;
    const subtype = subtypes[(start + layoutOnly) % subtypes.length] ?? 'default';

    const layoutCode =
      renderReplacementLayout({
        category: options.category,
        subtype,
        style,
        industry,
        layoutSeed: start + layoutOnly,
      }) ??
      renderReplacementLayout({
        category: 'default',
        subtype,
        style,
        industry,
        layoutSeed: start + layoutOnly + 3,
      });
    if (!layoutCode) continue;

    const validation = validateComponentHtml(layoutCode, options.category);
    if (!validation.ok) continue;

    const record = toRecord(
      {
        name: `${options.category} replacement layout ${layoutOnly + 1}`,
        category: options.category,
        subtype: subtypes[layoutOnly % subtypes.length] ?? 'default',
        tags: ['replacement', options.category.toLowerCase()],
        description: `Structurally distinct ${options.category} replacement layout.`,
        difficulty: 'intermediate',
        responsive: true,
        darkMode: true,
        style_variant: LIBRARY_STYLES[(start + layoutOnly) % LIBRARY_STYLES.length] as LibraryStyle,
        industry_variant: LIBRARY_INDUSTRIES[(start + layoutOnly) % LIBRARY_INDUSTRIES.length] as LibraryIndustry,
        slug: 'temp',
        code: layoutCode,
        content_hash: '',
      },
      null
    );
    const signature = extractComponentSignature(record);
    const maxScore = maxSimilarityAgainstLibrary(signature, layoutCode, comparePool, compareHtml);
    if (maxScore > maxSimilarity) continue;

    const slug = buildReplacementSlug(options.category, subtype, style, start + layoutOnly);
    return {
      name: `${options.category} · ${subtype} replacement (${style})`,
      category: options.category,
      subtype,
      tags: [options.category.toLowerCase(), subtype, style, industry, 'replacement', 'ractrotech'],
      description: record.description,
      difficulty: 'intermediate',
      responsive: true,
      darkMode: true,
      style_variant: style,
      industry_variant: industry,
      slug,
      code: layoutCode,
      content_hash: computeContentHash(`${slug}:${layoutCode}`),
    };
  }

  for (let i = 0; i < maxAttempts; i += 1) {
    const index = (start + i) % attempts.length;
    const [subtype, style, industry, layoutSeed] = attempts[index];

    try {
      const component = generateComponent(options.category, subtype, style, industry, layoutSeed);
      const validation = validateComponentHtml(component.code, options.category);
      if (!validation.ok) continue;

      const record = toRecord(component, null);
      const signature = extractComponentSignature(record);
      const maxScore = maxSimilarityAgainstLibrary(
        signature,
        component.code,
        comparePool,
        compareHtml
      );

      if (maxScore > maxSimilarity) continue;

      const slug = buildReplacementSlug(options.category, subtype, style, layoutSeed);
      const contentHash = computeContentHash(`${slug}:${component.code}`);

      return {
        ...component,
        slug,
        content_hash: contentHash,
        tags: [...component.tags.filter((t) => t !== 'ractrotech'), 'replacement', 'ractrotech'],
        description: `Unique ${style} ${subtype} replacement for ${options.category} — distinct layout and interaction pattern.`,
      };
    } catch {
      continue;
    }
  }

  return null;
}

export function componentToDbPayload(
  component: GeneratedComponent,
  categoryId: string | null
) {
  return {
    title: component.name,
    description: component.description,
    code: component.code,
    category_id: categoryId,
    slug: component.slug,
    tags: component.tags,
    style_variant: component.style_variant,
    industry_variant: component.industry_variant,
    difficulty: component.difficulty,
    supports_dark_mode: component.darkMode,
    responsive: component.responsive,
    content_hash: component.content_hash,
    preview_metadata: {
      name: component.name,
      category: component.category,
      subtype: component.subtype,
      tags: component.tags,
      description: component.description,
      difficulty: component.difficulty,
      responsive: component.responsive,
      darkMode: component.darkMode,
    },
    duplicate_score: 0,
    is_duplicate: false,
    keep_component: true,
    replacement_needed: false,
  };
}
