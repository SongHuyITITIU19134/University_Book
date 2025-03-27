import config from "@/lib/config";
import { neon } from '@neondatabase/serverless';
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from './schema'; 

const sql = neon(config.env.databaseUrl);

export const db = drizzle(sql, { 
  schema, 
  logger: true, 
});