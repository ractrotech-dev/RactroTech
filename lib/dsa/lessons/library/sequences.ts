import type { TopicLesson } from "@/lib/dsa/lessons/types";
import {
  traceDifference,
  traceFixedWindow,
  traceFrequency,
  traceIndexing,
  traceKadane,
  tracePalindrome,
  tracePrefix,
  tracePrefixCount,
  traceReverse,
  traceSameDirection,
  traceScanMax,
  traceSpiral,
  traceTwoSum,
  traceVariableWindow,
} from "@/lib/dsa/viz/traceArrays";

export const ARRAY_STRING: TopicLesson = {
  id: "array-string",
  title: "Array & String",
  tagline: "One row of boxes, and every technique that walks it.",
  why:
    "More interview problems are about arrays than about anything else, and a string is just an array of letters. Almost every clever technique later in this syllabus — two pointers, sliding windows, prefix sums, monotonic stacks — is a way of avoiding a second loop over an array. You need the array itself to be automatic first.",
  plain: [
    "An array is a row of boxes of the same type, sitting next to each other in memory.",
    "Each box has a number called an index, and counting starts at 0. In an array of 5 boxes, the valid indexes are 0, 1, 2, 3 and 4.",
    "Because the boxes are next to each other and all the same size, the computer can work out where box 500 is with one multiplication. That is why a[500] is instant.",
    "A string is exactly this, holding characters. s[0] is the first letter, and s.size() is how many there are.",
  ],
  needs: ["Loops, conditions and functions from Fundamentals."],
  costs: [
    { what: "Read or write a[i]", time: "O(1)", note: "One jump. Size does not matter." },
    { what: "Scan the whole array", time: "O(n)", note: "The cost of any single pass." },
    { what: "Insert or delete in the middle", time: "O(n)", note: "Everything after it must shift." },
    { what: "Search an unsorted array", time: "O(n)", note: "No shortcut without sorting or hashing first." },
    { what: "Check every pair", time: "O(n²)", note: "Usually a sign a better method exists." },
  ],
  traps: [
    "Writing to a[n] in an array of size n corrupts memory that belongs to something else. C++ will not stop you, and the crash often appears somewhere unrelated.",
    "Passing a raw array to a function loses its size. Use vector<int>, or pass the length alongside it.",
    "Comparing C-style strings with == compares addresses, not letters. std::string compares properly.",
    "Summing an array of large ints into an int overflows. Make the accumulator a long long.",
  ],
  sections: [
    {
      id: "index",
      kicker: "01",
      title: "Indexing is a jump, not a search",
      hook:
        "An array holds a million numbers and you need the 999999th. Does the computer walk past the other 999998 to get there? If not, how does it know where to land?",
      body: [
        "All the boxes are the same size and they are laid out one after another with no gaps.",
        "So the address of box i is simply start + i × size. One multiply, one add, and the computer is there.",
        "That is why reading a[999999] costs exactly as much as reading a[0]. This property is called random access, and it is the array's great advantage.",
        "The price is paid elsewhere: inserting into the middle means shifting everything after it along by one, which is O(n).",
        "Indexes run from 0 to size − 1. The last index is always one less than the length, and getting that wrong is the most common bug in this whole subject.",
      ],
      viz: traceIndexing([7, 2, 9, 1, 4]),
      example: `int a[5] = {7, 2, 9, 1, 4};

cout << a[0];   // 7  — first box
cout << a[4];   // 4  — last box, index 4 not 5
cout << a[5];   // undefined behaviour — do not do this

// vector is the version you should actually use
vector<int> v = {7, 2, 9, 1, 4};
cout << v.size();   // 5`,
      notes: [
        { token: "a[0]", meaning: "the first box — counting starts at zero" },
        { token: "a[4]", meaning: "the last box of five" },
        { token: "v.size()", meaning: "how many boxes — the last index is size() - 1" },
      ],
      challenge: {
        prompt:
          "Given int a[6] = {3, 8, 1, 9, 4, 6}; print the first and last values, but get the last one using the size rather than typing 5.",
        starter: `int a[6] = {3, 8, 1, 9, 4, 6};
int n = 6;

cout << a[ ] << " ";
cout << a[ ];`,
        rules: {
          regex: ["a\\s*\\[\\s*0\\s*\\]", "a\\s*\\[\\s*n\\s*-\\s*1\\s*\\]"],
          hint: "The first is a[0]. The last is a[n - 1], never a[n].",
          success:
            "Correct. Writing a[n - 1] instead of a[5] means the code still works when the array grows — which is exactly the habit that stops off-by-one bugs.",
        },
        solution: `int a[6] = {3, 8, 1, 9, 4, 6};
int n = 6;

cout << a[0] << " ";
cout << a[n - 1];`,
      },
    },
    {
      id: "scan",
      kicker: "02",
      title: "The single pass",
      hook:
        "Find the largest number in a row of a million, but you may only hold one number in your head at a time. You cannot go back and you cannot sort. Is one walk enough?",
      body: [
        "Yes — and this pattern is the backbone of the entire subject.",
        "Hold a current best. Start it at the first element, never at 0, because every value in the array might be negative.",
        "Walk the rest. At each box ask one question: is this better than what I am holding? If yes, replace it.",
        "When the walk ends, what you are holding is the answer. That is O(n) time and O(1) extra memory.",
        "Change the question inside the if and the same walk solves a different problem: smallest, count of items above a threshold, sum, second largest, first even number. Learn the shape, not the example.",
      ],
      viz: traceScanMax([7, 2, 9, 1, 4]),
      example: `int best = a[0];               // NOT 0 — values may be negative

for (int i = 1; i < n; i++) {
  if (a[i] > best) best = a[i];
}

cout << best;`,
      notes: [
        { token: "best = a[0]", meaning: "seed from real data, not from a guess" },
        { token: "i = 1", meaning: "box 0 is already accounted for" },
        { token: "if (a[i] > best)", meaning: "change only this line to change the problem" },
      ],
      challenge: {
        prompt:
          "Find the second largest number in an array, using one pass. Keep two variables: best and second. Do not sort.",
        starter: `int best = a[0], second = -1000000;

for (int i = 1; i < n; i++) {
  if (a[i] > best) {

  } else if ( ) {
    second = a[i];
  }
}

cout << second;`,
        rules: {
          must: ["second", "best"],
          mustNot: ["sort"],
          regex: ["second\\s*=\\s*best", "best\\s*=\\s*a\\[i\\]", "a\\[i\\]\\s*>\\s*second"],
          hint:
            "When a[i] beats best, the old best becomes second — so write second = best; first, then best = a[i];. Order matters. The else-if fires when a[i] is smaller than best but bigger than second.",
          success:
            "Correct, and the order inside the first branch is the whole trick: demote the old champion before crowning the new one, or you lose it.",
        },
        solution: `int best = a[0], second = -1000000;

for (int i = 1; i < n; i++) {
  if (a[i] > best) {
    second = best;
    best = a[i];
  } else if (a[i] > second) {
    second = a[i];
  }
}

cout << second;`,
      },
    },
    {
      id: "reverse",
      kicker: "03",
      title: "Working from both ends",
      hook:
        "Reverse an array in place. You are not allowed a second array. Copying it backwards is easy; doing it with no extra memory needs a different idea.",
      body: [
        "Put one index at the start and one at the end. Swap what they point at, then step both inwards.",
        "Stop when they meet. Every pair has been swapped exactly once, and each element moved exactly once.",
        "That is n / 2 swaps, O(n) time, and O(1) extra memory — no second array anywhere.",
        "If you loop all the way to the end instead of stopping in the middle, you swap every pair twice and end up with the original array. That is a classic bug.",
        "This two-ends idea is the seed of the whole two-pointer family: palindrome checks, pair sums in sorted arrays, container-with-most-water, and more.",
      ],
      viz: traceReverse([7, 2, 9, 1, 4]),
      example: `int i = 0, j = n - 1;

while (i < j) {
  swap(a[i], a[j]);
  i++;
  j--;
}`,
      notes: [
        { token: "j = n - 1", meaning: "the last index, not n" },
        { token: "while (i < j)", meaning: "stop at the middle — < not <=" },
        { token: "swap", meaning: "std::swap; or use a temporary variable by hand" },
      ],
      challenge: {
        prompt:
          "Check whether an array is a palindrome — the same forwards and backwards. Return early on the first mismatch.",
        starter: `int i = 0, j = n - 1;
bool ok = true;

while ( ) {
  if ( ) { ok = false; break; }
  i++; j--;
}

cout << ok;`,
        rules: {
          must: ["break"],
          regex: ["i\\s*<\\s*j", "a\\[i\\]\\s*!=\\s*a\\[j\\]"],
          hint: "Loop while i < j. If a[i] != a[j] the answer is no — set ok = false and break out immediately.",
          success:
            "Correct. Stopping on the first mismatch matters: the answer cannot change once you have found one, so continuing would be wasted work.",
        },
        solution: `int i = 0, j = n - 1;
bool ok = true;

while (i < j) {
  if (a[i] != a[j]) { ok = false; break; }
  i++; j--;
}

cout << ok;`,
      },
    },
    {
      id: "strings",
      kicker: "04",
      title: "Strings are arrays of letters",
      hook:
        "Count how many times each letter appears in a word of a million characters. Comparing every letter against every other letter is 10¹² operations. What is the one-pass version?",
      body: [
        "A char is stored as a number. 'a' is 97, 'b' is 98, and so on in order.",
        "So c - 'a' turns a letter into a position from 0 to 25. 'a' becomes 0, 'c' becomes 2. That converts a letter into an array index.",
        "Make an array of 26 counters, all starting at zero. Walk the word once, and for each letter do count[c - 'a']++.",
        "One pass, no comparisons between letters at all. This is the seed of hashing: turn the thing into an index, then use the index directly.",
        "Two words are anagrams exactly when their 26 counts match. Two strings can be compared as multisets in O(n) this way.",
      ],
      viz: traceFrequency("banana"),
      example: `string s = "banana";
int count[26] = {0};

for (char c : s) count[c - 'a']++;

cout << count['a' - 'a'];   // 3 a's
cout << count['n' - 'a'];   // 2 n's`,
      notes: [
        { token: "int count[26] = {0}", meaning: "one counter per letter, all zeroed" },
        { token: "c - 'a'", meaning: "turns a letter into 0..25" },
        { token: "for (char c : s)", meaning: "range-for — visits each character in order" },
      ],
      challenge: {
        prompt:
          "Check whether two strings are anagrams — same letters, any order. Count the letters of the first, un-count the letters of the second, then check nothing is left over.",
        starter: `int count[26] = {0};

for (char c : s) count[c - 'a']++;
for (char c : t) ;

bool ok = (s.size() == t.size());
for (int i = 0; i < 26; i++)
  if ( ) ok = false;`,
        rules: {
          regex: ["count\\[\\s*c\\s*-\\s*'a'\\s*\\]--", "count\\[i\\]\\s*!=\\s*0"],
          hint:
            "Subtract for the second string: count[c - 'a']--. Then if any counter is not 0, the letters did not cancel out, so ok = false.",
          success:
            "Correct. Sorting both strings also works but costs O(n log n); counting is O(n). Adding then subtracting so everything cancels to zero is a pattern worth keeping.",
        },
        solution: `int count[26] = {0};

for (char c : s) count[c - 'a']++;
for (char c : t) count[c - 'a']--;

bool ok = (s.size() == t.size());
for (int i = 0; i < 26; i++)
  if (count[i] != 0) ok = false;`,
      },
    },
    {
      id: "palindrome",
      kicker: "05",
      title: "Palindromes",
      hook:
        "Is 'racecar' the same backwards? Building the reversed string and comparing works, but uses an extra n of memory. Do it with none.",
      body: [
        "Use the two-ends walk. One index at the front, one at the back, stepping towards each other.",
        "The moment two letters differ, the answer is no. Return immediately — nothing later can change it.",
        "If they meet without a mismatch, the answer is yes. You only ever compared half the letters, because the other half are the same pairs seen from the other side.",
        "For odd lengths the middle letter is never compared, and it does not need to be: it is its own mirror.",
      ],
      viz: tracePalindrome("racecar"),
      example: `bool isPal(const string& s) {
  int i = 0, j = s.size() - 1;
  while (i < j) {
    if (s[i] != s[j]) return false;
    i++; j--;
  }
  return true;
}`,
      notes: [
        { token: "s.size() - 1", meaning: "the last index" },
        { token: "return false", meaning: "one mismatch settles it — stop immediately" },
        { token: "i < j", meaning: "the middle letter needs no partner" },
      ],
      challenge: {
        prompt:
          "Check whether a sentence is a palindrome, ignoring anything that is not a letter. 'A man, a plan, a canal' should count. Skip non-letters by moving the pointers past them.",
        starter: `int i = 0, j = s.size() - 1;
bool ok = true;

while (i < j) {
  while (i < j && !isalpha(s[i])) ;
  while (i < j && !isalpha(s[j])) ;
  if (tolower(s[i]) != tolower(s[j])) { ok = false; break; }
  i++; j--;
}`,
        rules: {
          must: ["tolower", "isalpha"],
          regex: ["!isalpha\\(s\\[i\\]\\)\\)\\s*i\\+\\+", "!isalpha\\(s\\[j\\]\\)\\)\\s*j--"],
          hint: "Inside the skip loops, advance the pointer: i++ for the left one, j-- for the right one.",
          success:
            "Correct. Notice the inner while loops keep the i < j guard — without it a string of only punctuation would run the pointers straight past each other.",
        },
        solution: `int i = 0, j = s.size() - 1;
bool ok = true;

while (i < j) {
  while (i < j && !isalpha(s[i])) i++;
  while (i < j && !isalpha(s[j])) j--;
  if (tolower(s[i]) != tolower(s[j])) { ok = false; break; }
  i++; j--;
}`,
      },
    },
    {
      id: "kadane",
      kicker: "06",
      title: "Kadane's algorithm",
      hook:
        "Find the largest sum of any run of consecutive numbers in {−2, 1, −3, 4, −1, 2, 1, −5, 4}. Trying every run is O(n²). There is a single pass — what does it have to remember?",
      body: [
        "Keep one number: the best sum of a run that ends exactly here.",
        "At each new element you face one question. Extend the run you already have, or throw it away and start fresh at this element?",
        "The rule is simple: if the running total has gone negative, it is dragging you down, so drop it. A negative prefix can never help a later sum.",
        "Alongside that, keep the best answer ever seen, because the best run may have ended some way back.",
        "Seed both from a[0], not from 0. If every number is negative, the answer is the largest negative one — starting from 0 would wrongly report 0.",
      ],
      viz: traceKadane([-2, 1, -3, 4, -1, 2, 1, -5, 4]),
      example: `int cur = a[0], best = a[0];

for (int i = 1; i < n; i++) {
  cur = max(a[i], cur + a[i]);   // restart, or extend
  best = max(best, cur);         // remember the best ever
}

cout << best;   // 6, from {4, -1, 2, 1}`,
      notes: [
        { token: "cur", meaning: "best sum of a run ENDING at i" },
        { token: "max(a[i], cur + a[i])", meaning: "start fresh, or keep going" },
        { token: "best", meaning: "the best cur ever seen — it may be far behind" },
      ],
      challenge: {
        prompt:
          "Write Kadane's loop. Seed both variables from a[0], then fill in the two max lines.",
        starter: `int cur = , best = ;

for (int i = 1; i < n; i++) {
  cur = ;
  best = ;
}`,
        rules: {
          regex: [
            "cur\\s*=\\s*a\\[0\\]",
            "best\\s*=\\s*a\\[0\\]",
            "cur\\s*=\\s*max\\s*\\(\\s*a\\[i\\]\\s*,\\s*cur\\s*\\+\\s*a\\[i\\]\\s*\\)",
            "best\\s*=\\s*max\\s*\\(\\s*best\\s*,\\s*cur\\s*\\)",
          ],
          hint:
            "Seed both with a[0]. Then cur = max(a[i], cur + a[i]); and best = max(best, cur); — in that order, since best needs the updated cur.",
          success:
            "Correct. The order matters: update cur first, then compare it against best. Swap them and you always report the previous element's answer.",
        },
        solution: `int cur = a[0], best = a[0];

for (int i = 1; i < n; i++) {
  cur = max(a[i], cur + a[i]);
  best = max(best, cur);
}`,
      },
    },
    {
      id: "matrix",
      kicker: "07",
      title: "2D arrays",
      hook:
        "Print a grid in a spiral: right along the top, down the right side, left along the bottom, up the left side, then inwards. Thinking in circles is hopeless. What is the simpler way to see it?",
      body: [
        "A 2D array is a grid. m[r][c] means row r, column c. Rows come first, always.",
        "In memory it is still one long row of boxes, laid out row by row. Walking along a row is faster than walking down a column, because those boxes are next to each other.",
        "For a spiral, stop thinking about circles. Keep four walls: top, bottom, left and right.",
        "Walk right along the top wall, then move the top wall down. Walk down the right wall, then move it left. Walk left along the bottom, move it up. Walk up the left wall, move it right. Repeat.",
        "The loop ends when the walls cross. The two if-checks before the bottom and left walks are what stop a single leftover row or column being printed twice.",
      ],
      viz: traceSpiral([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
      ]),
      example: `int top = 0, bottom = R - 1, left = 0, right = C - 1;

while (top <= bottom && left <= right) {
  for (int c = left; c <= right; c++) cout << m[top][c];
  top++;
  for (int r = top; r <= bottom; r++) cout << m[r][right];
  right--;
  if (top <= bottom) {
    for (int c = right; c >= left; c--) cout << m[bottom][c];
    bottom--;
  }
  if (left <= right) {
    for (int r = bottom; r >= top; r--) cout << m[r][left];
    left++;
  }
}`,
      notes: [
        { token: "four walls", meaning: "top, bottom, left, right — they close in" },
        { token: "top++", meaning: "move the wall immediately after using it" },
        { token: "if (top <= bottom)", meaning: "stops a single leftover row printing twice" },
      ],
      challenge: {
        prompt:
          "Sum the main diagonal of a square matrix — the cells where the row number equals the column number. One loop is enough.",
        starter: `int sum = 0;

for (int i = 0; i < n; i++) {
  sum += ;
}

cout << sum;`,
        rules: {
          regex: ["m\\s*\\[\\s*i\\s*\\]\\s*\\[\\s*i\\s*\\]"],
          hint: "On the main diagonal the row index and the column index are the same, so add m[i][i].",
          success:
            "Correct. The other diagonal is m[i][n - 1 - i] — worth remembering, since problems ask for both.",
        },
        solution: `int sum = 0;

for (int i = 0; i < n; i++) {
  sum += m[i][i];
}

cout << sum;`,
      },
    },
  ],
};

