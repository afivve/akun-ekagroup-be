import type { CreateCategory } from "@/api/kategori/kategoriSchema";
import { prisma } from "@/common/utils/prismaClient";
import type { Akun, Kategori, Prisma } from "@prisma/client";

export class KategoriRepository {
  async createKategoriRepository(data: CreateCategory) {
    return await prisma.kategori.create({
      data: {
        namaKategori: data.namaKategori,
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
        headNumber: true,
        postIsDebet: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getKategoriRepository(idKategori?: number, namaKategori?: string): Promise<Kategori | null> {
    return prisma.kategori.findFirst({
      where: {
        OR: [idKategori ? { idKategori } : undefined, namaKategori ? { namaKategori } : undefined].filter(
          Boolean,
        ) as Prisma.KategoriWhereInput[],
      },
      select: {
        idKategori: true,
        namaKategori: true,
        headNumber: true,
        postIsDebet: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getKategoriIncludeAkunRepository(idKategori: number): Promise<(Kategori & { akun: Akun[] })[] | null> {
    return prisma.kategori.findMany({
      where: {
        idKategori,
      },
      include: {
        akun: {
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
          },
        },
      },
    });
  }
}
