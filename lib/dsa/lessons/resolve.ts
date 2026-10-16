import type { Challenge, CodeNote, LessonSection, Prediction } from "@/lib/dsa/lessons/types";
import type { Viz } from "@/lib/dsa/viz/types";
import type { Lang } from "@/lib/dsa/lang";

export type ResolvedSection = {
  hook: string;
  body: string[];
  /** Set when this language does not have the feature the section teaches. */
  insteadOf?: string;
  predict?: Prediction;
  example?: string;
  notes?: CodeNote[];
  challenge: Challenge;
  viz?: Viz;
  /** False when this language has no translation yet and C++ is being shown. */
  translated: boolean;
};

/**
 * Picks the code for one language, falling back to C++.
 *
 * The fallback is reported rather than hidden — the UI shows a badge, because
 * quietly handing a Python learner C++ is worse than telling them.
 */
export function resolveSection(section: LessonSection, lang: Lang): ResolvedSection {
  const base: ResolvedSection = {
    hook: section.hook,
    body: section.body,
    predict: section.predict,
    example: section.example,
    notes: section.notes,
    challenge: section.challenge,
    viz: section.viz,
    translated: true,
  };

  if (lang === "cpp") return base;

  const alt = section.alt?.[lang];
  if (!alt) return { ...base, translated: false };

  return {
    hook: alt.hook ?? section.hook,
    body: alt.body ?? section.body,
    insteadOf: alt.insteadOf,
    predict: alt.predict ?? section.predict,
    example: alt.example ?? section.example,
    notes: alt.notes ?? section.notes,
    challenge: {
      prompt: alt.prompt ?? section.challenge.prompt,
      starter: alt.starter ?? section.challenge.starter,
      solution: alt.solution ?? section.challenge.solution,
      rules: alt.rules ?? section.challenge.rules,
    },
    viz:
      section.viz && alt.vizCode
        ? { ...section.viz, code: alt.vizCode }
        : section.viz,
    translated: true,
  };
}

/** Which languages a section has been written in. */
export function translatedLangs(section: LessonSection): Lang[] {
  return ["cpp", ...Object.keys(section.alt ?? {})] as Lang[];
}
