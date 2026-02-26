"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const stats = [
  { value: "50+", label: "Projects" },
  { value: "30+", label: "Clients" },
  { value: "15+", label: "Years" },
];

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
    transition: { type: "spring" as const, stiffness: 200, damping: 20 },
  },
};

export function RetroHero() {
  return (
    <section id="home" className="relative bg-yellow-400 border-b-4 border-black overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M0 0h2v2H0V0zm4 4h2v2H4V4zm4 4h2v2H8V8zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2zm4 4h2v2h-2v-2z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 lg:py-36">
        <motion.div
          className="max-w-3xl"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.p
            className="text-sm font-black uppercase tracking-[0.3em] text-black/70 mb-4"
            variants={item}
          >
            Digital Agency
          </motion.p>
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-[1.05] tracking-tight mb-6"
            variants={item}
          >
            We build{" "}
            <motion.span
              className="inline-block bg-black text-yellow-400 px-3 py-1 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
              variants={badge}
            >
              amazing
            </motion.span>{" "}
            digital products
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl font-semibold text-black/90 max-w-xl mb-10 leading-relaxed"
            variants={item}
          >
            Websites, apps, and SaaS that actually ship. From idea to launch—with modern tech and
            zero fluff.
          </motion.p>

          <motion.div className="flex flex-wrap gap-4 mb-14" variants={item}>
            <Link
              href="/signup"
              className="retro-button bg-black text-yellow-400 border-black hover:bg-black/90"
            >
              Start a project
            </Link>
            <a
              href="#about"
              className="px-6 py-3 border-4 border-black font-black uppercase tracking-widest bg-transparent hover:bg-black hover:text-yellow-400 transition-colors"
            >
              Learn more
            </a>
          </motion.div>

          <motion.div
            className="flex gap-8 md:gap-12 border-t-4 border-black pt-8"
            variants={item}
          >
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl md:text-4xl font-black leading-none">{value}</p>
                <p className="text-sm font-bold uppercase tracking-wider text-black/80 mt-1">
                  {label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[35vw] max-w-md h-[70%] max-h-[360px] bg-white border-l-4 border-black shadow-[-6px_0_0_0_rgba(0,0,0,1)] hidden lg:block"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      />
    </section>
  );
}
