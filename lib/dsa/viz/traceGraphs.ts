// Graphs, greedy, dynamic programming and backtracking.

import { row, span, vars, type Cell, type Frame, type Tone, type Viz, type VizEdge, type VizNode } from "@/lib/dsa/viz/types";

/* --------------------------------------------------------------- graphs -- */

type G = {
  ids: string[];
  pos: Record<string, [number, number]>;
  adj: Record<string, string[]>;
  weight?: Record<string, number>;
};

export const GRAPH: G = {
  ids: ["A", "B", "C", "D", "E", "F"],
  pos: { A: [16, 20], B: [50, 14], C: [84, 24], D: [22, 62], E: [56, 60], F: [86, 78] },
  adj: {
    A: ["B", "D"],
    B: ["A", "C", "E"],
    C: ["B", "F"],
    D: ["A", "E"],
    E: ["B", "D", "F"],
    F: ["C", "E"],
  },
  weight: { "A-B": 4, "A-D": 2, "B-C": 3, "B-E": 5, "D-E": 1, "C-F": 2, "E-F": 7 },
};

function graphFrame(
  g: G,
  tone: (id: string) => Tone,
  sub: (id: string) => string | undefined,
  edgeTone: (a: string, b: string) => Tone,
  withWeights = false,
): { nodes: VizNode[]; edges: VizEdge[] } {
  const nodes: VizNode[] = g.ids.map((id) => ({
    id,
    label: id,
    x: g.pos[id][0],
    y: g.pos[id][1],
    tone: tone(id),
    sub: sub(id),
  }));
  const seen = new Set<string>();
  const edges: VizEdge[] = [];
  for (const a of g.ids) {
    for (const b of g.adj[a]) {
      const key = [a, b].sort().join("-");
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({
        from: a,
        to: b,
        tone: edgeTone(a, b),
        label: withWeights ? String(g.weight?.[key] ?? g.weight?.[[b, a].join("-")] ?? "") : undefined,
      });
    }
  }
  return { nodes, edges };
}

export function traceBfs(start = "A"): Viz {
  const g = GRAPH;
  const code = `queue<int> q; q.push(start);
seen[start] = true;
while (!q.empty()) {
  int u = q.front(); q.pop();
  for (int v : adj[u])
    if (!seen[v]) { seen[v] = true; dist[v] = dist[u] + 1; q.push(v); }
}`;
  const frames: Frame[] = [];
  const seen = new Set<string>([start]);
  const dist: Record<string, number> = { [start]: 0 };
  const done = new Set<string>();
  const tree = new Set<string>();
  let q = [start];

  const draw = (hot: string | null, say: string, line?: number) => {
    frames.push({
      say,
      line,
      ...graphFrame(
        g,
        (id) => (id === hot ? "active" : done.has(id) ? "done" : seen.has(id) ? "window" : "idle"),
        (id) => (seen.has(id) ? `d=${dist[id]}` : undefined),
        (a, b) => (tree.has([a, b].sort().join("-")) ? "good" : "idle"),
      ),
      rowLabel: "queue (front on the left)",
      row: q.length ? q.map((id) => ({ v: id, tone: "active" as Tone })) : [{ v: "empty", tone: "ghost" as Tone }],
      vars: vars({ visited: seen.size }),
    });
  };

  draw(start, `BFS from ${start}. Everything reachable in 1 step is found before anything 2 steps away — that is why BFS gives shortest paths when every edge costs the same.`, 1);
  while (q.length) {
    const u = q.shift()!;
    done.add(u);
    draw(u, `Take ${u} off the front. Its distance ${dist[u]} is final — nothing can reach it faster now.`, 4);
    for (const v of g.adj[u]) {
      if (seen.has(v)) continue;
      seen.add(v);
      dist[v] = dist[u] + 1;
      tree.add([u, v].sort().join("-"));
      q = [...q, v];
      draw(v, `${v} is new. It is ${dist[v]} steps away, so mark it seen immediately and put it at the back of the queue.`, 6);
    }
  }
  draw(null, `Every node has its shortest distance from ${start}. Each node entered the queue exactly once, so the whole thing is O(V + E).`);
  return {
    title: "BFS spreads out in rings",
    blurb: "The queue is what keeps the rings in order. Mark seen when you push, not when you pop.",
    code,
    frames,
  };
}

