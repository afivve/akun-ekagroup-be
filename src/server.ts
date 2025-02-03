import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";

import bodyParser from "body-parser";

import { openAPIRouter } from "@/api-docs/openAPIRouter";
import { akunRouter } from "@/api/akun/akunRouter";
import { authRouter } from "@/api/auth/authRouter";
import { divisiRouter } from "@/api/divisi/divisiRouter";
import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import { kategoriRouter } from "@/api/kategori/kategoriRouter";
import { userRouter } from "@/api/user/userRouter";
import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";

const logger = pino({ name: "server start" });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);
app.use(bodyParser.json());

// Request logging
app.use(requestLogger);

// Routes
app.use("/health-check", healthCheckRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/kategori", kategoriRouter);
app.use("/divisi", divisiRouter);
app.use("/akun", akunRouter);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
