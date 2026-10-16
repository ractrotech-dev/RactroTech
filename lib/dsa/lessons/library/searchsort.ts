import type { TopicLesson } from "@/lib/dsa/lessons/types";
import {
  traceBinaryOnAnswer,
  traceBinarySearch,
  traceBubbleSort,
  traceCountingSort,
  traceInsertionSort,
  traceLinearSearch,
  traceMergeSort,
  traceQuickPartition,
  traceRadixSort,
  traceSelectionSort,
} from "@/lib/dsa/viz/traceSearchSort";

export const SEARCHING: TopicLesson = {
  id: "searching",
  title: "Searching",
  tagline: "Halve the problem, every single look.",
  why:
    "Binary search is the highest-value idea in this syllabus per line of code. It turns a million-item search into twenty comparisons — and, more importantly, it is not really about arrays at all. Once you see that it works on any question whose answer flips from no to yes exactly once, a whole category of 'minimise the maximum' problems opens up.",
  plain: [
    "Linear search asks every box in turn. It is O(n), it assumes nothing, and it always works.",
    "Binary search jumps to the middle of the range still in play and, from one comparison, throws away half of it.",
    "Halving repeatedly is what log n means. A million items halve to nothing in twenty steps.",
    "The price is a precondition: the data must be ordered, so that one comparison actually tells you which side to keep.",
  ],
  needs: ["Arrays and loops.", "Sorting, since binary search needs sorted input."],
  costs: [
    { what: "Linear search", time: "O(n)", note: "Works on anything, sorted or not." },
    { what: "Binary search", time: "O(log n)", note: "10⁶ items in 20 looks." },
    { what: "lower_bound / upper_bound", time: "O(log n)", note: "The standard library version — prefer it." },
    { what: "Binary search on the answer", time: "O(n log C)", note: "n per check, log C checks." },
  ],
  traps: [
    "mid = (lo + hi) / 2 overflows int when lo and hi are large. Write mid = lo + (hi - lo) / 2.",
    "Mixing while (lo <= hi) with hi = mid, or while (lo < hi) with hi = mid - 1, causes infinite loops. Pick one pairing and keep it.",
    "Binary search on unsorted data returns a confident, wrong answer. Sort first, or use a different method.",
    "For 'first element ≥ x', use lower_bound rather than hand-rolling boundary logic under time pressure.",
  ],
  sections: [
    {
      id: "linear",
      kicker: "01",
      title: "Linear search",
      hook:
        "Find the number 9 in an unsorted row of a million. You know nothing about the order. What is the best you can possibly do?",
      body: [
        "Walk from the front and compare each box. Stop as soon as you find it.",
        "The best case is one comparison, the worst is n, and on average it is n / 2. All of those are O(n).",
        "You cannot do better without knowing something extra about the data. If nothing is ordered and nothing is indexed, every box could be the one.",
        "That sentence is the point of this section: an algorithm's speed comes from what it can assume. Sorting and hashing are ways of buying an assumption in advance.",
      ],
      viz: traceLinearSearch([7, 2, 9, 1, 4, 8], 1),
      example: `int find(int a[], int n, int target) {
  for (int i = 0; i < n; i++)
    if (a[i] == target) return i;
  return -1;              // not present
}`,
      notes: [
        { token: "return i", meaning: "leave the moment you find it" },
        { token: "return -1", meaning: "the usual signal for 'not found'" },
      ],
      challenge: {
        prompt:
          "Count how many times target appears in the array. Unlike a search, you cannot stop early — a later box might match too.",
        starter: `int count = 0;

for (int i = 0; i < n; i++) {
  if ( ) ;
}

cout << count;`,
        rules: {
          must: ["count"],
          mustNot: ["break", "return"],
          regex: ["a\\[i\\]\\s*==\\s*target", "count\\+\\+|count\\s*\\+="],
          hint: "if (a[i] == target) count++; — and no break, because there may be more matches ahead.",
          success:
            "Correct. Searching stops early; counting cannot. Noticing that difference is what keeps you from breaking out of a loop too soon.",
        },
        solution: `int count = 0;

for (int i = 0; i < n; i++) {
  if (a[i] == target) count++;
}

cout << count;`,
      },
    },
    {
      id: "binary",
      kicker: "02",
      title: "Binary search",
      hook:
        "Same task, but the row is sorted. A million boxes, and you are allowed twenty looks. That is enough — why?",
      body: [
        "Keep two bounds, lo and hi, marking the stretch that could still contain the answer. At the start that is the whole array.",
        "Look at the middle of that stretch. If it is the target, you are done.",
        "If the middle is too small then — because the array is sorted — everything from the middle leftwards is also too small. Discard it by setting lo = mid + 1.",
        "If it is too big, discard the other half with hi = mid − 1.",
        "Each look halves what remains. From a million you get 500000, then 250000, and after twenty steps there is nothing left. That is O(log n).",
        "Write mid = lo + (hi − lo) / 2 rather than (lo + hi) / 2. The two are equal mathematically, but the second overflows int on large bounds.",
      ],
      viz: traceBinarySearch([1, 3, 4, 6, 8, 11, 15, 19, 23], 15),
      example: `int binarySearch(int a[], int n, int target) {
  int lo = 0, hi = n - 1;
  while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (a[mid] == target) return mid;
    if (a[mid] < target)  lo = mid + 1;
    else                  hi = mid - 1;
  }
  return -1;
}`,
      notes: [
        { token: "lo + (hi - lo) / 2", meaning: "the overflow-safe midpoint" },
        { token: "while (lo <= hi)", meaning: "pairs with mid + 1 and mid - 1" },
        { token: "lo = mid + 1", meaning: "mid was too small, so exclude it too" },
      ],
      challenge: {
        prompt:
          "Write the body of a binary search: compute the midpoint safely, then move the correct bound.",
        starter: `int lo = 0, hi = n - 1;

while (lo <= hi) {
  int mid = ;
  if (a[mid] == target) return mid;
  if (a[mid] < target) ;
  else ;
}
return -1;`,
        rules: {
          regex: ["lo\\s*\\+\\s*\\(\\s*hi\\s*-\\s*lo\\s*\\)\\s*/\\s*2", "lo\\s*=\\s*mid\\s*\\+\\s*1", "hi\\s*=\\s*mid\\s*-\\s*1"],
          hint:
            "mid = lo + (hi - lo) / 2. If a[mid] is too small, lo = mid + 1. Otherwise hi = mid - 1. The ±1 is what guarantees the range shrinks.",
          success:
            "Correct. Without the ±1 the range can stop shrinking and the loop hangs forever — that is the single most common binary search bug.",
        },
        solution: `int lo = 0, hi = n - 1;

while (lo <= hi) {
  int mid = lo + (hi - lo) / 2;
  if (a[mid] == target) return mid;
  if (a[mid] < target) lo = mid + 1;
  else hi = mid - 1;
}
return -1;`,
      },
    },
    {
      id: "onanswer",
      kicker: "03",
      title: "Binary search on the answer",
      hook:
        "Piles of bananas and a fixed number of hours. Find the slowest eating speed that still finishes in time. The answer is not in any array — so what exactly are you searching?",
      body: [
        "The answer is a number in a range: somewhere between 1 and the largest pile. That range is ordered even though no array is.",
        "Now ask a yes/no question about a candidate answer: at speed 7, can I finish in time? That question is easy to answer directly, in O(n).",
        "The key property is monotonicity. If speed 7 works, so does 8, and 9, and everything faster. The answers form no, no, no, yes, yes, yes — flipping exactly once.",
        "Binary search finds that flip. Roughly twenty checks, each costing O(n), instead of trying every speed.",
        "The tell in the problem statement is almost always 'minimise the maximum', 'maximise the minimum', or 'the smallest k such that it is still possible'.",
        "Two things must be true before you reach for this: the candidate answers must be ordered, and the yes/no test must be monotone. Check both before writing code.",
      ],
      viz: traceBinaryOnAnswer([3, 6, 7, 11], 8),
      example: `bool canFinish(int speed) {
  long long hours = 0;
  for (int p : piles) hours += (p + speed - 1) / speed;   // ceil
  return hours <= H;
}

int lo = 1, hi = *max_element(piles.begin(), piles.end());
while (lo < hi) {
  int mid = lo + (hi - lo) / 2;
  if (canFinish(mid)) hi = mid;      // works — but try slower
  else                lo = mid + 1;  // too slow
}
return lo;`,
      notes: [
        { token: "canFinish", meaning: "the monotone yes/no test" },
        { token: "(p + speed - 1) / speed", meaning: "integer ceiling division" },
        { token: "hi = mid", meaning: "keep mid — it is still a candidate answer" },
        { token: "while (lo < hi)", meaning: "pairs with hi = mid; lo == hi is the answer" },
      ],
      challenge: {
        prompt:
          "Fill in the two moves for binary search on the answer. When the candidate works you must keep it, because it might be the best one.",
        starter: `int lo = 1, hi = maxPile;

while (lo < hi) {
  int mid = lo + (hi - lo) / 2;
  if (canFinish(mid)) ;
  else ;
}
return lo;`,
        rules: {
          regex: ["hi\\s*=\\s*mid\\s*;", "lo\\s*=\\s*mid\\s*\\+\\s*1"],
          hint:
            "If mid works, write hi = mid — not mid - 1, because mid itself may be the answer. If it fails, lo = mid + 1.",
          success:
            "Correct, and hi = mid versus hi = mid - 1 is exactly the distinction. Since mid is still a candidate, discarding it would lose the answer.",
        },
        solution: `int lo = 1, hi = maxPile;

while (lo < hi) {
  int mid = lo + (hi - lo) / 2;
  if (canFinish(mid)) hi = mid;
  else lo = mid + 1;
}
return lo;`,
      },
    },
  ],
};

