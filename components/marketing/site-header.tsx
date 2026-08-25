'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';

import { BrandLogo } from '@/components/marketing/brand-logo';
import { NavPanelContent, PANEL_TONE_VARS } from '@/components/marketing/nav-panel';
import { SiteHeaderAuth } from '@/components/marketing/site-header-auth';
import { MarketingThemeToggle } from '@/components/marketing/theme-toggle';
import { NAV, type NavEntry } from '@/lib/marketing/nav';
import { cn } from '@/lib/utils';

type PanelEntry = Extract<NavEntry, { kind: 'panel' }>;

/**
 * Which backdrop the header is sitting on. The shells are split the same way
 * `GlobalBackground` is: most marketing pages run on the violet `canvas`, while the
 * reading- and form-heavy ones (blog, legal, auth, review) run on the light `surface`.
 * A single white-on-violet header would be invisible on the second set, so the tone is
 * passed in rather than guessed — see the `tone` prop on GlobalBackground at each shell.
 */
export type HeaderTone = 'canvas' | 'surface';

/* Hover intent. The open delay only applies to the *first* panel: once one is open,
   sliding along the bar should swap panels instantly or the nav feels stuck. The close
   delay is the important one — it is the grace period that lets the pointer cut the
   corner from a trigger down into the panel without the panel vanishing en route. */
const HOVER_OPEN_MS = 70;
const HOVER_CLOSE_MS = 160;

const SPRING = { type: 'spring', stiffness: 420, damping: 36, mass: 0.8 } as const;

const TONE = {
  canvas: {
    barScrolled: 'bg-mkt-canvas/80 backdrop-blur-xl',
    logo: 'text-white',
    capsule: 'bg-white/10 ring-1 ring-inset ring-white/[0.12]',
    item: 'text-white/80 hover:text-white',
    itemOpen: 'bg-white/[0.16] text-white',
    divider: 'bg-white/20',
    iconButton: 'border-white/20 text-white hover:bg-white/10',
    iconInline: 'text-white/75 hover:bg-white/10 hover:text-white',
    drawer: 'bg-mkt-canvas text-white',
    drawerRule: 'border-white/12',
    drawerMuted: 'text-white/60',
  },
  surface: {
    barScrolled: 'border-b border-mkt-line bg-mkt-surface/85 backdrop-blur-md',
    logo: 'text-mkt-brand',
    capsule: 'bg-mkt-ink/[0.05] ring-1 ring-inset ring-mkt-ink/[0.06]',
    item: 'text-mkt-muted hover:text-mkt-ink',
    itemOpen: 'bg-mkt-surface text-mkt-ink shadow-[0_1px_4px_rgba(11,11,16,0.10)]',
    divider: 'bg-mkt-ink/15',
    iconButton: 'border-mkt-line text-mkt-ink hover:bg-mkt-lavender',
    iconInline: 'text-mkt-muted hover:bg-mkt-ink/5 hover:text-mkt-ink',
    drawer: 'bg-mkt-surface text-mkt-ink',
    drawerRule: 'border-mkt-line',
    drawerMuted: 'text-mkt-muted',
  },
} satisfies Record<HeaderTone, Record<string, string>>;

