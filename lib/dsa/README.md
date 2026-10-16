# Learn DSA (`/dsa`)

A free data structures and algorithms course, linked from the site header's **Learn** menu.
It was ported from the standalone "DSA from Day 1" app (Next 16) into this app (Next 14),
restyled to the marketing theme, and moved onto Ractrotech accounts.

Every chapter follows the same four beats: a problem the reader cannot yet solve, how the
idea solves it, a diagram they step through, and a practice board where they write the code
and get it checked. The diagrams are not drawn by hand — a tracer runs the real algorithm in
TypeScript and records one frame per step, so the picture cannot drift from the code.

## Where things are

| Path | What it holds |
| --- | --- |
| `app/dsa/` | The routes: map, syllabus, chapters, language track, progress, welcome |
| `app/dsa/layout.tsx` | Site header and footer, the course section bar, the course font |
| `app/dsa/dsa.css` | All course styling, scoped under `.dsa` (see the note at its top) |
| `components/dsa/` | Lesson sections, the diagram player (`viz/`), language picker, progress |
| `lib/dsa/lessons/library/` | The 26 chapters, as data; `i18n/` holds per-language code |
| `lib/dsa/lang-course/` | The language track (17 topics) |
| `lib/dsa/viz/` | The tracers and the frame format every diagram speaks |
| `lib/dsa/supabase/` | Typed clients for the course tables; null when Supabase is unset |
| `scripts/dsa/` | The lesson checker and the grader's unit test |
| `utils/db/migrations/0019_dsa_learning.sql` | The course tables, RLS and recorder functions |

Adding a chapter means one file under `lib/dsa/lessons/library/` and one line in its
`index.ts`. The map, syllabus, static routes, sitemap and progress bars pick it up.

## Six languages

C++, C, Python, Java, JavaScript and Rust. The explanation and diagram frames are written
once; only the code moves. Two rules for translations, both enforced by the checker:

- `vizCode` stays line-for-line parallel with the C++, because frames highlight by line.
- Grading rules are rewritten per language, never reused from the C++.

```bash
npm run dsa:check   # every model solution passes its own rules, no starter passes,
                    # no diagram highlights a line past the end of its code
```

## Accounts and progress

Every lesson works signed out. Signing in uses the normal Ractrotech account (header login,
or `/login?next=/dsa/...`), and adds progress tracking:

| Table | Holds |
| --- | --- |
| `dsa_profiles` | Course language and the five welcome answers — created on first visit to `/dsa/profile` |
| `dsa_progress` | One row per solved lesson |
| `dsa_activity` | One row per user per day — what the streak calendar reads |
| `dsa_submissions` | The code typed into each passed board |
| `dsa_notes` | Free-text notes against a chapter |

Run `utils/db/migrations/0019_dsa_learning.sql` in the Supabase SQL editor before relying on
these. Until then the lessons still work, a passed board says it could not be saved, and
`/dsa/profile` says which migration is missing. Every table is private to its owner by row level security.