export function traceDfs(start = "A"): Viz {
  const g = GRAPH;
  const code = `void dfs(int u) {
  seen[u] = true;
  for (int v : adj[u])
    if (!seen[v]) dfs(v);
}`;
  const frames: Frame[] = [];
  const seen = new Set<string>();
  const stack: string[] = [];
  const tree = new Set<string>();

  const draw = (hot: string | null, say: string, line?: number) => {
    frames.push({
      say,
      line,
      ...graphFrame(
        g,
        (id) => (id === hot ? "active" : stack.includes(id) ? "window" : seen.has(id) ? "done" : "idle"),
        () => undefined,
        (a, b) => (tree.has([a, b].sort().join("-")) ? "good" : "idle"),
      ),
      rowLabel: "call stack",
      row: stack.length ? stack.map((id) => ({ v: id, tone: "active" as Tone })) : [{ v: "empty", tone: "ghost" as Tone }],
    });
  };

  const dfs = (u: string, from?: string) => {
    seen.add(u);
    stack.push(u);
    if (from) tree.add([from, u].sort().join("-"));
    draw(u, `Walk into ${u} and immediately dive deeper. DFS commits to one path before trying alternatives.`, 2);
    for (const v of g.adj[u]) {
      if (seen.has(v)) {
        draw(u, `${v} has already been visited, so skip it. Without this check a cycle would loop forever.`, 4);
        continue;
      }
      dfs(v, u);
      draw(u, `Back at ${u} after finishing ${v}. Now try its other neighbours.`, 4);
    }
    stack.pop();
  };
  draw(null, "DFS uses recursion instead of a queue. It goes as deep as it can, then backs up.", 1);
  dfs(start);
  draw(null, "Everything reachable is visited. DFS does not give shortest paths — but it is the right shape for cycles, connected components and topological order.");
  return {
    title: "DFS dives before it spreads",
    blurb: "Watch the call stack grow deep, then unwind one frame at a time.",
    code,
    frames,
  };
}

export function traceDijkstra(start = "A"): Viz {
  const g = GRAPH;
  const code = `dist[start] = 0;
priority_queue<pair<int,int>> pq;   // min-heap of (dist, node)
while (!pq.empty()) {
  auto [d, u] = pq.top(); pq.pop();
  if (d > dist[u]) continue;
  for (auto [v, w] : adj[u])
    if (dist[u] + w < dist[v]) { dist[v] = dist[u] + w; pq.push({dist[v], v}); }
}`;
  const w = (a: string, b: string) => g.weight![[a, b].sort().join("-")];
  const dist: Record<string, number> = Object.fromEntries(g.ids.map((id) => [id, Infinity]));
  dist[start] = 0;
  const done = new Set<string>();
  const frames: Frame[] = [];
  const distRow = (hot?: string): Cell[] =>
    g.ids.map((id) => ({
      v: dist[id] === Infinity ? "∞" : String(dist[id]),
      i: id,
      tone: id === hot ? "good" : done.has(id) ? "done" : dist[id] === Infinity ? "ghost" : "window",
    }));

  const draw = (hot: string | null, say: string, line?: number, edge?: [string, string]) => {
    frames.push({
      say,
      line,
      ...graphFrame(
        g,
        (id) => (id === hot ? "active" : done.has(id) ? "done" : dist[id] < Infinity ? "window" : "idle"),
        (id) => (dist[id] === Infinity ? undefined : String(dist[id])),
        (a, b) => (edge && [a, b].sort().join() === [...edge].sort().join() ? "good" : "idle"),
        true,
      ),
      rowLabel: "best known distance",
      row: distRow(hot ?? undefined),
    });
  };

  draw(start, `BFS assumed every edge costs 1. Here they do not — so the fewest-edges path is not always the cheapest. Start: ${start} costs 0, everything else is unknown.`, 1);
  for (;;) {
    let u: string | null = null;
    for (const id of g.ids) if (!done.has(id) && dist[id] < Infinity && (u === null || dist[id] < dist[u])) u = id;
    if (u === null) break;
    done.add(u);
    draw(u, `The cheapest unfinished node is ${u} at ${dist[u]}. Nothing can improve it now: every other route already costs at least this much. Lock it in.`, 4);
    for (const v of g.adj[u]) {
      if (done.has(v)) continue;
      const cand = dist[u] + w(u, v);
      if (cand < dist[v]) {
        const old = dist[v];
        dist[v] = cand;
        draw(v, `Going ${u} → ${v} costs ${dist[u]} + ${w(u, v)} = ${cand}, better than ${old === Infinity ? "∞" : old}. Update it.`, 7, [u, v]);
      } else {
        draw(v, `${u} → ${v} would cost ${cand}, which is not better than the ${dist[v]} we already have. Ignore it.`, 7, [u, v]);
      }
    }
  }
  draw(null, "Every node has its true cheapest cost. Dijkstra only works because costs are never negative — a negative edge could make a locked-in node wrong later.");
  return {
    title: "Dijkstra always finishes the cheapest node first",
    blurb: "Greedy, and provably correct — as long as no edge is negative.",
    code,
    frames,
  };
}

