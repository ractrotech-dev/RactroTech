
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ForgotPasswordForm from '@/components/ForgotPasswordForm'
import { constructMetadata, sitePath } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Forgot Password',
  description: 'Reset your Ractrotech account password.',
  canonicalUrl: sitePath('/forgot-password'),
  noIndex: true,
});

export default function ForgotPassword({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
    const errorMessage =
      searchParams.error === 'expired_link'
        ? 'Your reset link has expired. Please request a new one.'
        : searchParams.error === 'missing_code'
          ? 'Invalid reset link. Please request a new password reset.'
          : null;

    return (
        <div className="flex items-center justify-center bg-muted min-h-screen" >
            <Card className="w-[350px] mx-auto">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center py-4">
                        <Image src="/logo.png" alt="logo" width={50} height={50} />
                    </div>

                    <CardTitle className="text-2xl font-bold">Forgot Your Password?</CardTitle>
                    <CardDescription>Enter your email address</CardDescription>
                    {errorMessage && (
                      <p className="text-sm text-red-600 pt-2">{errorMessage}</p>
                    )}
                </CardHeader>
                <CardContent className="grid gap-4">
                    <ForgotPasswordForm />
                </CardContent>
                <CardFooter className="flex-col text-center">
                    <Link className="w-full text-sm text-muted-foreground " href="/signup">
                        Back to signup
                    </Link>
                    <Link className="w-full text-sm text-muted-foreground" href="/signup">
                        Don&apos;t have an account? Signup
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}