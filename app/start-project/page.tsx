'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { useFormState, useFormStatus } from 'react-dom';

import { submitProjectEnquiry } from '@/app/actions/project';
import { SiteHeader } from '@/components/marketing/site-header';
import { SiteFooter } from '@/components/marketing/site-footer';
import { HeroGlow, Sparkle } from '@/components/marketing/mockups/doodles';
import { GlobalBackground } from '@/components/layout/global-background';

const initialState = {
  message: '',
  success: false,
};

const PROJECT_TYPES = [
  { value: 'fullstack', label: 'Full stack project' },
  { value: 'chatbot', label: 'AI & chatbot' },
  { value: 'cloud', label: 'Cloud services (AWS/Azure)' },
  { value: 'saas', label: 'SaaS platform' },
  { value: 'mobile', label: 'Mobile development' },
  { value: 'ecommerce', label: 'E-commerce store' },
  { value: 'automation', label: 'Internal automation' },
];

const REASSURANCE = [
  'Free estimate, no obligation',
  'Reply within one business day',
  'Fixed-scope quote after discovery',
];

const fieldClass =
  'w-full rounded-xl border border-mkt-line bg-mkt-surface px-4 py-3 text-[15px] text-mkt-ink placeholder:text-mkt-muted/60 transition-colors focus:border-mkt-violet focus:outline-none focus:ring-2 focus:ring-mkt-violet/20';

const labelClass = 'mb-2 block text-[14px] font-medium text-mkt-ink';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="mkt-btn-primary w-full !py-3.5">
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Sending…
        </>
      ) : (
        <>
          Send project request
          <ArrowRight className="h-4 w-4" />
        </>
      )}
    </button>
  );
}

/**
 * `searchParams` is passed by Next to page components, client ones included, so the
 * homepage email hand-off needs no `useSearchParams` Suspense boundary.
 */
export default function StartProject({
  searchParams,
}: {
  searchParams?: { email?: string | string[] };
}) {
  const [state, formAction] = useFormState(submitProjectEnquiry, initialState);
  const emailParam = Array.isArray(searchParams?.email)
    ? searchParams?.email[0]
    : searchParams?.email;

  return (
    <div className="relative isolate flex min-h-screen flex-col text-mkt-ink">
      <GlobalBackground tone="surface" />
      <SiteHeader tone="surface" />

      <main className="relative flex-1 overflow-hidden py-12 lg:py-16">
        <HeroGlow />
        <Sparkle className="absolute left-[8%] top-[14%] hidden h-5 w-5 text-mkt-violet/30 lg:block" />
        <Sparkle className="absolute right-[10%] top-[26%] hidden h-4 w-4 text-mkt-violet/25 lg:block" />

        <div className="mkt-shell relative max-w-2xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[14px] font-medium text-mkt-muted transition-colors hover:text-mkt-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>

          {state.success ? (
            <div className="mkt-reveal mt-8 rounded-3xl border border-mkt-line bg-mkt-surface p-8 text-center sm:p-12 text-mkt-ink">
              <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-mkt-mint text-mkt-success">
                <Check className="h-8 w-8" strokeWidth={2.5} aria-hidden />
              </span>
              <h1 className="mkt-display text-[28px] leading-[1.1] sm:text-[36px]">
                Thanks — we have your brief
              </h1>
              <p className="mx-auto mt-4 max-w-sm text-[16px] leading-relaxed text-mkt-muted">
                Your enquiry has been securely stored. Our team will review it and get in touch
                within one business day.
              </p>
              <Link href="/" className="mkt-btn-primary mt-8">
                Back to home
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <>
              <div className="mkt-reveal mt-8 text-center">
                <span className="mkt-eyebrow">
                  <span className="h-1.5 w-1.5 rounded-full bg-mkt-violet" />
                  Start a project
                </span>
                <h1 className="mkt-display mt-6 text-[32px] leading-[1.08] sm:text-[42px]">
                  Tell us what you want to build
                </h1>
                <p className="mx-auto mt-4 max-w-lg text-[17px] leading-relaxed text-mkt-muted">
                  Share the shape of it — we will come back with an approach, a timeline, and a
                  clear estimate.
                </p>

                <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                  {REASSURANCE.map((item) => (
                    <li key={item} className="flex items-center gap-1.5 text-[14px] text-mkt-muted">
                      <Check className="h-3.5 w-3.5 text-mkt-violet" strokeWidth={2.5} aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <form
                action={formAction}
                className="mkt-reveal mt-10 rounded-3xl border border-mkt-line bg-mkt-surface p-6 sm:p-8 text-mkt-ink"
                style={{ animationDelay: '0.1s' }}
              >
                {state?.message && !state.success ? (
                  <p
                    role="alert"
                    className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-[14px] font-medium text-red-700"
                  >
                    {state.message}
                  </p>
                ) : null}

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className={labelClass}>
                      Full name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      className={fieldClass}
                      placeholder="Jane Cooper"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className={labelClass}>
                      Phone <span className="font-normal text-mkt-muted">(optional)</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      className={fieldClass}
                      placeholder="+44 7700 900000"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className={labelClass}>
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      defaultValue={emailParam}
                      className={fieldClass}
                      placeholder="you@company.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="projectType" className={labelClass}>
                      Project type
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      required
                      defaultValue=""
                      className={`${fieldClass} cursor-pointer`}
                    >
                      <option value="" disabled>
                        Select a service…
                      </option>
                      {PROJECT_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-5">
                  <label htmlFor="description" className={labelClass}>
                    What are you building?
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    required
                    className={`${fieldClass} resize-y`}
                    placeholder="A rough description is fine — what it does, who it is for, and any deadline you have in mind."
                  />
                </div>

                <div className="mt-6">
                  <SubmitButton />
                </div>

                <p className="mt-4 text-center text-[13px] text-mkt-muted">
                  Prefer email? Write to{' '}
                  <a
                    href="mailto:hello@ractrotech.com"
                    className="font-medium text-mkt-violet underline-offset-4 hover:underline"
                  >
                    hello@ractrotech.com
                  </a>
                </p>
              </form>
            </>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
