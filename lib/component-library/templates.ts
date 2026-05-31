import type { LibraryIndustry, LibraryStyle } from './constants';
import { computeContentHash } from './hash';
import { getIndustryLabel, getStyleTokens, slugify, type StyleTokenSet } from './style-tokens';

export type ComponentManifest = {
  name: string;
  category: string;
  subtype: string;
  tags: string[];
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  responsive: boolean;
  darkMode: boolean;
  style_variant: LibraryStyle;
  industry_variant: LibraryIndustry;
  slug: string;
};

export type GeneratedComponent = ComponentManifest & {
  code: string;
  content_hash: string;
};

type RenderContext = {
  category: string;
  subtype: string;
  style: LibraryStyle;
  industry: LibraryIndustry;
  tokens: StyleTokenSet;
  brand: string;
  layoutVariant: number;
};

function wrapSection(ctx: RenderContext, inner: string, fullWidth = false): string {
  const height = fullWidth ? 'min-h-[280px]' : 'py-8 sm:py-12';
  const layoutOffset =
    ctx.layoutVariant % 3 === 0 ? '' : ctx.layoutVariant % 3 === 1 ? ' lg:pl-4' : ' lg:pr-4';
  return `<section class="${ctx.tokens.surface} ${ctx.tokens.darkSurface ?? ''} ${height} ${ctx.tokens.text} ${ctx.tokens.darkText ?? ''}">
  <div class="${ctx.tokens.container}${layoutOffset}">
    ${inner}
  </div>
</section>`;
}

function renderButtons(ctx: RenderContext): string {
  const { subtype, tokens, brand } = ctx;
  const label = `${brand} action`;

  const variants: Record<string, string> = {
    primary: `<button type="button" class="${tokens.buttonPrimary}">${label}</button>`,
    secondary: `<button type="button" class="${tokens.buttonSecondary}">Learn more</button>`,
    ghost: `<button type="button" class="${tokens.buttonGhost}">Cancel</button>`,
    gradient: `<button type="button" class="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-400 transition-opacity">${label}</button>`,
    animated: `<button type="button" class="${tokens.buttonPrimary} transition-transform hover:scale-105 active:scale-95">${label}</button>`,
    icon: `<button type="button" aria-label="Add item" class="inline-flex h-10 w-10 items-center justify-center ${tokens.radius} ${tokens.accent} ${tokens.accentText} hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${tokens.ring} transition-opacity"><svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg></button>`,
    floating: `<button type="button" class="fixed bottom-6 right-6 z-10 inline-flex h-14 w-14 items-center justify-center rounded-full ${tokens.accent} ${tokens.accentText} ${tokens.shadow} hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${tokens.ring} transition-opacity" aria-label="Open chat"><svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg></button>`,
    'social-login': `<div class="flex flex-col sm:flex-row gap-3 w-full max-w-md"><button type="button" class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 transition-colors"><span aria-hidden="true">G</span> Continue with Google</button><button type="button" class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 transition-colors">Continue with GitHub</button></div>`,
  };

  return wrapSection(
    ctx,
    `<div class="flex flex-col sm:flex-row flex-wrap items-center gap-4">
      <p class="text-sm ${tokens.textMuted} w-full sm:w-auto mb-2 sm:mb-0">${brand} · ${ctx.style} ${subtype} button</p>
      ${variants[subtype] ?? variants.primary}
    </div>`
  );
}

