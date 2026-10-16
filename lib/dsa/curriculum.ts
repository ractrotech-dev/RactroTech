// The syllabus, kept as data so pages can be generated from it rather than
// hand-written. Everything here is indexed by how a problem *presents itself*,
// not by which data structure it happens to use.

/* ---------------------------------------------------------------- budget -- */

/** Roughly what a judge gets through in one second. */
export const OPS_BUDGET = 1e8;

export type Verdict = "fits" | "tight" | "over";

export type Growth = {
  label: string;
  /** Operations performed for an input of size n. */
  ops: (n: number) => number;
  /** What you are allowed to write once this row goes green. */
  buys: string;
};

const factorial = (n: number) => {
  let total = 1;
  for (let i = 2; i <= n; i++) {
    total *= i;
    if (!Number.isFinite(total)) return Infinity;
  }
  return total;
};

/** Ordered fastest-growing first, so the viable region reads as a staircase. */
export const GROWTHS: Growth[] = [
  { label: "O(n!)", ops: factorial, buys: "every ordering — brute force only" },
  { label: "O(2ⁿ)", ops: (n) => 2 ** n, buys: "every subset — bitmask, backtracking" },
  { label: "O(n³)", ops: (n) => n ** 3, buys: "interval DP, Floyd–Warshall" },
  { label: "O(n²)", ops: (n) => n ** 2, buys: "every pair — two nested loops, grid DP" },
  { label: "O(n√n)", ops: (n) => n * Math.sqrt(n), buys: "Mo's algorithm, sqrt decomposition" },
  { label: "O(n log n)", ops: (n) => n * Math.log2(n), buys: "sorting, heaps, one binary search per item" },
  { label: "O(n)", ops: (n) => n, buys: "a single pass that remembers something" },
  { label: "O(log n)", ops: (n) => Math.log2(n), buys: "binary search, fast exponentiation" },
];

/** Input sizes worth reasoning about; the ones that actually appear in limits. */
export const SIZES = [10, 20, 50, 500, 5_000, 100_000, 1_000_000, 1_000_000_000];

export function verdictFor(ops: number): Verdict {
  if (ops <= OPS_BUDGET / 10) return "fits";
  if (ops <= OPS_BUDGET) return "tight";
  return "over";
}

const SUPERSCRIPT = "⁰¹²³⁴⁵⁶⁷⁸⁹";

/** Compact magnitude, e.g. 2.5·10⁷ — the way a limit is discussed out loud. */
export function formatOps(ops: number): string {
  if (!Number.isFinite(ops)) return "∞";
  if (ops < 1000) return String(Math.round(ops));
  const exponent = Math.floor(Math.log10(ops));
  const mantissa = ops / 10 ** exponent;
  const digits = String(exponent)
    .split("")
    .map((d) => SUPERSCRIPT[Number(d)])
    .join("");
  const lead = mantissa < 1.15 ? "" : `${mantissa.toFixed(1).replace(/\.0$/, "")}·`;
  return `${lead}10${digits}`;
}

/** Compact input size for a column heading. */
export function formatN(n: number): string {
  return n >= 1000 ? formatOps(n) : String(n);
}

/* ---------------------------------------------------------------- method -- */

export const METHOD = [
  {
    step: "Set the budget",
    body: "Read the constraint before the statement. n ≤ 20 means exponential is allowed. n ≤ 10⁵ means you get one log factor and no more. The limit has already picked your complexity class — the rest is finding an algorithm that fits inside it.",
  },
  {
    step: "Find the tell",
    body: "Problems are rewritten, not invented. “Longest subarray such that…”, “next greater element”, “minimise the maximum” — each phrase maps to a technique that has solved it a hundred times. Match the phrase first, then adapt.",
  },
  {
    step: "Name the invariant",
    body: "Say out loud what stays true after every iteration: the window always satisfies the condition, the stack is always decreasing, dp[i] is always the best answer ending at i. If you cannot state it, you are guessing, and the edge cases will find you.",
  },
  {
    step: "Break it before the judge does",
    body: "Empty input, one element, all elements equal, all negative, the maximum value squared. Most wrong answers are not wrong algorithms — they are correct algorithms that overflowed an int or lost the last element.",
  },
];

