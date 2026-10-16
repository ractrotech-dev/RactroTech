// Searching and sorting tracers.

import { row, span, vars, type Bar, type Cell, type Frame, type Viz } from "@/lib/dsa/viz/types";

/* ------------------------------------------------------------ searching -- */

export function traceLinearSearch(a: number[], target: number): Viz {
  const code = `for (int i = 0; i < n; i++)
  if (a[i] == target) return i;
return -1;`;
  const frames: Frame[] = [];
  for (let i = 0; i < a.length; i++) {
    const hit = a[i] === target;
    frames.push({
      say: hit
        ? `Box ${i} holds ${target}. Found it after ${i + 1} looks.`
        : `Box ${i} holds ${a[i]}, not ${target}. Next.`,
      line: 2,
      row: row(a, { ...span(0, i - 1, "bad"), [i]: hit ? "good" : "compare" }),
      marks: [{ at: i, name: "i" }],
      vars: vars({ i, looked: i + 1 }),
    });
    if (hit) break;
  }
  frames.push({
    say: "Linear search asks every box in turn. Nothing about the data is assumed — which is why it also works on unsorted rows.",
    row: row(a, {}),
    vars: vars({ "worst case": `${a.length} looks` }),
  });
  return {
    title: "Linear search: ask every box",
    blurb: "Simple, slow, and always correct. The baseline everything else is measured against.",
    code,
    frames,
  };
}

export function traceBinarySearch(a: number[], target: number): Viz {
  const code = `int lo = 0, hi = n - 1;
while (lo <= hi) {
  int mid = lo + (hi - lo) / 2;
  if (a[mid] == target) return mid;
  if (a[mid] < target) lo = mid + 1;
  else                 hi = mid - 1;
}
return -1;`;
  const frames: Frame[] = [];
  let lo = 0;
  let hi = a.length - 1;
  let looks = 0;
  frames.push({
    say: `The row is sorted. Looking for ${target}. Everything between lo and hi is still possible.`,
    line: 1,
    row: row(a, span(0, a.length - 1, "window")),
    marks: [
      { at: lo, name: "lo" },
      { at: hi, name: "hi" },
    ],
    vars: vars({ lo, hi, "still possible": a.length }),
  });
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    looks++;
    frames.push({
      say: `Jump to the middle of what is left: index ${mid}, holding ${a[mid]}.`,
      line: 3,
      row: row(a, { ...span(lo, hi, "window"), [mid]: "compare" }),
      marks: [
        { at: lo, name: "lo" },
        { at: mid, name: "mid", tone: "compare" },
        { at: hi, name: "hi" },
      ],
      vars: vars({ lo, mid, hi, looks }),
    });
    if (a[mid] === target) {
      frames.push({
        say: `${a[mid]} is the target. Found in ${looks} looks — linear search would have taken ${mid + 1}.`,
        line: 4,
        row: row(a, { [mid]: "good" }),
        marks: [{ at: mid, name: "found", tone: "good" }],
        vars: vars({ looks }),
        out: String(mid),
      });
      break;
    }
    if (a[mid] < target) {
      frames.push({
        say: `${a[mid]} is too small. Because the row is sorted, every box at ${mid} and to its left is too small as well. Half the row is gone in one step.`,
        line: 5,
        row: row(a, { ...span(lo, mid, "bad"), ...span(mid + 1, hi, "window") }),
        vars: vars({ "ruled out": mid - lo + 1 }),
      });
      lo = mid + 1;
    } else {
      frames.push({
        say: `${a[mid]} is too big, so everything from ${mid} rightwards is too big. Throw that half away.`,
        line: 6,
        row: row(a, { ...span(mid, hi, "bad"), ...span(lo, mid - 1, "window") }),
        vars: vars({ "ruled out": hi - mid + 1 }),
      });
      hi = mid - 1;
    }
    frames.push({
      say: `${hi - lo + 1} boxes still possible out of ${a.length}.`,
      line: 2,
      row: row(a, span(lo, hi, "window")),
      marks: lo <= hi ? [
        { at: lo, name: "lo" },
        { at: hi, name: "hi" },
      ] : [],
      vars: vars({ lo, hi }),
    });
  }
  return {
    title: "Binary search halves the world each look",
    blurb: "1000 boxes take 10 looks. A million take 20. Watch the red half vanish.",
    code,
    frames,
  };
}

