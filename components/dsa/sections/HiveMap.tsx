import { STAGES, TOPICS } from "@/lib/dsa/topics";
import { TopicCell } from "@/components/dsa/sections/TopicCell";

export function HiveMap() {
  return (
    <div className="hive">
      <svg className="hive-vein" viewBox="0 0 100 800" preserveAspectRatio="none" aria-hidden="true">
        <path d="M50 0 C 20 80, 80 160, 50 240 S 20 400, 50 480 S 80 640, 50 800" />
      </svg>

      {STAGES.map((stage) => {
        const cells = TOPICS.filter((t) => t.stage === stage);
        return (
          <section className="hive-stage" key={stage}>
            <header className="stage-head">
              <span className="stage-glyph" aria-hidden="true" />
              <h2>{stage}</h2>
              <span className="stage-count">{cells.length} chapters</span>
            </header>
            <div className="honeycomb">
              {cells.map((topic, i) => (
                <TopicCell key={topic.id} topic={topic} i={i} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
