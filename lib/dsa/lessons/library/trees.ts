import type { TopicLesson } from "@/lib/dsa/lessons/types";
import {
  traceAvlRotation,
  traceBstInorder,
  traceBstSearch,
  traceHeapPop,
  traceHeapPush,
  traceSegmentTree,
  traceTraversal,
  traceTreeHeight,
} from "@/lib/dsa/viz/traceTrees";

export const BINARY_TREE: TopicLesson = {
  id: "binary-tree",
  title: "Binary Tree",
  tagline: "Recursion with a shape — solve both children, then combine.",
  why:
    "Trees are where recursion stops being a party trick and becomes the natural way to write things. Nearly every tree problem is the same three lines: handle the empty case, ask the left child, ask the right child, combine. Once you see that template, most 'hard' tree questions become a matter of deciding what each child hands back.",
  plain: [
    "A tree is nodes joined by parent-to-child links, with exactly one root and no cycles.",
    "Binary means each node has at most two children, called left and right.",
    "A leaf is a node with no children. The height is the number of levels from the root down to the deepest leaf.",
    "Every child is itself the root of a smaller tree. That is why recursion fits so naturally.",
  ],
  needs: ["Recursion — genuinely required here.", "Queues, for level-order traversal."],
  costs: [
    { what: "Any full traversal", time: "O(n)", note: "Every node is visited once." },
    { what: "Recursion memory", time: "O(h)", note: "h is the height. A balanced tree is O(log n); a degenerate one is O(n)." },
    { what: "Level-order traversal", time: "O(n) time, O(width) memory", note: "The queue holds at most one level." },
    { what: "Height, diameter, balance check", time: "O(n)", note: "One post-order pass each — do not recompute height per node." },
  ],
  traps: [
    "Forgetting the if (!node) return base case causes a crash on the first missing child.",
    "Computing height inside a diameter function at every node makes it O(n²). Return both values from one pass instead.",
    "Height is sometimes counted in nodes and sometimes in edges. State which you mean before writing code.",
    "A deep, unbalanced tree can overflow the call stack at around 10⁵ nodes. Convert to an explicit stack when depth is a real risk.",
  ],
  sections: [
    {
      id: "traversal",
      kicker: "01",
      title: "Three traversals, one line moved",
      hook:
        "Visit every node exactly once. There are three sensible orders, and the code for all three is identical except for where one line sits. Why does that one line change everything?",
      body: [
        "Every traversal does the same three things: handle this node, go left, go right. Only the order changes.",
        "Preorder handles the node first. Use it when a parent must be processed before its children — copying a tree, or printing a folder before its contents.",
        "Inorder goes left, handles the node, then goes right. On a binary search tree this produces sorted output, which is the single most useful fact about BSTs.",
        "Postorder goes left, goes right, then handles the node. Use it when a parent needs answers from both children first — height, diameter, or deleting a tree safely.",
        "Level order is different in kind: it uses a queue rather than recursion, and visits the tree row by row. Use it when distance from the root matters.",
        "Step through the diagram for each order and watch which node is printed at which moment. The tree never changes; only the timing does.",
      ],
      viz: traceTraversal("inorder"),
      example: `void preorder(Node* n)  { if (!n) return; visit(n); preorder(n->left);  preorder(n->right); }
void inorder(Node* n)   { if (!n) return; inorder(n->left);  visit(n); inorder(n->right); }
void postorder(Node* n) { if (!n) return; postorder(n->left); postorder(n->right); visit(n); }

void levelOrder(Node* root) {
  if (!root) return;
  queue<Node*> q; q.push(root);
  while (!q.empty()) {
    Node* n = q.front(); q.pop();
    visit(n);
    if (n->left)  q.push(n->left);
    if (n->right) q.push(n->right);
  }
}`,
      notes: [
        { token: "if (!n) return", meaning: "the base case — a missing child is an empty tree" },
        { token: "position of visit(n)", meaning: "first, middle or last — that is the only difference" },
        { token: "queue for level order", meaning: "FIFO is what keeps rows in order" },
      ],
      challenge: {
        prompt:
          "Write an inorder traversal: left subtree, then this node, then the right subtree. Do not forget the base case.",
        starter: `void inorder(Node* n) {
  if ( ) return;
  ;
  cout << n->val << " ";
  ;
}`,
        rules: {
          regex: ["!n|n\\s*==\\s*nullptr|n\\s*==\\s*NULL", "inorder\\s*\\(\\s*n->left\\s*\\)", "inorder\\s*\\(\\s*n->right\\s*\\)"],
          hint: "Base case: if (!n) return; Then inorder(n->left); the cout; then inorder(n->right);",
          success:
            "Correct. Move that cout above the left call and you have preorder; move it below the right call and you have postorder. Same function, three answers.",
        },
        solution: `void inorder(Node* n) {
  if (!n) return;
  inorder(n->left);
  cout << n->val << " ";
  inorder(n->right);
}`,
      },
    },
    {
      id: "combine",
      kicker: "02",
      title: "Ask the children, then combine",
      hook:
        "How tall is this tree? A node cannot possibly answer on its own — it has no idea what is below it. So what does it do?",
      body: [
        "It asks both children how tall they are, waits, then adds one to the taller answer.",
        "This is the template for almost every tree problem. Handle the empty case, recurse into both children, combine what they return.",
        "The only thing that changes between problems is what a child hands back. Height returns a number. Balance-check returns a height plus a flag. Diameter returns a height while updating a global best.",
        "Notice the direction: answers flow upward. Nothing is known until the bottom is reached, and the root is the last to find out.",
        "Beware of accidentally making it O(n²). Computing height inside a diameter function at every node re-walks the same subtrees repeatedly. Return everything you need from one pass instead.",
      ],
      viz: traceTreeHeight(),
      example: `int height(Node* n) {
  if (!n) return 0;
  int L = height(n->left);
  int R = height(n->right);
  return 1 + max(L, R);
}

// diameter in ONE pass — height is returned, best is updated on the way
int best = 0;
int walk(Node* n) {
  if (!n) return 0;
  int L = walk(n->left), R = walk(n->right);
  best = max(best, L + R);      // longest path through this node
  return 1 + max(L, R);
}`,
      notes: [
        { token: "if (!n) return 0", meaning: "an empty tree has height 0" },
        { token: "1 + max(L, R)", meaning: "this node, plus the taller side" },
        { token: "best updated inside", meaning: "one pass — no repeated height calls" },
      ],
      challenge: {
        prompt:
          "Count the total number of nodes in a tree. Same template: base case, both children, combine.",
        starter: `int countNodes(Node* n) {
  if ( ) return 0;
  return ;
}`,
        rules: {
          regex: ["!n|n\\s*==\\s*nullptr", "1\\s*\\+\\s*countNodes\\s*\\(\\s*n->left\\s*\\)\\s*\\+\\s*countNodes\\s*\\(\\s*n->right\\s*\\)"],
          hint: "Empty tree has 0 nodes. Otherwise: 1 + countNodes(n->left) + countNodes(n->right).",
          success:
            "Correct. Compare it with height — the shape is identical, and only the combining step changed from max to +.",
        },
        solution: `int countNodes(Node* n) {
  if (!n) return 0;
  return 1 + countNodes(n->left) + countNodes(n->right);
}`,
      },
    },
  ],
};

