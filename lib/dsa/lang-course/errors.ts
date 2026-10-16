import type { TopicLesson } from "@/lib/dsa/lessons/types";
import {
  traceErrorDesign,
  traceErrorModels,
  traceFinally,
  traceUnwind,
} from "@/lib/dsa/viz/traceLang";

// Language track, topic 9.
//
// Three models, unevenly distributed: return codes (C), exceptions (C++, Java,
// Python, JavaScript) and Result (Rust). The interesting comparison is what
// each one tells the caller and what it hides, so section 1 puts all three
// side by side before the language-specific detail.

export const LANG_ERRORS: TopicLesson = {
  id: "lang-errors",
  title: "Error Handling",
  tagline: "What happens when something goes wrong.",
  why:
    "Most code is written assuming everything works, and most production incidents happen where it did not. Deciding how a failure is reported, and who is responsible for dealing with it, shapes a codebase more than almost any other decision.",
  plain: [
    "Some things fail for reasons your code cannot control: a missing file, a broken network, bad input.",
    "The function that notices has to tell the caller somehow.",
    "There are three ways to tell them: a return value, a thrown exception, or a result type that carries both outcomes.",
    "Whichever you use, cleanup has to happen on the failing path too.",
  ],
  needs: ["Functions and return values.", "Cleanup from Memory & References."],
  traps: [
    "Catching every error and doing nothing. An empty catch block turns a loud failure into a silent wrong answer.",
    "Catching too broadly. Catching everything also catches the bugs you wanted to see.",
    "Using exceptions for ordinary control flow. A user typing a bad password is not exceptional.",
    "Losing the original error when wrapping it. Always keep the cause.",
    "Forgetting cleanup on the failing path — which is exactly the path least likely to be tested.",
  ],
  sections: [
    /* --------------------------------------------------------- models -- */
    {
      id: "models",
      kicker: "01",
      title: "Three ways to say it failed",
      hook:
        "A function reads a number from a file. The file is missing. How does the caller find out?",
      body: [
        "There are three answers in use, and all six of these languages pick one or two of them.",
        "RETURN CODES: hand back a status, and put the real answer somewhere the caller passed in. Simple, fast, and trivially ignored — the caller can drop the return value and nothing warns them.",
        "EXCEPTIONS: throw, and let the error travel up the stack until something catches it. Impossible to ignore by accident, and invisible in the signature — reading a function tells you nothing about what might come out of it.",
        "RESULTS: make the failure part of the return TYPE, so the caller cannot reach the value without acknowledging the other case. Visible and enforced, at the cost of writing more.",
        "C++ uses exceptions, and it is unusual in having a real choice: `std::optional` for 'might be absent' and `std::expected` (C++23) for 'a value or an error' both exist, and some codebases avoid exceptions entirely.",
        "The reason to avoid them is narrow and real: exceptions cost nothing when nothing throws, and when one does throw the cost is large and hard to bound. Games and embedded systems often disable them for that reason.",
        "For everything else, the C++ guidance is to throw for genuine failures and to return values for ordinary outcomes. A missing key in a lookup is ordinary; a corrupt configuration file is not.",
      ],
      predict: {
        ask: "What does this C++ code print?",
        code: `int risky() {
  throw runtime_error("bad");
  return 1;
}

int main() {
  try {
    cout << "a";
    risky();
    cout << "b";
  } catch (exception& e) {
    cout << "c";
  }
  cout << "d";
}`,
        choices: [
          { text: "abcd", why: "The throw jumps straight to the catch — the line after risky() never runs." },
          { text: "acd", why: "Correct. \"a\" prints, then risky throws, so \"b\" is skipped entirely. The catch prints \"c\", and execution then continues normally after the try block with \"d\"." },
          { text: "acbd", why: "Once an exception is thrown, the rest of the try block is abandoned. It never comes back to it." },
          { text: "ac — the program stops", why: "A caught exception does not end the program. After the catch block runs, execution continues normally." },
        ],
        answer: 1,
      },
      viz: traceErrorModels(),
      example: `// exceptions: throw for genuine failures
int readConfig(const string& path) {
  ifstream f(path);
  if (!f) throw runtime_error("cannot open " + path);
  int n;
  if (!(f >> n)) throw runtime_error("not a number in " + path);
  return n;
}

// a value that might be absent — not an error
optional<int> find(const map<string,int>& m, const string& k) {
  auto it = m.find(k);
  if (it == m.end()) return nullopt;
  return it->second;
}

if (auto v = find(m, "a")) cout << *v;

// C++23: a value or an explanation, without throwing
expected<int, string> parse(const string& s);

// the standard exception types
throw invalid_argument("n must be positive");
throw out_of_range("index too large");
throw runtime_error("something failed at run time");

// your own, so callers can catch just yours
struct ConfigError : runtime_error {
  using runtime_error::runtime_error;
};`,
      notes: [
        { token: "throw", meaning: "for genuine failures. Travels up until caught" },
        { token: "optional<T>", meaning: "might be absent. Not an error" },
        { token: "expected<T, E>", meaning: "C++23. A value or an explanation, no throwing" },
        { token: "your own type", meaning: "so callers can catch yours and not everything" },
      ],
      challenge: {
        prompt:
          "Throw a runtime_error when the file cannot be opened, saying which path failed.",
        starter: `int readConfig(const string& path) {
  ifstream f(path);
  if (!f)  ("cannot open " + path);
  return 0;
}`,
        rules: {
          regex: ["throw\\s+runtime_error\\s*\\(\\s*\"cannot open \"\\s*\\+\\s*path\\s*\\)"],
          hint: "throw runtime_error(\"cannot open \" + path);",
          success:
            "Correct, and including the path is the part that matters in practice. \"cannot open file\" tells you nothing at three in the morning; \"cannot open /etc/app/config.toml\" tells you everything.",
        },
        solution: `int readConfig(const string& path) {
  ifstream f(path);
  if (!f) throw runtime_error("cannot open " + path);
  return 0;
}`,
      },

      alt: {
        c: {
          body: [
            "In C there is one answer: the return value. There are no exceptions and no result types.",
            "The convention is a status code as the return value, and the real answer written through a pointer the caller passed in. `int read_config(const char *path, int *out)` returns 0 for success and something else for each kind of failure.",
            "Where a function returns a pointer, NULL is the failure. Where it returns an index, -1 is. Where it returns a count, a negative number is. The convention varies by library, which is itself part of the problem.",
            "`errno` is the other half. Standard library functions set this global on failure, and `perror` or `strerror(errno)` turns it into a message. Read it IMMEDIATELY — the next library call may overwrite it.",
            "The weakness of the whole scheme is that nothing forces the caller to look. `fopen(path, \"r\")` with no check compiles cleanly and gives you a null pointer to crash on later.",
            "Two things help. Mark functions with `__attribute__((warn_unused_result))`, or its C23 spelling `[[nodiscard]]`, so ignoring the result is a warning. And check every single call, without exception — the discipline is the mechanism.",
            "`setjmp`/`longjmp` can jump out of a deep call chain like an exception. They do not run any cleanup, they are easy to misuse, and they are best left alone.",
          ],
          predict: {
            ask: "What is wrong with this C code?",
            code: `FILE *f = fopen("data.txt", "r");

char buf[100];
fgets(buf, sizeof buf, f);

printf("%s", buf);`,
            choices: [
              { text: "Nothing — fopen always returns a valid handle", why: "fopen returns NULL when the file cannot be opened, and nothing here checks for that." },
              { text: "fopen can return NULL, and nothing checks", why: "Correct. If the file is missing, f is NULL, and passing NULL to fgets is undefined behaviour — usually a crash, at a line that looks innocent. Check immediately after every call that can fail." },
              { text: "buf is too small", why: "fgets is bounded by the size it is given, so 100 bytes is handled safely. The unchecked fopen is the bug." },
              { text: "sizeof buf is wrong for an array", why: "sizeof on a local array gives its real size in bytes, which is exactly right here." },
            ],
            answer: 1,
          },
          example: `/* the convention: status back, answer through a pointer */
#define OK        0
#define E_NOFILE -1
#define E_PARSE  -2

int read_config(const char *path, int *out) {
  FILE *f = fopen(path, "r");
  if (!f) return E_NOFILE;

  if (fscanf(f, "%d", out) != 1) {
    fclose(f);
    return E_PARSE;
  }

  fclose(f);
  return OK;
}

int n;
int rc = read_config("cfg", &n);
if (rc != OK) { /* handle it */ }

/* errno — read it IMMEDIATELY, before another call overwrites it */
FILE *f = fopen(path, "r");
if (!f) {
  fprintf(stderr, "cannot open %s: %s\n", path, strerror(errno));
  return -1;
}

/* make ignoring the result a warning */
[[nodiscard]] int must_check(void);

/* setjmp/longjmp can jump out of a deep chain.
   They run no cleanup. Avoid them */`,
          notes: [
            { token: "status back, answer out", meaning: "the C convention for anything that can fail" },
            { token: "NULL / -1", meaning: "the failure value, varying by function" },
            { token: "errno", meaning: "read it immediately. The next call may overwrite it" },
            { token: "[[nodiscard]]", meaning: "makes ignoring the return value a warning" },
          ],
          prompt:
            "Check the fopen and report why it failed, using errno.",
          starter: `FILE *f = fopen(path, "r");
if () {
  fprintf(stderr, "cannot open %s: %s\n", path, );
  return -1;
}`,
          rules: {
            regex: ["if\\s*\\(\\s*(!\\s*f|f\\s*==\\s*NULL)\\s*\\)", "strerror\\s*\\(\\s*errno\\s*\\)"],
            hint: "if (!f) to catch the failure, and strerror(errno) for the reason.",
            success:
              "Correct. strerror(errno) turns the code into \"No such file or directory\" or \"Permission denied\" — the difference between a bug report you can act on and one you cannot.",
          },
          solution: `FILE *f = fopen(path, "r");
if (!f) {
  fprintf(stderr, "cannot open %s: %s\n", path, strerror(errno));
  return -1;
}`,
        },

        python: {
          body: [
            "Python throws. Exceptions are not a last resort here — they are the ordinary way anything reports a problem.",
            "That is a real cultural difference. In C++ you would return an optional for a missing key; in Python `d[\"missing\"]` raises KeyError and that is considered perfectly normal.",
            "The phrase for it is 'easier to ask forgiveness than permission'. Rather than checking whether something will work, you try it and handle the failure.",
            "That is often better than checking first, and not only stylistically: between your check and your action, the world may change. A file that existed when you tested for it may be gone when you open it.",
            "`raise ValueError(\"n must be positive\")` throws. `try` / `except` catches. Catch the SPECIFIC type — a bare `except:` catches everything including KeyboardInterrupt, and `except Exception:` catches every bug you wanted to see.",
            "`raise ... from e` keeps the original error as the cause, so the traceback shows both. Losing the cause is one of the most annoying things you can do to whoever debugs it later.",
            "Python's traceback is genuinely good: it shows every frame between the raise and the top. Read it from the BOTTOM — the last line is the error, and the line above it is where it happened.",
          ],
          predict: {
            ask: "What does this Python code print?",
            code: `def f():
    try:
        return "a"
    finally:
        print("b")

print(f())`,
            choices: [
              { text: "a then b", why: "The finally block runs before the function actually returns, so \"b\" is printed first." },
              { text: "b then a", why: "Correct. The return value is worked out, then finally runs and prints \"b\", and only then does the function actually return — so print(f()) shows \"a\" afterwards." },
              { text: "Only a", why: "finally always runs, including on the path where the try block returns." },
              { text: "Only b", why: "The return still happens — finally does not cancel it, it just runs first." },
            ],
            answer: 1,
          },
          example: `# raising
def set_age(n):
    if n < 0:
        raise ValueError(f"age must not be negative, got {n}")

# try / except, catching the SPECIFIC type
try:
    n = int(text)
except ValueError as e:
    print(f"not a number: {e}")

# several, and the shared shape
try:
    data = load(path)
except FileNotFoundError:
    data = {}
except (PermissionError, OSError) as e:
    log(e)
    raise
else:
    print("worked")        # only if nothing raised
finally:
    cleanup()              # always

# keep the cause when wrapping
try:
    parse(text)
except ValueError as e:
    raise ConfigError("bad config") from e

# your own type
class ConfigError(Exception):
    pass

# ask forgiveness rather than permission
try:
    value = d["key"]
except KeyError:
    value = default
# or simply: value = d.get("key", default)

# NEVER do this
try:
    risky()
except Exception:
    pass                   # every bug now vanishes silently`,
          notes: [
            { token: "raise ValueError(...)", meaning: "throw. Include what the bad value actually was" },
            { token: "except ValueError as e", meaning: "catch the specific type, never bare except" },
            { token: "raise ... from e", meaning: "keeps the original as the cause" },
            { token: "else / finally", meaning: "only if nothing raised, and always" },
          ],
          prompt:
            "Wrap the error in a ConfigError while keeping the original as the cause.",
          starter: `try:
    parse(text)
except ValueError as e:
    raise ConfigError("bad config") `,
          rules: {
            regex: ["raise\\s+ConfigError\\s*\\(\\s*\"bad config\"\\s*\\)\\s+from\\s+e"],
            hint: "raise ConfigError(\"bad config\") from e",
            success:
              "Correct. Without the `from e` the traceback says \"During handling of the above exception, another exception occurred\" — which is confusing. With it, it says \"The above exception was the direct cause\", which is what you meant.",
          },
          solution: `try:
    parse(text)
except ValueError as e:
    raise ConfigError("bad config") from e`,
        },

        java: {
          body: [
            "Java throws, and it is the only language here that splits exceptions into two kinds with different rules.",
            "A CHECKED exception must be declared with `throws` and must be caught or passed on by every caller. `IOException` is the classic one. The compiler enforces it.",
            "An UNCHECKED exception — anything extending `RuntimeException` — needs no declaration and no handling. `NullPointerException` and `IllegalArgumentException` are the everyday examples.",
            "The idea was that checked exceptions make failure visible in the signature. In practice they are widely considered a mistake: they force boilerplate through every intermediate layer, and they push people towards empty catch blocks purely to make the compiler stop complaining.",
            "No language designed since has copied them, and modern Java code often wraps checked exceptions in unchecked ones at the boundary.",
            "The rough guide: use a checked exception when the caller can realistically DO something about it, and an unchecked one for programming mistakes. Bad arguments are your bug; a network timeout is not.",
            "Two rules regardless. Never write an empty catch — at minimum log it. And always keep the cause: `throw new ConfigException(\"bad config\", e)` rather than throwing away the original.",
          ],
          predict: {
            ask: "Which of these compiles without a try/catch?",
            code: `void a() { throw new IOException(); }              // 1
void b() { throw new IllegalArgumentException(); }  // 2
void c() throws IOException { throw new IOException(); }  // 3`,
            choices: [
              { text: "All three", why: "Line 1 throws a checked exception without declaring it, which the compiler rejects." },
              { text: "2 and 3", why: "Correct. IllegalArgumentException is unchecked, so it needs no declaration. Line 3 declares its checked exception with throws. Line 1 throws a checked exception without declaring it, and does not compile." },
              { text: "Only 3", why: "Unchecked exceptions — anything extending RuntimeException — need no declaration at all, so line 2 is fine." },
              { text: "Only 2", why: "Line 3 declares the exception with `throws IOException`, which is exactly what the compiler requires." },
            ],
            answer: 1,
          },
          example: `// checked: must be declared and handled
void read(String path) throws IOException {
  Files.readString(Path.of(path));
}

// unchecked: for programming mistakes. No declaration needed
void setAge(int n) {
  if (n < 0) throw new IllegalArgumentException("age was " + n);
}

// catching, most specific first
try {
  read(path);
} catch (NoSuchFileException e) {
  log.warn("missing: {}", path);
} catch (IOException e) {
  throw new ConfigException("cannot load " + path, e);   // KEEP the cause
} finally {
  cleanup();
}

// several types with the same handling
catch (IOException | SQLException e) { log.error("failed", e); }

// try-with-resources, so no finally is needed
try (var r = Files.newBufferedReader(Path.of(path))) {
  r.readLine();
}

// your own
class ConfigException extends RuntimeException {
  ConfigException(String m, Throwable cause) { super(m, cause); }
}

// NEVER
try { risky(); } catch (Exception e) { }   // every bug vanishes`,
          notes: [
            { token: "checked", meaning: "must be declared and handled. IOException" },
            { token: "unchecked", meaning: "extends RuntimeException. No declaration needed" },
            { token: "new X(msg, cause)", meaning: "keep the original. Always" },
            { token: "catch (A | B e)", meaning: "several types, one handler" },
          ],
          prompt:
            "Wrap the IOException in a ConfigException, keeping the original as the cause.",
          starter: `try {
  read(path);
} catch (IOException e) {
  throw new ConfigException("cannot load " + path);
}`,
          rules: {
            regex: ["new\\s+ConfigException\\s*\\(\\s*\"cannot load \"\\s*\\+\\s*path\\s*,\\s*e\\s*\\)"],
            hint: "Pass e as the second argument: new ConfigException(\"cannot load \" + path, e)",
            success:
              "Correct. Without the cause, the stack trace starts at your throw and the real reason — a missing file, a permission problem — is gone forever.",
          },
          solution: `try {
  read(path);
} catch (IOException e) {
  throw new ConfigException("cannot load " + path, e);
}`,
        },

        javascript: {
          body: [
            "JavaScript throws, and it has one unusual weakness: you can throw ANYTHING.",
            "`throw \"oops\"` is legal. So is `throw 42`. Do neither — always throw an `Error` or something extending it, because only an Error carries a stack trace, and without one you have no idea where the problem came from.",
            "`try` / `catch` / `finally` works as you would expect. The caught value has no declared type, so defensive code often checks: `if (e instanceof MyError)`.",
            "Since 2019 the binding is optional — `catch { }` with no parentheses — for when you genuinely do not need the error.",
            "The half that matters most in real code is ASYNCHRONOUS. A promise that rejects is the async equivalent of a throw, and `await` inside a try/catch turns it back into an ordinary catch.",
            "The classic mistake is a `.then()` chain with no `.catch()`, or an async function whose promise nobody awaits. The rejection then goes nowhere — Node prints an unhandled rejection warning and modern versions exit.",
            "`Error` has a `cause` option for wrapping: `new Error(\"failed\", { cause: e })`. And `AggregateError` collects several, which is what `Promise.any` gives you when every promise fails.",
          ],
          predict: {
            ask: "Why does this not catch the error?",
            code: `try {
  setTimeout(() => {
    throw new Error("late");
  }, 100);
} catch (e) {
  console.log("caught");
}`,
            choices: [
              { text: "setTimeout does not accept a function that throws", why: "The callback is an ordinary function and may throw. The problem is when it runs, not what it does." },
              { text: "The callback runs later, after the try block has finished", why: "Correct. setTimeout returns immediately and the try block ends. When the callback runs 100ms later, that try/catch is long gone — so the throw is uncaught. Put the try INSIDE the callback." },
              { text: "The error needs to be a string", why: "Throwing an Error is exactly right. The timing is what stops the catch from seeing it." },
              { text: "catch needs to be async", why: "There is no such thing as an async catch clause. The fix is to move the try inside the callback, or use a promise with await." },
            ],
            answer: 1,
          },
          example: `// always throw an Error. Only an Error has a stack
throw new Error("age must not be negative");
// throw "oops";              // legal, and useless

// your own, so callers can tell yours apart
class ConfigError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "ConfigError";
  }
}

try {
  parse(text);
} catch (e) {
  if (e instanceof SyntaxError) {
    throw new ConfigError("bad config", { cause: e });   // KEEP the cause
  }
  throw e;                     // not ours — pass it on
} finally {
  cleanup();
}

// async: await turns a rejection back into a throw
async function load(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.json();
  } catch (e) {
    console.error("load failed", e);
    throw e;
  }
}

// the classic mistake: nothing handles the rejection
load("/x");                    // unhandled rejection
load("/x").catch(console.error);   // handled

// several failures at once
// Promise.any rejects with an AggregateError holding them all`,
          notes: [
            { token: "throw new Error(...)", meaning: "always an Error. Only it carries a stack" },
            { token: "{ cause: e }", meaning: "keep the original when wrapping" },
            { token: "await in try/catch", meaning: "turns a rejection into an ordinary catch" },
            { token: "an unawaited promise", meaning: "its rejection goes nowhere. The classic bug" },
          ],
          prompt:
            "Throw a ConfigError that keeps the original error as its cause.",
          starter: `try {
  parse(text);
} catch (e) {
  throw new ConfigError("bad config");
}`,
          rules: {
            regex: ["new\\s+ConfigError\\s*\\(\\s*\"bad config\"\\s*,\\s*\\{\\s*cause\\s*:\\s*e\\s*\\}\\s*\\)"],
            hint: "new ConfigError(\"bad config\", { cause: e })",
            success:
              "Correct. Node and modern browsers print the cause chain automatically, so the log shows both your message and the original SyntaxError underneath it.",
          },
          solution: `try {
  parse(text);
} catch (e) {
  throw new ConfigError("bad config", { cause: e });
}`,
        },

        rust: {
          body: [
            "Rust returns a value, and the compiler will not let you ignore it. That is the whole design, and it is the biggest difference between this language and the other five.",
            "`Result<T, E>` is either `Ok(value)` or `Err(error)`. It is an ordinary enum, not a special mechanism — which means all the normal tools work on it.",
            "So a function that can fail says so in its signature: `fn read_config(path: &str) -> Result<i32, ConfigError>`. You cannot get at the i32 without dealing with the possibility of an error.",
            "`Option<T>` is the related one for 'might be absent': `Some(value)` or `None`. Use Option when there is nothing to explain, and Result when there is.",
            "Writing this out for every call would be unbearable, which is what the `?` operator is for. `let n = read(path)?;` unwraps the Ok, or returns the Err from your function immediately.",
            "That one character is what makes the model practical: the happy path reads like ordinary code, and every failure is still visible and still handled.",
            "`panic!` is the other half, and it is for a different thing. A Result means 'this can fail and the caller should decide'. A panic means 'this should be impossible' — a broken invariant, a bug. It unwinds the stack and ends the program.",
            "`unwrap()` and `expect()` turn a Result into a panic. They are fine in tests and prototypes, and in real code `expect(\"why this cannot fail\")` at least documents your reasoning.",
          ],
          predict: {
            ask: "What does the ? operator do here?",
            code: `fn read(path: &str) -> Result<i32, io::Error> {
    let text = fs::read_to_string(path)?;
    Ok(text.trim().parse().unwrap_or(0))
}`,
            choices: [
              { text: "It panics if reading fails", why: "That is what unwrap does. The ? operator returns the error to the caller instead." },
              { text: "It unwraps Ok, or returns the Err from read immediately", why: "Correct. On success ? hands you the String and carries on. On failure it returns Err(e) from read straight away — so the rest of the function only ever sees the success case." },
              { text: "It ignores the error and carries on with a default", why: "Nothing is ignored. The error is returned to the caller, who must then deal with it." },
              { text: "It converts the Result into an Option", why: "There is a method for that — .ok() — but ? propagates the error rather than discarding it." },
            ],
            answer: 1,
          },
          example: `use std::{fs, io};

// the failure is part of the SIGNATURE
fn read_config(path: &str) -> Result<i32, io::Error> {
    let text = fs::read_to_string(path)?;   // ? returns the Err early
    let n = text.trim().parse().unwrap_or(0);
    Ok(n)
}

// handling it
match read_config("cfg") {
    Ok(n) => println!("{}", n),
    Err(e) => eprintln!("failed: {}", e),
}

// or supply a fallback
let n = read_config("cfg").unwrap_or(0);
let n = read_config("cfg").unwrap_or_else(|_| default());

// Option: might be absent, with nothing to explain
fn find(v: &[i32], x: i32) -> Option<usize> {
    v.iter().position(|&y| y == x)
}
if let Some(i) = find(&v, 3) { println!("{}", i); }

// panic: this should be impossible. A bug, not a failure
let x = v.get(0).expect("v is never empty here");
panic!("unreachable state");

// your own error type, with a message and a cause
#[derive(Debug)]
enum ConfigError {
    Io(io::Error),
    Parse(String),
}

// the anyhow and thiserror crates remove most of the boilerplate`,
          notes: [
            { token: "Result<T, E>", meaning: "Ok or Err. An ordinary enum, in the signature" },
            { token: "?", meaning: "unwrap the Ok, or return the Err from here" },
            { token: "Option<T>", meaning: "might be absent, with nothing to explain" },
            { token: "panic! / unwrap", meaning: "for bugs, not failures. Ends the program" },
          ],
          prompt:
            "Use the operator that returns the error early, so the rest of the function only sees the success case.",
          starter: `fn read_config(path: &str) -> Result<i32, io::Error> {
    let text = fs::read_to_string(path);
    Ok(text.trim().parse().unwrap_or(0))
}`,
          rules: {
            regex: ["fs::read_to_string\\s*\\(\\s*path\\s*\\)\\?"],
            hint: "Add ? at the end: fs::read_to_string(path)?",
            success:
              "Correct. Without the ?, text is a Result rather than a String, and calling .trim() on it would not compile — the compiler catches the missing error handling for you.",
          },
          solution: `fn read_config(path: &str) -> Result<i32, io::Error> {
    let text = fs::read_to_string(path)?;
    Ok(text.trim().parse().unwrap_or(0))
}`,
        },
      },
    },

    /* ------------------------------------------------------- recovery -- */
    {
      id: "recovery",
      kicker: "02",
      title: "Catching, cleaning up, and carrying on",
      hook:
        "You catch an error, log it, and carry on. A week later a bug report says the data is wrong and nothing in the logs looks unusual. What went wrong?",
      body: [
        "You caught something you did not understand and continued as if nothing had happened. The program kept running with a broken assumption.",
        "That is the most common mistake in error handling, and it is worth stating as a rule: only catch what you can actually do something about. Everything else should travel up to somewhere that can.",
        "Catching too broadly is the same mistake in another form. `catch (...)` in C++ catches your bugs alongside the failures you meant to handle.",
        "So catch the SPECIFIC type. `catch (const out_of_range& e)` says what you are prepared for; `catch (...)` says you have stopped thinking.",
        "The second half of this is cleanup, and it has to happen on the failing path too — which is the path least likely to be tested.",
        "C++ has the best answer here and it needs no keyword: destructors run as the stack unwinds, so anything held by a scope object is released automatically. There is no `finally` because there is nothing to put in it.",
        "One rule that goes with unwinding: a destructor must never throw. If an exception is already travelling and a destructor throws a second one, the program calls `terminate` immediately. Destructors are `noexcept` by default for exactly this reason.",
      ],
      predict: {
        ask: "Is the mutex unlocked if process() throws?",
        code: `void work() {
  lock_guard<mutex> g(m);
  process();          // may throw
}`,
        choices: [
          { text: "No — nothing unlocks it, and the program deadlocks", why: "The lock_guard's destructor runs during unwinding, and unlocking is exactly what that destructor does." },
          { text: "Yes. The lock_guard's destructor runs as the stack unwinds", why: "Correct. That is RAII doing the work: leaving the scope for any reason destroys g, and destroying a lock_guard unlocks the mutex. No catch and no finally is needed." },
          { text: "Only if you add a try/catch", why: "Destructors of fully constructed objects run during unwinding whether or not anything catches the exception." },
          { text: "Only if process is marked noexcept", why: "noexcept would mean process cannot throw at all. The lock_guard handles the case where it does." },
        ],
        answer: 1,
      },
      viz: traceFinally(),
      example: `// catch the SPECIFIC type, and only what you can handle
try {
  auto v = config.at("timeout");
} catch (const out_of_range&) {
  timeout = 30;                 // a real recovery
}

// catch by CONST REFERENCE. Catching by value slices the object
catch (const exception& e) { cerr << e.what(); }

// cleanup needs no keyword — destructors run while unwinding
void work() {
  lock_guard<mutex> g(m);       // unlocked however we leave
  ifstream f("data.txt");       // closed however we leave
  auto p = make_unique<Dog>();  // freed however we leave
  process();                    // may throw. All three still release
}

// re-throw when you cannot handle it after all
try { risky(); }
catch (const exception& e) { log(e.what()); throw; }   // bare throw

// a destructor must NEVER throw
~File() noexcept {
  try { close(); } catch (...) { /* swallow. Nothing else is safe */ }
}

// promise you will not throw — the compiler can optimise for it
int add(int a, int b) noexcept { return a + b; }`,
      notes: [
        { token: "catch (const T& e)", meaning: "by const reference. By value slices the object" },
        { token: "no finally", meaning: "destructors already run while unwinding" },
        { token: "throw;", meaning: "a bare throw re-throws the current exception" },
        { token: "destructors must not throw", meaning: "a second exception while unwinding calls terminate" },
      ],
      challenge: {
        prompt:
          "Log the error and then pass it on unchanged, so the caller still sees the original.",
        starter: `try {
  risky();
} catch (const exception& e) {
  log(e.what());
  ;
}`,
        rules: {
          regex: ["log\\s*\\(\\s*e\\.what\\s*\\(\\s*\\)\\s*\\)\\s*;\\s*throw\\s*;"],
          mustNot: ["throw e;"],
          hint: "A bare `throw;` re-throws the current exception, keeping its real type.",
          success:
            "Correct, and the bare form matters: `throw e;` would COPY the exception into an object of the declared type, so a derived exception caught as exception& would be sliced down to a plain exception.",
        },
        solution: `try {
  risky();
} catch (const exception& e) {
  log(e.what());
  throw;
}`,
      },

      alt: {
        c: {
          hook:
            "A function takes three resources and any of the three steps can fail. In C there is no finally. How do you avoid leaking on every failure path?",
          body: [
            "One cleanup block at the end, reached with `goto`. It is the standard C answer, it is all over the Linux kernel, and it is the one use of goto nobody argues about.",
            "The shape is fixed. Initialise every pointer to NULL, take the resources one at a time, and jump to the cleanup label the moment anything fails.",
            "It works because `free(NULL)` is defined to do nothing. So the cleanup block can release everything unconditionally, whether or not that particular step got as far as succeeding.",
            "For labels, the convention is to have several — `out_free_b:`, `out_free_a:`, `out:` — falling through each other so each failure point jumps to the right level of cleanup. That way you never release something you never took.",
            "The alternative shapes are worse. Nested ifs march off the right of the screen; repeating the cleanup at each return means changing it in five places when a fourth resource appears.",
            "The other half of the discipline is checking every call that can fail. There is no exception to travel up on its own — an unchecked `fopen` returning NULL becomes a crash later, in a function that looks innocent.",
            "Compile with `-Wall -Wextra`, mark fallible functions `[[nodiscard]]`, and run the address sanitiser. In C the tools do the job the language does not.",
          ],
          predict: {
            ask: "Why does this cleanup block work even when the first malloc fails?",
            code: `char *a = NULL, *b = NULL;

a = malloc(100);
if (!a) goto out;
b = malloc(100);
if (!b) goto out;

out:
  free(a);
  free(b);`,
            choices: [
              { text: "It does not — freeing a null pointer crashes", why: "free(NULL) is explicitly defined by the standard to do nothing at all." },
              { text: "free(NULL) is defined to do nothing", why: "Correct. Both pointers start as NULL, so the cleanup block can free them unconditionally — the ones that were never allocated are simply no-ops. That is what makes a single cleanup block possible." },
              { text: "goto skips the frees when a is NULL", why: "goto out jumps TO the frees, not past them. The block runs on every path." },
              { text: "The compiler removes the free of a null pointer", why: "The compiler does not need to — free itself handles NULL, and that is a guarantee of the standard rather than an optimisation." },
            ],
            answer: 1,
          },
          example: `/* the standard shape: NULL first, one cleanup block at the end */
int work(const char *path) {
  char *buf = NULL;
  FILE *f = NULL;
  int rc = -1;                  /* assume failure */

  buf = malloc(1024);
  if (!buf) goto out;

  f = fopen(path, "r");
  if (!f) goto out;

  if (!fgets(buf, 1024, f)) goto out;

  rc = 0;                       /* only here is it a success */

out:
  if (f) fclose(f);
  free(buf);                    /* free(NULL) does nothing */
  return rc;
}

/* several labels, falling through, when the order matters */
/* out_close_f:  fclose(f);   */
/* out_free_buf: free(buf);   */
/* out:          return rc;   */

/* check every call. Nothing travels up on its own */
if (fclose(f) != 0) { /* even this can fail */ }

/* let the tools do the checking */
/* gcc -Wall -Wextra -fsanitize=address,undefined */`,
          notes: [
            { token: "goto out", meaning: "one cleanup block. The agreed use of goto" },
            { token: "NULL first", meaning: "so the cleanup can run unconditionally" },
            { token: "free(NULL)", meaning: "defined to do nothing. What makes the pattern work" },
            { token: "rc = -1 first", meaning: "assume failure, set success only at the end" },
          ],
          prompt:
            "Set rc to failure up front and only mark success once everything has worked.",
          starter: `int rc = ;

buf = malloc(1024);
if (!buf) goto out;

rc = ;

out:
  free(buf);
  return rc;`,
          rules: {
            regex: ["int\\s+rc\\s*=\\s*-1", "rc\\s*=\\s*0\\s*;"],
            hint: "Start with int rc = -1; and set rc = 0; only after everything has succeeded.",
            success:
              "Correct. Assuming failure means a path you forgot about returns an error rather than a false success — the safe direction to be wrong in.",
          },
          solution: `int rc = -1;

buf = malloc(1024);
if (!buf) goto out;

rc = 0;

out:
  free(buf);
  return rc;`,
        },

        python: {
          body: [
            "You caught something you did not understand and continued as if nothing had happened. The program kept running with a broken assumption.",
            "In Python this usually looks like `except Exception:` or, worse, a bare `except:`. Both catch your own bugs — a typo in an attribute name, a wrong type — alongside the failures you meant to handle.",
            "A bare `except:` also catches `KeyboardInterrupt` and `SystemExit`, so it can stop you from pressing Ctrl-C to kill the program. Never write one.",
            "Catch the SPECIFIC type. `except FileNotFoundError:` says what you are prepared for and lets everything else through.",
            "For cleanup, `finally` always runs, and `with` is almost always better. `with open(...)` closes the file however the block ends, and `contextlib.contextmanager` lets you write your own in a few lines.",
            "`else` is the underused clause: it runs only when the try block raised nothing. It lets you keep the try block down to the one line that might fail, which makes the except clause precise.",
            "One thing worth knowing: `return` inside `finally` replaces whatever the function was going to return, INCLUDING an exception on its way up. That silently swallows errors, and every linter warns about it.",
          ],
          predict: {
            ask: "What does this Python function return?",
            code: `def f():
    try:
        raise ValueError("bad")
    finally:
        return "ok"

print(f())`,
            choices: [
              { text: "It raises ValueError", why: "The return in finally replaces the exception on its way out, so nothing propagates." },
              { text: "\"ok\", and the ValueError vanishes", why: "Correct. A return inside finally overrides whatever was happening — including an exception in flight. The error disappears silently, which is why linters flag this." },
              { text: "None", why: "The finally block explicitly returns \"ok\", so that is what comes back." },
              { text: "It raises, then returns", why: "A function does one or the other. The return in finally wins and the exception is discarded." },
            ],
            answer: 1,
          },
          example: `# catch the SPECIFIC type
try:
    data = load(path)
except FileNotFoundError:
    data = {}                   # a real recovery

# NEVER
try:
    risky()
except:                         # catches KeyboardInterrupt too
    pass                        # and hides every bug

# else keeps the try block to the one risky line
try:
    f = open(path)
except FileNotFoundError:
    return None
else:
    with f:
        return f.read()

# finally always runs
try:
    work()
finally:
    cleanup()

# with is better than finally, when there is a context manager
with open(path) as f, lock:
    f.read()

# write your own
from contextlib import contextmanager

@contextmanager
def temp_setting(k, v):
    old = settings.get(k)
    settings[k] = v
    try:
        yield
    finally:
        settings[k] = old

# suppress, when you genuinely do not care
from contextlib import suppress
with suppress(FileNotFoundError):
    os.remove(path)`,
          notes: [
            { token: "except SpecificError", meaning: "say what you are prepared for" },
            { token: "bare except:", meaning: "catches Ctrl-C too. Never write one" },
            { token: "else", meaning: "runs only if nothing raised. Keeps try small" },
            { token: "return in finally", meaning: "swallows the exception. Never do it" },
          ],
          prompt:
            "Delete the file, ignoring the case where it is already gone — using the tool built for exactly that.",
          starter: `from contextlib import suppress

with (FileNotFoundError):
    os.remove(path)`,
          rules: {
            regex: ["with\\s+suppress\\s*\\(\\s*FileNotFoundError\\s*\\)\\s*:"],
            hint: "with suppress(FileNotFoundError):",
            success:
              "Correct. It is exactly try/except/pass, and the difference is that it names the one error you meant to ignore — so a permission error still gets through.",
          },
          solution: `from contextlib import suppress

with suppress(FileNotFoundError):
    os.remove(path)`,
        },

        java: {
          body: [
            "You caught something you did not understand and continued as if nothing had happened. The program kept running with a broken assumption.",
            "In Java the shape is `catch (Exception e) { }` — often written purely to make the compiler stop complaining about a checked exception, which is checked exceptions' worst side effect.",
            "Catch the specific type, and order the catch clauses from most specific to least. Java requires this — a catch for a parent type before its child does not compile, which is one place the compiler helps.",
            "Never swallow silently. At minimum log the exception WITH the exception object — `log.error(\"failed\", e)` includes the stack trace, while `log.error(\"failed \" + e)` throws it away.",
            "For cleanup, `try-with-resources` is the modern answer and it beats `finally` in one specific way: it handles the case where BOTH the body and the close throw. The close's exception is attached as a 'suppressed' exception rather than replacing the original.",
            "With a hand-written finally, an exception from close silently replaces the real one and you never see the actual cause.",
            "A bare `finally` still has its uses — restoring a flag, stopping a timer, releasing something that is not AutoCloseable. And as in Python, never `return` from inside it.",
          ],
          predict: {
            ask: "Why does this not compile?",
            code: `try {
  read(path);
} catch (Exception e) {
  log.error("failed", e);
} catch (IOException e) {
  log.error("io", e);
}`,
            choices: [
              { text: "IOException is checked and cannot be caught", why: "Checked exceptions are caught in exactly this way. The problem is the order of the two clauses." },
              { text: "The second catch is unreachable — Exception already caught it", why: "Correct. Catch clauses are tried in order, and Exception is IOException's ancestor, so nothing could ever reach the second clause. Java makes this a compile error rather than a warning." },
              { text: "You cannot have two catch clauses", why: "Any number of catch clauses is allowed, as long as each is reachable." },
              { text: "log.error takes only one argument", why: "The two-argument form taking a message and a Throwable is standard, and is exactly the form you want." },
            ],
            answer: 1,
          },
          example: `// most specific FIRST. Java enforces it
try {
  read(path);
} catch (NoSuchFileException e) {
  log.warn("missing: {}", path);
} catch (IOException e) {
  throw new ConfigException("cannot load", e);
}

// several with the same handling
catch (IOException | SQLException e) { log.error("failed", e); }

// log WITH the exception object, not concatenated
log.error("failed", e);          // includes the stack trace
// log.error("failed " + e);     // throws the stack away

// try-with-resources beats finally: it SUPPRESSES rather than replaces
try (var r = Files.newBufferedReader(p)) {
  return r.readLine();
}
// if both the body and close throw, the close's exception is
// attached to the first as a suppressed exception. With a
// hand-written finally, it would replace it and hide the real cause

// finally, for what is not AutoCloseable
boolean old = flag;
flag = true;
try {
  work();
} finally {
  flag = old;
}

// NEVER
try { risky(); } catch (Exception e) { }
try { risky(); } finally { return 0; }   // swallows everything`,
          notes: [
            { token: "most specific first", meaning: "and Java makes the wrong order a compile error" },
            { token: "log.error(msg, e)", meaning: "pass the exception. Concatenating loses the stack" },
            { token: "try-with-resources", meaning: "suppresses a close failure instead of hiding the real one" },
            { token: "return in finally", meaning: "swallows the exception. Never" },
          ],
          prompt:
            "Log the failure with its stack trace, then wrap and rethrow with the cause kept.",
          starter: `catch (IOException e) {
  log.error("cannot load ");
  throw new ConfigException("cannot load");
}`,
          rules: {
            regex: ["log\\.error\\s*\\(\\s*\"cannot load\"\\s*,\\s*e\\s*\\)", "new\\s+ConfigException\\s*\\(\\s*\"cannot load\"\\s*,\\s*e\\s*\\)"],
            hint: "log.error(\"cannot load\", e); and new ConfigException(\"cannot load\", e)",
            success:
              "Correct. In practice you would usually do one or the other — log it here, or wrap and let the caller log it — because doing both is how one failure ends up in the log five times.",
          },
          solution: `catch (IOException e) {
  log.error("cannot load", e);
  throw new ConfigException("cannot load", e);
}`,
        },

        javascript: {
          body: [
            "You caught something you did not understand and continued as if nothing had happened. The program kept running with a broken assumption.",
            "JavaScript makes this easier than most, because `catch (e)` catches everything — there is no way to catch by type in the syntax. You have to check inside: `if (e instanceof ConfigError)`, and re-throw what is not yours.",
            "That re-throw is the important habit. A catch block that handles only one case must end with `throw e` for everything else, or every unrelated bug disappears into it.",
            "For cleanup, `finally` is all there is. There is no `with`, no try-with-resources and no destructors, so the closing line is written out each time.",
            "The async half is where the real mistakes live. `await` inside a try/catch works exactly as you would hope. A promise NOT awaited does not — its rejection goes nowhere.",
            "`Promise.all` rejects as soon as any one of its promises does, and the others keep running with nobody watching. `Promise.allSettled` waits for all of them and reports each outcome, which is usually what you actually wanted.",
            "And the top-level handlers are worth setting up in a real application: `process.on(\"unhandledRejection\")` in Node, `window.onunhandledrejection` in the browser. They are a safety net for the ones you missed, not a substitute for handling them.",
          ],
          predict: {
            ask: "What happens to the error here?",
            code: `async function load() {
  throw new Error("boom");
}

function main() {
  try {
    load();
  } catch (e) {
    console.log("caught");
  }
}
main();`,
            choices: [
              { text: "It prints \"caught\"", why: "An async function returns a promise immediately. The throw becomes a rejection, which happens after the try block has already finished." },
              { text: "Nothing is caught — it becomes an unhandled rejection", why: "Correct. load() is not awaited, so it returns a promise instantly and the try block ends successfully. The rejection has nobody watching, and Node reports an unhandled rejection. Adding `await` inside the try fixes it." },
              { text: "It throws synchronously and crashes", why: "An async function never throws synchronously — it always returns a promise, and a throw inside becomes a rejection of that promise." },
              { text: "The error is silently discarded with no warning", why: "It is not caught, and it is not silent either: Node prints an unhandled rejection warning and recent versions exit with an error." },
            ],
            answer: 1,
          },
          example: `// catch is untyped. Check inside, and re-throw the rest
try {
  parse(text);
} catch (e) {
  if (e instanceof SyntaxError) {
    return fallback();
  }
  throw e;                   // not ours. Pass it on
}

// finally is the only cleanup mechanism
const conn = await pool.connect();
try {
  await conn.query("...");
} finally {
  conn.release();
}

// async: await turns a rejection into an ordinary catch
try {
  const data = await load(path);
} catch (e) {
  console.error(e);
}

// the classic bug — not awaited, so nothing catches it
load(path);                  // unhandled rejection
await load(path);            // caught by the surrounding try

// all vs allSettled
await Promise.all(tasks);        // rejects on the FIRST failure
const results = await Promise.allSettled(tasks);   // waits for all
for (const r of results) {
  if (r.status === "rejected") console.error(r.reason);
}

// the safety net, in a real application
process.on("unhandledRejection", (e) => { log(e); process.exit(1); });`,
          notes: [
            { token: "catch (e)", meaning: "catches everything. Check the type inside" },
            { token: "throw e", meaning: "re-throw what is not yours. Or it disappears" },
            { token: "await inside try", meaning: "what turns a rejection into a catch" },
            { token: "allSettled", meaning: "waits for all and reports each. Usually what you meant" },
          ],
          prompt:
            "Wait for every task and report each failure, rather than stopping at the first one.",
          starter: `const results = await Promise.(tasks);

for (const r of results) {
  if (r.status === "rejected") console.error(r.reason);
}`,
          rules: {
            regex: ["Promise\\.allSettled\\s*\\(\\s*tasks\\s*\\)"],
            mustNot: ["Promise.all(tasks)"],
            hint: "Promise.allSettled(tasks) — Promise.all would reject at the first failure.",
            success:
              "Correct. Note the shape of what comes back: every entry is either { status: \"fulfilled\", value } or { status: \"rejected\", reason } — never a bare value.",
          },
          solution: `const results = await Promise.allSettled(tasks);

for (const r of results) {
  if (r.status === "rejected") console.error(r.reason);
}`,
        },

        rust: {
          body: [
            "In Rust you cannot make that mistake by accident, because you cannot get at a value without acknowledging the error case. The compiler will not let a Result be silently ignored.",
            "So the question becomes what to DO with an error you have been handed, and there are four honest answers.",
            "Pass it up with `?`. Handle it with `match` or `if let`. Supply a fallback with `unwrap_or`, `unwrap_or_else` or `unwrap_or_default`. Or decide it cannot happen and `expect(\"why\")`.",
            "`?` does one more thing worth knowing: it CONVERTS the error type on the way, using the `From` trait. So a function returning `Result<T, MyError>` can use `?` on an `io::Error` as long as `MyError` implements `From<io::Error>`.",
            "That conversion is what makes one error type per module practical, and the `thiserror` crate generates all of it from a derive.",
            "For cleanup, Rust needs no `finally` for the same reason C++ does not: values are dropped when they go out of scope, including when `?` returns early or a panic unwinds.",
            "There is no try/catch. `catch_unwind` exists for catching a panic at a thread boundary, and it is for library authors rather than everyday code — a panic means a bug, and the intended response is to fix the bug.",
          ],
          predict: {
            ask: "Why does this compile even though the error types differ?",
            code: `#[derive(Debug)]
struct MyError;

impl From<std::io::Error> for MyError {
    fn from(_: std::io::Error) -> Self { MyError }
}

fn read(p: &str) -> Result<String, MyError> {
    Ok(std::fs::read_to_string(p)?)
}`,
            choices: [
              { text: "? ignores the error type", why: "It very much does not ignore it — it converts it, using the From implementation written just above." },
              { text: "? converts the error using the From implementation", why: "Correct. read_to_string gives an io::Error, and ? calls MyError::from on it because the impl exists. Without that impl the code would not compile." },
              { text: "Rust converts between all error types automatically", why: "There is no automatic conversion. The From implementation is what makes this particular pair work." },
              { text: "Result types are interchangeable", why: "They are not — the error type is part of the type, and mismatches are compile errors unless a conversion exists." },
            ],
            answer: 1,
          },
          example: `use std::{fs, io};

// pass it up, converting the type on the way
fn read(p: &str) -> Result<String, MyError> {
    let s = fs::read_to_string(p)?;      // io::Error -> MyError
    Ok(s)
}

// handle it
match read("cfg") {
    Ok(s) => println!("{}", s),
    Err(e) => eprintln!("failed: {:?}", e),
}

// handle just the success case
if let Ok(s) = read("cfg") { println!("{}", s); }

// supply a fallback
let s = read("cfg").unwrap_or_default();
let s = read("cfg").unwrap_or_else(|_| String::from("default"));

// decide it cannot happen, and say why
let s = read("cfg").expect("cfg is written at startup");

// cleanup needs no finally — Drop runs on every path, ? included
fn work() -> Result<(), MyError> {
    let _guard = mutex.lock().unwrap();  // unlocked however we leave
    let f = fs::File::open("data")?;     // closed however we leave
    Ok(())
}

// there is no try/catch. A panic is a bug, not a failure
// catch_unwind exists for thread boundaries, not everyday code

// in practice: thiserror for your own error types,
// anyhow for applications that just need one error type`,
          notes: [
            { token: "?", meaning: "pass it up, converting the type via From" },
            { token: "unwrap_or_else", meaning: "a fallback computed only when needed" },
            { token: "expect(\"why\")", meaning: "decide it cannot happen, and document the reason" },
            { token: "no finally", meaning: "Drop runs on every path, early returns included" },
          ],
          prompt:
            "Supply a fallback that is only built when the read actually failed.",
          starter: `let s = read("cfg").(|_| expensive_default());`,
          rules: {
            regex: ["\\.unwrap_or_else\\s*\\(\\s*\\|_\\|\\s*expensive_default\\s*\\(\\s*\\)\\s*\\)"],
            mustNot: ["unwrap_or(expensive_default())"],
            hint: "unwrap_or_else takes a closure, so the default is only computed on failure.",
            success:
              "Correct. unwrap_or would evaluate expensive_default() every time, even on the success path where the result is thrown away — the same distinction as Rust's then() versus then_with().",
          },
          solution: `let s = read("cfg").unwrap_or_else(|_| expensive_default());`,
        },
      },
    },

    /* --------------------------------------------------------- design -- */
    {
      id: "design",
      kicker: "03",
      title: "Deciding what counts as an error",
      hook:
        "A user types a password wrong. Is that an error?",
      body: [
        "No. It is an expected outcome of asking someone to type a password, and it happens thousands of times a day. An error is something that should not normally happen.",
        "That distinction decides a lot. Expected outcomes should be ordinary return values that the caller reads. Genuine failures should be reported in whatever way your language makes hard to ignore.",
        "The test worth applying: if this happened in a loop over normal input, would you be surprised? A missing key in a lookup, a search with no match, a user typing something invalid — none of those are surprising.",
        "A configuration file that will not parse, a database that has vanished, a disk that is full — those are.",
        "There is a practical reason to care in C++ specifically: throwing is expensive. Not the try block, which costs nothing when nothing throws, but the throw itself, which walks the stack and can take microseconds. Using exceptions for ordinary control flow is measurably slow.",
        "So express 'might not be there' with `optional<T>`, and 'a value or an explanation' with `expected<T, E>` in C++23. Save `throw` for the things that genuinely should not happen.",
        "One more rule, and it applies everywhere: fail EARLY and LOUDLY. Validate at the boundary where data comes in, and reject it there. A bad value accepted at the edge becomes a mystery in the middle six functions later.",
      ],
      predict: {
        ask: "Which of these deserves an exception rather than a return value?",
        code: `// A: a key not in a map
int get(const map<string,int>& m, const string& k);

// B: a config file that will not parse
Config load(const string& path);`,
        choices: [
          { text: "Both", why: "A missing key is an ordinary, expected outcome of a lookup and happens constantly." },
          { text: "Only B", why: "Correct. A missing key is a normal result of asking — return optional<int>. A configuration file that will not parse means the program cannot start, which is genuinely exceptional." },
          { text: "Only A", why: "It is the other way round: the lookup is routine and the broken configuration is not." },
          { text: "Neither — always return a value", why: "That is a defensible style, and it is not the mainstream C++ guidance: genuine failures that no caller can sensibly continue past are what exceptions are for." },
        ],
        answer: 1,
      },
      viz: traceErrorDesign(),
      example: `// EXPECTED outcomes: an ordinary return value
optional<int> find(const map<string,int>& m, const string& k);
if (auto v = find(m, "a")) use(*v);

// C++23: a value or an explanation, still no throwing
expected<Config, string> parse(const string& text);

// GENUINE failures: throw
Config load(const string& path) {
  ifstream f(path);
  if (!f) throw runtime_error("cannot open " + path);
  auto r = parse(read(f));
  if (!r) throw runtime_error("bad config: " + r.error());
  return *r;
}

// fail EARLY, at the boundary
void setAge(int n) {
  if (n < 0 || n > 150) throw invalid_argument("age was " + to_string(n));
  age = n;
}

// say what was wrong AND what was given
// "invalid age"                     useless
// "age must be 0-150, got -3"       actionable

// assert for things that should be impossible.
// Removed in release builds — never put real checks in one
assert(index < size);

// promise you will not throw, where you genuinely will not
size_t size() const noexcept { return n; }`,
      notes: [
        { token: "optional<T>", meaning: "expected absence. Not an error" },
        { token: "expected<T, E>", meaning: "a value or an explanation. C++23" },
        { token: "throw", meaning: "for what should not normally happen" },
        { token: "assert", meaning: "for the impossible. Removed in release builds" },
      ],
      challenge: {
        prompt:
          "Validate the age at the boundary, throwing an invalid_argument that says both the rule and the actual value.",
        starter: `void setAge(int n) {
  if () throw ("age must be 0-150, got " + to_string(n));
  age = n;
}`,
        rules: {
          regex: ["n\\s*<\\s*0\\s*\\|\\|\\s*n\\s*>\\s*150", "throw\\s+invalid_argument\\s*\\("],
          hint: "if (n < 0 || n > 150) throw invalid_argument(...)",
          success:
            "Correct. invalid_argument rather than runtime_error is the right choice too: it says the CALLER passed something wrong, which points at the bug rather than at the environment.",
        },
        solution: `void setAge(int n) {
  if (n < 0 || n > 150) throw invalid_argument("age must be 0-150, got " + to_string(n));
  age = n;
}`,
      },

      alt: {
        c: {
          body: [
            "No. It is an expected outcome of asking someone to type a password. An error is something that should not normally happen.",
            "In C the distinction shows up in how you shape the return value. An expected outcome can be a plain result — a count of zero, a NULL from a lookup, a boolean. A genuine failure gets a distinct error code that the caller must check.",
            "Keep those two apart. A function whose return value means both 'not found' and 'the disk failed' forces every caller to guess.",
            "The C convention is a set of named codes, defined once, so the meaning is in the header rather than in someone's memory. Magic numbers scattered through the code are how -2 comes to mean two different things in two files.",
            "Validate at the boundary, and validate hard. C will not check an index, a size or a null for you, so anything arriving from outside — a file, a socket, a command line — must be checked before it reaches the rest of your program.",
            "`assert` is for things that should be IMPOSSIBLE — a broken invariant, a case that cannot occur. It is compiled out when `NDEBUG` is defined, so never put a real check inside one. An assert on user input is a check that vanishes in release builds.",
            "And write the error messages for the person reading the log at three in the morning. \"error 5\" is useless; \"cannot open /etc/app.conf: Permission denied\" is not.",
          ],
          predict: {
            ask: "What is wrong with this validation?",
            code: `void set_age(int n) {
  assert(n >= 0 && n <= 150);
  age = n;
}`,
            choices: [
              { text: "Nothing — assert is the right tool", why: "assert is removed when NDEBUG is defined, so in a release build the check disappears entirely." },
              { text: "assert is compiled out in release builds, so the check vanishes", why: "Correct. Most release builds define NDEBUG, which turns assert into nothing. Validation of real input must be a normal if, not an assert — asserts are for things that should be impossible." },
              { text: "The range check is wrong", why: "The range itself is fine. The problem is the mechanism used to enforce it." },
              { text: "It should return int", why: "Returning a status is a reasonable design change, and the immediate bug is that the check disappears in release." },
            ],
            answer: 1,
          },
          example: `/* named codes, defined once, so the meaning is in the header */
typedef enum {
  APP_OK = 0,
  APP_NOT_FOUND,
  APP_IO_ERROR,
  APP_BAD_INPUT,
} AppResult;

/* expected absence: not an error */
const char *lookup(const Map *m, const char *k);   /* NULL = absent */

/* genuine failure: a code the caller must check */
AppResult load_config(const char *path, Config *out);

/* validate at the boundary, with a real if */
AppResult set_age(int n) {
  if (n < 0 || n > 150) return APP_BAD_INPUT;
  age = n;
  return APP_OK;
}

/* assert is for the IMPOSSIBLE. It vanishes in release builds */
assert(node != NULL);          /* an invariant we control */
/* NOT: assert(user_input > 0) — that check must survive release */

/* write messages for the person reading the log at 3am */
fprintf(stderr, "cannot open %s: %s\n", path, strerror(errno));
/* not: fprintf(stderr, "error 5\n"); */`,
          notes: [
            { token: "named codes", meaning: "in a header. Not magic numbers in five files" },
            { token: "NULL for absent", meaning: "an expected outcome, kept apart from failures" },
            { token: "assert", meaning: "for the impossible. Removed when NDEBUG is set" },
            { token: "strerror(errno)", meaning: "the actual reason, not just a number" },
          ],
          prompt:
            "Validate the age with a real check that survives a release build, returning a status code.",
          starter: `AppResult set_age(int n) {
  assert(n >= 0 && n <= 150);
  age = n;
  return APP_OK;
}`,
          rules: {
            regex: ["if\\s*\\(\\s*n\\s*<\\s*0\\s*\\|\\|\\s*n\\s*>\\s*150\\s*\\)\\s*return\\s+APP_BAD_INPUT"],
            mustNot: ["assert("],
            hint: "if (n < 0 || n > 150) return APP_BAD_INPUT;",
            success:
              "Correct. The rule is worth stating plainly: assert what your own code guarantees, and check what the outside world gives you.",
          },
          solution: `AppResult set_age(int n) {
  if (n < 0 || n > 150) return APP_BAD_INPUT;
  age = n;
  return APP_OK;
}`,
        },

        python: {
          body: [
            "No. It is an expected outcome of asking someone to type a password. An error is something that should not normally happen.",
            "Python complicates this pleasantly: exceptions here are cheap and idiomatic, so the line sits in a different place than in C++. `d[\"missing\"]` raising KeyError is completely normal, and `StopIteration` is how every for loop ends.",
            "So the Python question is less 'is this exceptional' and more 'which is clearer at the call site'. `d.get(k, default)` reads better than a try/except when you have a fallback; the try/except reads better when you do not.",
            "Where the distinction still bites is in what you catch. Catching KeyError around one dictionary access is precise. Catching it around twenty lines catches one you did not mean.",
            "Choose the right built-in type. `ValueError` for a value of the right type but the wrong content. `TypeError` for the wrong type. `KeyError` and `IndexError` for lookups. Using the right one lets callers catch precisely.",
            "Define your own for your own domain, inheriting from a single base: `class AppError(Exception)`, then `class ConfigError(AppError)`. Now callers can catch everything from your library with one clause.",
            "And validate at the boundary. Python will happily carry a string labelled 'age' through six functions before something tries arithmetic on it — check where the data comes in, and the traceback points at the real cause.",
          ],
          predict: {
            ask: "Which exception type fits best here?",
            code: `def set_age(n):
    if n < 0:
        raise ???("age must not be negative")`,
            choices: [
              { text: "TypeError", why: "TypeError is for a value of the wrong TYPE — passing a string here would be a TypeError. A negative int is the right type with the wrong content." },
              { text: "ValueError", why: "Correct. The type is right and the value is not, which is exactly what ValueError means. It also lets a caller catch this without catching type mistakes." },
              { text: "Exception", why: "Raising the base class works and tells callers nothing, so they can only catch it by catching everything." },
              { text: "KeyError", why: "KeyError is for a missing dictionary key. Nothing is being looked up here." },
            ],
            answer: 1,
          },
          example: `# expected: a plain return value with a default
value = d.get(key, default)
i = s.find("x")            # -1, rather than raising

# expected in Python's own style: an exception, caught precisely
try:
    value = d[key]
except KeyError:
    value = default

# choose the right type
raise ValueError(f"age must be 0-150, got {n}")   # wrong content
raise TypeError(f"expected int, got {type(n).__name__}")  # wrong type

# one base for your own, so callers can catch them all
class AppError(Exception): pass
class ConfigError(AppError): pass
class NetworkError(AppError): pass

# callers can then be as broad or narrow as they like
try:
    run()
except ConfigError:
    ...
except AppError:
    ...

# validate at the boundary
def handle_request(body):
    age = body.get("age")
    if not isinstance(age, int):
        raise TypeError(f"age must be an int, got {type(age).__name__}")
    if not 0 <= age <= 150:
        raise ValueError(f"age must be 0-150, got {age}")
    return store(age)

# say what was wrong AND what was given
# "invalid age"                  useless
# "age must be 0-150, got -3"    actionable`,
          notes: [
            { token: "ValueError vs TypeError", meaning: "wrong content, versus wrong type" },
            { token: "one base class", meaning: "so callers can catch all of yours at once" },
            { token: "validate at the boundary", meaning: "where data arrives, not six functions later" },
            { token: "include the value", meaning: "the message should say what it actually got" },
          ],
          prompt:
            "Raise the right type with a message that gives both the rule and the actual value.",
          starter: `def set_age(n):
    if not 0 <= n <= 150:
        raise (f"age must be 0-150, got ")`,
          rules: {
            regex: ["raise\\s+ValueError\\s*\\(\\s*f\"age must be 0-150, got \\{n\\}\"\\s*\\)"],
            hint: "raise ValueError(f\"age must be 0-150, got {n}\")",
            success:
              "Correct. The f-string is doing the important work: a message with the actual value turns a bug report into a fix, and one without it turns into a conversation.",
          },
          solution: `def set_age(n):
    if not 0 <= n <= 150:
        raise ValueError(f"age must be 0-150, got {n}")`,
        },

        java: {
          body: [
            "No. It is an expected outcome of asking someone to type a password. An error is something that should not normally happen.",
            "Java gives you the vocabulary to say so. `IllegalArgumentException` means the caller passed something wrong. `IllegalStateException` means the object is not in a state where this makes sense. Both are unchecked, because both are bugs.",
            "For expected absence, return `Optional<T>` rather than null. `Optional<User> findById(long id)` says clearly that not finding one is a normal outcome, and the caller cannot forget to handle it.",
            "Do not use Optional for fields or parameters — it was designed as a return type, and using it elsewhere adds noise without adding safety.",
            "There is a third category worth knowing: `Error` and its subclasses, like `OutOfMemoryError` and `StackOverflowError`. These mean the JVM itself is in trouble, and you should not catch them. That is also why `catch (Throwable t)` is worse than `catch (Exception e)` — it catches those too.",
            "Validate at the boundary, and use `Objects.requireNonNull(x, \"x\")` for arguments that must not be null. It throws immediately with a useful message, rather than a NullPointerException six methods later with no context.",
            "And write the message for whoever reads the log. Include the rule AND the value: \"age must be 0-150, got -3\" rather than \"invalid age\".",
          ],
          predict: {
            ask: "Which should this method do?",
            code: `// looking up a user that may not exist
User findById(long id) { ... }`,
            choices: [
              { text: "Throw NotFoundException when there is no user", why: "Not finding something is a normal outcome of a search, not an exceptional condition — and throwing forces every caller into a try/catch for the ordinary case." },
              { text: "Return Optional<User>", why: "Correct. Absence is expected here, so it belongs in the return type. Optional says so clearly and stops the caller forgetting, where returning null does neither." },
              { text: "Return null", why: "It works and it says nothing. Nothing in the signature warns the caller, which is how NullPointerExceptions start." },
              { text: "Return a User with default fields", why: "That hides the distinction between 'found a user with no name' and 'no user at all', which callers will eventually need." },
            ],
            answer: 1,
          },
          example: `// expected absence: Optional as a RETURN type
Optional<User> findById(long id) {
  return Optional.ofNullable(map.get(id));
}

findById(1).map(User::name).orElse("unknown");
findById(1).ifPresentOrElse(this::show, this::showEmpty);

// not for fields or parameters. Return types only

// the caller passed something wrong: unchecked
void setAge(int n) {
  if (n < 0 || n > 150)
    throw new IllegalArgumentException("age must be 0-150, got " + n);
  this.age = n;
}

// the object is not in a usable state
void send() {
  if (!connected) throw new IllegalStateException("not connected");
}

// fail immediately on a null argument, with a name
this.name = Objects.requireNonNull(name, "name");

// Error means the JVM is in trouble. Do NOT catch these
// OutOfMemoryError, StackOverflowError
// which is why catch (Throwable) is worse than catch (Exception)

// say the rule AND the value
// "invalid age"                  useless
// "age must be 0-150, got -3"    actionable`,
          notes: [
            { token: "Optional<T>", meaning: "expected absence. A return type only" },
            { token: "IllegalArgumentException", meaning: "the caller passed something wrong" },
            { token: "IllegalStateException", meaning: "this object is not ready for that" },
            { token: "Error subclasses", meaning: "the JVM is in trouble. Do not catch them" },
          ],
          prompt:
            "Fail immediately if name is null, with a message naming the parameter.",
          starter: `public Dog(String name) {
  this.name = (name, "name");
}`,
          rules: {
            regex: ["Objects\\.requireNonNull\\s*\\(\\s*name\\s*,\\s*\"name\"\\s*\\)"],
            hint: "Objects.requireNonNull(name, \"name\")",
            success:
              "Correct. It throws at the constructor with the message \"name\", instead of a NullPointerException much later in a method that never mentions where the null came from.",
          },
          solution: `public Dog(String name) {
  this.name = Objects.requireNonNull(name, "name");
}`,
        },

        javascript: {
          body: [
            "No. It is an expected outcome of asking someone to type a password. An error is something that should not normally happen.",
            "In JavaScript that distinction usually shows up as a choice between returning something and throwing. `arr.find()` returns undefined when there is no match, and that is the right shape for a search.",
            "The complication is that JavaScript has no Optional and no Result type, so 'absent' and 'failed' both tend to come back as `undefined` or `null`. Two returns that look identical mean quite different things.",
            "A common pattern in modern JavaScript is to return an object saying which happened: `{ ok: true, value }` or `{ ok: false, error }`. It is a hand-rolled Result, and it makes the two cases impossible to confuse.",
            "For genuine failures, throw an `Error` subclass with a `name`, so callers can tell yours apart with `instanceof`.",
            "Validate at the boundary. JavaScript will carry a string labelled 'age' anywhere, and `\"5\" - 1` quietly gives 4 — so data arriving from a form, a query string or an API needs checking where it arrives. A schema library like Zod is the usual answer for anything non-trivial.",
            "And include the value in the message. \"Invalid age\" tells you nothing; \"age must be 0-150, got -3\" tells you everything.",
          ],
          predict: {
            ask: "What is the problem with returning null for both cases here?",
            code: `function getUser(id) {
  if (!isValidId(id)) return null;   // bad input
  return db.find(id);                // returns null if absent
}`,
            choices: [
              { text: "Nothing — null is fine for both", why: "The caller cannot tell whether they made a mistake or the user simply does not exist, and those need different handling." },
              { text: "The caller cannot tell a bad id from a missing user", why: "Correct. One is a bug in the caller and the other is an ordinary outcome, but both come back as null. Throw for the bad id and return undefined for the missing user, or return a tagged result." },
              { text: "null should be undefined", why: "Which of the two you use is a style question. The real problem is that both cases are collapsed into one value." },
              { text: "getUser should be async", why: "That is independent of this problem — the same ambiguity exists whether or not it returns a promise." },
            ],
            answer: 1,
          },
          example: `// expected absence: return undefined, as the built-ins do
const found = arr.find(x => x.id === id);     // undefined if none
if (found === undefined) { }

// a hand-rolled Result, when both cases matter
function parseAge(text) {
  const n = Number(text);
  if (!Number.isInteger(n)) return { ok: false, error: "not an integer" };
  if (n < 0 || n > 150) return { ok: false, error: "out of range: " + n };
  return { ok: true, value: n };
}

const r = parseAge(input);
if (!r.ok) return showError(r.error);
use(r.value);

// genuine failures: throw, with a name callers can check
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

// validate at the BOUNDARY
function handleRequest(body) {
  const age = Number(body.age);
  if (!Number.isInteger(age)) {
    throw new ValidationError("age must be an integer, got " + body.age, "age");
  }
  return store(age);
}

// for anything non-trivial, a schema library does this properly`,
          notes: [
            { token: "return undefined", meaning: "for expected absence. What find() does" },
            { token: "{ ok, value } / { ok, error }", meaning: "a hand-rolled Result. The two cases stay apart" },
            { token: "a named Error subclass", meaning: "so callers can check with instanceof" },
            { token: "validate at the boundary", meaning: "where the data arrives from outside" },
          ],
          prompt:
            "Throw a ValidationError naming both the rule and the value that was actually given.",
          starter: `if (!Number.isInteger(age)) {
  throw new ValidationError(\`age must be an integer\`, "age");
}`,
          rules: {
            regex: ["`age must be an integer, got \\$\\{\\s*(body\\.age|age)\\s*\\}`"],
            hint: "Put the value in the template literal: `age must be an integer, got ${age}`",
            success:
              "Correct. And note the extra field: attaching `field: \"age\"` to the error lets a form highlight the right input, which a message string alone cannot do.",
          },
          solution: `if (!Number.isInteger(age)) {
  throw new ValidationError(\`age must be an integer, got \${age}\`, "age");
}`,
        },

        rust: {
          body: [
            "No. It is an expected outcome of asking someone to type a password. An error is something that should not normally happen.",
            "Rust has the clearest vocabulary of the six for this, because the two cases have different types.",
            "`Option<T>` means 'might be absent, with nothing to explain'. A lookup that finds nothing returns `None`, and that is not a failure.",
            "`Result<T, E>` means 'might fail, and here is why'. The E carries the explanation.",
            "`panic!` means 'this should be impossible' — a broken invariant, a case that cannot occur. It is for bugs, not for failures, and the intended response is to fix the code rather than to catch it.",
            "So the design question becomes a type question: can the caller do something about it? Then Result. Is absence just an ordinary answer? Then Option. Is it impossible unless the code is wrong? Then panic.",
            "For validation, the idiomatic Rust move goes further than checking: make the invalid state UNREPRESENTABLE. An `Age` type whose constructor is the only way to build one, and which returns a Result, means every function taking an `Age` knows it is valid without checking.",
            "That is the deeper version of 'validate at the boundary': validate once, at the edge, into a type that carries the guarantee — and then the compiler enforces it everywhere else for free.",
          ],
          predict: {
            ask: "Which return type fits each of these?",
            code: `fn find_user(id: u32) -> ???      // may not exist
fn read_config(p: &str) -> ???    // file may be missing or invalid
fn get(v: &Vec<i32>, i: usize) -> ???  // caller guarantees i is valid`,
            choices: [
              { text: "Result, Result, Result", why: "The first has nothing to explain — absence is the whole answer — and the third is guaranteed by the caller." },
              { text: "Option, Result, panic on a bad index", why: "Correct. Absence with nothing to explain is Option. A failure with a reason is Result. And something the caller has guaranteed is an invariant, so indexing and letting it panic is right — a violation there is a bug." },
              { text: "Option, Option, Option", why: "read_config has several distinct reasons to fail, and Option throws all of them away — the caller cannot tell a missing file from a malformed one." },
              { text: "Result, Option, Result", why: "It is the other way round for the first two: the lookup has nothing to explain, and the config load very much does." },
            ],
            answer: 1,
          },
          example: `// absence, with nothing to explain
fn find_user(id: u32) -> Option<User> { }

// failure, with a reason
fn read_config(p: &str) -> Result<Config, ConfigError> { }

// impossible unless the code is wrong: let it panic
fn get(v: &[i32], i: usize) -> i32 { v[i] }

// convert between them when you need to
let user = find_user(1).ok_or(AppError::NoSuchUser)?;   // Option -> Result
let maybe = read_config("cfg").ok();                    // Result -> Option

// the idiomatic move: make invalid states UNREPRESENTABLE
pub struct Age(u8);

impl Age {
    pub fn new(n: u8) -> Result<Self, String> {
        if n > 150 { return Err(format!("age must be 0-150, got {}", n)); }
        Ok(Age(n))
    }
    pub fn get(&self) -> u8 { self.0 }
}

// now every function taking an Age knows it is valid.
// No checking, no doubt, enforced by the compiler
fn birthday_card(age: Age) { }

// validate ONCE, at the edge, into a type that carries the guarantee`,
          notes: [
            { token: "Option<T>", meaning: "absent, with nothing to explain" },
            { token: "Result<T, E>", meaning: "failed, and here is why" },
            { token: "panic!", meaning: "impossible unless the code is wrong" },
            { token: "a validated newtype", meaning: "validate once. The compiler enforces the rest" },
          ],
          prompt:
            "Write the constructor so it rejects an out-of-range age with a message giving the rule and the value.",
          starter: `impl Age {
    pub fn new(n: u8) -> Result<Self, String> {
        if n > 150 { return (format!("age must be 0-150, got {}", n)); }
        (Age(n))
    }
}`,
          rules: {
            regex: ["return\\s+Err\\s*\\(\\s*format!", "Ok\\s*\\(\\s*Age\\s*\\(\\s*n\\s*\\)\\s*\\)"],
            hint: "return Err(format!(...)); for the failure, and Ok(Age(n)) for the success.",
            success:
              "Correct. Keeping the field private is what makes this work — Age::new is then the only way to build one, so no invalid Age can exist anywhere in the program.",
          },
          solution: `impl Age {
    pub fn new(n: u8) -> Result<Self, String> {
        if n > 150 { return Err(format!("age must be 0-150, got {}", n)); }
        Ok(Age(n))
    }
}`,
        },
      },
    },
  ],
};
