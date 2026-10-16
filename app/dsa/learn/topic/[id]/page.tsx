import { Prose } from "@/components/dsa/ui/Prose";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { constructMetadata, sitePath } from "@/lib/seo";
import { LessonBody } from "@/components/dsa/sections/LessonBody";
import { TopicIntro } from "@/components/dsa/sections/TopicIntro";
import { VisitRecorder } from "@/components/dsa/profile/VisitRecorder";
import { LangPicker } from "@/components/dsa/lang/LangPicker";
import { getLesson, LESSONS, neighbours } from "@/lib/dsa/lessons/library";
import { SYLLABUS } from "@/lib/dsa/syllabus";

export function generateStaticParams() {
  return LESSONS.map((lesson) => ({ id: lesson.id }));
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
  const lesson = getLesson(id);
  if (!lesson) return constructMetadata({ title: "Chapter not found", noIndex: true });
  return constructMetadata({
    title: `${lesson.title} — Learn DSA`,
    description: lesson.tagline,
    canonicalUrl: sitePath(`/dsa/learn/topic/${lesson.id}`),
  });
}

export default function TopicPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const lesson = getLesson(id);
  if (!lesson) notFound();

  const { index, prev, next } = neighbours(id);
  const chapter = SYLLABUS.find((c) => c.id === id);

  return (
    <main className="core lesson lesson-wide">
      <header className="hud">
        <p className="hud-rail">
          <span>Chapter {String(index + 1).padStart(2, "0")}</span>
          <span className="hud-dot" />
          <span>{lesson.title}</span>
        </p>
      </header>

      <section className="hero-core lesson-hero">
        <p className="signal">
          Chapter {index + 1} of {LESSONS.length}
        </p>
        <h1>{lesson.title}</h1>
        <p className="lede">{lesson.tagline}</p>
        <LangPicker />
      </section>

      <VisitRecorder />

      <TopicIntro lesson={lesson} chapter={chapter} />

      <LessonBody sections={lesson.sections} topicId={lesson.id} />

      {lesson.traps?.length ? (
        <article className="lesson-card">
          <p className="signal">Before you move on</p>
          <h2>Mistakes that cost people interviews</h2>
          <ul className="trap-list">
            {lesson.traps.map((trap) => (
              <li key={trap}>
                <Prose text={trap} />
              </li>
            ))}
          </ul>
        </article>
      ) : null}

      <nav className="chapter-nav">
        {prev ? (
          <Link href={`/dsa/learn/topic/${prev.id}`} className="back-map">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/dsa/learn/topic/${next.id}`} className="back-map">
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
