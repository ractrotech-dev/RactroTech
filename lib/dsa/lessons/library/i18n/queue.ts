import type { ChapterAlt } from "@/lib/dsa/lessons/i18n";

// Queue, in the five languages other than C++.
//
// The thing worth learning here is not the API but the cost: in Python and
// JavaScript, the obvious way to remove from the front is O(n), and using it
// inside BFS quietly turns O(V+E) into O(V²).

export const QUEUE_ALT: ChapterAlt = {
  basics: {
    c: {
      example: `int q[MAXN];
int head = 0, tail = 0;     /* head == tail means empty */

q[tail++] = 3;              /* push */
q[tail++] = 7;
q[tail++] = 5;

head++;                     /* pop — removes 3, the oldest */
printf("%d", q[head]);      /* 7 */`,
      notes: [
        { token: "head and tail", meaning: "two indices. head is served next, tail is where the next arrival goes" },
        { token: "q[tail++] = x", meaning: "write, then move the tail. That is a push" },
        { token: "head++", meaning: "a pop. Nothing is shifted, so it is O(1)" },
        { token: "head == tail", meaning: "empty. Check this before every read" },
      ],
      vizCode: `int q[MAXN]; int head = 0, tail = 0;
q[tail++] = 3; q[tail++] = 7; q[tail++] = 5;
head++;           /* removes 3, the oldest */
printf("%d", q[head]);`,
      prompt: "Drain a queue, printing each value as it is served. The output comes out in the order things went in.",
      starter: `while ( ) {
  printf("%d ", );
  ;
}`,
      rules: {
        regex: ["head\\s*<\\s*tail", "q\\s*\\[\\s*head\\s*\\]", "head\\+\\+"],
        hint: "Loop while head < tail. Print q[head], then head++.",
        success:
          "Correct. Two indices and no shifting — this is why a queue is O(1) at both ends. For a long-running queue, wrap the indices round to reuse the space.",
      },
      solution: `while (head < tail) {
  printf("%d ", q[head]);
  head++;
}`,
    },

    python: {
      example: `from collections import deque

q = deque()

q.append(3)          # push — joins the back
q.append(7)
q.append(5)

print(q.popleft())   # 3 — the one who waited longest
print(q[0])          # 7 — look without serving
print(len(q))        # 2`,
      notes: [
        { token: "deque()", meaning: "from collections. The right structure for a queue" },
        { token: "q.popleft()", meaning: "O(1). Removes and returns the front" },
        { token: "a_list.pop(0)", meaning: "O(n). It shifts every other item. NEVER use this in BFS" },
        { token: "queue.Queue", meaning: "a different class, for threads. Much slower — do not use it here" },
      ],
      vizCode: `q = deque()
q.append(3); q.append(7); q.append(5)
q.popleft()       # removes 3, the oldest
print(q[0])`,
      prompt:
        "Drain a queue, printing each value as it is served. The output comes out in the order things went in. Do not use pop(0).",
      starter: `while :
    print()`,
      rules: {
        mustNot: ["pop(0)"],
        regex: ["while\\s+q", "q\\.popleft\\s*\\(\\s*\\)"],
        hint: "Loop while q (an empty deque is false). Print q.popleft().",
        success:
          "Correct, and popleft is the whole point. A list's pop(0) shifts every remaining item along, so using it in BFS turns an O(V+E) walk into O(V²) with no warning.",
      },
      solution: `while q:
    print(q.popleft())`,
    },

    java: {
      example: `Queue<Integer> q = new ArrayDeque<>();

q.add(3);                        // push — joins the back
q.add(7);
q.add(5);

System.out.println(q.poll());    // 3 — removes AND returns
System.out.println(q.peek());    // 7 — look without serving
System.out.println(q.size());    // 2`,
      notes: [
        { token: "ArrayDeque", meaning: "the fast choice. LinkedList also works but allocates per node" },
        { token: "q.poll()", meaning: "removes and returns. Gives null when empty" },
        { token: "q.remove()", meaning: "same, but throws when empty. Pick whichever failure you want" },
        { token: "q.peek()", meaning: "look at the front without serving" },
      ],
      vizCode: `Queue<Integer> q = new ArrayDeque<>();
q.add(3); q.add(7); q.add(5);
q.poll();         // removes 3, the oldest
System.out.println(q.peek());`,
      prompt: "Drain a queue, printing each value as it is served. The output comes out in the order things went in.",
      starter: `while ( ) {
  System.out.print( + " ");
}`,
      rules: {
        regex: ["!\\s*q\\.isEmpty\\s*\\(\\s*\\)", "q\\.poll\\s*\\(\\s*\\)|q\\.remove\\s*\\(\\s*\\)"],
        hint: "Loop while !q.isEmpty(). Print q.poll() — poll removes and returns in one call.",
        success:
          "Correct. Java gives you two of each: poll/peek return null when empty, remove/element throw. Choose deliberately rather than by habit.",
      },
      solution: `while (!q.isEmpty()) {
  System.out.print(q.poll() + " ");
}`,
    },

    javascript: {
      example: `// JavaScript has no queue. An array works, but .shift() is O(n).
// For anything performance-sensitive, keep a head index instead.

const q = [];
let head = 0;

q.push(3);            // push — joins the back
q.push(7);
q.push(5);

const first = q[head++];   // pop — O(1), nothing is shifted
console.log(first);        // 3
console.log(q[head]);      // 7`,
      notes: [
        { token: "q.shift()", meaning: "O(n). It moves every other element along" },
        { token: "q[head++]", meaning: "O(1). Move a pointer instead of moving the data" },
        { token: "head < q.length", meaning: "the emptiness test with this approach" },
        { token: "BFS with shift()", meaning: "the classic cause of a slow solution that looks correct" },
      ],
      vizCode: `const q = []; let head = 0;
q.push(3); q.push(7); q.push(5);
head++;           // removes 3, the oldest
console.log(q[head]);`,
      prompt:
        "Drain a queue, printing each value as it is served. Use a head index — do not use .shift().",
      starter: `let head = 0;

while ( ) {
  console.log();
}`,
      rules: {
        mustNot: [".shift()"],
        regex: ["head\\s*<\\s*q\\.length", "q\\s*\\[\\s*head\\+\\+\\s*\\]|q\\s*\\[\\s*head\\s*\\]"],
        hint: "Loop while head < q.length. Print q[head++] — moving the index instead of the data keeps it O(1).",
        success:
          "Correct. This is the single most useful JavaScript performance fact in the whole course: .shift() is O(n), so a BFS written with it silently becomes O(V²).",
      },
      solution: `let head = 0;

while (head < q.length) {
  console.log(q[head++]);
}`,
    },

    rust: {
      example: `use std::collections::VecDeque;

let mut q: VecDeque<i32> = VecDeque::new();

q.push_back(3);              // push — joins the back
q.push_back(7);
q.push_back(5);

println!("{:?}", q.pop_front());   // Some(3) — an Option
println!("{:?}", q.front());       // Some(&7) — look without serving
println!("{}", q.len());           // 2`,
      notes: [
        { token: "VecDeque", meaning: "a ring buffer. O(1) at both ends" },
        { token: "q.pop_front()", meaning: "gives Option — None when empty" },
        { token: "q.front()", meaning: "look at the front. Also an Option" },
        { token: "Vec::remove(0)", meaning: "O(n). Use VecDeque instead" },
      ],
      vizCode: `let mut q: VecDeque<i32> = VecDeque::new();
q.push_back(3); q.push_back(7); q.push_back(5);
q.pop_front();    // removes 3, the oldest
println!("{:?}", q.front());`,
      prompt: "Drain a queue, printing each value as it is served. The output comes out in the order things went in.",
      starter: `while let  {
    println!("{}", x);
}`,
      rules: {
        regex: ["while\\s+let\\s+Some\\s*\\(\\s*x\\s*\\)\\s*=\\s*q\\.pop_front\\s*\\(\\s*\\)"],
        hint: "Write while let Some(x) = q.pop_front() { ... } — the loop stops on its own when the queue empties.",
        success:
          "Correct. VecDeque is a ring buffer, so both ends are O(1). Reaching for Vec::remove(0) instead would be O(n), the same mistake as .shift() in JavaScript.",
      },
      solution: `while let Some(x) = q.pop_front() {
    println!("{}", x);
}`,
    },
  },
};
