// Tracers for sequences: arrays, strings, matrices, prefix sums, two pointers
// and sliding windows. All of them walk a real array and record what changed.

import { row, span, vars, type Cell, type Frame, type Tone, type Viz } from "@/lib/dsa/viz/types";

/* ---------------------------------------------------------------- array -- */

export function traceIndexing(a: number[]): Viz {
  const code = `int a[${a.length}] = {${a.join(", ")}};
cout << a[0];
cout << a[2];
cout << a[${a.length - 1}];`;
  const frames: Frame[] = [
    {
      say: "One row, five boxes, side by side in memory. The numbers above are house numbers, not values.",
      line: 1,
      row: row(a),
      out: "",
    },
  ];
  let out = "";
  for (const [line, idx] of [
    [2, 0],
    [3, 2],
    [4, a.length - 1],
  ] as const) {
    out += `${a[idx]} `;
    frames.push({
      say: `a[${idx}] does not search. The computer jumps straight to box ${idx} and finds ${a[idx]}. Same cost whether the array has 5 boxes or 5 million.`,
      line,
      row: row(a, { [idx]: "good" }),
      marks: [{ at: idx, name: `a[${idx}]` }],
      vars: vars({ "steps taken": 1 }),
      out,
    });
  }
  frames.push({
    say: `Counting starts at 0, so the last house number is ${a.length - 1}, never ${a.length}. Asking for a[${a.length}] reads somebody else's memory.`,
    row: row(a, { [a.length - 1]: "compare" }),
    marks: [{ at: a.length - 1, name: "last" }],
    out,
  });
  return {
    title: "An index is an address, not a search",
    blurb: "Watch the jump land in one move every single time.",
    code,
    frames,
  };
}

export function traceScanMax(a: number[]): Viz {
  const code = `int best = a[0];
for (int i = 1; i < n; i++) {
  if (a[i] > best) best = a[i];
}
cout << best;`;
  const frames: Frame[] = [];
  let best = a[0];
  frames.push({
    say: "Remember the first box and pretend it is the winner. You need something to compare against.",
    line: 1,
    row: row(a, { 0: "good" }),
    marks: [{ at: 0, name: "best" }],
    vars: vars({ best }),
  });
  for (let i = 1; i < a.length; i++) {
    const bestIdx = a.indexOf(best);
    frames.push({
      say: `Is ${a[i]} bigger than the ${best} we are holding?`,
      line: 3,
      row: row(a, { ...span(0, i - 1, "done"), [bestIdx]: "good", [i]: "compare" }),
      marks: [
        { at: i, name: "i", tone: "compare" },
        { at: bestIdx, name: "best", tone: "good" },
      ],
      vars: vars({ i, "a[i]": a[i], best }),
    });
    if (a[i] > best) {
      best = a[i];
      frames.push({
        say: `Yes. Forget the old one — ${best} is the new champion.`,
        line: 3,
        row: row(a, { ...span(0, i - 1, "done"), [i]: "good" }),
        marks: [{ at: i, name: "best", tone: "good" }],
        vars: vars({ i, best }),
      });
    } else {
      frames.push({
        say: "No. Keep what we have and move on. We never look back.",
        line: 2,
        row: row(a, { ...span(0, i, "done"), [bestIdx]: "good" }),
        marks: [{ at: bestIdx, name: "best", tone: "good" }],
        vars: vars({ i, best }),
      });
    }
  }
  frames.push({
    say: `The row ended. ${best} is the answer, and we touched every box exactly once — that is O(n).`,
    line: 5,
    row: row(a, { ...span(0, a.length - 1, "done"), [a.indexOf(best)]: "good" }),
    vars: vars({ best, "boxes opened": a.length }),
    out: String(best),
  });
  return {
    title: "One pass, one thing remembered",
    blurb: "The whole method: hold a champion, challenge it once per box.",
    code,
    frames,
  };
}

