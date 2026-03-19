'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient as createSupabaseClient } from '@/utils/supabase/client';

const navLinks = [
  // { href: '#product', label: 'PRODUCT' },
  { href: '/components', label: 'COMPONENTS' },
  { href: '/templates', label: 'TEMPLATES' },
  { href: '/services', label: 'SERVICES' },
  { href: '/contact', label: 'CONTACT' },
  { href: '/about', label: 'ABOUT' },
];

type HeaderRoleState = 'loading' | 'guest' | 'user' | 'admin';

function HeaderCta({
  variant = 'desktop',
  onClick,
}: {
  variant?: 'desktop' | 'mobile';
  onClick?: () => void;
}) {
  const [roleState, setRoleState] = useState<HeaderRoleState>('loading');

  useEffect(() => {
    const supabase = createSupabaseClient();

    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setRoleState('guest');
        return;
      }

      const { data: profile } = await supabase
        .from('users_table')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (profile?.role === 'admin') {
        setRoleState('admin');
      } else {
        setRoleState('user');
      }
    };

    load();
  }, []);

  // While loading or logged-in non-admin, hide CTA
  if (roleState === 'loading' || roleState === 'user') {
    return null;
  }

  const baseClasses =
    variant === 'desktop'
      ? 'retro-button whitespace-nowrap shrink-0'
      : 'retro-button text-center mt-2 py-3';

  if (roleState === 'guest') {
    return (
      <Link href="/start-project" onClick={onClick} className={baseClasses}>
        GET STARTED
      </Link>
    );
  }

  // admin
  return (
    <Link href="/dashboard" onClick={onClick} className={baseClasses}>
      GO TO DASHBOARD
    </Link>
  );
}

export function RetroHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.header
      className="retro-border border-b-4 bg-white"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:py-6">
        <div className="flex min-w-0 items-center justify-between gap-4">
          <Link href="/" className="min-w-0 shrink-0">
            <h1 className="truncate text-2xl font-black uppercase tracking-widest sm:text-3xl md:text-4xl">
              RACTROTECH
            </h1>
          </Link>

          {/* Desktop nav + CTA */}
          <nav className="hidden shrink-0 items-center gap-6 md:flex lg:gap-8">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="whitespace-nowrap text-sm font-bold uppercase hover:underline"
              >
                {label}
              </a>
            ))}
            <HeaderCta variant="desktop" />
          </nav>

          {/* Hamburger: visible on small screens only */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="retro-border flex h-10 w-10 shrink-0 flex-col justify-center gap-1.5 rounded border-2 bg-white p-2 transition-colors hover:bg-black hover:text-white md:hidden"
          >
            <span
              className={`block h-0.5 w-full origin-center bg-current transition-transform ${
                menuOpen ? 'translate-y-2 rotate-45' : ''
              }`}
            />
            <span className={`block h-0.5 w-full bg-current ${menuOpen ? 'opacity-0' : ''}`} />
            <span
              className={`block h-0.5 w-full origin-center bg-current transition-transform ${
                menuOpen ? '-translate-y-2 -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="retro-border overflow-hidden border-t-2 bg-white md:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-black/10 px-2 py-3 text-sm font-bold uppercase last:border-0 hover:underline"
                >
                  {label}
                </a>
              ))}
              <HeaderCta variant="mobile" onClick={() => setMenuOpen(false)} />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
