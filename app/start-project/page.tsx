'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useFormState, useFormStatus } from 'react-dom';
import { submitProjectEnquiry } from '@/app/actions/project';
import { useEffect } from 'react';

const initialState = {
  message: '',
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
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
          SUBMIT PROJECT REQUEST
          <Send className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
        </>
      )}
    </button>
  );
}

export default function StartProject() {
  const [state, formAction] = useFormState(submitProjectEnquiry, initialState);

  // Success feedback handled via conditional rendering in JSX below

  return (
    <div className="relative min-h-screen overflow-hidden bg-yellow-400 font-sans text-black selection:bg-black selection:text-yellow-400">
      {/* Background patterns */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M0 0h2v2H0V0zm4 4h2v2H4V4zm4 4h2v2H8V8zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="retro-card relative z-10 w-full max-w-xl border-4 bg-white p-6 md:p-8"
        >
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-50 hover:underline"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Home
          </Link>

          <div className="mb-6">
            <h1 className="retro-heading mb-1 text-2xl md:text-3xl">
              {state.success ? 'ENQUIRY SENT!' : 'START A PROJECT'}
            </h1>
            <p className="text-xs font-bold leading-relaxed text-black/50">
              {state.success
                ? 'MISSION CONTROL HAS RECEIVED YOUR MESSAGE.'
                : "Tell us your vision. We'll get back to you within 24 hours."}
            </p>
          </div>

          {state.success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center"
            >
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-black bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Send className="h-10 w-10 text-black" />
              </div>
              <h2 className="mb-4 text-xl font-black uppercase tracking-tight">THANK YOU!</h2>
              <p className="mx-auto mb-8 max-w-xs text-sm font-bold leading-relaxed opacity-60">
                Your enquiry has been securely stored. Our team will review your criteria and get in
                touch within the next 24 hours.
              </p>
              <Link
                href="/"
                className="retro-button inline-flex items-center gap-2 border-black bg-black !px-8 !py-3 text-sm font-black text-yellow-400"
              >
                RETURN TO HQ
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </motion.div>
          ) : (
            <form action={formAction} className="space-y-3">
              {state?.message && !state.success && (
                <p className="mb-4 block text-center text-xs font-bold uppercase tracking-widest text-red-500">
                  {state.message}
                </p>
              )}
              <div className="grid gap-3 md:grid-cols-2">
                <div className="retro-card border-2 bg-white p-2 transition-colors hover:bg-yellow-50">
                  <label
                    htmlFor="name"
                    className="mb-1 block text-[8px] font-black uppercase tracking-widest text-black/40"
                  >
                    01. FULL NAME
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full border-b-2 border-black/10 bg-transparent py-0.5 text-sm font-bold text-black outline-none focus:border-black"
                    placeholder="NAME..."
                  />
                </div>

                <div className="retro-card border-2 bg-white p-2 transition-colors hover:bg-yellow-50">
                  <label
                    htmlFor="phone"
                    className="mb-1 block text-[8px] font-black uppercase tracking-widest text-black/40"
                  >
                    02. PHONE NUMBER
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="w-full border-b-2 border-black/10 bg-transparent py-0.5 text-sm font-bold text-black outline-none focus:border-black"
                    placeholder="NUMBER..."
                  />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="retro-card border-2 bg-white p-2 transition-colors hover:bg-yellow-50">
                  <label
                    htmlFor="email"
                    className="mb-1 block text-[8px] font-black uppercase tracking-widest text-black/40"
                  >
                    03. EMAIL <span className="opacity-50">(OPTIONAL)</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="w-full border-b-2 border-black/10 bg-transparent py-0.5 text-sm font-bold text-black outline-none focus:border-black"
                    placeholder="EMAIL@COMPANY.COM"
                  />
                </div>

                <div className="retro-card border-2 bg-white p-2 transition-colors hover:bg-yellow-50">
                  <label
                    htmlFor="projectType"
                    className="mb-1 block text-[8px] font-black uppercase tracking-widest text-black/40"
                  >
                    04. PROJECT TYPE
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    required
                    className="w-full cursor-pointer appearance-none border-b-2 border-black/10 bg-transparent py-0.5 text-sm font-bold text-black outline-none focus:border-black"
                  >
                    <option value="">SELECT SERVICE...</option>
                    <option value="fullstack">FULL STACK PROJECT</option>
                    <option value="chatbot">AI & CHAT BOT</option>
                    <option value="cloud">CLOUD SERVICES (AWS/AZURE)</option>
                    <option value="saas">SAAS PLATFORMS</option>
                    <option value="mobile">MOBILE DEVELOPMENT</option>
                    <option value="ecommerce">E-COMMERCE STORES</option>
                    <option value="automation">INTERNAL AUTOMATION</option>
                  </select>
                </div>
              </div>

              <div className="retro-card border-2 bg-white p-2 transition-colors hover:bg-yellow-50">
                <label
                  htmlFor="description"
                  className="mb-1 block text-[8px] font-black uppercase tracking-widest text-black/40"
                >
                  05. PROJECT CRITERIA / DESCRIPTION
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  required
                  className="w-full resize-none border-b-2 border-black/10 bg-transparent py-1 text-sm font-bold text-black outline-none focus:border-black"
                  placeholder="DESCRIBE YOUR VISION..."
                />
              </div>

              <SubmitButton />
            </form>
          )}

          {/* Compact brand footer */}
          <div className="mt-6 border-t border-black/5 pt-4 text-center">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">
              RACTROTECH
            </h2>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
