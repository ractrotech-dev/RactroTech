import { FadeInView } from '@/components/fade-in-view';

type MarketingPageHeaderProps = {
  title: string;
  description: string;
};

export function MarketingPageHeader({ title, description }: MarketingPageHeaderProps) {
  return (
    <section className="border-b-4 border-black bg-yellow-400 py-16 md:py-20">
      <FadeInView>
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="retro-heading mb-4 text-4xl md:text-5xl">{title}</h1>
          <p className="mx-auto max-w-2xl text-lg font-semibold">{description}</p>
        </div>
      </FadeInView>
    </section>
  );
}
