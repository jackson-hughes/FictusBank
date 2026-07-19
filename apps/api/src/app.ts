import Fastify, { type FastifyInstance } from "fastify";
import { uuidv7 } from "uuidv7";
import { pool } from "./db/pool.ts";
import { readinessCheck } from "./health/readiness.ts";
import { accountRoutes } from "./accounts/routes.ts";

export function createServer(): FastifyInstance {
  const server = Fastify({
    logger: true,
    genReqId: () => uuidv7(),
  });

  server.get("/health", async () => {
    return { status: "ok" };
  });

  server.get("/ready", async (_req, reply) => {
    return readinessCheck().match(
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

  server.register(accountRoutes);

  server.addHook("onClose", async () => {
    await pool.end();
  });

  return server;
}
