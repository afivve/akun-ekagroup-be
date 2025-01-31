import dotenv from "dotenv";
import path from "path";
import { cleanEnv, host, num, port, str, testOnly } from "envalid";

const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Validasi variabel lingkungan
export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ["development", "production", "staging"] }),
  HOST: host({ devDefault: testOnly("localhost") }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str(),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num(),
  COMMON_RATE_LIMIT_WINDOW_MS: num(),
  JWT_SECRET: str(),
})
