import type { ChapterAlt } from "@/lib/dsa/lessons/i18n";

// Greedy, Dynamic Programming, Number Theory, Trie, String Matching and
// Range Query — the last six chapters, in the five languages other than C++.

export const GREEDY_ALT: ChapterAlt = {
  intervals: {
    c: {
      example: `int cmp(const void *x, const void *y) {
  const Job *a = x, *b = y;
  return a->end - b->end;          /* sort by FINISHING time */
}

qsort(jobs, n, sizeof(Job), cmp);

int lastEnd = 0, taken = 0;
for (int i = 0; i < n; i++)
  if (jobs[i].start >= lastEnd) { taken++; lastEnd = jobs[i].end; }`,
      notes: [
        { token: "sort by end", meaning: "finishing time — not start, not duration" },
        { token: "start >= lastEnd", meaning: "the room is free again" },
        { token: "a->end - b->end", meaning: "works for small values. Large ones overflow — compare instead" },
        { token: "qsort", meaning: "C's sort. It takes a compare function and void pointers" },
      ],
      vizCode: `int cmp(const void *x, const void *y) {
  return ((Job*)x)->end - ((Job*)y)->end; }
qsort(jobs, n, sizeof(Job), cmp);
int lastEnd = 0;
for (int i = 0; i < n; i++)
  if (jobs[i].start >= lastEnd) { take(i); lastEnd = jobs[i].end; }`,
      starter: `int cmp(const void *x, const void *y) {
  const Job *a = x, *b = y;
  return ;
}

int lastEnd = 0, taken = 0;
for (int i = 0; i < n; i++) {
  if ( ) {
    taken++;
    lastEnd = jobs[i].end;
  }
}`,
      rules: {
        regex: ["a->end\\s*-\\s*b->end", "jobs\\[i\\]\\.start\\s*>=\\s*lastEnd"],
        hint: "Sort by returning a->end - b->end. A meeting fits when jobs[i].start >= lastEnd.",
        success:
          "Correct. Subtracting inside a compare function is fine for small numbers, but with large ones it overflows — return (a > b) - (a < b) instead.",
      },
      solution: `int cmp(const void *x, const void *y) {
  const Job *a = x, *b = y;
  return a->end - b->end;
}

int lastEnd = 0, taken = 0;
for (int i = 0; i < n; i++) {
  if (jobs[i].start >= lastEnd) {
    taken++;
    lastEnd = jobs[i].end;
  }
}`,
    },

    python: {
      example: `jobs.sort(key=lambda j: j.end)      # sort by FINISHING time

last_end = 0
taken = 0
for j in jobs:
    if j.start >= last_end:
        taken += 1
        last_end = j.end`,
      notes: [
        { token: "key=lambda j: j.end", meaning: "Python sorts by a KEY, not a comparator" },
        { token: "start >= last_end", meaning: "the room is free again" },
        { token: "key=lambda j: (j.end, j.start)", meaning: "sort by end, then by start, using a tuple" },
        { token: "sort is stable", meaning: "so equal ends keep their original order" },
      ],
      vizCode: `jobs.sort(key=lambda j: j.end)
last_end = 0
for j in jobs:
    if j.start >= last_end:
        take(j); last_end = j.end`,
      prompt:
        "Sort meetings by finishing time, then take every one that fits. Use a key function.",
      starter: `jobs.sort(key=)

last_end = 0
taken = 0
for j in jobs:
    if :
        taken += 1
        last_end = j.end`,
      rules: {
        regex: ["key\\s*=\\s*lambda\\s+j\\s*:\\s*j\\.end", "j\\.start\\s*>=\\s*last_end"],
        hint: "Sort with key=lambda j: j.end. A meeting fits when j.start >= last_end.",
        success:
          "Correct. Python's key form is safer than a comparator: it cannot overflow, and it never breaks the ordering rules a sort depends on.",
      },
      solution: `jobs.sort(key=lambda j: j.end)

last_end = 0
taken = 0
for j in jobs:
    if j.start >= last_end:
        taken += 1
        last_end = j.end`,
    },

    java: {
      example: `jobs.sort(Comparator.comparingInt(j -> j.end));   // sort by FINISHING time

int lastEnd = 0, taken = 0;
for (Job j : jobs) {
  if (j.start >= lastEnd) {
    taken++;
    lastEnd = j.end;
  }
}`,
      notes: [
        { token: "Comparator.comparingInt", meaning: "safer than (a, b) -> a.end - b.end, which can overflow" },
        { token: "start >= lastEnd", meaning: "the room is free again" },
        { token: ".thenComparing(...)", meaning: "how you add a second sort key" },
        { token: "List.sort is stable", meaning: "so equal ends keep their original order" },
      ],
      vizCode: `jobs.sort(Comparator.comparingInt(j -> j.end));
int lastEnd = 0;
for (Job j : jobs)
  if (j.start >= lastEnd) { take(j); lastEnd = j.end; }
// sorted by end time, then taken greedily`,
      starter: `jobs.sort(Comparator.comparingInt());

int lastEnd = 0, taken = 0;
for (Job j : jobs) {
  if ( ) {
    taken++;
    lastEnd = j.end;
  }
}`,
      rules: {
        regex: ["comparingInt\\s*\\(\\s*j\\s*->\\s*j\\.end\\s*\\)", "j\\.start\\s*>=\\s*lastEnd"],
        hint: "Sort with Comparator.comparingInt(j -> j.end). A meeting fits when j.start >= lastEnd.",
        success:
          "Correct. Prefer comparingInt over (a, b) -> a.end - b.end: the subtraction overflows on large values and then sorts them in the wrong order.",
      },
      solution: `jobs.sort(Comparator.comparingInt(j -> j.end));

int lastEnd = 0, taken = 0;
for (Job j : jobs) {
  if (j.start >= lastEnd) {
    taken++;
    lastEnd = j.end;
  }
}`,
    },

    javascript: {
      example: `jobs.sort((a, b) => a.end - b.end);       // sort by FINISHING time

let lastEnd = 0, taken = 0;
for (const j of jobs) {
  if (j.start >= lastEnd) {
    taken++;
    lastEnd = j.end;
  }
}`,
      notes: [
        { token: "(a, b) => a.end - b.end", meaning: "a real comparator. Without it, sort compares as text" },
        { token: "start >= lastEnd", meaning: "the room is free again" },
        { token: "jobs.sort()", meaning: "with no argument this sorts by string, which is almost never right" },
        { token: "sort is stable", meaning: "guaranteed since 2019" },
      ],
      vizCode: `jobs.sort((a, b) => a.end - b.end);
let lastEnd = 0;
for (const j of jobs)
  if (j.start >= lastEnd) { take(j); lastEnd = j.end; }
// sorted by end time, then taken greedily`,
      prompt:
        "Sort meetings by finishing time, then take every one that fits. Pass a real comparator.",
      starter: `jobs.sort();

let lastEnd = 0, taken = 0;
for (const j of jobs) {
  if ( ) {
    taken++;
    lastEnd = j.end;
  }
}`,
      rules: {
        regex: ["\\(\\s*a\\s*,\\s*b\\s*\\)\\s*=>\\s*a\\.end\\s*-\\s*b\\.end", "j\\.start\\s*>=\\s*lastEnd"],
        hint: "Sort with (a, b) => a.end - b.end. A meeting fits when j.start >= lastEnd.",
        success:
          "Correct. The comparator is not optional in JavaScript: a bare .sort() turns everything into text first, so 10 would come before 9.",
      },
      solution: `jobs.sort((a, b) => a.end - b.end);

let lastEnd = 0, taken = 0;
for (const j of jobs) {
  if (j.start >= lastEnd) {
    taken++;
    lastEnd = j.end;
  }
}`,
    },

    rust: {
      example: `jobs.sort_by_key(|j| j.end);         // sort by FINISHING time

let mut last_end = 0;
let mut taken = 0;
for j in &jobs {
    if j.start >= last_end {
        taken += 1;
        last_end = j.end;
    }
}`,
      notes: [
        { token: "sort_by_key(|j| j.end)", meaning: "Rust sorts by a key, like Python" },
        { token: "start >= last_end", meaning: "the room is free again" },
        { token: "sort_by_key(|j| (j.end, j.start))", meaning: "a tuple gives you a second sort key" },
        { token: "sort is stable", meaning: "sort_unstable_by_key is faster but may reorder ties" },
      ],
      vizCode: `jobs.sort_by_key(|j| j.end);
let mut last_end = 0;
for j in &jobs {
    if j.start >= last_end { take(j); last_end = j.end; }
}
// sorted by end time, then taken greedily`,
      prompt:
        "Sort meetings by finishing time, then take every one that fits. Use a key function.",
      starter: `jobs.sort_by_key();

let mut last_end = 0;
let mut taken = 0;
for j in &jobs {
    if  {
        taken += 1;
        last_end = j.end;
    }
}`,
      rules: {
        regex: ["sort_by_key\\s*\\(\\s*\\|j\\|\\s*j\\.end\\s*\\)", "j\\.start\\s*>=\\s*last_end"],
        hint: "Sort with jobs.sort_by_key(|j| j.end). A meeting fits when j.start >= last_end.",
        success:
          "Correct. sort_by_key cannot produce an invalid ordering, unlike a hand-written comparator — one less way to get a greedy solution subtly wrong.",
      },
      solution: `jobs.sort_by_key(|j| j.end);

let mut last_end = 0;
let mut taken = 0;
for j in &jobs {
    if j.start >= last_end {
        taken += 1;
        last_end = j.end;
    }
}`,
    },
  },
};