function renderCards(ctx: RenderContext): string {
  const { subtype, tokens, brand } = ctx;

  const cards: Record<string, string> = {
    product: `<article class="${tokens.card} p-4 sm:p-6 max-w-sm w-full"><div class="aspect-video ${tokens.surfaceMuted} ${tokens.radius} mb-4 flex items-center justify-center text-xs ${tokens.textMuted}">Product image</div><h3 class="text-lg font-semibold mb-1">Pro Plan</h3><p class="text-sm ${tokens.textMuted} mb-4">Built for ${brand} teams shipping faster.</p><p class="text-2xl font-bold mb-4">$49<span class="text-sm font-normal ${tokens.textMuted}">/mo</span></p><button type="button" class="${tokens.buttonPrimary} w-full">Add to cart</button></article>`,
    user: `<article class="${tokens.card} p-4 sm:p-6 max-w-sm w-full flex gap-4 items-center"><div class="h-14 w-14 shrink-0 rounded-full ${tokens.accent} ${tokens.accentText} flex items-center justify-center font-bold text-lg" aria-hidden="true">RT</div><div><h3 class="font-semibold">Alex Rivera</h3><p class="text-sm ${tokens.textMuted}">Product Designer · ${brand}</p><button type="button" class="${tokens.buttonGhost} mt-2 text-sm px-3 py-1.5">View profile</button></div></article>`,
    pricing: `<article class="${tokens.card} p-6 max-w-sm w-full"><p class="text-xs font-semibold uppercase tracking-wide ${tokens.textMuted} mb-2">Popular</p><h3 class="text-xl font-bold mb-2">Growth</h3><p class="text-3xl font-bold mb-4">$79<span class="text-base font-normal ${tokens.textMuted}">/mo</span></p><ul class="space-y-2 text-sm ${tokens.textMuted} mb-6"><li>Up to 50 projects</li><li>Priority support</li><li>Analytics dashboard</li></ul><button type="button" class="${tokens.buttonPrimary} w-full">Get started</button></article>`,
    testimonial: `<blockquote class="${tokens.card} p-6 max-w-lg w-full"><p class="text-base leading-relaxed mb-4">"${brand} helped us launch in half the time. The component library is a game changer."</p><footer class="flex items-center gap-3"><div class="h-10 w-10 rounded-full ${tokens.surfaceMuted}" aria-hidden="true"></div><cite class="not-italic"><span class="font-semibold block">Jordan Lee</span><span class="text-sm ${tokens.textMuted}">CTO, ${brand}</span></cite></footer></blockquote>`,
    feature: `<article class="${tokens.card} p-6 max-w-sm w-full"><div class="h-10 w-10 ${tokens.radius} ${tokens.accent} ${tokens.accentText} flex items-center justify-center mb-4" aria-hidden="true"><svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></div><h3 class="text-lg font-semibold mb-2">Lightning fast</h3><p class="text-sm ${tokens.textMuted}">Ship production UI with ${brand} tokens and responsive layouts.</p></article>`,
    analytics: `<article class="${tokens.card} p-6 max-w-sm w-full"><p class="text-sm ${tokens.textMuted} mb-1">Total revenue</p><p class="text-3xl font-bold mb-2">$24,580</p><p class="text-sm text-emerald-600 font-medium mb-4">+12.5% vs last month</p><div class="flex gap-1 h-16 items-end" role="img" aria-label="Bar chart showing growth"><div class="flex-1 bg-emerald-500/30 rounded-t h-8"></div><div class="flex-1 bg-emerald-500/50 rounded-t h-12"></div><div class="flex-1 bg-emerald-500/70 rounded-t h-10"></div><div class="flex-1 bg-emerald-500 rounded-t h-16"></div></div></article>`,
  };

  return wrapSection(ctx, `<div class="flex justify-center">${cards[subtype] ?? cards.feature}</div>`);
}

function renderForms(ctx: RenderContext): string {
  const { subtype, tokens, brand } = ctx;

  const forms: Record<string, string> = {
    login: `<form class="${tokens.card} p-6 sm:p-8 max-w-md w-full mx-auto space-y-4" aria-label="Login form"><h2 class="text-xl font-bold mb-2">Sign in to ${brand}</h2><div><label for="email" class="block text-sm font-medium mb-1">Email</label><input id="email" type="email" class="${tokens.input}" placeholder="you@company.com" /></div><div><label for="password" class="block text-sm font-medium mb-1">Password</label><input id="password" type="password" class="${tokens.input}" placeholder="••••••••" /></div><button type="submit" class="${tokens.buttonPrimary} w-full">Sign in</button></form>`,
    register: `<form class="${tokens.card} p-6 sm:p-8 max-w-md w-full mx-auto space-y-4" aria-label="Register form"><h2 class="text-xl font-bold">Create your account</h2><input type="text" class="${tokens.input}" placeholder="Full name" aria-label="Full name" /><input type="email" class="${tokens.input}" placeholder="Email" aria-label="Email" /><button type="submit" class="${tokens.buttonPrimary} w-full">Create account</button></form>`,
    'forgot-password': `<form class="${tokens.card} p-6 max-w-md w-full mx-auto space-y-4" aria-label="Forgot password"><h2 class="text-lg font-bold">Reset password</h2><p class="text-sm ${tokens.textMuted}">Enter your email for ${brand}</p><input type="email" class="${tokens.input}" placeholder="Email" aria-label="Email" /><button type="submit" class="${tokens.buttonPrimary} w-full">Send reset link</button></form>`,
    search: `<form class="flex flex-col sm:flex-row gap-2 max-w-xl w-full mx-auto" role="search" aria-label="Search"><input type="search" class="${tokens.input} flex-1" placeholder="Search ${brand}..." aria-label="Search query" /><button type="submit" class="${tokens.buttonPrimary} shrink-0">Search</button></form>`,
    'multi-step': `<div class="${tokens.card} p-6 max-w-md w-full mx-auto"><p class="text-xs ${tokens.textMuted} mb-4">Step 2 of 3</p><div class="h-2 ${tokens.surfaceMuted} rounded-full mb-6 overflow-hidden"><div class="h-full w-2/3 ${tokens.accent} rounded-full"></div></div><h2 class="text-lg font-bold mb-4">Company details</h2><input type="text" class="${tokens.input} mb-3" placeholder="Company name" aria-label="Company name" /><div class="flex gap-2"><button type="button" class="${tokens.buttonGhost} flex-1">Back</button><button type="button" class="${tokens.buttonPrimary} flex-1">Continue</button></div></div>`,
    contact: `<form class="${tokens.card} p-6 max-w-lg w-full mx-auto space-y-4" aria-label="Contact form"><h2 class="text-xl font-bold">Contact ${brand}</h2><textarea class="${tokens.input} min-h-[100px]" placeholder="How can we help?" aria-label="Message"></textarea><button type="submit" class="${tokens.buttonPrimary}">Send message</button></form>`,
  };

  return wrapSection(ctx, forms[subtype] ?? forms.contact);
}

