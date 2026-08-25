'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { syncCurrentUser } from '@/app/auth/actions';
import { AUTH_ERRORS } from '@/lib/auth/constants';
import { isEmailVerified } from '@/lib/auth/verification';
import { createClient } from '@/utils/supabase/client';

type LoginModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInError) {
        setError(AUTH_ERRORS.invalidCredentials);
        return;
      }

      if (data.user && !isEmailVerified(data.user)) {
        await supabase.auth.signOut();
        setError(AUTH_ERRORS.emailNotVerified);
        return;
      }

      await syncCurrentUser();
      toast.success('Welcome back!');
      onOpenChange(false);
    } catch {
      setError(AUTH_ERRORS.genericFailure);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md border-0 bg-white/80 p-0 text-black shadow-2xl backdrop-blur-xl sm:rounded-2xl [&>button]:hidden"
        overlayClassName="bg-black/30 backdrop-blur-lg"
      >
        <div className="relative border border-white/40 bg-white/70 p-6 backdrop-blur-xl sm:p-8">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-full p-1.5 text-black/50 transition-colors hover:bg-black/5 hover:text-black"
            aria-label="Close login"
          >
            <X className="h-4 w-4" />
          </button>

          <DialogHeader className="space-y-2 pr-8 text-left">
            <DialogTitle className="text-xl font-bold tracking-tight text-black">
              Sign in to continue
            </DialogTitle>
            <DialogDescription className="text-sm text-black/60">
              Log in to download assets and view premium content.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-modal-email" className="text-xs font-semibold text-black/70">
                Email
              </Label>
              <Input
                id="login-modal-email"
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                className="border-black/10 bg-white/80 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-modal-password" className="text-xs font-semibold text-black/70">
                Password
              </Label>
              <Input
                id="login-modal-password"
                type="password"
                name="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="border-black/10 bg-white/80 backdrop-blur-sm"
              />
            </div>

            {error && (
              <p className="text-sm font-medium text-red-600" role="alert">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full border-2 border-black bg-black font-semibold text-yellow-400 hover:bg-black/90"
            >
              {submitting ? 'Signing in…' : 'Login'}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-black/55">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold text-black underline underline-offset-2">
              Sign up
            </Link>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
