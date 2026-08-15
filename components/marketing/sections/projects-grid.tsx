import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

import { Reveal, RevealGroup, RevealItem } from '@/components/marketing/reveal';
import { BrowserFrame } from '@/components/marketing/mockups/browser-frame';
import { DashboardMock } from '@/components/marketing/mockups/dashboard-mock';
import { KanbanMock } from '@/components/marketing/mockups/kanban-mock';
import {
  ComponentGridMock,
  EditorialMock,
  LandingMock,
  StorefrontMock,
} from '@/components/marketing/mockups/showcase-mocks';
import {
  SHOWCASE_PROJECTS,
  type ShowcaseProject,
  type ShowcaseVisual,
} from '@/lib/marketing/projects';

function ProjectVisual({ visual }: { visual: ShowcaseVisual }) {
  switch (visual) {
    case 'dashboard':
      return <DashboardMock className="h-full" />;
    case 'kanban':
      return <KanbanMock className="h-full" />;
    case 'landing':
      return <LandingMock />;
    case 'store':
      return <StorefrontMock />;
    case 'editorial':
      return <EditorialMock />;
    case 'components':
      return <ComponentGridMock />;
    default:
      return null;
  }
}

function ProjectCard({ project }: { project: ShowcaseProject }) {
  return (
    <RevealItem as="li" className="h-full">
      <Link
        href={project.href}
        className="group flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mkt-violet focus-visible:ring-offset-2"
      >
        <BrowserFrame url={project.url} tone={project.tone}>
          <div className="h-[200px] overflow-hidden sm:h-[240px]">
            <ProjectVisual visual={project.visual} />
          </div>
        </BrowserFrame>

        <div className="mt-5 flex flex-1 flex-col px-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="mkt-display text-[19px] sm:text-[21px]">{project.name}</h3>
            <ArrowUpRight
              className="mt-1 h-5 w-5 shrink-0 text-mkt-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden
            />
          </div>
          <p className="mt-2 flex-1 text-[15px] leading-relaxed text-mkt-muted">{project.summary}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-mkt-line bg-mkt-surface px-2.5 py-1 text-[12px] font-medium text-mkt-muted"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-medium text-mkt-violet group-hover:underline">
            See how we build it
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </RevealItem>
  );
}

/** Full project showcase grid for /projects. */
export function ProjectsGrid() {
  return (
    <section className="pb-20 lg:pb-28" aria-labelledby="projects-grid-heading">
      <div className="mkt-shell">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="mkt-eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-mkt-violet" />
            Project showcase
          </span>
          <h2
            id="projects-grid-heading"
            className="mkt-display mt-6 text-[32px] leading-[1.1] sm:text-[42px]"
          >
            Products we design and ship
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-mkt-muted">
            A look at the kinds of builds we take from idea to production — SaaS, MVPs, marketing
            sites, stores and internal tools.
          </p>
        </Reveal>

        <RevealGroup as="ul" className="mt-12 grid gap-10 sm:grid-cols-2 lg:gap-x-8 lg:gap-y-14">
          {SHOWCASE_PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
