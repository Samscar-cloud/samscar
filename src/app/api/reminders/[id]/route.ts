import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const reminder = await prisma.reminder.findUnique({
      where: { id: params.id },
      include: {
        vehicle: {
          select: {
            user: {
              select: { email: true },
            },
          },
        },
      },
    })

    if (!reminder || reminder.vehicle.user.email !== session.user.email) {
      return NextResponse.json({ error: 'Reminder not found or not owned by you' }, { status: 404 })
    }

    const updated = await prisma.reminder.update({
      where: { id: params.id },
      data: { completed: true },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating reminder:', error)
    return NextResponse.json({ error: 'Failed to update reminder' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const reminder = await prisma.reminder.findUnique({
      where: { id: params.id },
      include: {
        vehicle: {
          select: {
            user: {
              select: { email: true },
            },
          },
        },
      },
    })

    if (!reminder || reminder.vehicle.user.email !== session.user.email) {
      return NextResponse.json({ error: 'Reminder not found or not owned by you' }, { status: 404 })
    }

    await prisma.reminder.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error deleting reminder:', error)
    return NextResponse.json({ error: 'Failed to delete reminder' }, { status: 500 })
  }
}
