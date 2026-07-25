export type AccountsError =
  | { kind: "databaseUnavailable"; cause: unknown }
  | { kind: "databaseError"; cause: unknown }
  | { kind: "invalidAccountID"; cause: unknown }
  | { kind: "notFound" };

export type Account = {
  id: string;
  category: "customer" | "system";
  holders: { id: string; name: string }[];
};
