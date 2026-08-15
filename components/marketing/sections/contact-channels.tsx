import Link from 'next/link';
import { Clock, Instagram, Linkedin, Mail, MessageSquare } from 'lucide-react';

import { Reveal, RevealGroup, RevealItem } from '@/components/marketing/reveal';

const contactEmail = 'hello@ractrotech.com';

/** Channels carried over from components/retro-contact.tsx. */
const CHANNELS = [
  {
    icon: Mail,
    title: 'Email',
    body: 'General enquiries, partnerships, and support.',
    href: `mailto:${contactEmail}`,
    cta: contactEmail,
  },
  {
    icon: MessageSquare,
    title: 'Project brief',
    body: 'Share your scope, timeline, and budget for a tailored proposal.',
    href: '/start-project',
    cta: 'Start a project',
  },
  {
    icon: Clock,
    title: 'Response time',
    body: 'We reply to new enquiries within one business day.',
    href: null,
    cta: 'Mon–Fri · 9am–6pm IST',
  },
];

const SOCIALS = [
  { icon: Linkedin, href: 'https://www.linkedin.com/company/ractrotech/', label: 'Ractrotech on LinkedIn' },
  { icon: Instagram, href: 'https://www.instagram.com/ractrotech/', label: 'Ractrotech on Instagram' },
];

export function ContactChannels() {
  return (
    <section className="bg-mkt-lavender py-20 lg:py-24">
      <div className="mkt-shell">
        <RevealGroup as="ul" className="grid gap-4 md:grid-cols-3">
          {CHANNELS.map((channel) => {
            const Icon = channel.icon;
            const inner = (
              <>
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-mkt-lavender text-mkt-violet">
                  <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                </span>
                <h2 className="mkt-display text-[21px]">{channel.title}</h2>
                <p className="mt-2.5 flex-1 text-[15px] leading-relaxed text-mkt-muted">
                  {channel.body}
                </p>
                <p className="mt-5 text-[15px] font-medium text-mkt-violet">{channel.cta}</p>
              </>
            );

            return (
              <RevealItem key={channel.title} as="li" className="h-full">
                {channel.href ? (
                  <Link
                    href={channel.href}
                    className="flex h-full flex-col rounded-3xl border border-mkt-line bg-mkt-surface p-6 transition-shadow duration-200 hover:shadow-[0_18px_44px_-26px_rgba(11,11,16,0.4)] sm:p-7"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div className="flex h-full flex-col rounded-3xl border border-mkt-line bg-mkt-surface p-6 sm:p-7">
                    {inner}
                  </div>
                )}
              </RevealItem>
            );
          })}
        </RevealGroup>

        <Reveal className="mt-6 flex flex-col items-center gap-6 rounded-3xl bg-mkt-contrast p-8 text-center text-white sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-white/40">
              Connect with us
            </p>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-white/60">
              Follow Ractrotech for product updates, launches, and behind-the-scenes builds.
            </p>
          </div>
          <div className="flex gap-2">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white"
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
