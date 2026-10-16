import type { ChapterAlt } from "@/lib/dsa/lessons/i18n";

// Stack, in the five languages other than C++.

export const STACK_ALT: ChapterAlt = {
  /* ----------------------------------------------------------- basics -- */
  basics: {
    c: {
      example: `int st[MAXN];
int top = -1;          /* -1 means empty */

st[++top] = 3;         /* push */
st[++top] = 7;
st[++top] = 5;

top--;                 /* pop — removes 5, not 3 */
printf("%d", st[top]); /* 7 */`,
      notes: [
        { token: "int top = -1", meaning: "an index, one below the first slot" },
        { token: "st[++top] = x", meaning: "move up, then write. That is a push" },
        { token: "top--", meaning: "a pop. The value is still there, but out of reach" },
        { token: "top < 0", meaning: "empty. Check this before every read" },
      ],
      vizCode: `int st[MAXN]; int top = -1;
st[++top] = 3;
st[++top] = 7;
st[++top] = 5;
top--;                 /* removes 5, not 3 */
printf("%d", st[top]);`,
      prompt: "Empty a stack, printing each value as it comes off. The output comes out in reverse order.",
      starter: `while ( ) {
  printf("%d ", );
  ;
}`,
      rules: {
        regex: ["top\\s*>=\\s*0", "st\\s*\\[\\s*top\\s*\\]", "top--"],
        hint: "Loop while top >= 0. Print st[top], then top--.",
        success:
          "Correct. In C a stack is just an array and an index — no allocation, no structure, and about as fast as code gets.",
      },
      solution: `while (top >= 0) {
  printf("%d ", st[top]);
  top--;
}`,
    },

    python: {
      example: `st = []

st.append(3)      # push
st.append(7)
st.append(5)

print(st.pop())   # 5 — the last one in
print(st[-1])     # 7 — look without removing
print(len(st))    # 2`,
      notes: [
        { token: "st.append(x)", meaning: "push. A list is already a perfect stack" },
        { token: "st.pop()", meaning: "removes AND returns the top — unlike C++" },
        { token: "st[-1]", meaning: "look at the top without removing it" },
        { token: "st.pop(0)", meaning: "removes from the FRONT and is O(n). Never use it as a stack" },
      ],
      vizCode: `st = []
st.append(3)
st.append(7)
st.append(5)
st.pop()          # removes 5, not 3
print(st[-1])`,
      prompt: "Empty a stack, printing each value as it comes off. The output comes out in reverse order.",
      starter: `while :
    print()`,
      rules: {
        regex: ["while\\s+st", "st\\.pop\\s*\\(\\s*\\)"],
        hint: "Loop while st (an empty list is false). Print st.pop() — in Python, pop returns the value as well as removing it.",
        success:
          "Correct. Python's pop() both removes and returns, so you need one call where C++ needs top() then pop(). Just never write pop(0) — that is O(n).",
      },
      solution: `while st:
    print(st.pop())`,
    },

    java: {
      example: `Deque<Integer> st = new ArrayDeque<>();

st.push(3);
st.push(7);
st.push(5);

System.out.println(st.pop());   // 5 — removes AND returns
System.out.println(st.peek());  // 7 — look without removing
System.out.println(st.size());  // 2`,
      notes: [
        { token: "ArrayDeque, not Stack", meaning: "java.util.Stack is old and slower. ArrayDeque is the modern choice" },
        { token: "st.push / st.pop", meaning: "pop removes and returns, in one call" },
        { token: "st.peek()", meaning: "look at the top. Gives null when empty rather than throwing" },
        { token: "Deque<Integer>", meaning: "every int is boxed into an object, which costs memory" },
      ],
      vizCode: `Deque<Integer> st = new ArrayDeque<>();
st.push(3);
st.push(7);
st.push(5);
st.pop();          // removes 5, not 3
System.out.println(st.peek());`,
      prompt: "Empty a stack, printing each value as it comes off. The output comes out in reverse order.",
      starter: `while ( ) {
  System.out.print( + " ");
}`,
      rules: {
        regex: ["!\\s*st\\.isEmpty\\s*\\(\\s*\\)", "st\\.pop\\s*\\(\\s*\\)"],
        hint: "Loop while !st.isEmpty(). Print st.pop() — in Java, pop removes and returns in one call.",
        success:
          "Correct. Prefer ArrayDeque over the old java.util.Stack: Stack is synchronised on every call, which you almost never need and always pay for.",
      },
      solution: `while (!st.isEmpty()) {
  System.out.print(st.pop() + " ");
}`,
    },

    javascript: {
      example: `const st = [];

st.push(3);
st.push(7);
st.push(5);

console.log(st.pop());          // 5 — removes AND returns
console.log(st[st.length - 1]); // 7 — look without removing
console.log(st.length);         // 2`,
      notes: [
        { token: "st.push(x)", meaning: "push. An array is already a perfect stack" },
        { token: "st.pop()", meaning: "removes and returns the top, in one call" },
        { token: "st.at(-1)", meaning: "look at the top without removing it" },
        { token: "st.shift()", meaning: "removes from the FRONT and is O(n). Never use it as a stack" },
      ],
      vizCode: `const st = [];
st.push(3);
st.push(7);
st.push(5);
st.pop();          // removes 5, not 3
console.log(st.at(-1));`,
      prompt: "Empty a stack, printing each value as it comes off. The output comes out in reverse order.",
      starter: `while ( ) {
  console.log();
}`,
      rules: {
        regex: ["st\\.length", "st\\.pop\\s*\\(\\s*\\)"],
        hint: "Loop while st.length > 0. Print st.pop() — pop removes and returns in one call.",
        success:
          "Correct. push and pop on the end are O(1). shift and unshift on the front are O(n), because every other element has to move.",
      },
      solution: `while (st.length > 0) {
  console.log(st.pop());
}`,
    },

    rust: {
      example: `let mut st: Vec<i32> = Vec::new();

st.push(3);
st.push(7);
st.push(5);

println!("{:?}", st.pop());     // Some(5) — an Option
println!("{:?}", st.last());    // Some(&7) — look without removing
println!("{}", st.len());       // 2`,
      notes: [
        { token: "Vec::new()", meaning: "a Vec is already a perfect stack" },
        { token: "st.pop()", meaning: "gives Option — None when empty, so you cannot forget the check" },
        { token: "st.last()", meaning: "look at the top. Also an Option" },
        { token: "while let Some(x)", meaning: "the natural way to drain it" },
      ],
      vizCode: `let mut st: Vec<i32> = Vec::new();
st.push(3);
st.push(7);
st.push(5);
st.pop();          // removes 5, not 3
println!("{:?}", st.last());`,
      prompt: "Empty a stack, printing each value as it comes off. The output comes out in reverse order.",
      starter: `while let  {
    println!("{}", x);
}`,
      rules: {
        regex: ["while\\s+let\\s+Some\\s*\\(\\s*x\\s*\\)\\s*=\\s*st\\.pop\\s*\\(\\s*\\)"],
        hint: "Write while let Some(x) = st.pop() { ... } — the loop stops on its own when pop gives None.",
        success:
          "Correct, and this is Rust at its best: pop returns an Option, so the empty case is handled by the loop itself. There is no way to read an empty stack by accident.",
      },
      solution: `while let Some(x) = st.pop() {
    println!("{}", x);
}`,
    },
  },

  /* --------------------------------------------------------- brackets -- */
  brackets: {
    c: {
      example: `int balanced(const char *s) {
  char st[MAXN]; int top = -1;
  for (int i = 0; s[i]; i++) {
    char c = s[i];
    if (c == '(' || c == '[' || c == '{') st[++top] = c;
    else {
      if (top < 0) return 0;
      char t = st[top--];
      if ((c == ')' && t != '(') || (c == ']' && t != '[') ||
          (c == '}' && t != '{')) return 0;
    }
  }
  return top < 0;      /* nothing left unclosed */
}`,
      notes: [
        { token: "top < 0 -> return 0", meaning: "a closer with nothing open" },
        { token: "the top must match", meaning: "wrong partner means broken nesting" },
        { token: "return top < 0", meaning: "leftover openers mean unbalanced" },
      ],
      vizCode: `for (int i = 0; s[i]; i++) {
  if (isOpen(s[i])) st[++top] = s[i];
  else {
    if (top < 0 || !matches(st[top], s[i])) return 0;
    top--;
  }
}
return top < 0;`,
      starter: `char st[MAXN]; int top = -1;

for (int i = 0; s[i]; i++) {
  if (s[i] == '(') ;
  else {
    if ( ) return 0;
    top--;
  }
}
return ;`,
      rules: {
        regex: ["st\\s*\\[\\s*\\+\\+top\\s*\\]\\s*=\\s*s\\[i\\]", "top\\s*<\\s*0", "return\\s+top\\s*<\\s*0"],
        hint: "Push with st[++top] = s[i]. Reject when top < 0 on a closer. Finish with return top < 0.",
        success:
          "Correct. Both empty checks matter — one catches too many closers, the other catches too many openers.",
      },
      solution: `char st[MAXN]; int top = -1;

for (int i = 0; s[i]; i++) {
  if (s[i] == '(') st[++top] = s[i];
  else {
    if (top < 0) return 0;
    top--;
  }
}
return top < 0;`,
    },

    python: {
      example: `def balanced(s):
    pairs = {')': '(', ']': '[', '}': '{'}
    st = []
    for c in s:
        if c in "([{":
            st.append(c)
        else:
            if not st or st[-1] != pairs[c]:
                return False
            st.pop()
    return not st          # nothing left unclosed`,
      notes: [
        { token: "not st", meaning: "an empty list is false, so this means 'nothing open'" },
        { token: "st[-1] != pairs[c]", meaning: "wrong partner means broken nesting" },
        { token: "pairs dict", meaning: "maps each closer to the opener it needs" },
        { token: "return not st", meaning: "leftover openers mean unbalanced" },
      ],
      vizCode: `for c in s:
    if is_open(c): st.append(c)
    else:
        if not st or not matches(st[-1], c):
            return False
        st.pop()

return not st`,
      prompt:
        "Complete the bracket checker: push openers, and on a closer reject an empty stack before comparing.",
      starter: `st = []

for c in s:
    if c == '(':
        
    else:
        if :
            return False
        st.pop()

return `,
      rules: {
        regex: ["st\\.append\\s*\\(\\s*c\\s*\\)", "not\\s+st", "return\\s+not\\s+st"],
        hint: "Push with st.append(c). Reject when `not st` on a closer. Finish with return not st.",
        success:
          "Correct. `not st` reads oddly at first but is the normal Python way to ask 'is this empty' — it works for lists, sets, dicts and strings alike.",
      },
      solution: `st = []

for c in s:
    if c == '(':
        st.append(c)
    else:
        if not st:
            return False
        st.pop()

return not st`,
    },

    java: {
      example: `static boolean balanced(String s) {
  Map<Character, Character> pairs = Map.of(')', '(', ']', '[', '}', '{');
  Deque<Character> st = new ArrayDeque<>();
  for (char c : s.toCharArray()) {
    if (c == '(' || c == '[' || c == '{') st.push(c);
    else {
      if (st.isEmpty() || st.peek() != pairs.get(c)) return false;
      st.pop();
    }
  }
  return st.isEmpty();      // nothing left unclosed
}`,
      notes: [
        { token: "st.isEmpty()", meaning: "a closer with nothing open" },
        { token: "st.peek() != pairs.get(c)", meaning: "wrong partner means broken nesting" },
        { token: "return st.isEmpty()", meaning: "leftover openers mean unbalanced" },
        { token: "Character unboxing", meaning: "!= on two Characters can compare objects. Compare as char" },
      ],
      vizCode: `for (char c : s.toCharArray()) {
  if (isOpen(c)) st.push(c);
  else {
    if (st.isEmpty() || !matches(st.peek(), c)) return false;
    st.pop();
  }
}
return st.isEmpty();`,
      starter: `Deque<Character> st = new ArrayDeque<>();

for (char c : s.toCharArray()) {
  if (c == '(') ;
  else {
    if ( ) return false;
    st.pop();
  }
}
return ;`,
      rules: {
        regex: ["st\\.push\\s*\\(\\s*c\\s*\\)", "st\\.isEmpty\\s*\\(\\s*\\)", "return\\s+st\\.isEmpty\\s*\\(\\s*\\)"],
        hint: "Push with st.push(c). Reject when st.isEmpty() on a closer. Finish with return st.isEmpty().",
        success:
          "Correct. One thing to watch in Java: comparing two Character objects with != can compare identities. Store char, or compare with .charValue().",
      },
      solution: `Deque<Character> st = new ArrayDeque<>();

for (char c : s.toCharArray()) {
  if (c == '(') st.push(c);
  else {
    if (st.isEmpty()) return false;
    st.pop();
  }
}
return st.isEmpty();`,
    },

    javascript: {
      example: `function balanced(s) {
  const pairs = { ")": "(", "]": "[", "}": "{" };
  const st = [];
  for (const c of s) {
    if ("([{".includes(c)) st.push(c);
    else {
      if (st.length === 0 || st[st.length - 1] !== pairs[c]) return false;
      st.pop();
    }
  }
  return st.length === 0;      // nothing left unclosed
}`,
      notes: [
        { token: "st.length === 0", meaning: "a closer with nothing open" },
        { token: "st.at(-1) !== pairs[c]", meaning: "wrong partner means broken nesting" },
        { token: "return st.length === 0", meaning: "leftover openers mean unbalanced" },
        { token: "st.pop() on empty", meaning: "gives undefined rather than throwing. Check first" },
      ],
      vizCode: `for (const c of s) {
  if (isOpen(c)) st.push(c);
  else {
    if (st.length === 0 || !matches(st.at(-1), c)) return false;
    st.pop();
  }
}
return st.length === 0;`,
      starter: `const st = [];

for (const c of s) {
  if (c === "(") ;
  else {
    if ( ) return false;
    st.pop();
  }
}
return ;`,
      rules: {
        regex: ["st\\.push\\s*\\(\\s*c\\s*\\)", "st\\.length\\s*===?\\s*0", "return\\s+st\\.length\\s*===?\\s*0"],
        hint: "Push with st.push(c). Reject when st.length === 0 on a closer. Finish with return st.length === 0.",
        success:
          "Correct. The empty check really is required here: popping an empty array gives undefined instead of throwing, so a broken string would slip through silently.",
      },
      solution: `const st = [];

for (const c of s) {
  if (c === "(") st.push(c);
  else {
    if (st.length === 0) return false;
    st.pop();
  }
}
return st.length === 0;`,
    },

    rust: {
      example: `fn balanced(s: &str) -> bool {
    let mut st: Vec<char> = Vec::new();
    for c in s.chars() {
        match c {
            '(' | '[' | '{' => st.push(c),
            ')' => if st.pop() != Some('(') { return false; },
            ']' => if st.pop() != Some('[') { return false; },
            '}' => if st.pop() != Some('{') { return false; },
            _ => {}
        }
    }
    st.is_empty()      // nothing left unclosed
}`,
      notes: [
        { token: "st.pop() != Some('(')", meaning: "handles empty AND wrong partner in one line" },
        { token: "pop on empty gives None", meaning: "and None != Some(x), so it rejects correctly" },
        { token: "match", meaning: "Rust's switch. The _ arm catches everything else" },
        { token: "st.is_empty()", meaning: "leftover openers mean unbalanced" },
      ],
      vizCode: `for c in s.chars() {
    if is_open(c) { st.push(c); }
    else {
        if st.is_empty() || !matches(st.last(), c) { return false; }
        st.pop();
    }
}
st.is_empty()`,
      starter: `let mut st: Vec<char> = Vec::new();

for c in s.chars() {
    if c == '(' {  }
    else {
        if  { return false; }
        st.pop();
    }
}
`,
      rules: {
        regex: ["st\\.push\\s*\\(\\s*c\\s*\\)", "st\\.is_empty\\s*\\(\\s*\\)"],
        hint: "Push with st.push(c). Reject when st.is_empty() on a closer. Finish with st.is_empty() as the last line.",
        success:
          "Correct. Rust lets you fold both checks into one: `if st.pop() != Some('(')` covers the empty case too, because None is never equal to Some.",
      },
      solution: `let mut st: Vec<char> = Vec::new();

for c in s.chars() {
    if c == '(' { st.push(c); }
    else {
        if st.is_empty() { return false; }
        st.pop();
    }
}
st.is_empty()`,
    },
  },

  /* -------------------------------------------------------- monotonic -- */
  monotonic: {
    c: {
      example: `int st[MAXN], top = -1;      /* holds indices */

for (int i = n - 1; i >= 0; i--) {
  while (top >= 0 && a[st[top]] <= a[i]) top--;
  ans[i] = (top < 0) ? -1 : a[st[top]];
  st[++top] = i;
}`,
      notes: [
        { token: "walk right to left", meaning: "so the stack holds what is to the right" },
        { token: "pop while <=", meaning: "those can never be an answer again" },
        { token: "store indices", meaning: "you usually need the position, not just the value" },
        { token: "O(n) in total", meaning: "each index is pushed once and popped at most once" },
      ],
      vizCode: `int st[MAXN], top = -1;     /* holds indices */
for (int i = n - 1; i >= 0; i--) {
  while (top >= 0 && a[st[top]] <= a[i]) top--;
  ans[i] = (top < 0) ? -1 : a[st[top]];
  st[++top] = i;
}`,
      starter: `for (int i = n - 1; i >= 0; i--) {
  while (top >= 0 && ) top--;
  ans[i] = (top < 0) ? -1 : ;
  st[++top] = i;
}`,
      rules: {
        regex: ["a\\[st\\[top\\]\\]\\s*<=\\s*a\\[i\\]", "a\\[st\\[top\\]\\]"],
        hint: "Pop while a[st[top]] <= a[i]. Then the answer is a[st[top]] when the stack is not empty.",
        success:
          "Correct. Using <= rather than < is what discards equal values too, which is the behaviour 'strictly greater' asks for.",
      },
      solution: `for (int i = n - 1; i >= 0; i--) {
  while (top >= 0 && a[st[top]] <= a[i]) top--;
  ans[i] = (top < 0) ? -1 : a[st[top]];
  st[++top] = i;
}`,
    },

    python: {
      example: `st = []                      # holds indices
ans = [-1] * n

for i in range(n - 1, -1, -1):
    while st and a[st[-1]] <= a[i]:
        st.pop()
    ans[i] = -1 if not st else a[st[-1]]
    st.append(i)`,
      notes: [
        { token: "range(n - 1, -1, -1)", meaning: "counts down to 0. The end is left out, so it is -1" },
        { token: "while st and ...", meaning: "check the stack is not empty before reading st[-1]" },
        { token: "a[st[-1]]", meaning: "the value at the index on top" },
        { token: "O(n) in total", meaning: "each index is pushed once and popped at most once" },
      ],
      vizCode: `st = []                      # holds indices
for i in range(n - 1, -1, -1):
    while st and a[st[-1]] <= a[i]: st.pop()
    ans[i] = -1 if not st else a[st[-1]]
    st.append(i)`,
      starter: `st = []
ans = [-1] * n

for i in range(n - 1, -1, -1):
    while st and :
        st.pop()
    ans[i] = -1 if not st else 
    st.append(i)`,
      rules: {
        regex: ["a\\[st\\[-1\\]\\]\\s*<=\\s*a\\[i\\]", "a\\[st\\[-1\\]\\]"],
        hint: "Pop while a[st[-1]] <= a[i]. Then the answer is a[st[-1]] when the stack is not empty.",
        success:
          "Correct. `while st and ...` matters: Python stops at the first false part, so st[-1] is never read on an empty list.",
      },
      solution: `st = []
ans = [-1] * n

for i in range(n - 1, -1, -1):
    while st and a[st[-1]] <= a[i]:
        st.pop()
    ans[i] = -1 if not st else a[st[-1]]
    st.append(i)`,
    },

    java: {
      example: `Deque<Integer> st = new ArrayDeque<>();   // holds indices
int[] ans = new int[n];

for (int i = n - 1; i >= 0; i--) {
  while (!st.isEmpty() && a[st.peek()] <= a[i]) st.pop();
  ans[i] = st.isEmpty() ? -1 : a[st.peek()];
  st.push(i);
}`,
      notes: [
        { token: "walk right to left", meaning: "so the stack holds what is to the right" },
        { token: "a[st.peek()]", meaning: "the value at the index on top" },
        { token: "store indices", meaning: "you usually need the position, not just the value" },
        { token: "O(n) in total", meaning: "each index is pushed once and popped at most once" },
      ],
      vizCode: `Deque<Integer> st = new ArrayDeque<>();  // indices
for (int i = n - 1; i >= 0; i--) {
  while (!st.isEmpty() && a[st.peek()] <= a[i]) st.pop();
  ans[i] = st.isEmpty() ? -1 : a[st.peek()];
  st.push(i);
}`,
      starter: `for (int i = n - 1; i >= 0; i--) {
  while (!st.isEmpty() && ) st.pop();
  ans[i] = st.isEmpty() ? -1 : ;
  st.push(i);
}`,
      rules: {
        regex: ["a\\[st\\.peek\\(\\)\\]\\s*<=\\s*a\\[i\\]", "a\\[st\\.peek\\(\\)\\]"],
        hint: "Pop while a[st.peek()] <= a[i]. Then the answer is a[st.peek()] when the stack is not empty.",
        success:
          "Correct. a[st.peek()] unboxes the Integer back to an int automatically — one of the few places Java's autoboxing helps rather than costing you.",
      },
      solution: `for (int i = n - 1; i >= 0; i--) {
  while (!st.isEmpty() && a[st.peek()] <= a[i]) st.pop();
  ans[i] = st.isEmpty() ? -1 : a[st.peek()];
  st.push(i);
}`,
    },

    javascript: {
      example: `const st = [];                 // holds indices
const ans = new Array(n).fill(-1);

for (let i = n - 1; i >= 0; i--) {
  while (st.length && a[st.at(-1)] <= a[i]) st.pop();
  ans[i] = st.length === 0 ? -1 : a[st.at(-1)];
  st.push(i);
}`,
      notes: [
        { token: "walk right to left", meaning: "so the stack holds what is to the right" },
        { token: "st.at(-1)", meaning: "the index on top. st[st.length - 1] is the older way" },
        { token: "store indices", meaning: "you usually need the position, not just the value" },
        { token: "O(n) in total", meaning: "each index is pushed once and popped at most once" },
      ],
      vizCode: `const st = [];                 // holds indices
for (let i = n - 1; i >= 0; i--) {
  while (st.length && a[st.at(-1)] <= a[i]) st.pop();
  ans[i] = st.length === 0 ? -1 : a[st.at(-1)];
  st.push(i);
}`,
      starter: `for (let i = n - 1; i >= 0; i--) {
  while (st.length && ) st.pop();
  ans[i] = st.length === 0 ? -1 : ;
  st.push(i);
}`,
      rules: {
        regex: ["a\\[st\\.at\\(-1\\)\\]\\s*<=\\s*a\\[i\\]", "a\\[st\\.at\\(-1\\)\\]"],
        hint: "Pop while a[st.at(-1)] <= a[i]. Then the answer is a[st.at(-1)] when the stack is not empty.",
        success:
          "Correct. .at(-1) is the modern way to read the last item; older code writes st[st.length - 1], which does exactly the same thing.",
      },
      solution: `for (let i = n - 1; i >= 0; i--) {
  while (st.length && a[st.at(-1)] <= a[i]) st.pop();
  ans[i] = st.length === 0 ? -1 : a[st.at(-1)];
  st.push(i);
}`,
    },

    rust: {
      example: `let mut st: Vec<usize> = Vec::new();   // holds indices
let mut ans = vec![-1i32; n];

for i in (0..n).rev() {
    while let Some(&t) = st.last() {
        if a[t] <= a[i] { st.pop(); } else { break; }
    }
    ans[i] = match st.last() { Some(&t) => a[t], None => -1 };
    st.push(i);
}`,
      notes: [
        { token: "(0..n).rev()", meaning: "counts down. Rust has no i-- loop" },
        { token: "st.last()", meaning: "gives Option<&usize>, so the empty case is built in" },
        { token: "store indices", meaning: "you usually need the position, not just the value" },
        { token: "O(n) in total", meaning: "each index is pushed once and popped at most once" },
      ],
      vizCode: `let mut st: Vec<usize> = Vec::new();  // indices
for i in (0..n).rev() {
    while let Some(&t) = st.last() {
        if a[t] <= a[i] { st.pop(); } else { break; } }
    ans[i] = match st.last() { Some(&t) => a[t], None => -1 };
    st.push(i);
}`,
      prompt:
        "Write the monotonic stack loop for next greater element: discard everything that can never win, then read the answer off the top.",
      starter: `for i in (0..n).rev() {
    while let Some(&t) = st.last() {
        if  { st.pop(); } else { break; }
    }
    ans[i] = match st.last() { Some(&t) =>  , None => -1 };
    st.push(i);
}`,
      rules: {
        regex: ["a\\[t\\]\\s*<=\\s*a\\[i\\]", "Some\\s*\\(\\s*&t\\s*\\)\\s*=>\\s*a\\[t\\]"],
        hint: "Pop while a[t] <= a[i], where t is the index on top. The answer is a[t] when there is one.",
        success:
          "Correct. The match arm handles the empty stack for you — Rust will not compile the code unless the None case is dealt with, so the -1 can never be forgotten.",
      },
      solution: `for i in (0..n).rev() {
    while let Some(&t) = st.last() {
        if a[t] <= a[i] { st.pop(); } else { break; }
    }
    ans[i] = match st.last() { Some(&t) => a[t], None => -1 };
    st.push(i);
}`,
    },
  },
};
