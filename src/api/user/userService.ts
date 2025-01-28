import { StatusCodes } from "http-status-codes";

import { UserRepository } from "@/api/user/userRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import type { User } from "@prisma/client";

export class UserService {
  private userRepository: UserRepository;

  constructor(repository: UserRepository = new UserRepository()) {
    this.userRepository = repository;
  }

  // Retrieves all users from the database
  async findAll(filters: {
    username?: string;
  }): Promise<ServiceResponse<Omit<User, "password">[]>> {
    try {
      const users = await this.userRepository.findAllAsync(filters);
      if (users.length === 0) {
        return ServiceResponse.success("Tidak Ada Data User", [], StatusCodes.OK);
      }

      const message = filters && users.length === 1 ? "Data User Ditemukan" : "Berhasil Mengambil Semua Data User";
      return ServiceResponse.success(message, users, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding all users: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving users.",
        [],
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Retrieves a single user by their ID
  async findById(id: number): Promise<ServiceResponse<Omit<User, "password"> | null>> {
    try {
      const user = await this.userRepository.findByIdAsync(id);
      if (!user) {
        return ServiceResponse.failure("User Tidak Ditemukan", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success("User found", user);
    } catch (ex) {
      const errorMessage = `Error finding user with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while finding user.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const userService = new UserService();
