import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession, logAdminAction } from '@/lib/admin'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { name, description, price, category, slug } = body

  const parsedPrice = price !== undefined && price !== null ? Number(price) : undefined
  if (price !== undefined && price !== null && Number.isNaN(parsedPrice)) {
    return NextResponse.json({ error: 'Prix invalide' }, { status: 400 })
  }

  const service = await prisma.service.update({
    where: { id: params.id },
    data: { name, description, price: parsedPrice, category, slug },
  })

  await logAdminAction(session.user.id, 'UPDATE_SERVICE', `Updated service ${service.id} (${name})`)

  return NextResponse.json(service)
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const service = await prisma.service.findUnique({ where: { id: params.id } })
  if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 })

  await prisma.service.delete({ where: { id: params.id } })

  await logAdminAction(session.user.id, 'DELETE_SERVICE', `Deleted service ${params.id} (${service.name})`)

  return NextResponse.json({ ok: true })
}