export function traceReverse(a: number[]): Viz {
  const code = `int i = 0, j = n - 1;
while (i < j) {
  swap(a[i], a[j]);
  i++;
  j--;
}`;
  const arr = [...a];
  const frames: Frame[] = [];
  let i = 0;
  let j = arr.length - 1;
  frames.push({
    say: "Put one finger on each end. No second array is needed.",
    line: 1,
    row: row(arr, { [i]: "active", [j]: "active" }),
    marks: [
      { at: i, name: "i" },
      { at: j, name: "j" },
    ],
    vars: vars({ i, j }),
  });
  while (i < j) {
    frames.push({
      say: `Swap ${arr[i]} and ${arr[j]} — the two ends trade places.`,
      line: 3,
      row: row(arr, { [i]: "compare", [j]: "compare" }),
      marks: [
        { at: i, name: "i" },
        { at: j, name: "j" },
      ],
      vars: vars({ i, j }),
    });
    [arr[i], arr[j]] = [arr[j], arr[i]];
    frames.push({
      say: "Done. Now step both fingers inward.",
      line: 4,
      row: row(arr, { [i]: "done", [j]: "done" }),
      marks: [
        { at: i, name: "i" },
        { at: j, name: "j" },
      ],
      vars: vars({ i, j }),
    });
    i++;
    j--;
  }
  frames.push({
    say: `The fingers met, so every pair has been swapped. Only ${Math.floor(a.length / 2)} swaps for ${a.length} boxes — half the work of copying.`,
    line: 2,
    row: row(arr, span(0, arr.length - 1, "good")),
    vars: vars({ i, j, swaps: Math.floor(a.length / 2) }),
  });
  return {
    title: "Reverse by walking from both ends",
    blurb: "Watch i and j march toward each other and stop when they meet.",
    code,
    frames,
  };
}

/* --------------------------------------------------------------- string -- */

export function tracePalindrome(word: string): Viz {
  const code = `int i = 0, j = s.size() - 1;
while (i < j) {
  if (s[i] != s[j]) return false;
  i++; j--;
}
return true;`;
  const chars = word.split("");
  const frames: Frame[] = [];
  let i = 0;
  let j = chars.length - 1;
  frames.push({
    say: `A string is an array of letters. "${word}" is ${chars.length} boxes, each holding one character.`,
    line: 1,
    row: row(chars, { [i]: "active", [j]: "active" }),
    marks: [
      { at: i, name: "i" },
      { at: j, name: "j" },
    ],
  });
  let ok = true;
  while (i < j) {
    const same = chars[i] === chars[j];
    frames.push({
      say: same
        ? `'${chars[i]}' and '${chars[j]}' match. Keep going.`
        : `'${chars[i]}' is not '${chars[j]}'. One mismatch is enough — answer is no, stop immediately.`,
      line: 3,
      row: row(chars, { ...span(0, i - 1, "done"), ...span(j + 1, chars.length - 1, "done"), [i]: same ? "good" : "bad", [j]: same ? "good" : "bad" }),
      marks: [
        { at: i, name: "i" },
        { at: j, name: "j" },
      ],
      vars: vars({ "s[i]": chars[i], "s[j]": chars[j] }),
    });
    if (!same) {
      ok = false;
      break;
    }
    i++;
    j--;
  }
  frames.push({
    say: ok
      ? `Every pair matched, so "${word}" reads the same both ways.`
      : `"${word}" is not a palindrome, and we knew it before reaching the middle.`,
    line: ok ? 6 : 3,
    row: row(chars, span(0, chars.length - 1, ok ? "good" : "bad")),
    out: ok ? "true" : "false",
  });
  return {
    title: "Checking a word from both ends",
    blurb: "Only half the letters are ever compared — the other half are the same pairs.",
    code,
    frames,
  };
}

export function traceFrequency(word: string): Viz {
  const code = `int count[26] = {0};
for (char c : s) count[c - 'a']++;`;
  const letters = [..."abcdefghijklmnopqrstuvwxyz"];
  const used = [...new Set(word.split(""))].sort();
  const tally: Record<string, number> = Object.fromEntries(used.map((c) => [c, 0]));
  const frames: Frame[] = [];
  const chars = word.split("");
  const shelf = (hot?: string): Cell[] =>
    used.map((c) => ({ v: String(tally[c]), i: c, tone: c === hot ? "good" : tally[c] ? "done" : "idle" }));

  frames.push({
    say: "Make one counter per letter, all starting at zero. This shelf is the whole idea behind hashing.",
    line: 1,
    row: row(chars, {}, { index: false }),
    row2Label: "counters",
    row2: shelf(),
  });
  chars.forEach((c, k) => {
    tally[c]++;
    frames.push({
      say: `'${c}' seen. c - 'a' turns the letter into a shelf number (${letters.indexOf(c)}), and that counter goes up by one.`,
      line: 2,
      row: row(chars, { ...span(0, k - 1, "done"), [k]: "active" }, { index: false }),
      row2Label: "counters",
      row2: shelf(c),
      vars: vars({ c, [`count['${c}']`]: tally[c] }),
    });
  });
  const top = used.reduce((a, b) => (tally[b] > tally[a] ? b : a));
  frames.push({
    say: `One pass over the word and every count is ready. '${top}' appears ${tally[top]} times — and we never compared a letter to another letter.`,
    row: row(chars, span(0, chars.length - 1, "done"), { index: false }),
    row2Label: "counters",
    row2: shelf(top),
  });
  return {
    title: "Counting letters without comparing them",
    blurb: "Turn the thing you are counting into a shelf number, then just add one.",
    code,
    frames,
  };
}

/* --------------------------------------------------------------- matrix -- */

