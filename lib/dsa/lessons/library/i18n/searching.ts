import type { ChapterAlt } from "@/lib/dsa/lessons/i18n";

// Searching, in the five languages other than C++.

export const SEARCHING_ALT: ChapterAlt = {
  /* ----------------------------------------------------------- linear -- */
  linear: {
    c: {
      example: `int find(int a[], int n, int target) {
  for (int i = 0; i < n; i++)
    if (a[i] == target) return i;
  return -1;              /* not present */
}`,
      notes: [
        { token: "return i", meaning: "leave the moment you find it" },
        { token: "return -1", meaning: "the usual signal for 'not found'" },
      ],
      vizCode: `for (int i = 0; i < n; i++)
  if (a[i] == target) return i;
return -1;`,
      starter: `int count = 0;

for (int i = 0; i < n; i++) {
  if ( ) ;
}

printf("%d", count);`,
      rules: {
        must: ["count"],
        mustNot: ["break", "return"],
        regex: ["a\\[i\\]\\s*==\\s*target", "count\\+\\+|count\\s*\\+="],
        hint: "if (a[i] == target) count++; — and no break, because there may be more matches ahead.",
        success: "Correct. Searching stops early; counting cannot. Spotting that difference keeps you from leaving a loop too soon.",
      },
      solution: `int count = 0;

for (int i = 0; i < n; i++) {
  if (a[i] == target) count++;
}

printf("%d", count);`,
    },

    python: {
      example: `def find(a, target):
    for i in range(len(a)):
        if a[i] == target:
            return i
    return -1              # not present`,
      notes: [
        { token: "return i", meaning: "leave the moment you find it" },
        { token: "return -1", meaning: "the usual signal for 'not found'" },
        { token: "a.index(target)", meaning: "the built-in. Raises ValueError if it is missing" },
        { token: "target in a", meaning: "also O(n) — it really does check every item" },
      ],
      vizCode: `for i in range(n):
    if a[i] == target: return i
return -1`,
      prompt:
        "Count how many times target appears in the list. Unlike a search, you cannot stop early — a later item might match too. Do not use .count().",
      starter: `count = 0

for i in range(n):
    if :
        

print(count)`,
      rules: {
        must: ["count"],
        mustNot: ["break", "return", ".count("],
        regex: ["a\\[i\\]\\s*==\\s*target", "count\\s*\\+="],
        hint: "if a[i] == target: count += 1 — and no break, because there may be more matches ahead.",
        success:
          "Correct. Python has a.count(target) built in, but it is the same O(n) walk — the built-in does not make it faster, only shorter.",
      },
      solution: `count = 0

for i in range(n):
    if a[i] == target:
        count += 1

print(count)`,
    },

    java: {
      example: `static int find(int[] a, int target) {
  for (int i = 0; i < a.length; i++)
    if (a[i] == target) return i;
  return -1;              // not present
}`,
      notes: [
        { token: "return i", meaning: "leave the moment you find it" },
        { token: "return -1", meaning: "the usual signal for 'not found'" },
        { token: "a.length", meaning: "no brackets, because this is an array" },
      ],
      vizCode: `for (int i = 0; i < n; i++)
  if (a[i] == target) return i;
return -1;`,
      starter: `int count = 0;

for (int i = 0; i < n; i++) {
  if ( ) ;
}

System.out.println(count);`,
      rules: {
        must: ["count"],
        mustNot: ["break", "return"],
        regex: ["a\\[i\\]\\s*==\\s*target", "count\\+\\+|count\\s*\\+="],
        hint: "if (a[i] == target) count++; — and no break, because there may be more matches ahead.",
        success:
          "Correct. == is right for int here. On Integer objects it compares references, and that silently breaks past 127.",
      },
      solution: `int count = 0;

for (int i = 0; i < n; i++) {
  if (a[i] == target) count++;
}

System.out.println(count);`,
    },

    javascript: {
      example: `function find(a, target) {
  for (let i = 0; i < a.length; i++)
    if (a[i] === target) return i;
  return -1;              // not present
}`,
      notes: [
        { token: "return i", meaning: "leave the moment you find it" },
        { token: "return -1", meaning: "the usual signal for 'not found'" },
        { token: "a.indexOf(target)", meaning: "the built-in, and it also returns -1 when missing" },
        { token: "a.includes(x)", meaning: "O(n). A Set's .has(x) is O(1)" },
      ],
      vizCode: `for (let i = 0; i < n; i++)
  if (a[i] === target) return i;
return -1;`,
      prompt:
        "Count how many times target appears in the array. Unlike a search, you cannot stop early — a later item might match too. Do not use .filter().",
      starter: `let count = 0;

for (let i = 0; i < n; i++) {
  if ( ) ;
}

console.log(count);`,
      rules: {
        must: ["count"],
        mustNot: ["break", "return", ".filter("],
        regex: ["a\\[i\\]\\s*===?\\s*target", "count\\+\\+|count\\s*\\+="],
        hint: "if (a[i] === target) count++; — and no break, because there may be more matches ahead.",
        success:
          "Correct. Use === rather than ==. With ==, the string \"5\" would match the number 5, which is almost never what you meant.",
      },
      solution: `let count = 0;

for (let i = 0; i < n; i++) {
  if (a[i] === target) count++;
}

console.log(count);`,
    },

    rust: {
      example: `fn find(a: &[i32], target: i32) -> i64 {
    for i in 0..a.len() {
        if a[i] == target { return i as i64; }
    }
    -1              // not present
}`,
      notes: [
        { token: "return i as i64", meaning: "leave the moment you find it" },
        { token: "-1", meaning: "last line, no semicolon — this is the value handed back" },
        { token: "a.iter().position(|&x| x == target)", meaning: "the built-in. Gives Option instead of -1" },
        { token: "Option<usize>", meaning: "Rust makes you handle 'not found' rather than remembering -1 means it" },
      ],
      vizCode: `for i in 0..n {
    if a[i] == target { return i as i64; }
}
-1`,
      prompt:
        "Count how many times target appears in the array. Unlike a search, you cannot stop early — a later item might match too. Do not use .filter().",
      starter: `let mut count = 0;

for i in 0..n {
    if  { }
}

println!("{}", count);`,
      rules: {
        must: ["count"],
        mustNot: ["break", ".filter("],
        regex: ["a\\[i\\]\\s*==\\s*target", "count\\s*\\+="],
        hint: "if a[i] == target { count += 1; } — and no break, because there may be more matches ahead.",
        success:
          "Correct. Rust's built-in is a.iter().filter(|&&x| x == target).count(), but writing the loop keeps the O(n) walk visible.",
      },
      solution: `let mut count = 0;

for i in 0..n {
    if a[i] == target { count += 1; }
}

println!("{}", count);`,
    },
  },

  /* ----------------------------------------------------------- binary -- */
  binary: {
    c: {
      example: `int binarySearch(int a[], int n, int target) {
  int lo = 0, hi = n - 1;
  while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (a[mid] == target) return mid;
    if (a[mid] < target)  lo = mid + 1;
    else                  hi = mid - 1;
  }
  return -1;
}`,
      notes: [
        { token: "lo + (hi - lo) / 2", meaning: "the safe midpoint. (lo + hi) / 2 can overflow" },
        { token: "while (lo <= hi)", meaning: "pairs with mid + 1 and mid - 1" },
        { token: "lo = mid + 1", meaning: "mid was too small, so leave it out too" },
      ],
      vizCode: `int lo = 0, hi = n - 1;
while (lo <= hi) {
  int mid = lo + (hi - lo) / 2;
  if (a[mid] == target) return mid;
  if (a[mid] < target) lo = mid + 1;
  else                 hi = mid - 1;
}
return -1;`,
      starter: `int lo = 0, hi = n - 1;

while (lo <= hi) {
  int mid = ;
  if (a[mid] == target) return mid;
  if (a[mid] < target) ;
  else ;
}
return -1;`,
      rules: {
        regex: ["lo\\s*\\+\\s*\\(\\s*hi\\s*-\\s*lo\\s*\\)\\s*/\\s*2", "lo\\s*=\\s*mid\\s*\\+\\s*1", "hi\\s*=\\s*mid\\s*-\\s*1"],
        hint: "mid = lo + (hi - lo) / 2. If a[mid] is too small, lo = mid + 1. Otherwise hi = mid - 1. The ±1 is what makes the range shrink.",
        success:
          "Correct. Without the ±1 the range can stop shrinking and the loop hangs. That is the most common binary search bug there is.",
      },
      solution: `int lo = 0, hi = n - 1;

while (lo <= hi) {
  int mid = lo + (hi - lo) / 2;
  if (a[mid] == target) return mid;
  if (a[mid] < target) lo = mid + 1;
  else hi = mid - 1;
}
return -1;`,
    },

    python: {
      example: `def binary_search(a, target):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if a[mid] == target: return mid
        if a[mid] < target:  lo = mid + 1
        else:                hi = mid - 1
    return -1`,
      notes: [
        { token: "//", meaning: "whole-number division. A single / gives a decimal and breaks indexing" },
        { token: "lo + (hi - lo) // 2", meaning: "Python ints never overflow, so (lo + hi) // 2 is also safe here" },
        { token: "bisect_left(a, x)", meaning: "the built-in. First position where x could go" },
        { token: "lo = mid + 1", meaning: "mid was too small, so leave it out too" },
      ],
      vizCode: `lo, hi = 0, n - 1
while lo <= hi:
    mid = lo + (hi - lo) // 2
    if a[mid] == target: return mid
    if a[mid] < target: lo = mid + 1
    else:               hi = mid - 1
return -1`,
      starter: `lo, hi = 0, n - 1

while lo <= hi:
    mid = 
    if a[mid] == target: return mid
    if a[mid] < target: 
    else:               
return -1`,
      rules: {
        regex: ["lo\\s*\\+\\s*\\(\\s*hi\\s*-\\s*lo\\s*\\)\\s*//\\s*2|\\(\\s*lo\\s*\\+\\s*hi\\s*\\)\\s*//\\s*2", "lo\\s*=\\s*mid\\s*\\+\\s*1", "hi\\s*=\\s*mid\\s*-\\s*1"],
        hint:
          "mid = lo + (hi - lo) // 2 — it must be //, because a decimal cannot be used as an index. Then lo = mid + 1 or hi = mid - 1.",
        success:
          "Correct. Python integers grow as large as they need to, so the overflow that forces lo + (hi - lo) // 2 in C++ cannot happen here. The habit is still worth keeping.",
      },
      solution: `lo, hi = 0, n - 1

while lo <= hi:
    mid = lo + (hi - lo) // 2
    if a[mid] == target: return mid
    if a[mid] < target: lo = mid + 1
    else:               hi = mid - 1
return -1`,
    },

    java: {
      example: `static int binarySearch(int[] a, int target) {
  int lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (a[mid] == target) return mid;
    if (a[mid] < target)  lo = mid + 1;
    else                  hi = mid - 1;
  }
  return -1;
}`,
      notes: [
        { token: "lo + (hi - lo) / 2", meaning: "the safe midpoint. (lo + hi) / 2 can overflow int" },
        { token: "while (lo <= hi)", meaning: "pairs with mid + 1 and mid - 1" },
        { token: "Arrays.binarySearch", meaning: "the built-in. Returns a negative number when missing" },
        { token: "this exact overflow", meaning: "was a real bug in Java's own library for nine years" },
      ],
      vizCode: `int lo = 0, hi = n - 1;
while (lo <= hi) {
  int mid = lo + (hi - lo) / 2;
  if (a[mid] == target) return mid;
  if (a[mid] < target) lo = mid + 1;
  else                 hi = mid - 1;
}
return -1;`,
      starter: `int lo = 0, hi = n - 1;

while (lo <= hi) {
  int mid = ;
  if (a[mid] == target) return mid;
  if (a[mid] < target) ;
  else ;
}
return -1;`,
      rules: {
        regex: ["lo\\s*\\+\\s*\\(\\s*hi\\s*-\\s*lo\\s*\\)\\s*/\\s*2", "lo\\s*=\\s*mid\\s*\\+\\s*1", "hi\\s*=\\s*mid\\s*-\\s*1"],
        hint: "mid = lo + (hi - lo) / 2. If a[mid] is too small, lo = mid + 1. Otherwise hi = mid - 1.",
        success:
          "Correct. This is not a made-up worry: Java's own Arrays.binarySearch had the (lo + hi) / 2 overflow bug from 1997 until 2006.",
      },
      solution: `int lo = 0, hi = n - 1;

while (lo <= hi) {
  int mid = lo + (hi - lo) / 2;
  if (a[mid] == target) return mid;
  if (a[mid] < target) lo = mid + 1;
  else hi = mid - 1;
}
return -1;`,
    },

    javascript: {
      example: `function binarySearch(a, target) {
  let lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (a[mid] === target) return mid;
    if (a[mid] < target)   lo = mid + 1;
    else                   hi = mid - 1;
  }
  return -1;
}`,
      notes: [
        { token: "Math.floor", meaning: "without it mid is a decimal, and a[2.5] is undefined" },
        { token: "while (lo <= hi)", meaning: "pairs with mid + 1 and mid - 1" },
        { token: "(hi - lo) >> 1", meaning: "the common shortcut. Same thing, and it also floors" },
      ],
      vizCode: `let lo = 0, hi = n - 1;
while (lo <= hi) {
  const mid = lo + Math.floor((hi - lo) / 2);
  if (a[mid] === target) return mid;
  if (a[mid] < target) lo = mid + 1;
  else                 hi = mid - 1;
}
return -1;`,
      starter: `let lo = 0, hi = n - 1;

while (lo <= hi) {
  const mid = ;
  if (a[mid] === target) return mid;
  if (a[mid] < target) ;
  else ;
}
return -1;`,
      rules: {
        regex: ["Math\\.floor\\s*\\(\\s*\\(\\s*hi\\s*-\\s*lo\\s*\\)\\s*\\/\\s*2\\s*\\)|>>\\s*1", "lo\\s*=\\s*mid\\s*\\+\\s*1", "hi\\s*=\\s*mid\\s*-\\s*1"],
        hint:
          "mid = lo + Math.floor((hi - lo) / 2). Without the floor, mid is a decimal and a[mid] is undefined. Then lo = mid + 1 or hi = mid - 1.",
        success:
          "Correct. This is the JavaScript-only trap: a[2.5] does not round, it gives undefined, and the search then quietly returns the wrong answer.",
      },
      solution: `let lo = 0, hi = n - 1;

while (lo <= hi) {
  const mid = lo + Math.floor((hi - lo) / 2);
  if (a[mid] === target) return mid;
  if (a[mid] < target) lo = mid + 1;
  else hi = mid - 1;
}
return -1;`,
    },

    rust: {
      example: `fn binary_search(a: &[i32], target: i32) -> i64 {
    let (mut lo, mut hi) = (0i64, a.len() as i64 - 1);
    while lo <= hi {
        let mid = lo + (hi - lo) / 2;
        if a[mid as usize] == target { return mid; }
        if a[mid as usize] < target { lo = mid + 1; }
        else                        { hi = mid - 1; }
    }
    -1
}`,
      notes: [
        { token: "0i64, not usize", meaning: "hi = mid - 1 at mid 0 would stop the program if hi were usize" },
        { token: "mid as usize", meaning: "Rust indexes only with usize, and will not convert for you" },
        { token: "a.binary_search(&x)", meaning: "the built-in. Gives Ok(index) or Err(where it would go)" },
      ],
      vizCode: `let (mut lo, mut hi) = (0i64, n as i64 - 1);
while lo <= hi {
    let mid = lo + (hi - lo) / 2;
    if a[mid as usize] == target { return mid; }
    if a[mid as usize] < target { lo = mid + 1; }
    else                        { hi = mid - 1; }
}
-1`,
      starter: `let (mut lo, mut hi) = (0i64, n as i64 - 1);

while lo <= hi {
    let mid = ;
    if a[mid as usize] == target { return mid; }
    if a[mid as usize] < target { }
    else                        { }
}
-1`,
      rules: {
        regex: ["lo\\s*\\+\\s*\\(\\s*hi\\s*-\\s*lo\\s*\\)\\s*/\\s*2", "lo\\s*=\\s*mid\\s*\\+\\s*1", "hi\\s*=\\s*mid\\s*-\\s*1"],
        hint: "mid = lo + (hi - lo) / 2. If a[mid] is too small, lo = mid + 1. Otherwise hi = mid - 1.",
        success:
          "Correct, and using i64 for the bounds is the point. With usize, hi = mid - 1 when mid is 0 goes below zero and stops the program on the spot.",
      },
      solution: `let (mut lo, mut hi) = (0i64, n as i64 - 1);

while lo <= hi {
    let mid = lo + (hi - lo) / 2;
    if a[mid as usize] == target { return mid; }
    if a[mid as usize] < target { lo = mid + 1; }
    else                        { hi = mid - 1; }
}
-1`,
    },
  },

  /* --------------------------------------------------------- onanswer -- */
  onanswer: {
    c: {
      example: `int canFinish(int speed) {
  long long hours = 0;
  for (int i = 0; i < n; i++)
    hours += (piles[i] + speed - 1) / speed;   /* round up */
  return hours <= H;
}

int lo = 1, hi = maxPile;
while (lo < hi) {
  int mid = lo + (hi - lo) / 2;
  if (canFinish(mid)) hi = mid;      /* works — but try slower */
  else                lo = mid + 1;  /* too slow */
}`,
      notes: [
        { token: "canFinish", meaning: "the yes/no test that flips exactly once" },
        { token: "(p + speed - 1) / speed", meaning: "how you round a division up using whole numbers" },
        { token: "hi = mid", meaning: "keep mid — it might be the answer" },
        { token: "while (lo < hi)", meaning: "pairs with hi = mid. When they meet, that is the answer" },
      ],
      vizCode: `int lo = 1, hi = maxPile;
while (lo < hi) {
  int mid = lo + (hi - lo) / 2;
  if (canFinish(mid)) hi = mid;   /* slower is still fine */
  else                lo = mid + 1;
}
return lo;`,
      starter: `int lo = 1, hi = maxPile;

while (lo < hi) {
  int mid = lo + (hi - lo) / 2;
  if (canFinish(mid)) ;
  else ;
}
return lo;`,
      rules: {
        regex: ["hi\\s*=\\s*mid\\s*;", "lo\\s*=\\s*mid\\s*\\+\\s*1"],
        hint: "If mid works, write hi = mid — not mid - 1, because mid itself may be the answer. If it fails, lo = mid + 1.",
        success:
          "Correct, and hi = mid versus hi = mid - 1 is the whole distinction. mid is still a candidate, so throwing it away would lose the answer.",
      },
      solution: `int lo = 1, hi = maxPile;

while (lo < hi) {
  int mid = lo + (hi - lo) / 2;
  if (canFinish(mid)) hi = mid;
  else lo = mid + 1;
}
return lo;`,
    },

    python: {
      example: `def can_finish(speed):
    hours = sum((p + speed - 1) // speed for p in piles)   # round up
    return hours <= H


lo, hi = 1, max(piles)
while lo < hi:
    mid = lo + (hi - lo) // 2
    if can_finish(mid): hi = mid       # works — but try slower
    else:               lo = mid + 1   # too slow`,
      notes: [
        { token: "can_finish", meaning: "the yes/no test that flips exactly once" },
        { token: "(p + speed - 1) // speed", meaning: "rounds up. -(-p // speed) does the same" },
        { token: "hi = mid", meaning: "keep mid — it might be the answer" },
        { token: "while lo < hi", meaning: "pairs with hi = mid. When they meet, that is the answer" },
      ],
      vizCode: `lo, hi = 1, max_pile
while lo < hi:
    mid = lo + (hi - lo) // 2
    if can_finish(mid): hi = mid     # slower is still fine
    else:               lo = mid + 1
return lo`,
      starter: `lo, hi = 1, max_pile

while lo < hi:
    mid = lo + (hi - lo) // 2
    if can_finish(mid): 
    else:               
return lo`,
      rules: {
        regex: ["hi\\s*=\\s*mid(?!\\s*-)", "lo\\s*=\\s*mid\\s*\\+\\s*1"],
        hint: "If mid works, write hi = mid — not mid - 1, because mid itself may be the answer. If it fails, lo = mid + 1.",
        success:
          "Correct. Python's bisect module can do this too, but only on a list you already have. Here the range of answers is imaginary, so the loop is the way.",
      },
      solution: `lo, hi = 1, max_pile

while lo < hi:
    mid = lo + (hi - lo) // 2
    if can_finish(mid): hi = mid
    else:               lo = mid + 1
return lo`,
    },

    java: {
      example: `static boolean canFinish(int speed) {
  long hours = 0;
  for (int p : piles) hours += (p + speed - 1) / speed;   // round up
  return hours <= H;
}

int lo = 1, hi = maxPile;
while (lo < hi) {
  int mid = lo + (hi - lo) / 2;
  if (canFinish(mid)) hi = mid;      // works — but try slower
  else                lo = mid + 1;  // too slow
}`,
      notes: [
        { token: "canFinish", meaning: "the yes/no test that flips exactly once" },
        { token: "long hours", meaning: "the total can pass 2 billion. int would overflow" },
        { token: "hi = mid", meaning: "keep mid — it might be the answer" },
        { token: "while (lo < hi)", meaning: "pairs with hi = mid. When they meet, that is the answer" },
      ],
      vizCode: `int lo = 1, hi = maxPile;
while (lo < hi) {
  int mid = lo + (hi - lo) / 2;
  if (canFinish(mid)) hi = mid;   // slower is still fine
  else                lo = mid + 1;
}
return lo;`,
      starter: `int lo = 1, hi = maxPile;

while (lo < hi) {
  int mid = lo + (hi - lo) / 2;
  if (canFinish(mid)) ;
  else ;
}
return lo;`,
      rules: {
        regex: ["hi\\s*=\\s*mid\\s*;", "lo\\s*=\\s*mid\\s*\\+\\s*1"],
        hint: "If mid works, write hi = mid — not mid - 1, because mid itself may be the answer. If it fails, lo = mid + 1.",
        success:
          "Correct. Make the running total a long: with 10⁵ piles the hours easily pass what an int can hold, and the test then lies to you.",
      },
      solution: `int lo = 1, hi = maxPile;

while (lo < hi) {
  int mid = lo + (hi - lo) / 2;
  if (canFinish(mid)) hi = mid;
  else lo = mid + 1;
}
return lo;`,
    },

    javascript: {
      example: `function canFinish(speed) {
  let hours = 0;
  for (const p of piles) hours += Math.ceil(p / speed);
  return hours <= H;
}

let lo = 1, hi = maxPile;
while (lo < hi) {
  const mid = lo + Math.floor((hi - lo) / 2);
  if (canFinish(mid)) hi = mid;      // works — but try slower
  else                lo = mid + 1;  // too slow
}`,
      notes: [
        { token: "canFinish", meaning: "the yes/no test that flips exactly once" },
        { token: "Math.ceil(p / speed)", meaning: "JavaScript divides with decimals, so ceil works directly" },
        { token: "hi = mid", meaning: "keep mid — it might be the answer" },
        { token: "while (lo < hi)", meaning: "pairs with hi = mid. When they meet, that is the answer" },
      ],
      vizCode: `let lo = 1, hi = maxPile;
while (lo < hi) {
  const mid = lo + Math.floor((hi - lo) / 2);
  if (canFinish(mid)) hi = mid;   // slower is still fine
  else                lo = mid + 1;
}
return lo;`,
      starter: `let lo = 1, hi = maxPile;

while (lo < hi) {
  const mid = lo + Math.floor((hi - lo) / 2);
  if (canFinish(mid)) ;
  else ;
}
return lo;`,
      rules: {
        regex: ["hi\\s*=\\s*mid\\s*;", "lo\\s*=\\s*mid\\s*\\+\\s*1"],
        hint: "If mid works, write hi = mid — not mid - 1, because mid itself may be the answer. If it fails, lo = mid + 1.",
        success:
          "Correct. One nice thing here: because JavaScript divides with decimals, Math.ceil(p / speed) reads better than the (p + speed - 1) / speed trick other languages need.",
      },
      solution: `let lo = 1, hi = maxPile;

while (lo < hi) {
  const mid = lo + Math.floor((hi - lo) / 2);
  if (canFinish(mid)) hi = mid;
  else lo = mid + 1;
}
return lo;`,
    },

    rust: {
      example: `fn can_finish(piles: &[i64], speed: i64, h: i64) -> bool {
    let hours: i64 = piles.iter().map(|p| (p + speed - 1) / speed).sum();
    hours <= h
}

let (mut lo, mut hi) = (1i64, max_pile);
while lo < hi {
    let mid = lo + (hi - lo) / 2;
    if can_finish(piles, mid, h) { hi = mid; }      // works — try slower
    else                         { lo = mid + 1; }  // too slow
}`,
      notes: [
        { token: "can_finish", meaning: "the yes/no test that flips exactly once" },
        { token: "(p + speed - 1) / speed", meaning: "rounds up using whole numbers" },
        { token: "hi = mid", meaning: "keep mid — it might be the answer" },
        { token: "i64 throughout", meaning: "speeds and hours are counts, not indexes, so usize is not needed" },
      ],
      vizCode: `let (mut lo, mut hi) = (1i64, max_pile);
while lo < hi {
    let mid = lo + (hi - lo) / 2;
    if can_finish(mid) { hi = mid; }   // slower is still fine
    else               { lo = mid + 1; }
}
lo`,
      starter: `let (mut lo, mut hi) = (1i64, max_pile);

while lo < hi {
    let mid = lo + (hi - lo) / 2;
    if can_finish(mid) { }
    else               { }
}
lo`,
      rules: {
        regex: ["hi\\s*=\\s*mid\\s*;", "lo\\s*=\\s*mid\\s*\\+\\s*1"],
        hint: "If mid works, write hi = mid — not mid - 1, because mid itself may be the answer. If it fails, lo = mid + 1.",
        success:
          "Correct. Note the last line is just lo with no semicolon, which is how the value comes back out.",
      },
      solution: `let (mut lo, mut hi) = (1i64, max_pile);

while lo < hi {
    let mid = lo + (hi - lo) / 2;
    if can_finish(mid) { hi = mid; }
    else               { lo = mid + 1; }
}
lo`,
    },
  },
};
