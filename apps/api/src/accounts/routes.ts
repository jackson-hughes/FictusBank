import { type FastifyInstance } from "fastify";
import * as accountsService from "./service.ts";

const VALID_ID_PATTERN = /^[1-9]\d*$/;

export function accountRoutes(server: FastifyInstance): void {
  server.get<{ Params: { id: string } }>(
    "/accounts/:id",
    async (req, reply) => {
      if (!VALID_ID_PATTERN.test(req.params.id)) {
        reply.code(400);
        return { error: "Bad request" };
      }

      return accountsService.getAccountByID(req.params.id).match(
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
