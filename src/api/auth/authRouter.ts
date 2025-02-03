import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { authController } from "@/api/auth/authController";
import { ChangePasswordSchema, LoginUserSchema, RegisterUserSchema } from "@/api/auth/authSchema";
import { verifyToken } from "@/common/middleware/verifyToken";
import { validateRequest } from "@/common/utils/httpHandlers";

export const authRegistry = new OpenAPIRegistry();
export const authRouter: Router = express.Router();

authRegistry.register("RegisterUser", RegisterUserSchema);
authRegistry.register("LoginUser", LoginUserSchema);

authRegistry.registerPath({
  method: "post",
  path: "/auth/register",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: RegisterUserSchema,
        },
      },
    },
  },
  responses: createApiResponse(z.object({ id: z.number() }), "Success"),
});

authRouter.post("/register", validateRequest(RegisterUserSchema), authController.registerUser);

authRegistry.registerPath({
  method: "post",
  path: "/auth/login",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: LoginUserSchema,
        },
      },
    },
  },
  responses: createApiResponse(z.object({ id: z.number() }), "Success"),
});

authRouter.post("/login", validateRequest(LoginUserSchema), authController.loginUser);

authRouter.get("/me", verifyToken, authController.me);

authRouter.post("/change-password", verifyToken, validateRequest(ChangePasswordSchema), authController.changePassword);
