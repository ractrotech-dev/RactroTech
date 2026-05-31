'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Loader2, Send } from 'lucide-react';
import { useState, useTransition, type FormEvent } from 'react';

import { submitReview } from '@/app/review/actions';
import { REVIEW_PROJECT_TYPES } from '@/lib/reviews/constants';
import { StarRatingInput } from '@/components/review/StarRatingInput';

type ReviewFormProps = {
  googleReviewUrl?: string | null;
};

export function ReviewForm({ googleReviewUrl }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();
  const [ratingTouched, setRatingTouched] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (rating < 1 || rating > 5) {
      setRatingTouched(true);
      setError('Please select a star rating.');
      return;
    }
    const formData = new FormData(e.currentTarget);
    formData.set('rating', String(rating));
    startTransition(async () => {
      const res = await submitReview(formData);
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <AnimatePresence mode="wait">
      {success ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          className="py-8 text-center sm:py-10"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-black bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Send className="h-10 w-10 text-black" />
          </div>
          <h2 className="retro-heading mb-3 text-xl">THANK YOU!</h2>
          <p className="mx-auto mb-8 max-w-sm text-sm font-bold leading-relaxed text-black/60">
            Your review has been submitted. Our team may publish it on the site after a quick check.
          </p>
          <Link
            href="/"
            className="retro-button inline-flex items-center gap-2 border-black bg-black !px-8 !py-3 text-sm font-black text-yellow-400"
          >
            RETURN TO HQ
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Link>
          {googleReviewUrl ? (
            <a
              href={googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center gap-2 text-[10px] font-black tracking-widest text-black/50 underline decoration-2 underline-offset-4 hover:text-black"
            >
              Also rate us on Google
              <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          ) : null}
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-3"
        >
          {error ? (
            <p className="border-2 border-red-500 bg-red-50 px-3 py-2 text-center text-[10px] font-black tracking-widest text-red-600">
              {error}
            </p>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="retro-card border-2 bg-white p-2 transition-colors hover:bg-yellow-50">
              <label
                htmlFor="fullName"
                className="mb-1 block text-[8px] font-black tracking-widest text-black/40"
              >
                01. FULL NAME
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                minLength={2}
                maxLength={120}
                autoComplete="name"
                className="w-full border-b-2 border-black/10 bg-transparent py-0.5 text-sm font-bold text-black outline-none focus:border-black"
                placeholder="YOUR NAME..."
              />
            </div>
            <div className="retro-card border-2 bg-white p-2 transition-colors hover:bg-yellow-50">
              <label
                htmlFor="companyName"
                className="mb-1 block text-[8px] font-black tracking-widest text-black/40"
              >
                02. COMPANY / BRAND
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                required
                maxLength={160}
                autoComplete="organization"
                className="w-full border-b-2 border-black/10 bg-transparent py-0.5 text-sm font-bold text-black outline-none focus:border-black"
                placeholder="COMPANY..."
              />
            </div>
          </div>

          <div className="retro-card border-2 bg-white p-2 transition-colors hover:bg-yellow-50">
            <label
              htmlFor="projectType"
              className="mb-1 block text-[8px] font-black tracking-widest text-black/40"
            >
              03. PROJECT TYPE
            </label>
            <select
              id="projectType"
              name="projectType"
              required
              className="w-full cursor-pointer appearance-none border-b-2 border-black/10 bg-transparent py-0.5 text-sm font-bold text-black outline-none focus:border-black"
              defaultValue=""
            >
              <option value="" disabled>
                SELECT SERVICE...
              </option>
              {REVIEW_PROJECT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="retro-card border-2 bg-white p-2 transition-colors hover:bg-yellow-50">
            <span className="mb-2 block text-[8px] font-black tracking-widest text-black/40">
              04. RATING
            </span>
            <StarRatingInput
              value={rating}
              onChange={(n) => {
                setRating(n);
                setRatingTouched(true);
                setError(null);
              }}
              disabled={pending}
              error={ratingTouched && rating < 1}
            />
          </div>

          <div className="retro-card border-2 bg-white p-2 transition-colors hover:bg-yellow-50">
            <label
              htmlFor="reviewText"
              className="mb-1 block text-[8px] font-black tracking-widest text-black/40"
            >
              05. YOUR REVIEW
            </label>
            <textarea
              id="reviewText"
              name="reviewText"
              required
              minLength={20}
              maxLength={4000}
              rows={5}
              className="w-full resize-none border-b-2 border-black/10 bg-transparent py-1 text-sm font-bold text-black outline-none focus:border-black"
              placeholder="WHAT STOOD OUT ABOUT WORKING WITH US?"
            />
          </div>

          <div className="retro-card border-2 bg-white p-2 transition-colors hover:bg-yellow-50">
            <label
              htmlFor="image"
              className="mb-1 block text-[8px] font-black tracking-widest text-black/40"
            >
              06. LOGO OR PHOTO <span className="font-bold opacity-50">(OPTIONAL)</span>
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="w-full cursor-pointer text-xs font-bold file:mr-3 file:border-2 file:border-black file:bg-yellow-400 file:px-3 file:py-1.5 file:text-[10px] file:font-black file:uppercase"
            />
            <p className="mt-1 text-[9px] font-bold tracking-wide text-black/35">
              JPG, PNG, WEBP, GIF · MAX 2MB
            </p>
          </div>

          <label className="retro-card flex cursor-pointer items-start gap-3 border-2 bg-white p-3 transition-colors hover:bg-yellow-50">
            <input
              type="checkbox"
              name="permission"
              required
              className="mt-0.5 h-4 w-4 shrink-0 border-2 border-black accent-yellow-400"
            />
            <span className="text-[11px] font-bold leading-snug text-black/70">
              I AGREE THAT RACTROTECH MAY DISPLAY MY FEEDBACK, NAME, AND COMPANY ON THIS WEBSITE AS A
              TESTIMONIAL.
            </span>
          </label>

          <button
            type="submit"
            disabled={pending}
            className={`retro-button group flex w-full items-center justify-center gap-3 border-black bg-black !py-3 text-base text-yellow-400 transition-opacity ${
              pending ? 'opacity-70' : ''
            }`}
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                SUBMITTING...
              </>
            ) : (
              <>
                SUBMIT REVIEW
                <Send className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </>
            )}
          </button>

          <div className="border-t border-black/5 pt-4 text-center">
            <p className="text-[10px] font-black tracking-[0.3em] text-black/25">RACTROTECH</p>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
