# Learning state

Always-on context, so it stays small: rewrite, don't append; ≤ 50 lines.
Refreshed at natural pauses (CLAUDE.md → Housekeeping). Provenance and the
evidence behind these entries: `.claude/archive/handoff-2026-09-05.md`.

## Fluency map

- sandbox-first: SQL join semantics (`ON` vs `WHERE`); many-to-one row folds;
  Fastify plugins / encapsulation / hooks; better-auth internals (stays guided).
- question-first: relational schema / double-entry; SQLSTATE classification;
  neverthrow pipelines; TS narrowing (`never`, predicates, module augmentation);
  Zod; env/config boundary; auth pipeline design (session → customer, 401/403).
- fluent: discriminated unions / error-kind design; layered architecture;
  migrations / dbmate / Docker Postgres; Node/TS toolchain.
- unknown: `@fastify/type-provider-zod`.

## Calibration

- New technique (not a variation): give the worked example when asked; don't
  hold out for a prose algorithm first.
- Nudge tolerance is one. "I honestly don't know" means drop to mechanics or
  a sandbox — don't rephrase the question.
- On pushback: hold a well-grounded position with honest confidence; tell him
  to decide once and record it. Don't cave, don't restate.
- Honest option over clever heuristic (he rejects format-sniffing like `.length(5)`).
- He notices unverified claims. Read the file or run the check first.
- If a concept's payoff is deferred, say so upfront, not after.
- Numbered worklists: he navigates by "check 2".
- Formats that land: outcome → meaning tables; indented scope trees; "run the
  three cases in your head" as a closer.

## Open threads

- Config review: item 3 (secret `.min(32)`, `PORT` int + range) unconfirmed on
  `initial-auth`; item 4 (`BASE_URL`) never reached.
- Plugin tree (`sessionScope`/`customerScope`), `decorateRequest` + module
  augmentation, onboarding state: designed, implementation status unknown.
- Does `neverthrow` earn its overhead? To be judged on the accounts slice.
- Fastify params schema vs `VALID_ID_PATTERN`; holderless-account invariant at
  `POST /accounts`; IDOR once auth lands.

## Watch for

- Incomplete mechanical renames when porting a sandbox to the real schema.
- Reintroducing a just-demonstrated bug when writing from scratch — diff
  against the working version.
- Wiring omissions (unregistered plugin) hunted as logic bugs.
- Condition inversion in guards.
- Reaching for a different type instead of a constraint.
- Exporting the wrong shape and patching at consumers (`?.`/`!`).
- Names claiming the wrong pipeline step; sibling/nesting drift in trees.
- Reading soft signals ("legacy") as hard blockers.
- Extending schema without re-running invariants — highest stakes in this domain.
