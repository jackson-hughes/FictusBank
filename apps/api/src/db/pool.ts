import { Pool } from "pg";

import { envConfig } from "../config.ts";

export const pool = new Pool({
  connectionString: envConfig.DATABASE_URL,
});

pool.on("error", (err) => {
  console.error("pool error:", err.message);
});
