import * as AccountsData from "./data.ts";
import type { Account, AccountsError } from "./types.ts";
import { ResultAsync } from "neverthrow";

export function getAccountByID(
  id: string,
): ResultAsync<Account, AccountsError> {
  return AccountsData.getAccountByID(id);
}
