import type { PreviewMetadata } from '@/components/sections/components/types';
import { computeContentHash, normalizeHtml } from './hash';

export type SimilarityClassification = 'unique' | 'similar' | 'near-duplicate' | 'duplicate';

export type ComponentRecord = {
  id: string;
  title: string;
  description: string;
  code: string;
  category_id: string | null;
  category_name?: string | null;
  style_variant?: string | null;
  industry_variant?: string | null;
  preview_metadata?: PreviewMetadata | null;
  tags?: string[] | null;
  difficulty?: string | null;
};

export type ComponentSignature = {
  id: string;
  category: string;
  tagSequence: string[];
  layoutClasses: string[];
  tailwindPatterns: string[];
  treeDepth: number;
  interactionModel: string;
  layoutPattern: string;
  metadataKey: string;
  normalizedHtml: string;
  contentHash: string;
};

const INTERACTION_TAGS = ['button', 'a', 'input', 'select', 'textarea', 'form', 'details', 'summary'] as const;

/** Strip color/spacing noise so structure comparisons focus on layout. */
export function normalizeClassesForComparison(classes: string): string {
  return classes
    .split(/\s+/)
    .filter(Boolean)
    .filter(
      (c) =>
        !/^((bg|text|border|ring|from|to|via|shadow|opacity|divide|outline)-)/.test(c) &&
        !/^(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|space)-/.test(c)
    )
    .sort()
    .join(' ');
}

function extractTags(html: string): string[] {
  return Array.from(html.matchAll(/<\/?(\w+)[^>]*>/g))
    .map((m) => m[1].toLowerCase())
    .filter((tag) => !['html', 'body', 'head', 'meta', 'script', 'style', 'link'].includes(tag));
}

function extractClassTokens(html: string): string[] {
  const tokens = new Set<string>();
  for (const match of Array.from(html.matchAll(/class="([^"]*)"/g))) {
    for (const token of match[1].split(/\s+/).filter(Boolean)) {
      tokens.add(token);
    }
  }
  return Array.from(tokens).sort();
}

function extractLayoutClasses(html: string): string[] {
  return extractClassTokens(html).filter((t) =>
    /^(grid|flex|col-|row-|inline-flex|block|hidden|table|fixed|absolute|relative|sticky)/.test(t)
  );
}

function detectLayoutPattern(html: string): string {
  const classes = extractClassTokens(html).join(' ');
  if (/grid-cols-\d|grid-rows-\d|\bgrid\b/.test(classes) && /col-span|kanban|pipeline/i.test(html)) {
    return 'kanban';
  }
  if (/\btable\b|<table/i.test(html)) return 'table';
  if (/\bfixed\b/.test(classes)) return 'fixed';
  if (/\babsolute\b/.test(classes)) return 'absolute';
  if (/sidebar|aside/i.test(html)) return 'sidebar';
  if (/grid-cols-2|lg:grid-cols-2|md:grid-cols-2/.test(classes)) return 'split';
  if (/\bgrid\b/.test(classes)) return 'grid';
  if (/\bflex\b/.test(classes)) return 'flex';
  return 'stack';
}

function computeTreeDepth(html: string): number {
  let depth = 0;
  let max = 0;
  for (const match of html.matchAll(/<\/?(\w+)[^>]*>/g)) {
    const tag = match[0];
    if (tag.startsWith('</')) {
      depth = Math.max(0, depth - 1);
    } else if (!/\/>$/.test(tag) && !/^<(br|hr|img|input|meta|link)/i.test(tag)) {
      depth += 1;
      max = Math.max(max, depth);
    }
  }
  return max;
}

function buildInteractionModel(html: string): string {
  const counts: Record<string, number> = {};
  for (const tag of INTERACTION_TAGS) {
    counts[tag] = (html.match(new RegExp(`<${tag}\\b`, 'gi')) ?? []).length;
  }
  return Object.entries(counts)
    .filter(([, n]) => n > 0)
    .map(([k, v]) => `${k}:${v}`)
    .join('|');
}

function extractTailwindPatterns(classes: string[]): string[] {
  const patterns = new Set<string>();
  for (const cls of classes) {
    if (/^rounded/.test(cls)) patterns.add('rounded');
    if (/^shadow/.test(cls)) patterns.add('shadow');
    if (/^border/.test(cls)) patterns.add('border');
    if (/^aspect-/.test(cls)) patterns.add('aspect-ratio');
    if (/^overflow-/.test(cls)) patterns.add('overflow');
    if (/^(sm|md|lg|xl):/.test(cls)) patterns.add('responsive');
    if (/^hover:|^focus-visible:/.test(cls)) patterns.add('interactive-state');
    if (/^grid-|^col-|^row-/.test(cls)) patterns.add('grid-system');
    if (/^flex|^inline-flex|^items-|^justify-/.test(cls)) patterns.add('flex-system');
    if (/^text-|^font-|^tracking-|^leading-/.test(cls)) patterns.add('typography');
    if (/^min-h-|^max-w-|^w-|^h-/.test(cls)) patterns.add('sizing');
  }
  return [...patterns].sort();
}

