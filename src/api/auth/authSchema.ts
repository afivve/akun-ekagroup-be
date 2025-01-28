import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type RegisterUser = z.infer<typeof RegisterUserSchema>;
export const RegisterUserSchema = z
  .object({
    fullName: z.string().min(1, { message: "Full name is required" }),
    username: z.string(),
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confPassword: z.string().min(8, "Confirm password minimal 8 karakter"),
  })
  .refine((data) => data.password === data.confPassword, {
    message: "Password dan Konfirmasi Password Tidak Cocok",
    path: ["confPassword"],
  });

export type LoginUser = z.infer<typeof LoginUserSchema>;
export const LoginUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type ChangePassword = z.infer<typeof ChangePasswordSchema>;
export const ChangePasswordSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: z.string(),
    confNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confNewPassword, {
    message: "Password dan Konfirmasi Password Tidak Cocok",
    path: ["confPassword"],
  });
