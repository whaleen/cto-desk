// src/lib/credits.ts
import { prisma } from '@/lib/prisma'

export async function getUserCreditBalance(userId: string): Promise<number> {
  const credits = await prisma.credit.findMany({
    where: {
      userId,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    select: {
      amount: true,
    },
  })

  const sites = await prisma.site.count({
    where: {
      userId,
    },
  })

  // Calculate total valid credits
  const totalCredits = credits.reduce((sum, credit) => sum + credit.amount, 0)

  // Subtract used credits (one per site)
  return totalCredits - sites
}

export async function hasAvailableCredits(userId: string): Promise<boolean> {
  const balance = await getUserCreditBalance(userId)
  return balance > 0
}

export async function deductCredit(userId: string): Promise<boolean> {
  const balance = await getUserCreditBalance(userId)
  if (balance <= 0) {
    return false
  }
  return true
}
