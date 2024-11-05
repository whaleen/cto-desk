// prisma/seed.ts
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const ADMIN_WALLET = 'AMKzF4Phzhp8htd9xerLSm1aderQT7t2v35HzbhDAjvE'

  await prisma.user.upsert({
    where: { wallet: ADMIN_WALLET },
    update: {},
    create: {
      wallet: ADMIN_WALLET,
      isAdmin: true,
      isActive: true,
    },
  })

  await prisma.whitelist.upsert({
    where: { wallet: ADMIN_WALLET },
    update: {},
    create: {
      wallet: ADMIN_WALLET,
    },
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