export function traceTopoSort(): Viz {
  const code = `for each node: indegree[v] = number of prerequisites
queue of every node with indegree 0
while queue not empty:
  u = pop; output u
  for v in adj[u]: if (--indegree[v] == 0) push v`;
  const nodes = ["intro", "arrays", "sorting", "searching", "trees", "graphs"];
  const pos: Record<string, [number, number]> = {
    intro: [14, 45],
    arrays: [36, 20],
    sorting: [36, 72],
    searching: [60, 45],
    trees: [82, 20],
    graphs: [82, 72],
  };
  const edges: [string, string][] = [
    ["intro", "arrays"],
    ["intro", "sorting"],
    ["arrays", "searching"],
    ["sorting", "searching"],
    ["arrays", "trees"],
    ["searching", "trees"],
    ["trees", "graphs"],
    ["searching", "graphs"],
  ];
  const indeg: Record<string, number> = Object.fromEntries(nodes.map((n) => [n, 0]));
  for (const [, b] of edges) indeg[b]++;
  const out: string[] = [];
  const frames: Frame[] = [];
  let q = nodes.filter((n) => indeg[n] === 0);

  const draw = (hot: string | null, say: string, line?: number) => {
    frames.push({
      say,
      line,
      nodes: nodes.map((n) => ({
        id: n,
        label: n,
        x: pos[n][0],
        y: pos[n][1],
        tone: n === hot ? "active" : out.includes(n) ? "done" : q.includes(n) ? "good" : "idle",
        sub: out.includes(n) ? `#${out.indexOf(n) + 1}` : `needs ${indeg[n]}`,
      })),
      edges: edges.map(([a, b]) => ({ from: a, to: b, arrow: true, tone: out.includes(a) ? "done" : "idle" })),
      rowLabel: "ready to learn",
      row: q.length ? q.map((n) => ({ v: n, tone: "good" as Tone })) : [{ v: "empty", tone: "ghost" as Tone }],
      out: out.join(" → "),
    });
  };

  draw(null, "An arrow means 'must come first'. Count how many prerequisites each topic still has.", 1);
  draw(null, "Only topics with zero remaining prerequisites can be taken now. Put those in a queue.", 2);
  while (q.length) {
    const u = q[0];
    q = q.slice(1);
    out.push(u);
    draw(u, `Take ${u} — nothing is blocking it any more.`, 4);
    for (const [a, b] of edges) {
      if (a !== u) continue;
      indeg[b]--;
      if (indeg[b] === 0) {
        q = [...q, b];
        draw(b, `${u} is done, so ${b} has no prerequisites left. It becomes available.`, 5);
      } else {
        draw(b, `${b} still needs ${indeg[b]} more prerequisite(s). Not ready.`, 5);
      }
    }
  }
  draw(null, `A valid order: ${out.join(" → ")}. If some node never reached zero, the graph had a cycle — meaning the requirements are impossible.`);
  return {
    title: "Topological order: do what nothing is blocking",
    blurb: "Course schedules, build systems, and task runners are all this algorithm.",
    code,
    frames,
  };
}

export function traceDsu(): Viz {
  const code = `int find(int x) {
  if (p[x] != x) p[x] = find(p[x]);   // path compression
  return p[x];
}
void unite(int a, int b) { p[find(a)] = find(b); }`;
  const n = 6;
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  const frames: Frame[] = [];
  const pos: [number, number][] = [[12, 25], [34, 25], [56, 25], [78, 25], [23, 72], [67, 72]];
  const draw = (say: string, hot: number[] = [], line?: number) => {
    const roots = Array.from({ length: n }, (_, i) => find(i));
    frames.push({
      say,
      line,
      nodes: Array.from({ length: n }, (_, i) => ({
        id: `d${i}`,
        label: String(i),
        x: pos[i][0],
        y: pos[i][1],
        tone: hot.includes(i) ? "good" : roots[i] === i ? "active" : "done",
        sub: `group ${roots[i]}`,
      })),
      edges: Array.from({ length: n }, (_, i) => i)
        .filter((i) => parent[i] !== i)
        .map((i) => ({ from: `d${i}`, to: `d${parent[i]}`, tone: "good" as Tone, arrow: true })),
      rowLabel: "parent[]",
      row: row(parent),
      vars: vars({ groups: new Set(roots).size }),
    });
  };
  draw("Six things, six separate groups. Each one points at itself.", []);
  for (const [a, b] of [
    [0, 1],
    [2, 3],
    [1, 2],
    [4, 5],
  ] as const) {
    const ra = find(a);
    const rb = find(b);
    parent[ra] = rb;
    draw(`Join ${a} and ${b}: find the boss of each group and point one boss at the other. Two groups become one.`, [a, b], 5);
  }
  const before = [...parent];
  find(0);
  draw(
    `Ask which group 0 is in. Walking up the chain costs time — so on the way back, every node it touched is re-pointed straight at the boss. Next time it is one hop.${before.join() === parent.join() ? "" : ""}`,
    [0],
    2,
  );
  draw("With that flattening, each operation is effectively constant time. DSU is what makes Kruskal's minimum spanning tree fast.", []);
  return {
    title: "Union–Find: who is in my group?",
    blurb: "Every group has one boss. Joining is pointing one boss at another.",
    code,
    frames,
  };
}

/* --------------------------------------------------------------- greedy -- */