export const PREFIX_SUM: TopicLesson = {
  id: "prefix-sum",
  title: "Prefix Sum",
  tagline: "Do the adding once, then answer any range question instantly.",
  why:
    "A huge family of problems asks the same thing many times: what is the total between here and there? Answering each one by walking the range is fine for one question and fatal for a hundred thousand. Prefix sums move all the work to the start, and then every answer costs a single subtraction.",
  plain: [
    "A prefix sum array stores running totals. pre[i] means: everything from the start up to and including box i.",
    "Once you have that, the sum of any stretch is one subtraction: take the total up to the end, and remove the total up to just before the start.",
    "Building it costs one pass. Every question afterwards costs nothing. That trade — pay once, ask forever — is the whole idea.",
  ],
  needs: ["Arrays and single-pass loops.", "Hash maps help for the counting variants."],
  costs: [
    { what: "Build the prefix array", time: "O(n)", note: "One pass, done once." },
    { what: "Any range sum afterwards", time: "O(1)", note: "Two lookups and a subtraction." },
    { what: "Same with q queries", time: "O(n + q)", note: "Versus O(n·q) the naive way." },
    { what: "Difference array update", time: "O(1)", note: "Add to a whole range in constant time." },
  ],
  traps: [
    "The l = 0 case has no pre[l − 1]. Either guard it, or make the prefix array one longer with pre[0] = 0 and shift everything — the second option removes the special case entirely.",
    "Prefix sums assume the array never changes. One update forces a rebuild. If values change, you need a Fenwick or segment tree.",
    "Sums of large values overflow int fast. Make the prefix array long long.",
  ],
  sections: [
    {
      id: "build",
      kicker: "01",
      title: "Range sums in one subtraction",
      hook:
        "An array of 100000 numbers, and 100000 questions of the form 'what is the sum from index l to index r?'. Answering each by walking is 10¹⁰ operations. How do you make each answer cost nothing?",
      body: [
        "Build one extra array. pre[i] holds the sum of everything from index 0 up to index i.",
        "Each entry is built from the one before it: pre[i] = pre[i − 1] + a[i]. So the whole table costs one pass.",
        "Now the sum from l to r is pre[r] − pre[l − 1]. The first term is everything up to r; the second removes the part before l that you did not ask for.",
        "The l = 0 case has nothing to subtract. The cleanest fix is a prefix array of length n + 1 with pre[0] = 0, so the answer is always pre[r + 1] − pre[l] with no special case.",
        "The same idea works in 2D for rectangle sums, using inclusion–exclusion with four corners instead of two ends.",
      ],
      viz: tracePrefix([3, 1, 4, 1, 5, 9, 2], 2, 5),
      example: `vector<long long> pre(n + 1, 0);
for (int i = 0; i < n; i++)
  pre[i + 1] = pre[i] + a[i];

// sum of a[l..r], inclusive, with no edge case
long long answer = pre[r + 1] - pre[l];`,
      notes: [
        { token: "pre(n + 1, 0)", meaning: "one extra slot removes the l == 0 special case" },
        { token: "pre[i + 1] = pre[i] + a[i]", meaning: "each total reuses the previous one" },
        { token: "pre[r + 1] - pre[l]", meaning: "everything up to r, minus everything before l" },
        { token: "long long", meaning: "10⁵ values near 10⁹ overflow int immediately" },
      ],
      challenge: {
        prompt:
          "Build a prefix sum array, then answer a query for the sum from index l to index r inclusive. Use the n + 1 version so there is no edge case.",
        starter: `vector<long long> pre(n + 1, 0);

for (int i = 0; i < n; i++)
  pre[i + 1] = ;

long long answer = ;`,
        rules: {
          regex: ["pre\\[i\\s*\\+\\s*1\\]\\s*=\\s*pre\\[i\\]\\s*\\+\\s*a\\[i\\]", "pre\\[\\s*r\\s*\\+\\s*1\\s*\\]\\s*-\\s*pre\\[\\s*l\\s*\\]"],
          hint: "Build with pre[i + 1] = pre[i] + a[i]. Query with pre[r + 1] - pre[l].",
          success:
            "Correct. Shifting by one costs a single extra slot and removes an entire class of off-by-one bugs. Prefer it.",
        },
        solution: `vector<long long> pre(n + 1, 0);

for (int i = 0; i < n; i++)
  pre[i + 1] = pre[i] + a[i];

long long answer = pre[r + 1] - pre[l];`,
      },
    },
    {
      id: "hashcount",
      kicker: "02",
      title: "Counting subarrays with a given sum",
      hook:
        "How many runs of consecutive numbers add up to exactly k? Checking every run is O(n²). The trick reuses prefix sums, but backwards — instead of asking what a range sums to, ask which earlier prefix would make it work.",
      body: [
        "A run from l to r sums to k exactly when pre[r] − pre[l − 1] = k.",
        "Rearrange that: pre[l − 1] = pre[r] − k. So while walking, at each position you already know which earlier prefix value you are looking for.",
        "Keep a hash map counting how many times each prefix value has been seen. At each step, add however many times pre[r] − k has already appeared.",
        "Seed the map with {0: 1} before starting. That accounts for runs beginning at index 0, where the 'earlier prefix' is the empty one.",
        "One pass, one map, O(n). The same shape with a different key solves: sum divisible by k (store the remainder), equal numbers of 0s and 1s (turn 0 into −1), and subarrays with a given XOR.",
      ],
      viz: tracePrefixCount([3, 4, 7, 2, -3, 1, 4, 2], 7),
      example: `unordered_map<long long, int> seen;
seen[0] = 1;            // the empty prefix

long long pre = 0;
int answer = 0;

for (int i = 0; i < n; i++) {
  pre += a[i];
  answer += seen[pre - k];   // how many earlier prefixes work
  seen[pre]++;
}`,
      notes: [
        { token: "seen[0] = 1", meaning: "so a run starting at index 0 is counted" },
        { token: "pre - k", meaning: "the earlier prefix value that would complete a run" },
        { token: "answer += seen[...]", meaning: "count them all, not just the first" },
        { token: "seen[pre]++", meaning: "record afterwards, so a run of length 0 is never counted" },
      ],
      challenge: {
        prompt:
          "Count subarrays summing to k. Fill in the lookup and the record steps — and be careful about their order.",
        starter: `unordered_map<long long, int> seen;
seen[0] = 1;
long long pre = 0;
int answer = 0;

for (int i = 0; i < n; i++) {
  pre += a[i];
  answer += ;
  ;
}`,
        rules: {
          regex: ["answer\\s*\\+=\\s*seen\\s*\\[\\s*pre\\s*-\\s*k\\s*\\]", "seen\\s*\\[\\s*pre\\s*\\]\\s*\\+\\+"],
          hint: "Look up seen[pre - k] first and add it to the answer, then record seen[pre]++.",
          success:
            "Correct, and the order is essential. Record before you look up and, when k is 0, every position counts itself as a zero-length subarray.",
        },
        solution: `unordered_map<long long, int> seen;
seen[0] = 1;
long long pre = 0;
int answer = 0;

for (int i = 0; i < n; i++) {
  pre += a[i];
  answer += seen[pre - k];
  seen[pre]++;
}`,
      },
    },
    {
      id: "difference",
      kicker: "03",
      title: "The difference array",
      hook:
        "A hundred thousand instructions, each saying 'add 5 to every index from 200 to 90000'. Doing them literally is 10¹⁰ writes. How do you record a range update in two writes instead?",
      body: [
        "A difference array is a prefix sum run backwards. Instead of totals, store changes.",
        "To add v across the range l to r, write diff[l] += v and diff[r + 1] -= v. Two writes, whatever the range length.",
        "The first says 'from here on, everything is v higher'. The second cancels it just past the end.",
        "After all the updates, take a prefix sum of diff and you have the final array. Every range update cost O(1), and one O(n) pass at the end reveals the result.",
        "This is how problems about booking seats, counting overlapping intervals, and applying many range increments are meant to be solved.",
      ],
      viz: traceDifference(8, [[1, 4, 5], [3, 6, 2]]),
      example: `vector<long long> diff(n + 1, 0);

// add v to every index in [l, r]
diff[l]     += v;
diff[r + 1] -= v;

// after all updates, roll it up
long long running = 0;
for (int i = 0; i < n; i++) {
  running += diff[i];
  a[i] = running;
}`,
      notes: [
        { token: "diff[l] += v", meaning: "from here on, everything is v higher" },
        { token: "diff[r + 1] -= v", meaning: "cancel it just past the end" },
        { token: "n + 1 length", meaning: "so r + 1 is safe when r is the last index" },
        { token: "running += diff[i]", meaning: "the prefix pass that produces the real values" },
      ],
      challenge: {
        prompt:
          "Record a range update on a difference array: add v to everything from l to r inclusive.",
        starter: `vector<long long> diff(n + 1, 0);

diff[ ] += v;
diff[ ] -= v;`,
        rules: {
          regex: ["diff\\s*\\[\\s*l\\s*\\]\\s*\\+=\\s*v", "diff\\s*\\[\\s*r\\s*\\+\\s*1\\s*\\]\\s*-=\\s*v"],
          hint: "Add at l, subtract at r + 1 — one past the end, which is why the array has n + 1 slots.",
          success:
            "Correct. A hundred thousand range updates now cost two writes each, and one final pass reveals every value.",
        },
        solution: `vector<long long> diff(n + 1, 0);

diff[l] += v;
diff[r + 1] -= v;`,
      },
    },
  ],
};

