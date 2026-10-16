import type { TopicLesson } from "@/lib/dsa/lessons/types";
import {
  traceBitmaskSubsets,
  traceBitOps,
  traceHashTable,
  traceLps,
  traceTrie,
  traceTwoSumHash,
  traceXorUnique,
} from "@/lib/dsa/viz/traceStructures";

export const HASHING: TopicLesson = {
  id: "hashing",
  title: "Hashing",
  tagline: "Trade memory for speed and make 'have I seen this?' instant.",
  why:
    "Hashing is the single most common way to delete a nested loop. Any time an inner loop is searching for something an outer loop already knows about, a hash map replaces that search with a lookup. It is the difference between O(n²) and O(n) in dozens of standard problems.",
  plain: [
    "A hash function turns a key into a number, and that number is used as an array index.",
    "So instead of searching for a key, you compute where it must be and go straight there.",
    "Two different keys can land on the same index. That is a collision, and it is handled by hanging both on the same hook and comparing the few that share it.",
    "The result is O(1) on average for insert, lookup and delete — as long as the table has enough room and the hash spreads keys evenly.",
  ],
  needs: ["Arrays and the modulo operator.", "The idea of turning data into an index, from the letter-counting section."],
  costs: [
    { what: "unordered_map insert / find", time: "O(1) average", note: "O(n) in a crafted worst case." },
    { what: "map insert / find", time: "O(log n) always", note: "A balanced tree — also keeps keys sorted." },
    { what: "unordered_set count", time: "O(1) average", note: "Use when you only care about membership." },
    { what: "Counting with an array", time: "O(1) exactly", note: "When keys are small integers, skip the map entirely." },
  ],
  traps: [
    "Writing if (m[key] == ...) on an unordered_map inserts key with a default value if it was missing. Use m.count(key) or m.find(key) to check without inserting.",
    "unordered_map can be attacked with crafted keys and degrade to O(n) per operation. In competitive settings use map, or add a random seed to your hash.",
    "Iterating an unordered_map gives no useful order. If you need sorted keys, use map.",
    "For small integer keys, a plain array is faster than any hash map and never collides. Do not reach for a map out of habit.",
  ],
  sections: [
    {
      id: "table",
      kicker: "01",
      title: "How a hash table actually works",
      hook:
        "You have ten thousand names and need to know instantly whether one is on the list. Searching is O(n) and sorting then binary searching is O(log n). How do you get to one step?",
      body: [
        "Make an array of buckets. Run the key through a hash function that produces a bucket number — for integers, key % numberOfBuckets is enough to see the idea.",
        "To insert, compute the bucket and drop the key in. To look up, compute the same bucket and check only there.",
        "You never touch the other buckets. That is where O(1) comes from: the number of items does not change how much you look at.",
        "Two keys can hash to the same bucket. That is a collision, and the usual fix is chaining — the bucket holds a small list, and you compare against the few items in it.",
        "The load factor is items divided by buckets. Keep it low and chains stay short. Real hash maps grow the table automatically when it rises too high.",
        "So hashing buys speed with memory: you deliberately keep empty buckets around so that collisions stay rare.",
      ],
      viz: traceHashTable([15, 11, 27, 8, 12], 5),
      example: `unordered_map<string, int> ages;
ages["ravi"] = 21;
ages["meera"] = 24;

if (ages.count("ravi"))        // check WITHOUT inserting
  cout << ages["ravi"];

unordered_set<int> seen;       // membership only
seen.insert(5);
if (seen.count(5)) cout << "yes";`,
      notes: [
        { token: "unordered_map", meaning: "hash table — O(1) average, no ordering" },
        { token: ".count(key)", meaning: "checks without creating the key" },
        { token: "map[key]", meaning: "creates the key with a default value if missing" },
        { token: "unordered_set", meaning: "when you only care whether it exists" },
      ],
      challenge: {
        prompt:
          "Count how many distinct values an array contains, using a set.",
        starter: `unordered_set<int> seen;

for (int i = 0; i < n; i++) {
  ;
}

cout << ;`,
        rules: {
          regex: ["seen\\.insert\\s*\\(\\s*a\\[i\\]\\s*\\)", "seen\\.size\\s*\\(\\s*\\)"],
          hint: "Insert every value with seen.insert(a[i]). A set ignores repeats, so seen.size() is the count of distinct values.",
          success:
            "Correct. A set silently drops duplicates, which turns 'count the distinct values' into one insert per element and one size call.",
        },
        solution: `unordered_set<int> seen;

for (int i = 0; i < n; i++) {
  seen.insert(a[i]);
}

cout << seen.size();`,
      },
    },
    {
      id: "seen",
      kicker: "02",
      title: "Remember instead of searching again",
      hook:
        "Find two numbers adding to a target, in an unsorted array. Two pointers needs sorting. Checking every pair is O(n²). What can a single pass remember that makes the inner loop unnecessary?",
      body: [
        "At each element, you know exactly what its partner must be: target minus this element.",
        "So the real question is not 'is there a pair somewhere' but 'have I already walked past the partner I need'.",
        "Keep a map of every value seen so far, with its index. At each step, look up the partner. If it is there, you are done.",
        "If not, record the current value and move on. Every element is inserted once and looked up once, so the whole thing is O(n).",
        "This shape — check the map, then record into it — is the single most reusable hashing pattern. The order matters: look up first, so an element never matches itself.",
      ],
      viz: traceTwoSumHash([4, 7, 1, 9, 3], 10),
      example: `unordered_map<int, int> seen;

for (int i = 0; i < n; i++) {
  int need = target - a[i];
  if (seen.count(need)) return {seen[need], i};   // look up FIRST
  seen[a[i]] = i;                                 // then record
}`,
      notes: [
        { token: "target - a[i]", meaning: "the partner this element needs" },
        { token: "look up before recording", meaning: "stops an element pairing with itself" },
        { token: "seen[a[i]] = i", meaning: "store the index, not just the value" },
      ],
      challenge: {
        prompt:
          "Detect whether an array contains any duplicate, using a set and one pass. Return as soon as you find one.",
        starter: `unordered_set<int> seen;

for (int i = 0; i < n; i++) {
  if ( ) return true;
  ;
}
return false;`,
        rules: {
          regex: ["seen\\.count\\s*\\(\\s*a\\[i\\]\\s*\\)", "seen\\.insert\\s*\\(\\s*a\\[i\\]\\s*\\)"],
          hint: "Check seen.count(a[i]) before inserting. Insert after the check, or every element finds itself.",
          success:
            "Correct — the same check-then-record shape as two sum. Once you recognise it, a whole family of problems collapses into one pass.",
        },
        solution: `unordered_set<int> seen;

for (int i = 0; i < n; i++) {
  if (seen.count(a[i])) return true;
  seen.insert(a[i]);
}
return false;`,
      },
    },
  ],
};

