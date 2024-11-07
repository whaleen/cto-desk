// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : ['warn', 'error'], // Log queries only in development
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
