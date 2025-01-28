import { prisma } from "@/common/utils/prismaClient";
import type { User } from "@prisma/client";

export class UserRepository {
  async findAllAsync(filters: {
    username?: string;
  }): Promise<Omit<User, "password">[]> {
    return prisma.user.findMany({
      where: {
        AND: [filters.username ? { username: { equals: filters.username } } : {}],
      },
      select: {
        idUser: true,
        username: true,
        fullName: true,
        email: true,
        photoProfile: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByIdAsync(id: number): Promise<Omit<User, "password"> | null> {
    return prisma.user.findUnique({
      where: { idUser: id },
      select: {
        idUser: true,
        username: true,
        fullName: true,
        email: true,
        photoProfile: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
