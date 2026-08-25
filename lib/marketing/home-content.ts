import type { Tone } from './tones';

/**
 * Homepage copy for the landing sections, kept as typed data the way SERVICE_PAGES is
 * in ./service-pages.ts. Every claim here is either descriptive of what Ractrotech does
 * or is already published elsewhere on the site — see the source note on each block.
 * Do not add unverified metrics.
 */

export const HERO = {
  eyebrow: 'Websites · Apps · SaaS · Design',
  headline: 'From idea to shipped product,',
  headlineAccent: 'built by one team',
  subhead:
    'Ractrotech designs, builds, and launches websites, web apps, and SaaS products. One team from first call to production — clear scope, fair timelines, no agency fluff.',
  primaryCta: { label: 'Tell us your idea', href: '/start-project' },
  secondaryCta: { label: 'Explore services', href: '/services' },
  note: 'Free estimate · Reply within one business day',
} as const;

/** Mirrors the stack listed on the service pages (lib/marketing/service-pages.ts). */
export const STACK_LOGOS = [
  'nextjs',
  'react',
  'typescript',
  'tailwind',
  'supabase',
  'postgres',
  'stripe',
  'vercel',
] as const;

export type StackLogo = (typeof STACK_LOGOS)[number];

/** Source: the three pillars in components/retro-about.tsx. */
export const PROCESS = {
  eyebrow: 'How we work',
  headline: 'A delivery process you can actually follow',
  subhead:
    'You see the board, the demos, and the deploys. No black box, no status meetings that tell you nothing.',
  steps: [
    {
      title: 'We listen first',
      body: 'You explain the problem. We ask the right questions, scope it clearly, and agree on what success looks like before writing code.',
    },
    {
      title: 'We build what matters',
      body: 'No bloated features, no endless meetings. We focus on what your users and business actually need — then ship it.',
    },
    {
      title: 'We stay until it works',
      body: 'Launch is not the finish line. We test, fix, deploy, and support you until your product is live and performing.',
    },
  ],
  pills: [
    'Weekly demos',
    'Fixed scope after discovery',
    'Direct access to builders',
    'Design + dev in one team',
    'Post-launch support',
  ],
} as const;

export type Capability = {
  name: string;
  description: string;
  href: string;
  /** Which in-code panel mockup renders inside the card, if any. */
  panel?: 'chat' | 'design' | 'status' | 'checkout';
  /** Bento cards marked `feature` span two columns on desktop. */
  size: 'feature' | 'standard';
};

/** Source: the services array in components/retro-services.tsx. */
export const CAPABILITIES: Capability[] = [
  {
    name: 'Web & app development',
    description:
      'Fast, professional websites and web apps that build trust and bring you customers — business sites, landing pages, portals.',
    href: '/web-app-development',
    panel: 'design',
    size: 'feature',
  },
  {
    name: 'SaaS development',
    description:
      'Subscription software your users will love — multi-tenant architecture, billing, dashboards, built to grow.',
    href: '/saas-development',
    panel: 'checkout',
    size: 'standard',
  },
  {
    name: 'MVP development',
    description:
      'Test your idea in the market without spending months or burning your budget.',
    href: '/mvp-development',
    panel: 'status',
    size: 'standard',
  },
  {
    name: 'UI/UX design',
    description:
      'Interfaces people actually enjoy using — researched, designed, and handed off dev-ready.',
    href: '/ui-ux-design',
    panel: 'chat',
    size: 'standard',
  },
];

/** Source: the "Who is Ractrotech for?" answer in HOMEPAGE_FAQS. */
export const AUDIENCES = [
  {
    title: 'Founders',
    body: 'You have an idea and need it in front of real users. We scope ruthlessly, build the core, and get you something investors and customers can touch.',
    cta: { label: 'MVP development', href: '/mvp-development' },
    tone: 'mint' as const,
  },
  {
    title: 'Growing businesses',
    body: 'Your site or software is holding you back. We rebuild it on modern foundations so it loads fast, ranks well, and stops costing you customers.',
    cta: { label: 'Web & app development', href: '/web-app-development' },
    tone: 'butter' as const,
  },
  {
    title: 'Product teams',
    body: 'You need extra engineering and design firepower without a six-month hiring cycle. We plug in, follow your standards, and ship.',
    cta: { label: 'SaaS development', href: '/saas-development' },
    tone: 'sky' as const,
  },
];

export type ResultCard = {
  /** Headline figure. Every value below is published elsewhere on this site — see `source`. */
  stat: string;
  label: string;
  body: string;
  tone: Tone;
  /** Corner mark on the card. Mapped to a component in sections/results-grid.tsx — a name
      rather than an icon so this stays a plain data file with no React import. */
  icon: 'timeline' | 'reply' | 'services' | 'quote' | 'direct';
  /** Where the claim comes from, so it stays auditable. */
  source: string;
};

/**
 * Deliberately no user counts, download counts or client counts — those would be
 * unverifiable. Each figure below restates a commitment already made on a service page.
 */
export const RESULTS: ResultCard[] = [
  {
    stat: '4–8 weeks',
    label: 'Typical MVP timeline',
    body: 'Most MVPs ship in four to eight weeks. A full v1 with billing, admin and integrations runs eight to sixteen.',
    tone: 'mint',
    icon: 'timeline',
    source: 'service-pages.ts — SaaS + MVP FAQ',
  },
  {
    stat: '1 day',
    label: 'Response time',
    body: 'Questions answered within one business day. You are never left wondering what is happening.',
    tone: 'peach',
    icon: 'reply',
    source: 'retro-why-us.tsx + retro-cta.tsx',
  },
  {
    stat: '10',
    label: 'Services under one roof',
    body: 'Web, SaaS, MVP, mobile, UI/UX, e-commerce, AI, cloud, templates and consulting — one team, one contract.',
    tone: 'lilac',
    icon: 'services',
    source: 'retro-services.tsx — services array length',
  },
  {
    stat: 'Fixed',
    label: 'Scope and quote',
    body: 'We give you a fixed-scope quote after discovery, so the number you approve is the number you pay.',
    tone: 'pink',
    icon: 'quote',
    source: 'service-pages.ts — SaaS cost FAQ',
  },
  {
    stat: '0',
    label: 'Sales middlemen',
    body: 'You work directly with the developers and designers building your product. No account manager relay.',
    tone: 'sky',
    icon: 'direct',
    source: 'retro-why-us.tsx',
  },
];

export const FINAL_CTA = {
  headline: 'Got an idea?',
  headlineAccent: "Let's build it.",
  body: 'Tell us what you want to build — website, app, store, SaaS, or something in between. We will help you figure out the right path and send a clear estimate within 24 hours.',
  primaryCta: { label: 'Share your idea', href: '/start-project' },
  secondaryCta: { label: 'Contact us', href: '/contact' },
  note: 'Free estimate · No pressure · One business day response',
} as const;

export const JOURNEY_BAND = {
  headline: 'Start your build',
  headlineAccent: 'today',
  body: 'Drop your email and tell us about the project on the next step.',
  placeholder: 'you@company.com',
  submitLabel: 'Get started',
} as const;
