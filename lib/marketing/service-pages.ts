export type ServiceFAQ = {
  question: string;
  answer: string;
};

export type ServiceSection = {
  title: string;
  body: string;
  bullets?: string[];
};

export type ServicePageData = {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroDescription: string;
  sections: ServiceSection[];
  faqs: ServiceFAQ[];
  relatedSlugs: string[];
};

export const SERVICE_PAGES: ServicePageData[] = [
  {
    slug: "saas-development",
    name: "SaaS Development",
    metaTitle: "Custom SaaS Development Company",
    metaDescription:
      "End-to-end SaaS development — discovery, UI/UX, Next.js engineering, auth, billing, and launch. Built for startups. Get a free estimate from Ractrotech.",
    h1: "Custom SaaS Development Company for Startups & Growing Teams",
    heroDescription:
      "We design and build production-ready SaaS products on Next.js — from multi-tenant architecture to Stripe billing and admin dashboards.",
    sections: [
      {
        title: "What We Build",
        body: "Ractrotech delivers full-stack SaaS applications tailored to your business model — B2B platforms, subscription tools, internal ops software, and customer-facing products.",
        bullets: [
          "Multi-tenant SaaS with auth, roles, and billing",
          "Admin dashboards and customer portals",
          "API integrations (Stripe, Supabase, webhooks)",
          "Scalable Next.js architecture for long-term growth",
        ],
      },
      {
        title: "Our SaaS Development Process",
        body: "A lean, founder-friendly process designed to ship fast without cutting corners on code quality.",
        bullets: [
          "Discovery & scope — goals, users, MVP feature set",
          "UX wireframes & UI design",
          "Sprint-based development with weekly demos",
          "QA, deployment, and post-launch support",
        ],
      },
      {
        title: "Tech Stack",
        body: "We use modern, battle-tested tools that scale with your product and are easy to hire for.",
        bullets: ["Next.js App Router", "TypeScript", "Supabase / PostgreSQL", "Stripe Billing", "Tailwind CSS", "Vercel"],
      },
      {
        title: "Why Ractrotech",
        body: "Unlike generic agencies, we combine custom SaaS builds with production-ready templates and a component library — so you ship faster at every stage.",
      },
    ],
    faqs: [
      {
        question: "How long does custom SaaS development take?",
        answer:
          "Most SaaS MVPs ship in 4–8 weeks. A full v1 product with billing, admin, and integrations typically takes 8–16 weeks depending on scope.",
      },
      {
        question: "How much does custom SaaS development cost?",
        answer:
          "Lean MVPs typically start around $15,000–$30,000. Standard SaaS builds with auth, billing, and dashboards range from $30,000–$60,000+. We provide a fixed-scope quote after discovery.",
      },
      {
        question: "Do you build SaaS MVPs?",
        answer:
          "Yes. MVP development is one of our core services. We focus on the features that validate your idea fastest while keeping the architecture ready to scale.",
      },
      {
        question: "What tech stack do you use for SaaS?",
        answer:
          "We primarily build on Next.js, TypeScript, Supabase or PostgreSQL, and Stripe — a stack optimized for speed, SEO, and maintainability.",
      },
      {
        question: "Do you provide post-launch support?",
        answer:
          "Yes. We offer maintenance retainers, feature iterations, and performance monitoring after your product goes live.",
      },
    ],
    relatedSlugs: ["mvp-development", "nextjs-development", "startup-development"],
  },
  {
    slug: "mvp-development",
    name: "MVP Development",
    metaTitle: "MVP Development Company for Startups",
    metaDescription:
      "Launch your MVP in 4–8 weeks. Ractrotech helps founders validate ideas with lean, production-ready Next.js MVPs. Book a free scoping call.",
    h1: "MVP Development Company — Validate Faster, Ship Sooner",
    heroDescription:
      "Turn your idea into a working product investors and users can touch — without overbuilding or wasting budget on the wrong features.",
    sections: [
      {
        title: "What Is an MVP?",
        body: "A Minimum Viable Product is the smallest version of your product that delivers real value and lets you test assumptions with real users.",
      },
      {
        title: "MVP Development Services",
        body: "We scope ruthlessly, build what matters, and ship a production-ready foundation you can iterate on.",
        bullets: [
          "User auth and onboarding flows",
          "Core feature set (3–5 key workflows)",
          "Admin panel or dashboard",
          "Payments or waitlist (when needed)",
          "Deployment and analytics setup",
        ],
      },
      {
        title: "Our 4-Week MVP Framework",
        body: "A proven sprint structure that keeps momentum high and scope under control.",
        bullets: [
          "Week 1: Discovery, wireframes, and technical architecture",
          "Week 2–3: Core feature development",
          "Week 4: QA, polish, and production launch",
        ],
      },
      {
        title: "MVP vs Full Product",
        body: "An MVP proves demand. A v1 product scales it. We build MVPs with clean architecture so you never need a full rewrite to grow.",
      },
    ],
    faqs: [
      {
        question: "What is included in an MVP?",
        answer:
          "Typically: authentication, core user workflows, a basic admin view, deployment, and essential integrations. We define exact scope during a free discovery call.",
      },
      {
        question: "How much does MVP development cost?",
        answer:
          "Most MVPs range from $15,000–$40,000 depending on complexity, integrations, and design requirements.",
      },
      {
        question: "Can you iterate after the MVP launches?",
        answer:
          "Absolutely. Many clients continue with us for v1 features, performance optimization, and ongoing development sprints.",
      },
      {
        question: "Do you sign NDAs?",
        answer: "Yes. We treat all client ideas and data as confidential and are happy to sign NDAs before discovery.",
      },
    ],
    relatedSlugs: ["saas-development", "startup-development", "nextjs-development"],
  },
  {
    slug: "nextjs-development",
    name: "Next.js Development",
    metaTitle: "Next.js Development Agency",
    metaDescription:
      "Expert Next.js development for SaaS, dashboards, and marketing sites. App Router, Server Components, Supabase, Stripe. Request a quote from Ractrotech.",
    h1: "Next.js Development Agency for Modern Web Products",
    heroDescription:
      "We build fast, SEO-friendly web applications with Next.js — from SaaS platforms to marketing sites and internal tools.",
    sections: [
      {
        title: "Next.js Services",
        body: "Full-stack Next.js engineering for products that need performance, SEO, and a modern developer experience.",
        bullets: [
          "App Router and Server Components",
          "API routes and server actions",
          "Authentication and middleware",
          "Stripe and third-party integrations",
          "Performance and Core Web Vitals optimization",
        ],
      },
      {
        title: "Why Next.js for SaaS",
        body: "Next.js gives you server-side rendering for SEO, API routes for backends, and a React ecosystem that scales from MVP to enterprise.",
      },
      {
        title: "Our Stack",
        body: "We pair Next.js with tools that accelerate delivery without locking you in.",
        bullets: ["TypeScript", "Tailwind CSS", "Supabase / PostgreSQL", "Stripe", "Vercel"],
      },
      {
        title: "Templates & Accelerators",
        body: "Start even faster with our Next.js SaaS templates and component library — customizable starting points built by the same team.",
      },
    ],
    faqs: [
      {
        question: "Do you work with the Next.js App Router?",
        answer: "Yes. All new projects use the App Router, Server Components, and modern Next.js patterns.",
      },
      {
        question: "Can you migrate an existing app to Next.js?",
        answer:
          "Yes. We handle migrations from legacy React, WordPress, or other stacks to Next.js with minimal downtime.",
      },
      {
        question: "Do you optimize for SEO and page speed?",
        answer:
          "Yes. SEO metadata, structured data, image optimization, and Core Web Vitals are built into every project.",
      },
    ],
    relatedSlugs: ["saas-development", "web-app-development", "mvp-development"],
  },
  {
    slug: "web-app-development",
    name: "Web App Development",
    metaTitle: "Custom Web Application Development",
    metaDescription:
      "Secure, scalable web apps built with React and Next.js. From internal tools to customer-facing platforms. Talk to Ractrotech today.",
    h1: "Custom Web Application Development Services",
    heroDescription:
      "We build web applications that are fast, secure, and maintainable — whether you need a customer portal, internal dashboard, or full SaaS platform.",
    sections: [
      {
        title: "Web Apps We Build",
        body: "From B2B platforms to internal ops tools, we deliver web applications that teams actually enjoy using.",
        bullets: [
          "Customer-facing web applications",
          "Internal dashboards and admin panels",
          "Booking, scheduling, and workflow tools",
          "Data-heavy analytics interfaces",
        ],
      },
      {
        title: "Security & Scalability",
        body: "Role-based access, secure APIs, and database design that grows with your user base — not against it.",
      },
      {
        title: "Design + Development",
        body: "Our UI/UX team works alongside engineers so what gets designed is what gets shipped — pixel-accurate and performant.",
      },
    ],
    faqs: [
      {
        question: "What is the difference between a website and a web application?",
        answer:
          "A website is primarily informational. A web application lets users log in, interact with data, and complete workflows — like dashboards, SaaS tools, or portals.",
      },
      {
        question: "How long does web app development take?",
        answer: "Simple tools: 4–6 weeks. Complex platforms: 8–20 weeks. We provide a timeline after scoping.",
      },
    ],
    relatedSlugs: ["nextjs-development", "saas-development", "ui-ux-design"],
  },
  {
    slug: "ui-ux-design",
    name: "UI/UX Design",
    metaTitle: "SaaS UI/UX Design Services",
    metaDescription:
      "User research, wireframes, and high-fidelity SaaS UI design. Design systems developers can actually build. See Ractrotech's approach.",
    h1: "UI/UX Design for SaaS & Web Applications",
    heroDescription:
      "Beautiful, intuitive interfaces backed by user research — designed to convert visitors and keep users engaged.",
    sections: [
      {
        title: "Design Services",
        body: "End-to-end product design for SaaS and web applications, from first wireframe to developer handoff.",
        bullets: [
          "User research and persona development",
          "Wireframes and user flow mapping",
          "High-fidelity UI design in Figma",
          "Design systems and component libraries",
          "Usability testing and iteration",
        ],
      },
      {
        title: "SaaS-Specific UX",
        body: "We specialize in onboarding flows, dashboard layouts, and conversion-focused landing pages for software products.",
      },
      {
        title: "Design + Dev Under One Roof",
        body: "Because we also build the product, our designs are practical — no impossible specs or dev handoff nightmares.",
      },
    ],
    faqs: [
      {
        question: "Do you only design, or also develop?",
        answer:
          "Both. We offer standalone design services or full design-to-development packages for faster, more cohesive results.",
      },
      {
        question: "What tools do you use for design?",
        answer: "Primarily Figma for UI design, with structured handoff documentation for developers.",
      },
    ],
    relatedSlugs: ["saas-development", "web-app-development", "mvp-development"],
  },
  {
    slug: "startup-development",
    name: "Startup Development",
    metaTitle: "Startup Product Development Partner",
    metaDescription:
      "Technical co-founder alternative for early-stage startups. MVP to v1 product development on Next.js. Free project consultation from Ractrotech.",
    h1: "Startup Product Development — From Idea to Launch",
    heroDescription:
      "A developer-led partner for founders who need to move fast — without hiring a full engineering team on day one.",
    sections: [
      {
        title: "Built for Founders",
        body: "We understand startup constraints: tight budgets, uncertain scope, and the pressure to ship before runway runs out.",
        bullets: [
          "Lean MVP scoping and rapid prototyping",
          "Technical architecture advice",
          "Investor-demo-ready builds",
          "Flexible engagement models",
        ],
      },
      {
        title: "Technical Co-Founder Alternative",
        body: "Get senior engineering and product execution without giving up equity — until you're ready to hire in-house.",
      },
      {
        title: "From MVP to v1",
        body: "We don't disappear after launch. Many startup clients work with us through multiple product phases as they grow.",
      },
    ],
    faqs: [
      {
        question: "Do you work with non-technical founders?",
        answer:
          "Yes. We translate business goals into technical scope and keep you informed with plain-language updates and weekly demos.",
      },
      {
        question: "Can you help prepare for investor demos?",
        answer:
          "Yes. We prioritize demo-critical flows and polish the UX for pitch-ready presentations.",
      },
    ],
    relatedSlugs: ["mvp-development", "saas-development", "nextjs-development"],
  },
];

