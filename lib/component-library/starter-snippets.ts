export type StarterSnippet = {
  id: string;
  label: string;
  title: string;
  description: string;
  code: string;
};

export const STARTER_SNIPPETS: StarterSnippet[] = [
  {
    id: 'card',
    label: 'Card',
    title: 'Starter card',
    description: 'A minimal card with title, body text, and a primary action.',
    code: `<div class="flex items-center justify-center min-h-[240px] bg-slate-950 p-6">
  <div class="max-w-sm w-full rounded-2xl bg-slate-900/60 border border-slate-800 p-6 shadow-xl">
    <p class="text-xs font-semibold uppercase tracking-widest text-sky-400 mb-2">Component</p>
    <h2 class="text-lg font-semibold text-slate-50 mb-1">Starter card</h2>
    <p class="text-sm text-slate-400 mb-4">Paste Tailwind HTML here and preview it live.</p>
    <button type="button" class="inline-flex items-center justify-center rounded-md bg-sky-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-400 transition-colors">
      Primary action
    </button>
  </div>
</div>`,
  },
  {
    id: 'button',
    label: 'Buttons',
    title: 'Button group',
    description: 'Primary, secondary, and ghost button variants.',
    code: `<div class="flex flex-wrap items-center justify-center gap-3 min-h-[200px] bg-zinc-100 p-8">
  <button type="button" class="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800">Primary</button>
  <button type="button" class="inline-flex items-center justify-center rounded-lg border-2 border-black bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-100">Secondary</button>
  <button type="button" class="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-black underline-offset-4 hover:underline">Ghost</button>
</div>`,
  },
  {
    id: 'hero',
    label: 'Hero',
    title: 'Landing hero',
    description: 'Headline, subcopy, and dual call-to-action buttons.',
    code: `<section class="min-h-[280px] bg-yellow-300 px-6 py-12 border-b-4 border-black">
  <div class="max-w-3xl mx-auto text-center">
    <p class="text-sm font-bold uppercase tracking-wide text-black/60 mb-3">Your product</p>
    <h1 class="text-3xl sm:text-4xl font-bold text-black mb-4">Build something people love</h1>
    <p class="text-base text-black/75 mb-6 max-w-xl mx-auto">Start from this hero block and customize copy, colors, and layout.</p>
    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <button type="button" class="inline-flex items-center justify-center rounded-md border-2 border-black bg-black px-5 py-2.5 text-sm font-semibold text-yellow-400">Get started</button>
      <button type="button" class="inline-flex items-center justify-center rounded-md border-2 border-black bg-white px-5 py-2.5 text-sm font-semibold text-black">Learn more</button>
    </div>
  </div>
</section>`,
  },
];
