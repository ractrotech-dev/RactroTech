/**
 * The marketing tone vocabulary — the set of pastel fills a card can be painted in.
 *
 * Only the *names* live here, deliberately. The Tailwind classes that realise them are in
 * components/marketing/tone-card.tsx, because tailwind.config.ts does not scan `./lib/**`:
 * a class string written in this file would never make it into the stylesheet. Keeping the
 * vocabulary in the data layer and the classes in the view layer means content files
 * (home-content.ts, service-pages.ts) can pick a tone without importing a component.
 */

export const TONES = ['mint', 'sky', 'butter', 'pink', 'lilac', 'peach'] as const;

export type Tone = (typeof TONES)[number];

/**
 * Tone for item `index` of a list whose length is not known at authoring time — review
 * walls, tag rows. Deterministic, so a given card keeps its colour between server renders
 * instead of flickering to a new one on every request.
 *
 * The stride walks mint → peach → lilac → pink → butter → sky, alternating warm and cool
 * instead of running the two greens (mint, butter) back to back the way a plain
 * `index % length` would. It must stay coprime with TONES.length or the walk short-cycles
 * and only ever reaches a subset of the palette — 5 and 6 are coprime, 2 and 6 are not.
 */
export function toneFor(index: number): Tone {
  return TONES[(index * 5) % TONES.length];
}