export const DP_ALT: ChapterAlt = {
  onedim: {
    c: {
      example: `int dp[MAXN + 1];
dp[0] = 1;                    /* one way to do nothing */
dp[1] = 1;
for (int i = 2; i <= n; i++)
  dp[i] = dp[i - 1] + dp[i - 2];

/* only the last two matter — O(1) memory */
int a = 1, b = 1;
for (int i = 2; i <= n; i++) { int c = a + b; a = b; b = c; }`,
      notes: [
        { token: "dp[i]", meaning: "state — the number of ways to reach step i" },
        { token: "dp[i-1] + dp[i-2]", meaning: "transition — the only two last moves" },
        { token: "dp[0] = 1", meaning: "base case — one way to do nothing, not zero" },
        { token: "two variables", meaning: "when only the last two matter, drop the array" },
      ],
      vizCode: `dp[0] = 1; dp[1] = 1;
for (int i = 2; i <= n; i++)
  dp[i] = dp[i - 1] + dp[i - 2];
return dp[n];`,
      starter: `int dp[MAXN + 1] = {0};
dp[1] = a[0];

for (int i = 2; i <= n; i++) {
  dp[i] = MAX( , );
}`,
      rules: {
        regex: ["dp\\[i\\s*-\\s*1\\]", "dp\\[i\\s*-\\s*2\\]\\s*\\+\\s*a\\[i\\s*-\\s*1\\]|a\\[i\\s*-\\s*1\\]\\s*\\+\\s*dp\\[i\\s*-\\s*2\\]"],
        hint:
          "Two options. Skip house i, which leaves dp[i - 1]. Or rob it: a[i - 1] + dp[i - 2], since its neighbour must be skipped. Take the larger.",
        success:
          "Correct. C has no max for ints, so most people write a MAX macro — mind the brackets, or it misbehaves on expressions.",
      },
      solution: `int dp[MAXN + 1] = {0};
dp[1] = a[0];

for (int i = 2; i <= n; i++) {
  dp[i] = MAX(dp[i - 1], dp[i - 2] + a[i - 1]);
}`,
    },

    python: {
      example: `dp = [0] * (n + 1)
dp[0] = 1                     # one way to do nothing
dp[1] = 1
for i in range(2, n + 1):
    dp[i] = dp[i - 1] + dp[i - 2]

# only the last two matter — O(1) memory
a, b = 1, 1
for i in range(2, n + 1):
    a, b = b, a + b`,
      notes: [
        { token: "dp[i]", meaning: "state — the number of ways to reach step i" },
        { token: "dp[i-1] + dp[i-2]", meaning: "transition — the only two last moves" },
        { token: "dp[0] = 1", meaning: "base case — one way to do nothing, not zero" },
        { token: "@lru_cache", meaning: "turns plain recursion into memoised DP with one line" },
      ],
      vizCode: `dp[0] = 1; dp[1] = 1
for i in range(2, n + 1):
    dp[i] = dp[i - 1] + dp[i - 2]
return dp[n]`,
      prompt:
        "House robber: you may not rob two adjacent houses. dp[i] is the most money from the first i houses. Write the transition.",
      starter: `dp = [0] * (n + 1)
dp[1] = a[0]

for i in range(2, n + 1):
    dp[i] = max(, )`,
      rules: {
        regex: ["dp\\[i\\s*-\\s*1\\]", "dp\\[i\\s*-\\s*2\\]\\s*\\+\\s*a\\[i\\s*-\\s*1\\]|a\\[i\\s*-\\s*1\\]\\s*\\+\\s*dp\\[i\\s*-\\s*2\\]"],
        hint:
          "Two options. Skip house i, which leaves dp[i - 1]. Or rob it: a[i - 1] + dp[i - 2]. Take the larger.",
        success:
          "Correct. Python has a shortcut worth knowing: put @lru_cache(maxsize=None) above a plain recursive function and it becomes memoised DP with no table at all.",
      },
      solution: `dp = [0] * (n + 1)
dp[1] = a[0]

for i in range(2, n + 1):
    dp[i] = max(dp[i - 1], dp[i - 2] + a[i - 1])`,
    },

    java: {
      example: `int[] dp = new int[n + 1];
dp[0] = 1;                    // one way to do nothing
dp[1] = 1;
for (int i = 2; i <= n; i++)
  dp[i] = dp[i - 1] + dp[i - 2];

// only the last two matter — O(1) memory
int a = 1, b = 1;
for (int i = 2; i <= n; i++) { int c = a + b; a = b; b = c; }`,
      notes: [
        { token: "dp[i]", meaning: "state — the number of ways to reach step i" },
        { token: "dp[i-1] + dp[i-2]", meaning: "transition — the only two last moves" },
        { token: "dp[0] = 1", meaning: "base case — one way to do nothing, not zero" },
        { token: "long[] for counting", meaning: "'how many ways' answers overflow int very quickly" },
      ],
      vizCode: `dp[0] = 1; dp[1] = 1;
for (int i = 2; i <= n; i++)
  dp[i] = dp[i - 1] + dp[i - 2];
return dp[n];`,
      starter: `int[] dp = new int[n + 1];
dp[1] = a[0];

for (int i = 2; i <= n; i++) {
  dp[i] = Math.max( , );
}`,
      rules: {
        regex: ["dp\\[i\\s*-\\s*1\\]", "dp\\[i\\s*-\\s*2\\]\\s*\\+\\s*a\\[i\\s*-\\s*1\\]|a\\[i\\s*-\\s*1\\]\\s*\\+\\s*dp\\[i\\s*-\\s*2\\]"],
        hint:
          "Two options. Skip house i, which leaves dp[i - 1]. Or rob it: a[i - 1] + dp[i - 2]. Take the larger.",
        success:
          "Correct. For 'how many ways' problems switch to long[] — the counts grow fast, and an int silently wraps round to a negative number.",
      },
      solution: `int[] dp = new int[n + 1];
dp[1] = a[0];

for (int i = 2; i <= n; i++) {
  dp[i] = Math.max(dp[i - 1], dp[i - 2] + a[i - 1]);
}`,
    },

    javascript: {
      example: `const dp = new Array(n + 1).fill(0);
dp[0] = 1;                    // one way to do nothing
dp[1] = 1;
for (let i = 2; i <= n; i++)
  dp[i] = dp[i - 1] + dp[i - 2];

// only the last two matter — O(1) memory
let a = 1, b = 1;
for (let i = 2; i <= n; i++) { const c = a + b; a = b; b = c; }`,
      notes: [
        { token: "dp[i]", meaning: "state — the number of ways to reach step i" },
        { token: "dp[i-1] + dp[i-2]", meaning: "transition — the only two last moves" },
        { token: ".fill(0)", meaning: "without it every slot is undefined and the sums become NaN" },
        { token: "past 2^53", meaning: "counts stop being exact. Use BigInt for large 'how many ways'" },
      ],
      vizCode: `dp[0] = 1; dp[1] = 1;
for (let i = 2; i <= n; i++)
  dp[i] = dp[i - 1] + dp[i - 2];
return dp[n];`,
      prompt:
        "House robber: you may not rob two adjacent houses. dp[i] is the most money from the first i houses. Write the transition.",
      starter: `const dp = new Array(n + 1).fill(0);
dp[1] = a[0];

for (let i = 2; i <= n; i++) {
  dp[i] = Math.max( , );
}`,
      rules: {
        regex: ["dp\\[i\\s*-\\s*1\\]", "dp\\[i\\s*-\\s*2\\]\\s*\\+\\s*a\\[i\\s*-\\s*1\\]|a\\[i\\s*-\\s*1\\]\\s*\\+\\s*dp\\[i\\s*-\\s*2\\]"],
        hint:
          "Two options. Skip house i, which leaves dp[i - 1]. Or rob it: a[i - 1] + dp[i - 2]. Take the larger.",
        success:
          "Correct. The .fill(0) is essential — an unfilled array holds undefined, and undefined + 1 is NaN, which then spreads through the whole table.",
      },
      solution: `const dp = new Array(n + 1).fill(0);
dp[1] = a[0];

for (let i = 2; i <= n; i++) {
  dp[i] = Math.max(dp[i - 1], dp[i - 2] + a[i - 1]);
}`,
    },

    rust: {
      example: `let mut dp = vec![0i64; n + 1];
dp[0] = 1;                    // one way to do nothing
dp[1] = 1;
for i in 2..=n {
    dp[i] = dp[i - 1] + dp[i - 2];
}

// only the last two matter — O(1) memory
let (mut a, mut b) = (1i64, 1i64);
for _ in 2..=n { let c = a + b; a = b; b = c; }`,
      notes: [
        { token: "dp[i]", meaning: "state — the number of ways to reach step i" },
        { token: "dp[i-1] + dp[i-2]", meaning: "transition — the only two last moves" },
        { token: "i64", meaning: "counting answers overflow i32 fast, and a debug build then panics" },
        { token: "2..=n", meaning: "includes n. 2..n would stop one short" },
      ],
      vizCode: `dp[0] = 1; dp[1] = 1;
for i in 2..=n {
    dp[i] = dp[i - 1] + dp[i - 2]; }
dp[n]`,
      prompt:
        "House robber: you may not rob two adjacent houses. dp[i] is the most money from the first i houses. Write the transition.",
      starter: `let mut dp = vec![0i64; n + 1];
dp[1] = a[0];

for i in 2..=n {
    dp[i] = .max();
}`,
      rules: {
        regex: ["dp\\[i\\s*-\\s*1\\]", "dp\\[i\\s*-\\s*2\\]\\s*\\+\\s*a\\[i\\s*-\\s*1\\]|a\\[i\\s*-\\s*1\\]\\s*\\+\\s*dp\\[i\\s*-\\s*2\\]"],
        hint:
          "Two options. Skip house i, which leaves dp[i - 1]. Or rob it: a[i - 1] + dp[i - 2]. Write it as dp[i - 1].max(dp[i - 2] + a[i - 1]).",
        success:
          "Correct. Rust puts max on the value itself, so it reads dp[i-1].max(...) rather than max(dp[i-1], ...).",
      },
      solution: `let mut dp = vec![0i64; n + 1];
dp[1] = a[0];

for i in 2..=n {
    dp[i] = dp[i - 1].max(dp[i - 2] + a[i - 1]);
}`,
    },
  },

  knapsack: {
    c: {
      example: `int dp[MAXN + 1][MAXW + 1] = {{0}};

for (int i = 1; i <= n; i++)
  for (int c = 0; c <= W; c++) {
    dp[i][c] = dp[i - 1][c];                          /* skip */
    if (w[i] <= c && v[i] + dp[i-1][c - w[i]] > dp[i][c])
      dp[i][c] = v[i] + dp[i - 1][c - w[i]];          /* take */
  }`,
      notes: [
        { token: "dp[i][c]", meaning: "best value from the first i items with capacity c" },
        { token: "dp[i-1][c]", meaning: "the skip branch" },
        { token: "v[i] + dp[i-1][c-w[i]]", meaning: "the take branch — space is used up" },
        { token: "a big 2D array", meaning: "10⁵ x 10⁵ ints is 40 GB. Use one row when you can" },
      ],
      vizCode: `for (int i = 1; i <= n; i++)
  for (int c = 0; c <= W; c++) {
    dp[i][c] = dp[i-1][c];                     /* skip item i */
    if (w[i] <= c)
      dp[i][c] = MAX(dp[i][c],
                     v[i] + dp[i-1][c - w[i]]); /* take item i */
  }`,
      starter: `for (int i = 1; i <= n; i++) {
  for (int c = 0; c <= W; c++) {
    dp[i][c] = ;
    if (w[i] <= c)
      dp[i][c] = MAX(dp[i][c], );
  }
}`,
      rules: {
        regex: ["dp\\[i\\s*-\\s*1\\]\\[c\\]", "v\\[i\\]\\s*\\+\\s*dp\\[i\\s*-\\s*1\\]\\[\\s*c\\s*-\\s*w\\[i\\]\\s*\\]"],
        hint: "Skip: dp[i - 1][c]. Take: v[i] + dp[i - 1][c - w[i]] — the previous row, with the weight taken off the capacity.",
        success:
          "Correct. Both branches read the previous row and never the current one, which is what keeps each item usable at most once.",
      },
      solution: `for (int i = 1; i <= n; i++) {
  for (int c = 0; c <= W; c++) {
    dp[i][c] = dp[i - 1][c];
    if (w[i] <= c)
      dp[i][c] = MAX(dp[i][c], v[i] + dp[i - 1][c - w[i]]);
  }
}`,
    },

    python: {
      example: `dp = [[0] * (W + 1) for _ in range(n + 1)]

for i in range(1, n + 1):
    for c in range(W + 1):
        dp[i][c] = dp[i - 1][c]                       # skip
        if w[i] <= c:
            dp[i][c] = max(dp[i][c],
                           v[i] + dp[i - 1][c - w[i]])  # take

# one row, walking capacity DOWNWARDS
for i in range(1, n + 1):
    for c in range(W, w[i] - 1, -1):
        dp[c] = max(dp[c], v[i] + dp[c - w[i]])`,
      notes: [
        { token: "dp[i][c]", meaning: "best value from the first i items with capacity c" },
        { token: "[[0] * (W+1) for _ in range(n+1)]", meaning: "the RIGHT way to build a 2D table" },
        { token: "[[0] * (W+1)] * (n+1)", meaning: "WRONG. Every row is the same list, so all rows change together" },
        { token: "c downwards", meaning: "so each item is used at most once in the one-row version" },
      ],
      vizCode: `for i in range(1, n + 1):
    for c in range(W + 1):
        dp[i][c] = dp[i-1][c]                    # skip item i
        if w[i] <= c:
            dp[i][c] = max(dp[i][c],
                           v[i] + dp[i-1][c-w[i]])  # take item i`,
      prompt:
        "Write the knapsack transition: the skip branch, then the take branch when the item fits.",
      starter: `for i in range(1, n + 1):
    for c in range(W + 1):
        dp[i][c] = 
        if w[i] <= c:
            dp[i][c] = max(dp[i][c], )`,
      rules: {
        regex: ["dp\\[i\\s*-\\s*1\\]\\[c\\]", "v\\[i\\]\\s*\\+\\s*dp\\[i\\s*-\\s*1\\]\\[\\s*c\\s*-\\s*w\\[i\\]\\s*\\]"],
        hint: "Skip: dp[i - 1][c]. Take: v[i] + dp[i - 1][c - w[i]].",
        success:
          "Correct. Build the table with a comprehension, never [[0] * W] * n — that makes n names for ONE row, so writing to dp[1][0] changes every row at once.",
      },
      solution: `for i in range(1, n + 1):
    for c in range(W + 1):
        dp[i][c] = dp[i - 1][c]
        if w[i] <= c:
            dp[i][c] = max(dp[i][c], v[i] + dp[i - 1][c - w[i]])`,
    },

    java: {
      example: `int[][] dp = new int[n + 1][W + 1];

for (int i = 1; i <= n; i++)
  for (int c = 0; c <= W; c++) {
    dp[i][c] = dp[i - 1][c];                          // skip
    if (w[i] <= c)
      dp[i][c] = Math.max(dp[i][c],
                          v[i] + dp[i - 1][c - w[i]]);  // take
  }`,
      notes: [
        { token: "dp[i][c]", meaning: "best value from the first i items with capacity c" },
        { token: "new int[n+1][W+1]", meaning: "Java builds a real 2D array and zeroes it for you" },
        { token: "dp[i-1][c]", meaning: "the skip branch" },
        { token: "memory", meaning: "an int is 4 bytes, so 10⁴ x 10⁴ is already 400 MB" },
      ],
      vizCode: `for (int i = 1; i <= n; i++)
  for (int c = 0; c <= W; c++) {
    dp[i][c] = dp[i-1][c];                       // skip item i
    if (w[i] <= c)
      dp[i][c] = Math.max(dp[i][c],
                          v[i] + dp[i-1][c-w[i]]); // take item i
  }`,
      starter: `for (int i = 1; i <= n; i++) {
  for (int c = 0; c <= W; c++) {
    dp[i][c] = ;
    if (w[i] <= c)
      dp[i][c] = Math.max(dp[i][c], );
  }
}`,
      rules: {
        regex: ["dp\\[i\\s*-\\s*1\\]\\[c\\]", "v\\[i\\]\\s*\\+\\s*dp\\[i\\s*-\\s*1\\]\\[\\s*c\\s*-\\s*w\\[i\\]\\s*\\]"],
        hint: "Skip: dp[i - 1][c]. Take: v[i] + dp[i - 1][c - w[i]].",
        success:
          "Correct. Java's new int[n+1][W+1] arrives already zeroed, so unlike C++ there is no separate step to clear the table.",
      },
      solution: `for (int i = 1; i <= n; i++) {
  for (int c = 0; c <= W; c++) {
    dp[i][c] = dp[i - 1][c];
    if (w[i] <= c)
      dp[i][c] = Math.max(dp[i][c], v[i] + dp[i - 1][c - w[i]]);
  }
}`,
    },

    javascript: {
      example: `const dp = Array.from({ length: n + 1 },
                      () => new Array(W + 1).fill(0));

for (let i = 1; i <= n; i++)
  for (let c = 0; c <= W; c++) {
    dp[i][c] = dp[i - 1][c];                          // skip
    if (w[i] <= c)
      dp[i][c] = Math.max(dp[i][c],
                          v[i] + dp[i - 1][c - w[i]]);  // take
  }`,
      notes: [
        { token: "dp[i][c]", meaning: "best value from the first i items with capacity c" },
        { token: "Array.from({length}, () => ...)", meaning: "the RIGHT way to build a 2D table" },
        { token: "new Array(n).fill(new Array(W))", meaning: "WRONG. Every row is the same array" },
        { token: "Int32Array", meaning: "much less memory than a normal array for big tables" },
      ],
      vizCode: `for (let i = 1; i <= n; i++)
  for (let c = 0; c <= W; c++) {
    dp[i][c] = dp[i-1][c];                       // skip item i
    if (w[i] <= c)
      dp[i][c] = Math.max(dp[i][c],
                          v[i] + dp[i-1][c-w[i]]); // take item i
  }`,
      prompt:
        "Write the knapsack transition: the skip branch, then the take branch when the item fits.",
      starter: `for (let i = 1; i <= n; i++) {
  for (let c = 0; c <= W; c++) {
    dp[i][c] = ;
    if (w[i] <= c)
      dp[i][c] = Math.max(dp[i][c], );
  }
}`,
      rules: {
        regex: ["dp\\[i\\s*-\\s*1\\]\\[c\\]", "v\\[i\\]\\s*\\+\\s*dp\\[i\\s*-\\s*1\\]\\[\\s*c\\s*-\\s*w\\[i\\]\\s*\\]"],
        hint: "Skip: dp[i - 1][c]. Take: v[i] + dp[i - 1][c - w[i]].",
        success:
          "Correct. Build the table with Array.from — .fill(new Array(W)) puts the SAME array in every row, so writing one cell changes the whole column.",
      },
      solution: `for (let i = 1; i <= n; i++) {
  for (let c = 0; c <= W; c++) {
    dp[i][c] = dp[i - 1][c];
    if (w[i] <= c)
      dp[i][c] = Math.max(dp[i][c], v[i] + dp[i - 1][c - w[i]]);
  }
}`,
    },

    rust: {
      example: `let mut dp = vec![vec![0i64; W + 1]; n + 1];

for i in 1..=n {
    for c in 0..=W {
        dp[i][c] = dp[i - 1][c];                       // skip
        if w[i] <= c {
            dp[i][c] = dp[i][c].max(v[i] + dp[i - 1][c - w[i]]);  // take
        }
    }
}`,
      notes: [
        { token: "dp[i][c]", meaning: "best value from the first i items with capacity c" },
        { token: "vec![vec![0; W+1]; n+1]", meaning: "each row is its own Vec — no sharing bug possible" },
        { token: "dp[i][c].max(...)", meaning: "max is a method on the value" },
        { token: "w[i] <= c first", meaning: "c - w[i] on a usize would go below zero otherwise" },
      ],
      vizCode: `for i in 1..=n {
  for c in 0..=W {
    dp[i][c] = dp[i-1][c];                      // skip item i
    if w[i] <= c {
      dp[i][c] = dp[i][c].max(
                   v[i] + dp[i-1][c - w[i]]); } // take item i
  } }`,
      prompt:
        "Write the knapsack transition: the skip branch, then the take branch when the item fits.",
      starter: `for i in 1..=n {
    for c in 0..=W {
        dp[i][c] = ;
        if w[i] <= c {
            dp[i][c] = dp[i][c].max();
        }
    }
}`,
      rules: {
        regex: ["dp\\[i\\s*-\\s*1\\]\\[c\\]", "v\\[i\\]\\s*\\+\\s*dp\\[i\\s*-\\s*1\\]\\[\\s*c\\s*-\\s*w\\[i\\]\\s*\\]"],
        hint: "Skip: dp[i - 1][c]. Take: v[i] + dp[i - 1][c - w[i]].",
        success:
          "Correct, and the w[i] <= c guard is doing double duty in Rust: it is both the fits check and what stops c - w[i] going below zero on a usize.",
      },
      solution: `for i in 1..=n {
    for c in 0..=W {
        dp[i][c] = dp[i - 1][c];
        if w[i] <= c {
            dp[i][c] = dp[i][c].max(v[i] + dp[i - 1][c - w[i]]);
        }
    }
}`,
    },
  },

  strings: {
    c: {
      example: `for (int i = 1; i <= n; i++)
  for (int j = 1; j <= m; j++)
    if (s[i - 1] == t[j - 1])
      dp[i][j] = 1 + dp[i - 1][j - 1];        /* match — go diagonal */
    else
      dp[i][j] = MAX(dp[i - 1][j], dp[i][j - 1]);`,
      notes: [
        { token: "s[i - 1]", meaning: "the table is 1-indexed, the string is 0-indexed" },
        { token: "1 + dp[i-1][j-1]", meaning: "both strings use the matching letter" },
        { token: "max of two neighbours", meaning: "give up a letter from one side or the other" },
        { token: "edit distance", meaning: "same grid, but the minimum of three neighbours plus one" },
      ],
      vizCode: `for (int i = 1; i <= n; i++)
  for (int j = 1; j <= m; j++)
    if (s[i-1] == t[j-1]) dp[i][j] = 1 + dp[i-1][j-1];
    else                  dp[i][j] = MAX(dp[i-1][j], dp[i][j-1]);`,
      starter: `for (int i = 1; i <= n; i++)
  for (int j = 1; j <= m; j++)
    if (s[i - 1] == t[j - 1])
      dp[i][j] = ;
    else
      dp[i][j] = ;`,
      rules: {
        regex: ["1\\s*\\+\\s*dp\\[i\\s*-\\s*1\\]\\[j\\s*-\\s*1\\]", "MAX\\s*\\(\\s*dp\\[i\\s*-\\s*1\\]\\[j\\]\\s*,\\s*dp\\[i\\]\\[j\\s*-\\s*1\\]\\s*\\)"],
        hint: "On a match: 1 + dp[i - 1][j - 1]. Otherwise: MAX(dp[i - 1][j], dp[i][j - 1]).",
        success:
          "Correct. Learn this grid well — LCS, edit distance and diff tools are all the same table with a different rule inside.",
      },
      solution: `for (int i = 1; i <= n; i++)
  for (int j = 1; j <= m; j++)
    if (s[i - 1] == t[j - 1])
      dp[i][j] = 1 + dp[i - 1][j - 1];
    else
      dp[i][j] = MAX(dp[i - 1][j], dp[i][j - 1]);`,
    },

    python: {
      example: `dp = [[0] * (m + 1) for _ in range(n + 1)]

for i in range(1, n + 1):
    for j in range(1, m + 1):
        if s[i - 1] == t[j - 1]:
            dp[i][j] = 1 + dp[i - 1][j - 1]      # match — go diagonal
        else:
            dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])`,
      notes: [
        { token: "s[i - 1]", meaning: "the table is 1-indexed, the string is 0-indexed" },
        { token: "1 + dp[i-1][j-1]", meaning: "both strings use the matching letter" },
        { token: "max of two neighbours", meaning: "give up a letter from one side or the other" },
        { token: "difflib", meaning: "Python's built-in diff, which is this idea already written" },
      ],
      vizCode: `for i in range(1, n + 1):
  for j in range(1, m + 1):
    if s[i-1] == t[j-1]: dp[i][j] = 1 + dp[i-1][j-1]
    else:                dp[i][j] = max(dp[i-1][j], dp[i][j-1])`,
      prompt:
        "Write the LCS transition: diagonal plus one on a match, otherwise the better of the two neighbours.",
      starter: `for i in range(1, n + 1):
    for j in range(1, m + 1):
        if s[i - 1] == t[j - 1]:
            dp[i][j] = 
        else:
            dp[i][j] = `,
      rules: {
        regex: ["1\\s*\\+\\s*dp\\[i\\s*-\\s*1\\]\\[j\\s*-\\s*1\\]", "max\\s*\\(\\s*dp\\[i\\s*-\\s*1\\]\\[j\\]\\s*,\\s*dp\\[i\\]\\[j\\s*-\\s*1\\]\\s*\\)"],
        hint: "On a match: 1 + dp[i - 1][j - 1]. Otherwise: max(dp[i - 1][j], dp[i][j - 1]).",
        success:
          "Correct. Two nested Python loops over 10⁴ x 10⁴ is 10⁸ steps and will be slow — for large inputs this is where people reach for numpy or PyPy.",
      },
      solution: `for i in range(1, n + 1):
    for j in range(1, m + 1):
        if s[i - 1] == t[j - 1]:
            dp[i][j] = 1 + dp[i - 1][j - 1]
        else:
            dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])`,
    },

    java: {
      example: `int[][] dp = new int[n + 1][m + 1];

for (int i = 1; i <= n; i++)
  for (int j = 1; j <= m; j++)
    if (s.charAt(i - 1) == t.charAt(j - 1))
      dp[i][j] = 1 + dp[i - 1][j - 1];         // match — go diagonal
    else
      dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);`,
      notes: [
        { token: "s.charAt(i - 1)", meaning: "the table is 1-indexed, the string is 0-indexed" },
        { token: "1 + dp[i-1][j-1]", meaning: "both strings use the matching letter" },
        { token: "max of two neighbours", meaning: "give up a letter from one side or the other" },
        { token: "s.toCharArray() first", meaning: "faster than calling charAt in a tight double loop" },
      ],
      vizCode: `for (int i = 1; i <= n; i++)
  for (int j = 1; j <= m; j++)
    if (s.charAt(i-1) == t.charAt(j-1)) dp[i][j] = 1 + dp[i-1][j-1];
    else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);`,
      starter: `for (int i = 1; i <= n; i++)
  for (int j = 1; j <= m; j++)
    if (s.charAt(i - 1) == t.charAt(j - 1))
      dp[i][j] = ;
    else
      dp[i][j] = ;`,
      rules: {
        regex: ["1\\s*\\+\\s*dp\\[i\\s*-\\s*1\\]\\[j\\s*-\\s*1\\]", "Math\\.max\\s*\\(\\s*dp\\[i\\s*-\\s*1\\]\\[j\\]\\s*,\\s*dp\\[i\\]\\[j\\s*-\\s*1\\]\\s*\\)"],
        hint: "On a match: 1 + dp[i - 1][j - 1]. Otherwise: Math.max(dp[i - 1][j], dp[i][j - 1]).",
        success:
          "Correct. Convert both Strings with toCharArray() before the loops — charAt inside a double loop is a real cost on large inputs.",
      },
      solution: `for (int i = 1; i <= n; i++)
  for (int j = 1; j <= m; j++)
    if (s.charAt(i - 1) == t.charAt(j - 1))
      dp[i][j] = 1 + dp[i - 1][j - 1];
    else
      dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);`,
    },

    javascript: {
      example: `const dp = Array.from({ length: n + 1 },
                      () => new Array(m + 1).fill(0));

for (let i = 1; i <= n; i++)
  for (let j = 1; j <= m; j++)
    if (s[i - 1] === t[j - 1])
      dp[i][j] = 1 + dp[i - 1][j - 1];         // match — go diagonal
    else
      dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);`,
      notes: [
        { token: "s[i - 1]", meaning: "the table is 1-indexed, the string is 0-indexed" },
        { token: "1 + dp[i-1][j-1]", meaning: "both strings use the matching letter" },
        { token: "max of two neighbours", meaning: "give up a letter from one side or the other" },
        { token: "Int32Array rows", meaning: "far less memory than normal arrays for a big table" },
      ],
      vizCode: `for (let i = 1; i <= n; i++)
  for (let j = 1; j <= m; j++)
    if (s[i-1] === t[j-1]) dp[i][j] = 1 + dp[i-1][j-1];
    else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);`,
      prompt:
        "Write the LCS transition: diagonal plus one on a match, otherwise the better of the two neighbours.",
      starter: `for (let i = 1; i <= n; i++)
  for (let j = 1; j <= m; j++)
    if (s[i - 1] === t[j - 1])
      dp[i][j] = ;
    else
      dp[i][j] = ;`,
      rules: {
        regex: ["1\\s*\\+\\s*dp\\[i\\s*-\\s*1\\]\\[j\\s*-\\s*1\\]", "Math\\.max\\s*\\(\\s*dp\\[i\\s*-\\s*1\\]\\[j\\]\\s*,\\s*dp\\[i\\]\\[j\\s*-\\s*1\\]\\s*\\)"],
        hint: "On a match: 1 + dp[i - 1][j - 1]. Otherwise: Math.max(dp[i - 1][j], dp[i][j - 1]).",
        success:
          "Correct. For a large table use Int32Array rows instead of normal arrays — same code, a fraction of the memory.",
      },
      solution: `for (let i = 1; i <= n; i++)
  for (let j = 1; j <= m; j++)
    if (s[i - 1] === t[j - 1])
      dp[i][j] = 1 + dp[i - 1][j - 1];
    else
      dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);`,
    },

    rust: {
      example: `let (sb, tb) = (s.as_bytes(), t.as_bytes());
let mut dp = vec![vec![0usize; m + 1]; n + 1];

for i in 1..=n {
    for j in 1..=m {
        dp[i][j] = if sb[i - 1] == tb[j - 1] {
            1 + dp[i - 1][j - 1]                 // match — go diagonal
        } else {
            dp[i - 1][j].max(dp[i][j - 1])
        };
    }
}`,
      notes: [
        { token: "s.as_bytes()", meaning: "Rust will not index a &str directly" },
        { token: "1 + dp[i-1][j-1]", meaning: "both strings use the matching letter" },
        { token: "if used as a value", meaning: "the whole if produces the number, so no separate assignment" },
        { token: ".max(...)", meaning: "a method on the value, not a free function" },
      ],
      vizCode: `for i in 1..=n {
  for j in 1..=m {
    if sb[i-1] == tb[j-1] { dp[i][j] = 1 + dp[i-1][j-1]; }
    else { dp[i][j] = dp[i-1][j].max(dp[i][j-1]); } } }`,
      prompt:
        "Write the LCS transition: diagonal plus one on a match, otherwise the better of the two neighbours.",
      starter: `for i in 1..=n {
    for j in 1..=m {
        if sb[i - 1] == tb[j - 1] {
            dp[i][j] = ;
        } else {
            dp[i][j] = ;
        }
    }
}`,
      rules: {
        regex: ["1\\s*\\+\\s*dp\\[i\\s*-\\s*1\\]\\[j\\s*-\\s*1\\]", "dp\\[i\\s*-\\s*1\\]\\[j\\]\\.max\\s*\\(\\s*dp\\[i\\]\\[j\\s*-\\s*1\\]\\s*\\)"],
        hint: "On a match: 1 + dp[i - 1][j - 1]. Otherwise: dp[i - 1][j].max(dp[i][j - 1]).",
        success:
          "Correct. Rust lets the whole if be the value, so you can also write dp[i][j] = if ... { a } else { b }; in one statement.",
      },
      solution: `for i in 1..=n {
    for j in 1..=m {
        if sb[i - 1] == tb[j - 1] {
            dp[i][j] = 1 + dp[i - 1][j - 1];
        } else {
            dp[i][j] = dp[i - 1][j].max(dp[i][j - 1]);
        }
    }
}`,
    },
  },
};

