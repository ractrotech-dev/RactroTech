import Link from "next/link";
import { LangPicker } from "@/components/dsa/lang/LangPicker";
import { QUESTIONS, labelFor } from "@/lib/dsa/onboarding";
import { translationCoverage } from "@/lib/dsa/lessons/library";
import { LANGS, LANG_INFO, langOr } from "@/lib/dsa/lang";
import type { Profile } from "@/lib/dsa/supabase/types";

export function SetupCard({ profile }: { profile: Profile }) {
  const values: Record<string, string | null> = {
    education: profile.education,
    motivation: profile.motivation,
    lang: profile.lang,
    skill_level: profile.skill_level,
    goal_per_day: profile.goal_per_day ? String(profile.goal_per_day) : null,
  };

  const answered = QUESTIONS.filter((q) => values[q.id]).length;
  const { total, counts } = translationCoverage();

  return (
    <article className="lesson-card">
      <p className="signal">Your setup</p>
      <h2>How the course is set for you</h2>
      <p>
        {answered === QUESTIONS.length
          ? "All five answered. Change any of them whenever you like — nothing you have already solved is affected."
          : `${answered} of ${QUESTIONS.length} answered. The rest fall back to sensible defaults.`}
      </p>

      <dl className="setup-list">
        {QUESTIONS.map((q) => (
          <div key={q.id}>
            <dt>{q.short}</dt>
            <dd data-set={Boolean(values[q.id])}>
              {labelFor(q.id, values[q.id]) ?? "not set"}
            </dd>
          </div>
        ))}
      </dl>

      <p className="explain-label">How much is written in each language</p>
      <p className="setup-hint">
        C++ is the original and is complete. The others are being translated
        chapter by chapter — anything not done yet shows the C++ and says so,
        rather than pretending.
      </p>
      <div className="cover-list">
        {LANGS.map((id) => {
          const done = id === "cpp" ? total : (counts[id] ?? 0);
          const pct = Math.round((done / total) * 100);
          return (
            <div className="cover-row" key={id} data-you={langOr(profile.lang) === id}>
              <span className="cover-name">{LANG_INFO[id].label}</span>
              <span className="cover-bar" aria-hidden="true">
                <span className="cover-fill" style={{ width: `${pct}%` }} />
              </span>
              <span className="cover-count">
                {done}/{total}
              </span>
            </div>
          );
        })}
      </div>

      <p className="explain-label">Switch language any time</p>
      <p className="setup-hint">
        This changes every example, solution and practice board straight away,
        here and on every lesson.
      </p>
      <LangPicker />

      <p className="next-row">
        <Link href="/dsa/welcome?edit=1" className="back-map">
          Answer the questions again
        </Link>
      </p>
    </article>
  );
}
