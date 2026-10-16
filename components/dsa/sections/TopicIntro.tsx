"use client";

import { LangPicker } from "@/components/dsa/lang/LangPicker";
import { useLang } from "@/components/dsa/lang/LangProvider";
import { Prose } from "@/components/dsa/ui/Prose";
import { LANG_INFO } from "@/lib/dsa/lang";
import type { TopicLesson } from "@/lib/dsa/lessons/types";
import type { Chapter } from "@/lib/dsa/syllabus";

export function TopicIntro({
  lesson,
  chapter,
}: {
  lesson: TopicLesson;
  chapter?: Chapter;
}) {
  const { lang } = useLang();
  const intro = lesson.intro?.[lang];

  const problemCount =
    chapter?.buckets.reduce((sum, bucket) => sum + bucket.items.length, 0) ?? 0;

  return (
    <>
      {intro ? (
        <article className="lesson-card">
          <p className="signal">Start here</p>
          <h2>{intro.heading}</h2>
          {intro.plain.map((para) => (
            <p key={para}>
              <Prose text={para} />
            </p>
          ))}

          <p className="explain-label">How your code actually runs</p>
          {intro.how.map((para) => (
            <p key={para}>
              <Prose text={para} />
            </p>
          ))}

          <div className="tradeoff">
            <section>
              <h3>What it is good at</h3>
              <ul>
                {intro.strengths.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </section>
            <section data-cost="true">
              <h3>What it costs you</h3>
              <ul>
                {intro.costs.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </section>
          </div>

          <p className="explain-label">Built with {LANG_INFO[lang].label}</p>
          <ul className="used-for">
            {intro.usedFor.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>

          <p className="explain-label">Reading this in another language?</p>
          <p className="setup-hint">
            Everything below switches with it — the examples, the solutions, and
            the exercises that check your answer.
          </p>
          <LangPicker />
        </article>
      ) : (
        <article className="lesson-card">
          <p className="signal">Start here</p>
          <h2>What it is</h2>
          {lesson.plain.map((para) => (
            <p key={para}>
              <Prose text={para} />
            </p>
          ))}
        </article>
      )}

      <article className="lesson-card">
        <p className="signal">{intro ? "Why this topic" : "Start here"}</p>
        <h2>Why this matters</h2>
        <p>
          <Prose text={lesson.why} />
        </p>

        {lesson.needs?.length ? (
          <>
            <p className="explain-label">You should already know</p>
            <ul className="need-list">
              {lesson.needs.map((need) => (
                <li key={need}>{need}</li>
              ))}
            </ul>
          </>
        ) : null}
      </article>

      {lesson.costs?.length ? (
        <article className="lesson-card">
          <p className="signal">Numbers to keep</p>
          <h2>What each thing costs</h2>
          <p>
            These are the costs worth memorising for this chapter. Everything
            else you can work out from them.
          </p>
          <div className="cost-table">
            {lesson.costs.map((cost) => (
              <div className="cost-row" key={cost.what}>
                <span className="cost-what">{cost.what}</span>
                <span className="cost-time">{cost.time}</span>
                <span className="cost-note">{cost.note}</span>
              </div>
            ))}
          </div>
        </article>
      ) : null}

      {chapter && problemCount > 0 ? (
        <article className="lesson-card">
          <p className="signal">After the lesson</p>
          <h2>{problemCount} problems this chapter unlocks</h2>
          <p>
            Work through the sections below first. Then these become practice —
            each one is the same ideas asked a different way. Skip anything
            marked hard on your first pass.
          </p>
          <div className="syl-body syl-body-flat">
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
        </article>
      ) : null}
    </>
  );
}
