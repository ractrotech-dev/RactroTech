// Hashing, bits, stacks, queues, deques, linked lists, tries, string matching.

import { row, span, vars, type Cell, type Frame, type Viz, type VizEdge, type VizNode } from "@/lib/dsa/viz/types";

/* -------------------------------------------------------------- hashing -- */

export function traceHashTable(keys: number[], buckets: number): Viz {
  const code = `int hash(int key) { return key % ${buckets}; }

// insert
table[hash(key)].push_back(key);

// lookup: only one bucket is ever searched`;
  const table: number[][] = Array.from({ length: buckets }, () => []);
  const frames: Frame[] = [];
  const draw = (hot: number | null, say: string, line?: number) => {
    const width = Math.max(3, ...table.map((b) => b.length));
    const grid: Cell[][] = table.map((bucket, b) =>
      Array.from({ length: width }, (_, k): Cell => ({
        v: bucket[k] === undefined ? "·" : String(bucket[k]),
        tone: bucket[k] === undefined ? "ghost" : b === hot && k === bucket.length - 1 ? "good" : "done",
      })),
    );
    frames.push({
      say,
      line,
      grid,
      gridLabel: "table",
      gridRowNames: table.map((_, b) => `[${b}]`),
    });
  };

  draw(null, `${buckets} empty buckets. A hash function turns any key into a bucket number.`, 1);
  for (const key of keys) {
    const b = key % buckets;
    const collision = table[b].length > 0;
    table[b].push(key);
    draw(
      b,
      collision
        ? `${key} % ${buckets} = ${b}, but bucket ${b} is already taken. That is a collision — hang ${key} on the same hook. Lookups here now cost two checks, not one.`
        : `${key} % ${buckets} = ${b}. Drop ${key} straight into bucket ${b} — no searching, no comparing.`,
      4,
    );
  }
  const target = keys[keys.length - 2];
  draw(
    target % buckets,
    `Now find ${target}. Compute ${target} % ${buckets} = ${target % buckets} and look only in that bucket. The other ${buckets - 1} buckets are never touched — that is O(1).`,
    6,
  );
  frames.push({
    say: "A hash map is this, with a smarter hash and automatic growth. It trades memory for speed: you buy instant lookup by keeping empty space around.",
    grid: table.map((bucket, b) =>
      Array.from({ length: Math.max(3, ...table.map((x) => x.length)) }, (_, k): Cell => ({
        v: bucket[k] === undefined ? "·" : String(bucket[k]),
        tone: bucket[k] === undefined ? "ghost" : b === target % buckets ? "good" : "done",
      })),
    ),
    gridLabel: "table",
    gridRowNames: table.map((_, b) => `[${b}]`),
  });
  return {
    title: "A hash table is a shelf plus arithmetic",
    blurb: "Watch each key skip the search entirely and land in one bucket.",
    code,
    frames,
  };
}

export function traceTwoSumHash(a: number[], target: number): Viz {
  const code = `unordered_map<int,int> seen;
for (int i = 0; i < n; i++) {
  int need = target - a[i];
  if (seen.count(need)) return {seen[need], i};
  seen[a[i]] = i;
}`;
  const frames: Frame[] = [];
  const seen = new Map<number, number>();
  const shelf = (hot?: number): Cell[] => {
    const entries = [...seen.entries()];
    if (!entries.length) return [{ v: "empty", tone: "ghost" }];
    return entries.map(([k, v]) => ({ v: String(k), i: `i=${v}`, tone: k === hot ? "good" : "done" }));
  };
  frames.push({
    say: `Find two numbers adding to ${target}. This array is NOT sorted, so two pointers is out. Instead we remember what we have already seen.`,
    row: row(a),
    row2Label: "seen",
    row2: shelf(),
    vars: vars({ target }),
  });
  for (let i = 0; i < a.length; i++) {
    const need = target - a[i];
    const found = seen.has(need);
    frames.push({
      say: `At ${a[i]}, the partner we would need is ${target} − ${a[i]} = ${need}. Have we seen ${need} before?`,
      line: 3,
      row: row(a, { ...span(0, i - 1, "done"), [i]: "active" }),
      row2Label: "seen",
      row2: shelf(found ? need : undefined),
      vars: vars({ "a[i]": a[i], need }),
    });
    if (found) {
      frames.push({
        say: `Yes — ${need} was at index ${seen.get(need)}. Answer found in one pass, never comparing every pair.`,
        line: 4,
        row: row(a, { [seen.get(need)!]: "good", [i]: "good" }),
        row2Label: "seen",
        row2: shelf(need),
        out: `${seen.get(need)} ${i}`,
      });
      break;
    }
    seen.set(a[i], i);
    frames.push({
      say: `No. File ${a[i]} away so a later number can find it instantly.`,
      line: 6,
      row: row(a, { ...span(0, i, "done") }),
      row2Label: "seen",
      row2: shelf(a[i]),
    });
  }
  return {
    title: "Hashing turns 'search again' into 'already know'",
    blurb: "The nested loop disappears because the map answers instantly.",
    code,
    frames,
  };
}

/* ----------------------------------------------------------------- bits -- */

const bitsOf = (x: number, width = 8) =>
  x.toString(2).padStart(width, "0").split("").map(Number);

