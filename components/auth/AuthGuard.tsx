'use client';

import { type ReactNode } from 'react';

import { DashboardSkeleton } from '@/components/auth/DashboardSkeleton';
import { SignInPrompt } from '@/components/auth/SignInPrompt';
import { useAuth } from '@/hooks/use-auth';

type AuthGuardProps = {
  children: ReactNode;
  fallback?: ReactNode;
  /** When true, guests see a sign-in prompt instead of children (no auto modal). */
  requireAuth?: boolean;
};

export function AuthGuard({
  children,
  fallback = <DashboardSkeleton />,
  requireAuth = false,
}: AuthGuardProps) {
  const { user, loading, initialized } = useAuth();

  if (!initialized || loading) {
    return <>{fallback}</>;
  }

  if (!user && requireAuth) {
    return <SignInPrompt />;
  }

  return <>{children}</>;
}
