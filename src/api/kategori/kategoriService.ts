import { StatusCodes } from "http-status-codes";

import { KategoriRepository } from "@/api/kategori/kategoriRepository";
import type { KategoriIncludeAkunResponse } from "@/api/kategori/kategoriResponse";
import type { CreateCategory } from "@/api/kategori/kategoriSchema";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import type { Kategori } from "@prisma/client";

export class KategoriService {
  private kategoriRepository: KategoriRepository;

  constructor(repository: KategoriRepository = new KategoriRepository()) {
    this.kategoriRepository = repository;
  }

  async createKategoriService(data: CreateCategory): Promise<ServiceResponse<Kategori | null>> {
    try {
      const kategoriExist = await this.kategoriRepository.getKategoriRepository(undefined, data.namaKategori);
      if (kategoriExist) {
        return ServiceResponse.failure("Kategori Sudah Terdaftar", null, StatusCodes.CONFLICT);
      }

      const kategoriResponse = await this.kategoriRepository.createKategoriRepository(data);

      return ServiceResponse.success("Kategori Berhasil Ditambahkan", kategoriResponse, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error creating category: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating category.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getKategoriIncludeAkunService(
    idKategori: number,
  ): Promise<ServiceResponse<KategoriIncludeAkunResponse[] | null>> {
    try {
      const kategoriResponse = await this.kategoriRepository.getKategoriIncludeAkunRepository(idKategori);

      if (!kategoriResponse) {
        return ServiceResponse.failure("Kategori not found", [], StatusCodes.NOT_FOUND);
      }

      const saran = "1-1000";

      const response = kategoriResponse.map((kategori) => {
        return {
          kategori: {
            namaKategori: kategori.namaKategori,
            idKategori: kategori.idKategori,
            saranNomorAkunBaru: saran,
          },
          akuns: kategori.akun.map((a) => {
            return {
              idAkun: a.idAkun,
              nomorAkun: a.nomorAkun,
              namaAkun: a.namaAkun,
              kodeAkun: a.kodeAkun,
              isHeader: a.isHeader,
              idHeader: a.idHeader,
              createdAt: a.createdAt,
              updatedAt: a.updatedAt,
            };
          }),
        };
      });

      return ServiceResponse.success("Data Kategori", response, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error getting category: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while getting category.",
        [],
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const kategoriService = new KategoriService();
