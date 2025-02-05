import type { Request, RequestHandler, Response } from "express";

import { kategoriService } from "@/api/kategori/kategoriService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class KategoriController {
  public createKategori: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await kategoriService.createKategoriService(req.body);

    return handleServiceResponse(serviceResponse, res);
  };

  public getKategori: RequestHandler = async (req: Request, res: Response) => {
    const idKategori = req.params.idKategori;

    const namaKategori = req.query.namaKategori;

    const serviceResponse = await kategoriService.getKategoriService(Number(idKategori), namaKategori as string);

    return handleServiceResponse(serviceResponse, res);
  };

  public getKategoriIncludeAkun: RequestHandler = async (req: Request, res: Response) => {
    const { isHeader, isProject, idDivisi } = req.query;

    const filters = {
      isHeader: isHeader === "true" ? true : isHeader === "false" ? false : isHeader === "null" ? null : undefined,
      isProject: isProject === "true" ? true : isProject === "false" ? false : undefined,
      idDivisi: idDivisi ? Number(idDivisi) : undefined,
    };

    const serviceResponse = await kategoriService.getKategoriIncludeAkunService(Number(req.params.idKategori), filters);

    return handleServiceResponse(serviceResponse, res);
  };
}

export const kategoriController = new KategoriController();
