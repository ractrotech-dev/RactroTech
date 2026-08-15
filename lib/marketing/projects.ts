/**
 * Marketing project showcase entries.
 * These are product archetypes Ractrotech ships — not named client case studies.
 * Do not add unverified client names or metrics.
 */

export type ShowcaseVisual = 'dashboard' | 'kanban' | 'landing' | 'store' | 'editorial' | 'components';

export type ShowcaseProject = {
  id: string;
  name: string;
  summary: string;
  tags: string[];
  /** Browser chrome URL label — illustrative, not a live external claim. */
  url: string;
  tone?: 'light' | 'dark';
  visual: ShowcaseVisual;
  /** Deep-link into the related service page. */
  href: string;
};

export const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: 'saas-platform',
    name: 'Multi-tenant SaaS platform',
    summary:
      'Auth, roles, subscription billing, admin dashboards and customer portals — built to onboard teams and scale.',
    tags: ['SaaS', 'Next.js', 'Stripe', 'Supabase'],
    url: 'app.ractrotech.com',
    visual: 'dashboard',
    href: '/saas-development',
  },
  {
    id: 'ops-board',
    name: 'Delivery ops board',
    summary:
      'Kanban-style delivery tracking for scoped work, design, build and ship — so clients see progress in real time.',
    tags: ['Dashboard', 'Workflow', 'RBAC'],
    url: 'admin.ractrotech.com',
    tone: 'dark',
    visual: 'kanban',
    href: '/web-app-development',
  },
  {
    id: 'marketing-site',
    name: 'High-converting marketing site',
    summary:
      'Hero, proof, pricing and CTA flows tuned for lead capture — fast, SEO-ready and easy to update.',
    tags: ['Landing', 'SEO', 'React'],
    url: 'ractrotech.com',
    visual: 'landing',
    href: '/web-app-development',
  },
  {
    id: 'storefront',
    name: 'E-commerce storefront',
    summary:
      'Catalog, cart and checkout patterns for online retail — payments wired and ready to customize.',
    tags: ['E-commerce', 'Payments', 'Catalog'],
    url: 'store.ractrotech.com',
    visual: 'store',
    href: '/web-app-development',
  },
  {
    id: 'mvp',
    name: 'Investor-ready MVP',
    summary:
      'Core workflows, onboarding, waitlist or payments, and analytics — scoped to validate fast without bloating the build.',
    tags: ['MVP', 'Startup', 'Next.js'],
    url: 'mvp.ractrotech.com',
    visual: 'dashboard',
    href: '/mvp-development',
  },
  {
    id: 'content-platform',
    name: 'Blog & content platform',
    summary:
      'Editorial layouts with categories, tags and SEO-friendly article pages for brands that publish often.',
    tags: ['CMS', 'Content', 'SEO'],
    url: 'ractrotech.com/blog',
    visual: 'editorial',
    href: '/web-app-development',
  },
];
