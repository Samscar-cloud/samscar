import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } from '@/lib/sms'

export async function GET() {
  const result: Record<string, any> = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    checks: {},
  }

  // DB check
  try {
    await prisma.$queryRaw`SELECT 1`
    result.checks.database = { ok: true }
  } catch (error) {
    result.checks.database = { ok: false, error: String(error) }
    result.status = 'error'
  }

  // Twilio config check
  if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER) {
    result.checks.twilio = { ok: true }
  } else {
    result.checks.twilio = { ok: false, error: 'Twilio env vars not configured' }
    result.status = 'error'
  }

  // Email config check
  const emailConfigured =
    Boolean(process.env.EMAIL_SERVER_HOST && process.env.EMAIL_SERVER_USER && process.env.EMAIL_SERVER_PASSWORD)
  if (emailConfigured) {
    result.checks.email = { ok: true }
  } else {
    result.checks.email = { ok: false, error: 'Email SMTP env vars not configured' }
    if (result.status !== 'error') result.status = 'warning'
  }

  return NextResponse.json(result)
}
