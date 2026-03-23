'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiSupabase,
  SiStripe,
} from 'react-icons/si';

// const stats = [
//   { value: "50+", label: "Projects" },
//   { value: "30+", label: "Clients" },
//   { value: "15+", label: "Years" },
// ];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const badge = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 200, damping: 20 },
  },
};

export function RetroHero() {
  return (
    <section id="home" className="relative overflow-hidden border-b-4 border-black bg-yellow-400">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M0 0h2v2H0V0zm4 4h2v2H4V4zm4 4h2v2H8V8zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28 lg:py-36">
        <motion.div className="max-w-3xl" variants={container} initial="hidden" animate="show">
          <motion.p
            className="mb-4 text-sm font-black uppercase tracking-[0.3em] text-black/70"
            variants={item}
          >
            Digital Agency
          </motion.p>
          <motion.h1
            className="mb-4 text-3xl font-black uppercase leading-[1.05] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
            variants={item}
          >
            We build{' '}
            <motion.span
              className="inline-block border-4 border-black bg-black px-3 py-1 text-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
              variants={badge}
            >
              amazing
            </motion.span>{' '}
            digital products
          </motion.h1>
          <motion.p
            className="mb-10 max-w-xl text-lg font-semibold leading-relaxed text-black/90 md:text-xl"
            variants={item}
          >
            Websites, apps, and SaaS — built by experienced professionals who actually ship.
          </motion.p>

          <motion.div className="mb-14 flex flex-wrap gap-4" variants={item}>
            <Link
              href="/start-project"
              className="retro-button border-black bg-black text-yellow-400 hover:bg-black/90"
            >
              Start a project
            </Link>
            <a
              href="#about"
              className="border-4 border-black bg-transparent px-6 py-3 font-black uppercase tracking-widest transition-colors hover:bg-black hover:text-yellow-400"
            >
              Learn more
            </a>
          </motion.div>

          <motion.div
            className="mt-12 flex flex-col gap-10 border-t-4 border-black pt-12"
            variants={item}
          >
            <p className="text-center text-xs font-black uppercase tracking-[0.3em] text-black/40">
              TRUSTED BY MODERN TEAMS WORLDWIDE
            </p>

            <div className="relative w-full overflow-hidden whitespace-nowrap">
              {/* Fade masks for smooth edges */}
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-yellow-400 to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-yellow-400 to-transparent" />

              <motion.div
                className="flex w-fit gap-16 py-2"
                initial={{ x: 0 }}
                animate={{ x: '-33.33%' }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                  repeatType: 'loop',
                }}
              >
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-16">
                    <div className="flex items-center gap-3">
                      <SiNextdotjs className="text-4xl" />
                      <span className="text-xl font-black tracking-tight">NEXT.JS</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <SiReact className="text-4xl text-[#000000]" />
                      <span className="text-xl font-black tracking-tight">REACT</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <SiTypescript className="text-4xl text-[#000000]" />
                      <span className="text-xl font-black tracking-tight">TYPESCRIPT</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <SiTailwindcss className="text-4xl text-[#000000]" />
                      <span className="text-xl font-black tracking-tight">TAILWIND</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <SiSupabase className="text-4xl text-[#000000]" />
                      <span className="text-xl font-black tracking-tight">SUPABASE</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <SiStripe className="text-4xl text-[#000000]" />
                      <span className="text-xl font-black tracking-tight">STRIPE</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute right-0 top-1/2 hidden h-[70%] max-h-[360px] w-[35vw] max-w-md -translate-y-1/2 border-l-4 border-black bg-white shadow-[-6px_0_0_0_rgba(0,0,0,1)] lg:block"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      />
    </section>
  );
}
