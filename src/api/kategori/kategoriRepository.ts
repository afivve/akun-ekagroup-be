import type { CreateCategory } from "@/api/kategori/kategoriSchema";
import { prisma } from "@/common/utils/prismaClient";
import type { Akun, Divisi, Kategori, Prisma } from "@prisma/client";

export class KategoriRepository {
  async createKategoriRepository(data: CreateCategory) {
    return await prisma.kategori.create({
      data: {
        namaKategori: data.namaKategori,
        kodeKategori: data.kodeKategori,
        headNumber: data.headNumber,
        postIsDebet: data.postIsDebet,
      },
    });
  }

  getAllKategoriRepository(): Promise<Kategori[] | []> {
    return prisma.kategori.findMany({
      select: {
        idKategori: true,
        namaKategori: true,
        kodeKategori: true,
        headNumber: true,
        postIsDebet: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getKategoriRepository(filters?: { idKategori?: number; namaKategori?: string }): Promise<Kategori | null> {
    return prisma.kategori.findFirst({
      where: {
        idKategori: filters?.idKategori,
        namaKategori: filters?.namaKategori,
      },
      select: {
        idKategori: true,
        namaKategori: true,
        kodeKategori: true,
        headNumber: true,
        postIsDebet: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getKategoriIncludeAkunRepository(filters?: {
    idKategori: number;
    isHeader?: boolean | null;
    isProject?: boolean;
    idDivisi?: number;
  }): Promise<(Kategori & { akun: (Akun & { divisi?: Divisi | null })[] }) | null> {
    return prisma.kategori.findFirst({
      where: {
        idKategori: filters?.idKategori,
      },
      include: {
        akun: {
          where: {
            isHeader: filters?.isHeader,
            isProject: filters?.isProject,
            idDivisi: filters?.idDivisi,
          },
          select: {
            idAkun: true,
            kodeAkun: true,
            namaAkun: true,
            nomorAkun: true,
            saldo: true,
            isHeader: true,
            idHeader: true,
            isProject: true,
            idDivisi: true,
            idKategori: true,
            deskripsi: true,
            createdAt: true,
            updatedAt: true,
            divisi: {
              select: {
                idDivisi: true,
                namaDivisi: true,
                kodeDivisi: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });
  }
}
