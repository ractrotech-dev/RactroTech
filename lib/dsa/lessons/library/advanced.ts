import type { TopicLesson } from "@/lib/dsa/lessons/types";
import {
  traceActivitySelection,
  traceBellmanFord,
  traceBfs,
  traceClimbStairs,
  traceDfs,
  traceDijkstra,
  traceDsu,
  traceGraphRepr,
  traceKnapsack,
  traceLcs,
  traceNQueens,
  tracePrim,
  traceSubsets,
  traceTopoSort,
} from "@/lib/dsa/viz/traceGraphs";

export const GRAPH: TopicLesson = {
  id: "graph",
  title: "Graph",
  tagline: "Dots and links — and almost everything turns out to be one.",
  why:
    "Graphs are the most general structure here, and the hardest part is never the algorithm. It is noticing that a problem is a graph at all. A grid is a graph. Course prerequisites are a graph. The states of a puzzle are a graph. Once you decide what a node is and what an edge means, the standard algorithms apply unchanged.",
  plain: [
    "A graph is a set of nodes and the links between them, called edges.",
    "Directed means the links are one-way; undirected means they go both ways. Weighted means each edge has a cost.",
    "The usual storage is an adjacency list: for each node, a list of its neighbours. That is small and fast for the sparse graphs you actually meet.",
    "Two traversals cover most problems. BFS spreads out in rings using a queue. DFS dives deep using recursion.",
  ],
  needs: ["Queues, for BFS.", "Recursion, for DFS.", "Heaps, for Dijkstra."],
  costs: [
    { what: "BFS / DFS", time: "O(V + E)", note: "Each node and edge is touched once." },
    { what: "Shortest path, all edges cost 1", time: "O(V + E)", note: "BFS. Do not use Dijkstra here." },
    { what: "Dijkstra", time: "O(E log V)", note: "Positive weights only." },
    { what: "Bellman–Ford", time: "O(V·E)", note: "Handles negative edges, and detects negative cycles." },
    { what: "Floyd–Warshall", time: "O(V³)", note: "All pairs. Only usable up to about V = 400." },
    { what: "Union–Find", time: "≈O(1) amortised", note: "With path compression and union by rank." },
    { what: "Prim's MST", time: "O(E log V)", note: "Grows one tree. Better on dense graphs." },
    { what: "Kruskal's MST", time: "O(E log E)", note: "Sorts every edge, joins with DSU. Better on sparse graphs." },
    { what: "Adjacency list", time: "O(V + E) memory", note: "What you almost always want." },
    { what: "Adjacency matrix", time: "O(V²) memory", note: "Only for dense graphs, or when you need O(1) edge lookups." },
  ],
  traps: [
    "Mark a node as visited when you push it into the queue, not when you pop it. Otherwise the same node enters several times and BFS degrades badly.",
    "BFS gives shortest paths only when every edge costs the same. With weights, use Dijkstra.",
    "Dijkstra is wrong with negative edges — a locked-in node can turn out to be improvable. Use Bellman–Ford.",
    "Recursive DFS on 10⁵ nodes can overflow the call stack. Use an explicit stack when depth is a genuine risk.",
    "In an undirected graph, add both directions when building the adjacency list. Forgetting is a silent, confusing bug.",
    "An adjacency matrix on 10⁵ nodes is 10¹⁰ cells — far beyond any memory. Use a list unless the graph is genuinely dense.",
    "Bellman–Ford needs V−1 rounds, not V. Running V rounds is harmless; running fewer gives wrong answers on long paths.",
    "Prim's and Kruskal's both need the graph to be connected. On a disconnected graph they build a spanning FOREST, not a tree.",
  ],
  sections: [
    {
      id: "repr",
      kicker: "01",
      title: "Writing a graph down",
      hook:
        "Six cities and the roads between them. Before any algorithm can run, that picture has to become data in memory. There are two standard ways, and picking wrong can cost you gigabytes.",
      body: [
        "The first is an adjacency matrix: an n by n grid where cell [u][v] is 1 when there is an edge from u to v, and 0 when there is not.",
        "It is simple, and asking 'is A joined to C?' is one lookup — O(1). Nothing beats that.",
        "But every cell costs memory whether there is an edge or not. That is O(V²), always. Six nodes need 36 cells to hold 16 edges; a million nodes would need a million million cells.",
        "The second is an adjacency list: for each node, store only the neighbours it actually has. A keeps a list holding B and D, and nothing else.",
        "That is O(V + E) memory. A million nodes with five edges each is five million entries rather than 10¹² cells.",
        "The trade is the lookup. With a list, 'is A joined to C?' means walking A's neighbours — O(degree), not O(1).",
        "Almost every real graph is sparse, so lists win almost every time, and every algorithm in this chapter assumes one. Reach for a matrix only when the graph is genuinely dense, or when Floyd–Warshall wants one.",
        "One more thing that catches everyone: in an UNDIRECTED graph you must add both directions. Push v onto adj[u] and u onto adj[v]. Forget the second and half your edges quietly vanish.",
      ],
      viz: traceGraphRepr(),
      example: `// adjacency matrix — O(V²) memory, O(1) lookup
vector<vector<bool>> m(V, vector<bool>(V, false));
m[u][v] = true;
m[v][u] = true;                 // undirected: BOTH

// adjacency list — O(V + E) memory, O(degree) lookup
vector<vector<int>> adj(V);
adj[u].push_back(v);
adj[v].push_back(u);            // undirected: BOTH

// weighted: store the cost alongside the neighbour
vector<vector<pair<int,int>>> adjW(V);
adjW[u].push_back({v, w});`,
      notes: [
        { token: "m[u][v]", meaning: "matrix — one cell per possible edge, most of them empty" },
        { token: "adj[u].push_back(v)", meaning: "list — one entry per real edge" },
        { token: "both directions", meaning: "undirected means you add it twice. Forgetting is a silent bug" },
        { token: "pair<int,int>", meaning: "for weighted graphs: the neighbour and the cost" },
      ],
      challenge: {
        prompt:
          "Build an adjacency list for an UNDIRECTED graph. Read an edge between u and v, and record it so that both nodes know about it.",
        starter: `vector<vector<int>> adj(V);

for (int e = 0; e < E; e++) {
  int u, v;
  cin >> u >> v;
  ;
  ;
}`,
        rules: {
          regex: ["adj\\s*\\[\\s*u\\s*\\]\\.push_back\\s*\\(\\s*v\\s*\\)", "adj\\s*\\[\\s*v\\s*\\]\\.push_back\\s*\\(\\s*u\\s*\\)"],
          hint: "Add it both ways: adj[u].push_back(v); and adj[v].push_back(u);",
          success:
            "Correct. Miss the second line and the graph becomes directed without you noticing — BFS then reports nodes as unreachable when they are perfectly reachable the other way.",
        },
        solution: `vector<vector<int>> adj(V);

for (int e = 0; e < E; e++) {
  int u, v;
  cin >> u >> v;
  adj[u].push_back(v);
  adj[v].push_back(u);
}`,
      },
    },
    {
      id: "bfs",
      kicker: "02",
      title: "BFS spreads out in rings",
      hook:
        "Find the fewest moves from A to F. Why does using a queue guarantee the answer is shortest, when using a stack does not?",
      body: [
        "Because a queue is fair. Everything one step away enters the queue before anything two steps away, so it also leaves first.",
        "So nodes come out in order of distance from the start. The first time you reach a node, you have reached it by the shortest route — nothing later can beat it.",
        "Mark a node as seen the moment you push it, not when you pop it. Marking on pop lets the same node be queued several times before it is ever processed.",
        "Record the distance as you go: dist[neighbour] = dist[current] + 1.",
        "Each node enters the queue once and each edge is examined once, so BFS is O(V + E).",
        "This only gives shortest paths when every edge costs the same. Grid problems where each move costs 1 are the classic case, and it is why 'shortest path in a maze' is a BFS problem, not a Dijkstra problem.",
      ],
      viz: traceBfs("A"),
      example: `vector<int> bfs(int start, vector<vector<int>>& adj) {
  int n = adj.size();
  vector<int> dist(n, -1);
  queue<int> q;

  dist[start] = 0;
  q.push(start);

  while (!q.empty()) {
    int u = q.front(); q.pop();
    for (int v : adj[u]) {
      if (dist[v] != -1) continue;     // already seen
      dist[v] = dist[u] + 1;           // mark on PUSH
      q.push(v);
    }
  }
  return dist;
}`,
      notes: [
        { token: "dist[v] != -1", meaning: "−1 doubles as 'not visited'" },
        { token: "mark on push", meaning: "not on pop — this is the classic bug" },
        { token: "dist[u] + 1", meaning: "every edge costs the same, which is why this works" },
      ],
      challenge: {
        prompt:
          "Write the BFS neighbour loop: skip anything already seen, set its distance, and queue it.",
        starter: `while (!q.empty()) {
  int u = q.front(); q.pop();
  for (int v : adj[u]) {
    if ( ) continue;
    dist[v] = ;
    q.push(v);
  }
}`,
        rules: {
          regex: ["dist\\[v\\]\\s*!=\\s*-1", "dist\\[v\\]\\s*=\\s*dist\\[u\\]\\s*\\+\\s*1"],
          hint: "Skip when dist[v] != -1. Otherwise dist[v] = dist[u] + 1 and push v.",
          success:
            "Correct. Setting the distance at push time is what marks the node as seen — the two jobs are done by the same line.",
        },
        solution: `while (!q.empty()) {
  int u = q.front(); q.pop();
  for (int v : adj[u]) {
    if (dist[v] != -1) continue;
    dist[v] = dist[u] + 1;
    q.push(v);
  }
}`,
      },
    },
    {
      id: "dfs",
      kicker: "03",
      title: "DFS dives deep",
      hook:
        "Count the separate islands in a grid of land and water. You do not need shortest paths — you need to know what is connected to what. Which traversal fits?",
      body: [
        "Either works for connectivity, but DFS is usually shorter to write, because recursion handles the bookkeeping for you.",
        "DFS commits to one path and follows it as far as it goes, then backs up and tries the alternatives.",
        "The visited check is not an optimisation — it is what stops a cycle looping forever.",
        "For counting components: loop over all nodes, and each time you find an unvisited one, start a fresh DFS and add one to the count. That DFS marks the entire component.",
        "DFS does not give shortest paths. What it does give is the right shape for cycle detection, topological order, connected components and flood fill.",
        "The call stack is the hidden cost. At 10⁵ nodes deep, recursion can crash — rewrite with an explicit stack when that is a real possibility.",
      ],
      viz: traceDfs("A"),
      example: `void dfs(int u, vector<vector<int>>& adj, vector<bool>& seen) {
  seen[u] = true;
  for (int v : adj[u])
    if (!seen[v]) dfs(v, adj, seen);
}

// count connected components
int components = 0;
for (int i = 0; i < n; i++)
  if (!seen[i]) { dfs(i, adj, seen); components++; }`,
      notes: [
        { token: "seen[u] = true", meaning: "first line — before exploring anything" },
        { token: "if (!seen[v])", meaning: "without this, a cycle never ends" },
        { token: "the outer loop", meaning: "reaches components not connected to the first node" },
      ],
      challenge: {
        prompt:
          "Write flood fill on a grid: stop at the edges or on water, mark this cell, then recurse into all four directions.",
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
            "Correct. Setting the cell to '0' is what marks it visited — no separate seen array is needed, because sunk land can never be re-entered.",
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
    },
    {
      id: "dijkstra",
      kicker: "04",
      title: "Dijkstra when edges cost different amounts",
      hook:
        "A route with two long roads may beat a route with three short ones. BFS counts moves, so it would pick the wrong one. What has to change?",
      body: [
        "Instead of processing nodes in the order they were found, always process the cheapest unfinished node next. A min-heap gives you that in O(log V).",
        "When a node comes out of the heap as the cheapest remaining, its distance is final. Nothing can improve it — every other route already costs at least that much before it even gets there.",
        "For each neighbour, check whether going through the current node is cheaper than the best known. If so, update it and push the new distance.",
        "The same distance value can be pushed several times. That is fine — skip an entry when the popped distance is worse than the recorded one.",
        "The correctness argument depends entirely on costs never being negative. A negative edge could make an already-finalised node improvable, which breaks the whole thing. For that case, use Bellman–Ford.",
      ],
      viz: traceDijkstra("A"),
      example: `vector<long long> dijkstra(int start, vector<vector<pair<int,int>>>& adj) {
  int n = adj.size();
  vector<long long> dist(n, LLONG_MAX);
  priority_queue<pair<long long,int>,
                 vector<pair<long long,int>>,
                 greater<>> pq;          // min-heap

  dist[start] = 0;
  pq.push({0, start});

  while (!pq.empty()) {
    auto [d, u] = pq.top(); pq.pop();
    if (d > dist[u]) continue;           // a stale entry
    for (auto [v, w] : adj[u])
      if (d + w < dist[v]) {
        dist[v] = d + w;
        pq.push({dist[v], v});
      }
  }
  return dist;
}`,
      notes: [
        { token: "greater<>", meaning: "makes it a min-heap — the default is a max-heap" },
        { token: "if (d > dist[u]) continue", meaning: "skip outdated entries instead of deleting them" },
        { token: "d + w < dist[v]", meaning: "the relaxation step" },
        { token: "positive weights only", meaning: "negative edges break the finality argument" },
      ],
      challenge: {
        prompt:
          "Write Dijkstra's relaxation: when the route through u is cheaper, record it and push the new distance.",
        starter: `for (auto [v, w] : adj[u]) {
  if ( ) {
    dist[v] = ;
    pq.push({dist[v], v});
  }
}`,
        rules: {
          regex: ["d\\s*\\+\\s*w\\s*<\\s*dist\\[v\\]", "dist\\[v\\]\\s*=\\s*d\\s*\\+\\s*w"],
          hint: "Compare d + w < dist[v]. If it is better, set dist[v] = d + w and push it.",
          success:
            "Correct. That single comparison is called relaxation, and it is the only place Dijkstra, Bellman–Ford and shortest-path DP genuinely differ — in when and how often it is applied.",
        },
        solution: `for (auto [v, w] : adj[u]) {
  if (d + w < dist[v]) {
    dist[v] = d + w;
    pq.push({dist[v], v});
  }
}`,
      },
    },
    {
      id: "bellman",
      kicker: "05",
      title: "Bellman–Ford",
      hook:
        "A currency exchange where some trades gain you money. Dijkstra gives the wrong answer here, and confidently. What breaks — and what do you use instead?",
      body: [
        "Dijkstra's whole argument is that the cheapest unfinished node can never improve. A negative edge destroys that: a later, cheaper route can appear after you have already locked a node in.",
        "Bellman–Ford gives up the clever ordering entirely. It just relaxes every edge, over and over.",
        "One round means: go through all E edges once and improve whatever can be improved. Do that V−1 times.",
        "Why V−1? A shortest path can use at most V−1 edges, since a longer one would repeat a node. Each round settles at least one more edge of every shortest path, so V−1 rounds are always enough.",
        "That gives O(V · E) — much slower than Dijkstra's O(E log V). You pay it only when you have to.",
        "The bonus is real though. Run one extra round: if anything still improves, there is a negative cycle — a loop you can go round forever getting cheaper, so no shortest path exists. Dijkstra cannot detect that at all.",
        "In practice you can stop early. If a full round changes nothing, no later round can either.",
      ],
      viz: traceBellmanFord("A"),
      example: `vector<long long> dist(V, LLONG_MAX);
dist[start] = 0;

for (int round = 1; round < V; round++)
  for (auto [u, v, w] : edges)
    if (dist[u] != LLONG_MAX && dist[u] + w < dist[v])
      dist[v] = dist[u] + w;

// one more round — anything still improving means a negative cycle
for (auto [u, v, w] : edges)
  if (dist[u] != LLONG_MAX && dist[u] + w < dist[v])
    return NEGATIVE_CYCLE;`,
      notes: [
        { token: "round < V", meaning: "V−1 rounds. A shortest path has at most V−1 edges" },
        { token: "dist[u] != LLONG_MAX", meaning: "never relax from a node you cannot reach — it would overflow" },
        { token: "the extra round", meaning: "the negative-cycle check, which Dijkstra cannot do" },
        { token: "O(V · E)", meaning: "the price of dropping the ordering" },
      ],
      challenge: {
        prompt:
          "Write the Bellman–Ford relaxation loop. Do V−1 rounds, and guard against relaxing from an unreachable node.",
        starter: `for (int round = 1; round < ; round++)
  for (auto [u, v, w] : edges)
    if ( && dist[u] + w < dist[v])
      dist[v] = ;`,
        rules: {
          regex: ["round\\s*<\\s*V", "dist\\[u\\]\\s*!=\\s*LLONG_MAX|dist\\[u\\]\\s*<\\s*LLONG_MAX|dist\\[u\\]\\s*!=\\s*INF", "dist\\[v\\]\\s*=\\s*dist\\[u\\]\\s*\\+\\s*w"],
          hint:
            "Loop while round < V — that is V−1 rounds. Guard with dist[u] != LLONG_MAX before relaxing, then dist[v] = dist[u] + w.",
          success:
            "Correct, and the guard is not cosmetic: LLONG_MAX + w overflows and wraps to a large negative number, which then looks like a wonderful shortcut and poisons the whole answer.",
        },
        solution: `for (int round = 1; round < V; round++)
  for (auto [u, v, w] : edges)
    if (dist[u] != LLONG_MAX && dist[u] + w < dist[v])
      dist[v] = dist[u] + w;`,
      },
    },
    {
      id: "topo",
      kicker: "06",
      title: "Topological order",
      hook:
        "Courses with prerequisites. Find an order you can actually take them in — or prove that no such order exists. Where do you start?",
      body: [
        "With whatever has no prerequisites at all. Count, for each node, how many arrows point into it. That is its indegree.",
        "Put every node with indegree 0 into a queue. Those can be taken right now.",
        "Take one out, add it to the answer, and reduce the indegree of everything it points at. If any of those drop to 0, they have become available — queue them.",
        "Carry on until the queue is empty. That is Kahn's algorithm, and it is O(V + E).",
        "If the answer contains fewer than all the nodes, some indegree never reached 0 — which means there is a cycle, and the requirements are impossible to satisfy.",
        "So the same run answers both questions: give me a valid order, and tell me whether one exists.",
      ],
      viz: traceTopoSort(),
      example: `vector<int> topoSort(int n, vector<vector<int>>& adj) {
  vector<int> indeg(n, 0), order;
  for (int u = 0; u < n; u++)
    for (int v : adj[u]) indeg[v]++;

  queue<int> q;
  for (int i = 0; i < n; i++) if (indeg[i] == 0) q.push(i);

  while (!q.empty()) {
    int u = q.front(); q.pop();
    order.push_back(u);
    for (int v : adj[u])
      if (--indeg[v] == 0) q.push(v);
  }
  if (order.size() < n) return {};   // a cycle exists
  return order;
}`,
      notes: [
        { token: "indeg[v]++", meaning: "count the arrows pointing in" },
        { token: "start with indegree 0", meaning: "nothing is blocking those" },
        { token: "--indeg[v] == 0", meaning: "decrement and test in one step" },
        { token: "order.size() < n", meaning: "the cycle check — nothing else is needed" },
      ],
      challenge: {
        prompt:
          "Complete Kahn's algorithm: reduce each neighbour's indegree and queue it the moment it reaches zero.",
        starter: `while (!q.empty()) {
  int u = q.front(); q.pop();
  order.push_back(u);
  for (int v : adj[u]) {
    if ( ) q.push(v);
  }
}`,
        rules: {
          regex: ["--indeg\\s*\\[\\s*v\\s*\\]\\s*==\\s*0|indeg\\[v\\]\\s*--\\s*==\\s*1"],
          hint: "Write if (--indeg[v] == 0) q.push(v); — the pre-decrement reduces it and then tests the new value.",
          success:
            "Correct. The pre-decrement matters: indeg[v]-- == 0 tests the value before subtracting, which is off by one.",
        },
        solution: `while (!q.empty()) {
  int u = q.front(); q.pop();
  order.push_back(u);
  for (int v : adj[u]) {
    if (--indeg[v] == 0) q.push(v);
  }
}`,
      },
    },
    {
      id: "dsu",
      kicker: "07",
      title: "Union–Find",
      hook:
        "Links keep being added, and after each one you must answer: are these two things now connected? Re-running DFS every time is far too slow. What else could work?",
      body: [
        "Give every group one representative — a boss. Each item points at its parent, and following parents upward reaches the boss.",
        "Two items are connected exactly when they have the same boss. Joining two groups is pointing one boss at the other.",
        "On its own that can build long chains, so two improvements are applied.",
        "Path compression: after finding the boss, re-point every node visited on the way straight at it. The next lookup is one hop.",
        "Union by rank or size: always attach the smaller tree under the larger, so chains stay short.",
        "With both, each operation is effectively constant time. DSU is what makes Kruskal's minimum spanning tree practical, and it answers dynamic connectivity questions that DFS cannot handle efficiently.",
      ],
      viz: traceDsu(),
      example: `vector<int> parent, rnk;

int find(int x) {
  if (parent[x] != x) parent[x] = find(parent[x]);   // path compression
  return parent[x];
}

bool unite(int a, int b) {
  a = find(a); b = find(b);
  if (a == b) return false;              // already together
  if (rnk[a] < rnk[b]) swap(a, b);       // attach smaller under larger
  parent[b] = a;
  if (rnk[a] == rnk[b]) rnk[a]++;
  return true;
}`,
      notes: [
        { token: "parent[x] = find(...)", meaning: "path compression, in one line" },
        { token: "a == b", meaning: "already in the same group — in Kruskal, this edge makes a cycle" },
        { token: "union by rank", meaning: "keeps the trees shallow" },
      ],
      challenge: {
        prompt:
          "Write find with path compression: when a node is not its own boss, re-point it straight at the boss.",
        starter: `int find(int x) {
  if (parent[x] != x) ;
  return parent[x];
}`,
        rules: {
          regex: ["parent\\s*\\[\\s*x\\s*\\]\\s*=\\s*find\\s*\\(\\s*parent\\s*\\[\\s*x\\s*\\]\\s*\\)"],
          hint: "Write parent[x] = find(parent[x]); — it finds the boss and stores it on the way back up.",
          success:
            "Correct. That one assignment flattens the entire path visited, which is why repeated queries become effectively constant time.",
        },
        solution: `int find(int x) {
  if (parent[x] != x) parent[x] = find(parent[x]);
  return parent[x];
}`,
      },
    },
    {
      id: "prim",
      kicker: "08",
      title: "Prim's minimum spanning tree",
      hook:
        "Lay cable so every building is connected, using the least total cable. Not shortest paths — nobody cares how far apart two buildings end up, only that everything is joined and the total is smallest.",
      body: [
        "That is a minimum spanning tree: connect all V nodes using exactly V−1 edges, with the smallest total weight.",
        "Prim's grows one tree outwards. Start at any node. Then repeatedly take the cheapest edge with exactly one end inside the tree, and pull the other end in.",
        "Only edges leaving the tree are ever candidates. An edge with both ends already inside would close a loop, and a tree has no loops.",
        "Finding the cheapest such edge quickly is what a min-heap is for: push every edge leaving the tree, pop the cheapest, and skip it if its far end has already been reached.",
        "That gives O(E log V) — the same shape as Dijkstra, and for the same reason. The two are nearly identical code, differing in one line: Dijkstra compares dist[u] + w, Prim's compares just w.",
        "Kruskal's solves the same problem the other way round: sort every edge by weight and take each one unless it would form a cycle. That needs Union–Find to test for cycles, which is why the DSU section exists.",
        "Prim's suits dense graphs, Kruskal's suits sparse ones. Both stop after V−1 edges, and both need the graph to be connected — on a disconnected graph they build a spanning forest instead.",
      ],
      viz: tracePrim("A"),
      example: `priority_queue<pair<int,int>,
               vector<pair<int,int>>,
               greater<>> pq;            // min-heap of (weight, node)
vector<bool> inTree(V, false);

pq.push({0, start});
long long total = 0;

while (!pq.empty()) {
  auto [w, v] = pq.top(); pq.pop();
  if (inTree[v]) continue;              // already reached
  inTree[v] = true;
  total += w;
  for (auto [to, cost] : adj[v])
    if (!inTree[to]) pq.push({cost, to});
}`,
      notes: [
        { token: "greater<>", meaning: "min-heap. The default is a max-heap" },
        { token: "if (inTree[v]) continue", meaning: "a stale entry — this node was reached more cheaply already" },
        { token: "push {cost, to}", meaning: "just the edge weight. Dijkstra would push dist[v] + cost" },
        { token: "V−1 edges", meaning: "always. That is what makes it a tree" },
      ],
      challenge: {
        prompt:
          "Write the heart of Prim's: skip a node already in the tree, otherwise pull it in and offer up its edges. Note what gets pushed — this is the one line that differs from Dijkstra.",
        starter: `while (!pq.empty()) {
  auto [w, v] = pq.top(); pq.pop();
  if ( ) continue;
  inTree[v] = true;
  total += w;
  for (auto [to, cost] : adj[v])
    if (!inTree[to]) pq.push({ , to});
}`,
        rules: {
          regex: ["inTree\\s*\\[\\s*v\\s*\\]", "pq\\.push\\s*\\(\\s*\\{\\s*cost\\s*,\\s*to\\s*\\}\\s*\\)"],
          mustNot: ["w + cost", "total + cost"],
          hint:
            "Skip when inTree[v]. Push {cost, to} — the edge weight ON ITS OWN, not added to anything.",
          success:
            "Correct, and that is exactly the line that separates the two algorithms. Push cost and you get a minimum spanning tree; push dist[v] + cost and you get Dijkstra's shortest paths.",
        },
        solution: `while (!pq.empty()) {
  auto [w, v] = pq.top(); pq.pop();
  if (inTree[v]) continue;
  inTree[v] = true;
  total += w;
  for (auto [to, cost] : adj[v])
    if (!inTree[to]) pq.push({cost, to});
}`,
      },
    },
  ],
};

export const GREEDY: TopicLesson = {
  id: "greedy",
  title: "Greedy",
  tagline: "Take the best-looking choice now — but only when you can prove it is safe.",
  why:
    "Greedy solutions are short and fast, and wrong more often than they look. The skill this chapter teaches is not writing them but justifying them: knowing why sorting by finish time works for meetings and why sorting by value fails for the knapsack. That judgement is what separates a greedy answer from a lucky guess.",
  plain: [
    "A greedy algorithm makes the choice that looks best right now and never reconsiders.",
    "It works only when a locally best choice is guaranteed not to close off a better overall answer. That guarantee is called the exchange argument, and it has to be argued, not assumed.",
    "Almost every greedy solution begins with a sort. Choosing what to sort by is the entire problem.",
    "When greedy fails, dynamic programming is usually the correct tool: it considers combinations rather than committing.",
  ],
  needs: ["Sorting.", "Heaps, for several greedy problems."],
  costs: [
    { what: "Sort, then one pass", time: "O(n log n)", note: "The sort almost always dominates." },
    { what: "Activity selection", time: "O(n log n)", note: "Sort by finish time." },
    { what: "Fractional knapsack", time: "O(n log n)", note: "Sort by value per unit weight." },
    { what: "Huffman coding", time: "O(n log n)", note: "Repeatedly merge the two smallest with a heap." },
  ],
  traps: [
    "0/1 knapsack is not greedy. Taking the best value-per-weight first gives wrong answers when items cannot be split. That problem needs DP.",
    "For interval scheduling, sort by end time, not start time and not duration. Both of those produce wrong answers on easy examples.",
    "If you cannot state why the greedy choice is safe, test it against a brute force on small random inputs before trusting it.",
  ],
  sections: [
    {
      id: "intervals",
      kicker: "01",
      title: "Sort by the right thing",
      hook:
        "Fit as many meetings as possible into one room. Should you take the shortest ones first? The earliest to start? Both feel reasonable, and both are wrong. Why?",
      body: [
        "Shortest-first fails: one short meeting in the middle can block two longer ones either side.",
        "Earliest-start fails: a meeting starting at 9am and running all day blocks everything.",
        "Earliest-finish works. Whatever frees the room soonest leaves the most room for everything after it.",
        "The proof is an exchange argument. Take any optimal schedule; replace its first meeting with the one that finishes earliest. That cannot conflict with anything the optimal schedule kept, so the result is still valid and still the same size. Repeat, and the greedy answer is reached without ever getting worse.",
        "That style of argument is what you should look for before trusting any greedy solution. If you cannot construct it, be suspicious.",
        "The implementation is then trivial: sort by end time, keep a last-used-until marker, and take anything that starts at or after it.",
      ],
      viz: traceActivitySelection(),
      example: `sort(jobs.begin(), jobs.end(),
     [](const Job& a, const Job& b) { return a.end < b.end; });

int lastEnd = 0, taken = 0;
for (const Job& j : jobs) {
  if (j.start >= lastEnd) {
    taken++;
    lastEnd = j.end;
  }
}`,
      notes: [
        { token: "sort by a.end", meaning: "finish time — not start, not duration" },
        { token: "j.start >= lastEnd", meaning: "the room is free again" },
        { token: "lastEnd = j.end", meaning: "the only state the whole algorithm keeps" },
      ],
      challenge: {
        prompt:
          "Write the comparator that sorts meetings by finishing time, then the test for whether one fits.",
        starter: `sort(jobs.begin(), jobs.end(),
     [](const Job& a, const Job& b) { return ; });

int lastEnd = 0, taken = 0;
for (const Job& j : jobs) {
  if ( ) {
    taken++;
    lastEnd = j.end;
  }
}`,
        rules: {
          regex: ["a\\.end\\s*<\\s*b\\.end", "j\\.start\\s*>=\\s*lastEnd"],
          hint: "Sort with a.end < b.end. A meeting fits when j.start >= lastEnd.",
          success:
            "Correct. Use < rather than <= in the comparator — std::sort requires a strict weak ordering, and <= can cause a crash.",
        },
        solution: `sort(jobs.begin(), jobs.end(),
     [](const Job& a, const Job& b) { return a.end < b.end; });

int lastEnd = 0, taken = 0;
for (const Job& j : jobs) {
  if (j.start >= lastEnd) {
    taken++;
    lastEnd = j.end;
  }
}`,
      },
    },
  ],
};

export const DP: TopicLesson = {
  id: "dp",
  title: "Dynamic Programming",
  tagline: "Write the answer down once so you never work it out twice.",
  why:
    "DP has a reputation for being the hard chapter, and the reason is that people try to memorise problems instead of the method. The method is three questions: what is the state, what is the transition, and what is the base case. Answer those three in English before writing any code and most DP problems become mechanical.",
  plain: [
    "DP applies when a problem has two properties. Its answer is built from answers to smaller versions of itself, and those smaller versions keep repeating.",
    "Plain recursion re-solves the same sub-problems over and over. DP solves each one once and writes the result down.",
    "Top-down memoisation is recursion plus a cache. Bottom-up tabulation fills a table in order. They compute the same thing.",
    "Define your state as a full English sentence — 'dp[i] is the best answer using the first i items' — and the transition usually writes itself.",
  ],
  needs: ["Recursion — genuinely required.", "Arrays and 2D arrays."],
  costs: [
    { what: "Any DP", time: "O(states × choices per state)", note: "The one formula worth memorising." },
    { what: "1-D DP over n items", time: "O(n)", note: "Climbing stairs, house robber, coin change." },
    { what: "0/1 knapsack", time: "O(n·W)", note: "Pseudo-polynomial — it depends on the capacity's value." },
    { what: "String DP on two strings", time: "O(n·m)", note: "LCS, edit distance." },
    { what: "Bitmask DP", time: "O(2ⁿ·n)", note: "Only to about n = 20." },
    { what: "Interval DP", time: "O(n³)", note: "Matrix chain multiplication, cutting a stick." },
  ],
  traps: [
    "Do not memorise problems. Memorise the three questions: state, transition, base case.",
    "Base cases are where most bugs live. dp[0] is nearly always 'one way to do nothing', not zero ways.",
    "A 2D table of 10⁵ × 10⁵ is 10¹⁰ cells and will not fit in memory. When only the previous row is needed, keep two rows instead of n.",
    "If the state does not fully capture everything that matters, the transitions will be subtly wrong. Write the sentence out before coding.",
  ],
  sections: [
    {
      id: "onedim",
      kicker: "01",
      title: "The first DP",
      hook:
        "You climb 1 or 2 steps at a time. How many ways to reach step 40? Plain recursion takes billions of calls for an answer with only forty distinct sub-problems. Where is the waste?",
      body: [
        "Recursion computes ways(38) inside ways(40), and again inside ways(39). The same sub-problem is solved over and over, exponentially many times.",
        "There are only forty distinct questions. Answer each once and store it.",
        "The state: dp[i] is the number of ways to reach step i. Say it as a sentence.",
        "The transition: to land on step i your last move was 1 step or 2 steps, so dp[i] = dp[i−1] + dp[i−2]. There is no third option.",
        "The base cases: dp[0] = 1, because there is exactly one way to be at the ground — do nothing. dp[1] = 1.",
        "That turns 2⁴⁰ calls into forty additions. It is the same idea every DP problem uses, only the sentence changes.",
      ],
      viz: traceClimbStairs(6),
      example: `int climb(int n) {
  vector<int> dp(n + 1);
  dp[0] = 1;                    // one way to do nothing
  dp[1] = 1;
  for (int i = 2; i <= n; i++)
    dp[i] = dp[i - 1] + dp[i - 2];
  return dp[n];
}

// only the last two values matter — O(1) memory
int a = 1, b = 1;
for (int i = 2; i <= n; i++) { int c = a + b; a = b; b = c; }`,
      notes: [
        { token: "dp[i]", meaning: "state — the number of ways to reach step i" },
        { token: "dp[i-1] + dp[i-2]", meaning: "transition — the only two last moves" },
        { token: "dp[0] = 1", meaning: "base case — one way to do nothing, not zero" },
        { token: "two variables", meaning: "when only the last two matter, drop the array" },
      ],
      challenge: {
        prompt:
          "House robber: you may not rob two adjacent houses. dp[i] is the most money from the first i houses. Write the transition — rob this house and skip the last, or skip this one.",
        starter: `vector<int> dp(n + 1, 0);
dp[1] = a[0];

for (int i = 2; i <= n; i++) {
  dp[i] = max( , );
}`,
        rules: {
          regex: ["dp\\[i\\s*-\\s*1\\]", "dp\\[i\\s*-\\s*2\\]\\s*\\+\\s*a\\[i\\s*-\\s*1\\]|a\\[i\\s*-\\s*1\\]\\s*\\+\\s*dp\\[i\\s*-\\s*2\\]"],
          hint:
            "Two options. Skip house i, which leaves dp[i - 1]. Or rob it, which gives a[i - 1] + dp[i - 2] — you must skip its neighbour. Take the larger.",
          success:
            "Correct. Notice the shape is identical to climbing stairs; only the combining operation changed from + to max. Most 1-D DP problems are this template with a different transition.",
        },
        solution: `vector<int> dp(n + 1, 0);
dp[1] = a[0];

for (int i = 2; i <= n; i++) {
  dp[i] = max(dp[i - 1], dp[i - 2] + a[i - 1]);
}`,
      },
    },
    {
      id: "knapsack",
      kicker: "02",
      title: "Take it or skip it",
      hook:
        "A bag holds 7 kg. Each item may be taken once. Greedy by value-per-weight gives the wrong answer here — try it. So what has to be considered instead?",
      body: [
        "Every combination — but organised so that each partial combination is computed only once.",
        "The state needs two numbers: which items are available, and how much space is left. So dp[i][c] is the best value using only the first i items with capacity c.",
        "The transition asks one question per cell: do I take item i or not?",
        "Skip it, and the answer is whatever the first i−1 items managed with the same capacity: dp[i−1][c].",
        "Take it — only possible if it fits — and the answer is its value plus the best the earlier items managed with the remaining space: v[i] + dp[i−1][c − w[i]].",
        "Take the larger of the two. Every cell looks only at the row above, which is why one row of memory is enough if you iterate capacity downwards.",
        "The cost is items × capacity. Note that this depends on the capacity's numeric value, not just the number of items — which is why it is called pseudo-polynomial and why a capacity of 10⁹ makes this approach useless.",
      ],
      viz: traceKnapsack(),
      example: `for (int i = 1; i <= n; i++) {
  for (int c = 0; c <= W; c++) {
    dp[i][c] = dp[i - 1][c];                       // skip
    if (w[i] <= c)
      dp[i][c] = max(dp[i][c],
                     v[i] + dp[i - 1][c - w[i]]);  // take
  }
}

// one row, iterating capacity DOWNWARDS
for (int i = 1; i <= n; i++)
  for (int c = W; c >= w[i]; c--)
    dp[c] = max(dp[c], v[i] + dp[c - w[i]]);`,
      notes: [
        { token: "dp[i][c]", meaning: "best value from the first i items with capacity c" },
        { token: "dp[i-1][c]", meaning: "the skip branch" },
        { token: "v[i] + dp[i-1][c-w[i]]", meaning: "the take branch — space is consumed" },
        { token: "c downwards", meaning: "so each item is used at most once in the 1-D version" },
      ],
      challenge: {
        prompt:
          "Write the knapsack transition: the skip branch, then the take branch when the item fits.",
        starter: `for (int i = 1; i <= n; i++) {
  for (int c = 0; c <= W; c++) {
    dp[i][c] = ;
    if (w[i] <= c)
      dp[i][c] = max(dp[i][c], );
  }
}`,
        rules: {
          regex: ["dp\\[i\\s*-\\s*1\\]\\[c\\]", "v\\[i\\]\\s*\\+\\s*dp\\[i\\s*-\\s*1\\]\\[\\s*c\\s*-\\s*w\\[i\\]\\s*\\]"],
          hint:
            "Skip: dp[i - 1][c]. Take: v[i] + dp[i - 1][c - w[i]] — the previous row, with the item's weight removed from the capacity.",
          success:
            "Correct. Both branches read the previous row, never the current one — that is what makes each item usable at most once.",
        },
        solution: `for (int i = 1; i <= n; i++) {
  for (int c = 0; c <= W; c++) {
    dp[i][c] = dp[i - 1][c];
    if (w[i] <= c)
      dp[i][c] = max(dp[i][c], v[i] + dp[i - 1][c - w[i]]);
  }
}`,
      },
    },
    {
      id: "strings",
      kicker: "03",
      title: "Two strings, one table",
      hook:
        "How much of 'ABCBDAB' and 'BDCABA' is common, keeping order but allowed to skip letters? The state now needs two numbers instead of one. Why?",
      body: [
        "Because you are walking two sequences at once, and how far you have got in each one matters independently.",
        "The state: dp[i][j] is the answer using the first i letters of one string and the first j of the other.",
        "If the current letters match, both strings can consume them together, so take the diagonal answer and add one: dp[i][j] = 1 + dp[i−1][j−1].",
        "If they do not match, one of the two letters has to be given up. Try both and keep the better: max(dp[i−1][j], dp[i][j−1]).",
        "Base cases: row 0 and column 0 are all zeros, because an empty string shares nothing with anything.",
        "Edit distance is the same table with a different rule — on a mismatch, take the minimum of three neighbours and add one for the insert, delete or replace. Learning this grid once gives you both.",
      ],
      viz: traceLcs("ABCB", "BDCA"),
      example: `for (int i = 1; i <= n; i++)
  for (int j = 1; j <= m; j++)
    if (s[i - 1] == t[j - 1])
      dp[i][j] = 1 + dp[i - 1][j - 1];       // match — go diagonal
    else
      dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);

// edit distance: same grid, minimum of three, plus one
dp[i][j] = 1 + min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]});`,
      notes: [
        { token: "s[i - 1]", meaning: "the table is 1-indexed, the string is 0-indexed" },
        { token: "1 + dp[i-1][j-1]", meaning: "both strings consume the matching letter" },
        { token: "max of two neighbours", meaning: "drop a letter from one side or the other" },
      ],
      challenge: {
        prompt:
          "Write the LCS transition: diagonal plus one on a match, otherwise the better of the two neighbours.",
        starter: `for (int i = 1; i <= n; i++)
  for (int j = 1; j <= m; j++)
    if (s[i - 1] == t[j - 1])
      dp[i][j] = ;
    else
      dp[i][j] = ;`,
        rules: {
          regex: ["1\\s*\\+\\s*dp\\[i\\s*-\\s*1\\]\\[j\\s*-\\s*1\\]", "max\\s*\\(\\s*dp\\[i\\s*-\\s*1\\]\\[j\\]\\s*,\\s*dp\\[i\\]\\[j\\s*-\\s*1\\]\\s*\\)"],
          hint:
            "On a match: 1 + dp[i - 1][j - 1]. Otherwise: max(dp[i - 1][j], dp[i][j - 1]).",
          success:
            "Correct. Learn this grid properly — LCS, edit distance, shortest common supersequence and diff tools are all the same table with a different rule inside.",
        },
        solution: `for (int i = 1; i <= n; i++)
  for (int j = 1; j <= m; j++)
    if (s[i - 1] == t[j - 1])
      dp[i][j] = 1 + dp[i - 1][j - 1];
    else
      dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);`,
      },
    },
  ],
};

export const BACKTRACKING: TopicLesson = {
  id: "backtracking",
  title: "Backtracking",
  tagline: "Choose, recurse, un-choose — and abandon a path the moment it is doomed.",
  why:
    "Some problems genuinely need every possibility examined: all permutations, all valid boards, all ways to partition. Backtracking explores that space systematically instead of blindly, and pruning is what makes it finish at all. The un-choose step is also the clearest lesson in this syllabus about keeping shared state honest.",
  plain: [
    "Backtracking is recursion that tries a choice, explores everything that follows from it, then takes the choice back and tries the next one.",
    "The un-choose step is what people forget. Without it the state left behind corrupts every sibling branch.",
    "Pruning is the other half: reject a partial answer as soon as it is already invalid, rather than filling in the rest and checking at the end.",
    "The cost is exponential by nature. It is the right tool when n is small — usually 20 or less — and there is genuinely no better structure.",
  ],
  needs: ["Recursion — essential.", "Arrays, and a clear head about what state is shared."],
  costs: [
    { what: "All subsets", time: "O(2ⁿ)", note: "Each item is in or out." },
    { what: "All permutations", time: "O(n!)", note: "9! is 362880; 12! is half a billion." },
    { what: "N-Queens", time: "Exponential, heavily pruned", note: "Pruning is what makes n = 8 instant." },
    { what: "Sudoku solver", time: "Exponential, heavily pruned", note: "Constraint checks do the real work." },
  ],
  traps: [
    "Forgetting to undo the choice after the recursive call. Every branch below then inherits state it should not see.",
    "Check validity before recursing, not after. Checking at the leaves throws away the entire benefit of pruning.",
    "Duplicate results usually mean duplicate input values. Sort first, then skip a value equal to the previous one at the same depth.",
    "Passing the shared state by value instead of by reference is safe but copies everything at every node — often the difference between passing and timing out.",
  ],
  sections: [
    {
      id: "subsets",
      kicker: "01",
      title: "Choose, recurse, un-choose",
      hook:
        "List every subset of {1, 2, 3}. There are eight. Write it recursively, and notice what has to happen to the current list between the two branches.",
      body: [
        "At each element there are exactly two branches: leave it out, or put it in.",
        "Explore the 'out' branch first. Then add the element, explore the 'in' branch, and remove it again.",
        "That removal is the backtrack. Without it, the element is still sitting in the list when the caller tries its own next branch, and every result after that is wrong.",
        "When you reach the end of the elements, the current list is one complete subset — record it.",
        "The recursion tree has 2ⁿ leaves, one per subset. That is unavoidable: there really are that many answers.",
        "This shape generalises directly. Permutations swap elements instead of including them. N-Queens places a queen instead. The choose–recurse–un-choose skeleton does not change.",
      ],
      viz: traceSubsets([1, 2, 3]),
      example: `void go(int i, vector<int>& cur, vector<int>& a, vector<vector<int>>& out) {
  if (i == a.size()) { out.push_back(cur); return; }

  go(i + 1, cur, a, out);       // branch 1: skip a[i]

  cur.push_back(a[i]);          // choose
  go(i + 1, cur, a, out);       // branch 2: take a[i]
  cur.pop_back();               // UN-choose — do not forget this
}`,
      notes: [
        { token: "i == a.size()", meaning: "a complete choice has been made" },
        { token: "cur.push_back", meaning: "choose" },
        { token: "cur.pop_back", meaning: "un-choose — restores the caller's state exactly" },
        { token: "vector<int>& cur", meaning: "shared by reference, which is why undoing matters" },
      ],
      challenge: {
        prompt:
          "Write the take branch of subset generation: choose the element, recurse, then undo the choice.",
        starter: `void go(int i, vector<int>& cur) {
  if (i == n) { record(cur); return; }

  go(i + 1, cur);

  ;
  go(i + 1, cur);
  ;
}`,
        rules: {
          regex: ["cur\\.push_back\\s*\\(\\s*a\\[i\\]\\s*\\)", "cur\\.pop_back\\s*\\(\\s*\\)"],
          hint: "Choose with cur.push_back(a[i]), recurse, then un-choose with cur.pop_back().",
          success:
            "Correct. Remove that pop_back and watch what happens: every subset after the first keeps elements from branches it was never part of.",
        },
        solution: `void go(int i, vector<int>& cur) {
  if (i == n) { record(cur); return; }

  go(i + 1, cur);

  cur.push_back(a[i]);
  go(i + 1, cur);
  cur.pop_back();
}`,
      },
    },
    {
      id: "prune",
      kicker: "02",
      title: "Pruning is what makes it finish",
      hook:
        "Place 8 queens on a chessboard so none attack each other. Trying every arrangement is 8⁸ — about sixteen million boards. The real solver checks a few thousand. What is it skipping?",
      body: [
        "Every board that is already broken. If two queens attack each other in the first two rows, there is no point filling in the other six.",
        "So check validity before recursing, not after. Rejecting a bad prefix cuts away the entire subtree beneath it.",
        "Place one queen per row — that automatically rules out row conflicts, so only columns and diagonals need checking.",
        "Two queens share a diagonal exactly when the difference of their rows equals the difference of their columns. That is the whole check.",
        "If every column in a row fails, this row cannot be filled, so the queen in the previous row was itself a bad choice. Undo it and try the next column there. That is backtracking doing its job.",
        "The technique is the same for Sudoku, word search and graph colouring. Only the validity test changes.",
      ],
      viz: traceNQueens(4),
      example: `bool safe(int r, int c) {
  for (int i = 0; i < r; i++) {
    if (col[i] == c) return false;                    // same column
    if (abs(col[i] - c) == r - i) return false;       // same diagonal
  }
  return true;
}

bool go(int r) {
  if (r == n) return true;                 // all rows filled
  for (int c = 0; c < n; c++) {
    if (!safe(r, c)) continue;             // PRUNE before recursing
    col[r] = c;
    if (go(r + 1)) return true;
    col[r] = -1;                           // undo and try the next column
  }
  return false;
}`,
      notes: [
        { token: "one queen per row", meaning: "row conflicts become impossible by construction" },
        { token: "abs(col[i] - c) == r - i", meaning: "equal row and column gaps mean same diagonal" },
        { token: "if (!safe) continue", meaning: "prune — never explore a doomed prefix" },
        { token: "col[r] = -1", meaning: "the undo, so the next column starts clean" },
      ],
      challenge: {
        prompt:
          "Write the safety check for N-Queens: reject a square that shares a column or a diagonal with any queen already placed.",
        starter: `bool safe(int r, int c) {
  for (int i = 0; i < r; i++) {
    if ( ) return false;
    if ( ) return false;
  }
  return true;
}`,
        rules: {
          regex: ["col\\[i\\]\\s*==\\s*c", "abs\\s*\\(\\s*col\\[i\\]\\s*-\\s*c\\s*\\)\\s*==\\s*r\\s*-\\s*i"],
          hint:
            "Same column: col[i] == c. Same diagonal: abs(col[i] - c) == r - i, because the row gap and column gap are equal.",
          success:
            "Correct. Only rows above r need checking — rows below have no queen yet, which is exactly why placing one queen per row from the top makes this so simple.",
        },
        solution: `bool safe(int r, int c) {
  for (int i = 0; i < r; i++) {
    if (col[i] == c) return false;
    if (abs(col[i] - c) == r - i) return false;
  }
  return true;
}`,
      },
    },
  ],
};
