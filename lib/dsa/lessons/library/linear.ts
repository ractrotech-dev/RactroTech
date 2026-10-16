import type { TopicLesson } from "@/lib/dsa/lessons/types";
import {
  traceBalanced,
  traceDoublyCircular,
  traceDequeWindowMax,
  traceFastSlow,
  traceLinkedList,
  traceNextGreater,
  traceQueue,
  traceReverseList,
  traceStack,
} from "@/lib/dsa/viz/traceStructures";

export const LINKED_LIST: TopicLesson = {
  id: "linked-list",
  title: "Linked List",
  tagline: "Boxes joined by arrows — cheap to rewire, expensive to reach.",
  why:
    "A linked list is the first structure where you manage the connections yourself, and that is the real lesson. Getting comfortable with 'save the next pointer before you overwrite it' is what makes trees and graphs feel manageable later. It is also the classic interview structure, because pointer bugs are easy to spot.",
  plain: [
    "A linked list is a chain of nodes. Each node holds a value and the address of the next node.",
    "The last node points at nothing — nullptr — which is how you know the chain ended.",
    "There are no indexes. To reach the fifth node you must walk through the first four.",
    "In exchange, inserting or deleting in the middle costs nothing: you rewire two arrows instead of shifting a million elements.",
  ],
  needs: ["Structs and pointers.", "Loops and, for some problems, recursion."],
  costs: [
    { what: "Access the k-th node", time: "O(n)", note: "The array's biggest advantage over a list." },
    { what: "Insert or delete, given the node", time: "O(1)", note: "The list's biggest advantage over an array." },
    { what: "Search for a value", time: "O(n)", note: "No binary search — you cannot jump to the middle." },
    { what: "Reverse the whole list", time: "O(n) time, O(1) space", note: "Three pointers, one pass." },
    { what: "Delete a node you are standing on", time: "O(n) singly, O(1) doubly", note: "Singly you must walk back to find the one before it." },
    { what: "One extra pointer per node", time: "O(n) memory", note: "What a doubly linked list costs you." },
  ],
  traps: [
    "Reading cur->next after cur has been freed, or when cur is nullptr, crashes. Always test cur before dereferencing it.",
    "In the reversal loop, saving next must come before overwriting cur->next. Swap those two lines and the rest of the list is lost.",
    "while (fast && fast->next) is the correct guard for the fast pointer. Checking only fast crashes on even-length lists.",
    "A dummy head node removes almost every special case for deleting the first element. Use one.",
    "Inserting into a doubly linked list means fixing FOUR links, not two. Miss one and the list is broken in one direction only, which is very hard to spot.",
    "A circular list has no null to stop at. Remember where you started and stop when you come back to it, or the walk never ends.",
  ],
  sections: [
    {
      id: "shape",
      kicker: "01",
      title: "What a node actually is",
      hook:
        "An array of a million numbers needs a million consecutive free slots in memory. What if the memory is fragmented and no such block exists?",
      body: [
        "A linked list does not need consecutive memory. Each node can sit anywhere, because each one carries the address of the next.",
        "A node is a small struct: one value, one pointer. head points at the first node, and the last node's pointer is nullptr.",
        "Walking the list means following the pointers: cur = cur->next, until cur is nullptr.",
        "There is no a[i]. That is the fundamental trade — no random access, in exchange for cheap insertion and no need for a contiguous block.",
        "In real C++ code you almost always want vector instead. Learn lists for the pointer discipline and because interviews ask.",
      ],
      viz: traceLinkedList([7, 2, 9, 4]),
      example: `struct Node {
  int val;
  Node* next;
  Node(int v) : val(v), next(nullptr) {}
};

Node* head = new Node(7);
head->next = new Node(2);

for (Node* cur = head; cur != nullptr; cur = cur->next)
  cout << cur->val << " ";`,
      notes: [
        { token: "Node* next", meaning: "the address of the next node, or nullptr" },
        { token: "cur != nullptr", meaning: "nullptr is the end-of-chain marker" },
        { token: "cur = cur->next", meaning: "the only way to move — one hop at a time" },
      ],
      challenge: {
        prompt:
          "Count how many nodes a list has. Walk from head until you fall off the end.",
        starter: `int count = 0;
Node* cur = head;

while ( ) {
  count++;
  ;
}

cout << count;`,
        rules: {
          regex: ["cur\\s*(!=\\s*nullptr|!=\\s*NULL|\\))", "cur\\s*=\\s*cur->next"],
          hint: "Loop while cur is not null, and step with cur = cur->next inside.",
          success:
            "Correct. Forgetting the cur = cur->next step is the classic infinite loop here — the gate never changes because cur never moves.",
        },
        solution: `int count = 0;
Node* cur = head;

while (cur != nullptr) {
  count++;
  cur = cur->next;
}

cout << count;`,
      },
    },
    {
      id: "reverse",
      kicker: "02",
      title: "Reversing the arrows",
      hook:
        "Reverse a linked list in place. The moment you point the first node backwards, you have lost the address of the second. How do you avoid cutting the branch you are standing on?",
      body: [
        "You save it first. That is the whole trick, and it is why three pointers are needed instead of two.",
        "prev is the node behind you, cur is where you are, and nxt is a temporary holding the rest of the list.",
        "Each lap does four things in a fixed order: save nxt, point cur backwards at prev, move prev to cur, move cur to nxt.",
        "Change that order and you lose the list. Overwriting cur->next before saving it is the single most common mistake in this problem.",
        "When cur becomes nullptr, prev is standing on the old last node — which is the new head.",
        "One pass, no extra list, so O(n) time and O(1) space.",
      ],
      viz: traceReverseList([7, 2, 9, 4]),
      example: `Node* prev = nullptr;
Node* cur  = head;

while (cur != nullptr) {
  Node* nxt = cur->next;   // 1. save
  cur->next = prev;        // 2. flip
  prev = cur;              // 3. step prev
  cur  = nxt;              // 4. step cur
}
head = prev;               // prev is the new head`,
      notes: [
        { token: "prev starts nullptr", meaning: "the old head becomes the new tail" },
        { token: "save before flipping", meaning: "flip first and the rest is unreachable" },
        { token: "head = prev", meaning: "cur is null; prev is the last node visited" },
      ],
      challenge: {
        prompt:
          "Write the four lines of the reversal loop in the correct order.",
        starter: `Node* prev = nullptr;
Node* cur = head;

while (cur != nullptr) {
  Node* nxt = ;
  cur->next = ;
  prev = ;
  cur = ;
}`,
        rules: {
          regex: ["nxt\\s*=\\s*cur->next", "cur->next\\s*=\\s*prev", "prev\\s*=\\s*cur", "cur\\s*=\\s*nxt"],
          hint: "Save nxt = cur->next. Flip cur->next = prev. Then prev = cur, and cur = nxt.",
          success:
            "Correct. Say the four steps out loud — save, flip, step, step — and you will be able to reproduce this under pressure.",
        },
        solution: `Node* prev = nullptr;
Node* cur = head;

while (cur != nullptr) {
  Node* nxt = cur->next;
  cur->next = prev;
  prev = cur;
  cur = nxt;
}`,
      },
    },
    {
      id: "doubly",
      kicker: "03",
      title: "Doubly and circular lists",
      hook:
        "You are standing on a node in the middle of a list and you want to delete it. You have the node itself. In a singly linked list that is O(n) — why, when you are already there?",
      body: [
        "Because deleting a node means pointing the one BEFORE it at the one after. And a singly linked node has no idea what comes before it.",
        "So you have to walk from the head again just to find the previous node. Standing on the thing you want to delete does not help at all.",
        "A doubly linked list fixes that by giving every node a second pointer: prev, alongside next. Now every node knows both neighbours, and deleting becomes O(1).",
        "The price is one extra pointer per node — real memory on a long list — and more discipline. Every insert and delete has FOUR links to fix, not two. Miss one and the list is broken in one direction only, which is a horrible bug to find.",
        "A circular list is a separate, independent change: instead of the last node pointing at null, it points back at the head. There is no end.",
        "That means a walk never stops on its own. You must remember where you started and stop when you come back to it — otherwise it loops forever.",
        "Which is exactly what you want for things that take turns endlessly: round-robin scheduling, players in a game, a playlist on repeat. A doubly circular list gives you both properties at once, and that is what most standard-library list types actually are.",
      ],
      viz: traceDoublyCircular([3, 7, 9, 4]),
      example: `struct Node {
  int val;
  Node* next;
  Node* prev;          // the way back
};

// insert b after a — FOUR links
b->next = a->next;
b->prev = a;
if (a->next) a->next->prev = b;
a->next = b;

// delete node d, in O(1) — no walking
if (d->prev) d->prev->next = d->next;
if (d->next) d->next->prev = d->prev;`,
      notes: [
        { token: "Node* prev", meaning: "the second pointer. That is the whole difference" },
        { token: "four links", meaning: "b's two, plus the neighbours pointing back at b" },
        { token: "if (a->next)", meaning: "the node after may not exist. Guard before dereferencing" },
        { token: "std::list", meaning: "already a doubly linked list. This is what it does inside" },
      ],
      challenge: {
        prompt:
          "Delete node d from a doubly linked list, in O(1). Fix the links on both sides, and guard against d being at either end.",
        starter: `if (d->prev) d->prev->next = ;
if (d->next) d->next->prev = ;`,
        rules: {
          regex: ["d->prev->next\\s*=\\s*d->next", "d->next->prev\\s*=\\s*d->prev"],
          hint:
            "The node before d should now point at what came after d, and the node after d should point back at what came before it.",
          success:
            "Correct, and both guards matter: without them, deleting the first or last node follows a null pointer and crashes. A dummy node at each end removes both checks entirely.",
        },
        solution: `if (d->prev) d->prev->next = d->next;
if (d->next) d->next->prev = d->prev;`,
      },
    },
    {
      id: "fastslow",
      kicker: "04",
      title: "Two speeds",
      hook:
        "Find the middle node of a list whose length you do not know. Counting first and then walking half way needs two passes. One pass is possible — how?",
      body: [
        "Send two walkers from the head. slow takes one hop per lap, fast takes two.",
        "When fast reaches the end it has covered the whole list, so slow has covered exactly half. slow is the middle.",
        "The guard must be while (fast && fast->next). Checking only fast crashes on even lengths, when fast->next->next is reached through a null.",
        "The same two-speed idea detects a loop. In a circle, a faster walker must eventually lap a slower one, so if they ever meet, there is a cycle. If fast falls off the end instead, there is not.",
        "This is called Floyd's cycle detection, and it needs no extra memory — unlike the hash-set version, which is also correct but uses O(n).",
      ],
      viz: traceFastSlow([1, 2, 3, 4, 5]),
      example: `Node* slow = head;
Node* fast = head;

while (fast != nullptr && fast->next != nullptr) {
  slow = slow->next;
  fast = fast->next->next;
}
// slow is the middle

// cycle detection: same walk, different question
while (fast && fast->next) {
  slow = slow->next;
  fast = fast->next->next;
  if (slow == fast) return true;   // they met — there is a loop
}
return false;`,
      notes: [
        { token: "fast && fast->next", meaning: "both checks needed before two hops" },
        { token: "slow == fast", meaning: "meeting is only possible inside a cycle" },
        { token: "O(1) memory", meaning: "two pointers, whatever the list length" },
      ],
      challenge: {
        prompt:
          "Write the fast and slow walk that lands slow on the middle node.",
        starter: `Node* slow = head, *fast = head;

while ( ) {
  slow = ;
  fast = ;
}`,
        rules: {
          regex: [
            // accept both `fast &&` and the explicit `fast != nullptr &&`
            "fast\\s*(!=\\s*(nullptr|NULL)\\s*)?&&\\s*fast->next",
            "slow\\s*=\\s*slow->next",
            "fast\\s*=\\s*fast->next->next",
          ],
          hint: "Guard with fast && fast->next. Then slow = slow->next and fast = fast->next->next.",
          success:
            "Correct. Both halves of that guard are load-bearing: without fast->next, an even-length list dereferences a null pointer and crashes.",
        },
        solution: `Node* slow = head, *fast = head;

while (fast != nullptr && fast->next != nullptr) {
  slow = slow->next;
  fast = fast->next->next;
}`,
      },
    },
  ],
};

