// Tracers for the language track.
//
// These teach how a language behaves rather than how an algorithm works, so the
// frames talk about boxes, labels and types rather than indexes and passes.

import { vars, type Bar, type Cell, type Frame, type Viz } from "@/lib/dsa/viz/types";

const box = (label: string, value: string, type: string, tone: Cell["tone"] = "idle"): Cell => ({
  v: value,
  i: `${label} · ${type}`,
  tone,
});

export function traceTypes(): Viz {
  const code = `age   = 27          // a whole number
name  = "Ada"       // text
ready = true        // true or false

total = age + 10    // fine: number + number
oops  = age + name  // what happens here?`;

  return {
    title: "Every value carries a type",
    blurb: "Watch what the language knows about each box, and what it refuses to do.",
    code,
    frames: [
      {
        say: "A value is a piece of data. A type is what KIND of data it is — and every value has one, whether you wrote it down or not.",
        rowLabel: "memory",
        row: [box("age", "27", "whole number", "active")],
        line: 1,
      },
      {
        say: "Text is a different type. 27 and \"27\" look similar on screen and behave completely differently.",
        rowLabel: "memory",
        row: [box("age", "27", "whole number", "done"), box("name", '"Ada"', "text", "active")],
        line: 2,
      },
      {
        say: "true and false are a third type of their own. Not 1 and 0 — a separate kind with only two possible values.",
        rowLabel: "memory",
        row: [
          box("age", "27", "whole number", "done"),
          box("name", '"Ada"', "text", "done"),
          box("ready", "true", "true/false", "active"),
        ],
        line: 3,
      },
      {
        say: "The type decides what an operation MEANS. Two numbers added give a number — that is arithmetic.",
        rowLabel: "memory",
        row: [
          box("age", "27", "whole number", "compare"),
          box("name", '"Ada"', "text", "ghost"),
          box("ready", "true", "true/false", "ghost"),
          box("total", "37", "whole number", "good"),
        ],
        line: 5,
        vars: vars({ "27 + 10": 37 }),
      },
      {
        say: "Now a number plus text. There is no obvious right answer, and this is exactly where the languages part company.",
        rowLabel: "memory",
        row: [
          box("age", "27", "whole number", "compare"),
          box("name", '"Ada"', "text", "compare"),
          box("oops", "?", "???", "bad"),
        ],
        line: 6,
      },
      {
        say: "Some languages refuse to compile it. Some crash when the line runs. One quietly glues them into \"27Ada\" and carries on. Knowing which one you are using is most of what 'knowing a language' means.",
        rowLabel: "memory",
        row: [
          box("age", "27", "whole number", "done"),
          box("name", '"Ada"', "text", "done"),
          box("oops", "depends", "on the language", "bad"),
        ],
        line: 6,
      },
    ],
  };
}

export function traceMutability(): Viz {
  const code = `score = 10        // make a box, put 10 in it
score = 25        // replace what is inside

LIMIT = 100       // a box that must never change
LIMIT = 200       // is this allowed?`;

  return {
    title: "A variable is a box, not a value",
    blurb: "The label stays put. What sits inside it may or may not be allowed to change.",
    code,
    frames: [
      {
        say: "Making a variable does two things: it sets aside a box, and it gives that box a name you can use later.",
        rowLabel: "memory",
        row: [box("score", "10", "whole number", "active")],
        line: 1,
      },
      {
        say: "Assigning again does NOT make a second box. It replaces what is inside the one you already have. The old 10 is gone.",
        rowLabel: "memory",
        row: [box("score", "25", "whole number", "good")],
        line: 2,
        vars: vars({ was: 10, now: 25 }),
      },
      {
        say: "That is why `score = score + 1` is not a contradiction. The right side is worked out first, using the old value, and the answer then replaces it.",
        rowLabel: "memory",
        row: [box("score", "26", "whole number", "compare")],
        vars: vars({ "score + 1": 26 }),
      },
      {
        say: "Some boxes should never change — a limit, a tax rate, the number of days in a week. Marking them says so, and the language then enforces it.",
        rowLabel: "memory",
        row: [box("score", "26", "whole number", "done"), box("LIMIT", "100", "fixed", "active")],
        line: 4,
      },
      {
        say: "Trying to change one is refused. That is the point: a mistake becomes an error you see immediately, instead of a wrong number you find out about much later.",
        rowLabel: "memory",
        row: [box("score", "26", "whole number", "done"), box("LIMIT", "100", "fixed", "bad")],
        line: 5,
        out: "error: cannot assign to a constant",
      },
      {
        say: "Which way round the default sits differs by language. Most let anything change unless you say otherwise. Rust does the opposite — nothing can change unless you ask for it — and that one decision shapes how the rest of the language feels.",
        rowLabel: "memory",
        row: [box("score", "26", "whole number", "done"), box("LIMIT", "100", "fixed", "good")],
      },
    ],
  };
}

export function traceIO(): Viz {
  const code = `print("What is your name?")
name = read_line()          // waits for you
print("Hello, " + name)

age = read_line()           // still TEXT, not a number
next_year = age + 1         // careful`;

  const frames: Frame[] = [
    {
      say: "A program with no input does the same thing every time. Reading turns it into something that responds.",
      rowLabel: "memory",
      row: [{ v: "empty", tone: "ghost" }],
      line: 1,
      out: "What is your name?",
    },
    {
      say: "The program stops here and waits. Nothing after this line runs until you type something and press enter.",
      rowLabel: "memory",
      row: [box("name", "waiting…", "text", "compare")],
      line: 2,
      out: "What is your name?",
    },
    {
      say: 'You type Ada. It lands in the box as TEXT — the letters A, d, a — not as anything the program understands the meaning of.',
      rowLabel: "memory",
      row: [box("name", '"Ada"', "text", "good")],
      line: 2,
      out: "What is your name?",
    },
    {
      say: "Joining text to text is fine, so the greeting works.",
      rowLabel: "memory",
      row: [box("name", '"Ada"', "text", "done")],
      line: 3,
      out: "What is your name?\nHello, Ada",
    },
    {
      say: "Now read an age. You type 27 — but it arrives as the TEXT \"27\", because everything typed at a keyboard is text.",
      rowLabel: "memory",
      row: [box("name", '"Ada"', "text", "done"), box("age", '"27"', "text", "bad")],
      line: 5,
    },
    {
      say: 'Adding 1 to the text "27" is the number-plus-text problem again. Depending on the language you get 28, or "271", or an error, or a crash.',
      rowLabel: "memory",
      row: [box("age", '"27"', "text", "compare"), box("next_year", "?", "???", "bad")],
      line: 6,
    },
    {
      say: "The fix is always the same idea: convert the text into a number before doing arithmetic with it. Every language spells that differently, and forgetting it is the most common first bug there is.",
      rowLabel: "memory",
      row: [box("age", "27", "whole number", "good"), box("next_year", "28", "whole number", "good")],
      vars: vars({ "after converting": 28 }),
    },
  ];

  return {
    title: "Everything you type arrives as text",
    blurb: "Watch the box that holds \"27\" rather than 27, and what that costs one line later.",
    code,
    frames,
  };
}

/* -------------------------------------------------------- truthiness -- */

/**
 * A comparison across all six at once.
 *
 * Most diagrams here show one language at a time. This one deliberately does
 * not: what counts as "true" is the sharpest disagreement in the whole track,
 * and seeing the columns side by side is the lesson.
 */
export function traceTruthiness(): Viz {
  const LANGS = ["C", "C++", "Python", "Java", "JS", "Rust"];
  const ROWS: { value: string; cells: string[]; say: string }[] = [
    {
      value: "0",
      cells: ["F", "F", "F", "—", "F", "—"],
      say: "Zero is false in the four languages that allow a number as a condition at all. Java and Rust refuse — they want an actual boolean, so `if (0)` does not compile.",
    },
    {
      value: "1",
      cells: ["T", "T", "T", "—", "T", "—"],
      say: "Any non-zero number is true. That is why `while (1)` is a forever loop in C, and why Java writes `while (true)` instead.",
    },
    {
      value: "-1",
      cells: ["T", "T", "T", "—", "T", "—"],
      say: "Negative counts as true too. Only exactly zero is false — a detail that bites people who expect -1 to mean failure.",
    },
    {
      value: '""',
      cells: ["T", "—", "F", "—", "F", "—"],
      say: 'Empty text. Python and JavaScript call it false. In C it is a POINTER to an empty string, and that pointer is not null, so it is true. C++ std::string will not convert to a bool at all.',
    },
    {
      value: '"0"',
      cells: ["T", "—", "T", "—", "T", "—"],
      say: 'The text "0" is true everywhere it is allowed — it is a non-empty string. In JavaScript that sits alongside `"0" == false` being true, which is a separate rule and a genuinely bad one.',
    },
    {
      value: "[]",
      cells: ["—", "—", "F", "—", "T", "—"],
      say: "An empty list. Python says false — empty containers are falsy, which is why `if items:` is idiomatic. JavaScript says TRUE, because every object is truthy. Same code, opposite behaviour.",
    },
    {
      value: "null",
      cells: ["F", "F", "F", "—", "F", "—"],
      say: "Null, nullptr, None — false wherever it is allowed. This is the one row everybody agrees on.",
    },
  ];

  const frames: Frame[] = [];
  const grid = (upto: number, hot?: number): Cell[][] =>
    ROWS.map((r, i) =>
      r.cells.map((c) => ({
        v: i <= upto ? c : "·",
        tone:
          i > upto ? "ghost" : i === hot ? (c === "T" ? "good" : c === "F" ? "bad" : "compare") : "done",
      })),
    );

  frames.push({
    say: "`if` needs a yes-or-no answer. But what counts as yes? Six languages, and they do not agree — this table is the single biggest source of surprise in the whole track.",
    gridLabel: "is this value true?",
    grid: grid(-1),
    gridRowNames: ROWS.map((r) => r.value),
    gridColNames: LANGS,
  });

  ROWS.forEach((r, i) => {
    frames.push({
      say: r.say,
      gridLabel: "is this value true?",
      grid: grid(i, i),
      gridRowNames: ROWS.map((x) => x.value),
      gridColNames: LANGS,
      vars: vars({ value: r.value }),
    });
  });

  frames.push({
    say: "Two columns are entirely dashes. Java and Rust have no truthiness at all: a condition must already be a boolean, so `if (list)` is a compile error and you write `if (!list.isEmpty())`. More typing, and nothing to memorise.",
    gridLabel: "is this value true?",
    grid: grid(ROWS.length - 1),
    gridRowNames: ROWS.map((r) => r.value),
    gridColNames: LANGS,
    vars: vars({ "no truthiness": "Java, Rust" }),
  });

  frames.push({
    say: "The row to remember is the empty list. Python calls it false, JavaScript calls it true. Someone moving between the two writes `if (items)` meaning 'if there is anything here' and gets the opposite answer, silently.",
    gridLabel: "is this value true?",
    grid: ROWS.map((r, i) =>
      r.cells.map((c) => ({ v: c, tone: i === 5 ? (c === "T" ? "good" : c === "F" ? "bad" : "compare") : "ghost" })),
    ),
    gridRowNames: ROWS.map((r) => r.value),
    gridColNames: LANGS,
  });

  return {
    title: "What counts as true, in all six at once",
    blurb: "A dash means the language refuses to guess. Watch the empty-list row.",
    frames,
  };
}

/* ------------------------------------------------------------ switch -- */

export function traceSwitch(): Viz {
  const CASES = ["1 — Monday", "2 — Tuesday", "3 — Wednesday", "default"];
  const frames: Frame[] = [];

  const rows = (active: number[], tone: Cell["tone"] = "active"): Cell[] =>
    CASES.map((c, i) => ({ v: c, tone: active.includes(i) ? tone : "idle" }));

  frames.push({
    say: "A long else-if chain asking the same variable over and over is what switch is for. Give it a value; it jumps straight to the matching case.",
    rowLabel: "cases",
    row: rows([]),
    out: "",
    line: 1,
  });

  frames.push({
    say: "day is 2, so control jumps to case 2 and prints Tuesday.",
    rowLabel: "cases",
    row: rows([1], "good"),
    out: "Tuesday",
    line: 4,
  });

  frames.push({
    say: "Now the trap. Without a `break`, control does NOT stop at the end of the case — it falls through into the next one and keeps going.",
    rowLabel: "cases",
    row: rows([1, 2], "bad"),
    out: "Tuesday Wednesday",
    line: 5,
  });

  frames.push({
    say: "And onwards into default. One missing keyword and every case below runs. This is legal, occasionally useful, and overwhelmingly a bug.",
    rowLabel: "cases",
    row: rows([1, 2, 3], "bad"),
    out: "Tuesday Wednesday Unknown",
    line: 6,
  });

  frames.push({
    say: "With `break` at the end of each case, control leaves the switch immediately and only Tuesday prints.",
    rowLabel: "cases",
    row: rows([1], "good"),
    out: "Tuesday",
    line: 4,
  });

  frames.push({
    say: "Newer languages removed the trap rather than documenting it. Rust's `match` never falls through, and it also refuses to compile unless every possible value is covered — so a case you forgot is an error rather than silence.",
    rowLabel: "cases",
    row: rows([0, 1, 2, 3], "done"),
    out: "Tuesday",
    vars: vars({ "C, C++, Java, JS": "falls through", Rust: "never falls through" }),
  });

  return {
    title: "Fallthrough: the keyword you must not forget",
    blurb: "Watch one missing break run every case below it.",
    code: `switch (day) {
  case 1:  print("Monday");
           break;
  case 2:  print("Tuesday");
           // no break — falls through!
  case 3:  print("Wednesday");
  default: print("Unknown");
}`,
    frames,
  };
}

/* ------------------------------------------------------------- loops -- */

export function traceLoopForms(): Viz {
  const items = ["red", "green", "blue"];
  const frames: Frame[] = [];

  const row = (hot: number, label: string): Cell[] =>
    items.map((v, i) => ({ v, i: String(i), tone: i === hot ? "good" : i < hot ? "done" : "idle" }));

  frames.push({
    say: "Three ways to walk a collection, and they hand you different things. Knowing which you need is most of choosing a loop.",
    rowLabel: "colours",
    row: row(-1, ""),
    line: 1,
  });

  for (let i = 0; i < items.length; i++) {
    frames.push({
      say: `Counting loop: i is ${i}, and you reach the value with colours[i]. You get the POSITION, and the value costs an extra lookup.`,
      rowLabel: "colours",
      row: row(i, "index"),
      vars: vars({ i, "colours[i]": items[i] }),
      line: 2,
    });
  }

  for (let i = 0; i < items.length; i++) {
    frames.push({
      say: `For-each: c is "${items[i]}" directly. You get the VALUE, and there is no index at all — which is exactly right when you do not need one.`,
      rowLabel: "colours",
      row: row(i, "value"),
      vars: vars({ c: items[i] }),
      line: 5,
    });
  }

  frames.push({
    say: "Use the counting loop when the position matters — comparing neighbours, writing to a different index, walking backwards. Use for-each otherwise: it cannot go out of bounds, because there is no index to get wrong.",
    rowLabel: "colours",
    row: row(items.length - 1, ""),
    line: 5,
  });

  frames.push({
    say: "The third form is `while`, and it is for when you cannot count the laps in advance: until the user types quit, until the number reaches 1, until nothing changed this round. Every language here has all three.",
    rowLabel: "colours",
    row: items.map((v) => ({ v, tone: "done" as const })),
    line: 8,
  });

  return {
    title: "Three loops, three different things in your hand",
    blurb: "Index, value, or a condition. Pick the one that matches what you actually need.",
    code: `// counting loop — gives you the POSITION
for (int i = 0; i < n; i++)
  print(colours[i]);

// for-each — gives you the VALUE
for (auto c : colours)
  print(c);

// while — for when you cannot count the laps
while (!done)
  step();`,
    frames,
  };
}

/* --------------------------------------------------------- call stack -- */

export function traceCallFrames(): Viz {
  const code = `int twice(int x) {
  x = x * 2;
  return x;
}

int main() {
  int n = 5;
  int r = twice(n);
  print(n, r);
}`;

  const frame = (label: string, boxes: [string, string][], tone: Cell["tone"]): Cell[] =>
    boxes.map(([k, v]) => ({ v, i: `${label}·${k}`, tone }));

  return {
    title: "A call is a new set of boxes",
    blurb: "Watch n and x live separately, and watch x disappear when the call ends.",
    code,
    frames: [
      {
        say: "main starts. n is 5.",
        rowLabel: "boxes in memory",
        row: frame("main", [["n", "5"]], "active"),
        line: 7,
        out: "",
      },
      {
        say: "The call reaches twice(n). main stops exactly here and waits — nothing after this line runs yet.",
        rowLabel: "boxes in memory",
        row: frame("main", [["n", "5"], ["r", "?"]], "ghost"),
        line: 8,
        out: "",
      },
      {
        say: "A NEW box called x is made for twice, and 5 is copied into it. There are now two boxes holding 5, and they are not connected.",
        rowLabel: "boxes in memory",
        row: [
          ...frame("main", [["n", "5"]], "ghost"),
          ...frame("twice", [["x", "5"]], "good"),
        ],
        line: 1,
        vars: vars({ "main's n": 5, "twice's x": 5 }),
      },
      {
        say: "twice doubles x. Its own box changes to 10. main's n is untouched, because it was never the same box.",
        rowLabel: "boxes in memory",
        row: [
          ...frame("main", [["n", "5"]], "ghost"),
          ...frame("twice", [["x", "10"]], "compare"),
        ],
        line: 2,
        vars: vars({ "main's n": 5, "twice's x": 10 }),
      },
      {
        say: "return hands 10 back and ends the call. Everything twice made — including x — is thrown away at this moment.",
        rowLabel: "boxes in memory",
        row: [
          ...frame("main", [["n", "5"]], "ghost"),
          ...frame("twice", [["x", "10"]], "bad"),
        ],
        line: 3,
        vars: vars({ returns: 10 }),
      },
      {
        say: "main wakes up with 10 in r. n is still 5 — the function could not reach it, only a copy of its value.",
        rowLabel: "boxes in memory",
        row: frame("main", [["n", "5"], ["r", "10"]], "good"),
        line: 8,
        out: "5 10",
      },
      {
        say: "That stack of paused calls is the CALL STACK, and it has a size limit. Recursion that never stops fills it and the program dies — which is exactly what a stack overflow is.",
        rowLabel: "boxes in memory",
        row: frame("main", [["n", "5"], ["r", "10"]], "done"),
        out: "5 10",
      },
    ],
  };
}

/* ------------------------------------------------- passing arguments -- */

/**
 * Three models, side by side.
 *
 * This is the sharpest divide in the whole track after truthiness, and the one
 * that produces "why did my list change?" bugs, so all three are shown together
 * rather than one per language.
 */
export function traceArgModels(): Viz {
  const frames: Frame[] = [];

  const two = (
    a: string,
    b: string,
    toneA: Cell["tone"],
    toneB: Cell["tone"],
    labelB = "inside",
  ): Cell[] => [
    { v: a, i: "caller", tone: toneA },
    { v: b, i: labelB, tone: toneB },
  ];

  frames.push({
    say: "You pass a value to a function and the function changes it. Does the caller see the change? Three different answers, and every language here uses one of them.",
    rowLabel: "the question",
    row: [{ v: "?", i: "caller sees…", tone: "compare" }],
  });

  frames.push({
    say: "MODEL 1 — a copy. The function gets its own box holding the same value. C, C++ and Java for numbers; C++ for whole objects too, unless you ask otherwise.",
    rowLabel: "copy",
    row: two("5", "5", "done", "good"),
    vars: vars({ model: "pass by value" }),
  });

  frames.push({
    say: "The function writes 10 into its box. The caller's box is a different box, so it still holds 5. Nothing the function does can reach it.",
    rowLabel: "copy",
    row: two("5", "10", "done", "compare"),
    vars: vars({ caller: 5, inside: 10 }),
  });

  frames.push({
    say: "MODEL 2 — a shared reference. Both names point at the SAME thing. Python, Java and JavaScript for objects and lists; C++ when you write &.",
    rowLabel: "shared",
    row: [{ v: "[1, 2]", i: "caller + inside", tone: "good" }],
    vars: vars({ model: "shared reference" }),
  });

  frames.push({
    say: "The function appends 3. There is only one list, so the caller sees it too. This is where 'why did my list change?' comes from.",
    rowLabel: "shared",
    row: [{ v: "[1, 2, 3]", i: "caller + inside", tone: "compare" }],
    vars: vars({ caller: "[1, 2, 3]", inside: "[1, 2, 3]" }),
  });

  frames.push({
    say: "But REASSIGNING inside is different again. Pointing the inner name at a brand new list does not move the caller's name — it still points at the old one.",
    rowLabel: "shared",
    row: two("[1, 2, 3]", "[9]", "good", "bad", "inside"),
    vars: vars({ caller: "[1, 2, 3]", inside: "[9]" }),
  });

  frames.push({
    say: "That is the subtlety people miss. Python, Java and JavaScript pass a reference BY VALUE: you can change what it points at, but you cannot make the caller's name point somewhere else.",
    rowLabel: "shared",
    row: two("[1, 2, 3]", "[9]", "done", "ghost", "inside"),
  });

  frames.push({
    say: "MODEL 3 — a move. Rust hands ownership over. The value is now the function's, and the caller's name is not usable at all.",
    rowLabel: "move",
    row: two("moved out", "[1, 2]", "bad", "good", "inside"),
    vars: vars({ model: "move (Rust)" }),
  });

  frames.push({
    say: "Touching the caller's name afterwards is a compile error, not a crash. So the 'why did my thing change?' bug cannot be written — you either lent it out with &, or you gave it away.",
    rowLabel: "move",
    row: two("unusable", "[1, 2]", "bad", "done", "inside"),
    vars: vars({ "using it after": "will not compile" }),
  });

  frames.push({
    say: "So before calling anything, ask one question: does this function get a copy, a shared pointer at my data, or my data itself? The answer decides whether your value can change behind your back.",
    rowLabel: "the three models",
    row: [
      { v: "copy", i: "C, C++, numbers", tone: "done" },
      { v: "shared ref", i: "Py, Java, JS objects", tone: "compare" },
      { v: "move", i: "Rust", tone: "good" },
    ],
  });

  return {
    title: "Copy, share, or hand over",
    blurb: "Three answers to one question: can the function change what I gave it?",
    code: `// a copy — the caller is safe
void f(int x)          { x = 10; }

// a reference — the caller's value really changes
void f(int& x)         { x = 10; }

// read-only reference — no copy, and no changes allowed
void f(const string& s) { }`,
    frames,
  };
}

/* ------------------------------------------------------ many results -- */

export function traceMultiReturn(): Viz {
  return {
    title: "Getting more than one thing back",
    blurb: "return hands back exactly one value — so the trick is making that one value carry several.",
    code: `// one value out
int smallest(vector<int> v);

// several — bundle them into one
pair<int,int> minMax(vector<int> v) {
  return {lo, hi};
}

auto [lo, hi] = minMax(v);   // and unpack on the way in`,
    frames: [
      {
        say: "return hands back exactly one value. Every language here works that way — there is no second slot.",
        rowLabel: "coming back",
        row: [{ v: "12", i: "one value", tone: "good" }],
        line: 2,
      },
      {
        say: "But you often want two: the smallest AND the largest, the answer AND whether it worked, the quotient AND the remainder.",
        rowLabel: "wanted",
        row: [
          { v: "1", i: "lo", tone: "compare" },
          { v: "12", i: "hi", tone: "compare" },
        ],
      },
      {
        say: "The trick is to make that one value carry several. Bundle them into a pair, a tuple, or a small struct — now one thing comes back, and it holds both.",
        rowLabel: "one value, two parts",
        row: [{ v: "{1, 12}", i: "a pair", tone: "good" }],
        line: 5,
      },
      {
        say: "Then unpack it on the way in, so you get two named variables rather than having to reach into the bundle every time.",
        rowLabel: "unpacked",
        row: [
          { v: "1", i: "lo", tone: "good" },
          { v: "12", i: "hi", tone: "good" },
        ],
        line: 9,
      },
      {
        say: "The alternative some languages use is an output parameter: pass something in by reference and have the function fill it. It works, and it reads much worse — the call no longer tells you what comes back.",
        rowLabel: "output parameter",
        row: [
          { v: "1", i: "filled in", tone: "compare" },
          { v: "12", i: "filled in", tone: "compare" },
        ],
      },
      {
        say: "Prefer returning a bundle. A reader can see what a function produces from its signature alone, without having to work out which arguments are secretly outputs.",
        rowLabel: "one value, two parts",
        row: [{ v: "{1, 12}", i: "returned", tone: "done" }],
      },
    ],
  };
}