export function traceBinaryOnAnswer(piles: number[], hours: number): Viz {
  const code = `int lo = 1, hi = maxPile;
while (lo < hi) {
  int mid = lo + (hi - lo) / 2;
  if (canFinish(mid)) hi = mid;   // slower is still fine
  else                lo = mid + 1;
}
return lo;`;
  const need = (speed: number) => piles.reduce((t, p) => t + Math.ceil(p / speed), 0);
  const maxPile = Math.max(...piles);
  const frames: Frame[] = [];
  let lo = 1;
  let hi = maxPile;

  frames.push({
    say: `Piles: ${piles.join(", ")}. You have ${hours} hours. What is the slowest eating speed that still finishes in time?`,
    rowLabel: "piles",
    row: row(piles, {}, { index: false }),
    vars: vars({ "speeds to try": `1 … ${maxPile}` }),
  });
  frames.push({
    say: "The answer is not in the array — it is a speed. But the speeds are ordered, and 'can I finish?' flips from no to yes exactly once. That is all binary search needs.",
    rowLabel: "speeds",
    row: row(Array.from({ length: maxPile }, (_, i) => i + 1), span(0, maxPile - 1, "window"), { index: false }),
    marks: [
      { at: 0, name: "lo" },
      { at: maxPile - 1, name: "hi" },
    ],
  });

  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    const h = need(mid);
    const ok = h <= hours;
    frames.push({
      say: `Try speed ${mid}: that takes ${h} hours. ${ok ? `${h} ≤ ${hours}, so this speed works.` : `${h} > ${hours}, too slow.`}`,
      line: 4,
      rowLabel: "speeds",
      row: row(
        Array.from({ length: maxPile }, (_, i) => i + 1),
        { ...span(lo - 1, hi - 1, "window"), [mid - 1]: ok ? "good" : "bad" },
        { index: false },
      ),
      marks: [{ at: mid - 1, name: "try", tone: ok ? "good" : "bad" }],
      vars: vars({ speed: mid, "hours needed": h, limit: hours }),
    });
    if (ok) {
      hi = mid;
      frames.push({
        say: "It works — but maybe something slower also works. Keep this one and search the slower half.",
        line: 5,
        rowLabel: "speeds",
        row: row(Array.from({ length: maxPile }, (_, i) => i + 1), { ...span(mid, maxPile - 1, "bad"), ...span(lo - 1, hi - 1, "window") }, { index: false }),
        vars: vars({ lo, hi }),
      });
    } else {
      lo = mid + 1;
      frames.push({
        say: "Too slow — and every speed below it is even slower, so all of them are out.",
        line: 6,
        rowLabel: "speeds",
        row: row(Array.from({ length: maxPile }, (_, i) => i + 1), { ...span(0, mid - 1, "bad"), ...span(lo - 1, hi - 1, "window") }, { index: false }),
        vars: vars({ lo, hi }),
      });
    }
  }
  frames.push({
    say: `Speed ${lo} is the slowest that finishes in time. We never listed all the speeds — we only asked yes/no questions about them.`,
    rowLabel: "speeds",
    row: row(Array.from({ length: maxPile }, (_, i) => i + 1), { [lo - 1]: "good" }, { index: false }),
    vars: vars({ answer: lo }),
    out: String(lo),
  });
  return {
    title: "Binary search when there is no array",
    blurb: "\"Minimise the maximum\" almost always means this. Search the answer, not the data.",
    code,
    frames,
  };
}

/* -------------------------------------------------------------- sorting -- */

const bars = (a: number[], tones: Record<number, Bar["tone"]> = {}): Bar[] =>
  a.map((v, i) => ({ v, tone: tones[i] ?? "idle" }));