export const BITS: TopicLesson = {
  id: "bits",
  title: "Bit Manipulation",
  tagline: "Numbers are rows of switches, and a set of 20 things is one integer.",
  why:
    "Bit tricks look like showing off until you meet the two problems that need them: finding the odd one out with no extra memory, and representing a subset of up to twenty items as a single number so it can be a key in a DP table. Bitmask DP is unreachable without this chapter.",
  plain: [
    "Every whole number is stored as a row of 0s and 1s. 13 is 1101, which is 8 + 4 + 1.",
    "Bit operators work on those rows column by column, comparing the two numbers position by position.",
    "& keeps a 1 only where both have one. | keeps a 1 where either has one. ^ (XOR) gives a 1 only where they differ.",
    "Shifting left by one adds a zero on the end, which doubles the number. Shifting right removes the last bit, halving it.",
  ],
  needs: ["Integers and loops.", "Binary counting is useful but the diagram will show you."],
  costs: [
    { what: "Any single bit operation", time: "O(1)", note: "One CPU instruction." },
    { what: "Counting set bits", time: "O(1)", note: "__builtin_popcount is a single instruction." },
    { what: "Looping over all subsets of n items", time: "O(2ⁿ)", note: "Usable to about n = 20." },
    { what: "Bitmask DP", time: "O(2ⁿ · n)", note: "n = 20 gives ~20 million — fine." },
  ],
  traps: [
    "& and | have lower precedence than == in C++. Write if ((x & 1) == 0), with the brackets, or it means something else entirely.",
    "Shifting an int left by 31 or more is undefined behaviour. Use 1LL << k when k can be 31 or larger.",
    "Right-shifting a negative number is implementation-defined. Stay with unsigned or non-negative values.",
    "x ^ x is 0 and x ^ 0 is x. Those two facts are the whole reason the XOR tricks work.",
  ],
  sections: [
    {
      id: "ops",
      kicker: "01",
      title: "The operators, seen as rows",
      hook:
        "Test whether a number is even without using %. Multiply by 2 without using ×. Both take one operator each — which part of the number are you actually looking at?",
      body: [
        "Write the number in binary and everything becomes visual. 12 is 1100 and 10 is 1010.",
        "AND, written &, gives 1 only where both rows have a 1. It is how you test or clear specific bits.",
        "OR, written |, gives 1 where either has one. It is how you set a bit.",
        "XOR, written ^, gives 1 only where the two rows disagree. Equal bits cancel to 0, which is why x ^ x is always 0.",
        "Left shift x << 1 pushes everything up a place and puts a 0 at the end — exactly multiplying by 2. Right shift x >> 1 divides by 2, rounding down.",
        "The last bit alone decides odd or even, so x & 1 answers 'is x odd' with a single instruction.",
      ],
      viz: traceBitOps(12, 10),
      example: `int x = 12;              // 1100

x & 1                    // 0 → even
x >> 1                   // 6  — halve
x << 1                   // 24 — double

// the three standard one-bit moves
x |  (1 << k)            // set bit k to 1
x & ~(1 << k)            // clear bit k to 0
(x >> k) & 1             // read bit k`,
      notes: [
        { token: "x & 1", meaning: "is the last bit 1 — that is, is x odd" },
        { token: "1 << k", meaning: "a number with only bit k set" },
        { token: "x | (1 << k)", meaning: "turn bit k on, leave the rest alone" },
        { token: "x & ~(1 << k)", meaning: "turn bit k off — ~ flips every bit" },
      ],
      challenge: {
        prompt:
          "Check whether a number is a power of two. Powers of two have exactly one bit set — and subtracting 1 from such a number flips every bit below it.",
        starter: `bool isPowerOfTwo(int n) {
  return n > 0 && ( ) == 0;
}`,
        rules: {
          regex: ["n\\s*&\\s*\\(\\s*n\\s*-\\s*1\\s*\\)"],
          hint:
            "n & (n - 1) clears the lowest set bit. If n had exactly one bit set, the result is 0. The n > 0 guard rules out zero.",
          success:
            "Correct. 8 is 1000 and 7 is 0111, so 8 & 7 is 0. For 12, which is 1100, 12 & 11 is 1000 — not zero, so not a power of two.",
        },
        solution: `bool isPowerOfTwo(int n) {
  return n > 0 && (n & (n - 1)) == 0;
}`,
      },
    },
    {
      id: "xor",
      kicker: "02",
      title: "XOR cancels pairs",
      hook:
        "Every number in an array appears twice except one. Find the lonely one using no extra memory at all — no map, no set, no sorting. One variable is enough.",
      body: [
        "Two facts do all the work. x ^ x is 0, and x ^ 0 is x.",
        "XOR is also order-independent, so you may combine the numbers in any order and get the same result.",
        "So XOR the whole array together. Every pair cancels itself to zero, no matter where the two copies sit, and only the unpaired number survives.",
        "That is O(n) time and O(1) memory — better than both the sorting and the hash-map solutions.",
        "The same idea finds a missing number: XOR every value from 1 to n together with every value present, and everything cancels except the one that is absent.",
      ],
      viz: traceXorUnique([4, 1, 2, 1, 2]),
      example: `int single(vector<int>& a) {
  int ans = 0;
  for (int x : a) ans ^= x;
  return ans;
}

// missing number from 1..n
int missing = 0;
for (int i = 1; i <= n; i++) missing ^= i;
for (int x : a)              missing ^= x;`,
      notes: [
        { token: "ans = 0", meaning: "0 is the identity — x ^ 0 is x" },
        { token: "ans ^= x", meaning: "pairs cancel wherever they are" },
        { token: "O(1) memory", meaning: "one int, no matter how large the array" },
      ],
      challenge: {
        prompt:
          "Find the single number that appears once when every other number appears twice. One loop, one variable.",
        starter: `int ans = ;

for (int x : a) {
  ;
}

return ans;`,
        rules: {
          mustNot: ["map", "set", "sort"],
          regex: ["ans\\s*=\\s*0", "ans\\s*\\^=\\s*x"],
          hint: "Start ans at 0 and write ans ^= x inside the loop.",
          success:
            "Correct. Notice it never mattered where the pairs were — XOR does not care about order, which is what makes one pass enough.",
        },
        solution: `int ans = 0;

for (int x : a) {
  ans ^= x;
}

return ans;`,
      },
    },
    {
      id: "subsets",
      kicker: "03",
      title: "A number is a set",
      hook:
        "List every subset of {a, b, c}. There are eight. Now notice that 0 through 7 in binary are 000 through 111 — exactly eight rows of three switches. What does that suggest?",
      body: [
        "Read a number's bits as in-or-out flags. For {a, b, c}, the number 5 is 101, meaning a is in, b is out, c is in.",
        "So counting from 0 to 2ⁿ − 1 enumerates every subset, once each, with no recursion at all.",
        "To test whether item i is in the subset represented by mask, use (mask >> i) & 1.",
        "This is why bitmask DP exists. A subset of up to twenty items fits in a single int, so it can be an array index in a DP table.",
        "The limit is real: 2²⁰ is about a million, which is fine, but 2³⁰ is a billion, which is not. When you see n ≤ 20 in a problem, this technique is being hinted at.",
      ],
      viz: traceBitmaskSubsets(["a", "b", "c"]),
      example: `int n = 3;                       // items 0, 1, 2

for (int mask = 0; mask < (1 << n); mask++) {
  cout << "{ ";
  for (int i = 0; i < n; i++)
    if ((mask >> i) & 1) cout << item[i] << " ";
  cout << "}" << endl;
}
// 1 << 3 is 8, so masks 0..7 — all eight subsets`,
      notes: [
        { token: "1 << n", meaning: "2ⁿ — the number of subsets" },
        { token: "(mask >> i) & 1", meaning: "is item i in this subset?" },
        { token: "__builtin_popcount(mask)", meaning: "how many items the subset holds" },
      ],
      challenge: {
        prompt:
          "Loop over every subset of n items and test whether item i belongs to the current one.",
        starter: `for (int mask = 0; mask < ; mask++) {
  for (int i = 0; i < n; i++) {
    if ( ) cout << item[i];
  }
}`,
        rules: {
          regex: ["\\(\\s*1\\s*<<\\s*n\\s*\\)", "\\(\\s*mask\\s*>>\\s*i\\s*\\)\\s*&\\s*1"],
          hint: "The gate is mask < (1 << n), and the membership test is (mask >> i) & 1.",
          success:
            "Correct. Those brackets are not optional: & binds more loosely than most people expect, so mask >> i & 1 without them can mean something different.",
        },
        solution: `for (int mask = 0; mask < (1 << n); mask++) {
  for (int i = 0; i < n; i++) {
    if ((mask >> i) & 1) cout << item[i];
  }
}`,
      },
    },
  ],
};

