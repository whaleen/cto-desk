// src/app/api/auth/check/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { wallet } = await request.json()
    console.log('Checking wallet status:', wallet)

    const [user, whitelisted] = await Promise.all([
      prisma.user.findUnique({
        where: { wallet },
      }),
      prisma.whitelist.findUnique({
        where: { wallet },
      }),
    ])

    console.log('User record:', user)
    console.log('Whitelist record:', whitelisted)

    return NextResponse.json({
      isActive: user?.isActive || !!whitelisted,
      isAdmin: user?.isAdmin || false,
    })
  } catch (error) {
    console.error('Check auth error:', error)
    return NextResponse.json(
      { error: 'Failed to check auth status' },
      { status: 500 }
    )
  }
}
