import { type FastifyInstance } from "fastify";
import * as accountsService from "./service.ts";

export function accountRoutes(server: FastifyInstance): void {
  server.get<{ Params: { id: string } }>(
    "/accounts/:id",
    async (req, reply) => {
      if (
        req.params.id == null ||
        !Number.isInteger(parseInt(req.params.id)) ||
        parseInt(req.params.id) <= 0
      ) {
        reply.code(400);
        return { error: "Bad Request" };
      }

      return accountsService.getAccountByID(parseInt(req.params.id)).match(
        (account) => account, // 200 by default, body = the account
        (error) => {
          switch (error.kind) {
            case "notFound":
              reply.code(404);
              return { error: "Account not found" };
            case "databaseUnavailable":
              server.log.error(error.cause); // log the real cause
              reply.code(503);
              return { error: "Service unavailable" };
          }
        },
      );
    },
  );
}
