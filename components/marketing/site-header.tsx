'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

import { BrandLogo } from '@/components/marketing/brand-logo';
import { SiteHeaderAuth } from '@/components/marketing/site-header-auth';
import { MarketingThemeToggle } from '@/components/marketing/theme-toggle';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/templates', label: 'Templates' },
  { href: '/components', label: 'Components' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Prevent background scroll while the mobile drawer is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full bg-mkt-surface/85 backdrop-blur-md transition-shadow duration-200',
        scrolled ? 'border-b border-mkt-line shadow-[0_1px_16px_-8px_rgba(11,11,16,0.25)]' : 'border-b border-transparent'
      )}
    >
      <div className="mkt-shell flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Ractrotech home">
          <BrandLogo className="h-[26px] text-mkt-brand" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-full px-3.5 py-2 text-[15px] font-medium text-mkt-muted transition-colors hover:bg-mkt-lavender hover:text-mkt-ink"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <MarketingThemeToggle />
          <SiteHeaderAuth variant="desktop" />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-mkt-line text-mkt-ink transition-colors hover:bg-mkt-lavender lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-mkt-line bg-mkt-surface lg:hidden">
          <nav className="mkt-shell flex flex-col py-4" aria-label="Mobile">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="border-b border-mkt-line py-3.5 text-[16px] font-medium text-mkt-ink last:border-0"
              >
                {label}
              </Link>
            ))}
            <MarketingThemeToggle variant="mobile" />
            <div className="pt-3">
              <SiteHeaderAuth variant="mobile" onNavigate={() => setOpen(false)} />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
