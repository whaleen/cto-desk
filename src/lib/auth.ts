// src/lib/auth.ts
import { prisma } from '@/lib/prisma'

export async function getEnrichedUser(wallet: string) {
  const user = await prisma.user.findUnique({
    where: { wallet },
    select: {
      id: true,
      wallet: true,
      isActive: true,
      isAdmin: true,
      createdAt: true,
      creditBalance: true,
    },
  })

  return user
}
