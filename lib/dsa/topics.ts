import { LESSONS } from "@/lib/dsa/lessons/library";

export type Stage = "Start" | "Sequences" | "Structures" | "Harder";

export type Topic = {
  id: string;
  n: number;
  title: string;
  blurb: string;
  stage: Stage;
  open: boolean;
  /** How many lessons sit inside this cell. */
  lessons: number;
};

/** Which band of the map each chapter belongs to, and its one-line hook. */
const PLACEMENT: Record<string, { stage: Stage; blurb: string }> = {
  fundamentals: { stage: "Start", blurb: "Loops, decisions, functions, and what O(n) means." },
  maths: { stage: "Start", blurb: "Digits, primes, and a function that calls itself." },
  "array-string": { stage: "Start", blurb: "A row of boxes — and every walk over it." },
  searching: { stage: "Start", blurb: "Halve the problem with every look." },
  sorting: { stage: "Start", blurb: "Why n log n is the wall." },

  "two-pointer": { stage: "Sequences", blurb: "Two indexes delete a nested loop." },
  "sliding-window": { stage: "Sequences", blurb: "A stretch that grows and shrinks." },
  "prefix-sum": { stage: "Sequences", blurb: "Add once, answer any range free." },
  hashing: { stage: "Sequences", blurb: "Stop searching. Start remembering." },
  bits: { stage: "Sequences", blurb: "Numbers as rows of switches." },

  "linked-list": { stage: "Structures", blurb: "Boxes joined by arrows." },
  stack: { stage: "Structures", blurb: "Only the top is reachable." },
  queue: { stage: "Structures", blurb: "A fair line. The engine in BFS." },
  deque: { stage: "Structures", blurb: "Both ends open." },
  "binary-tree": { stage: "Structures", blurb: "Recursion with a shape." },
  bst: { stage: "Structures", blurb: "One rule makes it searchable." },
  heap: { stage: "Structures", blurb: "Always know the biggest." },
  trie: { stage: "Structures", blurb: "A tree of letters." },

  backtracking: { stage: "Harder", blurb: "Choose, recurse, un-choose." },
  graph: { stage: "Harder", blurb: "Dots, links, and shortest paths." },
  "max-flow": { stage: "Harder", blurb: "How much gets through, and the undo edge." },
  greedy: { stage: "Harder", blurb: "Take the best now — if you can prove it." },
  dp: { stage: "Harder", blurb: "Write it down so you never redo it." },
  "number-theory": { stage: "Harder", blurb: "Sieves, powers, and mod 10⁹+7." },
  "string-matching": { stage: "Harder", blurb: "Find a pattern without rewinding." },
  "range-query": { stage: "Harder", blurb: "When prefix sums stop working." },
};

export const STAGES: Stage[] = ["Start", "Sequences", "Structures", "Harder"];

const ORDER = new Map(STAGES.map((stage, i) => [stage, i]));

/** The map is generated from the lesson library, so it can never go stale. */
export const TOPICS: Topic[] = LESSONS.map((lesson, i) => {
  const place = PLACEMENT[lesson.id] ?? { stage: "Harder" as Stage, blurb: lesson.tagline };
  return {
    id: lesson.id,
    n: i + 1,
    title: lesson.title,
    blurb: place.blurb,
    stage: place.stage,
    open: true,
    lessons: lesson.sections.length,
  };
})
  .sort((a, b) => (ORDER.get(a.stage) ?? 0) - (ORDER.get(b.stage) ?? 0) || a.n - b.n)
  // Number them by where they appear, so the map reads 01 to 25 straight down
  // and matches the "Chapter N of 25" on each lesson page.
  .map((t, i) => ({ ...t, n: i + 1 }));

export const OPEN_COUNT = TOPICS.filter((t) => t.open).length;
export const LESSON_COUNT = TOPICS.reduce((n, t) => n + t.lessons, 0);