export const BST: TopicLesson = {
  id: "bst",
  title: "Binary Search Tree",
  tagline: "One ordering rule turns a tree into a searchable structure.",
  why:
    "A BST is binary search made into a structure that can also be modified. Arrays give O(log n) search but O(n) insertion; a balanced BST gives O(log n) for both. That combination is why std::map and std::set are built on one.",
  plain: [
    "A BST is a binary tree with one extra rule: everything in the left subtree is smaller than the node, and everything in the right subtree is bigger.",
    "That rule holds at every node, not just the root — which is what makes the whole subtree skippable in one comparison.",
    "So searching is binary search drawn as a tree: compare, then go left or right, discarding half.",
    "An inorder traversal of a BST comes out sorted. That single fact solves a surprising number of problems.",
  ],
  needs: ["Binary trees and recursion.", "Binary search."],
  costs: [
    { what: "Search / insert / delete (balanced)", time: "O(log n)", note: "The height of a balanced tree." },
    { what: "Search / insert / delete (degenerate)", time: "O(n)", note: "Inserting sorted data makes a linked list." },
    { what: "Inorder traversal", time: "O(n)", note: "Comes out sorted, for free." },
    { what: "One rotation", time: "O(1)", note: "A fixed number of pointer swaps, whatever the tree size." },
    { what: "AVL insert or delete", time: "O(log n)", note: "Walk back to the root, rotating where needed." },
    { what: "std::map / std::set", time: "O(log n) guaranteed", note: "Self-balancing — use these, not a hand-rolled BST." },
  ],
  traps: [
    "Inserting already-sorted data into a plain BST produces a straight line, and every operation becomes O(n). Real implementations self-balance to prevent this.",
    "Validating a BST by only comparing each node with its two children is wrong. Pass down a permitted (min, max) range instead.",
    "Deleting a node with two children needs its inorder successor — the leftmost node of the right subtree. This is the fiddly case.",
    "A rotation changes the SHAPE, never the ordering. If an inorder walk gives a different sequence afterwards, the rotation was wrong.",
    "Rotating only the root is not enough. Insert and delete must walk back up to the root, checking balance at every node on the way.",
  ],
  sections: [
    {
      id: "search",
      kicker: "01",
      title: "One comparison, half the tree gone",
      hook:
        "Find 70 in a BST of a thousand nodes. You compare with the root, 50, once. How many nodes did that single comparison rule out?",
      body: [
        "Roughly half of them. 70 is bigger than 50, so it cannot be in the left subtree — every value there is smaller than 50, by the rule.",
        "So go right and repeat. Each comparison discards an entire subtree.",
        "In a balanced tree the height is log₂ n, so about twenty comparisons handle a million nodes.",
        "The catch is the word balanced. Insert 1, 2, 3, 4, 5 into an empty BST in that order and you get a straight line — a linked list wearing a tree costume, with O(n) search.",
        "That is exactly why self-balancing trees exist. std::map and std::set use red-black trees and guarantee O(log n) whatever order you insert in.",
      ],
      viz: traceBstSearch(70),
      example: `Node* search(Node* n, int key) {
  while (n) {
    if (n->val == key) return n;
    n = key < n->val ? n->left : n->right;
  }
  return nullptr;
}

Node* insert(Node* n, int key) {
  if (!n) return new Node(key);
  if (key < n->val) n->left  = insert(n->left, key);
  else              n->right = insert(n->right, key);
  return n;
}`,
      notes: [
        { token: "key < n->val", meaning: "smaller goes left — the rule, applied" },
        { token: "if (!n) return new Node", meaning: "insertion always happens at a missing child" },
        { token: "n->left = insert(...)", meaning: "reattach the returned subtree — this is what links the new node in" },
      ],
      challenge: {
        prompt:
          "Write an iterative BST search: compare with the current node and move to the correct child.",
        starter: `Node* search(Node* n, int key) {
  while (n) {
    if (n->val == key) return n;
    if ( ) n = n->left;
    else   n = n->right;
  }
  return nullptr;
}`,
        rules: {
          regex: ["key\\s*<\\s*n->val"],
          hint: "Go left when key < n->val, otherwise go right.",
          success:
            "Correct. There is no third branch and no backtracking — the ordering rule guarantees only one direction can possibly hold the key.",
        },
        solution: `Node* search(Node* n, int key) {
  while (n) {
    if (n->val == key) return n;
    if (key < n->val) n = n->left;
    else              n = n->right;
  }
  return nullptr;
}`,
      },
    },
    {
      id: "inorder",
      kicker: "02",
      title: "Inorder gives you sorted order for free",
      hook:
        "Print every value in a BST from smallest to largest. Do not sort anything. Which traversal already does this?",
      body: [
        "Inorder. Go left, handle the node, go right.",
        "It works because of the rule: everything left of a node is smaller, so it is all printed first; everything right is bigger, so it is all printed after.",
        "That gives sorted output in O(n), with no comparisons beyond the traversal itself.",
        "Consequences worth remembering. The k-th smallest element is the k-th node of an inorder walk. Validating a BST is checking that the inorder sequence is strictly increasing. Two-sum in a BST is the two-pointer method applied to that sequence.",
        "It also explains the successor of a node — the next value up — which is what makes deletion of a two-child node work.",
      ],
      viz: traceBstInorder(),
      example: `void inorder(Node* n, vector<int>& out) {
  if (!n) return;
  inorder(n->left, out);
  out.push_back(n->val);      // values arrive in sorted order
  inorder(n->right, out);
}

// k-th smallest, without building the whole list
int k, answer;
void kth(Node* n) {
  if (!n) return;
  kth(n->left);
  if (--k == 0) { answer = n->val; return; }
  kth(n->right);
}`,
      notes: [
        { token: "left, node, right", meaning: "smaller values first, always" },
        { token: "--k == 0", meaning: "stop at the k-th node of the walk" },
        { token: "validate", meaning: "check the inorder sequence is strictly increasing" },
      ],
      challenge: {
        prompt:
          "Validate a BST by checking each node against a permitted range. Comparing only with the immediate children is not enough.",
        starter: `bool valid(Node* n, long lo, long hi) {
  if (!n) return true;
  if (n->val <= lo || n->val >= hi) return false;
  return valid(n->left, lo, ) &&
         valid(n->right, , hi);
}`,
        rules: {
          regex: ["valid\\s*\\(\\s*n->left\\s*,\\s*lo\\s*,\\s*n->val\\s*\\)", "valid\\s*\\(\\s*n->right\\s*,\\s*n->val\\s*,\\s*hi\\s*\\)"],
          hint:
            "Everything in the left subtree must stay below n->val, so pass n->val as the new upper bound. Everything on the right must stay above it, so pass n->val as the new lower bound.",
          success:
            "Correct. Passing the range down is what catches the classic broken tree where a deep left-subtree node is larger than an ancestor — a local parent-child check would miss it.",
        },
        solution: `bool valid(Node* n, long lo, long hi) {
  if (!n) return true;
  if (n->val <= lo || n->val >= hi) return false;
  return valid(n->left, lo, n->val) &&
         valid(n->right, n->val, hi);
}`,
      },
    },
    {
      id: "avl",
      kicker: "03",
      title: "Keeping the tree balanced",
      hook:
        "Insert 10, then 20, then 30 into a plain BST. Draw what you get. Every ordering rule is satisfied — so why is searching it now O(n)?",
      body: [
        "Because each value was bigger than the last, so each went right, and the tree is a straight line. Structurally it is a linked list wearing a tree costume.",
        "That is not a rare edge case. Inserting already-sorted data is one of the most ordinary things a program does, and it produces the worst possible tree every time.",
        "An AVL tree stops it. Every node stores the height of each side, and the difference between them — the balance factor — must never exceed 1.",
        "When an insert breaks that rule, the tree fixes itself with a rotation: a fixed, small rearrangement that changes the SHAPE without changing the ordering.",
        "In the 10-20-30 case, 20 becomes the new root, taking 10 as its left child and keeping 30 on the right. Same three values, same ordering rule, height dropped from 3 to 2.",
        "There are four cases, but really only two. Right-right and left-left need one rotation. Right-left and left-right lean different ways at each step, so you rotate the child first to turn them into one of the simple cases, then rotate the parent.",
        "A rotation is O(1), and insert or delete walks back up to the root checking balance — O(log n) nodes. So the guarantee costs almost nothing, and it is what std::map, TreeMap and BTreeMap are built on.",
      ],
      viz: traceAvlRotation(),
      example: `int height(Node* n) { return n ? n->h : 0; }
int balance(Node* n) { return height(n->left) - height(n->right); }

Node* rotateLeft(Node* x) {
  Node* y = x->right;
  x->right = y->left;        // y's left subtree moves under x
  y->left  = x;              // x becomes y's left child
  update(x); update(y);      // heights change, bottom up
  return y;                  // y is the new root of this part
}

// after inserting, on the way back up:
if (balance(n) < -1 && key > n->right->val)  return rotateLeft(n);
if (balance(n) >  1 && key < n->left->val)   return rotateRight(n);`,
      notes: [
        { token: "balance(n)", meaning: "left height minus right height. Must stay in -1, 0, 1" },
        { token: "y->left = x", meaning: "the swap itself. Three pointers move, nothing else" },
        { token: "update(x) before update(y)", meaning: "x is now below y, so its height must be fixed first" },
        { token: "return the new root", meaning: "the caller reattaches it. That is how the fix propagates up" },
      ],
      challenge: {
        prompt:
          "Write a left rotation. y is x's right child and becomes the new root of this part; x becomes y's left child, and y's old left subtree moves under x.",
        starter: `Node* rotateLeft(Node* x) {
  Node* y = x->right;
  x->right = ;
  y->left  = ;
  update(x); update(y);
  return ;
}`,
        rules: {
          regex: ["x->right\\s*=\\s*y->left", "y->left\\s*=\\s*x", "return\\s+y\\s*;"],
          hint:
            "y's old left subtree has to go somewhere — it belongs under x, on the right. Then x becomes y's left child, and y is returned as the new root.",
          success:
            "Correct, and the order matters: read y->left into x->right BEFORE overwriting y->left with x, or the subtree is lost. Check your work by walking the tree inorder — the sequence must be identical before and after.",
        },
        solution: `Node* rotateLeft(Node* x) {
  Node* y = x->right;
  x->right = y->left;
  y->left  = x;
  update(x); update(y);
  return y;
}`,
      },
    },
  ],
};

