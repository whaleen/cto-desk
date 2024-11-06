// src/app/api/sites/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getEnrichedUser } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const walletAddress = request.headers.get('x-wallet-address')
    if (!walletAddress) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Combine queries into a single transaction
    const [site, user] = await prisma.$transaction([
      prisma.site.findUnique({
        where: {
          id: params.id,
        },
        include: {
          user: {
            select: {
              wallet: true,
            },
          },
        },
      }),
      prisma.user.findUnique({
        where: { wallet: walletAddress },
        select: {
          id: true,
          wallet: true,
          isActive: true,
          isAdmin: true,
        },
      }),
    ])

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!site || site.user.wallet !== walletAddress) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 })
    }

    return NextResponse.json({ site })
  } catch (error) {
    console.error('Error fetching site:', error)
    return NextResponse.json({ error: 'Failed to fetch site' }, { status: 500 })
  }
}
