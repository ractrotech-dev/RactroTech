import type { ChapterAlt } from "@/lib/dsa/lessons/i18n";

// Binary Tree, BST and Heap, in the five languages other than C++.

export const BINARY_TREE_ALT: ChapterAlt = {
  traversal: {
    c: {
      example: `void preorder(struct Node *n)  { if (!n) return; visit(n); preorder(n->left);  preorder(n->right); }
void inorder(struct Node *n)   { if (!n) return; inorder(n->left);  visit(n); inorder(n->right); }
void postorder(struct Node *n) { if (!n) return; postorder(n->left); postorder(n->right); visit(n); }`,
      notes: [
        { token: "if (!n) return", meaning: "the base case — a missing child is an empty tree" },
        { token: "where visit(n) sits", meaning: "first, middle or last. That is the only difference" },
        { token: "level order", meaning: "needs a queue, which in C means an array plus head and tail" },
      ],
      vizCode: `void in(struct Node *n) {
  if (!n) return;
  in(n->left);
  printf("%d", n->val);   /* me in the middle */
  in(n->right);
}`,
      starter: `void inorder(struct Node *n) {
  if ( ) return;
  ;
  printf("%d ", n->val);
  ;
}`,
      rules: {
        regex: ["!n|n\\s*==\\s*NULL", "inorder\\s*\\(\\s*n->left\\s*\\)", "inorder\\s*\\(\\s*n->right\\s*\\)"],
        hint: "Base case: if (!n) return; Then inorder(n->left); the printf; then inorder(n->right);",
        success:
          "Correct. Move the printf above the left call and you have preorder; below the right call and you have postorder. One function, three answers.",
      },
      solution: `void inorder(struct Node *n) {
  if (!n) return;
  inorder(n->left);
  printf("%d ", n->val);
  inorder(n->right);
}`,
    },

    python: {
      example: `def preorder(n):
    if not n: return
    visit(n); preorder(n.left); preorder(n.right)

def inorder(n):
    if not n: return
    inorder(n.left); visit(n); inorder(n.right)

def postorder(n):
    if not n: return
    postorder(n.left); postorder(n.right); visit(n)`,
      notes: [
        { token: "if not n: return", meaning: "the base case — None is treated as false" },
        { token: "where visit(n) sits", meaning: "first, middle or last. That is the only difference" },
        { token: "recursion limit", meaning: "a tree deeper than ~1000 needs sys.setrecursionlimit or a loop" },
        { token: "yield instead of visit", meaning: "makes it a generator, so you can stop part-way" },
      ],
      vizCode: `def in_order(n):
    if not n: return
    in_order(n.left)
    print(n.val)          # me in the middle
    in_order(n.right)`,
      starter: `def inorder(n):
    if :
        return
    
    print(n.val, end=" ")
    `,
      rules: {
        regex: ["not\\s+n|n\\s+is\\s+None", "inorder\\s*\\(\\s*n\\.left\\s*\\)", "inorder\\s*\\(\\s*n\\.right\\s*\\)"],
        hint: "Base case: if not n: return. Then inorder(n.left), the print, then inorder(n.right).",
        success:
          "Correct. Python's default recursion limit is about 1000, so a long, unbalanced tree will stop your program. Balanced trees are nowhere near that deep.",
      },
      solution: `def inorder(n):
    if not n:
        return
    inorder(n.left)
    print(n.val, end=" ")
    inorder(n.right)`,
    },

    java: {
      example: `static void preorder(Node n)  { if (n == null) return; visit(n); preorder(n.left);  preorder(n.right); }
static void inorder(Node n)   { if (n == null) return; inorder(n.left);  visit(n); inorder(n.right); }
static void postorder(Node n) { if (n == null) return; postorder(n.left); postorder(n.right); visit(n); }`,
      notes: [
        { token: "if (n == null) return", meaning: "the base case — a missing child is an empty tree" },
        { token: "where visit(n) sits", meaning: "first, middle or last. That is the only difference" },
        { token: "level order", meaning: "use a Queue<Node>, usually an ArrayDeque" },
      ],
      vizCode: `static void in(Node n) {
  if (n == null) return;
  in(n.left);
  System.out.print(n.val);   // me in the middle
  in(n.right);
}`,
      starter: `static void inorder(Node n) {
  if ( ) return;
  ;
  System.out.print(n.val + " ");
  ;
}`,
      rules: {
        regex: ["n\\s*==\\s*null", "inorder\\s*\\(\\s*n\\.left\\s*\\)", "inorder\\s*\\(\\s*n\\.right\\s*\\)"],
        hint: "Base case: if (n == null) return; Then inorder(n.left); the print; then inorder(n.right);",
        success:
          "Correct. Java's default stack handles a few thousand levels — fine for balanced trees, and a real risk for a degenerate one.",
      },
      solution: `static void inorder(Node n) {
  if (n == null) return;
  inorder(n.left);
  System.out.print(n.val + " ");
  inorder(n.right);
}`,
    },

    javascript: {
      example: `function preorder(n)  { if (!n) return; visit(n); preorder(n.left);  preorder(n.right); }
function inorder(n)   { if (!n) return; inorder(n.left);  visit(n); inorder(n.right); }
function postorder(n) { if (!n) return; postorder(n.left); postorder(n.right); visit(n); }`,
      notes: [
        { token: "if (!n) return", meaning: "the base case — null and undefined are both false" },
        { token: "where visit(n) sits", meaning: "first, middle or last. That is the only difference" },
        { token: "call stack", meaning: "about 10000 levels deep before it overflows" },
        { token: "function*", meaning: "makes it a generator, so the caller can stop part-way" },
      ],
      vizCode: `function inOrder(n) {
  if (!n) return;
  inOrder(n.left);
  console.log(n.val);   // me in the middle
  inOrder(n.right);
}`,
      starter: `function inorder(n) {
  if ( ) return;
  ;
  process.stdout.write(n.val + " ");
  ;
}`,
      rules: {
        regex: ["!n|n\\s*===?\\s*null", "inorder\\s*\\(\\s*n\\.left\\s*\\)", "inorder\\s*\\(\\s*n\\.right\\s*\\)"],
        hint: "Base case: if (!n) return; Then inorder(n.left); the print; then inorder(n.right);",
        success:
          "Correct. `if (!n)` catches null and undefined together, which is handy — a missing child might be either, depending on how the tree was built.",
      },
      solution: `function inorder(n) {
  if (!n) return;
  inorder(n.left);
  process.stdout.write(n.val + " ");
  inorder(n.right);
}`,
    },

    rust: {
      example: `type Link = Option<Box<Node>>;

fn inorder(n: &Link) {
    if let Some(node) = n {
        inorder(&node.left);
        println!("{}", node.val);   // me in the middle
        inorder(&node.right);
    }
}`,
      notes: [
        { token: "Option<Box<Node>>", meaning: "Some(node) or None. Rust has no null" },
        { token: "if let Some(node)", meaning: "the base case and the unwrap, in one line" },
        { token: "&node.left", meaning: "borrow. Passing by value would move the subtree out" },
        { token: "where the println sits", meaning: "first, middle or last. That is the only difference" },
      ],
      vizCode: `fn in_order(n: &Link) {
    if n.is_none() { return; }
    in_order(&n.as_ref().unwrap().left);
    println!("{}", n.as_ref().unwrap().val);
    in_order(&n.as_ref().unwrap().right);
}`,
      prompt:
        "Write an inorder traversal: left subtree, then this node, then the right subtree. Use if let for the base case.",
      starter: `fn inorder(n: &Link) {
    if let Some(node) = n {
        ;
        println!("{}", node.val);
        ;
    }
}`,
      rules: {
        regex: ["inorder\\s*\\(\\s*&node\\.left\\s*\\)", "inorder\\s*\\(\\s*&node\\.right\\s*\\)"],
        hint: "Recurse with inorder(&node.left) and inorder(&node.right). The & matters — without it the subtree would be moved out.",
        success:
          "Correct. `if let Some(node) = n` replaces the null check and the unwrap in one step, so there is no way to forget the empty case.",
      },
      solution: `fn inorder(n: &Link) {
    if let Some(node) = n {
        inorder(&node.left);
        println!("{}", node.val);
        inorder(&node.right);
    }
}`,
    },
  },

  combine: {
    c: {
      example: `int height(struct Node *n) {
  if (!n) return 0;
  int L = height(n->left);
  int R = height(n->right);
  return 1 + (L > R ? L : R);
}`,
      notes: [
        { token: "if (!n) return 0", meaning: "an empty tree has height 0" },
        { token: "1 + max(L, R)", meaning: "this node, plus the taller side" },
        { token: "L > R ? L : R", meaning: "C has no max() for ints — write it yourself" },
      ],
      vizCode: `int height(struct Node *n) {
  if (!n) return 0;
  int L = height(n->left);
  int R = height(n->right);
  return 1 + (L > R ? L : R);
}`,
      starter: `int countNodes(struct Node *n) {
  if ( ) return 0;
  return ;
}`,
      rules: {
        regex: ["!n|n\\s*==\\s*NULL", "1\\s*\\+\\s*countNodes\\s*\\(\\s*n->left\\s*\\)\\s*\\+\\s*countNodes\\s*\\(\\s*n->right\\s*\\)"],
        hint: "An empty tree has 0 nodes. Otherwise: 1 + countNodes(n->left) + countNodes(n->right).",
        success:
          "Correct. Compare it with height — the shape is identical, and only the combining step changed from max to +.",
      },
      solution: `int countNodes(struct Node *n) {
  if (!n) return 0;
  return 1 + countNodes(n->left) + countNodes(n->right);
}`,
    },

    python: {
      example: `def height(n):
    if not n:
        return 0
    L = height(n.left)
    R = height(n.right)
    return 1 + max(L, R)`,
      notes: [
        { token: "if not n: return 0", meaning: "an empty tree has height 0" },
        { token: "1 + max(L, R)", meaning: "this node, plus the taller side" },
        { token: "answers flow upward", meaning: "the root is the last to find out" },
        { token: "nonlocal best", meaning: "how you update an outer variable from inside a nested function" },
      ],
      vizCode: `def height(n):
    if not n: return 0
    L = height(n.left)
    R = height(n.right)
    return 1 + max(L, R)`,
      starter: `def count_nodes(n):
    if :
        return 0
    return `,
      rules: {
        regex: ["not\\s+n|n\\s+is\\s+None", "1\\s*\\+\\s*count_nodes\\s*\\(\\s*n\\.left\\s*\\)\\s*\\+\\s*count_nodes\\s*\\(\\s*n\\.right\\s*\\)"],
        hint: "An empty tree has 0 nodes. Otherwise: 1 + count_nodes(n.left) + count_nodes(n.right).",
        success:
          "Correct. When you need to update a running best from inside a helper, remember `nonlocal` — without it Python makes a new local variable and the outer one never changes.",
      },
      solution: `def count_nodes(n):
    if not n:
        return 0
    return 1 + count_nodes(n.left) + count_nodes(n.right)`,
    },

    java: {
      example: `static int height(Node n) {
  if (n == null) return 0;
  int L = height(n.left);
  int R = height(n.right);
  return 1 + Math.max(L, R);
}`,
      notes: [
        { token: "if (n == null) return 0", meaning: "an empty tree has height 0" },
        { token: "1 + Math.max(L, R)", meaning: "this node, plus the taller side" },
        { token: "answers flow upward", meaning: "the root is the last to find out" },
        { token: "a field for the best", meaning: "Java cannot change a local from a helper — use a field or a one-element array" },
      ],
      vizCode: `static int height(Node n) {
  if (n == null) return 0;
  int L = height(n.left);
  int R = height(n.right);
  return 1 + Math.max(L, R);
}`,
      starter: `static int countNodes(Node n) {
  if ( ) return 0;
  return ;
}`,
      rules: {
        regex: ["n\\s*==\\s*null", "1\\s*\\+\\s*countNodes\\s*\\(\\s*n\\.left\\s*\\)\\s*\\+\\s*countNodes\\s*\\(\\s*n\\.right\\s*\\)"],
        hint: "An empty tree has 0 nodes. Otherwise: 1 + countNodes(n.left) + countNodes(n.right).",
        success:
          "Correct. For diameter you also need a running best, and Java will not let a helper write to a local — use a field, or pass an int[1] and write to slot 0.",
      },
      solution: `static int countNodes(Node n) {
  if (n == null) return 0;
  return 1 + countNodes(n.left) + countNodes(n.right);
}`,
    },

    javascript: {
      example: `function height(n) {
  if (!n) return 0;
  const L = height(n.left);
  const R = height(n.right);
  return 1 + Math.max(L, R);
}`,
      notes: [
        { token: "if (!n) return 0", meaning: "an empty tree has height 0" },
        { token: "1 + Math.max(L, R)", meaning: "this node, plus the taller side" },
        { token: "answers flow upward", meaning: "the root is the last to find out" },
        { token: "a closure variable", meaning: "an inner function can update an outer let directly. No nonlocal needed" },
      ],
      vizCode: `function height(n) {
  if (!n) return 0;
  const L = height(n.left);
  const R = height(n.right);
  return 1 + Math.max(L, R);
}`,
      starter: `function countNodes(n) {
  if ( ) return 0;
  return ;
}`,
      rules: {
        regex: ["!n|n\\s*===?\\s*null", "1\\s*\\+\\s*countNodes\\s*\\(\\s*n\\.left\\s*\\)\\s*\\+\\s*countNodes\\s*\\(\\s*n\\.right\\s*\\)"],
        hint: "An empty tree has 0 nodes. Otherwise: 1 + countNodes(n.left) + countNodes(n.right).",
        success:
          "Correct. JavaScript makes the diameter version easy: a nested function can update an outer `let best` straight away, with no extra keyword.",
      },
      solution: `function countNodes(n) {
  if (!n) return 0;
  return 1 + countNodes(n.left) + countNodes(n.right);
}`,
    },

    rust: {
      example: `fn height(n: &Link) -> i32 {
    match n {
        None => 0,
        Some(node) => 1 + height(&node.left).max(height(&node.right)),
    }
}`,
      notes: [
        { token: "match n { None => 0, ... }", meaning: "the empty case must be handled — the compiler insists" },
        { token: ".max(...)", meaning: "a method on the number, not a free function" },
        { token: "&node.left", meaning: "borrow, so the subtree is not moved out" },
        { token: "answers flow upward", meaning: "the root is the last to find out" },
      ],
      vizCode: `fn height(n: &Link) -> i32 {
    match n {
        None => 0,
        Some(node) => {
            1 + height(&node.left).max(height(&node.right))
        } } }`,
      starter: `fn count_nodes(n: &Link) -> i32 {
    match n {
        None => 0,
        Some(node) => ,
    }
}`,
      rules: {
        regex: ["1\\s*\\+\\s*count_nodes\\s*\\(\\s*&node\\.left\\s*\\)\\s*\\+\\s*count_nodes\\s*\\(\\s*&node\\.right\\s*\\)"],
        hint: "An empty tree has 0 nodes. Otherwise: 1 + count_nodes(&node.left) + count_nodes(&node.right).",
        success:
          "Correct. match forces you to write the None arm, so the base case a tree function needs can never be left out by accident.",
      },
      solution: `fn count_nodes(n: &Link) -> i32 {
    match n {
        None => 0,
        Some(node) => 1 + count_nodes(&node.left) + count_nodes(&node.right),
    }
}`,
    },
  },
};

