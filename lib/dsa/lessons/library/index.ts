import type { TopicLesson } from "@/lib/dsa/lessons/types";
import { FUNDAMENTALS, MATHS, NUMBER_THEORY } from "@/lib/dsa/lessons/library/foundations";
import { ARRAY_STRING, PREFIX_SUM, SLIDING_WINDOW, TWO_POINTER } from "@/lib/dsa/lessons/library/sequences";
import { SEARCHING, SORTING } from "@/lib/dsa/lessons/library/searchsort";
import { BITS, HASHING, STRING_MATCHING, TRIE } from "@/lib/dsa/lessons/library/lookup";
import { DEQUE, LINKED_LIST, QUEUE, STACK } from "@/lib/dsa/lessons/library/linear";
import { BINARY_TREE, BST, HEAP, RANGE_QUERY } from "@/lib/dsa/lessons/library/trees";
import { BACKTRACKING, DP, GRAPH, GREEDY } from "@/lib/dsa/lessons/library/advanced";
import { withAlt } from "@/lib/dsa/lessons/i18n";
import { FUNDAMENTALS_ALT } from "@/lib/dsa/lessons/library/i18n/fundamentals";
import { MATHS_ALT } from "@/lib/dsa/lessons/library/i18n/maths";
import { ARRAY_STRING_ALT } from "@/lib/dsa/lessons/library/i18n/array-string";
import { SEARCHING_ALT } from "@/lib/dsa/lessons/library/i18n/searching";
import { SORTING_ALT } from "@/lib/dsa/lessons/library/i18n/sorting";
import { BITS_ALT } from "@/lib/dsa/lessons/library/i18n/bits";
import { HASHING_ALT } from "@/lib/dsa/lessons/library/i18n/hashing";
import { TWO_POINTER_ALT } from "@/lib/dsa/lessons/library/i18n/two-pointer";
import { SLIDING_WINDOW_ALT } from "@/lib/dsa/lessons/library/i18n/sliding-window";
import { PREFIX_SUM_ALT } from "@/lib/dsa/lessons/library/i18n/prefix-sum";
import { BACKTRACKING_ALT } from "@/lib/dsa/lessons/library/i18n/backtracking";
import { LINKED_LIST_ALT } from "@/lib/dsa/lessons/library/i18n/linked-list";
import { STACK_ALT } from "@/lib/dsa/lessons/library/i18n/stack";
import { QUEUE_ALT } from "@/lib/dsa/lessons/library/i18n/queue";
import { DEQUE_ALT } from "@/lib/dsa/lessons/library/i18n/deque";
import { BINARY_TREE_ALT, BST_ALT, HEAP_ALT } from "@/lib/dsa/lessons/library/i18n/trees";
import { GRAPH_ALT } from "@/lib/dsa/lessons/library/i18n/graph";
import { MAX_FLOW } from "@/lib/dsa/lessons/library/maxflow";
import { MAX_FLOW_ALT } from "@/lib/dsa/lessons/library/i18n/maxflow";
import {
  DP_ALT,
  GREEDY_ALT,
  NUMBER_THEORY_ALT,
  RANGE_QUERY_ALT,
  STRING_MATCHING_ALT,
  TRIE_ALT,
} from "@/lib/dsa/lessons/library/i18n/final";

/** Every chapter that has a full lesson written, in syllabus order. */
export const LESSONS: TopicLesson[] = [
  // Course order, and the order the map reads down the page. The four bands in
  // lib/topics.ts are contiguous runs of this list, so a chapter's number means
  // the same thing everywhere.

  // Start — the syntax and the two costs everything else is measured against.
  withAlt(FUNDAMENTALS, FUNDAMENTALS_ALT),
  withAlt(MATHS, MATHS_ALT),
  withAlt(ARRAY_STRING, ARRAY_STRING_ALT),
  withAlt(SEARCHING, SEARCHING_ALT),
  withAlt(SORTING, SORTING_ALT),

  // Sequences — the techniques that delete a nested loop over an array.
  withAlt(BITS, BITS_ALT),
  withAlt(HASHING, HASHING_ALT),
  withAlt(TWO_POINTER, TWO_POINTER_ALT),
  withAlt(SLIDING_WINDOW, SLIDING_WINDOW_ALT),
  withAlt(PREFIX_SUM, PREFIX_SUM_ALT),

  // Structures — things you build, rather than passes you make.
  withAlt(LINKED_LIST, LINKED_LIST_ALT),
  withAlt(STACK, STACK_ALT),
  withAlt(QUEUE, QUEUE_ALT),
  withAlt(DEQUE, DEQUE_ALT),
  withAlt(BINARY_TREE, BINARY_TREE_ALT),
  withAlt(BST, BST_ALT),
  withAlt(HEAP, HEAP_ALT),
  withAlt(TRIE, TRIE_ALT),

  // Harder — everything that needs the structures above to already be automatic.
  withAlt(BACKTRACKING, BACKTRACKING_ALT),
  withAlt(GRAPH, GRAPH_ALT),
  withAlt(MAX_FLOW, MAX_FLOW_ALT),
  withAlt(GREEDY, GREEDY_ALT),
  withAlt(DP, DP_ALT),
  withAlt(NUMBER_THEORY, NUMBER_THEORY_ALT),
  withAlt(STRING_MATCHING, STRING_MATCHING_ALT),
  withAlt(RANGE_QUERY, RANGE_QUERY_ALT),
];

const BY_ID = new Map(LESSONS.map((lesson) => [lesson.id, lesson]));

export function getLesson(id: string): TopicLesson | undefined {
  return BY_ID.get(id);
}

export function hasLesson(id: string): boolean {
  return BY_ID.has(id);
}

/** Previous and next chapter, so a reader can move without going back to the map. */
export function neighbours(id: string) {
  const at = LESSONS.findIndex((lesson) => lesson.id === id);
  return {
    index: at,
    prev: at > 0 ? LESSONS[at - 1] : undefined,
    next: at >= 0 && at < LESSONS.length - 1 ? LESSONS[at + 1] : undefined,
  };
}

/** How much of the library exists in each language, for the honesty badge. */
export function translationCoverage() {
  const total = TOTAL_SECTIONS;
  const counts: Record<string, number> = {};
  for (const lesson of LESSONS) {
    for (const section of lesson.sections) {
      for (const lang of Object.keys(section.alt ?? {})) {
        counts[lang] = (counts[lang] ?? 0) + 1;
      }
    }
  }
  return { total, counts };
}

/** Total sections across the whole library — used by the progress tracker. */
export const TOTAL_SECTIONS = LESSONS.reduce((sum, lesson) => sum + lesson.sections.length, 0);
