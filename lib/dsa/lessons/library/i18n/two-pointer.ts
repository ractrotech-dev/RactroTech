import type { ChapterAlt } from "@/lib/dsa/lessons/i18n";

// Two Pointers, in the five languages other than C++.

export const TWO_POINTER_ALT: ChapterAlt = {
  /* --------------------------------------------------------- opposite -- */
  opposite: {
    c: {
      example: `int i = 0, j = n - 1;

while (i < j) {
  int sum = a[i] + a[j];
  if (sum == target) { found(i, j); break; }
  if (sum < target)  i++;      /* need bigger */
  else               j--;      /* need smaller */
}`,
      notes: [
        { token: "sorted input", meaning: "without it, the moves prove nothing" },
        { token: "sum < target -> i++", meaning: "the only way to raise the total" },
        { token: "sum > target -> j--", meaning: "the only way to lower it" },
      ],
      vizCode: `int i = 0, j = n - 1;
while (i < j) {
  int s = a[i] + a[j];
  if (s == target) return;
  if (s < target) i++;
  else            j--;
}`,
      starter: `int i = 0, j = n - 1;

while (i < j) {
  int sum = a[i] + a[j];
  if (sum == target) break;
  if (sum < target) ;
  else ;
}`,
      rules: {
        regex: ["sum\\s*<\\s*target\\s*\\)?\\s*i\\+\\+", "else\\s*j--"],
        hint: "Too small means you need a bigger number, so i++. Too big means j--.",
        success:
          "Correct. Say the reason out loud as you write it — 'too small, so raise the floor' — and you will never get the direction backwards under pressure.",
      },
      solution: `int i = 0, j = n - 1;

while (i < j) {
  int sum = a[i] + a[j];
  if (sum == target) break;
  if (sum < target) i++;
  else j--;
}`,
    },

    python: {
      example: `i, j = 0, n - 1

while i < j:
    total = a[i] + a[j]
    if total == target:
        return (i, j)
    if total < target: i += 1    # need bigger
    else:              j -= 1    # need smaller`,
      notes: [
        { token: "sorted input", meaning: "without it, the moves prove nothing" },
        { token: "total < target: i += 1", meaning: "the only way to raise the total" },
        { token: "total > target: j -= 1", meaning: "the only way to lower it" },
        { token: "sum", meaning: "avoid it as a variable name — it hides Python's own sum()" },
      ],
      vizCode: `i, j = 0, n - 1
while i < j:
    s = a[i] + a[j]
    if s == target: return (i, j)
    if s < target: i += 1
    else:          j -= 1`,
      starter: `i, j = 0, n - 1

while i < j:
    total = a[i] + a[j]
    if total == target: break
    if total < target: 
    else:              `,
      rules: {
        regex: ["total\\s*<\\s*target\\s*:\\s*i\\s*\\+=\\s*1", "else\\s*:\\s*j\\s*-=\\s*1"],
        hint: "Too small means you need a bigger number, so i += 1. Too big means j -= 1.",
        success:
          "Correct. Note the variable is called total, not sum — naming it sum would shadow Python's built-in and break anything below that uses it.",
      },
      solution: `i, j = 0, n - 1

while i < j:
    total = a[i] + a[j]
    if total == target: break
    if total < target: i += 1
    else:              j -= 1`,
    },

    java: {
      example: `int i = 0, j = n - 1;

while (i < j) {
  int sum = a[i] + a[j];
  if (sum == target) return new int[]{i, j};
  if (sum < target)  i++;      // need bigger
  else               j--;      // need smaller
}`,
      notes: [
        { token: "sorted input", meaning: "without it, the moves prove nothing" },
        { token: "sum < target -> i++", meaning: "the only way to raise the total" },
        { token: "int sum", meaning: "two values near 2 billion overflow. Use long when in doubt" },
      ],
      vizCode: `int i = 0, j = n - 1;
while (i < j) {
  int s = a[i] + a[j];
  if (s == target) return;
  if (s < target) i++;
  else            j--;
}`,
      starter: `int i = 0, j = n - 1;

while (i < j) {
  int sum = a[i] + a[j];
  if (sum == target) break;
  if (sum < target) ;
  else ;
}`,
      rules: {
        regex: ["sum\\s*<\\s*target\\s*\\)?\\s*i\\+\\+", "else\\s*j--"],
        hint: "Too small means you need a bigger number, so i++. Too big means j--.",
        success:
          "Correct. Watch the type of sum: adding two ints near 2 billion wraps round to a negative number, and the comparison then goes the wrong way.",
      },
      solution: `int i = 0, j = n - 1;

while (i < j) {
  int sum = a[i] + a[j];
  if (sum == target) break;
  if (sum < target) i++;
  else j--;
}`,
    },

    javascript: {
      example: `let i = 0, j = n - 1;

while (i < j) {
  const sum = a[i] + a[j];
  if (sum === target) return [i, j];
  if (sum < target)  i++;      // need bigger
  else               j--;      // need smaller
}`,
      notes: [
        { token: "sorted input", meaning: "without it, the moves prove nothing" },
        { token: "a.sort((x, y) => x - y)", meaning: "sort numbers properly first. Plain .sort() sorts as text" },
        { token: "sum < target -> i++", meaning: "the only way to raise the total" },
      ],
      vizCode: `let i = 0, j = n - 1;
while (i < j) {
  const s = a[i] + a[j];
  if (s === target) return [i, j];
  if (s < target) i++;
  else            j--;
}`,
      starter: `let i = 0, j = n - 1;

while (i < j) {
  const sum = a[i] + a[j];
  if (sum === target) break;
  if (sum < target) ;
  else ;
}`,
      rules: {
        regex: ["sum\\s*<\\s*target\\s*\\)?\\s*i\\+\\+", "else\\s*j--"],
        hint: "Too small means you need a bigger number, so i++. Too big means j--.",
        success:
          "Correct. The step before this matters in JavaScript: sort with (x, y) => x - y, because a bare .sort() orders numbers as text and the two-pointer logic then falls apart.",
      },
      solution: `let i = 0, j = n - 1;

while (i < j) {
  const sum = a[i] + a[j];
  if (sum === target) break;
  if (sum < target) i++;
  else j--;
}`,
    },

    rust: {
      example: `let (mut i, mut j) = (0usize, n - 1);

while i < j {
    let sum = a[i] + a[j];
    if sum == target { return Some((i, j)); }
    if sum < target { i += 1; }      // need bigger
    else            { j -= 1; }      // need smaller
}`,
      notes: [
        { token: "sorted input", meaning: "without it, the moves prove nothing" },
        { token: "sum < target -> i += 1", meaning: "the only way to raise the total" },
        { token: "j -= 1 on usize", meaning: "safe here, because the i < j guard stops j reaching 0 first" },
      ],
      vizCode: `let (mut i, mut j) = (0, n - 1);
while i < j {
    let s = a[i] + a[j];
    if s == target { return Some((i, j)); }
    if s < target { i += 1; }
    else          { j -= 1; }
}`,
      starter: `let (mut i, mut j) = (0usize, n - 1);

while i < j {
    let sum = a[i] + a[j];
    if sum == target { break; }
    if sum < target { }
    else            { }
}`,
      rules: {
        regex: ["sum\\s*<\\s*target\\s*\\{\\s*i\\s*\\+=\\s*1", "else\\s*\\{\\s*j\\s*-=\\s*1"],
        hint: "Too small means you need a bigger number, so i += 1. Too big means j -= 1.",
        success:
          "Correct. j -= 1 is safe here only because of the i < j guard — the loop ends before j could reach 0 and go below it.",
      },
      solution: `let (mut i, mut j) = (0usize, n - 1);

while i < j {
    let sum = a[i] + a[j];
    if sum == target { break; }
    if sum < target { i += 1; }
    else            { j -= 1; }
}`,
    },
  },

  /* ------------------------------------------------------------- same -- */
  same: {
    c: {
      vizCode: `int write = 1;

for (int read = 1; read < n; read++) {
  if (a[read] != a[write - 1]) {
    a[write] = a[read];
    write++;
  }
}`,
      example: `int write = 1;                       /* a[0] always stays */

for (int read = 1; read < n; read++) {
  if (a[read] != a[write - 1]) {
    a[write] = a[read];
    write++;
  }
}
/* a[0..write-1] holds the unique values */`,
      notes: [
        { token: "read", meaning: "visits every element and never stops" },
        { token: "write", meaning: "only moves when something is kept" },
        { token: "a[write - 1]", meaning: "the last value actually kept" },
      ],
      starter: `int write = 0;

for (int read = 0; read < n; read++) {
  if ( ) {
    a[write] = a[read];
    write++;
  }
}

while (write < n) { a[write] = 0; write++; }`,
      rules: {
        regex: ["a\\s*\\[\\s*read\\s*\\]\\s*!=\\s*0"],
        hint: "Keep the value when a[read] != 0. The loop afterwards fills the rest with zeros.",
        success:
          "Correct. Two passes over the same array, no extra memory, and the order of the non-zeros is kept.",
      },
      solution: `int write = 0;

for (int read = 0; read < n; read++) {
  if (a[read] != 0) {
    a[write] = a[read];
    write++;
  }
}

while (write < n) { a[write] = 0; write++; }`,
    },

    python: {
      vizCode: `write = 1

for read in range(1, n):
    if a[read] != a[write - 1]:
        a[write] = a[read]
        write += 1
# a[:write] holds the unique values`,
      example: `write = 1                     # a[0] always stays

for read in range(1, n):
    if a[read] != a[write - 1]:
        a[write] = a[read]
        write += 1

# a[:write] holds the unique values`,
      notes: [
        { token: "read", meaning: "visits every item and never stops" },
        { token: "write", meaning: "only moves when something is kept" },
        { token: "a[:write]", meaning: "the finished part, as a slice" },
        { token: "[x for x in a if x]", meaning: "shorter, but it builds a whole new list" },
      ],
      prompt:
        "Move every zero to the end of the list while keeping the order of the non-zero values. Use a write pointer. Do not build a new list.",
      starter: `write = 0

for read in range(n):
    if :
        a[write] = a[read]
        write += 1

while write < n:
    a[write] = 0
    write += 1`,
      rules: {
        mustNot: ["for x in a if", "filter("],
        regex: ["a\\s*\\[\\s*read\\s*\\]\\s*!=\\s*0"],
        hint: "Keep the value when a[read] != 0. The loop afterwards fills the rest with zeros.",
        success:
          "Correct. A list comprehension is shorter but allocates a second list. This version changes the original in place, with no extra memory.",
      },
      solution: `write = 0

for read in range(n):
    if a[read] != 0:
        a[write] = a[read]
        write += 1

while write < n:
    a[write] = 0
    write += 1`,
    },

    java: {
      vizCode: `int write = 1;

for (int read = 1; read < n; read++) {
  if (a[read] != a[write - 1]) {
    a[write] = a[read];
    write++;
  }
}`,
      example: `int write = 1;                       // a[0] always stays

for (int read = 1; read < n; read++) {
  if (a[read] != a[write - 1]) {
    a[write] = a[read];
    write++;
  }
}
// a[0..write-1] holds the unique values`,
      notes: [
        { token: "read", meaning: "visits every element and never stops" },
        { token: "write", meaning: "only moves when something is kept" },
        { token: "a[write - 1]", meaning: "the last value actually kept" },
      ],
      starter: `int write = 0;

for (int read = 0; read < n; read++) {
  if ( ) {
    a[write] = a[read];
    write++;
  }
}

while (write < n) { a[write] = 0; write++; }`,
      rules: {
        regex: ["a\\s*\\[\\s*read\\s*\\]\\s*!=\\s*0"],
        hint: "Keep the value when a[read] != 0. The loop afterwards fills the rest with zeros.",
        success:
          "Correct. Doing it in place beats building an ArrayList and copying back — no allocation and no boxing of every int.",
      },
      solution: `int write = 0;

for (int read = 0; read < n; read++) {
  if (a[read] != 0) {
    a[write] = a[read];
    write++;
  }
}

while (write < n) { a[write] = 0; write++; }`,
    },

    javascript: {
      vizCode: `let write = 1;

for (let read = 1; read < n; read++) {
  if (a[read] !== a[write - 1]) {
    a[write] = a[read];
    write++;
  }
}`,
      example: `let write = 1;                       // a[0] always stays

for (let read = 1; read < n; read++) {
  if (a[read] !== a[write - 1]) {
    a[write] = a[read];
    write++;
  }
}
// a.slice(0, write) holds the unique values`,
      notes: [
        { token: "read", meaning: "visits every element and never stops" },
        { token: "write", meaning: "only moves when something is kept" },
        { token: "a.filter(x => x !== 0)", meaning: "shorter, but it builds a whole new array" },
        { token: "a.splice", meaning: "avoid inside a loop — each call shifts everything after it" },
      ],
      prompt:
        "Move every zero to the end of the array while keeping the order of the non-zero values. Use a write pointer. Do not build a new array.",
      starter: `let write = 0;

for (let read = 0; read < n; read++) {
  if ( ) {
    a[write] = a[read];
    write++;
  }
}

while (write < n) { a[write] = 0; write++; }`,
      rules: {
        mustNot: [".filter(", ".splice("],
        regex: ["a\\s*\\[\\s*read\\s*\\]\\s*!==?\\s*0"],
        hint: "Keep the value when a[read] !== 0. The loop afterwards fills the rest with zeros.",
        success:
          "Correct. Never reach for .splice() here: each call shifts every element after it, turning an O(n) job into O(n²).",
      },
      solution: `let write = 0;

for (let read = 0; read < n; read++) {
  if (a[read] !== 0) {
    a[write] = a[read];
    write++;
  }
}

while (write < n) { a[write] = 0; write++; }`,
    },

    rust: {
      vizCode: `let mut write = 1;

for read in 1..a.len() {
    if a[read] != a[write - 1] {
        a[write] = a[read];
        write += 1;
    }
}`,
      example: `let mut write = 1;                   // a[0] always stays

for read in 1..n {
    if a[read] != a[write - 1] {
        a[write] = a[read];
        write += 1;
    }
}
// &a[..write] holds the unique values`,
      notes: [
        { token: "read", meaning: "visits every element and never stops" },
        { token: "write", meaning: "only moves when something is kept" },
        { token: "&a[..write]", meaning: "a slice of the finished part — no copy" },
        { token: "a.retain(|&x| x != 0)", meaning: "the built-in, and it does keep the order" },
      ],
      prompt:
        "Move every zero to the end of the array while keeping the order of the non-zero values. Use a write pointer. Do not use .retain().",
      starter: `let mut write = 0;

for read in 0..n {
    if  {
        a[write] = a[read];
        write += 1;
    }
}

while write < n { a[write] = 0; write += 1; }`,
      rules: {
        mustNot: [".retain(", ".filter("],
        regex: ["a\\s*\\[\\s*read\\s*\\]\\s*!=\\s*0"],
        hint: "Keep the value when a[read] != 0. The loop afterwards fills the rest with zeros.",
        success:
          "Correct. Rust allows this because only one index is written at a time — try to hold two mutable references into the array at once and the compiler will stop you.",
      },
      solution: `let mut write = 0;

for read in 0..n {
    if a[read] != 0 {
        a[write] = a[read];
        write += 1;
    }
}

while write < n { a[write] = 0; write += 1; }`,
    },
  },
};
