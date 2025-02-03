import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type CreateDivisi = z.infer<typeof CreateDivisiSchema>;
export const CreateDivisiSchema = z.object({
  namaDivisi: z.string().min(1, { message: "Nama Divisi is required" }),
  kodeDivisi: z.string().min(1, { message: "Kode Divisi is required" }),
});
