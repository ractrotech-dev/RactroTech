import type { TopicLesson } from "@/lib/dsa/lessons/types";
import { traceDependency, traceFileFlow, traceModuleResolve } from "@/lib/dsa/viz/traceLang";

// Language track, topic 10 — the last of the core track.
//
// Three things that are really one topic: getting data in from outside, and
// getting code in from elsewhere in your project or from the wider world.
// The mechanisms differ more here than anywhere except memory.

export const LANG_MODULES: TopicLesson = {
  id: "lang-modules",
  title: "Files & Modules",
  tagline: "Splitting a program up, and reading from disk.",
  why:
    "Every program eventually needs two things it cannot get from its own source: data from outside, and code somebody else wrote. This is the topic that turns a single file you can run into a project other people can work on.",
  plain: [
    "A file on disk is a stream of bytes. You open it, read or write, and close it.",
    "Read a small file all at once; read a large one a line at a time.",
    "A module is one file's worth of code that other files can use, showing only what it chooses to.",
    "A package manager fetches other people's modules, and a lock file records exactly which versions you got.",
  ],
  needs: ["Cleanup from Error Handling.", "Strings, since most file work is text."],
  traps: [
    "Reading a whole file into memory when you do not know how big it is.",
    "Forgetting to close. Written data can sit in a buffer and never reach the disk.",
    "Building file paths by joining strings. Use the path tools — separators differ between systems.",
    "Top-level code in a module runs at import time, before your program's own start.",
    "Two modules importing each other. One will be half-built when the other looks at it.",
    "Not committing the lock file, so every machine installs slightly different code.",
  ],
  sections: [
    /* ---------------------------------------------------------- files -- */
    {
      id: "files",
      kicker: "01",
      title: "Getting data in and out",
      hook:
        "Your program reads a log file and works perfectly. Then someone runs it on a 10 GB log and the machine runs out of memory. What did the code do wrong?",
      body: [
        "It read the whole thing at once. That is exactly right for a small configuration file and exactly wrong for a log — because the memory needed grows as fast as the file does.",
        "Reading a LINE at a time keeps one line in memory. The next line replaces it, nothing accumulates, and the memory use is flat however big the file gets.",
        "So the rule is: small and known, read it whole; large or unknown, stream it.",
        "In C++ you open a file by creating a stream object. `ifstream` reads, `ofstream` writes, `fstream` does both — and because they are RAII objects, they close themselves when they go out of scope.",
        "Always CHECK that the open worked. `if (!f)` catches a missing file or a permission problem, and an ifstream that failed to open silently produces nothing rather than complaining.",
        "`getline(f, line)` reads one line and returns something usable as a condition, which is why `while (getline(f, line))` is the standard reading loop. `f >> word` reads one whitespace-separated token instead.",
        "For anything involving paths, use `std::filesystem` rather than joining strings. It knows about separators, it can ask whether a file exists, and it handles the differences between systems.",
      ],
      predict: {
        ask: "What does this C++ loop do wrong?",
        code: `ifstream f("data.txt");
string line;

while (!f.eof()) {
  getline(f, line);
  cout << line << "\\n";
}`,
        choices: [
          { text: "Nothing — that is the standard way to read a file", why: "eof() only becomes true AFTER a read has already failed, so the loop processes one line too many." },
          { text: "It prints the last line twice, or an empty line at the end", why: "Correct. eof() is only set once a read has already hit the end, so the final getline fails and the loop body still runs with the previous or empty contents. Use `while (getline(f, line))` instead." },
          { text: "getline needs a third argument", why: "The two-argument form reads up to the newline, which is what is wanted here." },
          { text: "The file is never closed", why: "The ifstream closes itself when it goes out of scope — that is RAII doing its job." },
        ],
        answer: 1,
      },
      viz: traceFileFlow(),
      example: `#include <fstream>
#include <filesystem>

// reading a line at a time — the standard loop
ifstream f("data.txt");
if (!f) throw runtime_error("cannot open data.txt");

string line;
while (getline(f, line)) {         // NOT while (!f.eof())
  cout << line << "\\n";
}
// f closes itself here

// a whole small file at once
ifstream in("config.txt");
string all((istreambuf_iterator<char>(in)), istreambuf_iterator<char>());

// writing
ofstream out("out.txt");           // truncates. ios::app to add
out << "hello\\n";
// flushed and closed when out goes out of scope

// paths — never join strings by hand
namespace fs = std::filesystem;
fs::path p = fs::path("data") / "logs" / "app.log";
if (fs::exists(p)) cout << fs::file_size(p);
for (auto& e : fs::directory_iterator("data")) cout << e.path();

// binary, when it is not text
ifstream bin("img.png", ios::binary);`,
      notes: [
        { token: "while (getline(f, line))", meaning: "the correct loop. Never while (!f.eof())" },
        { token: "if (!f)", meaning: "check the open. A failed stream is silent" },
        { token: "ifstream closes itself", meaning: "RAII. No close call needed" },
        { token: "filesystem::path", meaning: "join with /, not string concatenation" },
      ],
      challenge: {
        prompt:
          "Read the file line by line using the correct loop condition, and check that the open succeeded.",
        starter: `ifstream f("data.txt");
if () throw runtime_error("cannot open");

string line;
while () {
  cout << line << "\\n";
}`,
        rules: {
          regex: ["if\\s*\\(\\s*!\\s*f\\s*\\)", "while\\s*\\(\\s*getline\\s*\\(\\s*f\\s*,\\s*line\\s*\\)\\s*\\)"],
          mustNot: ["f.eof()"],
          hint: "if (!f) to check the open, and while (getline(f, line)) as the loop.",
          success:
            "Correct. getline returns the stream, which converts to false when the read fails — so the condition tests the read you are about to use, rather than the one you already did.",
        },
        solution: `ifstream f("data.txt");
if (!f) throw runtime_error("cannot open");

string line;
while (getline(f, line)) {
  cout << line << "\\n";
}`,
      },

      alt: {
        c: {
          body: [
            "It read the whole thing at once. That is right for a small configuration file and wrong for a log — the memory needed grows as fast as the file does.",
            "Reading a LINE at a time keeps one line in memory, so the memory use is flat however big the file gets.",
            "In C you get a `FILE *` from `fopen` and hand it back with `fclose`. There is no automatic closing, so every path out of the function must close it — the goto-cleanup pattern from Error Handling applies here directly.",
            "`fopen` returns NULL when it fails, and checking that is not optional. Passing a null FILE pointer to any of the read functions is undefined behaviour.",
            "For reading lines, use `fgets(buf, sizeof buf, f)`. It is bounded by the buffer size, so it cannot overflow — unlike `gets`, which cannot be used safely at all and was removed from the language.",
            "One thing `fgets` does that surprises people: it KEEPS the newline in the buffer. Strip it, or every comparison you make against the line will fail for a reason that is invisible when you print it.",
            "`fread` and `fwrite` handle raw bytes for binary files, and they return how many items they actually handled — which you must check, because a short read is not an error.",
            "Writing is buffered. Data can sit in memory until you `fclose` or `fflush`, which is why a file can look empty while your program is still running.",
          ],
          predict: {
            ask: "Why does this comparison fail even when the file contains exactly \"quit\"?",
            code: `char buf[100];
fgets(buf, sizeof buf, f);

if (strcmp(buf, "quit") == 0) {
  printf("matched");
}`,
            choices: [
              { text: "strcmp cannot compare a buffer to a literal", why: "That comparison is exactly what strcmp is for. The problem is what fgets left in the buffer." },
              { text: "fgets keeps the newline, so buf is \"quit\\n\"", why: "Correct. fgets stores the line terminator too, so the buffer holds five characters rather than four and never matches. Strip it with buf[strcspn(buf, \"\\n\")] = 0;" },
              { text: "buf is not null-terminated", why: "fgets always null-terminates within the size it was given. The extra newline sits before that terminator." },
              { text: "sizeof buf is wrong", why: "sizeof on a local array gives its real byte count, which is exactly what fgets wants." },
            ],
            answer: 1,
          },
          example: `#include <stdio.h>
#include <string.h>

/* reading a line at a time */
FILE *f = fopen("data.txt", "r");
if (!f) { perror("data.txt"); return -1; }

char buf[256];
while (fgets(buf, sizeof buf, f)) {
  buf[strcspn(buf, "\\n")] = 0;     /* fgets KEEPS the newline */
  printf("%s\\n", buf);
}
fclose(f);                         /* nothing does this for you */

/* writing. "w" truncates, "a" appends */
FILE *out = fopen("out.txt", "w");
if (!out) return -1;
fprintf(out, "hello %d\\n", 42);
fclose(out);                       /* also flushes the buffer */

/* binary — and always check the count returned */
FILE *bin = fopen("img.png", "rb");
unsigned char block[1024];
size_t n = fread(block, 1, sizeof block, bin);
if (n < sizeof block && ferror(bin)) { /* a real error */ }

/* never use gets. It cannot be used safely and was removed */

/* the modes */
/* "r"  read     "w"  truncate/create   "a"  append  */
/* add "b" for binary: "rb", "wb"                    */`,
          notes: [
            { token: "fopen returns NULL", meaning: "on failure. Check it every time" },
            { token: "fgets(buf, sizeof buf, f)", meaning: "bounded, and keeps the newline" },
            { token: "strcspn(buf, \"\\n\")", meaning: "the usual way to strip that newline" },
            { token: "fclose", meaning: "closes AND flushes. Nothing does it for you" },
          ],
          prompt:
            "Read lines safely and strip the newline that fgets leaves behind.",
          starter: `char buf[256];
while (fgets(buf, , f)) {
  buf[] = 0;
  printf("%s\\n", buf);
}`,
          rules: {
            regex: ["fgets\\s*\\(\\s*buf\\s*,\\s*sizeof\\s+buf\\s*,\\s*f\\s*\\)", "strcspn\\s*\\(\\s*buf\\s*,\\s*\"\\\\n\"\\s*\\)"],
            hint: "fgets(buf, sizeof buf, f) for the bound, and buf[strcspn(buf, \"\\n\")] = 0; to strip.",
            success:
              "Correct. strcspn returns the index of the first newline, or the length if there is none — so the assignment works whether or not the last line ended with one.",
          },
          solution: `char buf[256];
while (fgets(buf, sizeof buf, f)) {
  buf[strcspn(buf, "\\n")] = 0;
  printf("%s\\n", buf);
}`,
        },

        python: {
          body: [
            "It read the whole thing at once. `f.read()` on a 10 GB file needs 10 GB of memory.",
            "Iterating the file object instead — `for line in f:` — reads a line at a time, so the memory use is flat however big the file gets. It is also the shortest thing to write, which is unusual for the efficient option.",
            "Always use `with`. `with open(path) as f:` closes the file when the block ends, however it ended. Without it, the file stays open until the object happens to be collected, and on PyPy or Jython that could be much later.",
            "`open` takes an ENCODING and you should always pass one. Without it Python uses the system default, which differs between machines — so a file that reads fine on your laptop fails in the container. `encoding=\"utf-8\"` is almost always what you want.",
            "The modes are short: `r` read, `w` truncate and write, `a` append, and add `b` for binary. Text mode also translates line endings; binary mode does not touch the bytes.",
            "For paths, `pathlib` is the modern answer and it is genuinely nicer: `Path(\"data\") / \"logs\" / \"app.log\"` joins correctly on every system, and `p.read_text()`, `p.exists()` and `p.glob(\"*.log\")` cover most of what you need.",
            "For structured data, the standard library already has it: `json` for JSON, `csv` for CSV. Do not parse either by splitting on commas — quoted fields containing commas will find you eventually.",
          ],
          predict: {
            ask: "Which of these can handle a 10 GB file?",
            code: `# A
with open(path) as f:
    for line in f.readlines():
        handle(line)

# B
with open(path) as f:
    for line in f:
        handle(line)`,
            choices: [
              { text: "Both — they do the same thing", why: "readlines() builds a list of every line first, which needs the whole file in memory." },
              { text: "Only B", why: "Correct. readlines() reads everything and returns a list, so A needs 10 GB. Iterating the file object directly reads one line at a time and keeps the memory flat." },
              { text: "Only A, because readlines is optimised", why: "readlines is the eager version — it exists for when you genuinely want the whole list." },
              { text: "Neither — you need a chunked read", why: "Iterating the file object is already streaming. It is exactly the right tool here." },
            ],
            answer: 1,
          },
          example: `from pathlib import Path

# a line at a time. Flat memory, and the shortest to write
with open(path, encoding="utf-8") as f:
    for line in f:
        print(line.rstrip("\\n"))

# a whole small file
text = Path(path).read_text(encoding="utf-8")

# writing
with open("out.txt", "w", encoding="utf-8") as f:
    f.write("hello\\n")
    f.writelines(lines)

# always pass encoding. The default differs between machines

# paths — pathlib, not string joining
p = Path("data") / "logs" / "app.log"
print(p.exists(), p.stat().st_size, p.suffix, p.stem)
for log in Path("data").glob("**/*.log"):
    print(log)

p.write_text("hi", encoding="utf-8")
Path("out").mkdir(parents=True, exist_ok=True)

# structured data — use the library, never split on commas
import json, csv
data = json.loads(Path("x.json").read_text())
with open("x.csv", newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        print(row["name"])`,
          notes: [
            { token: "for line in f", meaning: "streams. readlines() loads everything" },
            { token: "with open(...)", meaning: "closes however the block ends" },
            { token: "encoding=\"utf-8\"", meaning: "always pass it. The default varies by machine" },
            { token: "Path(a) / b", meaning: "joins correctly everywhere. Never join strings" },
          ],
          prompt:
            "Read the file line by line with an explicit encoding, closing it however the block ends.",
          starter: ` open(path, ) as f:
    for line in f:
        print(line.rstrip())`,
          rules: {
            regex: ["with\\s+open\\s*\\(\\s*path\\s*,\\s*encoding\\s*=\\s*[\"']utf-8[\"']\\s*\\)\\s+as\\s+f\\s*:"],
            hint: "with open(path, encoding=\"utf-8\") as f:",
            success:
              "Correct. The encoding is worth the habit: without it the same code reads a UTF-8 file fine on Linux and raises UnicodeDecodeError on a Windows machine using a legacy default.",
          },
          solution: `with open(path, encoding="utf-8") as f:
    for line in f:
        print(line.rstrip())`,
        },

        java: {
          body: [
            "It read the whole thing at once. `Files.readString(path)` on a 10 GB file needs 10 GB of memory.",
            "`Files.lines(path)` gives you a Stream of lines instead, read lazily — so the memory use stays flat however big the file is.",
            "One catch: that stream holds the file open, so it must be closed. Put it in a try-with-resources, which is easy to forget precisely because streams do not usually need it.",
            "Java has two generations of file API and it is worth knowing which is which. The old `java.io.File` is clumsy and still everywhere. The modern `java.nio.file` — `Path`, `Files` — is what to use in new code.",
            "`Files` has the convenient whole-file methods: `readString`, `readAllLines`, `writeString`, `write`. All are fine for small files and wrong for large ones.",
            "For anything streaming, wrap the reader: `Files.newBufferedReader(path)`. Unbuffered reading a character at a time is dramatically slower, and it is the sort of thing that only shows up in production.",
            "Since Java 18 the default charset is UTF-8 everywhere, which removed a long-standing source of machine-dependent bugs. On older versions, pass `StandardCharsets.UTF_8` explicitly.",
            "And build paths with `Path.of(\"data\", \"logs\", \"app.log\")` rather than joining strings — it uses the right separator for the platform.",
          ],
          predict: {
            ask: "What is missing here?",
            code: `Stream<String> lines = Files.lines(Path.of("big.log"));
lines.forEach(System.out::println);`,
            choices: [
              { text: "Nothing — streams close themselves", why: "Most streams need no closing, and this one is backed by an open file handle that nothing releases." },
              { text: "The stream holds the file open and is never closed", why: "Correct. Files.lines is one of the few streams that must be closed, because it wraps a file handle. Put it in a try-with-resources — Stream implements AutoCloseable for exactly this case." },
              { text: "forEach cannot be used on a file stream", why: "forEach works fine here. The problem is the handle left open afterwards." },
              { text: "It should be readAllLines", why: "readAllLines would load the whole file into memory, which is the opposite of what you want for a big log." },
            ],
            answer: 1,
          },
          example: `import java.nio.file.*;
import java.nio.charset.StandardCharsets;

// streaming — and this stream MUST be closed
try (Stream<String> lines = Files.lines(Path.of("big.log"))) {
  lines.filter(l -> l.contains("ERROR")).forEach(System.out::println);
}

// or a buffered reader
try (var r = Files.newBufferedReader(Path.of("data.txt"))) {
  String line;
  while ((line = r.readLine()) != null) System.out.println(line);
}

// a whole small file
String text = Files.readString(Path.of("config.txt"));
List<String> all = Files.readAllLines(Path.of("config.txt"));

// writing
Files.writeString(Path.of("out.txt"), "hello\\n");
Files.write(Path.of("out.txt"), lines);
Files.writeString(p, "more\\n", StandardOpenOption.APPEND);

// paths — never join strings
Path p = Path.of("data", "logs", "app.log");
System.out.println(Files.exists(p) + " " + Files.size(p));
try (var walk = Files.walk(Path.of("data"))) {
  walk.filter(x -> x.toString().endsWith(".log")).forEach(System.out::println);
}

// java.io.File is the OLD api. Prefer java.nio.file in new code`,
          notes: [
            { token: "Files.lines", meaning: "lazy, and must be closed. Use try-with-resources" },
            { token: "Files.readString", meaning: "the whole file. Small files only" },
            { token: "newBufferedReader", meaning: "buffered. Unbuffered reading is far slower" },
            { token: "Path.of(a, b, c)", meaning: "the right separator for the platform" },
          ],
          prompt:
            "Stream the lines of a large file and make sure the file handle is released.",
          starter: ` (Stream<String> lines = Files.lines(Path.of("big.log"))) {
  lines.forEach(System.out::println);
}`,
          rules: {
            regex: ["try\\s*\\(\\s*Stream\\s*<\\s*String\\s*>\\s*lines\\s*=\\s*Files\\.lines\\s*\\("],
            hint: "try (Stream<String> lines = Files.lines(...)) { ... }",
            success:
              "Correct. Files.lines is one of the very few streams that needs closing — a stream over a list does not, which is exactly why this one is so easy to miss.",
          },
          solution: `try (Stream<String> lines = Files.lines(Path.of("big.log"))) {
  lines.forEach(System.out::println);
}`,
        },

        javascript: {
          body: [
            "It read the whole thing at once. `readFile` on a 10 GB file tries to build a 10 GB buffer, and Node has a hard limit well below that.",
            "The first thing to know is that this section is about NODE, not the browser. A page in a browser cannot read arbitrary files at all — it gets access only to what a user picks with a file input or drops onto the page.",
            "In Node, `fs/promises` is the modern API: `await readFile(path, \"utf-8\")` for a whole small file, `await writeFile(...)` to write.",
            "Pass the encoding. Without it you get a `Buffer` of raw bytes rather than a string, which is occasionally what you want and usually a surprise.",
            "For large files, use a STREAM. `createReadStream(path)` reads in chunks, and `readline.createInterface` turns those chunks into lines — so the memory stays flat.",
            "Node 18 and later has a shorter version: a file handle is async-iterable by line via `readline`, and you can write `for await (const line of rl)`.",
            "Use `path.join(...)` rather than joining strings — it handles separators and normalises the result. And prefer the promise API over the old callback one, and over the `Sync` versions, which block the entire event loop.",
          ],
          predict: {
            ask: "What does readFile return here?",
            code: `import { readFile } from "node:fs/promises";

const data = await readFile("config.txt");
console.log(typeof data);`,
            choices: [
              { text: "\"string\"", why: "Without an encoding, readFile hands back raw bytes rather than decoded text." },
              { text: "\"object\" — it is a Buffer", why: "Correct. With no encoding you get a Buffer of raw bytes, and typeof a Buffer is \"object\". Pass \"utf-8\" as the second argument to get a string." },
              { text: "\"undefined\"", why: "The read succeeds and returns something — a Buffer rather than nothing." },
              { text: "It throws without an encoding", why: "Returning a Buffer is the documented behaviour, not an error. It is a deliberate default for binary files." },
            ],
            answer: 1,
          },
          example: `import { readFile, writeFile, appendFile } from "node:fs/promises";
import { createReadStream } from "node:fs";
import readline from "node:readline";
import path from "node:path";

// a whole small file — pass the encoding, or you get a Buffer
const text = await readFile("config.txt", "utf-8");

// writing
await writeFile("out.txt", "hello\\n");
await appendFile("out.txt", "more\\n");

// large files: stream it, a line at a time
const rl = readline.createInterface({
  input: createReadStream("big.log"),
  crlfDelay: Infinity,
});
for await (const line of rl) {
  if (line.includes("ERROR")) console.log(line);
}

// paths — join, do not concatenate
const p = path.join("data", "logs", "app.log");
console.log(path.extname(p), path.basename(p), path.dirname(p));

// JSON
const config = JSON.parse(await readFile("config.json", "utf-8"));

// avoid the Sync versions — they block the whole event loop
// readFileSync is fine at startup, and nowhere else

// in the BROWSER there is no file system access.
// Only what a user picks: input.files[0].text()`,
          notes: [
            { token: "readFile(p, \"utf-8\")", meaning: "pass the encoding, or you get a Buffer" },
            { token: "createReadStream + readline", meaning: "line at a time. Flat memory" },
            { token: "path.join(...)", meaning: "correct separators. Never concatenate" },
            { token: "the Sync versions", meaning: "block the event loop. Startup only" },
          ],
          prompt:
            "Read a config file as text rather than as raw bytes.",
          starter: `const text = await readFile("config.txt", );`,
          rules: {
            regex: ["readFile\\s*\\(\\s*\"config\\.txt\"\\s*,\\s*[\"']utf-8[\"']\\s*\\)"],
            hint: "readFile(\"config.txt\", \"utf-8\")",
            success:
              "Correct. The Buffer default is not an oversight — it is right for images and archives, where decoding as text would corrupt the data.",
          },
          solution: `const text = await readFile("config.txt", "utf-8");`,
        },

        rust: {
          body: [
            "It read the whole thing at once. `fs::read_to_string` on a 10 GB file needs 10 GB of memory.",
            "`BufReader::new(file).lines()` gives you an iterator instead, reading a line at a time — so the memory use stays flat.",
            "The BufReader part is not optional. A bare `File` reads straight from the operating system on every call, which for line-by-line work is dramatically slower. Wrapping it in a BufReader is the standard first move.",
            "Every file operation returns a `Result`, so the failure is in the type and you cannot skip it. In a function returning Result the `?` operator makes this almost invisible.",
            "`lines()` yields `Result<String>` per line, because a line can fail to decode — Rust is honest about the fact that not every byte sequence is valid UTF-8. You handle it, or use `.flatten()` to skip the bad ones.",
            "Files close themselves. `File` implements `Drop`, so it is released when it goes out of scope, including on an early return from `?`. There is no close to forget.",
            "For paths, `PathBuf` and `Path` are the owned and borrowed pair, following the same shape as `String` and `&str`. Build them with `.join()` and never with string concatenation.",
            "One thing worth knowing: writing is buffered, and a `BufWriter` flushes on drop but SWALLOWS any error while doing so. If the write failing matters, call `flush()` yourself and check the result.",
          ],
          predict: {
            ask: "Why wrap the File in a BufReader here?",
            code: `let f = File::open("big.log")?;
let reader = BufReader::new(f);

for line in reader.lines() {
    println!("{}", line?);
}`,
            choices: [
              { text: "Because File has no lines() method without it", why: "That is true and it is the consequence rather than the reason — lines() lives on BufRead because reading lines efficiently requires buffering." },
              { text: "Without buffering, every read goes to the operating system separately", why: "Correct. A bare File makes a system call per read, which for line-by-line work is enormously slower. BufReader fetches a block at a time and hands out lines from it — and that is why lines() is defined on BufRead." },
              { text: "To make the file close automatically", why: "File closes itself through Drop whether or not it is wrapped. The buffering is the point." },
              { text: "To convert bytes to UTF-8", why: "lines() does handle the decoding, and that is not what BufReader is for — it is about how often the operating system is asked for data." },
            ],
            answer: 1,
          },
          example: `use std::fs::{self, File};
use std::io::{self, BufRead, BufReader, BufWriter, Write};
use std::path::{Path, PathBuf};

// a line at a time — and BufReader is not optional
fn read_lines(path: &str) -> io::Result<()> {
    let f = File::open(path)?;              // Result. ? passes it up
    let reader = BufReader::new(f);         // buffered, or it crawls

    for line in reader.lines() {
        let line = line?;                   // a line can fail to decode
        println!("{}", line);
    }
    Ok(())                                  // f closes here, via Drop
}

// a whole small file
let text = fs::read_to_string("config.txt")?;
let bytes = fs::read("img.png")?;

// writing
fs::write("out.txt", "hello\\n")?;

let mut w = BufWriter::new(File::create("out.txt")?);
writeln!(w, "hello")?;
w.flush()?;      // do this. Drop flushes but SWALLOWS the error

// paths — PathBuf owns, &Path borrows. Like String and &str
let p: PathBuf = Path::new("data").join("logs").join("app.log");
println!("{}", p.exists());
for entry in fs::read_dir("data")? {
    println!("{:?}", entry?.path());
}`,
          notes: [
            { token: "BufReader::new(f)", meaning: "not optional. A bare File is far slower" },
            { token: "lines() yields Result", meaning: "a line can fail to decode. Rust says so" },
            { token: "Drop closes the file", meaning: "on every path, including an early ?" },
            { token: "w.flush()?", meaning: "Drop flushes but swallows the error. Do it yourself" },
          ],
          prompt:
            "Read the file a line at a time, buffered, passing any error up to the caller.",
          starter: `let f = File::open(path);
let reader = (f);

for line in reader.lines() {
    println!("{}", line);
}`,
          rules: {
            regex: ["File::open\\s*\\(\\s*path\\s*\\)\\?", "BufReader::new\\s*\\(\\s*f\\s*\\)", "line\\?"],
            hint: "File::open(path)? for the open, BufReader::new(f) for the buffering, and line? inside the loop.",
            success:
              "Correct. Three question marks in five lines looks noisy at first and it is what makes the error handling complete — every one of those operations really can fail.",
          },
          solution: `let f = File::open(path)?;
let reader = BufReader::new(f);

for line in reader.lines() {
    println!("{}", line?);
}`,
        },
      },
    },

    /* -------------------------------------------------------- modules -- */
    {
      id: "modules",
      kicker: "02",
      title: "Splitting the program up",
      hook:
        "Your one file has reached three thousand lines. You split it into five. Now how does file one find the function in file two?",
      body: [
        "Something has to connect the name you wrote to the code that defines it — and C++ does this in a way no other language on this list does.",
        "C++ splits a module in two. A HEADER (.h) declares what exists; a SOURCE file (.cpp) defines it. `#include` then pastes the header's text into your file, literally, before compilation begins.",
        "That is worth sitting with: `#include` is a copy-paste performed by the preprocessor. Nothing is looked up, nothing is cached — the text is inserted.",
        "Which is why every header needs an INCLUDE GUARD. Without one, a header included twice defines everything twice and the compilation fails. `#pragma once` at the top is the practical answer, and the classic `#ifndef X / #define X / #endif` is the portable one.",
        "It is also why compilation is slow: a header included by fifty source files is parsed fifty times.",
        "NAMESPACES are the other half — they stop two libraries with a function called `init` from colliding. Put your code in one, and never write `using namespace std;` in a header, where it forces the choice onto everyone who includes it.",
        "C++20 added real MODULES — `export module maths;` and `import maths;` — which fix all of this. Tool support has been slow, so headers are still what you will meet in most codebases.",
      ],
      predict: {
        ask: "What happens without an include guard?",
        code: `// maths.h  (no guard)
struct Point { int x, y; };

// main.cpp
#include "maths.h"
#include "shapes.h"   // which also includes maths.h`,
        choices: [
          { text: "Nothing — the compiler skips the second include", why: "The preprocessor pastes the text every time it is asked. It has no memory of having done it before." },
          { text: "Point is defined twice, and the compilation fails", why: "Correct. #include is a literal text paste, so Point's definition appears twice in the same translation unit — a redefinition error. #pragma once at the top of maths.h prevents it." },
          { text: "The second definition silently replaces the first", why: "C++ does not allow a type to be defined twice in one translation unit, even identically. It is an error, not a replacement." },
          { text: "It works because the definitions are identical", why: "Being identical does not help — the one-definition rule is violated regardless." },
        ],
        answer: 1,
      },
      viz: traceModuleResolve(),
      example: `// ---- maths.h : WHAT exists ----
#pragma once                    // or the #ifndef/#define pair

namespace maths {
  int total(const std::vector<int>& v);   // declared, not defined

  inline int twice(int x) { return x * 2; }   // inline, if in a header
}

// ---- maths.cpp : HOW it works ----
#include "maths.h"

namespace maths {
  int total(const std::vector<int>& v) {
    int s = 0;
    for (int x : v) s += x;
    return s;
  }
}

// ---- main.cpp ----
#include "maths.h"      // your files: quotes, and looked for nearby
#include <vector>       // the standard library: angle brackets

int main() {
  std::cout << maths::total({1, 2, 3});
}

// never in a header — it forces the choice on every includer
// using namespace std;

// C++20 modules fix all of this. Tool support is still catching up
// export module maths;
// import maths;`,
      notes: [
        { token: "#include", meaning: "a literal text paste, done before compiling" },
        { token: "#pragma once", meaning: "the include guard. Without it, double definitions" },
        { token: "\"quotes\" vs <angles>", meaning: "your files, versus the system ones" },
        { token: "namespace", meaning: "stops two libraries colliding on the same name" },
      ],
      challenge: {
        prompt:
          "Write the header so it cannot be included twice, and put total inside the maths namespace.",
        starter: `

 maths {
  int total(const std::vector<int>& v);
}`,
        rules: {
          regex: ["#pragma\\s+once|#ifndef", "namespace\\s+maths\\s*\\{"],
          hint: "#pragma once at the top, and namespace maths { ... } around the declaration.",
          success:
            "Correct. #pragma once is not in the standard and every compiler you will meet supports it — the #ifndef/#define/#endif trio is the portable version, and it is easy to get the name wrong when copying a file.",
        },
        solution: `#pragma once

namespace maths {
  int total(const std::vector<int>& v);
}`,
      },

      alt: {
        c: {
          body: [
            "The same way C++ does, and C got there first: a header declares, a source file defines, and `#include` pastes the header in.",
            "`#include` is not an import. It is a literal copy-paste performed by the preprocessor before the compiler sees anything, which explains most of C's build behaviour.",
            "So every header needs an INCLUDE GUARD, or a header included twice defines everything twice. `#ifndef MATHS_H / #define MATHS_H / #endif` is the portable form; `#pragma once` works on every compiler you will meet.",
            "C has no namespaces. Every non-static function name is global across the entire program, which is why C libraries prefix everything: `sqlite3_open`, `curl_easy_init`, `png_read_info`. Adopt the same habit in your own code.",
            "`static` at file scope is C's privacy: a static function or variable is visible only inside that .c file. Anything not marked static is visible to the whole program, so make things static by default.",
            "The header should declare only what other files need. Everything else stays static in the .c file, and then you can change it freely.",
            "`extern` in a header declares a global that is DEFINED in exactly one .c file. Getting this wrong — defining a variable in a header — gives you one copy per source file that includes it, and a linker error at best.",
          ],
          predict: {
            ask: "What is wrong with putting this in a header?",
            code: `/* config.h */
int verbose = 0;`,
            choices: [
              { text: "Nothing — every file that includes it gets the setting", why: "Every file gets its own separate copy of the variable, which is not one shared setting." },
              { text: "Every including file gets its own definition, so the linker sees duplicates", why: "Correct. #include pastes the text, so each .c file defines its own `verbose`. Declare it as `extern int verbose;` in the header and define it once in a single .c file." },
              { text: "It should be const", why: "Making it const would change the meaning and not fix the duplicate definitions." },
              { text: "Headers cannot contain variables at all", why: "They can contain declarations of variables. It is the definition that must live in exactly one source file." },
            ],
            answer: 1,
          },
          example: `/* ---- maths.h : WHAT exists ---- */
#ifndef MATHS_H
#define MATHS_H

int maths_total(const int *a, int n);   /* prefix — C has no namespaces */

extern int maths_verbose;               /* DECLARED here... */

#endif

/* ---- maths.c : HOW it works ---- */
#include "maths.h"

int maths_verbose = 0;                  /* ...DEFINED once, here */

static int helper(int x) { return x; }  /* static = private to this file */

int maths_total(const int *a, int n) {
  int s = 0;
  for (int i = 0; i < n; i++) s += a[i];
  return s;
}

/* ---- main.c ---- */
#include "maths.h"      /* yours: quotes, looked for nearby */
#include <stdio.h>      /* system: angle brackets */

int main(void) {
  int nums[] = {1, 2, 3};
  printf("%d", maths_total(nums, 3));
}

/* build: compile each .c, then link them together
   gcc -c maths.c && gcc -c main.c && gcc maths.o main.o -o app */`,
          notes: [
            { token: "#ifndef guard", meaning: "or every double include defines things twice" },
            { token: "static at file scope", meaning: "private to this .c file. Use it by default" },
            { token: "extern in the header", meaning: "declared here, defined in exactly one .c" },
            { token: "name prefixes", meaning: "C has no namespaces. Every name is global" },
          ],
          prompt:
            "Guard the header and declare the global so exactly one source file defines it.",
          starter: `#ifndef MATHS_H


int maths_total(const int *a, int n);

 int maths_verbose;

#endif`,
          rules: {
            regex: ["#ifndef\\s+MATHS_H\\s*#define\\s+MATHS_H", "extern\\s+int\\s+maths_verbose"],
            hint: "#define MATHS_H on the line after the #ifndef, and extern int maths_verbose;",
            success:
              "Correct. The extern is the important half: without it every .c file including this header defines its own copy, and the linker reports a duplicate symbol.",
          },
          solution: `#ifndef MATHS_H
#define MATHS_H

int maths_total(const int *a, int n);

extern int maths_verbose;

#endif`,
        },

        python: {
          body: [
            "Python has the simplest answer of the six: a file IS a module. `maths.py` becomes the module `maths`, and `import maths` finds it.",
            "There is no header, no declaration and no build step. The import statement finds the file, RUNS it once, and gives you access to whatever it defined.",
            "Run once is the important part. Import the same module from ten places and its top level executes a single time — the result is cached in `sys.modules` and shared.",
            "That is why top-level side effects are risky: code that connects to a database or reads an environment variable runs at import time, before your program's own start.",
            "`if __name__ == \"__main__\":` is the guard for this. Code inside it runs when the file is executed directly and not when it is imported, which is how a file can be both a module and a script.",
            "A DIRECTORY with an `__init__.py` is a package, so `from myapp.models import User` follows the folder structure. The `__init__.py` can be empty, and since Python 3.3 it is technically optional.",
            "Prefer absolute imports — `from myapp.models import User` — over relative ones. Relative imports work and break in confusing ways when a file is run directly.",
            "There is no real privacy: a leading underscore on a name is a convention meaning 'internal', and `__all__` lists what `from x import *` should bring. Neither is enforced.",
          ],
          predict: {
            ask: "What does this print when maths.py is imported?",
            code: `# maths.py
print("loading")

def total(v):
    return sum(v)

if __name__ == "__main__":
    print("running directly")`,
            choices: [
              { text: "\"loading\" and \"running directly\"", why: "The __main__ guard is false when the file is imported rather than executed." },
              { text: "Only \"loading\"", why: "Correct. The top-level print runs at import time, every time the module is first loaded. The guarded block runs only when the file is executed directly as a script." },
              { text: "Nothing — importing does not run code", why: "Importing runs the whole file top to bottom. That is how the functions get defined in the first place." },
              { text: "\"loading\" once per import statement", why: "The module is cached after the first import, so the top level runs exactly once however many files import it." },
            ],
            answer: 1,
          },
          example: `# ---- maths.py : a file IS a module ----
def total(v):
    return sum(v)

def _helper(x):        # _ means internal, by convention only
    return x

__all__ = ["total"]    # what "from maths import *" brings

if __name__ == "__main__":
    print(total([1, 2, 3]))     # only when run directly

# ---- main.py ----
import maths
from maths import total
from maths import total as sum_all
import maths as m

print(maths.total([1, 2, 3]))

# a package is a DIRECTORY
# myapp/
#   __init__.py
#   models.py
#   views/
#     __init__.py
#     home.py

from myapp.models import User          # absolute — prefer this
from .models import User               # relative — breaks when run directly

# import runs the file ONCE and caches it
import sys
print("maths" in sys.modules)

# never use a wildcard import in real code — it hides where names came from
# from maths import *`,
          notes: [
            { token: "a file is a module", meaning: "no header, no build step, no declaration" },
            { token: "import runs it once", meaning: "and caches. Top-level side effects run then" },
            { token: "if __name__ == \"__main__\"", meaning: "runs only when executed directly" },
            { token: "_name and __all__", meaning: "conventions. Nothing is enforced" },
          ],
          prompt:
            "Add the guard so the demo runs when the file is executed directly but not when it is imported.",
          starter: `def total(v):
    return sum(v)

if  == :
    print(total([1, 2, 3]))`,
          rules: {
            regex: ["if\\s+__name__\\s*==\\s*[\"']__main__[\"']\\s*:"],
            hint: "if __name__ == \"__main__\":",
            success:
              "Correct. __name__ is the module's own name when imported and the literal string \"__main__\" when the file is the one being run — which is the whole trick.",
          },
          solution: `def total(v):
    return sum(v)

if __name__ == "__main__":
    print(total([1, 2, 3]))`,
        },

        java: {
          body: [
            "Java ties code to the FILE SYSTEM more tightly than any other language here, and once you accept that it is very predictable.",
            "A package is a directory. `package com.example.maths;` at the top of a file means that file lives in `com/example/maths/`, and the compiler enforces it.",
            "A public class must be in a file with the same name. `class Maths` that is public lives in `Maths.java`, always. There is no arguing with it.",
            "`import com.example.maths.Maths;` brings a name in. `import com.example.maths.*;` brings the whole package, and is generally discouraged because it hides where a name came from.",
            "The four visibility levels are worth getting straight. `public` is everywhere; `private` is this class; `protected` is this class and subclasses; and NO modifier means 'anything in the same package', which is the one people forget exists.",
            "That package-private default is genuinely useful: it lets classes that work together share things without exposing them to the whole world.",
            "Java 9 added the MODULE system on top — `module-info.java` declaring `exports` and `requires`. It is a real improvement for large systems and most everyday projects still work in terms of packages and a build tool.",
            "The reverse-domain convention — `com.example.myapp` — exists so that two organisations cannot pick the same package name. It is a convention with no enforcement and near-universal adoption.",
          ],
          predict: {
            ask: "Where must this file be, and what must it be called?",
            code: `package com.example.maths;

public class Calculator { }`,
            choices: [
              { text: "Anywhere, in any file", why: "Java requires the directory to match the package and the file name to match the public class." },
              { text: "com/example/maths/Calculator.java", why: "Correct. The package declares the directory path, and a public class must live in a file named after it. The compiler enforces both." },
              { text: "com/example/maths/Maths.java", why: "The file must be named after the public class it contains, which is Calculator." },
              { text: "src/Calculator.java", why: "src is a build-tool convention that sits above the package path — the package directories still have to be there underneath it." },
            ],
            answer: 1,
          },
          example: `// ---- com/example/maths/Calculator.java ----
package com.example.maths;      // the directory this file lives in

import java.util.List;          // one name
// import java.util.*;          // the whole package. Discouraged

public class Calculator {       // public, so the FILE must be Calculator.java
  private int state;            // this class only
  int packagePrivate;           // NO modifier: anything in this package
  protected int forSubclasses;  // this class and its subclasses
  public int forEveryone;

  public static int total(List<Integer> v) {
    return v.stream().mapToInt(Integer::intValue).sum();
  }
}

// ---- com/example/app/Main.java ----
package com.example.app;

import com.example.maths.Calculator;
import static com.example.maths.Calculator.total;   // the method itself

public class Main {
  public static void main(String[] args) {
    System.out.println(Calculator.total(List.of(1, 2, 3)));
    System.out.println(total(List.of(1, 2, 3)));    // static import
  }
}

// Java 9 modules sit on top, for large systems
// module com.example.app { requires com.example.maths; }`,
          notes: [
            { token: "package = directory", meaning: "and the compiler enforces the match" },
            { token: "public class = file name", meaning: "Calculator must be in Calculator.java" },
            { token: "no modifier", meaning: "package-private. The level everyone forgets" },
            { token: "import x.*", meaning: "works, and hides where a name came from" },
          ],
          prompt:
            "Declare the package for a file at com/example/maths/Calculator.java and import List.",
          starter: ` com.example.maths;

 java.util.List;

public class Calculator { }`,
          rules: {
            regex: ["package\\s+com\\.example\\.maths\\s*;", "import\\s+java\\.util\\.List\\s*;"],
            hint: "package com.example.maths; then import java.util.List;",
            success:
              "Correct, and the order is fixed: the package declaration must be the first statement in the file, before any import.",
          },
          solution: `package com.example.maths;

import java.util.List;

public class Calculator { }`,
        },

        javascript: {
          body: [
            "JavaScript has two module systems, which is one more than anyone wanted, and knowing which you are in explains most of the confusing errors.",
            "ES MODULES are the standard: `import { total } from \"./maths.js\"` and `export function total()`. They work in browsers and in Node, and they are what to use in new code.",
            "COMMONJS is Node's original: `const { total } = require(\"./maths\")` and `module.exports = { total }`. Enormous amounts of existing code use it.",
            "In Node, a `.mjs` file is always an ES module, a `.cjs` file is always CommonJS, and a `.js` file is whichever `\"type\"` in the nearest package.json says. Set `\"type\": \"module\"` and move on.",
            "The differences that bite: ES module imports are HOISTED and static, so you cannot conditionally import at the top level — use `await import(...)` for that. And in an ES module there is no `__dirname` and no `require`.",
            "In the browser, the path must be a real URL or path, and the extension is required: `\"./maths.js\"`, not `\"./maths\"`. Bundlers let you omit it, which is why code that works in a bundle fails when loaded directly.",
            "Prefer NAMED exports to a default one. `export function total()` gives every importer the same name for the same thing, while a default export can be imported under any name at all, which makes the codebase harder to search.",
            "And imports are LIVE bindings, not copies — if the exporting module reassigns the variable later, importers see the new value. That is unlike almost everything else in the language.",
          ],
          predict: {
            ask: "Why does this fail in Node?",
            code: `// package.json has "type": "module"

const fs = require("node:fs");`,
            choices: [
              { text: "node:fs is not a valid module name", why: "The node: prefix is the modern, recommended way to name a built-in module." },
              { text: "require does not exist in an ES module", why: "Correct. With \"type\": \"module\" the file is an ES module, where require is not defined at all. Use `import fs from \"node:fs\"` instead — or createRequire if you genuinely need require." },
              { text: "fs must be imported asynchronously", why: "A static import at the top of the file is exactly right. The problem is using CommonJS syntax in an ES module." },
              { text: "The package.json setting only affects .mjs files", why: "It is the other way round: \"type\" decides how .js files are treated, and .mjs is always an ES module regardless." },
            ],
            answer: 1,
          },
          example: `// ---- maths.js : ES modules, the standard ----
export function total(v) {
  return v.reduce((a, b) => a + b, 0);
}
export const PI = 3.14159;

function helper() { }          // not exported. Private to this file

export default class Calculator { }   // at most one default

// ---- main.js ----
import { total, PI } from "./maths.js";       // extension REQUIRED
import Calculator from "./maths.js";          // the default, any name
import * as maths from "./maths.js";          // everything as an object
import { total as sumAll } from "./maths.js"; // renamed

// load conditionally, or lazily
const { total } = await import("./maths.js");

// ---- CommonJS, Node's original ----
// const { total } = require("./maths");
// module.exports = { total };

// in Node:
//   .mjs  always an ES module
//   .cjs  always CommonJS
//   .js   whichever "type" in package.json says

// prefer NAMED exports. A default can be imported under any name,
// which makes the codebase harder to search

// imports are LIVE bindings, not copies`,
          notes: [
            { token: "import / export", meaning: "ES modules. The standard, in browsers and Node" },
            { token: "require / module.exports", meaning: "CommonJS. Node's original, still everywhere" },
            { token: "\"./maths.js\"", meaning: "the extension is required outside a bundler" },
            { token: "await import(...)", meaning: "conditional or lazy loading" },
          ],
          prompt:
            "Export total as a named export, and import it with the extension included.",
          starter: `//  maths.js
 function total(v) {
  return v.reduce((a, b) => a + b, 0);
}

// main.js
import { total } from "./maths";`,
          rules: {
            regex: ["export\\s+function\\s+total", "from\\s+\"\\./maths\\.js\""],
            hint: "export function total(...) and import from \"./maths.js\" with the extension.",
            success:
              "Correct. The extension is the part people trip over: bundlers resolve \"./maths\" happily, so code that works in a build fails the moment a browser loads it directly.",
          },
          solution: `// maths.js
export function total(v) {
  return v.reduce((a, b) => a + b, 0);
}

// main.js
import { total } from "./maths.js";`,
        },

        rust: {
          body: [
            "Rust's module system is the most explicit here, and the one people find hardest at first — because it separates 'this file exists' from 'this module exists'.",
            "A CRATE is one unit of compilation: a library or a binary. Inside it, `mod` declares a module, and modules form a tree with `crate` at the root.",
            "`mod maths;` in main.rs means 'there is a module called maths, look in maths.rs or maths/mod.rs'. Without that line, the file is simply not part of your program — it is not compiled and the compiler does not mention it.",
            "That is the step that catches everyone: creating the file is not enough. You must declare it.",
            "Everything is PRIVATE by default, including modules themselves. `pub` opens something up, and privacy is per module — a child module can see its parent's private items, but not the other way round.",
            "`use` brings a path into scope so you can write a short name. `use crate::maths::total;` for something in your crate, `use std::collections::HashMap;` for the standard library, `use super::helper;` for the parent module.",
            "Note that `use` only shortens a name. It does not import a file — that is what `mod` does. Confusing the two is the source of most beginner module errors.",
            "For a library crate the root is `src/lib.rs`; for a binary it is `src/main.rs`. A package can have both, plus extra binaries in `src/bin/`.",
          ],
          predict: {
            ask: "You created src/maths.rs with a pub fn total. Why does main.rs not see it?",
            code: `// src/main.rs
fn main() {
    println!("{}", maths::total(&[1, 2, 3]));
}`,
            choices: [
              { text: "total needs to be marked pub", why: "It already is. The problem is that maths.rs is not part of the crate at all yet." },
              { text: "main.rs never declares `mod maths;`", why: "Correct. Creating the file is not enough — Rust only compiles a file when a `mod` declaration brings it into the tree. Add `mod maths;` at the top of main.rs." },
              { text: "The file should be called mod.rs", why: "maths.rs is the modern layout and works fine. It still has to be declared with mod." },
              { text: "You need a use statement", why: "A use would shorten the path, and the module has to exist in the tree first. mod is what puts it there." },
            ],
            answer: 1,
          },
          example: `// ---- src/maths.rs ----
pub fn total(v: &[i32]) -> i32 {     // pub, or main cannot see it
    v.iter().sum()
}

fn helper() { }                      // private by default

pub mod advanced {                   // a nested module
    pub fn mean(v: &[i32]) -> f64 {
        super::total(v) as f64 / v.len() as f64   // super = the parent
    }
}

// ---- src/main.rs ----
mod maths;                           // DECLARES the module. Without this,
                                     // maths.rs is not compiled at all

use maths::total;                    // use only shortens the name
use maths::advanced::mean;
use std::collections::HashMap;

fn main() {
    println!("{}", total(&[1, 2, 3]));
    println!("{}", maths::total(&[1, 2, 3]));   // the long way still works
}

// the layout
// src/main.rs        a binary crate's root
// src/lib.rs         a library crate's root
// src/maths.rs       module maths
// src/maths/mod.rs   the older equivalent
// src/bin/other.rs   an extra binary`,
          notes: [
            { token: "mod maths;", meaning: "declares it. Without this the file is never compiled" },
            { token: "use", meaning: "only shortens a name. It does not include a file" },
            { token: "pub", meaning: "everything is private by default, modules included" },
            { token: "crate:: / super::", meaning: "from the root, or from the parent module" },
          ],
          prompt:
            "Bring maths.rs into the crate and shorten total so it can be called by name.",
          starter: ` maths;

 maths::total;

fn main() {
    println!("{}", total(&[1, 2, 3]));
}`,
          rules: {
            regex: ["mod\\s+maths\\s*;", "use\\s+maths::total\\s*;"],
            hint: "mod maths; declares the module, and use maths::total; shortens the name.",
            success:
              "Correct, and the two lines do genuinely different jobs: mod is what makes the file part of your program, and use is only a convenience for writing shorter names.",
          },
          solution: `mod maths;

use maths::total;

fn main() {
    println!("{}", total(&[1, 2, 3]));
}`,
        },
      },
    },

    /* ------------------------------------------------------- packages -- */
    {
      id: "packages",
      kicker: "03",
      title: "Using code other people wrote",
      hook:
        "You add three packages to a project. How many packages actually get installed?",
      body: [
        "Usually dozens, sometimes hundreds. Each of your three has its own dependencies, and so do those.",
        "That tree is worth being aware of, because every package in it is code you now ship and are responsible for. The cheapest dependency is the one you did not add.",
        "C++ is the awkward one here: for most of its life it had no standard package manager at all, which is why building a C++ project with dependencies has a reputation.",
        "The modern answer is a build system plus a package manager. CMake is the near-universal build system; vcpkg and Conan are the two package managers that have real adoption.",
        "CMake describes what to build and how to link it, and it works across compilers and platforms. `find_package` locates a dependency, and `target_link_libraries` connects it.",
        "The header-only library is a C++ tradition worth knowing: a library that is nothing but headers needs no building and no linking, just an include path. It is why so many popular C++ libraries are distributed that way.",
        "The general rules apply here as everywhere. Pin your versions. Commit whatever lock file your tool produces. And before adding a dependency, look at how big ITS tree is.",
      ],
      predict: {
        ask: "Why does C++ have such a reputation for difficult builds?",
        code: `# there is no single answer to:
#   how do I add a dependency?`,
        choices: [
          { text: "The compiler is slow", why: "Compilation speed is a real complaint and it is not what makes adding a dependency hard." },
          { text: "There is no standard package manager, so every project solves it differently", why: "Correct. Python has pip, Node has npm, Rust has Cargo — one obvious answer each. C++ has vcpkg, Conan, system packages, git submodules and hand-built libraries, all in use, so every project's setup is different." },
          { text: "Headers cannot be shared between projects", why: "Headers are shared constantly — that is what an include path is for." },
          { text: "C++ libraries are unusually large", why: "Size varies as it does anywhere. The fragmentation of the tooling is the actual problem." },
        ],
        answer: 1,
      },
      viz: traceDependency(),
      example: `# ---- CMakeLists.txt : the near-universal build system ----
cmake_minimum_required(VERSION 3.20)
project(myapp CXX)

set(CMAKE_CXX_STANDARD 20)

add_executable(myapp src/main.cpp src/maths.cpp)

find_package(fmt CONFIG REQUIRED)
target_link_libraries(myapp PRIVATE fmt::fmt)

# ---- building ----
# cmake -B build
# cmake --build build

# ---- vcpkg : one of the two real package managers ----
# vcpkg install fmt
# and vcpkg.json pins the versions for the project

# ---- Conan : the other ----
# conanfile.txt lists requirements, conan install fetches them

# header-only libraries need no building at all —
# just an include path. A long C++ tradition

# the rules, everywhere:
#   pin the versions
#   commit the lock file
#   check how big a dependency's own tree is first`,
      notes: [
        { token: "CMake", meaning: "the near-universal build system. Not a package manager" },
        { token: "vcpkg / Conan", meaning: "the two package managers with real adoption" },
        { token: "header-only", meaning: "no building, no linking. Just an include path" },
        { token: "target_link_libraries", meaning: "how a dependency gets connected" },
      ],
      challenge: {
        prompt:
          "Complete the CMake file: declare the executable from its sources, then link the fmt library to it.",
        starter: `add_executable( src/main.cpp)

target_link_libraries( PRIVATE )`,
        rules: {
          regex: ["add_executable\\s*\\(\\s*myapp\\s+src/main\\.cpp\\s*\\)", "target_link_libraries\\s*\\(\\s*myapp\\s+PRIVATE\\s+fmt::fmt\\s*\\)"],
          hint: "add_executable(myapp src/main.cpp) then target_link_libraries(myapp PRIVATE fmt::fmt)",
          success:
            "Correct. PRIVATE matters in a larger project: it says myapp uses fmt internally, so anything linking against myapp does not also inherit fmt — which is what PUBLIC would mean.",
        },
        solution: `add_executable(myapp src/main.cpp)

target_link_libraries(myapp PRIVATE fmt::fmt)`,
      },

      alt: {
        c: {
          body: [
            "Usually more than you expected, and in C you find out by hand — there is no standard package manager at all.",
            "The traditional answer is the SYSTEM package manager. `apt install libcurl4-openssl-dev` puts the headers and the library where the compiler already looks, and then `-lcurl` links it.",
            "That works well on one Linux distribution and travels badly. A different distribution has a different package name; macOS uses Homebrew; Windows has nothing comparable.",
            "`pkg-config` smooths some of this over: `pkg-config --cflags --libs libcurl` prints the flags a library needs, and build files call it rather than hard-coding paths.",
            "The other common answer is VENDORING: copy the library's source into your repository and build it as part of your project. It is the least elegant option and the most reliable — the code you tested with is the code you ship.",
            "It is also why so many C libraries are distributed as a single .c and .h pair. SQLite ships as one enormous amalgamated C file for exactly this reason: drop it in and compile.",
            "For building, `make` is the traditional tool and CMake is what most cross-platform projects now use. A Makefile is worth being able to read: a target, its prerequisites, and the commands to build it.",
          ],
          predict: {
            ask: "What does -lcurl tell the compiler?",
            code: `gcc main.c -lcurl -o app`,
            choices: [
              { text: "Include curl's header file", why: "That is what #include <curl/curl.h> does in the source. The -l flag is about linking, not headers." },
              { text: "Link against the library named libcurl", why: "Correct. -lNAME tells the linker to look for libNAME.so or libNAME.a and link it in. Headers are found separately, through the include path." },
              { text: "Download and install curl", why: "The compiler never fetches anything. The library must already be installed, usually by the system package manager." },
              { text: "Enable curl-specific optimisations", why: "It is purely about which library to link, with no effect on how the code is compiled." },
            ],
            answer: 1,
          },
          example: `/* the system package manager, on Linux */
/*   apt install libcurl4-openssl-dev   */

#include <curl/curl.h>       /* the header, from the include path */

/* gcc main.c -lcurl -o app  -- -l links libcurl */

/* pkg-config prints the right flags for a library */
/*   gcc main.c $(pkg-config --cflags --libs libcurl) -o app */

/* ---- a Makefile: target, prerequisites, commands ---- */
/*
CC      = gcc
CFLAGS  = -Wall -Wextra -std=c17
LDLIBS  = -lcurl

app: main.o maths.o
	$(CC) $^ $(LDLIBS) -o $@

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f *.o app
*/

/* vendoring: copy the source in and build it with your project.
   Least elegant, most reliable. It is why SQLite ships as one
   enormous .c file you can simply drop in */`,
          notes: [
            { token: "-lcurl", meaning: "link libcurl. Headers come from the include path" },
            { token: "pkg-config", meaning: "prints the flags a library needs" },
            { token: "vendoring", meaning: "copy the source in. Ugly and reliable" },
            { token: "make / CMake", meaning: "the traditional and the cross-platform build tools" },
          ],
          prompt:
            "Compile main.c into an executable called app, linking the curl library.",
          starter: `gcc main.c  -o `,
          rules: {
            regex: ["gcc\\s+main\\.c\\s+-lcurl\\s+-o\\s+app"],
            hint: "gcc main.c -lcurl -o app",
            success:
              "Correct, and the order matters more than it looks: on many linkers the -l flags must come AFTER the source files that use them, because the linker resolves symbols as it goes.",
          },
          solution: `gcc main.c -lcurl -o app`,
        },

        python: {
          body: [
            "Usually dozens. `pip install requests` brings its dependencies, and theirs.",
            "`pip` is the installer and PyPI is where it fetches from. `pip install requests` puts the package where Python's import can find it.",
            "The critical piece is the VIRTUAL ENVIRONMENT. Without one, every project on your machine shares the same set of installed packages, and two projects needing different versions of the same library cannot both work.",
            "`python -m venv .venv` creates one; activating it makes `pip install` write into that folder rather than into the system Python. Make one per project, always.",
            "`requirements.txt` is the old way to record dependencies, and `pyproject.toml` is the modern one — it holds the dependencies, the build configuration and the tool settings in a single file.",
            "Pin your versions. `requests` in a requirements file means 'whatever is newest today', so an install next month can bring different code. `requests==2.31.0`, or a lock file, makes it reproducible.",
            "pip has a real weakness worth knowing: it installs ONE version of each package. If two of your dependencies need different versions of a third, something has to give — unlike npm and Cargo, which install both.",
            "Newer tools — `uv` and `poetry` — handle locking properly and are much faster. `uv` in particular has become the common recommendation for new projects.",
          ],
          predict: {
            ask: "Why does this cause problems?",
            code: `# working on two projects
pip install django==3.2      # for project A
pip install django==4.2      # for project B`,
            choices: [
              { text: "It does not — pip keeps both", why: "pip installs one version of each package into a given environment; the second install replaces the first." },
              { text: "The second install replaces the first, so project A breaks", why: "Correct. Without a virtual environment both installs go into the same place, and pip keeps one version per package. Create a separate venv for each project." },
              { text: "django cannot be installed twice at all", why: "It can — in two separate environments, which is exactly what venv is for." },
              { text: "The version numbers are invalid", why: "Both are real Django versions and the syntax is correct. The problem is where they are installed." },
            ],
            answer: 1,
          },
          example: `# one environment per project. Always
python -m venv .venv
source .venv/bin/activate       # Windows: .venv\\Scripts\\activate

pip install requests
pip install "requests==2.31.0"  # pinned
pip list
pip freeze > requirements.txt   # exactly what is installed now
pip install -r requirements.txt

# ---- pyproject.toml : the modern way ----
# [project]
# name = "myapp"
# dependencies = ["requests>=2.31", "click>=8.0"]
#
# [project.optional-dependencies]
# dev = ["pytest", "ruff"]

pip install -e .                # your project, editable
pip install -e ".[dev]"         # with the dev extras

# uv — much faster, and locks properly
# uv venv && uv pip install requests
# uv lock && uv sync

# pip installs ONE version of each package.
# Two dependencies needing different versions of a third is a conflict —
# unlike npm and Cargo, which install both

# .venv belongs in .gitignore. The lock file does not`,
          notes: [
            { token: "python -m venv .venv", meaning: "one environment per project. Always" },
            { token: "pip freeze", meaning: "exactly what is installed, versions included" },
            { token: "pyproject.toml", meaning: "dependencies, build and tool config in one file" },
            { token: "one version per package", meaning: "pip's real limit. npm and Cargo install both" },
          ],
          prompt:
            "Create a project-local environment and install a pinned version of requests.",
          starter: `python -m  .venv
source .venv/bin/activate

pip install `,
          rules: {
            regex: ["python\\s+-m\\s+venv\\s+\\.venv", "pip\\s+install\\s+[\"']?requests==2\\.31\\.0"],
            hint: "python -m venv .venv, then pip install \"requests==2.31.0\"",
            success:
              "Correct. The double equals is the exact pin; `>=` would allow anything newer, which is what makes an unpinned install give different results on different days.",
          },
          solution: `python -m venv .venv
source .venv/bin/activate

pip install "requests==2.31.0"`,
        },

        java: {
          body: [
            "Usually dozens. A single Spring dependency can bring in fifty.",
            "Java has had a mature answer for a long time. Maven and Gradle both fetch dependencies, build the project and run the tests, and Maven Central is where nearly everything comes from.",
            "A dependency is named by three parts: groupId, artifactId and version — `org.apache.commons:commons-lang3:3.14.0`. That triple is unique across the whole ecosystem.",
            "Maven uses XML in `pom.xml` and is famously verbose. Gradle uses a Kotlin or Groovy script and is more concise, and more magical when it goes wrong. Both are entirely usable; new projects tend to pick Gradle.",
            "SCOPES matter more in Java than in most ecosystems. `implementation` is needed to build and run; `testImplementation` only for tests; `compileOnly` at compile time but not shipped. Getting these right keeps the shipped artifact small.",
            "Java's dependency resolution has the same limitation as pip: ONE version of each library wins. Two dependencies needing different versions of the same library is the classic 'JAR hell', and both tools give you a dependency tree command to work out what happened.",
            "Gradle produces a lock file if you ask for one, and Maven does not by default — which is why `mvn versions:display-dependency-updates` and explicit version pinning matter.",
            "One habit worth having: run `./gradlew dependencies` or `mvn dependency:tree` before adding anything large. Seeing the fifty packages up front changes the decision surprisingly often.",
          ],
          predict: {
            ask: "What is the difference between these two Gradle declarations?",
            code: `dependencies {
  implementation("com.google.guava:guava:33.0.0")
  testImplementation("org.junit.jupiter:junit-jupiter:5.10.0")
}`,
            choices: [
              { text: "None — the names are just conventions", why: "The two configurations genuinely change what ends up on the compile and runtime classpaths." },
              { text: "The first is needed to build and run; the second only for tests", why: "Correct. testImplementation puts JUnit on the test classpath only, so it is not shipped with the application. Using implementation for a test library would bundle it into the release." },
              { text: "The first is optional and the second is required", why: "It is the other way round in terms of what ships: implementation is part of the application, and testImplementation is not." },
              { text: "The second downloads at run time", why: "Both are fetched at build time. The difference is which classpath they are placed on." },
            ],
            answer: 1,
          },
          example: `// ---- build.gradle.kts : Gradle ----
plugins { application }

repositories { mavenCentral() }

dependencies {
  implementation("com.google.guava:guava:33.0.0")      // build AND run
  testImplementation("org.junit.jupiter:junit-jupiter:5.10.0")  // tests only
  compileOnly("org.projectlombok:lombok:1.18.30")      // not shipped
}

// ./gradlew build
// ./gradlew test
// ./gradlew dependencies     <- see the whole tree

/* ---- pom.xml : Maven. The same idea, in XML ----
<dependency>
  <groupId>com.google.guava</groupId>
  <artifactId>guava</artifactId>
  <version>33.0.0</version>
</dependency>

mvn package
mvn dependency:tree
*/

// a dependency is groupId:artifactId:version — unique everywhere

// ONE version of each library wins. Two dependencies wanting
// different versions of a third is the classic "JAR hell".
// The dependency tree command is how you find out what happened`,
          notes: [
            { token: "group:artifact:version", meaning: "the triple that names a dependency uniquely" },
            { token: "implementation", meaning: "build and run. testImplementation is tests only" },
            { token: "compileOnly", meaning: "at compile time, not shipped" },
            { token: "dependency:tree", meaning: "see the whole tree. Run it before adding" },
          ],
          prompt:
            "Add JUnit so it is available for tests but not shipped with the application.",
          starter: `dependencies {
  implementation("com.google.guava:guava:33.0.0")
  ("org.junit.jupiter:junit-jupiter:5.10.0")
}`,
          rules: {
            regex: ["testImplementation\\s*\\(\\s*\"org\\.junit\\.jupiter:junit-jupiter:5\\.10\\.0\"\\s*\\)"],
            mustNot: ["implementation(\"org.junit"],
            hint: "testImplementation(\"org.junit.jupiter:junit-jupiter:5.10.0\")",
            success:
              "Correct. Using plain implementation would put JUnit on the runtime classpath and bundle it into the release artifact — bigger, and it advertises your test framework to anyone who looks.",
          },
          solution: `dependencies {
  implementation("com.google.guava:guava:33.0.0")
  testImplementation("org.junit.jupiter:junit-jupiter:5.10.0")
}`,
        },

        javascript: {
          body: [
            "Usually hundreds. The JavaScript ecosystem favours small packages, so a modest project can easily install a thousand.",
            "`package.json` declares what you want. `npm install` fetches it into `node_modules` and writes `package-lock.json` recording exactly what it got.",
            "That lock file is the important one. Commit it. Without it, two developers running install on different days get different code, and the resulting bugs are miserable to track down.",
            "Version ranges are where JavaScript is most permissive. `^1.2.3` means 'any 1.x at or above this'. `~1.2.3` means 'any 1.2.x'. `1.2.3` means exactly that. The caret is the npm default, so most of your dependencies are ranges rather than pins — which is exactly why the lock file matters.",
            "npm has one real advantage over pip and Maven: when two packages need different versions of a third, it installs BOTH, nested where each can find its own. Disk space in exchange for never having a version conflict.",
            "`dependencies` ship with your application; `devDependencies` are for building and testing only. Getting that wrong bloats what you deploy.",
            "`npx` runs a package without installing it permanently, which is how most one-off tools are used now.",
            "And this ecosystem has had real supply-chain incidents. Prefer packages with few dependencies of their own, run `npm audit`, and think twice before adding something that pulls in two hundred more.",
          ],
          predict: {
            ask: "What does ^1.2.3 allow?",
            code: `"dependencies": {
  "lodash": "^1.2.3"
}`,
            choices: [
              { text: "Exactly 1.2.3", why: "That is what writing the bare version 1.2.3 means. The caret widens it." },
              { text: "Any version from 1.2.3 up to but not including 2.0.0", why: "Correct. The caret allows anything that does not change the leftmost non-zero number, so 1.9.9 is allowed and 2.0.0 is not. That is why two installs on different days can give different code — and why the lock file exists." },
              { text: "Any version 1.2.x", why: "That is the tilde, ~1.2.3. The caret is wider and allows minor version increases too." },
              { text: "Any version at all above 1.2.3", why: "A major version bump is excluded, because it is allowed to contain breaking changes." },
            ],
            answer: 1,
          },
          example: `// ---- package.json ----
// {
//   "name": "myapp",
//   "type": "module",
//   "dependencies":    { "express": "^4.18.0" },   // ships
//   "devDependencies": { "vitest": "^1.0.0" },     // build and test only
//   "scripts": { "test": "vitest", "build": "vite build" }
// }

// npm install                  install everything, write the lock
// npm install express          add one
// npm install -D vitest        add a dev dependency
// npm ci                       install EXACTLY the lock file. Use in CI
// npm run test                 run a script
// npx some-tool                run without installing permanently
// npm audit                    check for known vulnerabilities

// version ranges
//   ^1.2.3    >= 1.2.3, < 2.0.0     the npm default
//   ~1.2.3    >= 1.2.3, < 1.3.0
//   1.2.3     exactly

// commit package-lock.json. Never commit node_modules

// npm installs BOTH versions when two packages disagree,
// nested where each can find its own. No version conflicts,
// at the cost of disk space

// this ecosystem has had real supply-chain attacks.
// Prefer packages with small trees of their own`,
          notes: [
            { token: "package-lock.json", meaning: "exactly what you got. Commit it" },
            { token: "^1.2.3", meaning: "a range, and the default. Hence the lock file" },
            { token: "npm ci", meaning: "installs exactly the lock. What CI should use" },
            { token: "dependencies vs devDependencies", meaning: "shipped, versus build and test only" },
          ],
          prompt:
            "In CI, install exactly what the lock file records rather than resolving the ranges again.",
          starter: `npm `,
          rules: {
            regex: ["npm\\s+ci"],
            mustNot: ["npm install"],
            hint: "npm ci",
            success:
              "Correct. npm ci deletes node_modules and installs precisely the lock file, and it fails outright if package.json and the lock disagree — which is exactly the check you want in CI.",
          },
          solution: `npm ci`,
        },

        rust: {
          body: [
            "Usually dozens, and Cargo is unusually good at making that painless — it is often held up as the best package manager of the six.",
            "`Cargo.toml` declares what you want. `cargo build` fetches it, builds it and writes `Cargo.lock` recording exactly what it got.",
            "Commit `Cargo.lock` for an application. For a LIBRARY the convention is not to, because the application that ends up using your library should decide the versions.",
            "Packages come from crates.io. `cargo add serde` adds one to your manifest without you editing it by hand.",
            "Cargo shares npm's advantage: when two dependencies need different major versions of a third, both are built and linked, each where its user can find it. There is no version conflict to resolve by hand.",
            "FEATURES are Cargo's distinctive idea. A crate can offer optional pieces, and you enable only what you need: `tokio = { version = \"1\", features = [\"full\"] }`. That keeps compile times and binary sizes down.",
            "`default-features = false` turns off everything a crate enables by default, which matters when you are targeting an embedded system with no standard library.",
            "One well-known cost: compile times. Rust does a lot of work up front, and a large dependency tree compiles slowly the first time. `cargo check` type-checks without generating code and is much faster for a quick look.",
          ],
          predict: {
            ask: "Why does this matter?",
            code: `[dependencies]
tokio = { version = "1", features = ["rt", "macros"] }
# rather than
# tokio = { version = "1", features = ["full"] }`,
            choices: [
              { text: "It does not — features are documentation", why: "Features genuinely control which code is compiled into your binary." },
              { text: "Only the named parts are compiled, so builds are faster and the binary smaller", why: "Correct. Cargo features are conditional compilation: \"full\" pulls in every part of tokio, while naming just the ones you use compiles less and links less." },
              { text: "\"full\" is not a valid feature name", why: "It is a real feature that tokio provides — a convenience meaning everything." },
              { text: "Features change the version that is fetched", why: "The version is separate. Features decide which parts of that version are compiled." },
            ],
            answer: 1,
          },
          example: `# ---- Cargo.toml ----
# [package]
# name = "myapp"
# version = "0.1.0"
# edition = "2021"
#
# [dependencies]
# serde = { version = "1.0", features = ["derive"] }
# tokio = { version = "1", features = ["rt", "macros"] }
# rand  = { version = "0.8", default-features = false }
#
# [dev-dependencies]
# criterion = "0.5"            # tests and benchmarks only

# cargo new myapp              a new project
# cargo add serde --features derive
# cargo build                  build, and write Cargo.lock
# cargo build --release        optimised
# cargo check                  type-check only. Much faster
# cargo test
# cargo tree                   the whole dependency tree
# cargo clippy                 the linter. Genuinely worth running
# cargo fmt                    the formatter. No arguments about style

# commit Cargo.lock for an APPLICATION.
# For a library, let the application decide the versions

# two dependencies wanting different major versions of a third?
# Cargo builds both. No conflict to resolve by hand

# the cost: compile times. cargo check when you just want the errors`,
          notes: [
            { token: "Cargo.lock", meaning: "commit it for an application, not for a library" },
            { token: "features", meaning: "compile only the parts you use" },
            { token: "cargo check", meaning: "type-check without codegen. Far faster" },
            { token: "cargo clippy / fmt", meaning: "the linter and formatter. Both standard" },
          ],
          prompt:
            "Add serde with only the derive feature enabled, rather than everything.",
          starter: `[dependencies]
serde = { version = "1.0",  = [] }`,
          rules: {
            regex: ["features\\s*=\\s*\\[\\s*\"derive\"\\s*\\]"],
            hint: "features = [\"derive\"]",
            success:
              "Correct. serde's derive feature is what enables #[derive(Serialize, Deserialize)] — and it is optional precisely because it pulls in a procedural macro crate that costs real compile time.",
          },
          solution: `[dependencies]
serde = { version = "1.0", features = ["derive"] }`,
        },
      },
    },
  ],
};
