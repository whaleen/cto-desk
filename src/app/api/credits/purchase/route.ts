// src/app/api/credits/purchase/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getEnrichedUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const walletAddress = request.headers.get('x-wallet-address')
    if (!walletAddress) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { wallet: walletAddress },
      select: {
        id: true,
        wallet: true,
        isActive: true,
        isAdmin: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error checking credit status:', error)
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { wallet } = body

    // Get the authenticated user using getEnrichedUser
    const user = await getEnrichedUser(wallet)
    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create the credit
    const credit = await prisma.credit.create({
      data: {
        userId: user.id,
        amount: 5, // Give 5 credits
        reason: 'Demo purchase',
        createdBy: wallet,
      },
    })

    return NextResponse.json({
      success: true,
      credit,
      newBalance: user.creditBalance + 5, // Include new balance for UI update
    })
  } catch (error) {
    console.error('Error purchasing credits:', error)
    return NextResponse.json(
      { error: 'Failed to purchase credits' },
      { status: 500 }
    )
  }
}
