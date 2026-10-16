"use client";

import { Prose } from "@/components/dsa/ui/Prose";
import { useState } from "react";
import { LANG_INFO, type Lang } from "@/lib/dsa/lang";
import type { Prediction } from "@/lib/dsa/lessons/types";

/**
 * Guess the output, then find out.
 *
 * This sits before the explanation on purpose. Committing to a wrong answer and
 * being shown why makes the correction stick; reading the right answer first
 * does almost nothing.
 */
export function Predict({ predict, lang }: { predict: Prediction; lang: Lang }) {
  const [picked, setPicked] = useState<number | null>(null);
  const right = picked !== null && picked === predict.answer;

  return (
    <section className="pred" aria-label="Predict the output">
      <header className="pred-top">
        <span>Guess first</span>
        <span>{LANG_INFO[lang].label}</span>
      </header>

      <pre className="pred-code">
        <code>{predict.code}</code>
      </pre>

      <p className="pred-ask">{predict.ask}</p>

      <div className="pred-choices">
        {predict.choices.map((c, i) => {
          const state =
            picked === null ? "open" : i === predict.answer ? "right" : i === picked ? "wrong" : "dim";
          return (
            <button
              type="button"
              key={c.text}
              className="pred-choice"
              data-state={state}
              disabled={picked !== null}
              onClick={() => setPicked(i)}
            >
              <code>{c.text}</code>
            </button>
          );
        })}
      </div>

      {picked !== null ? (
        <div className="pred-after">
          <p className="pred-verdict" data-ok={right}>
            {right ? "Right." : "Not that one."}
          </p>
          <p className="pred-why">
            <Prose text={predict.choices[predict.answer].why} />
          </p>
          {!right ? (
            <p className="pred-why pred-why-yours">
              <b>What you picked:</b>{" "}
              <Prose text={predict.choices[picked].why} />
            </p>
          ) : null}
          <button type="button" className="pred-again" onClick={() => setPicked(null)}>
            Try again
          </button>
        </div>
      ) : null}
    </section>
  );
}
