// The languages a learner can take the course in.
//
// C++ is the base: every lesson is authored in it, and anything not yet
// translated falls back to it *visibly* rather than pretending. See
// LessonSection.alt in lib/lessons/types.ts for how a translation is layered on.

export const LANGS = ["cpp", "c", "python", "java", "javascript", "rust"] as const;

export type Lang = (typeof LANGS)[number];

export type LangInfo = {
  id: Lang;
  /** What the picker shows. */
  label: string;
  /** Two or three characters, for the tab strip. */
  short: string;
  /** How the line-comment starts — the grader needs this to strip comments. */
  comment: "//" | "#";
  /** One line on who tends to pick it, shown during onboarding. */
  note: string;
};

export const LANG_INFO: Record<Lang, LangInfo> = {
  cpp: {
    id: "cpp",
    label: "C++",
    short: "C++",
    comment: "//",
    note: "The default here. Fast, and what most competitive programming and Indian university courses use.",
  },
  c: {
    id: "c",
    label: "C",
    short: "C",
    comment: "//",
    note: "Closest to the machine. No vectors or strings to lean on, so you build more yourself.",
  },
  python: {
    id: "python",
    label: "Python",
    short: "Py",
    comment: "#",
    note: "Shortest code by far, so the idea stays visible. Slower, which matters in timed contests.",
  },
  java: {
    id: "java",
    label: "Java",
    short: "Java",
    comment: "//",
    note: "Verbose, but what a lot of product-company interviews expect.",
  },
  javascript: {
    id: "javascript",
    label: "JavaScript",
    short: "JS",
    comment: "//",
    note: "Good if you came from web development. Watch out — every number is a float.",
  },
  rust: {
    id: "rust",
    label: "Rust",
    short: "Rs",
    comment: "//",
    note: "The compiler argues with you about memory until the code is right. Harder start, fewer bugs.",
  },
};

export const DEFAULT_LANG: Lang = "cpp";

export function isLang(value: unknown): value is Lang {
  return typeof value === "string" && (LANGS as readonly string[]).includes(value);
}

export function langOr(value: unknown, fallback: Lang = DEFAULT_LANG): Lang {
  return isLang(value) ? value : fallback;
}

/** Where the choice is kept for signed-out readers. */
export const LANG_STORAGE_KEY = "dsa.lang";
