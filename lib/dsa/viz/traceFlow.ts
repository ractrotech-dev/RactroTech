// Maximum flow: the network, Ford–Fulkerson, and Edmonds–Karp.
//
// The example is the classic one where a greedy first choice is WRONG and has
// to be partly undone. That is the whole reason residual edges exist, so the
// diagram is built around making that moment visible.

import { vars, type Frame, type Tone, type Viz, type VizEdge, type VizNode } from "@/lib/dsa/viz/types";

type Edge = { from: string; to: string; cap: number };

const POS: Record<string, [number, number]> = {
  S: [10, 50],
  A: [40, 20],
  B: [40, 80],
  T: [82, 50],
};

/** S→A 10, S→B 10, A→B 1, A→T 10, B→T 10. Max flow 20, and it needs an undo. */
const EDGES: Edge[] = [
  { from: "S", to: "A", cap: 10 },
  { from: "S", to: "B", cap: 10 },
  { from: "A", to: "B", cap: 1 },
  { from: "A", to: "T", cap: 10 },
  { from: "B", to: "T", cap: 10 },
];

const key = (a: string, b: string) => `${a}->${b}`;

function draw(
  flow: Record<string, number>,
  opts: {
    path?: string[];
    nodeTone?: (id: string) => Tone;
    showResidual?: boolean;
    residualHot?: [string, string];
  } = {},
): Pick<Frame, "nodes" | "edges"> {
  const onPath = new Set<string>();
  if (opts.path) {
    for (let i = 0; i + 1 < opts.path.length; i++) onPath.add(key(opts.path[i], opts.path[i + 1]));
  }

  const nodes: VizNode[] = Object.keys(POS).map((id) => ({
    id,
    label: id,
    x: POS[id][0],
    y: POS[id][1],
    tone: opts.nodeTone?.(id) ?? (id === "S" || id === "T" ? "active" : "idle"),
    sub: id === "S" ? "source" : id === "T" ? "sink" : undefined,
  }));

  const edges: VizEdge[] = EDGES.map((e) => {
    const k = key(e.from, e.to);
    const used = flow[k] ?? 0;
    return {
      from: e.from,
      to: e.to,
      arrow: true,
      tone: onPath.has(k) ? "good" : used === e.cap ? "bad" : used > 0 ? "window" : "idle",
      label: `${used}/${e.cap}`,
    };
  });

  // Residual edges only appear once there is flow to undo.
  if (opts.showResidual) {
    for (const e of EDGES) {
      const used = flow[key(e.from, e.to)] ?? 0;
      if (used === 0) continue;
      const hot =
        opts.residualHot &&
        opts.residualHot[0] === e.to &&
        opts.residualHot[1] === e.from;
      edges.push({
        from: e.to,
        to: e.from,
        arrow: true,
        tone: hot ? "compare" : "ghost",
        label: hot ? `undo ${used}` : undefined,
      });
    }
  }

  return { nodes, edges };
}

/* ------------------------------------------------------- the problem -- */

export function traceFlowNetwork(): Viz {
  const empty: Record<string, number> = {};
  const frames: Frame[] = [];

  frames.push({
    say: "A network of pipes. Water starts at S and must reach T. Every pipe has a capacity — the most that can go through it per second.",
    ...draw(empty),
  });

  frames.push({
    say: "Two rules. Nothing may exceed a pipe's capacity. And at every middle node, what flows in must equal what flows out — nothing is created or stored.",
    ...draw(empty, { nodeTone: (id) => (id === "A" || id === "B" ? "compare" : "active") }),
    vars: vars({ rule1: "flow ≤ capacity", rule2: "in = out" }),
  });

  frames.push({
    say: "The question: what is the most that can reach T per second? Look at S — it can push out at most 10 + 10 = 20. So 20 is a ceiling.",
    ...draw(empty, { nodeTone: (id) => (id === "S" ? "good" : "idle") }),
    vars: vars({ "leaving S": 20 }),
  });

  frames.push({
    say: "T can take in at most 10 + 10 = 20 as well. So if 20 is achievable, that is the answer — but a ceiling is not a guarantee. The middle might not allow it.",
    ...draw(empty, { nodeTone: (id) => (id === "T" ? "good" : "idle") }),
    vars: vars({ "leaving S": 20, "entering T": 20 }),
  });

  frames.push({
    say: "Here it does. Send 10 down S→A→T and 10 down S→B→T. Both routes are full, both rules hold, and 20 reaches T.",
    ...draw({ "S->A": 10, "A->T": 10, "S->B": 10, "B->T": 10 }),
    vars: vars({ "total into T": 20 }),
  });

  frames.push({
    say: "Notice the A→B pipe was never used. A perfectly good pipe, sitting idle — the answer did not need it. That is normal, and it is also where the difficulty hides.",
    ...draw({ "S->A": 10, "A->T": 10, "S->B": 10, "B->T": 10 }, {
      nodeTone: (id) => (id === "A" || id === "B" ? "compare" : "done"),
    }),
  });

  frames.push({
    say: "The hard part is that you cannot see the answer in advance. You have to build the flow up one route at a time — and an early choice that looked sensible can turn out to block a better one.",
    ...draw({}),
  });

  return {
    title: "Capacities, conservation, and a ceiling",
    blurb: "Every pipe has a limit; every middle node must pass on exactly what it receives.",
    code: `// a flow network
//   capacity[u][v]  the most that can pass from u to v
//   flow[u][v]      how much currently does
//
// valid when:
//   0 <= flow[u][v] <= capacity[u][v]
//   for every node except S and T:  sum(in) == sum(out)
//
// the value of a flow = everything leaving S`,
    frames,
  };
}

