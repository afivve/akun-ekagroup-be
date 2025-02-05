import { StatusCodes } from "http-status-codes";

import { DivisiRepository } from "@/api/divisi/divisiRepository";
import type { DivisiIncludeAkunResponse } from "@/api/divisi/divisiResponse";
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

  async getAllDivisi(): Promise<ServiceResponse<Divisi[] | null>> {
    try {
      const divisiList = await this.divisiRepository.getAllDivisiRepository();
      return ServiceResponse.success("Berhasil Mengambil Semua Data Divisi", divisiList, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error retrieving division list: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving division list.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getDivisiIncludeAkunService(idDivisi: number): Promise<ServiceResponse<DivisiIncludeAkunResponse | null>> {
    try {
      const divisiResponse = await this.divisiRepository.getDivisiIncludeAkunRepository({ idDivisi });

      if (!divisiResponse) {
        return ServiceResponse.failure("Divisi not found", null, StatusCodes.NOT_FOUND);
      }

      const response = {
        divisi: {
          idDivisi: divisiResponse.idDivisi,
          namaDivisi: divisiResponse.namaDivisi,
          kodeDivisi: divisiResponse.kodeDivisi,
        },
        akuns: divisiResponse.akun.map((a) => ({
          idAkun: a.idAkun,
          kodeAkun: a.kodeAkun,
          namaAkun: a.namaAkun,
          idKategori: a.kategori?.idKategori,
          namaKategori: a.kategori?.namaKategori,
          saldo: a.saldo,
          nomorAkun: a.nomorAkun,
          isHeader: a.isHeader,
          idHeader: a.idHeader,
          isProject: a.isProject,
          idDivisi: a.idDivisi,
          createdAt: a.createdAt,
          updatedAt: a.updatedAt,
        })),
      };

      let message = `Berhasil Mengambil Data '${divisiResponse.namaDivisi}' Beserta Akun`

      return ServiceResponse.success(message, response, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error getting division: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while getting division.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const divisiService = new DivisiService();
