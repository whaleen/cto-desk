// src/app/api/sites/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getEnrichedUser } from '@/lib/auth'

type Props = {
  params: {
    id: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function GET(request: NextRequest, context: Props) {
  try {
    const walletAddress = request.headers.get('x-wallet-address')
    if (!walletAddress) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Combine queries into a single transaction
    const [site, user] = await prisma.$transaction([
      prisma.site.findUnique({
        where: {
          id: context.params.id,
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

export async function PATCH(request: NextRequest, context: Props) {
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

    // Get the site and verify ownership
    const site = await prisma.site.findUnique({
      where: { id: context.params.id },
      include: { user: { select: { wallet: true } } },
    })

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 })
    }

    if (site.user.wallet !== walletAddress) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the update data from request body
    const updateData = await request.json()

    // Explicitly extract only the fields we want to update
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

    // Update the site with only the allowed fields
    const updatedSite = await prisma.site.update({
      where: { id: context.params.id },
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