function renderNavigation(ctx: RenderContext): string {
  const { subtype, tokens, brand } = ctx;

  const navs: Record<string, string> = {
    navbar: `<header class="flex flex-col sm:flex-row items-center justify-between gap-4 py-4"><a href="#" class="text-lg font-bold focus-visible:outline-none focus-visible:ring-2 ${tokens.ring} rounded">${brand}</a><nav class="flex flex-wrap gap-4 text-sm" aria-label="Main"><a href="#" class="hover:underline focus-visible:outline-none focus-visible:ring-2 ${tokens.ring} rounded px-1">Product</a><a href="#" class="hover:underline focus-visible:outline-none focus-visible:ring-2 ${tokens.ring} rounded px-1">Pricing</a><a href="#" class="hover:underline focus-visible:outline-none focus-visible:ring-2 ${tokens.ring} rounded px-1">Docs</a></nav><button type="button" class="${tokens.buttonPrimary}">Get started</button></header>`,
    'mobile-menu': `<header class="py-4"><div class="flex items-center justify-between mb-4"><span class="font-bold">${brand}</span><button type="button" aria-expanded="true" aria-label="Close menu" class="sm:hidden p-2 ${tokens.radius} hover:${tokens.surfaceMuted} focus-visible:outline-none focus-visible:ring-2 ${tokens.ring}"><svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button></div><nav class="flex flex-col gap-2 sm:hidden" aria-label="Mobile"><a href="#" class="py-2 px-3 ${tokens.radius} hover:${tokens.surfaceMuted} focus-visible:outline-none focus-visible:ring-2 ${tokens.ring}">Home</a><a href="#" class="py-2 px-3 ${tokens.radius} hover:${tokens.surfaceMuted} focus-visible:outline-none focus-visible:ring-2 ${tokens.ring}">Features</a></nav></header>`,
    'mega-menu': `<nav class="${tokens.card} p-4 sm:p-6" aria-label="Mega menu"><div class="grid grid-cols-1 sm:grid-cols-3 gap-6"><div><p class="text-xs font-semibold uppercase ${tokens.textMuted} mb-2">Product</p><a href="#" class="block py-1 text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 ${tokens.ring} rounded">Analytics</a><a href="#" class="block py-1 text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 ${tokens.ring} rounded">Automation</a></div><div><p class="text-xs font-semibold uppercase ${tokens.textMuted} mb-2">Resources</p><a href="#" class="block py-1 text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 ${tokens.ring} rounded">Docs</a></div><div><p class="text-xs font-semibold uppercase ${tokens.textMuted} mb-2">${brand}</p><p class="text-sm ${tokens.textMuted}">Build faster with our library.</p></div></div></nav>`,
    sidebar: `<aside class="${tokens.card} p-4 w-full max-w-xs" aria-label="Sidebar"><p class="text-xs font-semibold uppercase ${tokens.textMuted} mb-4">${brand}</p><nav class="space-y-1"><a href="#" class="flex items-center gap-2 px-3 py-2 ${tokens.radius} ${tokens.accent} ${tokens.accentText} text-sm font-medium focus-visible:outline-none focus-visible:ring-2 ${tokens.ring}">Dashboard</a><a href="#" class="flex items-center gap-2 px-3 py-2 ${tokens.radius} text-sm hover:${tokens.surfaceMuted} focus-visible:outline-none focus-visible:ring-2 ${tokens.ring}">Projects</a><a href="#" class="flex items-center gap-2 px-3 py-2 ${tokens.radius} text-sm hover:${tokens.surfaceMuted} focus-visible:outline-none focus-visible:ring-2 ${tokens.ring}">Settings</a></nav></aside>`,
    'bottom-nav': `<nav class="fixed bottom-0 inset-x-0 ${tokens.card} border-t ${tokens.border} flex justify-around py-2 sm:hidden" aria-label="Bottom navigation"><a href="#" class="flex flex-col items-center text-xs p-2 focus-visible:outline-none focus-visible:ring-2 ${tokens.ring} rounded"><span aria-hidden="true">⌂</span>Home</a><a href="#" class="flex flex-col items-center text-xs p-2 focus-visible:outline-none focus-visible:ring-2 ${tokens.ring} rounded"><span aria-hidden="true">☰</span>Menu</a><a href="#" class="flex flex-col items-center text-xs p-2 focus-visible:outline-none focus-visible:ring-2 ${tokens.ring} rounded"><span aria-hidden="true">⚙</span>Settings</a></nav>`,
  };

  return wrapSection(ctx, navs[subtype] ?? navs.navbar);
}

