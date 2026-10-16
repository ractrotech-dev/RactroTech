import { Prose } from "@/components/dsa/ui/Prose";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { constructMetadata, sitePath } from "@/lib/seo";
import { LessonBody } from "@/components/dsa/sections/LessonBody";
import { TopicIntro } from "@/components/dsa/sections/TopicIntro";
import { VisitRecorder } from "@/components/dsa/profile/VisitRecorder";
import { LangPicker } from "@/components/dsa/lang/LangPicker";
import { WRITTEN, getTrackEntry, trackNeighbours } from "@/lib/dsa/lang-course";

export function generateStaticParams() {
  return WRITTEN.map((t) => ({ id: t.id }));
}

// Every id is known at build time, so anything else is a real 404 rather than a page
// that renders "not found" inside a 200.
export const dynamicParams = false;

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const { id } = params;
  const entry = getTrackEntry(id);
  if (!entry?.lesson) return constructMetadata({ title: "Topic not found", noIndex: true });
  return constructMetadata({
    title: `${entry.title} — Learn the language`,
    description: entry.lesson.tagline,
    canonicalUrl: sitePath(`/dsa/learn/language/${entry.id}`),
  });
}

export default function LanguageTopic({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const entry = getTrackEntry(id);
  if (!entry?.lesson) notFound();

  const { prev, next } = trackNeighbours(id);

  return (
    <main className="core lesson lesson-wide">
      <header className="hud">
        <p className="hud-rail">
          <span>Language</span>
          <span className="hud-dot" />
          <span>Topic {String(entry.n).padStart(2, "0")}</span>
          <span className="hud-dot" />
          <span>{entry.title}</span>
        </p>
      </header>

      <section className="hero-core lesson-hero">
        <p className="signal">Topic {entry.n} of 10</p>
        <h1>{entry.lesson.title}</h1>
        <p className="lede">{entry.lesson.tagline}</p>
        <LangPicker />
      </section>

      <VisitRecorder />

      <TopicIntro lesson={entry.lesson} />

      <LessonBody sections={entry.lesson.sections} topicId={entry.lesson.id} />

      {entry.lesson.traps?.length ? (
        <article className="lesson-card">
          <p className="signal">Before you move on</p>
          <h2>Mistakes that cost people hours</h2>
          <ul className="trap-list">
            {entry.lesson.traps.map((t) => (
              <li key={t}>
                <Prose text={t} />
              </li>
            ))}
          </ul>
        </article>
      ) : null}

      <nav className="chapter-nav">
        {prev ? (
          <Link href={`/dsa/learn/language/${prev.id}`} className="back-map">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/dsa/learn/language/${next.id}`} className="back-map">
            {next.title} →
          </Link>
        ) : (
          <Link href="/dsa/learn/intro" className="back-map">
            On to the DSA syllabus →
          </Link>
        )}
      </nav>
    </main>
  );
}
