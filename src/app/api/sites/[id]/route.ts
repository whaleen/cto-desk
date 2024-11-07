// src/app/api/sites/[id]/route.ts
import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getEnrichedUser } from '@/lib/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const walletAddress = req.headers.get('x-wallet-address')
    if (!walletAddress) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const walletAddress = req.headers.get('x-wallet-address')
    if (!walletAddress) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getEnrichedUser(walletAddress)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const site = await prisma.site.findUnique({
      where: { id: params.id },
      include: { user: { select: { wallet: true } } },
    })

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 })
    }

    if (site.user.wallet !== walletAddress) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updateData = await req.json()

    const {
      name,
      customDomain,
      description,
      profileImage,
      bannerImage,
      twitterUrl,
      telegramUrl,
      theme,
    } = updateData

    const updatedSite = await prisma.site.update({
      where: { id: params.id },
      data: {
        name,
        customDomain,
        description,
        profileImage,
        bannerImage,
        twitterUrl,
        telegramUrl,
        theme,
      },
      include: {
        user: {
          select: {
            wallet: true,
          },
        },
      },
    })

    return NextResponse.json({ site: updatedSite })
  } catch (error) {
    console.error('Error updating site:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to update site',
      },
      { status: 500 }
    )
  }
}
