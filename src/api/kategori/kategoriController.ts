import type { Request, RequestHandler, Response } from "express";

import { kategoriService } from "@/api/kategori/kategoriService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class KategoriController {
  public createKategori: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await kategoriService.createKategoriService(req.body);

    return handleServiceResponse(serviceResponse, res);
  };

  public getKategoriIncludeAkun: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await kategoriService.getKategoriIncludeAkunService(Number(req.params.idKategori));

    return handleServiceResponse(serviceResponse, res);
  };
}

export const kategoriController = new KategoriController();
