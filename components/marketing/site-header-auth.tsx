'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { UserMenu } from '@/components/auth/UserMenu';
import { useAuthModal } from '@/contexts/auth-modal-context';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { createClient } from '@/utils/supabase/client';

/**
 * Auth strip for the marketing header. Same behaviour as components/auth/NavbarAuth.tsx —
 * login modal for guests, UserMenu plus a dashboard link for admins — restyled for the
 * marketing system. NavbarAuth is left alone because the retro surfaces still use it.
 */

type Props = {
  variant?: 'desktop' | 'mobile';
  onNavigate?: () => void;
};

export function SiteHeaderAuth({ variant = 'desktop', onNavigate }: Props) {
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
        <Skeleton className="h-9 w-9 rounded-full bg-mkt-lavender" />
        {!mobile ? <Skeleton className="hidden h-9 w-24 rounded-full bg-mkt-lavender md:block" /> : null}
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
            className="mkt-btn-ghost w-full"
          >
            Log in
          </button>
          <Link href="/start-project" onClick={onNavigate} className="mkt-btn-primary w-full">
            Start a project
          </Link>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => openLoginModal()}
          className="rounded-full px-4 py-2 text-[15px] font-medium text-mkt-ink transition-colors hover:bg-mkt-lavender"
        >
          Log in
        </button>
        <Link href="/start-project" className="mkt-btn-primary !px-5 !py-2.5">
          Start a project
        </Link>
      </div>
    );
  }

  if (mobile) {
    return (
      <div className="flex flex-col gap-3 border-t border-mkt-line pt-4">
        {isAdmin ? (
          <Link href="/dashboard" onClick={onNavigate} className="mkt-btn-primary w-full">
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
          className="hidden rounded-full border border-mkt-line px-4 py-2 text-[15px] font-medium text-mkt-ink transition-colors hover:bg-mkt-lavender sm:inline-flex"
        >
          Dashboard
        </Link>
      ) : null}
      <UserMenu showNotification />
    </div>
  );
}
