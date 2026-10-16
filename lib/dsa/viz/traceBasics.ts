// Tracers for the first chapters: loops, decisions, functions, growth, and
// recursion. Each one runs the algorithm for real and records a frame per step.

import { row, vars, type Cell, type Frame, type Viz, type VizEdge, type VizNode } from "@/lib/dsa/viz/types";

/* ------------------------------------------------------- input / output -- */

export const IO_VIZ: Viz = {
  title: "cin and cout, one line at a time",
  blurb: "cin fills a box from the keyboard. cout empties a box onto the screen.",
  code: `int a, b;
cin >> a >> b;
int sum = a + b;
cout << sum;`,
  frames: [
    {
      say: "Two empty boxes are made. Nothing is inside them yet.",
      line: 1,
      rowLabel: "memory",
      row: [
        { v: "?", i: "a" },
        { v: "?", i: "b" },
      ],
      out: "",
    },
    {
      say: "You type 4 and press space. cin drops 4 into a.",
      line: 2,
      rowLabel: "memory",
      row: [
        { v: "4", i: "a", tone: "active" },
        { v: "?", i: "b" },
      ],
      vars: vars({ typed: "4 9" }),
      out: "",
    },
    {
      say: "The same cin line keeps reading. 9 goes into b.",
      line: 2,
      rowLabel: "memory",
      row: [
        { v: "4", i: "a", tone: "done" },
        { v: "9", i: "b", tone: "active" },
      ],
      vars: vars({ typed: "4 9" }),
      out: "",
    },
    {
      say: "a + b is worked out first, then the answer is put in sum.",
      line: 3,
      rowLabel: "memory",
      row: [
        { v: "4", i: "a", tone: "compare" },
        { v: "9", i: "b", tone: "compare" },
        { v: "13", i: "sum", tone: "good" },
      ],
      out: "",
    },
    {
      say: "cout copies what is in sum onto the screen. The box still holds 13.",
      line: 4,
      rowLabel: "memory",
      row: [
        { v: "4", i: "a", tone: "done" },
        { v: "9", i: "b", tone: "done" },
        { v: "13", i: "sum", tone: "good" },
      ],
      out: "13",
    },
  ],
};

/* ------------------------------------------------------------ decisions -- */

export function traceIfElse(marks: number[]): Viz {
  const code = `for (int m : marks) {
  if (m >= 90)      cout << "A ";
  else if (m >= 50) cout << "Pass ";
  else              cout << "Fail ";
}`;
  const frames: Frame[] = [];
  let out = "";
  marks.forEach((m, i) => {
    const base = row(marks, { [i]: "active" });
    frames.push({
      say: `Look at ${m}. First question: is ${m} at least 90?`,
      line: 2,
      row: base,
      vars: vars({ m }),
      out,
    });
    if (m >= 90) {
      out += "A ";
      frames.push({
        say: `Yes. Print A and skip every else below it.`,
        line: 2,
        row: row(marks, { [i]: "good" }),
        vars: vars({ m }),
        out,
      });
      return;
    }
    frames.push({
      say: `No. Only now does C++ ask the next question: is ${m} at least 50?`,
      line: 3,
      row: base,
      vars: vars({ m }),
      out,
    });
    if (m >= 50) {
      out += "Pass ";
      frames.push({
        say: "Yes. Print Pass. The final else never runs.",
        line: 3,
        row: row(marks, { [i]: "good" }),
        vars: vars({ m }),
        out,
      });
    } else {
      out += "Fail ";
      frames.push({
        say: "No again. else is the catch-all, so Fail is printed.",
        line: 4,
        row: row(marks, { [i]: "bad" }),
        vars: vars({ m }),
        out,
      });
    }
  });
  frames.push({
    say: "Every mark took exactly one road. That is what else means.",
    row: row(marks, {}, { index: true }),
    out,
  });
  return {
    title: "if / else if / else picks exactly one road",
    blurb: "Watch how a question is only asked when every question above it said no.",
    code,
    frames,
  };
}

