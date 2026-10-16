import type { TopicLesson } from "@/lib/dsa/lessons/types";
import { traceClosure, traceFunctionValue, traceImmutable } from "@/lib/dsa/viz/traceLang";

// Language track, topic 12.
//
// The first section is nearly the same everywhere. The second is where the six
// genuinely disagree — what a closure captures is a real semantic difference,
// not a spelling one, and it produces the loop-variable bug in three of them.

export const LANG_FUNCTIONAL: TopicLesson = {
  id: "lang-functional",
  title: "Functional Programming",
  tagline: "Functions as values, and leaving data alone.",
  why:
    "Two ideas, and both outlive whatever language you learn them in. Treating a function as a value is what makes callbacks, event handlers, comparators and every map/filter/reduce possible. Leaving data alone is what makes a program you can reason about — and it is the only reason concurrent code is ever tractable.",
  plain: [
    "A function can be stored in a variable, passed to another function, and returned from one.",
    "A function that takes or returns a function is called higher-order.",
    "A closure is a function plus the variables it captured from around it.",
    "Building a new value rather than changing an existing one means nobody else's assumptions break.",
  ],
  needs: ["Functions, and what a parameter receives.", "References from Memory & References."],
  traps: [
    "A closure made in a loop may capture the loop VARIABLE rather than its value, so every one of them sees the last value.",
    "Capturing by reference and then using the closure after the referenced thing is gone. In C++ and Rust that is a dangling reference.",
    "Chaining map and filter over a huge collection builds an intermediate copy at every step, unless the language is lazy.",
    "Reaching for a functional style everywhere. A loop with a clear name beats a clever fold.",
    "Assuming immutability is free. It usually is cheap, and copying a large structure per change is not.",
  ],
  sections: [
    /* --------------------------------------------------------- values -- */
    {
      id: "values",
      kicker: "01",
      title: "A function is a value",
      hook:
        "You have a sort that works. Now you need it to sort by name, then by age, then by distance. Do you write three sorts?",
      body: [
        "No. You write one sort that takes the COMPARISON as an argument, and pass a different one each time.",
        "That is the whole idea: a function can be stored in a variable, handed to another function, and returned from one. Every callback, event handler and comparator you will ever write rests on it.",
        "In C++ the everyday form is a LAMBDA: `[](int a, int b) { return a < b; }`. The square brackets are the capture list — what the lambda takes from the surrounding scope — and they are the subject of the next section.",
        "`auto` is what you store it in, because a lambda's type is unnameable: the compiler invents a unique type for every lambda you write.",
        "When you need a nameable type — a member variable, a function parameter you want to be flexible — use `std::function<int(int,int)>`. It accepts a lambda, a function pointer, or anything callable with that shape.",
        "But `std::function` has a cost: it may allocate, and it calls through an indirection that cannot be inlined. For a comparator passed to `sort`, prefer a template parameter or `auto`, which keeps it as fast as hand-written code.",
        "One more piece worth knowing: a lambda that captures nothing converts implicitly to a plain function pointer, which is what lets it be passed to a C API expecting one.",
      ],
      predict: {
        ask: "Which of these compiles?",
        code: `auto f = [](int x) { return x * 2; };   // A

std::function<int(int)> g = f;          // B

int (*h)(int) = f;                      // C

int y = 10;
int (*k)(int) = [y](int x) { return x + y; };  // D`,
        choices: [
          { text: "All four", why: "D captures a variable, and a capturing lambda cannot become a plain function pointer — there is nowhere to put the captured value." },
          { text: "A, B and C", why: "Correct. A lambda capturing NOTHING converts to a function pointer, which is why C works. D captures y, so it needs storage for it and cannot be a bare pointer." },
          { text: "Only A and B", why: "C is fine: a non-capturing lambda has an implicit conversion to a function pointer, precisely so it can be handed to C APIs." },
          { text: "Only A", why: "std::function accepts anything callable with the right signature, so B works too." },
        ],
        answer: 1,
      },
      viz: traceFunctionValue(),
      example: `#include <functional>
#include <algorithm>

// a lambda, stored in a variable. auto, because the type is unnameable
auto twice = [](int x) { return x * 2; };
cout << twice(5);

// passed in — one sort, many orders
sort(people.begin(), people.end(),
     [](const P& a, const P& b) { return a.age < b.age; });

// returned out
auto make_adder(int n) {
  return [n](int x) { return x + n; };
}
auto add10 = make_adder(10);
cout << add10(5);              // 15

// a nameable type, when you need one. Accepts anything callable
std::function<int(int,int)> op = [](int a, int b) { return a + b; };
// but it may allocate and cannot be inlined — prefer auto or a
// template parameter in hot code

// a template parameter: as fast as hand-written
template<typename F>
void each(const vector<int>& v, F f) { for (int x : v) f(x); }

// a non-capturing lambda IS a function pointer
int (*fp)(int) = [](int x) { return x * 2; };   // fine for a C API`,
      notes: [
        { token: "[](int x){ ... }", meaning: "a lambda. The brackets are the capture list" },
        { token: "auto", meaning: "every lambda has a unique, unnameable type" },
        { token: "std::function", meaning: "a nameable type. May allocate, cannot be inlined" },
        { token: "no captures", meaning: "converts to a plain function pointer" },
      ],
      challenge: {
        prompt:
          "Sort people by age using a lambda, with no captures.",
        starter: `sort(people.begin(), people.end(),
     (const P& a, const P& b) { return ; });`,
        rules: {
          regex: ["\\[\\s*\\]\\s*\\(\\s*const\\s+P&\\s+a\\s*,\\s*const\\s+P&\\s+b\\s*\\)", "return\\s+a\\.age\\s*<\\s*b\\.age"],
          hint: "An empty capture list [] and then return a.age < b.age;",
          success:
            "Correct, and the empty brackets are worth writing deliberately: they say this comparison depends on nothing outside itself, which is exactly what a comparator should be.",
        },
        solution: `sort(people.begin(), people.end(),
     [](const P& a, const P& b) { return a.age < b.age; });`,
      },

      alt: {
        c: {
          body: [
            "No. You write one sort taking a FUNCTION POINTER for the comparison — which is exactly what `qsort` does.",
            "C has no lambdas and no closures. What it has is the ability to take the address of a named function and pass it around, and for a great deal of code that is enough.",
            "`int (*cmp)(const void *, const void *)` declares a variable holding a function of that shape. Read it outwards from the name: cmp is a pointer, to a function, taking two const void pointers, returning an int.",
            "`typedef` makes this bearable. `typedef int (*Comparator)(const void *, const void *);` and then `Comparator cmp` reads like an ordinary declaration.",
            "The limitation is the one that matters: a function pointer carries NO state. It is an address, and nothing else, so there is no way to build one that remembers a value.",
            "The standard workaround is a CONTEXT POINTER: the callback takes an extra `void *user` argument, and the caller passes whatever the callback needs to remember. Almost every C library taking a callback does this.",
            "`qsort` is the famous exception — it has no context parameter, which is why sorting by a value known only at run time requires a global variable or the non-standard `qsort_r`.",
          ],
          predict: {
            ask: "Why can C not express this without extra machinery?",
            code: `/* wanted: a comparator that sorts by a column
   chosen at run time */

int cmp_by_column(const void *a, const void *b) {
  /* which column? */
}`,
            choices: [
              { text: "It can — use a nested function", why: "Standard C has no nested functions. GCC offers them as an extension, and they are not portable." },
              { text: "A function pointer carries no state, so the column has to arrive another way", why: "Correct. A function pointer is only an address — there is nowhere to store the column. C's answers are a global variable, or a callback that takes an extra void* context argument, which is what most libraries do." },
              { text: "void* cannot be used for a column index", why: "A void* can carry anything, including a pointer to the column index. The problem is that qsort's callback has no such parameter." },
              { text: "Comparators must be static", why: "They need not be static. The missing state is the issue." },
            ],
            answer: 1,
          },
          example: `/* a function pointer: read outwards from the name */
int (*cmp)(const void *, const void *);
/* cmp is a pointer, to a function, taking two const void*,
   returning an int */

/* typedef makes it readable */
typedef int (*Comparator)(const void *, const void *);

void my_sort(void *base, size_t n, size_t size, Comparator cmp);

/* the everyday use */
int cmp_int(const void *a, const void *b) {
  int x = *(const int *)a, y = *(const int *)b;
  return (x > y) - (x < y);
}
qsort(arr, n, sizeof(int), cmp_int);

/* NO closures. A function pointer carries no state at all */

/* the standard workaround: a context argument */
typedef void (*Visitor)(int value, void *user);

void each(const int *a, int n, Visitor f, void *user) {
  for (int i = 0; i < n; i++) f(a[i], user);
}

void collect(int value, void *user) {
  Sum *s = user;              /* whatever the caller wanted remembered */
  s->total += value;
}

Sum s = {0};
each(arr, n, collect, &s);

/* an array of function pointers — a dispatch table */
void (*ops[3])(void) = { op_add, op_sub, op_mul };
ops[choice]();`,
          notes: [
            { token: "int (*f)(int)", meaning: "a pointer to a function. Read outwards from the name" },
            { token: "typedef", meaning: "names the type so declarations stay readable" },
            { token: "no closures", meaning: "a function pointer is an address. It remembers nothing" },
            { token: "void *user", meaning: "the context argument. How C libraries carry state" },
          ],
          prompt:
            "Give each a callback that also receives a context pointer, so the caller can pass in whatever it needs remembered.",
          starter: `typedef void (*Visitor)(int value, );

void each(const int *a, int n, Visitor f, ) {
  for (int i = 0; i < n; i++) f(a[i], user);
}`,
          rules: {
            regex: ["Visitor\\s*\\)\\s*\\(\\s*int\\s+value\\s*,\\s*void\\s*\\*\\s*user\\s*\\)", "Visitor\\s+f\\s*,\\s*void\\s*\\*\\s*user"],
            hint: "void *user as the second callback parameter, and void *user as each's last parameter.",
            success:
              "Correct. That extra void* is the C idiom for everything a closure would have captured, and you will recognise it in almost every callback-taking API you meet.",
          },
          solution: `typedef void (*Visitor)(int value, void *user);

void each(const int *a, int n, Visitor f, void *user) {
  for (int i = 0; i < n; i++) f(a[i], user);
}`,
        },

        python: {
          body: [
            "No. You write one sort taking a KEY function, and pass a different one each time.",
            "Python functions are ordinary objects. You can put one in a variable, in a list, in a dict, pass it, return it, and attach attributes to it.",
            "`def` creates one and binds it to a name. `lambda` creates one without a name, and is deliberately limited to a single expression — no statements, no assignments, no multi-line bodies.",
            "That limit is on purpose. If a lambda needs more than one expression, Python's answer is that you should have used `def` and given it a name.",
            "For sorting, `key=` is the idiomatic form and it takes a function: `people.sort(key=lambda p: p.age)`. `operator.attrgetter(\"age\")` does the same thing slightly faster and reads well for simple cases.",
            "`functools.partial` fixes some arguments of a function and returns a new one — `partial(pow, 2)` gives you a function raising 2 to whatever you pass it.",
            "And a DECORATOR is the piece of Python that this section explains: `@cache` above a function is just `f = cache(f)`, a function taking a function and returning a replacement. Once functions are values, decorators stop being magic.",
          ],
          predict: {
            ask: "What does this print?",
            code: `def shout(f):
    def wrapper(x):
        return f(x).upper()
    return wrapper

@shout
def greet(name):
    return f"hi {name}"

print(greet("ada"))`,
            choices: [
              { text: "hi ada", why: "The decorator replaced greet with wrapper, so calling greet runs the wrapper's body." },
              { text: "HI ADA", why: "Correct. @shout means greet = shout(greet), so the name greet now refers to wrapper — which calls the original and uppercases the result. A decorator is a function taking a function and returning one." },
              { text: "It raises a TypeError", why: "wrapper takes exactly the one argument greet was called with, so the call works." },
              { text: "It prints the wrapper object", why: "greet(\"ada\") calls the wrapper rather than referring to it, so the result is a string." },
            ],
            answer: 1,
          },
          example: `# functions are ordinary objects
def twice(x): return x * 2

f = twice                    # in a variable
print(f(5))
ops = {"double": twice}      # in a dict
print(ops["double"](5))

# lambda: no name, and ONE expression only
add = lambda a, b: a + b

# sorting takes a key FUNCTION
people.sort(key=lambda p: p.age)

import operator
people.sort(key=operator.attrgetter("age"))   # the same, a bit faster

# returned out — and it remembers the n
def make_adder(n):
    def adder(x):
        return x + n
    return adder

add10 = make_adder(10)
print(add10(5))              # 15

# fixing some arguments
from functools import partial
square = partial(pow, exp=2)

# a DECORATOR is just a function taking a function
from functools import cache, wraps

def shout(f):
    @wraps(f)                # keeps the name and docstring
    def wrapper(*args, **kwargs):
        return f(*args, **kwargs).upper()
    return wrapper

@shout                       # greet = shout(greet)
def greet(name): return f"hi {name}"`,
          notes: [
            { token: "functions are objects", meaning: "store them, pass them, return them" },
            { token: "lambda", meaning: "one expression only. Use def when you need more" },
            { token: "key=", meaning: "sorting takes a function saying what to sort BY" },
            { token: "@decorator", meaning: "f = decorator(f). Nothing more than that" },
          ],
          prompt:
            "Write make_adder so the returned function remembers n.",
          starter: `def make_adder(n):
    def adder(x):
        return 
    return 

add10 = make_adder(10)`,
          rules: {
            regex: ["return\\s+x\\s*\\+\\s*n", "return\\s+adder\\b"],
            mustNot: ["return adder()"],
            hint: "return x + n inside adder, then return adder — the function itself, with no brackets.",
            success:
              "Correct, and the missing brackets on the last line are the point: `return adder()` would CALL it and return the result, while `return adder` hands back the function itself.",
          },
          solution: `def make_adder(n):
    def adder(x):
        return x + n
    return adder

add10 = make_adder(10)`,
        },

        java: {
          body: [
            "No. You write one sort taking a `Comparator`, and pass a different one each time.",
            "Java came to this late and arrived somewhere reasonable. Before Java 8 you wrote an anonymous inner class — six lines to express one comparison. Lambdas replaced that with `(a, b) -> a.age - b.age`.",
            "The important detail is what a Java lambda actually IS. There are no function types in Java: a lambda is an instance of a FUNCTIONAL INTERFACE, meaning an interface with exactly one abstract method.",
            "So `Comparator<P> c = (a, b) -> ...` works because Comparator has one method. Any interface of yours with one method works the same way, with no extra declaration.",
            "`java.util.function` ships the common shapes: `Function<T,R>`, `Predicate<T>`, `Consumer<T>`, `Supplier<T>`, `BiFunction<T,U,R>`, and primitive versions like `IntPredicate` that avoid boxing.",
            "METHOD REFERENCES are the shorthand worth learning: `String::toUpperCase`, `System.out::println`, `Person::getAge`, `ArrayList::new`. Each is a lambda whose whole body is one call.",
            "One restriction to know: a lambda may only capture variables that are final or EFFECTIVELY final — assigned once and never reassigned. That is Java choosing capture-by-value and enforcing it, which avoids the loop-variable trap entirely.",
          ],
          predict: {
            ask: "Why does this not compile?",
            code: `int total = 0;

list.forEach(x -> {
  total += x;
});`,
            choices: [
              { text: "forEach does not accept a lambda", why: "forEach takes a Consumer, which is a functional interface, so a lambda is exactly right." },
              { text: "total is reassigned, so it is not effectively final and cannot be captured", why: "Correct. Java only lets a lambda capture variables that are never reassigned. Use a stream with sum(), or an AtomicInteger, or a plain for loop." },
              { text: "The lambda needs a return", why: "A Consumer returns nothing, so a statement body with no return is correct." },
              { text: "total must be declared inside the lambda", why: "Then it would be a new variable each call and the accumulation would not work — which is the point Java is making by rejecting this." },
            ],
            answer: 1,
          },
          example: `// a lambda IS an instance of a one-method interface
Comparator<P> byAge = (a, b) -> Integer.compare(a.age, b.age);
people.sort(byAge);

// the ready-made shapes
Function<String,Integer> len = s -> s.length();
Predicate<String> empty = String::isEmpty;
Consumer<String> print = System.out::println;
Supplier<List<String>> make = ArrayList::new;
BiFunction<Integer,Integer,Integer> add = Integer::sum;

// method references — a lambda whose body is one call
list.stream().map(String::toUpperCase).toList();
people.sort(Comparator.comparing(P::getAge));

// your own one-method interface works too, with no extra work
interface Validator { boolean check(String s); }
Validator notBlank = s -> !s.isBlank();

// primitive versions avoid boxing in hot code
IntPredicate even = n -> n % 2 == 0;

// captured variables must be final or EFFECTIVELY final
int base = 10;                     // never reassigned — fine
Function<Integer,Integer> f = x -> x + base;

// int total = 0;
// list.forEach(x -> total += x);  // does NOT compile
int total = list.stream().mapToInt(Integer::intValue).sum();  // do this`,
          notes: [
            { token: "a functional interface", meaning: "one abstract method. That is what a lambda becomes" },
            { token: "Function / Predicate / Consumer", meaning: "the ready-made shapes in java.util.function" },
            { token: "String::toUpperCase", meaning: "a method reference. A lambda that is one call" },
            { token: "effectively final", meaning: "captured variables may never be reassigned" },
          ],
          prompt:
            "Sort people by age using a method reference rather than a hand-written lambda.",
          starter: `people.sort(Comparator.comparing());`,
          rules: {
            regex: ["Comparator\\.comparing\\s*\\(\\s*P::getAge\\s*\\)"],
            hint: "Comparator.comparing(P::getAge) — the double colon makes a method reference.",
            success:
              "Correct. P::getAge means 'the getAge method of whatever P I am given' — shorter than p -> p.getAge(), and it reads as the field being sorted by rather than as code.",
          },
          solution: `people.sort(Comparator.comparing(P::getAge));`,
        },

        javascript: {
          body: [
            "No. You write one sort taking a comparison function, and pass a different one each time.",
            "JavaScript has had first-class functions from the beginning, and it leans on them harder than any other language here. Callbacks, promises, event handlers, middleware and React components are all functions being passed around.",
            "There are two forms and the difference is not only length. `function (x) { }` gets its own `this`, decided by how it is called. `x => x * 2` does NOT — an arrow function takes `this` from where it was written.",
            "That is why arrow functions took over for callbacks. `setTimeout(() => this.tick(), 1000)` works inside a class; the `function` form loses `this` and needs a `.bind(this)`.",
            "The arrow's short form returns the expression: `x => x * 2`. Add braces and you need an explicit return: `x => { return x * 2; }`. Returning an object literal needs brackets — `x => ({ v: x })` — or the braces read as a body.",
            "Functions are objects here, so they have properties: `f.name`, `f.length` (how many parameters it declares), and you can attach your own.",
            "One thing worth knowing early: `function` declarations are HOISTED — callable before the line that defines them. `const f = () => {}` is not. That asymmetry explains a class of confusing errors in older codebases.",
          ],
          predict: {
            ask: "What does this print?",
            code: `const obj = {
  name: "Ada",
  greetA: function () { return this.name; },
  greetB: () => this.name,
};

console.log(obj.greetA(), obj.greetB());`,
            choices: [
              { text: "Ada Ada", why: "An arrow function does not get its own this — it takes it from where it was written, which here is outside the object." },
              { text: "Ada and undefined", why: "Correct. greetA is called as obj.greetA(), so its this is obj. greetB is an arrow, so its this comes from the enclosing scope — the module or global — where there is no name." },
              { text: "undefined Ada", why: "It is the other way round: the function form gets this from the call, and the arrow form does not." },
              { text: "It throws", why: "Reading a missing property gives undefined rather than throwing, so both calls return." },
            ],
            answer: 1,
          },
          example: `// two forms, and the difference is what this means
const twiceA = function (x) { return x * 2; };   // own this
const twiceB = x => x * 2;                       // inherits this

// which is why arrows won for callbacks
class Timer {
  start() {
    setInterval(() => this.tick(), 1000);        // works
    // setInterval(function () { this.tick(); }, 1000);  // this is lost
  }
}

// short form returns the expression
nums.map(x => x * 2);
nums.filter(x => x > 0);
nums.sort((a, b) => a - b);

// an object literal needs brackets, or the braces read as a body
nums.map(x => ({ value: x }));

// returned out, and it remembers n
const makeAdder = n => x => x + n;
const add10 = makeAdder(10);
add10(5);                     // 15

// functions are objects
function greet(a, b) {}
greet.name;                   // "greet"
greet.length;                 // 2 — declared parameters

// declarations are HOISTED; const arrows are not
hoisted();                    // fine
function hoisted() {}
// notHoisted();              // ReferenceError
const notHoisted = () => {};`,
          notes: [
            { token: "x => x * 2", meaning: "an arrow. Inherits this from where it was written" },
            { token: "function (x) {}", meaning: "gets its own this, decided by the call" },
            { token: "x => ({ v: x })", meaning: "brackets, or the braces read as a body" },
            { token: "hoisting", meaning: "function declarations are callable early. const arrows are not" },
          ],
          prompt:
            "Write makeAdder as arrow functions, so the returned one remembers n.",
          starter: `const makeAdder = n => ;

const add10 = makeAdder(10);`,
          rules: {
            regex: ["const\\s+makeAdder\\s*=\\s*n\\s*=>\\s*x\\s*=>\\s*x\\s*\\+\\s*n"],
            hint: "const makeAdder = n => x => x + n;",
            success:
              "Correct. Read it as n => (x => x + n): the outer arrow takes n and returns the inner arrow, which has captured it. Chained arrows like this are called currying.",
          },
          solution: `const makeAdder = n => x => x + n;

const add10 = makeAdder(10);`,
        },

        rust: {
          body: [
            "No. You write one sort taking a comparison closure, and pass a different one each time.",
            "Rust's closures are written with pipes: `|a, b| a.age < b.age`. Short, and the types are usually inferred.",
            "The part that is unique to Rust is that closures come in THREE kinds, decided by what they do with what they captured — and the compiler picks for you.",
            "`Fn` only reads its captures, so it can be called any number of times. `FnMut` modifies them, so it needs a mutable borrow. `FnOnce` consumes them, so it can only be called once.",
            "You rarely write these when creating a closure. You write them when ACCEPTING one: `fn each<F: Fn(i32)>(f: F)` says 'I may call this repeatedly', and `FnOnce` says 'I will call it at most once'.",
            "The guidance is to accept the most permissive one that works. `FnOnce` accepts every closure; `Fn` accepts the fewest. Ask for `FnOnce` if you call it once, `FnMut` if you call it repeatedly and it may accumulate, `Fn` if it is read-only.",
            "For storing a closure — in a struct, or in a Vec — you need `Box<dyn Fn(i32) -> i32>`, because every closure has its own anonymous type just as in C++.",
            "And a closure capturing nothing coerces to a plain `fn` pointer, exactly like a non-capturing C++ lambda.",
          ],
          predict: {
            ask: "Why does this fail to compile?",
            code: `fn call_twice<F: Fn()>(f: F) { f(); f(); }

let s = String::from("hi");
call_twice(move || {
    let owned = s;
});`,
            choices: [
              { text: "move is not allowed here", why: "move is fine and is exactly what forces ownership into the closure. The problem is what the body then does with it." },
              { text: "The closure consumes s, so it is FnOnce and cannot satisfy Fn", why: "Correct. Moving s out of the closure's captures can only happen once, which makes it FnOnce. call_twice asks for Fn, promising to call it repeatedly — so the compiler rejects it." },
              { text: "String cannot be captured", why: "Any value can be captured. It is the consuming that limits how often the closure may be called." },
              { text: "f() needs to be f.call()", why: "Calling a closure with brackets is normal syntax." },
            ],
            answer: 1,
          },
          example: `// a closure: pipes for the parameters, types usually inferred
let twice = |x: i32| x * 2;
people.sort_by(|a, b| a.age.cmp(&b.age));

// three kinds, decided by what it does with its captures:
//   Fn      only reads them      — call it any number of times
//   FnMut   modifies them        — needs a mutable borrow
//   FnOnce  consumes them        — call it at most once

fn each<F: Fn(i32)>(v: &[i32], f: F) {      // may call repeatedly
    for &x in v { f(x); }
}

fn run_once<F: FnOnce() -> String>(f: F) -> String { f() }

// accept the most PERMISSIVE one that works.
// FnOnce accepts every closure; Fn accepts the fewest

// returned out — impl Trait, because the type is anonymous
fn make_adder(n: i32) -> impl Fn(i32) -> i32 {
    move |x| x + n              // move: the closure owns n
}
let add10 = make_adder(10);
add10(5);                       // 15

// stored: a Box, because every closure has its own type
let ops: Vec<Box<dyn Fn(i32) -> i32>> = vec![
    Box::new(|x| x + 1),
    Box::new(|x| x * 2),
];

// capturing nothing coerces to a plain fn pointer
let f: fn(i32) -> i32 = |x| x * 2;`,
          notes: [
            { token: "|x| x * 2", meaning: "a closure. Pipes for the parameters" },
            { token: "Fn / FnMut / FnOnce", meaning: "reads, modifies, or consumes its captures" },
            { token: "impl Fn(i32) -> i32", meaning: "how to return one. The type is anonymous" },
            { token: "Box<dyn Fn(...)>", meaning: "how to store one, or hold several" },
          ],
          prompt:
            "Return a closure that remembers n — say which trait it implements, and give it ownership of n.",
          starter: `fn make_adder(n: i32) ->  {
     |x| x + n
}`,
          rules: {
            regex: ["->\\s*impl\\s+Fn\\s*\\(\\s*i32\\s*\\)\\s*->\\s*i32", "move\\s*\\|x\\|\\s*x\\s*\\+\\s*n"],
            hint: "-> impl Fn(i32) -> i32 for the return type, and move |x| x + n so the closure owns n.",
            success:
              "Correct, and the move is not optional here: without it the closure borrows n, and n dies when make_adder returns — the compiler would tell you the closure outlives what it borrowed.",
          },
          solution: `fn make_adder(n: i32) -> impl Fn(i32) -> i32 {
    move |x| x + n
}`,
        },
      },
    },

    /* ------------------------------------------------------- closures -- */
    {
      id: "closures",
      kicker: "02",
      title: "What a closure remembers",
      hook:
        "A loop creates three functions, each returning the loop counter. You call them afterwards. Do you get 0, 1, 2?",
      body: [
        "In C++ it depends entirely on one character in the capture list, and getting it wrong gives you a dangling reference rather than a wrong number.",
        "The square brackets are where you say what the lambda takes from the surrounding scope, and C++ is the only language here that makes you say it explicitly.",
        "`[x]` captures a COPY of x. The lambda has its own, and changing the original afterwards does not affect it.",
        "`[&x]` captures a REFERENCE to x. The lambda sees later changes — and if x dies before the lambda is called, the lambda holds a dangling reference. That is undefined behaviour, not a wrong answer.",
        "`[=]` copies everything the body uses. `[&]` references everything the body uses. Both are convenient and both hide which variables are involved, so many codebases discourage them.",
        "The rule that matters: if the lambda outlives the scope it was created in — stored in a member, put on a queue, passed to a thread — capture by VALUE. Reference capture is for lambdas used immediately, like a comparator passed straight to `sort`.",
        "`[this]` captures the enclosing object by reference, which is the same hazard wearing a different hat. `[*this]` copies the object instead, and is what you want for anything asynchronous.",
      ],
      predict: {
        ask: "What is wrong with this C++ code?",
        code: `std::function<int()> make() {
  int n = 42;
  return [&n]() { return n; };
}

auto f = make();
cout << f();`,
        choices: [
          { text: "Nothing — the lambda copied n", why: "The ampersand asks for a reference, not a copy. Nothing was copied." },
          { text: "n dies when make returns, so the lambda holds a dangling reference", why: "Correct. [&n] captures a reference to a local, and that local is destroyed the moment make returns. Calling f afterwards reads memory that is no longer yours — undefined behaviour, and it often appears to work. Use [n] instead." },
          { text: "std::function cannot hold a capturing lambda", why: "Holding capturing lambdas is exactly what std::function is for. The capture MODE is the bug." },
          { text: "It prints 0", why: "It may print 42, or 0, or anything at all. That unpredictability is what makes it undefined behaviour rather than a wrong answer." },
        ],
        answer: 1,
      },
      viz: traceClosure(),
      example: `int n = 10;

auto byValue = [n]() { return n; };     // its own copy
auto byRef   = [&n]() { return n; };    // sees later changes

n = 20;
byValue();     // 10 — the copy is untouched
byRef();       // 20 — reads the current n

// catch-all forms. Convenient, and they hide what is captured
auto all_copy = [=]() { return n; };
auto all_ref  = [&]() { return n; };

// mixed, which is often the clearest
auto mixed = [n, &total]() { total += n; };

// mutable, if the lambda needs to change its OWN copy
auto counter = [count = 0]() mutable { return ++count; };

// init-capture: compute something once, into the lambda
auto owned = [v = std::move(bigVector)]() { return v.size(); };

// THE RULE: outlives its scope? capture by VALUE
std::function<int()> make() {
  int n = 42;
  return [n]() { return n; };     // NOT [&n]
}

// [this] is a reference to the object. For anything async use [*this]
auto safe = [*this]() { return this->value; };`,
      notes: [
        { token: "[n]", meaning: "a copy. Safe to outlive the scope" },
        { token: "[&n]", meaning: "a reference. Dangling if the original dies first" },
        { token: "[=] and [&]", meaning: "catch-all. Convenient, and they hide what is captured" },
        { token: "[this] vs [*this]", meaning: "the object by reference, or a copy of it" },
      ],
      challenge: {
        prompt:
          "Fix the returned lambda so it is still valid after make has returned.",
        starter: `std::function<int()> make() {
  int n = 42;
  return [&n]() { return n; };
}`,
        rules: {
          regex: ["return\\s+\\[\\s*n\\s*\\]\\s*\\(\\s*\\)"],
          mustNot: ["[&n]"],
          hint: "Capture by value: [n] rather than [&n].",
          success:
            "Correct. The dropped ampersand is the whole fix, and it is worth stating as a habit: a lambda that outlives its scope captures by value, every time.",
        },
        solution: `std::function<int()> make() {
  int n = 42;
  return [n]() { return n; };
}`,
      },

      alt: {
        c: {
          hook:
            "You want a callback that remembers a value. C has no closures. What is the actual pattern?",
          body: [
            "A struct holding the state, and a function pointer taking a `void *` that points at it. That pair is a closure, assembled by hand.",
            "It is worth seeing once, because it shows exactly what the other five languages are doing for you.",
            "The struct is the captured environment. The function is the body. The `void *` is how the body reaches the environment when it is called.",
            "The caller allocates or declares the struct, fills in what the callback needs to remember, and passes both the function and the pointer.",
            "Every C API taking a callback works this way. GTK calls it user_data, pthreads passes a `void *arg` to the thread function, and qsort_r calls it a context.",
            "The ownership question is the hard part, and C gives you no help with it. If the struct is a local and the callback is stored for later, you have exactly the dangling-reference bug C++ has with `[&]` — with no compiler warning at all.",
            "So the discipline is: either keep the state alive as long as the callback can be called, or malloc it and give the callback a documented job of freeing it.",
          ],
          predict: {
            ask: "What is the bug here?",
            code: `void register_later(Callback f, void *user);

void setup(void) {
  int total = 0;
  register_later(add_to, &total);
}`,
            choices: [
              { text: "Nothing — total is passed by address", why: "It is passed by address, and that address stops being valid the moment setup returns." },
              { text: "total is a local, so the stored pointer dangles once setup returns", why: "Correct. register_later keeps the pointer for later, and total lives on setup's stack frame, which is released when setup returns. The callback then writes into memory that belongs to something else." },
              { text: "add_to has the wrong signature", why: "The signature is not shown and is not what makes this unsafe — the lifetime of what the pointer points at is." },
              { text: "Callback cannot be a typedef", why: "Callback is a perfectly ordinary function-pointer typedef." },
            ],
            answer: 1,
          },
          example: `/* a closure, assembled by hand: state + function + pointer */

typedef struct {
  int total;           /* what the callback must remember */
  int limit;
} Acc;

void add_to(int value, void *user) {
  Acc *a = user;                    /* reach the environment */
  if (value <= a->limit) a->total += value;
}

void each(const int *arr, int n, void (*f)(int, void *), void *user) {
  for (int i = 0; i < n; i++) f(arr[i], user);
}

/* used immediately — a local is fine */
Acc a = { .total = 0, .limit = 100 };
each(nums, n, add_to, &a);
printf("%d", a.total);

/* stored for LATER — a local is a dangling pointer.
   Either keep it alive, or malloc it and say who frees it */
Acc *heap = malloc(sizeof *heap);
heap->total = 0;
register_later(add_to, heap);      /* document who calls free */

/* this is what every C callback API looks like:
   GTK's user_data, pthread's void *arg, qsort_r's context */`,
          notes: [
            { token: "struct + function + void*", meaning: "a closure, assembled by hand" },
            { token: "the struct", meaning: "is the captured environment" },
            { token: "a local, stored for later", meaning: "the same dangling bug, with no warning" },
            { token: "malloc it", meaning: "and document who is responsible for freeing it" },
          ],
          prompt:
            "Write the callback so it reaches its remembered state through the context pointer.",
          starter: `void add_to(int value, void *user) {
  Acc *a = ;
  a-> += value;
}`,
          rules: {
            regex: ["Acc\\s*\\*\\s*a\\s*=\\s*user\\s*;", "a->total\\s*\\+=\\s*value"],
            hint: "Acc *a = user; and then a->total += value;",
            success:
              "Correct. The assignment from void* needs no cast in C — that is one of the few places C is more permissive than C++, where the cast would be required.",
          },
          solution: `void add_to(int value, void *user) {
  Acc *a = user;
  a->total += value;
}`,
        },

        python: {
          body: [
            "No. You get 2, 2, 2 — and this is one of Python's most reliable surprises.",
            "A Python closure captures the VARIABLE, not its value. All three functions refer to the same `i`, and by the time you call them the loop has finished and left `i` at 2.",
            "The name for this is late binding: the value is looked up when the function is CALLED, not when it was created.",
            "The standard fix is a default argument: `lambda i=i: i`. Default arguments are evaluated at definition time, so each lambda gets its own copy of the current value.",
            "It looks like a trick because it is one, and it is the idiomatic answer. `functools.partial(f, i)` does the same thing more explicitly if you prefer.",
            "The other half of Python closures is `nonlocal`. Assigning to a name inside a nested function creates a NEW local by default — so a counter that tries to do `count += 1` fails with UnboundLocalError.",
            "`nonlocal count` says 'this refers to the enclosing function's variable'. `global` does the same for module level. Both exist because Python decides scope by assignment, not by declaration.",
          ],
          predict: {
            ask: "What does this print?",
            code: `def counter():
    count = 0
    def bump():
        count += 1
        return count
    return bump

print(counter()())`,
            choices: [
              { text: "1", why: "Assigning to count inside bump makes it a new local, which is then read before being assigned." },
              { text: "UnboundLocalError", why: "Correct. `count += 1` is an assignment, so Python treats count as local to bump — and then reading it on the right-hand side fails, because that local has no value yet. Add `nonlocal count` to fix it." },
              { text: "0", why: "The function never gets as far as returning; the increment raises first." },
              { text: "It returns the bump function", why: "The double brackets call counter and then call the returned bump, so bump's body runs." },
            ],
            answer: 1,
          },
          example: `# a closure captures the VARIABLE, not the value
fns = []
for i in range(3):
    fns.append(lambda: i)

print([f() for f in fns])     # [2, 2, 2] — all share one i

# the fix: a default argument, evaluated at definition time
fns = []
for i in range(3):
    fns.append(lambda i=i: i)

print([f() for f in fns])     # [0, 1, 2]

# or, more explicitly
from functools import partial
fns = [partial(lambda x: x, i) for i in range(3)]

# assigning inside a nested function makes a NEW local
def counter():
    count = 0
    def bump():
        nonlocal count        # without this: UnboundLocalError
        count += 1
        return count
    return bump

c = counter()
print(c(), c(), c())          # 1 2 3

# global does the same for module level
total = 0
def add(n):
    global total
    total += n

# reading needs no declaration — only assigning does
def show():
    print(total)              # fine, no global needed`,
          notes: [
            { token: "captures the variable", meaning: "late binding. Looked up when called" },
            { token: "lambda i=i:", meaning: "the idiomatic fix. Defaults evaluate at definition" },
            { token: "nonlocal", meaning: "assign to the enclosing function's variable" },
            { token: "assigning makes a local", meaning: "which is why reading alone needs no declaration" },
          ],
          prompt:
            "Fix counter so bump increments the enclosing count rather than creating a new local.",
          starter: `def counter():
    count = 0
    def bump():
        
        count += 1
        return count
    return bump`,
          rules: {
            regex: ["nonlocal\\s+count"],
            hint: "nonlocal count on the first line of bump.",
            success:
              "Correct. `global` would have been wrong here: count is not at module level, it belongs to the enclosing function — and nonlocal is the word for exactly that middle case.",
          },
          solution: `def counter():
    count = 0
    def bump():
        nonlocal count
        count += 1
        return count
    return bump`,
        },

        java: {
          body: [
            "You get 0, 1, 2 — and Java is the only language here where that is guaranteed without you doing anything.",
            "The reason is a restriction: a lambda may only capture variables that are final or EFFECTIVELY final, meaning assigned once and never reassigned.",
            "A loop counter in a classic `for (int i = 0; ...)` is reassigned every iteration, so it cannot be captured at all — the code does not compile. An enhanced `for (String s : list)` gives a fresh variable per iteration, which can.",
            "So Java sidesteps the loop-variable trap by refusing to let you write it. That is restrictive and it removes an entire class of bug.",
            "The consequence you will hit is accumulation. `int total = 0; list.forEach(x -> total += x);` does not compile, and the intended answer is a stream: `list.stream().mapToInt(...).sum()`.",
            "When you genuinely need a mutable capture, the usual answers are an `AtomicInteger`, a one-element array, or a small holder object. All three work because the VARIABLE is never reassigned — only what it points at changes.",
            "That last point is the precise rule: effectively final constrains the reference, not the object. A captured `List` can still have things added to it, which is a real hole in the safety this gives you.",
          ],
          predict: {
            ask: "Which of these compiles?",
            code: `List<Runnable> fns = new ArrayList<>();

for (int i = 0; i < 3; i++)
  fns.add(() -> System.out.println(i));      // A

for (String s : names)
  fns.add(() -> System.out.println(s));      // B`,
            choices: [
              { text: "Both", why: "The classic for loop reassigns i on every iteration, so it is not effectively final and cannot be captured." },
              { text: "Only B", why: "Correct. i is reassigned each iteration, so A does not compile. The enhanced for loop creates a NEW s each iteration, which is never reassigned — so B compiles and each lambda captures its own." },
              { text: "Only A", why: "It is the other way round: the enhanced for loop's variable is the one that can be captured." },
              { text: "Neither", why: "B is fine, and is the standard way to build a list of lambdas over a collection in Java." },
            ],
            answer: 1,
          },
          example: `// captured variables must be final or EFFECTIVELY final
int base = 10;                        // never reassigned — fine
Function<Integer,Integer> f = x -> x + base;

// a classic for loop's counter is reassigned, so it CANNOT be captured
// for (int i = 0; i < 3; i++) fns.add(() -> print(i));   // no

// an enhanced for gives a fresh variable each time — fine
for (String s : names) fns.add(() -> print(s));

// so Java has no loop-variable trap. It refuses to let you write it

// accumulation: the intended answer is a stream
// int total = 0; list.forEach(x -> total += x);   // does not compile
int total = list.stream().mapToInt(Integer::intValue).sum();

// when you truly need a mutable capture
AtomicInteger count = new AtomicInteger();
list.forEach(x -> count.incrementAndGet());

int[] holder = {0};                   // the array trick
list.forEach(x -> holder[0] += x);

// the rule constrains the REFERENCE, not the object
List<String> collected = new ArrayList<>();
list.forEach(x -> collected.add(x));  // legal — and shared state

// anonymous inner classes capture the same way, and DO have their
// own this — a lambda takes this from the enclosing instance`,
          notes: [
            { token: "effectively final", meaning: "assigned once, never reassigned" },
            { token: "a for counter", meaning: "reassigned, so it cannot be captured at all" },
            { token: "AtomicInteger", meaning: "when you genuinely need a mutable capture" },
            { token: "constrains the reference", meaning: "a captured List can still be added to" },
          ],
          prompt:
            "Sum the list without a captured accumulator — use the mechanism Java intends.",
          starter: `int total = list.stream().();`,
          rules: {
            regex: ["\\.mapToInt\\s*\\(\\s*Integer::intValue\\s*\\)\\s*\\.sum\\s*\\(\\s*\\)"],
            hint: "list.stream().mapToInt(Integer::intValue).sum()",
            success:
              "Correct. mapToInt rather than map is what gives you sum() — a Stream<Integer> has no sum, and would need reduce(0, Integer::sum) plus boxing on every element.",
          },
          solution: `int total = list.stream().mapToInt(Integer::intValue).sum();`,
        },

        javascript: {
          body: [
            "With `let`, yes: 0, 1, 2. With `var`, no: 3, 3, 3. That one difference is the clearest reason `var` is no longer used.",
            "A JavaScript closure captures the VARIABLE. `var` is function-scoped, so a loop creates ONE variable that every closure shares — and by the time they run, the loop has finished.",
            "`let` is block-scoped, and a `for` loop with `let` creates a NEW binding on every iteration. Each closure captures its own, so each sees the value it was created with.",
            "That per-iteration binding is a specific rule for `for` loops, added precisely because the `var` behaviour caused so many bugs. Before `let`, the fix was an immediately-invoked function wrapping each iteration.",
            "Closures are used far more heavily here than in most languages. They are how a module keeps private state, how React hooks remember values between renders, and how every callback reaches the data it needs.",
            "The cost worth knowing is memory. A closure keeps its captured variables alive for as long as the closure itself is reachable — so a handler capturing a large object keeps that object from being collected until the handler is removed.",
            "That is the mechanism behind most JavaScript memory leaks: not a missing free, but a listener nobody removed, holding a closure, holding everything it captured.",
          ],
          predict: {
            ask: "What does each loop print?",
            code: `const a = [], b = [];

for (var i = 0; i < 3; i++) a.push(() => i);
for (let j = 0; j < 3; j++) b.push(() => j);

console.log(a.map(f => f()), b.map(f => f()));`,
            choices: [
              { text: "[0,1,2] and [0,1,2]", why: "var is function-scoped, so all three closures in the first loop share one variable." },
              { text: "[3,3,3] and [0,1,2]", why: "Correct. var creates ONE i for the whole function, left at 3 when the loop ends. let creates a new binding per iteration, so each closure captured its own j." },
              { text: "[2,2,2] and [0,1,2]", why: "The loop exits when i reaches 3, and that is the value left in the shared variable — not 2." },
              { text: "[3,3,3] and [3,3,3]", why: "let's per-iteration binding is exactly what stops the second loop behaving like the first." },
            ],
            answer: 1,
          },
          example: `// var is function-scoped — ONE variable, shared
const a = [];
for (var i = 0; i < 3; i++) a.push(() => i);
a.map(f => f());              // [3, 3, 3]

// let is block-scoped, and a for loop rebinds it each iteration
const b = [];
for (let j = 0; j < 3; j++) b.push(() => j);
b.map(f => f());              // [0, 1, 2]

// before let, the fix was a wrapping function per iteration
for (var k = 0; k < 3; k++) {
  (function (k) { a.push(() => k); })(k);
}

// closures are how private state works
function makeCounter() {
  let count = 0;              // unreachable from outside
  return {
    bump: () => ++count,
    get: () => count,
  };
}

// and how React hooks remember between renders
// const [n, setN] = useState(0);

// the cost: a closure keeps its captures ALIVE
function attach(el) {
  const big = new Array(1e6);
  el.addEventListener("click", () => console.log(big.length));
  // big cannot be collected until the listener is removed
}
// this is the mechanism behind most JavaScript memory leaks`,
          notes: [
            { token: "var", meaning: "function-scoped. One variable, shared by every closure" },
            { token: "let in a for loop", meaning: "a new binding each iteration. The fix" },
            { token: "private state", meaning: "a closure over a local nothing outside can reach" },
            { token: "keeps captures alive", meaning: "the mechanism behind most JS leaks" },
          ],
          prompt:
            "Fix the loop so each stored function returns its own value.",
          starter: `const fns = [];
for (var i = 0; i < 3; i++) fns.push(() => i);`,
          rules: {
            regex: ["for\\s*\\(\\s*let\\s+i\\s*=\\s*0"],
            mustNot: ["for (var i"],
            hint: "Change var to let — a for loop with let gets a fresh binding each iteration.",
            success:
              "Correct, and it is worth knowing this is a special rule: `let` in a for loop is rebound per iteration, which is not how let behaves anywhere else. It was added specifically to fix this bug.",
          },
          solution: `const fns = [];
for (let i = 0; i < 3; i++) fns.push(() => i);`,
        },

        rust: {
          body: [
            "You get 0, 1, 2 — and the more interesting question in Rust is whether the closure compiles at all.",
            "Rust closures capture by BORROWING whatever they use, and take ownership only if they have to. The compiler works out the least it can get away with.",
            "That means the borrow checker applies to closures exactly as it does everywhere else. A closure borrowing a variable cannot outlive it, and the compiler says so rather than letting you find out at run time.",
            "So C++'s dangling-`[&]` bug does not exist here. Returning a closure that borrowed a local is a compile error naming both the closure and the local.",
            "`move` forces ownership: `move |x| x + n` takes n INTO the closure. That is what you need to return a closure, to send one to another thread, or to store one beyond the current scope.",
            "The three traits from the previous section are decided by this. Only reading captures gives you `Fn`; mutating one gives `FnMut`; consuming one gives `FnOnce`.",
            "For the loop case, `move` and the iteration variable being fresh each time mean each closure captures its own copy — so the trap simply does not arise.",
            "One practical note: `move` moves EVERYTHING the closure uses, not just the one thing you had in mind. When that is too much, clone what you need into a local first and let the closure move the clone.",
          ],
          predict: {
            ask: "Why does this fail to compile?",
            code: `fn make() -> impl Fn() -> i32 {
    let n = 42;
    || n
}`,
            choices: [
              { text: "The closure needs explicit types", why: "The types are inferred fine. The problem is what the closure captured and how long that lives." },
              { text: "The closure borrows n, and n dies when make returns", why: "Correct. Without move the closure borrows n, and the compiler rejects returning something that outlives what it borrowed. Adding move makes the closure own n, and it compiles." },
              { text: "impl Fn cannot be a return type", why: "impl Trait as a return type is the standard way to return a closure." },
              { text: "n must be mutable", why: "The closure only reads n, so no mutability is needed. Ownership is the issue." },
            ],
            answer: 1,
          },
          example: `let n = 10;

// captures by BORROWING what it uses — the least it can
let read = || n;
println!("{} {}", read(), n);      // both fine, it only borrowed

// mutating a capture needs the closure itself to be mut
let mut count = 0;
let mut bump = || count += 1;      // FnMut
bump();
bump();
// println!("{}", count);          // not until bump is done with it

// move takes OWNERSHIP into the closure
let s = String::from("hi");
let owns = move || s.len();
// println!("{}", s);              // s was moved into the closure

// which is what returning a closure requires
fn make_adder(n: i32) -> impl Fn(i32) -> i32 {
    move |x| x + n                 // without move: n dies, compile error
}

// and what sending one to a thread requires
let data = vec![1, 2, 3];
std::thread::spawn(move || println!("{:?}", data));

// the loop trap does not arise — each iteration's value is its own
let fns: Vec<Box<dyn Fn() -> i32>> =
    (0..3).map(|i| Box::new(move || i) as Box<dyn Fn() -> i32>).collect();

// move takes EVERYTHING it uses. Clone first when that is too much
let name = user.name.clone();
std::thread::spawn(move || println!("{}", name));   // user stays put`,
          notes: [
            { token: "borrows by default", meaning: "the compiler takes the least it can" },
            { token: "move", meaning: "take ownership. Required to return or to send a closure" },
            { token: "the borrow checker applies", meaning: "so C++'s dangling [&] bug cannot compile" },
            { token: "move takes everything", meaning: "clone what you need first when that is too much" },
          ],
          prompt:
            "Fix make_adder so the returned closure owns n.",
          starter: `fn make_adder(n: i32) -> impl Fn(i32) -> i32 {
    |x| x + n
}`,
          rules: {
            regex: ["move\\s*\\|\\s*x\\s*\\|\\s*x\\s*\\+\\s*n"],
            hint: "move |x| x + n",
            success:
              "Correct. i32 is Copy, so move copies it rather than taking it away — n is still usable afterwards. For a String it genuinely would be moved, and that difference catches people once.",
          },
          solution: `fn make_adder(n: i32) -> impl Fn(i32) -> i32 {
    move |x| x + n
}`,
        },
      },
    },

    /* ------------------------------------------------------ immutable -- */
    {
      id: "immutable",
      kicker: "03",
      title: "Leaving data alone",
      hook:
        "A function you called sorted the list you passed it. Nothing said it would. How long does it take to find that?",
      body: [
        "Longer than you would like, because nothing broke at the call — something broke later, somewhere that assumed the original order.",
        "That is the case for immutability, and it is practical rather than ideological. A change made in one place is invisibly a change made everywhere the data is shared.",
        "C++ gives you the strongest tool of the six for this, and it is one word: `const`.",
        "`const` on a parameter says the function will not modify it, and the compiler enforces it. `const` on a method says the method does not modify the object. Both are checked, not documented.",
        "The advice is to make const the default and remove it where you must. A `const vector<int>&` parameter tells every caller, permanently, that their data is safe — and it costs nothing.",
        "There is a subtlety worth knowing: `const` is shallow. A `const` pointer member still points at something modifiable, so `const` on a class holding raw pointers promises less than it appears to.",
        "For the functional style, prefer methods that RETURN a new value over ones that modify. The standard library is inconsistent here — `sort` mutates, `views::` produce new sequences — so read which you are calling.",
      ],
      predict: {
        ask: "Which of these lines does not compile?",
        code: `struct P {
  int age;
  int get() const { return age; }
  void bump() { age++; }
};

void f(const P& p) {
  p.get();      // A
  p.bump();     // B
}`,
        choices: [
          { text: "Neither — both are reads", why: "bump modifies the object, and p is a reference to a const P." },
          { text: "B — bump is not const, so it cannot be called on a const P", why: "Correct. p is a const reference, so only methods marked const may be called on it. That is the compiler enforcing the promise the parameter made." },
          { text: "A — get needs to be static", why: "get is marked const, which is exactly what allows it to be called here." },
          { text: "Both, because P has no constructor", why: "The default constructor is generated, and neither line depends on construction." },
        ],
        answer: 1,
      },
      viz: traceImmutable(),
      example: `// const on a parameter: the compiler enforces the promise
int total(const vector<int>& v);        // cannot modify v

// const on a method: this does not modify the object
struct P {
  int age;
  int get() const { return age; }       // callable on a const P
  void bump() { age++; }                // not
};

// make const the default and remove it where you must
const int limit = 100;
constexpr int size = 64;                // known at COMPILE time

// const is SHALLOW — this still points at something modifiable
struct Holder { int* data; };
const Holder h{ptr};
*h.data = 5;                            // legal

// prefer returning a new value over modifying in place
vector<int> sorted(vector<int> v) {     // by value: our own copy
  sort(v.begin(), v.end());
  return v;                             // moved out, not copied
}

// the standard library is inconsistent — read which you are calling
sort(v.begin(), v.end());               // MODIFIES v
auto r = v | views::filter(even);       // a new view, lazily

// mutate locally, where nobody can see it. That is not the problem
vector<int> build() {
  vector<int> out;
  for (int i = 0; i < 10; i++) out.push_back(i);   // fine
  return out;
}`,
      notes: [
        { token: "const T&", meaning: "no copy, no changes. The right default for a parameter" },
        { token: "int get() const", meaning: "this method does not modify the object" },
        { token: "constexpr", meaning: "known at compile time, not merely unchanging" },
        { token: "const is shallow", meaning: "a const pointer still points at something modifiable" },
      ],
      challenge: {
        prompt:
          "Write total so it cannot modify or copy the caller's vector, and mark the method that only reads.",
        starter: `int total( v);

struct P {
  int age;
  int get()  { return age; }
};`,
        rules: {
          regex: ["int\\s+total\\s*\\(\\s*const\\s+vector\\s*<\\s*int\\s*>\\s*&\\s*v\\s*\\)", "int\\s+get\\s*\\(\\s*\\)\\s*const"],
          hint: "const vector<int>& v for the parameter, and int get() const for the method.",
          success:
            "Correct. The two consts do different jobs: one promises not to change the ARGUMENT, the other promises not to change the OBJECT the method is called on.",
        },
        solution: `int total(const vector<int>& v);

struct P {
  int age;
  int get() const { return age; }
};`,
      },

      alt: {
        c: {
          body: [
            "Longer than you would like, because nothing broke at the call — something broke later, somewhere that assumed the original contents.",
            "C's one tool for this is `const`, and it is weaker than C++'s but still worth using everywhere it applies.",
            "`void f(const int *a, int n)` says f will not write through a. The compiler enforces it, so a stray assignment is caught at build time.",
            "Where the star goes matters and catches everyone. `const int *p` means the THING is const — you cannot write `*p = 5`. `int * const p` means the POINTER is const — you cannot repoint it. `const int * const p` is both.",
            "Read it right to left from the star: 'p is a const pointer to a const int'.",
            "`const` in C is a promise the compiler checks, not a guarantee about memory. Casting it away is legal and compiles, and writing through the result is undefined behaviour if the object really was const.",
            "For actual immutability, string literals are the everyday case: `char *s = \"hi\"` compiles and writing through s is undefined. Declare them `const char *`, always.",
            "And `#define` versus `const`: a define is a text substitution with no type, while a const has a type the compiler can check. Prefer const for values, and reserve defines for conditional compilation.",
          ],
          predict: {
            ask: "Which assignment is rejected?",
            code: `int x = 1, y = 2;

const int *a = &x;
int * const b = &x;

*a = 5;      // A
a = &y;      // B
*b = 5;      // C
b = &y;      // D`,
            choices: [
              { text: "A and C", why: "b is a const pointer to a non-const int, so writing through it is fine." },
              { text: "A and D", why: "Correct. `const int *a` makes the pointed-at int const, so *a = 5 is rejected while repointing a is fine. `int * const b` makes the POINTER const, so b = &y is rejected while *b = 5 is fine." },
              { text: "All four", why: "Each declaration constrains exactly one of the two things, so two of the four assignments are legal." },
              { text: "B and C", why: "It is the other way round: a can be repointed and b can be written through." },
            ],
            answer: 1,
          },
          example: `/* const on a parameter: the compiler enforces it */
int total(const int *a, int n);       /* will not write through a */

/* where the star goes. Read right to left from it */
const int *p;             /* pointer to a const int  — *p = 5 rejected */
int * const q = &x;       /* const pointer to an int — q = &y rejected */
const int * const r = &x; /* both                                      */

/* string literals are the everyday case */
const char *s = "hi";     /* do this */
/* char *bad = "hi";  writing through bad is undefined behaviour */

/* const is a checked promise, not a memory guarantee.
   Casting it away compiles, and writing through it is undefined */
int *cheat = (int *)p;    /* legal, and a bad idea */

/* prefer const to #define for values — a const has a TYPE */
const int LIMIT = 100;    /* checked */
#define LIMIT2 100        /* text substitution, no type */

/* return a new value rather than modifying the argument */
int *sorted_copy(const int *a, int n) {
  int *out = malloc(n * sizeof *out);
  if (!out) return NULL;
  memcpy(out, a, n * sizeof *out);
  qsort(out, n, sizeof *out, cmp);
  return out;             /* caller frees */
}`,
          notes: [
            { token: "const int *p", meaning: "the THING is const. *p = 5 is rejected" },
            { token: "int * const p", meaning: "the POINTER is const. p = &y is rejected" },
            { token: "const char *", meaning: "how a string literal should always be declared" },
            { token: "const over #define", meaning: "a const has a type the compiler can check" },
          ],
          prompt:
            "Declare total so it promises not to write through the array, and declare the literal correctly.",
          starter: `int total( a, int n);

 s = "hi";`,
          rules: {
            regex: ["total\\s*\\(\\s*const\\s+int\\s*\\*\\s*a\\s*,\\s*int\\s+n\\s*\\)", "const\\s+char\\s*\\*\\s*s\\s*=\\s*\"hi\""],
            hint: "const int *a for the parameter, and const char *s for the literal.",
            success:
              "Correct. The const on the literal is not pedantry: writing through a non-const pointer to a string literal is undefined behaviour, and on most systems it segfaults.",
          },
          solution: `int total(const int *a, int n);

const char *s = "hi";`,
        },

        python: {
          body: [
            "Longer than you would like, because nothing broke at the call — something broke later, somewhere that assumed the original order.",
            "Python has no `const` and no way to mark a parameter as read-only. What it has is a set of immutable types, and a strong convention.",
            "Immutable: `int`, `float`, `str`, `tuple`, `frozenset`, `bytes`. Mutable: `list`, `dict`, `set`, and most objects.",
            "That split is why strings and tuples can be dict keys and lists cannot — a key that could change would be lost, because the dict would look for it in the wrong slot.",
            "The convention that matters most: a function should not modify what it was given unless its name says so. `sorted(items)` returns a new list; `items.sort()` modifies. `reversed`, `sorted` and the comprehensions all build new values.",
            "When you need a snapshot, take one explicitly — `items[:]`, `dict(d)`, `tuple(items)`. And when a function must not modify its argument at all, taking a tuple rather than a list makes it impossible.",
            "For objects, `@dataclass(frozen=True)` makes instances read-only: assigning a field raises, and the class gets a working `__hash__` so it can go in a set. That is as close to const as Python gets, and it is genuinely useful.",
            "`types.MappingProxyType(d)` gives a read-only VIEW of a dict, which is the right thing to hand out when you want callers to read your state without being able to change it.",
          ],
          predict: {
            ask: "What does this print?",
            code: `from dataclasses import dataclass

@dataclass(frozen=True)
class P:
    tags: list

p = P(tags=[])
p.tags.append("x")

print(p.tags)`,
            choices: [
              { text: "FrozenInstanceError", why: "Nothing is being assigned to a field — the list itself is being modified, which frozen does not prevent." },
              { text: "['x'] — frozen stops reassigning the field, not modifying the list", why: "Correct. frozen=True rejects `p.tags = [...]` but the list it points at is still an ordinary mutable list. Frozen is shallow, exactly like C++'s const on a pointer member." },
              { text: "[] — the append was ignored", why: "The append works normally on the underlying list." },
              { text: "It will not construct with a list field", why: "It constructs fine, though the class is then unhashable — which is a hint that a tuple would have been the better field type." },
            ],
            answer: 1,
          },
          example: `# immutable: int, float, str, tuple, frozenset, bytes
# mutable:   list, dict, set, most objects

# which is why these can be dict keys and lists cannot
d = {(1, 2): "a"}
# d[[1, 2]] = "b"          # TypeError: unhashable

# the convention: the name says whether it modifies
items.sort()                 # modifies
new = sorted(items)          # returns a new list
new = list(reversed(items))
new = [x * 2 for x in items]

# take a snapshot explicitly
snapshot = items[:]
snapshot = dict(config)
frozen = tuple(items)        # now it cannot be modified at all

# read-only objects
from dataclasses import dataclass

@dataclass(frozen=True)
class Point:
    x: int
    y: int

p = Point(1, 2)
# p.x = 5                    # FrozenInstanceError
{p}                          # hashable, so it works in a set

# frozen is SHALLOW — a list field is still mutable.
# Use a tuple for the field if that matters

# a read-only VIEW of a dict, for handing out state
from types import MappingProxyType
public = MappingProxyType(self._config)`,
          notes: [
            { token: "immutable types", meaning: "int, str, tuple, frozenset. Safe to share" },
            { token: "sorted vs .sort()", meaning: "the name says whether it modifies" },
            { token: "@dataclass(frozen=True)", meaning: "read-only fields, and a working hash" },
            { token: "MappingProxyType", meaning: "a read-only view of a dict you own" },
          ],
          prompt:
            "Make Point read-only and hashable in one decorator.",
          starter: `from dataclasses import dataclass

@dataclass()
class Point:
    x: int
    y: int`,
          rules: {
            regex: ["@dataclass\\s*\\(\\s*frozen\\s*=\\s*True\\s*\\)"],
            hint: "@dataclass(frozen=True)",
            success:
              "Correct, and the hashability follows from it: a normal dataclass defines __eq__ and therefore has no __hash__, while a frozen one can safely have both — so it works as a dict key and in a set.",
          },
          solution: `from dataclasses import dataclass

@dataclass(frozen=True)
class Point:
    x: int
    y: int`,
        },

        java: {
          body: [
            "Longer than you would like, because nothing broke at the call — something broke later, somewhere that assumed the original order.",
            "Java's `final` is weaker than it looks, and knowing exactly what it promises saves a lot of confusion.",
            "`final` on a variable means the REFERENCE cannot be repointed. It says nothing about the object. `final List<String> list` can still have items added to it all day.",
            "So `final` is not const. It is Java's version of 'this name is assigned once', which is genuinely useful and is not a guarantee about data.",
            "For real immutability you make the CLASS immutable: all fields final, no setters, and defensive copies of anything mutable both coming in and going out.",
            "That last part is the one people miss. If a constructor stores the caller's List directly, the caller still holds a reference to it and can modify your object's state afterwards.",
            "A `record` gives you final fields, a constructor, equals, hashCode and toString — but it does NOT copy mutable components. A record holding a List is still modifiable through that list, so copy in the compact constructor.",
            "For collections, `List.of(...)` and `Map.of(...)` produce genuinely immutable ones that throw on any modification. `List.copyOf(existing)` makes an immutable snapshot, which is the right thing to return from a getter.",
          ],
          predict: {
            ask: "What does this print?",
            code: `record Team(String name, List<String> members) {}

List<String> m = new ArrayList<>(List.of("ada"));
Team t = new Team("A", m);

m.add("bob");

System.out.println(t.members());`,
            choices: [
              { text: "[ada] — a record copies its components", why: "A record stores the reference it was given. It does not copy anything." },
              { text: "[ada, bob] — the record kept the caller's list", why: "Correct. The record holds the same List object the caller still has, so modifying it through m changes what the record reports. Copy in a compact constructor: `members = List.copyOf(members);`" },
              { text: "UnsupportedOperationException", why: "m is an ArrayList built from List.of, so it is modifiable — only the List.of result itself would throw." },
              { text: "It will not compile — records need immutable components", why: "Records accept any component type. Enforcing immutability is left to you." },
            ],
            answer: 1,
          },
          example: `// final constrains the REFERENCE, not the object
final List<String> list = new ArrayList<>();
list.add("x");                 // legal
// list = other;               // not

// a genuinely immutable class
public final class Point {
  private final int x, y;
  public Point(int x, int y) { this.x = x; this.y = y; }
  public int x() { return x; }
  // no setters, and the class is final so nobody subclasses it
}

// records give you most of that — but do NOT copy components
record Team(String name, List<String> members) {
  Team {                                  // compact constructor
    members = List.copyOf(members);       // copy IN
  }
}

// and copy OUT of getters that expose mutable state
public List<String> getMembers() {
  return List.copyOf(members);
}

// genuinely immutable collections — they THROW on modification
List<String> fixed = List.of("a", "b");
Map<String,Integer> m = Map.of("a", 1);
List<String> snapshot = List.copyOf(existing);

// Arrays.asList is fixed-SIZE, not immutable. set() works, add() throws

// and String is immutable, which is why it is safe to share freely`,
          notes: [
            { token: "final", meaning: "the reference is fixed. The object is not" },
            { token: "defensive copies", meaning: "copy mutable state coming IN and going OUT" },
            { token: "a record", meaning: "final fields, and it does not copy components for you" },
            { token: "List.of / List.copyOf", meaning: "genuinely immutable. They throw on modification" },
          ],
          prompt:
            "Make the record copy its list so a caller cannot change the team afterwards.",
          starter: `record Team(String name, List<String> members) {
  Team {
    members = ;
  }
}`,
          rules: {
            regex: ["members\\s*=\\s*List\\.copyOf\\s*\\(\\s*members\\s*\\)"],
            hint: "members = List.copyOf(members); inside the compact constructor.",
            success:
              "Correct. List.copyOf does both jobs at once: it takes a snapshot, so the caller's later changes are invisible, and the copy is immutable, so nothing can change it through the record either.",
          },
          solution: `record Team(String name, List<String> members) {
  Team {
    members = List.copyOf(members);
  }
}`,
        },

        javascript: {
          body: [
            "Longer than you would like, because nothing broke at the call — something broke later, somewhere that assumed the original order.",
            "JavaScript's `const` is the weakest promise of the six, and everybody misreads it at first. It means the BINDING cannot be reassigned. It says nothing at all about the value.",
            "`const arr = []` then `arr.push(1)` is completely legal. Only `arr = []` is rejected.",
            "`Object.freeze(obj)` genuinely prevents modification — but only one level deep. A frozen object with a nested object leaves the nested one fully modifiable, so a deep freeze needs recursion.",
            "In practice, modern JavaScript relies on convention plus non-destructive operations. `[...arr, x]` adds, `{...obj, key: v}` updates, `arr.toSorted()` sorts, `arr.filter(...)` removes — all returning new values.",
            "That spread-to-update pattern is everywhere in React and Redux, and it is there for a specific reason: those systems detect change by comparing references, so modifying an object in place is invisible to them.",
            "The cost is real for large data — spreading a big array on every update is O(n) each time. Libraries like Immer let you write mutating-looking code and produce a structurally shared immutable result, which is the persistent-data-structure idea from the diagram.",
            "One more piece: `structuredClone(obj)` is the built-in deep copy now, and it handles cycles, Dates, Maps and Sets that the old `JSON.parse(JSON.stringify(x))` trick silently destroys.",
          ],
          predict: {
            ask: "What does this print?",
            code: `const config = Object.freeze({
  name: "app",
  db: { host: "localhost" },
});

config.name = "other";
config.db.host = "remote";

console.log(config.name, config.db.host);`,
            choices: [
              { text: "other remote", why: "The top-level assignment on a frozen object is ignored in sloppy mode, so name does not change." },
              { text: "app remote", why: "Correct. freeze is SHALLOW: the top-level name is protected, but config.db is an ordinary object that was never frozen, so its host changes freely. A deep freeze has to recurse." },
              { text: "app localhost", why: "Nothing froze the nested db object, so writing to it succeeds." },
              { text: "It throws on the first assignment", why: "In sloppy mode the assignment fails silently. In strict mode — including inside modules — it throws, which is one reason to prefer strict." },
            ],
            answer: 1,
          },
          example: `// const fixes the BINDING, not the value
const arr = [];
arr.push(1);                  // legal
// arr = [];                  // not

// freeze genuinely prevents modification — one level deep
const config = Object.freeze({ name: "app", db: { host: "x" } });
config.name = "other";        // ignored (or throws in strict mode)
config.db.host = "y";         // works — db was never frozen

// a deep freeze has to recurse
function deepFreeze(o) {
  for (const v of Object.values(o))
    if (v && typeof v === "object") deepFreeze(v);
  return Object.freeze(o);
}

// the everyday pattern: build a new value
const added   = [...arr, 4];
const removed = arr.filter(x => x !== 2);
const updated = arr.map(x => x === 2 ? 20 : x);
const sorted  = arr.toSorted((a, b) => a - b);

const next = { ...state, count: state.count + 1 };
const deep = { ...state, user: { ...state.user, name: "Ada" } };

// React and Redux detect change by comparing REFERENCES,
// so modifying in place is invisible to them

// a real deep copy, cycles and Dates included
const copy = structuredClone(config);

// for large structures, Immer gives structural sharing`,
          notes: [
            { token: "const", meaning: "the binding is fixed. The value is not" },
            { token: "Object.freeze", meaning: "real, and shallow. Deep freezing must recurse" },
            { token: "{...state, key: v}", meaning: "the update pattern React and Redux rely on" },
            { token: "structuredClone", meaning: "a real deep copy. Handles cycles and Dates" },
          ],
          prompt:
            "Update one field without modifying the original state object.",
          starter: `const next = ;`,
          rules: {
            regex: ["\\{\\s*\\.\\.\\.\\s*state\\s*,\\s*count\\s*:\\s*state\\.count\\s*\\+\\s*1\\s*\\}"],
            hint: "{ ...state, count: state.count + 1 } — spread the old, then override the one field.",
            success:
              "Correct, and order matters: the spread has to come FIRST. Putting count before the spread would have the old value overwrite your new one, which is a genuinely easy mistake to make.",
          },
          solution: `const next = { ...state, count: state.count + 1 };`,
        },

        rust: {
          body: [
            "It could not have happened. In Rust a function that modifies what you passed it has to say so, at the call site as well as in the signature.",
            "Everything is immutable by default. `let x = 5;` cannot be changed; you need `let mut x = 5;` to make it so.",
            "That default is unusual and it changes how code reads: `mut` stands out, so anything that can change is visible at a glance.",
            "For parameters, the same rule appears as `&T` versus `&mut T`, and the caller must write `&mut` too. So `sort_in_place(&mut v)` is visibly different from `sorted(&v)` at every call.",
            "The borrow checker then enforces the guarantee that makes this stronger than `const`: while a `&mut` borrow exists, no other reference to that value may exist at all.",
            "So you cannot have one part of the program holding a read-only reference while another modifies through a mutable one. That is what rules out data races entirely, and it is checked at compile time.",
            "For constants there are two words. `const` is inlined wherever it is used and must be computable at compile time. `static` has a single fixed memory location and lives for the whole program.",
            "And `Cow` — clone on write — is the type for 'usually borrowed, occasionally owned'. It avoids a copy in the common case and makes one only when something actually needs to change.",
          ],
          predict: {
            ask: "Why does this fail to compile?",
            code: `let mut v = vec![1, 2, 3];

let first = &v[0];
v.push(4);

println!("{}", first);`,
            choices: [
              { text: "push needs the vector to be mutable, and it is not", why: "v is declared mut, so push is allowed. The conflict is between the two borrows." },
              { text: "An immutable borrow is still alive when push takes a mutable one", why: "Correct. first borrows v immutably and is used after the push, and push needs a mutable borrow. Rust allows many readers OR one writer, never both — which is exactly what rules out data races." },
              { text: "first must be declared mut", why: "first is only read. Its own mutability is irrelevant to the conflict." },
              { text: "Vec cannot be indexed while borrowed", why: "Indexing is fine. The overlapping borrows are the problem." },
            ],
            answer: 1,
          },
          example: `// immutable by DEFAULT — mut is the exception, and it shows
let x = 5;
// x = 6;                      // does not compile
let mut y = 5;
y = 6;                         // fine

// the same at a boundary, and the caller says it too
fn total(v: &[i32]) -> i32 { v.iter().sum() }
fn sort_it(v: &mut Vec<i32>) { v.sort(); }

total(&v);
sort_it(&mut v);               // visible at the CALL site

// many readers OR one writer. Never both
let r1 = &v;
let r2 = &v;                   // fine — both read
// let w = &mut v;             // not while r1 and r2 are alive

// which is what makes data races impossible, at compile time

// two kinds of constant
const LIMIT: i32 = 100;        // inlined wherever used
static NAME: &str = "app";     // one fixed location, whole program

// interior mutability, when the rules are too strict:
// Cell and RefCell move the check to RUN time
use std::cell::RefCell;
let counter = RefCell::new(0);
*counter.borrow_mut() += 1;    // panics if the rule is broken

// Cow — borrowed usually, owned only when something changes
use std::borrow::Cow;
fn clean(s: &str) -> Cow<str> {
    if s.contains(' ') { Cow::Owned(s.replace(' ', "_")) }
    else { Cow::Borrowed(s) }  // no allocation in the common case
}`,
          notes: [
            { token: "immutable by default", meaning: "mut is the exception, so change is visible" },
            { token: "&T vs &mut T", meaning: "and the caller writes &mut too" },
            { token: "many readers or one writer", meaning: "checked at compile time. No data races" },
            { token: "Cow", meaning: "borrowed usually, owned only when something changes" },
          ],
          prompt:
            "Write the two functions so one only reads and the other may modify.",
          starter: `fn total(v: ) -> i32 { v.iter().sum() }

fn sort_it(v: ) { v.sort(); }`,
          rules: {
            regex: ["fn\\s+total\\s*\\(\\s*v\\s*:\\s*&\\s*\\[\\s*i32\\s*\\]\\s*\\)", "fn\\s+sort_it\\s*\\(\\s*v\\s*:\\s*&\\s*mut\\s+Vec\\s*<\\s*i32\\s*>\\s*\\)"],
            hint: "&[i32] for the read-only one, and &mut Vec<i32> for the one that sorts.",
            success:
              "Correct, and note why sort_it needs Vec rather than a slice: sorting works on a slice too, so &mut [i32] would also compile — Vec is only required when the function needs to change the LENGTH.",
          },
          solution: `fn total(v: &[i32]) -> i32 { v.iter().sum() }

fn sort_it(v: &mut Vec<i32>) { v.sort(); }`,
        },
      },
    },
  ],
};