export function traceBitOps(x: number, y: number): Viz {
  const code = `x & y   // 1 only where BOTH are 1
x | y   // 1 where EITHER is 1
x ^ y   // 1 where they DIFFER
x << 1  // shift left = multiply by 2
x >> 1  // shift right = divide by 2`;
  const width = 8;
  const bitRow = (n: number, hot: Set<number> = new Set(), label?: string): Cell[] =>
    bitsOf(n, width).map((b, i) => ({
      v: String(b),
      i: label && i === 0 ? label : undefined,
      tone: hot.has(i) ? "good" : b ? "active" : "idle",
    }));

  const frames: Frame[] = [];
  frames.push({
    say: `Every number is already a row of 0s and 1s. ${x} is ${bitsOf(x, width).join("")} and ${y} is ${bitsOf(y, width).join("")}.`,
    rowLabel: `x = ${x}`,
    row: bitRow(x),
    row2Label: `y = ${y}`,
    row2: bitRow(y),
  });
  const ops: [string, number, string, number][] = [
    ["&", x & y, "AND keeps a 1 only where both rows have a 1. Everything else is wiped out.", 1],
    ["|", x | y, "OR keeps a 1 where either row has one. It merges the two.", 2],
    ["^", x ^ y, "XOR gives 1 only where the rows disagree. Equal bits cancel to 0 — which is why x ^ x is always 0.", 3],
  ];
  for (const [sym, val, say, line] of ops) {
    const hot = new Set<number>();
    bitsOf(val, width).forEach((b, i) => b && hot.add(i));
    frames.push({
      say,
      line,
      rowLabel: `x = ${x}`,
      row: bitRow(x),
      row2Label: `x ${sym} y = ${val}`,
      row2: bitRow(val, hot),
      vars: vars({ [`${x} ${sym} ${y}`]: val }),
    });
  }
  frames.push({
    say: `Shifting left by 1 pushes every bit one place up and puts a 0 at the end — that is exactly ×2. ${x} << 1 = ${x << 1}.`,
    line: 4,
    rowLabel: `x = ${x}`,
    row: bitRow(x),
    row2Label: `x << 1 = ${x << 1}`,
    row2: bitRow(x << 1),
  });
  frames.push({
    say: `Shifting right drops the last bit — that is ÷2, rounded down. ${x} >> 1 = ${x >> 1}.`,
    line: 5,
    rowLabel: `x = ${x}`,
    row: bitRow(x),
    row2Label: `x >> 1 = ${x >> 1}`,
    row2: bitRow(x >> 1),
  });
  frames.push({
    say: "One more that shows up constantly: x & 1 asks 'is the last bit 1?', which is exactly 'is x odd?'.",
    rowLabel: `x = ${x}`,
    row: bitRow(x, new Set([width - 1])),
    vars: vars({ "x & 1": x & 1, odd: x % 2 === 1 ? "yes" : "no" }),
  });
  return {
    title: "The five bit operations, seen as rows",
    blurb: "Line the two numbers up and compare them column by column.",
    code,
    frames,
  };
}

export function traceXorUnique(a: number[]): Viz {
  const code = `int ans = 0;
for (int x : a) ans ^= x;
return ans;   // the number that appeared once`;
  const frames: Frame[] = [];
  let ans = 0;
  const width = 5;
  const bitRow = (n: number): Cell[] => bitsOf(n, width).map((b) => ({ v: String(b), tone: b ? "active" : "idle" }));
  frames.push({
    say: "Every number appears twice except one. Sorting or a hash map would work — but XOR needs no extra memory at all.",
    row: row(a, {}, { index: false }),
    row2Label: "ans = 0",
    row2: bitRow(0),
  });
  a.forEach((x, i) => {
    ans ^= x;
    frames.push({
      say: `XOR in ${x}. Running answer is now ${ans}.`,
      line: 2,
      row: row(a, { ...span(0, i - 1, "done"), [i]: "active" }, { index: false }),
      row2Label: `ans = ${ans}`,
      row2: bitRow(ans),
      vars: vars({ ans }),
    });
  });
  frames.push({
    say: `Answer: ${ans}. Every pair cancelled itself out (x ^ x = 0) and order never mattered, so only the lonely number survived. O(n) time, zero extra space.`,
    row: row(a, span(0, a.length - 1, "done"), { index: false }),
    row2Label: `ans = ${ans}`,
    row2: bitRow(ans),
    out: String(ans),
  });
  return {
    title: "XOR cancels pairs for free",
    blurb: "Watch bits flip on and back off as each pair meets.",
    code,
    frames,
  };
}

/* ---------------------------------------------------------------- stack -- */

export function traceStack(): Viz {
  const code = `stack<int> st;
st.push(3);
st.push(7);
st.push(5);
st.pop();      // removes 5, not 3
cout << st.top();`;
  const frames: Frame[] = [];
  const st: number[] = [];
  const draw = (say: string, line: number, tone: Cell["tone"] = "active") => {
    const cells: Cell[] = st.map((v, i) => ({
      v: String(v),
      i: i === st.length - 1 ? "top" : undefined,
      tone: i === st.length - 1 ? tone : "done",
    }));
    frames.push({
      say,
      line,
      rowLabel: "stack (top on the right)",
      row: cells.length ? cells : [{ v: "empty", tone: "ghost" }],
      vars: vars({ size: st.length, top: st.length ? st[st.length - 1] : "—" }),
    });
  };
  draw("An empty stack. Think of a pile of plates: you can only touch the one on top.", 1);
  for (const [v, line] of [[3, 2], [7, 3], [5, 4]] as const) {
    st.push(v);
    draw(`push(${v}) puts ${v} on top. The ones below are now buried.`, line);
  }
  const gone = st.pop();
  draw(`pop() removes ${gone} — the last one in. You cannot reach 3 without removing everything above it. That is LIFO.`, 5, "bad");
  draw(`top() is now ${st[st.length - 1]}. Push, pop and top are all O(1) — a stack never searches.`, 6, "good");
  return {
    title: "A stack only has a top",
    blurb: "Last in, first out. Every operation touches one end.",
    code,
    frames,
  };
}