export function traceSpiral(m: number[][]): Viz {
  const code = `int top = 0, bottom = R - 1;
int left = 0, right = C - 1;
while (top <= bottom && left <= right) {
  // right along top, down right side,
  // left along bottom, up left side
}`;
  const R = m.length;
  const C = m[0].length;
  const seen = new Set<string>();
  const frames: Frame[] = [];
  const draw = (hot: string | null, say: string, out: string) => {
    const grid: Cell[][] = m.map((line, r) =>
      line.map((v, c) => ({
        v: String(v),
        tone: `${r},${c}` === hot ? "good" : seen.has(`${r},${c}`) ? "done" : "idle",
      })),
    );
    frames.push({ say, grid, gridLabel: "matrix", out, line: 3 });
  };

  let top = 0;
  let bottom = R - 1;
  let left = 0;
  let right = C - 1;
  let out = "";
  draw(null, "Four walls: top, bottom, left, right. The spiral is just those walls closing in.", out);

  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) {
      seen.add(`${top},${c}`);
      out += `${m[top][c]} `;
      draw(`${top},${c}`, `Walk right along the top wall (row ${top}).`, out);
    }
    top++;
    for (let r = top; r <= bottom; r++) {
      seen.add(`${r},${right}`);
      out += `${m[r][right]} `;
      draw(`${r},${right}`, `Top wall is finished, so it drops down. Now walk down the right wall (column ${right}).`, out);
    }
    right--;
    if (top <= bottom) {
      for (let c = right; c >= left; c--) {
        seen.add(`${bottom},${c}`);
        out += `${m[bottom][c]} `;
        draw(`${bottom},${c}`, `Walk left along the bottom wall (row ${bottom}).`, out);
      }
      bottom--;
    }
    if (left <= right) {
      for (let r = bottom; r >= top; r--) {
        seen.add(`${r},${left}`);
        out += `${m[r][left]} `;
        draw(`${r},${left}`, `Walk up the left wall (column ${left}). Then all four walls have moved inward.`, out);
      }
      left++;
    }
  }
  draw(null, "Walls crossed each other, so every cell has been visited exactly once.", out);
  return {
    title: "Spiral order is four shrinking walls",
    blurb: "Do not think in circles. Think: right, down, left, up — then move the wall you just used.",
    code,
    frames,
  };
}

/* ---------------------------------------------------------- prefix sums -- */

export function tracePrefix(a: number[], ql: number, qr: number): Viz {
  const code = `pre[0] = a[0];
for (int i = 1; i < n; i++)
  pre[i] = pre[i - 1] + a[i];

// sum of a[l..r]
ans = pre[r] - (l ? pre[l - 1] : 0);`;
  const pre: number[] = [];
  const frames: Frame[] = [];
  const preCells = (upto: number, tones: Record<number, Cell["tone"]> = {}): Cell[] =>
    a.map((_, i) => ({
      v: i <= upto ? String(pre[i]) : "·",
      i: String(i),
      tone: i > upto ? "ghost" : (tones[i] ?? "done"),
    }));

  pre[0] = a[0];
  frames.push({
    say: "pre[i] will mean: everything from the start up to and including box i.",
    line: 1,
    rowLabel: "a",
    row: row(a, { 0: "active" }),
    row2Label: "pre",
    row2: preCells(0, { 0: "good" }),
    vars: vars({ "pre[0]": pre[0] }),
  });
  for (let i = 1; i < a.length; i++) {
    pre[i] = pre[i - 1] + a[i];
    frames.push({
      say: `pre[${i}] = pre[${i - 1}] + a[${i}] = ${pre[i - 1]} + ${a[i]} = ${pre[i]}. Each one reuses the last, so building the whole table is one pass.`,
      line: 3,
      rowLabel: "a",
      row: row(a, { ...span(0, i - 1, "done"), [i]: "active" }),
      row2Label: "pre",
      row2: preCells(i, { [i]: "good", [i - 1]: "compare" }),
      vars: vars({ i, [`pre[${i}]`]: pre[i] }),
    });
  }
  const left = ql ? pre[ql - 1] : 0;
  frames.push({
    say: `Now a question: what is the sum of a[${ql}] to a[${qr}]? The slow way walks ${qr - ql + 1} boxes. Watch the fast way.`,
    line: 6,
    rowLabel: "a",
    row: row(a, span(ql, qr, "window")),
    row2Label: "pre",
    row2: preCells(a.length - 1),
  });
  frames.push({
    say: `pre[${qr}] = ${pre[qr]} is everything up to box ${qr} — but that includes the part before box ${ql}, which we do not want.`,
    line: 6,
    rowLabel: "a",
    row: row(a, { ...span(0, qr, "window"), ...span(ql, qr, "good") }),
    row2Label: "pre",
    row2: preCells(a.length - 1, { [qr]: "good" }),
    vars: vars({ [`pre[${qr}]`]: pre[qr] }),
  });
  frames.push({
    say: `That unwanted part is exactly pre[${ql - 1}] = ${left}. Subtract it.`,
    line: 6,
    rowLabel: "a",
    row: row(a, { ...span(0, ql - 1, "bad"), ...span(ql, qr, "good") }),
    row2Label: "pre",
    row2: preCells(a.length - 1, { [qr]: "good", [ql - 1]: "bad" }),
    vars: vars({ [`pre[${qr}]`]: pre[qr], [`pre[${ql - 1}]`]: left }),
  });
  frames.push({
    say: `${pre[qr]} − ${left} = ${pre[qr] - left}. Two lookups and one subtraction — the answer costs the same whether the range is 3 boxes or 300000.`,
    line: 6,
    rowLabel: "a",
    row: row(a, span(ql, qr, "good")),
    row2Label: "pre",
    row2: preCells(a.length - 1, { [qr]: "good", [ql - 1]: "bad" }),
    out: String(pre[qr] - left),
  });
  return {
    title: "Answer any range sum with one subtraction",
    blurb: "Build the running total once, then every question is instant.",
    code,
    frames,
  };
}