/* ---------------------------------------------------------------- loops -- */

export function traceForLoop(n: number): Viz {
  const code = `for (int i = 1; i <= ${n}; i++) {
  cout << i << " ";
}`;
  const frames: Frame[] = [];
  let out = "";
  frames.push({
    say: "i is born and set to 1. This happens once, never again.",
    line: 1,
    row: row(Array.from({ length: n }, (_, k) => k + 1), { 0: "compare" }, { index: false }),
    vars: vars({ i: 1 }),
    out,
  });
  for (let i = 1; i <= n; i++) {
    const tones: Record<number, "done" | "active"> = {};
    for (let k = 0; k < i - 1; k++) tones[k] = "done";
    tones[i - 1] = "active";
    frames.push({
      say: `Check the gate: is ${i} <= ${n}? Yes, so the body runs.`,
      line: 1,
      row: row(Array.from({ length: n }, (_, k) => k + 1), tones, { index: false }),
      vars: vars({ i }),
      out,
    });
    out += `${i} `;
    frames.push({
      say: `Print ${i}. Then i++ turns i into ${i + 1} and we go back to the gate.`,
      line: 2,
      row: row(Array.from({ length: n }, (_, k) => k + 1), tones, { index: false }),
      vars: vars({ i, "after i++": i + 1 }),
      out,
    });
  }
  frames.push({
    say: `Now i is ${n + 1}. The gate ${n + 1} <= ${n} is false, so the loop lets go.`,
    line: 1,
    row: row(Array.from({ length: n }, (_, k) => k + 1), Object.fromEntries(Array.from({ length: n }, (_, k) => [k, "done" as const]))),
    vars: vars({ i: n + 1 }),
    out,
  });
  return {
    title: "A for loop is three small promises",
    blurb: "Start once, check every time, step every time. Watch the gate decide.",
    code,
    frames,
  };
}

export function traceWhileLoop(start: number): Viz {
  const code = `int n = ${start};
int steps = 0;
while (n > 1) {
  if (n % 2 == 0) n = n / 2;
  else            n = 3 * n + 1;
  steps++;
}`;
  const frames: Frame[] = [];
  let n = start;
  let steps = 0;
  const seen: number[] = [n];
  frames.push({
    say: `n starts at ${n}. We do not know how many steps this needs — that is why it is a while loop, not a for loop.`,
    line: 1,
    row: row(seen, { 0: "active" }, { index: false }),
    vars: vars({ n, steps }),
  });
  while (n > 1 && steps < 12) {
    const even = n % 2 === 0;
    frames.push({
      say: even ? `${n} is even, so halve it.` : `${n} is odd, so 3 × ${n} + 1.`,
      line: even ? 4 : 5,
      row: row(seen, { [seen.length - 1]: "compare" }, { index: false }),
      vars: vars({ n, steps }),
    });
    n = even ? n / 2 : 3 * n + 1;
    steps++;
    seen.push(n);
    frames.push({
      say: `n is now ${n}. Back to the top: is ${n} still greater than 1?`,
      line: 3,
      row: row(seen, { [seen.length - 1]: "active" }, { index: false }),
      vars: vars({ n, steps }),
    });
  }
  frames.push({
    say: `n reached 1, so the gate is false and the loop stops. It took ${steps} steps — and you could not have known that number in advance.`,
    line: 3,
    row: row(seen, { [seen.length - 1]: "good" }, { index: false }),
    vars: vars({ n, steps }),
  });
  return {
    title: "A while loop runs until something becomes true",
    blurb: "Use while when you cannot count the steps beforehand.",
    code,
    frames,
  };
}

/* ------------------------------------------------------------- function -- */

