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
              LET&apos;S{' '}
              <span className="text-yellow-400 underline decoration-4 underline-offset-8 md:decoration-8">
                BUILD
              </span>{' '}
              IT
            </h2>

            <p className="mb-10 max-w-xl text-base font-medium leading-relaxed text-gray-400 md:text-lg">
              Ready to ship your next big idea? Partner with experienced developers who care about
              your product as much as you do.
            </p>

            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <Link
                href="/start-project"
                className="retro-button group flex items-center gap-2 !px-8 !py-4 text-lg"
              >
                START YOUR PROJECT
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <p className="mt-12 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
              No fluff. No delays. Just high-quality code.
            </p>
          </div>
        </div>
      </FadeInView>
    </section>
  );
}
