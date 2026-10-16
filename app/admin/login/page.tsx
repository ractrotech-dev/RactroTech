import Image from 'next/image'
import Link from 'next/link'

import AdminLoginForm from '@/components/admin/AdminLoginForm'
import AdminProviderSigninBlock from '@/components/admin/AdminProviderSigninBlock'
import { AdminCard } from '@/components/admin/ui'
import { getEnabledOAuthProviders } from '@/lib/oauth/enabled-providers'
import { constructMetadata, sitePath } from '@/lib/seo'

export const metadata = constructMetadata({
  title: 'Admin Login',
  description: 'Sign in to the Ractrotech admin dashboard.',
  canonicalUrl: sitePath('/admin/login'),
  noIndex: true,
})

type AdminLoginPageProps = {
  searchParams: { error?: string }
}

export default function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const oauthProviders = getEnabledOAuthProviders()
  const hasProviders = Object.values(oauthProviders).some(Boolean)
  const raw = typeof searchParams.error === 'string' ? searchParams.error : ''
  let errorMessage: string | undefined
  try {
    errorMessage = raw ? decodeURIComponent(raw) : undefined
  } catch {
    errorMessage = undefined
  }
  if (errorMessage && errorMessage.length > 500) {
    errorMessage = errorMessage.slice(0, 500)
  }

  return (
    <div className="min-h-screen bg-mkt-surface text-mkt-ink">
      <main className="flex min-h-screen flex-col items-center justify-center bg-mkt-ink/[0.02] px-4 py-12">
        <div className="w-full max-w-[400px]">
          <Link href="/" className="mx-auto mb-6 flex w-fit items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mkt-violet">
            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-mkt-line bg-mkt-surface">
              <Image src="/logo.png" alt="RactroTech logo" width={28} height={28} />
            </span>
            <span className="text-[15px] font-semibold">RactroTech</span>
            <span className="text-[13px] font-medium text-mkt-muted">Admin</span>
          </Link>

          <AdminCard>
            <div className="p-6 sm:p-8">
              <h1 className="font-display text-[22px] font-semibold leading-tight tracking-[-0.01em]">Sign in to the admin</h1>
              <p className="mt-1 text-[14px] leading-6 text-mkt-muted">
                Manage inquiries, clients, projects and website content.
              </p>

              <div className="mt-6">
                <AdminLoginForm errorMessage={errorMessage} />
              </div>

              {hasProviders ? (
                <>
                  <div className="my-6 flex items-center gap-3" role="separator">
                    <span className="h-px flex-1 bg-mkt-line" />
                    <span className="text-[12px] text-mkt-muted">Or continue with</span>
                    <span className="h-px flex-1 bg-mkt-line" />
                  </div>
                  <AdminProviderSigninBlock providers={oauthProviders} />
                </>
              ) : null}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-mkt-line px-6 py-4 text-[13px] sm:px-8">
              <Link href="/forgot-password" className="font-medium text-mkt-violet underline-offset-4 hover:underline">
                Forgot password?
              </Link>
              <Link href="/login" className="font-medium text-mkt-muted transition-colors hover:text-mkt-ink">
                User login
              </Link>
            </div>
          </AdminCard>
        </div>
      </main>
    </div>
  )
}
