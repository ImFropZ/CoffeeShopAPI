import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const resource = await prisma.resource.findMany();

  console.log(resource);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
