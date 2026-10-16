// Binary trees, BSTs, heaps and segment trees.

import { row, span, vars, type Frame, type Tone, type Viz, type VizEdge, type VizNode } from "@/lib/dsa/viz/types";

/** A complete-ish tree laid out by level. index 0 is the root, 2i+1 / 2i+2 are kids. */
type Heapish = (number | null)[];

function layout(
  values: Heapish,
  tone: (i: number) => VizNode["tone"],
  sub: (i: number) => string | undefined = () => undefined,
): { nodes: VizNode[]; edges: VizEdge[] } {
  const nodes: VizNode[] = [];
  const edges: VizEdge[] = [];
  const depthOf = (i: number) => Math.floor(Math.log2(i + 1));
  const maxDepth = Math.max(...values.map((_, i) => depthOf(i)));
  values.forEach((v, i) => {
    if (v === null || v === undefined) return;
    const d = depthOf(i);
    const first = 2 ** d - 1;
    const slot = i - first;
    const count = 2 ** d;
    nodes.push({
      id: `n${i}`,
      label: String(v),
      x: ((slot + 0.5) * 100) / count,
      y: 12 + (d * 76) / Math.max(1, maxDepth),
      tone: tone(i),
      sub: sub(i),
    });
    if (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (values[parent] !== null && values[parent] !== undefined) {
        edges.push({ from: `n${parent}`, to: `n${i}`, tone: tone(i) === "idle" ? "idle" : "active" });
      }
    }
  });
  return { nodes, edges };
}

/* --------------------------------------------------------- binary tree -- */

/** The example tree used across the tree chapters. */
export const TREE: Heapish = [1, 2, 3, 4, 5, null, 6];

export function traceTraversal(kind: "inorder" | "preorder" | "postorder" | "level"): Viz {
  const t = TREE;
  const visited: number[] = [];
  const frames: Frame[] = [];
  const codeMap = {
    preorder: `void pre(Node* n) {
  if (!n) return;
  cout << n->val;   // me first
  pre(n->left);
  pre(n->right);
}`,
    inorder: `void in(Node* n) {
  if (!n) return;
  in(n->left);
  cout << n->val;   // me in the middle
  in(n->right);
}`,
    postorder: `void post(Node* n) {
  if (!n) return;
  post(n->left);
  post(n->right);
  cout << n->val;   // me last
}`,
    level: `queue<Node*> q; q.push(root);
while (!q.empty()) {
  Node* n = q.front(); q.pop();
  cout << n->val;
  if (n->left)  q.push(n->left);
  if (n->right) q.push(n->right);
}`,
  };
  const nameMap = {
    preorder: "Preorder — parent, then left, then right",
    inorder: "Inorder — left, then parent, then right",
    postorder: "Postorder — left, then right, then parent",
    level: "Level order — one row of the tree at a time",
  };
  const whyMap = {
    preorder: "Use it when the parent must be handled before its children — copying a tree, or printing a folder before its files.",
    inorder: "On a binary search tree this comes out perfectly sorted. That single fact solves a whole family of problems.",
    postorder: "Use it when a parent needs answers from both children first — height, diameter, deleting a tree.",
    level: "Use it when 'how far from the root' matters — shortest path in an unweighted tree, or printing by row.",
  };

  const draw = (hot: number | null, say: string, line?: number) => {
    frames.push({
      say,
      line,
      ...layout(
        t,
        (i) => (i === hot ? "active" : visited.includes(i) ? "done" : "idle"),
        (i) => (visited.includes(i) ? `#${visited.indexOf(i) + 1}` : undefined),
      ),
      out: visited.map((i) => t[i]).join(" "),
    });
  };

  draw(0, `${nameMap[kind]}. Watch the order the numbers come out.`, 1);

  if (kind === "level") {
    const q = [0];
    while (q.length) {
      const i = q.shift()!;
      visited.push(i);
      draw(i, `Take ${t[i]} off the front of the queue and print it.`, 4);
      for (const kid of [2 * i + 1, 2 * i + 2]) {
        if (t[kid] !== undefined && t[kid] !== null) {
          q.push(kid);
          draw(kid, `Its child ${t[kid]} joins the back of the queue. The queue is what keeps rows in order.`, kid === 2 * i + 1 ? 5 : 6);
        }
      }
    }
  } else {
    const walk = (i: number) => {
      if (t[i] === undefined || t[i] === null) return;
      const L = 2 * i + 1;
      const R = 2 * i + 2;
      if (kind === "preorder") {
        visited.push(i);
        draw(i, `Arrive at ${t[i]} and print it straight away, before looking at any child.`, 3);
        walk(L);
        walk(R);
      } else if (kind === "inorder") {
        if (t[L] !== undefined && t[L] !== null) draw(i, `At ${t[i]}, but the left side has not been done. Go left first.`, 3);
        walk(L);
        visited.push(i);
        draw(i, `Left side is finished, so now print ${t[i]}. Then go right.`, 4);
        walk(R);
      } else {
        if (t[L] !== undefined || t[R] !== undefined) draw(i, `At ${t[i]}. Both children must finish before it may be printed.`, 3);
        walk(L);
        walk(R);
        visited.push(i);
        draw(i, `Both children are done, so ${t[i]} can finally be printed.`, 5);
      }
    };
    walk(0);
  }
  draw(null, `${whyMap[kind]}`);
  return {
    title: nameMap[kind],
    blurb: "Same tree, same recursion — only the position of the print line changes.",
    code: codeMap[kind],
    frames,
  };
}