export const BST_ALT: ChapterAlt = {
  search: {
    c: {
      example: `struct Node *search(struct Node *n, int key) {
  while (n) {
    if (n->val == key) return n;
    n = key < n->val ? n->left : n->right;
  }
  return NULL;
}`,
      notes: [
        { token: "key < n->val", meaning: "smaller goes left — the rule, applied" },
        { token: "one comparison", meaning: "removes an entire subtree from consideration" },
        { token: "unbalanced", meaning: "insert sorted data and this becomes an O(n) walk" },
      ],
      vizCode: `while (n) {
  if (n->val == key) return n;
  n = key < n->val ? n->left : n->right;
}`,
      starter: `struct Node *search(struct Node *n, int key) {
  while (n) {
    if (n->val == key) return n;
    if ( ) n = n->left;
    else   n = n->right;
  }
  return NULL;
}`,
      rules: {
        regex: ["key\\s*<\\s*n->val"],
        hint: "Go left when key < n->val, otherwise go right.",
        success:
          "Correct. There is no third branch and no going back — the ordering rule guarantees only one direction can hold the key.",
      },
      solution: `struct Node *search(struct Node *n, int key) {
  while (n) {
    if (n->val == key) return n;
    if (key < n->val) n = n->left;
    else              n = n->right;
  }
  return NULL;
}`,
    },

    python: {
      example: `def search(n, key):
    while n:
        if n.val == key:
            return n
        n = n.left if key < n.val else n.right
    return None`,
      notes: [
        { token: "key < n.val", meaning: "smaller goes left — the rule, applied" },
        { token: "one comparison", meaning: "removes an entire subtree from consideration" },
        { token: "bisect", meaning: "on a sorted list, gives O(log n) search without any tree" },
        { token: "sortedcontainers", meaning: "the usual third-party answer when you need a real balanced tree" },
      ],
      vizCode: `while n:
    if n.val == key: return n
    n = n.left if key < n.val else n.right`,
      starter: `def search(n, key):
    while n:
        if n.val == key:
            return n
        if :
            n = n.left
        else:
            n = n.right
    return None`,
      rules: {
        regex: ["key\\s*<\\s*n\\.val"],
        hint: "Go left when key < n.val, otherwise go right.",
        success:
          "Correct. Python has no balanced tree in the standard library — for ordered data most people use bisect on a sorted list, or the sortedcontainers package.",
      },
      solution: `def search(n, key):
    while n:
        if n.val == key:
            return n
        if key < n.val:
            n = n.left
        else:
            n = n.right
    return None`,
    },

    java: {
      example: `static Node search(Node n, int key) {
  while (n != null) {
    if (n.val == key) return n;
    n = key < n.val ? n.left : n.right;
  }
  return null;
}`,
      notes: [
        { token: "key < n.val", meaning: "smaller goes left — the rule, applied" },
        { token: "one comparison", meaning: "removes an entire subtree from consideration" },
        { token: "TreeMap / TreeSet", meaning: "a balanced BST, already written. O(log n) guaranteed" },
        { token: "floorKey, ceilingKey", meaning: "why TreeMap is worth knowing — a HashMap cannot do these" },
      ],
      vizCode: `while (n != null) {
  if (n.val == key) return n;
  n = key < n.val ? n.left : n.right;
}`,
      starter: `static Node search(Node n, int key) {
  while (n != null) {
    if (n.val == key) return n;
    if ( ) n = n.left;
    else   n = n.right;
  }
  return null;
}`,
      rules: {
        regex: ["key\\s*<\\s*n\\.val"],
        hint: "Go left when key < n.val, otherwise go right.",
        success:
          "Correct. In real Java use TreeMap: it is a self-balancing BST, so it stays O(log n) whatever order you insert in — and it gives you floorKey and ceilingKey for free.",
      },
      solution: `static Node search(Node n, int key) {
  while (n != null) {
    if (n.val == key) return n;
    if (key < n.val) n = n.left;
    else             n = n.right;
  }
  return null;
}`,
    },

    javascript: {
      example: `function search(n, key) {
  while (n) {
    if (n.val === key) return n;
    n = key < n.val ? n.left : n.right;
  }
  return null;
}`,
      notes: [
        { token: "key < n.val", meaning: "smaller goes left — the rule, applied" },
        { token: "one comparison", meaning: "removes an entire subtree from consideration" },
        { token: "no built-in tree", meaning: "JavaScript has Map and Set, but neither keeps keys sorted" },
        { token: "a sorted array", meaning: "usually the practical answer, with binary search on top" },
      ],
      vizCode: `while (n) {
  if (n.val === key) return n;
  n = key < n.val ? n.left : n.right;
}`,
      starter: `function search(n, key) {
  while (n) {
    if (n.val === key) return n;
    if ( ) n = n.left;
    else   n = n.right;
  }
  return null;
}`,
      rules: {
        regex: ["key\\s*<\\s*n\\.val"],
        hint: "Go left when key < n.val, otherwise go right.",
        success:
          "Correct. JavaScript ships no ordered map at all, so if you need sorted keys you either write the tree yourself or keep a sorted array.",
      },
      solution: `function search(n, key) {
  while (n) {
    if (n.val === key) return n;
    if (key < n.val) n = n.left;
    else             n = n.right;
  }
  return null;
}`,
    },

    rust: {
      example: `fn search(mut n: &Link, key: i32) -> bool {
    while let Some(node) = n {
        if node.val == key { return true; }
        n = if key < node.val { &node.left } else { &node.right };
    }
    false
}`,
      notes: [
        { token: "key < node.val", meaning: "smaller goes left — the rule, applied" },
        { token: "&node.left", meaning: "borrow. Taking the value would move the subtree out" },
        { token: "BTreeMap / BTreeSet", meaning: "already written, ordered, and O(log n)" },
        { token: ".range(a..b)", meaning: "what BTreeMap gives you that HashMap cannot" },
      ],
      vizCode: `while let Some(node) = n {
    if node.val == key { return true; }
    n = if key < node.val { &node.left } else { &node.right };
}`,
      starter: `fn search(mut n: &Link, key: i32) -> bool {
    while let Some(node) = n {
        if node.val == key { return true; }
        n = if  { &node.left } else { &node.right };
    }
    false
}`,
      rules: {
        regex: ["key\\s*<\\s*node\\.val"],
        hint: "Go left when key < node.val, otherwise go right.",
        success:
          "Correct. Real Rust uses BTreeMap — ordered, balanced, and it gives you .range(a..b) for asking about a span of keys.",
      },
      solution: `fn search(mut n: &Link, key: i32) -> bool {
    while let Some(node) = n {
        if node.val == key { return true; }
        n = if key < node.val { &node.left } else { &node.right };
    }
    false
}`,
    },
  },

  inorder: {
    c: {
      example: `void inorder(struct Node *n, int out[], int *k) {
  if (!n) return;
  inorder(n->left, out, k);
  out[(*k)++] = n->val;      /* values arrive in sorted order */
  inorder(n->right, out, k);
}`,
      notes: [
        { token: "left, node, right", meaning: "smaller values first, always" },
        { token: "int *k", meaning: "a pointer, so the count survives across calls" },
        { token: "validate", meaning: "check the inorder sequence is strictly increasing" },
      ],
      vizCode: `void in(struct Node *n) {
  if (!n) return;
  in(n->left);
  printf("%d", n->val);
  in(n->right);
}`,
      starter: `int valid(struct Node *n, long lo, long hi) {
  if (!n) return 1;
  if (n->val <= lo || n->val >= hi) return 0;
  return valid(n->left, lo, ) &&
         valid(n->right, , hi);
}`,
      rules: {
        regex: ["valid\\s*\\(\\s*n->left\\s*,\\s*lo\\s*,\\s*n->val\\s*\\)", "valid\\s*\\(\\s*n->right\\s*,\\s*n->val\\s*,\\s*hi\\s*\\)"],
        hint:
          "Everything on the left must stay below n->val, so pass it as the new upper bound. Everything on the right must stay above it, so pass it as the new lower bound.",
        success:
          "Correct. Use long for the bounds: with int, a node holding INT_MIN or INT_MAX would fail against its own limit.",
      },
      solution: `int valid(struct Node *n, long lo, long hi) {
  if (!n) return 1;
  if (n->val <= lo || n->val >= hi) return 0;
  return valid(n->left, lo, n->val) &&
         valid(n->right, n->val, hi);
}`,
    },

    python: {
      example: `def inorder(n, out):
    if not n: return
    inorder(n.left, out)
    out.append(n.val)      # values arrive in sorted order
    inorder(n.right, out)


# k-th smallest, without building the whole list
def kth(n):
    if not n: return
    kth(n.left)
    ...`,
      notes: [
        { token: "left, node, right", meaning: "smaller values first, always" },
        { token: "float('-inf'), float('inf')", meaning: "the natural starting bounds. No integer limit to worry about" },
        { token: "yield from", meaning: "makes it a generator, so k-th smallest can stop early" },
        { token: "validate", meaning: "check the inorder sequence is strictly increasing" },
      ],
      vizCode: `def in_order(n):
    if not n: return
    in_order(n.left)
    print(n.val)
    in_order(n.right)`,
      prompt:
        "Validate a BST by checking each node against a permitted range. Comparing only with the immediate children is not enough.",
      starter: `def valid(n, lo, hi):
    if not n:
        return True
    if n.val <= lo or n.val >= hi:
        return False
    return valid(n.left, lo, ) and \\
           valid(n.right, , hi)`,
      rules: {
        regex: ["valid\\s*\\(\\s*n\\.left\\s*,\\s*lo\\s*,\\s*n\\.val\\s*\\)", "valid\\s*\\(\\s*n\\.right\\s*,\\s*n\\.val\\s*,\\s*hi\\s*\\)"],
        hint:
          "Everything on the left must stay below n.val, so pass it as the new upper bound. Everything on the right must stay above it, so pass it as the new lower bound.",
        success:
          "Correct, and Python makes the bounds easy: start with float('-inf') and float('inf') and there is no integer limit to trip over.",
      },
      solution: `def valid(n, lo, hi):
    if not n:
        return True
    if n.val <= lo or n.val >= hi:
        return False
    return valid(n.left, lo, n.val) and \\
           valid(n.right, n.val, hi)`,
    },

    java: {
      example: `static void inorder(Node n, List<Integer> out) {
  if (n == null) return;
  inorder(n.left, out);
  out.add(n.val);          // values arrive in sorted order
  inorder(n.right, out);
}`,
      notes: [
        { token: "left, node, right", meaning: "smaller values first, always" },
        { token: "long bounds", meaning: "with int, a node holding Integer.MIN_VALUE fails against its own limit" },
        { token: "TreeSet iteration", meaning: "already gives you sorted order, for free" },
        { token: "validate", meaning: "check the inorder sequence is strictly increasing" },
      ],
      vizCode: `static void in(Node n) {
  if (n == null) return;
  in(n.left);
  System.out.print(n.val);
  in(n.right);
}`,
      starter: `static boolean valid(Node n, long lo, long hi) {
  if (n == null) return true;
  if (n.val <= lo || n.val >= hi) return false;
  return valid(n.left, lo, ) &&
         valid(n.right, , hi);
}`,
      rules: {
        regex: ["valid\\s*\\(\\s*n\\.left\\s*,\\s*lo\\s*,\\s*n\\.val\\s*\\)", "valid\\s*\\(\\s*n\\.right\\s*,\\s*n\\.val\\s*,\\s*hi\\s*\\)"],
        hint:
          "Everything on the left must stay below n.val, so pass it as the new upper bound. Everything on the right must stay above it, so pass it as the new lower bound.",
        success:
          "Correct, and the long bounds are the detail interviewers look for: with int, a node holding Integer.MIN_VALUE would be rejected by its own starting limit.",
      },
      solution: `static boolean valid(Node n, long lo, long hi) {
  if (n == null) return true;
  if (n.val <= lo || n.val >= hi) return false;
  return valid(n.left, lo, n.val) &&
         valid(n.right, n.val, hi);
}`,
    },

    javascript: {
      example: `function inorder(n, out) {
  if (!n) return;
  inorder(n.left, out);
  out.push(n.val);         // values arrive in sorted order
  inorder(n.right, out);
}`,
      notes: [
        { token: "left, node, right", meaning: "smaller values first, always" },
        { token: "-Infinity, Infinity", meaning: "the natural starting bounds" },
        { token: "out.sort()", meaning: "not needed — inorder is already sorted" },
        { token: "validate", meaning: "check the inorder sequence is strictly increasing" },
      ],
      vizCode: `function inOrder(n) {
  if (!n) return;
  inOrder(n.left);
  console.log(n.val);
  inOrder(n.right);
}`,
      prompt:
        "Validate a BST by checking each node against a permitted range. Comparing only with the immediate children is not enough.",
      starter: `function valid(n, lo, hi) {
  if (!n) return true;
  if (n.val <= lo || n.val >= hi) return false;
  return valid(n.left, lo, ) &&
         valid(n.right, , hi);
}`,
      rules: {
        regex: ["valid\\s*\\(\\s*n\\.left\\s*,\\s*lo\\s*,\\s*n\\.val\\s*\\)", "valid\\s*\\(\\s*n\\.right\\s*,\\s*n\\.val\\s*,\\s*hi\\s*\\)"],
        hint:
          "Everything on the left must stay below n.val, so pass it as the new upper bound. Everything on the right must stay above it, so pass it as the new lower bound.",
        success:
          "Correct. Start the call with -Infinity and Infinity — JavaScript has real infinities, so there is no edge case at the extremes.",
      },
      solution: `function valid(n, lo, hi) {
  if (!n) return true;
  if (n.val <= lo || n.val >= hi) return false;
  return valid(n.left, lo, n.val) &&
         valid(n.right, n.val, hi);
}`,
    },

    rust: {
      example: `fn inorder(n: &Link, out: &mut Vec<i32>) {
    if let Some(node) = n {
        inorder(&node.left, out);
        out.push(node.val);        // values arrive in sorted order
        inorder(&node.right, out);
    }
}`,
      notes: [
        { token: "left, node, right", meaning: "smaller values first, always" },
        { token: "i64::MIN, i64::MAX", meaning: "the starting bounds, wider than the values themselves" },
        { token: "out: &mut Vec<i32>", meaning: "borrowed so it can be added to, without copying" },
        { token: "validate", meaning: "check the inorder sequence is strictly increasing" },
      ],
      vizCode: `fn in_order(n: &Link) {
    if let Some(node) = n {
        in_order(&node.left);
        println!("{}", node.val);
        in_order(&node.right);
    } }`,
      prompt:
        "Validate a BST by checking each node against a permitted range. Comparing only with the immediate children is not enough.",
      starter: `fn valid(n: &Link, lo: i64, hi: i64) -> bool {
    match n {
        None => true,
        Some(node) => {
            let v = node.val as i64;
            if v <= lo || v >= hi { return false; }
            valid(&node.left, lo, ) &&
            valid(&node.right, , hi)
        }
    }
}`,
      rules: {
        regex: ["valid\\s*\\(\\s*&node\\.left\\s*,\\s*lo\\s*,\\s*v\\s*\\)", "valid\\s*\\(\\s*&node\\.right\\s*,\\s*v\\s*,\\s*hi\\s*\\)"],
        hint:
          "Everything on the left must stay below v, so pass v as the new upper bound. Everything on the right must stay above it, so pass v as the new lower bound.",
        success:
          "Correct, and the `as i64` matters for the same reason as Java's long: a node holding i32::MIN would otherwise be rejected by its own starting bound.",
      },
      solution: `fn valid(n: &Link, lo: i64, hi: i64) -> bool {
    match n {
        None => true,
        Some(node) => {
            let v = node.val as i64;
            if v <= lo || v >= hi { return false; }
            valid(&node.left, lo, v) &&
            valid(&node.right, v, hi)
        }
    }
}`,
    },
  },

  avl: {
    c: {
      example: `int height(struct Node *n) { return n ? n->h : 0; }
int balance(struct Node *n) { return height(n->left) - height(n->right); }

struct Node *rotateLeft(struct Node *x) {
  struct Node *y = x->right;
  x->right = y->left;
  y->left  = x;
  update(x); update(y);
  return y;
}`,
      notes: [
        { token: "balance(n)", meaning: "left height minus right height. Must stay in -1, 0, 1" },
        { token: "n ? n->h : 0", meaning: "an empty subtree has height 0. Guard before dereferencing" },
        { token: "store the height", meaning: "recomputing it every time would make inserts O(n log n)" },
        { token: "return the new root", meaning: "the caller reattaches it. That is how the fix travels up" },
      ],
      starter: `struct Node *rotateLeft(struct Node *x) {
  struct Node *y = x->right;
  x->right = ;
  y->left  = ;
  update(x); update(y);
  return ;
}`,
      rules: {
        regex: ["x->right\\s*=\\s*y->left", "y->left\\s*=\\s*x", "return\\s+y\\s*;"],
        hint: "y's old left subtree belongs under x on the right. Then x becomes y's left child, and y is returned.",
        success:
          "Correct, and the order matters: read y->left into x->right BEFORE overwriting y->left, or the subtree is lost with no way back — and in C, leaked as well.",
      },
      solution: `struct Node *rotateLeft(struct Node *x) {
  struct Node *y = x->right;
  x->right = y->left;
  y->left  = x;
  update(x); update(y);
  return y;
}`,
    },

    python: {
      body: [
        "Because each value was bigger than the last, so each went right, and the tree is a straight line. Structurally it is a list wearing a tree costume.",
        "That is not a rare edge case. Inserting already-sorted data is one of the most ordinary things a program does, and it produces the worst possible tree every time.",
        "An AVL tree stops it. Every node stores the height of each side, and the difference between them must never exceed 1. When an insert breaks that rule, a rotation fixes it — a small rearrangement that changes the SHAPE without changing the ordering.",
        "There are four cases but really only two. Right-right and left-left need one rotation. The zig-zag cases need the child rotated first, turning them into a simple case.",
        "A rotation is O(1) and the walk back up is O(log n), so the guarantee is nearly free.",
        "Python is the odd one out here: it has no balanced tree in the standard library at all. dict and set are hash tables, which are O(1) but have no order. When you need sorted keys, most people reach for the sortedcontainers package, or keep a plain list sorted and use bisect.",
      ],
      example: `def height(n):
    return n.h if n else 0

def balance(n):
    return height(n.left) - height(n.right)

def rotate_left(x):
    y = x.right
    x.right = y.left        # y's left subtree moves under x
    y.left  = x             # x becomes y's left child
    update(x); update(y)    # heights change, bottom up
    return y                # y is the new root of this part`,
      notes: [
        { token: "balance(n)", meaning: "left height minus right height. Must stay in -1, 0, 1" },
        { token: "n.h if n else 0", meaning: "an empty subtree has height 0" },
        { token: "no balanced tree built in", meaning: "dict and set are hash tables. There is no ordered map" },
        { token: "bisect.insort", meaning: "keeps a plain list sorted. O(n) per insert, but very fast in practice" },
      ],
      prompt:
        "Write a left rotation. y is x's right child and becomes the new root of this part; x becomes y's left child, and y's old left subtree moves under x.",
      starter: `def rotate_left(x):
    y = x.right
    x.right = 
    y.left  = 
    update(x); update(y)
    return `,
      rules: {
        regex: ["x\\.right\\s*=\\s*y\\.left", "y\\.left\\s*=\\s*x", "return\\s+y"],
        hint: "y's old left subtree belongs under x on the right. Then x becomes y's left child, and y is returned.",
        success:
          "Correct. Check your work with an inorder walk — it must produce exactly the same sequence before and after. A rotation that changes the order is a broken rotation.",
      },
      solution: `def rotate_left(x):
    y = x.right
    x.right = y.left
    y.left  = x
    update(x); update(y)
    return y`,
    },

    java: {
      example: `static int height(Node n) { return n == null ? 0 : n.h; }
static int balance(Node n) { return height(n.left) - height(n.right); }

static Node rotateLeft(Node x) {
  Node y = x.right;
  x.right = y.left;
  y.left  = x;
  update(x); update(y);
  return y;
}`,
      notes: [
        { token: "balance(n)", meaning: "left height minus right height. Must stay in -1, 0, 1" },
        { token: "n == null ? 0 : n.h", meaning: "an empty subtree has height 0" },
        { token: "TreeMap / TreeSet", meaning: "red-black trees. Same O(log n) guarantee, already written" },
        { token: "red-black vs AVL", meaning: "AVL is more strictly balanced, so faster lookups and slower inserts" },
      ],
      starter: `static Node rotateLeft(Node x) {
  Node y = x.right;
  x.right = ;
  y.left  = ;
  update(x); update(y);
  return ;
}`,
      rules: {
        regex: ["x\\.right\\s*=\\s*y\\.left", "y\\.left\\s*=\\s*x", "return\\s+y\\s*;"],
        hint: "y's old left subtree belongs under x on the right. Then x becomes y's left child, and y is returned.",
        success:
          "Correct. Java's TreeMap uses a red-black tree rather than AVL — less strictly balanced, so lookups are slightly slower and inserts slightly faster. Both guarantee O(log n).",
      },
      solution: `static Node rotateLeft(Node x) {
  Node y = x.right;
  x.right = y.left;
  y.left  = x;
  update(x); update(y);
  return y;
}`,
    },

    javascript: {
      example: `function height(n) { return n ? n.h : 0; }
function balance(n) { return height(n.left) - height(n.right); }

function rotateLeft(x) {
  const y = x.right;
  x.right = y.left;        // y's left subtree moves under x
  y.left  = x;             // x becomes y's left child
  update(x); update(y);    // heights change, bottom up
  return y;                // y is the new root of this part
}`,
      notes: [
        { token: "balance(n)", meaning: "left height minus right height. Must stay in -1, 0, 1" },
        { token: "n ? n.h : 0", meaning: "an empty subtree has height 0" },
        { token: "no ordered map at all", meaning: "Map keeps insertion order, not sorted order" },
        { token: "a sorted array", meaning: "usually the practical answer, with binary search on top" },
      ],
      prompt:
        "Write a left rotation. y is x's right child and becomes the new root of this part; x becomes y's left child, and y's old left subtree moves under x.",
      starter: `function rotateLeft(x) {
  const y = x.right;
  x.right = ;
  y.left  = ;
  update(x); update(y);
  return ;
}`,
      rules: {
        regex: ["x\\.right\\s*=\\s*y\\.left", "y\\.left\\s*=\\s*x", "return\\s+y\\s*;"],
        hint: "y's old left subtree belongs under x on the right. Then x becomes y's left child, and y is returned.",
        success:
          "Correct. JavaScript ships no ordered map of any kind, so if you genuinely need sorted keys you either write this tree or keep a sorted array — there is no third option in the standard library.",
      },
      solution: `function rotateLeft(x) {
  const y = x.right;
  x.right = y.left;
  y.left  = x;
  update(x); update(y);
  return y;
}`,
    },

    rust: {
      example: `type Link = Option<Box<Node>>;

fn height(n: &Link) -> i32 {
    n.as_ref().map_or(0, |node| node.h)
}

fn rotate_left(mut x: Box<Node>) -> Box<Node> {
    let mut y = x.right.take().unwrap();   // take y OUT of x
    x.right = y.left.take();               // y's left moves under x
    update(&mut x);
    y.left = Some(x);                      // x becomes y's left child
    update(&mut y);
    y                                      // y is the new root
}`,
      notes: [
        { token: ".take()", meaning: "moves the subtree out and leaves None. Rust has one owner, so you MOVE" },
        { token: "map_or(0, ...)", meaning: "0 for an empty subtree, otherwise read the height" },
        { token: "Box<Node> in and out", meaning: "ownership passes through the function and comes back" },
        { token: "BTreeMap", meaning: "a B-tree, not AVL. Fewer, fatter nodes — better for the cache" },
      ],
      prompt:
        "Write a left rotation. Because Rust allows one owner, each subtree has to be taken out with .take() before it can be reattached.",
      starter: `fn rotate_left(mut x: Box<Node>) -> Box<Node> {
    let mut y = x.right.take().unwrap();
    x.right = ;
    update(&mut x);
    y.left = ;
    update(&mut y);
    
}`,
      rules: {
        regex: ["x\\.right\\s*=\\s*y\\.left\\.take\\s*\\(\\s*\\)", "y\\.left\\s*=\\s*Some\\s*\\(\\s*x\\s*\\)", "^\\s*y\\s*\\}|\\s+y\\s*\\}"],
        hint: "Take y's left subtree out with y.left.take() and give it to x. Then y.left = Some(x), and the last line is just y.",
        success:
          "Correct, and notice Rust would not let you get the order wrong: once x has been moved into y.left, the compiler will not let you touch x again. The lost-subtree bug that other languages allow simply cannot compile.",
      },
      solution: `fn rotate_left(mut x: Box<Node>) -> Box<Node> {
    let mut y = x.right.take().unwrap();
    x.right = y.left.take();
    update(&mut x);
    y.left = Some(x);
    update(&mut y);
    y
}`,
    },
  },
};