export function traceActivitySelection(): Viz {
  const code = `sort(jobs.begin(), jobs.end(),
     [](auto& a, auto& b){ return a.end < b.end; });
int lastEnd = 0;
for (auto& j : jobs)
  if (j.start >= lastEnd) { take(j); lastEnd = j.end; }`;
  const jobs = [
    { name: "A", s: 1, e: 4 },
    { name: "B", s: 3, e: 5 },
    { name: "C", s: 0, e: 6 },
    { name: "D", s: 5, e: 7 },
    { name: "E", s: 8, e: 9 },
    { name: "F", s: 5, e: 9 },
  ];
  const T = 10;
  const frames: Frame[] = [];
  const state: Record<string, Tone> = {};
  const draw = (say: string, line?: number, hot?: string) => {
    const grid: Cell[][] = jobs.map((j) =>
      Array.from({ length: T }, (_, t): Cell => ({
        v: t >= j.s && t < j.e ? "▇" : "·",
        tone: t >= j.s && t < j.e ? (j.name === hot ? "good" : (state[j.name] ?? "idle")) : "ghost",
      })),
    );
    frames.push({
      say,
      line,
      grid,
      gridLabel: "meetings on a timeline",
      gridRowNames: jobs.map((j) => `${j.name} ${j.s}-${j.e}`),
      gridColNames: Array.from({ length: T }, (_, t) => String(t)),
    });
  };
  draw("Fit as many meetings as possible into one room. Longest-first fails. Earliest-start fails. One rule works.", 1);
  jobs.sort((a, b) => a.e - b.e);
  draw("Sort by FINISHING time. Whatever ends soonest leaves the most room for everything after it — that is the entire insight.", 2);
  let lastEnd = 0;
  let taken = 0;
  for (const j of jobs) {
    if (j.s >= lastEnd) {
      state[j.name] = "good";
      lastEnd = j.e;
      taken++;
      draw(`${j.name} starts at ${j.s}, and the room is free from ${lastEnd === j.e ? j.s : lastEnd}. Take it. Room is now busy until ${j.e}.`, 5, j.name);
    } else {
      state[j.name] = "bad";
      draw(`${j.name} starts at ${j.s} but the room is busy until ${lastEnd}. Skip it.`, 5, j.name);
    }
  }
  draw(`${taken} meetings fit. Greedy works here because taking the earliest finish never closes a door that another choice would have left open — and that has to be argued, not assumed.`);
  return {
    title: "Greedy works only when you can prove it",
    blurb: "Sort by end time, take anything that fits. Watch the red ones overlap.",
    code,
    frames,
  };
}

/* --------------------------------------------------------------- dp ----- */

export function traceClimbStairs(n: number): Viz {
  const code = `dp[0] = 1; dp[1] = 1;
for (int i = 2; i <= n; i++)
  dp[i] = dp[i - 1] + dp[i - 2];
return dp[n];`;
  const dp: number[] = [1, 1];
  const frames: Frame[] = [];
  const dpRow = (upto: number, hot?: number[]): Cell[] =>
    Array.from({ length: n + 1 }, (_, i) => ({
      v: i <= upto ? String(dp[i]) : "·",
      i: String(i),
      tone: i > upto ? "ghost" : hot?.includes(i) ? "good" : "done",
    }));
  frames.push({
    say: `You climb 1 or 2 steps at a time. How many ways to reach step ${n}? Plain recursion re-computes the same steps thousands of times. DP writes each answer down once.`,
    rowLabel: "ways to reach each step",
    row: dpRow(1),
  });
  frames.push({
    say: "There is 1 way to be at the ground (do nothing) and 1 way to reach step 1. These are the base cases — DP always needs a place to start.",
    line: 1,
    rowLabel: "ways to reach each step",
    row: dpRow(1, [0, 1]),
  });
  for (let i = 2; i <= n; i++) {
    frames.push({
      say: `To land on step ${i}, your last move was either 1 step (from ${i - 1}) or 2 steps (from ${i - 2}). There is no third option.`,
      line: 3,
      rowLabel: "ways to reach each step",
      row: dpRow(i - 1, [i - 1, i - 2]),
      vars: vars({ [`dp[${i - 1}]`]: dp[i - 1], [`dp[${i - 2}]`]: dp[i - 2] }),
    });
    dp[i] = dp[i - 1] + dp[i - 2];
    frames.push({
      say: `So dp[${i}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}. Written down once, reused forever.`,
      line: 3,
      rowLabel: "ways to reach each step",
      row: dpRow(i, [i]),
      vars: vars({ [`dp[${i}]`]: dp[i] }),
    });
  }
  frames.push({
    say: `${dp[n]} ways. Naive recursion would have made about ${2 ** n} calls; this made ${n - 1}. That gap is the entire point of dynamic programming.`,
    rowLabel: "ways to reach each step",
    row: dpRow(n, [n]),
    out: String(dp[n]),
  });
  return {
    title: "Write the answer down instead of recomputing it",
    blurb: "Each cell is built from cells already filled. Nothing is ever solved twice.",
    code,
    frames,
  };
}

