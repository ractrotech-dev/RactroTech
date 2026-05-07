import Link from 'next/link';
import { X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signInWithGoogle } from '@/app/auth/actions';
import LoginForm from '@/components/LoginForm';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: "Login",
  description: "Sign in to your Ractrotech account to access powerful web development tools and templates.",
  canonicalUrl: "https://ractrotech.com/login",
});
export default function Login({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 font-sans text-gray-900">
      <div className="relative w-full max-w-[420px] rounded-xl bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <Link
          href="/"
          className="absolute right-5 top-5 text-gray-400 transition-colors hover:text-gray-700"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </Link>

        <div className="mt-4 flex flex-col items-center space-y-6">
          {searchParams?.error && (
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>{searchParams.error}</span>
            </div>
          )}

          <form action={signInWithGoogle} className="w-full">
            <Button
              variant="outline"
              type="submit"
              className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-black focus:ring-offset-1"
            >
              <img
                src="https://img.icons8.com/color/48/google-logo.png"
                alt="Google"
                className="h-5 w-5"
              />
              Continue with Google
            </Button>
          </form>

          <div className="relative flex w-full items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative bg-white px-4 text-sm text-gray-500">or</div>
          </div>

          <div className="w-full">
            <LoginForm />
          </div>

          <div className="mt-4 flex flex-col items-center gap-4 text-sm font-medium">
            <Link
              href="#"
              className="text-[#0066cc] transition-colors hover:text-[#0055bb] hover:underline"
            >
              Use single sign-on
            </Link>
            <Link
              href="/forgot-password"
              className="text-[#0066cc] transition-colors hover:text-[#0055bb] hover:underline"
            >
              Reset password
            </Link>
            <div className="mt-2 text-gray-500">
              No account?{' '}
              <Link
                href="/signup"
                className="font-semibold text-[#0066cc] transition-colors hover:text-[#0055bb] hover:underline"
              >
                Create one
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