/* --------------------------------------------------- arrays & strings -- */

/**
 * Indexing, and what each language does when you step past the end.
 *
 * The last frames are the point: the same mistake is silent corruption in two
 * languages, an exception in two, undefined in one, and a clean stop in one.
 */
export function traceIndexing(): Viz {
  const code = `int nums[5] = {10, 20, 30, 40, 50};

cout << nums[0];    // first
cout << nums[4];    // last
cout << nums[5];    // one past the end`;

  const cells = (hot: number | null, tone: Cell["tone"] = "active"): Cell[] =>
    [10, 20, 30, 40, 50].map((v, i) => ({
      v: String(v),
      i: String(i),
      tone: i === hot ? tone : "idle",
    }));

  return {
    title: "Five boxes, numbered from zero",
    blurb: "Watch where index 5 lands — and what each language does about it.",
    code,
    frames: [
      {
        say: "One name, five boxes, side by side in memory. The name nums points at the first one.",
        rowLabel: "nums",
        row: cells(null),
        line: 1,
        vars: vars({ length: 5 }),
      },
      {
        say: "nums[0] is the FIRST box. Counting starts at zero because the index is really a distance: 'zero boxes along from the start'.",
        rowLabel: "nums",
        row: cells(0),
        line: 3,
        out: "10",
      },
      {
        say: "nums[4] is the LAST box. Five boxes, so the highest valid index is 4 — one less than the length. Almost every off-by-one bug lives here.",
        rowLabel: "nums",
        row: cells(4, "good"),
        line: 4,
        out: "10 50",
      },
      {
        say: "nums[5] is one step past the end. There is no sixth box.",
        rowLabel: "nums",
        row: [...cells(null), { v: "??", i: "5", tone: "bad" }],
        line: 5,
        vars: vars({ index: 5, "highest valid": 4 }),
      },
      {
        say: "C and C++ do not check. They compute the address and read whatever is there — some other variable, or nothing at all. The program keeps running with a wrong value.",
        rowLabel: "nums",
        row: [...cells(null, "ghost"), { v: "junk", i: "5", tone: "bad" }],
        line: 5,
        vars: vars({ "C / C++": "reads junk, no error" }),
      },
      {
        say: "Java and Python stop the program with an error that names the problem: ArrayIndexOutOfBoundsException, IndexError. You find out immediately.",
        rowLabel: "nums",
        row: [...cells(null, "ghost"), { v: "throw", i: "5", tone: "bad" }],
        line: 5,
        vars: vars({ "Java / Python": "an exception, on the spot" }),
      },
      {
        say: "JavaScript hands back undefined and carries on. No error — but undefined in arithmetic gives NaN, so the damage turns up somewhere else later.",
        rowLabel: "nums",
        row: [...cells(null, "ghost"), { v: "undef", i: "5", tone: "bad" }],
        line: 5,
        vars: vars({ JavaScript: "undefined, no error" }),
      },
      {
        say: "Rust checks and panics — it stops cleanly and tells you the index and the length. Or you use .get(5), which hands back None and lets you handle it.",
        rowLabel: "nums",
        row: [...cells(null, "ghost"), { v: "panic", i: "5", tone: "bad" }],
        line: 5,
        vars: vars({ Rust: "panic, or .get() -> None" }),
      },
      {
        say: "The lesson: the mistake is identical in all six. What differs is whether the language tells you. In C and C++, nothing will.",
        rowLabel: "nums",
        row: cells(null, "done"),
        vars: vars({ rule: "last index = length - 1" }),
      },
    ],
  };
}

/**
 * Why appending to a growable array is cheap even though it sometimes copies
 * everything. Shows length and capacity as separate numbers.
 */
export function traceGrowth(): Viz {
  const code = `vector<int> v;      // empty. capacity 0

v.push_back(1);
v.push_back(2);
v.push_back(3);
v.push_back(4);
v.push_back(5);`;

  const frames: Frame[] = [];

  const draw = (len: number, cap: number, note: string, line: number, tone: Cell["tone"]) => {
    const row: Cell[] = [];
    for (let i = 0; i < cap; i++) {
      row.push(
        i < len
          ? { v: String(i + 1), i: String(i), tone: i === len - 1 ? tone : "idle" }
          : { v: "·", i: String(i), tone: "ghost" },
      );
    }
    frames.push({
      say: note,
      rowLabel: "one block of memory",
      row: row.length ? row : [{ v: "—", tone: "ghost" }],
      line,
      vars: vars({ length: len, capacity: cap, spare: cap - len }),
    });
  };

  frames.push({
    say: "An empty vector. It owns no memory yet — length 0, capacity 0.",
    rowLabel: "one block of memory",
    row: [{ v: "—", tone: "ghost" }],
    line: 1,
    vars: vars({ length: 0, capacity: 0 }),
  });

  frames.push({
    say: "push_back(1) needs room and there is none. So it asks for a block, and takes more than it needs — capacity 1 here, but it is already planning ahead.",
    rowLabel: "one block of memory",
    row: [{ v: "1", i: "0", tone: "good" }],
    line: 3,
    vars: vars({ length: 1, capacity: 1, spare: 0 }),
  });

  frames.push({
    say: "push_back(2) is full again. This is the expensive step: a bigger block is taken, everything already there is COPIED across, and the old block is released.",
    rowLabel: "copying to a bigger block",
    row: [
      { v: "1", i: "0", tone: "compare" },
      { v: "2", i: "1", tone: "good" },
    ],
    line: 4,
    vars: vars({ length: 2, capacity: 2, "copied across": 1 }),
  });

  frames.push({
    say: "push_back(3): full again, so grow again. Capacity doubles to 4 and the 2 existing values are copied.",
    rowLabel: "one block of memory",
    row: [
      { v: "1", i: "0", tone: "compare" },
      { v: "2", i: "1", tone: "compare" },
      { v: "3", i: "2", tone: "good" },
      { v: "·", i: "3", tone: "ghost" },
    ],
    line: 5,
    vars: vars({ length: 3, capacity: 4, spare: 1, "copied across": 2 }),
  });

  draw(4, 4, "push_back(4) fits in the spare slot. No new block, no copying — this one is nearly free.", 6, "good");

  frames.push({
    say: "push_back(5) is full again. Double to 8, copy the 4 values across. Notice how the expensive steps get rarer as the vector grows.",
    rowLabel: "one block of memory",
    row: [
      { v: "1", i: "0", tone: "compare" },
      { v: "2", i: "1", tone: "compare" },
      { v: "3", i: "2", tone: "compare" },
      { v: "4", i: "3", tone: "compare" },
      { v: "5", i: "4", tone: "good" },
      { v: "·", i: "5", tone: "ghost" },
      { v: "·", i: "6", tone: "ghost" },
      { v: "·", i: "7", tone: "ghost" },
    ],
    line: 7,
    vars: vars({ length: 5, capacity: 8, spare: 3, "copied across": 4 }),
  });

  frames.push({
    say: "Doubling is why appending is cheap ON AVERAGE. Copies happen at 1, 2, 4, 8, 16 — so a million appends copy about a million values in total, not a million each time.",
    rowLabel: "growth points",
    row: [1, 2, 4, 8, 16, 32].map((v) => ({ v: String(v), tone: "compare" as const })),
    vars: vars({ "cost per append, averaged": "constant" }),
  });

  frames.push({
    say: "Two things follow. If you know the final size, reserve it up front and skip every copy. And any pointer or reference into the vector becomes invalid the moment it grows.",
    rowLabel: "one block of memory",
    row: [1, 2, 3, 4, 5].map((v, i) => ({ v: String(v), i: String(i), tone: "done" as const })),
    vars: vars({ "v.reserve(1000)": "one block, no copying" }),
  });

  return {
    title: "How a growable array grows",
    blurb: "Watch capacity double, and watch the copying that pays for it.",
    code,
    frames,
  };
}

/**
 * Strings: characters versus bytes, and the fact that "changing" a string
 * usually builds a new one.
 */
export function traceStringBytes(): Viz {
  const code = `string s = "cafe";

s = s + "!";        // builds a NEW string

string t = "café";  // é is not one byte`;

  const letters = (word: string[], tone: Cell["tone"], hot = -1): Cell[] =>
    word.map((c, i) => ({ v: c, i: String(i), tone: i === hot ? "good" : tone }));

  return {
    title: "A string is a row of boxes too",
    blurb: "Watch a 'change' build a whole new string, and watch é take two boxes.",
    code,
    frames: [
      {
        say: "A string is just characters in a row, indexed from zero — the same shape as an array.",
        rowLabel: "s",
        row: letters(["c", "a", "f", "e"], "active"),
        line: 1,
        vars: vars({ "s.length": 4 }),
      },
      {
        say: "s[0] is 'c' and s[3] is 'e'. Indexing works exactly as it does for an array, including the off-by-one at the end.",
        rowLabel: "s",
        row: letters(["c", "a", "f", "e"], "idle", 3),
        line: 1,
        vars: vars({ "s[0]": "c", "s[3]": "e" }),
      },
      {
        say: "Now s + \"!\". In Python, Java, JavaScript and Rust's &str, strings cannot be changed in place. Nothing is added to the boxes above.",
        rowLabel: "s (unchanged)",
        row: letters(["c", "a", "f", "e"], "ghost"),
        line: 3,
        vars: vars({ "can s change in place?": "no, in most of them" }),
      },
      {
        say: "Instead a NEW string is built, the old contents are copied into it, and the name s is pointed at the new one. The old string is left for the garbage collector.",
        rowLabel: "the new string",
        row: letters(["c", "a", "f", "e", "!"], "good"),
        line: 3,
        vars: vars({ "s.length": 5, "strings made": 2 }),
      },
      {
        say: "That is why building a string in a loop is a classic slow spot: 1000 concatenations build 1000 strings. Use a builder — StringBuilder, join, push_str — instead.",
        rowLabel: "s + \"!\" 1000 times",
        row: [
          { v: "1", tone: "compare" },
          { v: "2", tone: "compare" },
          { v: "3", tone: "compare" },
          { v: "…", tone: "ghost" },
          { v: "1000", tone: "bad" },
        ],
        vars: vars({ "strings built": 1000, better: "one builder" }),
      },
      {
        say: "Now the harder one. \"café\" looks like 4 characters. But é does not fit in one byte — in UTF-8 it takes two.",
        rowLabel: "café, as bytes",
        row: [
          { v: "c", i: "0", tone: "idle" },
          { v: "a", i: "1", tone: "idle" },
          { v: "f", i: "2", tone: "idle" },
          { v: "0xC3", i: "3", tone: "bad" },
          { v: "0xA9", i: "4", tone: "bad" },
        ],
        line: 5,
        vars: vars({ characters: 4, bytes: 5 }),
      },
      {
        say: "So the answer to 'how long is this string?' depends on what you are counting. Python says 4 (characters). Rust's .len() says 5 (bytes). Java and JavaScript say 4 here, but count some emoji as 2.",
        rowLabel: "café, as bytes",
        row: [
          { v: "c", i: "0", tone: "ghost" },
          { v: "a", i: "1", tone: "ghost" },
          { v: "f", i: "2", tone: "ghost" },
          { v: "0xC3", i: "3", tone: "compare" },
          { v: "0xA9", i: "4", tone: "compare" },
        ],
        vars: vars({ Python: 4, "Rust .len()": 5, "Java / JS": 4 }),
      },
      {
        say: "And it is why Rust refuses to let you write s[3] on a string at all: byte 3 is half a character, and half a character is not a thing. You ask for .chars() instead.",
        rowLabel: "café, as characters",
        row: letters(["c", "a", "f", "é"], "done"),
        vars: vars({ rule: "plain English is safe, anything else is not" }),
      },
    ],
  };
}

/* ------------------------------------------------------ data structures -- */

/**
 * Why a map finds a key without searching.
 *
 * The point of the last frames is the comparison: a list of a million pairs
 * needs a million comparisons in the worst case; a map needs about one.
 */
export function traceHashMap(): Viz {
  const code = `map["cat"] = 3;
map["dog"] = 5;
map["fox"] = 7;

cout << map["dog"];`;

  const buckets = (filled: Record<number, string>, hot = -1): Cell[] =>
    [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({
      v: filled[i] ?? "·",
      i: String(i),
      tone: i === hot ? "good" : filled[i] ? "active" : "ghost",
    }));

  return {
    title: "How a map finds a key instantly",
    blurb: "Watch the key turn into a slot number — no searching at all.",
    code,
    frames: [
      {
        say: "A map is really an array of slots. Eight empty slots to start with.",
        rowLabel: "slots",
        row: buckets({}),
        vars: vars({ slots: 8, stored: 0 }),
      },
      {
        say: "Storing \"cat\". The key is run through a hash function — a fixed recipe that turns any key into a number. Say it gives 19.",
        rowLabel: "slots",
        row: buckets({}),
        line: 1,
        vars: vars({ key: "cat", "hash(key)": 19 }),
      },
      {
        say: "19 mod 8 is 3. So \"cat\" goes in slot 3. No searching happened — the slot was calculated from the key itself.",
        rowLabel: "slots",
        row: buckets({ 3: "cat:3" }, 3),
        line: 1,
        vars: vars({ key: "cat", "19 % 8": 3 }),
      },
      {
        say: "\"dog\" hashes to 42. 42 mod 8 is 2, so it lands in slot 2.",
        rowLabel: "slots",
        row: buckets({ 2: "dog:5", 3: "cat:3" }, 2),
        line: 2,
        vars: vars({ key: "dog", "42 % 8": 2 }),
      },
      {
        say: "\"fox\" hashes to 27. 27 mod 8 is 3 — which is already taken by \"cat\". This is a COLLISION, and it is normal.",
        rowLabel: "slots",
        row: buckets({ 2: "dog:5", 3: "cat:3" }, 3),
        line: 3,
        vars: vars({ key: "fox", "27 % 8": 3, "slot 3": "taken" }),
      },
      {
        say: "The map handles it — usually by keeping a small chain in that slot. Slot 3 now holds two pairs, and looking there means checking both.",
        rowLabel: "slots",
        row: buckets({ 2: "dog:5", 3: "cat,fox" }, 3),
        line: 3,
        vars: vars({ "slot 3 holds": 2, stored: 3 }),
      },
      {
        say: "Now the lookup. map[\"dog\"] hashes \"dog\" again, gets 42, works out slot 2, and looks only there. One step, whatever the size of the map.",
        rowLabel: "slots",
        row: buckets({ 2: "dog:5", 3: "cat,fox" }, 2),
        line: 5,
        out: "5",
        vars: vars({ "steps taken": 1 }),
      },
      {
        say: "Compare that with a list of pairs. To find \"dog\" you check every pair until you hit it — a million pairs means up to a million checks.",
        rowLabel: "the same data in a list",
        row: [
          { v: "cat:3", i: "0", tone: "compare" },
          { v: "dog:5", i: "1", tone: "compare" },
          { v: "fox:7", i: "2", tone: "ghost" },
          { v: "…", tone: "ghost" },
        ],
        vars: vars({ "list, worst case": "n checks", "map": "about 1" }),
      },
      {
        say: "Two prices for that speed. The order is not the order you inserted — it comes from the hashing. And when the slots fill up, the map takes a bigger array and rehashes everything into it.",
        rowLabel: "slots",
        row: buckets({ 2: "dog:5", 3: "cat,fox" }),
        vars: vars({ cost: "no useful order", "when full": "rehash everything" }),
      },
    ],
  };
}

/** A set: membership and uniqueness, and what it does with a duplicate. */
export function traceSetOps(): Viz {
  const code = `set<string> seen;

seen.insert("cat");
seen.insert("dog");
seen.insert("cat");   // already there

cout << seen.count("dog");`;

  const cells = (items: string[], hot = -1, extra?: Cell): Cell[] => {
    const out: Cell[] = items.map((v, i) => ({
      v,
      tone: i === hot ? "good" : "active",
    }));
    if (extra) out.push(extra);
    return out;
  };

  return {
    title: "A set keeps one of each",
    blurb: "Watch the duplicate simply vanish, and watch the membership test not search.",
    code,
    frames: [
      {
        say: "A set is a map with the values thrown away. It stores keys, and answers one question: is this in here?",
        rowLabel: "seen",
        row: [{ v: "empty", tone: "ghost" }],
        line: 1,
        vars: vars({ size: 0 }),
      },
      {
        say: "Insert \"cat\". It is hashed to a slot exactly as a map key would be, and stored.",
        rowLabel: "seen",
        row: cells(["cat"], 0),
        line: 3,
        vars: vars({ size: 1 }),
      },
      {
        say: "Insert \"dog\". Different hash, different slot, stored alongside.",
        rowLabel: "seen",
        row: cells(["cat", "dog"], 1),
        line: 4,
        vars: vars({ size: 2 }),
      },
      {
        say: "Insert \"cat\" again. It hashes to the same slot, the set finds it already there, and does nothing. No error, no duplicate.",
        rowLabel: "seen",
        row: cells(["cat", "dog"], 0, { v: "cat", tone: "bad" }),
        line: 5,
        vars: vars({ size: 2, "the duplicate": "dropped" }),
      },
      {
        say: "That silent dropping is the whole feature. Push a million items with duplicates through a set and you get the distinct ones out, with no comparing done by you.",
        rowLabel: "seen",
        row: cells(["cat", "dog"]),
        vars: vars({ size: 2 }),
      },
      {
        say: "Asking whether \"dog\" is in the set hashes it and looks at one slot. It does not walk the set — which is why a set beats a list for repeated membership tests.",
        rowLabel: "seen",
        row: cells(["cat", "dog"], 1),
        line: 7,
        out: "1",
        vars: vars({ "steps taken": 1 }),
      },
      {
        say: "The same test on a list of a million items walks until it finds a match, or all the way to the end when there is none. That is the difference between waiting and not waiting.",
        rowLabel: "the same test on a list",
        row: [
          { v: "cat", i: "0", tone: "compare" },
          { v: "dog", i: "1", tone: "good" },
          { v: "…", tone: "ghost" },
        ],
        vars: vars({ list: "up to n checks", set: "about 1" }),
      },
      {
        say: "One catch: the same one as a map. A set has no useful order. If you need the items sorted, use the ordered variety — a tree instead of a hash — and pay a little more per operation.",
        rowLabel: "seen",
        row: cells(["cat", "dog"]).map((c) => ({ ...c, tone: "done" as const })),
        vars: vars({ hashed: "no order, faster", ordered: "sorted, a bit slower" }),
      },
    ],
  };
}

/** The choosing table: what each container is actually good at. */
export function traceContainerCosts(): Viz {
  const cols = ["reach by index", "find by value", "add at end", "add at front", "keeps order"];
  const rows = ["list / array", "hash map", "hash set", "deque", "sorted map"];

  const tone = (s: string): Cell["tone"] =>
    s === "instant" ? "good" : s === "slow" ? "bad" : s === "—" ? "ghost" : "active";

  const table: string[][] = [
    ["instant", "slow", "instant", "slow", "insertion"],
    ["—", "instant", "instant", "instant", "none"],
    ["—", "instant", "instant", "instant", "none"],
    ["instant", "slow", "instant", "instant", "insertion"],
    ["—", "fast", "fast", "fast", "sorted"],
  ];

  const grid = (hotRow: number): Cell[][] =>
    table.map((r, ri) =>
      r.map((v) => ({ v, tone: ri === hotRow ? tone(v) : "ghost" })),
    );

  const frame = (say: string, hot: number): Frame => ({
    say,
    gridLabel: "what each one is good at",
    grid: grid(hot),
    gridRowNames: rows,
    gridColNames: cols,
  });

  return {
    title: "Picking the right container",
    blurb: "One question decides it: how will you look things up?",
    frames: [
      frame(
        "Start here: how will you FIND things? By position, by name, or by asking whether something is present? The answer picks the container.",
        -1,
      ),
      frame(
        "A list is for things in order, reached by position. Finding a value inside it means walking — which is fine occasionally and slow in a loop.",
        0,
      ),
      frame(
        "A map is for looking things up by a name or an id. It gives up position and order, and in exchange finding by key is instant.",
        1,
      ),
      frame(
        "A set is a map with no values. Use it for 'have I seen this?' and for removing duplicates. Both are near-instant.",
        2,
      ),
      frame(
        "A deque is a list that is also cheap at the FRONT. Reach for it when you are adding at one end and taking from the other — a queue.",
        3,
      ),
      frame(
        "A sorted map keeps its keys in order, so you can ask for a range or the next key up. Slightly slower than a hash map, and worth it when order matters.",
        4,
      ),
      {
        say: "The rule of thumb: if you find yourself writing a loop to search a list, and doing it repeatedly, you probably wanted a map or a set.",
        gridLabel: "what each one is good at",
        grid: table.map((r) => r.map((v) => ({ v, tone: tone(v) }))),
        gridRowNames: rows,
        gridColNames: cols,
        vars: vars({ "the question": "how will you look it up?" }),
      },
    ],
  };
}

/* ------------------------------------------------------------ sorting -- */

/** Stable versus unstable: what happens to equal items already in some order. */
export function traceSortStability(): Viz {
  const code = `// already sorted by name
[("ada",2), ("bob",1), ("cleo",2), ("dev",1)]

// now sort by NUMBER only
sort(people, by number);`;

  const pair = (n: string, v: number, tone: Cell["tone"]): Cell => ({
    v: `${n}·${v}`,
    tone,
  });

  return {
    title: "Stable sorting, and why it matters",
    blurb: "Watch what happens to two items the comparison says are equal.",
    code,
    frames: [
      {
        say: "Four people, already in alphabetical order. Each has a number.",
        rowLabel: "sorted by name",
        row: [
          pair("ada", 2, "active"),
          pair("bob", 1, "active"),
          pair("cleo", 2, "active"),
          pair("dev", 1, "active"),
        ],
        line: 2,
      },
      {
        say: "Now sort by NUMBER only. The comparison never looks at the names, so it says ada and cleo are equal, and bob and dev are equal.",
        rowLabel: "the comparison sees",
        row: [
          pair("?·2", 2, "compare"),
          pair("?·1", 1, "compare"),
          pair("?·2", 2, "compare"),
          pair("?·1", 1, "compare"),
        ],
        line: 5,
        vars: vars({ "ada vs cleo": "equal", "bob vs dev": "equal" }),
      },
      {
        say: "A STABLE sort keeps equal items in the order they were already in. bob still comes before dev, ada still before cleo.",
        rowLabel: "stable result",
        row: [
          pair("bob", 1, "good"),
          pair("dev", 1, "good"),
          pair("ada", 2, "good"),
          pair("cleo", 2, "good"),
        ],
        vars: vars({ result: "still alphabetical within each number" }),
      },
      {
        say: "An UNSTABLE sort makes no such promise. It may give you dev before bob — not wrong by the comparison you gave it, just not what you assumed.",
        rowLabel: "unstable result",
        row: [
          pair("dev", 1, "bad"),
          pair("bob", 1, "bad"),
          pair("cleo", 2, "bad"),
          pair("ada", 2, "bad"),
        ],
        vars: vars({ result: "alphabetical order lost" }),
      },
      {
        say: "This is what lets you sort by two things without writing a two-part comparison: sort by name, then stable-sort by number, and you get both.",
        rowLabel: "stable result",
        row: [
          pair("bob", 1, "good"),
          pair("dev", 1, "good"),
          pair("ada", 2, "good"),
          pair("cleo", 2, "good"),
        ],
        vars: vars({ trick: "sort by the SECOND key first" }),
      },
      {
        say: "Which sorts are stable is a language fact, not an opinion. Python, Java's Collections.sort, JavaScript's sort and Rust's sort ARE stable. C++'s std::sort and Rust's sort_unstable are NOT.",
        rowLabel: "stable?",
        row: [
          { v: "Python ✓", tone: "good" },
          { v: "Java ✓", tone: "good" },
          { v: "JS ✓", tone: "good" },
          { v: "Rust sort ✓", tone: "good" },
          { v: "C++ sort ✗", tone: "bad" },
          { v: "C qsort ✗", tone: "bad" },
        ],
      },
      {
        say: "So when you need stability in C++, ask for it: stable_sort. It is a little slower and it keeps the promise.",
        rowLabel: "stable result",
        row: [
          pair("bob", 1, "done"),
          pair("dev", 1, "done"),
          pair("ada", 2, "done"),
          pair("cleo", 2, "done"),
        ],
        vars: vars({ "C++": "std::stable_sort", "Rust": "sort, not sort_unstable" }),
      },
    ],
  };
}

