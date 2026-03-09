import { FadeInView } from "@/components/fade-in-view";

const team = [
  {
    id: 1,
    name: "ALEX JOHNSON",
    role: "Founder & CEO",
    bio: "15+ years in tech leadership",
  },
  {
    id: 2,
    name: "SARAH CHEN",
    role: "CTO",
    bio: "Full-stack architect & innovator",
  },
  {
    id: 3,
    name: "MIKE RODRIGUEZ",
    role: "Design Director",
    bio: "Award-winning UX/UI designer",
  },
  {
    id: 4,
    name: "EMMA WILSON",
    role: "Project Manager",
    bio: "Expert in agile & lean methodology",
  },
];

export function RetroTeam() {
  return (
    <section className="bg-white border-b-4 border-black py-16">
      <FadeInView>
        <div className="max-w-7xl mx-auto px-4">
        <h2 className="retro-heading text-5xl text-center mb-12">MEET THE TEAM</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div key={member.id} className="retro-card p-6">
              <div className="bg-gray-300 h-32 mb-4 border-2 border-black flex items-center justify-center">
                <span className="font-black text-2xl">PHOTO</span>
              </div>
              <h3 className="retro-heading text-xl mb-1">{member.name}</h3>
              <p className="font-bold text-sm uppercase mb-2">{member.role}</p>
              <p className="font-semibold text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
        </div>
      </FadeInView>
    </section>
  );
}
