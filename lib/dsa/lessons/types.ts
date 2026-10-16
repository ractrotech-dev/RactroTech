import type { GradeRules } from "@/lib/dsa/lessons/checkCode";
import type { Lang } from "@/lib/dsa/lang";
import type { Viz } from "@/lib/dsa/viz/types";

export type CodeNote = {
  token: string;
  meaning: string;
};

/**
 * Guess the output before you are shown it.
 *
 * Reading code teaches you far less than committing to an answer and finding
 * out you were wrong, so this comes BEFORE the explanation and the diagram.
 */
export type Prediction = {
  ask: string;
  code: string;
  choices: { text: string; why: string }[];
  /** Index into `choices`. */
  answer: number;
};

export type Challenge = {
  prompt: string;
  starter: string;
  rules: GradeRules;
  solution: string;
};

/**
 * One language's version of a section.
 *
 * For the DSA chapters only the code moves: the idea is the same whatever you
 * write it in, so `body` and `hook` are left alone and never duplicated.
 *
 * The language chapters are different. Rust has no classes, Python has no
 * pointers, JavaScript has no integers — there the ANGLE changes too, so `hook`
 * and `body` can be overridden, and `insteadOf` marks a topic that does not
 * exist in this language at all.
 *
 * `vizCode` must stay line-for-line parallel with the C++ original, because the
 * diagram's frames highlight lines by number. scripts/check-lessons enforces it.
 */
export type SectionCode = {
  /** Replaces the opening problem when the language frames it differently. */
  hook?: string;
  /** Replaces the explanation when the idea itself differs, not just the syntax. */
  body?: string[];
  /**
   * Set when the topic does not exist in this language. Names what the language
   * does instead, so the reader is told rather than shown something misleading.
   */
  insteadOf?: string;
  example?: string;
  notes?: CodeNote[];
  /** The prompt carries over unless a language needs it reworded. */
  starter?: string;
  solution?: string;
  /** Grading has to be rewritten per language — syntax differs. */
  rules?: GradeRules;
  prompt?: string;
  vizCode?: string;
  predict?: Prediction;
};

export type LessonSection = {
  id: string;
  kicker: string;
  title: string;
  /** The problem, asked before any explanation. */
  hook: string;
  /** Short plain-English paragraphs. */
  body: string[];
  values?: number[];
  /** Guess the output first. Shown before the explanation. */
  predict?: Prediction;
  /** An interactive, stepped diagram of the idea. */
  viz?: Viz;
  /** The C++ version — always present, and the fallback for every language. */
  example?: string;
  notes?: CodeNote[];
  challenge: Challenge;
  /** Per-language versions. A missing language falls back to C++, visibly. */
  alt?: Partial<Record<Exclude<Lang, "cpp">, SectionCode>>;
};

/**
 * A per-language introduction to the language itself.
 *
 * The DSA chapters do not need this — an idea is the same whatever you write it
 * in. The first topic of the language track does: someone opening it in Rust
 * needs to be told what Rust is, not what "a language" is in the abstract.
 */
export type LangIntro = {
  /** "What is Python", not "What it is". */
  heading: string;
  /** What the language is, and where it came from. */
  plain: string[];
  /** How your code actually gets run. Compiled, interpreted, or something else. */
  how: string[];
  /** What it is genuinely good at. */
  strengths: string[];
  /** What it costs you. Every language trades something away. */
  costs: string[];
  /** Real things built with it. */
  usedFor: string[];
};

export type TopicLesson = {
  /** Matches the chapter id in lib/syllabus.ts. */
  id: string;
  title: string;
  /** One line under the heading. */
  tagline: string;
  /** Why a beginner should care, in two or three sentences. */
  why: string;
  /** The definition, before any jargon. */
  plain: string[];
  /** Replaces `plain` with a proper introduction to the chosen language. */
  intro?: Partial<Record<Lang, LangIntro>>;
  /** What you must already know. */
  needs?: string[];
  /** The costs worth memorising for this topic. */
  costs?: { what: string; time: string; note: string }[];
  sections: LessonSection[];
  /** Mistakes that cost people interviews. */
  traps?: string[];
};
