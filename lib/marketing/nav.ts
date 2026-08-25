import {
  Blocks,
  BookOpen,
  Boxes,
  Building2,
  Layers,
  LayoutTemplate,
  Mail,
  MessageSquareQuote,
  PenTool,
  Server,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react';

import { SERVICE_PAGES } from '@/lib/marketing/service-pages';
import type { Tone } from '@/lib/marketing/tones';

/**
 * The header's information architecture, kept out of the header component.
 *
 * Same split as lib/marketing/tones.ts: this file owns *what* the nav contains, the
 * component owns *how* it looks. tailwind.config.ts does not scan `./lib/**`, so nothing
 * here may hold a Tailwind class string — one written in this file would never reach the
 * stylesheet. Icons and art keys are safe: they are references, not class names.
 *
 * The flat seven-link nav the header shipped with has no room for descriptions, which is
 * exactly what a hover panel needs — a bare list of links inside a big dropdown reads as
 * an accident. So every panel item carries a one-line `blurb`, and the service entries
 * quote SERVICE_PAGES rather than restating it, so the nav cannot drift out of sync with
 * the pages it points at.
 */

/** Key into the decorative marks in components/marketing/nav-art.tsx. */
export type NavArt = 'stack' | 'orbit' | 'window' | 'pillar' | 'bloom' | 'flags';

/** A compact row inside a panel column: icon, label, hairline rule beneath. */
export type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

/** A promoted entry: display-size label, a line of copy, and a decorative mark. */
export type NavFeature = {
  href: string;
  label: string;
  /** One line, sentence case, no trailing period. */
  blurb: string;
  art: NavArt;
};

/**
 * One column of a panel. A column may hold features, links, or both stacked — the mix is
 * what stops a four-column panel from reading as four identical lists.
 */
export type NavColumn = {
  /** Small uppercase label above the column. */
  eyebrow?: string;
  features?: NavFeature[];
  links?: NavLink[];
};

export type NavEntry =
  /** A plain item in the bar — no panel, no chevron. */
  | { kind: 'link'; href: string; label: string }
  /**
   * A trigger that opens the hover panel. `tone` paints that panel: each menu gets its own
   * pastel fill and its own paired ink, the same contract ToneCard uses, so the panels
   * read as part of the page's colour system rather than as generic dropdowns.
   */
  | { kind: 'panel'; id: string; href: string; label: string; tone: Tone; columns: NavColumn[] };

const service = (slug: string) => {
  const page = SERVICE_PAGES.find((item) => item.slug === slug);
  return {
    href: `/${slug}`,
    label: page?.name ?? slug,
    blurb: page?.heroDescription ?? '',
  };
};

const serviceLink = (slug: string, icon: LucideIcon): NavLink => {
  const { href, label } = service(slug);
  return { href, label, icon };
};

const serviceFeature = (slug: string, art: NavArt): NavFeature => ({ ...service(slug), art });

export const NAV: NavEntry[] = [
  {
    kind: 'panel',
    id: 'services',
    href: '/services',
    label: 'Services',
    tone: 'mint',
    columns: [
      {
        eyebrow: 'Flagship builds',
        features: [
          serviceFeature('saas-development', 'stack'),
          serviceFeature('mvp-development', 'orbit'),
        ],
      },
      {
        eyebrow: 'By discipline',
        links: [
          serviceLink('web-app-development', Layers),
          serviceLink('nextjs-development', Server),
          serviceLink('ui-ux-design', PenTool),
          serviceLink('startup-development', Sparkles),
          { href: '/services', label: 'All services', icon: Boxes },
        ],
      },
      {
        eyebrow: 'Start here',
        features: [
          {
            href: '/start-project',
            label: 'Scope your project',
            blurb: 'Tell us the goal and we come back with an approach, a timeline and a budget',
            art: 'flags',
          },
        ],
        links: [
          { href: '/contact', label: 'Talk to us', icon: Mail },
          { href: '/about', label: 'How we work', icon: Users },
        ],
      },
    ],
  },
  {
    kind: 'panel',
    id: 'products',
    href: '/templates',
    label: 'Products',
    tone: 'sky',
    columns: [
      {
        eyebrow: 'Ship faster',
        features: [
          {
            href: '/templates',
            label: 'Templates',
            blurb: 'Production-ready Next.js starters you can launch on this week',
            art: 'window',
          },
        ],
      },
      {
        eyebrow: 'Browse',
        links: [
          { href: '/components', label: 'Components', icon: Blocks },
          { href: '/product', label: 'Product', icon: LayoutTemplate },
          { href: '/start-project', label: 'Start a project', icon: Sparkles },
        ],
      },
    ],
  },
  {
    kind: 'panel',
    id: 'work',
    href: '/projects',
    label: 'Work',
    tone: 'peach',
    columns: [
      {
        eyebrow: 'Selected work',
        features: [
          {
            href: '/projects',
            label: 'Projects',
            blurb: 'Case studies with the problem, the build and the numbers after launch',
            art: 'pillar',
          },
        ],
      },
      {
        eyebrow: 'Proof',
        links: [
          { href: '/reviews', label: 'Reviews', icon: MessageSquareQuote },
          { href: '/about', label: 'About us', icon: Users },
          { href: '/blog', label: 'From the blog', icon: BookOpen },
        ],
      },
    ],
  },
  {
    kind: 'panel',
    id: 'company',
    href: '/about',
    label: 'Company',
    tone: 'pink',
    columns: [
      {
        eyebrow: 'Who we are',
        features: [
          {
            href: '/about',
            label: 'About',
            blurb: 'Who you actually work with, and how a Ractrotech build runs end to end',
            art: 'bloom',
          },
        ],
      },
      {
        eyebrow: 'Get in touch',
        links: [
          { href: '/contact', label: 'Contact', icon: Mail },
          { href: '/blog', label: 'Blog', icon: BookOpen },
          { href: '/projects', label: 'Client work', icon: Building2 },
        ],
      },
    ],
  },
  { kind: 'link', href: '/blog', label: 'Blog' },
];

/** Flat list for surfaces that cannot show a panel — the footer, sitemaps, tests. */
export const NAV_FLAT: { href: string; label: string }[] = NAV.flatMap((entry) =>
  entry.kind === 'link'
    ? [{ href: entry.href, label: entry.label }]
    : entry.columns.flatMap((column) => [
        ...(column.features ?? []).map((item) => ({ href: item.href, label: item.label })),
        ...(column.links ?? []).map((item) => ({ href: item.href, label: item.label })),
      ])
);