/** What a comparator actually returns, and the string-sort trap. */
export function traceComparator(): Viz {
  const code = `sort(nums);          // what order?

// with a comparison:
//  negative  -> a comes first
//  zero      -> equal
//  positive  -> b comes first`;

  const nums = (order: number[], tone: Cell["tone"]): Cell[] =>
    order.map((v, i) => ({ v: String(v), i: String(i), tone }));

  return {
    title: "How a sort decides the order",
    blurb: "One comparison, asked over and over — and the default is not always what you want.",
    code,
    frames: [
      {
        say: "A sort does not know what 'smaller' means. It asks you, one pair at a time, and rearranges according to the answers.",
        rowLabel: "nums",
        row: nums([10, 9, 100, 1], "active"),
        line: 1,
      },
      {
        say: "The answer is a number, not a yes or no. Negative means a goes first, positive means b goes first, and zero means the sort may put them either way round.",
        rowLabel: "compare(10, 9)",
        row: [
          { v: "10", tone: "compare" },
          { v: "9", tone: "compare" },
          { v: "-> +1", tone: "good" },
        ],
        line: 4,
        vars: vars({ meaning: "9 comes first" }),
      },
      {
        say: "For numbers, a - b is the whole comparison: it is negative when a is smaller, positive when a is bigger, and zero when they are equal.",
        rowLabel: "nums, sorted as numbers",
        row: nums([1, 9, 10, 100], "good"),
        vars: vars({ comparison: "a - b" }),
      },
      {
        say: "Now the trap. JavaScript's sort with NO comparison converts everything to text first and sorts alphabetically.",
        rowLabel: "compared as text",
        row: [
          { v: "\"10\"", tone: "compare" },
          { v: "\"9\"", tone: "compare" },
          { v: "\"100\"", tone: "compare" },
          { v: "\"1\"", tone: "compare" },
        ],
        vars: vars({ "\"10\" < \"9\"": "true, alphabetically" }),
      },
      {
        say: "So [10, 9, 100, 1].sort() gives [1, 10, 100, 9]. It is not a bug, and it has surprised every JavaScript programmer at least once.",
        rowLabel: "JavaScript's default",
        row: nums([1, 10, 100, 9], "bad"),
        vars: vars({ fix: "sort((a, b) => a - b)" }),
      },
      {
        say: "The other languages sort numbers as numbers by default. Only JavaScript does this — and only when you leave the comparison out.",
        rowLabel: "everywhere else",
        row: nums([1, 9, 10, 100], "good"),
      },
      {
        say: "One rule for comparisons everywhere: they must be consistent. If compare(a,b) says a first, compare(b,a) must say b first — an inconsistent comparison can crash the sort or loop forever.",
        rowLabel: "nums, sorted",
        row: nums([1, 9, 10, 100], "done"),
        vars: vars({ rule: "consistent, or the sort may break" }),
      },
    ],
  };
}

/** A loop, rewritten as a pipeline of transformations. */
export function tracePipeline(): Viz {
  const code = `// take the numbers, keep the even ones,
// double them, add them up.

total = sum(double(x) for x in nums if even(x))`;

  const cells = (vals: (number | string)[], tone: Cell["tone"]): Cell[] =>
    vals.map((v, i) => ({ v: String(v), i: String(i), tone }));

  return {
    title: "A loop as a pipeline",
    blurb: "Watch the data flow through three named steps instead of one loop body.",
    code,
    frames: [
      {
        say: "Five numbers. The job: keep the even ones, double them, add them up.",
        rowLabel: "nums",
        row: cells([1, 2, 3, 4, 5], "active"),
        line: 4,
      },
      {
        say: "Step one — KEEP. A test is applied to each item, and only the ones that pass go on. Nothing is changed, only dropped.",
        rowLabel: "keep the even ones",
        row: [
          { v: "1", i: "0", tone: "bad" },
          { v: "2", i: "1", tone: "good" },
          { v: "3", i: "2", tone: "bad" },
          { v: "4", i: "3", tone: "good" },
          { v: "5", i: "4", tone: "bad" },
        ],
        vars: vars({ in: 5, out: 2 }),
      },
      {
        say: "Two survivors. This is filter in JavaScript and Rust, an if in a Python comprehension, and .filter in a Java stream.",
        rowLabel: "after keeping",
        row: cells([2, 4], "active"),
        vars: vars({ out: 2 }),
      },
      {
        say: "Step two — CHANGE. Each surviving item is replaced by something worked out from it. The count stays the same; the values do not.",
        rowLabel: "double each one",
        row: [
          { v: "2 -> 4", tone: "compare" },
          { v: "4 -> 8", tone: "compare" },
        ],
        vars: vars({ in: 2, out: 2 }),
      },
      {
        say: "That is map — the same word in JavaScript, Rust and Java, and the expression at the front of a Python comprehension.",
        rowLabel: "after changing",
        row: cells([4, 8], "active"),
      },
      {
        say: "Step three — COMBINE. Everything is folded down into one value, carrying a running total along.",
        rowLabel: "adding up",
        row: [
          { v: "0 + 4 = 4", tone: "compare" },
          { v: "4 + 8 = 12", tone: "good" },
        ],
        vars: vars({ total: 12 }),
      },
      {
        say: "That is reduce, or fold, or sum when the combining is addition. Three named steps where a loop would have one body doing all three at once.",
        rowLabel: "result",
        row: [{ v: "12", tone: "done" }],
        out: "12",
        vars: vars({ keep: "filter", change: "map", combine: "reduce" }),
      },
      {
        say: "The loop is not wrong. The pipeline names each step, which makes it easier to read and to change — and in Rust and Java it can be handed to several cores without you rewriting it.",
        rowLabel: "result",
        row: [{ v: "12", tone: "done" }],
        vars: vars({ "C": "no pipeline. Write the loop" }),
      },
    ],
  };
}

/* ------------------------------------------------------------- objects -- */

/** A class is a blueprint. Each object gets its own fields; the code is shared. */
export function traceObjectShape(): Viz {
  const code = `class Dog {
  string name;
  int age;
  void speak() { print(name + " woofs"); }
};

Dog a{"Rex", 3};
Dog b{"Fig", 5};`;

  return {
    title: "One blueprint, many objects",
    blurb: "Watch each object get its own data — and share the same code.",
    code,
    frames: [
      {
        say: "A class is not a thing. It is a DESCRIPTION of a thing: what fields it has, and what it can do.",
        rowLabel: "the blueprint",
        row: [
          { v: "name", i: "field", tone: "ghost" },
          { v: "age", i: "field", tone: "ghost" },
          { v: "speak()", i: "code", tone: "ghost" },
        ],
        line: 1,
        vars: vars({ objects: 0 }),
      },
      {
        say: "Making an object follows the blueprint: a fresh set of boxes, filled in with these values.",
        rowLabel: "object a",
        row: [
          { v: "Rex", i: "name", tone: "good" },
          { v: "3", i: "age", tone: "good" },
        ],
        line: 7,
        vars: vars({ objects: 1 }),
      },
      {
        say: "A second object gets its OWN boxes. Changing a's name has nothing to do with b — they share the blueprint, not the data.",
        rowLabel: "objects a and b",
        row: [
          { v: "Rex", i: "a.name", tone: "active" },
          { v: "3", i: "a.age", tone: "active" },
          { v: "Fig", i: "b.name", tone: "good" },
          { v: "5", i: "b.age", tone: "good" },
        ],
        line: 8,
        vars: vars({ objects: 2 }),
      },
      {
        say: "The METHOD is different. There is only one copy of speak's code, ever, no matter how many objects exist.",
        rowLabel: "in memory",
        row: [
          { v: "Rex/3", i: "a", tone: "active" },
          { v: "Fig/5", i: "b", tone: "active" },
          { v: "speak()", i: "shared code", tone: "compare" },
        ],
        vars: vars({ "copies of the data": 2, "copies of the code": 1 }),
      },
      {
        say: "So how does one shared function know whose name to print? It is handed the object. a.speak() secretly passes a as a hidden first argument.",
        rowLabel: "a.speak()",
        row: [
          { v: "Rex/3", i: "a", tone: "good" },
          { v: "->", tone: "ghost" },
          { v: "speak(this=a)", i: "shared code", tone: "compare" },
        ],
        out: "Rex woofs",
        vars: vars({ this: "a" }),
      },
      {
        say: "That hidden argument is `this` in C++, Java and JavaScript. Python does not hide it — you write `self` yourself, which is why the two spellings look so different for the same idea.",
        rowLabel: "b.speak()",
        row: [
          { v: "Fig/5", i: "b", tone: "good" },
          { v: "->", tone: "ghost" },
          { v: "speak(this=b)", i: "shared code", tone: "compare" },
        ],
        out: "Rex woofs\nFig woofs",
        vars: vars({ this: "b" }),
      },
      {
        say: "That is the whole idea: data per object, code shared, and every method knowing which object it was called on.",
        rowLabel: "in memory",
        row: [
          { v: "Rex/3", i: "a", tone: "done" },
          { v: "Fig/5", i: "b", tone: "done" },
          { v: "speak()", i: "shared code", tone: "done" },
        ],
      },
    ],
  };
}

/** How a call finds the right code when several types can answer it. */
export function traceMethodDispatch(): Viz {
  const code = `Shape* s = pickOne();   // Circle or Square?

s->area();              // which area() runs?`;

  const node = (id: string, label: string, x: number, y: number, tone: Cell["tone"], sub?: string) =>
    ({ id, label, x, y, tone, sub });

  return {
    title: "Which code actually runs",
    blurb: "One call, several possible answers — decided when the program runs, not when it is compiled.",
    code,
    frames: [
      {
        say: "Three types that all answer the same question: give me your area. Each answers it differently.",
        nodes: [
          node("s", "Shape", 50, 15, "ghost", "the promise"),
          node("c", "Circle", 20, 60, "idle", "pi r squared"),
          node("q", "Square", 50, 60, "idle", "side squared"),
          node("t", "Triangle", 80, 60, "idle", "half base height"),
        ],
        edges: [
          { from: "s", to: "c", tone: "ghost" },
          { from: "s", to: "q", tone: "ghost" },
          { from: "s", to: "t", tone: "ghost" },
        ],
        line: 1,
      },
      {
        say: "The code holds a Shape. At the moment it is compiled, nobody knows which of the three it will actually be.",
        nodes: [
          node("s", "Shape", 50, 15, "active", "s points here"),
          node("c", "Circle", 20, 60, "ghost"),
          node("q", "Square", 50, 60, "ghost"),
          node("t", "Triangle", 80, 60, "ghost"),
        ],
        edges: [
          { from: "s", to: "c", tone: "ghost" },
          { from: "s", to: "q", tone: "ghost" },
          { from: "s", to: "t", tone: "ghost" },
        ],
        line: 1,
        vars: vars({ "known at compile time": "only that it is a Shape" }),
      },
      {
        say: "At run time it turns out to be a Circle. The object itself carries a pointer to its own table of methods.",
        nodes: [
          node("s", "Shape", 50, 15, "active", "s"),
          node("c", "Circle", 20, 60, "good", "the real object"),
          node("q", "Square", 50, 60, "ghost"),
          node("t", "Triangle", 80, 60, "ghost"),
        ],
        edges: [
          { from: "s", to: "c", tone: "good", arrow: true, label: "actually" },
        ],
        line: 3,
        vars: vars({ "at run time": "Circle" }),
      },
      {
        say: "So the call follows that pointer and runs Circle's area. This is called dynamic dispatch — the decision is made while the program runs.",
        nodes: [
          node("s", "Shape", 50, 15, "ghost", "s"),
          node("c", "Circle", 20, 60, "good", "area() runs here"),
          node("q", "Square", 50, 60, "ghost"),
          node("t", "Triangle", 80, 60, "ghost"),
        ],
        edges: [{ from: "s", to: "c", tone: "good", arrow: true }],
        line: 3,
        out: "78.5",
      },
      {
        say: "Add a Hexagon tomorrow and this call site does not change. That is the point of the whole arrangement: new types plug in without editing the code that uses them.",
        nodes: [
          node("s", "Shape", 50, 15, "active", "unchanged"),
          node("c", "Circle", 15, 60, "idle"),
          node("q", "Square", 40, 60, "idle"),
          node("t", "Triangle", 65, 60, "idle"),
          node("h", "Hexagon", 90, 60, "good", "new"),
        ],
        edges: [
          { from: "s", to: "c", tone: "ghost" },
          { from: "s", to: "q", tone: "ghost" },
          { from: "s", to: "t", tone: "ghost" },
          { from: "s", to: "h", tone: "good" },
        ],
      },
      {
        say: "It is not free. Each call follows an extra pointer, and the compiler cannot inline it. C++ makes you ask for it with `virtual`; Java does it by default; Rust makes you write `dyn`.",
        nodes: [
          node("s", "Shape", 50, 15, "compare", "one extra hop"),
          node("c", "Circle", 20, 60, "idle"),
          node("q", "Square", 50, 60, "idle"),
          node("t", "Triangle", 80, 60, "idle"),
        ],
        edges: [{ from: "s", to: "c", tone: "compare", arrow: true, label: "look up" }],
        vars: vars({ cost: "one pointer hop, no inlining" }),
      },
      {
        say: "And Python and JavaScript skip the machinery entirely: they just look for a method with that name on the object when the call happens. Any object with an area() will do.",
        nodes: [
          node("s", "any object", 50, 15, "done", "duck typing"),
          node("c", "Circle", 20, 60, "done"),
          node("q", "Square", 50, 60, "done"),
          node("t", "Anything", 80, 60, "done", "with .area()"),
        ],
        edges: [
          { from: "s", to: "c", tone: "done" },
          { from: "s", to: "q", tone: "done" },
          { from: "s", to: "t", tone: "done" },
        ],
        vars: vars({ "Python / JS": "no declaration needed" }),
      },
    ],
  };
}

/** Inheritance versus composition, and why the second usually wins. */
export function traceInheritVsCompose(): Viz {
  const node = (id: string, label: string, x: number, y: number, tone: Cell["tone"], sub?: string) =>
    ({ id, label, x, y, tone, sub });

  return {
    title: "Inheriting versus containing",
    blurb: "Watch what happens to a deep chain when one thing near the top changes.",
    frames: [
      {
        say: "Inheritance says a Dog IS AN Animal. Everything Animal can do, Dog can do, without writing it again.",
        nodes: [
          node("a", "Animal", 50, 15, "active", "eat, sleep"),
          node("d", "Dog", 50, 55, "good", "+ bark"),
        ],
        edges: [{ from: "d", to: "a", tone: "good", arrow: true, label: "is a" }],
      },
      {
        say: "It works beautifully for two levels. The trouble starts when the tree grows.",
        nodes: [
          node("a", "Animal", 50, 10, "active"),
          node("m", "Mammal", 50, 35, "active"),
          node("d", "Dog", 30, 60, "active"),
          node("c", "Cat", 70, 60, "active"),
          node("p", "Puppy", 30, 85, "good"),
        ],
        edges: [
          { from: "m", to: "a", tone: "idle", arrow: true },
          { from: "d", to: "m", tone: "idle", arrow: true },
          { from: "c", to: "m", tone: "idle", arrow: true },
          { from: "p", to: "d", tone: "idle", arrow: true },
        ],
      },
      {
        say: "Change one field on Animal and every one of these is affected. To read Puppy you now have to read four classes.",
        nodes: [
          node("a", "Animal", 50, 10, "bad", "changed"),
          node("m", "Mammal", 50, 35, "compare"),
          node("d", "Dog", 30, 60, "compare"),
          node("c", "Cat", 70, 60, "compare"),
          node("p", "Puppy", 30, 85, "compare", "affected"),
        ],
        edges: [
          { from: "m", to: "a", tone: "bad", arrow: true },
          { from: "d", to: "m", tone: "bad", arrow: true },
          { from: "c", to: "m", tone: "bad", arrow: true },
          { from: "p", to: "d", tone: "bad", arrow: true },
        ],
        vars: vars({ "classes to read": 4 }),
      },
      {
        say: "And the real problem: a RobotDog barks but does not eat. The tree has no place for it — that is the classic sign that inheritance was the wrong tool.",
        nodes: [
          node("a", "Animal", 50, 10, "ghost", "eat, sleep"),
          node("d", "Dog", 30, 45, "ghost", "bark"),
          node("r", "RobotDog", 75, 70, "bad", "barks, never eats"),
        ],
        edges: [{ from: "r", to: "d", tone: "bad", arrow: true, label: "?" }],
      },
      {
        say: "Composition says a Dog HAS A voice and HAS A stomach. Each piece is small, and you assemble what you need.",
        nodes: [
          node("d", "Dog", 50, 20, "good"),
          node("v", "Voice", 25, 65, "active", "bark"),
          node("s", "Stomach", 75, 65, "active", "eat"),
        ],
        edges: [
          { from: "d", to: "v", tone: "good", arrow: true, label: "has a" },
          { from: "d", to: "s", tone: "good", arrow: true, label: "has a" },
        ],
      },
      {
        say: "Now RobotDog is easy: give it a Voice and a Battery. No tree to fight, nothing to inherit that does not apply.",
        nodes: [
          node("r", "RobotDog", 50, 20, "good"),
          node("v", "Voice", 25, 65, "active", "bark"),
          node("b", "Battery", 75, 65, "good", "charge"),
        ],
        edges: [
          { from: "r", to: "v", tone: "good", arrow: true, label: "has a" },
          { from: "r", to: "b", tone: "good", arrow: true, label: "has a" },
        ],
      },
      {
        say: "This is why the advice 'prefer composition over inheritance' is so common — and why Rust and Go left inheritance out of the language entirely.",
        nodes: [
          node("d", "Dog", 25, 25, "done"),
          node("r", "RobotDog", 75, 25, "done"),
          node("v", "Voice", 50, 70, "good", "shared by both"),
        ],
        edges: [
          { from: "d", to: "v", tone: "done", arrow: true },
          { from: "r", to: "v", tone: "done", arrow: true },
        ],
        vars: vars({ rule: "is-a is rare. has-a is everywhere" }),
      },
      {
        say: "Use inheritance when the is-a relationship is genuinely permanent and shallow. Use composition — or an interface, or a trait — for everything else.",
        nodes: [
          node("i", "an interface", 50, 20, "done", "what it can do"),
          node("d", "Dog", 25, 65, "done"),
          node("r", "RobotDog", 75, 65, "done"),
        ],
        edges: [
          { from: "d", to: "i", tone: "done", arrow: true, label: "can bark" },
          { from: "r", to: "i", tone: "done", arrow: true, label: "can bark" },
        ],
      },
    ],
  };
}

/* -------------------------------------------------------------- memory -- */

/** Where a value actually lives, and what happens when the function returns. */
export function traceStackHeap(): Viz {
  const code = `void work() {
  int n = 5;                 // small, known
  int arr[3] = {1, 2, 3};    // still known
  vector<int> big(1000000);  // size known now
}                            // <- what survives?`;

  const stack = (items: [string, string][], tone: Cell["tone"]): Cell[] =>
    items.map(([k, v]) => ({ v, i: k, tone }));

  return {
    title: "Two places a value can live",
    blurb: "Watch the stack empty itself, and watch what the heap does not.",
    code,
    frames: [
      {
        say: "Two areas of memory. The STACK is fast and automatic. The HEAP is flexible and needs managing.",
        rowLabel: "the stack",
        row: [{ v: "empty", tone: "ghost" }],
        row2Label: "the heap",
        row2: [{ v: "empty", tone: "ghost" }],
      },
      {
        say: "work() is called. A block is reserved on the stack for everything it needs — and the compiler already knows how big that block is.",
        rowLabel: "the stack",
        row: stack([["work's frame", "reserved"]], "active"),
        row2Label: "the heap",
        row2: [{ v: "empty", tone: "ghost" }],
        line: 1,
      },
      {
        say: "n goes on the stack. It is one int, four bytes, and its size was known when the program was compiled.",
        rowLabel: "the stack",
        row: stack([["n", "5"]], "good"),
        row2Label: "the heap",
        row2: [{ v: "empty", tone: "ghost" }],
        line: 2,
        vars: vars({ "stack used": "4 bytes" }),
      },
      {
        say: "The array too. Three ints, twelve bytes, still known at compile time — so it sits right next to n.",
        rowLabel: "the stack",
        row: stack([["n", "5"], ["arr[0]", "1"], ["arr[1]", "2"], ["arr[2]", "3"]], "good"),
        row2Label: "the heap",
        row2: [{ v: "empty", tone: "ghost" }],
        line: 3,
        vars: vars({ "stack used": "16 bytes" }),
      },
      {
        say: "A million ints is different. It is far too big for the stack, and the size was decided while the program was running. So the data goes on the HEAP.",
        rowLabel: "the stack",
        row: stack([["n", "5"], ["arr[0..2]", "1,2,3"], ["big", "-> heap"]], "active"),
        row2Label: "the heap",
        row2: [{ v: "1,000,000 ints", tone: "good" }],
        line: 4,
        vars: vars({ "on the stack": "a pointer", "on the heap": "4 MB" }),
      },
      {
        say: "Notice what is on the stack for big: just a pointer and a couple of numbers. The data itself is somewhere else entirely.",
        rowLabel: "the stack",
        row: stack([["big.ptr", "0x7f..."], ["big.size", "1000000"]], "compare"),
        row2Label: "the heap",
        row2: [{ v: "1,000,000 ints", tone: "active" }],
        line: 4,
      },
      {
        say: "Now the function ends. The stack frame is released in ONE step — no walking, no bookkeeping. That is why the stack is fast.",
        rowLabel: "the stack",
        row: [{ v: "empty", tone: "bad" }],
        row2Label: "the heap",
        row2: [{ v: "1,000,000 ints", tone: "compare" }],
        line: 5,
        vars: vars({ "stack": "gone instantly" }),
      },
      {
        say: "The heap block does NOT go away on its own. Something has to release it — and which something is the biggest difference between these six languages.",
        rowLabel: "the stack",
        row: [{ v: "empty", tone: "ghost" }],
        row2Label: "the heap",
        row2: [{ v: "who frees this?", tone: "bad" }],
        vars: vars({ "C": "you call free", "C++/Rust": "the scope does it", "Python/Java/JS": "a collector" }),
      },
      {
        say: "And the rule that follows: never return a pointer to a stack value. It is released the moment the function ends, and the pointer then points at memory that will be reused.",
        rowLabel: "the stack",
        row: [{ v: "released", tone: "bad" }],
        row2Label: "returned pointer",
        row2: [{ v: "-> nothing", tone: "bad" }],
        vars: vars({ rule: "stack values die with the function" }),
      },
    ],
  };
}

