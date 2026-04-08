import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession, logAdminAction } from '@/lib/admin'

export async function GET(request: Request) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(request.url)
  const page = Math.max(1, Number(url.searchParams.get('page') ?? '1'))
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') ?? '20')))
  const skip = (page - 1) * limit
  const query = url.searchParams.get('q')?.trim() ?? ''

  const where = query
    ? {
        OR: [
          { make: { contains: query, mode: 'insensitive' as const } },
          { model: { contains: query, mode: 'insensitive' as const } },
          { vin: { contains: query, mode: 'insensitive' as const } },
          { user: { email: { contains: query, mode: 'insensitive' as const } } },
          { user: { name: { contains: query, mode: 'insensitive' as const } } },
        ],
      }
    : {}

  const [total, vehicles] = await Promise.all([
    prisma.vehicle.count({ where }),
    prisma.vehicle.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
  ])

  return NextResponse.json({ items: vehicles, total, page, limit })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const vehicle = await prisma.vehicle.findUnique({ where: { id: params.id }, include: { user: true } })
  if (!vehicle) return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })

  await prisma.vehicle.delete({ where: { id: params.id } })

  await logAdminAction(session.user.id, 'DELETE_VEHICLE', `Deleted vehicle ${params.id} (${vehicle.make} ${vehicle.model}) owned by ${vehicle.user.email}`)

  return NextResponse.json({ ok: true })
}
