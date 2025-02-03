import { prisma } from "@/common/utils/prismaClient";

import type { CreateAkun } from "@/api/akun/akunSchema";
import type { Akun, Prisma } from "@prisma/client";

export class AkunRepository {
  async createAkunRepository(data: CreateAkun) {
    return await prisma.akun.create({
      data: {
        kodeAkun: data.kodeAkun,
        namaAkun: data.namaAkun,
        nomorAkun: data.nomorAkun,
        saldo: data.saldo,
        isHeader: data.isHeader,
        isProject: data.isProject,
        idDivisi: data.idDivisi,
        idKategori: data.idKategori,
        idHeader: data.idHeader,
        deskripsi: data.deskripsi,
      },
    });
  }

  async getAkunRepository(idAkun?: number, kodeAkun?: string): Promise<Akun | null> {
    return prisma.akun.findFirst({
      where: {
        OR: [idAkun ? { idAkun } : undefined, kodeAkun ? { kodeAkun } : undefined].filter(
          Boolean,
        ) as Prisma.AkunWhereInput[],
      },
      select: {
        idAkun: true,
        kodeAkun: true,
        namaAkun: true,
        nomorAkun: true,
        saldo: true,
        isHeader: true,
        isProject: true,
        idDivisi: true,
        idKategori: true,
        idHeader: true,
        deskripsi: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}

export const akunRepository = new AkunRepository();
