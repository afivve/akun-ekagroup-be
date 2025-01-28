import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError, type ZodSchema } from "zod";

import { ServiceResponse } from "@/common/models/serviceResponse";

export const handleServiceResponse = (serviceResponse: ServiceResponse<any>, response: Response) => {
  return response.status(serviceResponse.statusCode).send(serviceResponse);
};

export const validateRequest = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      ...req.body,
      params: req.params,
      ...req.query,
    });

    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const errorDetails = err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      const errorMessage = "Invalid input";
      const statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
      const serviceResponse = ServiceResponse.failure(
        errorMessage,
        errorDetails,

        statusCode,
      );
      return handleServiceResponse(serviceResponse, res);
    }

    const statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    const serviceResponse = ServiceResponse.failure("An unexpected error occurred", null, statusCode);
    return handleServiceResponse(serviceResponse, res);
  }
};
