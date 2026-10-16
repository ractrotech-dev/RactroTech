import { LANGS, LANG_INFO } from "@/lib/dsa/lang";

export type Choice = { value: string; label: string; note?: string };

export type Question = {
  id: "education" | "motivation" | "lang" | "skill_level" | "goal_per_day";
  /** Short label used on the profile page. */
  short: string;
  ask: string;
  why: string;
  choices: Choice[];
};

export const QUESTIONS: Question[] = [
  {
    id: "education",
    short: "Studying",
    ask: "Where are you right now?",
    why: "This only changes the wording of a few things — there is no wrong answer, and nothing is locked behind it.",
    choices: [
      { value: "school", label: "Still at school", note: "Class 11 or 12, or equivalent" },
      { value: "undergrad", label: "Undergraduate", note: "BTech, BE, BCA, BSc or similar" },
      { value: "postgrad", label: "Postgraduate", note: "MTech, MCA, MSc or similar" },
      { value: "working", label: "Already working", note: "In a job, learning alongside it" },
      { value: "self", label: "Self-taught", note: "No formal course — learning on your own" },
    ],
  },
  {
    id: "motivation",
    short: "Here for",
    ask: "Why are you learning DSA?",
    why: "The honest answer helps more than the impressive one. Preparing for interviews and enjoying puzzles need different habits.",
    choices: [
      { value: "placement", label: "Placements and interviews", note: "The most common reason, and a good one" },
      { value: "college", label: "A university course", note: "There is an exam coming" },
      { value: "cp", label: "Competitive programming", note: "Contests, ratings, speed" },
      { value: "engineer", label: "To be a better engineer", note: "Write code that holds up at scale" },
      { value: "curious", label: "Curiosity", note: "It looks interesting and you want to understand it" },
    ],
  },
  {
    id: "lang",
    short: "Writing in",
    ask: "Which language do you want to write in?",
    why: "Every example, solution and practice board switches to this. You can change it whenever you like, on any lesson.",
    choices: LANGS.map((id) => ({
      value: id,
      label: LANG_INFO[id].label,
      note: LANG_INFO[id].note,
    })),
  },
  {
    id: "skill_level",
    short: "Level",
    ask: "How much programming can you already do?",
    why: "This decides where we suggest you start. Aim low if you are unsure — the early chapters are quick if you already know them.",
    choices: [
      { value: "none", label: "I have never written code", note: "We start from what a variable is" },
      { value: "basics", label: "Loops and functions, roughly", note: "You can read simple code" },
      { value: "comfortable", label: "Comfortable coding, new to DSA", note: "You build things, but arrays and complexity are hazy" },
      { value: "some", label: "I have done some DSA", note: "You want the gaps filled and the harder chapters" },
    ],
  },
  {
    id: "goal_per_day",
    short: "Daily goal",
    ask: "How much can you do on most days?",
    why: "This sets the target your streak is measured against. Pick something you can hit on a bad day, not a good one.",
    choices: [
      { value: "1", label: "One lesson", note: "About ten minutes. Boring, and it works." },
      { value: "2", label: "Two lessons", note: "A steady half hour" },
      { value: "3", label: "Three lessons", note: "You have real time to give this" },
      { value: "5", label: "Five or more", note: "You are preparing for something soon" },
    ],
  },
];

/** Where to send someone once the questions are answered. */
export function suggestedStart(skill: string | null): { id: string; why: string } {
  switch (skill) {
    case "some":
      return {
        id: "searching",
        why: "You said you have done some DSA, so we are starting at Searching — binary search is where most gaps turn up.",
      };
    case "comfortable":
      return {
        id: "array-string",
        why: "You can already code, so we are skipping the syntax chapter and starting at Array & String.",
      };
    default:
      return {
        id: "fundamentals",
        why: "We are starting at Fundamentals — loops, decisions, functions, and what O(n) actually means.",
      };
  }
}

export function labelFor(questionId: Question["id"], value: string | null): string | null {
  if (!value) return null;
  const q = QUESTIONS.find((x) => x.id === questionId);
  return q?.choices.find((c) => c.value === value)?.label ?? value;
}
