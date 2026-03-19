import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
  database: {
    provider: "pg",
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  },
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "buyer",
        input: true,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
