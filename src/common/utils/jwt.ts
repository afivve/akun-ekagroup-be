import { env } from "@/common/utils/envConfig";
import jwt from "jsonwebtoken";

import { logger } from "@/server";

const { JWT_SECRET } = env;

const SECRET_KEY = JWT_SECRET;

export const generateToken = (payload: Record<string, any>, expiresIn = "1d"): string => {
  try {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
  } catch (ex) {
    const errorMessage = `Error Create JWT: ${(ex as Error).message}`;
    logger.error(errorMessage);
    throw new Error("An error occurred while creating JWT Token.");
  }
};

export const verifyToken = (token: string): string | jwt.JwtPayload => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (ex) {
    const errorMessage = `Error Verify Token JWT: ${(ex as Error).message}`;
    logger.error(errorMessage);
    throw new Error("Invalid Verify Token JWT");
  }
};
