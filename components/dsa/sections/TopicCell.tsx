import Link from "next/link";
import type { Topic } from "@/lib/dsa/topics";

export function TopicCell({ topic, i }: { topic: Topic; i: number }) {
  const inner = (
    <>
      <span className="cell-top">
        <span className="cell-seal">{String(topic.n).padStart(2, "0")}</span>
        <span className="cell-count">
          {topic.lessons} {topic.lessons === 1 ? "lesson" : "lessons"}
        </span>
      </span>

      <strong className="cell-title">{topic.title}</strong>
      <span className="cell-blurb">{topic.blurb}</span>

      <span className="cell-foot">{topic.open ? "Open" : "Sealed"}</span>
    </>
  );

  const style = { animationDelay: `${80 + i * 40}ms` };

  if (topic.open) {
    return (
      <Link href={`/dsa/learn/topic/${topic.id}`} className="cell is-live" style={style}>
        {inner}
      </Link>
    );
  }

  return (
    <div className="cell is-sealed" style={style} aria-disabled="true">
      {inner}
    </div>
  );
}
