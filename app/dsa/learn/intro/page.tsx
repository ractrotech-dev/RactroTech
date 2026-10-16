import Link from "next/link";
import { SyllabusBoard } from "@/components/dsa/sections/SyllabusBoard";
import { DSA_FACTS, LEARNING_ADVICE } from "@/lib/dsa/syllabus";
import { LESSONS, TOTAL_SECTIONS } from "@/lib/dsa/lessons/library";
import { constructMetadata, sitePath } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "What is DSA — the full syllabus",
  description: "A first-day introduction to Data Structures and Algorithms, and the full learning path.",
  canonicalUrl: sitePath("/dsa/learn/intro"),
});

export default function IntroLesson() {
  return (
    <main className="core lesson lesson-wide">
      <header className="hud">
        <p className="hud-rail">
          <span>Start here</span>
          <span className="hud-dot" />
          <span>What is DSA</span>
        </p>
      </header>

      <section className="hero-core lesson-hero">
        <p className="signal">DSA tutorial</p>
        <h1>What is DSA</h1>
        <p className="lede">
          DSA stands for Data Structures and Algorithms. Read this whole page
          first. Then go to Arrays and start writing C++.
        </p>
      </section>

      <article className="lesson-card">
        <p className="signal">The idea</p>
        <h2>Two words, two jobs</h2>
        <p>
          <strong>Data structures</strong> manage how data is stored and
          accessed — like how you keep things in boxes, lockers, or trees.
        </p>
        <p>
          <strong>Algorithms</strong> focus on processing this data — the steps
          you take, like searching, sorting, or walking a list.
        </p>
        <ul className="fact-list">
          {DSA_FACTS.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      </article>

      <article className="lesson-card">
        <p className="signal">How to learn</p>
        <h2>Step by step</h2>
        <p>{LEARNING_ADVICE}</p>
        <p>
          Below is the full DSA path — fundamentals, then arrays and strings,
          then searching, sorting, and everything after. Open a chapter and work
          down it. You do not need to finish it today.
        </p>
        <p>
          Every chapter follows the same four beats, in this order: a problem
          you cannot yet solve, then how the idea solves it, then a diagram you
          drive step by step, then a box where you write the C++ yourself. The
          last beat is the one that matters — reading code teaches you almost
          nothing.
        </p>
      </article>

      <article className="lesson-card">
        <p className="signal">Full map</p>
        <h2>The complete syllabus</h2>
        <p>
          Every chapter below has its own page. Each one works through the
          idea, shows a diagram you can step through one move at a time, gives
          you a C++ example with every token explained, and then hands you a
          practice board to write the code yourself.
        </p>
        <p>
          {LESSONS.length} chapters are written that way, holding{" "}
          {TOTAL_SECTIONS} lessons between them. Open a chapter title to see
          what is inside, then follow the link into the lesson.
        </p>
        <SyllabusBoard />
      </article>

      <p className="next-row">
        <Link href="/dsa/learn/topic/fundamentals" className="back-map">
          Start — Fundamentals
        </Link>
        <Link href="/dsa/learn/topic/array-string" className="back-map">
          Or jump to Arrays &amp; Strings
        </Link>
      </p>
    </main>
  );
}
