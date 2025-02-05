import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type CreateDivisi = z.infer<typeof CreateDivisiSchema>;
export const CreateDivisiSchema = z.object({
  namaDivisi: z.string().min(1, { message: "Nama Divisi is required" }),
  kodeDivisi: z.string().min(1, { message: "Kode Divisi is required" }),
});

export const GetDivisiIncludeAkunSchema = z.object({
  params: z.object({ idDivisi: commonValidations.id }),
});

export const GetDivisiSchema = z.object({
  idDivisi: z.number(),
  namaDivisi: z.string(),
  kodeDivisi: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