function renderHero(ctx: RenderContext): string {
  const { subtype, tokens, brand } = ctx;
  const headlines: Record<string, string> = {
    saas: `Ship ${brand} faster with production-ready UI`,
    'ai-startup': `AI-powered workflows for ${brand}`,
    'food-delivery': `Hot meals delivered in minutes`,
    ecommerce: `Shop the latest from ${brand}`,
    agency: `We design digital experiences that convert`,
    portfolio: `Creative work by ${brand}`,
  };

  return wrapSection(
    ctx,
    `<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-8 sm:py-12">
      <div>
        <p class="text-sm font-semibold ${tokens.textMuted} mb-3">${brand} · ${subtype}</p>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">${headlines[subtype] ?? headlines.saas}</h1>
        <p class="text-base sm:text-lg ${tokens.textMuted} mb-6 max-w-xl">Mobile-first, accessible components built for modern teams.</p>
        <div class="flex flex-col sm:flex-row gap-3">
          <button type="button" class="${tokens.buttonPrimary}">Start free trial</button>
          <button type="button" class="${tokens.buttonSecondary}">View demo</button>
        </div>
      </div>
      <div class="${tokens.card} aspect-video flex items-center justify-center ${tokens.textMuted} text-sm">Hero preview</div>
    </div>`,
    true
  );
}

function renderDashboards(ctx: RenderContext): string {
  const { subtype, tokens, brand } = ctx;

  const dashboards: Record<string, string> = {
    analytics: `<div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      <div class="${tokens.card} p-4 sm:p-6 lg:col-span-2">
        <h2 class="text-lg font-bold mb-4">${brand} analytics overview</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">${['Users', 'Sessions', 'Bounce', 'Duration'].map((m) => `<div class="${tokens.surfaceMuted} p-3 ${tokens.radius}"><p class="text-xs ${tokens.textMuted}">${m}</p><p class="text-xl font-bold mt-1">${m === 'Duration' ? '4m 12s' : '8.4k'}</p></div>`).join('')}</div>
        <div class="flex items-end gap-2 h-32" role="img" aria-label="Traffic trend">${['h-10', 'h-16', 'h-12', 'h-20', 'h-14', 'h-24', 'h-16'].map((h) => `<div class="flex-1 ${tokens.accent} opacity-75 rounded-t ${h}"></div>`).join('')}</div>
      </div>
      <div class="${tokens.card} p-4 sm:p-6"><h3 class="font-semibold mb-3">Top sources</h3><ul class="space-y-3 text-sm">${['Organic search', 'Direct', 'Referral'].map((s, i) => `<li class="flex justify-between gap-2"><span>${s}</span><span class="font-semibold">${42 - i * 8}%</span></li>`).join('')}</ul></div>
    </div>`,

    finance: `<div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      <div class="${tokens.card} p-5 sm:p-6">
        <p class="text-sm ${tokens.textMuted} mb-1">Total balance</p>
        <p class="text-3xl font-bold mb-6">$128,450.00</p>
        <div class="grid grid-cols-2 gap-3">${['Income', 'Expenses'].map((l, i) => `<div class="${tokens.surfaceMuted} p-3 ${tokens.radius}"><p class="text-xs ${tokens.textMuted}">${l}</p><p class="text-lg font-bold mt-1 ${i === 0 ? 'text-emerald-600' : 'text-rose-600'}">${i === 0 ? '+$24k' : '-$9.2k'}</p></div>`).join('')}</div>
      </div>
      <div class="${tokens.card} p-5 sm:p-6">
        <h3 class="font-semibold mb-4">Recent transactions</h3>
        <ul class="divide-y ${tokens.border} text-sm">${['Stripe payout', 'AWS invoice', 'Payroll'].map((t, i) => `<li class="flex justify-between py-3"><span>${t}</span><span class="font-medium">${i === 0 ? '+$4,200' : '-$890'}</span></li>`).join('')}</ul>
      </div>
    </div>`,

    crm: `<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      ${['Lead', 'Qualified', 'Closed'].map((stage, col) => `<div class="${tokens.card} p-3 sm:p-4 min-h-[220px]"><p class="text-xs font-semibold uppercase ${tokens.textMuted} mb-3">${stage}</p><div class="space-y-2">${[1, 2].map((n) => `<article class="${tokens.surfaceMuted} p-3 ${tokens.radius} text-sm"><p class="font-medium">${brand} deal ${col * 2 + n}</p><p class="text-xs ${tokens.textMuted} mt-1">$${(col + 1) * 1200 + n * 300}</p></article>`).join('')}</div></div>`).join('')}
    </div>`,

    ecommerce: `<div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      <div class="lg:col-span-2 ${tokens.card} p-4 sm:p-6">
        <h2 class="text-lg font-bold mb-4">${brand} store performance</h2>
        <div class="grid grid-cols-3 gap-3 mb-4">${['Orders', 'AOV', 'Returns'].map((m, i) => `<div class="${tokens.surfaceMuted} p-3 ${tokens.radius} text-center"><p class="text-xs ${tokens.textMuted}">${m}</p><p class="text-lg font-bold">${['342', '$86', '2.1%'][i]}</p></div>`).join('')}</div>
        <div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="${tokens.textMuted}"><th class="text-left py-2">Product</th><th class="text-right py-2">Sold</th></tr></thead><tbody>${['Starter kit', 'Pro bundle', 'Add-on'].map((p, i) => `<tr class="border-t ${tokens.border}"><td class="py-2">${p}</td><td class="py-2 text-right font-medium">${120 - i * 30}</td></tr>`).join('')}</tbody></table></div>
      </div>
      <div class="${tokens.card} p-4 sm:p-6 flex flex-col justify-center text-center"><p class="text-sm ${tokens.textMuted}">Conversion rate</p><p class="text-4xl font-bold my-2">3.8%</p><p class="text-xs text-emerald-600 font-medium">+0.6% this week</p></div>
    </div>`,

    admin: `<div class="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
      <aside class="${tokens.card} p-4 md:col-span-1" aria-label="Admin navigation"><nav class="space-y-1 text-sm">${['Users', 'Roles', 'Audit log', 'API keys'].map((item, i) => `<a href="#" class="block px-3 py-2 ${tokens.radius} focus-visible:outline-none focus-visible:ring-2 ${tokens.ring} ${i === 0 ? `${tokens.accent} ${tokens.accentText}` : `hover:${tokens.surfaceMuted}`}">${item}</a>`).join('')}</nav></aside>
      <div class="${tokens.card} p-4 sm:p-6 md:col-span-3">
        <h2 class="font-bold mb-4">System users</h2>
        <ul class="space-y-2 text-sm">${['admin@' + brand.toLowerCase().replace(/\s+/g, '') + '.com', 'ops@team.io', 'viewer@guest.dev'].map((email, i) => `<li class="flex items-center justify-between py-2 border-b ${tokens.border}"><span>${email}</span><span class="text-xs px-2 py-0.5 rounded-full ${tokens.surfaceMuted}">${['Owner', 'Editor', 'Viewer'][i]}</span></li>`).join('')}</ul>
      </div>
    </div>`,
  };

  return wrapSection(ctx, dashboards[subtype] ?? dashboards.analytics, true);
}

