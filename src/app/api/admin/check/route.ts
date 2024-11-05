// src/app/api/auth/check/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received request body:', body)

    const { wallet } = body

    if (!wallet) {
      return NextResponse.json(
        { error: 'No wallet address provided' },
        { status: 400 }
      )
    }

    console.log('Checking wallet:', wallet)

    // Get both user and whitelist status
    const [user, whitelist] = await Promise.all([
      prisma.user.findUnique({
        where: { wallet },
      }),
      prisma.whitelist.findUnique({
        where: { wallet },
      }),
    ])

    console.log('Database results:', { user, whitelist })

    return NextResponse.json({
      success: true,
      isActive: user?.isActive ?? false,
      isWhitelisted: !!whitelist,
      user,
      whitelist,
    })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}
