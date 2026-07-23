import { pool } from "../db/pool.ts";
import { type AccountsError, type Account } from "./types.ts";
import { fromPromise, ok, err, ResultAsync } from "neverthrow";
import * as z from "zod";

const accountRowSchema = z.object({
  account_id: z.string(),
  category: z.enum(["customer", "system"]),
  customer_id: z.string().nullable(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
});

export type AccountRow = z.infer<typeof accountRowSchema>;

export function getAccountByID(
  accountID: string,
): ResultAsync<Account, AccountsError> {
  return fromPromise(
    pool.query<AccountRow>(
      `SELECT
    accounts.id AS account_id,
    accounts.category,
    account_holder.customer_id AS customer_id,
    customers.first_name,
    customers.last_name
FROM accounts
LEFT JOIN account_holder ON accounts.id = account_holder.account_id
LEFT JOIN customers ON account_holder.customer_id = customers.id
WHERE accounts.id = $1
ORDER BY customers.id;`,
      [accountID],
    ),
    (cause): AccountsError => ({
      kind: "databaseUnavailable",
      cause,
    }),
  ).andThen((result) => {
    const parsed = z.array(accountRowSchema).safeParse(result.rows);

    if (!parsed.success) {
      return err<Account, AccountsError>({
        kind: "databaseResponseInvalid",
        cause: parsed.error,
      });
    }

    const rows = parsed.data;

    if (rows.length === 0) {
      return err<Account, AccountsError>({
        kind: "notFound",
      });
    }

    const account: Account = {
      id: rows[0].account_id,
      category: rows[0].category,
      holders: rows
        .filter(
          (
            r,
          ): r is AccountRow & {
            customer_id: string;
            first_name: string;
            last_name: string;
          } =>
            r.customer_id !== null &&
            r.first_name !== null &&
            r.last_name !== null,
        ) // filter out any rows where the holder fields are null
        .map((r) => ({
          id: r.customer_id,
          name: `${r.first_name} ${r.last_name}`,
        })),
    };

    return ok(account);
  });
}
