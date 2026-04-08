import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const services = await prisma.service.findMany({
    select: { id: true, name: true, category: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(services)
}
