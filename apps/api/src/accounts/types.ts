export type AccountsError =
  | { kind: "databaseUnavailable"; cause: unknown }
  | { kind: "notFound" }
  | { kind: "databaseResponseInvalid"; cause: unknown };

export type Account = {
  id: string;
  category: "customer" | "system";
  holders: { id: string; name: string }[];
};
