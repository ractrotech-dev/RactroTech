import type { ChapterAlt } from "@/lib/dsa/lessons/i18n";

// Backtracking, in the five languages other than C++.

export const BACKTRACKING_ALT: ChapterAlt = {
  /* ---------------------------------------------------------- subsets -- */
  subsets: {
    c: {
      example: `void go(int i, int cur[], int len) {
  if (i == n) { record(cur, len); return; }

  go(i + 1, cur, len);        /* branch 1: skip a[i] */

  cur[len] = a[i];            /* choose */
  go(i + 1, cur, len + 1);    /* branch 2: take a[i] */
  /* nothing to un-choose: len + 1 was only passed down */
}`,
      notes: [
        { token: "i == n", meaning: "a complete choice has been made" },
        { token: "cur[len] = a[i]", meaning: "choose" },
        { token: "passing len + 1", meaning: "C's way of avoiding the undo — the caller's len never changed" },
        { token: "a shared array + undo", meaning: "the other way, and the one that matches every other language here" },
      ],
      vizCode: `void go(int i, int cur[], int len) {
  if (i == n) { record(cur, len); return; }
  go(i + 1, cur, len);         /* skip a[i] */
  cur[len] = a[i];
  go(i + 1, cur, len + 1);     /* take a[i] */
  /* len is a copy, so there is nothing to undo */
}`,
      prompt:
        "Write the take branch of subset generation using a shared array and a length you change: choose the value, recurse, then undo the choice.",
      starter: `void go(int i) {
  if (i == n) { record(cur, len); return; }

  go(i + 1);

  ;
  len++;
  go(i + 1);
  ;
}`,
      rules: {
        regex: ["cur\\s*\\[\\s*len\\s*\\]\\s*=\\s*a\\[i\\]", "len--"],
        hint: "Choose with cur[len] = a[i], then len++, recurse, and un-choose with len--.",
        success:
          "Correct. In C you can dodge the undo by passing len + 1 down instead. Both work — but the choose-recurse-un-choose shape is the one that carries to every other language.",
      },
      solution: `void go(int i) {
  if (i == n) { record(cur, len); return; }

  go(i + 1);

  cur[len] = a[i];
  len++;
  go(i + 1);
  len--;
}`,
    },

    python: {
      example: `def go(i, cur):
    if i == n:
        out.append(cur[:])      # a COPY — cur keeps changing
        return

    go(i + 1, cur)              # branch 1: skip a[i]

    cur.append(a[i])            # choose
    go(i + 1, cur)              # branch 2: take a[i]
    cur.pop()                   # UN-choose — do not forget this`,
      notes: [
        { token: "i == n", meaning: "a complete choice has been made" },
        { token: "cur.append(a[i])", meaning: "choose" },
        { token: "cur.pop()", meaning: "un-choose — puts the caller's state back exactly" },
        { token: "cur[:]", meaning: "a copy. Storing cur itself would store one list that keeps changing" },
      ],
      vizCode: `def go(i, cur):
    if i == n: record(cur); return
    go(i + 1, cur)               # skip a[i]
    cur.append(a[i])
    go(i + 1, cur)               # take a[i]
    # UNDO — this is backtracking
    cur.pop()`,
      prompt:
        "Write the take branch of subset generation: choose the value, recurse, then undo the choice.",
      starter: `def go(i, cur):
    if i == n:
        out.append(cur[:])
        return

    go(i + 1, cur)

    
    go(i + 1, cur)
    `,
      rules: {
        regex: ["cur\\.append\\s*\\(\\s*a\\[i\\]\\s*\\)", "cur\\.pop\\s*\\(\\s*\\)"],
        hint: "Choose with cur.append(a[i]), recurse, then un-choose with cur.pop().",
        success:
          "Correct. Watch the other Python trap here too: out.append(cur) without the [:] stores the same list every time, so every answer ends up empty.",
      },
      solution: `def go(i, cur):
    if i == n:
        out.append(cur[:])
        return

    go(i + 1, cur)

    cur.append(a[i])
    go(i + 1, cur)
    cur.pop()`,
    },

    java: {
      example: `static void go(int i, List<Integer> cur, List<List<Integer>> out) {
  if (i == n) { out.add(new ArrayList<>(cur)); return; }   // a COPY

  go(i + 1, cur, out);              // branch 1: skip a[i]

  cur.add(a[i]);                    // choose
  go(i + 1, cur, out);              // branch 2: take a[i]
  cur.remove(cur.size() - 1);       // UN-choose
}`,
      notes: [
        { token: "i == n", meaning: "a complete choice has been made" },
        { token: "cur.add(a[i])", meaning: "choose" },
        { token: "cur.remove(cur.size() - 1)", meaning: "un-choose. Removes by POSITION, not by value" },
        { token: "new ArrayList<>(cur)", meaning: "a copy. Adding cur itself stores one list that keeps changing" },
      ],
      vizCode: `static void go(int i, List<Integer> cur) {
  if (i == n) { record(cur); return; }
  go(i + 1, cur);              // skip a[i]
  cur.add(a[i]);
  go(i + 1, cur);              // take a[i]
  cur.remove(cur.size() - 1);  // UNDO
}`,
      starter: `static void go(int i, List<Integer> cur) {
  if (i == n) { record(cur); return; }

  go(i + 1, cur);

  ;
  go(i + 1, cur);
  ;
}`,
      rules: {
        regex: ["cur\\.add\\s*\\(\\s*a\\[i\\]\\s*\\)", "cur\\.remove\\s*\\(\\s*cur\\.size\\(\\)\\s*-\\s*1\\s*\\)"],
        hint: "Choose with cur.add(a[i]), recurse, then un-choose with cur.remove(cur.size() - 1).",
        success:
          "Correct, and the index matters: on a List<Integer>, remove(5) removes position 5, while remove(Integer.valueOf(5)) removes the value 5. Two very different methods.",
      },
      solution: `static void go(int i, List<Integer> cur) {
  if (i == n) { record(cur); return; }

  go(i + 1, cur);

  cur.add(a[i]);
  go(i + 1, cur);
  cur.remove(cur.size() - 1);
}`,
    },

    javascript: {
      example: `function go(i, cur, out) {
  if (i === n) { out.push([...cur]); return; }   // a COPY

  go(i + 1, cur, out);        // branch 1: skip a[i]

  cur.push(a[i]);             // choose
  go(i + 1, cur, out);        // branch 2: take a[i]
  cur.pop();                  // UN-choose
}`,
      notes: [
        { token: "i === n", meaning: "a complete choice has been made" },
        { token: "cur.push(a[i])", meaning: "choose" },
        { token: "cur.pop()", meaning: "un-choose — puts the caller's state back exactly" },
        { token: "[...cur]", meaning: "a copy. Pushing cur itself stores one array that keeps changing" },
      ],
      vizCode: `function go(i, cur) {
  if (i === n) { record(cur); return; }
  go(i + 1, cur);              // skip a[i]
  cur.push(a[i]);
  go(i + 1, cur);              // take a[i]
  cur.pop();                   // UNDO — this is backtracking
}`,
      starter: `function go(i, cur) {
  if (i === n) { record(cur); return; }

  go(i + 1, cur);

  ;
  go(i + 1, cur);
  ;
}`,
      rules: {
        regex: ["cur\\.push\\s*\\(\\s*a\\[i\\]\\s*\\)", "cur\\.pop\\s*\\(\\s*\\)"],
        hint: "Choose with cur.push(a[i]), recurse, then un-choose with cur.pop().",
        success:
          "Correct. Remember the copy when you record: arrays are shared by reference, so out.push(cur) would store the same array 2^n times.",
      },
      solution: `function go(i, cur) {
  if (i === n) { record(cur); return; }

  go(i + 1, cur);

  cur.push(a[i]);
  go(i + 1, cur);
  cur.pop();
}`,
    },

    rust: {
      example: `fn go(i: usize, a: &[i32], cur: &mut Vec<i32>, out: &mut Vec<Vec<i32>>) {
    if i == a.len() { out.push(cur.clone()); return; }   // a COPY

    go(i + 1, a, cur, out);      // branch 1: skip a[i]

    cur.push(a[i]);              // choose
    go(i + 1, a, cur, out);      // branch 2: take a[i]
    cur.pop();                   // UN-choose
}`,
      notes: [
        { token: "i == a.len()", meaning: "a complete choice has been made" },
        { token: "cur.push(a[i])", meaning: "choose" },
        { token: "cur.pop()", meaning: "un-choose — puts the caller's state back exactly" },
        { token: "cur.clone()", meaning: "an explicit copy. Rust will not let you store the borrowed one" },
      ],
      vizCode: `fn go(i: usize, cur: &mut Vec<i32>) {
    if i == n { record(cur); return; }
    go(i + 1, cur);              // skip a[i]
    cur.push(a[i]);
    go(i + 1, cur);              // take a[i]
    cur.pop();                   // UNDO — this is backtracking
}`,
      starter: `fn go(i: usize, cur: &mut Vec<i32>) {
    if i == n { record(cur); return; }

    go(i + 1, cur);

    ;
    go(i + 1, cur);
    ;
}`,
      rules: {
        regex: ["cur\\.push\\s*\\(\\s*a\\[i\\]\\s*\\)", "cur\\.pop\\s*\\(\\s*\\)"],
        hint: "Choose with cur.push(a[i]), recurse, then un-choose with cur.pop().",
        success:
          "Correct. Rust is helpful here: it will not let you store the borrowed cur by accident, so the copy bug that bites in Python, Java and JavaScript cannot compile at all.",
      },
      solution: `fn go(i: usize, cur: &mut Vec<i32>) {
    if i == n { record(cur); return; }

    go(i + 1, cur);

    cur.push(a[i]);
    go(i + 1, cur);
    cur.pop();
}`,
    },
  },

  /* ------------------------------------------------------------ prune -- */
  prune: {
    c: {
      example: `int safe(int r, int c) {
  for (int i = 0; i < r; i++) {
    if (col[i] == c) return 0;                    /* same column */
    if (abs(col[i] - c) == r - i) return 0;       /* same diagonal */
  }
  return 1;
}`,
      notes: [
        { token: "one queen per row", meaning: "row clashes become impossible by construction" },
        { token: "abs(col[i] - c) == r - i", meaning: "equal row gap and column gap means same diagonal" },
        { token: "abs", meaning: "from stdlib.h" },
      ],
      vizCode: `int go(int r) {
  if (r == n) return 1;
  for (int c = 0; c < n; c++)
    if (safe(r, c)) {
      col[r] = c;
      if (go(r + 1)) return 1;
      col[r] = -1;          /* undo and try the next column */
    }
  return 0;
}`,
      starter: `int safe(int r, int c) {
  for (int i = 0; i < r; i++) {
    if ( ) return 0;
    if ( ) return 0;
  }
  return 1;
}`,
      rules: {
        regex: ["col\\[i\\]\\s*==\\s*c", "abs\\s*\\(\\s*col\\[i\\]\\s*-\\s*c\\s*\\)\\s*==\\s*r\\s*-\\s*i"],
        hint: "Same column: col[i] == c. Same diagonal: abs(col[i] - c) == r - i.",
        success:
          "Correct. Only rows above r need checking — the rows below have no queen yet, which is why placing one per row from the top makes this so short.",
      },
      solution: `int safe(int r, int c) {
  for (int i = 0; i < r; i++) {
    if (col[i] == c) return 0;
    if (abs(col[i] - c) == r - i) return 0;
  }
  return 1;
}`,
    },

    python: {
      example: `def safe(r, c):
    for i in range(r):
        if col[i] == c:
            return False                 # same column
        if abs(col[i] - c) == r - i:
            return False                 # same diagonal
    return True`,
      notes: [
        { token: "one queen per row", meaning: "row clashes become impossible by construction" },
        { token: "abs(col[i] - c) == r - i", meaning: "equal row gap and column gap means same diagonal" },
        { token: "three sets instead", meaning: "the faster version: track used columns and both diagonals in sets" },
        { token: "sys.setrecursionlimit", meaning: "needed if the board gets deep. The default is about 1000" },
      ],
      vizCode: `def go(r):
    if r == n: return True
    for c in range(n):
        if safe(r, c):
            col[r] = c
            if go(r + 1): return True
            col[r] = -1        # undo and try the next column
    return False`,
      starter: `def safe(r, c):
    for i in range(r):
        if :
            return False
        if :
            return False
    return True`,
      rules: {
        regex: ["col\\[i\\]\\s*==\\s*c", "abs\\s*\\(\\s*col\\[i\\]\\s*-\\s*c\\s*\\)\\s*==\\s*r\\s*-\\s*i"],
        hint: "Same column: col[i] == c. Same diagonal: abs(col[i] - c) == r - i.",
        success:
          "Correct. The faster Python version keeps three sets — used columns, used r + c, used r - c — so safe() becomes three O(1) lookups instead of a loop.",
      },
      solution: `def safe(r, c):
    for i in range(r):
        if col[i] == c:
            return False
        if abs(col[i] - c) == r - i:
            return False
    return True`,
    },

    java: {
      example: `static boolean safe(int r, int c) {
  for (int i = 0; i < r; i++) {
    if (col[i] == c) return false;                      // same column
    if (Math.abs(col[i] - c) == r - i) return false;    // same diagonal
  }
  return true;
}`,
      notes: [
        { token: "one queen per row", meaning: "row clashes become impossible by construction" },
        { token: "Math.abs(col[i] - c) == r - i", meaning: "equal row gap and column gap means same diagonal" },
        { token: "boolean[] arrays", meaning: "the faster version: flags for columns and both diagonals" },
      ],
      vizCode: `static boolean go(int r) {
  if (r == n) return true;
  for (int c = 0; c < n; c++)
    if (safe(r, c)) {
      col[r] = c;
      if (go(r + 1)) return true;
      col[r] = -1;          // undo and try the next column
    }
  return false;
}`,
      starter: `static boolean safe(int r, int c) {
  for (int i = 0; i < r; i++) {
    if ( ) return false;
    if ( ) return false;
  }
  return true;
}`,
      rules: {
        regex: ["col\\[i\\]\\s*==\\s*c", "Math\\.abs\\s*\\(\\s*col\\[i\\]\\s*-\\s*c\\s*\\)\\s*==\\s*r\\s*-\\s*i"],
        hint: "Same column: col[i] == c. Same diagonal: Math.abs(col[i] - c) == r - i.",
        success:
          "Correct. Java spells it Math.abs, not abs — there are no free functions, so every helper lives on a class.",
      },
      solution: `static boolean safe(int r, int c) {
  for (int i = 0; i < r; i++) {
    if (col[i] == c) return false;
    if (Math.abs(col[i] - c) == r - i) return false;
  }
  return true;
}`,
    },

    javascript: {
      example: `function safe(r, c) {
  for (let i = 0; i < r; i++) {
    if (col[i] === c) return false;                     // same column
    if (Math.abs(col[i] - c) === r - i) return false;   // same diagonal
  }
  return true;
}`,
      notes: [
        { token: "one queen per row", meaning: "row clashes become impossible by construction" },
        { token: "Math.abs(col[i] - c) === r - i", meaning: "equal row gap and column gap means same diagonal" },
        { token: "Set for columns", meaning: "the faster version: three Sets instead of the inner loop" },
      ],
      vizCode: `function go(r) {
  if (r === n) return true;
  for (let c = 0; c < n; c++)
    if (safe(r, c)) {
      col[r] = c;
      if (go(r + 1)) return true;
      col[r] = -1;          // undo and try the next column
    }
  return false;
}`,
      starter: `function safe(r, c) {
  for (let i = 0; i < r; i++) {
    if ( ) return false;
    if ( ) return false;
  }
  return true;
}`,
      rules: {
        regex: ["col\\[i\\]\\s*===?\\s*c", "Math\\.abs\\s*\\(\\s*col\\[i\\]\\s*-\\s*c\\s*\\)\\s*===?\\s*r\\s*-\\s*i"],
        hint: "Same column: col[i] === c. Same diagonal: Math.abs(col[i] - c) === r - i.",
        success:
          "Correct. Only rows above r need checking — the rows below have no queen yet, which is why placing one per row from the top makes this so short.",
      },
      solution: `function safe(r, c) {
  for (let i = 0; i < r; i++) {
    if (col[i] === c) return false;
    if (Math.abs(col[i] - c) === r - i) return false;
  }
  return true;
}`,
    },

    rust: {
      example: `fn safe(col: &[i64], r: usize, c: i64) -> bool {
    for i in 0..r {
        if col[i] == c { return false; }                        // same column
        if (col[i] - c).abs() == (r - i) as i64 { return false; } // same diagonal
    }
    true
}`,
      notes: [
        { token: "one queen per row", meaning: "row clashes become impossible by construction" },
        { token: "(col[i] - c).abs()", meaning: "abs is a method on the number, not a free function" },
        { token: "(r - i) as i64", meaning: "r and i are usize, so the gap must be converted to compare" },
        { token: "col: &[i64]", meaning: "borrowed, so nothing is copied on every call" },
      ],
      vizCode: `fn go(r: usize) -> bool {
    if r == n { return true; }
    for c in 0..n {
        if safe(r, c as i64) {
            col[r] = c as i64;
            if go(r + 1) { return true; }
            col[r] = -1;      // undo and try the next column
        }
    }
    false
}`,
      starter: `fn safe(col: &[i64], r: usize, c: i64) -> bool {
    for i in 0..r {
        if  { return false; }
        if  { return false; }
    }
    true
}`,
      rules: {
        regex: ["col\\[i\\]\\s*==\\s*c", "\\(\\s*col\\[i\\]\\s*-\\s*c\\s*\\)\\.abs\\(\\)\\s*==\\s*\\(\\s*r\\s*-\\s*i\\s*\\)\\s*as\\s+i64"],
        hint: "Same column: col[i] == c. Same diagonal: (col[i] - c).abs() == (r - i) as i64.",
        success:
          "Correct. The cast is needed because r and i are usize while the columns are i64 — Rust will not compare two different number types for you.",
      },
      solution: `fn safe(col: &[i64], r: usize, c: i64) -> bool {
    for i in 0..r {
        if col[i] == c { return false; }
        if (col[i] - c).abs() == (r - i) as i64 { return false; }
    }
    true
}`,
    },
  },
};