export const SORTING: TopicLesson = {
  id: "sorting",
  title: "Sorting",
  tagline: "Why n log n is the wall, and what each method really costs.",
  why:
    "Sorting is rarely the problem itself — it is the setup that makes the real problem easy. Sorted data unlocks binary search, two pointers, greedy interval sweeps and duplicate detection. And the two fast sorts teach the two most reusable ideas in the subject: divide and conquer, and partitioning.",
  plain: [
    "Sorting puts elements in order. In practice you call sort() and move on — it is O(n log n) and heavily optimised.",
    "You still need to know how the classic methods work, because interviews ask, and because their ideas reappear elsewhere.",
    "The simple sorts (bubble, selection, insertion) are O(n²): easy to write, unusable past a few thousand items.",
    "The fast sorts (merge, quick, heap) are O(n log n). Each buys that speed with a different idea.",
    "No comparison-based sort can beat O(n log n) in the worst case — that is a proven lower bound, not a gap waiting to be closed.",
  ],
  needs: ["Arrays, loops and swapping.", "Recursion, for merge sort and quicksort."],
  costs: [
    { what: "Bubble sort", time: "O(n²)", note: "Educational only." },
    { what: "Selection sort", time: "O(n²) always", note: "Fewest swaps of any sort — exactly n − 1 at most. Useful when writing is expensive." },
    { what: "Insertion sort", time: "O(n²), O(n) if nearly sorted", note: "Genuinely the best choice for tiny or almost-tidy arrays." },
    { what: "Merge sort", time: "O(n log n) always", note: "Stable, but needs O(n) extra memory." },
    { what: "Quicksort", time: "O(n log n) average, O(n²) worst", note: "In place and cache-friendly; the worst case needs a bad pivot." },
    { what: "Counting sort", time: "O(n + K)", note: "K is the range of values. No comparisons at all." },
    { what: "Radix sort", time: "O(d · n)", note: "d is the number of digits. Beats n log n on fixed-width integers." },
    { what: "std::sort", time: "O(n log n)", note: "Introsort — quicksort that switches to heap sort if it degrades." },
  ],
  traps: [
    "A comparator must be a strict weak ordering. Writing >= instead of > in a sort comparator can crash std::sort.",
    "std::sort is not stable — equal elements can be reordered. Use stable_sort when the original order of ties matters.",
    "Sorting to find one thing is often overkill. The largest element is one O(n) pass; the k-th smallest is O(n) with nth_element.",
    "Quicksort on already-sorted data with a first or last pivot degrades to O(n²). Pick the pivot randomly or use the median of three.",
    "Counting sort needs one slot per possible value. With values up to 10⁹ that is 4 GB — check the range before reaching for it.",
    "Every pass of radix sort must be stable. Use an unstable sort inside it and the earlier digits get scrambled again.",
    "The O(n log n) floor applies only to sorts that COMPARE elements. Counting and radix sort never compare, which is how they get underneath it.",
  ],
  sections: [
    {
      id: "bubble",
      kicker: "01",
      title: "Bubble sort, and why it is slow",
      hook:
        "Compare each neighbouring pair and swap them if they are the wrong way round. Repeat until nothing swaps. It works — so what exactly makes it unusable at a hundred thousand items?",
      body: [
        "One pass over the array, swapping out-of-order neighbours, drags the largest value all the way to the end. It has bubbled to the top.",
        "After that pass the last position is correct and never needs to be touched again. So the next pass can stop one position earlier.",
        "That gives n passes over roughly n elements each: about n²/2 comparisons.",
        "At n = 1000 that is half a million operations — fine. At n = 100000 it is five billion, which is minutes rather than milliseconds.",
        "One useful improvement: if a pass makes no swaps at all, the array is already sorted, so stop. That makes the best case O(n) on already-sorted input.",
      ],
      viz: traceBubbleSort([5, 1, 4, 2, 8]),
      example: `for (int i = 0; i < n - 1; i++) {
  bool swapped = false;
  for (int j = 0; j < n - 1 - i; j++) {
    if (a[j] > a[j + 1]) {
      swap(a[j], a[j + 1]);
      swapped = true;
    }
  }
  if (!swapped) break;      // already sorted — stop
}`,
      notes: [
        { token: "n - 1 - i", meaning: "the last i positions are already final" },
        { token: "a[j] > a[j + 1]", meaning: "compares neighbours only" },
        { token: "if (!swapped) break", meaning: "makes sorted input cost O(n)" },
      ],
      challenge: {
        prompt:
          "Write the inner loop of bubble sort so it stops before the already-sorted tail, and swaps out-of-order neighbours.",
        starter: `for (int i = 0; i < n - 1; i++) {
  for (int j = 0; j < ; j++) {
    if ( ) swap(a[j], a[j + 1]);
  }
}`,
        rules: {
          regex: ["n\\s*-\\s*1\\s*-\\s*i", "a\\[j\\]\\s*>\\s*a\\[j\\s*\\+\\s*1\\]"],
          hint: "The inner gate is j < n - 1 - i, and the test is a[j] > a[j + 1].",
          success:
            "Correct. Writing j < n - 1 rather than n - 1 - i still sorts, but re-checks the finished tail on every pass — correct and wasteful.",
        },
        solution: `for (int i = 0; i < n - 1; i++) {
  for (int j = 0; j < n - 1 - i; j++) {
    if (a[j] > a[j + 1]) swap(a[j], a[j + 1]);
  }
}`,
      },
    },
    {
      id: "selection",
      kicker: "02",
      title: "Selection sort",
      hook:
        "Bubble sort swapped constantly — sometimes thousands of times for one array. What if each move were expensive, say a write to a slow disk? Can you sort with as few moves as possible?",
      body: [
        "Yes, and the method is what you would do by hand. Look through the whole unsorted part, find the smallest value, and put it at the front.",
        "That value is now in its final place forever. Repeat on what is left.",
        "The number of swaps is at most n − 1 — one per position. No sort does fewer.",
        "But the looking is unchanged. Finding the smallest of m items takes m comparisons, so the total is still about n²/2. Selection sort is O(n²) on every input, sorted or not.",
        "So it trades one cost for another: fewest writes, same number of reads. Worth it only when writing is far more expensive than comparing.",
      ],
      viz: traceSelectionSort([5, 1, 4, 2, 8]),
      example: `for (int i = 0; i < n - 1; i++) {
  int least = i;
  for (int j = i + 1; j < n; j++)
    if (a[j] < a[least]) least = j;
  swap(a[i], a[least]);
}`,
      notes: [
        { token: "least = i", meaning: "assume the first unsorted item is the smallest" },
        { token: "j = i + 1", meaning: "only the unsorted part needs checking" },
        { token: "one swap per i", meaning: "at most n - 1 swaps in total" },
      ],
      challenge: {
        prompt:
          "Write the inner loop of selection sort: find the POSITION of the smallest value in the unsorted part, then swap it into place.",
        starter: `for (int i = 0; i < n - 1; i++) {
  int least = i;
  for (int j = i + 1; j < n; j++)
    if ( ) least = j;
  swap(a[i], a[ ]);
}`,
        rules: {
          regex: ["a\\[j\\]\\s*<\\s*a\\[least\\]", "swap\\s*\\(\\s*a\\[i\\]\\s*,\\s*a\\[\\s*least\\s*\\]\\s*\\)"],
          hint: "Track the position, not the value: if (a[j] < a[least]) least = j; Then swap a[i] with a[least].",
          success:
            "Correct, and remembering the position rather than the value is the point — you need to know WHERE the smallest one is in order to swap it.",
        },
        solution: `for (int i = 0; i < n - 1; i++) {
  int least = i;
  for (int j = i + 1; j < n; j++)
    if (a[j] < a[least]) least = j;
  swap(a[i], a[least]);
}`,
      },
    },
    {
      id: "insertion",
      kicker: "03",
      title: "Insertion sort",
      hook:
        "How do you sort a hand of playing cards? Almost nobody bubbles them. You pick up each new card and slide it back into the right spot. Why is that better on nearly-sorted data?",
      body: [
        "Treat the left part of the array as already sorted. It starts as just the first element, which is trivially sorted.",
        "Take the next element — call it the key. Shift every sorted element bigger than the key one place right, opening a gap.",
        "Drop the key into the gap. The sorted part is now one longer.",
        "The worst case is still O(n²), on reversed input where every key travels the full distance.",
        "But on nearly-sorted data the shifting loop barely runs, so it approaches O(n). That is why real sort implementations switch to insertion sort for small or nearly-ordered chunks.",
      ],
      viz: traceInsertionSort([5, 2, 8, 1, 9]),
      example: `for (int i = 1; i < n; i++) {
  int key = a[i];
  int j = i - 1;
  while (j >= 0 && a[j] > key) {
    a[j + 1] = a[j];      // shift right
    j--;
  }
  a[j + 1] = key;         // drop into the gap
}`,
      notes: [
        { token: "key = a[i]", meaning: "save it first — the shifting overwrites that slot" },
        { token: "j >= 0 && a[j] > key", meaning: "guard the edge before reading a[j]" },
        { token: "a[j + 1] = key", meaning: "+1 because j went one step too far" },
      ],
      challenge: {
        prompt:
          "Write the shifting loop of insertion sort, then place the key.",
        starter: `for (int i = 1; i < n; i++) {
  int key = a[i];
  int j = i - 1;
  while ( ) {
    a[j + 1] = a[j];
    j--;
  }
  a[ ] = key;
}`,
        rules: {
          regex: ["j\\s*>=\\s*0\\s*&&\\s*a\\[j\\]\\s*>\\s*key", "a\\s*\\[\\s*j\\s*\\+\\s*1\\s*\\]\\s*=\\s*key"],
          hint:
            "The gate is j >= 0 && a[j] > key. The j >= 0 must come first, or you read a[-1]. Afterwards place the key at a[j + 1].",
          success:
            "Correct. C++ evaluates && left to right and stops early, so putting j >= 0 first is what keeps a[j] from being read out of bounds.",
        },
        solution: `for (int i = 1; i < n; i++) {
  int key = a[i];
  int j = i - 1;
  while (j >= 0 && a[j] > key) {
    a[j + 1] = a[j];
    j--;
  }
  a[j + 1] = key;
}`,
      },
    },
    {
      id: "merge",
      kicker: "04",
      title: "Merge sort",
      hook:
        "Merging two already-sorted lists into one is easy — compare their front items and take the smaller. So how do you get two sorted lists in the first place?",
      body: [
        "You make them, by splitting. Cut the array in half, sort each half the same way, then merge.",
        "The recursion bottoms out at length one, and a single element is already sorted. Splitting is free progress.",
        "All the real work is the merge: walk both halves with one index each, always taking the smaller front item.",
        "Each level of merging touches all n elements, and halving means there are log₂ n levels. n per level × log n levels is O(n log n).",
        "It is O(n log n) always — best, average and worst — which is why it is used where predictability matters. The cost is O(n) extra memory for the merge buffer.",
        "It is also stable: equal elements keep their original order, provided you take from the left half on ties.",
      ],
      viz: traceMergeSort([5, 2, 8, 1, 9, 3]),
      example: `void merge(int l, int m, int r) {
  vector<int> tmp;
  int i = l, j = m + 1;
  while (i <= m && j <= r)
    tmp.push_back(a[i] <= a[j] ? a[i++] : a[j++]);   // <= keeps it stable
  while (i <= m) tmp.push_back(a[i++]);
  while (j <= r) tmp.push_back(a[j++]);
  for (int k = 0; k < tmp.size(); k++) a[l + k] = tmp[k];
}

void mergeSort(int l, int r) {
  if (l >= r) return;
  int m = l + (r - l) / 2;
  mergeSort(l, m);
  mergeSort(m + 1, r);
  merge(l, m, r);
}`,
      notes: [
        { token: "if (l >= r) return", meaning: "one element is already sorted" },
        { token: "a[i] <= a[j]", meaning: "the <= is what makes the sort stable" },
        { token: "two trailing whiles", meaning: "one half runs out first — copy the rest" },
      ],
      challenge: {
        prompt:
          "Write the main merge loop: while both halves still have items, take the smaller front element.",
        starter: `int i = l, j = m + 1;

while (i <= m && j <= r) {
  if ( ) tmp.push_back(a[i++]);
  else    tmp.push_back(a[j++]);
}`,
        rules: {
          regex: ["a\\[i\\]\\s*<=\\s*a\\[j\\]"],
          hint: "Take from the left half when a[i] <= a[j]. Use <= rather than < so that ties keep their original order.",
          success:
            "Correct. With < instead of <=, equal elements would be taken from the right half first and the sort would no longer be stable.",
        },
        solution: `int i = l, j = m + 1;

while (i <= m && j <= r) {
  if (a[i] <= a[j]) tmp.push_back(a[i++]);
  else              tmp.push_back(a[j++]);
}`,
      },
    },
    {
      id: "counting",
      kicker: "05",
      title: "Counting sort",
      hook:
        "Every sort so far compared values against each other, and O(n log n) is proven to be the floor for that. Now sort a million exam marks, each between 0 and 100 — in O(n). Which rule are you allowed to break?",
      body: [
        "The comparison rule. That O(n log n) floor only applies to sorts that ask 'is this bigger than that'. Counting sort never asks.",
        "Instead it makes one slot per possible value. Walk the input once and, for each value, add one to its slot. The value IS the index — no searching, no comparing.",
        "Then walk the slots in order and write each value out as many times as it was counted. The output is sorted because you visited the slots in order.",
        "One pass to tally, one to rebuild: O(n + K), where K is the range of possible values.",
        "The catch is that K. Marks from 0 to 100 need 101 slots. Values up to a billion need a billion slots, which is gigabytes of memory. Always check the range first.",
        "The simple version above throws away anything else attached to each value. The stable version walks the input backwards using running totals — and that is the one radix sort needs.",
      ],
      viz: traceCountingSort([4, 2, 2, 8, 3, 3, 1]),
      example: `int count[K] = {0};
for (int x : a) count[x]++;           // tally — no comparisons

int at = 0;
for (int v = 0; v < K; v++)
  while (count[v]-- > 0) a[at++] = v; // rebuild in order`,
      notes: [
        { token: "count[K]", meaning: "one slot per possible value. K is the range, not the count" },
        { token: "count[x]++", meaning: "the value is the index — that is the whole trick" },
        { token: "walk v in order", meaning: "why the output comes out sorted" },
        { token: "O(n + K)", meaning: "beats n log n only while K stays small" },
      ],
      challenge: {
        prompt:
          "Write counting sort: tally each value into its own slot, then rebuild the array by walking the slots in order.",
        starter: `int count[K] = {0};

for (int i = 0; i < n; i++) ;

int at = 0;
for (int v = 0; v < K; v++)
  while (count[v]-- > 0) a[at++] = ;`,
        rules: {
          regex: ["count\\s*\\[\\s*a\\[i\\]\\s*\\]\\+\\+", "a\\[at\\+\\+\\]\\s*=\\s*v"],
          hint: "Tally with count[a[i]]++. When rebuilding write out v — the slot number IS the value.",
          success:
            "Correct. Notice you wrote out v, not a[i]: once the tally is built the original array is not needed, because the slot number carries the value.",
        },
        solution: `int count[K] = {0};

for (int i = 0; i < n; i++) count[a[i]]++;

int at = 0;
for (int v = 0; v < K; v++)
  while (count[v]-- > 0) a[at++] = v;`,
      },
    },
    {
      id: "radix",
      kicker: "06",
      title: "Radix sort",
      hook:
        "Counting sort dies when the values are large — a million phone numbers would need a million million slots. But every phone number has only ten digits, each 0 to 9. Can you use that?",
      body: [
        "Yes. Sort by one digit at a time. Each digit has only ten possible values, so counting sort handles it easily.",
        "Start from the LAST digit, not the first. That feels backwards, and it is the whole reason this works.",
        "After sorting by the ones digit, sort by the tens digit. Numbers sharing a tens digit stay in the order the previous pass left them — so they are still correctly ordered by their ones digit.",
        "That only holds if each pass is stable, meaning equal keys keep their relative order. Use an unstable sort inside and every earlier pass is undone.",
        "So after d passes the numbers are sorted by the top digit, then the next, all the way down to the ones. That is fully sorted.",
        "Each pass is O(n), so the total is O(d · n). For fixed-width integers d is a small constant, which puts it below O(n log n) — the comparison floor does not apply, because nothing is ever compared.",
      ],
      viz: traceRadixSort([170, 45, 75, 90, 2, 802, 24]),
      example: `int maxVal = *max_element(a.begin(), a.end());

for (int exp = 1; maxVal / exp > 0; exp *= 10) {
  // a STABLE counting sort on the digit at this place
  countingSortByDigit(a, exp);
}

// the digit of x at that place:
int d = (x / exp) % 10;`,
      notes: [
        { token: "exp = 1, then 10, 100", meaning: "the place value being sorted on" },
        { token: "(x / exp) % 10", meaning: "pulls out one digit" },
        { token: "must be STABLE", meaning: "or the previous pass's ordering is destroyed" },
        { token: "last digit first", meaning: "so later passes can rely on earlier ones" },
      ],
      challenge: {
        prompt:
          "Write the loop that walks the place values, and the expression that pulls out one digit of x at that place.",
        starter: `for (int exp = 1; maxVal / exp > 0; ) {
  countingSortByDigit(a, exp);
}

// inside: the digit of x at this place
int d = ;`,
        rules: {
          regex: ["exp\\s*\\*=\\s*10", "\\(\\s*x\\s*/\\s*exp\\s*\\)\\s*%\\s*10"],
          hint: "Step with exp *= 10 to move to the next place. The digit is (x / exp) % 10.",
          success:
            "Correct. Dividing by exp shifts the digit you want down into the ones position, and % 10 then keeps only that digit.",
        },
        solution: `for (int exp = 1; maxVal / exp > 0; exp *= 10) {
  countingSortByDigit(a, exp);
}

int d = (x / exp) % 10;`,
      },
    },
    {
      id: "quick",
      kicker: "07",
      title: "Quicksort and partitioning",
      hook:
        "Pick one number and rearrange the array so everything smaller sits left of it and everything bigger sits right. That number is now in its final position forever. What does that buy you?",
      body: [
        "It buys you two smaller problems that never interact. Sort the left part and the right part, and the whole array is sorted — no merge step at all.",
        "The rearrangement is called partitioning, and it is one pass. Keep a boundary marking the end of the 'smaller than pivot' zone; each time you meet a smaller element, swap it to the boundary and push the boundary along.",
        "Finally swap the pivot into the gap just past the boundary. It is home.",
        "When the pivot lands near the middle, the array halves each time and you get O(n log n).",
        "When it lands at an end — which is exactly what happens on already-sorted input with a first or last pivot — one side has n − 1 elements and it degrades to O(n²). Choosing the pivot at random fixes this in practice.",
        "Partitioning is worth knowing on its own. Quickselect uses it to find the k-th smallest element in O(n) average time, without sorting anything.",
      ],
      viz: traceQuickPartition([7, 2, 9, 1, 6]),
      example: `int partition(int lo, int hi) {
  int pivot = a[hi];
  int i = lo - 1;                       // end of the "smaller" zone
  for (int j = lo; j < hi; j++)
    if (a[j] < pivot) swap(a[++i], a[j]);
  swap(a[i + 1], a[hi]);                // pivot goes home
  return i + 1;
}

void quickSort(int lo, int hi) {
  if (lo >= hi) return;
  int p = partition(lo, hi);
  quickSort(lo, p - 1);
  quickSort(p + 1, hi);                 // p itself is already final
}`,
      notes: [
        { token: "i = lo - 1", meaning: "the smaller-zone is empty to begin with" },
        { token: "swap(a[++i], a[j])", meaning: "grow the zone, then swap into it" },
        { token: "quickSort(p + 1, hi)", meaning: "p is skipped — it is already in place" },
      ],
      challenge: {
        prompt:
          "Write the partition loop: when an element is smaller than the pivot, grow the smaller-zone and swap it in.",
        starter: `int pivot = a[hi];
int i = lo - 1;

for (int j = lo; j < hi; j++) {
  if ( ) {
    i++;
    ;
  }
}
swap(a[i + 1], a[hi]);`,
        rules: {
          regex: ["a\\[j\\]\\s*<\\s*pivot", "swap\\s*\\(\\s*a\\[i\\]\\s*,\\s*a\\[j\\]\\s*\\)"],
          hint: "Test a[j] < pivot. Then i++ followed by swap(a[i], a[j]) moves the element into the smaller-zone.",
          success:
            "Correct. Each element is looked at exactly once, so a partition is O(n) — and it places one element permanently.",
        },
        solution: `int pivot = a[hi];
int i = lo - 1;

for (int j = lo; j < hi; j++) {
  if (a[j] < pivot) {
    i++;
    swap(a[i], a[j]);
  }
}
swap(a[i + 1], a[hi]);`,
      },
    },
  ],
};
