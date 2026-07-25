import type { FastifyPluginCallbackZod } from "@fastify/type-provider-zod";
import type { Account } from "./types.ts";
import * as accountsService from "./service.ts";
import * as z from "zod";

const VALID_ID_PATTERN = /^[1-9]\d*$/;

const accountResponseSchema = z.object({
  id: z.string(),
  category: z.enum(["customer", "system"]),
  holders: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .array(),
}) satisfies z.ZodType<Account>;

const errorResponseSchema = z.object({ error: z.string() });

export const accountRoutes: FastifyPluginCallbackZod = (server, opts, done) => {
  server.get(
    "/accounts/:id",
    {
      schema: {
        params: z.object({ id: z.string().regex(VALID_ID_PATTERN) }),
        response: {
          200: accountResponseSchema,
          default: errorResponseSchema,
        },
      },
    },
    async (req, reply) => {
      return accountsService.getAccountByID(req.params.id).match(
        (account) => account,
        (error) => {
          switch (error.kind) {
            case "invalidAccountID":
              reply.code(400);
              return { error: "Bad Request" };
            case "notFound":
              reply.code(404);
              return { error: "Account not found" };
            case "databaseError":
              req.log.error(error.cause);
              reply.code(500);
              return { error: "Internal Server Error" };
            case "databaseUnavailable":
              req.log.error(error.cause);
              reply.code(503);
              return { error: "Service unavailable" };
            default:
              const check: never = error;
              reply.code(500);
              return { error: "Internal Server Error" };
          }
        },
      );
    },
  );
  done();
};