/* -------------------------------------------------------------- patterns -- */

export type Pattern = {
  /** The phrase in the statement that gives the technique away. */
  tell: string;
  name: string;
  cost: string;
  /** The C++ that carries it. */
  tool?: string;
};

export type Family = {
  id: string;
  title: string;
  premise: string;
  patterns: Pattern[];
};

export const FAMILIES: Family[] = [
  {
    id: "scan",
    title: "Scanning a sequence",
    premise:
      "Almost every nested loop over an array is a single pass that has not been found yet. The trick is deciding what the pass has to remember.",
    patterns: [
      { tell: "two numbers that add up to k", name: "Two pointers, opposite ends", cost: "O(n)", tool: "sort first" },
      { tell: "longest / shortest subarray such that…", name: "Sliding window, variable size", cost: "O(n)" },
      { tell: "every subarray of size k", name: "Sliding window, fixed size", cost: "O(n)" },
      { tell: "sum of elements from i to j", name: "Prefix sums", cost: "O(1) per query" },
      { tell: "how many subarrays sum to exactly k", name: "Prefix sums + hash map", cost: "O(n)", tool: "unordered_map" },
      { tell: "add v to every index in [l, r], many times", name: "Difference array", cost: "O(1) per update" },
      { tell: "maximum subarray sum", name: "Kadane's algorithm", cost: "O(n)" },
      { tell: "remove / partition in place", name: "Two pointers, same direction", cost: "O(n)" },
    ],
  },
  {
    id: "search",
    title: "Searching an ordered space",
    premise:
      "Binary search is not about sorted arrays. It is about any question whose answer flips from no to yes exactly once — and that covers far more problems than it looks like.",
    patterns: [
      { tell: "find the position in a sorted array", name: "Binary search", cost: "O(log n)", tool: "lower_bound" },
      { tell: "minimise the maximum / maximise the minimum", name: "Binary search on the answer", cost: "O(n log C)" },
      { tell: "smallest k for which it is still possible", name: "Binary search on a monotone predicate", cost: "O(n log C)" },
      { tell: "merge overlapping intervals", name: "Sort by start, sweep", cost: "O(n log n)" },
      { tell: "most non-overlapping meetings", name: "Sort by end, take greedily", cost: "O(n log n)" },
      { tell: "the k largest / k closest", name: "Heap capped at size k", cost: "O(n log k)", tool: "priority_queue" },
      { tell: "median of a stream", name: "Two heaps facing each other", cost: "O(log n) per insert" },
      { tell: "merge k sorted lists", name: "Heap of list heads", cost: "O(N log k)" },
    ],
  },
  {
    id: "stack",
    title: "Stack discipline",
    premise:
      "When an element's answer depends on the nearest element that beats it, a stack that never breaks its own ordering answers all n queries in one pass.",
    patterns: [
      { tell: "next greater / previous smaller element", name: "Monotonic stack", cost: "O(n)" },
      { tell: "largest rectangle in a histogram", name: "Monotonic stack over heights", cost: "O(n)" },
      { tell: "how much rain is trapped", name: "Two pointers, or a monotonic stack", cost: "O(n)" },
      { tell: "maximum of every window of size k", name: "Monotonic deque", cost: "O(n)", tool: "deque" },
      { tell: "valid parentheses, evaluate an expression", name: "Plain stack", cost: "O(n)", tool: "stack" },
    ],
  },
  {
    id: "recursion",
    title: "Recursion and its shapes",
    premise:
      "Recursion is only ever three decisions: what the smaller problem is, what you carry down, and what you send back up. Backtracking is that plus the discipline to undo.",
    patterns: [
      { tell: "all subsets / permutations / combinations", name: "Backtracking", cost: "O(2ⁿ) / O(n!)", tool: "n ≤ 20" },
      { tell: "place n things without conflict", name: "Backtracking with pruning", cost: "exponential" },
      { tell: "count inversions, sort and combine", name: "Divide and conquer", cost: "O(n log n)" },
      { tell: "k-th smallest without sorting", name: "Quickselect", cost: "O(n) average", tool: "nth_element" },
    ],
  },
  {
    id: "trees",
    title: "Trees",
    premise:
      "A tree is recursion with a shape. Nearly every tree problem is the same template: solve both children, then combine — the only question is what each child has to hand back.",
    patterns: [
      { tell: "height, diameter, is it balanced", name: "Post-order: solve children, combine", cost: "O(n)" },
      { tell: "level by level, shortest in an unweighted tree", name: "BFS with a queue", cost: "O(n)", tool: "queue" },
      { tell: "validate a BST, k-th smallest in a BST", name: "In-order traversal is sorted", cost: "O(n)" },
      { tell: "path sum equal to target", name: "DFS carrying state down", cost: "O(n)" },
      { tell: "lowest common ancestor, repeatedly", name: "Binary lifting", cost: "O(log n) per query" },
      { tell: "all words starting with this prefix", name: "Trie", cost: "O(len)" },
    ],
  },
  {
    id: "graphs",
    title: "Graphs",
    premise:
      "Everything becomes a graph once you decide what a node is and what an edge means. Grids, dependencies, states of a puzzle — naming the nodes is the whole difficulty.",
    patterns: [
      { tell: "shortest path, every edge costs 1", name: "BFS", cost: "O(V+E)" },
      { tell: "number of islands / connected regions", name: "Flood fill with DFS or BFS", cost: "O(V+E)" },
      { tell: "shortest path with positive weights", name: "Dijkstra", cost: "O(E log V)", tool: "priority_queue" },
      { tell: "edges cost 0 or 1", name: "0-1 BFS", cost: "O(V+E)", tool: "deque" },
      { tell: "there are negative weights", name: "Bellman–Ford", cost: "O(V·E)" },
      { tell: "shortest path between every pair", name: "Floyd–Warshall", cost: "O(V³)", tool: "V ≤ 400" },
      { tell: "an order respecting prerequisites", name: "Topological sort (Kahn)", cost: "O(V+E)" },
      { tell: "are these two connected, over time", name: "Union–Find (DSU)", cost: "≈O(1) amortised" },
      { tell: "cheapest way to connect everything", name: "Kruskal with DSU, or Prim", cost: "O(E log E)" },
    ],
  },
  {
    id: "dp",
    title: "Dynamic programming",
    premise:
      "Two questions give it away: “how many ways” and “the best possible”. Define the state as a sentence — dp[i] is the answer for the first i items — and the transition writes itself.",
    patterns: [
      { tell: "how many ways to reach / build", name: "DP, summing over transitions", cost: "O(states · choices)" },
      { tell: "minimum / maximum cost to reach", name: "DP, min or max over transitions", cost: "O(states · choices)" },
      { tell: "can I make exactly X", name: "Subset sum", cost: "O(n·X)" },
      { tell: "pick items once, capacity limit", name: "0/1 knapsack", cost: "O(n·W)" },
      { tell: "unlimited copies of each item", name: "Unbounded knapsack, coin change", cost: "O(n·W)" },
      { tell: "compare two strings or sequences", name: "2D DP — LCS, edit distance", cost: "O(n·m)" },
      { tell: "longest increasing subsequence", name: "DP, or patience sorting", cost: "O(n²) / O(n log n)", tool: "lower_bound" },
      { tell: "best way to split an interval", name: "Interval DP", cost: "O(n³)" },
      { tell: "n ≤ 20 and you must visit every…", name: "Bitmask DP", cost: "O(2ⁿ·n)" },
      { tell: "choose or skip each node of a tree", name: "Tree DP", cost: "O(n)" },
    ],
  },
  {
    id: "bits",
    title: "Bits and arithmetic",
    premise:
      "A small set is an integer. Once you see that, subsets become loops and membership becomes a single instruction.",
    patterns: [
      { tell: "every element appears twice except one", name: "XOR everything", cost: "O(n)" },
      { tell: "iterate over all subsets of a set", name: "Bitmask enumeration", cost: "O(2ⁿ)" },
      { tell: "how many bits are set", name: "popcount", cost: "O(1)", tool: "__builtin_popcount" },
      { tell: "all primes up to n", name: "Sieve of Eratosthenes", cost: "O(n log log n)" },
      { tell: "aⁿ mod m", name: "Fast exponentiation", cost: "O(log n)" },
      { tell: "divide under a modulus", name: "Modular inverse via Fermat", cost: "O(log m)" },
    ],
  },
  {
    id: "strings",
    title: "Strings",
    premise:
      "String problems are sequence problems where comparing two pieces has to be made cheap. Every technique here is a way to buy that comparison down to O(1).",
    patterns: [
      { tell: "does this pattern occur in this text", name: "KMP or Z-function", cost: "O(n+m)" },
      { tell: "compare arbitrary substrings quickly", name: "Rolling hash", cost: "O(1) per comparison" },
      { tell: "longest palindromic substring", name: "Expand around centre, or Manacher", cost: "O(n²) / O(n)" },
      { tell: "group the anagrams", name: "Sorted string or count signature as key", cost: "O(n·k log k)" },
    ],
  },
  {
    id: "ranges",
    title: "Range queries under updates",
    premise:
      "Prefix sums die the moment the array changes. This family is what replaces them — reach for it only once you have proved a simpler pass will not do.",
    patterns: [
      { tell: "sum of a range, values keep changing", name: "Fenwick tree (BIT)", cost: "O(log n)" },
      { tell: "min / max of a range, values keep changing", name: "Segment tree", cost: "O(log n)" },
      { tell: "min of a range, nothing ever changes", name: "Sparse table", cost: "O(1) per query" },
      { tell: "many range queries, all known upfront", name: "Mo's algorithm", cost: "O((n+q)√n)" },
    ],
  },
];

