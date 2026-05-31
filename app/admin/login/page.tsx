import Link from 'next/link'
import Image from 'next/image'

import AdminLoginForm from '@/components/admin/AdminLoginForm'
import AdminProviderSigninBlock from '@/components/admin/AdminProviderSigninBlock'
import { constructMetadata } from '@/lib/seo'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const metadata = constructMetadata({
  title: 'Admin Login',
  description: 'Sign in to the RactroTech admin dashboard.',
  canonicalUrl: 'https://ractrotech.com/admin/login',
})

type AdminLoginPageProps = {
  searchParams: { error?: string }
}

export default function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden border-b-4 border-black bg-yellow-400">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M0 0h2v2H0V0zm4 4h2v2H4V4zm4 4h2v2H8V8zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative w-full max-w-4xl px-4 md:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)]">
              <Image src="/logo.png" alt="RactroTech logo" width={40} height={40} />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-black tracking-[0.3em] text-black/70">RactroTech</p>
              <p className="text-sm font-semibold text-black/80">Admin dashboard</p>
            </div>
          </Link>

          <Link
            href="/login"
            className="border-4 border-black bg-black px-4 py-2 text-xs font-black tracking-widest text-yellow-400 transition-colors hover:bg-black/90"
          >
            User login
          </Link>
        </div>

        <div className="grid items-stretch gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="hidden flex-col justify-between border-4 border-black bg-black p-6 text-yellow-400 shadow-[-8px_8px_0px_0px_rgba(0,0,0,1)] md:flex md:p-8">
            <div>
              <p className="mb-3 text-xs font-black tracking-[0.3em] text-yellow-300/80">Welcome</p>
              <h1 className="mb-4 text-3xl font-black leading-[1.1] md:text-4xl">
                Admin access
                <span className="inline-block border-4 border-black bg-yellow-400 px-2 py-1 text-black"> secured</span>
              </h1>
              <p className="max-w-md text-sm font-semibold text-yellow-100/90 md:text-base">
                Log in to manage inquiries, clients, projects, and website content.
              </p>
            </div>
            <div className="mt-8 flex gap-8 border-t-4 border-yellow-400 pt-4">
              <div>
                <p className="text-2xl font-black leading-none">RBAC</p>
                <p className="mt-1 text-xs font-bold tracking-wider">Role access</p>
              </div>
              <div>
                <p className="text-2xl font-black leading-none">Secure</p>
                <p className="mt-1 text-xs font-bold tracking-wider">Session protected</p>
              </div>
            </div>
          </div>

          <Card className="relative border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="space-y-2 border-b-4 border-black pb-4">
              <CardTitle className="text-2xl font-black tracking-wide">Admin Login</CardTitle>
              <CardDescription className="text-sm font-semibold text-black/80">
                Sign in to access the admin dashboard.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4 pt-4">
              <AdminLoginForm errorMessage={errorMessage} />

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-black" />
                </div>
                <div className="relative flex justify-center text-[10px] tracking-[0.2em]">
                  <span className="bg-white px-3 font-bold text-black/80">Or continue with</span>
                </div>
              </div>

              <AdminProviderSigninBlock />
            </CardContent>

            <CardFooter className="mt-2 flex flex-col gap-2 border-t-4 border-black pt-4 text-center">
              <p className="text-xs font-semibold text-black/80">
                <Link href="/forgot-password" className="font-black underline underline-offset-4">
                  Forgot password?
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

