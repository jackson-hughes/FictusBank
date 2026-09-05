# Decisions

Design decisions Jackson has made, each with the trigger that would reopen it.
Claude records an entry when one is settled in conversation; Jackson owns the
content. Format: `date — decision — revisit when …`. ≤ 30 lines; older
entries whose trigger has passed move to `.claude/archive/`.

- 2026-08-12 — config: `secret` singular, not a `secrets` object — revisit when
  adding an OAuth provider with token encryption at rest.

Unrecorded from the chat era (Jackson fills in, or Claude asks at a pause):
Kysely; hexagonal; `fictusbank_test`; close-with-grace delay; advisory locking;
multi-currency; joint accounts; SQLSTATE grouping (enumerated vs class prefix);
`BASE_URL`.
