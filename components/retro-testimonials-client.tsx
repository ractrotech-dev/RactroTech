'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

import { FadeInView, StaggerContainer, staggerItemVariants } from '@/components/fade-in-view';

export type TestimonialItem = {
  id: string;
  text: string;
  author: string;
  company: string;
  rating?: number;
  imageUrl?: string | null;
};

type Props = {
  items: TestimonialItem[];
  fromDatabase: boolean;
  googleReviewUrl?: string | null;
};

export function RetroTestimonialsClient({ items, fromDatabase, googleReviewUrl }: Props) {
  return (
    <section className="border-b-4 border-black bg-yellow-400 py-16">
      <FadeInView>
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="retro-heading mb-12 text-center text-5xl">What Our Clients Say About Us ! 💬</h2>

          <StaggerContainer className="grid gap-6 md:grid-cols-3">
            {items.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                variants={staggerItemVariants}
                whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 22 } }}
                className="group border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              >
                {fromDatabase && testimonial.rating ? (
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex gap-0.5" aria-label={`${testimonial.rating} of 5 stars`}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < (testimonial.rating ?? 0) ? 'fill-yellow-400 text-black' : 'fill-black/5 text-black/25'}`}
                        />
                      ))}
                    </span>
                  </div>
                ) : null}
                {fromDatabase && testimonial.imageUrl ? (
                  <div className="mb-4 flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={testimonial.imageUrl}
                      alt=""
                      className="h-14 w-14 rounded-full border-2 border-black object-cover"
                    />
                  </div>
                ) : null}
                <div className="mb-4 text-4xl font-black">&quot;</div>
                <p className="mb-4 text-lg font-semibold">{testimonial.text}</p>
                <div className="border-t-4 border-black pt-4">
                  <p className="font-black">{testimonial.author}</p>
                  <p className="text-sm font-bold">{testimonial.company}</p>
                </div>
              </motion.div>
            ))}
          </StaggerContainer>

          {(fromDatabase || googleReviewUrl) ? (
            <p className="mt-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[10px] font-bold tracking-widest text-black/40">
              {fromDatabase ? (
                <a href="/review" className="underline decoration-2 underline-offset-4 hover:text-black">
                  Leave a review
                </a>
              ) : null}
              {fromDatabase && googleReviewUrl ? <span aria-hidden className="hidden sm:inline">·</span> : null}
              {googleReviewUrl ? (
                <a
                  href={googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-2 underline-offset-4 hover:text-black"
                >
                  Rate on Google
                </a>
              ) : null}
            </p>
          ) : null}
        </div>
      </FadeInView>
    </section>
  );
}
