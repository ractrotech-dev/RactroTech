import type { TopicLesson } from "@/lib/dsa/lessons/types";
import { traceBoundary, traceLayers, traceScaling } from "@/lib/dsa/viz/traceLang";

// Language track, topic 17 — the last one.
//
// The least language-specific topic in the whole track. The ideas are identical
// in all six; what differs is what the language gives you to ENFORCE them, and
// that turns out to vary a great deal.

export const LANG_ARCHITECTURE: TopicLesson = {
  id: "lang-architecture",
  title: "Architecture",
  tagline: "Structuring something bigger than one file.",
  why:
    "Every codebase that lasts becomes hard to change, and the reason is almost always the same: everything came to depend on everything. Architecture is the small number of habits that stop that — and they are the same in all six languages, which is why this is the last topic rather than the first.",
  plain: [
    "Dependencies should point one way. A loop between two pieces makes them one piece.",
    "What crosses a boundary should be a type you chose to expose, not your internal one.",
    "Validate at the edge, and trust your types inside it.",
    "Get the modules right before you consider services.",
  ],
  needs: ["Files & Modules.", "Objects & Types, especially interfaces.", "Databases and Networking for the boundaries."],
  traps: [
    "A dependency cycle. Two pieces that reference each other cannot be understood, tested or replaced separately.",
    "Serialising your internal type at an API boundary. Every field becomes public, and every rename breaks a client.",
    "Splitting into services to solve a code problem. Services solve organisational problems and add network ones.",
    "Abstracting before you have two cases. An interface with one implementation is a guess about the future.",
    "Sharing a database between services. That is one system with extra network calls in it.",
  ],
  sections: [
    /* --------------------------------------------------------- layers -- */
    {
      id: "layers",
      kicker: "01",
      title: "Which way the arrows point",
      hook:
        "You want to swap the database. Six weeks later you are still finding places that mention SQL. What went wrong at the start?",
      body: [
        "The dependencies did not point one way. Storage details reached into the business rules, so replacing storage means touching everything.",
        "The rule is short: dependencies point INWARD, towards the things that change least. The web layer knows about services; services know about storage; storage knows about none of them.",
        "That gives you three properties worth having. Each layer can be understood alone, tested alone, and replaced alone.",
        "A CYCLE destroys all three at once. If two pieces reference each other they are one piece, whatever the file layout says — you cannot read either without the other.",
        "The fix for a needed backwards reference is to INVERT it. The lower layer declares an interface for what it needs, and something above provides an implementation.",
        "That is what dependency inversion means, and it is worth understanding rather than memorising: the interface belongs to the layer that USES it, not the one that implements it.",
        "C++ enforces almost none of this, and gives you one useful signal. A cyclic `#include` will not compile without include guards, and even with them a cycle produces incomplete types and confusing errors.",
        "So use FORWARD DECLARATIONS to break include cycles, keep implementation details out of headers, and consider the pimpl idiom when a header is dragging half the codebase along with it.",
      ],
      predict: {
        ask: "What is the practical test for whether your layers are separated?",
        code: `// three modules: web, service, storage`,
        choices: [
          { text: "Whether each is in its own directory", why: "Directories describe where files are and say nothing about what references what." },
          { text: "Whether you can draw the dependencies without a loop", why: "Correct. A loop means the pieces cannot be understood, tested or replaced separately, whatever the directory structure suggests. Drawing the arrows takes ten minutes and tells you where the pain will be." },
          { text: "Whether each has its own tests", why: "Tests are a consequence — you can only test a layer alone if nothing above it is required to build it." },
          { text: "Whether the files are small", why: "Size is unrelated. A small file with a cyclic dependency is still tangled." },
        ],
        answer: 1,
      },
      viz: traceLayers(),
      example: `// storage declares what it NEEDS. The interface belongs here
// storage/notifier.h
struct Notifier {
  virtual void send(const string& to, const string& msg) = 0;
  virtual ~Notifier() = default;
};

// storage/user_store.h — depends on the interface, not on services
class UserStore {
  Notifier& notifier_;                    // provided from above
 public:
  explicit UserStore(Notifier& n) : notifier_(n) {}
  void save(const User& u);
};

// service/email_notifier.h — the service layer IMPLEMENTS it
class EmailNotifier : public Notifier {
  void send(const string& to, const string& msg) override;
};

// now neither points at the other. Both point at the interface

// break an include cycle with a forward declaration
class Order;                              // no #include needed
class Customer {
  vector<Order*> orders_;                 // a pointer needs no definition
};

// keep implementation out of the header — pimpl
class Engine {
  struct Impl;                            // defined only in the .cpp
  std::unique_ptr<Impl> impl_;
 public:
  Engine();
  ~Engine();                              // must be in the .cpp
};

// the practical test: draw the arrows. Is there a loop?`,
      notes: [
        { token: "the interface belongs to the user", meaning: "not to the implementer. That is the inversion" },
        { token: "a cycle", meaning: "two pieces that reference each other are one piece" },
        { token: "forward declaration", meaning: "breaks an include cycle. A pointer needs no definition" },
        { token: "pimpl", meaning: "keeps a header from dragging the codebase along" },
      ],
      challenge: {
        prompt:
          "Break the include cycle: Customer only holds pointers to Order, so it needs no definition of it.",
        starter: `// customer.h
#include "order.h"

class Customer {
  vector<Order*> orders_;
};`,
        rules: {
          regex: ["class\\s+Order\\s*;"],
          mustNot: ["#include \"order.h\""],
          hint: "Replace the include with a forward declaration: class Order;",
          success:
            "Correct. A pointer or a reference needs only the NAME of a type; the definition is required when you store one by value, call a method, or take its size.",
        },
        solution: `// customer.h
class Order;

class Customer {
  vector<Order*> orders_;
};`,
      },

      alt: {
        c: {
          body: [
            "The dependencies did not point one way. Storage details reached into everything, so replacing storage means touching everything.",
            "C gives you less enforcement than any of the six and, oddly, better habits — because the header/source split makes the boundary physical.",
            "A header is your interface. A .c file is your implementation. Everything not in the header is invisible to other files if you mark it `static`, which is real encapsulation at the linker level.",
            "So the discipline is: put in the header only what callers need, and make everything else static. That is stronger than a naming convention, because the linker enforces it.",
            "An OPAQUE POINTER is the strongest form. Declare `typedef struct Store Store;` in the header without the definition, and callers can hold a `Store *` and pass it around while being physically unable to see inside it.",
            "That is how `FILE *` works, and how most well-designed C libraries expose their types. Changing the struct's fields then breaks nothing, because nobody could depend on them.",
            "For dependency inversion, the tool is the function-pointer struct from the Functional topic. The lower layer declares a struct of operations it needs; the caller fills it in.",
            "Include cycles are broken with forward declarations — `struct Order;` — which is enough for a pointer. And include guards are mandatory regardless.",
          ],
          predict: {
            ask: "What does this header let callers do?",
            code: `/* store.h */
typedef struct Store Store;      /* no definition */

Store *store_open(const char *path);
int    store_get(Store *s, const char *key, char *out);
void   store_close(Store *s);`,
            choices: [
              { text: "Nothing useful — they cannot use an incomplete type", why: "They can hold and pass a pointer to it, which is all these functions require." },
              { text: "Hold and pass a Store*, while being physically unable to see or depend on its fields", why: "Correct. That is an opaque pointer: the compiler allows a pointer to an incomplete type, so callers can use the API while the struct's layout stays entirely private. Changing the fields breaks nothing." },
              { text: "Only if they also include the .c file", why: "That would defeat the purpose. The API is complete as it stands." },
              { text: "Allocate a Store on the stack", why: "That needs the size, which is exactly what an opaque pointer withholds — allocation has to go through store_open." },
            ],
            answer: 1,
          },
          example: `/* the header IS the interface. Everything else is private */

/* store.h — an OPAQUE pointer. Callers cannot see inside */
#ifndef STORE_H
#define STORE_H

typedef struct Store Store;          /* declared, not defined */

Store *store_open(const char *path);
int    store_get(Store *s, const char *key, char *out, size_t n);
void   store_close(Store *s);

#endif

/* store.c — the definition lives here, and only here */
struct Store {
  int fd;
  char *buffer;                      /* nobody outside can depend on this */
};

static int reload(Store *s) { }      /* static = invisible to the linker */

/* dependency inversion: a struct of operations the caller fills in */
typedef struct {
  void (*send)(const char *to, const char *msg, void *user);
  void *user;
} Notifier;

/* storage declares what it NEEDS, and knows nothing about email */
int store_save(Store *s, const User *u, const Notifier *n);

/* break an include cycle with a forward declaration */
struct Order;                        /* enough for a pointer */
typedef struct { struct Order **orders; } Customer;

/* the practical test: draw the arrows. Is there a loop? */`,
          notes: [
            { token: "the header is the interface", meaning: "the .c file is private. The linker enforces it" },
            { token: "static", meaning: "invisible outside this file. Real encapsulation" },
            { token: "an opaque pointer", meaning: "callers hold it and cannot see inside. Like FILE *" },
            { token: "a struct of function pointers", meaning: "dependency inversion, C-style" },
          ],
          prompt:
            "Declare the type opaquely so callers can hold a pointer without seeing the fields.",
          starter: `/* store.h */
 Store;

Store *store_open(const char *path);`,
          rules: {
            regex: ["typedef\\s+struct\\s+Store\\s+Store\\s*;"],
            hint: "typedef struct Store Store; — with no braces and no fields.",
            success:
              "Correct. The name appears twice for a reason: the first is the struct tag and the second is the typedef name, so callers write `Store *` rather than `struct Store *`.",
          },
          solution: `/* store.h */
typedef struct Store Store;

Store *store_open(const char *path);`,
        },

        python: {
          body: [
            "The dependencies did not point one way. Database details reached into the business rules, so replacing storage means touching everything.",
            "Python enforces nothing here — there are no access modifiers and no compile step to catch a cycle. What it gives you is enough flexibility that the discipline is cheap.",
            "The signal you WILL get is a circular import, and it is worth reading rather than working around. `ImportError: cannot import name X from partially initialized module` means two modules import each other.",
            "The common workaround is to move the import inside a function so it happens later. That works and it hides the problem — the cycle is still there, and it will produce a subtler failure eventually.",
            "The real fix is the same as everywhere: extract what both need into a third module, so both point at it and neither points at the other.",
            "For dependency inversion, `Protocol` is the right tool. The lower layer declares a Protocol for what it needs, and anything with matching methods satisfies it — with no inheritance and no registration.",
            "That is structural typing doing real architectural work: storage can declare `class Notifier(Protocol)` and a service class satisfies it without ever importing storage.",
            "And a package's `__init__.py` is your public API. Export what you mean to expose there, prefix everything else with an underscore, and the convention communicates the boundary even though nothing enforces it.",
          ],
          predict: {
            ask: "What does a circular import actually mean?",
            code: `# orders.py
from billing import charge

# billing.py
from orders import Order

# ImportError: cannot import name 'Order' from
# partially initialized module 'orders'`,
            choices: [
              { text: "A bug in Python's import system", why: "Python is reporting exactly what happened: one module was still executing when the other asked it for a name." },
              { text: "The two modules depend on each other, so neither can finish loading first", why: "Correct. Importing orders starts running it, which imports billing, which imports orders again — still half-executed. Moving the import inside a function hides it; extracting the shared part into a third module fixes it." },
              { text: "The import order is wrong", why: "There is no order that works: each needs the other to be finished before it can finish." },
              { text: "A missing __init__.py", why: "That produces a different error entirely. This one is specifically about a partially initialised module." },
            ],
            answer: 1,
          },
          example: `# a circular import is Python telling you about a cycle
# orders.py:  from billing import charge
# billing.py: from orders import Order
# ImportError: partially initialized module

# the workaround HIDES it — the cycle is still there
def process():
    from billing import charge      # imported late
    charge()

# the fix: extract what both need into a third module
# models.py
@dataclass
class Order: ...

# orders.py:  from models import Order
# billing.py: from models import Order        ← neither imports the other

# dependency inversion with a Protocol — no inheritance needed
from typing import Protocol

# storage declares what it NEEDS
class Notifier(Protocol):
    def send(self, to: str, message: str) -> None: ...

class UserStore:
    def __init__(self, notifier: Notifier) -> None:
        self._notifier = notifier          # provided from above

# any class with a matching send() satisfies it, and never
# has to import storage

# a package's __init__.py IS your public API
# myapp/storage/__init__.py
from ._store import UserStore
__all__ = ["UserStore"]

# _store.py is private by convention. Nothing enforces it,
# and everyone reads it the same way

# the practical test: draw the arrows. Is there a loop?
# and there are tools: pydeps, or import-linter in CI`,
          notes: [
            { token: "a circular import", meaning: "Python telling you about a dependency cycle" },
            { token: "a late import", meaning: "hides the cycle rather than fixing it" },
            { token: "Protocol", meaning: "inversion with no inheritance and no import" },
            { token: "__init__.py + __all__", meaning: "your public API, by convention" },
          ],
          prompt:
            "Declare what storage needs as a Protocol, so a provider satisfies it without inheriting anything.",
          starter: `from typing import Protocol

class Notifier():
    def send(self, to: str, message: str) -> None: ...`,
          rules: {
            regex: ["class\\s+Notifier\\s*\\(\\s*Protocol\\s*\\)"],
            hint: "class Notifier(Protocol):",
            success:
              "Correct, and the direction is the point: storage owns this Protocol and never imports the service that implements it — so the arrow points from the service to storage, not the other way.",
          },
          solution: `from typing import Protocol

class Notifier(Protocol):
    def send(self, to: str, message: str) -> None: ...`,
        },

        java: {
          body: [
            "The dependencies did not point one way. Database details reached into the business rules, so replacing storage means touching everything.",
            "Java gives you more enforcement here than most, and the piece people forget is PACKAGE-PRIVATE visibility — no modifier at all, meaning 'visible within this package'.",
            "That is a real architectural tool. Put an interface and its implementation in the same package, make the interface public and the implementation package-private, and nothing outside can depend on the implementation even by accident.",
            "The Java 9 MODULE SYSTEM goes further: `module-info.java` declares exactly which packages are exported, and the compiler and the runtime both enforce it. A package not exported is invisible outside the module, whatever its classes say.",
            "That is the strongest boundary of the six, and it is under-used because most projects never add a module-info.",
            "For dependency inversion, the interface belongs in the package that USES it. `storage` declares `Notifier`; `email` implements it; `storage` never imports `email`.",
            "Constructor injection is how the implementation arrives, and it needs no framework — a constructor taking the interface is the whole technique. Spring simply automates the wiring.",
            "And a cycle between packages compiles fine in Java, so it needs a tool to catch. ArchUnit lets you write dependency rules as ordinary tests, which is the most practical answer.",
          ],
          predict: {
            ask: "Which visibility stops outside code depending on an implementation class?",
            code: `package app.storage;

public interface UserStore { }

??? class PostgresUserStore implements UserStore { }`,
            choices: [
              { text: "public — it needs to be constructible", why: "Public makes it visible everywhere, which is exactly what you are trying to prevent." },
              { text: "No modifier — package-private, so only app.storage can see it", why: "Correct. The interface is public and the implementation is package-private, so callers can only obtain one through a factory in the same package. Nothing outside can name the class, let alone depend on it." },
              { text: "private", why: "private is not allowed on a top-level class — only on nested ones." },
              { text: "protected", why: "protected is also not allowed on a top-level class, and would imply inheritance rather than hiding." },
            ],
            answer: 1,
          },
          example: `// storage declares what it NEEDS. The interface lives HERE
package app.storage;

public interface Notifier {                 // storage owns this
  void send(String to, String message);
}

public interface UserStore { void save(User u); }

// the implementation is PACKAGE-PRIVATE — invisible outside
class PostgresUserStore implements UserStore {
  private final Notifier notifier;

  PostgresUserStore(Notifier notifier) {    // constructor injection
    this.notifier = notifier;
  }
}

// a public factory is the only way in
public final class Storage {
  public static UserStore create(Notifier n) {
    return new PostgresUserStore(n);
  }
}

// the email package IMPLEMENTS it, and storage never imports email
package app.email;
public class EmailNotifier implements app.storage.Notifier { }

// Java 9 modules: the strongest boundary of the six
// module-info.java
module app.storage {
  exports app.storage;              // this package only
  // app.storage.internal is invisible outside, whatever it declares
  requires java.sql;
}

// a package cycle COMPILES in Java. Catch it with a test
// ArchUnit:
@ArchTest
static final ArchRule layers = layeredArchitecture()
    .layer("Web").definedBy("app.web..")
    .layer("Service").definedBy("app.service..")
    .layer("Storage").definedBy("app.storage..")
    .whereLayer("Storage").mayOnlyBeAccessedByLayers("Service");`,
          notes: [
            { token: "package-private", meaning: "no modifier. A real architectural tool" },
            { token: "module-info.java", meaning: "exports exactly what you name. The strongest boundary" },
            { token: "the interface lives with its USER", meaning: "storage owns Notifier; email implements it" },
            { token: "ArchUnit", meaning: "dependency rules as ordinary tests" },
          ],
          prompt:
            "Make the implementation invisible outside its package while keeping the interface public.",
          starter: `public interface UserStore { }

public class PostgresUserStore implements UserStore { }`,
          rules: {
            regex: ["public\\s+interface\\s+UserStore", "(^|\\s)class\\s+PostgresUserStore\\s+implements"],
            mustNot: ["public class PostgresUserStore"],
            hint: "Drop `public` from the class — no modifier means package-private.",
            success:
              "Correct. Package-private is the visibility level people forget exists, and it is the one that makes a package a real unit rather than a folder.",
          },
          solution: `public interface UserStore { }

class PostgresUserStore implements UserStore { }`,
        },

        javascript: {
          body: [
            "The dependencies did not point one way. Database details reached into the business rules, so replacing storage means touching everything.",
            "JavaScript enforces almost nothing. A module's exports are its API and there is no package-private, no module system with export declarations, and no compiler to catch a cycle.",
            "What you get instead is convention plus tooling, and the tooling is good enough to rely on.",
            "ESLint's `import/no-cycle` rule catches dependency cycles. `import/no-restricted-paths` lets you declare that the storage layer may not import from the web layer, and fails the build if it does.",
            "That second rule is worth setting up early. It turns an architectural intention into something the build enforces, which is the only way it survives contact with a deadline.",
            "For the module boundary, an `index.ts` per directory that re-exports the public pieces is the standard pattern — and a restricted-paths rule saying nothing may import past an index makes it real.",
            "ES modules do handle cycles at run time better than CommonJS did, and that is not a reason to have them: a cycle still means the two modules are one unit.",
            "For dependency inversion, a plain function parameter is enough. A storage function taking `notify` as an argument depends on nothing — which in this language is often better than defining an interface at all.",
          ],
          predict: {
            ask: "What makes a layering rule actually hold in a JavaScript codebase?",
            code: `// intention: storage must not import from web`,
            choices: [
              { text: "Writing it in the README", why: "A rule nobody can enforce is a rule that erodes, usually within a month of the first deadline." },
              { text: "A lint rule that fails the build — import/no-restricted-paths", why: "Correct. JavaScript enforces no boundaries, so the only thing that holds is a check running on every commit. ESLint's no-restricted-paths expresses the layering directly and fails CI when it is broken." },
              { text: "Putting them in separate directories", why: "Directories describe location and permit any import between them." },
              { text: "TypeScript's type checker", why: "It checks types rather than which module may import which — that is a lint concern." },
            ],
            answer: 1,
          },
          example: `// no enforcement in the language. Convention plus tooling

// an index per directory is the public API
// storage/index.ts
export { UserStore } from "./user-store.js";
// internal files are not exported, and a lint rule stops
// anyone importing past this file

// dependency inversion needs no interface — a parameter is enough
// storage/user-store.ts
export function makeUserStore(db, notify) {     // notify is injected
  return {
    async save(user) {
      await db.insert(user);
      await notify(user.email, "welcome");
    },
  };
}
// storage depends on a FUNCTION, not on the email module

// with TypeScript, name the shape
type Notify = (to: string, message: string) => Promise<void>;

// the rules that actually hold are the ones in the build
// eslint.config.js
{
  rules: {
    "import/no-cycle": "error",
    "import/no-restricted-paths": ["error", {
      zones: [
        { target: "./src/storage", from: "./src/web" },
        { target: "./src/storage", from: "./src/service" },
      ],
    }],
  },
}

// ES modules survive a cycle at run time better than CommonJS.
// That is not a reason to have one — a cycle still means the two
// modules are one unit

// the practical test: draw the arrows. Is there a loop?
// npx madge --circular src/`,
          notes: [
            { token: "no enforcement", meaning: "convention plus lint rules is all there is" },
            { token: "an index per directory", meaning: "the public API, with a rule stopping imports past it" },
            { token: "import/no-restricted-paths", meaning: "layering, enforced by the build" },
            { token: "a function parameter", meaning: "often better than an interface here" },
          ],
          prompt:
            "Turn the layering intention into a rule the build enforces.",
          starter: `rules: {
  "": "error",
}`,
          rules: {
            regex: ["\"import/no-cycle\"\\s*:\\s*\"error\"|\"import/no-restricted-paths\""],
            hint: "\"import/no-cycle\": \"error\"",
            success:
              "Correct. Adding no-restricted-paths alongside it is the other half: no-cycle catches loops, and restricted-paths expresses which direction the arrows are allowed to point in the first place.",
          },
          solution: `rules: {
  "import/no-cycle": "error",
}`,
        },

        rust: {
          body: [
            "The dependencies did not point one way. Database details reached into the business rules, so replacing storage means touching everything.",
            "Rust enforces more of this than any of the six, and it does it in two places.",
            "Within a crate, everything is PRIVATE by default and `pub` is opt-in. `pub(crate)` is visible inside the crate only, and `pub(super)` only to the parent module — so the module tree is a real visibility hierarchy rather than a naming convention.",
            "Between crates, cycles are IMPOSSIBLE. Cargo will not resolve a dependency graph with a loop in it, so two crates that depend on each other simply cannot be built.",
            "That single fact is a stronger architectural guarantee than anything the other five languages offer, and it is why splitting a Rust project into several crates is such an effective way to enforce layering.",
            "So the practical advice is: when a boundary matters, make it a crate. A workspace with `core`, `storage` and `web` crates cannot develop a cycle, because the build system refuses.",
            "For dependency inversion, a TRAIT in the lower crate is the tool. `storage` defines `trait Notifier`, and `email` implements it for its own type — which works precisely because a trait can be implemented anywhere.",
            "Generic parameters give you static dispatch for free: `struct UserStore<N: Notifier>` monomorphises, so the inversion costs nothing at run time. Use `Box<dyn Notifier>` when the implementation must vary at run time.",
          ],
          predict: {
            ask: "What happens if two crates in a workspace depend on each other?",
            code: `# storage/Cargo.toml
[dependencies]
email = { path = "../email" }

# email/Cargo.toml
[dependencies]
storage = { path = "../storage" }`,
            choices: [
              { text: "It works — Cargo resolves it", why: "Cargo requires an acyclic dependency graph and detects the loop at resolution time." },
              { text: "Cargo refuses to build: cyclic package dependency", why: "Correct. Cargo cannot resolve a graph with a loop, so it fails before compiling anything. That makes crate boundaries the strongest architectural enforcement in any of these six languages." },
              { text: "It compiles with a warning", why: "It is a hard error at dependency resolution, before any compilation happens." },
              { text: "Only if one uses dev-dependencies", why: "A dev-dependency cycle is actually permitted for exactly this reason — and a normal dependency cycle is not." },
            ],
            answer: 1,
          },
          example: `// within a crate: everything is PRIVATE by default
mod storage {
    pub struct UserStore { }              // visible outside
    pub(crate) struct Cache { }           // this crate only
    pub(super) fn helper() { }            // the parent module only
    struct Internal { }                   // this module only
}

// between crates: a cycle is IMPOSSIBLE. Cargo refuses to resolve it
// so when a boundary matters, make it a crate:
//
//   myapp/
//     Cargo.toml        [workspace] members = ["core", "storage", "web"]
//     core/             the types and rules. Depends on nothing
//     storage/          depends on core
//     web/              depends on core and storage

// dependency inversion: the trait lives in the LOWER crate
// storage/src/lib.rs
pub trait Notifier {
    fn send(&self, to: &str, message: &str) -> Result<(), Error>;
}

pub struct UserStore<N: Notifier> {       // generic: no run-time cost
    notifier: N,
}

impl<N: Notifier> UserStore<N> {
    pub fn new(notifier: N) -> Self { Self { notifier } }
}

// email/src/lib.rs — implements storage's trait for its own type
impl storage::Notifier for EmailSender {
    fn send(&self, to: &str, message: &str) -> Result<(), Error> { }
}
// email depends on storage. storage depends on nothing

// when the implementation must vary at run time
pub struct DynStore { notifier: Box<dyn Notifier> }

// the practical test: draw the arrows. And cargo already refuses loops`,
          notes: [
            { token: "private by default", meaning: "pub, pub(crate) and pub(super) are opt-in" },
            { token: "crate cycles are impossible", meaning: "Cargo refuses. The strongest enforcement here" },
            { token: "make the boundary a crate", meaning: "when it genuinely matters" },
            { token: "a generic parameter", meaning: "inversion with no run-time cost" },
          ],
          prompt:
            "Make the cache visible throughout the crate but not to anything outside it.",
          starter: `mod storage {
    pub struct UserStore { }
     struct Cache { }
}`,
          rules: {
            regex: ["pub\\s*\\(\\s*crate\\s*\\)\\s+struct\\s+Cache"],
            hint: "pub(crate) struct Cache { }",
            success:
              "Correct. Rust gives you four levels rather than Java's four with different meanings: private, pub(super), pub(crate) and pub — and the middle two are what make a module tree an actual hierarchy.",
          },
          solution: `mod storage {
    pub struct UserStore { }
    pub(crate) struct Cache { }
}`,
        },
      },
    },

    /* ----------------------------------------------------- boundaries -- */
    {
      id: "boundaries",
      kicker: "02",
      title: "What crosses the line",
      hook:
        "You rename a database column and three mobile apps break. How did a column name become part of a public API?",
      body: [
        "By serialising your internal type. Once the thing you store is the thing you send, every field is public and every rename is a breaking change.",
        "The fix is a separate type at the boundary — a DTO, a response type, a view model. It contains exactly what you meant to expose and nothing else.",
        "That looks like duplication and it is not. The two types answer different questions: one is how you store the data, the other is what you promised to callers.",
        "Once they are separate they change independently. Rename an internal field and only the mapping changes; add a public field and only the response type changes.",
        "It also stops accidental disclosure. A password hash, an internal risk score, a soft-delete flag — all of them leave the building the moment you serialise the whole object.",
        "The same boundary in the other direction is where VALIDATION belongs. Data arriving from outside is not your type until it has been checked.",
        "That one rule removes most of the defensive code from the middle of a program: check at the edge, and inside it trust your types.",
        "In C++ this means a plain struct for the wire format and an explicit conversion function. Verbose, and the verbosity is the boundary being visible.",
      ],
      predict: {
        ask: "Why is a separate response type not duplication?",
        code: `struct User      { string name, email, passwordHash; int riskScore; };
struct UserView  { string name, email; };`,
        choices: [
          { text: "It is duplication, and the cost is worth paying", why: "They are not copies of each other — they answer different questions and change for different reasons." },
          { text: "They change for different reasons — one is storage, one is a promise to callers", why: "Correct. The internal type changes when the storage changes; the view changes when the API contract changes. Two things that change for different reasons should be two types, and merging them means every storage change is an API change." },
          { text: "Because C++ requires it", why: "C++ requires nothing here. Serialising the internal struct would compile perfectly." },
          { text: "Only for security-sensitive fields", why: "The disclosure risk is one reason. Independent evolution is the other, and it applies even when nothing is secret." },
        ],
        answer: 1,
      },
      viz: traceBoundary(),
      example: `// the internal type: how you store it
struct User {
  int64_t id;
  string name;
  string email;
  string passwordHash;        // never leaves
  int riskScore;              // never leaves
  bool softDeleted;
};

// the boundary type: what you promised
struct UserView {
  string name;
  string email;
};

// an explicit mapping — the only place the two meet
UserView toView(const User& u) {
  return UserView{ u.name, u.email };
}

// now a rename touches the mapping and nothing else

// the OTHER direction: validate, then convert to your type
struct CreateUserRequest {    // whatever arrived
  string name;
  string email;
  int age;
};

expected<User, string> validate(const CreateUserRequest& r) {
  if (r.name.empty())            return unexpected("name is required");
  if (r.email.find('@') == string::npos) return unexpected("bad email");
  if (r.age < 0 || r.age > 150)  return unexpected("age out of range");
  return User{ .name = r.name, .email = r.email };
}

// inside the boundary, a User is valid. No defensive checks needed

// the stronger version: make the invalid state unrepresentable
class Email {
  string value_;
  explicit Email(string v) : value_(std::move(v)) {}
 public:
  static expected<Email, string> parse(string v);   // the only way in
  const string& get() const { return value_; }
};`,
      notes: [
        { token: "two types", meaning: "how you store it, and what you promised" },
        { token: "an explicit mapping", meaning: "the only place they meet. A rename touches it alone" },
        { token: "validate at the edge", meaning: "then trust your types inside" },
        { token: "a parse-only type", meaning: "the invalid state cannot be constructed at all" },
      ],
      challenge: {
        prompt:
          "Write the mapping so only the two public fields cross the boundary.",
        starter: `UserView toView(const User& u) {
  return UserView{ };
}`,
        rules: {
          regex: ["UserView\\s*\\{\\s*u\\.name\\s*,\\s*u\\.email\\s*\\}"],
          mustNot: ["u.passwordHash", "u.riskScore"],
          hint: "UserView{ u.name, u.email }",
          success:
            "Correct, and the value shows up the first time somebody adds a field to User: with a mapping, the new field stays internal until you decide otherwise. With direct serialisation it is public immediately.",
        },
        solution: `UserView toView(const User& u) {
  return UserView{ u.name, u.email };
}`,
      },

      alt: {
        c: {
          body: [
            "By serialising your internal struct. Once the thing you store is the thing you send, every field is public and every rename is a breaking change.",
            "In C this is more explicit than anywhere else, because there is no automatic serialisation. You write the conversion by hand, so the boundary is impossible to cross by accident.",
            "That is an advantage worth noticing: nothing can leak a field you did not mention, because nothing writes a field you did not mention.",
            "The pattern is a separate struct for the wire format and a function converting between them. Verbose, and the verbosity IS the boundary.",
            "For the incoming direction, validation is where C needs the most care, because nothing checks anything for you.",
            "Bound every length before copying. Check every numeric range. Reject anything you did not expect rather than ignoring it. A parser that trusts its input is where the security bugs are.",
            "`snprintf` and the size-bounded string functions are what you use, and the return value matters: `snprintf` returns what it WOULD have written, so a return larger than the buffer means the output was truncated.",
            "And keep the parsed result in a type that says it was validated — even a `typedef struct { char email[64]; } ValidEmail;` communicates that the check already happened.",
          ],
          predict: {
            ask: "What does snprintf return?",
            code: `char buf[16];
int n = snprintf(buf, sizeof buf, "%s", input);

if (n >= sizeof buf) { /* ? */ }`,
            choices: [
              { text: "The number of bytes written", why: "It returns what it would have needed, which is how you detect truncation." },
              { text: "The number it WOULD have written — so n >= size means it was truncated", why: "Correct. snprintf never overflows and it does silently truncate, and the return value is how you find out. Ignoring it means silently sending half a value." },
              { text: "0 on success", why: "It returns a length, not a status." },
              { text: "-1 if it does not fit", why: "It returns -1 only on an encoding error. Truncation is reported by a return greater than or equal to the size." },
            ],
            answer: 1,
          },
          example: `/* the internal struct: how you store it */
typedef struct {
  int64_t id;
  char    name[64];
  char    email[128];
  char    password_hash[64];    /* never leaves */
  int     risk_score;           /* never leaves */
} User;

/* the boundary struct: what you promised */
typedef struct {
  char name[64];
  char email[128];
} UserView;

/* an explicit conversion. Nothing can leak a field you did not name */
void to_view(const User *u, UserView *out) {
  snprintf(out->name,  sizeof out->name,  "%s", u->name);
  snprintf(out->email, sizeof out->email, "%s", u->email);
}

/* the OTHER direction: validate everything. Nothing is checked for you */
int validate_user(const char *name, const char *email, int age, User *out) {
  if (!name  || name[0] == '\\0')      return -1;
  if (!email || !strchr(email, '@'))  return -1;
  if (age < 0 || age > 150)           return -1;

  /* bound EVERY copy, and check for truncation */
  if (snprintf(out->name, sizeof out->name, "%s", name) >= (int)sizeof out->name)
    return -1;                  /* too long — reject rather than truncate */

  return 0;
}

/* a type that says the check already happened */
typedef struct { char value[128]; } ValidEmail;
int parse_email(const char *raw, ValidEmail *out);`,
          notes: [
            { token: "written by hand", meaning: "nothing can leak a field you did not name" },
            { token: "bound every copy", meaning: "snprintf with sizeof, always" },
            { token: "check the return", meaning: "n >= size means it was truncated" },
            { token: "a validated type", meaning: "communicates that the check already happened" },
          ],
          prompt:
            "Copy the name safely and reject the input if it did not fit.",
          starter: `if (snprintf(out->name, , "%s", name) >= (int))
  return -1;`,
          rules: {
            regex: ["sizeof\\s+out->name\\s*,\\s*\"%s\"", ">=\\s*\\(int\\)\\s*sizeof\\s+out->name"],
            hint: "sizeof out->name for the bound, and compare the return against it.",
            success:
              "Correct. The cast to int matters: sizeof gives an unsigned size_t, and comparing a signed int against it without the cast makes the comparison unsigned — which turns a negative return into a huge positive one.",
          },
          solution: `if (snprintf(out->name, sizeof out->name, "%s", name) >= (int)sizeof out->name)
  return -1;`,
        },

        python: {
          body: [
            "By serialising your model. Once your ORM object is what the API returns, every column is public and every rename is a breaking change.",
            "The fix is a separate type at the boundary, and Python has an unusually good tool for it: pydantic.",
            "A pydantic model declares the shape, validates incoming data against it, and serialises outgoing data to exactly the fields it declares. One class does both directions of the boundary.",
            "So the pattern is three types rather than one: a request model for what arrives, an internal model or ORM class for what you store, and a response model for what you send.",
            "That sounds heavy and is the thing that makes FastAPI applications pleasant — the request model rejects bad input before your function runs, and the response model cannot leak a field it does not declare.",
            "`response_model` in FastAPI is the important one for disclosure: it FILTERS the returned object down to the declared fields, so returning a full ORM object still only sends what the model names.",
            "For the internal type, a frozen dataclass is often enough. The point is only that it is a different type from the wire format.",
            "And validation belongs at the edge, once. Inside the boundary, code that receives a `User` should not be re-checking whether the email contains an @.",
          ],
          predict: {
            ask: "What does response_model do here?",
            code: `class UserOut(BaseModel):
    name: str
    email: str

@app.get("/users/{id}", response_model=UserOut)
async def get_user(id: int):
    return await db.get_user(id)   # an ORM object with 12 fields`,
            choices: [
              { text: "Nothing — it is documentation for the OpenAPI schema", why: "It generates the schema and it also filters the response at run time." },
              { text: "Filters the returned object down to the declared fields, so the other 10 never leave", why: "Correct. FastAPI validates and serialises the return value through UserOut, so a password hash on the ORM object is not sent even though the function returned it. It also generates the API documentation from the same model." },
              { text: "Converts the ORM object to a dict", why: "It does serialise it, and the filtering to declared fields is what matters here." },
              { text: "It only validates in debug mode", why: "The filtering happens on every response." },
            ],
            answer: 1,
          },
          example: `from pydantic import BaseModel, EmailStr, Field

# what ARRIVES — validated before your function runs
class UserCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    age: int = Field(ge=0, le=150)

# what you STORE — a different type
@dataclass
class User:
    id: int
    name: str
    email: str
    password_hash: str          # never leaves
    risk_score: int             # never leaves

# what you SEND — declares exactly what is public
class UserOut(BaseModel):
    name: str
    email: str

    model_config = {"from_attributes": True}   # build it from an object

# FastAPI ties the three together
@app.post("/users", response_model=UserOut)
async def create(payload: UserCreate):        # rejects bad input first
    user = await store(payload)               # a full User, 6 fields
    return user                               # only 2 are sent

# response_model FILTERS. Returning the whole object is safe

# inside the boundary, trust the type. Do not re-validate the email
def send_welcome(user: User) -> None:
    ...                                       # no defensive checks

# a validated value type, when a plain str is too loose
from pydantic import BaseModel

class Email(BaseModel):
    value: EmailStr`,
          notes: [
            { token: "three types", meaning: "what arrives, what you store, what you send" },
            { token: "response_model", meaning: "filters the response. Extra fields never leave" },
            { token: "Field(ge=0, le=150)", meaning: "the range check, at the edge" },
            { token: "trust inside", meaning: "no defensive re-validation in the middle" },
          ],
          prompt:
            "Declare the outgoing model so only the two public fields can ever be sent.",
          starter: `class UserOut():
    name: str
    email: str`,
          rules: {
            regex: ["class\\s+UserOut\\s*\\(\\s*BaseModel\\s*\\)"],
            hint: "class UserOut(BaseModel):",
            success:
              "Correct, and the filtering is the part worth relying on: even if a handler carelessly returns a full ORM object, only the fields declared here are serialised.",
          },
          solution: `class UserOut(BaseModel):
    name: str
    email: str`,
        },

        java: {
          body: [
            "By serialising your entity. Once your JPA entity is what the API returns, every column is public and every rename is a breaking change.",
            "This is a well-known Java problem with a well-known answer: a separate DTO for the boundary, and a mapping between it and the entity.",
            "`record` makes the DTO cheap. `record UserResponse(String name, String email) {}` is one line and gives you a constructor, accessors, equals and toString.",
            "That removes the main objection to DTOs, which used to be that they were forty lines of boilerplate per type.",
            "Serialising an entity directly has a second Java-specific hazard: LAZY loading. Jackson touching a lazy collection triggers a query, or throws `LazyInitializationException` if the session has closed — which produces confusing failures at the serialisation layer.",
            "For the incoming direction, Bean Validation is the standard tool. `@NotBlank`, `@Email`, `@Min`, `@Max` on the DTO's fields, and `@Valid` on the controller parameter rejects bad input before your method runs.",
            "MapStruct generates the mapping code at compile time from an interface, which is worth it once you have more than a few types. It produces plain Java, so there is no reflection at run time.",
            "And the same rule as everywhere: validate at the edge, then trust the type inside. A service method taking a validated command object should not be re-checking the email format.",
          ],
          predict: {
            ask: "Why is returning a JPA entity from a controller a problem?",
            code: `@GetMapping("/users/{id}")
public User get(@PathVariable Long id) {
  return repo.findById(id).orElseThrow();
}`,
            choices: [
              { text: "It works fine — Jackson handles entities", why: "It serialises them, and what it serialises is every field, and it triggers lazy loads while doing so." },
              { text: "Every field becomes public API, and Jackson touching a lazy collection triggers queries or throws", why: "Correct. The password hash and internal flags are serialised along with everything else, a rename becomes a breaking change, and lazy relations either issue surprise queries or throw LazyInitializationException at the serialisation layer." },
              { text: "Only if the entity has no getters", why: "Jackson uses the getters, which is exactly how it reaches every field." },
              { text: "It is slow", why: "Speed is a minor concern next to disclosure and coupling." },
            ],
            answer: 1,
          },
          example: `// what ARRIVES — validated before the method runs
public record CreateUserRequest(
    @NotBlank @Size(max = 100) String name,
    @Email String email,
    @Min(0) @Max(150) int age
) {}

// what you STORE — the entity
@Entity
class User {
  @Id Long id;
  String name;
  String email;
  String passwordHash;              // never leaves
  int riskScore;                    // never leaves
  @OneToMany(fetch = LAZY) List<Order> orders;   // and never serialise this
}

// what you SEND — one line, thanks to records
public record UserResponse(String name, String email) {
  static UserResponse from(User u) {
    return new UserResponse(u.getName(), u.getEmail());
  }
}

// the controller ties them together
@PostMapping("/users")
public UserResponse create(@Valid @RequestBody CreateUserRequest req) {
  User saved = service.create(req);       // rejected already if invalid
  return UserResponse.from(saved);        // only two fields leave
}

// @Valid is what runs the annotations. Without it they do nothing

// MapStruct generates the mapping at COMPILE time — no reflection
@Mapper
public interface UserMapper {
  UserResponse toResponse(User user);
}

// inside the boundary, trust the type. No defensive re-checking`,
          notes: [
            { token: "a record DTO", meaning: "one line. Removes the old boilerplate objection" },
            { token: "never serialise an entity", meaning: "every field is public, and lazy loads fire" },
            { token: "@Valid", meaning: "what actually runs the annotations. Without it they do nothing" },
            { token: "MapStruct", meaning: "generates the mapping at compile time" },
          ],
          prompt:
            "Make the controller validate the incoming body before the method body runs.",
          starter: `@PostMapping("/users")
public UserResponse create( @RequestBody CreateUserRequest req) {
  ...
}`,
          rules: {
            regex: ["@Valid\\s+@RequestBody\\s+CreateUserRequest|@RequestBody\\s+@Valid\\s+CreateUserRequest"],
            hint: "@Valid alongside @RequestBody.",
            success:
              "Correct, and it is easy to miss: the constraint annotations on the record do nothing at all without @Valid on the parameter, so the validation silently never runs.",
          },
          solution: `@PostMapping("/users")
public UserResponse create(@Valid @RequestBody CreateUserRequest req) {
  ...
}`,
        },

        javascript: {
          body: [
            "By returning your database row. `res.json(user)` sends every column, and once a client depends on a field name, renaming it is a breaking change.",
            "This is easier to do accidentally in JavaScript than anywhere else, because an object is an object and `res.json` takes whatever you hand it.",
            "The fix is to build the response explicitly. Pick the fields — `{ name: user.name, email: user.email }` — rather than sending the object.",
            "Do NOT use `delete user.passwordHash` before sending. It works and it is a denylist, so every new sensitive field is exposed until somebody remembers to delete it too. Pick what goes out, do not remove what should not.",
            "For the incoming direction, this ecosystem's answer is a schema library — Zod is the common one — that gives you both a run-time check and a TypeScript type from one declaration.",
            "That matters particularly here because TypeScript's types are erased: `req.body as CreateUser` checks nothing at all, and is the most common mistake in a typed JavaScript codebase.",
            "`z.object({...}).parse(req.body)` is a real check that throws on a bad shape, and `z.infer<typeof Schema>` gives you the type for free.",
            "With TypeScript you can also make the response type explicit and let the compiler catch a leak: declaring the function's return type as `UserResponse` makes returning a full user a compile error.",
          ],
          predict: {
            ask: "Why is delete the wrong way to strip sensitive fields?",
            code: `const user = await db.getUser(id);
delete user.passwordHash;
res.json(user);`,
            choices: [
              { text: "delete is slow on objects", why: "It does deoptimise the object shape, and that is a minor concern next to the security problem." },
              { text: "It is a denylist — every new sensitive field is exposed until someone remembers to delete it too", why: "Correct. Adding a resetToken column to the table immediately puts it in every API response. Build the response from an allowlist of fields instead, and a new column stays internal by default." },
              { text: "It mutates the object", why: "It does mutate a shared object, which is a real second problem. The denylist is the primary one." },
              { text: "It does not work on nested fields", why: "It works on the property named. The problem is what it does not name." },
            ],
            answer: 1,
          },
          example: `// NEVER — sends every column
res.json(user);

// and NEVER this either — a denylist. Every new field is exposed
delete user.passwordHash;
res.json(user);

// pick what goes out. An allowlist
function toUserResponse(user) {
  return { name: user.name, email: user.email };
}
res.json(toUserResponse(user));

// with TypeScript the compiler enforces it
type UserResponse = { name: string; email: string };

function toUserResponse(u: User): UserResponse {
  return { name: u.name, email: u.email };
}

// INCOMING: `as` checks nothing. TypeScript's types are erased
// const body = req.body as CreateUser;      // hope

// a schema gives you a run-time check AND the type
import { z } from "zod";

const CreateUser = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().int().min(0).max(150),
});

type CreateUser = z.infer<typeof CreateUser>;   // the type, for free

app.post("/users", async (req, res) => {
  const parsed = CreateUser.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.issues);

  const user = await createUser(parsed.data);   // now trusted
  res.json(toUserResponse(user));
});

// inside the boundary, trust the type. No defensive re-checking`,
          notes: [
            { token: "res.json(user)", meaning: "sends every column. Never do it" },
            { token: "delete field", meaning: "a denylist. Every new field leaks by default" },
            { token: "as CreateUser", meaning: "checks nothing. Types are erased" },
            { token: "z.infer<typeof S>", meaning: "one declaration, a check and a type" },
          ],
          prompt:
            "Build the response from an allowlist rather than removing fields from the object.",
          starter: `delete user.passwordHash;
res.json(user);`,
          rules: {
            regex: ["res\\.json\\s*\\(\\s*\\{\\s*name\\s*:\\s*user\\.name\\s*,\\s*email\\s*:\\s*user\\.email\\s*\\}\\s*\\)"],
            mustNot: ["delete user."],
            hint: "res.json({ name: user.name, email: user.email })",
            success:
              "Correct, and the difference shows up the day somebody adds a column: with an allowlist the new field stays internal until you decide otherwise, and with delete it is public immediately.",
          },
          solution: `res.json({ name: user.name, email: user.email });`,
        },

        rust: {
          body: [
            "By deriving `Serialize` on your internal struct. Once the type you store is the type you send, every field is public and every rename is a breaking change.",
            "Rust makes the fix cheap and gives you something the others do not: `#[derive(Serialize)]` is opt-in per type, so a struct without it CANNOT be accidentally serialised.",
            "That is a meaningful default. In Python or JavaScript any object can be handed to a serialiser; in Rust it has to have been declared serialisable.",
            "The pattern is the same three types: a request type deriving `Deserialize`, an internal type deriving neither, and a response type deriving `Serialize`.",
            "For the incoming direction, `serde` already does structural validation: a missing field or a wrong type is a deserialisation error before your code sees it.",
            "For value-level rules — an age between 0 and 150, a non-empty name — the `validator` crate adds attributes, or you write a `try_from` conversion.",
            "The strongest version is the one from Error Handling: parse into a type that CANNOT hold an invalid value. An `Email` newtype whose only constructor validates means every function taking an `Email` knows it is valid, enforced by the compiler.",
            "That is the deepest form of 'validate at the edge': the check happens once, in one place, and the type system carries the guarantee everywhere else for free.",
          ],
          predict: {
            ask: "What stops this internal struct from being serialised by accident?",
            code: `struct User {
    name: String,
    password_hash: String,
}`,
            choices: [
              { text: "Nothing — serde can serialise any struct", why: "serde works through a trait that has to be implemented, and derive is what implements it." },
              { text: "It does not derive Serialize, so no serialiser will accept it — it will not compile", why: "Correct. Serialization goes through the Serialize trait, and without the derive the type does not implement it. Passing it to Json(...) is a compile error rather than a leak." },
              { text: "The fields are private", why: "Field privacy affects who can read them in code, not whether the type can be serialised." },
              { text: "Only if you add #[serde(skip)]", why: "skip is for excluding a field from a type that IS serialisable. Here the whole type is not." },
            ],
            answer: 1,
          },
          example: `use serde::{Deserialize, Serialize};

// what ARRIVES — Deserialize only
#[derive(Deserialize)]
pub struct CreateUser {
    pub name: String,
    pub email: String,
    pub age: u8,
}

// what you STORE — NEITHER derive. It cannot be serialised at all
pub struct User {
    pub id: i64,
    pub name: String,
    pub email: Email,
    password_hash: String,        // private AND unserialisable
    risk_score: i32,
}

// what you SEND — Serialize only
#[derive(Serialize)]
pub struct UserResponse {
    pub name: String,
    pub email: String,
}

impl From<&User> for UserResponse {
    fn from(u: &User) -> Self {
        Self { name: u.name.clone(), email: u.email.as_str().into() }
    }
}

// handing a User to Json(...) is a COMPILE error, not a leak

// the strongest validation: a type that cannot hold an invalid value
pub struct Email(String);

impl Email {
    pub fn parse(raw: &str) -> Result<Self, String> {
        if !raw.contains('@') { return Err("bad email".into()); }
        Ok(Email(raw.to_string()))
    }
    pub fn as_str(&self) -> &str { &self.0 }
}

// the field is private, so Email::parse is the ONLY way to make one.
// Every function taking an Email knows it is valid — enforced

// serde already rejects a missing field or a wrong type.
// The validator crate adds value-level rules on top`,
          notes: [
            { token: "derive is opt-in", meaning: "no derive means it cannot be serialised at all" },
            { token: "three types", meaning: "Deserialize, neither, Serialize" },
            { token: "a private field", meaning: "makes parse the only constructor" },
            { token: "parse, do not validate", meaning: "the check happens once. The type carries it" },
          ],
          prompt:
            "Give each boundary type only the derive it needs, so the internal one cannot be sent.",
          starter: `#[derive()]
pub struct CreateUser { pub name: String }

#[derive()]
pub struct UserResponse { pub name: String }`,
          rules: {
            regex: ["#\\[derive\\s*\\(\\s*Deserialize\\s*\\)\\s*\\]\\s*pub\\s+struct\\s+CreateUser", "#\\[derive\\s*\\(\\s*Serialize\\s*\\)\\s*\\]\\s*pub\\s+struct\\s+UserResponse"],
            hint: "Deserialize on the incoming type, Serialize on the outgoing one.",
            success:
              "Correct, and deriving both on everything would throw the guarantee away — the point is that a type without Serialize is one the compiler will not let you send.",
          },
          solution: `#[derive(Deserialize)]
pub struct CreateUser { pub name: String }

#[derive(Serialize)]
pub struct UserResponse { pub name: String }`,
        },
      },
    },

    /* --------------------------------------------------------- growth -- */
    {
      id: "growth",
      kicker: "03",
      title: "When it gets big",
      hook:
        "The codebase is a hundred thousand lines and two teams keep colliding. Somebody suggests splitting it into services. Is that the right move?",
      body: [
        "Probably not yet. The problem described is a lack of boundaries INSIDE the program, and services are an expensive way to get boundaries.",
        "The cheap way is modules. Same program, same deployment, same database — with real internal boundaries and dependencies that point one way.",
        "That step costs nothing at run time and solves most of the problem, and it is almost always skipped. A function call between modules is still a function call.",
        "Services are for ORGANISATIONAL problems: different teams with different release cycles, or one part of the system needing to scale differently from the rest.",
        "They are not a solution to tangled code. A tangled system split into services becomes a distributed tangled system, which is strictly worse.",
        "And every function call that crosses a service boundary becomes a network call. It can fail, be slow, arrive twice, or succeed while the reply is lost — and all four are now your problem.",
        "You also lose the transaction. Two services with two databases cannot commit together, so 'both or neither' becomes something you implement, with retries and idempotency and reconciliation.",
        "So the order is: one program, then modules inside it, then services if you genuinely must. A clean module becomes a service in an afternoon; a tangled one cannot become anything.",
      ],
      predict: {
        ask: "Which of these is a good reason to split into services?",
        code: `// A: the codebase is tangled and hard to change
// B: two teams have different release cycles and one component
//    needs ten times the machines`,
        choices: [
          { text: "Both", why: "Splitting a tangled system produces a distributed tangled system, with network calls between the tangles." },
          { text: "Only B", why: "Correct. Services solve organisational and scaling problems — independent deployment and independent capacity. They do not untangle code; they add network failures on top of whatever tangle already exists. Fix A with modules." },
          { text: "Only A", why: "It is the case services help least with, and the one they are most often used to attempt." },
          { text: "Neither — services are never worth it", why: "B is a genuine reason, and at some organisational size it becomes the right call." },
        ],
        answer: 1,
      },
      viz: traceScaling(),
      example: `// step 1: one program. Where everything should start

// step 2: MODULES inside it. Real boundaries, no run-time cost
//   src/orders/     public: orders.h    private: everything else
//   src/billing/
//   src/shared/
//
// enforced by: what is in the headers, and the build graph

// in CMake, a module is a target and the dependencies are declared
add_library(shared  shared/shared.cpp)
add_library(orders  orders/orders.cpp)
add_library(billing billing/billing.cpp)

target_link_libraries(orders  PRIVATE shared)
target_link_libraries(billing PRIVATE shared)
// orders does NOT link billing. The build enforces the arrow

target_include_directories(orders PUBLIC orders/include)
// only include/ is visible to others — the rest is private

// step 3: SERVICES, when the reason is organisational.
// and then every call between them can:
//   fail, be slow, arrive twice, or succeed with the reply lost
//
// and you lose:
//   one transaction, one deployment, one stack trace
//
// and you now need:
//   tracing, retries with backoff, idempotency keys, reconciliation

// a clean module becomes a service in an afternoon.
// a tangled one cannot become anything`,
      notes: [
        { token: "modules first", meaning: "no run-time cost, and it solves most of it" },
        { token: "target_link_libraries", meaning: "the build graph enforces the arrows" },
        { token: "PUBLIC include dir", meaning: "only that is visible. The rest is private" },
        { token: "services for organisation", meaning: "not for untangling code" },
      ],
      challenge: {
        prompt:
          "Declare the dependency so orders can use shared, without exposing shared to everything that links orders.",
        starter: `target_link_libraries(orders  shared)`,
        rules: {
          regex: ["target_link_libraries\\s*\\(\\s*orders\\s+PRIVATE\\s+shared\\s*\\)"],
          hint: "PRIVATE — orders uses shared internally, and does not pass it on.",
          success:
            "Correct. PUBLIC would mean anything linking orders also gets shared on its include path — which quietly turns an implementation detail into part of orders' interface.",
        },
        solution: `target_link_libraries(orders PRIVATE shared)`,
      },

      alt: {
        c: {
          body: [
            "Probably not yet. The problem described is a lack of boundaries inside the program, and services are an expensive way to get boundaries.",
            "C's version of a module is a directory of .c files with one public header, and it is more effective than it sounds — because `static` and the linker do real enforcement.",
            "The rule: one header per module, containing only what other modules need. Everything else `static` in the .c files, and the linker makes it invisible.",
            "For the strongest boundary, compile each module into a static library and declare the link dependencies. A module that does not link another cannot call it, and the linker says so.",
            "That gives you a genuinely enforced dependency graph, which is more than Python or JavaScript manage without extra tooling.",
            "C also has an option the others do not: a SHARED LIBRARY with an explicit symbol visibility list. `-fvisibility=hidden` plus explicit exports means only the functions you named are reachable at all.",
            "Before considering services, there is a cheaper step C makes easy: separate PROCESSES on the same machine, communicating over a pipe or a Unix socket. Real isolation, no network, and a crash in one does not take the other down.",
            "That is how a great deal of long-lived C software is structured, and it gets you most of the isolation benefit of services without any of the distributed-systems cost.",
          ],
          predict: {
            ask: "What does -fvisibility=hidden do to a shared library?",
            code: `cc -fvisibility=hidden -shared -o libapp.so *.c

__attribute__((visibility("default")))
int app_start(void);`,
            choices: [
              { text: "Nothing — all non-static functions are exported anyway", why: "That is the DEFAULT behaviour, and this flag inverts it." },
              { text: "Hides every symbol except the ones explicitly marked default", why: "Correct. By default every non-static function in a shared library is exported. With -fvisibility=hidden only the ones you mark are, which makes the library's API exactly what you declared rather than everything you happened not to make static." },
              { text: "Makes the library smaller only", why: "It does reduce the symbol table and speed up loading, and the API control is the main point." },
              { text: "Prevents static linking", why: "It affects symbol visibility in the shared object and does not stop static linking." },
            ],
            answer: 1,
          },
          example: `/* a module: one public header, everything else static */

/* orders/orders.h — the ONLY thing others include */
#ifndef ORDERS_H
#define ORDERS_H
typedef struct Order Order;               /* opaque */
Order *order_create(int64_t customer_id);
#endif

/* orders/orders.c */
struct Order { ... };                     /* private */
static int validate(const Order *o) { }   /* invisible to the linker */

/* the build enforces the graph. A module that does not link
   another cannot call it, and the linker says so */
#   libshared.a
#   liborders.a   links shared
#   libbilling.a  links shared
#   orders does NOT link billing

/* a shared library with an explicit API */
cc -fvisibility=hidden -shared -o libapp.so *.c

__attribute__((visibility("default")))
int app_start(void);                      /* only this is exported */

/* the step BEFORE services, and it is often enough:
   separate PROCESSES on one machine, over a pipe or a Unix socket */
int fds[2];
socketpair(AF_UNIX, SOCK_STREAM, 0, fds);

pid_t pid = fork();
if (pid == 0) { close(fds[0]); worker(fds[1]); _exit(0); }
close(fds[1]);

/* real isolation, no network, and a crash in one does not take
   the other down. This is how a lot of long-lived C software works */`,
          notes: [
            { token: "one header per module", meaning: "static hides the rest, at the linker" },
            { token: "the link graph", meaning: "a real, enforced dependency graph" },
            { token: "-fvisibility=hidden", meaning: "only the symbols you mark are exported" },
            { token: "separate processes", meaning: "isolation without the network. Often enough" },
          ],
          prompt:
            "Hide every symbol by default and export only the one you name.",
          starter: `cc  -shared -o libapp.so *.c

__attribute__(((""))) 
int app_start(void);`,
          rules: {
            regex: ["-fvisibility=hidden", "visibility\\s*\\(\\s*\"default\"\\s*\\)"],
            hint: "-fvisibility=hidden on the command line, and visibility(\"default\") on the exported function.",
            success:
              "Correct. Without the flag, every non-static function in the library is part of its ABI — including helpers you never intended anyone to call, which then cannot be changed without breaking someone.",
          },
          solution: `cc -fvisibility=hidden -shared -o libapp.so *.c

__attribute__((visibility("default")))
int app_start(void);`,
        },

        python: {
          body: [
            "Probably not yet. The problem described is a lack of boundaries inside the program, and services are an expensive way to get boundaries.",
            "Python's module for this purpose is a PACKAGE — a directory with an `__init__.py` exporting the public pieces, and underscore-prefixed modules for everything else.",
            "Nothing enforces that, which is the recurring theme. What makes it real is a tool: `import-linter` lets you declare layer contracts and fails CI when one is broken.",
            "That is worth setting up early, because a convention with no enforcement erodes at the first deadline.",
            "For a larger split within one repository, a monorepo of separate installable packages works well — each with its own `pyproject.toml`, depending on the others explicitly.",
            "That gives you a real dependency graph, because a package that does not declare a dependency cannot import it.",
            "Before services, Python has a cheaper isolation step: separate PROCESSES with a queue between them. Celery for background work, or `multiprocessing` for parallelism, both give you isolation without a network protocol.",
            "And the GIL gives Python an unusual reason to reach for processes earlier than other languages would — CPU-bound work needs them regardless, so the isolation often comes for free.",
          ],
          predict: {
            ask: "What makes a layering rule hold in a Python codebase?",
            code: `# intention: myapp.storage must not import myapp.web`,
            choices: [
              { text: "The underscore convention", why: "Underscores mark a module as internal and do nothing to stop a cross-layer import." },
              { text: "A tool in CI — import-linter with a layers contract", why: "Correct. Python enforces no import restrictions at all, so the only thing that holds is a check that fails the build. import-linter declares the layers in a config file and verifies them on every commit." },
              { text: "Putting them in separate packages", why: "Packages organise code and permit any import between them." },
              { text: "__all__ in __init__.py", why: "__all__ affects wildcard imports only. A direct import of an internal module still works." },
            ],
            answer: 1,
          },
          example: `# a package is the module boundary
# myapp/storage/__init__.py
from ._store import UserStore
__all__ = ["UserStore"]
# _store.py is internal by convention

# nothing ENFORCES that. A tool does
# setup.cfg or .importlinter:
#
# [importlinter]
# root_package = myapp
#
# [importlinter:contract:layers]
# name = layers
# type = layers
# layers =
#     myapp.web
#     myapp.service
#     myapp.storage
#
# run it in CI: lint-imports

# a larger split: a monorepo of installable packages
#   packages/core/pyproject.toml
#   packages/storage/pyproject.toml    dependencies = ["core"]
#   packages/web/pyproject.toml        dependencies = ["core", "storage"]
# a package that does not declare a dependency cannot import it

# BEFORE services: separate processes with a queue between them
from celery import Celery
app = Celery(broker="redis://localhost")

@app.task
def send_welcome(user_id: int): ...

send_welcome.delay(user.id)      # isolation, no network protocol

# and the GIL means CPU-bound work needs processes anyway,
# so the isolation often comes for free
from concurrent.futures import ProcessPoolExecutor

# the order: one program, modules, then services if you must`,
          notes: [
            { token: "a package plus __all__", meaning: "the convention. Nothing enforces it" },
            { token: "import-linter", meaning: "layer contracts, checked in CI" },
            { token: "a monorepo of packages", meaning: "a real, declared dependency graph" },
            { token: "Celery / processes", meaning: "isolation before services, with no network protocol" },
          ],
          prompt:
            "Export only the public class from the package, and mark what is exported.",
          starter: `# myapp/storage/__init__.py
from ._store import UserStore
 = ["UserStore"]`,
          rules: {
            regex: ["__all__\\s*=\\s*\\[\\s*\"UserStore\"\\s*\\]"],
            hint: "__all__ = [\"UserStore\"]",
            success:
              "Correct, and be clear about what it does: __all__ controls `from myapp.storage import *` and documents the intent. It does not stop anyone importing myapp.storage._store directly — that needs import-linter.",
          },
          solution: `# myapp/storage/__init__.py
from ._store import UserStore
__all__ = ["UserStore"]`,
        },

        java: {
          body: [
            "Probably not yet. The problem described is a lack of boundaries inside the program, and services are an expensive way to get boundaries.",
            "Java has the best answer of the six for the middle step, and it has a name: the MODULAR MONOLITH.",
            "One deployment, one database, and strong internal boundaries — enforced by package-private visibility, by Gradle or Maven modules, or by the Java 9 module system.",
            "Gradle multi-project builds are the practical version. Each module is a subproject with declared dependencies, and a module that does not declare another cannot compile against it.",
            "`implementation` versus `api` matters here: `implementation` means the dependency is internal and is NOT passed on to whoever depends on you, which stops a transitive dependency becoming part of your interface by accident.",
            "For finer control, `module-info.java` exports specific packages and the runtime enforces it — a package not exported is genuinely unreachable, not merely discouraged.",
            "ArchUnit is the tool that makes any of this hold in an existing codebase. Dependency rules as ordinary JUnit tests, so a violation fails the build like any other test failure.",
            "And Spring Modulith is worth knowing: it verifies module boundaries in a Spring application and lets modules talk through events rather than direct calls — which is a rehearsal for extracting one as a service later.",
          ],
          predict: {
            ask: "What is the difference in a Gradle build?",
            code: `dependencies {
  implementation(project(":shared"))   // A
  api(project(":shared"))              // B
}`,
            choices: [
              { text: "None — both add the dependency", why: "They differ in whether the dependency is passed on to consumers of this module." },
              { text: "implementation keeps it internal; api passes it on to anything depending on this module", why: "Correct. With implementation, a module depending on yours cannot see shared's types — so shared stays an implementation detail. With api it becomes part of your public interface, and changing it becomes a breaking change for your consumers." },
              { text: "api is faster to compile", why: "It is the reverse: implementation allows better incremental compilation, because fewer modules need rebuilding when the dependency changes." },
              { text: "implementation is deprecated", why: "It is the recommended default, and api is the one to use deliberately." },
            ],
            answer: 1,
          },
          example: `// the MODULAR MONOLITH: one deployment, strong internal boundaries

// settings.gradle.kts
include(":shared", ":orders", ":billing", ":web")

// orders/build.gradle.kts
dependencies {
  implementation(project(":shared"))   // internal — not passed on
  // NOT billing. The build refuses the import
}

// api would make shared part of orders' public interface —
// and changing shared would then break orders' consumers

// finer control still: the Java 9 module system
// module-info.java
module app.orders {
  exports app.orders.api;            // this package only
  // app.orders.internal is unreachable, enforced at RUN time
  requires app.shared;
}

// make the rules hold in an existing codebase: ArchUnit
@ArchTest
static final ArchRule noCycles =
    slices().matching("app.(*)..").should().beFreeOfCycles();

@ArchTest
static final ArchRule layering = layeredArchitecture().consideringAllDependencies()
    .layer("Web").definedBy("app.web..")
    .layer("Service").definedBy("app.service..")
    .layer("Storage").definedBy("app.storage..")
    .whereLayer("Web").mayNotBeAccessedByAnyLayer()
    .whereLayer("Storage").mayOnlyBeAccessedByLayers("Service");

// Spring Modulith verifies boundaries and lets modules talk by EVENTS
// — which is a rehearsal for extracting one as a service later

// the order: one program, modules, then services if you must`,
          notes: [
            { token: "the modular monolith", meaning: "one deployment, strong internal boundaries" },
            { token: "implementation vs api", meaning: "internal, versus part of your public interface" },
            { token: "module-info exports", meaning: "enforced at run time, not merely discouraged" },
            { token: "ArchUnit", meaning: "makes the rules hold in an existing codebase" },
          ],
          prompt:
            "Depend on shared without making it part of this module's public interface.",
          starter: `dependencies {
  (project(":shared"))
}`,
          rules: {
            regex: ["implementation\\s*\\(\\s*project\\s*\\(\\s*\":shared\"\\s*\\)\\s*\\)"],
            mustNot: ["api(project"],
            hint: "implementation(project(\":shared\"))",
            success:
              "Correct, and it helps the build too: with implementation, changing shared only rebuilds this module rather than everything downstream of it.",
          },
          solution: `dependencies {
  implementation(project(":shared"))
}`,
        },

        javascript: {
          body: [
            "Probably not yet. The problem described is a lack of boundaries inside the program, and services are an expensive way to get boundaries.",
            "This ecosystem reached for services — and for microservices specifically — earlier and more enthusiastically than most, and a good deal of that has since been walked back.",
            "The middle step is a monorepo of workspace packages. npm, pnpm and yarn all support workspaces, and each package declares its dependencies explicitly.",
            "That gives you a real dependency graph: a package that does not declare another cannot import it, because the resolution simply fails.",
            "`turborepo` and `nx` add task orchestration and caching on top, which matters once there are enough packages that building everything is slow.",
            "Within one package, the boundary is an `index.ts` re-exporting the public pieces, plus a lint rule stopping anyone importing past it. That is the cheap version and it works.",
            "Serverless functions are this ecosystem's other split, and they have a specific trap: each one is an independent deployment with its own cold start and its own database connections, so a system of fifty functions has fifty connection pools.",
            "The advice is the same as everywhere. Get the module boundaries right first — a clean module becomes a package, then a service, when there is a real reason.",
          ],
          predict: {
            ask: "What does a workspace give you that separate directories do not?",
            code: `// package.json
{ "workspaces": ["packages/*"] }`,
            choices: [
              { text: "Faster installs only", why: "Deduplicated installs are a benefit, and the dependency graph is the structural one." },
              { text: "A real dependency graph — a package that does not declare another cannot import it", why: "Correct. Each package declares its own dependencies, and resolution fails for an undeclared import. Directories permit any relative import between them; workspaces make the arrows explicit and enforced." },
              { text: "Automatic versioning", why: "Versioning is a separate concern handled by tools like changesets." },
              { text: "It bundles them together", why: "Bundling is a build concern, and the workspace is about resolution and declared dependencies." },
            ],
            answer: 1,
          },
          example: `// step 2: a monorepo of workspace packages
// package.json
{ "workspaces": ["packages/*"] }

// packages/storage/package.json
{
  "name": "@app/storage",
  "dependencies": { "@app/core": "workspace:*" }
  // NOT @app/web. An undeclared import simply fails to resolve
}

// within a package, the boundary is an index plus a lint rule
// packages/storage/src/index.ts
export { UserStore } from "./user-store.js";

// eslint: nothing may import past an index
"import/no-restricted-paths": ["error", {
  zones: [{ target: "./packages/*/src/!(index.ts)", from: "./packages" }],
}]

// turborepo or nx for orchestration and caching, once it is slow

// SERVERLESS is this ecosystem's other split, and it has a trap:
// each function is an independent deployment with its own cold
// start and its own database connections — fifty functions means
// fifty pools. Put a connection proxy in front

// and the general costs of any service split:
//   a call can fail, be slow, arrive twice, or succeed with the
//   reply lost. And you lose one transaction and one stack trace

// the order: one program, modules, then services if you must`,
          notes: [
            { token: "workspaces", meaning: "a real dependency graph. Undeclared imports fail" },
            { token: "an index plus a lint rule", meaning: "the cheap boundary within a package" },
            { token: "serverless", meaning: "each function is a deployment. And a connection pool" },
            { token: "turborepo / nx", meaning: "orchestration and caching, once it is slow" },
          ],
          prompt:
            "Declare the workspace dependency so the import graph is explicit and enforced.",
          starter: `{
  "name": "@app/storage",
  "dependencies": { "@app/core": "" }
}`,
          rules: {
            regex: ["\"@app/core\"\\s*:\\s*\"workspace:\\*\""],
            hint: "\"workspace:*\" — the protocol that resolves to the local package.",
            success:
              "Correct. It resolves to the sibling package rather than to the registry, so a change in core is picked up immediately and the dependency is still recorded explicitly.",
          },
          solution: `{
  "name": "@app/storage",
  "dependencies": { "@app/core": "workspace:*" }
}`,
        },

        rust: {
          body: [
            "Probably not yet. The problem described is a lack of boundaries inside the program, and services are an expensive way to get boundaries.",
            "Rust's middle step is a WORKSPACE of crates, and it is the strongest version of this idea in any of the six languages.",
            "The reason is the one from the first section: Cargo cannot resolve a cyclic dependency graph. Two crates that depend on each other will not build, so the architecture cannot rot in that particular direction.",
            "So the pattern is: one workspace, several crates, dependencies declared in each `Cargo.toml`. `core` depends on nothing, `storage` depends on core, `web` depends on both.",
            "Within a crate, `pub(crate)` and the module tree give you finer boundaries without splitting further.",
            "The costs are real and worth knowing. More crates means more compilation units, which helps incremental builds and hurts a clean build. And a change to a low-level crate rebuilds everything above it.",
            "`[workspace.dependencies]` is worth using: declare shared dependency versions once at the workspace root and have every crate inherit them, so versions cannot drift apart.",
            "Before services, the same cheaper step applies as everywhere: separate processes, or an async task boundary within one process. Rust makes the second unusually cheap, since a task is a few kilobytes.",
          ],
          predict: {
            ask: "Why is a Rust workspace an unusually strong architectural boundary?",
            code: `# Cargo.toml
[workspace]
members = ["core", "storage", "web"]`,
            choices: [
              { text: "Because crates compile separately", why: "Separate compilation helps incremental builds and does not by itself prevent anything." },
              { text: "Cargo cannot resolve a cyclic dependency graph, so the layering cannot rot into a cycle", why: "Correct. Two crates depending on each other fail at dependency resolution, before compilation. No other language here refuses to build a cycle, which makes crate boundaries the one form of layering that cannot silently erode." },
              { text: "Because pub(crate) applies across the workspace", why: "pub(crate) is per crate — which is exactly why a crate boundary is meaningful." },
              { text: "It makes builds faster", why: "It helps incremental builds and slows a clean one. Speed is not the architectural point." },
            ],
            answer: 1,
          },
          example: `# a workspace of crates. Cargo REFUSES a cycle
# Cargo.toml
[workspace]
members = ["core", "storage", "web"]
resolver = "2"

# declare shared versions once, so they cannot drift
[workspace.dependencies]
serde = { version = "1.0", features = ["derive"] }
tokio = { version = "1", features = ["full"] }

# storage/Cargo.toml
[dependencies]
core = { path = "../core" }
serde = { workspace = true }        # inherits the version above
# NOT web. Cargo would refuse the cycle

# core depends on nothing. storage on core. web on both.
# the graph is declared, and a loop will not build

// within a crate, the module tree gives finer boundaries
mod internal {
    pub(crate) fn helper() { }      // this crate only
}

// the costs, honestly:
//   more crates = better incremental builds, slower clean builds
//   a change low down rebuilds everything above it

// BEFORE services: a task boundary in one process is very cheap
let (tx, mut rx) = tokio::sync::mpsc::channel(100);

tokio::spawn(async move {
    while let Some(job) = rx.recv().await { handle(job).await; }
});

tx.send(job).await?;                // isolation, no network

// and if you do split: every call can fail, be slow, arrive twice,
// or succeed with the reply lost. And the transaction is gone

// the order: one program, crates, then services if you must`,
          notes: [
            { token: "a workspace of crates", meaning: "the strongest boundary here. Cycles will not build" },
            { token: "[workspace.dependencies]", meaning: "one version, inherited. No drift" },
            { token: "pub(crate)", meaning: "finer boundaries without splitting further" },
            { token: "a channel and a task", meaning: "isolation before services, and very cheap" },
          ],
          prompt:
            "Inherit the workspace's serde version rather than pinning a separate one in this crate.",
          starter: `# storage/Cargo.toml
[dependencies]
core = { path = "../core" }
serde = { }`,
          rules: {
            regex: ["serde\\s*=\\s*\\{\\s*workspace\\s*=\\s*true\\s*\\}"],
            hint: "serde = { workspace = true }",
            success:
              "Correct. It matters more than it looks in a large workspace: two crates pinning different minor versions of the same dependency compiles both of them, which bloats the binary and can produce type mismatches between crates.",
          },
          solution: `# storage/Cargo.toml
[dependencies]
core = { path = "../core" }
serde = { workspace = true }`,
        },
      },
    },
  ],
};
