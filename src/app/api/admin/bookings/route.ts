import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/admin'

export async function GET(request: Request) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(request.url)
  const page = Math.max(1, Number(url.searchParams.get('page') ?? '1'))
  const rawStatus = url.searchParams.get('status')
  const allowedStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const
  const status = rawStatus && allowedStatuses.includes(rawStatus as any) ? (rawStatus as typeof allowedStatuses[number]) : undefined
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') ?? '20')))
  const skip = (page - 1) * limit

  const where = status ? { status } : {}

  const [total, bookings] = await Promise.all([
    prisma.booking.count({ where }),
    prisma.booking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { user: true, service: true, vehicle: true },
      skip,
      take: limit,
    }),
  ])

  return NextResponse.json({
    items: bookings,
    total,
    page,
    limit,
  })
}
