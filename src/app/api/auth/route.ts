// src/app/api/auth/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { wallet } = await request.json()

    let user = await prisma.user.findUnique({
      where: { wallet },
    })

    if (!user) {
      user = await prisma.user.create({
        data: { wallet, isActive: false },
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
