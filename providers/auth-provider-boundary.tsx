'use client';

import { Suspense, type ReactNode } from 'react';

import { AuthProvider } from '@/contexts/auth-context';

export function AuthProviderBoundary({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AuthProvider>{children}</AuthProvider>
    </Suspense>
  );
}
