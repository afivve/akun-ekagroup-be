import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { kategoriController } from "@/api/kategori/kategoriController";
import { CreateCategorySchema, GetKategoriIncludeAkunSchema } from "@/api/kategori/kategoriSchema";
import { verifyToken } from "@/common/middleware/verifyToken";
import { validateRequest } from "@/common/utils/httpHandlers";

export const kategoriRegistry = new OpenAPIRegistry();
export const kategoriRouter: Router = express.Router();

kategoriRegistry.register("CreateCategory", CreateCategorySchema);
kategoriRegistry.register("GetKategoriIncludeAkun", GetKategoriIncludeAkunSchema);

kategoriRegistry.registerPath({
  method: "post",
  path: "/kategori/create",
  tags: ["Kategori"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateCategorySchema,
        },
      },
    },
  },
  responses: createApiResponse(z.object({ id: z.number() }), "Success"),
});

kategoriRouter.post("/create", validateRequest(CreateCategorySchema), kategoriController.createKategori);

kategoriRegistry.registerPath({
  method: "get",
  path: "/kategori/kategori-akun/{idKategori}",
  tags: ["Kategori"],
  request: {
    params: GetKategoriIncludeAkunSchema.shape.params,
    query: z.object({
      isHeader: z
        .enum(["true", "false", "null"])
        .optional()
        .transform((val) => {
          if (val === "true") return true;
          if (val === "false") return false;
          if (val === "null") return null;
          return undefined;
        }),
      isProject: z
        .enum(["true", "false"])
        .optional()
        .transform((val) => {
          if (val === "true") return true;
          if (val === "false") return false;
          return undefined;
        }),
    }),
  },
  responses: createApiResponse(z.object({ id: z.number() }), "Success"),
});

kategoriRouter.get(
  "/kategori-akun/:idKategori",
  validateRequest(GetKategoriIncludeAkunSchema),
  kategoriController.getKategoriIncludeAkun,
);