export function traceFunctionCall(): Viz {
  const code = `int square(int x) {
  return x * x;
}

int main() {
  int r = square(6);
  cout << r;
}`;
  return {
    title: "What really happens when you call a function",
    blurb: "A copy goes in, the caller waits, one value comes back out.",
    code,
    frames: [
      {
        say: "main is running. It reaches square(6) and pauses right there.",
        line: 6,
        nodes: [{ id: "m", label: "main", x: 50, y: 20, tone: "active", sub: "r = ?" }],
        vars: vars({ r: "not set yet" }),
        out: "",
      },
      {
        say: "A new box called x is made for square, and 6 is copied into it.",
        line: 1,
        nodes: [
          { id: "m", label: "main", x: 50, y: 18, tone: "ghost", sub: "waiting" },
          { id: "s", label: "square", x: 50, y: 62, tone: "active", sub: "x = 6" },
        ],
        edges: [{ from: "m", to: "s", tone: "active", arrow: true, label: "6" }],
        vars: vars({ x: 6 }),
        out: "",
      },
      {
        say: "square works out 6 × 6 = 36 and hands it back.",
        line: 2,
        nodes: [
          { id: "m", label: "main", x: 50, y: 18, tone: "ghost", sub: "waiting" },
          { id: "s", label: "square", x: 50, y: 62, tone: "good", sub: "returns 36" },
        ],
        edges: [{ from: "s", to: "m", tone: "good", arrow: true, label: "36" }],
        vars: vars({ x: 6, returns: 36 }),
        out: "",
      },
      {
        say: "square and its x box disappear. main wakes up with 36 in r.",
        line: 6,
        nodes: [{ id: "m", label: "main", x: 50, y: 20, tone: "good", sub: "r = 36" }],
        vars: vars({ r: 36 }),
        out: "",
      },
      {
        say: "main prints r. The work inside square is gone — only its answer survived.",
        line: 7,
        nodes: [{ id: "m", label: "main", x: 50, y: 20, tone: "done", sub: "r = 36" }],
        vars: vars({ r: 36 }),
        out: "36",
      },
    ],
  };
}

/* ----------------------------------------------------------- complexity -- */

const GROWTH_ROWS = [
  { label: "O(1)", f: () => 1 },
  { label: "O(log n)", f: (n: number) => Math.ceil(Math.log2(n)) },
  { label: "O(n)", f: (n: number) => n },
  { label: "O(n log n)", f: (n: number) => Math.round(n * Math.log2(n)) },
  { label: "O(n²)", f: (n: number) => n * n },
];

function shortNum(x: number) {
  if (x < 1000) return String(x);
  if (x < 1e6) return `${Math.round(x / 1000)}k`;
  if (x < 1e9) return `${Math.round(x / 1e6)}M`;
  return `${Math.round(x / 1e9)}B`;
}

export function traceGrowth(): Viz {
  const sizes = [10, 100, 1000, 100_000, 1_000_000];
  const frames: Frame[] = [];
  for (let s = 0; s < sizes.length; s++) {
    const n = sizes[s];
    const grid = GROWTH_ROWS.map((g) =>
      sizes.map((size, c) => {
        const val = g.f(size);
        const tone =
          c > s ? "ghost" : val > 1e8 ? "bad" : val > 1e7 ? "compare" : "good";
        return { v: c > s ? "·" : shortNum(val), tone } as const;
      }),
    );
    frames.push({
      say:
        s === 0
          ? "At n = 10 every method looks the same. This is why small tests hide slow code."
          : n >= 1_000_000
            ? "At a million, O(n²) needs a thousand billion steps — hours. O(n log n) needs 20 million — a blink."
            : `Now n = ${shortNum(n)}. Watch the bottom row pull away from the rest.`,
      gridLabel: "steps needed",
      grid,
      gridRowNames: GROWTH_ROWS.map((g) => g.label),
      gridColNames: sizes.map((x) => `n=${shortNum(x)}`),
      vars: vars({ n: shortNum(n) }),
    });
  }
  frames.push({
    say: "A computer does roughly 100 million simple steps per second. Green fits, orange is tight, red is too slow.",
    gridLabel: "steps needed",
    grid: GROWTH_ROWS.map((g) =>
      sizes.map((size) => {
        const val = g.f(size);
        return {
          v: shortNum(val),
          tone: val > 1e8 ? ("bad" as const) : val > 1e7 ? ("compare" as const) : ("good" as const),
        };
      }),
    ),
    gridRowNames: GROWTH_ROWS.map((g) => g.label),
    gridColNames: sizes.map((x) => `n=${shortNum(x)}`),
  });
  return {
    title: "The same table every interviewer has in their head",
    blurb: "Step through growing input and watch which methods fall off a cliff.",
    frames,
  };
}

