import type { TopicLesson } from "@/lib/dsa/lessons/types";
import { LANG_FUNDAMENTALS } from "@/lib/dsa/lang-course/fundamentals";
import { LANG_CONTROL_FLOW } from "@/lib/dsa/lang-course/control-flow";
import { LANG_FUNCTIONS } from "@/lib/dsa/lang-course/functions";
import { LANG_COLLECTIONS } from "@/lib/dsa/lang-course/collections";
import { LANG_STRUCTURES } from "@/lib/dsa/lang-course/structures";
import { LANG_ALGORITHMS } from "@/lib/dsa/lang-course/algorithms";
import { LANG_OOP } from "@/lib/dsa/lang-course/oop";
import { LANG_MEMORY } from "@/lib/dsa/lang-course/memory";
import { LANG_ERRORS } from "@/lib/dsa/lang-course/errors";
import { LANG_MODULES } from "@/lib/dsa/lang-course/modules";
import { LANG_GENERICS } from "@/lib/dsa/lang-course/generics";
import { LANG_FUNCTIONAL } from "@/lib/dsa/lang-course/functional";
import { LANG_CONCURRENCY } from "@/lib/dsa/lang-course/concurrency";
import { LANG_NETWORKING } from "@/lib/dsa/lang-course/networking";
import { LANG_DATABASES } from "@/lib/dsa/lang-course/databases";
import { LANG_ENGINEERING } from "@/lib/dsa/lang-course/engineering";
import { LANG_ARCHITECTURE } from "@/lib/dsa/lang-course/architecture";

/**
 * The language track.
 *
 * Separate from the DSA map on purpose. The DSA chapters teach an idea that is
 * the same in every language and only changes spelling; these teach how one
 * language actually behaves, and there the ideas themselves diverge — Rust has
 * no classes, Python has no pointers, JavaScript has no integers.
 */
export type TrackEntry = {
  id: string;
  n: number;
  title: string;
  blurb: string;
  band: "Core" | "Advanced";
  /** What this topic looks like in each language, where they differ most. */
  note: string;
  lesson?: TopicLesson;
};

