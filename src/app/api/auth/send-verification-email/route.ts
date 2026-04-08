import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import { createUserToken } from '@/lib/userTokens'

const APP_URL = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const email = String(body.email || '').trim().toLowerCase()

  if (!email) {
    return NextResponse.json({ error: 'Email requis' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || user.emailVerified) {
    return NextResponse.json({ ok: true })
  }

  const tokenRecord = await createUserToken(user.id, 'EMAIL_VERIFICATION')
  const verificationUrl = `${APP_URL}/auth/verify-email?token=${encodeURIComponent(tokenRecord.token)}`

  await sendEmail(
    user.email,
    'Vérification de l’adresse e-mail',
    `<p>Bonjour,</p>
    <p>Pour vérifier votre adresse e-mail, cliquez sur le lien suivant :</p>
    <p><a href="${verificationUrl}">Vérifier mon e-mail</a></p>
    <p>Si vous n'avez pas demandé cette vérification, ignorez cet email.</p>`
  )

  return NextResponse.json({ ok: true })
}
