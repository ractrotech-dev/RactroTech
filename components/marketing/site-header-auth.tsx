'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { UserMenu } from '@/components/auth/UserMenu';
import { useAuthModal } from '@/contexts/auth-modal-context';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { createClient } from '@/utils/supabase/client';
import { cn } from '@/lib/utils';

/**
 * Auth strip for the marketing header. Same behaviour as components/auth/NavbarAuth.tsx —
 * login modal for guests, UserMenu plus a dashboard link for admins — restyled for the
 * marketing system. NavbarAuth is left alone because the retro surfaces still use it.
 */

type Props = {
  variant?: 'desktop' | 'mobile';
  /** Matches the header's own tone — see `HeaderTone` in components/marketing/site-header.tsx. */
  tone?: 'canvas' | 'surface';
  onNavigate?: () => void;
};

/* The guest strip is the only part that changes with the tone: on the violet canvas the
   call to action is a white pill, on a light surface it is the violet one. Signed-in
   chrome (UserMenu) carries its own surface either way. */
const AUTH_TONE = {
  canvas: {
    ghost: 'text-white/80 hover:bg-white/10 hover:text-white',
    /* --mkt-contrast, not --mkt-ink: this pill is white in both themes, so its label needs
       a token that stays dark in both. --mkt-ink flips to near-white and disappears here. */
    cta: 'bg-white text-mkt-contrast hover:bg-white/90',
    skeleton: 'bg-white/10',
    outline: 'border-white/20 text-white hover:bg-white/10',
  },
  surface: {
    ghost: 'text-mkt-ink hover:bg-mkt-lavender',
    cta: 'bg-mkt-violet text-white shadow-[0_8px_20px_-8px_rgba(91,61,245,0.7)] hover:bg-mkt-violet-soft',
    skeleton: 'bg-mkt-lavender',
    outline: 'border-mkt-line text-mkt-ink hover:bg-mkt-lavender',
  },
} as const;

export function SiteHeaderAuth({ variant = 'desktop', tone = 'canvas', onNavigate }: Props) {
  const t = AUTH_TONE[tone];
  const { isAuthenticated, loading, initialized } = useAuth();
  const { openLoginModal } = useAuthModal();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsAdmin(false);
      return;
    }

    const supabase = createClient();
    void supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      void supabase
        .from('users_table')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()
        .then(({ data }) => {
          setIsAdmin(data?.role === 'admin' || data?.role === 'super_admin');
        });
    });
  }, [isAuthenticated]);

  const mobile = variant === 'mobile';

  if (!initialized || loading) {
    return (
      <div className={mobile ? 'flex gap-2' : 'flex items-center gap-2'} aria-hidden>
        <Skeleton className={cn('h-9 w-9 rounded-full', t.skeleton)} />
        {!mobile ? <Skeleton className={cn('hidden h-9 w-28 rounded-full md:block', t.skeleton)} /> : null}
      </div>
    );
  }

  if (!isAuthenticated) {
    if (mobile) {
      return (
        <div className="flex flex-col gap-2 pt-2">
          <button
            type="button"
            onClick={() => {
              openLoginModal();
              onNavigate?.();
            }}
            className={cn('mkt-btn w-full border px-6 py-3', t.outline)}
          >
            Log in
          </button>
          <Link
            href="/start-project"
            onClick={onNavigate}
            className={cn('mkt-btn w-full px-6 py-3', t.cta)}
          >
            Start a project
          </Link>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => openLoginModal()}
          className={cn(
            'rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors duration-200',
            t.ghost
          )}
        >
          Log in
        </button>
        <Link
          href="/start-project"
          className={cn('mkt-btn px-4 py-2 text-[14px] font-semibold', t.cta)}
        >
          Start a project
        </Link>
      </div>
    );
  }

  if (mobile) {
    return (
      <div className={cn('flex flex-col gap-3 border-t pt-4', tone === 'canvas' ? 'border-white/12' : 'border-mkt-line')}>
        {isAdmin ? (
          <Link href="/dashboard" onClick={onNavigate} className={cn('mkt-btn w-full px-6 py-3', t.cta)}>
            Go to dashboard
          </Link>
        ) : null}
        <UserMenu showNotification />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {isAdmin ? (
        <Link
          href="/dashboard"
          className={cn(
            'hidden rounded-full border px-4 py-2 text-[14px] font-medium transition-colors sm:inline-flex',
            t.outline
          )}
        >
          Dashboard
        </Link>
      ) : null}
      <UserMenu showNotification />
    </div>
  );
}
