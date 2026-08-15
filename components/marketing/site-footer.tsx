import Link from 'next/link';
import { Linkedin, Instagram } from 'lucide-react';

import { BrandLogo } from '@/components/marketing/brand-logo';

/** Link map carried over verbatim from components/retro-footer.tsx. */
const COLUMNS: Array<{ title: string; links: Array<{ href: string; label: string }> }> = [
  {
    title: 'Services',
    links: [
      { href: '/saas-development', label: 'SaaS development' },
      { href: '/mvp-development', label: 'MVP development' },
      { href: '/nextjs-development', label: 'Next.js development' },
      { href: '/web-app-development', label: 'Web apps' },
      { href: '/ui-ux-design', label: 'UI/UX design' },
      { href: '/services', label: 'All services' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About us' },
      { href: '/blog', label: 'Blog' },
      { href: '/contact', label: 'Contact' },
      { href: '/review', label: 'Leave a review' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '/projects', label: 'Projects' },
      { href: '/templates', label: 'Templates' },
      { href: '/components', label: 'UI kit' },
      { href: '/start-project', label: 'Start a project' },
      { href: '/reviews', label: 'Reviews' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/terms', label: 'Terms' },
      { href: '/privacy', label: 'Privacy' },
      { href: '/license', label: 'License' },
      { href: '/cookies', label: 'Cookies' },
    ],
  },
];

const SOCIALS = [
  { icon: Linkedin, href: 'https://www.linkedin.com/company/ractrotech/', label: 'Ractrotech on LinkedIn' },
  { icon: Instagram, href: 'https://www.instagram.com/ractrotech/', label: 'Ractrotech on Instagram' },
];

export function SiteFooter() {
  return (
    <footer className="bg-mkt-contrast text-white">
      <div className="mkt-shell py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center" aria-label="Ractrotech home">
              <BrandLogo className="h-[26px] text-white" />
            </Link>
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-white/55">
              Your partner for websites, apps, SaaS, design, and digital products — built by
              developers who ship real work, not just presentations.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/start-project"
                className="inline-flex items-center rounded-full bg-white px-5 py-2.5 text-[15px] font-medium text-mkt-contrast transition-colors hover:bg-white/90"
              >
                Start a project
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center rounded-full border border-white/20 px-5 py-2.5 text-[15px] font-medium text-white transition-colors hover:border-white/40 hover:bg-white/5"
              >
                Log in
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-white/40">
                  {col.title}
                </h2>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="text-[15px] text-white/65 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-[13px] text-white/40">
            © {new Date().getFullYear()} Ractrotech. All rights reserved.
          </p>
          <div className="flex gap-2">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-white/40 hover:text-white"
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
