import type { TopicLesson } from "@/lib/dsa/lessons/types";
import { traceBisect, traceTestShape, traceToolchain } from "@/lib/dsa/viz/traceLang";

// Language track, topic 16.
//
// The least language-specific topic in the track — the ideas are identical
// everywhere — and the tools differ enough to be worth listing per language,
// because knowing which one the community settled on saves a day of choosing.

export const LANG_ENGINEERING: TopicLesson = {
  id: "lang-engineering",
  title: "Software Engineering",
  tagline: "Tests, tooling, and code somebody else can read.",
  why:
    "The code you write today will be read by somebody who does not remember writing it — quite possibly you, in six months. Tests, a formatter and a type checker are how a codebase stays changeable, and knowing which tools your language settled on saves a day of deciding.",
  plain: [
    "A test is three parts: set it up, do the thing, check the result.",
    "Write many fast tests and a few slow ones.",
    "A formatter ends style arguments; a linter finds suspicious code; a type checker catches whole categories of bug.",
    "To find a bug: reproduce it, narrow it, find where it started, and look at the actual values.",
  ],
  needs: ["Files & Modules, since tooling is configured per project.", "Error Handling — tests are mostly about failures."],
  traps: [
    "Testing implementation rather than behaviour. A test that breaks on every refactor is worse than no test.",
    "Slow tests. A suite taking ten minutes is a suite nobody runs before pushing.",
    "Mocking everything. A test where every dependency is faked proves only that the mocks were called.",
    "Optimising without measuring. The slow part is almost never where you think.",
    "Fixing a bug without a failing test first. You cannot know it is fixed, and it can come back unnoticed.",
  ],
  sections: [
    /* ---------------------------------------------------------- tests -- */
    {
      id: "tests",
      kicker: "01",
      title: "Proving it works",
      hook:
        "You change one function and something unrelated breaks in production two weeks later. What would have caught it?",
      body: [
        "A test that ran in the second before you pushed. That is the whole argument for testing, and it is a practical one rather than a moral one.",
        "Every readable test has three parts. ARRANGE builds what the test needs. ACT does the one thing being tested. ASSERT checks the outcome.",
        "One thing per test. If the act step has two actions, it is two tests — and when it fails you will know which of them broke.",
        "The name is part of the test, because a name is what you read in the failure output. \"withdrawing reduces the balance\" tells you what broke; \"test1\" makes you open the file.",
        "Test BEHAVIOUR, not implementation. A test that asserts a private method was called breaks every time someone refactors, and proves nothing about whether the code works.",
        "C++ has no standard test framework. Catch2 and doctest are header-only and pleasant to start with; GoogleTest is the established heavyweight and has better mocking.",
        "Write many fast tests and few slow ones. A thousand unit tests running in two seconds get run constantly; a suite taking ten minutes gets run once a day, and stops catching things.",
        "And when you fix a bug, write the failing test FIRST. Otherwise you cannot know the fix worked, and nothing stops the bug returning.",
      ],
      predict: {
        ask: "Which of these is the better test?",
        code: `// A
TEST_CASE("withdraw") {
  Account a(100);
  a.withdraw(30);
  REQUIRE(a.recalculateInternalTotal() == 70);
}

// B
TEST_CASE("withdrawing reduces the balance") {
  Account a(100);
  a.withdraw(30);
  REQUIRE(a.balance() == 70);
}`,
        choices: [
          { text: "A — it checks the internals more thoroughly", why: "Checking internals ties the test to how the code works today, so any refactor breaks it without anything being wrong." },
          { text: "B — it names the behaviour and asserts on the public result", why: "Correct. The name says what broke without opening the file, and the assertion is about what the class promises rather than how it achieves it — so the implementation can change freely." },
          { text: "They are equivalent", why: "One survives a refactor and reads as documentation; the other does neither." },
          { text: "A, because recalculating is more accurate", why: "It is more coupled, not more accurate — it asserts on a detail that is nobody's business outside the class." },
        ],
        answer: 1,
      },
      viz: traceTestShape(),
      example: `// no standard framework. Catch2 and doctest are header-only;
// GoogleTest is the established one, with better mocking

#define CATCH_CONFIG_MAIN
#include <catch2/catch_test_macros.hpp>

TEST_CASE("withdrawing reduces the balance") {
  Account account(100);              // arrange

  account.withdraw(30);              // act

  REQUIRE(account.balance() == 70);  // assert
}

// REQUIRE stops the test. CHECK carries on and reports both
TEST_CASE("a new account") {
  Account a(100);
  CHECK(a.balance() == 100);
  CHECK(a.isOpen());                 // still runs if the first fails
}

// exceptions
REQUIRE_THROWS_AS(account.withdraw(500), InsufficientFunds);

// the same test over several inputs
TEST_CASE("even numbers") {
  auto n = GENERATE(2, 4, 6, 100);
  REQUIRE(isEven(n));
}

// shared setup — SECTIONs each get a FRESH copy of what is above
TEST_CASE("account operations") {
  Account a(100);                    // rebuilt for every SECTION

  SECTION("deposit") { a.deposit(50); REQUIRE(a.balance() == 150); }
  SECTION("withdraw") { a.withdraw(50); REQUIRE(a.balance() == 50); }
}

// run them: ctest, or the binary directly`,
      notes: [
        { token: "arrange, act, assert", meaning: "the three parts of every readable test" },
        { token: "REQUIRE vs CHECK", meaning: "stop here, or carry on and report both" },
        { token: "SECTION", meaning: "each one re-runs the setup above it" },
        { token: "test behaviour", meaning: "not internals. Internals change; behaviour is the promise" },
      ],
      challenge: {
        prompt:
          "Write a test with a name that describes the behaviour, and assert on the public result.",
        starter: `TEST_CASE("") {
  Account account(100);

  account.withdraw(30);

  REQUIRE();
}`,
        rules: {
          regex: ["TEST_CASE\\s*\\(\\s*\"[a-z][^\"]{15,}\"\\s*\\)", "REQUIRE\\s*\\(\\s*account\\.balance\\s*\\(\\s*\\)\\s*==\\s*70\\s*\\)"],
          hint: "Give it a sentence-length name describing the behaviour, and REQUIRE(account.balance() == 70).",
          success:
            "Correct. The name earns its length in the failure output — a list of failing tests reading as sentences tells you what is broken before you open anything.",
        },
        solution: `TEST_CASE("withdrawing reduces the balance") {
  Account account(100);

  account.withdraw(30);

  REQUIRE(account.balance() == 70);
}`,
      },

      alt: {
        c: {
          body: [
            "A test that ran in the second before you pushed. That is the whole argument for testing, and it is practical rather than moral.",
            "C has no standard test framework and several small ones. Unity and Check are the common choices; `assert.h` plus a main function is enough to start.",
            "That minimal approach is more viable in C than elsewhere, because a test is just a function that calls `assert` and a main that calls the functions. Fifty lines of harness gets you most of the value.",
            "The important restriction: `assert` is compiled out when `NDEBUG` is defined. Test binaries must be built WITHOUT it, or your tests silently pass by doing nothing.",
            "For anything larger, a framework earns its place by giving you test discovery, a summary of failures, and setup and teardown — the parts that get tedious by hand.",
            "Two C-specific things are worth testing that other languages need not. Memory: run the suite under `valgrind` or with `-fsanitize=address`, and a leak or an overflow fails the build.",
            "And boundaries: C will not check an index or a size for you, so tests around empty inputs, maximum sizes and off-by-one cases carry more weight here.",
            "Testing `static` functions needs a decision. The usual answers are to `#include` the .c file into the test, or to expose them conditionally under a test macro.",
          ],
          predict: {
            ask: "Why might a C test suite pass without testing anything?",
            code: `void test_add(void) {
  assert(add(2, 2) == 5);
}

/* built with: cc -DNDEBUG -O2 tests.c */`,
            choices: [
              { text: "add is correct after all", why: "2 + 2 is not 5, and the assertion never ran to notice." },
              { text: "NDEBUG compiles every assert out, so the test body does nothing", why: "Correct. assert is a macro that becomes nothing when NDEBUG is defined, which release builds usually do. A test binary must be built without it, or the whole suite passes vacuously." },
              { text: "The optimiser removed the call", why: "The optimiser may well remove an empty function, and the emptiness comes from NDEBUG rather than from -O2." },
              { text: "assert needs a message", why: "The single-argument form is standard. NDEBUG is what disabled it." },
            ],
            answer: 1,
          },
          example: `/* the minimal version: assert plus a main. Genuinely enough to start */
#include <assert.h>
#include <stdio.h>

/* NEVER build tests with -DNDEBUG — assert vanishes */

static int failures = 0;

#define CHECK(cond) do {                                    \\
  if (!(cond)) {                                            \\
    printf("FAIL %s:%d  %s\\n", __FILE__, __LINE__, #cond);  \\
    failures++;                                             \\
  }                                                         \\
} while (0)

void test_withdraw_reduces_balance(void) {
  Account a = account_new(100);      /* arrange */

  account_withdraw(&a, 30);          /* act */

  CHECK(account_balance(&a) == 70);  /* assert */
}

int main(void) {
  test_withdraw_reduces_balance();
  test_withdraw_rejects_overdraft();

  printf("%s\\n", failures ? "FAILED" : "OK");
  return failures ? 1 : 0;
}

/* frameworks, when the harness gets tedious:
     Unity   small, popular in embedded work
     Check   forks per test, so a crash does not stop the suite */

/* two things C must test that others need not: */
/*   memory:  cc -fsanitize=address,undefined, or run under valgrind */
/*   bounds:  empty inputs, maximum sizes, every off-by-one */

/* testing a static function: #include the .c file into the test */
#include "account.c"`,
          notes: [
            { token: "assert plus main", meaning: "genuinely enough to start" },
            { token: "never -DNDEBUG", meaning: "or every assert vanishes and the suite passes" },
            { token: "#condition", meaning: "the stringify operator. Prints the failed expression" },
            { token: "-fsanitize=address", meaning: "run the suite under it. Leaks fail the build" },
          ],
          prompt:
            "Write the check macro so it prints the failing expression along with the location.",
          starter: `#define CHECK(cond) do {                          \\
  if (!(cond)) {                                  \\
    printf("FAIL %s:%d  %s\\n", __FILE__, __LINE__, );  \\
    failures++;                                   \\
  }                                               \\
} while (0)`,
          rules: {
            regex: ["__LINE__\\s*,\\s*#cond"],
            hint: "#cond — the stringify operator turns the expression into a string literal.",
            success:
              "Correct. `#cond` is a preprocessor feature with no run-time cost: the compiler substitutes the literal text of whatever was passed, so the failure names the exact expression.",
          },
          solution: `#define CHECK(cond) do {                          \\
  if (!(cond)) {                                  \\
    printf("FAIL %s:%d  %s\\n", __FILE__, __LINE__, #cond);  \\
    failures++;                                   \\
  }                                               \\
} while (0)`,
        },

        python: {
          body: [
            "A test that ran in the second before you pushed. That is the whole argument for testing, and it is practical rather than moral.",
            "Python's standard library has `unittest`, and almost nobody chooses it for new work. `pytest` is the community's answer and is dramatically less ceremonious.",
            "A pytest test is a function whose name starts with `test_`, containing a plain `assert`. No class, no `self`, no `assertEqual` — and when it fails, pytest rewrites the assertion to show you both values.",
            "That assertion rewriting is the reason it won: `assert result == expected` failing tells you exactly what each side was, which `assertEqual` had to be asked for explicitly.",
            "FIXTURES are the other half. A fixture is a function decorated with `@pytest.fixture` that produces something a test needs, and a test asks for it simply by naming it as a parameter.",
            "That is dependency injection with no framework — and fixtures can depend on other fixtures, and can clean up after themselves with a `yield`.",
            "`@pytest.mark.parametrize` runs the same test over many inputs, each reported separately. It is the shortest path from one test to twenty.",
            "For coverage, `pytest --cov` tells you which lines never ran. Treat it as a way to find UNTESTED code rather than as a number to maximise — 100% coverage of trivial code proves nothing.",
          ],
          predict: {
            ask: "How does pytest know what to pass as `account`?",
            code: `@pytest.fixture
def account():
    return Account(100)

def test_withdraw_reduces_balance(account):
    account.withdraw(30)
    assert account.balance == 70`,
            choices: [
              { text: "It guesses from the type annotation", why: "There is no annotation here, and pytest matches on the NAME rather than a type." },
              { text: "The parameter name matches a fixture name, so pytest calls that fixture", why: "Correct. Fixtures are matched by name: asking for a parameter called account makes pytest run the account fixture and pass its result. That is dependency injection with no configuration." },
              { text: "It must be passed explicitly at the call site", why: "Nothing calls the test function directly — pytest collects and calls it, supplying the fixtures." },
              { text: "Only if they are in the same file", why: "Fixtures in conftest.py are available to every test in that directory and below." },
            ],
            answer: 1,
          },
          example: `# unittest is in the standard library. pytest is what people use

# a test is a function, and assert is a plain assert
def test_withdrawing_reduces_the_balance():
    account = Account(100)          # arrange
    account.withdraw(30)            # act
    assert account.balance == 70    # assert

# pytest rewrites the assertion to show BOTH values on failure
# assert 70 == 71
#   + where 70 = <Account object>.balance

# fixtures: matched by parameter NAME
import pytest

@pytest.fixture
def account():
    return Account(100)

def test_deposit(account):          # pytest supplies it
    account.deposit(50)
    assert account.balance == 150

# a fixture that cleans up
@pytest.fixture
def db():
    conn = connect()
    yield conn                      # the test runs here
    conn.close()                    # after it, on every path

# one test, many inputs — each reported separately
@pytest.mark.parametrize("n,expected", [(2, True), (3, False), (0, True)])
def test_is_even(n, expected):
    assert is_even(n) is expected

# exceptions
def test_overdraft_is_rejected():
    with pytest.raises(InsufficientFunds, match="balance"):
        Account(10).withdraw(50)

# fixtures shared across files go in conftest.py

# coverage: find UNTESTED code, not a number to maximise
#   pytest --cov=myapp --cov-report=term-missing`,
          notes: [
            { token: "a plain assert", meaning: "pytest rewrites it to show both values" },
            { token: "fixtures by name", meaning: "a parameter named after a fixture receives it" },
            { token: "yield in a fixture", meaning: "the test runs there; cleanup follows" },
            { token: "parametrize", meaning: "one test, many inputs, reported separately" },
          ],
          prompt:
            "Write a fixture that opens a connection, hands it to the test, and closes it afterwards.",
          starter: `@pytest.fixture
def db():
    conn = connect()
    
    conn.close()`,
          rules: {
            regex: ["yield\\s+conn\\b"],
            hint: "yield conn — the test runs at that point, and the line after it is the cleanup.",
            success:
              "Correct. The yield form is exactly a context manager: everything before it is setup, the test runs at the yield, and everything after is teardown that happens even if the test failed.",
          },
          solution: `@pytest.fixture
def db():
    conn = connect()
    yield conn
    conn.close()`,
        },

        java: {
          body: [
            "A test that ran in the second before you pushed. That is the whole argument for testing, and it is practical rather than moral.",
            "JUnit is effectively universal in Java, and JUnit 5 is the current version. Its shape is a method annotated `@Test` with assertions from `Assertions`.",
            "Use `@DisplayName` for the readable sentence. Java method names cannot contain spaces, so `withdrawingReducesTheBalance` is what you get without it — and a display name turns the report into English.",
            "`assertEquals(expected, actual)` takes the expected value FIRST. Getting them the wrong way round still passes and fails, and produces a backwards message when it fails.",
            "AssertJ is worth adding. `assertThat(account.balance()).isEqualTo(70)` reads in the natural order and its failure messages are considerably better, particularly for collections.",
            "`@ParameterizedTest` with `@ValueSource` or `@CsvSource` runs one test over many inputs. `@BeforeEach` gives you fresh setup per test — and note that JUnit constructs a NEW test instance per method, so fields are already fresh.",
            "Mockito is the standard mocking library. Use it for things that are genuinely awkward — a payment gateway, a clock — and not for everything: a test where every collaborator is a mock only proves the mocks were called.",
            "For anything touching a real database, Testcontainers starts one in Docker for the test. That turns integration tests from a shared-environment problem into an ordinary dependency.",
          ],
          predict: {
            ask: "What is wrong with this assertion?",
            code: `assertEquals(account.balance(), 70);`,
            choices: [
              { text: "Nothing — the order does not matter", why: "It compiles and passes and fails identically, and the failure MESSAGE comes out backwards." },
              { text: "The arguments are reversed — expected comes first, so the failure message is backwards", why: "Correct. JUnit prints \"expected: <X> but was: <Y>\" using the first and second arguments in that order. Reversed, a failure reports the actual value as expected — which is confusing at exactly the moment you need clarity." },
              { text: "It should be assertThat", why: "assertThat is AssertJ's style and reads better; the standard assertEquals is fine with the arguments the right way round." },
              { text: "70 needs to be a long", why: "The overloads handle the numeric types. The argument order is the issue." },
            ],
            answer: 1,
          },
          example: `import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

class AccountTest {

  @Test
  @DisplayName("withdrawing reduces the balance")
  void withdrawingReducesTheBalance() {
    Account account = new Account(100);      // arrange

    account.withdraw(30);                    // act

    assertEquals(70, account.balance());     // EXPECTED first
  }

  @Test
  void overdraftIsRejected() {
    var account = new Account(10);
    assertThrows(InsufficientFunds.class, () -> account.withdraw(50));
  }

  @BeforeEach void setUp() { }               // a NEW instance per test anyway
}

// AssertJ reads in the natural order, with better messages
import static org.assertj.core.api.Assertions.assertThat;

assertThat(account.balance()).isEqualTo(70);
assertThat(names).contains("ada").doesNotContain("bob");

// one test, many inputs
@ParameterizedTest
@CsvSource({ "2, true", "3, false", "0, true" })
void isEven(int n, boolean expected) {
  assertEquals(expected, Numbers.isEven(n));
}

// Mockito, for what is genuinely awkward to use for real
var gateway = mock(PaymentGateway.class);
when(gateway.charge(any())).thenReturn(Result.ok());
verify(gateway).charge(argThat(c -> c.amount().equals(TEN)));

// a real database, started in Docker for the test
@Container
static PostgreSQLContainer<?> db = new PostgreSQLContainer<>("postgres:16");`,
          notes: [
            { token: "@DisplayName", meaning: "the readable sentence a method name cannot be" },
            { token: "assertEquals(expected, actual)", meaning: "expected FIRST, or the message is backwards" },
            { token: "AssertJ", meaning: "natural order, and much better failure messages" },
            { token: "Testcontainers", meaning: "a real database in Docker, per test run" },
          ],
          prompt:
            "Give the test a readable name and assert with the arguments in the order JUnit expects.",
          starter: `@Test
@("")
void withdrawingReducesTheBalance() {
  Account account = new Account(100);
  account.withdraw(30);
  assertEquals(, );
}`,
          rules: {
            regex: ["@DisplayName\\s*\\(\\s*\"[a-z][^\"]{15,}\"\\s*\\)", "assertEquals\\s*\\(\\s*70\\s*,\\s*account\\.balance\\s*\\(\\s*\\)\\s*\\)"],
            hint: "@DisplayName(\"withdrawing reduces the balance\") and assertEquals(70, account.balance()).",
            success:
              "Correct. The display name is what appears in the CI report, so a failing build reads as a list of broken behaviours rather than a list of camel-case identifiers.",
          },
          solution: `@Test
@DisplayName("withdrawing reduces the balance")
void withdrawingReducesTheBalance() {
  Account account = new Account(100);
  account.withdraw(30);
  assertEquals(70, account.balance());
}`,
        },

        javascript: {
          body: [
            "A test that ran in the second before you pushed. That is the whole argument for testing, and it is practical rather than moral.",
            "This ecosystem has churned through test runners, and the picture is now reasonably settled. Vitest for anything with a bundler, Jest for older projects, and Node's own `node:test` when you want no dependency at all.",
            "They share a shape, so moving between them is mostly imports: `describe` groups, `test` or `it` declares one, and `expect(x).toBe(y)` asserts.",
            "`toBe` is `Object.is` — reference equality for objects. `toEqual` compares contents recursively, and is what you want for objects and arrays. Confusing them is the most common early mistake.",
            "Async tests need the `await`. A test that forgets it passes immediately, before the assertion has run — so a broken async test can look green forever.",
            "For anything touching the DOM, Testing Library is the standard and its philosophy is worth adopting: query by what a user sees — a label, a role, visible text — rather than by a CSS class or a test id.",
            "That makes tests survive refactoring, because renaming a class does not change what the user sees.",
            "Playwright is the end-to-end answer, driving a real browser. A handful of those covering the critical paths, with the bulk of the suite as fast unit tests.",
          ],
          predict: {
            ask: "Why does this test pass even when the API is broken?",
            code: `test("fetches the user", () => {
  fetchUser(1).then(user => {
    expect(user.name).toBe("Ada");
  });
});`,
            choices: [
              { text: "It does not — the assertion runs", why: "The test function returns before the promise settles, so the runner has already recorded a pass." },
              { text: "The test returns before the promise settles, so the runner never sees the assertion", why: "Correct. The test function finishes synchronously and the runner marks it passed. The assertion runs later, possibly after the whole suite. Make the test async and await the promise, or return it." },
              { text: "expect does not work inside then", why: "It works — it simply runs too late to affect the result." },
              { text: "fetchUser must be mocked", why: "Mocking is a separate concern. The missing await is what makes the result meaningless." },
            ],
            answer: 1,
          },
          example: `import { describe, test, expect, beforeEach, vi } from "vitest";

describe("Account", () => {
  test("withdrawing reduces the balance", () => {
    const account = new Account(100);      // arrange
    account.withdraw(30);                  // act
    expect(account.balance).toBe(70);      // assert
  });

  // toBe is reference equality. toEqual compares contents
  test("returns the right shape", () => {
    expect(makeUser()).toEqual({ name: "Ada", age: 36 });
    // expect(makeUser()).toBe({ ... })    // never true for objects
  });

  // async tests MUST await, or they pass before asserting
  test("fetches the user", async () => {
    const user = await fetchUser(1);
    expect(user.name).toBe("Ada");
  });

  test("rejects an overdraft", async () => {
    await expect(withdraw(500)).rejects.toThrow("insufficient");
  });
});

// one test, many inputs
test.each([[2, true], [3, false]])("isEven(%i) is %s", (n, expected) => {
  expect(isEven(n)).toBe(expected);
});

// mocking a module
vi.mock("./payments", () => ({ charge: vi.fn().mockResolvedValue({ ok: true }) }));

// DOM: query by what a USER sees, not by class name
import { render, screen } from "@testing-library/react";

render(<Login />);
await screen.findByRole("button", { name: /sign in/i });

// end to end: a handful, in a real browser
// import { test, expect } from "@playwright/test";`,
          notes: [
            { token: "toBe vs toEqual", meaning: "reference, versus contents. The common early mistake" },
            { token: "await in async tests", meaning: "or the test passes before asserting" },
            { token: "getByRole", meaning: "query what a user sees. Survives refactoring" },
            { token: "Vitest / Jest / node:test", meaning: "same shape. Mostly a difference of imports" },
          ],
          prompt:
            "Fix the async test so the runner actually sees the assertion.",
          starter: `test("fetches the user", () => {
  fetchUser(1).then(user => {
    expect(user.name).toBe("Ada");
  });
});`,
          rules: {
            regex: ["async\\s*\\(\\s*\\)\\s*=>", "await\\s+fetchUser\\s*\\(\\s*1\\s*\\)"],
            mustNot: [".then(user =>"],
            hint: "Make the callback async and write `const user = await fetchUser(1);`",
            success:
              "Correct. Returning the promise would also work — `return fetchUser(1).then(...)` — because the runner waits on a returned promise. The await version simply reads better.",
          },
          solution: `test("fetches the user", async () => {
  const user = await fetchUser(1);
  expect(user.name).toBe("Ada");
});`,
        },

        rust: {
          body: [
            "A test that ran in the second before you pushed. That is the whole argument for testing, and it is practical rather than moral.",
            "Rust is the only language here with a test runner built into the language and the build tool. `#[test]` above a function and `cargo test` runs it — no framework, no dependency, no configuration.",
            "The convention is unusual and works well: unit tests live in the SAME FILE as the code, in a `mod tests` block marked `#[cfg(test)]` so it is compiled only for tests.",
            "That means a private function can be tested directly, which in most languages requires a workaround. `use super::*;` brings the module's contents into the test module.",
            "Integration tests go in a top-level `tests/` directory. Those are separate crates, so they see only your public API — which is a useful way to check that the public surface is actually usable.",
            "`assert_eq!` prints both values on failure. `assert!` takes a condition and an optional message. Both are macros, so the failure names the file and line.",
            "Tests run in PARALLEL by default, which is a real advantage and does mean tests sharing a file or an environment variable need care. `cargo test -- --test-threads=1` when you need them serial.",
            "`#[should_panic(expected = \"...\")]` tests a panic, and a test returning `Result` lets you use `?` in its body — which removes a lot of unwraps from test code.",
          ],
          predict: {
            ask: "Where should a test for a private function go?",
            code: `fn helper(x: i32) -> i32 { x * 2 }   // private

// A: tests/helper_test.rs
// B: a #[cfg(test)] mod tests in the same file`,
            choices: [
              { text: "A — tests belong in the tests directory", why: "Files in tests/ are separate crates and can only see the public API, so a private function is invisible to them." },
              { text: "B — files in tests/ are separate crates and cannot see private items", why: "Correct. A #[cfg(test)] module inside the file is a child module, so `use super::*;` gives it access to private items. The tests/ directory is for integration tests against the public API." },
              { text: "Either — Rust ignores privacy in tests", why: "Privacy applies in tests exactly as elsewhere. The child-module relationship is what grants access." },
              { text: "Neither — make it public", why: "Making things public for testing widens your API for no reason. The child module solves it without that." },
            ],
            answer: 1,
          },
          example: `// unit tests live in the SAME FILE as the code
pub fn withdraw(balance: u32, amount: u32) -> Result<u32, String> {
    if amount > balance { return Err("insufficient".into()); }
    Ok(balance - amount)
}

fn helper(x: i32) -> i32 { x * 2 }        // private

#[cfg(test)]                              // compiled only for tests
mod tests {
    use super::*;                         // including the private ones

    #[test]
    fn withdrawing_reduces_the_balance() {
        let balance = 100;                // arrange
        let after = withdraw(balance, 30).unwrap();   // act
        assert_eq!(after, 70);            // assert
    }

    #[test]
    fn overdraft_is_rejected() {
        assert!(withdraw(10, 50).is_err());
    }

    #[test]
    fn private_things_are_reachable_here() {
        assert_eq!(helper(21), 42);
    }

    #[test]
    #[should_panic(expected = "index out of bounds")]
    fn indexing_past_the_end_panics() {
        let v = vec![1];
        let _ = v[5];
    }

    // a test returning Result lets you use ? in the body
    #[test]
    fn parses() -> Result<(), std::num::ParseIntError> {
        assert_eq!("42".parse::<i32>()?, 42);
        Ok(())
    }
}

// integration tests: tests/*.rs — separate crates, PUBLIC api only
// benchmarks: criterion. Doc examples are tested too, by cargo test`,
          notes: [
            { token: "#[cfg(test)] mod tests", meaning: "in the same file. Sees private items" },
            { token: "tests/*.rs", meaning: "separate crates. The public API only" },
            { token: "tests run in parallel", meaning: "by default. Mind shared files and env vars" },
            { token: "a test returning Result", meaning: "lets you use ? instead of unwrap" },
          ],
          prompt:
            "Set the test module up so it compiles only for tests and can reach the module's private items.",
          starter: `#[]
mod tests {
    

    #[test]
    fn it_works() { assert_eq!(helper(21), 42); }
}`,
          rules: {
            regex: ["#\\[cfg\\s*\\(\\s*test\\s*\\)\\s*\\]", "use\\s+super::\\*\\s*;"],
            hint: "#[cfg(test)] above the module, and use super::*; inside it.",
            success:
              "Correct, and both lines earn their place: cfg(test) keeps the test code out of your release binary entirely, and `use super::*` is what makes the parent's private items reachable.",
          },
          solution: `#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() { assert_eq!(helper(21), 42); }
}`,
        },
      },
    },

    /* -------------------------------------------------------- tooling -- */
    {
      id: "tooling",
      kicker: "02",
      title: "The tools that read your code",
      hook:
        "A pull request has forty changed files and thirty-nine of them are indentation. How much of that review was useful?",
      body: [
        "None of it, and a formatter would have prevented the whole situation.",
        "There are five checks worth running, in order, and each one catches something the next cannot: format, lint, types, tests, build.",
        "A FORMATTER makes layout uniform. Its value is not beauty — it is that style stops being a thing anyone discusses, and diffs show real changes rather than reindentation.",
        "The important property is that it is not configurable enough to argue about. `clang-format` with a chosen style, committed to the repository, and nobody negotiates again.",
        "A LINTER finds suspicious patterns: an unused variable, a comparison that is always true, a resource not released. `clang-tidy` is the C++ one, and its checks include a great deal that the compiler will not warn about.",
        "The compiler is itself a tool worth configuring. `-Wall -Wextra` should be the minimum, and `-Werror` in CI turns a warning nobody reads into a build failure somebody fixes.",
        "SANITIZERS are C++'s distinctive tool. `-fsanitize=address` catches use-after-free, buffer overflows and leaks at the moment they happen; `-fsanitize=undefined` catches signed overflow and other undefined behaviour.",
        "Run the test suite under them in CI. They cost roughly a two-times slowdown and they find the bugs that otherwise appear once a month in production.",
      ],
      predict: {
        ask: "What does -fsanitize=address catch that the compiler cannot?",
        code: `int *p = new int[10];
delete[] p;
p[0] = 5;`,
        choices: [
          { text: "Nothing — the compiler warns about this", why: "The compiler sees a valid pointer being written to. Nothing in the types says it was freed." },
          { text: "Use after free, at the moment it happens, with both stack traces", why: "Correct. AddressSanitizer instruments every memory access at run time, so it reports the write, where the memory was allocated, and where it was freed — a bug the compiler cannot see and that otherwise appears as corruption somewhere unrelated." },
          { text: "Only memory leaks", why: "It catches leaks too, along with use-after-free, buffer overflows and use-after-return." },
          { text: "It catches it at compile time", why: "It is a run-time instrumentation, which is why the suspicious code path has to actually execute." },
        ],
        answer: 1,
      },
      viz: traceToolchain(),
      example: `# format — not configurable enough to argue about
clang-format -i src/*.cpp
# .clang-format in the repo, committed. Nobody negotiates again

# lint — patterns the compiler will not warn about
clang-tidy src/*.cpp -- -std=c++20

# the compiler IS a tool. Configure it
g++ -std=c++20 -Wall -Wextra -Wpedantic -Werror

# SANITIZERS — C++'s distinctive tool. Run the suite under them
g++ -fsanitize=address,undefined -g -O1 tests.cpp
# catches: use after free, buffer overflow, leaks, signed overflow

# thread races, separately (it cannot combine with address)
g++ -fsanitize=thread -g

# build and test
cmake -B build && cmake --build build && ctest --test-dir build

# all of it, on every push
# .github/workflows/ci.yml:
#   - clang-format --dry-run --Werror
#   - clang-tidy
#   - cmake --build with -Werror
#   - ctest under -fsanitize=address,undefined

# and locally, before committing: a pre-commit hook running
# the fast ones — format and lint — costs a second`,
      notes: [
        { token: "clang-format", meaning: "layout. Its value is ending the discussion" },
        { token: "clang-tidy", meaning: "patterns the compiler will not warn about" },
        { token: "-Wall -Wextra -Werror", meaning: "the minimum. Warnings nobody reads are noise" },
        { token: "-fsanitize=address", meaning: "run-time memory checking. Run your tests under it" },
      ],
      challenge: {
        prompt:
          "Build the test binary with the two sanitizers that catch memory and undefined-behaviour bugs, keeping symbols for the stack traces.",
        starter: `g++ -std=c++20 -fsanitize= - tests.cpp`,
        rules: {
          regex: ["-fsanitize=(address,undefined|undefined,address)", "\\s-g(\\s|$)"],
          hint: "-fsanitize=address,undefined and -g for the symbols.",
          success:
            "Correct. The -g matters as much as the sanitizers: without symbols the report gives you addresses rather than file names and line numbers, which makes it far harder to act on.",
        },
        solution: `g++ -std=c++20 -fsanitize=address,undefined -g tests.cpp`,
      },

      alt: {
        c: {
          body: [
            "None of it, and a formatter would have prevented the whole situation.",
            "C's tooling is the same family as C++'s, and it matters more here, because the language checks so little for you.",
            "`clang-format` formats. `clang-tidy` and `cppcheck` lint. Both find real bugs — an uninitialised read, a missing free, a `sizeof` on the wrong type.",
            "The compiler is your most important tool and its defaults are far too quiet. `-Wall -Wextra` is the minimum, and there are several more worth adding by name.",
            "`-Wshadow` catches a local shadowing another. `-Wconversion` catches an implicit narrowing that silently loses data. `-Wformat=2` catches a printf format not matching its arguments — a classic source of crashes.",
            "SANITIZERS are the single highest-value tool in C. `-fsanitize=address,undefined` catches buffer overflows, use-after-free, leaks and signed overflow at the moment they happen rather than hours later.",
            "Run every test under them, always. The two-times slowdown is nothing against the class of bug they find.",
            "And valgrind remains useful where sanitizers cannot be used — it needs no recompilation, so it works on a binary you were given.",
          ],
          predict: {
            ask: "Which warning catches this?",
            code: `unsigned int n = get_count();
int i = n;                     /* silently narrows */

printf("%d\\n", (long)n);      /* format mismatch */`,
            choices: [
              { text: "-Wall alone", why: "Neither of these is in the default -Wall set — both need to be asked for by name." },
              { text: "-Wconversion for the narrowing and -Wformat=2 for the mismatch", why: "Correct. -Wall does not include either. -Wconversion warns when an implicit conversion may lose value, and -Wformat=2 checks printf arguments against the format string — a genuine source of crashes." },
              { text: "Only a sanitizer catches these", why: "Both are visible at compile time with the right flags, which is far cheaper than catching them at run time." },
              { text: "Neither — these are legal C", why: "Both are legal and both are usually mistakes, which is exactly what a warning is for." },
            ],
            answer: 1,
          },
          example: `# format
clang-format -i src/*.c

# lint — both find real bugs
clang-tidy src/*.c --
cppcheck --enable=all src/

# the compiler, configured properly. The defaults are far too quiet
cc -std=c17 -Wall -Wextra -Wpedantic \\
   -Wshadow          \\
   -Wconversion      \\
   -Wformat=2        \\
   -Wstrict-prototypes                                        \\
   -Werror                                                    \\
   -O2 -g main.c

# SANITIZERS — the highest-value tool in C. Run every test under them
cc -fsanitize=address,undefined -g -O1 tests.c
# buffer overflow, use after free, leaks, signed overflow

# threads, separately — it cannot combine with address
cc -fsanitize=thread -g

# valgrind, when you cannot recompile
valgrind --leak-check=full --track-origins=yes ./prog

# a build, and CI
make CFLAGS="-Wall -Wextra -Werror -fsanitize=address,undefined -g"

# the debugger is a tool too, and worth more than just run
gdb --args ./prog input.txt
#   break file.c:42     watch total     backtrace     print *p`,
          notes: [
            { token: "-Wall is not enough", meaning: "add -Wshadow, -Wconversion, -Wformat=2" },
            { token: "-fsanitize=address,undefined", meaning: "the highest-value tool in C" },
            { token: "valgrind", meaning: "no recompilation needed. Works on any binary" },
            { token: "-Werror in CI", meaning: "a warning nobody reads is noise" },
          ],
          prompt:
            "Add the two warnings that catch a silent narrowing and a printf argument mismatch.",
          starter: `cc -std=c17 -Wall -Wextra   -Werror main.c`,
          rules: {
            regex: ["-Wconversion", "-Wformat=2"],
            hint: "-Wconversion and -Wformat=2",
            success:
              "Correct. -Wconversion is noisy in existing codebases and worth enabling on new ones from the start, because a silent narrowing is invisible in review and produces wrong answers rather than crashes.",
          },
          solution: `cc -std=c17 -Wall -Wextra -Wconversion -Wformat=2 -Werror main.c`,
        },

        python: {
          body: [
            "None of it, and a formatter would have prevented the whole situation.",
            "Python's tooling settled recently and settled well. `ruff` does formatting and linting in one tool, is written in Rust, and is fast enough that running it on save is unnoticeable.",
            "Before ruff this was `black` for formatting plus `flake8` plus a dozen plugins. Ruff replaced all of it and is compatible with black's output, so migrating changes nothing about the result.",
            "Black's contribution was the important idea: a formatter with almost no options. Line length and a couple of others, and everything else is decided — so there is nothing left to argue about.",
            "For types, `mypy` is the original and `pyright` — what Pylance uses in VS Code — is faster and often more precise. Either is worth adding, and both work on a codebase gradually.",
            "That gradual adoption matters. Start with `mypy --strict` on one new module rather than the whole codebase, and widen it over time.",
            "`pre-commit` is the tool that runs the fast checks before a commit is made. It costs a second and saves the round trip through CI.",
            "And for anything performance-related: `cProfile` to find where the time goes, `py-spy` to profile a running process without restarting it, and `timeit` for microbenchmarks. Measure before optimising, always.",
          ],
          predict: {
            ask: "What does ruff replace?",
            code: `# before
black . && isort . && flake8 . && pyupgrade

# after
ruff format . && ruff check .`,
            choices: [
              { text: "Only flake8", why: "It covers the formatter, the import sorter and the upgrade tool as well." },
              { text: "All of them — formatting, import sorting, linting and many plugin rule sets", why: "Correct. Ruff implements black-compatible formatting, isort's ordering, flake8's rules and hundreds more from plugins, in one binary that runs in a fraction of the time." },
              { text: "Nothing — it is a type checker", why: "Type checking is exactly the thing ruff does NOT do. That is mypy or pyright." },
              { text: "It replaces mypy", why: "Ruff does not do type inference. It complements a type checker rather than replacing one." },
            ],
            answer: 1,
          },
          example: `# format and lint — one fast tool for both
ruff format .
ruff check . --fix

# configured in pyproject.toml, committed
# [tool.ruff]
# line-length = 88
# [tool.ruff.lint]
# select = ["E", "F", "I", "UP", "B", "SIM"]
#   E,F   pycodestyle and pyflakes
#   I     import sorting (isort)
#   UP    modernise old syntax (pyupgrade)
#   B     likely bugs (bugbear)
#   SIM   simplifications

# types — adopt it gradually, one module at a time
mypy src/
pyright src/

# [tool.mypy]
# strict = true
# and per-module overrides while you migrate

# the fast checks, before the commit
# .pre-commit-config.yaml, then: pre-commit install
#   - ruff-format
#   - ruff
#   - mypy

# tests and coverage
pytest --cov=myapp --cov-report=term-missing

# MEASURE before optimising
python -m cProfile -s cumtime script.py
py-spy top --pid 1234          # a running process, no restart
python -m timeit "sum(range(1000))"

# and check what you depend on
pip-audit                      # known vulnerabilities`,
          notes: [
            { token: "ruff", meaning: "format and lint in one. Replaced black, isort and flake8" },
            { token: "almost no options", meaning: "black's real contribution. Nothing left to argue about" },
            { token: "mypy / pyright", meaning: "types. Adopt gradually, module by module" },
            { token: "cProfile / py-spy", meaning: "measure before optimising. py-spy needs no restart" },
          ],
          prompt:
            "Format and lint the project with automatic fixes, using the modern single tool.",
          starter: `ruff  .
ruff  . `,
          rules: {
            regex: ["ruff\\s+format\\s+\\.", "ruff\\s+check\\s+\\.\\s+--fix"],
            hint: "ruff format . and ruff check . --fix",
            success:
              "Correct, and the order matters slightly: formatting first means the linter sees the final layout, so a rule about line length is judged on what will actually be committed.",
          },
          solution: `ruff format .
ruff check . --fix`,
        },

        java: {
          body: [
            "None of it, and a formatter would have prevented the whole situation.",
            "Java's tooling is mature and less unified than Python's — several good tools, each doing one job, wired together by the build.",
            "For formatting, `google-java-format` and Spotless are the common pair: Spotless is a Gradle or Maven plugin, and google-java-format is the formatter it usually runs.",
            "`spotlessCheck` in CI and `spotlessApply` locally is the standard arrangement, and it ends the formatting discussion the same way as everywhere else.",
            "For linting, the compiler catches a great deal already, and ERROR PRONE catches what it does not. It is a compiler plugin from Google that finds bugs like a `==` on boxed types, a format string mismatch, or a returned value being ignored.",
            "NullAway builds on it and is worth knowing: it adds compile-time null checking to Java, which the language itself lacks. Annotate the package as null-marked and it flags the paths where a null can reach.",
            "Static analysis beyond that is SpotBugs, and PMD for style-level rules. Both are worth having in CI and neither needs to run locally.",
            "For measuring, JMH is the benchmark tool and is genuinely necessary — the JVM's optimiser makes naive timing loops meaningless, because it can delete code whose result is unused.",
            "And async-profiler is the modern profiler: low overhead, and it produces flame graphs from a running JVM.",
          ],
          predict: {
            ask: "Why is this benchmark meaningless?",
            code: `long start = System.nanoTime();
for (int i = 0; i < 1_000_000; i++) {
  compute(i);
}
System.out.println(System.nanoTime() - start);`,
            choices: [
              { text: "nanoTime is not accurate enough", why: "nanoTime is fine for this scale. What is unreliable is what the JVM does with the loop." },
              { text: "The result is unused, so the JIT may delete the calls entirely — and the loop is timed before it is even compiled", why: "Correct. Dead code elimination can remove a call whose result nobody uses, and the first thousands of iterations run interpreted before the JIT compiles the method. JMH handles both with warmup and blackholes." },
              { text: "The loop count is too small", why: "A million iterations is plenty. The measurement is invalid for structural reasons rather than statistical ones." },
              { text: "It should use currentTimeMillis", why: "nanoTime is the correct clock for elapsed time. currentTimeMillis is for wall-clock time and can move backwards." },
            ],
            answer: 1,
          },
          example: `// format — Spotless in the build, google-java-format underneath
// build.gradle.kts:
//   spotless { java { googleJavaFormat() } }
./gradlew spotlessApply       // locally
./gradlew spotlessCheck       // in CI

// the compiler catches a lot. Turn on what it does not by default
// options.compilerArgs = ["-Xlint:all", "-Werror"]

// Error Prone — a compiler plugin that finds real bugs
//   == on boxed types, format string mismatches, ignored returns

// NullAway adds compile-time null checking, which Java lacks
// @NullMarked package com.example.app;

// static analysis in CI
./gradlew spotbugsMain pmdMain

// tests and coverage
./gradlew test jacocoTestReport

// BENCHMARKS need JMH — a naive timing loop is meaningless,
// because the JIT can delete code whose result is unused
@Benchmark
public void measure(Blackhole bh) {
  bh.consume(compute(42));    // the blackhole stops it being removed
}

// profiling a running JVM
// async-profiler: ./profiler.sh -d 30 -f flame.html <pid>
// or JFR, built in: java -XX:StartFlightRecording=duration=30s

// dependency vulnerabilities
./gradlew dependencyCheckAnalyze`,
          notes: [
            { token: "Spotless + google-java-format", meaning: "apply locally, check in CI" },
            { token: "Error Prone", meaning: "a compiler plugin. Finds what javac will not" },
            { token: "NullAway", meaning: "compile-time null checking, which Java lacks" },
            { token: "JMH and a Blackhole", meaning: "or the JIT deletes the code you are timing" },
          ],
          prompt:
            "Stop the JIT from deleting the computation you are trying to measure.",
          starter: `@Benchmark
public void measure(Blackhole bh) {
  compute(42);
}`,
          rules: {
            regex: ["bh\\.consume\\s*\\(\\s*compute\\s*\\(\\s*42\\s*\\)\\s*\\)"],
            hint: "bh.consume(compute(42)) — the blackhole makes the result observably used.",
            success:
              "Correct. Returning the value from the benchmark method works too — JMH consumes a returned value automatically, and the Blackhole is for when there are several results to keep alive.",
          },
          solution: `@Benchmark
public void measure(Blackhole bh) {
  bh.consume(compute(42));
}`,
        },

        javascript: {
          body: [
            "None of it, and a formatter would have prevented the whole situation.",
            "`prettier` is the formatter and it won completely — it has almost no options, and that is the point. Line width, quotes, semicolons, and everything else is decided.",
            "`eslint` is the linter, and the two do different jobs: prettier decides layout, eslint finds suspicious code. Running both is normal, and there is a config to stop them fighting over formatting rules.",
            "TypeScript is the type checker, and `tsc --noEmit` is how you run it as a check without producing output. Turn `strict` on — the non-strict mode allows implicit `any`, which removes most of the value.",
            "The newer tools are worth knowing: `biome` does formatting and linting in one fast binary, and `oxlint` is a very fast linter. Both are the same consolidation ruff brought to Python.",
            "For running the checks before a commit, `husky` plus `lint-staged` is the common pairing — lint-staged runs the tools only on the files being committed, which keeps it fast.",
            "For measuring: the browser's Performance panel for anything user-facing, and `--cpu-prof` or `clinic.js` for Node. Chrome's Lighthouse gives you the user-perceived numbers that actually matter for a web page.",
            "And `npm audit` for dependency vulnerabilities, which in this ecosystem is not optional — the dependency trees are large enough that something in yours will eventually have a CVE.",
          ],
          predict: {
            ask: "Why run both prettier and eslint?",
            code: `prettier --write .
eslint . --fix`,
            choices: [
              { text: "They do the same thing, so one is redundant", why: "They overlap only on formatting rules, which is exactly what the shared config turns off." },
              { text: "Prettier decides layout; eslint finds suspicious code. Different jobs", why: "Correct. Prettier reprints the code with no opinion about correctness. ESLint finds unused variables, missing awaits, and rule violations — things layout cannot express. eslint-config-prettier disables the formatting rules so they do not conflict." },
              { text: "ESLint cannot format", why: "It can, badly, and that is what the shared config disables. Prettier is better at it." },
              { text: "Only for TypeScript projects", why: "Both apply to plain JavaScript equally." },
            ],
            answer: 1,
          },
          example: `# format — almost no options, which is the point
npx prettier --write .
npx prettier --check .          # in CI

# lint — a different job. Suspicious code, not layout
npx eslint . --fix

# eslint-config-prettier turns off the rules that would conflict

# types — and turn strict on, or most of the value is lost
npx tsc --noEmit

# tsconfig.json:
#   "strict": true
#   "noUncheckedIndexedAccess": true   ← arr[i] becomes T | undefined

# the newer consolidated tools
npx biome check --write .       # format + lint, one fast binary
npx oxlint                      # a very fast linter

# before the commit: only the staged files
# package.json:
#   "lint-staged": { "*.{ts,tsx}": ["prettier --write", "eslint --fix"] }
# with husky to install the git hook

# tests
npx vitest run --coverage

# MEASURE, do not guess
node --cpu-prof app.js          # a .cpuprofile for Chrome DevTools
npx clinic doctor -- node app.js
# in the browser: the Performance panel, and Lighthouse

# dependencies — not optional with trees this large
npm audit
npx depcheck                    # what you install and never import`,
          notes: [
            { token: "prettier vs eslint", meaning: "layout, versus suspicious code. Both" },
            { token: "strict: true", meaning: "or implicit any removes most of the value" },
            { token: "noUncheckedIndexedAccess", meaning: "arr[i] becomes T | undefined. Worth it" },
            { token: "lint-staged", meaning: "runs the tools only on what you are committing" },
          ],
          prompt:
            "Run the type checker as a CHECK, without emitting any JavaScript.",
          starter: `npx tsc `,
          rules: {
            regex: ["tsc\\s+--noEmit"],
            hint: "tsc --noEmit",
            success:
              "Correct. This is what CI should run: your bundler already produces the JavaScript, so tsc's only job in the pipeline is to report type errors and fail the build.",
          },
          solution: `npx tsc --noEmit`,
        },

        rust: {
          body: [
            "None of it, and a formatter would have prevented the whole situation.",
            "Rust has the most unified tooling of the six, and it is one of the genuine reasons people enjoy the language. Everything is a `cargo` subcommand and ships with the toolchain.",
            "`cargo fmt` formats. There is one style, it is not configurable in any way that matters, and every Rust project you open looks the same. That uniformity is worth more than any individual preference.",
            "`cargo clippy` lints, and it is unusually good. Its suggestions are specific — it will tell you that a `match` would be clearer as `if let`, or that a `.iter().count()` should be `.len()` — and it explains why.",
            "Run it with `-D warnings` in CI so a lint failure fails the build. And read what it says rather than silencing it; clippy is the fastest way to learn idiomatic Rust.",
            "The compiler is itself a linting tool of unusual quality. Its errors name the problem, point at the exact span, and frequently print the corrected code.",
            "`cargo test` runs the tests, `cargo bench` with criterion runs benchmarks, `cargo doc` builds the documentation, and `cargo audit` checks dependencies for known vulnerabilities.",
            "For profiling, `cargo flamegraph` produces a flame graph in one command. And `#[bench]` alone is not enough — criterion does the statistical work of deciding whether a difference is real.",
            "One more that has no equivalent elsewhere: `cargo miri test` runs your tests under an interpreter that detects undefined behaviour in `unsafe` code.",
          ],
          predict: {
            ask: "What does clippy add over the compiler?",
            code: `let n = v.iter().count();

if let Some(x) = opt { use_it(x) } else { }`,
            choices: [
              { text: "Nothing — the compiler catches these", why: "Both lines compile without a single warning. They are correct and not idiomatic." },
              { text: "Idiom and clarity suggestions: use .len(), and drop the empty else", why: "Correct. Both compile cleanly — clippy points out that .len() is O(1) where .count() walks the iterator, and that an empty else branch is noise. It teaches idiomatic Rust as a side effect of running." },
              { text: "It finds memory bugs", why: "The borrow checker already rules those out in safe code. Miri is the tool for unsafe code." },
              { text: "It only checks formatting", why: "That is cargo fmt. Clippy is about patterns and idiom." },
            ],
            answer: 1,
          },
          example: `# format — one style, and it is not worth configuring
cargo fmt
cargo fmt --check              # in CI

# lint — unusually good, and it teaches idiom
cargo clippy --all-targets --all-features -- -D warnings

# clippy tells you things like:
#   "length comparison to zero" → use is_empty()
#   "this expression creates a reference which is immediately dereferenced"
#   "consider using .iter().sum::<i32>()"

# tests
cargo test
cargo test --release           # some bugs only appear optimised

# undefined behaviour in unsafe code — no equivalent elsewhere
cargo miri test

# documentation, and doc examples are TESTED
cargo doc --open
/// (a doc comment with a code fence here runs under cargo test)
/// assert_eq!(my_crate::add(2, 2), 4);

# dependencies
cargo audit                    # known vulnerabilities
cargo deny check               # licences and duplicate versions
cargo outdated

# benchmarks — criterion does the statistics
# cargo bench

# profiling, in one command
cargo flamegraph --bin myapp

# the whole pipeline, on every push
#   cargo fmt --check
#   cargo clippy -- -D warnings
#   cargo test
#   cargo build --release`,
          notes: [
            { token: "cargo fmt", meaning: "one style. Every Rust project looks the same" },
            { token: "cargo clippy", meaning: "unusually good. The fastest way to learn idiom" },
            { token: "cargo miri test", meaning: "detects undefined behaviour in unsafe code" },
            { token: "doc examples are tested", meaning: "so documentation cannot silently rot" },
          ],
          prompt:
            "Run clippy across everything so that any lint fails the build.",
          starter: `cargo clippy --all-targets  `,
          rules: {
            regex: ["--all-features", "--\\s+-D\\s+warnings"],
            hint: "--all-features, then -- -D warnings to turn lints into errors.",
            success:
              "Correct, and the bare `--` matters: everything after it is passed to rustc rather than to cargo, which is how -D warnings reaches the compiler.",
          },
          solution: `cargo clippy --all-targets --all-features -- -D warnings`,
        },
      },
    },

    /* ------------------------------------------------------ debugging -- */
    {
      id: "debugging",
      kicker: "03",
      title: "Finding out what actually happened",
      hook:
        "Something is wrong and you have been reading the code for an hour. What should you have done in the first five minutes?",
      body: [
        "Reproduced it. A bug you cannot trigger on demand is a bug you cannot know you have fixed — and everything else depends on this step.",
        "Then NARROW it: cut the input down until it is the smallest thing that still fails. Half the time the cause becomes obvious while you are doing it.",
        "Then, if it used to work, BISECT. `git bisect` finds the exact commit that broke it in about ten steps out of a thousand, and it can be scripted with `git bisect run`.",
        "Then OBSERVE. Look at what the values actually are rather than what you assume. Most long debugging sessions end with something obviously true turning out to be false.",
        "A DEBUGGER is the direct way to observe. `gdb` or `lldb` on the binary, a breakpoint, and you can inspect every variable in every frame.",
        "Learn four commands and it stops being intimidating: `break` to stop somewhere, `run`, `backtrace` to see how you got there, and `print` to look at a value. `watch` is the fifth, and it stops when a variable CHANGES — which is how you find who is corrupting something.",
        "Printing is not shameful and it is often faster, especially for something happening a thousand times. It is worse for anything needing you to look around, which is what a debugger is for.",
        "And for performance, the same discipline: `perf` or a profiler first. The slow part is almost never where you think, and optimising the wrong thing costs a day and gains nothing.",
      ],
      predict: {
        ask: "Which gdb command finds who is corrupting a variable?",
        code: `// total becomes -1 somewhere between these lines,
// and nothing obviously writes to it`,
        choices: [
          { text: "break — step through until you see it", why: "That works and can mean stepping through thousands of lines to find one write." },
          { text: "watch total — it stops the moment anything writes to it", why: "Correct. A watchpoint breaks on any write to that location, whoever did it — including through a pointer from code you were not suspicious of. That is exactly the case where stepping is hopeless." },
          { text: "print total — check it repeatedly", why: "That tells you it changed and not what changed it." },
          { text: "backtrace — see the call stack", why: "Useful once you have stopped at the right moment, and it does not stop you there." },
        ],
        answer: 1,
      },
      viz: traceBisect(),
      example: `# 1. REPRODUCE. Everything depends on this
# 2. NARROW. Cut the input down until it is minimal
# 3. BISECT, if it used to work
git bisect start
git bisect bad                    # now
git bisect good v1.2.0            # then
# git checks out the midpoint; you say good or bad; repeat
git bisect run ./test.sh          # or script it entirely

# 4. OBSERVE — a debugger
gdb --args ./prog input.txt

#   break account.cpp:42          stop there
#   break account.cpp:42 if n < 0 stop only when it matters
#   run
#   backtrace                     how did we get here
#   print total                   what is it actually
#   print *ptr                    follow a pointer
#   watch total                   stop when it CHANGES
#   finish                        run to the end of this frame
#   continue

# a crash you did not see happen
ulimit -c unlimited
gdb ./prog core

# printing is not shameful, and is often faster
std::cerr << "n=" << n << " total=" << total << "\\n";

# for performance: MEASURE first
perf record ./prog && perf report
perf stat ./prog                  # cache misses, branch misses

# and the sanitizers find what a debugger will not:
# a use-after-free reported at the moment it happens`,
      notes: [
        { token: "reproduce first", meaning: "everything else depends on it" },
        { token: "git bisect run", meaning: "scripted. Ten steps out of a thousand commits" },
        { token: "watch", meaning: "stops when a variable changes. Finds who corrupted it" },
        { token: "perf before optimising", meaning: "the slow part is never where you think" },
      ],
      challenge: {
        prompt:
          "Set a breakpoint that only stops when the value is actually wrong, rather than on every call.",
        starter: `# in gdb:
break account.cpp:42 `,
        rules: {
          regex: ["break\\s+account\\.cpp:42\\s+if\\s+"],
          hint: "break account.cpp:42 if n < 0",
          success:
            "Correct. A conditional breakpoint is the difference between pressing continue four hundred times and stopping exactly once — and the condition can use any expression valid at that point.",
        },
        solution: `# in gdb:
break account.cpp:42 if n < 0`,
      },

      alt: {
        c: {
          body: [
            "Reproduced it. A bug you cannot trigger on demand is a bug you cannot know you have fixed.",
            "In C there is an extra first question: is this actually undefined behaviour? A great many C bugs are, and they present as impossible symptoms — code that works until you add a printf, or breaks only with optimisation on.",
            "So before reasoning about the logic, run it under `-fsanitize=address,undefined`. If something is corrupting memory, no amount of reading the code will explain what you are seeing.",
            "That is the single most useful debugging habit in C, and it turns a class of mysterious bugs into a precise report naming the line.",
            "For the rest, `gdb` is the tool. Four commands get you most of the way: `break`, `run`, `backtrace`, `print`.",
            "`watch` is the one that solves the hardest bugs. A hardware watchpoint stops the instant anything writes to an address — including through a pointer in code you never suspected.",
            "A CORE DUMP lets you debug a crash you did not witness. `ulimit -c unlimited`, then `gdb ./prog core` gives you the stack at the moment it died.",
            "And `valgrind --track-origins=yes` tells you not just that a value was uninitialised but WHERE it came from, which is often the whole answer.",
          ],
          predict: {
            ask: "A bug disappears when you add a printf. What does that suggest?",
            code: `/* works with the printf, crashes without it */
printf("n = %d\\n", n);`,
            choices: [
              { text: "The printf is fixing a race condition", why: "Timing changes are one possibility and undefined behaviour is far more likely, and testable in seconds." },
              { text: "Undefined behaviour — the printf changed the stack or timing enough to hide it", why: "Correct. A symptom that moves when you add unrelated code almost always means memory corruption or another undefined behaviour. Run it under -fsanitize=address,undefined before reasoning any further." },
              { text: "The compiler optimised the variable away", why: "That would produce a wrong value rather than a crash that appears and disappears." },
              { text: "printf is flushing a buffer that matters", why: "Possible for output ordering and not for a crash." },
            ],
            answer: 1,
          },
          example: `/* FIRST: is this undefined behaviour? Most C mysteries are */
cc -fsanitize=address,undefined -g -O1 prog.c && ./a.out
valgrind --leak-check=full --track-origins=yes ./prog

/* a symptom that moves when you add a printf = memory corruption */

/* then gdb. Four commands get you most of the way */
gdb --args ./prog input.txt

/*  break parse.c:88            stop there
    break parse.c:88 if i > 100 stop only when it matters
    run
    backtrace                   how did we get here
    print total                 what is it actually
    print *node                 follow a pointer
    print arr[0]@10             ten elements from arr
    watch total                 stop when it CHANGES
    finish                      run to the end of this frame
    info locals                 everything in this frame       */

/* a crash you did not witness */
ulimit -c unlimited
./prog                          /* it dies */
gdb ./prog core                 /* the stack at the moment it died */

/* printing, which is often faster. Use stderr — unbuffered */
fprintf(stderr, "%s:%d n=%d\\n", __FILE__, __LINE__, n);

/* a debug macro you can compile out */
#ifdef DEBUG
#  define DBG(...) fprintf(stderr, __VA_ARGS__)
#else
#  define DBG(...) ((void)0)
#endif

/* performance: measure, do not guess */
perf record ./prog && perf report
perf stat -e cache-misses,branch-misses ./prog`,
          notes: [
            { token: "sanitizers first", meaning: "most C mysteries are undefined behaviour" },
            { token: "a symptom that moves", meaning: "when you add a printf. Memory corruption" },
            { token: "watch", meaning: "stops when an address is written. Finds the culprit" },
            { token: "fprintf to stderr", meaning: "unbuffered, so it appears before a crash" },
          ],
          prompt:
            "Print the debug line so it appears even if the program crashes immediately afterwards.",
          starter: `(, "n=%d\\n", n);`,
          rules: {
            regex: ["fprintf\\s*\\(\\s*stderr\\s*,"],
            hint: "fprintf(stderr, ...) — stderr is unbuffered.",
            success:
              "Correct, and it matters for exactly this case: stdout is line-buffered when attached to a terminal and BLOCK-buffered when redirected to a file, so a crash can lose the last few thousand bytes of printf output.",
          },
          solution: `fprintf(stderr, "n=%d\\n", n);`,
        },

        python: {
          body: [
            "Reproduced it. A bug you cannot trigger on demand is a bug you cannot know you have fixed.",
            "Python's tracebacks are the best starting point of any language here. Read them from the BOTTOM: the last line is the error, and the line above it is where it happened.",
            "The frames above that are the path that led there, which matters when the error is a symptom of something set up much earlier.",
            "`breakpoint()` is the built-in debugger call, added in 3.7. Put it on a line and running the program drops you into an interactive prompt with every local in scope.",
            "That prompt is a full Python REPL: you can call functions, inspect objects and try the fix before writing it. `n` steps, `c` continues, `l` lists the code, `pp` pretty-prints.",
            "`ipdb` and `pdbpp` are nicer versions, and `PYTHONBREAKPOINT=ipdb.set_trace` makes `breakpoint()` use one without changing the code.",
            "For printing, `rich` and `icecream` are worth knowing. `ic(x)` prints the expression AND its value, which removes the labelling that hand-written prints always need.",
            "And for performance: `cProfile` for where the time goes, `py-spy` to profile a process already running in production, and `memory_profiler` when the problem is memory rather than speed.",
          ],
          predict: {
            ask: "Which line of a traceback do you read first?",
            code: `Traceback (most recent call last):
  File "app.py", line 10, in <module>
    main()
  File "app.py", line 6, in main
    return process(data)
  File "app.py", line 3, in process
    return x / count
ZeroDivisionError: division by zero`,
            choices: [
              { text: "The first — that is where it started", why: "The first frame is the outermost caller, which is usually main and tells you almost nothing." },
              { text: "The last two — the error, and the line that raised it", why: "Correct. Python prints \"most recent call last\", so the bottom is where the error actually happened. Read upward from there only when you need to know how you got into that state." },
              { text: "The middle, where the logic is", why: "There is no fixed position for that — the bottom is where the exception was raised, whatever the depth." },
              { text: "It does not matter", why: "For a deep stack it matters a great deal; reading from the top means working through frames that are not the problem." },
            ],
            answer: 1,
          },
          example: `# read a traceback from the BOTTOM.
#   the last line is the error
#   the line above it is where it happened
#   upward from there is how you got into that state

# the built-in debugger — a full REPL with every local in scope
breakpoint()

#   n     next line          s     step into
#   c     continue           l     list the code around here
#   p x   print              pp x  pretty-print
#   w     where am I         u/d   up and down the stack
#   and any Python expression works: call things, try the fix

# use a nicer one without changing the code
# PYTHONBREAKPOINT=ipdb.set_trace python app.py

# drop into the debugger AT the failure, after the fact
python -m pdb -c continue app.py     # post-mortem on a crash
pytest --pdb                         # on the first failing test

# printing: name the value for you
from icecream import ic
ic(user, total)      # ic| user: <User Ada>, total: 70

# logging beats print in anything long-lived
import logging
log = logging.getLogger(__name__)
log.debug("total=%s", total)     # lazy — the format runs only if enabled

# MEASURE before optimising
python -m cProfile -s cumtime app.py
py-spy top --pid 1234            # a RUNNING process, no restart
py-spy dump --pid 1234           # what every thread is doing right now

# memory
from memory_profiler import profile
import tracemalloc; tracemalloc.start()`,
          notes: [
            { token: "read from the bottom", meaning: "most recent call last. The error is the last line" },
            { token: "breakpoint()", meaning: "a full REPL with every local in scope" },
            { token: "py-spy", meaning: "profiles a running process without restarting it" },
            { token: "log.debug(\"x=%s\", x)", meaning: "lazy formatting. Skipped when debug is off" },
          ],
          prompt:
            "Log the value lazily, so the formatting only happens when debug logging is enabled.",
          starter: `log.debug()`,
          rules: {
            regex: ["log\\.debug\\s*\\(\\s*\"[^\"]*%s[^\"]*\"\\s*,\\s*total\\s*\\)"],
            mustNot: ["f\"", "\" + total", "% total"],
            hint: "log.debug(\"total=%s\", total) — the value as a separate argument.",
            success:
              "Correct. With an f-string the formatting happens before the call, whether or not debug is enabled — which in a hot loop is real cost for output nobody sees.",
          },
          solution: `log.debug("total=%s", total)`,
        },

        java: {
          body: [
            "Reproduced it. A bug you cannot trigger on demand is a bug you cannot know you have fixed.",
            "Java's stack traces are detailed, and the important skill is finding the CAUSE. A wrapped exception prints a chain of \"Caused by\" sections, and the bottom-most one is usually where the real problem is.",
            "The frames from libraries and frameworks in between are noise most of the time — look for the first line naming your own package.",
            "The debugger is IDE-integrated and excellent. Conditional breakpoints, watch expressions, and the ability to change a variable and continue are all standard.",
            "Two features worth knowing beyond the basics. HOT SWAP lets you change a method body while the program is running, which turns a slow reproduce-fix-restart loop into an instant one.",
            "And a breakpoint on an EXCEPTION rather than a line stops at the moment anything of that type is thrown, wherever it comes from — which is how you catch something being thrown and swallowed deep in a framework.",
            "For a JVM misbehaving in production, `jcmd` and `jstack` give you a thread dump — every thread and what it is doing. That is the tool for a deadlock or a hang.",
            "`jmap` and a heap dump analysed in Eclipse MAT is the tool for a memory leak. And JFR, built into the JVM, records everything with about 1% overhead — safe to leave on in production.",
          ],
          predict: {
            ask: "A production JVM is using no CPU and serving nothing. What do you reach for?",
            code: `// no exceptions in the log, no CPU, no responses`,
            choices: [
              { text: "A heap dump — it is a memory leak", why: "A leak usually shows as high CPU from garbage collection and eventually an OutOfMemoryError, not silence." },
              { text: "A thread dump — jstack or jcmd. Every thread is blocked on something", why: "Correct. No CPU and no progress means threads are waiting — a deadlock, or every one of them blocked on a database that stopped responding. A thread dump names exactly what each is waiting for." },
              { text: "Restart it and see if it recurs", why: "That destroys the evidence. Take the thread dump first — it costs milliseconds." },
              { text: "Attach a profiler", why: "A profiler measures where CPU goes, and there is no CPU being used to attribute." },
            ],
            answer: 1,
          },
          example: `// read a stack trace for the CAUSE — the bottom-most "Caused by"
// and look for the first line naming YOUR package

// the debugger: conditional breakpoints, watch expressions,
// change a variable and continue, and HOT SWAP a method body

// a breakpoint on an EXCEPTION TYPE rather than a line —
// stops wherever it is thrown, including inside a framework

// a JVM that is hung: a thread dump. Every thread, and what it waits on
jcmd <pid> Thread.print
jstack <pid>

// a JVM using too much memory: a heap dump, read in Eclipse MAT
jcmd <pid> GC.heap_dump /tmp/heap.hprof
jmap -dump:live,format=b,file=heap.hprof <pid>

// and automatically, when it dies
// -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/tmp

// what is this JVM doing? About 1% overhead — safe in production
jcmd <pid> JFR.start duration=60s filename=rec.jfr
// java -XX:StartFlightRecording=duration=60s,filename=rec.jfr

// low-overhead CPU profiling with flame graphs
// async-profiler: ./profiler.sh -d 30 -f flame.html <pid>

// logging: SLF4J with placeholders, so formatting is lazy
log.debug("total={} for user={}", total, userId);

// never String-concatenate a log message — it formats even when
// the level is off, and it loses the structure`,
          notes: [
            { token: "the bottom-most Caused by", meaning: "usually where the real problem is" },
            { token: "a thread dump", meaning: "for a hang or a deadlock. jcmd Thread.print" },
            { token: "a heap dump + Eclipse MAT", meaning: "for a memory leak" },
            { token: "JFR", meaning: "about 1% overhead. Safe to leave on in production" },
          ],
          prompt:
            "Log the values so the message is only formatted when debug logging is enabled.",
          starter: `log.debug();`,
          rules: {
            regex: ["log\\.debug\\s*\\(\\s*\"[^\"]*\\{\\}[^\"]*\"\\s*,\\s*total"],
            mustNot: ["\" + total"],
            hint: "log.debug(\"total={}\", total) — placeholders, with the values as arguments.",
            success:
              "Correct. Concatenating builds the string on every call whether or not debug is on — and in a request handler running thousands of times a second, that is measurable cost for output nobody reads.",
          },
          solution: `log.debug("total={}", total);`,
        },

        javascript: {
          body: [
            "Reproduced it. A bug you cannot trigger on demand is a bug you cannot know you have fixed.",
            "JavaScript's `console` is far more capable than most people use. `console.table` renders an array of objects as a real table, `console.dir` shows an object's structure, and `console.time`/`timeEnd` measures a section.",
            "`console.trace()` prints the call stack without stopping, which is how you find out who called something unexpectedly.",
            "The `debugger` statement drops you into DevTools or a Node inspector wherever it runs. In Node, `node --inspect-brk app.js` then opens Chrome DevTools against the process.",
            "Async stack traces used to be useless and are now good in both Chrome and Node — a trace through several awaits shows the logical chain rather than stopping at the event loop.",
            "The problem specific to this ecosystem is SOURCE MAPS. Minified production code produces traces naming `a.b.c` at line 1 column 40000, and a source map is what turns that back into your file and line.",
            "Upload them to your error tracker rather than serving them publicly, and check that your build actually generates them.",
            "For performance: the browser's Performance panel for anything user-facing, `--cpu-prof` for Node, and `performance.now()` for a quick measurement. Lighthouse gives you the numbers users actually experience.",
          ],
          predict: {
            ask: "A production error says `at a (main.min.js:1:40213)`. What do you need?",
            code: `TypeError: Cannot read properties of undefined
    at a (main.min.js:1:40213)`,
            choices: [
              { text: "A better error message from the code", why: "The message is accurate — the location is what is unusable, and a source map fixes that." },
              { text: "A source map, so the minified location maps back to your file and line", why: "Correct. The bundler can emit a .map file recording where each minified position came from. Upload it to your error tracker and the same error shows your original file, line and function name." },
              { text: "To disable minification in production", why: "That works and costs your users a much larger download. Source maps give you both." },
              { text: "The stack is unrecoverable", why: "It is fully recoverable with the map the build already can produce." },
            ],
            answer: 1,
          },
          example: `// console is more capable than most people use
console.table(users);              // an array of objects, as a table
console.dir(obj, { depth: null }); // the whole structure
console.trace();                   // the stack, without stopping
console.time("parse");
console.timeEnd("parse");          // parse: 12.4ms
console.group("request"); console.groupEnd();
console.assert(total > 0, "total was", total);

// stop here, wherever this runs
debugger;

// Node, with Chrome DevTools attached
// node --inspect-brk app.js   then chrome://inspect

// async traces are good now — through several awaits

// SOURCE MAPS turn a minified trace back into your code
//   at a (main.min.js:1:40213)
//   → at handleSubmit (src/Login.tsx:42:7)
// generate them in the build, upload them to your error tracker,
// and do not serve them publicly

// unhandled failures — catch them centrally
window.addEventListener("error", (e) => report(e.error));
window.addEventListener("unhandledrejection", (e) => report(e.reason));
process.on("uncaughtException", report);
process.on("unhandledRejection", report);

// MEASURE
performance.now();                 // a quick timing
node --cpu-prof app.js             // a .cpuprofile for DevTools
// the browser: the Performance panel, and Lighthouse

// and the memory panel for a leak: take two heap snapshots
// with the suspect action in between, and compare`,
          notes: [
            { token: "console.table / dir / trace", meaning: "far more than console.log" },
            { token: "--inspect-brk", meaning: "Chrome DevTools against a Node process" },
            { token: "source maps", meaning: "turn a minified trace back into your code" },
            { token: "two heap snapshots", meaning: "with the suspect action between. Compare them" },
          ],
          prompt:
            "Catch promise rejections that nothing handled, so they are reported rather than lost.",
          starter: `window.addEventListener("", (e) => report(e.reason));`,
          rules: {
            regex: ["addEventListener\\s*\\(\\s*\"unhandledrejection\"\\s*,"],
            hint: "\"unhandledrejection\" — all lower case, unlike most event names.",
            success:
              "Correct, and note the lower-casing: it is `unhandledrejection` in the browser and `unhandledRejection` in Node, which catches people moving between the two.",
          },
          solution: `window.addEventListener("unhandledrejection", (e) => report(e.reason));`,
        },

        rust: {
          body: [
            "Reproduced it. A bug you cannot trigger on demand is a bug you cannot know you have fixed.",
            "Rust removes whole categories of bug before this stage — no null dereferences, no use-after-free, no data races in safe code. What remains is logic errors, panics, and performance.",
            "For a panic, `RUST_BACKTRACE=1` gives you the stack. Without it you get the message and the line and nothing else, and almost everyone forgets it the first time.",
            "`RUST_BACKTRACE=full` includes the runtime's own frames, which is occasionally useful and usually noise.",
            "`dbg!(x)` is the built-in print-debugging macro and it is genuinely well designed: it prints the file, the line, the EXPRESSION and the value, and returns the value — so you can wrap it around any expression without restructuring the code.",
            "`println!(\"{:?}\", x)` needs `Debug`, and `{:#?}` pretty-prints across several lines. `#[derive(Debug)]` is worth putting on almost every struct.",
            "For a real debugger, `rust-gdb` and `rust-lldb` are wrappers that add pretty-printers, so a `Vec` shows its contents rather than a pointer and two integers.",
            "For performance, `cargo flamegraph` in one command, and criterion for benchmarks that do the statistics properly. And measure in `--release`: debug builds can be ten to a hundred times slower, so a debug measurement tells you almost nothing.",
          ],
          predict: {
            ask: "What does dbg! do that println! does not?",
            code: `let x = dbg!(compute() * 2);`,
            choices: [
              { text: "Nothing — it is shorter", why: "It prints considerably more, and it returns the value so it can wrap an expression in place." },
              { text: "Prints the file, line, the EXPRESSION text and the value — and returns the value", why: "Correct. The output is `[src/main.rs:5] compute() * 2 = 84`, and because it returns the value you can wrap it around any expression without restructuring the code around it." },
              { text: "It only works in tests", why: "It works anywhere, and it writes to stderr, so it should be removed before release rather than left in." },
              { text: "It is faster", why: "It does more work, not less. The convenience is the point." },
            ],
            answer: 1,
          },
          example: `// a panic gives you the message and the line. Ask for the stack
RUST_BACKTRACE=1 cargo run
RUST_BACKTRACE=full cargo run     // including runtime frames

// dbg! prints the file, line, EXPRESSION and value — and returns it
let x = dbg!(compute() * 2);
// [src/main.rs:5] compute() * 2 = 84

// so it wraps anything, without restructuring
let total: i32 = v.iter().map(|x| dbg!(x * 2)).sum();

// Debug formatting — derive it on almost everything
#[derive(Debug)]
struct User { name: String, age: u32 }

println!("{:?}", user);           // User { name: "Ada", age: 36 }
println!("{:#?}", user);          // pretty, across several lines

// a real debugger, with Rust pretty-printers
rust-gdb target/debug/myapp
rust-lldb target/debug/myapp
// a Vec shows its contents rather than ptr/len/cap

// structured logging
use tracing::{info, debug, instrument};

#[instrument]                     // logs entry, exit and the arguments
fn process(id: u64) {
    debug!(total, "computed");
}

// PERFORMANCE — and measure in release. Debug can be 100× slower
cargo build --release
cargo flamegraph --bin myapp
// criterion for benchmarks, because it does the statistics

// undefined behaviour in unsafe code
cargo miri test`,
          notes: [
            { token: "RUST_BACKTRACE=1", meaning: "or a panic gives you no stack at all" },
            { token: "dbg!(expr)", meaning: "prints the expression and value, and returns it" },
            { token: "rust-gdb", meaning: "adds pretty-printers. A Vec shows its contents" },
            { token: "measure in --release", meaning: "debug builds can be 100× slower" },
          ],
          prompt:
            "Run it so that a panic prints the full stack rather than only the message.",
          starter: `=1 cargo run`,
          rules: {
            regex: ["RUST_BACKTRACE=1\\s+cargo\\s+run"],
            hint: "RUST_BACKTRACE=1 cargo run",
            success:
              "Correct, and it is worth exporting in your shell: a panic without a backtrace tells you which line panicked and nothing about how you reached it, which for a library call is usually the part you need.",
          },
          solution: `RUST_BACKTRACE=1 cargo run`,
        },
      },
    },
  ],
};
