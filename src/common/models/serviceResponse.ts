import { StatusCodes } from "http-status-codes";
import { z } from "zod";

export class ServiceResponse<T = null> {
  readonly success: boolean;
  readonly message: string;
  readonly value: T;
  readonly statusCode: number;

  private constructor(success: boolean, message: string, value: T, statusCode: number) {
    this.success = success;
    this.message = message;
    this.value = value;
    this.statusCode = statusCode;
  }

  static success<T>(message: string, value: T, statusCode: number = StatusCodes.OK) {
    return new ServiceResponse(true, message, value, statusCode);
  }

  static failure<T>(message: string, value: T, statusCode: number = StatusCodes.BAD_REQUEST) {
    return new ServiceResponse(false, message, value, statusCode);
  }
}

export const ServiceResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    value: dataSchema.optional(),
    statusCode: z.number(),
  });