/* ---------------------------------------------------------- two pointer -- */

export function traceTwoSum(a: number[], target: number): Viz {
  const code = `int i = 0, j = n - 1;
while (i < j) {
  int s = a[i] + a[j];
  if (s == target) return {i, j};
  if (s < target) i++;
  else            j--;
}`;
  const frames: Frame[] = [];
  let i = 0;
  let j = a.length - 1;
  frames.push({
    say: `The array is sorted — that is the whole reason this works. Find two numbers adding to ${target}.`,
    line: 1,
    row: row(a, { [i]: "active", [j]: "active" }),
    marks: [
      { at: i, name: "i" },
      { at: j, name: "j" },
    ],
    vars: vars({ target }),
  });
  while (i < j) {
    const s = a[i] + a[j];
    frames.push({
      say: `${a[i]} + ${a[j]} = ${s}.`,
      line: 3,
      row: row(a, { [i]: "compare", [j]: "compare" }),
      marks: [
        { at: i, name: "i" },
        { at: j, name: "j" },
      ],
      vars: vars({ sum: s, target }),
    });
    if (s === target) {
      frames.push({
        say: `That is the target. Found at index ${i} and ${j} — after only a handful of looks, not every pair.`,
        line: 4,
        row: row(a, { [i]: "good", [j]: "good" }),
        marks: [
          { at: i, name: "i" },
          { at: j, name: "j" },
        ],
        out: `${i} ${j}`,
      });
      break;
    }
    if (s < target) {
      frames.push({
        say: `${s} is too small. The only way to get bigger is a bigger left number, so i moves right. Everything left of i is now ruled out forever.`,
        line: 5,
        row: row(a, { ...span(0, i, "bad"), [j]: "compare" }),
        marks: [
          { at: i, name: "i" },
          { at: j, name: "j" },
        ],
        vars: vars({ sum: s, target }),
      });
      i++;
    } else {
      frames.push({
        say: `${s} is too big. Shrink it by taking a smaller right number, so j moves left. Everything right of j is ruled out.`,
        line: 6,
        row: row(a, { ...span(j, a.length - 1, "bad"), [i]: "compare" }),
        marks: [
          { at: i, name: "i" },
          { at: j, name: "j" },
        ],
        vars: vars({ sum: s, target }),
      });
      j--;
    }
  }
  return {
    title: "Two pointers on a sorted row",
    blurb: "Every move throws away a whole block of pairs. That is how O(n²) becomes O(n).",
    code,
    frames,
  };
}

/* ------------------------------------------------------- sliding window -- */