export function traceBalanced(s: string): Viz {
  const code = `for (char c : s) {
  if (isOpen(c)) st.push(c);
  else {
    if (st.empty() || !matches(st.top(), c)) return false;
    st.pop();
  }
}
return st.empty();`;
  const chars = s.split("");
  const pairs: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
  const frames: Frame[] = [];
  const st: string[] = [];
  let bad = false;
  const stackRow = (tone: Cell["tone"] = "active"): Cell[] =>
    st.length
      ? st.map((v, i) => ({ v, i: i === st.length - 1 ? "top" : undefined, tone: i === st.length - 1 ? tone : "done" }))
      : [{ v: "empty", tone: "ghost" }];

  frames.push({
    say: "A bracket closes the most recent opener that is still waiting. 'Most recent' is exactly what a stack remembers.",
    row: row(chars, {}, { index: false }),
    row2Label: "stack",
    row2: stackRow(),
  });
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (!pairs[c]) {
      st.push(c);
      frames.push({
        say: `'${c}' is an opener. Push it and remember it is still unclosed.`,
        line: 2,
        row: row(chars, { ...span(0, i - 1, "done"), [i]: "active" }, { index: false }),
        row2Label: "stack",
        row2: stackRow(),
      });
    } else {
      const top = st[st.length - 1];
      const ok = top === pairs[c];
      frames.push({
        say: ok
          ? `'${c}' closes. The top of the stack is '${top}' — a correct match, so pop it.`
          : `'${c}' closes, but the top is '${top ?? "nothing"}'. Mismatch — the string is broken.`,
        line: ok ? 5 : 4,
        row: row(chars, { ...span(0, i - 1, "done"), [i]: ok ? "good" : "bad" }, { index: false }),
        row2Label: "stack",
        row2: stackRow(ok ? "good" : "bad"),
      });
      if (!ok) {
        bad = true;
        break;
      }
      st.pop();
      frames.push({
        say: "Popped. That pair is settled and gone.",
        line: 5,
        row: row(chars, span(0, i, "done"), { index: false }),
        row2Label: "stack",
        row2: stackRow(),
      });
    }
  }
  if (!bad) {
    frames.push({
      say: st.length
        ? `The string ended but ${st.length} opener(s) are still waiting. Not balanced.`
        : "Every opener was closed and the stack is empty. Balanced.",
      line: 8,
      row: row(chars, span(0, chars.length - 1, st.length ? "bad" : "good"), { index: false }),
      row2Label: "stack",
      row2: stackRow(),
      out: st.length ? "false" : "true",
    });
  }
  return {
    title: "Brackets are the reason stacks exist",
    blurb: "The stack holds exactly the openers still waiting for a partner.",
    code,
    frames,
  };
}

export function traceNextGreater(a: number[]): Viz {
  const code = `stack<int> st;               // holds indices
for (int i = n - 1; i >= 0; i--) {
  while (!st.empty() && a[st.top()] <= a[i]) st.pop();
  ans[i] = st.empty() ? -1 : a[st.top()];
  st.push(i);
}`;
  const frames: Frame[] = [];
  const ans = Array<number>(a.length).fill(-1);
  const st: number[] = [];
  const ansRow = (hot?: number): Cell[] =>
    ans.map((v, i) => ({ v: v === -1 && i > (hot ?? -1) ? "·" : String(v), i: String(i), tone: i === hot ? "good" : i > (hot ?? -1) ? "ghost" : "done" }));
  const stRow = (): Cell[] =>
    st.length ? st.map((i) => ({ v: String(a[i]), i: `i=${i}`, tone: "active" })) : [{ v: "empty", tone: "ghost" }];

  frames.push({
    say: "For each number, find the first bigger number to its right. The slow way is a loop inside a loop. Walk backwards with a stack instead.",
    row: row(a),
    row2Label: "stack",
    row2: stRow(),
  });
  for (let i = a.length - 1; i >= 0; i--) {
    frames.push({
      say: `At ${a[i]}. The stack holds the numbers to its right that could still be somebody's answer.`,
      line: 2,
      row: row(a, { ...span(i + 1, a.length - 1, "done"), [i]: "active" }),
      row2Label: "stack",
      row2: stRow(),
    });
    while (st.length && a[st[st.length - 1]] <= a[i]) {
      frames.push({
        say: `${a[st[st.length - 1]]} on top is not bigger than ${a[i]}. It is now useless: anything further left would meet ${a[i]} first. Pop it forever.`,
        line: 3,
        row: row(a, { [i]: "active", [st[st.length - 1]]: "bad" }),
        row2Label: "stack",
        row2: stRow(),
      });
      st.pop();
    }
    ans[i] = st.length ? a[st[st.length - 1]] : -1;
    frames.push({
      say: st.length
        ? `Whatever survives on top is the nearest bigger number: ${ans[i]}.`
        : "The stack is empty, so nothing to the right is bigger. Answer is −1.",
      line: 4,
      row: row(a, { [i]: "good", ...(st.length ? { [st[st.length - 1]]: "compare" } : {}) }),
      row2Label: "answers",
      row2: ansRow(i),
    });
    st.push(i);
  }
  frames.push({
    say: "Every index is pushed once and popped at most once, so the whole thing is O(n) even though there is a while loop inside a for loop.",
    row: row(a),
    row2Label: "answers",
    row2: ansRow(0),
  });
  return {
    title: "Monotonic stack: throw away what can never win",
    blurb: "Watch numbers get popped the moment a bigger one appears — they are useless from then on.",
    code,
    frames,
  };
}