export const STACK: TopicLesson = {
  id: "stack",
  title: "Stack",
  tagline: "Only the top is reachable — and that restriction is the feature.",
  why:
    "A stack is the right structure whenever the most recent unfinished thing is what matters: the last unclosed bracket, the last operator not yet applied, the nearest taller building to the left. The monotonic stack pattern in particular turns a whole family of O(n²) array problems into single passes.",
  plain: [
    "A stack is a pile. You add to the top and you remove from the top. Nothing else is reachable.",
    "That is called LIFO: last in, first out.",
    "Three operations, all O(1): push adds, pop removes, top looks at what is on top.",
    "Recursion uses a stack behind the scenes — every paused function call is sitting on the call stack.",
  ],
  needs: ["Arrays and loops.", "Recursion helps, since it is the same idea."],
  costs: [
    { what: "push / pop / top", time: "O(1)", note: "A stack never searches." },
    { what: "Bracket matching", time: "O(n)", note: "One pass over the string." },
    { what: "Next greater element", time: "O(n)", note: "Each index is pushed once and popped once." },
    { what: "Largest rectangle in a histogram", time: "O(n)", note: "The classic monotonic-stack problem." },
  ],
  traps: [
    "Calling top() or pop() on an empty stack is undefined behaviour. Always test !st.empty() first.",
    "In C++, pop() removes but does not return the value. Read top() first, then pop().",
    "For monotonic stacks, store indexes rather than values. You almost always need the position later.",
  ],
  sections: [
    {
      id: "basics",
      kicker: "01",
      title: "A pile you can only touch on top",
      hook:
        "Push 3, then 7, then 5. Now remove one. Which one leaves? And how would you reach the 3 without losing the others?",
      body: [
        "5 leaves, because it went in last. To reach the 3 you must remove everything above it — there is no other way in.",
        "That restriction is deliberate. Because only one end is reachable, every operation is a single step with no searching.",
        "push puts a value on top. pop removes the top. top reads it without removing.",
        "In C++, pop() returns nothing. Read the value with top() first, then call pop().",
        "Always check empty() before top() or pop(). Reading an empty stack is undefined behaviour, and it often appears to work in testing before failing in production.",
      ],
      viz: traceStack(),
      example: `#include <stack>
stack<int> st;

st.push(3);
st.push(7);
st.push(5);

cout << st.top();    // 5 — the last one in
st.pop();            // removes 5, returns nothing
cout << st.top();    // 7
cout << st.size();   // 2

if (!st.empty()) st.pop();   // always guard`,
      notes: [
        { token: "st.push(x)", meaning: "put x on top" },
        { token: "st.top()", meaning: "look at the top without removing it" },
        { token: "st.pop()", meaning: "remove the top — returns nothing" },
        { token: "!st.empty()", meaning: "guard before every top or pop" },
      ],
      challenge: {
        prompt:
          "Empty a stack, printing each value as it comes off. The output will be in reverse order of how things went in.",
        starter: `while ( ) {
  cout << ;
  ;
}`,
        rules: {
          regex: ["!\\s*st\\.empty\\s*\\(\\s*\\)", "st\\.top\\s*\\(\\s*\\)", "st\\.pop\\s*\\(\\s*\\)"],
          hint: "Loop while !st.empty(). Print st.top(), then call st.pop().",
          success:
            "Correct — and note that this is a complete way to reverse a sequence: push everything in, pop everything out.",
        },
        solution: `while (!st.empty()) {
  cout << st.top() << " ";
  st.pop();
}`,
      },
    },
    {
      id: "brackets",
      kicker: "02",
      title: "Matching brackets",
      hook:
        "Is \"{[()]}\" balanced? Is \"{[(])}\"? Counting the brackets does not help — both have three of each. What has to be checked instead?",
      body: [
        "A closing bracket must match the most recent opener that is still unclosed. 'Most recent unclosed' is exactly what a stack holds.",
        "Push every opening bracket. When a closing bracket arrives, the top of the stack must be its partner.",
        "If the top does not match, the string is broken. If the stack is empty when a closer arrives, there is nothing to close — also broken.",
        "At the very end the stack must be empty. Leftovers mean some opener was never closed.",
        "Both failure checks are needed. Skip the empty check and \")(\" wrongly passes; skip the final check and \"(((\" wrongly passes.",
      ],
      viz: traceBalanced("{[()]}"),
      example: `bool balanced(const string& s) {
  stack<char> st;
  for (char c : s) {
    if (c == '(' || c == '[' || c == '{') st.push(c);
    else {
      if (st.empty()) return false;
      char t = st.top();
      if ((c == ')' && t != '(') ||
          (c == ']' && t != '[') ||
          (c == '}' && t != '{')) return false;
      st.pop();
    }
  }
  return st.empty();       // nothing left unclosed
}`,
      notes: [
        { token: "st.empty() → false", meaning: "a closer with nothing open" },
        { token: "top must match", meaning: "wrong partner means broken nesting" },
        { token: "return st.empty()", meaning: "leftover openers mean unbalanced" },
      ],
      challenge: {
        prompt:
          "Complete the bracket checker: push openers, and on a closer reject an empty stack before comparing.",
        starter: `stack<char> st;

for (char c : s) {
  if (c == '(') ;
  else {
    if ( ) return false;
    st.pop();
  }
}
return ;`,
        rules: {
          regex: ["st\\.push\\s*\\(\\s*c\\s*\\)", "st\\.empty\\s*\\(\\s*\\)", "return\\s+st\\.empty\\s*\\(\\s*\\)"],
          hint: "Push with st.push(c). Reject when st.empty() on a closer. Finish with return st.empty().",
          success:
            "Correct. Both empty-checks matter — one catches too many closers, and the other catches too many openers.",
        },
        solution: `stack<char> st;

for (char c : s) {
  if (c == '(') st.push(c);
  else {
    if (st.empty()) return false;
    st.pop();
  }
}
return st.empty();`,
      },
    },
    {
      id: "monotonic",
      kicker: "03",
      title: "The monotonic stack",
      hook:
        "For each number, find the first bigger number to its right. Two nested loops is O(n²). One pass with a stack is O(n) — what makes an element safe to throw away forever?",
      body: [
        "Walk from right to left, keeping a stack of the numbers to the right that might still be somebody's answer.",
        "Before dealing with the current number, pop everything on the stack that is not bigger than it.",
        "Those popped numbers can never be an answer again. Anything further left would meet the current, larger number first — so they are useless permanently, not just now.",
        "Whatever survives on top is the nearest bigger number. If the stack empties, there is nothing bigger to the right.",
        "Then push the current index. The stack stays sorted, which is where the name comes from.",
        "Cost: every index is pushed once and popped at most once. That is 2n operations total, so O(n) — even though there is a while loop inside a for loop.",
        "The same shape solves stock spans, daily temperatures, largest rectangle in a histogram, and trapping rain water. Recognising it is worth more than memorising any one of them.",
      ],
      viz: traceNextGreater([4, 6, 3, 2, 8, 1]),
      example: `vector<int> nextGreater(vector<int>& a) {
  int n = a.size();
  vector<int> ans(n, -1);
  stack<int> st;                        // indices, values decreasing

  for (int i = n - 1; i >= 0; i--) {
    while (!st.empty() && a[st.top()] <= a[i]) st.pop();
    ans[i] = st.empty() ? -1 : a[st.top()];
    st.push(i);
  }
  return ans;
}`,
      notes: [
        { token: "walk right to left", meaning: "so the stack holds what is to the right" },
        { token: "pop while <=", meaning: "those can never be an answer again" },
        { token: "store indices", meaning: "you usually need the position, not just the value" },
        { token: "O(n) total", meaning: "each index is pushed once, popped at most once" },
      ],
      challenge: {
        prompt:
          "Write the monotonic stack loop for next greater element: discard everything that can never win, then read the answer off the top.",
        starter: `for (int i = n - 1; i >= 0; i--) {
  while (!st.empty() && ) st.pop();
  ans[i] = st.empty() ? -1 : ;
  st.push(i);
}`,
        rules: {
          regex: ["a\\[st\\.top\\(\\)\\]\\s*<=\\s*a\\[i\\]", "a\\[st\\.top\\(\\)\\]"],
          hint:
            "Pop while a[st.top()] <= a[i]. Then the answer is a[st.top()] when the stack is not empty.",
          success:
            "Correct. Using <= rather than < is what makes equal values get discarded too — which is the behaviour 'strictly greater' asks for.",
        },
        solution: `for (int i = n - 1; i >= 0; i--) {
  while (!st.empty() && a[st.top()] <= a[i]) st.pop();
  ans[i] = st.empty() ? -1 : a[st.top()];
  st.push(i);
}`,
      },
    },
  ],
};