/* ---------------------------------------------------- ford–fulkerson -- */

export function traceFordFulkerson(): Viz {
  const flow: Record<string, number> = {};
  const frames: Frame[] = [];
  let total = 0;

  const add = (path: string[], amount: number) => {
    for (let i = 0; i + 1 < path.length; i++) {
      const k = key(path[i], path[i + 1]);
      const rev = key(path[i + 1], path[i]);
      if (EDGES.some((e) => key(e.from, e.to) === k)) flow[k] = (flow[k] ?? 0) + amount;
      else flow[rev] = (flow[rev] ?? 0) - amount; // travelling a residual edge UNDOES flow
    }
    total += amount;
  };

  frames.push({
    say: "Start with nothing flowing. Then repeatedly find any route from S to T that still has room, and push as much down it as its tightest pipe allows.",
    ...draw(flow),
    vars: vars({ total }),
  });

  frames.push({
    say: "Take a bad first choice on purpose: S→A→B→T. Its tightest pipe is A→B, which holds only 1. So we push 1.",
    ...draw(flow, { path: ["S", "A", "B", "T"] }),
    vars: vars({ bottleneck: 1, total }),
  });

  add(["S", "A", "B", "T"], 1);
  frames.push({
    say: "Total is 1. A→B is now completely full, shown in red. That single unit is going to turn out to be in the way.",
    ...draw(flow),
    vars: vars({ total }),
  });

  frames.push({
    say: "Next route: S→A→T. S→A has 9 left, A→T has 10, so the tightest is 9. Push 9.",
    ...draw(flow, { path: ["S", "A", "T"] }),
    vars: vars({ bottleneck: 9, total }),
  });
  add(["S", "A", "T"], 9);
  frames.push({ say: "Total is 10. S→A is now full.", ...draw(flow), vars: vars({ total }) });

  frames.push({
    say: "Next: S→B→T. S→B has 10 left, B→T has 9 left because 1 is already going through it. Tightest is 9.",
    ...draw(flow, { path: ["S", "B", "T"] }),
    vars: vars({ bottleneck: 9, total }),
  });
  add(["S", "B", "T"], 9);
  frames.push({
    say: "Total is 19. Now look — every route out of S is blocked. S→A is full, and B→T is full. A greedy method stops here and reports 19.",
    ...draw(flow),
    vars: vars({ total, "greedy would stop": 19 }),
  });

  frames.push({
    say: "But 19 is wrong; the answer is 20. The problem is that 1 unit went A→B early, and it is now occupying space in B→T that a better route needs.",
    ...draw(flow, { nodeTone: (id) => (id === "A" || id === "B" ? "bad" : "idle") }),
    vars: vars({ total, "true answer": 20 }),
  });

  frames.push({
    say: "This is the whole idea of Ford–Fulkerson. Alongside every pipe carrying flow, pretend there is a backwards pipe whose capacity is exactly the flow already there. Travelling it does not send water backwards — it CANCELS a previous decision.",
    ...draw(flow, { showResidual: true, residualHot: ["B", "A"] }),
    vars: vars({ "residual B→A": 1 }),
  });

  frames.push({
    say: "Now a route exists again: S→B, then the backwards B→A, then A→T. Its tightest step is 1.",
    ...draw(flow, { path: ["S", "B", "A", "T"], showResidual: true, residualHot: ["B", "A"] }),
    vars: vars({ bottleneck: 1, total }),
  });

  add(["S", "B", "A", "T"], 1);
  frames.push({
    say: "Pushing along it removes the 1 from A→B and reroutes it. A→B is empty again, and the total is 20.",
    ...draw(flow),
    vars: vars({ total }),
  });

  frames.push({
    say: "No route from S to T has any room left, so 20 is the maximum. The backwards edges are what let a wrong early choice be repaired — without them the method would have stopped at 19.",
    ...draw(flow, { nodeTone: () => "done" }),
    vars: vars({ total, answer: "maximum" }),
  });

  return {
    title: "Residual edges let a bad choice be undone",
    blurb: "Watch the greedy answer stop at 19, then the backwards edge repair it to 20.",
    code: `while (there is a path S -> T with room left) {
  bottleneck = smallest remaining capacity along it;
  for each step u -> v on the path {
    flow[u][v] += bottleneck;      // send it forwards
    flow[v][u] -= bottleneck;      // and open the way back
  }
  total += bottleneck;
}

// "room left" on u -> v means:
//   capacity[u][v] - flow[u][v] > 0`,
    frames,
  };
}