/** One object, two names — and what null actually is. */
export function traceReference(): Viz {
  const code = `list a = [1, 2];
list b = a;        // ?

b.append(3);
print(a);`;

  const node = (id: string, label: string, x: number, y: number, tone: Cell["tone"], sub?: string) =>
    ({ id, label, x, y, tone, sub });

  return {
    title: "Names, arrows, and the thing itself",
    blurb: "Watch which of the two lines is copied — the arrow, or what it points at.",
    code,
    frames: [
      {
        say: "A name is not the thing. It is an arrow pointing at the thing, which lives somewhere in memory.",
        nodes: [
          node("a", "a", 20, 25, "active", "the name"),
          node("o", "[1, 2]", 65, 25, "good", "the object"),
        ],
        edges: [{ from: "a", to: "o", tone: "active", arrow: true }],
        line: 1,
      },
      {
        say: "`b = a` copies the ARROW, not the object. Now two names point at one list. Nothing was duplicated.",
        nodes: [
          node("a", "a", 20, 15, "active"),
          node("b", "b", 20, 55, "active"),
          node("o", "[1, 2]", 65, 35, "good", "still ONE list"),
        ],
        edges: [
          { from: "a", to: "o", tone: "active", arrow: true },
          { from: "b", to: "o", tone: "active", arrow: true },
        ],
        line: 2,
        vars: vars({ names: 2, objects: 1 }),
      },
      {
        say: "So appending through b changes the one list — and a is looking at the very same list.",
        nodes: [
          node("a", "a", 20, 15, "compare"),
          node("b", "b", 20, 55, "good"),
          node("o", "[1, 2, 3]", 65, 35, "good", "changed"),
        ],
        edges: [
          { from: "a", to: "o", tone: "compare", arrow: true },
          { from: "b", to: "o", tone: "good", arrow: true },
        ],
        line: 4,
        out: "[1, 2, 3]",
      },
      {
        say: "But REASSIGNING b just moves b's arrow. a's arrow never moves, so a still sees the original.",
        nodes: [
          node("a", "a", 20, 15, "active"),
          node("b", "b", 20, 55, "good"),
          node("o", "[1, 2, 3]", 65, 15, "active", "a still here"),
          node("n", "[9]", 65, 60, "good", "b's new one"),
        ],
        edges: [
          { from: "a", to: "o", tone: "active", arrow: true },
          { from: "b", to: "n", tone: "good", arrow: true },
        ],
        vars: vars({ "b = [9]": "moves b's arrow only" }),
      },
      {
        say: "A COPY is the other operation: build a new object and copy the contents in. Two arrows, two objects, fully independent.",
        nodes: [
          node("a", "a", 20, 15, "active"),
          node("b", "b", 20, 55, "good"),
          node("o", "[1, 2, 3]", 65, 15, "active"),
          node("c", "[1, 2, 3]", 65, 60, "good", "a real copy"),
        ],
        edges: [
          { from: "a", to: "o", tone: "active", arrow: true },
          { from: "b", to: "c", tone: "good", arrow: true },
        ],
        vars: vars({ objects: 2 }),
      },
      {
        say: "Careful: that copy is usually SHALLOW. If the list held other objects, both copies point at the same inner ones.",
        nodes: [
          node("a", "outer a", 15, 20, "active"),
          node("b", "outer b", 15, 65, "active"),
          node("i", "inner", 70, 42, "bad", "SHARED"),
        ],
        edges: [
          { from: "a", to: "i", tone: "bad", arrow: true },
          { from: "b", to: "i", tone: "bad", arrow: true },
        ],
        vars: vars({ shallow: "copies the arrows", deep: "copies all the way down" }),
      },
      {
        say: "And NULL is an arrow pointing at nothing. Following it is an error in every language — the only difference is when you find out.",
        nodes: [
          node("a", "a", 20, 40, "bad"),
          node("n", "null", 65, 40, "bad", "nothing here"),
        ],
        edges: [{ from: "a", to: "n", tone: "bad", arrow: true }],
        vars: vars({ "C/C++": "undefined, may crash", "Java/Python/JS": "an exception", "Rust": "no null at all" }),
      },
    ],
  };
}

/** Four answers to "who releases the memory". */
export function traceCleanup(): Viz {
  const rows = ["C — you do", "C++/Rust — the scope", "Python/JS — counting", "Java — a collector"];
  const cols = ["when", "cost", "what goes wrong"];

  const table = [
    ["you call free", "none", "leaks, double free, use after free"],
    ["end of scope", "none", "nothing — the compiler checks"],
    ["count hits zero", "small, constant", "cycles need a sweep"],
    ["a pause, later", "a pause", "unpredictable timing"],
  ];

  const grid = (hot: number): Cell[][] =>
    table.map((r, ri) =>
      r.map((v, ci) => ({
        v,
        tone:
          ri !== hot ? "ghost" : ci === 2 ? (ri === 1 ? "good" : "bad") : "active",
      })),
    );

  const frame = (say: string, hot: number): Frame => ({
    say,
    gridLabel: "who frees the heap",
    grid: grid(hot),
    gridRowNames: rows,
    gridColNames: cols,
  });

  return {
    title: "Who cleans up",
    blurb: "Four answers to one question — and each one trades something away.",
    frames: [
      frame(
        "The stack cleans itself. The heap does not, and every language here answers the question differently.",
        -1,
      ),
      frame(
        "C: you call free, at exactly the right moment. Fastest possible, and you own every mistake — leaking, freeing twice, or using it after it is gone.",
        0,
      ),
      frame(
        "C++ and Rust: the value is tied to a scope, and leaving the scope releases it. No run-time cost at all, because the compiler inserts the free for you.",
        1,
      ),
      frame(
        "Python and JavaScript: each object counts how many names point at it. When the count hits zero it goes. Predictable, and a small cost on every assignment.",
        2,
      ),
      frame(
        "Java: a collector runs occasionally, finds everything still reachable, and releases the rest. You never think about it, and you cannot control when it happens.",
        3,
      ),
      {
        say: "Reference counting has one gap: two objects pointing at each other keep each other's count above zero forever. Python runs a separate cycle collector for exactly this.",
        nodes: [
          { id: "a", label: "A", x: 30, y: 40, tone: "bad", sub: "count 1" },
          { id: "b", label: "B", x: 70, y: 40, tone: "bad", sub: "count 1" },
        ],
        edges: [
          { from: "a", to: "b", tone: "bad", arrow: true },
          { from: "b", to: "a", tone: "bad", arrow: true },
        ],
        vars: vars({ "reachable from your code": "no", "counts": "still 1" }),
      },
      {
        say: "The trade is the same everywhere: control, or convenience. C gives you all the control and all the responsibility. Java gives you neither.",
        gridLabel: "who frees the heap",
        grid: table.map((r) => r.map((v) => ({ v, tone: "done" as const }))),
        gridRowNames: rows,
        gridColNames: cols,
        vars: vars({ "Rust's claim": "control without the responsibility" }),
      },
    ],
  };
}

/* ------------------------------------------------------ error handling -- */

/** A throw travelling up the call stack until something catches it. */
export function traceUnwind(): Viz {
  const code = `void c() { throw runtime_error("bad"); }
void b() { c(); }
void a() { b(); }

int main() {
  try { a(); }
  catch (exception& e) { print(e.what()); }
}`;

  const stack = (frames: [string, Cell["tone"]][]): Cell[] =>
    frames.map(([name, tone]) => ({ v: name, tone }));

  return {
    title: "Where a thrown error goes",
    blurb: "Watch it climb past every function that did not handle it.",
    code,
    frames: [
      {
        say: "main calls a, a calls b, b calls c. Four frames on the stack, each waiting for the one above it.",
        rowLabel: "the call stack",
        row: stack([["main", "active"], ["a", "active"], ["b", "active"], ["c", "good"]]),
        line: 6,
        vars: vars({ depth: 4 }),
      },
      {
        say: "c throws. It does not return a value and it does not carry on — the error object is created and the search begins.",
        rowLabel: "the call stack",
        row: stack([["main", "active"], ["a", "active"], ["b", "active"], ["c", "bad"]]),
        line: 1,
        vars: vars({ thrown: "runtime_error(\"bad\")" }),
      },
      {
        say: "Does c handle it? No try block here. So c's frame is destroyed — its destructors run — and the search moves up.",
        rowLabel: "the call stack",
        row: stack([["main", "active"], ["a", "active"], ["b", "compare"], ["c", "ghost"]]),
        line: 2,
        vars: vars({ "c": "unwound" }),
      },
      {
        say: "Does b handle it? No. b's frame is destroyed too. This is UNWINDING — every local object between the throw and the catch is properly destroyed on the way.",
        rowLabel: "the call stack",
        row: stack([["main", "active"], ["a", "compare"], ["b", "ghost"], ["c", "ghost"]]),
        line: 3,
        vars: vars({ "b": "unwound" }),
      },
      {
        say: "Does a handle it? No. a goes too. Notice that b and a never wrote a single line about this error — they did not have to.",
        rowLabel: "the call stack",
        row: stack([["main", "compare"], ["a", "ghost"], ["b", "ghost"], ["c", "ghost"]]),
        line: 6,
        vars: vars({ "functions that ignored it": 2 }),
      },
      {
        say: "main has a try around the call, with a catch that matches. The search stops here and the catch block runs.",
        rowLabel: "the call stack",
        row: stack([["main", "good"], ["a", "ghost"], ["b", "ghost"], ["c", "ghost"]]),
        line: 7,
        out: "bad",
      },
      {
        say: "That is the appeal: the code that CAUSES an error and the code that HANDLES it can be far apart, with nothing in between having to mention it.",
        rowLabel: "the call stack",
        row: stack([["main", "done"]]),
        out: "bad",
      },
      {
        say: "And that is also the cost. Reading b tells you nothing about what might come through it. Nothing in its signature warns you, and no compiler will.",
        rowLabel: "the call stack",
        row: stack([["main", "done"]]),
        vars: vars({ gain: "no boilerplate in between", cost: "invisible control flow" }),
      },
      {
        say: "If nothing catches it, the search reaches the top of the stack and the program stops. In C++ that is a call to terminate; in Java a stack trace; in Python a traceback.",
        rowLabel: "nothing caught it",
        row: [{ v: "program stops", tone: "bad" }],
        vars: vars({ uncaught: "the program ends" }),
      },
    ],
  };
}

/** Three ways to report a failure, side by side. */
export function traceErrorModels(): Viz {
  const frames: Frame[] = [];

  const show = (
    say: string,
    label: string,
    row: Cell[],
    v?: Record<string, string | number>,
  ) => frames.push({ say, rowLabel: label, row, vars: v ? vars(v) : undefined });

  show(
    "One job: read a number from a file. Three things can go wrong — no file, unreadable, not a number. Three languages, three ways to say so.",
    "what can fail",
    [
      { v: "no file", tone: "bad" },
      { v: "unreadable", tone: "bad" },
      { v: "not a number", tone: "bad" },
    ],
  );

  show(
    "RETURN CODES, as in C. The function hands back a status, and the real answer goes into a pointer you passed in.",
    "int read(const char* p, int* out)",
    [
      { v: "0 = fine", tone: "good" },
      { v: "-1 = no file", tone: "bad" },
      { v: "-2 = bad number", tone: "bad" },
    ],
    { checked: "only if the caller bothers" },
  );

  show(
    "It is simple, fast and completely honest about the cost. And it is easy to ignore: the caller can drop the return value and nothing warns them.",
    "the failure mode",
    [
      { v: "read(p, &n);", tone: "bad", i: "no check" },
      { v: "use n", tone: "bad", i: "junk" },
    ],
    { problem: "silently ignored" },
  );

  show(
    "EXCEPTIONS, as in Java, Python, C++ and JavaScript. The function throws, and the error travels up on its own until something catches it.",
    "int read(path)  // may throw",
    [
      { v: "returns int", tone: "good" },
      { v: "or throws", tone: "compare" },
    ],
    { checked: "cannot be ignored silently" },
  );

  show(
    "Impossible to ignore by accident — an uncaught exception stops the program. And invisible in the signature: nothing tells you what might come out.",
    "the failure mode",
    [
      { v: "b() calls c()", tone: "ghost" },
      { v: "b has no idea", tone: "bad" },
    ],
    { problem: "invisible control flow" },
  );

  show(
    "RESULTS, as in Rust. The failure is part of the RETURN TYPE, so the caller literally cannot get at the value without acknowledging it.",
    "fn read(p) -> Result<i32, Error>",
    [
      { v: "Ok(42)", tone: "good" },
      { v: "or Err(e)", tone: "bad" },
    ],
    { checked: "by the compiler" },
  );

  show(
    "Visible AND enforced. The price is that every error must be handled or passed along explicitly — which is what the ? operator is for.",
    "the price",
    [
      { v: "let n = read(p)?;", tone: "good", i: "pass it up" },
      { v: "match read(p) { }", tone: "good", i: "handle it" },
    ],
    { problem: "more to write" },
  );

  frames.push({
    say: "The trade is the same one every time: how much does the type system know, and how much noise does that cost you? Return codes know nothing. Results know everything.",
    gridLabel: "the three models",
    grid: [
      [
        { v: "in the signature", tone: "bad" },
        { v: "hidden", tone: "bad" },
        { v: "in the type", tone: "good" },
      ],
      [
        { v: "easy to ignore", tone: "bad" },
        { v: "cannot ignore", tone: "good" },
        { v: "cannot ignore", tone: "good" },
      ],
      [
        { v: "no noise", tone: "good" },
        { v: "no noise", tone: "good" },
        { v: "some noise", tone: "compare" },
      ],
    ],
    gridRowNames: ["visible?", "ignorable?", "cost to write"],
    gridColNames: ["return codes", "exceptions", "Result"],
  });

  return {
    title: "Three ways to say 'that failed'",
    blurb: "Watch what each model tells the caller — and what it hides.",
    frames,
  };
}

/** The cleanup path: what runs, and in what order. */
export function traceFinally(): Viz {
  const code = `open the file
try {
  read it
  if (bad) throw
  return early
} finally {
  close the file
}`;

  const step = (say: string, row: Cell[], line: number, out?: string): Frame => ({
    say,
    rowLabel: "what has happened",
    row,
    line,
    out,
  });

  return {
    title: "The path that always runs",
    blurb: "Three different ways out of the block — and one line that runs on all of them.",
    code,
    frames: [
      step(
        "The file is opened. From this moment there is something that must be closed, whatever happens next.",
        [{ v: "opened", tone: "good" }],
        1,
      ),
      step(
        "Path one: everything works. The block finishes, and then the cleanup runs.",
        [
          { v: "opened", tone: "ghost" },
          { v: "read", tone: "good" },
          { v: "closed", tone: "good" },
        ],
        7,
      ),
      step(
        "Path two: an early return. The value is worked out, and the cleanup STILL runs before the function actually returns.",
        [
          { v: "opened", tone: "ghost" },
          { v: "returning", tone: "compare" },
          { v: "closed", tone: "good" },
        ],
        5,
      ),
      step(
        "Path three: something throws. The error is on its way up the stack — and the cleanup runs as it passes through.",
        [
          { v: "opened", tone: "ghost" },
          { v: "throwing", tone: "bad" },
          { v: "closed", tone: "good" },
        ],
        4,
      ),
      step(
        "Three ways out, one guarantee. That is the whole value of the cleanup block: it removes the question 'did I close it on every path?'.",
        [
          { v: "closed", tone: "done" },
          { v: "closed", tone: "done" },
          { v: "closed", tone: "done" },
        ],
        7,
      ),
      {
        say: "One warning: returning from inside the cleanup block replaces whatever the function was going to return, INCLUDING an exception on its way up. That silently swallows errors, and every linter warns about it.",
        rowLabel: "never do this",
        row: [
          { v: "throwing", tone: "bad" },
          { v: "finally { return 0; }", tone: "bad" },
          { v: "error gone", tone: "bad" },
        ],
      },
      {
        say: "Most languages give you something shorter than a hand-written cleanup block. C++ and Rust destroy scope objects automatically; Python has with; Java has try-with-resources.",
        rowLabel: "the shorter forms",
        row: [
          { v: "C++/Rust: scope", tone: "good" },
          { v: "Python: with", tone: "good" },
          { v: "Java: try(...)", tone: "good" },
          { v: "JS: finally", tone: "compare" },
        ],
      },
    ],
  };
}

/* ---------------------------------------------------- files & modules -- */

/** Why reading a file line by line beats reading it all at once. */
export function traceFileFlow(): Viz {
  const code = `// all at once
text = read_whole_file(path)

// or a line at a time
for line in open(path):
    handle(line)`;

  const bar = (n: number, tone: Bar["tone"], label?: string): Bar => ({ v: n, tone, label });

  return {
    title: "All at once, or a line at a time",
    blurb: "Watch the memory use of the two approaches as the file grows.",
    code,
    frames: [
      {
        say: "A file on disk is just bytes in order. Nothing about it is loaded until you ask.",
        rowLabel: "the file",
        row: [
          { v: "line 1", i: "0", tone: "ghost" },
          { v: "line 2", i: "1", tone: "ghost" },
          { v: "line 3", i: "2", tone: "ghost" },
          { v: "…", tone: "ghost" },
        ],
        vars: vars({ "in memory": "0" }),
      },
      {
        say: "Reading it all at once puts the WHOLE file in memory. For a small config file that is exactly right — simple, and one operation.",
        rowLabel: "in memory",
        row: [
          { v: "line 1", i: "0", tone: "good" },
          { v: "line 2", i: "1", tone: "good" },
          { v: "line 3", i: "2", tone: "good" },
        ],
        line: 2,
        vars: vars({ "file size": "2 KB", "memory used": "2 KB" }),
      },
      {
        say: "Now the same code on a 10 GB log file. The memory needed grows exactly as fast as the file does.",
        barCap: 10,
        bars: [bar(2, "good", "2KB"), bar(6, "compare", "1GB"), bar(10, "bad", "10GB")],
        line: 2,
        vars: vars({ "memory used": "the whole file" }),
      },
      {
        say: "Reading a LINE at a time is different. One line is in memory, it is handled, and then it is replaced by the next.",
        rowLabel: "in memory",
        row: [
          { v: "line 1", i: "now", tone: "good" },
          { v: "…", tone: "ghost" },
        ],
        line: 5,
        vars: vars({ "memory used": "one line" }),
      },
      {
        say: "Line two replaces line one. Nothing accumulates.",
        rowLabel: "in memory",
        row: [
          { v: "line 2", i: "now", tone: "good" },
          { v: "…", tone: "ghost" },
        ],
        line: 6,
        vars: vars({ "memory used": "one line" }),
      },
      {
        say: "So the memory use is flat however big the file gets. That is the whole reason to prefer it.",
        barCap: 10,
        bars: [bar(1, "good", "2KB"), bar(1, "good", "1GB"), bar(1, "good", "10GB")],
        vars: vars({ "memory used": "one line, always" }),
      },
      {
        say: "One more thing happens underneath: BUFFERING. Reading one byte at a time from the disk would be desperately slow, so the system fetches a block and hands you pieces of it.",
        rowLabel: "the buffer",
        row: [
          { v: "disk", tone: "ghost" },
          { v: "-> 8 KB block", tone: "compare" },
          { v: "-> your line", tone: "good" },
        ],
        vars: vars({ "disk reads": "one per block, not per line" }),
      },
      {
        say: "Writing works the same way in reverse, which is why a file may look empty until you close it — the last part is still sitting in the buffer.",
        rowLabel: "writing",
        row: [
          { v: "your line", tone: "good" },
          { v: "-> buffer", tone: "compare" },
          { v: "-> disk on close", tone: "active" },
        ],
        vars: vars({ rule: "always close, or the tail is lost" }),
      },
      {
        say: "So the rule of thumb: small file, read it whole. Large or unknown file, stream it. And always close, however the code leaves the block.",
        rowLabel: "the rule",
        row: [
          { v: "small: read all", tone: "done" },
          { v: "large: stream", tone: "done" },
          { v: "always: close", tone: "done" },
        ],
      },
    ],
  };
}

/** How a name in one file finds the code in another. */
export function traceModuleResolve(): Viz {
  const node = (id: string, label: string, x: number, y: number, tone: Cell["tone"], sub?: string) =>
    ({ id, label, x, y, tone, sub });

  return {
    title: "Finding the code in another file",
    blurb: "Watch one name turn into a path, a file, and a definition.",
    frames: [
      {
        say: "One file needs something defined in another. It writes the name and trusts something to find it.",
        nodes: [
          node("m", "main", 20, 30, "active", "wants total()"),
          node("q", "?", 70, 30, "ghost", "where is it?"),
        ],
        edges: [{ from: "m", to: "q", tone: "ghost", arrow: true }],
      },
      {
        say: "First, the name is turned into a location. A relative path — ./maths — means 'next to this file'. A bare name means 'look where installed packages live'.",
        nodes: [
          node("m", "main", 20, 30, "active"),
          node("r", "./maths", 70, 15, "compare", "relative: next door"),
          node("p", "numpy", 70, 55, "compare", "bare: a package"),
        ],
        edges: [
          { from: "m", to: "r", tone: "compare", arrow: true },
          { from: "m", to: "p", tone: "compare", arrow: true },
        ],
      },
      {
        say: "Then the file is found and its top level is RUN. Definitions are created, and anything marked as exported becomes visible.",
        nodes: [
          node("m", "main", 20, 30, "ghost"),
          node("f", "maths file", 70, 30, "good", "runs once"),
          node("t", "total()", 70, 70, "good", "now defined"),
        ],
        edges: [
          { from: "m", to: "f", tone: "ghost", arrow: true },
          { from: "f", to: "t", tone: "good", arrow: true },
        ],
      },
      {
        say: "Run ONCE is the important part. Import the same file from ten places and its top level runs a single time — the result is cached and shared.",
        nodes: [
          node("a", "main", 15, 15, "active"),
          node("b", "app", 15, 50, "active"),
          node("c", "test", 15, 85, "active"),
          node("f", "maths", 70, 50, "good", "run once, shared"),
        ],
        edges: [
          { from: "a", to: "f", tone: "active", arrow: true },
          { from: "b", to: "f", tone: "active", arrow: true },
          { from: "c", to: "f", tone: "active", arrow: true },
        ],
        vars: vars({ "times the file runs": 1 }),
      },
      {
        say: "That is why top-level side effects are risky. Code that prints, opens a connection or reads an environment variable runs at import time, in an order you may not control.",
        nodes: [
          node("f", "maths", 50, 25, "bad", "connects to a database"),
          node("s", "at import", 50, 70, "bad", "before main even starts"),
        ],
        edges: [{ from: "f", to: "s", tone: "bad", arrow: true }],
      },
      {
        say: "And two files importing each other is a CIRCULAR import. One of them will be half-built when the other looks at it, which produces confusing errors.",
        nodes: [
          node("a", "a", 30, 40, "bad"),
          node("b", "b", 70, 40, "bad"),
        ],
        edges: [
          { from: "a", to: "b", tone: "bad", arrow: true },
          { from: "b", to: "a", tone: "bad", arrow: true },
        ],
        vars: vars({ symptom: "half-defined names, in one direction only" }),
      },
      {
        say: "The fix is almost always to pull the shared part into a third file that both import. Layers point one way.",
        nodes: [
          node("a", "a", 25, 25, "good"),
          node("b", "b", 75, 25, "good"),
          node("c", "shared", 50, 75, "good", "neither imports the other"),
        ],
        edges: [
          { from: "a", to: "c", tone: "good", arrow: true },
          { from: "b", to: "c", tone: "good", arrow: true },
        ],
      },
      {
        say: "The last piece is what a file chooses to SHOW. Everything else stays private, and that is what lets you change the inside of a module without breaking anyone.",
        nodes: [
          node("f", "maths", 50, 25, "done", "the file"),
          node("p", "total()", 25, 70, "good", "exported"),
          node("h", "helper()", 75, 70, "ghost", "private"),
        ],
        edges: [
          { from: "f", to: "p", tone: "good", arrow: true },
          { from: "f", to: "h", tone: "ghost", arrow: true },
        ],
      },
    ],
  };
}

