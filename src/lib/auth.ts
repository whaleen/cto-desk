// src/lib/auth.ts
import { prisma } from '@/lib/prisma'
import { getUserCreditBalance } from '@/lib/credits'

export async function getEnrichedUser(wallet: string) {
  const user = await prisma.user.findUnique({
    where: { wallet },
    select: {
      id: true,
      wallet: true,
      isActive: true,
      isAdmin: true,
      createdAt: true,
    },
  })

  if (!user) return null

  // Get current credit balance
  const creditBalance = await getUserCreditBalance(user.id)

  return {
    ...user,
    creditBalance,
  }
}
