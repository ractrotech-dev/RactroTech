import Link from "next/link";
import { FadeInView } from "@/components/fade-in-view";

export function RetroCTA() {
  return (
    <section id="contact" className="bg-black border-b-4 border-black py-16">
      <FadeInView>
        <div className="max-w-7xl mx-auto px-4">
        <div className="retro-card p-12 text-center">
          <h2 className="text-5xl font-black uppercase mb-4">READY TO GET STARTED?</h2>
          <p className="text-xl font-semibold mb-8 max-w-2xl mx-auto">
            Let&apos;s work together to bring your digital vision to life. Contact us today for a
            free consultation!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="retro-button">
              START YOUR PROJECT
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 border-4 border-black font-black uppercase tracking-widest bg-white hover:bg-gray-100"
            >
              SCHEDULE CALL
            </Link>
          </div>
        </div>
        </div>
      </FadeInView>
    </section>
  );
}
