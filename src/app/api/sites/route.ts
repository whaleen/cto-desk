// src/app/api/sites/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    // Get all sites or filter by user
    const sites = await prisma.site.findMany()
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
