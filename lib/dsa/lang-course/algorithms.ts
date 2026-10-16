import type { TopicLesson } from "@/lib/dsa/lessons/types";
import {
  traceComparator,
  traceEquality,
  tracePipeline,
  traceSortStability,
} from "@/lib/dsa/viz/traceLang";

// Language track, topic 6.
//
// The DSA track teaches how sorting and searching WORK. This one is about the
// versions that ship with the language — which are faster than anything you
// will write, and which differ on the details that actually bite: stability,
// what the comparator returns, and whether the language has a pipeline at all.

export const LANG_ALGORITHMS: TopicLesson = {
  id: "lang-algorithms",
  title: "Algorithms",
  tagline: "Sorting and searching with what is built in.",
  why:
    "You will implement sorting once, to understand it, and then never again. The built-in sort is faster, correct, and already tested. What is worth learning is how to tell it what order you want, whether it keeps equal items in place, and how to say 'take these, keep those, add them up' without writing a loop.",
  plain: [
    "Every language here ships a sort. Use it.",
    "You tell it the order by giving it a way to compare two items.",
    "Searching a sorted list by halving is far faster than walking it.",
    "Most loops over a collection are really one of three things: keep some, change each, or combine them all.",
  ],
  needs: ["Lists from Arrays & Strings.", "Functions, since a comparator is a function you pass."],
  traps: [
    "JavaScript's sort with no comparator sorts numbers as text: [10, 9] stays [10, 9].",
    "Not every built-in sort is stable. C++'s std::sort is not, and neither is C's qsort.",
    "Binary search only works on sorted data. On unsorted data it gives a wrong answer instead of an error.",
    "A comparator must be consistent. One that contradicts itself can crash the sort.",
    "Sorting in place changes your collection. Some methods do, some return a new one, and the names are similar.",
  ],
  sections: [
    /* -------------------------------------------------------- sorting -- */
    {
      id: "sorting",
      kicker: "01",
      title: "Putting things in order",
      hook:
        "You sort a list of people by name, then sort it again by age. Are the people of the same age still in alphabetical order?",
      body: [
        "It depends on whether the sort is STABLE, and in C++ the answer is no.",
        "A stable sort keeps equal items in the order it found them. An unstable one is free to shuffle them, because as far as the comparison is concerned they are interchangeable.",
        "That matters more than it sounds. Stability is what lets you sort by two things without writing a two-part comparison: sort by the less important key first, then stable-sort by the more important one.",
        "`std::sort` is NOT stable. `std::stable_sort` is, and costs a little more. Python, Java, JavaScript and Rust's default sorts are all stable — C++ is the odd one out here.",
        "To say what order you want, hand the sort a comparison. In C++ it is a function returning true when the first item should come BEFORE the second: `[](auto& a, auto& b){ return a.age < b.age; }`.",
        "Note that shape — it returns a bool meaning 'strictly before', not a negative-zero-positive number. C, Java and JavaScript all use the three-way number instead, so this is one of the few places C++ is the simpler one.",
        "One rule holds everywhere: the comparison must be consistent. If it says a comes before b, it must not also say b comes before a. An inconsistent comparison can make std::sort read past the end of the array.",
      ],
      predict: {
        ask: "people is sorted by name. What does this print?",
        code: `// people: ada/2, bob/1, cleo/2, dev/1
sort(people.begin(), people.end(),
     [](auto& a, auto& b){ return a.n < b.n; });

for (auto& p : people) cout << p.name << " ";`,
        choices: [
          { text: "bob dev ada cleo, guaranteed", why: "That is what a stable sort would give. std::sort makes no such promise." },
          { text: "The 1s come first and the 2s second, but the order within each is not promised", why: "Correct. std::sort is not stable, so the alphabetical order among equal numbers may or may not survive. Use std::stable_sort when you need it kept." },
          { text: "ada bob cleo dev — the names decide ties", why: "The comparison only looks at n. The sort has no idea the names exist." },
          { text: "It will not compile without a full comparator class", why: "A lambda is a perfectly ordinary comparator and is the usual way to write one." },
        ],
        answer: 1,
      },
      viz: traceSortStability(),
      example: `vector<int> v = {3, 1, 2};

sort(v.begin(), v.end());              // ascending. NOT stable
sort(v.begin(), v.end(), greater<>()); // descending

// your own order — return true when a should come FIRST
sort(people.begin(), people.end(),
     [](const P& a, const P& b){ return a.age < b.age; });

// keep equal items where they were
stable_sort(people.begin(), people.end(),
            [](const P& a, const P& b){ return a.age < b.age; });

// two keys, without a two-part comparison
stable_sort(people.begin(), people.end(), byName);
stable_sort(people.begin(), people.end(), byAge);   // name order survives

// when you only need the top few
partial_sort(v.begin(), v.begin() + 3, v.end());
nth_element(v.begin(), v.begin() + 3, v.end());     // even cheaper`,
      notes: [
        { token: "sort", meaning: "fast, and NOT stable. The C++ default" },
        { token: "stable_sort", meaning: "keeps equal items in place. Slightly slower" },
        { token: "return a.age < b.age", meaning: "true means a comes first. A bool, not -1/0/1" },
        { token: "nth_element", meaning: "when you want the top few, not the whole order" },
      ],
      challenge: {
        prompt:
          "Sort people by age, oldest first, keeping equal ages in the order they were already in.",
        starter: `(people.begin(), people.end(),
     [](const P& a, const P& b){ return ; });`,
        rules: {
          regex: ["stable_sort\\s*\\(\\s*people\\.begin", "return\\s+a\\.age\\s*>\\s*b\\.age"],
          hint: "stable_sort for the ordering promise, and a.age > b.age for oldest first.",
          success:
            "Correct. Flipping the comparison to > is how you reverse an order — you never need to sort and then reverse, and doing so would also undo the stability you just paid for.",
        },
        solution: `stable_sort(people.begin(), people.end(),
     [](const P& a, const P& b){ return a.age > b.age; });`,
      },

      alt: {
        c: {
          body: [
            "It depends on whether the sort is stable, and `qsort` makes no promise either way. Assume it is not.",
            "C gives you exactly one sort: `qsort`. It works on any array of anything, which is why its signature looks strange — it takes the array, the number of items, the SIZE of one item, and a comparison function.",
            "That comparison is where C differs from C++. It takes two `const void *` — pointers to anything — so you cast them to your real type inside, then return a negative number, zero, or a positive number.",
            "Negative means the first comes before the second. Zero means equal. Positive means the second comes first. This three-way answer is the same convention Java and JavaScript use.",
            "The classic bug is writing `return *(int*)a - *(int*)b;`. It reads well and it OVERFLOWS: with a large positive and a large negative int, the subtraction wraps around and gives the wrong sign. Compare and return -1, 0 or 1 instead.",
            "For searching, `bsearch` takes the same comparison and the same arguments plus a key. Sort once, then find any item in about twenty steps out of a million.",
            "There is no stable sort in the C standard library. If you need stability, add an original-position field to your struct and use it to break ties.",
          ],
          predict: {
            ask: "What is wrong with this comparison function?",
            code: `int cmp(const void *a, const void *b) {
  return *(const int*)a - *(const int*)b;
}`,
            choices: [
              { text: "Nothing — it is the standard idiom", why: "It is widely written and it is genuinely broken for large values, because the subtraction can overflow." },
              { text: "The subtraction can overflow and give the wrong sign", why: "Correct. With a near-maximum positive and a near-minimum negative int, a - b wraps around, so a bigger value can compare as smaller. Return -1, 0 or 1 from explicit comparisons instead." },
              { text: "The casts are wrong", why: "The casts are exactly right — qsort hands you const void pointers and you must cast them to the real type." },
              { text: "It should return a bool", why: "That is C++'s convention. C's qsort wants a three-way number: negative, zero, or positive." },
            ],
            answer: 1,
          },
          example: `/* the comparison: negative, zero, or positive */
int cmp(const void *a, const void *b) {
  int x = *(const int*)a, y = *(const int*)b;
  return (x > y) - (x < y);      /* -1, 0 or 1. No overflow */
}

qsort(nums, len, sizeof(int), cmp);

/* descending — just swap the operands */
int desc(const void *a, const void *b) { return cmp(b, a); }

/* sorting structs */
int byAge(const void *a, const void *b) {
  const P *p = a, *q = b;
  return (p->age > q->age) - (p->age < q->age);
}
qsort(people, n, sizeof(P), byAge);

/* find, after sorting with the SAME comparison */
int key = 42;
int *found = bsearch(&key, nums, len, sizeof(int), cmp);

/* no stable sort in C. Add a position field and break ties on it */`,
          notes: [
            { token: "qsort", meaning: "C's only sort. Not stable, and works on anything" },
            { token: "const void *", meaning: "cast it to your real type inside the function" },
            { token: "(x > y) - (x < y)", meaning: "-1, 0 or 1 with no overflow. The safe idiom" },
            { token: "bsearch", meaning: "the same comparison, plus a key. Sort first" },
          ],
          prompt:
            "Write the comparison so it sorts ascending without any chance of overflow.",
          starter: `int cmp(const void *a, const void *b) {
  int x = *(const int*)a, y = *(const int*)b;
  return ;
}`,
          rules: {
            regex: ["\\(\\s*x\\s*>\\s*y\\s*\\)\\s*-\\s*\\(\\s*x\\s*<\\s*y\\s*\\)"],
            mustNot: ["return x - y"],
            hint: "(x > y) - (x < y) gives 1, -1 or 0 — and never overflows, because each comparison is already 0 or 1.",
            success:
              "Correct. Each comparison produces 0 or 1, so the result is always -1, 0 or 1 whatever the inputs — no subtraction of the actual values ever happens.",
          },
          solution: `int cmp(const void *a, const void *b) {
  int x = *(const int*)a, y = *(const int*)b;
  return (x > y) - (x < y);
}`,
        },

        python: {
          body: [
            "Yes. Python's sort is guaranteed STABLE, and that guarantee is part of the language, not an accident of the implementation.",
            "A stable sort keeps equal items in the order it found them, which is what lets you sort by two things: sort by the less important key first, then by the more important one.",
            "Python gives you two spellings. `nums.sort()` sorts the list IN PLACE and returns None. `sorted(nums)` leaves the original alone and returns a new list. Assigning the result of `.sort()` is a classic slip — you get None.",
            "To say what order you want, pass `key=` — a function that turns each item into the thing to compare. `people.sort(key=lambda p: p.age)`.",
            "That is different from a comparator and better: the key function is called once per item rather than once per comparison, and it reads as 'sort by this' rather than 'here is how to compare two of them'.",
            "`reverse=True` flips the order. For two keys at once, return a tuple: `key=lambda p: (p.age, p.name)` sorts by age, then by name within each age.",
            "For searching a sorted list, the `bisect` module does the halving: `bisect_left(a, x)` gives you the position where x is or would go.",
          ],
          predict: {
            ask: "What does this Python code print?",
            code: `nums = [3, 1, 2]

result = nums.sort()

print(result)
print(nums)`,
            choices: [
              { text: "[1, 2, 3] and [1, 2, 3]", why: "list.sort() sorts in place and returns None — it does not hand back the sorted list." },
              { text: "None and [1, 2, 3]", why: "Correct. .sort() modifies nums and returns None. Use sorted(nums) when you want a new list back, and .sort() when you want the original reordered." },
              { text: "[1, 2, 3] and [3, 1, 2]", why: "It is the other way round: the original IS changed, and nothing useful is returned." },
              { text: "None and [3, 1, 2]", why: "The sort really does happen — nums is reordered. Only the return value is None." },
            ],
            answer: 1,
          },
          example: `nums = [3, 1, 2]

nums.sort()              # IN PLACE. Returns None
new = sorted(nums)       # a NEW list. Original untouched

nums.sort(reverse=True)

# say what to sort BY, not how to compare
people.sort(key=lambda p: p.age)
people.sort(key=lambda p: p.name.lower())

# two keys at once — a tuple
people.sort(key=lambda p: (p.age, p.name))

# descending on one key, ascending on another
people.sort(key=lambda p: (-p.age, p.name))

# the top few, without sorting everything
import heapq
print(heapq.nlargest(3, nums))
print(min(people, key=lambda p: p.age))

# searching a SORTED list
import bisect
i = bisect.bisect_left(nums, 5)     # where 5 is, or would go
bisect.insort(nums, 5)              # insert and keep it sorted`,
          notes: [
            { token: "nums.sort()", meaning: "in place, returns None" },
            { token: "sorted(nums)", meaning: "a new list. The original is untouched" },
            { token: "key=", meaning: "what to sort BY. Called once per item" },
            { token: "key=lambda p: (a, b)", meaning: "a tuple sorts by the first, then the second" },
          ],
          prompt:
            "Sort people by age, and by name within each age — using one key function.",
          starter: `people.sort(key=lambda p: )`,
          rules: {
            regex: ["key\\s*=\\s*lambda\\s+p\\s*:\\s*\\(\\s*p\\.age\\s*,\\s*p\\.name\\s*\\)"],
            hint: "Return a tuple: key=lambda p: (p.age, p.name). Tuples compare item by item.",
            success:
              "Correct. Tuples compare left to right, so this sorts by age and only looks at the name when two ages are equal — the same idea as sorting twice, in one pass.",
          },
          solution: `people.sort(key=lambda p: (p.age, p.name))`,
        },

        java: {
          body: [
            "Yes, for objects. `Collections.sort` and `List.sort` are guaranteed stable, and so is `Arrays.sort` on an OBJECT array.",
            "But `Arrays.sort` on a PRIMITIVE array — `int[]`, `double[]` — uses a quicksort that is not stable. It does not matter for plain numbers, since two equal ints are indistinguishable, and it is worth knowing the split exists.",
            "To say what order you want, pass a `Comparator`. Modern Java rarely writes one by hand: `Comparator.comparing(P::getAge)` builds it from a getter.",
            "Chaining is where it gets genuinely pleasant. `Comparator.comparing(P::getAge).thenComparing(P::getName)` sorts by age and then by name, and `.reversed()` flips the whole thing.",
            "Watch where `.reversed()` goes: `comparing(a).thenComparing(b).reversed()` reverses BOTH keys, while `comparing(a).reversed().thenComparing(b)` reverses only the first. That is a real and easy mistake.",
            "The older style is a comparator returning a negative, zero or positive int, and it has C's overflow trap: `return a.age - b.age;` breaks on extreme values. Use `Integer.compare(a, b)` instead, which is correct and reads better.",
            "For searching, `Arrays.binarySearch` and `Collections.binarySearch` do the halving — on data you have already sorted with the same ordering.",
          ],
          predict: {
            ask: "What does this sort by?",
            code: `people.sort(
  Comparator.comparing(P::getAge)
            .thenComparing(P::getName)
            .reversed()
);`,
            choices: [
              { text: "Age ascending, then name descending", why: "reversed() applies to the whole comparator that has been built, not just the last part of the chain." },
              { text: "Age descending, then name descending", why: "Correct. reversed() flips the entire chained comparator, so both keys are reversed. To reverse only the age, put .reversed() directly after comparing(P::getAge)." },
              { text: "Age descending, then name ascending", why: "That would need comparing(P::getAge).reversed().thenComparing(P::getName) — the reversed() has to come before the thenComparing." },
              { text: "Name descending only", why: "Both keys are still used. thenComparing only decides ties, and reversed flips the result of the whole chain." },
            ],
            answer: 1,
          },
          example: `List<Integer> list = new ArrayList<>(List.of(3, 1, 2));

Collections.sort(list);          // ascending. STABLE
list.sort(null);                 // the same
list.sort(Comparator.reverseOrder());

int[] prims = {3, 1, 2};
Arrays.sort(prims);              // NOT stable — and it does not matter

// build the comparator from getters
people.sort(Comparator.comparing(P::getAge));
people.sort(Comparator.comparing(P::getAge).reversed());

// two keys — and watch where reversed() goes
people.sort(Comparator.comparing(P::getAge)
                      .thenComparing(P::getName));

// the older style: -1 / 0 / +1
people.sort((a, b) -> Integer.compare(a.age, b.age));
// NOT (a, b) -> a.age - b.age   — that overflows

// searching, after sorting the same way
int i = Collections.binarySearch(list, 2);
int j = Arrays.binarySearch(prims, 2);`,
          notes: [
            { token: "Collections.sort", meaning: "stable. Arrays.sort on primitives is not" },
            { token: "Comparator.comparing(P::getAge)", meaning: "builds the comparator from a getter" },
            { token: ".thenComparing", meaning: "the tie-breaker. Chain as many as you like" },
            { token: "Integer.compare(a, b)", meaning: "use this. a - b overflows on extremes" },
          ],
          prompt:
            "Sort people by age descending, and by name ascending within each age. Put .reversed() where it only affects the age.",
          starter: `people.sort(
  Comparator.comparing(P::getAge)
            
            (P::getName)
);`,
          rules: {
            regex: ["comparing\\s*\\(\\s*P::getAge\\s*\\)\\s*\\.reversed\\s*\\(\\s*\\)\\s*\\.thenComparing\\s*\\(\\s*P::getName\\s*\\)"],
            hint: ".reversed() must come immediately after comparing(P::getAge), before .thenComparing.",
            success:
              "Correct. The chain reads left to right and each call wraps everything to its left — so putting reversed() at the end would have flipped the name ordering too.",
          },
          solution: `people.sort(
  Comparator.comparing(P::getAge)
            .reversed()
            .thenComparing(P::getName)
);`,
        },

        javascript: {
          body: [
            "Yes. JavaScript's sort has been guaranteed stable since 2019, so equal items keep the order they were in.",
            "But there is a much bigger trap first. `sort()` with no comparator converts everything to TEXT and sorts alphabetically. So `[10, 9, 1].sort()` gives `[1, 10, 9]`.",
            "That is not a bug, it is the specified behaviour, and it has caught every JavaScript programmer at least once. For numbers you must pass `(a, b) => a - b`.",
            "The comparator returns a number: negative means a comes first, positive means b comes first, zero means equal. That is C's and Java's convention rather than C++'s bool.",
            "The other thing to watch is that `sort()` changes YOUR array and returns the same array. So `const sorted = arr.sort()` gives you two names for one sorted array, and the original order is gone.",
            "`toSorted()` is the newer, non-destructive version: it returns a new sorted array and leaves yours alone. `toReversed()` is its partner.",
            "There is no built-in binary search. For sorted data, either write the halving loop or keep a Map alongside — usually the Map is the better answer in JavaScript.",
          ],
          predict: {
            ask: "What does this print?",
            code: `console.log([10, 9, 1].sort());
console.log([10, 9, 1].sort((a, b) => a - b));`,
            choices: [
              { text: "[1, 10, 9] then [1, 9, 10]", why: "Correct. With no comparator the values are compared as text, so \"10\" sorts before \"9\". With a - b they are compared as numbers." },
              { text: "[1, 9, 10] twice", why: "The default sort does not compare numbers as numbers — it converts each to a string first." },
              { text: "[1, 9, 10] then [1, 10, 9]", why: "It is the other way round: the default is the odd one, and the explicit a - b comparator gives the numeric order." },
              { text: "[10, 9, 1] then [1, 9, 10]", why: "The default sort does reorder the array — it just orders it alphabetically rather than numerically." },
            ],
            answer: 0,
          },
          example: `const nums = [10, 9, 1];

nums.sort();                  // [1, 10, 9] — compared as TEXT
nums.sort((a, b) => a - b);   // [1, 9, 10] — as numbers
nums.sort((a, b) => b - a);   // descending

// sort() changes YOUR array and returns the same one
const sorted = nums.toSorted((a, b) => a - b);   // a NEW array

// objects
people.sort((a, b) => a.age - b.age);
people.sort((a, b) => a.name.localeCompare(b.name));   // text, properly

// two keys
people.sort((a, b) => a.age - b.age || a.name.localeCompare(b.name));

// the top few, without a full sort
const oldest = people.reduce((a, b) => a.age > b.age ? a : b);
const max = Math.max(...nums);

// no built-in binary search. Write the loop, or keep a Map`,
          notes: [
            { token: "sort() with no comparator", meaning: "compares as TEXT. [10, 9] stays [10, 9]" },
            { token: "(a, b) => a - b", meaning: "the numeric comparator. Negative means a first" },
            { token: "localeCompare", meaning: "for text. Handles accents and case properly" },
            { token: "toSorted()", meaning: "returns a new array. sort() changes yours" },
          ],
          prompt:
            "Sort nums numerically, ascending, WITHOUT changing the original array.",
          starter: `const nums = [10, 9, 1];
const sorted = nums.(());`,
          rules: {
            regex: ["nums\\.toSorted\\s*\\(\\s*\\(\\s*a\\s*,\\s*b\\s*\\)\\s*=>\\s*a\\s*-\\s*b\\s*\\)|\\[\\s*\\.\\.\\.\\s*nums\\s*\\]\\.sort\\s*\\(\\s*\\(\\s*a\\s*,\\s*b\\s*\\)\\s*=>\\s*a\\s*-\\s*b\\s*\\)"],
            hint: "nums.toSorted((a, b) => a - b) — and the comparator is still required, even here.",
            success:
              "Correct. Both halves matter: toSorted protects the original, and the comparator stops the text comparison. Leaving either one out is a real bug.",
          },
          solution: `const nums = [10, 9, 1];
const sorted = nums.toSorted((a, b) => a - b);`,
        },

        rust: {
          body: [
            "Yes, if you used `sort`. Rust gives you both and names them honestly: `sort` is stable, `sort_unstable` is not and is a little faster.",
            "That naming is a small kindness. In C++ you have to remember that `sort` is the unstable one; in Rust the unstable one says so.",
            "To say what order you want, `sort_by_key` takes a function turning each item into the thing to compare — the same idea as Python's `key=`.",
            "`sort_by` takes a full comparison returning an `Ordering`: `Less`, `Equal` or `Greater`. That is a proper three-valued type rather than a number whose sign you have to remember.",
            "`a.cmp(&b)` gives you that Ordering directly, and `.then_with(...)` chains a tie-breaker, so two keys read as `a.age.cmp(&b.age).then_with(|| a.name.cmp(&b.name))`.",
            "Floats are the awkward case, and Rust makes the awkwardness visible: `f64` has NaN, which is not comparable with anything, so floats do not implement full ordering. You use `partial_cmp` and handle the possibility, or `sort_by(|a, b| a.partial_cmp(b).unwrap())` when you know there are no NaNs.",
            "For searching, `binary_search` on a sorted slice returns `Ok(index)` when found and `Err(index)` when not — and that Err is genuinely useful, because it tells you where the item WOULD go.",
          ],
          predict: {
            ask: "What does binary_search return when the value is missing?",
            code: `let v = vec![1, 3, 5, 7];

println!("{:?}", v.binary_search(&5));
println!("{:?}", v.binary_search(&4));`,
            choices: [
              { text: "Some(2) then None", why: "binary_search returns a Result, not an Option — and the failure case carries useful information." },
              { text: "Ok(2) then Err(2)", why: "Correct. Ok carries the index where it was found. Err carries the index where it WOULD be inserted to keep the order — so you can insert there directly." },
              { text: "Ok(2) then Err(())", why: "The Err is not empty. It carries the insertion point, which is what makes it useful rather than just a failure." },
              { text: "2 then -1", why: "That is C's convention. Rust returns a Result so the two cases cannot be confused with each other." },
            ],
            answer: 1,
          },
          example: `let mut v = vec![3, 1, 2];

v.sort();                  // STABLE
v.sort_unstable();         // faster, no promise about equal items
v.reverse();

// sort by a key — like Python's key=
people.sort_by_key(|p| p.age);

// a full comparison, returning an Ordering
people.sort_by(|a, b| a.age.cmp(&b.age));
people.sort_by(|a, b| b.age.cmp(&a.age));      // descending

// two keys
people.sort_by(|a, b| {
    a.age.cmp(&b.age).then_with(|| a.name.cmp(&b.name))
});

// floats need partial_cmp — NaN is not comparable
let mut xs = vec![1.5, 0.5];
xs.sort_by(|a, b| a.partial_cmp(b).unwrap());

// the top few, without sorting everything
let oldest = people.iter().max_by_key(|p| p.age);

// searching a SORTED slice
match v.binary_search(&5) {
    Ok(i)  => println!("found at {}", i),
    Err(i) => v.insert(i, 5),      // Err says where it would go
}`,
          notes: [
            { token: "sort vs sort_unstable", meaning: "stable, versus faster. Named honestly" },
            { token: "sort_by_key(|p| p.age)", meaning: "sort BY something. Like Python's key=" },
            { token: "Ordering", meaning: "Less, Equal, Greater. A real type, not a sign" },
            { token: "binary_search", meaning: "Ok(index) or Err(where it would go)" },
          ],
          prompt:
            "Sort people by age, and by name within each age — using cmp and a tie-breaker.",
          starter: `people.sort_by(|a, b| {
    a.age.cmp(&b.age)(|| )
});`,
          rules: {
            regex: ["a\\.age\\.cmp\\s*\\(\\s*&b\\.age\\s*\\)\\s*\\.then_with\\s*\\(\\s*\\|\\|\\s*a\\.name\\.cmp\\s*\\(\\s*&b\\.name\\s*\\)\\s*\\)"],
            hint: "a.age.cmp(&b.age).then_with(|| a.name.cmp(&b.name))",
            success:
              "Correct. then_with takes a closure rather than a value so the name comparison only runs when the ages are actually equal — there is a plain .then() too, and it evaluates eagerly.",
          },
          solution: `people.sort_by(|a, b| {
    a.age.cmp(&b.age).then_with(|| a.name.cmp(&b.name))
});`,
        },
      },
    },

    /* -------------------------------------------------------- pipeline -- */
    {
      id: "pipeline",
      kicker: "02",
      title: "Keep some, change each, combine",
      hook:
        "Take a list of numbers, keep the even ones, double them, and add up the result. How many loops is that?",
      body: [
        "One loop, or three named steps. Both are correct, and the second is easier to read and to change.",
        "Almost every loop over a collection is doing one of three jobs, or a mixture: KEEPING some items, CHANGING each item, or COMBINING everything into one value.",
        "Those three have names that are the same in most languages: filter, map and reduce. Once you see them, a lot of loops stop needing to be read line by line.",
        "In C++ they live in `<algorithm>` and `<numeric>`, and honestly the older forms are clumsy: `copy_if`, `transform`, `accumulate`, each wanting a pair of iterators and somewhere to put the result.",
        "C++20 ranges fixed that. `nums | views::filter(isEven) | views::transform(dbl)` reads left to right, and nothing is computed until you ask for the result.",
        "`accumulate(v.begin(), v.end(), 0)` is the combining step, and the third argument is the starting value — note it also fixes the TYPE, so passing `0` when summing doubles quietly truncates every step.",
        "The one to know regardless of style is `accumulate` with a custom operation, since sum, product, maximum and 'join into a string' are all the same shape.",
      ],
      predict: {
        ask: "What does this C++ code print?",
        code: `vector<double> v = {1.5, 2.5};

cout << accumulate(v.begin(), v.end(), 0);`,
        choices: [
          { text: "4", why: "The starting value is an int, which forces the whole accumulation to happen in int." },
          { text: "3", why: "Correct. The 0 is an int, so the running total is an int: 0 + 1.5 truncates to 1, then 1 + 2.5 truncates to 3. Passing 0.0 gives 4." },
          { text: "4.0", why: "That would need a floating-point starting value. With an int 0, every step truncates." },
          { text: "It will not compile", why: "It compiles cleanly. The starting value's type silently decides the accumulator's type, which is what makes this trap effective." },
        ],
        answer: 1,
      },
      viz: tracePipeline(),
      example: `#include <algorithm>
#include <numeric>

vector<int> v = {1, 2, 3, 4, 5};

// combine
int sum = accumulate(v.begin(), v.end(), 0);
double avg = accumulate(v.begin(), v.end(), 0.0) / v.size();  // 0.0!

// change each
vector<int> doubled(v.size());
transform(v.begin(), v.end(), doubled.begin(),
          [](int x){ return x * 2; });

// keep some
vector<int> evens;
copy_if(v.begin(), v.end(), back_inserter(evens),
        [](int x){ return x % 2 == 0; });

// ask a question
bool any = any_of(v.begin(), v.end(), [](int x){ return x > 4; });
bool all = all_of(v.begin(), v.end(), [](int x){ return x > 0; });
int n = count_if(v.begin(), v.end(), [](int x){ return x > 2; });

// C++20 ranges — left to right, and lazy
auto result = v | views::filter([](int x){ return x % 2 == 0; })
                | views::transform([](int x){ return x * 2; });`,
      notes: [
        { token: "accumulate(b, e, 0)", meaning: "combine. The 0 also fixes the TYPE" },
        { token: "transform", meaning: "change each. Needs somewhere to put the result" },
        { token: "copy_if + back_inserter", meaning: "keep some, growing the target as it goes" },
        { token: "views::filter | transform", meaning: "C++20. Left to right, and lazy" },
      ],
      challenge: {
        prompt:
          "Work out the average of a vector of ints. Watch the starting value — an int 0 would truncate the division.",
        starter: `double avg = accumulate(v.begin(), v.end(), ) / v.size();`,
        rules: {
          regex: ["accumulate\\s*\\(\\s*v\\.begin\\s*\\(\\s*\\)\\s*,\\s*v\\.end\\s*\\(\\s*\\)\\s*,\\s*0\\.0\\s*\\)"],
          hint: "Pass 0.0 rather than 0 — the starting value decides the type of the running total.",
          success:
            "Correct. With an int 0 the sum is an int and dividing by an unsigned size() gives integer division — two truncations in one line, and neither one warns you.",
        },
        solution: `double avg = accumulate(v.begin(), v.end(), 0.0) / v.size();`,
      },

      alt: {
        c: {
          hook:
            "Take a list of numbers, keep the even ones, double them, and add up the result. In C, how many loops is that?",
          body: [
            "One, and C is happy about it. There is no filter, no map and no reduce in the standard library, and no lambda to pass to them if there were.",
            "That is not a gap to work around — it is the language being honest about what the machine does. The three steps become three lines inside one loop, and the compiler produces almost exactly what you wrote.",
            "The names are still worth knowing, because you will meet them everywhere else, and because they describe what your loop body is doing even when you write it by hand.",
            "The one piece of machinery C does give you is the FUNCTION POINTER: `int (*f)(int)` is a variable holding a function, and you can pass it to another function.",
            "That is enough to write your own map or filter over an array, and it is exactly how `qsort` takes its comparison.",
            "There is a real cost to it, though. A function pointer call cannot be inlined by the compiler in most cases, so a hand-written loop is usually faster than a generic one taking a function pointer — the opposite of the trade in the other five languages.",
            "The practical advice: write the loop, name it well, and reach for function pointers when the operation genuinely needs to vary at run time.",
          ],
          predict: {
            ask: "What does this declare?",
            code: `int (*op)(int, int);`,
            choices: [
              { text: "A function op returning a pointer to int", why: "That would be int *op(int, int) — without the parentheses around *op." },
              { text: "A pointer to a function taking two ints and returning an int", why: "Correct. The parentheses around *op bind the star to the name first, so op is a pointer, and the rest describes what it points at." },
              { text: "An array of function pointers", why: "An array would need square brackets. This is a single pointer." },
              { text: "It is not valid C", why: "It is valid, and it is the standard way to declare a function pointer — the syntax is famously hard to read, not invalid." },
            ],
            answer: 1,
          },
          example: `/* the three steps, in one honest loop */
int total = 0;
for (int i = 0; i < len; i++) {
  if (nums[i] % 2 != 0) continue;    /* keep */
  int doubled = nums[i] * 2;         /* change */
  total += doubled;                  /* combine */
}

/* a function pointer: a variable holding a function */
int add(int a, int b) { return a + b; }
int (*op)(int, int) = add;
printf("%d", op(2, 3));              /* 5 */

/* your own map, taking a function pointer */
void map(int *dst, const int *src, int n, int (*f)(int)) {
  for (int i = 0; i < n; i++) dst[i] = f(src[i]);
}

int dbl(int x) { return x * 2; }
map(out, nums, len, dbl);

/* typedef makes the declaration readable */
typedef int (*IntOp)(int, int);
IntOp chosen = add;`,
          notes: [
            { token: "no filter/map/reduce", meaning: "C has none. Write the loop" },
            { token: "int (*op)(int, int)", meaning: "a pointer to a function. The parentheses matter" },
            { token: "typedef int (*IntOp)(int)", meaning: "names the type so declarations stay readable" },
            { token: "the cost", meaning: "a function pointer call usually cannot be inlined" },
          ],
          prompt:
            "Declare op as a pointer to a function taking two ints and returning an int, and point it at add.",
          starter: `int add(int a, int b) { return a + b; }

int  = add;
printf("%d", op(2, 3));`,
          rules: {
            regex: ["int\\s*\\(\\s*\\*\\s*op\\s*\\)\\s*\\(\\s*int\\s*,\\s*int\\s*\\)\\s*=\\s*add"],
            hint: "int (*op)(int, int) = add; — the parentheses around *op are what make op the pointer.",
            success:
              "Correct. Read it from the name outwards: op is a pointer, to a function, taking two ints, returning an int. That rule unpicks every C declaration, however ugly.",
          },
          solution: `int add(int a, int b) { return a + b; }

int (*op)(int, int) = add;
printf("%d", op(2, 3));`,
        },

        python: {
          body: [
            "One line, and Python has a shape built into the language for it: the comprehension.",
            "`[x * 2 for x in nums if x % 2 == 0]` reads as 'double x, for each x in nums, where x is even'. The changing part is at the front, the keeping part at the back.",
            "That one form covers filter and map together, and it is the idiomatic Python answer — more so than the `map()` and `filter()` functions, which exist and are rarely the clearest choice.",
            "For combining, use the built-ins first: `sum`, `max`, `min`, `any`, `all`, `len`. `functools.reduce` exists for the general case and Python deliberately keeps it out of the way, because a plain loop is usually clearer.",
            "Swap the square brackets for round ones and you get a GENERATOR: `sum(x * 2 for x in nums if x % 2 == 0)` never builds the intermediate list at all. For a million items that is a real memory difference.",
            "The same shape builds dicts and sets: `{k: v for ...}` and `{x for ...}`.",
            "The one rule of thumb: if a comprehension needs more than one `for` and an `if`, it has stopped being clearer than the loop. Write the loop.",
          ],
          predict: {
            ask: "What is the difference between these two lines?",
            code: `a = sum([x * 2 for x in range(1000000)])
b = sum(x * 2 for x in range(1000000))`,
            choices: [
              { text: "None — they give the same answer the same way", why: "They give the same answer by different means: one builds a million-item list first, the other does not." },
              { text: "The first builds a million-item list; the second builds nothing", why: "Correct. Square brackets build the whole list in memory before summing it. Round brackets make a generator, which produces one value at a time — same answer, a fraction of the memory." },
              { text: "The second is a syntax error", why: "A generator expression as a sole function argument needs no extra brackets — this is standard and idiomatic." },
              { text: "The second is slower because it is lazy", why: "It is usually slightly faster, and uses far less memory, because nothing large is ever allocated." },
            ],
            answer: 1,
          },
          example: `nums = [1, 2, 3, 4, 5]

# keep and change, in one shape
doubled = [x * 2 for x in nums]
evens   = [x for x in nums if x % 2 == 0]
both    = [x * 2 for x in nums if x % 2 == 0]

# a GENERATOR — nothing is built in memory
total = sum(x * 2 for x in nums if x % 2 == 0)

# combine, with the built-ins first
print(sum(nums), max(nums), min(nums), len(nums))
print(any(x > 4 for x in nums))
print(all(x > 0 for x in nums))
print(max(people, key=lambda p: p.age))

# the general case, kept deliberately out of the way
from functools import reduce
product = reduce(lambda a, b: a * b, nums, 1)

# the same shape for dicts and sets
squares = {x: x * x for x in nums}
distinct = {x % 3 for x in nums}

# walking two lists together
for a, b in zip(names, ages):
    print(a, b)`,
          notes: [
            { token: "[f(x) for x in xs if p(x)]", meaning: "change at the front, keep at the back" },
            { token: "(f(x) for x in xs)", meaning: "round brackets: a generator. Builds nothing" },
            { token: "sum / any / all / max", meaning: "the combining step. Reach for these first" },
            { token: "zip(a, b)", meaning: "walk two lists together, item by item" },
          ],
          prompt:
            "Add up the doubles of the even numbers — in one line, without building a list in memory.",
          starter: `total = sum()`,
          rules: {
            regex: ["sum\\s*\\(\\s*x\\s*\\*\\s*2\\s+for\\s+x\\s+in\\s+nums\\s+if\\s+x\\s*%\\s*2\\s*==\\s*0\\s*\\)"],
            mustNot: ["sum([x * 2"],
            hint: "sum(x * 2 for x in nums if x % 2 == 0) — no square brackets inside sum.",
            success:
              "Correct. Dropping the square brackets is a free win here: the answer is identical and nothing is ever held in memory, which matters as soon as the list is large.",
          },
          solution: `total = sum(x * 2 for x in nums if x % 2 == 0)`,
        },

        java: {
          body: [
            "One line, using a STREAM — Java's pipeline over a collection.",
            "`nums.stream().filter(x -> x % 2 == 0).mapToInt(x -> x * 2).sum()` reads left to right: the source, then the steps, then the answer.",
            "A stream has two kinds of step. Intermediate ones — `filter`, `map`, `sorted`, `distinct`, `limit` — build up the pipeline and do nothing yet. Terminal ones — `collect`, `sum`, `count`, `forEach`, `findFirst` — make it actually run.",
            "That laziness is the point: nothing is computed until a terminal step asks for it, and then the items flow through the whole pipeline one at a time rather than building an intermediate list per step.",
            "`collect(Collectors.toList())` is the usual ending, and `toList()` is the shorter modern form. `Collectors.groupingBy` is the one worth knowing beyond that — it turns a list into a map of groups in one call.",
            "The primitive streams matter for numbers: `mapToInt` gives you an `IntStream` with `sum()`, `average()` and `max()` built in, and it avoids boxing every value into an Integer.",
            "One warning: a stream can only be used once. Calling a second terminal operation on the same stream throws IllegalStateException.",
          ],
          predict: {
            ask: "What does this Java code print?",
            code: `List<Integer> nums = List.of(1, 2, 3);

Stream<Integer> s = nums.stream().filter(x -> x > 1);

System.out.println(s.count());
System.out.println(s.count());`,
            choices: [
              { text: "2 then 2", why: "A stream is consumed by its terminal operation and cannot be reused." },
              { text: "2 then IllegalStateException", why: "Correct. count() is a terminal operation, and it consumes the stream. The second call throws 'stream has already been operated upon or closed'." },
              { text: "2 then 0", why: "The second call does not return an empty result — it throws, because the stream is closed rather than empty." },
              { text: "It will not compile", why: "Holding a Stream in a variable is legal. The problem only appears when you use it twice at run time." },
            ],
            answer: 1,
          },
          example: `List<Integer> nums = List.of(1, 2, 3, 4, 5);

// keep, change, combine — left to right
int total = nums.stream()
                .filter(x -> x % 2 == 0)
                .mapToInt(x -> x * 2)
                .sum();

// back to a list
List<Integer> doubled = nums.stream()
                            .map(x -> x * 2)
                            .toList();

// ask a question
boolean any = nums.stream().anyMatch(x -> x > 4);
boolean all = nums.stream().allMatch(x -> x > 0);
long n = nums.stream().filter(x -> x > 2).count();

// primitive streams avoid boxing and add sum/average/max
OptionalDouble avg = nums.stream().mapToInt(Integer::intValue).average();

// grouping — the one that saves the most code
Map<Integer, List<P>> byAge =
    people.stream().collect(Collectors.groupingBy(P::getAge));

Map<Boolean, List<Integer>> split =
    nums.stream().collect(Collectors.partitioningBy(x -> x > 2));

String joined = nums.stream().map(String::valueOf)
                    .collect(Collectors.joining(", "));`,
          notes: [
            { token: "filter / map / sorted", meaning: "intermediate. Lazy — nothing runs yet" },
            { token: "collect / sum / count", meaning: "terminal. This is what makes it run" },
            { token: "mapToInt", meaning: "an IntStream. No boxing, and sum/average built in" },
            { token: "groupingBy", meaning: "a list into a map of groups, in one call" },
          ],
          prompt:
            "Add up the doubles of the even numbers, as one stream pipeline. Use the primitive stream so sum() is available.",
          starter: `int total = nums.stream()
                (x -> x % 2 == 0)
                (x -> x * 2)
                .sum();`,
          rules: {
            regex: ["\\.filter\\s*\\(\\s*x\\s*->\\s*x\\s*%\\s*2\\s*==\\s*0\\s*\\)", "\\.mapToInt\\s*\\(\\s*x\\s*->\\s*x\\s*\\*\\s*2\\s*\\)"],
            hint: ".filter(...) to keep, then .mapToInt(...) to change — mapToInt rather than map, because sum() lives on IntStream.",
            success:
              "Correct. Using map instead would leave you with a Stream<Integer>, which has no sum() — you would need .reduce(0, Integer::sum) instead, and box every value along the way.",
          },
          solution: `int total = nums.stream()
                .filter(x -> x % 2 == 0)
                .mapToInt(x -> x * 2)
                .sum();`,
        },

        javascript: {
          body: [
            "One line, chaining array methods: `nums.filter(x => x % 2 === 0).map(x => x * 2).reduce((a, b) => a + b, 0)`.",
            "These three are the whole pattern, and JavaScript names them exactly as the general idea does — which makes it a good language to learn the idea in.",
            "`filter` keeps items and returns a new array. `map` changes each item and returns a new array of the same length. `reduce` folds everything into one value.",
            "None of the three modifies the original array. That is worth relying on: `arr.map(...)` gives you a new array and leaves `arr` alone.",
            "`reduce` takes a starting value as its second argument, and you should almost always pass one — without it, reduce uses the first item as the start and THROWS on an empty array.",
            "The cost is that each step builds a whole intermediate array. For a handful of items that is invisible; for a million it is three million-item arrays. When it matters, use one loop or a `for...of`.",
            "The others worth knowing: `find` and `findIndex` for the first match, `some` and `every` for yes-or-no questions, and `flatMap` for when each item produces several.",
          ],
          predict: {
            ask: "What does this print?",
            code: `console.log([].reduce((a, b) => a + b, 0));
console.log([].reduce((a, b) => a + b));`,
            choices: [
              { text: "0 then 0", why: "Without a starting value, reduce on an empty array has nothing to return and throws." },
              { text: "0 then TypeError", why: "Correct. With a starting value, an empty array gives you that value back. Without one, reduce has no first item to start from and throws 'Reduce of empty array with no initial value'." },
              { text: "0 then undefined", why: "It does not return undefined — it throws a TypeError, which is why passing a starting value is the safe habit." },
              { text: "TypeError twice", why: "The first call is fine: the starting value of 0 is what it returns when there is nothing to fold." },
            ],
            answer: 1,
          },
          example: `const nums = [1, 2, 3, 4, 5];

// keep, change, combine — each returns a NEW array
const total = nums
  .filter(x => x % 2 === 0)
  .map(x => x * 2)
  .reduce((a, b) => a + b, 0);        // always pass the 0

// find the first match
nums.find(x => x > 3);          // the value, or undefined
nums.findIndex(x => x > 3);     // the index, or -1

// yes or no
nums.some(x => x > 4);
nums.every(x => x > 0);

// each item produces several
[[1, 2], [3]].flat();                     // [1, 2, 3]
nums.flatMap(x => [x, x]);                // [1, 1, 2, 2, ...]

// grouping
const byAge = Object.groupBy(people, p => p.age);

// the cost: three intermediate arrays.
// For a million items, one loop instead:
let sum = 0;
for (const x of nums) if (x % 2 === 0) sum += x * 2;`,
          notes: [
            { token: "filter / map / reduce", meaning: "keep, change, combine. None modifies the original" },
            { token: "reduce(fn, 0)", meaning: "always pass the start. Empty + no start throws" },
            { token: "find vs filter", meaning: "the first match, versus all of them" },
            { token: "the cost", meaning: "each step builds a whole new array" },
          ],
          prompt:
            "Add up the doubles of the even numbers, chaining the three methods. Give reduce a starting value.",
          starter: `const total = nums
  .(x => x % 2 === 0)
  .(x => x * 2)
  .((a, b) => a + b);`,
          rules: {
            regex: ["\\.filter\\s*\\(\\s*x\\s*=>\\s*x\\s*%\\s*2\\s*===\\s*0\\s*\\)", "\\.map\\s*\\(\\s*x\\s*=>\\s*x\\s*\\*\\s*2\\s*\\)", "\\.reduce\\s*\\(\\s*\\(\\s*a\\s*,\\s*b\\s*\\)\\s*=>\\s*a\\s*\\+\\s*b\\s*,\\s*0\\s*\\)"],
            hint: "filter, then map, then reduce((a, b) => a + b, 0) — the 0 at the end is the starting value.",
            success:
              "Correct. That trailing 0 is not decoration: without it this line throws on an empty array, which is exactly the case that only turns up in production.",
          },
          solution: `const total = nums
  .filter(x => x % 2 === 0)
  .map(x => x * 2)
  .reduce((a, b) => a + b, 0);`,
        },

        rust: {
          body: [
            "One chain of ITERATORS: `nums.iter().filter(|x| *x % 2 == 0).map(|x| x * 2).sum()`.",
            "Rust's iterators are lazy in a way that matters. `filter` and `map` build up a description of the work and do nothing. Nothing runs until an ADAPTER at the end asks for a result.",
            "That end is `sum`, `collect`, `count`, `max`, `fold`, `for_each` — and if you leave it off, the compiler warns you that iterators are lazy and do nothing unless consumed.",
            "The laziness means no intermediate collections are built at all. Where JavaScript's chain makes three arrays, Rust's makes none — the whole chain compiles down to roughly the loop you would have written by hand.",
            "`collect()` is the one to understand properly. It builds whatever collection you ask for, and it works out which from the type: `let v: Vec<i32> = ...collect();` or `...collect::<Vec<i32>>()`.",
            "It also does something clever: collecting an iterator of `Result`s into a `Result<Vec<_>, _>` gives you the first error, or the whole vector if every item succeeded. That one line replaces a lot of error handling.",
            "The choice between `iter()`, `iter_mut()` and `into_iter()` is the ownership question again: borrow to read, borrow to modify, or consume the collection entirely.",
          ],
          predict: {
            ask: "What does the Rust compiler say about this?",
            code: `let nums = vec![1, 2, 3];

nums.iter().map(|x| println!("{}", x));`,
            choices: [
              { text: "It prints 1, 2, 3", why: "map is lazy. Without something consuming the iterator, the closure never runs." },
              { text: "It compiles with a warning, and prints nothing", why: "Correct. The warning says iterators are lazy and do nothing unless consumed. Nothing is printed — you want .for_each(...) or a plain for loop here." },
              { text: "It is a compile error", why: "It is a warning rather than an error — the code is valid, it simply does nothing." },
              { text: "It prints 1, 2, 3 and warns about the unused result", why: "Nothing prints at all. The closure inside map is never called, because nothing pulls values through the iterator." },
            ],
            answer: 1,
          },
          example: `let nums = vec![1, 2, 3, 4, 5];

// keep, change, combine — and nothing runs until sum()
let total: i32 = nums.iter()
    .filter(|x| *x % 2 == 0)
    .map(|x| x * 2)
    .sum();

// collect decides the collection from the TYPE
let doubled: Vec<i32> = nums.iter().map(|x| x * 2).collect();
let set: HashSet<i32> = nums.iter().copied().collect();

// ask a question
nums.iter().any(|x| *x > 4);
nums.iter().all(|x| *x > 0);
nums.iter().count();
nums.iter().max();
nums.iter().position(|x| *x == 3);      // Option<usize>

// fold is the general combine
let product: i32 = nums.iter().fold(1, |acc, x| acc * x);

// index and item
for (i, x) in nums.iter().enumerate() { }
for (a, b) in names.iter().zip(ages.iter()) { }

// collecting Results: the first error, or the whole vec
let parsed: Result<Vec<i32>, _> =
    strs.iter().map(|s| s.parse::<i32>()).collect();`,
          notes: [
            { token: "iter() / iter_mut() / into_iter()", meaning: "borrow, borrow mutably, or consume" },
            { token: "lazy", meaning: "nothing runs until sum, collect or count" },
            { token: "collect()", meaning: "builds the collection named by the TYPE" },
            { token: "collect into Result", meaning: "first error, or the whole vec. One line" },
          ],
          prompt:
            "Add up the doubles of the even numbers as one iterator chain, collecting the total with sum.",
          starter: `let total: i32 = nums.iter()
    (|x| *x % 2 == 0)
    (|x| x * 2)
    ();`,
          rules: {
            regex: ["\\.filter\\s*\\(\\s*\\|x\\|\\s*\\*x\\s*%\\s*2\\s*==\\s*0\\s*\\)", "\\.map\\s*\\(\\s*\\|x\\|\\s*x\\s*\\*\\s*2\\s*\\)", "\\.sum\\s*\\(\\s*\\)"],
            hint: ".filter(...).map(...).sum() — and the type annotation on total is what tells sum what to produce.",
            success:
              "Correct. The `: i32` is doing real work: sum() can produce any summable type, so without the annotation the compiler asks you which one you meant.",
          },
          solution: `let total: i32 = nums.iter()
    .filter(|x| *x % 2 == 0)
    .map(|x| x * 2)
    .sum();`,
        },
      },
    },

    /* -------------------------------------------------------- compare -- */
    {
      id: "compare",
      kicker: "03",
      title: "Comparing things properly",
      hook:
        "Two objects hold exactly the same values. Are they equal? In three of these languages, the honest answer is 'it depends what you asked'.",
      body: [
        "There are two different questions, and most languages give you two different operators for them.",
        "IDENTITY asks 'are these the same object in memory?'. EQUALITY asks 'do these hold the same values?'.",
        "For plain numbers the distinction does not arise. For objects it decides whether your comparison, your sort, your set and your map behave the way you expect.",
        "In C++ the default is unusually convenient: `==` on a struct or class does whatever you defined it to do, and since C++20 you can get a sensible default with one line — `auto operator<=>(const P&) const = default;` gives you every comparison at once.",
        "That `<=>` is the three-way comparison operator, and it hands back 'less', 'equal' or 'greater' in a single call. Defining it once gives you `<`, `>`, `<=`, `>=` and `==` for free.",
        "The rule that matters everywhere: whatever you use for equality must agree with whatever you use for ordering and hashing. Two things that compare equal must hash the same, or they will both end up in a set that should hold one.",
        "And floating point is its own trap in every language. `0.1 + 0.2 == 0.3` is false, because those values cannot be stored exactly. Compare with a tolerance instead.",
      ],
      predict: {
        ask: "What does this C++ code print?",
        code: `double a = 0.1 + 0.2;

cout << (a == 0.3) << " ";
cout << setprecision(17) << a;`,
        choices: [
          { text: "1 and 0.3", why: "0.1 and 0.2 have no exact binary representation, so their sum is very slightly off." },
          { text: "0 and 0.30000000000000004", why: "Correct. Binary floating point cannot store 0.1 or 0.2 exactly, so the sum lands a tiny distance from 0.3 and the comparison is false." },
          { text: "1 and 0.30000000000000004", why: "If the value is not exactly 0.3, then == against 0.3 cannot be true." },
          { text: "It will not compile without <cmath>", why: "Adding doubles and comparing them needs no headers. The surprise is in the arithmetic, not the compilation." },
        ],
        answer: 1,
      },
      viz: traceEquality(),
      example: `// C++20: every comparison from one line
struct P {
  string name;
  int age;
  auto operator<=>(const P&) const = default;   // < > <= >=
  bool operator==(const P&) const = default;    // ==
};

P a{"ada", 36}, b{"ada", 36};
cout << (a == b);          // 1 — compares the FIELDS

// the older way: define what you need
bool operator<(const P& x, const P& y) { return x.age < y.age; }

// pointers compare IDENTITY, not contents
P* p = &a;
P* q = &b;
cout << (p == q);          // 0 — different objects
cout << (*p == *q);        // 1 — same values

// floating point: never ==
double x = 0.1 + 0.2;
cout << (x == 0.3);                    // 0
cout << (abs(x - 0.3) < 1e-9);         // 1 — compare with a tolerance

// strings compare by CONTENT in C++
string s = "hi";
cout << (s == "hi");       // 1`,
      notes: [
        { token: "operator<=> = default", meaning: "C++20. Every ordering comparison from one line" },
        { token: "p == q on pointers", meaning: "identity. *p == *q compares contents" },
        { token: "abs(x - y) < 1e-9", meaning: "how to compare floats. Never ==" },
        { token: "string ==", meaning: "compares content in C++, unlike Java and C" },
      ],
      challenge: {
        prompt:
          "Compare two doubles safely, treating them as equal when they are within a millionth of each other.",
        starter: `if () {
  cout << "close enough";
}`,
        rules: {
          regex: ["(abs|fabs|std::abs)\\s*\\(\\s*x\\s*-\\s*y\\s*\\)\\s*<\\s*1e-6"],
          hint: "abs(x - y) < 1e-6 — the distance between them, compared against a small tolerance.",
          success:
            "Correct. This is the fixed-tolerance version and it is fine for values near 1. For very large numbers a relative tolerance is better, because a millionth stops being a meaningful gap.",
        },
        solution: `if (abs(x - y) < 1e-6) {
  cout << "close enough";
}`,
      },

      alt: {
        c: {
          body: [
            "There are two different questions, and C gives you one operator and expects you to know which you meant.",
            "`==` on numbers compares values. `==` on pointers compares ADDRESSES — are these the same object? `==` on structs does not compile at all.",
            "That last one surprises people: you cannot compare two structs with `==` in C. You write a function that compares the fields, or you compare the bytes with `memcmp`.",
            "`memcmp` is tempting and usually wrong. A struct can contain PADDING — unused bytes the compiler inserts for alignment — and those bytes hold whatever was in memory. Two structs with identical fields can differ in their padding, and memcmp will say they are different.",
            "Strings are the everyday case. `s1 == s2` compares two addresses and is almost never what you meant. `strcmp(s1, s2) == 0` compares the text.",
            "Floating point is the same trap as everywhere: `0.1 + 0.2 == 0.3` is false. Compare `fabs(a - b) < 1e-9` instead.",
            "The practical rule for C: write a small `equals` function for each struct type that matters, comparing field by field, and use it everywhere.",
          ],
          predict: {
            ask: "Why can memcmp say two structs are different when all their fields match?",
            code: `struct S { char c; int n; };

struct S a = {'x', 1};
struct S b = {'x', 1};

memcmp(&a, &b, sizeof(struct S));   /* may not be 0 */`,
            choices: [
              { text: "It cannot — identical fields mean identical bytes", why: "The compiler inserts padding bytes between fields for alignment, and those bytes are not initialised to anything in particular." },
              { text: "The padding bytes between c and n hold whatever was in memory", why: "Correct. A char followed by an int usually has three padding bytes inserted for alignment. Those bytes are not set by the initialisation, so they can differ between two otherwise identical structs." },
              { text: "memcmp only works on strings", why: "memcmp works on any bytes. The problem is that a struct's bytes include padding you never wrote to." },
              { text: "sizeof is wrong for structs", why: "sizeof gives the correct size including padding — that is exactly why the padding is included in the comparison." },
            ],
            answer: 1,
          },
          example: `/* numbers: == compares values */
if (a == b) { }

/* pointers: == compares ADDRESSES */
if (p == q) { }             /* the same object? */

/* strings: use strcmp, never == */
if (strcmp(s1, s2) == 0) { }

/* structs: == does not compile. Write a function */
int p_equal(const struct P *a, const struct P *b) {
  return a->age == b->age && strcmp(a->name, b->name) == 0;
}

/* memcmp is tempting and usually wrong — padding bytes */
/* memcmp(&a, &b, sizeof a)   may differ despite equal fields */

/* floating point: never == */
#include <math.h>
if (fabs(x - y) < 1e-9) { }

/* NULL checks: be explicit */
if (p != NULL) { }`,
          notes: [
            { token: "== on structs", meaning: "does not compile in C. Write a function" },
            { token: "memcmp on structs", meaning: "unreliable. Padding bytes are not initialised" },
            { token: "strcmp(a, b) == 0", meaning: "compares text. == compares addresses" },
            { token: "fabs(x - y) < 1e-9", meaning: "how to compare floats" },
          ],
          prompt:
            "Write p_equal so it compares both fields properly — the number with ==, and the name with strcmp.",
          starter: `int p_equal(const struct P *a, const struct P *b) {
  return a->age  b->age &&  == 0;
}`,
          rules: {
            regex: ["a->age\\s*==\\s*b->age", "strcmp\\s*\\(\\s*a->name\\s*,\\s*b->name\\s*\\)\\s*==\\s*0"],
            hint: "a->age == b->age && strcmp(a->name, b->name) == 0",
            success:
              "Correct, and the && matters for more than tidiness: it short-circuits, so when the ages differ strcmp is never called — which also means a null name is never dereferenced in that case.",
          },
          solution: `int p_equal(const struct P *a, const struct P *b) {
  return a->age == b->age && strcmp(a->name, b->name) == 0;
}`,
        },

        python: {
          body: [
            "There are two different questions, and Python is the clearest of the six about which is which.",
            "`==` asks whether the values are equal. `is` asks whether they are the SAME OBJECT. They are different operators, and mixing them up is a classic bug.",
            "`[1, 2] == [1, 2]` is True — same contents. `[1, 2] is [1, 2]` is False — two separate lists.",
            "The rule: use `==` for everything except `None`, `True` and `False`, where `is` is correct and conventional. `if x is None:` is the right form.",
            "Small integers and short strings sometimes appear to work with `is` because Python reuses them internally. That is an implementation detail, it changes between versions, and relying on it is how you get a bug that only appears in production.",
            "For your own classes, define `__eq__` to say what equal means. If you do, define `__hash__` too — otherwise your objects become unhashable and cannot go in a set or be used as dict keys.",
            "A `dataclass` gives you both for free: `@dataclass(frozen=True)` gets you equality by fields and a working hash in one line.",
            "Floating point behaves as it does everywhere: `0.1 + 0.2 == 0.3` is False. Use `math.isclose(a, b)`, which handles both absolute and relative tolerance properly.",
          ],
          predict: {
            ask: "What does this Python code print?",
            code: `a = [1, 2]
b = [1, 2]

print(a == b, a is b)
print(0.1 + 0.2 == 0.3)`,
            choices: [
              { text: "True True, then True", why: "a and b are two separately built lists, so they are not the same object, and 0.1 + 0.2 is not exactly 0.3." },
              { text: "True False, then False", why: "Correct. == compares contents and says they are equal; `is` compares identity and says they are two different lists. And binary floating point cannot store 0.1 and 0.2 exactly, so the sum misses 0.3." },
              { text: "False False, then False", why: "== on lists compares item by item, so two lists with the same contents are equal." },
              { text: "True True, then False", why: "`is` is False here — the two lists are built separately and live at different addresses." },
            ],
            answer: 1,
          },
          example: `a = [1, 2]
b = [1, 2]

print(a == b)          # True — same contents
print(a is b)          # False — different objects

# use is for None, True and False. Nothing else
if x is None: pass
if x is not None: pass

# your own class
from dataclasses import dataclass

@dataclass(frozen=True)      # equality AND hashing, for free
class P:
    name: str
    age: int

print(P("ada", 36) == P("ada", 36))    # True

# by hand: define both, or the object becomes unhashable
class Q:
    def __eq__(self, other): return self.age == other.age
    def __hash__(self): return hash(self.age)

# floating point
import math
print(0.1 + 0.2 == 0.3)                # False
print(math.isclose(0.1 + 0.2, 0.3))    # True

# exact decimals, when money is involved
from decimal import Decimal
print(Decimal("0.1") + Decimal("0.2") == Decimal("0.3"))   # True`,
          notes: [
            { token: "==", meaning: "same contents. What you almost always want" },
            { token: "is", meaning: "the same object. Only for None, True and False" },
            { token: "@dataclass(frozen=True)", meaning: "equality and hashing in one line" },
            { token: "math.isclose", meaning: "the correct way to compare floats" },
          ],
          prompt:
            "Test whether x is None, using the operator Python expects for it.",
          starter: `if x  None:
    print("nothing here")`,
          rules: {
            regex: ["if\\s+x\\s+is\\s+None\\s*:"],
            mustNot: ["x == None"],
            hint: "if x is None: — identity, not equality.",
            success:
              "Correct. It is not only style: a class can define __eq__ to return True for anything, so `x == None` can lie. `is None` compares identity and cannot be overridden.",
          },
          solution: `if x is None:
    print("nothing here")`,
        },

        java: {
          body: [
            "There are two different questions, and Java's answer is the most notorious trap in the language.",
            "`==` compares REFERENCES for objects — are these the same object? `.equals()` compares contents. For primitives, `==` compares values and is correct.",
            "So `s1 == s2` on two Strings compares addresses. It sometimes works, because Java pools identical string literals, and that is what makes it dangerous: the bug passes your test and fails on input read from a file.",
            "The rule: `==` for primitives and for null, `.equals()` for everything else.",
            "`Objects.equals(a, b)` is the null-safe version, and it is worth the habit — it returns true when both are null and never throws.",
            "For your own classes, override BOTH `equals` and `hashCode`. Override just one and things break quietly: a HashSet will store two objects you consider equal, or fail to find one you just put in.",
            "The contract is short and non-negotiable: equal objects must have equal hash codes. A `record` implements both correctly for you, which is the easiest way to get it right.",
            "Integer caching is the other trap: `Integer a = 127, b = 127; a == b` is true, but with 128 it is false, because Java caches boxed integers from -128 to 127. Always compare boxed numbers with `.equals()` or unbox them first.",
          ],
          predict: {
            ask: "What does this Java code print?",
            code: `Integer a = 127, b = 127;
Integer c = 128, d = 128;

System.out.println(a == b);
System.out.println(c == d);`,
            choices: [
              { text: "true then true", why: "Only the small values are cached. 128 is outside the cache, so two separate Integer objects are created." },
              { text: "true then false", why: "Correct. Java caches boxed Integers from -128 to 127, so a and b are the same object. 128 is outside that range, so c and d are two objects and == compares their references." },
              { text: "false then false", why: "The cache makes the first comparison true, which is exactly what makes this bug so hard to spot." },
              { text: "It will not compile", why: "Comparing two Integer references with == is legal Java. The compiler has no reason to object." },
            ],
            answer: 1,
          },
          example: `String a = "hi";
String b = new String("hi");

System.out.println(a == b);          // false — different objects
System.out.println(a.equals(b));     // true — same text

// null-safe, and never throws
System.out.println(Objects.equals(a, b));

// boxed numbers: the cache trap
Integer x = 128, y = 128;
System.out.println(x == y);          // false
System.out.println(x.equals(y));     // true

// your own class: a record gets both, correctly
record P(String name, int age) {}
System.out.println(new P("ada", 36).equals(new P("ada", 36)));  // true

// by hand: override BOTH, or sets and maps misbehave
@Override public boolean equals(Object o) {
  if (this == o) return true;
  if (!(o instanceof P other)) return false;
  return age == other.age && Objects.equals(name, other.name);
}
@Override public int hashCode() { return Objects.hash(name, age); }

// floating point
System.out.println(Math.abs(x - y) < 1e-9);`,
          notes: [
            { token: "== on objects", meaning: "compares references. Use .equals() for content" },
            { token: "Objects.equals(a, b)", meaning: "null-safe. Never throws" },
            { token: "equals + hashCode", meaning: "override both, always. Equal objects must hash the same" },
            { token: "Integer cache", meaning: "-128 to 127 are shared. == lies outside that range" },
          ],
          prompt:
            "Compare a and b safely, so that two nulls count as equal and neither one can throw.",
          starter: `if () {
  System.out.println("same");
}`,
          rules: {
            regex: ["Objects\\.equals\\s*\\(\\s*a\\s*,\\s*b\\s*\\)"],
            mustNot: ["a == b"],
            hint: "Objects.equals(a, b) handles the null cases for you.",
            success:
              "Correct. a.equals(b) would throw when a is null, and a == b would compare references — Objects.equals does the right thing in every case, which is why it is the safe default.",
          },
          solution: `if (Objects.equals(a, b)) {
  System.out.println("same");
}`,
        },

        javascript: {
          body: [
            "There are two different questions, and JavaScript adds a third problem on top: two equality operators that do different amounts of converting.",
            "`===` compares without converting anything. `==` converts first, and the conversion rules are complicated enough that even experienced programmers do not remember them all.",
            "The rule is simple though: always use `===`. The only common exception is `x == null`, which is true for both null and undefined and is a genuinely useful shorthand.",
            "For objects, both `==` and `===` compare IDENTITY. `{a: 1} === {a: 1}` is false, because those are two different objects.",
            "There is no built-in deep equality. To compare contents you write a function, use a library, or compare `JSON.stringify(a) === JSON.stringify(b)` — which works for simple data and breaks on key order, undefined values and anything cyclic.",
            "`Object.is` is the third comparison, and it fixes two `===` oddities: `Object.is(NaN, NaN)` is true, and `Object.is(0, -0)` is false. You rarely need it, and when you do, nothing else will work.",
            "Floating point behaves as everywhere else: `0.1 + 0.2 === 0.3` is false. Compare with a tolerance.",
          ],
          predict: {
            ask: "What does this print?",
            code: `console.log([] == false);
console.log([] === false);
console.log(NaN === NaN);`,
            choices: [
              { text: "true, false, false", why: "Correct. With ==, the empty array converts to \"\" then to 0, and false converts to 0, so they match. === does no converting, so an array is never a boolean. And NaN is the one value not equal to itself." },
              { text: "false, false, false", why: "== converts both sides before comparing, and an empty array and false both end up as 0." },
              { text: "true, true, false", why: "=== compares types first — an object and a boolean are different types, so it is false without any conversion." },
              { text: "true, false, true", why: "NaN === NaN is false by design. Use Number.isNaN(x) or Object.is to test for it." },
            ],
            answer: 0,
          },
          example: `console.log(1 === "1");     // false — no conversion
console.log(1 == "1");      // true  — converts first. Avoid

// the one useful ==
if (x == null) { }          // true for null AND undefined

// objects compare by IDENTITY
console.log({a: 1} === {a: 1});    // false
console.log([1] === [1]);          // false

// no built-in deep equality
const same = JSON.stringify(a) === JSON.stringify(b);  // fragile

// the special cases
console.log(NaN === NaN);          // false
console.log(Number.isNaN(NaN));    // true — the right test
console.log(Object.is(NaN, NaN));  // true
console.log(Object.is(0, -0));     // false

// floating point
console.log(0.1 + 0.2 === 0.3);            // false
console.log(Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON);  // true

// falsy values, which trip up truthiness checks
// false, 0, -0, 0n, "", null, undefined, NaN`,
          notes: [
            { token: "===", meaning: "no conversion. Always use this" },
            { token: "x == null", meaning: "the one useful ==. Catches null and undefined" },
            { token: "objects", meaning: "compared by identity. No deep equality built in" },
            { token: "Number.isNaN(x)", meaning: "the right NaN test. NaN === NaN is false" },
          ],
          prompt:
            "Test whether n is NaN, using the check that actually works.",
          starter: `if () {
  console.log("not a number");
}`,
          rules: {
            regex: ["Number\\.isNaN\\s*\\(\\s*n\\s*\\)"],
            mustNot: ["n === NaN", "n == NaN"],
            hint: "Number.isNaN(n) — comparing against NaN with === is always false, including for NaN itself.",
            success:
              "Correct, and prefer Number.isNaN over the older global isNaN: the global one converts its argument first, so isNaN(\"hello\") is true even though a string is not a NaN.",
          },
          solution: `if (Number.isNaN(n)) {
  console.log("not a number");
}`,
        },

        rust: {
          body: [
            "There are two different questions, and Rust answers them with traits rather than operators — which turns out to be the cleanest arrangement of the six.",
            "`==` compares VALUES, always. There is no identity comparison hiding behind it, because Rust has no null and no implicit references. Comparing two `&T` compares what they point at.",
            "For your own types, `==` only works if you have opted in: `#[derive(PartialEq)]` compares field by field. Without it, the code does not compile — no silent fallback to identity, as in Java.",
            "The split between `PartialEq` and `Eq` is worth a moment. `PartialEq` means 'these can be compared and may be equal'. `Eq` adds the promise that every value is equal to itself.",
            "Floats implement only `PartialEq`, because NaN is not equal to itself. That is why an `f64` cannot be a HashMap key — the compiler stops you, rather than letting you build a map that loses entries.",
            "The same split exists for ordering: `PartialOrd` gives `<` and `>` and can say 'these are not comparable'; `Ord` promises a total order. Sorting needs `Ord`, which is why sorting floats needs `partial_cmp` and an explicit decision about NaN.",
            "`#[derive(PartialEq, Eq, PartialOrd, Ord, Hash)]` gives you the lot, and derived ordering compares fields in DECLARATION ORDER — so the order you write your struct's fields in decides how it sorts.",
          ],
          predict: {
            ask: "Why does this Rust code fail to compile?",
            code: `use std::collections::HashMap;

let mut m: HashMap<f64, &str> = HashMap::new();
m.insert(1.5, "a");`,
            choices: [
              { text: "f64 is too large to be a key", why: "Size is not the issue — f64 is the same size as i64, which is a perfectly good key." },
              { text: "f64 does not implement Eq and Hash, because NaN is not equal to itself", why: "Correct. A HashMap key must implement Eq, which promises every value equals itself. NaN breaks that promise, so f64 implements only PartialEq — and the compiler refuses rather than letting you build a map that could lose entries." },
              { text: "The map needs to be declared with a type annotation", why: "The annotation is right there. The problem is the trait bounds on the key type." },
              { text: "Floats cannot be hashed at all", why: "The bits could certainly be hashed. Rust refuses because equality is not well-behaved for floats, not because hashing is impossible." },
            ],
            answer: 1,
          },
          example: `// opt in, field by field
#[derive(PartialEq, Eq, PartialOrd, Ord, Hash, Debug, Clone)]
struct P {
    age: i32,        // derived ordering compares in THIS order
    name: String,
}

let a = P { age: 36, name: "ada".into() };
let b = P { age: 36, name: "ada".into() };
println!("{}", a == b);        // true — compares the fields

// == always compares values, even through references
println!("{}", &a == &b);      // true

// floats: PartialEq only, because NaN != NaN
println!("{}", f64::NAN == f64::NAN);          // false
println!("{}", (0.1 + 0.2 - 0.3).abs() < 1e-9);// true

// which is why this will not compile:
// let m: HashMap<f64, &str> = HashMap::new();

// and why sorting floats needs a decision about NaN
let mut xs = vec![1.5, 0.5];
xs.sort_by(|a, b| a.partial_cmp(b).unwrap());

// custom equality: implement it yourself
impl PartialEq for P {
    fn eq(&self, other: &Self) -> bool { self.age == other.age }
}`,
          notes: [
            { token: "#[derive(PartialEq)]", meaning: "opt in. Without it, == does not compile" },
            { token: "PartialEq vs Eq", meaning: "may be equal, versus every value equals itself" },
            { token: "f64 has no Eq", meaning: "because NaN != NaN. So it cannot be a map key" },
            { token: "derived Ord", meaning: "compares fields in DECLARATION order" },
          ],
          prompt:
            "Give P everything it needs to be compared, sorted and used as a HashMap key.",
          starter: `#[derive()]
struct P {
    age: i32,
    name: String,
}`,
          rules: {
            regex: ["derive\\s*\\([^)]*PartialEq[^)]*\\)", "derive\\s*\\([^)]*\\bEq\\b[^)]*\\)", "derive\\s*\\([^)]*Hash[^)]*\\)", "derive\\s*\\([^)]*Ord[^)]*\\)"],
            hint: "#[derive(PartialEq, Eq, PartialOrd, Ord, Hash)] — equality for ==, Hash for the map key, Ord for sorting.",
            success:
              "Correct, and mind the field order: derived Ord compares age first and only looks at name when the ages match. Swapping the two fields in the struct silently changes how P sorts.",
          },
          solution: `#[derive(PartialEq, Eq, PartialOrd, Ord, Hash)]
struct P {
    age: i32,
    name: String,
}`,
        },
      },
    },
  ],
};
