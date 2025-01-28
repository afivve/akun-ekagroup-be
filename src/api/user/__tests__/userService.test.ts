import { StatusCodes } from "http-status-codes";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";

import { UserRepository } from "@/api/user/userRepository";
import { UserService } from "@/api/user/userService";
import { ServiceResponse } from "@/common/models/serviceResponse";
import type { User } from "@prisma/client";

vi.mock("@/api/auth/authRepository");

describe("userService - Get All Data User", () => {
  let userServiceInstance: UserService;
  let userRepositoryInstance: UserRepository;

  const mockUsers: Omit<User, "password">[] = [
    {
      idUser: 1,
      username: "testuser",
      email: "test@example.com",
      fullName: "Test User",
      photoProfile: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      idUser: 1,
      username: "testuser",
      email: "test@example.com",
      fullName: "Test User",
      photoProfile: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    userRepositoryInstance = new UserRepository();
    userServiceInstance = new UserService(userRepositoryInstance);

    vi.spyOn(userRepositoryInstance, "findAllAsync");
  });

  it("should return all users", async () => {
    // Arrange
    (userRepositoryInstance.findAllAsync as Mock).mockResolvedValue(mockUsers);

    // Act
    const response = await userServiceInstance.findAll({});

    // Assert
    expect(response).toEqual(ServiceResponse.success("Berhasil Mengambil Semua Data User", mockUsers, StatusCodes.OK));
  });

  it("should return no users", async () => {
    // Arrange
    (userRepositoryInstance.findAllAsync as Mock).mockResolvedValue([]);

    // Act
    const response = await userServiceInstance.findAll({});

    // Assert
    expect(response).toEqual(ServiceResponse.success("Tidak Ada Data User", [], StatusCodes.OK));
  });
});

describe("userService - Get User By ID", () => {
  let userServiceInstance: UserService;
  let userRepositoryInstance: UserRepository;

  const mockUser: Omit<User, "password"> = {
    idUser: 1,
    fullName: "Test User",
    username: "testuser",
    email: "email@mail.com",
    photoProfile: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    userRepositoryInstance = new UserRepository();
    userServiceInstance = new UserService(userRepositoryInstance);

    vi.spyOn(userRepositoryInstance, "findByIdAsync");
  });

  it("should return user by ID", async () => {
    // Arrange
    (userRepositoryInstance.findByIdAsync as Mock).mockResolvedValue(mockUser);

    // Act
    const response = await userServiceInstance.findById(1);

    // Assert
    expect(response).toEqual(ServiceResponse.success("User found", mockUser, StatusCodes.OK));
  });

  it("should return user not found", async () => {
    // Arrange
    (userRepositoryInstance.findByIdAsync as Mock).mockResolvedValue(null);

    // Act
    const response = await userServiceInstance.findById(1);

    // Assert
    expect(response).toEqual(ServiceResponse.failure("User Tidak Ditemukan", null, StatusCodes.NOT_FOUND));
  });
});
