import { FadeInView } from "@/components/fade-in-view";

const testimonials = [
  {
    id: 1,
    text: "RactroTech transformed our business with their innovative solutions. Highly recommended!",
    author: "JOHN SMITH",
    company: "Tech Startup Inc",
  },
  {
    id: 2,
    text: "Professional team, excellent results. They delivered beyond our expectations.",
    author: "LISA ANDERSON",
    company: "Digital Marketing Co",
  },
  {
    id: 3,
    text: "The best investment we made for our company. Incredible work and support!",
    author: "ROBERT GARCIA",
    company: "E-Commerce Solutions",
  },
];

export function RetroTestimonials() {
  return (
    <section className="bg-yellow-400 border-b-4 border-black py-16">
      <FadeInView>
        <div className="max-w-7xl mx-auto px-4">
        <h2 className="retro-heading text-5xl text-center mb-12">WHAT CLIENTS SAY</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="text-4xl font-black mb-4">&quot;</div>
              <p className="font-semibold text-lg mb-4">{testimonial.text}</p>
              <div className="border-t-4 border-black pt-4">
                <p className="font-black uppercase">{testimonial.author}</p>
                <p className="font-bold text-sm uppercase">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
        </div>
      </FadeInView>
    </section>
  );
}
