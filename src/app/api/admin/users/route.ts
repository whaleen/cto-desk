// src/app/api/admin/users/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    })

    // Get whitelist status for each user
    const whitelist = await prisma.whitelist.findMany({
      select: { wallet: true },
    })
    const whitelistedWallets = new Set(whitelist.map((w) => w.wallet))

    const enrichedUsers = users.map((user) => ({
      ...user,
      isActive: whitelistedWallets.has(user.wallet),
    }))

    return NextResponse.json({ users: enrichedUsers })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
