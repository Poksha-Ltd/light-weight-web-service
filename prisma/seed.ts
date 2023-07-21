import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import bcrypt from "bcrypt"

async function main() {
  const roles = await prisma.userRole.upsert({
    where: { id: "role-1" },
    update: {},
    create: {
      id: "role-1",
      name: "ADMIN",
    }
  })
  const user = await prisma.user.upsert({
    where: { id: "user-1" },
    update: {},
    create: {
      id: "user-1",
      name: "user-1",
      userPassword: {
        create: {
          hashedPassword: bcrypt.hashSync("password", 10)
        }
      },
      userRoles: {
        connect: [{
          id: "role-1"
        }]
      }
    }
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })