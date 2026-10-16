import Link from "next/link";
import { TOPICS, LESSON_COUNT } from "@/lib/dsa/topics";
import { HiveMap } from "@/components/dsa/sections/HiveMap";
import { constructMetadata, sitePath } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Learn DSA — free data structures & algorithms course",
  description:
    "A free, hands-on DSA course: every chapter states a problem, explains the idea, lets you step through a live diagram, and ends with a practice board in C++, C, Python, Java, JavaScript or Rust.",
  canonicalUrl: sitePath("/dsa"),
});

export default function DsaHome() {
  return (
    <main className="core">
      <header className="hud">
        <p className="hud-rail">
          <span>Learn DSA</span>
          <span className="hud-dot" />
          <span>Free course</span>
          <span className="hud-dot" />
          <span>Six languages</span>
        </p>
        <p className="hud-rail hud-rail-end">
          <span>{TOPICS.length} chapters</span>
          <span className="live-pip" />
          <span>{LESSON_COUNT} lessons</span>
        </p>
      </header>

      <section className="hero-core">
        <p className="signal">The lesson map</p>
        <h1>DSA from Day 1</h1>
        <p className="lede">
          Start with <strong>What is DSA</strong> for the whole syllabus. Then
          work down the map. Every chapter opens with a problem, works through
          how the idea solves it, gives you a diagram you step through move by
          move, and ends with a box where you write the code yourself.
        </p>
        <p className="next-row">
          <Link href="/dsa/learn/intro" className="back-map back-map-primary">
            Start with the syllabus
          </Link>
          <Link href="/dsa/learn/language" className="back-map">
            New to the language? Start here
          </Link>
          <Link href="/dsa/profile" className="back-map">
            Your progress
          </Link>
        </p>
      </section>

      <HiveMap />

      <footer className="core-foot">
        Work down the map in order — each chapter assumes the ones above it.
        Skip anything marked hard on your first pass. Sign in and every practice
        board you pass fills in a square on your calendar.
      </footer>
    </main>
  );
}
