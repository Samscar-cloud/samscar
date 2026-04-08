import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession, logAdminAction } from '@/lib/admin'

export async function GET() {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const services = await prisma.service.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(services)
}

export async function POST(request: NextRequest) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { name, description, price, category, slug } = body

  if (!name || !slug) {
    return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
  }

  const parsedPrice = price !== undefined && price !== null ? Number(price) : null
  if (price !== undefined && price !== null && Number.isNaN(parsedPrice)) {
    return NextResponse.json({ error: 'Prix invalide' }, { status: 400 })
  }

  const service = await prisma.service.create({
    data: { name, description, price: parsedPrice, category, slug },
  })

  await logAdminAction(session.user.id, 'CREATE_SERVICE', `Created service ${service.id} (${name})`)

  return NextResponse.json(service)
}