export function traceKnapsack(): Viz {
  const items = [
    { name: "map", w: 1, v: 1 },
    { name: "rope", w: 3, v: 4 },
    { name: "torch", w: 4, v: 5 },
    { name: "axe", w: 5, v: 7 },
  ];
  const W = 7;
  const code = `for (int i = 1; i <= n; i++)
  for (int c = 0; c <= W; c++) {
    dp[i][c] = dp[i-1][c];                        // skip item i
    if (w[i] <= c)
      dp[i][c] = max(dp[i][c],
                     v[i] + dp[i-1][c - w[i]]);   // take item i
  }`;
  const n = items.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array<number>(W + 1).fill(0));
  const frames: Frame[] = [];
  const draw = (say: string, filledRows: number, filledCols: number, hot: [number, number][] = [], line?: number) => {
    const grid: Cell[][] = dp.map((line2, r) =>
      line2.map((v, c): Cell => {
        const filled = r < filledRows || (r === filledRows && c <= filledCols);
        return {
          v: filled ? String(v) : "·",
          tone: !filled ? "ghost" : hot.some(([hr, hc]) => hr === r && hc === c) ? "good" : "done",
        };
      }),
    );
    frames.push({
      say,
      line,
      grid,
      gridLabel: `best value — rows are items, columns are bag capacity`,
      gridRowNames: ["none", ...items.map((i) => `${i.name} w${i.w} v${i.v}`)],
      gridColNames: Array.from({ length: W + 1 }, (_, c) => String(c)),
    });
  };
  draw(`A bag holding ${W} kg. Each item can be taken once. dp[i][c] means: the best value using only the first i items with c kg of space.`, 0, W);
  draw("Row 0 is all zeros — with no items available, the best value is nothing, whatever the capacity.", 0, W);
  for (let i = 1; i <= n; i++) {
    const it = items[i - 1];
    for (let c = 0; c <= W; c++) {
      dp[i][c] = dp[i - 1][c];
      if (it.w <= c) {
        const take = it.v + dp[i - 1][c - it.w];
        if (take > dp[i][c]) {
          dp[i][c] = take;
          draw(
            `Capacity ${c}: taking the ${it.name} gives ${it.v} + dp[${i - 1}][${c - it.w}] = ${take}, better than skipping it (${dp[i - 1][c]}). Take it.`,
            i,
            c,
            [[i, c], [i - 1, c - it.w]],
            5,
          );
          continue;
        }
      }
      draw(
        it.w > c
          ? `Capacity ${c}: the ${it.name} weighs ${it.w}, too heavy. Copy the row above.`
          : `Capacity ${c}: taking the ${it.name} is not worth it. Copy the row above.`,
        i,
        c,
        [[i, c], [i - 1, c]],
        3,
      );
    }
  }
  draw(`Bottom-right is the answer: ${dp[n][W]}. Every cell was filled once, so the cost is items × capacity — not 2ⁿ.`, n, W, [[n, W]]);
  return {
    title: "0/1 knapsack: take it or skip it, in a table",
    blurb: "Every cell asks one question, and looks only at the row above.",
    code,
    frames,
  };
}

export function traceLcs(a: string, b: string): Viz {
  const code = `for (int i = 1; i <= n; i++)
  for (int j = 1; j <= m; j++)
    if (s[i-1] == t[j-1]) dp[i][j] = 1 + dp[i-1][j-1];
    else                  dp[i][j] = max(dp[i-1][j], dp[i][j-1]);`;
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array<number>(m + 1).fill(0));
  const frames: Frame[] = [];
  const draw = (say: string, fr: number, fc: number, hot: [number, number][] = [], line?: number) => {
    frames.push({
      say,
      line,
      grid: dp.map((line2, r) =>
        line2.map((v, c): Cell => {
          const filled = r < fr || (r === fr && c <= fc);
          return {
            v: filled ? String(v) : "·",
            tone: !filled ? "ghost" : hot.some(([hr, hc]) => hr === r && hc === c) ? "good" : "done",
          };
        }),
      ),
      gridLabel: "longest common subsequence length",
      gridRowNames: ["·", ...a.split("")],
      gridColNames: ["·", ...b.split("")],
    });
  };
  draw(`Two strings: "${a}" and "${b}". A subsequence keeps order but may skip letters. dp[i][j] is the answer for the first i letters of one and first j of the other.`, 0, m);
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
        draw(`'${a[i - 1]}' matches '${b[j - 1]}'. Both strings can use this letter, so take the diagonal answer and add 1 → ${dp[i][j]}.`, i, j, [[i, j], [i - 1, j - 1]], 3);
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        draw(`'${a[i - 1]}' is not '${b[j - 1]}'. Drop a letter from one side or the other and keep whichever was better → ${dp[i][j]}.`, i, j, [[i, j], [i - 1, j], [i, j - 1]], 4);
      }
    }
  }
  draw(`The answer is ${dp[n][m]}. Edit distance, shortest common supersequence and diff tools are all this same table with a different rule inside.`, n, m, [[n, m]]);
  return {
    title: "Two strings, one table",
    blurb: "Match → go diagonal and add 1. No match → take the better neighbour.",
    code,
    frames,
  };
}

/* -------------------------------------------------------- backtracking -- */

