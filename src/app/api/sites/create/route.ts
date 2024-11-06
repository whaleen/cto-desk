// src/app/api/sites/create/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getEnrichedUser } from '@/lib/auth'
import { isValidSitePath } from '@/app/(sites)/[site]/page'
import { getUserCreditBalance } from '@/lib/credits'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, subdomain } = body

    // Get wallet from Authorization header
    const wallet = request.headers.get('x-wallet-address')
    if (!wallet) {
      return NextResponse.json(
        { error: 'No wallet address provided' },
        { status: 401 }
      )
    }

    // Get the authenticated user with wallet
    const user = await getEnrichedUser(wallet)
    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Credit balance is already included in enriched user
    if (user.creditBalance <= 0) {
      return NextResponse.json(
        { error: 'Insufficient credits to create a new site' },
        { status: 403 }
      )
    }

    // Validate site path
    if (!isValidSitePath(subdomain)) {
      return NextResponse.json(
        { error: 'Invalid site path or reserved word' },
        { status: 400 }
      )
    }

    // Check if path is available
    const existing = await prisma.site.findUnique({
      where: { subdomain },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Site path already taken' },
        { status: 400 }
      )
    }

    // Create the site
    const site = await prisma.site.create({
      data: {
        name,
        subdomain,
        userId: user.id,
      },
    })

    return NextResponse.json({
      site,
      newBalance: user.creditBalance - 1, // Include new balance for UI update
    })
  } catch (error) {
    console.error('Error creating site:', error)
    return NextResponse.json(
      { error: 'Failed to create site' },
      { status: 500 }
    )
  }
}