/** A dependency tree, and why the lock file exists. */
export function traceDependency(): Viz {
  const node = (id: string, label: string, x: number, y: number, tone: Cell["tone"], sub?: string) =>
    ({ id, label, x, y, tone, sub });

  return {
    title: "What one dependency really brings",
    blurb: "Watch three declared packages turn into a tree — and one version conflict.",
    frames: [
      {
        say: "You declare three packages. That is what you asked for, and it is not what you get.",
        nodes: [
          node("app", "your app", 50, 15, "active"),
          node("a", "web", 20, 55, "good"),
          node("b", "json", 50, 55, "good"),
          node("c", "date", 80, 55, "good"),
        ],
        edges: [
          { from: "app", to: "a", tone: "good", arrow: true },
          { from: "app", to: "b", tone: "good", arrow: true },
          { from: "app", to: "c", tone: "good", arrow: true },
        ],
        vars: vars({ declared: 3 }),
      },
      {
        say: "Each of those has its own dependencies, and so do those. The real tree is usually far bigger than the list you wrote.",
        nodes: [
          node("app", "your app", 50, 10, "active"),
          node("a", "web", 20, 40, "good"),
          node("b", "json", 55, 40, "good"),
          node("c", "date", 85, 40, "good"),
          node("d", "http", 10, 75, "compare"),
          node("e", "utf8", 33, 75, "compare"),
          node("f", "utf8", 60, 75, "compare"),
          node("g", "tz", 85, 75, "compare"),
        ],
        edges: [
          { from: "app", to: "a", tone: "ghost", arrow: true },
          { from: "app", to: "b", tone: "ghost", arrow: true },
          { from: "app", to: "c", tone: "ghost", arrow: true },
          { from: "a", to: "d", tone: "compare", arrow: true },
          { from: "a", to: "e", tone: "compare", arrow: true },
          { from: "b", to: "f", tone: "compare", arrow: true },
          { from: "c", to: "g", tone: "compare", arrow: true },
        ],
        vars: vars({ declared: 3, "actually installed": 7 }),
      },
      {
        say: "Now the interesting part. Two of them want the same package at DIFFERENT versions.",
        nodes: [
          node("a", "web", 25, 25, "active", "wants utf8 1.2"),
          node("b", "json", 75, 25, "active", "wants utf8 2.0"),
          node("e", "utf8 ?", 50, 70, "bad", "which one?"),
        ],
        edges: [
          { from: "a", to: "e", tone: "bad", arrow: true, label: "1.2" },
          { from: "b", to: "e", tone: "bad", arrow: true, label: "2.0" },
        ],
      },
      {
        say: "npm and Cargo install BOTH, each where its user can find it. Disk space for peace of mind.",
        nodes: [
          node("a", "web", 25, 25, "good"),
          node("b", "json", 75, 25, "good"),
          node("e1", "utf8 1.2", 25, 70, "good"),
          node("e2", "utf8 2.0", 75, 70, "good"),
        ],
        edges: [
          { from: "a", to: "e1", tone: "good", arrow: true },
          { from: "b", to: "e2", tone: "good", arrow: true },
        ],
        vars: vars({ "npm / Cargo": "install both" }),
      },
      {
        say: "pip and Maven install ONE, and something has to give. That is where 'it works on my machine' comes from.",
        nodes: [
          node("a", "web", 25, 25, "bad", "gets 2.0 anyway"),
          node("b", "json", 75, 25, "good"),
          node("e", "utf8 2.0", 50, 70, "compare", "one version wins"),
        ],
        edges: [
          { from: "a", to: "e", tone: "bad", arrow: true },
          { from: "b", to: "e", tone: "good", arrow: true },
        ],
        vars: vars({ "pip / Maven": "one version, and hope" },),
      },
      {
        say: "The other problem: your file says 'version 1.2 or newer'. Install today and tomorrow and you may get different code.",
        rowLabel: "^1.2.0 means",
        row: [
          { v: "1.2.0", tone: "good" },
          { v: "1.3.7", tone: "compare" },
          { v: "1.9.2", tone: "compare" },
          { v: "2.0.0", tone: "bad", i: "not this" },
        ],
        vars: vars({ problem: "two installs, two results" }),
      },
      {
        say: "That is what the LOCK FILE is for. It records the exact version of every package in the whole tree, so the next install is identical.",
        rowLabel: "the lock file",
        row: [
          { v: "web 1.4.2", tone: "good" },
          { v: "json 3.0.1", tone: "good" },
          { v: "utf8 1.2.9", tone: "good" },
          { v: "…", tone: "good" },
        ],
        vars: vars({ rule: "commit the lock file" }),
      },
      {
        say: "So: your file says what you want, the lock file says what you got. Commit both, and every machine builds the same thing.",
        rowLabel: "the two files",
        row: [
          { v: "manifest: what you want", tone: "done" },
          { v: "lock: what you got", tone: "done" },
        ],
      },
      {
        say: "And a last thought worth carrying: every dependency is code you now ship and are responsible for. The cheapest dependency is the one you did not add.",
        rowLabel: "before adding one",
        row: [
          { v: "how big is its tree?", tone: "compare" },
          { v: "is it maintained?", tone: "compare" },
          { v: "could I write this?", tone: "compare" },
        ],
      },
    ],
  };
}

/* ---------------------------------------------------------- comparison -- */

/** Identity versus equality, and why 0.1 + 0.2 misses 0.3. */
export function traceEquality(): Viz {
  const node = (id: string, label: string, x: number, y: number, tone: Cell["tone"], sub?: string) =>
    ({ id, label, x, y, tone, sub });

  return {
    title: "Two different questions",
    blurb: "Watch 'same object' and 'same value' give different answers.",
    frames: [
      {
        say: "Two objects, built separately, holding exactly the same values. Are they equal?",
        nodes: [
          node("a", "a", 15, 25, "active"),
          node("b", "b", 15, 70, "active"),
          node("oa", "{x: 1}", 65, 25, "good", "at address 100"),
          node("ob", "{x: 1}", 65, 70, "good", "at address 200"),
        ],
        edges: [
          { from: "a", to: "oa", tone: "active", arrow: true },
          { from: "b", to: "ob", tone: "active", arrow: true },
        ],
        vars: vars({ question: "it depends what you asked" }),
      },
      {
        say: "IDENTITY asks: are these the same object in memory? Here the addresses differ, so the answer is no.",
        nodes: [
          node("a", "a", 15, 25, "ghost"),
          node("b", "b", 15, 70, "ghost"),
          node("oa", "address 100", 65, 25, "bad"),
          node("ob", "address 200", 65, 70, "bad"),
        ],
        edges: [
          { from: "a", to: "oa", tone: "ghost", arrow: true },
          { from: "b", to: "ob", tone: "ghost", arrow: true },
        ],
        vars: vars({ identity: "false" }),
      },
      {
        say: "EQUALITY asks: do these hold the same values? Compare field by field, and the answer is yes.",
        rowLabel: "field by field",
        row: [
          { v: "a.x = 1", tone: "good" },
          { v: "=", tone: "ghost" },
          { v: "b.x = 1", tone: "good" },
        ],
        vars: vars({ equality: "true" }),
      },
      {
        say: "So the two questions genuinely disagree, and every language here gives you a way to ask each — with wildly different defaults about which one an ordinary == means.",
        gridLabel: "what == does on two objects",
        grid: [
          [{ v: "whatever you defined", tone: "good" }],
          [{ v: "compares addresses", tone: "bad" }],
          [{ v: "compares references", tone: "bad" }],
          [{ v: "compares values", tone: "good" }],
          [{ v: "compares identity", tone: "bad" }],
          [{ v: "compares values", tone: "good" }],
        ],
        gridRowNames: ["C++", "C", "Java", "Python", "JavaScript", "Rust"],
        gridColNames: ["=="],
      },
      {
        say: "There is a rule that ties this to hashing, and breaking it produces very confusing bugs: two things that compare EQUAL must produce the SAME hash.",
        nodes: [
          node("x", "a == b", 50, 20, "good"),
          node("h", "hash(a) == hash(b)", 50, 70, "good", "must also be true"),
        ],
        edges: [{ from: "x", to: "h", tone: "good", arrow: true, label: "requires" }],
      },
      {
        say: "Break it and a set holds two things you consider identical, or fails to find one you just put in — because it hashed to one slot and looked in another.",
        rowLabel: "a set with a broken hash",
        row: [
          { v: "insert a", i: "slot 3", tone: "compare" },
          { v: "look for b", i: "slot 7", tone: "bad" },
          { v: "not found", tone: "bad" },
        ],
        vars: vars({ symptom: "the set 'loses' things" }),
      },
      {
        say: "Now the other trap, and it is in every language here. 0.1 and 0.2 cannot be stored exactly in binary, any more than a third can be written exactly in decimal.",
        rowLabel: "what is actually stored",
        row: [
          { v: "0.1", i: "you wrote", tone: "idle" },
          { v: "0.1000000000000000055…", i: "stored", tone: "bad" },
        ],
        vars: vars({ reason: "binary cannot represent 1/10" }),
      },
      {
        say: "Add them and the tiny errors add too. The result is a hair away from 0.3 — so an exact comparison is false.",
        rowLabel: "0.1 + 0.2",
        row: [
          { v: "0.30000000000000004", tone: "bad" },
          { v: "≠", tone: "ghost" },
          { v: "0.3", tone: "idle" },
        ],
        vars: vars({ "== 0.3": "false" }),
      },
      {
        say: "So never compare floats with ==. Compare the DISTANCE between them against a small tolerance instead — and for money, use a decimal or integer type and avoid the problem entirely.",
        rowLabel: "how to compare them",
        row: [
          { v: "abs(a − b) < 1e-9", tone: "good" },
          { v: "or store cents as an int", tone: "done" },
        ],
        vars: vars({ rule: "never == on floats" }),
      },
    ],
  };
}

/* ------------------------------------------------------- error or not -- */

/** Where the line sits between an expected outcome and a real failure. */
export function traceErrorDesign(): Viz {
  const frames: Frame[] = [];

  const judge = (
    say: string,
    label: string,
    cells: Cell[],
    v?: Record<string, string | number>,
  ) => frames.push({ say, rowLabel: label, row: cells, vars: v ? vars(v) : undefined });

  judge(
    "Six things that can happen while a program runs. Which of them are ERRORS?",
    "sort these",
    [
      { v: "wrong password", tone: "idle" },
      { v: "key not in map", tone: "idle" },
      { v: "search finds nothing", tone: "idle" },
      { v: "config will not parse", tone: "idle" },
      { v: "disk full", tone: "idle" },
      { v: "index past the end", tone: "idle" },
    ],
  );

  judge(
    "The test: if this happened in a loop over normal input, would you be surprised? A wrong password happens thousands of times a day. Not surprising.",
    "expected — an ordinary return value",
    [
      { v: "wrong password", tone: "good" },
      { v: "key not in map", tone: "good" },
      { v: "search finds nothing", tone: "good" },
    ],
    { "how to report": "a value the caller reads" },
  );

  judge(
    "These three would surprise you. A configuration file that will not parse means the program cannot start; a full disk means the write did not happen.",
    "genuine failures — report them loudly",
    [
      { v: "config will not parse", tone: "bad" },
      { v: "disk full", tone: "bad" },
    ],
    { "how to report": "throw, or return a Result" },
  );

  judge(
    "And the last one is different again. An index past the end is not a failure of the world — it is a BUG in the code. That deserves an assert or a panic, not a caught exception.",
    "a bug — fix the code",
    [{ v: "index past the end", tone: "compare" }],
    { "how to report": "assert / panic" },
  );

  frames.push({
    say: "Three categories, three mechanisms. Mixing them up is what produces both empty catch blocks and try/except around ordinary lookups.",
    gridLabel: "the three kinds",
    grid: [
      [
        { v: "happens all the time", tone: "good" },
        { v: "a return value", tone: "good" },
        { v: "Optional / None / null-ish", tone: "good" },
      ],
      [
        { v: "should not normally happen", tone: "compare" },
        { v: "throw or Result", tone: "compare" },
        { v: "the caller decides", tone: "compare" },
      ],
      [
        { v: "impossible unless buggy", tone: "bad" },
        { v: "assert or panic", tone: "bad" },
        { v: "fix the code", tone: "bad" },
      ],
    ],
    gridRowNames: ["expected", "failure", "bug"],
    gridColNames: ["how often", "how to report", "what the caller does"],
  });

  frames.push({
    say: "There is a second decision, and it is about WHERE. A bad value accepted at the edge becomes a mystery in the middle, six functions later.",
    nodes: [
      { id: "in", label: "input", x: 12, y: 45, tone: "bad", sub: "age = \"-3\"" },
      { id: "a", label: "handler", x: 37, y: 45, tone: "ghost" },
      { id: "b", label: "service", x: 62, y: 45, tone: "ghost" },
      { id: "c", label: "database", x: 87, y: 45, tone: "bad", sub: "fails here" },
    ],
    edges: [
      { from: "in", to: "a", tone: "bad", arrow: true },
      { from: "a", to: "b", tone: "bad", arrow: true },
      { from: "b", to: "c", tone: "bad", arrow: true },
    ],
    vars: vars({ symptom: "the error names the wrong place" }),
  });

  frames.push({
    say: "Validate at the boundary and reject it there. Now the error message names the actual problem, at the actual line, before anything downstream has to cope.",
    nodes: [
      { id: "in", label: "input", x: 12, y: 45, tone: "bad", sub: "age = \"-3\"" },
      { id: "a", label: "handler", x: 37, y: 45, tone: "good", sub: "rejects it here" },
      { id: "b", label: "service", x: 62, y: 45, tone: "ghost", sub: "never sees it" },
      { id: "c", label: "database", x: 87, y: 45, tone: "ghost" },
    ],
    edges: [
      { from: "in", to: "a", tone: "bad", arrow: true },
      { from: "a", to: "b", tone: "ghost", arrow: true },
      { from: "b", to: "c", tone: "ghost", arrow: true },
    ],
    vars: vars({ rule: "fail early, and loudly" }),
  });

  frames.push({
    say: "And say what was wrong AND what you were given. \"Invalid age\" starts a conversation; \"age must be 0-150, got -3\" ends one.",
    rowLabel: "the message",
    row: [
      { v: "invalid age", i: "useless", tone: "bad" },
      { v: "age must be 0-150, got -3", i: "actionable", tone: "good" },
    ],
  });

  return {
    title: "Expected, failure, or bug",
    blurb: "Three categories that want three different mechanisms.",
    frames,
  };
}

/* --------------------------------------------------------- generics -- */

/** One written function becoming several real ones at compile time. */
export function traceMonomorphise(): Viz {
  const code = `template<typename T>
T largest(T a, T b) {
  return a > b ? a : b;
}

largest(3, 7);
largest(1.5, 2.5);
largest("ada"s, "bob"s);`;

  const node = (id: string, label: string, x: number, y: number, tone: Cell["tone"], sub?: string) =>
    ({ id, label, x, y, tone, sub });

  return {
    title: "One written, many compiled",
    blurb: "Watch the compiler write the copies you would have written by hand.",
    code,
    frames: [
      {
        say: "The same three lines, three times, differing only in a type. That duplication is what generics exist to remove.",
        rowLabel: "what you would write by hand",
        row: [
          { v: "largest(int,int)", tone: "bad" },
          { v: "largest(double,double)", tone: "bad" },
          { v: "largest(string,string)", tone: "bad" },
        ],
        vars: vars({ "copies to maintain": 3 }),
      },
      {
        say: "Write it ONCE with a placeholder type instead. T is not a type — it is a hole where a type will go.",
        rowLabel: "written once",
        row: [{ v: "template<typename T>", tone: "good" }, { v: "T largest(T, T)", tone: "good" }],
        line: 1,
        vars: vars({ "copies to maintain": 1 }),
      },
      {
        say: "Now call it with two ints. The compiler sees the types at the call site and fills the hole in.",
        nodes: [
          node("t", "largest<T>", 50, 15, "active", "the template"),
          node("i", "largest<int>", 50, 65, "good", "generated"),
        ],
        edges: [{ from: "t", to: "i", tone: "good", arrow: true, label: "T = int" }],
        line: 6,
        vars: vars({ "T": "int" }),
      },
      {
        say: "Call it with doubles and the compiler generates a SECOND real function. Not a shared one — a separate machine-code copy.",
        nodes: [
          node("t", "largest<T>", 50, 12, "active", "the template"),
          node("i", "largest<int>", 22, 62, "good"),
          node("d", "largest<double>", 62, 62, "good", "generated"),
        ],
        edges: [
          { from: "t", to: "i", tone: "ghost", arrow: true },
          { from: "t", to: "d", tone: "good", arrow: true, label: "T = double" },
        ],
        line: 7,
        vars: vars({ "T": "double", "copies in the binary": 2 }),
      },
      {
        say: "And a third for string. This is MONOMORPHISATION: every distinct type you use produces its own copy.",
        nodes: [
          node("t", "largest<T>", 50, 12, "ghost", "the template"),
          node("i", "largest<int>", 15, 62, "good"),
          node("d", "largest<double>", 50, 62, "good"),
          node("s", "largest<string>", 85, 62, "good", "generated"),
        ],
        edges: [
          { from: "t", to: "i", tone: "ghost", arrow: true },
          { from: "t", to: "d", tone: "ghost", arrow: true },
          { from: "t", to: "s", tone: "good", arrow: true, label: "T = string" },
        ],
        line: 8,
        vars: vars({ "copies in the binary": 3 }),
      },
      {
        say: "The payoff is that each copy is as fast as a hand-written one. Nothing is decided at run time, and the comparison can be inlined.",
        rowLabel: "cost at run time",
        row: [
          { v: "0", i: "type checks", tone: "good" },
          { v: "0", i: "lookups", tone: "good" },
          { v: "inlined", i: "the comparison", tone: "good" },
        ],
        vars: vars({ speed: "as if hand-written" }),
      },
      {
        say: "The price is real too: three copies means a bigger binary and slower compilation. Rust makes the same trade; Java and C# do not.",
        rowLabel: "the trade",
        row: [
          { v: "fast at run time", tone: "good" },
          { v: "bigger binary", tone: "bad" },
          { v: "slower to compile", tone: "bad" },
        ],
        vars: vars({ "C++ and Rust": "monomorphise", "Java and C#": "one shared copy" }),
      },
      {
        say: "Python and JavaScript sit outside this entirely. They never check the type, so one function already works for everything — and nothing tells you when it will not.",
        rowLabel: "the four answers",
        row: [
          { v: "C++ templates", i: "a copy each", tone: "done" },
          { v: "Rust generics", i: "a copy each", tone: "done" },
          { v: "Java generics", i: "one, erased", tone: "done" },
          { v: "Python / JS", i: "no types at all", tone: "done" },
        ],
      },
    ],
  };
}

/** An unconstrained placeholder failing, and a bound fixing it. */
export function traceBounds(): Viz {
  const code = `template<typename T>
T largest(T a, T b) {
  return a > b ? a : b;    // needs >
}

struct Dog { string name; };
largest(rex, fido);        // ?`;

  return {
    title: "What T is allowed to be",
    blurb: "Watch a generic accept something it cannot actually work with.",
    code,
    frames: [
      {
        say: "T says 'any type'. But the body uses >, so it really means 'any type that can be compared'. Nothing says so.",
        rowLabel: "what the signature promises",
        row: [{ v: "any type at all", tone: "bad" }],
        row2Label: "what the body needs",
        row2: [{ v: "a type with >", tone: "compare" }],
        line: 3,
      },
      {
        say: "Call it with a Dog, which has no >. The call itself looks perfectly reasonable — the mismatch is invisible at this line.",
        rowLabel: "largest(rex, fido)",
        row: [
          { v: "Dog", tone: "active" },
          { v: ">", tone: "bad" },
          { v: "Dog", tone: "active" },
        ],
        line: 7,
        vars: vars({ "Dog has >": "no" }),
      },
      {
        say: "In old C++ the error appears INSIDE the template, not at your call. It names a line you did not write, and for nested templates it can run to hundreds of lines.",
        rowLabel: "where the error points",
        row: [
          { v: "your call", tone: "ghost", i: "line 7" },
          { v: "inside largest", tone: "bad", i: "line 3" },
          { v: "…and 200 more", tone: "bad" },
        ],
        line: 3,
        vars: vars({ problem: "the error blames the wrong line" }),
      },
      {
        say: "The fix is to write the requirement down. A C++20 CONCEPT states it, and then the check happens at the call — where the mistake actually is.",
        rowLabel: "with the requirement stated",
        row: [
          { v: "requires (a > b)", tone: "good" },
          { v: "-> checked at the call", tone: "good" },
        ],
        vars: vars({ "error now points at": "line 7" }),
      },
      {
        say: "Every language here has a version of this, and they differ in when the check happens.",
        gridLabel: "how the requirement is written",
        grid: [
          [{ v: "concept / requires", tone: "good" }, { v: "at the call", tone: "good" }],
          [{ v: "T extends Comparable", tone: "good" }, { v: "at compile time", tone: "good" }],
          [{ v: "T: PartialOrd", tone: "good" }, { v: "at compile time", tone: "good" }],
          [{ v: "Protocol / duck typing", tone: "compare" }, { v: "when it runs", tone: "bad" }],
          [{ v: "nothing", tone: "bad" }, { v: "never", tone: "bad" }],
        ],
        gridRowNames: ["C++20", "Java", "Rust", "Python", "JavaScript"],
        gridColNames: ["how you say it", "when it is checked"],
      },
      {
        say: "That last column is the whole topic. A bound turns 'this crashed in production on a Dog' into 'this did not compile'.",
        rowLabel: "the point of a bound",
        row: [
          { v: "unbounded", i: "fails late", tone: "bad" },
          { v: "bounded", i: "fails at the call", tone: "good" },
        ],
      },
    ],
  };
}

