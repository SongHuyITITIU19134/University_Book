import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" })
console.log("Database URL:", process.env.DATABASE_URL); // Debugging

export default defineConfig(
    {
        schema: './database/schema.ts',
        out: './migrations',
        dialect: 'postgresql',
        dbCredentials: {
            url: process.env.DATABASE_URL!,
        },
    }
)