/* ---------------------------------------------------------------- queue -- */

export function traceQueue(): Viz {
  const code = `queue<int> q;
q.push(3); q.push(7); q.push(5);
q.pop();          // removes 3, the oldest
cout << q.front();`;
  const frames: Frame[] = [];
  const q: number[] = [];
  const draw = (say: string, line: number, tone: Cell["tone"] = "active") => {
    frames.push({
      say,
      line,
      rowLabel: "queue (front on the left)",
      row: q.length
        ? q.map((v, i) => ({
            v: String(v),
            i: i === 0 ? "front" : i === q.length - 1 ? "back" : undefined,
            tone: i === 0 ? tone : "done",
          }))
        : [{ v: "empty", tone: "ghost" }],
      vars: vars({ size: q.length, front: q[0] ?? "—" }),
    });
  };
  draw("An empty queue. Think of a line at a shop — you join at the back, you are served from the front.", 1);
  for (const v of [3, 7, 5]) {
    q.push(v);
    draw(`push(${v}) joins the back of the line.`, 2);
  }
  const gone = q.shift();
  draw(`pop() serves ${gone}, the one who has waited longest. First in, first out — the opposite of a stack.`, 3, "bad");
  draw(`front() is now ${q[0]}. This fairness is exactly what BFS needs to explore a graph level by level.`, 4, "good");
  return {
    title: "A queue is a fair line",
    blurb: "Join at the back, leave from the front. Nothing overtakes.",
    code,
    frames,
  };
}

export function traceDequeWindowMax(a: number[], k: number): Viz {
  const code = `deque<int> dq;                 // indices, values decreasing
for (int i = 0; i < n; i++) {
  if (dq.front() <= i - k) dq.pop_front();
  while (!dq.empty() && a[dq.back()] <= a[i]) dq.pop_back();
  dq.push_back(i);
  if (i >= k - 1) ans.push_back(a[dq.front()]);
}`;
  const frames: Frame[] = [];
  const dq: number[] = [];
  const ans: number[] = [];
  const dqRow = (): Cell[] =>
    dq.length ? dq.map((i) => ({ v: String(a[i]), i: `i=${i}`, tone: "active" })) : [{ v: "empty", tone: "ghost" }];

  frames.push({
    say: `Find the maximum of every window of ${k}. Checking each window costs O(n·k). A deque makes it O(n).`,
    row: row(a),
    row2Label: "deque",
    row2: dqRow(),
  });
  for (let i = 0; i < a.length; i++) {
    if (dq.length && dq[0] <= i - k) {
      frames.push({
        say: `Index ${dq[0]} has slid out of the window. Drop it from the front.`,
        line: 3,
        row: row(a, { ...span(Math.max(0, i - k + 1), i, "window"), [dq[0]]: "bad" }),
        row2Label: "deque",
        row2: dqRow(),
      });
      dq.shift();
    }
    while (dq.length && a[dq[dq.length - 1]] <= a[i]) {
      frames.push({
        say: `${a[dq[dq.length - 1]]} at the back is not bigger than the new ${a[i]}, and it leaves the window sooner. It can never be a maximum again — drop it.`,
        line: 4,
        row: row(a, { [i]: "active", [dq[dq.length - 1]]: "bad" }),
        row2Label: "deque",
        row2: dqRow(),
      });
      dq.pop();
    }
    dq.push(i);
    if (i >= k - 1) {
      ans.push(a[dq[0]]);
      frames.push({
        say: `Window [${i - k + 1}…${i}] is full. The front of the deque is always the biggest — ${a[dq[0]]}.`,
        line: 6,
        row: row(a, { ...span(i - k + 1, i, "window"), [dq[0]]: "good" }),
        row2Label: "deque",
        row2: dqRow(),
        out: ans.join(" "),
      });
    } else {
      frames.push({
        say: `Window is not full yet (${i + 1} of ${k}).`,
        line: 5,
        row: row(a, { ...span(0, i, "window") }),
        row2Label: "deque",
        row2: dqRow(),
      });
    }
  }
  frames.push({
    say: `Maxima: ${ans.join(", ")}. The deque always stays sorted downward, so the answer is simply whatever sits at the front.`,
    row: row(a),
    row2Label: "deque",
    row2: dqRow(),
    out: ans.join(" "),
  });
  return {
    title: "A deque keeps only the candidates that matter",
    blurb: "Values inside the deque always decrease left to right. Watch that never break.",
    code,
    frames,
  };
}