/* ------------------------------------------------------------------ c++ --- */

export const STL = [
  { thing: "vector<T>", forWhat: "The default container. Contiguous, cache-friendly, reserve() when you know the size." },
  { thing: "sort + lambda", forWhat: "sort(v.begin(), v.end(), [](auto& a, auto& b){ return a.second < b.second; })" },
  { thing: "lower_bound / upper_bound", forWhat: "First element ≥ x, and first > x. Binary search you do not have to get right yourself." },
  { thing: "map vs unordered_map", forWhat: "Ordered O(log n) vs hashed O(1) average. Contests hack unordered_map — use map when adversarial." },
  { thing: "set / multiset", forWhat: "Sorted, deduplicated or not. Ordered insert-and-query in O(log n)." },
  { thing: "priority_queue", forWhat: "Max-heap by default. greater<> for a min-heap — the one everyone forgets." },
  { thing: "deque", forWhat: "Push and pop at both ends in O(1). The container behind sliding-window maximum." },
  { thing: "long long", forWhat: "n·(n−1)/2 overflows int at n ≈ 65 000. Promote before you multiply, not after." },
  { thing: "fast I/O", forWhat: "ios::sync_with_stdio(false); cin.tie(nullptr); — turns TLE into AC on input-heavy problems." },
];

export const TRAPS = [
  { trap: "int overflow", fix: "Anything that multiplies two inputs needs long long. Cast before the multiply." },
  { trap: "mid = (lo + hi) / 2", fix: "Overflows on large bounds. Write lo + (hi − lo) / 2." },
  { trap: "unordered_map worst case", fix: "Crafted keys degrade it to O(n). Use map, or a custom hash with a random seed." },
  { trap: "recursion depth", fix: "Deep DFS on 10⁵ nodes can blow the stack. Convert to an explicit stack when it matters." },
  { trap: "comparing doubles with ==", fix: "Compare against an epsilon, or stay in integers by scaling." },
  { trap: "erasing while iterating", fix: "it = container.erase(it) — anything else invalidates the iterator." },
];