export function traceTreeHeight(): Viz {
  const t = TREE;
  const code = `int height(Node* n) {
  if (!n) return 0;
  int L = height(n->left);
  int R = height(n->right);
  return 1 + max(L, R);
}`;
  const frames: Frame[] = [];
  const answers = new Map<number, number>();
  const draw = (hot: number | null, say: string, line?: number) => {
    frames.push({
      say,
      line,
      ...layout(
        t,
        (i) => (i === hot ? "active" : answers.has(i) ? "good" : "idle"),
        (i) => (answers.has(i) ? `h=${answers.get(i)}` : undefined),
      ),
    });
  };
  const height = (i: number): number => {
    if (t[i] === undefined || t[i] === null) return 0;
    draw(i, `Ask ${t[i]}: how tall are you? It cannot answer until both children answer.`, 3);
    const L = height(2 * i + 1);
    const R = height(2 * i + 2);
    const h = 1 + Math.max(L, R);
    answers.set(i, h);
    draw(i, `${t[i]} hears back: left is ${L} tall, right is ${R} tall. So it is 1 + max(${L}, ${R}) = ${h}.`, 5);
    return h;
  };
  const total = height(0);
  draw(null, `Height is ${total}. This shape — solve both children, then combine — is the template for almost every tree problem you will meet.`);
  return {
    title: "Height: ask the children, then add one",
    blurb: "Answers flow upward. A parent is always the last to know.",
    code,
    frames,
  };
}

/* ------------------------------------------------------------------ bst -- */

export const BST: Heapish = [50, 30, 70, 20, 40, 60, 80];

export function traceBstSearch(target: number): Viz {
  const code = `while (n) {
  if (n->val == key) return n;
  n = key < n->val ? n->left : n->right;
}`;
  const t = BST;
  const frames: Frame[] = [];
  const path: number[] = [];
  const dead = new Set<number>();
  const markDead = (i: number) => {
    if (t[i] === undefined || t[i] === null) return;
    dead.add(i);
    markDead(2 * i + 1);
    markDead(2 * i + 2);
  };
  const draw = (hot: number | null, say: string, line?: number, found = false) => {
    frames.push({
      say,
      line,
      ...layout(t, (i) =>
        i === hot ? (found ? "good" : "active") : dead.has(i) ? "bad" : path.includes(i) ? "done" : "idle",
      ),
      vars: vars({ looking_for: target, steps: path.length }),
    });
  };
  draw(null, `Every left child is smaller than its parent, every right child is bigger. That one rule is the whole BST. Looking for ${target}.`, 1);
  let i = 0;
  while (t[i] !== undefined && t[i] !== null) {
    path.push(i);
    const v = t[i] as number;
    if (v === target) {
      draw(i, `${v} is the target. Found in ${path.length} steps out of ${t.filter((x) => x !== null).length} nodes.`, 2, true);
      break;
    }
    const goLeft = target < v;
    draw(i, `${target} ${goLeft ? "<" : ">"} ${v}, so it can only be on the ${goLeft ? "left" : "right"}. The whole ${goLeft ? "right" : "left"} subtree is ruled out in one comparison.`, 3);
    markDead(goLeft ? 2 * i + 2 : 2 * i + 1);
    draw(i, `That entire branch is gone. This is binary search, drawn as a tree.`, 3);
    i = goLeft ? 2 * i + 1 : 2 * i + 2;
  }
  draw(null, "If the tree stays balanced this costs O(log n). If it degenerates into a straight line, it becomes O(n) — which is why self-balancing trees exist.");
  return {
    title: "A BST throws away half the tree per comparison",
    blurb: "One comparison, one branch deleted. Watch the red spread.",
    code,
    frames,
  };
}