function renderTables(ctx: RenderContext): string {
  const { subtype, tokens, brand } = ctx;
  return wrapSection(
    ctx,
    `<div class="${tokens.card} overflow-hidden w-full">
      <div class="p-4 border-b ${tokens.border} flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <h2 class="font-semibold">${brand} ${subtype} table</h2>
        ${subtype === 'searchable' ? `<input type="search" class="${tokens.input} max-w-xs" placeholder="Filter rows..." aria-label="Filter table" />` : ''}
      </div>
      <div class="overflow-x-auto"><table class="w-full text-sm text-left"><thead class="${tokens.surfaceMuted}"><tr><th class="px-4 py-3 font-medium">Name</th><th class="px-4 py-3 font-medium hidden sm:table-cell">Status</th><th class="px-4 py-3 font-medium">Amount</th></tr></thead><tbody><tr class="border-t ${tokens.border}"><td class="px-4 py-3">Acme Corp</td><td class="px-4 py-3 hidden sm:table-cell"><span class="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-800">Active</span></td><td class="px-4 py-3">$420</td></tr><tr class="border-t ${tokens.border}"><td class="px-4 py-3">Globex</td><td class="px-4 py-3 hidden sm:table-cell"><span class="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800">Pending</span></td><td class="px-4 py-3">$180</td></tr></tbody></table></div>
      ${subtype === 'paginated' ? `<div class="p-4 flex justify-center gap-2 border-t ${tokens.border}"><button type="button" class="${tokens.buttonGhost} px-3 py-1 text-sm" aria-label="Previous page">Prev</button><button type="button" class="${tokens.buttonPrimary} px-3 py-1 text-sm" aria-label="Next page">Next</button></div>` : ''}
    </div>`
  );
}

function renderCharts(ctx: RenderContext): string {
  const { subtype, tokens, brand } = ctx;
  const barHeights = ['h-8', 'h-12', 'h-10', 'h-16', 'h-11', 'h-20', 'h-14'];
  return wrapSection(
    ctx,
    `<div class="${tokens.card} p-6 max-w-2xl w-full mx-auto"><h3 class="font-semibold mb-1">${brand} ${subtype.replace('-', ' ')}</h3><p class="text-sm ${tokens.textMuted} mb-6">Last 30 days</p><div class="flex items-end gap-2 h-40" role="img" aria-label="Chart visualization">${barHeights.map((h) => `<div class="flex-1 ${tokens.accent} opacity-80 rounded-t ${h}"></div>`).join('')}</div></div>`
  );
}

function renderGenericSection(ctx: RenderContext, title: string, body: string): string {
  return wrapSection(
    ctx,
    `<div class="max-w-3xl mx-auto text-center sm:text-left">
      <h2 class="text-2xl sm:text-3xl font-bold mb-3">${title}</h2>
      <p class="text-base ${ctx.tokens.textMuted} mb-6">${body}</p>
      <button type="button" class="${ctx.tokens.buttonPrimary}">Get started</button>
    </div>`
  );
}

