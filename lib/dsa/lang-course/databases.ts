import type { TopicLesson } from "@/lib/dsa/lessons/types";
import { traceInjection, traceNPlusOne, tracePool } from "@/lib/dsa/viz/traceLang";

// Language track, topic 15.
//
// The one topic here with a genuine security lesson at its centre. Section 1 is
// the same in every language and the most important thing in the whole advanced
// band, so it goes first rather than after the connection mechanics.

export const LANG_DATABASES: TopicLesson = {
  id: "lang-databases",
  title: "Databases",
  tagline: "Storing data that outlives the program.",
  why:
    "A program's memory disappears when it stops. A database is where the data that matters lives, and talking to one badly is how the most common serious security hole in software gets written — and how a page that should take 10ms takes 600.",
  plain: [
    "Never build a query by joining strings. Send the query and the values separately.",
    "Opening a connection is expensive, so a pool keeps them open and lends them out.",
    "A round trip costs far more than the query, so the number of queries matters more than their complexity.",
    "A transaction makes several changes happen together, or not at all.",
  ],
  needs: ["Error Handling — every database call can fail.", "Networking, since a database call is a network call."],
  traps: [
    "String-concatenated queries. This is SQL injection, and it is still the most common serious vulnerability in software.",
    "Escaping instead of parameterising. Placeholders are the fix; escaping is a fix you can get wrong.",
    "A connection borrowed and never returned. The pool empties and the application stops with no error.",
    "A query inside a loop. One round trip per iteration is how a fast page becomes a slow one.",
    "Forgetting to commit or roll back. An open transaction holds locks and blocks other work.",
  ],
  sections: [
    /* ------------------------------------------------------ injection -- */
    {
      id: "injection",
      kicker: "01",
      title: "Never build a query with +",
      hook:
        "Your login form works. Someone types `' OR '1'='1` as the username and gets in as the first user in the table. What did your code do?",
      body: [
        "It joined their input into the query string, so their quote closed the string your query was building — and everything after it became SQL rather than data.",
        "That is SQL INJECTION, and it has been the most common serious vulnerability in software for twenty-five years. It is also completely preventable with one habit.",
        "The root cause is not the quote character. It is that the query and the value travelled to the database as ONE string, so nothing could tell where the command ended and the data began.",
        "A PARAMETERISED query sends them separately. The SQL goes first with a `?` where the value belongs; the database parses it; then the value arrives as data and cannot change the query's shape whatever it contains.",
        "So the fix is a habit rather than a technique: every value that varies goes in a placeholder, always, even when you are certain the input is safe.",
        "Escaping is NOT the fix. Escaping is a thing you can get wrong, get right for one database and wrong for another, or forget in one place out of fifty. Placeholders cannot be got wrong.",
        "One limit worth knowing: placeholders work for VALUES only. You cannot parameterise a table name, a column name or the direction of an ORDER BY — those must come from a fixed list in your own code.",
        "C++ has no standard database API, so this means a library — and every one of them supports placeholders. SQLite's own C API, libpqxx for Postgres, and SOCI as a general layer all do.",
      ],
      predict: {
        ask: "Which of these is safe?",
        code: `// A
string q = "SELECT * FROM users WHERE name = '" + name + "'";

// B
string q = "SELECT * FROM users WHERE name = '" + escape(name) + "'";

// C
stmt.prepare("SELECT * FROM users WHERE name = ?");
stmt.bind(1, name);`,
        choices: [
          { text: "B and C", why: "Escaping is a technique that can be got wrong — a wrong character set or a missed call reopens the hole." },
          { text: "Only C", why: "Correct. A placeholder sends the query and the value separately, so the value can never be parsed as SQL. Escaping is a defence you have to apply correctly every time, and it has failed in practice many times." },
          { text: "All three, if name is validated first", why: "Validation is worth doing and is not a substitute — the boundary between query and data is what matters." },
          { text: "Only B, since C depends on the driver", why: "Every real driver implements placeholders by sending the value separately. That is what makes them safe." },
        ],
        answer: 1,
      },
      viz: traceInjection(),
      example: `// no standard database API. Every library supports placeholders:
//   sqlite3 C API   libpqxx (Postgres)   SOCI (general)

#include <sqlite3.h>

sqlite3_stmt* stmt;
sqlite3_prepare_v2(db,
  "SELECT id, email FROM users WHERE name = ? AND age > ?",
  -1, &stmt, nullptr);

sqlite3_bind_text(stmt, 1, name.c_str(), -1, SQLITE_TRANSIENT);
sqlite3_bind_int(stmt, 2, minAge);

while (sqlite3_step(stmt) == SQLITE_ROW) {
  int id = sqlite3_column_int(stmt, 0);
  const unsigned char* email = sqlite3_column_text(stmt, 1);
  handle(id, email);
}
sqlite3_finalize(stmt);          // or it leaks

// NEVER
string bad = "SELECT * FROM users WHERE name = '" + name + "'";

// placeholders are for VALUES only. A column name needs an allowlist
static const set<string> SORTABLE = {"name", "age", "created_at"};
if (!SORTABLE.count(column)) throw invalid_argument("bad column");
string q = "SELECT * FROM users ORDER BY " + column;   // now safe

// a prepared statement is also FASTER when reused — the database
// parses and plans it once, then runs it with different values`,
      notes: [
        { token: "prepare then bind", meaning: "the query and the values travel separately" },
        { token: "?", meaning: "a placeholder. The value can never become SQL" },
        { token: "escaping", meaning: "not the fix. It is a thing you can get wrong" },
        { token: "column names", meaning: "cannot be parameterised. Use an allowlist" },
      ],
      challenge: {
        prompt:
          "Rewrite the query so the name is sent as a value rather than joined into the SQL.",
        starter: `string q = "SELECT * FROM users WHERE name = '" + name + "'";

sqlite3_prepare_v2(db, q.c_str(), -1, &stmt, nullptr);`,
        rules: {
          regex: ["\"SELECT \\* FROM users WHERE name = \\?\"", "sqlite3_bind_text\\s*\\(\\s*stmt\\s*,\\s*1\\s*,\\s*name"],
          mustNot: ["+ name +"],
          hint: "Put a ? in the SQL, then sqlite3_bind_text(stmt, 1, name.c_str(), -1, SQLITE_TRANSIENT).",
          success:
            "Correct. SQLITE_TRANSIENT is worth understanding too: it tells SQLite to copy the string, because your std::string may be gone before the statement runs.",
        },
        solution: `sqlite3_prepare_v2(db, "SELECT * FROM users WHERE name = ?", -1, &stmt, nullptr);

sqlite3_bind_text(stmt, 1, name.c_str(), -1, SQLITE_TRANSIENT);`,
      },

      alt: {
        c: {
          body: [
            "It joined their input into the query string, so their quote closed the string your query was building — and everything after it became SQL rather than data.",
            "That is SQL injection, and C is where it is easiest to write, because building a string with `sprintf` is the most natural thing in the world here.",
            "It is also where the consequences are worst, since `sprintf` into a fixed buffer adds a buffer overflow to the injection.",
            "The fix is the same as everywhere: prepared statements with placeholders. Every C database library supports them.",
            "SQLite's API is the one to learn from, because it is small and it ships in the standard distribution of almost everything. `sqlite3_prepare_v2`, then `sqlite3_bind_*`, then `sqlite3_step` in a loop, then `sqlite3_finalize`.",
            "The `finalize` is not optional. A prepared statement holds resources and a database lock, and forgetting it leaks both — which for a long-running program means the database eventually refuses to write.",
            "For Postgres, libpq's `PQexecParams` takes the query and an array of values as separate arguments, which is the same idea with a different shape.",
            "And note what SQLITE_TRANSIENT means when binding text: copy this string, because I cannot promise it will still exist. Passing SQLITE_STATIC for a buffer you then free is a use-after-free.",
          ],
          predict: {
            ask: "How many bugs are in this line?",
            code: `char q[256];
sprintf(q, "SELECT * FROM users WHERE name = '%s'", name);`,
            choices: [
              { text: "One — SQL injection", why: "There is also no bound on what sprintf writes into a 256-byte buffer." },
              { text: "Two — SQL injection, and a buffer overflow if name is long", why: "Correct. A quote in name breaks out of the SQL, and a name longer than about 220 characters writes past the end of q. snprintf fixes the second and not the first; only a prepared statement fixes both." },
              { text: "None if name is validated", why: "Validation helps and is not the boundary. Both bugs come from building the command and the data as one string in a fixed buffer." },
              { text: "One — the buffer overflow", why: "The injection is the more serious of the two, and both are real." },
            ],
            answer: 1,
          },
          example: `#include <sqlite3.h>

/* NEVER. Two bugs in one line */
char q[256];
sprintf(q, "SELECT * FROM users WHERE name = '%s'", name);

/* prepared statement: the query and the values travel separately */
sqlite3_stmt *stmt = NULL;

int rc = sqlite3_prepare_v2(db,
    "SELECT id, email FROM users WHERE name = ? AND age > ?",
    -1, &stmt, NULL);
if (rc != SQLITE_OK) { fprintf(stderr, "%s\\n", sqlite3_errmsg(db)); return -1; }

sqlite3_bind_text(stmt, 1, name, -1, SQLITE_TRANSIENT);  /* copies it */
sqlite3_bind_int(stmt, 2, min_age);

while ((rc = sqlite3_step(stmt)) == SQLITE_ROW) {
  int id = sqlite3_column_int(stmt, 0);
  const unsigned char *email = sqlite3_column_text(stmt, 1);
  handle(id, email);
}
if (rc != SQLITE_DONE) fprintf(stderr, "%s\\n", sqlite3_errmsg(db));

sqlite3_finalize(stmt);        /* NOT optional — it holds a lock */

/* SQLITE_TRANSIENT copies. SQLITE_STATIC does not — passing that
   for a buffer you then free is a use-after-free */

/* Postgres: the same idea, a different shape */
const char *params[] = { name };
PGresult *res = PQexecParams(conn,
    "SELECT id FROM users WHERE name = $1",
    1, NULL, params, NULL, NULL, 0);`,
          notes: [
            { token: "sprintf into a query", meaning: "injection AND a buffer overflow" },
            { token: "prepare, bind, step, finalize", meaning: "the SQLite sequence" },
            { token: "sqlite3_finalize", meaning: "not optional. It holds a database lock" },
            { token: "SQLITE_TRANSIENT", meaning: "copy the string. STATIC promises it will live" },
          ],
          prompt:
            "Bind the name as a value, copying it, rather than joining it into the SQL.",
          starter: `sqlite3_prepare_v2(db, "SELECT * FROM users WHERE name = ", -1, &stmt, NULL);

sqlite3_bind_text(stmt, 1, name, -1, );`,
          rules: {
            regex: ["\"SELECT \\* FROM users WHERE name = \\?\"", "sqlite3_bind_text\\s*\\(\\s*stmt\\s*,\\s*1\\s*,\\s*name\\s*,\\s*-1\\s*,\\s*SQLITE_TRANSIENT\\s*\\)"],
            hint: "A ? in the SQL, and SQLITE_TRANSIENT as the last bind argument.",
            success:
              "Correct. The -1 says 'work the length out yourself, it is null-terminated' — passing a real length is faster when you already know it.",
          },
          solution: `sqlite3_prepare_v2(db, "SELECT * FROM users WHERE name = ?", -1, &stmt, NULL);

sqlite3_bind_text(stmt, 1, name, -1, SQLITE_TRANSIENT);`,
        },

        python: {
          body: [
            "It used an f-string, so their quote closed the string your query was building — and everything after it became SQL rather than data.",
            "This is worth being blunt about: an f-string in a query is a security bug. It is the most common way SQL injection gets written in Python, precisely because f-strings are so pleasant everywhere else.",
            "The fix is a placeholder and a separate tuple of values. The exact placeholder depends on the driver — `?` for sqlite3, `%s` for psycopg and MySQL — and the principle is identical.",
            "That `%s` is NOT string formatting. It looks like it and it is a placeholder the driver replaces safely. `cur.execute(q % values)` is the injection; `cur.execute(q, values)` is the fix, and the difference is one character.",
            "Python's DB-API 2.0 means every driver has the same shape: `connect`, `cursor`, `execute`, `fetchone`/`fetchall`, `commit`. Learn it once and sqlite3, psycopg and mysqlclient all follow it.",
            "`executemany` sends one statement with many value tuples, which is far faster than a loop of executes for bulk inserts.",
            "Use the connection as a context manager where the driver supports it — in sqlite3, `with conn:` commits on success and rolls back on an exception, which is exactly what you want.",
            "And SQLAlchemy is worth knowing: even its plain-SQL mode gives you named placeholders and connection pooling without adopting the whole ORM.",
          ],
          predict: {
            ask: "Which of these is safe?",
            code: `# A
cur.execute(f"SELECT * FROM users WHERE name = '{name}'")

# B
cur.execute("SELECT * FROM users WHERE name = %s" % name)

# C
cur.execute("SELECT * FROM users WHERE name = %s", (name,))`,
            choices: [
              { text: "B and C", why: "The % operator in B is Python string formatting — it builds the same unsafe string an f-string would." },
              { text: "Only C", why: "Correct. Passing the values as a second ARGUMENT lets the driver send them separately. The % in B is Python's own formatting operator doing the concatenation before execute ever sees it — one character from the safe version, and completely different." },
              { text: "All three", why: "A and B both build one string containing both the query and the value." },
              { text: "Only A, since f-strings escape automatically", why: "f-strings do no escaping at all. They are plain interpolation." },
            ],
            answer: 1,
          },
          example: `import sqlite3

# NEVER — both of these are injection
cur.execute(f"SELECT * FROM users WHERE name = '{name}'")
cur.execute("SELECT * FROM users WHERE name = '%s'" % name)

# the fix: values as a separate ARGUMENT
cur.execute("SELECT * FROM users WHERE name = ? AND age > ?", (name, 18))
#                                              ^ sqlite3 uses ?
#   psycopg and MySQL use %s — still a placeholder, not formatting

# the trailing comma matters — (name) is not a tuple, (name,) is

for row in cur.fetchall():
    handle(row)

# named placeholders read better with many values
cur.execute(
    "INSERT INTO users (name, age) VALUES (:name, :age)",
    {"name": name, "age": age},
)

# bulk: one statement, many value tuples. Far faster than a loop
cur.executemany("INSERT INTO users (name, age) VALUES (?, ?)", rows)

# sqlite3's connection context manager commits or rolls back
with sqlite3.connect("app.db") as conn:
    conn.execute("UPDATE users SET age = ? WHERE id = ?", (age, uid))
# committed on success, rolled back on an exception

# rows as dicts rather than tuples
conn.row_factory = sqlite3.Row
row = conn.execute("SELECT * FROM users").fetchone()
print(row["name"])`,
          notes: [
            { token: "an f-string in a query", meaning: "a security bug. Never do it" },
            { token: "execute(q, values)", meaning: "a comma, not a %. That is the whole fix" },
            { token: "(name,)", meaning: "the trailing comma. (name) is not a tuple" },
            { token: "executemany", meaning: "one statement, many values. For bulk inserts" },
          ],
          prompt:
            "Rewrite the query so the name is passed as a value rather than formatted into the string.",
          starter: `cur.execute(f"SELECT * FROM users WHERE name = '{name}'")`,
          rules: {
            regex: ["cur\\.execute\\s*\\(\\s*\"SELECT \\* FROM users WHERE name = \\?\"\\s*,\\s*\\(\\s*name\\s*,\\s*\\)\\s*\\)"],
            mustNot: ["f\"SELECT"],
            hint: "cur.execute(\"SELECT * FROM users WHERE name = ?\", (name,)) — note the trailing comma.",
            success:
              "Correct, and the trailing comma is a real trap: `(name)` is just name in brackets, and the driver would try to iterate the string as a sequence of parameters.",
          },
          solution: `cur.execute("SELECT * FROM users WHERE name = ?", (name,))`,
        },

        java: {
          body: [
            "It concatenated their input into the query string, so their quote closed the string your query was building — and everything after it became SQL rather than data.",
            "Java's fix has been in the standard library since 1997: `PreparedStatement`. Use it for every query with a value in it, without exception.",
            "The distinction to learn is `Statement` versus `PreparedStatement`. `Statement.executeQuery(sql)` takes a complete string and is where injection lives. `PreparedStatement` takes a query with `?` placeholders and separate `setX` calls.",
            "The parameter indexes start at ONE, not zero. That catches everyone once, and the error — a parameter index out of range — is at least clear about what happened.",
            "`setString`, `setInt`, `setLong`, `setTimestamp` and friends each tell the driver the type, which is why there is no ambiguity about how to send the value.",
            "Use try-with-resources for the `Connection`, the `PreparedStatement` and the `ResultSet`. All three are `AutoCloseable`, and a leaked one holds a database resource until the process ends.",
            "A `PreparedStatement` is also faster when reused: the database parses and plans it once and then executes it with different values, which is why batch inserts through one are dramatically quicker than individual statements.",
            "JDBC is the layer underneath everything — JPA, Hibernate, jOOQ and Spring's JdbcTemplate all sit on it — so knowing this shape means recognising what those are doing.",
          ],
          predict: {
            ask: "What is wrong here?",
            code: `PreparedStatement ps = conn.prepareStatement(
    "SELECT * FROM users WHERE name = ?");

ps.setString(0, name);`,
            choices: [
              { text: "Nothing — indexes start at 0", why: "JDBC parameter indexes start at 1, following the SQL convention rather than the Java one." },
              { text: "Parameter indexes start at 1, so this throws", why: "Correct. JDBC follows SQL's 1-based convention rather than Java's 0-based one, and setString(0, ...) throws SQLException: parameter index out of range." },
              { text: "setString should be setObject", why: "setString is exactly right for a string value. The index is the problem." },
              { text: "The query needs a semicolon", why: "JDBC does not require one, and adding it is harmless." },
            ],
            answer: 1,
          },
          example: `import java.sql.*;

// try-with-resources on all three — each holds a database resource
try (Connection conn = dataSource.getConnection();
     PreparedStatement ps = conn.prepareStatement(
         "SELECT id, email FROM users WHERE name = ? AND age > ?")) {

  ps.setString(1, name);            // indexes start at ONE
  ps.setInt(2, 18);

  try (ResultSet rs = ps.executeQuery()) {
    while (rs.next()) {
      long id = rs.getLong("id");
      String email = rs.getString("email");
      handle(id, email);
    }
  }
}

// NEVER — this is where injection lives
Statement st = conn.createStatement();
st.executeQuery("SELECT * FROM users WHERE name = '" + name + "'");

// batching: one round trip, and the plan is reused
try (var ps = conn.prepareStatement("INSERT INTO users (name) VALUES (?)")) {
  for (String n : names) {
    ps.setString(1, n);
    ps.addBatch();
  }
  ps.executeBatch();
}

// getting a generated key back
try (var ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
  ps.executeUpdate();
  try (var keys = ps.getGeneratedKeys()) {
    if (keys.next()) long id = keys.getLong(1);
  }
}

// JDBC is the layer under JPA, Hibernate, jOOQ and JdbcTemplate`,
          notes: [
            { token: "PreparedStatement", meaning: "always. Statement is where injection lives" },
            { token: "indexes start at 1", meaning: "SQL's convention, not Java's" },
            { token: "try-with-resources ×3", meaning: "connection, statement and result set all close" },
            { token: "addBatch / executeBatch", meaning: "one round trip for many inserts" },
          ],
          prompt:
            "Bind both parameters correctly, remembering where JDBC starts counting.",
          starter: `ps.setString(, name);
ps.setInt(, 18);`,
          rules: {
            regex: ["ps\\.setString\\s*\\(\\s*1\\s*,\\s*name\\s*\\)", "ps\\.setInt\\s*\\(\\s*2\\s*,\\s*18\\s*\\)"],
            hint: "setString(1, name) and setInt(2, 18) — the first placeholder is 1.",
            success:
              "Correct. The 1-based indexing comes from SQL rather than Java, and it is consistent: ResultSet columns are 1-based too, which is why rs.getString(1) is the first column.",
          },
          solution: `ps.setString(1, name);
ps.setInt(2, 18);`,
        },

        javascript: {
          body: [
            "It used a template literal, so their quote closed the string your query was building — and everything after it became SQL rather than data.",
            "Template literals make this especially easy to write, because `` `WHERE name = '${name}'` `` looks so much like the right answer.",
            "Every Node database driver supports placeholders. `pg` uses `$1`, `$2`; `mysql2` uses `?`; `better-sqlite3` uses `?` or named parameters. All of them take the values as a separate array.",
            "There is one genuinely elegant option here that the other languages do not have: TAGGED TEMPLATE literals. Libraries like `postgres` and `@vercel/postgres` let you write `` sql`SELECT * FROM users WHERE name = ${name}` `` and it is SAFE.",
            "That works because a tagged template hands the function the static strings and the interpolated values SEPARATELY. The library then builds a parameterised query from them — the value never becomes part of the SQL text.",
            "It is worth understanding why, because it means the safety depends on the tag: `` sql`...` `` is parameterised, and plain `` `...` `` passed to `query()` is injection.",
            "For prepared statements, `better-sqlite3` is the clearest: `db.prepare(sql)` once, then `.get()`, `.all()` or `.run()` with values, and the statement is reused.",
            "And whatever you use, pool the connections. `pg.Pool` rather than `pg.Client`, created once at startup, is the standard shape.",
          ],
          predict: {
            ask: "Why is the tagged version safe?",
            code: `// A
db.query(\`SELECT * FROM users WHERE name = '\${name}'\`);

// B
sql\`SELECT * FROM users WHERE name = \${name}\`;`,
            choices: [
              { text: "They are the same — both interpolate", why: "A tagged template does not interpolate at all; the tag function receives the pieces separately." },
              { text: "The tag receives the static strings and the values as separate arguments, so it can parameterise them", why: "Correct. In A the interpolation happens first and query() receives one finished string. In B the sql function is handed [\"SELECT ... = \", \"\"] and [name] separately, and builds a parameterised query — the value never enters the SQL text." },
              { text: "The tag escapes the value", why: "It parameterises rather than escaping, which is the stronger guarantee." },
              { text: "B only works for strings", why: "It works for any value the driver can send, including numbers, dates and arrays." },
            ],
            answer: 1,
          },
          example: `// NEVER — a template literal built into a query string
db.query(\`SELECT * FROM users WHERE name = '\${name}'\`);

// pg: numbered placeholders, values in an array
import { Pool } from "pg";
const pool = new Pool({ max: 10 });        // ONE pool, at startup

const { rows } = await pool.query(
  "SELECT id, email FROM users WHERE name = $1 AND age > $2",
  [name, 18],
);

// mysql2: ? placeholders
const [rows2] = await conn.execute(
  "SELECT * FROM users WHERE name = ? AND age > ?",
  [name, 18],
);

// better-sqlite3: prepare once, reuse. Synchronous, and fast
const stmt = db.prepare("SELECT * FROM users WHERE name = ?");
const row = stmt.get(name);
const all = stmt.all(name);

// TAGGED TEMPLATES — safe, because the tag gets the pieces apart
import postgres from "postgres";
const sql = postgres();

const users = await sql\`
  SELECT * FROM users WHERE name = \${name} AND age > \${18}
\`;
// the values become $1 and $2. They never enter the SQL text

// the safety depends on the TAG. Plain \`...\` into query() is injection

// identifiers still need an allowlist
const SORTABLE = new Set(["name", "age", "created_at"]);
if (!SORTABLE.has(column)) throw new Error("bad column");`,
          notes: [
            { token: "a template literal in query()", meaning: "injection. The most common way to write it here" },
            { token: "$1 / ?", meaning: "placeholders, with the values in a separate array" },
            { token: "sql`...`", meaning: "a tagged template. The tag gets the values apart" },
            { token: "one Pool at startup", meaning: "not a Client per request" },
          ],
          prompt:
            "Pass the values separately rather than interpolating them into the query.",
          starter: `const { rows } = await pool.query(
  \`SELECT * FROM users WHERE name = '\${name}' AND age > \${18}\`
);`,
          rules: {
            regex: ["\"SELECT \\* FROM users WHERE name = \\$1 AND age > \\$2\"\\s*,\\s*\\[\\s*name\\s*,\\s*18\\s*\\]"],
            mustNot: ["${name}"],
            hint: "pool.query(\"SELECT * FROM users WHERE name = $1 AND age > $2\", [name, 18])",
            success:
              "Correct. The numbering is pg's convention — mysql2 uses ? instead — and in both cases the second argument is what keeps the values out of the SQL text.",
          },
          solution: `const { rows } = await pool.query(
  "SELECT * FROM users WHERE name = $1 AND age > $2",
  [name, 18],
);`,
        },

        rust: {
          body: [
            "It used `format!`, so their quote closed the string your query was building — and everything after it became SQL rather than data.",
            "Rust cannot prevent that: `format!` is a normal macro and a query is a normal string. What Rust's ecosystem adds is something stronger, and it is worth knowing about.",
            "`sqlx` checks your SQL AT COMPILE TIME against a real database. The `query!` macro connects to your development database during the build, verifies the query parses, and derives the types of the parameters and the returned columns.",
            "So a typo in a column name is a compile error. A parameter of the wrong type is a compile error. A query returning three columns bound into a two-field struct is a compile error.",
            "That is genuinely unusual, and it means a large class of database bugs never reaches run time. The cost is that the build needs database access, or a checked-in `.sqlx` cache directory for offline builds.",
            "Placeholders follow the database: `$1` for Postgres, `?` for SQLite and MySQL. `sqlx` binds them with `.bind(value)`, or takes them directly in the `query!` macro.",
            "`rusqlite` is the direct SQLite binding and follows the C API's shape with Rust types on top: `prepare`, then `query_map` with a closure turning each row into your type.",
            "And `diesel` is the ORM option, with compile-time checking of a different kind — a schema generated from your migrations, and queries built from typed expressions rather than strings.",
          ],
          predict: {
            ask: "What does the query! macro check at compile time?",
            code: `let user = sqlx::query!(
    "SELECT id, emial FROM users WHERE name = $1",
    name
).fetch_one(&pool).await?;`,
            choices: [
              { text: "Nothing — it is a normal macro", why: "It connects to a development database during the build and validates the SQL against the real schema." },
              { text: "That the SQL parses and the columns exist — so `emial` is a compile error", why: "Correct. sqlx prepares the query against your development database at build time, so a misspelled column fails the build rather than the request. It also derives the parameter and result types from the schema." },
              { text: "Only that the parameter count matches", why: "It checks the count and the types and the column names, because it asks the database directly." },
              { text: "That the database is running", why: "It does need a reachable database or a cached .sqlx directory, and the checking goes considerably further than that." },
            ],
            answer: 1,
          },
          example: `// sqlx: the query is checked against a REAL database at BUILD time
use sqlx::PgPool;

let pool = PgPool::connect(&url).await?;    // ONE pool, at startup

// a misspelled column here is a COMPILE error
let user = sqlx::query!(
    "SELECT id, email FROM users WHERE name = $1 AND age > $2",
    name,
    18,
)
.fetch_one(&pool)
.await?;

println!("{}", user.email);      // the type came from the schema

// straight into your own struct
#[derive(sqlx::FromRow)]
struct User { id: i64, email: String }

let users: Vec<User> = sqlx::query_as::<_, User>(
    "SELECT id, email FROM users WHERE age > $1"
)
.bind(18)
.fetch_all(&pool)
.await?;

// NEVER
let bad = format!("SELECT * FROM users WHERE name = '{}'", name);

// rusqlite: the direct SQLite binding
let mut stmt = conn.prepare("SELECT id, email FROM users WHERE name = ?1")?;
let rows = stmt.query_map([name], |row| {
    Ok(User { id: row.get(0)?, email: row.get(1)? })
})?;

// offline builds need the .sqlx cache committed:
//   cargo sqlx prepare`,
          notes: [
            { token: "sqlx::query!", meaning: "checked against a real database at build time" },
            { token: "a typo is a compile error", meaning: "including column names and types" },
            { token: "$1 / ?1", meaning: "the placeholder depends on the database" },
            { token: "cargo sqlx prepare", meaning: "the cache that lets CI build without a database" },
          ],
          prompt:
            "Use the checked macro with the name passed as a parameter rather than formatted in.",
          starter: `let user = sqlx::!(
    "SELECT id, email FROM users WHERE name = ",
    name
).fetch_one(&pool).await?;`,
          rules: {
            regex: ["sqlx::query!\\s*\\(", "WHERE name = \\$1"],
            hint: "sqlx::query!(\"... WHERE name = $1\", name)",
            success:
              "Correct. The macro is doing two jobs at once: the $1 keeps the value out of the SQL, and the build-time check means a wrong column or type never compiles.",
          },
          solution: `let user = sqlx::query!(
    "SELECT id, email FROM users WHERE name = $1",
    name
).fetch_one(&pool).await?;`,
        },
      },
    },

    /* -------------------------------------------------------- pooling -- */
    {
      id: "pooling",
      kicker: "02",
      title: "The connection you keep",
      hook:
        "Your query takes 2ms and your endpoint takes 80ms. The database says the query was fast. Where did the time go?",
      body: [
        "Into opening a connection. A TCP handshake, usually TLS, then authentication, then session setup — often fifty times longer than the query itself.",
        "A CONNECTION POOL keeps a set of connections open and lends them out. A query borrows one, uses it, returns it, and the setup happened once at startup.",
        "So the rule is: create the pool once, when the application starts, and share it. Creating one per request is the same mistake as creating an HTTP client per request, with a bigger penalty.",
        "The size matters in both directions, and people usually guess too high. Too small and requests queue; too large and you exhaust the DATABASE.",
        "That second failure is the surprising one. Postgres defaults to about 100 connections in total, and each one costs it memory — so ten application instances with a pool of fifty each ask for five hundred, and the database starts refusing.",
        "A useful starting point is small: roughly twice your core count per instance, then measure. The database is usually the bottleneck, and a larger pool means more contention rather than more throughput.",
        "The failure to guard against is a connection borrowed and never returned. Leak a few and the pool empties, every request queues, and the application stops with no error message anywhere.",
        "C++ has no standard pool, so this is your library's — or yours to write, in which case the shape is a queue of connections plus a mutex and a condition variable.",
      ],
      predict: {
        ask: "Ten application instances, each with a pool of 50. Postgres allows 100 connections. What happens?",
        code: `// max_connections = 100 in postgresql.conf
// 10 instances × 50 pool size`,
        choices: [
          { text: "Each instance gets 10 connections", why: "The database does not divide its limit between clients — it accepts until it hits the limit and then refuses." },
          { text: "The first instances fill the limit and the rest fail with 'too many connections'", why: "Correct. Pools open connections on demand up to their maximum, so the first two instances can consume the entire limit. The rest get connection errors under load, which looks like a random outage." },
          { text: "Postgres queues the extra connections", why: "It rejects them outright. Queuing is what a pooler like PgBouncer adds in front of it." },
          { text: "The pools shrink automatically", why: "A pool has no knowledge of the server's limit or of the other instances." },
        ],
        answer: 1,
      },
      viz: tracePool(),
      example: `// no standard pool. Your library has one, or you write it

// the shape, if you write it: a queue plus a mutex and a condvar
class Pool {
  std::queue<Conn> free_;
  std::mutex m_;
  std::condition_variable cv_;
 public:
  Conn acquire() {
    std::unique_lock lk(m_);
    cv_.wait(lk, [&] { return !free_.empty(); });
    Conn c = std::move(free_.front());
    free_.pop();
    return c;
  }
  void release(Conn c) {
    { std::lock_guard lk(m_); free_.push(std::move(c)); }
    cv_.notify_one();
  }
};

// borrow it with RAII so it is ALWAYS returned
class Borrowed {
  Pool& p_; Conn c_;
 public:
  Borrowed(Pool& p) : p_(p), c_(p.acquire()) {}
  ~Borrowed() { p_.release(std::move(c_)); }   // even if we throw
  Conn* operator->() { return &c_; }
};

{
  Borrowed conn(pool);
  conn->execute(stmt);
}                            // returned here, on every path

// sizing: start at about cores × 2 per instance, then MEASURE.
// Remember the database's own limit is shared by every instance`,
      notes: [
        { token: "one pool, at startup", meaning: "not one per request" },
        { token: "RAII to return it", meaning: "or an exception leaks a connection" },
        { token: "cores × 2", meaning: "a starting point. Bigger is usually worse" },
        { token: "the database's limit", meaning: "shared across every instance you run" },
      ],
      challenge: {
        prompt:
          "Make the borrowed connection return itself however the scope is left.",
        starter: `class Borrowed {
  Pool& p_; Conn c_;
 public:
  Borrowed(Pool& p) : p_(p), c_(p.acquire()) {}
  () { p_.release(std::move(c_)); }
};`,
        rules: {
          regex: ["~Borrowed\\s*\\(\\s*\\)"],
          hint: "The destructor: ~Borrowed()",
          success:
            "Correct — RAII again, and this is the case where it matters most. A leaked connection does not crash anything; it silently shrinks the pool until the application stops responding.",
        },
        solution: `class Borrowed {
  Pool& p_; Conn c_;
 public:
  Borrowed(Pool& p) : p_(p), c_(p.acquire()) {}
  ~Borrowed() { p_.release(std::move(c_)); }
};`,
      },

      alt: {
        c: {
          body: [
            "Into opening a connection — a TCP handshake, usually TLS, then authentication and session setup, often fifty times longer than the query.",
            "C has no pool and no standard database API, so this is yours to build or your library's to provide.",
            "The shape is a fixed array of connections, a mutex, and a condition variable to wait on when none is free. That is the whole thing, and it is about forty lines.",
            "The discipline is the hard part. With no destructors, every path out of the code that borrowed a connection must return it — which is the goto-cleanup pattern once again.",
            "For SQLite there is usually nothing to pool: it is an embedded library, not a server, so a connection is a file handle. What matters there is the opposite advice — do not open and close the database per query, because each open re-reads the schema.",
            "SQLite also has a threading rule worth knowing: by default a connection may be used from several threads, and the safest arrangement is one connection per thread.",
            "For Postgres, PgBouncer is worth knowing about. It is a pooler that sits between your application and the database, so many short-lived clients share a small number of real connections — which is exactly what C programs without their own pool need.",
            "Whatever you do, set a connect timeout and a statement timeout. Without them a stalled database holds every thread you have.",
          ],
          predict: {
            ask: "Why does SQLite need less pooling than Postgres?",
            code: `sqlite3_open("app.db", &db);     /* a file handle */
PQconnectdb("host=... user=...");  /* a network session */`,
            choices: [
              { text: "SQLite is faster at connecting", why: "It is faster, and the deeper reason is that there is no server and no network involved at all." },
              { text: "It is embedded — a connection is a file handle, with no network, no TLS and no authentication", why: "Correct. Postgres has to do a TCP handshake, TLS and authentication per connection. SQLite opens a file. What still matters is not reopening per query, because each open re-reads the schema." },
              { text: "SQLite supports only one connection", why: "It supports many, and the usual arrangement is one per thread." },
              { text: "SQLite has a built-in pool", why: "There is nothing to pool — the cost that pooling avoids does not exist here." },
            ],
            answer: 1,
          },
          example: `/* no pool, and no standard database API. Build it, or use PgBouncer */

typedef struct {
  PGconn *conns[MAX_POOL];
  int free_count;
  pthread_mutex_t m;
  pthread_cond_t  cv;
} Pool;

PGconn *pool_acquire(Pool *p) {
  pthread_mutex_lock(&p->m);
  while (p->free_count == 0)
    pthread_cond_wait(&p->cv, &p->m);       /* wait for one back */
  PGconn *c = p->conns[--p->free_count];
  pthread_mutex_unlock(&p->m);
  return c;
}

void pool_release(Pool *p, PGconn *c) {
  pthread_mutex_lock(&p->m);
  p->conns[p->free_count++] = c;
  pthread_mutex_unlock(&p->m);
  pthread_cond_signal(&p->cv);              /* wake one waiter */
}

/* no destructors, so EVERY path must release it */
int handle(Pool *p) {
  PGconn *c = pool_acquire(p);
  int rc = -1;

  if (!run_query(c)) goto out;              /* not a bare return */
  rc = 0;

out:
  pool_release(p, c);                       /* always */
  return rc;
}

/* SQLite is embedded — a connection is a file handle. Little to pool,
   and one connection per thread is the safe arrangement */

/* PgBouncer sits in front of Postgres and pools for you, which is
   often the right answer for a C program */`,
          notes: [
            { token: "a mutex and a condvar", meaning: "the whole pool, in about forty lines" },
            { token: "goto out", meaning: "no destructors, so every path must release" },
            { token: "SQLite", meaning: "embedded. A connection is a file handle" },
            { token: "PgBouncer", meaning: "a pooler in front of the database. Often the answer" },
          ],
          prompt:
            "Wait until a connection is free before taking one — using the loop form rather than an if.",
          starter: `pthread_mutex_lock(&p->m);
 (p->free_count == 0)
  pthread_cond_wait(&p->cv, &p->m);`,
          rules: {
            regex: ["while\\s*\\(\\s*p->free_count\\s*==\\s*0\\s*\\)"],
            mustNot: ["if (p->free_count == 0)"],
            hint: "while, not if — a condition variable can wake spuriously.",
            success:
              "Correct, and this is a genuine rule rather than style: `pthread_cond_wait` may return without any signal at all, so the condition must be re-checked in a loop.",
          },
          solution: `pthread_mutex_lock(&p->m);
while (p->free_count == 0)
  pthread_cond_wait(&p->cv, &p->m);`,
        },

        python: {
          body: [
            "Into opening a connection — a TCP handshake, usually TLS, then authentication and session setup, often fifty times longer than the query.",
            "`sqlite3.connect` and `psycopg.connect` each give you ONE connection. Calling them per request is the mistake, and it is easy to make because the function is so convenient.",
            "For Postgres, `psycopg_pool.ConnectionPool` is the direct answer. Create it once at module level or in your application's startup, and use it as a context manager per query.",
            "SQLAlchemy's engine has pooling built in and is worth using even if you never touch the ORM. `create_engine(url)` once, then `engine.connect()` per query, and the pool is handled.",
            "Sizing follows the same rule as everywhere: start small. SQLAlchemy defaults to a pool of 5 with 10 overflow, which is a reasonable starting point for a single instance.",
            "Multiply by your worker count. `gunicorn -w 4` means four processes, each with its own pool — so a pool size of 20 is really 80 connections to the database.",
            "The leak to guard against is a connection borrowed and not returned. Always use the context manager: `with pool.connection() as conn:` returns it on every path, including an exception.",
            "SQLite is different: it is embedded, so there is little to pool. What matters there is check_same_thread and using one connection per thread, since a SQLite connection is not safe to share.",
          ],
          predict: {
            ask: "With gunicorn -w 4 and a pool of 20, how many database connections can this application open?",
            code: `# app.py
pool = ConnectionPool(url, max_size=20)

# gunicorn -w 4 app:app`,
            choices: [
              { text: "20 — the pool is shared", why: "Each worker is a separate PROCESS with its own memory, so each builds its own pool." },
              { text: "80 — each worker process has its own pool", why: "Correct. gunicorn workers are separate processes, so the module-level pool is created four times. Sizing has to account for the worker count, or you quietly ask the database for four times what you intended." },
              { text: "4 — one per worker", why: "Each worker has a whole pool, not a single connection." },
              { text: "It depends on the load", why: "The maximum is fixed at 80 by the arithmetic, whatever the load." },
            ],
            answer: 1,
          },
          example: `# ONE pool, created at startup. Not one per request
from psycopg_pool import ConnectionPool

pool = ConnectionPool(
    "postgresql://localhost/app",
    min_size=2,
    max_size=10,           # per PROCESS — multiply by your worker count
    timeout=5,             # give up waiting rather than hanging
)

# the context manager returns it on every path
with pool.connection() as conn:
    with conn.cursor() as cur:
        cur.execute("SELECT id FROM users WHERE name = %s", (name,))
        row = cur.fetchone()
# returned here, even if the body raised

# SQLAlchemy pools too, and you need not use the ORM
from sqlalchemy import create_engine, text

engine = create_engine(url, pool_size=5, max_overflow=10)

with engine.connect() as conn:
    result = conn.execute(text("SELECT id FROM users WHERE name = :n"),
                          {"n": name})

# SQLite is EMBEDDED — little to pool, and a connection is not
# safe to share between threads
conn = sqlite3.connect("app.db", check_same_thread=False)
# safer: one connection per thread, via threading.local()

# async
from psycopg_pool import AsyncConnectionPool
async with pool.connection() as conn:
    await conn.execute(...)`,
          notes: [
            { token: "one pool at startup", meaning: "connect() per request is the mistake" },
            { token: "max_size is PER PROCESS", meaning: "multiply by your gunicorn worker count" },
            { token: "with pool.connection()", meaning: "returns it on every path, exceptions included" },
            { token: "SQLite", meaning: "embedded. One connection per thread" },
          ],
          prompt:
            "Borrow a connection so it is returned however the block is left.",
          starter: ` pool.connection()  conn:
    conn.execute(sql)`,
          rules: {
            regex: ["with\\s+pool\\.connection\\s*\\(\\s*\\)\\s+as\\s+conn\\s*:"],
            hint: "with pool.connection() as conn:",
            success:
              "Correct. Calling pool.getconn() by hand works and needs a matching putconn in a finally — the context manager is the same thing with the mistake removed.",
          },
          solution: `with pool.connection() as conn:
    conn.execute(sql)`,
        },

        java: {
          body: [
            "Into opening a connection — a TCP handshake, usually TLS, then authentication and session setup, often fifty times longer than the query.",
            "`DriverManager.getConnection` opens a fresh one every time. It is fine in a script and wrong in a server, and it is what tutorials show.",
            "The answer is a `DataSource` backed by a pool. HikariCP is the standard choice, is the default in Spring Boot, and is genuinely fast.",
            "Create it once, share it, and get connections from it. `dataSource.getConnection()` borrows from the pool rather than opening anything.",
            "The crucial detail: `connection.close()` on a pooled connection does NOT close it — it returns it to the pool. So try-with-resources is exactly right, and the name is misleading.",
            "That also means a connection not closed is a connection leaked. Hikari will log a warning about a connection being out for longer than the leak-detection threshold, which is worth turning on.",
            "Sizing: HikariCP's own guidance is that a small pool is faster than a large one, and their suggested formula is around `cores × 2 + effective spindle count`. For most services that is under 20.",
            "Set `connectionTimeout` so a request waiting for a connection fails rather than hanging, and `maxLifetime` slightly below any idle timeout your database or load balancer enforces.",
          ],
          predict: {
            ask: "What does close() do on a pooled connection?",
            code: `try (Connection conn = dataSource.getConnection()) {
  // ...
}`,
            choices: [
              { text: "Closes the TCP connection to the database", why: "That would defeat the pool entirely — the connection would have to be reopened next time." },
              { text: "Returns it to the pool — which is why try-with-resources is exactly right", why: "Correct. A pooled connection wraps the real one, and close() hands it back for reuse. The name is misleading, and the consequence is that a connection you do not close is leaked rather than merely left open." },
              { text: "Nothing — pooled connections ignore close", why: "It is the mechanism for returning it. Ignoring close would leak every connection." },
              { text: "Rolls back any open transaction and closes it", why: "It does usually roll back an uncommitted transaction, and the connection itself goes back to the pool rather than being closed." },
            ],
            answer: 1,
          },
          example: `import com.zaxxer.hikari.*;

// ONE DataSource, at startup. Shared everywhere
HikariConfig cfg = new HikariConfig();
cfg.setJdbcUrl("jdbc:postgresql://localhost/app");
cfg.setUsername(user);
cfg.setPassword(pass);
cfg.setMaximumPoolSize(10);            // small is faster than large
cfg.setConnectionTimeout(5_000);       // fail rather than hang
cfg.setMaxLifetime(1_800_000);         // under the database's idle timeout
cfg.setLeakDetectionThreshold(30_000); // log a connection held too long

HikariDataSource ds = new HikariDataSource(cfg);

// close() RETURNS it to the pool. So try-with-resources is right
try (Connection conn = ds.getConnection();
     PreparedStatement ps = conn.prepareStatement(sql)) {
  ps.setString(1, name);
  try (ResultSet rs = ps.executeQuery()) { ... }
}                                      // returned here, on every path

// NEVER in a server — this opens a real connection every time
Connection c = DriverManager.getConnection(url, user, pass);

// a transaction: several changes together, or none
try (Connection conn = ds.getConnection()) {
  conn.setAutoCommit(false);
  try {
    debit(conn, from, amount);
    credit(conn, to, amount);
    conn.commit();
  } catch (SQLException e) {
    conn.rollback();
    throw e;
  }
}

// Spring Boot configures HikariCP for you from application.properties`,
          notes: [
            { token: "HikariCP", meaning: "the standard pool. Spring Boot's default" },
            { token: "close() returns it", meaning: "the name is misleading. Not closing is a leak" },
            { token: "small pools are faster", meaning: "Hikari's own guidance. Usually under 20" },
            { token: "leakDetectionThreshold", meaning: "logs a connection held too long. Turn it on" },
          ],
          prompt:
            "Wrap the transaction so it commits on success and rolls back on failure.",
          starter: `conn.setAutoCommit(false);
try {
  transfer(conn);
  conn.();
} catch (SQLException e) {
  conn.();
  throw e;
}`,
          rules: {
            regex: ["conn\\.commit\\s*\\(\\s*\\)", "conn\\.rollback\\s*\\(\\s*\\)"],
            hint: "conn.commit() in the try, conn.rollback() in the catch.",
            success:
              "Correct. Setting autoCommit back to true before returning the connection matters too — Hikari does that for you, and a pool that did not would hand the next borrower a connection in an unexpected state.",
          },
          solution: `conn.setAutoCommit(false);
try {
  transfer(conn);
  conn.commit();
} catch (SQLException e) {
  conn.rollback();
  throw e;
}`,
        },

        javascript: {
          body: [
            "Into opening a connection — a TCP handshake, usually TLS, then authentication and session setup, often fifty times longer than the query.",
            "In `pg`, the distinction is `Client` versus `Pool`. A `Client` is one connection you manage yourself. A `Pool` manages several and is what a server should use.",
            "Create the pool once, at module level or in your startup, and export it. A pool per request defeats the entire point.",
            "`pool.query(...)` is the simple form: it borrows a connection, runs the query, and returns it automatically. For a single query that is all you need.",
            "`pool.connect()` gives you a client you must `release()`. Use it when several queries must run on the SAME connection — which is what a transaction requires — and release it in a `finally`.",
            "That release is the leak to guard against. Forget it and the pool empties, every request queues on `connect`, and the application stops with no error thrown anywhere.",
            "Sizing has the same trap as elsewhere: with `cluster` or several containers, each process has its own pool. A `max` of 20 across ten containers is 200 connections.",
            "And serverless is its own problem: each function instance gets a pool, instances scale with traffic, and the database's limit arrives quickly. That is what connection proxies like PgBouncer, RDS Proxy and Prisma Accelerate exist for.",
          ],
          predict: {
            ask: "What is wrong here?",
            code: `const client = await pool.connect();

const r = await client.query("SELECT 1");
handle(r);

client.release();`,
            choices: [
              { text: "Nothing — release is called", why: "It is called only when nothing throws. If query or handle throws, the connection is never returned." },
              { text: "If query or handle throws, release never runs and the connection is leaked", why: "Correct. Wrap it in try/finally so the release happens on every path — or use pool.query() for a single query, which borrows and returns automatically." },
              { text: "connect() should be createClient()", why: "pool.connect() is the correct way to check a client out of a pg pool." },
              { text: "release() needs an argument", why: "It takes an optional error to destroy the connection rather than reuse it, and is normally called with none." },
            ],
            answer: 1,
          },
          example: `import { Pool } from "pg";

// ONE pool, at module level. Not one per request
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,                          // per PROCESS. Multiply by instances
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,   // fail rather than hang
});

// one query: borrow and return automatically
const { rows } = await pool.query("SELECT id FROM users WHERE name = $1",
                                  [name]);

// several queries on the SAME connection — a transaction
const client = await pool.connect();
try {
  await client.query("BEGIN");
  await client.query("UPDATE accounts SET balance = balance - $1 WHERE id = $2",
                     [amount, from]);
  await client.query("UPDATE accounts SET balance = balance + $1 WHERE id = $2",
                     [amount, to]);
  await client.query("COMMIT");
} catch (e) {
  await client.query("ROLLBACK");
  throw e;
} finally {
  client.release();                 // on EVERY path
}

// shut down cleanly
process.on("SIGTERM", async () => { await pool.end(); });

// serverless: each instance gets a pool, and instances scale with
// traffic. Use a proxy — PgBouncer, RDS Proxy, Prisma Accelerate`,
          notes: [
            { token: "Pool, not Client", meaning: "a Client is one connection you manage" },
            { token: "pool.query()", meaning: "borrows and returns automatically. Use it for one query" },
            { token: "release() in a finally", meaning: "or a throw leaks the connection" },
            { token: "serverless", meaning: "a pool per instance. Put a proxy in front" },
          ],
          prompt:
            "Make sure the connection is returned however the block ends.",
          starter: `const client = await pool.connect();
try {
  await client.query("SELECT 1");
}  {
  client.release();
}`,
          rules: {
            regex: ["\\}\\s*finally\\s*\\{[^}]*client\\.release\\s*\\(\\s*\\)"],
            hint: "finally { client.release(); }",
            success:
              "Correct. For a single query pool.query() would have avoided the whole question — the explicit connect is only needed when several queries must share one connection.",
          },
          solution: `const client = await pool.connect();
try {
  await client.query("SELECT 1");
} finally {
  client.release();
}`,
        },

        rust: {
          body: [
            "Into opening a connection — a TCP handshake, usually TLS, then authentication and session setup, often fifty times longer than the query.",
            "`sqlx` has pooling built in, and it is the default path: `PgPool::connect(url)` gives you a pool, not a connection.",
            "The pool is cheap to CLONE — like `reqwest::Client`, it wraps its state in an `Arc`, so cloning shares the same pool. That is how you hand it to spawned tasks and to handler state.",
            "You mostly never acquire a connection explicitly. `query.fetch_one(&pool)` takes the pool by reference, borrows a connection for the duration, and returns it — so the leak simply cannot happen.",
            "When you DO need a specific connection — for a transaction — `pool.begin()` gives you one, and the transaction rolls back automatically if it is dropped without committing.",
            "That is an unusually good default. Forgetting to commit in most languages leaves a transaction open holding locks; in Rust the Drop implementation rolls it back.",
            "Sizing follows the usual rule: `PgPoolOptions::new().max_connections(10)` and start small. Add `acquire_timeout` so a request waiting for a connection fails rather than hanging.",
            "And `deadpool` is worth knowing as the general-purpose pool crate, used for Redis and other resources with the same shape.",
          ],
          predict: {
            ask: "What happens if this transaction is dropped without commit?",
            code: `let mut tx = pool.begin().await?;

sqlx::query!("UPDATE accounts SET balance = balance - $1", amount)
    .execute(&mut *tx).await?;

// the ? above returns early on failure — no commit`,
            choices: [
              { text: "It stays open and holds locks until the connection times out", why: "That is what happens in most languages, and Rust's Drop implementation prevents it." },
              { text: "It rolls back automatically when the Transaction is dropped", why: "Correct. sqlx's Transaction implements Drop and rolls back if it was not committed — so an early return from ? cannot leave a half-applied transaction holding locks." },
              { text: "It commits automatically", why: "Committing by accident would be far worse. The safe default is to roll back." },
              { text: "It will not compile without a commit", why: "The compiler cannot know whether you meant to commit. Drop handles it at run time." },
            ],
            answer: 1,
          },
          example: `use sqlx::postgres::PgPoolOptions;

// ONE pool, at startup. Cloning shares it — cheap, and intended
let pool = PgPoolOptions::new()
    .max_connections(10)                 // start small
    .acquire_timeout(std::time::Duration::from_secs(5))
    .connect(&url)
    .await?;

// most queries take the POOL — a connection is borrowed and
// returned for you, so the leak cannot happen
let user = sqlx::query!("SELECT id FROM users WHERE name = $1", name)
    .fetch_one(&pool)
    .await?;

// a transaction, when several statements must share a connection
let mut tx = pool.begin().await?;

sqlx::query!("UPDATE accounts SET balance = balance - $1 WHERE id = $2",
             amount, from)
    .execute(&mut *tx).await?;

sqlx::query!("UPDATE accounts SET balance = balance + $1 WHERE id = $2",
             amount, to)
    .execute(&mut *tx).await?;

tx.commit().await?;                      // dropped without this = rollback

// hand it to tasks and handlers by cloning
let p = pool.clone();
tokio::spawn(async move { work(&p).await });

// deadpool is the general-purpose pool crate — Redis and others`,
          notes: [
            { token: "PgPool", meaning: "connect gives you a POOL, not a connection" },
            { token: "clone the pool", meaning: "shares it. How you reach handlers and tasks" },
            { token: "fetch_one(&pool)", meaning: "borrows and returns for you. No leak possible" },
            { token: "drop without commit", meaning: "rolls back automatically" },
          ],
          prompt:
            "Build the pool with a bounded size and a timeout for waiting on a connection.",
          starter: `let pool = PgPoolOptions::new()
    .(10)
    .(Duration::from_secs(5))
    .connect(&url)
    .await?;`,
          rules: {
            regex: ["\\.max_connections\\s*\\(\\s*10\\s*\\)", "\\.acquire_timeout\\s*\\(\\s*Duration::from_secs\\s*\\(\\s*5\\s*\\)\\s*\\)"],
            hint: "max_connections(10) and acquire_timeout(Duration::from_secs(5)).",
            success:
              "Correct, and the acquire timeout matters under load: without it a request waiting for a busy pool waits indefinitely, which turns a slow database into a completely unresponsive service.",
          },
          solution: `let pool = PgPoolOptions::new()
    .max_connections(10)
    .acquire_timeout(Duration::from_secs(5))
    .connect(&url)
    .await?;`,
        },
      },
    },

    /* --------------------------------------------------------- nplus1 -- */
    {
      id: "nplus1",
      kicker: "03",
      title: "One query, then a hundred more",
      hook:
        "A page showing 100 posts with their authors takes 600ms. Every individual query is under 2ms. What is happening?",
      body: [
        "One query fetched the posts, and then a hundred more fetched an author each. That is the N+1 problem, and it is the most common database performance bug there is.",
        "The arithmetic is what makes it painful. Each query is fast, and each ROUND TRIP costs a few milliseconds of network whatever the query does — so 101 round trips is 600ms of mostly waiting.",
        "There are two fixes and both are simple. JOIN the tables so one query returns posts and authors together, or BATCH the second query with an `IN` clause and match them up in your own code.",
        "The join is fewer round trips. The batch keeps the queries simple and avoids repeating every post's columns once per joined row, which matters when the posts are large.",
        "The reason this bug is so common is that it hides. `post.author.name` looks like a field access and is a query, and nothing in the code says so.",
        "So the real defence is visibility: log your queries in development, count them per request, and be suspicious of any loop that touches the database.",
        "The other half of this section is TRANSACTIONS, which is the opposite concern — several statements that must happen together or not at all.",
        "Wrap them, commit on success, and roll back on failure. And keep the transaction short: it holds locks, and a long one blocks other work and increases the chance of a deadlock.",
      ],
      predict: {
        ask: "Which is faster for 100 posts, and why?",
        code: `// A: 1 query + 100 queries, each ~2ms of database work
// B: 1 join query, ~8ms of database work`,
        choices: [
          { text: "A — the individual queries are simpler", why: "Simplicity of each query is irrelevant against 101 network round trips." },
          { text: "B, by a lot — 101 round trips at ~6ms each dwarfs one 8ms query", why: "Correct. The database work in A is only 200ms of the total; the rest is network latency repeated 101 times. Round trips, not query complexity, are what dominate." },
          { text: "About the same", why: "They differ by roughly fifty times in practice, which is why N+1 is the classic performance bug." },
          { text: "A, because the join duplicates data", why: "The join does repeat the post columns per row, and that costs far less than a hundred round trips." },
        ],
        answer: 1,
      },
      viz: traceNPlusOne(),
      example: `// N+1 — one query, then one per row
auto posts = query("SELECT id, title, author_id FROM posts LIMIT 100");
for (auto& p : posts) {
  auto a = query("SELECT name FROM users WHERE id = ?", p.author_id);  // 100×
  render(p, a.name);
}

// fix 1: a JOIN. One round trip
auto rows = query(
  "SELECT p.id, p.title, u.name "
  "FROM posts p JOIN users u ON u.id = p.author_id "
  "LIMIT 100");

// fix 2: BATCH. Two round trips, simpler queries
auto posts = query("SELECT id, title, author_id FROM posts LIMIT 100");

set<int> ids;
for (auto& p : posts) ids.insert(p.author_id);

auto authors = queryIn("SELECT id, name FROM users WHERE id IN (?)", ids);

unordered_map<int, string> byId;
for (auto& a : authors) byId[a.id] = a.name;

for (auto& p : posts) render(p, byId[p.author_id]);

// a TRANSACTION: together, or not at all
db.execute("BEGIN");
try {
  db.execute("UPDATE accounts SET balance = balance - ? WHERE id = ?", amt, from);
  db.execute("UPDATE accounts SET balance = balance + ? WHERE id = ?", amt, to);
  db.execute("COMMIT");
} catch (...) {
  db.execute("ROLLBACK");
  throw;
}

// keep it SHORT. It holds locks while it is open`,
      notes: [
        { token: "N+1", meaning: "one query, then one per row. The classic bug" },
        { token: "a join", meaning: "one round trip. Repeats the parent columns" },
        { token: "a batch with IN", meaning: "two round trips. Simpler queries" },
        { token: "keep transactions short", meaning: "they hold locks while open" },
      ],
      challenge: {
        prompt:
          "Fix the N+1: collect the author ids first, fetch them in one query, then match them up.",
        starter: `set<int> ids;
for (auto& p : posts) ids.();

auto authors = queryIn("SELECT id, name FROM users WHERE id IN (?)", ids);

unordered_map<int, string> byId;
for (auto& a : authors) byId[] = a.name;`,
        rules: {
          regex: ["ids\\.insert\\s*\\(\\s*p\\.author_id\\s*\\)", "byId\\s*\\[\\s*a\\.id\\s*\\]\\s*=\\s*a\\.name"],
          hint: "ids.insert(p.author_id) to collect, and byId[a.id] = a.name to index them.",
          success:
            "Correct. Using a set for the ids matters when several posts share an author — it means the IN clause asks for each author once rather than a hundred times.",
        },
        solution: `set<int> ids;
for (auto& p : posts) ids.insert(p.author_id);

auto authors = queryIn("SELECT id, name FROM users WHERE id IN (?)", ids);

unordered_map<int, string> byId;
for (auto& a : authors) byId[a.id] = a.name;`,
      },

      alt: {
        c: {
          body: [
            "One query fetched the posts, and then a hundred more fetched an author each. That is the N+1 problem.",
            "C has no ORM to hide it, which is the one advantage of writing queries by hand: the loop containing a query is visible in the source.",
            "The fixes are the same. A JOIN gets everything in one round trip. A batch builds an `IN` clause and matches the results up with a hash table you write.",
            "Building an `IN` clause with placeholders is the awkward part in C, because the number of placeholders varies. The usual approach is to build the string with the right number of `?` characters and then bind in a loop.",
            "That is one of the few places where constructing SQL by string-building is legitimate — you are generating placeholders, not interpolating values.",
            "For transactions in SQLite, `BEGIN` and `COMMIT` are ordinary statements. The important one is `BEGIN IMMEDIATE` when you are going to write: the default deferred transaction upgrades its lock later, which is where SQLITE_BUSY errors come from.",
            "There is one enormous SQLite-specific fact worth knowing: without a transaction, every INSERT is its own transaction and syncs to disk. Wrapping ten thousand inserts in one transaction can make them hundreds of times faster.",
            "And always check the return of `sqlite3_step` and friends. Errors are returned rather than thrown, so an unchecked failure means silently missing data.",
          ],
          predict: {
            ask: "Why is the second version so much faster in SQLite?",
            code: `/* A */
for (int i = 0; i < 10000; i++) insert_row(db, i);

/* B */
sqlite3_exec(db, "BEGIN", 0, 0, 0);
for (int i = 0; i < 10000; i++) insert_row(db, i);
sqlite3_exec(db, "COMMIT", 0, 0, 0);`,
            choices: [
              { text: "B batches the network round trips", why: "SQLite is embedded — there is no network at all. The cost is disk syncing." },
              { text: "Without a transaction each insert is its own, and syncs to disk — 10,000 syncs become 1", why: "Correct. SQLite wraps every statement in an implicit transaction that must be durable before returning, so each insert waits for the disk. One explicit transaction turns 10,000 syncs into one, and is often hundreds of times faster." },
              { text: "B uses a prepared statement", why: "Both could use one — the transaction is what changes the order of magnitude." },
              { text: "B holds a lock, which is faster", why: "The lock is a consequence rather than the reason. Avoiding 10,000 disk syncs is." },
            ],
            answer: 1,
          },
          example: `/* N+1 — visible, at least, because you wrote the loop */
for (int i = 0; i < n_posts; i++) {
  sqlite3_bind_int(author_stmt, 1, posts[i].author_id);
  sqlite3_step(author_stmt);                 /* 100 round trips */
  sqlite3_reset(author_stmt);
}

/* fix: a JOIN, in one statement */
sqlite3_prepare_v2(db,
  "SELECT p.id, p.title, u.name "
  "FROM posts p JOIN users u ON u.id = p.author_id LIMIT 100",
  -1, &stmt, NULL);

/* or batch with an IN clause. Building the PLACEHOLDERS as a
   string is legitimate — you are not interpolating values */
char sql[4096];
int off = snprintf(sql, sizeof sql, "SELECT id, name FROM users WHERE id IN (");
for (int i = 0; i < n_ids; i++)
  off += snprintf(sql + off, sizeof sql - off, i ? ",?" : "?");
snprintf(sql + off, sizeof sql - off, ")");

sqlite3_prepare_v2(db, sql, -1, &stmt, NULL);
for (int i = 0; i < n_ids; i++)
  sqlite3_bind_int(stmt, i + 1, ids[i]);     /* 1-based */

/* transactions. BEGIN IMMEDIATE when you will write */
sqlite3_exec(db, "BEGIN IMMEDIATE", 0, 0, 0);
/* ... many inserts ... */
sqlite3_exec(db, "COMMIT", 0, 0, 0);

/* without a transaction, EVERY insert syncs to disk.
   Ten thousand inserts can be hundreds of times slower */`,
          notes: [
            { token: "N+1", meaning: "at least visible in C — you wrote the loop" },
            { token: "building placeholders", meaning: "legitimate string-building. Values still bind" },
            { token: "BEGIN IMMEDIATE", meaning: "when you will write. Avoids a later lock upgrade" },
            { token: "no transaction", meaning: "every insert syncs to disk. Hundreds of times slower" },
          ],
          prompt:
            "Wrap the bulk insert in a transaction, taking the write lock up front.",
          starter: `sqlite3_exec(db, "", 0, 0, 0);

for (int i = 0; i < 10000; i++) insert_row(db, i);

sqlite3_exec(db, "", 0, 0, 0);`,
          rules: {
            regex: ["\"BEGIN IMMEDIATE\"", "\"COMMIT\""],
            hint: "\"BEGIN IMMEDIATE\" to start, \"COMMIT\" to finish.",
            success:
              "Correct. IMMEDIATE takes the write lock straight away, so a concurrent writer fails now rather than half way through — with a plain BEGIN, SQLite upgrades the lock later and can return SQLITE_BUSY after you have done all the work.",
          },
          solution: `sqlite3_exec(db, "BEGIN IMMEDIATE", 0, 0, 0);

for (int i = 0; i < 10000; i++) insert_row(db, i);

sqlite3_exec(db, "COMMIT", 0, 0, 0);`,
        },

        python: {
          body: [
            "One query fetched the posts, and then a hundred more fetched an author each. That is the N+1 problem, and Django and SQLAlchemy both make it trivially easy to write.",
            "In Django, `post.author.name` inside a loop issues a query per post. The attribute access looks free and is not, which is exactly why the bug is so common.",
            "Django's fix is two methods. `select_related(\"author\")` does a JOIN and is for foreign keys pointing outward. `prefetch_related(\"tags\")` does a second batched query and is for many-to-many and reverse relations.",
            "Knowing which to use comes down to the direction: one query with a join when it is a single related object, two queries when it is a collection.",
            "SQLAlchemy has the same distinction as loader options: `joinedload` for the join and `selectinload` for the batched second query. `selectinload` is usually the better default for collections.",
            "The way to FIND these is worth more than knowing the fix. `django-debug-toolbar` counts queries per request; `CaptureQueriesContext` asserts a count in a test; SQLAlchemy's `echo=True` logs every statement.",
            "A test asserting the query count is the durable defence — it fails the moment someone adds an attribute access inside a loop.",
            "For transactions, `transaction.atomic()` in Django and `session.begin()` in SQLAlchemy both commit on success and roll back on an exception, which is exactly what a context manager is for.",
          ],
          predict: {
            ask: "How many queries does this run for 100 posts?",
            code: `posts = Post.objects.all()[:100]

for p in posts:
    print(p.author.name)`,
            choices: [
              { text: "1 — Django fetches related objects together", why: "Django is lazy by default: a related object is fetched when you first touch it." },
              { text: "101 — one for the posts, then one per author access", why: "Correct. Each p.author is a separate query the first time it is touched. select_related(\"author\") turns it into one query with a join." },
              { text: "2 — Django batches the author lookups", why: "That is what prefetch_related does, and it has to be asked for." },
              { text: "It depends on the database", why: "The query count comes from Django's lazy loading and is the same on any backend." },
            ],
            answer: 1,
          },
          example: `# N+1 — the attribute access looks free and is a query
posts = Post.objects.all()[:100]
for p in posts:
    print(p.author.name)              # 100 extra queries

# fix: a JOIN, for a single related object
posts = Post.objects.select_related("author")[:100]

# fix: a batched second query, for collections
posts = Post.objects.prefetch_related("tags")[:100]

# SQLAlchemy has the same pair
from sqlalchemy.orm import joinedload, selectinload

stmt = select(Post).options(joinedload(Post.author))      # a join
stmt = select(Post).options(selectinload(Post.tags))      # a second query

# FINDING it matters more than knowing the fix
from django.test.utils import CaptureQueriesContext
from django.db import connection

with CaptureQueriesContext(connection) as ctx:
    render_page()
assert len(ctx) < 5                   # fails when someone adds an N+1

# and in development
# django-debug-toolbar, or:
create_engine(url, echo=True)         # SQLAlchemy logs every statement

# transactions: commit on success, roll back on an exception
from django.db import transaction

with transaction.atomic():
    debit(from_account, amount)
    credit(to_account, amount)

# bulk operations avoid the loop entirely
Post.objects.bulk_create(posts)
Post.objects.filter(id__in=ids).update(published=True)`,
          notes: [
            { token: "p.author", meaning: "looks like a field. Is a query" },
            { token: "select_related", meaning: "a join. For a single related object" },
            { token: "prefetch_related / selectinload", meaning: "a second batched query. For collections" },
            { token: "assert a query count", meaning: "the durable defence. It fails when someone regresses it" },
          ],
          prompt:
            "Fix the N+1 for a single related object, so the authors come back in the same query.",
          starter: `posts = Post.objects.("author")[:100]

for p in posts:
    print(p.author.name)`,
          rules: {
            regex: ["Post\\.objects\\.select_related\\s*\\(\\s*\"author\"\\s*\\)"],
            mustNot: ["prefetch_related(\"author\")"],
            hint: "select_related(\"author\") — a join, because author is a single object.",
            success:
              "Correct. prefetch_related would also work and would use two queries instead of one — the join is the better fit when the relation is a single object rather than a collection.",
          },
          solution: `posts = Post.objects.select_related("author")[:100]

for p in posts:
    print(p.author.name)`,
        },

        java: {
          body: [
            "One query fetched the posts, and then a hundred more fetched an author each. In Java this is JPA's most famous problem, and it has a name and a well-worn set of fixes.",
            "The cause is LAZY loading. A `@ManyToOne` or `@OneToMany` marked lazy returns a proxy, and touching it issues a query. That is usually the right default, and it means any loop over entities is a hazard.",
            "The fix is to say what you want up front. `JOIN FETCH` in JPQL, an `@EntityGraph` on the repository method, or a projection that selects only the columns you need.",
            "`@EntityGraph(attributePaths = {\"author\"})` on a Spring Data method is the least intrusive: the query stays declarative and the related entity comes back in the same round trip.",
            "One trap specific to JPA: `JOIN FETCH` on a collection breaks pagination. Hibernate cannot apply a LIMIT to a join that multiplies rows, so it fetches everything and paginates in memory — and logs a warning that is easy to miss.",
            "For collections, `@BatchSize` or a separate query is safer than a fetch join.",
            "`FetchType.EAGER` is the wrong fix. It applies to every query touching the entity, whether or not you need the relation, and produces its own N+1 through joins you did not ask for.",
            "For transactions, `@Transactional` on a Spring service method commits on return and rolls back on a RuntimeException. Note that default: a CHECKED exception does NOT roll back unless you say `rollbackFor`.",
          ],
          predict: {
            ask: "What does @Transactional roll back on, by default?",
            code: `@Transactional
public void transfer() throws IOException {
  debit();
  credit();
  throw new IOException("boom");
}`,
            choices: [
              { text: "Any exception", why: "Spring's default distinguishes checked from unchecked exceptions." },
              { text: "Only unchecked exceptions — this IOException COMMITS", why: "Correct. The default is rollbackFor = RuntimeException.class and Error. A checked exception commits the transaction on its way out, which surprises almost everyone. Use @Transactional(rollbackFor = Exception.class) if you want otherwise." },
              { text: "Nothing — rollback must be explicit", why: "Unchecked exceptions do roll back automatically." },
              { text: "Only if the method is public", why: "Being public matters for the proxy to intercept it at all, and is a separate concern from which exceptions roll back." },
            ],
            answer: 1,
          },
          example: `// N+1 — lazy loading makes the field access a query
List<Post> posts = repo.findAll();
for (Post p : posts) {
  System.out.println(p.getAuthor().getName());   // 100 extra queries
}

// fix: JOIN FETCH in the query
@Query("SELECT p FROM Post p JOIN FETCH p.author")
List<Post> findAllWithAuthor();

// fix: an entity graph — declarative, and less intrusive
@EntityGraph(attributePaths = {"author"})
List<Post> findAll();

// fix: a projection, when you only need a few columns
public interface PostView { String getTitle(); String getAuthorName(); }

// JOIN FETCH on a COLLECTION breaks pagination — Hibernate fetches
// everything and paginates in memory, with a warning
// use @BatchSize or a second query instead
@BatchSize(size = 50)
private List<Tag> tags;

// FetchType.EAGER is the WRONG fix — it applies to every query
// touching the entity, whether you need the relation or not

// transactions: commits on return, rolls back on a RuntimeException
@Transactional
public void transfer(long from, long to, BigDecimal amount) {
  debit(from, amount);
  credit(to, amount);
}

// a CHECKED exception does NOT roll back unless you say so
@Transactional(rollbackFor = Exception.class)

// find them: show the SQL in development
// spring.jpa.show-sql=true
// or the datasource-proxy / p6spy libraries to count per request`,
          notes: [
            { token: "lazy loading", meaning: "a field access issues a query" },
            { token: "JOIN FETCH / @EntityGraph", meaning: "ask for the relation up front" },
            { token: "fetch join + pagination", meaning: "Hibernate paginates in memory. Use @BatchSize" },
            { token: "checked exceptions commit", meaning: "the @Transactional default. Set rollbackFor" },
          ],
          prompt:
            "Fetch the author in the same query, declaratively.",
          starter: `@(attributePaths = {""})
List<Post> findAll();`,
          rules: {
            regex: ["@EntityGraph\\s*\\(\\s*attributePaths\\s*=\\s*\\{\\s*\"author\"\\s*\\}\\s*\\)"],
            hint: "@EntityGraph(attributePaths = {\"author\"})",
            success:
              "Correct, and it is preferable to changing the mapping to EAGER: the graph applies to THIS query only, so other code paths that do not need the author still do not pay for it.",
          },
          solution: `@EntityGraph(attributePaths = {"author"})
List<Post> findAll();`,
        },

        javascript: {
          body: [
            "One query fetched the posts, and then a hundred more fetched an author each. Prisma, TypeORM and Sequelize all make this easy to write.",
            "The fix in Prisma is `include`, which turns the extra queries into one batched second query rather than a hundred: `prisma.post.findMany({ include: { author: true } })`.",
            "Prisma is worth knowing here because it does something slightly unusual — its `include` uses a separate batched query rather than a join, which avoids the duplicated parent columns a join produces.",
            "`select` is the narrower version and is usually better still: it fetches only the columns you name, so a list page does not drag every field of every row across the network.",
            "GraphQL makes N+1 structural rather than accidental. Every field resolver runs per parent object, so a list of 100 posts calls the author resolver 100 times by design.",
            "That is what DataLoader exists for. It collects the ids requested within one tick of the event loop, issues a single batched query, and hands each caller its result — turning 100 resolver calls into one query.",
            "For transactions, `prisma.$transaction([...])` runs an array of operations atomically, and the interactive form `prisma.$transaction(async (tx) => {...})` lets you branch on intermediate results.",
            "Keep the interactive form short: it holds a connection and a transaction open for the whole callback, so an `await fetch()` inside one is a real problem.",
          ],
          predict: {
            ask: "Why does GraphQL suffer from N+1 by design?",
            code: `type Post { author: User }

# a query for 100 posts, each asking for author { name }`,
            choices: [
              { text: "GraphQL sends 100 separate HTTP requests", why: "It is one HTTP request. The multiplication happens inside the server, in the resolvers." },
              { text: "The author resolver runs once per post — 100 times for 100 posts", why: "Correct. Field resolvers execute per parent object, so a naive author resolver issues 100 queries. DataLoader batches the ids requested in one tick into a single query." },
              { text: "The schema is wrong", why: "The schema is normal. The execution model is what multiplies the resolver calls." },
              { text: "It only happens with REST", why: "REST tends to over-fetch instead. Per-field resolution is specifically a GraphQL characteristic." },
            ],
            answer: 1,
          },
          example: `// N+1
const posts = await prisma.post.findMany({ take: 100 });
for (const p of posts) {
  const author = await prisma.user.findUnique({ where: { id: p.authorId } });
}

// fix: include — Prisma issues ONE batched second query
const posts = await prisma.post.findMany({
  take: 100,
  include: { author: true },
});

// better: select only what you need
const posts = await prisma.post.findMany({
  take: 100,
  select: {
    title: true,
    author: { select: { name: true } },
  },
});

// GraphQL: N+1 is structural. Resolvers run per parent object
import DataLoader from "dataloader";

const userLoader = new DataLoader(async (ids) => {
  const users = await prisma.user.findMany({ where: { id: { in: ids } } });
  const byId = new Map(users.map(u => [u.id, u]));
  return ids.map(id => byId.get(id));      // same order as the ids
});

// 100 resolver calls in one tick become ONE query
const resolvers = {
  Post: { author: (post) => userLoader.load(post.authorId) },
};

// transactions
await prisma.$transaction([
  prisma.account.update({ where: { id: from }, data: { balance: { decrement: n } } }),
  prisma.account.update({ where: { id: to },   data: { balance: { increment: n } } }),
]);

// the interactive form, when you need intermediate results.
// Keep it SHORT — it holds a connection and a transaction open
await prisma.$transaction(async (tx) => {
  const a = await tx.account.findUnique({ where: { id: from } });
  if (a.balance < n) throw new Error("insufficient");
  await tx.account.update({ ... });
});`,
          notes: [
            { token: "include", meaning: "Prisma batches a second query rather than joining" },
            { token: "select", meaning: "only the columns you name. Usually better still" },
            { token: "DataLoader", meaning: "batches ids requested in one tick into one query" },
            { token: "interactive $transaction", meaning: "holds a connection. Keep it short" },
          ],
          prompt:
            "Return the ids' results in the order they were requested, which is what DataLoader requires.",
          starter: `const userLoader = new DataLoader(async (ids) => {
  const users = await prisma.user.findMany({ where: { id: { in: ids } } });
  const byId = new Map(users.map(u => [u.id, u]));
  return ;
});`,
          rules: {
            regex: ["return\\s+ids\\.map\\s*\\(\\s*id\\s*=>\\s*byId\\.get\\s*\\(\\s*id\\s*\\)\\s*\\)"],
            hint: "return ids.map(id => byId.get(id)) — same length, same order as the ids.",
            success:
              "Correct, and the contract is strict: DataLoader matches results to callers by POSITION, so returning the database's order would hand each caller somebody else's user.",
          },
          solution: `const userLoader = new DataLoader(async (ids) => {
  const users = await prisma.user.findMany({ where: { id: { in: ids } } });
  const byId = new Map(users.map(u => [u.id, u]));
  return ids.map(id => byId.get(id));
});`,
        },

        rust: {
          body: [
            "One query fetched the posts, and then a hundred more fetched an author each. Rust is less prone to this than the ORM-heavy languages, for a simple reason: `sqlx` makes you write the query.",
            "There is no lazy field access to trip over, because there are no entities with proxied relations. A query happens where you wrote one.",
            "That does not make you immune — a loop containing an `await` on a query is still N+1, and it looks perfectly reasonable.",
            "The fixes are the two everywhere else. A JOIN in one query, or a batch with `= ANY($1)` in Postgres, which takes an array directly and is cleaner than building an IN clause.",
            "That `ANY` form is worth knowing: `WHERE id = ANY($1)` with a `Vec<i64>` bound to it is one placeholder for any number of values, which sidesteps the variable-placeholder problem entirely.",
            "For the join, `query_as` into a flat struct is usually simpler than trying to reconstruct nested objects — take the columns you need and build the shape you want in Rust.",
            "Transactions were covered in the last section and the discipline is the same: `pool.begin()`, do the work, `commit()`. A drop without commit rolls back, so an early `?` cannot leave one open.",
            "`diesel` is the ORM alternative and takes a different approach again: relations are loaded explicitly with `belonging_to` and `grouped_by`, so the batching is written out rather than inferred.",
          ],
          predict: {
            ask: "Why is = ANY($1) better than building an IN clause?",
            code: `sqlx::query!("SELECT id, name FROM users WHERE id = ANY($1)", &ids[..])`,
            choices: [
              { text: "It is faster in the database", why: "The plans are usually equivalent. The advantage is in how the query is built and bound." },
              { text: "One placeholder takes the whole array, so the SQL is fixed however many ids there are", why: "Correct. An IN clause needs a placeholder per value, so the SQL text changes with the count — which defeats statement caching and means building the string at run time. ANY takes an array as one bound parameter." },
              { text: "IN does not work with placeholders", why: "It does, and it needs one per value, which is the awkward part." },
              { text: "ANY handles duplicates", why: "Both handle duplicates the same way. The fixed SQL text is the real benefit." },
            ],
            answer: 1,
          },
          example: `// N+1 — a query inside a loop. No lazy access to hide it
let posts = sqlx::query!("SELECT id, title, author_id FROM posts LIMIT 100")
    .fetch_all(&pool).await?;

for p in &posts {
    let a = sqlx::query!("SELECT name FROM users WHERE id = $1", p.author_id)
        .fetch_one(&pool).await?;               // 100 round trips
}

// fix 1: a JOIN, into a flat struct
#[derive(sqlx::FromRow)]
struct PostRow { id: i64, title: String, author_name: String }

let rows = sqlx::query_as::<_, PostRow>(
    "SELECT p.id, p.title, u.name AS author_name
     FROM posts p JOIN users u ON u.id = p.author_id
     LIMIT 100")
    .fetch_all(&pool).await?;

// fix 2: batch. ANY takes an ARRAY as one parameter
let ids: Vec<i64> = posts.iter().map(|p| p.author_id).collect();

let authors = sqlx::query!(
    "SELECT id, name FROM users WHERE id = ANY($1)", &ids[..])
    .fetch_all(&pool).await?;

let by_id: std::collections::HashMap<i64, String> =
    authors.into_iter().map(|a| (a.id, a.name)).collect();

for p in &posts {
    println!("{} by {}", p.title, by_id[&p.author_id]);
}

// diesel writes the batching out explicitly
// let authors = User::belonging_to(&posts).load(conn)?;
// let grouped = authors.grouped_by(&posts);`,
          notes: [
            { token: "no lazy loading", meaning: "a query happens where you wrote one" },
            { token: "= ANY($1)", meaning: "one placeholder for a whole array. Postgres" },
            { token: "query_as into a flat struct", meaning: "simpler than reconstructing nesting" },
            { token: "belonging_to / grouped_by", meaning: "diesel's explicit batching" },
          ],
          prompt:
            "Fetch all the authors in one query, passing the ids as a single array parameter.",
          starter: `let ids: Vec<i64> = posts.iter().map(|p| p.author_id).collect();

let authors = sqlx::query!(
    "SELECT id, name FROM users WHERE id = ", &ids[..])
    .fetch_all(&pool).await?;`,
          rules: {
            regex: ["WHERE id = ANY\\(\\$1\\)"],
            hint: "WHERE id = ANY($1)",
            success:
              "Correct, and the `&ids[..]` matters: sqlx binds a SLICE to a Postgres array, so passing the Vec itself would not match the parameter type the macro derived.",
          },
          solution: `let ids: Vec<i64> = posts.iter().map(|p| p.author_id).collect();

let authors = sqlx::query!(
    "SELECT id, name FROM users WHERE id = ANY($1)", &ids[..])
    .fetch_all(&pool).await?;`,
        },
      },
    },
  ],
};