export function traceSubsets(a: number[]): Viz {
  const code = `void go(int i, vector<int>& cur) {
  if (i == n) { record(cur); return; }
  go(i + 1, cur);              // skip a[i]
  cur.push_back(a[i]);
  go(i + 1, cur);              // take a[i]
  cur.pop_back();              // UNDO — this is backtracking
}`;
  const frames: Frame[] = [];
  const found: string[] = [];
  const cur: number[] = [];
  const go = (i: number) => {
    if (i === a.length) {
      found.push(cur.length ? `{${cur.join(",")}}` : "{}");
      frames.push({
        say: `A complete choice: ${cur.length ? `{${cur.join(", ")}}` : "the empty set"}. Record it and go back up.`,
        line: 2,
        row: row(a, Object.fromEntries(a.map((v, k) => [k, cur.includes(v) ? "good" : "bad"] as const))),
        vars: vars({ found: found.length }),
        out: found.join("  "),
      });
      return;
    }
    frames.push({
      say: `At ${a[i]}: first try WITHOUT it.`,
      line: 3,
      row: row(a, { ...Object.fromEntries(a.slice(0, i).map((v, k) => [k, cur.includes(v) ? "good" : "bad"] as const)), [i]: "compare" }),
      out: found.join("  "),
    });
    go(i + 1);
    cur.push(a[i]);
    frames.push({
      say: `Now come back and try WITH ${a[i]} instead.`,
      line: 5,
      row: row(a, { ...Object.fromEntries(a.slice(0, i).map((v, k) => [k, cur.includes(v) ? "good" : "bad"] as const)), [i]: "good" }),
      out: found.join("  "),
    });
    go(i + 1);
    cur.pop();
    frames.push({
      say: `Both branches at ${a[i]} are explored. Undo the choice so the caller's state is exactly as it was — miss this line and everything below is corrupted.`,
      line: 7,
      row: row(a, { [i]: "idle" }),
      out: found.join("  "),
    });
  };
  frames.push({
    say: `Every element is either in or out. With ${a.length} elements that is 2^${a.length} = ${2 ** a.length} subsets. Backtracking walks that choice tree.`,
    row: row(a),
    out: "",
  });
  go(0);
  frames.push({
    say: `All ${found.length} subsets. Backtracking is: choose, recurse, un-choose. The un-choose is what people forget.`,
    row: row(a, span(0, a.length - 1, "done")),
    out: found.join("  "),
  });
  return {
    title: "Backtracking = choose, recurse, un-choose",
    blurb: "Watch the same box turn green then grey as both branches get tried.",
    code,
    frames,
  };
}

export function traceNQueens(n = 4): Viz {
  const code = `bool go(int r) {
  if (r == n) return true;
  for (int c = 0; c < n; c++)
    if (safe(r, c)) {
      board[r] = c;
      if (go(r + 1)) return true;
      board[r] = -1;          // undo and try the next column
    }
  return false;
}`;
  const frames: Frame[] = [];
  const board = Array<number>(n).fill(-1);
  const draw = (say: string, hot: [number, number] | null, bad = false, line?: number) => {
    const grid: Cell[][] = Array.from({ length: n }, (_, r) =>
      Array.from({ length: n }, (_, c): Cell => {
        if (board[r] === c) return { v: "♛", tone: "good" };
        if (hot && hot[0] === r && hot[1] === c) return { v: "♛", tone: bad ? "bad" : "compare" };
        return { v: "·", tone: "ghost" };
      }),
    );
    frames.push({ say, line, grid, gridLabel: `${n} × ${n} board` });
  };
  const safe = (r: number, c: number) => {
    for (let i = 0; i < r; i++) {
      if (board[i] === c) return false;
      if (Math.abs(board[i] - c) === r - i) return false;
    }
    return true;
  };
  draw(`Place ${n} queens so none attack each other. Trying every arrangement is ${n ** n} boards. Backtracking abandons a path the moment it is already wrong.`, null);
  let solved = false;
  const go = (r: number): boolean => {
    if (r === n) {
      solved = true;
      draw("All rows filled with no attacks. Solved.", null, false, 2);
      return true;
    }
    for (let c = 0; c < n; c++) {
      if (safe(r, c)) {
        board[r] = c;
        draw(`Row ${r}, column ${c} is safe. Place a queen and move to the next row.`, null, false, 5);
        if (go(r + 1)) return true;
        board[r] = -1;
        draw(`Every column in row ${r + 1} failed, so the queen in row ${r} was a bad choice. Take it back and try the next column.`, null, false, 8);
      } else {
        draw(`Row ${r}, column ${c} is attacked by a queen already placed. Reject it now — do not waste time filling the rows below.`, [r, c], true, 4);
      }
    }
    return false;
  };
  go(0);
  if (!solved) draw("No arrangement exists.", null);
  draw("Pruning is what makes this usable: a wrong prefix is thrown away before the rest of the board is ever explored.", null);
  return {
    title: "N-Queens: fail fast, undo, try again",
    blurb: "Red means rejected before it cost anything. That is pruning.",
    code,
    frames,
  };
}

/* ----------------------------------------------- graph representation -- */

