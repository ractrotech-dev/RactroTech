import type { TopicLesson } from "@/lib/dsa/lessons/types";
import {
  IO_VIZ,
  traceDigits,
  traceFactorial,
  traceFastPow,
  traceForLoop,
  traceFunctionCall,
  traceGrowth,
  traceIfElse,
  tracePattern,
  tracePrimeCheck,
  traceSieve,
  traceWhileLoop,
} from "@/lib/dsa/viz/traceBasics";

export const FUNDAMENTALS: TopicLesson = {
  id: "fundamentals",
  title: "Fundamentals",
  tagline: "The five things every later chapter assumes you already have.",
  why:
    "Every algorithm on this site is built from four moves: read a value, ask a question, repeat something, and give a piece of work a name. If any of those four feel shaky, the later chapters will feel like magic instead of like steps. This chapter makes them solid, then teaches you to measure how slow your code is before you run it.",
  plain: [
    "A program is a list of instructions the computer follows from top to bottom, one at a time. It never skips ahead and it never guesses what you meant.",
    "A variable is a labelled box in memory. int x = 5 means: make a box, call it x, and put 5 in it. Later you can look inside or put something else in.",
    "Everything else in programming is a way to control which instruction runs next — a question (if), a repeat (loop), or a jump into named work (function).",
  ],
  needs: [
    "Enough of your language to write a loop and a function. If any of that is shaky, the Learn the language track covers it first.",
  ],
  costs: [
    { what: "Reading or writing one variable", time: "O(1)", note: "Always instant, whatever else is going on." },
    { what: "A loop that runs n times", time: "O(n)", note: "Cost of one lap × number of laps." },
    { what: "A loop inside a loop", time: "O(n²)", note: "The one that quietly kills you at n = 100000." },
  ],
  traps: [
    "int can only hold numbers up to about 2.1 billion. n * (n-1) / 2 overflows an int when n is only about 65000. Use long long the moment you multiply two inputs together.",
    "= puts a value in a box. == asks whether two values are the same. Writing if (x = 5) sets x to 5 and is always true.",
    "Integer division throws away the remainder: 7 / 2 is 3, not 3.5. Use 7.0 / 2 if you actually want a decimal.",
  ],
  sections: [
    {
      id: "io",
      kicker: "01",
      title: "Reading in, printing out",
      hook:
        "Your program needs two numbers that you will not know until it runs, and it must print their total. You cannot type the numbers into the code. How does the outside world get in?",
      body: [
        "cin means 'console in'. It takes what the user typed and puts it into a box. The arrows >> point towards the box, because that is where the data is going.",
        "cout means 'console out'. The arrows << point away from the box, towards the screen.",
        "Reading does not empty the box, and printing does not empty it either. A box keeps its value until you deliberately overwrite it.",
        "One cin line can fill several boxes. It just keeps reading, one whitespace-separated chunk at a time.",
      ],
      viz: IO_VIZ,
      example: `#include <iostream>
using namespace std;

int main() {
  int a, b;
  cin >> a >> b;      // read two numbers
  cout << a + b;      // print their total
}`,
      notes: [
        { token: "#include <iostream>", meaning: "brings cin and cout into your file" },
        { token: "int a, b;", meaning: "make two empty boxes that hold whole numbers" },
        { token: "cin >> a >> b", meaning: "fill a, then fill b, from what was typed" },
        { token: "cout << a + b", meaning: "work out the sum first, then print the result" },
      ],
      challenge: {
        prompt:
          "Read three numbers into a, b and c, then print their average. Careful: the average of 1, 2 and 2 is not a whole number, so do not let integer division eat the decimals.",
        starter: `int a, b, c;
cin >> ;

cout << `,
        rules: {
          regex: ["cin\\s*>>\\s*a\\s*>>\\s*b\\s*>>\\s*c", "cout\\s*<<", "3\\.0|\\(double\\)|3\\.0\\s*\\)"],
          hint:
            "Read all three with one cin line: cin >> a >> b >> c. Then print (a + b + c) / 3.0 — the .0 is what stops C++ from throwing away the decimal part.",
          success:
            "Correct. Dividing by 3.0 instead of 3 is the difference between 1 and 1.666 — and it is the single most common beginner bug in C++.",
        },
        solution: `int a, b, c;
cin >> a >> b >> c;

cout << (a + b + c) / 3.0;`,
      },
    },
    {
      id: "conditions",
      kicker: "02",
      title: "Asking a question",
      hook:
        "A mark of 95 should print A, a mark of 60 should print Pass, and a mark of 20 should print Fail. If you write three separate if statements, 95 prints all three. Why?",
      body: [
        "if runs a block only when its question is true. On its own, an if does not know anything about the ifs around it.",
        "else if is different. It is only ever asked when every question above it has already said no. That is what makes the three answers exclusive.",
        "else is the catch-all. It runs when nothing above it matched, and it asks no question of its own.",
        "So the order matters enormously. Put the strictest condition first — if you check m >= 50 before m >= 90, then 95 stops at Pass and never reaches A.",
      ],
      viz: traceIfElse([95, 60, 20, 90]),
      example: `int m;
cin >> m;

if (m >= 90)      cout << "A";
else if (m >= 50) cout << "Pass";
else              cout << "Fail";`,
      notes: [
        { token: "m >= 90", meaning: "the strictest test, so it must come first" },
        { token: "else if", meaning: "only asked when the line above said no" },
        { token: "else", meaning: "everything that is left over" },
      ],
      challenge: {
        prompt:
          "Read a number and print Even or Odd. Use the % operator, which gives the remainder after division — 10 % 2 is 0, and 7 % 2 is 1.",
        starter: `int n;
cin >> n;

if ( ) {
  cout << "Even";
} else {
  cout << "Odd";
}`,
        rules: {
          regex: ["n\\s*%\\s*2\\s*==\\s*0", "cout\\s*<<\\s*\"Even\"", "else"],
          hint:
            "A number is even when dividing by 2 leaves nothing behind. Write if (n % 2 == 0). Remember == for a question, not =.",
          success:
            "Correct. n % 2 == 0 is the standard way to ask 'is this even', and you will see it in almost every maths problem later.",
        },
        solution: `int n;
cin >> n;

if (n % 2 == 0) {
  cout << "Even";
} else {
  cout << "Odd";
}`,
      },
    },
    {
      id: "for",
      kicker: "03",
      title: "The for loop",
      hook:
        "Print the numbers 1 to 5. Now print 1 to 1000. If your answer to the second one involves any copying and pasting, you do not have a loop yet.",
      body: [
        "A for loop packs three promises onto one line, separated by semicolons.",
        "The first part runs once, before anything else: int i = 1. This is the setup.",
        "The second part is a gate, checked before every single lap: i <= 5. If it is true the body runs; the moment it is false the loop is over.",
        "The third part runs after every lap: i++, which means 'add one to i'. Forget this and the gate never changes, so the loop runs forever.",
        "Use a for loop when you know in advance how many laps you want.",
      ],
      viz: traceForLoop(5),
      example: `for (int i = 1; i <= 5; i++) {
  cout << i << " ";
}
// prints: 1 2 3 4 5`,
      notes: [
        { token: "int i = 1", meaning: "setup — runs once at the very start" },
        { token: "i <= 5", meaning: "the gate — checked before every lap" },
        { token: "i++", meaning: "the step — runs after every lap" },
      ],
      challenge: {
        prompt:
          "Print the sum of 1 + 2 + 3 + ... + 100 using a loop. Do not use the n(n+1)/2 formula — the point here is to keep a running total inside the loop.",
        starter: `int sum = 0;

for (int i = 1; ; ) {

}

cout << sum;`,
        rules: {
          must: ["for", "sum"],
          regex: ["i\\s*<=\\s*100|i\\s*<\\s*101", "i\\+\\+", "sum\\s*(\\+=|=\\s*sum\\s*\\+)"],
          hint:
            "Start sum at 0. Loop i from 1 while i <= 100, stepping with i++. Inside the loop write sum += i, which is shorthand for sum = sum + i.",
          success:
            "Correct — the answer is 5050. A variable that survives across laps and collects something is called an accumulator, and you will use one in nearly every problem from here on.",
        },
        solution: `int sum = 0;

for (int i = 1; i <= 100; i++) {
  sum += i;
}

cout << sum;`,
      },
    },
    {
      id: "while",
      kicker: "04",
      title: "The while loop",
      hook:
        "Keep halving 27 (rounding down) until it reaches 1, and count how many steps that took. You cannot write this as a for loop, because nobody can tell you the number of laps beforehand.",
      body: [
        "A while loop has only the gate. No setup, no step — you write those yourself, wherever they belong.",
        "Use while when the finish line is a condition, not a count: until the user types 0, until the number reaches 1, until nothing changed this round.",
        "The danger is real: if nothing inside the body can ever make the gate false, the program hangs forever. Every while loop needs something inside it that moves towards the exit.",
        "Anything you can write with for you can write with while, and the other way round. Pick whichever makes the intent obvious.",
      ],
      viz: traceWhileLoop(27),
      example: `int n = 27, steps = 0;

while (n > 1) {
  if (n % 2 == 0) n = n / 2;
  else            n = 3 * n + 1;
  steps++;
}

cout << steps;`,
      notes: [
        { token: "while (n > 1)", meaning: "keep going as long as this is true" },
        { token: "n = n / 2", meaning: "the body must move n towards 1, or it never ends" },
        { token: "steps++", meaning: "count the laps by hand — while does not do it for you" },
      ],
      challenge: {
        prompt:
          "Count how many digits a number has. Read n, then keep dividing it by 10 until nothing is left, counting each division. 4721 has 4 digits.",
        starter: `int n, digits = 0;
cin >> n;

while ( ) {

}

cout << digits;`,
        rules: {
          must: ["while", "digits"],
          regex: ["n\\s*>\\s*0", "n\\s*(/=\\s*10|=\\s*n\\s*/\\s*10)", "digits\\+\\+|digits\\s*\\+="],
          hint:
            "Loop while n > 0. Inside, do digits++ and then n /= 10. Integer division chops off the last digit each time, so 4721 becomes 472, then 47, then 4, then 0.",
          success:
            "Correct. Dividing by 10 to peel digits off a number is a trick you will reuse in palindromes, digit sums and reversing numbers.",
        },
        solution: `int n, digits = 0;
cin >> n;

while (n > 0) {
  digits++;
  n /= 10;
}

cout << digits;`,
      },
    },
    {
      id: "nested",
      kicker: "05",
      title: "A loop inside a loop",
      hook:
        "Print a triangle of stars: one star on line 1, two on line 2, up to five on line 5. One loop cannot do it — the number of stars changes on every line.",
      body: [
        "When a loop sits inside another loop, the inner one runs completely for every single lap of the outer one.",
        "The outer loop usually picks the row. The inner loop fills that row.",
        "The trick to patterns is that the inner loop's gate can mention the outer loop's counter. Writing j <= i is what makes each line one star longer than the last.",
        "Be aware of the cost. If the outer loop runs n times and the inner one runs n times, the body runs n × n times. That is O(n²), and it is the reason a program that flies at n = 100 dies at n = 100000.",
      ],
      viz: tracePattern(5),
      example: `for (int i = 1; i <= 5; i++) {
  for (int j = 1; j <= i; j++) {
    cout << "*";
  }
  cout << endl;
}`,
      notes: [
        { token: "outer i", meaning: "which line we are on" },
        { token: "j <= i", meaning: "the inner limit depends on the outer counter" },
        { token: "cout << endl", meaning: "after the inner loop finishes — one newline per line" },
      ],
      challenge: {
        prompt:
          "Print an upside-down triangle: 5 stars on the first line, then 4, then 3, 2, 1. Only the two gates need to change.",
        starter: `for (int i = 5; ; ) {
  for (int j = 1; ; j++) {
    cout << "*";
  }
  cout << endl;
}`,
        rules: {
          must: ["for", "endl"],
          regex: ["i\\s*>=\\s*1", "i--", "j\\s*<=\\s*i"],
          hint:
            "Make the outer loop count down: start i at 5, keep going while i >= 1, step with i--. The inner loop stays exactly the same: j from 1 while j <= i.",
          success:
            "Correct. The inner loop never changed — you only reversed the outer walk. Recognising which loop owns which job is most of pattern printing.",
        },
        solution: `for (int i = 5; i >= 1; i--) {
  for (int j = 1; j <= i; j++) {
    cout << "*";
  }
  cout << endl;
}`,
      },
    },
    {
      id: "function",
      kicker: "06",
      title: "Functions",
      hook:
        "You need the square of a number in four different places. Copying the same line four times means fixing a bug in four places. What is the alternative?",
      body: [
        "A function is a piece of work with a name. You describe it once and use it anywhere.",
        "int square(int x) reads right to left: it takes one int, which it will call x inside, and it hands back an int.",
        "When you call square(6), a fresh box called x is created and 6 is copied into it. The caller pauses and waits.",
        "return sends one value back and ends the function immediately. Everything the function made — including x — disappears at that moment.",
        "Because the value is copied in, changing x inside the function does not touch the original. That surprises people, and it is worth remembering.",
      ],
      viz: traceFunctionCall(),
      example: `int square(int x) {
  return x * x;
}

int main() {
  int r = square(6);
  cout << r;        // 36
}`,
      notes: [
        { token: "int square(...)", meaning: "the type it hands back" },
        { token: "(int x)", meaning: "what it needs, and the local name for it" },
        { token: "return x * x", meaning: "send one value back and stop right here" },
      ],
      challenge: {
        prompt:
          "Write a function called maxOf that takes two ints and returns the bigger one. Then print maxOf(12, 7).",
        starter: `int maxOf(int a, int b) {

}

int main() {
  cout << ;
}`,
        rules: {
          must: ["return"],
          regex: ["int\\s+maxOf\\s*\\(\\s*int\\s+a\\s*,\\s*int\\s+b\\s*\\)", "a\\s*>\\s*b|b\\s*>\\s*a", "maxOf\\s*\\(\\s*12\\s*,\\s*7\\s*\\)"],
          hint:
            "Inside maxOf, write: if (a > b) return a; return b; — the second return only runs when the first one did not. Then call cout << maxOf(12, 7);",
          success:
            "Correct. Notice you needed no else: return leaves the function on the spot, so anything after it only runs when the if did not fire.",
        },
        solution: `int maxOf(int a, int b) {
  if (a > b) return a;
  return b;
}

int main() {
  cout << maxOf(12, 7);
}`,
      },
    },
    {
      id: "complexity",
      kicker: "07",
      title: "Time complexity",
      hook:
        "Two programs both give the right answer on your laptop with 10 items. On the real input of 1000000 items, one finishes in a second and the other would still be running next week. How could you have known before running either?",
      body: [
        "Big-O counts how the work grows when the input grows. It deliberately ignores the exact machine, the language, and any constant multiplier.",
        "O(1) means the work does not depend on n at all — reading a[5] costs the same whether the array has 5 boxes or 5 million.",
        "O(n) means one lap per item. O(n²) means one lap per pair, which is a loop inside a loop. O(log n) means the problem halves every step — that is why binary search on a million items takes only 20 looks.",
        "Constants are dropped on purpose. O(2n) is written O(n), because the shape of the growth is what decides whether you finish, not the multiplier.",
        "The practical rule: a computer gets through roughly 100 million simple steps per second. Work out the steps your method needs at the largest n allowed, and compare.",
        "Space complexity is the same idea for memory. An extra array of n items is O(n) space; a handful of variables is O(1) space.",
      ],
      viz: traceGrowth(),
      example: `// O(1) — one step, whatever n is
int first = a[0];

// O(n) — one lap per item
for (int i = 0; i < n; i++) sum += a[i];

// O(n^2) — one lap per pair
for (int i = 0; i < n; i++)
  for (int j = 0; j < n; j++)
    if (a[i] + a[j] == target) found = true;

// O(log n) — the range halves every lap
while (lo <= hi) { int mid = (lo + hi) / 2; ... }`,
      notes: [
        { token: "O(1)", meaning: "does not grow with n at all" },
        { token: "O(n)", meaning: "one pass" },
        { token: "O(n²)", meaning: "nested loops — fine to n≈5000, fatal beyond" },
        { token: "O(log n)", meaning: "halving — a million items in 20 steps" },
      ],
      challenge: {
        prompt:
          "This code finds whether any two numbers add to a target, and it is O(n²). Rewrite the inner loop so it starts at i + 1 instead of 0. That does not change the Big-O, but say what it does change — then write the loop.",
        starter: `for (int i = 0; i < n; i++) {
  for (int j = ; j < n; j++) {
    if (a[i] + a[j] == target) found = true;
  }
}`,
        rules: {
          regex: ["j\\s*=\\s*i\\s*\\+\\s*1"],
          hint:
            "Start the inner loop at j = i + 1. Every pair is then checked once instead of twice, and a number is never added to itself.",
          success:
            "Correct. The work halves — roughly n²/2 instead of n² — but the shape is still O(n²), because Big-O throws the constant away. Halving a quadratic does not save you at a million items; only a better shape does.",
        },
        solution: `for (int i = 0; i < n; i++) {
  for (int j = i + 1; j < n; j++) {
    if (a[i] + a[j] == target) found = true;
  }
}`,
      },
    },
  ],
};

