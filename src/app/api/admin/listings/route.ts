import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession, logAdminAction } from '@/lib/admin'

export async function GET(request: NextRequest) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(request.url)
  const q = url.searchParams.get('q')?.trim()
  const page = Number(url.searchParams.get('page') ?? '1')
  const limit = Number(url.searchParams.get('limit') ?? '20')
  const take = Math.min(100, Math.max(1, limit))
  const skip = (Math.max(1, page) - 1) * take

  const where: any = {}
  if (q) {
    where.OR = [
      { make: { contains: q, mode: 'insensitive' } },
      { model: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ]
  }

  const [items, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.listing.count({ where }),
  ])

  return NextResponse.json({ items, total, page: Math.max(1, page), limit: take })
}

export async function POST(request: NextRequest) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { make, model, year, price, mileage, color, description, photos, status } = body

  if (!make || !model || !year || !price) {
    return NextResponse.json({ error: 'Make, model, year and price are required' }, { status: 400 })
  }

  const listing = await prisma.listing.create({
    data: {
      make,
      model,
      year: Number(year),
      price: Number(price),
      mileage: mileage ? Number(mileage) : null,
      color: color || null,
      description: description || null,
      photos: Array.isArray(photos) ? photos : [],
      status: status || 'AVAILABLE',
    },
  })

  await logAdminAction(session.user.id, 'CREATE_LISTING', `Created listing ${listing.id} (${make} ${model})`)

  return NextResponse.json(listing)
}
