import type { ChapterAlt } from "@/lib/dsa/lessons/i18n";

// Maximum Flow, in the five languages other than C++.

export const MAX_FLOW_ALT: ChapterAlt = {
  network: {
    c: {
      example: `/* capacity[u][v] — the most that can pass from u to v */
int cap[V][V] = {{0}}, flow[V][V] = {{0}};

cap[S][A] = 10;
cap[S][B] = 10;
cap[A][B] = 1;

int residual = cap[u][v] - flow[u][v];

/* an UNDIRECTED edge of capacity c is two directed edges */
cap[u][v] = c;
cap[v][u] = c;`,
      notes: [
        { token: "int cap[V][V]", meaning: "V of 1000 is a million ints — 4 MB, and too big for the stack" },
        { token: "= {{0}}", meaning: "zeroes the whole matrix. Without it, it holds rubbish" },
        { token: "cap - flow", meaning: "the room left. This is what 'residual' means" },
        { token: "an adjacency list", meaning: "what you need once V passes a few thousand" },
      ],
      starter: `cap[u][v] = ;
cap[v][u] = ;

int room = ;`,
      rules: {
        regex: ["cap\\[u\\]\\[v\\]\\s*=\\s*c", "cap\\[v\\]\\[u\\]\\s*=\\s*c", "cap\\[u\\]\\[v\\]\\s*-\\s*flow\\[u\\]\\[v\\]"],
        hint: "Both directions get the FULL capacity c. The room left is cap[u][v] - flow[u][v].",
        success:
          "Correct. Declare the matrix outside main or with calloc — a 1000x1000 int array on the stack will overflow it before your program does anything.",
      },
      solution: `cap[u][v] = c;
cap[v][u] = c;

int room = cap[u][v] - flow[u][v];`,
    },

    python: {
      example: `# capacity[u][v] — the most that can pass from u to v
cap  = [[0] * V for _ in range(V)]
flow = [[0] * V for _ in range(V)]

cap[S][A] = 10
cap[S][B] = 10
cap[A][B] = 1

residual = cap[u][v] - flow[u][v]

# an UNDIRECTED edge of capacity c is two directed edges
cap[u][v] = c
cap[v][u] = c

# for a big sparse graph, a dict of dicts instead
from collections import defaultdict
cap = defaultdict(lambda: defaultdict(int))`,
      notes: [
        { token: "[[0] * V for _ in range(V)]", meaning: "the RIGHT way. [[0] * V] * V would share ONE row" },
        { token: "cap - flow", meaning: "the room left. This is what 'residual' means" },
        { token: "defaultdict of defaultdict", meaning: "for a sparse graph, where a full matrix would be wasteful" },
        { token: "no overflow", meaning: "Python integers grow, so huge capacities are not a problem" },
      ],
      prompt:
        "Add an undirected pipe between u and v with capacity c, then work out how much room is left on u→v.",
      starter: `cap[u][v] = 
cap[v][u] = 

room = `,
      rules: {
        regex: ["cap\\[u\\]\\[v\\]\\s*=\\s*c", "cap\\[v\\]\\[u\\]\\s*=\\s*c", "cap\\[u\\]\\[v\\]\\s*-\\s*flow\\[u\\]\\[v\\]"],
        hint: "Both directions get the FULL capacity c. The room left is cap[u][v] - flow[u][v].",
        success:
          "Correct. Build the matrix with a comprehension — [[0] * V] * V makes V names for ONE row, so setting cap[0][1] would set it in every row at once.",
      },
      solution: `cap[u][v] = c
cap[v][u] = c

room = cap[u][v] - flow[u][v]`,
    },

    java: {
      example: `// capacity[u][v] — the most that can pass from u to v
int[][] cap  = new int[V][V];
int[][] flow = new int[V][V];

cap[S][A] = 10;
cap[S][B] = 10;
cap[A][B] = 1;

int residual = cap[u][v] - flow[u][v];

// an UNDIRECTED edge of capacity c is two directed edges
cap[u][v] = c;
cap[v][u] = c;`,
      notes: [
        { token: "new int[V][V]", meaning: "Java zeroes it for you, unlike C" },
        { token: "cap - flow", meaning: "the room left. This is what 'residual' means" },
        { token: "V of 10000", meaning: "400 MB as a matrix. Use an edge list past a few thousand nodes" },
        { token: "long for the total", meaning: "the flow can pass 2 billion even when each capacity does not" },
      ],
      starter: `cap[u][v] = ;
cap[v][u] = ;

int room = ;`,
      rules: {
        regex: ["cap\\[u\\]\\[v\\]\\s*=\\s*c", "cap\\[v\\]\\[u\\]\\s*=\\s*c", "cap\\[u\\]\\[v\\]\\s*-\\s*flow\\[u\\]\\[v\\]"],
        hint: "Both directions get the FULL capacity c. The room left is cap[u][v] - flow[u][v].",
        success:
          "Correct. Make the running total a long: individual capacities may fit in an int while their sum does not.",
      },
      solution: `cap[u][v] = c;
cap[v][u] = c;

int room = cap[u][v] - flow[u][v];`,
    },

    javascript: {
      example: `// capacity[u][v] — the most that can pass from u to v
const cap  = Array.from({ length: V }, () => new Array(V).fill(0));
const flow = Array.from({ length: V }, () => new Array(V).fill(0));

cap[S][A] = 10;
cap[S][B] = 10;
cap[A][B] = 1;

const residual = cap[u][v] - flow[u][v];

// an UNDIRECTED edge of capacity c is two directed edges
cap[u][v] = c;
cap[v][u] = c;`,
      notes: [
        { token: "Array.from({length: V}, () => ...)", meaning: "the RIGHT way. .fill([]) would share ONE row" },
        { token: ".fill(0)", meaning: "without it every cell is undefined and the arithmetic gives NaN" },
        { token: "cap - flow", meaning: "the room left. This is what 'residual' means" },
        { token: "Int32Array rows", meaning: "far less memory for a large matrix" },
      ],
      prompt:
        "Add an undirected pipe between u and v with capacity c, then work out how much room is left on u→v.",
      starter: `cap[u][v] = ;
cap[v][u] = ;

const room = ;`,
      rules: {
        regex: ["cap\\[u\\]\\[v\\]\\s*=\\s*c", "cap\\[v\\]\\[u\\]\\s*=\\s*c", "cap\\[u\\]\\[v\\]\\s*-\\s*flow\\[u\\]\\[v\\]"],
        hint: "Both directions get the FULL capacity c. The room left is cap[u][v] - flow[u][v].",
        success:
          "Correct. The .fill(0) matters more here than anywhere: an unfilled cell is undefined, and undefined - undefined is NaN, which then quietly poisons every comparison downstream.",
      },
      solution: `cap[u][v] = c;
cap[v][u] = c;

const room = cap[u][v] - flow[u][v];`,
    },

    rust: {
      example: `// capacity[u][v] — the most that can pass from u to v
let mut cap  = vec![vec![0i64; n]; n];
let mut flow = vec![vec![0i64; n]; n];

cap[s][a] = 10;
cap[s][b] = 10;
cap[a][b] = 1;

let residual = cap[u][v] - flow[u][v];

// an UNDIRECTED edge of capacity c is two directed edges
cap[u][v] = c;
cap[v][u] = c;`,
      notes: [
        { token: "vec![vec![0i64; n]; n]", meaning: "each row is its own Vec — no sharing bug possible" },
        { token: "i64", meaning: "flow can be NEGATIVE on a backwards edge, so it must be signed" },
        { token: "cap - flow", meaning: "the room left. This is what 'residual' means" },
        { token: "on the heap", meaning: "vec! allocates, so a big matrix will not blow the stack" },
      ],
      prompt:
        "Add an undirected pipe between u and v with capacity c, then work out how much room is left on u→v.",
      starter: `cap[u][v] = ;
cap[v][u] = ;

let room = ;`,
      rules: {
        regex: ["cap\\[u\\]\\[v\\]\\s*=\\s*c", "cap\\[v\\]\\[u\\]\\s*=\\s*c", "cap\\[u\\]\\[v\\]\\s*-\\s*flow\\[u\\]\\[v\\]"],
        hint: "Both directions get the FULL capacity c. The room left is cap[u][v] - flow[u][v].",
        success:
          "Correct, and use a SIGNED type for flow. The backwards edge works by storing negative flow, so an unsigned type would go below zero and stop the program.",
      },
      solution: `cap[u][v] = c;
cap[v][u] = c;

let room = cap[u][v] - flow[u][v];`,
    },
  },

  ford: {
    c: {
      example: `int fordFulkerson(int s, int t) {
  int total = 0;
  int parent[V];
  while (findPath(s, t, parent)) {
    int push = INT_MAX;
    for (int v = t; v != s; v = parent[v]) {
      int u = parent[v];
      if (cap[u][v] - flow[u][v] < push) push = cap[u][v] - flow[u][v];
    }
    for (int v = t; v != s; v = parent[v]) {
      int u = parent[v];
      flow[u][v] += push;
      flow[v][u] -= push;      /* open the way back */
    }
    total += push;
  }
  return total;
}`,
      notes: [
        { token: "INT_MAX", meaning: "from limits.h. The starting bottleneck" },
        { token: "flow[u][v] += push", meaning: "send it forwards" },
        { token: "flow[v][u] -= push", meaning: "the undo edge. Miss this and the answer is too small" },
        { token: "no min()", meaning: "C has none for ints — write the comparison out, or a MIN macro" },
      ],
      starter: `for (int v = t; v != s; v = parent[v]) {
  int u = parent[v];
  ;
  ;
}`,
      rules: {
        regex: ["flow\\[u\\]\\[v\\]\\s*\\+=\\s*push", "flow\\[v\\]\\[u\\]\\s*-=\\s*push"],
        hint: "flow[u][v] += push sends it forwards. flow[v][u] -= push opens the backwards edge.",
        success:
          "Correct, and the second line is the whole chapter. Leave it out and the code still runs and still terminates — it just returns a smaller number, with nothing to tell you it is wrong.",
      },
      solution: `for (int v = t; v != s; v = parent[v]) {
  int u = parent[v];
  flow[u][v] += push;
  flow[v][u] -= push;
}`,
    },

    python: {
      example: `def ford_fulkerson(s, t):
    total = 0
    while True:
        parent = find_path(s, t)
        if parent is None:
            break

        # the tightest edge on the path decides how much we can push
        push = float('inf')
        v = t
        while v != s:
            u = parent[v]
            push = min(push, cap[u][v] - flow[u][v])
            v = u

        v = t
        while v != s:
            u = parent[v]
            flow[u][v] += push
            flow[v][u] -= push        # open the way back
            v = u

        total += push
    return total`,
      notes: [
        { token: "float('inf')", meaning: "the starting bottleneck. Bigger than any real capacity" },
        { token: "flow[u][v] += push", meaning: "send it forwards" },
        { token: "flow[v][u] -= push", meaning: "the undo edge. Miss this and the answer is too small" },
        { token: "recursion", meaning: "avoid it for the path search — Python stops at about 1000 deep" },
      ],
      prompt:
        "Write the two lines that push flow along one step of the path. One sends it forwards; the other is what makes undoing possible later.",
      starter: `v = t
while v != s:
    u = parent[v]
    
    
    v = u`,
      rules: {
        regex: ["flow\\[u\\]\\[v\\]\\s*\\+=\\s*push", "flow\\[v\\]\\[u\\]\\s*-=\\s*push"],
        hint: "flow[u][v] += push sends it forwards. flow[v][u] -= push opens the backwards edge.",
        success:
          "Correct. Python's integers never overflow, so a negative flow on a backwards edge is completely safe here — in C and Rust you have to make sure the type is signed.",
      },
      solution: `v = t
while v != s:
    u = parent[v]
    flow[u][v] += push
    flow[v][u] -= push
    v = u`,
    },

    java: {
      example: `static int fordFulkerson(int s, int t) {
  int total = 0;
  int[] parent = new int[V];

  while (findPath(s, t, parent)) {
    int push = Integer.MAX_VALUE;
    for (int v = t; v != s; v = parent[v]) {
      int u = parent[v];
      push = Math.min(push, cap[u][v] - flow[u][v]);
    }
    for (int v = t; v != s; v = parent[v]) {
      int u = parent[v];
      flow[u][v] += push;
      flow[v][u] -= push;        // open the way back
    }
    total += push;
  }
  return total;
}`,
      notes: [
        { token: "Integer.MAX_VALUE", meaning: "the starting bottleneck" },
        { token: "flow[u][v] += push", meaning: "send it forwards" },
        { token: "flow[v][u] -= push", meaning: "the undo edge. Miss this and the answer is too small" },
        { token: "long total", meaning: "the sum can pass 2 billion even when each push does not" },
      ],
      starter: `for (int v = t; v != s; v = parent[v]) {
  int u = parent[v];
  ;
  ;
}`,
      rules: {
        regex: ["flow\\[u\\]\\[v\\]\\s*\\+=\\s*push", "flow\\[v\\]\\[u\\]\\s*-=\\s*push"],
        hint: "flow[u][v] += push sends it forwards. flow[v][u] -= push opens the backwards edge.",
        success:
          "Correct. Make the running total a long — individual pushes fit in an int easily, while their sum over many rounds may not.",
      },
      solution: `for (int v = t; v != s; v = parent[v]) {
  int u = parent[v];
  flow[u][v] += push;
  flow[v][u] -= push;
}`,
    },

    javascript: {
      example: `function fordFulkerson(s, t) {
  let total = 0;
  const parent = new Array(V).fill(-1);

  while (findPath(s, t, parent)) {
    let push = Infinity;
    for (let v = t; v !== s; v = parent[v]) {
      const u = parent[v];
      push = Math.min(push, cap[u][v] - flow[u][v]);
    }
    for (let v = t; v !== s; v = parent[v]) {
      const u = parent[v];
      flow[u][v] += push;
      flow[v][u] -= push;        // open the way back
    }
    total += push;
  }
  return total;
}`,
      notes: [
        { token: "Infinity", meaning: "a real value in JavaScript. The starting bottleneck" },
        { token: "flow[u][v] += push", meaning: "send it forwards" },
        { token: "flow[v][u] -= push", meaning: "the undo edge. Miss this and the answer is too small" },
        { token: "past 2^53", meaning: "totals stop being exact. Rare here, but worth knowing" },
      ],
      prompt:
        "Write the two lines that push flow along one step of the path. One sends it forwards; the other is what makes undoing possible later.",
      starter: `for (let v = t; v !== s; v = parent[v]) {
  const u = parent[v];
  ;
  ;
}`,
      rules: {
        regex: ["flow\\[u\\]\\[v\\]\\s*\\+=\\s*push", "flow\\[v\\]\\[u\\]\\s*-=\\s*push"],
        hint: "flow[u][v] += push sends it forwards. flow[v][u] -= push opens the backwards edge.",
        success:
          "Correct. Watch that the matrix was built with .fill(0) — if any cell is undefined, += leaves it NaN and every later comparison silently fails.",
      },
      solution: `for (let v = t; v !== s; v = parent[v]) {
  const u = parent[v];
  flow[u][v] += push;
  flow[v][u] -= push;
}`,
    },

    rust: {
      example: `fn ford_fulkerson(s: usize, t: usize) -> i64 {
    let mut total = 0i64;

    while let Some(parent) = find_path(s, t) {
        let mut push = i64::MAX;
        let mut v = t;
        while v != s {
            let u = parent[v];
            push = push.min(cap[u][v] - flow[u][v]);
            v = u;
        }

        let mut v = t;
        while v != s {
            let u = parent[v];
            flow[u][v] += push;
            flow[v][u] -= push;      // open the way back
            v = u;
        }
        total += push;
    }
    total
}`,
      notes: [
        { token: "i64::MAX", meaning: "the starting bottleneck" },
        { token: "push.min(...)", meaning: "min is a method on the value, not a free function" },
        { token: "flow[v][u] -= push", meaning: "the undo edge. flow MUST be signed for this" },
        { token: "while let Some(parent)", meaning: "the loop ends by itself when no path is found" },
      ],
      prompt:
        "Write the two lines that push flow along one step of the path. One sends it forwards; the other is what makes undoing possible later.",
      starter: `let mut v = t;
while v != s {
    let u = parent[v];
    ;
    ;
    v = u;
}`,
      rules: {
        regex: ["flow\\[u\\]\\[v\\]\\s*\\+=\\s*push", "flow\\[v\\]\\[u\\]\\s*-=\\s*push"],
        hint: "flow[u][v] += push sends it forwards. flow[v][u] -= push opens the backwards edge.",
        success:
          "Correct, and this is exactly why flow must be i64 rather than u64. The backwards edge stores negative flow, and subtracting below zero on an unsigned type stops the program on the spot.",
      },
      solution: `let mut v = t;
while v != s {
    let u = parent[v];
    flow[u][v] += push;
    flow[v][u] -= push;
    v = u;
}`,
    },
  },

  edmonds: {
    c: {
      example: `int q[V], head, tail;

int bfs(int s, int t, int parent[]) {
  for (int i = 0; i < V; i++) parent[i] = -1;
  parent[s] = s;
  head = tail = 0;
  q[tail++] = s;

  while (head < tail) {
    int u = q[head++];
    for (int v = 0; v < V; v++)
      if (parent[v] == -1 && cap[u][v] - flow[u][v] > 0) {
        parent[v] = u;
        q[tail++] = v;
      }
  }
  return parent[t] != -1;
}`,
      notes: [
        { token: "a queue, not a stack", meaning: "that single choice is the whole difference from Ford–Fulkerson" },
        { token: "parent[v] == -1", meaning: "not visited yet. It doubles as the path record" },
        { token: "cap - flow > 0", meaning: "there is room. This is what makes an edge crossable" },
        { token: "head++ to pop", meaning: "O(1). Never shift an array to make a queue" },
      ],
      starter: `int u = q[head++];

for (int v = 0; v < V; v++)
  if ( && ) {
    parent[v] = ;
    q[tail++] = v;
  }`,
      rules: {
        regex: ["parent\\[v\\]\\s*==\\s*-1", "cap\\[u\\]\\[v\\]\\s*-\\s*flow\\[u\\]\\[v\\]\\s*>\\s*0", "parent\\[v\\]\\s*=\\s*u"],
        hint: "Unvisited means parent[v] == -1. Room left means cap[u][v] - flow[u][v] > 0. Then record parent[v] = u.",
        success:
          "Correct. Do not forget to reset parent to -1 at the start of every BFS — leaving stale values behind makes later rounds skip edges that are perfectly crossable.",
      },
      solution: `int u = q[head++];

for (int v = 0; v < V; v++)
  if (parent[v] == -1 && cap[u][v] - flow[u][v] > 0) {
    parent[v] = u;
    q[tail++] = v;
  }`,
    },

    python: {
      example: `from collections import deque

def bfs(s, t):
    parent = [-1] * V
    parent[s] = s
    q = deque([s])

    while q:
        u = q.popleft()
        for v in range(V):
            if parent[v] == -1 and cap[u][v] - flow[u][v] > 0:
                parent[v] = u
                q.append(v)

    return parent if parent[t] != -1 else None`,
      notes: [
        { token: "deque, not a list", meaning: "popleft is O(1); a list's pop(0) is O(n)" },
        { token: "parent[v] == -1", meaning: "not visited yet. It doubles as the path record" },
        { token: "cap - flow > 0", meaning: "there is room. This is what makes an edge crossable" },
        { token: "return None", meaning: "no path left, so the flow is maximum" },
      ],
      prompt:
        "Write the BFS step: cross an edge only if the node is unvisited AND there is room left on it. Record where you came from.",
      starter: `u = q.popleft()

for v in range(V):
    if  and :
        parent[v] = 
        q.append(v)`,
      rules: {
        mustNot: ["pop(0)"],
        regex: ["parent\\[v\\]\\s*==\\s*-1", "cap\\[u\\]\\[v\\]\\s*-\\s*flow\\[u\\]\\[v\\]\\s*>\\s*0", "parent\\[v\\]\\s*=\\s*u"],
        hint: "Unvisited means parent[v] == -1. Room left means cap[u][v] - flow[u][v] > 0. Then record parent[v] = u.",
        success:
          "Correct, and the deque matters here as much as anywhere: this BFS runs once per augmenting path, so a list with pop(0) would make an already-slow algorithm far slower.",
      },
      solution: `u = q.popleft()

for v in range(V):
    if parent[v] == -1 and cap[u][v] - flow[u][v] > 0:
        parent[v] = u
        q.append(v)`,
    },

    java: {
      example: `static boolean bfs(int s, int t, int[] parent) {
  Arrays.fill(parent, -1);
  parent[s] = s;
  Queue<Integer> q = new ArrayDeque<>();
  q.add(s);

  while (!q.isEmpty()) {
    int u = q.poll();
    for (int v = 0; v < V; v++)
      if (parent[v] == -1 && cap[u][v] - flow[u][v] > 0) {
        parent[v] = u;
        q.add(v);
      }
  }
  return parent[t] != -1;
}`,
      notes: [
        { token: "Arrays.fill(parent, -1)", meaning: "reset every round. A new int[] starts at 0, which reads as visited" },
        { token: "ArrayDeque", meaning: "faster than LinkedList, which allocates a node per item" },
        { token: "cap - flow > 0", meaning: "there is room. This is what makes an edge crossable" },
        { token: "parent[t] != -1", meaning: "t was reached, so there is another path" },
      ],
      starter: `int u = q.poll();

for (int v = 0; v < V; v++)
  if ( && ) {
    parent[v] = ;
    q.add(v);
  }`,
      rules: {
        regex: ["parent\\[v\\]\\s*==\\s*-1", "cap\\[u\\]\\[v\\]\\s*-\\s*flow\\[u\\]\\[v\\]\\s*>\\s*0", "parent\\[v\\]\\s*=\\s*u"],
        hint: "Unvisited means parent[v] == -1. Room left means cap[u][v] - flow[u][v] > 0. Then record parent[v] = u.",
        success:
          "Correct. The Arrays.fill is essential: a fresh int[] is full of zeros, and this code would read node 0 as everybody's parent and everything as already visited.",
      },
      solution: `int u = q.poll();

for (int v = 0; v < V; v++)
  if (parent[v] == -1 && cap[u][v] - flow[u][v] > 0) {
    parent[v] = u;
    q.add(v);
  }`,
    },

    javascript: {
      example: `function bfs(s, t, parent) {
  parent.fill(-1);
  parent[s] = s;

  const q = [s];
  let head = 0;                     // index, not shift()

  while (head < q.length) {
    const u = q[head++];
    for (let v = 0; v < V; v++)
      if (parent[v] === -1 && cap[u][v] - flow[u][v] > 0) {
        parent[v] = u;
        q.push(v);
      }
  }
  return parent[t] !== -1;
}`,
      notes: [
        { token: "head++, not q.shift()", meaning: "shift is O(n) and this BFS runs many times" },
        { token: "parent.fill(-1)", meaning: "reset every round, or stale values skip crossable edges" },
        { token: "cap - flow > 0", meaning: "there is room. This is what makes an edge crossable" },
        { token: "parent[t] !== -1", meaning: "t was reached, so there is another path" },
      ],
      prompt:
        "Write the BFS step: cross an edge only if the node is unvisited AND there is room left on it. Record where you came from. Use the head index, not .shift().",
      starter: `const u = q[head++];

for (let v = 0; v < V; v++)
  if ( && ) {
    parent[v] = ;
    q.push(v);
  }`,
      rules: {
        mustNot: [".shift()"],
        regex: ["parent\\[v\\]\\s*===?\\s*-1", "cap\\[u\\]\\[v\\]\\s*-\\s*flow\\[u\\]\\[v\\]\\s*>\\s*0", "parent\\[v\\]\\s*=\\s*u"],
        hint: "Unvisited means parent[v] === -1. Room left means cap[u][v] - flow[u][v] > 0. Then record parent[v] = u.",
        success:
          "Correct. Edmonds–Karp runs a whole BFS per augmenting path, so an O(n) shift inside it turns a slow algorithm into an unusable one.",
      },
      solution: `const u = q[head++];

for (let v = 0; v < V; v++)
  if (parent[v] === -1 && cap[u][v] - flow[u][v] > 0) {
    parent[v] = u;
    q.push(v);
  }`,
    },

    rust: {
      example: `use std::collections::VecDeque;

fn bfs(s: usize, t: usize) -> Option<Vec<usize>> {
    let mut parent = vec![usize::MAX; n];
    parent[s] = s;
    let mut q = VecDeque::new();
    q.push_back(s);

    while let Some(u) = q.pop_front() {
        for v in 0..n {
            if parent[v] == usize::MAX && cap[u][v] - flow[u][v] > 0 {
                parent[v] = u;
                q.push_back(v);
            }
        }
    }
    if parent[t] == usize::MAX { None } else { Some(parent) }
}`,
      notes: [
        { token: "usize::MAX as 'unvisited'", meaning: "usize cannot be -1, so the sentinel changes" },
        { token: "VecDeque", meaning: "O(1) at both ends. Vec::remove(0) would be O(n)" },
        { token: "Option<Vec<usize>>", meaning: "None means no path left, so the flow is maximum" },
        { token: "cap - flow > 0", meaning: "signed types — the difference can be compared safely" },
      ],
      prompt:
        "Write the BFS step: cross an edge only if the node is unvisited AND there is room left on it. Note that usize cannot hold -1, so the unvisited marker is different.",
      starter: `for v in 0..n {
    if  && cap[u][v] - flow[u][v] > 0 {
        parent[v] = ;
        q.push_back(v);
    }
}`,
      rules: {
        regex: ["parent\\[v\\]\\s*==\\s*usize::MAX", "parent\\[v\\]\\s*=\\s*u"],
        hint: "usize has no -1, so unvisited is parent[v] == usize::MAX. Then record parent[v] = u.",
        success:
          "Correct, and the sentinel change is the real Rust lesson here. Every other language uses -1; usize cannot hold it, so you pick a value that could never be a real index instead.",
      },
      solution: `for v in 0..n {
    if parent[v] == usize::MAX && cap[u][v] - flow[u][v] > 0 {
        parent[v] = u;
        q.push_back(v);
    }
}`,
    },
  },
};