export const HOMEPAGE_FAQS: ServiceFAQ[] = [
  {
    question: "What does Ractrotech do?",
    answer:
      "Ractrotech is a digital product studio. We design and build websites, web applications, SaaS platforms, e-commerce stores, mobile apps, and AI-powered tools — and offer ready-made templates when you want to move even faster.",
  },
  {
    question: "Who is Ractrotech for?",
    answer:
      "Founders, growing businesses, and product teams. See Who we work with above for how we help each group.",
  },
  {
    question: "I only have an idea — can you still help?",
    answer:
      "Yes. Many clients come to us with a concept, not a spec. We help you define scope, choose the right approach, estimate cost and timeline, and build step by step.",
  },
  {
    question: "What kind of projects do you take on?",
    answer:
      "Business websites, SaaS products, MVPs, admin dashboards, e-commerce stores, mobile apps, UI/UX redesigns, AI integrations, cloud setup, and more. If it is digital and needs to work in production, we can likely help.",
  },
  {
    question: "Do you offer templates or only custom builds?",
    answer:
      "Both. Custom development when you need something unique, and production-ready templates and UI components when you want to launch faster and save budget.",
  },
  {
    question: "How do I get started?",
    answer:
      "Share your idea at ractrotech.com/start-project or email hello@ractrotech.com. We reply within one business day with next steps — usually a short call to understand your goals.",
  },
];

export function getServiceBySlug(slug: string): ServicePageData | undefined {
  return SERVICE_PAGES.find((s) => s.slug === slug);
}
