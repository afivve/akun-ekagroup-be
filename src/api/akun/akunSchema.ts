import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type CreateAkun = z.infer<typeof CreateAkunSchema>;
export const CreateAkunSchema = z.object({
  kodeAkun: z.string().min(1, { message: "kodeAkun is required" }),
  namaAkun: z.string().min(1, { message: "namaAkun is required" }),
  nomorAkun: z.string().min(1, { message: "nomorAkun is required" }),
  saldo: z.number().min(0, { message: "saldo is required" }),
  isHeader: z.boolean().nullable(),
  isProject: z.boolean(),
  idDivisi: z.number().min(1, { message: "idDivisi Id is required" }),
  idKategori: z.number().min(1, { message: "idKategori Id is required" }),
  idHeader: z.number().nullable(),
  deskripsi: z.string(),
});
