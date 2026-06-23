import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

async function main() {
  const connectionString = process.env.DATABASE_URL!;
  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  const passwordHash = await bcrypt.hash("Wiebusch@2023", 12);

  // Upsert admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin" },
    update: {
      passwordHash,
      role: "admin",
      name: "Administrador",
    },
    create: {
      email: "admin",
      passwordHash,
      role: "admin",
      name: "Administrador",
    },
  });

  console.log("Admin user ready:", admin.email, "role:", admin.role);

  // Also ensure luanwiebu@gmail.com is admin
  await prisma.user.updateMany({
    where: { email: "luanwiebu@gmail.com" },
    data: { role: "admin" },
  });

  const users = await prisma.user.findMany({
    select: { email: true, role: true },
  });
  console.log("\nAll users:");
  users.forEach(u => console.log(`  ${u.email} | role: ${u.role}`));

  await prisma.$disconnect();
}

main().catch(console.error);
