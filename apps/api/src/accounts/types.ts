export type AccountsError =
  { kind: "databaseUnavailable"; cause: unknown } | { kind: "notFound" };

export type AccountRow = {
  account_id: number;
  category: "customer" | "system";
  customer_id: number;
  first_name: string;
  last_name: string;
};

export type Account = {
  id: number;
  category: "customer" | "system";
  holders: { id: number; name: string }[];
};
