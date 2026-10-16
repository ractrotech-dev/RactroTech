import type { ChapterAlt } from "@/lib/dsa/lessons/i18n";

// Sorting, in the five languages other than C++.

export const SORTING_ALT: ChapterAlt = {
  /* ----------------------------------------------------------- bubble -- */
  bubble: {
    c: {
      example: `for (int i = 0; i < n - 1; i++) {
  int swapped = 0;
  for (int j = 0; j < n - 1 - i; j++) {
    if (a[j] > a[j + 1]) {
      int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
      swapped = 1;
    }
  }
  if (!swapped) break;      /* already sorted — stop */
}`,
      notes: [
        { token: "n - 1 - i", meaning: "the last i places are already final" },
        { token: "a[j] > a[j + 1]", meaning: "compares neighbours only" },
        { token: "if (!swapped) break", meaning: "makes already-sorted input cost O(n)" },
        { token: "qsort", meaning: "what C actually gives you. It needs a compare function" },
      ],
      vizCode: `for (int i = 0; i < n - 1; i++)
  for (int j = 0; j < n - 1 - i; j++)
    if (a[j] > a[j + 1])
      { int t = a[j]; a[j] = a[j+1]; a[j+1] = t; }`,
      starter: `for (int i = 0; i < n - 1; i++) {
  for (int j = 0; j < ; j++) {
    if ( ) { int t = a[j]; a[j] = a[j+1]; a[j+1] = t; }
  }
}`,
      rules: {
        regex: ["n\\s*-\\s*1\\s*-\\s*i", "a\\[j\\]\\s*>\\s*a\\[j\\s*\\+\\s*1\\]"],
        hint: "The inner gate is j < n - 1 - i, and the test is a[j] > a[j + 1].",
        success:
          "Correct. In real C you would call qsort, which takes a compare function returning a negative number, zero, or a positive number.",
      },
      solution: `for (int i = 0; i < n - 1; i++) {
  for (int j = 0; j < n - 1 - i; j++) {
    if (a[j] > a[j + 1]) { int t = a[j]; a[j] = a[j+1]; a[j+1] = t; }
  }
}`,
    },

    python: {
      example: `for i in range(n - 1):
    swapped = False
    for j in range(n - 1 - i):
        if a[j] > a[j + 1]:
            a[j], a[j + 1] = a[j + 1], a[j]
            swapped = True
    if not swapped:
        break            # already sorted — stop`,
      notes: [
        { token: "range(n - 1 - i)", meaning: "the last i places are already final" },
        { token: "a[j], a[j+1] = a[j+1], a[j]", meaning: "Python swaps in one line" },
        { token: "if not swapped: break", meaning: "makes already-sorted input cost O(n)" },
        { token: "a.sort()", meaning: "what you should really use. Timsort, and it is stable" },
      ],
      vizCode: `for i in range(n - 1):
    for j in range(n - 1 - i):
        if a[j] > a[j + 1]:
            a[j], a[j + 1] = a[j + 1], a[j]`,
      prompt:
        "Write the inner loop of bubble sort so it stops before the already-sorted tail, and swaps out-of-order neighbours. Do not use .sort().",
      starter: `for i in range(n - 1):
    for j in range():
        if :
            a[j], a[j + 1] = a[j + 1], a[j]`,
      rules: {
        mustNot: [".sort()", "sorted("],
        regex: ["range\\s*\\(\\s*n\\s*-\\s*1\\s*-\\s*i\\s*\\)", "a\\[j\\]\\s*>\\s*a\\[j\\s*\\+\\s*1\\]"],
        hint: "The inner loop is range(n - 1 - i), and the test is a[j] > a[j + 1].",
        success:
          "Correct. Python's own a.sort() is Timsort, which spots runs that are already in order — so on nearly-sorted data it is close to O(n).",
      },
      solution: `for i in range(n - 1):
    for j in range(n - 1 - i):
        if a[j] > a[j + 1]:
            a[j], a[j + 1] = a[j + 1], a[j]`,
    },

    java: {
      example: `for (int i = 0; i < n - 1; i++) {
  boolean swapped = false;
  for (int j = 0; j < n - 1 - i; j++) {
    if (a[j] > a[j + 1]) {
      int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
      swapped = true;
    }
  }
  if (!swapped) break;      // already sorted — stop
}`,
      notes: [
        { token: "n - 1 - i", meaning: "the last i places are already final" },
        { token: "int t", meaning: "Java has no swap for ints — use a spare box" },
        { token: "Arrays.sort(int[])", meaning: "dual-pivot quicksort. Fast, but NOT stable" },
        { token: "Arrays.sort(Integer[])", meaning: "merge sort, and stable. The type decides" },
      ],
      vizCode: `for (int i = 0; i < n - 1; i++)
  for (int j = 0; j < n - 1 - i; j++)
    if (a[j] > a[j + 1])
      { int t = a[j]; a[j] = a[j+1]; a[j+1] = t; }`,
      starter: `for (int i = 0; i < n - 1; i++) {
  for (int j = 0; j < ; j++) {
    if ( ) { int t = a[j]; a[j] = a[j+1]; a[j+1] = t; }
  }
}`,
      rules: {
        regex: ["n\\s*-\\s*1\\s*-\\s*i", "a\\[j\\]\\s*>\\s*a\\[j\\s*\\+\\s*1\\]"],
        hint: "The inner gate is j < n - 1 - i, and the test is a[j] > a[j + 1].",
        success:
          "Correct. Worth knowing: Arrays.sort on int[] is not stable, but on Integer[] it is. Same method name, different algorithm underneath.",
      },
      solution: `for (int i = 0; i < n - 1; i++) {
  for (int j = 0; j < n - 1 - i; j++) {
    if (a[j] > a[j + 1]) { int t = a[j]; a[j] = a[j+1]; a[j+1] = t; }
  }
}`,
    },

    javascript: {
      example: `for (let i = 0; i < n - 1; i++) {
  let swapped = false;
  for (let j = 0; j < n - 1 - i; j++) {
    if (a[j] > a[j + 1]) {
      [a[j], a[j + 1]] = [a[j + 1], a[j]];
      swapped = true;
    }
  }
  if (!swapped) break;      // already sorted — stop
}`,
      notes: [
        { token: "n - 1 - i", meaning: "the last i places are already final" },
        { token: "[a[j], a[j+1]] = [a[j+1], a[j]]", meaning: "swaps in one line" },
        { token: "a.sort()", meaning: "sorts as TEXT by default. [10, 9] becomes [10, 9]" },
        { token: "a.sort((x, y) => x - y)", meaning: "what you actually want for numbers" },
      ],
      vizCode: `for (let i = 0; i < n - 1; i++)
  for (let j = 0; j < n - 1 - i; j++)
    if (a[j] > a[j + 1])
      [a[j], a[j + 1]] = [a[j + 1], a[j]];`,
      prompt:
        "Write the inner loop of bubble sort so it stops before the already-sorted tail, and swaps out-of-order neighbours. Do not use .sort().",
      starter: `for (let i = 0; i < n - 1; i++) {
  for (let j = 0; j < ; j++) {
    if ( ) [a[j], a[j + 1]] = [a[j + 1], a[j]];
  }
}`,
      rules: {
        mustNot: [".sort("],
        regex: ["n\\s*-\\s*1\\s*-\\s*i", "a\\[j\\]\\s*>\\s*a\\[j\\s*\\+\\s*1\\]"],
        hint: "The inner gate is j < n - 1 - i, and the test is a[j] > a[j + 1].",
        success:
          "Correct. And remember the JavaScript trap: [10, 9, 100].sort() gives [10, 100, 9], because it compares them as text. Always pass (x, y) => x - y.",
      },
      solution: `for (let i = 0; i < n - 1; i++) {
  for (let j = 0; j < n - 1 - i; j++) {
    if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
  }
}`,
    },

    rust: {
      example: `for i in 0..n - 1 {
    let mut swapped = false;
    for j in 0..n - 1 - i {
        if a[j] > a[j + 1] {
            a.swap(j, j + 1);
            swapped = true;
        }
    }
    if !swapped { break; }      // already sorted — stop
}`,
      notes: [
        { token: "0..n - 1 - i", meaning: "the last i places are already final" },
        { token: "a.swap(j, j + 1)", meaning: "built in, and it keeps the borrow checker happy" },
        { token: "a.sort()", meaning: "stable merge sort" },
        { token: "a.sort_unstable()", meaning: "quicksort. Faster, and it may reorder equal items" },
      ],
      vizCode: `for i in 0..n - 1 {
    for j in 0..n - 1 - i {
        if a[j] > a[j + 1] {
            a.swap(j, j + 1); } }`,
      prompt:
        "Write the inner loop of bubble sort so it stops before the already-sorted tail, and swaps out-of-order neighbours. Do not use .sort().",
      starter: `for i in 0..n - 1 {
    for j in  {
        if  {
            a.swap(j, j + 1);
        }
    }
}`,
      rules: {
        mustNot: [".sort()", ".sort_unstable()"],
        regex: ["0\\.\\.\\s*n\\s*-\\s*1\\s*-\\s*i", "a\\[j\\]\\s*>\\s*a\\[j\\s*\\+\\s*1\\]"],
        hint: "The inner loop is 0..n - 1 - i, and the test is a[j] > a[j + 1].",
        success:
          "Correct. a.swap(i, j) exists partly because Rust would otherwise refuse the swap — you cannot borrow two parts of the same array at once.",
      },
      solution: `for i in 0..n - 1 {
    for j in 0..n - 1 - i {
        if a[j] > a[j + 1] {
            a.swap(j, j + 1);
        }
    }
}`,
    },
  },


  /* -------------------------------------------------------- selection -- */
  selection: {
    c: {
      example: `for (int i = 0; i < n - 1; i++) {
  int least = i;
  for (int j = i + 1; j < n; j++)
    if (a[j] < a[least]) least = j;
  int t = a[i]; a[i] = a[least]; a[least] = t;
}`,
      notes: [
        { token: "least = i", meaning: "assume the first unsorted item is the smallest" },
        { token: "j = i + 1", meaning: "only the unsorted part needs checking" },
        { token: "one swap per i", meaning: "at most n - 1 swaps in total" },
      ],
      vizCode: `for (int i = 0; i < n - 1; i++) {
  int least = i;
  for (int j = i + 1; j < n; j++)
    if (a[j] < a[least]) least = j;
  SWAP(a[i], a[least]);
}`,
      starter: `for (int i = 0; i < n - 1; i++) {
  int least = i;
  for (int j = i + 1; j < n; j++)
    if ( ) least = j;
  int t = a[i]; a[i] = a[ ]; a[least] = t;
}`,
      rules: {
        regex: ["a\\[j\\]\\s*<\\s*a\\[least\\]", "a\\[i\\]\\s*=\\s*a\\[\\s*least\\s*\\]"],
        hint: "Track the position: if (a[j] < a[least]) least = j; Then swap a[i] with a[least] using a temporary.",
        success:
          "Correct. Selection sort is the one to reach for in C when writing is costly — flash memory, for instance, where each write wears the chip a little.",
      },
      solution: `for (int i = 0; i < n - 1; i++) {
  int least = i;
  for (int j = i + 1; j < n; j++)
    if (a[j] < a[least]) least = j;
  int t = a[i]; a[i] = a[least]; a[least] = t;
}`,
    },

    python: {
      example: `for i in range(n - 1):
    least = i
    for j in range(i + 1, n):
        if a[j] < a[least]:
            least = j
    a[i], a[least] = a[least], a[i]`,
      notes: [
        { token: "least = i", meaning: "assume the first unsorted item is the smallest" },
        { token: "range(i + 1, n)", meaning: "only the unsorted part needs checking" },
        { token: "min(a[i:])", meaning: "gives the value. You need the index, so use range and compare" },
        { token: "a[i:].index(min(...))", meaning: "shorter, but it walks the list twice" },
      ],
      vizCode: `for i in range(n - 1):
    least = i
    for j in range(i + 1, n):
        if a[j] < a[least]: least = j
    a[i], a[least] = a[least], a[i]`,
      prompt:
        "Write the inner loop of selection sort: find the POSITION of the smallest value in the unsorted part, then swap it into place. Do not use min().",
      starter: `for i in range(n - 1):
    least = i
    for j in range(i + 1, n):
        if :
            least = j
    a[i], a[] = a[least], a[i]`,
      rules: {
        mustNot: ["min(", ".sort()"],
        regex: ["a\\[j\\]\\s*<\\s*a\\[least\\]", "a\\[i\\]\\s*,\\s*a\\[least\\]\\s*=\\s*a\\[least\\]\\s*,\\s*a\\[i\\]"],
        hint: "Track the position: if a[j] < a[least]: least = j. Then swap with a[i], a[least] = a[least], a[i].",
        success:
          "Correct. Python's min() would hand you the value, not the position — and you need the position in order to swap it.",
      },
      solution: `for i in range(n - 1):
    least = i
    for j in range(i + 1, n):
        if a[j] < a[least]:
            least = j
    a[i], a[least] = a[least], a[i]`,
    },

    java: {
      example: `for (int i = 0; i < n - 1; i++) {
  int least = i;
  for (int j = i + 1; j < n; j++)
    if (a[j] < a[least]) least = j;
  int t = a[i]; a[i] = a[least]; a[least] = t;
}`,
      notes: [
        { token: "least = i", meaning: "assume the first unsorted item is the smallest" },
        { token: "j = i + 1", meaning: "only the unsorted part needs checking" },
        { token: "one swap per i", meaning: "at most n - 1 swaps in total" },
      ],
      vizCode: `for (int i = 0; i < n - 1; i++) {
  int least = i;
  for (int j = i + 1; j < n; j++)
    if (a[j] < a[least]) least = j;
  swap(a, i, least);
}`,
      starter: `for (int i = 0; i < n - 1; i++) {
  int least = i;
  for (int j = i + 1; j < n; j++)
    if ( ) least = j;
  int t = a[i]; a[i] = a[ ]; a[least] = t;
}`,
      rules: {
        regex: ["a\\[j\\]\\s*<\\s*a\\[least\\]", "a\\[i\\]\\s*=\\s*a\\[\\s*least\\s*\\]"],
        hint: "Track the position: if (a[j] < a[least]) least = j; Then swap a[i] with a[least] using a temporary.",
        success:
          "Correct. Selection sort is not stable, by the way: swapping a distant element over equal ones moves them past each other.",
      },
      solution: `for (int i = 0; i < n - 1; i++) {
  int least = i;
  for (int j = i + 1; j < n; j++)
    if (a[j] < a[least]) least = j;
  int t = a[i]; a[i] = a[least]; a[least] = t;
}`,
    },

    javascript: {
      example: `for (let i = 0; i < n - 1; i++) {
  let least = i;
  for (let j = i + 1; j < n; j++)
    if (a[j] < a[least]) least = j;
  [a[i], a[least]] = [a[least], a[i]];
}`,
      notes: [
        { token: "least = i", meaning: "assume the first unsorted item is the smallest" },
        { token: "j = i + 1", meaning: "only the unsorted part needs checking" },
        { token: "indexOf(Math.min(...))", meaning: "shorter, but it walks the array twice per round" },
      ],
      vizCode: `for (let i = 0; i < n - 1; i++) {
  let least = i;
  for (let j = i + 1; j < n; j++)
    if (a[j] < a[least]) least = j;
  [a[i], a[least]] = [a[least], a[i]];
}`,
      prompt:
        "Write the inner loop of selection sort: find the POSITION of the smallest value in the unsorted part, then swap it into place. Do not use Math.min.",
      starter: `for (let i = 0; i < n - 1; i++) {
  let least = i;
  for (let j = i + 1; j < n; j++)
    if ( ) least = j;
  [a[i], a[]] = [a[least], a[i]];
}`,
      rules: {
        mustNot: ["Math.min", ".sort("],
        regex: ["a\\[j\\]\\s*<\\s*a\\[least\\]", "\\[a\\[i\\]\\s*,\\s*a\\[least\\]\\]\\s*=\\s*\\[a\\[least\\]\\s*,\\s*a\\[i\\]\\]"],
        hint: "Track the position: if (a[j] < a[least]) least = j; Then swap with destructuring.",
        success:
          "Correct. Note `let least` rather than const — it changes inside the loop, so const would throw.",
      },
      solution: `for (let i = 0; i < n - 1; i++) {
  let least = i;
  for (let j = i + 1; j < n; j++)
    if (a[j] < a[least]) least = j;
  [a[i], a[least]] = [a[least], a[i]];
}`,
    },

    rust: {
      example: `for i in 0..n - 1 {
    let mut least = i;
    for j in i + 1..n {
        if a[j] < a[least] { least = j; }
    }
    a.swap(i, least);
}`,
      notes: [
        { token: "let mut least", meaning: "it changes inside the loop, so it needs mut" },
        { token: "i + 1..n", meaning: "only the unsorted part needs checking" },
        { token: "a.swap(i, least)", meaning: "built in, and it keeps the borrow checker happy" },
        { token: "iter().min()", meaning: "gives the value. position_min needs the itertools crate" },
      ],
      vizCode: `for i in 0..n - 1 {
    let mut least = i;
    for j in i + 1..n {
        if a[j] < a[least] { least = j; } }
    a.swap(i, least);
}`,
      prompt:
        "Write the inner loop of selection sort: find the POSITION of the smallest value in the unsorted part, then swap it into place.",
      starter: `for i in 0..n - 1 {
    let mut least = i;
    for j in i + 1..n {
        if  { least = j; }
    }
    a.swap(i, );
}`,
      rules: {
        regex: ["a\\[j\\]\\s*<\\s*a\\[least\\]", "a\\.swap\\s*\\(\\s*i\\s*,\\s*least\\s*\\)"],
        hint: "Track the position: if a[j] < a[least] { least = j; } Then a.swap(i, least).",
        success:
          "Correct. a.swap is what makes this compile at all — a hand-written swap would need two mutable borrows of the same array at once, which Rust forbids.",
      },
      solution: `for i in 0..n - 1 {
    let mut least = i;
    for j in i + 1..n {
        if a[j] < a[least] { least = j; }
    }
    a.swap(i, least);
}`,
    },
  },

  /* --------------------------------------------------------- counting -- */
  counting: {
    c: {
      example: `int count[K] = {0};
for (int i = 0; i < n; i++) count[a[i]]++;   /* tally */

int at = 0;
for (int v = 0; v < K; v++)
  while (count[v]-- > 0) a[at++] = v;        /* rebuild */`,
      notes: [
        { token: "int count[K] = {0}", meaning: "one slot per possible value, all zeroed" },
        { token: "count[a[i]]++", meaning: "the value is the index — that is the whole trick" },
        { token: "K on the stack", meaning: "a large K overflows it. Use calloc for big ranges" },
      ],
      starter: `int count[K] = {0};

for (int i = 0; i < n; i++) ;

int at = 0;
for (int v = 0; v < K; v++)
  while (count[v]-- > 0) a[at++] = ;`,
      rules: {
        regex: ["count\\s*\\[\\s*a\\[i\\]\\s*\\]\\+\\+", "a\\[at\\+\\+\\]\\s*=\\s*v"],
        hint: "Tally with count[a[i]]++. When rebuilding write out v — the slot number IS the value.",
        success:
          "Correct. Watch where the count array lives: int count[1000000] on the stack will crash. Use calloc for anything large.",
      },
      solution: `int count[K] = {0};

for (int i = 0; i < n; i++) count[a[i]]++;

int at = 0;
for (int v = 0; v < K; v++)
  while (count[v]-- > 0) a[at++] = v;`,
    },

    python: {
      example: `count = [0] * K
for x in a:
    count[x] += 1          # tally — no comparisons

at = 0
for v in range(K):
    for _ in range(count[v]):
        a[at] = v
        at += 1

# or, using the built-in tally
from collections import Counter
c = Counter(a)`,
      notes: [
        { token: "[0] * K", meaning: "one slot per possible value" },
        { token: "count[x] += 1", meaning: "the value is the index — that is the whole trick" },
        { token: "Counter(a)", meaning: "the built-in tally. Same idea, written for you" },
        { token: "negative values", meaning: "would index from the end. Shift them by the minimum first" },
      ],
      prompt:
        "Write counting sort: tally each value into its own slot, then rebuild the list by walking the slots in order. Do not use Counter or sorted().",
      starter: `count = [0] * K

for x in a:
    

at = 0
for v in range(K):
    for _ in range(count[v]):
        a[at] = 
        at += 1`,
      rules: {
        mustNot: ["Counter", "sorted(", ".sort()"],
        regex: ["count\\s*\\[\\s*x\\s*\\]\\s*\\+=\\s*1", "a\\[at\\]\\s*=\\s*v"],
        hint: "Tally with count[x] += 1. When rebuilding write a[at] = v — the slot number IS the value.",
        success:
          "Correct. One Python-only danger: a negative value would index from the END of the list rather than failing, so shift everything by the minimum first.",
      },
      solution: `count = [0] * K

for x in a:
    count[x] += 1

at = 0
for v in range(K):
    for _ in range(count[v]):
        a[at] = v
        at += 1`,
    },

    java: {
      example: `int[] count = new int[K];
for (int x : a) count[x]++;          // tally

int at = 0;
for (int v = 0; v < K; v++)
  while (count[v]-- > 0) a[at++] = v; // rebuild`,
      notes: [
        { token: "new int[K]", meaning: "one slot per possible value, zeroed for you" },
        { token: "count[x]++", meaning: "the value is the index — that is the whole trick" },
        { token: "K in memory", meaning: "an int is 4 bytes, so K = 10⁹ would be 4 GB" },
      ],
      starter: `int[] count = new int[K];

for (int x : a) ;

int at = 0;
for (int v = 0; v < K; v++)
  while (count[v]-- > 0) a[at++] = ;`,
      rules: {
        regex: ["count\\s*\\[\\s*x\\s*\\]\\+\\+", "a\\[at\\+\\+\\]\\s*=\\s*v"],
        hint: "Tally with count[x]++. When rebuilding write out v — the slot number IS the value.",
        success:
          "Correct. Java zeroes a new int[] for you, so unlike C there is no separate clearing step.",
      },
      solution: `int[] count = new int[K];

for (int x : a) count[x]++;

int at = 0;
for (int v = 0; v < K; v++)
  while (count[v]-- > 0) a[at++] = v;`,
    },

    javascript: {
      example: `const count = new Array(K).fill(0);
for (const x of a) count[x]++;        // tally

let at = 0;
for (let v = 0; v < K; v++)
  while (count[v]-- > 0) a[at++] = v; // rebuild`,
      notes: [
        { token: ".fill(0)", meaning: "without it every slot is undefined and ++ gives NaN" },
        { token: "count[x]++", meaning: "the value is the index — that is the whole trick" },
        { token: "Int32Array(K)", meaning: "far less memory than a normal array for a big K" },
      ],
      prompt:
        "Write counting sort: tally each value into its own slot, then rebuild the array by walking the slots in order. Do not use .sort().",
      starter: `const count = new Array(K).fill(0);

for (const x of a) ;

let at = 0;
for (let v = 0; v < K; v++)
  while (count[v]-- > 0) a[at++] = ;`,
      rules: {
        mustNot: [".sort("],
        regex: ["count\\s*\\[\\s*x\\s*\\]\\+\\+", "a\\[at\\+\\+\\]\\s*=\\s*v"],
        hint: "Tally with count[x]++. When rebuilding write out v — the slot number IS the value.",
        success:
          "Correct, and the .fill(0) is essential: an empty slot holds undefined, and undefined++ is NaN rather than 1.",
      },
      solution: `const count = new Array(K).fill(0);

for (const x of a) count[x]++;

let at = 0;
for (let v = 0; v < K; v++)
  while (count[v]-- > 0) a[at++] = v;`,
    },

    rust: {
      example: `let mut count = vec![0usize; K];
for &x in a.iter() { count[x as usize] += 1; }   // tally

let mut at = 0;
for v in 0..K {
    for _ in 0..count[v] {
        a[at] = v as i32;
        at += 1;
    }
}`,
      notes: [
        { token: "vec![0usize; K]", meaning: "one slot per possible value" },
        { token: "x as usize", meaning: "Rust indexes only with usize, and will not convert for you" },
        { token: "negative values", meaning: "cannot index at all here — shift by the minimum first" },
        { token: "vec! of size K", meaning: "allocated on the heap, so a large K will not blow the stack" },
      ],
      prompt:
        "Write counting sort: tally each value into its own slot, then rebuild the vector by walking the slots in order.",
      starter: `let mut count = vec![0usize; K];

for &x in a.iter() { }

let mut at = 0;
for v in 0..K {
    for _ in 0..count[v] {
        a[at] = ;
        at += 1;
    }
}`,
      rules: {
        regex: ["count\\s*\\[\\s*x\\s+as\\s+usize\\s*\\]\\s*\\+=\\s*1", "a\\[at\\]\\s*=\\s*v\\s+as\\s+i32"],
        hint: "Tally with count[x as usize] += 1. When rebuilding write a[at] = v as i32.",
        success:
          "Correct. All the casting is Rust refusing to guess: an index must be usize, and the stored value must be i32, so both conversions have to be written out.",
      },
      solution: `let mut count = vec![0usize; K];

for &x in a.iter() { count[x as usize] += 1; }

let mut at = 0;
for v in 0..K {
    for _ in 0..count[v] {
        a[at] = v as i32;
        at += 1;
    }
}`,
    },
  },

  /* ------------------------------------------------------------ radix -- */
  radix: {
    c: {
      example: `int maxVal = a[0];
for (int i = 1; i < n; i++) if (a[i] > maxVal) maxVal = a[i];

for (int exp = 1; maxVal / exp > 0; exp *= 10)
  countingSortByDigit(a, n, exp);   /* must be STABLE */

/* the digit of x at this place */
int d = (x / exp) % 10;`,
      notes: [
        { token: "exp = 1, then 10, 100", meaning: "the place value being sorted on" },
        { token: "(x / exp) % 10", meaning: "pulls out one digit" },
        { token: "must be STABLE", meaning: "or the previous pass's ordering is destroyed" },
        { token: "negative numbers", meaning: "need separate handling — split, sort, reverse the negatives" },
      ],
      starter: `for (int exp = 1; maxVal / exp > 0; ) {
  countingSortByDigit(a, n, exp);
}

int d = ;`,
      rules: {
        regex: ["exp\\s*\\*=\\s*10", "\\(\\s*x\\s*/\\s*exp\\s*\\)\\s*%\\s*10"],
        hint: "Step with exp *= 10. The digit is (x / exp) % 10.",
        success:
          "Correct. Note exp can overflow int on very large values — long long is safer for the place counter.",
      },
      solution: `for (int exp = 1; maxVal / exp > 0; exp *= 10) {
  countingSortByDigit(a, n, exp);
}

int d = (x / exp) % 10;`,
    },

    python: {
      example: `max_val = max(a)

exp = 1
while max_val // exp > 0:
    counting_sort_by_digit(a, exp)   # must be STABLE
    exp *= 10

# the digit of x at this place
d = (x // exp) % 10`,
      notes: [
        { token: "exp = 1, then 10, 100", meaning: "the place value being sorted on" },
        { token: "(x // exp) % 10", meaning: "pulls out one digit. Must be //, not /" },
        { token: "must be STABLE", meaning: "or the previous pass's ordering is destroyed" },
        { token: "sorted(a, key=...)", meaning: "Python's sort is stable, so it can be the inner pass" },
      ],
      prompt:
        "Write the loop that walks the place values, and the expression that pulls out one digit of x at that place.",
      starter: `exp = 1
while max_val // exp > 0:
    counting_sort_by_digit(a, exp)
    

d = `,
      rules: {
        regex: ["exp\\s*\\*=\\s*10", "\\(\\s*x\\s*//\\s*exp\\s*\\)\\s*%\\s*10"],
        hint: "Step with exp *= 10. The digit is (x // exp) % 10 — it must be //, or you get a decimal.",
        success:
          "Correct. Because Python's own sort is stable, sorted(a, key=lambda x: (x // exp) % 10) is a perfectly valid inner pass.",
      },
      solution: `exp = 1
while max_val // exp > 0:
    counting_sort_by_digit(a, exp)
    exp *= 10

d = (x // exp) % 10`,
    },

    java: {
      example: `int maxVal = Arrays.stream(a).max().getAsInt();

for (int exp = 1; maxVal / exp > 0; exp *= 10)
  countingSortByDigit(a, exp);   // must be STABLE

// the digit of x at this place
int d = (x / exp) % 10;`,
      notes: [
        { token: "exp = 1, then 10, 100", meaning: "the place value being sorted on" },
        { token: "(x / exp) % 10", meaning: "pulls out one digit" },
        { token: "must be STABLE", meaning: "or the previous pass's ordering is destroyed" },
        { token: "Arrays.sort on Integer[]", meaning: "stable, so it can serve as the inner pass" },
      ],
      starter: `for (int exp = 1; maxVal / exp > 0; ) {
  countingSortByDigit(a, exp);
}

int d = ;`,
      rules: {
        regex: ["exp\\s*\\*=\\s*10", "\\(\\s*x\\s*/\\s*exp\\s*\\)\\s*%\\s*10"],
        hint: "Step with exp *= 10. The digit is (x / exp) % 10.",
        success:
          "Correct. If you use a library sort as the inner pass, pick a stable one — Arrays.sort on int[] is NOT stable and would break this.",
      },
      solution: `for (int exp = 1; maxVal / exp > 0; exp *= 10) {
  countingSortByDigit(a, exp);
}

int d = (x / exp) % 10;`,
    },

    javascript: {
      example: `const maxVal = Math.max(...a);

for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10)
  countingSortByDigit(a, exp);   // must be STABLE

// the digit of x at this place
const d = Math.floor(x / exp) % 10;`,
      notes: [
        { token: "exp = 1, then 10, 100", meaning: "the place value being sorted on" },
        { token: "Math.floor(x / exp) % 10", meaning: "the floor is required — / keeps decimals" },
        { token: "must be STABLE", meaning: "Array.prototype.sort is stable, so it qualifies" },
        { token: "Math.max(...a)", meaning: "breaks on very large arrays. Use a loop instead" },
      ],
      prompt:
        "Write the loop that walks the place values, and the expression that pulls out one digit of x at that place.",
      starter: `for (let exp = 1; Math.floor(maxVal / exp) > 0; ) {
  countingSortByDigit(a, exp);
}

const d = ;`,
      rules: {
        regex: ["exp\\s*\\*=\\s*10", "Math\\.floor\\s*\\(\\s*x\\s*\\/\\s*exp\\s*\\)\\s*%\\s*10"],
        hint: "Step with exp *= 10. The digit is Math.floor(x / exp) % 10 — without the floor you get a decimal.",
        success:
          "Correct. JavaScript's sort has been stable since 2019, so it can be used directly as the inner pass with a digit key.",
      },
      solution: `for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
  countingSortByDigit(a, exp);
}

const d = Math.floor(x / exp) % 10;`,
    },

    rust: {
      example: `let max_val = *a.iter().max().unwrap();

let mut exp = 1i64;
while max_val / exp > 0 {
    counting_sort_by_digit(a, exp);   // must be STABLE
    exp *= 10;
}

// the digit of x at this place
let d = ((x / exp) % 10) as usize;`,
      notes: [
        { token: "exp = 1, then 10, 100", meaning: "the place value being sorted on" },
        { token: "(x / exp) % 10", meaning: "integer division, so no floor is needed" },
        { token: "must be STABLE", meaning: "a.sort_by_key is stable; sort_unstable_by_key is not" },
        { token: "as usize", meaning: "needed if the digit is used as an index" },
      ],
      prompt:
        "Write the loop that walks the place values, and the expression that pulls out one digit of x at that place.",
      starter: `let mut exp = 1i64;
while max_val / exp > 0 {
    counting_sort_by_digit(a, exp);
    
}

let d = ((  ) % 10) as usize;`,
      rules: {
        regex: ["exp\\s*\\*=\\s*10", "x\\s*/\\s*exp"],
        hint: "Step with exp *= 10. The digit is ((x / exp) % 10) as usize.",
        success:
          "Correct, and mind which sort you use inside: sort_by_key is stable and works here, but sort_unstable_by_key would undo every earlier pass.",
      },
      solution: `let mut exp = 1i64;
while max_val / exp > 0 {
    counting_sort_by_digit(a, exp);
    exp *= 10;
}

let d = ((x / exp) % 10) as usize;`,
    },
  },

  /* -------------------------------------------------------- insertion -- */
  insertion: {
    c: {
      example: `for (int i = 1; i < n; i++) {
  int key = a[i];
  int j = i - 1;
  while (j >= 0 && a[j] > key) {
    a[j + 1] = a[j];      /* shift right */
    j--;
  }
  a[j + 1] = key;         /* drop into the gap */
}`,
      notes: [
        { token: "key = a[i]", meaning: "save it first — the shifting overwrites that slot" },
        { token: "j >= 0 && a[j] > key", meaning: "check the edge before reading a[j]" },
        { token: "a[j + 1] = key", meaning: "+1 because j went one step too far" },
      ],
      vizCode: `for (int i = 1; i < n; i++) {
  int key = a[i], j = i - 1;
  while (j >= 0 && a[j] > key) {
    a[j + 1] = a[j];
    j--;
  }
  a[j + 1] = key;
}`,
      starter: `for (int i = 1; i < n; i++) {
  int key = a[i];
  int j = i - 1;
  while ( ) {
    a[j + 1] = a[j];
    j--;
  }
  a[ ] = key;
}`,
      rules: {
        regex: ["j\\s*>=\\s*0\\s*&&\\s*a\\[j\\]\\s*>\\s*key", "a\\s*\\[\\s*j\\s*\\+\\s*1\\s*\\]\\s*=\\s*key"],
        hint: "The gate is j >= 0 && a[j] > key. The j >= 0 must come first, or you read a[-1]. Afterwards put the key at a[j + 1].",
        success:
          "Correct. C checks the left side of && first and stops there if it is false, which is what keeps a[j] from being read out of bounds.",
      },
      solution: `for (int i = 1; i < n; i++) {
  int key = a[i];
  int j = i - 1;
  while (j >= 0 && a[j] > key) {
    a[j + 1] = a[j];
    j--;
  }
  a[j + 1] = key;
}`,
    },

    python: {
      example: `for i in range(1, n):
    key = a[i]
    j = i - 1
    while j >= 0 and a[j] > key:
        a[j + 1] = a[j]      # shift right
        j -= 1
    a[j + 1] = key           # drop into the gap`,
      notes: [
        { token: "key = a[i]", meaning: "save it first — the shifting overwrites that slot" },
        { token: "j >= 0 and a[j] > key", meaning: "check the edge before reading a[j]" },
        { token: "a[-1] in Python", meaning: "does not crash — it reads the LAST item. A silent wrong answer" },
        { token: "insort from bisect", meaning: "the built-in version of 'slide it into place'" },
      ],
      vizCode: `for i in range(1, n):
    key, j = a[i], i - 1
    while j >= 0 and a[j] > key:
        a[j + 1] = a[j]
        j -= 1

    a[j + 1] = key`,
      starter: `for i in range(1, n):
    key = a[i]
    j = i - 1
    while :
        a[j + 1] = a[j]
        j -= 1
    a[] = key`,
      rules: {
        regex: ["j\\s*>=\\s*0\\s+and\\s+a\\[j\\]\\s*>\\s*key", "a\\s*\\[\\s*j\\s*\\+\\s*1\\s*\\]\\s*=\\s*key"],
        hint: "The gate is j >= 0 and a[j] > key. The j >= 0 must come first. Afterwards put the key at a[j + 1].",
        success:
          "Correct, and in Python the j >= 0 guard matters even more than in C++. There a[-1] reads memory you do not own; here it quietly reads the last item and gives a wrong answer with no crash at all.",
      },
      solution: `for i in range(1, n):
    key = a[i]
    j = i - 1
    while j >= 0 and a[j] > key:
        a[j + 1] = a[j]
        j -= 1
    a[j + 1] = key`,
    },

    java: {
      example: `for (int i = 1; i < n; i++) {
  int key = a[i];
  int j = i - 1;
  while (j >= 0 && a[j] > key) {
    a[j + 1] = a[j];      // shift right
    j--;
  }
  a[j + 1] = key;         // drop into the gap
}`,
      notes: [
        { token: "key = a[i]", meaning: "save it first — the shifting overwrites that slot" },
        { token: "j >= 0 && a[j] > key", meaning: "check the edge before reading a[j]" },
        { token: "a[-1] in Java", meaning: "throws immediately. Better than C's silent corruption" },
      ],
      vizCode: `for (int i = 1; i < n; i++) {
  int key = a[i], j = i - 1;
  while (j >= 0 && a[j] > key) {
    a[j + 1] = a[j];
    j--;
  }
  a[j + 1] = key;
}`,
      starter: `for (int i = 1; i < n; i++) {
  int key = a[i];
  int j = i - 1;
  while ( ) {
    a[j + 1] = a[j];
    j--;
  }
  a[ ] = key;
}`,
      rules: {
        regex: ["j\\s*>=\\s*0\\s*&&\\s*a\\[j\\]\\s*>\\s*key", "a\\s*\\[\\s*j\\s*\\+\\s*1\\s*\\]\\s*=\\s*key"],
        hint: "The gate is j >= 0 && a[j] > key. The j >= 0 must come first. Afterwards put the key at a[j + 1].",
        success:
          "Correct. Java checks every index, so getting the guard wrong throws an exception straight away rather than corrupting something quietly.",
      },
      solution: `for (int i = 1; i < n; i++) {
  int key = a[i];
  int j = i - 1;
  while (j >= 0 && a[j] > key) {
    a[j + 1] = a[j];
    j--;
  }
  a[j + 1] = key;
}`,
    },

    javascript: {
      example: `for (let i = 1; i < n; i++) {
  const key = a[i];
  let j = i - 1;
  while (j >= 0 && a[j] > key) {
    a[j + 1] = a[j];      // shift right
    j--;
  }
  a[j + 1] = key;         // drop into the gap
}`,
      notes: [
        { token: "key = a[i]", meaning: "save it first — the shifting overwrites that slot" },
        { token: "j >= 0 && a[j] > key", meaning: "check the edge before reading a[j]" },
        { token: "a[-1] in JavaScript", meaning: "gives undefined, and undefined > key is false — so it happens to stop" },
      ],
      vizCode: `for (let i = 1; i < n; i++) {
  const key = a[i], j = i - 1;
  while (j >= 0 && a[j] > key) {
    a[j + 1] = a[j];
    j--;
  }
  a[j + 1] = key;
}`,
      starter: `for (let i = 1; i < n; i++) {
  const key = a[i];
  let j = i - 1;
  while ( ) {
    a[j + 1] = a[j];
    j--;
  }
  a[ ] = key;
}`,
      rules: {
        regex: ["j\\s*>=\\s*0\\s*&&\\s*a\\[j\\]\\s*>\\s*key", "a\\s*\\[\\s*j\\s*\\+\\s*1\\s*\\]\\s*=\\s*key"],
        hint: "The gate is j >= 0 && a[j] > key. Afterwards put the key at a[j + 1].",
        success:
          "Correct. Keep the guard even though JavaScript would survive without it: a[-1] gives undefined, and comparisons with undefined are always false — which is luck, not correctness.",
      },
      solution: `for (let i = 1; i < n; i++) {
  const key = a[i];
  let j = i - 1;
  while (j >= 0 && a[j] > key) {
    a[j + 1] = a[j];
    j--;
  }
  a[j + 1] = key;
}`,
    },

    rust: {
      example: `for i in 1..n {
    let key = a[i];
    let mut j = i as i64 - 1;
    while j >= 0 && a[j as usize] > key {
        a[(j + 1) as usize] = a[j as usize];   // shift right
        j -= 1;
    }
    a[(j + 1) as usize] = key;                 // drop into the gap
}`,
      notes: [
        { token: "j as i64", meaning: "j must go to -1 to stop, and usize cannot" },
        { token: "j >= 0 && ...", meaning: "check the edge before reading a[j]" },
        { token: "a[(j + 1) as usize]", meaning: "back to usize, because that is what indexes need" },
      ],
      vizCode: `for i in 1..n {
    let key = a[i]; let mut j = i as i64 - 1;
    while j >= 0 && a[j as usize] > key {
        a[(j + 1) as usize] = a[j as usize];
        j -= 1;
    }
    a[(j + 1) as usize] = key;
}`,
      starter: `for i in 1..n {
    let key = a[i];
    let mut j = i as i64 - 1;
    while  {
        a[(j + 1) as usize] = a[j as usize];
        j -= 1;
    }
    a[] = key;
}`,
      rules: {
        regex: ["j\\s*>=\\s*0\\s*&&\\s*a\\[j\\s+as\\s+usize\\]\\s*>\\s*key", "a\\[\\(j\\s*\\+\\s*1\\)\\s*as\\s+usize\\]\\s*=\\s*key"],
        hint: "The gate is j >= 0 && a[j as usize] > key. Afterwards put the key at a[(j + 1) as usize].",
        success:
          "Correct, and this is why j is an i64 here. With usize, j -= 1 at zero would stop the program before the guard ever got a chance to be false.",
      },
      solution: `for i in 1..n {
    let key = a[i];
    let mut j = i as i64 - 1;
    while j >= 0 && a[j as usize] > key {
        a[(j + 1) as usize] = a[j as usize];
        j -= 1;
    }
    a[(j + 1) as usize] = key;
}`,
    },
  },

  /* ------------------------------------------------------------ merge -- */
  merge: {
    c: {
      example: `void merge(int l, int m, int r) {
  int tmp[MAX], k = 0;
  int i = l, j = m + 1;
  while (i <= m && j <= r)
    tmp[k++] = (a[i] <= a[j]) ? a[i++] : a[j++];   /* <= keeps it stable */
  while (i <= m) tmp[k++] = a[i++];
  while (j <= r) tmp[k++] = a[j++];
  for (int x = 0; x < k; x++) a[l + x] = tmp[x];
}`,
      notes: [
        { token: "l >= r", meaning: "one element is already sorted" },
        { token: "a[i] <= a[j]", meaning: "the <= is what makes the sort stable" },
        { token: "two trailing whiles", meaning: "one half runs out first — copy the rest" },
        { token: "int tmp[MAX]", meaning: "C has no vector, so the scratch space is yours to manage" },
      ],
      vizCode: `void mergeSort(int l, int r) {
  if (l >= r) return;
  int m = (l + r) / 2;
  mergeSort(l, m);
  mergeSort(m + 1, r);
  merge(l, m, r);      /* walk both halves once */
}`,
      starter: `int i = l, j = m + 1, k = 0;

while (i <= m && j <= r) {
  if ( ) tmp[k++] = a[i++];
  else    tmp[k++] = a[j++];
}`,
      rules: {
        regex: ["a\\[i\\]\\s*<=\\s*a\\[j\\]"],
        hint: "Take from the left half when a[i] <= a[j]. Use <= rather than <, so equal items keep their original order.",
        success:
          "Correct. With < instead of <=, equal items would come from the right half first and the sort would stop being stable.",
      },
      solution: `int i = l, j = m + 1, k = 0;

while (i <= m && j <= r) {
  if (a[i] <= a[j]) tmp[k++] = a[i++];
  else              tmp[k++] = a[j++];
}`,
    },

    python: {
      example: `def merge(l, m, r):
    tmp = []
    i, j = l, m + 1
    while i <= m and j <= r:
        if a[i] <= a[j]:          # <= keeps it stable
            tmp.append(a[i]); i += 1
        else:
            tmp.append(a[j]); j += 1
    tmp += a[i:m + 1]
    tmp += a[j:r + 1]
    a[l:r + 1] = tmp`,
      notes: [
        { token: "l >= r", meaning: "one element is already sorted" },
        { token: "a[i] <= a[j]", meaning: "the <= is what makes the sort stable" },
        { token: "a[i:m + 1]", meaning: "a slice — it copies the rest of that half in one go" },
        { token: "a[l:r + 1] = tmp", meaning: "writes the merged part back into the original list" },
      ],
      vizCode: `def merge_sort(l, r):
    if l >= r: return
    m = (l + r) // 2
    merge_sort(l, m)
    merge_sort(m + 1, r)
    merge(l, m, r)   # walk both halves once`,
      prompt:
        "Write the main merge loop: while both halves still have items, take the smaller front item. Keep equal items in their original order.",
      starter: `i, j = l, m + 1

while i <= m and j <= r:
    if :
        tmp.append(a[i]); i += 1
    else:
        tmp.append(a[j]); j += 1`,
      rules: {
        regex: ["a\\[i\\]\\s*<=\\s*a\\[j\\]"],
        hint: "Take from the left half when a[i] <= a[j]. Use <= rather than <, so equal items keep their original order.",
        success:
          "Correct. Python's own sort is stable for exactly this reason, which is what lets you sort by one key and then another and keep both orders.",
      },
      solution: `i, j = l, m + 1

while i <= m and j <= r:
    if a[i] <= a[j]:
        tmp.append(a[i]); i += 1
    else:
        tmp.append(a[j]); j += 1`,
    },

    java: {
      example: `static void merge(int l, int m, int r) {
  int[] tmp = new int[r - l + 1];
  int i = l, j = m + 1, k = 0;
  while (i <= m && j <= r)
    tmp[k++] = (a[i] <= a[j]) ? a[i++] : a[j++];   // <= keeps it stable
  while (i <= m) tmp[k++] = a[i++];
  while (j <= r) tmp[k++] = a[j++];
  System.arraycopy(tmp, 0, a, l, tmp.length);
}`,
      notes: [
        { token: "l >= r", meaning: "one element is already sorted" },
        { token: "a[i] <= a[j]", meaning: "the <= is what makes the sort stable" },
        { token: "System.arraycopy", meaning: "faster than a loop for copying back" },
        { token: "Collections.sort", meaning: "merge sort underneath, and stable" },
      ],
      vizCode: `static void mergeSort(int l, int r) {
  if (l >= r) return;
  int m = (l + r) / 2;
  mergeSort(l, m);
  mergeSort(m + 1, r);
  merge(l, m, r);      // walk both halves once
}`,
      starter: `int i = l, j = m + 1, k = 0;

while (i <= m && j <= r) {
  if ( ) tmp[k++] = a[i++];
  else    tmp[k++] = a[j++];
}`,
      rules: {
        regex: ["a\\[i\\]\\s*<=\\s*a\\[j\\]"],
        hint: "Take from the left half when a[i] <= a[j]. Use <= rather than <, so equal items keep their original order.",
        success:
          "Correct. This is the algorithm behind Collections.sort and Arrays.sort on objects — which is why both of those are stable.",
      },
      solution: `int i = l, j = m + 1, k = 0;

while (i <= m && j <= r) {
  if (a[i] <= a[j]) tmp[k++] = a[i++];
  else              tmp[k++] = a[j++];
}`,
    },

    javascript: {
      example: `function merge(l, m, r) {
  const tmp = [];
  let i = l, j = m + 1;
  while (i <= m && j <= r)
    tmp.push(a[i] <= a[j] ? a[i++] : a[j++]);   // <= keeps it stable
  while (i <= m) tmp.push(a[i++]);
  while (j <= r) tmp.push(a[j++]);
  for (let k = 0; k < tmp.length; k++) a[l + k] = tmp[k];
}`,
      notes: [
        { token: "l >= r", meaning: "one element is already sorted" },
        { token: "a[i] <= a[j]", meaning: "the <= is what makes the sort stable" },
        { token: "two trailing whiles", meaning: "one half runs out first — copy the rest" },
        { token: "Array.prototype.sort", meaning: "guaranteed stable since 2019" },
      ],
      vizCode: `function mergeSort(l, r) {
  if (l >= r) return;
  const m = Math.floor((l + r) / 2);
  mergeSort(l, m);
  mergeSort(m + 1, r);
  merge(l, m, r);      // walk both halves once
}`,
      starter: `let i = l, j = m + 1;

while (i <= m && j <= r) {
  if ( ) tmp.push(a[i++]);
  else    tmp.push(a[j++]);
}`,
      rules: {
        regex: ["a\\[i\\]\\s*<=\\s*a\\[j\\]"],
        hint: "Take from the left half when a[i] <= a[j]. Use <= rather than <, so equal items keep their original order.",
        success:
          "Correct. Note Math.floor on the midpoint — (l + r) / 2 gives a decimal in JavaScript, and a decimal index quietly gives undefined.",
      },
      solution: `let i = l, j = m + 1;

while (i <= m && j <= r) {
  if (a[i] <= a[j]) tmp.push(a[i++]);
  else              tmp.push(a[j++]);
}`,
    },

    rust: {
      example: `fn merge(a: &mut Vec<i32>, l: usize, m: usize, r: usize) {
    let mut tmp = Vec::with_capacity(r - l + 1);
    let (mut i, mut j) = (l, m + 1);
    while i <= m && j <= r {
        if a[i] <= a[j] { tmp.push(a[i]); i += 1; }   // <= keeps it stable
        else            { tmp.push(a[j]); j += 1; }
    }
    while i <= m { tmp.push(a[i]); i += 1; }
    while j <= r { tmp.push(a[j]); j += 1; }
    a[l..=r].copy_from_slice(&tmp);
}`,
      notes: [
        { token: "l >= r", meaning: "one element is already sorted" },
        { token: "a[i] <= a[j]", meaning: "the <= is what makes the sort stable" },
        { token: "&mut Vec<i32>", meaning: "borrowed so it can be changed, without copying it" },
        { token: "a.sort()", meaning: "this same algorithm. sort_unstable is quicksort" },
      ],
      vizCode: `fn merge_sort(l: usize, r: usize) {
    if l >= r { return; }
    let m = (l + r) / 2;
    merge_sort(l, m);
    merge_sort(m + 1, r);
    merge(l, m, r);      // walk both halves once
}`,
      starter: `let (mut i, mut j) = (l, m + 1);

while i <= m && j <= r {
    if  { tmp.push(a[i]); i += 1; }
    else { tmp.push(a[j]); j += 1; }
}`,
      rules: {
        regex: ["a\\[i\\]\\s*<=\\s*a\\[j\\]"],
        hint: "Take from the left half when a[i] <= a[j]. Use <= rather than <, so equal items keep their original order.",
        success:
          "Correct. Rust's a.sort() is this algorithm, and it is stable. a.sort_unstable() is quicksort — quicker, and it may shuffle equal items.",
      },
      solution: `let (mut i, mut j) = (l, m + 1);

while i <= m && j <= r {
    if a[i] <= a[j] { tmp.push(a[i]); i += 1; }
    else { tmp.push(a[j]); j += 1; }
}`,
    },
  },

  /* ------------------------------------------------------------ quick -- */
  quick: {
    c: {
      example: `int partition(int lo, int hi) {
  int pivot = a[hi];
  int i = lo - 1;                       /* end of the "smaller" zone */
  for (int j = lo; j < hi; j++)
    if (a[j] < pivot) { i++; int t = a[i]; a[i] = a[j]; a[j] = t; }
  int t = a[i + 1]; a[i + 1] = a[hi]; a[hi] = t;
  return i + 1;
}`,
      notes: [
        { token: "i = lo - 1", meaning: "the smaller-zone starts out empty" },
        { token: "i++ then swap", meaning: "grow the zone, then move the item into it" },
        { token: "quickSort(p + 1, hi)", meaning: "p is skipped — it is already in its final place" },
      ],
      vizCode: `int pivot = a[hi];
int i = lo - 1;
for (int j = lo; j < hi; j++)
  if (a[j] < pivot) { i++; SWAP(a[i], a[j]); }
SWAP(a[i + 1], a[hi]);
return i + 1;`,
      starter: `int pivot = a[hi];
int i = lo - 1;

for (int j = lo; j < hi; j++) {
  if ( ) {
    i++;
    int t = a[i]; ; a[j] = t;
  }
}`,
      rules: {
        regex: ["a\\[j\\]\\s*<\\s*pivot", "a\\[i\\]\\s*=\\s*a\\[j\\]"],
        hint: "Test a[j] < pivot. Then i++, and swap by hand: int t = a[i]; a[i] = a[j]; a[j] = t;",
        success:
          "Correct. Each item is looked at once, so one partition is O(n) — and it puts one value in its final place for good.",
      },
      solution: `int pivot = a[hi];
int i = lo - 1;

for (int j = lo; j < hi; j++) {
  if (a[j] < pivot) {
    i++;
    int t = a[i]; a[i] = a[j]; a[j] = t;
  }
}`,
    },

    python: {
      example: `def partition(lo, hi):
    pivot = a[hi]
    i = lo - 1                        # end of the "smaller" zone
    for j in range(lo, hi):
        if a[j] < pivot:
            i += 1
            a[i], a[j] = a[j], a[i]
    a[i + 1], a[hi] = a[hi], a[i + 1]  # pivot goes home
    return i + 1`,
      notes: [
        { token: "i = lo - 1", meaning: "the smaller-zone starts out empty" },
        { token: "a[i], a[j] = a[j], a[i]", meaning: "swaps in one line" },
        { token: "recursion limit", meaning: "a bad pivot can nest 10⁵ deep and Python will stop you" },
        { token: "random.shuffle first", meaning: "the usual protection against the worst case" },
      ],
      vizCode: `pivot = a[hi]
i = lo - 1
for j in range(lo, hi):
    if a[j] < pivot: i += 1; a[i], a[j] = a[j], a[i]
a[i + 1], a[hi] = a[hi], a[i + 1]
return i + 1`,
      starter: `pivot = a[hi]
i = lo - 1

for j in range(lo, hi):
    if :
        i += 1
        `,
      rules: {
        regex: ["a\\[j\\]\\s*<\\s*pivot", "a\\[i\\]\\s*,\\s*a\\[j\\]\\s*=\\s*a\\[j\\]\\s*,\\s*a\\[i\\]"],
        hint: "Test a[j] < pivot. Then i += 1 and swap with a[i], a[j] = a[j], a[i].",
        success:
          "Correct. Watch the depth in Python: a sorted input with a last-element pivot recurses n deep, and Python stops at about 1000 calls.",
      },
      solution: `pivot = a[hi]
i = lo - 1

for j in range(lo, hi):
    if a[j] < pivot:
        i += 1
        a[i], a[j] = a[j], a[i]`,
    },

    java: {
      example: `static int partition(int lo, int hi) {
  int pivot = a[hi];
  int i = lo - 1;                       // end of the "smaller" zone
  for (int j = lo; j < hi; j++)
    if (a[j] < pivot) { i++; int t = a[i]; a[i] = a[j]; a[j] = t; }
  int t = a[i + 1]; a[i + 1] = a[hi]; a[hi] = t;
  return i + 1;
}`,
      notes: [
        { token: "i = lo - 1", meaning: "the smaller-zone starts out empty" },
        { token: "i++ then swap", meaning: "grow the zone, then move the item into it" },
        { token: "dual-pivot", meaning: "Java's Arrays.sort uses two pivots, not one" },
      ],
      vizCode: `int pivot = a[hi];
int i = lo - 1;
for (int j = lo; j < hi; j++)
  if (a[j] < pivot) { i++; swap(i, j); }
swap(i + 1, hi);
return i + 1;`,
      starter: `int pivot = a[hi];
int i = lo - 1;

for (int j = lo; j < hi; j++) {
  if ( ) {
    i++;
    int t = a[i]; ; a[j] = t;
  }
}`,
      rules: {
        regex: ["a\\[j\\]\\s*<\\s*pivot", "a\\[i\\]\\s*=\\s*a\\[j\\]"],
        hint: "Test a[j] < pivot. Then i++, and swap by hand: int t = a[i]; a[i] = a[j]; a[j] = t;",
        success:
          "Correct. Java's Arrays.sort on int[] is a dual-pivot quicksort — the same idea, split into three parts instead of two.",
      },
      solution: `int pivot = a[hi];
int i = lo - 1;

for (int j = lo; j < hi; j++) {
  if (a[j] < pivot) {
    i++;
    int t = a[i]; a[i] = a[j]; a[j] = t;
  }
}`,
    },

    javascript: {
      example: `function partition(lo, hi) {
  const pivot = a[hi];
  let i = lo - 1;                       // end of the "smaller" zone
  for (let j = lo; j < hi; j++)
    if (a[j] < pivot) { i++; [a[i], a[j]] = [a[j], a[i]]; }
  [a[i + 1], a[hi]] = [a[hi], a[i + 1]];   // pivot goes home
  return i + 1;
}`,
      notes: [
        { token: "i = lo - 1", meaning: "the smaller-zone starts out empty" },
        { token: "[a[i], a[j]] = [a[j], a[i]]", meaning: "swaps in one line" },
        { token: "call stack", meaning: "a bad pivot can nest deeply enough to overflow it" },
      ],
      vizCode: `const pivot = a[hi];
let i = lo - 1;
for (let j = lo; j < hi; j++)
  if (a[j] < pivot) { i++; [a[i], a[j]] = [a[j], a[i]]; }
[a[i + 1], a[hi]] = [a[hi], a[i + 1]];
return i + 1;`,
      starter: `const pivot = a[hi];
let i = lo - 1;

for (let j = lo; j < hi; j++) {
  if ( ) {
    i++;
    ;
  }
}`,
      rules: {
        regex: ["a\\[j\\]\\s*<\\s*pivot", "\\[a\\[i\\]\\s*,\\s*a\\[j\\]\\]\\s*=\\s*\\[a\\[j\\]\\s*,\\s*a\\[i\\]\\]"],
        hint: "Test a[j] < pivot. Then i++ and swap with [a[i], a[j]] = [a[j], a[i]].",
        success:
          "Correct. Each item is looked at once, so one partition is O(n) — and it puts one value in its final place for good.",
      },
      solution: `const pivot = a[hi];
let i = lo - 1;

for (let j = lo; j < hi; j++) {
  if (a[j] < pivot) {
    i++;
    [a[i], a[j]] = [a[j], a[i]];
  }
}`,
    },

    rust: {
      example: `fn partition(a: &mut Vec<i32>, lo: usize, hi: usize) -> usize {
    let pivot = a[hi];
    let mut i = lo as i64 - 1;            // end of the "smaller" zone
    for j in lo..hi {
        if a[j] < pivot { i += 1; a.swap(i as usize, j); }
    }
    a.swap((i + 1) as usize, hi);         // pivot goes home
    (i + 1) as usize
}`,
      notes: [
        { token: "i as i64 - 1", meaning: "the zone starts empty, and lo may be 0" },
        { token: "a.swap(x, y)", meaning: "built in. Rust would refuse a hand-written swap here" },
        { token: "sort_unstable", meaning: "this algorithm. It is the faster of Rust's two sorts" },
      ],
      vizCode: `let pivot = a[hi];
let mut i = lo as i64 - 1;
for j in lo..hi {
    if a[j] < pivot { i += 1; a.swap(i as usize, j); }
}
a.swap((i + 1) as usize, hi);
(i + 1) as usize`,
      starter: `let pivot = a[hi];
let mut i = lo as i64 - 1;

for j in lo..hi {
    if  {
        i += 1;
        ;
    }
}`,
      rules: {
        regex: ["a\\[j\\]\\s*<\\s*pivot", "a\\.swap\\s*\\(\\s*i\\s+as\\s+usize\\s*,\\s*j\\s*\\)"],
        hint: "Test a[j] < pivot. Then i += 1 and a.swap(i as usize, j).",
        success:
          "Correct, and i is an i64 for a reason: lo can be 0, so lo - 1 as a usize would go below zero and stop the program.",
      },
      solution: `let pivot = a[hi];
let mut i = lo as i64 - 1;

for j in lo..hi {
    if a[j] < pivot {
        i += 1;
        a.swap(i as usize, j);
    }
}`,
    },
  },
};
