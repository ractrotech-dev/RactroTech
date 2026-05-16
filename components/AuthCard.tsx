 "use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";
import ProviderSigninBlock from "@/components/ProviderSigninBlock";
import { motion } from "framer-motion";

type AuthMode = "login" | "signup";

type AuthCardProps = {
  mode: AuthMode;
};

export default function AuthCard({ mode }: AuthCardProps) {
  const isLogin = mode === "login";

  return (
    <div className="relative min-h-screen overflow-hidden bg-yellow-400 font-sans text-black selection:bg-black selection:text-yellow-400">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M0 0h2v2H0V0zm4 4h2v2H4V4zm4 4h2v2H8V8zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2z'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative flex min-h-screen items-center justify-center p-3">
        <div className="retro-card relative z-10 w-full max-w-2xl border-4 bg-zinc-100 p-4 md:p-6">
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-50 hover:underline"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Home
          </Link>

          <div className="mb-4">
            <h1 className="retro-heading mb-1 text-xl md:text-3xl">
              {isLogin ? "LOGIN" : "SIGN UP"}
            </h1>
            <p className="text-[11px] font-bold leading-relaxed text-black/50">
              {isLogin
                ? "Access your account with email/password or social provider."
                : "Create your account and get started quickly."}
            </p>
          </div>

          <div className="relative mb-4 grid grid-cols-2 rounded-none border-2 border-black bg-white p-1">
            <motion.span
              layout
              transition={{ type: "spring", stiffness: 360, damping: 32, mass: 0.7 }}
              className={`absolute bottom-1 top-1 w-[calc(50%-0.25rem)] bg-black ${
                isLogin ? "translate-x-0" : "translate-x-full"
              }`}
            />
            <Link
              href="/login"
              className={`relative z-10 px-3 py-1.5 text-center text-[11px] font-black uppercase tracking-wide transition-colors ${
                isLogin ? "text-yellow-400" : "text-black"
              }`}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className={`relative z-10 px-3 py-1.5 text-center text-[11px] font-black uppercase tracking-wide transition-colors ${
                isLogin ? "text-black" : "text-yellow-400"
              }`}
            >
              Signup
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            className="retro-card border-2 bg-[#efefef] p-3 md:p-4"
          >
            {isLogin ? <LoginForm /> : <SignupForm />}

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-black/20" />
              </div>
              <div className="relative flex justify-center text-[9px] uppercase tracking-[0.15em]">
                <span className="bg-white px-3 text-black/70 font-bold">Continue with</span>
              </div>
            </div>

            <ProviderSigninBlock />
          </motion.div>

          <div className="mt-4 border-t border-black/10 pt-3 text-center">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">RACTROTECH</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