/* ------------------------------------------------------------ recursion -- */

export function traceFactorial(n: number): Viz {
  const code = `int fact(int n) {
  if (n == 1) return 1;      // the stop
  return n * fact(n - 1);    // the smaller question
}`;
  const frames: Frame[] = [];
  const stack: VizNode[] = [];
  const y = (depth: number) => 12 + depth * 20;

  for (let k = n; k >= 1; k--) {
    stack.push({ id: `f${k}`, label: `fact(${k})`, x: 50, y: y(n - k), tone: "active", sub: k === 1 ? "hits the stop" : "waiting" });
    frames.push({
      say:
        k === 1
          ? "fact(1) does not call anything. It just returns 1. This is the base case — without it, the pile never ends."
          : `fact(${k}) cannot answer yet. It parks itself and asks fact(${k - 1}).`,
      line: k === 1 ? 2 : 3,
      nodes: stack.map((node, i) => ({ ...node, tone: i === stack.length - 1 ? "active" : "ghost" })),
      edges: stack.slice(1).map((node, i): VizEdge => ({ from: stack[i].id, to: node.id, tone: "active", arrow: true })),
      vars: vars({ "calls waiting": stack.length }),
    });
  }

  let value = 1;
  for (let k = 1; k <= n; k++) {
    value = k === 1 ? 1 : value * k;
    const idx = n - k;
    frames.push({
      say:
        k === 1
          ? "1 travels back up to whoever asked."
          : `fact(${k}) finally multiplies: ${k} × ${value / k} = ${value}.`,
      line: k === 1 ? 2 : 3,
      nodes: stack.map((node, i) => ({
        ...node,
        tone: i > idx ? "ghost" : i === idx ? "good" : "done",
        sub: i === idx ? `= ${value}` : i > idx ? "gone" : node.sub,
      })),
      edges: stack.slice(1).map((node, i): VizEdge => ({ from: stack[i].id, to: node.id, tone: i >= idx ? "ghost" : "good", arrow: true })),
      vars: vars({ "answer so far": value }),
    });
  }
  frames.push({
    say: `The pile is empty and ${n}! = ${value}. Recursion is a pile of paused questions that unwinds when one of them can finally answer.`,
    nodes: [{ id: "done", label: `${value}`, x: 50, y: 30, tone: "good", sub: `${n}!` }],
    vars: vars({ result: value }),
  });
  return {
    title: "Recursion is a pile of paused questions",
    blurb: "First everything goes down and waits. Nothing is answered until the base case is hit.",
    code,
    frames,
  };
}

/* -------------------------------------------------------------- pattern -- */