export function traceBubbleSort(input: number[]): Viz {
  const code = `for (int i = 0; i < n - 1; i++)
  for (int j = 0; j < n - 1 - i; j++)
    if (a[j] > a[j + 1])
      swap(a[j], a[j + 1]);`;
  const a = [...input];
  const n = a.length;
  const frames: Frame[] = [];
  let swaps = 0;
  frames.push({
    say: "Compare each pair of neighbours. If they are the wrong way round, swap them.",
    line: 1,
    bars: bars(a),
    vars: vars({ swaps }),
  });
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      const wrong = a[j] > a[j + 1];
      frames.push({
        say: wrong
          ? `${a[j]} is bigger than ${a[j + 1]} — wrong order, swap.`
          : `${a[j]} is not bigger than ${a[j + 1]} — already fine, leave it.`,
        line: 3,
        bars: bars(a, { [j]: "compare", [j + 1]: "compare", ...span(n - i, n - 1, "done") }),
        vars: vars({ i, j, swaps }),
      });
      if (wrong) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swaps++;
        frames.push({
          say: "Swapped. The bigger number keeps drifting right.",
          line: 4,
          bars: bars(a, { [j]: "active", [j + 1]: "active", ...span(n - i, n - 1, "done") }),
          vars: vars({ i, j, swaps }),
        });
      }
    }
    frames.push({
      say: `Pass ${i + 1} finished, so the biggest number left has bubbled to position ${n - 1 - i} and is locked in.`,
      line: 1,
      bars: bars(a, span(n - 1 - i, n - 1, "done")),
      vars: vars({ "sorted tail": i + 1, swaps }),
    });
  }
  frames.push({
    say: `Sorted, with ${swaps} swaps. But look how many comparisons it took — roughly n²/2. At n = 100000 that is 5 billion. Fine to learn, never to ship.`,
    bars: bars(a, span(0, n - 1, "good")),
    vars: vars({ swaps, cost: "O(n²)" }),
  });
  return {
    title: "Bubble sort, and why nobody ships it",
    blurb: "Watch the biggest bar bubble to the right on every pass.",
    code,
    frames,
  };
}

export function traceInsertionSort(input: number[]): Viz {
  const code = `for (int i = 1; i < n; i++) {
  int key = a[i], j = i - 1;
  while (j >= 0 && a[j] > key) {
    a[j + 1] = a[j];
    j--;
  }
  a[j + 1] = key;
}`;
  const a = [...input];
  const frames: Frame[] = [];
  frames.push({
    say: "Like sorting cards in your hand: the left part is already tidy, pick up the next card and slide it back into place.",
    line: 1,
    row: row(a, { 0: "done" }),
    vars: vars({ sorted: "a[0]" }),
  });
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    frames.push({
      say: `Pick up ${key}. Everything left of it is already sorted.`,
      line: 2,
      row: row(a, { ...span(0, i - 1, "done"), [i]: "active" }),
      marks: [{ at: i, name: "key" }],
      vars: vars({ key }),
    });
    while (j >= 0 && a[j] > key) {
      frames.push({
        say: `${a[j]} is bigger than ${key}, so shift it one place right to make room.`,
        line: 4,
        row: row(a, { ...span(0, i - 1, "done"), [j]: "compare", [j + 1]: "ghost" }),
        vars: vars({ key, j }),
      });
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
    frames.push({
      say: `${key} drops into index ${j + 1}. The sorted part is now ${i + 1} long.`,
      line: 7,
      row: row(a, { ...span(0, i, "done"), [j + 1]: "good" }),
      vars: vars({ key, "placed at": j + 1 }),
    });
  }
  frames.push({
    say: "Also O(n²) in the worst case — but on nearly-sorted data the while loop barely runs, which makes it the fastest choice for small or almost-tidy arrays.",
    row: row(a, span(0, a.length - 1, "good")),
  });
  return {
    title: "Insertion sort: sorting cards in your hand",
    blurb: "The left side is always sorted. Watch the gap open up for each new card.",
    code,
    frames,
  };
}