/* ---------------------------------------------------------- linked list -- */

const listNodes = (values: (number | string)[], tones: Record<number, VizNode["tone"]> = {}, subs: Record<number, string> = {}): VizNode[] =>
  values.map((v, i) => ({
    id: `n${i}`,
    label: String(v),
    x: 12 + (i * 76) / Math.max(1, values.length - 1),
    y: 40,
    tone: tones[i] ?? "idle",
    sub: subs[i],
  }));

const listEdges = (n: number, tones: Record<number, VizEdge["tone"]> = {}, reversedUpto = -1): VizEdge[] =>
  Array.from({ length: n - 1 }, (_, i) =>
    i < reversedUpto
      ? { from: `n${i + 1}`, to: `n${i}`, tone: tones[i] ?? "good", arrow: true }
      : { from: `n${i}`, to: `n${i + 1}`, tone: tones[i] ?? "idle", arrow: true },
  );

export function traceLinkedList(values: number[]): Viz {
  const code = `struct Node { int val; Node* next; };

// walk it
Node* cur = head;
while (cur) { cout << cur->val; cur = cur->next; }`;
  const frames: Frame[] = [];
  frames.push({
    say: "An array is one solid block. A linked list is separate boxes, each holding a value and the address of the next box.",
    nodes: listNodes(values, { 0: "active" }, { 0: "head" }),
    edges: listEdges(values.length),
  });
  frames.push({
    say: "There is no index. To reach the third box you must walk through the first two — there is no jump.",
    nodes: listNodes(values, { 0: "compare" }, { 0: "head" }),
    edges: listEdges(values.length, { 0: "compare" }),
    vars: vars({ cur: values[0] }),
  });
  let out = "";
  values.forEach((v, i) => {
    out += `${v} `;
    frames.push({
      say: `cur is at ${v}. Print it, then follow cur->next.`,
      line: 5,
      nodes: listNodes(values, { ...Object.fromEntries(values.slice(0, i).map((_, k) => [k, "done" as const])), [i]: "active" }, { 0: "head" }),
      edges: listEdges(values.length, Object.fromEntries(values.slice(0, i).map((_, k) => [k, "done" as const]))),
      vars: vars({ cur: v }),
      out,
    });
  });
  frames.push({
    say: "cur becomes nullptr and the walk ends. Reading is O(n) — but inserting in the middle is O(1), because you only rewire two arrows instead of shifting a million boxes.",
    nodes: [...listNodes(values, Object.fromEntries(values.map((_, k) => [k, "done" as const])), { 0: "head" })],
    edges: listEdges(values.length, Object.fromEntries(values.map((_, k) => [k, "done" as const]))),
    out,
  });
  frames.push({
    say: "Insert 9 after the second box: point 9 at the third box, then point the second box at 9. Nothing else moves.",
    nodes: [
      ...listNodes(values, { 1: "compare", 2: "compare" }, { 0: "head" }),
      { id: "new", label: "9", x: 50, y: 76, tone: "good", sub: "new" },
    ],
    edges: [
      ...listEdges(values.length).filter((_, i) => i !== 1),
      { from: "new", to: "n2", tone: "good", arrow: true },
      { from: "n1", to: "new", tone: "good", arrow: true },
    ],
  });
  return {
    title: "Boxes joined by arrows",
    blurb: "No indexes, no jumping. Cheap to rewire, expensive to reach.",
    code,
    frames,
  };
}

export function traceReverseList(values: number[]): Viz {
  const code = `Node *prev = nullptr, *cur = head;
while (cur) {
  Node* nxt = cur->next;   // save it first
  cur->next = prev;        // flip the arrow
  prev = cur;              // step both
  cur  = nxt;
}
head = prev;`;
  const frames: Frame[] = [];
  const n = values.length;
  frames.push({
    say: "Reversing a list means flipping every arrow. Three names are enough: prev, cur, next.",
    line: 1,
    nodes: listNodes(values, { 0: "active" }, { 0: "cur" }),
    edges: listEdges(n),
    vars: vars({ prev: "null", cur: values[0] }),
  });
  for (let i = 0; i < n; i++) {
    frames.push({
      say: i + 1 < n
        ? `Save the next box (${values[i + 1]}) first. The moment we flip the arrow, the rest of the list would be unreachable otherwise.`
        : "This is the last box; next is null.",
      line: 3,
      nodes: listNodes(values, { [i]: "active", ...(i + 1 < n ? { [i + 1]: "compare" } : {}) }, { [i]: "cur", ...(i + 1 < n ? { [i + 1]: "nxt" } : {}) }),
      edges: listEdges(n, {}, i),
      vars: vars({ prev: i ? values[i - 1] : "null", cur: values[i], nxt: i + 1 < n ? values[i + 1] : "null" }),
    });
    frames.push({
      say: `Point ${values[i]} backwards at ${i ? values[i - 1] : "null"}. One arrow flipped.`,
      line: 4,
      nodes: listNodes(values, { [i]: "good" }, { [i]: "cur" }),
      edges: listEdges(n, {}, i + 1),
      vars: vars({ prev: i ? values[i - 1] : "null", cur: values[i] }),
    });
  }
  frames.push({
    say: `cur fell off the end, so prev (${values[n - 1]}) is the new head. One pass, no extra array — O(n) time and O(1) space.`,
    line: 8,
    nodes: listNodes(values, Object.fromEntries(values.map((_, k) => [k, "good" as const])), { [n - 1]: "head" }),
    edges: listEdges(n, {}, n),
  });
  return {
    title: "Flip every arrow with three names",
    blurb: "The order of the three lines matters. Save next before you destroy it.",
    code,
    frames,
  };
}