function renderCTAs(ctx: RenderContext): string {
  const { subtype, tokens, brand } = ctx;
  if (subtype === 'split') {
    return wrapSection(ctx, `<div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center ${tokens.card} p-6 sm:p-10"><div><h2 class="text-2xl font-bold mb-2">Ready to grow with ${brand}?</h2><p class="${tokens.textMuted} mb-4">Start building today.</p><button type="button" class="${tokens.buttonPrimary}">Start free</button></div><div class="aspect-video ${tokens.surfaceMuted} ${tokens.radius} flex items-center justify-center text-sm ${tokens.textMuted}">Illustration</div></div>`);
  }
  if (subtype === 'floating') {
    return wrapSection(ctx, `<div class="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-4 sm:max-w-sm ${tokens.card} p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 z-10"><p class="text-sm flex-1">Join ${brand} — free for 14 days.</p><button type="button" class="${tokens.buttonPrimary} shrink-0 text-sm px-4 py-2">Try now</button></div>`);
  }
  return renderGenericSection(ctx, `Build something great with ${brand}`, `${ctx.style} ${subtype} call-to-action for ${ctx.industry} products.`);
}

function renderFooters(ctx: RenderContext): string {
  const { subtype, tokens, brand } = ctx;
  return wrapSection(
    ctx,
    `<footer class="py-8 sm:py-10 border-t ${tokens.border}"><div class="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8"><div class="col-span-2 sm:col-span-1"><p class="font-bold mb-2">${brand}</p><p class="text-sm ${tokens.textMuted}">${subtype} footer layout</p></div><div><p class="text-xs font-semibold uppercase ${tokens.textMuted} mb-2">Product</p><a href="#" class="block text-sm py-1 hover:underline focus-visible:outline-none focus-visible:ring-2 ${tokens.ring} rounded">Features</a></div><div><p class="text-xs font-semibold uppercase ${tokens.textMuted} mb-2">Company</p><a href="#" class="block text-sm py-1 hover:underline focus-visible:outline-none focus-visible:ring-2 ${tokens.ring} rounded">About</a></div></div><p class="text-xs ${tokens.textMuted}">© ${new Date().getFullYear()} ${brand}. All rights reserved.</p></footer>`,
    true
  );
}

function renderPricing(ctx: RenderContext): string {
  return wrapSection(
    ctx,
    `<div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">${['Starter', 'Pro', 'Enterprise'].map((tier, i) => `<article class="${ctx.tokens.card} p-6 ${i === 1 ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}"><h3 class="font-bold text-lg mb-2">${tier}</h3><p class="text-3xl font-bold mb-4">$${(i + 1) * 29}</p><button type="button" class="${i === 1 ? ctx.tokens.buttonPrimary : ctx.tokens.buttonSecondary} w-full">Choose plan</button></article>`).join('')}</div>`
  );
}

function renderTestimonials(ctx: RenderContext): string {
  const { subtype, tokens, brand } = ctx;
  return wrapSection(
    ctx,
    `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">${[1, 2, 3].map((n) => `<blockquote class="${tokens.card} p-5"><p class="text-sm mb-3">"Outstanding ${subtype} experience with ${brand}."</p><cite class="text-xs ${tokens.textMuted} not-italic">Customer ${n}</cite></blockquote>`).join('')}</div>`
  );
}

function renderFaqs(ctx: RenderContext): string {
  return wrapSection(
    ctx,
    `<div class="max-w-2xl mx-auto space-y-3">${[1, 2, 3].map((n) => `<details class="${ctx.tokens.card} p-4 group"><summary class="font-semibold cursor-pointer list-none flex justify-between items-center focus-visible:outline-none focus-visible:ring-2 ${ctx.tokens.ring} rounded">Question ${n} about ${ctx.brand}?<span aria-hidden="true">+</span></summary><p class="mt-3 text-sm ${ctx.tokens.textMuted}">Answer explaining ${ctx.subtype} FAQ pattern for ${ctx.industry}.</p></details>`).join('')}</div>`
  );
}

function renderFeatureGrids(ctx: RenderContext): string {
  return wrapSection(
    ctx,
    `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">${[1, 2, 3, 4, 5, 6].map((n) => `<article class="${ctx.tokens.card} p-5"><h3 class="font-semibold mb-2">Feature ${n}</h3><p class="text-sm ${ctx.tokens.textMuted}">${ctx.brand} ${ctx.subtype} grid item.</p></article>`).join('')}</div>`
  );
}

function renderStatistics(ctx: RenderContext): string {
  return wrapSection(
    ctx,
    `<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">${['10k+', '99.9%', '24/7', '50ms'].map((stat, i) => `<div class="${ctx.tokens.card} p-4 sm:p-6 text-center"><p class="text-2xl sm:text-3xl font-bold">${stat}</p><p class="text-sm ${ctx.tokens.textMuted} mt-1">${['Users', 'Uptime', 'Support', 'Latency'][i]}</p></div>`).join('')}</div>`
  );
}

function renderBlog(ctx: RenderContext): string {
  return wrapSection(
    ctx,
    `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">${[1, 2, 3].map((n) => `<article class="${ctx.tokens.card} overflow-hidden"><div class="aspect-video ${ctx.tokens.surfaceMuted}"></div><div class="p-4"><h3 class="font-semibold mb-1">Blog post ${n}</h3><p class="text-sm ${ctx.tokens.textMuted}">${ctx.brand} ${ctx.subtype} layout.</p></div></article>`).join('')}</div>`
  );
}

