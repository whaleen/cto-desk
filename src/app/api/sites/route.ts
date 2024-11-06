// src/app/api/sites/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getEnrichedUser } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const walletAddress = request.headers.get('x-wallet-address')
    if (!walletAddress) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the authenticated user
    const user = await getEnrichedUser(walletAddress)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get sites filtered by user
    const sites = await prisma.site.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ sites })
  } catch (error) {
    console.error('Error fetching sites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sites' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { name, subdomain, wallet } = await request.json()

    const user = await prisma.user.findUnique({
      where: { wallet },
    })

    if (!user?.isActive) {
      return NextResponse.json(
        { error: 'User not whitelisted' },
        { status: 403 }
      )
    }

    const site = await prisma.site.create({
      data: {
        name,
        subdomain,
        userId: user.id,
      },
    })

    return NextResponse.json({ site })
  } catch (error) {
    console.error('Error creating site:', error)
    return NextResponse.json(
      { error: 'Failed to create site' },
      { status: 500 }
    )
  }
}
