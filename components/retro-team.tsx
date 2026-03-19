import { FadeInView } from '@/components/fade-in-view';

const team = [
  {
    id: 1,
    name: 'ALEX JOHNSON',
    role: 'Founder & CEO',
    bio: '15+ years in tech leadership',
  },
  {
    id: 2,
    name: 'SARAH CHEN',
    role: 'CTO',
    bio: 'Full-stack architect & innovator',
  },
  {
    id: 3,
    name: 'MIKE RODRIGUEZ',
    role: 'Design Director',
    bio: 'Award-winning UX/UI designer',
  },
  {
    id: 4,
    name: 'EMMA WILSON',
    role: 'Project Manager',
    bio: 'Expert in agile & lean methodology',
  },
];

export function RetroTeam() {
  return (
    <section className="border-b-4 border-black bg-white py-16">
      <FadeInView>
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="retro-heading mb-12 text-center text-5xl">MEET THE TEAM</h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div key={member.id} className="retro-card p-6">
                <div className="mb-4 flex h-32 items-center justify-center border-2 border-black bg-gray-300">
                  <span className="text-2xl font-black">PHOTO</span>
                </div>
                <h3 className="retro-heading mb-1 text-xl">{member.name}</h3>
                <p className="mb-2 text-sm font-bold uppercase">{member.role}</p>
                <p className="text-sm font-semibold">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeInView>
    </section>
  );
}
