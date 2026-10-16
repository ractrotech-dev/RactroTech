import Link from "next/link";
import { SYLLABUS } from "@/lib/dsa/syllabus";
import { getLesson, hasLesson } from "@/lib/dsa/lessons/library";

export function SyllabusBoard() {
  return (
    <div className="syl">
      {SYLLABUS.map((chapter) => {
        const taught = hasLesson(chapter.id);
        const lesson = getLesson(chapter.id);
        const count = chapter.buckets.reduce((n, b) => n + b.items.length, 0);

        return (
          <details className="syl-chapter" key={chapter.id} data-taught={taught}>
            <summary>
              <span className="syl-name">{chapter.title}</span>
              <span className="syl-meta">
                {taught ? `${lesson!.sections.length} lessons` : "reference"} ·{" "}
                {count} problems
              </span>
            </summary>

            <div className="syl-body">
              {taught ? (
                <p className="syl-lede">
                  {lesson!.tagline}{" "}
                  <Link href={`/dsa/learn/topic/${chapter.id}`} className="syl-open">
                    Open the lesson →
                  </Link>
                </p>
              ) : (
                <p className="syl-lede syl-lede-quiet">
                  A recap of everything above. Use the chapters themselves to
                  learn; come back here to check what you have covered.
                </p>
              )}

              {chapter.buckets.map((bucket) => (
                <section key={bucket.label}>
                  <h3>{bucket.label}</h3>
                  <ul>
                    {bucket.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </details>
        );
      })}
    </div>
  );
}
