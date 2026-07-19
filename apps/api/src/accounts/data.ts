import { pool } from "../db/pool.ts";
import { type AccountsError, type Account, type AccountRow } from "./types.ts";
import { fromPromise, ok, err, ResultAsync } from "neverthrow";

export function getAccountByID(
  accountID: number,
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
WHERE accounts.id = $1;`,
      [accountID],
    ),
    (cause): AccountsError => ({
      kind: "databaseUnavailable",
      cause,
    }),
  ).andThen((result) => {
    const rows = result.rows;

    if (rows.length === 0) {
      return err<Account, AccountsError>({
        kind: "notFound",
      });
    }

    const account: Account = {
      id: rows[0].account_id,
      category: rows[0].category,
      holders: rows
        .filter((r) => r.customer_id !== null) // filter out any rows where the holder fields are null
        .map((r) => ({
          id: r.customer_id,
          name: `${r.first_name} ${r.last_name}`,
        })),
    };

    return ok(account);
  });
}