export function traceMergeSort(input: number[]): Viz {
  const frames: Frame[] = [];
  const a = [...input];
  const n = a.length;

  const snapshot = (parts: number[][], say: string, line?: number, tones: Record<number, Bar["tone"]> = {}) => {
    const flat = parts.flat();
    frames.push({
      say,
      line,
      row: flat.map((v, i) => ({ v: String(v), tone: tones[i] ?? "idle" })),
      rowLabel: parts.map((p) => `[${p.join(" ")}]`).join("  "),
    });
  };

  snapshot([a], "Split the array in half. Then split those halves. Keep going until every piece is one number.", 1);
  let level: number[][] = [a];
  while (level.some((p) => p.length > 1)) {
    const next: number[][] = [];
    for (const part of level) {
      if (part.length === 1) next.push(part);
      else {
        const mid = Math.floor(part.length / 2);
        next.push(part.slice(0, mid), part.slice(mid));
      }
    }
    level = next;
    snapshot(level, `Split again — ${level.length} pieces now. A single number is sorted by definition, so splitting is free progress.`, 1);
  }

  const code = `void mergeSort(int l, int r) {
  if (l >= r) return;
  int m = (l + r) / 2;
  mergeSort(l, m);
  mergeSort(m + 1, r);
  merge(l, m, r);      // walk both halves once
}`;

  while (level.length > 1) {
    const next: number[][] = [];
    for (let i = 0; i < level.length; i += 2) {
      if (i + 1 >= level.length) {
        next.push(level[i]);
        continue;
      }
      const L = level[i];
      const R = level[i + 1];
      const out: number[] = [];
      let x = 0;
      let y = 0;
      snapshot(
        [...next, L, R, ...level.slice(i + 2)],
        `Merge [${L.join(" ")}] and [${R.join(" ")}]. Both are already sorted, so just compare their front items.`,
        6,
      );
      while (x < L.length && y < R.length) {
        const takeLeft = L[x] <= R[y];
        out.push(takeLeft ? L[x++] : R[y++]);
        snapshot(
          [...next, out, L.slice(x), R.slice(y), ...level.slice(i + 2)],
          `${takeLeft ? L[x - 1] : R[y - 1]} is the smaller front item, so it goes out next.`,
          6,
        );
      }
      while (x < L.length) out.push(L[x++]);
      while (y < R.length) out.push(R[y++]);
      next.push(out);
      snapshot([...next, ...level.slice(i + 2)], `One half ran out, so the rest of the other is copied straight over. [${out.join(" ")}] is sorted.`, 6);
    }
    level = next;
  }
  frames.push({
    say: `Sorted. Each level of merging touches all ${n} numbers, and there are only log₂(${n}) levels — that is what O(n log n) means, and why merge sort survives a million inputs.`,
    row: row(level[0], span(0, n - 1, "good"), { index: false }),
    vars: vars({ levels: Math.ceil(Math.log2(n)), cost: "O(n log n)" }),
  });
  return {
    title: "Merge sort: split all the way down, then combine",
    blurb: "Splitting is trivial. All the real work happens on the way back up.",
    code,
    frames,
  };
}