export function tracePattern(rows: number): Viz {
  const code = `for (int i = 1; i <= ${rows}; i++) {
  for (int j = 1; j <= i; j++) cout << "*";
  cout << endl;
}`;
  const frames: Frame[] = [];
  const grid: Cell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: rows }, (): Cell => ({ v: " ", tone: "ghost" })),
  );
  frames.push({
    say: "Two loops. The outer one picks the line. The inner one fills that line.",
    line: 1,
    gridLabel: "screen",
    grid: grid.map((r) => r.map((c) => ({ ...c }))),
  });
  for (let i = 1; i <= rows; i++) {
    for (let j = 1; j <= i; j++) {
      grid[i - 1][j - 1] = { v: "*", tone: "good" };
      frames.push({
        say: `Line ${i}: the inner loop runs while j <= i, so it prints star number ${j}.`,
        line: 2,
        gridLabel: "screen",
        grid: grid.map((r) => r.map((c) => ({ ...c }))),
        vars: vars({ i, j }),
      });
    }
    frames.push({
      say: `j has passed i, so the inner loop stops and endl moves us to line ${i + 1}.`,
      line: 3,
      gridLabel: "screen",
      grid: grid.map((r) => r.map((c) => ({ ...c }))),
      vars: vars({ i, "stars printed": i }),
    });
  }
  return {
    title: "A pattern is just a loop inside a loop",
    blurb: "The inner loop's limit depends on the outer loop's counter. That is the whole trick.",
    code,
    frames,
  };
}

/* --------------------------------------------------------------- digits -- */

/** Peeling digits off a number with % 10 and / 10, and rebuilding it. */
export function traceDigits(input: number): Viz {
  const code = `int n = ${input}, rev = 0;

while (n > 0) {
  int digit = n % 10;
  rev = rev * 10 + digit;
  n = n / 10;
}`;
  const frames: Frame[] = [];

  const show = (
    say: string,
    n: number,
    rev: number,
    line: number,
    digit: number | null,
    tone: Cell["tone"],
  ) => {
    frames.push({
      say,
      line,
      rowLabel: "n",
      row: String(n).split("").map((c) => ({ v: c, tone: "idle" as const })),
      row2Label: "rev",
      row2: rev === 0
        ? [{ v: "0", tone: "ghost" as const }]
        : String(rev).split("").map((c) => ({ v: c, tone })),
      marks: digit === null ? undefined : [{ at: String(n).length - 1, name: "% 10", tone: "good" }],
      vars: vars(digit === null ? { n, rev } : { n, digit, rev }),
    });
  };

  let n = input;
  let rev = 0;

  show(
    `Two operators do all the work. n starts at ${input}, and rev starts empty — it is the number being built backwards.`,
    n, rev, 1, null, "idle",
  );

  let step = 0;
  while (n > 0) {
    const digit = n % 10;
    step++;

    show(
      `n % 10 gives the LAST digit: ${digit}. The remainder after dividing by ten is exactly the units column.`,
      n, rev, 4, digit, "idle",
    );

    const before = rev;
    rev = rev * 10 + digit;
    show(
      before === 0
        ? `rev * 10 + digit puts ${digit} on the end. rev was 0, so it is just ${rev}.`
        : `rev * 10 shifts ${before} left to ${before * 10}, leaving a zero for the new digit. Add ${digit} and rev is ${rev}.`,
      n, rev, 5, null, "good",
    );

    const dropped = n;
    n = Math.floor(n / 10);
    show(
      `n / 10 DROPS that digit, because integer division throws the remainder away. ${dropped} becomes ${n}.`,
      n === 0 ? 0 : n, rev, 6, null, "active",
    );
  }

  frames.push({
    say: `n has reached 0, so every digit has been peeled. rev is ${rev} — ${input} backwards, built with nothing but % and /.`,
    rowLabel: "n",
    row: [{ v: "0", tone: "ghost" }],
    row2Label: "rev",
    row2: String(rev).split("").map((c) => ({ v: c, tone: "done" as const })),
    vars: vars({ passes: step, result: rev }),
    out: String(rev),
  });

  frames.push({
    say: `And that is the palindrome test: ${input} is a palindrome exactly when rev equals it. Here ${rev} ${rev === input ? "does" : "does not"}, so ${input} is ${rev === input ? "" : "not "}one.`,
    rowLabel: "original",
    row: String(input).split("").map((c) => ({ v: c, tone: "active" as const })),
    row2Label: "reversed",
    row2: String(rev).split("").map((c) => ({ v: c, tone: rev === input ? "good" : "bad" })),
    vars: vars({ palindrome: rev === input ? "yes" : "no" }),
  });

  return {
    title: "Peeling a number apart",
    blurb: "Watch % 10 read the last digit and / 10 throw it away.",
    code,
    frames,
  };
}

