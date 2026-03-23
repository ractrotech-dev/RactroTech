import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import SignupForm from "@/components/SignupForm";
import ProviderSigninBlock from "@/components/ProviderSigninBlock";

export default function Signup() {
  return (
    <div className="min-h-screen bg-yellow-400 border-b-4 border-black flex items-center justify-center relative overflow-hidden">
      {/* subtle retro pattern */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M0 0h2v2H0V0zm4 4h2v2H4V4zm4 4h2v2H8V8zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-4xl w-full px-4 md:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="relative h-12 w-12 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] flex items-center justify-center">
              <Image src="/logo.png" alt="RactroTech logo" width={40} height={40} />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-black/70">
                RactroTech
              </p>
              <p className="text-sm font-semibold text-black/80">Innovative Business Solutions</p>
            </div>
          </Link>

          <Link
            href="/login"
            className="px-4 py-2 border-4 border-black bg-black text-yellow-400 font-black uppercase tracking-widest text-xs hover:bg-black/90 transition-colors"
          >
            Login
          </Link>
        </div>

        <div className="grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-8 items-stretch">
          <div className="hidden md:flex flex-col justify-between border-4 border-black bg-black text-yellow-400 p-6 md:p-8 shadow-[-8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-300/80 mb-3">
                Create Account
              </p>
              <h1 className="text-3xl md:text-4xl font-black uppercase leading-[1.1] mb-4">
                Launch your next{" "}
                <span className="inline-block bg-yellow-400 text-black px-2 py-1 border-4 border-black">
                  big project
                </span>
              </h1>
              <p className="text-sm md:text-base font-semibold text-yellow-100/90 max-w-md">
                Sign up to access dashboards, subscriptions, and automation tools designed for fast-moving teams.
              </p>
            </div>
            <div className="mt-8 flex gap-8 border-t-4 border-yellow-400 pt-4">
              <div>
                <p className="text-2xl font-black leading-none">No code</p>
                <p className="text-xs font-bold uppercase tracking-wider mt-1">Required</p>
              </div>
              <div>
                <p className="text-2xl font-black leading-none">Minutes</p>
                <p className="text-xs font-bold uppercase tracking-wider mt-1">To get started</p>
              </div>
            </div>
          </div>

          <Card className="relative border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white">
            <CardHeader className="space-y-2 border-b-4 border-black pb-4">
              <CardTitle className="text-2xl font-black uppercase tracking-wide">
                Signup
              </CardTitle>
              <CardDescription className="text-sm font-semibold text-black/80">
                Create your RactroTech account in a few seconds and start experimenting.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4 pt-4">
              <SignupForm />

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-black" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em]">
                  <span className="bg-white px-3 text-black/80 font-bold">
                    Or continue with
                  </span>
                </div>
              </div>

              <ProviderSigninBlock />
            </CardContent>

            <CardFooter className="flex flex-col gap-2 border-t-4 border-black mt-2 pt-4 text-center">
              <p className="text-xs font-semibold text-black/80">
                Already have an account?{" "}
                <Link href="/login" className="font-black underline underline-offset-4">
                  Login
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}