export const NUMBER_THEORY_ALT: ChapterAlt = {
  sieve: {
    c: {
      vizCode: `char *p = malloc(n + 1); memset(p, 1, n + 1);
p[0] = p[1] = 0;

for (long long i = 2; i * i <= n; i++)
  if (p[i])
    for (long long j = i * i; j <= n; j += i)
      p[j] = 0;`,
      example: `char isPrime[MAXN + 1];
memset(isPrime, 1, sizeof(isPrime));
isPrime[0] = isPrime[1] = 0;

for (long long i = 2; i * i <= n; i++)
  if (isPrime[i])
    for (long long j = i * i; j <= n; j += i)
      isPrime[j] = 0;`,
      notes: [
        { token: "isPrime[0] = isPrime[1] = 0", meaning: "0 and 1 are special — set them first" },
        { token: "i * i <= n", meaning: "beyond the square root everything is already crossed out" },
        { token: "j = i * i", meaning: "smaller multiples were handled by smaller primes" },
        { token: "char, not int", meaning: "a quarter of the memory, which matters at 10⁸" },
      ],
      starter: `for (int i = 2; i * i <= n; i++) {
  if (isPrime[i]) {
    for (int j = ; j <= n; ) {
      isPrime[j] = 0;
    }
  }
}`,
      rules: {
        regex: ["j\\s*=\\s*i\\s*\\*\\s*i", "j\\s*\\+=\\s*i"],
        hint: "Start j at i * i and step it by i each lap: j += i.",
        success:
          "Correct. Use char rather than int for the flags — at ten million entries that is 10 MB instead of 40 MB.",
      },
      solution: `for (int i = 2; i * i <= n; i++) {
  if (isPrime[i]) {
    for (int j = i * i; j <= n; j += i) {
      isPrime[j] = 0;
    }
  }
}`,
    },

    python: {
      vizCode: `is_prime = [True] * (n + 1)
is_prime[0] = is_prime[1] = False

for i in range(2, isqrt(n) + 1):
    if is_prime[i]:
        for j in range(i * i, n + 1, i):
            is_prime[j] = False`,
      example: `is_prime = [True] * (n + 1)
is_prime[0] = is_prime[1] = False

i = 2
while i * i <= n:
    if is_prime[i]:
        for j in range(i * i, n + 1, i):
            is_prime[j] = False
    i += 1`,
      notes: [
        { token: "[True] * (n + 1)", meaning: "one flag per number" },
        { token: "range(i*i, n+1, i)", meaning: "start at i squared, step by i" },
        { token: "is_prime[i*i::i] = [False] * len(...)", meaning: "slice assignment. Much faster in Python" },
        { token: "bytearray", meaning: "uses far less memory than a list of booleans" },
      ],
      prompt:
        "Fill in the inner loop of a sieve so it crosses out every multiple of i, starting from i squared.",
      starter: `i = 2
while i * i <= n:
    if is_prime[i]:
        for j in range():
            is_prime[j] = False
    i += 1`,
      rules: {
        regex: ["range\\s*\\(\\s*i\\s*\\*\\s*i\\s*,\\s*n\\s*\\+\\s*1\\s*,\\s*i\\s*\\)"],
        hint: "range(i * i, n + 1, i) — start at i squared, stop after n, step by i.",
        success:
          "Correct. In real Python the slice form is much faster: is_prime[i*i::i] = [False] * len(is_prime[i*i::i]) does the same crossing out in C-speed code.",
      },
      solution: `i = 2
while i * i <= n:
    if is_prime[i]:
        for j in range(i * i, n + 1, i):
            is_prime[j] = False
    i += 1`,
    },

    java: {
      vizCode: `boolean[] p = new boolean[n + 1]; Arrays.fill(p, true);
p[0] = p[1] = false;

for (int i = 2; i * i <= n; i++)
  if (p[i])
    for (int j = i * i; j <= n; j += i)
      p[j] = false;`,
      example: `boolean[] isPrime = new boolean[n + 1];
Arrays.fill(isPrime, true);
isPrime[0] = isPrime[1] = false;

for (long i = 2; i * i <= n; i++)
  if (isPrime[(int) i])
    for (long j = i * i; j <= n; j += i)
      isPrime[(int) j] = false;`,
      notes: [
        { token: "Arrays.fill(isPrime, true)", meaning: "a new boolean[] starts as all false" },
        { token: "i * i <= n", meaning: "beyond the square root everything is already crossed out" },
        { token: "long i", meaning: "i * i overflows int once i passes about 46000" },
        { token: "BitSet", meaning: "one bit per number, when memory is tight" },
      ],
      starter: `for (int i = 2; i * i <= n; i++) {
  if (isPrime[i]) {
    for (int j = ; j <= n; ) {
      isPrime[j] = false;
    }
  }
}`,
      rules: {
        regex: ["j\\s*=\\s*i\\s*\\*\\s*i", "j\\s*\\+=\\s*i"],
        hint: "Start j at i * i and step it by i each lap: j += i.",
        success:
          "Correct — and mind the types on large limits. With int, i * i overflows once i passes about 46000 and the loop then behaves strangely.",
      },
      solution: `for (int i = 2; i * i <= n; i++) {
  if (isPrime[i]) {
    for (int j = i * i; j <= n; j += i) {
      isPrime[j] = false;
    }
  }
}`,
    },

    javascript: {
      vizCode: `const isPrime = new Uint8Array(n + 1).fill(1);
isPrime[0] = isPrime[1] = 0;

for (let i = 2; i * i <= n; i++)
  if (isPrime[i])
    for (let j = i * i; j <= n; j += i)
      isPrime[j] = 0;`,
      example: `const isPrime = new Uint8Array(n + 1).fill(1);
isPrime[0] = isPrime[1] = 0;

for (let i = 2; i * i <= n; i++)
  if (isPrime[i])
    for (let j = i * i; j <= n; j += i)
      isPrime[j] = 0;`,
      notes: [
        { token: "Uint8Array", meaning: "one byte per flag. A normal array would use far more" },
        { token: "i * i <= n", meaning: "beyond the square root everything is already crossed out" },
        { token: "j = i * i", meaning: "smaller multiples were handled by smaller primes" },
        { token: "i * i past 2^53", meaning: "stops being exact. Fine for any sieve you can actually run" },
      ],
      prompt:
        "Fill in the inner loop of a sieve so it crosses out every multiple of i, starting from i squared.",
      starter: `for (let i = 2; i * i <= n; i++) {
  if (isPrime[i]) {
    for (let j = ; j <= n; ) {
      isPrime[j] = 0;
    }
  }
}`,
      rules: {
        regex: ["j\\s*=\\s*i\\s*\\*\\s*i", "j\\s*\\+=\\s*i"],
        hint: "Start j at i * i and step it by i each lap: j += i.",
        success:
          "Correct. Use a typed array such as Uint8Array for the flags — a normal JavaScript array of booleans uses several times the memory.",
      },
      solution: `for (let i = 2; i * i <= n; i++) {
  if (isPrime[i]) {
    for (let j = i * i; j <= n; j += i) {
      isPrime[j] = 0;
    }
  }
}`,
    },

    rust: {
      vizCode: `let mut is_prime = vec![true; n + 1];
is_prime[0] = false; is_prime[1] = false;

for i in 2..=n.isqrt() {
    if is_prime[i] {
        for j in (i * i..=n).step_by(i) {
            is_prime[j] = false;
        }
    }
}`,
      example: `let mut is_prime = vec![true; n + 1];
is_prime[0] = false;
is_prime[1] = false;

let mut i = 2usize;
while i * i <= n {
    if is_prime[i] {
        let mut j = i * i;
        while j <= n { is_prime[j] = false; j += i; }
    }
    i += 1;
}`,
      notes: [
        { token: "vec![true; n + 1]", meaning: "one flag per number" },
        { token: "i * i <= n", meaning: "beyond the square root everything is already crossed out" },
        { token: "(i*i..=n).step_by(i)", meaning: "the iterator form, if you prefer a for loop" },
        { token: "i * i overflow", meaning: "a debug build stops the program, which is a useful warning" },
      ],
      prompt:
        "Fill in the inner loop of a sieve so it crosses out every multiple of i, starting from i squared. Use a for loop with step_by.",
      starter: `let mut i = 2usize;
while i * i <= n {
    if is_prime[i] {
        for j in  {
            is_prime[j] = false;
        }
    }
    i += 1;
}`,
      rules: {
        regex: ["\\(\\s*i\\s*\\*\\s*i\\s*\\..?=\\s*n\\s*\\)\\.step_by\\s*\\(\\s*i\\s*\\)"],
        hint: "Write for j in (i * i..=n).step_by(i) — start at i squared, include n, step by i.",
        success:
          "Correct. step_by is Rust's version of a third loop argument, and it reads more clearly than a hand-written while with j += i.",
      },
      solution: `let mut i = 2usize;
while i * i <= n {
    if is_prime[i] {
        for j in (i * i..=n).step_by(i) {
            is_prime[j] = false;
        }
    }
    i += 1;
}`,
    },
  },

  fastpow: {
    c: {
      vizCode: `long long power(long long a, long long n, long long m) {
  long long result = 1;
  a %= m;
  while (n > 0) {
    if (n & 1) result = result * a % m;
    a = a * a % m;
    n >>= 1;
  }
  return result;
}`,
      example: `long long power(long long a, long long n, long long m) {
  long long result = 1;
  a %= m;
  while (n > 0) {
    if (n & 1) result = result * a % m;   /* odd: take one factor */
    a = a * a % m;                        /* square the base */
    n >>= 1;                              /* halve the exponent */
  }
  return result;
}`,
      notes: [
        { token: "n & 1", meaning: "is the exponent odd? (last bit set)" },
        { token: "a = a * a % m", meaning: "square the base, stay inside the modulus" },
        { token: "n >>= 1", meaning: "halve the exponent — 20 steps for a million" },
        { token: "long long", meaning: "10⁹ x 10⁹ needs 60 bits; int has 31" },
      ],
      starter: `long long power(long long a, long long n, long long m) {
  long long result = 1;
  a %= m;
  while (n > 0) {
    if ( ) result = ;
    a = ;
    n = ;
  }
  return result;
}`,
      rules: {
        regex: ["n\\s*(&\\s*1|%\\s*2\\s*==\\s*1)", "result\\s*\\*\\s*a\\s*%\\s*m", "a\\s*\\*\\s*a\\s*%\\s*m", "n\\s*(>>\\s*1|/\\s*2)"],
        hint:
          "if (n & 1) result = result * a % m; then a = a * a % m; then n = n >> 1; — every line takes a modulus so nothing overflows.",
        success:
          "Correct. This same function gives you a modular inverse: when m is prime, the inverse of a is power(a, m - 2, m).",
      },
      solution: `long long power(long long a, long long n, long long m) {
  long long result = 1;
  a %= m;
  while (n > 0) {
    if (n & 1) result = result * a % m;
    a = a * a % m;
    n = n >> 1;
  }
  return result;
}`,
    },

    python: {
      vizCode: `def power(a, n, m):
    result = 1
    a %= m
    while n > 0:
        if n & 1: result = result * a % m
        a = a * a % m
        n >>= 1
    return result
# or simply: pow(a, n, m)`,
      example: `def power(a, n, m):
    result = 1
    a %= m
    while n > 0:
        if n & 1:
            result = result * a % m    # odd: take one factor
        a = a * a % m                  # square the base
        n >>= 1                        # halve the exponent
    return result


# Python already has it, and it is faster
pow(a, n, m)`,
      notes: [
        { token: "pow(a, n, m)", meaning: "built in, three arguments. Use this in real code" },
        { token: "n & 1", meaning: "is the exponent odd? (last bit set)" },
        { token: "no overflow", meaning: "Python integers grow, so the % is for speed, not safety" },
        { token: "pow(a, -1, m)", meaning: "the modular inverse, since Python 3.8" },
      ],
      prompt:
        "Write fast exponentiation by hand: multiply into result when the exponent is odd, square the base, halve the exponent. Do not use pow with three arguments.",
      starter: `def power(a, n, m):
    result = 1
    a %= m
    while n > 0:
        if :
            result = 
        a = 
        n = 
    return result`,
      rules: {
        mustNot: ["pow("],
        regex: ["n\\s*(&\\s*1|%\\s*2\\s*==\\s*1)", "result\\s*\\*\\s*a\\s*%\\s*m", "a\\s*\\*\\s*a\\s*%\\s*m", "n\\s*(>>\\s*1|//\\s*2)"],
        hint: "if n & 1: result = result * a % m. Then a = a * a % m, and n = n >> 1.",
        success:
          "Correct. In real code just write pow(a, n, m) — it is built in, written in C, and pow(a, -1, m) even gives you the modular inverse.",
      },
      solution: `def power(a, n, m):
    result = 1
    a %= m
    while n > 0:
        if n & 1:
            result = result * a % m
        a = a * a % m
        n = n >> 1
    return result`,
    },

    java: {
      vizCode: `static long power(long a, long n, long m) {
  long result = 1;
  a %= m;
  while (n > 0) {
    if ((n & 1) == 1) result = result * a % m;
    a = a * a % m;
    n >>= 1;
  }
  return result;
}`,
      example: `static long power(long a, long n, long m) {
  long result = 1;
  a %= m;
  while (n > 0) {
    if ((n & 1) == 1) result = result * a % m;   // odd: take one factor
    a = a * a % m;                               // square the base
    n >>= 1;                                     // halve the exponent
  }
  return result;
}`,
      notes: [
        { token: "(n & 1) == 1", meaning: "Java needs the == 1, since an int is not a boolean" },
        { token: "a = a * a % m", meaning: "square the base, stay inside the modulus" },
        { token: "long", meaning: "10⁹ x 10⁹ needs 60 bits; int has 31" },
        { token: "BigInteger.modPow", meaning: "already written, for when the numbers are truly huge" },
      ],
      starter: `static long power(long a, long n, long m) {
  long result = 1;
  a %= m;
  while (n > 0) {
    if ( ) result = ;
    a = ;
    n = ;
  }
  return result;
}`,
      rules: {
        regex: ["\\(\\s*n\\s*&\\s*1\\s*\\)\\s*==\\s*1|n\\s*%\\s*2\\s*==\\s*1", "result\\s*\\*\\s*a\\s*%\\s*m", "a\\s*\\*\\s*a\\s*%\\s*m", "n\\s*(>>\\s*1|/\\s*2)"],
        hint: "if ((n & 1) == 1) result = result * a % m; then a = a * a % m; then n = n >> 1;",
        success:
          "Correct. Java will not accept a number where it wants a boolean, so the == 1 is required — unlike C and C++, where non-zero already means true.",
      },
      solution: `static long power(long a, long n, long m) {
  long result = 1;
  a %= m;
  while (n > 0) {
    if ((n & 1) == 1) result = result * a % m;
    a = a * a % m;
    n = n >> 1;
  }
  return result;
}`,
    },

    javascript: {
      vizCode: `function power(a, n, m) {
  let result = 1n;
  a %= m;
  while (n > 0n) {
    if (n & 1n) result = result * a % m;
    a = a * a % m;
    n >>= 1n;
  }
  return result;
}   // BigInt — a Number loses exactness past 2^53`,
      example: `// Numbers past 2^53 are not exact, so modular arithmetic needs BigInt.
function power(a, n, m) {
  a = BigInt(a); n = BigInt(n); m = BigInt(m);
  let result = 1n;
  a %= m;
  while (n > 0n) {
    if (n & 1n) result = result * a % m;   // odd: take one factor
    a = a * a % m;                         // square the base
    n >>= 1n;                              // halve the exponent
  }
  return result;
}`,
      notes: [
        { token: "BigInt", meaning: "required here. Normal numbers lose precision past 2^53" },
        { token: "1n, 0n", meaning: "the n suffix makes a BigInt literal" },
        { token: "n & 1n", meaning: "bitwise ops on BigInt do NOT cut to 32 bits" },
        { token: "mixing BigInt and Number", meaning: "throws a TypeError. Convert everything first" },
      ],
      prompt:
        "Write fast exponentiation using BigInt: multiply into result when the exponent is odd, square the base, halve the exponent.",
      starter: `function power(a, n, m) {
  let result = 1n;
  a %= m;
  while (n > 0n) {
    if ( ) result = ;
    a = ;
    n = ;
  }
  return result;
}`,
      rules: {
        regex: ["n\\s*&\\s*1n", "result\\s*\\*\\s*a\\s*%\\s*m", "a\\s*\\*\\s*a\\s*%\\s*m", "n\\s*>>\\s*1n"],
        hint: "if (n & 1n) result = result * a % m; then a = a * a % m; then n = n >> 1n. Every literal needs the n suffix.",
        success:
          "Correct, and BigInt is not optional here. With normal numbers, a * a for a near 10⁹ passes 2^53 and the result is quietly wrong.",
      },
      solution: `function power(a, n, m) {
  let result = 1n;
  a %= m;
  while (n > 0n) {
    if (n & 1n) result = result * a % m;
    a = a * a % m;
    n = n >> 1n;
  }
  return result;
}`,
    },

    rust: {
      vizCode: `fn power(mut a: u64, mut n: u64, m: u64) -> u64 {
    let mut result = 1u64;
    a %= m;
    while n > 0 {
        if n & 1 == 1 { result = result * a % m; }
        a = a * a % m;
        n >>= 1;
    }
    result
}`,
      example: `fn power(mut a: u64, mut n: u64, m: u64) -> u64 {
    let mut result = 1u64;
    a %= m;
    while n > 0 {
        if n & 1 == 1 { result = result * a % m; }   // odd: take one factor
        a = a * a % m;                               // square the base
        n >>= 1;                                     // halve the exponent
    }
    result
}`,
      notes: [
        { token: "n & 1 == 1", meaning: "Rust needs the == 1, since a number is not a bool" },
        { token: "u64", meaning: "10⁹ x 10⁹ needs 60 bits. u128 is safer for a big modulus" },
        { token: "overflow", meaning: "a debug build stops the program rather than wrapping quietly" },
        { token: "result", meaning: "last line, no semicolon — this is the value handed back" },
      ],
      starter: `fn power(mut a: u64, mut n: u64, m: u64) -> u64 {
    let mut result = 1u64;
    a %= m;
    while n > 0 {
        if  { result = ; }
        a = ;
        n = ;
    }
    result
}`,
      rules: {
        regex: ["n\\s*&\\s*1\\s*==\\s*1", "result\\s*\\*\\s*a\\s*%\\s*m", "a\\s*\\*\\s*a\\s*%\\s*m", "n\\s*>>\\s*1"],
        hint: "if n & 1 == 1 { result = result * a % m; } then a = a * a % m; then n = n >> 1;",
        success:
          "Correct. For a modulus near 10⁹ consider u128 for the multiply — u64 is just wide enough, and Rust will stop the program in a debug build if it is not.",
      },
      solution: `fn power(mut a: u64, mut n: u64, m: u64) -> u64 {
    let mut result = 1u64;
    a %= m;
    while n > 0 {
        if n & 1 == 1 { result = result * a % m; }
        a = a * a % m;
        n = n >> 1;
    }
    result
}`,
    },
  },
};