export function traceGraphRepr(): Viz {
  const g = GRAPH;
  const ids = g.ids;
  const n = ids.length;
  const frames: Frame[] = [];

  const matrix = (hot: [number, number] | null): Cell[][] =>
    ids.map((u, r) =>
      ids.map((v, c) => {
        const linked = g.adj[u].includes(v);
        const isHot = hot && hot[0] === r && hot[1] === c;
        return {
          v: linked ? "1" : "0",
          tone: isHot ? "good" : linked ? "active" : "ghost",
        } as Cell;
      }),
    );

  frames.push({
    say: "Six nodes and eight edges. Before any algorithm can run, this picture has to become data. There are two standard ways.",
    ...graphFrame(g, () => "idle", () => undefined, () => "idle"),
  });

  frames.push({
    say: "The first is a matrix: an n by n grid where cell [u][v] is 1 when there is an edge. Simple, and instant to ask 'is A joined to C?'.",
    gridLabel: "adjacency matrix",
    grid: matrix(null),
    gridRowNames: ids,
    gridColNames: ids,
  });

  frames.push({
    say: "Asking whether A and B are joined is one lookup — matrix[0][1]. That is O(1), and no other structure beats it.",
    gridLabel: "adjacency matrix",
    grid: matrix([0, 1]),
    gridRowNames: ids,
    gridColNames: ids,
    vars: vars({ "matrix[A][B]": 1, cost: "O(1)" }),
  });

  frames.push({
    say: "But look how much of it is zeros. 36 cells hold only 16 ones. Every cell costs memory whether there is an edge or not — that is O(V²), always.",
    gridLabel: "adjacency matrix — mostly empty",
    grid: matrix(null),
    gridRowNames: ids,
    gridColNames: ids,
    vars: vars({ cells: n * n, edges: 16, wasted: n * n - 16 }),
  });

  ids.forEach((u, i) => {
    frames.push({
      say:
        i === 0
          ? "The second way stores, for each node, only the neighbours it actually has. A keeps a list holding B and D — nothing else."
          : `${u} keeps ${g.adj[u].join(" and ")}. Only real edges are stored.`,
      ...graphFrame(
        g,
        (id) => (id === u ? "active" : g.adj[u].includes(id) ? "good" : "idle"),
        () => undefined,
        (a, b) => (a === u || b === u ? "good" : "idle"),
      ),
      rowLabel: "adjacency list",
      row: ids
        .slice(0, i + 1)
        .map((x) => ({ v: `${x}: ${g.adj[x].join(",")}`, tone: x === u ? "good" : "done" })),
    });
  });

  frames.push({
    say: "That is 16 entries instead of 36 cells — O(V + E) instead of O(V²). On a real graph the gap is enormous: a million nodes with five edges each is 5 million entries, versus a matrix of 10¹² cells.",
    rowLabel: "adjacency list",
    row: ids.map((x) => ({ v: `${x}: ${g.adj[x].join(",")}`, tone: "done" })),
    vars: vars({ list: "O(V + E)", matrix: "O(V²)" }),
  });

  frames.push({
    say: "The trade: with a list, 'is A joined to C?' means walking A's neighbours — O(degree), not O(1). Almost every real graph is sparse, so lists win, and every algorithm in this chapter assumes one.",
    ...graphFrame(g, () => "done", () => undefined, () => "done"),
    rowLabel: "adjacency list",
    row: ids.map((x) => ({ v: `${x}: ${g.adj[x].join(",")}`, tone: "done" })),
  });

  return {
    title: "Two ways to write a graph down",
    blurb: "Watch how much of the matrix is zeros. That is the whole argument.",
    code: `// adjacency matrix — O(V²) memory, O(1) lookup
bool m[V][V];
m[u][v] = true;

// adjacency list — O(V + E) memory, O(degree) lookup
vector<vector<int>> adj(V);
adj[u].push_back(v);
adj[v].push_back(u);      // undirected: BOTH directions`,
    frames,
  };
}

/* --------------------------------------------------------- bellman–ford -- */

export function traceBellmanFord(start = "A"): Viz {
  const g = GRAPH;
  const w = (a: string, b: string) => g.weight![[a, b].sort().join("-")];
  const edges: [string, string, number][] = [];
  const seen = new Set<string>();
  for (const a of g.ids) {
    for (const b of g.adj[a]) {
      const key = [a, b].sort().join("-");
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push([a, b, w(a, b)]);
    }
  }

  const dist: Record<string, number> = Object.fromEntries(g.ids.map((id) => [id, Infinity]));
  dist[start] = 0;
  const frames: Frame[] = [];
  const distRow = (hot?: string): Cell[] =>
    g.ids.map((id) => ({
      v: dist[id] === Infinity ? "∞" : String(dist[id]),
      i: id,
      tone: id === hot ? "good" : dist[id] === Infinity ? "ghost" : "done",
    }));

  frames.push({
    say: `Dijkstra always finishes the cheapest node first, and that argument breaks with negative edges. Bellman–Ford gives that up: it just relaxes EVERY edge, over and over.`,
    ...graphFrame(g, (id) => (id === start ? "active" : "idle"), () => undefined, () => "idle", true),
    rowLabel: "best known distance",
    row: distRow(start),
  });

  for (let round = 1; round <= 3; round++) {
    let changed = false;
    frames.push({
      say: `Round ${round}. Go through all ${edges.length} edges once and improve whatever can be improved.`,
      rowLabel: "best known distance",
      row: distRow(),
      vars: vars({ round, "edges per round": edges.length }),
    });

    for (const [a, b, cost] of edges) {
      for (const [u, v] of [
        [a, b],
        [b, a],
      ] as [string, string][]) {
        if (dist[u] === Infinity) continue;
        const cand = dist[u] + cost;
        if (cand < dist[v]) {
          const old = dist[v];
          dist[v] = cand;
          changed = true;
          frames.push({
            say: `${u} → ${v} costs ${dist[u]} + ${cost} = ${cand}, better than ${old === Infinity ? "∞" : old}. Update it.`,
            ...graphFrame(
              g,
              (id) => (id === v ? "good" : id === u ? "active" : dist[id] < Infinity ? "window" : "idle"),
              (id) => (dist[id] === Infinity ? undefined : String(dist[id])),
              (x, y) => ([x, y].sort().join() === [u, v].sort().join() ? "good" : "idle"),
              true,
            ),
            rowLabel: "best known distance",
            row: distRow(v),
            vars: vars({ round, edge: `${u}→${v}` }),
          });
        }
      }
    }

    if (!changed) {
      frames.push({
        say: `Round ${round} changed nothing. Once a full round improves nothing, no later round can either — so stop early.`,
        rowLabel: "best known distance",
        row: distRow(),
        vars: vars({ round, changed: "none" }),
      });
      break;
    }
  }

  frames.push({
    say: "With V nodes, V−1 rounds are always enough: a shortest path can use at most V−1 edges, and each round settles one more edge of it.",
    ...graphFrame(g, () => "done", (id) => String(dist[id]), () => "done", true),
    rowLabel: "final distance",
    row: distRow(),
  });

  frames.push({
    say: "Run one extra round. If anything still improves, there is a negative cycle — a loop you can go round forever getting cheaper, so no shortest path exists. Dijkstra cannot detect that at all.",
    rowLabel: "final distance",
    row: distRow(),
    vars: vars({ cost: "O(V · E)", detects: "negative cycles" }),
  });

  return {
    title: "Bellman–Ford: relax everything, V−1 times",
    blurb: "Slower than Dijkstra, and it survives negative weights — and spots impossible ones.",
    code: `for (int round = 1; round < V; round++)
  for (auto [u, v, w] : edges)
    if (dist[u] != INF && dist[u] + w < dist[v])
      dist[v] = dist[u] + w;

// one more round: anything still improving = negative cycle
for (auto [u, v, w] : edges)
  if (dist[u] != INF && dist[u] + w < dist[v])
    return NEGATIVE_CYCLE;`,
    frames,
  };
}

