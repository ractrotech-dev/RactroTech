import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

import { Reveal, RevealGroup, RevealItem } from '@/components/marketing/reveal';

/** Template list carried over from components/retro-templates.tsx. */
const TEMPLATES = [
  {
    name: 'SaaS Starter',
    description: 'Auth, billing, dashboard, and admin — ready to customize and ship.',
    tags: ['Next.js', 'Stripe', 'Supabase'],
    href: '/signup',
  },
  {
    name: 'Landing Page Kit',
    description: 'High-converting marketing pages with hero, pricing, and CTA sections.',
    tags: ['React', 'Tailwind', 'SEO'],
    href: '/components',
  },
  {
    name: 'Admin Dashboard',
    description: 'Analytics, user management, and content tools for internal teams.',
    tags: ['Dashboard', 'Charts', 'RBAC'],
    href: '/signup',
  },
  {
    name: 'E-Commerce Store',
    description: 'Product catalog, cart, and checkout patterns for online retail.',
    tags: ['Shopify', 'Payments', 'Catalog'],
    href: '/start-project',
  },
  {
    name: 'Blog & CMS',
    description: 'Editorial layout with categories, tags, and SEO-friendly article pages.',
    tags: ['CMS', 'Markdown', 'Journal'],
    href: '/blog',
  },
  {
    name: 'Component Library',
    description: 'Reusable UI blocks you can preview, copy, and drop into any project.',
    tags: ['UI Kit', 'Design System', 'Copy-paste'],
    href: '/components',
  },
];

export function TemplatesGrid() {
  return (
    <section className="bg-mkt-lavender py-20 lg:py-24 text-mkt-ink">
      <div className="mkt-shell">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="mkt-eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-mkt-violet" />
            Template library
          </span>
          <h2 className="mkt-display mt-6 text-[32px] leading-[1.1] sm:text-[42px]">
            Production-ready starting points
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-mkt-muted">
            Starters for SaaS products, marketing sites, and internal tools — skip the setup and
            start customizing.
          </p>
        </Reveal>

        <RevealGroup as="ul" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((template) => (
            <RevealItem key={template.name} as="li" className="h-full">
              <Link
                href={template.href}
                className="group flex h-full flex-col rounded-3xl border border-mkt-line bg-mkt-surface p-6 transition-shadow duration-200 hover:shadow-[0_18px_44px_-26px_rgba(11,11,16,0.4)] sm:p-7 text-mkt-ink"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="mkt-display text-[19px] sm:text-[21px]">{template.name}</h3>
                  <ArrowUpRight
                    className="h-5 w-5 shrink-0 text-mkt-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </div>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-mkt-muted">
                  {template.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-mkt-lavender px-2.5 py-1 text-[12px] font-medium text-mkt-violet text-mkt-ink"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-medium text-mkt-violet group-hover:underline">
                  Explore
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
