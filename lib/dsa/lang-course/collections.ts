import type { TopicLesson } from "@/lib/dsa/lessons/types";
import { traceGrowth, traceIndexing, traceStringBytes } from "@/lib/dsa/viz/traceLang";

// Language track, topic 4.
//
// The divide here is fixed versus growable. C has only fixed arrays and makes
// you do the rest by hand; every other language ships a growable list and most
// people never touch a raw array again. Strings then repeat the same story with
// one extra twist: what counts as one character.

export const LANG_COLLECTIONS: TopicLesson = {
  id: "lang-collections",
  title: "Arrays & Strings",
  tagline: "Many values under one name, and text as data.",
  why:
    "A variable holds one thing. Almost every real program holds many — a list of scores, a row of pixels, the words in a sentence. This is the container everything else is built on: a hash map, a stack and a growable list are all an array underneath.",
  plain: [
    "An array is a run of boxes, side by side, under one name.",
    "You reach a box by its number, and the numbering starts at zero.",
    "Because the boxes are next to each other, reaching any one of them is instant — the machine works out the address by arithmetic.",
    "A string is the same shape, holding characters instead of numbers.",
  ],
  needs: ["Values and types from Fundamentals.", "Loops from Control Flow.", "Passing arguments from Functions."],
  traps: [
    "The last index is length minus 1, never length. This one mistake causes more crashes than any other.",
    "C and C++ do not check the index. Reading past the end gives you junk and no warning at all.",
    "Copying a list may copy the reference rather than the contents, so both names then point at the same list.",
    "Building a string by adding to it in a loop makes a new string every time. It is fine for ten and slow for a hundred thousand.",
    "A shallow copy of a list of objects copies the arrows, not the objects. Changing one still shows up in the other.",
  ],
  sections: [
    /* ------------------------------------------------------- indexing -- */
    {
      id: "many",
      kicker: "01",
      title: "Many values under one name",
      hook:
        "You have five scores. You could write score1, score2, score3, score4, score5 — and then be stuck the moment there are six. What do you write instead?",
      body: [
        "One name and a number. `nums[0]`, `nums[1]`, and so on — and now a loop can walk all of them, however many there are.",
        "The numbering starts at zero, which looks arbitrary until you see why. The index is a DISTANCE from the start: nums[0] is the box zero steps along, nums[3] is three steps along.",
        "That makes finding a box pure arithmetic — start address plus index times item size — which is why reaching nums[999999] costs exactly as much as nums[0].",
        "It also means the highest valid index is one less than the length. Five boxes, indexes 0 to 4. Nearly every off-by-one bug comes from forgetting that.",
        "C++ gives you two array types. A raw `int nums[5]` is a fixed run of boxes. A `vector<int>` grows as you add to it, and is what you should reach for almost every time.",
        "Reading past the end is where the languages part company most sharply. C++ does not check: `nums[5]` on a five-item array reads whatever is next in memory and carries on. Use `.at(5)` on a vector when you would rather have an exception than a mystery.",
      ],
      predict: {
        ask: "What does this C++ code print?",
        code: `vector<int> nums = {10, 20, 30};

for (int i = 0; i <= nums.size(); i++) {
  cout << nums[i] << " ";
}`,
        choices: [
          { text: "10 20 30", why: "The condition is <=, not <, so the loop runs one extra time at i = 3." },
          { text: "10 20 30 then junk, or a crash", why: "Correct. i reaches 3, which is past the last index of 2. C++ does not check, so it reads whatever happens to sit after the vector." },
          { text: "A clear out-of-range error", why: "Using [] gives no check at all. You would need .at(i) for an exception, and even that would come after 10 20 30." },
          { text: "It refuses to compile", why: "The code is perfectly valid C++. The mistake is only visible when it runs, and often not even then." },
        ],
        answer: 1,
      },
      viz: traceIndexing(),
      example: `int fixed[5] = {10, 20, 30, 40, 50};   // fixed size, forever

vector<int> nums = {10, 20, 30};       // grows as you add
nums.push_back(40);                    // now 4 items

cout << nums[0];                       // 10 — no bounds check
cout << nums.at(9);                    // throws out_of_range
cout << nums.size();                   // 4

for (int x : nums) cout << x;          // walk every item
for (int i = 0; i < nums.size(); i++)  // when you need the index
  cout << i << ":" << nums[i];`,
      notes: [
        { token: "int fixed[5]", meaning: "a raw array. Size fixed at compile time" },
        { token: "vector<int>", meaning: "grows on demand. What you should usually use" },
        { token: "nums[i]", meaning: "fast, and unchecked. Past the end is silent junk" },
        { token: "nums.at(i)", meaning: "checked. Throws instead of misbehaving" },
      ],
      challenge: {
        prompt:
          "Write a loop that prints every item of nums, using the index. Stop at the right place — the last valid index is one less than the size.",
        starter: `vector<int> nums = {10, 20, 30};

for (int i = ; i  nums.size(); i++) {
  cout << nums[] << " ";
}`,
        rules: {
          regex: ["for\\s*\\(\\s*int\\s+i\\s*=\\s*0\\s*;\\s*i\\s*<\\s*nums\\.size\\s*\\(\\s*\\)", "nums\\s*\\[\\s*i\\s*\\]"],
          mustNot: ["i <= nums.size()"],
          hint: "Start at 0, and stop while i < nums.size() — a less-than, not a less-than-or-equal.",
          success:
            "Correct. `i < size` is the shape to memorise. `i <= size` walks one box too far, and in C++ that box is not empty — it is whatever else was in memory.",
        },
        solution: `vector<int> nums = {10, 20, 30};

for (int i = 0; i < nums.size(); i++) {
  cout << nums[i] << " ";
}`,
      },

      alt: {
        c: {
          body: [
            "One name and a number. `nums[0]`, `nums[1]`, and so on — and now a loop can walk all of them.",
            "The numbering starts at zero because the index is a DISTANCE from the start. In C that is not a metaphor: `nums[i]` is defined as `*(nums + i)`, literally 'go i items along from the start and look there'.",
            "That is also why reaching any box costs the same, and why the highest valid index is one less than the length.",
            "C gives you fixed arrays only. `int nums[5]` is five boxes and stays five boxes. There is no built-in growable list — you get one with `malloc` and `realloc`, by hand, in the Memory topic.",
            "An array does not know its own length. `sizeof(arr) / sizeof(arr[0])` works where the array was declared, and stops working the moment you pass it to a function, because there it is only a pointer.",
            "And nothing is checked. `nums[5]` on a five-item array reads whatever is next in memory. It might be another variable, it might be part of the call stack. The program carries on with a wrong value, or corrupts something and crashes much later.",
          ],
          predict: {
            ask: "What does this C code print?",
            code: `void show(int a[]) {
  printf("%zu", sizeof(a) / sizeof(a[0]));
}

int main(void) {
  int nums[5] = {1, 2, 3, 4, 5};
  printf("%zu ", sizeof(nums) / sizeof(nums[0]));
  show(nums);
}`,
            choices: [
              { text: "5 5", why: "Inside show, a is not an array — it decayed to a pointer, and sizeof measures the pointer." },
              { text: "5 2, or 5 1", why: "Correct. In main the compiler knows the array, so it gets 5. In show, a is a pointer, so sizeof gives the pointer size divided by the int size — usually 2 on a 64-bit machine." },
              { text: "It will not compile", why: "This is legal C. That is exactly the problem: it compiles cleanly and gives an answer that is wrong." },
              { text: "5 0", why: "sizeof never gives zero. A pointer has a real size, typically 8 bytes." },
            ],
            answer: 1,
          },
          example: `int nums[5] = {10, 20, 30, 40, 50};   /* fixed. Always 5 */
int zeros[100] = {0};                 /* all 100 set to 0 */

printf("%d", nums[0]);                /* 10 — nothing is checked */
printf("%d", nums[5]);                /* junk. No error, no warning */

/* the length, but ONLY where it was declared */
int len = sizeof(nums) / sizeof(nums[0]);

for (int i = 0; i < len; i++)
  printf("%d ", nums[i]);

/* nums[i] IS *(nums + i). The same thing, spelled two ways */
printf("%d", *(nums + 2));            /* 30 */`,
          notes: [
            { token: "int nums[5]", meaning: "fixed at 5, forever. C has no built-in growable list" },
            { token: "nums[i]", meaning: "the same as *(nums + i). Never checked" },
            { token: "sizeof(a)/sizeof(a[0])", meaning: "the length — only where the array was declared" },
            { token: "int a[] in a parameter", meaning: "really a pointer. Pass the length separately" },
          ],
          prompt:
            "Work out the length of nums with sizeof, then loop over it printing every item.",
          starter: `int nums[5] = {10, 20, 30, 40, 50};
int len = ;

for (int i = 0; i  len; i++) {
  printf("%d ", nums[]);
}`,
          rules: {
            regex: ["sizeof\\s*\\(\\s*nums\\s*\\)\\s*/\\s*sizeof\\s*\\(\\s*nums\\s*\\[\\s*0\\s*\\]\\s*\\)", "i\\s*<\\s*len", "nums\\s*\\[\\s*i\\s*\\]"],
            hint: "sizeof(nums) / sizeof(nums[0]) gives the count. Then loop while i < len.",
            success:
              "Correct — and remember this only works here. Pass nums to a function and the array becomes a pointer, sizeof measures the pointer, and the count comes out as 2.",
          },
          solution: `int nums[5] = {10, 20, 30, 40, 50};
int len = sizeof(nums) / sizeof(nums[0]);

for (int i = 0; i < len; i++) {
  printf("%d ", nums[i]);
}`,
        },

        python: {
          body: [
            "One name and a number. `nums[0]`, `nums[1]`, and so on — and now a loop can walk all of them.",
            "Python calls it a list, and it grows and shrinks freely. There is no fixed-size array to learn first.",
            "Indexes start at zero, so the last one is `len(nums) - 1`. But Python also lets you count from the other end: `nums[-1]` is the last item, `nums[-2]` the one before. That alone removes a lot of off-by-one bugs.",
            "Going past the end raises IndexError and stops the program, which is far better than C++ handing you junk. You find out at the exact line that caused it.",
            "Slicing is the piece most worth learning early: `nums[1:4]` gives a NEW list with items 1, 2 and 3 — the start is included and the end is not. `nums[:]` copies the whole thing.",
            "One thing to know: a Python list can hold anything, mixed. `[1, \"a\", [2]]` is a valid list. That is convenient, and it is also why a Python list uses far more memory than a C array of the same numbers.",
          ],
          predict: {
            ask: "What does this Python code print?",
            code: `nums = [10, 20, 30, 40, 50]

print(nums[-1])
print(nums[1:3])
print(nums[10:20])`,
            choices: [
              { text: "50  [20, 30]  []", why: "Correct. -1 counts from the end. 1:3 includes 1 and 2 but not 3. And a slice far past the end gives an empty list rather than an error." },
              { text: "50  [20, 30, 40]  IndexError", why: "The end of a slice is excluded, so 1:3 stops before index 3. And slices never raise IndexError — only single-index access does." },
              { text: "10  [20, 30]  IndexError", why: "nums[-1] is the LAST item, not the first. And out-of-range slicing is quietly clipped." },
              { text: "IndexError on the first line", why: "Negative indexes are a normal Python feature, not an error — they count backwards from the end." },
            ],
            answer: 0,
          },
          example: `nums = [10, 20, 30]        # a list. Grows and shrinks freely
nums.append(40)            # now 4 items

print(nums[0])             # 10
print(nums[-1])            # 40 — counts from the end
print(len(nums))           # 4
# nums[9]                  # IndexError, and the program stops

print(nums[1:3])           # [20, 30] — end is NOT included
print(nums[:2])            # [10, 20]
print(nums[:])             # a copy of the whole list

for x in nums:             # walk the items
    print(x)
for i, x in enumerate(nums):   # when you need the index too
    print(i, x)

mixed = [1, "a", [2]]      # a list can hold anything`,
          notes: [
            { token: "nums[-1]", meaning: "the last item. Counting backwards from the end" },
            { token: "nums[1:3]", meaning: "a new list: 1 and 2, not 3. Start in, end out" },
            { token: "nums[:]", meaning: "a shallow copy of the whole list" },
            { token: "enumerate(nums)", meaning: "index and item together. Better than range(len(nums))" },
          ],
          prompt:
            "Print the last item of nums using a negative index, then print the middle three items with a slice.",
          starter: `nums = [10, 20, 30, 40, 50]

print(nums[])
print(nums[])`,
          rules: {
            regex: ["nums\\s*\\[\\s*-1\\s*\\]", "nums\\s*\\[\\s*1\\s*:\\s*4\\s*\\]"],
            hint: "nums[-1] for the last item. For 20, 30, 40 the slice is nums[1:4] — the end index is not included.",
            success:
              "Correct. Reading 1:4 as 'from 1, up to but not including 4' makes slices click: the length of the result is always end minus start.",
          },
          solution: `nums = [10, 20, 30, 40, 50]

print(nums[-1])
print(nums[1:4])`,
        },

        java: {
          body: [
            "One name and a number. `nums[0]`, `nums[1]`, and so on — and now a loop can walk all of them.",
            "Java gives you both, and you will use both. A raw `int[] nums = new int[5]` is a fixed run of boxes. An `ArrayList<Integer>` grows as you add.",
            "The array is faster and simpler and cannot change size. The ArrayList is what you use whenever the size is not known up front.",
            "Both count from zero, so the last index is `length - 1` for an array or `size() - 1` for a list. Note the inconsistency: an array uses `.length` with no brackets, a list uses `.size()` with brackets, and a String uses `.length()`. Everyone gets this wrong at first.",
            "Going past the end throws ArrayIndexOutOfBoundsException and stops the program — and the message tells you the index and the length, which is genuinely useful.",
            "A new array is not empty in the loose sense: `new int[5]` is five zeros, and `new String[5]` is five nulls. The zeros are safe; the nulls are the source of a lot of NullPointerExceptions.",
          ],
          predict: {
            ask: "What does this Java code print?",
            code: `int[] nums = new int[3];
String[] words = new String[3];

System.out.println(nums[0]);
System.out.println(words[0]);
System.out.println(words[0].length());`,
            choices: [
              { text: "0, null, then 4", why: "words[0] is null, and calling a method on null does not return a length." },
              { text: "0, null, then NullPointerException", why: "Correct. A new int[] is filled with 0, a new String[] is filled with null, and calling .length() on a null reference throws." },
              { text: "null, null, then 4", why: "int cannot be null. A new int array is filled with zeros." },
              { text: "0, empty string, then 0", why: "Java fills object arrays with null, not with empty strings. There is a real difference between the two." },
            ],
            answer: 1,
          },
          example: `int[] nums = new int[5];        // five zeros. Fixed size
int[] given = {10, 20, 30};     // or list them
String[] words = new String[3]; // three NULLS — a common trap

System.out.println(nums.length);     // .length, no brackets
System.out.println(given[0]);        // 10
// given[9]                          // ArrayIndexOutOfBoundsException

// growable, when the size is not known up front
List<Integer> list = new ArrayList<>();
list.add(10);
System.out.println(list.size());     // .size(), WITH brackets
System.out.println(list.get(0));     // .get(i), not [i]

for (int x : given) System.out.println(x);
for (int i = 0; i < given.length; i++) System.out.println(given[i]);`,
          notes: [
            { token: "int[] nums = new int[5]", meaning: "fixed size, filled with zeros" },
            { token: "new String[3]", meaning: "filled with null, not empty strings" },
            { token: ".length vs .size() vs .length()", meaning: "array, list, String. All different" },
            { token: "list.get(0)", meaning: "an ArrayList uses get, not square brackets" },
          ],
          prompt:
            "Loop over the array printing each item, using the index. Use the right way to ask an array for its length.",
          starter: `int[] nums = {10, 20, 30};

for (int i = 0; i < nums; i++) {
  System.out.println(nums[]);
}`,
          rules: {
            regex: ["i\\s*<\\s*nums\\.length", "nums\\s*\\[\\s*i\\s*\\]"],
            mustNot: ["nums.length()", "nums.size()"],
            hint: "An array uses .length with no brackets — not .length() and not .size().",
            success:
              "Correct. The three spellings are worth committing to memory: array is .length, String is .length(), and List is .size().",
          },
          solution: `int[] nums = {10, 20, 30};

for (int i = 0; i < nums.length; i++) {
  System.out.println(nums[i]);
}`,
        },

        javascript: {
          body: [
            "One name and a number. `nums[0]`, `nums[1]`, and so on — and now a loop can walk all of them.",
            "JavaScript has one kind: the array, and it grows and shrinks freely. It can also hold anything, mixed, like a Python list.",
            "Indexes start at zero, so the last one is `nums.length - 1`. There are no negative indexes — `nums[-1]` is not the last item, it is undefined. Use `nums.at(-1)` if you want that.",
            "Going past the end gives `undefined` and no error at all. That is the loosest behaviour of the six: no junk like C, but no complaint like Java either, so the mistake shows up somewhere else as NaN or 'cannot read property of undefined'.",
            "Two oddities worth knowing early. Setting `nums[10] = 1` on a three-item array does not fail — the array becomes length 11 with holes in the middle. And `length` is writable: setting `nums.length = 0` empties the array.",
            "`slice(1, 3)` gives a new array without touching the original. `splice` changes the original. The names are almost identical and they do opposite things, which catches everyone once.",
          ],
          predict: {
            ask: "What does this print?",
            code: `const nums = [10, 20, 30];

console.log(nums[5]);
nums[5] = 60;
console.log(nums.length);
console.log(nums[-1]);`,
            choices: [
              { text: "undefined, 6, undefined", why: "Correct. Reading past the end gives undefined, writing past the end stretches the array to length 6 with holes at 3 and 4, and a negative index is not an index at all — it is just a property that does not exist." },
              { text: "undefined, 4, 30", why: "Assigning at index 5 makes the length 6, not 4. And nums[-1] is undefined in JavaScript — negative indexing is a Python feature." },
              { text: "Error, array index out of range", why: "JavaScript never throws for an out-of-range index. It reads undefined and writes happily." },
              { text: "undefined, 3, 30", why: "The assignment at index 5 really does change the length. And nums[-1] does not reach the last item." },
            ],
            answer: 0,
          },
          example: `const nums = [10, 20, 30];   // grows freely. const does not stop that
nums.push(40);               // add to the end
nums.pop();                  // take from the end

console.log(nums[0]);        // 10
console.log(nums[9]);        // undefined — no error
console.log(nums.at(-1));    // 30 — the last item
console.log(nums.length);    // 3

console.log(nums.slice(1, 3));   // NEW array [20, 30]. Original untouched
nums.splice(1, 1);               // CHANGES the original. Removes one item

for (const x of nums) console.log(x);        // the items
for (const [i, x] of nums.entries())         // index and item
  console.log(i, x);

const doubled = nums.map(x => x * 2);        // a new array
const big = nums.filter(x => x > 15);        // a new array`,
          notes: [
            { token: "nums[9]", meaning: "undefined, with no error. Not junk, but not a warning either" },
            { token: "nums.at(-1)", meaning: "the last item. nums[-1] is undefined" },
            { token: "slice vs splice", meaning: "slice copies, splice modifies. Nearly identical names" },
            { token: "map and filter", meaning: "build a new array. The original is untouched" },
          ],
          prompt:
            "Print the last item using the method built for it, then make a NEW array of the middle two items without changing nums.",
          starter: `const nums = [10, 20, 30, 40];

console.log(nums.());
console.log(nums.(1, 3));`,
          rules: {
            regex: ["nums\\.at\\s*\\(\\s*-1\\s*\\)", "nums\\.slice\\s*\\(\\s*1\\s*,\\s*3\\s*\\)"],
            mustNot: ["nums.splice"],
            hint: "nums.at(-1) for the last item, and nums.slice(1, 3) for a copy of the middle two. splice would modify nums.",
            success:
              "Correct — and the slice/splice distinction is worth over-learning. slice returns a new array and leaves yours alone; splice edits yours in place and returns what it removed.",
          },
          solution: `const nums = [10, 20, 30, 40];

console.log(nums.at(-1));
console.log(nums.slice(1, 3));`,
        },

        rust: {
          body: [
            "One name and a number. `nums[0]`, `nums[1]`, and so on — and now a loop can walk all of them.",
            "Rust has three things where the other languages have one or two, and the difference is worth getting straight now.",
            "`[i32; 5]` is an ARRAY: exactly five numbers, size fixed at compile time, lives on the stack. `Vec<i32>` is a VECTOR: growable, on the heap, what you will use most.",
            "`&[i32]` is a SLICE: a borrowed view into either of the other two. It is what functions should take, because a slice accepts an array and a Vec alike.",
            "Indexes start at zero, and going past the end PANICS — the program stops cleanly and tells you the index and the length. No junk, no undefined.",
            "If you would rather handle it than panic, `.get(5)` hands back an `Option`: `Some(value)` or `None`. That is the same choice C++ offers with `[]` versus `.at()`, turned the other way round — here the safe version is the one that gives you a value to check.",
            "One thing that surprises people: `nums[i]` where i is an `i32` will not compile. Indexes must be `usize`. It is annoying at first and it is the compiler refusing to let a negative number become a huge positive one.",
          ],
          predict: {
            ask: "What happens with this Rust code?",
            code: `let nums = vec![10, 20, 30];

println!("{}", nums[5]);
println!("{:?}", nums.get(5));`,
            choices: [
              { text: "It prints garbage, then None", why: "Rust never hands you the contents of memory you did not ask for. Indexing is checked at run time." },
              { text: "It panics on line 3 and never reaches line 4", why: "Correct. nums[5] is checked and panics with 'index out of bounds: the len is 3 but the index is 5'. The program stops there, so .get(5) never runs." },
              { text: "It prints None twice", why: "The [] form does not hand back an Option — it panics. Only .get() gives you None." },
              { text: "It will not compile", why: "The compiler cannot know the index is too big here, so this is a run-time panic rather than a compile error." },
            ],
            answer: 1,
          },
          example: `let arr: [i32; 5] = [10, 20, 30, 40, 50];  // fixed. On the stack
let mut v: Vec<i32> = vec![10, 20, 30];    // growable. On the heap
v.push(40);

println!("{}", v[0]);          // 10
// v[9]                        // panics, cleanly, with the index and len
println!("{:?}", v.get(9));    // None — handle it instead

println!("{}", v.len());
println!("{:?}", &v[1..3]);    // a slice: [20, 30]. Borrowed, not copied

for x in &v { println!("{}", x); }              // borrow, keep v
for (i, x) in v.iter().enumerate() { }          // index and item

// take a slice in parameters — accepts arrays AND Vecs
fn total(items: &[i32]) -> i32 { items.iter().sum() }`,
          notes: [
            { token: "[i32; 5]", meaning: "an array. Fixed size, on the stack" },
            { token: "Vec<i32>", meaning: "growable, on the heap. The usual choice" },
            { token: "&[i32]", meaning: "a slice — a borrowed view. What parameters should take" },
            { token: "v.get(i)", meaning: "Some or None, instead of a panic" },
          ],
          prompt:
            "Write a function total that takes a slice of i32 and returns the sum. Then call it with a borrowed vector.",
          starter: `fn total(items: ) -> i32 {
    items.iter().sum()
}

let v = vec![10, 20, 30];
println!("{}", total());`,
          rules: {
            regex: ["items\\s*:\\s*&\\s*\\[\\s*i32\\s*\\]", "total\\s*\\(\\s*&v\\s*\\)"],
            hint: "&[i32] is the slice type, and &v borrows the vector into one.",
            success:
              "Correct. Taking &[i32] rather than &Vec<i32> means the same function works on an array, a Vec, or part of either — and it costs nothing extra.",
          },
          solution: `fn total(items: &[i32]) -> i32 {
    items.iter().sum()
}

let v = vec![10, 20, 30];
println!("{}", total(&v));`,
        },
      },
    },

    /* --------------------------------------------------------- growth -- */
    {
      id: "growing",
      kicker: "02",
      title: "Growing, shrinking, and copying",
      hook:
        "A vector has room for 4 items and you add a fifth. There is no fifth box. What actually happens?",
      body: [
        "It takes a bigger block of memory, copies everything across, releases the old block, and then adds your item. The whole thing moves.",
        "That sounds expensive, and one of those steps is. The trick is that it does not take one more box — it takes DOUBLE. So the next few additions are free, and the expensive step gets rarer as the vector grows.",
        "Across a million additions, the total copying works out to about a million moves in total. Averaged over the additions, each one is cheap — that is what 'amortised constant time' means.",
        "Two things follow from this, and both matter in real code. If you know roughly how many items are coming, `reserve` that many up front and no copying happens at all.",
        "And any pointer, reference or iterator into a vector becomes INVALID the moment it grows, because the whole block moved. Holding one across a `push_back` is a real bug that often appears to work.",
        "Removing from the END is cheap: nothing moves. Removing from the FRONT or the middle means shifting everything after it down one place — which is fine for ten items and painful for a million.",
      ],
      predict: {
        ask: "What is wrong with this C++ code?",
        code: `vector<int> v = {1, 2, 3};
int& first = v[0];

v.push_back(4);
cout << first;`,
        choices: [
          { text: "Nothing — first still refers to v[0]", why: "The push_back may move the whole vector to a new block, and first would then point at the old, released one." },
          { text: "first may point at released memory after the push_back", why: "Correct. If push_back needs to grow, it moves everything to a new block and frees the old one. first still points at the old address, so reading it is undefined behaviour." },
          { text: "You cannot take a reference to v[0]", why: "Taking the reference is perfectly legal. It is only the later push_back that makes it dangerous." },
          { text: "push_back does not accept an int", why: "push_back(4) is exactly the intended use. The problem is the reference held across it." },
        ],
        answer: 1,
      },
      viz: traceGrowth(),
      example: `vector<int> v;
v.reserve(1000);        // one block, and no copying at all after this

v.push_back(4);         // add at the end — cheap
v.pop_back();           // remove from the end — cheap

v.insert(v.begin(), 0); // add at the FRONT — shifts everything down
v.erase(v.begin());     // remove from the front — shifts everything up

v.size();               // how many items are in it
v.capacity();           // how many it has room for
v.empty();
v.clear();              // size 0. Capacity usually unchanged

vector<int> copy = v;   // a real copy. Two independent vectors`,
      notes: [
        { token: "reserve(n)", meaning: "take the room up front. Skips every reallocation" },
        { token: "push_back / pop_back", meaning: "at the end. Cheap" },
        { token: "insert / erase at begin()", meaning: "shifts every later item. Slow for big vectors" },
        { token: "vector<int> copy = v", meaning: "copies the contents. Not a shared reference" },
      ],
      challenge: {
        prompt:
          "You are about to push 1000 items. Reserve the room first so the vector never has to grow, then push one item.",
        starter: `vector<int> v;
v.(1000);

v.(1);`,
        rules: {
          regex: ["v\\.reserve\\s*\\(\\s*1000\\s*\\)", "v\\.push_back\\s*\\(\\s*1\\s*\\)"],
          hint: "v.reserve(1000); takes the memory up front, then v.push_back(1); adds the item.",
          success:
            "Correct. reserve changes the capacity but not the size — v.size() is still 0 afterwards. resize(1000) is the different one: it actually creates 1000 items.",
        },
        solution: `vector<int> v;
v.reserve(1000);

v.push_back(1);`,
      },

      alt: {
        c: {
          hook:
            "You declared `int nums[5]` and now you need six. C has no push_back. What do you do?",
          body: [
            "You ask the operating system for the memory yourself, and you take on the job of tracking how much you have.",
            "`malloc(n * sizeof(int))` gives you a block of n ints. `realloc(ptr, bigger)` asks for a bigger one — it may extend the block where it is, or move it and copy everything across, and it hands you back the address either way.",
            "`free(ptr)` gives the memory back. If you forget, the program leaks. If you free twice, or use the pointer afterwards, the program is broken in a way that may not show up for hours.",
            "The important detail with realloc: it can return NULL if it fails, and if you wrote `ptr = realloc(ptr, n)` you have just lost the only pointer to your old block and leaked it. Assign to a temporary first.",
            "This is exactly what a C++ vector, a Python list and a Java ArrayList do for you. Doing it once by hand is the best way to understand why they are worth having.",
            "The doubling strategy is worth copying too: grow by a factor, not by one. Growing by one turns a thousand additions into a thousand reallocations and half a million copies.",
          ],
          predict: {
            ask: "What is wrong with this C code?",
            code: `int *nums = malloc(4 * sizeof(int));

nums = realloc(nums, 8 * sizeof(int));

if (nums == NULL) {
  printf("out of memory");
}`,
            choices: [
              { text: "Nothing — that is the normal way to grow a block", why: "If realloc fails it returns NULL, and the old pointer has already been overwritten, so the original block can never be freed." },
              { text: "If realloc fails, the original block is leaked", why: "Correct. realloc returns NULL on failure WITHOUT freeing the old block, and assigning straight onto nums throws away the only pointer to it. Use a temporary and only assign on success." },
              { text: "realloc cannot grow a malloc'd block", why: "Growing a malloc'd block is exactly what realloc is for. The bug is in how the result is assigned." },
              { text: "sizeof(int) is not needed", why: "It is needed — malloc counts bytes, not items, so the multiplication is correct." },
            ],
            answer: 1,
          },
          example: `int cap = 4, len = 0;
int *nums = malloc(cap * sizeof(int));   /* room for 4 */

/* add one item, growing if needed */
if (len == cap) {
  int newCap = cap * 2;                  /* DOUBLE, never +1 */
  int *tmp = realloc(nums, newCap * sizeof(int));
  if (tmp == NULL) { /* handle it — nums is still valid */ }
  nums = tmp;
  cap = newCap;
}
nums[len++] = 10;

free(nums);        /* hand it back. Forgetting this leaks */
nums = NULL;       /* so a later use fails loudly, not quietly */`,
          notes: [
            { token: "malloc(n * sizeof(int))", meaning: "a block of n ints. Counts BYTES, so the multiply matters" },
            { token: "realloc", meaning: "grow it. May move the block and copy everything" },
            { token: "int *tmp = realloc(...)", meaning: "assign to a temporary. Direct assignment leaks on failure" },
            { token: "free then NULL", meaning: "hand it back, then poison the pointer" },
          ],
          prompt:
            "Grow the block safely: realloc into a temporary, then assign it to nums. Do not assign realloc's result straight to nums.",
          starter: `int *nums = malloc(4 * sizeof(int));

int * = realloc(nums, 8 * sizeof(int));
if (tmp != NULL) {
  nums = ;
}`,
          rules: {
            regex: ["int\\s*\\*\\s*tmp\\s*=\\s*realloc\\s*\\(\\s*nums\\s*,", "nums\\s*=\\s*tmp"],
            mustNot: ["nums = realloc"],
            hint: "int *tmp = realloc(nums, ...); then check tmp before assigning nums = tmp;",
            success:
              "Correct. This two-step shape is the standard C idiom, and the reason is narrow but real: realloc failing does not free your old block, so overwriting the pointer loses it forever.",
          },
          solution: `int *nums = malloc(4 * sizeof(int));

int *tmp = realloc(nums, 8 * sizeof(int));
if (tmp != NULL) {
  nums = tmp;
}`,
        },

        python: {
          hook:
            "You copy a list with `b = a`, then change b. Afterwards you print a — and a has changed too. Why?",
          body: [
            "Because `b = a` did not copy anything. It gave the same list a second name. There is one list with two labels on it.",
            "This is the passing rule from the Functions topic, showing up again. Assignment binds a name to an object; it does not duplicate the object.",
            "To get a real copy, use `b = a[:]` or `b = list(a)` or `b = a.copy()`. All three make a new list with the same contents.",
            "But those are SHALLOW copies. If the list holds other lists, the copy gets the same inner lists — so `b[0].append(1)` still shows up in a. `copy.deepcopy(a)` is the one that copies all the way down.",
            "Growing is handled for you: `append` adds to the end, and CPython over-allocates behind the scenes exactly like a C++ vector, so appending is cheap on average.",
            "Where you add matters. `append` and `pop()` at the end are cheap. `insert(0, x)` and `pop(0)` at the front have to shift every other item along — use `collections.deque` if you need a fast front.",
          ],
          predict: {
            ask: "What does this Python code print?",
            code: `a = [[1], [2]]
b = a[:]

b.append([3])
b[0].append(99)

print(a)`,
            choices: [
              { text: "[[1], [2]]", why: "The slice copied the outer list but not the inner ones, so b[0] and a[0] are the same list." },
              { text: "[[1, 99], [2]]", why: "Correct. a[:] made a new outer list, so appending [3] to b did not touch a. But the inner lists are shared, so appending 99 to b[0] changed a[0] as well." },
              { text: "[[1, 99], [2], [3]]", why: "The [3] went into b's own outer list. a's outer list is genuinely separate." },
              { text: "[[1], [2], [3]]", why: "The append to b's outer list does not reach a, but the append to the shared inner list does." },
            ],
            answer: 1,
          },
          example: `a = [1, 2, 3]

b = a              # NOT a copy. One list, two names
b = a[:]           # a shallow copy
b = list(a)        # the same
b = a.copy()       # the same

import copy
b = copy.deepcopy(a)   # copies nested lists too

a.append(4)        # cheap — at the end
a.pop()            # cheap — from the end
a.insert(0, 0)     # SLOW — shifts everything along
a.pop(0)           # SLOW — same reason

from collections import deque
d = deque([1, 2, 3])
d.appendleft(0)    # cheap at BOTH ends

a.extend([5, 6])   # add several
a.remove(2)        # remove by VALUE, the first match only
del a[0]           # remove by index`,
          notes: [
            { token: "b = a", meaning: "one list, two names. Not a copy" },
            { token: "a[:] or a.copy()", meaning: "a shallow copy. Nested lists are still shared" },
            { token: "copy.deepcopy(a)", meaning: "copies all the way down" },
            { token: "insert(0, x) / pop(0)", meaning: "slow. Use deque when you need a fast front" },
          ],
          prompt:
            "Make b a real copy of a, so appending to b leaves a alone.",
          starter: `a = [1, 2, 3]
b = 

b.append(4)
print(a)`,
          rules: {
            regex: ["b\\s*=\\s*(a\\s*\\[\\s*:\\s*\\]|list\\s*\\(\\s*a\\s*\\)|a\\.copy\\s*\\(\\s*\\))"],
            hint: "b = a[:] — or list(a), or a.copy(). Plain b = a only adds a second name.",
            success:
              "Correct. Remember this is shallow: if a held lists or objects, b would get the same ones, and changing one through b would still show up in a.",
          },
          solution: `a = [1, 2, 3]
b = a[:]

b.append(4)
print(a)`,
        },

        java: {
          body: [
            "It takes a bigger array, copies everything across, and points at the new one. The old array is left for the garbage collector.",
            "ArrayList does not grow by one — it grows by about half again. That makes the expensive step rare, so adding is cheap on average.",
            "If you know roughly how many items are coming, `new ArrayList<>(1000)` sets the starting capacity and skips all of that.",
            "Where you add matters: `add(x)` at the end is cheap, `add(0, x)` at the front shifts every other item along. `LinkedList` is fast at both ends and slow to reach the middle, and in practice ArrayList wins more often than people expect.",
            "Copying has the same shared-reference trap as everywhere else. `List<Integer> b = a;` gives one list two names. `new ArrayList<>(a)` gives a real, if shallow, copy.",
            "One Java-specific catch: `Arrays.asList(1, 2, 3)` looks like a list and is a fixed-size view — calling `add` on it throws UnsupportedOperationException. So does anything from `List.of(...)`. Wrap in `new ArrayList<>(...)` when you need to change it.",
          ],
          predict: {
            ask: "What does this Java code do?",
            code: `List<Integer> nums = Arrays.asList(1, 2, 3);

nums.set(0, 99);
nums.add(4);`,
            choices: [
              { text: "Both work — nums becomes [99, 1, 2, 3, 4]", why: "asList gives a fixed-size view, so adding to it is not supported even though setting is." },
              { text: "set works, add throws UnsupportedOperationException", why: "Correct. Arrays.asList gives a fixed-size list backed by the array: you may replace an item, but you may not change the size." },
              { text: "Both throw UnsupportedOperationException", why: "set is allowed — the list is fixed in SIZE, not read-only. List.of would reject both." },
              { text: "It will not compile", why: "Both methods exist on List, so it compiles cleanly. The failure only appears at run time." },
            ],
            answer: 1,
          },
          example: `List<Integer> list = new ArrayList<>();
List<Integer> sized = new ArrayList<>(1000);   // starting capacity

list.add(10);            // at the end — cheap
list.add(0, 5);          // at the front — shifts everything along
list.get(0);
list.set(0, 7);          // replace
list.remove(0);          // by INDEX for a List<Integer>
list.size();

// copying
List<Integer> alias = list;                    // one list, two names
List<Integer> copy  = new ArrayList<>(list);   // a real, shallow copy

// fixed-size and immutable views — add() throws on both
List<Integer> fixed = Arrays.asList(1, 2, 3);
List<Integer> frozen = List.of(1, 2, 3);

// arrays
int[] a = {1, 2, 3};
int[] b = Arrays.copyOf(a, a.length);          // a real copy
int[] grown = Arrays.copyOf(a, 6);             // longer, zero-filled`,
          notes: [
            { token: "new ArrayList<>(1000)", meaning: "the starting CAPACITY, not the size. size() is still 0" },
            { token: "add(0, x)", meaning: "at the front. Shifts every later item" },
            { token: "Arrays.asList / List.of", meaning: "fixed size. add() throws at run time" },
            { token: "new ArrayList<>(list)", meaning: "a real copy. Plain assignment is not" },
          ],
          prompt:
            "Make copy a real, independent copy of list, so adding to it leaves list alone.",
          starter: `List<Integer> list = new ArrayList<>();
List<Integer> copy = ;

copy.add(1);`,
          rules: {
            regex: ["new\\s+ArrayList\\s*<\\s*(Integer)?\\s*>\\s*\\(\\s*list\\s*\\)"],
            mustNot: ["copy = list;"],
            hint: "new ArrayList<>(list) builds a new list with the same contents. copy = list would only add a second name.",
            success:
              "Correct — and still shallow. If the list held objects, both lists would point at the same objects, so changing one through copy would be visible through list.",
          },
          solution: `List<Integer> list = new ArrayList<>();
List<Integer> copy = new ArrayList<>(list);

copy.add(1);`,
        },

        javascript: {
          body: [
            "The engine handles it. A JavaScript array grows and shrinks as you add and remove, and you never see the reallocation.",
            "`push` and `pop` work at the end and are cheap. `unshift` and `shift` work at the front and have to move every other item, so they are slow on large arrays.",
            "Copying has the same trap as everywhere else. `const b = a` gives one array two names. `const b = [...a]` or `a.slice()` gives a real, shallow copy.",
            "Shallow means the same thing here: an array of objects copies the arrows, not the objects. `structuredClone(a)` copies all the way down.",
            "The most useful habit in modern JavaScript is preferring the methods that RETURN a new array over the ones that change yours: `map`, `filter`, `concat`, `slice`, `toSorted` build something new; `push`, `splice`, `sort`, `reverse` change what you have.",
            "That distinction is worth learning as a pair, because `sort` and `reverse` changing the original surprises people constantly — and `toSorted` and `toReversed` are the newer, non-destructive versions.",
          ],
          predict: {
            ask: "What does this print?",
            code: `const a = [3, 1, 2];
const b = a.sort();

b.push(9);
console.log(a);`,
            choices: [
              { text: "[3, 1, 2]", why: "sort changes the array in place, so a is already reordered before the push." },
              { text: "[1, 2, 3, 9]", why: "Correct. sort sorts a IN PLACE and returns the same array, so b and a are one array with two names — and the push shows up in both." },
              { text: "[1, 2, 3]", why: "b is not a copy. sort returns the very same array it sorted, so pushing to b pushes to a." },
              { text: "[3, 1, 2, 9]", why: "sort does reorder a, because it works in place rather than returning a new array." },
            ],
            answer: 1,
          },
          example: `const a = [1, 2, 3];

a.push(4);           // at the end — cheap
a.pop();
a.unshift(0);        // at the FRONT — moves everything. Slow
a.shift();

// copying
const alias = a;             // one array, two names
const copy  = [...a];        // a real, shallow copy
const copy2 = a.slice();     // the same
const deep  = structuredClone(a);   // all the way down

// build a NEW array — the original is untouched
a.map(x => x * 2);
a.filter(x => x > 1);
a.concat([4, 5]);
a.slice(1, 3);
a.toSorted();        // newer, non-destructive
a.toReversed();

// CHANGE this array
a.splice(1, 1);
a.sort();            // in place, and returns the same array
a.reverse();`,
          notes: [
            { token: "push / pop", meaning: "at the end. Cheap" },
            { token: "unshift / shift", meaning: "at the front. Moves every item along" },
            { token: "[...a]", meaning: "a shallow copy. structuredClone goes deeper" },
            { token: "sort vs toSorted", meaning: "sort changes yours; toSorted returns a new one" },
          ],
          prompt:
            "Get a sorted array WITHOUT changing nums. Use the non-destructive method.",
          starter: `const nums = [3, 1, 2];
const sorted = nums.();

console.log(nums);`,
          rules: {
            regex: ["nums\\.toSorted\\s*\\(\\s*\\)|\\[\\s*\\.\\.\\.\\s*nums\\s*\\]\\.sort\\s*\\(\\s*\\)|nums\\.slice\\s*\\(\\s*\\)\\.sort\\s*\\(\\s*\\)"],
            mustNot: ["const sorted = nums.sort()"],
            hint: "nums.toSorted() returns a new sorted array. The older way is [...nums].sort() — copy first, then sort the copy.",
            success:
              "Correct. And one more thing about sort worth knowing now: by default it compares items AS STRINGS, so [10, 9].sort() gives [10, 9]. For numbers you need sort((a, b) => a - b).",
          },
          solution: `const nums = [3, 1, 2];
const sorted = nums.toSorted();

console.log(nums);`,
        },

        rust: {
          body: [
            "It takes a bigger block, moves everything across, and frees the old one — the same as C++, and `Vec::with_capacity(n)` skips it when you know the size up front.",
            "`push` and `pop` at the end are cheap. `insert(0, x)` and `remove(0)` shift everything along, so `VecDeque` is the type when you need a fast front.",
            "Copying is where Rust differs from all five of the others, and it is the ownership rule from the Functions topic again.",
            "`let b = a;` does not copy the vector and does not give it a second name. It MOVES it: b owns the vector now, and using a afterwards is a compile error.",
            "To get a real copy you ask for one: `let b = a.clone();`. Rust makes the expense visible — there is no hidden deep copy, and no accidental sharing either.",
            "And the compiler enforces the invalidation rule that C++ only warns you about in the documentation. Holding a reference into a vector across a `push` does not compile: 'cannot borrow v as mutable because it is also borrowed as immutable'. The bug is caught before the program runs.",
          ],
          predict: {
            ask: "What does the Rust compiler say about this?",
            code: `let mut v = vec![1, 2, 3];
let first = &v[0];

v.push(4);

println!("{}", first);`,
            choices: [
              { text: "It compiles and prints 1", why: "The push may move the whole vector, so Rust refuses to let a reference into it survive across the push." },
              { text: "Error: cannot borrow `v` as mutable because it is also borrowed as immutable", why: "Correct. first borrows v immutably, and push needs a mutable borrow. This is exactly the C++ dangling-reference bug, caught at compile time instead of at run time." },
              { text: "It compiles but prints garbage", why: "Rust never lets a dangling reference through the compiler. There is no garbage to print." },
              { text: "Error: v must be immutable", why: "v is declared mut, which is correct for push. The conflict is between the two borrows, not the mutability." },
            ],
            answer: 1,
          },
          example: `let mut v: Vec<i32> = Vec::with_capacity(1000);   // no growing later

v.push(1);            // at the end — cheap
v.pop();              // Option<i32>, not a panic on empty
v.insert(0, 0);       // at the front — shifts everything
v.remove(0);

v.len();
v.capacity();
v.is_empty();
v.clear();

// MOVE versus CLONE
let a = vec![1, 2, 3];
let b = a;            // a is now unusable. Not a copy, not an alias
// println!("{:?}", a);  // compile error: value moved

let c = vec![1, 2, 3];
let d = c.clone();    // a real copy. c is still yours
                      // and the cost is visible in the code

use std::collections::VecDeque;
let mut q: VecDeque<i32> = VecDeque::new();
q.push_front(0);      // cheap at BOTH ends`,
          notes: [
            { token: "Vec::with_capacity(n)", meaning: "room up front. No reallocation later" },
            { token: "let b = a", meaning: "a MOVE. a is unusable afterwards" },
            { token: "a.clone()", meaning: "a real copy, and the cost is visible" },
            { token: "VecDeque", meaning: "cheap at both ends. Vec is only cheap at the back" },
          ],
          prompt:
            "Make b a real copy of a, so that a can still be used afterwards.",
          starter: `let a = vec![1, 2, 3];
let b = ;

println!("{:?} {:?}", a, b);`,
          rules: {
            regex: ["let\\s+b\\s*=\\s*a\\.clone\\s*\\(\\s*\\)"],
            mustNot: ["let b = a;"],
            hint: "let b = a.clone(); — a plain let b = a; would move the vector and leave a unusable.",
            success:
              "Correct, and notice what Rust made you do: the copy is written out, so nobody wonders whether that line was cheap. In Python, Java and JavaScript the same line would have quietly shared one list.",
          },
          solution: `let a = vec![1, 2, 3];
let b = a.clone();

println!("{:?} {:?}", a, b);`,
        },
      },
    },

    /* ----------------------------------------------------------- text -- */
    {
      id: "text",
      kicker: "03",
      title: "Text as data",
      hook:
        "You join a word onto a string a hundred thousand times and the program crawls. Nothing looks wrong. What is it doing?",
      body: [
        "Building a hundred thousand strings. In most of these languages a string cannot be changed once it exists, so `s = s + word` makes a whole new string, copies the old contents into it, and throws the old one away.",
        "Do that in a loop and the work grows with the square of the length. The fix is a builder — something that keeps one growable buffer and appends into it.",
        "C++ is the exception among the six: `std::string` IS changeable, and `s += word` appends in place using the same doubling trick a vector uses. So the loop is fine here and slow in Python, Java and JavaScript.",
        "A string is otherwise the same shape as an array: characters in a row, indexed from zero, with a length.",
        "The part that catches everyone is what counts as one character. `s.size()` on a `std::string` counts BYTES, not letters. \"café\" is 4 letters and 5 bytes, because é needs two.",
        "For plain English text they are the same and nothing goes wrong. For anything else — accents, Greek, emoji — indexing by byte can cut a character in half. Slicing user text by hand is where this bites.",
      ],
      predict: {
        ask: "What does this C++ code print?",
        code: `string s = "café";

cout << s.size() << " ";
cout << s.length();`,
        choices: [
          { text: "4 4", why: "std::string counts bytes, and é is two bytes in UTF-8, so neither call gives 4." },
          { text: "5 5", why: "Correct. size() and length() are the same function with two names, and both count BYTES. The four visible characters take five bytes because é needs two." },
          { text: "4 5", why: "size() and length() are identical in std::string — one is an alias for the other. They cannot disagree." },
          { text: "5 4", why: "Both count bytes. There is no character-counting method on std::string at all." },
        ],
        answer: 1,
      },
      viz: traceStringBytes(),
      example: `string s = "hello";

cout << s[0];             // 'h'
cout << s.size();         // 5 — BYTES, not characters
cout << s.substr(1, 3);   // "ell" — start, then how many

s += " world";            // appends IN PLACE. C++ strings are mutable
s.push_back('!');

// finding
size_t at = s.find("world");
if (at != string::npos) cout << at;   // npos means not found

// building in a loop is fine in C++
string out;
out.reserve(1000);        // even better
for (int i = 0; i < 1000; i++) out += "x";

// comparing works as you would expect
if (s == "hello world!") cout << "same";`,
      notes: [
        { token: "s.size()", meaning: "bytes, not characters. Same as s.length()" },
        { token: "s.substr(1, 3)", meaning: "start and COUNT — not start and end" },
        { token: "s += x", meaning: "appends in place. C++ strings are changeable" },
        { token: "string::npos", meaning: "what find returns when there is no match" },
      ],
      challenge: {
        prompt:
          "Pull \"ell\" out of \"hello\" with substr. Remember the second argument is how many characters, not where to stop.",
        starter: `string s = "hello";

cout << s.substr(, );`,
        rules: {
          regex: ["s\\.substr\\s*\\(\\s*1\\s*,\\s*3\\s*\\)"],
          hint: "Start at index 1 and take 3 characters: s.substr(1, 3).",
          success:
            "Correct. This is a real difference worth holding on to: C++ substr takes a COUNT, while Python's s[1:4] and JavaScript's slice(1, 4) take an END. Same result, different second number.",
        },
        solution: `string s = "hello";

cout << s.substr(1, 3);`,
      },

      alt: {
        c: {
          hook:
            "You have a C string of five letters. How many bytes does it actually take, and how does any function know where it ends?",
          body: [
            "Six bytes, and the sixth is the answer to the second question.",
            "A C string is a plain array of chars with a zero byte on the end. That `'\\0'` is not decoration — it is the ONLY way anything knows where the string stops. There is no stored length.",
            "So `strlen` does not look up a number. It walks from the start counting until it finds the zero. Calling it inside a loop condition walks the whole string every time round.",
            "Everything follows from that terminator. `char s[5] = \"hello\"` does not fit, because hello needs six bytes. Forgetting the terminator makes every string function read off the end of your array.",
            "`strcpy` and `strcat` will happily write past the end of your buffer — this is the classic buffer overflow, and it is still one of the most common serious security bugs in real software. Use `snprintf`, or the size-limited versions, and check.",
            "And `s1 == s2` compares ADDRESSES, not text. It is legal C, it compiles without a warning, and it is almost never what you meant. Use `strcmp(s1, s2) == 0`.",
          ],
          predict: {
            ask: "What does this C code print?",
            code: `char a[] = "hi";
char b[] = "hi";

printf("%zu ", sizeof(a));
printf("%d", a == b);`,
            choices: [
              { text: "2 1", why: "sizeof counts the terminator too, and the two arrays are at different addresses." },
              { text: "3 0", why: "Correct. \"hi\" takes 3 bytes — 'h', 'i' and the '\\0'. And a == b compares two different addresses, so it is false. Use strcmp to compare the text." },
              { text: "2 0", why: "sizeof includes the terminating zero byte, so it is 3 rather than 2." },
              { text: "3 1", why: "a and b are two separate arrays at two separate addresses, so comparing the pointers gives 0." },
            ],
            answer: 1,
          },
          example: `char s[] = "hello";       /* 6 bytes: 5 letters + '\0' */

printf("%c", s[0]);       /* 'h' */
printf("%zu", strlen(s)); /* 5 — WALKS the string to count */
printf("%zu", sizeof(s)); /* 6 — includes the terminator */

/* comparing: == compares ADDRESSES, not text */
if (strcmp(s, "hello") == 0) printf("same");

/* copying: the unchecked versions overflow happily */
char dst[16];
snprintf(dst, sizeof(dst), "%s", s);   /* bounded. Use this */
/* strcpy(dst, s); */                  /* no bound. The classic bug */

/* finding */
char *at = strstr(s, "ell");
if (at != NULL) printf("%ld", at - s);  /* the index */

/* strlen in a loop condition walks it EVERY time */
for (size_t i = 0, n = strlen(s); i < n; i++) putchar(s[i]);`,
          notes: [
            { token: "'\\0'", meaning: "the terminator. The only mark of where a string ends" },
            { token: "strlen", meaning: "walks to count. Not a stored number" },
            { token: "s1 == s2", meaning: "compares addresses. Use strcmp for the text" },
            { token: "strcpy", meaning: "no bounds check. snprintf instead" },
          ],
          prompt:
            "Compare s against \"hello\" the correct way — by its text, not by its address.",
          starter: `char s[] = "hello";

if ( == 0) {
  printf("same");
}`,
          rules: {
            regex: ['strcmp\\s*\\(\\s*s\\s*,\\s*"hello"\\s*\\)\\s*==\\s*0'],
            mustNot: ['s == "hello"'],
            hint: 'strcmp(s, "hello") == 0 — strcmp gives 0 when the two strings match.',
            success:
              "Correct, and note the shape: strcmp returns 0 for EQUAL, which reads backwards the first hundred times. It returns negative or positive to say which one sorts first.",
          },
          solution: `char s[] = "hello";

if (strcmp(s, "hello") == 0) {
  printf("same");
}`,
        },

        python: {
          body: [
            "Building a hundred thousand strings. A Python string cannot be changed once it exists, so `s = s + word` makes a whole new string, copies the old contents in, and throws the old one away.",
            "Do that in a loop and the work grows with the square of the length. The fix is to collect the pieces in a list and call `\"\".join(parts)` once at the end.",
            "That immutability is not a flaw. It is why strings can be dictionary keys, and why you never have to worry about a function changing a string you passed it.",
            "Otherwise a string behaves like a list you cannot edit: indexing, negative indexes, slicing, `len`, and `for c in s` all work exactly as they do for a list.",
            "Python counts CHARACTERS, not bytes. `len(\"café\")` is 4, and `s[3]` is 'é' rather than half of it. Python 3 made this the default, and it is one of the nicest things about the language for text work.",
            "f-strings are how you build text with values in it: `f\"{name} is {age}\"`. They are faster than concatenation and far easier to read than the older `%` and `.format()` styles.",
          ],
          predict: {
            ask: "What does this Python code print?",
            code: `s = "hello"
s.upper()
s.replace("h", "j")

print(s)`,
            choices: [
              { text: "HELLO", why: "upper does not change s — it returns a new string, and nothing here keeps it." },
              { text: "hello", why: "Correct. Strings are immutable, so upper and replace both RETURN new strings and leave s alone. The return values are discarded here, so s is unchanged." },
              { text: "JELLO", why: "replace returns a new string rather than editing s. Without assigning the result, nothing changes." },
              { text: "JELLO in capitals", why: "Neither method modifies s. Both build new strings that are thrown away." },
            ],
            answer: 1,
          },
          example: `s = "hello"

print(s[0])          # 'h'
print(s[-1])         # 'o'
print(s[1:4])        # "ell" — end is NOT included
print(len(s))        # 5 — CHARACTERS, not bytes

# strings never change. Every method returns a NEW string
print(s.upper())     # "HELLO" — s is still "hello"
t = s.replace("h", "j")

# building text
name, age = "Ada", 36
print(f"{name} is {age}")          # f-string. Use this
print(f"{3.14159:.2f}")            # formatted: 3.14

# building in a LOOP — join, never +=
parts = []
for i in range(1000):
    parts.append("x")
out = "".join(parts)               # one string, built once

# useful methods
print(s.split(","))
print("  hi  ".strip())
print(s.startswith("he"))
print("ell" in s)                  # True`,
          notes: [
            { token: "immutable", meaning: "every method returns a NEW string. s is never edited" },
            { token: "len(s)", meaning: "characters, not bytes. len(\"café\") is 4" },
            { token: "f\"{name}\"", meaning: "an f-string. The clearest way to build text" },
            { token: "\"\".join(parts)", meaning: "how to build in a loop. += is quadratic" },
          ],
          prompt:
            "Build the string efficiently: collect the pieces in a list, then join them into one string at the end.",
          starter: `parts = []
for i in range(1000):
    parts.(\"x\")

out = `,
          rules: {
            regex: ["parts\\.append\\s*\\(", '""\\.join\\s*\\(\\s*parts\\s*\\)|\'\'\\.join\\s*\\(\\s*parts\\s*\\)'],
            hint: 'parts.append("x") inside the loop, then out = "".join(parts) after it.',
            success:
              "Correct. The difference is not small: 100,000 pieces joined this way is instant, while 100,000 += operations copy about five billion characters in total.",
          },
          solution: `parts = []
for i in range(1000):
    parts.append("x")

out = "".join(parts)`,
        },

        java: {
          body: [
            "Building a hundred thousand strings. A Java String cannot be changed once it exists, so `s = s + word` builds a whole new String each time round.",
            "Do that in a loop and the work grows with the square of the length. The fix is `StringBuilder`, which keeps one growable buffer and appends into it.",
            "The compiler will turn a single `a + b + c` into a StringBuilder for you — but it cannot do that across the iterations of a loop, which is exactly where it matters.",
            "The other Java-specific thing to get right is comparison. `s1 == s2` compares REFERENCES, not text. It sometimes appears to work because Java reuses identical literals from a pool, which makes the bug worse: it passes your test and fails on user input.",
            "Always use `.equals()` for text, and `.equalsIgnoreCase()` when case does not matter.",
            "Java counts UTF-16 units, so `\"café\".length()` is 4 but an emoji counts as 2. For most text it behaves like a character count; for emoji it does not.",
          ],
          predict: {
            ask: "What does this Java code print?",
            code: `String a = "hello";
String b = "hello";
String c = new String("hello");

System.out.println(a == b);
System.out.println(a == c);
System.out.println(a.equals(c));`,
            choices: [
              { text: "true, true, true", why: "new String forces a separate object, so a == c compares two different references." },
              { text: "true, false, true", why: "Correct. The two literals share one pooled object, so a == b is true by luck. new String makes a separate object, so a == c is false. And equals compares the text, so it is true." },
              { text: "false, false, true", why: "Identical literals are interned into one pooled object, so a == b happens to be true — which is exactly what makes == so dangerous here." },
              { text: "true, true, false", why: "equals compares the characters, so two strings with the same text are always equal by it." },
            ],
            answer: 1,
          },
          example: `String s = "hello";

System.out.println(s.charAt(0));    // 'h'
System.out.println(s.length());     // 5 — WITH brackets
System.out.println(s.substring(1, 4));  // "ell" — start and END

// COMPARE WITH equals. == compares references
if (s.equals("hello")) System.out.println("same");
if (s.equalsIgnoreCase("HELLO")) System.out.println("same-ish");

// immutable — every method returns a NEW String
String up = s.toUpperCase();        // s is unchanged

// building in a loop
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) sb.append("x");
String out = sb.toString();

// useful
System.out.println(String.join(",", "a", "b"));
System.out.println(s.contains("ell"));
System.out.println(s.indexOf("l"));       // 2, or -1 if absent
System.out.println("  hi  ".trim());
System.out.println(String.format("%.2f", 3.14159));`,
          notes: [
            { token: "s.equals(t)", meaning: "compares the text. == compares references" },
            { token: "s.length()", meaning: "with brackets. An array uses .length without" },
            { token: "substring(1, 4)", meaning: "start and END index — not a count" },
            { token: "StringBuilder", meaning: "for building in a loop. += is quadratic there" },
          ],
          prompt:
            "Compare s against \"hello\" by its text rather than by its reference.",
          starter: `String s = "hello";

if () {
  System.out.println("same");
}`,
          rules: {
            regex: ['s\\.equals\\s*\\(\\s*"hello"\\s*\\)|"hello"\\.equals\\s*\\(\\s*s\\s*\\)'],
            mustNot: ['s == "hello"'],
            hint: 's.equals("hello") compares the characters. == would compare object references.',
            success:
              'Correct. Writing it the other way round — "hello".equals(s) — is a habit worth picking up: it gives the same answer and cannot throw a NullPointerException when s is null.',
          },
          solution: `String s = "hello";

if (s.equals("hello")) {
  System.out.println("same");
}`,
        },

        javascript: {
          body: [
            "Building a hundred thousand strings — although this is the one language where modern engines often optimise it away, so it may or may not be slow. Building an array of pieces and calling `join` is still the honest way to write it.",
            "Strings cannot be changed once made. `s.toUpperCase()` returns a new string; `s[0] = \"H\"` silently does nothing at all, with no error.",
            "Comparison is the easy part here: `===` compares the text, which is what you want. That is one of the few places JavaScript is simpler than Java.",
            "Template literals are how you build text with values in it: `` `${name} is ${age}` ``. Backticks, and they can run across several lines.",
            "Length counts UTF-16 units. \"café\".length is 4, but an emoji is usually 2 and a flag can be 4. `[...s].length` counts actual characters, because the spread iterates by code point.",
            "One trap specific to JavaScript: `+` means both addition and concatenation, so `\"5\" + 1` is \"51\" while `\"5\" - 1` is 4. If a number arrives as text from an input field, this is where it goes wrong.",
          ],
          predict: {
            ask: "What does this print?",
            code: `const s = "café";

console.log(s.length);
console.log("5" + 1);
console.log("5" - 1);`,
            choices: [
              { text: "4, \"51\", 4", why: "Correct. é is one UTF-16 unit here so length is 4; + concatenates when either side is a string; and - has no string meaning, so it converts and subtracts." },
              { text: "5, 6, 4", why: "length counts UTF-16 units, and é is one of them, so 4. And \"5\" + 1 concatenates rather than adding." },
              { text: "4, 6, 4", why: "+ with a string on either side joins the text rather than adding, giving \"51\"." },
              { text: "4, \"51\", \"4\"", why: "Subtraction always produces a number — there is no string version of -, so both sides are converted." },
            ],
            answer: 0,
          },
          example: `const s = "hello";

console.log(s[0]);           // 'h'
console.log(s.at(-1));       // 'o'
console.log(s.length);       // 5 — no brackets, unlike Java
console.log(s.slice(1, 4));  // "ell" — start and END

// === compares the TEXT. Simple, unlike Java
if (s === "hello") console.log("same");

// immutable — methods return new strings
const up = s.toUpperCase();
// s[0] = "H";               // silently does nothing. No error

// template literals
const name = "Ada", age = 36;
console.log(\`\${name} is \${age}\`);

// building in a loop
const parts = [];
for (let i = 0; i < 1000; i++) parts.push("x");
const out = parts.join("");

// useful
console.log(s.includes("ell"));
console.log(s.split(""));
console.log("  hi  ".trim());
console.log([...("café")].length);   // counts real characters`,
          notes: [
            { token: "s.length", meaning: "no brackets. UTF-16 units, so emoji count as 2" },
            { token: "===", meaning: "compares the text. What you want" },
            { token: "`${x}`", meaning: "a template literal. Backticks, not quotes" },
            { token: "\"5\" + 1", meaning: "\"51\". + joins when either side is a string" },
          ],
          prompt:
            "Build the string with a template literal so it reads \"Ada is 36\".",
          starter: `const name = "Ada";
const age = 36;

console.log();`,
          rules: {
            regex: ["`[^`]*\\$\\{\\s*name\\s*\\}[^`]*\\$\\{\\s*age\\s*\\}[^`]*`"],
            hint: "Use backticks: `${name} is ${age}` — not quotes.",
            success:
              "Correct. Template literals also span several lines without \\n, which makes them the natural choice for anything longer than a few words.",
          },
          solution: `const name = "Ada";
const age = 36;

console.log(\`\${name} is \${age}\`);`,
        },

        rust: {
          hook:
            "Rust has two string types and beginners meet both on day one. Why would a language need two?",
          body: [
            "Because one owns its text and the other only borrows it, and that is the same ownership split you already saw with Vec.",
            "`String` is owned, growable, on the heap — the equivalent of a Vec of characters. `&str` is a borrowed VIEW into text somebody else owns, including string literals baked into the program.",
            "The rule of thumb is short: take `&str` in function parameters, store `String` in your structs. A `&String` works but accepts less, for no benefit.",
            "Converting is everyday work: `\"hi\".to_string()` or `String::from(\"hi\")` gives you an owned one, and `&owned` or `owned.as_str()` borrows it back.",
            "Building is straightforward once you know which is which: `push_str` appends to a String in place, and `format!(\"{} is {}\", name, age)` builds a new one.",
            "Then the part that surprises everyone: `s[0]` on a string does not compile at all. Rust strings are UTF-8, byte 0 might be half a character, and Rust will not pretend otherwise. You use `.chars().nth(0)` for a character, or `.bytes()` when you really do want bytes.",
            "`s.len()` is bytes for the same reason. `s.chars().count()` is characters. \"café\" is 5 and 4 respectively, and Rust makes you say which one you meant.",
          ],
          predict: {
            ask: "Which of these lines does NOT compile in Rust?",
            code: `let s = String::from("café");

let a = s.len();
let b = s.chars().count();
let c = &s[0..2];
let d = s[0];`,
            choices: [
              { text: "Only the last one", why: "Correct. Indexing a string by a single byte is not allowed at all, because one byte may be half a character. Ranges are allowed but panic if they split a character — s[0..2] is fine here since 'c' and 'a' are one byte each." },
              { text: "The last two", why: "Range slicing on a string IS allowed. It panics only if the boundary falls inside a multi-byte character, which 0..2 does not." },
              { text: "None of them", why: "s[0] genuinely does not compile — String does not implement indexing by usize at all." },
              { text: "chars().count() and s[0]", why: "chars().count() is the standard way to count characters and compiles fine. Only the byte index is rejected." },
            ],
            answer: 0,
          },
          example: `let owned: String = String::from("hello");   // owned, growable
let borrowed: &str = "hello";                // a view. Baked into the binary
let view: &str = &owned;                     // borrow the owned one

println!("{}", owned.len());                 // 5 — BYTES
println!("{}", owned.chars().count());       // 5 — characters
// owned[0]                                  // does NOT compile
println!("{:?}", owned.chars().nth(0));      // Some('h')

// building
let mut s = String::new();
s.push_str("hello");        // append in place
s.push('!');                // one character
let msg = format!("{} is {}", "Ada", 36);    // build a new one

// take &str in parameters — it accepts both
fn greet(name: &str) { println!("hi {}", name); }
greet("Ada");
greet(&owned);

// useful
println!("{}", owned.contains("ell"));
println!("{:?}", "a,b".split(',').collect::<Vec<_>>());
println!("{}", "  hi  ".trim());`,
          notes: [
            { token: "String", meaning: "owned and growable. Like a Vec of text" },
            { token: "&str", meaning: "a borrowed view. What parameters should take" },
            { token: "s[0]", meaning: "does not compile. Use .chars().nth(0)" },
            { token: "len() vs chars().count()", meaning: "bytes versus characters. Say which you mean" },
          ],
          prompt:
            "Write greet so it accepts both a string literal and a borrowed String — use the type that takes both.",
          starter: `fn greet(name: ) {
    println!("hi {}", name);
}

let owned = String::from("Ada");
greet("Bob");
greet();`,
          rules: {
            regex: ["name\\s*:\\s*&\\s*str", "greet\\s*\\(\\s*&owned\\s*\\)"],
            mustNot: ["name: String"],
            hint: "&str is the type that accepts both. Then greet(&owned) borrows the String into one.",
            success:
              "Correct. Taking String instead would have MOVED the caller's string into the function — greet(owned) would compile once and then fail on the second call, because the value is gone.",
          },
          solution: `fn greet(name: &str) {
    println!("hi {}", name);
}

let owned = String::from("Ada");
greet("Bob");
greet(&owned);`,
        },
      },
    },
  ],
};
