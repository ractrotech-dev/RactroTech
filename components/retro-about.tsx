import { FadeInView } from '@/components/fade-in-view';

const pillars = [
  {
    number: '01',
    title: 'OUR MISSION',
    body: 'To empower businesses with innovative technology solutions that drive growth and success.',
  },
  {
    number: '02',
    title: 'OUR VISION',
    body: 'To be the leading digital agency transforming ideas into reality.',
  },
  {
    number: '03',
    title: 'OUR APPROACH',
    body: 'Collaborative, innovative, and results-driven solutions tailored to your needs.',
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
              <span className="pointer-events-none absolute left-0 top-1/2 -z-0 hidden -translate-y-1/2 select-none text-[clamp(4rem,10vw,8rem)] font-black uppercase leading-none tracking-tighter text-black/5 lg:block">
                About
              </span>
              <div className="retro-card relative z-10 border-8 bg-white p-8 md:p-10">
                <span className="mb-6 inline-block border-2 border-black bg-black px-3 py-1 text-sm font-black uppercase tracking-widest text-yellow-400">
                  Since 2026
                </span>
                <h2 className="retro-heading mb-4 text-3xl md:text-4xl">About RactroTech</h2>
                <p className="mb-6 text-lg font-semibold leading-relaxed">
                  We’re a small team of developers focused on building real, working products not
                  just designs or ideas.
                </p>
                <p className="mb-6 font-semibold leading-relaxed text-black/90">
                  We help turn concepts into websites, apps, and SaaS that actually ship and perform
                  in the real world.
                </p>
                <p className="font-semibold leading-relaxed text-black/90">
                  No unnecessary processes, no fluff just clean execution, modern tech, and a focus
                  on getting things live.
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
