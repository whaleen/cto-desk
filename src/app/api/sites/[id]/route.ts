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

    const user = await getEnrichedUser(walletAddress)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const site = await prisma.site.findUnique({
      where: {
        id: params.id,
        userId: user.id, // Ensure user owns the site
      },
      include: {
        user: {
          select: {
            wallet: true,
          },
        },
      },
    })

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 })
    }

    return NextResponse.json({ site })
  } catch (error) {
    console.error('Error fetching site:', error)
    return NextResponse.json({ error: 'Failed to fetch site' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const walletAddress = request.headers.get('x-wallet-address')
    if (!walletAddress) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getEnrichedUser(walletAddress)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify site ownership first
    const existingSite = await prisma.site.findUnique({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!existingSite) {
      return NextResponse.json(
        { error: 'Site not found or unauthorized' },
        { status: 404 }
      )
    }

    const {
      name,
      customDomain,
      profileImage,
      bannerImage,
      description,
      twitterUrl,
      telegramUrl,
    } = await request.json()

    // Update the site
    const site = await prisma.site.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        customDomain,
        profileImage,
        bannerImage,
        description,
        twitterUrl,
        telegramUrl,
      },
      include: {
        user: {
          select: {
            wallet: true,
          },
        },
      },
    })

    return NextResponse.json({ site })
  } catch (error) {
    console.error('Error updating site:', error)
    return NextResponse.json(
      { error: 'Failed to update site' },
      { status: 500 }
    )
  }
}