export function traceBstInorder(): Viz {
  const t = BST;
  const code = `void in(Node* n) {
  if (!n) return;
  in(n->left);
  cout << n->val;
  in(n->right);
}`;
  const visited: number[] = [];
  const frames: Frame[] = [];
  const draw = (hot: number | null, say: string, line?: number) => {
    frames.push({
      say,
      line,
      ...layout(t, (i) => (i === hot ? "active" : visited.includes(i) ? "done" : "idle")),
      out: visited.map((i) => t[i]).join(" "),
    });
  };
  const walk = (i: number) => {
    if (t[i] === undefined || t[i] === null) return;
    walk(2 * i + 1);
    visited.push(i);
    draw(i, `${t[i]} is printed only after everything smaller than it. That is why the output comes out sorted.`, 4);
    walk(2 * i + 2);
  };
  draw(null, "Walk this BST inorder — left, me, right — and watch what comes out.", 1);
  walk(0);
  draw(null, "Perfectly sorted, with no sorting done. 'Inorder on a BST is sorted' solves k-th smallest, validate-a-BST, and two-sum-in-a-BST.");
  return {
    title: "Inorder on a BST comes out sorted",
    blurb: "The single most useful fact about binary search trees.",
    code,
    frames,
  };
}

/* ----------------------------------------------------------------- heap -- */

export function traceHeapPush(start: number[], value: number): Viz {
  const code = `heap.push_back(v);
int i = heap.size() - 1;
while (i > 0 && heap[(i - 1) / 2] < heap[i]) {
  swap(heap[i], heap[(i - 1) / 2]);
  i = (i - 1) / 2;
}`;
  const h = [...start];
  const frames: Frame[] = [];
  const draw = (hot: number | null, say: string, line?: number, tone: VizNode["tone"] = "active") => {
    frames.push({
      say,
      line,
      ...layout(h, (i) => (i === hot ? tone : "idle")),
      rowLabel: "same heap, stored as a flat array",
      row: row(h, hot === null ? {} : { [hot]: tone }),
    });
  };
  draw(null, "A heap is a tree where every parent beats its children. It is stored in a plain array: the children of index i are 2i+1 and 2i+2.");
  h.push(value);
  let i = h.length - 1;
  draw(i, `Add ${value} at the very end — the only spot that keeps the tree complete. It probably breaks the rule.`, 1);
  while (i > 0 && h[Math.floor((i - 1) / 2)] < h[i]) {
    const p = Math.floor((i - 1) / 2);
    draw(i, `${h[i]} is bigger than its parent ${h[p]}. That breaks the heap rule, so swap them.`, 3, "compare");
    [h[i], h[p]] = [h[p], h[i]];
    i = p;
    draw(i, `${h[i]} has bubbled up one level. Check its new parent.`, 4, "good");
  }
  draw(i, `Every parent beats its children again. It took only ${Math.ceil(Math.log2(h.length))} levels of climbing — O(log n), not O(n).`, 3, "good");
  frames.push({
    say: "The biggest number is always at index 0, so peeking costs nothing. That is why a heap is the right tool for 'give me the largest, repeatedly'.",
    ...layout(h, (i) => (i === 0 ? "good" : "done")),
    rowLabel: "array",
    row: row(h, { 0: "good" }),
  });
  return {
    title: "Push into a heap: add at the end, then climb",
    blurb: "A tree drawn on paper, an array in memory. Both at once.",
    code,
    frames,
  };
}