export const TRIE_ALT: ChapterAlt = {
  build: {
    c: {
      example: `struct Node {
  struct Node *kid[26];
  int isEnd;
};

struct Node *newNode(void) {
  return calloc(1, sizeof(struct Node));   /* calloc zeroes it */
}

void insert(struct Node *root, const char *w) {
  struct Node *cur = root;
  for (int k = 0; w[k]; k++) {
    int i = w[k] - 'a';
    if (!cur->kid[i]) cur->kid[i] = newNode();
    cur = cur->kid[i];
  }
  cur->isEnd = 1;
}`,
      notes: [
        { token: "kid[26]", meaning: "one slot per letter. The index is c - 'a'" },
        { token: "isEnd", meaning: "tells a stored word from a prefix passing through" },
        { token: "calloc", meaning: "zeroes the memory, so every kid starts as NULL" },
        { token: "freeing it", meaning: "needs its own recursive walk. Easy to forget" },
      ],
      vizCode: `struct Node { struct Node *kid[26]; int isEnd; };

/* insert: walk letter by letter, create what is missing */
/* search: walk the same path; missing kid means not found */`,
      starter: `struct Node *cur = root;

for (int k = 0; w[k]; k++) {
  int i = w[k] - 'a';
  if (!cur->kid[i]) ;
  cur = ;
}
cur-> = 1;`,
      rules: {
        regex: ["cur->kid\\[i\\]\\s*=\\s*newNode\\s*\\(\\s*\\)", "cur\\s*=\\s*cur->kid\\[i\\]", "cur->isEnd\\s*=\\s*1"],
        hint: "Create with cur->kid[i] = newNode(); step with cur = cur->kid[i]; finish with cur->isEnd = 1.",
        success:
          "Correct. Use calloc rather than malloc — it zeroes the memory, so every child pointer starts as NULL instead of holding rubbish.",
      },
      solution: `struct Node *cur = root;

for (int k = 0; w[k]; k++) {
  int i = w[k] - 'a';
  if (!cur->kid[i]) cur->kid[i] = newNode();
  cur = cur->kid[i];
}
cur->isEnd = 1;`,
    },

    python: {
      example: `# In Python a trie is usually nested dicts — no class needed.
root = {}

def insert(w):
    cur = root
    for c in w:
        cur = cur.setdefault(c, {})   # create if missing, then step
    cur["#"] = True                   # marks the end of a word


def search(w):
    cur = root
    for c in w:
        if c not in cur:
            return False
        cur = cur[c]
    return "#" in cur`,
      notes: [
        { token: "setdefault(c, {})", meaning: "creates the child if missing and returns it, in one call" },
        { token: '"#" key', meaning: "marks a whole word. Any key a letter cannot be would do" },
        { token: "nested dicts", meaning: "far less memory than 26 slots per node when words are sparse" },
        { token: "defaultdict trick", meaning: "Trie = lambda: defaultdict(Trie) makes it one line" },
      ],
      vizCode: `root = {}   # nested dicts

# insert: walk letter by letter, create what is missing
# search: walk the same path; missing key means not found`,
      prompt:
        "Write the insert walk using nested dicts: create the child if missing, step into it, then mark the end of the word.",
      starter: `cur = root

for c in w:
    cur = 

cur[] = True`,
      rules: {
        regex: ["cur\\.setdefault\\s*\\(\\s*c\\s*,\\s*\\{\\s*\\}\\s*\\)|cur\\[c\\]", 'cur\\s*\\[\\s*"#"\\s*\\]\\s*=\\s*True'],
        hint: 'Step with cur = cur.setdefault(c, {}) — it creates the child if missing. Finish with cur["#"] = True.',
        success:
          "Correct. setdefault does the check and the creation in one call, which is why a Python trie needs no class at all.",
      },
      solution: `cur = root

for c in w:
    cur = cur.setdefault(c, {})

cur["#"] = True`,
    },

    java: {
      example: `class Node {
  Node[] kid = new Node[26];
  boolean isEnd = false;
}

void insert(Node root, String w) {
  Node cur = root;
  for (char c : w.toCharArray()) {
    int i = c - 'a';
    if (cur.kid[i] == null) cur.kid[i] = new Node();
    cur = cur.kid[i];
  }
  cur.isEnd = true;
}`,
      notes: [
        { token: "Node[] kid = new Node[26]", meaning: "Java fills it with nulls for you" },
        { token: "isEnd", meaning: "tells a stored word from a prefix passing through" },
        { token: "26 slots per node", meaning: "a lot of memory when the words are sparse" },
        { token: "Map<Character, Node>", meaning: "smaller, slower. Pick based on the word set" },
      ],
      vizCode: `class Node { Node[] kid = new Node[26]; boolean isEnd; }

// insert: walk letter by letter, create what is missing
// search: walk the same path; missing kid means not found`,
      starter: `Node cur = root;

for (char c : w.toCharArray()) {
  int i = c - 'a';
  if (cur.kid[i] == null) ;
  cur = ;
}
cur. = true;`,
      rules: {
        regex: ["cur\\.kid\\[i\\]\\s*=\\s*new\\s+Node", "cur\\s*=\\s*cur\\.kid\\[i\\]", "cur\\.isEnd\\s*=\\s*true"],
        hint: "Create with cur.kid[i] = new Node(); step with cur = cur.kid[i]; finish with cur.isEnd = true.",
        success:
          "Correct. Java zeroes a new object array to nulls, so unlike C there is no separate step to clear the children.",
      },
      solution: `Node cur = root;

for (char c : w.toCharArray()) {
  int i = c - 'a';
  if (cur.kid[i] == null) cur.kid[i] = new Node();
  cur = cur.kid[i];
}
cur.isEnd = true;`,
    },

    javascript: {
      example: `// A plain object per node is the usual JavaScript trie.
const root = {};

function insert(w) {
  let cur = root;
  for (const c of w) {
    if (!cur[c]) cur[c] = {};
    cur = cur[c];
  }
  cur.isEnd = true;
}`,
      notes: [
        { token: "cur[c] = {}", meaning: "create the child if missing" },
        { token: "cur.isEnd", meaning: "tells a stored word from a prefix passing through" },
        { token: "a name clash", meaning: 'a word containing "isEnd" would collide. Use a Map to be safe' },
        { token: "new Map()", meaning: "keeps letters and the end-flag properly apart" },
      ],
      vizCode: `const root = {};   // one object per node

// insert: walk letter by letter, create what is missing
// search: walk the same path; missing key means not found`,
      prompt:
        "Write the insert walk: create the child if missing, step into it, then mark the end of the word.",
      starter: `let cur = root;

for (const c of w) {
  if (!cur[c]) ;
  cur = ;
}
cur. = true;`,
      rules: {
        regex: ["cur\\[c\\]\\s*=\\s*\\{\\s*\\}", "cur\\s*=\\s*cur\\[c\\]", "cur\\.isEnd\\s*=\\s*true"],
        hint: "Create with cur[c] = {}; step with cur = cur[c]; finish with cur.isEnd = true.",
        success:
          "Correct — with one caveat. Storing letters and isEnd on the same object means a word containing that exact text would clash, so a Map is safer for real input.",
      },
      solution: `let cur = root;

for (const c of w) {
  if (!cur[c]) cur[c] = {};
  cur = cur[c];
}
cur.isEnd = true;`,
    },

    rust: {
      example: `use std::collections::HashMap;

#[derive(Default)]
struct Node {
    kids: HashMap<char, Node>,
    is_end: bool,
}

fn insert(root: &mut Node, w: &str) {
    let mut cur = root;
    for c in w.chars() {
        cur = cur.kids.entry(c).or_default();   // create if missing, then step
    }
    cur.is_end = true;
}`,
      notes: [
        { token: ".entry(c).or_default()", meaning: "creates the child if missing and hands it back" },
        { token: "#[derive(Default)]", meaning: "lets or_default build an empty Node for you" },
        { token: "HashMap over [Option<Box<Node>>; 26]", meaning: "far less memory for sparse words" },
        { token: "is_end", meaning: "tells a stored word from a prefix passing through" },
      ],
      vizCode: `struct Node { kids: HashMap<char, Node>, is_end: bool }

// insert: walk letter by letter, create what is missing
// search: walk the same path; missing kid means not found`,
      prompt:
        "Write the insert walk: create the child if missing, step into it, then mark the end of the word.",
      starter: `let mut cur = root;

for c in w.chars() {
    cur = ;
}
cur. = true;`,
      rules: {
        regex: ["cur\\.kids\\.entry\\s*\\(\\s*c\\s*\\)\\.or_default\\s*\\(\\s*\\)", "cur\\.is_end\\s*=\\s*true"],
        hint: "Step with cur = cur.kids.entry(c).or_default(); finish with cur.is_end = true.",
        success:
          "Correct. entry().or_default() is the whole insert in one expression — it finds or creates the child and hands back a mutable reference to it.",
      },
      solution: `let mut cur = root;

for c in w.chars() {
    cur = cur.kids.entry(c).or_default();
}
cur.is_end = true;`,
    },
  },
};

