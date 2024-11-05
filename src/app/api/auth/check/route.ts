// src/app/api/auth/check/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { wallet } = await request.json()

    if (!wallet) {
      return NextResponse.json(
        { error: 'No wallet address provided' },
        { status: 400 }
      )
    }

    // Check both user and whitelist status
    const user = await prisma.user.findUnique({
      where: { wallet },
    })

    const whitelisted = await prisma.whitelist.findUnique({
      where: { wallet },
    })

    return NextResponse.json({
      isActive: user?.isActive || !!whitelisted,
      user,
      whitelisted,
    })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { error: 'Failed to check auth status' },
      { status: 500 }
    )
  }
}
