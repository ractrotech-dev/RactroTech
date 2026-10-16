"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { browserClient } from "@/lib/dsa/supabase/client";
import { useLang } from "@/components/dsa/lang/LangProvider";
import { QUESTIONS, suggestedStart } from "@/lib/dsa/onboarding";
import { langOr } from "@/lib/dsa/lang";
import { friendly } from "@/lib/dsa/supabase/errors";
import { MIGRATION_HINT, isMissingSchema } from "@/lib/dsa/supabase/schema";

type Answers = Record<string, string>;

export function Welcome({ userId, name }: { userId: string; name: string }) {
  const router = useRouter();
  const { setLang } = useLang();
  const [at, setAt] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const question = QUESTIONS[at];
  const chosen = answers[question.id];
  const last = at === QUESTIONS.length - 1;

  async function save(final: Answers, skipped: boolean) {
    const supabase = browserClient();
    if (!supabase) return;

    setBusy(true);
    setError(null);

    const { error: err } = await supabase.from("dsa_profiles").upsert({
      id: userId,
      education: final.education ?? null,
      motivation: final.motivation ?? null,
      lang: langOr(final.lang),
      skill_level: final.skill_level ?? null,
      goal_per_day: Number(final.goal_per_day ?? 1),
      onboarded_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (err) {
      setBusy(false);
      return setError(isMissingSchema(err) ? MIGRATION_HINT : friendly(err.message));
    }

    if (final.lang) setLang(langOr(final.lang));

    const start = suggestedStart(final.skill_level ?? null);
    router.push(skipped ? "/dsa/profile" : `/dsa/learn/topic/${start.id}`);
    router.refresh();
  }

  function choose(value: string) {
    const next = { ...answers, [question.id]: value };
    setAnswers(next);

    if (last) {
      void save(next, false);
      return;
    }
    // A beat, so the selection is visibly registered before the step moves.
    window.setTimeout(() => setAt((n) => n + 1), 180);
  }

  const start = suggestedStart(answers.skill_level ?? null);

  return (
    <div className="wel">
      <div className="wel-progress" aria-hidden="true">
        {QUESTIONS.map((q, i) => (
          <span key={q.id} className="wel-pip" data-state={i < at ? "done" : i === at ? "now" : "todo"} />
        ))}
      </div>

      <p className="wel-count">
        Question {at + 1} of {QUESTIONS.length}
        {at === 0 ? ` · Hello ${name}` : ""}
      </p>

      <h2 className="wel-ask">{question.ask}</h2>
      <p className="wel-why">{question.why}</p>

      <div className="wel-choices">
        {question.choices.map((choice) => (
          <button
            type="button"
            key={choice.value}
            className="wel-choice"
            data-on={chosen === choice.value}
            disabled={busy}
            onClick={() => choose(choice.value)}
          >
            <strong>{choice.label}</strong>
            {choice.note ? <span>{choice.note}</span> : null}
          </button>
        ))}
      </div>

      {error ? (
        <p className="auth-msg" data-ok="false">
          {error}
        </p>
      ) : null}

      <div className="wel-foot">
        {at > 0 ? (
          <button type="button" className="auth-link" disabled={busy} onClick={() => setAt((n) => n - 1)}>
            ← Back
          </button>
        ) : (
          <span />
        )}

        <button
          type="button"
          className="auth-link"
          disabled={busy}
          onClick={() => void save(answers, true)}
        >
          {busy ? "Saving…" : "Skip these — I will set them later"}
        </button>
      </div>

      {last && !busy ? (
        <p className="wel-next">{start.why}</p>
      ) : null}
    </div>
  );
}
