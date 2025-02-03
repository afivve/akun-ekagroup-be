import type { Request, RequestHandler, Response } from "express";

import { akunService } from "@/api/akun/akunService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class AkunController {
  public createAkun: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await akunService.createAkunService(req.body);

    return handleServiceResponse(serviceResponse, res);
  };
}
export const akunController = new AkunController();