/* --------------------------------------------------------------- primes -- */

/** Trial division, and why stopping at the square root is enough. */
export function tracePrimeCheck(n: number): Viz {
  const code = `bool isPrime(long long n) {
  if (n < 2) return false;
  for (long long i = 2; i * i <= n; i++)
    if (n % i == 0) return false;
  return true;
}`;
  const frames: Frame[] = [];
  const root = Math.floor(Math.sqrt(n));

  const bar = (i: number, tone: Cell["tone"], say: string, line: number, extra?: Record<string, string | number>) => {
    const cells: Cell[] = [];
    for (let k = 2; k <= Math.min(root + 3, 12); k++) {
      cells.push({
        v: String(k),
        i: k === root + 1 ? "past √n" : undefined,
        tone: k === i ? tone : k > root ? "ghost" : k < i ? "done" : "idle",
      });
    }
    frames.push({
      say,
      line,
      rowLabel: `divisors to try — √${n} is about ${root}`,
      row: cells,
      vars: vars({ n, i, "i * i": i * i, ...(extra ?? {}) }),
    });
  };

  frames.push({
    say: `Is ${n} prime? The obvious method tries every number from 2 to ${n - 1}. Watch how few we actually need.`,
    rowLabel: "the naive range",
    row: [
      { v: "2", tone: "active" },
      { v: "3", tone: "active" },
      { v: "…", tone: "ghost" },
      { v: String(n - 1), tone: "active" },
    ],
    line: 3,
    vars: vars({ n, "naive checks": n - 2 }),
  });

  frames.push({
    say: `Divisors come in PAIRS. If ${n} divided by 2, it would also divide by ${n / 2} — and one member of every such pair is always at or below √${n}.`,
    rowLabel: "a pair multiplies to n",
    row: [
      { v: "small", i: "≤ √n", tone: "good" },
      { v: "×", tone: "ghost" },
      { v: "large", i: "≥ √n", tone: "compare" },
      { v: `= ${n}`, tone: "active" },
    ],
    vars: vars({ "√n": root }),
  });

  let found: number | null = null;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) {
      found = i;
      bar(i, "bad", `${n} % ${i} is 0 — ${i} divides it, so ${n} is not prime. We can stop immediately.`, 4, { [`${n} % ${i}`]: 0 });
      break;
    }
    bar(i, "compare", `${n} % ${i} is ${n % i}, not 0. ${i} is not a divisor, so keep going.`, 4, { [`${n} % ${i}`]: n % i });
  }

  if (found === null) {
    frames.push({
      say: `i * i has passed ${n}, so the loop stops. Nothing up to √${n} divided it, so nothing above can either — ${n} is prime.`,
      line: 5,
      rowLabel: "checked",
      row: Array.from({ length: Math.min(root - 1, 12) }, (_, k) => ({
        v: String(k + 2),
        tone: "done" as const,
      })),
      vars: vars({ "checks done": root - 1, "checks avoided": n - 2 - (root - 1) }),
      out: "prime",
    });
  }

  frames.push({
    say: `That is the whole saving: ${root - 1} checks instead of ${n - 2}. Write the gate as i * i <= n rather than i <= sqrt(n) — no floating point, and faster.`,
    rowLabel: "checks needed",
    row: [
      { v: String(n - 2), i: "naive", tone: "bad" },
      { v: String(Math.max(root - 1, 1)), i: "to √n", tone: "good" },
    ],
    vars: vars({ answer: found === null ? "prime" : `divisible by ${found}` }),
  });

  return {
    title: "Why the square root is enough",
    blurb: "Watch how few divisors actually have to be tried.",
    code,
    frames,
  };
}

