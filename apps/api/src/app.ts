import Fastify, { type FastifyInstance } from "fastify";
import { uuidv7 } from "uuidv7";
import { pool } from "./db/pool.ts";

export function createServer(): FastifyInstance {
  const server = Fastify({
    logger: true,
    genReqId: () => uuidv7(),
  });

  server.get("/health", async () => {
    return { status: "ok" };
  });

  server.get("/ready", async (request, reply) => {
    try {
      const query = await pool.query("SELECT 1 FROM schema_migrations LIMIT 1");
      if (query.rows.length === 0) {
        reply.code(503);
        return { status: "Service unavailable" };
      }
    } catch (err) {
      server.log.error(err);
      reply.code(503);
      return { status: "Service unavailable" };
    }
    return { status: "Ready" };
  });

  server.addHook("onClose", async () => {
    await pool.end();
  });

  return server;
}
