import type { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { userService } from "@/api/user/userService";
import { generateUserExcel } from "@/common/utils/excel";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { generateUserPDF } from "@/common/utils/pdf";

class UserController {
  public getUsers: RequestHandler = async (req: Request, res: Response) => {
    const { username } = req.query;
    const serviceResponse = await userService.findAll({
      username: username as string | undefined,
    });
    return handleServiceResponse(serviceResponse, res);
  };

  public exportUsersToExcel: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await userService.findAll({});
    if (serviceResponse.success && serviceResponse.responseObject) {
      const buffer = await generateUserExcel(serviceResponse.responseObject);
      res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      return res.status(StatusCodes.OK).send(buffer);
    }
    return handleServiceResponse(serviceResponse, res);
  };

  public exportUsersToPDF: RequestHandler = async (req: Request, res: Response) => {
    try {
      const serviceResponse = await userService.findAll({});
      if (serviceResponse.success && serviceResponse.responseObject) {
        const buffer = await generateUserPDF(serviceResponse.responseObject);
        res.setHeader("Content-Disposition", "attachment; filename=users.pdf");
        res.setHeader("Content-Type", "application/pdf");
        return res.status(StatusCodes.OK).send(buffer);
      }
      return handleServiceResponse(serviceResponse, res);
    } catch (error) {
      console.error("Error generating PDF:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed generate PDF" });
    }
  };

  public getUser: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await userService.findById(id);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const userController = new UserController();