/* ---------------------------------------------------------------- sieve -- */

/** The Sieve of Eratosthenes, crossing out multiples. */
export function traceSieve(limit: number): Viz {
  const code = `vector<bool> isPrime(n + 1, true);
isPrime[0] = isPrime[1] = false;

for (long long i = 2; i * i <= n; i++)
  if (isPrime[i])
    for (long long j = i * i; j <= n; j += i)
      isPrime[j] = false;`;
  const frames: Frame[] = [];
  const isPrime = new Array<boolean>(limit + 1).fill(true);
  isPrime[0] = isPrime[1] = false;

  const draw = (say: string, line: number, hot: number[], cursor: number | null, extra?: Record<string, string | number>) => {
    frames.push({
      say,
      line,
      rowLabel: `numbers 0 to ${limit}`,
      row: isPrime.map((alive, k) => ({
        v: String(k),
        tone: hot.includes(k) ? "bad" : k === cursor ? "good" : alive ? "active" : "ghost",
      })),
      vars: vars(extra ?? {}),
    });
  };

  draw(
    "Stop asking 'is this one prime' over and over. Assume EVERYTHING is prime, then cross out what cannot be.",
    1, [], null, { "still standing": limit - 1 },
  );
  draw("0 and 1 are neither prime nor composite. Cross them out by hand before starting.", 2, [0, 1], null);

  for (let i = 2; i * i <= limit; i++) {
    if (!isPrime[i]) {
      draw(
        `${i} is already crossed out, so it is composite — and every multiple of it was already handled by its own smallest prime factor. Skip it entirely.`,
        5, [], i, { i, action: "skip" },
      );
      continue;
    }

    draw(
      `${i} is still standing, so nothing below it divides it: ${i} is PRIME. Now cross out its multiples.`,
      5, [], i, { i, prime: "yes" },
    );

    const crossed: number[] = [];
    for (let j = i * i; j <= limit; j += i) {
      if (isPrime[j]) crossed.push(j);
      isPrime[j] = false;
    }

    draw(
      i * i > limit
        ? `Starting at ${i} × ${i} = ${i * i} is already past ${limit}, so there is nothing to cross.`
        : `Cross out ${crossed.join(", ")} — every multiple of ${i} from ${i} × ${i} upwards. Starting at ${i * i} rather than ${2 * i} matters: everything smaller was already crossed by a smaller prime.`,
      7, crossed, i, { i, "starts at": i * i, crossed: crossed.length },
    );
  }

  const primes = isPrime.map((p, k) => (p ? k : -1)).filter((k) => k > 0);
  frames.push({
    say: `The outer loop stops at √${limit}, because anything composite left standing would need a factor below that — and there are none. Whatever survives is prime.`,
    rowLabel: "the primes",
    row: isPrime.map((alive, k) => ({
      v: String(k),
      tone: alive ? "good" : "ghost",
    })),
    vars: vars({ found: primes.length }),
    out: primes.join(" "),
  });

  frames.push({
    say: `Each number is crossed out roughly once per distinct prime factor, so the whole sweep is about n log log n — near enough to n that a million primes is instant.`,
    rowLabel: "the primes",
    row: isPrime.map((alive, k) => ({ v: String(k), tone: alive ? "done" : "ghost" })),
    vars: vars({ "one at a time": "n√n", sieve: "n log log n" }),
  });

  return {
    title: "Crossing out instead of testing",
    blurb: "Watch each prime rub out its own multiples, and watch where it starts.",
    code,
    frames,
  };
}

/* -------------------------------------------------------------- fastpow -- */

