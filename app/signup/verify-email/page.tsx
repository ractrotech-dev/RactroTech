import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { constructMetadata } from '@/lib/seo';
import VerifyEmailForm from '@/components/VerifyEmailForm';

export const metadata = constructMetadata({
  title: 'Verify Email',
  description: 'Confirm your RactroTech account email address.',
  noIndex: true,
});

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const email = searchParams.email ?? '';

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden border-b-4 border-black bg-yellow-400">
      <div className="relative w-full max-w-md px-4">
        <Card className="border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader className="space-y-2 border-b-4 border-black pb-4 text-center">
            <div className="flex justify-center py-2">
              <Image src="/logo.png" alt="RactroTech logo" width={48} height={48} />
            </div>
            <CardTitle className="text-2xl font-black tracking-wide">Check your email</CardTitle>
            <CardDescription className="text-sm font-semibold text-black/80">
              We sent a verification link{email ? ` to ${email}` : ''}. Click the link to activate
              your account before signing in.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <VerifyEmailForm email={email} />
          </CardContent>
          <CardFooter className="flex flex-col gap-2 border-t-4 border-black pt-4 text-center">
            <p className="text-xs font-semibold text-black/80">
              Already verified?{' '}
              <Link href="/login" className="font-black underline underline-offset-4">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
