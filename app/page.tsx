'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Globe,
  Wrench,
  Cloud,
  LayoutTemplate,
  Zap,
  Smartphone,
  GraduationCap,
  Briefcase,
  FileCode2,
  BrainCircuit,
  ArrowRight,
  CheckCircle2,
  Star,
  Mail,
  Phone,
  ChevronRight,
} from 'lucide-react';

const services = [
  {
    id: 1,
    title: 'Niche Website Development',
    description:
      'Custom websites designed for Cafes, Gyms, Clinics & Local Businesses. SEO optimized & mobile responsive.',
    icon: Globe,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    id: 2,
    title: 'Website Maintenance',
    description:
      'Keep your website updated, secure, and running smoothly. Includes bug fixes and performance optimization.',
    icon: Wrench,
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
  },
  {
    id: 3,
    title: 'Micro SaaS Products',
    description:
      'Scalable SaaS tools tailored for your business using Next.js, MongoDB, and Razorpay.',
    icon: Cloud,
    color: 'text-indigo-400',
    bg: 'bg-indigo-400/10',
  },
  {
    id: 4,
    title: 'UI Templates & Kits',
    description:
      'Modern UI kits and templates for startups. Landing pages, admin dashboards, and animated components.',
    icon: LayoutTemplate,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    id: 5,
    title: 'Business Automation',
    description:
      'Automate your workflows with WhatsApp bots, email automation, and lead capture systems.',
    icon: Zap,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
  },
  {
    id: 6,
    title: 'Mobile App Development',
    description:
      'Cross-platform mobile apps for business and productivity using Flutter and React Native.',
    icon: Smartphone,
    color: 'text-pink-400',
    bg: 'bg-pink-400/10',
  },
  {
    id: 7,
    title: 'Coding Training',
    description:
      'Learn modern web development (MERN, Next.js, DSA) with industry experts. Weekend batches available.',
    icon: GraduationCap,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
  {
    id: 8,
    title: 'Freelance Services',
    description:
      'Hire us for international-level web development, performance optimization, and GSAP animations.',
    icon: Briefcase,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
  },
  {
    id: 9,
    title: 'WordPress Development',
    description:
      'Affordable and fast websites, blogs, and WooCommerce stores built using WordPress.',
    icon: FileCode2,
    color: 'text-red-400',
    bg: 'bg-red-400/10',
  },
  {
    id: 10,
    title: 'AI Integrations',
    description:
      'Add AI power to applications: Chatbots, customer support bots, and recommendation systems.',
    icon: BrainCircuit,
    color: 'text-rose-400',
    bg: 'bg-rose-400/10',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};

export default function LandingPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col overflow-hidden bg-slate-950 text-slate-50 selection:bg-indigo-500/30">
      {/* Dynamic Background Effects */}
      <div className="pointer-events-none fixed inset-0 z-0 flex justify-center">
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <header className="fixed z-50 flex h-20 w-full items-center border-b border-white/5 bg-slate-950/60 px-6 backdrop-blur-md transition-all lg:px-12">
        <Link className="group flex items-center justify-center gap-2" href="#">
          <div className="rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-2 transition-transform group-hover:scale-105">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">RactroTech</span>
        </Link>
        <nav className="ml-auto hidden gap-8 md:flex">
          <a
            className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            href="#services"
          >
            Services
          </a>
          <a
            className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            href="#workflow"
          >
            Process
          </a>
          <a
            className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            href="#contact"
          >
            Contact
          </a>
        </nav>
        <div className="ml-auto md:ml-8">
          <Button className="rounded-full bg-white px-6 font-semibold text-slate-950 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:bg-slate-200">
            <Link href="#contact">Get a Quote</Link>
          </Button>
        </div>
      </header>

      <main className="relative z-10 flex-1 pt-20">
        {/* HERO SECTION */}
        <section className="relative flex min-h-[90vh] w-full items-center justify-center py-24 md:py-32 lg:py-48">
          <div className="container relative z-10 px-4 text-center md:px-6">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="mb-8 inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-300 backdrop-blur-sm"
            >
              <span className="mr-2 flex h-2 w-2 animate-pulse rounded-full bg-indigo-500"></span>
              Transforming Ideas into Digital Reality
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mb-6 max-w-4xl bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text pb-2 text-4xl font-extrabold leading-tight tracking-tight text-transparent sm:text-6xl md:text-7xl lg:text-8xl"
            >
              Building the Future of <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Digital Experiences
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mx-auto mb-10 max-w-2xl text-lg text-slate-400 md:text-xl/relaxed lg:text-2xl/relaxed"
            >
              From custom SaaS and Mobile Apps to AI Integrations & Automation. We craft premium
              software solutions tailored for your business growth.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Button
                size="lg"
                className="h-14 transform rounded-full bg-indigo-500 px-8 text-lg text-white shadow-[0_0_40px_rgba(99,102,241,0.4)] transition-all hover:scale-105 hover:bg-indigo-600"
              >
                Explore Services <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 rounded-full border-slate-700 bg-slate-800/50 px-8 text-lg text-black text-white backdrop-blur-sm transition-all hover:bg-slate-800 hover:text-white"
              >
                Book Consultation
              </Button>
            </motion.div>
          </div>

          {/* Abstract floating elements */}
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-[10%] top-1/4 hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md lg:block"
          >
            <Cloud className="h-8 w-8 text-cyan-400" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-1/3 right-[10%] hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md lg:block"
          >
            <Smartphone className="h-8 w-8 text-indigo-400" />
          </motion.div>
        </section>

        {/* SERVICES SECTION */}
        <section
          id="services"
          className="relative w-full border-b border-t border-white/5 bg-slate-900/50 py-20 lg:py-32"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-16 text-center md:mb-24">
              <h2 className="mb-4 inline-block bg-gradient-to-r from-white to-slate-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl">
                Our Core Services
              </h2>
              <p className="mx-auto max-w-3xl text-slate-400 md:text-xl">
                Comprehensive end-to-end technological solutions designed to scale.
              </p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {services.map((service) => (
                <motion.div
                  key={service.id}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-slate-950/50 p-8 shadow-2xl transition-all hover:border-white/20 hover:shadow-[0_0_40px_rgba(120,119,198,0.1)]"
                >
                  <div className="relative z-10">
                    <div
                      className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${service.bg} transition-transform group-hover:rotate-3 group-hover:scale-110`}
                    >
                      <service.icon className={`h-7 w-7 ${service.color}`} />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-slate-100">{service.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-400">{service.description}</p>
                  </div>
                  <div className="relative z-10 mt-8">
                    <div className="flex cursor-pointer items-center text-sm font-medium text-slate-300 transition-colors group-hover:text-white">
                      Learn More{' '}
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>

                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* HIGHLIGHT FEAT SECTION */}
        <section className="relative w-full overflow-hidden py-20 lg:py-32">
          <div className="container relative z-10 mx-auto px-4 md:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex flex-col space-y-8"
              >
                <div className="space-y-4">
                  <div className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400">
                    Why Choose RactroTech?
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                    Built for{' '}
                    <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                      Speed & Scale
                    </span>
                  </h2>
                  <p className="max-w-[600px] leading-relaxed text-slate-400 md:text-lg">
                    We don't just write code; we architect solutions. Our modern tech stack ensures
                    your product is lightning fast, highly secure, and ready to handle massive scale
                    from day one.
                  </p>
                </div>

                <ul className="grid gap-4 sm:grid-cols-2">
                  {[
                    'Next.js & React Native',
                    'Tailwind & Framer Motion',
                    'Node.js & MongoDB',
                    'AI & OpenAI Specs',
                    'Stripe & Razorpay',
                    'AWS & Vercel',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      </div>
                      <span className="font-medium text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>

                <div>
                  <Button className="rounded-full bg-white text-slate-900 hover:bg-slate-200">
                    See Our Tech Stack
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="perspective-1000 relative mx-auto w-full max-w-[500px] lg:max-w-none"
              >
                <div className="relative transform rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl transition-transform duration-500 hover:rotate-0 hover:scale-[1.02]">
                  <div className="mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                  </div>
                  <pre className="overflow-hidden font-mono text-sm leading-relaxed text-cyan-300">
                    <code>
                      <span className="text-pink-400">const</span>{' '}
                      <span className="text-yellow-300">RactroTech</span>{' '}
                      <span className="text-pink-400">=</span> {'{\n'}
                      {'  '}mission: <span className="text-green-300">"Empower Businesses"</span>,\n
                      {'  '}stack: [<span className="text-green-300">"Next.js"</span>,{' '}
                      <span className="text-green-300">"AI"</span>,{' '}
                      <span className="text-green-300">"Mobile"</span>],\n
                      {'  '}execute: <span className="text-purple-400">async</span>(idea) {'=>'}{' '}
                      {'{\n'}
                      {'    '}
                      <span className="text-pink-400">await</span> design.premium();\n
                      {'    '}
                      <span className="text-pink-400">await</span> code.optimize();\n
                      {'    '}
                      <span className="text-pink-400">return</span> deploy.launch();\n
                      {'  '}
                      {'}\n'}
                      {'}'};
                    </code>
                  </pre>

                  {/* Floating badge */}
                  <div
                    className="absolute -bottom-6 -right-6 flex animate-bounce items-center gap-3 rounded-2xl border border-indigo-500/30 bg-indigo-900/60 p-4 shadow-xl backdrop-blur-md"
                    style={{ animationDuration: '3s' }}
                  >
                    <div className="rounded-full bg-indigo-500 p-2">
                      <Star className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-indigo-200">Rated</p>
                      <p className="font-bold text-white">Top Agency 2024</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="relative w-full py-20 lg:py-32">
          <div className="container relative z-10 mx-auto px-4 md:px-6">
            <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 px-6 py-16 text-center shadow-[0_0_50px_rgba(79,70,229,0.2)] sm:px-12 md:py-24">
              {/* Backglow for CTA */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/30 blur-[100px]"></div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative z-10 mx-auto max-w-3xl space-y-8"
              >
                <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                  Ready to Build Something Amazing?
                </h2>
                <p className="text-lg text-indigo-100 md:text-xl">
                  Stop dreaming. Start building. Contact us today to discuss your project, and let's
                  turn your vision into incredible software.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
                  <Button
                    size="lg"
                    className="h-14 w-full rounded-full bg-white px-8 font-bold text-indigo-950 hover:bg-slate-200 sm:w-auto"
                  >
                    Start Your Project
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 w-full rounded-full border-white/20 bg-white/5 px-8 text-black hover:bg-white/10 hover:text-white sm:w-auto"
                  >
                    View Portfolio
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 w-full border-t border-white/10 bg-slate-950 px-6 py-12 text-slate-400 md:px-12">
        <div className="container mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div className="space-y-4">
            <Link className="group flex items-center gap-2" href="#">
              <div className="rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-2">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">RactroTech</span>
            </Link>
            <p className="text-sm">
              We design and develop premium digital experiences. Crafting modern software solutions
              tailored for visionaries.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="transition-colors hover:text-indigo-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#services" className="transition-colors hover:text-indigo-400">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-indigo-400">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-indigo-400">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="transition-colors hover:text-indigo-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-indigo-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-indigo-400">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex cursor-pointer items-center gap-2 transition-colors hover:text-indigo-400">
                <Mail className="h-4 w-4" /> hello@ractrotech.com
              </li>
              <li className="flex cursor-pointer items-center gap-2 transition-colors hover:text-indigo-400">
                <Phone className="h-4 w-4" /> +91 98765 43210
              </li>
            </ul>
          </div>
        </div>

        <div className="container mx-auto mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-xs">© {new Date().getFullYear()} RactroTech. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider">
            <span>Built by Gaurav & Rahul</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
