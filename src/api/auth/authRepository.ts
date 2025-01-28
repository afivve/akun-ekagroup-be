import { prisma } from "@/common/utils/prismaClient";
import type { Prisma, User } from "@prisma/client";

import type { LoginUser, RegisterUser } from "@/api/auth/authSchema";

export class AuthRepository {
  async createUserRepository(data: RegisterUser) {
    return await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        username: data.username,
        fullName: data.fullName,
      },
    });
  }

  async getUserWithPasswordRepository(idUser?: number, username?: string, email?: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        OR: [
          idUser ? { idUser } : undefined,
          username ? { username } : undefined,
          email ? { email } : undefined,
        ].filter(Boolean) as Prisma.UserWhereInput[],
      },
      select: {
        idUser: true,
        username: true,
        fullName: true,
        email: true,
        password: true,
        photoProfile: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getUserWithoutPasswordRepository(
    idUser?: number,
    username?: string,
    email?: string,
  ): Promise<Omit<User, "password"> | null> {
    return prisma.user.findFirst({
      where: {
        OR: [
          idUser ? { idUser } : undefined,
          username ? { username } : undefined,
          email ? { email } : undefined,
        ].filter(Boolean) as Prisma.UserWhereInput[],
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
    }) as Promise<Omit<User, "password"> | null>;
  }

  async updateUserRepository(idUser: number, data: Partial<User>) {
    return prisma.user.update({
      where: { idUser },
      data,
    });
  }
}
