// src/app/api/sites/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // Get wallet from auth header or request
    const wallet = request.headers.get('x-wallet-address');

    const user = await prisma.user.findUnique({
      where: { wallet: wallet as string },
      include: { sites: true },
    });

    if (!user?.isActive) {
      return NextResponse.json(
        { error: 'Not whitelisted' },
        { status: 403 }
      );
    }

    return NextResponse.json({ sites: user.sites });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch sites' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, subdomain } = await request.json();
    const wallet = request.headers.get('x-wallet-address');

    // Check if user is whitelisted
    const user = await prisma.user.findUnique({
      where: { wallet: wallet as string },
    });

    if (!user?.isActive) {
      return NextResponse.json(
        { error: 'Not whitelisted' },
        { status: 403 }
      );
    }

    // Create the site
    const site = await prisma.site.create({
      data: {
        name,
        subdomain,
        userId: user.id,
      },
    });

    return NextResponse.json({ site });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create site' },
      { status: 500 }
    );
  }
}
