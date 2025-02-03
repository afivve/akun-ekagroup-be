import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { divisiController } from "@/api/divisi/divisiController";
import { CreateDivisiSchema } from "@/api/divisi/divisiSchema";
import { verifyToken } from "@/common/middleware/verifyToken";
import { validateRequest } from "@/common/utils/httpHandlers";

export const divisiRegistry = new OpenAPIRegistry();
export const divisiRouter: Router = express.Router();

divisiRegistry.register("CreateDivisi", CreateDivisiSchema);

divisiRegistry.registerPath({
  method: "post",
  path: "/divisi/create",
  tags: ["Divisi"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateDivisiSchema,
        },
      },
    },
  },
  responses: createApiResponse(z.object({ id: z.number() }), "Success"),
});

divisiRouter.post("/create", validateRequest(CreateDivisiSchema), divisiController.createDivisi);
