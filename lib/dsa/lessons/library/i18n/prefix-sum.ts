import type { ChapterAlt } from "@/lib/dsa/lessons/i18n";

// Prefix Sum, in the five languages other than C++.

export const PREFIX_SUM_ALT: ChapterAlt = {
  /* ------------------------------------------------------------ build -- */
  build: {
    c: {
      example: `long long pre[MAXN + 1];
pre[0] = 0;
for (int i = 0; i < n; i++)
  pre[i + 1] = pre[i] + a[i];

/* sum of a[l..r], inclusive, with no edge case */
long long answer = pre[r + 1] - pre[l];`,
      notes: [
        { token: "pre[0] = 0", meaning: "one extra slot removes the l == 0 special case" },
        { token: "pre[i + 1] = pre[i] + a[i]", meaning: "each total reuses the one before it" },
        { token: "pre[r + 1] - pre[l]", meaning: "everything up to r, minus everything before l" },
        { token: "long long", meaning: "10⁵ values near 10⁹ overflow int at once" },
      ],
      vizCode: `pre[0] = a[0];
for (int i = 1; i < n; i++)
  pre[i] = pre[i - 1] + a[i];

/* sum of a[l..r] */
ans = pre[r] - (l ? pre[l - 1] : 0);`,
      starter: `long long pre[MAXN + 1];
pre[0] = 0;

for (int i = 0; i < n; i++)
  pre[i + 1] = ;

long long answer = ;`,
      rules: {
        regex: ["pre\\[i\\s*\\+\\s*1\\]\\s*=\\s*pre\\[i\\]\\s*\\+\\s*a\\[i\\]", "pre\\[\\s*r\\s*\\+\\s*1\\s*\\]\\s*-\\s*pre\\[\\s*l\\s*\\]"],
        hint: "Build with pre[i + 1] = pre[i] + a[i]. Ask with pre[r + 1] - pre[l].",
        success:
          "Correct. The extra slot costs one number and removes a whole class of off-by-one bugs. Always prefer it.",
      },
      solution: `long long pre[MAXN + 1];
pre[0] = 0;

for (int i = 0; i < n; i++)
  pre[i + 1] = pre[i] + a[i];

long long answer = pre[r + 1] - pre[l];`,
    },

    python: {
      example: `pre = [0] * (n + 1)
for i in range(n):
    pre[i + 1] = pre[i] + a[i]

# sum of a[l..r], inclusive, with no edge case
answer = pre[r + 1] - pre[l]

# or in one line
from itertools import accumulate
pre = [0] + list(accumulate(a))`,
      notes: [
        { token: "[0] * (n + 1)", meaning: "one extra slot removes the l == 0 special case" },
        { token: "pre[i + 1] = pre[i] + a[i]", meaning: "each total reuses the one before it" },
        { token: "pre[r + 1] - pre[l]", meaning: "everything up to r, minus everything before l" },
        { token: "accumulate(a)", meaning: "the built-in. No overflow ever, whatever the values" },
      ],
      vizCode: `pre[0] = a[0]
for i in range(1, n):
    pre[i] = pre[i - 1] + a[i]

# sum of a[l..r]
ans = pre[r] - (pre[l - 1] if l else 0)`,
      prompt:
        "Build a prefix sum list, then answer a query for the sum from index l to index r inclusive. Use the n + 1 version so there is no edge case. Write the loop yourself.",
      starter: `pre = [0] * (n + 1)

for i in range(n):
    pre[i + 1] = 

answer = `,
      rules: {
        mustNot: ["accumulate"],
        regex: ["pre\\[i\\s*\\+\\s*1\\]\\s*=\\s*pre\\[i\\]\\s*\\+\\s*a\\[i\\]", "pre\\[\\s*r\\s*\\+\\s*1\\s*\\]\\s*-\\s*pre\\[\\s*l\\s*\\]"],
        hint: "Build with pre[i + 1] = pre[i] + a[i]. Ask with pre[r + 1] - pre[l].",
        success:
          "Correct. Python is the easy case here: integers grow to any size, so the overflow that forces long long in C++ and Java simply cannot happen.",
      },
      solution: `pre = [0] * (n + 1)

for i in range(n):
    pre[i + 1] = pre[i] + a[i]

answer = pre[r + 1] - pre[l]`,
    },

    java: {
      example: `long[] pre = new long[n + 1];
for (int i = 0; i < n; i++)
  pre[i + 1] = pre[i] + a[i];

// sum of a[l..r], inclusive, with no edge case
long answer = pre[r + 1] - pre[l];`,
      notes: [
        { token: "new long[n + 1]", meaning: "one extra slot removes the l == 0 special case" },
        { token: "long, not int", meaning: "the most common bug in this whole chapter" },
        { token: "pre[r + 1] - pre[l]", meaning: "everything up to r, minus everything before l" },
        { token: "arrays start at 0", meaning: "Java zeroes a new long[] for you, so pre[0] is already 0" },
      ],
      vizCode: `pre[0] = a[0];
for (int i = 1; i < n; i++)
  pre[i] = pre[i - 1] + a[i];

// sum of a[l..r]
ans = pre[r] - (l > 0 ? pre[l - 1] : 0);`,
      starter: `long[] pre = new long[n + 1];

for (int i = 0; i < n; i++)
  pre[i + 1] = ;

long answer = ;`,
      rules: {
        regex: ["pre\\[i\\s*\\+\\s*1\\]\\s*=\\s*pre\\[i\\]\\s*\\+\\s*a\\[i\\]", "pre\\[\\s*r\\s*\\+\\s*1\\s*\\]\\s*-\\s*pre\\[\\s*l\\s*\\]"],
        hint: "Build with pre[i + 1] = pre[i] + a[i]. Ask with pre[r + 1] - pre[l].",
        success:
          "Correct, and long[] rather than int[] is the thing to remember. A new long[] arrives already full of zeros, so pre[0] needs no setting up.",
      },
      solution: `long[] pre = new long[n + 1];

for (int i = 0; i < n; i++)
  pre[i + 1] = pre[i] + a[i];

long answer = pre[r + 1] - pre[l];`,
    },

    javascript: {
      example: `const pre = new Array(n + 1).fill(0);
for (let i = 0; i < n; i++)
  pre[i + 1] = pre[i] + a[i];

// sum of a[l..r], inclusive, with no edge case
const answer = pre[r + 1] - pre[l];`,
      notes: [
        { token: ".fill(0)", meaning: "without it the slots are empty and undefined + x is NaN" },
        { token: "pre[i + 1] = pre[i] + a[i]", meaning: "each total reuses the one before it" },
        { token: "past 2^53", meaning: "totals stop being exact. This is JavaScript's real limit here" },
        { token: "BigInt", meaning: "what you need when the running total can pass 9 quadrillion" },
      ],
      vizCode: `pre[0] = a[0];
for (let i = 1; i < n; i++)
  pre[i] = pre[i - 1] + a[i];

// sum of a[l..r]
ans = pre[r] - (l > 0 ? pre[l - 1] : 0);`,
      starter: `const pre = new Array(n + 1).fill(0);

for (let i = 0; i < n; i++)
  pre[i + 1] = ;

const answer = ;`,
      rules: {
        regex: ["pre\\[i\\s*\\+\\s*1\\]\\s*=\\s*pre\\[i\\]\\s*\\+\\s*a\\[i\\]", "pre\\[\\s*r\\s*\\+\\s*1\\s*\\]\\s*-\\s*pre\\[\\s*l\\s*\\]"],
        hint: "Build with pre[i + 1] = pre[i] + a[i]. Ask with pre[r + 1] - pre[l].",
        success:
          "Correct. Two JavaScript-only things: .fill(0) is required or every total becomes NaN, and running totals stop being exact past about 9 quadrillion.",
      },
      solution: `const pre = new Array(n + 1).fill(0);

for (let i = 0; i < n; i++)
  pre[i + 1] = pre[i] + a[i];

const answer = pre[r + 1] - pre[l];`,
    },

    rust: {
      example: `let mut pre = vec![0i64; n + 1];
for i in 0..n {
    pre[i + 1] = pre[i] + a[i];
}

// sum of a[l..r], inclusive, with no edge case
let answer = pre[r + 1] - pre[l];`,
      notes: [
        { token: "vec![0i64; n + 1]", meaning: "one extra slot removes the l == 0 special case" },
        { token: "i64, not i32", meaning: "i32 would overflow, and a debug build stops the program" },
        { token: "pre[r + 1] - pre[l]", meaning: "everything up to r, minus everything before l" },
        { token: ".scan()", meaning: "the iterator way to build a running total" },
      ],
      vizCode: `pre[0] = a[0];
for i in 1..n {
    pre[i] = pre[i - 1] + a[i];
}
// sum of a[l..r]
let ans = pre[r] - if l > 0 { pre[l - 1] } else { 0 };`,
      starter: `let mut pre = vec![0i64; n + 1];

for i in 0..n {
    pre[i + 1] = ;
}

let answer = ;`,
      rules: {
        regex: ["pre\\[i\\s*\\+\\s*1\\]\\s*=\\s*pre\\[i\\]\\s*\\+\\s*a\\[i\\]", "pre\\[\\s*r\\s*\\+\\s*1\\s*\\]\\s*-\\s*pre\\[\\s*l\\s*\\]"],
        hint: "Build with pre[i + 1] = pre[i] + a[i]. Ask with pre[r + 1] - pre[l].",
        success:
          "Correct. Rust is helpful here: with i32 the overflow would stop your program in a debug build, so you find out at once instead of getting a wrong answer.",
      },
      solution: `let mut pre = vec![0i64; n + 1];

for i in 0..n {
    pre[i + 1] = pre[i] + a[i];
}

let answer = pre[r + 1] - pre[l];`,
    },
  },

  /* -------------------------------------------------------- hashcount -- */
  hashcount: {
    c: {
      vizCode: `/* C has no map — this is a hand-rolled one */
map_put(seen, 0, 1);

long long pre = 0;
int answer = 0;

for (int i = 0; i < n; i++) {
  pre += a[i];
  answer += map_get(seen, pre - k);
  map_put(seen, pre, map_get(seen, pre) + 1);
}`,
      example: `/* C has no hash map, so this needs one you write, or sorted prefixes.
   The idea is unchanged: at each step, look for the earlier prefix
   value that would complete a run summing to k. */

long long pre = 0;
int answer = 0;

for (int i = 0; i < n; i++) {
  pre += a[i];
  answer += mapGet(seen, pre - k);   /* how many earlier prefixes work */
  mapInc(seen, pre);
}`,
      notes: [
        { token: "seen[0] = 1", meaning: "so a run starting at index 0 is counted" },
        { token: "pre - k", meaning: "the earlier prefix value that would complete a run" },
        { token: "look up, then record", meaning: "the other order counts a zero-length run" },
        { token: "no built-in map", meaning: "in C you write one, or sort the prefixes instead" },
      ],
      starter: `long long pre = 0;
int answer = 0;
mapInc(seen, 0);

for (int i = 0; i < n; i++) {
  pre += a[i];
  answer += ;
  ;
}`,
      rules: {
        regex: ["answer\\s*\\+=\\s*mapGet\\s*\\(\\s*seen\\s*,\\s*pre\\s*-\\s*k\\s*\\)", "mapInc\\s*\\(\\s*seen\\s*,\\s*pre\\s*\\)"],
        hint: "Look up mapGet(seen, pre - k) and add it to the answer, then record with mapInc(seen, pre).",
        success:
          "Correct. This is the one place C really makes you work — every other language here ships a hash map, and C leaves it to you.",
      },
      solution: `long long pre = 0;
int answer = 0;
mapInc(seen, 0);

for (int i = 0; i < n; i++) {
  pre += a[i];
  answer += mapGet(seen, pre - k);
  mapInc(seen, pre);
}`,
    },

    python: {
      vizCode: `seen = defaultdict(int)
seen[0] = 1

pre = 0
answer = 0

for i in range(n):
    pre += a[i]
    answer += seen[pre - k]
    seen[pre] += 1`,
      example: `from collections import defaultdict

seen = defaultdict(int)
seen[0] = 1              # the empty prefix

pre = 0
answer = 0

for x in a:
    pre += x
    answer += seen[pre - k]   # how many earlier prefixes work
    seen[pre] += 1`,
      notes: [
        { token: "seen[0] = 1", meaning: "so a run starting at index 0 is counted" },
        { token: "pre - k", meaning: "the earlier prefix value that would complete a run" },
        { token: "defaultdict(int)", meaning: "a missing key reads as 0 instead of raising" },
        { token: "look up, then record", meaning: "the other order counts a zero-length run when k is 0" },
      ],
      prompt:
        "Count runs of consecutive numbers summing to k. Fill in the lookup and the record steps — and be careful about their order.",
      starter: `seen = defaultdict(int)
seen[0] = 1
pre = 0
answer = 0

for x in a:
    pre += x
    answer += 
    `,
      rules: {
        regex: ["answer\\s*\\+=\\s*seen\\s*\\[\\s*pre\\s*-\\s*k\\s*\\]", "seen\\s*\\[\\s*pre\\s*\\]\\s*\\+=\\s*1"],
        hint: "Look up seen[pre - k] and add it to the answer, then record seen[pre] += 1.",
        success:
          "Correct. Use defaultdict(int), not a plain dict: with a plain dict, seen[pre - k] raises KeyError the first time that value has not been seen.",
      },
      solution: `seen = defaultdict(int)
seen[0] = 1
pre = 0
answer = 0

for x in a:
    pre += x
    answer += seen[pre - k]
    seen[pre] += 1`,
    },

    java: {
      vizCode: `Map<Long,Integer> seen = new HashMap<>();
seen.put(0L, 1);

long pre = 0;
int answer = 0;

for (int i = 0; i < n; i++) {
  pre += a[i];
  answer += seen.getOrDefault(pre - k, 0);
  seen.merge(pre, 1, Integer::sum);
}`,
      example: `Map<Long, Integer> seen = new HashMap<>();
seen.put(0L, 1);          // the empty prefix

long pre = 0;
int answer = 0;

for (int x : a) {
  pre += x;
  answer += seen.getOrDefault(pre - k, 0);   // how many earlier prefixes work
  seen.merge(pre, 1, Integer::sum);
}`,
      notes: [
        { token: "seen.put(0L, 1)", meaning: "so a run starting at index 0 is counted" },
        { token: "pre - k", meaning: "the earlier prefix value that would complete a run" },
        { token: "getOrDefault(key, 0)", meaning: "reads without creating and without a null check" },
        { token: "seen.merge(pre, 1, Integer::sum)", meaning: "the neat way to add one to a count" },
      ],
      starter: `Map<Long, Integer> seen = new HashMap<>();
seen.put(0L, 1);
long pre = 0;
int answer = 0;

for (int x : a) {
  pre += x;
  answer += ;
  ;
}`,
      rules: {
        regex: ["seen\\.getOrDefault\\s*\\(\\s*pre\\s*-\\s*k\\s*,\\s*0\\s*\\)", "seen\\.merge\\s*\\(\\s*pre\\s*,\\s*1\\s*,|seen\\.put\\s*\\(\\s*pre\\s*,"],
        hint: "Look up seen.getOrDefault(pre - k, 0) and add it, then record with seen.merge(pre, 1, Integer::sum).",
        success:
          "Correct. Use Long keys, not Integer — the running total needs a long, and mixing the two means the map lookups quietly never match.",
      },
      solution: `Map<Long, Integer> seen = new HashMap<>();
seen.put(0L, 1);
long pre = 0;
int answer = 0;

for (int x : a) {
  pre += x;
  answer += seen.getOrDefault(pre - k, 0);
  seen.merge(pre, 1, Integer::sum);
}`,
    },

    javascript: {
      vizCode: `const seen = new Map();
seen.set(0, 1);

let pre = 0;
let answer = 0;

for (let i = 0; i < n; i++) {
  pre += a[i];
  answer += seen.get(pre - k) ?? 0;
  seen.set(pre, (seen.get(pre) ?? 0) + 1);
}`,
      example: `const seen = new Map();
seen.set(0, 1);           // the empty prefix

let pre = 0;
let answer = 0;

for (const x of a) {
  pre += x;
  answer += seen.get(pre - k) ?? 0;   // how many earlier prefixes work
  seen.set(pre, (seen.get(pre) ?? 0) + 1);
}`,
      notes: [
        { token: "seen.set(0, 1)", meaning: "so a run starting at index 0 is counted" },
        { token: "pre - k", meaning: "the earlier prefix value that would complete a run" },
        { token: "?? 0", meaning: "a missing key gives undefined. This turns it into 0" },
        { token: "Map, not {}", meaning: "an object would turn the number keys into text" },
      ],
      prompt:
        "Count runs of consecutive numbers summing to k. Fill in the lookup and the record steps — and be careful about their order.",
      starter: `const seen = new Map();
seen.set(0, 1);
let pre = 0, answer = 0;

for (const x of a) {
  pre += x;
  answer += ;
  ;
}`,
      rules: {
        regex: ["seen\\.get\\s*\\(\\s*pre\\s*-\\s*k\\s*\\)", "seen\\.set\\s*\\(\\s*pre\\s*,"],
        hint: "Look up seen.get(pre - k) ?? 0 and add it, then record seen.set(pre, (seen.get(pre) ?? 0) + 1).",
        success:
          "Correct. The ?? 0 is essential — without it, answer += undefined turns the answer into NaN and every later step keeps it there.",
      },
      solution: `const seen = new Map();
seen.set(0, 1);
let pre = 0, answer = 0;

for (const x of a) {
  pre += x;
  answer += seen.get(pre - k) ?? 0;
  seen.set(pre, (seen.get(pre) ?? 0) + 1);
}`,
    },

    rust: {
      vizCode: `let mut seen: HashMap<i64, i64> = HashMap::new();
seen.insert(0, 1);

let mut pre: i64 = 0;
let mut answer: i64 = 0;

for i in 0..n {
    pre += a[i];
    answer += *seen.get(&(pre - k)).unwrap_or(&0);
    *seen.entry(pre).or_insert(0) += 1;
}`,
      example: `let mut seen: HashMap<i64, i64> = HashMap::new();
seen.insert(0, 1);        // the empty prefix

let mut pre: i64 = 0;
let mut answer: i64 = 0;

for &x in a {
    pre += x as i64;
    answer += *seen.get(&(pre - k)).unwrap_or(&0);
    *seen.entry(pre).or_insert(0) += 1;
}`,
      notes: [
        { token: "seen.insert(0, 1)", meaning: "so a run starting at index 0 is counted" },
        { token: "pre - k", meaning: "the earlier prefix value that would complete a run" },
        { token: ".unwrap_or(&0)", meaning: "a missing key reads as 0" },
        { token: ".entry(pre).or_insert(0)", meaning: "the standard way to add one to a count" },
      ],
      starter: `let mut seen: HashMap<i64, i64> = HashMap::new();
seen.insert(0, 1);
let mut pre: i64 = 0;
let mut answer: i64 = 0;

for &x in a {
    pre += x as i64;
    answer += ;
    ;
}`,
      rules: {
        regex: ["seen\\.get\\s*\\(\\s*&\\(\\s*pre\\s*-\\s*k\\s*\\)\\s*\\)", "seen\\.entry\\s*\\(\\s*pre\\s*\\)\\.or_insert\\s*\\(\\s*0\\s*\\)"],
        hint:
          "Look up *seen.get(&(pre - k)).unwrap_or(&0) and add it, then record *seen.entry(pre).or_insert(0) += 1.",
        success:
          "Correct. entry().or_insert() is worth learning properly — it finds the slot once and hands you a reference, instead of looking the key up twice.",
      },
      solution: `let mut seen: HashMap<i64, i64> = HashMap::new();
seen.insert(0, 1);
let mut pre: i64 = 0;
let mut answer: i64 = 0;

for &x in a {
    pre += x as i64;
    answer += *seen.get(&(pre - k)).unwrap_or(&0);
    *seen.entry(pre).or_insert(0) += 1;
}`,
    },
  },

  /* ------------------------------------------------------- difference -- */
  difference: {
    c: {
      vizCode: `long long *diff = calloc(n + 2, sizeof *diff);

diff[l]     += v;
diff[r + 1] -= v;

long long running = 0;
for (int i = 0; i < n; i++) {
  running += diff[i];
  a[i] = running;
}`,
      example: `long long diff[MAXN + 2] = {0};

/* add v to every index in [l, r] */
diff[l]     += v;
diff[r + 1] -= v;

/* after all the updates, roll it up */
long long running = 0;
for (int i = 0; i < n; i++) {
  running += diff[i];
  a[i] = running;
}`,
      notes: [
        { token: "diff[l] += v", meaning: "from here on, everything is v higher" },
        { token: "diff[r + 1] -= v", meaning: "cancel it just past the end" },
        { token: "MAXN + 2", meaning: "so r + 1 is still inside the array when r is the last index" },
        { token: "running += diff[i]", meaning: "the prefix pass that produces the real values" },
      ],
      starter: `long long diff[MAXN + 2] = {0};

diff[ ] += v;
diff[ ] -= v;`,
      rules: {
        regex: ["diff\\s*\\[\\s*l\\s*\\]\\s*\\+=\\s*v", "diff\\s*\\[\\s*r\\s*\\+\\s*1\\s*\\]\\s*-=\\s*v"],
        hint: "Add at l, subtract at r + 1 — one past the end, which is why the array has room for n + 1.",
        success:
          "Correct. A hundred thousand range updates now cost two writes each, and one final pass reveals every value.",
      },
      solution: `long long diff[MAXN + 2] = {0};

diff[l] += v;
diff[r + 1] -= v;`,
    },

    python: {
      vizCode: `diff = [0] * (n + 1)

diff[l]     += v
diff[r + 1] -= v

running = 0
for i in range(n):
    running += diff[i]
    a[i] = running`,
      example: `diff = [0] * (n + 1)

# add v to every index in [l, r]
diff[l]     += v
diff[r + 1] -= v

# after all the updates, roll it up
running = 0
for i in range(n):
    running += diff[i]
    a[i] = running`,
      notes: [
        { token: "diff[l] += v", meaning: "from here on, everything is v higher" },
        { token: "diff[r + 1] -= v", meaning: "cancel it just past the end" },
        { token: "[0] * (n + 1)", meaning: "so r + 1 is still inside the list when r is the last index" },
        { token: "accumulate(diff)", meaning: "the built-in way to roll it up afterwards" },
      ],
      prompt: "Record a range update on a difference list: add v to everything from l to r inclusive.",
      starter: `diff = [0] * (n + 1)

diff[] += v
diff[] -= v`,
      rules: {
        regex: ["diff\\s*\\[\\s*l\\s*\\]\\s*\\+=\\s*v", "diff\\s*\\[\\s*r\\s*\\+\\s*1\\s*\\]\\s*-=\\s*v"],
        hint: "Add at l, subtract at r + 1 — one past the end, which is why the list has n + 1 slots.",
        success:
          "Correct. Careful with the extra slot in Python: diff[-1] would silently write to the last item instead of failing, so the size has to be right.",
      },
      solution: `diff = [0] * (n + 1)

diff[l] += v
diff[r + 1] -= v`,
    },

    java: {
      vizCode: `long[] diff = new long[n + 2];

diff[l]     += v;
diff[r + 1] -= v;

long running = 0;
for (int i = 0; i < n; i++) {
  running += diff[i];
  a[i] = running;
}`,
      example: `long[] diff = new long[n + 2];

// add v to every index in [l, r]
diff[l]     += v;
diff[r + 1] -= v;

// after all the updates, roll it up
long running = 0;
for (int i = 0; i < n; i++) {
  running += diff[i];
  a[i] = running;
}`,
      notes: [
        { token: "diff[l] += v", meaning: "from here on, everything is v higher" },
        { token: "diff[r + 1] -= v", meaning: "cancel it just past the end" },
        { token: "new long[n + 2]", meaning: "so r + 1 is still inside the array when r is the last index" },
        { token: "long", meaning: "many overlapping updates add up past what an int holds" },
      ],
      starter: `long[] diff = new long[n + 2];

diff[ ] += v;
diff[ ] -= v;`,
      rules: {
        regex: ["diff\\s*\\[\\s*l\\s*\\]\\s*\\+=\\s*v", "diff\\s*\\[\\s*r\\s*\\+\\s*1\\s*\\]\\s*-=\\s*v"],
        hint: "Add at l, subtract at r + 1 — one past the end, which is why the array is n + 2 long.",
        success:
          "Correct. Size it n + 2 rather than n + 1: if r is the last index, r + 1 is n, and Java throws the moment you write past the end.",
      },
      solution: `long[] diff = new long[n + 2];

diff[l] += v;
diff[r + 1] -= v;`,
    },

    javascript: {
      vizCode: `const diff = new Array(n + 2).fill(0);

diff[l]     += v;
diff[r + 1] -= v;

let running = 0;
for (let i = 0; i < n; i++) {
  running += diff[i];
  a[i] = running;
}`,
      example: `const diff = new Array(n + 2).fill(0);

// add v to every index in [l, r]
diff[l]     += v;
diff[r + 1] -= v;

// after all the updates, roll it up
let running = 0;
for (let i = 0; i < n; i++) {
  running += diff[i];
  a[i] = running;
}`,
      notes: [
        { token: "diff[l] += v", meaning: "from here on, everything is v higher" },
        { token: "diff[r + 1] -= v", meaning: "cancel it just past the end" },
        { token: ".fill(0)", meaning: "without it, += on an empty slot gives NaN" },
        { token: "writing past the end", meaning: "JavaScript just grows the array. No error, so size it properly anyway" },
      ],
      prompt: "Record a range update on a difference array: add v to everything from l to r inclusive.",
      starter: `const diff = new Array(n + 2).fill(0);

diff[ ] += v;
diff[ ] -= v;`,
      rules: {
        regex: ["diff\\s*\\[\\s*l\\s*\\]\\s*\\+=\\s*v", "diff\\s*\\[\\s*r\\s*\\+\\s*1\\s*\\]\\s*-=\\s*v"],
        hint: "Add at l, subtract at r + 1 — one past the end, which is why the array is n + 2 long.",
        success:
          "Correct. The .fill(0) matters most here: an empty slot is undefined, and undefined += v gives NaN, which then spreads through the whole roll-up.",
      },
      solution: `const diff = new Array(n + 2).fill(0);

diff[l] += v;
diff[r + 1] -= v;`,
    },

    rust: {
      vizCode: `let mut diff = vec![0i64; n + 2];

diff[l]     += v;
diff[r + 1] -= v;

let mut running = 0i64;
for i in 0..n {
    running += diff[i];
    a[i] = running;
}`,
      example: `let mut diff = vec![0i64; n + 2];

// add v to every index in [l, r]
diff[l]     += v;
diff[r + 1] -= v;

// after all the updates, roll it up
let mut running = 0i64;
for i in 0..n {
    running += diff[i];
    a[i] = running;
}`,
      notes: [
        { token: "diff[l] += v", meaning: "from here on, everything is v higher" },
        { token: "diff[r + 1] -= v", meaning: "cancel it just past the end" },
        { token: "vec![0i64; n + 2]", meaning: "so r + 1 is still inside the vector when r is the last index" },
        { token: "writing past the end", meaning: "stops the program at once, so the size has to be right" },
      ],
      prompt: "Record a range update on a difference vector: add v to everything from l to r inclusive.",
      starter: `let mut diff = vec![0i64; n + 2];

diff[] += v;
diff[] -= v;`,
      rules: {
        regex: ["diff\\s*\\[\\s*l\\s*\\]\\s*\\+=\\s*v", "diff\\s*\\[\\s*r\\s*\\+\\s*1\\s*\\]\\s*-=\\s*v"],
        hint: "Add at l, subtract at r + 1 — one past the end, which is why the vector is n + 2 long.",
        success:
          "Correct. Rust checks the index every time, so getting the size wrong stops the program straight away rather than corrupting something nearby.",
      },
      solution: `let mut diff = vec![0i64; n + 2];

diff[l] += v;
diff[r + 1] -= v;`,
    },
  },
};
