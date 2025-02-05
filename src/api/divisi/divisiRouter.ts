import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { divisiController } from "@/api/divisi/divisiController";
import { GetDivisiSchema, CreateDivisiSchema, GetDivisiIncludeAkunSchema } from "@/api/divisi/divisiSchema";
import { verifyToken } from "@/common/middleware/verifyToken";
import { validateRequest } from "@/common/utils/httpHandlers";

export const divisiRegistry = new OpenAPIRegistry();
export const divisiRouter: Router = express.Router();

divisiRegistry.register("CreateDivisi", CreateDivisiSchema);

divisiRouter.post("/create", validateRequest(CreateDivisiSchema), divisiController.createDivisi);

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
  responses: createApiResponse(CreateDivisiSchema, "Success"),
});

divisiRegistry.register("GetDivisi", GetDivisiSchema);

divisiRouter.get("/", divisiController.getAllDivisi)

divisiRegistry.registerPath({
  method: "get",
  path: "/divisi",
  tags: ["Divisi"],
  responses: createApiResponse(GetDivisiSchema, "Success"),
})

divisiRegistry.register("GetDivisiIncludeAkun", GetDivisiIncludeAkunSchema);

divisiRouter.get(
  "/divisi-akun/:idDivisi",
  validateRequest(GetDivisiIncludeAkunSchema),
  divisiController.getDivisiIncludeAkun,
);

divisiRegistry.registerPath({
  method: "get",
  path: "/divisi/divisi-akun/{idDivisi}",
  tags: ["Divisi"],
  request: {
    params: GetDivisiIncludeAkunSchema.shape.params,
  },
  responses: createApiResponse(GetDivisiIncludeAkunSchema, "Success"),
});

