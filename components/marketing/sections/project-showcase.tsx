import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Marquee } from '@/components/marketing/marquee';
import { Reveal } from '@/components/marketing/reveal';
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

function ShowcaseCard({ name, summary, tags, url, tone, visual }: ShowcaseProject) {
  return (
    <div className="w-[290px] shrink-0 px-3 sm:w-[440px] sm:px-4 lg:w-[540px]">
      <BrowserFrame url={url} tone={tone}>
        <div className="h-[180px] overflow-hidden sm:h-[250px] lg:h-[290px]">
          <ProjectVisual visual={visual} />
        </div>
      </BrowserFrame>

      <div className="px-1 pt-5">
        <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-mkt-ink sm:text-[19px]">
          {name}
        </h3>
        <p className="mt-1.5 text-[14px] leading-relaxed text-mkt-muted sm:text-[15px]">{summary}</p>
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-mkt-line bg-mkt-surface px-2.5 py-1 text-[12px] font-medium text-mkt-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Auto-scrolling project showcase under the hero. Cards are not links — Marquee clones
 * children for the loop, and links in the aria-hidden clone would duplicate tab stops.
 * CTA below routes to /projects.
 */
export function ProjectShowcase() {
  return (
    <section className="py-20 lg:py-28" aria-labelledby="showcase-heading">
      <div className="mkt-shell">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="mkt-eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-mkt-violet" />
            Project showcase
          </span>
          <h2
            id="showcase-heading"
            className="mkt-display mt-6 text-[32px] leading-[1.1] sm:text-[42px]"
          >
            Products we design and ship
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-mkt-muted">
            SaaS platforms, MVPs, marketing sites, stores and internal tools — the kinds of
            builds we take from idea to production.
          </p>
        </Reveal>
      </div>

      <div className="mt-12 lg:mt-16">
        <Marquee durationSeconds={60} align="stretch">
          {SHOWCASE_PROJECTS.map((project) => (
            <ShowcaseCard key={project.id} {...project} />
          ))}
        </Marquee>
      </div>

      <div className="mkt-shell mt-12 text-center lg:mt-14">
        <Link href="/projects" className="mkt-btn-ghost">
          View all projects
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
