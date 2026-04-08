import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import PDFDocument from 'pdfkit'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: { user: true, service: true, vehicle: true },
  })

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  const doc = new PDFDocument({ size: 'A4', margin: 50 })

  const chunks: Buffer[] = []
  doc.on('data', (chunk) => chunks.push(chunk))
  doc.on('end', () => {})

  doc.fontSize(20).text('N° de commande', { align: 'right' })
  doc.moveDown(0.3)
  doc.fontSize(12).text(`ID: ${booking.id}`, { align: 'right' })
  doc.text(`Date: ${booking.createdAt.toLocaleString('fr-FR')}`, { align: 'right' })

  doc.moveDown(1)
  doc.fontSize(28).text('Auto Service', { align: 'left' })
  doc.fontSize(12).text('Garage Professionnel', { align: 'left' })
  doc.moveDown(1)

  doc.fontSize(14).text('Informations client', { underline: true })
  doc.fontSize(12).text(`Nom: ${booking.user.name ?? 'N/A'}`)
  doc.text(`Email: ${booking.user.email}`)
  doc.text(`Téléphone: ${booking.user.phone ?? 'N/A'}`)
  doc.moveDown(0.7)

  doc.fontSize(14).text('Détails de la réservation', { underline: true })
  doc.fontSize(12).text(`Service: ${booking.service?.name ?? 'N/A'}`)
  doc.text(`Date du rendez-vous: ${booking.date.toLocaleString('fr-FR')}`)
  doc.text(`Statut: ${booking.status}`)
  doc.text(`Véhicule: ${booking.vehicle ? `${booking.vehicle.make} ${booking.vehicle.model} (${booking.vehicle.year})` : 'N/A'}`)
  doc.text(`Notes: ${booking.notes ?? 'Aucune'}`)

  doc.moveDown(1)
  doc.fontSize(12).text("Merci de nous avoir choisi pour l’entretien de votre véhicule.", {
    align: 'left',
  })

  doc.end()

  const pdfBuffer = Buffer.concat(chunks)

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=booking-${booking.id}.pdf`,
    },
  })
}
