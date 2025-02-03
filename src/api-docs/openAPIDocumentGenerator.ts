import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";

import { akunRegistry } from "@/api/akun/akunRouter";
import { authRegistry } from "@/api/auth/authRouter";
import { divisiRegistry } from "@/api/divisi/divisiRouter";
import { healthCheckRegistry } from "@/api/healthCheck/healthCheckRouter";
import { kategoriRegistry } from "@/api/kategori/kategoriRouter";
import { userRegistry } from "@/api/user/userRouter";

export function generateOpenAPIDocument() {
  const registry = new OpenAPIRegistry([
    healthCheckRegistry,
    userRegistry,
    authRegistry,
    kategoriRegistry,
    divisiRegistry,
    akunRegistry,
  ]);
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Swagger API",
    },
    externalDocs: {
      description: "View the raw OpenAPI Specification in JSON format",
      url: "/swagger.json",
    },
  });
}
