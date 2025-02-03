import { StatusCodes } from "http-status-codes";

import { AkunRepository } from "@/api/akun/akunRepository";
import type { CreateAkun } from "@/api/akun/akunSchema";
import { DivisiRepository } from "@/api/divisi/divisiRepository";
import { KategoriRepository } from "@/api/kategori/kategoriRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import type { Akun } from "@prisma/client";

export class AkunService {
  private akunRepository: AkunRepository;
  private divisiRepository: DivisiRepository;
  private kategoriRepository: KategoriRepository;

  constructor(
    akunRepository: AkunRepository = new AkunRepository(),
    divisiRepository: DivisiRepository = new DivisiRepository(),
    kategoriRepository: KategoriRepository = new KategoriRepository(),
  ) {
    this.akunRepository = akunRepository;
    this.divisiRepository = divisiRepository;
    this.kategoriRepository = kategoriRepository;
  }

  async createAkunService(data: CreateAkun): Promise<ServiceResponse<Akun | null>> {
    try {
      const checkDivisi = await this.divisiRepository.getDivisiRepository(data.idDivisi);
      if (!checkDivisi) {
        return ServiceResponse.failure("Divisi Tidak Ditemukan", null, StatusCodes.NOT_FOUND);
      }

      const checkKategori = await this.kategoriRepository.getKategoriRepository(data.idKategori);
      if (!checkKategori) {
        return ServiceResponse.failure("Kategori Tidak Ditemukan", null, StatusCodes.NOT_FOUND);
      }

      const akunResponse = await this.akunRepository.createAkunRepository(data);

      return ServiceResponse.success("Akun Berhasil Ditambahkan", akunResponse, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error creating account: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating account.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const akunService = new AkunService();
