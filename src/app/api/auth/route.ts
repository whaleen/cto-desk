// src/app/api/auth/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { wallet } = await request.json()
    console.log('Auth route - creating/updating user:', wallet) // Debug log

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { wallet },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          wallet,
          isActive: false,
          isAdmin: false,
        },
      })
      console.log('Auth route - created new user:', user) // Debug log
    }

    // Check whitelist status
    const whitelisted = await prisma.whitelist.findUnique({
      where: { wallet },
    })

    console.log('Auth route - whitelist status:', whitelisted) // Debug log

    return NextResponse.json({
      user,
      isWhitelisted: !!whitelisted,
      isActive: user.isActive || !!whitelisted,
    })
  } catch (error) {
    console.error('Auth route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
