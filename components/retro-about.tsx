import { FadeInView } from "@/components/fade-in-view";

const pillars = [
  {
    number: "01",
    title: "OUR MISSION",
    body: "To empower businesses with innovative technology solutions that drive growth and success.",
  },
  {
    number: "02",
    title: "OUR VISION",
    body: "To be the leading digital agency transforming ideas into reality.",
  },
  {
    number: "03",
    title: "OUR APPROACH",
    body: "Collaborative, innovative, and results-driven solutions tailored to your needs.",
  },
];

export function RetroAbout() {
  return (
    <section id="about" className="relative bg-white border-b-4 border-black py-20 md:py-28 overflow-hidden">
      {/* Bold background accent */}
      <div className="absolute left-0 top-0 bottom-0 w-full max-w-[min(50%,theme(maxWidth.7xl))] bg-yellow-400 border-r-4 border-black hidden lg:block" />
      <FadeInView>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left: Main story block */}
            <div className="relative">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[clamp(4rem,10vw,8rem)] font-black text-black/5 leading-none uppercase tracking-tighter hidden lg:block pointer-events-none select-none -z-0">
                About
              </span>
              <div className="retro-card p-8 md:p-10 border-8 bg-white relative z-10">
                <span className="inline-block bg-black text-yellow-400 text-sm font-black uppercase tracking-widest px-3 py-1 border-2 border-black mb-6">
                  Since 2010
                </span>
                <h2 className="retro-heading text-4xl md:text-5xl mb-6">
                  About RactroTech
                </h2>
                <p className="text-lg font-semibold leading-relaxed mb-6">
                  We&apos;ve been at the forefront of digital innovation, helping businesses transform
                  their ideas into powerful digital solutions.
                </p>
                <p className="font-semibold text-black/90 leading-relaxed mb-6">
                  Our team of expert developers, designers, and strategists work collaboratively to
                  deliver exceptional results that exceed expectations.
                </p>
                <p className="font-semibold text-black/90 leading-relaxed">
                  We believe in building long-term partnerships with our clients, supporting their
                  growth every step of the way.
                </p>
                {/* Decorative corner */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-yellow-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
              </div>
            </div>

            {/* Right: Mission / Vision / Approach */}
            <div className="space-y-4 lg:pt-8">
              {pillars.map((item, i) => (
                <div
                  key={item.number}
                  className={`retro-card p-6 md:p-8 border-4 flex gap-6 ${
                    i === 1 ? "bg-yellow-400 border-black" : "bg-white"
                  }`}
                >
                  <span className="text-4xl md:text-5xl font-black text-black/20 shrink-0">
                    {item.number}
                  </span>
                  <div>
                    <h3 className="retro-heading text-xl md:text-2xl mb-2">{item.title}</h3>
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
