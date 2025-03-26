import { PrismaClient } from "@prisma/client";
import { hashData } from "../common/utils/argon2";

const prisma = new PrismaClient();

async function main() {
  const password1 = await hashData("Password123");

  await prisma.user.createMany({
    data: [
      {
        username: "admin",
        email: "admin@email.com",
        fullName: "Admin",
        password: password1,
      },
    ],
  });

  console.log("Seeding selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
