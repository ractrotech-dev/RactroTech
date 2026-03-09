import Link from "next/link";
import { FadeInView } from "@/components/fade-in-view";

const packages = [
  {
    id: 1,
    name: "STARTER",
    price: "$999",
    description: "Perfect for small projects",
    features: ["Up to 5 pages", "Responsive design", "Basic SEO", "5 revisions"],
  },
  {
    id: 2,
    name: "PROFESSIONAL",
    price: "$2,999",
    description: "For growing businesses",
    features: [
      "Up to 15 pages",
      "Advanced features",
      "SEO optimization",
      "Unlimited revisions",
      "Analytics setup",
      "Email support",
    ],
    featured: true,
  },
  {
    id: 3,
    name: "ENTERPRISE",
    price: "CUSTOM",
    description: "Tailored solutions",
    features: [
      "Unlimited pages",
      "Full customization",
      "Advanced integrations",
      "24/7 support",
      "Dedicated team",
      "Priority support",
    ],
  },
];

export function RetroPricing() {
  return (
    <section id="pricing" className="bg-white border-b-4 border-black py-16">
      <FadeInView>
        <div className="max-w-7xl mx-auto px-4">
        <h2 className="retro-heading text-5xl text-center mb-12">PRICING PLANS</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`${pkg.featured ? "scale-105" : ""} retro-card p-6 flex flex-col ${pkg.featured ? "border-8" : ""}`}
            >
              {pkg.featured && (
                <div className="bg-yellow-400 border-2 border-black font-black text-center px-3 py-1 mb-4">
                  FEATURED
                </div>
              )}
              <h3 className="retro-heading text-3xl mb-2">{pkg.name}</h3>
              <p className="text-4xl font-black mb-1">{pkg.price}</p>
              <p className="font-semibold text-sm mb-6">{pkg.description}</p>

              <ul className="space-y-2 mb-6 flex-1">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="font-semibold flex items-start gap-2">
                    <span className="font-black">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={pkg.name === "ENTERPRISE" ? "/login" : "/signup"}
                className="retro-button w-full text-center block"
              >
                {pkg.name === "ENTERPRISE" ? "GET QUOTE" : "GET STARTED"}
              </Link>
            </div>
          ))}
        </div>
        </div>
      </FadeInView>
    </section>
  );
}