export function traceFixedWindow(a: number[], k: number): Viz {
  const code = `int sum = 0;
for (int i = 0; i < k; i++) sum += a[i];
int best = sum;
for (int i = k; i < n; i++) {
  sum += a[i] - a[i - k];
  best = max(best, sum);
}`;
  const frames: Frame[] = [];
  let sum = 0;
  for (let i = 0; i < k; i++) sum += a[i];
  let best = sum;
  frames.push({
    say: `Add up the first ${k} boxes once. That is the starting window.`,
    line: 2,
    row: row(a, span(0, k - 1, "window")),
    vars: vars({ sum, best }),
  });
  for (let i = k; i < a.length; i++) {
    frames.push({
      say: `Slide one step. Instead of re-adding ${k} numbers, add the new one (${a[i]}) and remove the one that fell out (${a[i - k]}).`,
      line: 5,
      row: row(a, { ...span(i - k + 1, i - 1, "window"), [i]: "good", [i - k]: "bad" }),
      marks: [
        { at: i - k, name: "out", tone: "bad" },
        { at: i, name: "in", tone: "good" },
      ],
      vars: vars({ "old sum": sum, "+": a[i], "−": a[i - k] }),
    });
    sum += a[i] - a[i - k];
    const better = sum > best;
    best = Math.max(best, sum);
    frames.push({
      say: better
        ? `New window sum is ${sum} — a new best. Two operations, not ${k}.`
        : `New window sum is ${sum}. Not better than ${best}, keep the old best.`,
      line: 6,
      row: row(a, span(i - k + 1, i, better ? "good" : "window")),
      vars: vars({ sum, best }),
    });
  }
  frames.push({
    say: `Best sum of any ${k} in a row is ${best}. The whole array was crossed once — O(n), not O(n·k).`,
    row: row(a, {}),
    vars: vars({ best }),
    out: String(best),
  });
  return {
    title: "A fixed window slides instead of restarting",
    blurb: "One number joins, one number leaves. Never re-add the middle.",
    code,
    frames,
  };
}

export function traceVariableWindow(word: string): Viz {
  const code = `int l = 0, best = 0;
unordered_set<char> inWindow;
for (int r = 0; r < n; r++) {
  while (inWindow.count(s[r])) {
    inWindow.erase(s[l]); l++;
  }
  inWindow.insert(s[r]);
  best = max(best, r - l + 1);
}`;
  const chars = word.split("");
  const frames: Frame[] = [];
  const inWindow = new Set<string>();
  let l = 0;
  let best = 0;
  frames.push({
    say: "Goal: the longest stretch with no repeated letter. The window grows on the right and shrinks on the left.",
    line: 1,
    row: row(chars, {}, { index: false }),
    vars: vars({ l: 0, best: 0 }),
  });
  for (let r = 0; r < chars.length; r++) {
    frames.push({
      say: `The right edge takes in '${chars[r]}'.`,
      line: 3,
      row: row(chars, { ...span(l, r - 1, "window"), [r]: "active" }, { index: false }),
      marks: [
        { at: l, name: "l" },
        { at: r, name: "r" },
      ],
      vars: vars({ window: word.slice(l, r) || "(empty)", best }),
    });
    while (inWindow.has(chars[r])) {
      frames.push({
        say: `'${chars[r]}' is already inside the window. Pull the left edge in, dropping '${chars[l]}', until the repeat is gone.`,
        line: 5,
        row: row(chars, { ...span(l + 1, r - 1, "window"), [l]: "bad", [r]: "compare" }, { index: false }),
        marks: [
          { at: l, name: "l", tone: "bad" },
          { at: r, name: "r" },
        ],
        vars: vars({ window: word.slice(l, r), best }),
      });
      inWindow.delete(chars[l]);
      l++;
    }
    inWindow.add(chars[r]);
    const len = r - l + 1;
    const better = len > best;
    best = Math.max(best, len);
    frames.push({
      say: better
        ? `Window "${word.slice(l, r + 1)}" is ${len} long — the best so far.`
        : `Window "${word.slice(l, r + 1)}" is ${len} long. Still short of ${best}.`,
      line: 8,
      row: row(chars, span(l, r, better ? "good" : "window"), { index: false }),
      marks: [
        { at: l, name: "l" },
        { at: r, name: "r" },
      ],
      vars: vars({ length: len, best }),
    });
  }
  frames.push({
    say: `Answer: ${best}. Notice l never moved backwards — that is why this is one pass, even with a loop inside a loop.`,
    row: row(chars, {}, { index: false }),
    vars: vars({ best }),
    out: String(best),
  });
  return {
    title: "A window that breathes",
    blurb: "Grow on the right always, shrink on the left only while the rule is broken.",
    code,
    frames,
  };
}

/* ------------------------------------------------------------- kadane's -- */

