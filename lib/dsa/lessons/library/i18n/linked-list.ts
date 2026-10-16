import type { ChapterAlt } from "@/lib/dsa/lessons/i18n";

// Linked List, in the five languages other than C++.
//
// This is the chapter where the languages differ most. C and C++ hand you raw
// pointers; Python, Java and JavaScript hand you objects and a garbage
// collector; Rust refuses to let two names own the same node at all, which is
// why its version looks so different.

export const LINKED_LIST_ALT: ChapterAlt = {
  /* ------------------------------------------------------------ shape -- */
  shape: {
    c: {
      example: `struct Node {
  int val;
  struct Node *next;
};

struct Node *head = malloc(sizeof(struct Node));
head->val = 7;
head->next = NULL;

for (struct Node *cur = head; cur != NULL; cur = cur->next)
  printf("%d ", cur->val);`,
      notes: [
        { token: "struct Node *next", meaning: "the address of the next node, or NULL" },
        { token: "malloc", meaning: "you ask for the memory yourself" },
        { token: "free", meaning: "and you must give it back, or the program leaks" },
        { token: "cur = cur->next", meaning: "the only way to move — one hop at a time" },
      ],
      vizCode: `struct Node { int val; struct Node *next; };

/* walk it */
struct Node *cur = head;
while (cur) { printf("%d", cur->val); cur = cur->next; }`,
      starter: `int count = 0;
struct Node *cur = head;

while ( ) {
  count++;
  ;
}

printf("%d", count);`,
      rules: {
        regex: ["cur\\s*(!=\\s*NULL|\\))", "cur\\s*=\\s*cur->next"],
        hint: "Loop while cur is not NULL, and step with cur = cur->next inside.",
        success:
          "Correct. In C you also own the clean-up: walking the list to free() every node is a second loop nobody writes until it leaks.",
      },
      solution: `int count = 0;
struct Node *cur = head;

while (cur != NULL) {
  count++;
  cur = cur->next;
}

printf("%d", count);`,
    },

    python: {
      example: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None


head = Node(7)
head.next = Node(2)

cur = head
while cur:
    print(cur.val, end=" ")
    cur = cur.next`,
      notes: [
        { token: "self.next", meaning: "the next node, or None" },
        { token: "while cur", meaning: "None counts as false, so this ends at the tail" },
        { token: "no free()", meaning: "Python cleans up for you once nothing points at a node" },
        { token: "collections.deque", meaning: "a doubly linked list already written for you" },
      ],
      vizCode: `class Node: val; next
# walk it
cur = head
while cur:
    print(cur.val); cur = cur.next`,
      starter: `count = 0
cur = head

while :
    count += 1
    

print(count)`,
      rules: {
        regex: ["while\\s+cur", "cur\\s*=\\s*cur\\.next"],
        hint: "Loop while cur, and step with cur = cur.next inside.",
        success:
          "Correct. `while cur` works because None is treated as false. Writing `while cur is not None` is clearer and does exactly the same thing.",
      },
      solution: `count = 0
cur = head

while cur:
    count += 1
    cur = cur.next

print(count)`,
    },

    java: {
      example: `class Node {
  int val;
  Node next;
  Node(int v) { val = v; next = null; }
}

Node head = new Node(7);
head.next = new Node(2);

for (Node cur = head; cur != null; cur = cur.next)
  System.out.print(cur.val + " ");`,
      notes: [
        { token: "Node next", meaning: "the next node, or null" },
        { token: "cur != null", meaning: "null is the end-of-chain marker" },
        { token: "no free()", meaning: "the garbage collector handles it" },
        { token: "java.util.LinkedList", meaning: "already written, and doubly linked" },
      ],
      vizCode: `class Node { int val; Node next; }

// walk it
Node cur = head;
while (cur != null) { print(cur.val); cur = cur.next; }`,
      starter: `int count = 0;
Node cur = head;

while ( ) {
  count++;
  ;
}

System.out.println(count);`,
      rules: {
        regex: ["cur\\s*!=\\s*null", "cur\\s*=\\s*cur\\.next"],
        hint: "Loop while cur != null, and step with cur = cur.next inside.",
        success:
          "Correct. Java has no -> arrow: cur.next works for both the field and the object, because every object here is already a reference.",
      },
      solution: `int count = 0;
Node cur = head;

while (cur != null) {
  count++;
  cur = cur.next;
}

System.out.println(count);`,
    },

    javascript: {
      example: `class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

const head = new Node(7);
head.next = new Node(2);

for (let cur = head; cur !== null; cur = cur.next)
  process.stdout.write(cur.val + " ");`,
      notes: [
        { token: "this.next", meaning: "the next node, or null" },
        { token: "cur !== null", meaning: "null is the end-of-chain marker" },
        { token: "{ val: 7, next: null }", meaning: "a plain object works just as well as a class" },
        { token: "no free()", meaning: "the garbage collector handles it" },
      ],
      vizCode: `class Node { val; next; }

// walk it
let cur = head;
while (cur) { console.log(cur.val); cur = cur.next; }`,
      starter: `let count = 0;
let cur = head;

while ( ) {
  count++;
  ;
}

console.log(count);`,
      rules: {
        regex: ["cur\\s*(!==?\\s*null|\\))", "cur\\s*=\\s*cur\\.next"],
        hint: "Loop while cur, and step with cur = cur.next inside.",
        success:
          "Correct. A plain object literal { val: 7, next: null } does the same job as the class — JavaScript needs no declaration for either.",
      },
      solution: `let count = 0;
let cur = head;

while (cur !== null) {
  count++;
  cur = cur.next;
}

console.log(count);`,
    },

    rust: {
      example: `struct Node {
    val: i32,
    next: Option<Box<Node>>,   // Some(node) or None
}

let head = Some(Box::new(Node { val: 7, next: None }));

// walk it — note the & everywhere. We borrow, never take
let mut cur = &head;
while let Some(node) = cur {
    println!("{}", node.val);
    cur = &node.next;
}`,
      notes: [
        { token: "Option<Box<Node>>", meaning: "Some(node) or None. Rust has no null" },
        { token: "Box", meaning: "puts the node on the heap. Without it the type would be infinitely large" },
        { token: "while let Some(node)", meaning: "run the body only while there is a node" },
        { token: "&head, &node.next", meaning: "borrow to read. Rust allows only one owner per node" },
      ],
      vizCode: `struct Node { val: i32, next: Option<Box<Node>> }

// walk it
let mut cur = &head;
while let Some(n) = cur { println!("{}", n.val); cur = &n.next; }`,
      prompt:
        "Count how many nodes the list has. Walk from head until you run out. Borrow as you go — do not take ownership.",
      starter: `let mut count = 0;
let mut cur = &head;

while let Some(node) = cur {
    count += 1;
    ;
}

println!("{}", count);`,
      rules: {
        regex: ["cur\\s*=\\s*&\\s*node\\.next"],
        hint: "Step with cur = &node.next — the & matters, because taking the value would move it out of the list.",
        success:
          "Correct. This chapter is where Rust feels hardest, and the reason is deliberate: a linked list wants many names pointing at one node, which is exactly what Rust is built to prevent. Real Rust code reaches for Vec or VecDeque instead.",
      },
      solution: `let mut count = 0;
let mut cur = &head;

while let Some(node) = cur {
    count += 1;
    cur = &node.next;
}

println!("{}", count);`,
    },
  },

  /* ---------------------------------------------------------- reverse -- */
  reverse: {
    c: {
      example: `struct Node *prev = NULL;
struct Node *cur = head;

while (cur != NULL) {
  struct Node *nxt = cur->next;   /* 1. save */
  cur->next = prev;               /* 2. flip */
  prev = cur;                     /* 3. step prev */
  cur = nxt;                      /* 4. step cur */
}
head = prev;`,
      notes: [
        { token: "prev starts NULL", meaning: "the old head becomes the new tail" },
        { token: "save before flipping", meaning: "flip first and the rest of the list is lost forever" },
        { token: "head = prev", meaning: "cur is NULL; prev is the last node visited" },
      ],
      vizCode: `struct Node *prev = NULL, *cur = head;
while (cur) {
  struct Node *nxt = cur->next;   /* save it first */
  cur->next = prev;               /* flip the arrow */
  prev = cur;                     /* step both */
  cur  = nxt;
}
head = prev;`,
      starter: `struct Node *prev = NULL;
struct Node *cur = head;

while (cur != NULL) {
  struct Node *nxt = ;
  cur->next = ;
  prev = ;
  cur = ;
}`,
      rules: {
        regex: ["nxt\\s*=\\s*cur->next", "cur->next\\s*=\\s*prev", "prev\\s*=\\s*cur", "cur\\s*=\\s*nxt"],
        hint: "Save nxt = cur->next. Flip cur->next = prev. Then prev = cur, and cur = nxt.",
        success:
          "Correct. Say the four steps out loud — save, flip, step, step — and you will be able to write this under pressure.",
      },
      solution: `struct Node *prev = NULL;
struct Node *cur = head;

while (cur != NULL) {
  struct Node *nxt = cur->next;
  cur->next = prev;
  prev = cur;
  cur = nxt;
}`,
    },

    python: {
      example: `prev = None
cur = head

while cur:
    nxt = cur.next     # 1. save
    cur.next = prev    # 2. flip
    prev = cur         # 3. step prev
    cur = nxt          # 4. step cur

head = prev`,
      notes: [
        { token: "prev starts None", meaning: "the old head becomes the new tail" },
        { token: "save before flipping", meaning: "flip first and the rest of the list is unreachable" },
        { token: "head = prev", meaning: "cur is None; prev is the last node visited" },
        { token: "cur.next, prev, cur = prev, cur, cur.next", meaning: "the one-line version. Clever, and harder to read" },
      ],
      vizCode: `prev, cur = None, head
while cur:
    nxt = cur.next     # save it first
    cur.next = prev    # flip the arrow
    prev = cur         # step both
    cur = nxt

head = prev`,
      starter: `prev = None
cur = head

while cur:
    nxt = 
    cur.next = 
    prev = 
    cur = `,
      rules: {
        regex: ["nxt\\s*=\\s*cur\\.next", "cur\\.next\\s*=\\s*prev", "prev\\s*=\\s*cur", "cur\\s*=\\s*nxt"],
        hint: "Save nxt = cur.next. Flip cur.next = prev. Then prev = cur, and cur = nxt.",
        success:
          "Correct. Python can do all four in one line, because the right-hand side is worked out before anything is assigned — but the four steps written out are much easier to follow.",
      },
      solution: `prev = None
cur = head

while cur:
    nxt = cur.next
    cur.next = prev
    prev = cur
    cur = nxt`,
    },

    java: {
      example: `Node prev = null;
Node cur = head;

while (cur != null) {
  Node nxt = cur.next;   // 1. save
  cur.next = prev;       // 2. flip
  prev = cur;            // 3. step prev
  cur = nxt;             // 4. step cur
}
head = prev;`,
      notes: [
        { token: "prev starts null", meaning: "the old head becomes the new tail" },
        { token: "save before flipping", meaning: "flip first and the rest of the list is unreachable" },
        { token: "head = prev", meaning: "cur is null; prev is the last node visited" },
      ],
      vizCode: `Node prev = null, cur = head;
while (cur != null) {
  Node nxt = cur.next;   // save it first
  cur.next = prev;       // flip the arrow
  prev = cur;            // step both
  cur = nxt;
}
head = prev;`,
      starter: `Node prev = null;
Node cur = head;

while (cur != null) {
  Node nxt = ;
  cur.next = ;
  prev = ;
  cur = ;
}`,
      rules: {
        regex: ["nxt\\s*=\\s*cur\\.next", "cur\\.next\\s*=\\s*prev", "prev\\s*=\\s*cur", "cur\\s*=\\s*nxt"],
        hint: "Save nxt = cur.next. Flip cur.next = prev. Then prev = cur, and cur = nxt.",
        success:
          "Correct. The nodes that fall out of reach here are collected automatically — one thing less to think about than in C.",
      },
      solution: `Node prev = null;
Node cur = head;

while (cur != null) {
  Node nxt = cur.next;
  cur.next = prev;
  prev = cur;
  cur = nxt;
}`,
    },

    javascript: {
      example: `let prev = null;
let cur = head;

while (cur !== null) {
  const nxt = cur.next;   // 1. save
  cur.next = prev;        // 2. flip
  prev = cur;             // 3. step prev
  cur = nxt;              // 4. step cur
}
head = prev;`,
      notes: [
        { token: "prev starts null", meaning: "the old head becomes the new tail" },
        { token: "save before flipping", meaning: "flip first and the rest of the list is unreachable" },
        { token: "head = prev", meaning: "cur is null; prev is the last node visited" },
        { token: "[cur.next, prev, cur] = [prev, cur, cur.next]", meaning: "the one-line version, using destructuring" },
      ],
      vizCode: `let prev = null, cur = head;
while (cur !== null) {
  const nxt = cur.next;   // save it first
  cur.next = prev;        // flip the arrow
  prev = cur;             // step both
  cur = nxt;
}
head = prev;`,
      starter: `let prev = null;
let cur = head;

while (cur !== null) {
  const nxt = ;
  cur.next = ;
  prev = ;
  cur = ;
}`,
      rules: {
        regex: ["nxt\\s*=\\s*cur\\.next", "cur\\.next\\s*=\\s*prev", "prev\\s*=\\s*cur", "cur\\s*=\\s*nxt"],
        hint: "Save nxt = cur.next. Flip cur.next = prev. Then prev = cur, and cur = nxt.",
        success:
          "Correct. Destructuring can do all four at once, because the whole right-hand side is worked out before anything is written — but the four steps are far clearer.",
      },
      solution: `let prev = null;
let cur = head;

while (cur !== null) {
  const nxt = cur.next;
  cur.next = prev;
  prev = cur;
  cur = nxt;
}`,
    },

    rust: {
      example: `let mut prev: Option<Box<Node>> = None;
let mut cur = head.take();          // take ownership out of head

while let Some(mut node) = cur {
    let nxt = node.next.take();     // 1. save
    node.next = prev;               // 2. flip
    prev = Some(node);              // 3. step prev
    cur = nxt;                      // 4. step cur
}
head = prev;`,
      notes: [
        { token: ".take()", meaning: "moves the value out and leaves None behind" },
        { token: "while let Some(mut node)", meaning: "takes ownership of the node for this lap" },
        { token: "the four steps", meaning: "identical to every other language — save, flip, step, step" },
        { token: "why take()", meaning: "Rust allows one owner, so moving is the only way to rewire safely" },
      ],
      vizCode: `let (mut prev, mut cur) = (None, head.take());
while let Some(mut node) = cur {
    let nxt = node.next.take();     // save it first
    node.next = prev;               // flip the arrow
    prev = Some(node);              // step both
    cur = nxt;
}
head = prev;`,
      prompt:
        "Write the four lines of the reversal loop in the right order. Use .take() to move the next node out.",
      starter: `let mut prev: Option<Box<Node>> = None;
let mut cur = head.take();

while let Some(mut node) = cur {
    let nxt = ;
    node.next = ;
    prev = ;
    cur = ;
}`,
      rules: {
        regex: ["nxt\\s*=\\s*node\\.next\\.take\\(\\)", "node\\.next\\s*=\\s*prev", "prev\\s*=\\s*Some\\s*\\(\\s*node\\s*\\)", "cur\\s*=\\s*nxt"],
        hint:
          "Save nxt = node.next.take(). Flip node.next = prev. Then prev = Some(node), and cur = nxt.",
        success:
          "Correct — and notice Rust cannot get this wrong. Flipping before saving would move node.next out and then try to read it, which simply does not compile. The bug that bites everywhere else is impossible here.",
      },
      solution: `let mut prev: Option<Box<Node>> = None;
let mut cur = head.take();

while let Some(mut node) = cur {
    let nxt = node.next.take();
    node.next = prev;
    prev = Some(node);
    cur = nxt;
}`,
    },
  },


  /* ----------------------------------------------------------- doubly -- */
  doubly: {
    c: {
      example: `struct Node {
  int val;
  struct Node *next;
  struct Node *prev;      /* the way back */
};

/* insert b after a — FOUR links */
b->next = a->next;
b->prev = a;
if (a->next) a->next->prev = b;
a->next = b;

/* delete node d, in O(1) */
if (d->prev) d->prev->next = d->next;
if (d->next) d->next->prev = d->prev;
free(d);                  /* and you must free it yourself */`,
      notes: [
        { token: "struct Node *prev", meaning: "the second pointer. That is the whole difference" },
        { token: "four links", meaning: "b's two, plus the neighbours pointing back at b" },
        { token: "free(d)", meaning: "unlink it AND give the memory back, or the program leaks" },
        { token: "a dummy head and tail", meaning: "removes every null check. Common in real C" },
      ],
      starter: `if (d->prev) d->prev->next = ;
if (d->next) d->next->prev = ;
free(d);`,
      rules: {
        regex: ["d->prev->next\\s*=\\s*d->next", "d->next->prev\\s*=\\s*d->prev"],
        hint: "The node before d points at what came after d; the node after d points back at what came before it.",
        success:
          "Correct, and in C there is one more step nobody else here needs: free(d). Unlinking a node does not release its memory — do it in that order, since freeing first would leave you reading a dead pointer.",
      },
      solution: `if (d->prev) d->prev->next = d->next;
if (d->next) d->next->prev = d->prev;
free(d);`,
    },

    python: {
      body: [
        "Because deleting a node means pointing the one BEFORE it at the one after. And a singly linked node has no idea what comes before it.",
        "So you have to walk from the head again just to find the previous node. Standing on the thing you want to delete does not help at all.",
        "A doubly linked list fixes that by giving every node a second reference: prev, alongside next. Now every node knows both neighbours, and deleting becomes O(1).",
        "The price is one extra reference per node, and more discipline — every insert and delete has FOUR links to fix, not two.",
        "A circular list is a separate change: the last node points back at the head instead of at None. There is no end, so a walk never stops on its own.",
        "Python has one thing worth knowing here that the other languages do not. A doubly linked list creates a REFERENCE CYCLE — a points at b, and b points back at a — so simple reference counting can never free them. Python's cycle collector handles it, but it runs later and less predictably than the usual cleanup.",
        "In practice you rarely write one. collections.deque is a doubly linked list already, written in C, and it is what you should reach for.",
      ],
      example: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None
        self.prev = None        # the way back


# insert b after a — FOUR links
b.next = a.next
b.prev = a
if a.next:
    a.next.prev = b
a.next = b

# delete node d, in O(1)
if d.prev: d.prev.next = d.next
if d.next: d.next.prev = d.prev`,
      notes: [
        { token: "self.prev", meaning: "the second reference. That is the whole difference" },
        { token: "four links", meaning: "b's two, plus the neighbours pointing back at b" },
        { token: "a reference cycle", meaning: "a and b point at each other. The cycle collector handles it, eventually" },
        { token: "collections.deque", meaning: "a doubly linked list already, written in C. Use it" },
      ],
      prompt:
        "Delete node d from a doubly linked list, in O(1). Fix the links on both sides, and guard against d being at either end.",
      starter: `if d.prev: d.prev.next = 
if d.next: d.next.prev = `,
      rules: {
        regex: ["d\\.prev\\.next\\s*=\\s*d\\.next", "d\\.next\\.prev\\s*=\\s*d\\.prev"],
        hint: "The node before d points at what came after d; the node after d points back at what came before it.",
        success:
          "Correct. Python cleans the unlinked node up for you — but note that a doubly linked list makes reference cycles by design, so it is the cycle collector doing that work rather than plain reference counting.",
      },
      solution: `if d.prev: d.prev.next = d.next
if d.next: d.next.prev = d.prev`,
    },

    java: {
      example: `class Node {
  int val;
  Node next;
  Node prev;              // the way back
}

// insert b after a — FOUR links
b.next = a.next;
b.prev = a;
if (a.next != null) a.next.prev = b;
a.next = b;

// delete node d, in O(1)
if (d.prev != null) d.prev.next = d.next;
if (d.next != null) d.next.prev = d.prev;`,
      notes: [
        { token: "Node prev", meaning: "the second reference. That is the whole difference" },
        { token: "four links", meaning: "b's two, plus the neighbours pointing back at b" },
        { token: "java.util.LinkedList", meaning: "a doubly linked list already. This is what it does inside" },
        { token: "ArrayList is usually faster", meaning: "even for inserts. Contiguous memory beats pointer chasing" },
      ],
      starter: `if (d.prev != null) d.prev.next = ;
if (d.next != null) d.next.prev = ;`,
      rules: {
        regex: ["d\\.prev\\.next\\s*=\\s*d\\.next", "d\\.next\\.prev\\s*=\\s*d\\.prev"],
        hint: "The node before d points at what came after d; the node after d points back at what came before it.",
        success:
          "Correct. Worth knowing before you reach for LinkedList in real Java: ArrayList usually wins even on inserts, because walking contiguous memory is far friendlier to the cache than chasing pointers.",
      },
      solution: `if (d.prev != null) d.prev.next = d.next;
if (d.next != null) d.next.prev = d.prev;`,
    },

    javascript: {
      example: `class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
    this.prev = null;     // the way back
  }
}

// insert b after a — FOUR links
b.next = a.next;
b.prev = a;
if (a.next) a.next.prev = b;
a.next = b;

// delete node d, in O(1)
if (d.prev) d.prev.next = d.next;
if (d.next) d.next.prev = d.prev;`,
      notes: [
        { token: "this.prev", meaning: "the second reference. That is the whole difference" },
        { token: "four links", meaning: "b's two, plus the neighbours pointing back at b" },
        { token: "a reference cycle", meaning: "fine here — JavaScript's collector traces from the roots, so cycles are collected" },
        { token: "an LRU cache", meaning: "the classic use: a doubly linked list plus a Map, both O(1)" },
      ],
      prompt:
        "Delete node d from a doubly linked list, in O(1). Fix the links on both sides, and guard against d being at either end.",
      starter: `if (d.prev) d.prev.next = ;
if (d.next) d.next.prev = ;`,
      rules: {
        regex: ["d\\.prev\\.next\\s*=\\s*d\\.next", "d\\.next\\.prev\\s*=\\s*d\\.prev"],
        hint: "The node before d points at what came after d; the node after d points back at what came before it.",
        success:
          "Correct. This exact pair of lines is the heart of an LRU cache — a doubly linked list for the order, a Map for the lookup, and both operations O(1).",
      },
      solution: `if (d.prev) d.prev.next = d.next;
if (d.next) d.next.prev = d.prev;`,
    },

    rust: {
      hook:
        "You are standing on a node in the middle of a list and you want to delete it. In a singly linked list that is O(n). A doubly linked list makes it O(1) — and in Rust, makes the borrow checker refuse to compile it. Why?",
      body: [
        "Deleting a node means pointing the one BEFORE it at the one after, and a singly linked node has no idea what comes before it. So a doubly linked list adds a prev pointer, and deletion becomes O(1).",
        "That is where Rust objects. A doubly linked list means node a owns b, and b also points back at a. Two owners for one node — which is precisely the thing Rust's ownership rules exist to forbid.",
        "You cannot express it with Box, because Box means exactly one owner. The standard workaround is Rc<RefCell<Node>>: Rc allows shared ownership by counting references, and RefCell moves the borrow check from compile time to run time.",
        "That gets it working, and it costs you: a counter bump on every clone, a borrow flag checked on every access, and the possibility of a panic if you accidentally borrow the same node twice at once.",
        "It also leaks. Rc frees a value when its count reaches zero, and in a cycle the count never does. You break it with Weak references on the prev links — strong going forward, weak going back.",
        "Which is why the honest answer in Rust is usually: do not. std::collections::VecDeque covers almost every case a doubly linked list would, with none of this. LinkedList exists in the standard library and its own documentation tells you to use Vec or VecDeque instead.",
      ],
      example: `use std::rc::{Rc, Weak};
use std::cell::RefCell;

struct Node {
    val: i32,
    next: Option<Rc<RefCell<Node>>>,
    prev: Option<Weak<RefCell<Node>>>,   // WEAK, or it leaks
}

// even reading is different — borrow at run time
let value = node.borrow().val;

// what you should almost always use instead
use std::collections::VecDeque;
let mut dq: VecDeque<i32> = VecDeque::new();
dq.push_front(1);
dq.push_back(2);`,
      notes: [
        { token: "Rc<RefCell<T>>", meaning: "shared ownership, with the borrow check moved to run time" },
        { token: "Weak on prev", meaning: "does not keep the value alive. Without it the cycle never frees" },
        { token: ".borrow()", meaning: "panics if something else already holds a mutable borrow" },
        { token: "VecDeque", meaning: "what to use instead. O(1) at both ends, no cycles, no leaks" },
      ],
      prompt:
        "Rust's answer to this is a different structure. Build a double-ended queue and add one value at each end.",
      starter: `use std::collections::VecDeque;

let mut dq: VecDeque<i32> = VecDeque::new();

dq.(1);
dq.(2);`,
      rules: {
        regex: ["dq\\.push_front\\s*\\(\\s*1\\s*\\)", "dq\\.push_back\\s*\\(\\s*2\\s*\\)"],
        hint: "push_front adds at the front, push_back at the end. Both are O(1).",
        success:
          "Correct — and this is the real lesson. Rust makes a doubly linked list genuinely painful, which is a signal rather than an obstacle: on modern hardware a VecDeque beats one almost every time, because contiguous memory is far kinder to the cache than chasing pointers.",
      },
      solution: `use std::collections::VecDeque;

let mut dq: VecDeque<i32> = VecDeque::new();

dq.push_front(1);
dq.push_back(2);`,
    },
  },

  /* --------------------------------------------------------- fastslow -- */
  fastslow: {
    c: {
      example: `struct Node *slow = head, *fast = head;

while (fast != NULL && fast->next != NULL) {
  slow = slow->next;
  fast = fast->next->next;
}
/* slow is the middle */`,
      notes: [
        { token: "fast && fast->next", meaning: "both checks are needed before two hops" },
        { token: "slow == fast", meaning: "meeting is only possible inside a loop" },
        { token: "O(1) memory", meaning: "two pointers, whatever the list length" },
      ],
      vizCode: `struct Node *slow = head, *fast = head;
while (fast && fast->next) {
  slow = slow->next;
  fast = fast->next->next;
}
/* slow is now the middle */`,
      starter: `struct Node *slow = head, *fast = head;

while ( ) {
  slow = ;
  fast = ;
}`,
      rules: {
        regex: ["fast\\s*(!=\\s*NULL\\s*)?&&\\s*fast->next", "slow\\s*=\\s*slow->next", "fast\\s*=\\s*fast->next->next"],
        hint: "Guard with fast && fast->next. Then slow = slow->next and fast = fast->next->next.",
        success:
          "Correct. Both halves of that guard matter: without fast->next, an even-length list follows a NULL pointer and the program crashes.",
      },
      solution: `struct Node *slow = head, *fast = head;

while (fast != NULL && fast->next != NULL) {
  slow = slow->next;
  fast = fast->next->next;
}`,
    },

    python: {
      example: `slow = fast = head

while fast and fast.next:
    slow = slow.next
    fast = fast.next.next

# slow is the middle`,
      notes: [
        { token: "fast and fast.next", meaning: "both checks are needed before two hops" },
        { token: "slow is fast", meaning: "use is, not ==, to compare node identity" },
        { token: "O(1) memory", meaning: "two names, whatever the list length" },
        { token: "slow = fast = head", meaning: "safe here — both just point at the same node" },
      ],
      vizCode: `slow = fast = head
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
# slow is now the middle`,
      starter: `slow = fast = head

while :
    slow = 
    fast = `,
      rules: {
        regex: ["fast\\s+and\\s+fast\\.next", "slow\\s*=\\s*slow\\.next", "fast\\s*=\\s*fast\\.next\\.next"],
        hint: "Guard with fast and fast.next. Then slow = slow.next and fast = fast.next.next.",
        success:
          "Correct. Python's `and` stops as soon as the left side is false, which is what keeps fast.next from being read on a None.",
      },
      solution: `slow = fast = head

while fast and fast.next:
    slow = slow.next
    fast = fast.next.next`,
    },

    java: {
      example: `Node slow = head, fast = head;

while (fast != null && fast.next != null) {
  slow = slow.next;
  fast = fast.next.next;
}
// slow is the middle`,
      notes: [
        { token: "fast != null && fast.next != null", meaning: "both checks are needed before two hops" },
        { token: "slow == fast", meaning: "on objects this compares identity, which is what you want here" },
        { token: "O(1) memory", meaning: "two references, whatever the list length" },
      ],
      vizCode: `Node slow = head, fast = head;
while (fast != null && fast.next != null) {
  slow = slow.next;
  fast = fast.next.next;
}
// slow is now the middle`,
      starter: `Node slow = head, fast = head;

while ( ) {
  slow = ;
  fast = ;
}`,
      rules: {
        regex: ["fast\\s*!=\\s*null\\s*&&\\s*fast\\.next", "slow\\s*=\\s*slow\\.next", "fast\\s*=\\s*fast\\.next\\.next"],
        hint: "Guard with fast != null && fast.next != null. Then slow = slow.next and fast = fast.next.next.",
        success:
          "Correct. Without the second check, an even-length list hits a NullPointerException — Java's version of the same crash C gives you.",
      },
      solution: `Node slow = head, fast = head;

while (fast != null && fast.next != null) {
  slow = slow.next;
  fast = fast.next.next;
}`,
    },

    javascript: {
      example: `let slow = head, fast = head;

while (fast !== null && fast.next !== null) {
  slow = slow.next;
  fast = fast.next.next;
}
// slow is the middle`,
      notes: [
        { token: "fast && fast.next", meaning: "both checks are needed before two hops" },
        { token: "slow === fast", meaning: "on objects this compares identity, which is what you want here" },
        { token: "fast?.next?.next", meaning: "optional chaining does the same guarding, more briefly" },
      ],
      vizCode: `let slow = head, fast = head;
while (fast && fast.next) {
  slow = slow.next;
  fast = fast.next.next;
}
// slow is now the middle`,
      starter: `let slow = head, fast = head;

while ( ) {
  slow = ;
  fast = ;
}`,
      rules: {
        regex: ["fast\\s*(!==?\\s*null\\s*)?&&\\s*fast\\.next", "slow\\s*=\\s*slow\\.next", "fast\\s*=\\s*fast\\.next\\.next"],
        hint: "Guard with fast && fast.next. Then slow = slow.next and fast = fast.next.next.",
        success:
          "Correct. Modern JavaScript can also write fast = fast?.next?.next, which gives undefined instead of crashing — but the explicit guard says what you mean more clearly.",
      },
      solution: `let slow = head, fast = head;

while (fast !== null && fast.next !== null) {
  slow = slow.next;
  fast = fast.next.next;
}`,
    },

    rust: {
      example: `// Rust makes two pointers into one owned chain very hard, so real code
// keeps the nodes in a Vec and walks indices instead. Same algorithm.

let (mut slow, mut fast) = (0usize, 0usize);

while fast + 1 < n {
    slow += 1;
    fast += 2;
}
// slow is the middle`,
      notes: [
        { token: "fast + 1 < n", meaning: "both checks in one — there must be two hops left" },
        { token: "indices, not pointers", meaning: "two references into one owned list is what Rust forbids" },
        { token: "Vec<Node>", meaning: "the shape real Rust uses. next becomes a usize index" },
        { token: "O(1) memory", meaning: "two numbers, whatever the length" },
      ],
      vizCode: `let (mut slow, mut fast) = (0usize, 0usize);
while fast + 1 < n {
    slow += 1;
    fast += 2;
}
// slow is now the middle`,
      prompt:
        "Find the middle using two speeds. The list is stored in a Vec, so walk indices: slow moves one step, fast moves two.",
      starter: `let (mut slow, mut fast) = (0usize, 0usize);

while  {
    slow = ;
    fast = ;
}`,
      rules: {
        regex: ["fast\\s*\\+\\s*1\\s*<\\s*n", "slow\\s*=\\s*slow\\s*\\+\\s*1|slow\\s*\\+=\\s*1", "fast\\s*=\\s*fast\\s*\\+\\s*2|fast\\s*\\+=\\s*2"],
        hint: "Guard with fast + 1 < n. Then slow += 1 and fast += 2.",
        success:
          "Correct. Notice what changed and what did not: the algorithm is identical, but the two-pointer walk became a two-index walk, because Rust will not hand out two references into one owned chain.",
      },
      solution: `let (mut slow, mut fast) = (0usize, 0usize);

while fast + 1 < n {
    slow += 1;
    fast += 2;
}`,
    },
  },
};