/* ---------------------------------------------------------------- prim -- */

export function tracePrim(start = "A"): Viz {
  const g = GRAPH;
  const w = (a: string, b: string) => g.weight![[a, b].sort().join("-")];
  const inTree = new Set<string>([start]);
  const treeEdges = new Set<string>();
  const frames: Frame[] = [];
  let total = 0;

  const draw = (say: string, hot?: [string, string], reject?: [string, string]) => {
    frames.push({
      say,
      ...graphFrame(
        g,
        (id) => (inTree.has(id) ? "good" : "idle"),
        () => undefined,
        (a, b) => {
          const key = [a, b].sort().join("-");
          if (treeEdges.has(key)) return "good";
          if (hot && [a, b].sort().join() === [...hot].sort().join()) return "active";
          if (reject && [a, b].sort().join() === [...reject].sort().join()) return "bad";
          return "idle";
        },
        true,
      ),
      rowLabel: "in the tree",
      row: [...inTree].map((x) => ({ v: x, tone: "good" as const })),
      vars: vars({ "total weight": total, "edges chosen": treeEdges.size }),
    });
  };

  draw(`Connect every node using the least total weight. Start anywhere — here, ${start}.`);

  while (inTree.size < g.ids.length) {
    // Every edge with exactly one end inside the tree is a candidate.
    const candidates: [string, string, number][] = [];
    for (const u of inTree) {
      for (const v of g.adj[u]) {
        if (!inTree.has(v)) candidates.push([u, v, w(u, v)]);
      }
    }
    candidates.sort((x, y) => x[2] - y[2]);

    frames.push({
      say: `${candidates.length} edge${candidates.length === 1 ? "" : "s"} lead out of the tree. Only these matter — anything with both ends inside would make a cycle.`,
      ...graphFrame(
        g,
        (id) => (inTree.has(id) ? "good" : "idle"),
        () => undefined,
        (a, b) => {
          const key = [a, b].sort().join("-");
          if (treeEdges.has(key)) return "good";
          return candidates.some(([x, y]) => [x, y].sort().join() === [a, b].sort().join())
            ? "compare"
            : "idle";
        },
        true,
      ),
      rowLabel: "edges leaving the tree",
      row: candidates.map(([u, v, c]) => ({ v: `${u}${v}`, i: String(c), tone: "compare" as const })),
      vars: vars({ "total weight": total }),
    });

    const [u, v, cost] = candidates[0];
    if (candidates.length > 1) {
      draw(
        `The cheapest is ${u}–${v} at ${cost}. ${candidates[1][0]}–${candidates[1][1]} costs ${candidates[1][2]}, so it waits.`,
        [u, v],
        [candidates[1][0], candidates[1][1]],
      );
    }

    inTree.add(v);
    treeEdges.add([u, v].sort().join("-"));
    total += cost;
    draw(`Take ${u}–${v}. ${v} joins the tree, and the running total is ${total}.`);
  }

  draw(
    `Every node is connected using ${treeEdges.size} edges — always exactly V−1 — for a total of ${total}. Prim's grows ONE tree outwards; Kruskal's instead sorts all edges and joins separate pieces, which is why it needs Union–Find and Prim's does not.`,
  );

  return {
    title: "Prim's: grow one tree, always taking the cheapest way out",
    blurb: "Watch that only edges leaving the tree are ever considered.",
    code: `priority_queue<pair<int,int>, vector<...>, greater<>> pq;
pq.push({0, start});

while (!pq.empty()) {
  auto [cost, v] = pq.top(); pq.pop();
  if (inTree[v]) continue;        // already reached — skip
  inTree[v] = true;
  total += cost;
  for (auto [to, w] : adj[v])
    if (!inTree[to]) pq.push({w, to});
}`,
    frames,
  };
}
