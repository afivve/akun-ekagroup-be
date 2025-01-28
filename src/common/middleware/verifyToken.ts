import { ServiceResponse } from "@/common/models/serviceResponse";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import { env } from "@/common/utils/envConfig";
const { JWT_SECRET } = env;

export interface JwtPayload {
  idUser: number;
  [key: string]: any;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(ServiceResponse.failure("Access token is missing or invalid", null, StatusCodes.UNAUTHORIZED));
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(ServiceResponse.failure("Invalid or expired token", null, StatusCodes.UNAUTHORIZED));
  }
};
