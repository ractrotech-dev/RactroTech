import type { TopicLesson } from "@/lib/dsa/lessons/types";
import { traceLoopForms, traceSwitch, traceTruthiness } from "@/lib/dsa/viz/traceLang";

// Language track, topic 2.
//
// The truthiness section is where the six diverge hardest, so its diagram shows
// all of them at once rather than one at a time.

export const LANG_CONTROL_FLOW: TopicLesson = {
  id: "lang-control-flow",
  title: "Control Flow",
  tagline: "Choosing a path, and repeating one.",
  why:
    "A program that runs top to bottom once can only do one thing. Control flow is what lets it react and repeat — and it is where the six languages disagree most about something you would think was settled: what counts as true.",
  plain: [
    "By default a program runs one line after another, top to bottom, exactly once.",
    "A condition lets it skip some lines. A loop lets it run some lines again.",
    "That is the whole subject. Everything else — switch, for-each, break — is a shorthand for one of those two.",
  ],
  needs: ["Values, types and variables from Fundamentals."],
  traps: [
    "In C, C++ and Java, `if (x = 5)` assigns 5 to x and is then always true. You meant `==`. Java catches it because 5 is not a boolean; the others do not.",
    "Forgetting `break` in a switch means every case below it also runs. Legal, occasionally intended, almost always a bug.",
    "An empty list is FALSE in Python and TRUE in JavaScript. Moving between them silently inverts `if (items)`.",
    "A loop whose condition can never become false hangs the program. Make sure something inside it moves towards the exit.",
  ],
  sections: [
    /* --------------------------------------------------------- decide -- */
    {
      id: "decide",
      kicker: "01",
      title: "Making a decision",
      hook:
        "You write `if (items)` meaning 'if there is anything in this list'. In Python that is right. In JavaScript it is always true, even when the list is empty. Why?",
      body: [
        "Because the languages disagree about what counts as true, and an empty list is the sharpest example.",
        "`if` needs a yes-or-no answer. When you hand it something that is not already a yes-or-no, the language has to decide how to read it — and each one decided differently.",
        "C++ converts numbers and pointers: zero and nullptr are false, everything else is true. `std::string` and containers do not convert at all, so `if (someString)` will not compile.",
        "`else if` is only asked when everything above it has said no, which is what makes a chain of them exclusive. Order matters: put the strictest test first.",
        "The trap to know from day one is `=` versus `==`. One equals sign ASSIGNS. `if (x = 5)` puts 5 into x and then treats 5 as true — so the branch always runs. Two equals signs COMPARE.",
      ],
      predict: {
        ask: "What does this C++ code print?",
        code: `int x = 3;

if (x = 5) {
  cout << "yes ";
}

cout << x;`,
        choices: [
          { text: "3", why: "x is not left alone — the single = inside the condition assigned to it." },
          { text: "yes 5", why: "Correct. `x = 5` assigns 5, and the whole expression evaluates to 5, which is non-zero and therefore true. The branch runs and x is now 5." },
          { text: "5", why: "The condition is 5, which is true, so the branch does run and \"yes \" is printed first." },
          { text: "Will not compile", why: "It compiles. Most compilers warn about it, which is why you should turn warnings on and read them." },
        ],
        answer: 1,
      },
      viz: traceTruthiness(),
      example: `int m = 75;

if (m >= 90)      cout << "A";
else if (m >= 50) cout << "Pass";
else              cout << "Fail";

// what converts to a condition
if (0) {}          // false
if (-1) {}         // true — only zero is false
if (nullptr) {}    // false
// if (name) {}    // will not compile for std::string

// = assigns, == compares
int x = 3;
if (x == 5) {}     // compares. What you meant`,
      notes: [
        { token: "else if", meaning: "only asked when everything above it said no" },
        { token: "if (0)", meaning: "false. Any other number is true" },
        { token: "if (someString)", meaning: "will not compile. std::string has no bool conversion" },
        { token: "x = 5 in a condition", meaning: "assigns, then treats the result as the condition" },
      ],
      challenge: {
        prompt:
          "Read a number and print Even or Odd. Use the remainder operator, and be careful to compare rather than assign.",
        starter: `int n;
cin >> n;

if ( ) {
  cout << "Even";
} else {
  cout << "Odd";
}`,
        rules: {
          regex: ["n\\s*%\\s*2\\s*==\\s*0"],
          hint: "A number is even when dividing by 2 leaves nothing behind: n % 2 == 0. Two equals signs.",
          success:
            "Correct. Turn compiler warnings on and `if (n % 2 = 0)` gets caught — the message is 'lvalue required as left operand of assignment', which is worth recognising.",
        },
        solution: `int n;
cin >> n;

if (n % 2 == 0) {
  cout << "Even";
} else {
  cout << "Odd";
}`,
      },

      alt: {
        c: {
          body: [
            "Because the languages disagree about what counts as true, and C is the most permissive of all.",
            "`if` needs a yes-or-no answer, and in C that answer is just a number. Zero is false; every other value is true. There is no separate boolean type unless you include stdbool.h.",
            "That means anything numeric works as a condition, including a pointer: a null pointer is zero and therefore false, which is why `if (ptr)` is the idiomatic null check.",
            "It also means an empty string is TRUE, because a `char *` is an address and the address is not null. That surprises everyone coming from Python or JavaScript.",
            "And the `=` versus `==` trap is at its worst here. `if (x = 5)` compiles with only a warning, assigns 5, and always runs. Some people write `if (5 == x)` deliberately, so that a typo becomes an error instead.",
          ],
          predict: {
            ask: "What does this C code print?",
            code: `char *name = "";

if (name) {
  printf("has a name");
} else {
  printf("empty");
}`,
            choices: [
              { text: "empty", why: "That is what Python and JavaScript would say. C is not looking at the text at all." },
              { text: "has a name", why: "Correct. name is an ADDRESS, and that address is not null, so it is true. The string being empty is irrelevant — C never looked inside it." },
              { text: "Will not compile", why: "A pointer is a perfectly valid condition in C. This compiles cleanly." },
              { text: "Crashes", why: "Nothing is dereferenced here, so there is nothing to crash on." },
            ],
            answer: 1,
          },
          example: `int m = 75;

if (m >= 90)      printf("A");
else if (m >= 50) printf("Pass");
else              printf("Fail");

/* what counts as true */
if (0) {}          /* false */
if (-1) {}         /* true — only zero is false */
if (ptr) {}        /* true unless ptr is NULL */
if (name[0]) {}    /* how you check an EMPTY string */

/* = assigns, == compares */
if (5 == x) {}     /* some people write it this way on purpose */`,
          notes: [
            { token: "no bool", meaning: "0 is false, anything else true. stdbool.h adds the word" },
            { token: "if (ptr)", meaning: "the idiomatic null check" },
            { token: "if (name[0])", meaning: "checks the FIRST CHARACTER — how you test for an empty string" },
            { token: "if (5 == x)", meaning: "a typo becomes a compile error instead of a silent bug" },
          ],
          starter: `int n;
scanf("%d", &n);

if ( ) {
  printf("Even");
} else {
  printf("Odd");
}`,
          rules: {
            regex: ["n\\s*%\\s*2\\s*==\\s*0"],
            hint: "A number is even when dividing by 2 leaves nothing behind: n % 2 == 0. Two equals signs.",
            success:
              "Correct. Compile with -Wall and C will warn about an accidental assignment in a condition — with warnings off, it is completely silent.",
          },
          solution: `int n;
scanf("%d", &n);

if (n % 2 == 0) {
  printf("Even");
} else {
  printf("Odd");
}`,
        },

        python: {
          body: [
            "Because the languages disagree about what counts as true, and Python has the most useful rules of the six.",
            "`if` needs a yes-or-no answer. Python's rule is: something is false if it is empty or zero, and true otherwise.",
            "So 0, \"\", [], {}, set() and None are all false. Any non-empty container is true. That is why `if items:` reads naturally as 'if there is anything here' — and it is exactly the line that breaks when you move to JavaScript.",
            "Python has no braces. The colon and the indentation ARE the block, so getting the indentation wrong is a syntax error rather than a silent bug — which is a mercy.",
            "And Python removed the `=` versus `==` trap entirely: assignment is not an expression, so `if x = 5:` simply will not parse. You cannot make that mistake.",
          ],
          predict: {
            ask: "What does this Python code print?",
            code: `items = []

if items:
    print("has items")
else:
    print("empty")`,
            choices: [
              { text: "has items", why: "That is JavaScript's answer, where every object is truthy. Python looks at whether the container has anything in it." },
              { text: "empty", why: "Correct. An empty list is falsy in Python, along with 0, \"\", {} and None. This is why `if items:` is the idiomatic emptiness check." },
              { text: "Will not compile", why: "Python is happy to use any value as a condition — it just has its own rule for reading it." },
              { text: "TypeError", why: "No type error here. Every Python value has a truth value." },
            ],
            answer: 1,
          },
          example: `m = 75

if m >= 90:
    print("A")
elif m >= 50:
    print("Pass")
else:
    print("Fail")

# what counts as false — the whole list
# 0   0.0   ""   []   {}   set()   None   False

if items:          # "if there is anything here"
    ...

# if x = 5:        # SyntaxError. Python removed the trap`,
          notes: [
            { token: "elif", meaning: "not `else if`. One word" },
            { token: "the colon and indent", meaning: "there are no braces. Indentation IS the block" },
            { token: "if items:", meaning: "empty containers are false. The idiomatic emptiness check" },
            { token: "if x = 5:", meaning: "a syntax error. Assignment is not an expression in Python" },
          ],
          prompt:
            "Read a number and print Even or Odd. Use the remainder operator.",
          starter: `n = int(input())

if :
    print("Even")
else:
    print("Odd")`,
          rules: {
            regex: ["n\\s*%\\s*2\\s*==\\s*0"],
            hint: "A number is even when dividing by 2 leaves nothing behind: n % 2 == 0. Do not forget the colon.",
            success:
              "Correct. Python cannot make the `=` mistake at all — writing `if n % 2 = 0:` is a syntax error, so one whole category of bug simply does not exist here.",
          },
          solution: `n = int(input())

if n % 2 == 0:
    print("Even")
else:
    print("Odd")`,
        },

        java: {
          body: [
            "Because the languages disagree about what counts as true — and Java refuses to have the argument at all.",
            "A condition in Java must already be a boolean. Not a number, not an object, not a string. `if (0)` does not compile. `if (list)` does not compile.",
            "So you write what you mean: `if (!list.isEmpty())`, `if (count > 0)`, `if (name != null)`. More typing, and nothing to memorise — there is no truthiness table for Java because there is no truthiness.",
            "That also removes most of the `=` versus `==` trap. `if (x = 5)` does not compile, because 5 is not a boolean. It is still possible with booleans — `if (found = true)` compiles fine — so the habit of writing `if (found)` is worth keeping.",
            "The trap Java keeps instead is comparing objects. `==` on two Strings compares ADDRESSES, not letters. Use `.equals()`, and it will work even when the two strings were built in different ways.",
          ],
          predict: {
            ask: "What does this Java code print?",
            code: `String a = "hello";
String b = new String("hello");

if (a == b)      System.out.println("same");
else if (a.equals(b)) System.out.println("equal");
else             System.out.println("different");`,
            choices: [
              { text: "same", why: "== compares references. `new String(...)` deliberately makes a separate object, so the two references differ." },
              { text: "equal", why: "Correct. == is false because they are two different objects; .equals() is true because the letters match. Always use .equals for text." },
              { text: "different", why: ".equals compares the characters, and both hold \"hello\", so it returns true." },
              { text: "Will not compile", why: "Both comparisons are perfectly valid Java. That is exactly what makes this trap dangerous." },
            ],
            answer: 1,
          },
          example: `int m = 75;

if (m >= 90)      System.out.println("A");
else if (m >= 50) System.out.println("Pass");
else              System.out.println("Fail");

// a condition MUST be a boolean
// if (0) {}          will not compile
// if (list) {}       will not compile
if (!list.isEmpty()) {}     // say what you mean

// == on objects compares ADDRESSES
if (a.equals(b)) {}         // compares the letters`,
          notes: [
            { token: "no truthiness", meaning: "a condition must already be a boolean. Nothing converts" },
            { token: "!list.isEmpty()", meaning: "what you write instead of `if (list)`" },
            { token: "== on Strings", meaning: "compares references, not letters. Use .equals" },
            { token: "if (x = 5)", meaning: "will not compile — 5 is not a boolean" },
          ],
          starter: `int n = sc.nextInt();

if ( ) {
  System.out.println("Even");
} else {
  System.out.println("Odd");
}`,
          rules: {
            regex: ["n\\s*%\\s*2\\s*==\\s*0"],
            hint: "A number is even when dividing by 2 leaves nothing behind: n % 2 == 0. Two equals signs.",
            success:
              "Correct. Java would have caught `n % 2 = 0` for you — the condition must be a boolean, and an assignment to an int is not one.",
          },
          solution: `int n = sc.nextInt();

if (n % 2 == 0) {
  System.out.println("Even");
} else {
  System.out.println("Odd");
}`,
        },

        javascript: {
          body: [
            "Because the languages disagree about what counts as true, and JavaScript's rule catches people out more than any other.",
            "The falsy values are a short, fixed list: `false`, `0`, `-0`, `0n`, `\"\"`, `null`, `undefined` and `NaN`. Everything else is truthy.",
            "Everything else. Including `[]`, `{}` and `\"0\"`. An empty array is TRUTHY, because it is an object and every object is truthy.",
            "So `if (items)` never tells you whether the array has anything in it — it is true even when empty. You want `if (items.length)`.",
            "Then there is `==`, which converts before comparing and produces genuinely absurd results: `[] == false` is true, while `if ([])` is also true. Use `===`, which compares without converting, and almost all of it goes away.",
          ],
          predict: {
            ask: "What does this JavaScript code print?",
            code: `const items = [];

if (items)        console.log("A");
if (items.length) console.log("B");
if (items == false) console.log("C");`,
            choices: [
              { text: "A only", why: "That would be right if == behaved sensibly. It does not — it converts [] to \"\" and then to 0, which equals false." },
              { text: "A and C", why: "Correct, and it is as contradictory as it looks. `[]` is truthy so A prints; `[].length` is 0 so B does not; and `[] == false` converts to 0 == 0, so C prints." },
              { text: "B only", why: "An empty array is truthy in JavaScript, so A prints. Its length is 0, so B does not." },
              { text: "Nothing", why: "An empty array is truthy — it is an object, and all objects are truthy." },
            ],
            answer: 1,
          },
          example: `const m = 75;

if (m >= 90)      console.log("A");
else if (m >= 50) console.log("Pass");
else              console.log("Fail");

// the complete falsy list — everything else is truthy
// false  0  -0  0n  ""  null  undefined  NaN

if (items)        {}   // TRUE even for []
if (items.length) {}   // what you actually meant

// use === and the conversion nonsense goes away
"5" == 5    // true
"5" === 5   // false`,
          notes: [
            { token: "[] is truthy", meaning: "every object is. This is the one that catches Python people" },
            { token: "items.length", meaning: "what you write instead of `if (items)`" },
            { token: "===", meaning: "compares without converting. Use it by default" },
            { token: "NaN", meaning: "falsy, and not equal to itself. Test with Number.isNaN" },
          ],
          prompt:
            "Read a number and print Even or Odd. Use the remainder operator, and compare with three equals signs.",
          starter: `const n = Number(line);

if ( ) {
  console.log("Even");
} else {
  console.log("Odd");
}`,
          rules: {
            regex: ["n\\s*%\\s*2\\s*===\\s*0"],
            hint: "A number is even when dividing by 2 leaves nothing behind: n % 2 === 0. Three equals signs.",
            success:
              "Correct. Two equals signs would also work here, but `===` should be the default everywhere — the conversion rules behind `==` are where JavaScript's strangest behaviour lives.",
          },
          solution: `const n = Number(line);

if (n % 2 === 0) {
  console.log("Even");
} else {
  console.log("Odd");
}`,
        },

        rust: {
          hook:
            "You write `if items` meaning 'if there is anything in this list'. In Python that works. In Rust it does not compile — and the error message tells you exactly why. What is Rust objecting to?",
          body: [
            "That a condition must already be a bool. Rust has no truthiness at all: not for numbers, not for collections, not for Option.",
            "So there is nothing to memorise. `if count > 0`, `if !items.is_empty()`, `if let Some(x) = maybe`. You write what you mean and the compiler checks it.",
            "The `=` versus `==` trap does not exist either. Assignment is not an expression in Rust, so `if x = 5` cannot compile.",
            "What Rust adds instead is that `if` produces a VALUE. `let grade = if m >= 90 { \"A\" } else { \"Pass\" };` is ordinary Rust — no ternary operator needed, because the if itself is the expression.",
            "Both branches must then give the same type, and if there is no `else` the if must produce nothing. That sounds fussy until you notice it removes the class of bug where one branch forgets to return.",
          ],
          predict: {
            ask: "What does this Rust code do?",
            code: `let m = 75;

let grade = if m >= 90 {
    "A"
} else {
    "Pass"
};

println!("{}", grade);`,
            choices: [
              { text: "Will not compile — if is a statement", why: "In Rust it is an expression. This pattern is completely ordinary and replaces the ternary operator." },
              { text: "Prints Pass", why: "Correct. The if produces a value, and that value is bound to grade. Note there is no semicolon after the branch values — that is what makes them the result." },
              { text: "Prints A", why: "m is 75, which is not at least 90, so the else branch is taken." },
              { text: "Prints true", why: "The if does not produce its own condition — it produces whichever branch value was chosen." },
            ],
            answer: 1,
          },
          example: `let m = 75;

if m >= 90 {
    println!("A");
} else if m >= 50 {
    println!("Pass");
} else {
    println!("Fail");
}

// no truthiness at all
// if 0 { }              will not compile
// if items { }          will not compile
if !items.is_empty() { }         // say what you mean

// if produces a VALUE — no ternary needed
let grade = if m >= 90 { "A" } else { "Pass" };`,
          notes: [
            { token: "no brackets round the condition", meaning: "but the braces are always required" },
            { token: "no truthiness", meaning: "a condition must already be a bool. Nothing converts" },
            { token: "if as an expression", meaning: "produces a value. Both branches must agree on the type" },
            { token: "no semicolon on the branch value", meaning: "a semicolon would throw the value away" },
          ],
          prompt:
            "Read a number and print Even or Odd. Use the remainder operator. Note Rust needs no brackets round the condition, but always wants the braces.",
          starter: `let n: i32 = line.trim().parse().unwrap();

if  {
    println!("Even");
} else {
    println!("Odd");
}`,
          rules: {
            regex: ["n\\s*%\\s*2\\s*==\\s*0"],
            hint: "A number is even when dividing by 2 leaves nothing behind: n % 2 == 0. No brackets round it, but keep the braces.",
            success:
              "Correct. You could also write this as an expression: `println!(\"{}\", if n % 2 == 0 { \"Even\" } else { \"Odd\" });` — the if hands back the string directly.",
          },
          solution: `let n: i32 = line.trim().parse().unwrap();

if n % 2 == 0 {
    println!("Even");
} else {
    println!("Odd");
}`,
        },
      },
    },

    /* --------------------------------------------------------- choose -- */
    {
      id: "choose",
      kicker: "02",
      title: "Choosing among many",
      hook:
        "You forget one keyword inside a switch. The code compiles, runs, and quietly executes every case below the one you wanted. Which keyword, and why is that even allowed?",
      body: [
        "`break`. Without it, control falls out of one case and straight into the next, running its body too, and onwards until it hits a break or the end.",
        "It is allowed because C decided a switch is a jump into a block of code rather than a set of separate options. Once you jump in, you keep going. C++, Java and JavaScript all inherited that.",
        "It is occasionally useful — two cases that should do the same thing can share a body by deliberately falling through — but the overwhelming majority of the time it is a bug, and a silent one.",
        "Use a switch when you are comparing one value against many fixed possibilities. It reads better than a long else-if chain and, in some languages, compiles into a jump table rather than a sequence of comparisons.",
        "Newer languages removed the trap rather than documenting it. Rust's `match` never falls through and must cover every possible value, so a case you forgot is a compile error rather than silence.",
      ],
      predict: {
        ask: "What does this C++ code print when day is 2?",
        code: `switch (day) {
  case 1: cout << "Mon ";
  case 2: cout << "Tue ";
  case 3: cout << "Wed ";
  default: cout << "?";
}`,
        choices: [
          { text: "Tue", why: "That would need a break at the end of case 2. Without one, control keeps going." },
          { text: "Tue Wed ?", why: "Correct. Control jumps into case 2 and then falls through case 3 and default, because nothing stops it." },
          { text: "Mon Tue Wed ?", why: "It jumps straight to the matching case, so case 1 is skipped entirely. Only the cases BELOW the match run." },
          { text: "?", why: "default only runs when nothing matched, or when control falls into it — which is what happens here, but after Tue and Wed." },
        ],
        answer: 1,
      },
      viz: traceSwitch(),
      example: `switch (day) {
  case 1:
    cout << "Monday";
    break;                 // without this, it falls through
  case 6:
  case 7:                  // deliberate fallthrough — both mean weekend
    cout << "Weekend";
    break;
  default:
    cout << "Unknown";
}`,
      notes: [
        { token: "break", meaning: "leaves the switch. Without it control falls into the next case" },
        { token: "case 6: case 7:", meaning: "deliberate fallthrough. Two values, one body" },
        { token: "default", meaning: "runs when nothing matched. Put it last" },
        { token: "only whole numbers and chars", meaning: "C++ switch will not take a string" },
      ],
      challenge: {
        prompt:
          "Write a switch on grade that prints Excellent for 'A', Good for 'B', and Try again for anything else. Do not let one case run into the next.",
        starter: `switch (grade) {
  case 'A':
    cout << "Excellent";
    
  case 'B':
    cout << "Good";
    
  default:
    cout << "Try again";
}`,
        rules: {
          regex: ["Excellent\";\\s*break", "Good\";\\s*break"],
          hint: "Put a break after each cout, or 'A' will print Excellent, Good and Try again all at once.",
          success:
            "Correct. Modern C++ has [[fallthrough]]; for the rare case where you WANT it — writing that makes the intent explicit and stops reviewers assuming it is a bug.",
        },
        solution: `switch (grade) {
  case 'A':
    cout << "Excellent";
    break;
  case 'B':
    cout << "Good";
    break;
  default:
    cout << "Try again";
}`,
      },

      alt: {
        c: {
          example: `switch (day) {
  case 1:
    printf("Monday");
    break;                 /* without this, it falls through */
  case 6:
  case 7:                  /* deliberate — both mean weekend */
    printf("Weekend");
    break;
  default:
    printf("Unknown");
}`,
          notes: [
            { token: "break", meaning: "leaves the switch. Without it control falls into the next case" },
            { token: "case 6: case 7:", meaning: "deliberate fallthrough. Two values, one body" },
            { token: "only integers and chars", meaning: "C switch cannot take a string at all" },
            { token: "declaring inside a case", meaning: "needs its own braces, or the compiler objects" },
          ],
          starter: `switch (grade) {
  case 'A':
    printf("Excellent");
    
  case 'B':
    printf("Good");
    
  default:
    printf("Try again");
}`,
          rules: {
            regex: ["Excellent\"\\);\\s*break", "Good\"\\);\\s*break"],
            hint: "Put a break after each printf, or 'A' will print all three.",
            success:
              "Correct. Compile with -Wimplicit-fallthrough and the compiler will point at every case that runs into the next one without saying so.",
          },
          solution: `switch (grade) {
  case 'A':
    printf("Excellent");
    break;
  case 'B':
    printf("Good");
    break;
  default:
    printf("Try again");
}`,
        },

        python: {
          hook:
            "Python had no switch statement at all until 2021. For thirty years people wrote long if-elif chains or looked things up in a dict. What did it eventually get instead?",
          body: [
            "`match`, and it is not really a switch — it is pattern matching, which is a considerably bigger idea.",
            "A plain switch compares one value against several constants. `match` can also take the value apart: match a tuple by shape, a list by length, a dictionary by which keys it has, an object by its fields.",
            "There is no fallthrough. Each case is genuinely separate, so the missing-break bug cannot happen.",
            "`case _:` is the catch-all, and it plays the role of default. Unlike Rust, Python does not force you to have one — an unmatched value simply falls out of the match and nothing runs.",
            "For simple value-to-value mapping, a dict is still the most idiomatic Python: `days.get(day, \"Unknown\")` is one line and needs no match at all.",
          ],
          predict: {
            ask: "What does this Python code print?",
            code: `point = (0, 5)

match point:
    case (0, 0):
        print("origin")
    case (0, y):
        print(f"on the y axis at {y}")
    case (x, 0):
        print(f"on the x axis at {x}")
    case _:
        print("somewhere else")`,
            choices: [
              { text: "somewhere else", why: "The catch-all is only reached when nothing above matched. The second case matches this point." },
              { text: "on the y axis at 5", why: "Correct. `case (0, y)` matches by SHAPE — a two-part tuple starting with 0 — and binds the second part to y. That is pattern matching, not just value comparison." },
              { text: "origin", why: "That case needs both parts to be 0. Here the second is 5." },
              { text: "SyntaxError", why: "match has been valid Python since 3.10. Note it is a soft keyword — a variable called match still works." },
            ],
            answer: 1,
          },
          example: `# Python 3.10 and later
match day:
    case 1:
        print("Monday")
    case 6 | 7:              # several values, one case
        print("Weekend")
    case _:                  # the catch-all
        print("Unknown")

# no break needed — cases never fall through

# for plain value mapping, a dict is still more Pythonic
days = {1: "Monday", 6: "Weekend", 7: "Weekend"}
print(days.get(day, "Unknown"))`,
            notes: [
            { token: "match / case", meaning: "Python 3.10 and later. Pattern matching, not just a switch" },
            { token: "case 6 | 7", meaning: "several values in one case" },
            { token: "case _", meaning: "the catch-all. Plays the role of default" },
            { token: "no break", meaning: "cases never fall through. The trap does not exist" },
          ],
          prompt:
            "Write a match on grade that prints Excellent for 'A', Good for 'B', and Try again for anything else.",
          starter: `match grade:
    case :
        print("Excellent")
    case :
        print("Good")
    case :
        print("Try again")`,
          rules: {
            regex: ["case\\s+'A'\\s*:|case\\s+\"A\"\\s*:", "case\\s+'B'\\s*:|case\\s+\"B\"\\s*:", "case\\s+_\\s*:"],
            hint: "case 'A': then case 'B': then case _: for the catch-all.",
            success:
              "Correct. Watch out for one Python-only trap: `case A:` with a bare NAME does not compare against a variable A — it matches anything and binds it to A. Only literals and dotted names compare.",
          },
          solution: `match grade:
    case 'A':
        print("Excellent")
    case 'B':
        print("Good")
    case _:
        print("Try again")`,
        },

        java: {
          body: [
            "`break`. Without it, control falls out of one case and straight into the next, running its body too.",
            "Java inherited that from C, and then in Java 14 added a second form that removes it: the arrow syntax.",
            "`case 'A' -> System.out.println(\"Excellent\");` runs only that branch. No fallthrough is possible, and no break is needed.",
            "The arrow form can also produce a value, so a switch can be assigned straight into a variable: `String s = switch (grade) { case 'A' -> \"Excellent\"; default -> \"Try again\"; };`",
            "Java's switch also takes Strings, which C and C++ do not — and since Java 21 it can match on the TYPE of an object, which starts to look like Rust's match.",
          ],
          predict: {
            ask: "What does this Java code print when grade is 'A'?",
            code: `switch (grade) {
  case 'A' -> System.out.println("Excellent");
  case 'B' -> System.out.println("Good");
  default  -> System.out.println("Try again");
}`,
            choices: [
              { text: "Excellent Good Try again", why: "That is what the OLD colon syntax without breaks would do. The arrow form never falls through." },
              { text: "Excellent", why: "Correct. The arrow form runs exactly one branch — no break needed, and fallthrough is not even possible." },
              { text: "Will not compile without break", why: "break is not allowed in the arrow form at all. It exists precisely so you do not need one." },
              { text: "Try again", why: "'A' matches the first case, so default is never reached." },
            ],
            answer: 1,
          },
          example: `// the old form — needs break
switch (day) {
  case 1:
    System.out.println("Monday");
    break;
  case 6: case 7:
    System.out.println("Weekend");
    break;
  default:
    System.out.println("Unknown");
}

// the arrow form, Java 14+ — no fallthrough, no break
switch (day) {
  case 1     -> System.out.println("Monday");
  case 6, 7  -> System.out.println("Weekend");
  default    -> System.out.println("Unknown");
}

// and it can produce a value
String name = switch (day) {
  case 1    -> "Monday";
  case 6, 7 -> "Weekend";
  default   -> "Unknown";
};`,
          notes: [
            { token: "case 1 ->", meaning: "the arrow form. Runs one branch, never falls through" },
            { token: "case 6, 7 ->", meaning: "several values in one branch, comma separated" },
            { token: "switch as an expression", meaning: "produces a value you can assign" },
            { token: "switch on a String", meaning: "allowed in Java, unlike C and C++" },
          ],
          prompt:
            "Write a switch on grade that prints Excellent for 'A', Good for 'B', and Try again for anything else. Use the arrow form so fallthrough cannot happen.",
          starter: `switch (grade) {
  case 'A'  System.out.println("Excellent");
  case 'B'  System.out.println("Good");
  default   System.out.println("Try again");
}`,
          rules: {
            regex: ["case\\s+'A'\\s*->", "case\\s+'B'\\s*->", "default\\s*->"],
            hint: "Use -> after each case label instead of a colon. No break is needed, or allowed.",
            success:
              "Correct. Prefer the arrow form in new code: it cannot fall through, it needs no break, and it can be used as an expression.",
          },
          solution: `switch (grade) {
  case 'A' -> System.out.println("Excellent");
  case 'B' -> System.out.println("Good");
  default  -> System.out.println("Try again");
}`,
        },

        javascript: {
          example: `switch (day) {
  case 1:
    console.log("Monday");
    break;                 // without this, it falls through
  case 6:
  case 7:                  // deliberate — both mean weekend
    console.log("Weekend");
    break;
  default:
    console.log("Unknown");
}

// switch uses === , so types matter
switch ("1") {
  case 1: console.log("number");  break;   // does NOT match
  case "1": console.log("string"); break;  // this one does
}`,
          notes: [
            { token: "break", meaning: "leaves the switch. Without it control falls into the next case" },
            { token: "switch uses ===", meaning: "so \"1\" never matches case 1. Strict, unlike ==" },
            { token: "let inside a case", meaning: "needs its own braces — cases share one scope otherwise" },
            { token: "an object lookup", meaning: "often cleaner: ({1: 'Monday'})[day] ?? 'Unknown'" },
          ],
          prompt:
            "Write a switch on grade that prints Excellent for 'A', Good for 'B', and Try again for anything else. Do not let one case run into the next.",
          starter: `switch (grade) {
  case "A":
    console.log("Excellent");
    
  case "B":
    console.log("Good");
    
  default:
    console.log("Try again");
}`,
          rules: {
            regex: ['Excellent"\\);\\s*break', 'Good"\\);\\s*break'],
            hint: "Put a break after each console.log, or \"A\" will print all three.",
            success:
              "Correct, and note switch compares with === — so `case 1` would never match the string \"1\", even though `1 == \"1\"` is true elsewhere in the language.",
          },
          solution: `switch (grade) {
  case "A":
    console.log("Excellent");
    break;
  case "B":
    console.log("Good");
    break;
  default:
    console.log("Try again");
}`,
        },

        rust: {
          hook:
            "Every other language here lets you forget a case in a switch, and says nothing. Rust will not compile a `match` that misses one. Why is that worth the strictness?",
          body: [
            "Because a forgotten case is a real bug that produces silence rather than an error, and Rust's whole design is about moving that kind of failure to compile time.",
            "`match` must be exhaustive: every possible value has to be covered, or the code does not build. Add a new variant to an enum later and every match on it becomes a compile error listing exactly where you need to handle it.",
            "There is no fallthrough. Each arm is separate, so the missing-break bug does not exist.",
            "And match does far more than compare constants. It takes values apart: match a tuple by shape, a struct by its fields, an enum by which variant it is, a range with `1..=5`, and bind pieces to names while doing it.",
            "`_` is the catch-all, and it is how you say 'everything else' when you genuinely mean it. Using it too eagerly throws away the exhaustiveness check, so prefer listing the cases you know about.",
          ],
          predict: {
            ask: "What does the Rust compiler say about this?",
            code: `enum Colour { Red, Green, Blue }

fn name(c: Colour) -> &'static str {
    match c {
        Colour::Red => "red",
        Colour::Green => "green",
    }
}`,
            choices: [
              { text: "It compiles; Blue returns nothing", why: "Rust has no 'returns nothing' fallback. A match must produce a value on every path." },
              { text: "Error: non-exhaustive patterns, `Colour::Blue` not covered", why: "Correct, and it names the exact missing variant. Add a variant to the enum later and every match on it fails the same way, showing you every place to update." },
              { text: "It compiles with a warning", why: "This is an error, not a warning. Exhaustiveness is enforced, not suggested." },
              { text: "Error: match needs a `_` arm", why: "A `_` arm would satisfy it, but so would handling Blue explicitly — and that is usually better, since `_` silences future checks too." },
            ],
            answer: 1,
          },
          example: `match day {
    1     => println!("Monday"),
    6 | 7 => println!("Weekend"),      // several values, one arm
    2..=5 => println!("Midweek"),      // a RANGE
    _     => println!("Unknown"),      // the catch-all
}

// match is an expression, so it produces a value
let name = match day {
    1 => "Monday",
    _ => "Other",
};

// and it takes values apart
match point {
    (0, 0) => println!("origin"),
    (0, y) => println!("on the y axis at {}", y),
    (x, _) => println!("x is {}", x),
}`,
          notes: [
            { token: "must be exhaustive", meaning: "miss a case and it will not compile" },
            { token: "6 | 7", meaning: "several values in one arm" },
            { token: "2..=5", meaning: "a range. Switch in other languages cannot do this" },
            { token: "(0, y)", meaning: "matches by SHAPE and binds y. This is the real power" },
          ],
          prompt:
            "Write a match on grade that prints Excellent for 'A', Good for 'B', and Try again for anything else. Remember it must cover every possible char.",
          starter: `match grade {
     => println!("Excellent"),
     => println!("Good"),
     => println!("Try again"),
}`,
          rules: {
            regex: ["'A'\\s*=>", "'B'\\s*=>", "_\\s*=>"],
            hint: "'A' => ..., 'B' => ..., then _ => ... for everything else. The catch-all is required here, since a char has far too many values to list.",
            success:
              "Correct. The `_` is not optional in this case — without it Rust would refuse to compile, because a char has thousands of possible values and you have handled two.",
          },
          solution: `match grade {
    'A' => println!("Excellent"),
    'B' => println!("Good"),
    _   => println!("Try again"),
}`,
        },
      },
    },

    /* --------------------------------------------------------- repeat -- */
    {
      id: "repeat",
      kicker: "03",
      title: "Repeating",
      hook:
        "You want to walk a list of colours and print each one. You could count from 0 to n, or ask for each item directly. One of those can go out of bounds and one cannot. Which, and why does it matter?",
      body: [
        "The counting loop can. It hands you a POSITION, and you use that position to look the value up — so an off-by-one in the condition reads past the end.",
        "The for-each loop cannot. It hands you the VALUE directly and there is no index to get wrong.",
        "So the rule is simple: use for-each unless you actually need the position. You need it when comparing neighbours, writing to a different index, or walking backwards.",
        "The third form is `while`, for when you cannot count the laps in advance — until the user types quit, until nothing changed this round.",
        "C++ has all three. The counting loop packs setup, condition and step onto one line; the range-based for gives you each value; and while gives you just a condition.",
        "One C++ detail worth knowing early: write `for (const auto& c : items)` rather than `for (auto c : items)`. Without the `&` every element is COPIED, which for strings or structs is real work done for nothing.",
      ],
      predict: {
        ask: "What does this C++ loop print?",
        code: `vector<int> a = {10, 20, 30};

for (int i = 0; i <= a.size(); i++) {
  cout << a[i] << " ";
}`,
        choices: [
          { text: "10 20 30", why: "The condition is <= rather than <, so the loop runs one extra time." },
          { text: "10 20 30 then undefined behaviour", why: "Correct. i reaches 3, which is past the last index 2. C++ does not check, so it reads whatever is there — often rubbish, sometimes a crash." },
          { text: "Will not compile", why: "It compiles cleanly. That is what makes off-by-one errors dangerous in C++." },
          { text: "10 20", why: "Nothing here stops early. The loop runs four times, not two." },
        ],
        answer: 1,
      },
      viz: traceLoopForms(),
      example: `vector<string> colours = {"red", "green", "blue"};

// counting loop — gives you the POSITION
for (int i = 0; i < colours.size(); i++)
  cout << i << ": " << colours[i] << "\\n";

// range-based for — gives you the VALUE
for (const auto& c : colours)     // the & avoids a copy
  cout << c << "\\n";

// while — for when you cannot count the laps
while (!done)
  step();

// leaving early, or skipping one
for (const auto& c : colours) {
  if (c == "green") continue;     // skip this one
  if (c == "blue")  break;        // stop entirely
}`,
      notes: [
        { token: "i < size()", meaning: "less than, never <=. The last index is size() - 1" },
        { token: "const auto& c", meaning: "the & avoids copying each element" },
        { token: "continue", meaning: "skip the rest of this lap and go to the next" },
        { token: "break", meaning: "leave the loop entirely" },
      ],
      challenge: {
        prompt:
          "Print every colour in the list, without using an index. Use the form that hands you the value, and avoid copying each string.",
        starter: `vector<string> colours = {"red", "green", "blue"};

for ( ) {
  cout << c << "\\n";
}`,
        rules: {
          regex: ["const\\s+auto\\s*&\\s*c\\s*:\\s*colours|const\\s+string\\s*&\\s*c\\s*:\\s*colours"],
          hint: "for (const auto& c : colours) — const because you are only reading, & so the string is not copied.",
          success:
            "Correct. Both parts earn their place: the & avoids copying every string, and the const says you will not modify them, which lets the compiler help you keep that promise.",
        },
        solution: `vector<string> colours = {"red", "green", "blue"};

for (const auto& c : colours) {
  cout << c << "\\n";
}`,
      },

      alt: {
        c: {
          body: [
            "The counting loop can. It hands you a POSITION, and you use that to look the value up — so an off-by-one reads past the end.",
            "C only has the counting loop and `while`. There is no for-each at all, because there is nothing in the language that knows how big an array is.",
            "That is the deeper problem: an array passed to a function decays to a plain pointer, and the size is lost. You have to pass the length alongside it, every time.",
            "So every C loop is a counting loop, and every counting loop is a chance to run off the end. C does not check, so reading past the end gives you whatever happens to be in that memory.",
            "For a string there is one shortcut: it ends with a hidden zero byte, so `for (int i = 0; s[i]; i++)` walks until it finds it. The string carries its own end marker even though an array does not.",
          ],
          predict: {
            ask: "What does this C function print?",
            code: `void show(int a[]) {
  int n = sizeof(a) / sizeof(a[0]);
  printf("%d", n);
}

int nums[10];
show(nums);`,
            choices: [
              { text: "10", why: "That would work in the function where nums was declared. Passing it to a function loses the size." },
              { text: "1 or 2", why: "Correct. Inside the function a is a POINTER, not an array. sizeof(a) is the pointer size — 8 on most machines — so 8/4 gives 2." },
              { text: "Will not compile", why: "It compiles, usually with a warning. That is what makes this trap so common." },
              { text: "0", why: "sizeof never returns 0 for a valid type. The division gives a small non-zero number." },
            ],
            answer: 1,
          },
          example: `char *colours[] = {"red", "green", "blue"};
int n = 3;                        /* you must carry the size yourself */

/* counting loop — the only general form C has */
for (int i = 0; i < n; i++)
  printf("%s\\n", colours[i]);

/* a string carries its own end marker */
for (int i = 0; s[i]; i++)
  putchar(s[i]);

/* while — for when you cannot count the laps */
while (!done)
  step();`,
          notes: [
            { token: "no for-each", meaning: "C has no way to know how long an array is" },
            { token: "pass n alongside", meaning: "the array decays to a pointer and the size is lost" },
            { token: "s[i] as the condition", meaning: "a string ends with a 0 byte, which is false" },
            { token: "i < n", meaning: "less than, never <=. C will not stop you either way" },
          ],
          prompt:
            "Print every colour in the array. C has no for-each, so use a counting loop — and remember the size has to come from somewhere.",
          starter: `char *colours[] = {"red", "green", "blue"};
int n = 3;

for () {
  printf("%s\\n", colours[i]);
}`,
          rules: {
            regex: ["int\\s+i\\s*=\\s*0\\s*;\\s*i\\s*<\\s*n\\s*;\\s*i\\+\\+"],
            hint: "for (int i = 0; i < n; i++) — less than n, never <=, and the size must be passed in separately.",
            success:
              "Correct. This is why C code passes a length everywhere: the array itself has no idea how long it is, and nothing will stop you reading past the end.",
          },
          solution: `char *colours[] = {"red", "green", "blue"};
int n = 3;

for (int i = 0; i < n; i++) {
  printf("%s\\n", colours[i]);
}`,
        },

        python: {
          body: [
            "The counting loop can. It hands you a POSITION, and you use that to look the value up — so an off-by-one reads past the end.",
            "Python has no C-style counting loop at all. There is no `for (i = 0; i < n; i++)`. Every for loop is a for-each.",
            "To count, you loop over `range(n)`, which produces the numbers 0 to n-1 and hands them to you one at a time. So even counting is really iterating.",
            "That is deliberate: `for c in colours` is the normal way, and it cannot go out of bounds. When you genuinely need the index too, `enumerate` gives you both at once.",
            "The one trap is that `range` excludes its end. `range(1, 5)` gives 1, 2, 3, 4 — never 5. Everybody gets caught by that once.",
            "Python is also unusual in having `else` on a loop: it runs when the loop finished normally rather than through `break`. Useful for search loops, and almost nobody knows it exists.",
          ],
          predict: {
            ask: "What does this Python loop print?",
            code: `for i in range(1, 5):
    print(i, end=" ")`,
            choices: [
              { text: "1 2 3 4 5", why: "range excludes its end. To include 5 you would write range(1, 6)." },
              { text: "1 2 3 4", why: "Correct. range(a, b) starts at a and stops BEFORE b. This is the single most common Python off-by-one." },
              { text: "0 1 2 3 4", why: "With two arguments the first is the start. range(5) alone would begin at 0." },
              { text: "1 2 3 4 5 6", why: "Nothing here goes past 4 — the end is exclusive." },
            ],
            answer: 1,
          },
          example: `colours = ["red", "green", "blue"]

# for-each — the normal way. Cannot go out of bounds
for c in colours:
    print(c)

# when you need the index too
for i, c in enumerate(colours):
    print(i, c)

# counting — there is no C-style for. You iterate a range
for i in range(len(colours)):
    print(colours[i])

# while — for when you cannot count the laps
while not done:
    step()

# skip one, or leave early
for c in colours:
    if c == "green": continue
    if c == "blue":  break`,
          notes: [
            { token: "no C-style for", meaning: "every for loop is a for-each. Counting means iterating a range" },
            { token: "range(1, 5)", meaning: "1, 2, 3, 4. The end is EXCLUDED" },
            { token: "enumerate(x)", meaning: "gives index and value together. Use it instead of range(len(x))" },
            { token: "for ... else", meaning: "the else runs if the loop was not broken out of" },
          ],
          prompt:
            "Print every colour in the list, without using an index at all.",
          starter: `colours = ["red", "green", "blue"]

for :
    print(c)`,
          rules: {
            mustNot: ["range(", "[i]"],
            regex: ["for\\s+c\\s+in\\s+colours\\s*:"],
            hint: "for c in colours: — no range, no index. Python hands you the value directly.",
            success:
              "Correct. `for i in range(len(colours))` also works and is what people write coming from C — but it is longer, slower, and can go out of bounds, so it is worth unlearning.",
          },
          solution: `colours = ["red", "green", "blue"]

for c in colours:
    print(c)`,
        },

        java: {
          example: `String[] colours = {"red", "green", "blue"};

// counting loop — gives you the POSITION
for (int i = 0; i < colours.length; i++)
  System.out.println(i + ": " + colours[i]);

// enhanced for — gives you the VALUE
for (String c : colours)
  System.out.println(c);

// while — for when you cannot count the laps
while (!done)
  step();

// skip one, or leave early
for (String c : colours) {
  if (c.equals("green")) continue;
  if (c.equals("blue"))  break;
}`,
          notes: [
            { token: "colours.length", meaning: "no brackets for an array. Lists use .size()" },
            { token: "for (String c : colours)", meaning: "the enhanced for. No index to get wrong" },
            { token: "c.equals(...)", meaning: "compare Strings with equals, never ==" },
            { token: "modifying while iterating", meaning: "throws ConcurrentModificationException on a List" },
          ],
          prompt:
            "Print every colour in the array, without using an index. Use the form that hands you the value.",
          starter: `String[] colours = {"red", "green", "blue"};

for ( ) {
  System.out.println(c);
}`,
          rules: {
            regex: ["for\\s*\\(\\s*String\\s+c\\s*:\\s*colours\\s*\\)"],
            hint: "for (String c : colours) — the type, a name, a colon, and the collection.",
            success:
              "Correct. One thing to know for later: removing from a List while looping over it this way throws ConcurrentModificationException. Use an explicit Iterator, or removeIf.",
          },
          solution: `String[] colours = {"red", "green", "blue"};

for (String c : colours) {
  System.out.println(c);
}`,
        },

        javascript: {
          body: [
            "The counting loop can. It hands you a POSITION, and you use that to look the value up — so an off-by-one reads past the end. In JavaScript that gives `undefined` rather than a crash, which is arguably worse.",
            "JavaScript has three for-loop forms and one of them is a trap.",
            "`for...of` gives you the VALUES. This is the one you want for arrays.",
            "`for...in` gives you the KEYS — and for an array those keys are the indexes as STRINGS, in no guaranteed order, including anything anyone added to the prototype. Using it on an array is almost always a mistake.",
            "So: `for (const c of colours)` for values, `for (const [i, c] of colours.entries())` when you need both, and `for...in` only for the keys of a plain object.",
            "Use `const` for the loop variable unless you reassign it — a fresh binding is made each lap, which matters when you capture it in a callback.",
          ],
          predict: {
            ask: "What does this print?",
            code: `const a = [10, 20, 30];

for (const x in a)  process.stdout.write(x + " ");
console.log();
for (const x of a)  process.stdout.write(x + " ");`,
            choices: [
              { text: "10 20 30  then  10 20 30", why: "for...in does not give values. It gives keys, which for an array are the indexes." },
              { text: "0 1 2  then  10 20 30", why: "Correct. for...in gives the KEYS as strings — \"0\", \"1\", \"2\" — while for...of gives the values. This is why for...in on an array is a bug." },
              { text: "0 1 2  then  0 1 2", why: "for...of gives values, not keys. That is the whole difference between them." },
              { text: "Will not compile", why: "Both forms are valid JavaScript, which is exactly what makes mixing them up so easy." },
            ],
            answer: 1,
          },
          example: `const colours = ["red", "green", "blue"];

// for...of — gives you the VALUE. Use this for arrays
for (const c of colours) console.log(c);

// when you need the index too
for (const [i, c] of colours.entries()) console.log(i, c);

// counting loop — gives you the POSITION
for (let i = 0; i < colours.length; i++) console.log(colours[i]);

// for...in gives KEYS as strings. Almost never right for an array
for (const k in colours) console.log(k);   // "0", "1", "2"

// while — for when you cannot count the laps
while (!done) step();`,
          notes: [
            { token: "for...of", meaning: "values. What you want for an array" },
            { token: "for...in", meaning: "keys, as strings, in no guaranteed order. Objects only" },
            { token: ".entries()", meaning: "index and value together" },
            { token: "a[99] on a short array", meaning: "gives undefined rather than crashing" },
          ],
          prompt:
            "Print every colour in the array, without using an index. Use the form that gives you values, not keys.",
          starter: `const colours = ["red", "green", "blue"];

for ( ) {
  console.log(c);
}`,
          rules: {
            mustNot: [" in colours"],
            regex: ["for\\s*\\(\\s*const\\s+c\\s+of\\s+colours\\s*\\)|for\\s*\\(\\s*let\\s+c\\s+of\\s+colours\\s*\\)"],
            hint: "for (const c of colours) — `of` gives values, `in` would give you the index keys instead.",
            success:
              "Correct, and the of/in distinction is one of the most common JavaScript mistakes: `for...in` on an array hands you \"0\", \"1\", \"2\" as strings, so `x + 1` gives \"01\".",
          },
          solution: `const colours = ["red", "green", "blue"];

for (const c of colours) {
  console.log(c);
}`,
        },

        rust: {
          body: [
            "The counting loop can — except Rust checks every index at run time and stops the program rather than reading rubbish. So the bug becomes a clear crash instead of silent corruption.",
            "Rust has no C-style for loop at all. `for x in collection` is the only form, and you iterate a range when you need numbers: `for i in 0..n`.",
            "`0..n` excludes n; `0..=n` includes it. That `=` is the whole difference and it is easy to miss.",
            "There are three ways to iterate a collection, and they differ in what you get. `for x in &v` borrows each item so you can read it. `for x in &mut v` borrows mutably so you can change it. `for x in v` takes OWNERSHIP — and the collection cannot be used afterwards.",
            "That last one catches everyone once: the loop compiles, and then the next line using the vector does not, with an error about a value having been moved.",
            "Rust also has `loop`, an infinite loop you leave with `break` — and `break` can carry a value out, so `let x = loop { ... break 5; };` is ordinary Rust.",
          ],
          predict: {
            ask: "What does the Rust compiler say about this?",
            code: `let colours = vec!["red", "green", "blue"];

for c in colours {
    println!("{}", c);
}

println!("{}", colours.len());`,
            choices: [
              { text: "It compiles and prints 3 at the end", why: "The loop took ownership of colours, so it no longer exists by the last line." },
              { text: "Error: borrow of moved value `colours`", why: "Correct. `for c in colours` MOVES the vector into the loop. Write `for c in &colours` to borrow it instead, and it works." },
              { text: "Error: colours must be mutable", why: "Nothing here modifies it. The problem is ownership, not mutability." },
              { text: "It compiles but prints 0", why: "Rust does not leave an emptied husk behind — the value is gone, and using it is a compile error." },
            ],
            answer: 1,
          },
          example: `let colours = vec!["red", "green", "blue"];

// borrow each item — the usual form
for c in &colours {
    println!("{}", c);
}

// with the index too
for (i, c) in colours.iter().enumerate() {
    println!("{} {}", i, c);
}

// counting — iterate a range
for i in 0..colours.len() { }     // 0 to len-1
for i in 0..=5 { }                // 0 to 5 INCLUSIVE

// takes ownership — colours is unusable afterwards
// for c in colours { }

// loop — infinite, and break can carry a value out
let found = loop {
    if ready { break 42; }
};`,
          notes: [
            { token: "for c in &colours", meaning: "borrows. The collection is still usable afterwards" },
            { token: "for c in colours", meaning: "MOVES it. The collection is gone" },
            { token: "0..n vs 0..=n", meaning: "excludes n, or includes it. The = is the difference" },
            { token: "break 42", meaning: "break can carry a value out of a `loop`" },
          ],
          prompt:
            "Print every colour in the vector, and make sure the vector can still be used afterwards.",
          starter: `let colours = vec!["red", "green", "blue"];

for  {
    println!("{}", c);
}

println!("{}", colours.len());`,
          rules: {
            regex: ["for\\s+c\\s+in\\s+&colours|for\\s+c\\s+in\\s+colours\\.iter\\(\\)"],
            hint: "for c in &colours — the & borrows it. Without the &, the loop takes ownership and the last line will not compile.",
            success:
              "Correct, and that single & is the whole exercise. Leave it off and the loop still works, but the next line using colours fails to compile — which is Rust telling you about a bug the other five languages would let you write.",
          },
          solution: `let colours = vec!["red", "green", "blue"];

for c in &colours {
    println!("{}", c);
}

println!("{}", colours.len());`,
        },
      },
    },
  ],
};
