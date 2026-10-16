import type { ChapterAlt } from "@/lib/dsa/lessons/i18n";

// Graph, in the five languages other than C++.

export const GRAPH_ALT: ChapterAlt = {

  /* ------------------------------------------------------------- repr -- */
  repr: {
    c: {
      example: `/* adjacency matrix — O(V^2) memory, O(1) lookup */
int m[V][V] = {{0}};
m[u][v] = 1;
m[v][u] = 1;                    /* undirected: BOTH */

/* adjacency list — C has no vector, so you build it yourself */
int adj[V][MAXDEG], deg[V] = {0};
adj[u][deg[u]++] = v;
adj[v][deg[v]++] = u;`,
      notes: [
        { token: "m[u][v]", meaning: "matrix — one cell per possible edge, most of them empty" },
        { token: "deg[u]", meaning: "how many neighbours u has so far. C arrays do not track their own length" },
        { token: "both directions", meaning: "undirected means you add it twice" },
        { token: "MAXDEG", meaning: "you must size it ahead. A real list of lists needs malloc" },
      ],
      vizCode: `/* adjacency matrix — O(V^2) memory, O(1) lookup */
int m[V][V];
m[u][v] = 1;

/* adjacency list — O(V + E) memory, O(degree) lookup */
int adj[V][MAXDEG], deg[V];
adj[u][deg[u]++] = v;
adj[v][deg[v]++] = u;    /* undirected: BOTH directions */`,
      prompt:
        "Build an adjacency list for an UNDIRECTED graph. Read an edge between u and v, and record it so both nodes know about it.",
      starter: `int adj[V][MAXDEG], deg[V] = {0};

for (int e = 0; e < E; e++) {
  int u, v;
  scanf("%d %d", &u, &v);
  ;
  ;
}`,
      rules: {
        regex: ["adj\\s*\\[\\s*u\\s*\\]\\s*\\[\\s*deg\\[u\\]\\+\\+\\s*\\]\\s*=\\s*v", "adj\\s*\\[\\s*v\\s*\\]\\s*\\[\\s*deg\\[v\\]\\+\\+\\s*\\]\\s*=\\s*u"],
        hint: "Add it both ways: adj[u][deg[u]++] = v; and adj[v][deg[v]++] = u;",
        success:
          "Correct. C makes you carry deg[] yourself, because a plain array has no idea how full it is — that bookkeeping is what vector does for you elsewhere.",
      },
      solution: `int adj[V][MAXDEG], deg[V] = {0};

for (int e = 0; e < E; e++) {
  int u, v;
  scanf("%d %d", &u, &v);
  adj[u][deg[u]++] = v;
  adj[v][deg[v]++] = u;
}`,
    },

    python: {
      example: `# adjacency matrix — O(V^2) memory, O(1) lookup
m = [[0] * V for _ in range(V)]
m[u][v] = 1
m[v][u] = 1                     # undirected: BOTH

# adjacency list — O(V + E) memory
adj = [[] for _ in range(V)]
adj[u].append(v)
adj[v].append(u)

# or, when nodes are not plain numbers
from collections import defaultdict
adj = defaultdict(list)`,
      notes: [
        { token: "[[] for _ in range(V)]", meaning: "the RIGHT way. [[]] * V would share ONE list" },
        { token: "adj[u].append(v)", meaning: "list — one entry per real edge" },
        { token: "defaultdict(list)", meaning: "handy when node names are strings, not 0..V-1" },
        { token: "both directions", meaning: "undirected means you add it twice" },
      ],
      vizCode: `# adjacency matrix — O(V^2) memory, O(1) lookup
m = [[0] * V for _ in range(V)]
m[u][v] = 1

# adjacency list — O(V + E) memory, O(degree) lookup
adj = [[] for _ in range(V)]
adj[u].append(v)
adj[v].append(u)    # undirected: BOTH directions`,
      prompt:
        "Build an adjacency list for an UNDIRECTED graph. Read an edge between u and v, and record it so both nodes know about it.",
      starter: `adj = [[] for _ in range(V)]

for _ in range(E):
    u, v = map(int, input().split())
    
    `,
      rules: {
        regex: ["adj\\s*\\[\\s*u\\s*\\]\\.append\\s*\\(\\s*v\\s*\\)", "adj\\s*\\[\\s*v\\s*\\]\\.append\\s*\\(\\s*u\\s*\\)"],
        hint: "Add it both ways: adj[u].append(v) and adj[v].append(u).",
        success:
          "Correct. Build the outer list with a comprehension, never [[]] * V — that makes V names for ONE list, so every node would share the same neighbours.",
      },
      solution: `adj = [[] for _ in range(V)]

for _ in range(E):
    u, v = map(int, input().split())
    adj[u].append(v)
    adj[v].append(u)`,
    },

    java: {
      example: `// adjacency matrix — O(V^2) memory, O(1) lookup
boolean[][] m = new boolean[V][V];
m[u][v] = true;
m[v][u] = true;                 // undirected: BOTH

// adjacency list — O(V + E) memory
List<List<Integer>> adj = new ArrayList<>();
for (int i = 0; i < V; i++) adj.add(new ArrayList<>());
adj.get(u).add(v);
adj.get(v).add(u);`,
      notes: [
        { token: "new boolean[V][V]", meaning: "matrix — Java zeroes it to false for you" },
        { token: "the setup loop", meaning: "new ArrayList<>() per node. Java will not do it for you" },
        { token: "adj.get(u).add(v)", meaning: "list — one entry per real edge" },
        { token: "int[V][] arrays", meaning: "faster than nested Lists when the degrees are known ahead" },
      ],
      vizCode: `// adjacency matrix — O(V^2) memory, O(1) lookup
boolean[][] m = new boolean[V][V];
m[u][v] = true;

// adjacency list — O(V + E) memory, O(degree) lookup
List<List<Integer>> adj = new ArrayList<>();
adj.get(u).add(v);
adj.get(v).add(u);    // undirected: BOTH directions`,
      prompt:
        "Build an adjacency list for an UNDIRECTED graph. Read an edge between u and v, and record it so both nodes know about it.",
      starter: `List<List<Integer>> adj = new ArrayList<>();
for (int i = 0; i < V; i++) adj.add(new ArrayList<>());

for (int e = 0; e < E; e++) {
  int u = sc.nextInt(), v = sc.nextInt();
  ;
  ;
}`,
      rules: {
        regex: ["adj\\.get\\s*\\(\\s*u\\s*\\)\\.add\\s*\\(\\s*v\\s*\\)", "adj\\.get\\s*\\(\\s*v\\s*\\)\\.add\\s*\\(\\s*u\\s*\\)"],
        hint: "Add it both ways: adj.get(u).add(v); and adj.get(v).add(u);",
        success:
          "Correct. Do not forget the setup loop either — a new ArrayList of Lists is empty, so adj.get(0) would throw before you ever added an edge.",
      },
      solution: `List<List<Integer>> adj = new ArrayList<>();
for (int i = 0; i < V; i++) adj.add(new ArrayList<>());

for (int e = 0; e < E; e++) {
  int u = sc.nextInt(), v = sc.nextInt();
  adj.get(u).add(v);
  adj.get(v).add(u);
}`,
    },

    javascript: {
      example: `// adjacency matrix — O(V^2) memory, O(1) lookup
const m = Array.from({ length: V }, () => new Array(V).fill(0));
m[u][v] = 1;
m[v][u] = 1;                    // undirected: BOTH

// adjacency list — O(V + E) memory
const adj = Array.from({ length: V }, () => []);
adj[u].push(v);
adj[v].push(u);`,
      notes: [
        { token: "Array.from({length: V}, () => [])", meaning: "the RIGHT way. .fill([]) would share ONE array" },
        { token: "adj[u].push(v)", meaning: "list — one entry per real edge" },
        { token: "a Map", meaning: "when node names are strings rather than 0..V-1" },
        { token: "both directions", meaning: "undirected means you add it twice" },
      ],
      vizCode: `// adjacency matrix — O(V^2) memory, O(1) lookup
const m = Array.from({length: V}, () => new Array(V).fill(0));
m[u][v] = 1;

// adjacency list — O(V + E) memory, O(degree) lookup
const adj = Array.from({length: V}, () => []);
adj[u].push(v);
adj[v].push(u);    // undirected: BOTH directions`,
      prompt:
        "Build an adjacency list for an UNDIRECTED graph. Read an edge between u and v, and record it so both nodes know about it.",
      starter: `const adj = Array.from({ length: V }, () => []);

for (const [u, v] of edges) {
  ;
  ;
}`,
      rules: {
        regex: ["adj\\s*\\[\\s*u\\s*\\]\\.push\\s*\\(\\s*v\\s*\\)", "adj\\s*\\[\\s*v\\s*\\]\\.push\\s*\\(\\s*u\\s*\\)"],
        hint: "Add it both ways: adj[u].push(v); and adj[v].push(u);",
        success:
          "Correct. Build it with Array.from — new Array(V).fill([]) puts the SAME array at every index, so every node would end up sharing one neighbour list.",
      },
      solution: `const adj = Array.from({ length: V }, () => []);

for (const [u, v] of edges) {
  adj[u].push(v);
  adj[v].push(u);
}`,
    },

    rust: {
      example: `// adjacency matrix — O(V^2) memory, O(1) lookup
let mut m = vec![vec![false; v_count]; v_count];
m[u][v] = true;
m[v][u] = true;                 // undirected: BOTH

// adjacency list — O(V + E) memory
let mut adj: Vec<Vec<usize>> = vec![Vec::new(); v_count];
adj[u].push(v);
adj[v].push(u);`,
      notes: [
        { token: "vec![Vec::new(); n]", meaning: "each entry is its own Vec — no sharing bug possible" },
        { token: "adj[u].push(v)", meaning: "list — one entry per real edge" },
        { token: "Vec<Vec<(usize, i64)>>", meaning: "for weighted graphs: neighbour and cost together" },
        { token: "both directions", meaning: "undirected means you add it twice" },
      ],
      vizCode: `// adjacency matrix — O(V^2) memory, O(1) lookup
let mut m = vec![vec![false; n]; n];
m[u][v] = true;

// adjacency list — O(V + E) memory, O(degree) lookup
let mut adj: Vec<Vec<usize>> = vec![Vec::new(); n];
adj[u].push(v);
adj[v].push(u);    // undirected: BOTH directions`,
      prompt:
        "Build an adjacency list for an UNDIRECTED graph. Read an edge between u and v, and record it so both nodes know about it.",
      starter: `let mut adj: Vec<Vec<usize>> = vec![Vec::new(); v_count];

for &(u, v) in &edges {
    ;
    ;
}`,
      rules: {
        regex: ["adj\\s*\\[\\s*u\\s*\\]\\.push\\s*\\(\\s*v\\s*\\)", "adj\\s*\\[\\s*v\\s*\\]\\.push\\s*\\(\\s*u\\s*\\)"],
        hint: "Add it both ways: adj[u].push(v); and adj[v].push(u);",
        success:
          "Correct. vec![Vec::new(); n] clones a fresh empty Vec for every slot, so Rust cannot fall into the shared-row trap that Python and JavaScript have here.",
      },
      solution: `let mut adj: Vec<Vec<usize>> = vec![Vec::new(); v_count];

for &(u, v) in &edges {
    adj[u].push(v);
    adj[v].push(u);
}`,
    },
  },

  /* ---------------------------------------------------------- bellman -- */
  bellman: {
    c: {
      example: `long long dist[V];
for (int i = 0; i < V; i++) dist[i] = LLONG_MAX;
dist[start] = 0;

for (int round = 1; round < V; round++)
  for (int e = 0; e < E; e++) {
    int u = eu[e], v = ev[e]; long long w = ew[e];
    if (dist[u] != LLONG_MAX && dist[u] + w < dist[v])
      dist[v] = dist[u] + w;
  }`,
      notes: [
        { token: "round < V", meaning: "V-1 rounds. A shortest path has at most V-1 edges" },
        { token: "dist[u] != LLONG_MAX", meaning: "never relax from an unreachable node — it would overflow" },
        { token: "LLONG_MAX", meaning: "from limits.h" },
        { token: "an extra round", meaning: "anything still improving means a negative cycle" },
      ],
      vizCode: `for (int round = 1; round < V; round++)
  for (int e = 0; e < E; e++)
    if (dist[u] != LLONG_MAX && dist[u] + w < dist[v])
      dist[v] = dist[u] + w;

/* one more round: still improving = negative cycle */`,
      starter: `for (int round = 1; round < ; round++)
  for (int e = 0; e < E; e++) {
    int u = eu[e], v = ev[e]; long long w = ew[e];
    if ( && dist[u] + w < dist[v])
      dist[v] = ;
  }`,
      rules: {
        regex: ["round\\s*<\\s*V", "dist\\[u\\]\\s*!=\\s*LLONG_MAX", "dist\\[v\\]\\s*=\\s*dist\\[u\\]\\s*\\+\\s*w"],
        hint: "Loop while round < V. Guard with dist[u] != LLONG_MAX, then dist[v] = dist[u] + w.",
        success:
          "Correct, and the guard is not cosmetic: LLONG_MAX + w wraps round to a large negative number, which then looks like a wonderful shortcut and ruins every distance.",
      },
      solution: `for (int round = 1; round < V; round++)
  for (int e = 0; e < E; e++) {
    int u = eu[e], v = ev[e]; long long w = ew[e];
    if (dist[u] != LLONG_MAX && dist[u] + w < dist[v])
      dist[v] = dist[u] + w;
  }`,
    },

    python: {
      example: `dist = [float('inf')] * V
dist[start] = 0

for _ in range(V - 1):
    changed = False
    for u, v, w in edges:
        if dist[u] + w < dist[v]:
            dist[v] = dist[u] + w
            changed = True
    if not changed:
        break                     # settled early

# one more round — still improving means a negative cycle
for u, v, w in edges:
    if dist[u] + w < dist[v]:
        raise ValueError("negative cycle")`,
      notes: [
        { token: "range(V - 1)", meaning: "V-1 rounds. A shortest path has at most V-1 edges" },
        { token: "float('inf')", meaning: "inf + w is still inf, so no overflow guard is needed" },
        { token: "if not changed: break", meaning: "stop early once a whole round improves nothing" },
        { token: "the extra round", meaning: "the negative-cycle check, which Dijkstra cannot do" },
      ],
      vizCode: `for _ in range(V - 1):
    for u, v, w in edges:
        if dist[u] + w < dist[v]:
            dist[v] = dist[u] + w

# one more round: still improving = negative cycle`,
      prompt:
        "Write the Bellman–Ford relaxation loop. Do V−1 rounds, and stop early if a whole round changes nothing.",
      starter: `for _ in range():
    changed = False
    for u, v, w in edges:
        if :
            dist[v] = 
            changed = True
    if not changed:
        break`,
      rules: {
        regex: ["range\\s*\\(\\s*V\\s*-\\s*1\\s*\\)", "dist\\[u\\]\\s*\\+\\s*w\\s*<\\s*dist\\[v\\]", "dist\\[v\\]\\s*=\\s*dist\\[u\\]\\s*\\+\\s*w"],
        hint: "range(V - 1) gives V−1 rounds. Relax when dist[u] + w < dist[v], setting dist[v] = dist[u] + w.",
        success:
          "Correct, and Python makes this easier than most: float('inf') + w is still inf, so the overflow guard C and Java need is not required here.",
      },
      solution: `for _ in range(V - 1):
    changed = False
    for u, v, w in edges:
        if dist[u] + w < dist[v]:
            dist[v] = dist[u] + w
            changed = True
    if not changed:
        break`,
    },

    java: {
      example: `long[] dist = new long[V];
Arrays.fill(dist, Long.MAX_VALUE);
dist[start] = 0;

for (int round = 1; round < V; round++)
  for (int[] e : edges) {
    int u = e[0], v = e[1], w = e[2];
    if (dist[u] != Long.MAX_VALUE && dist[u] + w < dist[v])
      dist[v] = dist[u] + w;
  }`,
      notes: [
        { token: "round < V", meaning: "V-1 rounds. A shortest path has at most V-1 edges" },
        { token: "dist[u] != Long.MAX_VALUE", meaning: "never relax from an unreachable node — it would overflow" },
        { token: "Arrays.fill", meaning: "a new long[] starts at 0, which would look reachable" },
        { token: "an extra round", meaning: "anything still improving means a negative cycle" },
      ],
      vizCode: `for (int round = 1; round < V; round++)
  for (int[] e : edges)
    if (dist[u] != Long.MAX_VALUE && dist[u] + w < dist[v])
      dist[v] = dist[u] + w;

// one more round: still improving = negative cycle`,
      starter: `for (int round = 1; round < ; round++)
  for (int[] e : edges) {
    int u = e[0], v = e[1], w = e[2];
    if ( && dist[u] + w < dist[v])
      dist[v] = ;
  }`,
      rules: {
        regex: ["round\\s*<\\s*V", "dist\\[u\\]\\s*!=\\s*Long\\.MAX_VALUE", "dist\\[v\\]\\s*=\\s*dist\\[u\\]\\s*\\+\\s*w"],
        hint: "Loop while round < V. Guard with dist[u] != Long.MAX_VALUE, then dist[v] = dist[u] + w.",
        success:
          "Correct. Java wraps silently on overflow rather than crashing, so Long.MAX_VALUE + w becomes a huge negative number and every later distance is wrong.",
      },
      solution: `for (int round = 1; round < V; round++)
  for (int[] e : edges) {
    int u = e[0], v = e[1], w = e[2];
    if (dist[u] != Long.MAX_VALUE && dist[u] + w < dist[v])
      dist[v] = dist[u] + w;
  }`,
    },

    javascript: {
      example: `const dist = new Array(V).fill(Infinity);
dist[start] = 0;

for (let round = 1; round < V; round++) {
  let changed = false;
  for (const [u, v, w] of edges) {
    if (dist[u] + w < dist[v]) {
      dist[v] = dist[u] + w;
      changed = true;
    }
  }
  if (!changed) break;          // settled early
}`,
      notes: [
        { token: "round < V", meaning: "V-1 rounds. A shortest path has at most V-1 edges" },
        { token: "Infinity", meaning: "a real value here — Infinity + w is still Infinity, so no guard is needed" },
        { token: "if (!changed) break", meaning: "stop early once a whole round improves nothing" },
        { token: "the extra round", meaning: "the negative-cycle check, which Dijkstra cannot do" },
      ],
      vizCode: `for (let round = 1; round < V; round++)
  for (const [u, v, w] of edges)
    if (dist[u] + w < dist[v])
      dist[v] = dist[u] + w;

// one more round: still improving = negative cycle`,
      prompt:
        "Write the Bellman–Ford relaxation loop. Do V−1 rounds, and stop early if a whole round changes nothing.",
      starter: `for (let round = 1; round < ; round++) {
  let changed = false;
  for (const [u, v, w] of edges) {
    if ( ) {
      dist[v] = ;
      changed = true;
    }
  }
  if (!changed) break;
}`,
      rules: {
        regex: ["round\\s*<\\s*V", "dist\\[u\\]\\s*\\+\\s*w\\s*<\\s*dist\\[v\\]", "dist\\[v\\]\\s*=\\s*dist\\[u\\]\\s*\\+\\s*w"],
        hint: "Loop while round < V. Relax when dist[u] + w < dist[v], setting dist[v] = dist[u] + w.",
        success:
          "Correct. JavaScript's Infinity behaves properly in arithmetic, so unlike C and Java there is no overflow guard to remember here.",
      },
      solution: `for (let round = 1; round < V; round++) {
  let changed = false;
  for (const [u, v, w] of edges) {
    if (dist[u] + w < dist[v]) {
      dist[v] = dist[u] + w;
      changed = true;
    }
  }
  if (!changed) break;
}`,
    },

    rust: {
      example: `let mut dist = vec![i64::MAX; v_count];
dist[start] = 0;

for _ in 1..v_count {
    let mut changed = false;
    for &(u, v, w) in &edges {
        if dist[u] != i64::MAX && dist[u] + w < dist[v] {
            dist[v] = dist[u] + w;
            changed = true;
        }
    }
    if !changed { break; }        // settled early
}`,
      notes: [
        { token: "1..v_count", meaning: "V-1 rounds. A shortest path has at most V-1 edges" },
        { token: "dist[u] != i64::MAX", meaning: "required — i64::MAX + w overflows" },
        { token: "overflow in debug", meaning: "stops the program, so you find out at once" },
        { token: "if !changed { break; }", meaning: "stop early once a whole round improves nothing" },
      ],
      vizCode: `for _ in 1..v_count {
    for &(u, v, w) in &edges {
        if dist[u] != i64::MAX && dist[u] + w < dist[v] {
            dist[v] = dist[u] + w; } }
}
// one more round: still improving = negative cycle`,
      prompt:
        "Write the Bellman–Ford relaxation loop. Do V−1 rounds, and guard against relaxing from an unreachable node.",
      starter: `for _ in  {
    for &(u, v, w) in &edges {
        if  && dist[u] + w < dist[v] {
            dist[v] = ;
        }
    }
}`,
      rules: {
        regex: ["1\\.\\.v_count", "dist\\[u\\]\\s*!=\\s*i64::MAX", "dist\\[v\\]\\s*=\\s*dist\\[u\\]\\s*\\+\\s*w"],
        hint: "Loop 1..v_count for V−1 rounds. Guard with dist[u] != i64::MAX, then dist[v] = dist[u] + w.",
        success:
          "Correct, and Rust is helpful here: without the guard, i64::MAX + w overflows and a debug build stops the program instead of quietly producing nonsense.",
      },
      solution: `for _ in 1..v_count {
    for &(u, v, w) in &edges {
        if dist[u] != i64::MAX && dist[u] + w < dist[v] {
            dist[v] = dist[u] + w;
        }
    }
}`,
    },
  },

  /* ------------------------------------------------------------- prim -- */
  prim: {
    c: {
      example: `/* C has no heap, so the O(V^2) version is the simple one:
   repeatedly pick the cheapest unreached node. */

int best[V], inTree[V] = {0};
for (int i = 0; i < V; i++) best[i] = INT_MAX;
best[start] = 0;

long long total = 0;
for (int step = 0; step < V; step++) {
  int v = -1;
  for (int i = 0; i < V; i++)
    if (!inTree[i] && (v == -1 || best[i] < best[v])) v = i;
  inTree[v] = 1;
  total += best[v];
  for (int e = 0; e < deg[v]; e++)
    if (!inTree[to[v][e]] && wt[v][e] < best[to[v][e]])
      best[to[v][e]] = wt[v][e];
}`,
      notes: [
        { token: "best[i]", meaning: "the cheapest edge found so far reaching node i" },
        { token: "wt < best[to]", meaning: "just the edge weight. Dijkstra would add best[v] to it" },
        { token: "V-1 edges", meaning: "always. That is what makes it a tree" },
        { token: "O(V^2)", meaning: "fine for dense graphs. A heap gives O(E log V)" },
      ],
      vizCode: `/* pick the cheapest unreached node each round */
for (int step = 0; step < V; step++) {
  int v = cheapestUnreached();
  inTree[v] = 1;
  total += best[v];
  for (int e = 0; e < deg[v]; e++)
    if (!inTree[to[v][e]]) relax(to[v][e], wt[v][e]);
}`,
      prompt:
        "Write the update step: for each neighbour not yet in the tree, keep the cheapest edge reaching it. Note what is compared — this is the one line that differs from Dijkstra.",
      starter: `for (int e = 0; e < deg[v]; e++) {
  int t = to[v][e], w = wt[v][e];
  if (!inTree[t] && )
    best[t] = ;
}`,
      rules: {
        regex: ["w\\s*<\\s*best\\[t\\]", "best\\[t\\]\\s*=\\s*w\\s*;"],
        mustNot: ["best[v] + w", "total + w"],
        hint: "Compare w < best[t], and set best[t] = w — the edge weight ON ITS OWN, not added to anything.",
        success:
          "Correct, and that is exactly the line separating the two algorithms. Compare w and you get a spanning tree; compare best[v] + w and you get Dijkstra's shortest paths.",
      },
      solution: `for (int e = 0; e < deg[v]; e++) {
  int t = to[v][e], w = wt[v][e];
  if (!inTree[t] && w < best[t])
    best[t] = w;
}`,
    },

    python: {
      example: `import heapq

in_tree = [False] * V
pq = [(0, start)]        # (weight, node) — heapq is a MIN-heap
total = 0

while pq:
    w, v = heapq.heappop(pq)
    if in_tree[v]:
        continue         # already reached, more cheaply
    in_tree[v] = True
    total += w
    for to, cost in adj[v]:
        if not in_tree[to]:
            heapq.heappush(pq, (cost, to))   # cost ALONE, not w + cost`,
      notes: [
        { token: "heapq is a MIN-heap", meaning: "exactly what Prim's wants. No reversing needed" },
        { token: "(cost, to)", meaning: "just the edge weight. Dijkstra would push w + cost" },
        { token: "if in_tree[v]: continue", meaning: "a stale entry — skip it" },
        { token: "V-1 edges", meaning: "always. That is what makes it a tree" },
      ],
      vizCode: `pq = [(0, start)]
while pq:
    w, v = heapq.heappop(pq)
    if in_tree[v]: continue
    in_tree[v] = True; total += w
    for to, cost in adj[v]:
        if not in_tree[to]: heapq.heappush(pq, (cost, to))`,
      prompt:
        "Write the heart of Prim's: skip a node already in the tree, otherwise pull it in and offer up its edges. Note what gets pushed — this is the one line that differs from Dijkstra.",
      starter: `while pq:
    w, v = heapq.heappop(pq)
    if :
        continue
    in_tree[v] = True
    total += w
    for to, cost in adj[v]:
        if not in_tree[to]:
            heapq.heappush(pq, ( , to))`,
      rules: {
        regex: ["in_tree\\s*\\[\\s*v\\s*\\]", "heappush\\s*\\(\\s*pq\\s*,\\s*\\(\\s*cost\\s*,\\s*to\\s*\\)\\s*\\)"],
        mustNot: ["w + cost"],
        hint: "Skip when in_tree[v]. Push (cost, to) — the edge weight ON ITS OWN, not added to w.",
        success:
          "Correct. Python's heapq is a min-heap by default, so Prim's needs no negation tricks — unlike its max-heap cousins in C++ and Rust.",
      },
      solution: `while pq:
    w, v = heapq.heappop(pq)
    if in_tree[v]:
        continue
    in_tree[v] = True
    total += w
    for to, cost in adj[v]:
        if not in_tree[to]:
            heapq.heappush(pq, (cost, to))`,
    },

    java: {
      example: `boolean[] inTree = new boolean[V];
PriorityQueue<int[]> pq =
    new PriorityQueue<>((x, y) -> Integer.compare(x[0], y[0]));

pq.add(new int[]{0, start});
long total = 0;

while (!pq.isEmpty()) {
  int[] cur = pq.poll();
  int w = cur[0], v = cur[1];
  if (inTree[v]) continue;              // already reached
  inTree[v] = true;
  total += w;
  for (int[] e : adj.get(v))
    if (!inTree[e[0]]) pq.add(new int[]{e[1], e[0]});   // cost ALONE
}`,
      notes: [
        { token: "PriorityQueue is a MIN-heap", meaning: "exactly what Prim's wants" },
        { token: "Integer.compare", meaning: "safer than x[0] - y[0], which can overflow" },
        { token: "{e[1], e[0]}", meaning: "just the edge weight. Dijkstra would push w + cost" },
        { token: "if (inTree[v]) continue", meaning: "a stale entry — skip it" },
      ],
      vizCode: `pq.add(new int[]{0, start});
while (!pq.isEmpty()) {
  int[] c = pq.poll();
  if (inTree[c[1]]) continue;
  inTree[c[1]] = true; total += c[0];
  for (int[] e : adj.get(c[1]))
    if (!inTree[e[0]]) pq.add(new int[]{e[1], e[0]});
}`,
      prompt:
        "Write the heart of Prim's: skip a node already in the tree, otherwise pull it in and offer up its edges. Note what gets pushed.",
      starter: `while (!pq.isEmpty()) {
  int[] cur = pq.poll();
  int w = cur[0], v = cur[1];
  if ( ) continue;
  inTree[v] = true;
  total += w;
  for (int[] e : adj.get(v))
    if (!inTree[e[0]]) pq.add(new int[]{ , e[0]});
}`,
      rules: {
        regex: ["inTree\\s*\\[\\s*v\\s*\\]", "new\\s+int\\[\\]\\s*\\{\\s*e\\[1\\]\\s*,\\s*e\\[0\\]\\s*\\}"],
        mustNot: ["w + e[1]"],
        hint: "Skip when inTree[v]. Push new int[]{e[1], e[0]} — the edge weight ON ITS OWN, not added to w.",
        success:
          "Correct. Write the comparator as Integer.compare rather than x[0] - y[0] — the subtraction overflows on large weights and reorders the heap wrongly.",
      },
      solution: `while (!pq.isEmpty()) {
  int[] cur = pq.poll();
  int w = cur[0], v = cur[1];
  if (inTree[v]) continue;
  inTree[v] = true;
  total += w;
  for (int[] e : adj.get(v))
    if (!inTree[e[0]]) pq.add(new int[]{e[1], e[0]});
}`,
    },

    javascript: {
      example: `// JavaScript has no heap — use the one from the Heap chapter.
const inTree = new Array(V).fill(false);
const pq = new MinHeap();
pq.push([0, start]);
let total = 0;

while (pq.size > 0) {
  const [w, v] = pq.pop();
  if (inTree[v]) continue;              // already reached
  inTree[v] = true;
  total += w;
  for (const [to, cost] of adj[v])
    if (!inTree[to]) pq.push([cost, to]);   // cost ALONE, not w + cost
}`,
      notes: [
        { token: "no built-in heap", meaning: "this is where the Heap chapter pays off again" },
        { token: "[cost, to]", meaning: "just the edge weight. Dijkstra would push w + cost" },
        { token: "if (inTree[v]) continue", meaning: "a stale entry — skip it" },
        { token: "V-1 edges", meaning: "always. That is what makes it a tree" },
      ],
      vizCode: `pq.push([0, start]);
while (pq.size > 0) {
  const [w, v] = pq.pop();
  if (inTree[v]) continue;
  inTree[v] = true; total += w;
  for (const [to, cost] of adj[v])
    if (!inTree[to]) pq.push([cost, to]);
}`,
      prompt:
        "Write the heart of Prim's: skip a node already in the tree, otherwise pull it in and offer up its edges. Note what gets pushed.",
      starter: `while (pq.size > 0) {
  const [w, v] = pq.pop();
  if ( ) continue;
  inTree[v] = true;
  total += w;
  for (const [to, cost] of adj[v])
    if (!inTree[to]) pq.push([ , to]);
}`,
      rules: {
        regex: ["inTree\\s*\\[\\s*v\\s*\\]", "pq\\.push\\s*\\(\\s*\\[\\s*cost\\s*,\\s*to\\s*\\]\\s*\\)"],
        mustNot: ["w + cost"],
        hint: "Skip when inTree[v]. Push [cost, to] — the edge weight ON ITS OWN, not added to w.",
        success:
          "Correct. Prim's and Dijkstra share the same shape and the same heap, so once you have written one the other is a one-line change.",
      },
      solution: `while (pq.size > 0) {
  const [w, v] = pq.pop();
  if (inTree[v]) continue;
  inTree[v] = true;
  total += w;
  for (const [to, cost] of adj[v])
    if (!inTree[to]) pq.push([cost, to]);
}`,
    },

    rust: {
      example: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

let mut in_tree = vec![false; v_count];
let mut pq = BinaryHeap::new();
pq.push(Reverse((0i64, start)));      // Reverse: BinaryHeap is a MAX-heap
let mut total = 0i64;

while let Some(Reverse((w, v))) = pq.pop() {
    if in_tree[v] { continue; }       // already reached
    in_tree[v] = true;
    total += w;
    for &(to, cost) in &adj[v] {
        if !in_tree[to] { pq.push(Reverse((cost, to))); }   // cost ALONE
    }
}`,
      notes: [
        { token: "BinaryHeap is a MAX-heap", meaning: "so Prim's needs Reverse to turn it round" },
        { token: "Reverse((cost, to))", meaning: "just the edge weight. Dijkstra would push w + cost" },
        { token: "if in_tree[v] { continue; }", meaning: "a stale entry — skip it" },
        { token: "V-1 edges", meaning: "always. That is what makes it a tree" },
      ],
      vizCode: `pq.push(Reverse((0, start)));
while let Some(Reverse((w, v))) = pq.pop() {
    if in_tree[v] { continue; }
    in_tree[v] = true; total += w;
    for &(to, cost) in &adj[v] {
        if !in_tree[to] { pq.push(Reverse((cost, to))); } }
}`,
      prompt:
        "Write the heart of Prim's: skip a node already in the tree, otherwise pull it in and offer up its edges. Note what gets pushed.",
      starter: `while let Some(Reverse((w, v))) = pq.pop() {
    if  { continue; }
    in_tree[v] = true;
    total += w;
    for &(to, cost) in &adj[v] {
        if !in_tree[to] { pq.push(Reverse(( , to))); }
    }
}`,
      rules: {
        regex: ["in_tree\\s*\\[\\s*v\\s*\\]", "Reverse\\s*\\(\\s*\\(\\s*cost\\s*,\\s*to\\s*\\)\\s*\\)"],
        mustNot: ["w + cost"],
        hint: "Skip when in_tree[v]. Push Reverse((cost, to)) — the edge weight ON ITS OWN, not added to w.",
        success:
          "Correct. Keep the Reverse wrapper: without it Rust's max-heap would take the most EXPENSIVE edge first and build the worst spanning tree instead of the best.",
      },
      solution: `while let Some(Reverse((w, v))) = pq.pop() {
    if in_tree[v] { continue; }
    in_tree[v] = true;
    total += w;
    for &(to, cost) in &adj[v] {
        if !in_tree[to] { pq.push(Reverse((cost, to))); }
    }
}`,
    },
  },

  /* -------------------------------------------------------------- bfs -- */
  bfs: {
    c: {
      example: `int q[MAXN], head = 0, tail = 0;
for (int i = 0; i < n; i++) dist[i] = -1;

dist[start] = 0;
q[tail++] = start;

while (head < tail) {
  int u = q[head++];
  for (int e = 0; e < deg[u]; e++) {
    int v = adj[u][e];
    if (dist[v] != -1) continue;      /* already seen */
    dist[v] = dist[u] + 1;            /* mark on PUSH */
    q[tail++] = v;
  }
}`,
      notes: [
        { token: "dist[v] != -1", meaning: "-1 doubles as 'not visited'" },
        { token: "mark on push", meaning: "not on pop — this is the classic bug" },
        { token: "head++ to pop", meaning: "O(1). Nothing is shifted" },
        { token: "dist[u] + 1", meaning: "every edge costs the same, which is why this works" },
      ],
      vizCode: `int q[MAXN], head = 0, tail = 0;
q[tail++] = start; dist[start] = 0;
while (head < tail) {
  int u = q[head++];
  for (int e = 0; e < deg[u]; e++)
    if (dist[adj[u][e]] == -1) { dist[..] = dist[u]+1; q[tail++] = ..; }
}`,
      starter: `while (head < tail) {
  int u = q[head++];
  for (int e = 0; e < deg[u]; e++) {
    int v = adj[u][e];
    if ( ) continue;
    dist[v] = ;
    q[tail++] = v;
  }
}`,
      rules: {
        regex: ["dist\\[v\\]\\s*!=\\s*-1", "dist\\[v\\]\\s*=\\s*dist\\[u\\]\\s*\\+\\s*1"],
        hint: "Skip when dist[v] != -1. Otherwise dist[v] = dist[u] + 1 and push v.",
        success:
          "Correct. Setting the distance at push time is what marks the node as seen — one line doing both jobs.",
      },
      solution: `while (head < tail) {
  int u = q[head++];
  for (int e = 0; e < deg[u]; e++) {
    int v = adj[u][e];
    if (dist[v] != -1) continue;
    dist[v] = dist[u] + 1;
    q[tail++] = v;
  }
}`,
    },

    python: {
      example: `from collections import deque

dist = [-1] * n
dist[start] = 0
q = deque([start])

while q:
    u = q.popleft()
    for v in adj[u]:
        if dist[v] != -1:
            continue                  # already seen
        dist[v] = dist[u] + 1         # mark on PUSH
        q.append(v)`,
      notes: [
        { token: "deque, not a list", meaning: "popleft is O(1); a list's pop(0) is O(n)" },
        { token: "dist[v] != -1", meaning: "-1 doubles as 'not visited'" },
        { token: "mark on push", meaning: "not on pop — this is the classic bug" },
        { token: "pop(0) in BFS", meaning: "turns O(V+E) into O(V²) with no warning at all" },
      ],
      vizCode: `q = deque([start]); dist[start] = 0
while q:
    u = q.popleft()
    for v in adj[u]:
        if dist[v] == -1:
            dist[v] = dist[u] + 1; q.append(v)`,
      prompt:
        "Write the BFS neighbour loop: skip anything already seen, set its distance, and queue it. Use a deque.",
      starter: `while q:
    u = q.popleft()
    for v in adj[u]:
        if :
            continue
        dist[v] = 
        q.append(v)`,
      rules: {
        mustNot: ["pop(0)"],
        regex: ["dist\\[v\\]\\s*!=\\s*-1", "dist\\[v\\]\\s*=\\s*dist\\[u\\]\\s*\\+\\s*1"],
        hint: "Skip when dist[v] != -1. Otherwise dist[v] = dist[u] + 1 and append v.",
        success:
          "Correct. The deque is not a detail: writing BFS with a list and pop(0) is the most common reason a correct-looking Python solution times out.",
      },
      solution: `while q:
    u = q.popleft()
    for v in adj[u]:
        if dist[v] != -1:
            continue
        dist[v] = dist[u] + 1
        q.append(v)`,
    },

    java: {
      example: `int[] dist = new int[n];
Arrays.fill(dist, -1);
Queue<Integer> q = new ArrayDeque<>();

dist[start] = 0;
q.add(start);

while (!q.isEmpty()) {
  int u = q.poll();
  for (int v : adj.get(u)) {
    if (dist[v] != -1) continue;      // already seen
    dist[v] = dist[u] + 1;            // mark on PUSH
    q.add(v);
  }
}`,
      notes: [
        { token: "Arrays.fill(dist, -1)", meaning: "a new int[] starts at 0, which would look like 'visited'" },
        { token: "dist[v] != -1", meaning: "-1 doubles as 'not visited'" },
        { token: "mark on push", meaning: "not on pop — this is the classic bug" },
        { token: "ArrayDeque", meaning: "faster than LinkedList, which allocates a node per item" },
      ],
      vizCode: `Queue<Integer> q = new ArrayDeque<>();
q.add(start); dist[start] = 0;
while (!q.isEmpty()) {
  int u = q.poll();
  for (int v : adj.get(u))
    if (dist[v] == -1) { dist[v] = dist[u]+1; q.add(v); }
}`,
      starter: `while (!q.isEmpty()) {
  int u = q.poll();
  for (int v : adj.get(u)) {
    if ( ) continue;
    dist[v] = ;
    q.add(v);
  }
}`,
      rules: {
        regex: ["dist\\[v\\]\\s*!=\\s*-1", "dist\\[v\\]\\s*=\\s*dist\\[u\\]\\s*\\+\\s*1"],
        hint: "Skip when dist[v] != -1. Otherwise dist[v] = dist[u] + 1 and add v.",
        success:
          "Correct, and do not forget the Arrays.fill(dist, -1): a fresh int[] is full of zeros, which this code would read as 'already visited at distance 0'.",
      },
      solution: `while (!q.isEmpty()) {
  int u = q.poll();
  for (int v : adj.get(u)) {
    if (dist[v] != -1) continue;
    dist[v] = dist[u] + 1;
    q.add(v);
  }
}`,
    },

    javascript: {
      example: `const dist = new Array(n).fill(-1);
const q = [start];
let head = 0;                     // index, not shift()

dist[start] = 0;

while (head < q.length) {
  const u = q[head++];
  for (const v of adj[u]) {
    if (dist[v] !== -1) continue;     // already seen
    dist[v] = dist[u] + 1;            // mark on PUSH
    q.push(v);
  }
}`,
      notes: [
        { token: "head++, not q.shift()", meaning: "shift is O(n) and turns BFS into O(V²)" },
        { token: "dist[v] !== -1", meaning: "-1 doubles as 'not visited'" },
        { token: "mark on push", meaning: "not on pop — this is the classic bug" },
        { token: ".fill(-1)", meaning: "without it every slot is undefined, and comparisons get strange" },
      ],
      vizCode: `const q = [start]; let head = 0;
dist[start] = 0;
while (head < q.length) {
  const u = q[head++];
  for (const v of adj[u])
    if (dist[v] === -1) { dist[v] = dist[u]+1; q.push(v); }
}`,
      prompt:
        "Write the BFS neighbour loop: skip anything already seen, set its distance, and queue it. Use a head index, not .shift().",
      starter: `while (head < q.length) {
  const u = q[head++];
  for (const v of adj[u]) {
    if ( ) continue;
    dist[v] = ;
    q.push(v);
  }
}`,
      rules: {
        mustNot: [".shift()"],
        regex: ["dist\\[v\\]\\s*!==?\\s*-1", "dist\\[v\\]\\s*=\\s*dist\\[u\\]\\s*\\+\\s*1"],
        hint: "Skip when dist[v] !== -1. Otherwise dist[v] = dist[u] + 1 and push v.",
        success:
          "Correct. The head index is the important part: q.shift() moves every remaining item on each pop, which silently turns an O(V+E) BFS into O(V²).",
      },
      solution: `while (head < q.length) {
  const u = q[head++];
  for (const v of adj[u]) {
    if (dist[v] !== -1) continue;
    dist[v] = dist[u] + 1;
    q.push(v);
  }
}`,
    },

    rust: {
      example: `use std::collections::VecDeque;

let mut dist = vec![-1i32; n];
let mut q = VecDeque::new();

dist[start] = 0;
q.push_back(start);

while let Some(u) = q.pop_front() {
    for &v in &adj[u] {
        if dist[v] != -1 { continue; }      // already seen
        dist[v] = dist[u] + 1;              // mark on PUSH
        q.push_back(v);
    }
}`,
      notes: [
        { token: "VecDeque", meaning: "O(1) at both ends. Vec::remove(0) would be O(n)" },
        { token: "while let Some(u)", meaning: "the loop ends by itself when the queue empties" },
        { token: "&adj[u]", meaning: "borrow the neighbour list rather than copying it" },
        { token: "mark on push", meaning: "not on pop — this is the classic bug" },
      ],
      vizCode: `let mut q = VecDeque::new();
q.push_back(start); dist[start] = 0;
while let Some(u) = q.pop_front() {
    for &v in &adj[u] {
        if dist[v] == -1 { dist[v] = dist[u]+1; q.push_back(v); } }
}`,
      starter: `while let Some(u) = q.pop_front() {
    for &v in &adj[u] {
        if  { continue; }
        dist[v] = ;
        q.push_back(v);
    }
}`,
      rules: {
        regex: ["dist\\[v\\]\\s*!=\\s*-1", "dist\\[v\\]\\s*=\\s*dist\\[u\\]\\s*\\+\\s*1"],
        hint: "Skip when dist[v] != -1. Otherwise dist[v] = dist[u] + 1 and push_back v.",
        success:
          "Correct. `while let Some(u) = q.pop_front()` is the natural Rust shape — the empty check and the pop are the same expression.",
      },
      solution: `while let Some(u) = q.pop_front() {
    for &v in &adj[u] {
        if dist[v] != -1 { continue; }
        dist[v] = dist[u] + 1;
        q.push_back(v);
    }
}`,
    },
  },

  /* -------------------------------------------------------------- dfs -- */
  dfs: {
    c: {
      example: `void dfs(int u) {
  seen[u] = 1;
  for (int e = 0; e < deg[u]; e++)
    if (!seen[adj[u][e]]) dfs(adj[u][e]);
}

/* count connected components */
int components = 0;
for (int i = 0; i < n; i++)
  if (!seen[i]) { dfs(i); components++; }`,
      notes: [
        { token: "seen[u] = 1", meaning: "first line — before exploring anything" },
        { token: "if (!seen[v])", meaning: "without this, a cycle never ends" },
        { token: "the outer loop", meaning: "reaches parts not connected to the first node" },
        { token: "deep recursion", meaning: "10⁵ levels can overflow the stack. Use an explicit stack then" },
      ],
      vizCode: `void dfs(int u) {
  seen[u] = 1;
  for (int e = 0; e < deg[u]; e++)
    if (!seen[adj[u][e]]) dfs(adj[u][e]);
}`,
      starter: `void fill(int r, int c) {
  if (r < 0 || r >= R || c < 0 || c >= C) return;
  if (grid[r][c] != '1') return;
  grid[r][c] = '0';
  fill(r + 1, c);
  fill( , c);
  fill(r, );
  fill(r, );
}`,
      rules: {
        regex: ["fill\\s*\\(\\s*r\\s*-\\s*1\\s*,\\s*c\\s*\\)", "fill\\s*\\(\\s*r\\s*,\\s*c\\s*\\+\\s*1\\s*\\)", "fill\\s*\\(\\s*r\\s*,\\s*c\\s*-\\s*1\\s*\\)"],
        hint: "The four neighbours are (r+1, c), (r-1, c), (r, c+1) and (r, c-1).",
        success:
          "Correct. Setting the cell to '0' is what marks it visited — sunk land can never be entered again, so no separate seen array is needed.",
      },
      solution: `void fill(int r, int c) {
  if (r < 0 || r >= R || c < 0 || c >= C) return;
  if (grid[r][c] != '1') return;
  grid[r][c] = '0';
  fill(r + 1, c);
  fill(r - 1, c);
  fill(r, c + 1);
  fill(r, c - 1);
}`,
    },

    python: {
      example: `def dfs(u):
    seen[u] = True
    for v in adj[u]:
        if not seen[v]:
            dfs(v)


# count connected components
components = 0
for i in range(n):
    if not seen[i]:
        dfs(i)
        components += 1`,
      notes: [
        { token: "seen[u] = True", meaning: "first line — before exploring anything" },
        { token: "if not seen[v]", meaning: "without this, a cycle never ends" },
        { token: "recursion limit", meaning: "about 1000 by default. A big graph WILL hit it" },
        { token: "an explicit stack", meaning: "the usual fix in Python — a list used with append and pop" },
      ],
      vizCode: `def dfs(u):
    seen[u] = True
    for v in adj[u]:
        if not seen[v]: dfs(v)`,
      prompt:
        "Write flood fill on a grid: stop at the edges or on water, mark this cell, then recurse into all four directions.",
      starter: `def fill(r, c):
    if r < 0 or r >= R or c < 0 or c >= C:
        return
    if grid[r][c] != '1':
        return
    grid[r][c] = '0'
    fill(r + 1, c)
    fill(, c)
    fill(r, )
    fill(r, )`,
      rules: {
        regex: ["fill\\s*\\(\\s*r\\s*-\\s*1\\s*,\\s*c\\s*\\)", "fill\\s*\\(\\s*r\\s*,\\s*c\\s*\\+\\s*1\\s*\\)", "fill\\s*\\(\\s*r\\s*,\\s*c\\s*-\\s*1\\s*\\)"],
        hint: "The four neighbours are (r+1, c), (r-1, c), (r, c+1) and (r, c-1).",
        success:
          "Correct — but watch the depth in Python. A 1000x1000 grid of land recurses a million levels deep, so a real solution needs an explicit stack instead.",
      },
      solution: `def fill(r, c):
    if r < 0 or r >= R or c < 0 or c >= C:
        return
    if grid[r][c] != '1':
        return
    grid[r][c] = '0'
    fill(r + 1, c)
    fill(r - 1, c)
    fill(r, c + 1)
    fill(r, c - 1)`,
    },

    java: {
      example: `static void dfs(int u) {
  seen[u] = true;
  for (int v : adj.get(u))
    if (!seen[v]) dfs(v);
}

// count connected components
int components = 0;
for (int i = 0; i < n; i++)
  if (!seen[i]) { dfs(i); components++; }`,
      notes: [
        { token: "seen[u] = true", meaning: "first line — before exploring anything" },
        { token: "if (!seen[v])", meaning: "without this, a cycle never ends" },
        { token: "StackOverflowError", meaning: "what a too-deep DFS throws" },
        { token: "-Xss64m", meaning: "raises the stack size, when you cannot avoid the depth" },
      ],
      vizCode: `static void dfs(int u) {
  seen[u] = true;
  for (int v : adj.get(u))
    if (!seen[v]) dfs(v);
}`,
      starter: `static void fill(int r, int c) {
  if (r < 0 || r >= R || c < 0 || c >= C) return;
  if (grid[r][c] != '1') return;
  grid[r][c] = '0';
  fill(r + 1, c);
  fill( , c);
  fill(r, );
  fill(r, );
}`,
      rules: {
        regex: ["fill\\s*\\(\\s*r\\s*-\\s*1\\s*,\\s*c\\s*\\)", "fill\\s*\\(\\s*r\\s*,\\s*c\\s*\\+\\s*1\\s*\\)", "fill\\s*\\(\\s*r\\s*,\\s*c\\s*-\\s*1\\s*\\)"],
        hint: "The four neighbours are (r+1, c), (r-1, c), (r, c+1) and (r, c-1).",
        success:
          "Correct. On a large grid Java throws StackOverflowError — either raise the stack with -Xss, or rewrite it with an explicit ArrayDeque.",
      },
      solution: `static void fill(int r, int c) {
  if (r < 0 || r >= R || c < 0 || c >= C) return;
  if (grid[r][c] != '1') return;
  grid[r][c] = '0';
  fill(r + 1, c);
  fill(r - 1, c);
  fill(r, c + 1);
  fill(r, c - 1);
}`,
    },

    javascript: {
      example: `function dfs(u) {
  seen[u] = true;
  for (const v of adj[u])
    if (!seen[v]) dfs(v);
}

// count connected components
let components = 0;
for (let i = 0; i < n; i++)
  if (!seen[i]) { dfs(i); components++; }`,
      notes: [
        { token: "seen[u] = true", meaning: "first line — before exploring anything" },
        { token: "if (!seen[v])", meaning: "without this, a cycle never ends" },
        { token: "RangeError", meaning: "what a too-deep recursion throws — 'Maximum call stack size exceeded'" },
        { token: "about 10000 levels", meaning: "the usual limit. Deeper needs an explicit stack" },
      ],
      vizCode: `function dfs(u) {
  seen[u] = true;
  for (const v of adj[u])
    if (!seen[v]) dfs(v);
}`,
      prompt:
        "Write flood fill on a grid: stop at the edges or on water, mark this cell, then recurse into all four directions.",
      starter: `function fill(r, c) {
  if (r < 0 || r >= R || c < 0 || c >= C) return;
  if (grid[r][c] !== "1") return;
  grid[r][c] = "0";
  fill(r + 1, c);
  fill( , c);
  fill(r, );
  fill(r, );
}`,
      rules: {
        regex: ["fill\\s*\\(\\s*r\\s*-\\s*1\\s*,\\s*c\\s*\\)", "fill\\s*\\(\\s*r\\s*,\\s*c\\s*\\+\\s*1\\s*\\)", "fill\\s*\\(\\s*r\\s*,\\s*c\\s*-\\s*1\\s*\\)"],
        hint: "The four neighbours are (r+1, c), (r-1, c), (r, c+1) and (r, c-1).",
        success:
          "Correct. JavaScript gives you about 10000 levels before it throws — more than Python, far less than a large grid needs.",
      },
      solution: `function fill(r, c) {
  if (r < 0 || r >= R || c < 0 || c >= C) return;
  if (grid[r][c] !== "1") return;
  grid[r][c] = "0";
  fill(r + 1, c);
  fill(r - 1, c);
  fill(r, c + 1);
  fill(r, c - 1);
}`,
    },

    rust: {
      example: `fn dfs(u: usize, adj: &Vec<Vec<usize>>, seen: &mut Vec<bool>) {
    seen[u] = true;
    for &v in &adj[u] {
        if !seen[v] { dfs(v, adj, seen); }
    }
}`,
      notes: [
        { token: "seen[u] = true", meaning: "first line — before exploring anything" },
        { token: "&mut Vec<bool>", meaning: "borrowed so it can be changed, and passed down" },
        { token: "if !seen[v]", meaning: "without this, a cycle never ends" },
        { token: "stack overflow", meaning: "Rust crashes rather than throwing. Use an explicit Vec as a stack" },
      ],
      vizCode: `fn dfs(u: usize) {
    seen[u] = true;
    for &v in &adj[u] {
        if !seen[v] { dfs(v); } }
}`,
      prompt:
        "Write flood fill on a grid: stop at the edges or on water, mark this cell, then recurse into all four directions. Indices are usize, so guard before subtracting.",
      starter: `fn fill(r: i64, c: i64, grid: &mut Vec<Vec<u8>>) {
    if r < 0 || r >= R || c < 0 || c >= C { return; }
    if grid[r as usize][c as usize] != b'1' { return; }
    grid[r as usize][c as usize] = b'0';
    fill(r + 1, c, grid);
    fill(, c, grid);
    fill(r, , grid);
    fill(r, , grid);
}`,
      rules: {
        regex: ["fill\\s*\\(\\s*r\\s*-\\s*1\\s*,\\s*c\\s*,", "fill\\s*\\(\\s*r\\s*,\\s*c\\s*\\+\\s*1\\s*,", "fill\\s*\\(\\s*r\\s*,\\s*c\\s*-\\s*1\\s*,"],
        hint: "The four neighbours are (r+1, c), (r-1, c), (r, c+1) and (r, c-1).",
        success:
          "Correct, and note the coordinates are i64 rather than usize on purpose: r - 1 at row 0 has to be allowed to go negative so the guard can catch it.",
      },
      solution: `fn fill(r: i64, c: i64, grid: &mut Vec<Vec<u8>>) {
    if r < 0 || r >= R || c < 0 || c >= C { return; }
    if grid[r as usize][c as usize] != b'1' { return; }
    grid[r as usize][c as usize] = b'0';
    fill(r + 1, c, grid);
    fill(r - 1, c, grid);
    fill(r, c + 1, grid);
    fill(r, c - 1, grid);
}`,
    },
  },

  /* --------------------------------------------------------- dijkstra -- */
  dijkstra: {
    c: {
      example: `/* C has no heap, so either write one or use the O(V^2) version,
   which is fine when the graph is dense. */

for (int step = 0; step < n; step++) {
  int u = -1;
  for (int i = 0; i < n; i++)
    if (!done[i] && (u == -1 || dist[i] < dist[u])) u = i;
  if (u == -1) break;
  done[u] = 1;
  for (int e = 0; e < deg[u]; e++) {
    int v = to[u][e], w = wt[u][e];
    if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
  }
}`,
      notes: [
        { token: "no heap in C", meaning: "the O(V²) scan is the simplest correct version" },
        { token: "dist[u] + w < dist[v]", meaning: "the relaxation step" },
        { token: "done[u] = 1", meaning: "its distance is final and can never improve" },
        { token: "long long", meaning: "sums of weights overflow int on large graphs" },
      ],
      vizCode: `dist[start] = 0;
/* pick the cheapest unfinished node each round */
while (1) {
  int u = cheapestUnfinished();
  if (u == -1) break;
  for (int e = 0; e < deg[u]; e++)
    if (dist[u] + wt[u][e] < dist[to[u][e]]) relax();
}`,
      prompt:
        "Write Dijkstra's relaxation: when the route through u is cheaper, record it.",
      starter: `for (int e = 0; e < deg[u]; e++) {
  int v = to[u][e], w = wt[u][e];
  if ( ) {
    dist[v] = ;
  }
}`,
      rules: {
        regex: ["dist\\[u\\]\\s*\\+\\s*w\\s*<\\s*dist\\[v\\]", "dist\\[v\\]\\s*=\\s*dist\\[u\\]\\s*\\+\\s*w"],
        hint: "Compare dist[u] + w < dist[v]. If it is better, set dist[v] = dist[u] + w.",
        success:
          "Correct. That single comparison is called relaxation, and it is the only place Dijkstra, Bellman–Ford and shortest-path DP genuinely differ.",
      },
      solution: `for (int e = 0; e < deg[u]; e++) {
  int v = to[u][e], w = wt[u][e];
  if (dist[u] + w < dist[v]) {
    dist[v] = dist[u] + w;
  }
}`,
    },

    python: {
      example: `import heapq

dist = [float('inf')] * n
dist[start] = 0
pq = [(0, start)]              # heapq is a MIN-heap — exactly right here

while pq:
    d, u = heapq.heappop(pq)
    if d > dist[u]:
        continue               # a stale entry
    for v, w in adj[u]:
        if d + w < dist[v]:
            dist[v] = d + w
            heapq.heappush(pq, (dist[v], v))`,
      notes: [
        { token: "heapq is a MIN-heap", meaning: "the default is what Dijkstra wants. No reversing needed" },
        { token: "(dist, node) tuples", meaning: "compared left to right, so the distance decides" },
        { token: "if d > dist[u]: continue", meaning: "skip outdated entries instead of deleting them" },
        { token: "d + w < dist[v]", meaning: "the relaxation step" },
      ],
      vizCode: `dist[start] = 0
pq = [(0, start)]
while pq:
    d, u = heapq.heappop(pq)
    if d > dist[u]: continue
    for v, w in adj[u]:
        if d + w < dist[v]: dist[v] = d + w; heapq.heappush(pq, (dist[v], v))`,
      prompt:
        "Write Dijkstra's relaxation: when the route through u is cheaper, record it and push the new distance.",
      starter: `for v, w in adj[u]:
    if :
        dist[v] = 
        heapq.heappush(pq, (dist[v], v))`,
      rules: {
        regex: ["d\\s*\\+\\s*w\\s*<\\s*dist\\[v\\]", "dist\\[v\\]\\s*=\\s*d\\s*\\+\\s*w"],
        hint: "Compare d + w < dist[v]. If it is better, set dist[v] = d + w and push it.",
        success:
          "Correct. Python is the easy case here: heapq is already a min-heap, so Dijkstra needs no reversing tricks — unlike C++ and Rust, whose heaps are max-heaps.",
      },
      solution: `for v, w in adj[u]:
    if d + w < dist[v]:
        dist[v] = d + w
        heapq.heappush(pq, (dist[v], v))`,
    },

    java: {
      example: `long[] dist = new long[n];
Arrays.fill(dist, Long.MAX_VALUE);
PriorityQueue<long[]> pq =
    new PriorityQueue<>((x, y) -> Long.compare(x[0], y[0]));

dist[start] = 0;
pq.add(new long[]{0, start});

while (!pq.isEmpty()) {
  long[] cur = pq.poll();
  long d = cur[0]; int u = (int) cur[1];
  if (d > dist[u]) continue;              // a stale entry
  for (int[] e : adj.get(u)) {
    int v = e[0], w = e[1];
    if (d + w < dist[v]) {
      dist[v] = d + w;
      pq.add(new long[]{dist[v], v});
    }
  }
}`,
      notes: [
        { token: "PriorityQueue is a MIN-heap", meaning: "the default is what Dijkstra wants" },
        { token: "(x, y) -> Long.compare(...)", meaning: "the comparator. Never write x[0] - y[0], which overflows" },
        { token: "if (d > dist[u]) continue", meaning: "skip outdated entries instead of deleting them" },
        { token: "long, not int", meaning: "summed weights pass 2 billion easily" },
      ],
      vizCode: `dist[start] = 0;
pq.add(new long[]{0, start});
while (!pq.isEmpty()) {
  long[] c = pq.poll();
  if (c[0] > dist[(int) c[1]]) continue;
  for (int[] e : adj.get((int) c[1]))
    if (c[0] + e[1] < dist[e[0]]) relax();
}`,
      prompt:
        "Write Dijkstra's relaxation: when the route through u is cheaper, record it and push the new distance.",
      starter: `for (int[] e : adj.get(u)) {
  int v = e[0], w = e[1];
  if ( ) {
    dist[v] = ;
    pq.add(new long[]{dist[v], v});
  }
}`,
      rules: {
        regex: ["d\\s*\\+\\s*w\\s*<\\s*dist\\[v\\]", "dist\\[v\\]\\s*=\\s*d\\s*\\+\\s*w"],
        hint: "Compare d + w < dist[v]. If it is better, set dist[v] = d + w and add it to the queue.",
        success:
          "Correct. One Java-specific warning: write the comparator as Long.compare(x, y), never x - y — subtracting two large longs overflows and the heap then orders them wrongly.",
      },
      solution: `for (int[] e : adj.get(u)) {
  int v = e[0], w = e[1];
  if (d + w < dist[v]) {
    dist[v] = d + w;
    pq.add(new long[]{dist[v], v});
  }
}`,
    },

    javascript: {
      example: `// JavaScript has no heap. Either write one, or for small graphs
// scan for the cheapest unfinished node, which is O(V^2).

const dist = new Array(n).fill(Infinity);
dist[start] = 0;

const pq = new MinHeap();          // your own, see the Heap chapter
pq.push([0, start]);

while (pq.size > 0) {
  const [d, u] = pq.pop();
  if (d > dist[u]) continue;       // a stale entry
  for (const [v, w] of adj[u]) {
    if (d + w < dist[v]) {
      dist[v] = d + w;
      pq.push([dist[v], v]);
    }
  }
}`,
      notes: [
        { token: "no built-in heap", meaning: "this is where the Heap chapter pays off" },
        { token: "Infinity", meaning: "a real value in JavaScript, so it is a clean starting distance" },
        { token: "if (d > dist[u]) continue", meaning: "skip outdated entries instead of deleting them" },
        { token: "sorting the array each time", meaning: "the tempting wrong answer — far slower than a heap" },
      ],
      vizCode: `dist[start] = 0;
pq.push([0, start]);
while (pq.size > 0) {
  const [d, u] = pq.pop();
  if (d > dist[u]) continue;
  for (const [v, w] of adj[u])
    if (d + w < dist[v]) { dist[v] = d + w; pq.push([dist[v], v]); }
}`,
      prompt:
        "Write Dijkstra's relaxation: when the route through u is cheaper, record it and push the new distance.",
      starter: `for (const [v, w] of adj[u]) {
  if ( ) {
    dist[v] = ;
    pq.push([dist[v], v]);
  }
}`,
      rules: {
        regex: ["d\\s*\\+\\s*w\\s*<\\s*dist\\[v\\]", "dist\\[v\\]\\s*=\\s*d\\s*\\+\\s*w"],
        hint: "Compare d + w < dist[v]. If it is better, set dist[v] = d + w and push it.",
        success:
          "Correct. Since JavaScript ships no heap, Dijkstra here means writing the one from the Heap chapter first — which is exactly why that chapter matters.",
      },
      solution: `for (const [v, w] of adj[u]) {
  if (d + w < dist[v]) {
    dist[v] = d + w;
    pq.push([dist[v], v]);
  }
}`,
    },

    rust: {
      example: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

let mut dist = vec![i64::MAX; n];
let mut pq = BinaryHeap::new();

dist[start] = 0;
pq.push(Reverse((0i64, start)));      // Reverse, because BinaryHeap is a MAX-heap

while let Some(Reverse((d, u))) = pq.pop() {
    if d > dist[u] { continue; }      // a stale entry
    for &(v, w) in &adj[u] {
        if d + w < dist[v] {
            dist[v] = d + w;
            pq.push(Reverse((dist[v], v)));
        }
    }
}`,
      notes: [
        { token: "BinaryHeap is a MAX-heap", meaning: "so Dijkstra needs Reverse to turn it round" },
        { token: "Reverse((d, u))", meaning: "wraps the pair so the smallest comes out first" },
        { token: "if d > dist[u] { continue; }", meaning: "skip outdated entries instead of deleting them" },
        { token: "i64::MAX", meaning: "careful — adding to it overflows. Check before you add" },
      ],
      vizCode: `dist[start] = 0;
pq.push(Reverse((0, start)));
while let Some(Reverse((d, u))) = pq.pop() {
    if d > dist[u] { continue; }
    for &(v, w) in &adj[u] {
        if d + w < dist[v] { dist[v] = d + w; pq.push(Reverse((dist[v], v))); } }
}`,
      prompt:
        "Write Dijkstra's relaxation: when the route through u is cheaper, record it and push the new distance.",
      starter: `for &(v, w) in &adj[u] {
    if  {
        dist[v] = ;
        pq.push(Reverse((dist[v], v)));
    }
}`,
      rules: {
        regex: ["d\\s*\\+\\s*w\\s*<\\s*dist\\[v\\]", "dist\\[v\\]\\s*=\\s*d\\s*\\+\\s*w"],
        hint: "Compare d + w < dist[v]. If it is better, set dist[v] = d + w and push it.",
        success:
          "Correct. Remember the Reverse wrapper: Rust's BinaryHeap is a max-heap, so without it Dijkstra would take the most expensive node first and give wrong answers.",
      },
      solution: `for &(v, w) in &adj[u] {
    if d + w < dist[v] {
        dist[v] = d + w;
        pq.push(Reverse((dist[v], v)));
    }
}`,
    },
  },

  /* ------------------------------------------------------------- topo -- */
  topo: {
    c: {
      example: `int indeg[MAXN] = {0};
for (int u = 0; u < n; u++)
  for (int e = 0; e < deg[u]; e++) indeg[adj[u][e]]++;

int q[MAXN], head = 0, tail = 0;
for (int i = 0; i < n; i++) if (indeg[i] == 0) q[tail++] = i;

while (head < tail) {
  int u = q[head++];
  order[cnt++] = u;
  for (int e = 0; e < deg[u]; e++)
    if (--indeg[adj[u][e]] == 0) q[tail++] = adj[u][e];
}
/* cnt < n means the graph has a cycle */`,
      notes: [
        { token: "indeg[v]++", meaning: "count the arrows pointing in" },
        { token: "start with indegree 0", meaning: "nothing is blocking those" },
        { token: "--indeg[v] == 0", meaning: "reduce and test in one step" },
        { token: "cnt < n", meaning: "the cycle check. Nothing else is needed" },
      ],
      vizCode: `for each node: indeg[v] = number of prerequisites
queue every node with indeg 0
while queue not empty:
  u = pop; output u
  for v in adj[u]: if (--indeg[v] == 0) push v`,
      starter: `while (head < tail) {
  int u = q[head++];
  order[cnt++] = u;
  for (int e = 0; e < deg[u]; e++) {
    int v = adj[u][e];
    if ( ) q[tail++] = v;
  }
}`,
      rules: {
        regex: ["--indeg\\s*\\[\\s*v\\s*\\]\\s*==\\s*0"],
        hint: "Write if (--indeg[v] == 0) — the pre-decrement reduces it and then tests the new value.",
        success:
          "Correct. The pre-decrement matters: indeg[v]-- == 0 tests the value BEFORE subtracting, which is off by one.",
      },
      solution: `while (head < tail) {
  int u = q[head++];
  order[cnt++] = u;
  for (int e = 0; e < deg[u]; e++) {
    int v = adj[u][e];
    if (--indeg[v] == 0) q[tail++] = v;
  }
}`,
    },

    python: {
      example: `from collections import deque

indeg = [0] * n
for u in range(n):
    for v in adj[u]:
        indeg[v] += 1

q = deque(i for i in range(n) if indeg[i] == 0)
order = []

while q:
    u = q.popleft()
    order.append(u)
    for v in adj[u]:
        indeg[v] -= 1
        if indeg[v] == 0:
            q.append(v)

# len(order) < n means the graph has a cycle`,
      notes: [
        { token: "indeg[v] += 1", meaning: "count the arrows pointing in" },
        { token: "start with indegree 0", meaning: "nothing is blocking those" },
        { token: "no --x in Python", meaning: "subtract, then test on the next line" },
        { token: "len(order) < n", meaning: "the cycle check. Nothing else is needed" },
      ],
      vizCode: `# indeg[v] = number of prerequisites
q = deque(i for i in range(n) if indeg[i] == 0)
while q:
    u = q.popleft(); order.append(u)
    for v in adj[u]: indeg[v] -= 1; q.append(v) if indeg[v] == 0 else None`,
      prompt:
        "Complete Kahn's algorithm: reduce each neighbour's count and queue it the moment it reaches zero.",
      starter: `while q:
    u = q.popleft()
    order.append(u)
    for v in adj[u]:
        
        if :
            q.append(v)`,
      rules: {
        regex: ["indeg\\[v\\]\\s*-=\\s*1", "indeg\\[v\\]\\s*==\\s*0"],
        hint: "Write indeg[v] -= 1 on its own line, then if indeg[v] == 0: q.append(v).",
        success:
          "Correct. Python has no -- operator, so the reduce and the test are two separate steps — which is arguably clearer than C's combined form.",
      },
      solution: `while q:
    u = q.popleft()
    order.append(u)
    for v in adj[u]:
        indeg[v] -= 1
        if indeg[v] == 0:
            q.append(v)`,
    },

    java: {
      example: `int[] indeg = new int[n];
for (int u = 0; u < n; u++)
  for (int v : adj.get(u)) indeg[v]++;

Queue<Integer> q = new ArrayDeque<>();
for (int i = 0; i < n; i++) if (indeg[i] == 0) q.add(i);

List<Integer> order = new ArrayList<>();
while (!q.isEmpty()) {
  int u = q.poll();
  order.add(u);
  for (int v : adj.get(u))
    if (--indeg[v] == 0) q.add(v);
}
// order.size() < n means the graph has a cycle`,
      notes: [
        { token: "indeg[v]++", meaning: "count the arrows pointing in" },
        { token: "start with indegree 0", meaning: "nothing is blocking those" },
        { token: "--indeg[v] == 0", meaning: "reduce and test in one step" },
        { token: "order.size() < n", meaning: "the cycle check. Nothing else is needed" },
      ],
      vizCode: `// indeg[v] = number of prerequisites
for (int i = 0; i < n; i++) if (indeg[i] == 0) q.add(i);
while (!q.isEmpty()) {
  int u = q.poll(); order.add(u);
  for (int v : adj.get(u)) if (--indeg[v] == 0) q.add(v);
}`,
      starter: `while (!q.isEmpty()) {
  int u = q.poll();
  order.add(u);
  for (int v : adj.get(u)) {
    if ( ) q.add(v);
  }
}`,
      rules: {
        regex: ["--indeg\\s*\\[\\s*v\\s*\\]\\s*==\\s*0"],
        hint: "Write if (--indeg[v] == 0) q.add(v); — the pre-decrement reduces it and then tests the new value.",
        success:
          "Correct. Java keeps C's pre-decrement, so the reduce and the test fit in one expression — just be sure it is --indeg[v] and not indeg[v]--.",
      },
      solution: `while (!q.isEmpty()) {
  int u = q.poll();
  order.add(u);
  for (int v : adj.get(u)) {
    if (--indeg[v] == 0) q.add(v);
  }
}`,
    },

    javascript: {
      example: `const indeg = new Array(n).fill(0);
for (let u = 0; u < n; u++)
  for (const v of adj[u]) indeg[v]++;

const q = [];
for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i);

let head = 0;
const order = [];
while (head < q.length) {
  const u = q[head++];
  order.push(u);
  for (const v of adj[u])
    if (--indeg[v] === 0) q.push(v);
}
// order.length < n means the graph has a cycle`,
      notes: [
        { token: "indeg[v]++", meaning: "count the arrows pointing in" },
        { token: "head++, not shift()", meaning: "keeps the pop O(1)" },
        { token: "--indeg[v] === 0", meaning: "reduce and test in one step" },
        { token: "order.length < n", meaning: "the cycle check. Nothing else is needed" },
      ],
      vizCode: `// indeg[v] = number of prerequisites
for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i);
while (head < q.length) {
  const u = q[head++]; order.push(u);
  for (const v of adj[u]) if (--indeg[v] === 0) q.push(v);
}`,
      prompt:
        "Complete Kahn's algorithm: reduce each neighbour's count and queue it the moment it reaches zero.",
      starter: `while (head < q.length) {
  const u = q[head++];
  order.push(u);
  for (const v of adj[u]) {
    if ( ) q.push(v);
  }
}`,
      rules: {
        regex: ["--indeg\\s*\\[\\s*v\\s*\\]\\s*===?\\s*0"],
        hint: "Write if (--indeg[v] === 0) q.push(v); — the pre-decrement reduces it and then tests the new value.",
        success:
          "Correct. Note the head index again rather than shift() — the same O(1) versus O(n) point as in BFS.",
      },
      solution: `while (head < q.length) {
  const u = q[head++];
  order.push(u);
  for (const v of adj[u]) {
    if (--indeg[v] === 0) q.push(v);
  }
}`,
    },

    rust: {
      example: `let mut indeg = vec![0usize; n];
for u in 0..n {
    for &v in &adj[u] { indeg[v] += 1; }
}

let mut q: VecDeque<usize> =
    (0..n).filter(|&i| indeg[i] == 0).collect();
let mut order = Vec::new();

while let Some(u) = q.pop_front() {
    order.push(u);
    for &v in &adj[u] {
        indeg[v] -= 1;
        if indeg[v] == 0 { q.push_back(v); }
    }
}
// order.len() < n means the graph has a cycle`,
      notes: [
        { token: "indeg[v] += 1", meaning: "count the arrows pointing in" },
        { token: "no -- in Rust", meaning: "subtract, then test on the next line" },
        { token: ".filter(...).collect()", meaning: "builds the starting queue in one expression" },
        { token: "order.len() < n", meaning: "the cycle check. Nothing else is needed" },
      ],
      vizCode: `// indeg[v] = number of prerequisites
let mut q: VecDeque<usize> = (0..n).filter(|&i| indeg[i]==0).collect();
while let Some(u) = q.pop_front() {
    order.push(u);
    for &v in &adj[u] { indeg[v] -= 1; if indeg[v] == 0 { q.push_back(v); } }
}`,
      prompt:
        "Complete Kahn's algorithm: reduce each neighbour's count and queue it the moment it reaches zero.",
      starter: `while let Some(u) = q.pop_front() {
    order.push(u);
    for &v in &adj[u] {
        ;
        if  { q.push_back(v); }
    }
}`,
      rules: {
        regex: ["indeg\\[v\\]\\s*-=\\s*1", "indeg\\[v\\]\\s*==\\s*0"],
        hint: "Write indeg[v] -= 1; then if indeg[v] == 0 { q.push_back(v); }.",
        success:
          "Correct. Rust has no -- operator either — and with usize counts that is just as well, since going below zero would stop the program.",
      },
      solution: `while let Some(u) = q.pop_front() {
    order.push(u);
    for &v in &adj[u] {
        indeg[v] -= 1;
        if indeg[v] == 0 { q.push_back(v); }
    }
}`,
    },
  },

  /* -------------------------------------------------------------- dsu -- */
  dsu: {
    c: {
      example: `int parent[MAXN], rnk[MAXN];

int find(int x) {
  if (parent[x] != x) parent[x] = find(parent[x]);   /* path compression */
  return parent[x];
}

int unite(int a, int b) {
  a = find(a); b = find(b);
  if (a == b) return 0;               /* already together */
  if (rnk[a] < rnk[b]) { int t = a; a = b; b = t; }
  parent[b] = a;
  if (rnk[a] == rnk[b]) rnk[a]++;
  return 1;
}`,
      notes: [
        { token: "parent[x] = find(...)", meaning: "path compression, in one line" },
        { token: "a == b", meaning: "already in the same group. In Kruskal, this edge makes a cycle" },
        { token: "union by rank", meaning: "keeps the trees shallow" },
        { token: "recursion depth", meaning: "a long chain can be deep. An iterative find avoids it" },
      ],
      vizCode: `int find(int x) {
  if (parent[x] != x) parent[x] = find(parent[x]);
  return parent[x];
}
void unite(int a, int b) { parent[find(a)] = find(b); }`,
      starter: `int find(int x) {
  if (parent[x] != x) ;
  return parent[x];
}`,
      rules: {
        regex: ["parent\\s*\\[\\s*x\\s*\\]\\s*=\\s*find\\s*\\(\\s*parent\\s*\\[\\s*x\\s*\\]\\s*\\)"],
        hint: "Write parent[x] = find(parent[x]); — it finds the boss and stores it on the way back up.",
        success:
          "Correct. That one assignment flattens the whole path it walked, which is why repeated lookups become effectively constant time.",
      },
      solution: `int find(int x) {
  if (parent[x] != x) parent[x] = find(parent[x]);
  return parent[x];
}`,
    },

    python: {
      example: `parent = list(range(n))
rank = [0] * n

def find(x):
    if parent[x] != x:
        parent[x] = find(parent[x])   # path compression
    return parent[x]


def unite(a, b):
    a, b = find(a), find(b)
    if a == b:
        return False                  # already together
    if rank[a] < rank[b]:
        a, b = b, a
    parent[b] = a
    if rank[a] == rank[b]:
        rank[a] += 1
    return True`,
      notes: [
        { token: "list(range(n))", meaning: "everyone starts as their own boss" },
        { token: "parent[x] = find(parent[x])", meaning: "path compression, in one line" },
        { token: "recursion limit", meaning: "a long chain can exceed 1000. An iterative find is safer" },
        { token: "a == b", meaning: "already in the same group. In Kruskal, this edge makes a cycle" },
      ],
      vizCode: `def find(x):
    if parent[x] != x: parent[x] = find(parent[x])
    return parent[x]

def unite(a, b): parent[find(a)] = find(b)`,
      prompt:
        "Write find with path compression: when a node is not its own boss, re-point it straight at the boss.",
      starter: `def find(x):
    if parent[x] != x:
        
    return parent[x]`,
      rules: {
        regex: ["parent\\s*\\[\\s*x\\s*\\]\\s*=\\s*find\\s*\\(\\s*parent\\s*\\[\\s*x\\s*\\]\\s*\\)"],
        hint: "Write parent[x] = find(parent[x]) — it finds the boss and stores it on the way back up.",
        success:
          "Correct. Without union by rank the chains can grow long enough to hit Python's recursion limit, so use both improvements together, or write find as a loop.",
      },
      solution: `def find(x):
    if parent[x] != x:
        parent[x] = find(parent[x])
    return parent[x]`,
    },

    java: {
      example: `int[] parent = new int[n], rank = new int[n];
for (int i = 0; i < n; i++) parent[i] = i;

static int find(int x) {
  if (parent[x] != x) parent[x] = find(parent[x]);   // path compression
  return parent[x];
}

static boolean unite(int a, int b) {
  a = find(a); b = find(b);
  if (a == b) return false;            // already together
  if (rank[a] < rank[b]) { int t = a; a = b; b = t; }
  parent[b] = a;
  if (rank[a] == rank[b]) rank[a]++;
  return true;
}`,
      notes: [
        { token: "parent[i] = i", meaning: "everyone starts as their own boss. A new int[] is all zeros" },
        { token: "parent[x] = find(parent[x])", meaning: "path compression, in one line" },
        { token: "a == b", meaning: "already in the same group. In Kruskal, this edge makes a cycle" },
        { token: "union by rank", meaning: "keeps the trees shallow" },
      ],
      vizCode: `static int find(int x) {
  if (parent[x] != x) parent[x] = find(parent[x]);
  return parent[x];
}
static void unite(int a, int b) { parent[find(a)] = find(b); }`,
      starter: `static int find(int x) {
  if (parent[x] != x) ;
  return parent[x];
}`,
      rules: {
        regex: ["parent\\s*\\[\\s*x\\s*\\]\\s*=\\s*find\\s*\\(\\s*parent\\s*\\[\\s*x\\s*\\]\\s*\\)"],
        hint: "Write parent[x] = find(parent[x]); — it finds the boss and stores it on the way back up.",
        success:
          "Correct. Remember the setup loop: a new int[] is full of zeros, so without parent[i] = i every element would think node 0 is its boss.",
      },
      solution: `static int find(int x) {
  if (parent[x] != x) parent[x] = find(parent[x]);
  return parent[x];
}`,
    },

    javascript: {
      example: `const parent = Array.from({ length: n }, (_, i) => i);
const rank = new Array(n).fill(0);

function find(x) {
  if (parent[x] !== x) parent[x] = find(parent[x]);   // path compression
  return parent[x];
}

function unite(a, b) {
  a = find(a); b = find(b);
  if (a === b) return false;           // already together
  if (rank[a] < rank[b]) [a, b] = [b, a];
  parent[b] = a;
  if (rank[a] === rank[b]) rank[a]++;
  return true;
}`,
      notes: [
        { token: "Array.from({length: n}, (_, i) => i)", meaning: "everyone starts as their own boss" },
        { token: "parent[x] = find(parent[x])", meaning: "path compression, in one line" },
        { token: "a === b", meaning: "already in the same group. In Kruskal, this edge makes a cycle" },
        { token: "union by rank", meaning: "keeps the chains short enough to avoid deep recursion" },
      ],
      vizCode: `function find(x) {
  if (parent[x] !== x) parent[x] = find(parent[x]);
  return parent[x];
}
function unite(a, b) { parent[find(a)] = find(b); }`,
      prompt:
        "Write find with path compression: when a node is not its own boss, re-point it straight at the boss.",
      starter: `function find(x) {
  if (parent[x] !== x) ;
  return parent[x];
}`,
      rules: {
        regex: ["parent\\s*\\[\\s*x\\s*\\]\\s*=\\s*find\\s*\\(\\s*parent\\s*\\[\\s*x\\s*\\]\\s*\\)"],
        hint: "Write parent[x] = find(parent[x]); — it finds the boss and stores it on the way back up.",
        success:
          "Correct. Array.from with an index function is the tidy way to build [0, 1, 2, ...] — new Array(n).fill(0) would make everyone think node 0 is the boss.",
      },
      solution: `function find(x) {
  if (parent[x] !== x) parent[x] = find(parent[x]);
  return parent[x];
}`,
    },

    rust: {
      example: `struct Dsu { parent: Vec<usize>, rank: Vec<usize> }

impl Dsu {
    fn find(&mut self, x: usize) -> usize {
        if self.parent[x] != x {
            let root = self.find(self.parent[x]);   // path compression
            self.parent[x] = root;
        }
        self.parent[x]
    }
}`,
      notes: [
        { token: "&mut self", meaning: "find changes the structure, so it needs a mutable borrow" },
        { token: "let root = ...; then assign", meaning: "Rust will not let you borrow while assigning in one line" },
        { token: "(0..n).collect()", meaning: "everyone starts as their own boss" },
        { token: "self.parent[x]", meaning: "last line, no semicolon — this is the value handed back" },
      ],
      vizCode: `fn find(&mut self, x: usize) -> usize {
    if self.parent[x] != x {
        let r = self.find(self.parent[x]);
        self.parent[x] = r; }
    self.parent[x]
}`,
      prompt:
        "Write find with path compression. Rust will not allow the one-line version, so store the root first, then assign it.",
      starter: `fn find(&mut self, x: usize) -> usize {
    if self.parent[x] != x {
        let root = ;
        self.parent[x] = root;
    }
    self.parent[x]
}`,
      rules: {
        regex: ["root\\s*=\\s*self\\.find\\s*\\(\\s*self\\.parent\\[x\\]\\s*\\)"],
        hint: "Write let root = self.find(self.parent[x]); then assign it on the next line.",
        success:
          "Correct, and the two lines are forced. self.parent[x] = self.find(self.parent[x]) borrows self mutably while already reading it, so Rust rejects it — the temporary is the way round.",
      },
      solution: `fn find(&mut self, x: usize) -> usize {
    if self.parent[x] != x {
        let root = self.find(self.parent[x]);
        self.parent[x] = root;
    }
    self.parent[x]
}`,
    },
  },
};
