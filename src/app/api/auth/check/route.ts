// src/app/api/auth/check/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getEnrichedUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { wallet } = body

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    // Check whitelist
    const whitelisted = await prisma.whitelist.findUnique({
      where: { wallet },
    })

    // Get or create user
    let user = await getEnrichedUser(wallet)

    if (!user) {
      // Create new user if they don't exist
      const newUser = await prisma.user.create({
        data: {
          wallet,
          isActive: !!whitelisted, // Active if whitelisted
        },
      })
      user = await getEnrichedUser(newUser.wallet)
    }

    return NextResponse.json({
      isActive: user?.isActive ?? false,
      user,
    })
  } catch (error) {
    console.error('Error checking auth:', error)
    return NextResponse.json(
      { error: 'Failed to check authorization' },
      { status: 500 }
    )
  }
}