/** What is left of a generic type once the program is running. */
export function traceErasure(): Viz {
  return {
    title: "What survives to run time",
    blurb: "Watch the same generic list keep, lose, or never have its type.",
    frames: [
      {
        say: "A list of strings, written the same way in three languages. The question is what the running program still knows about that <string>.",
        rowLabel: "what you wrote",
        row: [
          { v: "vector<string>", tone: "active" },
          { v: "List<String>", tone: "active" },
          { v: "list[str]", tone: "active" },
        ],
      },
      {
        say: "C++ and Rust: the type is baked in. vector<string> and vector<int> are genuinely different types, with different machine code, laid out differently in memory.",
        rowLabel: "C++ / Rust at run time",
        row: [
          { v: "vector<string>", i: "a real type", tone: "good" },
          { v: "vector<int>", i: "a different real type", tone: "good" },
        ],
        vars: vars({ "knows its type": "yes, completely" }),
      },
      {
        say: "Java: the type is ERASED. The compiler checks it, then throws it away — at run time there is one List class, holding Objects.",
        rowLabel: "Java at run time",
        row: [
          { v: "List<String>", tone: "ghost" },
          { v: "→", tone: "ghost" },
          { v: "List", i: "of Object", tone: "compare" },
        ],
        vars: vars({ "knows its type": "no, it was erased" }),
      },
      {
        say: "That is why `new T[]` does not compile in Java, why you cannot ask `x instanceof List<String>`, and why two methods differing only in their generic parameter clash.",
        rowLabel: "what erasure costs Java",
        row: [
          { v: "no new T[]", tone: "bad" },
          { v: "no instanceof List<String>", tone: "bad" },
          { v: "overloads clash", tone: "bad" },
        ],
      },
      {
        say: "It bought backwards compatibility: generics arrived in Java 5, and erased generics let old code and new code share the same classes. A deliberate trade, still being paid for.",
        rowLabel: "what erasure bought",
        row: [{ v: "old code kept working", tone: "good" }],
        vars: vars({ year: 2004 }),
      },
      {
        say: "Python and JavaScript: there was never anything to erase. A type hint is documentation that no run-time check ever reads.",
        rowLabel: "Python at run time",
        row: [
          { v: "list[str]", tone: "ghost", i: "the hint" },
          { v: "→", tone: "ghost" },
          { v: "list", i: "of anything", tone: "compare" },
        ],
        vars: vars({ "checked by": "mypy, if you run it" }),
      },
      {
        say: "So the same line of code sits somewhere different on this scale in each language — and knowing where explains most of the errors you will hit.",
        gridLabel: "the scale",
        grid: [
          [{ v: "a separate real type", tone: "good" }],
          [{ v: "a separate real type", tone: "good" }],
          [{ v: "checked, then erased", tone: "compare" }],
          [{ v: "a hint, checked by a tool", tone: "compare" }],
          [{ v: "nothing at all", tone: "bad" }],
        ],
        gridRowNames: ["C++", "Rust", "Java", "Python", "JavaScript"],
        gridColNames: ["at run time"],
      },
    ],
  };
}

/* ------------------------------------------------------- functional -- */

/** A function stored, passed and returned like any other value. */
export function traceFunctionValue(): Viz {
  const code = `auto twice = [](int x) { return x * 2; };

apply(nums, twice);          // passed in

auto adder = make_adder(10); // returned out
adder(5);                    // 15`;

  return {
    title: "A function is a value",
    blurb: "Watch it go into a variable, into an argument, and out of a return.",
    code,
    frames: [
      {
        say: "You already store numbers and strings in variables. A function can go in one too — it is just another kind of value.",
        rowLabel: "things a variable can hold",
        row: [
          { v: "42", i: "a number", tone: "idle" },
          { v: "\"hi\"", i: "a string", tone: "idle" },
          { v: "[1,2]", i: "a list", tone: "idle" },
          { v: "x => x*2", i: "a function", tone: "good" },
        ],
        line: 1,
      },
      {
        say: "Once it is a value, it can be an ARGUMENT. apply does not know what the work is — it is handed the work.",
        nodes: [
          { id: "a", label: "apply", x: 30, y: 30, tone: "active", sub: "the loop" },
          { id: "f", label: "twice", x: 75, y: 30, tone: "good", sub: "the work" },
        ],
        edges: [{ from: "f", to: "a", tone: "good", arrow: true, label: "passed in" }],
        line: 3,
      },
      {
        say: "That single idea is what map, filter, sort-with-a-comparator and every event handler are built on. The loop is written once; the work varies.",
        rowLabel: "the same idea, everywhere",
        row: [
          { v: "map(f)", tone: "compare" },
          { v: "filter(p)", tone: "compare" },
          { v: "sort(cmp)", tone: "compare" },
          { v: "onClick(h)", tone: "compare" },
        ],
      },
      {
        say: "It can also be a RETURN value. make_adder does not add anything — it builds and hands back a function that will.",
        nodes: [
          { id: "m", label: "make_adder(10)", x: 28, y: 30, tone: "active" },
          { id: "f", label: "adder", x: 75, y: 30, tone: "good", sub: "a new function" },
        ],
        edges: [{ from: "m", to: "f", tone: "good", arrow: true, label: "returns" }],
        line: 5,
      },
      {
        say: "The returned function remembers the 10. That memory is the interesting part, and it is the next section.",
        rowLabel: "adder(5)",
        row: [
          { v: "5", i: "the argument", tone: "active" },
          { v: "+", tone: "ghost" },
          { v: "10", i: "remembered", tone: "compare" },
          { v: "= 15", tone: "good" },
        ],
        line: 6,
        out: "15",
      },
      {
        say: "Two words for this. FIRST-CLASS means functions can be stored, passed and returned. HIGHER-ORDER means a function that takes or returns one.",
        rowLabel: "the vocabulary",
        row: [
          { v: "first-class", i: "a function is a value", tone: "done" },
          { v: "higher-order", i: "takes or returns one", tone: "done" },
        ],
      },
      {
        say: "Every language here has both. What differs is the syntax, and what happens to variables the function captured — which is where they genuinely disagree.",
        rowLabel: "how it is spelled",
        row: [
          { v: "[](int x){...}", i: "C++", tone: "done" },
          { v: "lambda x: ...", i: "Python", tone: "done" },
          { v: "x -> ...", i: "Java", tone: "done" },
          { v: "x => ...", i: "JS", tone: "done" },
          { v: "|x| ...", i: "Rust", tone: "done" },
          { v: "a pointer", i: "C", tone: "bad" },
        ],
      },
    ],
  };
}

/** What a closure captures, and the classic loop-variable trap. */
export function traceClosure(): Viz {
  const code = `fns = []

for i in 0..3:
    fns.append(lambda: i)

fns[0]()   # ?`;

  const node = (id: string, label: string, x: number, y: number, tone: Cell["tone"], sub?: string) =>
    ({ id, label, x, y, tone, sub });

  return {
    title: "What a closure remembers",
    blurb: "Watch three functions end up sharing one variable.",
    code,
    frames: [
      {
        say: "A closure is a function plus the variables it captured from around it. The question is always: did it capture the VALUE, or the variable itself?",
        rowLabel: "two possibilities",
        row: [
          { v: "a copy of the value", tone: "compare" },
          { v: "the variable itself", tone: "compare" },
        ],
      },
      {
        say: "A loop makes three functions, each returning i. It looks like they should return 0, 1 and 2.",
        nodes: [
          node("i", "i", 20, 45, "active", "the loop variable"),
          node("f0", "fn 0", 70, 15, "idle"),
          node("f1", "fn 1", 70, 45, "idle"),
          node("f2", "fn 2", 70, 75, "idle"),
        ],
        line: 4,
      },
      {
        say: "But in Python, JavaScript's var, and a C++ lambda capturing by reference, all three captured the SAME variable — not three copies of its value.",
        nodes: [
          node("i", "i = 0", 20, 45, "compare", "one variable"),
          node("f0", "fn 0", 70, 15, "active"),
          node("f1", "fn 1", 70, 45, "active"),
          node("f2", "fn 2", 70, 75, "active"),
        ],
        edges: [
          { from: "f0", to: "i", tone: "compare", arrow: true },
          { from: "f1", to: "i", tone: "compare", arrow: true },
          { from: "f2", to: "i", tone: "compare", arrow: true },
        ],
        line: 4,
        vars: vars({ "variables captured": 1, "functions sharing it": 3 }),
      },
      {
        say: "The loop finishes and leaves i at its last value. Every function is looking at that one variable.",
        nodes: [
          node("i", "i = 2", 20, 45, "bad", "after the loop"),
          node("f0", "fn 0", 70, 15, "bad"),
          node("f1", "fn 1", 70, 45, "bad"),
          node("f2", "fn 2", 70, 75, "bad"),
        ],
        edges: [
          { from: "f0", to: "i", tone: "bad", arrow: true },
          { from: "f1", to: "i", tone: "bad", arrow: true },
          { from: "f2", to: "i", tone: "bad", arrow: true },
        ],
        line: 6,
      },
      {
        say: "So all three return 2. Not 0, 1, 2 — the same value three times. This bug is old enough to have caught everyone at least once.",
        rowLabel: "what you get",
        row: [
          { v: "2", i: "fn 0", tone: "bad" },
          { v: "2", i: "fn 1", tone: "bad" },
          { v: "2", i: "fn 2", tone: "bad" },
        ],
        out: "2",
      },
      {
        say: "The fix is to capture the VALUE instead. A default argument in Python, a by-value lambda capture in C++, or simply `let` instead of `var` in JavaScript.",
        nodes: [
          node("f0", "fn 0", 55, 15, "good", "holds 0"),
          node("f1", "fn 1", 55, 45, "good", "holds 1"),
          node("f2", "fn 2", 55, 75, "good", "holds 2"),
        ],
        vars: vars({ "copies captured": 3 }),
      },
      {
        say: "JavaScript's `let` fixes it because let creates a NEW binding each iteration. That is the whole reason the let/var distinction still matters.",
        rowLabel: "what you get now",
        row: [
          { v: "0", i: "fn 0", tone: "good" },
          { v: "1", i: "fn 1", tone: "good" },
          { v: "2", i: "fn 2", tone: "good" },
        ],
      },
      {
        say: "The languages differ on the DEFAULT. C++ makes you say which you want. Rust infers it and lets you force a copy with `move`. Python, Java and JavaScript each pick for you.",
        gridLabel: "what a closure captures by default",
        grid: [
          [{ v: "you must say: [=] or [&]", tone: "good" }],
          [{ v: "the variable — a shared cell", tone: "compare" }],
          [{ v: "a copy, and it must be final", tone: "good" }],
          [{ v: "the variable, but let rebinds per loop", tone: "compare" }],
          [{ v: "borrows, unless you write move", tone: "good" }],
        ],
        gridRowNames: ["C++", "Python", "Java", "JavaScript", "Rust"],
        gridColNames: ["default"],
      },
    ],
  };
}

/** Changing data in place versus building a new value. */
export function traceImmutable(): Viz {
  const node = (id: string, label: string, x: number, y: number, tone: Cell["tone"], sub?: string) =>
    ({ id, label, x, y, tone, sub });

  return {
    title: "Changing it, or replacing it",
    blurb: "Watch who else notices when a shared list is edited in place.",
    frames: [
      {
        say: "One list, and three parts of the program holding a reference to it. Nothing has happened yet.",
        nodes: [
          node("l", "[1, 2, 3]", 55, 45, "active", "one list"),
          node("a", "the view", 15, 15, "idle"),
          node("b", "the cache", 15, 45, "idle"),
          node("c", "the logger", 15, 75, "idle"),
        ],
        edges: [
          { from: "a", to: "l", tone: "idle", arrow: true },
          { from: "b", to: "l", tone: "idle", arrow: true },
          { from: "c", to: "l", tone: "idle", arrow: true },
        ],
      },
      {
        say: "One of them sorts it IN PLACE. The list is now in a different order — and the other two were never told.",
        nodes: [
          node("l", "[1, 2, 3] sorted", 55, 45, "bad", "changed under them"),
          node("a", "the view", 15, 15, "bad", "stale assumption"),
          node("b", "the cache", 15, 45, "bad", "stale assumption"),
          node("c", "the logger", 15, 75, "good", "did it"),
        ],
        edges: [
          { from: "a", to: "l", tone: "bad", arrow: true },
          { from: "b", to: "l", tone: "bad", arrow: true },
          { from: "c", to: "l", tone: "good", arrow: true },
        ],
        vars: vars({ "who was notified": 0 }),
      },
      {
        say: "That is the whole argument for immutability. Not purity — the fact that a change made in one place is invisibly a change made everywhere.",
        rowLabel: "the cost of shared mutable data",
        row: [
          { v: "action at a distance", tone: "bad" },
          { v: "hard to reproduce", tone: "bad" },
          { v: "worse with threads", tone: "bad" },
        ],
      },
      {
        say: "The alternative is to build a NEW value and leave the old one alone. Nobody's assumptions are broken, because nothing they hold has changed.",
        nodes: [
          node("l", "[1, 2, 3]", 30, 45, "good", "unchanged"),
          node("n", "[1, 2, 3] sorted", 78, 45, "good", "a new value"),
          node("a", "the view", 8, 20, "good"),
          node("c", "the logger", 78, 82, "good"),
        ],
        edges: [
          { from: "a", to: "l", tone: "good", arrow: true },
          { from: "c", to: "n", tone: "good", arrow: true },
        ],
      },
      {
        say: "The obvious objection is cost: copying a million-item list to change one item sounds terrible. And it would be, if that is what happened.",
        rowLabel: "the naive worry",
        row: [
          { v: "1,000,000 items", tone: "idle" },
          { v: "change one", tone: "compare" },
          { v: "copy all?", tone: "bad" },
        ],
      },
      {
        say: "PERSISTENT data structures share everything that did not change. A new version reuses the old one's untouched parts and only rebuilds the path to the change.",
        nodes: [
          node("r1", "version 1", 22, 15, "active"),
          node("r2", "version 2", 75, 15, "good"),
          node("s", "shared, unchanged", 50, 72, "compare", "most of the data"),
          node("n", "new bit", 88, 55, "good"),
        ],
        edges: [
          { from: "r1", to: "s", tone: "active", arrow: true },
          { from: "r2", to: "s", tone: "good", arrow: true },
          { from: "r2", to: "n", tone: "good", arrow: true },
        ],
        vars: vars({ copied: "the path only", shared: "everything else" }),
      },
      {
        say: "In practice, for most code the rule is simpler than any of this: do not modify what you were given. Return a new value, and let the caller decide.",
        rowLabel: "the practical rule",
        row: [
          { v: "do not modify the argument", tone: "done" },
          { v: "return a new value", tone: "done" },
          { v: "let the caller decide", tone: "done" },
        ],
      },
      {
        say: "And when you do mutate, do it locally — a list you built inside your own function is yours, and copying it to avoid a change nobody can see is waste.",
        rowLabel: "when mutation is fine",
        row: [
          { v: "you created it", tone: "good" },
          { v: "nobody else holds it", tone: "good" },
          { v: "it never leaves the function", tone: "good" },
        ],
      },
    ],
  };
}

/* ------------------------------------------------------ concurrency -- */

/** Two threads incrementing one counter, and the update that vanishes. */
export function traceRace(): Viz {
  const code = `counter = 0;

// two threads, each doing this 1000 times:
counter = counter + 1;`;

  const step = (
    say: string,
    a: string,
    b: string,
    mem: string,
    toneA: Cell["tone"],
    toneB: Cell["tone"],
    line?: number,
  ): Frame => ({
    say,
    line,
    rowLabel: "thread A",
    row: [{ v: a, tone: toneA }],
    row2Label: "thread B",
    row2: [{ v: b, tone: toneB }],
    vars: vars({ "counter in memory": mem }),
  });

  return {
    title: "The update that vanishes",
    blurb: "Watch one line of code turn into three steps, and two threads interleave them.",
    code,
    frames: [
      {
        say: "One shared counter, and two threads each adding 1 to it a thousand times. The answer should be 2000.",
        rowLabel: "shared memory",
        row: [{ v: "counter = 0", tone: "active" }],
        line: 1,
        vars: vars({ expected: 2000 }),
      },
      {
        say: "The trouble is that `counter = counter + 1` is not one step. It is three: READ the value, ADD one, WRITE it back.",
        rowLabel: "one line, three steps",
        row: [
          { v: "read", tone: "compare" },
          { v: "add 1", tone: "compare" },
          { v: "write", tone: "compare" },
        ],
        line: 4,
      },
      step("Thread A reads the counter. It sees 0.", "read → 0", "…", "0", "good", "ghost", 4),
      step("Before A can write, the scheduler switches to thread B. B reads too — and also sees 0.", "read → 0", "read → 0", "0", "compare", "good", 4),
      step("A adds one. It has 1 in hand, not yet written.", "has 1", "read → 0", "0", "good", "compare", 4),
      step("B adds one too. It also has 1 in hand, from the same stale read.", "has 1", "has 1", "0", "compare", "good", 4),
      step("A writes 1.", "wrote 1", "has 1", "1", "good", "compare", 4),
      step("B writes 1 — over the top of A's. Two increments happened and the counter went up by one.", "wrote 1", "wrote 1", "1", "bad", "bad", 4),
      {
        say: "That is a DATA RACE. Nothing crashed, nothing warned, and one increment simply vanished.",
        rowLabel: "after 2000 increments",
        row: [
          { v: "2000", i: "expected", tone: "ghost" },
          { v: "1873", i: "actual", tone: "bad" },
          { v: "1991", i: "next run", tone: "bad" },
        ],
        vars: vars({ reproducible: "no" }),
      },
      {
        say: "The worst part is the unreliability. It may pass a thousand test runs and fail once in production, on a machine with more cores.",
        rowLabel: "why it is hard to find",
        row: [
          { v: "no crash", tone: "bad" },
          { v: "no warning", tone: "bad" },
          { v: "different every run", tone: "bad" },
        ],
      },
      {
        say: "Two fixes. A LOCK makes the three steps indivisible. An ATOMIC increment does the whole thing in one machine instruction.",
        rowLabel: "the fixes",
        row: [
          { v: "a lock", i: "any critical section", tone: "good" },
          { v: "an atomic", i: "one simple operation", tone: "good" },
        ],
      },
      {
        say: "And a third, which is better when it fits: do not share. Give each thread its own counter and add them up at the end.",
        rowLabel: "the third fix",
        row: [
          { v: "A's own count", tone: "good" },
          { v: "+", tone: "ghost" },
          { v: "B's own count", tone: "good" },
          { v: "= 2000", tone: "done" },
        ],
        vars: vars({ contention: "none" }),
      },
    ],
  };
}

/** A lock serialising access, and the way two locks deadlock. */
export function traceLock(): Viz {
  const node = (id: string, label: string, x: number, y: number, tone: Cell["tone"], sub?: string) =>
    ({ id, label, x, y, tone, sub });

  return {
    title: "Taking turns, and getting stuck",
    blurb: "Watch a lock fix the race — and then watch two locks stop everything.",
    frames: [
      {
        say: "A lock is a token. Only the thread holding it may touch the protected data; everyone else waits.",
        nodes: [
          node("l", "the lock", 50, 20, "good", "free"),
          node("a", "thread A", 20, 70, "idle"),
          node("b", "thread B", 80, 70, "idle"),
        ],
      },
      {
        say: "A takes the lock and does the three steps — read, add, write — with nobody able to interleave.",
        nodes: [
          node("l", "the lock", 50, 20, "compare", "held by A"),
          node("a", "thread A", 20, 70, "good", "working"),
          node("b", "thread B", 80, 70, "bad", "waiting"),
        ],
        edges: [{ from: "a", to: "l", tone: "good", arrow: true, label: "holds" }],
        vars: vars({ counter: 1 }),
      },
      {
        say: "A releases. B takes it, reads the CURRENT value, and adds to that. No update is lost.",
        nodes: [
          node("l", "the lock", 50, 20, "compare", "held by B"),
          node("a", "thread A", 20, 70, "ghost", "done"),
          node("b", "thread B", 80, 70, "good", "working"),
        ],
        edges: [{ from: "b", to: "l", tone: "good", arrow: true, label: "holds" }],
        vars: vars({ counter: 2 }),
      },
      {
        say: "The cost is that the threads are no longer running at the same time. A lock held for a long time turns parallel work back into serial work.",
        rowLabel: "the cost of a lock",
        row: [
          { v: "waiting", tone: "bad" },
          { v: "context switches", tone: "bad" },
          { v: "no parallelism inside it", tone: "bad" },
        ],
        vars: vars({ rule: "hold it for as little as possible" }),
      },
      {
        say: "Now two locks. A holds the first and wants the second; B holds the second and wants the first.",
        nodes: [
          node("a", "thread A", 20, 30, "compare", "holds lock 1"),
          node("b", "thread B", 80, 30, "compare", "holds lock 2"),
          node("l1", "lock 1", 20, 78, "bad"),
          node("l2", "lock 2", 80, 78, "bad"),
        ],
        edges: [
          { from: "a", to: "l1", tone: "compare", arrow: true, label: "holds" },
          { from: "b", to: "l2", tone: "compare", arrow: true, label: "holds" },
        ],
      },
      {
        say: "Neither can proceed, and neither will give up what it has. That is a DEADLOCK — the program does not crash, it simply stops.",
        nodes: [
          node("a", "thread A", 20, 30, "bad", "waiting for 2"),
          node("b", "thread B", 80, 30, "bad", "waiting for 1"),
          node("l1", "lock 1", 20, 78, "bad", "held by A"),
          node("l2", "lock 2", 80, 78, "bad", "held by B"),
        ],
        edges: [
          { from: "a", to: "l2", tone: "bad", arrow: true, label: "wants" },
          { from: "b", to: "l1", tone: "bad", arrow: true, label: "wants" },
        ],
        vars: vars({ progress: "none, forever" }),
      },
      {
        say: "The standard prevention is a fixed ORDER: everybody takes lock 1 before lock 2, always. Then a cycle cannot form.",
        nodes: [
          node("a", "thread A", 20, 30, "good", "1 then 2"),
          node("b", "thread B", 80, 30, "good", "1 then 2"),
          node("l1", "lock 1", 50, 78, "good", "always first"),
        ],
        edges: [
          { from: "a", to: "l1", tone: "good", arrow: true },
          { from: "b", to: "l1", tone: "ghost", arrow: true, label: "waits" },
        ],
      },
      {
        say: "The better advice is to need fewer locks. Share less, pass messages instead of memory, and keep any lock you do hold as small as you can.",
        rowLabel: "in order of preference",
        row: [
          { v: "1. do not share", tone: "done" },
          { v: "2. share immutable data", tone: "done" },
          { v: "3. send messages", tone: "done" },
          { v: "4. lock, briefly", tone: "done" },
        ],
      },
    ],
  };
}

/** One thread, and what happens when work blocks versus awaits. */
export function traceEventLoop(): Viz {
  const bar = (v: number, tone: Bar["tone"], label?: string): Bar => ({ v, tone, label });

  return {
    title: "Waiting without stopping",
    blurb: "Watch one thread handle three slow requests two ways.",
    frames: [
      {
        say: "Three requests, each needing 100ms of waiting for a network reply and 1ms of actual work.",
        rowLabel: "each request",
        row: [
          { v: "1ms work", tone: "good" },
          { v: "100ms waiting", tone: "compare" },
          { v: "1ms work", tone: "good" },
        ],
        vars: vars({ "CPU actually needed": "2ms" }),
      },
      {
        say: "BLOCKING: the thread starts request one and stops dead until the reply arrives. It is not busy — it is doing nothing at all.",
        rowLabel: "the thread",
        row: [
          { v: "req 1", tone: "good" },
          { v: "idle", tone: "bad" },
          { v: "idle", tone: "bad" },
          { v: "idle", tone: "bad" },
        ],
        vars: vars({ "elapsed": "100ms", "requests done": 0 }),
      },
      {
        say: "Then request two, then three. Three hundred milliseconds, and the CPU was idle for almost all of it.",
        barCap: 300,
        bars: [bar(100, "bad", "req 1"), bar(100, "bad", "req 2"), bar(100, "bad", "req 3")],
        vars: vars({ total: "300ms", "CPU used": "6ms" }),
      },
      {
        say: "ASYNC: the thread starts request one and, instead of waiting, hands control back. It picks up request two immediately.",
        rowLabel: "the thread",
        row: [
          { v: "start 1", tone: "good" },
          { v: "start 2", tone: "good" },
          { v: "start 3", tone: "good" },
          { v: "idle", tone: "compare" },
        ],
        vars: vars({ "in flight": 3, elapsed: "3ms" }),
      },
      {
        say: "All three replies arrive around the same time. The thread finishes each one as it lands.",
        barCap: 300,
        bars: [bar(101, "good", "req 1"), bar(102, "good", "req 2"), bar(103, "good", "req 3")],
        vars: vars({ total: "~103ms", "CPU used": "6ms" }),
      },
      {
        say: "Three times the throughput, on ONE thread, with no locks and no races — because nothing ever ran at the same time as anything else.",
        rowLabel: "what async bought",
        row: [
          { v: "3× throughput", tone: "good" },
          { v: "one thread", tone: "good" },
          { v: "no locks", tone: "good" },
        ],
      },
      {
        say: "The catch is the important part. Async only helps with WAITING. Give that thread a calculation taking 100ms and nothing else runs at all.",
        rowLabel: "one slow calculation",
        row: [
          { v: "computing…", tone: "bad" },
          { v: "everything else waits", tone: "bad" },
        ],
        vars: vars({ rule: "async is for I/O, threads are for CPU" }),
      },
      {
        say: "So the choice is not really async versus threads. It is: am I waiting on the world, or am I working? Waiting wants async. Working wants more cores.",
        gridLabel: "which to reach for",
        grid: [
          [{ v: "async", tone: "good" }, { v: "one thread, many waits", tone: "good" }],
          [{ v: "threads", tone: "good" }, { v: "many cores, real work", tone: "good" }],
          [{ v: "both", tone: "compare" }, { v: "a web server doing real work", tone: "compare" }],
        ],
        gridRowNames: ["network, disk, database", "parsing, maths, images", "in practice"],
        gridColNames: ["use", "why"],
      },
    ],
  };
}