/** Exponentiation by squaring, driven by the bits of the exponent. */
export function traceFastPow(base: number, exp: number, mod: number): Viz {
  const code = `long long power(long long a, long long n, long long m) {
  long long result = 1;
  a %= m;
  while (n > 0) {
    if (n & 1) result = result * a % m;
    a = a * a % m;
    n >>= 1;
  }
  return result;
}`;
  const frames: Frame[] = [];
  const bits = exp.toString(2);

  const bitRow = (used: number): Cell[] =>
    bits.split("").map((b, i) => ({
      v: b,
      tone: i === bits.length - 1 - used ? "good" : i > bits.length - 1 - used ? "done" : "idle",
    }));

  frames.push({
    say: `${base}^${exp}. Multiplying by ${base} ${exp} times works and is slow. Watch the exponent in binary instead — ${exp} is ${bits}.`,
    rowLabel: `${exp} in binary`,
    row: bits.split("").map((b) => ({ v: b, tone: "active" as const })),
    line: 1,
    vars: vars({ a: base, n: exp, m: mod }),
  });

  frames.push({
    say: `The idea in one line: ${base}^8 is (${base}^4)², and ${base}^4 is (${base}^2)². SQUARING doubles the exponent for the price of one multiplication.`,
    rowLabel: "squaring doubles it",
    row: [
      { v: `a^1`, tone: "idle" },
      { v: `a^2`, tone: "compare" },
      { v: `a^4`, tone: "compare" },
      { v: `a^8`, tone: "good" },
    ],
    vars: vars({ multiplications: 3 }),
  });

  let a = base % mod;
  let n = exp;
  let result = 1;
  let used = 0;
  let mults = 0;

  while (n > 0) {
    const odd = n & 1;
    if (odd) {
      const before = result;
      result = (result * a) % mod;
      mults++;
      frames.push({
        say: `The last bit of n is 1, so this power of ${base} is part of the answer. result = ${before} × ${a} = ${result}.`,
        line: 5,
        rowLabel: `n in binary — reading right to left`,
        row: bitRow(used),
        row2Label: "a, doubling each round",
        row2: [{ v: String(a), i: `a^${2 ** used}`, tone: "good" }],
        vars: vars({ n, "n & 1": 1, a, result }),
      });
    } else {
      frames.push({
        say: `The last bit of n is 0, so this power of ${base} is NOT part of the answer. Skip the multiply and keep squaring.`,
        line: 5,
        rowLabel: `n in binary — reading right to left`,
        row: bitRow(used),
        row2Label: "a, doubling each round",
        row2: [{ v: String(a), i: `a^${2 ** used}`, tone: "ghost" }],
        vars: vars({ n, "n & 1": 0, a, result }),
      });
    }

    const beforeA = a;
    a = (a * a) % mod;
    mults++;
    n >>= 1;
    used++;

    if (n > 0) {
      frames.push({
        say: `Square the base — ${beforeA}² is ${a} — and shift n right, which halves it to ${n}. One round of the loop has doubled the exponent a covers.`,
        line: 7,
        rowLabel: `n in binary — reading right to left`,
        row: bitRow(used),
        row2Label: "a, doubling each round",
        row2: [{ v: String(a), i: `a^${2 ** used}`, tone: "compare" }],
        vars: vars({ n, a, result }),
      });
    }
  }

  frames.push({
    say: `n has reached 0 and the answer is ${result}. ${mults} multiplications instead of ${exp} — and for an exponent of a million that is about 20 instead of a million.`,
    rowLabel: "the bits that counted",
    row: bits.split("").map((b) => ({ v: b, tone: b === "1" ? "good" : "ghost" })),
    vars: vars({ result, multiplications: mults, naive: exp }),
    out: String(result),
  });

  frames.push({
    say: `Two practical notes: reduce with % m after EVERY multiply, and hold everything in long long — two numbers near 10⁹ multiplied together need 60 bits.`,
    rowLabel: "the result",
    row: [{ v: String(result), tone: "done" }],
    vars: vars({ "% m": "after every multiply", type: "long long" }),
  });

  return {
    title: "Squaring instead of multiplying",
    blurb: "Watch the exponent's bits decide which powers get used.",
    code,
    frames,
  };
}
