import type { TopicLesson } from "@/lib/dsa/lessons/types";
import { traceIO, traceMutability, traceTypes } from "@/lib/dsa/viz/traceLang";

// Language track, topic 1.
//
// The C++ version is the base; `alt` carries the other five. Unlike the DSA
// chapters, the ANGLE changes here too — `27 + "Ada"` is a compile error in
// three of these languages, a runtime crash in one, and the perfectly legal
// string "27Ada" in two. Same expression, four outcomes.

export const LANG_FUNDAMENTALS: TopicLesson = {
  id: "lang-fundamentals",
  title: "Fundamentals",
  tagline: "Values, types, and boxes that hold them.",
  why:
    "Everything else in the language is built on three ideas: a value, the type that says what kind of thing it is, and a named box to keep it in. Most beginner bugs are one of these three behaving differently from how you assumed. Getting them straight now saves you weeks.",
  intro: {
    cpp: {
      heading: "What is C++",
      plain: [
        "C++ is a language for writing software where speed and control genuinely matter. Bjarne Stroustrup began it in 1979 as \"C with Classes\" — he wanted C's raw performance but with a way to organise large programs.",
        "It kept almost all of C, so C code is nearly always valid C++, and then added classes, templates, operator overloading and a large standard library.",
        "It is a big language. Nobody knows all of it, and that is normal — most working C++ uses a comfortable subset. The language has also changed enormously since 2011, and modern C++ looks very different from what you may find in older tutorials.",
      ],
      how: [
        "A compiler turns your source into machine code — the actual instructions your processor runs. There is no interpreter and no virtual machine underneath.",
        "That happens before the program ever starts, which is why type errors are caught while you build rather than while a user is waiting. It is also why the compiler can spend real effort optimising, and why C++ programs start instantly.",
        "There is no garbage collector. Memory you ask for is yours until you give it back — and modern C++ makes that automatic with destructors and smart pointers rather than manual free calls.",
      ],
      strengths: [
        "As fast as anything gets. You pay only for the features you actually use.",
        "Deterministic — no garbage collector pausing your program at an unpredictable moment.",
        "The standard library gives you vectors, maps, sorting and algorithms that are extremely well optimised.",
        "Runs on essentially everything, from microcontrollers to supercomputers.",
      ],
      costs: [
        "Long compile times, and error messages from templates that can run to hundreds of lines.",
        "Undefined behaviour: reading past an array or using freed memory does not stop the program, it does something arbitrary.",
        "Enormous surface area. Several ways to do most things, and decades of accumulated history.",
        "You have to think about memory and object lifetime in a way most languages here do not ask of you.",
      ],
      usedFor: [
        "Game engines — Unreal, Unity's core",
        "Browsers — Chrome, Firefox",
        "Databases — MySQL, MongoDB",
        "High-frequency trading",
        "Adobe and Autodesk applications",
        "Competitive programming",
      ],
    },

    c: {
      heading: "What is C",
      plain: [
        "C is the language almost everything else is built on. Dennis Ritchie wrote it at Bell Labs around 1972 for one immediate purpose: to write the Unix operating system in something other than assembly.",
        "It is remarkably small. About 32 keywords, no classes, no generics, no exceptions, no collections. What it gives you is direct access to memory and a syntax that maps closely onto what the machine does.",
        "Fifty years later it has barely changed, and it is still everywhere. Learning it teaches you what the other languages are hiding.",
      ],
      how: [
        "A compiler turns your source into machine code. There is nothing between your program and the processor — no runtime, no virtual machine, no garbage collector.",
        "Memory is entirely yours to manage. You ask for it with malloc and give it back with free, and if you forget the second one the program leaks until it runs out.",
        "C also does almost no checking. Reading past the end of an array is not an error — it reads whatever memory happens to be next, and carries on as though nothing happened.",
      ],
      strengths: [
        "Tiny and fast. A C program can run on a chip with a few kilobytes of memory.",
        "Predictable — you can usually reason about exactly what the machine will do.",
        "Portable in a way nothing else matches: there is a C compiler for essentially every processor ever made.",
        "It is the common language between systems. Python, Ruby and Node all call C libraries.",
      ],
      costs: [
        "No safety net at all. Buffer overflows and use-after-free are entire categories of security vulnerability that C makes easy.",
        "No strings, no lists, no maps. You build them, or find a library.",
        "Manual memory management, and leaks that only show up after hours of running.",
        "Very little help from the compiler compared to anything modern.",
      ],
      usedFor: [
        "The Linux, Windows and macOS kernels",
        "Embedded firmware and device drivers",
        "CPython — the Python interpreter itself",
        "SQLite, Redis, Git",
        "Anything with tight memory limits",
      ],
    },

    python: {
      heading: "What is Python",
      plain: [
        "Python is built around one idea: code is read far more often than it is written, so it should be easy to read. Guido van Rossum started it in 1989, and that priority shows in every design decision.",
        "There are no braces and no semicolons. Indentation defines structure, which forces the layout to match the logic. You write far less to say the same thing.",
        "It is also the least fussy language here about types — you never declare one, and the same name can hold a number now and a list later.",
      ],
      how: [
        "Python is interpreted, but not in the naive line-by-line sense. Your source is compiled to bytecode, and a virtual machine executes that bytecode instruction by instruction.",
        "Because that happens as the program runs, type errors are found when a line executes rather than when you build. A mistake on a branch that only runs at year end is found at year end.",
        "That extra layer costs speed: Python is typically 10 to 100 times slower than C for the same loop. The usual answer is not to write the loop in Python — libraries like NumPy do the heavy work in C and hand the result back.",
      ],
      strengths: [
        "Fastest of these six to get something working, by a wide margin.",
        "Very readable, which matters most on code somebody else has to change.",
        "The largest library ecosystem of any language here, especially for data and machine learning.",
        "Integers never overflow, and memory is handled for you.",
      ],
      costs: [
        "Slow. Not a problem for most work, and a serious one for tight loops.",
        "Type errors surface at run time, so tests carry weight that a compiler would otherwise carry.",
        "The GIL means threads do not run Python code in parallel on multiple cores.",
        "Packaging and virtual environments are a genuine and long-standing source of pain.",
      ],
      usedFor: [
        "Machine learning — PyTorch, TensorFlow",
        "Data analysis — pandas, NumPy",
        "Web backends — Django, FastAPI",
        "Automation and scripting",
        "Scientific computing",
      ],
    },

    java: {
      heading: "What is Java",
      plain: [
        "Java was designed in the mid-1990s at Sun Microsystems with one promise: write once, run anywhere. The same compiled program should run unchanged on any machine with a Java runtime.",
        "It is verbose on purpose. Everything is explicit — types, visibility, which class a thing belongs to — because it was built for large teams working on large codebases over long periods.",
        "That trade has aged well. Java is everywhere in banking, enterprise systems and Android, and code written twenty years ago still compiles and runs.",
      ],
      how: [
        "Java compiles to bytecode rather than machine code. Bytecode is not tied to any processor, which is what makes the same file run everywhere.",
        "The Java Virtual Machine then runs that bytecode — and while it runs, it watches. Code that executes often is compiled to real machine code on the fly. That is JIT compilation, and it is why long-running Java is fast, often within a factor of two of C++.",
        "Memory is managed by a garbage collector. You never free anything; the JVM works out what is unreachable and reclaims it, occasionally pausing to do so.",
      ],
      strengths: [
        "Fast once warmed up, and the JIT can optimise using information a static compiler never has.",
        "The same program really does run on any platform with a JVM.",
        "Exceptional tooling — profilers, debuggers and IDEs better than almost anything else here.",
        "A huge, stable ecosystem, and famously strong backwards compatibility.",
      ],
      costs: [
        "Verbose. The same idea takes noticeably more lines than in Python.",
        "Slow to start, because the JVM has to boot and the JIT has to warm up.",
        "Uses substantially more memory than C++ or Rust for equivalent work.",
        "Garbage collection pauses, which matter for anything with hard timing requirements.",
      ],
      usedFor: [
        "Android applications",
        "Banking and enterprise backends",
        "Big data — Hadoop, Spark, Kafka",
        "Minecraft",
        "Large-scale web services",
      ],
    },

    javascript: {
      heading: "What is JavaScript",
      plain: [
        "JavaScript was written in ten days in 1995 by Brendan Eich, to make web pages slightly interactive. Nobody expected it to become one of the most used languages in the world.",
        "That origin explains a lot. Several of its odd corners — the type conversions, the two kinds of nothing, the equality rules — are decisions made under extreme time pressure that could never be changed afterwards, because breaking them would break the web.",
        "It has improved enormously since 2015. Modern JavaScript is a genuinely pleasant language, provided you know which parts to avoid.",
      ],
      how: [
        "Your source is handed to an engine — V8 in Chrome and Node, SpiderMonkey in Firefox — which compiles it to machine code as it runs, the same JIT idea the JVM uses.",
        "It is single-threaded. There is one thread running your code, and an event loop that picks up the next piece of work when the current one finishes. That is why a slow loop freezes an entire page.",
        "Anything that waits — a network request, a file read — is handed off and its result queued for later. That is what async and await are managing, and it is the single most important thing to understand about the language.",
      ],
      strengths: [
        "The only language browsers run. If it happens in a web page, it happens in JavaScript.",
        "The same language on both sides — front end and back end, with shared code between them.",
        "npm is the largest package registry of any language, by a distance.",
        "The event loop handles thousands of waiting connections without a thread for each one.",
      ],
      costs: [
        "One number type, and it is a float. 0.1 + 0.2 is not 0.3, and whole numbers stop being exact past 2^53.",
        "Type conversion happens silently, so mistakes produce wrong values rather than errors.",
        "Single-threaded, so CPU-heavy work blocks everything else.",
        "Two kinds of nothing — null and undefined — and equality rules with genuinely absurd cases.",
      ],
      usedFor: [
        "Every interactive website",
        "Servers — Node, Deno, Bun",
        "Desktop apps — VS Code, Slack, Discord",
        "Mobile — React Native",
        "Build tooling and automation",
      ],
    },

    rust: {
      heading: "What is Rust",
      plain: [
        "Rust exists to answer one question: can you have C's speed without C's memory bugs? It reached 1.0 in 2015, out of a Mozilla project, and the answer turned out to be yes.",
        "Roughly 70 percent of the serious security vulnerabilities Microsoft and Google report are memory safety problems — use-after-free, buffer overflows, data races. Rust makes those impossible to write, and does it at compile time rather than by checking as the program runs.",
        "The price is a compiler that argues with you. Rust has a reputation for being hard, and the honest version is: it is hard for about a month, because it makes you learn things the other languages let you get away with not knowing.",
      ],
      how: [
        "Rust compiles to machine code, like C and C++. There is no interpreter, no virtual machine and no garbage collector.",
        "What is different is the ownership system. Every value has exactly one owner; when the owner goes out of scope, the value is freed. You can lend a value out by borrowing it, and the compiler checks that no borrow outlives what it points at.",
        "All of that is checked while compiling, so it costs nothing at run time. A Rust program does the same work as the equivalent C — the difference is that the mistakes were caught before it ever ran.",
      ],
      strengths: [
        "As fast as C and C++, with no garbage collector and no runtime overhead.",
        "Whole classes of bug are impossible: no use-after-free, no data races, no null dereference.",
        "The best error messages of any language here. They routinely tell you the fix.",
        "Cargo handles building, testing, dependencies and documentation in one tool that just works.",
      ],
      costs: [
        "A steep first month. Ownership and borrowing are genuinely new ideas, not just new syntax.",
        "Some structures are awkward — a doubly linked list needs Rc, RefCell and Weak to express at all.",
        "Slow compiles on large projects.",
        "A younger ecosystem, so for some domains the library you want may not exist yet.",
      ],
      usedFor: [
        "Parts of the Linux kernel and Windows",
        "Firefox's rendering engine",
        "Command-line tools — ripgrep, fd, bat",
        "WebAssembly",
        "Cloud infrastructure — Cloudflare, AWS, Discord",
      ],
    },
  },

  plain: [
    "A value is a piece of data: 27, the word Ada, true.",
    "A type is what kind of data it is. 27 is a whole number; \"27\" is text that happens to look like one. They are not the same, and the difference causes more first-week bugs than anything else.",
    "A variable is a named box you keep a value in. The name stays put; what is inside may change.",
  ],
  needs: ["Nothing. This is the first topic."],
  traps: [
    "\"27\" is text, not the number 27. Everything typed at a keyboard arrives as text and must be converted before you can do arithmetic with it.",
    "Assigning to a variable replaces what is inside the box. The old value is gone — there is no second box.",
    "Two values that print the same can still be different types. When something behaves strangely, check the type before you check anything else.",
  ],
  sections: [
    /* ------------------------------------------------------------ types -- */
    {
      id: "types",
      kicker: "01",
      title: "Values and types",
      hook:
        "You store the number 27 and the word Ada. Then you add them together. Before you read on: does that give you 27Ada, or an error, or a crash?",
      body: [
        "It depends entirely on the language — and that single question separates them more sharply than any amount of syntax.",
        "A value is a piece of data. A type is what kind of data it is. The type is what decides what an operation MEANS.",
        "Two numbers added means arithmetic. Two pieces of text added usually means joining them end to end. A number added to text has no obvious meaning at all, and that is where languages take different sides.",
        "C++ is statically typed: every box has a declared type, fixed when you write the code, and the compiler checks every operation before the program ever runs. int + string has no meaning, so it refuses to compile.",
        "That check costs you a moment now and saves you a whole class of bug later. The mistake is caught on your machine rather than on somebody else's.",
      ],
      predict: {
        ask: "What does this C++ program do?",
        code: `int age = 27;
string name = "Ada";

cout << age + name;`,
        choices: [
          { text: "27Ada", why: "That is what Java and JavaScript would do — but C++ has no + that takes an int on the left and a string on the right." },
          { text: "Will not compile", why: "Correct. C++ checks types before the program runs. There is no meaning for int + string, so the compiler stops you with an error rather than guessing." },
          { text: "Crashes when it runs", why: "That would be a runtime error, which is what Python does. C++ never gets that far — it is rejected at compile time." },
          { text: "27", why: "Nothing here discards the name. C++ will not quietly ignore part of an expression." },
        ],
        answer: 1,
      },
      viz: traceTypes(),
      example: `int    age   = 27;        // a whole number
double price = 9.99;      // a number with a decimal part
string name  = "Ada";     // text
bool   ready = true;      // true or false
char   grade = 'A';       // a single character

int total = age + 10;     // fine — number plus number
// int oops = age + name; // will not compile`,
      notes: [
        { token: "int", meaning: "a whole number. About -2.1 to 2.1 billion" },
        { token: "double", meaning: "a number with a decimal part" },
        { token: "string", meaning: "text. Needs #include <string>" },
        { token: "bool", meaning: "true or false. Not 1 and 0, though it converts" },
        { token: "the type is written down", meaning: "and cannot change later. That is what static typing means" },
      ],
      challenge: {
        prompt:
          "Declare a variable for each of these, using the right type: a count of 12 apples, a price of 4.50, a name Ada, and whether the shop is open. Then print the price.",
        starter: `  apples = 12;
  price  = 4.50;
  name   = "Ada";
  isOpen = true;

cout << ;`,
        rules: {
          regex: ["int\\s+apples", "double\\s+price|float\\s+price", "string\\s+name", "bool\\s+isOpen", "cout\\s*<<\\s*price"],
          hint: "int for a count, double for a price, string for text, bool for yes/no. Then cout << price;",
          success:
            "Correct. Using double for money is fine while you are learning, but real money code stores whole pence in an int — 0.1 cannot be written exactly in binary, and the tiny errors add up.",
        },
        solution: `int    apples = 12;
double price  = 4.50;
string name   = "Ada";
bool   isOpen = true;

cout << price;`,
      },

      alt: {
        c: {
          hook:
            "You store the number 27 and the word Ada. Then you add them together. Before you read on: does that give you 27Ada, or an error, or a crash?",
          body: [
            "It depends entirely on the language — and that single question separates them more sharply than any amount of syntax.",
            "A value is a piece of data. A type is what kind of data it is. The type is what decides what an operation MEANS.",
            "C is statically typed: every box has a declared type, and the compiler checks operations before the program runs.",
            "But C has no text type at all. Text is an array of characters ending in a hidden zero byte, and a `char *` is really just an address. So `age + name` is a number plus an address — which C will actually let you do, with a warning, and the result is meaningless.",
            "That is the C bargain throughout: it assumes you know what you are doing. Fewer guardrails than any other language here, and correspondingly more ways to be quietly wrong.",
          ],
          predict: {
            ask: "What does this C program do?",
            code: `int age = 27;
char *name = "Ada";

printf("%d", age + name);`,
            choices: [
              { text: "27Ada", why: "C has no idea how to join a number to text. printf(\"%d\") asks for one whole number and gets a confused one." },
              { text: "Compiles with a warning, prints nonsense", why: "Correct. name is an ADDRESS, so age + name is address arithmetic. C allows it, warns you, and prints a meaningless number." },
              { text: "Will not compile at all", why: "C++ would reject this. C is more permissive — pointer arithmetic is legal, so this is a warning rather than an error." },
              { text: "Crashes", why: "It does not crash here. It prints a wrong number, which is arguably worse — nothing tells you at run time that anything went wrong." },
            ],
            answer: 1,
          },
          example: `int    age   = 27;        /* a whole number */
double price = 9.99;      /* a number with a decimal part */
char  *name  = "Ada";     /* text: an ADDRESS of characters */
int    ready = 1;         /* C has no bool without stdbool.h */
char   grade = 'A';       /* a single character */

int total = age + 10;     /* fine — number plus number */`,
          notes: [
            { token: "int", meaning: "a whole number. About -2.1 to 2.1 billion" },
            { token: "double", meaning: "a number with a decimal part" },
            { token: "char *name", meaning: "not text — the ADDRESS where some characters start" },
            { token: "no bool", meaning: "0 is false, anything else is true. stdbool.h adds the word" },
            { token: "printf(\"%d\")", meaning: "you tell printf the type. Get it wrong and it prints rubbish" },
          ],
          prompt:
            "Declare a variable for each of these, using the right type: a count of 12 apples, a price of 4.50, a name Ada, and whether the shop is open. Then print the price with printf.",
          starter: `  apples = 12;
  price  = 4.50;
  name   = "Ada";
  isOpen = 1;

printf(, price);`,
          rules: {
            regex: ["int\\s+apples", "double\\s+price|float\\s+price", "char\\s*\\*\\s*name", "int\\s+isOpen", 'printf\\s*\\(\\s*"%[.0-9]*f"'],
            hint: 'int for a count, double for a price, char *name for text, int for yes/no. Print with printf("%f", price).',
            success:
              'Correct. The format string is doing real work here: printf("%d", price) would not convert anything, it would read a double as if it were an int and print rubbish.',
          },
          solution: `int    apples = 12;
double price  = 4.50;
char  *name   = "Ada";
int    isOpen = 1;

printf("%f", price);`,
        },

        python: {
          hook:
            "You store the number 27 and the word Ada. Then you add them together. Before you read on: does that give you 27Ada, or an error, or a crash?",
          body: [
            "It depends entirely on the language — and that single question separates them more sharply than any amount of syntax.",
            "A value is a piece of data. A type is what kind of data it is. The type is what decides what an operation MEANS.",
            "Python is dynamically typed. You never write the type down: the VALUE carries its own type, and the same name can hold a number now and text later.",
            "That does not mean types are ignored — it means they are checked when the line actually runs, not before. `27 + \"Ada\"` is a TypeError the moment it executes.",
            "So Python is strict about types but late about checking them. A mistake on a line that only runs on Christmas Day is found on Christmas Day. That is the trade for how quickly you can write it.",
          ],
          predict: {
            ask: "What does this Python program do?",
            code: `age = 27
name = "Ada"

print(age + name)`,
            choices: [
              { text: "27Ada", why: "Python refuses to guess. It will join text to text, but never a number to text." },
              { text: "Will not compile", why: "Python does not compile ahead of time in the way C++ and Rust do. The file is accepted; the error appears when this line runs." },
              { text: "TypeError when it runs", why: "Correct. Python checks the types at the moment the line executes: unsupported operand type(s) for +: 'int' and 'str'." },
              { text: "27", why: "Nothing here discards the name. Python does not quietly drop part of an expression." },
            ],
            answer: 2,
          },
          example: `age   = 27          # int — a whole number, any size
price = 9.99        # float — a number with a decimal part
name  = "Ada"       # str — text
ready = True        # bool — True or False, capital letter

total = age + 10    # fine — number plus number
# oops = age + name # TypeError when this line runs

print(type(age))    # <class 'int'> — ask what something is`,
          notes: [
            { token: "no type written", meaning: "the value carries its own type. That is dynamic typing" },
            { token: "int", meaning: "a whole number with NO upper limit. It grows as needed" },
            { token: "True / False", meaning: "capital letters. true would be an undefined name" },
            { token: "type(x)", meaning: "asks what something is. Your first debugging move" },
          ],
          prompt:
            "Store each of these in a variable: a count of 12 apples, a price of 4.50, a name Ada, and whether the shop is open. Then print the price.",
          starter: `apples = 
price  = 
name   = 
is_open = 

print()`,
          rules: {
            regex: ["apples\\s*=\\s*12", "price\\s*=\\s*4\\.50?", 'name\\s*=\\s*"Ada"', "is_open\\s*=\\s*True", "print\\s*\\(\\s*price\\s*\\)"],
            hint: "No types to write — just assign. Note True with a capital T.",
            success:
              "Correct. Python's int has no upper limit, so 2 ** 1000 simply works — that is genuinely unusual, and it is why the overflow traps in the other five languages do not exist here.",
          },
          solution: `apples = 12
price  = 4.50
name   = "Ada"
is_open = True

print(price)`,
        },

        java: {
          hook:
            "You store the number 27 and the word Ada. Then you add them together. Before you read on: does that give you 27Ada, or an error, or a crash?",
          body: [
            "It depends entirely on the language — and Java's answer surprises people who expect a strict language to refuse.",
            "A value is a piece of data. A type is what kind of data it is. The type is what decides what an operation MEANS.",
            "Java is statically typed: every box has a declared type and the compiler checks operations before the program runs. So far, exactly like C++.",
            "But Java makes one special exception. If either side of a + is a String, it converts the other side to text and joins them. So `age + name` compiles happily and gives \"27Ada\".",
            "That is convenient for printing and a real trap in arithmetic: `\"Total: \" + 1 + 2` gives \"Total: 12\", not \"Total: 3\", because it works left to right.",
          ],
          predict: {
            ask: "What does this Java code print?",
            code: `int age = 27;
String name = "Ada";

System.out.println(age + name);`,
            choices: [
              { text: "Will not compile", why: "C++ and Rust reject this. Java has a special rule for String and + that makes it legal." },
              { text: "27Ada", why: "Correct. When either side of + is a String, Java converts the other side to text and joins them." },
              { text: "TypeError when it runs", why: "That is Python's behaviour. Java settled this at compile time and produced a perfectly valid string-join." },
              { text: "27", why: "Nothing is discarded. Both parts end up in the result." },
            ],
            answer: 1,
          },
          example: `int     age   = 27;       // a whole number
double  price = 9.99;     // a number with a decimal part
String  name  = "Ada";    // text. Capital S — it is a class
boolean ready = true;     // true or false
char    grade = 'A';      // single quotes for one character

int total = age + 10;     // fine
String s  = age + name;   // ALSO fine — gives "27Ada"

// the classic trap
System.out.println("Total: " + 1 + 2);   // "Total: 12", not 3`,
          notes: [
            { token: "String, capital S", meaning: "a class, unlike int and double which are built in" },
            { token: "+ with a String", meaning: "joins instead of adding. The one big exception to Java's strictness" },
            { token: "\"Total: \" + 1 + 2", meaning: "left to right, so it becomes \"Total: 1\" then \"Total: 12\"" },
            { token: "'A' vs \"A\"", meaning: "single quotes are one char; double quotes are a String" },
          ],
          prompt:
            "Declare a variable for each of these, using the right type: a count of 12 apples, a price of 4.50, a name Ada, and whether the shop is open. Then print the price.",
          starter: `  apples = 12;
  price  = 4.50;
  name   = "Ada";
  isOpen = true;

System.out.println();`,
          rules: {
            regex: ["int\\s+apples", "double\\s+price|float\\s+price", "String\\s+name", "boolean\\s+isOpen", "println\\s*\\(\\s*price\\s*\\)"],
            hint: "int for a count, double for a price, String (capital S) for text, boolean for yes/no.",
            success:
              "Correct. Note boolean, not bool — Java spells it out. And String has a capital S because it is a class rather than a built-in type.",
          },
          solution: `int     apples = 12;
double  price  = 4.50;
String  name   = "Ada";
boolean isOpen = true;

System.out.println(price);`,
        },

        javascript: {
          hook:
            "You store the number 27 and the word Ada. Then you add them together. Before you read on: does that give you 27Ada, or an error, or a crash?",
          body: [
            "It depends entirely on the language — and JavaScript is the most permissive of the six.",
            "A value is a piece of data. A type is what kind of data it is. The type is what decides what an operation MEANS.",
            "JavaScript is dynamically typed like Python: the value carries its type, and you never write it down.",
            "But unlike Python it also CONVERTS types to make an operation work. `27 + \"Ada\"` does not fail — the number becomes text and you get \"27Ada\". No error, no warning.",
            "That flexibility is why `\"5\" - 2` is 3 while `\"5\" + 2` is \"52\": minus has no meaning for text so it converts to numbers, plus does, so it converts to text. Both are legal and neither tells you anything is odd.",
            "There is one more thing to know early: JavaScript has only ONE number type, and it is a float. There is no separate integer, so 0.1 + 0.2 is 0.30000000000000004 and whole numbers stop being exact past about 9 quadrillion.",
          ],
          predict: {
            ask: "What does this JavaScript code print?",
            code: `const age = 27;
const name = "Ada";

console.log(age + name);
console.log("5" - 2);`,
            choices: [
              { text: "27Ada  then  3", why: "Correct. + with text joins, so you get \"27Ada\". Minus has no meaning for text, so \"5\" is converted to a number and you get 3." },
              { text: "27Ada  then  \"52\"", why: "That would be true if minus behaved like plus. It does not — minus only has a numeric meaning, so it converts rather than joins." },
              { text: "TypeError  then  3", why: "Python would throw here. JavaScript converts instead of complaining." },
              { text: "27Ada  then  NaN", why: "\"5\" converts to the number 5 cleanly. NaN is what you would get from something like \"abc\" - 2." },
            ],
            answer: 0,
          },
          example: `const age   = 27;        // number — a float, always
const price = 9.99;      // also number. There is only one
const name  = "Ada";     // string
const ready = true;      // boolean

age + name               // "27Ada" — converts and joins
"5" - 2                  // 3 — converts and subtracts
0.1 + 0.2                // 0.30000000000000004

typeof age               // "number" — ask what something is`,
          notes: [
            { token: "one number type", meaning: "a float. No separate integer, so 0.1 + 0.2 is not exact" },
            { token: "+ converts to text", meaning: "if either side is a string" },
            { token: "- converts to number", meaning: "because minus has no meaning for text" },
            { token: "typeof x", meaning: "asks what something is. Your first debugging move" },
          ],
          prompt:
            "Store each of these in a variable: a count of 12 apples, a price of 4.50, a name Ada, and whether the shop is open. Use const, since none of them change. Then print the price.",
          starter: `const apples = ;
const price  = ;
const name   = ;
const isOpen = ;

console.log();`,
          rules: {
            regex: ["const\\s+apples\\s*=\\s*12", "const\\s+price\\s*=\\s*4\\.50?", 'const\\s+name\\s*=\\s*"Ada"', "const\\s+isOpen\\s*=\\s*true", "console\\.log\\s*\\(\\s*price\\s*\\)"],
            hint: "No types to write. Use const for all four, since none of them change.",
            success:
              "Correct. Prefer const by default and let only when something genuinely changes — it makes the ones that DO change stand out, which is most of what readable JavaScript is.",
          },
          solution: `const apples = 12;
const price  = 4.50;
const name   = "Ada";
const isOpen = true;

console.log(price);`,
        },

        rust: {
          hook:
            "You store the number 27 and the word Ada. Then you add them together. Before you read on: does that give you 27Ada, or an error, or a crash?",
          body: [
            "It depends entirely on the language — and Rust gives you the strictest answer of the six, along with the most helpful explanation.",
            "A value is a piece of data. A type is what kind of data it is. The type is what decides what an operation MEANS.",
            "Rust is statically typed, but you rarely write the type down: it works it out from the value. `let age = 27;` gives an i32 without being told. That is inference, not dynamic typing — the type is still fixed at compile time and can never change.",
            "There is no automatic conversion anywhere. Not between a number and text, and not even between two number types: adding an i32 to an i64 is an error until you say which one you meant.",
            "That sounds heavy and mostly is not, because the compiler tells you exactly what is wrong and often exactly how to fix it. The cost is paid while you write; the benefit is that whole categories of bug never reach the running program.",
          ],
          predict: {
            ask: "What does this Rust code do?",
            code: `let age = 27;
let name = "Ada";

println!("{}", age + name);`,
            choices: [
              { text: "27Ada", why: "Rust never converts between types on its own. Joining a number to text has to be asked for explicitly." },
              { text: "Will not compile", why: "Correct. The compiler says: cannot add `&str` to `{integer}` — and points at the exact expression." },
              { text: "Panics when it runs", why: "A panic is a runtime failure. This never gets that far; it is rejected while compiling." },
              { text: "27", why: "Nothing is discarded. Rust does not quietly drop part of an expression." },
            ],
            answer: 1,
          },
          example: `let age: i32    = 27;      // whole number, 32 bits
let price: f64  = 9.99;    // number with a decimal part
let name: &str  = "Ada";   // borrowed text
let ready: bool = true;    // true or false

// the types are usually left out — Rust works them out
let age = 27;              // still an i32
let price = 9.99;          // still an f64

let total = age + 10;      // fine
// let oops = age + name;  // will not compile

// even this is refused, on purpose
let big: i64 = 5;
// let sum = age + big;    // i32 + i64 — say which you meant`,
          notes: [
            { token: "i32, i64, u32", meaning: "whole numbers. i is signed, u cannot be negative, the number is bits" },
            { token: "f64", meaning: "a number with a decimal part" },
            { token: "&str vs String", meaning: "borrowed text you only read, versus text you own and can change" },
            { token: "type inference", meaning: "the type is fixed at compile time; you just did not have to write it" },
            { token: "no automatic conversion", meaning: "not even i32 to i64. Use `as` to say what you meant" },
          ],
          prompt:
            "Store each of these in a variable: a count of 12 apples, a price of 4.50, a name Ada, and whether the shop is open. Let Rust work out the types. Then print the price.",
          starter: `let apples = ;
let price  = ;
let name   = ;
let is_open = ;

println!("{}", );`,
          rules: {
            regex: ["let\\s+apples\\s*=\\s*12", "let\\s+price\\s*=\\s*4\\.50?", 'let\\s+name\\s*=\\s*"Ada"', "let\\s+is_open\\s*=\\s*true", "println!\\s*\\(\\s*\"\\{\\}\"\\s*,\\s*price\\s*\\)"],
            hint: "No types needed — Rust infers them. Print with println!(\"{}\", price), where {} is the slot the value goes into.",
            success:
              "Correct. The {} in println! is a placeholder, not a format code like C's %d — Rust works out how to display the value from its type, so there is nothing to get wrong.",
          },
          solution: `let apples = 12;
let price  = 4.50;
let name   = "Ada";
let is_open = true;

println!("{}", price);`,
        },
      },
    },

    /* -------------------------------------------------------- variables -- */
    {
      id: "variables",
      kicker: "02",
      title: "Variables and change",
      hook:
        "You write score = 10, then score = 25. How many boxes exist in memory now — one or two? And what happened to the 10?",
      body: [
        "One box. Assigning again replaces what is inside it; the 10 is simply gone.",
        "That is why `score = score + 1` is not a contradiction. The right-hand side is worked out first using the current value, and the answer then replaces it.",
        "Some values should never change: a limit, a tax rate, the number of days in a week. Marking those says so, and the language enforces it — so a mistake becomes an error you see at once rather than a wrong number you discover much later.",
        "In C++ the default is that anything can change. `const` opts out of that.",
        "Prefer const wherever you can. It is not about safety so much as reading: a reader who sees const knows this value is settled and can stop thinking about it.",
      ],
      predict: {
        ask: "What does this C++ code print?",
        code: `int score = 10;
int copy  = score;

score = 25;

cout << copy;`,
        choices: [
          { text: "25", why: "That would be true if copy pointed at the same box. It does not — for an int, the assignment copied the value." },
          { text: "10", why: "Correct. `int copy = score` copies the value into a second, separate box. Changing score afterwards has no effect on it." },
          { text: "35", why: "Nothing here adds the two together." },
          { text: "Will not compile", why: "This is all perfectly ordinary C++ — declare, copy, reassign, print." },
        ],
        answer: 1,
      },
      viz: traceMutability(),
      example: `int score = 10;      // make a box, put 10 in it
score = 25;          // replace what is inside. The 10 is gone
score = score + 1;   // right side first: 25 + 1, then store 26

const int LIMIT = 100;
// LIMIT = 200;      // will not compile — that is the point

int a = 5;
int b = a;           // b gets a COPY
a = 9;               // b is still 5`,
      notes: [
        { token: "int score = 10", meaning: "declare and give it a starting value in one line" },
        { token: "score = 25", meaning: "assignment. One = means put this in that box" },
        { token: "const", meaning: "this box can never be assigned to again" },
        { token: "int b = a", meaning: "copies the value. Two independent boxes" },
      ],
      challenge: {
        prompt:
          "Start a counter at 0, add 5 to it, then double it, and print the result. Also declare a constant MAX of 100 that cannot be changed.",
        starter: `int counter = 0;
counter = ;
counter = ;

 int MAX = 100;

cout << counter;`,
        rules: {
          regex: ["counter\\s*=\\s*counter\\s*\\+\\s*5|counter\\s*\\+=\\s*5", "counter\\s*=\\s*counter\\s*\\*\\s*2|counter\\s*\\*=\\s*2", "const\\s+int\\s+MAX"],
          hint: "counter = counter + 5, then counter = counter * 2. Mark MAX with const.",
          success:
            "Correct — the answer is 10. Both lines read the old value, work something out, and put the answer back in the same box.",
        },
        solution: `int counter = 0;
counter = counter + 5;
counter = counter * 2;

const int MAX = 100;

cout << counter;`,
      },

      alt: {
        c: {
          example: `int score = 10;      /* make a box, put 10 in it */
score = 25;          /* replace what is inside */
score = score + 1;   /* right side first, then store */

const int LIMIT = 100;
/* LIMIT = 200; */   /* will not compile */

int a = 5;
int b = a;           /* b gets a COPY */
a = 9;               /* b is still 5 */`,
          notes: [
            { token: "int score = 10", meaning: "declare and give it a starting value" },
            { token: "int score;", meaning: "without a value it holds RUBBISH, not 0. C does not clear it for you" },
            { token: "const", meaning: "this box can never be assigned to again" },
            { token: "#define MAX 100", meaning: "the older way. It is text replacement, not a real variable" },
          ],
          starter: `int counter = 0;
counter = ;
counter = ;

 int MAX = 100;

printf("%d", counter);`,
          rules: {
            regex: ["counter\\s*=\\s*counter\\s*\\+\\s*5|counter\\s*\\+=\\s*5", "counter\\s*=\\s*counter\\s*\\*\\s*2|counter\\s*\\*=\\s*2", "const\\s+int\\s+MAX"],
            hint: "counter = counter + 5, then counter = counter * 2. Mark MAX with const.",
            success:
              "Correct — the answer is 10. One C-only warning: an uninitialised `int x;` holds whatever was in that memory before, not 0. Always give a starting value.",
          },
          solution: `int counter = 0;
counter = counter + 5;
counter = counter * 2;

const int MAX = 100;

printf("%d", counter);`,
        },

        python: {
          body: [
            "One box. Assigning again points the name at a new value; the 10 is simply gone.",
            "That is why `score = score + 1` is not a contradiction. The right-hand side is worked out first using the current value, and the answer then replaces it.",
            "Python has no way to make a constant. There is no keyword that stops a name being reassigned.",
            "Instead there is a convention, and it is followed universally: a name in CAPITALS means do not change this. `MAX_USERS = 100`. Nothing enforces it — the language trusts you and other readers to respect the signal.",
            "One thing that catches everyone: for a list or a dict, `b = a` does NOT copy. Both names then point at the same object, and changing it through one is visible through the other. Numbers and text do not have this problem, because they cannot be changed in place at all.",
          ],
          predict: {
            ask: "What does this Python code print?",
            code: `a = [1, 2, 3]
b = a

b.append(4)

print(a)`,
            choices: [
              { text: "[1, 2, 3]", why: "That would be true if b were a copy. For a list it is not — both names point at the same object." },
              { text: "[1, 2, 3, 4]", why: "Correct. b = a gives a second NAME for the same list, so appending through b is visible through a. Use a.copy() or list(a) for a real copy." },
              { text: "[4]", why: "append adds to the end; it does not replace the contents." },
              { text: "TypeError", why: "Nothing here is a type error — appending to a list is perfectly ordinary." },
            ],
            answer: 1,
          },
          example: `score = 10          # make a box, put 10 in it
score = 25          # the name now points at 25
score = score + 1   # right side first: 25 + 1, then store 26

MAX_USERS = 100     # CAPITALS mean "do not change this"
MAX_USERS = 200     # allowed. Nothing stops you but the convention

a = 5
b = a               # numbers: b is independent
a = 9               # b is still 5

x = [1, 2]
y = x               # lists: y is the SAME list
x.append(3)         # y is now [1, 2, 3] too`,
          notes: [
            { token: "no type, no keyword", meaning: "assignment both creates and updates" },
            { token: "CAPITALS", meaning: "a convention for constants. Not enforced by anything" },
            { token: "b = a on a list", meaning: "a second name for the SAME list, not a copy" },
            { token: "a.copy()", meaning: "what you want when you meant a copy" },
          ],
          prompt:
            "Start a counter at 0, add 5 to it, then double it, and print the result. Also make a constant MAX of 100, named the way Python signals a constant.",
          starter: `counter = 0
counter = 
counter = 

 = 100

print(counter)`,
          rules: {
            regex: ["counter\\s*=\\s*counter\\s*\\+\\s*5|counter\\s*\\+=\\s*5", "counter\\s*=\\s*counter\\s*\\*\\s*2|counter\\s*\\*=\\s*2", "MAX\\s*=\\s*100"],
            hint: "counter = counter + 5, then counter = counter * 2. Name the constant MAX in capitals.",
            success:
              "Correct — the answer is 10. Python cannot stop you reassigning MAX, so the capitals are a message to whoever reads the code next, including you in six months.",
          },
          solution: `counter = 0
counter = counter + 5
counter = counter * 2

MAX = 100

print(counter)`,
        },

        java: {
          example: `int score = 10;      // make a box, put 10 in it
score = 25;          // replace what is inside
score = score + 1;   // right side first, then store

final int LIMIT = 100;
// LIMIT = 200;      // will not compile

int a = 5;
int b = a;           // b gets a COPY
a = 9;               // b is still 5

// but for objects, final only fixes the BOX
final List<Integer> nums = new ArrayList<>();
nums.add(1);         // allowed — the list itself can change
// nums = new ArrayList<>();  // not allowed`,
          notes: [
            { token: "final", meaning: "Java's const. The box can never be assigned to again" },
            { token: "final on an object", meaning: "fixes which object, not the object's contents" },
            { token: "int b = a", meaning: "copies the value. Two independent boxes" },
            { token: "static final", meaning: "how a real shared constant is written on a class" },
          ],
          starter: `int counter = 0;
counter = ;
counter = ;

 int MAX = 100;

System.out.println(counter);`,
          rules: {
            regex: ["counter\\s*=\\s*counter\\s*\\+\\s*5|counter\\s*\\+=\\s*5", "counter\\s*=\\s*counter\\s*\\*\\s*2|counter\\s*\\*=\\s*2", "final\\s+int\\s+MAX"],
            hint: "counter = counter + 5, then counter = counter * 2. Java's keyword for a constant is final.",
            success:
              "Correct — the answer is 10. Remember final on an object fixes WHICH object, not its contents: a final List can still have things added to it.",
          },
          solution: `int counter = 0;
counter = counter + 5;
counter = counter * 2;

final int MAX = 100;

System.out.println(counter);`,
        },

        javascript: {
          body: [
            "One box. Assigning again replaces what is inside it; the 10 is simply gone.",
            "That is why `score = score + 1` is not a contradiction. The right-hand side is worked out first using the current value, and the answer then replaces it.",
            "JavaScript gives you two words for making a variable, and choosing between them is a real decision. `let` makes a box you can reassign. `const` makes one you cannot.",
            "Use const by default and let only when something genuinely changes. It is not about safety — it is about reading. A reader who sees const knows this value is settled.",
            "The catch that trips everyone: const fixes WHICH object the name points at, not what is inside it. A const array can still have things pushed onto it. Only reassigning the name is blocked.",
            "You may also see `var` in older code. It behaves differently in ways that cause bugs, and there is no reason to write new code with it.",
          ],
          predict: {
            ask: "What does this JavaScript code do?",
            code: `const nums = [1, 2, 3];
nums.push(4);

const total = 0;
total = 10;`,
            choices: [
              { text: "Both lines fail — nums is const", why: "const does not freeze the contents. Pushing onto a const array is perfectly legal." },
              { text: "push works, total = 10 throws", why: "Correct. const stops the NAME being pointed at something else. The array's contents can still change; reassigning total cannot." },
              { text: "Both work fine", why: "Reassigning a const always throws a TypeError: Assignment to constant variable." },
              { text: "push throws, total = 10 works", why: "It is the other way round. Mutating is allowed; reassigning is not." },
            ],
            answer: 1,
          },
          example: `let score = 10;      // a box you can reassign
score = 25;          // fine
score = score + 1;   // right side first, then store

const LIMIT = 100;
// LIMIT = 200;      // TypeError: Assignment to constant variable

const nums = [1, 2];
nums.push(3);        // allowed — const fixes the NAME, not the contents
// nums = [];        // not allowed

let a = 5;
let b = a;           // numbers: b is independent
a = 9;               // b is still 5`,
          notes: [
            { token: "const", meaning: "the name can never point at something else. Use it by default" },
            { token: "let", meaning: "for the few things that genuinely change" },
            { token: "const on an array", meaning: "fixes which array, not its contents" },
            { token: "var", meaning: "the old way. Behaves oddly. No reason to use it now" },
          ],
          prompt:
            "Start a counter at 0, add 5 to it, then double it, and print the result. Also declare MAX as 100 so it cannot be reassigned. Choose let or const deliberately for each.",
          starter: ` counter = 0;
counter = ;
counter = ;

 MAX = 100;

console.log(counter);`,
          rules: {
            regex: ["let\\s+counter", "counter\\s*=\\s*counter\\s*\\+\\s*5|counter\\s*\\+=\\s*5", "counter\\s*=\\s*counter\\s*\\*\\s*2|counter\\s*\\*=\\s*2", "const\\s+MAX"],
            hint: "counter changes, so it needs let. MAX does not, so it takes const.",
            success:
              "Correct — the answer is 10, and the choice of keyword is the real exercise. let for the one that changes, const for the one that does not.",
          },
          solution: `let counter = 0;
counter = counter + 5;
counter = counter * 2;

const MAX = 100;

console.log(counter);`,
        },

        rust: {
          hook:
            "You write `let score = 10;` and then `score = 25;`. In five of the six languages here that is completely ordinary. In Rust it does not compile. Why would a language refuse something so basic?",
          body: [
            "Because Rust flips the default. Everywhere else a variable can change unless you mark it constant; in Rust nothing can change unless you mark it `mut`.",
            "That sounds like extra typing and mostly is not, because most variables genuinely never change. Writing `mut` becomes a signal: this one moves, watch it.",
            "The payoff is that you can read a Rust function and know at a glance which values are settled. In a long function that is worth a great deal.",
            "Assignment itself works the same as anywhere: `score = score + 1` reads the current value, works out the answer, and puts it back — once the box is marked `mut`.",
            "Rust also has `const`, which is different again: a value fixed at compile time, written in capitals, and usable anywhere in the program. `let` with no `mut` is a value that simply never changes after it is set.",
          ],
          predict: {
            ask: "What does this Rust code do?",
            code: `let score = 10;
score = 25;

println!("{}", score);`,
            choices: [
              { text: "Prints 25", why: "That is what every other language here would do. Rust needs the box marked mut before it can be assigned to twice." },
              { text: "Will not compile", why: "Correct. The error is: cannot assign twice to immutable variable `score` — and the compiler suggests adding mut." },
              { text: "Prints 10", why: "Rust does not ignore the second assignment. It refuses the whole program." },
              { text: "Panics when it runs", why: "This is caught while compiling. It never gets as far as running." },
            ],
            answer: 1,
          },
          example: `let score = 10;          // cannot be changed
// score = 25;           // will not compile

let mut score = 10;      // now it can
score = 25;              // fine
score = score + 1;       // right side first, then store

const LIMIT: i32 = 100;  // fixed at compile time, capitals, type required

let a = 5;
let b = a;               // numbers: b is a copy
// a is still usable afterwards

let s = String::from("hi");
let t = s;               // text: OWNERSHIP MOVES to t
// println!("{}", s);    // s is no longer usable — see Memory & References`,
          notes: [
            { token: "let", meaning: "cannot be changed. The default" },
            { token: "let mut", meaning: "can be changed. You have to ask" },
            { token: "const LIMIT: i32", meaning: "fixed at compile time. The type must be written" },
            { token: "let t = s on a String", meaning: "moves it. s cannot be used afterwards. This is the big one" },
          ],
          prompt:
            "Start a counter at 0, add 5 to it, then double it, and print the result. Also declare MAX as 100 using const. Mark whichever variable needs to change.",
          starter: `let  counter = 0;
counter = ;
counter = ;

const MAX:  = 100;

println!("{}", counter);`,
          rules: {
            regex: ["let\\s+mut\\s+counter", "counter\\s*=\\s*counter\\s*\\+\\s*5|counter\\s*\\+=\\s*5", "counter\\s*=\\s*counter\\s*\\*\\s*2|counter\\s*\\*=\\s*2", "const\\s+MAX\\s*:\\s*i32"],
            hint: "counter changes, so it needs `let mut`. const always needs its type written out: const MAX: i32 = 100;",
            success:
              "Correct — the answer is 10. Note const needs the type spelled out even though `let` does not: a const has to be usable anywhere, so Rust will not infer it from one place.",
          },
          solution: `let mut counter = 0;
counter = counter + 5;
counter = counter * 2;

const MAX: i32 = 100;

println!("{}", counter);`,
        },
      },
    },

    /* --------------------------------------------------------------- io -- */
    {
      id: "io",
      kicker: "03",
      title: "Talking to the outside",
      hook:
        "You ask the user for their age, they type 27, and you add 1 to it. You get 271. Nothing crashed and nothing warned you. What went wrong?",
      body: [
        "Everything typed at a keyboard arrives as TEXT. The user typed the characters 2 and 7, not the number 27.",
        "Adding 1 to text does whatever that language does with number-plus-text — and in several of them that means joining, so \"27\" and 1 become \"271\".",
        "The fix is always the same idea: convert the text into a number before doing arithmetic with it. Only the spelling differs.",
        "C++ hides this from you more than most. `cin >> age` where age is an int does the conversion as part of the read, so the trap above rarely bites here.",
        "That convenience has its own trap though: if the user types something that is not a number, the read silently fails, age keeps whatever it had, and the program carries on with a wrong value.",
      ],
      predict: {
        ask: "The user types \"hello\" when this C++ code asks for a number. What happens?",
        code: `int age = 99;
cout << "Age? ";
cin >> age;

cout << age;`,
        choices: [
          { text: "Prints 0", why: "Older C++ zeroed it, but since C++11 a failed read leaves the variable untouched." },
          { text: "Prints 99", why: "Correct. The read fails, age keeps its old value, and nothing tells you. This is why real code checks whether the read succeeded." },
          { text: "Crashes", why: "cin does not throw by default. It sets a failure flag and carries on quietly." },
          { text: "Waits for a number", why: "It does not retry. The failed input stays in the buffer, which is why a later read often appears to be skipped." },
        ],
        answer: 1,
      },
      viz: traceIO(),
      example: `#include <iostream>
using namespace std;

int main() {
  string name;
  int age;

  cout << "Name? ";
  cin >> name;              // reads one word, stops at a space

  cout << "Age? ";
  cin >> age;               // converts to int as part of the read

  cout << "Hello, " << name << ". Next year you are " << age + 1;
}`,
      notes: [
        { token: "cin >> age", meaning: "reads AND converts, because age is an int" },
        { token: "cin >> name", meaning: "stops at the first space. Use getline for a whole line" },
        { token: "a failed read", meaning: "leaves the variable alone and sets a failure flag" },
        { token: "endl vs \\n", meaning: "endl also flushes. In a loop that is slow — prefer \\n" },
      ],
      challenge: {
        prompt:
          "Ask for two numbers, read them both, and print their total. Read them with one cin line.",
        starter: `int a, b;

cout << "Two numbers: ";
cin ;

cout << ;`,
        rules: {
          regex: ["cin\\s*>>\\s*a\\s*>>\\s*b", "cout\\s*<<\\s*a\\s*\\+\\s*b"],
          hint: "One cin line can fill both: cin >> a >> b; Then print a + b.",
          success:
            "Correct. Because a and b are declared int, cin converts as it reads — so the text-versus-number trap that catches Python and JavaScript learners does not appear here.",
        },
        solution: `int a, b;

cout << "Two numbers: ";
cin >> a >> b;

cout << a + b;`,
      },

      alt: {
        c: {
          body: [
            "Everything typed at a keyboard arrives as TEXT. The user typed the characters 2 and 7, not the number 27.",
            "C handles this with a format string: you tell scanf what kind of thing to expect, and it converts as it reads.",
            "`scanf(\"%d\", &age)` means read one whole number and put it at the address of age. The `&` is not decoration — scanf needs to know WHERE to write, and forgetting it is the single most common C beginner crash.",
            "The format string is a promise the compiler cannot fully check. Say `%d` and pass a double, and scanf writes the wrong number of bytes into the wrong place. Nothing stops you.",
            "For text, `scanf(\"%s\", name)` has no `&` — an array is already an address — and it will happily write past the end of your buffer if the input is long enough. That is the classic buffer overflow. Use `fgets` for real input.",
          ],
          predict: {
            ask: "What is wrong with this C code?",
            code: `int age;
printf("Age? ");
scanf("%d", age);

printf("%d", age);`,
            choices: [
              { text: "Nothing — it works", why: "It compiles with a warning and then almost certainly crashes. scanf was given a value where it needed an address." },
              { text: "The & is missing", why: "Correct. It must be scanf(\"%d\", &age). Without it, scanf treats whatever rubbish is in age as an address and writes there." },
              { text: "%d should be %i", why: "%d and %i both read a decimal integer in scanf. That is not the problem." },
              { text: "age needs a starting value", why: "scanf is about to fill it, so that is not the issue here — the missing & is." },
            ],
            answer: 1,
          },
          example: `#include <stdio.h>

int main(void) {
  char name[50];
  int  age;

  printf("Name? ");
  scanf("%49s", name);      /* no & — an array is already an address */

  printf("Age? ");
  scanf("%d", &age);        /* & is REQUIRED for a plain variable */

  printf("Hello, %s. Next year you are %d", name, age + 1);
  return 0;
}`,
          notes: [
            { token: "&age", meaning: "the address of age. scanf needs to know where to write" },
            { token: "no & for an array", meaning: "an array name already IS an address" },
            { token: "%49s", meaning: "the limit. Plain %s will write past the end of a 50-char buffer" },
            { token: "fgets", meaning: "what real code uses for text. scanf's %s is hard to make safe" },
          ],
          prompt:
            "Ask for two numbers, read them both with one scanf, and print their total.",
          starter: `int a, b;

printf("Two numbers: ");
scanf();

printf("%d", );`,
          rules: {
            regex: ['scanf\\s*\\(\\s*"%d\\s*%d"\\s*,\\s*&a\\s*,\\s*&b\\s*\\)', "a\\s*\\+\\s*b"],
            hint: 'scanf("%d %d", &a, &b) — one format code per value, and an & on each variable.',
            success:
              "Correct. The two &s are the whole exercise: leave one off and the program compiles, then writes to a garbage address and crashes somewhere unrelated.",
          },
          solution: `int a, b;

printf("Two numbers: ");
scanf("%d %d", &a, &b);

printf("%d", a + b);`,
        },

        python: {
          body: [
            "Everything typed at a keyboard arrives as TEXT. The user typed the characters 2 and 7, not the number 27.",
            "`input()` always gives you a string. Always. It does not matter what the user typed or what you were hoping for.",
            "So `input() + 1` is the number-plus-text problem from the first lesson, and Python's answer is a TypeError the moment it runs.",
            "The fix is `int(...)` around it: `age = int(input())`. That converts the text into a whole number, and raises a clear ValueError if the text was not one.",
            "This is the single most common first bug in Python, and the error message names it exactly: unsupported operand type(s) for +: 'str' and 'int'. Once you have read that sentence twice, you will never forget the conversion again.",
          ],
          predict: {
            ask: "The user types 27. What does this Python code do?",
            code: `age = input("Age? ")

print(age + 1)`,
            choices: [
              { text: "Prints 28", why: "That would need age to be a number. input() always gives text, so no arithmetic happens." },
              { text: "Prints 271", why: "That is JavaScript's answer. Python refuses to join a string to a number rather than guessing." },
              { text: "TypeError", why: "Correct: can only concatenate str (not \"int\") to str. Wrap it in int(): age = int(input(\"Age? \"))." },
              { text: "Prints 27", why: "The + 1 is not ignored. Python evaluates it and fails there." },
            ],
            answer: 2,
          },
          example: `name = input("Name? ")          # always a string
age  = int(input("Age? "))      # convert, or arithmetic fails

print(f"Hello, {name}. Next year you are {age + 1}")

# reading several numbers from one line
a, b = map(int, input().split())

# converting can fail, and says so clearly
# int("hello")  ->  ValueError: invalid literal for int()`,
          notes: [
            { token: "input()", meaning: "ALWAYS returns text, whatever the user typed" },
            { token: "int(...)", meaning: "converts text to a whole number. float(...) for decimals" },
            { token: "f\"...{x}...\"", meaning: "an f-string. Puts the value straight into the text" },
            { token: ".split()", meaning: "cuts a line at the spaces, so one line can hold several values" },
          ],
          prompt:
            "Ask for two numbers on one line, read them both, and print their total. Remember input gives you text.",
          starter: `a, b = 

print()`,
          rules: {
            regex: ["map\\s*\\(\\s*int\\s*,\\s*input\\s*\\(\\s*\\)\\.split\\s*\\(\\s*\\)\\s*\\)", "print\\s*\\(\\s*a\\s*\\+\\s*b\\s*\\)"],
            hint: "a, b = map(int, input().split()) — split cuts the line at the space, map(int, ...) converts both pieces.",
            success:
              "Correct. Leave out the int and you get \"3\" + \"4\" = \"34\" with no error at all — which is far harder to spot than a crash.",
          },
          solution: `a, b = map(int, input().split())

print(a + b)`,
        },

        java: {
          body: [
            "Everything typed at a keyboard arrives as TEXT. The user typed the characters 2 and 7, not the number 27.",
            "Java's Scanner hides that for you: `nextInt()` reads and converts in one step, so simple programs rarely hit the problem.",
            "But Scanner has a trap of its own that catches almost everyone exactly once. `nextInt()` reads the number and leaves the newline behind. The next `nextLine()` then reads that leftover newline and returns an empty string immediately, without waiting for the user.",
            "It looks as though the program skipped a question. It did not — it read the invisible end of the previous line.",
            "The usual fix is an extra `sc.nextLine()` after the number, to consume the leftover. The tidier fix is to read every line with nextLine and convert with Integer.parseInt yourself.",
          ],
          predict: {
            ask: "The user types 27, then Ada. What does this print?",
            code: `Scanner sc = new Scanner(System.in);

int age = sc.nextInt();
String name = sc.nextLine();

System.out.println("[" + name + "]");`,
            choices: [
              { text: "[Ada]", why: "That is what you would expect and what it does not do. nextInt left a newline behind." },
              { text: "[]", why: "Correct. nextInt() reads 27 and stops before the newline. nextLine() then reads that leftover newline and returns an empty string without waiting." },
              { text: "[27]", why: "The 27 was consumed by nextInt. It is not read a second time." },
              { text: "It waits for more input", why: "It does not wait at all — that is exactly what makes this bug so confusing." },
            ],
            answer: 1,
          },
          example: `import java.util.Scanner;

Scanner sc = new Scanner(System.in);

System.out.print("Age? ");
int age = sc.nextInt();
sc.nextLine();                    // eat the leftover newline

System.out.print("Name? ");
String name = sc.nextLine();

System.out.println("Hello, " + name + ". Next year you are " + (age + 1));`,
          notes: [
            { token: "sc.nextInt()", meaning: "reads and converts, but leaves the newline behind" },
            { token: "sc.nextLine() after it", meaning: "eats the leftover. Miss it and the next read looks skipped" },
            { token: "Integer.parseInt(s)", meaning: "converts text to a number yourself" },
            { token: "(age + 1) in brackets", meaning: "without them, + joins as text and you get \"271\"" },
          ],
          prompt:
            "Ask for two numbers, read them both, and print their total. Put the addition in brackets so it is arithmetic rather than text-joining.",
          starter: `Scanner sc = new Scanner(System.in);

int a = ;
int b = ;

System.out.println("Total: " + );`,
          rules: {
            regex: ["a\\s*=\\s*sc\\.nextInt\\s*\\(\\s*\\)", "b\\s*=\\s*sc\\.nextInt\\s*\\(\\s*\\)", "\\(\\s*a\\s*\\+\\s*b\\s*\\)"],
            hint: "sc.nextInt() for each. Then \"Total: \" + (a + b) — the brackets matter.",
            success:
              'Correct, and the brackets are the exercise. Without them Java works left to right: "Total: " + 3 becomes "Total: 3", then + 4 gives "Total: 34".',
          },
          solution: `Scanner sc = new Scanner(System.in);

int a = sc.nextInt();
int b = sc.nextInt();

System.out.println("Total: " + (a + b));`,
        },

        javascript: {
          body: [
            "Everything typed at a keyboard arrives as TEXT. The user typed the characters 2 and 7, not the number 27.",
            "JavaScript makes this worse than any other language here, because it will not complain. `\"27\" + 1` is the perfectly legal string \"271\". No error, no warning, no crash — just a wrong answer that flows onward.",
            "The fix is `Number(...)` around the text before doing arithmetic with it.",
            "Reading input also depends on where the code runs. In a browser there is `prompt()`. In Node there is no simple blocking read at all — competitive programming solutions read the whole of standard input at once and split it.",
            "One more thing to know: `Number(\"abc\")` does not throw. It gives `NaN`, which then spreads through every calculation it touches and compares as false against everything, including itself.",
          ],
          predict: {
            ask: "What does this print?",
            code: `const age = "27";

console.log(age + 1);
console.log(Number(age) + 1);`,
            choices: [
              { text: "271  then  28", why: "Correct. The first joins text because one side is a string; the second converts first, so it is real arithmetic." },
              { text: "28  then  28", why: "JavaScript does not convert text to a number for +. Plus prefers joining whenever either side is text." },
              { text: "TypeError  then  28", why: "Python would throw. JavaScript converts and carries on without a word." },
              { text: "NaN  then  28", why: "\"27\" is a perfectly good string, so + joins it. NaN comes from converting something that is not a number at all." },
            ],
            answer: 0,
          },
          example: `// reading everything at once — the usual competitive setup
const data = require("fs").readFileSync(0, "utf8").split(/\\s+/);

const name = data[0];                 // still text
const age  = Number(data[1]);         // convert before arithmetic

console.log(\`Hello, \${name}. Next year you are \${age + 1}\`);

// the trap, in one line
"27" + 1        // "271"  — no error
Number("27") + 1 // 28
Number("abc")    // NaN — and NaN !== NaN`,
          notes: [
            { token: "Number(x)", meaning: "converts text to a number. parseInt for partial text" },
            { token: "\"27\" + 1", meaning: "\"271\". No error at all, which is the dangerous part" },
            { token: "NaN", meaning: "what a failed conversion gives. It spreads and equals nothing, not even itself" },
            { token: "`${x}`", meaning: "a template string. Puts the value straight into the text" },
          ],
          prompt:
            "Two numbers arrive in the array data as text. Convert them and print their total — not their joined text.",
          starter: `const a = ;
const b = ;

console.log(a + b);`,
          rules: {
            regex: ["Number\\s*\\(\\s*data\\s*\\[\\s*0\\s*\\]\\s*\\)", "Number\\s*\\(\\s*data\\s*\\[\\s*1\\s*\\]\\s*\\)"],
            hint: "Wrap each one: const a = Number(data[0]); const b = Number(data[1]);",
            success:
              'Correct. Without the conversion you would get "34" instead of 7 — and because nothing errors, that wrong value travels a long way before anyone notices.',
          },
          solution: `const a = Number(data[0]);
const b = Number(data[1]);

console.log(a + b);`,
        },

        rust: {
          body: [
            "Everything typed at a keyboard arrives as TEXT. The user typed the characters 2 and 7, not the number 27.",
            "Rust will not let you forget this. `read_line` gives you a String, and adding a number to a String does not compile. The mistake is caught before the program runs.",
            "Converting is `.parse()`, and it needs to know what to parse into — `let age: i32 = text.trim().parse()`. The type on the left is how it knows.",
            "The `.trim()` is not optional. `read_line` keeps the newline the user pressed, so parsing \"27\\n\" fails without it. That is the one detail everybody hits first.",
            "And parse does not simply hand back a number: it gives a `Result`, which is either the value or an explanation of why it failed. `.unwrap()` says 'I am sure this worked' and stops the program if it did not. Real code matches on it instead — that is the Error Handling topic.",
          ],
          predict: {
            ask: "The user types 27 and presses enter. What does this Rust code do?",
            code: `let mut text = String::new();
std::io::stdin().read_line(&mut text).unwrap();

let age: i32 = text.parse().unwrap();
println!("{}", age + 1);`,
            choices: [
              { text: "Prints 28", why: "It would, if the newline were removed first. read_line keeps it, so parse never gets a clean \"27\"." },
              { text: "Panics on the parse", why: "Correct. text is \"27\\n\", which is not a valid i32, so parse gives an Err and unwrap stops the program. Add .trim()." },
              { text: "Will not compile", why: "This compiles fine. The type annotation tells parse what to produce; the failure happens at run time." },
              { text: "Prints 271", why: "Rust never joins a number to text. That is JavaScript's behaviour." },
            ],
            answer: 1,
          },
          example: `use std::io::stdin;

let mut name = String::new();
stdin().read_line(&mut name).unwrap();
let name = name.trim();                 // drop the newline

let mut line = String::new();
stdin().read_line(&mut line).unwrap();
let age: i32 = line.trim().parse().unwrap();   // trim, THEN parse

println!("Hello, {}. Next year you are {}", name, age + 1);`,
          notes: [
            { token: "&mut text", meaning: "read_line fills a String you already own" },
            { token: ".trim()", meaning: "removes the newline. Without it parse always fails" },
            { token: "let age: i32", meaning: "the type is how parse knows what to produce" },
            { token: ".unwrap()", meaning: "'this worked' — stops the program if it did not" },
          ],
          prompt:
            "Two numbers arrive on one line in `line`. Split them, convert both, and print their total. Remember the newline.",
          starter: `let nums: Vec<i32> = line
    .
    .split_whitespace()
    .map(|x| x.parse().unwrap())
    .collect();

println!("{}", );`,
          rules: {
            regex: ["\\.trim\\s*\\(\\s*\\)", "nums\\s*\\[\\s*0\\s*\\]\\s*\\+\\s*nums\\s*\\[\\s*1\\s*\\]"],
            hint: "Call .trim() before splitting, then print nums[0] + nums[1].",
            success:
              "Correct. The trim is the whole exercise: without it the last number carries a newline, parse returns an Err, and unwrap stops your program on a line that looks perfectly fine.",
          },
          solution: `let nums: Vec<i32> = line
    .trim()
    .split_whitespace()
    .map(|x| x.parse().unwrap())
    .collect();

println!("{}", nums[0] + nums[1]);`,
        },
      },
    },
  ],
};