export function traceKadane(a: number[]): Viz {
  const code = `int cur = a[0], best = a[0];
for (int i = 1; i < n; i++) {
  cur = max(a[i], cur + a[i]);
  best = max(best, cur);
}`;
  const frames: Frame[] = [];
  let cur = a[0];
  let best = a[0];
  let start = 0;
  let bestL = 0;
  let bestR = 0;
  frames.push({
    say: "cur means: the best sum of a run that ends right here. Start with just the first box.",
    line: 1,
    row: row(a, { 0: "good" }),
    vars: vars({ cur, best }),
  });
  for (let i = 1; i < a.length; i++) {
    const extend = cur + a[i];
    const restart = a[i];
    frames.push({
      say: `At ${a[i]}: keep the old run (${cur} + ${a[i]} = ${extend}) or throw it away and start fresh at ${restart}?`,
      line: 3,
      row: row(a, { ...span(start, i - 1, "window"), [i]: "compare" }),
      vars: vars({ "extend to": extend, "restart at": restart }),
    });
    if (restart > extend) {
      start = i;
      cur = restart;
      frames.push({
        say: `Starting fresh wins. Everything before ${a[i]} was dragging the sum down, so drop it.`,
        line: 3,
        row: row(a, { ...span(0, i - 1, "bad"), [i]: "active" }),
        vars: vars({ cur, best }),
      });
    } else {
      cur = extend;
      frames.push({
        say: "Extending wins. The run keeps growing.",
        line: 3,
        row: row(a, span(start, i, "window")),
        vars: vars({ cur, best }),
      });
    }
    if (cur > best) {
      best = cur;
      bestL = start;
      bestR = i;
      frames.push({
        say: `${cur} beats the old best. Record this stretch.`,
        line: 4,
        row: row(a, span(start, i, "good")),
        vars: vars({ cur, best }),
      });
    }
  }
  frames.push({
    say: `Largest sum is ${best}, from index ${bestL} to ${bestR}. One pass, two variables — no nested loops anywhere.`,
    row: row(a, span(bestL, bestR, "good")),
    vars: vars({ best }),
    out: String(best),
  });
  return {
    title: "Kadane's: keep it or drop it",
    blurb: "At every box, ask one question — is my running total helping or hurting?",
    code,
    frames,
  };
}

/* ------------------------------------------------- same-direction pair -- */

/** Read and write pointers moving forward at different speeds. */
export function traceSameDirection(input: number[]): Viz {
  const code = `int write = 1;

for (int read = 1; read < n; read++) {
  if (a[read] != a[write - 1]) {
    a[write] = a[read];
    write++;
  }
}`;
  const frames: Frame[] = [];
  const a = [...input];

  const draw = (
    say: string,
    line: number,
    read: number,
    write: number,
    tone: Tone,
    extra?: Record<string, string | number>,
  ) => {
    frames.push({
      say,
      line,
      rowLabel: "the array, being rewritten in place",
      row: a.map((v, i) => ({
        v: String(v),
        i: String(i),
        tone: i === read ? tone : i < write ? "good" : "idle",
      })),
      marks: [
        { at: write, name: "write", tone: "compare" },
        { at: read, name: "read", tone: "active" },
      ],
      vars: vars({ read, write, kept: write, ...(extra ?? {}) }),
    });
  };

  frames.push({
    say: "A sorted array with duplicates. Remove them in place, using no extra memory — two pointers, moving at different speeds.",
    rowLabel: "the array, being rewritten in place",
    row: a.map((v, i) => ({ v: String(v), i: String(i), tone: "active" as const })),
    line: 1,
    vars: vars({ n: a.length }),
  });

  let write = 1;
  frames.push({
    say: "a[0] always stays, so write starts at 1. READ visits every element; WRITE marks the boundary of the answer being built at the front.",
    rowLabel: "the array, being rewritten in place",
    row: a.map((v, i) => ({ v: String(v), i: String(i), tone: i === 0 ? "good" : "idle" })),
    marks: [
      { at: 1, name: "write", tone: "compare" },
      { at: 1, name: "read", tone: "active" },
    ],
    line: 1,
    vars: vars({ read: 1, write: 1 }),
  });

  for (let read = 1; read < a.length; read++) {
    if (a[read] !== a[write - 1]) {
      draw(
        `a[${read}] is ${a[read]}, and the last kept value is ${a[write - 1]}. They differ, so this one is new — keep it.`,
        4, read, write, "good", { "a[read]": a[read], "last kept": a[write - 1] },
      );
      a[write] = a[read];
      write++;
      draw(
        `Copy it to position ${write - 1} and advance write. Notice write is never ahead of read, so nothing unread is ever overwritten — that is what makes this safe in place.`,
        5, read, write, "compare",
      );
    } else {
      draw(
        `a[${read}] is ${a[read]}, the same as the last kept value. A duplicate — skip it. Read moves on and write stays put.`,
        4, read, write, "bad", { "a[read]": a[read], "last kept": a[write - 1] },
      );
    }
  }

  frames.push({
    say: `Read has run off the end. The first ${write} positions hold the unique values, and write IS the new length. Everything past it is leftover junk that nobody looks at.`,
    rowLabel: "the answer, at the front",
    row: a.map((v, i) => ({
      v: String(v),
      i: String(i),
      tone: i < write ? "done" : "ghost",
    })),
    marks: [{ at: write, name: "new length", tone: "good" }],
    vars: vars({ length: write, discarded: a.length - write }),
  });

  frames.push({
    say: "The same shape solves a lot: move all zeros to the end, remove every copy of a value, partition by a condition, compact a list. One pointer reads, one decides what is worth keeping.",
    rowLabel: "the answer, at the front",
    row: a.slice(0, write).map((v, i) => ({ v: String(v), i: String(i), tone: "done" as const })),
    vars: vars({ passes: 1, "extra memory": 0 }),
  });

  return {
    title: "One reads, one writes",
    blurb: "Watch write fall behind read — and watch why that is what makes it safe.",
    code,
    frames,
  };
}

