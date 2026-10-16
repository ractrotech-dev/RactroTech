// Guards the two things that break quietly when a lesson is translated.
//
//   1. A grading rule that no longer accepts its own model solution. The
//      learner types the right answer and is told they are wrong.
//   2. A translated vizCode with fewer lines than the diagram highlights, so
//      the player lights up a line that is not there.
//
// Run with:  npx tsx scripts/check-lessons.ts

import { LESSONS } from "../../lib/dsa/lessons/library/index.ts";
import { WRITTEN } from "../../lib/dsa/lang-course/index.ts";
import { resolveSection } from "../../lib/dsa/lessons/resolve.ts";
import { grade } from "../../lib/dsa/lessons/checkCode.ts";
import { LANGS, type Lang } from "../../lib/dsa/lang.ts";

let failures = 0;
let checked = 0;

const fail = (where: string, why: string) => {
  failures++;
  console.log(`FAIL  ${where}\n      ${why}`);
};

// Both tracks go through the same checks.
const ALL = [...LESSONS, ...WRITTEN.map((t) => t.lesson!)];

for (const lesson of ALL) {
  for (const section of lesson.sections) {
    const langs: Lang[] = ["cpp", ...(Object.keys(section.alt ?? {}) as Lang[])];

    for (const lang of langs) {
      const where = `${lesson.id}/${section.id} [${lang}]`;
      const shown = resolveSection(section, lang);
      checked++;

      // 1. the model solution must satisfy its own rules
      const verdict = grade(shown.challenge.solution, shown.challenge.rules, lang);
      if (!verdict.ok) {
        fail(where, `the model solution is rejected by its own rules — "${verdict.message}"`);
      }

      // 2. the starter must NOT already pass, or the exercise is a no-op
      const starter = grade(shown.challenge.starter, shown.challenge.rules, lang);
      if (starter.ok) {
        fail(where, "the starter code already passes, so there is nothing to solve");
      }

      // 3. a prediction must point at a real choice, and every choice must
      //    explain itself — including the wrong ones, which is the whole point
      if (shown.predict) {
        const p = shown.predict;
        if (p.answer < 0 || p.answer >= p.choices.length) {
          fail(where, `prediction answer ${p.answer} is outside its ${p.choices.length} choices`);
        }
        if (p.choices.length < 2) {
          fail(where, "a prediction with fewer than two choices is not a choice");
        }
        const silent = p.choices.filter((c) => !c.why || c.why.length < 20);
        if (silent.length) {
          fail(where, `${silent.length} prediction choice(s) have no real explanation`);
        }
      }

      // 4. diagram line references must exist in the code being shown
      if (shown.viz?.code) {
        const lines = shown.viz.code.split("\n").length;
        const highest = Math.max(0, ...shown.viz.frames.map((f) => f.line ?? 0));
        if (highest > lines) {
          fail(where, `diagram highlights line ${highest} but the code has only ${lines}`);
        }

        // A translated vizCode has to stay LINE-PARALLEL with the C++ one.
        // Frames highlight by line number, so a translation that drops a line
        // in the MIDDLE points every later frame one line off — which still
        // renders, and teaches the wrong thing.
        //
        // Differing line counts are fine on their own: Python has no closing
        // brace, so its version is legitimately shorter at the end. What is
        // never fine is a frame landing on a blank line in one language and a
        // real statement in another. That is the signature of drift.
        if (lang !== "cpp") {
          const cppLines = section.viz?.code?.split("\n") ?? [];
          const trLines = shown.viz.code.split("\n");
          for (const frame of shown.viz.frames) {
            const at = frame.line;
            if (!at || at > cppLines.length || at > trLines.length) continue;
            const cppBlank = cppLines[at - 1].trim() === "";
            const trBlank = trLines[at - 1].trim() === "";
            if (cppBlank !== trBlank) {
              fail(
                where,
                `diagram line ${at} is ${trBlank ? "blank" : "code"} here but ${cppBlank ? "blank" : "code"} in C++ — the translation has drifted out of line`,
              );
              break;
            }
          }
        }
      }
    }

    // 4. a translation that forgot its grading rules would silently grade the
    //    learner's Python against C++ regexes
    for (const lang of LANGS) {
      if (lang === "cpp") continue;
      const alt = section.alt?.[lang];
      if (alt && (alt.solution || alt.starter) && !alt.rules) {
        fail(`${lesson.id}/${section.id} [${lang}]`, "has translated code but no rules of its own");
      }
    }
  }
}

console.log(
  `\n${checked} section-languages checked · ${failures ? `${failures} FAILED` : "all pass"}`,
);
process.exit(failures ? 1 : 0);
