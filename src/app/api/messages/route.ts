// src/app/api/messages/route.ts

import { NextResponse } from 'next/server'
import { verifyTokenOwnership } from '@/lib/solana'
import { prisma } from '@/lib/prisma'

interface MessageRequest {
  projectId: string
  userId: string
  content: string
  visibility: 'public' | 'private'
}

export async function POST(req: Request) {
  const { projectId, userId, content, visibility }: MessageRequest =
    await req.json()

  const ownsToken =
    visibility === 'public' || (await verifyTokenOwnership(userId, projectId))

  if (!ownsToken && visibility === 'private') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const message = await prisma.message.create({
    data: { projectId, userId, content, visibility },
  })

  return NextResponse.json(message)
}
