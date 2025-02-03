import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { akunController } from "@/api/akun/akunController";
import { CreateAkunSchema } from "@/api/akun/akunSchema";
import { verifyToken } from "@/common/middleware/verifyToken";
import { validateRequest } from "@/common/utils/httpHandlers";

export const akunRegistry = new OpenAPIRegistry();
export const akunRouter: Router = express.Router();

akunRegistry.register("CreateAkun", CreateAkunSchema);

akunRegistry.registerPath({
  method: "post",
  path: "/akun/create",
  tags: ["Akun"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateAkunSchema,
        },
      },
    },
  },
  responses: createApiResponse(z.object({ id: z.number() }), "Success"),
});

akunRouter.post("/create", validateRequest(CreateAkunSchema), akunController.createAkun);
