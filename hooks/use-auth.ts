'use client';

import { useAuthContext } from '@/contexts/auth-context';

export function useAuth() {
  const { user, session, loading, initialized, signOut } = useAuthContext();
  return {
    user,
    session,
    isAuthenticated: Boolean(user),
    loading,
    initialized,
    signOut,
  };
}
