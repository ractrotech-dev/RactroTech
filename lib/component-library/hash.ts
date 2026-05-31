import { createHash } from 'crypto';

/** Normalize HTML for stable dedup hashing. */
export function normalizeHtml(html: string): string {
  return html
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .trim()
    .replace(/class="([^"]*)"/g, (_, classes: string) => {
      const sorted = classes.split(/\s+/).filter(Boolean).sort().join(' ');
      return `class="${sorted}"`;
    });
}

export function computeContentHash(html: string): string {
  return createHash('sha256').update(normalizeHtml(html)).digest('hex');
}

export function computeStructuralFingerprint(html: string): string {
  const tags = Array.from(html.matchAll(/<(\w+)[^>]*class="([^"]*)"/g))
    .map((m) => `${m[1]}:${m[2].split(/\s+/).sort().join(' ')}`)
    .join('|');
  return createHash('sha256').update(tags).digest('hex').slice(0, 16);
}
