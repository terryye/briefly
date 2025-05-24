import { type Config } from "drizzle-kit";
import { loadEnvConfig } from "@next/env";
const projectDir = process.cwd();
loadEnvConfig(projectDir);

export default {
    schema: "./drizzle/schema.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL ?? "",
    },
    tablesFilter: [`${process.env.DATABASE_TB_PREFIX}*`],
} satisfies Config;
