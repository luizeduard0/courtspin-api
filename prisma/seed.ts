import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function users() {
  const password = await bcrypt.hash("pass4now", 10);
  const luiz = await prisma.user.upsert({
    where: { email: "luiz@courtspin.com" },
    update: {},
    create: {
      userTypeId: 'PLAYER',
      email: "luiz@courtspin.com",
      password: await bcrypt.hash("pass4now", 10),
      firstName: "Luiz",
      lastName: "Paglioni",
      // avatar: "https://source.unsplash.com/2FKTyJqfWX8/1000x1000",
      gender: "M",
      zipcode: "31330230",
      ntrp: 4.5,
    },
  });
  
  const pedro = await prisma.user.upsert({
    where: { email: "pedro@courtspin.com" },
    update: {},
    create: {
      userTypeId: 'PLAYER',
      email: "pedro@courtspin.com",
      password: await bcrypt.hash("pass4now", 10),
      firstName: "Pedro",
      lastName: "Rodrigues",
      // avatar: "https://source.unsplash.com/2FKTyJqfWX8/1000x1000",
      gender: "M",
      zipcode: "31330230",
      ntrp: 3.5,
    },
  });
}

(async () => {
  await users()
})()