export function traceHeapPop(start: number[]): Viz {
  const code = `int top = heap[0];
heap[0] = heap.back(); heap.pop_back();
int i = 0;
while (true) {
  int big = i, L = 2*i+1, R = 2*i+2;
  if (L < n && heap[L] > heap[big]) big = L;
  if (R < n && heap[R] > heap[big]) big = R;
  if (big == i) break;
  swap(heap[i], heap[big]); i = big;
}`;
  const h = [...start];
  const frames: Frame[] = [];
  const draw = (hot: number | null, say: string, line?: number, tone: VizNode["tone"] = "active") => {
    frames.push({
      say,
      line,
      ...layout(h, (i) => (i === hot ? tone : "idle")),
      rowLabel: "array",
      row: row(h, hot === null ? {} : { [hot]: tone }),
    });
  };
  draw(0, `The largest number, ${h[0]}, is always at the top. Taking it out is the easy part.`, 1, "good");
  const last = h.pop()!;
  const top = h[0];
  h[0] = last;
  draw(0, `${top} is removed. To keep the tree complete, move the last number (${last}) up to the top. It almost certainly does not belong there.`, 2, "bad");
  let i = 0;
  for (;;) {
    let big = i;
    const L = 2 * i + 1;
    const R = 2 * i + 2;
    if (L < h.length && h[L] > h[big]) big = L;
    if (R < h.length && h[R] > h[big]) big = R;
    if (big === i) break;
    draw(big, `${h[i]} is smaller than its child ${h[big]}. Swap with the LARGER child — swapping with the smaller one would just break the rule again.`, 7, "compare");
    [h[i], h[big]] = [h[big], h[i]];
    i = big;
    draw(i, "Sunk one level. Keep going until both children are smaller.", 8, "active");
  }
  draw(i, `Settled. Removing the max costs O(log n) — one sink down the height of the tree.`, 8, "good");
  frames.push({
    say: "Do this n times and you have heap sort: O(n log n) with no extra array. It is also exactly how priority_queue works in C++.",
    ...layout(h, () => "done"),
    rowLabel: "array",
    row: row(h, span(0, h.length - 1, "done")),
  });
  return {
    title: "Pop the max: promote the last, then sink it",
    blurb: "Always swap with the bigger child. Watch what happens if you did not.",
    code,
    frames,
  };
}

/* --------------------------------------------------------- segment tree -- */

export function traceSegmentTree(a: number[]): Viz {
  const code = `void build(int node, int l, int r) {
  if (l == r) { tree[node] = a[l]; return; }
  int m = (l + r) / 2;
  build(2*node, l, m);
  build(2*node+1, m+1, r);
  tree[node] = tree[2*node] + tree[2*node+1];
}`;
  const n = a.length;
  const frames: Frame[] = [];
  type Seg = { id: number; l: number; r: number; sum: number };
  const segs: Seg[] = [];
  const build = (id: number, l: number, r: number): number => {
    if (l === r) {
      segs.push({ id, l, r, sum: a[l] });
      return a[l];
    }
    const m = Math.floor((l + r) / 2);
    const sum = build(2 * id, l, m) + build(2 * id + 1, m + 1, r);
    segs.push({ id, l, r, sum });
    return sum;
  };
  build(1, 0, n - 1);

  const drawTree = (done: Set<number>, hot: number | null, say: string, line?: number, rowTones: Record<number, Tone> = {}) => {
    const maxDepth = Math.max(...segs.map((s) => Math.floor(Math.log2(s.id))));
    const nodes: VizNode[] = segs
      .filter((s) => done.has(s.id))
      .map((s) => {
        const d = Math.floor(Math.log2(s.id));
        const first = 2 ** d;
        const slot = s.id - first;
        return {
          id: `s${s.id}`,
          label: String(s.sum),
          x: ((slot + 0.5) * 100) / 2 ** d,
          y: 10 + (d * 78) / Math.max(1, maxDepth),
          tone: s.id === hot ? "good" : "done",
          sub: `${s.l}..${s.r}`,
        } as VizNode;
      });
    const edges: VizEdge[] = segs
      .filter((s) => done.has(s.id) && done.has(Math.floor(s.id / 2)) && s.id > 1)
      .map((s) => ({ from: `s${Math.floor(s.id / 2)}`, to: `s${s.id}`, tone: "idle" }));
    frames.push({ say, line, nodes, edges, rowLabel: "a", row: row(a, rowTones) });
  };

  const done = new Set<number>();
  frames.push({
    say: "Prefix sums answer range questions instantly — until a value changes and the whole table has to be rebuilt. A segment tree fixes that.",
    rowLabel: "a",
    row: row(a),
  });
  const order = [...segs];
  for (const s of order) {
    done.add(s.id);
    drawTree(
      done,
      s.id,
      s.l === s.r
        ? `A leaf: it covers only a[${s.l}] = ${s.sum}.`
        : `An inner node covering ${s.l}..${s.r}. Its value is just its two children added: ${s.sum}.`,
      s.l === s.r ? 2 : 6,
      span(s.l, s.r, "window"),
    );
  }
  frames.push({
    say: "Now change a[2]. Only the nodes on the path from that leaf to the root are wrong — about log n of them, not the whole table.",
    nodes: segs
      .map((s) => {
        const d = Math.floor(Math.log2(s.id));
        const covers = 2 >= s.l && 2 <= s.r;
        return {
          id: `s${s.id}`,
          label: String(s.sum),
          x: ((s.id - 2 ** d + 0.5) * 100) / 2 ** d,
          y: 10 + (d * 78) / Math.max(1, Math.max(...segs.map((x) => Math.floor(Math.log2(x.id))))),
          tone: covers ? "bad" : "done",
          sub: `${s.l}..${s.r}`,
        } as VizNode;
      }),
    edges: segs.filter((s) => s.id > 1).map((s) => ({ from: `s${Math.floor(s.id / 2)}`, to: `s${s.id}`, tone: "idle" })),
    rowLabel: "a",
    row: row(a, { 2: "bad" }),
  });
  frames.push({
    say: "Both the query and the update are O(log n). You pay a little more than prefix sums for reads, and gain the ability to write.",
    rowLabel: "a",
    row: row(a, span(0, n - 1, "done")),
  });
  return {
    title: "A tree where every node owns a range",
    blurb: "Leaves are single boxes. Each parent is its two children combined.",
    code,
    frames,
  };
}