export const MATHS: TopicLesson = {
  id: "maths",
  title: "Maths, Patterns & Recursion",
  tagline: "Digits, divisors, and a function that calls itself.",
  why:
    "Recursion is the hinge of this whole subject. Trees, graphs, backtracking, divide and conquer and dynamic programming are all recursion wearing different clothes. The maths problems here are small on purpose — they let you practise the shape of recursion on something you can check in your head.",
  plain: [
    "Recursion is a function that calls itself on a smaller version of the same problem.",
    "It needs exactly two things: a base case that answers immediately without calling anything, and a recursive step that makes the problem smaller and hands it on.",
    "Miss the base case and the calls never stop, the memory used by the paused calls runs out, and the program crashes. That crash is called a stack overflow.",
  ],
  needs: ["Loops and functions from Fundamentals."],
  costs: [
    { what: "Recursion depth n", time: "O(n) memory", note: "Every paused call takes memory. 10⁵ deep can crash." },
    { what: "Checking if n is prime", time: "O(√n)", note: "Factors come in pairs, so stop at the square root." },
    { what: "Sieve of Eratosthenes", time: "O(n log log n)", note: "All primes below n, effectively linear." },
    { what: "Fast exponentiation", time: "O(log n)", note: "aⁿ by squaring, not by n multiplications." },
  ],
  traps: [
    "A recursive function with no base case does not loop forever — it crashes, because each paused call eats memory.",
    "Checking primes by looping i up to n is O(n). Loop while i * i <= n instead, and use long long so i * i does not overflow.",
    "1 is not a prime number. 2 is, and it is the only even one.",
  ],
  sections: [
    {
      id: "recursion",
      kicker: "01",
      title: "A function that calls itself",
      hook:
        "5! means 5 × 4 × 3 × 2 × 1. Notice that 5! is just 5 × 4!. If you can spot that, you can write factorial without any loop at all — but what stops it going 3, 2, 1, 0, −1, forever?",
      body: [
        "Recursion works when a big problem contains a smaller copy of itself. Factorial does: n! is n × (n−1)!.",
        "Every recursive function needs a base case — a size so small it can be answered on the spot. For factorial, that is 1! = 1.",
        "When fact(5) calls fact(4), it does not disappear. It pauses, keeping its own n, and waits. Five paused calls stack up before any answer exists.",
        "Then the base case returns and the answers travel back up, each paused call finishing its multiplication on the way.",
        "So recursion has two directions: everything goes down first, and nothing is computed until the bottom is reached.",
      ],
      viz: traceFactorial(5),
      example: `int fact(int n) {
  if (n <= 1) return 1;     // base case — stops the fall
  return n * fact(n - 1);   // smaller version of the same job
}

cout << fact(5);   // 120`,
      notes: [
        { token: "if (n <= 1)", meaning: "the only line that does not call anything" },
        { token: "fact(n - 1)", meaning: "smaller — this is what guarantees we reach the base" },
        { token: "n * ...", meaning: "runs on the way back up, not on the way down" },
      ],
      challenge: {
        prompt:
          "Write a recursive function sumTo(n) that returns 1 + 2 + ... + n. Same shape as factorial: one base case, one smaller call. Do not use a loop.",
        starter: `int sumTo(int n) {

}`,
        rules: {
          must: ["return", "sumTo"],
          mustNot: ["for", "while"],
          regex: ["if\\s*\\(\\s*n\\s*(<=|==)\\s*[01]\\s*\\)", "n\\s*\\+\\s*sumTo\\s*\\(\\s*n\\s*-\\s*1\\s*\\)"],
          hint:
            "Base case: if n is 0 (or 1) there is nothing left to add, so return that value. Otherwise return n + sumTo(n - 1).",
          success:
            "Correct. You swapped one operator — × became + — and the whole shape carried over. That shape is what you are really learning here.",
        },
        solution: `int sumTo(int n) {
  if (n <= 0) return 0;
  return n + sumTo(n - 1);
}`,
      },
    },
    {
      id: "digits",
      kicker: "02",
      title: "Taking a number apart",
      hook:
        "Is 121 a palindrome? You are not allowed to turn it into a string. You only have + − × / and %. How do you get at the individual digits?",
      body: [
        "Two operators do all the work. n % 10 gives the last digit. n / 10 removes the last digit, because integer division throws the remainder away.",
        "So 4721 % 10 is 1, and 4721 / 10 is 472. Repeat and you have peeled the whole number.",
        "To build a number up instead, do rev = rev * 10 + digit. Multiplying by 10 shifts everything left one place and leaves a zero for the new digit.",
        "A number is a palindrome when its reverse equals the original. Watch for overflow: reversing a large int can exceed what an int can hold, so use long long.",
      ],
      viz: traceDigits(4721),
      example: `int n = 4721, rev = 0;

while (n > 0) {
  int digit = n % 10;      // last digit
  rev = rev * 10 + digit;  // stick it on the end of rev
  n = n / 10;              // drop it from n
}

cout << rev;   // 1274`,
      notes: [
        { token: "n % 10", meaning: "the last digit" },
        { token: "n / 10", meaning: "everything except the last digit" },
        { token: "rev * 10 + digit", meaning: "shift left, then append" },
      ],
      challenge: {
        prompt:
          "Read a number and print the sum of its digits. 4721 gives 4 + 7 + 2 + 1 = 14.",
        starter: `int n, sum = 0;
cin >> n;

while ( ) {

}

cout << sum;`,
        rules: {
          must: ["while", "sum"],
          regex: ["n\\s*>\\s*0", "n\\s*%\\s*10", "n\\s*(/=\\s*10|=\\s*n\\s*/\\s*10)"],
          hint: "Loop while n > 0. Inside: sum += n % 10; then n /= 10.",
          success:
            "Correct. Peeling digits with % 10 and / 10 shows up in Armstrong numbers, digit DP and checksum problems — it is worth having in your fingers.",
        },
        solution: `int n, sum = 0;
cin >> n;

while (n > 0) {
  sum += n % 10;
  n /= 10;
}

cout << sum;`,
      },
    },
    {
      id: "primes",
      kicker: "03",
      title: "Primes without wasting time",
      hook:
        "Is 9973 prime? The obvious method tries every number from 2 to 9972. That is nearly ten thousand checks. You can get the same answer in under a hundred. What is being wasted?",
      body: [
        "A prime has exactly two divisors: 1 and itself. 1 is not prime, because it only has one.",
        "Here is the key observation: divisors come in pairs. If 100 divides by 4, it also divides by 25 — and 4 × 25 = 100. One member of every pair is always at or below the square root.",
        "So if nothing up to √n divides n, nothing above it can either. Checking to √n is enough, and that turns 10000 checks into 100.",
        "Write the gate as i * i <= n rather than i <= sqrt(n). It avoids floating-point rounding, and it is faster.",
        "If you need every prime below some limit rather than one answer, use the Sieve of Eratosthenes: mark every multiple of every prime as composite in one sweep.",
      ],
      viz: tracePrimeCheck(97),
      example: `bool isPrime(long long n) {
  if (n < 2) return false;
  for (long long i = 2; i * i <= n; i++)
    if (n % i == 0) return false;
  return true;
}`,
      notes: [
        { token: "n < 2", meaning: "0 and 1 are not prime — handle them first" },
        { token: "i * i <= n", meaning: "stop at the square root, no sqrt() needed" },
        { token: "return false", meaning: "one divisor is enough to settle it" },
      ],
      challenge: {
        prompt:
          "Count how many divisors a number has. 12 has 6 of them: 1, 2, 3, 4, 6, 12. A simple loop to n works — write that one first.",
        starter: `int n, count = 0;
cin >> n;

for (int i = 1; ; i++) {
  if ( ) count++;
}

cout << count;`,
        rules: {
          must: ["count"],
          regex: ["i\\s*<=\\s*n", "n\\s*%\\s*i\\s*==\\s*0"],
          hint: "Loop i from 1 while i <= n. If n % i == 0 then i divides n, so count++.",
          success:
            "Correct. Now think about the faster version: loop only to √n, and count two divisors each time (i and n / i), being careful not to double-count when i * i == n exactly.",
        },
        solution: `int n, count = 0;
cin >> n;

for (int i = 1; i <= n; i++) {
  if (n % i == 0) count++;
}

cout << count;`,
      },
    },
  ],
};

