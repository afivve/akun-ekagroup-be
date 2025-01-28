import { StatusCodes } from "http-status-codes";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";

import { AuthRepository } from "@/api/auth/authRepository";
import type { LoginUserSchema, RegisterUser } from "@/api/auth/authSchema";
import { AuthService } from "@/api/auth/authService";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { hashData, verifyHashData } from "@/common/utils/argon2";
import { generateToken } from "@/common/utils/jwt";
import type { User } from "@prisma/client";

vi.mock("@/api/auth/authRepository");
vi.mock("@/common/utils/argon2");
vi.mock("@/common/utils/jwt");

describe("AuthService - registerService", () => {
  let authService: AuthService;
  let authRepository: AuthRepository;

  const mockRegisterData: RegisterUser = {
    username: "testuser",
    email: "test@example.com",
    password: "password123",
    confPassword: "password123",
    fullName: "Test User",
  };

  const mockRegisteredUser: User = {
    idUser: 1,
    username: "testuser",
    email: "test@example.com",
    password: "hashed_password",
    fullName: "Test User",
    photoProfile: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    authRepository = new AuthRepository();
    authService = new AuthService(authRepository);
  });

  it("should return conflict if email or username already exists", async () => {
    // Arrange
    (authRepository.getUserWithoutPasswordRepository as Mock).mockResolvedValue(mockRegisteredUser);

    // Act
    const response = await authService.registerService(mockRegisterData);

    // Assert
    expect(response).toEqual(ServiceResponse.failure("Email Sudah Terdaftar", null, StatusCodes.CONFLICT));
    expect(authRepository.getUserWithoutPasswordRepository).toHaveBeenCalledWith(
      undefined,
      mockRegisterData.username,
      mockRegisterData.email,
    );
  });

  it("should hash the password and register the user successfully", async () => {
    // Arrange
    (authRepository.getUserWithoutPasswordRepository as Mock).mockResolvedValue(null);
    (hashData as Mock).mockResolvedValue("hashed_password");
    (authRepository.createUserRepository as Mock).mockResolvedValue(mockRegisteredUser);

    // Act
    const response = await authService.registerService(mockRegisterData);

    // Assert
    expect(response.statusCode).toEqual(StatusCodes.CREATED);
    expect(response.success).toBeTruthy();
    expect(response.message).toBe("Register User Berhasil");
    expect(response.responseObject).toEqual({
      idUser: mockRegisteredUser.idUser,
      username: mockRegisteredUser.username,
      email: mockRegisteredUser.email,
      fullName: mockRegisteredUser.fullName,
      photoProfile: mockRegisteredUser.photoProfile,
      createdAt: mockRegisteredUser.createdAt,
      updatedAt: mockRegisteredUser.updatedAt,
    });

    expect(authRepository.getUserWithoutPasswordRepository).toHaveBeenCalledWith(
      undefined,
      mockRegisterData.username,
      mockRegisterData.email,
    );
    expect(hashData).toHaveBeenCalledWith(mockRegisterData.password);
    expect(authRepository.createUserRepository).toHaveBeenCalledWith({
      ...mockRegisterData,
      password: "hashed_password",
    });
  });

  it("should handle errors gracefully", async () => {
    // Arrange
    (authRepository.getUserWithoutPasswordRepository as Mock).mockRejectedValue(new Error("Database Error"));

    // Act
    const response = await authService.registerService(mockRegisterData);

    // Assert
    expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.success).toBeFalsy();
    expect(response.message).toBe("An error occurred while registering user.");
  });
});

describe("AuthService - loginService", () => {
  let authService: AuthService;
  let authRepository: AuthRepository;

  const mockUser: User = {
    idUser: 1,
    username: "testuser",
    fullName: "Test User",
    email: "testuser@example.com",
    password: "hashedpassword", // Simulated hashed password
    photoProfile: "profile.jpg",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    authRepository = new AuthRepository();
    authService = new AuthService(authRepository);
  });

  it("should return success when login is valid", async () => {
    // Arrange
    (authRepository.getUserWithPasswordRepository as Mock).mockResolvedValue(mockUser);
    (verifyHashData as Mock).mockResolvedValue(true);
    (generateToken as Mock).mockReturnValue("valid-token");

    const loginData = {
      username: "testuser",
      password: "correctpassword",
    };

    // Act
    const result = await authService.loginService(loginData);

    // Assert
    expect(result.statusCode).toBe(StatusCodes.OK);
    expect(result.success).toBeTruthy();
    expect(result.message).toBe("Login berhasil");
    expect(result.responseObject).toEqual({ token: "valid-token" });
  });

  it("should return failure when username is not registered", async () => {
    // Arrange
    (authRepository.getUserWithPasswordRepository as Mock).mockResolvedValue(null);

    const loginData = {
      username: "unknownuser",
      password: "anyPassword",
    };

    // Act
    const result = await authService.loginService(loginData);

    // Assert
    expect(result.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(result.success).toBeFalsy();
    expect(result.message).toBe("Username Tidak Terdaftar");
    expect(result.responseObject).toBeNull();
  });

  it("should return failure when password is incorrect", async () => {
    // Arrange
    (authRepository.getUserWithPasswordRepository as Mock).mockResolvedValue(mockUser);
    (verifyHashData as Mock).mockResolvedValue(false);

    const loginData = {
      username: "testuser",
      password: "wrongpassword",
    };

    // Act
    const result = await authService.loginService(loginData);

    // Assert
    expect(result.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(result.success).toBeFalsy();
    expect(result.message).toBe("Password Salah");
    expect(result.responseObject).toBeNull();
  });

  it("should handle errors gracefully", async () => {
    // Arrange
    (authRepository.getUserWithPasswordRepository as Mock).mockRejectedValue(new Error("Database error"));

    const loginData = {
      username: "testuser",
      password: "correctpassword",
    };

    // Act
    const result = await authService.loginService(loginData);

    // Assert
    expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(result.success).toBeFalsy();
    expect(result.message).toBe("An error occurred while validating login.");
    expect(result.responseObject).toBeNull();
  });
});