export const HEAP: TopicLesson = {
  id: "heap",
  title: "Heap",
  tagline: "Always know the largest, without keeping everything sorted.",
  why:
    "Many problems need repeated access to the current best item while new items keep arriving — the k largest, a median that updates, merging sorted lists, or Dijkstra's next-cheapest node. Sorting after every insertion is far too slow. A heap keeps just enough order to answer that one question in O(1), and to update in O(log n).",
  plain: [
    "A heap is a binary tree where every parent beats its children. In a max-heap the parent is larger; in a min-heap it is smaller.",
    "That is a much weaker promise than being sorted, and the weakness is exactly what makes it cheap to maintain.",
    "The largest item is always at the root, so peeking costs nothing.",
    "It is stored as a plain array, with no pointers: the children of index i live at 2i+1 and 2i+2, and the parent is at (i−1)/2.",
  ],
  needs: ["Trees and arrays.", "The idea that a tree can be flattened into an array."],
  costs: [
    { what: "Peek the max or min", time: "O(1)", note: "It is always at index 0." },
    { what: "Push", time: "O(log n)", note: "Add at the end, then climb." },
    { what: "Pop", time: "O(log n)", note: "Promote the last element, then sink." },
    { what: "Build from n items", time: "O(n)", note: "Heapify in place beats n pushes." },
    { what: "Heap sort", time: "O(n log n)", note: "In place, but not stable." },
  ],
  traps: [
    "C++ priority_queue is a max-heap by default. For a min-heap write priority_queue<int, vector<int>, greater<int>>.",
    "A heap is not sorted. Iterating its underlying array does not give sorted order — only repeated popping does.",
    "When sinking a node, always swap with the larger child. Swapping with the smaller one immediately breaks the rule again.",
    "For 'k largest', keep a min-heap capped at size k — that is O(n log k), better than sorting everything.",
  ],
  sections: [
    {
      id: "push",
      kicker: "01",
      title: "Add at the end, then climb",
      hook:
        "Add a value to a heap and keep the rule that every parent beats its children. Putting it at the root would break everything below. Where does it go?",
      body: [
        "At the very end of the array — the only place that keeps the tree complete, with no gaps.",
        "It probably breaks the rule with its parent, so compare with the parent at (i−1)/2 and swap if it is larger.",
        "Repeat upwards until the parent is bigger, or you reach the root. That is called sift-up or bubble-up.",
        "The number of swaps is at most the height of the tree, so pushing costs O(log n). A million items means twenty steps.",
        "Notice that the heap is never sorted at any point. It only ever maintains the parent-beats-child promise, which is far cheaper to keep.",
      ],
      viz: traceHeapPush([9, 7, 6, 3, 5], 8),
      example: `void push(vector<int>& h, int v) {
  h.push_back(v);
  int i = h.size() - 1;
  while (i > 0) {
    int parent = (i - 1) / 2;
    if (h[parent] >= h[i]) break;
    swap(h[i], h[parent]);
    i = parent;
  }
}

// in practice, just use:
priority_queue<int> maxHeap;
priority_queue<int, vector<int>, greater<int>> minHeap;`,
      notes: [
        { token: "(i - 1) / 2", meaning: "the parent index in the flat array" },
        { token: "break when parent wins", meaning: "the rule holds again — stop climbing" },
        { token: "greater<int>", meaning: "turns a max-heap into a min-heap" },
      ],
      challenge: {
        prompt:
          "Write the climb step for a max-heap push: find the parent, stop if it already wins, otherwise swap and continue.",
        starter: `h.push_back(v);
int i = h.size() - 1;

while (i > 0) {
  int parent = ;
  if ( ) break;
  swap(h[i], h[parent]);
  i = parent;
}`,
        rules: {
          regex: ["\\(\\s*i\\s*-\\s*1\\s*\\)\\s*/\\s*2", "h\\[parent\\]\\s*>=\\s*h\\[i\\]"],
          hint: "The parent index is (i - 1) / 2. Stop when h[parent] >= h[i], because the rule already holds.",
          success:
            "Correct. Stopping early matters: once one parent wins, everything above it already beats this value, so there is no reason to keep climbing.",
        },
        solution: `h.push_back(v);
int i = h.size() - 1;

while (i > 0) {
  int parent = (i - 1) / 2;
  if (h[parent] >= h[i]) break;
  swap(h[i], h[parent]);
  i = parent;
}`,
      },
    },
    {
      id: "pop",
      kicker: "02",
      title: "Remove the max, then sink",
      hook:
        "Take the largest value out. It is at the root, so removing it is easy — but that leaves a hole at the top of the tree. What fills it?",
      body: [
        "The last element in the array. It is the only removal that keeps the tree complete.",
        "It almost certainly does not belong at the root, so sink it down: compare with both children and swap with the larger one.",
        "Swapping with the larger child is essential. Swap with the smaller and the new parent is immediately smaller than its sibling — the rule is broken again straight away.",
        "Keep sinking until both children are smaller, or you reach the bottom. That is at most the height of the tree, so O(log n).",
        "Repeatedly popping gives heap sort: O(n log n), in place, with no extra array. It is not stable, which is why std::sort usually wins in practice.",
      ],
      viz: traceHeapPop([9, 8, 6, 3, 5, 1]),
      example: `int pop(vector<int>& h) {
  int top = h[0];
  h[0] = h.back(); h.pop_back();

  int i = 0, n = h.size();
  while (true) {
    int big = i, L = 2*i + 1, R = 2*i + 2;
    if (L < n && h[L] > h[big]) big = L;
    if (R < n && h[R] > h[big]) big = R;
    if (big == i) break;
    swap(h[i], h[big]);
    i = big;
  }
  return top;
}`,
      notes: [
        { token: "h[0] = h.back()", meaning: "promote the last element to fill the hole" },
        { token: "check both children", meaning: "then swap with the LARGER one" },
        { token: "if (big == i) break", meaning: "already bigger than both — settled" },
      ],
      challenge: {
        prompt:
          "Write the sink step: find the largest among the node and its two children, then swap if the node is not already the largest.",
        starter: `int big = i, L = 2*i + 1, R = 2*i + 2;

if (L < n && ) big = L;
if (R < n && ) big = R;
if (big == i) break;
swap(h[i], h[big]);
i = big;`,
        rules: {
          regex: ["h\\[L\\]\\s*>\\s*h\\[big\\]", "h\\[R\\]\\s*>\\s*h\\[big\\]"],
          hint:
            "Compare against h[big], not h[i]. That way the second check compares the right child against whichever of the node and left child is currently winning.",
          success:
            "Correct. Comparing against h[big] rather than h[i] is what makes the two checks together find the true maximum of the three.",
        },
        solution: `int big = i, L = 2*i + 1, R = 2*i + 2;

if (L < n && h[L] > h[big]) big = L;
if (R < n && h[R] > h[big]) big = R;
if (big == i) break;
swap(h[i], h[big]);
i = big;`,
      },
    },
  ],
};

