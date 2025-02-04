import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type CreateAkun = z.infer<typeof CreateAkunSchema>;
export const CreateAkunSchema = z
  .object({
    kodeAkun: z.string().min(1, { message: "kodeAkun is required" }),
    namaAkun: z.string().min(1, { message: "namaAkun is required" }),
    nomorAkun: z.string().min(1, { message: "nomorAkun is required" }),
    saldo: z.number().min(0, { message: "saldo is required" }),
    isHeader: z.boolean().nullable(),
    isProject: z.boolean(),
    idDivisi: z.number().min(1, { message: "idDivisi Id is required" }),
    idKategori: z.number().min(1, { message: "idKategori Id is required" }),
    idHeader: z.string().nullable(),
    deskripsi: z.string(),
  })
  .refine((data) => !(data.isHeader === true && data.idHeader !== null), {
    message: "idHeader harus null jika isHeader true",
    path: ["idHeader"],
  })
  .refine((data) => !(data.isHeader === false && data.idHeader === null), {
    message: "idHeader tidak bisa null jika isHeader false",
    path: ["idHeader"],
  })
  .refine((data) => !(data.isHeader === null && data.idHeader !== null), {
    message: "idHeader harus null jika isHeader null",
    path: ["idHeader"],
  });
