import { FadeInView } from "@/components/fade-in-view";

const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    category: "Web Development",
    description: "Custom shopping platform with 10,000+ users",
  },
  {
    id: 2,
    title: "AI Analytics Dashboard",
    category: "AI Integration",
    description: "Real-time data visualization with machine learning",
  },
  {
    id: 3,
    title: "Mobile Fitness App",
    category: "Mobile Apps",
    description: "Cross-platform app with 100K+ downloads",
  },
  {
    id: 4,
    title: "SaaS Management Tool",
    category: "SaaS Development",
    description: "Enterprise solution for 50+ companies",
  },
  {
    id: 5,
    title: "Cloud Migration",
    category: "Cloud Solutions",
    description: "Complete infrastructure modernization",
  },
  {
    id: 6,
    title: "Brand Redesign",
    category: "UI/UX Design",
    description: "Complete visual identity overhaul",
  },
];

export function RetroPortfolio() {
  return (
    <section id="portfolio" className="bg-white border-b-4 border-black py-16">
      <FadeInView>
        <div className="max-w-7xl mx-auto px-4">
        <h2 className="retro-heading text-5xl text-center mb-12">OUR PORTFOLIO</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="retro-card p-6 flex flex-col">
              <h3 className="retro-heading text-2xl mb-2">{project.title}</h3>
              <span className="bg-yellow-400 text-black font-bold text-sm px-3 py-1 border-2 border-black w-fit mb-3">
                {project.category}
              </span>
              <p className="font-semibold flex-1">{project.description}</p>
              <button
                type="button"
                className="mt-4 w-full px-4 py-2 border-2 border-black font-bold uppercase bg-white hover:bg-gray-100"
              >
                VIEW PROJECT
              </button>
            </div>
          ))}
        </div>
        </div>
      </FadeInView>
    </section>
  );
}
