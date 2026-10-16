import type { ChapterAlt } from "@/lib/dsa/lessons/i18n";

// Sliding Window, in the five languages other than C++.

export const SLIDING_WINDOW_ALT: ChapterAlt = {
  /* ------------------------------------------------------------ fixed -- */
  fixed: {
    c: {
      example: `long long sum = 0;
for (int i = 0; i < k; i++) sum += a[i];

long long best = sum;
for (int i = k; i < n; i++) {
  sum += a[i] - a[i - k];    /* one in, one out */
  if (sum > best) best = sum;
}`,
      notes: [
        { token: "first k added once", meaning: "set the window up before sliding it" },
        { token: "a[i] - a[i - k]", meaning: "the arriving value minus the leaving one" },
        { token: "i - k", meaning: "the index that has just fallen out of the window" },
        { token: "long long", meaning: "10⁵ values near 10⁹ overflow int straight away" },
      ],
      vizCode: `long long sum = 0;
for (int i = 0; i < k; i++) sum += a[i];
long long best = sum;
for (int i = k; i < n; i++) {
  sum += a[i] - a[i - k];
  if (sum > best) best = sum;
}`,
      starter: `long long sum = 0;
for (int i = 0; i < k; i++) sum += a[i];
long long best = sum;

for (int i = k; i < n; i++) {
  sum += ;
  if (sum > best) best = sum;
}`,
      rules: {
        regex: ["a\\[i\\]\\s*-\\s*a\\[\\s*i\\s*-\\s*k\\s*\\]"],
        hint: "sum += a[i] - a[i - k]; — a[i] joins the window, a[i - k] has just left it.",
        success:
          "Correct. Whatever the window keeps — a sum, a count, a table of frequencies — the shape is the same: apply what arrives, undo what leaves.",
      },
      solution: `long long sum = 0;
for (int i = 0; i < k; i++) sum += a[i];
long long best = sum;

for (int i = k; i < n; i++) {
  sum += a[i] - a[i - k];
  if (sum > best) best = sum;
}`,
    },

    python: {
      example: `total = sum(a[:k])          # the first window, added once

best = total
for i in range(k, n):
    total += a[i] - a[i - k]    # one in, one out
    best = max(best, total)`,
      notes: [
        { token: "sum(a[:k])", meaning: "adds the first window in one go" },
        { token: "a[i] - a[i - k]", meaning: "the arriving value minus the leaving one" },
        { token: "i - k", meaning: "the index that has just fallen out of the window" },
        { token: "no overflow", meaning: "Python integers grow as needed, so no long long worry" },
      ],
      vizCode: `total = 0
for i in range(k): total += a[i]
best = total
for i in range(k, n):
    total += a[i] - a[i - k]
    best = max(best, total)`,
      prompt:
        "Write the slide step for a fixed window of size k: add what arrives, subtract what leaves. Do not re-add the whole window.",
      starter: `total = sum(a[:k])
best = total

for i in range(k, n):
    total += 
    best = max(best, total)`,
      rules: {
        mustNot: ["sum(a[i", "sum(a[i-k"],
        regex: ["a\\[i\\]\\s*-\\s*a\\[\\s*i\\s*-\\s*k\\s*\\]"],
        hint: "total += a[i] - a[i - k] — a[i] joins the window, a[i - k] has just left it.",
        success:
          "Correct. Calling sum(a[i-k+1:i+1]) each lap would also give the right answer, but it re-adds k values every time and turns O(n) into O(n·k).",
      },
      solution: `total = sum(a[:k])
best = total

for i in range(k, n):
    total += a[i] - a[i - k]
    best = max(best, total)`,
    },

    java: {
      example: `long sum = 0;
for (int i = 0; i < k; i++) sum += a[i];

long best = sum;
for (int i = k; i < n; i++) {
  sum += a[i] - a[i - k];    // one in, one out
  best = Math.max(best, sum);
}`,
      notes: [
        { token: "first k added once", meaning: "set the window up before sliding it" },
        { token: "a[i] - a[i - k]", meaning: "the arriving value minus the leaving one" },
        { token: "long sum", meaning: "int overflows once the window total passes 2 billion" },
      ],
      vizCode: `long sum = 0;
for (int i = 0; i < k; i++) sum += a[i];
long best = sum;
for (int i = k; i < n; i++) {
  sum += a[i] - a[i - k];
  best = Math.max(best, sum);
}`,
      starter: `long sum = 0;
for (int i = 0; i < k; i++) sum += a[i];
long best = sum;

for (int i = k; i < n; i++) {
  sum += ;
  best = Math.max(best, sum);
}`,
      rules: {
        regex: ["a\\[i\\]\\s*-\\s*a\\[\\s*i\\s*-\\s*k\\s*\\]"],
        hint: "sum += a[i] - a[i - k]; — a[i] joins the window, a[i - k] has just left it.",
        success:
          "Correct. Make the running total a long. With 10⁵ values near a billion, an int total wraps round to a negative number and best goes wrong silently.",
      },
      solution: `long sum = 0;
for (int i = 0; i < k; i++) sum += a[i];
long best = sum;

for (int i = k; i < n; i++) {
  sum += a[i] - a[i - k];
  best = Math.max(best, sum);
}`,
    },

    javascript: {
      example: `let sum = 0;
for (let i = 0; i < k; i++) sum += a[i];

let best = sum;
for (let i = k; i < n; i++) {
  sum += a[i] - a[i - k];    // one in, one out
  best = Math.max(best, sum);
}`,
      notes: [
        { token: "first k added once", meaning: "set the window up before sliding it" },
        { token: "a[i] - a[i - k]", meaning: "the arriving value minus the leaving one" },
        { token: "past 2^53", meaning: "sums stop being exact. Use BigInt if totals get that large" },
      ],
      vizCode: `let sum = 0;
for (let i = 0; i < k; i++) sum += a[i];
let best = sum;
for (let i = k; i < n; i++) {
  sum += a[i] - a[i - k];
  best = Math.max(best, sum);
}`,
      starter: `let sum = 0;
for (let i = 0; i < k; i++) sum += a[i];
let best = sum;

for (let i = k; i < n; i++) {
  sum += ;
  best = Math.max(best, sum);
}`,
      rules: {
        regex: ["a\\[i\\]\\s*-\\s*a\\[\\s*i\\s*-\\s*k\\s*\\]"],
        hint: "sum += a[i] - a[i - k]; — a[i] joins the window, a[i - k] has just left it.",
        success:
          "Correct. JavaScript numbers are exact up to about 9 quadrillion. Past that, adding and subtracting stops being reliable and you need BigInt.",
      },
      solution: `let sum = 0;
for (let i = 0; i < k; i++) sum += a[i];
let best = sum;

for (let i = k; i < n; i++) {
  sum += a[i] - a[i - k];
  best = Math.max(best, sum);
}`,
    },

    rust: {
      example: `let mut sum: i64 = a[..k].iter().sum();

let mut best = sum;
for i in k..n {
    sum += a[i] - a[i - k];    // one in, one out
    best = best.max(sum);
}`,
      notes: [
        { token: "a[..k].iter().sum()", meaning: "adds the first window in one go" },
        { token: "a[i] - a[i - k]", meaning: "the arriving value minus the leaving one" },
        { token: "i64", meaning: "i32 would overflow, and in a debug build that stops the program" },
        { token: "windows(k)", meaning: "the built-in for fixed windows, when you want every slice" },
      ],
      vizCode: `let mut sum: i64 = 0;
for i in 0..k { sum += a[i]; }
let mut best = sum;
for i in k..n {
    sum += a[i] - a[i - k];
    best = best.max(sum);
}`,
      starter: `let mut sum: i64 = a[..k].iter().sum();
let mut best = sum;

for i in k..n {
    sum += ;
    best = best.max(sum);
}`,
      rules: {
        regex: ["a\\[i\\]\\s*-\\s*a\\[\\s*i\\s*-\\s*k\\s*\\]"],
        hint: "sum += a[i] - a[i - k]; — a[i] joins the window, a[i - k] has just left it.",
        success:
          "Correct. Use i64 for the total. Rust catches overflow in a debug build and stops the program, which is loud — but in a release build it wraps round quietly.",
      },
      solution: `let mut sum: i64 = a[..k].iter().sum();
let mut best = sum;

for i in k..n {
    sum += a[i] - a[i - k];
    best = best.max(sum);
}`,
    },
  },

  /* --------------------------------------------------------- variable -- */
  variable: {
    c: {
      example: `int inWindow[128] = {0};      /* one flag per character */
int l = 0, best = 0;

for (int r = 0; r < n; r++) {
  while (inWindow[(unsigned char)s[r]]) {
    inWindow[(unsigned char)s[l]] = 0;
    l++;
  }
  inWindow[(unsigned char)s[r]] = 1;
  if (r - l + 1 > best) best = r - l + 1;
}`,
      notes: [
        { token: "r always moves forward", meaning: "the outer loop never rewinds" },
        { token: "while (broken) l++", meaning: "shrink only as far as needed" },
        { token: "clear the flag before l++", meaning: "undo the leaving character, then move" },
        { token: "r - l + 1", meaning: "the window length. The +1 catches everyone out" },
      ],
      vizCode: `int l = 0, best = 0;
int inWindow[128] = {0};
for (int r = 0; r < n; r++) {
  while (inWindow[s[r]]) {
    inWindow[s[l]] = 0; l++;
  }
  inWindow[s[r]] = 1;
  if (r - l + 1 > best) best = r - l + 1;
}`,
      starter: `int inWindow[128] = {0};
int l = 0, best = 0;

for (int r = 0; r < n; r++) {
  while (inWindow[s[r]]) {
    ;
    l++;
  }
  inWindow[s[r]] = 1;
  if ( > best) best = r - l + 1;
}`,
      rules: {
        regex: ["inWindow\\s*\\[\\s*s\\s*\\[\\s*l\\s*\\]\\s*\\]\\s*=\\s*0", "r\\s*-\\s*l\\s*\\+\\s*1"],
        hint: "Clear the leaving character with inWindow[s[l]] = 0 before l++. The window length is r - l + 1.",
        success:
          "Correct. A flag array beats a hash set here: there are only 128 characters, so the lookup is one step with no hashing at all.",
      },
      solution: `int inWindow[128] = {0};
int l = 0, best = 0;

for (int r = 0; r < n; r++) {
  while (inWindow[s[r]]) {
    inWindow[s[l]] = 0;
    l++;
  }
  inWindow[s[r]] = 1;
  if (r - l + 1 > best) best = r - l + 1;
}`,
    },

    python: {
      example: `in_window = set()
l, best = 0, 0

for r in range(n):
    while s[r] in in_window:
        in_window.remove(s[l])
        l += 1
    in_window.add(s[r])
    best = max(best, r - l + 1)`,
      notes: [
        { token: "r always moves forward", meaning: "the outer loop never rewinds" },
        { token: "while broken: l += 1", meaning: "shrink only as far as needed" },
        { token: "remove(s[l]) before l += 1", meaning: "undo the leaving character, then move" },
        { token: "r - l + 1", meaning: "the window length. The +1 catches everyone out" },
      ],
      vizCode: `l, best = 0, 0
in_window = set()
for r in range(n):
    while s[r] in in_window:
        in_window.remove(s[l]); l += 1

    in_window.add(s[r])
    best = max(best, r - l + 1)`,
      prompt:
        "Complete the window: shrink from the left while the current character is already inside, then record the length.",
      starter: `in_window = set()
l, best = 0, 0

for r in range(n):
    while s[r] in in_window:
        
        l += 1
    in_window.add(s[r])
    best = max(best, )`,
      rules: {
        regex: ["in_window\\.remove\\s*\\(\\s*s\\s*\\[\\s*l\\s*\\]\\s*\\)|in_window\\.discard\\s*\\(\\s*s\\s*\\[\\s*l\\s*\\]\\s*\\)", "r\\s*-\\s*l\\s*\\+\\s*1"],
        hint: "Remove the leaving character with in_window.remove(s[l]) before l += 1. The window length is r - l + 1.",
        success:
          "Correct. The +1 is there because both ends count: a window from index 2 to index 4 holds three characters, not two.",
      },
      solution: `in_window = set()
l, best = 0, 0

for r in range(n):
    while s[r] in in_window:
        in_window.remove(s[l])
        l += 1
    in_window.add(s[r])
    best = max(best, r - l + 1)`,
    },

    java: {
      example: `Set<Character> inWindow = new HashSet<>();
int l = 0, best = 0;

for (int r = 0; r < n; r++) {
  while (inWindow.contains(s.charAt(r))) {
    inWindow.remove(s.charAt(l));
    l++;
  }
  inWindow.add(s.charAt(r));
  best = Math.max(best, r - l + 1);
}`,
      notes: [
        { token: "r always moves forward", meaning: "the outer loop never rewinds" },
        { token: "while (broken) l++", meaning: "shrink only as far as needed" },
        { token: "remove before l++", meaning: "undo the leaving character, then move" },
        { token: "boolean[128]", meaning: "faster than a HashSet here, and no boxing" },
      ],
      vizCode: `int l = 0, best = 0;
Set<Character> inWindow = new HashSet<>();
for (int r = 0; r < n; r++) {
  while (inWindow.contains(s.charAt(r))) {
    inWindow.remove(s.charAt(l)); l++;
  }
  inWindow.add(s.charAt(r));
  best = Math.max(best, r - l + 1);
}`,
      starter: `Set<Character> inWindow = new HashSet<>();
int l = 0, best = 0;

for (int r = 0; r < n; r++) {
  while (inWindow.contains(s.charAt(r))) {
    ;
    l++;
  }
  inWindow.add(s.charAt(r));
  best = Math.max(best, );
}`,
      rules: {
        regex: ["inWindow\\.remove\\s*\\(\\s*s\\.charAt\\s*\\(\\s*l\\s*\\)\\s*\\)", "r\\s*-\\s*l\\s*\\+\\s*1"],
        hint: "Remove the leaving character with inWindow.remove(s.charAt(l)) before l++. The window length is r - l + 1.",
        success:
          "Correct. For plain text a boolean[128] is much faster than a HashSet<Character> — every char would otherwise be boxed into an object.",
      },
      solution: `Set<Character> inWindow = new HashSet<>();
int l = 0, best = 0;

for (int r = 0; r < n; r++) {
  while (inWindow.contains(s.charAt(r))) {
    inWindow.remove(s.charAt(l));
    l++;
  }
  inWindow.add(s.charAt(r));
  best = Math.max(best, r - l + 1);
}`,
    },

    javascript: {
      example: `const inWindow = new Set();
let l = 0, best = 0;

for (let r = 0; r < n; r++) {
  while (inWindow.has(s[r])) {
    inWindow.delete(s[l]);
    l++;
  }
  inWindow.add(s[r]);
  best = Math.max(best, r - l + 1);
}`,
      notes: [
        { token: "r always moves forward", meaning: "the outer loop never rewinds" },
        { token: "inWindow.delete(s[l])", meaning: "delete, not remove — JavaScript names it differently" },
        { token: "delete before l++", meaning: "undo the leaving character, then move" },
        { token: "r - l + 1", meaning: "the window length. The +1 catches everyone out" },
      ],
      vizCode: `let l = 0, best = 0;
const inWindow = new Set();
for (let r = 0; r < n; r++) {
  while (inWindow.has(s[r])) {
    inWindow.delete(s[l]); l++;
  }
  inWindow.add(s[r]);
  best = Math.max(best, r - l + 1);
}`,
      starter: `const inWindow = new Set();
let l = 0, best = 0;

for (let r = 0; r < n; r++) {
  while (inWindow.has(s[r])) {
    ;
    l++;
  }
  inWindow.add(s[r]);
  best = Math.max(best, );
}`,
      rules: {
        regex: ["inWindow\\.delete\\s*\\(\\s*s\\s*\\[\\s*l\\s*\\]\\s*\\)", "r\\s*-\\s*l\\s*\\+\\s*1"],
        hint: "Remove the leaving character with inWindow.delete(s[l]) before l++. The window length is r - l + 1.",
        success:
          "Correct. Note the name: a Set uses .delete(), while an array uses .splice() and an object uses the delete keyword. Three different spellings for one idea.",
      },
      solution: `const inWindow = new Set();
let l = 0, best = 0;

for (let r = 0; r < n; r++) {
  while (inWindow.has(s[r])) {
    inWindow.delete(s[l]);
    l++;
  }
  inWindow.add(s[r]);
  best = Math.max(best, r - l + 1);
}`,
    },

    rust: {
      example: `let b = s.as_bytes();
let mut in_window: HashSet<u8> = HashSet::new();
let (mut l, mut best) = (0usize, 0usize);

for r in 0..n {
    while in_window.contains(&b[r]) {
        in_window.remove(&b[l]);
        l += 1;
    }
    in_window.insert(b[r]);
    best = best.max(r - l + 1);
}`,
      notes: [
        { token: "r always moves forward", meaning: "the outer loop never rewinds" },
        { token: "contains(&b[r])", meaning: "note the & — it takes a reference" },
        { token: "remove before l += 1", meaning: "undo the leaving character, then move" },
        { token: "[false; 128]", meaning: "faster than a HashSet for plain text" },
      ],
      vizCode: `let (mut l, mut best) = (0, 0);
let mut in_window = HashSet::new();
for r in 0..n {
    while in_window.contains(&b[r]) {
        in_window.remove(&b[l]); l += 1;
    }
    in_window.insert(b[r]);
    best = best.max(r - l + 1);
}`,
      starter: `let mut in_window: HashSet<u8> = HashSet::new();
let (mut l, mut best) = (0usize, 0usize);

for r in 0..n {
    while in_window.contains(&b[r]) {
        ;
        l += 1;
    }
    in_window.insert(b[r]);
    best = best.max();
}`,
      rules: {
        regex: ["in_window\\.remove\\s*\\(\\s*&b\\s*\\[\\s*l\\s*\\]\\s*\\)", "r\\s*-\\s*l\\s*\\+\\s*1"],
        hint: "Remove the leaving character with in_window.remove(&b[l]) before l += 1. The window length is r - l + 1.",
        success:
          "Correct. r - l + 1 is safe as a usize here because l never passes r — the while loop stops as soon as the repeat is gone.",
      },
      solution: `let mut in_window: HashSet<u8> = HashSet::new();
let (mut l, mut best) = (0usize, 0usize);

for r in 0..n {
    while in_window.contains(&b[r]) {
        in_window.remove(&b[l]);
        l += 1;
    }
    in_window.insert(b[r]);
    best = best.max(r - l + 1);
}`,
    },
  },
};
