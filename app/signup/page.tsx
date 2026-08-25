import Link from 'next/link';

import SignupForm from '@/components/SignupForm';
import ProviderSigninBlock from '@/components/ProviderSigninBlock';
import { AuthDivider, AuthShell } from '@/components/marketing/auth-shell';
import { constructMetadata, sitePath } from '@/lib/seo';
import { getEnabledOAuthProviders } from '@/lib/oauth/enabled-providers';

export const metadata = constructMetadata({
  title: 'Sign Up',
  description:
    'Create a Ractrotech account in seconds and start experimenting with high-quality SaaS templates.',
  canonicalUrl: sitePath('/signup'),
  noIndex: true,
});

export default function Signup() {
  const oauthProviders = getEnabledOAuthProviders();

  return (
    <AuthShell
      eyebrow="Get started"
      title="Create your account"
      description="Set up in seconds and start building with our templates and component library."
      points={['Free to start', 'No card required']}
      footer={
        <>
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-mkt-violet underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </>
      }
    >
      <SignupForm />
      <AuthDivider />
      <ProviderSigninBlock providers={oauthProviders} />
    </AuthShell>
  );
}
