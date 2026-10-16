import type { TopicLesson } from "@/lib/dsa/lessons/types";
import { traceBounds, traceErasure, traceMonomorphise } from "@/lib/dsa/viz/traceLang";

// Language track, topic 11 — the first of the advanced band.
//
// Four genuinely different answers to one problem, and C is the fifth by
// having no answer at all. The `runtime` section is the one that explains most
// of the errors people actually hit.

export const LANG_GENERICS: TopicLesson = {
  id: "lang-generics",
  title: "Generics & Type Systems",
  tagline: "Writing code once that works for many types.",
  why:
    "You write a function that finds the largest of two numbers. Then you need it for strings. Then for dates. Copying it three times means three places to fix a bug. Generics are how a language lets you write it once — and the six here answer that in four genuinely different ways.",
  plain: [
    "A generic is code with a hole in it where a type will go.",
    "The compiler, or nobody, fills that hole in when the code is used.",
    "You usually have to say what the type must be ABLE to do, not just that it exists.",
    "What is left of the type once the program is running differs completely between these languages.",
  ],
  needs: ["Functions and objects.", "Interfaces or traits from Objects & Types."],
  traps: [
    "An unconstrained placeholder pushes the error inside the generic, where it names a line you did not write.",
    "In Java the type is erased, so `new T[]` and `instanceof List<String>` do not work at all.",
    "In C++ and Rust every distinct type produces its own compiled copy, so heavy generic code compiles slowly.",
    "A Python type hint is never checked at run time. It is documentation until you run a type checker.",
    "Reaching for generics too early. Two concrete versions is often clearer than one abstract one.",
  ],
  sections: [
    /* ----------------------------------------------------------- once -- */
    {
      id: "once",
      kicker: "01",
      title: "Writing it once for many types",
      hook:
        "You have a function returning the larger of two ints. Now you need it for doubles, and for strings. Do you write it three times?",
      body: [
        "No. You write it once with a HOLE where the type goes, and let the compiler fill the hole in.",
        "`template<typename T>` opens the hole. Inside, T behaves like a type you have not named yet — and at each call site the compiler works out what it should be from the arguments.",
        "What happens next is the thing to understand. C++ does not produce one clever function that handles everything. It generates a SEPARATE real function for every distinct type you use.",
        "That is monomorphisation, and it is why C++ templates cost nothing at run time: `largest<int>` is exactly the machine code you would have written by hand, and the comparison can be inlined.",
        "The price is paid at compile time. Three types means three copies in the binary, and heavy template code is a large part of why C++ builds are slow.",
        "Templates are not limited to types. `template<int N>` takes a VALUE, so an array size can be part of the type — which is how `std::array<int, 5>` knows its own length with zero run-time cost.",
        "One warning worth having early: templates live in headers. The compiler needs the whole body to generate a copy, so a template defined in a .cpp file cannot be used from anywhere else.",
      ],
      predict: {
        ask: "How many largest functions end up in the compiled binary?",
        code: `template<typename T>
T largest(T a, T b) { return a > b ? a : b; }

largest(3, 7);
largest(1.5, 2.5);
largest(4, 9);`,
        choices: [
          { text: "One — the template is the function", why: "A template is not a function. It is a recipe the compiler uses to write functions." },
          { text: "Two — one for int, one for double", why: "Correct. Two DISTINCT types are used, so two copies are generated. The third call is int again and reuses the copy already made." },
          { text: "Three — one per call", why: "Copies are made per distinct TYPE, not per call. The two int calls share one generated function." },
          { text: "None — it is resolved at run time", why: "That is Java's model. C++ decides everything at compile time and generates real machine code for each type." },
        ],
        answer: 1,
      },
      viz: traceMonomorphise(),
      example: `template<typename T>
T largest(T a, T b) {
  return a > b ? a : b;
}

largest(3, 7);            // generates largest<int>
largest(1.5, 2.5);        // generates largest<double>
largest<double>(3, 2.5);  // or say which explicitly

// a whole class can be generic
template<typename T>
class Box {
  T value;
 public:
  Box(T v) : value(v) {}
  T get() const { return value; }
};

Box<string> b("hi");
Box b2(5);                // C++17 works the type out for you

// a VALUE parameter, not just a type
template<typename T, int N>
struct Array { T data[N]; };
Array<int, 5> a;          // the size is part of the type

// templates live in HEADERS — the compiler needs the whole body`,
      notes: [
        { token: "template<typename T>", meaning: "opens a hole where a type will go" },
        { token: "monomorphisation", meaning: "a separate real copy per distinct type" },
        { token: "template<int N>", meaning: "a value parameter. The size becomes part of the type" },
        { token: "in headers", meaning: "the body must be visible wherever it is used" },
      ],
      challenge: {
        prompt:
          "Write a generic swap that exchanges two values of any type, taking them by reference so the caller's variables really change.",
        starter: `template<typename >
void swapTwo( a,  b) {
  T tmp = a;
  a = b;
  b = tmp;
}`,
        rules: {
          regex: ["template\\s*<\\s*typename\\s+T\\s*>", "void\\s+swapTwo\\s*\\(\\s*T\\s*&\\s*a\\s*,\\s*T\\s*&\\s*b\\s*\\)"],
          hint: "template<typename T> and then void swapTwo(T& a, T& b) — the & is what lets it modify the caller's variables.",
          success:
            "Correct. Without the ampersands it would swap two copies and the caller would see nothing — the generic part and the reference part are independent, and you need both.",
        },
        solution: `template<typename T>
void swapTwo(T& a, T& b) {
  T tmp = a;
  a = b;
  b = tmp;
}`,
      },

      alt: {
        c: {
          hook:
            "You have a function returning the larger of two ints. Now you need it for doubles. C has no generics. What do you actually do?",
          body: [
            "One of three things, and none of them is pleasant.",
            "The first is to write it twice with different names: `max_int` and `max_double`. Honest, obvious, and it does not scale past a few types.",
            "The second is MACROS. `#define MAX(a, b) ((a) > (b) ? (a) : (b))` works on anything with a >, because the preprocessor pastes the text in before the compiler sees types at all.",
            "Macros come with real hazards. Every parameter must be wrapped in brackets, or `MAX(a, b) * 2` expands wrongly. And an argument is evaluated TWICE, so `MAX(i++, j)` increments i either once or twice depending on which is bigger.",
            "The third is `void *` plus a size, which is how `qsort` works: pass the item size and a comparison function, and the routine moves bytes without knowing what they mean.",
            "That gives you real generic containers, at the cost of all type safety — the compiler cannot check that your comparison function matches the array you passed it.",
            "C11 added `_Generic`, which picks an expression based on the type of its argument. It is the closest C comes to overloading, and it is rarely seen outside standard-library headers like `<tgmath.h>`.",
          ],
          predict: {
            ask: "What is wrong with this macro?",
            code: `#define MAX(a, b) a > b ? a : b

int x = MAX(1, 2) * 3;`,
            choices: [
              { text: "Nothing — it gives 6", why: "It expands to `1 > 2 ? 1 : 2 * 3`, and the missing brackets change what the ternary covers." },
              { text: "No brackets, so it expands to 1 > 2 ? 1 : 2 * 3 — which is 6 by luck, and wrong in general", why: "Correct. The preprocessor pastes text, so precedence is not preserved. Every parameter and the whole body need wrapping: #define MAX(a, b) ((a) > (b) ? (a) : (b))" },
              { text: "MAX cannot take integer literals", why: "A macro takes anything at all — that is the point. The problem is the missing brackets." },
              { text: "It needs a semicolon at the end", why: "A macro ending in a semicolon is worse, not better — it breaks when used inside an if without braces." },
            ],
            answer: 1,
          },
          example: `/* option 1 — write it twice. Honest, and does not scale */
int    max_int(int a, int b)       { return a > b ? a : b; }
double max_double(double a, double b) { return a > b ? a : b; }

/* option 2 — a macro. Wrap EVERYTHING in brackets */
#define MAX(a, b) ((a) > (b) ? (a) : (b))

/* and beware: arguments are evaluated more than once */
/* MAX(i++, j)  increments i once or twice, depending */

/* option 3 — void* and a size. How qsort does it */
void swap_bytes(void *a, void *b, size_t size) {
  unsigned char tmp[64];
  memcpy(tmp, a, size);
  memcpy(a, b, size);
  memcpy(b, tmp, size);
}

qsort(arr, n, sizeof(int), cmp_int);   /* generic, and unchecked */

/* C11: _Generic picks by type. Rare outside <tgmath.h> */
#define abs_any(x) _Generic((x), \\
  int: abs, double: fabs, float: fabsf)(x)`,
          notes: [
            { token: "no generics", meaning: "write it twice, use a macro, or use void*" },
            { token: "((a) > (b) ? ...)", meaning: "wrap every parameter AND the body" },
            { token: "evaluated twice", meaning: "MAX(i++, j) is a real bug. Macros are not functions" },
            { token: "void* + size", meaning: "generic containers, with no type checking at all" },
          ],
          prompt:
            "Write the MAX macro safely — every parameter and the whole body wrapped in brackets.",
          starter: `#define MAX(a, b) a > b ? a : b`,
          rules: {
            regex: ["#define\\s+MAX\\s*\\(\\s*a\\s*,\\s*b\\s*\\)\\s*\\(\\s*\\(\\s*a\\s*\\)\\s*>\\s*\\(\\s*b\\s*\\)\\s*\\?\\s*\\(\\s*a\\s*\\)\\s*:\\s*\\(\\s*b\\s*\\)\\s*\\)"],
            hint: "#define MAX(a, b) ((a) > (b) ? (a) : (b)) — brackets round each parameter and round the whole thing.",
            success:
              "Correct. The outer brackets stop surrounding operators from binding wrongly, and the inner ones stop a compound argument like `x + 1` from being split apart.",
          },
          solution: `#define MAX(a, b) ((a) > (b) ? (a) : (b))`,
        },

        python: {
          hook:
            "You have a function returning the larger of two ints. Now you need it for strings. How much do you have to change?",
          body: [
            "Nothing. It already works — and that is both the appeal of Python and the thing to be careful about.",
            "Python never checks types at run time, so a function using `>` works on anything that supports `>`. There is no generic to declare because there was never a type to fix.",
            "That is DUCK TYPING, and it means the same function handles ints, strings, dates and your own classes without you writing a word about it.",
            "The cost is that nothing tells you when it will NOT work. Pass two objects with no ordering and you get a TypeError at run time, possibly in production, possibly in a rarely-taken branch.",
            "So Python added TYPE HINTS, and they are worth using. `def largest(a: int, b: int) -> int:` documents the intent, and a checker like mypy or pyright verifies it before the code runs.",
            "For genuinely generic code, `TypeVar` gives you the placeholder: `T = TypeVar(\"T\")` and then `def largest(a: T, b: T) -> T:` says both arguments and the result are the SAME type — which is more than duck typing tells you.",
            "Since Python 3.12 there is shorter syntax: `def largest[T](a: T, b: T) -> T:`. And whichever you use, nothing is checked at run time. The hint is for the tool and the reader.",
          ],
          predict: {
            ask: "What does this Python code do?",
            code: `def largest(a: int, b: int) -> int:
    return a if a > b else b

print(largest("ada", "bob"))`,
            choices: [
              { text: "TypeError — the hints say int", why: "Type hints are never enforced at run time. Python does not look at them when calling the function." },
              { text: "It prints \"bob\"", why: "Correct. The hints are documentation; nothing checks them while the program runs. Strings support >, so the function works — and mypy would have flagged the call before it ran." },
              { text: "It prints 0", why: "The comparison works normally on strings, so the larger string is returned." },
              { text: "It refuses to start", why: "Python has no compile step that validates annotations. The file loads and runs regardless." },
            ],
            answer: 1,
          },
          example: `# it already works on anything with > — no generics needed
def largest(a, b):
    return a if a > b else b

largest(3, 7)
largest("ada", "bob")

# hints document it, and a checker verifies it before it runs
def largest_int(a: int, b: int) -> int:
    return a if a > b else b

# TypeVar says "the same type in both places"
from typing import TypeVar
T = TypeVar("T")

def first(items: list[T]) -> T:
    return items[0]

# Python 3.12 and later, the shorter form
def first_new[T](items: list[T]) -> T:
    return items[0]

# constrain it — only these types
Number = TypeVar("Number", int, float)

# or require a capability, without inheritance
from typing import Protocol

class Comparable(Protocol):
    def __lt__(self, other) -> bool: ...

# NONE of this is checked at run time. Run mypy or pyright`,
          notes: [
            { token: "duck typing", meaning: "no declaration. Works on anything with the right methods" },
            { token: "TypeVar(\"T\")", meaning: "the same type in every place it appears" },
            { token: "def f[T](...)", meaning: "Python 3.12's shorter syntax for the same thing" },
            { token: "never checked at run time", meaning: "hints are for mypy and for the reader" },
          ],
          prompt:
            "Write first with a TypeVar, so a checker knows the returned item has the same type as the list's items.",
          starter: `from typing import TypeVar
T = ("T")

def first(items: list[]) -> :
    return items[0]`,
          rules: {
            regex: ["T\\s*=\\s*TypeVar\\s*\\(\\s*\"T\"\\s*\\)", "items\\s*:\\s*list\\s*\\[\\s*T\\s*\\]\\s*\\)\\s*->\\s*T"],
            hint: "T = TypeVar(\"T\") and then def first(items: list[T]) -> T:",
            success:
              "Correct, and the value is in the LINK: `-> T` tells the checker that first(names) gives a str and first(ages) gives an int. Writing `-> Any` would have compiled too and told the reader nothing.",
          },
          solution: `from typing import TypeVar
T = TypeVar("T")

def first(items: list[T]) -> T:
    return items[0]`,
        },

        java: {
          body: [
            "No. You write it once with a HOLE where the type goes, and the compiler checks every use of it.",
            "`static <T> T largest(T a, T b)` declares the placeholder before the return type. That leading `<T>` is the part people forget, and without it the compiler thinks T is a class you never defined.",
            "Java's model differs from C++'s in a way that matters. There is only ever ONE compiled copy — the compiler checks your types, then ERASES them, and at run time the method works on Objects.",
            "That is why generics in Java cost nothing extra in code size and cannot be used with primitives. `List<int>` does not compile; it has to be `List<Integer>`, and every number gets boxed into an object.",
            "The diamond `<>` lets you leave the type off the right-hand side: `Map<String, List<Integer>> m = new HashMap<>();`. The compiler works it out from the left.",
            "For a generic class, the placeholder goes after the class name: `class Box<T>`. For a generic method it goes before the return type. Both are common and the placement catches everyone once.",
            "The convention for names is single capital letters: T for type, E for element, K and V for key and value, R for result. Following it makes generic signatures much easier to skim.",
          ],
          predict: {
            ask: "Why does this not compile?",
            code: `static T largest(T a, T b) {
  return a.compareTo(b) > 0 ? a : b;
}`,
            choices: [
              { text: "compareTo does not exist", why: "compareTo exists on Comparable — and that is a second problem here, not the one stopping compilation." },
              { text: "The <T> declaration is missing before the return type", why: "Correct. A generic method must declare its placeholder: static <T> T largest(...). Without it the compiler looks for a class called T and does not find one." },
              { text: "Generic methods cannot be static", why: "Static generic methods are completely normal — Collections is full of them." },
              { text: "T must be called E", why: "The names are a convention, not a rule. Any identifier works." },
            ],
            answer: 1,
          },
          example: `// a generic METHOD — <T> comes before the return type
static <T extends Comparable<T>> T largest(T a, T b) {
  return a.compareTo(b) > 0 ? a : b;
}

largest(3, 7);
largest("ada", "bob");

// a generic CLASS — <T> comes after the class name
class Box<T> {
  private final T value;
  Box(T value) { this.value = value; }
  T get() { return value; }
}

Box<String> b = new Box<>("hi");        // <> works the type out

// no primitives — generics hold objects
// List<int> list;                      // does not compile
List<Integer> list = new ArrayList<>(); // boxed

// several parameters, and the naming convention
// T type   E element   K key   V value   R result
static <K, V> Map<V, K> invert(Map<K, V> in) { ... }

// wildcards: ? means "some type I do not need to name"
void printAll(List<?> items) { }
void addNums(List<? super Integer> out) { }
double sum(List<? extends Number> in) { }`,
          notes: [
            { token: "static <T> T f(...)", meaning: "the placeholder is declared before the return type" },
            { token: "class Box<T>", meaning: "for a class it goes after the name" },
            { token: "the diamond <>", meaning: "the compiler works the type out from the left" },
            { token: "no primitives", meaning: "List<int> does not compile. Everything is boxed" },
          ],
          prompt:
            "Write a generic method first that returns the first item of a list, declaring the placeholder correctly.",
          starter: `static  first(List<> items) {
  return items.get(0);
}`,
          rules: {
            regex: ["static\\s*<\\s*T\\s*>\\s*T\\s+first\\s*\\(\\s*List\\s*<\\s*T\\s*>\\s+items\\s*\\)"],
            hint: "static <T> T first(List<T> items) — the <T> before the return type is what declares it.",
            success:
              "Correct. Read it left to right: static, then 'I am introducing a type called T', then 'I return a T', then 'I take a List of T'. The repetition is what links the argument to the result.",
          },
          solution: `static <T> T first(List<T> items) {
  return items.get(0);
}`,
        },

        javascript: {
          hook:
            "You have a function returning the larger of two numbers. Now you need it for strings. How much do you have to change?",
          body: [
            "Nothing. It already works, because JavaScript never checks types at all.",
            "That is the whole story for plain JavaScript: there are no generics, because there is nothing to be generic over. A function using `>` works on anything `>` accepts.",
            "It also works on things it should not. `largest(\"5\", 3)` compares a string with a number, JavaScript converts one of them, and you get an answer that is often not the one you wanted.",
            "So this section is really about TypeScript, which is where generics live in this ecosystem — and they are among the best-designed of the six.",
            "`function first<T>(items: T[]): T` says the returned item has the same type as the array's items. The compiler INFERS T at each call, so you almost never write it out.",
            "TypeScript's types are erased entirely: the compiler checks them and emits plain JavaScript with every annotation stripped. At run time there is no trace, which is exactly Java's model taken further.",
            "The practical consequence: you cannot test a generic type at run time. `if (x instanceof Array<string>)` is not a thing, and validating data arriving from a network needs a real run-time check — which is what libraries like Zod exist for.",
          ],
          predict: {
            ask: "What does the compiled JavaScript look like?",
            code: `function first<T>(items: T[]): T {
  return items[0];
}`,
            choices: [
              { text: "It keeps T so the type can be checked at run time", why: "TypeScript emits plain JavaScript with every type annotation removed. Nothing about T survives." },
              { text: "function first(items) { return items[0]; }", why: "Correct. Types are checked at compile time and then erased completely — the output is ordinary JavaScript with no trace of T, which is why run-time type checks need a separate library." },
              { text: "It adds a run-time check that items is an array", why: "TypeScript never inserts checks. It only removes annotations." },
              { text: "It does not compile without a constraint", why: "An unconstrained T is fine here — indexing an array needs no capability from the element type." },
            ],
            answer: 1,
          },
          example: `// plain JavaScript: no generics, because no types
function largest(a, b) {
  return a > b ? a : b;
}
largest(3, 7);
largest("ada", "bob");
largest("5", 3);          // works, and probably not as you meant

// TypeScript is where generics live in this ecosystem
function first<T>(items: T[]): T {
  return items[0];
}
first([1, 2, 3]);         // T inferred as number
first(["a", "b"]);        // T inferred as string

// a generic class or interface
interface Box<T> { value: T; }
class Store<T> {
  private items: T[] = [];
  add(item: T) { this.items.push(item); }
}

// constrain it
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

// several parameters, and defaults
function pair<A, B = A>(a: A, b: B): [A, B] { return [a, b]; }

// all of it is ERASED. The emitted JavaScript has no types.
// For data arriving from a network, you need a real run-time
// check — which is what Zod and friends are for`,
          notes: [
            { token: "no generics in plain JS", meaning: "nothing is typed, so nothing to be generic over" },
            { token: "function f<T>(...)", meaning: "TypeScript. T is usually inferred at the call" },
            { token: "T extends { length: number }", meaning: "constrain it to things with a length" },
            { token: "erased completely", meaning: "the emitted JavaScript has no trace of a type" },
          ],
          prompt:
            "Write first in TypeScript so the returned item has the same type as the array's items.",
          starter: `function first(items: []): {
  return items[0];
}`,
          rules: {
            regex: ["function\\s+first\\s*<\\s*T\\s*>\\s*\\(\\s*items\\s*:\\s*T\\s*\\[\\s*\\]\\s*\\)\\s*:\\s*T"],
            hint: "function first<T>(items: T[]): T — the <T> after the name introduces it.",
            success:
              "Correct, and you will rarely write the T at the call site: TypeScript infers it from the argument, so first([1, 2]) already knows it returns a number.",
          },
          solution: `function first<T>(items: T[]): T {
  return items[0];
}`,
        },

        rust: {
          body: [
            "No. You write it once with a HOLE where the type goes, and the compiler generates the copies.",
            "`fn largest<T>(a: T, b: T) -> T` opens the hole. The `<T>` after the name introduces it, and every T in the signature is the same type.",
            "Rust monomorphises exactly as C++ does: each distinct type you use produces its own compiled copy, so a generic function is as fast as a hand-written one. There is no run-time cost.",
            "But there is one large difference from C++, and it is the best thing about Rust's generics. The compiler checks the generic body ONCE, against what you declared, rather than checking each generated copy.",
            "So an unbounded T that uses `>` does not compile at all — not when you call it with a Dog, but immediately, when you write it. The error names your line and says exactly which capability is missing.",
            "That is why Rust's generic errors are readable and C++'s template errors are famous. The requirement has to be written down, so the compiler can blame the right place.",
            "Generic types work the same way: `struct Box<T> { value: T }`, and `impl<T> Box<T>` to give it methods. The `impl<T>` repetition looks odd once and then stops being noticeable.",
          ],
          predict: {
            ask: "Why does this fail to compile in Rust?",
            code: `fn largest<T>(a: T, b: T) -> T {
    if a > b { a } else { b }
}`,
            choices: [
              { text: "Because it is never called", why: "Rust checks a generic body when it is written, not only when it is used — that is the whole point of the design." },
              { text: "T is not declared to support >, and Rust checks the body immediately", why: "Correct. The error appears on this function, not at some later call site: 'binary operation > cannot be applied to type T'. Adding <T: PartialOrd> fixes it." },
              { text: "The if needs a semicolon", why: "An if expression producing a value is idiomatic Rust and needs no semicolon." },
              { text: "Generic functions cannot return T", why: "Returning T is completely normal. The missing bound is the problem." },
            ],
            answer: 1,
          },
          example: `// the bound is required — Rust checks the body when you write it
fn largest<T: PartialOrd>(a: T, b: T) -> T {
    if a > b { a } else { b }
}

largest(3, 7);
largest("ada", "bob");

// a where clause, when there are several bounds
fn show<T>(item: T)
where
    T: std::fmt::Debug + Clone,
{
    println!("{:?}", item.clone());
}

// a generic struct, and methods for it
struct Box<T> {
    value: T,
}

impl<T> Box<T> {
    fn new(value: T) -> Self { Box { value } }
    fn get(&self) -> &T { &self.value }
}

// methods only for SOME T — this is genuinely useful
impl<T: std::fmt::Display> Box<T> {
    fn show(&self) { println!("{}", self.value); }
}

// const generics: a value, not a type
struct Grid<const N: usize> { cells: [u8; N] }

// monomorphised, like C++. A copy per type, no run-time cost`,
          notes: [
            { token: "<T: PartialOrd>", meaning: "the bound. Required, and checked immediately" },
            { token: "where T: A + B", meaning: "the readable form when there are several bounds" },
            { token: "impl<T: Display> Box<T>", meaning: "methods that exist only for some T" },
            { token: "monomorphised", meaning: "a copy per type. Fast, and a bigger binary" },
          ],
          prompt:
            "Write largest so it compiles — declare the placeholder and say what T must support.",
          starter: `fn largest(a: T, b: T) -> T {
    if a > b { a } else { b }
}`,
          rules: {
            regex: ["fn\\s+largest\\s*<\\s*T\\s*:\\s*PartialOrd\\s*>\\s*\\(\\s*a\\s*:\\s*T\\s*,\\s*b\\s*:\\s*T\\s*\\)\\s*->\\s*T"],
            hint: "fn largest<T: PartialOrd>(a: T, b: T) -> T — PartialOrd is the trait that provides >.",
            success:
              "Correct. PartialOrd rather than Ord is the right choice here: Ord promises a total order, and floats cannot keep that promise because of NaN.",
          },
          solution: `fn largest<T: PartialOrd>(a: T, b: T) -> T {
    if a > b { a } else { b }
}`,
        },
      },
    },

    /* --------------------------------------------------------- bounds -- */
    {
      id: "bounds",
      kicker: "02",
      title: "Saying what the type must do",
      hook:
        "Your generic largest works on ints and strings. Someone calls it with two Dogs, which cannot be compared. Where does the error appear?",
      body: [
        "In old C++, inside your template — on a line the caller never wrote, in a message that can run to hundreds of lines through nested templates.",
        "The cause is that `typename T` promises far too much. It says 'any type at all', while the body quietly requires 'any type with a >'. Nothing writes that requirement down, so nothing can check it at the call.",
        "C++20 CONCEPTS fix this. A concept states the requirement, and the compiler checks it where the call is made — so the error points at the caller's line and says which requirement failed.",
        "`template<typename T> requires std::totally_ordered<T>` is the long form. `template<std::totally_ordered T>` is the short one, and there is a shorter still: `auto largest(std::totally_ordered auto a, ...)`.",
        "The standard library ships the ones you need most: `std::integral`, `std::floating_point`, `std::equality_comparable`, `std::totally_ordered`, `std::copyable`, `std::invocable`.",
        "You can write your own, and it reads as a list of expressions that must be valid: `requires(T a) { a.size(); a.begin(); }` means 'anything with a size and a begin'.",
        "Before C++20 the same job was done with SFINAE and `enable_if`, which worked and was close to unreadable. If you meet it in older code, it is this idea written the hard way.",
      ],
      predict: {
        ask: "With this concept, where does the compiler report the error for largest(rex, fido)?",
        code: `template<std::totally_ordered T>
T largest(T a, T b) { return a > b ? a : b; }

struct Dog { string name; };
largest(rex, fido);`,
        choices: [
          { text: "Inside largest, on the comparison", why: "That is exactly what concepts were introduced to stop. The constraint is checked before the body is ever instantiated." },
          { text: "At the call, saying Dog does not satisfy totally_ordered", why: "Correct. The constraint is checked at the call site, so the error names the caller's line and the requirement that failed — instead of a line inside the template." },
          { text: "It does not error — the concept is only documentation", why: "A concept is enforced by the compiler, unlike a Python type hint. The call is rejected." },
          { text: "At run time", why: "C++ resolves all of this at compile time. Nothing about the constraint survives into the running program." },
        ],
        answer: 1,
      },
      viz: traceBounds(),
      example: `#include <concepts>

// the long form
template<typename T>
requires std::totally_ordered<T>
T largest(T a, T b) { return a > b ? a : b; }

// the short form — the same thing
template<std::totally_ordered T>
T largest2(T a, T b) { return a > b ? a : b; }

// shorter still, for simple cases
auto largest3(std::totally_ordered auto a, decltype(a) b) {
  return a > b ? a : b;
}

// the ones from the standard library you will use most
// std::integral            std::floating_point
// std::equality_comparable std::totally_ordered
// std::copyable            std::invocable

// your own — a list of expressions that must be valid
template<typename T>
concept Sized = requires(T t) {
  t.size();
  t.begin();
};

template<Sized T>
void report(const T& c) { cout << c.size(); }

// before C++20 this was SFINAE and enable_if.
// Same idea, written the hard way`,
      notes: [
        { token: "requires std::totally_ordered<T>", meaning: "states the requirement so the call can be checked" },
        { token: "template<Concept T>", meaning: "the short form of the same constraint" },
        { token: "concept X = requires(T t) { ... }", meaning: "your own — expressions that must be valid" },
        { token: "enable_if", meaning: "the pre-C++20 way. The same idea, unreadable" },
      ],
      challenge: {
        prompt:
          "Constrain largest so the error appears at the call site rather than inside the template.",
        starter: `template<typename T>

T largest(T a, T b) { return a > b ? a : b; }`,
        rules: {
          regex: ["requires\\s+std::totally_ordered\\s*<\\s*T\\s*>"],
          hint: "Add `requires std::totally_ordered<T>` between the template line and the function.",
          success:
            "Correct. totally_ordered rather than equality_comparable is the right pick: the body uses >, and equality_comparable would only promise == and !=.",
        },
        solution: `template<typename T>
requires std::totally_ordered<T>
T largest(T a, T b) { return a > b ? a : b; }`,
      },

      alt: {
        c: {
          hook:
            "Your MAX macro works on ints and doubles. Someone uses it on two structs. What does the compiler say?",
          body: [
            "Something about `>` not being defined for that struct, on the line where the macro was USED — because the preprocessor pasted the text there before the compiler saw anything.",
            "That is actually better than old C++ templates managed, and it is luck rather than design. There is no constraint mechanism in C at all.",
            "So the requirement lives in a comment and in the function's name, and nothing enforces it. `qsort` documents that your comparison function must return negative, zero or positive — and passing one that does not compiles cleanly and produces a wrong sort.",
            "The `void *` approach loses the type entirely. A comparison function written for ints, handed an array of doubles, will compile, run, and read the bytes as if they were ints.",
            "That is the real cost of generic code in C: the compiler cannot help. The discipline has to come from naming, from documentation, and from tests.",
            "There is one small tool. C11's `static_assert` checks a compile-time condition, so `static_assert(sizeof(T) == 4, \"expected a 4-byte type\")` can catch some mismatches at build time.",
            "And `_Generic` can dispatch on type, which lets a macro pick a different implementation per type rather than pasting one body everywhere. It is verbose, and it is the closest C has to a constraint.",
          ],
          predict: {
            ask: "What happens here?",
            code: `int cmp_int(const void *a, const void *b) {
  return *(const int*)a - *(const int*)b;
}

double vals[] = {3.5, 1.5, 2.5};
qsort(vals, 3, sizeof(double), cmp_int);`,
            choices: [
              { text: "A compile error — the comparison is for ints", why: "qsort takes a function pointer of a fixed shape, and cmp_int matches that shape exactly. Nothing tells the compiler which type the array holds." },
              { text: "It compiles, runs, and sorts nonsense", why: "Correct. qsort's comparison takes void pointers, so cmp_int is a valid argument. At run time it reads the first four bytes of each double as an int and sorts on garbage — with no warning at any point." },
              { text: "It crashes immediately", why: "Nothing invalid is dereferenced — the bytes are there, they are simply interpreted as the wrong type. It runs and gives a wrong answer, which is worse." },
              { text: "qsort detects the size mismatch", why: "qsort is told the item size and uses it to move bytes. It has no idea what those bytes mean." },
            ],
            answer: 1,
          },
          example: `/* C has no constraints. The requirement lives in the name
   and in a comment, and nothing enforces either */

/* cmp must return <0, 0 or >0. Nothing checks that it does */
int cmp_int(const void *a, const void *b);
qsort(arr, n, sizeof(int), cmp_int);

/* the only real tool: a compile-time assertion, C11 */
static_assert(sizeof(int) == 4, "this code assumes 4-byte ints");

/* _Generic dispatches on type — the closest C has to a bound */
#define print_any(x) _Generic((x), \\
  int:    print_int,    \\
  double: print_double, \\
  char *: print_string  \\
)(x)

/* using it with a type not listed is a COMPILE error,
   which is a genuine, if narrow, constraint */

/* everything else is discipline: naming, documentation, tests */`,
          notes: [
            { token: "no constraints", meaning: "the requirement lives in a comment. Nothing checks it" },
            { token: "void* loses the type", meaning: "the wrong comparison compiles and sorts garbage" },
            { token: "static_assert", meaning: "a compile-time check. Narrow, and real" },
            { token: "_Generic", meaning: "dispatch by type. An unlisted type is a compile error" },
          ],
          prompt:
            "Add a compile-time assertion that this code's assumption about int size actually holds.",
          starter: `(sizeof(int) == 4, "this code assumes 4-byte ints");`,
          rules: {
            regex: ["static_assert\\s*\\(\\s*sizeof\\s*\\(\\s*int\\s*\\)\\s*==\\s*4\\s*,"],
            hint: "static_assert(sizeof(int) == 4, \"...\");",
            success:
              "Correct. It costs nothing at run time — the condition is evaluated by the compiler, and a false one stops the build with your message.",
          },
          solution: `static_assert(sizeof(int) == 4, "this code assumes 4-byte ints");`,
        },

        python: {
          body: [
            "At run time, on the line inside your function that used `>`, with a TypeError saying the two Dogs cannot be ordered.",
            "That is the fundamental trade of duck typing. The function accepted something it could not handle, and you found out when it ran.",
            "Python's answer is to write the requirement down for a TYPE CHECKER, which reads it before the program runs. Nothing changes at run time; what changes is that mypy or pyright can tell you first.",
            "`TypeVar` with a bound is the direct version: `T = TypeVar(\"T\", bound=Comparable)` says T must be a subtype of Comparable. `TypeVar(\"N\", int, float)` constrains it to exactly those two.",
            "But the idiomatic Python answer is a PROTOCOL, and it is genuinely nice. A Protocol describes what a type must HAVE, and any class with those methods satisfies it — with no inheritance and no registration.",
            "That means a Protocol works on classes you did not write, including ones from libraries. It is structural typing: the shape is what matters, not the family tree.",
            "`typing` ships several ready-made — `Iterable`, `Sized`, `Callable`, `Sequence`, `SupportsInt` — and using those in a signature communicates far more than `list` does.",
          ],
          predict: {
            ask: "Does Dog satisfy this Protocol?",
            code: `from typing import Protocol

class Sized(Protocol):
    def __len__(self) -> int: ...

class Dog:
    def __len__(self) -> int:
        return 4

def report(x: Sized) -> int:
    return len(x)`,
            choices: [
              { text: "No — Dog does not inherit from Sized", why: "A Protocol is structural: it checks the shape, not the family tree. No inheritance is needed or expected." },
              { text: "Yes — it has the right method, and that is all a Protocol asks", why: "Correct. Protocols are structural typing: any class with a matching __len__ satisfies Sized, including classes written before the Protocol existed, and classes from libraries you cannot modify." },
              { text: "Only if Dog is registered with the Protocol", why: "That is what abstract base classes require. Protocols need nothing — the checker compares method signatures." },
              { text: "Only at run time", why: "The checking is done by mypy before the program runs. At run time nothing looks at the annotation at all." },
            ],
            answer: 1,
          },
          example: `from typing import TypeVar, Protocol, Iterable, Sized

# bound: T must be a subtype of this
class Comparable(Protocol):
    def __lt__(self, other) -> bool: ...

T = TypeVar("T", bound=Comparable)

def largest(a: T, b: T) -> T:
    return a if a > b else b

# constrained: T must be one of exactly these
Number = TypeVar("Number", int, float)

# a Protocol describes what a type must HAVE — no inheritance
class HasArea(Protocol):
    def area(self) -> float: ...

def report(shape: HasArea) -> None:
    print(shape.area())
# any class with an area() satisfies this, including ones
# from libraries you cannot modify

# the ready-made ones say more than a bare list does
def total(items: Iterable[int]) -> int:
    return sum(items)

# runtime_checkable, if you really need isinstance
from typing import runtime_checkable

@runtime_checkable
class Closeable(Protocol):
    def close(self) -> None: ...

isinstance(f, Closeable)      # works — checks method names only`,
          notes: [
            { token: "TypeVar(bound=X)", meaning: "T must be a subtype of X" },
            { token: "Protocol", meaning: "structural. Any class with the methods satisfies it" },
            { token: "Iterable / Sized / Callable", meaning: "ready-made, and they say more than `list`" },
            { token: "@runtime_checkable", meaning: "lets isinstance work. Checks names, not signatures" },
          ],
          prompt:
            "Write a Protocol describing anything with an area method, and use it in the signature.",
          starter: `from typing import Protocol

class HasArea():
    def area(self) -> float: ...

def report(shape: ) -> None:
    print(shape.area())`,
          rules: {
            regex: ["class\\s+HasArea\\s*\\(\\s*Protocol\\s*\\)", "shape\\s*:\\s*HasArea"],
            hint: "class HasArea(Protocol): and then def report(shape: HasArea) -> None:",
            success:
              "Correct. The three dots are the real body — a Protocol method needs no implementation, because nothing ever calls it. It exists purely for the checker to compare against.",
          },
          solution: `from typing import Protocol

class HasArea(Protocol):
    def area(self) -> float: ...

def report(shape: HasArea) -> None:
    print(shape.area())`,
        },

        java: {
          body: [
            "At compile time, and clearly — which is the one place Java's generics are unambiguously better than C++'s were.",
            "`<T extends Comparable<T>>` states the requirement. A Dog that does not implement Comparable is rejected at the call, with a message naming the type and the missing interface.",
            "Note the keyword: `extends` is used for interfaces too. `<T extends Runnable>` means 'implements Runnable', which reads oddly and is simply how it is spelled.",
            "For several requirements, join them with `&`: `<T extends Comparable<T> & Serializable>`. At most one of them may be a class, and it must come first.",
            "WILDCARDS are Java's other half of this, and they are where people get stuck. `List<?>` means 'a list of some type I do not need to name'.",
            "`? extends T` means 'T or a subtype' and is for reading: a `List<? extends Number>` can be summed but nothing can be added to it, because you do not know which subtype it actually holds.",
            "`? super T` means 'T or a supertype' and is for writing: you can add Integers to a `List<? super Integer>` because whatever it holds can certainly accept one.",
            "The mnemonic is PECS — Producer Extends, Consumer Super. If the parameter produces values for you, use extends; if it consumes values from you, use super.",
          ],
          predict: {
            ask: "Which of these lines compiles?",
            code: `List<? extends Number> nums = new ArrayList<Integer>();

nums.add(1);                 // A
Number n = nums.get(0);      // B`,
            choices: [
              { text: "Both", why: "Adding to a `? extends` list is rejected, because the compiler does not know which subtype the list actually holds." },
              { text: "Only B", why: "Correct. The list holds SOME subtype of Number, and the compiler does not know which — so adding an Integer might be wrong. Reading is safe, because whatever comes out is certainly a Number. Producer Extends." },
              { text: "Only A", why: "It is the other way round: reading is the safe direction for `? extends`, and adding is the unsafe one." },
              { text: "Neither", why: "Reading is fine. Whatever the list holds is a Number, so assigning to a Number always works." },
            ],
            answer: 1,
          },
          example: `// one requirement
static <T extends Comparable<T>> T largest(T a, T b) {
  return a.compareTo(b) > 0 ? a : b;
}

// several — & joins them. At most one class, and it goes first
static <T extends Comparable<T> & Serializable> void save(T item) { }

// extends is used for interfaces too. It reads oddly, and that is
// simply how it is spelled

// WILDCARDS — PECS: Producer Extends, Consumer Super
double sum(List<? extends Number> in) {      // produces values: read
  double t = 0;
  for (Number n : in) t += n.doubleValue();
  return t;                                  // in.add(1) would NOT compile
}

void fill(List<? super Integer> out) {       // consumes values: write
  out.add(1);                                // fine — it accepts Integers
}

void printAll(List<?> items) {               // do not care at all
  for (Object o : items) System.out.println(o);
}

// a recursive bound, which looks alarming and is common
static <T extends Comparable<T>> void sort(List<T> items) { }`,
          notes: [
            { token: "<T extends X>", meaning: "the bound. `extends` is used for interfaces too" },
            { token: "A & B", meaning: "several bounds. At most one class, first" },
            { token: "? extends T", meaning: "for READING. Producer Extends" },
            { token: "? super T", meaning: "for WRITING. Consumer Super" },
          ],
          prompt:
            "Constrain largest so it only accepts types that can be compared with each other.",
          starter: `static < > T largest(T a, T b) {
  return a.compareTo(b) > 0 ? a : b;
}`,
          rules: {
            regex: ["static\\s*<\\s*T\\s+extends\\s+Comparable\\s*<\\s*T\\s*>\\s*>\\s*T\\s+largest"],
            hint: "static <T extends Comparable<T>> T largest(T a, T b)",
            success:
              "Correct, and the inner <T> matters: plain `Comparable` would let a Dog be compared against a String. `Comparable<T>` says it must be comparable specifically with its own type.",
          },
          solution: `static <T extends Comparable<T>> T largest(T a, T b) {
  return a.compareTo(b) > 0 ? a : b;
}`,
        },

        javascript: {
          body: [
            "In plain JavaScript, nowhere. `largest(rex, fido)` compares two objects with `>`, which converts both to strings and returns one of them. No error, and a meaningless answer.",
            "That is the honest state of plain JavaScript: there is no constraint mechanism because there is no type system to constrain.",
            "In TypeScript, `extends` is the constraint keyword, and it is used differently from Java's — it means 'assignable to', not 'inherits from'.",
            "`function longest<T extends { length: number }>(a: T, b: T)` accepts anything with a length: a string, an array, a DOM node list, your own class. That is structural typing, and it makes constraints unusually easy to write.",
            "You never need to declare an interface first. The constraint can be written inline as the shape it requires, which is a real convenience over Java and Rust.",
            "`keyof` is the other piece worth knowing. `function get<T, K extends keyof T>(obj: T, key: K): T[K]` returns exactly the type of the field you asked for — so `get(user, \"age\")` is a number and `get(user, \"name\")` is a string, checked.",
            "The important limit again: all of this is erased. A constraint cannot help with data arriving from a network at run time, and pretending otherwise is the most common TypeScript mistake there is.",
          ],
          predict: {
            ask: "What is the type of the result?",
            code: `function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "Ada", age: 36 };
const x = get(user, "age");`,
            choices: [
              { text: "string | number", why: "The type is resolved for the specific key passed, not widened across all of them." },
              { text: "number", why: "Correct. K is inferred as the literal type \"age\", so T[K] resolves to the type of that one field. Asking for \"name\" would give string, and asking for \"height\" would not compile at all." },
              { text: "any", why: "The whole point of the keyof constraint is to avoid any — the field's real type is preserved." },
              { text: "unknown", why: "TypeScript resolves T[K] precisely because K is constrained to the object's own keys." },
            ],
            answer: 1,
          },
          example: `// plain JavaScript: no constraints, and no complaint
largest(rex, fido);          // compares two objects as strings

// TypeScript: extends means "assignable to", written INLINE
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}
longest("ada", "bob");
longest([1], [1, 2]);
// longest(3, 4);            // does not compile: a number has no length

// no interface declaration needed — the shape IS the constraint

// keyof, so the result type follows the key you asked for
function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const user = { name: "Ada", age: 36 };
get(user, "age");            // number
get(user, "name");           // string
// get(user, "height");      // does not compile

// a default, and a union constraint
function pick<T extends string | number = string>(x: T): T { return x; }

// all of it is erased. For data from a network you still need a
// real run-time check — Zod, Valibot, or a hand-written guard`,
          notes: [
            { token: "T extends { length: number }", meaning: "the shape written inline. No interface needed" },
            { token: "extends", meaning: "means 'assignable to', not 'inherits from'" },
            { token: "K extends keyof T", meaning: "the result type follows the key you asked for" },
            { token: "still erased", meaning: "a constraint cannot validate data arriving at run time" },
          ],
          prompt:
            "Constrain longest so it accepts anything with a length, written inline.",
          starter: `function longest<T >(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}`,
          rules: {
            regex: ["T\\s+extends\\s*\\{\\s*length\\s*:\\s*number\\s*\\}"],
            hint: "T extends { length: number } — the shape goes straight into the constraint.",
            success:
              "Correct. Nothing had to be declared beforehand, and it accepts strings, arrays, typed arrays and any class of your own with a length — structural typing at its most useful.",
          },
          solution: `function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}`,
        },

        rust: {
          body: [
            "On your function, when you write it — before anyone calls it with anything.",
            "That is the design decision that makes Rust's generics pleasant. The compiler checks a generic body against its DECLARED bounds, so an unbounded T using `>` fails immediately, and the message names the missing trait.",
            "C++ before concepts checked each generated copy instead, which is why its template errors are famous and Rust's are readable.",
            "`fn largest<T: PartialOrd>(a: T, b: T) -> T` is the short form. Several bounds join with `+`: `<T: PartialOrd + Clone + Debug>`.",
            "Once there are more than two, move them to a `where` clause. `where T: PartialOrd + Clone, U: Debug` keeps the signature line readable, and it is the conventional style for anything non-trivial.",
            "The trait bound is also what tells you which METHODS are available inside the body. Inside `fn f<T: Clone>(x: T)`, you may call `x.clone()` and nothing else — the compiler knows only what you promised.",
            "That is stricter than it first appears and it is the source of the guarantee: a generic function that compiles will work for every type satisfying its bounds, with no possibility of a surprise at some later call site.",
            "`impl Trait` is the lighter form for simple cases: `fn show(item: impl Display)` means the same as a generic with a Display bound, and reads better when the type is used only once.",
          ],
          predict: {
            ask: "Why does this fail inside the function body?",
            code: `fn show<T: std::fmt::Display>(x: T) {
    println!("{}", x);
    let y = x.clone();
}`,
            choices: [
              { text: "clone does not exist on any type", why: "clone exists on every type implementing Clone — the problem is that this function never said T does." },
              { text: "T is only declared to be Display, so only Display's methods are available", why: "Correct. Inside a generic body the compiler knows exactly what you promised and nothing more. Adding + Clone to the bound makes x.clone() available." },
              { text: "println! consumed x", why: "The {} formatter borrows rather than taking ownership, so x is still usable on the next line." },
              { text: "clone must be called as Clone::clone(&x)", why: "Method syntax is fine once the bound is there. The missing bound is the actual problem." },
            ],
            answer: 1,
          },
          example: `use std::fmt::{Debug, Display};

// one bound
fn largest<T: PartialOrd>(a: T, b: T) -> T {
    if a > b { a } else { b }
}

// several — joined with +
fn show<T: Display + Clone>(x: T) {
    println!("{}", x.clone());
}

// more than two: a where clause, and this is the convention
fn process<T, U>(a: T, b: U) -> String
where
    T: Display + Clone,
    U: Debug + Default,
{
    format!("{} {:?}", a, b)
}

// the bound decides which methods exist INSIDE the body.
// With only Display, x.clone() does not compile

// impl Trait — lighter, when the type is named once
fn show2(item: impl Display) { println!("{}", item); }

// and as a return type: "some type implementing this"
fn evens() -> impl Iterator<Item = i32> {
    (0..).filter(|n| n % 2 == 0)
}

// a bound on the trait itself
trait Shape: Debug {          // every Shape must also be Debug
    fn area(&self) -> f64;
}`,
          notes: [
            { token: "<T: A + B>", meaning: "several bounds, joined with +" },
            { token: "where", meaning: "the readable form once there are more than two" },
            { token: "the bound decides the methods", meaning: "inside the body you get exactly what you promised" },
            { token: "impl Trait", meaning: "lighter, for a type used only once" },
          ],
          prompt:
            "Give show the bounds it needs: printing with {} and calling clone.",
          starter: `fn show<T: >(x: T) {
    println!("{}", x.clone());
}`,
          rules: {
            regex: ["fn\\s+show\\s*<\\s*T\\s*:\\s*(Display\\s*\\+\\s*Clone|Clone\\s*\\+\\s*Display)\\s*>"],
            hint: "T: Display + Clone — one bound for the {} formatting, one for the clone call.",
            success:
              "Correct. Order does not matter, and the discipline does: every method you use in the body has to be promised in the bound, which is what makes the function safe for every future caller.",
          },
          solution: `fn show<T: Display + Clone>(x: T) {
    println!("{}", x.clone());
}`,
        },
      },
    },

    /* -------------------------------------------------------- runtime -- */
    {
      id: "runtime",
      kicker: "03",
      title: "What survives to run time",
      hook:
        "You have a `vector<string>` and a `vector<int>`. Once the program is running, does it still know the difference?",
      body: [
        "In C++, completely. They are genuinely different types, with different machine code and different memory layouts, and nothing about that is decided while the program runs.",
        "That follows from monomorphisation. `vector<string>` was compiled as its own class, so a `string` sits directly in the buffer rather than behind a pointer, and iterating it touches contiguous memory.",
        "The payoff is speed, and it is not marginal — a `vector<int>` of a million numbers is 4 MB of adjacent memory, which is the best case for a modern CPU's cache.",
        "The cost is code size and compile time. Every distinct instantiation is real compiled code, which is why heavy template libraries make builds slow and binaries large.",
        "There is one place where C++ deliberately gives this up: `std::vector<bool>`. It is specialised to pack eight booleans per byte, which saves memory and makes it behave unlike every other vector — `operator[]` does not return a `bool&`, and you cannot take a pointer into it.",
        "That specialisation is widely regarded as a mistake, and it is worth knowing about before it surprises you.",
        "The wider point: C++ and Rust keep the type, Java erases it, and Python and JavaScript never had it. Knowing which model you are in explains most of the errors you will hit with generics.",
      ],
      predict: {
        ask: "What is unusual about std::vector<bool>?",
        code: `vector<bool> v(8);
bool& r = v[0];`,
        choices: [
          { text: "Nothing — it behaves like any other vector", why: "It is a specialisation that packs bits, and that changes what operator[] can return." },
          { text: "It packs 8 bools per byte, so v[0] cannot return a bool& and this does not compile", why: "Correct. Because each element is one BIT, there is no addressable bool to reference. v[0] returns a proxy object instead, so binding it to a bool& fails — and vector<bool> is not really a container of bool at all." },
          { text: "It cannot be resized", why: "Resizing works normally. The packing is what makes it unusual." },
          { text: "bool is not allowed as a template argument", why: "It is allowed — the standard simply specialises this one case to save memory." },
        ],
        answer: 1,
      },
      viz: traceErasure(),
      example: `// two genuinely different types, decided at compile time
vector<int> a;
vector<string> b;
// different machine code, different layout, no run-time cost

// which is why this is fast: a million ints, adjacent in memory
vector<int> nums(1'000'000);      // 4 MB, cache-friendly

// the type is available at compile time
static_assert(is_same_v<vector<int>::value_type, int>);

// and typeid gives you a name at run time, if you need one
cout << typeid(a).name();

// the one deliberate exception, and a known mistake
vector<bool> flags(8);            // packs 8 per BYTE
// bool& r = flags[0];            // does not compile — no addressable bool
auto proxy = flags[0];            // a proxy object, not a bool&

// use this instead when you want normal behaviour
vector<char> flags2(8);
// or std::bitset<8> for a fixed size

// explicit specialisation: different code for one type
template<typename T> struct Store { void put(T); };
template<> struct Store<bool> { void put(bool); };   // special case`,
      notes: [
        { token: "different real types", meaning: "vector<int> and vector<string> share no code" },
        { token: "adjacent in memory", meaning: "why a vector<int> is cache-friendly" },
        { token: "vector<bool>", meaning: "packs bits. Not really a container of bool" },
        { token: "template<> struct X<bool>", meaning: "a specialisation — different code for one type" },
      ],
      challenge: {
        prompt:
          "You need a resizable array of flags that behaves like every other vector. Which element type avoids the bool specialisation?",
        starter: `vector<> flags(8);
flags[0] = 1;`,
        rules: {
          regex: ["vector\\s*<\\s*(char|uint8_t|unsigned\\s+char|int)\\s*>\\s+flags"],
          mustNot: ["vector<bool>"],
          hint: "vector<char> — anything but bool avoids the packing specialisation.",
          success:
            "Correct. For a FIXED number of flags, std::bitset<8> is better still: it packs the bits deliberately and gives you a sensible interface for it, which is what vector<bool> was trying to be.",
        },
        solution: `vector<char> flags(8);
flags[0] = 1;`,
      },

      alt: {
        c: {
          hook:
            "You have an array of ints and an array of doubles, both reached through a `void *`. At run time, can anything tell them apart?",
          body: [
            "No. A `void *` is an address and nothing else. The type was known when you wrote the code and is gone by the time it runs.",
            "That is C's whole model: types exist to help the compiler lay out memory and check what it can, and then they evaporate. There is no run-time type information at all.",
            "So generic code in C has to carry the type by hand. `qsort` takes the item SIZE as an argument, because it has no other way to know how far apart the elements are.",
            "The common pattern for a generic container is a struct holding the size, the count, and a `void *` to the data — plus function pointers for anything type-specific like copying or freeing.",
            "A TAGGED UNION is how you get something like run-time types when you need them: a struct with an enum saying which member is valid, and a union holding the possibilities.",
            "That is what a dynamic language's values look like underneath. A Python object is, in essence, a tag plus a payload — you are hand-writing what those languages do for you.",
            "The discipline that keeps this safe: keep the tag and the union next to each other, always switch on the tag, and never read a member the tag does not name.",
          ],
          predict: {
            ask: "Why does qsort need the item size?",
            code: `qsort(arr, n, sizeof(int), cmp);`,
            choices: [
              { text: "To check the array is big enough", why: "qsort does no bounds checking at all — it trusts the count you gave it." },
              { text: "It has only a void*, so nothing else tells it how far apart the elements are", why: "Correct. A void* is an address with no type attached, so qsort cannot work out the stride from the pointer. The size is the only thing that lets it step from one element to the next." },
              { text: "To decide which comparison to use", why: "The comparison is passed separately as a function pointer. The size is purely about stepping through memory." },
              { text: "For alignment", why: "Alignment is handled by the compiler when the array is created. The size is about the stride." },
            ],
            answer: 1,
          },
          example: `/* types are gone at run time. A void* is an address, no more */
void *p = arr;
/* nothing here can say what p points at */

/* so generic code carries the type by hand */
void qsort(void *base, size_t n, size_t size,
           int (*cmp)(const void *, const void *));
/* the size argument is the ONLY thing telling it the stride */

/* a generic container: size, count, data, and behaviour */
typedef struct {
  void  *data;
  size_t count;
  size_t item_size;
  void  (*free_item)(void *);
} Vec;

/* a TAGGED UNION — run-time types, by hand */
typedef enum { V_INT, V_DOUBLE, V_STR } Kind;

typedef struct {
  Kind kind;
  union {
    int    i;
    double d;
    char  *s;
  } as;
} Value;

void print(Value v) {
  switch (v.kind) {                 /* always switch on the tag */
    case V_INT:    printf("%d", v.as.i); break;
    case V_DOUBLE: printf("%f", v.as.d); break;
    case V_STR:    printf("%s", v.as.s); break;
  }
}
/* this is what a Python object looks like underneath */`,
          notes: [
            { token: "void *", meaning: "an address. The type is gone" },
            { token: "the size argument", meaning: "the only thing telling qsort the stride" },
            { token: "a tagged union", meaning: "run-time types, hand-written" },
            { token: "always switch on the tag", meaning: "never read a member the tag does not name" },
          ],
          prompt:
            "Define a tagged union: an enum saying which member is valid, and a union of the possibilities.",
          starter: `typedef enum { V_INT, V_DOUBLE } Kind;

typedef struct {
   kind;
   {
    int    i;
    double d;
  } as;
} Value;`,
          rules: {
            regex: ["Kind\\s+kind\\s*;", "union\\s*\\{"],
            hint: "Kind kind; for the tag, then union { ... } as; for the payload.",
            success:
              "Correct. Keeping the tag inside the same struct is what makes this safe — a bare union has no way to say which member is currently valid, and reading the wrong one is undefined behaviour.",
          },
          solution: `typedef enum { V_INT, V_DOUBLE } Kind;

typedef struct {
  Kind kind;
  union {
    int    i;
    double d;
  } as;
} Value;`,
        },

        python: {
          hook:
            "You annotate a function `def f(items: list[str])` and pass it a list of ints. What happens?",
          body: [
            "It runs. Python does not look at the annotation, and the function does whatever it does with ints.",
            "There was never a type to erase. Annotations are stored on the function object as data and are never consulted when calling it.",
            "You can even read them: `f.__annotations__` gives back a dictionary. Some libraries use that — FastAPI builds request validation from annotations, and dataclasses uses them to generate `__init__`.",
            "But nothing in the language checks them. `mypy` and `pyright` do, as a separate step before running, and that is the intended workflow.",
            "So the practical question is not 'what survives' but 'do you run the checker'. On a project of any size the answer should be yes, wired into CI — annotations you never verify slowly drift out of date and become misleading.",
            "For run-time checking of data you did not create — a JSON payload, a config file — annotations are the wrong tool. Use `pydantic`, which builds real validators from the same annotations, or write the checks by hand.",
            "One detail worth knowing: `from __future__ import annotations` makes all annotations lazy strings, which avoids import cycles and means a wrong annotation may never even be evaluated.",
          ],
          predict: {
            ask: "What does this print?",
            code: `def f(items: list[str]) -> int:
    return len(items)

print(f([1, 2, 3]))
print(f.__annotations__["items"])`,
            choices: [
              { text: "TypeError, then nothing", why: "Nothing at run time compares the argument against the annotation, so the call succeeds." },
              { text: "3, then list[str]", why: "Correct. The annotation is never checked when calling — it is stored as data on the function object, which is why the second line can print it back. mypy would have flagged the call beforehand." },
              { text: "3, then nothing — annotations are discarded", why: "They are kept, on the function's __annotations__ dictionary. That is how FastAPI and dataclasses read them." },
              { text: "It refuses to run", why: "Python never validates annotations at import or at call time." },
            ],
            answer: 1,
          },
          example: `def f(items: list[str]) -> int:
    return len(items)

f([1, 2, 3])                 # runs. Nothing checks the annotation

# but the annotation IS kept, as data
print(f.__annotations__)     # {'items': list[str], 'return': int}

# which is how these libraries work
from dataclasses import dataclass

@dataclass
class Point:
    x: int                   # __init__ is generated from these
    y: int

# checking is a SEPARATE step, before running
#   mypy .
#   pyright .
# wire it into CI, or the annotations drift out of date

# for data you did NOT create, annotations are the wrong tool
from pydantic import BaseModel

class User(BaseModel):
    name: str
    age: int

User(name="Ada", age="36")   # coerced, or a clear ValidationError
# THIS checks at run time. A plain annotation never would

# lazy annotations: stored as strings, avoids import cycles
from __future__ import annotations`,
          notes: [
            { token: "never checked at run time", meaning: "calling a function ignores its annotations" },
            { token: "__annotations__", meaning: "kept as data. How dataclasses and FastAPI work" },
            { token: "mypy / pyright", meaning: "the separate step that does the checking" },
            { token: "pydantic", meaning: "real run-time validation, built from the same annotations" },
          ],
          prompt:
            "Validate incoming data at run time using the library built for it, rather than trusting an annotation.",
          starter: `from pydantic import BaseModel

class User():
    name: str
    age: int`,
          rules: {
            regex: ["class\\s+User\\s*\\(\\s*BaseModel\\s*\\)"],
            hint: "class User(BaseModel): — inheriting BaseModel is what turns the annotations into real checks.",
            success:
              "Correct. The annotations are identical to a plain class's; what changes is that BaseModel reads them and builds a validator, so bad data fails at the boundary instead of six functions later.",
          },
          solution: `from pydantic import BaseModel

class User(BaseModel):
    name: str
    age: int`,
        },

        java: {
          body: [
            "No. Java ERASES the type: the compiler checks it, then throws it away, and at run time there is one `List` class holding `Object`s.",
            "That single decision explains a whole family of Java restrictions that otherwise look arbitrary.",
            "`new T[]` does not compile, because at run time there is no T to make an array of. The workaround is `(T[]) new Object[n]` with a suppressed warning, which is what `ArrayList` does internally.",
            "`x instanceof List<String>` does not compile either, for the same reason — the running program cannot tell a `List<String>` from a `List<Integer>`.",
            "Two methods differing only in their generic parameter clash: `void f(List<String>)` and `void f(List<Integer>)` erase to the same signature, so the class will not compile.",
            "And a static field cannot use the class's type parameter, because there is one static field shared by every instantiation and no single T to give it.",
            "Why accept all that? Backwards compatibility. Generics arrived in Java 5, and erasure let old non-generic code and new generic code share the same classes and the same JVM. It was a deliberate trade, and Java is still paying it.",
            "The escape hatch when you genuinely need the type is to pass a `Class<T>` object explicitly — which is exactly what `List.toArray(new String[0])` is doing.",
          ],
          predict: {
            ask: "Why does this not compile?",
            code: `class Box<T> {
  void put(List<String> x) { }
  void put(List<Integer> x) { }
}`,
            choices: [
              { text: "Overloading is not allowed on generic classes", why: "Overloading works normally. The issue is what these two signatures become after erasure." },
              { text: "Both erase to put(List), so they are the same method", why: "Correct. Erasure removes the type argument, leaving two identical signatures — 'name clash: both methods have the same erasure'. Give them different names, or a different number of parameters." },
              { text: "Box must declare T extends something", why: "An unbounded T is fine, and unrelated to the clash between the two put methods." },
              { text: "List cannot be a parameter type", why: "It can. The clash comes from the two type arguments vanishing." },
            ],
            answer: 1,
          },
          example: `// the type is checked, then ERASED
List<String> a = new ArrayList<>();
List<Integer> b = new ArrayList<>();
System.out.println(a.getClass() == b.getClass());   // true!

// which is why all of this is rejected:
// T[] arr = new T[10];                  no T at run time
// if (x instanceof List<String>) { }    cannot tell them apart
// void f(List<String>) + void f(List<Integer>)   same erasure
// static T shared;                      one field, no single T

// the workaround ArrayList itself uses
@SuppressWarnings("unchecked")
T[] make(int n) { return (T[]) new Object[n]; }

// or pass the type explicitly when you really need it
<T> T[] toArray(Class<T> type, int n) {
  return (T[]) Array.newInstance(type, n);
}
String[] names = list.toArray(new String[0]);   // the same idea

// erasure bought backwards compatibility in 2004:
// old non-generic code and new generic code share the same classes

// what DOES survive: the raw class, and any bound
// <T extends Number> erases to Number, not Object`,
          notes: [
            { token: "erasure", meaning: "checked at compile time, then thrown away" },
            { token: "no new T[]", meaning: "there is no T at run time to make an array of" },
            { token: "same erasure", meaning: "why two generic overloads can clash" },
            { token: "pass a Class<T>", meaning: "the escape hatch when you truly need the type" },
          ],
          prompt:
            "Make an array of T the way ArrayList does — cast an Object array, and suppress the unavoidable warning.",
          starter: `
T[] make(int n) { return () new Object[n]; }`,
          rules: {
            regex: ["@SuppressWarnings\\s*\\(\\s*\"unchecked\"\\s*\\)", "\\(\\s*T\\s*\\[\\s*\\]\\s*\\)\\s*new\\s+Object\\s*\\[\\s*n\\s*\\]"],
            hint: "@SuppressWarnings(\"unchecked\") above it, and (T[]) new Object[n] inside.",
            success:
              "Correct, and the warning is warranted rather than noise: the cast is genuinely unchecked, and handing that array out as a T[] to code expecting a real String[] would throw a ClassCastException. Keep it private.",
          },
          solution: `@SuppressWarnings("unchecked")
T[] make(int n) { return (T[]) new Object[n]; }`,
        },

        javascript: {
          hook:
            "You write `function f(items: string[])` in TypeScript and the API returns numbers instead. When do you find out?",
          body: [
            "When something downstream breaks, at run time, possibly far from the call — because TypeScript's types are erased completely and nothing checked what actually arrived.",
            "That is the single most important thing to understand about TypeScript. The compiler checks the code you wrote and then emits plain JavaScript with every annotation stripped. There is no trace at run time.",
            "So a type annotation is a claim about data you control. It says nothing about data crossing a boundary: an API response, a form submission, a database row, a message from a queue.",
            "`response.json() as User` is the classic mistake. The `as` tells the compiler to stop asking questions; it does not check anything, and if the shape is wrong you get an error much later with no clue where it came from.",
            "The correct approach at a boundary is a real run-time validator. Zod, Valibot and ArkType all let you declare the shape once and get BOTH a run-time check and a TypeScript type from it.",
            "Inside your own code, TypeScript's checking is genuinely strong — better than Java's in several ways, because structural typing catches shape mismatches that nominal typing misses.",
            "The rule that follows: trust types inside the boundary, validate at it. That is the same 'fail early, at the edge' rule from Error Handling, applied to shapes rather than values.",
          ],
          predict: {
            ask: "What does this actually check at run time?",
            code: `type User = { name: string; age: number };

const res = await fetch("/api/user");
const user = (await res.json()) as User;

console.log(user.name.toUpperCase());`,
            choices: [
              { text: "That the response has name and age of the right types", why: "`as` is an assertion, not a check. It emits no code at all." },
              { text: "Nothing at all — `as` emits no code, so a wrong shape fails later", why: "Correct. The assertion silences the compiler and disappears at build time. If the API returns { username, years }, user.name is undefined and the error appears on toUpperCase with nothing pointing at the real cause." },
              { text: "That the response is valid JSON", why: "res.json() checks the JSON syntax, and nothing checks the SHAPE against User." },
              { text: "It throws if the shape is wrong", why: "There is no throw. The mismatch is silent until something touches a missing field." },
            ],
            answer: 1,
          },
          example: `type User = { name: string; age: number };

// as checks NOTHING. It only silences the compiler
const user = (await res.json()) as User;      // hope

// declare the shape once, get a check AND a type
import { z } from "zod";

const User = z.object({
  name: z.string(),
  age: z.number().int().min(0),
});
type User = z.infer<typeof User>;             // the type, for free

const user = User.parse(await res.json());    // throws on a bad shape
// or, without throwing:
const result = User.safeParse(await res.json());
if (!result.success) return handle(result.error);

// a hand-written guard, when a library is too much
function isUser(x: unknown): x is User {
  return typeof x === "object" && x !== null &&
    typeof (x as any).name === "string";
}

// prefer unknown to any for incoming data — unknown forces
// you to narrow it before use; any turns the checker off

// the rule: trust types INSIDE the boundary, validate AT it`,
          notes: [
            { token: "erased completely", meaning: "the emitted JavaScript has no types at all" },
            { token: "as User", meaning: "an assertion, not a check. Emits no code" },
            { token: "z.infer<typeof X>", meaning: "one declaration, both a validator and a type" },
            { token: "unknown over any", meaning: "unknown forces you to narrow. any turns checking off" },
          ],
          prompt:
            "Validate the response properly instead of asserting the type.",
          starter: `const user = (await res.json())  User;`,
          rules: {
            regex: ["User\\.parse\\s*\\(\\s*await\\s+res\\.json\\s*\\(\\s*\\)\\s*\\)|User\\.safeParse\\s*\\("],
            mustNot: ["as User"],
            hint: "User.parse(await res.json()) — a real check that throws on a bad shape.",
            success:
              "Correct. Use safeParse instead when you want to handle the failure rather than throw — it returns { success, data } or { success, error }, which fits a request handler better.",
          },
          solution: `const user = User.parse(await res.json());`,
        },

        rust: {
          body: [
            "Completely. Rust monomorphises like C++, so `Vec<String>` and `Vec<i32>` are different types with different compiled code and different layouts.",
            "That means the same performance story: a `Vec<i32>` is a million adjacent 4-byte integers, and iterating it is as fast as a C array.",
            "It also means the same cost. Generic-heavy Rust compiles slowly, and a crate used with many different types produces a lot of code — which is a real part of why Rust builds have the reputation they do.",
            "Rust gives you an explicit choice about this that C++ makes harder. `impl Trait` monomorphises; `dyn Trait` does not.",
            "`fn draw(s: &impl Shape)` generates a copy per type — fast, larger. `fn draw(s: &dyn Shape)` compiles once and looks the method up through a table at run time — smaller, one pointer hop per call.",
            "The guidance is to prefer `impl` and reach for `dyn` when you need a mixed collection, or when the code size genuinely matters. `Vec<Box<dyn Shape>>` is the common reason.",
            "What Rust does NOT have is run-time reflection. There is no equivalent of Java's `getClass()`, and you cannot ask a value what type it is. `std::any::Any` allows a narrow downcast, and it is deliberately awkward because needing it usually means an enum would have been better.",
          ],
          predict: {
            ask: "What is the difference in the compiled output?",
            code: `fn draw_a(s: &impl Shape) { s.area(); }
fn draw_b(s: &dyn Shape) { s.area(); }`,
            choices: [
              { text: "None — they are two spellings of the same thing", why: "They compile to genuinely different code: one copy per type versus a single copy with a run-time lookup." },
              { text: "draw_a gets a copy per Shape type; draw_b is compiled once and looks the method up at run time", why: "Correct. impl Trait monomorphises — fast calls, bigger binary. dyn Trait is one function using a vtable — smaller, with a pointer hop per call and no inlining." },
              { text: "draw_b is faster because there is only one copy", why: "Fewer copies means a smaller binary, not faster calls. Each dyn call costs an indirection and cannot be inlined." },
              { text: "draw_a does not compile without a bound", why: "impl Shape IS the bound — it is shorthand for a generic parameter constrained to Shape." },
            ],
            answer: 1,
          },
          example: `// monomorphised, like C++. Different types, different code
let a: Vec<i32> = Vec::new();
let b: Vec<String> = Vec::new();
// a million i32s are a million adjacent 4-byte values

// the explicit choice C++ makes harder:

// static — a copy per type. Fast calls, bigger binary
fn draw_static(s: &impl Shape) { s.area(); }

// dynamic — one copy, a table lookup per call
fn draw_dynamic(s: &dyn Shape) { s.area(); }

// dyn is what you need for a mixed collection
let shapes: Vec<Box<dyn Shape>> = vec![
    Box::new(Circle { r: 1.0 }),
    Box::new(Square { s: 2.0 }),
];

// size and alignment, at compile time
println!("{}", std::mem::size_of::<Vec<i32>>());   // 24
println!("{}", std::mem::size_of::<Option<&i32>>());// 8 — niche packed

// NO reflection. You cannot ask a value what type it is.
// Any allows a narrow downcast, and is deliberately awkward
use std::any::Any;
fn try_int(x: &dyn Any) -> Option<&i32> { x.downcast_ref::<i32>() }
// needing this usually means an enum was the better design`,
          notes: [
            { token: "monomorphised", meaning: "a copy per type. Fast, and slow to compile" },
            { token: "impl Trait", meaning: "static dispatch. Prefer this" },
            { token: "dyn Trait", meaning: "one copy, a vtable lookup. For mixed collections" },
            { token: "no reflection", meaning: "you cannot ask a value its type. Any is the narrow exception" },
          ],
          prompt:
            "Declare a collection holding several different Shape types — which needs dynamic dispatch.",
          starter: `let shapes: Vec< Shape>> = vec![
    Box::new(Circle { r: 1.0 }),
    Box::new(Square { s: 2.0 }),
];`,
          rules: {
            regex: ["Vec\\s*<\\s*Box\\s*<\\s*dyn\\s+Shape\\s*>\\s*>"],
            hint: "Vec<Box<dyn Shape>> — dyn for the mixed types, Box because their sizes differ.",
            success:
              "Correct, and both halves are needed: dyn because the types differ, and Box because a Vec needs its elements to be one known size — a bare dyn Shape has no size the compiler can use.",
          },
          solution: `let shapes: Vec<Box<dyn Shape>> = vec![
    Box::new(Circle { r: 1.0 }),
    Box::new(Square { s: 2.0 }),
];`,
        },
      },
    },
  ],
};