export const TRACK: TrackEntry[] = [
  {
    id: "lang-fundamentals",
    n: 1,
    title: "Fundamentals",
    blurb: "Values, types, and boxes that hold them.",
    band: "Core",
    note: "27 + \"Ada\" is a compile error in three of these languages, a crash in one, and the string \"27Ada\" in two.",
    lesson: LANG_FUNDAMENTALS,
  },
  {
    id: "lang-control-flow",
    n: 2,
    title: "Control Flow",
    blurb: "Choosing a path, and repeating one.",
    band: "Core",
    note: "Python uses indentation where the others use braces; Rust's if is an expression that produces a value.",
    lesson: LANG_CONTROL_FLOW,
  },
  {
    id: "lang-functions",
    n: 3,
    title: "Functions",
    blurb: "Naming a piece of work, and what crosses the boundary.",
    band: "Core",
    note: "What a parameter actually receives — a copy, a reference, or ownership — differs completely across the six.",
    lesson: LANG_FUNCTIONS,
  },
  {
    id: "lang-collections",
    n: 4,
    title: "Arrays & Strings",
    blurb: "Many values under one name, and text as data.",
    band: "Core",
    note: "Fixed arrays in C, growable everywhere else. Rust's &str versus String has no equivalent elsewhere.",
    lesson: LANG_COLLECTIONS,
  },
  {
    id: "lang-data-structures",
    n: 5,
    title: "Data Structures",
    blurb: "The containers the language already gives you.",
    band: "Core",
    note: "Every language ships a list and a map. What they are called, and what they cost, is where they part.",
    lesson: LANG_STRUCTURES,
  },
  {
    id: "lang-algorithms",
    n: 6,
    title: "Algorithms",
    blurb: "Sorting and searching with what is built in.",
    band: "Core",
    note: "Whether the built-in sort is stable, and how you pass a comparator, differs in every one.",
    lesson: LANG_ALGORITHMS,
  },
  {
    id: "lang-oop",
    n: 7,
    title: "Objects & Types",
    blurb: "Bundling data with the things you do to it.",
    band: "Core",
    note: "Classes in four of them. Rust has structs and traits instead, and JavaScript's classes hide prototypes.",
    lesson: LANG_OOP,
  },
  {
    id: "lang-memory",
    n: 8,
    title: "Memory & References",
    blurb: "What a name really points at, and who cleans up.",
    band: "Core",
    note: "The topic that splits the six most sharply: manual in C, ownership in Rust, garbage-collected in the rest.",
    lesson: LANG_MEMORY,
  },
  {
    id: "lang-errors",
    n: 9,
    title: "Error Handling",
    blurb: "What happens when something goes wrong.",
    band: "Core",
    note: "Exceptions in four. Return codes in C. Result in Rust, which the compiler forces you to deal with.",
    lesson: LANG_ERRORS,
  },
  {
    id: "lang-modules",
    n: 10,
    title: "Files & Modules",
    blurb: "Splitting a program up, and reading from disk.",
    band: "Core",
    note: "Headers in C and C++, packages in Java, modules in Python and Rust, and whatever JavaScript is doing this year.",
    lesson: LANG_MODULES,
  },

  /* The advanced band is a roadmap, deliberately not built yet. These need the
   * core ten first, and several of them are subjects in their own right. */
  {
    id: "lang-generics",
    n: 11,
    title: "Generics & Type Systems",
    blurb: "Writing code once that works for many types.",
    band: "Advanced",
    note: "Templates, generics, traits and duck typing — four genuinely different answers to one problem.",
    lesson: LANG_GENERICS,
  },
  {
    id: "lang-functional",
    n: 12,
    title: "Functional Programming",
    blurb: "Functions as values, and leaving data alone.",
    band: "Advanced",
    note: "map, filter and fold exist everywhere. Closures capturing state is where the differences show.",
    lesson: LANG_FUNCTIONAL,
  },
  {
    id: "lang-concurrency",
    n: 13,
    title: "Concurrency",
    blurb: "More than one thing happening at once.",
    band: "Advanced",
    note: "Threads, async, Python's GIL, JavaScript's single loop, and Rust preventing data races at compile time.",
    lesson: LANG_CONCURRENCY,
  },
  {
    id: "lang-networking",
    n: 14,
    title: "Networking",
    blurb: "Talking to another machine.",
    band: "Advanced",
    note: "Sockets, HTTP clients, and what the standard library gives you before you reach for anything else.",
    lesson: LANG_NETWORKING,
  },
  {
    id: "lang-databases",
    n: 15,
    title: "Databases",
    blurb: "Storing data that outlives the program.",
    band: "Advanced",
    note: "Drivers, connections, and why building a query by joining strings is the classic security hole.",
    lesson: LANG_DATABASES,
  },
  {
    id: "lang-engineering",
    n: 16,
    title: "Software Engineering",
    blurb: "Tests, tooling, and code somebody else can read.",
    band: "Advanced",
    note: "The test runner, the formatter and the package manager each language expects you to use.",
    lesson: LANG_ENGINEERING,
  },
  {
    id: "lang-architecture",
    n: 17,
    title: "Architecture",
    blurb: "Structuring something bigger than one file.",
    band: "Advanced",
    note: "Where the language's own conventions end and general design begins.",
    lesson: LANG_ARCHITECTURE,
  },
];

const BY_ID = new Map(TRACK.map((t) => [t.id, t]));

export function getTrackEntry(id: string) {
  return BY_ID.get(id);
}

export const WRITTEN = TRACK.filter((t) => t.lesson);

export function trackNeighbours(id: string) {
  const built = TRACK.filter((t) => t.lesson);
  const at = built.findIndex((t) => t.id === id);
  return {
    prev: at > 0 ? built[at - 1] : undefined,
    next: at >= 0 && at < built.length - 1 ? built[at + 1] : undefined,
  };
}

export const TRACK_LESSON_COUNT = TRACK.reduce(
  (n, t) => n + (t.lesson?.sections.length ?? 0),
  0,
);
