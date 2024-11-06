// src/app/api/messages/[projectId]/route.ts

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTokenOwnership } from '@/lib/solana'

export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  const { projectId } = params
  const userId = req.headers.get('userId') as string

  const ownsToken = await verifyTokenOwnership(userId, projectId)

  const messages = await prisma.message.findMany({
    where: {
      projectId,
      visibility: ownsToken ? { in: ['public', 'private'] } : 'public',
    },
    orderBy: { timestamp: 'desc' },
  })

  return NextResponse.json(messages)
}