export const STRING_MATCHING_ALT: ChapterAlt = {
  lps: {
    c: {
      example: `void buildLps(const char *p, int m, int lps[]) {
  lps[0] = 0;
  int len = 0;
  for (int i = 1; i < m; ) {
    if (p[i] == p[len])      lps[i++] = ++len;
    else if (len > 0)        len = lps[len - 1];   /* fall back, no i++ */
    else                     lps[i++] = 0;
  }
}`,
      notes: [
        { token: "lps[0] = 0", meaning: "one character has no proper prefix that is also a suffix" },
        { token: "len = lps[len - 1]", meaning: "fall back to the next best prefix" },
        { token: "no i++ on the fall-back", meaning: "re-test the same character against a shorter prefix" },
      ],
      vizCode: `lps[0] = 0;
int len = 0;
for (int i = 1; i < m; ) {
  if (p[i] == p[len]) lps[i++] = ++len;
  else if (len)       len = lps[len - 1];
  else                lps[i++] = 0;
}`,
      starter: `int lps[MAXM] = {0};
int len = 0;

for (int i = 1; i < m; ) {
  if (p[i] == p[len])   lps[i++] = ;
  else if (len > 0)     len = ;
  else                  lps[i++] = 0;
}`,
      rules: {
        regex: ["lps\\[i\\+\\+\\]\\s*=\\s*\\+\\+len", "len\\s*=\\s*lps\\[\\s*len\\s*-\\s*1\\s*\\]"],
        hint: "On a match write lps[i++] = ++len. On a mismatch write len = lps[len - 1], leaving i alone.",
        success:
          "Correct. Leaving i alone on the fall-back is the crux — the same character is re-tested against a shorter prefix, which is what keeps this linear.",
      },
      solution: `int lps[MAXM] = {0};
int len = 0;

for (int i = 1; i < m; ) {
  if (p[i] == p[len])   lps[i++] = ++len;
  else if (len > 0)     len = lps[len - 1];
  else                  lps[i++] = 0;
}`,
    },

    python: {
      example: `def build_lps(p):
    m = len(p)
    lps = [0] * m
    length = 0
    i = 1
    while i < m:
        if p[i] == p[length]:
            length += 1
            lps[i] = length
            i += 1
        elif length > 0:
            length = lps[length - 1]     # fall back, do NOT advance i
        else:
            lps[i] = 0
            i += 1
    return lps`,
      notes: [
        { token: "lps[0] = 0", meaning: "one character has no proper prefix that is also a suffix" },
        { token: "length = lps[length - 1]", meaning: "fall back to the next best prefix" },
        { token: "no i += 1 on the fall-back", meaning: "re-test the same character against a shorter prefix" },
        { token: "no ++ in Python", meaning: "so the grow and the store are two lines instead of one" },
      ],
      vizCode: `lps[0] = 0
length = 0
i = 1
while i < m:
    if p[i] == p[length]: length += 1; lps[i] = length; i += 1
    elif length > 0:      length = lps[length - 1]
    else:                 lps[i] = 0; i += 1`,
      prompt:
        "Complete the LPS build. On a match, extend and record. On a mismatch with a run in progress, fall back without advancing i.",
      starter: `lps = [0] * m
length = 0
i = 1

while i < m:
    if p[i] == p[length]:
        
        lps[i] = length
        i += 1
    elif length > 0:
        length = 
    else:
        lps[i] = 0
        i += 1`,
      rules: {
        regex: ["length\\s*\\+=\\s*1", "length\\s*=\\s*lps\\[\\s*length\\s*-\\s*1\\s*\\]"],
        hint: "On a match, length += 1 first, then store it. On a mismatch, length = lps[length - 1] and leave i alone.",
        success:
          "Correct. Python has no ++len, so the grow and the store must be separate lines — which actually makes the order clearer than the C++ one-liner.",
      },
      solution: `lps = [0] * m
length = 0
i = 1

while i < m:
    if p[i] == p[length]:
        length += 1
        lps[i] = length
        i += 1
    elif length > 0:
        length = lps[length - 1]
    else:
        lps[i] = 0
        i += 1`,
    },

    java: {
      example: `static int[] buildLps(String p) {
  int m = p.length();
  int[] lps = new int[m];
  int len = 0;
  for (int i = 1; i < m; ) {
    if (p.charAt(i) == p.charAt(len))  lps[i++] = ++len;
    else if (len > 0)                  len = lps[len - 1];
    else                               lps[i++] = 0;
  }
  return lps;
}`,
      notes: [
        { token: "lps[0] = 0", meaning: "a new int[] starts at 0, so this is already right" },
        { token: "len = lps[len - 1]", meaning: "fall back to the next best prefix" },
        { token: "no i++ on the fall-back", meaning: "re-test the same character against a shorter prefix" },
        { token: "toCharArray first", meaning: "faster than charAt in a tight loop" },
      ],
      vizCode: `lps[0] = 0;
int len = 0;
for (int i = 1; i < m; ) {
  if (p.charAt(i) == p.charAt(len)) lps[i++] = ++len;
  else if (len > 0)                 len = lps[len - 1];
  else                              lps[i++] = 0;
}`,
      starter: `int[] lps = new int[m];
int len = 0;

for (int i = 1; i < m; ) {
  if (p.charAt(i) == p.charAt(len))  lps[i++] = ;
  else if (len > 0)                  len = ;
  else                               lps[i++] = 0;
}`,
      rules: {
        regex: ["lps\\[i\\+\\+\\]\\s*=\\s*\\+\\+len", "len\\s*=\\s*lps\\[\\s*len\\s*-\\s*1\\s*\\]"],
        hint: "On a match write lps[i++] = ++len. On a mismatch write len = lps[len - 1], leaving i alone.",
        success:
          "Correct. Java keeps C's ++ operators, so the one-line form carries over exactly — including the trap of writing len++ instead of ++len.",
      },
      solution: `int[] lps = new int[m];
int len = 0;

for (int i = 1; i < m; ) {
  if (p.charAt(i) == p.charAt(len))  lps[i++] = ++len;
  else if (len > 0)                  len = lps[len - 1];
  else                               lps[i++] = 0;
}`,
    },

    javascript: {
      example: `function buildLps(p) {
  const m = p.length;
  const lps = new Array(m).fill(0);
  let len = 0;
  for (let i = 1; i < m; ) {
    if (p[i] === p[len])   lps[i++] = ++len;
    else if (len > 0)      len = lps[len - 1];
    else                   lps[i++] = 0;
  }
  return lps;
}`,
      notes: [
        { token: ".fill(0)", meaning: "without it the slots are undefined, not 0" },
        { token: "len = lps[len - 1]", meaning: "fall back to the next best prefix" },
        { token: "no i++ on the fall-back", meaning: "re-test the same character against a shorter prefix" },
        { token: "p[i]", meaning: "indexing a string works and gives a one-letter string" },
      ],
      vizCode: `lps[0] = 0;
let len = 0;
for (let i = 1; i < m; ) {
  if (p[i] === p[len]) lps[i++] = ++len;
  else if (len > 0)    len = lps[len - 1];
  else                 lps[i++] = 0;
}`,
      prompt:
        "Complete the LPS build. On a match, extend and record. On a mismatch with a run in progress, fall back without advancing i.",
      starter: `const lps = new Array(m).fill(0);
let len = 0;

for (let i = 1; i < m; ) {
  if (p[i] === p[len])   lps[i++] = ;
  else if (len > 0)      len = ;
  else                   lps[i++] = 0;
}`,
      rules: {
        regex: ["lps\\[i\\+\\+\\]\\s*=\\s*\\+\\+len", "len\\s*=\\s*lps\\[\\s*len\\s*-\\s*1\\s*\\]"],
        hint: "On a match write lps[i++] = ++len. On a mismatch write len = lps[len - 1], leaving i alone.",
        success:
          "Correct. JavaScript keeps ++ too, so this reads the same as C++ — and the .fill(0) is what stops the untouched slots being undefined.",
      },
      solution: `const lps = new Array(m).fill(0);
let len = 0;

for (let i = 1; i < m; ) {
  if (p[i] === p[len])   lps[i++] = ++len;
  else if (len > 0)      len = lps[len - 1];
  else                   lps[i++] = 0;
}`,
    },

    rust: {
      example: `fn build_lps(p: &[u8]) -> Vec<usize> {
    let m = p.len();
    let mut lps = vec![0usize; m];
    let mut len = 0usize;
    let mut i = 1usize;
    while i < m {
        if p[i] == p[len] {
            len += 1;
            lps[i] = len;
            i += 1;
        } else if len > 0 {
            len = lps[len - 1];      // fall back, do NOT advance i
        } else {
            lps[i] = 0;
            i += 1;
        }
    }
    lps
}`,
      notes: [
        { token: "no ++ in Rust", meaning: "so the grow and the store are separate lines" },
        { token: "len = lps[len - 1]", meaning: "fall back to the next best prefix" },
        { token: "no i += 1 on the fall-back", meaning: "re-test the same character against a shorter prefix" },
        { token: "len > 0 first", meaning: "required — lps[len - 1] on a usize 0 would stop the program" },
      ],
      vizCode: `lps[0] = 0;
let mut len = 0; let mut i = 1;
while i < m {
    if p[i] == p[len] { len += 1; lps[i] = len; i += 1; }
    else if len > 0   { len = lps[len - 1]; }
    else              { lps[i] = 0; i += 1; }
}`,
      prompt:
        "Complete the LPS build. On a match, extend and record. On a mismatch with a run in progress, fall back without advancing i.",
      starter: `let mut lps = vec![0usize; m];
let mut len = 0usize;
let mut i = 1usize;

while i < m {
    if p[i] == p[len] {
        
        lps[i] = len;
        i += 1;
    } else if len > 0 {
        len = ;
    } else {
        lps[i] = 0;
        i += 1;
    }
}`,
      rules: {
        regex: ["len\\s*\\+=\\s*1", "len\\s*=\\s*lps\\[\\s*len\\s*-\\s*1\\s*\\]"],
        hint: "On a match, len += 1 first, then store it. On a mismatch, len = lps[len - 1] and leave i alone.",
        success:
          "Correct, and the len > 0 test is doing real work in Rust: with len at 0, lps[len - 1] would go below zero on a usize and stop the program on the spot.",
      },
      solution: `let mut lps = vec![0usize; m];
let mut len = 0usize;
let mut i = 1usize;

while i < m {
    if p[i] == p[len] {
        len += 1;
        lps[i] = len;
        i += 1;
    } else if len > 0 {
        len = lps[len - 1];
    } else {
        lps[i] = 0;
        i += 1;
    }
}`,
    },
  },
};