export function traceFastSlow(values: number[]): Viz {
  const code = `Node *slow = head, *fast = head;
while (fast && fast->next) {
  slow = slow->next;
  fast = fast->next->next;
}
// slow is now the middle`;
  const frames: Frame[] = [];
  const n = values.length;
  let slow = 0;
  let fast = 0;
  frames.push({
    say: "Finding the middle without knowing the length. Two walkers start together; one moves twice as fast.",
    line: 1,
    nodes: listNodes(values, { 0: "active" }, { 0: "slow+fast" }),
    edges: listEdges(n),
  });
  while (fast < n && fast + 1 < n) {
    slow += 1;
    fast += 2;
    frames.push({
      say: `slow takes 1 step (now at ${values[slow]}), fast takes 2 (now at ${fast < n ? values[fast] : "the end"}).`,
      line: 4,
      nodes: listNodes(
        values,
        { [slow]: "active", ...(fast < n ? { [fast]: "compare" } : {}) },
        { [slow]: "slow", ...(fast < n ? { [fast]: "fast" } : {}) },
      ),
      edges: listEdges(n),
      vars: vars({ slow: values[slow], fast: fast < n ? values[fast] : "null" }),
    });
  }
  frames.push({
    say: `fast has reached the end after covering the whole list, so slow — at ${values[slow]} — has covered exactly half. One pass, no counting, no second walk.`,
    nodes: listNodes(values, { [slow]: "good" }, { [slow]: "middle" }),
    edges: listEdges(n),
    out: String(values[slow]),
  });
  return {
    title: "Two speeds find the middle in one pass",
    blurb: "The same trick detects a loop: in a circle, fast eventually laps slow.",
    code,
    frames,
  };
}

/* ----------------------------------------------------------------- trie -- */

export function traceTrie(words: string[], lookup: string): Viz {
  const code = `struct Node { Node* kid[26]; bool end; };

// insert: walk letter by letter, create what is missing
// search: walk the same path; missing kid means not found`;
  type T = { id: string; ch: string; kids: Map<string, T>; end: boolean; depth: number };
  const root: T = { id: "r", ch: "•", kids: new Map(), end: false, depth: 0 };
  let counter = 0;
  const frames: Frame[] = [];

  const layout = (hot: Set<string>, good: Set<string> = new Set()) => {
    const byDepth: T[][] = [];
    const walk = (t: T) => {
      (byDepth[t.depth] ??= []).push(t);
      t.kids.forEach(walk);
    };
    walk(root);
    const nodes: VizNode[] = [];
    const edges: VizEdge[] = [];
    byDepth.forEach((level, d) => {
      level.forEach((t, i) => {
        nodes.push({
          id: t.id,
          label: t.ch,
          x: ((i + 1) * 100) / (level.length + 1),
          y: 12 + d * 20,
          tone: good.has(t.id) ? "good" : hot.has(t.id) ? "active" : t.end ? "done" : "idle",
          sub: t.end ? "word" : undefined,
        });
        t.kids.forEach((kid) => edges.push({ from: t.id, to: kid.id, tone: hot.has(kid.id) || good.has(kid.id) ? "active" : "idle", arrow: true }));
      });
    });
    return { nodes, edges };
  };

  frames.push({ say: "One root and nothing else. A trie stores words by sharing their beginnings.", ...layout(new Set()) });
  for (const word of words) {
    let cur = root;
    for (const ch of word) {
      const fresh = !cur.kids.has(ch);
      if (fresh) cur.kids.set(ch, { id: `n${counter++}`, ch, kids: new Map(), end: false, depth: cur.depth + 1 });
      cur = cur.kids.get(ch)!;
      frames.push({
        say: fresh
          ? `Inserting "${word}": '${ch}' was missing, so a new node is created.`
          : `Inserting "${word}": '${ch}' already exists — reuse it. This shared path is why a trie saves space.`,
        ...layout(new Set([cur.id])),
        vars: vars({ word, letter: ch }),
      });
    }
    cur.end = true;
    frames.push({ say: `Mark the last node so we know "${word}" is a whole word, not just a prefix.`, ...layout(new Set(), new Set([cur.id])) });
  }
  let cur: T | undefined = root;
  const path: string[] = [];
  for (const ch of lookup) {
    cur = cur?.kids.get(ch);
    if (!cur) break;
    path.push(cur.id);
    frames.push({
      say: `Searching "${lookup}": follow '${ch}'. Each letter is one hop — the cost depends on the word length, not on how many words are stored.`,
      ...layout(new Set(path)),
      vars: vars({ searching: lookup, at: ch }),
    });
  }
  frames.push({
    say: cur?.end
      ? `"${lookup}" is stored here. Any word starting with this prefix lives in the subtree below — which is how autocomplete works.`
      : `The path exists but no end mark, so "${lookup}" is only a prefix — not a stored word.`,
    ...layout(new Set(path), cur ? new Set([cur.id]) : new Set()),
  });
  return {
    title: "A tree of letters",
    blurb: "Shared prefixes share nodes. Watch 'ca' get reused by every ca- word.",
    code,
    frames,
  };
}

