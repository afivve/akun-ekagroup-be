import { StatusCodes } from "http-status-codes";

import { DivisiRepository } from "@/api/divisi/divisiRepository";
import type { CreateDivisi } from "@/api/divisi/divisiSchema";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import type { Divisi } from "@prisma/client";

export class DivisiService {
  private divisiRepository: DivisiRepository;

  constructor(repository: DivisiRepository = new DivisiRepository()) {
    this.divisiRepository = repository;
  }

  async createDivisiService(data: CreateDivisi): Promise<ServiceResponse<Divisi | null>> {
    try {
      const divisiExist = await this.divisiRepository.getDivisiRepository(undefined, undefined, data.namaDivisi);
      if (divisiExist) {
        return ServiceResponse.failure("Divisi Sudah Terdaftar", null, StatusCodes.CONFLICT);
      }

      const divisiResponse = await this.divisiRepository.createDivisiRepository(data);

      return ServiceResponse.success("Divisi Berhasil Ditambahkan", divisiResponse, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error creating division: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating division.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const divisiService = new DivisiService();
