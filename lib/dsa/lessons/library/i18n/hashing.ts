import type { ChapterAlt } from "@/lib/dsa/lessons/i18n";

// Hashing, in the five languages other than C++.

export const HASHING_ALT: ChapterAlt = {
  /* ------------------------------------------------------------ table -- */
  table: {
    c: {
      example: `/* C has no hash map in the standard library. For small whole-number
   keys, an array IS the hash table — and the fastest one you can get. */

int seen[MAXV + 1] = {0};

seen[key] = 1;              /* insert */
if (seen[key]) { ... }      /* look up — one step, no searching */

/* For anything else you write your own: an array of buckets, each
   holding a linked list of the keys that landed there. */`,
      notes: [
        { token: "int seen[MAXV + 1]", meaning: "one slot per possible value. Instant, but needs the range to be small" },
        { token: "seen[key]", meaning: "no hash function needed — the value IS the index" },
        { token: "no built-in map", meaning: "C leaves this to you. Every other language here ships one" },
        { token: "hsearch", meaning: "POSIX has one, but it is awkward and rarely used" },
      ],
      vizCode: `int hash(int key) { return key % 5; }

/* insert */
table[hash(key)][count[hash(key)]++] = key;

/* lookup: only one bucket is ever searched */`,
      prompt:
        "Count how many distinct values an array holds. Values are between 0 and MAXV, so use a flag array rather than writing a hash table.",
      starter: `int seen[MAXV + 1] = {0};
int distinct = 0;

for (int i = 0; i < n; i++) {
  if ( ) {
    ;
    distinct++;
  }
}

printf("%d", distinct);`,
      rules: {
        regex: ["!\\s*seen\\s*\\[\\s*a\\[i\\]\\s*\\]|seen\\s*\\[\\s*a\\[i\\]\\s*\\]\\s*==\\s*0", "seen\\s*\\[\\s*a\\[i\\]\\s*\\]\\s*=\\s*1"],
        hint: "If !seen[a[i]], then set seen[a[i]] = 1 and add one to distinct.",
        success:
          "Correct. This is a hash table with the simplest possible hash function: the key itself. It costs one slot per possible value, which is the trade every hash table makes.",
      },
      solution: `int seen[MAXV + 1] = {0};
int distinct = 0;

for (int i = 0; i < n; i++) {
  if (!seen[a[i]]) {
    seen[a[i]] = 1;
    distinct++;
  }
}

printf("%d", distinct);`,
    },

    python: {
      example: `ages = {}                  # a dict — Python's hash map
ages["ravi"] = 21
ages["meera"] = 24

if "ravi" in ages:         # check without creating it
    print(ages["ravi"])

seen = set()               # membership only
seen.add(5)
if 5 in seen: print("yes")`,
      notes: [
        { token: "dict", meaning: "a hash map. O(1) on average" },
        { token: "x in a_dict", meaning: "O(1). But x in a_list is O(n) — same word, very different cost" },
        { token: "ages['missing']", meaning: "raises KeyError. Use .get(k) or defaultdict instead" },
        { token: "keys must be hashable", meaning: "a tuple can be a key, a list cannot" },
      ],
      vizCode: `def hash_key(key): return key % 5

# insert
table[hash_key(key)].append(key)

# lookup: only one bucket is ever searched`,
      prompt: "Count how many distinct values a list holds, using a set.",
      starter: `seen = set()

for x in a:
    

print()`,
      rules: {
        regex: ["seen\\.add\\s*\\(\\s*x\\s*\\)", "len\\s*\\(\\s*seen\\s*\\)"],
        hint: "Add every value with seen.add(x). A set drops repeats, so len(seen) is the count of distinct values.",
        success:
          "Correct. The one to remember: `x in some_set` is O(1), but `x in some_list` walks the whole list. Putting a list membership test inside a loop quietly makes your code O(n²).",
      },
      solution: `seen = set()

for x in a:
    seen.add(x)

print(len(seen))`,
    },

    java: {
      example: `Map<String, Integer> ages = new HashMap<>();
ages.put("ravi", 21);
ages.put("meera", 24);

if (ages.containsKey("ravi"))       // check without creating
  System.out.println(ages.get("ravi"));

Set<Integer> seen = new HashSet<>();  // membership only
seen.add(5);
if (seen.contains(5)) System.out.println("yes");`,
      notes: [
        { token: "HashMap", meaning: "O(1) average. TreeMap is O(log n) and keeps keys sorted" },
        { token: "ages.get(missing)", meaning: "gives null, not an error. getOrDefault is safer" },
        { token: "Map<String, Integer>", meaning: "objects only. int must become Integer, which costs memory" },
        { token: "custom key class", meaning: "must override BOTH equals and hashCode, or lookups fail" },
      ],
      vizCode: `static int hash(int key) { return key % 5; }

// insert
table.get(hash(key)).add(key);

// lookup: only one bucket is ever searched`,
      prompt: "Count how many distinct values an array holds, using a set.",
      starter: `Set<Integer> seen = new HashSet<>();

for (int x : a) {
  ;
}

System.out.println();`,
      rules: {
        regex: ["seen\\.add\\s*\\(\\s*x\\s*\\)", "seen\\.size\\s*\\(\\s*\\)"],
        hint: "Add every value with seen.add(x). A set drops repeats, so seen.size() is the count of distinct values.",
        success:
          "Correct. If you ever use your own class as a key, override equals AND hashCode together — override only one and the map will lose your entries.",
      },
      solution: `Set<Integer> seen = new HashSet<>();

for (int x : a) {
  seen.add(x);
}

System.out.println(seen.size());`,
    },

    javascript: {
      example: `const ages = new Map();
ages.set("ravi", 21);
ages.set("meera", 24);

if (ages.has("ravi")) console.log(ages.get("ravi"));

const seen = new Set();          // membership only
seen.add(5);
if (seen.has(5)) console.log("yes");

// WARNING: a plain object turns every key into text
const o = {};
o[1] = "a"; o["1"] = "b";        // both write the SAME slot`,
      notes: [
        { token: "Map", meaning: "keeps the key's type. 1 and \"1\" stay different" },
        { token: "a plain {}", meaning: "turns every key into a string. 1 and \"1\" collide" },
        { token: "map.size", meaning: "a property, no brackets. But map.has(k) is a method" },
        { token: "objects as keys", meaning: "compared by identity, so two equal-looking objects are different keys" },
      ],
      vizCode: `function hash(key) { return key % 5; }

// insert
table[hash(key)].push(key);

// lookup: only one bucket is ever searched`,
      prompt: "Count how many distinct values an array holds, using a Set.",
      starter: `const seen = new Set();

for (const x of a) {
  ;
}

console.log();`,
      rules: {
        regex: ["seen\\.add\\s*\\(\\s*x\\s*\\)", "seen\\.size"],
        hint: "Add every value with seen.add(x). A Set drops repeats, so seen.size is the count of distinct values.",
        success:
          "Correct. Prefer Map and Set over plain objects for this. An object turns every key into text, so the number 1 and the string \"1\" quietly become the same entry.",
      },
      solution: `const seen = new Set();

for (const x of a) {
  seen.add(x);
}

console.log(seen.size);`,
    },

    rust: {
      example: `use std::collections::{HashMap, HashSet};

let mut ages: HashMap<String, i32> = HashMap::new();
ages.insert("ravi".to_string(), 21);

if let Some(v) = ages.get("ravi") { println!("{}", v); }

let mut seen: HashSet<i32> = HashSet::new();   // membership only
seen.insert(5);
if seen.contains(&5) { println!("yes"); }`,
      notes: [
        { token: "HashMap::new()", meaning: "O(1) average. BTreeMap is O(log n) and keeps keys sorted" },
        { token: ".get(k)", meaning: "gives Option — Rust makes you handle 'not there'" },
        { token: ".contains(&5)", meaning: "note the & — you pass a reference, not the value" },
        { token: ".entry(k).or_insert(0)", meaning: "the neat way to count things" },
      ],
      vizCode: `fn hash(key: usize) -> usize { key % 5 }

// insert
table[hash(key)].push(key);

// lookup: only one bucket is ever searched`,
      prompt: "Count how many distinct values an array holds, using a HashSet.",
      starter: `let mut seen: HashSet<i32> = HashSet::new();

for &x in a {
    
}

println!("{}", );`,
      rules: {
        regex: ["seen\\.insert\\s*\\(\\s*x\\s*\\)", "seen\\.len\\s*\\(\\s*\\)"],
        hint: "Add every value with seen.insert(x). A HashSet drops repeats, so seen.len() is the count of distinct values.",
        success:
          "Correct. Rust's .entry(k).or_insert(0) is worth learning next — it is how you count occurrences without looking the key up twice.",
      },
      solution: `let mut seen: HashSet<i32> = HashSet::new();

for &x in a {
    seen.insert(x);
}

println!("{}", seen.len());`,
    },
  },

  /* ------------------------------------------------------------- seen -- */
  seen: {
    c: {
      example: `/* with small whole-number keys, an array does the job */
int pos[MAXV + 1];
for (int i = 0; i <= MAXV; i++) pos[i] = -1;

for (int i = 0; i < n; i++) {
  int need = target - a[i];
  if (need >= 0 && need <= MAXV && pos[need] != -1)
    return;                 /* found: pos[need] and i */
  pos[a[i]] = i;            /* then record */
}`,
      notes: [
        { token: "target - a[i]", meaning: "the partner this value needs" },
        { token: "look up before recording", meaning: "stops a value pairing with itself" },
        { token: "pos[a[i]] = i", meaning: "store the index, not just a flag" },
        { token: "need >= 0 && <= MAXV", meaning: "the range check an array needs and a hash map does not" },
      ],
      vizCode: `int pos[MAXV];
for (int i = 0; i < n; i++) {
  int need = target - a[i];
  if (pos[need] != -1) return;
  pos[a[i]] = i;
}`,
      prompt:
        "Detect whether an array holds any duplicate, in one pass. Values are between 0 and MAXV, so use a flag array.",
      starter: `int seen[MAXV + 1] = {0};

for (int i = 0; i < n; i++) {
  if ( ) return 1;
  ;
}
return 0;`,
      rules: {
        regex: ["seen\\s*\\[\\s*a\\[i\\]\\s*\\]", "seen\\s*\\[\\s*a\\[i\\]\\s*\\]\\s*=\\s*1"],
        hint: "Check if (seen[a[i]]) return 1; then record seen[a[i]] = 1. Check before recording, or every value finds itself.",
        success:
          "Correct. The order is the whole trick, and it is the same whether you use an array or a real hash map: look up first, record second.",
      },
      solution: `int seen[MAXV + 1] = {0};

for (int i = 0; i < n; i++) {
  if (seen[a[i]]) return 1;
  seen[a[i]] = 1;
}
return 0;`,
    },

    python: {
      example: `seen = {}

for i, x in enumerate(a):
    need = target - x
    if need in seen:            # look up FIRST
        return (seen[need], i)
    seen[x] = i                 # then record`,
      notes: [
        { token: "target - x", meaning: "the partner this value needs" },
        { token: "look up before recording", meaning: "stops a value pairing with itself" },
        { token: "enumerate(a)", meaning: "gives index and value together" },
        { token: "seen[x] = i", meaning: "store the index, not just the value" },
      ],
      vizCode: `seen = {}
for i, x in enumerate(a):
    need = target - x
    if need in seen:
        return (seen[need], i)
    seen[x] = i`,
      prompt:
        "Detect whether a list holds any duplicate, using a set and one pass. Return as soon as you find one. Do not use len(set(a)).",
      starter: `seen = set()

for x in a:
    if :
        return True
    

return False`,
      rules: {
        mustNot: ["len(set(", "Counter"],
        regex: ["x\\s+in\\s+seen", "seen\\.add\\s*\\(\\s*x\\s*\\)"],
        hint: "Check `if x in seen: return True` before adding. Add after the check, or every value finds itself.",
        success:
          "Correct. len(set(a)) != len(a) also works in one line, but it always builds the whole set. This stops the moment it finds a repeat.",
      },
      solution: `seen = set()

for x in a:
    if x in seen:
        return True
    seen.add(x)

return False`,
    },

    java: {
      example: `Map<Integer, Integer> seen = new HashMap<>();

for (int i = 0; i < n; i++) {
  int need = target - a[i];
  if (seen.containsKey(need))          // look up FIRST
    return new int[]{seen.get(need), i};
  seen.put(a[i], i);                   // then record
}`,
      notes: [
        { token: "target - a[i]", meaning: "the partner this value needs" },
        { token: "containsKey", meaning: "checks without creating anything" },
        { token: "look up before recording", meaning: "stops a value pairing with itself" },
        { token: "seen.put(a[i], i)", meaning: "store the index, not just the value" },
      ],
      vizCode: `Map<Integer,Integer> seen = new HashMap<>();
for (int i = 0; i < n; i++) {
  int need = target - a[i];
  if (seen.containsKey(need)) return ...;
  seen.put(a[i], i);
}`,
      prompt:
        "Detect whether an array holds any duplicate, using a set and one pass. Return as soon as you find one.",
      starter: `Set<Integer> seen = new HashSet<>();

for (int x : a) {
  if ( ) return true;
  ;
}
return false;`,
      rules: {
        regex: ["seen\\.contains\\s*\\(\\s*x\\s*\\)", "seen\\.add\\s*\\(\\s*x\\s*\\)"],
        hint: "Check seen.contains(x) before adding. Add after the check, or every value finds itself.",
        success:
          "Correct. A shorter version: seen.add(x) itself returns false when the value was already there, so `if (!seen.add(x)) return true;` does both jobs at once.",
      },
      solution: `Set<Integer> seen = new HashSet<>();

for (int x : a) {
  if (seen.contains(x)) return true;
  seen.add(x);
}
return false;`,
    },

    javascript: {
      example: `const seen = new Map();

for (let i = 0; i < n; i++) {
  const need = target - a[i];
  if (seen.has(need))              // look up FIRST
    return [seen.get(need), i];
  seen.set(a[i], i);               // then record
}`,
      notes: [
        { token: "target - a[i]", meaning: "the partner this value needs" },
        { token: "seen.has(need)", meaning: "checks without creating anything" },
        { token: "look up before recording", meaning: "stops a value pairing with itself" },
        { token: "Map, not {}", meaning: "an object would turn the number keys into text" },
      ],
      vizCode: `const seen = new Map();
for (let i = 0; i < n; i++) {
  const need = target - a[i];
  if (seen.has(need)) return [seen.get(need), i];
  seen.set(a[i], i);
}`,
      prompt:
        "Detect whether an array holds any duplicate, using a Set and one pass. Return as soon as you find one. Do not compare sizes.",
      starter: `const seen = new Set();

for (const x of a) {
  if ( ) return true;
  ;
}
return false;`,
      rules: {
        mustNot: ["new Set(a)"],
        regex: ["seen\\.has\\s*\\(\\s*x\\s*\\)", "seen\\.add\\s*\\(\\s*x\\s*\\)"],
        hint: "Check seen.has(x) before adding. Add after the check, or every value finds itself.",
        success:
          "Correct. new Set(a).size !== a.length is the one-liner, but it always builds the whole set. This version stops at the first repeat.",
      },
      solution: `const seen = new Set();

for (const x of a) {
  if (seen.has(x)) return true;
  seen.add(x);
}
return false;`,
    },

    rust: {
      example: `let mut seen: HashMap<i32, usize> = HashMap::new();

for (i, &x) in a.iter().enumerate() {
    let need = target - x;
    if let Some(&j) = seen.get(&need) {    // look up FIRST
        return Some((j, i));
    }
    seen.insert(x, i);                     // then record
}`,
      notes: [
        { token: "target - x", meaning: "the partner this value needs" },
        { token: "if let Some(&j)", meaning: "run this only when the key was there" },
        { token: "look up before recording", meaning: "stops a value pairing with itself" },
        { token: ".iter().enumerate()", meaning: "gives index and value together" },
      ],
      vizCode: `let mut seen = HashMap::new();
for (i, &x) in a.iter().enumerate() {
    let need = target - x;
    if let Some(&j) = seen.get(&need) { return Some((j, i)); }
    seen.insert(x, i);
}`,
      prompt:
        "Detect whether an array holds any duplicate, using a HashSet and one pass. Return as soon as you find one.",
      starter: `let mut seen: HashSet<i32> = HashSet::new();

for &x in a {
    if  { return true; }
    ;
}
false`,
      rules: {
        regex: ["seen\\.contains\\s*\\(\\s*&x\\s*\\)", "seen\\.insert\\s*\\(\\s*x\\s*\\)"],
        hint: "Check seen.contains(&x) before inserting. Note the & — contains takes a reference.",
        success:
          "Correct. Shorter still: .insert() returns false when the value was already there, so `if !seen.insert(x) { return true; }` does both at once.",
      },
      solution: `let mut seen: HashSet<i32> = HashSet::new();

for &x in a {
    if seen.contains(&x) { return true; }
    seen.insert(x);
}
false`,
    },
  },
};
