import { FadeInView } from '@/components/fade-in-view';

const services = [
  {
    id: 1,
    name: 'Web Development',
    description: 'Custom responsive websites built with modern technologies',
    tags: ['React', 'Next.js', 'Responsive'],
  },
  {
    id: 2,
    name: 'SaaS Development',
    description: 'Scalable software-as-a-service solutions for your business',
    tags: ['Full Stack', 'Scalable', 'Secure'],
  },
  {
    id: 3,
    name: 'AI Integration',
    description: 'Leverage artificial intelligence to boost productivity',
    tags: ['Machine Learning', 'Automation', 'APIs'],
  },
  {
    id: 4,
    name: 'Mobile Apps',
    description: 'iOS and Android applications with native performance',
    tags: ['React Native', 'Performance', 'UX'],
  },
  {
    id: 5,
    name: 'E-Commerce',
    description: 'Complete online store solutions with payment integration',
    tags: ['Shopify', 'Payment', 'Analytics'],
  },
  {
    id: 6,
    name: 'API Development',
    description: 'RESTful and GraphQL APIs for seamless data integration',
    tags: ['Backend', 'Database', 'Security'],
  },
  {
    id: 7,
    name: 'Cloud Solutions',
    description: 'AWS, Google Cloud, and Azure infrastructure management',
    tags: ['DevOps', 'Scalability', 'Monitoring'],
  },
  {
    id: 8,
    name: 'UI/UX Design',
    description: 'Beautiful and intuitive user interfaces',
    tags: ['Design', 'User Research', 'Prototyping'],
  },
  // {
  //   id: 9,
  //   name: "Staff Training",
  //   description: "Tech education and skill development for your team",
  //   tags: ["Education", "Mentoring", "Workshops"],
  // },
  {
    id: 10,
    name: 'Consulting',
    description: 'Strategic technology consulting and architecture planning',
    tags: ['Strategy', 'Planning', 'Architecture'],
  },
];

export function RetroServices() {
  return (
    <section id="services" className="border-b-4 border-black bg-white py-16">
      <FadeInView>
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="retro-heading mb-4 text-5xl">OUR SERVICES</h2>
            <p className="mx-auto max-w-2xl text-lg font-semibold">
              We offer a comprehensive range of digital solutions to help your business grow and
              succeed.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div key={service.id} className="retro-card p-6">
                <h3 className="retro-heading mb-3 text-2xl">{service.name}</h3>
                <p className="mb-4 font-semibold">{service.description}</p>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border-2 border-black bg-yellow-400 px-3 py-1 text-xs font-bold text-black"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeInView>
    </section>
  );
}
