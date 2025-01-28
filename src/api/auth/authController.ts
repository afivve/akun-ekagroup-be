import type { AuthenticatedRequest } from "@/common/middleware/verifyToken";
import type { Request, RequestHandler, Response } from "express";

import { authService } from "@/api/auth/authService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class AuthController {
  public registerUser: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await authService.registerService(req.body);

    return handleServiceResponse(serviceResponse, res);
  };

  public loginUser: RequestHandler = async (req: Request, res: Response) => {
    const authResponse = await authService.loginService(req.body);

    return handleServiceResponse(authResponse, res);
  };

  public me: RequestHandler = async (req: AuthenticatedRequest, res: Response) => {
    const idUser = req.user?.idUser as number;

    const meResponse = await authService.meService(idUser);

    return handleServiceResponse(meResponse, res);
  };

  public changePassword: RequestHandler = async (req: AuthenticatedRequest, res: Response) => {
    const idUser = req.user?.idUser as number;

    const changePasswordResponse = await authService.changePasswordService(idUser, req.body);

    return handleServiceResponse(changePasswordResponse, res);
  };
}

export const authController = new AuthController();
