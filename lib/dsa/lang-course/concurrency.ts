import type { TopicLesson } from "@/lib/dsa/lessons/types";
import {
  traceEventLoop,
  traceLock,
  traceRace,
  traceThreadMemory,
} from "@/lib/dsa/viz/traceLang";

// Language track, topic 13.
//
// The topic where the six differ most in what they can even express. Python has
// the GIL, JavaScript has one thread and no shared memory, and Rust is the only
// one that rules data races out at compile time.

export const LANG_CONCURRENCY: TopicLesson = {
  id: "lang-concurrency",
  title: "Concurrency",
  tagline: "More than one thing happening at once.",
  why:
    "Every machine you will write for has several cores, and almost every program spends most of its life waiting for something. Concurrency is how you use the cores and stop wasting the waiting — and it is where the hardest bugs in software live, because they do not reproduce.",
  plain: [
    "Concurrency is several things in progress. Parallelism is several things running at the same instant.",
    "Threads share memory, which makes them fast to communicate and dangerous to get wrong.",
    "A data race is two threads touching the same data with at least one writing. The result is undefined.",
    "Async is for waiting on the world. Threads are for using more cores.",
  ],
  needs: ["Memory & References, especially what is shared.", "Closures, since concurrent work is usually a closure."],
  traps: [
    "Assuming a single line of code is a single step. `count += 1` is read, add, write.",
    "Testing concurrency on one machine and shipping to a bigger one. More cores means more interleavings.",
    "Holding a lock while doing something slow. That turns parallel work back into serial work.",
    "Two locks taken in different orders by different threads. That is a deadlock, and the program just stops.",
    "Reaching for threads when the problem is waiting, not computing. Async is usually the better answer.",
  ],
  sections: [
    /* -------------------------------------------------------- threads -- */
    {
      id: "threads",
      kicker: "01",
      title: "More than one thing at once",
      hook:
        "Your program takes eight seconds and your machine has eight cores. Seven of them are idle. What is stopping you using them?",
      body: [
        "Nothing, if the work can be split. A THREAD is a second line of execution inside the same program, and the operating system can run it on a different core.",
        "The important thing about threads is what they SHARE: the whole memory of the process. Every global, every heap allocation, every object is visible to all of them.",
        "That is what makes them fast — passing data between threads costs nothing, because there is nothing to pass. And it is what makes them dangerous, for exactly the same reason.",
        "Each thread gets its own STACK, so locals are private. Everything else is common ground.",
        "In C++, `std::thread t(work);` starts one and `t.join()` waits for it to finish. You must join or detach every thread before its object is destroyed, or the program calls `terminate`.",
        "`std::jthread` (C++20) joins automatically in its destructor, which is what you almost always wanted. Prefer it.",
        "Higher up, `std::async` runs something and hands you a `future` to collect the result from. That is usually a better starting point than raw threads: you get the answer back, and exceptions travel with it.",
        "One number worth knowing: a thread costs about a megabyte of stack and a syscall to create. Thousands of threads is a design mistake; that is what async is for.",
      ],
      predict: {
        ask: "What happens when this function returns?",
        code: `void run() {
  std::thread t([] { work(); });
}`,
        choices: [
          { text: "The thread is quietly abandoned and the program carries on", why: "A std::thread that is still joinable when destroyed does not detach — it terminates the program." },
          { text: "std::terminate is called and the program dies", why: "Correct. A std::thread must be joined or detached before its destructor runs. Leaving it joinable is treated as a programming error, and the destructor calls terminate. std::jthread joins automatically instead." },
          { text: "It waits for the thread automatically", why: "std::thread does not join in its destructor — that is exactly the difference between it and std::jthread." },
          { text: "It will not compile", why: "It compiles cleanly. The failure happens at run time, the moment the thread object goes out of scope." },
        ],
        answer: 1,
      },
      viz: traceThreadMemory(),
      example: `#include <thread>
#include <future>

// a raw thread — you MUST join or detach it
std::thread t([] { work(); });
t.join();                          // wait for it

// jthread joins in its destructor. Prefer this
std::jthread jt([] { work(); });

// usually better: run it and collect the result
auto fut = std::async(std::launch::async, [] { return compute(); });
int answer = fut.get();            // waits, and rethrows any exception

// several at once
std::vector<std::jthread> pool;
for (int i = 0; i < 4; i++)
  pool.emplace_back([i] { work(i); });
// all joined when pool is destroyed

// how many cores are actually available
unsigned n = std::thread::hardware_concurrency();

// the standard algorithms can parallelise themselves
#include <execution>
std::sort(std::execution::par, v.begin(), v.end());

// threads share ALL memory except their own stack.
// A thread costs about 1 MB and a syscall — thousands is a mistake`,
      notes: [
        { token: "std::thread", meaning: "must be joined or detached, or terminate is called" },
        { token: "std::jthread", meaning: "joins in its destructor. Prefer it" },
        { token: "std::async + future", meaning: "get the result back, exceptions included" },
        { token: "execution::par", meaning: "let the standard algorithm parallelise itself" },
      ],
      challenge: {
        prompt:
          "Run compute on another thread and collect its result, using the form that also carries exceptions back.",
        starter: `auto fut = std::(std::launch::async, [] { return compute(); });
int answer = fut.;`,
        rules: {
          regex: ["std::async\\s*\\(\\s*std::launch::async", "fut\\.get\\s*\\(\\s*\\)"],
          hint: "std::async(std::launch::async, ...) and then fut.get().",
          success:
            "Correct, and the explicit launch::async matters: without it the implementation may choose to run the work lazily on the calling thread when you call get, which is not what you asked for.",
        },
        solution: `auto fut = std::async(std::launch::async, [] { return compute(); });
int answer = fut.get();`,
      },

      alt: {
        c: {
          body: [
            "Nothing, if the work can be split — and in C the tool is POSIX threads, which almost every system provides.",
            "`pthread_create` starts one, taking a function and a single `void *` argument. `pthread_join` waits for it and collects a `void *` result.",
            "That signature is fixed: `void *(*)(void *)`. So anything the thread needs arrives through that one pointer, which is the context-pointer pattern from the Functional topic again.",
            "The classic bug is passing the address of a loop variable. Every thread gets the same pointer, the loop keeps changing what it points at, and the threads see whatever value happened to be there.",
            "The fix is to give each thread its own storage: an array element per thread, or a malloc'd struct the thread frees itself.",
            "C11 added `<threads.h>` with `thrd_create` and friends, standardising the same ideas. Support is patchy — glibc only added it in 2018 and Windows does not have it — so pthreads remains what real code uses.",
            "Link with `-pthread`, not `-lpthread`. The flag also sets preprocessor defines the headers need, and getting this wrong produces failures that look like unrelated bugs.",
          ],
          predict: {
            ask: "What is wrong with this?",
            code: `for (int i = 0; i < 4; i++) {
  pthread_create(&t[i], NULL, work, &i);
}`,
            choices: [
              { text: "Nothing — each thread gets its own i", why: "Every call passes the address of the SAME variable, and the loop keeps changing what is at that address." },
              { text: "All four threads share the address of i, which keeps changing under them", why: "Correct. &i is one address, and by the time a thread reads it, i may be anything — including 4, after the loop has finished. Give each thread its own storage: an array element, or a malloc'd struct." },
              { text: "pthread_create cannot take an int pointer", why: "It takes a void*, and any pointer converts. The problem is that they all point at one variable." },
              { text: "The loop should count down", why: "The direction is irrelevant. The shared address is the bug." },
            ],
            answer: 1,
          },
          example: `#include <pthread.h>

/* the fixed signature: void *(*)(void *) */
void *work(void *arg) {
  int id = *(int *)arg;
  printf("thread %d\\n", id);
  return NULL;
}

/* give each thread its OWN storage */
pthread_t t[4];
int ids[4];

for (int i = 0; i < 4; i++) {
  ids[i] = i;                          /* not &i */
  pthread_create(&t[i], NULL, work, &ids[i]);
}

for (int i = 0; i < 4; i++)
  pthread_join(t[i], NULL);            /* wait, and collect */

/* returning a result */
void *compute(void *arg) {
  int *out = malloc(sizeof *out);
  *out = 42;
  return out;                          /* the joiner frees it */
}
void *result;
pthread_join(t[0], &result);
printf("%d", *(int *)result);
free(result);

/* detach when you will never join */
pthread_detach(t[0]);

/* C11 <threads.h> standardises this. Support is patchy —
   pthreads is what real code uses */

/* compile with -pthread, NOT -lpthread */`,
          notes: [
            { token: "void *(*)(void *)", meaning: "the fixed thread-function shape" },
            { token: "&ids[i], not &i", meaning: "each thread needs its own storage" },
            { token: "pthread_join", meaning: "waits, and collects the void* result" },
            { token: "-pthread", meaning: "the compiler flag. Not -lpthread" },
          ],
          prompt:
            "Fix the loop so each thread receives its own value rather than a shared address.",
          starter: `int ids[4];

for (int i = 0; i < 4; i++) {
  
  pthread_create(&t[i], NULL, work, );
}`,
          rules: {
            regex: ["ids\\s*\\[\\s*i\\s*\\]\\s*=\\s*i\\s*;", "work\\s*,\\s*&ids\\s*\\[\\s*i\\s*\\]"],
            mustNot: ["work, &i)"],
            hint: "ids[i] = i; and then pass &ids[i].",
            success:
              "Correct. Each array element has its own address that nothing else writes to, so the thread reads exactly what was intended however late it gets around to it.",
          },
          solution: `int ids[4];

for (int i = 0; i < 4; i++) {
  ids[i] = i;
  pthread_create(&t[i], NULL, work, &ids[i]);
}`,
        },

        python: {
          body: [
            "The GIL is stopping you, and it is the most important thing to know about concurrency in Python.",
            "The GLOBAL INTERPRETER LOCK means only one thread executes Python bytecode at a time. You can create eight threads, and on pure Python work they will take turns rather than run in parallel.",
            "So threads in Python do not speed up CPU-bound work. Eight threads doing arithmetic finish no faster than one, and often slightly slower because of the switching.",
            "What threads DO help with is waiting. The GIL is released during I/O — a network request, a file read, a database query — so a hundred threads waiting on a hundred sockets works perfectly well.",
            "For actual parallelism, `multiprocessing` starts separate PROCESSES, each with its own interpreter and its own GIL. Real cores, real speedup, and the cost is that they share no memory: everything passed between them is pickled and copied.",
            "`concurrent.futures` gives you one interface over both. `ThreadPoolExecutor` for waiting, `ProcessPoolExecutor` for computing, and the same `submit`/`map` API for each — so switching is often one word.",
            "The rule of thumb: I/O-bound, use threads or asyncio. CPU-bound, use processes. And numpy or a C extension sidesteps the whole question, because those release the GIL while they work.",
            "Python 3.13 added an experimental free-threaded build with no GIL, and 3.14 continues it. It is real, it is not the default, and most libraries are not ready — so the rule above still holds.",
          ],
          predict: {
            ask: "Which of these actually uses several cores?",
            code: `# A
with ThreadPoolExecutor(8) as ex:
    ex.map(count_primes, ranges)

# B
with ProcessPoolExecutor(8) as ex:
    ex.map(count_primes, ranges)`,
            choices: [
              { text: "Both", why: "The GIL means the eight threads in A take turns executing bytecode rather than running at once." },
              { text: "Only B", why: "Correct. Threads share one interpreter and one GIL, so CPU-bound Python work is serialised. Processes each have their own interpreter, so they genuinely run in parallel — at the cost of copying data between them." },
              { text: "Only A", why: "It is the other way round: threads are the ones the GIL restricts." },
              { text: "Neither — Python cannot use several cores", why: "It can, through processes, or through libraries like numpy that release the GIL during their own work." },
            ],
            answer: 1,
          },
          example: `# the GIL: one thread runs Python bytecode at a time

# threads help with WAITING — the GIL is released during I/O
import threading

t = threading.Thread(target=fetch, args=(url,))
t.start()
t.join()

# one interface over both kinds
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

# I/O bound: threads
with ThreadPoolExecutor(max_workers=32) as ex:
    results = list(ex.map(fetch, urls))

# CPU bound: PROCESSES — real cores, and data is copied
with ProcessPoolExecutor() as ex:
    results = list(ex.map(count_primes, ranges))

# submit gives you a future you can collect later
with ThreadPoolExecutor() as ex:
    fut = ex.submit(fetch, url)
    data = fut.result()            # waits, and reraises any exception

# processes share nothing — arguments and results are pickled,
# so a lambda or an unpicklable object will not cross the boundary

# numpy and most C extensions release the GIL while they work,
# so they sidestep the whole question

# Python 3.13+ has an experimental free-threaded build with no GIL.
# Real, not the default, and most libraries are not ready`,
          notes: [
            { token: "the GIL", meaning: "one thread runs Python bytecode at a time" },
            { token: "threads", meaning: "for waiting. The GIL is released during I/O" },
            { token: "processes", meaning: "for computing. Real cores, and data is copied" },
            { token: "pickled", meaning: "so lambdas and unpicklable objects cannot cross" },
          ],
          prompt:
            "Run a CPU-heavy function across all your cores, using the executor built for it.",
          starter: `from concurrent.futures import ProcessPoolExecutor

with () as ex:
    results = list(ex.map(count_primes, ranges))`,
          rules: {
            regex: ["with\\s+ProcessPoolExecutor\\s*\\(\\s*\\)\\s+as\\s+ex\\s*:"],
            mustNot: ["ThreadPoolExecutor"],
            hint: "ProcessPoolExecutor() — with no argument it uses one worker per core.",
            success:
              "Correct. Note what changes if you swap in ThreadPoolExecutor: nothing about the code, and everything about the performance — which is exactly why concurrent.futures presents them the same way.",
          },
          solution: `from concurrent.futures import ProcessPoolExecutor

with ProcessPoolExecutor() as ex:
    results = list(ex.map(count_primes, ranges))`,
        },

        java: {
          body: [
            "Nothing. Java has had real threads since version 1, they map onto operating-system threads, and they genuinely run on separate cores.",
            "You almost never create one directly. `Thread` exists, and the modern approach is an EXECUTOR — a pool that owns some threads and takes work from you.",
            "`Executors.newFixedThreadPool(8)` gives you eight reusable threads. `submit` hands over a task and returns a `Future` you can collect from.",
            "The reason to prefer a pool is cost: creating a platform thread means about a megabyte of stack and a system call, so creating one per request falls over under load.",
            "Java 21 changed this with VIRTUAL THREADS. A virtual thread is managed by the JVM rather than the operating system, costs a few hundred bytes, and blocking one does not block a real thread underneath.",
            "That means you can have millions of them, and the old advice — never block, use callbacks — stops applying. `Executors.newVirtualThreadPerTaskExecutor()` is the modern default for I/O-bound server work.",
            "For CPU-bound work, virtual threads buy you nothing: there are still only so many cores. A fixed pool sized to `availableProcessors()` is right, or `ForkJoinPool` for divide-and-conquer.",
            "And parallel streams give you the easy version: `list.parallelStream()` spreads the work across the common pool. Convenient, and worth measuring — for small collections the overhead exceeds the gain.",
          ],
          predict: {
            ask: "What is the practical difference?",
            code: `var a = Executors.newFixedThreadPool(200);
var b = Executors.newVirtualThreadPerTaskExecutor();

// 10,000 tasks, each blocking on a network call`,
            choices: [
              { text: "None — both run 10,000 tasks", why: "The fixed pool has 200 real threads, so at most 200 network calls are in flight at once." },
              { text: "a runs 200 at a time; b runs all 10,000, because a blocked virtual thread frees its carrier", why: "Correct. A blocked platform thread occupies a real OS thread. A blocked virtual thread is unmounted and its carrier goes to other work, so tens of thousands of concurrent blocking calls become practical." },
              { text: "b is faster because virtual threads use more cores", why: "The core count is the same. What changes is how many tasks can be blocked at once without consuming OS threads." },
              { text: "b will run out of memory", why: "A virtual thread costs a few hundred bytes rather than about a megabyte, which is precisely what makes 10,000 of them reasonable." },
            ],
            answer: 1,
          },
          example: `import java.util.concurrent.*;

// a pool, rather than a thread per task
try (var pool = Executors.newFixedThreadPool(8)) {
  Future<Integer> f = pool.submit(() -> compute());
  int answer = f.get();            // waits, and wraps any exception
}

// Java 21: virtual threads. Cheap, and blocking is fine again
try (var pool = Executors.newVirtualThreadPerTaskExecutor()) {
  for (var url : urls) pool.submit(() -> fetch(url));
}                                  // closes and waits for all of them

// CPU-bound work: size to the cores. Virtual threads do not help
int n = Runtime.getRuntime().availableProcessors();
var cpuPool = Executors.newFixedThreadPool(n);

// divide and conquer
ForkJoinPool.commonPool().invoke(new MyTask(data));

// the easy version — and worth measuring
long total = list.parallelStream().mapToLong(Item::size).sum();

// CompletableFuture composes async steps without blocking
CompletableFuture
  .supplyAsync(() -> fetch(url))
  .thenApply(this::parse)
  .thenAccept(this::store)
  .exceptionally(e -> { log(e); return null; });`,
          notes: [
            { token: "an executor", meaning: "a pool that owns threads and takes tasks" },
            { token: "virtual threads", meaning: "Java 21. Cheap, and blocking one is fine" },
            { token: "availableProcessors()", meaning: "how to size a CPU-bound pool" },
            { token: "CompletableFuture", meaning: "compose async steps without blocking" },
          ],
          prompt:
            "Create the executor suited to ten thousand tasks that each block on a network call.",
          starter: `try (var pool = Executors.()) {
  for (var url : urls) pool.submit(() -> fetch(url));
}`,
          rules: {
            regex: ["Executors\\.newVirtualThreadPerTaskExecutor\\s*\\(\\s*\\)"],
            mustNot: ["newFixedThreadPool"],
            hint: "Executors.newVirtualThreadPerTaskExecutor()",
            success:
              "Correct, and the try-with-resources matters too: an ExecutorService is AutoCloseable since Java 19, and closing it waits for every submitted task to finish.",
          },
          solution: `try (var pool = Executors.newVirtualThreadPerTaskExecutor()) {
  for (var url : urls) pool.submit(() -> fetch(url));
}`,
        },

        javascript: {
          body: [
            "JavaScript is stopping you, and deliberately. Your code runs on ONE thread, and there is no way to make it run on two.",
            "That sounds like a limitation and it removes an entire category of bug. There are no data races in JavaScript, because two pieces of your code never run at the same instant.",
            "What you get instead is the EVENT LOOP. Work that waits — a network request, a timer, a file read — is handed to the runtime, and your function returns immediately. When the reply arrives, your callback is queued and run when the thread is free.",
            "That is why JavaScript handles thousands of concurrent connections on one thread: it is never waiting, only starting things and picking up results.",
            "The catch follows directly. Anything CPU-heavy blocks everything. A 200ms calculation freezes the UI, stops timers, and delays every pending request — because there is nowhere else for them to run.",
            "For real parallelism there are WORKERS: `Worker` in the browser, `worker_threads` in Node. Each has its own thread and its own memory, and they communicate by passing messages that are copied.",
            "Because memory is not shared, there are still no races — you get parallelism without the danger. The cost is that passing large data means copying it, though `Transferable` objects and `SharedArrayBuffer` exist for when that matters.",
            "The practical rule: keep the main thread for coordinating and for the UI, and put anything that computes for more than a few milliseconds into a worker.",
          ],
          predict: {
            ask: "What order do these print?",
            code: `console.log("a");
setTimeout(() => console.log("b"), 0);
Promise.resolve().then(() => console.log("c"));
console.log("d");`,
            choices: [
              { text: "a, b, c, d", why: "Both the timer and the promise callback wait for the current synchronous code to finish first." },
              { text: "a, d, c, b", why: "Correct. The synchronous lines run first — a then d. Then MICROTASKS, which is where promise callbacks live, so c. Then macrotasks like timers, so b last. Promises always beat setTimeout(0)." },
              { text: "a, d, b, c", why: "Microtasks are drained before the next macrotask, so the promise callback runs before the timer even at 0ms." },
              { text: "a, c, d, b", why: "The promise callback is queued rather than run immediately, so d comes first." },
            ],
            answer: 1,
          },
          example: `// ONE thread. No data races, because nothing runs at once

// the event loop: sync first, then microtasks, then macrotasks
console.log("a");                       // 1
Promise.resolve().then(() => log("c")); // 3 — microtask
setTimeout(() => log("b"), 0);          // 4 — macrotask
console.log("d");                       // 2

// waiting is free — start many, collect them all
const results = await Promise.all(urls.map(u => fetch(u)));

// computing is NOT free. This freezes everything for 200ms
function heavy() { for (let i = 0; i < 1e9; i++); }

// so put it in a worker — its own thread, its own memory
// main.js
const w = new Worker("./worker.js", { type: "module" });
w.postMessage({ data });
w.onmessage = (e) => console.log(e.data);

// worker.js
self.onmessage = (e) => {
  const result = heavyWork(e.data);
  self.postMessage(result);
};

// messages are COPIED, so there is still no shared state.
// Transferable objects move a buffer instead of copying it
w.postMessage(buffer, [buffer]);        // buffer is now unusable here

// in Node it is worker_threads, with the same shape
import { Worker } from "node:worker_threads";`,
          notes: [
            { token: "one thread", meaning: "no data races, and no parallelism either" },
            { token: "microtasks before macrotasks", meaning: "a promise callback beats setTimeout(0)" },
            { token: "a Worker", meaning: "its own thread AND its own memory" },
            { token: "messages are copied", meaning: "so parallelism without shared state" },
          ],
          prompt:
            "Start all the fetches at once and wait for every result, rather than one after another.",
          starter: `const results = await ;`,
          rules: {
            regex: ["Promise\\.all\\s*\\(\\s*urls\\.map\\s*\\(\\s*u\\s*=>\\s*fetch\\s*\\(\\s*u\\s*\\)\\s*\\)\\s*\\)"],
            hint: "Promise.all(urls.map(u => fetch(u)))",
            success:
              "Correct. The map starts every fetch immediately — they are already in flight before Promise.all is called. Awaiting inside a for loop would have made them strictly sequential.",
          },
          solution: `const results = await Promise.all(urls.map(u => fetch(u)));`,
        },

        rust: {
          body: [
            "Nothing. Rust has real OS threads, and it is the only language here where the compiler guarantees you cannot get them wrong.",
            "`std::thread::spawn` takes a closure and starts a thread. `join()` waits for it and gives you back what it returned.",
            "The closure almost always needs `move`, because the thread may outlive the scope that created it — and the compiler will tell you so rather than letting you find out.",
            "The guarantee comes from two traits the compiler applies automatically. `Send` means a value can be moved to another thread. `Sync` means a reference to it can be shared between threads.",
            "You never implement these; the compiler works them out. What you notice is the error when something is not `Send` — an `Rc`, for instance, whose reference count is not atomic and would be corrupted by two threads.",
            "The fix is the atomic version: `Arc` instead of `Rc`. And for shared mutable state, `Arc<Mutex<T>>` — the Arc shares ownership, the Mutex makes access exclusive.",
            "That combination is worth learning as one unit, because it is what almost all shared state in Rust looks like.",
            "The slogan is FEARLESS CONCURRENCY, and it is a fair description: a data race is a compile error here, not a bug that appears once a month in production.",
          ],
          predict: {
            ask: "Why does this fail to compile?",
            code: `use std::rc::Rc;
use std::thread;

let data = Rc::new(vec![1, 2, 3]);
let clone = Rc::clone(&data);

thread::spawn(move || {
    println!("{:?}", clone);
});`,
            choices: [
              { text: "The closure needs move", why: "It has move. The problem is what is being moved." },
              { text: "Rc is not Send — its reference count is not atomic", why: "Correct. Two threads updating a non-atomic count would corrupt it, so Rc is deliberately not Send and the compiler refuses. Arc is the atomic version and works here." },
              { text: "Vec cannot be sent between threads", why: "Vec<i32> is perfectly Send. It is the Rc wrapper that is not." },
              { text: "spawn requires a named function", why: "A closure is the normal argument to spawn." },
            ],
            answer: 1,
          },
          example: `use std::thread;
use std::sync::{Arc, Mutex};

// a thread, and move because it may outlive this scope
let data = vec![1, 2, 3];
let h = thread::spawn(move || data.len());
let n = h.join().unwrap();          // the result, or the panic

// scoped threads borrow instead — no move, no Arc
thread::scope(|s| {
    s.spawn(|| println!("{:?}", data));   // borrows data
    s.spawn(|| println!("{:?}", data));
});                                  // all joined here

// the two traits the compiler applies for you:
//   Send — this value can be MOVED to another thread
//   Sync — a reference to it can be SHARED between threads
// Rc is neither. Arc is both

// shared mutable state, the standard shape
let counter = Arc::new(Mutex::new(0));

let mut handles = vec![];
for _ in 0..4 {
    let c = Arc::clone(&counter);
    handles.push(thread::spawn(move || {
        *c.lock().unwrap() += 1;     // locked, and unlocked on drop
    }));
}
for h in handles { h.join().unwrap(); }
println!("{}", *counter.lock().unwrap());   // 4, always

// message passing, which is often better than sharing
use std::sync::mpsc;
let (tx, rx) = mpsc::channel();
thread::spawn(move || tx.send(42).unwrap());
println!("{}", rx.recv().unwrap());

// rayon turns a sequential iterator parallel in one word
// use rayon::prelude::*;
// let total: i32 = v.par_iter().sum();`,
          notes: [
            { token: "Send / Sync", meaning: "the compiler works them out. You see them in errors" },
            { token: "Arc<Mutex<T>>", meaning: "the standard shape for shared mutable state" },
            { token: "thread::scope", meaning: "borrow instead of moving. No Arc needed" },
            { token: "mpsc::channel", meaning: "send messages rather than share memory" },
          ],
          prompt:
            "Share a counter safely across threads — atomic reference counting outside, exclusive access inside.",
          starter: `use std::sync::{Arc, Mutex};

let counter = ::new(::new(0));`,
          rules: {
            regex: ["Arc::new\\s*\\(\\s*Mutex::new\\s*\\(\\s*0\\s*\\)\\s*\\)"],
            hint: "Arc::new(Mutex::new(0)) — Arc on the outside, Mutex on the inside.",
            success:
              "Correct, and the nesting order is not arbitrary: Arc lets several threads own the same thing, and the Mutex inside it makes access exclusive. Swapping them would give each thread its own lock, which protects nothing.",
          },
          solution: `use std::sync::{Arc, Mutex};

let counter = Arc::new(Mutex::new(0));`,
        },
      },
    },

    /* ---------------------------------------------------------- races -- */
    {
      id: "races",
      kicker: "02",
      title: "When two threads touch the same thing",
      hook:
        "Two threads each add 1 to a counter, a thousand times. You run it and get 1,847. Where did the other 153 go?",
      body: [
        "They were overwritten. `counter = counter + 1` is not one step — it is READ the value, ADD one, WRITE it back, and another thread can slip between any two of them.",
        "When it does, both threads read the same old value, both add one, and both write the same new value. Two increments, one result.",
        "That is a DATA RACE: two threads accessing the same memory, at least one writing, with no synchronisation. In C++ it is undefined behaviour — not a wrong answer, but a program the compiler was allowed to assume could not exist.",
        "That matters more than it sounds. The optimiser may keep the value in a register, reorder the write, or delete the loop entirely, because none of those change the behaviour of a program without races.",
        "The fix for a simple counter is an ATOMIC. `std::atomic<int>` makes read-modify-write one indivisible machine instruction, with no lock and almost no cost.",
        "For anything more than one variable, use a MUTEX and hold it while you touch the data. `std::lock_guard` takes it and releases it when the scope ends, including if an exception is thrown.",
        "Never lock by hand. `mutex.lock()` and `mutex.unlock()` around code that might throw or return early is how a lock gets left held forever, and the program stops.",
        "And `volatile` is not the answer. It is about memory-mapped hardware, it provides no atomicity and no ordering, and using it for threading is a well-established mistake.",
      ],
      predict: {
        ask: "Which of these is safe?",
        code: `int a = 0;
volatile int b = 0;
std::atomic<int> c = 0;

// from several threads:
a++;    // A
b++;    // B
c++;    // C`,
        choices: [
          { text: "B and C", why: "volatile stops the compiler caching the value in a register and does nothing about atomicity — b++ is still read, add, write." },
          { text: "Only C", why: "Correct. Only std::atomic makes the increment indivisible. A plain int is a data race, and volatile is about hardware registers — it gives no atomicity and no ordering guarantees between threads." },
          { text: "All three, since ++ is one instruction", why: "It is not one instruction on any common architecture, and even where it were, it would not be atomic without a lock prefix." },
          { text: "None — you always need a mutex", why: "An atomic increment is exactly the case where a mutex is unnecessary. It compiles to a single locked instruction." },
        ],
        answer: 1,
      },
      viz: traceRace(),
      example: `#include <atomic>
#include <mutex>

// one variable: an atomic. No lock, almost no cost
std::atomic<int> counter{0};
counter++;                        // indivisible
counter.fetch_add(1);             // the same, spelled out
int now = counter.load();

// more than one variable: a mutex, held while you touch them
std::mutex m;

void transfer(Account& from, Account& to, int amount) {
  std::lock_guard<std::mutex> g(m);   // released at the end of scope
  from.balance -= amount;
  to.balance   += amount;
}                                     // and released if this throws

// NEVER by hand — an early return or a throw leaves it locked
// m.lock(); ...; m.unlock();

// two locks: take them TOGETHER to avoid deadlock
std::scoped_lock g(m1, m2);       // C++17, deadlock-free

// a shared mutex, when reads far outnumber writes
std::shared_mutex sm;
{ std::shared_lock r(sm); read(); }      // many readers
{ std::unique_lock w(sm); write(); }     // one writer

// run something exactly once, safely
std::once_flag flag;
std::call_once(flag, [] { init(); });

// volatile is NOT for threading. It is for hardware registers.
// No atomicity, no ordering. Using it here is a known mistake`,
      notes: [
        { token: "std::atomic<int>", meaning: "one variable, indivisible, no lock" },
        { token: "std::lock_guard", meaning: "takes the lock, releases it on scope exit" },
        { token: "std::scoped_lock(m1, m2)", meaning: "two locks at once, without deadlocking" },
        { token: "volatile", meaning: "for hardware. Not for threads, ever" },
      ],
      challenge: {
        prompt:
          "Protect the transfer with a lock that is released however the function is left.",
        starter: `void transfer(Account& from, Account& to, int amount) {
  <std::mutex> g(m);
  from.balance -= amount;
  to.balance   += amount;
}`,
        rules: {
          regex: ["std::lock_guard\\s*<\\s*std::mutex\\s*>\\s*g\\s*\\(\\s*m\\s*\\)|std::scoped_lock"],
          hint: "std::lock_guard<std::mutex> g(m);",
          success:
            "Correct. That is RAII again: the guard's destructor unlocks, so an early return or a thrown exception cannot leave the mutex held — which is exactly what a hand-written unlock gets wrong.",
        },
        solution: `void transfer(Account& from, Account& to, int amount) {
  std::lock_guard<std::mutex> g(m);
  from.balance -= amount;
  to.balance   += amount;
}`,
      },

      alt: {
        c: {
          body: [
            "They were overwritten. `counter++` is read, add, write, and another thread can slip between any two of those.",
            "In C this is undefined behaviour exactly as in C++, and the consequences are the same: the compiler is entitled to assume it cannot happen, and optimises accordingly.",
            "`pthread_mutex_t` is the standard lock. `pthread_mutex_lock` before touching the shared data, `pthread_mutex_unlock` after.",
            "C has no RAII, so there is no lock guard. Every path out of the critical section must unlock — which means the goto-cleanup discipline from Error Handling applies here too, and forgetting one path leaves the program permanently stuck.",
            "Keep critical sections SHORT and simple for this reason. A long function with several returns, all of which must unlock, is asking for trouble.",
            "C11 added `<stdatomic.h>`: `atomic_int counter; atomic_fetch_add(&counter, 1);`, or simply `counter++` on an atomic type. Support is good on Linux and macOS, and MSVC only added it recently.",
            "`volatile` is not a threading tool in C either. It prevents the compiler caching a value in a register — which matters for memory-mapped hardware and for `sigatomic_t` in signal handlers, and provides no atomicity at all.",
            "For read-heavy data there is `pthread_rwlock_t`, and for one-time initialisation `pthread_once`. Both are worth knowing before you write your own.",
          ],
          predict: {
            ask: "What is wrong with this?",
            code: `pthread_mutex_lock(&m);

if (balance < amount) return -1;

balance -= amount;
pthread_mutex_unlock(&m);
return 0;`,
            choices: [
              { text: "Nothing — the early return is fine", why: "The early return skips the unlock, leaving the mutex held forever." },
              { text: "The early return skips the unlock, so the mutex is never released", why: "Correct. Every thread that tries to take it afterwards blocks forever. C has no RAII, so every path out of a critical section must unlock — unlock before returning, or use a goto-cleanup label." },
              { text: "balance should be volatile", why: "volatile provides no atomicity and would not help. The mutex is the right tool; the bug is the path that skips it." },
              { text: "The lock is taken too early", why: "The check has to be inside the lock, or another thread could change the balance between the check and the subtraction." },
            ],
            answer: 1,
          },
          example: `#include <pthread.h>
#include <stdatomic.h>

/* one variable: C11 atomics */
atomic_int counter = 0;
counter++;                        /* indivisible */
atomic_fetch_add(&counter, 1);    /* the same, spelled out */
int now = atomic_load(&counter);

/* more than one: a mutex */
pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;

int transfer(int amount) {
  int rc = -1;
  pthread_mutex_lock(&m);

  if (balance < amount) goto out;   /* NOT a bare return */

  balance -= amount;
  rc = 0;

out:
  pthread_mutex_unlock(&m);         /* every path unlocks */
  return rc;
}

/* no RAII, so keep critical sections SHORT and simple */

/* reads far outnumber writes? */
pthread_rwlock_t rw = PTHREAD_RWLOCK_INITIALIZER;
pthread_rwlock_rdlock(&rw);       /* many readers */
pthread_rwlock_wrlock(&rw);       /* one writer  */

/* initialise exactly once */
pthread_once_t once = PTHREAD_ONCE_INIT;
pthread_once(&once, init);

/* volatile is NOT a threading tool. No atomicity, no ordering */`,
          notes: [
            { token: "no RAII", meaning: "every path out must unlock. Use goto out" },
            { token: "atomic_int", meaning: "C11. One variable, indivisible" },
            { token: "pthread_rwlock", meaning: "many readers, or one writer" },
            { token: "volatile", meaning: "for hardware and signal handlers. Not for threads" },
          ],
          prompt:
            "Fix the early return so the mutex is released on every path.",
          starter: `pthread_mutex_lock(&m);

if (balance < amount) return -1;

balance -= amount;

out:
  pthread_mutex_unlock(&m);
  return rc;`,
          rules: {
            regex: ["if\\s*\\(\\s*balance\\s*<\\s*amount\\s*\\)\\s*goto\\s+out\\s*;"],
            mustNot: ["return -1;"],
            hint: "goto out; instead of return -1; so the unlock at the bottom still runs.",
            success:
              "Correct. This is the same single-exit discipline as the cleanup blocks in Error Handling, and a held mutex is a worse failure than a leak — the program does not crash, it silently stops.",
          },
          solution: `pthread_mutex_lock(&m);

if (balance < amount) goto out;

balance -= amount;

out:
  pthread_mutex_unlock(&m);
  return rc;`,
        },

        python: {
          body: [
            "In CPython, probably nowhere — and that is the confusing part.",
            "The GIL means only one thread runs bytecode at a time, so many operations happen to be atomic by accident. `list.append` is safe. A simple `counter += 1` usually is not, because it is several bytecodes and a switch can occur between them.",
            "'Usually' is the problem. Code that relies on the GIL for safety is relying on an implementation detail that changes between versions, does not hold on other Python implementations, and disappears entirely in the free-threaded builds.",
            "So write it as if there were no GIL. `threading.Lock` is the tool, and `with lock:` is how to use it — it releases on every path, including an exception.",
            "`threading.RLock` is re-entrant: the same thread may take it more than once. Use it when a locked method calls another locked method, which otherwise deadlocks against itself.",
            "For a counter specifically, `itertools.count()` is thread-safe in CPython and a `queue.Queue` is thread-safe by design — often the simplest answer is a data structure that already handles it.",
            "The wider advice is the same as everywhere: prefer not sharing. `queue.Queue` between producer and consumer threads, or `concurrent.futures` returning results, avoids the question entirely.",
            "One Python-specific trap: a lock held while doing I/O releases the GIL but NOT the lock, so every other thread wanting that lock still waits. Keep the locked region to the state change alone.",
          ],
          predict: {
            ask: "Which of these needs a lock in CPython?",
            code: `items.append(x)      # A
counter += 1         # B
d[key] = value       # C`,
            choices: [
              { text: "All three", why: "append and a single dict assignment are each one bytecode operation and cannot be interrupted part-way." },
              { text: "Only B", why: "Correct. list.append and a plain dict assignment are single bytecode operations, so the GIL makes them atomic. `counter += 1` is a load, an add and a store, and a thread switch can happen between them." },
              { text: "Only A", why: "append is the safe one. It is the read-modify-write in B that is not." },
              { text: "None — the GIL protects everything", why: "The GIL only guarantees that one bytecode runs at a time, not that a line of source is one bytecode." },
            ],
            answer: 1,
          },
          example: `import threading

# the GIL makes SOME things accidentally atomic
items.append(x)              # one bytecode — safe
d[key] = value               # one bytecode — safe
counter += 1                 # load, add, store — NOT safe

# do not rely on that. Write it as if there were no GIL
lock = threading.Lock()

with lock:                   # released on every path, exceptions too
    counter += 1

# re-entrant, when a locked method calls another locked one
rlock = threading.RLock()

# a semaphore, to limit how many run at once
sem = threading.Semaphore(5)
with sem:
    fetch(url)

# waiting for a signal
event = threading.Event()
event.wait()                 # blocks until another thread sets it
event.set()

# often simplest: use a structure that is already thread-safe
from queue import Queue
q = Queue()
q.put(item)                  # producer
item = q.get()               # consumer, blocks until there is one

# or avoid sharing entirely
from concurrent.futures import ThreadPoolExecutor
with ThreadPoolExecutor() as ex:
    results = list(ex.map(work, items))

# keep the locked region to the STATE CHANGE. A lock held during
# I/O releases the GIL but not the lock`,
          notes: [
            { token: "accidentally atomic", meaning: "append and a dict set. Do not rely on it" },
            { token: "with lock:", meaning: "released on every path, exceptions included" },
            { token: "RLock", meaning: "re-entrant. For a locked method calling a locked method" },
            { token: "queue.Queue", meaning: "thread-safe by design. Often the simplest answer" },
          ],
          prompt:
            "Protect the increment so it is correct with or without the GIL.",
          starter: `lock = threading.Lock()

 lock:
    counter += 1`,
          rules: {
            regex: ["with\\s+lock\\s*:"],
            hint: "with lock:",
            success:
              "Correct, and `with` rather than lock.acquire()/release() is the point: the release happens even if the body raises, which a hand-written pair would skip.",
          },
          solution: `lock = threading.Lock()

with lock:
    counter += 1`,
        },

        java: {
          body: [
            "They were overwritten. `counter++` is read, add, write, and another thread can interleave between them.",
            "Java's oldest tool is `synchronized`, which takes a lock on an object for the duration of a block or a method. It is simple, it always releases, and for a long time it was all there was.",
            "The modern toolkit is much better. `AtomicInteger` for a counter, `ConcurrentHashMap` for a shared map, `ReentrantLock` when you need `tryLock` or a timeout.",
            "The prefer-these-first rule is worth stating: use a concurrent data structure before a lock, and an atomic before a synchronized block. Both are faster and harder to get wrong.",
            "`volatile` in Java does mean something — unlike in C and C++. It guarantees visibility: a write by one thread is seen by others, and it prevents certain reorderings.",
            "But it does NOT make `count++` atomic. It is right for a `volatile boolean running` flag that one thread sets and another reads, and wrong for anything read-modify-write.",
            "The underlying rules are the JAVA MEMORY MODEL, which defines when one thread's write is guaranteed visible to another. Every synchronized block, volatile access and atomic operation creates one of those guarantees.",
            "Without one, there is no promise at all: a thread can loop forever on a plain boolean that another thread set, because nothing required it to re-read from memory.",
          ],
          predict: {
            ask: "Which of these correctly stops the loop?",
            code: `// A
boolean running = true;

// B
volatile boolean running = true;

// thread 1: while (running) { work(); }
// thread 2: running = false;`,
            choices: [
              { text: "Both", why: "With a plain boolean, nothing requires thread 1 to ever re-read it from memory — the JIT may hoist the read out of the loop." },
              { text: "Only B", why: "Correct. volatile guarantees the write is visible to other threads. Without it the compiler may keep running in a register and loop forever — a real bug that often only appears in an optimised build." },
              { text: "Only A", why: "A is the broken one. volatile is exactly the fix for this case." },
              { text: "Neither — you need synchronized", why: "volatile is sufficient for a simple flag. synchronized would also work and is heavier than necessary." },
            ],
            answer: 1,
          },
          example: `import java.util.concurrent.atomic.*;
import java.util.concurrent.locks.*;

// prefer an atomic to a lock, for one variable
AtomicInteger counter = new AtomicInteger();
counter.incrementAndGet();
counter.addAndGet(5);
counter.compareAndSet(5, 10);

// prefer a concurrent structure to locking a plain one
var map = new ConcurrentHashMap<String,Integer>();
map.merge(key, 1, Integer::sum);       // atomic

// the oldest tool: synchronized. Always released
synchronized (this) {
  from -= amount;
  to   += amount;
}
synchronized void transfer() { }       // locks on the instance

// more control: tryLock, timeouts, fairness
ReentrantLock lock = new ReentrantLock();
lock.lock();
try { work(); } finally { lock.unlock(); }   // finally, always

if (lock.tryLock(1, TimeUnit.SECONDS)) { }   // give up rather than wait

// volatile means VISIBILITY, and only that
volatile boolean running = true;       // correct for a flag
// volatile int count; count++;        // still NOT atomic

// read-heavy
var rw = new ReentrantReadWriteLock();
rw.readLock().lock();                  // many readers
rw.writeLock().lock();                 // one writer`,
          notes: [
            { token: "AtomicInteger", meaning: "prefer it to a lock for one variable" },
            { token: "ConcurrentHashMap", meaning: "prefer it to locking a plain HashMap" },
            { token: "volatile", meaning: "visibility only. Not atomicity" },
            { token: "lock() then try/finally", meaning: "or an exception leaves it held" },
          ],
          prompt:
            "Increment the shared counter without a lock, using the type built for it.",
          starter: `AtomicInteger counter = new AtomicInteger();

counter.();`,
          rules: {
            regex: ["counter\\.(incrementAndGet|getAndIncrement|addAndGet)\\s*\\("],
            hint: "counter.incrementAndGet()",
            success:
              "Correct. incrementAndGet returns the new value and getAndIncrement returns the old one — pick by which you need, since both are equally atomic.",
          },
          solution: `AtomicInteger counter = new AtomicInteger();

counter.incrementAndGet();`,
        },

        javascript: {
          body: [
            "Nowhere. In JavaScript this bug cannot happen, because your code never runs on two threads at once.",
            "That is worth appreciating: no locks, no atomics, no memory model to learn. A function runs to completion before anything else on that thread runs at all.",
            "But there is a subtler race, and it catches everyone eventually. `await` is a suspension point — while you are awaiting, OTHER code runs.",
            "So a function that reads a value, awaits something, and then writes based on what it read can be interleaved with another call to itself. Two overlapping calls can both read the old value.",
            "That is not a data race — no memory is corrupted — but the logic is wrong in exactly the same way. The usual answers are to re-read after the await, to guard with a promise-based mutex, or to make the operation idempotent.",
            "Web Workers do run in parallel, and they cannot race either, because each has its own memory and messages are copied.",
            "The exception is `SharedArrayBuffer`, which genuinely shares memory between workers. That brings real data races back, and JavaScript grew an `Atomics` object specifically for it — `Atomics.add`, `Atomics.wait`, `Atomics.store`.",
            "You will rarely need it. It exists for WebAssembly threads and for high-performance numeric code, and outside those it is almost always the wrong tool.",
          ],
          predict: {
            ask: "What can go wrong here if two requests arrive at once?",
            code: `let balance = 100;

async function withdraw(n) {
  const current = balance;
  await checkFraud(n);
  balance = current - n;
}`,
            choices: [
              { text: "Nothing — JavaScript is single-threaded", why: "Single-threaded prevents memory corruption, and await lets another call run in the middle of this one." },
              { text: "Both calls read 100 before either writes, so one withdrawal is lost", why: "Correct. await is a suspension point: while checkFraud runs, the second withdraw starts and reads the same balance of 100. The last write wins and the other withdrawal vanishes. Re-read after the await, or serialise the operation." },
              { text: "A data race corrupts balance", why: "There is no memory corruption — each assignment is complete. The interleaving of logic is what goes wrong." },
              { text: "checkFraud will throw", why: "Nothing about the fraud check is affected. The problem is the value read before the await." },
            ],
            answer: 1,
          },
          example: `// no data races: your code never runs on two threads at once
// no locks, no atomics, no memory model

// BUT await is a suspension point — other code runs during it
let balance = 100;

async function bad(n) {
  const current = balance;       // read
  await checkFraud(n);           // ← another call can run here
  balance = current - n;         // write, based on a stale read
}

async function good(n) {
  await checkFraud(n);
  balance -= n;                  // read and write with no await between
}

// or serialise it with a promise chain as a mutex
let queue = Promise.resolve();
function serialise(fn) {
  queue = queue.then(fn, fn);
  return queue;
}

// workers run in parallel and still cannot race —
// separate memory, and messages are copied

// the one exception: SharedArrayBuffer genuinely shares memory
const sab = new SharedArrayBuffer(4);
const view = new Int32Array(sab);
Atomics.add(view, 0, 1);         // real atomics, because real races
Atomics.wait(view, 0, 0);

// it needs cross-origin isolation headers to be enabled at all,
// and outside WebAssembly threads it is almost always the wrong tool`,
          notes: [
            { token: "no data races", meaning: "one thread. No locks and no atomics needed" },
            { token: "await is a suspension point", meaning: "other code runs during it. The real trap" },
            { token: "workers", meaning: "parallel, and separate memory. Still no races" },
            { token: "SharedArrayBuffer + Atomics", meaning: "real shared memory. Rarely the right tool" },
          ],
          prompt:
            "Fix the withdrawal so no other call can slip between the read and the write.",
          starter: `async function withdraw(n) {
  const current = balance;
  await checkFraud(n);
  balance = current - n;
}`,
          rules: {
            regex: ["await\\s+checkFraud\\s*\\(\\s*n\\s*\\)\\s*;\\s*balance\\s*-=\\s*n"],
            mustNot: ["const current = balance;"],
            hint: "Do the await FIRST, then read and write with nothing suspending in between.",
            success:
              "Correct. With no await between the read and the write, the whole update is one uninterruptible run — which is the single-threaded equivalent of holding a lock.",
          },
          solution: `async function withdraw(n) {
  await checkFraud(n);
  balance -= n;
}`,
        },

        rust: {
          body: [
            "It cannot happen. A data race in safe Rust is a compile error, and this is the language's headline claim.",
            "The mechanism is the borrow checker applied across threads. Sharing a `&mut` between two threads would require two mutable borrows at once, which the rules already forbid.",
            "So shared mutable state has to go through a type that makes it safe, and the compiler will not let you skip it.",
            "`Mutex<T>` holds the data INSIDE the lock rather than beside it. There is no way to reach the value without locking, because `lock()` is what hands you access.",
            "Compare that with C++, where a mutex and the data it protects are two separate things and nothing stops you touching the data without the lock. Rust makes the relationship part of the type.",
            "`lock()` returns a `Result`, because a thread that panicked while holding the lock POISONS it. Handling that is usually `.unwrap()` — if another thread panicked mid-update, the state may be inconsistent and crashing is reasonable.",
            "The guard unlocks when it is dropped, so the scope controls the lock exactly as `lock_guard` does in C++ — with the addition that you cannot forget to take it in the first place.",
            "For a counter, `AtomicUsize` avoids the lock entirely. And `RwLock<T>` is the many-readers-or-one-writer version, worth using when reads dominate.",
          ],
          predict: {
            ask: "Why does lock() return a Result?",
            code: `let counter = Arc::new(Mutex::new(0));
*counter.lock().unwrap() += 1;`,
            choices: [
              { text: "Because locking can time out", why: "lock() waits indefinitely. There is a separate try_lock for the non-blocking case." },
              { text: "A thread that panics while holding it POISONS the lock, and later lockers are told", why: "Correct. If a thread panicked mid-update the protected data may be half-modified, so subsequent lock() calls return Err. unwrap propagates that panic, which is usually right — the state cannot be trusted." },
              { text: "Because the mutex might not be initialised", why: "A Mutex is fully initialised when constructed. Poisoning is the reason for the Result." },
              { text: "To report that another thread holds it", why: "lock() waits for that rather than erroring. try_lock is the one that reports contention." },
            ],
            answer: 1,
          },
          example: `use std::sync::{Arc, Mutex, RwLock};
use std::sync::atomic::{AtomicUsize, Ordering};

// the data lives INSIDE the lock. No way to reach it unlocked
let counter = Arc::new(Mutex::new(0));

{
    let mut n = counter.lock().unwrap();
    *n += 1;
}                                   // unlocked here, on drop

// lock() returns a Result because a panic POISONS the lock
match counter.lock() {
    Ok(mut n) => *n += 1,
    Err(poisoned) => { /* a thread panicked mid-update */ }
}

// a counter needs no lock at all
let hits = AtomicUsize::new(0);
hits.fetch_add(1, Ordering::Relaxed);
println!("{}", hits.load(Ordering::Relaxed));

// reads dominate? many readers OR one writer
let config = RwLock::new(Config::default());
{ let c = config.read().unwrap();  use_it(&c); }
{ let mut c = config.write().unwrap(); c.update(); }

// often better than sharing: send messages
use std::sync::mpsc;
let (tx, rx) = mpsc::channel();
for i in 0..4 {
    let tx = tx.clone();
    std::thread::spawn(move || tx.send(work(i)).unwrap());
}
drop(tx);                           // so the loop below ends
for got in rx { println!("{:?}", got); }

// a data race in safe Rust is a COMPILE error, not a bug`,
          notes: [
            { token: "Mutex<T>", meaning: "the data lives inside the lock. You cannot skip it" },
            { token: "lock() -> Result", meaning: "a panic while holding it poisons the lock" },
            { token: "AtomicUsize", meaning: "a counter with no lock at all" },
            { token: "mpsc::channel", meaning: "send messages instead of sharing memory" },
          ],
          prompt:
            "Increment the shared counter — take the lock, handle the poisoned case, and add one.",
          starter: `let counter = Arc::new(Mutex::new(0));

*counter.() += 1;`,
          rules: {
            regex: ["\\*\\s*counter\\.lock\\s*\\(\\s*\\)\\.unwrap\\s*\\(\\s*\\)\\s*\\+=\\s*1"],
            hint: "*counter.lock().unwrap() += 1;",
            success:
              "Correct, and the leading * is worth noticing: lock() hands back a guard, not the number, and dereferencing the guard is what reaches the value inside — which is also what unlocks it when the guard is dropped.",
          },
          solution: `let counter = Arc::new(Mutex::new(0));

*counter.lock().unwrap() += 1;`,
        },
      },
    },

    /* ---------------------------------------------------------- async -- */
    {
      id: "async",
      kicker: "03",
      title: "Waiting without stopping",
      hook:
        "Your server handles a thousand connections, each mostly waiting for a database. Do you want a thousand threads?",
      body: [
        "No. A thread costs about a megabyte of stack and a system call to create, and a thousand mostly-idle threads spend more time being switched between than doing work.",
        "The alternative is ASYNC: instead of a thread that blocks, you write a function that SUSPENDS. When it hits a wait, it hands control back, and the runtime picks up something else.",
        "One thread can then have thousands of operations in flight, because none of them is occupying it while it waits.",
        "C++20 added coroutines with `co_await`, `co_return` and `co_yield` — and shipped only the low-level machinery. The standard library has no async runtime, no executor and no async I/O.",
        "That means using async in C++ today means picking a library: Boost.Asio is the established one, and there are several newer ones. This is the least settled corner of modern C++.",
        "`std::async` and `std::future` are the older, simpler alternative. They give you 'run this and collect the result later', which covers a lot of cases without any coroutine machinery.",
        "The rule that decides all of this is the same in every language: async helps when you are WAITING. If your thread is computing, async gains you nothing — you need more cores.",
        "And mixing them is normal. A server might use async for its I/O and a thread pool for the CPU-heavy parts of each request.",
      ],
      predict: {
        ask: "Which of these does the C++ standard library provide?",
        code: `co_await something;      // A: coroutine syntax
std::async(...);         // B: run and collect later
async file I/O           // C: a built-in async runtime`,
        choices: [
          { text: "All three", why: "C++20 shipped the coroutine language machinery without any runtime or async I/O to use it with." },
          { text: "A and B", why: "Correct. The coroutine keywords exist and std::async/std::future exist, but there is no standard executor, no async I/O and no scheduler. Async C++ today means choosing a library such as Boost.Asio." },
          { text: "Only B", why: "The coroutine keywords are genuinely part of C++20 — they simply have no standard library to drive them." },
          { text: "Only A", why: "std::async and std::future have been in the standard library since C++11." },
        ],
        answer: 1,
      },
      viz: traceEventLoop(),
      example: `#include <future>
#include <coroutine>

// the simple form: run it, collect it later
auto fut = std::async(std::launch::async, [] { return fetch(url); });
// ... other work ...
auto data = fut.get();          // waits here, and rethrows

// several at once
std::vector<std::future<int>> futs;
for (auto& u : urls)
  futs.push_back(std::async(std::launch::async, [&] { return fetch(u); }));
for (auto& f : futs) total += f.get();

// C++20 coroutines: the KEYWORDS exist
Task<int> fetchAll() {
  auto a = co_await get(url1);
  auto b = co_await get(url2);
  co_return a + b;
}
// but Task<T> is yours to write, or a library's.
// The standard has no runtime, no executor, no async I/O

// so in practice, a library:
//   Boost.Asio    the established one
//   libunifex, stdexec   the newer direction

// a promise/future pair, when one thread produces for another
std::promise<int> p;
auto f = p.get_future();
std::thread([&p] { p.set_value(compute()); }).detach();
int answer = f.get();

// async is for WAITING. Computing needs cores, not coroutines`,
      notes: [
        { token: "std::async + future", meaning: "run it, collect it later. No coroutines needed" },
        { token: "co_await / co_return", meaning: "C++20 keywords, with no standard runtime" },
        { token: "Boost.Asio", meaning: "what async C++ actually uses today" },
        { token: "async is for waiting", meaning: "computing needs cores, not coroutines" },
      ],
      challenge: {
        prompt:
          "Start every fetch at once, then collect all the results.",
        starter: `std::vector<std::future<int>> futs;

for (auto& u : urls)
  futs.push_back(std::(std::launch::async, [&] { return fetch(u); }));

for (auto& f : futs) total += f.;`,
        rules: {
          regex: ["std::async\\s*\\(\\s*std::launch::async", "f\\.get\\s*\\(\\s*\\)"],
          hint: "std::async(std::launch::async, ...) to start each one, then f.get() to collect.",
          success:
            "Correct, and the two loops matter: starting them all before getting any is what makes them overlap. Calling get inside the first loop would wait for each before starting the next.",
        },
        solution: `std::vector<std::future<int>> futs;

for (auto& u : urls)
  futs.push_back(std::async(std::launch::async, [&] { return fetch(u); }));

for (auto& f : futs) total += f.get();`,
      },

      alt: {
        c: {
          hook:
            "Your server handles a thousand connections, each mostly waiting. C has no async and no coroutines. What do you use?",
          body: [
            "An EVENT LOOP built on the operating system's readiness API — which is what every async runtime in every other language is doing underneath.",
            "The idea is a single call that says 'here are a thousand file descriptors; wake me when any of them is ready'. One thread then handles whichever ones are.",
            "The portable version is `poll`. It takes an array of descriptors and returns the ones that are ready, and it is O(n) per call because it walks the whole array every time.",
            "For large numbers, the platform-specific versions are far better: `epoll` on Linux, `kqueue` on BSD and macOS, IOCP on Windows. They keep the registered set in the kernel, so a call costs about the number of READY descriptors rather than the total.",
            "The sockets must be set NON-BLOCKING with `fcntl(fd, F_SETFL, O_NONBLOCK)`, or a read on a socket the kernel said was ready can still block — and one blocked read stops the entire loop.",
            "This is the pattern nginx, redis and libuv are built on, and libuv is what Node.js uses. Writing it once by hand is the best way to understand what `await` is doing everywhere else.",
            "The cost is that all your logic becomes callbacks and state machines. There is no `await` to make the sequence read like ordinary code, which is exactly the problem coroutines were invented to solve.",
          ],
          predict: {
            ask: "Why must the sockets be non-blocking even when poll says they are ready?",
            code: `poll(fds, n, -1);

if (fds[i].revents & POLLIN) {
  read(fds[i].fd, buf, sizeof buf);
}`,
            choices: [
              { text: "They need not be — poll guarantees the read will not block", why: "Readiness can be stale by the time you act on it, and some conditions report readable without a full read being available." },
              { text: "Readiness can be stale, and one blocking read stops the entire loop", why: "Correct. Between poll returning and your read running, another thread may consume the data, or the readiness may have been spurious. On a blocking socket that read then stops the whole event loop — every other connection stalls." },
              { text: "Non-blocking makes reads faster", why: "It changes what happens when there is no data, not the speed of a successful read." },
              { text: "poll requires it to compile", why: "poll works on blocking descriptors too. The requirement is about correctness under load, not the API." },
            ],
            answer: 1,
          },
          example: `#include <poll.h>
#include <fcntl.h>

/* the sockets MUST be non-blocking, or one read stalls everything */
int flags = fcntl(fd, F_GETFL, 0);
fcntl(fd, F_SETFL, flags | O_NONBLOCK);

/* the portable event loop */
struct pollfd fds[MAX];
fds[0].fd = listen_fd;
fds[0].events = POLLIN;

for (;;) {
  int n = poll(fds, count, -1);        /* wait for ANY of them */
  if (n < 0) { if (errno == EINTR) continue; break; }

  for (int i = 0; i < count; i++) {
    if (fds[i].revents & POLLIN)  handle_read(fds[i].fd);
    if (fds[i].revents & POLLOUT) handle_write(fds[i].fd);
    if (fds[i].revents & (POLLERR | POLLHUP)) close_conn(i);
  }
}

/* poll is O(n) per call — it walks the whole array.
   For thousands of connections use the platform version:
     epoll   Linux
     kqueue  BSD and macOS
     IOCP    Windows
   These keep the set in the kernel, so a call costs about the
   number of READY descriptors rather than the total */

/* this is what nginx, redis and libuv do — and libuv is what
   Node.js runs on. No await, so the logic becomes a state machine */`,
          notes: [
            { token: "poll", meaning: "portable, and O(n) per call" },
            { token: "epoll / kqueue / IOCP", meaning: "the platform versions. O(ready), not O(total)" },
            { token: "O_NONBLOCK", meaning: "required. One blocking read stalls the whole loop" },
            { token: "no await", meaning: "the logic becomes callbacks and state machines" },
          ],
          prompt:
            "Make the socket non-blocking before adding it to the event loop.",
          starter: `int flags = fcntl(fd, F_GETFL, 0);
fcntl(fd, , flags | );`,
          rules: {
            regex: ["fcntl\\s*\\(\\s*fd\\s*,\\s*F_SETFL\\s*,\\s*flags\\s*\\|\\s*O_NONBLOCK\\s*\\)"],
            hint: "fcntl(fd, F_SETFL, flags | O_NONBLOCK)",
            success:
              "Correct, and reading the flags first is what makes it safe: passing O_NONBLOCK alone would clear every other flag already set on the descriptor.",
          },
          solution: `int flags = fcntl(fd, F_GETFL, 0);
fcntl(fd, F_SETFL, flags | O_NONBLOCK);`,
        },

        python: {
          body: [
            "No. `asyncio` lets one thread hold thousands of connections, because a coroutine that is waiting occupies nothing.",
            "`async def` makes a coroutine. Calling it does NOT run it — it returns a coroutine object, and you have to await it or hand it to the loop.",
            "That is the first thing people trip over: `fetch(url)` with no await does nothing at all, and Python warns that a coroutine was never awaited.",
            "`await` suspends the current coroutine until the awaited thing finishes, letting the loop run others in the meantime. It is only legal inside an `async def`.",
            "`asyncio.run(main())` starts the loop and runs one coroutine to completion. That is the entry point; everything else is awaited from inside it.",
            "For concurrency, `await` on its own is sequential. `asyncio.gather(*tasks)` runs them all at once, and `asyncio.TaskGroup` (3.11+) is the modern version that cancels the rest if one fails.",
            "The rule that matters most: never call a blocking function inside a coroutine. `time.sleep`, `requests.get`, a synchronous database driver — any of them stops the entire loop and every other connection with it.",
            "Use the async equivalents — `asyncio.sleep`, `httpx` or `aiohttp`, an async driver — or push the blocking call to a thread with `asyncio.to_thread`.",
          ],
          predict: {
            ask: "How long does each take?",
            code: `# A
for url in urls:            # 10 urls, 1 second each
    await fetch(url)

# B
await asyncio.gather(*[fetch(u) for u in urls])`,
            choices: [
              { text: "Both about 1 second", why: "Awaiting inside a loop waits for each one to finish before starting the next." },
              { text: "A is about 10 seconds, B is about 1", why: "Correct. await suspends until that one finishes, so A is strictly sequential. gather starts all ten immediately and waits for the last, so the total is about the slowest single request." },
              { text: "Both about 10 seconds", why: "gather is exactly the mechanism for overlapping them." },
              { text: "A is faster because it has less overhead", why: "The overhead of gather is microseconds against nine seconds of avoidable waiting." },
            ],
            answer: 1,
          },
          example: `import asyncio

async def fetch(url):
    await asyncio.sleep(1)          # NOT time.sleep
    return url

# calling it does not run it — it makes a coroutine object
coro = fetch("a")                   # nothing has happened yet
result = await coro                 # now it runs

# sequential: 10 seconds for 10 urls
for u in urls:
    await fetch(u)

# concurrent: about 1 second
results = await asyncio.gather(*[fetch(u) for u in urls])

# the modern form — cancels the rest if one fails
async with asyncio.TaskGroup() as tg:
    tasks = [tg.create_task(fetch(u)) for u in urls]

# the entry point
asyncio.run(main())

# NEVER block inside a coroutine. These stop EVERYTHING:
#   time.sleep(1)        use asyncio.sleep
#   requests.get(url)    use httpx or aiohttp
#   a sync db driver     use an async one

# when you must call something blocking
data = await asyncio.to_thread(blocking_read, path)

# a timeout
async with asyncio.timeout(5):
    await slow()`,
          notes: [
            { token: "async def", meaning: "makes a coroutine. Calling it does not run it" },
            { token: "await", meaning: "suspends this one, lets the loop run others" },
            { token: "gather / TaskGroup", meaning: "run them at once. await alone is sequential" },
            { token: "never block", meaning: "time.sleep or requests stops the whole loop" },
          ],
          prompt:
            "Fetch every url concurrently rather than one after another.",
          starter: `results = await asyncio.()`,
          rules: {
            regex: ["asyncio\\.gather\\s*\\(\\s*\\*\\s*\\[\\s*fetch\\s*\\(\\s*u\\s*\\)\\s+for\\s+u\\s+in\\s+urls\\s*\\]\\s*\\)"],
            hint: "asyncio.gather(*[fetch(u) for u in urls]) — note the star, which unpacks the list into arguments.",
            success:
              "Correct. The star is required: gather takes the coroutines as separate arguments, and passing the list itself would try to await a list and fail.",
          },
          solution: `results = await asyncio.gather(*[fetch(u) for u in urls])`,
        },

        java: {
          body: [
            "You can now, and that is a recent change worth understanding.",
            "Before Java 21, a thread per connection genuinely did not scale — a platform thread is an OS thread with about a megabyte of stack, so a thousand of them is a gigabyte and a great deal of switching.",
            "So Java went the async route: `CompletableFuture`, reactive libraries like Reactor and RxJava, and a lot of code written as chained callbacks to avoid ever blocking a thread.",
            "That worked and it cost readability. A sequence of three dependent calls became a chain of `thenCompose` with the error handling somewhere else entirely, and stack traces stopped naming the code you wrote.",
            "VIRTUAL THREADS changed the answer. A virtual thread costs a few hundred bytes, and blocking one unmounts it from its carrier rather than occupying an OS thread — so ordinary blocking code scales to hundreds of thousands of concurrent operations.",
            "The practical consequence is that in modern Java you write straightforward blocking code again, and run it on virtual threads. The async-everywhere style is no longer necessary for scale.",
            "`CompletableFuture` remains useful for COMPOSING independent operations — running three calls at once and combining them — which virtual threads do not make redundant.",
            "One thing to know: a virtual thread pinned by a `synchronized` block cannot unmount, which stalls its carrier. Prefer `ReentrantLock` in code that runs on virtual threads.",
          ],
          predict: {
            ask: "What is the modern Java answer for 10,000 concurrent HTTP calls?",
            code: `// A: 10,000 platform threads
// B: CompletableFuture chains on a small pool
// C: 10,000 virtual threads, blocking normally`,
            choices: [
              { text: "A — threads are cheap now", why: "Platform threads are still about a megabyte each. 10,000 of them is roughly 10 GB of stack." },
              { text: "C — blocking a virtual thread frees its carrier, so plain code scales", why: "Correct. Virtual threads cost a few hundred bytes and unmount when they block, so ordinary sequential code handles tens of thousands of concurrent operations. That is precisely what they were added for." },
              { text: "B — async is always better", why: "It works and it costs readability. Virtual threads give the same scale with straightforward code, which is why Java added them." },
              { text: "None — Java cannot do this", why: "It has been the intended pattern since Java 21." },
            ],
            answer: 1,
          },
          example: `// Java 21+: write blocking code, run it on virtual threads
try (var pool = Executors.newVirtualThreadPerTaskExecutor()) {
  for (var url : urls) {
    pool.submit(() -> {
      var body = httpClient.send(req(url), ofString()).body();  // blocks
      store(body);                                              // fine
    });
  }
}

// blocking a virtual thread unmounts it — the carrier goes elsewhere

// CompletableFuture is still right for COMPOSING independent work
CompletableFuture<String> a = supplyAsync(() -> fetch(url1));
CompletableFuture<String> b = supplyAsync(() -> fetch(url2));

CompletableFuture<String> both = a.thenCombine(b, String::concat);

// chaining dependent steps
supplyAsync(() -> fetch(url))
  .thenApply(this::parse)
  .thenCompose(x -> supplyAsync(() -> enrich(x)))
  .exceptionally(e -> fallback());

// waiting for several
CompletableFuture.allOf(a, b).join();

// structured concurrency (preview): scoped, and cancels together
// try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
//   var f1 = scope.fork(() -> fetch(url1));
//   var f2 = scope.fork(() -> fetch(url2));
//   scope.join().throwIfFailed();
// }

// synchronized PINS a virtual thread — prefer ReentrantLock`,
          notes: [
            { token: "virtual threads", meaning: "blocking code, at async scale" },
            { token: "unmounts when blocked", meaning: "the carrier thread goes elsewhere" },
            { token: "CompletableFuture", meaning: "still right for composing independent work" },
            { token: "synchronized pins", meaning: "use ReentrantLock on virtual threads" },
          ],
          prompt:
            "Run two independent fetches at once and combine their results.",
          starter: `var a = supplyAsync(() -> fetch(url1));
var b = supplyAsync(() -> fetch(url2));

var both = a.(b, String::concat);`,
          rules: {
            regex: ["a\\.thenCombine\\s*\\(\\s*b\\s*,\\s*String::concat\\s*\\)"],
            hint: "a.thenCombine(b, String::concat)",
            success:
              "Correct. thenCombine is for two INDEPENDENT futures; thenCompose is the one for a step that depends on the previous result, and mixing them up is a common slip.",
          },
          solution: `var a = supplyAsync(() -> fetch(url1));
var b = supplyAsync(() -> fetch(url2));

var both = a.thenCombine(b, String::concat);`,
        },

        javascript: {
          body: [
            "You have no choice — there is one thread, and async is how it holds thousands of connections. This is the language async was built into rather than added to.",
            "A PROMISE is a value that is not ready yet. It is pending, then either fulfilled with a value or rejected with an error, and it never changes again.",
            "`async` on a function means it returns a promise. `await` unwraps one, suspending the function until it settles — and letting everything else run meanwhile.",
            "Before promises this was callbacks, nested one inside the next, and the phrase 'callback hell' described what three levels of it looked like. `async`/`await` made asynchronous code read top to bottom again.",
            "The mistake that costs the most is awaiting in a loop. `for (const u of urls) await fetch(u)` is strictly sequential — ten one-second requests take ten seconds.",
            "`Promise.all(urls.map(u => fetch(u)))` starts them all immediately and waits for the last. Same code, one tenth the time.",
            "Know the four combinators: `all` rejects at the first failure, `allSettled` waits for everything and reports each outcome, `race` gives the first to settle, `any` gives the first to SUCCEED.",
            "And every promise needs somewhere for its rejection to go. An un-awaited async call whose promise nobody handles becomes an unhandled rejection, which recent Node versions treat as fatal.",
          ],
          predict: {
            ask: "How long does each take with 10 urls at 1 second?",
            code: `// A
for (const u of urls) await fetch(u);

// B
await Promise.all(urls.map(u => fetch(u)));`,
            choices: [
              { text: "Both about 1 second", why: "await inside the loop suspends until that fetch finishes before the next one starts." },
              { text: "A about 10 seconds, B about 1", why: "Correct. Awaiting in a loop is sequential. The map in B starts every fetch immediately — they are all in flight before Promise.all is even called — so the total is roughly the slowest one." },
              { text: "Both about 10 seconds", why: "Promise.all is exactly the mechanism for overlapping them." },
              { text: "A is faster — fewer promises are created", why: "Creating a promise is negligible against nine seconds of avoidable waiting." },
            ],
            answer: 1,
          },
          example: `// async means "returns a promise". await unwraps one
async function load(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.json();
}

// sequential — 10 seconds for 10 urls
for (const u of urls) await load(u);

// concurrent — about 1 second
const all = await Promise.all(urls.map(u => load(u)));

// the four combinators, and they differ
await Promise.all(ps);         // rejects at the FIRST failure
await Promise.allSettled(ps);  // waits for all, reports each
await Promise.race(ps);        // the first to settle, either way
await Promise.any(ps);         // the first to SUCCEED

// error handling: await turns a rejection into a throw
try {
  const data = await load(url);
} catch (e) {
  console.error(e);
}

// every promise needs somewhere for a rejection to go
load(url);                     // unhandled rejection — fatal in Node
load(url).catch(console.error);

// for await, over an async iterator
for await (const chunk of stream) process(chunk);

// a timeout, without a library
const ctl = new AbortController();
setTimeout(() => ctl.abort(), 5000);
await fetch(url, { signal: ctl.signal });`,
          notes: [
            { token: "a promise", meaning: "pending, then fulfilled or rejected. Once, forever" },
            { token: "await in a loop", meaning: "sequential. The most costly common mistake" },
            { token: "all / allSettled / race / any", meaning: "first failure, everything, first settled, first success" },
            { token: "unhandled rejection", meaning: "fatal in recent Node. Always catch or await" },
          ],
          prompt:
            "Wait for every task and report each failure, rather than stopping at the first one.",
          starter: `const results = await Promise.(tasks);`,
          rules: {
            regex: ["Promise\\.allSettled\\s*\\(\\s*tasks\\s*\\)"],
            mustNot: ["Promise.all(tasks)"],
            hint: "Promise.allSettled(tasks)",
            success:
              "Correct, and note what comes back: every entry is { status: \"fulfilled\", value } or { status: \"rejected\", reason }, never a bare value — so the shape tells you which happened.",
          },
          solution: `const results = await Promise.allSettled(tasks);`,
        },

        rust: {
          body: [
            "No. Rust's async is designed for exactly this, and it is the most explicit of the six about what is going on.",
            "`async fn` returns a FUTURE, and a future does nothing at all until it is polled. Calling an async function and dropping the result runs none of it — the compiler warns that futures are lazy.",
            "That laziness is the design choice. A future is a state machine the compiler generates, with no allocation and no runtime cost until something drives it.",
            "Which means Rust needs a RUNTIME to do the driving, and the standard library does not ship one. `tokio` is the overwhelming default; `async-std` and `smol` exist.",
            "So `#[tokio::main]` above main is what most async Rust starts with, and it is a macro that sets up the loop and blocks on your future.",
            "`.await` suspends the current future and lets the runtime run others. It is only legal inside an async function or block.",
            "For concurrency, `tokio::join!` runs several futures on the same task, and `tokio::spawn` gives each its own task that the runtime can move between threads. `select!` takes whichever finishes first.",
            "The trap is the same as Python's: never block inside async. `std::thread::sleep` or a synchronous file read stalls the whole worker thread. Use `tokio::time::sleep`, the async file APIs, or `spawn_blocking` for genuinely blocking work.",
          ],
          predict: {
            ask: "What does this do?",
            code: `async fn work() -> i32 { 42 }

fn main() {
    work();
}`,
            choices: [
              { text: "Runs work and discards the 42", why: "A future does nothing until it is polled, and nothing here polls it." },
              { text: "Nothing at all — it creates a future and drops it, with a warning", why: "Correct. Calling an async fn builds a future and runs none of its body. The compiler warns that futures do nothing unless awaited or polled. It needs a runtime and an .await." },
              { text: "It will not compile", why: "It compiles with a warning. The value is simply unused." },
              { text: "It blocks until work finishes", why: "There is no blocking and no runtime — the future is created and immediately dropped." },
            ],
            answer: 1,
          },
          example: `use tokio::time::{sleep, Duration};

// async fn returns a FUTURE. It does nothing until polled
async fn fetch(url: &str) -> String {
    sleep(Duration::from_secs(1)).await;   // NOT thread::sleep
    url.to_string()
}

// calling it runs nothing
let fut = fetch("a");        // a future, inert
let s = fut.await;           // now it runs

// the runtime is a LIBRARY, not the standard library
#[tokio::main]
async fn main() {
    // sequential
    for u in &urls { fetch(u).await; }

    // concurrent, on one task
    let (a, b) = tokio::join!(fetch("a"), fetch("b"));

    // concurrent, on separate tasks the runtime can move
    let h = tokio::spawn(async { fetch("c").await });
    let c = h.await.unwrap();

    // whichever finishes first
    tokio::select! {
        a = fetch("a") => println!("{}", a),
        _ = sleep(Duration::from_secs(1)) => println!("timed out"),
    }
}

// NEVER block inside async — it stalls the whole worker thread
//   std::thread::sleep     use tokio::time::sleep
//   std::fs::read          use tokio::fs::read
let n = tokio::task::spawn_blocking(|| heavy_cpu_work()).await.unwrap();

// async fn in a trait works from Rust 1.75`,
          notes: [
            { token: "async fn", meaning: "returns a future. Lazy — nothing runs until polled" },
            { token: "the runtime", meaning: "a library. tokio, overwhelmingly" },
            { token: "join! / spawn / select!", meaning: "together, separately, or first to finish" },
            { token: "spawn_blocking", meaning: "for genuinely blocking work, off the async threads" },
          ],
          prompt:
            "Run two fetches concurrently on the same task and collect both results.",
          starter: `let (a, b) = tokio::!(fetch("a"), fetch("b"));`,
          rules: {
            regex: ["tokio::join!\\s*\\(\\s*fetch\\s*\\(\\s*\"a\"\\s*\\)\\s*,\\s*fetch\\s*\\(\\s*\"b\"\\s*\\)\\s*\\)"],
            hint: "tokio::join!(fetch(\"a\"), fetch(\"b\"))",
            success:
              "Correct. join! runs both on the CURRENT task, so no spawning happens and neither future needs to be Send — which is exactly why it is the lighter choice when you simply want two things to overlap.",
          },
          solution: `let (a, b) = tokio::join!(fetch("a"), fetch("b"));`,
        },
      },
    },
  ],
};
