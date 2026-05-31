import type { LibraryIndustry, LibraryStyle } from './constants';
import { getIndustryLabel, getStyleTokens } from './style-tokens';

type LayoutCtx = {
  category: string;
  subtype: string;
  style: LibraryStyle;
  industry: LibraryIndustry;
  layoutSeed: number;
};

/** Alternate layout shells used only for replacement generation (structurally distinct). */
export function renderReplacementLayout(ctx: LayoutCtx): string | null {
  const tokens = getStyleTokens(ctx.style);
  const brand = getIndustryLabel(ctx.industry);

  const shells: Record<string, string[]> = {
    Buttons: [
      `<div class="flex flex-col items-start gap-3 max-w-sm"><span class="text-xs font-semibold uppercase ${tokens.textMuted}">${brand}</span><button type="button" class="${tokens.buttonPrimary} w-full sm:w-auto">Get started</button><button type="button" class="${tokens.buttonGhost} w-full sm:w-auto">Learn more</button></div>`,
      `<div class="grid grid-cols-2 gap-2 max-w-md">${Array.from({ length: 4 }, (_, i) => `<button type="button" class="${tokens.buttonSecondary} text-xs py-2 focus-visible:outline-none focus-visible:ring-2 ${tokens.ring}">Action ${i + 1}</button>`).join('')}</div>`,
      `<div class="inline-flex rounded-lg border-2 ${tokens.border} p-1 gap-1"><button type="button" class="${tokens.buttonPrimary} px-4 py-2 text-sm">Active</button><button type="button" class="${tokens.buttonGhost} px-4 py-2 text-sm">Tab</button><button type="button" class="${tokens.buttonGhost} px-4 py-2 text-sm">Tab</button></div>`,
      `<div class="flex items-center gap-4 ${tokens.card} p-4 max-w-lg"><div class="h-12 w-12 rounded-full ${tokens.accent} ${tokens.accentText} flex items-center justify-center font-bold" aria-hidden="true">RT</div><div class="flex-1"><p class="font-semibold text-sm">Upgrade ${brand}</p><p class="text-xs ${tokens.textMuted}">Unlock pro features</p></div><button type="button" class="${tokens.buttonPrimary} shrink-0 text-sm px-4 py-2">Upgrade</button></div>`,
      `<ul class="space-y-2 max-w-sm">${['Save draft', 'Publish', 'Share link'].map((l) => `<li><button type="button" class="${tokens.buttonSecondary} w-full text-left px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 ${tokens.ring}">${l}</button></li>`).join('')}</ul>`,
      `<div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center max-w-xl"><input type="email" class="${tokens.input} flex-1" placeholder="Enter email" aria-label="Email" /><button type="button" class="${tokens.buttonPrimary} shrink-0 px-5 py-2.5">Subscribe</button></div>`,
      `<div class="relative ${tokens.card} p-6 max-w-md text-center"><p class="text-sm ${tokens.textMuted} mb-4">Ready to ship with ${brand}?</p><div class="flex flex-col sm:flex-row gap-2 justify-center"><button type="button" class="${tokens.buttonPrimary}">Start trial</button><button type="button" class="${tokens.buttonSecondary}">Book demo</button></div></div>`,
      `<nav class="flex flex-wrap gap-2" aria-label="Actions">${['Create', 'Import', 'Export'].map((l) => `<button type="button" class="${tokens.buttonGhost} border ${tokens.border} px-3 py-1.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 ${tokens.ring}">${l}</button>`).join('')}</nav>`,
    ],
    default: [
      `<div class="${tokens.card} p-8 max-w-xl mx-auto text-center"><h2 class="text-2xl font-bold mb-3">${brand} ${ctx.category}</h2><p class="text-sm ${tokens.textMuted} mb-6">Alternate ${ctx.subtype} layout for ${brand}.</p><button type="button" class="${tokens.buttonPrimary}">Explore</button></div>`,
      `<div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">${[1, 2, 3].map((n) => `<div class="${tokens.card} p-4"><h3 class="font-semibold mb-2">Block ${n}</h3><p class="text-sm ${tokens.textMuted}">${brand} content area.</p></div>`).join('')}</div>`,
      `<aside class="${tokens.card} p-4 w-full max-w-xs" aria-label="Panel"><h3 class="font-bold mb-3">${ctx.category}</h3><ol class="list-decimal list-inside text-sm space-y-1 ${tokens.textMuted}"><li>Step one</li><li>Step two</li><li>Step three</li></ol></aside>`,
      `<div class="flex flex-col-reverse sm:flex-row gap-6 items-center max-w-3xl mx-auto ${tokens.card} p-6"><div class="flex-1"><h2 class="text-xl font-bold mb-2">Reversed layout</h2><p class="text-sm ${tokens.textMuted}">Visual hierarchy flip for ${brand}.</p></div><div class="w-full sm:w-40 h-32 ${tokens.surfaceMuted} rounded-lg"></div></div>`,
      `<details class="${tokens.card} p-4 max-w-lg group"><summary class="font-semibold cursor-pointer list-none flex justify-between focus-visible:outline-none focus-visible:ring-2 ${tokens.ring} rounded">Expand ${ctx.subtype}<span aria-hidden="true">+</span></summary><p class="mt-3 text-sm ${tokens.textMuted}">Hidden panel content for ${brand}.</p></details>`,
      `<div class="overflow-x-auto max-w-2xl"><div class="flex gap-4 min-w-max pb-2">${[1, 2, 3, 4].map((n) => `<article class="${tokens.card} p-4 w-48 shrink-0"><p class="font-semibold">Slide ${n}</p><p class="text-xs ${tokens.textMuted} mt-1">Horizontal scroll pattern.</p></article>`).join('')}</div></div>`,
      `<div class="max-w-lg mx-auto border-2 border-dashed ${tokens.border} rounded-xl p-6 text-center"><p class="text-sm font-medium mb-2">Empty state</p><p class="text-xs ${tokens.textMuted} mb-4">No ${ctx.subtype} items yet.</p><button type="button" class="${tokens.buttonPrimary} text-sm px-4 py-2">Add first item</button></div>`,
      `<div class="grid grid-cols-12 gap-3 max-w-3xl mx-auto"><div class="col-span-12 md:col-span-4 ${tokens.card} p-4">Sidebar</div><div class="col-span-12 md:col-span-8 ${tokens.card} p-4">Main ${ctx.category} content for ${brand}.</div></div>`,
      `<div class="max-w-2xl mx-auto ${tokens.card} p-6"><div class="flex border-b ${tokens.border} mb-4 gap-4 text-sm">${['Overview', 'Settings', 'Billing'].map((t, i) => `<button type="button" class="pb-2 font-medium ${i === 0 ? 'border-b-2 border-current' : tokens.textMuted} focus-visible:outline-none focus-visible:ring-2 ${tokens.ring} rounded px-1">${t}</button>`).join('')}</div><p class="text-sm ${tokens.textMuted}">Tabbed panel layout for ${brand}.</p></div>`,
      `<ol class="max-w-lg mx-auto space-y-4">${[1, 2, 3].map((step) => `<li class="flex gap-4"><span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${tokens.accent} ${tokens.accentText} text-sm font-bold">${step}</span><div class="${tokens.card} flex-1 p-4"><p class="font-semibold text-sm">Step ${step}</p><p class="text-xs ${tokens.textMuted} mt-1">${ctx.subtype} workflow</p></div></li>`).join('')}</ol>`,
      `<div class="overflow-x-auto max-w-3xl mx-auto ${tokens.card}"><table class="w-full text-sm"><thead class="${tokens.surfaceMuted}"><tr><th class="px-4 py-3 text-left">Metric</th><th class="px-4 py-3 text-right">Value</th></tr></thead><tbody><tr class="border-t ${tokens.border}"><td class="px-4 py-3">Active users</td><td class="px-4 py-3 text-right font-bold">2.4k</td></tr><tr class="border-t ${tokens.border}"><td class="px-4 py-3">Conversion</td><td class="px-4 py-3 text-right font-bold">4.2%</td></tr></tbody></table></div>`,
      `<div class="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">${['MRR', 'Churn', 'NPS', 'LTV'].map((label, i) => `<div class="${tokens.card} p-4 text-center"><p class="text-xs ${tokens.textMuted} uppercase">${label}</p><p class="text-xl font-bold mt-1">${['$18k', '2.1%', '62', '$420'][i]}</p></div>`).join('')}</div>`,
      `<div class="max-w-md mx-auto ${tokens.card} p-6 shadow-lg"><p class="text-xs font-semibold uppercase ${tokens.textMuted} mb-2">Modal pattern</p><h3 class="text-lg font-bold mb-2">Confirm action</h3><p class="text-sm ${tokens.textMuted} mb-4">Proceed with ${brand} ${ctx.subtype} update?</p><div class="flex gap-2 justify-end"><button type="button" class="${tokens.buttonGhost} px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 ${tokens.ring}">Cancel</button><button type="button" class="${tokens.buttonPrimary} px-4 py-2 text-sm">Confirm</button></div></div>`,
      `<div class="grid grid-cols-1 md:grid-cols-4 gap-3 max-w-4xl mx-auto">${['Hero block', 'Stat A', 'Stat B', 'Wide chart', 'Wide list'].map((label, i) => `<div class="${tokens.card} p-4 min-h-[72px] flex items-center justify-center text-sm font-semibold">${label}</div>`).join('')}</div>`,
      `<div class="relative max-w-xl mx-auto pl-6 border-l-2 ${tokens.border} space-y-6">${[1, 2, 3].map((n) => `<div class="relative"><span class="absolute -left-[1.6rem] top-1 h-3 w-3 rounded-full ${tokens.accent}"></span><p class="text-sm font-semibold">Timeline event ${n}</p><p class="text-xs ${tokens.textMuted}">${brand} milestone</p></div>`).join('')}</div>`,
    ],
  };

  const options = shells[ctx.category] ?? shells.default;
  const v = (ctx.layoutSeed * 5 + ctx.category.length + ctx.subtype.length) % options.length;
  const inner = options[v];

  return `<section class="${tokens.surface} ${tokens.darkSurface ?? ''} py-8 sm:py-12 ${tokens.text} ${tokens.darkText ?? ''}">
  <div class="${tokens.container}">
    ${inner}
  </div>
</section>`;
}