export const HEAP_ALT: ChapterAlt = {
  push: {
    c: {
      example: `void push(int h[], int *n, int v) {
  h[*n] = v;
  int i = (*n)++;
  while (i > 0) {
    int parent = (i - 1) / 2;
    if (h[parent] >= h[i]) break;
    int t = h[i]; h[i] = h[parent]; h[parent] = t;
    i = parent;
  }
}`,
      notes: [
        { token: "(i - 1) / 2", meaning: "the parent index in the flat array" },
        { token: "break when the parent wins", meaning: "the rule holds again — stop climbing" },
        { token: "no built-in heap", meaning: "C leaves this to you, as with hash maps" },
      ],
      vizCode: `h[n] = v;
int i = n++;
while (i > 0 && h[(i - 1) / 2] < h[i]) {
  swap(h[i], h[(i - 1) / 2]);
  i = (i - 1) / 2;
}`,
      starter: `h[n] = v;
int i = n++;

while (i > 0) {
  int parent = ;
  if ( ) break;
  int t = h[i]; h[i] = h[parent]; h[parent] = t;
  i = parent;
}`,
      rules: {
        regex: ["\\(\\s*i\\s*-\\s*1\\s*\\)\\s*/\\s*2", "h\\[parent\\]\\s*>=\\s*h\\[i\\]"],
        hint: "The parent index is (i - 1) / 2. Stop when h[parent] >= h[i], because the rule already holds.",
        success:
          "Correct. Stopping early matters: once one parent wins, everything above it already beats this value, so there is nothing left to check.",
      },
      solution: `h[n] = v;
int i = n++;

while (i > 0) {
  int parent = (i - 1) / 2;
  if (h[parent] >= h[i]) break;
  int t = h[i]; h[i] = h[parent]; h[parent] = t;
  i = parent;
}`,
    },

    python: {
      example: `import heapq

h = []
heapq.heappush(h, 5)
heapq.heappush(h, 9)

print(h[0])                  # 5 — the SMALLEST. heapq is a MIN-heap
print(heapq.heappop(h))      # 5

# for a max-heap, push the negatives
heapq.heappush(h, -9)
biggest = -heapq.heappop(h)`,
      notes: [
        { token: "heapq is a MIN-heap", meaning: "the opposite of C++. h[0] is the smallest" },
        { token: "push the negatives", meaning: "the standard way to get a max-heap in Python" },
        { token: "heapify(list)", meaning: "turns a whole list into a heap in O(n)" },
        { token: "tuples as items", meaning: "(priority, value). Compared left to right" },
      ],
      vizCode: `h.append(v)
i = len(h) - 1
while i > 0 and h[(i - 1) // 2] < h[i]:
    h[i], h[(i-1)//2] = h[(i-1)//2], h[i]
    i = (i - 1) // 2`,
      prompt:
        "Write the climb step for a max-heap push by hand: find the parent, stop if it already wins, otherwise swap and carry on.",
      starter: `h.append(v)
i = len(h) - 1

while i > 0:
    parent = 
    if :
        break
    h[i], h[parent] = h[parent], h[i]
    i = parent`,
      rules: {
        mustNot: ["heapq"],
        regex: ["\\(\\s*i\\s*-\\s*1\\s*\\)\\s*//\\s*2", "h\\[parent\\]\\s*>=\\s*h\\[i\\]"],
        hint: "The parent index is (i - 1) // 2 — it must be //, since an index cannot be a decimal. Stop when h[parent] >= h[i].",
        success:
          "Correct. In real Python use heapq — but remember it is a MIN-heap, so for a max-heap you push -x and negate again on the way out.",
      },
      solution: `h.append(v)
i = len(h) - 1

while i > 0:
    parent = (i - 1) // 2
    if h[parent] >= h[i]:
        break
    h[i], h[parent] = h[parent], h[i]
    i = parent`,
    },

    java: {
      example: `PriorityQueue<Integer> minHeap = new PriorityQueue<>();
PriorityQueue<Integer> maxHeap =
    new PriorityQueue<>(Collections.reverseOrder());

minHeap.add(5);
minHeap.add(9);

System.out.println(minHeap.peek());   // 5 — the SMALLEST by default
System.out.println(minHeap.poll());   // 5`,
      notes: [
        { token: "PriorityQueue is a MIN-heap", meaning: "the opposite of C++. peek gives the smallest" },
        { token: "Collections.reverseOrder()", meaning: "how you get a max-heap" },
        { token: "iterating a PriorityQueue", meaning: "does NOT give sorted order. Only polling does" },
        { token: "(a, b) -> a.cost - b.cost", meaning: "a comparator, for your own objects" },
      ],
      vizCode: `h.add(v);
int i = h.size() - 1;
while (i > 0 && h.get((i-1)/2) < h.get(i)) {
  swap(h, i, (i - 1) / 2);
  i = (i - 1) / 2;
}`,
      prompt:
        "Write the climb step for a max-heap push by hand, using an int array: find the parent, stop if it already wins, otherwise swap and carry on.",
      starter: `h[n] = v;
int i = n++;

while (i > 0) {
  int parent = ;
  if ( ) break;
  int t = h[i]; h[i] = h[parent]; h[parent] = t;
  i = parent;
}`,
      rules: {
        mustNot: ["PriorityQueue"],
        regex: ["\\(\\s*i\\s*-\\s*1\\s*\\)\\s*/\\s*2", "h\\[parent\\]\\s*>=\\s*h\\[i\\]"],
        hint: "The parent index is (i - 1) / 2. Stop when h[parent] >= h[i], because the rule already holds.",
        success:
          "Correct. In real Java use PriorityQueue — and remember it is a min-heap, so a max-heap needs Collections.reverseOrder() passed in.",
      },
      solution: `h[n] = v;
int i = n++;

while (i > 0) {
  int parent = (i - 1) / 2;
  if (h[parent] >= h[i]) break;
  int t = h[i]; h[i] = h[parent]; h[parent] = t;
  i = parent;
}`,
    },

    javascript: {
      example: `// JavaScript has no heap at all. You write one, or use a library.

const h = [];

function push(v) {
  h.push(v);
  let i = h.length - 1;
  while (i > 0) {
    const parent = (i - 1) >> 1;
    if (h[parent] >= h[i]) break;
    [h[i], h[parent]] = [h[parent], h[i]];
    i = parent;
  }
}`,
      notes: [
        { token: "(i - 1) >> 1", meaning: "the parent index. >> 1 halves and floors in one step" },
        { token: "no built-in heap", meaning: "the one common structure JavaScript simply does not ship" },
        { token: "sort() on every insert", meaning: "the tempting wrong answer. That is O(n log n) per push" },
        { token: "break when the parent wins", meaning: "the rule holds again — stop climbing" },
      ],
      vizCode: `h.push(v);
let i = h.length - 1;
while (i > 0 && h[(i - 1) >> 1] < h[i]) {
  [h[i], h[(i-1)>>1]] = [h[(i-1)>>1], h[i]];
  i = (i - 1) >> 1;
}`,
      starter: `h.push(v);
let i = h.length - 1;

while (i > 0) {
  const parent = ;
  if ( ) break;
  [h[i], h[parent]] = [h[parent], h[i]];
  i = parent;
}`,
      rules: {
        mustNot: [".sort("],
        regex: ["\\(\\s*i\\s*-\\s*1\\s*\\)\\s*(>>\\s*1|\\/\\s*2)", "h\\[parent\\]\\s*>=\\s*h\\[i\\]"],
        hint:
          "The parent index is (i - 1) >> 1, or Math.floor((i - 1) / 2). Plain / 2 gives a decimal and breaks the indexing. Stop when h[parent] >= h[i].",
        success:
          "Correct, and this is worth knowing: JavaScript ships no heap, so Dijkstra and k-largest problems mean writing this yourself. Re-sorting on every push would be far slower.",
      },
      solution: `h.push(v);
let i = h.length - 1;

while (i > 0) {
  const parent = (i - 1) >> 1;
  if (h[parent] >= h[i]) break;
  [h[i], h[parent]] = [h[parent], h[i]];
  i = parent;
}`,
    },

    rust: {
      example: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

let mut h = BinaryHeap::new();
h.push(5);
h.push(9);

println!("{:?}", h.peek());   // Some(9) — the LARGEST. A max-heap
println!("{:?}", h.pop());    // Some(9)

// for a min-heap, wrap in Reverse
let mut min = BinaryHeap::new();
min.push(Reverse(5));`,
      notes: [
        { token: "BinaryHeap is a MAX-heap", meaning: "the same as C++, the opposite of Python and Java" },
        { token: "Reverse(x)", meaning: "the standard way to get a min-heap" },
        { token: ".peek()", meaning: "gives Option, so the empty case is built in" },
        { token: "into_sorted_vec()", meaning: "drains it in order when you are finished" },
      ],
      vizCode: `h.push(v);
let mut i = h.len() - 1;
while i > 0 && h[(i - 1) / 2] < h[i] {
    h.swap(i, (i - 1) / 2);
    i = (i - 1) / 2;
}`,
      prompt:
        "Write the climb step for a max-heap push by hand, using a Vec: find the parent, stop if it already wins, otherwise swap and carry on.",
      starter: `h.push(v);
let mut i = h.len() - 1;

while i > 0 {
    let parent = ;
    if  { break; }
    h.swap(i, parent);
    i = parent;
}`,
      rules: {
        mustNot: ["BinaryHeap"],
        regex: ["\\(\\s*i\\s*-\\s*1\\s*\\)\\s*/\\s*2", "h\\[parent\\]\\s*>=\\s*h\\[i\\]"],
        hint: "The parent index is (i - 1) / 2. Stop when h[parent] >= h[i], because the rule already holds.",
        success:
          "Correct. In real Rust use BinaryHeap — and note it is a max-heap, unlike Python's and Java's. For a min-heap, wrap the values in Reverse.",
      },
      solution: `h.push(v);
let mut i = h.len() - 1;

while i > 0 {
    let parent = (i - 1) / 2;
    if h[parent] >= h[i] { break; }
    h.swap(i, parent);
    i = parent;
}`,
    },
  },

  pop: {
    c: {
      example: `int big = i, L = 2*i + 1, R = 2*i + 2;

if (L < n && h[L] > h[big]) big = L;
if (R < n && h[R] > h[big]) big = R;
if (big == i) break;
int t = h[i]; h[i] = h[big]; h[big] = t;
i = big;`,
      notes: [
        { token: "h[0] = h[n - 1]", meaning: "promote the last value to fill the hole" },
        { token: "check both children", meaning: "then swap with the LARGER one" },
        { token: "if (big == i) break", meaning: "already bigger than both — settled" },
      ],
      vizCode: `int top = h[0];
h[0] = h[--n];
int i = 0;
while (1) {
  int big = i, L = 2*i+1, R = 2*i+2;
  if (L < n && h[L] > h[big]) big = L;
  if (R < n && h[R] > h[big]) big = R;
  if (big == i) break;
  swap(h[i], h[big]); i = big;
}`,
      starter: `int big = i, L = 2*i + 1, R = 2*i + 2;

if (L < n && ) big = L;
if (R < n && ) big = R;
if (big == i) break;
int t = h[i]; h[i] = h[big]; h[big] = t;
i = big;`,
      rules: {
        regex: ["h\\[L\\]\\s*>\\s*h\\[big\\]", "h\\[R\\]\\s*>\\s*h\\[big\\]"],
        hint:
          "Compare against h[big], not h[i]. That way the second check compares the right child against whichever of the node and left child is currently winning.",
        success:
          "Correct. Comparing against h[big] rather than h[i] is what makes the two checks together find the true largest of the three.",
      },
      solution: `int big = i, L = 2*i + 1, R = 2*i + 2;

if (L < n && h[L] > h[big]) big = L;
if (R < n && h[R] > h[big]) big = R;
if (big == i) break;
int t = h[i]; h[i] = h[big]; h[big] = t;
i = big;`,
    },

    python: {
      example: `big, L, R = i, 2*i + 1, 2*i + 2

if L < n and h[L] > h[big]: big = L
if R < n and h[R] > h[big]: big = R
if big == i: break
h[i], h[big] = h[big], h[i]
i = big`,
      notes: [
        { token: "h[0] = h.pop()", meaning: "promote the last value to fill the hole" },
        { token: "check both children", meaning: "then swap with the LARGER one" },
        { token: "if big == i: break", meaning: "already bigger than both — settled" },
        { token: "heapq._siftup", meaning: "the real implementation. The underscore means leave it alone" },
      ],
      vizCode: `top = h[0]
h[0] = h.pop()
i = 0
while True:
    big, L, R = i, 2*i+1, 2*i+2
    if L < n and h[L] > h[big]: big = L
    if R < n and h[R] > h[big]: big = R
    if big == i: break
    h[i], h[big] = h[big], h[i]; i = big`,
      prompt:
        "Write the sink step: find the largest among the node and its two children, then swap if the node is not already largest.",
      starter: `big, L, R = i, 2*i + 1, 2*i + 2

if L < n and : big = L
if R < n and : big = R
if big == i: break
h[i], h[big] = h[big], h[i]
i = big`,
      rules: {
        regex: ["h\\[L\\]\\s*>\\s*h\\[big\\]", "h\\[R\\]\\s*>\\s*h\\[big\\]"],
        hint: "Compare against h[big], not h[i], so the second check knows which of the first two is winning.",
        success:
          "Correct. Python's `and` stops at the first false part, so L < n protects the h[L] read from going past the end.",
      },
      solution: `big, L, R = i, 2*i + 1, 2*i + 2

if L < n and h[L] > h[big]: big = L
if R < n and h[R] > h[big]: big = R
if big == i: break
h[i], h[big] = h[big], h[i]
i = big`,
    },

    java: {
      example: `int big = i, L = 2*i + 1, R = 2*i + 2;

if (L < n && h[L] > h[big]) big = L;
if (R < n && h[R] > h[big]) big = R;
if (big == i) break;
int t = h[i]; h[i] = h[big]; h[big] = t;
i = big;`,
      notes: [
        { token: "h[0] = h[--n]", meaning: "promote the last value to fill the hole" },
        { token: "check both children", meaning: "then swap with the LARGER one" },
        { token: "if (big == i) break", meaning: "already bigger than both — settled" },
        { token: "PriorityQueue.poll", meaning: "does exactly this, already written" },
      ],
      vizCode: `int top = h[0];
h[0] = h[--n];
int i = 0;
while (true) {
  int big = i, L = 2*i+1, R = 2*i+2;
  if (L < n && h[L] > h[big]) big = L;
  if (R < n && h[R] > h[big]) big = R;
  if (big == i) break;
  swap(h, i, big); i = big;
}`,
      starter: `int big = i, L = 2*i + 1, R = 2*i + 2;

if (L < n && ) big = L;
if (R < n && ) big = R;
if (big == i) break;
int t = h[i]; h[i] = h[big]; h[big] = t;
i = big;`,
      rules: {
        regex: ["h\\[L\\]\\s*>\\s*h\\[big\\]", "h\\[R\\]\\s*>\\s*h\\[big\\]"],
        hint: "Compare against h[big], not h[i], so the second check knows which of the first two is winning.",
        success:
          "Correct. Java's && also stops early, so L < n is what keeps h[L] from reading past the end of the array.",
      },
      solution: `int big = i, L = 2*i + 1, R = 2*i + 2;

if (L < n && h[L] > h[big]) big = L;
if (R < n && h[R] > h[big]) big = R;
if (big == i) break;
int t = h[i]; h[i] = h[big]; h[big] = t;
i = big;`,
    },

    javascript: {
      example: `let big = i;
const L = 2*i + 1, R = 2*i + 2;

if (L < n && h[L] > h[big]) big = L;
if (R < n && h[R] > h[big]) big = R;
if (big === i) break;
[h[i], h[big]] = [h[big], h[i]];
i = big;`,
      notes: [
        { token: "h[0] = h.pop()", meaning: "promote the last value to fill the hole" },
        { token: "check both children", meaning: "then swap with the LARGER one" },
        { token: "if (big === i) break", meaning: "already bigger than both — settled" },
        { token: "h[L] with L past the end", meaning: "gives undefined, and every comparison with it is false" },
      ],
      vizCode: `const top = h[0];
h[0] = h.pop();
let i = 0;
while (true) {
  let big = i; const L = 2*i+1, R = 2*i+2;
  if (L < n && h[L] > h[big]) big = L;
  if (R < n && h[R] > h[big]) big = R;
  if (big === i) break;
  [h[i], h[big]] = [h[big], h[i]]; i = big;
}`,
      prompt:
        "Write the sink step: find the largest among the node and its two children, then swap if the node is not already largest.",
      starter: `let big = i;
const L = 2*i + 1, R = 2*i + 2;

if (L < n && ) big = L;
if (R < n && ) big = R;
if (big === i) break;
[h[i], h[big]] = [h[big], h[i]];
i = big;`,
      rules: {
        regex: ["h\\[L\\]\\s*>\\s*h\\[big\\]", "h\\[R\\]\\s*>\\s*h\\[big\\]"],
        hint: "Compare against h[big], not h[i], so the second check knows which of the first two is winning.",
        success:
          "Correct. Keep the L < n guard even though JavaScript would survive without it: undefined > anything is false, so it happens to work — by luck, not by design.",
      },
      solution: `let big = i;
const L = 2*i + 1, R = 2*i + 2;

if (L < n && h[L] > h[big]) big = L;
if (R < n && h[R] > h[big]) big = R;
if (big === i) break;
[h[i], h[big]] = [h[big], h[i]];
i = big;`,
    },

    rust: {
      example: `let (mut big, l, r) = (i, 2*i + 1, 2*i + 2);

if l < n && h[l] > h[big] { big = l; }
if r < n && h[r] > h[big] { big = r; }
if big == i { break; }
h.swap(i, big);
i = big;`,
      notes: [
        { token: "h.swap(i, big)", meaning: "built in, and it keeps the borrow checker happy" },
        { token: "check both children", meaning: "then swap with the LARGER one" },
        { token: "if big == i { break; }", meaning: "already bigger than both — settled" },
        { token: "l < n first", meaning: "required. Indexing past the end stops the program" },
      ],
      vizCode: `let top = h[0];
h[0] = h.pop().unwrap();
let mut i = 0;
loop {
    let (mut big, l, r) = (i, 2*i+1, 2*i+2);
    if l < n && h[l] > h[big] { big = l; }
    if r < n && h[r] > h[big] { big = r; }
    if big == i { break; }
    h.swap(i, big); i = big;
}`,
      prompt:
        "Write the sink step: find the largest among the node and its two children, then swap if the node is not already largest.",
      starter: `let (mut big, l, r) = (i, 2*i + 1, 2*i + 2);

if l < n &&  { big = l; }
if r < n &&  { big = r; }
if big == i { break; }
h.swap(i, big);
i = big;`,
      rules: {
        regex: ["h\\[l\\]\\s*>\\s*h\\[big\\]", "h\\[r\\]\\s*>\\s*h\\[big\\]"],
        hint: "Compare against h[big], not h[i], so the second check knows which of the first two is winning.",
        success:
          "Correct, and in Rust the l < n guard is not optional — reading past the end stops the program on the spot rather than giving you undefined.",
      },
      solution: `let (mut big, l, r) = (i, 2*i + 1, 2*i + 2);

if l < n && h[l] > h[big] { big = l; }
if r < n && h[r] > h[big] { big = r; }
if big == i { break; }
h.swap(i, big);
i = big;`,
    },
  },
};
