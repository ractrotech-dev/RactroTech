"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function RetroHeader() {
  return (
    <motion.header
      className="retro-border border-b-4 bg-white"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <h1 className="text-4xl font-black uppercase tracking-widest">RACTROTECH</h1>
            <p className="text-sm font-bold uppercase tracking-wider">Digital Agency</p>
          </Link>
          <nav className="hidden md:flex gap-8">
            <a href="#home" className="font-bold uppercase text-sm hover:underline">
              HOME
            </a>
            <a href="#services" className="font-bold uppercase text-sm hover:underline">
              SERVICES
            </a>
            <a href="#portfolio" className="font-bold uppercase text-sm hover:underline">
              PORTFOLIO
            </a>
            <a href="#about" className="font-bold uppercase text-sm hover:underline">
              ABOUT
            </a>
            <a href="#contact" className="font-bold uppercase text-sm hover:underline">
              CONTACT
            </a>
          </nav>
          <Link href="/login" className="retro-button">
            GET STARTED
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