/* ----------------------------------------------------- prefix + hashmap -- */

/** Counting subarrays summing to k, by looking for the prefix that would work. */
export function tracePrefixCount(input: number[], k: number): Viz {
  const code = `unordered_map<long long,int> seen;
seen[0] = 1;

long long pre = 0;
int answer = 0;

for (int i = 0; i < n; i++) {
  pre += a[i];
  answer += seen[pre - k];
  seen[pre]++;
}`;
  const frames: Frame[] = [];
  const seen = new Map<number, number>();

  const mapRow = (hot: number | null): Cell[] =>
    [...seen.entries()].map(([key, count]) => ({
      v: `${key}→${count}`,
      tone: key === hot ? "good" : "active",
    }));

  frames.push({
    say: `How many runs of consecutive numbers add up to exactly ${k}? Checking every run is n². Watch the trick: at each step you already know which earlier prefix you need.`,
    rowLabel: "the array",
    row: input.map((v, i) => ({ v: String(v), i: String(i), tone: "active" as const })),
    line: 1,
    vars: vars({ k }),
  });

  frames.push({
    say: `A run from l to r sums to ${k} exactly when pre[r] − pre[l−1] = ${k}. Rearranged: pre[l−1] = pre[r] − ${k}. That is the value to look for.`,
    rowLabel: "the rearrangement",
    row: [
      { v: `pre[r] − pre[l−1] = ${k}`, tone: "idle" },
      { v: "becomes", tone: "ghost" },
      { v: `pre[l−1] = pre[r] − ${k}`, tone: "good" },
    ],
    vars: vars({ "what to look up": `pre − ${k}` }),
  });

  seen.set(0, 1);
  frames.push({
    say: "Seed the map with prefix 0 seen once. That is the EMPTY prefix, and it accounts for runs that begin at index 0 — miss it and every such run is uncounted.",
    rowLabel: "seen: prefix → how many times",
    row: mapRow(0),
    line: 2,
    vars: vars({ "seen[0]": 1 }),
  });

  let pre = 0;
  let answer = 0;

  for (let i = 0; i < input.length; i++) {
    pre += input[i];
    frames.push({
      say: `Add a[${i}] = ${input[i]}. The running prefix is now ${pre} — the sum of everything up to here.`,
      line: 8,
      rowLabel: "the array",
      row: input.map((v, j) => ({
        v: String(v),
        i: String(j),
        tone: j === i ? "good" : j < i ? "done" : "idle",
      })),
      row2Label: "seen: prefix → how many times",
      row2: mapRow(null),
      vars: vars({ i, pre }),
    });

    const want = pre - k;
    const hits = seen.get(want) ?? 0;
    answer += hits;
    frames.push({
      say: hits
        ? `Look up ${pre} − ${k} = ${want}. It has been seen ${hits} time${hits === 1 ? "" : "s"} — so ${hits} run${hits === 1 ? "" : "s"} ending here sum${hits === 1 ? "s" : ""} to ${k}. Add ${hits} to the answer.`
        : `Look up ${pre} − ${k} = ${want}. Never seen, so no run ending here sums to ${k}. Add nothing.`,
      line: 9,
      rowLabel: "the array",
      row: input.map((v, j) => ({
        v: String(v),
        i: String(j),
        tone: j === i ? (hits ? "good" : "idle") : j < i ? "done" : "idle",
      })),
      row2Label: "seen: prefix → how many times",
      row2: mapRow(want),
      vars: vars({ pre, "looking for": want, found: hits, answer }),
    });

    seen.set(pre, (seen.get(pre) ?? 0) + 1);
    frames.push({
      say: `Record that prefix ${pre} has now been seen, so later positions can find it.`,
      line: 10,
      rowLabel: "seen: prefix → how many times",
      row: mapRow(pre),
      vars: vars({ pre, answer }),
    });
  }

  frames.push({
    say: `One pass, one map, and the answer is ${answer}. Every run was counted without ever looking at a run — only at the prefix that would have made it work.`,
    rowLabel: "the array",
    row: input.map((v, i) => ({ v: String(v), i: String(i), tone: "done" as const })),
    vars: vars({ answer, passes: 1 }),
    out: String(answer),
  });

  frames.push({
    say: "The same shape with a different key solves more: store the remainder for 'sum divisible by k', turn 0 into −1 for 'equal numbers of 0s and 1s', store a running XOR for subarrays with a given XOR.",
    rowLabel: "same shape, different key",
    row: [
      { v: "sum = k", tone: "done" },
      { v: "pre % k", tone: "done" },
      { v: "0 → −1", tone: "done" },
      { v: "running XOR", tone: "done" },
    ],
  });

  return {
    title: "Looking for the prefix that would work",
    blurb: "Watch the map answer 'how many runs end here' in one lookup.",
    code,
    frames,
  };
}

