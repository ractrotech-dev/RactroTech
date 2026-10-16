import type { TopicLesson } from "@/lib/dsa/lessons/types";
import { traceArgModels, traceCallFrames, traceMultiReturn } from "@/lib/dsa/viz/traceLang";

// Language track, topic 3.
//
// Section 2 is the important one: what actually crosses the boundary. It is the
// source of "why did my list change?" in three of these languages, and the
// reason Rust's ownership rules exist at all.

export const LANG_FUNCTIONS: TopicLesson = {
  id: "lang-functions",
  title: "Functions",
  tagline: "Naming a piece of work, and what crosses the boundary.",
  why:
    "A function is how a program stops being one long list of instructions. But the interesting part is not the syntax — it is what happens to the values you hand over. Three of these languages will let a function quietly change your data, one will not let you write that mistake at all, and knowing which you are in explains a whole category of bug.",
  plain: [
    "A function is a piece of work with a name. You describe it once and use it wherever you need it.",
    "It takes inputs, called parameters, and usually hands one value back.",
    "While it runs, the caller waits. When it finishes, everything it made locally is thrown away and only the returned value survives.",
  ],
  needs: ["Values and variables from Fundamentals.", "Conditions and loops from Control Flow."],
  traps: [
    "A function that changes a list you passed in changes YOUR list, in Python, Java and JavaScript. Numbers are safe; containers and objects are not.",
    "Reassigning a parameter inside a function never affects the caller's variable, even in languages that share objects. You can change what it points at, not where the caller's name points.",
    "Every paused call takes memory. Recursion with no base case fills the call stack and the program dies.",
    "Returning a reference or pointer to a local variable is a serious bug in C and C++: the local is gone the moment the function returns.",
  ],
  sections: [
    /* ----------------------------------------------------------- name -- */
    {
      id: "declare",
      kicker: "01",
      title: "Naming a piece of work",
      hook:
        "A function doubles the number you give it. You pass n, which is 5. Afterwards you print n. Is it 5 or 10?",
      body: [
        "5. The function got a COPY of the value, worked on that, and its copy disappeared when the call ended.",
        "That is what a call does: it makes a fresh set of boxes for the function, runs it, hands one value back, and throws the boxes away.",
        "While the function runs, the caller is paused at exactly the line that called it. Nothing after that line happens until the function returns.",
        "`return` does two things at once: it hands a value back, and it ends the function immediately. Anything below it does not run — which is why `if (x) return a; return b;` needs no else.",
        "In C++ you write the return type first, then the name, then what it needs. `int twice(int x)` reads as: give me an int called x, and I will give you back an int.",
        "Those paused calls stack up, and that stack has a limit. Recursion with no base case fills it and the program dies — which is exactly what a stack overflow is.",
      ],
      predict: {
        ask: "What does this C++ code print?",
        code: `int twice(int x) {
  x = x * 2;
  return x;
}

int n = 5;
int r = twice(n);
cout << n << " " << r;`,
        choices: [
          { text: "10 10", why: "That would mean the function reached back into n. It got a copy, so n was never touched." },
          { text: "5 10", why: "Correct. x is a separate box holding a copy of 5. Doubling it changes only the copy; n stays 5, and the returned 10 goes into r." },
          { text: "5 5", why: "The function does return x after doubling it, so r gets 10." },
          { text: "Will not compile", why: "Reassigning a parameter is perfectly legal — it is a normal local variable inside the function." },
        ],
        answer: 1,
      },
      viz: traceCallFrames(),
      example: `int twice(int x) {          // takes an int, gives back an int
  return x * 2;
}

void greet(string name) {   // void = gives nothing back
  cout << "Hello, " << name;
}

int maxOf(int a, int b) {
  if (a > b) return a;      // return ends the function here
  return b;                 // so no else is needed
}

int r = twice(5);           // 10`,
      notes: [
        { token: "int twice(...)", meaning: "the type it hands back comes first" },
        { token: "void", meaning: "hands nothing back" },
        { token: "return", meaning: "gives a value AND ends the function on the spot" },
        { token: "(int x)", meaning: "a fresh local box, holding a copy of what was passed" },
      ],
      challenge: {
        prompt:
          "Write a function isEven that takes an int and returns true when it is even. Then call it with 7.",
        starter: ` isEven(int n) {
  return ;
}

int main() {
  cout << isEven();
}`,
        rules: {
          regex: ["bool\\s+isEven\\s*\\(\\s*int\\s+n\\s*\\)", "n\\s*%\\s*2\\s*==\\s*0", "isEven\\s*\\(\\s*7\\s*\\)"],
          hint: "It answers yes or no, so the return type is bool. Return n % 2 == 0 directly — no if needed.",
          success:
            "Correct. `return n % 2 == 0;` is better than an if/else returning true and false: the comparison already IS a bool, so wrapping it adds nothing.",
        },
        solution: `bool isEven(int n) {
  return n % 2 == 0;
}

int main() {
  cout << isEven(7);
}`,
      },

      alt: {
        c: {
          example: `int twice(int x) {          /* takes an int, gives back an int */
  return x * 2;
}

void greet(char *name) {    /* void = gives nothing back */
  printf("Hello, %s", name);
}

/* C needs to know about a function BEFORE you call it */
int twice(int x);           /* a prototype, usually in a header */

int r = twice(5);           /* 10 */`,
          notes: [
            { token: "int twice(...)", meaning: "the type it hands back comes first" },
            { token: "void", meaning: "hands nothing back" },
            { token: "a prototype", meaning: "C reads top to bottom — declare it before you use it" },
            { token: "void f()", meaning: "means unspecified arguments in old C. Write void f(void)" },
          ],
          prompt:
            "Write a function isEven that takes an int and returns 1 when it is even, 0 when it is not. Then call it with 7.",
          starter: ` isEven(int n) {
  return ;
}

int main(void) {
  printf("%d", isEven());
  return 0;
}`,
          rules: {
            regex: ["int\\s+isEven\\s*\\(\\s*int\\s+n\\s*\\)", "n\\s*%\\s*2\\s*==\\s*0", "isEven\\s*\\(\\s*7\\s*\\)"],
            hint: "C has no bool without stdbool.h, so return an int. n % 2 == 0 already gives 1 or 0.",
            success:
              "Correct. C has no bool built in — a comparison produces the int 1 or 0, which is exactly what you return here. #include <stdbool.h> if you want the word.",
          },
          solution: `int isEven(int n) {
  return n % 2 == 0;
}

int main(void) {
  printf("%d", isEven(7));
  return 0;
}`,
        },

        python: {
          body: [
            "5. The function got the value, worked on a name of its own, and that name disappeared when the call ended.",
            "That is what a call does: it makes a fresh set of names for the function, runs it, hands one value back, and throws the names away.",
            "While the function runs, the caller is paused at exactly the line that called it.",
            "`return` hands a value back and ends the function immediately. A function with no return at all hands back None — which is easy to do by accident, and then None turns up somewhere confusing much later.",
            "Python declares nothing: no return type, no parameter types. You can add type hints — `def twice(x: int) -> int:` — and they are documentation only. Nothing checks them at run time; a separate tool like mypy does that if you want it.",
            "Python's call stack is limited to about 1000 frames by default, which is far shallower than the other languages here. Deep recursion hits it long before memory runs out.",
          ],
          predict: {
            ask: "What does this Python code print?",
            code: `def add(a, b):
    total = a + b

result = add(2, 3)
print(result)`,
            choices: [
              { text: "5", why: "total is worked out, but nothing hands it back. The function computes and then discards it." },
              { text: "None", why: "Correct. There is no return statement, so the function hands back None. This is one of the most common Python slips, and the None usually causes an error somewhere else entirely." },
              { text: "0", why: "Python does not default a missing return to zero. The default is None." },
              { text: "Nothing is printed", why: "print always prints something — here the word None." },
            ],
            answer: 1,
          },
          example: `def twice(x):
    return x * 2


def greet(name):
    print(f"Hello, {name}")     # no return — hands back None


def max_of(a, b):
    if a > b:
        return a                # return ends the function here
    return b                    # so no else is needed


# type hints are documentation. Nothing enforces them at run time
def twice_typed(x: int) -> int:
    return x * 2`,
          notes: [
            { token: "def", meaning: "defines a function. No return type to write" },
            { token: "no return", meaning: "hands back None. A very common accidental bug" },
            { token: "x: int -> int", meaning: "type hints. Documentation only unless you run mypy" },
            { token: "recursion limit", meaning: "about 1000 frames. Much shallower than the others here" },
          ],
          prompt:
            "Write a function is_even that takes a number and returns True when it is even. Then call it with 7.",
          starter: `def is_even():
    return 

print(is_even())`,
          rules: {
            regex: ["def\\s+is_even\\s*\\(\\s*n\\s*\\)", "n\\s*%\\s*2\\s*==\\s*0", "is_even\\s*\\(\\s*7\\s*\\)"],
            hint: "def is_even(n): then return n % 2 == 0 — the comparison already gives True or False.",
            success:
              "Correct. Make sure the return is there: without it Python hands back None, which is falsy, so `if is_even(4):` would silently do the wrong thing.",
          },
          solution: `def is_even(n):
    return n % 2 == 0


print(is_even(7))`,
        },

        java: {
          example: `static int twice(int x) {      // takes an int, gives back an int
  return x * 2;
}

static void greet(String name) {   // void = hands nothing back
  System.out.println("Hello, " + name);
}

// Java allows OVERLOADING — same name, different parameters
static int add(int a, int b)       { return a + b; }
static double add(double a, double b) { return a + b; }

int r = twice(5);              // 10`,
          notes: [
            { token: "static", meaning: "belongs to the class, so main can call it without an object" },
            { token: "int twice(...)", meaning: "the type it hands back comes first" },
            { token: "overloading", meaning: "same name, different parameter types. Java picks by the arguments" },
            { token: "no default arguments", meaning: "Java has none. Overloading is used instead" },
          ],
          prompt:
            "Write a method isEven that takes an int and returns true when it is even. Then call it with 7.",
          starter: `static  isEven(int n) {
  return ;
}

public static void main(String[] args) {
  System.out.println(isEven());
}`,
          rules: {
            regex: ["static\\s+boolean\\s+isEven\\s*\\(\\s*int\\s+n\\s*\\)", "n\\s*%\\s*2\\s*==\\s*0", "isEven\\s*\\(\\s*7\\s*\\)"],
            hint: "It answers yes or no, so the return type is boolean — spelled out, not bool.",
            success:
              "Correct. Java has no default arguments, so where Python writes one function with an optional parameter, Java writes two overloads with the same name.",
          },
          solution: `static boolean isEven(int n) {
  return n % 2 == 0;
}

public static void main(String[] args) {
  System.out.println(isEven(7));
}`,
        },

        javascript: {
          body: [
            "5. The function got a copy of the value, worked on that, and its copy disappeared when the call ended.",
            "That is what a call does: it makes a fresh set of boxes for the function, runs it, hands one value back, and throws the boxes away.",
            "`return` hands a value back and ends the function immediately. A function with no return hands back `undefined` — and undefined in arithmetic gives NaN, which is why a missing return often shows up as NaN somewhere far from the cause.",
            "JavaScript has several ways to write a function. `function f() {}` is the classic. `const f = () => {}` is an arrow function, which is shorter and treats `this` differently — a distinction that matters as soon as you meet objects.",
            "One thing to know early: extra arguments are ignored and missing ones become undefined. Calling a two-parameter function with five arguments is not an error, and nor is calling it with none.",
          ],
          predict: {
            ask: "What does this print?",
            code: `function add(a, b) {
  return a + b;
}

console.log(add(1, 2, 3, 4));
console.log(add(1));`,
            choices: [
              { text: "10  then  1", why: "Extra arguments are not summed — they are simply ignored. And a missing b is undefined, not 0." },
              { text: "3  then  NaN", why: "Correct. The extra 3 and 4 are dropped without complaint, and the missing b is undefined, so 1 + undefined is NaN." },
              { text: "Error  then  Error", why: "JavaScript never checks how many arguments you passed. Both calls are perfectly legal." },
              { text: "3  then  1", why: "A missing parameter is undefined, not 0, and adding undefined gives NaN rather than leaving the number alone." },
            ],
            answer: 1,
          },
          example: `function twice(x) {
  return x * 2;
}

const twiceArrow = (x) => x * 2;      // arrow form. Implicit return

function greet(name) {
  console.log(\`Hello, \${name}\`);     // no return — hands back undefined
}

// default values for missing arguments
function greetWith(name, greeting = "Hello") {
  console.log(\`\${greeting}, \${name}\`);
}`,
          notes: [
            { token: "function f()", meaning: "the classic form" },
            { token: "(x) => x * 2", meaning: "an arrow function. No braces means the value is returned" },
            { token: "no return", meaning: "hands back undefined, which becomes NaN in arithmetic" },
            { token: "greeting = \"Hello\"", meaning: "a default, used when the argument is missing" },
          ],
          prompt:
            "Write a function isEven that takes a number and returns true when it is even. Then call it with 7.",
          starter: `function isEven() {
  return ;
}

console.log(isEven());`,
          rules: {
            regex: ["function\\s+isEven\\s*\\(\\s*n\\s*\\)|isEven\\s*=\\s*\\(?\\s*n", "n\\s*%\\s*2\\s*===\\s*0", "isEven\\s*\\(\\s*7\\s*\\)"],
            hint: "function isEven(n) { return n % 2 === 0; } — three equals signs.",
            success:
              "Correct. The arrow form would be `const isEven = (n) => n % 2 === 0;` — with no braces the value is returned automatically.",
          },
          solution: `function isEven(n) {
  return n % 2 === 0;
}

console.log(isEven(7));`,
        },

        rust: {
          example: `fn twice(x: i32) -> i32 {
    x * 2                       // no semicolon — this IS the return value
}

fn greet(name: &str) {          // no -> means it hands nothing back
    println!("Hello, {}", name);
}

fn max_of(a: i32, b: i32) -> i32 {
    if a > b { a } else { b }   // if is an expression, so this works
}

let r = twice(5);               // 10`,
          notes: [
            { token: "-> i32", meaning: "the type it hands back. No arrow means nothing" },
            { token: "x * 2 with no semicolon", meaning: "the last expression IS the return value" },
            { token: "x * 2;", meaning: "with a semicolon it returns nothing, and this will not compile" },
            { token: "types are required", meaning: "on parameters and returns, even though `let` infers them" },
          ],
          prompt:
            "Write a function is_even that takes an i32 and returns true when it is even. Then call it with 7.",
          starter: `fn is_even(n: i32)  {
    
}

fn main() {
    println!("{}", is_even());
}`,
          rules: {
            regex: ["fn\\s+is_even\\s*\\(\\s*n\\s*:\\s*i32\\s*\\)\\s*->\\s*bool", "n\\s*%\\s*2\\s*==\\s*0", "is_even\\s*\\(\\s*7\\s*\\)"],
            hint: "-> bool for the return type. The body is just n % 2 == 0, with no semicolon.",
            success:
              "Correct. Leave the semicolon off: `n % 2 == 0;` would throw the value away and the compiler would tell you the function expected a bool and got nothing.",
          },
          solution: `fn is_even(n: i32) -> bool {
    n % 2 == 0
}

fn main() {
    println!("{}", is_even(7));
}`,
        },
      },
    },

    /* --------------------------------------------------------- passing -- */
    {
      id: "passing",
      kicker: "02",
      title: "What crosses the boundary",
      hook:
        "You pass a list to a function. The function adds an item to it. Afterwards you print your list. Has it changed?",
      body: [
        "In C++ it depends entirely on how you wrote the parameter — and that choice is invisible at the call site.",
        "`void f(vector<int> v)` takes a COPY. The function can do what it likes; your vector is untouched. For a large vector that copy is real work, done for nothing.",
        "`void f(vector<int>& v)` takes a REFERENCE. There is only one vector, with two names. Anything the function does, you see.",
        "`void f(const vector<int>& v)` takes a read-only reference. No copy is made, and the function cannot change it. This is the one you want most of the time.",
        "The rule of thumb: pass small things like ints by value, pass everything else by const reference, and use a plain reference only when you genuinely intend the function to modify the caller's object.",
        "This matters more than it looks. In Python, Java and JavaScript you do not get the choice — objects are always shared — which is why 'why did my list change?' is such a common question in those languages and not in C++.",
      ],
      predict: {
        ask: "What does this C++ code print?",
        code: `void addOne(vector<int> v)  { v.push_back(1); }
void addTwo(vector<int>& v) { v.push_back(2); }

vector<int> nums;
addOne(nums);
addTwo(nums);

cout << nums.size();`,
        choices: [
          { text: "2", why: "Only one of the two functions can reach the caller's vector. The other worked on a copy." },
          { text: "1", why: "Correct. addOne got a copy, so its push_back was thrown away with the copy. addTwo took a reference, so its push_back really happened. Size is 1." },
          { text: "0", why: "addTwo takes a reference, so its change does reach the caller." },
          { text: "Will not compile", why: "Both forms are valid. The difference is one & character, which is exactly what makes this easy to get wrong." },
        ],
        answer: 1,
      },
      viz: traceArgModels(),
      example: `void byValue(vector<int> v)        { v.push_back(1); }  // a copy
void byRef(vector<int>& v)         { v.push_back(2); }  // the real thing
void readOnly(const vector<int>& v){ /* cannot change v */ }

// the call site looks IDENTICAL for all three
byValue(nums);
byRef(nums);
readOnly(nums);

// so the signature is the only place the answer lives`,
      notes: [
        { token: "vector<int> v", meaning: "a full copy. Expensive for anything large" },
        { token: "vector<int>& v", meaning: "the caller's object. Changes are visible" },
        { token: "const vector<int>& v", meaning: "no copy, no changes. The usual default" },
        { token: "the call site", meaning: "looks the same for all three. Read the signature" },
      ],
      challenge: {
        prompt:
          "Write a function total that adds up a vector and returns the sum. It must not copy the vector, and must not be able to modify it.",
        starter: `int total( v) {
  int sum = 0;
  for (int x : v) sum += x;
  return sum;
}`,
        rules: {
          regex: ["const\\s+vector\\s*<\\s*int\\s*>\\s*&\\s*v"],
          hint: "const vector<int>& v — the & avoids the copy, and the const says you will not change it.",
          success:
            "Correct. Both parts earn their place: without the & every call copies the whole vector, and without the const nothing stops a later edit from modifying the caller's data by accident.",
        },
        solution: `int total(const vector<int>& v) {
  int sum = 0;
  for (int x : v) sum += x;
  return sum;
}`,
      },

      alt: {
        c: {
          body: [
            "In C it depends on what you passed. C has exactly one rule: everything is passed by value, always. There are no references.",
            "So passing an int gives the function a copy, and the function cannot change yours.",
            "To let a function change something, you pass its ADDRESS and the function writes through that pointer. `void f(int *x) { *x = 10; }`, called as `f(&n)`. That is why scanf needs the &.",
            "Arrays are the exception that confuses everyone. You cannot pass an array by value — it decays to a pointer to its first element. So a function CAN change your array, and it also has no idea how long it is.",
            "That is why C functions taking an array almost always take a length too: `void f(int a[], int n)`. The array itself carries no size information at all.",
          ],
          predict: {
            ask: "What does this C code print?",
            code: `void bump(int x)    { x = 99; }
void bumpArr(int a[]) { a[0] = 99; }

int n = 1;
int arr[3] = {1, 2, 3};

bump(n);
bumpArr(arr);

printf("%d %d", n, arr[0]);`,
            choices: [
              { text: "99 99", why: "The int was passed by value, so bump could only change its own copy." },
              { text: "1 99", why: "Correct. n was copied, so it is unchanged. But an array decays to a pointer, so bumpArr wrote straight into the caller's array." },
              { text: "1 1", why: "Arrays are not copied — bumpArr really did modify arr[0]." },
              { text: "99 1", why: "It is the other way round. Ints are copied; arrays are not." },
            ],
            answer: 1,
          },
          example: `void byValue(int x)   { x = 10; }        /* a copy — caller is safe */
void byPointer(int *x){ *x = 10; }        /* writes through the address */

int n = 1;
byValue(n);      /* n is still 1 */
byPointer(&n);   /* n is now 10 — note the & */

/* arrays are NOT copied. They decay to a pointer */
void fill(int a[], int len) {             /* len must be passed too */
  for (int i = 0; i < len; i++) a[i] = 0; /* changes the caller's array */
}

/* read-only, and no copy */
void show(const int *a, int len);`,
          notes: [
            { token: "everything by value", meaning: "C's only rule. There are no references" },
            { token: "int *x with f(&n)", meaning: "pass the address to let a function change it" },
            { token: "int a[]", meaning: "decays to a pointer. Not copied, and the size is lost" },
            { token: "const int *a", meaning: "read-only. The function cannot write through it" },
          ],
          prompt:
            "Write a function total that adds up an array and returns the sum. It must not be able to modify the array, and remember C has no idea how long an array is.",
          starter: `int total( a, ) {
  int sum = 0;
  for (int i = 0; i < len; i++) sum += a[i];
  return sum;
}`,
          rules: {
            regex: ["const\\s+int\\s*\\*\\s*a|const\\s+int\\s+a\\s*\\[\\s*\\]", "int\\s+len"],
            hint: "const int *a stops the function writing to it, and int len is how it knows where to stop.",
            success:
              "Correct. The length parameter is not optional in C — an array carries no size, so without it the loop has no idea where to stop and will happily read past the end.",
          },
          solution: `int total(const int *a, int len) {
  int sum = 0;
  for (int i = 0; i < len; i++) sum += a[i];
  return sum;
}`,
        },

        python: {
          body: [
            "Yes, it has changed. And this is the single most surprising thing about functions in Python.",
            "Python passes a REFERENCE to the object, by value. That phrase is doing a lot of work, so take it in two halves.",
            "The function receives a reference to the same object you have. So if it MUTATES that object — appends to the list, sets a key in the dict, changes a field — you see the change. There is only one object.",
            "But the reference itself was copied. So if the function REASSIGNS the parameter — `items = [9]` — it just points its own local name somewhere new. Your name still points at the original.",
            "That is the whole rule, and it explains the confusion: `items.append(3)` is visible to the caller, `items = [3]` is not.",
            "Numbers, strings and tuples cannot be changed in place at all, so they are safe — not because they are passed differently, but because there is no mutation to see.",
            "The classic trap that follows from this is a MUTABLE DEFAULT: `def f(items=[])` creates that list ONCE, when the function is defined, and every call with no argument shares it.",
          ],
          predict: {
            ask: "What does this Python code print?",
            code: `def add_item(items):
    items.append(1)

def replace(items):
    items = [9]

nums = []
add_item(nums)
replace(nums)

print(nums)`,
            choices: [
              { text: "[9]", why: "replace only pointed its own local name at a new list. The caller's name never moved." },
              { text: "[1]", why: "Correct. append MUTATED the shared list, so the caller sees it. Reassigning inside replace only rebound the local name and had no effect outside." },
              { text: "[1, 9]", why: "replace does not add anything — it points its local name at a different list entirely." },
              { text: "[]", why: "add_item really did mutate the caller's list, so the 1 is there." },
            ],
            answer: 1,
          },
          example: `def mutate(items):
    items.append(1)        # the caller SEES this

def rebind(items):
    items = [9]            # the caller does NOT see this

nums = []
mutate(nums)               # nums is [1]
rebind(nums)               # nums is still [1]

# numbers cannot be changed in place, so they are always safe
def bump(x):
    x += 1                 # rebinding — never visible outside

# THE classic trap: a mutable default
def bad(items=[]):         # this list is made ONCE, and shared
    items.append(1)
    return items

def good(items=None):      # do this instead
    if items is None:
        items = []`,
          notes: [
            { token: "items.append(...)", meaning: "mutates the shared object. The caller sees it" },
            { token: "items = [...]", meaning: "rebinds the local name only. Invisible outside" },
            { token: "numbers and strings", meaning: "cannot be mutated, so they are always safe" },
            { token: "def f(items=[])", meaning: "the default list is created ONCE and shared by every call" },
          ],
          prompt:
            "Fix this function so the default is not shared between calls. It should return a new list each time when no argument is given.",
          starter: `def collect(items=):
    if :
        items = []
    items.append(1)
    return items`,
          rules: {
            regex: ["items\\s*=\\s*None", "items\\s+is\\s+None"],
            hint: "Use None as the default, then check `if items is None:` and make a fresh list inside.",
            success:
              "Correct, and this is one of the very few Python gotchas worth memorising outright. With `items=[]`, calling collect() three times returns [1], [1, 1], [1, 1, 1] — the same list, growing.",
          },
          solution: `def collect(items=None):
    if items is None:
        items = []
    items.append(1)
    return items`,
        },

        java: {
          body: [
            "Yes, it has changed — and Java's official answer, that everything is passed by value, is true and misleading at the same time.",
            "What is passed by value is the REFERENCE. The function gets its own copy of the arrow pointing at your object, not a copy of the object.",
            "So mutating through it is visible: `list.add(1)` changes YOUR list, because there is only one list.",
            "But reassigning the parameter is not: `list = new ArrayList<>()` points the function's local arrow somewhere new and leaves yours alone.",
            "Primitives — int, double, boolean, char — are genuinely copied, so those are always safe.",
            "The practical consequence is that a method taking a List can change it out from under you, and nothing in the signature warns you. If you need to be sure, pass `List.copyOf(list)` or an unmodifiable view.",
          ],
          predict: {
            ask: "What does this Java code print?",
            code: `static void addItem(List<Integer> l) { l.add(1); }
static void replace(List<Integer> l)  { l = new ArrayList<>(); }

List<Integer> nums = new ArrayList<>();
addItem(nums);
replace(nums);

System.out.println(nums.size());`,
            choices: [
              { text: "0", why: "addItem really did add to the caller's list — there is only one list object." },
              { text: "1", why: "Correct. addItem mutated the shared object, so the caller sees it. replace only pointed its local variable at a new list, which had no effect outside." },
              { text: "2", why: "replace does not add anything. It abandons the original and points its own name elsewhere." },
              { text: "Will not compile", why: "Reassigning a parameter is legal Java. It just does not do what people expect." },
            ],
            answer: 1,
          },
          example: `static void mutate(List<Integer> l) { l.add(1); }    // caller SEES this
static void rebind(List<Integer> l) { l = new ArrayList<>(); } // does NOT

// primitives are genuinely copied
static void bump(int x) { x = 99; }                 // caller unaffected

// want to guarantee no changes? pass an unmodifiable copy
process(List.copyOf(nums));

// or mark the parameter final — stops rebinding, NOT mutation
static void f(final List<Integer> l) {
  l.add(1);              // still allowed
  // l = new ArrayList<>();  // not allowed
}`,
          notes: [
            { token: "the reference is copied", meaning: "not the object. Mutation shows, rebinding does not" },
            { token: "primitives", meaning: "int, double, boolean, char. Genuinely copied, always safe" },
            { token: "final on a parameter", meaning: "stops reassignment only. The object can still change" },
            { token: "List.copyOf(x)", meaning: "an unmodifiable copy. The real guarantee" },
          ],
          prompt:
            "Call process in a way that guarantees it cannot modify your list, whatever process does inside.",
          starter: `List<Integer> nums = new ArrayList<>();

process();`,
          rules: {
            regex: ["List\\.copyOf\\s*\\(\\s*nums\\s*\\)|Collections\\.unmodifiableList\\s*\\(\\s*nums\\s*\\)|new\\s+ArrayList\\s*<>\\s*\\(\\s*nums\\s*\\)"],
            hint: "Pass List.copyOf(nums) — an unmodifiable copy, so nothing process does can reach your list.",
            success:
              "Correct. Marking the parameter final would NOT have helped: final stops the name being reassigned, and does nothing to stop the object being modified.",
          },
          solution: `List<Integer> nums = new ArrayList<>();

process(List.copyOf(nums));`,
        },

        javascript: {
          body: [
            "Yes, it has changed — and the rule is exactly Python's and Java's, spelled slightly differently.",
            "JavaScript passes everything by value. For an object or an array, the value being passed is the REFERENCE, so the function ends up pointing at the same thing you do.",
            "Mutating it is visible: `items.push(1)` changes your array. Reassigning is not: `items = [9]` only moves the function's own local name.",
            "Primitives — numbers, strings, booleans — are copied, so those are always safe.",
            "The trap specific to JavaScript is that `const` does not help. A `const` array can still be pushed to; const only stops the name being pointed somewhere else. If you want a real guarantee, `Object.freeze` or pass a copy with `[...items]`.",
            "Default parameters do NOT have Python's shared-default problem. `function f(items = [])` creates a fresh array on every call where the argument is missing, which is what people expect.",
          ],
          predict: {
            ask: "What does this print?",
            code: `function addItem(items) { items.push(1); }
function replace(items)  { items = [9]; }

const nums = [];
addItem(nums);
replace(nums);

console.log(nums);`,
            choices: [
              { text: "[9]", why: "replace only pointed its own local name at a new array. The caller's binding never moved." },
              { text: "[1]", why: "Correct. push mutated the shared array, so the caller sees it. Reassigning inside replace changed only the local name." },
              { text: "[]", why: "addItem really did mutate the caller's array — const does not prevent that." },
              { text: "TypeError, nums is const", why: "const stops REASSIGNING nums. It does nothing to stop the array's contents changing." },
            ],
            answer: 1,
          },
          example: `function mutate(items) { items.push(1); }   // the caller SEES this
function rebind(items) { items = [9]; }     // the caller does NOT

const nums = [];
mutate(nums);            // nums is [1] — const does not stop this
rebind(nums);            // nums is still [1]

// primitives are copied, so always safe
function bump(x) { x += 1; }

// want a real guarantee? pass a copy
process([...nums]);
process({ ...user });

// or freeze it — shallow, so nested objects are still open
Object.freeze(nums);`,
          notes: [
            { token: "the reference is copied", meaning: "not the object. Mutation shows, rebinding does not" },
            { token: "const does NOT help", meaning: "it stops reassigning the name, not changing the contents" },
            { token: "[...items]", meaning: "a shallow copy. The usual way to pass something safely" },
            { token: "Object.freeze", meaning: "shallow too — nested objects can still be changed" },
          ],
          prompt:
            "Call process in a way that guarantees it cannot modify your array, whatever it does inside.",
          starter: `const nums = [1, 2, 3];

process();`,
          rules: {
            regex: ["\\[\\s*\\.\\.\\.\\s*nums\\s*\\]|nums\\.slice\\s*\\(\\s*\\)|Array\\.from\\s*\\(\\s*nums\\s*\\)"],
            hint: "Pass a copy: process([...nums]) — the spread makes a new array with the same contents.",
            success:
              "Correct. Note this is a SHALLOW copy: if the array held objects, both copies would still point at the same objects. structuredClone(nums) gives you a deep one.",
          },
          solution: `const nums = [1, 2, 3];

process([...nums]);`,
        },

        rust: {
          hook:
            "You pass a Vec to a function. Afterwards you try to print it — and the program does not compile. Rust says the value was moved. What happened to your vector?",
          body: [
            "You gave it away. That is Rust's default: passing a value hands OWNERSHIP to the function, and the caller's name stops being usable.",
            "It sounds drastic and it solves the exact problem the previous four languages have. There is never any doubt about whether a function can change your data behind your back, because you can see at the call site whether you gave it away or lent it.",
            "To lend instead, borrow with `&`. `fn total(v: &Vec<i32>)` reads the vector without taking it, and you keep using it afterwards.",
            "To lend it AND allow changes, borrow mutably with `&mut`. Now the function can modify your vector, and you had to write `&mut` at the call site — so it is visible in both places.",
            "The rule the compiler enforces: you may have many readers, or exactly one writer, never both at once. That single rule is what makes data races impossible.",
            "Small types like i32 are `Copy`, so they are copied rather than moved and behave exactly as they do everywhere else. It is the owned, heap-using types — Vec, String — where moves show up.",
            "One more piece of advice worth taking early: prefer `&[i32]` over `&Vec<i32>` and `&str` over `&String` for parameters. They accept more kinds of argument and cost nothing extra.",
          ],
          predict: {
            ask: "What does the Rust compiler say about this?",
            code: `fn total(v: Vec<i32>) -> i32 {
    v.iter().sum()
}

let nums = vec![1, 2, 3];
let t = total(nums);

println!("{} {}", t, nums.len());`,
            choices: [
              { text: "It compiles and prints 6 3", why: "The call handed nums over to the function. By the last line the caller no longer owns it." },
              { text: "Error: borrow of moved value `nums`", why: "Correct. `total(nums)` MOVED the vector into the function. Take `v: &Vec<i32>` and call `total(&nums)` to borrow it instead." },
              { text: "Error: nums must be mutable", why: "Nothing here modifies it. The problem is ownership, not mutability." },
              { text: "It compiles but prints 6 0", why: "Rust does not leave an empty husk behind. The value is gone and using the name is a compile error." },
            ],
            answer: 1,
          },
          example: `fn takes(v: Vec<i32>)      { }      // MOVES it. Caller loses the vector
fn borrows(v: &Vec<i32>)   { }      // lends it. Caller keeps it
fn changes(v: &mut Vec<i32>) { v.push(1); }   // lends it, and may modify

let mut nums = vec![1, 2, 3];

borrows(&nums);        // fine, and nums is still yours
changes(&mut nums);    // visible at the CALL SITE too
// takes(nums);        // after this, nums is unusable

// i32 and friends are Copy — moved is the same as copied
fn bump(x: i32) { }
let n = 5;
bump(n);
println!("{}", n);     // still fine

// prefer slices in parameters — they accept more
fn total(v: &[i32]) -> i32 { v.iter().sum() }`,
          notes: [
            { token: "v: Vec<i32>", meaning: "takes ownership. The caller cannot use it afterwards" },
            { token: "v: &Vec<i32>", meaning: "borrows to read. The caller keeps it" },
            { token: "v: &mut Vec<i32>", meaning: "borrows to modify. Visible at the call site too" },
            { token: "&[i32] over &Vec<i32>", meaning: "a slice. Accepts arrays and Vecs alike" },
          ],
          prompt:
            "Write a function total that adds up the numbers and returns the sum, without taking ownership — the caller must still be able to use the vector afterwards.",
          starter: `fn total(v: ) -> i32 {
    v.iter().sum()
}

let nums = vec![1, 2, 3];
println!("{} {}", total(), nums.len());`,
          rules: {
            regex: ["v\\s*:\\s*&\\s*\\[\\s*i32\\s*\\]|v\\s*:\\s*&\\s*Vec\\s*<\\s*i32\\s*>", "total\\s*\\(\\s*&nums\\s*\\)"],
            hint: "Borrow it: `v: &[i32]` in the signature, and `total(&nums)` at the call. The & appears in both places.",
            success:
              "Correct, and notice the & is visible at the CALL SITE as well as in the signature. In Python, Java and JavaScript the call looks identical whether the function will change your data or not — here you can see it.",
          },
          solution: `fn total(v: &[i32]) -> i32 {
    v.iter().sum()
}

let nums = vec![1, 2, 3];
println!("{} {}", total(&nums), nums.len());`,
        },
      },
    },

    /* --------------------------------------------------------- results -- */
    {
      id: "results",
      kicker: "03",
      title: "Several answers, and optional inputs",
      hook:
        "A function should give you back both the smallest and the largest number in a list. But return hands back exactly one value. How do you get two?",
      body: [
        "You make that one value carry both. Bundle them into a pair, a tuple or a small struct, and one thing comes back holding two.",
        "In C++ that is `pair<int,int>` or, for more than two, a `tuple` or a named struct. A struct is worth it as soon as the pieces mean something — `pair.first` tells a reader nothing; `result.smallest` tells them everything.",
        "Then unpack it on the way in with structured bindings: `auto [lo, hi] = minMax(v);` gives you two named variables instead of reaching into the bundle each time.",
        "The alternative is an output parameter — pass something by reference and have the function fill it. It works, and it reads worse: the call no longer tells you what comes back, because some of the arguments are secretly results.",
        "The other half of this topic is optional inputs. C++ has default arguments: `void greet(string name, string greeting = \"Hello\")` can be called with one argument or two.",
        "C++ also has overloading — several functions with the same name and different parameters, and the compiler picks by what you passed. Between defaults and overloading you can usually avoid making callers pass things they do not care about.",
      ],
      predict: {
        ask: "What does this C++ code print?",
        code: `void greet(string name, string greeting = "Hello") {
  cout << greeting << ", " << name << ". ";
}

greet("Ada");
greet("Ada", "Hi");`,
        choices: [
          { text: "Hello, Ada. Hi, Ada.", why: "Correct. The first call uses the default greeting; the second supplies its own, which replaces it." },
          { text: "Hello, Ada. Hello, Ada.", why: "The second call passes \"Hi\", which overrides the default." },
          { text: "Will not compile — greet needs two arguments", why: "The default makes the second parameter optional, so a one-argument call is fine." },
          { text: ", Ada. Hi, Ada.", why: "A defaulted parameter is not empty — it takes the value written in the signature." },
        ],
        answer: 0,
      },
      viz: traceMultiReturn(),
      example: `// two values back, bundled into one
pair<int,int> minMax(const vector<int>& v) {
  int lo = v[0], hi = v[0];
  for (int x : v) { lo = min(lo, x); hi = max(hi, x); }
  return {lo, hi};
}

auto [lo, hi] = minMax(nums);      // unpack on the way in

// a struct once the pieces have meaning
struct Stats { int lo, hi; double mean; };

// optional inputs — a default
void greet(string name, string greeting = "Hello");

// or overloading — same name, different parameters
int area(int side);
int area(int w, int h);`,
      notes: [
        { token: "pair<int,int>", meaning: "two values in one. tuple for more" },
        { token: "auto [lo, hi] =", meaning: "structured bindings. Unpacks into named variables" },
        { token: "a struct", meaning: "better than pair once the parts mean something" },
        { token: "= \"Hello\"", meaning: "a default. Defaults must come last in the parameter list" },
      ],
      challenge: {
        prompt:
          "Write a function minMax that returns both the smallest and largest of a vector, in one value. Do not copy the vector.",
        starter: ` minMax( v) {
  int lo = v[0], hi = v[0];
  for (int x : v) { lo = min(lo, x); hi = max(hi, x); }
  return ;
}`,
        rules: {
          regex: ["pair\\s*<\\s*int\\s*,\\s*int\\s*>\\s*minMax", "const\\s+vector\\s*<\\s*int\\s*>\\s*&\\s*v", "return\\s*\\{\\s*lo\\s*,\\s*hi\\s*\\}"],
          hint: "Return type pair<int,int>, parameter const vector<int>& v, and return {lo, hi};",
          success:
            "Correct. `return {lo, hi};` builds the pair without naming its type again — and the caller can unpack it with `auto [lo, hi] = minMax(v);`.",
        },
        solution: `pair<int,int> minMax(const vector<int>& v) {
  int lo = v[0], hi = v[0];
  for (int x : v) { lo = min(lo, x); hi = max(hi, x); }
  return {lo, hi};
}`,
      },

      alt: {
        c: {
          body: [
            "You make that one value carry both — or you use output parameters, which is what C code mostly does.",
            "C has no pair and no tuple. Your options are a struct, or passing pointers for the function to write through.",
            "A struct works and can be returned by value: `struct MinMax { int lo, hi; };` then `return (struct MinMax){lo, hi};`. That is clean, and older C code often avoids it out of habit.",
            "The output-parameter style is `void minMax(const int *a, int n, int *lo, int *hi)`, called with `&lo, &hi`. It reads worse, and it is everywhere in C libraries — often because the return value is already being used for an error code.",
            "C also has no default arguments and no overloading. One name means one function, and every caller passes everything. Where C++ would give you `area(side)` and `area(w, h)`, C needs two differently named functions.",
          ],
          predict: {
            ask: "What is wrong with this C function?",
            code: `int *makeArray(void) {
  int arr[3] = {1, 2, 3};
  return arr;
}`,
            choices: [
              { text: "Nothing — it returns the array", why: "It returns a pointer to memory that stops existing the moment the function returns." },
              { text: "arr stops existing when the function returns", why: "Correct. arr is a local, so it lives on the stack and is gone at the end of the call. The returned pointer points at memory that will be reused — a dangling pointer." },
              { text: "It should return int[] not int*", why: "C has no way to return an array type at all. The problem is lifetime, not syntax." },
              { text: "It needs to be static", why: "Adding static would technically fix the lifetime, but it makes one shared array for every call — usually the wrong answer. malloc is the usual fix." },
            ],
            answer: 1,
          },
          example: `/* option 1 — a struct, returned by value */
struct MinMax { int lo, hi; };

struct MinMax minMax(const int *a, int n) {
  struct MinMax r = { a[0], a[0] };
  for (int i = 0; i < n; i++) {
    if (a[i] < r.lo) r.lo = a[i];
    if (a[i] > r.hi) r.hi = a[i];
  }
  return r;
}

/* option 2 — output parameters. Common in C libraries */
void minMax2(const int *a, int n, int *lo, int *hi);
minMax2(nums, 3, &lo, &hi);

/* NEVER return a pointer to a local */
int *bad(void) {
  int x = 5;
  return &x;      /* x is gone the moment this returns */
}`,
          notes: [
            { token: "a struct by value", meaning: "the clean option. Works fine, and is under-used" },
            { token: "int *lo, int *hi", meaning: "output parameters. The function writes through them" },
            { token: "no defaults, no overloading", meaning: "one name is one function. Every caller passes everything" },
            { token: "return &local", meaning: "a dangling pointer. The local is gone the moment you return" },
          ],
          prompt:
            "Write minMax so it hands back both values through output parameters. It must not modify the array.",
          starter: `void minMax( a, int n, , ) {
  *lo = a[0]; *hi = a[0];
  for (int i = 0; i < n; i++) {
    if (a[i] < *lo) *lo = a[i];
    if (a[i] > *hi) *hi = a[i];
  }
}`,
          rules: {
            regex: ["const\\s+int\\s*\\*\\s*a", "int\\s*\\*\\s*lo", "int\\s*\\*\\s*hi"],
            hint: "const int *a for the read-only input, then int *lo and int *hi for the function to write through.",
            success:
              "Correct. Note the asymmetry that makes C code readable once you know it: const on the input says 'I only read this', and a plain pointer says 'I will write here'.",
          },
          solution: `void minMax(const int *a, int n, int *lo, int *hi) {
  *lo = a[0]; *hi = a[0];
  for (int i = 0; i < n; i++) {
    if (a[i] < *lo) *lo = a[i];
    if (a[i] > *hi) *hi = a[i];
  }
}`,
        },

        python: {
          body: [
            "You return a tuple, and Python makes this so natural that most people never notice they are doing it.",
            "`return lo, hi` builds a tuple. `lo, hi = min_max(nums)` unpacks it. No type to declare, no bundle to name.",
            "For more than two or three values, a NamedTuple or a dataclass is worth it: `result.smallest` says what it is, where `result[0]` does not.",
            "Optional inputs are where Python is strongest of the six. Default arguments work as you would expect, and keyword arguments let the caller name what they are passing: `connect(host, port=8080, timeout=30)` can be called as `connect(\"a\", timeout=5)`.",
            "That readability at the call site is a real feature. `draw(shape, True, False)` tells a reader nothing; `draw(shape, filled=True, dashed=False)` tells them everything.",
            "The trap, again, is a mutable default. `def f(items=[])` creates that list once at definition time and shares it across every call. Use None and build a fresh one inside.",
          ],
          predict: {
            ask: "What does this Python code print?",
            code: `def collect(item, into=[]):
    into.append(item)
    return into

print(collect(1))
print(collect(2))`,
            choices: [
              { text: "[1] then [2]", why: "That is what everyone expects and it is not what happens. The default list is not recreated per call." },
              { text: "[1] then [1, 2]", why: "Correct. The default [] is created ONCE when the function is defined, and every call without an argument shares that same list." },
              { text: "[1] then [1]", why: "The list persists between calls and keeps growing, so the second call sees the 1 still there." },
              { text: "TypeError", why: "This is perfectly legal Python. That is exactly what makes it dangerous." },
            ],
            answer: 1,
          },
          example: `def min_max(nums):
    return min(nums), max(nums)        # a tuple, no bundle to name

lo, hi = min_max(nums)                 # unpack on the way in

# named, once the pieces mean something
from dataclasses import dataclass

@dataclass
class Stats:
    lo: int
    hi: int
    mean: float

# defaults and keyword arguments
def connect(host, port=8080, timeout=30):
    ...

connect("example.com", timeout=5)      # name what you pass

# the mutable default trap
def bad(items=[]):      # made ONCE, shared by every call
    ...
def good(items=None):   # do this
    if items is None:
        items = []`,
          notes: [
            { token: "return lo, hi", meaning: "builds a tuple. No type to declare" },
            { token: "lo, hi = f()", meaning: "unpacks it into named variables" },
            { token: "port=8080", meaning: "a default, and callers can name it at the call site" },
            { token: "def f(items=[])", meaning: "the trap. One list, shared by every call" },
          ],
          prompt:
            "Write min_max so it returns both the smallest and largest, then unpack the result into two variables.",
          starter: `def min_max(nums):
    return 

 = min_max([3, 1, 4])`,
          rules: {
            regex: ["return\\s+min\\s*\\(\\s*nums\\s*\\)\\s*,\\s*max\\s*\\(\\s*nums\\s*\\)", "lo\\s*,\\s*hi\\s*=\\s*min_max"],
            hint: "return min(nums), max(nums) — the comma makes it a tuple. Then lo, hi = min_max(...) unpacks it.",
            success:
              "Correct. The comma is what builds the tuple — the brackets are optional, which is why returning several values in Python feels like it needs no machinery at all.",
          },
          solution: `def min_max(nums):
    return min(nums), max(nums)


lo, hi = min_max([3, 1, 4])`,
        },

        java: {
          body: [
            "You bundle them, and Java gives you fewer nice ways to do it than the others.",
            "There is no tuple in the standard library. The options are a small class, a `record` (Java 16 and later), or an array — and the array loses the names, so avoid it.",
            "A record is the modern answer and it is one line: `record MinMax(int lo, int hi) {}`. That gives you a constructor, accessors, equals, hashCode and toString for free.",
            "There is no unpacking either. You write `MinMax r = minMax(nums);` and then use `r.lo()` and `r.hi()`. More verbose, and it does mean the pieces keep their names.",
            "For optional inputs, Java has no default arguments at all. It uses OVERLOADING instead: write several methods with the same name, and have the short ones call the long one.",
            "That is why Java APIs so often have three or four versions of the same method — it is the language's substitute for one method with defaults.",
          ],
          predict: {
            ask: "Which of these compiles in Java?",
            code: `static void greet(String name, String greeting) { }
static void greet(String name) { greet(name, "Hello"); }

// versus:
static void greet2(String name, String greeting = "Hello") { }`,
            choices: [
              { text: "Both", why: "Java has no default parameter values at all. The second form is a syntax error." },
              { text: "Only the overload pair", why: "Correct. Java has no default arguments, so the pattern is two methods with the same name where the short one calls the long one." },
              { text: "Only greet2", why: "`= \"Hello\"` in a parameter list is not valid Java. That is a C++, Python and JavaScript feature." },
              { text: "Neither", why: "The overload pair is completely ordinary Java, and is the standard way to give a parameter a default." },
            ],
            answer: 1,
          },
          example: `// a record — the modern way to bundle values, Java 16+
record MinMax(int lo, int hi) {}

static MinMax minMax(List<Integer> nums) {
  int lo = Collections.min(nums);
  int hi = Collections.max(nums);
  return new MinMax(lo, hi);
}

MinMax r = minMax(nums);
System.out.println(r.lo() + " " + r.hi());   // no unpacking

// no default arguments — overload instead
static void greet(String name, String greeting) {
  System.out.println(greeting + ", " + name);
}
static void greet(String name) {
  greet(name, "Hello");        // the short one calls the long one
}`,
          notes: [
            { token: "record MinMax(int lo, int hi)", meaning: "one line. Constructor, accessors and equals for free" },
            { token: "r.lo()", meaning: "record accessors are methods, with brackets" },
            { token: "no tuples", meaning: "and no unpacking. A record or a small class instead" },
            { token: "no default arguments", meaning: "overloading is the substitute" },
          ],
          prompt:
            "Give greet a default greeting of \"Hello\" using the technique Java actually has. Write the short version so it calls the long one.",
          starter: `static void greet(String name, String greeting) {
  System.out.println(greeting + ", " + name);
}

static void greet(String name) {
  ;
}`,
          rules: {
            regex: ['greet\\s*\\(\\s*name\\s*,\\s*"Hello"\\s*\\)'],
            hint: 'The one-argument version calls the two-argument one: greet(name, "Hello");',
            success:
              "Correct. This is why Java libraries have so many near-identical methods — it is the only way the language offers to make a parameter optional.",
          },
          solution: `static void greet(String name, String greeting) {
  System.out.println(greeting + ", " + name);
}

static void greet(String name) {
  greet(name, "Hello");
}`,
        },

        javascript: {
          body: [
            "You return an array or an object, and then destructure it on the way in.",
            "`return [lo, hi]` with `const [lo, hi] = minMax(nums)` works and depends on order. `return { lo, hi }` with `const { lo, hi } = minMax(nums)` works by NAME, which is safer — the caller cannot get them the wrong way round.",
            "Prefer the object form for anything with more than two parts, or where the parts are the same type. `const [width, height] = getSize()` is one refactor away from silently swapping.",
            "Optional inputs are straightforward: default parameters work as expected, and unlike Python the default is re-evaluated on every call, so `function f(items = [])` gives a fresh array each time.",
            "For a function with several optional settings, the usual pattern is a single options object with destructuring and defaults in the signature — which gives you named arguments, something the language does not otherwise have.",
          ],
          predict: {
            ask: "What does this print?",
            code: `function makeUser({ name, role = "user", active = true } = {}) {
  return \`\${name}/\${role}/\${active}\`;
}

console.log(makeUser({ name: "Ada", active: false }));`,
            choices: [
              { text: "Ada/user/false", why: "Correct. name and active come from the object, role falls back to its default, and the missing values are filled in by name rather than position." },
              { text: "Ada/user/true", why: "active: false was passed explicitly. A default only applies when the value is undefined." },
              { text: "undefined/user/true", why: "name was supplied in the object, so it is picked up by the destructuring." },
              { text: "TypeError", why: "The `= {}` at the end means calling it with no argument at all is safe too." },
            ],
            answer: 0,
          },
          example: `// by position — order matters
function minMax(nums) {
  return [Math.min(...nums), Math.max(...nums)];
}
const [lo, hi] = minMax(nums);

// by name — safer, and self-documenting
function stats(nums) {
  return { lo: Math.min(...nums), hi: Math.max(...nums) };
}
const { lo, hi } = stats(nums);

// defaults — re-evaluated every call, unlike Python
function collect(item, into = []) {
  into.push(item);
  return into;                     // a FRESH array each call
}

// an options object gives you named arguments
function connect({ host, port = 8080, timeout = 30 } = {}) { }
connect({ host: "example.com", timeout: 5 });`,
          notes: [
            { token: "return [lo, hi]", meaning: "by position. The caller must know the order" },
            { token: "return { lo, hi }", meaning: "by name. Safer, and reads better" },
            { token: "into = []", meaning: "a fresh array every call. Python's trap does not apply here" },
            { token: "an options object", meaning: "how JavaScript does named arguments" },
          ],
          prompt:
            "Write stats so it returns the smallest and largest BY NAME, then destructure the result into two variables.",
          starter: `function stats(nums) {
  return ;
}

const  = stats([3, 1, 4]);`,
          rules: {
            regex: ["return\\s*\\{\\s*lo\\s*:", "const\\s*\\{\\s*lo\\s*,\\s*hi\\s*\\}\\s*=\\s*stats"],
            hint: "return { lo: ..., hi: ... } and then const { lo, hi } = stats(...) — matched by name, not position.",
            success:
              "Correct. The object form is worth preferring: with `const [hi, lo] = minMax(...)` a caller can silently swap them, and with names that mistake is impossible.",
          },
          solution: `function stats(nums) {
  return { lo: Math.min(...nums), hi: Math.max(...nums) };
}

const { lo, hi } = stats([3, 1, 4]);`,
        },

        rust: {
          body: [
            "You return a tuple, and Rust makes this as natural as Python does.",
            "`(lo, hi)` is a tuple, and `let (lo, hi) = min_max(&nums);` destructures it straight into two variables.",
            "For more than two or three parts, a struct is better — `Stats { lo, hi, mean }` — and Rust structs are cheap to declare and cost nothing at run time.",
            "The bigger idea, which the Error Handling topic builds on, is that Rust uses the return value for outcomes too. `Option<T>` is a value or nothing; `Result<T, E>` is a value or an explanation. Both are ordinary return values rather than a separate mechanism.",
            "Optional inputs are where Rust gives you the least. There are no default arguments and no overloading — one name is one function, and every caller passes everything.",
            "The usual answers are `Option<T>` parameters for one or two optional values, or a builder for anything larger: `Request::new(url).timeout(5).send()`. More typing, and completely explicit.",
          ],
          predict: {
            ask: "What does the Rust compiler say about this?",
            code: `fn greet(name: &str) { }
fn greet(name: &str, greeting: &str) { }`,
            choices: [
              { text: "Fine — that is overloading", why: "Rust has no function overloading at all. Two functions cannot share a name in the same scope." },
              { text: "Error: the name `greet` is defined multiple times", why: "Correct. Rust has neither overloading nor default arguments, so each variation needs its own name — or an Option parameter, or a builder." },
              { text: "Error: missing return types", why: "A function with no -> returns nothing, which is valid. The problem is the duplicate name." },
              { text: "A warning, and the second wins", why: "This is a hard error. Rust will not pick one silently." },
            ],
            answer: 1,
          },
          example: `fn min_max(nums: &[i32]) -> (i32, i32) {
    let lo = *nums.iter().min().unwrap();
    let hi = *nums.iter().max().unwrap();
    (lo, hi)                       // a tuple, no semicolon
}

let (lo, hi) = min_max(&nums);     // destructure on the way in

// a struct once the pieces mean something
struct Stats { lo: i32, hi: i32, mean: f64 }

// no defaults, no overloading. Option for one or two
fn greet(name: &str, greeting: Option<&str>) {
    let g = greeting.unwrap_or("Hello");
    println!("{}, {}", g, name);
}

greet("Ada", None);
greet("Ada", Some("Hi"));`,
          notes: [
            { token: "-> (i32, i32)", meaning: "a tuple. Two values in one return" },
            { token: "let (lo, hi) =", meaning: "destructures it into named variables" },
            { token: "no overloading", meaning: "one name is one function. Give them different names" },
            { token: "Option<&str>", meaning: "how you make a parameter optional. unwrap_or supplies the default" },
          ],
          prompt:
            "Write min_max so it returns both values as a tuple without taking ownership, then destructure the result.",
          starter: `fn min_max(nums: ) -> (i32, i32) {
    let lo = *nums.iter().min().unwrap();
    let hi = *nums.iter().max().unwrap();
    
}

let  = min_max(&nums);`,
          rules: {
            regex: ["nums\\s*:\\s*&\\s*\\[\\s*i32\\s*\\]", "\\(\\s*lo\\s*,\\s*hi\\s*\\)\\s*\\n?\\s*\\}", "let\\s*\\(\\s*lo\\s*,\\s*hi\\s*\\)\\s*="],
            hint: "Take &[i32] to borrow. Return (lo, hi) with no semicolon. Destructure with let (lo, hi) = ...",
            success:
              "Correct. Both halves matter: the & means the caller keeps the vector, and the missing semicolon on (lo, hi) is what makes it the return value rather than a discarded expression.",
          },
          solution: `fn min_max(nums: &[i32]) -> (i32, i32) {
    let lo = *nums.iter().min().unwrap();
    let hi = *nums.iter().max().unwrap();
    (lo, hi)
}

let (lo, hi) = min_max(&nums);`,
        },
      },
    },
  ],
};
