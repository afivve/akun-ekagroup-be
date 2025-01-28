import { StatusCodes } from "http-status-codes";

import { AuthRepository } from "@/api/auth/authRepository";
import type { ChangePassword, LoginUser, RegisterUser } from "@/api/auth/authSchema";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { hashData, verifyHashData } from "@/common/utils/argon2";
import { generateToken } from "@/common/utils/jwt";
import { logger } from "@/server";
import type { User } from "@prisma/client";

export class AuthService {
  private authRepository: AuthRepository;

  constructor(repository: AuthRepository = new AuthRepository()) {
    this.authRepository = repository;
  }

  async registerService(data: RegisterUser): Promise<ServiceResponse<Omit<User, "password"> | null>> {
    try {
      const userExist = await this.authRepository.getUserWithoutPasswordRepository(
        undefined,
        data.username,
        data.email,
      );
      if (userExist) {
        const message = userExist.email === data.email ? "Email Sudah Terdaftar" : "Username Sudah Terdaftar";
        return ServiceResponse.failure(message, null, StatusCodes.CONFLICT);
      }

      const hashedPassword = await hashData(data.password);

      const userData = { ...data, password: hashedPassword };

      const registerResponse = await this.authRepository.createUserRepository(userData);

      const { password, ...userWithoutPassword } = registerResponse;

      return ServiceResponse.success("Register User Berhasil", userWithoutPassword, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error registering user: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while registering user.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async loginService(data: LoginUser): Promise<ServiceResponse<{ token: string } | null>> {
    try {
      const userExist = await this.authRepository.getUserWithPasswordRepository(undefined, data.username, undefined);

      if (!userExist) {
        return ServiceResponse.failure("Username Tidak Terdaftar", null, StatusCodes.UNAUTHORIZED);
      }

      const isPasswordValid = await verifyHashData(userExist.password, data.password);

      if (!isPasswordValid) {
        return ServiceResponse.failure("Password Salah", null, StatusCodes.UNAUTHORIZED);
      }

      const token = generateToken({ idUser: userExist.idUser });

      return ServiceResponse.success("Login berhasil", { token }, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error validating login: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while validating login.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async meService(idUser: number): Promise<ServiceResponse<Omit<User, "password"> | null>> {
    try {
      const user = await this.authRepository.getUserWithoutPasswordRepository(idUser, undefined, undefined);
      if (!user) {
        return ServiceResponse.failure("User Tidak Ditemukan", null, StatusCodes.NOT_FOUND);
      }

      return ServiceResponse.success("User found", user, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding user with id ${idUser}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while finding user.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async changePasswordService(idUser: number, data: ChangePassword): Promise<ServiceResponse<null>> {
    try {
      const user = await this.authRepository.getUserWithPasswordRepository(idUser, undefined, undefined);

      if (!user) {
        return ServiceResponse.failure("User Tidak Ditemukan", null, StatusCodes.NOT_FOUND);
      }

      const isPasswordValid = await verifyHashData(user.password, data.oldPassword);

      if (!isPasswordValid) {
        return ServiceResponse.failure("Password Lama Salah", null, StatusCodes.UNAUTHORIZED);
      }

      const hashedPassword = await hashData(data.newPassword);

      await this.authRepository.updateUserRepository(idUser, { password: hashedPassword });

      return ServiceResponse.success("Password Berhasil Diperbarui", null, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error changing password: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while changing password.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const authService = new AuthService();