/* ------------------------------------------------------- networking -- */

/** Everything that happens between typing a URL and getting bytes back. */
export function traceRequestLife(): Viz {
  const node = (id: string, label: string, x: number, y: number, tone: Cell["tone"], sub?: string) =>
    ({ id, label, x, y, tone, sub });

  const step = (say: string, hot: number, extra?: Record<string, string | number>): Frame => {
    const names = ["DNS", "TCP", "TLS", "request", "response"];
    return {
      say,
      rowLabel: "one HTTPS request",
      row: names.map((n, i) => ({
        v: n,
        tone: i === hot ? "good" : i < hot ? "done" : "ghost",
      })),
      vars: extra ? vars(extra) : undefined,
    };
  };

  return {
    title: "What one request actually does",
    blurb: "Five separate steps hide behind a single line of code.",
    frames: [
      step("One line of code — get me this URL — and five distinct things have to happen before any bytes come back.", -1),
      step(
        "First, DNS. The name has to become an address, which means asking a resolver, which may ask several more. Usually cached; occasionally 50ms of pure waiting.",
        0,
        { "example.com": "→ 93.184.216.34" },
      ),
      step(
        "Then a TCP connection: a three-way handshake with the server. One full round trip before a single byte of yours is sent.",
        1,
        { cost: "1 round trip" },
      ),
      step(
        "Then TLS, for anything https. Certificates are exchanged and checked, and keys are agreed. Another one or two round trips.",
        2,
        { cost: "1–2 round trips" },
      ),
      step(
        "Only now does your actual request go out — a method, a path, some headers, maybe a body. Text, in the case of HTTP/1.1.",
        3,
        { sent: "GET /api/user HTTP/1.1" },
      ),
      step(
        "And the response comes back: a status code, headers, then the body. Everything before this was setup.",
        4,
        { got: "200 OK, 1.2 KB" },
      ),
      {
        say: "Add it up and the setup often costs more than the transfer. Which is why connection REUSE is the single biggest thing you can do for network performance.",
        rowLabel: "where the time went",
        row: [
          { v: "DNS", i: "~20ms", tone: "bad" },
          { v: "TCP", i: "~40ms", tone: "bad" },
          { v: "TLS", i: "~80ms", tone: "bad" },
          { v: "request", i: "~40ms", tone: "good" },
        ],
        vars: vars({ setup: "140ms", "actual work": "40ms" }),
      },
      {
        say: "A reused connection skips the first three entirely. That is what keep-alive does, and why creating a new HTTP client per request is such a common and costly mistake.",
        rowLabel: "the second request, reusing the connection",
        row: [
          { v: "DNS", i: "skipped", tone: "ghost" },
          { v: "TCP", i: "skipped", tone: "ghost" },
          { v: "TLS", i: "skipped", tone: "ghost" },
          { v: "request", i: "~40ms", tone: "good" },
        ],
        vars: vars({ saved: "140ms per request" }),
      },
      {
        say: "So the rule in every language is the same: create ONE client and reuse it. Not one per request, and not one per function call.",
        nodes: [
          node("c", "one client", 50, 22, "good", "reused"),
          node("a", "request 1", 15, 72, "done"),
          node("b", "request 2", 50, 72, "done"),
          node("d", "request 3", 85, 72, "done"),
        ],
        edges: [
          { from: "c", to: "a", tone: "good", arrow: true },
          { from: "c", to: "b", tone: "good", arrow: true },
          { from: "c", to: "d", tone: "good", arrow: true },
        ],
      },
    ],
  };
}

/** TCP is a stream of bytes, not a sequence of messages. */
export function traceSocketStream(): Viz {
  const code = `send("HELLO");
send("WORLD");

// the other side:
recv(buffer);   // what arrives?`;

  return {
    title: "TCP has no messages",
    blurb: "Watch two sends arrive as one read, and one send arrive as two.",
    code,
    frames: [
      {
        say: "You send two things. It is natural to assume the other side reads two things.",
        rowLabel: "what you sent",
        row: [
          { v: "HELLO", tone: "good" },
          { v: "WORLD", tone: "good" },
        ],
        line: 1,
      },
      {
        say: "TCP does not carry messages. It carries a STREAM of bytes, and it is free to group them however it likes.",
        rowLabel: "what TCP sees",
        row: "HELLOWORLD".split("").map((c) => ({ v: c, tone: "compare" as const })),
        vars: vars({ "message boundaries": "none" }),
      },
      {
        say: "So one read may return both — this is why it is called Nagle-ing, and it is the network being efficient rather than broken.",
        rowLabel: "one recv returns",
        row: [{ v: "HELLOWORLD", tone: "bad", i: "both at once" }],
        line: 5,
      },
      {
        say: "Or the other way. A single send can arrive in pieces, because it was split across packets or the buffer filled.",
        rowLabel: "two recvs return",
        row: [
          { v: "HEL", i: "first read", tone: "bad" },
          { v: "LOWORLD", i: "second read", tone: "bad" },
        ],
        line: 5,
      },
      {
        say: "That is the FRAMING problem, and every protocol built on TCP has to solve it. There are only three answers.",
        rowLabel: "the three answers",
        row: [
          { v: "a delimiter", i: "\\n", tone: "good" },
          { v: "a length prefix", i: "4 bytes", tone: "good" },
          { v: "a fixed size", i: "always 64", tone: "good" },
        ],
      },
      {
        say: "A DELIMITER: read until a newline. Simple, and it means the delimiter can never appear inside the data — which is why so many text protocols need escaping.",
        rowLabel: "delimiter framing",
        row: [
          { v: "HELLO", tone: "good" },
          { v: "\\n", tone: "compare" },
          { v: "WORLD", tone: "good" },
          { v: "\\n", tone: "compare" },
        ],
      },
      {
        say: "A LENGTH PREFIX: send four bytes saying how long, then that many bytes. Handles any data, and is what most binary protocols use.",
        rowLabel: "length-prefixed framing",
        row: [
          { v: "5", i: "length", tone: "compare" },
          { v: "HELLO", tone: "good" },
          { v: "5", i: "length", tone: "compare" },
          { v: "WORLD", tone: "good" },
        ],
      },
      {
        say: "This is also why `recv` returning fewer bytes than you asked for is normal, not an error. You loop until you have a whole frame.",
        rowLabel: "the reading loop",
        row: [
          { v: "read some", tone: "active" },
          { v: "enough for a frame?", tone: "compare" },
          { v: "no → read again", tone: "bad" },
          { v: "yes → handle it", tone: "good" },
        ],
        vars: vars({ rule: "a short read is normal" }),
      },
      {
        say: "HTTP solves it for you: Content-Length says how many bytes, or chunked encoding length-prefixes each piece. Which is one reason to use HTTP rather than invent a protocol.",
        rowLabel: "what HTTP does",
        row: [
          { v: "Content-Length: 1234", tone: "done" },
          { v: "or Transfer-Encoding: chunked", tone: "done" },
        ],
      },
    ],
  };
}

/** Three shapes of server, and what each costs per connection. */
export function traceServerModel(): Viz {
  const bar = (v: number, tone: Bar["tone"], label?: string): Bar => ({ v, tone, label });

  return {
    title: "Three ways to answer at once",
    blurb: "Watch what each connection costs under each model.",
    frames: [
      {
        say: "Ten thousand connections, each mostly idle, each waiting on a database. Three ways to handle them.",
        rowLabel: "the workload",
        row: [
          { v: "10,000 connections", tone: "active" },
          { v: "mostly idle", tone: "compare" },
        ],
      },
      {
        say: "THREAD PER CONNECTION: one OS thread each. The code is simple — read, work, write, in a straight line.",
        rowLabel: "thread per connection",
        row: [
          { v: "simple code", tone: "good" },
          { v: "1 MB stack each", tone: "bad" },
          { v: "10 GB", tone: "bad" },
        ],
        vars: vars({ "at 10,000": "not viable" }),
      },
      {
        say: "It works beautifully up to a few thousand and then falls over — on memory first, and on context switching soon after.",
        barCap: 10,
        bars: [bar(1, "good", "100"), bar(4, "compare", "1k"), bar(10, "bad", "10k")],
        vars: vars({ "memory used": "grows with connections" }),
      },
      {
        say: "EVENT LOOP: one thread, non-blocking sockets, and a readiness call that says which connections have data. Memory per connection is a few kilobytes.",
        rowLabel: "event loop",
        row: [
          { v: "one thread", tone: "good" },
          { v: "a few KB each", tone: "good" },
          { v: "callbacks", tone: "bad" },
        ],
        vars: vars({ "at 10,000": "comfortable" }),
      },
      {
        say: "The cost is in the code. Without async syntax, a request that touches three services becomes a chain of callbacks and a hand-written state machine.",
        rowLabel: "what the code becomes",
        row: [
          { v: "read →", tone: "compare" },
          { v: "callback →", tone: "compare" },
          { v: "callback →", tone: "compare" },
          { v: "callback", tone: "bad" },
        ],
      },
      {
        say: "ASYNC TASKS: an event loop underneath, with language support on top. Each connection is a lightweight task that suspends instead of blocking.",
        rowLabel: "async tasks",
        row: [
          { v: "reads like straight-line code", tone: "good" },
          { v: "a few KB each", tone: "good" },
        ],
        vars: vars({ "at 10,000": "comfortable" }),
      },
      {
        say: "That is what asyncio, tokio, Node and Java's virtual threads all give you: the memory profile of an event loop with the readability of a thread.",
        gridLabel: "per connection",
        grid: [
          [{ v: "~1 MB", tone: "bad" }, { v: "straight-line", tone: "good" }, { v: "hundreds", tone: "bad" }],
          [{ v: "~4 KB", tone: "good" }, { v: "callbacks", tone: "bad" }, { v: "tens of thousands", tone: "good" }],
          [{ v: "~4 KB", tone: "good" }, { v: "straight-line", tone: "good" }, { v: "tens of thousands", tone: "good" }],
        ],
        gridRowNames: ["thread each", "event loop", "async tasks"],
        gridColNames: ["memory", "how it reads", "practical limit"],
      },
      {
        say: "One caveat that applies to all three: none of it helps if the work itself is slow. A 200ms query is 200ms however you waited for it.",
        rowLabel: "what none of this fixes",
        row: [
          { v: "a slow query", tone: "bad" },
          { v: "a slow algorithm", tone: "bad" },
          { v: "an overloaded database", tone: "bad" },
        ],
      },
    ],
  };
}

/* -------------------------------------------------------- databases -- */

/** Why building a query by joining strings is the classic security hole. */
export function traceInjection(): Viz {
  const code = `name = input()

query = "SELECT * FROM users WHERE name = '" + name + "'"

db.execute(query)`;

  return {
    title: "Where the query ends and the data begins",
    blurb: "Watch a user's input stop being data and become part of the command.",
    code,
    frames: [
      {
        say: "A query built by joining strings. It works perfectly for ordinary input.",
        rowLabel: "name = \"ada\"",
        row: [
          { v: "SELECT * FROM users WHERE name = '", tone: "active" },
          { v: "ada", tone: "good" },
          { v: "'", tone: "active" },
        ],
        line: 3,
        vars: vars({ result: "one row" }),
      },
      {
        say: "Now someone types a quote. That quote does not stay inside the value — it CLOSES the string the query was building.",
        rowLabel: "name = \"' OR '1'='1\"",
        row: [
          { v: "SELECT * FROM users WHERE name = '", tone: "active" },
          { v: "'", tone: "bad", i: "closes it" },
          { v: " OR '1'='1", tone: "bad", i: "now it is SQL" },
          { v: "'", tone: "active" },
        ],
        line: 3,
      },
      {
        say: "The database receives `WHERE name = '' OR '1'='1'`. That is true for every row, so it returns the whole table.",
        rowLabel: "what the database ran",
        row: [
          { v: "WHERE name = ''", tone: "ghost" },
          { v: "OR", tone: "bad" },
          { v: "'1'='1'", tone: "bad", i: "always true" },
        ],
        line: 5,
        vars: vars({ result: "every row" }),
      },
      {
        say: "It gets worse. A semicolon can end the statement and start another one entirely.",
        rowLabel: "name = \"'; DROP TABLE users; --\"",
        row: [
          { v: "…name = ''", tone: "ghost" },
          { v: ";", tone: "bad", i: "ends it" },
          { v: "DROP TABLE users", tone: "bad", i: "a new command" },
          { v: "--", tone: "bad", i: "comments out the rest" },
        ],
      },
      {
        say: "The root cause is not the quote. It is that the query and the data travelled together as ONE string, so nothing could tell them apart.",
        rowLabel: "one string",
        row: [
          { v: "query + data", tone: "bad", i: "indistinguishable" },
        ],
        vars: vars({ "the real bug": "no boundary" }),
      },
      {
        say: "A PARAMETERISED query sends them separately. The SQL goes first, with a placeholder where the value belongs.",
        rowLabel: "sent first",
        row: [
          { v: "SELECT * FROM users WHERE name = ?", tone: "good" },
        ],
        vars: vars({ "the database now knows": "the shape of the query" }),
      },
      {
        say: "Then the value is sent separately, as data. The database has already parsed the query — the value cannot change its shape, whatever it contains.",
        rowLabel: "sent separately",
        row: [
          { v: "'; DROP TABLE users; --", tone: "good", i: "just a name" },
        ],
        vars: vars({ "treated as": "a value, always" }),
      },
      {
        say: "So it searches for a user literally called that, finds none, and returns nothing. The attack becomes an ordinary failed lookup.",
        rowLabel: "the result",
        row: [{ v: "0 rows", tone: "done" }],
        out: "0 rows",
      },
      {
        say: "Two things to remember. Escaping is not the fix — placeholders are. And placeholders work for VALUES only: a table or column name cannot be parameterised, so those must come from a list you control.",
        rowLabel: "the rule",
        row: [
          { v: "values → placeholders", tone: "good" },
          { v: "table/column names → an allowlist", tone: "compare" },
        ],
      },
    ],
  };
}

/** Why a connection pool exists, and what happens without one. */
export function tracePool(): Viz {
  const bar = (v: number, tone: Bar["tone"], label?: string): Bar => ({ v, tone, label });

  return {
    title: "The connection you keep",
    blurb: "Watch what opening a fresh connection actually costs.",
    frames: [
      {
        say: "Opening a database connection is not cheap. It is a TCP handshake, usually TLS, then authentication, then session setup.",
        rowLabel: "opening one connection",
        row: [
          { v: "TCP", tone: "bad" },
          { v: "TLS", tone: "bad" },
          { v: "auth", tone: "bad" },
          { v: "session setup", tone: "bad" },
        ],
        vars: vars({ typical: "20–100ms" }),
      },
      {
        say: "Your query takes 2ms. So a connection opened and closed per query spends fifty times longer connecting than working.",
        barCap: 100,
        bars: [bar(50, "bad", "connect"), bar(2, "good", "query"), bar(10, "bad", "close")],
        vars: vars({ "useful work": "3%" }),
      },
      {
        say: "A POOL keeps connections open and lends them out. A query borrows one, uses it, and returns it — the setup happened once.",
        nodes: [
          { id: "p", label: "the pool", x: 50, y: 20, tone: "good", sub: "10 open connections" },
          { id: "a", label: "request 1", x: 18, y: 72, tone: "active" },
          { id: "b", label: "request 2", x: 50, y: 72, tone: "active" },
          { id: "c", label: "request 3", x: 82, y: 72, tone: "active" },
        ],
        edges: [
          { from: "a", to: "p", tone: "good", arrow: true, label: "borrow" },
          { from: "b", to: "p", tone: "good", arrow: true },
          { from: "c", to: "p", tone: "good", arrow: true },
        ],
      },
      {
        say: "Now the same query costs 2ms. That is the whole reason every database library has a pool, and why you create it once at startup.",
        barCap: 100,
        bars: [bar(0, "ghost", "connect"), bar(2, "good", "query"), bar(0, "ghost", "close")],
        vars: vars({ "useful work": "100%" }),
      },
      {
        say: "The size matters in both directions. Too small and requests queue waiting for a connection.",
        rowLabel: "pool too small",
        row: [
          { v: "2 connections", tone: "bad" },
          { v: "50 requests waiting", tone: "bad" },
        ],
      },
      {
        say: "Too large and you exhaust the DATABASE. Postgres defaults to about 100 connections total, and each one costs it memory — so ten application instances with a pool of 50 each is 500, and the database refuses.",
        rowLabel: "pool too large",
        row: [
          { v: "10 instances", tone: "compare" },
          { v: "× 50 each", tone: "compare" },
          { v: "= 500", tone: "bad", i: "limit is 100" },
        ],
        vars: vars({ symptom: "too many connections" }),
      },
      {
        say: "A useful starting point is small — often smaller than people expect. A pool of about twice your core count usually beats a pool of fifty, because the database is the bottleneck, not the waiting.",
        rowLabel: "a starting point",
        row: [
          { v: "cores × 2", tone: "good" },
          { v: "then measure", tone: "done" },
        ],
      },
      {
        say: "And the failure to guard against: a borrowed connection never returned. Leak a few and the pool empties, every request queues, and the application stops with no error anywhere.",
        rowLabel: "a leaked connection",
        row: [
          { v: "borrowed", tone: "bad" },
          { v: "never returned", tone: "bad" },
          { v: "pool empties", tone: "bad" },
        ],
        vars: vars({ fix: "release it in a finally, or use the scoped form" }),
      },
    ],
  };
}

/** The N+1 query problem, and what it costs. */
export function traceNPlusOne(): Viz {
  const bar = (v: number, tone: Bar["tone"], label?: string): Bar => ({ v, tone, label });

  return {
    title: "One query, then a hundred more",
    blurb: "Watch a loop turn one page load into a hundred round trips.",
    frames: [
      {
        say: "Show 100 posts, each with its author's name. The obvious code fetches the posts, then loops.",
        rowLabel: "the obvious code",
        row: [
          { v: "get posts", tone: "good" },
          { v: "for each post:", tone: "compare" },
          { v: "get its author", tone: "bad" },
        ],
      },
      {
        say: "That is 1 query for the posts, then 100 more — one per post. Hence the name.",
        rowLabel: "queries sent",
        row: [
          { v: "1", i: "posts", tone: "good" },
          { v: "+ 100", i: "authors", tone: "bad" },
          { v: "= 101", tone: "bad" },
        ],
        vars: vars({ pattern: "N + 1" }),
      },
      {
        say: "Each query is fast — maybe 1ms of database work. The problem is the ROUND TRIP: about 5ms of network each way, whatever the query does.",
        barCap: 6,
        bars: [bar(1, "good", "db work"), bar(5, "bad", "round trip")],
        vars: vars({ "per query": "6ms, mostly waiting" }),
      },
      {
        say: "101 round trips at 6ms is 600ms. On a page that should take 10ms.",
        barCap: 600,
        bars: [bar(600, "bad", "N+1"), bar(12, "good", "what it could be")],
      },
      {
        say: "The first fix is a JOIN: ask for the posts and their authors in one query, and let the database do the matching.",
        rowLabel: "one query with a join",
        row: [
          { v: "SELECT ... FROM posts", tone: "good" },
          { v: "JOIN users ON ...", tone: "good" },
        ],
        vars: vars({ queries: 1, elapsed: "~8ms" }),
      },
      {
        say: "The second is to BATCH: collect all the author ids first, fetch them in one query with an IN clause, then match them up in your own code.",
        rowLabel: "two queries",
        row: [
          { v: "get posts", tone: "good" },
          { v: "get authors WHERE id IN (…)", tone: "good" },
          { v: "match in code", tone: "compare" },
        ],
        vars: vars({ queries: 2, elapsed: "~14ms" }),
      },
      {
        say: "Both are fine. The join is fewer round trips; the batch keeps the queries simple and avoids duplicating post data across joined rows.",
        gridLabel: "the two fixes",
        grid: [
          [{ v: "1", tone: "good" }, { v: "duplicated post columns", tone: "compare" }],
          [{ v: "2", tone: "good" }, { v: "matching done in your code", tone: "compare" }],
          [{ v: "101", tone: "bad" }, { v: "none — it is just slow", tone: "bad" }],
        ],
        gridRowNames: ["join", "batch", "N+1"],
        gridColNames: ["round trips", "the cost"],
      },
      {
        say: "This is the most common database performance bug there is, and ORMs make it easy to write by accident — a field access that quietly issues a query looks exactly like a field access.",
        rowLabel: "why it hides",
        row: [
          { v: "post.author.name", tone: "bad", i: "looks free" },
          { v: "→ a query", tone: "bad", i: "is not" },
        ],
        vars: vars({ fix: "eager loading, and log your queries" }),
      },
    ],
  };
}

/* ---------------------------------------------- software engineering -- */

