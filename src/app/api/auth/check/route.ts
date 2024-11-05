// src/app/api/auth/check/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { wallet } = await request.json()
    console.log('Auth check - wallet:', wallet) // Debug log

    if (!wallet) {
      return NextResponse.json(
        { error: 'No wallet address provided' },
        { status: 400 }
      )
    }

    // Get both user and whitelist status
    const [user, whitelisted] = await Promise.all([
      prisma.user.findUnique({
        where: { wallet },
      }),
      prisma.whitelist.findUnique({
        where: { wallet },
      }),
    ])

    console.log('Auth check - user found:', user) // Debug log
    console.log('Auth check - whitelist status:', whitelisted) // Debug log

    return NextResponse.json({
      isActive: user?.isActive || !!whitelisted,
      isAdmin: user?.isAdmin || false,
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
