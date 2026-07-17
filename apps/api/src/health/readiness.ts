import { pool } from "../db/pool.ts";
import { fromPromise, ResultAsync } from "neverthrow";

type ReadinessError = { kind: "databaseUnavailable"; cause: unknown };

export function readinessCheck(): ResultAsync<void, ReadinessError> {
  return fromPromise(pool.query("SELECT 1"), (cause): ReadinessError => ({
    kind: "databaseUnavailable",
    cause,
  })).map(() => undefined);
}
