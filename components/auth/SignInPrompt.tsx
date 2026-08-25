'use client';

import { LogIn } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAuthModal } from '@/contexts/auth-modal-context';

type SignInPromptProps = {
  title?: string;
  description?: string;
};

export function SignInPrompt({
  title = 'Sign in to view this content',
  description = 'Log in to access your account dashboard, saved items, and profile settings.',
}: SignInPromptProps) {
  const { openLoginModal } = useAuthModal();

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center sm:py-24">
      <div className="retro-border border-4 border-black bg-yellow-50 p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-xl font-black tracking-tight">{title}</h2>
        <p className="mt-2 text-sm font-semibold text-black/65">{description}</p>
        <Button
          type="button"
          onClick={() => openLoginModal()}
          className="mt-6 w-full border-2 border-black bg-black font-semibold text-yellow-400 hover:bg-black/90"
        >
          <LogIn className="mr-2 h-4 w-4" />
          Sign in
        </Button>
      </div>
    </div>
  );
}
