import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type CreateCategory = z.infer<typeof CreateCategorySchema>;
export const CreateCategorySchema = z.object({
  namaKategori: z.string().min(1, { message: "Nama Kategori is required" }),
  headNumber: z.number().min(0, { message: "Head Number is required" }),
  postIsDebet: z.boolean(),
});

export const GetKategoriIncludeAkunSchema = z.object({
  params: z.object({ idKategori: commonValidations.id }),
});