export const RANGE_QUERY_ALT: ChapterAlt = {
  segtree: {
    c: {
      example: `long long tree[4 * MAXN];

void build(int node, int l, int r) {
  if (l == r) { tree[node] = a[l]; return; }
  int m = (l + r) / 2;
  build(2*node, l, m);
  build(2*node + 1, m + 1, r);
  tree[node] = tree[2*node] + tree[2*node + 1];
}`,
      notes: [
        { token: "4 * MAXN", meaning: "the safe size. The tree is not perfectly complete" },
        { token: "no overlap -> identity", meaning: "0 for sums, INT_MAX for minimums" },
        { token: "fully inside -> stored value", meaning: "this is where the log n comes from" },
        { token: "2*node, 2*node+1", meaning: "children, with the root at index 1" },
      ],
      vizCode: `void build(int node, int l, int r) {
  if (l == r) { tree[node] = a[l]; return; }
  int m = (l + r) / 2;
  build(2*node, l, m);
  build(2*node+1, m+1, r);
  tree[node] = tree[2*node] + tree[2*node+1];
}`,
      starter: `long long query(int node, int l, int r, int ql, int qr) {
  if ( ) return 0;
  if ( ) return tree[node];
  int m = (l + r) / 2;
  return query(2*node, l, m, ql, qr) + query(2*node+1, m+1, r, ql, qr);
}`,
      rules: {
        regex: ["qr\\s*<\\s*l\\s*\\|\\|\\s*r\\s*<\\s*ql", "ql\\s*<=\\s*l\\s*&&\\s*r\\s*<=\\s*qr"],
        hint: "No overlap when qr < l || r < ql. Fully covered when ql <= l && r <= qr.",
        success:
          "Correct. The fully-covered case is what keeps this at O(log n): once a node sits inside the question, its whole subtree is answered in one read.",
      },
      solution: `long long query(int node, int l, int r, int ql, int qr) {
  if (qr < l || r < ql) return 0;
  if (ql <= l && r <= qr) return tree[node];
  int m = (l + r) / 2;
  return query(2*node, l, m, ql, qr) + query(2*node+1, m+1, r, ql, qr);
}`,
    },

    python: {
      example: `tree = [0] * (4 * n)

def build(node, l, r):
    if l == r:
        tree[node] = a[l]
        return
    m = (l + r) // 2
    build(2 * node, l, m)
    build(2 * node + 1, m + 1, r)
    tree[node] = tree[2 * node] + tree[2 * node + 1]`,
      notes: [
        { token: "4 * n", meaning: "the safe size. The tree is not perfectly complete" },
        { token: "(l + r) // 2", meaning: "must be //, since an index cannot be a decimal" },
        { token: "recursion limit", meaning: "the depth is only log n, so this is safe" },
        { token: "an iterative segment tree", meaning: "much faster in Python, and half the code" },
      ],
      vizCode: `def build(node, l, r):
    if l == r: tree[node] = a[l]; return
    m = (l + r) // 2
    build(2*node, l, m)
    build(2*node+1, m+1, r)
    tree[node] = tree[2*node] + tree[2*node+1]`,
      prompt:
        "Write the two early exits of a segment tree query: no overlap, and fully covered.",
      starter: `def query(node, l, r, ql, qr):
    if :
        return 0
    if :
        return tree[node]
    m = (l + r) // 2
    return query(2*node, l, m, ql, qr) + query(2*node+1, m+1, r, ql, qr)`,
      rules: {
        regex: ["qr\\s*<\\s*l\\s+or\\s+r\\s*<\\s*ql", "ql\\s*<=\\s*l\\s+and\\s+r\\s*<=\\s*qr"],
        hint: "No overlap when qr < l or r < ql. Fully covered when ql <= l and r <= qr.",
        success:
          "Correct. Python's function calls are slow, so for a big segment tree the iterative version is worth learning — it is both shorter and much faster.",
      },
      solution: `def query(node, l, r, ql, qr):
    if qr < l or r < ql:
        return 0
    if ql <= l and r <= qr:
        return tree[node]
    m = (l + r) // 2
    return query(2*node, l, m, ql, qr) + query(2*node+1, m+1, r, ql, qr)`,
    },

    java: {
      example: `long[] tree = new long[4 * n];

static void build(int node, int l, int r) {
  if (l == r) { tree[node] = a[l]; return; }
  int m = (l + r) / 2;
  build(2*node, l, m);
  build(2*node + 1, m + 1, r);
  tree[node] = tree[2*node] + tree[2*node + 1];
}`,
      notes: [
        { token: "new long[4 * n]", meaning: "the safe size, and Java zeroes it for you" },
        { token: "no overlap -> identity", meaning: "0 for sums, Long.MAX_VALUE for minimums" },
        { token: "fully inside -> stored value", meaning: "this is where the log n comes from" },
        { token: "long, not int", meaning: "range sums pass 2 billion easily" },
      ],
      vizCode: `static void build(int node, int l, int r) {
  if (l == r) { tree[node] = a[l]; return; }
  int m = (l + r) / 2;
  build(2*node, l, m);
  build(2*node+1, m+1, r);
  tree[node] = tree[2*node] + tree[2*node+1];
}`,
      starter: `static long query(int node, int l, int r, int ql, int qr) {
  if ( ) return 0;
  if ( ) return tree[node];
  int m = (l + r) / 2;
  return query(2*node, l, m, ql, qr) + query(2*node+1, m+1, r, ql, qr);
}`,
      rules: {
        regex: ["qr\\s*<\\s*l\\s*\\|\\|\\s*r\\s*<\\s*ql", "ql\\s*<=\\s*l\\s*&&\\s*r\\s*<=\\s*qr"],
        hint: "No overlap when qr < l || r < ql. Fully covered when ql <= l && r <= qr.",
        success:
          "Correct. Make the tree long[] rather than int[] — a segment tree over 10⁵ values near a billion overflows an int at the root almost immediately.",
      },
      solution: `static long query(int node, int l, int r, int ql, int qr) {
  if (qr < l || r < ql) return 0;
  if (ql <= l && r <= qr) return tree[node];
  int m = (l + r) / 2;
  return query(2*node, l, m, ql, qr) + query(2*node+1, m+1, r, ql, qr);
}`,
    },

    javascript: {
      example: `const tree = new Array(4 * n).fill(0);

function build(node, l, r) {
  if (l === r) { tree[node] = a[l]; return; }
  const m = (l + r) >> 1;
  build(2*node, l, m);
  build(2*node + 1, m + 1, r);
  tree[node] = tree[2*node] + tree[2*node + 1];
}`,
      notes: [
        { token: "(l + r) >> 1", meaning: "halves and floors in one step" },
        { token: ".fill(0)", meaning: "without it the slots are undefined and the sums become NaN" },
        { token: "past 2^53", meaning: "the totals stop being exact. Use BigInt if needed" },
        { token: "Float64Array", meaning: "faster than a normal array for a large tree" },
      ],
      vizCode: `function build(node, l, r) {
  if (l === r) { tree[node] = a[l]; return; }
  const m = (l + r) >> 1;
  build(2*node, l, m);
  build(2*node+1, m+1, r);
  tree[node] = tree[2*node] + tree[2*node+1];
}`,
      prompt:
        "Write the two early exits of a segment tree query: no overlap, and fully covered.",
      starter: `function query(node, l, r, ql, qr) {
  if ( ) return 0;
  if ( ) return tree[node];
  const m = (l + r) >> 1;
  return query(2*node, l, m, ql, qr) + query(2*node+1, m+1, r, ql, qr);
}`,
      rules: {
        regex: ["qr\\s*<\\s*l\\s*\\|\\|\\s*r\\s*<\\s*ql", "ql\\s*<=\\s*l\\s*&&\\s*r\\s*<=\\s*qr"],
        hint: "No overlap when qr < l || r < ql. Fully covered when ql <= l && r <= qr.",
        success:
          "Correct. Note (l + r) >> 1 rather than / 2 — a decimal index would quietly read undefined and poison the whole tree with NaN.",
      },
      solution: `function query(node, l, r, ql, qr) {
  if (qr < l || r < ql) return 0;
  if (ql <= l && r <= qr) return tree[node];
  const m = (l + r) >> 1;
  return query(2*node, l, m, ql, qr) + query(2*node+1, m+1, r, ql, qr);
}`,
    },

    rust: {
      example: `let mut tree = vec![0i64; 4 * n];

fn build(tree: &mut Vec<i64>, a: &[i64], node: usize, l: usize, r: usize) {
    if l == r { tree[node] = a[l]; return; }
    let m = (l + r) / 2;
    build(tree, a, 2*node, l, m);
    build(tree, a, 2*node + 1, m + 1, r);
    tree[node] = tree[2*node] + tree[2*node + 1];
}`,
      notes: [
        { token: "vec![0i64; 4 * n]", meaning: "the safe size. The tree is not perfectly complete" },
        { token: "&mut Vec<i64>", meaning: "passed down, because Rust has no globals to lean on" },
        { token: "i64", meaning: "range sums overflow i32, and a debug build then panics" },
        { token: "root at index 1", meaning: "so 2*node and 2*node+1 give the children" },
      ],
      vizCode: `fn build(node: usize, l: usize, r: usize) {
    if l == r { tree[node] = a[l]; return; }
    let m = (l + r) / 2;
    build(2*node, l, m);
    build(2*node+1, m+1, r);
    tree[node] = tree[2*node] + tree[2*node+1];
}`,
      prompt:
        "Write the two early exits of a segment tree query: no overlap, and fully covered.",
      starter: `fn query(node: usize, l: usize, r: usize, ql: usize, qr: usize) -> i64 {
    if  { return 0; }
    if  { return tree[node]; }
    let m = (l + r) / 2;
    query(2*node, l, m, ql, qr) + query(2*node+1, m+1, r, ql, qr)
}`,
      rules: {
        regex: ["qr\\s*<\\s*l\\s*\\|\\|\\s*r\\s*<\\s*ql", "ql\\s*<=\\s*l\\s*&&\\s*r\\s*<=\\s*qr"],
        hint: "No overlap when qr < l || r < ql. Fully covered when ql <= l && r <= qr.",
        success:
          "Correct. Rust makes you pass the tree and the array down explicitly rather than reaching for globals — noisier to write, and it makes the data flow obvious.",
      },
      solution: `fn query(node: usize, l: usize, r: usize, ql: usize, qr: usize) -> i64 {
    if qr < l || r < ql { return 0; }
    if ql <= l && r <= qr { return tree[node]; }
    let m = (l + r) / 2;
    query(2*node, l, m, ql, qr) + query(2*node+1, m+1, r, ql, qr)
}`,
    },
  },
};
