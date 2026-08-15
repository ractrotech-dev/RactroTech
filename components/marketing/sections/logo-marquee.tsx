import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiSupabase,
  SiPostgresql,
  SiStripe,
  SiVercel,
} from 'react-icons/si';

import { Marquee } from '@/components/marketing/marquee';

/** The stack Ractrotech actually builds on — matches lib/marketing/service-pages.ts. */
const LOGOS = [
  { Icon: SiNextdotjs, label: 'Next.js' },
  { Icon: SiReact, label: 'React' },
  { Icon: SiTypescript, label: 'TypeScript' },
  { Icon: SiTailwindcss, label: 'Tailwind CSS' },
  { Icon: SiSupabase, label: 'Supabase' },
  { Icon: SiPostgresql, label: 'PostgreSQL' },
  { Icon: SiStripe, label: 'Stripe' },
  { Icon: SiVercel, label: 'Vercel' },
];

export function LogoMarquee() {
  return (
    <section className="border-y border-mkt-line py-10" aria-label="Technology stack">
      <p className="mkt-shell mb-7 text-center text-[13px] font-medium uppercase tracking-[0.14em] text-mkt-muted">
        Built on a stack you can hire for
      </p>
      <Marquee durationSeconds={32}>
        {LOGOS.map(({ Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2.5 px-7 text-mkt-ink/65 transition-colors hover:text-mkt-ink sm:px-10"
          >
            <Icon className="h-6 w-6 shrink-0" aria-hidden />
            <span className="whitespace-nowrap text-[16px] font-medium">{label}</span>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
