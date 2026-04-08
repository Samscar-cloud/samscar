import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import { createUserToken } from '@/lib/userTokens'
import { rateLimit } from '@/lib/rateLimit'

const APP_URL = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const RATE_LIMIT = 5
const RATE_LIMIT_WINDOW_SECONDS = 60

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.ip ?? 'unknown'
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request)
  const allowed = await rateLimit(`forgot-password:${clientIp}`, RATE_LIMIT, RATE_LIMIT_WINDOW_SECONDS)
  if (!allowed) {
    return NextResponse.json({ error: 'Trop de tentatives. Réessayez plus tard.' }, { status: 429 })
  }

  const body = await request.json().catch(() => ({}))
  const email = String(body.email || '').trim().toLowerCase()

  if (!email) {
    return NextResponse.json({ error: 'Email requis' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return NextResponse.json({ ok: true })
  }

  const tokenRecord = await createUserToken(user.id, 'PASSWORD_RESET')
  const resetUrl = `${APP_URL}/auth/reset-password?token=${encodeURIComponent(tokenRecord.token)}`

  await sendEmail(
    user.email,
    'Réinitialisation du mot de passe',
    `<p>Bonjour,</p>
    <p>Pour réinitialiser votre mot de passe, cliquez sur le lien suivant :</p>
    <p><a href="${resetUrl}">Réinitialiser mon mot de passe</a></p>
    <p>Si vous n'avez pas demandé cette opération, ignorez cet email.</p>`
  )

  return NextResponse.json({ ok: true })
}