export const NUMBER_THEORY: TopicLesson = {
  id: "number-theory",
  title: "Number Theory",
  tagline: "Primes in bulk, powers in log time, and why answers come back mod 10⁹+7.",
  why:
    "Counting problems produce enormous numbers — the count of arrangements of 50 items has 65 digits. Rather than use huge-number libraries, problems ask for the answer modulo a large prime. That means every add, multiply and divide has to be done carefully. This chapter is the toolkit.",
  plain: [
    "Modular arithmetic is clock arithmetic. On a 12-hour clock, 10 + 5 is 3. In code, that is (10 + 5) % 12.",
    "Problems say 'output the answer modulo 1000000007' because the true answer is far too large to store. 10⁹+7 is chosen because it is prime and just under the int limit.",
    "Adding and multiplying under a modulus is easy. Dividing is not — and the fix for that is the one genuinely new idea here.",
  ],
  needs: ["Loops, functions and recursion.", "The %, and why int overflows."],
  costs: [
    { what: "Sieve of Eratosthenes", time: "O(n log log n)", note: "Every prime below 10⁷ in under a second." },
    { what: "Fast exponentiation", time: "O(log n)", note: "2^1000000 mod p in 20 multiplications." },
    { what: "GCD (Euclid)", time: "O(log min(a,b))", note: "Astonishingly fast for three lines of code." },
    { what: "Modular inverse", time: "O(log p)", note: "Fermat's little theorem — needs a prime modulus." },
  ],
  traps: [
    "(a * b) % m overflows int whenever a and b are near 10⁹. Cast to long long before multiplying, not after.",
    "Subtraction under a modulus can go negative. Write ((a - b) % m + m) % m.",
    "You cannot divide under a modulus by writing /. You multiply by the modular inverse instead.",
  ],
  sections: [
    {
      id: "sieve",
      kicker: "01",
      title: "The sieve",
      hook:
        "You need every prime below one million. Testing each one separately in O(√n) means about 10⁹ operations. There is a way to get all of them in roughly one million steps. What changes?",
      body: [
        "Stop asking 'is this number prime' one at a time. Instead, assume every number is prime, then cross out the ones that cannot be.",
        "Start at 2. It is prime. Cross out 4, 6, 8, 10 — every multiple of 2. They all have 2 as a divisor.",
        "Move to 3, which is still uncrossed, so it is prime. Cross out 6, 9, 12, and so on.",
        "Skip anything already crossed out — it is composite, and its multiples were handled by its own smallest prime factor already.",
        "Two speed-ups matter: stop the outer loop at √n, and start crossing out from i * i rather than 2 * i, because every smaller multiple was already crossed by a smaller prime.",
      ],
      viz: traceSieve(20),
      example: `vector<bool> isPrime(n + 1, true);
isPrime[0] = isPrime[1] = false;

for (long long i = 2; i * i <= n; i++)
  if (isPrime[i])
    for (long long j = i * i; j <= n; j += i)
      isPrime[j] = false;`,
      notes: [
        { token: "isPrime[0] = isPrime[1]", meaning: "0 and 1 are special cases, set them first" },
        { token: "i * i <= n", meaning: "beyond √n every composite is already crossed out" },
        { token: "j = i * i", meaning: "smaller multiples of i were handled by smaller primes" },
        { token: "j += i", meaning: "step by i to land on every multiple" },
      ],
      challenge: {
        prompt:
          "Fill in the inner loop of a sieve so it crosses out every multiple of i, starting from i * i.",
        starter: `for (int i = 2; i * i <= n; i++) {
  if (isPrime[i]) {
    for (int j = ; j <= n; ) {
      isPrime[j] = false;
    }
  }
}`,
        rules: {
          regex: ["j\\s*=\\s*i\\s*\\*\\s*i", "j\\s*\\+=\\s*i"],
          hint: "Start j at i * i and step it by i each lap: j += i.",
          success:
            "Correct. Every composite gets crossed out exactly once by its smallest prime factor, which is why the total work is barely more than n.",
        },
        solution: `for (int i = 2; i * i <= n; i++) {
  if (isPrime[i]) {
    for (int j = i * i; j <= n; j += i) {
      isPrime[j] = false;
    }
  }
}`,
      },
    },
    {
      id: "fastpow",
      kicker: "02",
      title: "Powers in log time",
      hook:
        "Compute 2^1000000 modulo 10⁹+7. Multiplying by 2 a million times works but is slow. There is a way to do it in twenty multiplications. What do you notice about 2^8?",
      body: [
        "2^8 is (2^4)², and 2^4 is (2^2)². Squaring doubles the exponent for the price of one multiplication.",
        "So halve the exponent each step instead of subtracting one. That turns n multiplications into log₂(n).",
        "For odd exponents, peel one factor off first: a^7 = a × a^6, and a^6 = (a^3)².",
        "The bitwise version is the one people write: while n > 0, if the last bit of n is 1 multiply the answer by a, then square a and shift n right by one.",
        "Reduce with % m after every multiply, and hold everything in long long — two numbers near 10⁹ multiplied together need 60 bits.",
      ],
      viz: traceFastPow(3, 13, 1000000007),
      example: `long long power(long long a, long long n, long long m) {
  long long result = 1;
  a %= m;
  while (n > 0) {
    if (n & 1) result = result * a % m;   // odd: take one factor
    a = a * a % m;                        // square the base
    n >>= 1;                              // halve the exponent
  }
  return result;
}`,
      notes: [
        { token: "n & 1", meaning: "is the exponent odd? (last bit set)" },
        { token: "a = a * a % m", meaning: "square the base, stay inside the modulus" },
        { token: "n >>= 1", meaning: "halve the exponent — 20 steps for a million" },
        { token: "long long", meaning: "10⁹ × 10⁹ needs 60 bits; int has 31" },
      ],
      challenge: {
        prompt:
          "Fill in the three lines of fast exponentiation: multiply into result when the exponent is odd, square the base, halve the exponent.",
        starter: `long long power(long long a, long long n, long long m) {
  long long result = 1;
  a %= m;
  while (n > 0) {
    if ( ) result = ;
    a = ;
    n = ;
  }
  return result;
}`,
        rules: {
          regex: ["n\\s*(&\\s*1|%\\s*2\\s*==\\s*1)", "result\\s*\\*\\s*a\\s*%\\s*m", "a\\s*\\*\\s*a\\s*%\\s*m", "n\\s*(>>\\s*1|/\\s*2)"],
          hint:
            "if (n & 1) result = result * a % m; then a = a * a % m; then n = n >> 1; — every line takes a modulus so nothing overflows.",
          success:
            "Correct. This exact function is also how you compute a modular inverse: by Fermat's little theorem, the inverse of a is power(a, m - 2, m) when m is prime.",
        },
        solution: `long long power(long long a, long long n, long long m) {
  long long result = 1;
  a %= m;
  while (n > 0) {
    if (n & 1) result = result * a % m;
    a = a * a % m;
    n = n >> 1;
  }
  return result;
}`,
      },
    },
  ],
};
