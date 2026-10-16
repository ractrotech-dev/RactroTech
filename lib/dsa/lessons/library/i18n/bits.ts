import type { ChapterAlt } from "@/lib/dsa/lessons/i18n";

// Bit Manipulation, in the five languages other than C++.

export const BITS_ALT: ChapterAlt = {
  /* -------------------------------------------------------------- ops -- */
  ops: {
    c: {
      example: `int x = 12;              /* 1100 */

x & 1                    /* 0 -> even */
x >> 1                   /* 6  — halve */
x << 1                   /* 24 — double */

/* the three standard one-bit moves */
x |  (1 << k)            /* set bit k to 1 */
x & ~(1 << k)            /* clear bit k to 0 */
(x >> k) & 1             /* read bit k */`,
      notes: [
        { token: "x & 1", meaning: "is the last bit 1 — that is, is x odd" },
        { token: "1 << k", meaning: "a number with only bit k set" },
        { token: "1 << 31", meaning: "undefined for a signed int. Use 1u or 1LL" },
        { token: "__builtin_popcount(x)", meaning: "how many bits are set, in one instruction" },
      ],
      vizCode: `x & y   /* 1 only where BOTH are 1 */
x | y   /* 1 where EITHER is 1 */
x ^ y   /* 1 where they DIFFER */
x << 1  /* shift left = multiply by 2 */
x >> 1  /* shift right = divide by 2 */`,
      starter: `int isPowerOfTwo(int n) {
  return n > 0 && ( ) == 0;
}`,
      rules: {
        regex: ["n\\s*&\\s*\\(\\s*n\\s*-\\s*1\\s*\\)"],
        hint: "n & (n - 1) clears the lowest set bit. If n had exactly one bit set, the answer is 0. The n > 0 guard rules out zero.",
        success:
          "Correct. 8 is 1000 and 7 is 0111, so 8 & 7 is 0. For 12, which is 1100, 12 & 11 is 1000 — not zero, so not a power of two.",
      },
      solution: `int isPowerOfTwo(int n) {
  return n > 0 && (n & (n - 1)) == 0;
}`,
    },

    python: {
      example: `x = 12               # 1100

x & 1                # 0 -> even
x >> 1               # 6  — halve
x << 1               # 24 — double

# the three standard one-bit moves
x |  (1 << k)        # set bit k to 1
x & ~(1 << k)        # clear bit k to 0
(x >> k) & 1         # read bit k`,
      notes: [
        { token: "x & 1", meaning: "is the last bit 1 — that is, is x odd" },
        { token: "1 << k", meaning: "a number with only bit k set" },
        { token: "1 << 100", meaning: "fine in Python. Integers have no fixed width and never overflow" },
        { token: "bin(12)", meaning: "gives the text '0b1100'. x.bit_count() counts the set bits" },
      ],
      vizCode: `x & y   # 1 only where BOTH are 1
x | y   # 1 where EITHER is 1
x ^ y   # 1 where they DIFFER
x << 1  # shift left = multiply by 2
x >> 1  # shift right = divide by 2`,
      starter: `def is_power_of_two(n):
    return n > 0 and () == 0`,
      rules: {
        regex: ["n\\s*&\\s*\\(\\s*n\\s*-\\s*1\\s*\\)"],
        hint: "n & (n - 1) clears the lowest set bit. If n had exactly one bit set, the answer is 0. The n > 0 guard rules out zero.",
        success:
          "Correct. One Python-only thing worth knowing: there is no upper limit here, so 1 << 1000 just works. And ~x is -x - 1, because negative numbers are stored differently.",
      },
      solution: `def is_power_of_two(n):
    return n > 0 and (n & (n - 1)) == 0`,
    },

    java: {
      example: `int x = 12;              // 1100

x & 1                    // 0 -> even
x >> 1                   // 6  — halve
x >>> 1                  // same here, but different for negatives
x << 1                   // 24 — double

x |  (1 << k)            // set bit k to 1
x & ~(1 << k)            // clear bit k to 0
(x >> k) & 1             // read bit k`,
      notes: [
        { token: "x & 1", meaning: "is the last bit 1 — that is, is x odd" },
        { token: ">>", meaning: "keeps the sign. -8 >> 1 is -4" },
        { token: ">>>", meaning: "fills with zeros. -8 >>> 1 is a huge positive number" },
        { token: "Integer.bitCount(x)", meaning: "how many bits are set" },
      ],
      vizCode: `x & y   // 1 only where BOTH are 1
x | y   // 1 where EITHER is 1
x ^ y   // 1 where they DIFFER
x << 1  // shift left = multiply by 2
x >> 1  // shift right = divide by 2`,
      starter: `static boolean isPowerOfTwo(int n) {
  return n > 0 && ( ) == 0;
}`,
      rules: {
        regex: ["n\\s*&\\s*\\(\\s*n\\s*-\\s*1\\s*\\)"],
        hint: "n & (n - 1) clears the lowest set bit. If n had exactly one bit set, the answer is 0. The n > 0 guard rules out zero.",
        success:
          "Correct. Java adds a third shift, >>>, which fills with zeros instead of copying the sign bit. Use it whenever you are treating an int as raw bits.",
      },
      solution: `static boolean isPowerOfTwo(int n) {
  return n > 0 && (n & (n - 1)) == 0;
}`,
    },

    javascript: {
      example: `const x = 12;            // 1100

x & 1                    // 0 -> even
x >> 1                   // 6  — halve
x << 1                   // 24 — double

// WARNING: every bitwise operation cuts the number to 32 bits
2 ** 32 | 0              // 0
1 << 31                  // -2147483648, not 2147483648`,
      notes: [
        { token: "x & 1", meaning: "is the last bit 1 — that is, is x odd" },
        { token: "any bitwise op", meaning: "converts to a 32-bit signed int first. This surprises everyone" },
        { token: "1 << 31", meaning: "goes negative. Use 2 ** 31 for the real value" },
        { token: "BigInt", meaning: "what you need for bits past 32. 1n << 40n" },
      ],
      vizCode: `x & y   // 1 only where BOTH are 1
x | y   // 1 where EITHER is 1
x ^ y   // 1 where they DIFFER
x << 1  // shift left = multiply by 2
x >> 1  // shift right = divide by 2`,
      starter: `function isPowerOfTwo(n) {
  return n > 0 && ( ) === 0;
}`,
      rules: {
        regex: ["n\\s*&\\s*\\(\\s*n\\s*-\\s*1\\s*\\)"],
        hint: "n & (n - 1) clears the lowest set bit. If n had exactly one bit set, the answer is 0. The n > 0 guard rules out zero.",
        success:
          "Correct — but only for numbers below 2^31. JavaScript cuts every bitwise operation down to 32 bits, so bit tricks silently break on large values. Use BigInt there.",
      },
      solution: `function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}`,
    },

    rust: {
      example: `let x: u32 = 12;         // 1100

x & 1                    // 0 -> even
x >> 1                   // 6  — halve
x << 1                   // 24 — double

x |  (1 << k)            // set bit k to 1
x & !(1 << k)            // clear bit k to 0 — ! not ~
(x >> k) & 1             // read bit k`,
      notes: [
        { token: "x & 1", meaning: "is the last bit 1 — that is, is x odd" },
        { token: "!x", meaning: "flips every bit. Rust uses ! where C uses ~" },
        { token: "x.count_ones()", meaning: "how many bits are set" },
        { token: "1u32 << 32", meaning: "stops the program in a debug build. Shifting too far is an error" },
      ],
      vizCode: `x & y   // 1 only where BOTH are 1
x | y   // 1 where EITHER is 1
x ^ y   // 1 where they DIFFER
x << 1  // shift left = multiply by 2
x >> 1  // shift right = divide by 2`,
      starter: `fn is_power_of_two(n: u32) -> bool {
    n > 0 && () == 0
}`,
      rules: {
        regex: ["n\\s*&\\s*\\(\\s*n\\s*-\\s*1\\s*\\)"],
        hint: "n & (n - 1) clears the lowest set bit. If n had exactly one bit set, the answer is 0. The n > 0 guard rules out zero.",
        success:
          "Correct. Two Rust habits: ! is the bit-flip operator, not ~, and a shift past the type's width stops the program instead of doing something undefined.",
      },
      solution: `fn is_power_of_two(n: u32) -> bool {
    n > 0 && (n & (n - 1)) == 0
}`,
    },
  },

  /* -------------------------------------------------------------- xor -- */
  xor: {
    c: {
      example: `int single(int a[], int n) {
  int ans = 0;
  for (int i = 0; i < n; i++) ans ^= a[i];
  return ans;
}

/* missing number from 1..n */
int missing = 0;
for (int i = 1; i <= n; i++)  missing ^= i;
for (int i = 0; i < n - 1; i++) missing ^= a[i];`,
      notes: [
        { token: "ans = 0", meaning: "0 is the starting value — x ^ 0 is x" },
        { token: "ans ^= x", meaning: "pairs cancel wherever they are" },
        { token: "O(1) memory", meaning: "one int, however large the array" },
      ],
      vizCode: `int ans = 0;
for (int i = 0; i < n; i++) ans ^= a[i];
return ans;   /* the number that appeared once */`,
      starter: `int ans = ;

for (int i = 0; i < n; i++) {
  ;
}`,
      rules: {
        mustNot: ["qsort", "malloc"],
        regex: ["ans\\s*=\\s*0", "ans\\s*\\^=\\s*a\\[i\\]"],
        hint: "Start ans at 0 and write ans ^= a[i] inside the loop.",
        success:
          "Correct. It never mattered where the pairs were — XOR does not care about order, which is what makes one pass enough.",
      },
      solution: `int ans = 0;

for (int i = 0; i < n; i++) {
  ans ^= a[i];
}`,
    },

    python: {
      example: `def single(a):
    ans = 0
    for x in a:
        ans ^= x
    return ans


# missing number from 1..n
missing = 0
for i in range(1, n + 1): missing ^= i
for x in a:               missing ^= x`,
      notes: [
        { token: "ans = 0", meaning: "0 is the starting value — x ^ 0 is x" },
        { token: "ans ^= x", meaning: "pairs cancel wherever they are" },
        { token: "reduce(xor, a)", meaning: "the same thing from functools and operator" },
        { token: "O(1) memory", meaning: "one number, however large the list" },
      ],
      vizCode: `ans = 0
for x in a: ans ^= x
return ans   # the number that appeared once`,
      prompt:
        "Find the single number that appears once when every other number appears twice. One loop, one variable. No set, no dict, no sorting.",
      starter: `ans = 

for x in a:
    `,
      rules: {
        mustNot: ["set(", "dict(", "sort", "Counter"],
        regex: ["ans\\s*=\\s*0", "ans\\s*\\^=\\s*x"],
        hint: "Start ans at 0 and write ans ^= x inside the loop.",
        success:
          "Correct. A set would also work and reads more naturally, but it needs O(n) memory. XOR needs one variable, which is the whole point.",
      },
      solution: `ans = 0

for x in a:
    ans ^= x`,
    },

    java: {
      example: `static int single(int[] a) {
  int ans = 0;
  for (int x : a) ans ^= x;
  return ans;
}

// missing number from 1..n
int missing = 0;
for (int i = 1; i <= n; i++) missing ^= i;
for (int x : a)              missing ^= x;`,
      notes: [
        { token: "ans = 0", meaning: "0 is the starting value — x ^ 0 is x" },
        { token: "ans ^= x", meaning: "pairs cancel wherever they are" },
        { token: "O(1) memory", meaning: "one int, however large the array" },
      ],
      vizCode: `int ans = 0;
for (int x : a) ans ^= x;
return ans;   // the number that appeared once`,
      starter: `int ans = ;

for (int x : a) {
  ;
}`,
      rules: {
        mustNot: ["HashSet", "HashMap", "Arrays.sort"],
        regex: ["ans\\s*=\\s*0", "ans\\s*\\^=\\s*x"],
        hint: "Start ans at 0 and write ans ^= x inside the loop.",
        success:
          "Correct. A HashSet solves it too, but that is O(n) memory and a lot of boxing. One int beats it on every measure here.",
      },
      solution: `int ans = 0;

for (int x : a) {
  ans ^= x;
}`,
    },

    javascript: {
      example: `function single(a) {
  let ans = 0;
  for (const x of a) ans ^= x;
  return ans;
}

// missing number from 1..n
let missing = 0;
for (let i = 1; i <= n; i++) missing ^= i;
for (const x of a)           missing ^= x;`,
      notes: [
        { token: "ans = 0", meaning: "0 is the starting value — x ^ 0 is x" },
        { token: "ans ^= x", meaning: "pairs cancel wherever they are" },
        { token: "values above 2^31", meaning: "^ cuts them to 32 bits, so this breaks there" },
      ],
      vizCode: `let ans = 0;
for (const x of a) ans ^= x;
return ans;   // the number that appeared once`,
      prompt:
        "Find the single number that appears once when every other number appears twice. One loop, one variable. No Set, no Map, no sorting.",
      starter: `let ans = ;

for (const x of a) {
  ;
}`,
      rules: {
        mustNot: ["new Set", "new Map", ".sort("],
        regex: ["ans\\s*=\\s*0", "ans\\s*\\^=\\s*x"],
        hint: "Start ans at 0 and write ans ^= x inside the loop.",
        success:
          "Correct, but remember the limit: ^ converts to 32-bit signed integers, so this only works while every value fits in 32 bits.",
      },
      solution: `let ans = 0;

for (const x of a) {
  ans ^= x;
}`,
    },

    rust: {
      example: `fn single(a: &[i32]) -> i32 {
    let mut ans = 0;
    for &x in a {
        ans ^= x;
    }
    ans
}

// or, in one line
let ans = a.iter().fold(0, |acc, &x| acc ^ x);`,
      notes: [
        { token: "ans = 0", meaning: "0 is the starting value — x ^ 0 is x" },
        { token: "for &x in a", meaning: "the & unwraps the reference, so x is the number itself" },
        { token: "fold(0, ...)", meaning: "start at 0 and combine everything. The tidy Rust way" },
        { token: "ans", meaning: "last line, no semicolon — this is the value handed back" },
      ],
      vizCode: `let mut ans = 0;
for &x in a { ans ^= x; }
ans   // the number that appeared once`,
      prompt:
        "Find the single number that appears once when every other number appears twice. One loop, one variable. No HashSet, no sorting.",
      starter: `let mut ans = ;

for &x in a {
    
}`,
      rules: {
        mustNot: ["HashSet", "sort"],
        regex: ["ans\\s*=\\s*0", "ans\\s*\\^=\\s*x"],
        hint: "Start ans at 0 and write ans ^= x inside the loop. Remember let mut, or it cannot change.",
        success:
          "Correct. The & in `for &x in a` matters: without it x is a reference, and Rust will not let you XOR a reference into a number.",
      },
      solution: `let mut ans = 0;

for &x in a {
    ans ^= x;
}`,
    },
  },

  /* ---------------------------------------------------------- subsets -- */
  subsets: {
    c: {
      vizCode: `int n = 3;

for (int mask = 0; mask < (1 << n); mask++) {
  for (int i = 0; i < n; i++)
    if ((mask >> i) & 1)
      use(item[i]);
}`,
      example: `int n = 3;                       /* items 0, 1, 2 */

for (int mask = 0; mask < (1 << n); mask++) {
  printf("{ ");
  for (int i = 0; i < n; i++)
    if ((mask >> i) & 1) printf("%d ", item[i]);
  printf("}\\n");
}
/* 1 << 3 is 8, so masks 0..7 — all eight subsets */`,
      notes: [
        { token: "1 << n", meaning: "2 to the power n — how many subsets there are" },
        { token: "(mask >> i) & 1", meaning: "is item i in this subset?" },
        { token: "__builtin_popcount(mask)", meaning: "how many items the subset holds" },
        { token: "n above 30", meaning: "1 << n overflows int. Use 1LL" },
      ],
      starter: `for (int mask = 0; mask < ; mask++) {
  for (int i = 0; i < n; i++) {
    if ( ) printf("%d ", item[i]);
  }
}`,
      rules: {
        regex: ["\\(\\s*1\\s*<<\\s*n\\s*\\)", "\\(\\s*mask\\s*>>\\s*i\\s*\\)\\s*&\\s*1"],
        hint: "The gate is mask < (1 << n), and the membership test is (mask >> i) & 1.",
        success:
          "Correct. Keep the brackets: & binds more loosely than most people expect, so mask >> i & 1 without them can mean something else.",
      },
      solution: `for (int mask = 0; mask < (1 << n); mask++) {
  for (int i = 0; i < n; i++) {
    if ((mask >> i) & 1) printf("%d ", item[i]);
  }
}`,
    },

    python: {
      vizCode: `n = 3

for mask in range(1 << n):
    for i in range(n):
        if (mask >> i) & 1:
            use(item[i])`,
      example: `n = 3                            # items 0, 1, 2

for mask in range(1 << n):
    out = []
    for i in range(n):
        if (mask >> i) & 1:
            out.append(item[i])
    print(out)
# 1 << 3 is 8, so masks 0..7 — all eight subsets`,
      notes: [
        { token: "1 << n", meaning: "2 to the power n — how many subsets there are" },
        { token: "(mask >> i) & 1", meaning: "is item i in this subset?" },
        { token: "mask.bit_count()", meaning: "how many items the subset holds (Python 3.10+)" },
        { token: "itertools.combinations", meaning: "the built-in, when you want a fixed size" },
      ],
      prompt:
        "Loop over every subset of n items and test whether item i belongs to the current one. Do not use itertools.",
      starter: `for mask in range():
    for i in range(n):
        if :
            print(item[i])`,
      rules: {
        mustNot: ["itertools", "combinations"],
        regex: ["range\\s*\\(\\s*1\\s*<<\\s*n\\s*\\)", "\\(\\s*mask\\s*>>\\s*i\\s*\\)\\s*&\\s*1"],
        hint: "The loop is range(1 << n), and the membership test is (mask >> i) & 1.",
        success:
          "Correct. Python integers never overflow, so 1 << n works for any n — but 2^n subsets still means you stop being able to finish at about n = 25.",
      },
      solution: `for mask in range(1 << n):
    for i in range(n):
        if (mask >> i) & 1:
            print(item[i])`,
    },

    java: {
      vizCode: `int n = 3;

for (int mask = 0; mask < (1 << n); mask++) {
  for (int i = 0; i < n; i++)
    if (((mask >> i) & 1) == 1)
      use(item[i]);
}`,
      example: `int n = 3;                       // items 0, 1, 2

for (int mask = 0; mask < (1 << n); mask++) {
  System.out.print("{ ");
  for (int i = 0; i < n; i++)
    if (((mask >> i) & 1) == 1) System.out.print(item[i] + " ");
  System.out.println("}");
}`,
      notes: [
        { token: "1 << n", meaning: "2 to the power n — how many subsets there are" },
        { token: "(mask >> i) & 1", meaning: "is item i in this subset?" },
        { token: "Integer.bitCount(mask)", meaning: "how many items the subset holds" },
        { token: "1L << n", meaning: "needed once n passes 30, or int overflows" },
      ],
      starter: `for (int mask = 0; mask < ; mask++) {
  for (int i = 0; i < n; i++) {
    if ( ) System.out.print(item[i]);
  }
}`,
      rules: {
        regex: ["\\(\\s*1\\s*<<\\s*n\\s*\\)", "\\(\\s*mask\\s*>>\\s*i\\s*\\)\\s*&\\s*1"],
        hint: "The gate is mask < (1 << n), and the membership test is ((mask >> i) & 1) == 1.",
        success:
          "Correct. Java needs the == 1 spelled out, because an int is not a boolean here — unlike C and C++, where non-zero already means true.",
      },
      solution: `for (int mask = 0; mask < (1 << n); mask++) {
  for (int i = 0; i < n; i++) {
    if (((mask >> i) & 1) == 1) System.out.print(item[i]);
  }
}`,
    },

    javascript: {
      vizCode: `const n = 3;

for (let mask = 0; mask < (1 << n); mask++) {
  for (let i = 0; i < n; i++)
    if ((mask >> i) & 1)
      use(item[i]);
}`,
      example: `const n = 3;                     // items 0, 1, 2

for (let mask = 0; mask < (1 << n); mask++) {
  const out = [];
  for (let i = 0; i < n; i++)
    if ((mask >> i) & 1) out.push(item[i]);
  console.log(out);
}`,
      notes: [
        { token: "1 << n", meaning: "2 to the power n — how many subsets there are" },
        { token: "(mask >> i) & 1", meaning: "is item i in this subset?" },
        { token: "n above 30", meaning: "1 << n goes negative, because bitwise ops are 32-bit" },
        { token: "2 ** n", meaning: "safer for the loop bound if n is large" },
      ],
      starter: `for (let mask = 0; mask < ; mask++) {
  for (let i = 0; i < n; i++) {
    if ( ) console.log(item[i]);
  }
}`,
      rules: {
        regex: ["\\(\\s*1\\s*<<\\s*n\\s*\\)|2\\s*\\*\\*\\s*n", "\\(\\s*mask\\s*>>\\s*i\\s*\\)\\s*&\\s*1"],
        hint: "The gate is mask < (1 << n), and the membership test is (mask >> i) & 1.",
        success:
          "Correct. For large n prefer 2 ** n as the bound: 1 << 31 is negative in JavaScript, so the loop would not run at all.",
      },
      solution: `for (let mask = 0; mask < (1 << n); mask++) {
  for (let i = 0; i < n; i++) {
    if ((mask >> i) & 1) console.log(item[i]);
  }
}`,
    },

    rust: {
      vizCode: `let n = 3;

for mask in 0..(1u32 << n) {
    for i in 0..n {
        if (mask >> i) & 1 == 1 {
            use_item(item[i]);
        }
    }
}`,
      example: `let n = 3;                       // items 0, 1, 2

for mask in 0..(1u32 << n) {
    let mut out = Vec::new();
    for i in 0..n {
        if (mask >> i) & 1 == 1 { out.push(item[i]); }
    }
    println!("{:?}", out);
}`,
      notes: [
        { token: "1u32 << n", meaning: "2 to the power n — how many subsets there are" },
        { token: "(mask >> i) & 1 == 1", meaning: "is item i in this subset? Rust needs the == 1" },
        { token: "mask.count_ones()", meaning: "how many items the subset holds" },
        { token: "1u64 << n", meaning: "needed once n passes 31" },
      ],
      starter: `for mask in 0.. {
    for i in 0..n {
        if  { println!("{}", item[i]); }
    }
}`,
      rules: {
        regex: ["1u?(32|64)?\\s*<<\\s*n", "\\(\\s*mask\\s*>>\\s*i\\s*\\)\\s*&\\s*1\\s*==\\s*1"],
        hint: "The range is 0..(1u32 << n), and the membership test is (mask >> i) & 1 == 1.",
        success:
          "Correct. Rust has no 'non-zero means true', so the == 1 is required — the compiler will not accept a number where it wants a bool.",
      },
      solution: `for mask in 0..(1u32 << n) {
    for i in 0..n {
        if (mask >> i) & 1 == 1 { println!("{}", item[i]); }
    }
}`,
    },
  },
};
