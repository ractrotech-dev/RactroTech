import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

import LoginForm from '@/components/LoginForm';
import ProviderSigninBlock from '@/components/ProviderSigninBlock';
import { AuthDivider, AuthShell } from '@/components/marketing/auth-shell';
import { constructMetadata, sitePath } from '@/lib/seo';
import { getEnabledOAuthProviders } from '@/lib/oauth/enabled-providers';

export const metadata = constructMetadata({
  title: 'Login',
  description: 'Sign in to your Ractrotech account to access templates and developer tools.',
  canonicalUrl: sitePath('/login'),
  noIndex: true,
});

export default function Login({ searchParams }: { searchParams: { error?: string } }) {
  const oauthProviders = getEnabledOAuthProviders();

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in to Ractrotech"
      description="Pick up where you left off — dashboards, templates, and your projects."
      footer={
        <>
          <Link
            href="/forgot-password"
            className="font-medium text-mkt-violet underline-offset-4 hover:underline"
          >
            Forgot password?
          </Link>
          <span className="mx-2 text-mkt-line" aria-hidden>
            ·
          </span>
          No account?{' '}
          <Link
            href="/signup"
            className="font-medium text-mkt-violet underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </>
      }
    >
      {searchParams?.error ? (
        <div
          role="alert"
          className="mb-6 flex items-start gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-[14px] font-medium text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>{searchParams.error}</span>
        </div>
      ) : null}

      <LoginForm />
      <AuthDivider />
      <ProviderSigninBlock providers={oauthProviders} />
    </AuthShell>
  );
}
