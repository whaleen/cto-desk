// src/app/api/auth/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { wallet } = await request.json()

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { wallet },
    })

    // If no user exists, create one
    if (!user) {
      user = await prisma.user.create({
        data: {
          wallet,
          isActive: false,
          isAdmin: false, // New users are not admins by default
        },
      })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error in auth route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