export const QUEUE: TopicLesson = {
  id: "queue",
  title: "Queue",
  tagline: "A fair line — and the engine inside BFS.",
  why:
    "A queue is what makes breadth-first search work. Because nothing overtakes, nodes come out in order of distance from the start, which is exactly why BFS finds shortest paths. Every level-order traversal and every multi-source spread problem rests on this one property.",
  plain: [
    "A queue is a line. You join at the back and you are served from the front.",
    "That is FIFO: first in, first out — the opposite of a stack.",
    "push adds at the back, pop removes from the front, front reads the first in line.",
    "Because nothing overtakes, whatever entered earlier always leaves earlier. That fairness is the whole point.",
  ],
  needs: ["Arrays and loops.", "It becomes essential in the Graph chapter."],
  costs: [
    { what: "push / pop / front", time: "O(1)", note: "Both ends are directly reachable." },
    { what: "BFS over a graph", time: "O(V + E)", note: "Each node enters the queue once." },
    { what: "Level-order traversal", time: "O(n)", note: "Each node enters once." },
  ],
  traps: [
    "Calling front() or pop() on an empty queue is undefined behaviour. Guard with !q.empty().",
    "In BFS, mark a node as seen when you push it, not when you pop it. Marking on pop lets the same node enter the queue several times.",
    "Do not use a vector and erase(begin()) as a queue — that shifts everything and is O(n) per pop. Use std::queue or an index into a vector.",
  ],
  sections: [
    {
      id: "basics",
      kicker: "01",
      title: "First in, first out",
      hook:
        "Three people join a queue: 3, then 7, then 5. Serve one. Who leaves? Compare that to a stack, where the answer would be the opposite.",
      body: [
        "3 leaves, because it waited longest. Nothing overtakes.",
        "push adds at the back. pop removes from the front. front reads the first in line without removing it.",
        "As with a stack, pop() returns nothing in C++ — read front() first.",
        "This fairness is exactly what BFS needs. Nodes one step away all enter the queue before any node two steps away, so they all come out first.",
        "That is the reason BFS finds shortest paths when every edge costs the same, and DFS does not.",
      ],
      viz: traceQueue(),
      example: `#include <queue>
queue<int> q;

q.push(3);
q.push(7);
q.push(5);

cout << q.front();   // 3 — the one who waited longest
q.pop();             // removes 3
cout << q.front();   // 7
cout << q.size();    // 2`,
      notes: [
        { token: "q.push(x)", meaning: "join the back of the line" },
        { token: "q.front()", meaning: "who is first — without serving them" },
        { token: "q.pop()", meaning: "serve the front — returns nothing" },
        { token: "q.back()", meaning: "who joined most recently" },
      ],
      challenge: {
        prompt:
          "Drain a queue, printing each value as it is served. The output comes out in the same order things went in.",
        starter: `while ( ) {
  cout << ;
  ;
}`,
        rules: {
          regex: ["!\\s*q\\.empty\\s*\\(\\s*\\)", "q\\.front\\s*\\(\\s*\\)", "q\\.pop\\s*\\(\\s*\\)"],
          hint: "Loop while !q.empty(). Print q.front(), then q.pop().",
          success:
            "Correct. Compare this with draining a stack: the code is nearly identical, but the order of the output is reversed.",
        },
        solution: `while (!q.empty()) {
  cout << q.front() << " ";
  q.pop();
}`,
      },
    },
  ],
};