function buildMetadataKey(record: ComponentRecord): string {
  const meta = record.preview_metadata;
  const tags = [...(record.tags ?? meta?.tags ?? [])].sort().join(',');
  return [
    record.category_name ?? meta?.category ?? '',
    meta?.subtype ?? '',
    record.style_variant ?? '',
    record.industry_variant ?? '',
    tags,
    record.title.toLowerCase(),
  ].join('|');
}

export function extractComponentSignature(record: ComponentRecord): ComponentSignature {
  const html = record.code ?? '';
  const classTokens = extractClassTokens(html);
  const normalized = normalizeHtml(html);

  return {
    id: record.id,
    category: record.category_name ?? record.preview_metadata?.category ?? 'Unknown',
    tagSequence: extractTags(html),
    layoutClasses: extractLayoutClasses(html),
    tailwindPatterns: extractTailwindPatterns(classTokens),
    treeDepth: computeTreeDepth(html),
    interactionModel: buildInteractionModel(html),
    layoutPattern: detectLayoutPattern(html),
    metadataKey: buildMetadataKey(record),
    normalizedHtml: normalized,
    contentHash: computeContentHash(normalized),
  };
}

function jaccardSimilarity(a: string[], b: string[]): number {
  if (a.length === 0 && b.length === 0) return 1;
  const setA = new Set(a);
  const setB = new Set(b);
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection += 1;
  }
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

function lcsRatio(a: string[], b: string[]): number {
  const m = a.length;
  const n = b.length;
  if (m === 0 || n === 0) return 0;
  const dp = Array.from({ length: m + 1 }, () => Array<number>(n + 1).fill(0));
  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return (2 * dp[m][n]) / (m + n);
}

function metadataSimilarity(a: ComponentSignature, b: ComponentSignature): number {
  const partsA = a.metadataKey.split('|');
  const partsB = b.metadataKey.split('|');
  let score = 0;
  let weight = 0;
  for (let i = 0; i < Math.max(partsA.length, partsB.length); i += 1) {
    weight += 1;
    if (partsA[i] && partsA[i] === partsB[i]) score += 1;
  }
  return weight === 0 ? 0 : score / weight;
}

/** Weighted similarity score 0-100 across structure, classes, layout, depth, interaction, metadata. */
export function computeSimilarityScore(
  a: ComponentSignature,
  b: ComponentSignature,
  htmlA: string,
  htmlB: string
): number {
  if (a.contentHash === b.contentHash) return 100;

  const normalizedA = normalizeClassesForComparison(
    Array.from(htmlA.matchAll(/class="([^"]*)"/g))
      .map((m) => m[1])
      .join(' ')
  );
  const normalizedB = normalizeClassesForComparison(
    Array.from(htmlB.matchAll(/class="([^"]*)"/g))
      .map((m) => m[1])
      .join(' ')
  );

  const domScore = lcsRatio(a.tagSequence, b.tagSequence) * 100;
  const classScore = jaccardSimilarity(normalizedA.split(' '), normalizedB.split(' ')) * 100;
  const layoutClassScore = jaccardSimilarity(a.layoutClasses, b.layoutClasses) * 100;
  const layoutPatternScore = a.layoutPattern === b.layoutPattern ? 100 : 0;
  const layoutScore = layoutClassScore * 0.6 + layoutPatternScore * 0.4;
  const depthScore =
    (1 - Math.abs(a.treeDepth - b.treeDepth) / Math.max(a.treeDepth, b.treeDepth, 1)) * 100;
  const interactionScore =
    a.interactionModel === b.interactionModel
      ? 100
      : jaccardSimilarity(
          a.interactionModel.split('|').filter(Boolean),
          b.interactionModel.split('|').filter(Boolean)
        ) * 100;
  const tailwindScore = jaccardSimilarity(a.tailwindPatterns, b.tailwindPatterns) * 100;
  const metaScore = metadataSimilarity(a, b) * 100;

  const weighted =
    domScore * 0.25 +
    Math.max(classScore, tailwindScore) * 0.2 +
    layoutScore * 0.2 +
    depthScore * 0.1 +
    interactionScore * 0.15 +
    metaScore * 0.1;

  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function classifySimilarity(score: number): SimilarityClassification {
  if (score >= 86) return 'duplicate';
  if (score >= 71) return 'near-duplicate';
  if (score >= 51) return 'similar';
  return 'unique';
}

export function bucketKey(sig: ComponentSignature): string {
  return `${sig.category}|${sig.layoutPattern}|${sig.interactionModel}|${Math.min(sig.treeDepth, 12)}`;
}

export function maxSimilarityAgainstLibrary(
  candidate: ComponentSignature,
  candidateHtml: string,
  library: ComponentSignature[],
  libraryHtml: Map<string, string>,
  excludeId?: string
): number {
  let max = 0;
  for (const existing of library) {
    if (existing.id === excludeId || existing.id === candidate.id) continue;
    const score = computeSimilarityScore(
      candidate,
      existing,
      candidateHtml,
      libraryHtml.get(existing.id) ?? ''
    );
    max = Math.max(max, score);
  }
  return max;
}
