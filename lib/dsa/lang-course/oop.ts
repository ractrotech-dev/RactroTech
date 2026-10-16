import type { TopicLesson } from "@/lib/dsa/lessons/types";
import { traceInheritVsCompose, traceMethodDispatch, traceObjectShape } from "@/lib/dsa/viz/traceLang";

// Language track, topic 7.
//
// The widest divergence in the whole track. C has structs and no methods at
// all. Rust has structs and traits and deliberately no inheritance. JavaScript
// has classes that are prototypes wearing a costume. So the `alt` blocks here
// replace the body text far more often than elsewhere.

export const LANG_OOP: TopicLesson = {
  id: "lang-oop",
  title: "Objects & Types",
  tagline: "Bundling data with the things you do to it.",
  why:
    "Once a program holds more than a handful of values, loose variables stop scaling. Bundling the data that belongs together, and keeping the code that works on it nearby, is what makes a large program readable. Every language here does that; only some of them call it object-oriented programming.",
  plain: [
    "A struct or class groups related values under one name.",
    "A method is a function that belongs to that group and knows which one it was called on.",
    "An interface, or trait, is a promise about what something can do — without saying how.",
    "Inheritance shares code down a family tree. Composition builds from parts. The second one ages better.",
  ],
  needs: ["Functions, especially what a parameter receives.", "References from Memory, at least loosely."],
  traps: [
    "A deep inheritance tree is hard to read: understanding one class means reading four.",
    "Public fields let anything change your data. Once they are public, you cannot change how the data is stored without breaking every caller.",
    "Comparing two objects usually compares identity, not contents, unless you say otherwise.",
    "Objects passed to functions are shared in most of these languages, so a method can change data you thought was yours.",
  ],
  sections: [
    /* ------------------------------------------------------- bundling -- */
    {
      id: "bundling",
      kicker: "01",
      title: "Grouping what belongs together",
      hook:
        "You are tracking three dogs: names, ages, breeds. Nine variables. Then it becomes thirty dogs. What do you write instead?",
      body: [
        "One description of what a dog IS, and then as many dogs as you like.",
        "That description is a class. It lists the fields every dog has, and the things every dog can do. It is a blueprint, not a dog.",
        "Making an object from it gives you a fresh set of boxes. Two dogs have their own names and ages; changing one has nothing to do with the other.",
        "The METHODS are not copied. There is one copy of the code, shared by every object, and each call is handed the object it was called on — that is what `this` is.",
        "The other half of a class is deciding what is visible. `public` means anyone can touch it; `private` means only the class itself can.",
        "That distinction earns its keep the first time you change how something is stored. If `age` is public, every caller reads it directly and you can never change it. If it is private behind a method, you can store a birth date instead and nobody notices.",
        "A CONSTRUCTOR is the function that sets a new object up. Its job is to leave the object in a valid state — every field meaningful, no half-built objects escaping.",
      ],
      predict: {
        ask: "What does this C++ code print?",
        code: `struct Dog {
  string name;
};

Dog a{"Rex"};
Dog b = a;
b.name = "Fig";

cout << a.name;`,
        choices: [
          { text: "Fig", why: "Assigning a struct in C++ copies it, so b is an independent object." },
          { text: "Rex", why: "Correct. C++ copies by default: `Dog b = a;` makes a whole new Dog with a copy of the name. Changing b leaves a alone — the opposite of Python, Java and JavaScript." },
          { text: "An empty string", why: "The copy carries the value across, so b starts as \"Rex\" before being changed." },
          { text: "It will not compile without a copy constructor", why: "The compiler writes a perfectly good one for you when every member is copyable, which a string is." },
        ],
        answer: 1,
      },
      viz: traceObjectShape(),
      example: `class Dog {
 private:
  string name;              // only Dog can touch these
  int age;

 public:
  Dog(string n, int a) : name(n), age(a) {}   // constructor

  string getName() const { return name; }     // const = does not change it
  void haveBirthday() { age++; }
};

Dog rex("Rex", 3);
cout << rex.getName();
// rex.age = 99;            // will not compile. age is private

// struct is the same thing with public as the default
struct Point { int x, y; };
Point p{1, 2};

// C++ COPIES by default
Dog copy = rex;             // a whole new Dog
Dog& alias = rex;           // the same Dog, second name`,
      notes: [
        { token: "private / public", meaning: "who may touch it. Private by default in a class" },
        { token: "Dog(string n, int a)", meaning: "the constructor. Runs when an object is made" },
        { token: ": name(n), age(a)", meaning: "the initialiser list. Sets fields before the body runs" },
        { token: "Dog copy = rex", meaning: "a real copy. C++ does not share by default" },
      ],
      challenge: {
        prompt:
          "Give Dog a constructor that sets both fields, and a getName that promises not to change the object.",
        starter: `class Dog {
 private:
  string name;
  int age;

 public:
  (string n, int a) : name(n), age(a) {}

  string getName()  { return name; }
};`,
        rules: {
          regex: ["Dog\\s*\\(\\s*string\\s+n\\s*,\\s*int\\s+a\\s*\\)", "string\\s+getName\\s*\\(\\s*\\)\\s*const"],
          hint: "The constructor is named after the class: Dog(string n, int a). And getName() const promises not to modify the object.",
          success:
            "Correct. That trailing `const` is worth the habit: it lets the method be called on a const Dog, and the compiler enforces the promise rather than trusting you.",
        },
        solution: `class Dog {
 private:
  string name;
  int age;

 public:
  Dog(string n, int a) : name(n), age(a) {}

  string getName() const { return name; }
};`,
      },

      alt: {
        c: {
          hook:
            "You are tracking thirty dogs: names, ages, breeds. C has no classes. So what does grouping look like?",
          body: [
            "A struct. It groups related values under one name, and that is where C stops — there are no methods, no private fields and no constructors.",
            "`struct Dog { char name[32]; int age; };` describes the shape. `struct Dog rex;` makes one.",
            "Reaching a field is `rex.age` when you have the struct, and `p->age` when you have a pointer to it. `p->age` is just shorthand for `(*p).age`.",
            "There are no methods, so the convention is a function taking a pointer to the struct as its first argument: `void dog_birthday(struct Dog *d)`. That first argument is exactly what other languages hide as `this` or write out as `self`.",
            "There is no `private` either. Anything can reach any field. The C convention is to put the struct definition in the .c file and only a forward declaration in the header — then callers have a pointer they cannot look inside, which is real encapsulation done by hand.",
            "And there is no constructor. The convention is a function that makes and initialises one — `struct Dog *dog_new(const char *name, int age)` — paired with a `dog_free` that releases it.",
            "One important detail: C structs are COPIED on assignment and when passed by value, including the whole array inside. For anything large, pass a pointer.",
          ],
          predict: {
            ask: "What does this C code print?",
            code: `struct P { int x; };

void bump(struct P p)  { p.x = 99; }
void bump2(struct P *p){ p->x = 99; }

struct P a = {1};
bump(a);
printf("%d ", a.x);
bump2(&a);
printf("%d", a.x);`,
            choices: [
              { text: "99 99", why: "The first call passed a copy of the struct, so it could not reach the caller's one." },
              { text: "1 99", why: "Correct. C passes structs BY VALUE, so bump got a copy and its change was thrown away. bump2 took a pointer and wrote through it, so that change stuck." },
              { text: "1 1", why: "bump2 writes through the pointer, which reaches the caller's struct." },
              { text: "It will not compile — structs cannot be passed by value", why: "Passing a struct by value is perfectly legal C. It copies the whole thing, which is the point of the example." },
            ],
            answer: 1,
          },
          example: `struct Dog {
  char name[32];
  int age;
};

struct Dog rex = {"Rex", 3};
printf("%s", rex.name);          /* have the struct: dot */

struct Dog *p = &rex;
printf("%d", p->age);            /* have a pointer: arrow */
                                 /* p->age IS (*p).age    */

/* no methods. The convention is a function taking the struct */
void dog_birthday(struct Dog *d) { d->age++; }
dog_birthday(&rex);

/* no constructor. The convention is a make-and-free pair */
struct Dog *dog_new(const char *name, int age) {
  struct Dog *d = malloc(sizeof *d);
  if (!d) return NULL;
  snprintf(d->name, sizeof d->name, "%s", name);
  d->age = age;
  return d;
}
void dog_free(struct Dog *d) { free(d); }

/* structs are COPIED on assignment — the whole thing */
struct Dog copy = rex;

/* typedef saves writing struct every time */
typedef struct Dog Dog;
Dog another;`,
          notes: [
            { token: "d.field vs p->field", meaning: "the struct itself, versus a pointer to it" },
            { token: "no methods", meaning: "a function taking the struct pointer first. That IS this" },
            { token: "dog_new / dog_free", meaning: "the C stand-in for a constructor and destructor" },
            { token: "struct copy = rex", meaning: "copies the whole struct, arrays included" },
          ],
          prompt:
            "Write dog_birthday so it adds a year to the caller's dog — not to a copy.",
          starter: `void dog_birthday(struct Dog d) {
  d.age++;
}`,
          rules: {
            regex: ["struct\\s+Dog\\s*\\*\\s*d", "d->age\\s*\\+\\+"],
            hint: "Take a pointer — struct Dog *d — and reach the field with the arrow: d->age++;",
            success:
              "Correct. Passing by pointer also avoids copying the whole struct, which for a 32-byte name array is real work done for nothing.",
          },
          solution: `void dog_birthday(struct Dog *d) {
  d->age++;
}`,
        },

        python: {
          body: [
            "One description of what a dog IS, and then as many dogs as you like.",
            "`class Dog:` describes it. `__init__` is the constructor — it runs when you make an object, and its job is to set the fields up.",
            "The first parameter of every method is `self`, and you write it out. Other languages hide the same thing as `this`; Python's rule is that the object is passed explicitly, so nothing is magic.",
            "`Dog(\"Rex\", 3)` makes one. You do not write `new`.",
            "There is no real `private` in Python. A leading underscore — `self._age` — is a convention meaning 'do not touch this from outside', and nothing enforces it. Two underscores triggers name mangling, which discourages rather than prevents.",
            "That is a deliberate choice: Python trusts the programmer and keeps the language small. It works well in practice and it does mean you cannot rely on encapsulation the way Java does.",
            "`@property` is the piece worth knowing. It lets a method be READ like a field, so you can start with a plain field and later turn it into a computed one without changing a single caller.",
            "For classes that are mostly just data, `@dataclass` writes `__init__`, `__repr__` and `__eq__` for you from the field declarations. It is usually the right starting point.",
          ],
          predict: {
            ask: "What does this Python code print?",
            code: `class Dog:
    tricks = []          # on the CLASS, not the object

    def __init__(self, name):
        self.name = name

a = Dog("Rex")
b = Dog("Fig")
a.tricks.append("sit")

print(b.tricks)`,
            choices: [
              { text: "[]", why: "tricks is defined on the class, so both dogs share the same list object." },
              { text: "['sit']", why: "Correct. A list created at class level is shared by every instance — appending through a is visible through b. Assign it inside __init__ instead, so each object gets its own." },
              { text: "AttributeError", why: "b can certainly see tricks — it finds it on the class, which is exactly the problem." },
              { text: "['sit', 'sit']", why: "Only one append happened, and both names see that same single list." },
            ],
            answer: 1,
          },
          example: `class Dog:
    def __init__(self, name, age):     # the constructor
        self.name = name               # per-object, always in here
        self._age = age                # _ means "internal, please"

    def have_birthday(self):
        self._age += 1

    @property                          # read it like a field
    def age(self):
        return self._age

    def __repr__(self):                # how it prints
        return f"Dog({self.name!r})"


rex = Dog("Rex", 3)
print(rex.name)
print(rex.age)             # no brackets — it is a property
rex.have_birthday()

# mostly-data classes: let Python write the boilerplate
from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int = 0             # a default

p = Point(1, 2)
print(p)                   # Point(x=1, y=2) — __repr__ for free
print(p == Point(1, 2))    # True — __eq__ for free`,
          notes: [
            { token: "__init__(self, ...)", meaning: "the constructor. Set per-object fields here" },
            { token: "self", meaning: "written out, not hidden. The object the method was called on" },
            { token: "_name", meaning: "a convention meaning internal. Nothing enforces it" },
            { token: "@dataclass", meaning: "__init__, __repr__ and __eq__ written for you" },
          ],
          prompt:
            "Write the constructor so each Dog gets its OWN name and its own empty list of tricks.",
          starter: `class Dog:
    def __init__(, name):
        .name = name
        .tricks = `,
          rules: {
            regex: ["def\\s+__init__\\s*\\(\\s*self\\s*,\\s*name\\s*\\)", "self\\.name\\s*=\\s*name", "self\\.tricks\\s*=\\s*\\[\\s*\\]"],
            hint: "def __init__(self, name): then self.name = name and self.tricks = []",
            success:
              "Correct. Creating the list inside __init__ is what makes it per-object — the same list written at class level would be shared by every dog you ever make.",
          },
          solution: `class Dog:
    def __init__(self, name):
        self.name = name
        self.tricks = []`,
        },

        java: {
          body: [
            "One description of what a dog IS, and then as many dogs as you like.",
            "Java is the most explicit of the six here: everything lives in a class, and every field and method says who may see it.",
            "`private` means only this class. `public` means anyone. `protected` means this class and anything extending it. No modifier at all means 'anything in the same package', which is a real and often-forgotten level.",
            "The standard shape is private fields with public getters, and it exists for a reason: it lets you change how the data is stored later without breaking callers.",
            "A constructor has the class's name and no return type. You can have several with different parameters, and one can call another with `this(...)`.",
            "`this` is the object the method was called on. You mostly only write it when a parameter shadows a field — `this.name = name` — which is why constructors are full of it.",
            "For classes that are just data, a `record` replaces about forty lines: `record Point(int x, int y) {}` gives you the fields, a constructor, getters, `equals`, `hashCode` and `toString`, all correct.",
            "One Java-specific thing worth setting straight now: an object variable holds a REFERENCE. `Dog b = a;` gives you two names for one dog, not two dogs — the opposite of C++.",
          ],
          predict: {
            ask: "What does this Java code print?",
            code: `class Dog { String name; }

Dog a = new Dog();
a.name = "Rex";
Dog b = a;
b.name = "Fig";

System.out.println(a.name);`,
            choices: [
              { text: "Rex", why: "Java does not copy objects on assignment — b and a refer to the same Dog." },
              { text: "Fig", why: "Correct. `Dog b = a;` copies the REFERENCE, not the object. There is one Dog with two names, so changing it through b is visible through a." },
              { text: "null", why: "The name was set to \"Rex\" and then to \"Fig\" — on the same object, since only the reference was copied." },
              { text: "It will not compile without a clone()", why: "Assigning one reference to another is ordinary Java. Copying the object would need clone or a copy constructor, and that is not what this code does." },
            ],
            answer: 1,
          },
          example: `public class Dog {
  private final String name;      // final = set once, in the constructor
  private int age;

  public Dog(String name, int age) {
    this.name = name;             // this. because the parameter shadows
    this.age = age;
  }

  public Dog(String name) {       // another constructor
    this(name, 0);                // calls the one above
  }

  public String getName() { return name; }
  public void haveBirthday() { age++; }

  @Override public String toString() { return "Dog(" + name + ")"; }
}

Dog rex = new Dog("Rex", 3);
System.out.println(rex.getName());

// a record: fields, constructor, getters, equals, hashCode, toString
record Point(int x, int y) {}
Point p = new Point(1, 2);
System.out.println(p.x());        // note the brackets
System.out.println(p);            // Point[x=1, y=2]

// assignment copies the REFERENCE, not the object
Dog alias = rex;                  // one dog, two names`,
          notes: [
            { token: "private / public / protected", meaning: "and no modifier at all means package-visible" },
            { token: "this.name = name", meaning: "needed when a parameter shadows a field" },
            { token: "this(name, 0)", meaning: "one constructor calling another" },
            { token: "record Point(int x, int y)", meaning: "about forty lines of boilerplate, in one" },
          ],
          prompt:
            "Write the constructor so it sets both fields, using this to tell the fields from the parameters.",
          starter: `public class Dog {
  private String name;
  private int age;

  public (String name, int age) {
    name = name;
    age = age;
  }
}`,
          rules: {
            regex: ["public\\s+Dog\\s*\\(\\s*String\\s+name\\s*,\\s*int\\s+age\\s*\\)", "this\\.name\\s*=\\s*name", "this\\.age\\s*=\\s*age"],
            hint: "The constructor is named Dog, and inside it write this.name = name; and this.age = age;",
            success:
              "Correct. Without the `this.`, `name = name` assigns the parameter to itself and the field stays null — it compiles cleanly and some compilers do not even warn.",
          },
          solution: `public class Dog {
  private String name;
  private int age;

  public Dog(String name, int age) {
    this.name = name;
    this.age = age;
  }
}`,
        },

        javascript: {
          body: [
            "One description of what a dog IS, and then as many dogs as you like — although JavaScript gives you two ways to write it, and it is worth knowing the second is the real one.",
            "For plain data, an object literal is often enough: `const dog = { name: \"Rex\", age: 3 }`. No class needed, and this is what most JavaScript code actually uses.",
            "For something with behaviour, `class Dog { constructor(name) { this.name = name; } }` reads exactly like Java, and underneath it is not a class at all — it is a function and a PROTOTYPE, which is JavaScript's own mechanism wearing a familiar costume.",
            "That matters in one visible way: methods live on the prototype, shared by all instances, exactly as the diagram shows. `class` syntax did not add anything new to the language; it made the existing thing easier to write.",
            "Private fields are real now: a `#` prefix — `#age` — is genuinely inaccessible from outside, and reaching for it is a syntax error rather than a convention.",
            "The trap specific to JavaScript is `this`. In a normal method it is the object. Pull the method out — `const f = dog.speak; f();` — and `this` is lost. Arrow functions capture `this` from where they were written, which is why event handlers usually use them.",
            "And as everywhere except C++ and Rust, `const b = a` on an object copies the REFERENCE. `{...a}` gives a shallow copy, and `structuredClone(a)` a deep one.",
          ],
          predict: {
            ask: "What does this print?",
            code: `class Dog {
  constructor(name) { this.name = name; }
  speak() { return this.name + " woofs"; }
}

const d = new Dog("Rex");
const f = d.speak;

console.log(f());`,
            choices: [
              { text: "\"Rex woofs\"", why: "Pulling the method out of the object loses the connection to it, so this is not the dog any more." },
              { text: "TypeError: cannot read properties of undefined", why: "Correct. f is just the function, with no object attached, so `this` is undefined inside a class body — and reading this.name throws. Bind it, or wrap it in an arrow function." },
              { text: "\"undefined woofs\"", why: "That is what would happen in sloppy mode, but class bodies are always strict, so `this` is undefined rather than the global object — and reading a property of undefined throws." },
              { text: "It will not compile", why: "JavaScript has no compile step to catch this. It fails when the line actually runs." },
            ],
            answer: 1,
          },
          example: `// for plain data, a literal is often enough
const point = { x: 1, y: 2 };

class Dog {
  #age;                       // a REAL private field

  constructor(name, age) {
    this.name = name;
    this.#age = age;
  }

  speak() { return \`\${this.name} woofs\`; }

  get age() { return this.#age; }        // read like a field
  haveBirthday() { this.#age++; }

  static fromString(s) {                 // belongs to the class
    return new Dog(s, 0);
  }
}

const rex = new Dog("Rex", 3);
console.log(rex.speak());
console.log(rex.age);         // no brackets — it is a getter
// rex.#age                   // SyntaxError. Genuinely private

// this is lost when the method is detached
const f = rex.speak;
// f();                       // TypeError
const g = rex.speak.bind(rex);   // fixed
const h = () => rex.speak();     // also fixed

// assignment copies the REFERENCE
const alias = rex;            // one dog, two names
const copy = { ...point };    // a shallow copy`,
          notes: [
            { token: "class", meaning: "syntax over prototypes. Methods are shared, not copied" },
            { token: "#age", meaning: "a genuinely private field. Not a convention" },
            { token: "get age()", meaning: "a getter. Read it without brackets" },
            { token: "detached methods", meaning: "lose `this`. Use bind or an arrow function" },
          ],
          prompt:
            "Write the constructor so it stores the name, and speak so it uses that name.",
          starter: `class Dog {
  (name) {
    .name = name;
  }

  speak() {
    return .name + " woofs";
  }
}`,
          rules: {
            regex: ["constructor\\s*\\(\\s*name\\s*\\)", "this\\.name\\s*=\\s*name", "return\\s+this\\.name"],
            hint: "constructor(name) { this.name = name; } and then return this.name + \" woofs\";",
            success:
              "Correct. Note there is no `function` keyword and no `Dog(name)` — inside a class the constructor is spelled `constructor`, which is one of the few places JavaScript differs visibly from Java here.",
          },
          solution: `class Dog {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return this.name + " woofs";
  }
}`,
        },

        rust: {
          hook:
            "You are tracking thirty dogs. Rust has no classes at all. So where does the behaviour go?",
          body: [
            "In a separate block. Rust splits the two halves that other languages combine: a `struct` holds the data, and an `impl` block holds the methods.",
            "`struct Dog { name: String, age: u32 }` is the data. `impl Dog { fn speak(&self) { } }` is what a Dog can do.",
            "The split is not cosmetic. You can write several impl blocks, and — importantly — you can add methods to a type when you implement a trait for it, which is how Rust extends types without inheritance.",
            "Methods take `self` explicitly, and WHICH self decides everything. `&self` borrows to read. `&mut self` borrows to modify. `self` takes ownership and consumes the object, which is how builder methods chain.",
            "There is no constructor. The convention is an associated function called `new`: `fn new(name: String) -> Self`. It has no `self` parameter, so you call it as `Dog::new(...)` with the double colon.",
            "Privacy is per MODULE, not per struct, and everything is private by default. `pub` opens a field or function up. That default is the opposite of C++ structs and Python, and it means encapsulation is what you get unless you ask otherwise.",
            "One more piece: `#[derive(Debug, Clone, PartialEq)]` above a struct generates printing, copying and equality. Rust gives you nothing implicitly, and gives you a one-line way to ask for each of it.",
          ],
          predict: {
            ask: "What is the difference between these three method signatures?",
            code: `impl Dog {
    fn name(&self) -> &str { &self.name }
    fn rename(&mut self, n: String) { self.name = n; }
    fn into_name(self) -> String { self.name }
}`,
            choices: [
              { text: "Only style — they all work the same", why: "The three forms differ in what the method may do and whether the caller keeps the object afterwards." },
              { text: "Read-only, may modify, and consumes the object", why: "Correct. &self borrows to read, &mut self borrows to modify, and plain self takes ownership — after calling into_name the dog no longer exists, which is why the name can be handed out without cloning." },
              { text: "The third one is a syntax error", why: "Taking self by value is valid and common — it is how conversions and builder chains are written." },
              { text: "The second one needs to return Self", why: "&mut self methods usually return nothing. Returning Self is the builder pattern, which takes self by value instead." },
            ],
            answer: 1,
          },
          example: `#[derive(Debug, Clone, PartialEq)]      // printing, copying, ==
pub struct Dog {
    pub name: String,        // pub = visible outside the module
    age: u32,                // private by DEFAULT
}

impl Dog {
    // the constructor convention. No self — call it Dog::new(...)
    pub fn new(name: String, age: u32) -> Self {
        Self { name, age }   // shorthand when names match
    }

    pub fn speak(&self) -> String {          // borrows to READ
        format!("{} woofs", self.name)
    }

    pub fn have_birthday(&mut self) {        // borrows to MODIFY
        self.age += 1;
    }

    pub fn into_name(self) -> String {       // CONSUMES the dog
        self.name
    }
}

let mut rex = Dog::new("Rex".to_string(), 3);
println!("{}", rex.speak());
rex.have_birthday();
println!("{:?}", rex);       // Debug, from the derive

let copy = rex.clone();      // an explicit copy
let name = rex.into_name();  // rex is gone after this line`,
          notes: [
            { token: "struct + impl", meaning: "data and behaviour in separate blocks" },
            { token: "&self / &mut self / self", meaning: "read, modify, or consume the object" },
            { token: "fn new() -> Self", meaning: "the constructor convention. Called with Dog::new" },
            { token: "#[derive(...)]", meaning: "ask for printing, copying and equality. Nothing is implicit" },
          ],
          prompt:
            "Write new so it builds a Dog, and speak so it reads the name without taking ownership.",
          starter: `impl Dog {
    pub fn new(name: String, age: u32) ->  {
        Self { name, age }
    }

    pub fn speak() -> String {
        format!("{} woofs", self.name)
    }
}`,
          rules: {
            regex: ["fn\\s+new\\s*\\(\\s*name\\s*:\\s*String\\s*,\\s*age\\s*:\\s*u32\\s*\\)\\s*->\\s*Self", "fn\\s+speak\\s*\\(\\s*&self\\s*\\)"],
            hint: "new returns Self, and speak takes &self so it only borrows the dog.",
            success:
              "Correct. Taking plain `self` in speak would have consumed the dog — you could call it once and then the object would be gone, which the compiler would tell you about at the second call.",
          },
          solution: `impl Dog {
    pub fn new(name: String, age: u32) -> Self {
        Self { name, age }
    }

    pub fn speak(&self) -> String {
        format!("{} woofs", self.name)
    }
}`,
        },
      },
    },

    /* ------------------------------------------------------- promises -- */
    {
      id: "promises",
      kicker: "02",
      title: "Promising what something can do",
      hook:
        "You want one function that can draw a circle, a square, or anything else someone adds next year — without you editing it. How?",
      body: [
        "You stop asking what the thing IS and start asking what it can DO.",
        "Write down the promise — 'anything with an area' — and let the function accept anything that keeps it. In C++ that promise is an abstract base class with `virtual` methods.",
        "`virtual double area() const = 0;` says: every Shape must provide this, and I am not providing a default. A class with one of those cannot be instantiated — you can only make the things that fill it in.",
        "When you call `s->area()` through a Shape pointer, the object itself decides which code runs. That is dynamic dispatch, and it is what lets a Hexagon written next year plug into a function written today.",
        "C++ makes you ask for it. Without `virtual`, the call is decided at compile time by the POINTER'S type, not the object's — so a Shape pointer to a Circle would run Shape's version. That is a classic and confusing bug.",
        "One rule that goes with it: if a class has any virtual method, give it a virtual destructor. Deleting a Circle through a Shape pointer without one does not run Circle's destructor, and quietly leaks.",
        "C++ also has a second answer with no run-time cost: TEMPLATES. `template<typename T> double describe(const T& shape)` works with any type that has an `area()`, decided entirely at compile time. Faster, and the error messages are worse.",
      ],
      predict: {
        ask: "What does this C++ code print?",
        code: `struct Shape {
  double area() const { return 0; }     // NOT virtual
};
struct Circle : Shape {
  double area() const { return 78.5; }
};

Shape* s = new Circle();
cout << s->area();`,
        choices: [
          { text: "78.5", why: "Without virtual, the call is resolved from the pointer's type at compile time, not from the object." },
          { text: "0", why: "Correct. area is not virtual, so the compiler picks Shape's version based on the pointer's declared type. Adding `virtual` to Shape::area gives 78.5." },
          { text: "It will not compile", why: "Redefining a non-virtual method in a derived class is legal — it hides the base version rather than overriding it." },
          { text: "Undefined behaviour", why: "The behaviour is well defined and surprising: static dispatch picks Shape::area, which returns 0." },
        ],
        answer: 1,
      },
      viz: traceMethodDispatch(),
      example: `struct Shape {
  virtual double area() const = 0;   // = 0 means "you must provide it"
  virtual ~Shape() = default;        // ALWAYS, when anything is virtual
};

struct Circle : Shape {
  double r;
  Circle(double r) : r(r) {}
  double area() const override { return 3.14159 * r * r; }
};

struct Square : Shape {
  double s;
  Square(double s) : s(s) {}
  double area() const override { return s * s; }
};

// one function, any Shape — including ones written later
void report(const Shape& s) { cout << s.area(); }

vector<unique_ptr<Shape>> shapes;
shapes.push_back(make_unique<Circle>(5));
for (auto& s : shapes) cout << s->area();     // the object decides

// no run-time cost, decided at compile time
template<typename T>
void reportFast(const T& shape) { cout << shape.area(); }`,
      notes: [
        { token: "virtual ... = 0", meaning: "every subclass must provide it. The class cannot be made" },
        { token: "override", meaning: "ask the compiler to check you really are overriding" },
        { token: "virtual ~Shape()", meaning: "required, or deleting through a base pointer leaks" },
        { token: "template", meaning: "the same flexibility, decided at compile time. No cost" },
      ],
      challenge: {
        prompt:
          "Make Shape a proper interface: area must be provided by subclasses, and deleting through a Shape pointer must be safe.",
        starter: `struct Shape {
   double area() const ;
   ~Shape() = default;
};`,
        rules: {
          regex: ["virtual\\s+double\\s+area\\s*\\(\\s*\\)\\s*const\\s*=\\s*0", "virtual\\s+~Shape\\s*\\(\\s*\\)"],
          hint: "virtual double area() const = 0; for the requirement, and virtual ~Shape() for safe deletion.",
          success:
            "Correct. The virtual destructor is easy to forget and the leak it causes is silent — the rule is simple enough to just follow: any virtual method means a virtual destructor.",
        },
        solution: `struct Shape {
  virtual double area() const = 0;
  virtual ~Shape() = default;
};`,
      },

      alt: {
        c: {
          body: [
            "You store the function itself alongside the data. C has no interfaces, no virtual methods and no inheritance — and it can still do this, because a function pointer is just a value.",
            "The pattern is: a struct holding a pointer to the data and a pointer to the function that knows how to handle it.",
            "`struct Shape { void *data; double (*area)(void *); };` — then a Circle sets `area` to `circle_area`, and a Square sets it to `square_area`.",
            "Calling `s.area(s.data)` runs whichever function was stored. That is dynamic dispatch, written out by hand, and it is exactly what C++ generates for you behind `virtual`.",
            "For a type with several operations, the usual arrangement is a struct of function pointers — a VTABLE — shared by every object of that type, with each object holding a pointer to it. That is precisely what a C++ object looks like in memory.",
            "You will meet this in real code constantly. The `FILE` type, the Linux kernel's file operations, and most C libraries with plug-in behaviour are all built this way.",
            "It costs the same as C++'s version: one pointer hop, and no inlining. The difference is that you can see it, which is either the appeal or the tedium of C depending on the day.",
          ],
          predict: {
            ask: "What does this pattern give you?",
            code: `struct Shape {
  void *data;
  double (*area)(void *);
};

struct Shape s = { circle, circle_area };
printf("%f", s.area(s.data));`,
            choices: [
              { text: "Nothing useful — it is a roundabout function call", why: "The call site never changes when a new shape type is added, which is exactly what an interface buys you." },
              { text: "Dynamic dispatch, written by hand", why: "Correct. The struct stores which function to call, so one call site works for any shape — including ones added later. It is what C++ builds for you behind the word virtual." },
              { text: "Type safety over void pointers", why: "It gives up type safety: void* means the compiler cannot check that data matches the function. That is the price of doing this in C." },
              { text: "Inheritance", why: "There is no inheritance here at all — no base class, no shared fields. Only a promise about what can be called." },
            ],
            answer: 1,
          },
          example: `/* the promise: data, plus the function that understands it */
struct Shape {
  void *data;
  double (*area)(void *);
};

struct Circle { double r; };
double circle_area(void *p) {
  struct Circle *c = p;
  return 3.14159 * c->r * c->r;
}

struct Square { double s; };
double square_area(void *p) {
  struct Square *q = p;
  return q->s * q->s;
}

struct Circle c = {5};
struct Shape shapes[] = {
  { &c, circle_area },
};

/* one call site, any shape — including ones added later */
for (int i = 0; i < n; i++)
  printf("%f", shapes[i].area(shapes[i].data));

/* for several operations: a shared table of function pointers.
   This IS what a C++ object looks like in memory */
struct ShapeOps {
  double (*area)(void *);
  void   (*draw)(void *);
};
struct Object { void *data; const struct ShapeOps *ops; };`,
          notes: [
            { token: "double (*area)(void *)", meaning: "the function stored alongside the data" },
            { token: "void *data", meaning: "any type. The compiler can no longer check it" },
            { token: "a struct of function pointers", meaning: "a vtable. What C++ generates for you" },
            { token: "s.area(s.data)", meaning: "one call site, whichever function was stored" },
          ],
          prompt:
            "Declare the Shape struct: a void pointer to the data, and a function pointer taking a void pointer and returning a double.",
          starter: `struct Shape {
   data;
  double ;
};`,
          rules: {
            regex: ["void\\s*\\*\\s*data", "double\\s*\\(\\s*\\*\\s*area\\s*\\)\\s*\\(\\s*void\\s*\\*\\s*\\)"],
            hint: "void *data; and double (*area)(void *);",
            success:
              "Correct. Reading it outwards from the name: area is a pointer, to a function, taking a void pointer, returning a double — the same rule that unpicks every C declaration.",
          },
          solution: `struct Shape {
  void *data;
  double (*area)(void *);
};`,
        },

        python: {
          body: [
            "You just call `.area()` and let Python find it. That is DUCK TYPING: if it walks like a duck and quacks like a duck, Python is satisfied.",
            "There is no declaration to write. Any object with an `area()` method works, whether or not its author had ever heard of your function.",
            "That is genuinely liberating and it has a real cost: nothing tells you the promise exists. The error arrives at run time, on the line that made the call, possibly in production.",
            "Python has two ways to write the promise down when you want it. `typing.Protocol` describes what a type must have, and a type checker verifies it — with no inheritance required, so it works on classes you did not write.",
            "`abc.ABC` with `@abstractmethod` is the older, stricter route: subclasses must implement the method, and the class cannot be instantiated until they do. It requires inheriting, which is the trade.",
            "For most Python code, duck typing plus a Protocol for the type checker is the modern answer. ABCs earn their place when you want the failure to happen at construction time rather than at call time.",
            "One thing worth knowing: `isinstance` checks are usually a sign you are fighting the language. Asking whether something HAS a method — or just calling it and handling the failure — is more Pythonic than asking what it is.",
          ],
          predict: {
            ask: "What happens with this Python code?",
            code: `class Circle:
    def area(self): return 78.5

class Robot:
    def area(self): return 1.0

def report(shape):
    print(shape.area())

report(Circle())
report(Robot())`,
            choices: [
              { text: "It fails — Robot is not a Shape", why: "Python never asks what a type IS. It only tries the method when the call happens." },
              { text: "It prints 78.5 then 1.0", why: "Correct. There is no shared base class and none is needed — both objects have an area method, so both work. That is duck typing." },
              { text: "It prints 78.5 then raises AttributeError", why: "Robot does have an area method, so the call succeeds. It would only fail on an object without one." },
              { text: "It needs Circle and Robot to inherit from a Shape class", why: "That is Java's requirement, not Python's. Nothing has to be declared for this to work." },
            ],
            answer: 1,
          },
          example: `# duck typing — no declaration at all
class Circle:
    def area(self): return 78.5

def report(shape):
    print(shape.area())       # works on ANY object with area()

report(Circle())

# write the promise down for a type checker, without inheritance
from typing import Protocol

class HasArea(Protocol):
    def area(self) -> float: ...

def report_checked(shape: HasArea) -> None:
    print(shape.area())       # mypy checks the callers

# the stricter route: subclasses MUST implement it
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self) -> float: ...

class Square(Shape):
    def __init__(self, s): self.s = s
    def area(self): return self.s ** 2

# Shape()          # TypeError — cannot instantiate
Square(4).area()

# asking what it HAS beats asking what it IS
if hasattr(x, "area"):
    x.area()`,
          notes: [
            { token: "duck typing", meaning: "no declaration. If it has the method, it works" },
            { token: "Protocol", meaning: "the promise, checked by a tool. No inheritance needed" },
            { token: "ABC + @abstractmethod", meaning: "stricter. Cannot instantiate until implemented" },
            { token: "hasattr(x, ...)", meaning: "asking what it has. More Pythonic than isinstance" },
          ],
          prompt:
            "Make Shape an abstract base class whose subclasses must provide area.",
          starter: `from abc import ABC, abstractmethod

class Shape():
    
    def area(self) -> float: ...`,
          rules: {
            regex: ["class\\s+Shape\\s*\\(\\s*ABC\\s*\\)", "@abstractmethod"],
            hint: "class Shape(ABC): and put @abstractmethod on the line above def area.",
            success:
              "Correct. Both halves are needed: inheriting ABC installs the metaclass that does the checking, and @abstractmethod is what marks the method as required.",
          },
          solution: `from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self) -> float: ...`,
        },

        java: {
          body: [
            "You write down the promise as an INTERFACE, and Java checks it at compile time.",
            "`interface Shape { double area(); }` says: anything claiming to be a Shape must provide this. A class then declares `implements Shape` and the compiler will not let it through without the method.",
            "This is Java's central idea, and it is the reason so much Java code is written against interfaces: `List` rather than `ArrayList`, `Map` rather than `HashMap`. The code depends on the promise, not on the implementation.",
            "A class extends exactly one class and implements as many interfaces as it likes. That asymmetry is deliberate — multiple inheritance of DATA causes problems, multiple promises do not.",
            "Interfaces have grown since Java 8. They can have `default` methods with a body, so you can add a method to an interface without breaking every existing implementation. They can have `static` helper methods too.",
            "A `sealed interface` is the modern addition worth knowing: it lists exactly which types may implement it, which lets a `switch` over them be checked for completeness. That is Java borrowing an idea from Rust's enums.",
            "`@Override` is not required and you should always write it. It costs nothing and turns a silent typo — a method that does not actually override anything — into a compile error.",
          ],
          predict: {
            ask: "Which of these is legal Java?",
            code: `class A extends B, C { }              // 1
class D extends B implements X, Y { }  // 2
interface Z extends X, Y { }           // 3`,
            choices: [
              { text: "All three", why: "A class may extend only one class, so the first line is not legal." },
              { text: "2 and 3", why: "Correct. A class extends at most ONE class but may implement any number of interfaces, and an interface may extend several interfaces — because interfaces carry promises rather than data." },
              { text: "Only 2", why: "An interface extending several interfaces is legal and common — Java only forbids multiple inheritance of classes." },
              { text: "Only 3", why: "Line 2 is the standard shape of Java code: one superclass, several interfaces." },
            ],
            answer: 1,
          },
          example: `interface Shape {
  double area();                     // every Shape must have this

  default String describe() {        // a body, added without breaking
    return "area " + area();         // existing implementations
  }

  static Shape unit() { return new Square(1); }
}

class Circle implements Shape {
  private final double r;
  Circle(double r) { this.r = r; }
  @Override public double area() { return Math.PI * r * r; }
}

class Square implements Shape {
  private final double s;
  Square(double s) { this.s = s; }
  @Override public double area() { return s * s; }
}

// one method, any Shape — including ones written later
void report(Shape s) { System.out.println(s.area()); }

List<Shape> shapes = List.of(new Circle(5), new Square(4));
for (Shape s : shapes) System.out.println(s.area());

// sealed: exactly these, so a switch can be checked for completeness
sealed interface Expr permits Num, Add {}
record Num(int v) implements Expr {}
record Add(Expr l, Expr r) implements Expr {}`,
          notes: [
            { token: "interface", meaning: "the promise. The compiler enforces it" },
            { token: "one extends, many implements", meaning: "one parent class, any number of promises" },
            { token: "default method", meaning: "a body in an interface. Adds without breaking callers" },
            { token: "@Override", meaning: "not required, always write it. Turns typos into errors" },
          ],
          prompt:
            "Declare the Shape interface with an area method, and make Circle implement it.",
          starter: `interface Shape {
  double ;
}

class Circle  Shape {
  public double area() { return 78.5; }
}`,
          rules: {
            regex: ["interface\\s+Shape\\s*\\{\\s*double\\s+area\\s*\\(\\s*\\)\\s*;", "class\\s+Circle\\s+implements\\s+Shape"],
            hint: "double area(); with a semicolon and no body, and `class Circle implements Shape`.",
            success:
              "Correct. Note the interface method has no body and no modifier — interface methods are public and abstract by default, so writing either is redundant.",
          },
          solution: `interface Shape {
  double area();
}

class Circle implements Shape {
  public double area() { return 78.5; }
}`,
        },

        javascript: {
          body: [
            "You just call `.area()` and let JavaScript find it. Like Python, this is duck typing: any object with the method works, and nothing is declared.",
            "JavaScript has no interfaces at all. There is no keyword, no compile-time check, and no way for the language to tell you an object is missing a method until you call it.",
            "In practice most JavaScript codebases handle this in one of two ways. Small ones rely on convention and tests. Larger ones use TypeScript, where `interface Shape { area(): number }` is checked before the code ever runs.",
            "The mechanism underneath is the PROTOTYPE CHAIN. When you write `obj.area()`, the engine looks on the object, then on its prototype, then on that prototype's prototype, until it finds the method or runs out.",
            "`class Circle extends Shape` sets that chain up, and `super.area()` calls the next one along it. `class` syntax is a friendlier way to write what `Object.create` and `prototype` always did.",
            "Because there is no declared promise, defensive checks are common: `if (typeof x.area === \"function\")`. They work, and if you find yourself writing many of them, that is usually the signal to reach for TypeScript.",
            "One useful piece: `Symbol.iterator` is a real, language-level interface — implement it and your object works with `for...of` and the spread operator. That is the closest JavaScript comes to the idea.",
          ],
          predict: {
            ask: "What does this print?",
            code: `class Shape {
  area() { return 0; }
  describe() { return "area " + this.area(); }
}
class Circle extends Shape {
  area() { return 78.5; }
}

console.log(new Circle().describe());`,
            choices: [
              { text: "\"area 0\"", why: "The lookup for this.area starts at the object, and Circle's version is found before Shape's." },
              { text: "\"area 78.5\"", why: "Correct. describe is found on Shape, but `this.area()` is looked up starting from the actual object — so Circle's area wins. That is dynamic dispatch by prototype chain." },
              { text: "\"area undefined\"", why: "Both methods exist and both are reachable — describe from Shape, area from Circle." },
              { text: "TypeError", why: "extends sets up the prototype chain correctly, so describe is inherited and the call works." },
            ],
            answer: 1,
          },
          example: `// no interfaces. Duck typing: does it have the method?
function report(shape) {
  console.log(shape.area());
}
report({ area: () => 78.5 });     // a plain object is enough

// classes and the prototype chain
class Shape {
  area() { throw new Error("subclass must implement area"); }
  describe() { return \`area \${this.area()}\`; }
}

class Circle extends Shape {
  constructor(r) { super(r); this.r = r; }   // super() first
  area() { return Math.PI * this.r ** 2; }
}

console.log(new Circle(5).describe());

// a defensive check, when you cannot trust the input
if (typeof shape.area === "function") shape.area();

// TypeScript is where the promise gets written down:
// interface Shape { area(): number }

// the one real interface in the language
class Range {
  constructor(n) { this.n = n; }
  *[Symbol.iterator]() { for (let i = 0; i < this.n; i++) yield i; }
}
console.log([...new Range(3)]);   // [0, 1, 2]`,
          notes: [
            { token: "no interfaces", meaning: "duck typing only. TypeScript adds the checking" },
            { token: "the prototype chain", meaning: "object, then its prototype, then that one's" },
            { token: "super(...)", meaning: "call it FIRST in a subclass constructor" },
            { token: "Symbol.iterator", meaning: "a real language-level interface. Powers for...of" },
          ],
          prompt:
            "Make Circle extend Shape, calling the parent constructor before using this.",
          starter: `class Circle  Shape {
  constructor(r) {
    ;
    this.r = r;
  }
}`,
          rules: {
            regex: ["class\\s+Circle\\s+extends\\s+Shape", "super\\s*\\("],
            hint: "class Circle extends Shape, and call super(r); before touching this.",
            success:
              "Correct. The ordering is enforced: touching `this` before calling super() throws a ReferenceError, because the object is not fully built until the parent constructor has run.",
          },
          solution: `class Circle extends Shape {
  constructor(r) {
    super(r);
    this.r = r;
  }
}`,
        },

        rust: {
          body: [
            "You write down the promise as a TRAIT, and Rust checks it at compile time — with one large advantage over interfaces.",
            "`trait Shape { fn area(&self) -> f64; }` is the promise. `impl Shape for Circle { }` fulfils it.",
            "The advantage: the trait and the type do not have to be written together. You can implement YOUR trait for a type from the standard library, or someone else's trait for your type. Java and C++ cannot do that at all — the method has to be inside the class.",
            "That is why Rust needs no inheritance. Extending a type means implementing another trait for it, and that works on any type, from anywhere.",
            "There are two ways to use a trait, and the difference is worth understanding.",
            "`fn report(s: &impl Shape)` is STATIC dispatch: the compiler generates a separate copy for each concrete type, and the calls are as fast as direct calls. This is the default and you should prefer it.",
            "`fn report(s: &dyn Shape)` is DYNAMIC dispatch: one copy, and each call looks the method up through a table — the same cost as C++'s virtual. You need it when a collection holds several different types: `Vec<Box<dyn Shape>>`.",
            "Traits can supply DEFAULT method bodies, so a trait can give you a lot for free from one required method — which is how `Iterator` gives you `map`, `filter`, `sum` and dozens more from a single `next`.",
          ],
          predict: {
            ask: "Which of these can Rust do that Java's interfaces cannot?",
            code: `// in YOUR crate, for a type from the standard library
trait Loud {
    fn shout(&self) -> String;
}

impl Loud for String {
    fn shout(&self) -> String { self.to_uppercase() }
}`,
            choices: [
              { text: "Nothing — Java can add methods to String too", why: "Java cannot. A method must be declared inside the class, and String is final and out of your control." },
              { text: "Add a method to a type you did not write", why: "Correct. Implementing your own trait for a foreign type is normal Rust, and it is why the language needs no inheritance to extend existing types. Java would need a static helper or a wrapper class." },
              { text: "Inherit from String", why: "Rust has no inheritance at all. This is implementing a trait, which is a different mechanism." },
              { text: "Override String's existing methods", why: "It adds a new method rather than replacing one. Rust will not let you override an existing inherent method." },
            ],
            answer: 1,
          },
          example: `trait Shape {
    fn area(&self) -> f64;                    // required

    fn describe(&self) -> String {            // a default body
        format!("area {}", self.area())
    }
}

struct Circle { r: f64 }
struct Square { s: f64 }

impl Shape for Circle {
    fn area(&self) -> f64 { std::f64::consts::PI * self.r * self.r }
}
impl Shape for Square {
    fn area(&self) -> f64 { self.s * self.s }
}

// STATIC dispatch — a copy per type, no run-time cost. Prefer this
fn report(s: &impl Shape) { println!("{}", s.area()); }

// DYNAMIC dispatch — one copy, a lookup per call.
// Needed when the collection holds different types
let shapes: Vec<Box<dyn Shape>> = vec![
    Box::new(Circle { r: 5.0 }),
    Box::new(Square { s: 4.0 }),
];
for s in &shapes { println!("{}", s.describe()); }

// implement YOUR trait for a foreign type. Java cannot do this
trait Loud { fn shout(&self) -> String; }
impl Loud for String {
    fn shout(&self) -> String { self.to_uppercase() }
}`,
          notes: [
            { token: "trait / impl Trait for Type", meaning: "the promise, and fulfilling it. Written separately" },
            { token: "&impl Shape", meaning: "static dispatch. A copy per type, no cost" },
            { token: "&dyn Shape / Box<dyn Shape>", meaning: "dynamic dispatch. Needed for mixed collections" },
            { token: "default method bodies", meaning: "one required method can give you dozens free" },
          ],
          prompt:
            "Declare the Shape trait with a required area method, and implement it for Circle.",
          starter: ` Shape {
    fn area(&self) -> f64;
}

 Shape  Circle {
    fn area(&self) -> f64 { 78.5 }
}`,
          rules: {
            regex: ["trait\\s+Shape\\s*\\{", "impl\\s+Shape\\s+for\\s+Circle"],
            hint: "trait Shape { ... } and then impl Shape for Circle { ... }",
            success:
              "Correct. Read `impl Shape for Circle` as 'Circle keeps the Shape promise' — and note it is a separate block, which is exactly what lets you write it for a type you did not define.",
          },
          solution: `trait Shape {
    fn area(&self) -> f64;
}

impl Shape for Circle {
    fn area(&self) -> f64 { 78.5 }
}`,
        },
      },
    },

    /* -------------------------------------------------------- reusing -- */
    {
      id: "reusing",
      kicker: "03",
      title: "Sharing code without a family tree",
      hook:
        "A Dog is an Animal, so Dog inherits from Animal. Then someone adds a RobotDog that barks but never eats. Where does it go?",
      body: [
        "Nowhere good, and that is the standard sign that inheritance was the wrong tool.",
        "Inheritance says IS-A: a Dog is an Animal, so it gets everything Animal has whether it wants it or not. That is fine two levels deep and increasingly awkward after that.",
        "The costs are concrete. Reading one class means reading all its ancestors. Changing anything near the top affects everything below. And a type that fits ALMOST has nowhere to sit.",
        "Composition says HAS-A: a Dog has a Voice and a Stomach. Each piece is small and independently testable, and a RobotDog takes a Voice and a Battery without fighting anything.",
        "That is why 'prefer composition over inheritance' is such standard advice, and why Rust and Go left inheritance out of their languages entirely.",
        "In C++ specifically there is one more reason to be careful: multiple inheritance is allowed, and it brings the diamond problem — inherit from two classes that share a base and you get two copies of it, unless you use `virtual` inheritance, which has its own surprises.",
        "The rule to work by: use inheritance when the is-a relationship is real, permanent and shallow. Use composition, or an interface, for everything else. When in doubt, hold an object rather than inherit from it.",
      ],
      predict: {
        ask: "What is the problem with this C++ code?",
        code: `struct Animal { int age; };
struct Pet : Animal {};
struct Working : Animal {};
struct Dog : Pet, Working {};

Dog d;
cout << d.age;`,
        choices: [
          { text: "Nothing — Dog inherits age once", why: "Dog inherits Animal twice, once through each parent, so there are two age fields and the reference is ambiguous." },
          { text: "d.age is ambiguous — there are two copies of Animal", why: "Correct. This is the diamond problem: Dog gets Animal through Pet AND through Working, so it holds two age fields and the compiler cannot tell which one you meant. `virtual` inheritance on Pet and Working collapses them into one." },
          { text: "C++ does not allow multiple inheritance", why: "C++ does allow it — which is precisely why the diamond problem exists here and not in Java." },
          { text: "Animal needs a virtual destructor", why: "It would need one if these were used polymorphically, but that is not what breaks this code — the ambiguity is." },
        ],
        answer: 1,
      },
      viz: traceInheritVsCompose(),
      example: `// inheritance — a real, shallow is-a
struct Animal {
  int age;
  virtual void speak() const = 0;
  virtual ~Animal() = default;
};

struct Dog : Animal {
  void speak() const override { cout << "woof"; }
};

// composition — usually the better default
struct Voice {
  string sound;
  void speak() const { cout << sound; }
};

struct RobotDog {
  Voice voice;                 // HAS a voice
  int battery;
  void speak() const { voice.speak(); }   // forward to it
};

// the diamond, and its fix
struct Pet : virtual Animal {};      // virtual collapses the copies
struct Working : virtual Animal {};
struct GuideDog : Pet, Working {};   // now one Animal, not two

// prefer this to a deep tree: small pieces, assembled
struct Logger { void log(const string&) const; };
struct Service {
  Logger logger;               // has-a, not is-a
};`,
      notes: [
        { token: "is-a", meaning: "inheritance. Real, permanent and shallow only" },
        { token: "has-a", meaning: "composition. A member you forward calls to" },
        { token: "the diamond", meaning: "two paths to one base means two copies" },
        { token: "virtual inheritance", meaning: "collapses them into one. And brings its own surprises" },
      ],
      challenge: {
        prompt:
          "Rewrite RobotDog with composition: give it a Voice as a member, and forward speak to it.",
        starter: `struct RobotDog {
   voice;
  void speak() const { ; }
};`,
        rules: {
          regex: ["Voice\\s+voice\\s*;", "voice\\.speak\\s*\\(\\s*\\)"],
          hint: "Hold a Voice as a member — Voice voice; — and call voice.speak() inside speak.",
          success:
            "Correct. That forwarding line looks like extra typing and it is what buys you the flexibility: RobotDog decides which of Voice's abilities to expose, rather than inheriting all of them by default.",
        },
        solution: `struct RobotDog {
  Voice voice;
  void speak() const { voice.speak(); }
};`,
      },

      alt: {
        c: {
          hook:
            "You have three struct types that all need the same handling code. C has no inheritance. How do you avoid writing it three times?",
          body: [
            "Two ways, and both are worth recognising because you will meet them in real C code constantly.",
            "The first is EMBEDDING. Put the common struct as the FIRST member of each specific one: `struct Dog { struct Animal base; char breed[16]; };`.",
            "Because it is first, a pointer to the Dog is also a valid pointer to the Animal — the C standard guarantees a struct's address is the address of its first member. So a function taking `struct Animal *` works on any of them, with a cast.",
            "That is exactly how the Linux kernel and GTK do inheritance, and it is what C++ generates for single inheritance underneath.",
            "The second is the function-pointer table from the previous section: a struct of operations, shared per type, with each object pointing at it. That gives you the virtual-method half.",
            "Neither is type-safe. The cast from `struct Dog *` to `struct Animal *` is something you assert and the compiler cannot check. Get it wrong and you read the wrong bytes with no warning.",
            "The C answer to most of this, though, is simpler than either: prefer composition, keep structs flat, and pass what a function actually needs rather than a big object it must dig into.",
          ],
          predict: {
            ask: "Why can a struct Dog * be used as a struct Animal * here?",
            code: `struct Animal { int age; };
struct Dog {
  struct Animal base;    /* FIRST member */
  char breed[16];
};

struct Dog d;
struct Animal *a = (struct Animal *)&d;`,
            choices: [
              { text: "C allows any struct pointer to be cast to any other", why: "The cast is allowed but only MEANINGFUL because of where base sits in the struct." },
              { text: "A struct's address is the address of its first member", why: "Correct. The standard guarantees no padding before the first member, so &d and &d.base are the same address — which is what makes the cast valid rather than merely legal." },
              { text: "The compiler tracks the relationship", why: "The compiler tracks nothing here. It is a raw cast, and correctness rests entirely on base being first." },
              { text: "Because Animal is smaller than Dog", why: "Size is not what makes it work. If base were the second member, the addresses would differ and the cast would read the wrong bytes." },
            ],
            answer: 1,
          },
          example: `/* embedding — the common part FIRST */
struct Animal { int age; };

struct Dog {
  struct Animal base;        /* must be first */
  char breed[16];
};

struct Dog d = { {3}, "collie" };

/* a pointer to Dog is also a valid pointer to Animal */
struct Animal *a = (struct Animal *)&d;
printf("%d", a->age);        /* 3 */

/* so one function handles every kind */
void animal_birthday(struct Animal *a) { a->age++; }
animal_birthday((struct Animal *)&d);

/* going back down needs a cast you must get right */
struct Dog *back = (struct Dog *)a;

/* composition — usually the better answer in C */
struct Voice { char sound[16]; };
struct RobotDog {
  struct Voice voice;        /* has-a. No casting, no assumptions */
  int battery;
};
printf("%s", rd.voice.sound);`,
          notes: [
            { token: "the common struct FIRST", meaning: "what makes the cast valid, not just legal" },
            { token: "(struct Animal *)&d", meaning: "the cast the compiler cannot check for you" },
            { token: "used by the kernel and GTK", meaning: "this is real, widespread C, not a trick" },
            { token: "composition", meaning: "a member you reach by name. No casts at all" },
          ],
          prompt:
            "Set Dog up so a Dog pointer can safely be used as an Animal pointer.",
          starter: `struct Dog {
  char breed[16];
  ;
};`,
          rules: {
            regex: ["struct\\s+Dog\\s*\\{\\s*struct\\s+Animal\\s+base\\s*;"],
            hint: "struct Animal base; must be the FIRST member, before breed.",
            success:
              "Correct. Order is the whole mechanism here: move base below breed and every cast silently reads the breed characters as an age instead.",
          },
          solution: `struct Dog {
  struct Animal base;
  char breed[16];
};`,
        },

        python: {
          body: [
            "Nowhere good, and that is the standard sign that inheritance was the wrong tool.",
            "Python allows inheritance, allows MULTIPLE inheritance, and has an unusually well-defined rule for resolving it — and the community still mostly advises against deep trees.",
            "The costs are the same as everywhere: reading one class means reading its ancestors, a change near the top affects everything below, and a type that fits almost has nowhere to sit.",
            "Composition in Python is easy enough that there is rarely an excuse. Hold the object as a field and call it. Duck typing means you do not even need a shared base for the pieces to be interchangeable.",
            "When you do inherit, `super().__init__(...)` calls the parent's constructor. Use `super()` rather than naming the parent class — it does the right thing when the tree changes, and it is required for multiple inheritance to work at all.",
            "The rule that makes multiple inheritance workable is the MRO, the method resolution order: Python computes one definite order to search the classes and `ClassName.__mro__` shows it. It is well defined, and it still rewards keeping trees shallow.",
            "MIXINS are the one use of multiple inheritance that stays readable: a small class adding one capability and holding no data of its own. `class Serializable:` with a `to_json` method, mixed into whatever needs it.",
          ],
          predict: {
            ask: "What does this Python code print?",
            code: `class A:
    def who(self): return "A"

class B(A):
    def who(self): return "B"

class C(A):
    def who(self): return "C"

class D(B, C): pass

print(D().who())`,
            choices: [
              { text: "\"A\"", why: "Python searches the subclasses before the shared base — A is the last place it looks." },
              { text: "\"B\"", why: "Correct. The method resolution order for D is D, B, C, A — left to right across the parents, and a shared base comes after both. So B's who is found first." },
              { text: "\"C\"", why: "C comes after B in the order, because the parents are searched left to right as written in class D(B, C)." },
              { text: "TypeError — ambiguous", why: "Python resolves this with a defined algorithm rather than refusing. D.__mro__ shows the exact order it computed." },
            ],
            answer: 1,
          },
          example: `# inheritance, when the is-a is real and shallow
class Animal:
    def __init__(self, age):
        self.age = age
    def speak(self):
        raise NotImplementedError

class Dog(Animal):
    def __init__(self, age, breed):
        super().__init__(age)        # super(), not Animal.__init__
        self.breed = breed
    def speak(self):
        return "woof"

# composition — usually the better default
class Voice:
    def __init__(self, sound): self.sound = sound
    def speak(self): return self.sound

class RobotDog:
    def __init__(self):
        self.voice = Voice("beep-woof")     # HAS a voice
        self.battery = 100
    def speak(self):
        return self.voice.speak()

# mixins: one capability, no data. The readable use of multiple
class Serializable:
    def to_json(self):
        import json
        return json.dumps(self.__dict__)

class Config(Serializable):
    def __init__(self): self.debug = True

print(Config().to_json())
print(Dog.__mro__)      # the exact search order Python computed`,
          notes: [
            { token: "super().__init__(...)", meaning: "call the parent. Never name the class directly" },
            { token: "__mro__", meaning: "the exact order methods are searched in" },
            { token: "a mixin", meaning: "one capability, no data. Multiple inheritance done well" },
            { token: "composition", meaning: "a field you call. Needs no shared base at all" },
          ],
          prompt:
            "Write Dog's constructor so it passes age up to Animal and then sets its own breed.",
          starter: `class Dog(Animal):
    def __init__(self, age, breed):
        (age)
        self.breed = breed`,
          rules: {
            regex: ["super\\s*\\(\\s*\\)\\s*\\.__init__\\s*\\(\\s*age\\s*\\)"],
            mustNot: ["Animal.__init__"],
            hint: "super().__init__(age) — super() rather than naming Animal directly.",
            success:
              "Correct. Naming Animal directly works until someone puts another class between the two, or adds a second parent — super() follows the computed order and keeps working.",
          },
          solution: `class Dog(Animal):
    def __init__(self, age, breed):
        super().__init__(age)
        self.breed = breed`,
        },

        java: {
          body: [
            "Nowhere good, and that is the standard sign that inheritance was the wrong tool.",
            "Java only allows single inheritance of classes, which avoids the diamond problem entirely — and deep single chains are still a problem, so the advice holds.",
            "The costs are concrete. Reading one class means reading all its ancestors. A change near the top affects everything below. And a type that ALMOST fits has nowhere to sit.",
            "Java's own libraries carry a famous example: `Stack extends Vector`, so a Stack has `get(i)` and `insertElementAt` — operations a stack should not have. That is inheritance grabbing more than it needed, permanently, in a class nobody can now change.",
            "Composition is the fix and Java makes it slightly wordier than Python: hold the object as a field and write forwarding methods. The wordiness is real and it buys you control over exactly what you expose.",
            "`final` on a class means nobody may extend it. That is a design decision worth making deliberately — `String` is final for good reasons — and Effective Java's advice is to design for inheritance or forbid it, rather than leaving it accidental.",
            "Since Java 17, `sealed` sits between the two: `sealed class Shape permits Circle, Square` allows exactly the subclasses you name. It keeps the hierarchy closed and lets a switch over the types be checked for completeness.",
          ],
          predict: {
            ask: "What is the design problem with Java's own Stack class?",
            code: `class Stack<E> extends Vector<E> { }

Stack<Integer> s = new Stack<>();
s.push(1);
s.insertElementAt(99, 0);   // legal!`,
            choices: [
              { text: "Nothing — a stack is a kind of list", why: "A stack is defined by what it does NOT allow: access anywhere except the top. Inheriting a list breaks that promise." },
              { text: "It inherits operations a stack should not have", why: "Correct. Extending Vector means Stack exposes get, insertElementAt and everything else, so anyone can reach into the middle. Holding a list as a field would have exposed only push, pop and peek." },
              { text: "Vector is too slow", why: "Vector's synchronisation is a separate complaint. The design problem is the inherited API, which no amount of speed would fix." },
              { text: "Generics do not work with inheritance", why: "The generics here are fine. The problem is what the inheritance drags in." },
            ],
            answer: 1,
          },
          example: `// inheritance — real, permanent, shallow
abstract class Animal {
  protected final int age;
  Animal(int age) { this.age = age; }
  abstract String speak();
}

class Dog extends Animal {
  private final String breed;
  Dog(int age, String breed) {
    super(age);                    // FIRST statement, always
    this.breed = breed;
  }
  @Override String speak() { return "woof"; }
}

// composition — hold it, and expose only what you mean to
class Voice {
  private final String sound;
  Voice(String sound) { this.sound = sound; }
  String speak() { return sound; }
}

class RobotDog {
  private final Voice voice = new Voice("beep-woof");
  private int battery = 100;
  String speak() { return voice.speak(); }    // forward it
}

// close the hierarchy deliberately
final class Money { }                  // nobody may extend

sealed class Shape permits Circle, Square { }   // exactly these
final class Circle extends Shape { }
final class Square extends Shape { }`,
          notes: [
            { token: "super(...)", meaning: "must be the FIRST statement in the constructor" },
            { token: "abstract class", meaning: "cannot be instantiated. May hold fields, unlike an interface" },
            { token: "final class", meaning: "nobody may extend it. A deliberate decision" },
            { token: "sealed ... permits", meaning: "exactly these subclasses. Lets a switch be checked" },
          ],
          prompt:
            "Write Dog's constructor so it passes age up to Animal before setting its own field.",
          starter: `class Dog extends Animal {
  private final String breed;

  Dog(int age, String breed) {
    (age);
    this.breed = breed;
  }
}`,
          rules: {
            regex: ["super\\s*\\(\\s*age\\s*\\)\\s*;"],
            hint: "super(age); and it must come before anything else in the constructor.",
            success:
              "Correct. The ordering is enforced by the compiler: super() has to be the first statement, because the parent's part of the object must be built before the subclass touches anything.",
          },
          solution: `class Dog extends Animal {
  private final String breed;

  Dog(int age, String breed) {
    super(age);
    this.breed = breed;
  }
}`,
        },

        javascript: {
          body: [
            "Nowhere good, and that is the standard sign that inheritance was the wrong tool.",
            "JavaScript supports single inheritance through `extends`, and the community leans further towards composition than most — partly because the language makes it so cheap.",
            "An object is just a bag of properties, so 'add this capability' can be as simple as spreading one object into another, or assigning a function onto it.",
            "The most common composition pattern in modern JavaScript is a factory function that closes over its data and returns an object of methods. No `this`, no `new`, no prototype chain — and no way to lose `this` by detaching a method.",
            "`Object.assign(target, ...sources)` copies properties in, which is the quick way to mix capabilities together. `{...a, ...b}` does the same for a new object.",
            "When you do use `extends`, `super(...)` must be called before you touch `this` in the constructor — the object is not fully built until the parent has run.",
            "The deeper reason to be careful in JavaScript specifically: `this` is decided by how a function is CALLED, not where it was defined. Deep class hierarchies plus callbacks is where that becomes genuinely confusing, and factory functions sidestep it entirely.",
          ],
          predict: {
            ask: "What does this print?",
            code: `function makeDog(name) {
  let barks = 0;
  return {
    speak() { barks++; return name + " woofs"; },
    count() { return barks; },
  };
}

const d = makeDog("Rex");
const f = d.speak;
f();
console.log(d.count());`,
            choices: [
              { text: "0", why: "The factory's methods close over the variables rather than using this, so detaching one changes nothing." },
              { text: "1", why: "Correct. speak refers to `name` and `barks` through the closure, not through `this` — so calling it detached works perfectly. That is the practical advantage of factory functions over classes here." },
              { text: "TypeError", why: "There is no `this` involved, so nothing is lost by detaching the method. This is exactly the class version's failure that closures avoid." },
              { text: "undefined", why: "count returns barks, which was incremented to 1 by the detached call." },
            ],
            answer: 1,
          },
          example: `// inheritance, when it is genuinely is-a
class Animal {
  constructor(age) { this.age = age; }
  speak() { throw new Error("implement speak"); }
}

class Dog extends Animal {
  constructor(age, breed) {
    super(age);              // before touching this
    this.breed = breed;
  }
  speak() { return "woof"; }
}

// composition — hold it and forward
class RobotDog {
  #voice = { speak: () => "beep-woof" };
  speak() { return this.#voice.speak(); }
}

// mixing capabilities in
const canBark = { bark() { return "woof"; } };
const canCharge = { charge() { this.battery = 100; } };
const robot = Object.assign({ battery: 0 }, canBark, canCharge);

// the pattern most modern JavaScript reaches for:
// a factory closing over its data. No this, no new, no prototype
function makeDog(name) {
  let barks = 0;
  return {
    speak() { barks++; return \`\${name} woofs\`; },
    count() { return barks; },
  };
}
const d = makeDog("Rex");
const detached = d.speak;    // still works — no this to lose`,
          notes: [
            { token: "super(...)", meaning: "before touching this. The object is not built yet" },
            { token: "Object.assign(t, a, b)", meaning: "mix capabilities in. Copies properties" },
            { token: "a factory function", meaning: "closes over its data. No this to lose" },
            { token: "this depends on the CALL", meaning: "not the definition. Why closures are safer here" },
          ],
          prompt:
            "Write the factory so it closes over name and returns an object with a speak method.",
          starter: `function makeDog(name) {
  return {
    speak() { return  + " woofs"; },
  };
}`,
          rules: {
            regex: ["return\\s+name\\s*\\+\\s*\"\\s*woofs\"|return\\s+name\\s*\\+"],
            mustNot: ["this.name"],
            hint: "Just use `name` — the closure captured it, so there is no this involved.",
            success:
              "Correct, and the absence of `this` is the point: this method can be pulled out, passed to setTimeout, or used as an event handler, and it keeps working.",
          },
          solution: `function makeDog(name) {
  return {
    speak() { return name + " woofs"; },
  };
}`,
        },

        rust: {
          hook:
            "A Dog is an Animal, so Dog inherits from Animal. Except Rust has no inheritance at all. What do you write instead?",
          body: [
            "Composition and traits, and the language does not give you the option of doing it any other way.",
            "That was a deliberate choice, made after decades of watching inheritance hierarchies age badly. Rust bets that traits plus composition covers everything inheritance was actually used for.",
            "Shared BEHAVIOUR goes in a trait, with default method bodies. One required method can give you dozens for free — that is exactly how `Iterator` works: implement `next`, and you get `map`, `filter`, `take`, `sum` and about seventy more.",
            "Shared DATA goes in a field. A `RobotDog` holds a `Voice`, and you write a short method forwarding to it. There is no `extends` to grab everything by accident.",
            "For 'this thing is one of several kinds', use an `enum` rather than a class hierarchy. `enum Shape { Circle(f64), Square(f64) }` holds any one of them, and `match` over it is checked for completeness — add a variant and every match that does not handle it fails to compile.",
            "That completeness check is what a class hierarchy cannot give you. With subclasses, adding a new one compiles fine and quietly falls through every `if instanceof` chain in the codebase.",
            "The rule of thumb: closed set of kinds, known in advance? An enum. Open set, extensible by others? A trait. Sharing data? A field.",
          ],
          predict: {
            ask: "Why does adding a variant to this enum cause compile errors elsewhere?",
            code: `enum Shape { Circle(f64), Square(f64) }

fn area(s: &Shape) -> f64 {
    match s {
        Shape::Circle(r) => 3.14 * r * r,
        Shape::Square(a) => a * a,
    }
}`,
            choices: [
              { text: "It does not — the match falls through", why: "A Rust match must handle every possibility, so an unhandled variant is a compile error rather than a silent gap." },
              { text: "match must cover every variant, so every match needs updating", why: "Correct. Adding Shape::Triangle makes this match non-exhaustive and it fails to compile — pointing you at every place that needs the new case. A class hierarchy would have compiled and silently done the wrong thing." },
              { text: "Enums cannot be extended at all", why: "They can be extended by editing the enum. The point is that doing so forces every match to be revisited." },
              { text: "Because f64 does not implement Eq", why: "No equality is involved here — the match is on which variant, not on the value inside." },
            ],
            answer: 1,
          },
          example: `// shared BEHAVIOUR: a trait with default bodies
trait Speak {
    fn sound(&self) -> String;              // the one you must write

    fn speak_twice(&self) -> String {       // free, from that one
        format!("{} {}", self.sound(), self.sound())
    }
}

struct Dog;
impl Speak for Dog {
    fn sound(&self) -> String { "woof".into() }
}

// shared DATA: a field, and a short forwarding method
struct Voice { sound: String }
impl Voice {
    fn speak(&self) -> &str { &self.sound }
}

struct RobotDog { voice: Voice, battery: u32 }
impl RobotDog {
    fn speak(&self) -> &str { self.voice.speak() }   // has-a
}

// "one of several kinds": an enum, checked for completeness
enum Shape {
    Circle(f64),
    Square(f64),
}

fn area(s: &Shape) -> f64 {
    match s {
        Shape::Circle(r) => std::f64::consts::PI * r * r,
        Shape::Square(a) => a * a,
        // add a variant and this fails to compile. That is the feature
    }
}`,
          notes: [
            { token: "no inheritance", meaning: "a deliberate omission. Traits and fields instead" },
            { token: "default trait methods", meaning: "one required method can give you dozens" },
            { token: "an enum + match", meaning: "closed set of kinds, checked for completeness" },
            { token: "trait vs enum", meaning: "open and extensible, versus closed and known" },
          ],
          prompt:
            "Give RobotDog a Voice field and a speak method that forwards to it.",
          starter: `struct RobotDog {
    : Voice,
    battery: u32,
}

impl RobotDog {
    fn speak(&self) -> &str { self. }
}`,
          rules: {
            regex: ["voice\\s*:\\s*Voice", "self\\.voice\\.speak\\s*\\(\\s*\\)"],
            hint: "voice: Voice as the field, and self.voice.speak() inside the method.",
            success:
              "Correct. RobotDog now exposes exactly one thing from Voice — which is the difference between composition and inheritance: you choose what to pass through rather than getting everything by default.",
          },
          solution: `struct RobotDog {
    voice: Voice,
    battery: u32,
}

impl RobotDog {
    fn speak(&self) -> &str { self.voice.speak() }
}`,
        },
      },
    },
  ],
};
