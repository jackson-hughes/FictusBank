# Lessons delivered

Append-only record. Not imported into context; read on demand. Entries move
here from `.claude/lesson-ledger.md` when delivered.

- 2026-06-15 — schema, multi-currency — Adding a dimension can silently break an
  invariant enforced elsewhere; re-check every invariant when the schema grows.
- 2026-07-17 — Fastify scaffold — `import type` is a correctness requirement under
  native type stripping, not a style choice.
- 2026-07-18 — neverthrow — Cross from exception-world to Result-world once, at
  `fromPromise`; stay in Result downstream.
- 2026-07-19 — accounts slice — Swap-test: if replacing the DB driver would ripple
  into a layer, the code doesn't belong in that layer.
- 2026-07-19 — error unions — Introduce a variant only when a caller would act
  differently on it.
- 2026-07-19 — naming — "Same name top to bottom" manufactures import collisions;
  namespace imports (`import * as X`) resolve it.
- 2026-07-25 — pg errors — `unknown` narrowing can be named (predicate), delegated
  (zod), or asserted (`instanceof`), but never skipped without an unchecked cast.
- 2026-07-25 — pg errors — SQLSTATE's first two characters are the class; group by
  class, special-case exceptions first.
- 2026-07-25 — verification — A plausible unverified claim (Claude's) survived until
  code made it concrete; confirm classifications empirically.
- 2026-08-07 — three-state query — Information may only be destroyed at the boundary
  where it stops being needed, never earlier.
- 2026-08-07 — Fastify — Every `register` creates an encapsulation context; hook
  scope is a security property, not tidiness.
- 2026-08-07 — config — Fail at boot on missing config, where the misconfigurer is
  watching; never `??`-fallback to something plausible.
- 2026-08-07 — auth — Collapse to 404 at the edge; keep `notFound`/`notHeld` distinct
  internally for the audit log.
- 2026-08-12 — config.ts — Narrowing after `process.exit()` works only because it
  returns `never`; swap it for logging and the proof silently breaks.
- 2026-08-12 — better-auth — Installed package types beat fetched docs when they
  conflict.
