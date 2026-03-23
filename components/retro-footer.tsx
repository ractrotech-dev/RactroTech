'use client';

import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Instagram, Github, Mail, Phone, Send } from 'lucide-react';
import { FadeInView, StaggerContainer, staggerItemVariants } from '@/components/fade-in-view';
import { motion } from 'framer-motion';

export function RetroFooter() {
  return (
    <footer className="relative border-t-8 border-black bg-black py-20 text-white">
      {/* Subtle top glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          {/* Brand & Newsletter Section */}
          <div className="lg:col-span-5">
            <FadeInView y={30}>
              <Link href="/" className="inline-block">
                <h2 className="retro-heading mb-6 text-4xl text-yellow-400 lg:text-5xl">
                  RACTROTECH
                </h2>
              </Link>
              <p className="mb-8 max-w-sm text-lg font-medium leading-relaxed text-gray-400">
                Building digital futures with a retro twist. We ship high-performance websites,
                apps, and SaaS solutions for the modern web.
              </p>
            </FadeInView>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-7">
            <StaggerContainer className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-4">
              <motion.div variants={staggerItemVariants} className="space-y-6">
                <h4 className="text-sm font-black uppercase tracking-widest text-yellow-400">
                  Services
                </h4>
                <ul className="space-y-4">
                  <li>
                    <Link
                      href="#services"
                      className="font-bold text-gray-400 underline-offset-4 transition-colors hover:text-white hover:underline"
                    >
                      Web Apps
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#services"
                      className="font-bold text-gray-400 underline-offset-4 transition-colors hover:text-white hover:underline"
                    >
                      Mobile UX
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#services"
                      className="font-bold text-gray-400 underline-offset-4 transition-colors hover:text-white hover:underline"
                    >
                      SaaS Build
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#services"
                      className="font-bold text-gray-400 underline-offset-4 transition-colors hover:text-white hover:underline"
                    >
                      AI Tools
                    </Link>
                  </li>
                </ul>
              </motion.div>

              <motion.div variants={staggerItemVariants} className="space-y-6">
                <h4 className="text-sm font-black uppercase tracking-widest text-yellow-400">
                  Company
                </h4>
                <ul className="space-y-4">
                  <li>
                    <Link
                      href="#about"
                      className="font-bold text-gray-400 underline-offset-4 transition-colors hover:text-white hover:underline"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#portfolio"
                      className="font-bold text-gray-400 underline-offset-4 transition-colors hover:text-white hover:underline"
                    >
                      Portfolio
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/blog"
                      className="font-bold text-gray-400 underline-offset-4 transition-colors hover:text-white hover:underline"
                    >
                      Journal
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="font-bold text-gray-400 underline-offset-4 transition-colors hover:text-white hover:underline"
                    >
                      Careers
                    </Link>
                  </li>
                </ul>
              </motion.div>

              <motion.div variants={staggerItemVariants} className="space-y-6">
                <h4 className="text-sm font-black uppercase tracking-widest text-yellow-400">
                  Resources
                </h4>
                <ul className="space-y-4">
                  <li>
                    <Link
                      href="/docs"
                      className="font-bold text-gray-400 underline-offset-4 transition-colors hover:text-white hover:underline"
                    >
                      Docs
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/templates"
                      className="font-bold text-gray-400 underline-offset-4 transition-colors hover:text-white hover:underline"
                    >
                      Templates
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/components"
                      className="font-bold text-gray-400 underline-offset-4 transition-colors hover:text-white hover:underline"
                    >
                      UI Kit
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/support"
                      className="font-bold text-gray-400 underline-offset-4 transition-colors hover:text-white hover:underline"
                    >
                      Support
                    </Link>
                  </li>
                </ul>
              </motion.div>

              <motion.div variants={staggerItemVariants} className="space-y-6">
                <h4 className="text-sm font-black uppercase tracking-widest text-yellow-400">
                  Legal
                </h4>
                <ul className="space-y-4">
                  <li>
                    <Link
                      href="/terms"
                      className="font-bold text-gray-400 underline-offset-4 transition-colors hover:text-white hover:underline"
                    >
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy"
                      className="font-bold text-gray-400 underline-offset-4 transition-colors hover:text-white hover:underline"
                    >
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/license"
                      className="font-bold text-gray-400 underline-offset-4 transition-colors hover:text-white hover:underline"
                    >
                      License
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/cookies"
                      className="font-bold text-gray-400 underline-offset-4 transition-colors hover:text-white hover:underline"
                    >
                      Cookies
                    </Link>
                  </li>
                </ul>
              </motion.div>
            </StaggerContainer>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 flex flex-col items-center justify-between gap-8 border-t-4 border-white/10 pt-10 md:flex-row">
          <div className="flex gap-4">
            {[
              { icon: Facebook, href: '#' },
              { icon: Twitter, href: '#' },
              { icon: Linkedin, href: '#' },
              { icon: Instagram, href: '#' },
              { icon: Github, href: '#' },
            ].map((social, i) => (
              <Link
                key={i}
                href={social.href}
                className="flex h-12 w-12 items-center justify-center border-4 border-white/20 bg-white/5 transition-all hover:-translate-y-1 hover:border-yellow-400 hover:text-yellow-400"
              >
                <social.icon size={20} />
              </Link>
            ))}
          </div>

          <div className="text-center md:text-right">
            <p className="font-black uppercase tracking-widest text-white">© 2026 RACTROTECH</p>
            <p className="mt-2 text-xs font-bold uppercase text-gray-500">
              Designed with <span className="text-red-500">♥</span> for the modern web | All Rights
              Reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
