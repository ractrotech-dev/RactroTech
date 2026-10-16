import type { TopicLesson } from "@/lib/dsa/lessons/types";
import { traceRequestLife, traceServerModel, traceSocketStream } from "@/lib/dsa/viz/traceLang";

// Language track, topic 14.
//
// Less about syntax than the previous topics and more about what each standard
// library hands you before you reach for a dependency — which turns out to vary
// enormously, from Python's batteries-included to Rust's nothing at all.

export const LANG_NETWORKING: TopicLesson = {
  id: "lang-networking",
  title: "Networking",
  tagline: "Talking to another machine.",
  why:
    "Almost every program you write will talk to something over a network: an API, a database, another service you own. The mechanics are the same everywhere, and what your language hands you before you add a dependency is not — which is worth knowing before you add five.",
  plain: [
    "A request is far more work than it looks: a name lookup, a connection, usually encryption, and only then your data.",
    "Reusing a connection skips most of that, which is why one shared client beats a new one per request.",
    "TCP carries a stream of bytes with no message boundaries, so every protocol on top has to mark where things end.",
    "A server's shape decides how many connections it can hold at once.",
  ],
  needs: ["Error Handling — the network fails constantly.", "Concurrency, especially async."],
  traps: [
    "Creating a new HTTP client per request. It throws away the connection pool and pays for the handshake every time.",
    "No timeout. A hung connection with no timeout waits forever, and takes a worker with it.",
    "Assuming one send equals one receive. TCP is a stream; you have to frame your own messages.",
    "Retrying without backoff. A failing service plus enthusiastic retries is how an outage becomes a longer outage.",
    "Trusting anything that arrives over a network. It is input from outside, and it must be validated.",
  ],
  sections: [
    /* -------------------------------------------------------- request -- */
    {
      id: "request",
      kicker: "01",
      title: "Asking another machine for something",
      hook:
        "You call an API in a loop and it is slow. The server responds in 40ms and each call takes 180ms. Where are the other 140 going?",
      body: [
        "Into setup you are paying for over and over: a DNS lookup, a TCP handshake, and a TLS negotiation, before a single byte of your request is sent.",
        "A reused connection skips all three. That is what connection pooling does, and it is the single biggest thing you can do for network performance in any language.",
        "So the rule everywhere is: create ONE client and share it. Not one per request, and not one per function.",
        "C++ is the awkward one here, because the standard library has NO networking at all. No sockets, no HTTP, nothing. Networking was proposed for C++20 and did not make it.",
        "So you pick a library. cpr is a thin, pleasant HTTP client built on libcurl. libcurl itself is the universal C option and works fine from C++. Boost.Beast gives you HTTP on top of Asio when you need control.",
        "Whatever you pick, set a TIMEOUT. A request with no timeout can wait indefinitely, and one hung call can hold a thread until the process is restarted.",
        "And check the status. A 500 is a successful HTTP exchange as far as the client is concerned — you got a response, it just says the server failed.",
      ],
      predict: {
        ask: "What is wrong with this loop?",
        code: `for (const auto& url : urls) {
  cpr::Session s;
  s.SetUrl(cpr::Url{url});
  auto r = s.Get();
  handle(r);
}`,
        choices: [
          { text: "Nothing — a fresh session is cleaner", why: "A new session means a new connection, so the handshake cost is paid on every iteration." },
          { text: "A new session per request throws away the connection, so DNS, TCP and TLS are repeated every time", why: "Correct. Create the session once outside the loop and reuse it — the underlying connection stays open and every request after the first skips about 140ms of setup." },
          { text: "Get() should be GetAsync()", why: "Async would overlap the requests, which is a separate improvement. The repeated handshake is the bug here." },
          { text: "The URL needs escaping", why: "Escaping matters for correctness with odd characters and is unrelated to the cost." },
        ],
        answer: 1,
      },
      viz: traceRequestLife(),
      example: `// the standard library has NO networking. Pick a library:
//   cpr           a pleasant HTTP client over libcurl
//   libcurl       the universal C option, usable from C++
//   Boost.Beast   HTTP on Asio, when you need control

#include <cpr/cpr.h>

// ONE session, reused. Not one per request
cpr::Session session;
session.SetTimeout(cpr::Timeout{5000});          // always set one

for (const auto& url : urls) {
  session.SetUrl(cpr::Url{url});
  auto r = session.Get();

  if (r.error) { log(r.error.message); continue; }   // connection failed
  if (r.status_code != 200) { log(r.status_code); continue; }  // it replied

  handle(r.text);
}

// a POST with a body and headers
auto r = cpr::Post(
  cpr::Url{"https://api.example.com/items"},
  cpr::Header{{"Content-Type", "application/json"},
              {"Authorization", "Bearer " + token}},
  cpr::Body{R"({"name":"ada"})"},
  cpr::Timeout{5000});

// note the two different failures: r.error is "could not talk to it",
// r.status_code is "it talked, and said no"`,
      notes: [
        { token: "no standard networking", meaning: "C++ has none. Pick a library" },
        { token: "one session, reused", meaning: "keeps the connection, skips the handshake" },
        { token: "always a timeout", meaning: "or one hung call holds a thread forever" },
        { token: "r.error vs status_code", meaning: "could not reach it, versus it said no" },
      ],
      challenge: {
        prompt:
          "Fix the loop: create the session once, give it a timeout, and reuse it.",
        starter: `
for (const auto& url : urls) {
  cpr::Session s;
  s.SetUrl(cpr::Url{url});
  handle(s.Get());
}`,
        rules: {
          regex: ["cpr::Session\\s+session\\s*;", "session\\.SetTimeout", "session\\.SetUrl"],
          mustNot: ["for (const auto& url : urls) { cpr::Session"],
          hint: "Declare cpr::Session session; and set the timeout BEFORE the loop, then only set the URL inside it.",
          success:
            "Correct. The session owns the connection pool, so hoisting it out of the loop is what turns 180ms per request into 40ms.",
        },
        solution: `cpr::Session session;
session.SetTimeout(cpr::Timeout{5000});

for (const auto& url : urls) {
  session.SetUrl(cpr::Url{url});
  handle(session.Get());
}`,
      },

      alt: {
        c: {
          body: [
            "Into setup you are paying for repeatedly: a DNS lookup, a TCP handshake, and a TLS negotiation, before any of your request is sent.",
            "C's standard library has no networking either — but POSIX sockets are effectively universal, and libcurl is close to it for anything above raw TCP.",
            "libcurl is worth knowing well. It handles HTTP, HTTPS, redirects, cookies, proxies and about twenty other protocols, and almost every language's HTTP client is built on it somewhere underneath.",
            "The shape is always the same: `curl_easy_init` to get a handle, `curl_easy_setopt` to configure it, `curl_easy_perform` to run it, `curl_easy_cleanup` to release it.",
            "REUSE THE HANDLE. A curl easy handle keeps its connection open between calls, so calling perform twice on the same handle skips the second handshake entirely. Creating one per request is the same mistake as everywhere else.",
            "The response arrives through a WRITE CALLBACK, because libcurl does not know how you want to store it. That callback is the context-pointer pattern again: it receives your buffer through a `void *`.",
            "Set `CURLOPT_TIMEOUT` and `CURLOPT_CONNECTTIMEOUT`, always. And check the return of every call — curl reports failures as a `CURLcode`, not by crashing.",
          ],
          predict: {
            ask: "Why does libcurl hand you the response through a callback?",
            code: `curl_easy_setopt(h, CURLOPT_WRITEFUNCTION, write_cb);
curl_easy_setopt(h, CURLOPT_WRITEDATA, &buf);`,
            choices: [
              { text: "Because the response is always too big for memory", why: "Most responses are small. The callback is about who decides on storage, not about size." },
              { text: "It has no idea how you want the bytes stored, and they arrive in pieces", why: "Correct. The data arrives in chunks as it comes off the network, and libcurl cannot know whether you want a growing buffer, a file, or a parser fed directly. The callback plus WRITEDATA is the context-pointer pattern." },
              { text: "For asynchronous delivery", why: "curl_easy_perform is synchronous — the callback is invoked during it, on the same thread." },
              { text: "Because C has no return values for buffers", why: "It could have returned a malloc'd buffer. Letting you choose the storage is more flexible, and streaming needs it." },
            ],
            answer: 1,
          },
          example: `#include <curl/curl.h>

/* the response arrives in chunks, through your callback */
struct Buf { char *data; size_t len; };

static size_t write_cb(void *chunk, size_t size, size_t n, void *user) {
  size_t total = size * n;
  struct Buf *b = user;
  char *grown = realloc(b->data, b->len + total + 1);
  if (!grown) return 0;                 /* 0 tells curl to abort */
  b->data = grown;
  memcpy(b->data + b->len, chunk, total);
  b->len += total;
  b->data[b->len] = 0;
  return total;                         /* must equal what you took */
}

curl_global_init(CURL_GLOBAL_DEFAULT);

CURL *h = curl_easy_init();             /* ONE handle, reused */
curl_easy_setopt(h, CURLOPT_WRITEFUNCTION, write_cb);
curl_easy_setopt(h, CURLOPT_TIMEOUT, 5L);
curl_easy_setopt(h, CURLOPT_CONNECTTIMEOUT, 3L);
curl_easy_setopt(h, CURLOPT_FOLLOWLOCATION, 1L);

for (int i = 0; i < n; i++) {
  struct Buf b = {0};
  curl_easy_setopt(h, CURLOPT_URL, urls[i]);
  curl_easy_setopt(h, CURLOPT_WRITEDATA, &b);

  CURLcode rc = curl_easy_perform(h);   /* reuses the connection */
  if (rc != CURLE_OK) { fprintf(stderr, "%s\\n", curl_easy_strerror(rc)); }
  else {
    long code;
    curl_easy_getinfo(h, CURLINFO_RESPONSE_CODE, &code);
    handle(b.data, code);
  }
  free(b.data);
}

curl_easy_cleanup(h);
curl_global_cleanup();`,
          notes: [
            { token: "one handle, reused", meaning: "keeps the connection between perform calls" },
            { token: "the write callback", meaning: "you choose the storage. Data arrives in chunks" },
            { token: "return total", meaning: "returning less aborts the transfer" },
            { token: "CURLcode vs RESPONSE_CODE", meaning: "could not reach it, versus it said no" },
          ],
          prompt:
            "Set both timeouts on the handle so a hung connection cannot wait forever.",
          starter: `curl_easy_setopt(h, , 5L);
curl_easy_setopt(h, , 3L);`,
          rules: {
            regex: ["CURLOPT_TIMEOUT\\s*,\\s*5L", "CURLOPT_CONNECTTIMEOUT\\s*,\\s*3L"],
            hint: "CURLOPT_TIMEOUT for the whole transfer, CURLOPT_CONNECTTIMEOUT for the connection phase.",
            success:
              "Correct, and both are needed: CONNECTTIMEOUT covers only reaching the server, so without the overall TIMEOUT a server that connects and then stalls still holds you indefinitely.",
          },
          solution: `curl_easy_setopt(h, CURLOPT_TIMEOUT, 5L);
curl_easy_setopt(h, CURLOPT_CONNECTTIMEOUT, 3L);`,
        },

        python: {
          body: [
            "Into setup you are paying for repeatedly: a DNS lookup, a TCP handshake, and a TLS negotiation, before any of your request is sent.",
            "Python is the most batteries-included of the six here. `urllib.request` in the standard library will fetch a URL with no dependencies at all — and almost nobody uses it, because the API is unpleasant.",
            "What everybody uses is `requests` for synchronous work and `httpx` for anything async. Both are dependencies, and both are worth it.",
            "The pooling rule appears as a SESSION. `requests.get(url)` creates a session, uses it once, and throws it away. `session.get(url)` reuses the connection.",
            "In a loop that difference is enormous, and it is the single most common Python networking mistake.",
            "Always pass a timeout. `requests` has NO default timeout — a request with none can hang forever, and this has taken down real production systems.",
            "`raise_for_status()` turns a 4xx or 5xx into an exception, which is usually what you want; without it a failed request looks successful until something tries to parse the error page as JSON.",
            "`httpx` is the modern choice for new code: the same API shape as requests, plus async support and HTTP/2. `aiohttp` is the older async option and is still widely used.",
          ],
          predict: {
            ask: "What is the difference in a loop over 100 urls?",
            code: `# A
for u in urls:
    r = requests.get(u)

# B
with requests.Session() as s:
    for u in urls:
        r = s.get(u)`,
            choices: [
              { text: "None — requests pools connections automatically", why: "It pools within a session, and A creates a new session per call, so there is nothing to pool across." },
              { text: "A repeats the handshake 100 times; B reuses one connection", why: "Correct. requests.get creates a Session internally, uses it once and discards it — so DNS, TCP and TLS are repeated on every iteration. A shared Session keeps the connection alive and can be several times faster." },
              { text: "B is slower because the session holds state", why: "The state is what makes it fast — a pool of open connections." },
              { text: "A is safer because each request is isolated", why: "The isolation buys nothing here and costs the handshake every time." },
            ],
            answer: 1,
          },
          example: `# the standard library can do it, with no dependencies
from urllib.request import urlopen
with urlopen("https://example.com", timeout=5) as r:
    body = r.read()

# what everyone actually uses
import requests

# a SESSION pools connections. In a loop this is the whole game
with requests.Session() as s:
    s.headers.update({"Authorization": f"Bearer {token}"})

    for u in urls:
        r = s.get(u, timeout=5)        # requests has NO default timeout
        r.raise_for_status()           # 4xx/5xx become exceptions
        handle(r.json())

# posting
r = s.post(url, json={"name": "ada"}, timeout=5)

# retries with backoff, built in
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

s.mount("https://", HTTPAdapter(max_retries=Retry(
    total=3, backoff_factor=0.5,
    status_forcelist=[429, 500, 502, 503, 504])))

# async, and the modern choice for new code
import httpx

async with httpx.AsyncClient(timeout=5) as client:
    rs = await asyncio.gather(*[client.get(u) for u in urls])`,
          notes: [
            { token: "a Session", meaning: "pools connections. requests.get does not" },
            { token: "timeout=", meaning: "requests has no default. Always pass one" },
            { token: "raise_for_status()", meaning: "turns a 4xx or 5xx into an exception" },
            { token: "httpx", meaning: "the modern choice. Same shape, plus async and HTTP/2" },
          ],
          prompt:
            "Fetch every url over one pooled connection, with a timeout, failing loudly on an error status.",
          starter: `with requests.() as s:
    for u in urls:
        r = s.get(u, )
        r.()`,
          rules: {
            regex: ["requests\\.Session\\s*\\(\\s*\\)", "s\\.get\\s*\\(\\s*u\\s*,\\s*timeout\\s*=\\s*\\d+\\s*\\)", "r\\.raise_for_status\\s*\\(\\s*\\)"],
            hint: "requests.Session(), then s.get(u, timeout=5) and r.raise_for_status().",
            success:
              "Correct — three separate habits in one line each: pool the connection, bound the wait, and refuse to treat an error page as data.",
          },
          solution: `with requests.Session() as s:
    for u in urls:
        r = s.get(u, timeout=5)
        r.raise_for_status()`,
        },

        java: {
          body: [
            "Into setup you are paying for repeatedly: a DNS lookup, a TCP handshake, and a TLS negotiation, before any of your request is sent.",
            "Java's modern answer is `HttpClient`, added in Java 11, and it is genuinely good — no dependency needed for most work.",
            "It pools connections, supports HTTP/2 by default, and has both a synchronous `send` and an asynchronous `sendAsync` returning a `CompletableFuture`.",
            "The client is IMMUTABLE and thread-safe, which is exactly what you want: build one, make it a static field, and share it across the whole application.",
            "Creating one per request throws away the pool and is the usual mistake — the same one as everywhere else, and easier to make here because the builder syntax makes it feel like a per-request object.",
            "Set timeouts in two places: `connectTimeout` on the client for reaching the server, and `timeout` on the request for the whole exchange. Neither has a useful default.",
            "`BodyHandlers` decides what you get back: `ofString()`, `ofByteArray()`, `ofInputStream()` for streaming, or `ofFile()` to write straight to disk.",
            "The older `HttpURLConnection` still appears in tutorials. It is awkward, has no pooling worth the name, and there is no reason to use it in new code.",
          ],
          predict: {
            ask: "Where should this client live?",
            code: `HttpClient client = HttpClient.newBuilder()
    .connectTimeout(Duration.ofSeconds(3))
    .build();`,
            choices: [
              { text: "Inside the method, built per request", why: "Each new client has its own empty connection pool, so every request pays the full handshake." },
              { text: "A shared static field — it is immutable and thread-safe", why: "Correct. HttpClient is designed to be created once and shared. That is what keeps the connection pool alive, and it is safe from any number of threads." },
              { text: "One per thread", why: "Thread-safety is not the constraint — sharing one across all threads is both safe and better, because the pool is shared too." },
              { text: "It must be closed after each use", why: "It is not a resource you close per request. Java 21 added close() for shutting one down at the end of the application's life." },
            ],
            answer: 1,
          },
          example: `import java.net.http.*;
import java.net.URI;
import java.time.Duration;

// ONE client, shared. Immutable and thread-safe
private static final HttpClient CLIENT = HttpClient.newBuilder()
    .connectTimeout(Duration.ofSeconds(3))
    .followRedirects(HttpClient.Redirect.NORMAL)
    .build();

// a request
HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create(url))
    .timeout(Duration.ofSeconds(5))          // the whole exchange
    .header("Authorization", "Bearer " + token)
    .GET()
    .build();

HttpResponse<String> res =
    CLIENT.send(req, HttpResponse.BodyHandlers.ofString());

if (res.statusCode() != 200) throw new IOException("HTTP " + res.statusCode());
handle(res.body());

// POST with a body
HttpRequest post = HttpRequest.newBuilder()
    .uri(URI.create(url))
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString("{\\"name\\":\\"ada\\"}"))
    .build();

// asynchronous, and they overlap
var futures = urls.stream()
    .map(u -> CLIENT.sendAsync(reqFor(u), BodyHandlers.ofString()))
    .toList();
CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

// HttpURLConnection is the OLD api. No reason to use it now`,
          notes: [
            { token: "one shared HttpClient", meaning: "immutable, thread-safe, and it holds the pool" },
            { token: "two timeouts", meaning: "connectTimeout on the client, timeout on the request" },
            { token: "BodyHandlers", meaning: "string, bytes, stream, or straight to a file" },
            { token: "HttpURLConnection", meaning: "the old API. Avoid it in new code" },
          ],
          prompt:
            "Build the shared client with a connect timeout, and give the request its own timeout.",
          starter: `static final HttpClient CLIENT = HttpClient.newBuilder()
    .(Duration.ofSeconds(3))
    .build();

HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create(url))
    .(Duration.ofSeconds(5))
    .build();`,
          rules: {
            regex: ["\\.connectTimeout\\s*\\(\\s*Duration\\.ofSeconds\\s*\\(\\s*3\\s*\\)\\s*\\)", "\\.timeout\\s*\\(\\s*Duration\\.ofSeconds\\s*\\(\\s*5\\s*\\)\\s*\\)"],
            hint: "connectTimeout on the client builder, timeout on the request builder.",
            success:
              "Correct, and they cover different failures: connectTimeout gives up if the server never answers the handshake, while the request timeout gives up if it answers and then stalls mid-response.",
          },
          solution: `static final HttpClient CLIENT = HttpClient.newBuilder()
    .connectTimeout(Duration.ofSeconds(3))
    .build();

HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create(url))
    .timeout(Duration.ofSeconds(5))
    .build();`,
        },

        javascript: {
          body: [
            "Into setup you are paying for repeatedly: a DNS lookup, a TCP handshake, and a TLS negotiation, before any of your request is sent.",
            "`fetch` is built in — in browsers, in Node since version 18, and in every modern runtime. For most work you need no dependency at all.",
            "It returns a promise for a RESPONSE, and that promise resolves as soon as the headers arrive. The body is a second await: `await res.json()` or `await res.text()`.",
            "The trap that catches everyone: fetch does NOT reject on a 404 or a 500. It rejects only when the request could not be made at all. A 500 is a perfectly successful fetch that happens to carry an error page.",
            "So `if (!res.ok) throw ...` is not optional. Without it your code parses the error page and fails somewhere confusing.",
            "There is also no timeout by default. `AbortController` with a `setTimeout` is the standard pattern, and `AbortSignal.timeout(5000)` is the shorter modern form.",
            "Connection pooling happens automatically in the browser and in Node's undici, so there is no client object to hoist out of a loop. What you should hoist is anything expensive you built — headers, an agent with custom settings, an auth token.",
            "In Node, `undici` is what fetch is built on, and using it directly gives you an `Agent` with pool tuning when you need it.",
          ],
          predict: {
            ask: "What happens when the server returns a 500?",
            code: `try {
  const res = await fetch(url);
  const data = await res.json();
  handle(data);
} catch (e) {
  console.error("failed", e);
}`,
            choices: [
              { text: "The catch runs — fetch rejects on 500", why: "fetch rejects only on a network-level failure. A 500 is a successful exchange with an error status." },
              { text: "It does not reject; res.json() tries to parse the error page and probably fails there", why: "Correct. fetch resolves for any status the server returns. The 500 body is often HTML, so the json() call throws a parse error — and the message points at JSON rather than at the failing server. Check res.ok first." },
              { text: "res is undefined", why: "res is a real Response object with status 500. It simply is not what you wanted." },
              { text: "It retries automatically", why: "fetch never retries. Any retry logic is yours to write." },
            ],
            answer: 1,
          },
          example: `// built in — browsers, Node 18+, and every modern runtime

const res = await fetch(url, {
  headers: { Authorization: \`Bearer \${token}\` },
  signal: AbortSignal.timeout(5000),      // there is NO default timeout
});

// fetch does NOT reject on 4xx or 5xx. Check it yourself
if (!res.ok) throw new Error(\`HTTP \${res.status}\`);

const data = await res.json();

// POST
const res2 = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "ada" }),
});

// concurrent
const all = await Promise.all(urls.map(u => fetch(u)));

// the older abort pattern, still common
const ctl = new AbortController();
const t = setTimeout(() => ctl.abort(), 5000);
try { await fetch(url, { signal: ctl.signal }); }
finally { clearTimeout(t); }

// streaming a large response instead of buffering it
for await (const chunk of res.body) process(chunk);

// pooling is automatic. In Node, tune it through undici if needed
import { Agent, setGlobalDispatcher } from "undici";
setGlobalDispatcher(new Agent({ connections: 64 }));`,
          notes: [
            { token: "fetch", meaning: "built in. No dependency needed" },
            { token: "does not reject on 500", meaning: "check res.ok yourself, always" },
            { token: "AbortSignal.timeout", meaning: "there is no default timeout" },
            { token: "pooling is automatic", meaning: "no client to hoist. Tune undici if needed" },
          ],
          prompt:
            "Fetch with a five-second timeout and fail loudly on an error status.",
          starter: `const res = await fetch(url, { signal:  });

if () throw new Error("HTTP " + res.status);`,
          rules: {
            regex: ["AbortSignal\\.timeout\\s*\\(\\s*5000\\s*\\)", "if\\s*\\(\\s*!\\s*res\\.ok\\s*\\)"],
            hint: "signal: AbortSignal.timeout(5000) and if (!res.ok) throw ...",
            success:
              "Correct. Both lines exist because fetch's defaults are permissive: it waits forever, and it treats any answer at all as success.",
          },
          solution: `const res = await fetch(url, { signal: AbortSignal.timeout(5000) });

if (!res.ok) throw new Error("HTTP " + res.status);`,
        },

        rust: {
          body: [
            "Into setup you are paying for repeatedly: a DNS lookup, a TCP handshake, and a TLS negotiation, before any of your request is sent.",
            "Rust's standard library gives you TCP and UDP sockets and nothing above them. No HTTP, no TLS, no DNS beyond `to_socket_addrs`.",
            "That is a deliberate scope decision, and the ecosystem fills it. `reqwest` is the standard HTTP client, built on `hyper`, which is built on `tokio`.",
            "`reqwest::Client` holds the connection pool, is cheap to clone, and is meant to be created once and shared. Cloning it shares the same pool rather than copying it.",
            "Creating a Client per request is the mistake, and in Rust it is a more expensive one than usual: each new client also builds a fresh TLS configuration, which means loading the system root certificates again.",
            "Timeouts go on the client builder or per request. Neither has a useful default, and `.timeout(Duration::from_secs(5))` on the builder covers everything made with it.",
            "`error_for_status()` turns a 4xx or 5xx into an `Err`, which fits the `?` operator — so a request, a status check and a JSON parse become three lines each ending in a question mark.",
            "For JSON, enable reqwest's `json` feature and pair it with `serde`. `res.json::<User>().await?` deserialises straight into your type, with the shape checked.",
          ],
          predict: {
            ask: "What does cloning a reqwest::Client do?",
            code: `let client = reqwest::Client::new();
let c2 = client.clone();`,
            choices: [
              { text: "Creates a second independent client with its own pool", why: "Client is documented as cheap to clone precisely because the clone shares the internal state." },
              { text: "Shares the same connection pool — clone is cheap and intended", why: "Correct. The Client wraps its state in an Arc, so cloning is a reference-count bump and both handles use the same pool. That is how you share one client across tasks." },
              { text: "It does not compile — Client is not Clone", why: "It is Clone, deliberately, so it can be moved into spawned tasks." },
              { text: "It duplicates the TLS configuration", why: "That is what creating a NEW client does, and is exactly what cloning avoids." },
            ],
            answer: 1,
          },
          example: `// std gives you TcpStream and UdpSocket. Nothing above them.
// reqwest is the standard HTTP client, on hyper, on tokio

use std::time::Duration;

// ONE client, shared. Cloning shares the pool — it is cheap
let client = reqwest::Client::builder()
    .timeout(Duration::from_secs(5))
    .connect_timeout(Duration::from_secs(3))
    .build()?;

let res = client
    .get(url)
    .bearer_auth(token)
    .send()
    .await?;                          // ? on the network failure

let res = res.error_for_status()?;    // ? on a 4xx or 5xx
let body = res.text().await?;

// straight into your type, with serde
#[derive(serde::Deserialize)]
struct User { name: String, age: u32 }

let user: User = client.get(url).send().await?.json().await?;

// POST
let res = client.post(url)
    .json(&serde_json::json!({ "name": "ada" }))
    .send().await?;

// concurrent — clone the client into each task
let handles: Vec<_> = urls.into_iter().map(|u| {
    let c = client.clone();
    tokio::spawn(async move { c.get(&u).send().await })
}).collect();

// raw TCP, from the standard library
use std::net::TcpStream;
let stream = TcpStream::connect("example.com:80")?;
stream.set_read_timeout(Some(Duration::from_secs(5)))?;`,
          notes: [
            { token: "std has sockets only", meaning: "no HTTP, no TLS. reqwest fills it" },
            { token: "clone the Client", meaning: "shares the pool. Cheap, and intended" },
            { token: "error_for_status()?", meaning: "turns a 4xx or 5xx into an Err" },
            { token: ".json::<T>()", meaning: "straight into your type, with serde" },
          ],
          prompt:
            "Send the request, then fail on either a network error or an error status — using the operator for each.",
          starter: `let res = client.get(url).send().await;

let res = res.();

let body = res.text().await;`,
          rules: {
            regex: ["send\\s*\\(\\s*\\)\\.await\\?", "error_for_status\\s*\\(\\s*\\)\\?", "text\\s*\\(\\s*\\)\\.await\\?"],
            hint: "Three question marks: send().await?, error_for_status()?, and text().await?",
            success:
              "Correct, and the two failures stay separate: send() fails when you could not reach the server, and error_for_status fails when you reached it and it said no.",
          },
          solution: `let res = client.get(url).send().await?;

let res = res.error_for_status()?;

let body = res.text().await?;`,
        },
      },
    },

    /* -------------------------------------------------------- sockets -- */
    {
      id: "sockets",
      kicker: "02",
      title: "What is underneath",
      hook:
        "You send \"HELLO\" and then \"WORLD\" over a socket. The other side reads once. What does it get?",
      body: [
        "Possibly \"HELLOWORLD\". Possibly \"HEL\". Possibly \"HELLO\". TCP does not carry messages — it carries a STREAM of bytes with no boundaries in it.",
        "That is the single most important fact about socket programming, and almost everyone learns it by writing a bug first.",
        "The network is free to combine your two sends into one packet, or split one send across several. What you get on the other side is whatever has arrived so far.",
        "So every protocol built on TCP has to mark where one message ends. There are exactly three ways: a DELIMITER, a LENGTH PREFIX, or a fixed size.",
        "A delimiter — read until a newline — is simple and means the delimiter can never appear in the data. A length prefix — four bytes saying how long, then that many bytes — handles anything and is what most binary protocols use.",
        "The reading loop follows from this: read what you can, check whether you have a complete message, and if not, read again. A short read is normal and not an error.",
        "C++ has no sockets in the standard library, so this is POSIX sockets from `<sys/socket.h>` or a library. Boost.Asio is the established C++ answer and handles the framing patterns for you.",
        "And UDP is the other option: messages, not a stream, so no framing problem — at the cost of packets that may be lost, duplicated or reordered, all of which you then handle yourself.",
      ],
      predict: {
        ask: "What is wrong with this receive?",
        code: `char buf[1024];
int n = recv(fd, buf, sizeof buf, 0);

Message m = parse(buf, n);
handle(m);`,
        choices: [
          { text: "Nothing — recv fills the buffer", why: "recv returns whatever has arrived so far, which may be part of a message or several messages." },
          { text: "It assumes one recv is one message, and TCP guarantees no such thing", why: "Correct. The read may return half a message, or two and a half. You need to accumulate into a buffer and only parse when a complete frame is present — which needs a delimiter or a length prefix to know." },
          { text: "The buffer is too small", why: "1024 bytes may be plenty or not, and it is not what makes this wrong. The framing assumption is." },
          { text: "recv should be read", why: "The two are interchangeable here — recv simply takes flags. The framing is the bug." },
        ],
        answer: 1,
      },
      viz: traceSocketStream(),
      example: `#include <sys/socket.h>
#include <netinet/in.h>

// C++ has no sockets. This is POSIX, or a library like Boost.Asio

int fd = socket(AF_INET, SOCK_STREAM, 0);     // SOCK_STREAM = TCP
connect(fd, (sockaddr*)&addr, sizeof addr);

// LENGTH-PREFIXED framing: 4 bytes of length, then the payload
void sendMsg(int fd, const string& msg) {
  uint32_t len = htonl(msg.size());           // network byte order!
  sendAll(fd, &len, 4);
  sendAll(fd, msg.data(), msg.size());
}

// send can send FEWER bytes than asked. Loop
void sendAll(int fd, const void* data, size_t n) {
  const char* p = (const char*)data;
  while (n > 0) {
    ssize_t sent = send(fd, p, n, 0);
    if (sent <= 0) throw runtime_error("send failed");
    p += sent; n -= sent;
  }
}

// and recv can return fewer. Loop until you have a whole frame
string recvMsg(int fd) {
  uint32_t len;
  recvAll(fd, &len, 4);
  len = ntohl(len);
  if (len > MAX_MSG) throw runtime_error("too big");   // ALWAYS bound it
  string out(len, 0);
  recvAll(fd, out.data(), len);
  return out;
}

// UDP: messages, not a stream. No framing problem, and packets
// may be lost, duplicated or reordered
int u = socket(AF_INET, SOCK_DGRAM, 0);`,
      notes: [
        { token: "SOCK_STREAM vs SOCK_DGRAM", meaning: "TCP's byte stream, or UDP's messages" },
        { token: "framing", meaning: "a delimiter, a length prefix, or a fixed size" },
        { token: "loop on send and recv", meaning: "both may handle fewer bytes than asked" },
        { token: "htonl / ntohl", meaning: "network byte order. Machines differ" },
      ],
      challenge: {
        prompt:
          "Finish sendAll so it keeps sending until every byte has gone.",
        starter: `void sendAll(int fd, const void* data, size_t n) {
  const char* p = (const char*)data;
  while (n > 0) {
    ssize_t sent = send(fd, p, n, 0);
    if (sent <= 0) throw runtime_error("send failed");
    p ;
    n ;
  }
}`,
        rules: {
          regex: ["p\\s*\\+=\\s*sent", "n\\s*-=\\s*sent"],
          hint: "p += sent; and n -= sent; — advance by however much actually went.",
          success:
            "Correct. A partial send is normal rather than an error — the kernel's buffer filled — and code assuming otherwise works fine on small messages and corrupts large ones.",
        },
        solution: `void sendAll(int fd, const void* data, size_t n) {
  const char* p = (const char*)data;
  while (n > 0) {
    ssize_t sent = send(fd, p, n, 0);
    if (sent <= 0) throw runtime_error("send failed");
    p += sent;
    n -= sent;
  }
}`,
      },

      alt: {
        c: {
          body: [
            "Possibly \"HELLOWORLD\". Possibly \"HEL\". TCP carries a STREAM of bytes with no message boundaries in it at all.",
            "C is where sockets live natively, and the POSIX API is the one every other language wraps. Learning it here means recognising it everywhere else.",
            "The sequence for a client is short: `socket`, `connect`, then `send` and `recv`, then `close`. For a server: `socket`, `bind`, `listen`, then `accept` in a loop.",
            "`accept` returns a NEW descriptor for that one connection. The listening socket stays open and keeps accepting — confusing the two is a common early mistake.",
            "Every one of these can fail, and they report it by returning -1 and setting `errno`. Checking every call is not optional here.",
            "Two errno values are special. `EINTR` means a signal interrupted the call and you should simply retry. `EAGAIN` on a non-blocking socket means 'nothing right now', which is normal rather than an error.",
            "`send` and `recv` can handle fewer bytes than you asked for. Both need loops, and code that assumes otherwise works on small messages and breaks on large ones.",
            "And byte order matters as soon as two machines are involved. `htons` and `htonl` convert to network order before sending; `ntohs` and `ntohl` convert back.",
          ],
          predict: {
            ask: "What does accept return?",
            code: `int listen_fd = socket(AF_INET, SOCK_STREAM, 0);
bind(listen_fd, ...);
listen(listen_fd, 128);

int fd = accept(listen_fd, NULL, NULL);`,
            choices: [
              { text: "The same descriptor, now connected", why: "The listening socket must stay listening. accept gives you a separate descriptor for the connection." },
              { text: "A NEW descriptor for that one connection; listen_fd keeps listening", why: "Correct. You talk to the client through fd and close it when done, while listen_fd stays open to accept the next connection. Closing listen_fd instead stops the server." },
              { text: "A pointer to a connection struct", why: "POSIX sockets are integers throughout. accept returns another int." },
              { text: "0 on success", why: "It returns the new descriptor, or -1 with errno set on failure." },
            ],
            answer: 1,
          },
          example: `#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>

/* client: socket, connect, send/recv, close */
int fd = socket(AF_INET, SOCK_STREAM, 0);
if (fd < 0) { perror("socket"); return -1; }

struct sockaddr_in addr = {0};
addr.sin_family = AF_INET;
addr.sin_port   = htons(8080);          /* network byte order */
inet_pton(AF_INET, "127.0.0.1", &addr.sin_addr);

if (connect(fd, (struct sockaddr *)&addr, sizeof addr) < 0) {
  perror("connect"); close(fd); return -1;
}

/* send may send FEWER bytes than asked. Loop */
ssize_t send_all(int fd, const void *buf, size_t n) {
  const char *p = buf;
  while (n > 0) {
    ssize_t s = send(fd, p, n, 0);
    if (s < 0) { if (errno == EINTR) continue; return -1; }
    p += s; n -= s;
  }
  return 0;
}

/* server: socket, bind, listen, accept in a loop */
int listen_fd = socket(AF_INET, SOCK_STREAM, 0);

int yes = 1;
setsockopt(listen_fd, SOL_SOCKET, SO_REUSEADDR, &yes, sizeof yes);
/* without this, restarting binds fail for a minute */

bind(listen_fd, (struct sockaddr *)&addr, sizeof addr);
listen(listen_fd, 128);

for (;;) {
  int fd = accept(listen_fd, NULL, NULL);   /* a NEW descriptor */
  if (fd < 0) { if (errno == EINTR) continue; break; }
  handle(fd);
  close(fd);                                /* listen_fd stays open */
}`,
          notes: [
            { token: "accept", meaning: "a new descriptor. The listening one stays open" },
            { token: "EINTR", meaning: "a signal interrupted the call. Retry it" },
            { token: "SO_REUSEADDR", meaning: "or restarting the server fails to bind for a minute" },
            { token: "htons / ntohl", meaning: "network byte order. Machines differ" },
          ],
          prompt:
            "Loop the send so every byte goes, retrying when a signal interrupts it.",
          starter: `while (n > 0) {
  ssize_t s = send(fd, p, n, 0);
  if (s < 0) { if (errno == ) continue; return -1; }
  p ;
  n ;
}`,
          rules: {
            regex: ["errno\\s*==\\s*EINTR", "p\\s*\\+=\\s*s", "n\\s*-=\\s*s"],
            hint: "errno == EINTR to retry, then p += s; and n -= s;",
            success:
              "Correct. EINTR is not a failure — a signal arrived mid-call — and treating it as one produces bugs that only appear when the process happens to receive a signal.",
          },
          solution: `while (n > 0) {
  ssize_t s = send(fd, p, n, 0);
  if (s < 0) { if (errno == EINTR) continue; return -1; }
  p += s;
  n -= s;
}`,
        },

        python: {
          body: [
            "Possibly \"HELLOWORLD\". Possibly \"HEL\". TCP carries a STREAM of bytes with no message boundaries.",
            "Python's `socket` module is a thin wrapper over the POSIX API, so everything from the C description applies — with the errors raised as exceptions rather than returned as -1.",
            "`sendall` is the one convenience worth knowing: it loops for you until every byte has gone. Plain `send` returns how many it managed and leaves the loop to you.",
            "There is no `recvall`, because there is no way for the library to know how much you want. That loop is yours to write, and it is where the framing decision lives.",
            "`socket.makefile()` is genuinely useful: it wraps the socket in a file object, so `readline()` gives you delimiter framing for free on a text protocol.",
            "Sockets work with BYTES, not strings. `s.send(\"hi\")` is a TypeError; you need `b\"hi\"` or `\"hi\".encode()`. That is Python 3 being explicit about the boundary between text and bytes.",
            "Set a timeout with `s.settimeout(5)`, or a hung peer holds the thread indefinitely. And use `with socket.socket(...) as s:` so it closes on every path.",
            "For anything real, `asyncio.start_server` gives you a reader and a writer per connection, with `readexactly` and `readline` already implemented — which removes most of the framing boilerplate.",
          ],
          predict: {
            ask: "Why does this fail?",
            code: `s = socket.socket()
s.connect(("example.com", 80))
s.sendall("GET / HTTP/1.0\\r\\n\\r\\n")`,
            choices: [
              { text: "The connection was refused", why: "The connect is fine. The failure is in what is being sent." },
              { text: "Sockets take bytes, not str — it needs b\"...\" or .encode()", why: "Correct. Python 3 keeps text and bytes strictly separate, and a socket deals in bytes. sendall raises TypeError on a str." },
              { text: "sendall does not exist", why: "sendall is a real method and is the one you want — it loops until everything has gone." },
              { text: "The request needs a Host header", why: "HTTP/1.0 does not require one. The type error happens before anything is sent." },
            ],
            answer: 1,
          },
          example: `import socket

# closes on every path
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.settimeout(5)                        # or it waits forever
    s.connect(("example.com", 80))

    s.sendall(b"GET / HTTP/1.0\\r\\n\\r\\n")   # BYTES, not str
    # sendall loops for you. Plain send does not

    # there is no recvall — the loop is yours
    chunks = []
    while True:
        data = s.recv(4096)
        if not data:                       # empty means closed
            break
        chunks.append(data)
    body = b"".join(chunks)

# length-prefixed framing
import struct

def send_msg(s, payload: bytes):
    s.sendall(struct.pack("!I", len(payload)) + payload)   # ! = network

def recv_exactly(s, n: int) -> bytes:
    buf = b""
    while len(buf) < n:
        chunk = s.recv(n - len(buf))
        if not chunk: raise ConnectionError("closed early")
        buf += chunk
    return buf

def recv_msg(s) -> bytes:
    (length,) = struct.unpack("!I", recv_exactly(s, 4))
    if length > MAX: raise ValueError("too big")   # always bound it
    return recv_exactly(s, length)

# delimiter framing, for free
f = s.makefile("rb")
line = f.readline()

# for anything real, let asyncio do the framing
async def handle(reader, writer):
    line = await reader.readline()
    data = await reader.readexactly(n)`,
          notes: [
            { token: "sendall", meaning: "loops for you. There is no recvall" },
            { token: "bytes, not str", meaning: "b\"hi\" or \"hi\".encode()" },
            { token: "recv returning b\"\"", meaning: "the peer closed. Not an error" },
            { token: "asyncio's reader", meaning: "readline and readexactly do the framing" },
          ],
          prompt:
            "Write recv_exactly so it keeps reading until it has exactly n bytes.",
          starter: `def recv_exactly(s, n):
    buf = b""
    while :
        chunk = s.recv(n - len(buf))
        if not chunk: raise ConnectionError("closed early")
        buf += chunk
    return buf`,
          rules: {
            regex: ["while\\s+len\\s*\\(\\s*buf\\s*\\)\\s*<\\s*n\\s*:"],
            hint: "while len(buf) < n:",
            success:
              "Correct, and asking for `n - len(buf)` each time matters too: asking for the full n again would work but could return more than you wanted, running into the next message.",
          },
          solution: `def recv_exactly(s, n):
    buf = b""
    while len(buf) < n:
        chunk = s.recv(n - len(buf))
        if not chunk: raise ConnectionError("closed early")
        buf += chunk
    return buf`,
        },

        java: {
          body: [
            "Possibly \"HELLOWORLD\". Possibly \"HEL\". TCP carries a STREAM of bytes with no message boundaries.",
            "Java's `Socket` and `ServerSocket` wrap the same POSIX ideas, and they hand you an `InputStream` and an `OutputStream` rather than send and recv calls.",
            "That is an improvement, because it means all the stream decorators apply. Wrap in a `BufferedInputStream` and the read-in-a-loop problem largely goes away.",
            "`DataInputStream` and `DataOutputStream` are the framing tools: `writeInt(length)` then the bytes, and `readInt()` then `readFully(buf)` on the other side.",
            "`readFully` is the one to know — it loops until the buffer is full or the stream ends, which is exactly the loop you would otherwise write by hand.",
            "For text protocols, a `BufferedReader` gives you `readLine()`, which is delimiter framing for free.",
            "Always set `setSoTimeout`, or a read blocks forever on a peer that stopped talking without closing. And use try-with-resources so the socket closes on every path.",
            "`java.nio` is the non-blocking alternative — `SocketChannel`, `Selector`, `ByteBuffer` — and is what high-performance servers use. It is considerably more work, and virtual threads have made it much less necessary.",
          ],
          predict: {
            ask: "What is the difference between read and readFully?",
            code: `byte[] buf = new byte[1024];

in.read(buf);          // A
new DataInputStream(in).readFully(buf);   // B`,
            choices: [
              { text: "None — both fill the buffer", why: "read returns as soon as any data is available, which may be far less than the buffer holds." },
              { text: "read returns whatever has arrived; readFully loops until the buffer is full", why: "Correct. read returns the count it managed, which for a socket is often much less than asked. readFully is the loop you would otherwise write, and it throws EOFException if the stream ends first." },
              { text: "readFully is asynchronous", why: "Both are blocking. readFully simply blocks longer, until it has everything." },
              { text: "read is deprecated", why: "read is the fundamental method. readFully is a convenience built on it." },
            ],
            answer: 1,
          },
          example: `import java.net.*;
import java.io.*;

// closes on every path
try (Socket s = new Socket()) {
  s.connect(new InetSocketAddress("example.com", 80), 3000);
  s.setSoTimeout(5000);                    // or a read blocks forever

  var out = new DataOutputStream(new BufferedOutputStream(s.getOutputStream()));
  var in  = new DataInputStream(new BufferedInputStream(s.getInputStream()));

  // length-prefixed framing
  byte[] payload = msg.getBytes(StandardCharsets.UTF_8);
  out.writeInt(payload.length);
  out.write(payload);
  out.flush();                             // or it sits in the buffer

  int len = in.readInt();
  if (len > MAX) throw new IOException("too big");   // always bound it
  byte[] buf = new byte[len];
  in.readFully(buf);                       // loops until full
}

// delimiter framing, for text
var reader = new BufferedReader(
    new InputStreamReader(s.getInputStream(), StandardCharsets.UTF_8));
String line = reader.readLine();

// a server
try (ServerSocket server = new ServerSocket(8080)) {
  while (true) {
    Socket conn = server.accept();         // a NEW socket per connection
    pool.submit(() -> handle(conn));
  }
}

// java.nio for non-blocking: SocketChannel, Selector, ByteBuffer.
// More work, and virtual threads made it much less necessary`,
          notes: [
            { token: "streams, not send/recv", meaning: "so all the decorators apply" },
            { token: "readFully", meaning: "loops until the buffer is full. Use it" },
            { token: "flush()", meaning: "a buffered stream holds data until you do" },
            { token: "setSoTimeout", meaning: "or a read waits forever on a silent peer" },
          ],
          prompt:
            "Frame the message with a length prefix, and make sure it actually goes out.",
          starter: `out.(payload.length);
out.write(payload);
out.();`,
          rules: {
            regex: ["out\\.writeInt\\s*\\(\\s*payload\\.length\\s*\\)", "out\\.flush\\s*\\(\\s*\\)"],
            hint: "out.writeInt(payload.length) for the prefix, and out.flush() so the buffer is sent.",
            success:
              "Correct, and the flush is easy to forget: with a BufferedOutputStream the bytes sit in memory until the buffer fills or you flush — so a small message can simply never arrive.",
          },
          solution: `out.writeInt(payload.length);
out.write(payload);
out.flush();`,
        },

        javascript: {
          body: [
            "Possibly \"HELLOWORLD\". Possibly \"HEL\". TCP carries a STREAM of bytes with no message boundaries.",
            "In the browser you cannot open a TCP socket at all. The sandbox allows HTTP through fetch, WebSockets, and WebRTC — and nothing lower.",
            "That is a security decision rather than a gap: a page that could open arbitrary sockets could scan your network.",
            "So raw sockets in JavaScript means Node, and the module is `net`. `net.createConnection` for a client, `net.createServer` for a server.",
            "Node's sockets are STREAMS in the Node sense: they emit `data` events with whatever arrived, which makes the framing problem very visible — every handler must cope with partial and combined messages.",
            "The idiomatic answer is to accumulate into a buffer and slice complete frames out of it. Node has no `readFully`, so that loop is yours.",
            "WEBSOCKETS are the one place JavaScript gets messages rather than a stream. The protocol frames for you, so `onmessage` fires once per message the peer sent — which is why it is the usual choice for anything real-time.",
            "Set a timeout with `socket.setTimeout(5000)` and handle the `error` event. An unhandled `error` on a stream is an uncaught exception, and in Node that ends the process.",
          ],
          predict: {
            ask: "How many times does this data handler fire for two sends of 5 bytes?",
            code: `socket.on("data", (chunk) => {
  handleMessage(chunk.toString());
});`,
            choices: [
              { text: "Exactly twice, once per send", why: "TCP may combine the two sends into one arrival or split them differently — the handler fires per chunk received, not per send." },
              { text: "Any number of times — once, twice, or more, with the bytes grouped arbitrarily", why: "Correct. The data event fires whenever bytes arrive, in whatever grouping the network produced. Accumulate into a buffer and slice complete frames out; do not treat one chunk as one message." },
              { text: "Once — Node buffers until the socket closes", why: "It emits as data arrives, which is what makes it a stream rather than a request." },
              { text: "It does not fire until you call read()", why: "In flowing mode, attaching a data handler is what starts the events." },
            ],
            answer: 1,
          },
          example: `// the BROWSER cannot open TCP sockets. fetch, WebSocket, WebRTC only

// Node: the net module
import net from "node:net";

const socket = net.createConnection({ host: "example.com", port: 80 });
socket.setTimeout(5000);
socket.on("timeout", () => socket.destroy());
socket.on("error", (e) => console.error(e));   // unhandled = crash

// data arrives in whatever chunks the network produced
let buffer = Buffer.alloc(0);

socket.on("data", (chunk) => {
  buffer = Buffer.concat([buffer, chunk]);

  // length-prefixed framing: 4 bytes, then the payload
  while (buffer.length >= 4) {
    const len = buffer.readUInt32BE(0);
    if (len > MAX) return socket.destroy();     // always bound it
    if (buffer.length < 4 + len) break;         // not a whole frame yet

    const payload = buffer.subarray(4, 4 + len);
    buffer = buffer.subarray(4 + len);          // keep the remainder
    handleMessage(payload);
  }
});

// a server
net.createServer((conn) => {
  conn.on("data", (d) => conn.write(d));
}).listen(8080);

// WebSockets DO give you messages — the protocol frames for you
const ws = new WebSocket("wss://example.com");
ws.onmessage = (e) => handle(e.data);           // once per message
ws.send(JSON.stringify({ type: "ping" }));`,
          notes: [
            { token: "no TCP in the browser", meaning: "fetch, WebSocket and WebRTC only" },
            { token: "the data event", meaning: "fires per chunk, not per message" },
            { token: "accumulate and slice", meaning: "Node has no readFully. The loop is yours" },
            { token: "WebSocket", meaning: "real messages. The protocol frames for you" },
          ],
          prompt:
            "Stop the loop when a whole frame has not arrived yet, and keep the leftover bytes.",
          starter: `while (buffer.length >= 4) {
  const len = buffer.readUInt32BE(0);
  if (buffer.length < 4 + len) ;

  const payload = buffer.subarray(4, 4 + len);
  buffer = ;
  handleMessage(payload);
}`,
          rules: {
            regex: ["if\\s*\\(\\s*buffer\\.length\\s*<\\s*4\\s*\\+\\s*len\\s*\\)\\s*break", "buffer\\s*=\\s*buffer\\.subarray\\s*\\(\\s*4\\s*\\+\\s*len\\s*\\)"],
            hint: "break out of the while, and buffer = buffer.subarray(4 + len) to keep the rest.",
            success:
              "Correct. Keeping the remainder is what makes the next data event work: two messages arriving in one chunk are both handled, and half a message waits for the rest.",
          },
          solution: `while (buffer.length >= 4) {
  const len = buffer.readUInt32BE(0);
  if (buffer.length < 4 + len) break;

  const payload = buffer.subarray(4, 4 + len);
  buffer = buffer.subarray(4 + len);
  handleMessage(payload);
}`,
        },

        rust: {
          body: [
            "Possibly \"HELLOWORLD\". Possibly \"HEL\". TCP carries a STREAM of bytes with no message boundaries.",
            "Rust's standard library gives you `TcpStream`, `TcpListener` and `UdpSocket`, and they implement `Read` and `Write` — so every reader and writer adapter works on them.",
            "That is more than it sounds. `BufReader::new(stream)` gives you `read_line`, which is delimiter framing for free, and `read_exact(&mut buf)` loops until the buffer is full.",
            "`read_exact` is the one to reach for. It is the loop you would otherwise write, and it returns an error rather than a short read if the connection ends early.",
            "`write_all` is its counterpart for sending — plain `write` may send fewer bytes and leave the loop to you.",
            "For length-prefixed framing, read four bytes with `read_exact`, convert with `u32::from_be_bytes`, then read exactly that many. And bound the length before allocating, or a hostile peer can ask you to allocate four gigabytes.",
            "Timeouts go on the stream: `set_read_timeout(Some(Duration::from_secs(5)))`. Without one a silent peer holds the thread indefinitely.",
            "For anything concurrent, `tokio::net` mirrors the same API with `.await` on each operation, and adds `AsyncReadExt` with async versions of `read_exact` and `read_line`.",
          ],
          predict: {
            ask: "What is the difference?",
            code: `let mut buf = [0u8; 1024];

stream.read(&mut buf)?;        // A
stream.read_exact(&mut buf)?;  // B`,
            choices: [
              { text: "None — both fill the buffer", why: "read returns as soon as any data is available, and reports how much it got." },
              { text: "read returns whatever arrived; read_exact loops until the buffer is full or the stream ends", why: "Correct. read gives you a count that is often far less than the buffer holds. read_exact is the loop, and returns UnexpectedEof if the connection closes before the buffer is filled." },
              { text: "read_exact is non-blocking", why: "Both block. read_exact blocks longer, until it has everything." },
              { text: "read_exact is only for files", why: "It comes from the Read trait, so it works on anything readable — sockets included." },
            ],
            answer: 1,
          },
          example: `use std::net::{TcpStream, TcpListener};
use std::io::{Read, Write, BufReader, BufRead};
use std::time::Duration;

let mut stream = TcpStream::connect("example.com:80")?;
stream.set_read_timeout(Some(Duration::from_secs(5)))?;
stream.set_nodelay(true)?;               // send small writes immediately

// write_all loops. Plain write may send fewer bytes
stream.write_all(b"GET / HTTP/1.0\\r\\n\\r\\n")?;

// length-prefixed framing
fn send_msg(s: &mut TcpStream, payload: &[u8]) -> std::io::Result<()> {
    s.write_all(&(payload.len() as u32).to_be_bytes())?;   // network order
    s.write_all(payload)
}

fn recv_msg(s: &mut TcpStream) -> std::io::Result<Vec<u8>> {
    let mut len_buf = [0u8; 4];
    s.read_exact(&mut len_buf)?;         // loops until it has 4
    let len = u32::from_be_bytes(len_buf) as usize;

    if len > MAX_MSG {                   // bound it BEFORE allocating
        return Err(std::io::Error::other("too big"));
    }

    let mut buf = vec![0u8; len];
    s.read_exact(&mut buf)?;
    Ok(buf)
}

// delimiter framing, for free
let mut reader = BufReader::new(stream.try_clone()?);
let mut line = String::new();
reader.read_line(&mut line)?;

// a server
let listener = TcpListener::bind("0.0.0.0:8080")?;
for conn in listener.incoming() {
    let conn = conn?;
    std::thread::spawn(move || handle(conn));
}

// tokio::net mirrors all of this, with .await on each operation`,
          notes: [
            { token: "Read and Write", meaning: "so BufReader and every adapter work on a socket" },
            { token: "read_exact / write_all", meaning: "the loops, already written" },
            { token: "bound the length first", meaning: "or a peer can make you allocate gigabytes" },
            { token: "set_nodelay", meaning: "send small writes immediately, rather than batching" },
          ],
          prompt:
            "Read exactly four bytes for the length, then convert them from network byte order.",
          starter: `let mut len_buf = [0u8; 4];
s.(&mut len_buf)?;
let len = u32::(len_buf) as usize;`,
          rules: {
            regex: ["s\\.read_exact\\s*\\(\\s*&mut\\s+len_buf\\s*\\)\\?", "u32::from_be_bytes\\s*\\(\\s*len_buf\\s*\\)"],
            hint: "s.read_exact(&mut len_buf)? and u32::from_be_bytes(len_buf).",
            success:
              "Correct. from_be_bytes is big-endian, which IS network byte order — using from_ne_bytes would work on one machine and silently break when the two ends have different architectures.",
          },
          solution: `let mut len_buf = [0u8; 4];
s.read_exact(&mut len_buf)?;
let len = u32::from_be_bytes(len_buf) as usize;`,
        },
      },
    },

    /* -------------------------------------------------------- serving -- */
    {
      id: "serving",
      kicker: "03",
      title: "Answering instead of asking",
      hook:
        "Your server handles a hundred connections happily and falls over at five thousand. Nothing in your code changed. What ran out?",
      body: [
        "Memory, if you gave each connection a thread — a megabyte of stack each is five gigabytes. Or file descriptors, which default to a low limit on most systems.",
        "The shape of a server decides how many connections it can hold, and there are three shapes.",
        "THREAD PER CONNECTION is the simplest to write: accept, hand the socket to a thread, and the code reads top to bottom. It works well into the low thousands and no further.",
        "An EVENT LOOP uses one thread and non-blocking sockets, with a readiness call telling it which connections have data. Memory per connection drops to kilobytes, and the code becomes callbacks.",
        "ASYNC TASKS give you the event loop's memory profile with straight-line code. That is what modern runtimes provide, and it is the default answer now.",
        "C++ has no HTTP server and no async runtime in the standard library, so this means a library. Boost.Asio is the foundation most of them are built on.",
        "Whichever you use, a few things are always yours: bound the request size, set timeouts on idle connections, limit concurrency, and shut down gracefully so in-flight requests finish.",
        "And raise the file-descriptor limit. The default of 1024 on many Linux systems is the first thing to hit, and the failure — `accept` returning EMFILE — is confusing if you have not seen it before.",
      ],
      predict: {
        ask: "A server with 1 MB thread stacks hits its limit at about what?",
        code: `// accept(), then spawn a thread per connection
// 1 MB stack per thread, 8 GB of RAM`,
        choices: [
          { text: "About 100,000 connections", why: "That would need 100 GB of stack. The arithmetic runs out long before." },
          { text: "A few thousand — memory first, then context switching", why: "Correct. A few thousand threads is a few gigabytes of stack, and the scheduler is switching between thousands of mostly-idle threads. Both degrade well before 10,000." },
          { text: "It has no limit — threads are virtual", why: "Each platform thread has a real stack reservation and a real kernel structure." },
          { text: "Exactly 1024, the descriptor limit", why: "The descriptor limit is a real and separate ceiling, and it is raisable — the memory cost of threads is not." },
        ],
        answer: 1,
      },
      viz: traceServerModel(),
      example: `// no HTTP server and no async runtime in the standard library.
//   Boost.Asio     the foundation
//   Crow, Drogon   HTTP frameworks on top
//   Beast          HTTP on Asio, lower level

#include <boost/asio.hpp>
using namespace boost::asio;

io_context io;
ip::tcp::acceptor acceptor(io, {ip::tcp::v4(), 8080});

// async accept — one thread, many connections
void doAccept() {
  acceptor.async_accept([](auto ec, ip::tcp::socket sock) {
    if (!ec) handle(std::move(sock));
    doAccept();                      // accept the next
  });
}

// C++20 coroutines make it read like straight-line code
awaitable<void> session(ip::tcp::socket sock) {
  char data[1024];
  for (;;) {
    auto n = co_await sock.async_read_some(buffer(data), use_awaitable);
    co_await async_write(sock, buffer(data, n), use_awaitable);
  }
}

// run the loop on several threads for CPU-heavy work
std::vector<std::jthread> pool;
for (unsigned i = 0; i < std::thread::hardware_concurrency(); i++)
  pool.emplace_back([&] { io.run(); });

// always yours, whatever the library:
//   bound the request size
//   time out idle connections
//   limit concurrency
//   shut down gracefully so in-flight requests finish
//   raise the file-descriptor limit (ulimit -n)`,
      notes: [
        { token: "no standard server", meaning: "Asio, or a framework built on it" },
        { token: "async_accept", meaning: "one thread, many connections" },
        { token: "co_await", meaning: "makes the async version read like straight-line code" },
        { token: "ulimit -n", meaning: "the descriptor limit. The first ceiling you hit" },
      ],
      challenge: {
        prompt:
          "After handling an accepted connection, keep the server accepting the next one.",
        starter: `void doAccept() {
  acceptor.async_accept([](auto ec, ip::tcp::socket sock) {
    if (!ec) handle(std::move(sock));
    ;
  });
}`,
        rules: {
          regex: ["doAccept\\s*\\(\\s*\\)\\s*;"],
          hint: "Call doAccept(); again inside the handler.",
          success:
            "Correct, and it is easy to forget: an async accept handles exactly ONE connection, so without re-arming it the server accepts one client and then goes silent.",
        },
        solution: `void doAccept() {
  acceptor.async_accept([](auto ec, ip::tcp::socket sock) {
    if (!ec) handle(std::move(sock));
    doAccept();
  });
}`,
      },

      alt: {
        c: {
          body: [
            "Memory, if you gave each connection a thread — or file descriptors, which default to 1024 on many systems and are the first ceiling most servers hit.",
            "In C you write the event loop yourself, and it is the pattern every other language's runtime is built on.",
            "The shape is: non-blocking sockets, a readiness call, and a loop that handles whichever descriptors are ready. `poll` is portable; `epoll` on Linux and `kqueue` on BSD scale far better.",
            "The difference matters at scale. `poll` walks its whole array on every call, so ten thousand connections means ten thousand checks each time round. `epoll` keeps the set in the kernel and returns only what is ready.",
            "Two flags on the listening socket are effectively mandatory. `SO_REUSEADDR` lets you restart without waiting out TIME_WAIT, and without it a redeploy fails to bind for a minute.",
            "`SIGPIPE` is the trap specific to C. Writing to a socket the peer has closed raises it, and the default action is to kill your process. Either ignore it with `signal(SIGPIPE, SIG_IGN)` or pass `MSG_NOSIGNAL` to every send.",
            "Each connection needs its own STATE, because a partial read has to be remembered until the rest arrives. That state struct, keyed by descriptor, is what makes an event-loop server harder to write than a threaded one.",
            "And raise the descriptor limit: `ulimit -n`, or `setrlimit` from inside the program.",
          ],
          predict: {
            ask: "Why does this server die silently under load?",
            code: `/* no signal setup */

for (;;) {
  int fd = accept(listen_fd, NULL, NULL);
  write(fd, response, len);
  close(fd);
}`,
            choices: [
              { text: "accept eventually fails and returns -1", why: "That is a real risk and it does not kill the process — write returning -1 would simply be ignored here." },
              { text: "A client that disconnects early makes write raise SIGPIPE, whose default action kills the process", why: "Correct. Writing to a socket whose peer has closed sends SIGPIPE, and the default handler terminates the program. Ignore it with signal(SIGPIPE, SIG_IGN), or use send with MSG_NOSIGNAL." },
              { text: "close is called too early", why: "Closing after writing is correct. The signal is what ends the process." },
              { text: "The loop needs a sleep", why: "accept blocks until a connection arrives, so the loop does not spin." },
            ],
            answer: 1,
          },
          example: `#include <sys/epoll.h>
#include <signal.h>
#include <sys/resource.h>

/* MANDATORY: or a disconnecting client kills your process */
signal(SIGPIPE, SIG_IGN);

/* raise the descriptor limit — 1024 is the usual default */
struct rlimit rl = { .rlim_cur = 65536, .rlim_max = 65536 };
setrlimit(RLIMIT_NOFILE, &rl);

/* the listening socket */
int listen_fd = socket(AF_INET, SOCK_STREAM, 0);
int yes = 1;
setsockopt(listen_fd, SOL_SOCKET, SO_REUSEADDR, &yes, sizeof yes);
bind(listen_fd, (struct sockaddr *)&addr, sizeof addr);
listen(listen_fd, 512);
set_nonblocking(listen_fd);

/* epoll: the kernel keeps the set, so a call costs O(ready) */
int ep = epoll_create1(0);
struct epoll_event ev = { .events = EPOLLIN, .data.fd = listen_fd };
epoll_ctl(ep, EPOLL_CTL_ADD, listen_fd, &ev);

struct epoll_event events[MAX_EVENTS];

for (;;) {
  int n = epoll_wait(ep, events, MAX_EVENTS, -1);
  if (n < 0) { if (errno == EINTR) continue; break; }

  for (int i = 0; i < n; i++) {
    int fd = events[i].data.fd;

    if (fd == listen_fd) {
      int conn = accept(listen_fd, NULL, NULL);
      if (conn < 0) continue;              /* EMFILE = out of fds */
      set_nonblocking(conn);
      add_conn_state(conn);                /* per-connection buffer */
      struct epoll_event e = { .events = EPOLLIN, .data.fd = conn };
      epoll_ctl(ep, EPOLL_CTL_ADD, conn, &e);
    } else {
      handle_readable(fd);                 /* may be a PARTIAL message */
    }
  }
}`,
          notes: [
            { token: "SIGPIPE", meaning: "ignore it, or a disconnecting client kills you" },
            { token: "epoll vs poll", meaning: "O(ready) versus O(total). It matters at scale" },
            { token: "per-connection state", meaning: "a partial read must be remembered" },
            { token: "setrlimit / ulimit -n", meaning: "1024 descriptors is the usual default" },
          ],
          prompt:
            "Stop a disconnecting client from killing the process.",
          starter: `(SIGPIPE, );`,
          rules: {
            regex: ["signal\\s*\\(\\s*SIGPIPE\\s*,\\s*SIG_IGN\\s*\\)"],
            hint: "signal(SIGPIPE, SIG_IGN);",
            success:
              "Correct. With it ignored, write returns -1 with errno set to EPIPE instead — a normal error you can handle, rather than a process that vanishes.",
          },
          solution: `signal(SIGPIPE, SIG_IGN);`,
        },

        python: {
          body: [
            "Memory, if you gave each connection a thread — and in Python you would hit the GIL long before that, since threads take turns anyway.",
            "Python's standard library has `socketserver` and `http.server`, and both are for development and scripts. `http.server`'s own documentation says it is not recommended for production.",
            "For real work the shape is a WSGI or ASGI application plus a server that runs it. WSGI is the older synchronous interface; ASGI is the async one, and is what new code uses.",
            "`uvicorn` runs ASGI apps and is the usual choice. `gunicorn` runs WSGI, and commonly runs uvicorn workers to do both.",
            "The framework layer is Flask or Django for synchronous work, FastAPI or Starlette for async. FastAPI is worth knowing because it builds validation and API documentation from your type hints.",
            "The concurrency model follows from the GIL. Several WORKER PROCESSES use several cores; threads or async inside each worker handle the waiting.",
            "So the standard production shape is: N worker processes, each running an async loop. `gunicorn -w 4 -k uvicorn.workers.UvicornWorker` is that sentence as a command.",
            "And the same rules apply as everywhere: bound the request size, set timeouts, and never trust incoming data — validate it at the boundary with pydantic or equivalent.",
          ],
          predict: {
            ask: "Why is http.server not for production?",
            code: `python -m http.server 8000`,
            choices: [
              { text: "It is too slow", why: "Speed is part of it and not the main reason — the documentation's own warning is about security." },
              { text: "It implements only basic security checks and is documented as not recommended for production", why: "Correct. It is a development and debugging tool: single-threaded by default, minimal request validation, and the standard library explicitly warns against exposing it. Use a real ASGI or WSGI server." },
              { text: "It cannot serve HTML", why: "Serving static files is exactly what it does." },
              { text: "It requires root", why: "It binds a high port by default and needs no privileges." },
            ],
            answer: 1,
          },
          example: `# the standard library has servers — for DEVELOPMENT only
# python -m http.server 8000
# socketserver.ThreadingTCPServer

# production: an ASGI app plus a server that runs it
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class User(BaseModel):
    name: str
    age: int                       # validated at the boundary

@app.post("/users")
async def create(user: User):      # bad input never reaches here
    await store(user)
    return {"ok": True}

# run it:
#   uvicorn main:app --workers 4
#
# or WSGI and ASGI together:
#   gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app

# the model: N worker PROCESSES for the cores,
# async inside each one for the waiting

# a plain asyncio server, when a framework is too much
import asyncio

async def handle(reader, writer):
    line = await reader.readline()     # framing, done for you
    writer.write(b"ok\\n")
    await writer.drain()               # wait if the buffer is full
    writer.close()

server = await asyncio.start_server(handle, "0.0.0.0", 8080)
async with server:
    await server.serve_forever()

# always yours: bound the body size, set timeouts,
# limit concurrency, validate everything that arrives`,
          notes: [
            { token: "http.server", meaning: "development only. The docs say so" },
            { token: "ASGI + uvicorn", meaning: "the modern production shape" },
            { token: "processes for cores, async for waiting", meaning: "because of the GIL" },
            { token: "pydantic at the boundary", meaning: "bad input never reaches your handler" },
          ],
          prompt:
            "Write the asyncio handler so it waits for the buffer to drain before closing.",
          starter: `async def handle(reader, writer):
    line = await reader.readline()
    writer.write(b"ok\\n")
    await writer.
    writer.close()`,
          rules: {
            regex: ["await\\s+writer\\.drain\\s*\\(\\s*\\)"],
            hint: "await writer.drain()",
            success:
              "Correct. write() is not async and only queues the bytes — drain is what waits when the peer is slow, and skipping it lets a slow client make your server buffer unboundedly.",
          },
          solution: `async def handle(reader, writer):
    line = await reader.readline()
    writer.write(b"ok\\n")
    await writer.drain()
    writer.close()`,
        },

        java: {
          body: [
            "Memory, if you gave each connection a platform thread. A megabyte of stack each means a few thousand is a few gigabytes.",
            "Java's answer to that used to be non-blocking `java.nio` and asynchronous frameworks like Netty. Since Java 21 it is virtual threads, and the difference is large.",
            "A virtual thread costs a few hundred bytes and unmounts when it blocks, so the simplest possible server — a thread per connection, blocking reads — now scales to hundreds of thousands.",
            "That is a genuine simplification: the code that was easiest to write is now also the one that scales.",
            "For HTTP, `com.sun.net.httpserver.HttpServer` is in the JDK and is fine for small internal services and health endpoints. It is not a framework and is not meant to be one.",
            "Real applications use Spring Boot, Quarkus, Micronaut or Helidon. All of them now support virtual threads, and enabling them is usually one configuration property.",
            "Netty remains the foundation of a great deal of Java networking, and is worth recognising: it is an event-loop framework, and gRPC, Cassandra's driver and many others are built on it.",
            "The always-yours list is the same everywhere: bound request sizes, time out idle connections, limit concurrency, and shut down gracefully.",
          ],
          predict: {
            ask: "What changes when this executor uses virtual threads?",
            code: `try (var pool = Executors.newVirtualThreadPerTaskExecutor()) {
  while (true) {
    Socket conn = server.accept();
    pool.submit(() -> handleBlocking(conn));
  }
}`,
            choices: [
              { text: "Nothing — the code is identical to a fixed pool", why: "The code looks the same and the scaling behaviour is completely different." },
              { text: "Blocking reads no longer occupy an OS thread, so this scales to hundreds of thousands of connections", why: "Correct. The handler can use ordinary blocking I/O, and each blocked virtual thread unmounts from its carrier. The simplest code to write is now also the one that scales." },
              { text: "It becomes non-blocking automatically", why: "The calls still block the virtual thread — what changes is that blocking one no longer ties up an OS thread." },
              { text: "It uses more memory per connection", why: "A virtual thread is a few hundred bytes against a platform thread's megabyte." },
            ],
            answer: 1,
          },
          example: `// Java 21+: thread per connection, and it scales
try (var server = new ServerSocket(8080);
     var pool = Executors.newVirtualThreadPerTaskExecutor()) {

  while (true) {
    Socket conn = server.accept();
    pool.submit(() -> {
      try (conn;
           var in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
           var out = new PrintWriter(conn.getOutputStream(), true)) {
        conn.setSoTimeout(30_000);           // time out idle connections
        String line = in.readLine();         // blocking — and fine
        out.println("ok");
      } catch (IOException e) {
        log.warn("connection failed", e);
      }
    });
  }
}

// the JDK's own HTTP server — small services and health endpoints
var http = HttpServer.create(new InetSocketAddress(8080), 0);
http.createContext("/health", ex -> {
  byte[] body = "ok".getBytes();
  ex.sendResponseHeaders(200, body.length);
  try (var os = ex.getResponseBody()) { os.write(body); }
});
http.start();

// real applications: Spring Boot, Quarkus, Micronaut, Helidon.
// All support virtual threads — usually one config property

// Netty is the event-loop foundation under a lot of Java networking:
// gRPC, the Cassandra driver, and many frameworks`,
          notes: [
            { token: "virtual threads", meaning: "thread per connection, at event-loop scale" },
            { token: "com.sun.net.httpserver", meaning: "in the JDK. Small services only" },
            { token: "setSoTimeout", meaning: "time out idle connections, or they accumulate" },
            { token: "Netty", meaning: "the event-loop foundation under much of the ecosystem" },
          ],
          prompt:
            "Create the executor that lets a blocking handler scale to many thousands of connections.",
          starter: `try (var pool = Executors.()) {
  while (true) pool.submit(() -> handle(server.accept()));
}`,
          rules: {
            regex: ["Executors\\.newVirtualThreadPerTaskExecutor\\s*\\(\\s*\\)"],
            hint: "Executors.newVirtualThreadPerTaskExecutor()",
            success:
              "Correct, and note what did NOT have to change: the handler still uses ordinary blocking reads. That is the whole point of virtual threads — the scaling improved and the code did not have to.",
          },
          solution: `try (var pool = Executors.newVirtualThreadPerTaskExecutor()) {
  while (true) pool.submit(() -> handle(server.accept()));
}`,
        },

        javascript: {
          body: [
            "File descriptors, most likely — or the event loop, if any handler does real computation.",
            "Node was built for this shape. One thread, an event loop, and non-blocking I/O everywhere, so thousands of connections is the normal case rather than an achievement.",
            "The built-in `http` module is a complete server, and unlike Python's it is genuinely production-capable. Express, Fastify and Hono add routing and middleware on top.",
            "The failure mode specific to Node is BLOCKING THE LOOP. A handler doing 200ms of JSON parsing or image work stops every other connection, because there is nowhere else for them to run.",
            "So anything CPU-heavy goes to a worker thread or a separate process. Measuring event loop lag — `perf_hooks.monitorEventLoopDelay` — is how you find out you have this problem.",
            "For multiple cores, `cluster` forks one process per core, all sharing the listening socket. In containers the more common answer is to run one process per container and let the orchestrator scale.",
            "Graceful shutdown is worth getting right and is easy to get wrong: `server.close()` stops accepting and waits for in-flight requests, so a SIGTERM handler should call it rather than exiting immediately.",
            "And an uncaught exception or unhandled rejection in a handler will, in recent Node versions, end the process. A top-level error handler is not optional in a server.",
          ],
          predict: {
            ask: "What does this do to the other 999 connections?",
            code: `app.get("/report", (req, res) => {
  const data = buildHugeReport();   // 200ms of pure computation
  res.json(data);
});`,
            choices: [
              { text: "Nothing — Node handles them in parallel", why: "Node runs your JavaScript on one thread. While this function runs, nothing else does." },
              { text: "All of them stall for 200ms, because there is one thread and it is busy", why: "Correct. The event loop cannot pick up anything else while a handler is computing. Move the work to a worker thread, or break it into chunks that yield between them." },
              { text: "They are queued and served at normal speed", why: "They are queued, and the queue does not move until this handler returns." },
              { text: "Node spawns a thread automatically for slow handlers", why: "It does not. The libuv thread pool is used for some file and DNS operations, never for your JavaScript." },
            ],
            answer: 1,
          },
          example: `import http from "node:http";
import { Worker } from "node:worker_threads";

// the built-in server is production-capable
const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ ok: true }));
});

server.headersTimeout = 10_000;
server.requestTimeout = 30_000;      // bound how long a request may take
server.listen(8080);

// CPU work goes to a worker, or it stalls every connection
app.get("/report", (req, res) => {
  const w = new Worker("./report.js");
  w.postMessage(req.query);
  w.on("message", (data) => res.json(data));
});

// several cores: one process per core, sharing the socket
import cluster from "node:cluster";
import os from "node:os";

if (cluster.isPrimary) {
  for (let i = 0; i < os.availableParallelism(); i++) cluster.fork();
} else {
  server.listen(8080);
}
// in containers, one process per container is more common

// graceful shutdown — stop accepting, finish what is in flight
process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();   // a backstop
});

// a server must handle these, or a single bad request ends it
process.on("unhandledRejection", (e) => log.error(e));`,
          notes: [
            { token: "the built-in http module", meaning: "production-capable, unlike Python's" },
            { token: "blocking the loop", meaning: "one slow handler stalls every connection" },
            { token: "cluster", meaning: "one process per core, sharing the socket" },
            { token: "server.close()", meaning: "stop accepting, finish what is in flight" },
          ],
          prompt:
            "Handle SIGTERM by refusing new connections and letting in-flight requests finish.",
          starter: `process.on("SIGTERM", () => {
  server.(() => process.exit(0));
});`,
          rules: {
            regex: ["server\\.close\\s*\\(\\s*\\(\\s*\\)\\s*=>\\s*process\\.exit\\s*\\(\\s*0\\s*\\)\\s*\\)"],
            hint: "server.close(() => process.exit(0))",
            success:
              "Correct, and a timeout backstop is worth adding alongside it: close waits for every connection to end, and a keep-alive client that never disconnects would otherwise stop the process from ever exiting.",
          },
          solution: `process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});`,
        },

        rust: {
          body: [
            "Memory or descriptors — and in Rust the thread-per-connection version is more viable than in most languages, because a Rust thread's stack is the only real cost.",
            "Still, for anything at scale the answer is async. `tokio` is the runtime, `hyper` is the HTTP implementation, and `axum` is the framework most new code uses.",
            "The shape is small: a `TcpListener`, an accept loop, and `tokio::spawn` for each connection. Each task is a few kilobytes rather than a thread's megabytes.",
            "`axum` is worth knowing because it is unusually direct. A handler is an async function, its arguments are EXTRACTORS that pull what they need out of the request, and the return type is anything that can become a response.",
            "So `async fn create(Json(user): Json<User>) -> impl IntoResponse` gets a deserialised, validated User — with a 400 returned automatically if the body does not match.",
            "That extractor idea means the type signature of a handler documents what it needs, and the compiler checks that the router is wired to match.",
            "For state shared between handlers, `State<Arc<AppState>>` is the standard pattern — the Arc from Concurrency, applied here.",
            "And the always-yours list applies: bound the body size with `DefaultBodyLimit`, add timeouts with `tower_http`, and shut down gracefully with `with_graceful_shutdown`.",
          ],
          predict: {
            ask: "What does this handler's signature guarantee?",
            code: `async fn create(Json(user): Json<User>) -> impl IntoResponse {
    store(user).await;
    StatusCode::CREATED
}`,
            choices: [
              { text: "Nothing — user might still be malformed", why: "The Json extractor deserialises and rejects the request before the handler body runs." },
              { text: "The body was valid JSON matching User, or the handler never ran", why: "Correct. The Json extractor deserialises into User and returns a 400 automatically if it cannot. By the time the body executes, the data is the shape the type says." },
              { text: "The request was authenticated", why: "Authentication would be a separate extractor or middleware. Json only validates the shape." },
              { text: "It only accepts POST", why: "The method comes from how the route is registered, not from the handler signature." },
            ],
            answer: 1,
          },
          example: `// std gives you TcpListener. Everything above it is a crate:
//   tokio   the runtime
//   hyper   HTTP
//   axum    the framework most new code uses

use axum::{Router, routing::post, Json, extract::State, http::StatusCode};
use std::sync::Arc;

#[derive(serde::Deserialize)]
struct User { name: String, age: u32 }

// the arguments are EXTRACTORS — they pull what they need out
// of the request, and reject it if they cannot
async fn create(
    State(app): State<Arc<AppState>>,
    Json(user): Json<User>,              // 400 automatically if malformed
) -> StatusCode {
    app.store(user).await;
    StatusCode::CREATED
}

#[tokio::main]
async fn main() {
    let state = Arc::new(AppState::new());

    let app = Router::new()
        .route("/users", post(create))
        .with_state(state)
        .layer(tower_http::timeout::TimeoutLayer::new(
            std::time::Duration::from_secs(30)))
        .layer(axum::extract::DefaultBodyLimit::max(1024 * 1024));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await
        .unwrap();
}

// or by hand — a task per connection, a few KB each
let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await?;
loop {
    let (socket, _) = listener.accept().await?;
    tokio::spawn(async move { handle(socket).await });
}`,
          notes: [
            { token: "tokio + hyper + axum", meaning: "runtime, HTTP, framework" },
            { token: "extractors", meaning: "handler arguments that pull from the request and validate" },
            { token: "State<Arc<T>>", meaning: "the standard shape for shared state" },
            { token: "DefaultBodyLimit", meaning: "bound the request size. Always" },
          ],
          prompt:
            "Accept connections forever, giving each one its own lightweight task.",
          starter: `loop {
    let (socket, _) = listener.accept().await?;
    tokio::(async move { handle(socket).await });
}`,
          rules: {
            regex: ["tokio::spawn\\s*\\(\\s*async\\s+move\\s*\\{\\s*handle\\s*\\(\\s*socket\\s*\\)\\.await\\s*\\}\\s*\\)"],
            hint: "tokio::spawn(async move { handle(socket).await })",
            success:
              "Correct, and the `move` is required: the task may outlive this loop iteration, so it has to own the socket rather than borrow it — which the compiler would tell you.",
          },
          solution: `loop {
    let (socket, _) = listener.accept().await?;
    tokio::spawn(async move { handle(socket).await });
}`,
        },
      },
    },
  ],
};
