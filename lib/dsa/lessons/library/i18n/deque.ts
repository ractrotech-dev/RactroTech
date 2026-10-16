import type { ChapterAlt } from "@/lib/dsa/lessons/i18n";

// Deque, in the five languages other than C++.

export const DEQUE_ALT: ChapterAlt = {
  windowmax: {
    c: {
      example: `int dq[MAXN];                /* holds indices */
int head = 0, tail = 0;

for (int i = 0; i < n; i++) {
  if (head < tail && dq[head] <= i - k) head++;              /* expired */
  while (head < tail && a[dq[tail - 1]] <= a[i]) tail--;     /* beaten */
  dq[tail++] = i;
  if (i >= k - 1) ans[i - k + 1] = a[dq[head]];
}`,
      notes: [
        { token: "dq[head] <= i - k", meaning: "that index has slid out of the window" },
        { token: "a[dq[tail-1]] <= a[i]", meaning: "beaten and expires sooner — useless for good" },
        { token: "a[dq[head]]", meaning: "the front is always the window maximum" },
        { token: "two indices", meaning: "an array plus head and tail is all a deque needs here" },
      ],
      vizCode: `int dq[MAXN], head = 0, tail = 0;   /* indices */
for (int i = 0; i < n; i++) {
  if (head < tail && dq[head] <= i - k) head++;
  while (head < tail && a[dq[tail-1]] <= a[i]) tail--;
  dq[tail++] = i;
  if (i >= k - 1) ans[i-k+1] = a[dq[head]];
}`,
      starter: `for (int i = 0; i < n; i++) {
  if (head < tail && ) head++;
  while (head < tail && ) tail--;
  dq[tail++] = i;
  if (i >= k - 1) ans[i - k + 1] = a[dq[head]];
}`,
      rules: {
        regex: ["dq\\s*\\[\\s*head\\s*\\]\\s*<=\\s*i\\s*-\\s*k", "a\\[dq\\[tail\\s*-\\s*1\\]\\]\\s*<=\\s*a\\[i\\]"],
        hint: "The front has expired when dq[head] <= i - k. Drop from the back while a[dq[tail-1]] <= a[i].",
        success:
          "Correct. The front rule is a single if, because at most one index can expire per step. The back rule is a while, because many can be beaten at once.",
      },
      solution: `for (int i = 0; i < n; i++) {
  if (head < tail && dq[head] <= i - k) head++;
  while (head < tail && a[dq[tail - 1]] <= a[i]) tail--;
  dq[tail++] = i;
  if (i >= k - 1) ans[i - k + 1] = a[dq[head]];
}`,
    },

    python: {
      example: `from collections import deque

dq = deque()          # holds indices, values decreasing
ans = []

for i in range(n):
    if dq and dq[0] <= i - k:
        dq.popleft()                       # expired
    while dq and a[dq[-1]] <= a[i]:
        dq.pop()                           # beaten
    dq.append(i)
    if i >= k - 1:
        ans.append(a[dq[0]])`,
      notes: [
        { token: "dq[0] <= i - k", meaning: "that index has slid out of the window" },
        { token: "a[dq[-1]] <= a[i]", meaning: "beaten and expires sooner — useless for good" },
        { token: "a[dq[0]]", meaning: "the front is always the window maximum" },
        { token: "deque, not list", meaning: "popleft is O(1); a list's pop(0) is O(n)" },
      ],
      vizCode: `dq = deque()                 # indices, values decreasing
for i in range(n):
    if dq and dq[0] <= i - k: dq.popleft()
    while dq and a[dq[-1]] <= a[i]: dq.pop()
    dq.append(i)
    if i >= k - 1: ans.append(a[dq[0]])`,
      prompt:
        "Write the two maintenance rules: drop the expired front, then drop every beaten element from the back.",
      starter: `for i in range(n):
    if dq and :
        dq.popleft()
    while dq and :
        dq.pop()
    dq.append(i)
    if i >= k - 1:
        ans.append(a[dq[0]])`,
      rules: {
        regex: ["dq\\s*\\[\\s*0\\s*\\]\\s*<=\\s*i\\s*-\\s*k", "a\\[dq\\[-1\\]\\]\\s*<=\\s*a\\[i\\]"],
        hint: "The front has expired when dq[0] <= i - k. Drop from the back while a[dq[-1]] <= a[i].",
        success:
          "Correct. Python is neat here: dq[0] is the front and dq[-1] is the back, and both are O(1) on a deque.",
      },
      solution: `for i in range(n):
    if dq and dq[0] <= i - k:
        dq.popleft()
    while dq and a[dq[-1]] <= a[i]:
        dq.pop()
    dq.append(i)
    if i >= k - 1:
        ans.append(a[dq[0]])`,
    },

    java: {
      example: `Deque<Integer> dq = new ArrayDeque<>();   // holds indices
List<Integer> ans = new ArrayList<>();

for (int i = 0; i < n; i++) {
  if (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.pollFirst();
  while (!dq.isEmpty() && a[dq.peekLast()] <= a[i]) dq.pollLast();
  dq.addLast(i);
  if (i >= k - 1) ans.add(a[dq.peekFirst()]);
}`,
      notes: [
        { token: "dq.peekFirst() <= i - k", meaning: "that index has slid out of the window" },
        { token: "a[dq.peekLast()] <= a[i]", meaning: "beaten and expires sooner — useless for good" },
        { token: "a[dq.peekFirst()]", meaning: "the front is always the window maximum" },
        { token: "First/Last naming", meaning: "ArrayDeque names both ends explicitly, which avoids confusion" },
      ],
      vizCode: `Deque<Integer> dq = new ArrayDeque<>();  // indices
for (int i = 0; i < n; i++) {
  if (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.pollFirst();
  while (!dq.isEmpty() && a[dq.peekLast()] <= a[i]) dq.pollLast();
  dq.addLast(i);
  if (i >= k - 1) ans.add(a[dq.peekFirst()]);
}`,
      starter: `for (int i = 0; i < n; i++) {
  if (!dq.isEmpty() && ) dq.pollFirst();
  while (!dq.isEmpty() && ) dq.pollLast();
  dq.addLast(i);
  if (i >= k - 1) ans.add(a[dq.peekFirst()]);
}`,
      rules: {
        regex: ["dq\\.peekFirst\\s*\\(\\s*\\)\\s*<=\\s*i\\s*-\\s*k", "a\\[dq\\.peekLast\\(\\)\\]\\s*<=\\s*a\\[i\\]"],
        hint: "The front has expired when dq.peekFirst() <= i - k. Drop from the back while a[dq.peekLast()] <= a[i].",
        success:
          "Correct. Use the First/Last method names rather than push/pop on a Deque — mixing the two is how people accidentally build a stack when they wanted a queue.",
      },
      solution: `for (int i = 0; i < n; i++) {
  if (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.pollFirst();
  while (!dq.isEmpty() && a[dq.peekLast()] <= a[i]) dq.pollLast();
  dq.addLast(i);
  if (i >= k - 1) ans.add(a[dq.peekFirst()]);
}`,
    },

    javascript: {
      example: `// No built-in deque. An array plus a head index gives O(1) at both ends.
const dq = [];       // holds indices
let head = 0;
const ans = [];

for (let i = 0; i < n; i++) {
  if (head < dq.length && dq[head] <= i - k) head++;
  while (head < dq.length && a[dq[dq.length - 1]] <= a[i]) dq.pop();
  dq.push(i);
  if (i >= k - 1) ans.push(a[dq[head]]);
}`,
      notes: [
        { token: "dq[head] <= i - k", meaning: "that index has slid out of the window" },
        { token: "head++", meaning: "O(1). Using .shift() here would be O(n)" },
        { token: "a[dq[head]]", meaning: "the front is always the window maximum" },
        { token: "dq.pop()", meaning: "removing from the back IS O(1), so that end is fine" },
      ],
      vizCode: `const dq = []; let head = 0;   // indices
for (let i = 0; i < n; i++) {
  if (head < dq.length && dq[head] <= i - k) head++;
  while (head < dq.length && a[dq.at(-1)] <= a[i]) dq.pop();
  dq.push(i);
  if (i >= k - 1) ans.push(a[dq[head]]);
}`,
      prompt:
        "Write the two maintenance rules: drop the expired front, then drop every beaten element from the back. Do not use .shift().",
      starter: `for (let i = 0; i < n; i++) {
  if (head < dq.length && ) head++;
  while (head < dq.length && ) dq.pop();
  dq.push(i);
  if (i >= k - 1) ans.push(a[dq[head]]);
}`,
      rules: {
        mustNot: [".shift()"],
        regex: ["dq\\s*\\[\\s*head\\s*\\]\\s*<=\\s*i\\s*-\\s*k", "a\\[dq\\.at\\(-1\\)\\]\\s*<=\\s*a\\[i\\]"],
        hint: "The front has expired when dq[head] <= i - k. Drop from the back while a[dq.at(-1)] <= a[i].",
        success:
          "Correct. Only the front needs the index trick — pushing and popping the back of an array is already O(1), so a real deque class is not required.",
      },
      solution: `for (let i = 0; i < n; i++) {
  if (head < dq.length && dq[head] <= i - k) head++;
  while (head < dq.length && a[dq.at(-1)] <= a[i]) dq.pop();
  dq.push(i);
  if (i >= k - 1) ans.push(a[dq[head]]);
}`,
    },

    rust: {
      example: `use std::collections::VecDeque;

let mut dq: VecDeque<usize> = VecDeque::new();   // holds indices
let mut ans: Vec<i32> = Vec::new();

for i in 0..n {
    if let Some(&f) = dq.front() {
        if f + k <= i { dq.pop_front(); }        // expired
    }
    while let Some(&b) = dq.back() {
        if a[b] <= a[i] { dq.pop_back(); } else { break; }
    }
    dq.push_back(i);
    if i + 1 >= k { ans.push(a[*dq.front().unwrap()]); }
}`,
      notes: [
        { token: "f + k <= i", meaning: "the same as f <= i - k, written so usize never goes below zero" },
        { token: "a[b] <= a[i]", meaning: "beaten and expires sooner — useless for good" },
        { token: "dq.front()", meaning: "the front is always the window maximum" },
        { token: "i + 1 >= k", meaning: "the same as i >= k - 1, again avoiding a negative usize" },
      ],
      vizCode: `let mut dq: VecDeque<usize> = VecDeque::new();
for i in 0..n {
    if let Some(&f) = dq.front() { if f + k <= i { dq.pop_front(); } }
    while let Some(&b) = dq.back() {
        if a[b] <= a[i] { dq.pop_back(); } else { break; } }
    dq.push_back(i);
    if i + 1 >= k { ans.push(a[*dq.front().unwrap()]); }
}`,
      prompt:
        "Write the two maintenance rules: drop the expired front, then drop every beaten element from the back.",
      starter: `for i in 0..n {
    if let Some(&f) = dq.front() {
        if  { dq.pop_front(); }
    }
    while let Some(&b) = dq.back() {
        if  { dq.pop_back(); } else { break; }
    }
    dq.push_back(i);
    if i + 1 >= k { ans.push(a[*dq.front().unwrap()]); }
}`,
      rules: {
        regex: ["f\\s*\\+\\s*k\\s*<=\\s*i", "a\\[b\\]\\s*<=\\s*a\\[i\\]"],
        hint: "Write the expiry test as f + k <= i rather than f <= i - k, so a usize never goes below zero. Drop from the back while a[b] <= a[i].",
        success:
          "Correct, and rearranging the comparison is the real lesson. i - k on a usize would stop the program whenever i is smaller than k — moving k to the other side avoids the subtraction entirely.",
      },
      solution: `for i in 0..n {
    if let Some(&f) = dq.front() {
        if f + k <= i { dq.pop_front(); }
    }
    while let Some(&b) = dq.back() {
        if a[b] <= a[i] { dq.pop_back(); } else { break; }
    }
    dq.push_back(i);
    if i + 1 >= k { ans.push(a[*dq.front().unwrap()]); }
}`,
    },
  },
};
