import { FadeInView } from '@/components/fade-in-view';

const pillars = [
  {
    number: '01',
    title: 'WE LISTEN FIRST',
    body: 'You explain the problem. We ask the right questions, scope it clearly, and agree on what success looks like before writing code.',
  },
  {
    number: '02',
    title: 'WE BUILD WHAT MATTERS',
    body: 'No bloated features, no endless meetings. We focus on what your users and business actually need — then ship it.',
  },
  {
    number: '03',
    title: 'WE STAY UNTIL IT WORKS',
    body: 'Launch is not the finish line. We test, fix, deploy, and support you until your product is live and performing.',
  },
];

export function RetroAbout() {
  return (
    <section
      id="about"
      className="relative overflow-hidden border-b-4 border-black bg-white py-20 md:py-28"
    >
      {/* Bold background accent */}
      <div className="absolute bottom-0 left-0 top-0 hidden w-full max-w-[min(50%,theme(maxWidth.7xl))] border-r-4 border-black bg-yellow-400 lg:block" />
      <FadeInView>
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: Main story block */}
            <div className="relative">
              <span className="pointer-events-none absolute left-0 top-1/2 -z-0 hidden -translate-y-1/2 select-none text-[clamp(4rem,10vw,8rem)] font-black leading-none tracking-tighter text-black/5 lg:block">
                About
              </span>
              <div className="retro-card relative z-10 border-8 bg-white p-8 md:p-10">
                <span className="mb-6 inline-block border-2 border-black bg-black px-3 py-1 text-sm font-black tracking-widest text-yellow-400">
                  Since 2026
                </span>
                <h2 className="retro-heading mb-4 text-3xl md:text-4xl">About Ractrotech</h2>
                <p className="mb-6 text-lg font-semibold leading-relaxed">
                  We&apos;re a developer-led team that builds real products — websites, apps, SaaS
                  platforms, stores, and internal tools — for people who are tired of agencies that
                  overpromise and underdeliver.
                </p>
                <p className="mb-6 font-semibold leading-relaxed text-black/90">
                  Whether you&apos;re a founder with a napkin sketch, a business upgrading your
                  online presence, or a team that needs extra engineering firepower — we meet you
                  where you are and help you ship something that works.
                </p>
                <p className="font-semibold leading-relaxed text-black/90">
                  Straight talk. Fair timelines. Modern technology. And a product you&apos;re proud
                  to put in front of customers.
                </p>
                {/* Decorative corner */}
                <div className="absolute -bottom-4 -right-4 h-24 w-24 border-4 border-black bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
              </div>
            </div>

            {/* Right: Mission / Vision / Approach */}
            <div className="space-y-4 lg:pt-8">
              {pillars.map((item, i) => (
                <div
                  key={item.number}
                  className={`retro-card flex gap-6 border-4 p-6 md:p-8 ${
                    i === 1 ? 'border-black bg-yellow-400' : 'bg-white'
                  }`}
                >
                  <span className="shrink-0 text-4xl font-black text-black/20 md:text-5xl">
                    {item.number}
                  </span>
                  <div>
                    <h3 className="retro-heading mb-2 text-xl md:text-2xl">{item.title}</h3>
                    <p className="font-semibold leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeInView>
    </section>
  );
}
