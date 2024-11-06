// src/app/api/auth/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { wallet } = await request.json()
    console.log('Auth endpoint called with wallet:', wallet)

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { wallet },
    })

    console.log('Existing user found:', user)

    // If no user exists, create one
    if (!user) {
      console.log('Creating new user for wallet:', wallet)
      user = await prisma.user.create({
        data: {
          wallet,
          isActive: false,
          isAdmin: false,
        },
      })
      console.log('New user created:', user)
    }

    // Check whitelist status
    const whitelisted = await prisma.whitelist.findUnique({
      where: { wallet },
    })

    return NextResponse.json({
      user,
      isWhitelisted: !!whitelisted,
      isActive: user.isActive || !!whitelisted,
    })
  } catch (error) {
    console.error('Error in auth route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
