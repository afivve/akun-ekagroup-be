import { Buffer } from "node:buffer";
import type { User } from "@prisma/client";
import ExcelJS from "exceljs";

export const generateUserExcel = async (users: Omit<User, "password">[]): Promise<Buffer> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Users");

  // Define columns with styles
  worksheet.columns = [
    { header: "ID", key: "idUser", width: 10 },
    { header: "Username", key: "username", width: 30 },
    { header: "Full Name", key: "fullName", width: 30 },
    { header: "Email", key: "email", width: 30 },
    { header: "Created At", key: "createdAt", width: 20 },
    { header: "Updated At", key: "updatedAt", width: 20 },
  ];

  // Add header style
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "4F81BD" },
    };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  // Add user data
  users.forEach((user) => {
    worksheet.addRow(user);
  });

  // Add border to all cells
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  // Generate buffer from workbook
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
};
