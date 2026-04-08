import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession, logAdminAction } from '@/lib/admin'
import { sendSMS } from '@/lib/sms'
import { sendEmail } from '@/lib/email'
import { captureException } from '@/lib/sentry'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireAdminSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { status } = body

    const existingBooking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { user: true, service: true },
    })

    if (!existingBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: { status },
      include: { user: true, service: true },
    })

    await logAdminAction(session.user.id, 'UPDATE_BOOKING_STATUS', `Updated booking ${params.id} status to ${status}`)

    if (existingBooking.status !== status) {
      const statusLabel = status === 'COMPLETED' ? 'terminée' : status === 'CONFIRMED' ? 'confirmée' : status === 'CANCELLED' ? 'annulée' : status

      const message = `Votre réservation pour ${booking.service.name} le ${booking.date.toISOString().slice(0, 16).replace('T', ' ')} est maintenant ${statusLabel}.`

      if (booking.user.phone) {
        try {
          await sendSMS(booking.user.phone, message)
        } catch (error) {
          console.error('Failed to send booking status SMS', error)
        }
      }

      if (booking.user.email) {
        try {
          await sendEmail(
            booking.user.email,
            `Statut de réservation: ${statusLabel}`,
            `<p>Bonjour ${booking.user.name || ''},</p><p>Le statut de votre réservation pour <strong>${booking.service.name}</strong> a été mis à jour : <strong>${statusLabel}</strong>.</p>`
          )
        } catch (error) {
          console.error('Failed to send booking status email', error)
        }
      }
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Admin booking update failed:', error)
    captureException(error, { route: '/api/admin/bookings/[id]', method: 'PUT' })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireAdminSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const booking = await prisma.booking.findUnique({ where: { id: params.id }, include: { service: true } })
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })

    await prisma.booking.delete({ where: { id: params.id } })

    await logAdminAction(session.user.id, 'DELETE_BOOKING', `Deleted booking ${params.id} (${booking.service.name})`)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Admin booking delete failed:', error)
    captureException(error, { route: '/api/admin/bookings/[id]', method: 'DELETE' })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

