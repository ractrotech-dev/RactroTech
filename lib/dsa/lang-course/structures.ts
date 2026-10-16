import type { TopicLesson } from "@/lib/dsa/lessons/types";
import { traceContainerCosts, traceHashMap, traceSetOps } from "@/lib/dsa/viz/traceLang";

// Language track, topic 5.
//
// Every language here ships a map and a set except C, which ships neither. The
// ideas are identical; the names, the ordering guarantees and the syntax for
// "is this key present" are all different, and the last one is where people
// actually get stuck.

export const LANG_STRUCTURES: TopicLesson = {
  id: "lang-data-structures",
  title: "Data Structures",
  tagline: "The containers the language already gives you.",
  why:
    "Most of the DSA course is about building containers. This topic is about the ones you do not have to build — the map and the set that ship with the language, which between them solve a startling share of everyday problems. Knowing when to reach for one is worth more than knowing how to implement it.",
  plain: [
    "A list holds things in order and finds them by position.",
    "A map holds pairs and finds a value by its key, instantly.",
    "A set holds unique things and answers one question: is this in here?",
    "Choosing between them comes down to how you will look things up.",
  ],
  needs: ["Arrays and lists from the previous topic.", "Loops from Control Flow."],
  traps: [
    "Reading a missing key does something different in every language: an exception, None, undefined, or a silently created empty entry.",
    "A hash map has no useful order. Do not rely on the order you see when printing one.",
    "Whatever you use as a key must be hashable and must not change while it is in there. Changing a key after inserting it loses the entry.",
    "Looping over a map or set while adding to or removing from it is a bug in every one of these languages.",
    "If you are writing a loop to search a list, and doing it often, you probably wanted a map or a set.",
  ],
  sections: [
    /* ------------------------------------------------------------ map -- */
    {
      id: "map",
      kicker: "01",
      title: "Finding by name, not by position",
      hook:
        "You have a million users and you need the one with id 84213. With a list you check them one by one. Is there something better?",
      body: [
        "Yes, and it barely looks at anything. A map turns the key itself into a location: run 84213 through a fixed recipe, get a slot number, look there. Done.",
        "That is the whole idea. No searching, no comparing, and the size of the map barely matters — a map of ten and a map of ten million take about the same time to look in.",
        "C++ gives you two. `unordered_map` is the hash map just described. `map` is a sorted tree — a little slower per operation, and it keeps the keys in order, which is sometimes exactly what you want.",
        "The trap that catches everyone in C++ is reading a key that is not there. `m[\"missing\"]` does not fail — it CREATES the entry with a default value and hands it back. Your map just got bigger by reading from it.",
        "So use `m.count(k)` or `m.contains(k)` to test, and `m.find(k)` when you want to look without creating. Reserve `m[k]` for when you mean to assign.",
        "A key must be hashable and must not change while it is in the map. Changing a key in place means the map looks for it in the wrong slot, and the entry is effectively lost.",
      ],
      predict: {
        ask: "What does this C++ code print?",
        code: `unordered_map<string,int> m;
m["cat"] = 1;

cout << m["dog"] << " ";
cout << m.size();`,
        choices: [
          { text: "0 1", why: "Reading m[\"dog\"] does not just return a default — it inserts one, so the size changes." },
          { text: "0 2", why: "Correct. Reading a missing key with [] CREATES it with a value-initialised 0 and inserts it, so the map now holds both cat and dog." },
          { text: "It throws out_of_range", why: "That is .at() rather than []. The [] operator never throws on a missing key — it inserts one." },
          { text: "Garbage, then 1", why: "The new value is value-initialised to 0, not left as junk. But the insertion does happen, so the size becomes 2." },
        ],
        answer: 1,
      },
      viz: traceHashMap(),
      example: `unordered_map<string,int> ages;    // hash map. No order
map<string,int> sorted;            // tree. Keys stay sorted

ages["ada"] = 36;                  // insert or overwrite
ages["bob"] = 41;

cout << ages["ada"];               // 36
cout << ages.size();

// testing — do NOT use [] for this
if (ages.count("ada")) cout << "present";
if (ages.contains("ada")) cout << "present";     // C++20

auto it = ages.find("ada");        // look without creating
if (it != ages.end()) cout << it->second;

cout << ages.at("ada");            // throws if missing

ages.erase("bob");

for (auto& [name, age] : ages)     // order is NOT the insert order
  cout << name << "=" << age;`,
      notes: [
        { token: "unordered_map", meaning: "the hash map. Instant, and unordered" },
        { token: "map", meaning: "a sorted tree. Slower per step, keys in order" },
        { token: "m[k] on a missing key", meaning: "CREATES it. The trap in this language" },
        { token: "count / contains / find", meaning: "how to test without inserting" },
      ],
      challenge: {
        prompt:
          "Check whether \"ada\" is in the map and print her age — without creating an entry if she is missing.",
        starter: `unordered_map<string,int> ages;
ages["ada"] = 36;

if (ages) {
  cout << ages;
}`,
        rules: {
          regex: ["ages\\.(count|contains)\\s*\\(\\s*\"ada\"\\s*\\)"],
          hint: "Test with ages.count(\"ada\") or ages.contains(\"ada\"), then read it inside the if.",
          success:
            "Correct. Reading ages[\"ada\"] inside the if is safe because you already know it is there — it is the test itself that must never use [].",
        },
        solution: `unordered_map<string,int> ages;
ages["ada"] = 36;

if (ages.count("ada")) {
  cout << ages["ada"];
}`,
      },

      alt: {
        c: {
          hook:
            "You have a million users and you need the one with id 84213. C has no map. So what do you actually do?",
          body: [
            "You write one, or you use somebody else's. C ships no hash map, no set, no growable list — the standard library gives you arrays, strings and memory, and stops there.",
            "That is not an oversight. C is meant to be small enough to run on a chip with a few kilobytes of memory, and a hash map is a policy decision C leaves to you.",
            "In practice you have three options. For a handful of items, an array of structs and a loop is genuinely fine — searching twenty things is instant. For real work, use a library like uthash or klib. Or write the map yourself, which the DSA track walks through step by step.",
            "The pieces are the ones in the diagram: an array of slots, a hash function turning a key into a slot number, and a plan for two keys landing in the same slot.",
            "For string keys, `djb2` is the classic small hash — a handful of lines and good enough for most things. For collisions, either chain a small linked list in each slot, or step forward to the next free slot.",
            "There is one thing C does give you: `qsort` and `bsearch`. Sort an array once and you can then find any item in it by halving — not as fast as a hash map, and far better than scanning.",
          ],
          predict: {
            ask: "What does the C standard library actually provide?",
            code: `/* which of these exist in standard C? */
hash_map, set, vector, list      /* ? */
qsort, bsearch                   /* ? */
malloc, free                     /* ? */`,
            choices: [
              { text: "All of them", why: "C has no container types at all. hash_map, set, vector and list are C++ and other languages." },
              { text: "Only qsort/bsearch and malloc/free", why: "Correct. C gives you sorting, binary search and raw memory. Every container — list, map, set — you write yourself or take from a library." },
              { text: "Only malloc and free", why: "qsort and bsearch are both in stdlib.h and are genuinely useful — sort once, then find by halving." },
              { text: "None — C has no standard library", why: "C has a standard library; it is simply small. It covers memory, strings, files, maths and a little more." },
            ],
            answer: 1,
          },
          example: `/* a tiny hash map, by hand */
#define SLOTS 128

typedef struct Entry {
  char *key;
  int value;
  struct Entry *next;     /* the chain, for collisions */
} Entry;

Entry *table[SLOTS];      /* all NULL to start */

/* djb2 — the classic small string hash */
unsigned long hash(const char *s) {
  unsigned long h = 5381;
  while (*s) h = h * 33 + (unsigned char)*s++;
  return h;
}

int slot = hash("ada") % SLOTS;    /* where it goes */

/* what C DOES give you: sort once, then find by halving */
int cmp(const void *a, const void *b) {
  return (*(int*)a) - (*(int*)b);
}
qsort(nums, len, sizeof(int), cmp);
int *found = bsearch(&key, nums, len, sizeof(int), cmp);`,
          notes: [
            { token: "no map, no set, no list", meaning: "C ships none of them. You write or borrow one" },
            { token: "hash(key) % SLOTS", meaning: "turns a key into a slot number" },
            { token: "struct Entry *next", meaning: "the chain — what happens when two keys collide" },
            { token: "qsort / bsearch", meaning: "what C does give you. Sort once, then halve" },
          ],
          prompt:
            "Finish the djb2 hash: start at 5381, and for each character multiply by 33 and add the character.",
          starter: `unsigned long hash(const char *s) {
  unsigned long h = ;
  while (*s) h = ;
  return h;
}`,
          rules: {
            regex: ["h\\s*=\\s*5381", "h\\s*=\\s*h\\s*\\*\\s*33\\s*\\+"],
            hint: "Start h at 5381, then h = h * 33 + (unsigned char)*s++; each time round.",
            success:
              "Correct. The two magic numbers are not arbitrary — 5381 and 33 were chosen because they scatter real-world strings well. Any decent hash just has to spread keys evenly across the slots.",
          },
          solution: `unsigned long hash(const char *s) {
  unsigned long h = 5381;
  while (*s) h = h * 33 + (unsigned char)*s++;
  return h;
}`,
        },

        python: {
          body: [
            "Yes, and it barely looks at anything. A dict turns the key itself into a location: run the key through a fixed recipe, get a slot number, look there. Done.",
            "No searching, no comparing, and the size hardly matters — a dict of ten and a dict of ten million take about the same time to look in.",
            "Python's dict is the most-used container in the language. Objects, keyword arguments and modules are all dicts underneath.",
            "Reading a missing key raises KeyError, which is a clean, obvious failure. If you would rather have a fallback, `d.get(k)` gives None and `d.get(k, 0)` gives whatever default you name.",
            "`k in d` is the membership test, and it is instant. Never write `k in d.keys()` — it does the same thing more slowly and reads worse.",
            "Since Python 3.7 a dict remembers INSERTION order when you loop over it. That is guaranteed, and it does not mean sorted — it means the order you put things in.",
            "Keys must be hashable, which in practice means immutable. A string, number or tuple can be a key; a list cannot, because it could change and the entry would then be lost.",
          ],
          predict: {
            ask: "What does this Python code print?",
            code: `d = {"cat": 1}

print(d.get("dog"))
print(d.get("dog", 0))
print(len(d))
print(d["dog"])`,
            choices: [
              { text: "None, 0, 1, then KeyError", why: "Correct. get returns None for a missing key, get with a default returns that default, neither one inserts anything, and [] raises KeyError." },
              { text: "None, 0, 2, then 0", why: "Unlike C++, Python's get never inserts. The dict still holds only cat, and d[\"dog\"] raises rather than creating." },
              { text: "KeyError on the first line", why: "get is exactly the method for a key that may be missing — it returns None instead of raising." },
              { text: "0, 0, 1, then None", why: "get with no default returns None, not 0. And d[\"dog\"] raises KeyError rather than returning anything." },
            ],
            answer: 0,
          },
          example: `ages = {"ada": 36, "bob": 41}      # a dict
ages["cleo"] = 29

print(ages["ada"])         # 36
print(ages["zed"])         # KeyError — the program stops
print(ages.get("zed"))     # None
print(ages.get("zed", 0))  # 0 — your own default

print("ada" in ages)       # True. Instant. Never "in ages.keys()"
print(len(ages))

del ages["bob"]
ages.pop("bob", None)      # remove, with a default if absent

for name in ages:                    # keys
    print(name)
for name, age in ages.items():       # both
    print(name, age)

# counting, the usual Python way
from collections import Counter, defaultdict
counts = Counter("hello")            # {'l': 2, 'h': 1, ...}
groups = defaultdict(list)           # a missing key makes an empty list
groups["a"].append(1)`,
          notes: [
            { token: "d[k] on a missing key", meaning: "KeyError. Python does not create it" },
            { token: "d.get(k, default)", meaning: "a fallback instead of an error" },
            { token: "k in d", meaning: "the membership test. Instant" },
            { token: "Counter / defaultdict", meaning: "the two that save the most code" },
          ],
          prompt:
            "Read the key \"zed\" so that a missing key gives 0 rather than raising an error.",
          starter: `ages = {"ada": 36}

print(ages)`,
          rules: {
            regex: ['ages\\.get\\s*\\(\\s*"zed"\\s*,\\s*0\\s*\\)'],
            hint: 'ages.get("zed", 0) — the second argument is what you get back when the key is missing.',
            success:
              "Correct. And when you want a default for EVERY missing key rather than one lookup, defaultdict(int) does it automatically — that is the usual way to count things.",
          },
          solution: `ages = {"ada": 36}

print(ages.get("zed", 0))`,
        },

        java: {
          body: [
            "Yes, and it barely looks at anything. A HashMap turns the key itself into a location: run the key through hashCode, work out a slot, look there. Done.",
            "Java gives you three worth knowing. `HashMap` is the fast, unordered one and the default choice. `LinkedHashMap` keeps insertion order. `TreeMap` keeps keys sorted and lets you ask for ranges.",
            "Reading a missing key returns `null`, which is quiet and is where a lot of NullPointerExceptions start. `getOrDefault(k, 0)` is almost always the better call.",
            "`containsKey(k)` is the membership test. Use it rather than checking for null, because a key can legitimately be stored WITH a null value and the two cases look identical otherwise.",
            "You declare the types up front: `Map<String,Integer> m = new HashMap<>();`. Declaring the variable as `Map` and creating a `HashMap` is the standard style — it lets you swap the implementation later without touching anything else.",
            "One thing to know early: a map cannot hold primitives. `Map<String,int>` does not compile; it has to be `Integer`. Java boxes every number into an object, which is why a Java map of numbers uses far more memory than a C++ one.",
            "And if you write your own class as a key, you must override both `equals` and `hashCode`. Override only one and lookups mysteriously fail — the map goes to the right slot and does not recognise what is there.",
          ],
          predict: {
            ask: "What does this Java code print?",
            code: `Map<String,Integer> m = new HashMap<>();
m.put("cat", 1);

System.out.println(m.get("dog"));
System.out.println(m.getOrDefault("dog", 0));
System.out.println(m.size());`,
            choices: [
              { text: "null, 0, 1", why: "Correct. A missing key gives null rather than throwing, getOrDefault supplies your fallback, and neither one inserts anything." },
              { text: "0, 0, 1", why: "get returns null for a missing key. It does not return zero — Integer is an object, and its absence is null." },
              { text: "null, 0, 2", why: "Unlike C++, Java's get never inserts. The map still holds one entry." },
              { text: "It throws NoSuchElementException", why: "Java's Map.get is quiet: it returns null. The exception usually comes later, when something unboxes that null." },
            ],
            answer: 0,
          },
          example: `Map<String,Integer> ages = new HashMap<>();     // fast, no order
Map<String,Integer> ordered = new LinkedHashMap<>();  // insertion order
Map<String,Integer> sorted = new TreeMap<>();         // keys sorted

ages.put("ada", 36);
ages.put("bob", 41);

System.out.println(ages.get("ada"));            // 36
System.out.println(ages.get("zed"));            // null — quiet
System.out.println(ages.getOrDefault("zed", 0));// 0 — better

if (ages.containsKey("ada")) System.out.println("present");
System.out.println(ages.size());
ages.remove("bob");

for (Map.Entry<String,Integer> e : ages.entrySet())
  System.out.println(e.getKey() + "=" + e.getValue());

// counting, the modern way
Map<String,Integer> counts = new HashMap<>();
counts.merge("a", 1, Integer::sum);       // add 1, or start at 1
counts.computeIfAbsent("b", k -> 0);`,
          notes: [
            { token: "Map m = new HashMap<>()", meaning: "declare the interface, create the class" },
            { token: "get on a missing key", meaning: "null. getOrDefault is usually better" },
            { token: "containsKey(k)", meaning: "the real test. A stored null looks like absence otherwise" },
            { token: "merge / computeIfAbsent", meaning: "counting and grouping, without the if" },
          ],
          prompt:
            "Read \"zed\" from the map so that a missing key gives 0 rather than null.",
          starter: `Map<String,Integer> ages = new HashMap<>();
ages.put("ada", 36);

System.out.println(ages);`,
          rules: {
            regex: ['ages\\.getOrDefault\\s*\\(\\s*"zed"\\s*,\\s*0\\s*\\)'],
            hint: 'ages.getOrDefault("zed", 0) — the second argument is returned when the key is absent.',
            success:
              "Correct, and it avoids a real bug: `int age = ages.get(\"zed\");` compiles fine and throws a NullPointerException at run time, because unboxing null into an int is not possible.",
          },
          solution: `Map<String,Integer> ages = new HashMap<>();
ages.put("ada", 36);

System.out.println(ages.getOrDefault("zed", 0));`,
        },

        javascript: {
          body: [
            "Yes, and it barely looks at anything. A Map turns the key itself into a location, and finding it takes about the same time whether the Map holds ten things or ten million.",
            "JavaScript has two ways to do this and the difference matters. A plain object `{}` is what most code uses. A `Map` is the purpose-built one, and it is better for anything dynamic.",
            "A plain object only takes strings and symbols as keys — write `obj[1]` and the 1 quietly becomes \"1\". A Map takes ANY key, including objects and numbers, and keeps them as they are.",
            "A Map also has a real `.size`, iterates in insertion order by guarantee, and has no inherited keys. A plain object inherits from Object.prototype, which is why `\"toString\" in obj` is true on an empty object.",
            "Reading a missing key gives `undefined` in both, with no error — the loosest behaviour of the six languages here.",
            "For membership, use `map.has(k)` or `Object.hasOwn(obj, k)`. Checking `if (obj[k])` is a common bug: a stored 0, \"\" or false all look like absence.",
            "Rule of thumb: use `{}` for a fixed set of named fields you write in the source, and `Map` when the keys arrive at run time.",
          ],
          predict: {
            ask: "What does this print?",
            code: `const obj = {};
obj[1] = "a";
obj["1"] = "b";

const map = new Map();
map.set(1, "a");
map.set("1", "b");

console.log(Object.keys(obj).length, map.size);`,
            choices: [
              { text: "1 2", why: "Correct. An object turns the number 1 into the string \"1\", so the second write overwrites the first. A Map keeps 1 and \"1\" as two distinct keys." },
              { text: "2 2", why: "A plain object cannot hold both — every key is converted to a string, so 1 and \"1\" are the same key." },
              { text: "1 1", why: "A Map does NOT convert its keys. The number 1 and the string \"1\" stay separate, so its size is 2." },
              { text: "2 1", why: "It is the other way round: the object collapses the two keys into one, and the Map keeps them apart." },
            ],
            answer: 0,
          },
          example: `// a plain object — fixed, named fields
const user = { name: "Ada", age: 36 };
console.log(user.name);
console.log(user["age"]);
console.log(user.missing);        // undefined, no error
console.log(Object.hasOwn(user, "name"));
console.log(Object.keys(user).length);

// a Map — keys arriving at run time
const ages = new Map();
ages.set("ada", 36);
ages.set(1, "a");                 // a NUMBER key stays a number

console.log(ages.get("ada"));     // 36
console.log(ages.get("zed"));     // undefined
console.log(ages.has("ada"));     // the membership test
console.log(ages.size);           // a real size
ages.delete("ada");

for (const [k, v] of ages) console.log(k, v);   // insertion order

// counting
const counts = new Map();
counts.set("a", (counts.get("a") ?? 0) + 1);`,
          notes: [
            { token: "{} keys", meaning: "strings only. obj[1] becomes obj[\"1\"]" },
            { token: "Map keys", meaning: "anything. Numbers and objects stay themselves" },
            { token: "map.has(k)", meaning: "the test. if (obj[k]) misreads 0, \"\" and false" },
            { token: "map.size", meaning: "a real count. An object needs Object.keys(o).length" },
          ],
          prompt:
            "Test whether the map holds \"ada\" using the method built for it, rather than checking the value.",
          starter: `const ages = new Map();
ages.set("ada", 0);

if (ages) {
  console.log("present");
}`,
          rules: {
            regex: ['ages\\.has\\s*\\(\\s*"ada"\\s*\\)'],
            mustNot: ['ages.get("ada")'],
            hint: 'ages.has("ada") answers the question directly.',
            success:
              "Correct — and this example is chosen deliberately. The stored value is 0, so `if (ages.get(\"ada\"))` would be false and the key would look absent when it is not.",
          },
          solution: `const ages = new Map();
ages.set("ada", 0);

if (ages.has("ada")) {
  console.log("present");
}`,
        },

        rust: {
          body: [
            "Yes, and it barely looks at anything. A HashMap turns the key itself into a location, and the size of the map hardly changes how long a lookup takes.",
            "Rust gives you `HashMap` for speed and `BTreeMap` for sorted keys. Both need bringing in: `use std::collections::HashMap;`.",
            "Reading is where Rust differs from everything else here. `map.get(&k)` hands back an `Option`: `Some(&value)` or `None`. There is no null and no silent undefined — the absence is part of the value, and the compiler will not let you ignore it.",
            "So you either match on it, or use `.copied().unwrap_or(0)` to supply a default, or `if let Some(v) = map.get(&k)` to handle just the present case.",
            "`map[&k]` also exists and panics when the key is missing, which is the same trade C++ makes with `.at()`.",
            "The `entry` API is the piece worth learning properly. `*counts.entry(word).or_insert(0) += 1` looks up once and either increments what is there or starts at zero. It replaces the get-then-check-then-insert dance entirely.",
            "Ownership shows up here too: inserting a String MOVES it into the map. If you need to keep using it, clone it or store a reference with a lifetime — and for counting words the usual answer is to insert owned Strings and stop worrying.",
          ],
          predict: {
            ask: "What does this Rust code print?",
            code: `use std::collections::HashMap;

let mut m: HashMap<&str, i32> = HashMap::new();
m.insert("cat", 1);

println!("{:?}", m.get("dog"));
println!("{}", m.get("dog").copied().unwrap_or(0));`,
            choices: [
              { text: "null then 0", why: "Rust has no null at all. A missing key gives None, which prints as None." },
              { text: "None then 0", why: "Correct. get always returns an Option, so a missing key is None, and unwrap_or supplies the fallback of 0." },
              { text: "It panics on the first line", why: "get never panics — it returns None. Indexing with m[\"dog\"] is the one that panics." },
              { text: "Some(0) then 0", why: "The key is genuinely absent, so there is nothing to wrap. It is None rather than Some of a default." },
            ],
            answer: 1,
          },
          example: `use std::collections::{HashMap, BTreeMap};

let mut ages: HashMap<String, i32> = HashMap::new();
ages.insert("ada".to_string(), 36);      // MOVES the String in

// reading gives an Option — absence is part of the value
match ages.get("ada") {
    Some(a) => println!("{}", a),
    None => println!("not here"),
}
println!("{}", ages.get("zed").copied().unwrap_or(0));   // 0

if let Some(a) = ages.get("ada") { println!("{}", a); }

println!("{}", ages.contains_key("ada"));
println!("{}", ages.len());
ages.remove("ada");

for (name, age) in &ages { println!("{} {}", name, age); }

// the entry API — one lookup, insert-or-update
let mut counts: HashMap<&str, i32> = HashMap::new();
*counts.entry("a").or_insert(0) += 1;

let sorted: BTreeMap<&str, i32> = BTreeMap::new();   // keys in order`,
          notes: [
            { token: "map.get(&k)", meaning: "an Option. Some or None — never null" },
            { token: ".unwrap_or(0)", meaning: "supply a default for the None case" },
            { token: "entry(k).or_insert(0)", meaning: "insert-or-update in one lookup" },
            { token: "insert(String)", meaning: "MOVES it in. Clone if you still need it" },
          ],
          prompt:
            "Count occurrences with the entry API: add one to the count for \"a\", starting from zero if it is not there yet.",
          starter: `use std::collections::HashMap;

let mut counts: HashMap<&str, i32> = HashMap::new();
counts.entry("a")(0) ;`,
          rules: {
            regex: ["\\*\\s*counts\\.entry\\s*\\(\\s*\"a\"\\s*\\)\\.or_insert\\s*\\(\\s*0\\s*\\)\\s*\\+=\\s*1"],
            hint: "*counts.entry(\"a\").or_insert(0) += 1; — note the leading * to reach the value behind the reference.",
            success:
              "Correct. or_insert hands back a &mut to the value, which is why the * is needed. It also does the whole thing in ONE hash lookup, where get-then-insert would do two.",
          },
          solution: `use std::collections::HashMap;

let mut counts: HashMap<&str, i32> = HashMap::new();
*counts.entry("a").or_insert(0) += 1;`,
        },
      },
    },

    /* ------------------------------------------------------------ set -- */
    {
      id: "set",
      kicker: "02",
      title: "Have I seen this before?",
      hook:
        "You are reading a million lines and want the distinct ones. Checking each new line against everything so far means half a trillion comparisons. What do you use instead?",
      body: [
        "A set. It is a map with the values thrown away — it stores keys and answers one question instantly: is this in here?",
        "Insert a million lines and you get the distinct ones, with no comparing done by you. A duplicate insert simply does nothing: no error, no second copy.",
        "That is the whole feature, and it turns two very common problems into one line each. Removing duplicates is 'put it all in a set'. Asking 'have I seen this?' is 'is it in the set?'.",
        "C++ gives you `unordered_set` (hashed, no order, fast) and `set` (a sorted tree, slightly slower, keeps everything in order). The unordered one is the default choice unless you need the sorting.",
        "`insert` tells you whether it actually inserted, which is often the answer you wanted: `if (!seen.insert(x).second) { /* it was a duplicate */ }`.",
        "The catch is the same as for a map: no useful order from the hashed one, and whatever you store must be hashable and must not change while it is in there.",
      ],
      predict: {
        ask: "What does this C++ code print?",
        code: `unordered_set<int> seen;

seen.insert(3);
seen.insert(1);
seen.insert(3);

cout << seen.size();`,
        choices: [
          { text: "3", why: "The second insert of 3 is dropped, because a set holds one of each." },
          { text: "2", why: "Correct. The duplicate 3 is silently ignored — no error, no second copy — so the set holds 3 and 1." },
          { text: "It throws on the duplicate insert", why: "Inserting a duplicate is a normal, expected operation. It quietly does nothing and reports that it did nothing." },
          { text: "1", why: "3 and 1 are different values, so both are stored. Only the repeat of 3 is dropped." },
        ],
        answer: 1,
      },
      viz: traceSetOps(),
      example: `unordered_set<string> seen;     // hashed. No order
set<string> sorted;             // a tree. Always in order

seen.insert("cat");
seen.insert("cat");             // ignored. Size stays 1

if (seen.count("cat")) cout << "seen it";
if (seen.contains("cat")) cout << "seen it";     // C++20

// insert reports whether it actually inserted
if (!seen.insert("cat").second)
  cout << "that was a duplicate";

seen.erase("cat");
cout << seen.size();

// the classic use: distinct values out of a vector
unordered_set<int> distinct(nums.begin(), nums.end());

// and the classic loop: skip what you have already handled
for (int x : nums)
  if (seen.insert(x).second)
    cout << x;                  // only the first time each appears`,
      notes: [
        { token: "unordered_set", meaning: "hashed. Fast, and no order" },
        { token: "set", meaning: "a sorted tree. Keeps everything in order" },
        { token: "a duplicate insert", meaning: "silently does nothing. That is the feature" },
        { token: "insert(x).second", meaning: "true when it was genuinely new" },
      ],
      challenge: {
        prompt:
          "Print each number the first time it appears and skip repeats — using the set to decide.",
        starter: `unordered_set<int> seen;

for (int x : nums) {
  if () {
    cout << x;
  }
}`,
        rules: {
          regex: ["seen\\.insert\\s*\\(\\s*x\\s*\\)\\.second|!\\s*seen\\.count\\s*\\(\\s*x\\s*\\)|!\\s*seen\\.contains\\s*\\(\\s*x\\s*\\)"],
          hint: "seen.insert(x).second is true only when x was new — so that one call both records and tests.",
          success:
            "Correct. Doing it in one call is worth the habit: count-then-insert hashes x twice, and insert().second hashes it once and tells you what happened.",
        },
        solution: `unordered_set<int> seen;

for (int x : nums) {
  if (seen.insert(x).second) {
    cout << x;
  }
}`,
      },

      alt: {
        c: {
          hook:
            "You are reading a million lines and want the distinct ones. C has no set. What is the practical answer?",
          body: [
            "The same as for a map: build one, borrow one, or use sorting.",
            "A set is a map with no values, so if you already have the hash table from the previous section, you have a set — just stop storing the value.",
            "But there is a second answer that fits C well and is worth knowing everywhere: SORT, then walk. Sorting brings equal items next to each other, so removing duplicates becomes 'skip anything equal to the previous item'.",
            "That is one `qsort` and one pass. It is a little slower than a hash set in theory, uses no extra memory, and needs about six lines of code you can write from memory.",
            "For small numbers there is a third trick that is hard to beat: an array of flags. If your values are 0 to 999, `char seen[1000] = {0}` and `seen[x] = 1` is a set, and every operation is a single memory access.",
            "That last one is worth remembering in every language. When the keys are small integers, an array IS the fastest possible set, and no hashing is involved at all.",
          ],
          predict: {
            ask: "After sorting, what does this loop print for {1, 1, 2, 3, 3, 3}?",
            code: `for (int i = 0; i < len; i++) {
  if (i == 0 || nums[i] != nums[i-1])
    printf("%d ", nums[i]);
}`,
            choices: [
              { text: "1 1 2 3 3 3", why: "The condition skips any item equal to the one before it, so the repeats are not printed." },
              { text: "1 2 3", why: "Correct. Sorting put equal values next to each other, so comparing with the previous item is enough to drop every duplicate in one pass." },
              { text: "1 2 3 3", why: "Every repeat is caught, not just some — each of the three 3s after the first fails the != test." },
              { text: "It reads past the start at i = 0", why: "The i == 0 check short-circuits before nums[i-1] is ever evaluated, so index -1 is never touched." },
            ],
            answer: 1,
          },
          example: `/* option 1 — sort, then skip repeats. No extra memory */
qsort(nums, len, sizeof(int), cmp);

for (int i = 0; i < len; i++)
  if (i == 0 || nums[i] != nums[i-1])
    printf("%d ", nums[i]);

/* option 2 — a flag array, when the values are small integers.
   This is the fastest set there is: one memory access per operation */
char seen[1000] = {0};

for (int i = 0; i < len; i++) {
  if (!seen[nums[i]]) {
    seen[nums[i]] = 1;
    printf("%d ", nums[i]);
  }
}

/* option 3 — the hash table from the previous section, with the
   value field removed. A set IS a map with no values */`,
          notes: [
            { token: "sort then skip repeats", meaning: "no extra memory, six lines, works anywhere" },
            { token: "char seen[1000]", meaning: "a flag array. The fastest set when keys are small ints" },
            { token: "i == 0 ||", meaning: "guards nums[i-1]. || stops before the right side" },
            { token: "a set is a map", meaning: "with the values removed. Same table, one field fewer" },
          ],
          prompt:
            "Use the flag array to print each value the first time it appears, marking it as seen.",
          starter: `char seen[1000] = {0};

for (int i = 0; i < len; i++) {
  if (!seen[]) {
    seen[] = 1;
    printf("%d ", nums[i]);
  }
}`,
          rules: {
            regex: ["!\\s*seen\\s*\\[\\s*nums\\s*\\[\\s*i\\s*\\]\\s*\\]", "seen\\s*\\[\\s*nums\\s*\\[\\s*i\\s*\\]\\s*\\]\\s*=\\s*1"],
            hint: "Index the flag array BY the value: seen[nums[i]].",
            success:
              "Correct. The one thing to guard is the range — nums[i] must be between 0 and 999 here, or you write outside the array, and C will not tell you.",
          },
          solution: `char seen[1000] = {0};

for (int i = 0; i < len; i++) {
  if (!seen[nums[i]]) {
    seen[nums[i]] = 1;
    printf("%d ", nums[i]);
  }
}`,
        },

        python: {
          body: [
            "A set. It is a dict with the values thrown away — it stores keys and answers one question instantly: is this in here?",
            "`set(lines)` gives you the distinct ones in one call. `x in seen` tests membership without searching.",
            "A duplicate `add` simply does nothing. No error, no second copy — that silent dropping is the whole feature.",
            "Python sets also do the mathematical operations directly, which is often the shortest way to express what you meant: `a & b` is what is in both, `a | b` is everything, `a - b` is what is only in a.",
            "One thing that catches people: `{}` is an empty DICT, not an empty set. The empty set is `set()`. `{1, 2}` with items in it is a set.",
            "Items must be hashable, so a set can hold strings, numbers and tuples but not lists. If you need a set of collections, convert them to tuples first.",
            "And the speed difference is worth internalising: `x in some_list` walks the list, `x in some_set` does not. Swapping one for the other in a loop can turn minutes into milliseconds.",
          ],
          predict: {
            ask: "What does this Python code print?",
            code: `a = {1, 2, 3}
b = {3, 4}

print(a & b)
print(a - b)
print(type({}))`,
            choices: [
              { text: "{3}, {1, 2}, <class 'dict'>", why: "Correct. & gives what is in both, - gives what is only in a, and {} with nothing in it is an empty dict rather than an empty set." },
              { text: "{3}, {1, 2}, <class 'set'>", why: "The last one is the trap: empty braces make a dict. You need set() for an empty set." },
              { text: "{1, 2, 3, 4}, {1, 2}, <class 'dict'>", why: "& is the intersection — what is in both — not the union. That would be a | b." },
              { text: "TypeError on a & b", why: "& between two sets is a normal, supported operation giving the intersection." },
            ],
            answer: 0,
          },
          example: `seen = set()               # EMPTY set. {} would be a dict
seen = {1, 2, 3}           # with items, braces make a set

seen.add(1)                # already there — quietly does nothing
seen.discard(9)            # remove if present, no error if not
seen.remove(9)             # KeyError if not present

print(1 in seen)           # instant. Never walks the set
print(len(seen))

# distinct values, in one call
distinct = set([1, 1, 2, 3])          # {1, 2, 3}
distinct = list(set(items))           # back to a list, order lost

# set maths — often the shortest way to say it
a, b = {1, 2, 3}, {3, 4}
print(a & b)               # {3} — in both
print(a | b)               # {1, 2, 3, 4} — either
print(a - b)               # {1, 2} — only in a
print(a ^ b)               # {1, 2, 4} — in one but not both

# the speed that matters
# x in a_list  walks it.  x in a_set  does not.`,
          notes: [
            { token: "set()", meaning: "the empty set. {} is an empty dict" },
            { token: "add a duplicate", meaning: "quietly does nothing. That is the feature" },
            { token: "a & b, a | b, a - b", meaning: "in both, either, only in a" },
            { token: "x in a_set", meaning: "instant. x in a_list walks the whole list" },
          ],
          prompt:
            "Get the distinct values of items back as a list, in one line.",
          starter: `items = [1, 1, 2, 3]
distinct = `,
          rules: {
            regex: ["list\\s*\\(\\s*set\\s*\\(\\s*items\\s*\\)\\s*\\)"],
            hint: "list(set(items)) — into a set to drop the duplicates, back to a list.",
            success:
              "Correct, with one caveat: the order is lost. When you need the duplicates gone AND the original order kept, list(dict.fromkeys(items)) does both, because dicts remember insertion order.",
          },
          solution: `items = [1, 1, 2, 3]
distinct = list(set(items))`,
        },

        java: {
          body: [
            "A HashSet. It is a HashMap with the values thrown away — it stores keys and answers one question instantly: is this in here?",
            "`new HashSet<>(list)` gives you the distinct values in one call. `contains(x)` tests membership without searching.",
            "`add` returns a boolean saying whether it actually added anything, which is often the answer you wanted: `if (seen.add(x)) { /* first time */ }`.",
            "Java gives you three. `HashSet` is fast and unordered. `LinkedHashSet` keeps insertion order. `TreeSet` keeps everything sorted and can answer 'what is the next value above this one'.",
            "The same boxing rule applies as for maps: a set holds objects, not primitives, so it is `Set<Integer>` and never `Set<int>`.",
            "And the same equals/hashCode rule: if you put your own class into a set, override both. Override neither and two objects with identical fields will both be stored, because the default comparison is identity rather than contents.",
            "That last point is the single most common surprise with Java sets — a `record` gets both for free, which is one more reason to reach for one.",
          ],
          predict: {
            ask: "What does this Java code print?",
            code: `class P { int x; P(int x) { this.x = x; } }

Set<P> s = new HashSet<>();
s.add(new P(1));
s.add(new P(1));

System.out.println(s.size());`,
            choices: [
              { text: "1", why: "P does not override equals or hashCode, so the two objects are considered different despite holding the same value." },
              { text: "2", why: "Correct. Without equals and hashCode, Java compares by identity — two separately created objects are never equal, so both are stored." },
              { text: "It will not compile", why: "Any object can go into a HashSet. The compiler has no way to require equals and hashCode." },
              { text: "It throws at run time", why: "There is no error. The set works exactly as documented; it is the default notion of equality that surprises people." },
            ],
            answer: 1,
          },
          example: `Set<String> seen = new HashSet<>();          // fast, no order
Set<String> ordered = new LinkedHashSet<>(); // insertion order
Set<String> sorted = new TreeSet<>();        // always sorted

seen.add("cat");
seen.add("cat");            // ignored. Size stays 1

// add REPORTS whether it was new
if (seen.add("dog")) System.out.println("first time");

System.out.println(seen.contains("cat"));
System.out.println(seen.size());
seen.remove("cat");

// distinct values in one call
Set<Integer> distinct = new HashSet<>(list);

// set maths, in place
Set<String> a = new HashSet<>(List.of("x", "y"));
a.retainAll(other);         // keep only what is in both
a.addAll(other);            // union
a.removeAll(other);         // difference

// a record gets equals and hashCode for free — use one as a key
record Point(int x, int y) {}
Set<Point> points = new HashSet<>();
points.add(new Point(1, 2));
points.add(new Point(1, 2));     // ignored. Size 1`,
          notes: [
            { token: "seen.add(x)", meaning: "returns true only when it was genuinely new" },
            { token: "TreeSet", meaning: "sorted, and can find the next value above one" },
            { token: "equals + hashCode", meaning: "required for your own classes. Override both or neither works" },
            { token: "record", meaning: "gets both for free. The easy way to make a key type" },
          ],
          prompt:
            "Print each item the first time it appears and skip repeats — using what add tells you.",
          starter: `Set<String> seen = new HashSet<>();

for (String s : items) {
  if () {
    System.out.println(s);
  }
}`,
          rules: {
            regex: ["seen\\.add\\s*\\(\\s*s\\s*\\)", "if\\s*\\(\\s*seen\\.add"],
            mustNot: ["seen.contains(s)"],
            hint: "if (seen.add(s)) — add returns true only when the item was not already there.",
            success:
              "Correct. contains-then-add would hash the item twice and needs a negation; add alone does both jobs in one call and reads better.",
          },
          solution: `Set<String> seen = new HashSet<>();

for (String s : items) {
  if (seen.add(s)) {
    System.out.println(s);
  }
}`,
        },

        javascript: {
          body: [
            "A Set. It is a Map with the values thrown away — it stores keys and answers one question instantly: is this in here?",
            "`new Set(array)` gives you the distinct values in one call, and `[...new Set(array)]` turns them back into an array. That one line is the standard way to remove duplicates in JavaScript.",
            "`set.has(x)` is the membership test, `set.add(x)` inserts, and adding a duplicate quietly does nothing.",
            "A Set keeps insertion order when you loop over it, which is a real advantage over Python and Java's hashed sets — deduplicating an array does not scramble it.",
            "The comparison it uses is roughly `===` with one adjustment: NaN counts as equal to itself, so a Set holds only one NaN even though `NaN === NaN` is false.",
            "The important limit: objects are compared by identity. `new Set([{a: 1}, {a: 1}])` has size 2, because those are two different objects that happen to look alike. To deduplicate objects by content, key them by something — a JSON string, or an id.",
            "As with everything else here, the speed matters: `arr.includes(x)` walks the array, `set.has(x)` does not. Inside a loop that is the difference between quadratic and linear.",
          ],
          predict: {
            ask: "What does this print?",
            code: `const s = new Set([1, 1, "1", NaN, NaN]);

console.log(s.size);
console.log(new Set([{a:1}, {a:1}]).size);`,
            choices: [
              { text: "4 and 1", why: "Two separately created objects are different, so the second set holds both — its size is 2." },
              { text: "4 and 2", why: "Correct. The first set holds 1, \"1\" and NaN — the duplicate 1 and the second NaN are dropped, and the number 1 and string \"1\" stay separate. The two object literals are distinct objects, so both are kept." },
              { text: "3 and 2", why: "The number 1 and the string \"1\" are not equal under ===, so both are stored, giving 4." },
              { text: "5 and 2", why: "The repeated 1 is dropped, and so is the second NaN — a Set treats NaN as equal to itself even though === does not." },
            ],
            answer: 1,
          },
          example: `const seen = new Set();

seen.add("cat");
seen.add("cat");            // ignored. Size stays 1

console.log(seen.has("cat"));
console.log(seen.size);
seen.delete("cat");

// THE way to remove duplicates. Order is kept
const distinct = [...new Set([1, 1, 2, 3])];      // [1, 2, 3]

for (const x of seen) console.log(x);   // insertion order

// objects are compared by IDENTITY, not contents
new Set([{a: 1}, {a: 1}]).size;         // 2, not 1

// so key them by something instead
const byId = new Map(users.map(u => [u.id, u]));
const uniqueUsers = [...byId.values()];

// the speed that matters
// arr.includes(x)  walks it.  set.has(x)  does not.`,
          notes: [
            { token: "[...new Set(arr)]", meaning: "remove duplicates, keep order. One line" },
            { token: "set.has(x)", meaning: "instant. arr.includes(x) walks the array" },
            { token: "objects in a Set", meaning: "compared by identity. Two lookalikes are both kept" },
            { token: "NaN", meaning: "a Set keeps one, even though NaN === NaN is false" },
          ],
          prompt:
            "Remove the duplicates from items and get an array back, in one expression.",
          starter: `const items = [1, 1, 2, 3];
const distinct = ;`,
          rules: {
            regex: ["\\[\\s*\\.\\.\\.\\s*new\\s+Set\\s*\\(\\s*items\\s*\\)\\s*\\]|Array\\.from\\s*\\(\\s*new\\s+Set\\s*\\(\\s*items\\s*\\)\\s*\\)"],
            hint: "[...new Set(items)] — into a Set to drop duplicates, spread back into an array.",
            success:
              "Correct, and unlike Python's list(set(items)) the order survives: a JavaScript Set iterates in insertion order, so distinct comes out in the order the values first appeared.",
          },
          solution: `const items = [1, 1, 2, 3];
const distinct = [...new Set(items)];`,
        },

        rust: {
          body: [
            "A HashSet. It is a HashMap with the values thrown away — it stores keys and answers one question instantly: is this in here?",
            "`use std::collections::HashSet;` brings it in. `HashSet<i32>` for speed, `BTreeSet<i32>` when you want everything sorted.",
            "`insert` returns a bool saying whether it actually inserted, exactly like Java's add — so `if seen.insert(x) { }` both records and tests in one call.",
            "`contains(&x)` is the membership test, and note the `&`: you are lending the value to be compared, not handing it over.",
            "Rust's sets do the mathematical operations as iterators: `a.intersection(&b)`, `a.union(&b)`, `a.difference(&b)`. They are lazy, so you finish with `.collect()` or a `for` loop.",
            "To deduplicate a Vec: `let distinct: HashSet<_> = v.into_iter().collect();` and back with `.into_iter().collect::<Vec<_>>()` — order lost, as with any hashed set.",
            "For your own types, `#[derive(Hash, Eq, PartialEq)]` gives you what a set needs. Rust will not let you insert a type that lacks them — it is a compile error rather than Java's silent duplicate.",
          ],
          predict: {
            ask: "What happens with this Rust code?",
            code: `use std::collections::HashSet;

struct P { x: i32 }

let mut s: HashSet<P> = HashSet::new();
s.insert(P { x: 1 });`,
            choices: [
              { text: "It compiles, and the set holds one item", why: "P has no Hash or Eq implementation, so a HashSet cannot store it at all." },
              { text: "It does not compile: P does not implement Hash and Eq", why: "Correct. Rust requires the trait bounds at compile time. Adding #[derive(Hash, Eq, PartialEq)] to P fixes it — and the same mistake in Java compiles and silently stores duplicates." },
              { text: "It compiles but panics at run time", why: "The requirement is checked by the compiler, so this never reaches run time." },
              { text: "It compiles with a warning", why: "A missing trait bound is a hard error in Rust, not a warning." },
            ],
            answer: 1,
          },
          example: `use std::collections::{HashSet, BTreeSet};

let mut seen: HashSet<&str> = HashSet::new();

seen.insert("cat");
seen.insert("cat");         // ignored. Returns false

// insert REPORTS whether it was new
if seen.insert("dog") { println!("first time"); }

println!("{}", seen.contains("cat"));    // note: borrowed
println!("{}", seen.len());
seen.remove("cat");

// distinct values out of a Vec
let v = vec![1, 1, 2, 3];
let distinct: HashSet<i32> = v.into_iter().collect();
let mut back: Vec<i32> = distinct.into_iter().collect();
back.sort();                // hashed sets have no order

// set maths — lazy iterators, so collect at the end
let a: HashSet<i32> = [1, 2, 3].into_iter().collect();
let b: HashSet<i32> = [3, 4].into_iter().collect();
let both: Vec<_> = a.intersection(&b).collect();

// your own type needs these, and the compiler insists
#[derive(Hash, Eq, PartialEq)]
struct Point { x: i32, y: i32 }

let sorted: BTreeSet<i32> = BTreeSet::new();   // always in order`,
          notes: [
            { token: "seen.insert(x)", meaning: "returns true only when it was genuinely new" },
            { token: "contains(&x)", meaning: "borrowed. You are lending it to be compared" },
            { token: "intersection / union", meaning: "lazy iterators. Finish with collect()" },
            { token: "#[derive(Hash, Eq, PartialEq)]", meaning: "required. A compile error without it" },
          ],
          prompt:
            "Print each item the first time it appears and skip repeats — using what insert tells you.",
          starter: `use std::collections::HashSet;

let mut seen: HashSet<i32> = HashSet::new();

for x in items {
    if  {
        println!("{}", x);
    }
}`,
          rules: {
            regex: ["if\\s+seen\\.insert\\s*\\(\\s*x\\s*\\)"],
            mustNot: ["seen.contains"],
            hint: "if seen.insert(x) — insert returns true only when the value was not already there.",
            success:
              "Correct, and Rust needs no brackets around an if condition — writing `if (seen.insert(x))` compiles but the compiler warns you the parentheses are unnecessary.",
          },
          solution: `use std::collections::HashSet;

let mut seen: HashSet<i32> = HashSet::new();

for x in items {
    if seen.insert(x) {
        println!("{}", x);
    }
}`,
        },
      },
    },

    /* --------------------------------------------------------- choose -- */
    {
      id: "choose",
      kicker: "03",
      title: "Choosing the right one",
      hook:
        "Your program is slow. The profiler points at a loop that searches a list. What is the fix, and why is it almost always the same fix?",
      body: [
        "Replace the list with a map or a set. Searching a list of n items takes n steps; a map takes about one. Inside another loop, that is the difference between n squared and n.",
        "That one swap is the most common real performance fix there is, and it is worth being able to spot on sight.",
        "The choosing rule is short: ask how you will LOOK THINGS UP.",
        "By position, in order? A list. By a name or an id? A map. Just 'is it there'? A set. Adding at one end and taking from the other? A deque.",
        "There is a second question underneath: do you need the items in order? A hashed map or set is faster and gives you no useful order. A tree-based one keeps everything sorted and costs a little more per operation.",
        "And the costs are not opinions. Reaching a list item by index is one step whatever the size. Inserting at the FRONT of a list moves every other item. Looking up a map key is about one step. Those three facts decide most container choices you will ever make.",
      ],
      predict: {
        ask: "Which version is faster for a large nums and a large lookups list?",
        code: `// A
for (int x : lookups)
  if (find(nums.begin(), nums.end(), x) != nums.end())
    hits++;

// B
unordered_set<int> s(nums.begin(), nums.end());
for (int x : lookups)
  if (s.count(x)) hits++;`,
        choices: [
          { text: "A — building the set in B costs extra", why: "The set is built once, and it then saves a full scan on every one of the lookups. The build pays for itself almost immediately." },
          { text: "B, by a lot", why: "Correct. A scans nums for every lookup — that is lookups times nums steps. B builds the set once and then does about one step per lookup." },
          { text: "They are about the same", why: "They differ by a factor of the size of nums. With a million items each, that is roughly a million times more work in A." },
          { text: "A, because a vector is faster than a set", why: "A vector is faster to WALK, which is not what is happening here. Repeated searching is what a set exists for." },
        ],
        answer: 1,
      },
      viz: traceContainerCosts(),
      example: `// by position, in order
vector<int> v;

// by key
unordered_map<string,int> m;    // fast, no order
map<string,int> sortedMap;      // sorted keys, slightly slower

// is it there
unordered_set<int> s;
set<int> sortedSet;

// cheap at BOTH ends — a queue
deque<int> d;
d.push_front(1);
d.push_back(2);

// always hand me the biggest
priority_queue<int> pq;

// the costs that decide most choices
// v[i]              one step, any size
// find in v         up to n steps
// v.insert(begin)   moves every later item
// m[k]              about one step
// sortedMap[k]      about log n steps, and keys stay in order`,
      notes: [
        { token: "vector", meaning: "in order, by position. Walking it is fast" },
        { token: "unordered_map / map", meaning: "by key. Hashed is faster; the tree keeps order" },
        { token: "deque", meaning: "cheap at both ends. What a queue is built on" },
        { token: "priority_queue", meaning: "always hands you the biggest. The heap" },
      ],
      challenge: {
        prompt:
          "Rewrite the slow lookup: build a set from nums once, then test each lookup against it.",
        starter: `unordered_set<int> s();

for (int x : lookups)
  if (s) hits++;`,
        rules: {
          regex: ["unordered_set\\s*<\\s*int\\s*>\\s*s\\s*\\(\\s*nums\\.begin\\s*\\(\\s*\\)\\s*,\\s*nums\\.end\\s*\\(\\s*\\)\\s*\\)", "s\\.(count|contains)\\s*\\(\\s*x\\s*\\)"],
          hint: "unordered_set<int> s(nums.begin(), nums.end()); builds it in one go, then s.count(x) tests.",
          success:
            "Correct. Building the set costs one pass over nums, and it then removes a full scan from every single lookup — which is why this trade is nearly always worth making.",
        },
        solution: `unordered_set<int> s(nums.begin(), nums.end());

for (int x : lookups)
  if (s.count(x)) hits++;`,
      },

      alt: {
        c: {
          body: [
            "Replace the linear search with something better. Searching an array of n items takes n steps; a hash table takes about one, and a sorted array with `bsearch` takes about log n.",
            "In C you have to pick the machinery yourself, so the choice is more deliberate than elsewhere — and the three options cover almost everything.",
            "If the data does not change, SORT IT ONCE and use `bsearch`. Twenty steps to find something among a million, no extra memory, and about four lines of code.",
            "If the keys are small integers, an ARRAY OF FLAGS beats everything. One memory access, no hashing, no comparisons.",
            "If neither fits, build or borrow a hash table. uthash is a single header file and turns any struct into a hash map with a few macros.",
            "The costs that decide it are the same in every language: reaching arr[i] is one step whatever the size, scanning for a value is up to n steps, and inserting in the middle moves everything after it.",
            "And one C-specific cost worth adding: every malloc has real overhead. Allocating a million small nodes is slower than allocating one block and carving it up yourself.",
          ],
          predict: {
            ask: "nums is sorted and has a million items. How many comparisons does bsearch need in the worst case?",
            code: `qsort(nums, 1000000, sizeof(int), cmp);
int *found = bsearch(&key, nums, 1000000, sizeof(int), cmp);`,
            choices: [
              { text: "About a million", why: "That is a linear scan. Binary search halves the remaining range every single step." },
              { text: "About 20", why: "Correct. Each comparison halves what is left, and two to the twentieth is just over a million — so twenty steps is enough to search a million items." },
              { text: "Exactly 1", why: "That is a hash table, which computes the location directly. Binary search still has to narrow down, just very quickly." },
              { text: "About a thousand", why: "That would be the square root, which is what you get from some other methods. Halving gives the logarithm — about 20." },
            ],
            answer: 1,
          },
          example: `/* option 1 — sort once, then find by halving */
qsort(nums, len, sizeof(int), cmp);
int *found = bsearch(&key, nums, len, sizeof(int), cmp);
if (found) printf("at %ld", found - nums);

/* option 2 — flags, when the keys are small integers */
char seen[1000] = {0};
seen[x] = 1;              /* one memory access. Nothing beats it */

/* option 3 — a hash table, from a library or by hand */

/* the costs that decide it */
/* arr[i]                one step, any size            */
/* scan for a value      up to n steps                 */
/* bsearch on sorted     about log n steps             */
/* hash table lookup     about one step                */
/* insert in the middle  moves everything after it     */
/* malloc                real overhead, per call       */`,
          notes: [
            { token: "qsort then bsearch", meaning: "sort once, then about log n per lookup" },
            { token: "a flag array", meaning: "one memory access. Unbeatable for small integer keys" },
            { token: "found - nums", meaning: "pointer difference gives you the index" },
            { token: "malloc overhead", meaning: "one block carved up beats a million small calls" },
          ],
          prompt:
            "Search the sorted array with bsearch, and print the index when it is found.",
          starter: `qsort(nums, len, sizeof(int), cmp);

int *found = (&key, nums, len, sizeof(int), cmp);
if (found) printf("%ld", );`,
          rules: {
            regex: ["bsearch\\s*\\(\\s*&key\\s*,\\s*nums\\s*,\\s*len\\s*,\\s*sizeof\\s*\\(\\s*int\\s*\\)\\s*,\\s*cmp\\s*\\)", "found\\s*-\\s*nums"],
            hint: "bsearch takes the same arguments as qsort plus the key. Subtracting nums from the returned pointer gives the index.",
            success:
              "Correct. bsearch returns a POINTER to the item or NULL, not an index — subtracting the array start is how you get the position, and that trick works for any pointer into an array.",
          },
          solution: `qsort(nums, len, sizeof(int), cmp);

int *found = bsearch(&key, nums, len, sizeof(int), cmp);
if (found) printf("%ld", found - nums);`,
        },

        python: {
          body: [
            "Replace the list with a set or a dict. `x in a_list` walks the list; `x in a_set` does not. Inside another loop, that is the difference between waiting and not waiting.",
            "This is the single most common Python speed fix, and it usually changes one character of the code.",
            "The choosing rule is short: ask how you will look things up. By position, in order? A list. By key? A dict. Just 'is it there'? A set. Adding and removing at both ends? A deque.",
            "The standard library has a few more that save real code. `collections.Counter` counts things in one line. `defaultdict` removes the 'if the key is missing, start it at' dance. `heapq` gives you the smallest item repeatedly, which is what a priority queue is.",
            "A tuple is worth mentioning here too: it is a list that cannot change, which makes it hashable — so tuples can be dict keys and set items where lists cannot.",
            "One Python-specific cost to know: everything is an object, so a list of a million integers uses far more memory than a C array of a million ints. When that matters, `array.array` or numpy stores them packed.",
          ],
          predict: {
            ask: "Which version finishes noticeably faster when both lists are large?",
            code: `# A
hits = sum(1 for x in lookups if x in nums)

# B
s = set(nums)
hits = sum(1 for x in lookups if x in s)`,
            choices: [
              { text: "A — building the set costs extra", why: "The set is built once, and then saves a full scan of nums on every single lookup." },
              { text: "B, by a lot", why: "Correct. `x in nums` walks the list for every lookup, so A is lookups times nums steps. B builds the set once and then does about one step per lookup." },
              { text: "They are the same — `in` is `in`", why: "The word is the same and the work is not. On a list it scans; on a set it hashes and looks in one place." },
              { text: "A, because a list is a simpler object", why: "Simpler does not mean faster for this. Repeated membership testing is exactly what a set is for." },
            ],
            answer: 1,
          },
          example: `# by position, in order
items = [1, 2, 3]

# by key
ages = {"ada": 36}

# is it there
seen = {1, 2, 3}

# cheap at BOTH ends
from collections import deque
q = deque([1, 2, 3])
q.appendleft(0)
q.popleft()

# the ones that save the most code
from collections import Counter, defaultdict
counts = Counter(words)          # counting, in one line
counts.most_common(3)
groups = defaultdict(list)       # a missing key starts as []
groups[k].append(v)

import heapq                     # always hand me the smallest
heapq.heappush(h, 3)
smallest = heapq.heappop(h)

# the costs that decide most choices
# items[i]        one step, any size
# x in items      up to n steps
# items.insert(0, x)  moves everything along
# ages[k]         about one step
# x in seen       about one step`,
          notes: [
            { token: "x in a_list vs x in a_set", meaning: "walks it, versus does not. The usual fix" },
            { token: "deque", meaning: "cheap at both ends. A list is only cheap at the back" },
            { token: "Counter / defaultdict", meaning: "counting and grouping, without the boilerplate" },
            { token: "heapq", meaning: "the smallest item, repeatedly. A priority queue" },
          ],
          prompt:
            "Fix the slow lookup: build a set from nums once, then test against it.",
          starter: `s = 
hits = sum(1 for x in lookups if x in )`,
          rules: {
            regex: ["s\\s*=\\s*set\\s*\\(\\s*nums\\s*\\)", "if\\s+x\\s+in\\s+s"],
            hint: "s = set(nums) once, then test `x in s` rather than `x in nums`.",
            success:
              "Correct. The list is still there and still useful for order — the set is a lookup index built alongside it, which is exactly how databases think about the same problem.",
          },
          solution: `s = set(nums)
hits = sum(1 for x in lookups if x in s)`,
        },

        java: {
          body: [
            "Replace the list with a HashSet or HashMap. `list.contains(x)` walks the list; `set.contains(x)` does not. Inside another loop, that is the difference between n squared and n.",
            "The choosing rule is short: ask how you will look things up. By position? `ArrayList`. By key? `HashMap`. Just 'is it there'? `HashSet`. At both ends? `ArrayDeque`.",
            "Java's habit of declaring the INTERFACE and creating the class — `List<String> x = new ArrayList<>()` — pays off here: swapping ArrayList for LinkedList later touches one line.",
            "`ArrayDeque` is the one people miss. It is the right choice for both a stack and a queue, and it is faster than the older `Stack` and `LinkedList` for both jobs. `Stack` is a legacy class and is synchronised for no reason you want.",
            "`PriorityQueue` hands you the smallest item repeatedly, which is what you need for scheduling and for several graph algorithms.",
            "And there is a Java-specific cost worth knowing: a `List<Integer>` boxes every number into an object. A million-element `int[]` is 4MB; a million-element `List<Integer>` is closer to 20MB and much slower to walk.",
          ],
          predict: {
            ask: "Which is the right choice for a stack in modern Java?",
            code: `Stack<Integer> a = new Stack<>();
LinkedList<Integer> b = new LinkedList<>();
Deque<Integer> c = new ArrayDeque<>();`,
            choices: [
              { text: "Stack — it is named for the job", why: "Stack is a legacy class from Java 1.0. It is synchronised, which costs speed, and it extends Vector so it exposes methods a stack should not have." },
              { text: "ArrayDeque", why: "Correct. ArrayDeque is the recommended choice for both stacks and queues — faster than Stack and LinkedList, and its push/pop/peek do exactly what you want." },
              { text: "LinkedList — it is cheap at both ends", why: "It is cheap at both ends and it allocates a node per item, which makes it slower in practice than ArrayDeque's single array." },
              { text: "Any of them — they perform the same", why: "They differ measurably. ArrayDeque uses one array with no per-item objects and no synchronisation." },
            ],
            answer: 1,
          },
          example: `// by position, in order
List<Integer> list = new ArrayList<>();

// by key
Map<String,Integer> map = new HashMap<>();     // fast, no order
Map<String,Integer> tree = new TreeMap<>();    // keys sorted

// is it there
Set<Integer> set = new HashSet<>();

// both ends — use this for a stack AND a queue
Deque<Integer> stack = new ArrayDeque<>();
stack.push(1); stack.pop(); stack.peek();
Deque<Integer> queue = new ArrayDeque<>();
queue.offer(1); queue.poll();

// always hand me the smallest
PriorityQueue<Integer> pq = new PriorityQueue<>();

// the costs that decide most choices
// list.get(i)          one step
// list.contains(x)     up to n steps
// list.add(0, x)       moves everything along
// map.get(k)           about one step
// set.contains(x)      about one step

// and a Java-specific one:
// int[] a million       about 4MB
// List<Integer> same    about 20MB, and slower to walk`,
          notes: [
            { token: "ArrayDeque", meaning: "the modern stack AND queue. Not Stack, not LinkedList" },
            { token: "list.contains(x)", meaning: "walks the list. set.contains(x) does not" },
            { token: "PriorityQueue", meaning: "hands you the smallest, repeatedly" },
            { token: "List<Integer>", meaning: "boxes every number. int[] is far smaller and faster" },
          ],
          prompt:
            "Declare a stack the modern way — the interface on the left, the recommended implementation on the right.",
          starter: `<Integer> stack = new <>();
stack.push(1);`,
          rules: {
            regex: ["Deque\\s*<\\s*Integer\\s*>\\s*stack\\s*=\\s*new\\s+ArrayDeque\\s*<\\s*>\\s*\\(\\s*\\)"],
            mustNot: ["new Stack<>()"],
            hint: "Deque<Integer> stack = new ArrayDeque<>(); — Deque is the interface, ArrayDeque the implementation.",
            success:
              "Correct. Declaring it as Deque rather than ArrayDeque means the rest of the code depends only on the behaviour, so swapping the implementation later is one line.",
          },
          solution: `Deque<Integer> stack = new ArrayDeque<>();
stack.push(1);`,
        },

        javascript: {
          body: [
            "Replace the array with a Set or a Map. `arr.includes(x)` walks the array; `set.has(x)` does not. Inside another loop, that is the difference between n squared and n.",
            "The choosing rule is short: ask how you will look things up. By position, in order? An array. By key? A Map — or a plain object when the keys are fixed and written in the source. Just 'is it there'? A Set.",
            "JavaScript has no deque, no heap and no sorted map in the standard library. An array with `push`/`pop` is a fine stack; a queue built from `push`/`shift` is quietly slow on large data because `shift` moves everything.",
            "For a real queue, keep an array and a head index, and move the index instead of shifting. For a priority queue, you write a small heap or take one from npm.",
            "The plain object versus Map choice comes up constantly. Use `{}` for a fixed set of named fields. Use `Map` when keys arrive at run time, when they are not strings, or when you add and delete a lot — Map is built for that and objects are not.",
            "One thing specific to JavaScript: arrays are objects underneath, so an array with holes or non-integer keys quietly falls off the fast path. Keep arrays dense and integer-indexed and the engine keeps them fast.",
          ],
          predict: {
            ask: "Why is this queue slow when items is large?",
            code: `const queue = [...items];

while (queue.length) {
  const next = queue.shift();
  handle(next);
}`,
            choices: [
              { text: "shift moves every remaining item along each time", why: "Correct. shift takes from the FRONT, so every other item slides down one position — making the whole loop quadratic. Use an index that moves forward instead." },
              { text: "The spread copy is the expensive part", why: "The copy is one pass and happens once. The cost is in the loop, where every shift moves the rest of the array." },
              { text: "while (queue.length) re-checks the length each time", why: "Reading .length is a single cheap lookup. The problem is what shift does to the array." },
              { text: "It is not slow — shift is a constant-time operation", why: "shift is linear in the length of the array, because everything after the removed item has to move down." },
            ],
            answer: 0,
          },
          example: `// by position, in order
const list = [1, 2, 3];

// by key
const fixed = { name: "Ada" };     // fields you write in the source
const dynamic = new Map();          // keys arriving at run time

// is it there
const seen = new Set();

// a stack — push/pop, both cheap
const stack = [];
stack.push(1);
stack.pop();

// a queue — shift is SLOW on big arrays. Use an index instead
let head = 0;
const q = [...items];
while (head < q.length) handle(q[head++]);

// no deque, no heap, no sorted map in the standard library

// the costs that decide most choices
// list[i]           one step
// list.includes(x)  up to n steps
// list.unshift(x)   moves everything along
// map.get(k)        about one step
// set.has(x)        about one step`,
          notes: [
            { token: "arr.includes(x)", meaning: "walks the array. set.has(x) does not" },
            { token: "shift / unshift", meaning: "move every item. Fine for ten, slow for a million" },
            { token: "a queue by index", meaning: "move head forward instead of shifting" },
            { token: "{} vs Map", meaning: "fixed named fields, versus keys arriving at run time" },
          ],
          prompt:
            "Fix the slow queue: walk it with a moving index instead of shifting from the front.",
          starter: `let head = 0;
const q = [...items];

while (head  q.length) {
  handle(q[]);
}`,
          rules: {
            regex: ["head\\s*<\\s*q\\.length", "q\\s*\\[\\s*head\\s*\\+\\+\\s*\\]|q\\s*\\[\\s*head\\s*\\]"],
            mustNot: ["q.shift()"],
            hint: "while (head < q.length) and read q[head++] — the array never changes, only the index moves.",
            success:
              "Correct. The array keeps growing at the back and the head crawls forward, so nothing is ever moved — that is exactly what a deque does internally in the languages that ship one.",
          },
          solution: `let head = 0;
const q = [...items];

while (head < q.length) {
  handle(q[head++]);
}`,
        },

        rust: {
          body: [
            "Replace the Vec with a HashSet or HashMap. `v.contains(&x)` walks the vector; `set.contains(&x)` does not. Inside another loop, that is the difference between n squared and n.",
            "The choosing rule is short: ask how you will look things up. By position, in order? `Vec`. By key? `HashMap`, or `BTreeMap` when you need the keys sorted. Just 'is it there'? `HashSet` or `BTreeSet`. Both ends? `VecDeque`. Always the biggest? `BinaryHeap`.",
            "Rust's standard collections are unusually complete for a systems language — everything above ships in `std::collections`, with no external crate needed.",
            "`BinaryHeap` is a MAX heap, so it hands you the biggest. For the smallest, wrap items in `std::cmp::Reverse`, which is a small trick worth remembering because it comes up in every graph algorithm.",
            "One thing Rust adds that the others do not: the compiler stops you holding a reference into a collection while modifying it. The loop that mutates a list while iterating it — a bug in all five other languages — does not compile here.",
            "And a Rust-specific cost: the default hasher is chosen for resistance to deliberate collision attacks rather than raw speed. For hot code with trusted keys, swapping in a faster hasher from a crate is a real and easy win.",
          ],
          predict: {
            ask: "BinaryHeap hands you the largest item. How do you get the smallest instead?",
            code: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

let mut h = BinaryHeap::new();
h.push(3);
h.push(1);

println!("{:?}", h.pop());`,
            choices: [
              { text: "It already gives the smallest — Some(1)", why: "BinaryHeap is a MAX heap. pop returns the largest item, which is 3 here." },
              { text: "Push Reverse(x) instead, and pop gives the smallest", why: "Correct. As written this prints Some(3). Wrapping values in Reverse flips the comparison, so the heap's 'largest' becomes your smallest — the standard trick for a min-heap in Rust." },
              { text: "Use a BTreeSet instead — a heap cannot do it", why: "Reverse handles it in one wrapper, and a heap is the right structure when you only ever want the extreme item." },
              { text: "Call h.pop_min()", why: "There is no pop_min. Reverse is the intended way to turn the max heap into a min heap." },
            ],
            answer: 1,
          },
          example: `use std::collections::{HashMap, HashSet, BTreeMap, VecDeque, BinaryHeap};
use std::cmp::Reverse;

let v: Vec<i32> = Vec::new();              // by position, in order
let m: HashMap<&str, i32> = HashMap::new();// by key, no order
let t: BTreeMap<&str, i32> = BTreeMap::new();  // by key, sorted
let s: HashSet<i32> = HashSet::new();      // is it there

let mut d: VecDeque<i32> = VecDeque::new();// both ends
d.push_front(1);
d.push_back(2);
d.pop_front();

let mut h = BinaryHeap::new();             // hands you the LARGEST
h.push(3);
h.pop();                                   // Some(3)

let mut minh = BinaryHeap::new();          // the smallest, via Reverse
minh.push(Reverse(3));
minh.push(Reverse(1));
if let Some(Reverse(x)) = minh.pop() { }   // 1

// the costs that decide most choices
// v[i]              one step
// v.contains(&x)    up to n steps
// v.insert(0, x)    moves everything along
// m.get(&k)         about one step
// t.get(&k)         about log n, and keys stay sorted`,
          notes: [
            { token: "VecDeque", meaning: "cheap at both ends. Vec is only cheap at the back" },
            { token: "BinaryHeap", meaning: "a MAX heap. Hands you the largest" },
            { token: "Reverse(x)", meaning: "flips the comparison. How you get a min heap" },
            { token: "BTreeMap", meaning: "sorted keys, and range queries. A little slower than HashMap" },
          ],
          prompt:
            "Make a min-heap: push the values wrapped so that popping gives the smallest first.",
          starter: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

let mut h = BinaryHeap::new();
h.push(3);
h.push(1);`,
          rules: {
            regex: ["h\\.push\\s*\\(\\s*Reverse\\s*\\(\\s*3\\s*\\)\\s*\\)", "h\\.push\\s*\\(\\s*Reverse\\s*\\(\\s*1\\s*\\)\\s*\\)"],
            hint: "Wrap each value: h.push(Reverse(3)); and h.push(Reverse(1));",
            success:
              "Correct. Reverse costs nothing at run time — it is a wrapper that only changes which way the comparison goes, and the compiler removes it entirely.",
          },
          solution: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

let mut h = BinaryHeap::new();
h.push(Reverse(3));
h.push(Reverse(1));`,
        },
      },
    },
  ],
};
