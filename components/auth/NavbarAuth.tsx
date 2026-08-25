'use client';

import Link from 'next/link';

import { NavbarAuthSkeleton } from '@/components/auth/NavbarAuthSkeleton';
import { UserMenu } from '@/components/auth/UserMenu';
import { useAuthModal } from '@/contexts/auth-modal-context';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

type NavbarAuthProps = {
  variant?: 'desktop' | 'mobile';
  onNavigate?: () => void;
};

export function NavbarAuth({ variant = 'desktop', onNavigate }: NavbarAuthProps) {
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

  if (!initialized || loading) {
    return <NavbarAuthSkeleton />;
  }

  if (!isAuthenticated) {
    const linkClass =
      variant === 'mobile'
        ? 'border-b border-black/10 px-2 py-3 text-sm font-bold last:border-0 hover:underline'
        : 'whitespace-nowrap text-sm font-bold hover:underline';

    return (
      <>
        <button
          type="button"
          onClick={() => {
            openLoginModal();
            onNavigate?.();
          }}
          className={linkClass}
        >
          LOGIN
        </button>
        <Link href="/signup" onClick={onNavigate} className={linkClass}>
          SIGN UP
        </Link>
      </>
    );
  }

  if (variant === 'mobile') {
    return (
      <div className="flex flex-col gap-3 border-t border-black/10 px-2 py-4">
        {isAdmin ? (
          <Link
            href="/dashboard"
            onClick={onNavigate}
            className="retro-button text-center py-3"
          >
            GO TO DASHBOARD
          </Link>
        ) : null}
        <div className="flex items-center justify-between">
          <UserMenu showNotification />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {isAdmin ? (
        <Link href="/dashboard" className="retro-button whitespace-nowrap shrink-0 text-xs sm:text-sm">
          DASHBOARD
        </Link>
      ) : null}
      <UserMenu showNotification />
    </div>
  );
}
