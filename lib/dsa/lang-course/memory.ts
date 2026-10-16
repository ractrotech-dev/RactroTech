import type { TopicLesson } from "@/lib/dsa/lessons/types";
import { traceCleanup, traceReference, traceStackHeap } from "@/lib/dsa/viz/traceLang";

// Language track, topic 8.
//
// The sharpest split in the track. Three of these languages hide memory almost
// completely, one hands you all of it, and Rust makes a claim the other five do
// not: control without the responsibility. Section 3 is the comparison.

export const LANG_MEMORY: TopicLesson = {
  id: "lang-memory",
  title: "Memory & References",
  tagline: "What a name really points at, and who cleans up.",
  why:
    "Every 'why did my list change?' bug, every crash on a null, every mysterious slowdown from a leak comes back to this topic. You can write a lot of Python without thinking about memory — right up until the moment something surprises you, and then nothing else explains it.",
  plain: [
    "A name is an arrow. The thing it points at lives somewhere in memory.",
    "Small, known-size values live on the stack and vanish when the function ends.",
    "Anything large or sized at run time lives on the heap, and something has to release it.",
    "Copying a name copies the arrow. Copying the thing is a different operation, and it costs more.",
  ],
  needs: ["Functions, especially what a parameter receives.", "Objects, at least the idea of a field."],
  traps: [
    "Returning a pointer or reference to a local variable. It is released the moment the function ends.",
    "Assuming assignment copies. In four of these six it copies the arrow, not the object.",
    "A shallow copy of a container of objects copies the arrows, so both copies share the inner objects.",
    "Holding a pointer into a growable container across an insert. Growing moves everything.",
    "Assuming a garbage collector means no leaks. Anything still reachable is never collected, and a forgotten listener or cache holds things reachable forever.",
  ],
  sections: [
    /* ----------------------------------------------------- stack/heap -- */
    {
      id: "where",
      kicker: "01",
      title: "Where a value actually lives",
      hook:
        "You make a local array of three ints and a vector of a million. Both are 'local'. Do they live in the same place?",
      body: [
        "No, and the difference explains why one of them costs nothing and the other does.",
        "The STACK is a block of memory that grows and shrinks as functions are called and return. Everything a function needs sits in one frame, and the whole frame is released in a single step when the function ends.",
        "That is why it is fast: no bookkeeping, no searching for space. But the compiler has to know the size in advance, and the total is limited — typically a few megabytes.",
        "The HEAP is the other area. You ask for a block of whatever size you need, whenever you need it, and it lives until something releases it. Slower, flexible, and much larger.",
        "So `int arr[3]` is on the stack: three ints, size known when the program was compiled. `vector<int> big(n)` puts a small bookkeeping object on the stack — a pointer, a size, a capacity — and the million ints on the heap.",
        "The consequence you must remember: a stack value dies when its function ends. Returning a pointer or a reference to one is a real bug, and the program often appears to work for a while because the memory has not been reused yet.",
        "The other consequence is the stack overflow. Deep recursion, or a large array declared as a local, can exhaust the few megabytes available — which is why a big buffer belongs on the heap.",
      ],
      predict: {
        ask: "What is wrong with this C++ function?",
        code: `int* makeArray() {
  int arr[3] = {1, 2, 3};
  return arr;
}`,
        choices: [
          { text: "Nothing — it returns the array", why: "It returns a pointer to memory that stops existing the moment the function returns." },
          { text: "arr lives on the stack and is released when the function ends", why: "Correct. The returned pointer refers to a stack frame that has been released, so reading through it is undefined behaviour. Return a vector by value instead — it owns heap memory that survives." },
          { text: "It should return int[] rather than int*", why: "C++ cannot return a raw array type at all. The problem is the lifetime, not the syntax." },
          { text: "The array needs to be const", why: "Constness changes nothing here. The memory is gone either way." },
        ],
        answer: 1,
      },
      viz: traceStackHeap(),
      example: `void f() {
  int n = 5;              // stack. 4 bytes
  int arr[3];             // stack. Size known at compile time
  double big[1000000];    // stack — and likely a stack overflow

  vector<int> v(1000000); // the DATA is on the heap.
                          // Only a pointer/size/capacity is on the stack

  int* raw = new int[100];   // heap, by hand
  delete[] raw;              // and you must release it

  auto owned = make_unique<int[]>(100);   // heap, released automatically
}                           // <- stack values released here, in one step

// NEVER do this
int* bad() {
  int x = 5;
  return &x;              // x is gone the moment we return
}

// do this — the vector owns heap memory that outlives the call
vector<int> good() {
  return {1, 2, 3};
}`,
      notes: [
        { token: "the stack", meaning: "fast, automatic, small. Size must be known" },
        { token: "the heap", meaning: "flexible and large. Something must release it" },
        { token: "return &local", meaning: "a dangling pointer. The classic bug" },
        { token: "vector / unique_ptr", meaning: "hold heap memory and release it for you" },
      ],
      challenge: {
        prompt:
          "Fix the function so what it returns is still valid after the call — return the vector itself rather than a pointer to a local.",
        starter: `int* make() {
  vector<int> v = {1, 2, 3};
  return v.data();
}`,
        rules: {
          regex: ["vector\\s*<\\s*int\\s*>\\s*make\\s*\\(\\s*\\)", "return\\s+v\\s*;"],
          hint: "Return vector<int> by value, and return v; — the vector carries its heap block with it.",
          success:
            "Correct, and it costs nothing: the compiler MOVES the vector out rather than copying it, so the heap block is handed over rather than duplicated.",
        },
        solution: `vector<int> make() {
  vector<int> v = {1, 2, 3};
  return v;
}`,
      },

      alt: {
        c: {
          body: [
            "No, and in C the difference is entirely yours to manage.",
            "The STACK holds locals. A block is reserved when the function is called and released in one step when it returns — fast, automatic, and limited to a few megabytes.",
            "`int arr[3]` is on the stack. So is every local variable you declare without malloc.",
            "The HEAP is where `malloc` gets memory from. You ask for a number of bytes, you get a pointer, and that block stays until YOU call `free`.",
            "`malloc` counts BYTES, not items, so it is always `malloc(n * sizeof(int))`. Writing `malloc(n)` for n ints allocates a quarter of what you need, and C will not tell you.",
            "It can return NULL if there is no memory. Real code checks. Most teaching code does not, which is worth knowing when you copy an example.",
            "`calloc(n, size)` does the multiplication for you AND zeroes the memory. `malloc` leaves it holding whatever was there before, which is a genuine source of bugs that appear to be random.",
            "The rule that follows from all this: never return a pointer to a local. It lives on the stack and is released the moment the function ends. Return malloc'd memory, and document who is responsible for freeing it.",
          ],
          predict: {
            ask: "What is wrong with this C code?",
            code: `int *nums = malloc(100);

for (int i = 0; i < 100; i++) {
  nums[i] = i;
}`,
            choices: [
              { text: "Nothing — 100 ints were allocated", why: "malloc counts bytes, not items, so this allocated 100 bytes rather than 100 ints." },
              { text: "It allocated 100 BYTES, room for about 25 ints", why: "Correct. malloc takes a byte count, so this needed malloc(100 * sizeof(int)). The loop writes far past the end of the block, corrupting whatever is next." },
              { text: "The loop should start at 1", why: "Starting at 0 is right for a 100-element array. The problem is that the block is not 100 elements long." },
              { text: "malloc cannot be used for ints", why: "malloc is used for every type. It simply needs the size in bytes, which is what sizeof is for." },
            ],
            answer: 1,
          },
          example: `void f(void) {
  int n = 5;                   /* stack */
  int arr[3];                  /* stack. Freed when f returns */

  /* heap — and malloc counts BYTES */
  int *nums = malloc(100 * sizeof(int));
  if (nums == NULL) return;    /* real code checks */

  int *zeroed = calloc(100, sizeof(int));   /* multiplies AND zeroes */

  free(nums);                  /* you must. Forgetting leaks */
  nums = NULL;                 /* so a later use fails loudly */
  free(zeroed);
}

/* NEVER return a pointer to a local */
int *bad(void) {
  int x = 5;
  return &x;                   /* x is gone the moment we return */
}

/* return heap memory, and say who frees it */
/* caller must free the result */
int *make(int n) {
  return calloc(n, sizeof(int));
}`,
          notes: [
            { token: "malloc(n * sizeof(T))", meaning: "counts BYTES. The multiply is not optional" },
            { token: "calloc(n, size)", meaning: "multiplies for you, and zeroes the memory" },
            { token: "free then NULL", meaning: "release it, then poison the pointer" },
            { token: "return &local", meaning: "a dangling pointer. Never do it" },
          ],
          prompt:
            "Allocate room for 100 ints, zeroed, and check the allocation succeeded.",
          starter: `int *nums = (100, );
if () return;`,
          rules: {
            regex: ["calloc\\s*\\(\\s*100\\s*,\\s*sizeof\\s*\\(\\s*int\\s*\\)\\s*\\)", "nums\\s*==\\s*NULL|!\\s*nums"],
            hint: "calloc(100, sizeof(int)) allocates and zeroes, then check if (nums == NULL) return;",
            success:
              "Correct. calloc also has a quiet safety advantage over malloc: it checks that the multiplication does not overflow, which malloc(n * size) does not.",
          },
          solution: `int *nums = calloc(100, sizeof(int));
if (nums == NULL) return;`,
        },

        python: {
          hook:
            "You never write malloc in Python and never call free. So where does a list actually live, and why does that matter?",
          body: [
            "Almost everything lives on the heap, and Python manages it for you. That is the whole answer, and the details still matter more than you would expect.",
            "Every value in Python is an OBJECT on the heap — including the number 5. The names in your function are on the stack, and each is an arrow pointing at a heap object.",
            "That has a real cost. A Python int is not four bytes; it is an object with a type pointer, a reference count and the value, typically 28 bytes. A list of a million ints is roughly 40 MB where a C array would be 4 MB.",
            "When that matters, `array.array('i', ...)` stores them packed, and numpy does the same with far more machinery on top.",
            "The stack still exists and still limits you. Python's recursion limit is about 1000 frames by default — much shallower than the other languages here — and `RecursionError` is what you get instead of a crash.",
            "Small integers and short strings are CACHED and shared. `a = 256; b = 256; a is b` is True, and with 257 it is False. That is an implementation detail, it is why `is` must never be used for value comparison, and it is a good reminder that the arrows are real.",
            "The practical rule: think about how many objects you are creating, not about where they live. A list comprehension over a million items builds a million objects; a generator builds none.",
          ],
          predict: {
            ask: "What does this Python code print?",
            code: `import sys

a = 5
b = [1, 2, 3]

print(sys.getsizeof(a) > 20)
print(a is 5)`,
            choices: [
              { text: "False then True", why: "A Python int is a full heap object with a type pointer and a reference count, so it is well over 20 bytes." },
              { text: "True then True", why: "Correct. An int object is about 28 bytes, not 4. And small integers are cached and shared, so `a is 5` is True — which is an implementation detail you must never rely on." },
              { text: "True then False", why: "Small integers from -5 to 256 are cached, so both names point at the same object and `is` is True here. It would be False for 257." },
              { text: "It raises a SyntaxWarning and fails", why: "Modern Python warns about `is` with a literal, but the code still runs and prints True." },
            ],
            answer: 1,
          },
          example: `# every value is a heap object. Names are arrows
a = 5
b = a            # two arrows, one object

import sys
print(sys.getsizeof(5))        # about 28 bytes, not 4
print(sys.getsizeof([]))       # a list has overhead of its own

# the memory cost is real
nums = list(range(1_000_000))  # roughly 40 MB

import array
packed = array.array('i', range(1_000_000))   # about 4 MB

# the stack still limits you
import sys
print(sys.getrecursionlimit())     # about 1000
# sys.setrecursionlimit(10000)     # possible, and rarely the fix

# small ints and short strings are cached and SHARED
print(256 is 256)      # True
print(257 is 257)      # False in most contexts
                       # which is why is is not for comparing values

# generators build nothing
total = sum(x * 2 for x in range(1_000_000))   # no list is ever made`,
          notes: [
            { token: "everything is a heap object", meaning: "including numbers. Names are arrows" },
            { token: "getsizeof(5)", meaning: "about 28 bytes. Not four" },
            { token: "array.array / numpy", meaning: "packed storage, when the memory matters" },
            { token: "the recursion limit", meaning: "about 1000 frames. Much shallower than the others" },
          ],
          prompt:
            "Store a million ints compactly rather than as a list of objects.",
          starter: `import array

packed = array.('i', range(1_000_000))`,
          rules: {
            regex: ["array\\.array\\s*\\(\\s*['\"]i['\"]\\s*,\\s*range\\s*\\(\\s*1_?0?00_?000\\s*\\)\\s*\\)"],
            hint: "array.array('i', range(1_000_000)) — the 'i' says signed int.",
            success:
              "Correct. The saving is about ten times, and the trade is that an array.array holds ONE type only — which is exactly the restriction that lets it pack the values.",
          },
          solution: `import array

packed = array.array('i', range(1_000_000))`,
        },

        java: {
          body: [
            "No, and Java's split is unusually clean: primitives on the stack, objects on the heap, always.",
            "`int n = 5` puts the 5 itself in the stack frame. `Integer n = 5` puts an object on the heap and an arrow to it on the stack.",
            "That is the practical meaning of the primitive/object divide, and it explains the memory difference: a million-element `int[]` is about 4 MB, while a `List<Integer>` of the same numbers is closer to 20 MB — an object per number, plus the arrows.",
            "An ARRAY is always a heap object in Java, even an array of primitives. `int[] a = new int[3]` puts three ints together on the heap and an arrow on the stack.",
            "The stack is where the frames live, and it is limited. Deep recursion throws `StackOverflowError` — an Error rather than an Exception, because it is not something you are meant to recover from.",
            "The heap is managed by the garbage collector, and you never free anything. What you CAN do is control how much heap the program may use, with `-Xmx`.",
            "One thing worth knowing early: the JVM allocates heap objects extremely quickly — a pointer bump, not a search — so 'avoid allocating' is much weaker advice in Java than in C++. What costs is keeping objects alive long enough to be promoted between collector generations.",
          ],
          predict: {
            ask: "Which of these hold their data on the heap?",
            code: `int n = 5;
Integer boxed = 5;
int[] arr = new int[3];
String s = "hi";`,
            choices: [
              { text: "Only boxed and s", why: "An array is always a heap object in Java, even an array of primitives." },
              { text: "boxed, arr and s", why: "Correct. Only the plain int lives entirely in the stack frame. The Integer, the array and the String are all heap objects, with arrows to them on the stack." },
              { text: "All four", why: "A local int is stored directly in the stack frame — that is the whole point of the primitive types." },
              { text: "Only s, because strings are pooled", why: "The pool is where identical string literals are shared. All three of the non-primitives are heap objects regardless." },
            ],
            answer: 1,
          },
          example: `void f() {
  int n = 5;                  // the 5 itself, in the stack frame
  Integer boxed = 5;          // an OBJECT on the heap, arrow on the stack
  int[] arr = new int[3];     // the array is a heap object too
  String s = "hi";            // heap, and pooled

}                             // frame released. Heap objects stay

// the memory difference is real
// int[1_000_000]           about 4 MB
// List<Integer> the same   about 20 MB

// the stack is limited
void recurse(int n) { recurse(n + 1); }   // StackOverflowError

// the heap is managed. You cannot free, only stop referring
byte[] big = new byte[100_000_000];
big = null;                   // now unreachable, and collectible

// what you CAN control
// java -Xmx512m MyApp        the maximum heap size

// allocation is cheap in the JVM. Keeping things alive is what costs`,
          notes: [
            { token: "primitives", meaning: "in the stack frame. int, double, boolean, char" },
            { token: "everything else", meaning: "a heap object, with an arrow on the stack" },
            { token: "int[] vs List<Integer>", meaning: "about 4 MB versus about 20 MB" },
            { token: "StackOverflowError", meaning: "deep recursion. An Error, not an Exception" },
          ],
          prompt:
            "Declare a million numbers in the form that uses the least memory.",
          starter: ` nums = new [1_000_000];`,
          rules: {
            regex: ["int\\s*\\[\\s*\\]\\s*nums\\s*=\\s*new\\s+int\\s*\\[\\s*1_?000_?000\\s*\\]"],
            mustNot: ["Integer[]", "List<Integer>"],
            hint: "int[] nums = new int[1_000_000]; — the primitive array, not Integer[].",
            success:
              "Correct. An Integer[] would be a million arrows plus a million objects — around five times the memory, and much slower to walk because the numbers are scattered rather than adjacent.",
          },
          solution: `int[] nums = new int[1_000_000];`,
        },

        javascript: {
          hook:
            "You never allocate or free in JavaScript. So what actually happens when you write `const a = [1, 2, 3]`?",
          body: [
            "An object is created on the heap, and `a` becomes an arrow pointing at it. The engine manages the rest.",
            "The split is the same as Java's in spirit: PRIMITIVES — numbers, strings, booleans, null, undefined, symbols, bigints — behave as values, and everything else is an object referred to by an arrow.",
            "So `let b = a` on a number copies the number, and on an array copies the arrow. That single distinction explains most surprising behaviour in the language.",
            "One thing specific to JavaScript: there is only one number type, a 64-bit float. `1` and `1.5` are the same kind of thing, integers above 2^53 lose precision, and `BigInt` exists for when you need exact large integers.",
            "The stack limits recursion, and the limit is smaller than you would hope — typically around ten thousand frames, and it varies by engine. Deep recursion gives `RangeError: Maximum call stack size exceeded`.",
            "The heap is garbage collected and you cannot free anything. What you can do is stop referring to things — and the common leak in JavaScript is exactly the opposite: an event listener, a timer or a closure that keeps referring to something long after you have finished with it.",
            "`WeakMap` and `WeakSet` exist for that case: they hold a key without keeping it alive, so an entry disappears when nothing else refers to the key.",
          ],
          predict: {
            ask: "What does this print?",
            code: `let a = 1;
let b = a;
b = 2;

let x = [1];
let y = x;
y.push(2);

console.log(a, x);`,
            choices: [
              { text: "1 [1, 2]", why: "Correct. A number is a primitive, so b got a copy and changing it left a alone. An array is an object, so y is a second arrow to the same array, and pushing through it is visible through x." },
              { text: "2 [1, 2]", why: "Numbers are copied by value — reassigning b cannot reach a." },
              { text: "1 [1]", why: "y and x point at one array, so the push is visible through both names." },
              { text: "2 [1]", why: "It is exactly the other way round: the number is independent and the array is shared." },
            ],
            answer: 0,
          },
          example: `// primitives behave as values
let a = 1;
let b = a;          // a copy
b = 2;              // a is still 1

// everything else is an arrow to a heap object
let x = [1];
let y = x;          // the same array, two names
y.push(2);          // x sees it

// one number type: a 64-bit float
console.log(0.1 + 0.2);              // 0.30000000000000004
console.log(Number.MAX_SAFE_INTEGER);// 9007199254740991
console.log(9007199254740993n);      // BigInt, for exact large integers

// the stack limits recursion
function f(n) { return f(n + 1); }   // RangeError, around 10k frames

// you cannot free — only stop referring
let big = new Array(1e7);
big = null;                          // now collectible

// the usual JS leak: something still referring
element.addEventListener("click", handler);
element.removeEventListener("click", handler);   // or it lives forever

// hold a key WITHOUT keeping it alive
const cache = new WeakMap();
cache.set(someObject, "data");       // vanishes when someObject does`,
          notes: [
            { token: "primitives vs objects", meaning: "copied by value, versus shared by arrow" },
            { token: "one number type", meaning: "a 64-bit float. BigInt for exact large integers" },
            { token: "the usual leak", meaning: "listeners, timers and closures still referring" },
            { token: "WeakMap", meaning: "holds a key without keeping it alive" },
          ],
          prompt:
            "Use the collection that lets its keys be collected when nothing else refers to them.",
          starter: `const cache = new ();
cache.set(someObject, "data");`,
          rules: {
            regex: ["new\\s+WeakMap\\s*\\(\\s*\\)"],
            mustNot: ["new Map()"],
            hint: "new WeakMap() — a normal Map would keep every key alive forever.",
            success:
              "Correct. The trade is that a WeakMap is not iterable and has no size — it cannot be, because entries may disappear between one line and the next.",
          },
          solution: `const cache = new WeakMap();
cache.set(someObject, "data");`,
        },

        rust: {
          body: [
            "No, and Rust is the most explicit of the six about which is which — the type itself tells you.",
            "`[i32; 3]` is an array: three ints, size known at compile time, on the stack. `Vec<i32>` is growable, so its data is on the heap and only a pointer, length and capacity sit on the stack.",
            "`&str` is a borrowed view, often pointing at text baked into the program. `String` owns heap memory. That pair is the same distinction again.",
            "`Box<T>` is the simplest way to put something on the heap deliberately: one value, one owner, released when the box goes out of scope. You need it for recursive types — a linked list node cannot contain itself, but it can contain a Box of itself.",
            "The size rule is visible in the type system. A type must have a known size to sit on the stack, and `dyn Trait` and `[T]` do not — which is why they always appear behind a reference or a Box.",
            "Rust's stack limit is the usual few megabytes, and overflowing it aborts the program rather than corrupting anything. Deep recursion is still deep recursion.",
            "The claim Rust makes, and the reason for all this explicitness: because the compiler knows where every value lives and how long it lives, it can insert the cleanup itself. No collector, no manual free, and no dangling pointers — that is section three.",
          ],
          predict: {
            ask: "Why does this Rust code fail to compile?",
            code: `enum List {
    Cons(i32, List),
    Nil,
}`,
            choices: [
              { text: "Enums cannot be recursive at all", why: "They can — through a Box, which has a known size. The problem is size, not recursion." },
              { text: "The size is infinite: List contains a List directly", why: "Correct. To know how big a List is, the compiler must know how big the List inside it is, and so on forever. Box<List> is a pointer with a fixed size, which breaks the loop." },
              { text: "Nil needs a value", why: "A variant with no data is perfectly normal — that is what Nil is for." },
              { text: "i32 is the wrong type here", why: "The type of the value is irrelevant. The recursion in the variant is what has no finite size." },
            ],
            answer: 1,
          },
          example: `fn f() {
    let n: i32 = 5;                 // stack
    let arr: [i32; 3] = [1, 2, 3];  // stack. Size known at compile time

    let v: Vec<i32> = vec![0; 1_000_000];   // DATA on the heap.
    // On the stack: a pointer, a length and a capacity

    let s: &str = "hi";             // a view into the binary
    let owned: String = s.to_string();      // owns heap memory

    let boxed: Box<i32> = Box::new(5);      // one value, on the heap
}                                   // everything released here, in order

// Box is what makes recursive types possible
enum List {
    Cons(i32, Box<List>),           // a pointer has a known size
    Nil,
}

// types with no known size only appear behind a reference or Box
// let x: dyn Shape;                // will not compile
let x: &dyn Shape;                  // fine
let y: Box<dyn Shape>;              // fine

// how big is it?
println!("{}", std::mem::size_of::<i32>());       // 4
println!("{}", std::mem::size_of::<Vec<i32>>());  // 24 — ptr, len, cap`,
          notes: [
            { token: "[i32; 3] vs Vec<i32>", meaning: "stack, versus a handle on the stack and data on the heap" },
            { token: "&str vs String", meaning: "a borrowed view, versus owned heap memory" },
            { token: "Box<T>", meaning: "one value on the heap. Makes recursive types possible" },
            { token: "size_of::<Vec<i32>>()", meaning: "24 — a pointer, a length and a capacity" },
          ],
          prompt:
            "Fix the recursive enum so the compiler can work out its size.",
          starter: `enum List {
    Cons(i32, List),
    Nil,
}`,
          rules: {
            regex: ["Cons\\s*\\(\\s*i32\\s*,\\s*Box\\s*<\\s*List\\s*>\\s*\\)"],
            hint: "Wrap the recursive part: Cons(i32, Box<List>).",
            success:
              "Correct. A Box is a pointer, and a pointer's size is known — so List becomes 'an i32 plus a pointer', which is finite however deep the list gets.",
          },
          solution: `enum List {
    Cons(i32, Box<List>),
    Nil,
}`,
        },
      },
    },

    /* ----------------------------------------------------- references -- */
    {
      id: "arrows",
      kicker: "02",
      title: "Names, arrows, and nothing",
      hook:
        "`b = a` — did that copy the data, or just give it a second name? In C++ the answer depends on how you wrote it, and in four of the others you have no choice.",
      body: [
        "C++ is the odd one out here, in a way that is worth appreciating: it lets you say exactly which you meant.",
        "`Dog b = a;` COPIES. Two independent dogs. That is the default, and it is unusual — Python, Java and JavaScript all share instead.",
        "`Dog& b = a;` is a REFERENCE: a second name for the same dog. It must be set when it is created and can never be pointed anywhere else afterwards.",
        "`Dog* b = &a;` is a POINTER: it holds an address, it can be reassigned, and it can be null. Reading through a null or dangling pointer is undefined behaviour — anything at all may happen.",
        "The rule of thumb: use references when something must exist, pointers when it might not, and values when copying is cheap or you want independence.",
        "Modern C++ replaces most raw pointers with SMART pointers. `unique_ptr` is one owner, released automatically. `shared_ptr` counts owners and releases when the last one goes.",
        "Prefer `unique_ptr` and reach for `shared_ptr` only when ownership is genuinely shared — it costs an atomic counter on every copy, and two objects holding shared_ptrs to each other leak forever unless one side uses `weak_ptr`.",
      ],
      predict: {
        ask: "What does this C++ code print?",
        code: `struct Dog { int age = 1; };

Dog a;
Dog  b = a;      // a copy
Dog& c = a;      // a reference

b.age = 2;
c.age = 3;

cout << a.age;`,
        choices: [
          { text: "1", why: "c is a reference to a, so setting c.age set a.age." },
          { text: "3", why: "Correct. b is an independent copy, so b.age = 2 changed nothing here. c is another name for a, so c.age = 3 set a.age to 3." },
          { text: "2", why: "b is a copy — writing through it cannot reach a." },
          { text: "It will not compile", why: "Both a copy and a reference are ordinary C++. The one-character difference between them is exactly the point." },
        ],
        answer: 1,
      },
      viz: traceReference(),
      example: `Dog a;

Dog  copy  = a;    // an independent copy
Dog& ref   = a;    // another name for a. Set once, never moved
Dog* ptr   = &a;   // an address. Reassignable, and may be null

ref.age = 3;       // changes a
ptr->age = 4;      // changes a. -> because it is a pointer
(*ptr).age = 4;    // the same thing, spelled out

ptr = nullptr;     // fine. A reference could not do this
// ptr->age        // undefined behaviour. Often a crash

// prefer smart pointers to raw ones
auto one = make_unique<Dog>();      // ONE owner. Released automatically
auto many = make_shared<Dog>();     // counted. Released when the last goes
weak_ptr<Dog> watcher = many;       // does NOT keep it alive

// two shared_ptrs pointing at each other never die.
// One side must be a weak_ptr

// pass by const reference: no copy, no changes
void report(const Dog& d);`,
      notes: [
        { token: "Dog b = a", meaning: "a real copy. C++'s default, unlike most languages" },
        { token: "Dog& b = a", meaning: "a second name. Cannot be null, cannot be moved" },
        { token: "Dog* b = &a", meaning: "an address. May be null, may be reassigned" },
        { token: "unique_ptr / shared_ptr", meaning: "owning pointers that release themselves" },
      ],
      challenge: {
        prompt:
          "Create a Dog on the heap with a single owner that is released automatically when it goes out of scope.",
        starter: `auto d = <Dog>();`,
        rules: {
          regex: ["make_unique\\s*<\\s*Dog\\s*>\\s*\\(\\s*\\)"],
          mustNot: ["new Dog"],
          hint: "make_unique<Dog>() gives you a unique_ptr with one owner.",
          success:
            "Correct. make_unique is preferred over `unique_ptr<Dog>(new Dog())` for a subtle reason: it cannot leak if another argument in the same call throws part-way through.",
        },
        solution: `auto d = make_unique<Dog>();`,
      },

      alt: {
        c: {
          body: [
            "In C the answer is always the same: `b = a` copies. Everything is copied, including whole structs.",
            "The only way to refer to something without copying it is a POINTER — a variable holding an address.",
            "`int *p = &n;` takes the address of n. `*p` reads or writes what is there. `p->field` is the shorthand for `(*p).field` when p points at a struct.",
            "Those two operators are the whole of it: `&` means 'the address of', `*` means 'the thing at'. Everything else in C's pointer syntax is decoration on top.",
            "`NULL` is a pointer pointing at nothing. Reading through it is undefined behaviour — usually a crash, sometimes worse. Real C code checks before dereferencing, every time.",
            "The dangerous case is the DANGLING pointer: one pointing at memory that has been freed, or at a local whose function has returned. It often appears to work, because the memory has not been reused yet, and then fails somewhere unrelated.",
            "The two habits that prevent most of this: set a pointer to NULL immediately after freeing it, and never return a pointer to a local. Neither costs anything, and between them they turn silent corruption into an obvious crash.",
          ],
          predict: {
            ask: "What is the danger in this C code?",
            code: `int *p = malloc(sizeof(int));
*p = 5;

free(p);

printf("%d", *p);`,
            choices: [
              { text: "It prints 5 — free does not erase the memory", why: "It may well print 5, and that is what makes it dangerous rather than safe. The memory no longer belongs to you." },
              { text: "Use after free: p still holds the address, but the memory is no longer yours", why: "Correct. free does not change p, and often does not erase the data, so this may print 5 and appear to work — until the block is handed to something else and the same code silently reads or corrupts unrelated data." },
              { text: "free needs the size as a second argument", why: "free takes only the pointer; the allocator tracks the size itself. The bug is using p afterwards." },
              { text: "It will not compile", why: "It compiles without a warning from most compilers. That is precisely the problem." },
            ],
            answer: 1,
          },
          example: `int n = 5;
int *p = &n;         /* & = the address of */

printf("%d", *p);    /* * = the thing at   */
*p = 10;             /* writes through it. n is now 10 */

struct Dog d;
struct Dog *dp = &d;
dp->age = 3;         /* shorthand for (*dp).age */

/* NULL is an address pointing at nothing */
int *q = NULL;
if (q != NULL) printf("%d", *q);   /* always check */

/* structs are COPIED on assignment */
struct Dog copy = d;               /* independent */

/* the two habits that prevent most pointer bugs */
free(p);
p = NULL;            /* 1. poison it after freeing */

int *bad(void) {
  int x = 5;
  return &x;         /* 2. never do this. x dies here */
}

/* const says "I will not write through this" */
void report(const struct Dog *d);`,
          notes: [
            { token: "&n", meaning: "the address of n" },
            { token: "*p", meaning: "the thing at that address" },
            { token: "p->field", meaning: "shorthand for (*p).field" },
            { token: "free then NULL", meaning: "turns silent corruption into an obvious crash" },
          ],
          prompt:
            "Free the block and then make the pointer safe to check.",
          starter: `free(p);
 = ;

if (p != NULL) printf("%d", *p);`,
          rules: {
            regex: ["free\\s*\\(\\s*p\\s*\\)\\s*;\\s*p\\s*=\\s*NULL"],
            hint: "p = NULL; right after the free.",
            success:
              "Correct. Without it p still holds the old address and every later check passes — so the bug turns into a mystery instead of a crash on the line that caused it.",
          },
          solution: `free(p);
p = NULL;

if (p != NULL) printf("%d", *p);`,
        },

        python: {
          body: [
            "In Python `b = a` never copies. It gives the same object a second name, and that is the single most useful thing to know about how Python behaves.",
            "There are no pointers to write and no references to declare. Every name is an arrow, always.",
            "So the question that matters is not 'is this a copy?' but 'can this object be changed at all?'.",
            "Lists, dicts, sets and most objects are MUTABLE: they can be changed in place, so a change through one name is visible through every other. Numbers, strings and tuples are IMMUTABLE: they cannot be changed, so sharing them is never noticeable.",
            "To get a real copy, ask for one: `a[:]`, `list(a)`, `a.copy()` or `copy.copy(a)` for a shallow one, and `copy.deepcopy(a)` when the contents are themselves objects.",
            "`None` is Python's nothing. It is a real object, there is exactly one of it, and you test for it with `is None` rather than `== None`.",
            "Python has no null-pointer crash in the C sense: calling a method on None raises AttributeError with a clear message. The bug is the same, and finding it takes minutes rather than days.",
          ],
          predict: {
            ask: "What does this Python code print?",
            code: `import copy

a = [[1], [2]]
b = copy.copy(a)

b.append([3])
b[0].append(99)

print(len(a), a[0])`,
            choices: [
              { text: "3 [1, 99]", why: "The append of [3] went into b's own outer list, so a's length is unchanged at 2." },
              { text: "2 [1, 99]", why: "Correct. A shallow copy duplicates the outer list only — so appending to b does not affect a, but the inner lists are shared and appending to b[0] changes a[0] too." },
              { text: "2 [1]", why: "The inner lists are shared by a shallow copy, so the 99 appears in both." },
              { text: "3 [1]", why: "Neither part is right: the outer lists are separate, and the inner ones are not." },
            ],
            answer: 1,
          },
          example: `a = [1, 2, 3]

b = a                # NOT a copy. One list, two names
b.append(4)          # a sees it

import copy
b = a[:]             # a shallow copy
b = list(a)          # the same
b = a.copy()         # the same
b = copy.deepcopy(a) # copies nested objects too

# mutable: changes are visible through every name
# list, dict, set, and most objects

# immutable: cannot be changed, so sharing is invisible
# int, float, str, tuple, frozenset

# None is the nothing. Test it with is
x = None
if x is None: print("nothing")
# x.upper()          # AttributeError, with a clear message

# id() shows which object a name points at
print(id(a) == id(b))

# the mutable-default trap, one more time
def f(items=[]):     # made ONCE, shared by every call
    items.append(1)
def g(items=None):   # do this
    if items is None: items = []`,
          notes: [
            { token: "b = a", meaning: "never a copy. A second name for one object" },
            { token: "a[:] or a.copy()", meaning: "shallow. Nested objects are still shared" },
            { token: "copy.deepcopy(a)", meaning: "copies all the way down" },
            { token: "x is None", meaning: "the test for nothing. Not == None" },
          ],
          prompt:
            "Copy a so that changing the nested lists in the copy does not affect the original.",
          starter: `import copy

a = [[1], [2]]
b = copy.(a)`,
          rules: {
            regex: ["copy\\.deepcopy\\s*\\(\\s*a\\s*\\)"],
            mustNot: ["copy.copy(a)"],
            hint: "copy.deepcopy(a) — a shallow copy would leave the inner lists shared.",
            success:
              "Correct, and deepcopy is not free: it walks the whole structure and rebuilds it. Reach for it when you need it, and prefer a shallow copy when the contents cannot change anyway.",
          },
          solution: `import copy

a = [[1], [2]]
b = copy.deepcopy(a)`,
        },

        java: {
          body: [
            "In Java the answer depends on the type, and the divide is clean: primitives copy, everything else shares.",
            "`int b = a;` copies the number. `Dog b = a;` copies the ARROW — one dog, two names.",
            "Java calls these references, and they are not C++ references. A Java reference can be reassigned and can be null; it is much closer to a pointer with the dangerous parts removed.",
            "There is no address-of operator, no pointer arithmetic, and no way to get at raw memory. That is the trade Java made, and it removes an entire category of bug.",
            "What it does not remove is `null`. Calling a method on null throws NullPointerException — the single most common Java exception, and the one Tony Hoare famously called his billion-dollar mistake.",
            "`Optional<T>` is the modern answer for a value that might be absent: return `Optional<Dog>` rather than a Dog that might be null, and the caller cannot forget to handle it.",
            "For copying, Java gives you no good default. `clone()` is awkward and widely advised against; a copy constructor — `new Dog(other)` — is clearer. And every one of these is shallow unless you write the deep version yourself.",
          ],
          predict: {
            ask: "What does this Java code print?",
            code: `int[] a = {1, 2, 3};
int[] b = a;
int[] c = a.clone();

b[0] = 99;
c[1] = 88;

System.out.println(a[0] + " " + a[1]);`,
            choices: [
              { text: "1 2", why: "b is another name for the same array, so writing through it changed a[0]." },
              { text: "99 2", why: "Correct. b = a copies the arrow, so b[0] = 99 changed the one array. clone() made a genuine copy, so c[1] = 88 did not reach a." },
              { text: "99 88", why: "clone() on an array is a real copy, so writing to c cannot affect a." },
              { text: "1 88", why: "b and a are the same array, so the 99 is visible through a." },
            ],
            answer: 1,
          },
          example: `int a = 1;
int b = a;              // a copy. Primitives always copy

Dog d = new Dog();
Dog alias = d;          // the same dog, two names
alias.age = 3;          // d sees it

// no address-of, no pointer arithmetic, no raw memory

// null, and the exception it causes
Dog missing = null;
// missing.speak();     // NullPointerException

// the modern way to say "might not be there"
Optional<Dog> found = repo.find(id);
found.ifPresent(Dog::speak);
Dog or = found.orElse(new Dog());

// copying: no good default. A copy constructor is clearest
class Dog {
  private final String name;
  Dog(Dog other) { this.name = other.name; }   // shallow
}

// arrays and collections
int[] copy = original.clone();                 // real copy
int[] copy2 = Arrays.copyOf(original, original.length);
List<Dog> shallow = new ArrayList<>(dogs);     // same Dog objects

// final stops the NAME moving, not the object changing
final List<Dog> list = new ArrayList<>();
list.add(d);            // allowed
// list = other;        // not allowed`,
          notes: [
            { token: "primitives copy", meaning: "everything else shares an arrow" },
            { token: "no pointers", meaning: "no address-of, no arithmetic. Null remains" },
            { token: "Optional<T>", meaning: "says 'might be absent' so callers cannot forget" },
            { token: "final", meaning: "the name cannot move. The object can still change" },
          ],
          prompt:
            "Make a real copy of the array, so writing to it leaves the original alone.",
          starter: `int[] a = {1, 2, 3};
int[] b = ;`,
          rules: {
            regex: ["a\\.clone\\s*\\(\\s*\\)|Arrays\\.copyOf\\s*\\(\\s*a\\s*,\\s*a\\.length\\s*\\)"],
            mustNot: ["int[] b = a;"],
            hint: "a.clone() — or Arrays.copyOf(a, a.length). Plain b = a would only add a second name.",
            success:
              "Correct for an array of primitives. On an array of OBJECTS, clone() is still shallow — you would get a new array pointing at the very same objects.",
          },
          solution: `int[] a = {1, 2, 3};
int[] b = a.clone();`,
        },

        javascript: {
          body: [
            "In JavaScript the answer depends on the type, and the divide is the same as Java's: primitives copy, objects share.",
            "Numbers, strings, booleans, null, undefined, symbols and bigints are copied. Objects, arrays and functions are shared through an arrow.",
            "`const` does not change this at all, and that catches people constantly. `const arr = []` stops you pointing arr somewhere else; it does nothing to stop `arr.push(1)`.",
            "For a real copy, `[...arr]` and `{...obj}` are the everyday shallow ones. `structuredClone(x)` does a deep copy, handles cycles, and is built into modern browsers and Node.",
            "The older `JSON.parse(JSON.stringify(x))` trick works for simple data and quietly destroys dates, undefined values, functions and anything cyclic. Prefer structuredClone.",
            "JavaScript has TWO nothings, which is one more than anyone wanted. `undefined` means 'never given a value'. `null` means 'deliberately nothing'.",
            "In practice: `x == null` is true for both and is the one place `==` is worth using. And `?.` and `??` handle the common cases neatly — `user?.name ?? \"anon\"` reads the name only if user exists, and falls back if it does not.",
          ],
          predict: {
            ask: "What does this print?",
            code: `const obj = { a: 1, b: { c: 2 } };
const copy = { ...obj };

copy.a = 99;
copy.b.c = 88;

console.log(obj.a, obj.b.c);`,
            choices: [
              { text: "99 88", why: "The spread made a new outer object, so setting copy.a could not reach obj.a." },
              { text: "1 88", why: "Correct. The spread is SHALLOW: a is copied so the 99 stays in copy, but b is the same inner object in both, so setting c to 88 is visible through obj too." },
              { text: "1 2", why: "The inner object is shared by a shallow copy, so the change to c does show up in obj." },
              { text: "99 2", why: "It is the other way round: the top-level property is independent and the nested object is shared." },
            ],
            answer: 1,
          },
          example: `let a = 1;
let b = a;               // a copy. Primitives always copy

const arr = [1, 2];
const alias = arr;       // the same array, two names
alias.push(3);           // arr sees it

// const does NOT stop the contents changing
const list = [];
list.push(1);            // allowed
// list = [];            // not allowed

// copying
const shallow = [...arr];
const shallowObj = { ...obj };
const deep = structuredClone(obj);      // handles nesting and cycles
// JSON.parse(JSON.stringify(obj))      // loses dates, undefined, functions

// two nothings
let u;                   // undefined — never given a value
let n = null;            // null — deliberately nothing

console.log(u == null);  // true for BOTH. The one useful ==
console.log(u === null); // false

// the modern shorthands
const name = user?.profile?.name ?? "anon";
user?.save?.();          // call it only if it exists

// freeze, if you want the contents protected. Shallow too
Object.freeze(obj);`,
          notes: [
            { token: "const", meaning: "the name cannot move. The contents can still change" },
            { token: "{...obj} / [...arr]", meaning: "shallow copies. Nested objects stay shared" },
            { token: "structuredClone(x)", meaning: "a real deep copy, cycles included" },
            { token: "undefined vs null", meaning: "never set, versus deliberately nothing" },
          ],
          prompt:
            "Make a deep copy of obj, so changing nested values in the copy leaves the original alone.",
          starter: `const obj = { a: 1, b: { c: 2 } };
const copy = (obj);`,
          rules: {
            regex: ["structuredClone\\s*\\(\\s*obj\\s*\\)"],
            mustNot: ["{ ...obj }"],
            hint: "structuredClone(obj) — a spread would leave the nested object shared.",
            success:
              "Correct. structuredClone also handles cycles, Dates, Maps and Sets — all of which the older JSON round-trip either loses or crashes on.",
          },
          solution: `const obj = { a: 1, b: { c: 2 } };
const copy = structuredClone(obj);`,
        },

        rust: {
          body: [
            "In Rust `let b = a;` does a third thing that none of the other five have: it MOVES.",
            "The value is handed over, and the old name becomes unusable. Not a copy, not an alias — a transfer of ownership, checked at compile time.",
            "That is the core rule: every value has exactly one owner, and when the owner goes out of scope the value is released. No collector, no manual free.",
            "Small types like `i32` are `Copy`, so they are copied instead of moved and behave exactly as they do everywhere else. It is the heap-owning types — String, Vec, Box — where moves are visible.",
            "To use a value without taking it, BORROW with `&`. And the borrow rules are the second half of the system: you may have many readers, or exactly one writer, never both at once.",
            "That single rule is what makes data races impossible, and it is also what stops the dangling-pointer bugs C has: the compiler will not let a reference outlive what it points at.",
            "There is no null. A value that might be absent is `Option<T>` — `Some(x)` or `None` — and the compiler makes you handle the None case. That is why Rust programs do not have null-pointer crashes: the case exists in the type system rather than hiding in every reference.",
            "For a real copy, `.clone()`, written out so the cost is visible. And for shared ownership when one owner genuinely is not enough, `Rc<T>` counts references — with `Weak<T>` to break cycles, exactly as C++'s shared_ptr and weak_ptr do.",
          ],
          predict: {
            ask: "What does the Rust compiler say about this?",
            code: `let mut v = vec![1, 2, 3];

let first = &v[0];
v.push(4);

println!("{}", first);`,
            choices: [
              { text: "It compiles and prints 1", why: "push needs a mutable borrow while first still holds an immutable one, which the borrow rules forbid." },
              { text: "Error: cannot borrow `v` as mutable because it is also borrowed as immutable", why: "Correct. first is an immutable borrow that is still in use at the println, and push needs a mutable borrow. The rule is many readers OR one writer, never both — and this is exactly the C++ dangling-reference bug, caught at compile time." },
              { text: "It compiles but prints garbage", why: "Rust has no way to reach released memory through a reference — the compiler rejects the program instead." },
              { text: "Error: v must be immutable", why: "v is correctly declared mut for the push. The conflict is between the two overlapping borrows." },
            ],
            answer: 1,
          },
          example: `let a = String::from("hi");
let b = a;              // MOVED. a is now unusable
// println!("{}", a);   // compile error: value moved

let c = String::from("hi");
let d = c.clone();      // a real copy, and the cost is written down

let n = 5;
let m = n;              // i32 is Copy, so this copies. n still fine

// borrow instead of taking
let s = String::from("hi");
let r = &s;             // borrow to read. s is still yours
println!("{} {}", s, r);

let mut t = String::from("hi");
let w = &mut t;         // borrow to WRITE. Only one at a time
w.push('!');

// many readers OR one writer, never both

// no null. Absence is a value you must handle
let maybe: Option<i32> = None;
match maybe {
    Some(x) => println!("{}", x),
    None => println!("nothing"),
}
println!("{}", maybe.unwrap_or(0));

// shared ownership, when one owner is not enough
use std::rc::{Rc, Weak};
let shared = Rc::new(5);
let also = Rc::clone(&shared);      // count is now 2
println!("{}", Rc::strong_count(&shared));
// Weak<T> to break cycles, exactly like C++'s weak_ptr`,
          notes: [
            { token: "let b = a", meaning: "a MOVE. a is unusable afterwards" },
            { token: "&x and &mut x", meaning: "borrow to read, or to write. Never both at once" },
            { token: "Option<T>", meaning: "there is no null. Absence is a value you handle" },
            { token: "Rc<T> / Weak<T>", meaning: "shared ownership, and how to break the cycles" },
          ],
          prompt:
            "Print the string and then use it again — borrow it rather than moving it into the println's variable.",
          starter: `let s = String::from("hi");
let r = s;

println!("{} {}", s, r);`,
          rules: {
            regex: ["let\\s+r\\s*=\\s*&s\\s*;"],
            mustNot: ["let r = s;"],
            hint: "let r = &s; — the & borrows it, so s is still usable on the next line.",
            success:
              "Correct. `let r = s;` would have moved the String into r, and the compiler would then point at the println and tell you s was moved on the line above — the error names both places.",
          },
          solution: `let s = String::from("hi");
let r = &s;

println!("{} {}", s, r);`,
        },
      },
    },

    /* -------------------------------------------------------- cleanup -- */
    {
      id: "cleanup",
      kicker: "03",
      title: "Who cleans up",
      hook:
        "You open a file, read it, and return early because something went wrong. Does the file get closed?",
      body: [
        "In C++, yes — automatically, on every path out of the function, including one taken by an exception. That mechanism is the best idea C++ has, and it has an ugly name: RAII.",
        "The idea is simple. Tie the resource to an object. Getting the object opens the file, taking the memory, or locking the mutex; DESTROYING the object releases it. And an object is destroyed when it goes out of scope, whatever way you leave.",
        "So `ifstream f(\"data.txt\")` closes itself. `lock_guard<mutex> g(m)` unlocks itself. `vector<int> v` frees itself. There is no `finally` in C++ because there is nothing to put in it.",
        "The cost is zero. The compiler inserts the destructor call at every exit point; nothing is checked at run time.",
        "Which is why modern C++ says: never write a bare `new` and `delete`. Use `unique_ptr` and `make_unique`, and the memory is managed by the same mechanism as everything else.",
        "The failure modes of doing it by hand are worth naming, because they are the ones the other languages are trying to avoid. LEAK: never freed. DOUBLE FREE: freed twice. USE AFTER FREE: used once released — the most dangerous, because it often appears to work.",
        "Garbage-collected languages remove all three and take away the timing. Rust removes all three and keeps the timing. C++ with RAII is much closer to Rust here than to C.",
      ],
      predict: {
        ask: "What happens to the file if this function throws?",
        code: `void read() {
  ifstream f("data.txt");
  process(f);      // this may throw
  // no explicit close
}`,
        choices: [
          { text: "The file stays open — nothing closed it", why: "The ifstream's destructor runs as the stack unwinds, and closing the file is exactly what that destructor does." },
          { text: "It is closed. The destructor runs as the stack unwinds", why: "Correct. That is RAII: the file is tied to an object, and leaving the scope for any reason — return, exception, or falling off the end — destroys the object and closes the file." },
          { text: "Only if you add a try/catch", why: "No catch is needed. Destructors run during unwinding, which is why C++ has no finally keyword." },
          { text: "It depends on the compiler", why: "This is guaranteed by the language. Destructors of fully constructed objects always run when leaving a scope." },
        ],
        answer: 1,
      },
      viz: traceCleanup(),
      example: `// RAII: the object owns the resource, and destroying it releases
void read() {
  ifstream f("data.txt");        // opens
  lock_guard<mutex> g(m);        // locks
  auto p = make_unique<Dog>();   // takes heap memory

  if (bad) return;               // ALL THREE released here
  process(f);                    // and here, even if this throws
}                                // and here

// so C++ needs no finally

// never write these by hand any more
Dog* raw = new Dog();
delete raw;                      // leaks if anything above throws

// write this instead
auto owned = make_unique<Dog>();

// the three failure modes RAII removes
// leak            never freed
// double free     freed twice
// use after free  used once released. The dangerous one

// your own type joins in by having a destructor
class File {
  FILE* f;
 public:
  File(const char* p) { f = fopen(p, "r"); }
  ~File() { if (f) fclose(f); }        // runs automatically
};`,
      notes: [
        { token: "RAII", meaning: "the object owns it. Destroying the object releases it" },
        { token: "~Dog()", meaning: "the destructor. Runs on every way out of the scope" },
        { token: "no finally", meaning: "C++ does not need one. Destructors already run" },
        { token: "make_unique", meaning: "instead of new. Released automatically" },
      ],
      challenge: {
        prompt:
          "Give File a destructor that closes the handle, so the file is closed however the function is left.",
        starter: `class File {
  FILE* f;
 public:
  File(const char* p) { f = fopen(p, "r"); }
  () { if (f) ; }
};`,
        rules: {
          regex: ["~File\\s*\\(\\s*\\)", "fclose\\s*\\(\\s*f\\s*\\)"],
          hint: "The destructor is ~File() and it should call fclose(f).",
          success:
            "Correct. The `if (f)` matters too: fopen returns null when it fails, and calling fclose on a null handle is undefined behaviour.",
        },
        solution: `class File {
  FILE* f;
 public:
  File(const char* p) { f = fopen(p, "r"); }
  ~File() { if (f) fclose(f); }
};`,
      },

      alt: {
        c: {
          body: [
            "Only if you close it, on every path out — including the one you added last week and forgot about.",
            "C has no destructors, no scope-based cleanup and no garbage collector. Every resource you take, you release, by hand, at exactly the right moment.",
            "The three failure modes are worth naming because every other language on this list exists partly to avoid them.",
            "A LEAK is memory you never freed. The program uses more and more memory and eventually fails. Annoying, and the least dangerous of the three.",
            "A DOUBLE FREE is freeing the same block twice. It corrupts the allocator's own bookkeeping and usually crashes somewhere unrelated.",
            "A USE AFTER FREE is using memory after releasing it. This is the dangerous one: it often appears to work, because the block has not been reused yet, and it is the basis of a large share of real security vulnerabilities.",
            "The standard C discipline for multi-step functions is `goto` to a single cleanup block at the end. It is the one use of goto that everyone agrees on, and it is all over the Linux kernel for exactly this reason.",
            "Tools help more than discipline. Compile with `-fsanitize=address` during development and it catches leaks, double frees and use-after-free at the moment they happen rather than hours later.",
          ],
          predict: {
            ask: "What is the bug in this C function?",
            code: `int work(void) {
  char *a = malloc(100);
  char *b = malloc(100);

  if (something_failed) return -1;

  free(a);
  free(b);
  return 0;
}`,
            choices: [
              { text: "The mallocs are not checked for NULL", why: "That is a second real problem, and it is not what the early return causes." },
              { text: "The early return leaks both blocks", why: "Correct. Returning at that point skips both frees, so 200 bytes are lost on every failure. The usual fix is a single cleanup block at the end, reached with goto." },
              { text: "free is called in the wrong order", why: "The order of independent frees does not matter. The problem is the path that skips them entirely." },
              { text: "b should be freed before a", why: "There is no ordering requirement between two unrelated blocks." },
            ],
            answer: 1,
          },
          example: `/* the standard C discipline: one exit, reached with goto */
int work(void) {
  char *a = NULL, *b = NULL;
  int rc = -1;

  a = malloc(100);
  if (!a) goto out;

  b = malloc(100);
  if (!b) goto out;

  if (something_failed) goto out;

  rc = 0;

out:
  free(a);          /* free(NULL) is safe and does nothing */
  free(b);
  return rc;
}

/* the three failure modes */
/* leak            never freed. Memory grows                   */
/* double free     corrupts the allocator. Crashes elsewhere   */
/* use after free  often "works". The basis of real exploits   */

/* files and locks need the same care */
FILE *f = fopen("data.txt", "r");
if (!f) return -1;
/* ... */
fclose(f);

/* the tool that finds all of it */
/* gcc -fsanitize=address -g prog.c */`,
          notes: [
            { token: "goto out", meaning: "one cleanup block. The agreed-on use of goto in C" },
            { token: "free(NULL)", meaning: "safe, and does nothing. Which is what makes the pattern work" },
            { token: "use after free", meaning: "the dangerous one. It often appears to work" },
            { token: "-fsanitize=address", meaning: "catches all three, at the moment they happen" },
          ],
          prompt:
            "Fix the leak: jump to the cleanup block instead of returning early.",
          starter: `char *a = malloc(100);
if (!a) return -1;

if (something_failed) ;

out:
  free(a);
  return rc;`,
          rules: {
            regex: ["if\\s*\\(\\s*something_failed\\s*\\)\\s*goto\\s+out\\s*;"],
            mustNot: ["if (something_failed) return"],
            hint: "goto out; so the free at the bottom still runs.",
            success:
              "Correct. This is why C code has so many gotos near the end of functions — with no destructors, a single cleanup block is the only way to guarantee every path releases what it took.",
          },
          solution: `char *a = malloc(100);
if (!a) return -1;

if (something_failed) goto out;

out:
  free(a);
  return rc;`,
        },

        python: {
          body: [
            "Yes, if you used `with`. Otherwise probably, eventually, and you should not rely on it.",
            "Python manages memory by REFERENCE COUNTING: every object counts how many names point at it, and when the count reaches zero the object is released immediately.",
            "That immediacy is nicer than it sounds — it means memory is usually freed at the moment the last name goes away, rather than at some unpredictable later point.",
            "It has one gap: two objects referring to each other keep each other's count above zero forever. Python runs a separate CYCLE COLLECTOR for exactly that, which is why it has a garbage collector as well as counting.",
            "For files, sockets and locks, counting is not good enough. You want the file closed at a definite moment, not whenever the last reference happens to go.",
            "That is what `with` is for. `with open(\"data.txt\") as f:` closes the file when the block ends, whether it ended normally, by return, or by an exception. It is Python's version of RAII, made explicit rather than automatic.",
            "Any object can support it by defining `__enter__` and `__exit__`, and `contextlib.contextmanager` turns a generator into one with a decorator — which is the easiest way to write your own.",
            "One thing worth knowing: a garbage collector does not prevent leaks. Anything still REACHABLE is never collected, so a growing cache or a list you forgot to clear leaks exactly as reliably as a missing free in C.",
          ],
          predict: {
            ask: "Which of these definitely closes the file, even if reading raises?",
            code: `# A
f = open("data.txt")
data = f.read()
f.close()

# B
with open("data.txt") as f:
    data = f.read()`,
            choices: [
              { text: "Both — Python closes files automatically", why: "In A, an exception in read skips the close entirely. Reference counting may close it later, and 'later' is not a guarantee you can build on." },
              { text: "Only B", why: "Correct. `with` calls __exit__ however the block is left, including on an exception. In A, a raise in read jumps past f.close() and the file stays open until the object happens to be collected." },
              { text: "Only A, because it is explicit", why: "Being explicit does not help when the line is skipped. B is both explicit and guaranteed." },
              { text: "Neither — you need try/finally", why: "`with` is exactly try/finally with the boilerplate removed. It is the recommended form." },
            ],
            answer: 1,
          },
          example: `# reference counting: released when the last name goes
a = [1, 2, 3]
b = a            # count 2
del a            # count 1
del b            # count 0 — released right here

import sys
print(sys.getrefcount(b))     # one more than you expect: the argument

# cycles need the collector
import gc
gc.collect()

# for resources, use with — Python's RAII
with open("data.txt") as f:
    data = f.read()
# closed here, however the block ended

with open("a") as a, open("b") as b:   # several at once
    pass

# locks too
with lock:
    pass

# write your own
from contextlib import contextmanager

@contextmanager
def timer():
    start = time.time()
    try:
        yield
    finally:
        print(time.time() - start)

with timer():
    do_work()

# a collector does NOT prevent leaks.
# Anything still reachable is never collected
cache = {}
def handle(x): cache[x] = compute(x)     # grows forever`,
          notes: [
            { token: "reference counting", meaning: "released the moment the last name goes" },
            { token: "cycles", meaning: "keep each other alive. The gc module sweeps them" },
            { token: "with", meaning: "closes on every exit. Python's RAII" },
            { token: "reachable means alive", meaning: "a growing cache leaks like a missing free" },
          ],
          prompt:
            "Open the file so it is guaranteed to close, even if reading raises.",
          starter: `open("data.txt") as f:
    data = f.read()`,
          rules: {
            regex: ["with\\s+open\\s*\\(\\s*\"data\\.txt\"\\s*\\)\\s+as\\s+f\\s*:"],
            hint: "with open(\"data.txt\") as f:",
            success:
              "Correct. `with` is exactly try/finally with the boilerplate removed — and it works on anything defining __enter__ and __exit__, not just files.",
          },
          solution: `with open("data.txt") as f:
    data = f.read()`,
        },

        java: {
          body: [
            "Yes, if you used try-with-resources. Otherwise no — and the garbage collector will not help you.",
            "Java's collector handles MEMORY and nothing else. Files, sockets, database connections and locks are not memory, and the collector has no idea they need closing.",
            "How the collector works is worth a sentence: it periodically finds everything still reachable from your running code and releases the rest. You never free anything, and you never know exactly when a collection will happen.",
            "That is the trade. No leaks of the C kind, no use-after-free, and no control over timing. For a server processing requests that is usually the right trade; for a game rendering at 60 frames a second, a collection pause is visible.",
            "`finalize()` was Java's attempt at destructors and it is deprecated. It ran at an unpredictable time, or never. Do not use it.",
            "TRY-WITH-RESOURCES is the answer for everything else: `try (var f = new FileReader(\"data.txt\")) { }` closes f when the block ends, on every path including an exception.",
            "Anything implementing `AutoCloseable` works with it, including classes you write. That interface is one method, and implementing it is how your own type joins in.",
            "And as everywhere: a collector does not prevent leaks. A static map that grows forever, or a listener you registered and never removed, keeps objects reachable — and reachable means never collected.",
          ],
          predict: {
            ask: "Which of these closes the reader if read() throws?",
            code: `// A
FileReader f = new FileReader("data.txt");
f.read();
f.close();

// B
try (FileReader f = new FileReader("data.txt")) {
  f.read();
}`,
            choices: [
              { text: "Both — the collector closes it", why: "The garbage collector manages memory only. It has no idea a file handle needs closing." },
              { text: "Only B", why: "Correct. try-with-resources calls close() however the block is left. In A an exception in read skips the close, and the handle stays open until the process ends." },
              { text: "Only A, because close is explicit", why: "The explicit close is skipped entirely when read throws — that is exactly the case try-with-resources exists for." },
              { text: "Neither — you need finalize()", why: "finalize is deprecated and ran unpredictably or never. try-with-resources is the modern and correct answer." },
            ],
            answer: 1,
          },
          example: `// memory: the collector handles it, on its own schedule
byte[] big = new byte[100_000_000];
big = null;                     // unreachable, and collectible

// everything else: try-with-resources
try (FileReader f = new FileReader("data.txt");
     BufferedReader b = new BufferedReader(f)) {
  b.readLine();
}                               // both closed, in reverse order,
                                // however the block ended

// your own type joins in with one method
class Conn implements AutoCloseable {
  @Override public void close() { /* release it */ }
}
try (Conn c = new Conn()) { }

// finalize() is deprecated. It ran late, or never. Do not use it

// a collector does NOT prevent leaks — reachable means alive
static final Map<String, Data> CACHE = new HashMap<>();
void handle(String k) { CACHE.put(k, load(k)); }   // grows forever

// the common Java leaks
// - a static collection that only grows
// - a listener registered and never removed
// - a ThreadLocal never cleared in a pooled thread`,
          notes: [
            { token: "the collector", meaning: "memory only. Files and locks are your job" },
            { token: "try (var f = ...)", meaning: "closes on every path. Java's RAII" },
            { token: "AutoCloseable", meaning: "one method. How your own type joins in" },
            { token: "finalize()", meaning: "deprecated. Ran late, or never" },
          ],
          prompt:
            "Open the file so it is closed however the block is left.",
          starter: ` (FileReader f = new FileReader("data.txt")) {
  f.read();
}`,
          rules: {
            regex: ["try\\s*\\(\\s*FileReader\\s+f\\s*=\\s*new\\s+FileReader\\s*\\(\\s*\"data\\.txt\"\\s*\\)\\s*\\)"],
            hint: "try (FileReader f = new FileReader(\"data.txt\")) { ... }",
            success:
              "Correct. Several resources can be declared in the same try, separated by semicolons, and they are closed in reverse order — so a wrapper is always closed before the thing it wraps.",
          },
          solution: `try (FileReader f = new FileReader("data.txt")) {
  f.read();
}`,
        },

        javascript: {
          body: [
            "Not automatically. JavaScript collects memory and does nothing else — and it has no `with`, no try-with-resources and no destructors.",
            "Memory is handled by a MARK AND SWEEP collector: it periodically finds everything still reachable from your code and releases the rest. You never free anything and you cannot control when it happens.",
            "For anything that is not memory — a file handle in Node, a database connection, an interval timer, an event listener — you close it yourself, in a `finally` block.",
            "`try { ... } finally { conn.close(); }` runs the close on every path out, including an exception. That is the whole mechanism, written out each time.",
            "The most common JavaScript leak has nothing to do with memory management and everything to do with reachability. An event listener holds a reference to its handler, which holds a reference to everything the closure captured — and if you never remove the listener, none of it can ever be collected.",
            "`setInterval` is the same story: the callback is held alive until you call `clearInterval`, however long the page lives.",
            "`WeakMap`, `WeakSet` and `WeakRef` hold references that do NOT keep their target alive, which is the tool for a cache keyed by objects.",
            "`FinalizationRegistry` exists to run a callback after something is collected, and the specification explicitly says you should not rely on it running at all. Treat it as a debugging aid.",
          ],
          predict: {
            ask: "Why does this leak, and what fixes it?",
            code: `function attach(el) {
  const bigData = new Array(1e6);
  el.addEventListener("click", () => {
    console.log(bigData.length);
  });
}`,
            choices: [
              { text: "It does not leak — the array is local", why: "The arrow function captures bigData, and the listener holds that function alive for as long as the element is listening." },
              { text: "The listener keeps the closure alive, and the closure holds bigData", why: "Correct. As long as the listener is attached, the handler is reachable — and it captured bigData, so the million-element array can never be collected. Call removeEventListener, or use an AbortSignal." },
              { text: "new Array(1e6) allocates too much", why: "The size is not the bug; the same pattern leaks whatever the closure captured. The problem is that nothing ever releases it." },
              { text: "Arrow functions always leak", why: "Arrow functions are fine. Any function captured by a listener that is never removed has the same effect." },
            ],
            answer: 1,
          },
          example: `// memory: mark and sweep. You cannot free, only stop referring
let big = new Array(1e7);
big = null;                     // now unreachable

// everything else: finally, written out each time
const conn = await pool.connect();
try {
  await conn.query("...");
} finally {
  conn.release();               // runs on every path
}

// the common leaks — all about reachability
el.addEventListener("click", handler);
el.removeEventListener("click", handler);     // or it lives forever

const id = setInterval(tick, 1000);
clearInterval(id);                            // or tick lives forever

// AbortSignal cleans up several at once
const ac = new AbortController();
el.addEventListener("click", h, { signal: ac.signal });
ac.abort();                                   // removes it

// hold WITHOUT keeping alive
const cache = new WeakMap();
cache.set(obj, "data");         // vanishes when obj does

const ref = new WeakRef(obj);
ref.deref();                    // the object, or undefined

// FinalizationRegistry exists and is explicitly not guaranteed.
// Use it for debugging, never for cleanup that must happen`,
          notes: [
            { token: "mark and sweep", meaning: "reachable survives. You never free" },
            { token: "finally", meaning: "the only cleanup mechanism. Write it out each time" },
            { token: "listeners and intervals", meaning: "the two most common leaks. Remove them" },
            { token: "WeakMap / WeakRef", meaning: "hold something without keeping it alive" },
          ],
          prompt:
            "Release the connection however the block is left.",
          starter: `const conn = await pool.connect();
try {
  await conn.query("...");
}  {
  conn.release();
}`,
          rules: {
            regex: ["\\}\\s*finally\\s*\\{[^}]*conn\\.release\\s*\\(\\s*\\)"],
            hint: "finally { conn.release(); } — catch would only run on an error.",
            success:
              "Correct. finally runs on every path — a normal end, a return from inside the try, or a thrown error — which is exactly the guarantee `with` and try-with-resources give in the other languages.",
          },
          solution: `const conn = await pool.connect();
try {
  await conn.query("...");
} finally {
  conn.release();
}`,
        },

        rust: {
          body: [
            "Yes, automatically, on every path out — and unlike C++ the compiler also guarantees you cannot use the file afterwards.",
            "The mechanism is OWNERSHIP. Every value has exactly one owner. When the owner goes out of scope, `drop` runs and the value is released. That is it — no collector, no manual free, no pauses.",
            "This is the same idea as C++'s RAII, with one addition that changes everything: the BORROW CHECKER. The compiler tracks how long every reference lives and refuses to compile a program where a reference could outlive what it points at.",
            "So the three C failure modes are not merely discouraged; they are impossible in safe Rust. You cannot leak through a forgotten free, you cannot double free, and you cannot use after free.",
            "The cost is paid entirely at compile time. There is no run-time bookkeeping at all — a Rust program's memory behaviour is the same as an equivalent C program's, with the mistakes ruled out.",
            "You can write your own cleanup by implementing `Drop`, and it runs at the same guaranteed points. `drop(x)` releases something early when you want the timing to be explicit.",
            "Two honest caveats. Leaking is technically still possible — two `Rc`s referring to each other never reach zero — and Rust considers that safe rather than undefined, because a leak cannot corrupt anything. And `unsafe` blocks let you opt out of the checking, which is how the standard library implements things the checker cannot verify.",
          ],
          predict: {
            ask: "When does the file close in this Rust code?",
            code: `fn read() -> std::io::Result<String> {
    let mut f = File::open("data.txt")?;
    let mut s = String::new();
    f.read_to_string(&mut s)?;
    Ok(s)
}`,
            choices: [
              { text: "Never — nothing calls close", why: "There is no close to call. The file is closed by its Drop implementation when f goes out of scope." },
              { text: "When f goes out of scope, including on the early return from ?", why: "Correct. File implements Drop, so leaving the function for any reason — success, or an early return from the ? operator — closes it. There is no close method to forget." },
              { text: "At the next garbage collection", why: "Rust has no garbage collector. Cleanup happens at a known point in the code, decided at compile time." },
              { text: "Only if the function returns Ok", why: "Drop runs on every exit path, which is exactly why the ? operator is safe to scatter through a function." },
            ],
            answer: 1,
          },
          example: `fn read() -> std::io::Result<String> {
    let mut f = File::open("data.txt")?;   // ? may return early
    let mut s = String::new();
    f.read_to_string(&mut s)?;
    Ok(s)
}                              // f is dropped here, on EVERY path

// the same for locks, connections, anything
{
    let guard = mutex.lock().unwrap();
}                              // unlocked here

// write your own cleanup
struct Conn;
impl Drop for Conn {
    fn drop(&mut self) {
        println!("released");
    }
}

{
    let c = Conn;
}                              // prints "released"

// release early, explicitly
let c = Conn;
drop(c);                       // right here
// c is unusable afterwards — the compiler knows

// what the borrow checker rules OUT
// leak from a forgotten free   impossible
// double free                  impossible
// use after free               impossible
// data race                    impossible

// the honest caveats
// - Rc cycles can still leak. Safe, just wasteful. Use Weak
// - unsafe blocks opt out of the checking, deliberately`,
          notes: [
            { token: "ownership", meaning: "one owner. Leaving scope releases the value" },
            { token: "the borrow checker", meaning: "the addition C++ lacks. Rules out dangling references" },
            { token: "impl Drop", meaning: "your own cleanup, at guaranteed points" },
            { token: "cost", meaning: "compile time only. No run-time bookkeeping at all" },
          ],
          prompt:
            "Give Conn a Drop implementation so it prints \"released\" when it goes out of scope.",
          starter: `struct Conn;

impl  for Conn {
    fn (&mut self) {
        println!("released");
    }
}`,
          rules: {
            regex: ["impl\\s+Drop\\s+for\\s+Conn", "fn\\s+drop\\s*\\(\\s*&mut\\s+self\\s*\\)"],
            hint: "impl Drop for Conn, and the method is fn drop(&mut self).",
            success:
              "Correct. Note you can never call c.drop() yourself — that would allow a double free, so the compiler forbids it. Use drop(c) instead, which takes ownership and releases it.",
          },
          solution: `struct Conn;

impl Drop for Conn {
    fn drop(&mut self) {
        println!("released");
    }
}`,
        },
      },
    },
  ],
};
