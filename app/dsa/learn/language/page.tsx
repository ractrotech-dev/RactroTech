import Link from "next/link";
import { LangPicker } from "@/components/dsa/lang/LangPicker";
import { TRACK, TRACK_LESSON_COUNT, WRITTEN } from "@/lib/dsa/lang-course";
import { constructMetadata, sitePath } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Learn the language — before the algorithms",
  description:
    "How your language actually works: values, control flow, functions, collections, objects, memory and errors.",
  canonicalUrl: sitePath("/dsa/learn/language"),
});

const BANDS = ["Core", "Advanced"] as const;

const BAND_NOTE: Record<string, string> = {
  Core: "Work down these in order. Each one assumes the ones above it.",
  Advanced:
    "Every one of these assumes the ten above. They are less about syntax and more about what your language hands you before you reach for a dependency — which turns out to vary enormously.",
};

export default function LanguageMap() {
  return (
    <main className="core lesson lesson-wide">
      <header className="hud">
        <p className="hud-rail">
          <span>Language track</span>
          <span className="hud-dot" />
          <span>{WRITTEN.length} of {TRACK.length} written</span>
          <span className="hud-dot" />
          <span>{TRACK_LESSON_COUNT} lessons</span>
        </p>
      </header>

      <section className="hero-core lesson-hero">
        <p className="signal">Before the algorithms</p>
        <h1>Learn the language</h1>
        <p className="lede">
          The DSA chapters teach ideas that are the same whatever you write them
          in. These teach the language itself — and here the six genuinely
          disagree. Pick yours and the whole track changes with it.
        </p>
        <LangPicker />
      </section>

      <div className="hive">
        {BANDS.map((band) => {
          const rows = TRACK.filter((t) => t.band === band);
          return (
            <section className="hive-stage" key={band}>
              <header className="stage-head">
                <span className="stage-glyph" aria-hidden="true" />
                <h2>{band}</h2>
                <span className="stage-count">{rows.length} topics</span>
              </header>

              <p className="band-note">{BAND_NOTE[band]}</p>

              <div className="honeycomb">
                {rows.map((t, i) => {
                  const inner = (
                    <>
                      <span className="cell-top">
                        <span className="cell-seal">{String(t.n).padStart(2, "0")}</span>
                        <span className="cell-count">
                          {t.lesson ? `${t.lesson.sections.length} lessons` : "planned"}
                        </span>
                      </span>
                      <strong className="cell-title">{t.title}</strong>
                      <span className="cell-blurb">{t.blurb}</span>
                      <span className="cell-note">{t.note}</span>
                      <span className="cell-foot">{t.lesson ? "Open" : "Not written yet"}</span>
                    </>
                  );
                  const style = { animationDelay: `${80 + i * 40}ms` };

                  return t.lesson ? (
                    <Link
                      href={`/dsa/learn/language/${t.id}`}
                      className="cell is-live"
                      style={style}
                      key={t.id}
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div className="cell is-sealed" style={style} aria-disabled="true" key={t.id}>
                      {inner}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <footer className="core-foot">
        Once the language stops getting in your way, go to the{" "}
        <Link href="/dsa/learn/intro" className="foot-link">
          DSA syllabus
        </Link>{" "}
        — that is where the actual problem solving starts.
      </footer>
    </main>
  );
}
