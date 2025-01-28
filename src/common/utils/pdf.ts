import type { User } from "@prisma/client";
import puppeteer from "puppeteer";

export const generateUserPDF = async (users: Omit<User, "password">[]): Promise<Buffer> => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const content = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            page-break-inside: auto;
          }
          th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color:rgb(255, 137, 137);
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
        </style>
      </head>
      <body>
        <h1>User Data</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Photo Profile</th>
              <th>Created</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            ${users
              .map(
                (user) => `
              <tr>
                <td>${user.idUser}</td>
                <td>${user.username}</td>
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td>${user.photoProfile || ""}</td>
                <td>${new Date(user.createdAt).toLocaleString()}</td>
                <td>${new Date(user.updatedAt).toLocaleString()}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;

  await page.setContent(content);
  const pdfBuffer = await page.pdf({
    format: "A3",
    margin: {
      top: "20mm",
      right: "10mm",
      bottom: "20mm",
      left: "10mm",
    },
    printBackground: true,
  });

  await browser.close();
  return Buffer.from(pdfBuffer);
};
