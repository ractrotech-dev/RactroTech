import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FadeInView } from '@/components/fade-in-view';

const templates = [
  {
    id: 1,
    name: 'SaaS Starter',
    description: 'Auth, billing, dashboard, and admin — ready to customize and ship.',
    tags: ['Next.js', 'Stripe', 'Supabase'],
    href: '/signup',
  },
  {
    id: 2,
    name: 'Landing Page Kit',
    description: 'High-converting marketing pages with hero, pricing, and CTA sections.',
    tags: ['React', 'Tailwind', 'SEO'],
    href: '/components',
  },
  {
    id: 3,
    name: 'Admin Dashboard',
    description: 'Analytics, user management, and content tools for internal teams.',
    tags: ['Dashboard', 'Charts', 'RBAC'],
    href: '/signup',
  },
  {
    id: 4,
    name: 'E-Commerce Store',
    description: 'Product catalog, cart, and checkout patterns for online retail.',
    tags: ['Shopify', 'Payments', 'Catalog'],
    href: '/start-project',
  },
  {
    id: 5,
    name: 'Blog & CMS',
    description: 'Editorial layout with categories, tags, and SEO-friendly article pages.',
    tags: ['CMS', 'Markdown', 'Journal'],
    href: '/blog',
  },
  {
    id: 6,
    name: 'Component Library',
    description: 'Reusable UI blocks you can preview, copy, and drop into any project.',
    tags: ['UI Kit', 'Design System', 'Copy-paste'],
    href: '/components',
  },
];

export function RetroTemplates() {
  return (
    <section className="border-b-4 border-black bg-white py-16">
      <FadeInView>
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="retro-heading mb-4 text-4xl md:text-5xl">Template library</h2>
            <p className="mx-auto max-w-2xl text-lg font-semibold">
              Production-ready starting points for SaaS products, marketing sites, and internal tools.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Link
                key={template.id}
                href={template.href}
                className="group retro-card flex flex-col p-6 transition-transform hover:-translate-y-1"
              >
                <h3 className="retro-heading mb-3 text-2xl">{template.name}</h3>
                <p className="mb-4 flex-1 font-semibold">{template.description}</p>
                <div className="mb-4 flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border-2 border-black bg-yellow-400 px-3 py-1 text-xs font-bold text-black"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-black tracking-widest group-hover:underline">
                  Explore
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </FadeInView>
    </section>
  );
}