export const DEQUE: TopicLesson = {
  id: "deque",
  title: "Deque",
  tagline: "Both ends open — the structure behind sliding window maximum.",
  why:
    "A deque exists mainly for one famous problem: the maximum of every window of size k. Doing that with a heap is O(n log k); with a deque it is O(n). The trick — keep only the candidates that could still win, in sorted order — is the same monotonic idea as the stack, applied to a window.",
  plain: [
    "A deque is a double-ended queue. You can push and pop at both the front and the back, all in O(1).",
    "That makes it a stack and a queue at the same time.",
    "Its real use is the monotonic deque: a list of candidates kept in decreasing order, where anything that can never win again is thrown away.",
    "Two rules keep it correct — drop from the front what has left the window, and drop from the back what is beaten by the new arrival.",
  ],
  needs: ["Queues and stacks.", "Sliding window."],
  costs: [
    { what: "push_front / push_back / pop_front / pop_back", time: "O(1)", note: "All four ends are cheap." },
    { what: "Sliding window maximum", time: "O(n)", note: "Each index enters and leaves once." },
    { what: "0-1 BFS", time: "O(V + E)", note: "Zero-cost edges go to the front, cost-one edges to the back." },
  ],
  traps: [
    "Store indexes, not values — you need the index to know when something has slid out of the window.",
    "Do the front check (has it left the window?) before the back check, or the front element may already be stale.",
    "Use >= when popping from the back if duplicates should be discarded; use > to keep them. Decide which the problem wants.",
  ],
  sections: [
    {
      id: "windowmax",
      kicker: "01",
      title: "Sliding window maximum",
      hook:
        "The maximum of every window of size 3. Scanning each window is O(n·k). A heap gets it to O(n log k). One pass is possible — which numbers can you stop tracking entirely?",
      body: [
        "The insight: if a smaller number sits to the left of a bigger one, that smaller number can never be a maximum again. It is beaten now, and it leaves the window first.",
        "So keep a deque of indexes whose values decrease from front to back. The front is always the current maximum.",
        "Two maintenance rules run every step. First, if the front index has slid out of the window, drop it. Second, pop from the back while those values are not bigger than the new arrival — they are permanently useless.",
        "Then push the new index at the back. Once the window is full, read the answer from the front.",
        "Each index enters the deque once and leaves once, so the total work is O(n) even with the inner while loop.",
        "This is the monotonic stack idea again, with an extra rule for elements expiring out of the window.",
      ],
      viz: traceDequeWindowMax([1, 3, -1, -3, 5, 3, 6, 7], 3),
      example: `deque<int> dq;                       // indices, values decreasing
vector<int> ans;

for (int i = 0; i < n; i++) {
  if (!dq.empty() && dq.front() <= i - k) dq.pop_front();   // expired
  while (!dq.empty() && a[dq.back()] <= a[i]) dq.pop_back(); // beaten
  dq.push_back(i);
  if (i >= k - 1) ans.push_back(a[dq.front()]);
}`,
      notes: [
        { token: "dq.front() <= i - k", meaning: "that index has slid out of the window" },
        { token: "a[dq.back()] <= a[i]", meaning: "beaten and expires sooner — useless forever" },
        { token: "a[dq.front()]", meaning: "the front is always the window maximum" },
        { token: "i >= k - 1", meaning: "only record once the window is full" },
      ],
      challenge: {
        prompt:
          "Write the two maintenance rules: drop the expired front, then drop every beaten element from the back.",
        starter: `for (int i = 0; i < n; i++) {
  if (!dq.empty() && ) dq.pop_front();
  while (!dq.empty() && ) dq.pop_back();
  dq.push_back(i);
  if (i >= k - 1) ans.push_back(a[dq.front()]);
}`,
        rules: {
          regex: ["dq\\.front\\s*\\(\\s*\\)\\s*<=\\s*i\\s*-\\s*k", "a\\[dq\\.back\\(\\)\\]\\s*<=\\s*a\\[i\\]"],
          hint:
            "The front has expired when dq.front() <= i - k. Pop from the back while a[dq.back()] <= a[i].",
          success:
            "Correct. The front rule is a single if, because at most one index can expire per step. The back rule is a while, because many elements can be beaten at once.",
        },
        solution: `for (int i = 0; i < n; i++) {
  if (!dq.empty() && dq.front() <= i - k) dq.pop_front();
  while (!dq.empty() && a[dq.back()] <= a[i]) dq.pop_back();
  dq.push_back(i);
  if (i >= k - 1) ans.push_back(a[dq.front()]);
}`,
      },
    },
  ],
};
