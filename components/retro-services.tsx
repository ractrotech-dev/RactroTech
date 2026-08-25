import Link from 'next/link';
import { FadeInView } from '@/components/fade-in-view';

const services = [
  {
    id: 1,
    name: 'Web Development',
    description: 'A fast, professional website that builds trust and brings you customers.',
    tags: ['Business sites', 'Landing pages', 'Portals'],
    href: '/web-app-development',
  },
  {
    id: 2,
    name: 'SaaS Development',
    description: 'Subscription software your users will love — built to grow with your business.',
    tags: ['Dashboards', 'Billing', 'Multi-tenant'],
    href: '/saas-development',
  },
  {
    id: 3,
    name: 'MVP Development',
    description: 'Test your idea in the market without spending months or burning your budget.',
    tags: ['Startups', 'Lean launch', 'Investor-ready'],
    href: '/mvp-development',
  },
  {
    id: 4,
    name: 'Mobile Apps',
    description: 'Reach users on iOS and Android with apps that feel fast and native.',
    tags: ['iOS', 'Android', 'Cross-platform'],
    href: '/start-project',
  },
  {
    id: 5,
    name: 'UI/UX Design',
    description: 'Interfaces people actually enjoy using — researched, designed, and dev-ready.',
    tags: ['Wireframes', 'Prototypes', 'Design systems'],
    href: '/ui-ux-design',
  },
  {
    id: 6,
    name: 'E-Commerce',
    description: 'Online stores with smooth checkout, inventory, and payments that just work.',
    tags: ['Shopify', 'Custom stores', 'Payments'],
    href: '/start-project',
  },
  {
    id: 7,
    name: 'AI Integration',
    description: 'Add smart automation, chatbots, and AI features that save your team time.',
    tags: ['Chatbots', 'Automation', 'Analytics'],
    href: '/start-project',
  },
  {
    id: 8,
    name: 'Cloud & DevOps',
    description: 'Reliable hosting, scaling, and infrastructure so your product stays online.',
    tags: ['AWS', 'Azure', 'Monitoring'],
    href: '/start-project',
  },
  {
    id: 9,
    name: 'Templates & UI Kits',
    description: 'Skip months of setup — start from production-ready code and customize fast.',
    tags: ['SaaS starters', 'Components', 'Dashboards'],
    href: '/templates',
  },
  {
    id: 10,
    name: 'Consulting',
    description: 'Honest technical advice when you need a clear plan before you build.',
    tags: ['Architecture', 'Scoping', 'Strategy'],
    href: '/startup-development',
  },
];

export function RetroServices() {
  return (
    <section id="services" className="border-b-4 border-black bg-white py-16">
      <FadeInView>
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="retro-heading mb-4 text-5xl">WHAT WE BUILD FOR YOU</h2>
            <p className="mx-auto max-w-2xl text-lg font-semibold">
              Whatever you need to grow online — we design it, build it, launch it, and support it.
              Pick a service below or tell us your goal and we&apos;ll recommend the right path.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.id}
                href={service.href}
                className="retro-card group block p-6 transition-transform hover:-translate-y-1"
              >
                <h3 className="retro-heading mb-3 text-2xl group-hover:underline">{service.name}</h3>
                <p className="mb-4 font-semibold">{service.description}</p>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border-2 border-black bg-yellow-400 px-3 py-1 text-xs font-bold text-black"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/services" className="retro-button inline-flex">
              View All Services
            </Link>
          </div>
        </div>
      </FadeInView>
    </section>
  );
}
