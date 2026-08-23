import { ResultAsync } from "neverthrow";

import * as AccountsData from "./data.ts";
import type { Account, AccountsError } from "./types.ts";

export function getAccountByID(id: string): ResultAsync<Account, AccountsError> {
  return AccountsData.getAccountByID(id);
}
