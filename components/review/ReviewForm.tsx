'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Loader2, Send } from 'lucide-react';
import { useState, useTransition, type FormEvent } from 'react';

import { submitReview } from '@/app/review/actions';
import { REVIEW_PROJECT_TYPES } from '@/lib/reviews/constants';
import { StarRatingInput } from '@/components/review/StarRatingInput';
import { authFieldClass, authLabelClass } from '@/components/marketing/auth-shell';

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
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-mkt-mint text-mkt-success">
            <Send className="h-10 w-10 text-black" />
          </div>
          <h2 className="mkt-display mb-3 text-[24px]">Thank you!</h2>
          <p className="mx-auto mb-8 max-w-sm text-sm font-bold leading-relaxed text-black/60">
            Your review has been submitted. Our team may publish it on the site after a quick check.
          </p>
          <Link
            href="/"
            className="mkt-btn-primary"
          >
            RETURN TO HQ
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Link>
          {googleReviewUrl ? (
            <a
              href={googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center gap-2 text-[14px] font-medium text-mkt-violet underline-offset-4 hover:underline"
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
            <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-[14px] font-medium text-red-700">
              {error}
            </p>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="fullName"
                className={authLabelClass}
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
                className={authFieldClass}
                placeholder="YOUR NAME..."
              />
            </div>
            <div>
              <label
                htmlFor="companyName"
                className={authLabelClass}
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
                className={authFieldClass}
                placeholder="COMPANY..."
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="projectType"
              className={authLabelClass}
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

          <div>
            <span className={authLabelClass}>
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

          <div>
            <label
              htmlFor="reviewText"
              className={authLabelClass}
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
              className={authFieldClass}
              placeholder="WHAT STOOD OUT ABOUT WORKING WITH US?"
            />
          </div>

          <div>
            <label
              htmlFor="image"
              className={authLabelClass}
            >
              06. LOGO OR PHOTO <span className="font-bold opacity-50">(OPTIONAL)</span>
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="w-full cursor-pointer text-[14px] text-mkt-muted file:mr-3 file:rounded-full file:border-0 file:bg-mkt-lavender file:px-4 file:py-2 file:text-[13px] file:font-medium file:text-mkt-violet"
            />
            <p className="mt-1 text-[9px] font-bold tracking-wide text-black/35">
              JPG, PNG, WEBP, GIF · MAX 2MB
            </p>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-mkt-line bg-mkt-surface p-4 transition-colors hover:border-mkt-violet/40 text-mkt-ink">
            <input
              type="checkbox"
              name="permission"
              required
              className="mt-0.5 h-4 w-4 shrink-0 accent-mkt-violet"
            />
            <span className="text-[11px] font-bold leading-snug text-black/70">
              I AGREE THAT RACTROTECH MAY DISPLAY MY FEEDBACK, NAME, AND COMPANY ON THIS WEBSITE AS A
              TESTIMONIAL.
            </span>
          </label>

          <button
            type="submit"
            disabled={pending}
            className={`mkt-btn-primary w-full !py-3.5 ${
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
            
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
