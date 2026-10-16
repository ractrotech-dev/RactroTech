"use client";

import { CodeBlock } from "@/components/dsa/ui/CodeBlock";
import { Prose } from "@/components/dsa/ui/Prose";
import { CodePad } from "@/components/dsa/sections/CodePad";
import { LockerRow } from "@/components/dsa/sections/LockerRow";
import { StepScope } from "@/components/dsa/viz/StepScope";
import { LangPicker } from "@/components/dsa/lang/LangPicker";
import { Predict } from "@/components/dsa/sections/Predict";
import { useLang } from "@/components/dsa/lang/LangProvider";
import { resolveSection } from "@/lib/dsa/lessons/resolve";
import { LANG_INFO } from "@/lib/dsa/lang";
import type { LessonSection } from "@/lib/dsa/lessons/types";

export function LessonBody({
  sections,
  topicId,
}: {
  sections: LessonSection[];
  topicId?: string;
}) {
  const { lang } = useLang();

  return (
    <div className="lesson-flow">
      {sections.map((section) => {
        const shown = resolveSection(section, lang);

        return (
          <article className="lesson-card" key={section.id} id={section.id}>
            <p className="signal">{section.kicker}</p>
            <h2>{section.title}</h2>

            <div className="probe">
              <p className="probe-label">Question first</p>
              <p><Prose text={shown.hook} /></p>
            </div>

            {shown.insteadOf ? (
              <p className="lang-swap">
                <b>{LANG_INFO[lang].label} does not have this.</b>{" "}
                <Prose text={shown.insteadOf} />
              </p>
            ) : null}

            {shown.predict ? (
              <>
                <p className="explain-label">Before you read on</p>
                <Predict predict={shown.predict} lang={lang} />
              </>
            ) : null}

            <p className="explain-label">Now the whole idea</p>
            {shown.body.map((para) => (
              <p key={para}>
                <Prose text={para} />
              </p>
            ))}

            {section.values ? <LockerRow values={section.values} /> : null}

            {shown.viz ? (
              <>
                <p className="explain-label">Watch it run</p>
                <StepScope viz={shown.viz} />
              </>
            ) : null}

            {!shown.translated ? (
              <p className="lang-fallback">
                This lesson has not been written in {LANG_INFO[lang].label} yet,
                so the code below is C++. The idea above is the same whatever you
                write it in.
              </p>
            ) : null}

            {shown.example ? (
              <>
                <div className="explain-row">
                  <p className="explain-label">Example</p>
                  <LangPicker compact />
                </div>
                <CodeBlock code={shown.example} notes={shown.notes} lang={lang} />
              </>
            ) : null}

            <p className="explain-label">Your move</p>
            <CodePad
              challenge={shown.challenge}
              topicId={topicId}
              sectionId={section.id}
              lang={lang}
            />
          </article>
        );
      })}
    </div>
  );
}
