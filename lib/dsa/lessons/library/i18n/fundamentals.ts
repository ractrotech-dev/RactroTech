import type { ChapterAlt } from "@/lib/dsa/lessons/i18n";

// Fundamentals, in the five languages other than C++.
//
// Only code moves. Every vizCode stays line-for-line parallel with the C++ it
// replaces, because the diagram highlights lines by number — scripts/check-lessons
// fails the build if that ever drifts.

export const FUNDAMENTALS_ALT: ChapterAlt = {
  /* --------------------------------------------------------------- io -- */
  io: {
    c: {
      example: `#include <stdio.h>

int main(void) {
  int a, b;
  scanf("%d %d", &a, &b);   /* read two numbers */
  printf("%d", a + b);      /* print their total */
  return 0;
}`,
      notes: [
        { token: "#include <stdio.h>", meaning: "brings scanf and printf into your file" },
        { token: "int a, b;", meaning: "make two empty boxes that hold whole numbers" },
        { token: "&a", meaning: "the address of a — scanf needs to know where to put the value" },
        { token: '"%d %d"', meaning: "read two whole numbers, separated by whitespace" },
      ],
      vizCode: `int a, b;
scanf("%d %d", &a, &b);
int sum = a + b;
printf("%d", sum);`,
      prompt:
        "Read three numbers into a, b and c, then print their average. Careful: the average of 1, 2 and 2 is not a whole number, so do not let integer division eat the decimals.",
      starter: `int a, b, c;
scanf( );

printf( );`,
      rules: {
        regex: ['scanf\\s*\\(\\s*"%d\\s*%d\\s*%d"\\s*,\\s*&a\\s*,\\s*&b\\s*,\\s*&c', "printf", "3\\.0|\\(double\\)|\\(float\\)"],
        hint:
          'Read all three with one scanf: scanf("%d %d %d", &a, &b, &c). Then print (a + b + c) / 3.0 with the %f format — the .0 is what stops C throwing away the decimal part.',
        success:
          "Correct. Dividing by 3.0 instead of 3 is the difference between 1 and 1.666, and forgetting the & in scanf is the other classic C beginner crash.",
      },
      solution: `int a, b, c;
scanf("%d %d %d", &a, &b, &c);

printf("%f", (a + b + c) / 3.0);`,
    },

    python: {
      example: `a, b = map(int, input().split())   # read two numbers
print(a + b)                       # print their total`,
      notes: [
        { token: "input()", meaning: "reads one whole line of what was typed, as text" },
        { token: ".split()", meaning: "cuts that line into pieces at the spaces" },
        { token: "map(int, ...)", meaning: "turns each piece of text into a whole number" },
        { token: "a, b =", meaning: "unpacks the two values into two names at once" },
      ],
      vizCode: `a = b = 0
a, b = map(int, input().split())
total = a + b
print(total)`,
      prompt:
        "Read three numbers into a, b and c, then print their average. Python's / always gives you decimals — the trap here is the other way round, so do not reach for //.",
      starter: `a, b, c = 

print()`,
      rules: {
        regex: ["a\\s*,\\s*b\\s*,\\s*c\\s*=\\s*map\\s*\\(\\s*int", "print\\s*\\(", "\\/\\s*3"],
        mustNot: ["// 3", "//3"],
        hint:
          "Read all three at once: a, b, c = map(int, input().split()). Then print((a + b + c) / 3). Use / and not //, because // floors the answer.",
        success:
          "Correct. Python 3 made / always produce a decimal, so the C++ trap disappears here — but // brings it straight back, which is worth remembering.",
      },
      solution: `a, b, c = map(int, input().split())

print((a + b + c) / 3)`,
    },

    java: {
      example: `import java.util.Scanner;

public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int a = sc.nextInt();          // read two numbers
    int b = sc.nextInt();
    System.out.println(a + b);     // print their total
  }
}`,
      notes: [
        { token: "import java.util.Scanner", meaning: "brings the reader into your file" },
        { token: "new Scanner(System.in)", meaning: "a reader attached to what the user types" },
        { token: "sc.nextInt()", meaning: "take the next whole number" },
        { token: "System.out.println", meaning: "print, then move to a new line" },
      ],
      vizCode: `int a, b;
a = sc.nextInt(); b = sc.nextInt();
int sum = a + b;
System.out.println(sum);`,
      prompt:
        "Read three numbers into a, b and c, then print their average. Careful: the average of 1, 2 and 2 is not a whole number, so do not let integer division eat the decimals.",
      starter: `Scanner sc = new Scanner(System.in);
int a = , b = , c = ;

System.out.println();`,
      rules: {
        regex: ["a\\s*=\\s*sc\\.nextInt\\(\\)", "b\\s*=\\s*sc\\.nextInt\\(\\)", "c\\s*=\\s*sc\\.nextInt\\(\\)", "System\\.out\\.print", "3\\.0|\\(double\\)"],
        hint:
          "Read each with sc.nextInt(). Then print (a + b + c) / 3.0 — the .0 makes Java use decimal division instead of whole-number division.",
        success:
          "Correct. Java has exactly the same integer-division trap as C++: 5 / 3 is 1, but 5 / 3.0 is 1.666.",
      },
      solution: `Scanner sc = new Scanner(System.in);
int a = sc.nextInt(), b = sc.nextInt(), c = sc.nextInt();

System.out.println((a + b + c) / 3.0);`,
    },

    javascript: {
      example: `const [a, b] = require("fs")
  .readFileSync(0, "utf8")   // read everything that was typed
  .split(/\\s+/)              // cut it at the spaces
  .map(Number);              // turn the pieces into numbers

console.log(a + b);`,
      notes: [
        { token: "readFileSync(0, ...)", meaning: "0 means standard input — what the user typed" },
        { token: ".split(/\\s+/)", meaning: "cut at any run of whitespace" },
        { token: ".map(Number)", meaning: "turn each piece of text into a number" },
        { token: "const [a, b] =", meaning: "unpack the first two into two names" },
      ],
      vizCode: `let a, b;
[a, b] = input.split(/\\s+/).map(Number);
const sum = a + b;
console.log(sum);`,
      prompt:
        "Read three numbers into a, b and c, then print their average. JavaScript has only one number type, so there is no integer-division trap here — the trap is that everything arrives as text.",
      starter: `const [a, b, c] = require("fs")
  .readFileSync(0, "utf8")
  ;

console.log();`,
      rules: {
        regex: ["\\.split\\s*\\(", "\\.map\\s*\\(\\s*Number\\s*\\)", "console\\.log", "\\/\\s*3"],
        hint:
          "Chain .split(/\\s+/).map(Number) so the pieces become real numbers. Then console.log((a + b + c) / 3).",
        success:
          "Correct. Miss the .map(Number) and a + b + c concatenates the text instead of adding it — \"1\" + \"2\" is \"12\", not 3.",
      },
      solution: `const [a, b, c] = require("fs")
  .readFileSync(0, "utf8")
  .split(/\\s+/)
  .map(Number);

console.log((a + b + c) / 3);`,
    },

    rust: {
      example: `use std::io::Read;

fn main() {
    let mut text = String::new();
    std::io::stdin().read_to_string(&mut text).unwrap();
    let mut it = text.split_whitespace()
                     .map(|w| w.parse::<i64>().unwrap());
    let a = it.next().unwrap();      // read two numbers
    let b = it.next().unwrap();
    println!("{}", a + b);           // print their total
}`,
      notes: [
        { token: "read_to_string", meaning: "pull everything the user typed into one String" },
        { token: "split_whitespace()", meaning: "cut it into pieces at the spaces" },
        { token: "parse::<i64>()", meaning: "turn a piece of text into a 64-bit whole number" },
        { token: ".unwrap()", meaning: "'I am sure this worked' — crashes if it did not" },
      ],
      vizCode: `let (a, b): (i64, i64);
let a = next(); let b = next();
let sum = a + b;
println!("{}", sum);`,
      prompt:
        "Read three numbers into a, b and c, then print their average. Careful: dividing two integers in Rust throws the remainder away, so make at least one side a float.",
      starter: `let a = it.next().unwrap();
let b = ;
let c = ;

println!("{}", );`,
      rules: {
        regex: ["b\\s*=\\s*it\\.next\\(\\)\\.unwrap\\(\\)", "c\\s*=\\s*it\\.next\\(\\)\\.unwrap\\(\\)", "println!", "3\\.0|as\\s+f64"],
        hint:
          "Take each value with it.next().unwrap(). Then print (a + b + c) as f64 / 3.0 — Rust will not mix integers and floats for you, so the cast is required.",
        success:
          "Correct. Rust refuses to silently mix an i64 and an f64, which turns C++'s quiet wrong answer into a compile error you cannot ignore.",
      },
      solution: `let a = it.next().unwrap();
let b = it.next().unwrap();
let c = it.next().unwrap();

println!("{}", (a + b + c) as f64 / 3.0);`,
    },
  },

  /* ------------------------------------------------------- conditions -- */
  conditions: {
    c: {
      example: `int m;
scanf("%d", &m);

if (m >= 90)      printf("A");
else if (m >= 50) printf("Pass");
else              printf("Fail");`,
      notes: [
        { token: "m >= 90", meaning: "the strictest test, so it must come first" },
        { token: "else if", meaning: "only asked when the line above said no" },
        { token: "else", meaning: "everything that is left over" },
      ],
      vizCode: `for (int k = 0; k < n; k++) {
  if (marks[k] >= 90)      printf("A ");
  else if (marks[k] >= 50) printf("Pass ");
  else                     printf("Fail ");
}`,
      starter: `int n;
scanf("%d", &n);

if ( ) {
  printf("Even");
} else {
  printf("Odd");
}`,
      rules: {
        regex: ["n\\s*%\\s*2\\s*==\\s*0", 'printf\\s*\\(\\s*"Even"', "else"],
        hint:
          "A number is even when dividing by 2 leaves nothing behind. Write if (n % 2 == 0). Remember == for a question, not =.",
        success:
          "Correct. n % 2 == 0 is the standard way to ask 'is this even', and you will see it in almost every maths problem later.",
      },
      solution: `int n;
scanf("%d", &n);

if (n % 2 == 0) {
  printf("Even");
} else {
  printf("Odd");
}`,
    },

    python: {
      example: `m = int(input())

if m >= 90:
    print("A")
elif m >= 50:
    print("Pass")
else:
    print("Fail")`,
      notes: [
        { token: "m >= 90", meaning: "the strictest test, so it must come first" },
        { token: "elif", meaning: "only asked when the line above said no" },
        { token: "the colon and indent", meaning: "Python uses indentation where C++ uses braces" },
      ],
      vizCode: `for m in marks:
    if m >= 90:   print("A", end=" ")
    elif m >= 50: print("Pass", end=" ")
    else:         print("Fail", end=" ")`,
      starter: `n = int(input())

if :
    print("Even")
else:
    print("Odd")`,
      rules: {
        regex: ["n\\s*%\\s*2\\s*==\\s*0", 'print\\s*\\(\\s*"Even"', "else"],
        hint: "A number is even when dividing by 2 leaves nothing behind. Write if n % 2 == 0:  — and do not forget the colon.",
        success:
          "Correct. Python has no braces, so the indentation is the block. Getting it wrong is a syntax error rather than a silent bug, which is a mercy.",
      },
      solution: `n = int(input())

if n % 2 == 0:
    print("Even")
else:
    print("Odd")`,
    },

    java: {
      example: `int m = sc.nextInt();

if (m >= 90)      System.out.println("A");
else if (m >= 50) System.out.println("Pass");
else              System.out.println("Fail");`,
      notes: [
        { token: "m >= 90", meaning: "the strictest test, so it must come first" },
        { token: "else if", meaning: "only asked when the line above said no" },
        { token: "else", meaning: "everything that is left over" },
      ],
      vizCode: `for (int m : marks) {
  if (m >= 90)      System.out.print("A ");
  else if (m >= 50) System.out.print("Pass ");
  else              System.out.print("Fail ");
}`,
      starter: `int n = sc.nextInt();

if ( ) {
  System.out.println("Even");
} else {
  System.out.println("Odd");
}`,
      rules: {
        regex: ["n\\s*%\\s*2\\s*==\\s*0", 'System\\.out\\.print(ln)?\\s*\\(\\s*"Even"', "else"],
        hint: "A number is even when dividing by 2 leaves nothing behind. Write if (n % 2 == 0). Remember == for a question, not =.",
        success:
          "Correct. Java will not even compile if (n = 2) where you meant ==, which is one place it is stricter than C++ and saves you.",
      },
      solution: `int n = sc.nextInt();

if (n % 2 == 0) {
  System.out.println("Even");
} else {
  System.out.println("Odd");
}`,
    },

    javascript: {
      example: `const m = Number(line);

if (m >= 90)      console.log("A");
else if (m >= 50) console.log("Pass");
else              console.log("Fail");`,
      notes: [
        { token: "m >= 90", meaning: "the strictest test, so it must come first" },
        { token: "else if", meaning: "only asked when the line above said no" },
        { token: "Number(line)", meaning: "text becomes a number — without this, \"9\" > 90 lies to you" },
      ],
      vizCode: `for (const m of marks) {
  if (m >= 90)      out += "A ";
  else if (m >= 50) out += "Pass ";
  else              out += "Fail ";
}`,
      starter: `const n = Number(line);

if ( ) {
  console.log("Even");
} else {
  console.log("Odd");
}`,
      rules: {
        regex: ["n\\s*%\\s*2\\s*===?\\s*0", 'console\\.log\\s*\\(\\s*"Even"', "else"],
        hint: "A number is even when dividing by 2 leaves nothing behind. Write if (n % 2 === 0) — three equals signs in JavaScript.",
        success:
          "Correct, and === rather than == is the habit to keep. == converts types before comparing, so \"0\" == 0 is true and that will bite you eventually.",
      },
      solution: `const n = Number(line);

if (n % 2 === 0) {
  console.log("Even");
} else {
  console.log("Odd");
}`,
    },

    rust: {
      example: `let m: i32 = line.trim().parse().unwrap();

if m >= 90 {
    println!("A");
} else if m >= 50 {
    println!("Pass");
} else {
    println!("Fail");
}`,
      notes: [
        { token: "m >= 90", meaning: "the strictest test, so it must come first" },
        { token: "else if", meaning: "only asked when the line above said no" },
        { token: "braces required", meaning: "Rust always wants them, even for one line" },
      ],
      vizCode: `for m in marks {
    if m >= 90      { print!("A "); }
    else if m >= 50 { print!("Pass "); }
    else            { print!("Fail "); }
}`,
      starter: `let n: i32 = line.trim().parse().unwrap();

if  {
    println!("Even");
} else {
    println!("Odd");
}`,
      rules: {
        regex: ["n\\s*%\\s*2\\s*==\\s*0", 'println!\\s*\\(\\s*"Even"', "else"],
        hint: "A number is even when dividing by 2 leaves nothing behind. Write if n % 2 == 0 — no brackets round the condition, but braces are required.",
        success:
          "Correct. Rust drops the brackets round the condition and insists on the braces, which is the opposite of C++ on both counts.",
      },
      solution: `let n: i32 = line.trim().parse().unwrap();

if n % 2 == 0 {
    println!("Even");
} else {
    println!("Odd");
}`,
    },
  },

  /* -------------------------------------------------------------- for -- */
  for: {
    c: {
      example: `for (int i = 1; i <= 5; i++) {
  printf("%d ", i);
}
/* prints: 1 2 3 4 5 */`,
      notes: [
        { token: "int i = 1", meaning: "setup — runs once at the very start" },
        { token: "i <= 5", meaning: "the gate — checked before every lap" },
        { token: "i++", meaning: "the step — runs after every lap" },
      ],
      vizCode: `for (int i = 1; i <= 5; i++) {
  printf("%d ", i);
}`,
      starter: `int sum = 0;

for (int i = 1; ; ) {

}

printf("%d", sum);`,
      rules: {
        must: ["for", "sum"],
        regex: ["i\\s*<=\\s*100|i\\s*<\\s*101", "i\\+\\+", "sum\\s*(\\+=|=\\s*sum\\s*\\+)"],
        hint: "Loop i from 1 while i <= 100, stepping with i++. Inside write sum += i.",
        success:
          "Correct — the answer is 5050. A variable that survives across laps and collects something is called an accumulator, and you will use one constantly.",
      },
      solution: `int sum = 0;

for (int i = 1; i <= 100; i++) {
  sum += i;
}

printf("%d", sum);`,
    },

    python: {
      example: `for i in range(1, 6):
    print(i, end=" ")
# prints: 1 2 3 4 5`,
      notes: [
        { token: "range(1, 6)", meaning: "1, 2, 3, 4, 5 — the second number is NOT included" },
        { token: "for i in", meaning: "take each value in turn; no counter to manage yourself" },
        { token: 'end=" "', meaning: "print a space instead of a new line after each one" },
      ],
      vizCode: `for i in range(1, 6):
    print(i, end=" ")`,
      prompt:
        "Print the sum of 1 + 2 + 3 + ... + 100 using a loop. Do not use the n(n+1)/2 formula, and do not use sum() — the point is keeping a running total inside the loop.",
      starter: `total = 0

for i in range():
    

print(total)`,
      rules: {
        must: ["for", "total"],
        mustNot: ["sum(", "n * (n"],
        regex: ["range\\s*\\(\\s*1\\s*,\\s*101\\s*\\)", "total\\s*(\\+=|=\\s*total\\s*\\+)"],
        hint:
          "range(1, 101) gives 1 up to 100 — the end is excluded, so it must be 101. Inside the loop write total += i.",
        success:
          "Correct — 5050. That excluded upper end catches everyone once: range(1, 100) stops at 99.",
      },
      solution: `total = 0

for i in range(1, 101):
    total += i

print(total)`,
    },

    java: {
      example: `for (int i = 1; i <= 5; i++) {
  System.out.print(i + " ");
}
// prints: 1 2 3 4 5`,
      notes: [
        { token: "int i = 1", meaning: "setup — runs once at the very start" },
        { token: "i <= 5", meaning: "the gate — checked before every lap" },
        { token: "i++", meaning: "the step — runs after every lap" },
      ],
      vizCode: `for (int i = 1; i <= 5; i++) {
  System.out.print(i + " ");
}`,
      starter: `int sum = 0;

for (int i = 1; ; ) {

}

System.out.println(sum);`,
      rules: {
        must: ["for", "sum"],
        regex: ["i\\s*<=\\s*100|i\\s*<\\s*101", "i\\+\\+", "sum\\s*(\\+=|=\\s*sum\\s*\\+)"],
        hint: "Loop i from 1 while i <= 100, stepping with i++. Inside write sum += i.",
        success:
          "Correct — 5050. Note that int handles this easily, but a sum of 10⁵ large values would overflow it. long is the fix.",
      },
      solution: `int sum = 0;

for (int i = 1; i <= 100; i++) {
  sum += i;
}

System.out.println(sum);`,
    },

    javascript: {
      example: `for (let i = 1; i <= 5; i++) {
  process.stdout.write(i + " ");
}
// prints: 1 2 3 4 5`,
      notes: [
        { token: "let i = 1", meaning: "setup — let, not var, so i belongs to the loop" },
        { token: "i <= 5", meaning: "the gate — checked before every lap" },
        { token: "i++", meaning: "the step — runs after every lap" },
      ],
      vizCode: `for (let i = 1; i <= 5; i++) {
  out += i + " ";
}`,
      starter: `let sum = 0;

for (let i = 1; ; ) {

}

console.log(sum);`,
      rules: {
        must: ["for", "sum"],
        regex: ["i\\s*<=\\s*100|i\\s*<\\s*101", "i\\+\\+", "sum\\s*(\\+=|=\\s*sum\\s*\\+)"],
        hint: "Loop i from 1 while i <= 100, stepping with i++. Inside write sum += i.",
        success:
          "Correct — 5050. Use let rather than var: var leaks out of the loop, and inside a callback it gives you the last value every time.",
      },
      solution: `let sum = 0;

for (let i = 1; i <= 100; i++) {
  sum += i;
}

console.log(sum);`,
    },

    rust: {
      example: `for i in 1..=5 {
    print!("{} ", i);
}
// prints: 1 2 3 4 5`,
      notes: [
        { token: "1..=5", meaning: "1 to 5, including 5 — the = is what includes it" },
        { token: "1..5", meaning: "1 to 4. Easy to type by mistake" },
        { token: "print!", meaning: "no new line; println! adds one" },
      ],
      vizCode: `for i in 1..=5 {
    print!("{} ", i);
}`,
      starter: `let mut sum = 0;

for i in  {
    
}

println!("{}", sum);`,
      rules: {
        must: ["for", "sum"],
        regex: ["1\\..?=\\s*100|1\\.\\.101", "sum\\s*\\+="],
        hint: "Use 1..=100 to include 100. Inside write sum += i. Note sum has to be declared with `let mut` — Rust values cannot change otherwise.",
        success:
          "Correct — 5050. The `mut` is the point: in Rust nothing can be changed unless you say so up front, which removes a whole class of accidental writes.",
      },
      solution: `let mut sum = 0;

for i in 1..=100 {
    sum += i;
}

println!("{}", sum);`,
    },
  },

  /* ------------------------------------------------------------ while -- */
  while: {
    c: {
      example: `int n = 27, steps = 0;

while (n > 1) {
  if (n % 2 == 0) n = n / 2;
  else            n = 3 * n + 1;
  steps++;
}

printf("%d", steps);`,
      notes: [
        { token: "while (n > 1)", meaning: "keep going as long as this is true" },
        { token: "n = n / 2", meaning: "the body must move n towards 1, or it never ends" },
        { token: "steps++", meaning: "count the laps by hand — while does not do it for you" },
      ],
      vizCode: `int n = 27;
int steps = 0;
while (n > 1) {
  if (n % 2 == 0) n = n / 2;
  else            n = 3 * n + 1;
  steps++;
}`,
      starter: `int n, digits = 0;
scanf("%d", &n);

while ( ) {

}

printf("%d", digits);`,
      rules: {
        must: ["while", "digits"],
        regex: ["n\\s*>\\s*0", "n\\s*(/=\\s*10|=\\s*n\\s*/\\s*10)", "digits\\+\\+|digits\\s*\\+="],
        hint: "Loop while n > 0. Inside, do digits++ and then n /= 10.",
        success:
          "Correct. Dividing by 10 to peel digits off a number is a trick you will reuse in palindromes, digit sums and reversing numbers.",
      },
      solution: `int n, digits = 0;
scanf("%d", &n);

while (n > 0) {
  digits++;
  n /= 10;
}

printf("%d", digits);`,
    },

    python: {
      example: `n, steps = 27, 0

while n > 1:
    if n % 2 == 0: n = n // 2
    else:          n = 3 * n + 1
    steps += 1

print(steps)`,
      notes: [
        { token: "while n > 1:", meaning: "keep going as long as this is true" },
        { token: "n // 2", meaning: "whole-number division — / would give 13.5 and break the loop" },
        { token: "steps += 1", meaning: "count the laps by hand; Python has no ++" },
      ],
      vizCode: `n = 27
steps = 0
while n > 1:
    if n % 2 == 0: n = n // 2
    else:          n = 3 * n + 1
    steps += 1`,
      starter: `n = int(input())
digits = 0

while :

print(digits)`,
      rules: {
        must: ["while", "digits"],
        regex: ["n\\s*>\\s*0", "n\\s*(//=\\s*10|=\\s*n\\s*//\\s*10)", "digits\\s*\\+="],
        hint:
          "Loop while n > 0. Inside, do digits += 1 and then n //= 10. It must be // — a single / turns n into a decimal and the loop never reaches 0.",
        success:
          "Correct, and // is the crux here. With /, n becomes 472.1 then 47.21 and so on, never hitting 0 — an infinite loop.",
      },
      solution: `n = int(input())
digits = 0

while n > 0:
    digits += 1
    n //= 10

print(digits)`,
    },

    java: {
      example: `int n = 27, steps = 0;

while (n > 1) {
  if (n % 2 == 0) n = n / 2;
  else            n = 3 * n + 1;
  steps++;
}

System.out.println(steps);`,
      notes: [
        { token: "while (n > 1)", meaning: "keep going as long as this is true" },
        { token: "n = n / 2", meaning: "the body must move n towards 1, or it never ends" },
        { token: "steps++", meaning: "count the laps by hand — while does not do it for you" },
      ],
      vizCode: `int n = 27;
int steps = 0;
while (n > 1) {
  if (n % 2 == 0) n = n / 2;
  else            n = 3 * n + 1;
  steps++;
}`,
      starter: `int n = sc.nextInt(), digits = 0;

while ( ) {

}

System.out.println(digits);`,
      rules: {
        must: ["while", "digits"],
        regex: ["n\\s*>\\s*0", "n\\s*(/=\\s*10|=\\s*n\\s*/\\s*10)", "digits\\+\\+|digits\\s*\\+="],
        hint: "Loop while n > 0. Inside, do digits++ and then n /= 10.",
        success:
          "Correct. Java's / on two ints throws the remainder away, exactly like C++, which is what makes this peel the digits cleanly.",
      },
      solution: `int n = sc.nextInt(), digits = 0;

while (n > 0) {
  digits++;
  n /= 10;
}

System.out.println(digits);`,
    },

    javascript: {
      example: `let n = 27, steps = 0;

while (n > 1) {
  if (n % 2 === 0) n = n / 2;
  else             n = 3 * n + 1;
  steps++;
}

console.log(steps);`,
      notes: [
        { token: "while (n > 1)", meaning: "keep going as long as this is true" },
        { token: "n = n / 2", meaning: "safe here — n is always even at this point" },
        { token: "Math.floor(n / 10)", meaning: "what you need when the division is not exact" },
      ],
      vizCode: `let n = 27;
let steps = 0;
while (n > 1) {
  if (n % 2 === 0) n = n / 2;
  else             n = 3 * n + 1;
  steps++;
}`,
      starter: `let n = Number(line);
let digits = 0;

while ( ) {

}

console.log(digits);`,
      rules: {
        must: ["while", "digits"],
        regex: ["n\\s*>\\s*0", "Math\\.floor\\s*\\(\\s*n\\s*\\/\\s*10\\s*\\)|n\\s*=\\s*\\(n\\s*\\/\\s*10\\)\\s*\\|\\s*0", "digits\\+\\+|digits\\s*\\+="],
        hint:
          "Loop while n > 0. Inside, digits++ and then n = Math.floor(n / 10). Plain / keeps the decimals in JavaScript, so the loop would never end.",
        success:
          "Correct. JavaScript has one number type and it is a float, so there is no free integer division — Math.floor is doing the work C++ gets for nothing.",
      },
      solution: `let n = Number(line);
let digits = 0;

while (n > 0) {
  digits++;
  n = Math.floor(n / 10);
}

console.log(digits);`,
    },

    rust: {
      example: `let mut n = 27;
let mut steps = 0;

while n > 1 {
    if n % 2 == 0 { n /= 2; }
    else          { n = 3 * n + 1; }
    steps += 1;
}

println!("{}", steps);`,
      notes: [
        { token: "let mut", meaning: "without mut, n could never change and this would not compile" },
        { token: "while n > 1", meaning: "no brackets round the condition" },
        { token: "n /= 2", meaning: "integer division on integers — the remainder is dropped" },
      ],
      vizCode: `let mut n = 27;
let mut steps = 0;
while n > 1 {
    if n % 2 == 0 { n /= 2; }
    else          { n = 3 * n + 1; }
    steps += 1;
}`,
      starter: `let mut n: i32 = line.trim().parse().unwrap();
let mut digits = 0;

while  {

}

println!("{}", digits);`,
      rules: {
        must: ["while", "digits"],
        regex: ["n\\s*>\\s*0", "n\\s*/=\\s*10", "digits\\s*\\+="],
        hint: "Loop while n > 0. Inside, digits += 1 and then n /= 10. Both n and digits need `let mut`.",
        success:
          "Correct. Rust's / on two integers drops the remainder just like C++, so no floor call is needed.",
      },
      solution: `let mut n: i32 = line.trim().parse().unwrap();
let mut digits = 0;

while n > 0 {
    digits += 1;
    n /= 10;
}

println!("{}", digits);`,
    },
  },

  /* ----------------------------------------------------------- nested -- */
  nested: {
    c: {
      example: `for (int i = 1; i <= 5; i++) {
  for (int j = 1; j <= i; j++) {
    printf("*");
  }
  printf("\\n");
}`,
      notes: [
        { token: "outer i", meaning: "which line we are on" },
        { token: "j <= i", meaning: "the inner limit depends on the outer counter" },
        { token: 'printf("\\n")', meaning: "after the inner loop — one newline per line" },
      ],
      vizCode: `for (int i = 1; i <= 5; i++) {
  for (int j = 1; j <= i; j++) printf("*");
  printf("\\n");
}`,
      starter: `for (int i = 5; ; ) {
  for (int j = 1; ; j++) {
    printf("*");
  }
  printf("\\n");
}`,
      rules: {
        must: ["for"],
        regex: ["i\\s*>=\\s*1", "i--", "j\\s*<=\\s*i"],
        hint: "Count the outer loop down: start i at 5, keep going while i >= 1, step with i--. The inner loop is unchanged.",
        success:
          "Correct. The inner loop never changed — you only reversed the outer walk. Recognising which loop owns which job is most of pattern printing.",
      },
      solution: `for (int i = 5; i >= 1; i--) {
  for (int j = 1; j <= i; j++) {
    printf("*");
  }
  printf("\\n");
}`,
    },

    python: {
      example: `for i in range(1, 6):
    for j in range(1, i + 1):
        print("*", end="")
    print()`,
      notes: [
        { token: "range(1, i + 1)", meaning: "the inner limit depends on the outer counter" },
        { token: 'end=""', meaning: "stay on the same line while the row is being built" },
        { token: "print()", meaning: "an empty print is the newline at the end of the row" },
      ],
      vizCode: `for i in range(1, 6):
    for j in range(1, i + 1): print("*", end="")
    print()`,
      prompt:
        "Print an upside-down triangle: 5 stars on the first line, then 4, then 3, 2, 1. Only the outer range needs to change.",
      starter: `for i in range():
    for j in range(1, i + 1):
        print("*", end="")
    print()`,
      rules: {
        must: ["for", "print()"],
        regex: ["range\\s*\\(\\s*5\\s*,\\s*0\\s*,\\s*-1\\s*\\)", "i\\s*\\+\\s*1"],
        hint:
          "range(5, 0, -1) counts 5, 4, 3, 2, 1 — the third argument is the step, and the end is still excluded so it must be 0, not 1.",
        success:
          "Correct. range's third argument is the step, and the excluded end catches people twice as hard when counting backwards.",
      },
      solution: `for i in range(5, 0, -1):
    for j in range(1, i + 1):
        print("*", end="")
    print()`,
    },

    java: {
      example: `for (int i = 1; i <= 5; i++) {
  for (int j = 1; j <= i; j++) {
    System.out.print("*");
  }
  System.out.println();
}`,
      notes: [
        { token: "outer i", meaning: "which line we are on" },
        { token: "j <= i", meaning: "the inner limit depends on the outer counter" },
        { token: "System.out.println()", meaning: "empty println is the newline at the end of the row" },
      ],
      vizCode: `for (int i = 1; i <= 5; i++) {
  for (int j = 1; j <= i; j++) System.out.print("*");
  System.out.println();
}`,
      starter: `for (int i = 5; ; ) {
  for (int j = 1; ; j++) {
    System.out.print("*");
  }
  System.out.println();
}`,
      rules: {
        must: ["for"],
        regex: ["i\\s*>=\\s*1", "i--", "j\\s*<=\\s*i"],
        hint: "Count the outer loop down: start i at 5, keep going while i >= 1, step with i--. The inner loop is unchanged.",
        success:
          "Correct. Building the row into a StringBuilder and printing once is much faster than many small prints, which matters on large patterns.",
      },
      solution: `for (int i = 5; i >= 1; i--) {
  for (int j = 1; j <= i; j++) {
    System.out.print("*");
  }
  System.out.println();
}`,
    },

    javascript: {
      example: `for (let i = 1; i <= 5; i++) {
  let row = "";
  for (let j = 1; j <= i; j++) row += "*";
  console.log(row);
}`,
      notes: [
        { token: "let row = \"\"", meaning: "build the line as text, then print it once" },
        { token: "j <= i", meaning: "the inner limit depends on the outer counter" },
        { token: '"*".repeat(i)', meaning: "the shortcut — but the loop shows what is happening" },
      ],
      vizCode: `for (let i = 1; i <= 5; i++) {
  for (let j = 1; j <= i; j++) row += "*";
  console.log(row);
}`,
      starter: `for (let i = 5; ; ) {
  let row = "";
  for (let j = 1; ; j++) row += "*";
  console.log(row);
}`,
      rules: {
        must: ["for"],
        regex: ["i\\s*>=\\s*1", "i--", "j\\s*<=\\s*i"],
        hint: "Count the outer loop down: start i at 5, keep going while i >= 1, step with i--. The inner loop is unchanged.",
        success:
          'Correct. In real JavaScript you would write "*".repeat(i) — but the nested loop is what the later grid problems actually need.',
      },
      solution: `for (let i = 5; i >= 1; i--) {
  let row = "";
  for (let j = 1; j <= i; j++) row += "*";
  console.log(row);
}`,
    },

    rust: {
      example: `for i in 1..=5 {
    for _ in 1..=i {
        print!("*");
    }
    println!();
}`,
      notes: [
        { token: "for _ in", meaning: "the underscore means 'I do not need this counter'" },
        { token: "1..=i", meaning: "the inner limit depends on the outer counter" },
        { token: "println!()", meaning: "empty println! is the newline at the end of the row" },
      ],
      vizCode: `for i in 1..=5 {
    for _ in 1..=i { print!("*"); }
    println!();
}`,
      prompt:
        "Print an upside-down triangle: 5 stars on the first line, then 4, then 3, 2, 1. Only the outer range needs to change.",
      starter: `for i in  {
    for _ in 1..=i {
        print!("*");
    }
    println!();
}`,
      rules: {
        must: ["for", "println!"],
        regex: ["\\(\\s*1\\..?=\\s*5\\s*\\)\\.rev\\(\\)|1\\..?=5\\)\\.rev\\(\\)"],
        hint: "Rust has no counting-down for loop. Reverse the range instead: for i in (1..=5).rev().",
        success:
          "Correct. .rev() on a range is how Rust counts down — there is no i-- form, because the loop variable is not a mutable counter.",
      },
      solution: `for i in (1..=5).rev() {
    for _ in 1..=i {
        print!("*");
    }
    println!();
}`,
    },
  },

  /* --------------------------------------------------------- function -- */
  function: {
    c: {
      example: `int square(int x) {
  return x * x;
}

int main(void) {
  int r = square(6);
  printf("%d", r);   /* 36 */
  return 0;
}`,
      notes: [
        { token: "int square(...)", meaning: "the type it hands back" },
        { token: "(int x)", meaning: "what it needs, and the local name for it" },
        { token: "return x * x", meaning: "send one value back and stop right here" },
      ],
      vizCode: `int square(int x) {
  return x * x;
}

int main(void) {
  int r = square(6);
  printf("%d", r);
}`,
      starter: `int maxOf(int a, int b) {

}

int main(void) {
  printf("%d", );
}`,
      rules: {
        must: ["return"],
        regex: ["int\\s+maxOf\\s*\\(\\s*int\\s+a\\s*,\\s*int\\s+b\\s*\\)", "a\\s*>\\s*b|b\\s*>\\s*a", "maxOf\\s*\\(\\s*12\\s*,\\s*7\\s*\\)"],
        hint: "Inside maxOf write: if (a > b) return a; return b; Then call printf(\"%d\", maxOf(12, 7));",
        success:
          "Correct. No else is needed: return leaves the function on the spot, so anything after it only runs when the if did not fire.",
      },
      solution: `int maxOf(int a, int b) {
  if (a > b) return a;
  return b;
}

int main(void) {
  printf("%d", maxOf(12, 7));
}`,
    },

    python: {
      example: `def square(x):
    return x * x


def main():
    r = square(6)
    print(r)   # 36`,
      notes: [
        { token: "def", meaning: "defines a function; no return type is declared" },
        { token: "(x)", meaning: "what it needs, and the local name for it" },
        { token: "return x * x", meaning: "send one value back and stop right here" },
        { token: "no return", meaning: "a function that falls off the end gives back None" },
      ],
      vizCode: `def square(x):
    return x * x


def main():
    r = square(6)
    print(r)`,
      starter: `def max_of(a, b):
    

print()`,
      rules: {
        must: ["return"],
        regex: ["def\\s+max_of\\s*\\(\\s*a\\s*,\\s*b\\s*\\)", "a\\s*>\\s*b|b\\s*>\\s*a", "max_of\\s*\\(\\s*12\\s*,\\s*7\\s*\\)"],
        hint: "Inside max_of write: if a > b: return a  then return b. Then print(max_of(12, 7)).",
        success:
          "Correct. Python passes objects by reference, so changing a list inside a function does change the caller's list — unlike the plain numbers here.",
      },
      solution: `def max_of(a, b):
    if a > b:
        return a
    return b


print(max_of(12, 7))`,
    },

    java: {
      example: `static int square(int x) {
  return x * x;
}

public static void main(String[] args) {
  int r = square(6);
  System.out.println(r);   // 36
}`,
      notes: [
        { token: "static", meaning: "belongs to the class, so main can call it without an object" },
        { token: "int square(...)", meaning: "the type it hands back" },
        { token: "return x * x", meaning: "send one value back and stop right here" },
      ],
      vizCode: `static int square(int x) {
  return x * x;
}

public static void main(String[] a) {
  int r = square(6);
  System.out.println(r);
}`,
      starter: `static int maxOf(int a, int b) {

}

public static void main(String[] args) {
  System.out.println();
}`,
      rules: {
        must: ["return"],
        regex: ["int\\s+maxOf\\s*\\(\\s*int\\s+a\\s*,\\s*int\\s+b\\s*\\)", "a\\s*>\\s*b|b\\s*>\\s*a", "maxOf\\s*\\(\\s*12\\s*,\\s*7\\s*\\)"],
        hint: "Inside maxOf write: if (a > b) return a; return b; Then System.out.println(maxOf(12, 7));",
        success:
          "Correct. Java already has Math.max, but writing it yourself is the point — and static is what lets main reach it.",
      },
      solution: `static int maxOf(int a, int b) {
  if (a > b) return a;
  return b;
}

public static void main(String[] args) {
  System.out.println(maxOf(12, 7));
}`,
    },

    javascript: {
      example: `function square(x) {
  return x * x;
}

function main() {
  const r = square(6);
  console.log(r);   // 36
}`,
      notes: [
        { token: "function square(x)", meaning: "no types are declared — JavaScript checks nothing" },
        { token: "return x * x", meaning: "send one value back and stop right here" },
        { token: "const square = (x) => x * x", meaning: "the arrow form; same thing, shorter" },
      ],
      vizCode: `function square(x) {
  return x * x;
}

function main() {
  const r = square(6);
  console.log(r);
}`,
      starter: `function maxOf(a, b) {

}

console.log();`,
      rules: {
        must: ["return"],
        regex: ["function\\s+maxOf\\s*\\(\\s*a\\s*,\\s*b\\s*\\)|maxOf\\s*=\\s*\\(\\s*a\\s*,\\s*b\\s*\\)", "a\\s*>\\s*b|b\\s*>\\s*a", "maxOf\\s*\\(\\s*12\\s*,\\s*7\\s*\\)"],
        hint: "Inside maxOf write: if (a > b) return a; return b; Then console.log(maxOf(12, 7));",
        success:
          "Correct. A JavaScript function that returns nothing gives back undefined, and undefined in arithmetic produces NaN — which is why a missing return is so hard to trace.",
      },
      solution: `function maxOf(a, b) {
  if (a > b) return a;
  return b;
}

console.log(maxOf(12, 7));`,
    },

    rust: {
      example: `fn square(x: i32) -> i32 {
    x * x        // no semicolon — this IS the return value
}

fn main() {
    let r = square(6);
    println!("{}", r);   // 36
}`,
      notes: [
        { token: "-> i32", meaning: "the type it hands back" },
        { token: "x * x with no semicolon", meaning: "the last expression is the return value" },
        { token: "x * x;", meaning: "with a semicolon it returns nothing, and this will not compile" },
      ],
      vizCode: `fn square(x: i32) -> i32 {
    x * x
}

fn main() {
    let r = square(6);
    println!("{}", r);
}`,
      starter: `fn max_of(a: i32, b: i32) -> i32 {

}

fn main() {
    println!("{}", );
}`,
      rules: {
        regex: ["fn\\s+max_of\\s*\\(\\s*a\\s*:\\s*i32\\s*,\\s*b\\s*:\\s*i32\\s*\\)\\s*->\\s*i32", "a\\s*>\\s*b|b\\s*>\\s*a", "max_of\\s*\\(\\s*12\\s*,\\s*7\\s*\\)"],
        hint:
          "Inside max_of write: if a > b { a } else { b } — no semicolons and no return keyword, because the whole if is the value.",
        success:
          "Correct. In Rust an if is an expression, so it produces a value directly. Adding a semicolon after the branch would throw that value away.",
      },
      solution: `fn max_of(a: i32, b: i32) -> i32 {
    if a > b { a } else { b }
}

fn main() {
    println!("{}", max_of(12, 7));
}`,
    },
  },

  /* ------------------------------------------------------- complexity -- */
  complexity: {
    c: {
      example: `/* O(1) — one step, whatever n is */
int first = a[0];

/* O(n) — one lap per item */
for (int i = 0; i < n; i++) sum += a[i];

/* O(n^2) — one lap per pair */
for (int i = 0; i < n; i++)
  for (int j = 0; j < n; j++)
    if (a[i] + a[j] == target) found = 1;`,
      notes: [
        { token: "O(1)", meaning: "does not grow with n at all" },
        { token: "O(n)", meaning: "one pass" },
        { token: "O(n²)", meaning: "nested loops — fine to n≈5000, fatal beyond" },
      ],
      starter: `for (int i = 0; i < n; i++) {
  for (int j = ; j < n; j++) {
    if (a[i] + a[j] == target) found = 1;
  }
}`,
      rules: {
        regex: ["j\\s*=\\s*i\\s*\\+\\s*1"],
        hint: "Start the inner loop at j = i + 1. Every pair is then checked once instead of twice.",
        success:
          "Correct. The work halves, but the shape is still O(n²) — Big-O throws the constant away, and halving a quadratic does not save you at a million items.",
      },
      solution: `for (int i = 0; i < n; i++) {
  for (int j = i + 1; j < n; j++) {
    if (a[i] + a[j] == target) found = 1;
  }
}`,
    },

    python: {
      example: `# O(1) — one step, whatever n is
first = a[0]

# O(n) — one lap per item
total = sum(a)

# O(n^2) — one lap per pair
for i in range(n):
    for j in range(n):
        if a[i] + a[j] == target:
            found = True`,
      notes: [
        { token: "O(1)", meaning: "does not grow with n at all" },
        { token: "x in a_list", meaning: "O(n) — it really does check every element" },
        { token: "x in a_set", meaning: "O(1) — the same word, a completely different cost" },
        { token: "s += piece", meaning: "strings are immutable, so this copies. Use a list and join." },
      ],
      starter: `for i in range(n):
    for j in range():
        if a[i] + a[j] == target:
            found = True`,
      rules: {
        regex: ["range\\s*\\(\\s*i\\s*\\+\\s*1\\s*,\\s*n\\s*\\)"],
        hint: "Start the inner loop at i + 1: range(i + 1, n). Every pair is then checked once instead of twice.",
        success:
          "Correct. Worth knowing in Python specifically: `in` on a list is O(n) and `in` on a set is O(1), so a stray list membership check inside a loop quietly makes your code quadratic.",
      },
      solution: `for i in range(n):
    for j in range(i + 1, n):
        if a[i] + a[j] == target:
            found = True`,
    },

    java: {
      example: `// O(1) — one step, whatever n is
int first = a[0];

// O(n) — one lap per item
for (int i = 0; i < n; i++) sum += a[i];

// O(n^2) — one lap per pair
for (int i = 0; i < n; i++)
  for (int j = 0; j < n; j++)
    if (a[i] + a[j] == target) found = true;`,
      notes: [
        { token: "O(1)", meaning: "does not grow with n at all" },
        { token: "O(n²)", meaning: "nested loops — fine to n≈5000, fatal beyond" },
        { token: "s += piece", meaning: "String is immutable, so this is O(n²). Use StringBuilder." },
        { token: "long", meaning: "int overflows at about 2.1 billion, same as C++" },
      ],
      starter: `for (int i = 0; i < n; i++) {
  for (int j = ; j < n; j++) {
    if (a[i] + a[j] == target) found = true;
  }
}`,
      rules: {
        regex: ["j\\s*=\\s*i\\s*\\+\\s*1"],
        hint: "Start the inner loop at j = i + 1. Every pair is then checked once instead of twice.",
        success:
          "Correct. The Java-specific version of this trap is building a String in a loop with += — that is silently O(n²), and StringBuilder is the fix.",
      },
      solution: `for (int i = 0; i < n; i++) {
  for (int j = i + 1; j < n; j++) {
    if (a[i] + a[j] == target) found = true;
  }
}`,
    },

    javascript: {
      example: `// O(1) — one step, whatever n is
const first = a[0];

// O(n) — one lap per item
const total = a.reduce((s, x) => s + x, 0);

// O(n^2) — one lap per pair
for (let i = 0; i < n; i++)
  for (let j = 0; j < n; j++)
    if (a[i] + a[j] === target) found = true;`,
      notes: [
        { token: "O(1)", meaning: "does not grow with n at all" },
        { token: "arr.includes(x)", meaning: "O(n) — a Set's .has(x) is O(1)" },
        { token: "arr.shift()", meaning: "O(n) — it moves every other element. Never use it as a queue." },
        { token: "Number.MAX_SAFE_INTEGER", meaning: "integers stop being exact past 2^53" },
      ],
      starter: `for (let i = 0; i < n; i++) {
  for (let j = ; j < n; j++) {
    if (a[i] + a[j] === target) found = true;
  }
}`,
      rules: {
        regex: ["j\\s*=\\s*i\\s*\\+\\s*1"],
        hint: "Start the inner loop at j = i + 1. Every pair is then checked once instead of twice.",
        success:
          "Correct. The JavaScript trap to remember is arr.shift() in a loop — it looks like O(1) and is O(n), turning a BFS into O(n²).",
      },
      solution: `for (let i = 0; i < n; i++) {
  for (let j = i + 1; j < n; j++) {
    if (a[i] + a[j] === target) found = true;
  }
}`,
    },

    rust: {
      example: `// O(1) — one step, whatever n is
let first = a[0];

// O(n) — one lap per item
let total: i64 = a.iter().sum();

// O(n^2) — one lap per pair
for i in 0..n {
    for j in 0..n {
        if a[i] + a[j] == target { found = true; }
    }
}`,
      notes: [
        { token: "O(1)", meaning: "does not grow with n at all" },
        { token: "a.iter()", meaning: "borrows — no copy, so it stays O(1) extra memory" },
        { token: ".clone()", meaning: "an O(n) copy. Easy to scatter about without noticing." },
        { token: "cargo build --release", meaning: "debug builds are many times slower; always measure released" },
      ],
      starter: `for i in 0..n {
    for j in  {
        if a[i] + a[j] == target { found = true; }
    }
}`,
      rules: {
        regex: ["\\(\\s*i\\s*\\+\\s*1\\s*\\)\\.\\.n|i\\s*\\+\\s*1\\s*\\.\\.\\s*n"],
        hint: "Start the inner loop at i + 1: for j in (i + 1)..n. Every pair is then checked once instead of twice.",
        success:
          "Correct. The Rust-specific trap is .clone() inside a loop — the borrow checker pushes people towards it, and each one is a hidden O(n).",
      },
      solution: `for i in 0..n {
    for j in (i + 1)..n {
        if a[i] + a[j] == target { found = true; }
    }
}`,
    },
  },
};
