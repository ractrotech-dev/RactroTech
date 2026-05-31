import Link from 'next/link';
import { Clock, Linkedin, Instagram, Mail, MessageSquare } from 'lucide-react';
import { FadeInView } from '@/components/fade-in-view';

const contactEmail = 'hello@ractrotech.com';

const channels = [
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

export function RetroContact() {
  return (
    <section className="border-b-4 border-black bg-white py-16">
      <FadeInView>
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-6 md:grid-cols-3">
            {channels.map((channel) => {
              const Icon = channel.icon;
              const card = (
                <div className="retro-card flex h-full flex-col p-6 md:p-8">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center border-4 border-black bg-yellow-400">
                    <Icon className="h-7 w-7" strokeWidth={2.5} />
                  </div>
                  <h2 className="retro-heading mb-2 text-2xl">{channel.title}</h2>
                  <p className="mb-4 flex-1 font-semibold leading-relaxed text-black/80">
                    {channel.body}
                  </p>
                  <p className="text-sm font-black tracking-widest text-black/60">
                    {channel.cta}
                  </p>
                </div>
              );

              if (channel.href) {
                return (
                  <Link key={channel.title} href={channel.href} className="group block h-full">
                    <div className="h-full transition-transform group-hover:-translate-y-1">{card}</div>
                  </Link>
                );
              }

              return <div key={channel.title}>{card}</div>;
            })}
          </div>

          <div className="mt-12 flex flex-col items-center gap-4 border-4 border-black bg-black p-8 text-center md:flex-row md:justify-between md:text-left">
            <div>
              <p className="text-xs font-black tracking-[0.25em] text-yellow-400">
                Connect with us
              </p>
              <p className="mt-2 font-semibold text-gray-400">
                Follow RactroTech for product updates, launches, and behind-the-scenes builds.
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="https://www.linkedin.com/company/ractrotech/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center border-4 border-white/20 bg-white/5 text-white transition-all hover:-translate-y-1 hover:border-yellow-400 hover:text-yellow-400"
                aria-label="RactroTech on LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://www.instagram.com/ractrotech/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center border-4 border-white/20 bg-white/5 text-white transition-all hover:-translate-y-1 hover:border-yellow-400 hover:text-yellow-400"
                aria-label="RactroTech on Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </FadeInView>
    </section>
  );
}