export const TWO_POINTER: TopicLesson = {
  id: "two-pointer",
  title: "Two Pointers",
  tagline: "Two indexes, one pass, and a whole nested loop deleted.",
  why:
    "Two pointers is the most common way an O(n²) solution becomes O(n). The pattern appears in pair sums, palindromes, merging, de-duplication, partitioning and container problems. What makes it work is always the same: a fact about the data that lets one move rule out many possibilities at once.",
  plain: [
    "Instead of one index walking the array, you use two, and you move them according to a rule.",
    "In the opposite-ends version they start far apart and close in. In the same-direction version both start at the front and one runs ahead.",
    "The reason it is fast: each move eliminates a whole group of candidates, so the two pointers together cross the array only once.",
  ],
  needs: ["Arrays and single-pass loops.", "Sorting — many two-pointer problems need sorted input."],
  costs: [
    { what: "Opposite-ends pass", time: "O(n)", note: "After sorting, if sorting was needed." },
    { what: "Same-direction pass", time: "O(n)", note: "The fast pointer never goes backwards." },
    { what: "3 Sum", time: "O(n²)", note: "One fixed element plus a two-pointer sweep inside." },
    { what: "Sort first, then sweep", time: "O(n log n)", note: "The sort usually dominates the cost." },
  ],
  traps: [
    "Opposite-ends pair sums require sorted input. On unsorted data the moves prove nothing — use a hash map instead.",
    "In 3 Sum, forgetting to skip duplicate values produces duplicate triples.",
    "while (i < j) versus while (i <= j) matters. The first skips the middle element, the second includes it. Choose deliberately.",
  ],
  sections: [
    {
      id: "opposite",
      kicker: "01",
      title: "Closing in from both ends",
      hook:
        "A sorted array, and you need two numbers adding to 12. Checking every pair is O(n²). One pointer at each end solves it in one pass — but why is it allowed to skip so many pairs?",
      body: [
        "Start with the smallest and largest numbers. Add them.",
        "If the sum is too small, the only way to get bigger is a bigger left number — so move the left pointer right. Every pair using that old left value is now ruled out, because it was paired with the largest possible partner and still fell short.",
        "If the sum is too big, shrink it by moving the right pointer left, for the mirrored reason.",
        "If it is exactly right, you are done. Every move discards a whole row of the pair table, which is why one pass suffices.",
        "This argument depends entirely on the array being sorted. Without that, moving a pointer proves nothing.",
      ],
      viz: traceTwoSum([1, 3, 4, 6, 8, 11], 12),
      example: `int i = 0, j = n - 1;

while (i < j) {
  int sum = a[i] + a[j];
  if (sum == target) { found(i, j); break; }
  if (sum < target)  i++;      // need bigger
  else               j--;      // need smaller
}`,
      notes: [
        { token: "sorted input", meaning: "without it, the moves are not justified" },
        { token: "sum < target → i++", meaning: "the only way to increase the total" },
        { token: "sum > target → j--", meaning: "the only way to decrease it" },
      ],
      challenge: {
        prompt:
          "Write the two-pointer pair sum on a sorted array. Fill in the two moves.",
        starter: `int i = 0, j = n - 1;

while (i < j) {
  int sum = a[i] + a[j];
  if (sum == target) break;
  if (sum < target) ;
  else ;
}`,
        rules: {
          regex: ["sum\\s*<\\s*target\\s*\\)?\\s*i\\+\\+", "else\\s*j--"],
          hint: "Too small means you need a bigger number, so i++. Too big means j--.",
          success:
            "Correct. Say the reason out loud when you write it — 'too small, so raise the floor' — and you will never get the direction backwards under pressure.",
        },
        solution: `int i = 0, j = n - 1;

while (i < j) {
  int sum = a[i] + a[j];
  if (sum == target) break;
  if (sum < target) i++;
  else j--;
}`,
      },
    },
    {
      id: "same",
      kicker: "02",
      title: "Both pointers moving forward",
      hook:
        "Remove every duplicate from a sorted array, in place, with no extra memory. One pointer reads and one writes. Why do they move at different speeds?",
      body: [
        "Use a read pointer that visits every element, and a write pointer that only advances when something is worth keeping.",
        "The read pointer runs ahead. The write pointer marks the boundary of the answer being built at the front of the same array.",
        "The write pointer is never ahead of the read pointer, so nothing unread is ever overwritten. That is what makes it safe in place.",
        "At the end, the first write positions hold the answer and its length is the write pointer's value.",
        "The same shape solves: move all zeros to the end, remove all copies of a value, partition by a condition, and compact a list.",
      ],
      viz: traceSameDirection([1, 1, 2, 3, 3, 3, 4]),
      example: `int write = 1;                       // a[0] always stays

for (int read = 1; read < n; read++) {
  if (a[read] != a[write - 1]) {
    a[write] = a[read];
    write++;
  }
}

// a[0..write-1] holds the unique values`,
      notes: [
        { token: "read", meaning: "visits every element, never stops" },
        { token: "write", meaning: "only advances when something is kept" },
        { token: "a[write - 1]", meaning: "the last value actually kept" },
      ],
      challenge: {
        prompt:
          "Move every zero to the end of the array while keeping the order of the non-zero values. Use a write pointer that only advances on non-zeros.",
        starter: `int write = 0;

for (int read = 0; read < n; read++) {
  if ( ) {
    a[write] = a[read];
    write++;
  }
}

while (write < n) { a[write] = 0; write++; }`,
        rules: {
          regex: ["a\\s*\\[\\s*read\\s*\\]\\s*!=\\s*0"],
          hint: "Keep the element when a[read] != 0. The trailing loop then fills the rest with zeros.",
          success:
            "Correct. Two passes over the same array, no extra memory, and the original order of the non-zeros is preserved.",
        },
        solution: `int write = 0;

for (int read = 0; read < n; read++) {
  if (a[read] != 0) {
    a[write] = a[read];
    write++;
  }
}

while (write < n) { a[write] = 0; write++; }`,
      },
    },
  ],
};