function renderAuth(ctx: RenderContext): string {
  return wrapSection(
    ctx,
    `<div class="max-w-md w-full mx-auto ${ctx.tokens.card} p-6 sm:p-8"><h1 class="text-xl font-bold mb-6">${ctx.subtype === 'register' ? 'Create account' : 'Welcome back'}</h1><form class="space-y-4" aria-label="Authentication"><input type="email" class="${ctx.tokens.input}" placeholder="Email" aria-label="Email" /><input type="password" class="${ctx.tokens.input}" placeholder="Password" aria-label="Password" /><button type="submit" class="${ctx.tokens.buttonPrimary} w-full">Continue</button></form></div>`
  );
}

function renderProfile(ctx: RenderContext): string {
  return wrapSection(
    ctx,
    `<div class="${ctx.tokens.card} p-6 max-w-2xl w-full mx-auto flex flex-col sm:flex-row gap-6 items-center sm:items-start"><div class="h-20 w-20 rounded-full ${ctx.tokens.accent} ${ctx.tokens.accentText} flex items-center justify-center text-2xl font-bold" aria-hidden="true">RT</div><div class="text-center sm:text-left"><h1 class="text-xl font-bold">Alex Morgan</h1><p class="${ctx.tokens.textMuted}">${ctx.brand} · ${ctx.subtype}</p><button type="button" class="${ctx.tokens.buttonSecondary} mt-4">Edit profile</button></div></div>`
  );
}

function renderSettings(ctx: RenderContext): string {
  return wrapSection(
    ctx,
    `<div class="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto"><nav class="${ctx.tokens.card} p-4 md:col-span-1" aria-label="Settings"><a href="#" class="block py-2 px-3 ${ctx.tokens.radius} text-sm font-medium ${ctx.tokens.accent} ${ctx.tokens.accentText}">General</a><a href="#" class="block py-2 px-3 text-sm hover:${ctx.tokens.surfaceMuted} focus-visible:outline-none focus-visible:ring-2 ${ctx.tokens.ring} rounded">Billing</a></nav><div class="${ctx.tokens.card} p-6 md:col-span-3"><h2 class="font-bold mb-4">Settings</h2><label class="block text-sm font-medium mb-1" for="name">Display name</label><input id="name" type="text" class="${ctx.tokens.input} mb-4" value="${ctx.brand}" /><button type="button" class="${ctx.tokens.buttonPrimary}">Save changes</button></div></div>`
  );
}

function renderNotifications(ctx: RenderContext): string {
  const { subtype, tokens, brand } = ctx;

  const item = (title: string, time: string, unread = false) =>
    `<article class="${tokens.card} p-4 flex gap-3 w-full"><div class="h-9 w-9 shrink-0 rounded-full ${tokens.accent} ${tokens.accentText} flex items-center justify-center text-xs font-bold" aria-hidden="true">${brand.slice(0, 2).toUpperCase()}</div><div class="min-w-0 flex-1"><p class="text-sm font-medium truncate">${title}</p><p class="text-xs ${tokens.textMuted}">${time}</p></div>${unread ? `<span class="h-2 w-2 shrink-0 rounded-full bg-blue-500 mt-2" aria-label="Unread"></span>` : ''}</article>`;

  const variants: Record<string, string> = {
    toast: `<div class="flex justify-end p-4"><div class="${tokens.card} p-4 flex gap-3 max-w-sm w-full ${tokens.shadow}" role="status"><div class="h-2 w-2 mt-2 rounded-full bg-emerald-500 shrink-0" aria-hidden="true"></div><div><p class="text-sm font-semibold">Payment successful</p><p class="text-xs ${tokens.textMuted}">${brand} · just now</p></div></div></div>`,

    inbox: `<div class="max-w-md w-full mx-auto space-y-2">${item('New comment on your project', '5 min ago', true)}${item('Weekly report is ready', '1 hour ago')}${item('Team invite from Alex', 'Yesterday')}</div>`,

    banner: `<div class="${tokens.accent} ${tokens.accentText} px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" role="alert"><p class="text-sm font-medium">${brand} maintenance scheduled tonight at 11 PM UTC.</p><div class="flex gap-2 shrink-0"><button type="button" class="text-xs font-semibold underline focus-visible:outline-none focus-visible:ring-2 ${tokens.ring} rounded px-1">Details</button><button type="button" class="text-xs font-semibold opacity-80 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 ${tokens.ring} rounded px-1" aria-label="Dismiss">Dismiss</button></div></div>`,

    dropdown: `<div class="flex justify-center"><div class="${tokens.card} w-full max-w-sm overflow-hidden ${tokens.shadow}"><div class="px-4 py-3 border-b ${tokens.border} flex items-center justify-between"><h3 class="font-semibold text-sm">Notifications</h3><span class="text-xs ${tokens.textMuted}">3 new</span></div><div class="max-h-48 overflow-y-auto divide-y ${tokens.border}">${item('Invoice paid', '2m ago', true)}${item('New signup', '12m ago', true)}${item('Export complete', '1h ago')}</div><button type="button" class="w-full py-2.5 text-xs font-semibold ${tokens.textMuted} hover:${tokens.surfaceMuted} focus-visible:outline-none focus-visible:ring-2 ${tokens.ring}">Mark all read</button></div></div>`,
  };

  return wrapSection(ctx, variants[subtype] ?? variants.inbox);
}

