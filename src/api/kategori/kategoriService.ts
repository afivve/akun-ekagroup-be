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
      const kategoriExist = await this.kategoriRepository.getKategoriRepository({ namaKategori: data.namaKategori });
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

  async getKategoriService(idKategori?: number, namaKategori?: string): Promise<ServiceResponse<Kategori | null>> {
    try {
      const kategoriResponse = await this.kategoriRepository.getKategoriRepository({ idKategori, namaKategori });

      if (!kategoriResponse) {
        return ServiceResponse.failure("Kategori not found", null, StatusCodes.NOT_FOUND);
      }

      const message = idKategori
        ? `Berhasil Mengambil Data Kategori Berdasarkan ID Kategori '${idKategori}'`
        : `Berhasil Mengambil Data Kategori Berdasarkan Nama Kategori '${namaKategori}'`;

      return ServiceResponse.success(message, kategoriResponse, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error getting category: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while getting category.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getKategoriIncludeAkunService(
    idKategori: number,
    filters?: { isHeader?: boolean | null; isProject?: boolean; idDivisi?: number },
  ): Promise<ServiceResponse<KategoriIncludeAkunResponse | null>> {
    try {
      const kategoriResponse = await this.kategoriRepository.getKategoriIncludeAkunRepository({
        idKategori,
        ...filters,
      });

      if (!kategoriResponse) {
        return ServiceResponse.failure("Kategori not found", null, StatusCodes.NOT_FOUND);
      }

      const kodeDivisi = kategoriResponse.akun.map((a) => a.divisi?.kodeDivisi);

      // Cari nomor akun terakhir yang valid
      const nomorAkunTerakhir = kategoriResponse.akun
        .map((a) => a.nomorAkun) // Ambil semua nomor akun
        .filter((nomor) => /^\d+-\d+$/.test(nomor)) // Pastikan formatnya valid, contoh: "1-1025"
        .map((nomor) => Number(nomor.split("-")[1])) // Ambil angka terakhir setelah "-"
        .reduce((max, num) => Math.max(max, num), 0); // Cari nomor akun terbesar

      // Naikkan angka terakhir +1
      const nomorAkunBaru = nomorAkunTerakhir + 1;

      // Buat saran nomor akun baru
      const saranNomorAkunBaru = `${kodeDivisi}-${nomorAkunBaru}`;

      const response = {
        kategori: {
          namaKategori: kategoriResponse.namaKategori,
          idKategori: kategoriResponse.idKategori,
          kodeKategori: kategoriResponse.kodeKategori,
          saranNomorAkunBaru: saranNomorAkunBaru,
        },
        akuns: kategoriResponse.akun.map((a) => ({
          idAkun: a.idAkun,
          nomorAkun: a.nomorAkun,
          namaAkun: a.namaAkun,
          kodeAkun: a.kodeAkun,
          isHeader: a.isHeader,
          idHeader: a.idHeader,
          isProject: a.isProject,
          idDivisi: a.idDivisi,
          namaDivisi: a.divisi?.namaDivisi ?? "",
          kodeDivisi: a.divisi?.kodeDivisi ?? "",
          createdAt: a.createdAt,
          updatedAt: a.updatedAt,
        })),
      };

      const baseMessage = `Berhasil Mengambil Data Kategori Berdasarkan ID Kategori '${idKategori}' Beserta Akun`;
      const filterMessages = [];

      if (filters?.isHeader !== undefined) {
        filterMessages.push(`isHeader '${filters.isHeader}'`);
      }
      if (filters?.isProject !== undefined) {
        filterMessages.push(`isProject '${filters.isProject}'`);
      }

      const message = filterMessages.length > 0 ? `${baseMessage} ${filterMessages.join(" dan ")}` : baseMessage;

      return ServiceResponse.success(message, response, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error getting category: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while getting category.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const kategoriService = new KategoriService();
