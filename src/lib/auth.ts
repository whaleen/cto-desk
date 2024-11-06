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
      creditBalance: true, // Add this to the schema if not present
    },
  })

  return user
}
