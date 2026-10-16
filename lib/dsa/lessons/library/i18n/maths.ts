import type { ChapterAlt } from "@/lib/dsa/lessons/i18n";

// Maths, Patterns & Recursion, in the five languages other than C++.
// Only the code changes. The explanation above it is the same for everyone.

export const MATHS_ALT: ChapterAlt = {
  /* -------------------------------------------------------- recursion -- */
  recursion: {
    c: {
      example: `int fact(int n) {
  if (n <= 1) return 1;     /* base case — stops the fall */
  return n * fact(n - 1);   /* smaller version of the same job */
}

printf("%d", fact(5));   /* 120 */`,
      notes: [
        { token: "if (n <= 1)", meaning: "the only line that does not call anything" },
        { token: "fact(n - 1)", meaning: "smaller — this is what gets us to the base" },
        { token: "n * ...", meaning: "runs on the way back up, not on the way down" },
      ],
      vizCode: `int fact(int n) {
  if (n == 1) return 1;      /* the stop */
  return n * fact(n - 1);    /* the smaller question */
}`,
      starter: `int sumTo(int n) {

}`,
      rules: {
        must: ["return", "sumTo"],
        mustNot: ["for", "while"],
        regex: ["if\\s*\\(\\s*n\\s*(<=|==)\\s*[01]\\s*\\)", "n\\s*\\+\\s*sumTo\\s*\\(\\s*n\\s*-\\s*1\\s*\\)"],
        hint: "Base case: if n is 0, there is nothing left to add, so return 0. Otherwise return n + sumTo(n - 1).",
        success: "Correct. You changed one sign — × became + — and the rest of the shape stayed. That shape is the thing to learn.",
      },
      solution: `int sumTo(int n) {
  if (n <= 0) return 0;
  return n + sumTo(n - 1);
}`,
    },

    python: {
      example: `def fact(n):
    if n <= 1:
        return 1            # base case — stops the fall
    return n * fact(n - 1)  # smaller version of the same job


print(fact(5))   # 120`,
      notes: [
        { token: "if n <= 1", meaning: "the only line that does not call anything" },
        { token: "fact(n - 1)", meaning: "smaller — this is what gets us to the base" },
        { token: "n * ...", meaning: "runs on the way back up, not on the way down" },
        { token: "1000 calls deep", meaning: "Python stops there by default and raises an error" },
      ],
      vizCode: `def fact(n):
    if n == 1: return 1        # the stop
    return n * fact(n - 1)     # the smaller question`,
      starter: `def sum_to(n):
    `,
      rules: {
        must: ["return", "sum_to"],
        mustNot: ["for ", "while "],
        regex: ["def\\s+sum_to\\s*\\(\\s*n\\s*\\)", "if\\s+n\\s*(<=|==)\\s*[01]", "n\\s*\\+\\s*sum_to\\s*\\(\\s*n\\s*-\\s*1\\s*\\)"],
        hint: "Base case: if n <= 0, return 0. Otherwise return n + sum_to(n - 1).",
        success:
          "Correct. One thing to know about Python: it stops after about 1000 nested calls. Deep recursion needs a loop instead.",
      },
      solution: `def sum_to(n):
    if n <= 0:
        return 0
    return n + sum_to(n - 1)`,
    },

    java: {
      example: `static int fact(int n) {
  if (n <= 1) return 1;     // base case — stops the fall
  return n * fact(n - 1);   // smaller version of the same job
}

System.out.println(fact(5));   // 120`,
      notes: [
        { token: "if (n <= 1)", meaning: "the only line that does not call anything" },
        { token: "fact(n - 1)", meaning: "smaller — this is what gets us to the base" },
        { token: "static", meaning: "so main can call it without making an object" },
      ],
      vizCode: `static int fact(int n) {
  if (n == 1) return 1;      // the stop
  return n * fact(n - 1);    // the smaller question
}`,
      starter: `static int sumTo(int n) {

}`,
      rules: {
        must: ["return", "sumTo"],
        mustNot: ["for", "while"],
        regex: ["if\\s*\\(\\s*n\\s*(<=|==)\\s*[01]\\s*\\)", "n\\s*\\+\\s*sumTo\\s*\\(\\s*n\\s*-\\s*1\\s*\\)"],
        hint: "Base case: if n <= 0, return 0. Otherwise return n + sumTo(n - 1).",
        success:
          "Correct. If Java runs out of room for paused calls it throws StackOverflowError. That is the crash a missing base case gives you.",
      },
      solution: `static int sumTo(int n) {
  if (n <= 0) return 0;
  return n + sumTo(n - 1);
}`,
    },

    javascript: {
      example: `function fact(n) {
  if (n <= 1) return 1;     // base case — stops the fall
  return n * fact(n - 1);   // smaller version of the same job
}

console.log(fact(5));   // 120`,
      notes: [
        { token: "if (n <= 1)", meaning: "the only line that does not call anything" },
        { token: "fact(n - 1)", meaning: "smaller — this is what gets us to the base" },
        { token: "fact(21)", meaning: "already too big to be exact — numbers stop being whole past 2^53" },
      ],
      vizCode: `function fact(n) {
  if (n === 1) return 1;      // the stop
  return n * fact(n - 1);     // the smaller question
}`,
      starter: `function sumTo(n) {

}`,
      rules: {
        must: ["return", "sumTo"],
        mustNot: ["for", "while"],
        regex: ["function\\s+sumTo\\s*\\(\\s*n\\s*\\)|sumTo\\s*=\\s*\\(?\\s*n", "if\\s*\\(\\s*n\\s*(<=|===?)\\s*[01]\\s*\\)", "n\\s*\\+\\s*sumTo\\s*\\(\\s*n\\s*-\\s*1\\s*\\)"],
        hint: "Base case: if (n <= 0) return 0; Otherwise return n + sumTo(n - 1).",
        success:
          "Correct. Watch out with factorial in JavaScript though: past 20! the answer is no longer exact, because every number here is a float.",
      },
      solution: `function sumTo(n) {
  if (n <= 0) return 0;
  return n + sumTo(n - 1);
}`,
    },

    rust: {
      example: `fn fact(n: u64) -> u64 {
    if n <= 1 { return 1; }   // base case — stops the fall
    n * fact(n - 1)           // smaller version of the same job
}

println!("{}", fact(5));   // 120`,
      notes: [
        { token: "if n <= 1", meaning: "the only line that does not call anything" },
        { token: "fact(n - 1)", meaning: "smaller — this is what gets us to the base" },
        { token: "n * fact(n - 1)", meaning: "no semicolon, so this is the value handed back" },
        { token: "u64", meaning: "a whole number that can never be negative" },
      ],
      vizCode: `fn fact(n: u64) -> u64 {
    if n == 1 { return 1; }      // the stop
    n * fact(n - 1)              // the smaller question
}`,
      starter: `fn sum_to(n: i32) -> i32 {

}`,
      rules: {
        must: ["sum_to"],
        mustNot: ["for ", "while "],
        regex: ["fn\\s+sum_to\\s*\\(\\s*n\\s*:\\s*i32\\s*\\)\\s*->\\s*i32", "n\\s*(<=|==)\\s*[01]", "n\\s*\\+\\s*sum_to\\s*\\(\\s*n\\s*-\\s*1\\s*\\)"],
        hint: "Base case: if n <= 0 { return 0; } Then the last line is n + sum_to(n - 1), with no semicolon.",
        success:
          "Correct. Leaving the semicolon off the last line is how Rust hands a value back. Add one and the function returns nothing.",
      },
      solution: `fn sum_to(n: i32) -> i32 {
    if n <= 0 { return 0; }
    n + sum_to(n - 1)
}`,
    },
  },

  /* ----------------------------------------------------------- digits -- */
  digits: {
    c: {
      vizCode: `int n = 4721, rev = 0;

while (n > 0) {
  int digit = n % 10;
  rev = rev * 10 + digit;
  n = n / 10;
}`,
      example: `int n = 4721, rev = 0;

while (n > 0) {
  int digit = n % 10;      /* last digit */
  rev = rev * 10 + digit;  /* stick it on the end of rev */
  n = n / 10;              /* drop it from n */
}

printf("%d", rev);   /* 1274 */`,
      notes: [
        { token: "n % 10", meaning: "the last digit" },
        { token: "n / 10", meaning: "everything except the last digit" },
        { token: "rev * 10 + digit", meaning: "shift left, then add the new digit" },
      ],
      starter: `int n, sum = 0;
scanf("%d", &n);

while ( ) {

}

printf("%d", sum);`,
      rules: {
        must: ["while", "sum"],
        regex: ["n\\s*>\\s*0", "n\\s*%\\s*10", "n\\s*(/=\\s*10|=\\s*n\\s*/\\s*10)"],
        hint: "Loop while n > 0. Inside: sum += n % 10; then n /= 10.",
        success:
          "Correct. Peeling digits with % 10 and / 10 comes back in Armstrong numbers, digit sums and checksums. Worth knowing by heart.",
      },
      solution: `int n, sum = 0;
scanf("%d", &n);

while (n > 0) {
  sum += n % 10;
  n /= 10;
}

printf("%d", sum);`,
    },

    python: {
      vizCode: `n, rev = 4721, 0

while n > 0:
    digit = n % 10
    rev = rev * 10 + digit
    n = n // 10
# n has reached 0`,
      example: `n, rev = 4721, 0

while n > 0:
    digit = n % 10          # last digit
    rev = rev * 10 + digit  # stick it on the end of rev
    n = n // 10             # drop it from n

print(rev)   # 1274`,
      notes: [
        { token: "n % 10", meaning: "the last digit" },
        { token: "n // 10", meaning: "everything except the last digit" },
        { token: "n / 10", meaning: "wrong here — it gives 472.1 and the loop never ends" },
        { token: "str(n)[::-1]", meaning: "the shortcut, but it hides what is happening" },
      ],
      prompt:
        "Read a number and print the sum of its digits. 4721 gives 4 + 7 + 2 + 1 = 14. Do the maths — do not turn it into text.",
      starter: `n = int(input())
total = 0

while :

print(total)`,
      rules: {
        must: ["while", "total"],
        mustNot: ["str(", "[::-1]"],
        regex: ["n\\s*>\\s*0", "n\\s*%\\s*10", "n\\s*(//=\\s*10|=\\s*n\\s*//\\s*10)"],
        hint:
          "Loop while n > 0. Inside: total += n % 10, then n //= 10. It has to be // — a single / makes n a decimal and the loop runs forever.",
        success:
          "Correct. Python can do sum(int(c) for c in str(n)) in one line, but the maths version is what you need for digit problems later.",
      },
      solution: `n = int(input())
total = 0

while n > 0:
    total += n % 10
    n //= 10

print(total)`,
    },

    java: {
      vizCode: `int n = 4721, rev = 0;

while (n > 0) {
  int digit = n % 10;
  rev = rev * 10 + digit;
  n = n / 10;
}`,
      example: `int n = 4721, rev = 0;

while (n > 0) {
  int digit = n % 10;      // last digit
  rev = rev * 10 + digit;  // stick it on the end of rev
  n = n / 10;              // drop it from n
}

System.out.println(rev);   // 1274`,
      notes: [
        { token: "n % 10", meaning: "the last digit" },
        { token: "n / 10", meaning: "everything except the last digit" },
        { token: "rev * 10 + digit", meaning: "shift left, then add the new digit" },
        { token: "int rev", meaning: "reversing a big number can overflow — use long if unsure" },
      ],
      starter: `int n = sc.nextInt(), sum = 0;

while ( ) {

}

System.out.println(sum);`,
      rules: {
        must: ["while", "sum"],
        regex: ["n\\s*>\\s*0", "n\\s*%\\s*10", "n\\s*(/=\\s*10|=\\s*n\\s*/\\s*10)"],
        hint: "Loop while n > 0. Inside: sum += n % 10; then n /= 10.",
        success:
          "Correct. Java's / on two ints drops the remainder, same as C++, so the digits come off cleanly.",
      },
      solution: `int n = sc.nextInt(), sum = 0;

while (n > 0) {
  sum += n % 10;
  n /= 10;
}

System.out.println(sum);`,
    },

    javascript: {
      vizCode: `let n = 4721, rev = 0;

while (n > 0) {
  const digit = n % 10;
  rev = rev * 10 + digit;
  n = Math.floor(n / 10);
}`,
      example: `let n = 4721, rev = 0;

while (n > 0) {
  const digit = n % 10;        // last digit
  rev = rev * 10 + digit;      // stick it on the end of rev
  n = Math.floor(n / 10);      // drop it from n
}

console.log(rev);   // 1274`,
      notes: [
        { token: "n % 10", meaning: "the last digit" },
        { token: "Math.floor(n / 10)", meaning: "everything except the last digit" },
        { token: "n / 10", meaning: "wrong here — it keeps the decimals and the loop never ends" },
      ],
      starter: `let n = Number(line);
let sum = 0;

while ( ) {

}

console.log(sum);`,
      rules: {
        must: ["while", "sum"],
        regex: ["n\\s*>\\s*0", "n\\s*%\\s*10", "Math\\.floor\\s*\\(\\s*n\\s*\\/\\s*10\\s*\\)"],
        hint:
          "Loop while n > 0. Inside: sum += n % 10, then n = Math.floor(n / 10). Plain / keeps the decimals, so the loop would never stop.",
        success:
          "Correct. JavaScript has one number type and it is a float, so Math.floor is doing the job C++ gets for free.",
      },
      solution: `let n = Number(line);
let sum = 0;

while (n > 0) {
  sum += n % 10;
  n = Math.floor(n / 10);
}

console.log(sum);`,
    },

    rust: {
      vizCode: `let (mut n, mut rev) = (4721, 0);

while n > 0 {
    let digit = n % 10;
    rev = rev * 10 + digit;
    n /= 10;
}`,
      example: `let mut n = 4721;
let mut rev = 0;

while n > 0 {
    let digit = n % 10;        // last digit
    rev = rev * 10 + digit;    // stick it on the end of rev
    n /= 10;                   // drop it from n
}

println!("{}", rev);   // 1274`,
      notes: [
        { token: "n % 10", meaning: "the last digit" },
        { token: "n /= 10", meaning: "everything except the last digit" },
        { token: "let mut", meaning: "without mut, n could never change" },
      ],
      starter: `let mut n: i32 = line.trim().parse().unwrap();
let mut sum = 0;

while  {

}

println!("{}", sum);`,
      rules: {
        must: ["while", "sum"],
        regex: ["n\\s*>\\s*0", "n\\s*%\\s*10", "n\\s*/=\\s*10"],
        hint: "Loop while n > 0. Inside: sum += n % 10; then n /= 10. Both n and sum need let mut.",
        success:
          "Correct. Rust drops the remainder on integer division, same as C++, so no floor call is needed.",
      },
      solution: `let mut n: i32 = line.trim().parse().unwrap();
let mut sum = 0;

while n > 0 {
    sum += n % 10;
    n /= 10;
}

println!("{}", sum);`,
    },
  },

  /* ----------------------------------------------------------- primes -- */
  primes: {
    c: {
      vizCode: `int isPrime(long long n) {
  if (n < 2) return 0;
  for (long long i = 2; i * i <= n; i++)
    if (n % i == 0) return 0;
  return 1;
}`,
      example: `int isPrime(long long n) {
  if (n < 2) return 0;
  for (long long i = 2; i * i <= n; i++)
    if (n % i == 0) return 0;
  return 1;
}`,
      notes: [
        { token: "n < 2", meaning: "0 and 1 are not prime — handle them first" },
        { token: "i * i <= n", meaning: "stop at the square root, no sqrt() needed" },
        { token: "return 0", meaning: "one divisor is enough to settle it" },
        { token: "int, not bool", meaning: "plain C has no bool unless you include stdbool.h" },
      ],
      starter: `int n, count = 0;
scanf("%d", &n);

for (int i = 1; ; i++) {
  if ( ) count++;
}

printf("%d", count);`,
      rules: {
        must: ["count"],
        regex: ["i\\s*<=\\s*n", "n\\s*%\\s*i\\s*==\\s*0"],
        hint: "Loop i from 1 while i <= n. If n % i == 0 then i divides n, so count++.",
        success:
          "Correct. Now think about the faster way: loop only to the square root, and count two divisors each time — i and n / i. Take care not to count twice when i * i is exactly n.",
      },
      solution: `int n, count = 0;
scanf("%d", &n);

for (int i = 1; i <= n; i++) {
  if (n % i == 0) count++;
}

printf("%d", count);`,
    },

    python: {
      vizCode: `def is_prime(n):
    if n < 2: return False
    for i in range(2, isqrt(n) + 1):
        if n % i == 0: return False
    return True
# from math import isqrt`,
      example: `def is_prime(n):
    if n < 2:
        return False
    i = 2
    while i * i <= n:
        if n % i == 0:
            return False
        i += 1
    return True`,
      notes: [
        { token: "n < 2", meaning: "0 and 1 are not prime — handle them first" },
        { token: "i * i <= n", meaning: "stop at the square root" },
        { token: "while, not for", meaning: "a for over range(2, int(n**0.5)+1) also works, but floats can round badly" },
      ],
      starter: `n = int(input())
count = 0

for i in range():
    if :
        count += 1

print(count)`,
      rules: {
        must: ["count"],
        regex: ["range\\s*\\(\\s*1\\s*,\\s*n\\s*\\+\\s*1\\s*\\)", "n\\s*%\\s*i\\s*==\\s*0"],
        hint:
          "range(1, n + 1) gives 1 up to n — the end is left out, so it must be n + 1. Inside, if n % i == 0 then count += 1.",
        success:
          "Correct. That missing upper end catches everyone once: range(1, n) stops one short and misses n itself as a divisor.",
      },
      solution: `n = int(input())
count = 0

for i in range(1, n + 1):
    if n % i == 0:
        count += 1

print(count)`,
    },

    java: {
      vizCode: `static boolean isPrime(long n) {
  if (n < 2) return false;
  for (long i = 2; i * i <= n; i++)
    if (n % i == 0) return false;
  return true;
}`,
      example: `static boolean isPrime(long n) {
  if (n < 2) return false;
  for (long i = 2; i * i <= n; i++)
    if (n % i == 0) return false;
  return true;
}`,
      notes: [
        { token: "n < 2", meaning: "0 and 1 are not prime — handle them first" },
        { token: "i * i <= n", meaning: "stop at the square root, no Math.sqrt needed" },
        { token: "long", meaning: "i * i overflows int once n passes about 2 billion" },
      ],
      starter: `int n = sc.nextInt(), count = 0;

for (int i = 1; ; i++) {
  if ( ) count++;
}

System.out.println(count);`,
      rules: {
        must: ["count"],
        regex: ["i\\s*<=\\s*n", "n\\s*%\\s*i\\s*==\\s*0"],
        hint: "Loop i from 1 while i <= n. If n % i == 0 then i divides n, so count++.",
        success:
          "Correct. Use long for i when n can be large — i * i quietly overflows int and the loop then never ends.",
      },
      solution: `int n = sc.nextInt(), count = 0;

for (int i = 1; i <= n; i++) {
  if (n % i == 0) count++;
}

System.out.println(count);`,
    },

    javascript: {
      vizCode: `function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++)
    if (n % i === 0) return false;
  return true;
}`,
      example: `function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++)
    if (n % i === 0) return false;
  return true;
}`,
      notes: [
        { token: "n < 2", meaning: "0 and 1 are not prime — handle them first" },
        { token: "i * i <= n", meaning: "stop at the square root" },
        { token: "n % i === 0", meaning: "three equals signs, so no type juggling" },
      ],
      starter: `const n = Number(line);
let count = 0;

for (let i = 1; ; i++) {
  if ( ) count++;
}

console.log(count);`,
      rules: {
        must: ["count"],
        regex: ["i\\s*<=\\s*n", "n\\s*%\\s*i\\s*===?\\s*0"],
        hint: "Loop i from 1 while i <= n. If n % i === 0 then i divides n, so count++.",
        success:
          "Correct. For numbers past 2^53 use BigInt — normal JavaScript numbers stop being exact and % starts lying.",
      },
      solution: `const n = Number(line);
let count = 0;

for (let i = 1; i <= n; i++) {
  if (n % i === 0) count++;
}

console.log(count);`,
    },

    rust: {
      vizCode: `fn is_prime(n: u64) -> bool {
    if n < 2 { return false; }
    (2..=n.isqrt())
        .all(|i| n % i != 0)
}
// nothing divided it, so it is prime`,
      example: `fn is_prime(n: u64) -> bool {
    if n < 2 { return false; }
    let mut i = 2;
    while i * i <= n {
        if n % i == 0 { return false; }
        i += 1;
    }
    true
}`,
      notes: [
        { token: "n < 2", meaning: "0 and 1 are not prime — handle them first" },
        { token: "i * i <= n", meaning: "stop at the square root" },
        { token: "true", meaning: "last line, no semicolon — this is the value handed back" },
        { token: "u64", meaning: "a whole number that can never be negative" },
      ],
      starter: `let n: u64 = line.trim().parse().unwrap();
let mut count = 0;

for i in  {
    if  { count += 1; }
}

println!("{}", count);`,
      rules: {
        must: ["count"],
        regex: ["1\\..?=\\s*n", "n\\s*%\\s*i\\s*==\\s*0"],
        hint: "Use 1..=n so n itself is included. Inside, if n % i == 0 { count += 1; }.",
        success:
          "Correct. 1..n would stop one short and miss n as a divisor — the = in 1..=n is what includes it.",
      },
      solution: `let n: u64 = line.trim().parse().unwrap();
let mut count = 0;

for i in 1..=n {
    if n % i == 0 { count += 1; }
}

println!("{}", count);`,
    },
  },
};
