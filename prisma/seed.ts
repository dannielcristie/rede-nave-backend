import prisma from "../src/config/prisma";
import { hashPassword } from "../src/utils/hash.utils";

async function main() {
  const email = process.env.ADMIN_EMAIL!;
  const name = process.env.ADMIN_NAME!;
  const password = process.env.ADMIN_PASSWORD!;

  const exists = await prisma.user.findUnique({ where: { email } });

  if (!exists) {
    const password_hash = await hashPassword(password);

    await prisma.user.create({
      data: {
        name,
        email,
        password_hash,
        role: "admin",
      },
    });

    console.log("Admin criado!");
  } else {
    console.log("Admin já existe.");
  }
}

main();
