export type AccountsError =
  { kind: "databaseUnavailable"; cause: unknown } | { kind: "notFound" };

export type AccountRow = {
  account_id: string;
  category: "customer" | "system";
  customer_id: string;
  first_name: string;
  last_name: string;
};

export type Account = {
  id: string;
  category: "customer" | "system";
  holders: { id: string; name: string }[];
};