/* ------------------------------------------------------- string matching -- */

export function traceLps(pattern: string): Viz {
  const code = `lps[0] = 0;
int len = 0;
for (int i = 1; i < m; ) {
  if (p[i] == p[len]) lps[i++] = ++len;
  else if (len)       len = lps[len - 1];
  else                lps[i++] = 0;
}`;
  const p = pattern.split("");
  const m = p.length;
  const lps = Array<number>(m).fill(0);
  const frames: Frame[] = [];
  const lpsRow = (upto: number, hot?: number): Cell[] =>
    p.map((_, i) => ({ v: i <= upto ? String(lps[i]) : "·", i: String(i), tone: i > upto ? "ghost" : i === hot ? "good" : "done" }));

  frames.push({
    say: `lps[i] answers: in "${pattern}" up to position i, how long is the longest piece that is both a prefix and a suffix? This is what lets KMP never re-check a character.`,
    row: row(p, { 0: "done" }, { index: true }),
    row2Label: "lps",
    row2: lpsRow(0),
  });
  let len = 0;
  let i = 1;
  while (i < m) {
    if (p[i] === p[len]) {
      len++;
      lps[i] = len;
      frames.push({
        say: `'${p[i]}' matches '${p[len - 1]}' at the front. The matching prefix grows to ${len}.`,
        line: 4,
        row: row(p, { [i]: "good", ...span(0, len - 1, "window") }),
        marks: [
          { at: i, name: "i" },
          { at: len - 1, name: "len", tone: "window" },
        ],
        row2Label: "lps",
        row2: lpsRow(i, i),
        vars: vars({ i, len }),
      });
      i++;
    } else if (len) {
      frames.push({
        say: `'${p[i]}' breaks the run. Do not restart from zero — fall back to lps[${len - 1}] = ${lps[len - 1]}, the next best prefix we already proved.`,
        line: 5,
        row: row(p, { [i]: "bad", [len]: "compare" }),
        row2Label: "lps",
        row2: lpsRow(i - 1),
        vars: vars({ i, "len was": len, "len now": lps[len - 1] }),
      });
      len = lps[len - 1];
    } else {
      lps[i] = 0;
      frames.push({
        say: `No prefix matches here at all, so lps[${i}] = 0.`,
        line: 6,
        row: row(p, { [i]: "bad" }),
        row2Label: "lps",
        row2: lpsRow(i, i),
        vars: vars({ i, len }),
      });
      i++;
    }
  }
  frames.push({
    say: `The table is built in one pass. When a search fails at position i, KMP jumps back by lps[i−1] instead of 1 — so the text pointer never moves backwards, giving O(n + m).`,
    row: row(p, span(0, m - 1, "done")),
    row2Label: "lps",
    row2: lpsRow(m - 1),
  });
  return {
    title: "The table that makes KMP fast",
    blurb: "A prefix that is also a suffix means part of the pattern is already matched.",
    code,
    frames,
  };
}

/* ------------------------------------------------- doubly & circular -- */

export function traceDoublyCircular(values: number[]): Viz {
  const n = values.length;
  const frames: Frame[] = [];
  const nodes = (tones: Record<number, VizNode["tone"]> = {}, subs: Record<number, string> = {}): VizNode[] =>
    values.map((v, i) => ({
      id: `n${i}`,
      label: String(v),
      x: 14 + (i * 72) / Math.max(1, n - 1),
      y: 42,
      tone: tones[i] ?? "idle",
      sub: subs[i],
    }));

  const forward = (tone: VizEdge["tone"] = "idle"): VizEdge[] =>
    Array.from({ length: n - 1 }, (_, i) => ({ from: `n${i}`, to: `n${i + 1}`, tone, arrow: true }));
  const backward = (tone: VizEdge["tone"] = "idle"): VizEdge[] =>
    Array.from({ length: n - 1 }, (_, i) => ({ from: `n${i + 1}`, to: `n${i}`, tone, arrow: true }));

  frames.push({
    say: "A singly linked list only points forward. From any node you can reach what comes after it — and nothing that came before.",
    nodes: nodes({ 0: "active" }, { 0: "head" }),
    edges: forward("active"),
  });

  frames.push({
    say: `Standing on ${values[2]}, what comes before it? You cannot tell. The only way back is to start at the head and walk again — O(n) to answer a question about your own neighbour.`,
    nodes: nodes({ 2: "bad" }, { 2: "where is prev?" }),
    edges: forward(),
  });

  frames.push({
    say: "A doubly linked list adds a second pointer to every node: prev, alongside next. Now every node knows both neighbours.",
    nodes: nodes({}, { 0: "head", [n - 1]: "tail" }),
    edges: [...forward("good"), ...backward("compare")],
  });

  frames.push({
    say: `Now ${values[2]}->prev is ${values[1]}, straight away. Deleting a node also becomes O(1): you can reach the one before it without searching.`,
    nodes: nodes({ 1: "good", 2: "active" }, { 2: "cur", 1: "cur->prev" }),
    edges: [...forward(), ...backward("good")],
  });

  frames.push({
    say: "The price is memory — one extra pointer per node — and discipline. Every insert and delete must fix FOUR links, not two. Miss one and the list is quietly broken in one direction only.",
    nodes: nodes({ 1: "compare", 2: "compare" }),
    edges: [...forward("compare"), ...backward("compare")],
  });

  frames.push({
    say: "A circular list is a different change: instead of the last node pointing at null, it points back at the head.",
    nodes: nodes({ [n - 1]: "active", 0: "good" }, { 0: "head", [n - 1]: "tail" }),
    edges: [...forward(), { from: `n${n - 1}`, to: "n0", tone: "good", arrow: true }],
  });

  frames.push({
    say: "So there is no end. Walking never stops on its own — you must remember where you started and stop when you come back to it.",
    nodes: nodes({}, { 0: "start here" }),
    edges: [...forward("done"), { from: `n${n - 1}`, to: "n0", tone: "done", arrow: true }],
  });

  frames.push({
    say: "That is exactly what you want for things that take turns forever: round-robin scheduling, players in a game, a music playlist on repeat. A doubly circular list gives you both — every node knows both neighbours, and there is no end at all.",
    nodes: nodes({}, { 0: "head" }),
    edges: [
      ...forward("good"),
      { from: `n${n - 1}`, to: "n0", tone: "good", arrow: true },
      ...backward("compare"),
      { from: "n0", to: `n${n - 1}`, tone: "compare", arrow: true },
    ],
  });

  return {
    title: "Two pointers per node, or no end at all",
    blurb: "Doubly adds a way back. Circular removes the stopping point. They are independent choices.",
    code: `struct Node {
  int val;
  Node* next;
  Node* prev;      // doubly: the way back
};

// inserting b after a — FOUR links to fix
b->next = a->next;
b->prev = a;
if (a->next) a->next->prev = b;
a->next = b;`,
    frames,
  };
}