/* ------------------------------------------------------------- avl ---- */

export function traceAvlRotation(): Viz {
  const frames: Frame[] = [];

  // A degenerate insert of 10, 20, 30 — the classic right-right case.
  const step = (
    values: Heapish,
    say: string,
    tone: (i: number) => VizNode["tone"] = () => "idle",
    sub: (i: number) => string | undefined = () => undefined,
    line?: number,
  ) => frames.push({ say, line, ...layout(values, tone, sub) });

  step([10], "Insert 10 into an empty tree. Nothing to balance yet.");
  step([10, null, 20], "Insert 20. It is bigger, so it goes right. Still fine.", (i) => (i === 2 ? "active" : "idle"));

  step(
    [10, null, 20, null, null, null, 30],
    "Insert 30. Bigger again, so right again — and now the tree is a straight line. Searching it costs O(n), exactly like a linked list.",
    (i) => (i === 6 ? "bad" : "idle"),
    (i) => (i === 0 ? "height 3" : undefined),
  );

  step(
    [10, null, 20, null, null, null, 30],
    "AVL trees stop this. Every node stores the height of each side, and the difference must never exceed 1. Here 10 has an empty left side (0) and a right side of height 2 — a difference of 2. That is the trigger.",
    (i) => (i === 0 ? "bad" : i === 6 ? "compare" : "idle"),
    (i) => (i === 0 ? "left 0, right 2" : undefined),
    2,
  );

  step(
    [10, null, 20, null, null, null, 30],
    "The fix is a rotation. 20 becomes the new root: it takes 10 as its left child, and keeps 30 on the right. Nothing else moves.",
    (i) => (i === 2 ? "good" : i === 0 || i === 6 ? "active" : "idle"),
    (i) => (i === 2 ? "new root" : undefined),
    4,
  );

  step(
    [20, 10, 30],
    "Balanced. The same three values, the same ordering rule — but the height dropped from 3 to 2, and every lookup is now O(log n).",
    () => "good",
    (i) => (i === 0 ? "left 1, right 1" : undefined),
  );

  step(
    [20, 10, 30],
    "That was the simple case: three nodes leaning the same way, fixed by one rotation. When the middle node leans the OTHER way, one rotation is not enough — you rotate the child first, then the parent. That is the left-right case.",
    () => "done",
  );

  frames.push({
    say: "Every insert and delete walks back up to the root, checking balance and rotating where needed. A rotation is O(1), and the walk is O(log n), so the tree stays balanced for free. That guarantee is what std::map, TreeMap and BTreeMap are built on.",
    ...layout([20, 10, 30], () => "done"),
    vars: vars({ height: 2, "worst case": "O(log n) forever" }),
  });

  return {
    title: "One rotation turns a line back into a tree",
    blurb: "Watch the height drop from 3 to 2 without the ordering ever changing.",
    code: `int balance(Node* n) {
  return height(n->left) - height(n->right);
}

// right-right: the tree leans right twice
Node* rotateLeft(Node* x) {
  Node* y = x->right;
  x->right = y->left;      // y's left subtree moves under x
  y->left  = x;            // x becomes y's left child
  update(x); update(y);
  return y;                // y is the new root of this part
}`,
    frames,
  };
}
