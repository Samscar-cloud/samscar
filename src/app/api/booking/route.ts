import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendSMS } from '@/lib/sms'
import { sendEmail } from '@/lib/email'
import { captureException } from '@/lib/sentry'
import { z } from 'zod'
import { rateLimit } from '@/lib/rateLimit'

const bookingSchema = z.object({
  serviceId: z.string(),
  vehicleId: z.string().optional(),
  specialId: z.string().optional(),
  date: z.string(),
  notes: z.string().optional(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
})

const RATE_LIMIT = 10
const RATE_LIMIT_WINDOW_SECONDS = 60

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.ip ?? 'unknown'
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request)
    const allowed = await rateLimit(`booking:${clientIp}`, RATE_LIMIT, RATE_LIMIT_WINDOW_SECONDS)
    if (!allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded, please try again later.' }, { status: 429 })
    }

    const csrfTokenHeader = request.headers.get('x-csrf-token')
    const csrfCookie = request.cookies.get('csrf-token')?.value

    if (!csrfTokenHeader || !csrfCookie || csrfTokenHeader !== csrfCookie) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
    }

    const session = await getServerSession(authOptions)
    const body = await request.json()
    const validatedData = bookingSchema.parse(body)
    const bookingDate = new Date(validatedData.date)

    if (Number.isNaN(bookingDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 })
    }

    if (bookingDate < new Date()) {
      return NextResponse.json({ error: 'Date must be in the future' }, { status: 400 })
    }

    const existingBooking = await prisma.booking.findFirst({
      where: {
        serviceId: validatedData.serviceId,
        date: bookingDate,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    })

    if (existingBooking) {
      return NextResponse.json({ error: 'Slot not available' }, { status: 400 })
    }

    let userId = session?.user?.id

    if (!userId) {
      const user = await prisma.user.upsert({
        where: { email: validatedData.email },
        update: {
          name: validatedData.name,
          phone: validatedData.phone,
        },
        create: {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
        },
      })
      userId = user.id
    }

    let vehicleId = validatedData.vehicleId
    if (vehicleId) {
      const vehicle = await prisma.vehicle.findFirst({
        where: { id: vehicleId, userId },
      })
      if (!vehicle) {
        return NextResponse.json({ error: 'Invalid vehicle selected' }, { status: 400 })
      }
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        serviceId: validatedData.serviceId,
        vehicleId,
        specialId: validatedData.specialId,
        date: new Date(validatedData.date),
        notes: validatedData.notes,
      },
    })

    if (validatedData.specialId) {      const special = await prisma.special.findUnique({
        where: { id: validatedData.specialId },
      });
      if (!special || (special.usageLimit && special.usedCount >= special.usageLimit)) {
        return NextResponse.json({ error: 'Promo code usage limit exceeded' }, { status: 400 });
      }      await prisma.special.update({
        where: { id: validatedData.specialId },
        data: { usedCount: { increment: 1 } },
      })
    }

    if (validatedData.phone) {
      await sendSMS(
        validatedData.phone,
        `Votre réservation est confirmée pour le ${new Date(validatedData.date).toLocaleDateString('fr-FR')}.`
      )
    }

    await sendEmail(
      validatedData.email,
      'Confirmation de réservation',
      `<h1>Réservation confirmée</h1><p>Votre rendez-vous est prévu pour le ${new Date(validatedData.date).toLocaleDateString('fr-FR')}.</p>`
    )

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Booking creation failed:', error)
    captureException(error, { route: '/api/booking', method: 'POST' })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
