'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

import { Reveal } from '@/components/marketing/reveal';
import { Sparkle } from '@/components/marketing/mockups/doodles';
import { JOURNEY_BAND } from '@/lib/marketing/home-content';

/**
 * Email hand-off band. The address is passed through to /start-project, which prefills
 * its existing `email` field from searchParams — no separate submission endpoint.
 */
export function JourneyBand() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    router.push(trimmed ? `/start-project?email=${encodeURIComponent(trimmed)}` : '/start-project');
  };

  return (
    <section className="py-6">
      <div className="mkt-shell">
        <Reveal className="relative overflow-hidden rounded-[32px] bg-mkt-violet-deep px-6 py-16 text-center sm:px-12 sm:py-20">
          {/* Depth wash + grain-free highlight */}
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              background:
                'radial-gradient(70% 90% at 50% 0%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%)',
            }}
          />
          <Sparkle className="absolute left-[8%] top-[18%] hidden h-6 w-6 text-white/25 sm:block" />
          <Sparkle className="absolute right-[10%] bottom-[22%] hidden h-4 w-4 text-white/20 sm:block" />

          <div className="relative">
            <h2 className="font-display text-[38px] font-black uppercase leading-[0.95] tracking-[-0.02em] text-white sm:text-[62px] lg:text-[78px]">
              {JOURNEY_BAND.headline}
              <br />
              <span className="text-white/60">{JOURNEY_BAND.headlineAccent}</span>
            </h2>

            <p className="mx-auto mt-6 max-w-md text-[16px] text-white/60">{JOURNEY_BAND.body}</p>

            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 flex w-full max-w-md flex-col gap-2.5 sm:flex-row"
            >
              <label htmlFor="journey-email" className="sr-only">
                Your email address
              </label>
              <input
                id="journey-email"
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={JOURNEY_BAND.placeholder}
                className="h-12 flex-1 rounded-full border border-white/20 bg-white/10 px-5 text-[15px] text-white placeholder:text-white/45 focus:border-white/45 focus:bg-white/15 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-mkt-violet-deep transition-colors hover:bg-white/90"
              >
                {JOURNEY_BAND.submitLabel}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