export function SiteHeader({ tone = 'canvas' }: { tone?: HeaderTone }) {
  const t = TONE[tone];
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  const [openId, setOpenId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [caretX, setCaretX] = useState(0);

  const headerRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const openTimer = useRef<ReturnType<typeof setTimeout>>();
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  const active = NAV.find((entry): entry is PanelEntry => entry.kind === 'panel' && entry.id === openId);

  const clearTimers = useCallback(() => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const requestOpen = useCallback(
    (id: string) => {
      clearTimers();
      // Already showing a panel? Swap immediately — a delay here reads as lag, not intent.
      setOpenId((current) => {
        if (current !== null) return id;
        openTimer.current = setTimeout(() => setOpenId(id), HOVER_OPEN_MS);
        return current;
      });
    },
    [clearTimers]
  );

  const requestClose = useCallback(() => {
    clearTimers();
    closeTimer.current = setTimeout(() => setOpenId(null), HOVER_CLOSE_MS);
  }, [clearTimers]);

  const closeNow = useCallback(() => {
    clearTimers();
    setOpenId(null);
  }, [clearTimers]);

  useEffect(() => clearTimers, [clearTimers]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // A panel left open across a client-side navigation would hang over the new page.
  useEffect(() => {
    closeNow();
    setDrawerOpen(false);
  }, [pathname, closeNow]);

  // Park the caret under whichever trigger is open. Measured rather than derived from the
  // index: the triggers are text-width, so their centres are not evenly spaced.
  useEffect(() => {
    if (!openId) return;
    const trigger = triggerRefs.current[openId];
    const header = headerRef.current;
    if (!trigger || !header) return;
    const a = trigger.getBoundingClientRect();
    const b = header.getBoundingClientRect();
    setCaretX(a.left - b.left + a.width / 2);
  }, [openId]);

  // Prevent background scroll while the mobile drawer is open.
  useEffect(() => {
    if (!drawerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [drawerOpen]);

  useEffect(() => {
    if (!openId && !drawerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      // Return focus to the trigger so keyboard users are not dumped at the top of the page.
      if (openId) triggerRefs.current[openId]?.focus();
      closeNow();
      setDrawerOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [openId, drawerOpen, closeNow]);

  return (
    <header
      ref={headerRef}
      className={cn(
        'sticky top-0 z-50 w-full transition-colors duration-300',
        scrolled ? t.barScrolled : 'bg-transparent'
      )}
      onMouseLeave={requestClose}
    >
      <div className="mkt-shell relative flex h-[72px] items-center justify-between gap-4">
        <Link href="/" className="relative z-10 flex shrink-0 items-center" aria-label="Ractrotech home">
          <BrandLogo className={cn('h-[26px]', t.logo)} />
        </Link>

        {/* Absolutely centred rather than a flex child: the logo and the action group are
            different widths, so `justify-between` would leave the capsule off-centre and
            the panel below it would look untethered. */}
        <nav
          aria-label="Main"
          className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block"
          onMouseEnter={clearTimers}
        >
          <div className={cn('flex items-center gap-0.5 rounded-full p-1', t.capsule)}>
            {NAV.map((entry) => {
              if (entry.kind === 'link') {
                return (
                  <Link
                    key={entry.href}
                    href={entry.href}
                    onMouseEnter={requestClose}
                    className={cn(
                      'rounded-full px-3.5 py-1.5 text-[14px] font-medium transition-colors duration-200',
                      t.item
                    )}
                  >
                    {entry.label}
                  </Link>
                );
              }

              const isOpen = openId === entry.id;
              return (
                <button
                  key={entry.id}
                  type="button"
                  ref={(node) => {
                    triggerRefs.current[entry.id] = node;
                  }}
                  aria-expanded={isOpen}
                  aria-controls={`nav-panel-${entry.id}`}
                  onMouseEnter={() => requestOpen(entry.id)}
                  onFocus={() => requestOpen(entry.id)}
                  onClick={() => (isOpen ? closeNow() : requestOpen(entry.id))}
                  className={cn(
                    'flex items-center gap-1 rounded-full px-3.5 py-1.5 text-[14px] font-medium transition-colors duration-200',
                    isOpen ? t.itemOpen : t.item
                  )}
                >
                  {entry.label}
                  <ChevronDown
                    aria-hidden
                    className={cn(
                      'h-3.5 w-3.5 opacity-70 transition-transform duration-200',
                      isOpen && 'rotate-180'
                    )}
                  />
                </button>
              );
            })}

            <span aria-hidden className={cn('mx-1 h-4 w-px', t.divider)} />
            <MarketingThemeToggle variant="inline" className={t.iconInline} />
          </div>
        </nav>

        <div className="relative z-10 hidden shrink-0 items-center gap-2 lg:flex">
          <SiteHeaderAuth variant="desktop" tone={tone} />
        </div>

        <button
          type="button"
          onClick={() => setDrawerOpen((v) => !v)}
          aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={drawerOpen}
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full border transition-colors lg:hidden',
            t.iconButton
          )}
        >
          {drawerOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Panel layer. `pointer-events-none` on the full-width wrapper so it never swallows
          clicks on the page behind it; only the panel itself takes the pointer. The panel's
          own `pt-3` is the bridge across the gap below the capsule — without it, leaving the
          trigger would cross dead space and the close timer would win. */}
      <div className="pointer-events-none absolute inset-x-0 top-full hidden lg:block">
        <AnimatePresence>
          {active ? (
            <motion.div
              key="nav-panel"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }}
              transition={reduceMotion ? { duration: 0 } : SPRING}
              onMouseEnter={clearTimers}
              onMouseLeave={requestClose}
              className="pointer-events-auto flex justify-center pt-3"
            >
              <motion.div
                animate={{ x: caretX }}
                transition={reduceMotion ? { duration: 0 } : SPRING}
                aria-hidden
                style={PANEL_TONE_VARS[active.tone]}
                className="absolute left-0 top-[5px] -ml-2 h-4 w-4 rotate-45 rounded-[2px] bg-[rgb(var(--tone-fill))] transition-colors duration-300"
              />

              {/* `layout="size"` is what makes the box morph between menus instead of
                  snapping: Services is a three-column panel and the rest are two, and the
                  widths are content-derived in nav-panel.tsx. `overflow-hidden` clips the
                  incoming content while that morph plays. */}
              <motion.div
                layout={reduceMotion ? false : 'size'}
                transition={reduceMotion ? { duration: 0 } : SPRING}
                id={`nav-panel-${active.id}`}
                style={PANEL_TONE_VARS[active.tone]}
                className="relative max-w-[calc(100vw-2rem)] overflow-hidden rounded-[20px] bg-[rgb(var(--tone-fill))] text-[rgb(var(--tone-ink))] shadow-[0_24px_60px_-20px_rgba(11,11,16,0.45)] transition-colors duration-300"
              >
                <motion.div
                  key={active.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                >
                  <NavPanelContent entry={active} onNavigate={closeNow} />
                </motion.div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {drawerOpen ? <MobileDrawer tone={tone} onClose={() => setDrawerOpen(false)} /> : null}
    </header>
  );
}

/**
 * Mobile menu. The panels become accordions rather than being flattened into one long
 * list: the grouping and the blurbs are the point of the new nav, and a flat list of
 * fifteen links throws both away.
 */
function MobileDrawer({ tone, onClose }: { tone: HeaderTone; onClose: () => void }) {
  const t = TONE[tone];
  const [section, setSection] = useState<string | null>(null);

  return (
    <div className={cn('max-h-[calc(100vh-72px)] overflow-y-auto border-t lg:hidden', t.drawer, t.drawerRule)}>
      <nav className="mkt-shell flex flex-col py-3" aria-label="Mobile">
        {NAV.map((entry) => {
          if (entry.kind === 'link') {
            return (
              <Link
                key={entry.href}
                href={entry.href}
                onClick={onClose}
                className={cn('border-b py-3.5 text-[16px] font-medium', t.drawerRule)}
              >
                {entry.label}
              </Link>
            );
          }

          const isOpen = section === entry.id;
          const items = entry.columns.flatMap((column) => [
            ...(column.features ?? []).map((item) => ({ href: item.href, label: item.label, blurb: item.blurb })),
            ...(column.links ?? []).map((item) => ({ href: item.href, label: item.label, blurb: null })),
          ]);

          return (
            <div key={entry.id} className={cn('border-b', t.drawerRule)}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setSection(isOpen ? null : entry.id)}
                className="flex w-full items-center justify-between py-3.5 text-left text-[16px] font-medium"
              >
                {entry.label}
                <ChevronDown
                  aria-hidden
                  className={cn('h-4 w-4 transition-transform duration-200', isOpen && 'rotate-180')}
                />
              </button>

              {isOpen ? (
                <ul className="pb-3">
                  {items.map((item) => (
                    <li key={item.href + item.label}>
                      <Link href={item.href} onClick={onClose} className="block py-2.5 pl-3">
                        <span className="text-[15px] font-medium">{item.label}</span>
                        {item.blurb ? (
                          <span className={cn('mt-0.5 block text-[13px] leading-snug', t.drawerMuted)}>
                            {item.blurb}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          );
        })}

        <MarketingThemeToggle
          variant="mobile"
          className={cn(t.drawerRule, tone === 'canvas' && 'text-white')}
        />
        <div className="pt-3">
          <SiteHeaderAuth variant="mobile" tone={tone} onNavigate={onClose} />
        </div>
      </nav>
    </div>
  );
}
