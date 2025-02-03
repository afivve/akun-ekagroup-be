import type { CreateDivisi } from "@/api/divisi/divisiSchema";
import { prisma } from "@/common/utils/prismaClient";
import type { Divisi, Prisma } from "@prisma/client";

export class DivisiRepository {
  async createDivisiRepository(data: CreateDivisi) {
    return await prisma.divisi.create({
      data: {
        namaDivisi: data.namaDivisi,
        kodeDivisi: data.kodeDivisi,
      },
    });
  }

  getAllDivisiRepository(): Promise<Divisi[] | []> {
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
}
