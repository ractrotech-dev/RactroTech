import Link from 'next/link';
import { FadeInView } from '@/components/fade-in-view';

const projects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    category: 'Web Development',
    description: 'Custom shopping platform with 10,000+ users',
    href: '/start-project',
  },
  {
    id: 2,
    title: 'AI Analytics Dashboard',
    category: 'SaaS Development',
    description: 'Real-time data visualization with machine learning',
    href: '/saas-development',
  },
  {
    id: 3,
    title: 'Mobile Fitness App',
    category: 'MVP Development',
    description: 'Cross-platform app with 100K+ downloads',
    href: '/mvp-development',
  },
  {
    id: 4,
    title: 'SaaS Management Tool',
    category: 'SaaS Development',
    description: 'Enterprise solution for 50+ companies',
    href: '/saas-development',
  },
  {
    id: 5,
    title: 'Cloud Migration',
    category: 'Web App Development',
    description: 'Complete infrastructure modernization',
    href: '/web-app-development',
  },
  {
    id: 6,
    title: 'Brand Redesign',
    category: 'UI/UX Design',
    description: 'Complete visual identity overhaul',
    href: '/ui-ux-design',
  },
];

export function RetroPortfolio() {
  return (
    <section id="portfolio" className="border-b-4 border-black bg-white py-16">
      <FadeInView>
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="retro-heading mb-4 text-center text-5xl">OUR WORK</h2>
          <p className="mx-auto mb-12 max-w-2xl text-center font-semibold text-black/70">
            Representative projects across SaaS, MVP, and web app development.{' '}
            <Link href="/start-project" className="font-black underline">
              Start your project
            </Link>{' '}
            to see what we can build for you.
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={project.href}
                className="retro-card group flex flex-col p-6 transition-transform hover:-translate-y-1"
              >
                <h3 className="retro-heading mb-2 text-2xl group-hover:underline">{project.title}</h3>
                <span className="mb-3 w-fit border-2 border-black bg-yellow-400 px-3 py-1 text-sm font-bold text-black">
                  {project.category}
                </span>
                <p className="flex-1 font-semibold">{project.description}</p>
                <span className="mt-4 w-full border-2 border-black bg-white px-4 py-2 text-center text-sm font-bold group-hover:bg-gray-100">
                  LEARN MORE
                </span>
              </Link>
            ))}
          </div>
        </div>
      </FadeInView>
    </section>
  );
}