function renderChat(ctx: RenderContext): string {
  return wrapSection(
    ctx,
    `<div class="${ctx.tokens.card} max-w-lg w-full mx-auto overflow-hidden flex flex-col h-64 sm:h-80"><div class="p-3 border-b ${ctx.tokens.border} font-semibold">${ctx.brand} support</div><div class="flex-1 p-4 space-y-3 overflow-y-auto"><div class="max-w-[80%] ${ctx.tokens.surfaceMuted} p-3 ${ctx.tokens.radius} text-sm">Hello! How can we help?</div><div class="max-w-[80%] ml-auto ${ctx.tokens.accent} ${ctx.tokens.accentText} p-3 ${ctx.tokens.radius} text-sm">I need help with billing.</div></div><form class="p-3 border-t ${ctx.tokens.border} flex gap-2"><input type="text" class="${ctx.tokens.input} flex-1" placeholder="Type a message..." aria-label="Message" /><button type="submit" class="${ctx.tokens.buttonPrimary} px-4" aria-label="Send">Send</button></form></div>`
  );
}

function renderEcommerce(ctx: RenderContext): string {
  return wrapSection(
    ctx,
    `<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">${[1, 2, 3, 4].map((n) => `<article class="${ctx.tokens.card} overflow-hidden"><div class="aspect-square ${ctx.tokens.surfaceMuted}"></div><div class="p-3"><p class="text-sm font-medium truncate">Product ${n}</p><p class="text-sm font-bold">$${n * 25}</p><button type="button" class="${ctx.tokens.buttonPrimary} w-full mt-2 text-xs py-2">Add to cart</button></div></article>`).join('')}</div>`
  );
}

const RENDERERS: Record<string, (ctx: RenderContext) => string> = {
  Buttons: renderButtons,
  Cards: renderCards,
  Forms: renderForms,
  Navigation: renderNavigation,
  Hero: renderHero,
  Dashboards: renderDashboards,
  Tables: renderTables,
  Charts: renderCharts,
  CTAs: renderCTAs,
  Footers: renderFooters,
  Pricing: renderPricing,
  Testimonials: renderTestimonials,
  FAQs: renderFaqs,
  'Feature Grids': renderFeatureGrids,
  Statistics: renderStatistics,
  Blog: renderBlog,
  Auth: renderAuth,
  Profile: renderProfile,
  Settings: renderSettings,
  Notifications: renderNotifications,
  Chat: renderChat,
  'E-commerce': renderEcommerce,
};

export function renderComponentHtml(
  category: string,
  subtype: string,
  style: LibraryStyle,
  industry: LibraryIndustry,
  layoutSeed?: number
): string {
  const tokens = getStyleTokens(style);
  const brand = getIndustryLabel(industry);
  const layoutVariant =
    layoutSeed ??
    (category.length + subtype.length + style.length + industry.length) % 5;
  const ctx: RenderContext = {
    category,
    subtype,
    style,
    industry,
    tokens,
    brand,
    layoutVariant,
  };
  const renderer = RENDERERS[category];
  if (!renderer) {
    return renderGenericSection(ctx, `${category} · ${subtype}`, `${brand} component in ${style} style.`);
  }
  return renderer(ctx);
}

export function buildManifest(
  category: string,
  subtype: string,
  style: LibraryStyle,
  industry: LibraryIndustry
): ComponentManifest {
  const slug = slugify(`${category}-${subtype}-${style}-${industry}`);
  const difficulty =
    ['Dashboards', 'Tables', 'Charts', 'Multi-step'].some((k) =>
      `${category}${subtype}`.includes(k.replace('-', ''))
    ) || category === 'Dashboards'
      ? 'advanced'
      : category === 'Hero' || category === 'Navigation'
        ? 'intermediate'
        : 'beginner';

  return {
    name: `${category} · ${subtype} (${style})`,
    category,
    subtype,
    tags: [slugify(category), subtype, style, industry, 'ractrotech'],
    description: `${style} ${subtype} component for ${getIndustryLabel(industry)} — mobile-first, accessible, and copy-ready.`,
    difficulty,
    responsive: true,
    darkMode: true,
    style_variant: style,
    industry_variant: industry,
    slug,
  };
}

export function generateComponent(
  category: string,
  subtype: string,
  style: LibraryStyle,
  industry: LibraryIndustry,
  layoutSeed?: number
): GeneratedComponent {
  const code = renderComponentHtml(category, subtype, style, industry, layoutSeed);
  const manifest = buildManifest(category, subtype, style, industry);
  const slugSuffix = layoutSeed != null ? `-v${layoutSeed}` : '';
  return {
    ...manifest,
    slug: `${manifest.slug}${slugSuffix}`,
    code,
    content_hash: computeContentHash(code),
  };
}
