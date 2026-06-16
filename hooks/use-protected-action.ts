'use client';

import { useCallback } from 'react';

import { useAuthModal } from '@/contexts/auth-modal-context';
import { useAuth } from '@/hooks/use-auth';

export function useProtectedAction() {
  const { isAuthenticated } = useAuth();
  const { handleProtectedAction, openLoginModal } = useAuthModal();

  const requireAuth = useCallback(
    (action: () => void | Promise<void>) => {
      handleProtectedAction(action);
    },
    [handleProtectedAction],
  );

  return {
    isAuthenticated,
    handleProtectedAction: requireAuth,
    openLoginModal,
  };
}
