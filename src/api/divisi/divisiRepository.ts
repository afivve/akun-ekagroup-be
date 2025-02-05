import type { CreateDivisi } from "@/api/divisi/divisiSchema";
import { prisma } from "@/common/utils/prismaClient";
import type { Akun, Divisi, Kategori, Prisma } from "@prisma/client";

export class DivisiRepository {
  async createDivisiRepository(data: CreateDivisi) {
    return await prisma.divisi.create({
      data: {
        namaDivisi: data.namaDivisi,
        kodeDivisi: data.kodeDivisi,
      },
    });
  }

  async getAllDivisiRepository(): Promise<Divisi[] | []> {
    return prisma.divisi.findMany({
      select: {
        idDivisi: true,
        namaDivisi: true,
        kodeDivisi: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getDivisiRepository(idDivisi?: number, kodeDivisi?: string, namaDivisi?: string): Promise<Divisi | null> {
    return prisma.divisi.findFirst({
      where: {
        OR: [
          idDivisi ? { idDivisi } : undefined,
          kodeDivisi ? { kodeDivisi } : undefined,
          namaDivisi ? { namaDivisi } : undefined,
        ].filter(Boolean) as Prisma.DivisiWhereInput[],
      },
      select: {
        idDivisi: true,
        namaDivisi: true,
        kodeDivisi: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getDivisiIncludeAkunRepository(filters: {
    idDivisi: number;
    namaDivisi?: string;
    kodeDivisi?: string;
  }): Promise<(Divisi & { akun: (Akun & { kategori?: Kategori | null })[] }) | null> {
    return prisma.divisi.findFirst({
      where: {
        idDivisi: filters?.idDivisi,
        namaDivisi: filters?.namaDivisi,
        kodeDivisi: filters?.kodeDivisi,
      },
      include: {
        akun: {
          select: {
            idAkun: true,
            kodeAkun: true,
            namaAkun: true,
            idDivisi: true,
            nomorAkun: true,
            saldo: true,
            isHeader: true,
            isProject: true,
            idKategori: true,
            idHeader: true,
            deskripsi: true,
            createdAt: true,
            updatedAt: true,
            kategori: {
              select: {
                idKategori: true,
                namaKategori: true,
                kodeKategori: true,
                headNumber: true,
                postIsDebet: true,
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
