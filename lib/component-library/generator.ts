import {
  LIBRARY_CATEGORIES,
  LIBRARY_INDUSTRIES,
  LIBRARY_STYLES,
  LIBRARY_WAVES,
  type LibraryIndustry,
  type LibraryStyle,
} from './constants';
import { computeContentHash } from './hash';
import { generateComponent, type GeneratedComponent } from './templates';
import { validateComponentHtml } from './validate';

export type GenerationStats = {
  generated: number;
  skippedDuplicate: number;
  skippedInvalid: number;
  errors: string[];
};

export type GenerationOptions = {
  waveId?: number;
  target?: number;
};

export function generateLibraryComponents(options: GenerationOptions = {}): {
  components: GeneratedComponent[];
  stats: GenerationStats;
} {
  const contentHashes = new Set<string>();
  const components: GeneratedComponent[] = [];
  const stats: GenerationStats = {
    generated: 0,
    skippedDuplicate: 0,
    skippedInvalid: 0,
    errors: [],
  };

  const waves = options.waveId
    ? LIBRARY_WAVES.filter((w) => w.id === options.waveId)
    : [...LIBRARY_WAVES];

  const maxTotal = options.target ?? LIBRARY_WAVES.reduce((s, w) => s + w.target, 0);

  for (const wave of waves) {
    if (components.length >= maxTotal) break;

    const waveTarget =
      options.waveId && options.target ? options.target : Math.min(wave.target, maxTotal - components.length);

    let waveCount = 0;
    let done = false;

    for (const category of wave.categories) {
      if (done) break;
      const subtypes = LIBRARY_CATEGORIES[category] ?? [];

      for (const subtype of subtypes) {
        if (done) break;

        for (const style of LIBRARY_STYLES) {
          if (done) break;

          for (const industry of LIBRARY_INDUSTRIES) {
            if (waveCount >= waveTarget || components.length >= maxTotal) {
              done = true;
              break;
            }

            try {
              const component = generateComponent(
                category,
                subtype,
                style as LibraryStyle,
                industry as LibraryIndustry
              );

              const validation = validateComponentHtml(component.code, category);
              if (!validation.ok) {
                stats.skippedInvalid++;
                if (stats.errors.length < 50) {
                  stats.errors.push(`${component.slug}: ${validation.errors.join(', ')}`);
                }
                continue;
              }

              if (contentHashes.has(component.content_hash)) {
                stats.skippedDuplicate++;
                continue;
              }

              contentHashes.add(component.content_hash);
              components.push(component);
              waveCount++;
              stats.generated++;
            } catch (err) {
              if (stats.errors.length < 50) {
                stats.errors.push(
                  `${category}/${subtype}/${style}/${industry}: ${err instanceof Error ? err.message : String(err)}`
                );
              }
            }
          }
        }
      }
    }
  }

  return { components, stats };
}
