'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { LoginModal } from '@/components/auth/LoginModal';
import { useAuth } from '@/hooks/use-auth';

type PendingAction = () => void | Promise<void>;

type AuthModalContextValue = {
  isOpen: boolean;
  openLoginModal: (pendingAction?: PendingAction) => void;
  closeLoginModal: () => void;
  handleProtectedAction: (action: PendingAction) => void;
};

const AuthModalContext = createContext<AuthModalContextValue | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const { user, initialized, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const pendingActionRef = useRef<PendingAction | null>(null);

  const closeLoginModal = useCallback(() => {
    setIsOpen(false);
    pendingActionRef.current = null;
  }, []);

  const openLoginModal = useCallback((pendingAction?: PendingAction) => {
    if (pendingAction) {
      pendingActionRef.current = pendingAction;
    }
    setIsOpen(true);
  }, []);

  const handleProtectedAction = useCallback(
    (action: PendingAction) => {
      if (user) {
        void action();
        return;
      }
      pendingActionRef.current = action;
      setIsOpen(true);
    },
    [user],
  );

  useEffect(() => {
    if (!initialized || loading || !user || !isOpen) return;

    const action = pendingActionRef.current;
    pendingActionRef.current = null;
    setIsOpen(false);

    if (action) {
      void action();
    }
  }, [user, initialized, loading, isOpen]);

  const value: AuthModalContextValue = {
    isOpen,
    openLoginModal,
    closeLoginModal,
    handleProtectedAction,
  };

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <LoginModal open={isOpen} onOpenChange={(open) => !open && closeLoginModal()} />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal(): AuthModalContextValue {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    throw new Error('useAuthModal must be used within AuthModalProvider');
  }
  return ctx;
}