export const SLIDING_WINDOW: TopicLesson = {
  id: "sliding-window",
  title: "Sliding Window",
  tagline: "A stretch that grows and shrinks instead of being rebuilt.",
  why:
    "Whenever a problem says 'subarray' or 'substring' together with a condition, this is the first thing to try. The insight is small and reusable: as the window moves, almost everything inside it stays the same, so recomputing from scratch is waste.",
  plain: [
    "A window is a stretch of consecutive elements, marked by a left and a right index.",
    "In a fixed window the length never changes: one element joins on the right, one leaves on the left.",
    "In a variable window the right edge always moves forward, and the left edge only moves when a rule is broken.",
    "Both are O(n), because neither edge ever moves backwards.",
  ],
  needs: ["Arrays and strings.", "Hash maps, for the 'distinct characters' variants."],
  costs: [
    { what: "Fixed window of size k", time: "O(n)", note: "Two operations per slide, not k." },
    { what: "Variable window", time: "O(n)", note: "Each edge crosses the array at most once." },
    { what: "Window with a hash map", time: "O(n)", note: "Map operations are O(1) on average." },
    { what: "Window maximum", time: "O(n)", note: "Needs a monotonic deque — see the Deque chapter." },
  ],
  traps: [
    "A sliding window only works when growing the window cannot make the condition easier to satisfy. With negative numbers, a longer window can have a smaller sum — so 'subarray sum at least k' with negatives needs prefix sums, not a window.",
    "Nesting a while inside a for looks like O(n²) but is not, provided the left pointer never resets. If you ever set l = 0 inside the loop, you have lost the guarantee.",
    "Update the answer at the right moment: after shrinking for a 'longest' problem, and after the window becomes valid for a 'shortest' one.",
  ],
  sections: [
    {
      id: "fixed",
      kicker: "01",
      title: "The fixed window",
      hook:
        "Find the largest sum of any 3 consecutive numbers. Adding up each group of 3 separately means every number is added three times. What is being repeated?",
      body: [
        "Windows next to each other overlap almost completely. Between one window and the next, only two elements change.",
        "So add up the first window once. After that, slide by adding the element that enters on the right and subtracting the one that leaves on the left.",
        "Two operations per slide instead of k. Total cost O(n), regardless of the window size.",
        "The element leaving is always at index i − k when i is the element entering. Getting that index right is most of the implementation.",
      ],
      viz: traceFixedWindow([2, 1, 5, 1, 3, 2, 8], 3),
      example: `long long sum = 0;
for (int i = 0; i < k; i++) sum += a[i];

long long best = sum;
for (int i = k; i < n; i++) {
  sum += a[i] - a[i - k];    // one in, one out
  best = max(best, sum);
}`,
      notes: [
        { token: "first k added once", meaning: "set the window up before sliding" },
        { token: "a[i] - a[i - k]", meaning: "the entering element minus the leaving one" },
        { token: "i - k", meaning: "the index that just fell out of the window" },
      ],
      challenge: {
        prompt:
          "Write the slide step for a fixed window of size k: add what enters, subtract what leaves.",
        starter: `long long sum = 0;
for (int i = 0; i < k; i++) sum += a[i];
long long best = sum;

for (int i = k; i < n; i++) {
  sum += ;
  best = max(best, sum);
}`,
        rules: {
          regex: ["a\\[i\\]\\s*-\\s*a\\[\\s*i\\s*-\\s*k\\s*\\]"],
          hint: "sum += a[i] - a[i - k]; — a[i] joins the window, a[i - k] has just left it.",
          success:
            "Correct. Whatever the window computes — a sum, a count, a frequency table — the pattern is the same: apply the entering element, undo the leaving one.",
        },
        solution: `long long sum = 0;
for (int i = 0; i < k; i++) sum += a[i];
long long best = sum;

for (int i = k; i < n; i++) {
  sum += a[i] - a[i - k];
  best = max(best, sum);
}`,
      },
    },
    {
      id: "variable",
      kicker: "02",
      title: "The window that breathes",
      hook:
        "Find the longest stretch of a string with no repeated character. The length is not given — it is what you are solving for. So what decides when the window should shrink?",
      body: [
        "The right edge always moves forward, one element per lap. It never goes back.",
        "After each step, check whether the window is still valid. While it is not, move the left edge forward, undoing that element as it leaves.",
        "The left edge also never goes backwards. So across the whole run, each pointer moves at most n times — that is why the nested while loop is still O(n) overall.",
        "For a 'longest' problem, record the answer after shrinking, when the window is valid again. For a 'shortest' one, record it while the window is valid and shrink as far as you can.",
        "The bookkeeping is whatever the rule needs: a set for 'no repeats', a counter for 'at most k distinct', a running sum for 'sum at most k'.",
      ],
      viz: traceVariableWindow("abcabcbb"),
      example: `unordered_set<char> inWindow;
int l = 0, best = 0;

for (int r = 0; r < n; r++) {
  while (inWindow.count(s[r])) {
    inWindow.erase(s[l]);
    l++;
  }
  inWindow.insert(s[r]);
  best = max(best, r - l + 1);
}`,
      notes: [
        { token: "r always advances", meaning: "the outer loop never rewinds" },
        { token: "while (broken) l++", meaning: "shrink only as much as needed" },
        { token: "erase(s[l]) before l++", meaning: "undo the leaving element, then move" },
        { token: "r - l + 1", meaning: "the window length — the +1 catches everyone out" },
      ],
      challenge: {
        prompt:
          "Complete the variable window: shrink from the left while the current character is already inside, then record the length.",
        starter: `unordered_set<char> inWindow;
int l = 0, best = 0;

for (int r = 0; r < n; r++) {
  while (inWindow.count(s[r])) {
    ;
    l++;
  }
  inWindow.insert(s[r]);
  best = max(best, );
}`,
        rules: {
          regex: ["inWindow\\.erase\\s*\\(\\s*s\\s*\\[\\s*l\\s*\\]\\s*\\)", "r\\s*-\\s*l\\s*\\+\\s*1"],
          hint:
            "Remove the leaving character with inWindow.erase(s[l]) before l++. The window length is r - l + 1.",
          success:
            "Correct. The +1 is there because both ends are included: a window from index 2 to index 4 holds three elements, not two.",
        },
        solution: `unordered_set<char> inWindow;
int l = 0, best = 0;

for (int r = 0; r < n; r++) {
  while (inWindow.count(s[r])) {
    inWindow.erase(s[l]);
    l++;
  }
  inWindow.insert(s[r]);
  best = max(best, r - l + 1);
}`,
      },
    },
  ],
};
