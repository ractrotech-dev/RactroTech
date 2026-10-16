import type { ChapterAlt } from "@/lib/dsa/lessons/i18n";

// Array & String: all seven sections.
// Only the code changes. The explanation above it is the same for everyone.

export const ARRAY_STRING_ALT: ChapterAlt = {
  /* ------------------------------------------------------------ index -- */
  index: {
    c: {
      example: `int a[5] = {7, 2, 9, 1, 4};

printf("%d", a[0]);   /* 7  — first box */
printf("%d", a[4]);   /* 4  — last box, index 4 not 5 */
printf("%d", a[5]);   /* garbage. C will not stop you */

/* the length, worked out from the array itself */
int n = sizeof(a) / sizeof(a[0]);   /* 5 */`,
      notes: [
        { token: "a[0]", meaning: "the first box — counting starts at zero" },
        { token: "a[4]", meaning: "the last box of five" },
        { token: "sizeof(a) / sizeof(a[0])", meaning: "total bytes divided by one box's bytes" },
        { token: "pass it to a function", meaning: "and that trick stops working — send the length too" },
      ],
      vizCode: `int a[5] = {7, 2, 9, 1, 4};
printf("%d", a[0]);
printf("%d", a[2]);
printf("%d", a[4]);`,
      starter: `int a[6] = {3, 8, 1, 9, 4, 6};
int n = 6;

printf("%d ", a[ ]);
printf("%d", a[ ]);`,
      rules: {
        regex: ["a\\s*\\[\\s*0\\s*\\]", "a\\s*\\[\\s*n\\s*-\\s*1\\s*\\]"],
        hint: "The first is a[0]. The last is a[n - 1], never a[n].",
        success:
          "Correct. In C, reading a[n] does not crash — it quietly hands you whatever is next in memory. That is worse than an error, because the bug shows up somewhere else.",
      },
      solution: `int a[6] = {3, 8, 1, 9, 4, 6};
int n = 6;

printf("%d ", a[0]);
printf("%d", a[n - 1]);`,
    },

    python: {
      example: `a = [7, 2, 9, 1, 4]

print(a[0])    # 7  — first box
print(a[4])    # 4  — last box, index 4 not 5
print(a[-1])   # 4  — Python lets you count from the end
print(a[5])    # IndexError — Python stops you

print(len(a))  # 5`,
      notes: [
        { token: "a[0]", meaning: "the first box — counting starts at zero" },
        { token: "a[-1]", meaning: "the last box. -2 is the one before it" },
        { token: "len(a)", meaning: "how many boxes — the last index is len(a) - 1" },
        { token: "a[5]", meaning: "raises IndexError. Python checks; C and C++ do not" },
      ],
      vizCode: `a = [7, 2, 9, 1, 4]
print(a[0])
print(a[2])
print(a[4])`,
      prompt:
        "Given a = [3, 8, 1, 9, 4, 6], print the first and last values. Get the last one using the length, not by typing 5 and not by using -1.",
      starter: `a = [3, 8, 1, 9, 4, 6]
n = len(a)

print(a[], end=" ")
print(a[])`,
      rules: {
        regex: ["a\\s*\\[\\s*0\\s*\\]", "a\\s*\\[\\s*n\\s*-\\s*1\\s*\\]"],
        mustNot: ["a[-1]", "a[5]"],
        hint: "The first is a[0]. The last is a[n - 1], where n is len(a).",
        success:
          "Correct. a[-1] is shorter and you should use it in real Python — but n - 1 is the idea every other language needs, so it is worth having in your head.",
      },
      solution: `a = [3, 8, 1, 9, 4, 6]
n = len(a)

print(a[0], end=" ")
print(a[n - 1])`,
    },

    java: {
      example: `int[] a = {7, 2, 9, 1, 4};

System.out.println(a[0]);   // 7  — first box
System.out.println(a[4]);   // 4  — last box, index 4 not 5
System.out.println(a[5]);   // ArrayIndexOutOfBoundsException

System.out.println(a.length);   // 5 — no brackets`,
      notes: [
        { token: "a[0]", meaning: "the first box — counting starts at zero" },
        { token: "a.length", meaning: "for an array. No brackets after it" },
        { token: "s.length()", meaning: "for a String. Brackets. Java is inconsistent here" },
        { token: "a[5]", meaning: "throws an exception. Java checks every access" },
      ],
      vizCode: `int[] a = {7, 2, 9, 1, 4};
System.out.println(a[0]);
System.out.println(a[2]);
System.out.println(a[4]);`,
      starter: `int[] a = {3, 8, 1, 9, 4, 6};
int n = a.length;

System.out.print(a[ ] + " ");
System.out.println(a[ ]);`,
      rules: {
        regex: ["a\\s*\\[\\s*0\\s*\\]", "a\\s*\\[\\s*n\\s*-\\s*1\\s*\\]"],
        hint: "The first is a[0]. The last is a[n - 1], never a[n].",
        success:
          "Correct. Remember the odd pair: arrays use a.length, Strings use s.length(), and Lists use list.size(). Three names for one idea.",
      },
      solution: `int[] a = {3, 8, 1, 9, 4, 6};
int n = a.length;

System.out.print(a[0] + " ");
System.out.println(a[n - 1]);`,
    },

    javascript: {
      example: `const a = [7, 2, 9, 1, 4];

console.log(a[0]);   // 7  — first box
console.log(a[4]);   // 4  — last box, index 4 not 5
console.log(a[5]);   // undefined — no error, no warning

console.log(a.length);   // 5`,
      notes: [
        { token: "a[0]", meaning: "the first box — counting starts at zero" },
        { token: "a.length", meaning: "how many boxes — the last index is length - 1" },
        { token: "a[5]", meaning: "gives undefined. Not an error, which makes it hard to find" },
        { token: "a.at(-1)", meaning: "the modern way to get the last item" },
      ],
      vizCode: `const a = [7, 2, 9, 1, 4];
console.log(a[0]);
console.log(a[2]);
console.log(a[4]);`,
      starter: `const a = [3, 8, 1, 9, 4, 6];
const n = a.length;

process.stdout.write(a[ ] + " ");
console.log(a[ ]);`,
      rules: {
        regex: ["a\\s*\\[\\s*0\\s*\\]", "a\\s*\\[\\s*n\\s*-\\s*1\\s*\\]"],
        hint: "The first is a[0]. The last is a[n - 1], never a[n].",
        success:
          "Correct. Reading past the end gives undefined rather than crashing — so undefined + 1 becomes NaN and the real mistake shows up far from where it happened.",
      },
      solution: `const a = [3, 8, 1, 9, 4, 6];
const n = a.length;

process.stdout.write(a[0] + " ");
console.log(a[n - 1]);`,
    },

    rust: {
      example: `let a = [7, 2, 9, 1, 4];

println!("{}", a[0]);   // 7  — first box
println!("{}", a[4]);   // 4  — last box, index 4 not 5
println!("{}", a[5]);   // panic: index out of bounds

println!("{}", a.len());   // 5

// the safe way — gives you Some(value) or None
if let Some(v) = a.get(5) { println!("{}", v); }`,
      notes: [
        { token: "a[0]", meaning: "the first box — counting starts at zero" },
        { token: "a.len()", meaning: "how many boxes — the last index is len() - 1" },
        { token: "a[5]", meaning: "stops the program on the spot rather than reading rubbish" },
        { token: "a.get(5)", meaning: "hands back None instead of panicking" },
      ],
      vizCode: `let a = [7, 2, 9, 1, 4];
println!("{}", a[0]);
println!("{}", a[2]);
println!("{}", a[4]);`,
      starter: `let a = [3, 8, 1, 9, 4, 6];
let n = a.len();

print!("{} ", a[]);
println!("{}", a[]);`,
      rules: {
        regex: ["a\\s*\\[\\s*0\\s*\\]", "a\\s*\\[\\s*n\\s*-\\s*1\\s*\\]"],
        hint: "The first is a[0]. The last is a[n - 1], never a[n].",
        success:
          "Correct. Rust checks every index at run time and stops the program if it is out of range. Slower than C by a hair, and it turns silent corruption into a clear crash.",
      },
      solution: `let a = [3, 8, 1, 9, 4, 6];
let n = a.len();

print!("{} ", a[0]);
println!("{}", a[n - 1]);`,
    },
  },

  /* ------------------------------------------------------------- scan -- */
  scan: {
    c: {
      example: `int best = a[0];               /* NOT 0 — values may be negative */

for (int i = 1; i < n; i++) {
  if (a[i] > best) best = a[i];
}

printf("%d", best);`,
      notes: [
        { token: "best = a[0]", meaning: "start from real data, not from a guess" },
        { token: "i = 1", meaning: "box 0 is already counted" },
        { token: "if (a[i] > best)", meaning: "change only this line to change the problem" },
      ],
      vizCode: `int best = a[0];
for (int i = 1; i < n; i++) {
  if (a[i] > best) best = a[i];
}
printf("%d", best);`,
      starter: `int best = a[0], second = -1000000;

for (int i = 1; i < n; i++) {
  if (a[i] > best) {

  } else if ( ) {
    second = a[i];
  }
}

printf("%d", second);`,
      rules: {
        must: ["second", "best"],
        mustNot: ["qsort"],
        regex: ["second\\s*=\\s*best", "best\\s*=\\s*a\\[i\\]", "a\\[i\\]\\s*>\\s*second"],
        hint:
          "When a[i] beats best, the old best becomes second — so write second = best; first, then best = a[i];. The order matters. The else-if fires when a[i] is smaller than best but bigger than second.",
        success:
          "Correct. Demote the old winner before crowning the new one, or you lose it. Also note INT_MIN from limits.h is a cleaner start than -1000000.",
      },
      solution: `int best = a[0], second = -1000000;

for (int i = 1; i < n; i++) {
  if (a[i] > best) {
    second = best;
    best = a[i];
  } else if (a[i] > second) {
    second = a[i];
  }
}

printf("%d", second);`,
    },

    python: {
      example: `best = a[0]        # NOT 0 — values may be negative

for i in range(1, n):
    if a[i] > best:
        best = a[i]

print(best)`,
      notes: [
        { token: "best = a[0]", meaning: "start from real data, not from a guess" },
        { token: "range(1, n)", meaning: "1 up to n - 1. Box 0 is already counted" },
        { token: "max(a)", meaning: "the built-in. Same O(n) walk, written for you" },
        { token: "for x in a", meaning: "cleaner when you do not need the index" },
      ],
      vizCode: `best = a[0]
for i in range(1, n):
    if a[i] > best: best = a[i]

print(best)`,
      prompt:
        "Find the second largest number in a list, using one pass. Keep two variables: best and second. Do not sort, and do not use max().",
      starter: `best, second = a[0], float("-inf")

for i in range(1, n):
    if a[i] > best:
        
    elif :
        second = a[i]

print(second)`,
      rules: {
        must: ["second", "best"],
        mustNot: ["sort", "max("],
        regex: ["second\\s*=\\s*best", "best\\s*=\\s*a\\[i\\]", "a\\[i\\]\\s*>\\s*second"],
        hint:
          "When a[i] beats best, the old best becomes second — so write second = best first, then best = a[i]. The elif fires when a[i] is smaller than best but bigger than second.",
        success:
          "Correct. float(\"-inf\") is the tidy Python way to start: it is smaller than every real number, so the first comparison always works.",
      },
      solution: `best, second = a[0], float("-inf")

for i in range(1, n):
    if a[i] > best:
        second = best
        best = a[i]
    elif a[i] > second:
        second = a[i]

print(second)`,
    },

    java: {
      example: `int best = a[0];               // NOT 0 — values may be negative

for (int i = 1; i < n; i++) {
  if (a[i] > best) best = a[i];
}

System.out.println(best);`,
      notes: [
        { token: "best = a[0]", meaning: "start from real data, not from a guess" },
        { token: "i = 1", meaning: "box 0 is already counted" },
        { token: "Integer.MIN_VALUE", meaning: "the cleanest starting value when you need one" },
      ],
      vizCode: `int best = a[0];
for (int i = 1; i < n; i++) {
  if (a[i] > best) best = a[i];
}
System.out.println(best);`,
      starter: `int best = a[0], second = Integer.MIN_VALUE;

for (int i = 1; i < n; i++) {
  if (a[i] > best) {

  } else if ( ) {
    second = a[i];
  }
}

System.out.println(second);`,
      rules: {
        must: ["second", "best"],
        mustNot: ["Arrays.sort"],
        regex: ["second\\s*=\\s*best", "best\\s*=\\s*a\\[i\\]", "a\\[i\\]\\s*>\\s*second"],
        hint:
          "When a[i] beats best, the old best becomes second — so write second = best; first, then best = a[i];. The order matters.",
        success:
          "Correct. Integer.MIN_VALUE is the right starting point here, and it is why this works even when every number is negative.",
      },
      solution: `int best = a[0], second = Integer.MIN_VALUE;

for (int i = 1; i < n; i++) {
  if (a[i] > best) {
    second = best;
    best = a[i];
  } else if (a[i] > second) {
    second = a[i];
  }
}

System.out.println(second);`,
    },

    javascript: {
      example: `let best = a[0];               // NOT 0 — values may be negative

for (let i = 1; i < n; i++) {
  if (a[i] > best) best = a[i];
}

console.log(best);`,
      notes: [
        { token: "best = a[0]", meaning: "start from real data, not from a guess" },
        { token: "i = 1", meaning: "box 0 is already counted" },
        { token: "-Infinity", meaning: "smaller than every number — a safe starting value" },
        { token: "Math.max(...a)", meaning: "breaks on very large arrays. The loop does not" },
      ],
      vizCode: `let best = a[0];
for (let i = 1; i < n; i++) {
  if (a[i] > best) best = a[i];
}
console.log(best);`,
      prompt:
        "Find the second largest number in an array, using one pass. Keep two variables: best and second. Do not sort, and do not use Math.max.",
      starter: `let best = a[0], second = -Infinity;

for (let i = 1; i < n; i++) {
  if (a[i] > best) {

  } else if ( ) {
    second = a[i];
  }
}

console.log(second);`,
      rules: {
        must: ["second", "best"],
        mustNot: ["sort", "Math.max"],
        regex: ["second\\s*=\\s*best", "best\\s*=\\s*a\\[i\\]", "a\\[i\\]\\s*>\\s*second"],
        hint:
          "When a[i] beats best, the old best becomes second — so write second = best; first, then best = a[i];. The order matters.",
        success:
          "Correct. Avoid Math.max(...a) on big arrays — spreading a few hundred thousand items into arguments overflows the call stack.",
      },
      solution: `let best = a[0], second = -Infinity;

for (let i = 1; i < n; i++) {
  if (a[i] > best) {
    second = best;
    best = a[i];
  } else if (a[i] > second) {
    second = a[i];
  }
}

console.log(second);`,
    },

    rust: {
      example: `let mut best = a[0];           // NOT 0 — values may be negative

for i in 1..n {
    if a[i] > best { best = a[i]; }
}

println!("{}", best);`,
      notes: [
        { token: "let mut best", meaning: "without mut it could never be updated" },
        { token: "1..n", meaning: "1 up to n - 1. Box 0 is already counted" },
        { token: "i32::MIN", meaning: "the smallest i32 — a safe starting value" },
        { token: "a.iter().max()", meaning: "the built-in. Gives Option, because the list may be empty" },
      ],
      vizCode: `let mut best = a[0];
for i in 1..n {
    if a[i] > best { best = a[i]; }
}
println!("{}", best);`,
      prompt:
        "Find the second largest number in an array, using one pass. Keep two variables: best and second. Do not sort, and do not use .max().",
      starter: `let mut best = a[0];
let mut second = i32::MIN;

for i in 1..n {
    if a[i] > best {

    } else if  {
        second = a[i];
    }
}

println!("{}", second);`,
      rules: {
        must: ["second", "best"],
        mustNot: ["sort", ".max()"],
        regex: ["second\\s*=\\s*best", "best\\s*=\\s*a\\[i\\]", "a\\[i\\]\\s*>\\s*second"],
        hint:
          "When a[i] beats best, the old best becomes second — so write second = best; first, then best = a[i];. The order matters.",
        success:
          "Correct. Rust's a.iter().max() gives back an Option, because an empty list has no maximum. It makes you handle the empty case instead of forgetting it.",
      },
      solution: `let mut best = a[0];
let mut second = i32::MIN;

for i in 1..n {
    if a[i] > best {
        second = best;
        best = a[i];
    } else if a[i] > second {
        second = a[i];
    }
}

println!("{}", second);`,
    },
  },

  /* ---------------------------------------------------------- reverse -- */
  reverse: {
    c: {
      example: `int i = 0, j = n - 1;

while (i < j) {
  int tmp = a[i];    /* C has no swap — do it by hand */
  a[i] = a[j];
  a[j] = tmp;
  i++;
  j--;
}`,
      notes: [
        { token: "j = n - 1", meaning: "the last index, not n" },
        { token: "while (i < j)", meaning: "stop at the middle — < not <=" },
        { token: "int tmp", meaning: "you need a spare box to swap through" },
      ],
      vizCode: `int i = 0, j = n - 1;
while (i < j) {
  int t = a[i]; a[i] = a[j]; a[j] = t;
  i++;
  j--;
}`,
      starter: `int i = 0, j = n - 1;
int ok = 1;

while ( ) {
  if ( ) { ok = 0; break; }
  i++; j--;
}

printf("%d", ok);`,
      rules: {
        must: ["break"],
        regex: ["i\\s*<\\s*j", "a\\[i\\]\\s*!=\\s*a\\[j\\]"],
        hint: "Loop while i < j. If a[i] != a[j] the answer is no — set ok = 0 and break out at once.",
        success:
          "Correct. Stopping at the first mismatch matters: the answer cannot change after that, so carrying on is wasted work.",
      },
      solution: `int i = 0, j = n - 1;
int ok = 1;

while (i < j) {
  if (a[i] != a[j]) { ok = 0; break; }
  i++; j--;
}

printf("%d", ok);`,
    },

    python: {
      example: `i, j = 0, n - 1

while i < j:
    a[i], a[j] = a[j], a[i]   # swap, no temporary needed
    i += 1
    j -= 1`,
      notes: [
        { token: "a[i], a[j] = a[j], a[i]", meaning: "Python swaps in one line" },
        { token: "while i < j", meaning: "stop at the middle — < not <=" },
        { token: "a.reverse()", meaning: "does it in place for you" },
        { token: "a[::-1]", meaning: "makes a reversed copy — that is extra memory" },
      ],
      vizCode: `i, j = 0, n - 1
while i < j:
    a[i], a[j] = a[j], a[i]
    i += 1
    j -= 1`,
      prompt:
        "Check whether a list is a palindrome — the same forwards and backwards. Stop at the first mismatch. Do not use a[::-1].",
      starter: `i, j = 0, n - 1
ok = True

while :
    if :
        ok = False
        break
    i += 1
    j -= 1

print(ok)`,
      rules: {
        must: ["break"],
        mustNot: ["[::-1]", "reversed("],
        regex: ["i\\s*<\\s*j", "a\\[i\\]\\s*!=\\s*a\\[j\\]"],
        hint: "Loop while i < j. If a[i] != a[j], set ok = False and break at once.",
        success:
          "Correct. a == a[::-1] is one line and does the same job, but it builds a whole second list. The two-pointer walk uses no extra memory.",
      },
      solution: `i, j = 0, n - 1
ok = True

while i < j:
    if a[i] != a[j]:
        ok = False
        break
    i += 1
    j -= 1

print(ok)`,
    },

    java: {
      example: `int i = 0, j = n - 1;

while (i < j) {
  int tmp = a[i];    // Java has no swap for ints
  a[i] = a[j];
  a[j] = tmp;
  i++;
  j--;
}`,
      notes: [
        { token: "j = n - 1", meaning: "the last index, not n" },
        { token: "while (i < j)", meaning: "stop at the middle — < not <=" },
        { token: "int tmp", meaning: "you need a spare box to swap through" },
        { token: "Collections.reverse", meaning: "works on a List, not on an int[]" },
      ],
      vizCode: `int i = 0, j = n - 1;
while (i < j) {
  int t = a[i]; a[i] = a[j]; a[j] = t;
  i++;
  j--;
}`,
      starter: `int i = 0, j = n - 1;
boolean ok = true;

while ( ) {
  if ( ) { ok = false; break; }
  i++; j--;
}

System.out.println(ok);`,
      rules: {
        must: ["break"],
        regex: ["i\\s*<\\s*j", "a\\[i\\]\\s*!=\\s*a\\[j\\]"],
        hint: "Loop while i < j. If a[i] != a[j], set ok = false and break at once.",
        success:
          "Correct. One warning for later: != on two Strings compares addresses, not letters. Use .equals for those. On ints it is fine.",
      },
      solution: `int i = 0, j = n - 1;
boolean ok = true;

while (i < j) {
  if (a[i] != a[j]) { ok = false; break; }
  i++; j--;
}

System.out.println(ok);`,
    },

    javascript: {
      example: `let i = 0, j = n - 1;

while (i < j) {
  [a[i], a[j]] = [a[j], a[i]];   // swap, no temporary needed
  i++;
  j--;
}`,
      notes: [
        { token: "[a[i], a[j]] = [a[j], a[i]]", meaning: "swaps in one line" },
        { token: "while (i < j)", meaning: "stop at the middle — < not <=" },
        { token: "a.reverse()", meaning: "does it in place, and changes the original array" },
      ],
      vizCode: `let i = 0, j = n - 1;
while (i < j) {
  [a[i], a[j]] = [a[j], a[i]];
  i++;
  j--;
}`,
      prompt:
        "Check whether an array is a palindrome — the same forwards and backwards. Stop at the first mismatch. Do not use .reverse().",
      starter: `let i = 0, j = n - 1;
let ok = true;

while ( ) {
  if ( ) { ok = false; break; }
  i++; j--;
}

console.log(ok);`,
      rules: {
        must: ["break"],
        mustNot: [".reverse()"],
        regex: ["i\\s*<\\s*j", "a\\[i\\]\\s*!==?\\s*a\\[j\\]"],
        hint: "Loop while i < j. If a[i] !== a[j], set ok = false and break at once.",
        success:
          "Correct. Note that a.reverse() changes the original array rather than returning a copy — that surprises people who expected the original to be untouched.",
      },
      solution: `let i = 0, j = n - 1;
let ok = true;

while (i < j) {
  if (a[i] !== a[j]) { ok = false; break; }
  i++; j--;
}

console.log(ok);`,
    },

    rust: {
      example: `let mut i = 0;
let mut j = n - 1;

while i < j {
    a.swap(i, j);   // built in, no temporary needed
    i += 1;
    j -= 1;
}`,
      notes: [
        { token: "a.swap(i, j)", meaning: "Rust has this built in" },
        { token: "while i < j", meaning: "stop at the middle — < not <=" },
        { token: "a.reverse()", meaning: "does the whole thing in one call" },
        { token: "j -= 1 on a usize", meaning: "if j is 0 this panics. usize can never go below zero" },
      ],
      vizCode: `let mut i = 0; let mut j = n - 1;
while i < j {
    a.swap(i, j);
    i += 1;
    j -= 1;
}`,
      prompt:
        "Check whether an array is a palindrome — the same forwards and backwards. Stop at the first mismatch. Do not use .reverse().",
      starter: `let mut i = 0;
let mut j = n - 1;
let mut ok = true;

while  {
    if  {
        ok = false;
        break;
    }
    i += 1;
    j -= 1;
}

println!("{}", ok);`,
      rules: {
        must: ["break"],
        mustNot: [".reverse()"],
        regex: ["i\\s*<\\s*j", "a\\[i\\]\\s*!=\\s*a\\[j\\]"],
        hint: "Loop while i < j. If a[i] != a[j], set ok = false and break at once.",
        success:
          "Correct. Watch j -= 1 when j has type usize: usize cannot be negative, so subtracting from 0 stops the program. The i < j guard is what keeps that from happening here.",
      },
      solution: `let mut i = 0;
let mut j = n - 1;
let mut ok = true;

while i < j {
    if a[i] != a[j] {
        ok = false;
        break;
    }
    i += 1;
    j -= 1;
}

println!("{}", ok);`,
    },
  },

  /* ---------------------------------------------------------- strings -- */
  strings: {
    c: {
      example: `char s[] = "banana";
int count[26] = {0};

for (int k = 0; s[k]; k++) count[s[k] - 'a']++;

printf("%d", count['a' - 'a']);   /* 3 a's */
printf("%d", count['n' - 'a']);   /* 2 n's */`,
      notes: [
        { token: "int count[26] = {0}", meaning: "one counter per letter, all set to zero" },
        { token: "s[k] - 'a'", meaning: "turns a letter into 0..25" },
        { token: "s[k] as the gate", meaning: "a C string ends with a 0 byte, which is false" },
        { token: "strlen(s)", meaning: "walks the whole string. Never call it inside a loop" },
      ],
      vizCode: `int count[26] = {0};
for (int k = 0; s[k]; k++) count[s[k] - 'a']++;`,
      starter: `int count[26] = {0};

for (int k = 0; s[k]; k++) count[s[k] - 'a']++;
for (int k = 0; t[k]; k++) ;

int ok = (strlen(s) == strlen(t));
for (int i = 0; i < 26; i++)
  if ( ) ok = 0;`,
      rules: {
        regex: ["count\\[\\s*t\\[k\\]\\s*-\\s*'a'\\s*\\]--", "count\\[i\\]\\s*!=\\s*0"],
        hint: "Subtract for the second string: count[t[k] - 'a']--. Then if any counter is not 0, the letters did not cancel out, so ok = 0.",
        success:
          "Correct. Counting is O(n); sorting both strings is O(n log n). Adding then subtracting so everything cancels to zero is a pattern worth keeping.",
      },
      solution: `int count[26] = {0};

for (int k = 0; s[k]; k++) count[s[k] - 'a']++;
for (int k = 0; t[k]; k++) count[t[k] - 'a']--;

int ok = (strlen(s) == strlen(t));
for (int i = 0; i < 26; i++)
  if (count[i] != 0) ok = 0;`,
    },

    python: {
      example: `s = "banana"
count = [0] * 26

for c in s: count[ord(c) - ord('a')] += 1

print(count[ord('a') - ord('a')])   # 3 a's
print(count[ord('n') - ord('a')])   # 2 n's`,
      notes: [
        { token: "[0] * 26", meaning: "one counter per letter, all set to zero" },
        { token: "ord(c)", meaning: "the number behind a letter. ord('a') is 97" },
        { token: "for c in s", meaning: "visits each character in order" },
        { token: "Counter(s)", meaning: "from collections — does all of this in one line" },
      ],
      vizCode: `count = [0] * 26
for c in s: count[ord(c) - ord('a')] += 1`,
      prompt:
        "Check whether two strings are anagrams — same letters, any order. Count the letters of the first, un-count the letters of the second, then check nothing is left over. Do not use sorted() or Counter.",
      starter: `count = [0] * 26

for c in s: count[ord(c) - ord('a')] += 1
for c in t: 

ok = len(s) == len(t)
for i in range(26):
    if :
        ok = False`,
      rules: {
        mustNot: ["sorted(", "Counter("],
        regex: ["count\\[ord\\(c\\)\\s*-\\s*ord\\('a'\\)\\]\\s*-=\\s*1", "count\\[i\\]\\s*!=\\s*0"],
        hint: "Subtract for the second string: count[ord(c) - ord('a')] -= 1. Then if any counter is not 0, the letters did not cancel out.",
        success:
          "Correct. In real Python you would write Counter(s) == Counter(t) — but the counting array is the idea that carries over to every other language.",
      },
      solution: `count = [0] * 26

for c in s: count[ord(c) - ord('a')] += 1
for c in t: count[ord(c) - ord('a')] -= 1

ok = len(s) == len(t)
for i in range(26):
    if count[i] != 0:
        ok = False`,
    },

    java: {
      example: `String s = "banana";
int[] count = new int[26];

for (char c : s.toCharArray()) count[c - 'a']++;

System.out.println(count['a' - 'a']);   // 3 a's
System.out.println(count['n' - 'a']);   // 2 n's`,
      notes: [
        { token: "new int[26]", meaning: "one counter per letter, Java zeroes them for you" },
        { token: "c - 'a'", meaning: "turns a letter into 0..25" },
        { token: "s.toCharArray()", meaning: "so the range-for can walk the letters" },
        { token: "s.charAt(k)", meaning: "the other way, when you need the position too" },
      ],
      vizCode: `int[] count = new int[26];
for (char c : s.toCharArray()) count[c - 'a']++;`,
      prompt:
        "Check whether two strings are anagrams — same letters, any order. Count the letters of the first, un-count the letters of the second, then check nothing is left over. Do not sort.",
      starter: `int[] count = new int[26];

for (char c : s.toCharArray()) count[c - 'a']++;
for (char c : t.toCharArray()) ;

boolean ok = (s.length() == t.length());
for (int i = 0; i < 26; i++)
  if ( ) ok = false;`,
      rules: {
        mustNot: ["Arrays.sort"],
        regex: ["count\\[\\s*c\\s*-\\s*'a'\\s*\\]--", "count\\[i\\]\\s*!=\\s*0"],
        hint: "Subtract for the second string: count[c - 'a']--. Then if any counter is not 0, the letters did not cancel out, so ok = false.",
        success:
          "Correct. Note s.length() with brackets for a String, but count.length without them for an array. Java is inconsistent about that.",
      },
      solution: `int[] count = new int[26];

for (char c : s.toCharArray()) count[c - 'a']++;
for (char c : t.toCharArray()) count[c - 'a']--;

boolean ok = (s.length() == t.length());
for (int i = 0; i < 26; i++)
  if (count[i] != 0) ok = false;`,
    },

    javascript: {
      example: `const s = "banana";
const count = new Array(26).fill(0);

for (const c of s) count[c.charCodeAt(0) - 97]++;

console.log(count[0]);    // 3 a's — 'a' is 97
console.log(count[13]);   // 2 n's`,
      notes: [
        { token: "new Array(26).fill(0)", meaning: "one counter per letter. Without fill they are all empty" },
        { token: "c.charCodeAt(0)", meaning: "the number behind a letter. 'a' is 97" },
        { token: "for (const c of s)", meaning: "walks the characters. for...in would give you indexes" },
      ],
      vizCode: `const count = new Array(26).fill(0);
for (const c of s) count[c.charCodeAt(0) - 97]++;`,
      prompt:
        "Check whether two strings are anagrams — same letters, any order. Count the letters of the first, un-count the letters of the second, then check nothing is left over. Do not sort.",
      starter: `const count = new Array(26).fill(0);

for (const c of s) count[c.charCodeAt(0) - 97]++;
for (const c of t) ;

let ok = s.length === t.length;
for (let i = 0; i < 26; i++)
  if ( ) ok = false;`,
      rules: {
        mustNot: [".sort()"],
        regex: ["count\\[c\\.charCodeAt\\(0\\)\\s*-\\s*97\\]--", "count\\[i\\]\\s*!==?\\s*0"],
        hint: "Subtract for the second string: count[c.charCodeAt(0) - 97]--. Then if any counter is not 0, the letters did not cancel out.",
        success:
          "Correct. The .fill(0) matters: new Array(26) on its own has 26 empty slots, and undefined++ gives NaN rather than 1.",
      },
      solution: `const count = new Array(26).fill(0);

for (const c of s) count[c.charCodeAt(0) - 97]++;
for (const c of t) count[c.charCodeAt(0) - 97]--;

let ok = s.length === t.length;
for (let i = 0; i < 26; i++)
  if (count[i] !== 0) ok = false;`,
    },

    rust: {
      example: `let s = "banana";
let mut count = [0i32; 26];

for b in s.bytes() { count[(b - b'a') as usize] += 1; }

println!("{}", count[0]);    // 3 a's
println!("{}", count[13]);   // 2 n's`,
      notes: [
        { token: "[0i32; 26]", meaning: "one counter per letter, all set to zero" },
        { token: "s.bytes()", meaning: "walks the raw bytes — right for plain a-z text" },
        { token: "b'a'", meaning: "the byte for the letter a, which is 97" },
        { token: "s.chars()", meaning: "what you need for accents or emoji, where one letter is several bytes" },
      ],
      vizCode: `let mut count = [0i32; 26];
for b in s.bytes() { count[(b - b'a') as usize] += 1; }`,
      prompt:
        "Check whether two strings are anagrams — same letters, any order. Count the letters of the first, un-count the letters of the second, then check nothing is left over. Do not sort.",
      starter: `let mut count = [0i32; 26];

for b in s.bytes() { count[(b - b'a') as usize] += 1; }
for b in t.bytes() { }

let mut ok = s.len() == t.len();
for i in 0..26 {
    if  { ok = false; }
}`,
      rules: {
        mustNot: ["sort"],
        regex: ["count\\[\\(b\\s*-\\s*b'a'\\)\\s*as\\s+usize\\]\\s*-=\\s*1", "count\\[i\\]\\s*!=\\s*0"],
        hint: "Subtract for the second string: count[(b - b'a') as usize] -= 1. Then if any counter is not 0, the letters did not cancel out.",
        success:
          "Correct. The `as usize` is needed because Rust will only index with usize — it will not quietly convert a byte for you.",
      },
      solution: `let mut count = [0i32; 26];

for b in s.bytes() { count[(b - b'a') as usize] += 1; }
for b in t.bytes() { count[(b - b'a') as usize] -= 1; }

let mut ok = s.len() == t.len();
for i in 0..26 {
    if count[i] != 0 { ok = false; }
}`,
    },
  },

  /* ------------------------------------------------------- palindrome -- */
  palindrome: {
    c: {
      example: `int isPal(const char *s) {
  int i = 0, j = strlen(s) - 1;
  while (i < j) {
    if (s[i] != s[j]) return 0;
    i++; j--;
  }
  return 1;
}`,
      notes: [
        { token: "strlen(s) - 1", meaning: "the last index" },
        { token: "return 0", meaning: "one mismatch settles it — stop at once" },
        { token: "i < j", meaning: "the middle letter needs no partner" },
      ],
      vizCode: `int i = 0, j = strlen(s) - 1;
while (i < j) {
  if (s[i] != s[j]) return 0;
  i++; j--;
}
return 1;`,
      starter: `int i = 0, j = strlen(s) - 1;
int ok = 1;

while (i < j) {
  while (i < j && !isalpha(s[i])) ;
  while (i < j && !isalpha(s[j])) ;
  if (tolower(s[i]) != tolower(s[j])) { ok = 0; break; }
  i++; j--;
}`,
      rules: {
        must: ["tolower", "isalpha"],
        regex: ["!isalpha\\(s\\[i\\]\\)\\)\\s*i\\+\\+", "!isalpha\\(s\\[j\\]\\)\\)\\s*j--"],
        hint: "Inside the skip loops, move the pointer: i++ on the left, j-- on the right.",
        success:
          "Correct. isalpha and tolower need ctype.h. Keep the i < j guard inside the skip loops, or a string of only punctuation runs the pointers past each other.",
      },
      solution: `int i = 0, j = strlen(s) - 1;
int ok = 1;

while (i < j) {
  while (i < j && !isalpha(s[i])) i++;
  while (i < j && !isalpha(s[j])) j--;
  if (tolower(s[i]) != tolower(s[j])) { ok = 0; break; }
  i++; j--;
}`,
    },

    python: {
      example: `def is_pal(s):
    i, j = 0, len(s) - 1
    while i < j:
        if s[i] != s[j]: return False
        i += 1
        j -= 1
    return True`,
      notes: [
        { token: "len(s) - 1", meaning: "the last index" },
        { token: "return False", meaning: "one mismatch settles it — stop at once" },
        { token: "i < j", meaning: "the middle letter needs no partner" },
        { token: "s == s[::-1]", meaning: "one line, but it builds a whole second string" },
      ],
      vizCode: `i, j = 0, len(s) - 1
while i < j:
    if s[i] != s[j]: return False
    i += 1
    j -= 1
return True`,
      prompt:
        "Check whether a sentence is a palindrome, ignoring anything that is not a letter. 'A man, a plan, a canal' should count. Skip non-letters by moving the pointers past them.",
      starter: `i, j = 0, len(s) - 1
ok = True

while i < j:
    while i < j and not s[i].isalpha(): 
    while i < j and not s[j].isalpha(): 
    if s[i].lower() != s[j].lower():
        ok = False
        break
    i += 1
    j -= 1`,
      rules: {
        must: [".isalpha()", ".lower()"],
        mustNot: ["[::-1]"],
        regex: ["not\\s+s\\[i\\]\\.isalpha\\(\\)\\s*:\\s*i\\s*\\+=\\s*1", "not\\s+s\\[j\\]\\.isalpha\\(\\)\\s*:\\s*j\\s*-=\\s*1"],
        hint: "Inside the skip loops, move the pointer: i += 1 on the left, j -= 1 on the right.",
        success:
          "Correct. Python's .isalpha() also says yes to accented letters and other alphabets, which is usually what you want — C's isalpha only knows a-z.",
      },
      solution: `i, j = 0, len(s) - 1
ok = True

while i < j:
    while i < j and not s[i].isalpha(): i += 1
    while i < j and not s[j].isalpha(): j -= 1
    if s[i].lower() != s[j].lower():
        ok = False
        break
    i += 1
    j -= 1`,
    },

    java: {
      example: `static boolean isPal(String s) {
  int i = 0, j = s.length() - 1;
  while (i < j) {
    if (s.charAt(i) != s.charAt(j)) return false;
    i++; j--;
  }
  return true;
}`,
      notes: [
        { token: "s.length() - 1", meaning: "the last index. Brackets, because String" },
        { token: "s.charAt(i)", meaning: "Java has no s[i] for Strings" },
        { token: "return false", meaning: "one mismatch settles it — stop at once" },
      ],
      vizCode: `int i = 0, j = s.length() - 1;
while (i < j) {
  if (s.charAt(i) != s.charAt(j)) return false;
  i++; j--;
}
return true;`,
      starter: `int i = 0, j = s.length() - 1;
boolean ok = true;

while (i < j) {
  while (i < j && !Character.isLetter(s.charAt(i))) ;
  while (i < j && !Character.isLetter(s.charAt(j))) ;
  if (Character.toLowerCase(s.charAt(i)) != Character.toLowerCase(s.charAt(j))) { ok = false; break; }
  i++; j--;
}`,
      rules: {
        must: ["Character.isLetter", "Character.toLowerCase"],
        regex: ["charAt\\(i\\)\\)\\)\\s*i\\+\\+", "charAt\\(j\\)\\)\\)\\s*j--"],
        hint: "Inside the skip loops, move the pointer: i++ on the left, j-- on the right.",
        success:
          "Correct. Use != on chars as here — but never on two Strings, where it compares addresses instead of letters.",
      },
      solution: `int i = 0, j = s.length() - 1;
boolean ok = true;

while (i < j) {
  while (i < j && !Character.isLetter(s.charAt(i))) i++;
  while (i < j && !Character.isLetter(s.charAt(j))) j--;
  if (Character.toLowerCase(s.charAt(i)) != Character.toLowerCase(s.charAt(j))) { ok = false; break; }
  i++; j--;
}`,
    },

    javascript: {
      example: `function isPal(s) {
  let i = 0, j = s.length - 1;
  while (i < j) {
    if (s[i] !== s[j]) return false;
    i++; j--;
  }
  return true;
}`,
      notes: [
        { token: "s.length - 1", meaning: "the last index. No brackets, unlike Java" },
        { token: "s[i]", meaning: "works on strings too, and gives a one-letter string" },
        { token: "return false", meaning: "one mismatch settles it — stop at once" },
      ],
      vizCode: `let i = 0, j = s.length - 1;
while (i < j) {
  if (s[i] !== s[j]) return false;
  i++; j--;
}
return true;`,
      prompt:
        "Check whether a sentence is a palindrome, ignoring anything that is not a letter. 'A man, a plan, a canal' should count. Skip non-letters by moving the pointers past them.",
      starter: `const isL = (c) => /[a-z]/i.test(c);
let i = 0, j = s.length - 1;
let ok = true;

while (i < j) {
  while (i < j && !isL(s[i])) ;
  while (i < j && !isL(s[j])) ;
  if (s[i].toLowerCase() !== s[j].toLowerCase()) { ok = false; break; }
  i++; j--;
}`,
      rules: {
        must: ["toLowerCase"],
        regex: ["!isL\\(s\\[i\\]\\)\\)\\s*i\\+\\+", "!isL\\(s\\[j\\]\\)\\)\\s*j--"],
        hint: "Inside the skip loops, move the pointer: i++ on the left, j-- on the right.",
        success:
          "Correct. JavaScript has no isalpha, so a small regex test does the job. /[a-z]/i means a to z, ignoring case.",
      },
      solution: `const isL = (c) => /[a-z]/i.test(c);
let i = 0, j = s.length - 1;
let ok = true;

while (i < j) {
  while (i < j && !isL(s[i])) i++;
  while (i < j && !isL(s[j])) j--;
  if (s[i].toLowerCase() !== s[j].toLowerCase()) { ok = false; break; }
  i++; j--;
}`,
    },

    rust: {
      example: `fn is_pal(s: &str) -> bool {
    let b = s.as_bytes();
    let (mut i, mut j) = (0, b.len() - 1);
    while i < j {
        if b[i] != b[j] { return false; }
        i += 1; j -= 1;
    }
    true
}`,
      notes: [
        { token: "s.as_bytes()", meaning: "Rust will not let you index a &str directly" },
        { token: "b.len() - 1", meaning: "the last index" },
        { token: "return false", meaning: "one mismatch settles it — stop at once" },
        { token: "true", meaning: "last line, no semicolon — this is the value handed back" },
      ],
      vizCode: `let (mut i, mut j) = (0, b.len() - 1);
while i < j {
    if b[i] != b[j] { return false; }
    i += 1;
    j -= 1;
}
true`,
      prompt:
        "Check whether a sentence is a palindrome, ignoring anything that is not a letter. 'A man, a plan, a canal' should count. Skip non-letters by moving the pointers past them.",
      starter: `let b: Vec<char> = s.chars().collect();
let (mut i, mut j) = (0, b.len() - 1);
let mut ok = true;

while i < j {
    while i < j && !b[i].is_alphabetic() { }
    while i < j && !b[j].is_alphabetic() { }
    if b[i].to_ascii_lowercase() != b[j].to_ascii_lowercase() {
        ok = false;
        break;
    }
    i += 1;
    j -= 1;
}`,
      rules: {
        must: ["is_alphabetic", "to_ascii_lowercase"],
        regex: ["!b\\[i\\]\\.is_alphabetic\\(\\)\\s*\\{\\s*i\\s*\\+=\\s*1", "!b\\[j\\]\\.is_alphabetic\\(\\)\\s*\\{\\s*j\\s*-=\\s*1"],
        hint: "Inside the skip loops, move the pointer: i += 1 on the left, j -= 1 on the right.",
        success:
          "Correct. Collecting into Vec<char> rather than using bytes is what makes this work for accented letters, where one character is several bytes.",
      },
      solution: `let b: Vec<char> = s.chars().collect();
let (mut i, mut j) = (0, b.len() - 1);
let mut ok = true;

while i < j {
    while i < j && !b[i].is_alphabetic() { i += 1; }
    while i < j && !b[j].is_alphabetic() { j -= 1; }
    if b[i].to_ascii_lowercase() != b[j].to_ascii_lowercase() {
        ok = false;
        break;
    }
    i += 1;
    j -= 1;
}`,
    },
  },

  /* ----------------------------------------------------------- kadane -- */
  kadane: {
    c: {
      example: `int cur = a[0], best = a[0];

for (int i = 1; i < n; i++) {
  cur = a[i] > cur + a[i] ? a[i] : cur + a[i];   /* restart, or extend */
  if (cur > best) best = cur;                    /* remember the best ever */
}

printf("%d", best);   /* 6, from {4, -1, 2, 1} */`,
      notes: [
        { token: "cur", meaning: "best sum of a run ENDING at i" },
        { token: "the ? : line", meaning: "start fresh, or keep going. C has no max() built in" },
        { token: "best", meaning: "the best cur ever seen — it may be far behind" },
      ],
      vizCode: `int cur = a[0], best = a[0];
for (int i = 1; i < n; i++) {
  cur = a[i] > cur + a[i] ? a[i] : cur + a[i];
  if (cur > best) best = cur;
}`,
      starter: `int cur = , best = ;

for (int i = 1; i < n; i++) {
  cur = ;
  if ( ) best = cur;
}`,
      rules: {
        regex: ["cur\\s*=\\s*a\\[0\\]", "best\\s*=\\s*a\\[0\\]", "a\\[i\\]\\s*>\\s*cur\\s*\\+\\s*a\\[i\\]\\s*\\?", "cur\\s*>\\s*best"],
        hint:
          "Seed both with a[0]. Then cur = a[i] > cur + a[i] ? a[i] : cur + a[i]; and after it, if (cur > best) best = cur;",
        success:
          "Correct. Update cur first, then compare it with best. Swap the two and you always report the previous element's answer.",
      },
      solution: `int cur = a[0], best = a[0];

for (int i = 1; i < n; i++) {
  cur = a[i] > cur + a[i] ? a[i] : cur + a[i];
  if (cur > best) best = cur;
}`,
    },

    python: {
      example: `cur = best = a[0]

for i in range(1, n):
    cur = max(a[i], cur + a[i])   # restart, or extend
    best = max(best, cur)         # remember the best ever

print(best)   # 6, from [4, -1, 2, 1]`,
      notes: [
        { token: "cur", meaning: "best sum of a run ENDING at i" },
        { token: "max(a[i], cur + a[i])", meaning: "start fresh, or keep going" },
        { token: "best", meaning: "the best cur ever seen — it may be far behind" },
        { token: "cur = best = a[0]", meaning: "sets both at once. Safe here because ints are immutable" },
      ],
      vizCode: `cur = best = a[0]
for i in range(1, n):
    cur = max(a[i], cur + a[i])
    best = max(best, cur)`,
      starter: `cur, best = , 

for i in range(1, n):
    cur = 
    best = `,
      rules: {
        regex: ["cur\\s*,\\s*best\\s*=\\s*a\\[0\\]\\s*,\\s*a\\[0\\]", "cur\\s*=\\s*max\\s*\\(\\s*a\\[i\\]\\s*,\\s*cur\\s*\\+\\s*a\\[i\\]\\s*\\)", "best\\s*=\\s*max\\s*\\(\\s*best\\s*,\\s*cur\\s*\\)"],
        hint:
          "Seed both with a[0]. Then cur = max(a[i], cur + a[i]) and best = max(best, cur) — in that order, since best needs the new cur.",
        success:
          "Correct. Careful with cur = best = [] for lists though: that makes both names point at the same list, and changing one changes the other.",
      },
      solution: `cur, best = a[0], a[0]

for i in range(1, n):
    cur = max(a[i], cur + a[i])
    best = max(best, cur)`,
    },

    java: {
      example: `int cur = a[0], best = a[0];

for (int i = 1; i < n; i++) {
  cur = Math.max(a[i], cur + a[i]);   // restart, or extend
  best = Math.max(best, cur);         // remember the best ever
}

System.out.println(best);   // 6, from {4, -1, 2, 1}`,
      notes: [
        { token: "cur", meaning: "best sum of a run ENDING at i" },
        { token: "Math.max(a[i], cur + a[i])", meaning: "start fresh, or keep going" },
        { token: "best", meaning: "the best cur ever seen — it may be far behind" },
        { token: "long", meaning: "use it when the sums can pass 2 billion" },
      ],
      vizCode: `int cur = a[0], best = a[0];
for (int i = 1; i < n; i++) {
  cur = Math.max(a[i], cur + a[i]);
  best = Math.max(best, cur);
}`,
      starter: `int cur = , best = ;

for (int i = 1; i < n; i++) {
  cur = ;
  best = ;
}`,
      rules: {
        regex: ["cur\\s*=\\s*a\\[0\\]", "best\\s*=\\s*a\\[0\\]", "cur\\s*=\\s*Math\\.max\\s*\\(\\s*a\\[i\\]\\s*,\\s*cur\\s*\\+\\s*a\\[i\\]\\s*\\)", "best\\s*=\\s*Math\\.max\\s*\\(\\s*best\\s*,\\s*cur\\s*\\)"],
        hint:
          "Seed both with a[0]. Then cur = Math.max(a[i], cur + a[i]); and best = Math.max(best, cur); — in that order.",
        success:
          "Correct. Update cur first, then compare it with best. Swap the two and you always report the previous element's answer.",
      },
      solution: `int cur = a[0], best = a[0];

for (int i = 1; i < n; i++) {
  cur = Math.max(a[i], cur + a[i]);
  best = Math.max(best, cur);
}`,
    },

    javascript: {
      example: `let cur = a[0], best = a[0];

for (let i = 1; i < n; i++) {
  cur = Math.max(a[i], cur + a[i]);   // restart, or extend
  best = Math.max(best, cur);         // remember the best ever
}

console.log(best);   // 6, from [4, -1, 2, 1]`,
      notes: [
        { token: "cur", meaning: "best sum of a run ENDING at i" },
        { token: "Math.max(a[i], cur + a[i])", meaning: "start fresh, or keep going" },
        { token: "best", meaning: "the best cur ever seen — it may be far behind" },
        { token: "Math.max with two arguments", meaning: "fine. It is the spread form that breaks on big arrays" },
      ],
      vizCode: `let cur = a[0], best = a[0];
for (let i = 1; i < n; i++) {
  cur = Math.max(a[i], cur + a[i]);
  best = Math.max(best, cur);
}`,
      starter: `let cur = , best = ;

for (let i = 1; i < n; i++) {
  cur = ;
  best = ;
}`,
      rules: {
        regex: ["cur\\s*=\\s*a\\[0\\]", "best\\s*=\\s*a\\[0\\]", "cur\\s*=\\s*Math\\.max\\s*\\(\\s*a\\[i\\]\\s*,\\s*cur\\s*\\+\\s*a\\[i\\]\\s*\\)", "best\\s*=\\s*Math\\.max\\s*\\(\\s*best\\s*,\\s*cur\\s*\\)"],
        hint:
          "Seed both with a[0]. Then cur = Math.max(a[i], cur + a[i]); and best = Math.max(best, cur); — in that order.",
        success:
          "Correct. Update cur first, then compare it with best. Swap the two and you always report the previous element's answer.",
      },
      solution: `let cur = a[0], best = a[0];

for (let i = 1; i < n; i++) {
  cur = Math.max(a[i], cur + a[i]);
  best = Math.max(best, cur);
}`,
    },

    rust: {
      example: `let mut cur = a[0];
let mut best = a[0];

for i in 1..n {
    cur = a[i].max(cur + a[i]);   // restart, or extend
    best = best.max(cur);         // remember the best ever
}

println!("{}", best);   // 6, from [4, -1, 2, 1]`,
      notes: [
        { token: "cur", meaning: "best sum of a run ENDING at i" },
        { token: "a[i].max(cur + a[i])", meaning: "max is a method on the number itself" },
        { token: "best", meaning: "the best cur ever seen — it may be far behind" },
        { token: "i64", meaning: "use it when the sums can pass 2 billion" },
      ],
      vizCode: `let mut cur = a[0]; let mut best = a[0];
for i in 1..n {
    cur = a[i].max(cur + a[i]);
    best = best.max(cur);
}`,
      starter: `let mut cur = ;
let mut best = ;

for i in 1..n {
    cur = ;
    best = ;
}`,
      rules: {
        regex: ["cur\\s*=\\s*a\\[0\\]", "best\\s*=\\s*a\\[0\\]", "a\\[i\\]\\.max\\s*\\(\\s*cur\\s*\\+\\s*a\\[i\\]\\s*\\)", "best\\.max\\s*\\(\\s*cur\\s*\\)"],
        hint:
          "Seed both with a[0]. Then cur = a[i].max(cur + a[i]); and best = best.max(cur); — max is a method here, not a free function.",
        success:
          "Correct. Rust puts max on the value itself, so you write a.max(b) rather than max(a, b). It reads oddly at first and then stops mattering.",
      },
      solution: `let mut cur = a[0];
let mut best = a[0];

for i in 1..n {
    cur = a[i].max(cur + a[i]);
    best = best.max(cur);
}`,
    },
  },

  /* ----------------------------------------------------------- matrix -- */
  matrix: {
    c: {
      example: `int top = 0, bottom = R - 1, left = 0, right = C - 1;

while (top <= bottom && left <= right) {
  for (int c = left; c <= right; c++) printf("%d ", m[top][c]);
  top++;
  for (int r = top; r <= bottom; r++) printf("%d ", m[r][right]);
  right--;
  if (top <= bottom) {
    for (int c = right; c >= left; c--) printf("%d ", m[bottom][c]);
    bottom--;
  }
  if (left <= right) {
    for (int r = bottom; r >= top; r--) printf("%d ", m[r][left]);
    left++;
  }
}`,
      notes: [
        { token: "four walls", meaning: "top, bottom, left, right — they close in" },
        { token: "top++", meaning: "move the wall right after using it" },
        { token: "if (top <= bottom)", meaning: "stops a single leftover row printing twice" },
        { token: "int m[R][C]", meaning: "one long block of memory. Row r starts at r * C" },
      ],
      vizCode: `int top = 0, bottom = R - 1;
int left = 0, right = C - 1;
while (top <= bottom && left <= right) {
  /* right along top, down right side, */
  /* left along bottom, up left side */
}`,
      starter: `int sum = 0;

for (int i = 0; i < n; i++) {
  sum += ;
}

printf("%d", sum);`,
      rules: {
        regex: ["m\\s*\\[\\s*i\\s*\\]\\s*\\[\\s*i\\s*\\]"],
        hint: "On the main diagonal the row number and the column number are the same, so add m[i][i].",
        success:
          "Correct. The other diagonal is m[i][n - 1 - i]. Also worth knowing: walking a row is faster than walking a column, because a row sits together in memory.",
      },
      solution: `int sum = 0;

for (int i = 0; i < n; i++) {
  sum += m[i][i];
}

printf("%d", sum);`,
    },

    python: {
      example: `top, bottom = 0, R - 1
left, right = 0, C - 1

while top <= bottom and left <= right:
    for c in range(left, right + 1): print(m[top][c], end=" ")
    top += 1
    for r in range(top, bottom + 1): print(m[r][right], end=" ")
    right -= 1
    if top <= bottom:
        for c in range(right, left - 1, -1): print(m[bottom][c], end=" ")
        bottom -= 1
    if left <= right:
        for r in range(bottom, top - 1, -1): print(m[r][left], end=" ")
        left += 1`,
      notes: [
        { token: "four walls", meaning: "top, bottom, left, right — they close in" },
        { token: "range(right, left - 1, -1)", meaning: "counts down. The end is still left out" },
        { token: "[[0] * C for _ in range(R)]", meaning: "the right way to make a grid" },
        { token: "[[0] * C] * R", meaning: "wrong — every row is the same list, so all rows change together" },
      ],
      vizCode: `top, bottom = 0, R - 1
left, right = 0, C - 1
while top <= bottom and left <= right:
    # right along top, down right side,
    # left along bottom, up left side
    pass`,
      prompt:
        "Sum the main diagonal of a square grid — the cells where the row number equals the column number. One loop is enough.",
      starter: `total = 0

for i in range(n):
    total += 

print(total)`,
      rules: {
        must: ["total"],
        regex: ["m\\s*\\[\\s*i\\s*\\]\\s*\\[\\s*i\\s*\\]"],
        hint: "On the main diagonal the row number and the column number are the same, so add m[i][i].",
        success:
          "Correct. The other diagonal is m[i][n - 1 - i]. And remember: build grids with [[0] * C for _ in range(R)], never [[0] * C] * R.",
      },
      solution: `total = 0

for i in range(n):
    total += m[i][i]

print(total)`,
    },

    java: {
      example: `int top = 0, bottom = R - 1, left = 0, right = C - 1;

while (top <= bottom && left <= right) {
  for (int c = left; c <= right; c++) System.out.print(m[top][c] + " ");
  top++;
  for (int r = top; r <= bottom; r++) System.out.print(m[r][right] + " ");
  right--;
  if (top <= bottom) {
    for (int c = right; c >= left; c--) System.out.print(m[bottom][c] + " ");
    bottom--;
  }
  if (left <= right) {
    for (int r = bottom; r >= top; r--) System.out.print(m[r][left] + " ");
    left++;
  }
}`,
      notes: [
        { token: "four walls", meaning: "top, bottom, left, right — they close in" },
        { token: "top++", meaning: "move the wall right after using it" },
        { token: "new int[R][C]", meaning: "an array of row arrays, so rows can differ in length" },
        { token: "m.length", meaning: "the number of rows. m[0].length is the number of columns" },
      ],
      vizCode: `int top = 0, bottom = R - 1;
int left = 0, right = C - 1;
while (top <= bottom && left <= right) {
  // right along top, down right side,
  // left along bottom, up left side
}`,
      starter: `int sum = 0;

for (int i = 0; i < n; i++) {
  sum += ;
}

System.out.println(sum);`,
      rules: {
        regex: ["m\\s*\\[\\s*i\\s*\\]\\s*\\[\\s*i\\s*\\]"],
        hint: "On the main diagonal the row number and the column number are the same, so add m[i][i].",
        success:
          "Correct. The other diagonal is m[i][n - 1 - i]. Note Java grids are arrays of arrays, so m.length is rows and m[0].length is columns.",
      },
      solution: `int sum = 0;

for (int i = 0; i < n; i++) {
  sum += m[i][i];
}

System.out.println(sum);`,
    },

    javascript: {
      example: `let top = 0, bottom = R - 1, left = 0, right = C - 1;

while (top <= bottom && left <= right) {
  for (let c = left; c <= right; c++) out.push(m[top][c]);
  top++;
  for (let r = top; r <= bottom; r++) out.push(m[r][right]);
  right--;
  if (top <= bottom) {
    for (let c = right; c >= left; c--) out.push(m[bottom][c]);
    bottom--;
  }
  if (left <= right) {
    for (let r = bottom; r >= top; r--) out.push(m[r][left]);
    left++;
  }
}`,
      notes: [
        { token: "four walls", meaning: "top, bottom, left, right — they close in" },
        { token: "top++", meaning: "move the wall right after using it" },
        { token: "Array.from({length: R}, () => new Array(C).fill(0))", meaning: "the right way to make a grid" },
        { token: "new Array(R).fill(new Array(C))", meaning: "wrong — every row is the same array" },
      ],
      vizCode: `let top = 0, bottom = R - 1;
let left = 0, right = C - 1;
while (top <= bottom && left <= right) {
  // right along top, down right side,
  // left along bottom, up left side
}`,
      starter: `let sum = 0;

for (let i = 0; i < n; i++) {
  sum += ;
}

console.log(sum);`,
      rules: {
        regex: ["m\\s*\\[\\s*i\\s*\\]\\s*\\[\\s*i\\s*\\]"],
        hint: "On the main diagonal the row number and the column number are the same, so add m[i][i].",
        success:
          "Correct. The other diagonal is m[i][n - 1 - i]. And build grids with Array.from — .fill(new Array(C)) shares one row across all of them.",
      },
      solution: `let sum = 0;

for (let i = 0; i < n; i++) {
  sum += m[i][i];
}

console.log(sum);`,
    },

    rust: {
      example: `let (mut top, mut bottom) = (0usize, r_count - 1);
let (mut left, mut right) = (0usize, c_count - 1);

while top <= bottom && left <= right {
    for c in left..=right { print!("{} ", m[top][c]); }
    top += 1;
    for r in top..=bottom { print!("{} ", m[r][right]); }
    right -= 1;
    // and so on for the bottom and left walls
}`,
      notes: [
        { token: "four walls", meaning: "top, bottom, left, right — they close in" },
        { token: "usize", meaning: "the type Rust indexes with. It can never be negative" },
        { token: "right -= 1 at zero", meaning: "panics, because usize cannot go below zero" },
        { token: "vec![vec![0; C]; R]", meaning: "the right way to make a grid. Each row is its own Vec" },
      ],
      vizCode: `let (mut top, mut bottom) = (0, r_count - 1);
let (mut left, mut right) = (0, c_count - 1);
while top <= bottom && left <= right {
    // right along top, down right side,
    // left along bottom, up left side
}`,
      starter: `let mut sum = 0;

for i in 0..n {
    sum += ;
}

println!("{}", sum);`,
      rules: {
        regex: ["m\\s*\\[\\s*i\\s*\\]\\s*\\[\\s*i\\s*\\]"],
        hint: "On the main diagonal the row number and the column number are the same, so add m[i][i].",
        success:
          "Correct. The other diagonal is m[i][n - 1 - i]. Watch out with usize walls in the spiral — subtracting from 0 stops the program, so use i64 or guard the subtraction.",
      },
      solution: `let mut sum = 0;

for i in 0..n {
    sum += m[i][i];
}

println!("{}", sum);`,
    },
  },
};
