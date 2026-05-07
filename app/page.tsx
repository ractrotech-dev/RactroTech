import { RetroHeader } from '@/components/retro-header';
import { RetroHero } from '@/components/retro-hero';
import { RetroServices } from '@/components/retro-services';
import { RetroAbout } from '@/components/retro-about';
import { RetroWhyUs } from '@/components/retro-why-us';
import { RetroPortfolio } from '@/components/retro-portfolio';
// import { RetroTeam } from "@/components/retro-team";
import { RetroTestimonials } from '@/components/retro-testimonials';
// import { RetroPricing } from "@/components/retro-pricing";
import { RetroCTA } from '@/components/retro-cta';
import { RetroFooter } from '@/components/retro-footer';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: "Ractrotech - Web Development Services & SaaS Templates",
  description: "Ractrotech is a platform offering high-quality web development services, along with powerful tools and ready-to-use templates.",
  canonicalUrl: "https://ractrotech.com",
});

export default function Home() {
  return (
    <main className="bg-white">
      <RetroHeader />
      <RetroHero />
      <RetroServices />
      <RetroAbout />
      <RetroWhyUs />
      <RetroPortfolio />
      {/* <RetroTeam /> */}
      <RetroTestimonials />
      {/* <RetroPricing /> */}
      <RetroCTA />
      <RetroFooter />
    </main>
  );
}
