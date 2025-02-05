import type { Request, RequestHandler, Response } from "express";

import { divisiService } from "@/api/divisi/divisiService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class DivisiController {
  public createDivisi: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await divisiService.createDivisiService(req.body);

    return handleServiceResponse(serviceResponse, res);
  };

  public getAllDivisi: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await divisiService.getAllDivisi()

    return handleServiceResponse(serviceResponse, res);
  };
  

  public getDivisiIncludeAkun: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await divisiService.getDivisiIncludeAkunService(Number(req.params.idDivisi));

    return handleServiceResponse(serviceResponse, res);
  };
}

export const divisiController = new DivisiController();