export function traceQuickPartition(input: number[]): Viz {
  const code = `int pivot = a[hi];
int i = lo - 1;
for (int j = lo; j < hi; j++)
  if (a[j] < pivot) swap(a[++i], a[j]);
swap(a[i + 1], a[hi]);
return i + 1;`;
  const a = [...input];
  const hi = a.length - 1;
  const pivot = a[hi];
  const frames: Frame[] = [];
  let i = -1;
  frames.push({
    say: `Pick the last number, ${pivot}, as the pivot. The goal of one partition: everything smaller ends up left of it, everything bigger right of it.`,
    line: 1,
    row: row(a, { [hi]: "active" }),
    marks: [{ at: hi, name: "pivot" }],
    vars: vars({ pivot }),
  });
  for (let j = 0; j < hi; j++) {
    const small = a[j] < pivot;
    frames.push({
      say: `Is ${a[j]} smaller than the pivot ${pivot}? ${small ? "Yes." : "No — leave it where it is."}`,
      line: 4,
      row: row(a, { ...span(0, i, "good"), [j]: small ? "compare" : "bad", [hi]: "active" }),
      marks: [
        { at: j, name: "j" },
        ...(i >= 0 ? [{ at: i, name: "i", tone: "good" as const }] : []),
      ],
      vars: vars({ j, "a[j]": a[j], pivot }),
    });
    if (small) {
      i++;
      [a[i], a[j]] = [a[j], a[i]];
      frames.push({
        say: `Move it into the small zone — swap it to index ${i}, just past the last small number.`,
        line: 4,
        row: row(a, { ...span(0, i, "good"), [hi]: "active" }),
        marks: [{ at: i, name: "i", tone: "good" }],
        vars: vars({ "small zone": i + 1 }),
      });
    }
  }
  [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
  frames.push({
    say: `Finally drop the pivot into the gap at index ${i + 1}. ${pivot} is now in its final, correct place — it will never move again.`,
    line: 5,
    row: row(a, { ...span(0, i, "good"), [i + 1]: "done", ...span(i + 2, hi, "bad") }),
    marks: [{ at: i + 1, name: "final", tone: "done" }],
    vars: vars({ "pivot index": i + 1 }),
  });
  frames.push({
    say: "Now quicksort repeats this on the left part and the right part. One number is placed perfectly per partition, and the problem halves.",
    row: row(a, { ...span(0, i, "window"), [i + 1]: "done", ...span(i + 2, hi, "window") }),
  });
  return {
    title: "One partition puts one number home forever",
    blurb: "Watch the green 'small zone' grow from the left as j scans.",
    code,
    frames,
  };
}

export function traceSelectionSort(input: number[]): Viz {
  const code = `for (int i = 0; i < n - 1; i++) {
  int least = i;
  for (int j = i + 1; j < n; j++)
    if (a[j] < a[least]) least = j;
  swap(a[i], a[least]);
}`;
  const a = [...input];
  const n = a.length;
  const frames: Frame[] = [];
  let swaps = 0;

  frames.push({
    say: "Find the smallest value in the unsorted part, then swap it to the front. Repeat.",
    line: 1,
    bars: bars(a),
    vars: vars({ swaps }),
  });

  for (let i = 0; i < n - 1; i++) {
    let least = i;
    frames.push({
      say: `Assume ${a[i]} is the smallest of what is left. Now check the rest.`,
      line: 2,
      bars: bars(a, { ...span(0, i - 1, "done"), [i]: "good" }),
      vars: vars({ i, least: a[least] }),
    });
    for (let j = i + 1; j < n; j++) {
      const smaller = a[j] < a[least];
      frames.push({
        say: smaller
          ? `${a[j]} is smaller than ${a[least]} — remember this position instead.`
          : `${a[j]} is not smaller than ${a[least]}. Keep looking.`,
        line: 4,
        bars: bars(a, { ...span(0, i - 1, "done"), [least]: "good", [j]: smaller ? "active" : "compare" }),
        vars: vars({ i, j, least: smaller ? a[j] : a[least] }),
      });
      if (smaller) least = j;
    }
    if (least !== i) {
      swaps++;
      frames.push({
        say: `${a[least]} is the smallest. Swap it into position ${i}.`,
        line: 5,
        bars: bars(a, { ...span(0, i - 1, "done"), [i]: "compare", [least]: "good" }),
        vars: vars({ swaps }),
      });
      [a[i], a[least]] = [a[least], a[i]];
    } else {
      frames.push({
        say: `${a[i]} was already the smallest. No swap needed.`,
        line: 5,
        bars: bars(a, { ...span(0, i, "done") }),
        vars: vars({ swaps }),
      });
    }
    frames.push({
      say: `Position ${i} is settled for good. The sorted part is now ${i + 1} long.`,
      line: 1,
      bars: bars(a, span(0, i, "done")),
      vars: vars({ swaps }),
    });
  }

  frames.push({
    say: `Sorted with only ${swaps} swaps — the fewest of any simple sort. But it still compared about n²/2 pairs, so it is O(n²) whatever the input looks like.`,
    bars: bars(a, span(0, n - 1, "good")),
    vars: vars({ swaps, comparisons: (n * (n - 1)) / 2 }),
  });

  return {
    title: "Selection sort: fewest swaps, same slow comparisons",
    blurb: "Watch how few times anything actually moves — and how much looking that costs.",
    code,
    frames,
  };
}

export function traceCountingSort(input: number[]): Viz {
  const code = `int count[K] = {0};
for (int x : a) count[x]++;          // tally

int at = 0;
for (int v = 0; v < K; v++)
  while (count[v]-- > 0) a[at++] = v; // rebuild in order`;
  const K = Math.max(...input) + 1;
  const counts = Array<number>(K).fill(0);
  const out: number[] = [];
  const frames: Frame[] = [];

  const countRow = (hot?: number): Cell[] =>
    counts.map((c, v) => ({ v: String(c), i: String(v), tone: v === hot ? "good" : c ? "done" : "ghost" }));

  frames.push({
    say: "Every sort so far compared values against each other. This one never does — and that is how it beats the n log n wall.",
    line: 1,
    rowLabel: "input",
    row: row(input, {}, { index: false }),
    row2Label: "count — one slot per possible value",
    row2: countRow(),
  });

  input.forEach((x, i) => {
    counts[x]++;
    frames.push({
      say: `Saw ${x}. Add one to slot ${x}. No comparison — the value IS the index.`,
      line: 2,
      rowLabel: "input",
      row: row(input, { ...span(0, i - 1, "done"), [i]: "active" }, { index: false }),
      row2Label: "count",
      row2: countRow(x),
      vars: vars({ x, [`count[${x}]`]: counts[x] }),
    });
  });

  frames.push({
    say: "The tally is complete after one pass. Now walk the slots in order and write each value out as many times as it was seen.",
    line: 5,
    rowLabel: "output so far",
    row: [{ v: "empty", tone: "ghost" }],
    row2Label: "count",
    row2: countRow(),
  });

  for (let v = 0; v < K; v++) {
    if (counts[v] === 0) {
      frames.push({
        say: `Slot ${v} is empty, so ${v} never appeared. Skip it.`,
        line: 6,
        rowLabel: "output so far",
        row: out.length ? row(out, {}, { index: false }) : [{ v: "empty", tone: "ghost" }],
        row2Label: "count",
        row2: countRow(v),
      });
      continue;
    }
    const times = counts[v];
    for (let k = 0; k < times; k++) out.push(v);
    frames.push({
      say: `Slot ${v} holds ${times}, so write ${v} out ${times} time${times === 1 ? "" : "s"}.`,
      line: 6,
      rowLabel: "output so far",
      row: row(out, span(out.length - times, out.length - 1, "good"), { index: false }),
      row2Label: "count",
      row2: countRow(v),
    });
  }

  frames.push({
    say: `Sorted in O(n + K) — one pass to tally, one to rebuild. K is the range of values, so this is only worth it when the numbers are small. Sorting values up to a billion would need a billion slots.`,
    rowLabel: "sorted",
    row: row(out, span(0, out.length - 1, "good"), { index: false }),
    vars: vars({ n: input.length, K, cost: "O(n + K)" }),
  });

  return {
    title: "Counting sort: no comparisons at all",
    blurb: "The value is the index. That is the whole trick, and the whole limitation.",
    code,
    frames,
  };
}

export function traceRadixSort(input: number[]): Viz {
  const code = `for (int exp = 1; maxVal / exp > 0; exp *= 10) {
  // stable counting sort on the digit at this place
  countingSortByDigit(a, exp);
}`;
  const frames: Frame[] = [];
  let a = [...input];
  const maxVal = Math.max(...a);
  const digitOf = (x: number, exp: number) => Math.floor(x / exp) % 10;

  frames.push({
    say: "Counting sort needs a small range. Radix sort gets round that by sorting one digit at a time, starting from the last.",
    line: 1,
    rowLabel: "input",
    row: row(a, {}, { index: false }),
  });

  let place = 1;
  let pass = 1;
  while (Math.floor(maxVal / place) > 0) {
    const name = place === 1 ? "ones" : place === 10 ? "tens" : place === 100 ? "hundreds" : `${place}s`;

    frames.push({
      say: `Pass ${pass}: sort by the ${name} digit only.`,
      line: 1,
      rowLabel: `by ${name} digit`,
      row: a.map((x) => ({ v: String(x), i: String(digitOf(x, place)), tone: "compare" })),
      vars: vars({ place, pass }),
    });

    // Stable bucket pass, which is what makes radix work at all.
    const buckets: number[][] = Array.from({ length: 10 }, () => []);
    for (const x of a) buckets[digitOf(x, place)].push(x);

    const width = Math.max(1, ...buckets.map((b) => b.length));
    frames.push({
      say: "Drop each number into the bucket for that digit, keeping the order they arrived in. That stability is what stops earlier passes being undone.",
      line: 3,
      gridLabel: "buckets 0-9",
      grid: buckets.map((b) =>
        Array.from({ length: width }, (_, k): Cell => ({
          v: b[k] === undefined ? "·" : String(b[k]),
          tone: b[k] === undefined ? "ghost" : "good",
        })),
      ),
      gridRowNames: buckets.map((_, d) => String(d)),
      vars: vars({ place }),
    });

    a = buckets.flat();
    frames.push({
      say: `Read the buckets back out, 0 first. The list is now sorted by the ${name} digit — and still in the right order for every digit before it.`,
      rowLabel: `after pass ${pass}`,
      row: a.map((x) => ({ v: String(x), i: String(digitOf(x, place)), tone: "done" })),
      vars: vars({ pass }),
    });

    place *= 10;
    pass++;
  }

  frames.push({
    say: `Sorted after ${pass - 1} passes — one per digit. Each pass is O(n), so the whole thing is O(d · n), where d is the number of digits. No two numbers were ever compared.`,
    rowLabel: "sorted",
    row: row(a, span(0, a.length - 1, "good"), { index: false }),
    vars: vars({ passes: pass - 1, cost: "O(d · n)" }),
  });

  return {
    title: "Radix sort: one digit at a time, last digit first",
    blurb: "Each pass must be stable, or the previous pass's work is lost.",
    code,
    frames,
  };
}