export const RANGE_QUERY: TopicLesson = {
  id: "range-query",
  title: "Range Query",
  tagline: "When prefix sums die because the array keeps changing.",
  why:
    "Prefix sums answer range questions instantly, but one update forces a full rebuild. When a problem interleaves queries and updates — a hundred thousand of each — you need a structure that handles both in O(log n). That is what segment trees and Fenwick trees are for.",
  plain: [
    "A segment tree is a binary tree where every node owns a range of the array.",
    "Leaves own a single element. Each parent stores its two children combined — summed, or min, or max.",
    "A query walks down, taking whole nodes when their range fits entirely inside the question. That touches about log n nodes.",
    "An update changes one leaf and then fixes the nodes on the path back to the root — again about log n of them.",
  ],
  needs: ["Trees and recursion.", "Prefix sums, so you can see what this is fixing."],
  costs: [
    { what: "Build", time: "O(n)", note: "Each node is computed once." },
    { what: "Range query", time: "O(log n)", note: "At most two nodes per level are partially covered." },
    { what: "Point update", time: "O(log n)", note: "Only the path to the root changes." },
    { what: "Range update with lazy propagation", time: "O(log n)", note: "Postpone pushing changes down until needed." },
    { what: "Fenwick tree", time: "O(log n)", note: "Only for prefix-style operations, but far shorter to write." },
  ],
  traps: [
    "Reach for this only after proving a simpler method will not do. If the array never changes, prefix sums or a sparse table are simpler and faster.",
    "Size the array as 4n. The tree is not perfectly complete, and 2n is not always enough.",
    "Range updates need lazy propagation. Doing them naively is O(n log n) per update and defeats the point.",
    "A Fenwick tree is much shorter to write and covers most competition needs. Prefer it when the operation is invertible, like a sum.",
  ],
  sections: [
    {
      id: "segtree",
      kicker: "01",
      title: "Every node owns a range",
      hook:
        "A hundred thousand range-sum queries mixed with a hundred thousand updates. Prefix sums make queries free but each update costs a full rebuild. What structure makes both cheap?",
      body: [
        "Build a binary tree over the array. The root owns the whole thing, its children own each half, and so on down to leaves owning one element each.",
        "Each node stores the combination of its range — the sum, say. A parent is simply its two children combined.",
        "To query a range: if a node's range lies entirely inside the question, take its stored value and stop. If it lies entirely outside, return the identity and stop. Otherwise ask both children.",
        "Only about two nodes per level are ever partially covered, so a query touches O(log n) nodes.",
        "To update one element, change the leaf and recompute its ancestors on the way back up. Only log n nodes are wrong, not the whole structure.",
        "Change the combining function and the same tree answers different questions — sum, minimum, maximum, greatest common divisor. Only the merge step differs.",
      ],
      viz: traceSegmentTree([3, 1, 4, 1, 5, 9, 2, 6]),
      example: `void build(int node, int l, int r) {
  if (l == r) { tree[node] = a[l]; return; }
  int m = (l + r) / 2;
  build(2*node, l, m);
  build(2*node + 1, m + 1, r);
  tree[node] = tree[2*node] + tree[2*node + 1];
}

long long query(int node, int l, int r, int ql, int qr) {
  if (qr < l || r < ql) return 0;              // no overlap
  if (ql <= l && r <= qr) return tree[node];   // fully inside
  int m = (l + r) / 2;
  return query(2*node, l, m, ql, qr)
       + query(2*node + 1, m + 1, r, ql, qr);
}`,
      notes: [
        { token: "vector<long long> tree(4 * n)", meaning: "4n is the safe size" },
        { token: "no overlap → identity", meaning: "0 for sums, INT_MAX for minimums" },
        { token: "fully inside → stored value", meaning: "this is where the log n comes from" },
        { token: "2*node, 2*node+1", meaning: "children, with the root at index 1" },
      ],
      challenge: {
        prompt:
          "Write the two early exits of a segment tree query: no overlap, and fully covered.",
        starter: `long long query(int node, int l, int r, int ql, int qr) {
  if ( ) return 0;
  if ( ) return tree[node];
  int m = (l + r) / 2;
  return query(2*node, l, m, ql, qr) + query(2*node+1, m+1, r, ql, qr);
}`,
        rules: {
          regex: ["qr\\s*<\\s*l\\s*\\|\\|\\s*r\\s*<\\s*ql", "ql\\s*<=\\s*l\\s*&&\\s*r\\s*<=\\s*qr"],
          hint:
            "No overlap when qr < l || r < ql. Fully covered when ql <= l && r <= qr — the node's range sits inside the query's range.",
          success:
            "Correct. The fully-covered case is what keeps this at O(log n): the moment a node is entirely inside the question, its whole subtree is answered in one read.",
        },
        solution: `long long query(int node, int l, int r, int ql, int qr) {
  if (qr < l || r < ql) return 0;
  if (ql <= l && r <= qr) return tree[node];
  int m = (l + r) / 2;
  return query(2*node, l, m, ql, qr) + query(2*node+1, m+1, r, ql, qr);
}`,
      },
    },
  ],
};
