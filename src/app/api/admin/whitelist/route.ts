// src/app/api/admin/whitelist/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { wallet } = await request.json()

    // Check if wallet is already whitelisted
    const existingWhitelist = await prisma.whitelist.findUnique({
      where: { wallet },
    })

    if (existingWhitelist) {
      // Remove from whitelist
      await prisma.whitelist.delete({
        where: { wallet },
      })

      // Update user status
      await prisma.user.update({
        where: { wallet },
        data: { isActive: false },
      })

      return NextResponse.json({ status: 'removed' })
    } else {
      // Add to whitelist
      await prisma.whitelist.create({
        data: { wallet },
      })

      // Update user status
      await prisma.user.update({
        where: { wallet },
        data: { isActive: true },
      })

      return NextResponse.json({ status: 'added' })
    }
  } catch (error) {
    console.error('Error updating whitelist:', error)
    return NextResponse.json(
      { error: 'Failed to update whitelist' },
      { status: 500 }
    )
  }
}
