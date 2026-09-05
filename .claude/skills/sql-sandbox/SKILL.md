---
name: sql-sandbox
description: Build a runnable in-chat SQL sandbox — a tiny seeded SQLite database (sql.js) inside an interactive widget, with contrasting preset queries and an editable query box — so Jackson can explore relational semantics hands-on with no environment to set up. Use this whenever a SQL question turns on how rows behave — joins and join types, filter placement (ON vs WHERE), NULL propagation, GROUP BY / HAVING, three-state (found / empty / missing) queries, folding many rows into one object — especially when he says he can't picture it, asks for example data or "a sandbox", or the fluency map rates the area sandbox-first. Reach for it even if he doesn't say "sandbox"; a question about why a query returns the rows it does usually needs one. Not for Postgres-specific behaviour (types, error codes, locking, pg-only syntax) — that goes paste-and-run against his real database.
argument-hint: [concept]
allowed-tools: Bash(node .claude/skills/sql-sandbox/scripts/fill.mjs *)
---

# SQL sandbox

A widget running real SQLite inside the chat. It exists because a sandbox is
a context switch that has to earn it, and this one is nearly free: no psql,
no scratch file, results appear inline as he edits. That lowers the bar for
using one; it doesn't change the test. Use it when he needs to _run_ cases to
see a mechanism, not when a worked example in prose would do.

## Fence: SQLite is not Postgres

Relational semantics — how rows combine, filter, group, and go NULL — are the
same in both engines, and that is the sandbox's whole territory. Anything
where the engine difference _is_ the lesson must be observed on his real
database, or the sandbox teaches something false:

- types and coercion (bigint, numeric, strict typing, `'1' = 1`)
- error classification (SQLSTATE, driver errors)
- concurrency, locking, transaction isolation, advisory locks
- Postgres-only syntax: `::` casts, `ILIKE`, `DISTINCT ON`, arrays, `SERIAL`, `jsonb`

If he asks for a sandbox for one of these, say why this one would mislead
and give him a paste-and-run block for psql instead.

## Procedure

1. Design the smallest schema that shows the mechanism: two tables (three at
   most), five rows or fewer each. Use a neutral domain — authors/books,
   teams/members — not the bank. Bank tables bring domain rules he'd start
   reasoning about instead of the SQL.
2. Seed so every preset returns a _visibly different_ result; the contrast
   between presets is the lesson. For a join: one parent with no children,
   one child the filter removes, one child that survives.
3. Write two or three presets that vary exactly one thing. Label them by what
   differs ("Filter in ON" / "Filter in WHERE"), never by outcome — the
   outcome is what he is meant to discover.
   When the mechanism is a predicate — a WHERE or ON condition, a NULL
   comparison, a HAVING clause — add one preset that _prints the predicate
   per row_ instead of filtering by it (`SELECT ..., b.year > 1842 AS
where_test`). Seeing `1 / 0 / NULL` beside each row exposes the mechanism
   more directly than a third contrast, because it shows the value the engine
   is deciding on rather than only the rows that survived.
4. Put the slot values in a JSON file (shape documented at the top of the
   script; [examples/left-join.json](examples/left-join.json) is a complete,
   verified instance) and run the filler. It escapes for you and refuses to
   emit unfilled markers:

   `node .claude/skills/sql-sandbox/scripts/fill.mjs slots.json > sandbox.html`

5. Pass the HTML to `mcp__visualize__show_widget`. The template already
   follows the widget design system, so `read_me` is only needed if the tool
   refuses without it. The widget carries the sandbox and nothing else — no
   prose, no headings, and not the question.
6. In chat: one line on what to try, then the single forcing question, under
   the normal turn budget. Closer once he has explored: "run the three cases
   in your head."

## If the widget tool isn't available

1. Publish the same HTML with the Artifact tool — same CDN, no runtime fetches.
2. Failing that, emit schema + seed + queries as one paste-and-run block for
   psql, per the base protocol.
