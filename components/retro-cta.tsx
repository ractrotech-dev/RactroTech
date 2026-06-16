'use client';

import Link from 'next/link';
import { FadeInView } from '@/components/fade-in-view';
import { ArrowRight } from 'lucide-react';

export function RetroCTA() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden border-b-8 border-black bg-black py-24 lg:py-32"
    >
      {/* Background patterns */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <FadeInView y={40}>
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center text-center">
            <h2 className="retro-heading mb-6 text-4xl text-white sm:text-5xl md:text-6xl">
              GOT AN IDEA?{' '}
              <span className="text-yellow-400 underline decoration-4 underline-offset-8 md:decoration-8">
                LET&apos;S TALK
              </span>
            </h2>

            <p className="mb-10 max-w-xl text-base font-medium leading-relaxed text-gray-400 md:text-lg">
              Tell us what you want to build — website, app, store, SaaS, or something in between.
              We will help you figure out the right path and send a clear estimate within 24 hours.
            </p>

            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <Link
                href="/start-project"
                className="retro-button group flex items-center gap-2 !px-8 !py-4 text-lg"
              >
                SHARE YOUR IDEA
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="retro-button flex items-center gap-2 !border-white !bg-white !px-8 !py-4 text-lg !text-black hover:!bg-yellow-400"
              >
                CONTACT US
              </Link>
            </div>

            <p className="mt-12 text-xs font-bold tracking-[0.2em] text-gray-500">
              FREE ESTIMATE · NO PRESSURE · ONE BUSINESS DAY RESPONSE
            </p>
          </div>
        </div>
      </FadeInView>
    </section>
  );
}
