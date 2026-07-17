import Fastify, { type FastifyInstance } from "fastify";
import { uuidv7 } from "uuidv7";
import { pool } from "./db/pool.ts";
import { fromPromise, ResultAsync } from "neverthrow";

type ReadinessError = { kind: "databaseUnavailable"; cause: unknown };

export function dbCheck(): ResultAsync<void, ReadinessError> {
  return fromPromise(pool.query("SELECT 1"), (cause): ReadinessError => ({
    kind: "databaseUnavailable",
    cause,
  })).map(() => undefined);
}

export function createServer(): FastifyInstance {
  const server = Fastify({
    logger: true,
    genReqId: () => uuidv7(),
  });

  server.get("/health", async () => {
    return { status: "ok" };
  });

  server.get("/ready", async (_req, reply) => {
    return dbCheck().match(
      (_ok) => {
        return { status: "Ready" };
      },
      (err) => {
        server.log.error(err.cause);
        reply.code(503);
        return { status: "Service unavailable" };
      },
    );
  });

  server.addHook("onClose", async () => {
    await pool.end();
  });

  return server;
}