export const TRIE: TopicLesson = {
  id: "trie",
  title: "Trie",
  tagline: "A tree of letters, where shared beginnings share nodes.",
  why:
    "A hash map can tell you whether a word exists. It cannot tell you which words start with 'ca' without checking all of them. A trie answers prefix questions directly, which is why autocomplete, spell-checkers and IP routing tables are built on it.",
  plain: [
    "A trie stores words letter by letter down a tree. Each edge is one character.",
    "Words sharing a prefix share the path for that prefix — 'car' and 'card' walk the same first three nodes.",
    "A flag on a node marks 'a word ends here', which is how 'car' can be a stored word and also a prefix of 'card'.",
    "Looking up a word costs its own length, not the number of words stored.",
  ],
  needs: ["Trees and pointers.", "Recursion, for the insert and search walks."],
  costs: [
    { what: "Insert a word", time: "O(L)", note: "L is the word length. Independent of how many words exist." },
    { what: "Search a word", time: "O(L)", note: "Same walk as insert." },
    { what: "All words with a prefix", time: "O(L + matches)", note: "The reason tries beat hash maps." },
    { what: "Memory", time: "O(total letters × 26)", note: "The array-of-26 version is fast but hungry." },
  ],
  traps: [
    "Forgetting the isEnd flag means 'car' cannot be distinguished from a mere prefix of 'card'.",
    "26 child pointers per node is a lot of memory when words are sparse. A map<char, Node*> is smaller but slower.",
    "A binary trie over bits — not letters — is the standard tool for maximum-XOR-pair problems. Same structure, two children instead of 26.",
  ],
  sections: [
    {
      id: "build",
      kicker: "01",
      title: "Building the tree of letters",
      hook:
        "Store 'car', 'card' and 'cat'. All three begin with 'ca'. Storing that prefix three times is waste — how does the structure avoid it?",
      body: [
        "Start with an empty root that holds no letter. Every word is a path down from it.",
        "To insert, walk the word one letter at a time. If a child for that letter exists, follow it. If not, create it.",
        "So 'car' creates three nodes. 'card' then reuses all three and adds only one. 'cat' reuses two and adds one.",
        "Mark the last node of each word with isEnd. Without it, you cannot tell a stored word from a prefix that merely passes through.",
        "Searching is the same walk. A missing child means the word is not there — you never compare against any other word.",
        "Everything below a node shares that node's prefix. That is exactly what autocomplete needs: walk to the prefix, then collect the subtree.",
      ],
      viz: traceTrie(["car", "card", "cat"], "car"),
      example: `struct Node {
  Node* kid[26] = {nullptr};
  bool isEnd = false;
};

void insert(Node* root, const string& w) {
  Node* cur = root;
  for (char c : w) {
    int i = c - 'a';
    if (!cur->kid[i]) cur->kid[i] = new Node();
    cur = cur->kid[i];
  }
  cur->isEnd = true;
}

bool search(Node* root, const string& w) {
  Node* cur = root;
  for (char c : w) {
    cur = cur->kid[c - 'a'];
    if (!cur) return false;
  }
  return cur->isEnd;          // exists AND is a whole word
}`,
      notes: [
        { token: "kid[26]", meaning: "one slot per letter — index is c - 'a'" },
        { token: "isEnd", meaning: "distinguishes a word from a passing prefix" },
        { token: "return cur->isEnd", meaning: "for startsWith, return true here instead" },
      ],
      challenge: {
        prompt:
          "Write the insert walk: create the child if it does not exist, step into it, and mark the end of the word.",
        starter: `Node* cur = root;

for (char c : w) {
  int i = c - 'a';
  if (!cur->kid[i]) ;
  cur = ;
}
cur-> = true;`,
        rules: {
          regex: ["cur->kid\\[i\\]\\s*=\\s*new\\s+Node", "cur\\s*=\\s*cur->kid\\[i\\]", "cur->isEnd\\s*=\\s*true"],
          hint:
            "Create with cur->kid[i] = new Node(); step with cur = cur->kid[i]; and finish with cur->isEnd = true.",
          success:
            "Correct. Search is the identical walk with the creation removed — if a child is missing there, the word simply is not stored.",
        },
        solution: `Node* cur = root;

for (char c : w) {
  int i = c - 'a';
  if (!cur->kid[i]) cur->kid[i] = new Node();
  cur = cur->kid[i];
}
cur->isEnd = true;`,
      },
    },
  ],
};

