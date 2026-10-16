import Link from "next/link";
import { LESSONS } from "@/lib/dsa/lessons/library";

export function ChapterProgress({ done }: { done: Map<string, Set<string>> }) {
  return (
    <div className="chap-list">
      {LESSONS.map((lesson) => {
        const finished = done.get(lesson.id)?.size ?? 0;
        const total = lesson.sections.length;
        const pct = Math.round((finished / total) * 100);
        const state = finished === 0 ? "none" : finished === total ? "all" : "some";

        return (
          <Link
            href={`/dsa/learn/topic/${lesson.id}`}
            className="chap-row"
            data-state={state}
            key={lesson.id}
          >
            <span className="chap-name">{lesson.title}</span>
            <span className="chap-bar" aria-hidden="true">
              <span className="chap-fill" style={{ width: `${pct}%` }} />
            </span>
            <span className="chap-count">
              {finished}/{total}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