/* --------------------------------------------------------- bitmask sets -- */

/** Counting from 0 to 2ⁿ−1 enumerates every subset, once each. */
export function traceBitmaskSubsets(items: string[]): Viz {
  const n = items.length;
  const code = `int n = ${n};

for (int mask = 0; mask < (1 << n); mask++) {
  for (int i = 0; i < n; i++)
    if ((mask >> i) & 1)
      use(item[i]);
}`;
  const frames: Frame[] = [];
  const total = 1 << n;

  const bitsOf = (mask: number): Cell[] =>
    items.map((_, i) => ({
      v: String((mask >> i) & 1),
      i: items[i],
      tone: ((mask >> i) & 1) ? "good" : "ghost",
    }));

  const subsetOf = (mask: number) =>
    items.filter((_, i) => (mask >> i) & 1);

  frames.push({
    say: `A set of ${n} items. Every item is either in a subset or out of it — ${n} yes-or-no switches, so 2^${n} = ${total} possible subsets.`,
    rowLabel: "the items",
    row: items.map((it) => ({ v: it, tone: "active" as const })),
    line: 1,
    vars: vars({ items: n, subsets: total }),
  });

  frames.push({
    say: `Now look at the numbers 0 to ${total - 1} in binary. They are exactly ${total} rows of ${n} switches — the same thing, counted.`,
    rowLabel: `0 to ${total - 1} in binary`,
    row: Array.from({ length: total }, (_, m) => ({
      v: m.toString(2).padStart(n, "0"),
      i: String(m),
      tone: "compare" as const,
    })),
    vars: vars({ "1 << n": total }),
  });

  for (let mask = 0; mask < total; mask++) {
    const picked = subsetOf(mask);
    frames.push({
      say:
        mask === 0
          ? `mask 0 is ${mask.toString(2).padStart(n, "0")} — every switch off, so the EMPTY subset. It is a real subset and it is easy to forget.`
          : `mask ${mask} is ${mask.toString(2).padStart(n, "0")}. Read the bits as in-or-out flags: { ${picked.join(", ")} }.`,
      line: 3,
      rowLabel: `mask ${mask} = ${mask.toString(2).padStart(n, "0")}`,
      row: bitsOf(mask),
      row2Label: "the subset it means",
      row2: picked.length
        ? picked.map((it) => ({ v: it, tone: "good" as const }))
        : [{ v: "{ }", tone: "ghost" as const }],
      vars: vars({ mask, binary: mask.toString(2).padStart(n, "0"), size: picked.length }),
      out: `{ ${picked.join(" ")} }`,
    });
  }

  frames.push({
    say: `All ${total} subsets, once each, with no recursion at all — just a counting loop. The test for 'is item i in this one' is (mask >> i) & 1: shift the bit down, then look at it.`,
    rowLabel: "the test",
    row: [
      { v: "mask >> i", i: "shift it down", tone: "compare" },
      { v: "& 1", i: "look at it", tone: "good" },
    ],
    vars: vars({ enumerated: total }),
  });

  frames.push({
    say: "This is why bitmask DP exists: a subset of up to twenty items fits in a single int, so it can be an array index in a DP table.",
    rowLabel: "how far it scales",
    row: [
      { v: "2²⁰", i: "≈ 1 million", tone: "good" },
      { v: "2²⁵", i: "≈ 33 million", tone: "compare" },
      { v: "2³⁰", i: "≈ 1 billion", tone: "bad" },
    ],
    vars: vars({ hint: "n ≤ 20 in a problem statement" }),
  });

  return {
    title: "A number IS a set",
    blurb: "Watch a counting loop produce every subset, one bit pattern at a time.",
    code,
    frames,
  };
}
