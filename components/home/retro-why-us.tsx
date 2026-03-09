import { FadeInView } from "@/components/fade-in-view";
import { Users, Trophy, Zap, Headphones } from "lucide-react";

const reasons = [
  {
    id: 1,
    icon: Users,
    title: "Expert team",
    description: "Highly skilled professionals with years of industry experience.",
  },
  {
    id: 2,
    icon: Trophy,
    title: "Proven results",
    description: "Track record of successful projects and satisfied clients.",
  },
  {
    id: 3,
    icon: Zap,
    title: "Cutting edge",
    description: "Latest technologies and best practices in web development.",
  },
  {
    id: 4,
    icon: Headphones,
    title: "24/7 support",
    description: "Dedicated support team available whenever you need help.",
  },
];

export function RetroWhyUs() {
  return (
    <section className="relative bg-white border-b-4 border-black py-20 md:py-28 overflow-hidden">
      {/* Yellow side accents */}
      <div className="absolute left-0 top-0 bottom-0 w-3 bg-yellow-400 border-r-4 border-black hidden md:block" />
      <div className="absolute right-0 top-0 bottom-0 w-3 bg-yellow-400 border-l-4 border-black hidden md:block" />

      <FadeInView>
        <div className="relative max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-black/60 mb-3">
              The difference
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-black mb-4">
              Why choose RactroTech?
            </h2>
            <p className="text-lg font-semibold text-black/80 max-w-xl mx-auto">
              We don’t just deliver projects—we deliver outcomes that move the needle.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {reasons.map((reason, i) => {
              const Icon = reason.icon;
              const isHighlight = i === 1; // middle-left or second card gets highlight
              return (
                <div
                  key={reason.id}
                  className={`group relative border-4 border-black p-6 md:p-8 transition-all duration-200 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 ${
                    isHighlight
                      ? "bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  }`}
                >
                  {/* Card number */}
                  <span className="absolute top-4 right-4 text-5xl font-black text-black/10">
                    0{reason.id}
                  </span>
                  <div
                    className={`w-14 h-14 md:w-16 md:h-16 border-4 border-black flex items-center justify-center mb-6 ${
                      isHighlight ? "bg-black" : "bg-yellow-400"
                    }`}
                  >
                    <Icon
                      className={`w-7 h-7 md:w-8 md:h-8 ${isHighlight ? "text-yellow-400" : "text-black"}`}
                      strokeWidth={2.5}
                    />
                  </div>
                  <h3 className="retro-heading text-xl md:text-2xl mb-3">
                    {reason.title}
                  </h3>
                  <p className="font-semibold text-black/90 leading-relaxed text-sm md:text-base">
                    {reason.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Bottom strip */}
          <div className="mt-14 py-4 px-6 bg-black border-4 border-black text-center">
            <p className="text-yellow-400 font-black uppercase tracking-widest text-sm md:text-base">
              Trusted by startups and enterprises alike
            </p>
          </div>
        </div>
      </FadeInView>
    </section>
  );
}