/** What a test is made of, and which tests to write more of. */
export function traceTestShape(): Viz {
  const code = `test("withdrawing reduces the balance", () => {
  const account = new Account(100);   // arrange

  account.withdraw(30);               // act

  expect(account.balance).toBe(70);   // assert
});`;

  return {
    title: "Arrange, act, assert",
    blurb: "Three parts, and one reason each test exists.",
    code,
    frames: [
      {
        say: "Every test worth reading has the same three parts, in the same order.",
        rowLabel: "the shape",
        row: [
          { v: "arrange", i: "set it up", tone: "active" },
          { v: "act", i: "do the thing", tone: "good" },
          { v: "assert", i: "check it", tone: "compare" },
        ],
      },
      {
        say: "ARRANGE builds the world the test needs. Keep it small — a test needing thirty lines of setup is usually testing something that does too much.",
        rowLabel: "arrange",
        row: [{ v: "new Account(100)", tone: "active" }],
        line: 2,
      },
      {
        say: "ACT is the one thing being tested. If there are two, it is two tests.",
        rowLabel: "act",
        row: [{ v: "account.withdraw(30)", tone: "good" }],
        line: 4,
      },
      {
        say: "ASSERT checks the outcome. One idea per test — several assertions about that one idea is fine, several unrelated ideas is not.",
        rowLabel: "assert",
        row: [{ v: "balance is 70", tone: "compare" }],
        line: 6,
      },
      {
        say: "The name is part of the test. \"withdrawing reduces the balance\" tells you what broke without reading the body; \"test1\" tells you nothing.",
        rowLabel: "the failure message you want",
        row: [
          { v: "test1 failed", tone: "bad" },
          { v: "withdrawing reduces the balance — failed", tone: "good" },
        ],
      },
      {
        say: "Now which tests to write. UNIT tests are small, fast and numerous — one function, no database, no network. Thousands of them run in seconds.",
        barCap: 100,
        bars: [
          { v: 70, tone: "good", label: "unit" },
          { v: 20, tone: "compare", label: "integration" },
          { v: 5, tone: "bad", label: "end to end" },
        ],
        vars: vars({ "how many": "most", speed: "milliseconds" }),
      },
      {
        say: "INTEGRATION tests check that pieces work together — your code plus a real database, usually. Slower, fewer, and they catch what unit tests cannot.",
        barCap: 100,
        bars: [
          { v: 70, tone: "ghost", label: "unit" },
          { v: 20, tone: "good", label: "integration" },
          { v: 5, tone: "ghost", label: "end to end" },
        ],
        vars: vars({ "how many": "some", speed: "seconds" }),
      },
      {
        say: "END TO END tests drive the whole system as a user would. They catch the most and they are slow, brittle and expensive — so a handful covering the critical paths.",
        barCap: 100,
        bars: [
          { v: 70, tone: "ghost", label: "unit" },
          { v: 20, tone: "ghost", label: "integration" },
          { v: 5, tone: "good", label: "end to end" },
        ],
        vars: vars({ "how many": "a handful", speed: "minutes" }),
      },
      {
        say: "The proportions matter more than the labels. Many fast tests and a few slow ones means you find most bugs in seconds — and the inverse means nobody runs the suite.",
        rowLabel: "the rule",
        row: [
          { v: "fast tests, many", tone: "done" },
          { v: "slow tests, few", tone: "done" },
          { v: "run them on every commit", tone: "done" },
        ],
      },
    ],
  };
}

/** The tool pipeline, in order, and what each one catches. */
export function traceToolchain(): Viz {
  const stages = ["format", "lint", "types", "test", "build"];

  const frame = (say: string, hot: number, extra?: Record<string, string | number>): Frame => ({
    say,
    rowLabel: "the pipeline",
    row: stages.map((s, i) => ({
      v: s,
      tone: i === hot ? "good" : i < hot ? "done" : "ghost",
    })),
    vars: extra ? vars(extra) : undefined,
  });

  return {
    title: "Five tools, in order",
    blurb: "Each one catches something the next cannot.",
    frames: [
      frame("Five checks, and the order matters: each is faster than the next and catches different things.", -1),
      frame(
        "FORMAT first. A formatter makes the layout uniform so nobody argues about it and diffs show real changes rather than reindentation.",
        0,
        { catches: "nothing", saves: "every formatting argument" },
      ),
      frame(
        "LINT second. A linter finds suspicious patterns: an unused variable, a comparison that is always true, a missing await. Fast, and it catches real bugs.",
        1,
        { catches: "suspicious patterns" },
      ),
      frame(
        "TYPES third, where the language has them. A type checker catches whole categories at once — a wrong argument, a missing case, a null that could reach here.",
        2,
        { catches: "wrong shapes" },
      ),
      frame(
        "TESTS fourth. These catch wrong BEHAVIOUR, which nothing above them can see. A function with perfect types can still compute the wrong answer.",
        3,
        { catches: "wrong behaviour" },
      ),
      frame(
        "BUILD last. It is the slowest, and there is no point building code that failed anything above.",
        4,
        { catches: "the rest" },
      ),
      {
        say: "Run all of it on every commit, automatically. A check that only runs when someone remembers is a check that does not run.",
        rowLabel: "the pipeline",
        row: stages.map((s) => ({ v: s, tone: "done" as const })),
        vars: vars({ where: "CI, on every push" }),
      },
      {
        say: "And run the fast ones locally, before the commit — a pre-commit hook that formats and lints costs a second and saves a round trip through CI.",
        rowLabel: "locally, before committing",
        row: [
          { v: "format", tone: "good" },
          { v: "lint", tone: "good" },
          { v: "types", tone: "compare" },
          { v: "test", tone: "ghost", i: "in CI" },
          { v: "build", tone: "ghost", i: "in CI" },
        ],
      },
      {
        say: "Every language here has all five. What differs is whether they are one tool or five, and whether the community agreed on which.",
        gridLabel: "one tool, or five",
        grid: [
          [{ v: "clang-format", tone: "good" }, { v: "clang-tidy", tone: "good" }, { v: "the compiler", tone: "good" }],
          [{ v: "ruff format", tone: "good" }, { v: "ruff", tone: "good" }, { v: "mypy", tone: "compare" }],
          [{ v: "spotless", tone: "compare" }, { v: "the compiler", tone: "good" }, { v: "the compiler", tone: "good" }],
          [{ v: "prettier", tone: "good" }, { v: "eslint", tone: "good" }, { v: "tsc", tone: "compare" }],
          [{ v: "cargo fmt", tone: "good" }, { v: "cargo clippy", tone: "good" }, { v: "the compiler", tone: "good" }],
        ],
        gridRowNames: ["C++", "Python", "Java", "JavaScript", "Rust"],
        gridColNames: ["format", "lint", "types"],
      },
    ],
  };
}

/** How to actually find a bug, rather than guessing at it. */
export function traceBisect(): Viz {
  const node = (id: string, label: string, x: number, y: number, tone: Cell["tone"], sub?: string) =>
    ({ id, label, x, y, tone, sub });

  return {
    title: "Finding it instead of guessing",
    blurb: "Four steps, and the first one is the one people skip.",
    frames: [
      {
        say: "A bug report says the total is sometimes wrong. The temptation is to read the code and guess. That is the slowest way.",
        rowLabel: "the guessing loop",
        row: [
          { v: "read", tone: "bad" },
          { v: "guess", tone: "bad" },
          { v: "change", tone: "bad" },
          { v: "hope", tone: "bad" },
        ],
      },
      {
        say: "Step one, and the one people skip: REPRODUCE it. A bug you cannot trigger on demand is a bug you cannot know you have fixed.",
        rowLabel: "1. reproduce",
        row: [
          { v: "make it happen", tone: "good" },
          { v: "reliably", tone: "good" },
          { v: "on demand", tone: "good" },
        ],
        vars: vars({ "without this": "you are guessing" }),
      },
      {
        say: "Step two: NARROW it. Cut the input down until it is the smallest thing that still fails. Half the time the cause becomes obvious while you are doing this.",
        rowLabel: "2. narrow",
        row: [
          { v: "10,000 rows", tone: "bad" },
          { v: "→ 100", tone: "compare" },
          { v: "→ 3", tone: "good" },
          { v: "→ 1", tone: "good" },
        ],
      },
      {
        say: "Step three: BISECT. If it used to work, git bisect finds the exact commit that broke it in about ten steps out of a thousand.",
        nodes: [
          node("a", "1000 commits", 50, 15, "compare"),
          node("b", "500", 25, 45, "compare"),
          node("c", "250", 60, 45, "compare"),
          node("d", "the one", 45, 78, "good"),
        ],
        edges: [
          { from: "a", to: "b", tone: "ghost", arrow: true },
          { from: "b", to: "c", tone: "ghost", arrow: true },
          { from: "c", to: "d", tone: "good", arrow: true },
        ],
        vars: vars({ steps: "about 10" }),
      },
      {
        say: "Step four: OBSERVE. Use a debugger or add logging, and look at what the values actually are rather than what you assume they are.",
        rowLabel: "4. observe",
        row: [
          { v: "what you assumed", tone: "bad", i: "n = 5" },
          { v: "what it is", tone: "good", i: "n = -1" },
        ],
      },
      {
        say: "Then write a TEST that fails, before fixing anything. Now you know when it is fixed, and the bug cannot come back unnoticed.",
        rowLabel: "before the fix",
        row: [
          { v: "a failing test", tone: "good" },
          { v: "then the fix", tone: "good" },
          { v: "then it passes", tone: "done" },
        ],
      },
      {
        say: "One more habit for the hard ones: PRINT THE ASSUMPTION. Most long debugging sessions end with something that was obviously true turning out not to be.",
        rowLabel: "things that were obviously true",
        row: [
          { v: "the list is sorted", tone: "bad" },
          { v: "the id is unique", tone: "bad" },
          { v: "this runs once", tone: "bad" },
        ],
      },
      {
        say: "And for performance, the same discipline: MEASURE before changing anything. The slow part is almost never where you think it is.",
        rowLabel: "where the time went",
        row: [
          { v: "where you looked", i: "2%", tone: "bad" },
          { v: "where it was", i: "94%", tone: "good" },
        ],
        vars: vars({ rule: "profile, then optimise" }),
      },
    ],
  };
}

/* ----------------------------------------------------- architecture -- */

/** Dependencies pointing one way, and what a cycle costs. */
export function traceLayers(): Viz {
  const node = (id: string, label: string, x: number, y: number, tone: Cell["tone"], sub?: string) =>
    ({ id, label, x, y, tone, sub });

  return {
    title: "Which way the arrows point",
    blurb: "Watch one arrow pointing the wrong way turn three pieces into one.",
    frames: [
      {
        say: "Three layers. The web layer handles requests, the service layer holds the rules, and the storage layer talks to the database.",
        nodes: [
          node("w", "web", 50, 15, "active", "requests"),
          node("s", "service", 50, 48, "active", "the rules"),
          node("d", "storage", 50, 82, "active", "the database"),
        ],
        edges: [
          { from: "w", to: "s", tone: "good", arrow: true },
          { from: "s", to: "d", tone: "good", arrow: true },
        ],
      },
      {
        say: "The arrows all point one way, and that is the whole idea. Storage knows nothing about services; services know nothing about HTTP.",
        nodes: [
          node("w", "web", 50, 15, "ghost"),
          node("s", "service", 50, 48, "ghost"),
          node("d", "storage", 50, 82, "good", "knows nothing above it"),
        ],
        edges: [
          { from: "w", to: "s", tone: "ghost", arrow: true },
          { from: "s", to: "d", tone: "ghost", arrow: true },
        ],
        vars: vars({ "can storage be tested alone?": "yes" }),
      },
      {
        say: "So each layer can be understood, tested and replaced on its own. Swap the database and only storage changes.",
        nodes: [
          node("w", "web", 50, 15, "ghost"),
          node("s", "service", 50, 48, "ghost"),
          node("d", "a different database", 50, 82, "good", "only this changed"),
        ],
        edges: [
          { from: "w", to: "s", tone: "ghost", arrow: true },
          { from: "s", to: "d", tone: "good", arrow: true },
        ],
      },
      {
        say: "Now somebody adds one arrow pointing back — storage needs to send an email, so it calls the service layer.",
        nodes: [
          node("w", "web", 50, 15, "ghost"),
          node("s", "service", 50, 48, "bad"),
          node("d", "storage", 50, 82, "bad"),
        ],
        edges: [
          { from: "w", to: "s", tone: "ghost", arrow: true },
          { from: "s", to: "d", tone: "bad", arrow: true },
          { from: "d", to: "s", tone: "bad", arrow: true, label: "just this once" },
        ],
      },
      {
        say: "Those two are now ONE thing. You cannot understand either without the other, you cannot test either alone, and you cannot replace either.",
        nodes: [
          node("w", "web", 50, 18, "ghost"),
          node("m", "service + storage", 50, 65, "bad", "one tangled piece"),
        ],
        edges: [{ from: "w", to: "m", tone: "ghost", arrow: true }],
        vars: vars({ "pieces": 2, "things you can reason about": 1 }),
      },
      {
        say: "The fix is to INVERT the arrow. Storage declares what it needs — an interface — and something above provides it.",
        nodes: [
          node("s", "service", 50, 18, "good"),
          node("d", "storage", 25, 60, "good"),
          node("i", "Notifier", 75, 60, "compare", "an interface storage owns"),
        ],
        edges: [
          { from: "d", to: "i", tone: "good", arrow: true, label: "needs" },
          { from: "s", to: "i", tone: "good", arrow: true, label: "provides" },
        ],
      },
      {
        say: "Now both point at the interface and neither points at the other. That is dependency inversion, and it is what the word means.",
        nodes: [
          node("s", "service", 50, 18, "done"),
          node("d", "storage", 25, 60, "done"),
          node("i", "Notifier", 75, 60, "good", "both depend on this"),
        ],
        edges: [
          { from: "d", to: "i", tone: "done", arrow: true },
          { from: "s", to: "i", tone: "done", arrow: true },
        ],
      },
      {
        say: "The practical test is simple and it does not need a diagram: can you draw your dependencies without a loop? If not, that loop is where the pain will be.",
        rowLabel: "the test",
        row: [
          { v: "draw the arrows", tone: "done" },
          { v: "is there a loop?", tone: "done" },
          { v: "that is the problem", tone: "done" },
        ],
      },
    ],
  };
}

/** What crosses a boundary, and why it should not be your internal type. */
export function traceBoundary(): Viz {
  const node = (id: string, label: string, x: number, y: number, tone: Cell["tone"], sub?: string) =>
    ({ id, label, x, y, tone, sub });

  return {
    title: "What crosses the line",
    blurb: "Watch an internal field become part of a public API by accident.",
    frames: [
      {
        say: "Your User type has a name, an email, a password hash and an internal risk score. The API returns User.",
        rowLabel: "the internal User",
        row: [
          { v: "name", tone: "good" },
          { v: "email", tone: "good" },
          { v: "password_hash", tone: "bad" },
          { v: "risk_score", tone: "bad" },
        ],
      },
      {
        say: "Two of those fields just left the building. Serialising your internal type means every field is public, including the ones you never thought about.",
        nodes: [
          node("i", "internal User", 25, 30, "bad"),
          node("o", "the outside world", 78, 30, "bad", "has your password hashes"),
        ],
        edges: [{ from: "i", to: "o", tone: "bad", arrow: true, label: "everything" }],
      },
      {
        say: "And it works the other way too. Rename an internal field and every client breaks, because your internals were the contract.",
        nodes: [
          node("i", "renamed a field", 25, 30, "bad"),
          node("o", "every client", 78, 30, "bad", "broken"),
        ],
        edges: [{ from: "i", to: "o", tone: "bad", arrow: true, label: "breaks" }],
      },
      {
        say: "The fix is a separate type for the boundary — a DTO, a view model, a response type. It contains exactly what you meant to expose.",
        rowLabel: "the response type",
        row: [
          { v: "name", tone: "good" },
          { v: "email", tone: "good" },
        ],
        vars: vars({ fields: 2, "internal fields exposed": 0 }),
      },
      {
        say: "It looks like duplication and it is not. The two types answer different questions: one is how you store it, the other is what you promised.",
        nodes: [
          node("i", "internal User", 25, 25, "active", "how you store it"),
          node("d", "UserResponse", 75, 25, "good", "what you promised"),
          node("m", "a mapping", 50, 72, "compare", "one small function"),
        ],
        edges: [
          { from: "i", to: "m", tone: "active", arrow: true },
          { from: "m", to: "d", tone: "good", arrow: true },
        ],
      },
      {
        say: "Now they change independently. Rename an internal field and only the mapping changes; add a public field and only the response type changes.",
        rowLabel: "what a rename touches",
        row: [
          { v: "the internal type", tone: "compare" },
          { v: "the mapping", tone: "compare" },
          { v: "clients", tone: "good", i: "nothing" },
        ],
      },
      {
        say: "The same boundary in the other direction is where VALIDATION belongs. Data arriving from outside is not your type until it has been checked.",
        nodes: [
          node("r", "raw input", 15, 40, "bad", "unknown shape"),
          node("v", "validate", 50, 40, "compare", "the boundary"),
          node("t", "your type", 85, 40, "good", "trusted"),
        ],
        edges: [
          { from: "r", to: "v", tone: "bad", arrow: true },
          { from: "v", to: "t", tone: "good", arrow: true },
        ],
      },
      {
        say: "Inside the boundary you trust your types. At it, you check. That one rule removes most of the defensive code from the middle of a program.",
        rowLabel: "the rule",
        row: [
          { v: "validate AT the edge", tone: "done" },
          { v: "trust INSIDE it", tone: "done" },
        ],
      },
    ],
  };
}

/** What to do when it gets big — and the cost of each step. */
export function traceScaling(): Viz {
  const node = (id: string, label: string, x: number, y: number, tone: Cell["tone"], sub?: string) =>
    ({ id, label, x, y, tone, sub });

  return {
    title: "When it gets big",
    blurb: "Three steps, each solving a problem and buying a new one.",
    frames: [
      {
        say: "One program, one deployment, one database. Everything is a function call away, and this is where every system should start.",
        nodes: [node("m", "one program", 50, 45, "good", "everything in it")],
        vars: vars({ "call cost": "nanoseconds", "deploys": 1 }),
      },
      {
        say: "It grows. Now it is hard to find anything, two teams keep colliding in the same files, and nobody is sure what depends on what.",
        nodes: [node("m", "one large program", 50, 45, "bad", "everything tangled")],
        vars: vars({ problem: "no boundaries inside it" }),
      },
      {
        say: "Step one: MODULES. Same program, same deployment — but with real boundaries inside it, and dependencies that point one way.",
        nodes: [
          node("a", "orders", 22, 40, "good"),
          node("b", "billing", 52, 40, "good"),
          node("c", "shared", 38, 82, "compare"),
          node("d", "shipping", 82, 40, "good"),
        ],
        edges: [
          { from: "a", to: "c", tone: "good", arrow: true },
          { from: "b", to: "c", tone: "good", arrow: true },
          { from: "d", to: "c", tone: "good", arrow: true },
        ],
        vars: vars({ "call cost": "still nanoseconds", "deploys": 1 }),
      },
      {
        say: "That is almost always the right step, and it is almost always skipped. It costs nothing at run time and solves most of the problem.",
        rowLabel: "what modules cost",
        row: [
          { v: "no network", tone: "good" },
          { v: "no serialisation", tone: "good" },
          { v: "one deployment", tone: "good" },
          { v: "one transaction", tone: "good" },
        ],
      },
      {
        say: "Step two: SERVICES, when the problem is genuinely organisational — different teams, different release cycles, different scaling needs.",
        nodes: [
          node("a", "orders", 22, 30, "active", "team A"),
          node("b", "billing", 55, 30, "active", "team B"),
          node("d", "shipping", 85, 30, "active", "team C"),
          node("n", "the network", 50, 78, "bad", "now between them"),
        ],
        edges: [
          { from: "a", to: "n", tone: "bad", arrow: true },
          { from: "b", to: "n", tone: "bad", arrow: true },
          { from: "d", to: "n", tone: "bad", arrow: true },
        ],
      },
      {
        say: "And every function call between them is now a network call. Which means it can fail, it can be slow, it can arrive twice, and it can succeed while the reply is lost.",
        rowLabel: "what a call across the network can now do",
        row: [
          { v: "fail", tone: "bad" },
          { v: "be slow", tone: "bad" },
          { v: "arrive twice", tone: "bad" },
          { v: "succeed silently", tone: "bad" },
        ],
      },
      {
        say: "The transaction goes too. Two services with two databases cannot commit together, so 'both or neither' becomes your problem to implement.",
        rowLabel: "what you lose",
        row: [
          { v: "one transaction", tone: "bad", i: "gone" },
          { v: "one deploy", tone: "bad", i: "gone" },
          { v: "a stack trace", tone: "bad", i: "gone" },
        ],
        vars: vars({ "you now need": "tracing, retries, idempotency" }),
      },
      {
        say: "So the order matters: get the modules right first. A well-separated module can become a service in an afternoon; a tangled one cannot become anything.",
        nodes: [
          node("a", "a clean module", 25, 35, "good"),
          node("b", "a service", 75, 35, "good", "an afternoon"),
          node("c", "a tangled module", 25, 80, "bad"),
          node("d", "nothing", 75, 80, "bad", "not extractable"),
        ],
        edges: [
          { from: "a", to: "b", tone: "good", arrow: true },
          { from: "c", to: "d", tone: "bad", arrow: true },
        ],
      },
      {
        say: "And the honest summary: most systems that split into services would have been better off with modules, and knew it about a year later.",
        rowLabel: "the order to try things",
        row: [
          { v: "1. one program", tone: "done" },
          { v: "2. modules inside it", tone: "done" },
          { v: "3. services, if you must", tone: "done" },
        ],
      },
    ],
  };
}

/** What threads share, what they do not, and what each one costs. */
export function traceThreadMemory(): Viz {
  const node = (id: string, label: string, x: number, y: number, tone: Cell["tone"], sub?: string) =>
    ({ id, label, x, y, tone, sub });

  return {
    title: "What a thread brings, and what it shares",
    blurb: "One private thing, one shared thing, and a cost per thread.",
    frames: [
      {
        say: "One program, one thread. It has a stack for its locals and a heap for everything else.",
        nodes: [
          node("t", "thread 1", 50, 20, "active"),
          node("s", "its stack", 25, 68, "good", "locals"),
          node("h", "the heap", 75, 68, "good", "everything else"),
        ],
        edges: [
          { from: "t", to: "s", tone: "good", arrow: true },
          { from: "t", to: "h", tone: "good", arrow: true },
        ],
      },
      {
        say: "Start a second thread. It gets its OWN stack — so locals stay private, and no thread can see another's.",
        nodes: [
          node("a", "thread 1", 25, 18, "active"),
          node("b", "thread 2", 75, 18, "active"),
          node("s1", "stack 1", 15, 60, "good", "private"),
          node("s2", "stack 2", 55, 60, "good", "private"),
          node("h", "the heap", 88, 60, "compare"),
        ],
        edges: [
          { from: "a", to: "s1", tone: "good", arrow: true },
          { from: "b", to: "s2", tone: "good", arrow: true },
        ],
      },
      {
        say: "But the HEAP is shared. Every global, every allocation, every object is visible to both — with no synchronisation at all.",
        nodes: [
          node("a", "thread 1", 25, 18, "compare"),
          node("b", "thread 2", 75, 18, "compare"),
          node("h", "the heap", 50, 68, "bad", "shared by both"),
        ],
        edges: [
          { from: "a", to: "h", tone: "bad", arrow: true },
          { from: "b", to: "h", tone: "bad", arrow: true },
        ],
        vars: vars({ "shared": "everything on the heap" }),
      },
      {
        say: "That is what makes threads fast to communicate — there is nothing to send. And it is exactly what makes them dangerous.",
        rowLabel: "the same fact, twice",
        row: [
          { v: "no copying between them", tone: "good" },
          { v: "no protection either", tone: "bad" },
        ],
      },
      {
        say: "Now the cost. A platform thread reserves about a megabyte of stack and needs a system call to create.",
        barCap: 10,
        bars: [
          { v: 1, tone: "good", label: "100" },
          { v: 4, tone: "compare", label: "1,000" },
          { v: 10, tone: "bad", label: "10,000" },
        ],
        vars: vars({ "10,000 threads": "about 10 GB of stack" }),
      },
      {
        say: "So thousands of threads is a design mistake rather than a scaling strategy. The operating system also spends real time switching between them.",
        rowLabel: "where it breaks down",
        row: [
          { v: "memory first", tone: "bad" },
          { v: "then context switching", tone: "bad" },
        ],
      },
      {
        say: "Which is why the answer for many mostly-idle connections is not more threads. A POOL reuses a few, and async or virtual threads make each one cost kilobytes instead.",
        rowLabel: "instead of a thread each",
        row: [
          { v: "a pool", i: "reuse a few", tone: "good" },
          { v: "async tasks", i: "a few KB each", tone: "good" },
          { v: "virtual threads", i: "a few hundred bytes", tone: "good" },
        ],
      },
      {
        say: "The rule that follows: use threads to use more CORES, and use async to wait on more THINGS. Those are different problems.",
        rowLabel: "which to reach for",
        row: [
          { v: "more cores → threads", tone: "done" },
          { v: "more waiting → async", tone: "done" },
        ],
      },
    ],
  };
}
