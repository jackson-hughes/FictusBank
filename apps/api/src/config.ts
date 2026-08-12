import * as z from "zod";

const envConfigSchema = z.object({
  //   BASE_URL: z.string(),
  DATABASE_NAME: z.string().default("fictusbank"),
  DATABASE_PASSWORD: z.string().nonempty(),
  DATABASE_URL: z.string().nonempty(),
  PORT: z.coerce.number().pipe(z.int().min(1).max(65535)).default(3000),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url().default("http://localhost:3000"),
});

const parsed = envConfigSchema.safeParse(process.env);
if (!parsed.success) {
  console.log("config error: ", parsed.error);
  process.exit(1);
}
export const envConfig = parsed.data;