/* ----------------------------------------------------- edmonds–karp -- */

export function traceEdmondsKarp(): Viz {
  const frames: Frame[] = [];
  const empty: Record<string, number> = {};

  frames.push({
    say: "Ford–Fulkerson never says HOW to find a route. That sounds like a detail. It is not.",
    ...draw(empty),
  });

  frames.push({
    say: "Imagine A→B had capacity 1 and the outer pipes had capacity a billion. Alternate between S→A→B→T and the undo route, and each round moves exactly 1 unit.",
    ...draw({ "S->A": 1, "A->B": 1, "B->T": 1 }, { path: ["S", "A", "B", "T"] }),
    vars: vars({ "moved this round": 1, "rounds needed": "a billion" }),
  });

  frames.push({
    say: "That is two billion rounds for a graph with five pipes. The method is still correct — it just takes effectively forever, and the running time depends on the capacity NUMBERS rather than the size of the graph.",
    ...draw({ "S->A": 1, "A->B": 1, "B->T": 1 }, { nodeTone: () => "bad" }),
    vars: vars({ cost: "O(E · maxflow)" }),
  });

  frames.push({
    say: "Edmonds–Karp fixes it with one small rule: always take the route with the FEWEST pipes. Find it with BFS, which does exactly that.",
    ...draw(empty, { nodeTone: (id) => (id === "S" ? "good" : "idle") }),
  });

  frames.push({
    say: "BFS from S. Everything one pipe away is found first — A and B.",
    ...draw(empty, { nodeTone: (id) => (id === "A" || id === "B" ? "window" : id === "S" ? "done" : "idle") }),
    vars: vars({ "1 pipe away": "A, B" }),
  });

  frames.push({
    say: "Then everything two pipes away — which reaches T. So the shortest routes have two pipes, and the silly one-unit-at-a-time detour through A→B is never chosen while a shorter route exists.",
    ...draw(empty, { path: ["S", "A", "T"], nodeTone: (id) => (id === "T" ? "good" : "done") }),
    vars: vars({ "2 pipes away": "T" }),
  });

  frames.push({
    say: "With that rule the shortest route length never decreases, and each pipe can only be the bottleneck a limited number of times. That bounds the whole thing at O(V · E²) — independent of the capacities entirely.",
    ...draw({ "S->A": 10, "A->T": 10, "S->B": 10, "B->T": 10 }, { nodeTone: () => "done" }),
    vars: vars({ "Ford–Fulkerson": "O(E · maxflow)", "Edmonds–Karp": "O(V · E²)" }),
  });

  frames.push({
    say: "So Edmonds–Karp is not a different algorithm. It is Ford–Fulkerson with BFS instead of 'any route you like' — one line, and it turns a method that can hang into one with a guarantee.",
    ...draw({ "S->A": 10, "A->T": 10, "S->B": 10, "B->T": 10 }, { nodeTone: () => "good" }),
  });

  return {
    title: "Same method, but always the shortest route",
    blurb: "One rule — use BFS — and the running time stops depending on the capacity numbers.",
    code: `int maxFlow(int s, int t) {
  int total = 0;
  while (true) {
    // BFS for the SHORTEST path with room left
    vector<int> parent(n, -1);
    parent[s] = s;
    queue<int> q; q.push(s);
    while (!q.empty()) {
      int u = q.front(); q.pop();
      for (int v = 0; v < n; v++)
        if (parent[v] == -1 && cap[u][v] - flow[u][v] > 0) {
          parent[v] = u;
          q.push(v);
        }
    }
    if (parent[t] == -1) break;          // no route left — done

    int push = INT_MAX;
    for (int v = t; v != s; v = parent[v])
      push = min(push, cap[parent[v]][v] - flow[parent[v]][v]);

    for (int v = t; v != s; v = parent[v]) {
      flow[parent[v]][v] += push;
      flow[v][parent[v]] -= push;        // open the way back
    }
    total += push;
  }
  return total;
}`,
    frames,
  };
}