/* ------------------------------------------------------ difference array -- */

/** Range updates in two writes, revealed by one prefix sum at the end. */
export function traceDifference(size: number, updates: [number, number, number][]): Viz {
  const code = `vector<long long> diff(n + 1, 0);

diff[l]     += v;
diff[r + 1] -= v;

long long running = 0;
for (int i = 0; i < n; i++) {
  running += diff[i];
  a[i] = running;
}`;
  const frames: Frame[] = [];
  const diff = new Array<number>(size + 1).fill(0);

  const diffRow = (hot: number[]): Cell[] =>
    diff.slice(0, size + 1).map((v, i) => ({
      v: v === 0 ? "0" : v > 0 ? `+${v}` : String(v),
      i: i === size ? "end" : String(i),
      tone: hot.includes(i) ? "good" : v === 0 ? "ghost" : "active",
    }));

  frames.push({
    say: `An array of ${size} zeros, and instructions like 'add 5 to everything from index 2 to 5'. Doing that literally means touching every index in the range, every time.`,
    rowLabel: "the array we want",
    row: new Array(size).fill(0).map((_, i) => ({ v: "0", i: String(i), tone: "idle" as const })),
    line: 1,
    vars: vars({ n: size, updates: updates.length }),
  });

  frames.push({
    say: "A difference array stores CHANGES rather than totals. It is a prefix sum run backwards — and it turns a range update into two writes, whatever the range length.",
    rowLabel: "diff — changes, not totals",
    row: diffRow([]),
    vars: vars({ "writes per update": 2 }),
  });

  for (const [l, r, v] of updates) {
    diff[l] += v;
    frames.push({
      say: `To add ${v} across ${l}..${r}: write diff[${l}] += ${v}. That says 'from index ${l} onwards, everything is ${v} higher'.`,
      line: 3,
      rowLabel: "diff — changes, not totals",
      row: diffRow([l]),
      vars: vars({ l, r, v, meaning: `from ${l} on, +${v}` }),
    });

    diff[r + 1] -= v;
    frames.push({
      say: `Then diff[${r + 1}] -= ${v}, which CANCELS it just past the end. Two writes, and the range could have been a million long.`,
      line: 4,
      rowLabel: "diff — changes, not totals",
      row: diffRow([l, r + 1]),
      vars: vars({ l, r, v, meaning: `cancelled at ${r + 1}` }),
    });
  }

  frames.push({
    say: "All the updates are recorded and not one index in the middle of a range was ever touched. Now one pass reveals the answer.",
    rowLabel: "diff — changes, not totals",
    row: diffRow([]),
    line: 6,
    vars: vars({ "writes so far": updates.length * 2 }),
  });

  const out: number[] = [];
  let running = 0;
  for (let i = 0; i < size; i++) {
    running += diff[i];
    out.push(running);
    frames.push({
      say:
        diff[i] === 0
          ? `diff[${i}] is 0, so nothing changes here. The running total stays at ${running}.`
          : `diff[${i}] is ${diff[i] > 0 ? "+" : ""}${diff[i]}, so the running total becomes ${running}.`,
      line: 8,
      rowLabel: "diff — changes, not totals",
      row: diffRow([i]),
      row2Label: "the final array, rolling up",
      row2: out.map((v, j) => ({
        v: String(v),
        i: String(j),
        tone: j === i ? "good" : "done",
      })),
      vars: vars({ i, "diff[i]": diff[i], running }),
    });
  }

  frames.push({
    say: `The prefix sum of diff IS the answer. Every range update cost 2 writes, and one ${size}-step pass at the end revealed all of them.`,
    rowLabel: "the final array",
    row: out.map((v, i) => ({ v: String(v), i: String(i), tone: "done" as const })),
    vars: vars({ "update cost": "O(1) each", "reveal cost": `O(${size}) once` }),
    out: out.join(" "),
  });

  frames.push({
    say: "This is how booking seats, counting overlapping intervals, and applying a hundred thousand range increments are meant to be solved.",
    rowLabel: "the final array",
    row: out.map((v, i) => ({ v: String(v), i: String(i), tone: "done" as const })),
    vars: vars({ naive: "updates × length", "with diff": "updates × 2 + n" }),
  });

  return {
    title: "Two writes instead of a thousand",
    blurb: "Watch a range update touch only its two ends — and watch the prefix sum reveal it.",
    code,
    frames,
  };
}