export const STRING_MATCHING: TopicLesson = {
  id: "string-matching",
  title: "String Matching",
  tagline: "Find a pattern without ever re-reading the text.",
  why:
    "The obvious way to find a pattern in a text is to try it at every position, which is O(n·m). KMP does it in O(n + m) by noticing that a partial match already tells you something about the pattern itself. The idea — precompute a table so you never redo work — is the same idea behind dynamic programming.",
  plain: [
    "The naive method lines the pattern up at position 0, compares, then slides one place right and starts again from scratch.",
    "The waste is that after a partial match you already know several characters of the text, and you throw that knowledge away.",
    "KMP precomputes, for every prefix of the pattern, the longest piece that is both a prefix and a suffix of it.",
    "When a match breaks, that table says exactly how far you may slide without missing anything — and the text pointer never moves backwards.",
  ],
  needs: ["Strings and arrays.", "Comfort with two indexes moving independently."],
  costs: [
    { what: "Naive matching", time: "O(n·m)", note: "Fine for short patterns, fatal for long ones." },
    { what: "Build the LPS table", time: "O(m)", note: "One pass over the pattern." },
    { what: "KMP search", time: "O(n + m)", note: "The text pointer never rewinds." },
    { what: "Rabin–Karp", time: "O(n + m) average", note: "Rolling hash; easier to write, needs care with collisions." },
  ],
  traps: [
    "lps[0] is always 0 — a single character has no proper prefix that is also a suffix.",
    "On a mismatch, fall back with len = lps[len - 1] and do NOT advance i. Advancing i there skips valid matches.",
    "Rabin–Karp must verify a hash match by comparing the actual characters, or collisions cause false positives.",
  ],
  sections: [
    {
      id: "lps",
      kicker: "01",
      title: "The table that removes the rewinding",
      hook:
        "Searching for 'ABABC' in a text, you match 'ABAB' and then fail. The naive method restarts one character later. But you already know the last two matched characters were 'AB' — which is the pattern's own start. Why start over?",
      body: [
        "For each position i in the pattern, lps[i] is the length of the longest piece ending at i that is also a prefix of the pattern.",
        "For 'ABAB' that value is 2, because 'AB' appears at both the start and the end.",
        "So when a match fails after 4 characters, you do not slide by 1. You keep the 2 already matched and continue from there.",
        "Because the text pointer never moves backwards, the search costs one pass over the text: O(n + m) in total.",
        "The table is built with the pattern compared against itself, using the same fall-back rule — which is why the build loop looks confusingly like the search loop.",
        "If it feels slippery, that is normal. Step through the diagram twice: once watching where the matched run grows, and once watching what happens when it breaks.",
      ],
      viz: traceLps("ABABC"),
      example: `vector<int> buildLps(const string& p) {
  int m = p.size();
  vector<int> lps(m, 0);
  int len = 0;
  for (int i = 1; i < m; ) {
    if (p[i] == p[len])      lps[i++] = ++len;
    else if (len > 0)        len = lps[len - 1];   // fall back, do NOT i++
    else                     lps[i++] = 0;
  }
  return lps;
}`,
      notes: [
        { token: "lps[0] = 0", meaning: "one character has no proper prefix-suffix" },
        { token: "len = lps[len - 1]", meaning: "fall back to the next best prefix" },
        { token: "no i++ on fall-back", meaning: "re-test the same character against a shorter prefix" },
      ],
      challenge: {
        prompt:
          "Complete the LPS build. On a match, extend and record. On a mismatch with a run in progress, fall back without advancing i.",
        starter: `vector<int> lps(m, 0);
int len = 0;

for (int i = 1; i < m; ) {
  if (p[i] == p[len])   lps[i++] = ;
  else if (len > 0)     len = ;
  else                  lps[i++] = 0;
}`,
        rules: {
          regex: ["lps\\[i\\+\\+\\]\\s*=\\s*\\+\\+len", "len\\s*=\\s*lps\\[\\s*len\\s*-\\s*1\\s*\\]"],
          hint:
            "On a match write lps[i++] = ++len — len grows first, then it is stored. On a mismatch write len = lps[len - 1], leaving i alone.",
          success:
            "Correct. Leaving i alone on the fall-back is the crux: the same character gets re-tested against a shorter prefix, which is what makes the linear bound hold.",
        },
        solution: `vector<int> lps(m, 0);
int len = 0;

for (int i = 1; i < m; ) {
  if (p[i] == p[len])   lps[i++] = ++len;
  else if (len > 0)     len = lps[len - 1];
  else                  lps[i++] = 0;
}`,
      },
    },
  ],
};
