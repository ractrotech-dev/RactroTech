import type { TopicLesson } from "@/lib/dsa/lessons/types";
import { traceEdmondsKarp, traceFlowNetwork, traceFordFulkerson } from "@/lib/dsa/viz/traceFlow";

export const MAX_FLOW: TopicLesson = {
  id: "max-flow",
  title: "Maximum Flow",
  tagline: "How much can get through, and the backwards edge that makes it work.",
  why:
    "Flow is the last of the classical graph problems, and the one that looks least like its applications. Matching students to schools, assigning shifts, scheduling machines and finding the weakest point in a network are all maximum flow underneath. It is also where one genuinely surprising idea lives: to find the best answer you must be able to undo part of a decision you already made.",
  plain: [
    "A flow network is a graph where every edge has a capacity — the most that can pass along it.",
    "Water enters at a source, S, and must leave at a sink, T. No edge may carry more than its capacity, and every node in between must pass on exactly what it receives.",
    "Maximum flow asks: what is the most that can reach T?",
    "The answer is built up one route at a time — and an early route that looked sensible can block a better one, so the method needs a way to take part of it back.",
  ],
  needs: [
    "Graphs, and how an adjacency structure is stored.",
    "BFS — Edmonds–Karp is Ford–Fulkerson with a BFS inside it.",
  ],
  costs: [
    { what: "Ford–Fulkerson", time: "O(E · maxflow)", note: "Depends on the capacity NUMBERS. Can be astronomically slow." },
    { what: "Edmonds–Karp", time: "O(V · E²)", note: "The same method with BFS. Independent of capacities." },
    { what: "Dinic's", time: "O(V² · E)", note: "What real code uses. Much faster in practice than the bound suggests." },
    { what: "Bipartite matching", time: "O(V · E)", note: "Matching is max flow with every capacity set to 1." },
    { what: "Min cut", time: "Free once you have the flow", note: "The maximum flow equals the cheapest set of edges that disconnects S from T." },
  ],
  traps: [
    "Forgetting the backwards edge is the classic mistake. Without it the algorithm still terminates and still looks right — it just quietly returns an answer that is too small.",
    "In an undirected graph, an edge of capacity c becomes TWO directed edges of capacity c, not one.",
    "Ford–Fulkerson with irrational capacities may never terminate at all. With whole numbers it always does, but possibly very slowly. Use BFS and the problem disappears.",
    "The residual capacity of u→v is capacity − flow, and flow can be negative on a backwards edge. Store flow rather than remaining capacity and this stays simple.",
  ],
  sections: [
    {
      id: "network",
      kicker: "01",
      title: "What a flow network is",
      hook:
        "Pipes carry water from S to T. Each has a limit. You can see that at most 20 can leave S and at most 20 can enter T. Does that mean 20 can actually get through?",
      body: [
        "Not necessarily. Those are ceilings, not guarantees — the middle of the network might not allow it.",
        "A flow network is a directed graph where every edge has a capacity: the most that can pass along it.",
        "A valid flow obeys two rules. No edge carries more than its capacity. And at every node except S and T, what flows in equals what flows out — nothing is created and nothing is stored.",
        "The value of a flow is everything leaving S, which by the second rule is also everything arriving at T.",
        "Maximum flow asks for the largest value any valid flow can have. In the network shown it is 20, achieved without ever using the A→B pipe at all.",
        "The difficulty is that you cannot see the answer in advance. It has to be built up one route at a time — and that is where it gets interesting.",
      ],
      viz: traceFlowNetwork(),
      example: `// capacity[u][v] — the most that can pass from u to v
// flow[u][v]     — how much currently does
int cap[V][V] = {0}, flow[V][V] = {0};

cap[S][A] = 10;
cap[S][B] = 10;
cap[A][B] = 1;
cap[A][T] = 10;
cap[B][T] = 10;

// how much room is left on u -> v
int residual = cap[u][v] - flow[u][v];

// an UNDIRECTED edge of capacity c is two directed edges
cap[u][v] = c;
cap[v][u] = c;`,
      notes: [
        { token: "cap[u][v]", meaning: "the limit. A matrix is fine while V is small" },
        { token: "flow[u][v]", meaning: "what is currently going through" },
        { token: "cap - flow", meaning: "the room left. This is what 'residual' means" },
        { token: "undirected", meaning: "becomes TWO directed edges of capacity c, not one" },
      ],
      challenge: {
        prompt:
          "Add an undirected pipe between u and v with capacity c, then work out how much room is left on u→v.",
        starter: `cap[u][v] = ;
cap[v][u] = ;

int room = ;`,
        rules: {
          regex: ["cap\\[u\\]\\[v\\]\\s*=\\s*c", "cap\\[v\\]\\[u\\]\\s*=\\s*c", "cap\\[u\\]\\[v\\]\\s*-\\s*flow\\[u\\]\\[v\\]"],
          hint: "Both directions get the FULL capacity c. The room left is cap[u][v] - flow[u][v].",
          success:
            "Correct, and both directions getting the full c surprises people — an undirected pipe of capacity 5 can carry 5 either way, not 2.5 each.",
        },
        solution: `cap[u][v] = c;
cap[v][u] = c;

int room = cap[u][v] - flow[u][v];`,
      },
    },

    {
      id: "ford",
      kicker: "02",
      title: "Ford–Fulkerson and the undo edge",
      hook:
        "You send 1 unit down the only route you can see, then fill up the rest. You end with 19. The true answer is 20. What went wrong, and how can the algorithm possibly recover?",
      body: [
        "The method itself is simple. While there is any route from S to T with room left, find one, push as much down it as its tightest edge allows, and repeat.",
        "The problem is that an early route can be a mistake. Sending 1 unit through A→B occupies space in B→T that a better route needs later, and by then everything is blocked.",
        "The fix is the one genuinely surprising idea in this chapter. Alongside every edge carrying flow, pretend there is a backwards edge whose capacity is exactly the flow already there.",
        "Travelling that backwards edge does not send water the wrong way. It CANCELS a previous decision — it says 'take that unit back out of A→B and route it differently instead'.",
        "With it, a new route appears: S→B, backwards along B→A, then A→T. Pushing 1 along that removes the 1 from A→B and the total reaches 20.",
        "In code the whole idea is two lines: add to flow[u][v], and subtract the same amount from flow[v][u]. That negative flow is what makes the backwards edge exist.",
        "When no route with room remains, the flow is maximum. That is a genuine theorem, not just 'we ran out of ideas' — the edges you can no longer cross form the cheapest cut separating S from T, and its cost equals the flow.",
      ],
      viz: traceFordFulkerson(),
      example: `int fordFulkerson(int s, int t) {
  int total = 0;
  while (true) {
    vector<int> parent(V, -1);
    if (!findPath(s, t, parent)) break;   // no route left — done

    // the tightest edge on the path decides how much we can push
    int push = INT_MAX;
    for (int v = t; v != s; v = parent[v])
      push = min(push, cap[parent[v]][v] - flow[parent[v]][v]);

    for (int v = t; v != s; v = parent[v]) {
      flow[parent[v]][v] += push;         // send it forwards
      flow[v][parent[v]] -= push;         // AND open the way back
    }
    total += push;
  }
  return total;
}`,
      notes: [
        { token: "push = min(...)", meaning: "the bottleneck. The tightest edge decides the whole path" },
        { token: "flow[u][v] += push", meaning: "send it forwards" },
        { token: "flow[v][u] -= push", meaning: "the undo edge. Miss this line and the answer is too small" },
        { token: "walking v = parent[v]", meaning: "the path is followed backwards from t to s" },
      ],
      challenge: {
        prompt:
          "Write the two lines that push flow along one step of the path. One sends it forwards; the other is what makes undoing possible later.",
        starter: `for (int v = t; v != s; v = parent[v]) {
  int u = parent[v];
  ;
  ;
}`,
        rules: {
          regex: ["flow\\[u\\]\\[v\\]\\s*\\+=\\s*push", "flow\\[v\\]\\[u\\]\\s*-=\\s*push"],
          hint: "flow[u][v] += push sends it forwards. flow[v][u] -= push opens the backwards edge.",
          success:
            "Correct, and the second line is the whole chapter. Leave it out and the code still runs, still terminates, and still looks right — it just returns 19 instead of 20, with nothing to tell you.",
        },
        solution: `for (int v = t; v != s; v = parent[v]) {
  int u = parent[v];
  flow[u][v] += push;
  flow[v][u] -= push;
}`,
      },
    },

    {
      id: "edmonds",
      kicker: "03",
      title: "Edmonds–Karp",
      hook:
        "Ford–Fulkerson never says how to find a route — any route will do. Suppose the outer pipes hold a billion and one middle pipe holds 1. How many rounds might a careless choice take?",
      body: [
        "Two billion. Alternating between the route through the tiny pipe and the route that undoes it moves exactly 1 unit each time.",
        "The method is still correct. It just takes effectively forever, and its running time depends on the capacity NUMBERS rather than on the size of the graph — which is a bad property for an algorithm to have.",
        "Edmonds–Karp fixes it with one rule: always take the route with the fewest edges. Find it with BFS, which by its nature finds exactly that.",
        "So it is not a different algorithm. It is Ford–Fulkerson with BFS instead of 'any route you like' — a one-line change.",
        "The payoff is a real guarantee. With the shortest route always chosen, the distance from S to T never decreases, and each edge can only be the bottleneck a bounded number of times. That gives O(V · E²), independent of the capacities entirely.",
        "In practice, competitive code usually goes one step further to Dinic's algorithm, which groups the BFS layers and pushes many paths per round. It is harder to write and much faster, but the idea underneath is the same as everything here.",
      ],
      viz: traceEdmondsKarp(),
      example: `int maxFlow(int s, int t) {
  int total = 0;
  while (true) {
    vector<int> parent(V, -1);
    parent[s] = s;
    queue<int> q; q.push(s);

    while (!q.empty()) {              // BFS — shortest path, fewest edges
      int u = q.front(); q.pop();
      for (int v = 0; v < V; v++)
        if (parent[v] == -1 && cap[u][v] - flow[u][v] > 0) {
          parent[v] = u;
          q.push(v);
        }
    }
    if (parent[t] == -1) break;       // t unreachable — flow is maximum

    int push = INT_MAX;
    for (int v = t; v != s; v = parent[v])
      push = min(push, cap[parent[v]][v] - flow[parent[v]][v]);

    for (int v = t; v != s; v = parent[v]) {
      flow[parent[v]][v] += push;
      flow[v][parent[v]] -= push;
    }
    total += push;
  }
  return total;
}`,
      notes: [
        { token: "a queue, not a stack", meaning: "that single choice is the whole difference from Ford–Fulkerson" },
        { token: "parent[v] == -1", meaning: "not visited yet. It doubles as the BFS parent record" },
        { token: "cap - flow > 0", meaning: "there is room. This is what makes an edge crossable" },
        { token: "parent[t] == -1", meaning: "t cannot be reached, so the flow is maximum" },
      ],
      challenge: {
        prompt:
          "Write the BFS step: cross an edge only if the node is unvisited AND there is room left on it. Record where you came from.",
        starter: `int u = q.front(); q.pop();

for (int v = 0; v < V; v++)
  if ( && ) {
    parent[v] = ;
    q.push(v);
  }`,
        rules: {
          regex: ["parent\\[v\\]\\s*==\\s*-1", "cap\\[u\\]\\[v\\]\\s*-\\s*flow\\[u\\]\\[v\\]\\s*>\\s*0", "parent\\[v\\]\\s*=\\s*u"],
          hint: "Unvisited means parent[v] == -1. Room left means cap[u][v] - flow[u][v] > 0. Then record parent[v] = u.",
          success:
            "Correct. parent doing two jobs at once — the visited mark and the path record — is why this fits in so few lines, and it is the same trick BFS used in the Graph chapter.",
        },
        solution: `int u = q.front(); q.pop();

for (int v = 0; v < V; v++)
  if (parent[v] == -1 && cap[u][v] - flow[u][v] > 0) {
    parent[v] = u;
    q.push(v);
  }`,
      },
    },
  ],
};
