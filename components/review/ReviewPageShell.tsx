'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';

import { ReviewForm } from '@/components/review/ReviewForm';
import { RetroFooter } from '@/components/retro-footer';
import { RetroHeader } from '@/components/retro-header';

const gridPattern = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M0 0h2v2H0V0zm4 4h2v2H4V4zm4 4h2v2H8V8zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2z'/%3E%3C/g%3E%3C/svg%3E")`,
};

type ReviewPageShellProps = {
  googleReviewUrl: string | null;
};

export function ReviewPageShell({ googleReviewUrl }: ReviewPageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-black">
      <RetroHeader />

      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-yellow-400 py-10 selection:bg-black selection:text-yellow-400 sm:py-14">
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={gridPattern} />

        <div className="relative z-10 flex w-full max-w-xl flex-col gap-4 px-4 sm:px-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="retro-card border-4 bg-white p-6 md:p-8"
          >
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-2 text-[10px] font-black tracking-widest text-black/50 hover:underline"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to Home
            </Link>

            <div className="mb-6">
              <h1 className="retro-heading mb-1 text-2xl md:text-3xl">CLIENT REVIEW</h1>
              <p className="text-xs font-bold leading-relaxed text-black/50">
                Your feedback helps us improve. Submissions are reviewed before they appear on the site.
              </p>
            </div>

            <ReviewForm googleReviewUrl={googleReviewUrl} />
          </motion.div>

          {googleReviewUrl ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="retro-card border-4 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <p className="text-[10px] font-black tracking-[0.25em] text-black/40">Google</p>
              <p className="mt-2 text-sm font-black tracking-tight text-black">Prefer Google?</p>
              <p className="mt-2 text-xs font-bold leading-relaxed text-black/55">
                Leave a public star rating on our Google Business profile (opens in a new tab). You can do this
                with or without the form above.
              </p>
              <a
                href={googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="retro-button mt-4 inline-flex w-full items-center justify-center gap-2 border-black bg-white !py-3 text-xs font-black text-black hover:bg-yellow-50"
              >
                OPEN GOOGLE REVIEW PAGE
                <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
              </a>
            </motion.div>
          ) : null}
        </div>
      </div>

      <RetroFooter />
    </div>
  );
}
