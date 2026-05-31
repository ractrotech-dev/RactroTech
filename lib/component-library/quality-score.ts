import type { ComponentRecord } from './similarity';
import { validateComponentHtml } from './validate';

/** Higher score = better candidate to keep in a duplicate cluster. */
export function computeQualityScore(record: ComponentRecord): number {
  let score = 0;
  const html = record.code ?? '';
  const category = record.category_name ?? record.preview_metadata?.category ?? 'Custom';

  const validation = validateComponentHtml(html, category);
  if (validation.ok) score += 30;

  const responsiveMatches = html.match(/\b(sm|md|lg|xl):/g) ?? [];
  score += Math.min(15, responsiveMatches.length * 2);

  const ariaMatches = html.match(/aria-[a-z]+=/gi) ?? [];
  score += Math.min(10, ariaMatches.length * 3);

  const roleMatches = html.match(/role="[^"]+"/gi) ?? [];
  score += Math.min(8, roleMatches.length * 4);

  score += Math.min(10, Math.floor((record.description?.length ?? 0) / 20));

  if (record.preview_metadata) score += 8;

  const tagCount = (record.tags ?? record.preview_metadata?.tags ?? []).length;
  score += Math.min(6, tagCount);

  if (record.difficulty === 'advanced') score += 4;
  else if (record.difficulty === 'intermediate') score += 2;

  if ((record.tags ?? []).includes('custom')) score += 3;

  score += Math.min(12, Math.floor(html.length / 400));

  return score;
}
